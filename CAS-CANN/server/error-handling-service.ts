import { storage } from './storage';
import { oauthService } from './oauth-service';
import { zohoCRMService } from './zoho-crm-service';
import { fieldMetadataCacheService } from './field-metadata-cache-service';
import { notificationService } from './notification-service';
import type { FormSubmission, InsertSubmissionLog } from '@shared/schema';
import { z } from 'zod';

// Error classification schema
export const errorClassificationSchema = z.enum([
  'oauth_expired',
  'oauth_invalid',
  'rate_limit',
  'network_error',
  'validation_error',
  'crm_server_error',
  'field_mapping_error',
  'unknown_error'
]);

export type ErrorClassification = z.infer<typeof errorClassificationSchema>;

export interface ErrorAnalysis {
  classification: ErrorClassification;
  isRetryable: boolean;
  retryAfterSeconds: number;
  maxRetries: number;
  suggestedAction: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  jitterEnabled: boolean;
}

export interface AuditLogEntry {
  submissionId: number;
  operation: 'received' | 'field_sync' | 'crm_push' | 'retry_attempt';
  status: 'success' | 'failed' | 'in_progress';
  details: any;
  errorMessage?: string;
  duration?: number;
  retryAttempt?: number;
  errorClassification?: ErrorClassification;
}

export class ErrorHandlingService {
  private static instance: ErrorHandlingService;
  private retryConfigs: Map<ErrorClassification, RetryConfig> = new Map();
  private retryQueues: Map<ErrorClassification, Set<number>> = new Map();
  private retryTimers: Map<number, NodeJS.Timeout> = new Map();

  static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }

  constructor() {
    this.initializeRetryConfigurations();
    this.startRetryProcessor();
  }

  /**
   * Initialize retry configurations for different error types
   */
  private initializeRetryConfigurations() {
    console.log('[Error Handler] Initializing retry configurations...');

    // OAuth errors - immediate retry with token refresh
    this.retryConfigs.set('oauth_expired', {
      maxRetries: 3,
      baseDelayMs: 1000, // 1 second
      maxDelayMs: 5000,
      backoffMultiplier: 1.5,
      jitterEnabled: true,
    });

    this.retryConfigs.set('oauth_invalid', {
      maxRetries: 1, // Usually requires manual intervention
      baseDelayMs: 5000,
      maxDelayMs: 10000,
      backoffMultiplier: 1,
      jitterEnabled: false,
    });

    // Rate limiting - respect API limits with exponential backoff
    this.retryConfigs.set('rate_limit', {
      maxRetries: 5,
      baseDelayMs: 60000, // 1 minute
      maxDelayMs: 300000, // 5 minutes
      backoffMultiplier: 2,
      jitterEnabled: true,
    });

    // Network errors - aggressive retry with backoff
    this.retryConfigs.set('network_error', {
      maxRetries: 5,
      baseDelayMs: 2000,
      maxDelayMs: 30000,
      backoffMultiplier: 2,
      jitterEnabled: true,
    });

    // Server errors - moderate retry
    this.retryConfigs.set('crm_server_error', {
      maxRetries: 3,
      baseDelayMs: 5000,
      maxDelayMs: 30000,
      backoffMultiplier: 2,
      jitterEnabled: true,
    });

    // Field mapping errors - quick retry (might be temporary field cache issue)
    this.retryConfigs.set('field_mapping_error', {
      maxRetries: 2,
      baseDelayMs: 1000,
      maxDelayMs: 5000,
      backoffMultiplier: 2,
      jitterEnabled: false,
    });

    // Validation errors - usually not retryable
    this.retryConfigs.set('validation_error', {
      maxRetries: 0,
      baseDelayMs: 0,
      maxDelayMs: 0,
      backoffMultiplier: 1,
      jitterEnabled: false,
    });

    // Unknown errors - conservative retry
    this.retryConfigs.set('unknown_error', {
      maxRetries: 2,
      baseDelayMs: 10000,
      maxDelayMs: 60000,
      backoffMultiplier: 3,
      jitterEnabled: true,
    });

    console.log(`[Error Handler] Configured ${this.retryConfigs.size} error types`);
  }

  /**
   * Classify error based on error message and context
   */
  classifyError(error: Error | string, context?: any): ErrorAnalysis {
    const errorMessage = error instanceof Error ? error.message : error;
    const lowerError = errorMessage.toLowerCase();

    let classification: ErrorClassification = 'unknown_error';
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';

    // OAuth-related errors
    if (lowerError.includes('access_token') || lowerError.includes('unauthorized') || 
        lowerError.includes('authentication') || lowerError.includes('oauth')) {
      if (lowerError.includes('expired') || lowerError.includes('invalid_grant')) {
        classification = 'oauth_expired';
        severity = 'high';
      } else {
        classification = 'oauth_invalid';
        severity = 'critical';
      }
    }
    // Rate limiting
    else if (lowerError.includes('rate limit') || lowerError.includes('too many requests') ||
             lowerError.includes('quota exceeded') || error.toString().includes('429')) {
      classification = 'rate_limit';
      severity = 'medium';
    }
    // Network errors
    else if (lowerError.includes('network') || lowerError.includes('timeout') ||
             lowerError.includes('connection') || lowerError.includes('enotfound') ||
             lowerError.includes('econnreset')) {
      classification = 'network_error';
      severity = 'medium';
    }
    // Server errors
    else if (lowerError.includes('server error') || lowerError.includes('internal server') ||
             lowerError.includes('503') || lowerError.includes('502') || lowerError.includes('500')) {
      classification = 'crm_server_error';
      severity = 'high';
    }
    // Field mapping errors
    else if (lowerError.includes('field') && (lowerError.includes('invalid') || 
             lowerError.includes('missing') || lowerError.includes('mapping'))) {
      classification = 'field_mapping_error';
      severity = 'low';
    }
    // Validation errors
    else if (lowerError.includes('validation') || lowerError.includes('required') ||
             lowerError.includes('invalid format') || lowerError.includes('bad request')) {
      classification = 'validation_error';
      severity = 'low';
    }

    const retryConfig = this.retryConfigs.get(classification)!;
    
    return {
      classification,
      isRetryable: retryConfig.maxRetries > 0,
      retryAfterSeconds: Math.floor(retryConfig.baseDelayMs / 1000),
      maxRetries: retryConfig.maxRetries,
      suggestedAction: this.getSuggestedAction(classification),
      severity,
    };
  }

  /**
   * Get suggested action for error type
   */
  private getSuggestedAction(classification: ErrorClassification): string {
    switch (classification) {
      case 'oauth_expired':
        return 'Automatically refreshing OAuth token';
      case 'oauth_invalid':
        return 'Manual OAuth re-authentication required';
      case 'rate_limit':
        return 'Backing off and retrying after rate limit period';
      case 'network_error':
        return 'Retrying with exponential backoff';
      case 'crm_server_error':
        return 'CRM server issue - retrying after delay';
      case 'field_mapping_error':
        return 'Refreshing field cache and retrying';
      case 'validation_error':
        return 'Check form data format - manual intervention needed';
      case 'unknown_error':
        return 'Unknown error type - conservative retry strategy';
    }
  }

  /**
   * Handle error with intelligent retry logic
   */
  async handleError(
    submissionId: number, 
    error: Error | string, 
    operation: string,
    context?: any
  ): Promise<{
    shouldRetry: boolean;
    retryAfterMs: number;
    errorAnalysis: ErrorAnalysis;
  }> {
    const startTime = Date.now();
    
    try {
      // Analyze the error
      const errorAnalysis = this.classifyError(error, context);
      
      console.log(`[Error Handler] Handling ${errorAnalysis.classification} error for submission ${submissionId}`);
      console.log(`[Error Handler] Error message: ${error instanceof Error ? error.message : error}`);
      
      // Log the error with audit trail
      await this.auditLog({
        submissionId,
        operation: 'retry_attempt',
        status: 'in_progress',
        details: {
          errorMessage: error instanceof Error ? error.message : error,
          errorClassification: errorAnalysis.classification,
          context,
          operation,
        },
        errorMessage: error instanceof Error ? error.message : error,
        errorClassification: errorAnalysis.classification,
        duration: Date.now() - startTime,
      });

      // Get current submission state  
      const submissions = await storage.getFormSubmissions({});
      const submission = submissions.find(s => s.id === submissionId);
      
      if (!submission) {
        throw new Error(`Submission ${submissionId} not found`);
      }

      // Check if we've exceeded retry limits
      if (submission.retryCount >= errorAnalysis.maxRetries) {
        console.log(`[Error Handler] Max retries exceeded for submission ${submissionId}`);
        
        await this.auditLog({
          submissionId,
          operation: 'retry_attempt',
          status: 'failed',
          details: {
            reason: 'max_retries_exceeded',
            finalRetryCount: submission.retryCount,
            maxRetries: errorAnalysis.maxRetries,
          },
          errorMessage: `Max retries (${errorAnalysis.maxRetries}) exceeded`,
          errorClassification: errorAnalysis.classification,
          duration: Date.now() - startTime,
        });

        // Mark as permanently failed if critical
        if (errorAnalysis.severity === 'critical') {
          // Update submission status
          await storage.updateFormSubmission(submission.id, {
            errorMessage: `CRITICAL: ${error instanceof Error ? error.message : error} (Max retries exceeded)`,
          });

          // Send critical alert
          await this.sendCriticalErrorAlert(submission, errorAnalysis);
        }

        return {
          shouldRetry: false,
          retryAfterMs: 0,
          errorAnalysis,
        };
      }

      // Perform error-specific recovery actions
      await this.performErrorRecovery(errorAnalysis.classification, submission);

      // Calculate retry delay with jitter
      const retryConfig = this.retryConfigs.get(errorAnalysis.classification)!;
      const retryDelayMs = this.calculateRetryDelay(submission.retryCount, retryConfig);

      console.log(`[Error Handler] Will retry submission ${submissionId} after ${retryDelayMs}ms (attempt ${submission.retryCount + 1}/${retryConfig.maxRetries})`);

      // Schedule retry
      if (errorAnalysis.isRetryable) {
        this.scheduleRetry(submissionId, retryDelayMs);
      }

      await this.auditLog({
        submissionId,
        operation: 'retry_attempt',
        status: 'success',
        details: {
          scheduledRetryAfterMs: retryDelayMs,
          nextRetryAttempt: submission.retryCount + 1,
          errorRecoveryActions: await this.getRecoveryActionsTaken(errorAnalysis.classification),
        },
        errorClassification: errorAnalysis.classification,
        duration: Date.now() - startTime,
      });

      return {
        shouldRetry: errorAnalysis.isRetryable,
        retryAfterMs: retryDelayMs,
        errorAnalysis,
      };

    } catch (handlingError) {
      console.error(`[Error Handler] Failed to handle error for submission ${submissionId}:`, handlingError);
      
      // Fallback error handling
      return {
        shouldRetry: false,
        retryAfterMs: 0,
        errorAnalysis: {
          classification: 'unknown_error',
          isRetryable: false,
          retryAfterSeconds: 0,
          maxRetries: 0,
          suggestedAction: 'Manual intervention required - error handler failed',
          severity: 'critical',
        },
      };
    }
  }

  /**
   * Perform specific recovery actions based on error type
   */
  private async performErrorRecovery(classification: ErrorClassification, submission: FormSubmission): Promise<void> {
    console.log(`[Error Handler] Performing recovery actions for ${classification}`);

    switch (classification) {
      case 'oauth_expired':
        // Attempt to refresh OAuth token
        try {
          const tokenResult = await oauthService.getValidToken('zoho_crm');
          console.log('[Error Handler] OAuth token refreshed successfully');
        } catch (refreshError) {
          console.error('[Error Handler] Failed to refresh OAuth token:', refreshError);
        }
        break;

      case 'oauth_invalid':
        // Log OAuth issue for manual intervention
        console.warn('[Error Handler] OAuth invalid - manual re-authentication required');
        break;

      case 'rate_limit':
        // Add to rate limit queue (handled by retry processor)
        this.addToRetryQueue('rate_limit', submission.id);
        break;

      case 'field_mapping_error':
        // Refresh field metadata cache
        try {
          console.log('[Error Handler] Refreshing field metadata cache...');
          await fieldMetadataCacheService.forceRefresh();
          console.log('[Error Handler] Field metadata cache refreshed');
        } catch (cacheError) {
          console.error('[Error Handler] Failed to refresh field cache:', cacheError);
        }
        break;

      case 'network_error':
      case 'crm_server_error':
        // Log and rely on retry mechanism
        console.log(`[Error Handler] ${classification} - will retry with backoff`);
        break;

      case 'validation_error':
        // Log validation issue - usually requires manual review
        console.warn('[Error Handler] Validation error - manual review required');
        break;

      case 'unknown_error':
        // Conservative approach for unknown errors
        console.warn('[Error Handler] Unknown error type - conservative retry');
        break;
    }
  }

  /**
   * Get recovery actions taken for audit log
   */
  private async getRecoveryActionsTaken(classification: ErrorClassification): Promise<string[]> {
    const actions: string[] = [];

    switch (classification) {
      case 'oauth_expired':
        actions.push('Attempted OAuth token refresh');
        break;
      case 'oauth_invalid':
        actions.push('Marked for manual OAuth re-authentication');
        break;
      case 'rate_limit':
        actions.push('Added to rate limit queue');
        break;
      case 'field_mapping_error':
        actions.push('Triggered field metadata cache refresh');
        break;
      case 'network_error':
        actions.push('Scheduled network error retry');
        break;
      case 'crm_server_error':
        actions.push('Scheduled server error retry');
        break;
      case 'validation_error':
        actions.push('Marked for manual validation review');
        break;
      case 'unknown_error':
        actions.push('Applied conservative retry strategy');
        break;
    }

    return actions;
  }

  /**
   * Calculate retry delay with exponential backoff and jitter
   */
  private calculateRetryDelay(retryCount: number, config: RetryConfig): number {
    let delay = config.baseDelayMs * Math.pow(config.backoffMultiplier, retryCount);
    
    // Cap at max delay
    delay = Math.min(delay, config.maxDelayMs);
    
    // Add jitter to prevent thundering herd
    if (config.jitterEnabled) {
      const jitter = delay * 0.1 * Math.random(); // ±10% jitter
      delay += (Math.random() > 0.5 ? jitter : -jitter);
    }
    
    return Math.floor(delay);
  }

  /**
   * Schedule a retry for a submission
   */
  private scheduleRetry(submissionId: number, delayMs: number): void {
    // Clear existing timer if any
    if (this.retryTimers.has(submissionId)) {
      clearTimeout(this.retryTimers.get(submissionId)!);
    }

    // Schedule new retry
    const timer = setTimeout(async () => {
      await this.executeRetry(submissionId);
      this.retryTimers.delete(submissionId);
    }, delayMs);

    this.retryTimers.set(submissionId, timer);
  }

  /**
   * Execute retry for a specific submission
   */
  private async executeRetry(submissionId: number): Promise<void> {
    console.log(`[Error Handler] Executing retry for submission ${submissionId}`);
    
    try {
      const submissions = await storage.getFormSubmissions({});
      const submission = submissions.find(s => s.id === submissionId);
      
      if (!submission) {
        console.error(`[Error Handler] Submission ${submissionId} not found for retry`);
        return;
      }

      // Increment retry count
      await storage.incrementRetryCount(submission.id);
      
      // Update last retry timestamp
      await storage.updateFormSubmission(submission.id, {
        lastRetryAt: new Date(),
      });

      // Audit log the retry attempt
      await this.auditLog({
        submissionId: submission.id,
        operation: 'retry_attempt',
        status: 'in_progress',
        details: {
          retryAttempt: submission.retryCount + 1,
          originalError: submission.errorMessage,
        },
        retryAttempt: submission.retryCount + 1,
      });

      // Attempt to process the submission again
      // This would typically call the form processing service
      console.log(`[Error Handler] Re-attempting to process submission ${submissionId}`);
      
      // For now, we'll use the existing CRM service directly
      // In a full implementation, this would call the form processing pipeline
      
      try {
        // Attempt CRM sync again
        const crmData = submission.submissionData as Record<string, any>;
        const result = await zohoCRMService.createRecord(submission.zohoModule, crmData);
        
        if (result && result.data && result.data.length > 0) {
          const zohoCrmId = result.data[0].details.id;
          
          // Update submission with success
          await storage.updateFormSubmission(submission.id, {
            zohoCrmId,
            errorMessage: null,
          });

          console.log(`[Error Handler] ✅ Retry successful for submission ${submissionId}, CRM ID: ${zohoCrmId}`);
          
          await this.auditLog({
            submissionId: submission.id,
            operation: 'retry_attempt',
            status: 'success',
            details: {
              zohoCrmId,
              retryAttempt: submission.retryCount + 1,
            },
            retryAttempt: submission.retryCount + 1,
          });

        } else {
          throw new Error('CRM response did not contain expected data structure');
        }

      } catch (retryError) {
        console.error(`[Error Handler] Retry failed for submission ${submissionId}:`, retryError);
        
        // Handle the retry error recursively
        await this.handleError(submissionId, retryError as Error, 'retry_attempt');
        
        await this.auditLog({
          submissionId: submission.id,
          operation: 'retry_attempt',
          status: 'failed',
          details: {
            retryError: retryError instanceof Error ? retryError.message : String(retryError),
            retryAttempt: submission.retryCount + 1,
          },
          errorMessage: retryError instanceof Error ? retryError.message : String(retryError),
          retryAttempt: submission.retryCount + 1,
        });
      }

    } catch (error) {
      console.error(`[Error Handler] Failed to execute retry for submission ${submissionId}:`, error);
    }
  }

  /**
   * Add submission to retry queue
   */
  private addToRetryQueue(classification: ErrorClassification, submissionId: number): void {
    if (!this.retryQueues.has(classification)) {
      this.retryQueues.set(classification, new Set());
    }
    this.retryQueues.get(classification)!.add(submissionId);
  }

  /**
   * Start the retry processor (runs periodically)
   */
  private startRetryProcessor(): void {
    // Process retry queues every minute
    setInterval(async () => {
      await this.processRetryQueues();
    }, 60 * 1000);

    console.log('[Error Handler] Retry processor started (60-second intervals)');
  }

  /**
   * Process all retry queues
   */
  private async processRetryQueues(): Promise<void> {
    for (const [classification, queue] of Array.from(this.retryQueues.entries())) {
      if (queue.size > 0) {
        console.log(`[Error Handler] Processing ${queue.size} items in ${classification} retry queue`);
        
        // Process items from the queue
        const items = Array.from(queue);
        queue.clear();
        
        for (const submissionId of items) {
          try {
            await this.executeRetry(submissionId);
          } catch (error) {
            console.error(`[Error Handler] Queue processing failed for submission ${submissionId}:`, error);
          }
        }
      }
    }
  }

  /**
   * Send critical error alert
   */
  private async sendCriticalErrorAlert(submission: FormSubmission, errorAnalysis: ErrorAnalysis): Promise<void> {
    try {
      console.log(`[Error Handler] Sending critical error alert for submission ${submission.id}`);
      
      // This would integrate with the notification service
      // For now, we'll log the alert
      console.log(`
🚨 CRITICAL ERROR ALERT 🚨
Submission ID: ${submission.id}
Form: ${submission.formName}
Error Classification: ${errorAnalysis.classification}
Error Message: ${submission.errorMessage}
Retry Count: ${submission.retryCount}
Suggested Action: ${errorAnalysis.suggestedAction}
      `.trim());

    } catch (error) {
      console.error('[Error Handler] Failed to send critical error alert:', error);
    }
  }

  /**
   * Create audit log entry
   */
  async auditLog(entry: AuditLogEntry): Promise<void> {
    try {
      const logEntry: InsertSubmissionLog = {
        submissionId: entry.submissionId,
        operation: entry.operation,
        status: entry.status,
        details: entry.details,
        errorMessage: entry.errorMessage,
        duration: entry.duration,
      };

      await storage.createSubmissionLog(logEntry);

    } catch (error) {
      console.error('[Error Handler] Failed to create audit log:', error);
    }
  }

  /**
   * Get error statistics
   */
  async getErrorStatistics(): Promise<{
    totalErrors: number;
    errorsByClassification: Record<ErrorClassification, number>;
    errorsByStatus: Record<string, number>;
    retrySuccessRate: number;
    averageRetryAttempts: number;
  }> {
    try {
      // Get submissions with errors
      const allSubmissions = await storage.getFormSubmissions({});
      const failedSubmissions = allSubmissions.filter(s => s.syncStatus === 'failed');

      const totalErrors = failedSubmissions.length;

      // Count by error classification (would need to enhance storage to track this)
      const errorsByClassification = {} as Record<ErrorClassification, number>;
      const errorsByStatus = {} as Record<string, number>;

      failedSubmissions.forEach(submission => {
        // This would work better with error classification stored in database
        const analysis = this.classifyError(submission.errorMessage || 'Unknown error');
        errorsByClassification[analysis.classification] = 
          (errorsByClassification[analysis.classification] || 0) + 1;
        
        errorsByStatus[submission.syncStatus] = 
          (errorsByStatus[submission.syncStatus] || 0) + 1;
      });

      // Calculate retry statistics
      const retriedSubmissions = failedSubmissions.filter(s => s.retryCount > 0);
      const successfulRetries = allSubmissions.filter(s => s.syncStatus === 'synced');
      const successfulAfterRetry = successfulRetries.filter(s => s.retryCount > 0);
      
      const retrySuccessRate = retriedSubmissions.length > 0 
        ? (successfulAfterRetry.length / retriedSubmissions.length) * 100 
        : 0;

      const averageRetryAttempts = retriedSubmissions.length > 0
        ? retriedSubmissions.reduce((sum, s) => sum + s.retryCount, 0) / retriedSubmissions.length
        : 0;

      return {
        totalErrors,
        errorsByClassification,
        errorsByStatus,
        retrySuccessRate: Math.round(retrySuccessRate * 100) / 100,
        averageRetryAttempts: Math.round(averageRetryAttempts * 100) / 100,
      };

    } catch (error) {
      console.error('[Error Handler] Failed to get error statistics:', error);
      throw error;
    }
  }

  /**
   * Cleanup method
   */
  destroy(): void {
    // Clear all retry timers
    for (const timer of Array.from(this.retryTimers.values())) {
      clearTimeout(timer);
    }
    this.retryTimers.clear();
    
    // Clear retry queues
    this.retryQueues.clear();
    
    console.log('[Error Handler] Service destroyed and resources cleaned up');
  }
}

export const errorHandlingService = ErrorHandlingService.getInstance();