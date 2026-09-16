import { storage } from './storage';
import { pushToZohoCRM } from './zoho-push-service';
import type { FormSubmission } from '@shared/schema';

/**
 * Background Zoho Sync Worker
 * Processes pending form submissions and syncs them to Zoho CRM.
 * Acts as the BACKUP path: the /api/cas-cann-registration handler pushes to Zoho
 * synchronously first; rows land here as pending only when that push fails.
 * BULLETPROOF: Ensures form submissions never fail user-facing requests
 */
export class ZohoSyncWorker {
  private isRunning = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private requeueInterval: NodeJS.Timeout | null = null;
  private readonly SYNC_INTERVAL_MS = 10000; // 10 seconds
  private readonly REQUEUE_INTERVAL_MS = 300000; // 5 minutes — re-check failed submissions
  private readonly MAX_FAST_RETRIES = 5; // After this, switch to slow retry schedule
  private readonly MAX_TOTAL_RETRIES = 50; // Very high ceiling — effectively never give up
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

    // Periodically re-queue failed submissions that have been waiting long enough
    this.requeueInterval = setInterval(() => {
      this.requeueFailedSubmissions();
    }, this.REQUEUE_INTERVAL_MS);
  }

  /**
   * Stop the background sync worker
   */
  stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    if (this.requeueInterval) {
      clearInterval(this.requeueInterval);
      this.requeueInterval = null;
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
      // Check if we've exceeded the absolute ceiling (50 retries = days of trying)
      if (submission.retryCount >= this.MAX_TOTAL_RETRIES) {
        console.error(`[Zoho Sync Worker] Submission #${submission.id} exceeded absolute max retries (${this.MAX_TOTAL_RETRIES}) — marking for manual review`);
        await storage.updateFormSubmission(submission.id, {
          processingStatus: "failed",
          syncStatus: "failed",
          errorMessage: `Exceeded ${this.MAX_TOTAL_RETRIES} retry attempts — requires manual review. Data is safe in database.`,
        });
        
        await storage.createSubmissionLog({
          submissionId: submission.id,
          operation: "crm_push",
          status: "failed",
          errorMessage: `Exceeded ${this.MAX_TOTAL_RETRIES} retry attempts — requires manual review`,
        });
        return;
      }

      // Mark as processing
      await storage.updateFormSubmission(submission.id, {
        processingStatus: "processing",
      });

      console.log(`[Zoho Sync Worker] Syncing submission #${submission.id} to Zoho...`);

      const formData = submission.submissionData as any;

      // Shared push pipeline (mapping, layout lookup, duplicate guard, create/update merge)
      const { zohoCrmId, action: actionTaken } = await pushToZohoCRM({
        formData,
        formName: submission.formName,
        zohoModule: submission.zohoModule,
        submittedAt: submission.createdAt ? new Date(submission.createdAt) : new Date(),
        logLabel: `submission #${submission.id}`,
      });

      // SUCCESS: Update submission as synced
      await storage.updateFormSubmission(submission.id, {
        processingStatus: "completed",
        syncStatus: "synced",
        zohoCrmId: zohoCrmId,
        lastSyncAt: new Date(),
        errorMessage: null,
      });

      await storage.createSubmissionLog({
        submissionId: submission.id,
        operation: "crm_push",
        status: "success",
        details: { zohoCrmId: zohoCrmId, action: actionTaken },
      });

      console.log(`[Zoho Sync Worker] ✅ Submission #${submission.id} ${actionTaken} successfully! Zoho ID: ${zohoCrmId}`);

      // Fire-and-forget notification email to CAS / CANN inboxes (re-enabled 2026-05-07)
      try {
        const { emailNotificationService } = await import("./email-notification-service");
        const isCANN = String(formData.wantsCANNMembership || "").toLowerCase() === "yes" || formData.wantsCANNMembership === true;
        const isCAS = String(formData.wantsMembership || "").toLowerCase() === "yes" || formData.wantsMembership === true;
        emailNotificationService.sendRegistrationNotification({
          fullName: formData.fullName || `${formData.firstName || ""} ${formData.lastName || ""}`.trim() || formData.email || "Unknown",
          email: formData.email || "",
          discipline: formData.discipline,
          institution: formData.institution,
          membershipType: isCAS && isCANN ? "CAS & CANN" : isCAS ? "CAS" : "Contact",
          leadId: zohoCrmId,
        }).catch((err) => console.error("[Zoho Sync Worker] Notification email failed (non-blocking):", err?.message || err));
      } catch (notifyErr) {
        console.error("[Zoho Sync Worker] Could not load notification service:", notifyErr);
      }

    } catch (error) {
      // FAILURE: Increment retry count and schedule next retry with exponential backoff
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[Zoho Sync Worker] ❌ Failed to sync submission #${submission.id}:`, errorMessage);

      await storage.incrementRetryCount(submission.id);
      
      // Calculate backoff: fast retries use exponential (10s, 20s, 40s, 80s, 160s)
      // After MAX_FAST_RETRIES, switch to 5-minute intervals (capped)
      let backoffSeconds: number;
      if (submission.retryCount < this.MAX_FAST_RETRIES) {
        backoffSeconds = Math.pow(2, submission.retryCount) * 10; // exponential: 10, 20, 40, 80, 160
      } else {
        backoffSeconds = 300; // 5 minutes for slow retries
      }
      const nextRetryAt = new Date(Date.now() + backoffSeconds * 1000);

      await storage.updateFormSubmission(submission.id, {
        processingStatus: "pending", // Back to pending for retry — NEVER give up
        errorMessage: errorMessage,
        lastRetryAt: new Date(),
        nextRetryAt: nextRetryAt,
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
          phase: submission.retryCount < this.MAX_FAST_RETRIES ? 'fast_retry' : 'slow_retry',
        },
      });

      console.log(`[Zoho Sync Worker] ⏱️  Scheduled retry for submission #${submission.id} (attempt ${submission.retryCount + 1}/${this.MAX_TOTAL_RETRIES}, ${submission.retryCount < this.MAX_FAST_RETRIES ? 'fast' : 'slow'} phase) at ${nextRetryAt.toISOString()} (in ${backoffSeconds}s)`);
    }
  }

  /**
   * Re-queue failed submissions that have been stuck for at least 30 minutes
   * Only targets submissions that exhausted the old 5-retry limit and were permanently failed
   * Does NOT touch submissions at the absolute ceiling (50 retries = manual review needed)
   * Does NOT fight the main retry loop — respects nextRetryAt scheduling
   */
  private async requeueFailedSubmissions(): Promise<void> {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const allSubmissions = await storage.getFormSubmissions();
      const failedSubmissions = allSubmissions.filter(s => 
        s.syncStatus === 'failed' && 
        s.processingStatus === 'failed' &&
        s.retryCount < this.MAX_TOTAL_RETRIES &&
        !s.zohoCrmId &&
        // Only re-queue if it's been stuck for at least 30 minutes (not fighting main retry loop)
        (!s.lastRetryAt || new Date(s.lastRetryAt) < thirtyMinutesAgo)
      );

      if (failedSubmissions.length === 0) return;

      console.log(`[Zoho Sync Worker] Found ${failedSubmissions.length} stale failed submissions to re-queue`);

      for (const submission of failedSubmissions) {
        // Use progressive backoff: longer delays for higher retry counts
        const backoffMinutes = Math.min(submission.retryCount * 5, 60); // cap at 60 minutes
        const nextRetryAt = new Date(Date.now() + backoffMinutes * 60 * 1000);
        await storage.updateFormSubmission(submission.id, {
          processingStatus: 'pending' as any,
          syncStatus: 'pending' as any,
          nextRetryAt,
          errorMessage: `Re-queued for retry (attempt ${submission.retryCount + 1}). Previous error: ${submission.errorMessage?.substring(0, 200)}`,
        });
        console.log(`[Zoho Sync Worker] Re-queued submission #${submission.id} (retry ${submission.retryCount + 1}/${this.MAX_TOTAL_RETRIES}, next in ${backoffMinutes}min)`);
      }
    } catch (error) {
      console.error('[Zoho Sync Worker] Error re-queuing failed submissions:', error);
    }
  }

}

// Singleton instance
export const zohoSyncWorker = new ZohoSyncWorker();
