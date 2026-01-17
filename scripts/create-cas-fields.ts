import { zohoCRMService } from '../server/zoho-crm-service';

async function createCASFields() {
  console.log('Creating CAS Registration fields in Zoho CRM...\n');
  
  const fieldsToCreate = [
    {
      api_name: 'Professional_Designation',
      field_label: 'Professional Designation',
      data_type: 'text' as const,
      length: 255
    },
    {
      api_name: 'Sub_Specialty',
      field_label: 'Sub-Specialty',
      data_type: 'text' as const,
      length: 255
    },
    {
      api_name: 'Institution_Name',
      field_label: 'Institution Name',
      data_type: 'text' as const,
      length: 255
    },
    {
      api_name: 'CAS_Member',
      field_label: 'CAS Member',
      data_type: 'boolean' as const
    }
  ];
  
  for (const field of fieldsToCreate) {
    try {
      console.log(`Creating field: ${field.api_name}...`);
      const result = await zohoCRMService.createCustomField('Leads', field);
      console.log(`✅ Created: ${field.api_name} (ID: ${result.id})`);
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log(`⏭️ Field ${field.api_name} already exists`);
      } else {
        console.error(`❌ Failed to create ${field.api_name}:`, error.message);
      }
    }
  }
  
  console.log('\nDone!');
}

createCASFields();
