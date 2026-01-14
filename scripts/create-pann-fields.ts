import { db } from "../server/db";
import { fieldMetadataCache, formConfigurations, oauthTokens } from "../shared/schema";
import { eq } from "drizzle-orm";

const ZOHO_API_BASE = "https://www.zohoapis.com/crm/v8";

async function getAccessToken(): Promise<string> {
  const result = await db.select().from(oauthTokens).where(eq(oauthTokens.isActive, true)).limit(1);
  if (!result[0]?.accessToken) {
    throw new Error("No active Zoho access token found");
  }
  return result[0].accessToken;
}

async function getProfiles(accessToken: string): Promise<any[]> {
  const response = await fetch(`${ZOHO_API_BASE}/settings/profiles`, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
  });
  const data = await response.json();
  return data.profiles || [];
}

async function createField(accessToken: string, fieldData: any): Promise<boolean> {
  console.log(`Creating field: ${fieldData.api_name}`);
  
  const profiles = await getProfiles(accessToken);
  fieldData.profiles = profiles.map((p: any) => ({
    id: p.id,
    permission_type: "read_write"
  }));

  const response = await fetch(`${ZOHO_API_BASE}/settings/fields?module=Leads`, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fields: [fieldData] })
  });

  const result = await response.json();
  console.log(`Response for ${fieldData.api_name}:`, JSON.stringify(result, null, 2));
  
  if (result.fields?.[0]?.code === "SUCCESS") {
    console.log(`✅ Created field: ${fieldData.api_name}`);
    return true;
  } else if (result.fields?.[0]?.code === "DUPLICATE_DATA") {
    console.log(`⚠️ Field already exists: ${fieldData.api_name}`);
    return true;
  } else {
    console.log(`❌ Failed to create field: ${fieldData.api_name}`, result);
    return false;
  }
}

async function main() {
  console.log("Creating PANN-specific fields in Zoho CRM...\n");
  
  const accessToken = await getAccessToken();
  console.log("Got access token\n");

  const pannFields = [
    {
      api_name: "PANN_Topics_of_Interest",
      field_label: "PANN Topics of Interest",
      data_type: "text",
      length: 255
    },
    {
      api_name: "PANN_Membership_Consent",
      field_label: "PANN Membership Consent",
      data_type: "text",
      length: 255
    }
  ];

  let created = 0;
  for (const field of pannFields) {
    const success = await createField(accessToken, field);
    if (success) created++;
  }

  console.log(`\n${created}/${pannFields.length} fields processed`);

  console.log("\nRefreshing field metadata cache...");
  const cacheResponse = await fetch(`${ZOHO_API_BASE}/settings/fields?module=Leads`, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
  });
  const cacheData = await cacheResponse.json();
  
  if (cacheData.fields) {
    for (const field of cacheData.fields) {
      await db.insert(fieldMetadataCache)
        .values({
          zohoModule: "Leads",
          fieldApiName: field.api_name,
          fieldLabel: field.field_label,
          dataType: field.data_type,
          isRequired: field.system_mandatory || false,
          isCustomField: field.custom_field || false,
          maxLength: field.length || null,
          picklistValues: field.pick_list_values || null,
          fieldMetadata: field
        })
        .onConflictDoUpdate({
          target: [fieldMetadataCache.zohoModule, fieldMetadataCache.fieldApiName],
          set: {
            fieldLabel: field.field_label,
            dataType: field.data_type,
            isRequired: field.system_mandatory || false,
            isCustomField: field.custom_field || false,
            maxLength: field.length || null,
            picklistValues: field.pick_list_values || null,
            fieldMetadata: field,
            lastSynced: new Date()
          }
        });
    }
    console.log(`✅ Updated ${cacheData.fields.length} fields in cache`);
  }

  console.log("\nCreating strict form configurations...");
  
  const casConfig = {
    formName: "Excel Import - CAS Registration",
    zohoModule: "Leads",
    leadSource: "Excel Import - CAS Registration",
    autoCreateFields: false,
    strictMapping: true,
    fieldMappings: {
      email: "Email",
      fullName: "Last_Name",
      discipline: "discipline",
      subspecialty: "subspecialty",
      institution: "institution",
      institutionAddress: "institutionaddress",
      institutionPhone: "institutionphone",
      institutionFax: "institutionfax",
      wantsMembership: "wantsmembership",
      wantsCommunications: "CAS_Communications",
      wantsServicesMapInclusion: "Services_Map_Inclusion",
      servicesMapConsent: "servicesmapconsent"
    }
  };

  const pannConfig = {
    formName: "Excel Import - PANN Membership",
    zohoModule: "Leads",
    leadSource: "Excel Import - PANN Membership",
    autoCreateFields: false,
    strictMapping: true,
    fieldMappings: {
      email: "Email",
      fullName: "Last_Name",
      city: "City",
      phone: "Phone",
      discipline: "discipline",
      institution: "institution",
      pannRole: "PANN_Role",
      pannTopicsOfInterest: "PANN_Topics_of_Interest",
      pannPreferredDays: "PANN_Preferred_Days",
      pannPreferredTimes: "PANN_Preferred_Times",
      pannMembershipConsent: "PANN_Membership_Consent"
    }
  };

  for (const config of [casConfig, pannConfig]) {
    await db.insert(formConfigurations)
      .values(config)
      .onConflictDoUpdate({
        target: formConfigurations.formName,
        set: {
          zohoModule: config.zohoModule,
          leadSource: config.leadSource,
          autoCreateFields: config.autoCreateFields,
          strictMapping: config.strictMapping,
          fieldMappings: config.fieldMappings,
          updatedAt: new Date()
        }
      });
    console.log(`✅ Created/updated config: ${config.formName}`);
  }

  console.log("\n✅ Setup complete!");
  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
