import { zohoCRMService } from '../server/zoho-crm-service';
(async () => {
  const all: any[] = [];
  for (let p = 1; p <= 3; p++) {
    const b = await zohoCRMService.getRecords('Leads', { page: p, per_page: 200, fields: 'id,First_Name,Last_Name,Email,Source_Form,Lead_Source,Created_Time,Modified_Time' });
    if (!b || !b.length) break;
    all.push(...b);
    if (b.length < 200) break;
  }
  console.log('Sample keys:', Object.keys(all[0]||{}).slice(0,30).join(','));
  const sorted = all.filter(r=>r.Created_Time).sort((a,b)=>new Date(b.Created_Time).getTime()-new Date(a.Created_Time).getTime());
  console.log(`\nTotal: ${all.length}, with Created_Time: ${sorted.length}`);
  console.log('\nLatest 5 by Created_Time:');
  sorted.slice(0,5).forEach(r=>console.log(' ',r.Created_Time,r.Email,'|',r.Source_Form));
  console.log('\nEarliest 3 by Created_Time:');
  sorted.slice(-3).forEach(r=>console.log(' ',r.Created_Time,r.Email));
  const months: Record<string,number> = {};
  sorted.forEach(r=>{const m=r.Created_Time.slice(0,7);months[m]=(months[m]||0)+1});
  console.log('\nBy month:');
  Object.entries(months).sort().forEach(([k,v])=>console.log(' ',k,'=',v));
  // Source_Form distribution
  const src: Record<string,number>={};
  all.forEach(r=>{const s=r.Source_Form||'(blank)';src[s]=(src[s]||0)+1});
  console.log('\nSource_Form distribution:');
  Object.entries(src).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log(' ',v,k));
})().catch(e=>console.error(e.message));
