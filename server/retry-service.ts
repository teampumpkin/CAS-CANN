import { storage } from "./storage";
import { fieldSyncEngine } from "./field-sync-engine";
import { zohoCRMService } from "./zoho-crm-service";
import { FormSubmission } from "@shared/schema";

export interface RetryResult {
  submissionId: number;
  success: boolean;
  retryCount: number;
  errorMessage?: string;
  finalStatus: string;
}

export interface RetryStats {
  totalRetried: number;
  successful: number;
  failed: number;
  maxRetriesReached: number;
  averageRetryCount: number;
}

export class RetryService {
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAYS = [5000, 15000, 60000]; // 5s, 15s, 1m
  private isProcessing = false;

  constructor() {}

  /**
   * Retry a specific failed submission
   */
  async retrySubmission(submissionId: number): Promise<RetryResult> {
    const startTime = Date.now();

    try {
      console.log(`[Retry] Starting retry for submission ${submissionId}`);

      // Get the submission
      const submission = await storage.getFormSubmission(submissionId);
      if (!submission) {
        throw new Error(`Submission ${submissionId} not found`);
      }

      // Check if we've exceeded max retries
      if (submission.retryCount >= this.MAX_RETRIES) {
        console.log(`[Retry] Submission ${submissionId} has reached max retries (${this.MAX_RETRIES})`);
        
        await storage.updateFormSubmission(submissionId, {
          processingStatus: "failed" as any,
          syncStatus: "failed" as any,
          errorMessage: `Max retries (${this.MAX_RETRIES}) reached`
        });

        return {
          submissionId,
          success: false,
          retryCount: submission.retryCount,
          errorMessage: "Max retries reached",
          finalStatus: "failed"
        };
      }

      // Increment retry count
      const newRetryCount = submission.retryCount + 1;
      await storage.updateFormSubmission(submissionId, {
        retryCount: newRetryCount,
        processingStatus: "processing" as any,
        errorMessage: null
      });

      // Log retry attempt
      await storage.createSubmissionLog({
        submissionId,
        operation: "retry_attempt",
        status: "in_progress",
        details: {
          attempt: newRetryCount,
          maxRetries: this.MAX_RETRIES,
          previousError: submission.errorMessage
        }
      });

      console.log(`[Retry] Retry attempt ${newRetryCount}/${this.MAX_RETRIES} for submission ${submissionId}`);

      // Determine what failed and retry accordingly
      let retrySuccess = false;
      let errorMessage = "";

      if (submission.syncStatus === "failed" || submission.syncStatus === "pending") {
        // Field sync failed or never completed - retry field sync
        console.log(`[Retry] Retrying field sync for submission ${submissionId}`);
        
        const fieldSyncResult = await fieldSyncEngine.syncFieldsForSubmission(submission);
        
        if (fieldSyncResult.success) {
          // Field sync successful, now try CRM push
          console.log(`[Retry] Field sync successful, attempting CRM push for submission ${submissionId}`);
          
          const crmResult = await this.attemptCrmPush(submission);
          retrySuccess = crmResult.success;
          errorMessage = crmResult.errorMessage || "";
        } else {
          retrySuccess = false;
          errorMessage = `Field sync failed: ${fieldSyncResult.errors.join("; ")}`;
        }
      } else if (submission.processingStatus === "failed" && submission.syncStatus === "synced") {
        // Field sync was successful but CRM push failed - retry CRM push only
        console.log(`[Retry] Field sync was successful, retrying CRM push for submission ${submissionId}`);
        
        const crmResult = await this.attemptCrmPush(submission);
        retrySuccess = crmResult.success;
        errorMessage = crmResult.errorMessage || "";
      } else {
        // Unclear state - try full process
        console.log(`[Retry] Unclear state, retrying full process for submission ${submissionId}`);
        
        const fullResult = await this.attemptFullProcess(submission);
        retrySuccess = fullResult.success;
        errorMessage = fullResult.errorMessage || "";
      }

      // Update final status
      if (retrySuccess) {
        await storage.updateFormSubmission(submissionId, {
          processingStatus: "completed" as any,
          syncStatus: "synced" as any,
          errorMessage: null
        });

        await storage.createSubmissionLog({
          submissionId,
          operation: "retry_attempt",
          status: "success",
          details: {
            attempt: newRetryCount,
            duration: Date.now() - startTime
          },
          duration: Date.now() - startTime
        });

        console.log(`[Retry] Successfully retried submission ${submissionId} on attempt ${newRetryCount}`);
      } else {
        await storage.updateFormSubmission(submissionId, {
          processingStatus: "failed" as any,
          syncStatus: "failed" as any,
          errorMessage: errorMessage
        });

        await storage.createSubmissionLog({
          submissionId,
          operation: "retry_attempt",
          status: "failed",
          details: {
            attempt: newRetryCount,
            error: errorMessage
          },
          duration: Date.now() - startTime,
          errorMessage
        });

        console.error(`[Retry] Retry failed for submission ${submissionId} on attempt ${newRetryCount}: ${errorMessage}`);
      }

      return {
        submissionId,
        success: retrySuccess,
        retryCount: newRetryCount,
        errorMessage: retrySuccess ? undefined : errorMessage,
        finalStatus: retrySuccess ? "completed" : "failed"
      };

    } catch (error) {
      const errorMsg = `Retry process failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(`[Retry] Error during retry of submission ${submissionId}:`, error);

      await storage.createSubmissionLog({
        submissionId,
        operation: "retry_attempt",
        status: "failed",
        details: { error: errorMsg },
        duration: Date.now() - startTime,
        errorMessage: errorMsg
      });

      return {
        submissionId,
        success: false,
        retryCount: 0,
        errorMessage: errorMsg,
        finalStatus: "failed"
      };
    }
  }

  /**
   * Retry all failed submissions
   */
  async retryAllFailedSubmissions(): Promise<RetryStats> {
    if (this.isProcessing) {
      throw new Error("Retry process is already running");
    }

    this.isProcessing = true;
    console.log("[Retry] Starting bulk retry of all failed submissions");

    try {
      // Get all failed submissions that haven't reached max retries
      const failedSubmissions = await storage.getFormSubmissionsByStatus("failed", "failed");
      const eligibleSubmissions = failedSubmissions.filter(s => s.retryCount < this.MAX_RETRIES);

      console.log(`[Retry] Found ${eligibleSubmissions.length} eligible submissions for retry out of ${failedSubmissions.length} total failed`);

      const results: RetryResult[] = [];
      let successful = 0;
      let failed = 0;
      let maxRetriesReached = 0;

      for (const submission of eligibleSubmissions) {
        try {
          // Add delay between retries to avoid overwhelming the system
          if (results.length > 0) {
            await this.delay(1000); // 1 second between submissions
          }

          const result = await this.retrySubmission(submission.id);
          results.push(result);

          if (result.success) {
            successful++;
          } else if (result.errorMessage === "Max retries reached") {
            maxRetriesReached++;
          } else {
            failed++;
          }

        } catch (error) {
          console.error(`[Retry] Failed to retry submission ${submission.id}:`, error);
          failed++;
        }
      }

      const averageRetryCount = results.length > 0 
        ? results.reduce((sum, r) => sum + r.retryCount, 0) / results.length 
        : 0;

      const stats: RetryStats = {
        totalRetried: results.length,
        successful,
        failed,
        maxRetriesReached,
        averageRetryCount
      };

      console.log(`[Retry] Bulk retry completed:`, stats);
      return stats;

    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Check if this is a CAS/CANN registration form
   */
  private isCASCANNForm(formName: string): boolean {
    const normalized = formName.replace(/&amp;/g, '&').toLowerCase().trim();
    return normalized.includes('cas') && normalized.includes('cann');
  }

  /**
   * Build CAS/CANN specific Zoho data with correct field mappings
   */
  private buildCASCANNZohoData(formData: any, formName: string): any {
    const zohoData: any = {
      Lead_Source: "Website - CAS & CANN Registration",
      Layout: { id: "6999043000000091055", name: "CAS and CANN" },
    };

    // Split full name
    if (formData.fullName) {
      const parts = formData.fullName.trim().split(/\s+/);
      if (parts.length === 1) {
        zohoData.Last_Name = parts[0];
      } else {
        zohoData.First_Name = parts[0];
        zohoData.Last_Name = parts.slice(1).join(' ');
      }
    }

    if (formData.email) zohoData.Email = formData.email;
    zohoData.Company = formData.institution || "Individual";
    if (formData.discipline) zohoData.Professional_Designation = formData.discipline;
    if (formData.subspecialty) zohoData.subspecialty = formData.subspecialty;
    if (formData.institution) zohoData.Institution_Name = formData.institution;
    if (formData.province) zohoData.province = formData.province;
    if (formData.amyloidosisType) zohoData.Amyloidosis_Type = formData.amyloidosisType;
    if (formData.wantsMembership) zohoData.CAS_Member = formData.wantsMembership === "Yes";
    if (formData.wantsCANNMembership) zohoData.CANN_Member = formData.wantsCANNMembership === "Yes";
    if (formData.wantsCommunications) zohoData.CAS_Communications = formData.wantsCommunications;
    if (formData.cannCommunications) zohoData.CANN_Communications = formData.cannCommunications;
    if (formData.wantsServicesMapInclusion) zohoData.Services_Map_Inclusion = formData.wantsServicesMapInclusion;

    return zohoData;
  }

  /**
   * Attempt CRM push for a submission
   */
  private async attemptCrmPush(submission: FormSubmission): Promise<{ success: boolean; errorMessage?: string }> {
    try {
      const formData = submission.submissionData as Record<string, any>;
      let zohoData: any;

      // Use CAS/CANN specific mapping for those forms
      if (this.isCASCANNForm(submission.formName)) {
        zohoData = this.buildCASCANNZohoData(formData, submission.formName);
      } else {
        // Get field mappings for other forms
        const fieldMappings = await storage.getFieldMappings({ zohoModule: submission.zohoModule });
        zohoData = zohoCRMService.formatFieldDataForZoho(formData, fieldMappings);
        zohoData.Lead_Source = submission.formName;
        zohoData.Company = formData.institution || formData.company || "Individual";
      }
      
      console.log(`[Retry] Pushing data to Zoho ${submission.zohoModule}:`, zohoData);
      
      // Create record in Zoho CRM
      const zohoRecord = await zohoCRMService.createRecord(submission.zohoModule, zohoData);
      
      // Update submission with Zoho CRM ID
      await storage.updateFormSubmission(submission.id, {
        zohoCrmId: zohoRecord.id || null
      });

      await storage.createSubmissionLog({
        submissionId: submission.id,
        operation: "crm_push",
        status: "success",
        details: {
          zohoRecordId: zohoRecord.id,
          targetModule: submission.zohoModule,
          isRetry: true
        }
      });

      return { success: true };

    } catch (error) {
      const errorMessage = `CRM push failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      
      await storage.createSubmissionLog({
        submissionId: submission.id,
        operation: "crm_push",
        status: "failed",
        details: { error: errorMessage, isRetry: true },
        errorMessage
      });

      return { success: false, errorMessage };
    }
  }

  /**
   * Attempt full process (field sync + CRM push) for a submission
   */
  private async attemptFullProcess(submission: FormSubmission): Promise<{ success: boolean; errorMessage?: string }> {
    try {
      // Step 1: Field sync
      const fieldSyncResult = await fieldSyncEngine.syncFieldsForSubmission(submission);
      
      if (!fieldSyncResult.success) {
        return { 
          success: false, 
          errorMessage: `Field sync failed: ${fieldSyncResult.errors.join("; ")}` 
        };
      }

      // Step 2: CRM push
      const crmResult = await this.attemptCrmPush(submission);
      return crmResult;

    } catch (error) {
      return { 
        success: false, 
        errorMessage: `Full process failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * Get retry statistics for monitoring
   */
  async getRetryStatistics(): Promise<{
    failedSubmissions: number;
    eligibleForRetry: number;
    maxRetriesReached: number;
    totalRetryAttempts: number;
    successfulRetries: number;
    recentRetries: Array<{
      submissionId: number;
      retryCount: number;
      lastRetryAt: string;
      status: string;
    }>;
  }> {
    try {
      // Get failed submissions
      const failedSubmissions = await storage.getFormSubmissionsByStatus("failed", "failed");
      const eligibleForRetry = failedSubmissions.filter(s => s.retryCount < this.MAX_RETRIES);
      const maxRetriesReached = failedSubmissions.filter(s => s.retryCount >= this.MAX_RETRIES);

      // Get retry logs for statistics
      const retryLogs = await storage.getSubmissionLogs({
        operation: "retry_attempt"
      });

      const successfulRetries = retryLogs.filter(log => log.status === "success").length;
      const totalRetryAttempts = retryLogs.length;

      // Get recent retries with details
      const recentRetries = failedSubmissions
        .filter(s => s.retryCount > 0)
        .sort((a, b) => {
          const aDate = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bDate = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return bDate - aDate;
        })
        .slice(0, 20)
        .map(s => ({
          submissionId: s.id,
          retryCount: s.retryCount,
          lastRetryAt: s.updatedAt ? s.updatedAt.toString() : new Date().toISOString(),
          status: s.processingStatus
        }));

      return {
        failedSubmissions: failedSubmissions.length,
        eligibleForRetry: eligibleForRetry.length,
        maxRetriesReached: maxRetriesReached.length,
        totalRetryAttempts,
        successfulRetries,
        recentRetries
      };

    } catch (error) {
      console.error("[Retry] Error getting retry statistics:", error);
      throw error;
    }
  }

  /**
   * Schedule automatic retries with exponential backoff
   */
  async scheduleAutomaticRetries(): Promise<void> {
    console.log("[Retry] Starting automatic retry scheduler");

    // Get failed submissions that are eligible for retry
    const failedSubmissions = await storage.getFormSubmissionsByStatus("failed", "failed");
    const eligibleSubmissions = failedSubmissions.filter(s => s.retryCount < this.MAX_RETRIES);

    for (const submission of eligibleSubmissions) {
      const retryIndex = submission.retryCount;
      const delay = this.RETRY_DELAYS[retryIndex] || this.RETRY_DELAYS[this.RETRY_DELAYS.length - 1];
      
      // Calculate when the submission should be retried
      const lastUpdated = submission.updatedAt ? new Date(submission.updatedAt).getTime() : Date.now();
      const nextRetryTime = lastUpdated + delay;
      const currentTime = Date.now();

      if (currentTime >= nextRetryTime) {
        console.log(`[Retry] Scheduling immediate retry for submission ${submission.id} (retry ${retryIndex + 1}/${this.MAX_RETRIES})`);
        
        // Schedule immediate retry
        setImmediate(async () => {
          try {
            await this.retrySubmission(submission.id);
          } catch (error) {
            console.error(`[Retry] Scheduled retry failed for submission ${submission.id}:`, error);
          }
        });
      } else {
        const timeUntilRetry = nextRetryTime - currentTime;
        console.log(`[Retry] Submission ${submission.id} will be retried in ${Math.round(timeUntilRetry / 1000)}s`);
      }
    }
  }

  /**
   * Utility method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if retry service is currently processing
   */
  isRetryProcessing(): boolean {
    return this.isProcessing;
  }
}

export const retryService = new RetryService();