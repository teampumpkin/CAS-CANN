/**
 * Creates the services-map approval field in Zoho CRM (Leads module).
 *
 *   DRY RUN (default — reads only, changes nothing):
 *     npx tsx --env-file-if-exists=.env scripts/create-map-approval-field.ts
 *
 *   APPLY (writes to the live CRM):
 *     npx tsx --env-file-if-exists=.env scripts/create-map-approval-field.ts --apply
 *
 * WRITES TO THE LIVE CRM when --apply is passed. Creating a custom field is a
 * schema change to production Zoho: it consumes one of the module's custom-field
 * slots, and removing it later deletes any data stored in it. Run the dry run
 * first and read the plan.
 *
 * Field design — see docs/SERVICES_MAP_AND_MEMBER_ACCESS_PLAN_2026-08-07.md §5 W1.
 *
 * Why a picklist and not a boolean:
 *   A boolean has two states, but the workflow has three — never reviewed,
 *   approved, rejected. With a boolean you cannot distinguish "an admin looked
 *   at this and said no" from "nobody has looked yet", so rejected records would
 *   reappear in the pending queue forever. The existing Services_Map_Inclusion
 *   field is also a picklist, so this matches the module's conventions.
 */

import { zohoCRMService } from "../server/zoho-crm-service";
import type { ZohoFieldCreateRequest } from "../server/zoho-crm-service";

const MODULE = "Leads";

const FIELD: ZohoFieldCreateRequest = {
  api_name: "Map_Approved",
  field_label: "Map Approved",
  data_type: "picklist",
  pick_list_values: [
    { display_value: "Pending", actual_value: "Pending" },
    { display_value: "Approved", actual_value: "Approved" },
    { display_value: "Rejected", actual_value: "Rejected" },
  ],
};

async function main() {
  const apply = process.argv.includes("--apply");

  console.log("─".repeat(64));
  console.log(apply ? "MODE: APPLY — will write to the live CRM" : "MODE: DRY RUN — reads only");
  console.log("─".repeat(64));

  // Read current schema first so we never create a duplicate.
  const existing = await zohoCRMService.getModuleFields(MODULE);
  console.log(`\n${MODULE} currently has ${existing.length} fields.`);

  const already = existing.find((f) => f.api_name === FIELD.api_name);
  if (already) {
    console.log(`\n✅ ${FIELD.api_name} already exists (${already.data_type}) — nothing to do.`);
    const values = (already as any).pick_list_values?.map((v: any) => v.actual_value) ?? [];
    if (values.length) console.log(`   values: ${values.join(" | ")}`);
    process.exit(0);
  }

  console.log("\nPlanned field:");
  console.log(`  module      ${MODULE}`);
  console.log(`  api_name    ${FIELD.api_name}`);
  console.log(`  label       ${FIELD.field_label}`);
  console.log(`  type        ${FIELD.data_type}`);
  console.log(`  values      ${FIELD.pick_list_values!.map((v) => v.actual_value).join(" | ")}`);
  console.log(`  profiles    all profiles, read_write (added automatically)`);

  if (!apply) {
    console.log("\nDry run complete. Nothing was written.");
    console.log("Re-run with --apply to create the field.");
    process.exit(0);
  }

  console.log(`\nCreating ${FIELD.api_name} in ${MODULE}…`);
  try {
    const created = await zohoCRMService.createCustomField(MODULE, FIELD);
    console.log(`✅ Created ${FIELD.api_name} (id ${(created as any)?.id ?? "unknown"})`);
    console.log("\nNext: refresh the local field cache so the app sees it —");
    console.log("  restart the server, or POST /api/admin/zoho/refresh-field-cache");
  } catch (error: any) {
    const msg = error?.message ?? String(error);
    if (/already exists|DUPLICATE/i.test(msg)) {
      console.log(`⏭️  ${FIELD.api_name} already exists — nothing to do.`);
      process.exit(0);
    }
    console.error(`❌ Failed to create ${FIELD.api_name}:`, msg);
    process.exit(1);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Script failed:", error?.message ?? error);
  process.exit(1);
});
