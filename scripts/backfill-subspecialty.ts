/**
 * BACKFILL SUBSPECIALTY onto restored Leads
 *
 * Why: the restore-leads-inbox-model script missed Subspecialty because the
 * field api_name differs by module — Contacts uses `Subspecialty` (capital S)
 * while Leads uses `subspecialty` (lowercase). We fetched with the lowercase
 * name on Contacts, so the value came back null and was dropped.
 *
 * Recovery path: the original 274 Contacts are sitting in Zoho's recycle
 * bin, but the v8 PUT /Contacts/actions/restore endpoint silently no-ops in
 * this org (returns 200 with empty body, records stay deleted; v9 says the
 * id is invalid). Rather than block, we backfill from the canonical sources
 * the team already uses for SSOT:
 *
 *   - attached_assets/2026_04_CAS_CANN_Members_SSOTv6_FINAL_*.xlsx (203 with sub)
 *   - attached_assets/CAS Registration_*.xlsx (MS Forms YES + NO)
 *   - attached_assets/CANN Contacts_*.xlsx (MS Forms CANN)
 *
 * Steps:
 *   1. Build email → subspecialty map from the three sources (SSOT wins)
 *   2. Fetch all Leads (id, Email, subspecialty)
 *   3. Patch each matching Lead with `subspecialty` (lowercase) when missing
 *      or different
 *   4. Refresh docs/CAS_LEADS_RESTORE_2026-05-09.{json,xlsx}
 */
import * as fs from 'fs';
import * as path from 'path';
import XLSX from 'xlsx';
import { dedicatedTokenManager } from '../server/dedicated-token-manager';

const BASE = 'https://www.zohoapis.com/crm/v8';
const ORG = process.env.ZOHO_ORG_ID || '';
const DATE = new Date().toISOString().slice(0, 10);
const REPORT_JSON = path.join('docs', `CAS_LEADS_RESTORE_${DATE}.json`);
const REPORT_XLSX = path.join('docs', `CAS_LEADS_RESTORE_${DATE}.xlsx`);
const ASSETS = 'attached_assets';

const SSOT = path.join(ASSETS, '2026_04_CAS_CANN_Members_SSOTv6_FINAL_1776935708133.xlsx');
const MS_CAS = path.join(ASSETS, 'CAS Registration_1760548966285.xlsx');
const MS_CANN = path.join(ASSETS, 'CANN Contacts_1760548966283.xlsx');

const norm = (v: any) => (v ?? '').toString().trim();
const normEmail = (v: any) => norm(v).toLowerCase().replace(/\s+/g, '');

async function tok() { const t = await dedicatedTokenManager.getValidAccessToken('zoho_crm'); if (!t) throw new Error('no token'); return t; }
async function api(method: string, endpoint: string, body?: any): Promise<any> {
  const t = await tok();
  const h: any = { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' };
  if (ORG) h.orgId = ORG;
  const res = await fetch(`${BASE}${endpoint}`, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let json: any = {}; try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  if (!res.ok && res.status !== 204) throw new Error(`${method} ${endpoint} → ${res.status}: ${text.slice(0, 400)}`);
  return json;
}
async function fetchAll(module: string, fields: string): Promise<any[]> {
  const out: any[] = [];
  let page = 1;
  while (page <= 30) {
    const params = new URLSearchParams({ page: String(page), per_page: '200', fields });
    const r = await api('GET', `/${module}?${params.toString()}`);
    const b = r.data || [];
    if (!b.length) break;
    out.push(...b);
    if (b.length < 200) break;
    page++;
  }
  return out;
}

function loadSubspecialtyMap(): { map: Map<string, { sub: string; source: string }>; sources: Record<string, number> } {
  const map = new Map<string, { sub: string; source: string }>();
  const sources: Record<string, number> = { 'SSOT v6': 0, 'MS Forms - CAS YES': 0, 'MS Forms - CAS NO': 0, 'MS Forms - CANN': 0 };
  const set = (e: string, sub: string, source: string) => {
    e = normEmail(e); sub = norm(sub);
    if (!e || !sub) return;
    if (map.has(e)) return; // first writer wins (SSOT loaded first)
    map.set(e, { sub, source });
    sources[source] = (sources[source] || 0) + 1;
  };

  if (fs.existsSync(SSOT)) {
    const wb = XLSX.readFile(SSOT);
    const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets['SSOT'], { defval: '' });
    rows.forEach(r => set(r.email, r.subspecialty, 'SSOT v6'));
  }
  if (fs.existsSync(MS_CAS)) {
    const wb = XLSX.readFile(MS_CAS);
    const yes: any[] = XLSX.utils.sheet_to_json(wb.Sheets['YES Membership Applications'], { defval: '' });
    yes.forEach(r => set(r['Q3 (Yes): Email Address'], r['Q5 (Yes): Medical Subspecialty'], 'MS Forms - CAS YES'));
    yes.forEach(r => set(r['Q8 (No): Email Address'], r['Q10 (No): Medical Subspecialty'], 'MS Forms - CAS NO'));
    const no: any[] = XLSX.utils.sheet_to_json(wb.Sheets['NO Membership Applications'], { defval: '' });
    no.forEach(r => set(r['Q8: Email Address'], r['Q10: Medical Subspecialty'], 'MS Forms - CAS NO'));
  }
  if (fs.existsSync(MS_CANN)) {
    const wb = XLSX.readFile(MS_CANN);
    const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets['Sheet1'], { defval: '' });
    rows.forEach(r => set(r.email, r.subspecialty, 'MS Forms - CANN'));
  }
  return { map, sources };
}

(async () => {
  console.log('[Backfill] Loading subspecialty map from SSOT + MS Forms…');
  const { map, sources } = loadSubspecialtyMap();
  console.log(`[Backfill]   ${map.size} unique-email entries  (sources: ${JSON.stringify(sources)})`);

  console.log('[Backfill] Fetching Leads…');
  const leads = await fetchAll('Leads', 'id,Email,subspecialty');
  console.log(`[Backfill]   ${leads.length} Leads`);

  // Pre-state coverage
  const before = leads.filter((l: any) => norm(l.subspecialty)).length;

  const updates: any[] = [];
  const matchedBySource: Record<string, number> = {};
  const noMatch: { id: string; email: string }[] = [];
  for (const l of leads) {
    const e = normEmail(l.Email);
    if (!e) continue;
    const hit = map.get(e);
    if (!hit) { if (!norm(l.subspecialty)) noMatch.push({ id: l.id, email: l.Email }); continue; }
    if (norm(l.subspecialty) === hit.sub) continue;
    updates.push({ id: l.id, subspecialty: hit.sub });
    matchedBySource[hit.source] = (matchedBySource[hit.source] || 0) + 1;
  }
  console.log(`[Backfill]   ${updates.length} Leads to patch  (matched-by-source: ${JSON.stringify(matchedBySource)})`);
  console.log(`[Backfill]   ${noMatch.length} Leads still missing Subspecialty after backfill`);

  let okU = 0, failU = 0;
  const failures: any[] = [];
  for (let i = 0; i < updates.length; i += 100) {
    const chunk = updates.slice(i, i + 100);
    const r = await api('PUT', '/Leads', { data: chunk, trigger: [] });
    const items: any[] = r.data || [];
    items.forEach((it: any, j: number) => {
      if (it.status === 'success') okU++;
      else { failU++; failures.push({ id: chunk[j].id, code: it.code, message: it.message, details: it.details }); }
    });
    console.log(`  Patch batch ${i / 100 + 1}: ${items.filter(x => x.status === 'success').length}/${chunk.length} ok`);
  }
  console.log(`[Backfill]   Patched ok: ${okU} | failed: ${failU}`);

  // Refresh report
  console.log('[Backfill] Refreshing report…');
  const leadsFinal = await fetchAll('Leads',
    'id,First_Name,Last_Name,Email,CAS_Member,CANN_Member,Source_Form,Form_Submission_Date,Record_Type,Institution_Name,Professional_Designation,Amyloidosis_Type,CAS_Communications,CANN_Communications,Services_Map_Inclusion,subspecialty,Company,Lead_Source');
  const contactsFinal = await fetchAll('Contacts', 'id');
  const accountsFinal = await fetchAll('Accounts', 'id');

  const tracked = ['Email','Last_Name','First_Name','CAS_Member','CANN_Member','Source_Form','Form_Submission_Date','Record_Type','Institution_Name','Professional_Designation','Amyloidosis_Type','CAS_Communications','CANN_Communications','Services_Map_Inclusion','subspecialty','Company','Lead_Source'];
  const coverage: any = {};
  for (const f of tracked) {
    let p = 0;
    for (const r of leadsFinal) {
      const v = (r as any)[f];
      if (v !== null && v !== undefined && v !== '' && !(typeof v === 'object' && Object.keys(v).length === 0)) p++;
    }
    coverage[f] = { populated: p, total: leadsFinal.length, pct: leadsFinal.length ? Math.round(p / leadsFinal.length * 100) : 0 };
  }

  let prior: any = {};
  if (fs.existsSync(REPORT_JSON)) prior = JSON.parse(fs.readFileSync(REPORT_JSON, 'utf-8'));
  const report = {
    ...prior,
    generatedAt: new Date().toISOString(),
    after: {
      ...(prior.after || {}),
      totals: { leads: leadsFinal.length, contacts: contactsFinal.length, accounts: accountsFinal.length },
      fieldCoverageOnLeads: coverage,
    },
    subspecialtyBackfill: {
      sourcesLoaded: sources,
      subspecialtyMapSize: map.size,
      leadsTotal: leads.length,
      leadsWithSubspecialtyBefore: before,
      leadsPatched: okU,
      leadsPatchFailed: failU,
      patchFailures: failures.slice(0, 20),
      matchedBySource,
      leadsStillMissingAfterBackfill: noMatch.length,
      sampleStillMissing: noMatch.slice(0, 25),
      note: 'Restore-from-recycle was attempted via Zoho v8/v9 PUT /Contacts/actions/restore but is silently no-op in this org; backfill sourced from SSOT v6 + MS Forms instead (canonical truth).',
    },
  };
  fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2));
  console.log(`[Backfill]   JSON → ${REPORT_JSON}`);

  const wb = XLSX.utils.book_new();
  const summary = [
    { Metric: 'Mode', Value: 'live' },
    { Metric: 'Leads BEFORE', Value: report.before?.totals?.leads ?? 0 },
    { Metric: 'Contacts BEFORE', Value: report.before?.totals?.contacts ?? 274 },
    { Metric: 'Accounts BEFORE', Value: report.before?.totals?.accounts ?? 223 },
    { Metric: 'Leads AFTER', Value: leadsFinal.length },
    { Metric: 'Contacts AFTER', Value: contactsFinal.length },
    { Metric: 'Accounts AFTER', Value: accountsFinal.length },
    { Metric: 'Subspecialty on Leads BEFORE backfill', Value: before },
    { Metric: 'Subspecialty on Leads AFTER backfill', Value: coverage.subspecialty.populated },
    { Metric: 'Source SSOT v6 (used)', Value: matchedBySource['SSOT v6'] || 0 },
    { Metric: 'Source MS Forms - CAS YES (used)', Value: matchedBySource['MS Forms - CAS YES'] || 0 },
    { Metric: 'Source MS Forms - CAS NO (used)', Value: matchedBySource['MS Forms - CAS NO'] || 0 },
    { Metric: 'Source MS Forms - CANN (used)', Value: matchedBySource['MS Forms - CANN'] || 0 },
    { Metric: 'Leads still missing Subspecialty', Value: noMatch.length },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), 'Summary');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
    Object.entries(coverage).map(([Field, v]: any) => ({ Field, Populated: v.populated, Total: v.total, Pct: v.pct }))
  ), 'Lead Field Coverage');
  if (noMatch.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(noMatch.slice(0, 500)), 'Still Missing');
  if (failures.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(failures), 'Patch Failures');
  XLSX.writeFile(wb, REPORT_XLSX);
  console.log(`[Backfill]   XLSX → ${REPORT_XLSX}`);
  console.log('[Backfill] ✅ Done.');
})().catch(e => { console.error('[Backfill] FATAL:', e); process.exit(1); });
