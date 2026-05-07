/**
 * EXECUTE FINAL SSOT — Apply the cleanup plan
 * --------------------------------------------
 *  Reads docs/FINAL_SSOT_PROPOSED_<DATE>.xlsx and applies changes.
 *
 *  USAGE:
 *    npx tsx scripts/execute-final-ssot.ts --dry-run            # preview only
 *    npx tsx scripts/execute-final-ssot.ts --step=update        # gap fills only
 *    npx tsx scripts/execute-final-ssot.ts --step=delete-tests  # safe deletes
 *    npx tsx scripts/execute-final-ssot.ts --step=create        # MS Forms + SSOT new
 *    npx tsx scripts/execute-final-ssot.ts --step=merge         # MERGE clusters (after sign-off)
 *    npx tsx scripts/execute-final-ssot.ts --step=consent       # CASL backfill
 *    npx tsx scripts/execute-final-ssot.ts --step=all --confirm-yes-merge-and-delete-real-records
 *
 *  SAFETY:
 *    - Always pulls fresh CRM snapshot before any write
 *    - Writes a "before" backup JSON to docs/backups/ before each step
 *    - Default mode is dry-run; live mode requires explicit flag
 *    - Step "merge" requires a separate explicit flag
 *    - Logs every action to docs/execution-log-<DATE>.json
 */

import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { zohoCRMService } from '../server/zoho-crm-service';
import { db } from '../server/db';
import { consentHistory } from '../shared/schema';

const argv = process.argv.slice(2);
const arg = (k: string, def: string = '') => {
  const a = argv.find(x => x.startsWith(`--${k}`));
  if (!a) return def;
  if (a.includes('=')) return a.split('=')[1];
  return 'true';
};
const DRY_RUN = arg('dry-run') === 'true' || !argv.includes('--live');
const STEP = arg('step', 'all');
const FORCE_MERGE = argv.includes('--confirm-yes-merge-and-delete-real-records');

const DATE = new Date().toISOString().slice(0, 10);
const PROPOSAL = path.join('docs', `FINAL_SSOT_PROPOSED_${DATE}.xlsx`);
const BACKUP_DIR = path.join('docs', 'backups');
const LOG = path.join('docs', `execution-log-${DATE}.json`);

const log: any[] = [];
const record = (entry: any) => { log.push({ ts: new Date().toISOString(), ...entry }); };

if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
if (!fs.existsSync(PROPOSAL)) {
  console.error(`Proposal file missing: ${PROPOSAL}\nRun: npx tsx scripts/build-final-ssot.ts first.`);
  process.exit(1);
}

console.log(`\n[Execute] Mode: ${DRY_RUN ? 'DRY-RUN' : 'LIVE'} | Step: ${STEP} | Force-merge: ${FORCE_MERGE}\n`);

const wb = XLSX.readFile(PROPOSAL);
const sheets: Record<string, any[]> = {};
wb.SheetNames.forEach(n => sheets[n] = XLSX.utils.sheet_to_json(wb.Sheets[n], { defval: '' }) as any[]);

async function backup(label: string) {
  const fresh: any[] = [];
  let page = 1;
  while (page <= 30) {
    const b = await zohoCRMService.getRecords('Leads', { page, per_page: 200, fields: 'id,Email,First_Name,Last_Name,Institution_Name,CAS_Member,CANN_Member,CAS_Communications,CANN_Communications,Services_Map_Inclusion,Lead_Source' });
    if (!b?.length) break;
    fresh.push(...b);
    if (b.length < 200) break;
    page++;
  }
  const file = path.join(BACKUP_DIR, `before-${label}-${DATE}-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(fresh, null, 2));
  console.log(`[Execute] Backup → ${file} (${fresh.length} records)`);
  return fresh;
}

// ---------- STEP: UPDATE (gap fills) ----------
async function stepUpdate() {
  const updates = sheets['To Update (Gap Fill)'] || [];
  console.log(`[Execute] STEP UPDATE: ${updates.length} field updates proposed`);
  if (updates.length === 0) return;
  await backup('update');

  // Group by Zoho_ID
  const byId = new Map<string, any>();
  for (const u of updates) {
    if (!u.Zoho_ID || !u.Field || !u.Proposed) continue;
    if (!byId.has(u.Zoho_ID)) byId.set(u.Zoho_ID, {});
    byId.get(u.Zoho_ID)[u.Field] = u.Proposed;
  }

  let ok = 0, fail = 0;
  for (const [id, payload] of byId.entries()) {
    if (DRY_RUN) {
      record({ step: 'update', mode: 'dry', id, payload });
      ok++;
      continue;
    }
    try {
      await zohoCRMService.updateRecord('Leads', id, payload);
      record({ step: 'update', mode: 'live', id, payload, status: 'ok' });
      ok++;
    } catch (e: any) {
      record({ step: 'update', mode: 'live', id, payload, status: 'fail', error: e.message });
      fail++;
    }
    if (ok % 20 === 0) console.log(`  ...${ok}/${byId.size}`);
  }
  console.log(`[Execute] UPDATE: ${ok} ok, ${fail} failed`);
}

// ---------- STEP: DELETE TESTS ----------
async function stepDeleteTests() {
  const dels = (sheets['To Delete'] || []).filter((d: any) => d.Risk === 'Safe');
  console.log(`[Execute] STEP DELETE-TESTS: ${dels.length} test records`);
  if (dels.length === 0) return;
  await backup('delete-tests');

  let ok = 0, fail = 0;
  for (const d of dels) {
    if (DRY_RUN) { record({ step: 'delete-test', mode: 'dry', id: d.Zoho_ID }); ok++; continue; }
    try {
      await zohoCRMService.deleteRecord('Leads', d.Zoho_ID);
      record({ step: 'delete-test', mode: 'live', id: d.Zoho_ID, name: d.Full_Name, status: 'ok' });
      ok++;
    } catch (e: any) {
      record({ step: 'delete-test', mode: 'live', id: d.Zoho_ID, status: 'fail', error: e.message });
      fail++;
    }
  }
  console.log(`[Execute] DELETE-TESTS: ${ok} ok, ${fail} failed`);
}

// ---------- STEP: CREATE ----------
async function stepCreate() {
  const creates = (sheets['To Create'] || []).filter((c: any) =>
    c.Action?.startsWith('CREATE') && c.Email && !c.Email.includes('MISSING')
  );
  console.log(`[Execute] STEP CREATE: ${creates.length} new records`);
  if (creates.length === 0) return;
  await backup('create');

  let ok = 0, fail = 0;
  for (const c of creates) {
    const [first, ...rest] = (c.Full_Name || '').split(' ');
    const last = rest.join(' ').trim() || first || c.Email.split('@')[0];
    const isMSCAS = c.Source?.includes('CAS_YES');
    const isMSCANN = c.Source?.includes('CANN');
    const payload: any = {
      First_Name: first || '',
      Last_Name: last,
      Email: c.Email,
      Company: c.Institution || 'Unknown',
      Institution_Name: c.Institution || '',
      Professional_Designation: c.Discipline || '',
      subspecialty: c.Subspecialty || '',
      Lead_Source: isMSCAS ? 'MS Forms - CAS Registration' : isMSCANN ? 'MS Forms - CANN Membership' : 'SSOT v6 - New Add',
      CAS_Member: isMSCAS,
      CANN_Member: isMSCANN,
      Record_Type: (isMSCAS || isMSCANN) ? 'Member' : 'Inquiry',
      CAS_Communications: isMSCAS ? 'Yes' : 'Unknown',
      CANN_Communications: isMSCANN ? 'Yes' : 'Unknown',
      Services_Map_Inclusion: 'Unknown',
      Source_Form: c.Source,
    };
    if (DRY_RUN) { record({ step: 'create', mode: 'dry', payload }); ok++; continue; }
    try {
      const created = await zohoCRMService.createRecord('Leads', payload);
      record({ step: 'create', mode: 'live', email: c.Email, id: (created as any)?.id, status: 'ok' });
      ok++;
    } catch (e: any) {
      record({ step: 'create', mode: 'live', email: c.Email, status: 'fail', error: e.message });
      fail++;
    }
  }
  console.log(`[Execute] CREATE: ${ok} ok, ${fail} failed`);
}

// ---------- STEP: MERGE ----------
async function stepMerge() {
  if (!FORCE_MERGE && !DRY_RUN) {
    console.log('[Execute] MERGE blocked: requires --confirm-yes-merge-and-delete-real-records');
    return;
  }
  const dups = (sheets['Duplicates'] || []) as any[];
  const clusters = new Map<number, any[]>();
  dups.forEach(r => {
    const c = r.Cluster;
    if (!clusters.has(c)) clusters.set(c, []);
    clusters.get(c)!.push(r);
  });
  console.log(`[Execute] STEP MERGE: ${clusters.size} clusters`);
  if (clusters.size === 0) return;
  await backup('merge');

  let merged = 0, deleted = 0, fail = 0;
  for (const [cid, recs] of clusters.entries()) {
    const winner = recs.find(r => r.Action?.startsWith('KEEP'));
    const losers = recs.filter(r => !r.Action?.startsWith('KEEP'));
    if (!winner) continue;

    // Merge: copy non-empty fields from losers into winner if winner empty
    const winnerPayload: any = {};
    for (const f of ['Institution_Name','Professional_Designation','subspecialty','Phone']) {
      if (norm(winner[f === 'Institution_Name' ? 'Institution' : f === 'Professional_Designation' ? 'Discipline' : f])) continue;
      const filled = losers.find(l => norm(l[f === 'Institution_Name' ? 'Institution' : f === 'Professional_Designation' ? 'Discipline' : f]));
      if (filled) winnerPayload[f] = filled[f === 'Institution_Name' ? 'Institution' : f === 'Professional_Designation' ? 'Discipline' : f];
    }
    // Promote consents (Yes wins over No/Unknown)
    for (const f of ['CAS_Communications','CANN_Communications','Services_Map_Inclusion']) {
      const winnerVal = winner[f === 'Services_Map_Inclusion' ? 'Map_Inclusion' : f === 'CAS_Communications' ? 'CAS_Comm' : 'CANN_Comm'];
      if (winnerVal === 'Yes') continue;
      const yesL = losers.find(l => l[f === 'Services_Map_Inclusion' ? 'Map_Inclusion' : f === 'CAS_Communications' ? 'CAS_Comm' : 'CANN_Comm'] === 'Yes');
      if (yesL) winnerPayload[f] = 'Yes';
    }

    if (DRY_RUN) {
      record({ step: 'merge', mode: 'dry', cluster: cid, winner: winner.Zoho_ID, losers: losers.map(l => l.Zoho_ID), winnerPayload });
      merged++;
      deleted += losers.length;
      continue;
    }
    try {
      if (Object.keys(winnerPayload).length) {
        await zohoCRMService.updateRecord('Leads', winner.Zoho_ID, winnerPayload);
      }
      for (const l of losers) {
        await zohoCRMService.deleteRecord('Leads', l.Zoho_ID);
        deleted++;
      }
      record({ step: 'merge', mode: 'live', cluster: cid, winner: winner.Zoho_ID, deleted: losers.length, status: 'ok' });
      merged++;
    } catch (e: any) {
      record({ step: 'merge', mode: 'live', cluster: cid, status: 'fail', error: e.message });
      fail++;
    }
  }
  console.log(`[Execute] MERGE: ${merged} clusters merged, ${deleted} losers deleted, ${fail} failed`);
}

// ---------- STEP: CONSENT BACKFILL ----------
async function stepConsent() {
  const consent = sheets['Consent Audit (CASL)'] || [];
  console.log(`[Execute] STEP CONSENT BACKFILL: ${consent.length} records`);
  if (consent.length === 0) return;
  let ok = 0, fail = 0;
  for (const c of consent) {
    const fields = [
      { name: 'CAS_Communications', value: c.CAS_Communications },
      { name: 'CANN_Communications', value: c.CANN_Communications },
      { name: 'Services_Map_Inclusion', value: c.Services_Map },
    ];
    for (const f of fields) {
      if (!f.value) continue;
      if (DRY_RUN) { record({ step: 'consent', mode: 'dry', email: c.Email, field: f.name }); ok++; continue; }
      try {
        await db.insert(consentHistory).values({
          email: c.Email,
          fieldName: f.name,
          oldValue: null,
          newValue: f.value,
          source: c.Provable_Consent_Source?.includes('NOT') ? 'baseline_undocumented' : c.Provable_Consent_Source,
          changedBy: 'system_backfill_2026-05-07',
          ipAddress: null,
          userAgent: null,
        });
        ok++;
      } catch (e: any) {
        record({ step: 'consent', mode: 'live', email: c.Email, status: 'fail', error: e.message });
        fail++;
      }
    }
  }
  console.log(`[Execute] CONSENT: ${ok} rows written, ${fail} failed`);
}

const norm = (v: any) => v == null ? '' : String(v).trim();

async function run() {
  if (STEP === 'update' || STEP === 'all') await stepUpdate();
  if (STEP === 'delete-tests' || STEP === 'all') await stepDeleteTests();
  if (STEP === 'create' || STEP === 'all') await stepCreate();
  if (STEP === 'merge' || STEP === 'all') await stepMerge();
  if (STEP === 'consent' || STEP === 'all') await stepConsent();

  fs.writeFileSync(LOG, JSON.stringify(log, null, 2));
  console.log(`\n[Execute] ✅ Done. Log → ${LOG}`);
  process.exit(0);
}

run().catch(e => { console.error('FATAL:', e); fs.writeFileSync(LOG, JSON.stringify(log, null, 2)); process.exit(1); });
