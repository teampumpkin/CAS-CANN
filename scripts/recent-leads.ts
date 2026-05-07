import { zohoCRMService } from '../server/zoho-crm-service';
(async () => {
  const all: any[] = [];
  for (let p = 1; p <= 3; p++) {
    const b = await zohoCRMService.getRecords('Leads', { page: p, per_page: 200, fields: 'id,First_Name,Last_Name,Email,Created_Time,Modified_Time,Source_Form,Lead_Source' });
    if (!b || !b.length) break;
    all.push(...b);
    if (b.length < 200) break;
  }
  const sorted = all.sort((a,b)=>new Date(b.Created_Time).getTime()-new Date(a.Created_Time).getTime());
  console.log(`Total Leads: ${all.length}`);
  console.log('\nMost recent 15 Leads by Created_Time:');
  sorted.slice(0,15).forEach(r=>console.log(r.Created_Time,'|',(r.First_Name||'').padEnd(15),(r.Last_Name||'').padEnd(15),'|',(r.Email||'').padEnd(35),'|',r.Source_Form||r.Lead_Source||'(no source)'));
  // Count after Feb 21
  const cutoff = new Date('2026-02-22').getTime();
  const after = sorted.filter(r => new Date(r.Created_Time).getTime() >= cutoff);
  console.log(`\nLeads created AFTER 2026-02-21: ${after.length}`);
  // Group by month
  const months: Record<string, number> = {};
  sorted.forEach(r => { const m = (r.Created_Time||'').slice(0,7); months[m]=(months[m]||0)+1; });
  console.log('\nLeads by month:');
  Object.entries(months).sort().forEach(([k,v])=>console.log(' ',k,'=',v));
})().catch(e=>console.error(e));
