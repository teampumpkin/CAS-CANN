import { zohoCRMService } from '../server/zoho-crm-service';

(async () => {
  console.log('=== ZOHO LIVE TOKEN + ENDPOINT CHECK ===');
  console.log('Time:', new Date().toISOString());
  console.log('Env ZOHO_API_DOMAIN:', process.env.ZOHO_API_DOMAIN || '(not set)');
  console.log('Env ZOHO_ACCOUNTS_URL:', process.env.ZOHO_ACCOUNTS_URL || '(not set)');

  try {
    const orgInfo = await (zohoCRMService as any).makeRequest('/org', 'GET');
    const o = orgInfo?.org?.[0];
    console.log('\n✅ /org OK');
    console.log('   Company:', o?.company_name);
    console.log('   Domain:', o?.domain_name);
    console.log('   Org ID:', o?.id);
    console.log('   Currency:', o?.currency);
    console.log('   Time zone:', o?.time_zone);
  } catch (e: any) { console.error('❌ /org failed:', e.message); }

  try {
    const leads = await zohoCRMService.getRecords('Leads', { page: 1, per_page: 1, fields: 'id,Email,Modified_Time,Created_Time' });
    console.log('\n✅ /Leads OK');
    console.log('   Sample id:', leads[0]?.id);
    console.log('   Sample email:', leads[0]?.Email);
    console.log('   Modified:', leads[0]?.Modified_Time);
  } catch (e: any) { console.error('❌ /Leads failed:', e.message); }

  try {
    const u = await (zohoCRMService as any).makeRequest('/users?type=CurrentUser', 'GET');
    const user = u?.users?.[0];
    console.log('\n✅ /users (CurrentUser) OK');
    console.log('   Email:', user?.email);
    console.log('   Name:', user?.full_name);
    console.log('   Role:', user?.role?.name);
    console.log('   Profile:', user?.profile?.name);
  } catch (e: any) { console.error('❌ /users failed:', e.message); }
})().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
