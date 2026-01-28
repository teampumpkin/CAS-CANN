/**
 * Bulk Import Runner - Direct execution script for importing historical Excel data
 */
import { storage } from './storage';
import { BulkImportService } from './bulk-import-service';

async function runBulkImport() {
  const bulkImportService = new BulkImportService(storage);

  console.log('\n========== Starting Bulk Import ==========\n');

  // Import CANN Contacts
  console.log('Importing CANN Contacts...');
  const cannResult = await bulkImportService.importFromExcel(
    'attached_assets/CANN Contacts_1760548966283.xlsx',
    'CANN Contacts'
  );
  console.log(`\nCANN Contacts Result:`,  JSON.stringify(cannResult, null, 2));

  // Import CAS Registration  
  console.log('\n\nImporting CAS Registration...');
  const casResult = await bulkImportService.importFromExcel(
    'attached_assets/CAS Registration_1760548966285.xlsx',
    'CAS Registration'
  );
  console.log(`\nCAS Registration Result:`, JSON.stringify(casResult, null, 2));

  console.log('\n\n========== Import Complete ==========');
  console.log(`Total Submissions Created: ${cannResult.submissionIds.length + casResult.submissionIds.length}`);
  console.log(`CANN: ${cannResult.successCount} success, ${cannResult.failedCount} failed`);
  console.log(`CAS: ${casResult.successCount} success, ${casResult.failedCount} failed`);
  
  process.exit(0);
}

runBulkImport().catch(error => {
  console.error('Bulk import failed:', error);
  process.exit(1);
});
