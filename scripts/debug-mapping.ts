import { formConfigEngine } from '../server/form-config-engine';

async function debugMapping() {
  const sampleData = {
    "email": "kate.elzinga@ahs.ca",
    "fullName": "Kate Elzinga",
    "discipline": "Physician",
    "institution": "University of Calgary",
    "subspecialty": "Plastic surgery",
    "wantsMembership": "Yes",
    "wantsCommunications": "Yes",
    "wantsServicesMapInclusion": "",
    "importSource": "Excel Import - CAS Registration",
    "originalExcelId": 5
  };
  
  console.log('=== Testing Field Mapping ===\n');
  
  formConfigEngine.clearCache();
  
  const config = await formConfigEngine.getFormConfiguration('Excel Import - CAS Registration');
  
  if (!config) {
    console.log('ERROR: Form configuration not found!');
    return;
  }
  
  console.log('Form Config:');
  console.log('- strictMapping:', config.strictMapping);
  console.log('- submitFields:', JSON.stringify(config.submitFields, null, 2));
  console.log('- fieldMappings:', JSON.stringify(config.fieldMappings, null, 2));
  console.log('\n');
  
  const result = formConfigEngine.filterFormDataForZoho(sampleData, config);
  
  console.log('Mapping Result:');
  console.log('- leadSource:', result.leadSource);
  console.log('- excludedFields:', result.excludedFields);
  console.log('- mappedFields:', JSON.stringify(result.mappedFields, null, 2));
  console.log('- filteredData:', JSON.stringify(result.filteredData, null, 2));
}

debugMapping().catch(console.error);
