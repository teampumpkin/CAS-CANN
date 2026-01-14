import { zohoCRMService } from '../server/zoho-crm-service';

async function finalVerify() {
  const newId = '6999043000001363263';
  console.log('FINAL VERIFICATION - Record:', newId);
  
  try {
    const record = await zohoCRMService.getRecord('Leads', newId);
    
    if (!record) {
      console.log('Record not found');
      return;
    }
    
    console.log('\n=== ZOHO CRM RECORD DATA ===');
    console.log('Email:', record.Email);
    console.log('Last_Name:', record.Last_Name);
    console.log('Professional_Designation:', record.Professional_Designation);
    console.log('Sub_Specialty:', record.Sub_Specialty);
    console.log('Institution_Name:', record.Institution_Name);
    console.log('CAS_Member:', record.CAS_Member);
    console.log('Services_Map_Inclusion:', record.Services_Map_Inclusion);
    console.log('CAS_Communications:', record.CAS_Communications);
    console.log('Lead_Source:', record.Lead_Source);
    
    const checkFields = [
      ['Email', record.Email],
      ['Last_Name', record.Last_Name],
      ['Professional_Designation', record.Professional_Designation],
      ['Sub_Specialty', record.Sub_Specialty],
      ['Institution_Name', record.Institution_Name],
      ['CAS_Member', record.CAS_Member],
      ['Lead_Source', record.Lead_Source]
    ];
    
    console.log('\n=== VALIDATION ===');
    let allGood = true;
    for (const [name, value] of checkFields) {
      if (value !== undefined && value !== null && value !== '') {
        console.log(`✅ ${name}: ${value}`);
      } else {
        console.log(`❌ ${name}: MISSING`);
        allGood = false;
      }
    }
    
    if (allGood) {
      console.log('\n🎉 SUCCESS! All fields are correctly populated!');
    } else {
      console.log('\n⚠️ Some fields are missing');
    }
    
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

finalVerify();
