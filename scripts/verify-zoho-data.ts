import { zohoCRMService } from '../server/zoho-crm-service';

async function verifyZohoData() {
  console.log('=== Verifying Zoho CRM Data ===\n');
  
  const sampleIds = [
    '6999043000001344053',
    '6999043000001347036',
    '6999043000001340071',
    '6999043000001331110',
    '6999043000001359081'
  ];
  
  const expectedFields = [
    'Email',
    'Last_Name',
    'Professional_Designation',
    'Sub_Specialty',
    'Institution_Name',
    'CAS_Member',
    'Services_Map_Inclusion',
    'CAS_Communications',
    'Lead_Source'
  ];
  
  console.log('Expected fields:', expectedFields.join(', '));
  console.log('\nFetching records from Zoho CRM...\n');
  
  let cleanRecords = 0;
  let issueRecords = 0;
  
  for (const id of sampleIds) {
    try {
      const record = await zohoCRMService.getRecord('Leads', id);
      
      if (!record) {
        console.log(`❌ Record ${id}: NOT FOUND`);
        issueRecords++;
        continue;
      }
      
      console.log(`\n--- Record ID: ${id} ---`);
      console.log(`Email: ${record.Email || 'MISSING'}`);
      console.log(`Last_Name: ${record.Last_Name || 'MISSING'}`);
      console.log(`Professional_Designation: ${record.Professional_Designation || 'empty'}`);
      console.log(`Sub_Specialty: ${record.Sub_Specialty || 'empty'}`);
      console.log(`Institution_Name: ${record.Institution_Name || 'empty'}`);
      console.log(`CAS_Member: ${record.CAS_Member || 'empty'}`);
      console.log(`Services_Map_Inclusion: ${record.Services_Map_Inclusion || 'empty'}`);
      console.log(`CAS_Communications: ${record.CAS_Communications || 'empty'}`);
      console.log(`Lead_Source: ${record.Lead_Source || 'MISSING'}`);
      
      const hasJunkFields = Object.keys(record).some(key => 
        key.includes('institution') && key !== 'Institution_Name' ||
        key === 'servicesMapConsent' ||
        key === 'importSource' ||
        key === 'originalExcelId'
      );
      
      if (hasJunkFields) {
        console.log('⚠️ Contains unexpected fields!');
        console.log('All fields:', Object.keys(record).filter(k => !k.startsWith('$')).join(', '));
        issueRecords++;
      } else {
        console.log('✅ Clean record');
        cleanRecords++;
      }
      
    } catch (error: any) {
      console.error(`❌ Error fetching ${id}:`, error.message);
      issueRecords++;
    }
  }
  
  console.log('\n=== Summary ===');
  console.log(`Clean records: ${cleanRecords}`);
  console.log(`Records with issues: ${issueRecords}`);
}

verifyZohoData().catch(console.error);
