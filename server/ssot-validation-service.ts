import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { zohoCRMService } from './zoho-crm-service';

const SSOT_FILE_PATH = path.join(
  process.cwd(),
  'attached_assets',
  '2026_04_CAS_CANN_Members_SSOTv6_FINAL_1776935708133.xlsx'
);

const REPORT_OUTPUT_PATH = path.join(process.cwd(), 'ssot-validation-report.json');
const REPORT_TEXT_PATH = path.join(process.cwd(), 'ssot-validation-report.txt');

const CRM_FIELDS = [
  'id',
  'First_Name',
  'Last_Name',
  'Email',
  'Company',
  'Industry',
  'CAS_Member',
  'CANN_Member',
  'Record_Type',
  'CAS_Communications',
  'CANN_Communications',
  'Services_Map_Inclusion',
  'Professional_Designation',
  'Institution_Name',
  'subspecialty',
  'Amyloidosis_Type',
  'Source_Form',
].join(',');

export interface SSOTRow {
  zoho_lead_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  institution?: string;
  discipline?: string;
  subspecialty?: string;
  [key: string]: any;
}

export interface FieldDiscrepancy {
  field: string;
  ssotValue: string | null;
  crmValue: string | null;
}

export interface MatchedRecord {
  zohoId: string;
  ssotRow: SSOTRow;
  crmRecord: Record<string, any>;
  discrepancies: FieldDiscrepancy[];
}

export interface RemovalCandidate {
  zohoId: string;
  crmRecord: Record<string, any>;
  consentDataAtRisk: {
    CAS_Communications: string | null;
    CANN_Communications: string | null;
    Services_Map_Inclusion: string | null;
    hasConsentData: boolean;
  };
}

export interface NewRecordCandidate {
  ssotRow: SSOTRow;
  /** true when the row had an email address and email-based matching was attempted (but still found no CRM record) */
  emailMatchAttempted: boolean;
  missingEmail: boolean;
  rowIndex: number;
}

export interface ValidationReport {
  generatedAt: string;
  summary: {
    crmTotalRecords: number;
    ssotTotalRows: number;
    matchedByZohoId: number;
    matchedByEmail: number;
    removalCandidates: number;
    removalCandidatesWithConsentData: number;
    newRecordCandidates: number;
    newRecordsMissingEmail: number;
    recordsWithDiscrepancies: number;
    totalFieldDiscrepancies: number;
  };
  removalCandidates: RemovalCandidate[];
  newRecordCandidates: NewRecordCandidate[];
  matchedWithDiscrepancies: MatchedRecord[];
  matchedClean: Array<{ zohoId: string; name: string; email: string }>;
}

function normalize(val: any): string {
  if (val === null || val === undefined) return '';
  return String(val).trim();
}

function parseSSOTFile(): SSOTRow[] {
  if (!fs.existsSync(SSOT_FILE_PATH)) {
    throw new Error(`SSOT file not found at: ${SSOT_FILE_PATH}`);
  }

  const workbook = XLSX.readFile(SSOT_FILE_PATH);

  const sheetName = workbook.SheetNames.find(
    (n) => n.toLowerCase() === 'ssot'
  ) || workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error('No sheets found in the SSOT Excel file');
  }

  console.log(`[SSOT Validation] Parsing sheet: "${sheetName}" from ${path.basename(SSOT_FILE_PATH)}`);

  const worksheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' }) as Record<string, any>[];

  console.log(`[SSOT Validation] Parsed ${rawRows.length} rows from SSOT sheet`);
  if (rawRows.length > 0) {
    console.log(`[SSOT Validation] SSOT columns: ${Object.keys(rawRows[0]).join(', ')}`);
  }

  return rawRows.map((row) => {
    const normalizedRow: SSOTRow = {};
    for (const [key, value] of Object.entries(row)) {
      normalizedRow[key.trim()] = value;
    }
    return normalizedRow;
  });
}

function detectSSOTColumns(rows: SSOTRow[]): {
  zohoIdCol: string | null;
  firstNameCol: string | null;
  lastNameCol: string | null;
  emailCol: string | null;
  institutionCol: string | null;
  disciplineCol: string | null;
  subspecialtyCol: string | null;
} {
  if (rows.length === 0) return {
    zohoIdCol: null, firstNameCol: null, lastNameCol: null,
    emailCol: null, institutionCol: null, disciplineCol: null, subspecialtyCol: null
  };

  const cols = Object.keys(rows[0]).map((k) => k.trim());

  const find = (...candidates: string[]) => {
    for (const c of candidates) {
      const match = cols.find((col) => col.toLowerCase() === c.toLowerCase());
      if (match) return match;
    }
    const partialMatch = (partial: string) =>
      cols.find((col) => col.toLowerCase().includes(partial.toLowerCase()));
    for (const c of candidates) {
      const found = partialMatch(c);
      if (found) return found;
    }
    return null;
  };

  return {
    zohoIdCol: find('zoho_lead_id', 'zoho id', 'zoho_id', 'lead_id', 'zoho lead id', 'id'),
    firstNameCol: find('first_name', 'firstname', 'first name'),
    lastNameCol: find('last_name', 'lastname', 'last name'),
    emailCol: find('email', 'email_address', 'emailaddress'),
    institutionCol: find('institution', 'institution_name', 'company', 'organization', 'centre'),
    disciplineCol: find('discipline', 'professional_designation', 'designation'),
    subspecialtyCol: find('subspecialty', 'sub_specialty', 'subspecialization'),
  };
}

async function fetchAllCRMLeads(): Promise<Record<string, any>[]> {
  console.log('[SSOT Validation] Fetching all CRM Leads...');
  const allLeads: Record<string, any>[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 20) {
    const batch = await zohoCRMService.getRecords('Leads', {
      page,
      per_page: 200,
      fields: CRM_FIELDS,
    });

    if (batch && batch.length > 0) {
      allLeads.push(...batch);
      console.log(`[SSOT Validation] Fetched page ${page}: ${batch.length} leads (total so far: ${allLeads.length})`);
      page++;
      hasMore = batch.length === 200;
    } else {
      hasMore = false;
    }
  }

  console.log(`[SSOT Validation] Total CRM Leads fetched: ${allLeads.length}`);
  return allLeads;
}

function compareField(
  fieldLabel: string,
  ssotVal: any,
  crmVal: any
): FieldDiscrepancy | null {
  const s = normalize(ssotVal);
  const c = normalize(crmVal);
  if (s === '' && c === '') return null;
  if (s.toLowerCase() === c.toLowerCase()) return null;
  return { field: fieldLabel, ssotValue: s || null, crmValue: c || null };
}

export async function runSSOTValidation(): Promise<ValidationReport> {
  console.log('[SSOT Validation] Starting CRM vs SSOT validation...');

  const ssotRows = parseSSOTFile();
  const colMap = detectSSOTColumns(ssotRows);
  console.log('[SSOT Validation] Detected columns:', colMap);

  const crmLeads = await fetchAllCRMLeads();

  const crmById: Map<string, Record<string, any>> = new Map();
  const crmByEmail: Map<string, Record<string, any>> = new Map();

  for (const lead of crmLeads) {
    if (lead.id) {
      crmById.set(String(lead.id).trim(), lead);
    }
    if (lead.Email) {
      crmByEmail.set(String(lead.Email).trim().toLowerCase(), lead);
    }
  }

  const matchedZohoIds = new Set<string>();
  const matchedCRMIds = new Set<string>();

  const matchedByZohoId: MatchedRecord[] = [];
  const matchedByEmail: MatchedRecord[] = [];
  const newRecordCandidates: NewRecordCandidate[] = [];

  for (let i = 0; i < ssotRows.length; i++) {
    const row = ssotRows[i];

    const rawZohoId = colMap.zohoIdCol ? normalize(row[colMap.zohoIdCol]) : '';
    // Strip "zcrm_" prefix if present so it matches the plain CRM record id
    const zohoId = rawZohoId.startsWith('zcrm_') ? rawZohoId.slice(5) : rawZohoId;
    const email = colMap.emailCol ? normalize(row[colMap.emailCol]) : '';
    const firstName = colMap.firstNameCol ? normalize(row[colMap.firstNameCol]) : '';
    const lastName = colMap.lastNameCol ? normalize(row[colMap.lastNameCol]) : '';
    const institution = colMap.institutionCol ? normalize(row[colMap.institutionCol]) : '';
    const discipline = colMap.disciplineCol ? normalize(row[colMap.disciplineCol]) : '';
    const subspecialty = colMap.subspecialtyCol ? normalize(row[colMap.subspecialtyCol]) : '';

    let crmRecord: Record<string, any> | undefined;
    let matchMethod: 'zoho_id' | 'email' | 'none' = 'none';

    if (zohoId) {
      crmRecord = crmById.get(zohoId);
      if (crmRecord) {
        matchMethod = 'zoho_id';
        matchedZohoIds.add(zohoId);
        matchedCRMIds.add(crmRecord.id);
      }
    }

    if (!crmRecord && email) {
      crmRecord = crmByEmail.get(email.toLowerCase());
      if (crmRecord) {
        matchMethod = 'email';
        matchedZohoIds.add(String(crmRecord.id));
        matchedCRMIds.add(crmRecord.id);
      }
    }

    if (!crmRecord) {
      newRecordCandidates.push({
        ssotRow: {
          ...row,
          first_name: firstName,
          last_name: lastName,
          email: email || undefined,
          institution: institution || undefined,
          discipline: discipline || undefined,
          subspecialty: subspecialty || undefined,
        },
        // email was present and we tried it against the CRM email index, but still no match
        emailMatchAttempted: !!email,
        missingEmail: !email,
        rowIndex: i + 2,
      });
      continue;
    }

    const discrepancies: FieldDiscrepancy[] = [];

    const d = (label: string, ssotVal: any, crmVal: any) => {
      const diff = compareField(label, ssotVal, crmVal);
      if (diff) discrepancies.push(diff);
    };

    d('first_name', firstName, crmRecord.First_Name);
    d('last_name', lastName, crmRecord.Last_Name);
    d('email', email, crmRecord.Email);
    d('institution', institution, crmRecord.Institution_Name || crmRecord.Company);
    d('discipline', discipline, crmRecord.Professional_Designation);
    d('subspecialty', subspecialty, crmRecord.subspecialty);

    const matched: MatchedRecord = {
      zohoId: crmRecord.id,
      ssotRow: {
        zoho_lead_id: rawZohoId || undefined,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
        email: email || undefined,
        institution: institution || undefined,
        discipline: discipline || undefined,
        subspecialty: subspecialty || undefined,
      },
      crmRecord,
      discrepancies,
    };

    if (matchMethod === 'zoho_id') {
      matchedByZohoId.push(matched);
    } else {
      matchedByEmail.push(matched);
    }
  }

  const removalCandidates: RemovalCandidate[] = [];
  for (const lead of crmLeads) {
    if (!matchedCRMIds.has(lead.id)) {
      const casCom = normalize(lead.CAS_Communications);
      const cannCom = normalize(lead.CANN_Communications);
      const svcMap = normalize(lead.Services_Map_Inclusion);
      const hasConsentData =
        (casCom !== '' && casCom.toLowerCase() !== 'no') ||
        (cannCom !== '' && cannCom.toLowerCase() !== 'no') ||
        (svcMap !== '' && svcMap.toLowerCase() !== 'no');

      removalCandidates.push({
        zohoId: lead.id,
        crmRecord: lead,
        consentDataAtRisk: {
          CAS_Communications: casCom || null,
          CANN_Communications: cannCom || null,
          Services_Map_Inclusion: svcMap || null,
          hasConsentData,
        },
      });
    }
  }

  const allMatched = [...matchedByZohoId, ...matchedByEmail];
  const matchedWithDiscrepancies = allMatched.filter((m) => m.discrepancies.length > 0);
  const matchedClean = allMatched
    .filter((m) => m.discrepancies.length === 0)
    .map((m) => ({
      zohoId: m.zohoId,
      name: `${normalize(m.crmRecord.First_Name)} ${normalize(m.crmRecord.Last_Name)}`.trim(),
      email: normalize(m.crmRecord.Email),
    }));

  const totalFieldDiscrepancies = matchedWithDiscrepancies.reduce(
    (sum, m) => sum + m.discrepancies.length,
    0
  );
  const removalWithConsent = removalCandidates.filter(
    (r) => r.consentDataAtRisk.hasConsentData
  ).length;
  const missingEmailCount = newRecordCandidates.filter((n) => n.missingEmail).length;

  const report: ValidationReport = {
    generatedAt: new Date().toISOString(),
    summary: {
      crmTotalRecords: crmLeads.length,
      ssotTotalRows: ssotRows.length,
      matchedByZohoId: matchedByZohoId.length,
      matchedByEmail: matchedByEmail.length,
      removalCandidates: removalCandidates.length,
      removalCandidatesWithConsentData: removalWithConsent,
      newRecordCandidates: newRecordCandidates.length,
      newRecordsMissingEmail: missingEmailCount,
      recordsWithDiscrepancies: matchedWithDiscrepancies.length,
      totalFieldDiscrepancies,
    },
    removalCandidates,
    newRecordCandidates,
    matchedWithDiscrepancies,
    matchedClean,
  };

  try {
    fs.writeFileSync(REPORT_OUTPUT_PATH, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`[SSOT Validation] JSON report saved to: ${REPORT_OUTPUT_PATH}`);
  } catch (err) {
    console.error('[SSOT Validation] Failed to save report JSON:', err);
  }

  try {
    const textSummary = buildHumanReadableSummary(report);
    fs.writeFileSync(REPORT_TEXT_PATH, textSummary, 'utf-8');
    console.log(`[SSOT Validation] Text summary saved to: ${REPORT_TEXT_PATH}`);
  } catch (err) {
    console.error('[SSOT Validation] Failed to save report text summary:', err);
  }

  console.log('[SSOT Validation] ✅ Validation complete:', report.summary);
  return report;
}

export interface ApplyChangesOptions {
  dryRun: boolean;
  confirmConsentDeletion: boolean;
}

export interface ApplyChangesResult {
  dryRun: boolean;
  deleted: Array<{ zohoId: string; name: string; email: string; status: string }>;
  created: Array<{ rowIndex: number; name: string; email: string; zohoId?: string; status: string }>;
  skipped: Array<{ zohoId?: string; rowIndex?: number; name: string; email: string; reason: string }>;
  errors: Array<{ zohoId?: string; rowIndex?: number; name: string; email: string; error: string }>;
  counts: { deleted: number; created: number; skipped: number; errors: number };
}

export async function applySSOTChanges(options: ApplyChangesOptions): Promise<ApplyChangesResult> {
  const { dryRun, confirmConsentDeletion } = options;
  console.log(`[SSOT Phase 2] Starting apply-changes (dryRun=${dryRun}, confirmConsentDeletion=${confirmConsentDeletion})`);

  const report = await runSSOTValidation();

  const deleted: ApplyChangesResult['deleted'] = [];
  const created: ApplyChangesResult['created'] = [];
  const skipped: ApplyChangesResult['skipped'] = [];
  const errors: ApplyChangesResult['errors'] = [];

  for (const candidate of report.removalCandidates) {
    const name = `${normalize(candidate.crmRecord.First_Name)} ${normalize(candidate.crmRecord.Last_Name)}`.trim();
    const email = normalize(candidate.crmRecord.Email);

    if (candidate.consentDataAtRisk.hasConsentData && !confirmConsentDeletion) {
      skipped.push({
        zohoId: candidate.zohoId,
        name,
        email,
        reason: 'Has consent data — requires explicit confirmConsentDeletion=true',
      });
      console.log(`[SSOT Phase 2] Skipping ${name} (${candidate.zohoId}) — consent data at risk`);
      continue;
    }

    if (dryRun) {
      deleted.push({ zohoId: candidate.zohoId, name, email, status: 'would-delete' });
      console.log(`[SSOT Phase 2] [DRY RUN] Would delete: ${name} (${candidate.zohoId})`);
    } else {
      try {
        const result = await zohoCRMService.deleteRecord('Leads', candidate.zohoId);
        deleted.push({ zohoId: candidate.zohoId, name, email, status: result.status || 'success' });
        console.log(`[SSOT Phase 2] Deleted: ${name} (${candidate.zohoId}) — ${result.status}`);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        errors.push({ zohoId: candidate.zohoId, name, email, error: errMsg });
        console.error(`[SSOT Phase 2] Delete error for ${name} (${candidate.zohoId}):`, errMsg);
      }
    }
  }

  for (const candidate of report.newRecordCandidates) {
    const firstName = normalize(candidate.ssotRow.first_name);
    const lastName = normalize(candidate.ssotRow.last_name);
    const email = normalize(candidate.ssotRow.email);
    const name = `${firstName} ${lastName}`.trim() || `Row ${candidate.rowIndex}`;

    if (candidate.missingEmail) {
      skipped.push({
        rowIndex: candidate.rowIndex,
        name,
        email: '',
        reason: 'Missing email — cannot create CRM record without email',
      });
      console.log(`[SSOT Phase 2] Skipping row ${candidate.rowIndex} (${name}) — no email`);
      continue;
    }

    if (dryRun) {
      created.push({ rowIndex: candidate.rowIndex, name, email, status: 'would-create' });
      console.log(`[SSOT Phase 2] [DRY RUN] Would create: ${name} <${email}> (row ${candidate.rowIndex})`);
    } else {
      try {
        const institution = normalize(candidate.ssotRow.institution);
        const discipline = normalize(candidate.ssotRow.discipline);
        const subspecialty = normalize(candidate.ssotRow.subspecialty);

        const recordData: Record<string, any> = {
          Last_Name: lastName || '(Unknown)',
          Lead_Source: 'SSOT Import',
        };
        if (firstName) recordData.First_Name = firstName;
        if (email) recordData.Email = email;
        if (institution) recordData.Institution_Name = institution;
        if (discipline) recordData.Professional_Designation = discipline;
        if (subspecialty) recordData.subspecialty = subspecialty;

        const newRecord = await zohoCRMService.createRecord('Leads', recordData);
        const newId = newRecord.id || newRecord.details?.id;
        created.push({ rowIndex: candidate.rowIndex, name, email, zohoId: String(newId || ''), status: 'created' });
        console.log(`[SSOT Phase 2] Created: ${name} <${email}> → Zoho ID ${newId}`);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        errors.push({ rowIndex: candidate.rowIndex, name, email, error: errMsg });
        console.error(`[SSOT Phase 2] Create error for ${name} (row ${candidate.rowIndex}):`, errMsg);
      }
    }
  }

  const result: ApplyChangesResult = {
    dryRun,
    deleted,
    created,
    skipped,
    errors,
    counts: {
      deleted: deleted.length,
      created: created.length,
      skipped: skipped.length,
      errors: errors.length,
    },
  };

  console.log(`[SSOT Phase 2] ✅ Done (dryRun=${dryRun}):`, result.counts);
  return result;
}

const SSOT_TO_CRM_FIELD: Record<string, string> = {
  first_name: 'First_Name',
  last_name: 'Last_Name',
  email: 'Email',
  institution: 'Institution_Name',
  discipline: 'Professional_Designation',
  subspecialty: 'subspecialty',
};

export interface FieldCorrectionsOptions {
  dryRun: boolean;
}

export interface FieldCorrectionsResult {
  dryRun: boolean;
  updated: Array<{
    zohoId: string;
    name: string;
    email: string;
    fields: Array<{ field: string; ssotValue: string | null; crmValue: string | null }>;
    status: string;
  }>;
  skipped: Array<{ zohoId: string; name: string; email: string; reason: string }>;
  errors: Array<{ zohoId: string; name: string; email: string; error: string }>;
  counts: { updated: number; skipped: number; errors: number };
}

export async function applyFieldCorrections(
  options: FieldCorrectionsOptions
): Promise<FieldCorrectionsResult> {
  const { dryRun } = options;
  console.log(`[SSOT Phase 2b] Starting apply-field-corrections (dryRun=${dryRun})`);

  const report = await runSSOTValidation();

  const updated: FieldCorrectionsResult['updated'] = [];
  const skipped: FieldCorrectionsResult['skipped'] = [];
  const errors: FieldCorrectionsResult['errors'] = [];

  for (const matched of report.matchedWithDiscrepancies) {
    const name = `${normalize(matched.crmRecord.First_Name)} ${normalize(matched.crmRecord.Last_Name)}`.trim();
    const email = normalize(matched.crmRecord.Email);

    const recordData: Record<string, any> = {};
    const fieldSummary: Array<{ field: string; ssotValue: string | null; crmValue: string | null }> = [];

    for (const discrepancy of matched.discrepancies) {
      const crmField = SSOT_TO_CRM_FIELD[discrepancy.field];
      if (!crmField) {
        console.warn(`[SSOT Phase 2b] Unknown field mapping for "${discrepancy.field}" — skipping field`);
        continue;
      }
      if (discrepancy.ssotValue !== null && discrepancy.ssotValue !== '') {
        recordData[crmField] = discrepancy.ssotValue;
        fieldSummary.push({ field: discrepancy.field, ssotValue: discrepancy.ssotValue, crmValue: discrepancy.crmValue });
      }
    }

    if (Object.keys(recordData).length === 0) {
      skipped.push({ zohoId: matched.zohoId, name, email, reason: 'No patchable fields after mapping (all discrepant SSOT values are blank)' });
      console.log(`[SSOT Phase 2b] Skipping ${name} (${matched.zohoId}) — no patchable fields`);
      continue;
    }

    if (dryRun) {
      updated.push({ zohoId: matched.zohoId, name, email, fields: fieldSummary, status: 'would-update' });
      console.log(`[SSOT Phase 2b] [DRY RUN] Would update: ${name} (${matched.zohoId})`, recordData);
    } else {
      try {
        await zohoCRMService.updateRecord('Leads', matched.zohoId, recordData);
        updated.push({ zohoId: matched.zohoId, name, email, fields: fieldSummary, status: 'updated' });
        console.log(`[SSOT Phase 2b] Updated: ${name} (${matched.zohoId})`);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        errors.push({ zohoId: matched.zohoId, name, email, error: errMsg });
        console.error(`[SSOT Phase 2b] Update error for ${name} (${matched.zohoId}):`, errMsg);
      }
    }
  }

  const result: FieldCorrectionsResult = {
    dryRun,
    updated,
    skipped,
    errors,
    counts: {
      updated: updated.length,
      skipped: skipped.length,
      errors: errors.length,
    },
  };

  console.log(`[SSOT Phase 2b] ✅ Done (dryRun=${dryRun}):`, result.counts);
  return result;
}

export function buildHumanReadableSummary(report: ValidationReport): string {
  const s = report.summary;
  const lines: string[] = [];

  lines.push('=== CRM vs SSOT Validation Report ===');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push('');
  lines.push('--- Summary ---');
  lines.push(`CRM total records : ${s.crmTotalRecords}`);
  lines.push(`SSOT total rows   : ${s.ssotTotalRows}`);
  lines.push(`Matched by Zoho ID: ${s.matchedByZohoId}`);
  lines.push(`Matched by email  : ${s.matchedByEmail}`);
  lines.push('');
  lines.push('--- Removal Candidates (CRM records NOT in SSOT) ---');
  lines.push(`Total             : ${s.removalCandidates}`);
  lines.push(`With consent data : ${s.removalCandidatesWithConsentData} ⚠️`);
  lines.push('');

  for (const r of report.removalCandidates) {
    const name = `${normalize(r.crmRecord.First_Name)} ${normalize(r.crmRecord.Last_Name)}`.trim();
    const email = normalize(r.crmRecord.Email);
    const flag = r.consentDataAtRisk.hasConsentData ? ' ⚠️  HAS CONSENT DATA' : '';
    lines.push(`  [${r.zohoId}] ${name} <${email}>${flag}`);
    if (r.consentDataAtRisk.hasConsentData) {
      lines.push(`         CAS_Communications: ${r.consentDataAtRisk.CAS_Communications}`);
      lines.push(`         CANN_Communications: ${r.consentDataAtRisk.CANN_Communications}`);
      lines.push(`         Services_Map_Inclusion: ${r.consentDataAtRisk.Services_Map_Inclusion}`);
    }
  }

  lines.push('');
  lines.push('--- New Record Candidates (SSOT rows NOT in CRM) ---');
  lines.push(`Total             : ${s.newRecordCandidates}`);
  lines.push(`Missing email     : ${s.newRecordsMissingEmail} ⚠️`);
  lines.push('');

  for (const n of report.newRecordCandidates) {
    const firstName = colVal(n.ssotRow, 'first_name');
    const lastName = colVal(n.ssotRow, 'last_name');
    const email = colVal(n.ssotRow, 'email');
    const missingFlag = n.missingEmail ? ' ⚠️  MISSING EMAIL' : '';
    lines.push(`  Row ${n.rowIndex}: ${firstName} ${lastName} <${email || 'NO EMAIL'}>${missingFlag}`);
  }

  lines.push('');
  lines.push('--- Field-Level Discrepancies (matched records) ---');
  lines.push(`Records with diffs : ${s.recordsWithDiscrepancies}`);
  lines.push(`Total field diffs  : ${s.totalFieldDiscrepancies}`);
  lines.push('');

  for (const m of report.matchedWithDiscrepancies) {
    const name = `${normalize(m.crmRecord.First_Name)} ${normalize(m.crmRecord.Last_Name)}`.trim();
    lines.push(`  [${m.zohoId}] ${name}`);
    for (const d of m.discrepancies) {
      lines.push(`    ${d.field}: SSOT="${d.ssotValue}" vs CRM="${d.crmValue}"`);
    }
  }

  return lines.join('\n');
}

function colVal(row: SSOTRow, key: string): string {
  return normalize(row[key]);
}
