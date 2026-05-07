/**
 * Three-Way Comparison Report
 * ---------------------------
 * Compares: Team Pumpkin DB  ⇄  SSOTv6 Excel  ⇄  Zoho CRM Leads
 * For each unique person (matched by email, then by name+institution fallback):
 *   - In DB?   In SSOT?   In CRM?
 *   - Are key fields consistent across all three?
 *   - Discrepancies highlighted in the output.
 *
 * Deliverable for: CAS CRM May 6, 2026 review meeting (Jeff + Jan).
 * Output: docs/CAS_3Way_Comparison_<DATE>.xlsx
 */

import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { db } from '../server/db';
import { formSubmissions } from '../shared/schema';
import { zohoCRMService } from '../server/zoho-crm-service';

const SSOT_FILE = path.join(
  process.cwd(),
  'attached_assets',
  '2026_04_CAS_CANN_Members_SSOTv6_FINAL_1776935708133.xlsx'
);

const CRM_FIELDS = [
  'id',
  'First_Name',
  'Last_Name',
  'Email',
  'Company',
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
  'Lead_Source',
].join(',');

type Person = {
  key: string;
  email: string;
  fullName: string;
  institution: string;
  inDB: boolean;
  inSSOT: boolean;
  inCRM: boolean;
  dbIds: number[];
  crmIds: string[];
  ssotZohoIds: string[];
  dbCASComm: string;
  ssotCASComm: string;
  crmCASComm: string;
  dbCANNComm: string;
  ssotCANNComm: string;
  crmCANNComm: string;
  dbMap: string;
  ssotMap: string;
  crmMap: string;
  dbInstitution: string;
  ssotInstitution: string;
  crmInstitution: string;
  discrepancies: string[];
  notes: string[];
};

function norm(v: any): string {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function normEmail(v: any): string {
  return norm(v).toLowerCase();
}

function normYesNo(v: any): string {
  const s = norm(v).toLowerCase();
  if (s === 'true' || s === 'yes' || s === '1' || s === 'y') return 'Yes';
  if (s === 'false' || s === 'no' || s === '0' || s === 'n') return 'No';
  if (s === '') return '';
  return s;
}

function nameKey(name: string, institution: string): string {
  return (
    norm(name).toLowerCase().replace(/\s+/g, ' ') +
    '|' +
    norm(institution).toLowerCase().replace(/\s+/g, ' ')
  );
}

function isTestRecord(email: string, name: string): boolean {
  const e = email.toLowerCase();
  const n = name.toLowerCase();
  return (
    e.includes('test') ||
    e.includes('verify@example') ||
    e === 'jane.smith@hospital.ca' ||
    n.includes('test') ||
    n === 'jane smith' ||
    n === 'vasi' ||
    n === 'verify fields now' ||
    n === 'final verify user'
  );
}

async function loadDB() {
  const rows = await db.select().from(formSubmissions);
  console.log(`[3-Way] Loaded ${rows.length} DB submissions`);
  return rows.map((r) => {
    const d = (r.submissionData || {}) as Record<string, any>;
    return {
      id: r.id,
      email: normEmail(d.email || d.noMemberEmail),
      fullName: norm(d.fullName || d.noMemberName),
      institution: norm(d.institution || d.centerName),
      casComm: normYesNo(d.wantsCommunications),
      cannComm: normYesNo(d.cannCommunications),
      mapInclusion: normYesNo(d.wantsServicesMapInclusion),
      sourceForm: r.sourceForm,
      zohoCrmId: r.zohoCrmId || '',
      created: r.createdAt,
    };
  });
}

function loadSSOT() {
  if (!fs.existsSync(SSOT_FILE)) throw new Error(`SSOT not found: ${SSOT_FILE}`);
  const wb = XLSX.readFile(SSOT_FILE);
  const sheet =
    wb.SheetNames.find((n) => n.toLowerCase() === 'ssot') || wb.SheetNames[0];
  const raw = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { defval: '' }) as Record<string, any>[];
  console.log(`[3-Way] Loaded ${raw.length} SSOT rows from sheet "${sheet}"`);

  const cols = Object.keys(raw[0] || {}).map((k) => k.trim());
  const find = (...candidates: string[]) => {
    for (const c of candidates) {
      const m = cols.find((col) => col.toLowerCase() === c.toLowerCase());
      if (m) return m;
    }
    for (const c of candidates) {
      const m = cols.find((col) => col.toLowerCase().includes(c.toLowerCase()));
      if (m) return m;
    }
    return null;
  };
  const colMap = {
    zohoId: find('zoho_lead_id', 'zoho id', 'zoho_id', 'lead_id'),
    firstName: find('first_name', 'firstname', 'first name'),
    lastName: find('last_name', 'lastname', 'last name'),
    email: find('email'),
    institution: find('institution', 'institution_name', 'company', 'centre'),
    casComm: find('cas_communications', 'cas comm', 'cas communications'),
    cannComm: find('cann_communications', 'cann comm', 'cann communications'),
    map: find('services_map_inclusion', 'map', 'services map'),
  };

  return raw.map((row, i) => {
    const rawId = colMap.zohoId ? norm(row[colMap.zohoId]) : '';
    const zohoId = rawId.startsWith('zcrm_') ? rawId.slice(5) : rawId;
    const fname = colMap.firstName ? norm(row[colMap.firstName]) : '';
    const lname = colMap.lastName ? norm(row[colMap.lastName]) : '';
    return {
      rowIndex: i + 2,
      zohoId,
      email: normEmail(colMap.email ? row[colMap.email] : ''),
      fullName: `${fname} ${lname}`.trim(),
      institution: colMap.institution ? norm(row[colMap.institution]) : '',
      casComm: normYesNo(colMap.casComm ? row[colMap.casComm] : ''),
      cannComm: normYesNo(colMap.cannComm ? row[colMap.cannComm] : ''),
      mapInclusion: normYesNo(colMap.map ? row[colMap.map] : ''),
    };
  });
}

async function loadCRM() {
  console.log('[3-Way] Fetching CRM leads...');
  const all: Record<string, any>[] = [];
  let page = 1;
  while (page <= 20) {
    const batch = await zohoCRMService.getRecords('Leads', {
      page,
      per_page: 200,
      fields: CRM_FIELDS,
    });
    if (!batch || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 200) break;
    page++;
  }
  console.log(`[3-Way] Loaded ${all.length} CRM leads`);
  return all.map((l) => ({
    id: String(l.id),
    email: normEmail(l.Email),
    fullName: `${norm(l.First_Name)} ${norm(l.Last_Name)}`.trim(),
    institution: norm(l.Institution_Name || l.Company),
    casComm: normYesNo(l.CAS_Communications),
    cannComm: normYesNo(l.CANN_Communications),
    mapInclusion: normYesNo(l.Services_Map_Inclusion),
    leadSource: norm(l.Lead_Source),
    sourceForm: norm(l.Source_Form),
  }));
}

async function buildComparison() {
  const [dbRows, ssotRows, crmRows] = await Promise.all([
    loadDB(),
    Promise.resolve(loadSSOT()),
    loadCRM(),
  ]);

  const people = new Map<string, Person>();

  const upsert = (key: string): Person => {
    if (!people.has(key)) {
      people.set(key, {
        key,
        email: '',
        fullName: '',
        institution: '',
        inDB: false,
        inSSOT: false,
        inCRM: false,
        dbIds: [],
        crmIds: [],
        ssotZohoIds: [],
        dbCASComm: '',
        ssotCASComm: '',
        crmCASComm: '',
        dbCANNComm: '',
        ssotCANNComm: '',
        crmCANNComm: '',
        dbMap: '',
        ssotMap: '',
        crmMap: '',
        dbInstitution: '',
        ssotInstitution: '',
        crmInstitution: '',
        discrepancies: [],
        notes: [],
      });
    }
    return people.get(key)!;
  };

  // Build name+institution index for fallback matching
  const dbByName = new Map<string, typeof dbRows>();
  const ssotByName = new Map<string, typeof ssotRows>();
  const crmByName = new Map<string, typeof crmRows>();
  const addToIndex = <T extends { fullName: string; institution: string }>(
    map: Map<string, T[]>,
    arr: T[]
  ) => {
    for (const r of arr) {
      const k = nameKey(r.fullName, r.institution);
      if (!k.startsWith('|') || k !== '|') {
        if (!map.has(k)) map.set(k, []);
        map.get(k)!.push(r);
      }
    }
  };
  addToIndex(dbByName, dbRows);
  addToIndex(ssotByName, ssotRows);
  addToIndex(crmByName, crmRows);

  // Pass 1: DB
  for (const r of dbRows) {
    if (isTestRecord(r.email, r.fullName)) continue;
    const key = r.email || nameKey(r.fullName, r.institution);
    if (!key || key === '|') continue;
    const p = upsert(key);
    p.email = p.email || r.email;
    p.fullName = p.fullName || r.fullName;
    p.institution = p.institution || r.institution;
    p.inDB = true;
    p.dbIds.push(r.id);
    p.dbCASComm = p.dbCASComm || r.casComm;
    p.dbCANNComm = p.dbCANNComm || r.cannComm;
    p.dbMap = p.dbMap || r.mapInclusion;
    p.dbInstitution = p.dbInstitution || r.institution;
    if (r.sourceForm) p.notes.push(`DB source: ${r.sourceForm}`);
  }

  // Pass 2: SSOT
  for (const r of ssotRows) {
    if (isTestRecord(r.email, r.fullName)) continue;
    const key = r.email || nameKey(r.fullName, r.institution);
    if (!key || key === '|') continue;
    const p = upsert(key);
    p.email = p.email || r.email;
    p.fullName = p.fullName || r.fullName;
    p.institution = p.institution || r.institution;
    p.inSSOT = true;
    if (r.zohoId) p.ssotZohoIds.push(r.zohoId);
    p.ssotCASComm = p.ssotCASComm || r.casComm;
    p.ssotCANNComm = p.ssotCANNComm || r.cannComm;
    p.ssotMap = p.ssotMap || r.mapInclusion;
    p.ssotInstitution = p.ssotInstitution || r.institution;
  }

  // Pass 3: CRM
  for (const r of crmRows) {
    if (isTestRecord(r.email, r.fullName)) continue;
    const keyByEmail = r.email;
    const keyByName = nameKey(r.fullName, r.institution);
    let key = keyByEmail || keyByName;
    if (!key || key === '|') continue;

    // If email key not yet seen but name+institution is, prefer the existing person
    if (keyByEmail && !people.has(keyByEmail) && people.has(keyByName)) {
      key = keyByName;
    }

    const p = upsert(key);
    p.email = p.email || r.email;
    p.fullName = p.fullName || r.fullName;
    p.institution = p.institution || r.institution;
    p.inCRM = true;
    p.crmIds.push(r.id);
    p.crmCASComm = p.crmCASComm || r.casComm;
    p.crmCANNComm = p.crmCANNComm || r.cannComm;
    p.crmMap = p.crmMap || r.mapInclusion;
    p.crmInstitution = p.crmInstitution || r.institution;
    if (r.leadSource) p.notes.push(`CRM Lead_Source: ${r.leadSource}`);
  }

  // Compute discrepancies
  for (const p of people.values()) {
    const sources = [p.inDB && 'DB', p.inSSOT && 'SSOT', p.inCRM && 'CRM'].filter(Boolean) as string[];
    if (sources.length < 3) {
      p.discrepancies.push(`Missing from: ${['DB', 'SSOT', 'CRM'].filter((s) => !sources.includes(s)).join(', ')}`);
    }
    if (p.crmIds.length > 1) p.discrepancies.push(`Duplicate in CRM (${p.crmIds.length} records)`);
    if (p.ssotZohoIds.length > 1) p.discrepancies.push(`Duplicate in SSOT (${p.ssotZohoIds.length} rows)`);

    const consistencyCheck = (label: string, db: string, ssot: string, crm: string) => {
      const present = [db && `DB=${db}`, ssot && `SSOT=${ssot}`, crm && `CRM=${crm}`].filter(Boolean);
      const values = new Set([db, ssot, crm].filter(Boolean));
      if (values.size > 1) p.discrepancies.push(`${label} mismatch: ${present.join(' / ')}`);
    };
    consistencyCheck('CAS Communications', p.dbCASComm, p.ssotCASComm, p.crmCASComm);
    consistencyCheck('CANN Communications', p.dbCANNComm, p.ssotCANNComm, p.crmCANNComm);
    consistencyCheck('Services Map', p.dbMap, p.ssotMap, p.crmMap);
  }

  // Build sheets
  const allRows = Array.from(people.values()).map((p) => ({
    Email: p.email,
    'Full Name': p.fullName,
    Institution: p.institution,
    'In DB?': p.inDB ? 'Yes' : 'No',
    'In SSOTv6?': p.inSSOT ? 'Yes' : 'No',
    'In CRM?': p.inCRM ? 'Yes' : 'No',
    'DB IDs': p.dbIds.join(', '),
    'SSOT Zoho IDs': p.ssotZohoIds.join(', '),
    'CRM Zoho IDs': p.crmIds.join(', '),
    'CAS Comm (DB)': p.dbCASComm,
    'CAS Comm (SSOT)': p.ssotCASComm,
    'CAS Comm (CRM)': p.crmCASComm,
    'CANN Comm (DB)': p.dbCANNComm,
    'CANN Comm (SSOT)': p.ssotCANNComm,
    'CANN Comm (CRM)': p.crmCANNComm,
    'Map (DB)': p.dbMap,
    'Map (SSOT)': p.ssotMap,
    'Map (CRM)': p.crmMap,
    'Discrepancies': p.discrepancies.join(' | '),
    'Notes': p.notes.join(' | '),
  }));

  // Sort: discrepancies first, then by name
  allRows.sort((a, b) => {
    if (!!a.Discrepancies !== !!b.Discrepancies) return a.Discrepancies ? -1 : 1;
    return (a['Full Name'] || '').localeCompare(b['Full Name'] || '');
  });

  // Discrepancies-only sheet
  const discRows = allRows.filter((r) => r.Discrepancies);

  // Duplicates summary
  const dupRows = Array.from(people.values())
    .filter((p) => p.crmIds.length > 1 || p.dbIds.length > 1 || p.ssotZohoIds.length > 1)
    .map((p) => ({
      Email: p.email,
      'Full Name': p.fullName,
      'DB count': p.dbIds.length,
      'SSOT count': p.ssotZohoIds.length,
      'CRM count': p.crmIds.length,
      'CRM Zoho IDs': p.crmIds.join(', '),
      'SSOT Zoho IDs': p.ssotZohoIds.join(', '),
    }));

  // Summary stats
  const summary = [
    { Metric: 'Generated', Value: new Date().toISOString() },
    { Metric: 'Unique people identified', Value: people.size },
    { Metric: 'In all three sources', Value: allRows.filter((r) => r['In DB?'] === 'Yes' && r['In SSOTv6?'] === 'Yes' && r['In CRM?'] === 'Yes').length },
    { Metric: 'In DB only', Value: allRows.filter((r) => r['In DB?'] === 'Yes' && r['In SSOTv6?'] === 'No' && r['In CRM?'] === 'No').length },
    { Metric: 'In SSOT only', Value: allRows.filter((r) => r['In DB?'] === 'No' && r['In SSOTv6?'] === 'Yes' && r['In CRM?'] === 'No').length },
    { Metric: 'In CRM only', Value: allRows.filter((r) => r['In DB?'] === 'No' && r['In SSOTv6?'] === 'No' && r['In CRM?'] === 'Yes').length },
    { Metric: 'In SSOT + CRM but not DB', Value: allRows.filter((r) => r['In DB?'] === 'No' && r['In SSOTv6?'] === 'Yes' && r['In CRM?'] === 'Yes').length },
    { Metric: 'In DB + CRM but not SSOT', Value: allRows.filter((r) => r['In DB?'] === 'Yes' && r['In SSOTv6?'] === 'No' && r['In CRM?'] === 'Yes').length },
    { Metric: 'Records with any discrepancy', Value: discRows.length },
    { Metric: 'Records with duplicates in any source', Value: dupRows.length },
    { Metric: 'CRM total leads scanned', Value: crmRows.length },
    { Metric: 'SSOT total rows scanned', Value: ssotRows.length },
    { Metric: 'DB total submissions scanned (excl. tests)', Value: dbRows.filter((r) => !isTestRecord(r.email, r.fullName)).length },
  ];

  const readme = [
    { Field: 'Title', Value: 'CAS / CANN — 3-Way Source Comparison' },
    { Field: 'Generated', Value: new Date().toISOString() },
    { Field: 'Sources compared', Value: 'Team Pumpkin DB  ⇄  SSOTv6 Excel  ⇄  Zoho CRM Leads' },
    { Field: 'Matching strategy', Value: '1. Exact email match. 2. Fallback: lowercased fullName + institution.' },
    { Field: 'Test records', Value: 'Excluded — see scripts/three-way-comparison.ts isTestRecord() for the rule.' },
    { Field: '', Value: '' },
    { Field: 'How to read', Value: 'Each row = one person. Yes/No columns show which sources contain them. Three "(DB|SSOT|CRM)" columns per consent field show conflicting values.' },
    { Field: 'Discrepancies sheet', Value: 'Filtered view of rows where any source disagrees or any source is missing.' },
    { Field: 'Duplicates sheet', Value: 'People with more than one record in any source.' },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(readme), 'README');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), 'Summary');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(discRows), 'Discrepancies');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dupRows), 'Duplicates');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(allRows), 'All People (full)');

  const dateStr = new Date().toISOString().slice(0, 10);
  const outDir = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `CAS_3Way_Comparison_${dateStr}.xlsx`);
  XLSX.writeFile(wb, outPath);

  console.log(`\n[3-Way] Output: ${outPath}`);
  console.log(`[3-Way] Summary:`);
  for (const s of summary) console.log(`  ${String(s.Value).padStart(8)}  ${s.Metric}`);
  return outPath;
}

buildComparison()
  .then((p) => {
    console.log(`\n✅ 3-Way Comparison ready: ${p}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ 3-Way Comparison failed:', err);
    process.exit(1);
  });
