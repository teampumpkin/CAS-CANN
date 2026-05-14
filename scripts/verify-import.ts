import { oauthService } from '../server/oauth-service';
async function main() {
  const t = await oauthService.getValidToken('zoho_crm');
  let total = 0, page = 1, members = 0, inquiries = 0, en = 0, fr = 0, withMap = 0;
  while (true) {
    const r = await fetch(`https://www.zohoapis.com/crm/v8/Leads/search?criteria=(Lead_Source:equals:Excel Import - CAS Registration)&fields=Email,Record_Type,Source_Form,Services_Map_Inclusion,Map_Clinic_Name&page=${page}&per_page=200`, { headers: { Authorization: `Zoho-oauthtoken ${t}` }});
    if (r.status === 204) break;
    const j: any = await r.json();
    for (const x of j.data || []) {
      total++;
      if (x.Record_Type === 'Member') members++; else inquiries++;
      if (x.Source_Form?.includes('(EN)')) en++;
      if (x.Source_Form?.includes('(FR)')) fr++;
      if (x.Map_Clinic_Name) withMap++;
    }
    if (!j.info?.more_records) break;
    page++;
  }
  console.log('Total in Zoho:', total);
  console.log('  Members:    ', members);
  console.log('  Inquiries:  ', inquiries);
  console.log('  English:    ', en);
  console.log('  French:     ', fr);
  console.log('  With Map listing:', withMap);
}
main();
