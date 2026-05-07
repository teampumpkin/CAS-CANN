/**
 * CRM Deep Audit — concrete answers
 * - Lists every Custom View in Leads, Contacts, Accounts
 * - Counts records per module
 * - For Leads: per-field population (how many records have each field filled)
 * - Lists records missing critical fields (email, name, consent, source)
 * - Lists records present in CRM but missing from SSOT
 * - Lists records present in SSOT but missing from CRM
 * - Lists every duplicate cluster (same email, multiple records)
 * - Output: docs/CAS_CRM_Deep_Audit_<DATE>.xlsx
 */

import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { zohoCRMService } from '../server/zoho-crm-service';

const SSOT_FILE = path.join(
  process.cwd(),
  'attached_assets',
  '2026_04_CAS_CANN_Members_SSOTv6_FINAL_1776935708133.xlsx'
);

function norm(v: any): string {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

async function fetchAllRecords(module: string, fields: string): Promise<any[]> {
  const all: any[] = [];
  let page = 1;
  while (page <= 30) {
    const batch = await zohoCRMService.getRecords(module, { page, per_page: 200, fields });
    if (!batch || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 200) break;
    page++;
  }
  return all;
}

async function fetchCustomViews(module: string): Promise<any[]> {
  try {
    const result = await (zohoCRMService as any).makeAPIRequest?.(
      `/settings/custom_views?module=${module}`,
      'GET'
    );
    return result?.custom_views || [];
  } catch (e: any) {
    console.warn(`[Audit] Could not fetch views for ${module}: ${e.message}`);
    return [];
  }
}

function loadSSOTEmails(): Set<string> {
  if (!fs.existsSync(SSOT_FILE)) return new Set();
  const wb = XLSX.readFile(SSOT_FILE);
  const sheet = wb.SheetNames.find((n) => n.toLowerCase() === 'ssot') || wb.SheetNames[0];
  const raw = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { defval: '' }) as Record<string, any>[];
  const cols = Object.keys(raw[0] || {});
  const emailCol = cols.find((c) => c.toLowerCase().includes('email'));
  const set = new Set<string>();
  if (emailCol) {
    for (const r of raw) {
      const e = norm(r[emailCol]).toLowerCase();
      if (e) set.add(e);
    }
  }
  return set;
}

async function run() {
  console.log('[Audit] === CRM DEEP AUDIT ===\n');

  const ssotEmails = loadSSOTEmails();
  console.log(`[Audit] SSOT emails: ${ssotEmails.size}`);

  // Fetch counts + records
  const leadFields = [
    'id', 'First_Name', 'Last_Name', 'Email', 'Phone', 'Company',
    'CAS_Member', 'CANN_Member', 'Record_Type',
    'CAS_Communications', 'CANN_Communications', 'Services_Map_Inclusion',
    'Professional_Designation', 'Institution_Name', 'subspecialty',
    'Amyloidosis_Type', 'Source_Form', 'Lead_Source',
    'Created_Time', 'Modified_Time', 'Lead_Status',
  ].join(',');

  const contactFields = [
    'id', 'First_Name', 'Last_Name', 'Email', 'Phone',
    'Account_Name', 'Department', 'Title',
    'Created_Time', 'Modified_Time',
  ].join(',');

  const accountFields = [
    'id', 'Account_Name', 'Industry', 'Phone', 'Website',
    'Billing_City', 'Billing_State', 'Created_Time',
  ].join(',');

  console.log('[Audit] Fetching Leads, Contacts, Accounts, and Custom Views in parallel...');
  const [leads, contacts, accounts, leadViews, contactViews, accountViews] = await Promise.all([
    fetchAllRecords('Leads', leadFields),
    fetchAllRecords('Contacts', contactFields),
    fetchAllRecords('Accounts', accountFields),
    fetchCustomViews('Leads'),
    fetchCustomViews('Contacts'),
    fetchCustomViews('Accounts'),
  ]);

  console.log(`[Audit] Leads: ${leads.length}, Contacts: ${contacts.length}, Accounts: ${accounts.length}`);
  console.log(`[Audit] Views — Leads: ${leadViews.length}, Contacts: ${contactViews.length}, Accounts: ${accountViews.length}`);

  // Field population analysis on Leads
  const fieldList = leadFields.split(',');
  const fieldPop: Record<string, { filled: number; empty: number; pct: string }> = {};
  for (const f of fieldList) {
    let filled = 0;
    for (const r of leads) {
      if (norm(r[f]) !== '') filled++;
    }
    const empty = leads.length - filled;
    const pct = leads.length > 0 ? ((filled / leads.length) * 100).toFixed(1) + '%' : '0%';
    fieldPop[f] = { filled, empty, pct };
  }

  const fieldPopRows = Object.entries(fieldPop)
    .sort((a, b) => a[1].filled - b[1].filled)
    .map(([field, v]) => ({
      Field: field,
      [`Filled (of ${leads.length})`]: v.filled,
      'Empty': v.empty,
      'Population %': v.pct,
      'Critical?': ['Email', 'First_Name', 'Last_Name', 'Source_Form', 'Record_Type', 'CAS_Communications', 'CANN_Communications'].includes(field) ? 'YES' : '',
    }));

  // Records missing critical fields
  const missingCritical = leads
    .filter((l) => !norm(l.Email) || !norm(l.First_Name) || !norm(l.Last_Name) || !norm(l.Record_Type) || !norm(l.Source_Form))
    .map((l) => ({
      'CRM ID': l.id,
      'Name': `${norm(l.First_Name)} ${norm(l.Last_Name)}`.trim() || '(no name)',
      'Email': norm(l.Email) || '(MISSING)',
      'Missing Email?': !norm(l.Email) ? 'YES' : '',
      'Missing First Name?': !norm(l.First_Name) ? 'YES' : '',
      'Missing Last Name?': !norm(l.Last_Name) ? 'YES' : '',
      'Missing Record_Type?': !norm(l.Record_Type) ? 'YES' : '',
      'Missing Source_Form?': !norm(l.Source_Form) ? 'YES' : '',
      'Missing CAS_Communications?': !norm(l.CAS_Communications) ? 'YES' : '',
      'Missing CANN_Communications?': !norm(l.CANN_Communications) ? 'YES' : '',
      'Created': l.Created_Time,
    }));

  // Duplicates by email
  const byEmail = new Map<string, any[]>();
  for (const l of leads) {
    const e = norm(l.Email).toLowerCase();
    if (!e) continue;
    if (!byEmail.has(e)) byEmail.set(e, []);
    byEmail.get(e)!.push(l);
  }
  const dupRows: any[] = [];
  for (const [email, recs] of byEmail.entries()) {
    if (recs.length > 1) {
      for (const r of recs) {
        dupRows.push({
          Email: email,
          'CRM ID': r.id,
          Name: `${norm(r.First_Name)} ${norm(r.Last_Name)}`.trim(),
          Institution: norm(r.Institution_Name || r.Company),
          'CAS Member': norm(r.CAS_Member),
          'CANN Member': norm(r.CANN_Member),
          'Record_Type': norm(r.Record_Type),
          'Created': r.Created_Time,
        });
      }
    }
  }

  // SSOT vs CRM diff
  const crmEmails = new Set<string>();
  for (const l of leads) {
    const e = norm(l.Email).toLowerCase();
    if (e) crmEmails.add(e);
  }
  const inSSOTNotCRM = Array.from(ssotEmails).filter((e) => !crmEmails.has(e));
  const inCRMNotSSOT = leads.filter((l) => {
    const e = norm(l.Email).toLowerCase();
    return e && !ssotEmails.has(e);
  }).map((l) => ({
    'CRM ID': l.id,
    Email: norm(l.Email),
    Name: `${norm(l.First_Name)} ${norm(l.Last_Name)}`.trim(),
    Institution: norm(l.Institution_Name || l.Company),
    'Source_Form': norm(l.Source_Form),
    'Lead_Source': norm(l.Lead_Source),
    'Record_Type': norm(l.Record_Type),
    'Created': l.Created_Time,
  }));

  // Custom views inventory
  const viewRows = [
    ...leadViews.map((v: any) => ({ Module: 'Leads', 'View Name': v.display_value || v.name, 'View ID': v.id, 'Default?': v.default ? 'Yes' : '', 'System?': v.system_defined ? 'Yes' : '', Category: v.category || '' })),
    ...contactViews.map((v: any) => ({ Module: 'Contacts', 'View Name': v.display_value || v.name, 'View ID': v.id, 'Default?': v.default ? 'Yes' : '', 'System?': v.system_defined ? 'Yes' : '', Category: v.category || '' })),
    ...accountViews.map((v: any) => ({ Module: 'Accounts', 'View Name': v.display_value || v.name, 'View ID': v.id, 'Default?': v.default ? 'Yes' : '', 'System?': v.system_defined ? 'Yes' : '', Category: v.category || '' })),
  ];

  // Lead Source breakdown
  const sourceCounts: Record<string, number> = {};
  for (const l of leads) {
    const s = norm(l.Lead_Source) || '(empty)';
    sourceCounts[s] = (sourceCounts[s] || 0) + 1;
  }
  const sourceRows = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ 'Lead_Source': k, Count: v }));

  // Source_Form breakdown
  const sourceFormCounts: Record<string, number> = {};
  for (const l of leads) {
    const s = norm(l.Source_Form) || '(empty)';
    sourceFormCounts[s] = (sourceFormCounts[s] || 0) + 1;
  }
  const sourceFormRows = Object.entries(sourceFormCounts).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ 'Source_Form': k, Count: v }));

  // Record_Type breakdown
  const rtCounts: Record<string, number> = {};
  for (const l of leads) {
    const s = norm(l.Record_Type) || '(empty)';
    rtCounts[s] = (rtCounts[s] || 0) + 1;
  }
  const rtRows = Object.entries(rtCounts).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ 'Record_Type': k, Count: v }));

  // CAS / CANN member counts
  const casYes = leads.filter((l) => norm(l.CAS_Member).toLowerCase() === 'true' || norm(l.CAS_Member).toLowerCase() === 'yes').length;
  const cannYes = leads.filter((l) => norm(l.CANN_Member).toLowerCase() === 'true' || norm(l.CANN_Member).toLowerCase() === 'yes').length;
  const casComm = leads.filter((l) => norm(l.CAS_Communications).toLowerCase() === 'yes' || norm(l.CAS_Communications).toLowerCase() === 'true').length;
  const cannComm = leads.filter((l) => norm(l.CANN_Communications).toLowerCase() === 'yes' || norm(l.CANN_Communications).toLowerCase() === 'true').length;

  // Master summary
  const summary = [
    { Metric: 'Generated', Value: new Date().toISOString() },
    { Metric: '— RECORD COUNTS —', Value: '' },
    { Metric: 'Total Leads in CRM', Value: leads.length },
    { Metric: 'Total Contacts in CRM', Value: contacts.length },
    { Metric: 'Total Accounts in CRM', Value: accounts.length },
    { Metric: 'Total SSOT v6 emails', Value: ssotEmails.size },
    { Metric: '— VIEWS —', Value: '' },
    { Metric: 'Custom Views — Leads', Value: leadViews.length },
    { Metric: 'Custom Views — Contacts', Value: contactViews.length },
    { Metric: 'Custom Views — Accounts', Value: accountViews.length },
    { Metric: '— DATA QUALITY —', Value: '' },
    { Metric: 'Leads missing Email', Value: leads.filter((l) => !norm(l.Email)).length },
    { Metric: 'Leads missing First or Last Name', Value: leads.filter((l) => !norm(l.First_Name) || !norm(l.Last_Name)).length },
    { Metric: 'Leads missing Record_Type', Value: leads.filter((l) => !norm(l.Record_Type)).length },
    { Metric: 'Leads missing Source_Form', Value: leads.filter((l) => !norm(l.Source_Form)).length },
    { Metric: 'Leads missing CAS_Communications', Value: leads.filter((l) => !norm(l.CAS_Communications)).length },
    { Metric: 'Leads missing CANN_Communications', Value: leads.filter((l) => !norm(l.CANN_Communications)).length },
    { Metric: 'Leads missing Institution_Name', Value: leads.filter((l) => !norm(l.Institution_Name)).length },
    { Metric: 'Duplicate emails (people, not rows)', Value: Array.from(byEmail.values()).filter((arr) => arr.length > 1).length },
    { Metric: 'Total duplicate rows (sum)', Value: dupRows.length },
    { Metric: '— MEMBERSHIP —', Value: '' },
    { Metric: 'Leads marked CAS_Member = Yes', Value: casYes },
    { Metric: 'Leads marked CANN_Member = Yes', Value: cannYes },
    { Metric: 'Leads with CAS_Communications = Yes', Value: casComm },
    { Metric: 'Leads with CANN_Communications = Yes', Value: cannComm },
    { Metric: '— SSOT vs CRM —', Value: '' },
    { Metric: 'In SSOT but NOT in CRM (by email)', Value: inSSOTNotCRM.length },
    { Metric: 'In CRM but NOT in SSOT (by email)', Value: inCRMNotSSOT.length },
  ];

  // Build workbook
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([
    { Field: 'Title', Value: 'CAS / CANN — CRM Deep Audit' },
    { Field: 'Generated', Value: new Date().toISOString() },
    { Field: 'Source', Value: 'Live Zoho CRM (production)' },
    { Field: 'Purpose', Value: 'Concrete answers: what is in CRM, what is missing, what views exist, what does not match SSOT.' },
    { Field: 'Sheets', Value: 'Summary | Field Population | Missing Critical Fields | Duplicates | In CRM Not in SSOT | In SSOT Not in CRM | Custom Views | Lead Source breakdown | Source Form breakdown | Record Type breakdown' },
  ]), 'README');

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), 'Summary');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(fieldPopRows), 'Field Population');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(missingCritical), 'Missing Critical Fields');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dupRows), 'Duplicates');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(inCRMNotSSOT), 'In CRM Not in SSOT');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(inSSOTNotCRM.map((e) => ({ Email: e }))), 'In SSOT Not in CRM');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(viewRows), 'Custom Views');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sourceRows), 'Lead Source breakdown');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sourceFormRows), 'Source Form breakdown');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rtRows), 'Record Type breakdown');

  const dateStr = new Date().toISOString().slice(0, 10);
  const outDir = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `CAS_CRM_Deep_Audit_${dateStr}.xlsx`);
  XLSX.writeFile(wb, outPath);

  console.log(`\n[Audit] === RESULTS ===`);
  for (const s of summary) console.log(`  ${String(s.Value).padStart(8)}  ${s.Metric}`);
  console.log(`\n✅ CRM Deep Audit ready: ${outPath}`);
  return outPath;
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
