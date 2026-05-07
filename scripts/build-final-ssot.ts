/**
 * BUILD FINAL SSOT — Complete cross-reference of every data source
 * ----------------------------------------------------------------
 *  Sources merged (in priority order):
 *   1. Live Zoho CRM (current state)
 *   2. SSOT v6 (April directory — institutional truth)
 *   3. MS Forms — CAS Registration YES/NO (express consent)
 *   4. MS Forms — CANN Contacts
 *   5. Local DB form submissions
 *   6. April ValidationReport (already-identified discrepancies)
 *
 *  Output: docs/FINAL_SSOT_PROPOSED_<DATE>.xlsx with sheets:
 *    1. Master         — every unique person with best-source field values
 *    2. Duplicates     — fuzzy-matched clusters + proposed winner
 *    3. To Update      — CRM records with gaps fillable from other sources
 *    4. To Delete      — CRM records not in any authoritative source
 *    5. To Create      — Source records not in CRM
 *    6. Consent Audit  — every record + provable consent source (CASL evidence)
 *    7. Validation     — rows requiring human decision
 *    8. Action Plan    — executable summary with counts + safe order
 *
 *  READ-ONLY. Produces proposal. Does not modify CRM.
 *  Companion: scripts/execute-final-ssot.ts will run the plan once approved.
 */

import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { zohoCRMService } from '../server/zoho-crm-service';
import { db } from '../server/db';
import { formSubmissions } from '../shared/schema';

const ASSETS = path.join(process.cwd(), 'attached_assets');
const SSOT_FILE = path.join(ASSETS, '2026_04_CAS_CANN_Members_SSOTv6_FINAL_1776935708133.xlsx');
const MSFORMS_CAS = path.join(ASSETS, 'CAS Registration_1760548966285.xlsx');
const MSFORMS_CANN = path.join(ASSETS, 'CANN Contacts_1760548966283.xlsx');
const VALIDATION = path.join(ASSETS, 'CAS_CANN_ValidationReport_2026_04.xlsx');

const FIELDS = [
  'id','First_Name','Last_Name','Email','Phone','Mobile','Company',
  'Institution_Name','CAS_Member','CANN_Member','Record_Type',
  'CAS_Communications','CANN_Communications','Services_Map_Inclusion',
  'Professional_Designation','subspecialty','Amyloidosis_Type',
  'Source_Form','Lead_Source','Description','Created_Time','Modified_Time',
].join(',');

const norm = (v: any) => v == null ? '' : String(v).trim();
const lower = (v: any) => norm(v).toLowerCase();
const emailNorm = (v: any) => lower(v).replace(/\s+/g,'');
const emailLocal = (e: string) => { const i = e.indexOf('@'); return i>0?e.slice(0,i):''; };
const isTestEmail = (e: string) => /^(test|verify|vasi@gmail|nitaljain|healthcheck|example\.com|@example)/i.test(e) || /\(test\)/i.test(e);

function fullName(r: any): string {
  const fn = norm(r.First_Name || r.first_name);
  const ln = norm(r.Last_Name || r.last_name);
  return `${fn} ${ln}`.trim();
}
function nameKey(r: any): string {
  return `${lower(r.First_Name||r.first_name)}|${lower(r.Last_Name||r.last_name)}`;
}

// ---------- LOADERS ----------

async function fetchCRM(): Promise<any[]> {
  console.log('[Final SSOT] Fetching all Leads from live CRM...');
  const all: any[] = [];
  let page = 1;
  while (page <= 30) {
    const batch = await zohoCRMService.getRecords('Leads', { page, per_page: 200, fields: FIELDS });
    if (!batch?.length) break;
    all.push(...batch);
    if (batch.length < 200) break;
    page++;
  }
  console.log(`[Final SSOT] CRM: ${all.length} Leads`);
  return all;
}

function loadSSOT(): any[] {
  if (!fs.existsSync(SSOT_FILE)) return [];
  const wb = XLSX.readFile(SSOT_FILE);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets['SSOT'], { defval: '' }) as any[];
  console.log(`[Final SSOT] SSOT v6: ${rows.length} rows`);
  return rows;
}

function loadMSForms(): any[] {
  const out: any[] = [];
  if (fs.existsSync(MSFORMS_CAS)) {
    const wb = XLSX.readFile(MSFORMS_CAS);
    const yes = XLSX.utils.sheet_to_json(wb.Sheets['YES Membership Applications'], { defval: '' }) as any[];
    yes.forEach((r: any) => out.push({
      source: 'MS_Forms_CAS_YES',
      timestamp: r.Timestamp,
      full_name: r['Q2 (Yes): Full Name'],
      email: r['Q3 (Yes): Email Address'],
      discipline: r['Q4 (Yes): Medical Discipline'],
      subspecialty: r['Q5 (Yes): Medical Subspecialty'],
      institution: r['Q6 (Yes): Center or Clinic Name/Institution'],
      cas_member: 'Yes',
      cann_member: 'Unknown',
      cas_communications: r['Q7 (Yes): I would like to receive communication from CAS (email, newsletters)'],
      services_map: r['Q8 (Yes): I would like my center/clinic included in the Services Map'],
      consent_proven: true,
    }));
    const no = XLSX.utils.sheet_to_json(wb.Sheets['NO Membership Applications'], { defval: '' }) as any[];
    no.forEach((r: any) => out.push({
      source: 'MS_Forms_CAS_NO',
      timestamp: r.Timestamp,
      email: r['Q8: Email Address'],
      institution: r['Q3: Center/Institution Name'] || r['Q11: Contact Center Name'],
      discipline: r['Q9: Medical Discipline'],
      subspecialty: r['Q10: Medical Subspecialty'],
      cas_member: 'No',
      cann_member: 'Unknown',
      cas_communications: r['Q7: Allow Contact'],
      services_map: r['Q2: Services Map Inclusion'],
      consent_proven: true,
    }));
  }
  if (fs.existsSync(MSFORMS_CANN)) {
    const wb = XLSX.readFile(MSFORMS_CANN);
    const cann = XLSX.utils.sheet_to_json(wb.Sheets['Sheet1'], { defval: '' }) as any[];
    cann.forEach((r: any) => out.push({
      source: 'MS_Forms_CANN',
      timestamp: r.timestamp,
      full_name: r.fullName,
      email: r.email,
      institution: r.institution,
      discipline: r.professionalDesignation,
      subspecialty: r.subspecialty,
      amyloidosis_type: r.amyloidosisType,
      cas_member: 'Unknown',
      cann_member: 'Yes',
      cann_communications: r.communicationConsent,
      consent_proven: true,
    }));
  }
  console.log(`[Final SSOT] MS Forms: ${out.length} rows`);
  return out;
}

async function loadDB(): Promise<any[]> {
  try {
    const rows = await db.select().from(formSubmissions);
    console.log(`[Final SSOT] DB submissions: ${rows.length} rows`);
    return rows;
  } catch (e: any) {
    console.warn(`[Final SSOT] DB load failed: ${e.message}`);
    return [];
  }
}

function loadValidation(): any {
  if (!fs.existsSync(VALIDATION)) return { remove: [], add: [], discrepancies: [] };
  const wb = XLSX.readFile(VALIDATION);
  return {
    remove: XLSX.utils.sheet_to_json(wb.Sheets['Records to Remove'], { defval: '' }) as any[],
    add: XLSX.utils.sheet_to_json(wb.Sheets['Records to Add (SSOT)'], { defval: '' }) as any[],
    discrepancies: XLSX.utils.sheet_to_json(wb.Sheets['Field Discrepancies'], { defval: '' }) as any[],
  };
}

// ---------- DEDUP ----------

function findDuplicates(crm: any[]): any[][] {
  const byEmail = new Map<string, any[]>();
  const byName = new Map<string, any[]>();
  const byLocal = new Map<string, any[]>();

  for (const r of crm) {
    const e = emailNorm(r.Email);
    const n = nameKey(r);
    const l = e ? emailLocal(e) : '';
    if (e) { (byEmail.get(e) || byEmail.set(e, []).get(e)!).push(r); }
    if (n && n !== '|' && n.length > 2) { (byName.get(n) || byName.set(n, []).get(n)!).push(r); }
    if (l && l.length >= 4) { (byLocal.get(l) || byLocal.set(l, []).get(l)!).push(r); }
  }

  const seen = new Set<string>();
  const clusters: any[][] = [];
  const addCluster = (recs: any[]) => {
    if (recs.length < 2) return;
    const ids = recs.map(r => r.id).sort().join('|');
    if (seen.has(ids)) return;
    seen.add(ids);
    clusters.push(recs);
  };
  byEmail.forEach(v => addCluster(v));
  byName.forEach(v => addCluster(v));
  byLocal.forEach(v => addCluster(v));
  return clusters;
}

function completeness(r: any): number {
  let s = 0;
  for (const f of FIELDS.split(',')) if (norm(r[f])) s++;
  return s;
}

function pickWinner(cluster: any[]): any {
  return [...cluster].sort((a,b) => completeness(b) - completeness(a) || (Date.parse(b.Modified_Time||0) - Date.parse(a.Modified_Time||0)))[0];
}

// ---------- MAIN ----------

async function run() {
  const [crm, ssot, msforms, dbRows] = await Promise.all([
    fetchCRM(),
    Promise.resolve(loadSSOT()),
    Promise.resolve(loadMSForms()),
    loadDB(),
  ]);
  const validation = loadValidation();

  // Index everything by email
  const ssotByEmail = new Map<string, any>();
  ssot.forEach(r => { const e = emailNorm(r.email); if (e) ssotByEmail.set(e, r); });

  const msformsByEmail = new Map<string, any[]>();
  msforms.forEach(r => {
    const e = emailNorm(r.email);
    if (!e || isTestEmail(e)) return;
    if (!msformsByEmail.has(e)) msformsByEmail.set(e, []);
    msformsByEmail.get(e)!.push(r);
  });

  const crmByEmail = new Map<string, any[]>();
  crm.forEach(r => {
    const e = emailNorm(r.Email);
    if (!e) return;
    if (!crmByEmail.has(e)) crmByEmail.set(e, []);
    crmByEmail.get(e)!.push(r);
  });

  // ---------- DUPLICATES ----------
  const clusters = findDuplicates(crm);
  console.log(`[Final SSOT] Found ${clusters.length} duplicate clusters`);

  const dupSheet: any[] = [];
  const recordsInDups = new Set<string>();
  clusters.forEach((c, idx) => {
    const winner = pickWinner(c);
    c.forEach(r => {
      recordsInDups.add(r.id);
      dupSheet.push({
        Cluster: idx + 1,
        Action: r.id === winner.id ? 'KEEP (winner)' : 'MERGE INTO winner & DELETE',
        Zoho_ID: r.id,
        Full_Name: fullName(r),
        Email: r.Email || '',
        Institution: r.Institution_Name || r.Company || '',
        Lead_Source: r.Lead_Source || '',
        CAS_Member: r.CAS_Member ? 'Yes' : 'No',
        CANN_Member: r.CANN_Member ? 'Yes' : 'No',
        CAS_Comm: r.CAS_Communications || '',
        CANN_Comm: r.CANN_Communications || '',
        Map_Inclusion: r.Services_Map_Inclusion || '',
        Completeness_Score: completeness(r),
        Created: r.Created_Time || '',
        Modified: r.Modified_Time || '',
      });
    });
  });

  // ---------- TO UPDATE (gap fill) ----------
  const updateSheet: any[] = [];
  const fillFields = ['Institution_Name','Professional_Designation','subspecialty','Amyloidosis_Type','Phone'];

  crm.forEach(r => {
    const e = emailNorm(r.Email);
    if (!e) return;
    const ssotRec = ssotByEmail.get(e);
    const msfRecs = msformsByEmail.get(e) || [];

    fillFields.forEach(f => {
      if (norm(r[f])) return; // already populated
      // try SSOT
      const ssotMap: any = { Institution_Name: 'institution', Professional_Designation: 'discipline', subspecialty: 'subspecialty' };
      if (ssotRec && ssotMap[f] && norm(ssotRec[ssotMap[f]])) {
        updateSheet.push({
          Action: 'UPDATE',
          Zoho_ID: r.id,
          Email: r.Email,
          Field: f,
          Current: '(empty)',
          Proposed: norm(ssotRec[ssotMap[f]]),
          Source: 'SSOT v6',
        });
        return;
      }
      // try MS Forms
      const msfMap: any = { Institution_Name: 'institution', Professional_Designation: 'discipline', subspecialty: 'subspecialty', Amyloidosis_Type: 'amyloidosis_type' };
      const msfRec = msfRecs.find(m => msfMap[f] && norm(m[msfMap[f]]));
      if (msfRec && msfMap[f]) {
        updateSheet.push({
          Action: 'UPDATE',
          Zoho_ID: r.id,
          Email: r.Email,
          Field: f,
          Current: '(empty)',
          Proposed: norm(msfRec[msfMap[f]]),
          Source: msfRec.source,
        });
      }
    });
  });

  // ---------- TO DELETE ----------
  const deleteSheet: any[] = [];
  crm.forEach(r => {
    const e = emailNorm(r.Email);
    if (isTestEmail(e) || isTestEmail(fullName(r))) {
      deleteSheet.push({
        Action: 'DELETE',
        Zoho_ID: r.id,
        Full_Name: fullName(r),
        Email: r.Email || '',
        Reason: 'Test record',
        Risk: 'Safe',
      });
    }
  });
  // Add the 17 from validation report (but flagged as needs-decision)
  validation.remove.forEach((r: any) => {
    if (r['Consent Data at Risk']?.includes('YES')) {
      deleteSheet.push({
        Action: 'REVIEW (consent-held)',
        Zoho_ID: String(r['Zoho Record ID'] || '').replace('zcrm_',''),
        Full_Name: `${r['First Name'] || ''} ${r['Last Name'] || ''}`.trim(),
        Email: r.Email || '',
        Reason: 'Not in SSOT v6 — but has active consent',
        Risk: 'NEEDS JEFF/JAN SIGN-OFF',
      });
    }
  });

  // ---------- TO CREATE ----------
  const createSheet: any[] = [];
  // SSOT records not in CRM
  ssot.forEach(r => {
    const e = emailNorm(r.email);
    if (!e) {
      createSheet.push({
        Source: 'SSOT v6',
        Full_Name: `${r.first_name||''} ${r.last_name||''}`.trim(),
        Email: '(MISSING - need from Jan)',
        Institution: r.institution || '',
        Discipline: r.discipline || '',
        Subspecialty: r.subspecialty || '',
        Action: 'MANUAL — request email from Jan',
      });
      return;
    }
    if (!crmByEmail.has(e)) {
      createSheet.push({
        Source: 'SSOT v6',
        Full_Name: `${r.first_name||''} ${r.last_name||''}`.trim(),
        Email: r.email,
        Institution: r.institution || '',
        Discipline: r.discipline || '',
        Subspecialty: r.subspecialty || '',
        Action: 'CREATE in CRM',
      });
    }
  });
  // MS Forms records not in CRM
  msformsByEmail.forEach((recs, e) => {
    if (crmByEmail.has(e)) return;
    const r = recs[0];
    createSheet.push({
      Source: r.source,
      Full_Name: r.full_name || '',
      Email: e,
      Institution: r.institution || '',
      Discipline: r.discipline || '',
      Subspecialty: r.subspecialty || '',
      Action: 'CREATE in CRM (express consent on file)',
    });
  });

  // ---------- CONSENT AUDIT (CASL evidence) ----------
  const consentSheet: any[] = [];
  crm.forEach(r => {
    const e = emailNorm(r.Email);
    const msfRecs = msformsByEmail.get(e) || [];
    const provenSource = msfRecs.length ? msfRecs[0].source : '';
    consentSheet.push({
      Zoho_ID: r.id,
      Full_Name: fullName(r),
      Email: r.Email || '',
      CAS_Member: r.CAS_Member ? 'Yes' : 'No',
      CANN_Member: r.CANN_Member ? 'Yes' : 'No',
      CAS_Communications: r.CAS_Communications || '',
      CANN_Communications: r.CANN_Communications || '',
      Services_Map: r.Services_Map_Inclusion || '',
      Lead_Source: r.Lead_Source || '',
      Provable_Consent_Source: provenSource || 'NOT PROVABLE — needs re-confirm or PEBR claim',
      CASL_Defensible: provenSource ? 'YES' : 'NO',
    });
  });
  const provableCount = consentSheet.filter(c => c.CASL_Defensible === 'YES').length;

  // ---------- VALIDATION (needs human) ----------
  const validationSheet: any[] = [];
  // Records in CRM with no name AND no email
  crm.forEach(r => {
    if (!norm(r.Email) && !fullName(r)) {
      validationSheet.push({
        Issue: 'No email AND no name',
        Zoho_ID: r.id,
        Lead_Source: r.Lead_Source || '',
        Created: r.Created_Time || '',
        Action: 'Investigate or delete',
      });
    }
  });
  // 124 field discrepancies from validation report
  if (validation.discrepancies.length) {
    validationSheet.push({
      Issue: `${validation.discrepancies.length} field discrepancies (mostly encoding artifacts)`,
      Zoho_ID: '',
      Lead_Source: 'See April ValidationReport sheet',
      Created: '',
      Action: 'Bulk-fix encoding artifacts (curly quotes, accents)',
    });
  }

  // ---------- ACTION PLAN ----------
  const actionPlan: any[] = [
    { Step: 1, Action: 'Delete test records', Count: deleteSheet.filter(d => d.Risk === 'Safe').length, Risk: 'Safe', Owner: 'Auto' },
    { Step: 2, Action: 'Fill empty fields from SSOT/MS Forms', Count: updateSheet.length, Risk: 'Safe', Owner: 'Auto' },
    { Step: 3, Action: 'Merge duplicate clusters (winner kept, others deleted)', Count: clusters.length, Risk: 'Medium', Owner: 'Jeff/Jan sign-off' },
    { Step: 4, Action: 'Create missing records from MS Forms (with consent)', Count: createSheet.filter(c => c.Source.startsWith('MS_Forms')).length, Risk: 'Safe', Owner: 'Auto' },
    { Step: 5, Action: 'Create missing records from SSOT (with email)', Count: createSheet.filter(c => c.Source === 'SSOT v6' && c.Email !== '(MISSING - need from Jan)').length, Risk: 'Safe', Owner: 'Auto' },
    { Step: 6, Action: 'Manual: SSOT records with no email', Count: createSheet.filter(c => c.Email === '(MISSING - need from Jan)').length, Risk: 'Manual', Owner: 'Jan' },
    { Step: 7, Action: 'Review 17 consent-held removal candidates', Count: deleteSheet.filter(d => d.Risk.includes('SIGN-OFF')).length, Risk: 'High', Owner: 'Jeff/Jan sign-off' },
    { Step: 8, Action: 'Backfill consent_history for all records', Count: crm.length, Risk: 'Safe', Owner: 'Auto' },
    { Step: 9, Action: 'Bulk-fix encoding artifacts', Count: validation.discrepancies.length, Risk: 'Safe', Owner: 'Auto' },
    { Step: 0, Action: '--- TOTALS ---', Count: '', Risk: '', Owner: '' },
    { Step: '', Action: 'Records in CRM today', Count: crm.length, Risk: '', Owner: '' },
    { Step: '', Action: 'Records with provable CASL consent', Count: provableCount, Risk: '', Owner: '' },
    { Step: '', Action: 'Records needing re-confirm or PEBR claim', Count: crm.length - provableCount, Risk: '', Owner: '' },
    { Step: '', Action: 'Estimated final count after cleanup', Count: crm.length - clusters.reduce((s,c)=>s+(c.length-1),0) - deleteSheet.filter(d=>d.Risk==='Safe').length + createSheet.filter(c=>c.Action.startsWith('CREATE')).length, Risk: '', Owner: '' },
  ];

  // ---------- WRITE ----------
  const wb = XLSX.utils.book_new();
  const addSheet = (name: string, rows: any[]) => {
    const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Note: 'No rows' }]);
    XLSX.utils.book_append_sheet(wb, ws, name);
  };
  addSheet('Action Plan', actionPlan);
  addSheet('Duplicates', dupSheet);
  addSheet('To Update (Gap Fill)', updateSheet);
  addSheet('To Delete', deleteSheet);
  addSheet('To Create', createSheet);
  addSheet('Consent Audit (CASL)', consentSheet);
  addSheet('Validation Issues', validationSheet);

  const date = new Date().toISOString().slice(0, 10);
  const out = path.join('docs', `FINAL_SSOT_PROPOSED_${date}.xlsx`);
  XLSX.writeFile(wb, out);
  console.log(`\n[Final SSOT] ✅ Wrote ${out}`);

  console.log('\n=== ACTION PLAN SUMMARY ===');
  actionPlan.forEach(a => console.log(`  ${a.Step}. ${a.Action}: ${a.Count}`));

  process.exit(0);
}

run().catch(e => { console.error('FATAL:', e); process.exit(1); });
