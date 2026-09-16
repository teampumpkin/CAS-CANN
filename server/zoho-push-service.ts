import { zohoCRMService } from './zoho-crm-service';

/**
 * Shared Zoho CRM push pipeline
 * Single source of truth for pushing a form submission to Zoho CRM:
 * field mapping dispatch, submission-timestamp injection, layout lookup,
 * duplicate guard (search-by-email) and the update-vs-create merge rules.
 *
 * Used by BOTH:
 *   • the synchronous CRM-first path in POST /api/cas-cann-registration
 *   • the background zoho-sync-worker (backup/retry processor)
 * so the two paths can never diverge.
 */

export interface ZohoPushInput {
  formData: any;
  formName: string;
  zohoModule: string; // e.g. "Leads"
  /** When the user actually submitted — there may be no DB row yet on the synchronous path */
  submittedAt: Date;
  /** Label used in log lines, e.g. "submission #42" or "live request" */
  logLabel?: string;
}

export interface ZohoPushResult {
  zohoCrmId: string;
  action: 'created' | 'updated';
}

export async function pushToZohoCRM(input: ZohoPushInput): Promise<ZohoPushResult> {
  const { formName, zohoModule } = input;
  const label = input.logLabel || formName;

  // Inject the submission timestamp so Form_Submission_Date in Zoho reflects when the user
  // actually submitted, not when this push attempt ran (critical for rescued/retried records).
  const formData = {
    ...(input.formData as any),
    _submissionCreatedAt: input.submittedAt.toISOString(),
  } as any;
  console.log(`[Zoho Push DEBUG] Form data for ${label}:`, JSON.stringify(formData, null, 2));

  // Get form configuration to check for layout
  const { formConfigEngine } = await import('./form-config-engine');
  const formConfig = await formConfigEngine.getFormConfiguration(formName);
  const layoutId = (formConfig as any)?.zohoLayoutId || undefined;

  if (layoutId) {
    console.log(`[Zoho Push] Using layout ID: ${layoutId} (${(formConfig as any)?.zohoLayoutName || 'unknown'})`);
  }

  const zohoData = await buildZohoDataAsync(formData, formName, zohoModule);
  console.log(`[Zoho Push DEBUG] Zoho data for ${label}:`, JSON.stringify(zohoData, null, 2));

  // ─── DUPLICATE GUARD ────────────────────────────────────────────────
  // Look up an existing Lead/Contact by email FIRST. If found, update it
  // (with merge rules) instead of creating a duplicate. Skip lookup only
  // if email is missing.
  const submissionEmail = (zohoData.Email || formData.email || '').trim();
  let existingRecord: any = null;
  if (submissionEmail) {
    try {
      existingRecord = await zohoCRMService.searchRecordByEmail(zohoModule, submissionEmail);
    } catch (lookupErr) {
      // If the lookup itself fails, fall through to create — the worst case is
      // a duplicate that admin tools can clean up. We must not block the sync.
      console.warn(`[Zoho Push] Email lookup failed for ${label} (${submissionEmail}); falling back to create:`, lookupErr instanceof Error ? lookupErr.message : lookupErr);
    }
  }

  let zohoRecord: any;
  let actionTaken: 'created' | 'updated';

  if (existingRecord && existingRecord.id) {
    // ── UPDATE PATH ─────────────────────────────────────────────────
    // Merge with upgrade-only rules:
    //   • CAS_Member / CANN_Member: true wins, never downgrade to false
    //   • Form_Submission_Date: always update to latest
    //   • Other fields: latest non-empty wins (existing values preserved if new is blank)
    const merged: any = { ...zohoData };

    // Upgrade-only membership flags
    const wasCAS = existingRecord.CAS_Member === true;
    const wasCANN = existingRecord.CANN_Member === true;
    if (wasCAS) merged.CAS_Member = true;
    if (wasCANN) merged.CANN_Member = true;

    // Drop blank/null values from the new payload so we don't wipe existing data
    for (const key of Object.keys(merged)) {
      const v = merged[key];
      if (v === null || v === undefined || v === '') {
        delete merged[key];
      }
    }
    // Layout cannot be changed via update — never include it
    delete merged.Layout;

    console.log(`[Zoho Push] 🔄 Email ${submissionEmail} already exists as ${zohoModule} record ${existingRecord.id} — updating instead of creating duplicate`);
    zohoRecord = await zohoCRMService.updateRecord(zohoModule, existingRecord.id, merged);
    // updateRecord returns Zoho's success envelope which may not contain the id field
    if (!zohoRecord?.id) zohoRecord = { ...zohoRecord, id: existingRecord.id };
    actionTaken = 'updated';
  } else {
    // ── CREATE PATH ─────────────────────────────────────────────────
    zohoRecord = await zohoCRMService.createRecord(zohoModule, zohoData, layoutId);
    actionTaken = 'created';
  }

  return { zohoCrmId: zohoRecord.id, action: actionTaken };
}

/**
 * Build Zoho CRM data from form submission using smart field mapping
 * Automatically matches form fields to existing Zoho fields without creating new ones
 */
async function buildZohoDataAsync(formData: any, formName: string, zohoModule: string): Promise<any> {
  try {
    // First check if there's a form configuration
    const { formConfigEngine } = await import('./form-config-engine');
    const formConfig = await formConfigEngine.getFormConfiguration(formName);

    const hasSubmitFields = formConfig?.submitFields && Object.keys(formConfig.submitFields as object).length > 0;
    const hasFieldMappings = formConfig?.fieldMappings && Object.keys(formConfig.fieldMappings as object).length > 0;

    let zohoData: any;

    // KNOWN_CENTRALIZED_FORMS: forms whose every field is explicitly handled by
    // buildCentralizedZohoData below. Skip smart-mapper entirely for these to
    // avoid fuzzy nonsense (e.g. wantsMembership → Number_Of_Chats at 80% similarity).
    const KNOWN_CENTRALIZED_FORMS = new Set([
      'CAS/CANN Registration Form', // current /join-cas form name (sent by client)
      'CAS / CANN Registration',    // alternate spacing — kept for safety
      'CAS Registration',           // legacy — kept for in-flight queued submissions
      'CAS & CANN Registration',    // legacy — kept for in-flight queued submissions
    ]);

    if (KNOWN_CENTRALIZED_FORMS.has(formName)) {
      console.log(`[Zoho Push] Using centralized-only mapping for "${formName}" (smart-mapper bypassed)`);
      zohoData = {};
    } else if (formConfig && (hasSubmitFields || hasFieldMappings)) {
      // Use config-based mapping
      console.log(`[Zoho Push] Using config-based mapping for "${formName}"`);
      const result = await zohoCRMService.formatFieldDataForZohoWithConfig(formData, formConfig);
      zohoData = result.zohoData;
    } else {
      // Use smart auto-mapping for unconfigured forms
      console.log(`[Zoho Push] Using smart auto-mapping for "${formName}"`);
      const { smartFieldMapper } = await import('./smart-field-mapper');
      const result = await smartFieldMapper.mapFormDataToZoho(formData, formName, zohoModule);

      console.log(`[Zoho Push] Smart mapping: ${result.mappedFields.length} mapped, ${result.unmappedFields.length} excluded`);
      zohoData = result.zohoData;
    }

    // POST-PROCESSING: Apply centralized business rules on top of smart/config mapping
    // This ensures CANN→CAS dependency, Record_Type, consent field completeness,
    // and Lead_Source differentiation are ALWAYS applied regardless of mapping path
    const { buildCentralizedZohoData } = await import('./zoho-crm-service');
    // Inject the original submission's created_at so Form_Submission_Date reflects when
    // the user actually submitted the form, not when this rescue/sync ran.
    const formDataWithTimestamp = {
      ...formData,
      _submissionCreatedAt: (formData as any)._submissionCreatedAt
        || (formData as any).submittedAt
        || (formData as any).created_at,
    };
    const centralResult = buildCentralizedZohoData({
      formData: formDataWithTimestamp,
      formName,
      isExcelImport: formName.includes('Excel'),
    });

    // Merge: centralized rules fill in any fields the smart/config mapper missed
    // Smart mapper's field values take precedence for fields it DID map
    const mergedData = { ...centralResult.zohoData, ...zohoData };

    // ALWAYS override these business-rule fields from centralized mapper
    // These must come from the centralized mapper to enforce dependencies and correct types
    if (centralResult.zohoData.CAS_Member !== undefined) mergedData.CAS_Member = centralResult.zohoData.CAS_Member;
    if (centralResult.zohoData.CANN_Member !== undefined) mergedData.CANN_Member = centralResult.zohoData.CANN_Member;
    if (centralResult.zohoData.Record_Type !== undefined) mergedData.Record_Type = centralResult.zohoData.Record_Type;
    if (centralResult.zohoData.Lead_Source !== undefined) mergedData.Lead_Source = centralResult.zohoData.Lead_Source;
    // Consent picklist fields: override even when value is "No" (check for undefined, not truthy)
    // This ensures picklist strings always win over smart mapper's boolean values
    if (centralResult.zohoData.CAS_Communications !== undefined) mergedData.CAS_Communications = centralResult.zohoData.CAS_Communications;
    if (centralResult.zohoData.CANN_Communications !== undefined) mergedData.CANN_Communications = centralResult.zohoData.CANN_Communications;
    if (centralResult.zohoData.Services_Map_Inclusion !== undefined) mergedData.Services_Map_Inclusion = centralResult.zohoData.Services_Map_Inclusion;
    // Form_Submission_Date must always reflect the original submission timestamp (from local DB),
    // never be overridden by smart-mapper output which doesn't know about it.
    if (centralResult.zohoData.Form_Submission_Date !== undefined) mergedData.Form_Submission_Date = centralResult.zohoData.Form_Submission_Date;

    console.log(`[Zoho Push] Post-processing rules applied: ${centralResult.appliedRules.join('; ')}`);

    return mergedData;
  } catch (error) {
    console.error(`[Zoho Push] Smart mapping failed, using fallback:`, error);
    return buildZohoDataFallback(formData, formName);
  }
}

/**
 * Fallback Zoho data builder for when smart mapping fails
 * Uses centralized mapping utility to ensure business rules are enforced
 */
async function buildZohoDataFallback(formData: any, formName: string): Promise<any> {
  const { buildCentralizedZohoData } = await import('./zoho-crm-service');
  const result = buildCentralizedZohoData({
    formData,
    formName,
    isExcelImport: formName.includes('Excel'),
  });

  console.log(`[Zoho Push] Centralized fallback mapping applied. Rules: ${result.appliedRules.join('; ')}`);
  return result.zohoData;
}
