import { storage } from './storage';
import { zohoCRMService } from './zoho-crm-service';
import type { FormSubmission } from '@shared/schema';

/**
 * Background Zoho Sync Worker
 * Processes pending form submissions and syncs them to Zoho CRM
 * BULLETPROOF: Ensures form submissions never fail user-facing requests
 */
export class ZohoSyncWorker {
  private isRunning = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly SYNC_INTERVAL_MS = 10000; // 10 seconds
  private readonly MAX_RETRIES = 5;
  private readonly BATCH_SIZE = 10;

  /**
   * Start the background sync worker
   */
  start(): void {
    if (this.isRunning) {
      console.log('[Zoho Sync Worker] Already running');
      return;
    }

    this.isRunning = true;
    console.log('[Zoho Sync Worker] Starting background sync worker...');
    console.log(`[Zoho Sync Worker] Polling every ${this.SYNC_INTERVAL_MS / 1000} seconds`);

    // Run immediately
    this.processQueue();

    // Then run on interval
    this.syncInterval = setInterval(() => {
      this.processQueue();
    }, this.SYNC_INTERVAL_MS);
  }

  /**
   * Stop the background sync worker
   */
  stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.isRunning = false;
    console.log('[Zoho Sync Worker] Stopped');
  }

  /**
   * Process the sync queue
   */
  private async processQueue(): Promise<void> {
    try {
      // Get pending submissions (not already synced, under max retries)
      const pendingSubmissions = await storage.getFormSubmissionsByStatus("pending", "pending");
      
      if (pendingSubmissions.length === 0) {
        return; // Nothing to process
      }

      console.log(`[Zoho Sync Worker] Found ${pendingSubmissions.length} pending submissions`);

      // Process in batches
      const batch = pendingSubmissions.slice(0, this.BATCH_SIZE);
      
      for (const submission of batch) {
        await this.syncSubmission(submission);
      }

    } catch (error) {
      console.error('[Zoho Sync Worker] Error processing queue:', error);
    }
  }

  /**
   * Sync a single submission to Zoho CRM
   */
  private async syncSubmission(submission: FormSubmission): Promise<void> {
    try {
      // Check retry limit
      if (submission.retryCount >= this.MAX_RETRIES) {
        console.error(`[Zoho Sync Worker] Submission #${submission.id} exceeded max retries (${this.MAX_RETRIES})`);
        await storage.updateFormSubmission(submission.id, {
          processingStatus: "failed",
          syncStatus: "failed",
          errorMessage: `Exceeded maximum retry attempts (${this.MAX_RETRIES})`,
        });
        
        await storage.createSubmissionLog({
          submissionId: submission.id,
          operation: "crm_push",
          status: "failed",
          errorMessage: `Exceeded maximum retry attempts (${this.MAX_RETRIES})`,
        });
        return;
      }

      // Mark as processing
      await storage.updateFormSubmission(submission.id, {
        processingStatus: "processing",
      });

      console.log(`[Zoho Sync Worker] Syncing submission #${submission.id} to Zoho...`);

      // Build Zoho data from submission
      const formData = submission.submissionData as any;
      const zohoData = this.buildZohoData(formData, submission.formName);

      // Attempt to sync to Zoho
      const zohoRecord = await zohoCRMService.createRecord(submission.zohoModule, zohoData);

      // SUCCESS: Update submission as synced
      await storage.updateFormSubmission(submission.id, {
        processingStatus: "completed",
        syncStatus: "synced",
        zohoCrmId: zohoRecord.id,
        lastSyncAt: new Date(),
        errorMessage: null,
      });

      await storage.createSubmissionLog({
        submissionId: submission.id,
        operation: "crm_push",
        status: "success",
        details: { zohoCrmId: zohoRecord.id },
      });

      console.log(`[Zoho Sync Worker] ✅ Submission #${submission.id} synced successfully! Zoho ID: ${zohoRecord.id}`);

    } catch (error) {
      // FAILURE: Increment retry count and schedule next retry with exponential backoff
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[Zoho Sync Worker] ❌ Failed to sync submission #${submission.id}:`, errorMessage);

      await storage.incrementRetryCount(submission.id);
      
      // Calculate exponential backoff: 2^retryCount * 10 seconds
      const backoffSeconds = Math.pow(2, submission.retryCount) * 10;
      const nextRetryAt = new Date(Date.now() + backoffSeconds * 1000);

      await storage.updateFormSubmission(submission.id, {
        processingStatus: "pending", // Back to pending for retry
        errorMessage: errorMessage,
        lastRetryAt: new Date(),
        nextRetryAt: nextRetryAt, // Schedule next retry attempt
      });

      await storage.createSubmissionLog({
        submissionId: submission.id,
        operation: "retry_attempt",
        status: "failed",
        errorMessage: errorMessage,
        details: { 
          retryCount: submission.retryCount + 1,
          nextRetryAt: nextRetryAt.toISOString(),
          backoffSeconds: backoffSeconds,
        },
      });

      console.log(`[Zoho Sync Worker] ⏱️  Scheduled retry for submission #${submission.id} (attempt ${submission.retryCount + 1}/${this.MAX_RETRIES}) at ${nextRetryAt.toISOString()} (in ${backoffSeconds}s)`);
    }
  }

  /**
   * Check if this is a CAS/CANN registration form
   * Handles HTML entity encoding (&amp; vs &)
   */
  private isCASCANNForm(formName: string): boolean {
    const normalized = formName.replace(/&amp;/g, '&').toLowerCase().trim();
    return normalized.includes('cas') && normalized.includes('cann');
  }

  /**
   * Split full name into first and last name
   * Single-word names go to Last_Name (required by Zoho for Leads)
   */
  private splitFullName(fullName: string): { firstName: string; lastName: string } {
    if (!fullName || typeof fullName !== 'string') {
      return { firstName: '', lastName: '' };
    }
    
    const trimmed = fullName.trim();
    const parts = trimmed.split(/\s+/);
    
    if (parts.length === 1) {
      return { firstName: '', lastName: parts[0] };
    }
    
    return { 
      firstName: parts[0], 
      lastName: parts.slice(1).join(' ')
    };
  }

  /**
   * Build Zoho CRM data from form submission
   * STRICT WHITELIST: Only sends mapped fields to Zoho - no custom field creation
   */
  private buildZohoData(formData: any, formName: string): any {
    const isCASCANN = this.isCASCANNForm(formName);
    const isMember = formData.wantsMembership === "Yes" || formData.wantsCANNMembership === "Yes";

    console.log(`[Zoho Sync Worker] Building data for form "${formName}" (CAS/CANN: ${isCASCANN}, Member: ${isMember})`);

    const zohoData: any = {
      Lead_Source: isCASCANN 
        ? "Website - CAS & CANN Registration"
        : "Website - CAS Registration",
    };

    // Member fields - STRICT WHITELIST with form-matching field names
    if (isMember) {
      // Split full name into First_Name and Last_Name
      const { firstName, lastName } = this.splitFullName(formData.fullName);
      if (firstName) zohoData.First_Name = firstName;
      zohoData.Last_Name = lastName || "Unknown";
      
      // Email (required)
      if (formData.email) zohoData.Email = formData.email;
      
      // Professional info - field names match form labels
      if (formData.discipline) zohoData.Professional_Designation = formData.discipline;
      if (formData.subspecialty) zohoData.Subspecialty = formData.subspecialty;
      if (formData.institution) zohoData.Institution = formData.institution;
      
      // Amyloidosis specific
      if (formData.amyloidosisType) zohoData.Amyloidosis_Type = formData.amyloidosisType;
      
      // Membership flags
      if (formData.wantsMembership) zohoData.CAS_Member = formData.wantsMembership === "Yes";
      if (formData.wantsCANNMembership) zohoData.CANN_Member = formData.wantsCANNMembership === "Yes";
      
      // Communication preferences
      if (formData.wantsCommunications) zohoData.CAS_Communications = formData.wantsCommunications === "Yes";
      if (formData.cannCommunications) zohoData.CANN_Communications = formData.cannCommunications === "Yes";
      
      // Services map
      if (formData.wantsServicesMapInclusion) zohoData.Services_Map_Inclusion = formData.wantsServicesMapInclusion === "Yes";
    }

    // Non-member fallback
    if (!isMember) {
      zohoData.Last_Name = formData.noMemberName || "Non-Member Contact";
      zohoData.Email = formData.noMemberEmail;
      if (formData.noMemberMessage) {
        zohoData.Description = `Non-member contact: ${formData.noMemberMessage}`;
      }
    }

    console.log(`[Zoho Sync Worker] Mapped ${Object.keys(zohoData).length} fields:`, Object.keys(zohoData));

    return zohoData;
  }
}

// Singleton instance
export const zohoSyncWorker = new ZohoSyncWorker();
