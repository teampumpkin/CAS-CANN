import { zohoCRMService } from '../server/zoho-crm-service';

async function checkNewRecord() {
  const newId = '6999043000001331115';
  console.log('Fetching newly synced record:', newId);
  
  try {
    const record = await zohoCRMService.getRecord('Leads', newId);
    
    if (!record) {
      console.log('Record not found');
      return;
    }
    
    console.log('\n=== New Record Data ===');
    console.log('Email:', record.Email || 'MISSING');
    console.log('Last_Name:', record.Last_Name || 'MISSING');
    console.log('Professional_Designation:', record.Professional_Designation || 'EMPTY');
    console.log('Sub_Specialty:', record.Sub_Specialty || 'EMPTY');
    console.log('Institution_Name:', record.Institution_Name || 'EMPTY');
    console.log('CAS_Member:', record.CAS_Member || 'EMPTY');
    console.log('Services_Map_Inclusion:', record.Services_Map_Inclusion || 'EMPTY');
    console.log('CAS_Communications:', record.CAS_Communications || 'EMPTY');
    console.log('Lead_Source:', record.Lead_Source || 'MISSING');
    console.log('\n=== OLD field names (should be empty) ===');
    console.log('discipline:', record.discipline || 'empty');
    console.log('subspecialty:', record.subspecialty || 'empty');
    console.log('institution:', record.institution || 'empty');
    console.log('wantsmembership:', record.wantsmembership || 'empty');
    
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

checkNewRecord();
