/**
 * RESTORE LEADS INBOX MODEL
 * --------------------------
 * Earlier today we mistakenly consolidated all 274 people into Contacts,
 * leaving Leads empty. This breaks the standard Zoho inbox model where
 * new form submissions land as Leads, get reviewed, then converted.
 *
 * This script:
 *   1. Pulls every Contact with full CAS/CANN field data
 *   2. Builds Lead payloads (boolean → "Yes"/"No" picklist conversion,
 *      Account_Name lookup → Company text)
 *   3. Creates Leads in batches of 100 with the "CAS and CANN" layout
 *   4. Verifies count, duplicates, and sampled layout assignment
 *   5. Deletes the original Contacts in batches
 *   6. Writes a before/after report (xlsx + json)
 *
 * Usage:
 *   npx tsx scripts/restore-leads-inbox-model.ts --dry-run
 *   npx tsx scripts/restore-leads-inbox-model.ts --live
 */

import * as fs from 'fs';
import * as path from 'path';
import XLSX from 'xlsx';
import { dedicatedTokenManager } from '../server/dedicated-token-manager';

const argv = process.argv.slice(2);
const DRY_RUN = !argv.includes('--live');
const SKIP_DELETE = argv.includes('--skip-delete');

const LAYOUT_ID = '6999043000000091055'; // "CAS and CANN"
const LAYOUT_NAME = 'CAS and CANN';
const BASE_URL = 'https://www.zohoapis.com/crm/v8';
const ORG_ID = process.env.ZOHO_ORG_ID || '';
const DATE = new Date().toISOString().slice(0, 10);
const REPORT_JSON = path.join('docs', `CAS_LEADS_RESTORE_${DATE}.json`);
const REPORT_XLSX = path.join('docs', `CAS_LEADS_RESTORE_${DATE}.xlsx`);
const BEFORE_PATH = path.join('docs', 'CAS_FINAL_SSOT_2026-05-09.json');

const CONTACT_FIELDS = [
  'id', 'First_Name', 'Last_Name', 'Email', 'Phone',
  'CAS_Member', 'CANN_Member', 'Source_Form', 'Form_Submission_Date',
  'Record_Type', 'Institution_Name', 'Professional_Designation',
  'Amyloidosis_Type', 'CAS_Communications', 'CANN_Communications',
  'Services_Map_Inclusion', 'subspecialty', 'Account_Name', 'Lead_Source',
  'Description', 'Created_Time',
].join(',');

const LEAD_FIELDS_FOR_AUDIT = [
  'id', 'First_Name', 'Last_Name', 'Email',
  'CAS_Member', 'CANN_Member', 'Source_Form', 'Form_Submission_Date',
  'Record_Type', 'Institution_Name', 'Professional_Designation',
  'Amyloidosis_Type', 'CAS_Communications', 'CANN_Communications',
  'Services_Map_Inclusion', 'subspecialty', 'Company', 'Lead_Source',
].join(',');

async function getToken(): Promise<string> {
  const t = await dedicatedTokenManager.getValidAccessToken('zoho_crm');
  if (!t) throw new Error('No valid Zoho CRM access token. Authenticate via /oauth/zoho/connect first.');
  return t;
}

async function api(method: string, endpoint: string, body?: any): Promise<any> {
  const token = await getToken();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  if (ORG_ID) headers.orgId = ORG_ID;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json: any = {};
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  if (!res.ok && res.status !== 204) {
    throw new Error(`Zoho ${method} ${endpoint} → ${res.status}: ${text.slice(0, 500)}`);
  }
  return json;
}

async function fetchAll(module: string, fields: string): Promise<any[]> {
  const all: any[] = [];
  let page = 1;
  while (page <= 30) {
    const params = new URLSearchParams({ page: String(page), per_page: '200', fields });
    const res = await api('GET', `/${module}?${params.toString()}`);
    const batch: any[] = res.data || [];
    if (!batch.length) break;
    all.push(...batch);
    if (batch.length < 200) break;
    page++;
  }
  return all;
}

async function moduleCount(module: string): Promise<number> {
  // Cheap count via fields=id
  const all = await fetchAll(module, 'id');
  return all.length;
}

// ---- Field-type conversion ----
function boolToPicklist(v: any): 'Yes' | 'No' | undefined {
  if (v === true || v === 'Yes' || v === 'yes' || v === 'true') return 'Yes';
  if (v === false || v === 'No' || v === 'no' || v === 'false') return 'No';
  if (v === null || v === undefined || v === '') return undefined;
  return undefined;
}

function deriveLeadSource(c: any): string {
  if (c.Lead_Source && typeof c.Lead_Source === 'string' && c.Lead_Source.trim()) return c.Lead_Source;
  const sf: string = (c.Source_Form || '').toString();
  const isCANN = c.CANN_Member === true || /cann/i.test(sf);
  const isCAS = c.CAS_Member === true || /cas/i.test(sf);
  if (sf.toLowerCase().includes('excel')) return sf;
  if (isCANN && isCAS) return 'Website - CAS & CANN Registration';
  if (isCANN) return 'Website - CANN Membership';
  if (isCAS) return 'Website - CAS Registration';
  if (sf) return sf;
  return 'Historical Import';
}

function buildLeadPayload(c: any): Record<string, any> {
  const lastName = (c.Last_Name || c.First_Name || (c.Email ? c.Email.split('@')[0] : 'Unknown')).toString();
  const payload: Record<string, any> = {
    Layout: { id: LAYOUT_ID },
    Last_Name: lastName,
  };

  if (c.First_Name) payload.First_Name = c.First_Name;
  if (c.Email) payload.Email = c.Email;
  if (c.Phone) payload.Phone = c.Phone;

  if (typeof c.CAS_Member === 'boolean') payload.CAS_Member = c.CAS_Member;
  if (typeof c.CANN_Member === 'boolean') payload.CANN_Member = c.CANN_Member;
  // Enforce CANN→CAS dependency
  if (payload.CANN_Member === true) payload.CAS_Member = true;

  if (c.Source_Form) payload.Source_Form = c.Source_Form;
  if (c.Form_Submission_Date) payload.Form_Submission_Date = c.Form_Submission_Date;
  if (c.Record_Type) payload.Record_Type = c.Record_Type;
  if (c.Institution_Name) payload.Institution_Name = c.Institution_Name;
  if (c.Professional_Designation) payload.Professional_Designation = c.Professional_Designation;
  if (c.Amyloidosis_Type) payload.Amyloidosis_Type = c.Amyloidosis_Type;
  if (c.subspecialty) payload.subspecialty = c.subspecialty;
  if (c.Description) payload.Description = c.Description;

  // Boolean → picklist conversion (Lead expects "Yes"/"No" strings)
  const casCom = boolToPicklist(c.CAS_Communications);
  if (casCom) payload.CAS_Communications = casCom;
  const cannCom = boolToPicklist(c.CANN_Communications);
  if (cannCom) {
    payload.CANN_Communications = cannCom;
    payload.CANN_Communication_Consent = cannCom;
  }
  const mapIncl = boolToPicklist(c.Services_Map_Inclusion);
  if (mapIncl) payload.Services_Map_Inclusion = mapIncl;

  // Account_Name (lookup) → Company (text)
  let company = '';
  if (c.Account_Name) {
    if (typeof c.Account_Name === 'object' && c.Account_Name.name) company = c.Account_Name.name;
    else if (typeof c.Account_Name === 'string') company = c.Account_Name;
  }
  if (!company && c.Institution_Name) company = c.Institution_Name;
  payload.Company = (company || 'Unknown').toString().substring(0, 100);

  payload.Lead_Source = deriveLeadSource(c);

  return payload;
}

async function batchInsertLeads(payloads: any[]): Promise<{ ok: any[]; fail: any[] }> {
  const ok: any[] = [];
  const fail: any[] = [];
  for (let i = 0; i < payloads.length; i += 100) {
    const chunk = payloads.slice(i, i + 100);
    if (DRY_RUN) {
      console.log(`  [DRY] would insert batch ${i / 100 + 1} (${chunk.length} records)`);
      chunk.forEach((p, j) => ok.push({ index: i + j, dryRun: true, email: p.Email }));
      continue;
    }
    // trigger: [] suppresses workflow rules / welcome emails for historical re-import
    const res = await api('POST', '/Leads', { data: chunk, trigger: [] });
    const items: any[] = res.data || [];
    items.forEach((it, j) => {
      if (it.status === 'success') ok.push({ index: i + j, id: it.details?.id, email: chunk[j].Email });
      else fail.push({ index: i + j, email: chunk[j].Email, code: it.code, message: it.message, details: it.details });
    });
    console.log(`  Batch ${i / 100 + 1}: ${items.filter(x => x.status === 'success').length}/${chunk.length} ok`);
  }
  return { ok, fail };
}

async function batchDeleteContacts(ids: string[]): Promise<{ ok: number; fail: number }> {
  let ok = 0, fail = 0;
  for (let i = 0; i < ids.length; i += 100) {
    const chunk = ids.slice(i, i + 100);
    if (DRY_RUN) {
      console.log(`  [DRY] would delete batch ${i / 100 + 1} (${chunk.length} contacts)`);
      ok += chunk.length;
      continue;
    }
    const res = await api('DELETE', `/Contacts?ids=${chunk.join(',')}&wf_trigger=false`);
    const items: any[] = res.data || [];
    items.forEach(it => { if (it.status === 'success') ok++; else fail++; });
    console.log(`  Delete batch ${i / 100 + 1}: ${items.filter(x => x.status === 'success').length}/${chunk.length} ok`);
  }
  return { ok, fail };
}

async function sampleLayouts(leadIds: string[], n: number = 10): Promise<any[]> {
  const sample = leadIds.slice(0, n);
  const out: any[] = [];
  for (const id of sample) {
    try {
      const res = await api('GET', `/Leads/${id}`);
      const rec: any = (res.data || [])[0] || {};
      // Single-record GETs return $layout_id as an object: {id, name, display_label}
      const lo = rec.$layout_id || rec.Layout || {};
      out.push({
        id,
        email: rec.Email,
        layoutId: typeof lo === 'object' ? lo.id : lo,
        layoutName: typeof lo === 'object' ? lo.name : undefined,
      });
    } catch (e: any) {
      out.push({ id, error: e.message });
    }
  }
  return out;
}

function fieldCoverage(records: any[], fields: string[]): Record<string, { populated: number; total: number; pct: number }> {
  const out: any = {};
  for (const f of fields) {
    let populated = 0;
    for (const r of records) {
      const v = (r as any)[f];
      if (v !== null && v !== undefined && v !== '' && !(typeof v === 'object' && Object.keys(v).length === 0)) {
        populated++;
      }
    }
    out[f] = { populated, total: records.length, pct: records.length ? Math.round((populated / records.length) * 100) : 0 };
  }
  return out;
}

function dupeCount(records: any[], key: string): number {
  const seen = new Map<string, number>();
  for (const r of records) {
    const v = ((r as any)[key] || '').toString().toLowerCase().trim();
    if (!v) continue;
    seen.set(v, (seen.get(v) || 0) + 1);
  }
  let dups = 0;
  seen.forEach(c => { if (c > 1) dups += c - 1; });
  return dups;
}

async function main() {
  console.log(`\n[Restore] Mode: ${DRY_RUN ? 'DRY-RUN' : 'LIVE'} | skip-delete: ${SKIP_DELETE}\n`);
  if (!ORG_ID) console.warn('[Restore] WARNING: ZOHO_ORG_ID not set');

  // ---- BEFORE state ----
  const before = fs.existsSync(BEFORE_PATH) ? JSON.parse(fs.readFileSync(BEFORE_PATH, 'utf-8')) : null;

  console.log('[Restore] Step 1: Pulling all Contacts...');
  const contacts = await fetchAll('Contacts', CONTACT_FIELDS);
  console.log(`[Restore]   Pulled ${contacts.length} Contacts`);

  console.log('[Restore] Step 2: Pulling current Leads + Accounts counts...');
  const leadsBefore = await fetchAll('Leads', 'id,Email');
  const accountsBefore = await fetchAll('Accounts', 'id');
  console.log(`[Restore]   Leads: ${leadsBefore.length} | Contacts: ${contacts.length} | Accounts: ${accountsBefore.length}`);

  // Backup the contacts data before any destructive action
  const backupDir = path.join('docs', 'backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  const backupFile = path.join(backupDir, `contacts-pre-restore-${DATE}-${Date.now()}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(contacts, null, 2));
  console.log(`[Restore]   Backup written → ${backupFile}`);

  // ---- Build payloads ----
  console.log('[Restore] Step 3: Building Lead payloads with field-type conversion...');
  const payloads = contacts.map(buildLeadPayload);

  // De-dupe by email within payloads (precaution; task says zero dupes expected)
  const seenEmail = new Set<string>();
  const dedupPayloads: any[] = [];
  const skippedDupes: any[] = [];
  for (const p of payloads) {
    const e = (p.Email || '').toString().toLowerCase().trim();
    if (e && seenEmail.has(e)) {
      skippedDupes.push({ email: p.Email, lastName: p.Last_Name });
      continue;
    }
    if (e) seenEmail.add(e);
    dedupPayloads.push(p);
  }
  console.log(`[Restore]   Built ${dedupPayloads.length} payloads (${skippedDupes.length} duplicate-email skipped)`);

  // ---- Insert ----
  console.log(`[Restore] Step 4: Creating Leads in batches of 100 (layout=${LAYOUT_NAME})...`);
  const insertRes = await batchInsertLeads(dedupPayloads);
  console.log(`[Restore]   Created ok: ${insertRes.ok.length} | failed: ${insertRes.fail.length}`);
  if (insertRes.fail.length) {
    console.log('[Restore]   First few failures:');
    insertRes.fail.slice(0, 5).forEach(f => console.log(`    - ${f.email}: [${f.code}] ${f.message}`));
  }

  // ---- Verify ----
  let verify: any = { skipped: true };
  let leadsAfter: any[] = [];
  if (!DRY_RUN) {
    console.log('[Restore] Step 5: Verifying...');
    leadsAfter = await fetchAll('Leads', LEAD_FIELDS_FOR_AUDIT);
    const dups = dupeCount(leadsAfter, 'Email');
    const insertedIds = insertRes.ok.map(o => o.id).filter(Boolean) as string[];
    const layoutSamples = await sampleLayouts(insertedIds, 10);
    const layoutOk = layoutSamples.filter(s => s.layoutId === LAYOUT_ID).length;
    verify = {
      leadCount: leadsAfter.length,
      duplicateEmails: dups,
      layoutSampled: layoutSamples.length,
      layoutCorrect: layoutOk,
      sample: layoutSamples,
    };
    console.log(`[Restore]   Leads now: ${leadsAfter.length} | dupes: ${dups} | layout sample correct: ${layoutOk}/${layoutSamples.length}`);
  }

  // ---- Delete ----
  let deleteRes: any = { skipped: true };
  if (!DRY_RUN && !SKIP_DELETE) {
    const lookGood = insertRes.fail.length === 0
      && verify.leadCount >= dedupPayloads.length
      && verify.duplicateEmails === 0
      && verify.layoutCorrect === verify.layoutSampled;
    if (!lookGood) {
      console.warn('[Restore] ⚠️  Verify failed — SKIPPING delete. Inspect failures and re-run with --skip-delete=false after fixing.');
      deleteRes = { skipped: true, reason: 'verify-failed' };
    } else {
      console.log('[Restore] Step 6: Deleting Contacts in batches of 100...');
      const ids = contacts.map(c => c.id).filter(Boolean);
      deleteRes = await batchDeleteContacts(ids);
    }
  } else if (SKIP_DELETE) {
    console.log('[Restore] Step 6: SKIPPED (--skip-delete)');
  }

  // ---- Final audit ----
  console.log('[Restore] Step 7: Final audit + report...');
  let leadsFinal = leadsAfter;
  let contactsFinal: any[] = contacts;
  let accountsFinal: any[] = accountsBefore;
  if (!DRY_RUN) {
    leadsFinal = await fetchAll('Leads', LEAD_FIELDS_FOR_AUDIT);
    contactsFinal = await fetchAll('Contacts', 'id');
    accountsFinal = await fetchAll('Accounts', 'id');
  }

  const trackedFields = [
    'Email', 'Last_Name', 'First_Name', 'CAS_Member', 'CANN_Member',
    'Source_Form', 'Form_Submission_Date', 'Record_Type', 'Institution_Name',
    'Professional_Designation', 'Amyloidosis_Type', 'CAS_Communications',
    'CANN_Communications', 'Services_Map_Inclusion', 'subspecialty', 'Company', 'Lead_Source',
  ];
  const coverage = fieldCoverage(leadsFinal, trackedFields);
  const dups = dupeCount(leadsFinal, 'Email');

  const report = {
    generatedAt: new Date().toISOString(),
    mode: DRY_RUN ? 'dry-run' : 'live',
    layout: { id: LAYOUT_ID, name: LAYOUT_NAME },
    before: before
      ? { totals: before.totals, fields: before.fields }
      : { totals: { leads: leadsBefore.length, contacts: contacts.length, accounts: accountsBefore.length } },
    after: {
      totals: {
        leads: leadsFinal.length,
        contacts: contactsFinal.length,
        accounts: accountsFinal.length,
      },
      duplicates: { leadEmail: dups },
      fieldCoverageOnLeads: coverage,
    },
    insert: {
      attempted: dedupPayloads.length,
      ok: insertRes.ok.length,
      failed: insertRes.fail.length,
      failures: insertRes.fail.slice(0, 50),
      skippedDuplicatesInPayloads: skippedDupes,
    },
    verify,
    delete: deleteRes,
    backupFile,
  };

  fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2));
  console.log(`[Restore]   JSON report → ${REPORT_JSON}`);

  // XLSX report
  const wb = XLSX.utils.book_new();
  const summary = [
    { Metric: 'Mode', Value: report.mode },
    { Metric: 'Layout assigned', Value: `${LAYOUT_NAME} (${LAYOUT_ID})` },
    { Metric: 'Leads BEFORE', Value: report.before.totals?.leads ?? '' },
    { Metric: 'Contacts BEFORE', Value: report.before.totals?.contacts ?? '' },
    { Metric: 'Accounts BEFORE', Value: report.before.totals?.accounts ?? '' },
    { Metric: 'Leads AFTER', Value: report.after.totals.leads },
    { Metric: 'Contacts AFTER', Value: report.after.totals.contacts },
    { Metric: 'Accounts AFTER', Value: report.after.totals.accounts },
    { Metric: 'Duplicate Lead emails', Value: report.after.duplicates.leadEmail },
    { Metric: 'Insert attempted', Value: report.insert.attempted },
    { Metric: 'Insert ok', Value: report.insert.ok },
    { Metric: 'Insert failed', Value: report.insert.failed },
    { Metric: 'Layout sample correct', Value: `${verify?.layoutCorrect ?? 'n/a'}/${verify?.layoutSampled ?? 'n/a'}` },
    { Metric: 'Contacts deleted', Value: deleteRes?.ok ?? 'n/a' },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), 'Summary');

  const coverageRows = Object.entries(coverage).map(([Field, v]) => ({
    Field, Populated: v.populated, Total: v.total, Pct: v.pct,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(coverageRows), 'Lead Field Coverage');

  if (insertRes.fail.length) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(insertRes.fail), 'Insert Failures');
  }
  if (verify?.sample) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(verify.sample), 'Layout Sample');
  }

  XLSX.writeFile(wb, REPORT_XLSX);
  console.log(`[Restore]   XLSX report → ${REPORT_XLSX}`);

  console.log('\n[Restore] ✅ Done.\n');
}

main().catch(err => {
  console.error('[Restore] FATAL:', err);
  process.exit(1);
});
