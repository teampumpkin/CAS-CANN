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
      
      // Check if this is a CAS/CANN form
      const isCASCANN = submission.formName.replace(/&amp;/g, '&').toLowerCase().includes('cas') && 
                        submission.formName.replace(/&amp;/g, '&').toLowerCase().includes('cann');
      
      let zohoData: any;
      
      if (isCASCANN) {
        // Use explicit CAS/CANN field mapping
        zohoData = {
          Lead_Source: "Website - CAS & CANN Registration (Historical)",
          Layout: { id: "6999043000000091055", name: "CAS and CANN" },
          Company: data.institution || "Individual",
        };
        
        // Split name
        if (data.fullName) {
          const parts = data.fullName.trim().split(/\s+/);
          if (parts.length === 1) {
            zohoData.Last_Name = parts[0];
          } else {
            zohoData.First_Name = parts[0];
            zohoData.Last_Name = parts.slice(1).join(' ');
          }
        }
        
        if (data.email) zohoData.Email = data.email;
        if (data.discipline) zohoData.Professional_Designation = data.discipline;
        if (data.subspecialty) zohoData.subspecialty = data.subspecialty;
        if (data.institution) zohoData.Institution_Name = data.institution;
        if (data.province) zohoData.province = data.province;
        if (data.amyloidosisType) zohoData.Amyloidosis_Type = data.amyloidosisType;
        if (data.wantsMembership) zohoData.CAS_Member = data.wantsMembership === "Yes";
        if (data.wantsCANNMembership) zohoData.CANN_Member = data.wantsCANNMembership === "Yes";
        if (data.wantsCommunications) zohoData.CAS_Communications = data.wantsCommunications;
        if (data.cannCommunications) zohoData.CANN_Communications = data.cannCommunications;
        if (data.wantsServicesMapInclusion) zohoData.Services_Map_Inclusion = data.wantsServicesMapInclusion;
      } else {
        const updatedMappings = await storage.getFieldMappings({ zohoModule: targetModule });
        zohoData = zohoCRMService.formatFieldDataForZoho(data, updatedMappings);
        
        const leadSourceMap: Record<string, string> = {
          "Join CANN Today": "Website - CANN Membership (Historical)",
          "Join CAS Today": "Website - Join CAS Today (Historical)",
          "CAS Registration": "Website - CAS Registration (Historical)",
        };
        zohoData.Lead_Source = leadSourceMap[submission.formName] || `Website - ${submission.formName} (Historical)`;
        zohoData.Company = data.institution || data.company || "Individual";
      }
      
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
