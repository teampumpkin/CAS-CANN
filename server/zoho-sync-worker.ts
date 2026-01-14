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

      // Build Zoho data from submission using smart mapping
      const formData = submission.submissionData as any;
      console.log(`[Zoho Sync Worker DEBUG] Form data for submission #${submission.id}:`, JSON.stringify(formData, null, 2));
      
      const zohoData = await this.buildZohoDataAsync(formData, submission.formName, submission.zohoModule);
      console.log(`[Zoho Sync Worker DEBUG] Zoho data for submission #${submission.id}:`, JSON.stringify(zohoData, null, 2));

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
   * Build Zoho CRM data from form submission using smart field mapping
   * Automatically matches form fields to existing Zoho fields without creating new ones
   */
  private async buildZohoDataAsync(formData: any, formName: string, zohoModule: string): Promise<any> {
    try {
      // First check if there's a form configuration
      const { formConfigEngine } = await import("./form-config-engine");
      const formConfig = await formConfigEngine.getFormConfiguration(formName);
      
      const hasSubmitFields = formConfig?.submitFields && Object.keys(formConfig.submitFields as object).length > 0;
      const hasFieldMappings = formConfig?.fieldMappings && Object.keys(formConfig.fieldMappings as object).length > 0;
      
      if (formConfig && (hasSubmitFields || hasFieldMappings)) {
        // Use config-based mapping
        console.log(`[Zoho Sync Worker] Using config-based mapping for "${formName}"`);
        const result = await zohoCRMService.formatFieldDataForZohoWithConfig(formData, formConfig);
        return result.zohoData;
      }
      
      // Use smart auto-mapping for unconfigured forms
      console.log(`[Zoho Sync Worker] Using smart auto-mapping for "${formName}"`);
      const { smartFieldMapper } = await import("./smart-field-mapper");
      const result = await smartFieldMapper.mapFormDataToZoho(formData, formName, zohoModule);
      
      console.log(`[Zoho Sync Worker] Smart mapping: ${result.mappedFields.length} mapped, ${result.unmappedFields.length} excluded`);
      return result.zohoData;
    } catch (error) {
      console.error(`[Zoho Sync Worker] Smart mapping failed, using fallback:`, error);
      return this.buildZohoDataFallback(formData, formName);
    }
  }

  /**
   * Fallback Zoho data builder for when smart mapping fails
   */
  private buildZohoDataFallback(formData: any, formName: string): any {
    const zohoData: any = {
      Lead_Source: `Website - ${formName}`,
      Last_Name: formData.fullName || formData.name || "Unknown",
      Email: formData.email,
    };

    if (formData.institution) zohoData.Company = formData.institution;
    if (formData.discipline) zohoData.discipline = formData.discipline;

    return zohoData;
  }
}

// Singleton instance
export const zohoSyncWorker = new ZohoSyncWorker();
