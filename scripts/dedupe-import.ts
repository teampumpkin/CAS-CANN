import { oauthService } from '../server/oauth-service';

async function main() {
  const commit = process.argv.includes('--commit');
  const t = await oauthService.getValidToken('zoho_crm');
  const all: any[] = [];
  let page = 1;
  while (true) {
    const r = await fetch(`https://www.zohoapis.com/crm/v8/Leads/search?criteria=(Lead_Source:equals:Excel Import - CAS Registration)&fields=Email,Last_Name,Record_Type,Created_Time,Source_Form&page=${page}&per_page=200`, { headers: { Authorization: `Zoho-oauthtoken ${t}` }});
    if (r.status === 204) break;
    const j: any = await r.json();
    all.push(...(j.data || []));
    if (!j.info?.more_records) break;
    page++;
  }
  console.log(`Fetched ${all.length} imported leads`);

  // Group by email; keep oldest, mark others for deletion
  const byEmail = new Map<string, any[]>();
  for (const l of all) {
    const key = (l.Email || `__no_email__${l.Last_Name}`).toLowerCase();
    if (!byEmail.has(key)) byEmail.set(key, []);
    byEmail.get(key)!.push(l);
  }

  const toDelete: string[] = [];
  let dupeGroups = 0;
  for (const [email, group] of byEmail.entries()) {
    if (group.length > 1) {
      dupeGroups++;
      // Sort by Created_Time ascending — keep first, delete rest
      group.sort((a, b) => String(a.Created_Time).localeCompare(String(b.Created_Time)));
      const keep = group[0];
      const dupes = group.slice(1);
      console.log(`  ${email}: ${group.length} copies (keeping ${keep.id}, deleting ${dupes.map(d => d.id).join(', ')})`);
      for (const d of dupes) toDelete.push(d.id);
    }
  }
  console.log(`\n${dupeGroups} emails with duplicates → ${toDelete.length} records to delete`);

  if (!commit) {
    console.log('\n💡 Dry-run. To delete, run with --commit');
    return;
  }

  // Delete in batches of 100
  for (let i = 0; i < toDelete.length; i += 100) {
    const batch = toDelete.slice(i, i + 100);
    const ids = batch.join(',');
    const r = await fetch(`https://www.zohoapis.com/crm/v8/Leads?ids=${ids}&wf_trigger=false`, {
      method: 'DELETE',
      headers: { Authorization: `Zoho-oauthtoken ${t}` },
    });
    const j: any = await r.json();
    const ok = (j.data || []).filter((d: any) => d.code === 'SUCCESS').length;
    console.log(`  Batch ${Math.floor(i/100)+1}: ${ok}/${batch.length} deleted`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
