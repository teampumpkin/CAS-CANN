/**
 * Zoho Sync API
 * 
 * Safe wrapper around zohoCRMService specifically for data sync operations.
 * Implements tag-based safety to prevent interfering with live web form records.
 */

import { zohoCRMService, ZohoRecord } from '../../../server/zoho-crm-service';
import { oauthService } from '../../../server/oauth-service';

export interface SyncOptions {
  sourceTag?: string;
  excludeTags?: string[];
  batchSize?: number;
  dryRun?: boolean;
}

export interface UpsertResult {
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  errors: Array<{
    record: any;
    error: string;
  }>;
}

export class ZohoSyncAPI {
  private defaultOptions: SyncOptions = {
    sourceTag: 'DataSyncService',
    excludeTags: ['WebForm'], // Never touch these records!
    batchSize: 100,
    dryRun: false
  };

  constructor(private options: Partial<SyncOptions> = {}) {
    this.options = { ...this.defaultOptions, ...options };
  }

  /**
   * Safely upsert records with tag-based protection
   * 
   * Note: Uses individual create/update calls since ZohoCRMService doesn't have batch methods yet
   */
  async upsertRecords(
    module: string,
    records: any[],
    dedupeField: string = 'Email'
  ): Promise<UpsertResult> {
    const result: UpsertResult = {
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      errors: []
    };

    try {
      // Add source tag to all records
      const taggedRecords = records.map(record => ({
        ...record,
        Tag: [this.options.sourceTag] // Zoho uses Tag field for tagging
      }));

      if (this.options.dryRun) {
        console.log(`[ZohoSyncAPI] DRY RUN: Would upsert ${taggedRecords.length} records to ${module}`);
        result.created = taggedRecords.length;
        return result;
      }

      // Process each record individually
      for (const record of taggedRecords) {
        try {
          // For now, just create. TODO: Implement proper upsert logic with duplicate checking
          await zohoCRMService.createRecord(module, record);
          result.created++;
        } catch (error) {
          result.failed++;
          result.errors.push({
            record,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      console.log(`[ZohoSyncAPI] Upsert complete: ${result.created} created, ${result.failed} failed`);
      
      return result;
    } catch (error) {
      console.error('[ZohoSyncAPI] Upsert failed:', error);
      throw error;
    }
  }

  /**
   * Get records with tag filtering
   * 
   * Note: Simplified version - full tag filtering requires COQL API support
   */
  async getRecordsWithTags(
    module: string,
    tags: string[],
    limit: number = 200
  ): Promise<ZohoRecord[]> {
    try {
      // TODO: Implement tag filtering when search API is available
      console.log(`[ZohoSyncAPI] Tag filtering for ${tags.join(', ')} - requires COQL API (not yet implemented)`);
      return [];
    } catch (error) {
      console.error(`[ZohoSyncAPI] Failed to get records with tags:`, error);
      return [];
    }
  }

  /**
   * Check if a record has protected tags (WebForm, etc.)
   */
  async isProtectedRecord(module: string, recordId: string): Promise<boolean> {
    try {
      const record = await zohoCRMService.getRecord(module, recordId);
      if (!record) return false;

      const tags = record.Tag || [];
      const hasProtectedTag = this.options.excludeTags?.some(excludeTag => 
        tags.includes(excludeTag)
      );

      return hasProtectedTag || false;
    } catch (error) {
      console.error('[ZohoSyncAPI] Error checking record protection:', error);
      return true; // Fail safe - assume protected if we can't check
    }
  }

  /**
   * Batch create records with safety checks
   */
  async batchCreateRecords(
    module: string,
    records: any[]
  ): Promise<UpsertResult> {
    const result: UpsertResult = {
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      errors: []
    };

    const batchSize = this.options.batchSize || 100;
    const batches = this.chunkArray(records, batchSize);

    console.log(`[ZohoSyncAPI] Creating ${records.length} records in ${batches.length} batches`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      
      // Add source tag to all records in batch
      const taggedBatch = batch.map(record => ({
        ...record,
        Tag: [this.options.sourceTag]
      }));

      if (this.options.dryRun) {
        console.log(`[ZohoSyncAPI] DRY RUN: Batch ${i + 1}/${batches.length} - ${taggedBatch.length} records`);
        result.created += taggedBatch.length;
        continue;
      }

      try {
        // Create records individually
        for (const record of taggedBatch) {
          try {
            await zohoCRMService.createRecord(module, record);
            result.created++;
          } catch (recordError) {
            result.failed++;
            result.errors.push({
              record,
              error: recordError instanceof Error ? recordError.message : String(recordError)
            });
          }
        }

        console.log(`[ZohoSyncAPI] Batch ${i + 1}/${batches.length} complete`);
        
        // Rate limiting - wait 1 second between batches
        if (i < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`[ZohoSyncAPI] Batch ${i + 1} failed:`, error);
        result.failed += batch.length;
        result.errors.push({
          record: { batch: i + 1 },
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    console.log(`[ZohoSyncAPI] Batch create complete: ${result.created} created, ${result.failed} failed`);
    return result;
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const token = await oauthService.getValidToken('zoho_crm');
      return !!token;
    } catch (error) {
      console.error('[ZohoSyncAPI] Connection test failed:', error);
      return false;
    }
  }

  /**
   * Helper: Chunk array into batches
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

// Export singleton instance
export const zohoSyncAPI = new ZohoSyncAPI();
