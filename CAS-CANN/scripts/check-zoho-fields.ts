import { zohoCRMService } from '../server/zoho-crm-service';

async function checkZohoFields() {
  console.log('Fetching Leads module fields from Zoho CRM...\n');
  
  try {
    const fields = await zohoCRMService.getModuleFields('Leads');
    
    const targetFields = [
      'Professional_Designation',
      'Sub_Specialty', 
      'Institution_Name',
      'CAS_Member',
      'Services_Map_Inclusion',
      'CAS_Communications'
    ];
    
    console.log('=== Checking target fields ===');
    for (const fieldName of targetFields) {
      const field = fields.find(f => f.api_name === fieldName);
      if (field) {
        console.log(`✅ ${fieldName}: exists (type: ${field.data_type})`);
      } else {
        console.log(`❌ ${fieldName}: NOT FOUND in Zoho`);
      }
    }
    
    console.log('\n=== All custom fields in Zoho Leads ===');
    const customFields = fields.filter(f => f.custom_field);
    for (const f of customFields.slice(0, 20)) {
      console.log(`- ${f.api_name} (${f.data_type})`);
    }
    console.log(`... and ${customFields.length - 20} more`);
    
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

checkZohoFields();
