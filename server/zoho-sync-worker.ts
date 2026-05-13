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

      // Build Zoho data from submission using smart mapping
      // Inject submission.created_at so Form_Submission_Date in Zoho reflects when the user
      // actually submitted, not when this sync attempt ran (critical for rescued/retried records).
      const formData = {
        ...(submission.submissionData as any),
        _submissionCreatedAt: submission.createdAt
          ? new Date(submission.createdAt).toISOString()
          : undefined,
      } as any;
      console.log(`[Zoho Sync Worker DEBUG] Form data for submission #${submission.id}:`, JSON.stringify(formData, null, 2));
      
      // Get form configuration to check for layout
      const { formConfigEngine } = await import("./form-config-engine");
      const formConfig = await formConfigEngine.getFormConfiguration(submission.formName);
      const layoutId = (formConfig as any)?.zohoLayoutId || undefined;
      
      if (layoutId) {
        console.log(`[Zoho Sync Worker] Using layout ID: ${layoutId} (${(formConfig as any)?.zohoLayoutName || 'unknown'})`);
      }
      
      const zohoData = await this.buildZohoDataAsync(formData, submission.formName, submission.zohoModule);
      console.log(`[Zoho Sync Worker DEBUG] Zoho data for submission #${submission.id}:`, JSON.stringify(zohoData, null, 2));

      // ─── DUPLICATE GUARD ────────────────────────────────────────────────
      // Look up an existing Lead/Contact by email FIRST. If found, update it
      // (with merge rules) instead of creating a duplicate. Skip lookup only
      // if email is missing.
      const submissionEmail = (zohoData.Email || formData.email || "").trim();
      let existingRecord: any = null;
      if (submissionEmail) {
        try {
          existingRecord = await zohoCRMService.searchRecordByEmail(submission.zohoModule, submissionEmail);
        } catch (lookupErr) {
          // If the lookup itself fails, fall through to create — the worst case is
          // a duplicate that admin tools can clean up. We must not block the sync.
          console.warn(`[Zoho Sync Worker] Email lookup failed for #${submission.id} (${submissionEmail}); falling back to create:`, lookupErr instanceof Error ? lookupErr.message : lookupErr);
        }
      }

      let zohoRecord: any;
      let actionTaken: "created" | "updated";

      if (existingRecord && existingRecord.id) {
        // ── UPDATE PATH ─────────────────────────────────────────────────
        // Merge with upgrade-only rules:
        //   • CAS_Member / CANN_Member: true wins, never downgrade to false
        //   • Form_Submission_Date: always update to latest
        //   • Other fields: latest non-empty wins (existing values preserved if new is blank)
        const merged: any = { ...zohoData };

        // Upgrade-only membership flags
        const wasCAS = existingRecord.CAS_Member === true;
        const wasCANN = existingRecord.CANN_Member === true;
        if (wasCAS) merged.CAS_Member = true;
        if (wasCANN) merged.CANN_Member = true;

        // Drop blank/null values from the new payload so we don't wipe existing data
        for (const key of Object.keys(merged)) {
          const v = merged[key];
          if (v === null || v === undefined || v === "") {
            delete merged[key];
          }
        }
        // Layout cannot be changed via update — never include it
        delete merged.Layout;

        console.log(`[Zoho Sync Worker] 🔄 Email ${submissionEmail} already exists as Lead ${existingRecord.id} — updating instead of creating duplicate`);
        zohoRecord = await zohoCRMService.updateRecord(submission.zohoModule, existingRecord.id, merged);
        // updateRecord returns Zoho's success envelope which may not contain the id field
        if (!zohoRecord?.id) zohoRecord = { ...zohoRecord, id: existingRecord.id };
        actionTaken = "updated";
      } else {
        // ── CREATE PATH ─────────────────────────────────────────────────
        zohoRecord = await zohoCRMService.createRecord(submission.zohoModule, zohoData, layoutId);
        actionTaken = "created";
      }

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
        details: { zohoCrmId: zohoRecord.id, action: actionTaken },
      });

      console.log(`[Zoho Sync Worker] ✅ Submission #${submission.id} ${actionTaken} successfully! Zoho ID: ${zohoRecord.id}`);

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
          leadId: zohoRecord.id,
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
      
      let zohoData: any;

      // KNOWN_CENTRALIZED_FORMS: forms whose every field is explicitly handled by
      // buildCentralizedZohoData below. Skip smart-mapper entirely for these to
      // avoid fuzzy nonsense (e.g. wantsMembership → Number_Of_Chats at 80% similarity).
      const KNOWN_CENTRALIZED_FORMS = new Set([
        'CAS / CANN Registration',  // current unified form name
        'CAS Registration',          // legacy — kept for in-flight queued submissions
        'CAS & CANN Registration',   // legacy — kept for in-flight queued submissions
      ]);

      if (KNOWN_CENTRALIZED_FORMS.has(formName)) {
        console.log(`[Zoho Sync Worker] Using centralized-only mapping for "${formName}" (smart-mapper bypassed)`);
        zohoData = {};
      } else if (formConfig && (hasSubmitFields || hasFieldMappings)) {
        // Use config-based mapping
        console.log(`[Zoho Sync Worker] Using config-based mapping for "${formName}"`);
        const result = await zohoCRMService.formatFieldDataForZohoWithConfig(formData, formConfig);
        zohoData = result.zohoData;
      } else {
        // Use smart auto-mapping for unconfigured forms
        console.log(`[Zoho Sync Worker] Using smart auto-mapping for "${formName}"`);
        const { smartFieldMapper } = await import("./smart-field-mapper");
        const result = await smartFieldMapper.mapFormDataToZoho(formData, formName, zohoModule);
        
        console.log(`[Zoho Sync Worker] Smart mapping: ${result.mappedFields.length} mapped, ${result.unmappedFields.length} excluded`);
        zohoData = result.zohoData;
      }
      
      // POST-PROCESSING: Apply centralized business rules on top of smart/config mapping
      // This ensures CANN→CAS dependency, Record_Type, consent field completeness,
      // and Lead_Source differentiation are ALWAYS applied regardless of mapping path
      const { buildCentralizedZohoData } = await import("./zoho-crm-service");
      // Inject the original submission's created_at so Form_Submission_Date reflects when
      // the user actually submitted the form, not when this rescue/sync ran.
      const formDataWithTimestamp = {
        ...formData,
        _submissionCreatedAt: (formData as any)._submissionCreatedAt
          || (formData as any).submittedAt
          || (formData as any).created_at,
      };
      const centralResult = buildCentralizedZohoData({
        formData: formDataWithTimestamp,
        formName,
        isExcelImport: formName.includes('Excel'),
      });
      
      // Merge: centralized rules fill in any fields the smart/config mapper missed
      // Smart mapper's field values take precedence for fields it DID map
      const mergedData = { ...centralResult.zohoData, ...zohoData };
      
      // ALWAYS override these business-rule fields from centralized mapper
      // These must come from the centralized mapper to enforce dependencies and correct types
      if (centralResult.zohoData.CAS_Member !== undefined) mergedData.CAS_Member = centralResult.zohoData.CAS_Member;
      if (centralResult.zohoData.CANN_Member !== undefined) mergedData.CANN_Member = centralResult.zohoData.CANN_Member;
      if (centralResult.zohoData.Record_Type !== undefined) mergedData.Record_Type = centralResult.zohoData.Record_Type;
      if (centralResult.zohoData.Lead_Source !== undefined) mergedData.Lead_Source = centralResult.zohoData.Lead_Source;
      // Consent picklist fields: override even when value is "No" (check for undefined, not truthy)
      // This ensures picklist strings always win over smart mapper's boolean values
      if (centralResult.zohoData.CAS_Communications !== undefined) mergedData.CAS_Communications = centralResult.zohoData.CAS_Communications;
      if (centralResult.zohoData.CANN_Communications !== undefined) mergedData.CANN_Communications = centralResult.zohoData.CANN_Communications;
      if (centralResult.zohoData.Services_Map_Inclusion !== undefined) mergedData.Services_Map_Inclusion = centralResult.zohoData.Services_Map_Inclusion;
      // Form_Submission_Date must always reflect the original submission timestamp (from local DB),
      // never be overridden by smart-mapper output which doesn't know about it.
      if (centralResult.zohoData.Form_Submission_Date !== undefined) mergedData.Form_Submission_Date = centralResult.zohoData.Form_Submission_Date;
      
      console.log(`[Zoho Sync Worker] Post-processing rules applied: ${centralResult.appliedRules.join('; ')}`);
      
      return mergedData;
    } catch (error) {
      console.error(`[Zoho Sync Worker] Smart mapping failed, using fallback:`, error);
      return this.buildZohoDataFallback(formData, formName);
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

  /**
   * Fallback Zoho data builder for when smart mapping fails
   * Uses centralized mapping utility to ensure business rules are enforced
   */
  private buildZohoDataFallback(formData: any, formName: string): any {
    const { buildCentralizedZohoData } = require("./zoho-crm-service");
    const result = buildCentralizedZohoData({
      formData,
      formName,
      isExcelImport: formName.includes('Excel'),
    });

    console.log(`[Zoho Sync Worker] Centralized fallback mapping applied. Rules: ${result.appliedRules.join('; ')}`);
    return result.zohoData;
  }
}

// Singleton instance
export const zohoSyncWorker = new ZohoSyncWorker();
