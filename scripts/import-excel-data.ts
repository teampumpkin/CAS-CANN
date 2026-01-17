import { db } from "../server/db";
import { formSubmissions } from "../shared/schema";
import * as fs from "fs";

interface CASRecord {
  "ID": number;
  "Start time": number;
  "Completion time": number;
  "Email"?: string;
  "I would like to become a member of the Canadian Amyloidosis Society (CAS)"?: string;
  "Full name (first and last)"?: string;
  "Email address"?: string;
  "Discipline (physician, nursing, genetic counsellor, etc)"?: string;
  "Sub-specialty area of focus (cardiology, hematology, neurology, etc)"?: string;
  "Center or Clinic Name/Institution"?: string;
  "I would like to receive communication from the Canadian Amyloidosis Society (email, newsletters)"?: string;
  "I would like my center/clinic to be included in the Canadian Amyloidosis Services Map "?: string;
  "Center or Clinic Name/Institution2"?: string;
  "Center or Clinic Address"?: string;
  "Center or Clinic Phone Number\r\n"?: string;
  "Center or Clinic Fax Number "?: string;
  "I may be contacted, if needed, by the CAS to provide information for the Canadian Amyloidosis Services Map "?: string;
  "Center or Clinic Name/Institution3"?: string;
}

interface PANNRecord {
  "Last Name "?: string;
  "SEPT"?: number;
  "Email Address (will be used for program communication only unless previous consent has been given) "?: string;
  "City"?: string;
  "Please indicate if you are interest in joining the Prairie Amyloidosis Nurses Network. "?: string;
  "Best phone number for contacting you (will be used only by Amyloidosis Program of Calgary) "?: string;
  "Professional Designation "?: string;
  "Health Authority and Institution "?: string;
  "Terms that would describe your role (click all that apply) "?: string;
  "Select topics of interest"?: string;
  "Select the days of the week that would work best for you for a virtual meeting 30-50mins "?: string;
  "Select the times of day that work best for you. "?: string;
}

function mapCASRecord(record: CASRecord): Record<string, any> {
  return {
    fullName: record["Full name (first and last)"] || "",
    email: record["Email address"] || record["Email"] || "",
    discipline: record["Discipline (physician, nursing, genetic counsellor, etc)"] || "",
    subspecialty: record["Sub-specialty area of focus (cardiology, hematology, neurology, etc)"] || "",
    institution: record["Center or Clinic Name/Institution"] || record["Center or Clinic Name/Institution2"] || record["Center or Clinic Name/Institution3"] || "",
    institutionAddress: record["Center or Clinic Address"] || "",
    institutionPhone: record["Center or Clinic Phone Number\r\n"] || "",
    institutionFax: record["Center or Clinic Fax Number "] || "",
    wantsMembership: record["I would like to become a member of the Canadian Amyloidosis Society (CAS)"] || "",
    wantsCommunications: record["I would like to receive communication from the Canadian Amyloidosis Society (email, newsletters)"] || "",
    wantsServicesMapInclusion: record["I would like my center/clinic to be included in the Canadian Amyloidosis Services Map "] || "",
    servicesMapConsent: record["I may be contacted, if needed, by the CAS to provide information for the Canadian Amyloidosis Services Map "] || "",
    originalExcelId: record["ID"],
    importSource: "Excel Import - CAS Registration"
  };
}

function mapPANNRecord(record: any): Record<string, any> {
  // Find email key dynamically (handles whitespace variations)
  const emailKey = Object.keys(record).find(k => k.toLowerCase().includes("email address"));
  const lastNameKey = Object.keys(record).find(k => k.toLowerCase().includes("last name"));
  const cityKey = Object.keys(record).find(k => k.toLowerCase() === "city");
  const phoneKey = Object.keys(record).find(k => k.toLowerCase().includes("phone"));
  const designationKey = Object.keys(record).find(k => k.toLowerCase().includes("professional designation"));
  const institutionKey = Object.keys(record).find(k => k.toLowerCase().includes("institution"));
  const roleKey = Object.keys(record).find(k => k.toLowerCase().includes("role"));
  const topicsKey = Object.keys(record).find(k => k.toLowerCase().includes("topics"));
  const daysKey = Object.keys(record).find(k => k.toLowerCase().includes("days"));
  const timesKey = Object.keys(record).find(k => k.toLowerCase().includes("times"));
  const consentKey = Object.keys(record).find(k => k.toLowerCase().includes("prairie"));

  return {
    fullName: lastNameKey ? record[lastNameKey] : "",
    email: emailKey ? record[emailKey] : "",
    city: cityKey ? record[cityKey] : "",
    phone: phoneKey ? record[phoneKey] : "",
    discipline: designationKey ? record[designationKey] : "",
    institution: institutionKey ? record[institutionKey] : "",
    pannRole: roleKey ? record[roleKey] : "",
    pannTopicsOfInterest: topicsKey ? record[topicsKey] : "",
    pannPreferredDays: daysKey ? record[daysKey] : "",
    pannPreferredTimes: timesKey ? record[timesKey] : "",
    pannMembershipConsent: consentKey ? record[consentKey] : "",
    importSource: "Excel Import - PANN Membership"
  };
}

async function importData() {
  console.log("Starting Excel data import...");

  // Read JSON files
  const casData: CASRecord[] = JSON.parse(fs.readFileSync("/tmp/cas_data.json", "utf-8"));
  const pannData: PANNRecord[] = JSON.parse(fs.readFileSync("/tmp/pann_data.json", "utf-8"));

  console.log(`Found ${casData.length} CAS records and ${pannData.length} PANN records`);

  let casInserted = 0;
  let pannInserted = 0;
  let skipped = 0;

  // Import CAS records
  console.log("\nImporting CAS records...");
  for (const record of casData) {
    const mappedData = mapCASRecord(record);
    
    // Skip if no email
    if (!mappedData.email) {
      console.log(`Skipping CAS record ${record["ID"]} - no email`);
      skipped++;
      continue;
    }

    try {
      await db.insert(formSubmissions).values({
        formName: "Excel Import - CAS Registration",
        submissionData: mappedData,
        sourceForm: "excel-import",
        zohoModule: "Leads",
        processingStatus: "pending",
        syncStatus: "pending",
        retryCount: 0,
      });
      casInserted++;
      if (casInserted % 20 === 0) {
        console.log(`  Inserted ${casInserted} CAS records...`);
      }
    } catch (error) {
      console.error(`Error inserting CAS record ${record["ID"]}:`, error);
    }
  }
  console.log(`✅ Inserted ${casInserted} CAS records`);

  // Import PANN records
  console.log("\nImporting PANN records...");
  for (const record of pannData) {
    const mappedData = mapPANNRecord(record);
    
    // Skip if no email
    if (!mappedData.email) {
      console.log(`Skipping PANN record - no email`);
      skipped++;
      continue;
    }

    try {
      await db.insert(formSubmissions).values({
        formName: "Excel Import - PANN Membership",
        submissionData: mappedData,
        sourceForm: "excel-import",
        zohoModule: "Leads",
        processingStatus: "pending",
        syncStatus: "pending",
        retryCount: 0,
      });
      pannInserted++;
    } catch (error) {
      console.error(`Error inserting PANN record:`, error);
    }
  }
  console.log(`✅ Inserted ${pannInserted} PANN records`);

  console.log("\n========================================");
  console.log(`Total CAS inserted: ${casInserted}`);
  console.log(`Total PANN inserted: ${pannInserted}`);
  console.log(`Total skipped (no email): ${skipped}`);
  console.log(`Total pending for sync: ${casInserted + pannInserted}`);
  console.log("========================================");
  console.log("\nThe background sync worker will now process these records.");

  process.exit(0);
}

importData().catch((error) => {
  console.error("Import failed:", error);
  process.exit(1);
});
