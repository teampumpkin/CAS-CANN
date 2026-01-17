import { zohoCRMService } from '../server/zoho-crm-service';

async function verifyFinalRecord() {
  const newId = '6999043000001351142';
  console.log('Verifying newly synced record:', newId);
  
  try {
    const record = await zohoCRMService.getRecord('Leads', newId);
    
    if (!record) {
      console.log('Record not found');
      return;
    }
    
    console.log('\n=== VERIFIED Zoho CRM Record ===');
    console.log('Email:', record.Email || 'MISSING');
    console.log('Last_Name:', record.Last_Name || 'MISSING');
    console.log('Professional_Designation:', record.Professional_Designation || 'EMPTY');
    console.log('Sub_Specialty:', record.Sub_Specialty || 'EMPTY');
    console.log('Institution_Name:', record.Institution_Name || 'EMPTY');
    console.log('CAS_Member:', record.CAS_Member);
    console.log('Services_Map_Inclusion:', record.Services_Map_Inclusion || 'EMPTY');
    console.log('CAS_Communications:', record.CAS_Communications || 'EMPTY');
    console.log('Lead_Source:', record.Lead_Source || 'MISSING');
    
    const expected = {
      Email: true,
      Last_Name: true,
      Professional_Designation: true,
      Sub_Specialty: true,
      Institution_Name: true,
      CAS_Member: true,
      Lead_Source: true
    };
    
    let allClean = true;
    for (const [field, required] of Object.entries(expected)) {
      if (!record[field]) {
        console.log(`\n⚠️ Missing expected field: ${field}`);
        allClean = false;
      }
    }
    
    if (allClean) {
      console.log('\n✅ ALL FIELDS ARE CORRECTLY MAPPED!');
    }
    
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

verifyFinalRecord();
