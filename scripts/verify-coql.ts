import { oauthService } from '../server/oauth-service';
async function main() {
  const t = await oauthService.getValidToken('zoho_crm');
  let total = 0, members = 0, inquiries = 0, en = 0, fr = 0, withMap = 0, offset = 0;
  while (true) {
    const r = await fetch('https://www.zohoapis.com/crm/v8/coql', {
      method: 'POST',
      headers: { Authorization: `Zoho-oauthtoken ${t}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        select_query: `select id, Email, Record_Type, Source_Form, Map_Clinic_Name from Leads where Source_Form like 'Excel Import - CAS Registration%' limit ${offset}, 200`
      })
    });
    if (r.status === 204) break;
    const j: any = await r.json();
    if (!j.data || j.data.length === 0) break;
    for (const x of j.data) {
      total++;
      if (x.Record_Type === 'Member') members++; else inquiries++;
      if (x.Source_Form?.includes('(EN)')) en++;
      if (x.Source_Form?.includes('(FR)')) fr++;
      if (x.Map_Clinic_Name) withMap++;
    }
    if (!j.info?.more_records) break;
    offset += 200;
  }
  console.log('Total (COQL by Source_Form):', total);
  console.log('  Members:    ', members);
  console.log('  Inquiries:  ', inquiries);
  console.log('  English:    ', en);
  console.log('  French:     ', fr);
  console.log('  With Map:   ', withMap);
}
main().catch(e => { console.error(e); process.exit(1); });
