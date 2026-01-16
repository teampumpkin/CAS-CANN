/**
 * Process Pending Submissions - Manually trigger processing for pending submissions
 */
import { storage } from './storage';
import { fieldSyncEngine } from './field-sync-engine';
import { zohoCRMService } from './zoho-crm-service';

async function processPendingSubmissions() {
  console.log('\n========== Processing Pending Submissions ==========\n');

  // Get all pending submissions
  const pendingSubmissions = await storage.getFormSubmissionsByStatus('pending', 'pending');
  
  console.log(`Found ${pendingSubmissions.length} pending submissions to process\n`);

  for (const submission of pendingSubmissions) {
    console.log(`\n--- Processing Submission ${submission.id} (${submission.formName}) ---`);
    
    try {
      // Extract form data
      const data = submission.submissionData as Record<string, any>;
      const targetModule = submission.zohoModule || 'Leads';

      // Step 1: Field Sync
      console.log(`[${submission.id}] Step 1: Field sync...`);
      const syncResult = await fieldSyncEngine.syncFieldsForSubmission(submission);
      console.log(`[${submission.id}] Field sync complete: ${syncResult.fieldsCreated} created, ${syncResult.errors.length} errors`);

      // Step 2: Format and push to CRM
      console.log(`[${submission.id}] Step 2: CRM push...`);
      const updatedMappings = await storage.getFieldMappings({ zohoModule: targetModule });
      const zohoData = zohoCRMService.formatFieldDataForZoho(data, updatedMappings);
      
      // Add Lead_Source based on form name
      const leadSourceMap: Record<string, string> = {
        "Join CANN Today": "Website - CANN Membership (Historical)",
        "Join CAS Today": "Website - Join CAS Today (Historical)",
        "CAS Registration": "Website - CAS Registration (Historical)",
        "CAS & CANN Registration": "Website - CAS & CANN Registration (Historical)",
      };
      zohoData.Lead_Source = leadSourceMap[submission.formName] || `Website - ${submission.formName} (Historical)`;
      
      console.log(`[${submission.id}] Pushing to Zoho ${targetModule}:`, Object.keys(zohoData));

      // Create record in Zoho CRM
      const zohoRecord = await zohoCRMService.createRecord(targetModule, zohoData);

      // Update submission with success
      await storage.updateFormSubmission(submission.id, {
        processingStatus: "completed" as any,
        syncStatus: "synced" as any,
        zohoCrmId: zohoRecord.id || null
      });

      console.log(`[${submission.id}] ✅ Success! Zoho ID: ${zohoRecord.id}`);
    } catch (error) {
      console.error(`[${submission.id}] ❌ Failed:`, error instanceof Error ? error.message : error);
      
      await storage.updateFormSubmission(submission.id, {
        processingStatus: "failed" as any,
        syncStatus: "failed" as any,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  console.log('\n========== Processing Complete ==========\n');
  process.exit(0);
}

processPendingSubmissions().catch(error => {
  console.error('Processing failed:', error);
  process.exit(1);
});
