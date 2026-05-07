/**
 * Duplicate Detector + Merge Proposal (READ-ONLY)
 * -----------------------------------------------
 * Finds duplicate Lead clusters in live Zoho CRM using:
 *   1. Exact email match (case-insensitive)
 *   2. Fuzzy name match: same first + last name (case + whitespace insensitive)
 *   3. Fuzzy email match: local-part match across different domains
 *      (e.g. jane.doe@gmail.com  ⇄  jane.doe@hospital.ca)
 *   4. Phone match (last 10 digits, ignoring formatting)
 *
 * For each cluster: ranks records by data completeness so Jeff/Jan
 * can see at a glance which record should "win" in a merge.
 *
 * DOES NOT MERGE OR DELETE ANY RECORDS. Read-only.
 *
 * Output: docs/CAS_Duplicate_Merge_Proposal_<DATE>.xlsx
 */

import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { zohoCRMService } from '../server/zoho-crm-service';

const FIELDS = [
  'id', 'First_Name', 'Last_Name', 'Email', 'Phone', 'Mobile',
  'Company', 'Institution_Name',
  'CAS_Member', 'CANN_Member', 'Record_Type',
  'CAS_Communications', 'CANN_Communications', 'Services_Map_Inclusion',
  'Professional_Designation', 'subspecialty', 'Amyloidosis_Type',
  'Source_Form', 'Lead_Source',
  'Created_Time', 'Modified_Time',
].join(',');

function norm(v: any): string {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}
function lower(v: any): string {
  return norm(v).toLowerCase();
}
function nameKey(r: any): string {
  return `${lower(r.First_Name)}|${lower(r.Last_Name)}`;
}
function emailLocal(e: string): string {
  const at = e.indexOf('@');
  return at > 0 ? e.slice(0, at).toLowerCase() : '';
}
function phoneDigits(p: any): string {
  return norm(p).replace(/\D/g, '').slice(-10);
}

function completeness(r: any): number {
  // Higher = more complete (more fields filled)
  let score = 0;
  for (const f of FIELDS.split(',')) {
    if (norm(r[f]) !== '') score++;
  }
  return score;
}

async function fetchAll(): Promise<any[]> {
  const all: any[] = [];
  let page = 1;
  while (page <= 30) {
    const batch = await zohoCRMService.getRecords('Leads', { page, per_page: 200, fields: FIELDS });
    if (!batch || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 200) break;
    page++;
  }
  return all;
}

async function run() {
  console.log('[Dup Detector] Pulling all Leads from live CRM...');
  const leads = await fetchAll();
  console.log(`[Dup Detector] Loaded ${leads.length} Leads`);

  // Index records under multiple keys
  const byEmail = new Map<string, any[]>();
  const byName = new Map<string, any[]>();
  const byEmailLocal = new Map<string, any[]>();
  const byPhone = new Map<string, any[]>();

  for (const r of leads) {
    const email = lower(r.Email);
    const name = nameKey(r);
    const local = email ? emailLocal(email) : '';
    const phone = phoneDigits(r.Phone) || phoneDigits(r.Mobile);

    if (email) {
      if (!byEmail.has(email)) byEmail.set(email, []);
      byEmail.get(email)!.push(r);
    }
    if (name && name !== '|') {
      if (!byName.has(name)) byName.set(name, []);
      byName.get(name)!.push(r);
    }
    if (local && local.length >= 4) {
      if (!byEmailLocal.has(local)) byEmailLocal.set(local, []);
      byEmailLocal.get(local)!.push(r);
    }
    if (phone && phone.length === 10) {
      if (!byPhone.has(phone)) byPhone.set(phone, []);
      byPhone.get(phone)!.push(r);
    }
  }

  // Build clusters using union-find so members stay together across match types
  const parent = new Map<string, string>();
  const find = (x: string): string => {
    if (!parent.has(x)) parent.set(x, x);
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!));
    return parent.get(x)!;
  };
  const union = (a: string, b: string) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  };

  const linkAll = (group: any[], reasonTag: string, reasonsMap: Map<string, Set<string>>) => {
    if (group.length < 2) return;
    const first = group[0].id;
    for (let i = 1; i < group.length; i++) {
      union(first, group[i].id);
    }
    for (const r of group) {
      if (!reasonsMap.has(r.id)) reasonsMap.set(r.id, new Set());
      reasonsMap.get(r.id)!.add(reasonTag);
    }
  };

  const reasons = new Map<string, Set<string>>();

  for (const grp of byEmail.values()) {
    if (grp.length > 1) linkAll(grp, 'exact_email', reasons);
  }
  for (const grp of byName.values()) {
    if (grp.length > 1) linkAll(grp, 'same_name', reasons);
  }
  for (const grp of byEmailLocal.values()) {
    if (grp.length > 1) linkAll(grp, 'email_local_part', reasons);
  }
  for (const grp of byPhone.values()) {
    if (grp.length > 1) linkAll(grp, 'same_phone', reasons);
  }

  // Group records by cluster root
  const clusters = new Map<string, any[]>();
  for (const r of leads) {
    if (!reasons.has(r.id)) continue;
    const root = find(r.id);
    if (!clusters.has(root)) clusters.set(root, []);
    clusters.get(root)!.push(r);
  }

  // Filter to clusters of size > 1
  const dupClusters = Array.from(clusters.values()).filter((c) => c.length > 1);
  console.log(`[Dup Detector] Found ${dupClusters.length} duplicate clusters covering ${dupClusters.reduce((s, c) => s + c.length, 0)} records`);

  // Build proposal rows
  const proposalRows: any[] = [];
  let clusterNum = 0;
  for (const cluster of dupClusters) {
    clusterNum++;
    // Sort by completeness desc, then created asc — winner = most data, oldest if tied
    const sorted = [...cluster].sort((a, b) => {
      const dc = completeness(b) - completeness(a);
      if (dc !== 0) return dc;
      return new Date(a.Created_Time || 0).getTime() - new Date(b.Created_Time || 0).getTime();
    });
    const winner = sorted[0];

    const matchReasons = new Set<string>();
    for (const r of cluster) {
      for (const reason of (reasons.get(r.id) || [])) matchReasons.add(reason);
    }

    for (let i = 0; i < sorted.length; i++) {
      const r = sorted[i];
      const isWinner = i === 0;
      proposalRows.push({
        Cluster: clusterNum,
        'Cluster Size': cluster.length,
        'Match Reasons': Array.from(matchReasons).join(', '),
        'Recommend': isWinner ? '⭐ KEEP (most complete)' : 'Merge into winner',
        'Field Score': completeness(r) + ' / ' + FIELDS.split(',').length,
        'CRM ID': r.id,
        'First Name': norm(r.First_Name),
        'Last Name': norm(r.Last_Name),
        'Email': norm(r.Email),
        'Phone': norm(r.Phone),
        'Institution': norm(r.Institution_Name || r.Company),
        'CAS_Member': norm(r.CAS_Member),
        'CANN_Member': norm(r.CANN_Member),
        'Record_Type': norm(r.Record_Type),
        'CAS_Comm': norm(r.CAS_Communications),
        'CANN_Comm': norm(r.CANN_Communications),
        'Map': norm(r.Services_Map_Inclusion),
        'Designation': norm(r.Professional_Designation),
        'Subspecialty': norm(r.subspecialty),
        'Amyloid Type': norm(r.Amyloidosis_Type),
        'Source_Form': norm(r.Source_Form),
        'Lead_Source': norm(r.Lead_Source),
        'Created': r.Created_Time,
        'Modified': r.Modified_Time,
        // Highlight what each loser uniquely has
        'Loser-only data to preserve': isWinner ? '' : (() => {
          const uniqueBits: string[] = [];
          for (const f of FIELDS.split(',')) {
            if (f === 'id' || f === 'Created_Time' || f === 'Modified_Time') continue;
            const winnerVal = norm(winner[f]);
            const loserVal = norm(r[f]);
            if (loserVal && !winnerVal) uniqueBits.push(`${f}="${loserVal}"`);
            else if (loserVal && winnerVal && loserVal.toLowerCase() !== winnerVal.toLowerCase()) {
              uniqueBits.push(`${f}: winner="${winnerVal}" / loser="${loserVal}"`);
            }
          }
          return uniqueBits.join(' | ');
        })(),
      });
    }
    // Blank row separator
    proposalRows.push({});
  }

  // Summary by match type
  const matchTypeCount: Record<string, number> = {
    exact_email: 0, same_name: 0, email_local_part: 0, same_phone: 0,
  };
  for (const cluster of dupClusters) {
    const matchReasons = new Set<string>();
    for (const r of cluster) {
      for (const reason of (reasons.get(r.id) || [])) matchReasons.add(reason);
    }
    for (const m of matchReasons) matchTypeCount[m] = (matchTypeCount[m] || 0) + 1;
  }

  const summary = [
    { Metric: 'Generated', Value: new Date().toISOString() },
    { Metric: 'Total Leads scanned', Value: leads.length },
    { Metric: 'Duplicate clusters found', Value: dupClusters.length },
    { Metric: 'Total records in duplicate clusters', Value: dupClusters.reduce((s, c) => s + c.length, 0) },
    { Metric: 'Records that would be merged away (losers)', Value: dupClusters.reduce((s, c) => s + (c.length - 1), 0) },
    { Metric: '— Match types —', Value: '' },
    { Metric: 'Clusters from exact email match', Value: matchTypeCount.exact_email },
    { Metric: 'Clusters from same first+last name', Value: matchTypeCount.same_name },
    { Metric: 'Clusters from email local-part across domains', Value: matchTypeCount.email_local_part },
    { Metric: 'Clusters from same phone number', Value: matchTypeCount.same_phone },
  ];

  const readme = [
    { Field: 'Title', Value: 'CAS / CANN — Duplicate Detection + Merge Proposal' },
    { Field: 'Status', Value: 'READ-ONLY. No records have been modified or deleted.' },
    { Field: 'Generated', Value: new Date().toISOString() },
    { Field: 'How clusters are formed', Value: 'Records are linked into a cluster if ANY of: exact email match, same first+last name, same email local-part across different domains, or same 10-digit phone number.' },
    { Field: 'Winner selection', Value: 'Within each cluster, the record with the MOST populated fields wins (oldest record breaks ties). Marked with ⭐.' },
    { Field: 'Loser-only data column', Value: 'Shows what unique data each loser has that the winner lacks — must be preserved before any merge.' },
    { Field: 'Action', Value: 'Jeff + Jan to review, edit winner selection if needed, then we execute merges from this sheet only after their sign-off.' },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(readme), 'README');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), 'Summary');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(proposalRows), 'Merge Proposal');

  const dateStr = new Date().toISOString().slice(0, 10);
  const outDir = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `CAS_Duplicate_Merge_Proposal_${dateStr}.xlsx`);
  XLSX.writeFile(wb, outPath);

  console.log('\n[Dup Detector] === RESULTS ===');
  for (const s of summary) console.log(`  ${String(s.Value).padStart(8)}  ${s.Metric}`);
  console.log(`\n✅ Output: ${outPath}`);
  return outPath;
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
