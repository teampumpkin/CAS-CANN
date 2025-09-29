import { storage } from './storage';
import { zohoCRMService } from './zoho-crm-service';
import type { FieldMetadataCache, InsertFieldMetadataCache } from '@shared/schema';

export interface CacheStats {
  totalFields: number;
  customFields: number;
  requiredFields: number;
  lastSyncTime: Date | null;
  cacheAge: number; // in hours
}

export class FieldMetadataCacheService {
  private static instance: FieldMetadataCacheService;
  private syncTimer: NodeJS.Timeout | null = null;
  private isSyncing: boolean = false;

  static getInstance(): FieldMetadataCacheService {
    if (!FieldMetadataCacheService.instance) {
      FieldMetadataCacheService.instance = new FieldMetadataCacheService();
    }
    return FieldMetadataCacheService.instance;
  }

  /**
   * Initialize the caching service with daily sync timer
   */
  async initialize(): Promise<void> {
    console.log('[Field Cache] Initializing field metadata cache service...');
    
    try {
      // Check cache health on startup
      const stats = await this.getCacheStats();
      console.log('[Field Cache] Cache statistics:', stats);

      // Sync metadata if cache is stale (older than 12 hours)
      if (!stats.lastSyncTime || stats.cacheAge > 12) {
        console.log('[Field Cache] Cache is stale, triggering initial sync...');
        await this.syncAllModuleMetadata();
      }

      // Start daily sync timer
      this.startDailySync();
      
    } catch (error) {
      console.error('[Field Cache] Error during initialization:', error);
    }
  }

  /**
   * Start daily metadata sync timer
   */
  private startDailySync(): void {
    // Clear existing timer if any
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    // Sync every 24 hours (daily)
    this.syncTimer = setInterval(async () => {
      try {
        console.log('[Field Cache] Daily metadata sync triggered...');
        await this.syncAllModuleMetadata();
      } catch (error) {
        console.error('[Field Cache] Daily sync error:', error);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours

    console.log('[Field Cache] Daily sync timer started (24h interval)');
  }

  /**
   * Stop daily sync timer
   */
  private stopDailySync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
      console.log('[Field Cache] Daily sync timer stopped');
    }
  }

  /**
   * Sync metadata for all modules (Leads, Contacts)
   */
  async syncAllModuleMetadata(): Promise<{
    leads: number;
    contacts: number;
    errors: string[];
  }> {
    if (this.isSyncing) {
      console.log('[Field Cache] Sync already in progress, skipping...');
      return { leads: 0, contacts: 0, errors: ['Sync already in progress'] };
    }

    this.isSyncing = true;
    const results = { leads: 0, contacts: 0, errors: [] as string[] };

    try {
      console.log('[Field Cache] Starting metadata sync for all modules...');
      
      // Sync Leads module
      try {
        results.leads = await this.syncModuleMetadata('Leads');
        console.log(`[Field Cache] Synced ${results.leads} fields for Leads module`);
      } catch (error) {
        const errorMsg = `Failed to sync Leads: ${error instanceof Error ? error.message : 'Unknown error'}`;
        results.errors.push(errorMsg);
        console.error(`[Field Cache] ${errorMsg}`);
      }

      // Sync Contacts module
      try {
        results.contacts = await this.syncModuleMetadata('Contacts');
        console.log(`[Field Cache] Synced ${results.contacts} fields for Contacts module`);
      } catch (error) {
        const errorMsg = `Failed to sync Contacts: ${error instanceof Error ? error.message : 'Unknown error'}`;
        results.errors.push(errorMsg);
        console.error(`[Field Cache] ${errorMsg}`);
      }

      console.log('[Field Cache] Metadata sync completed:', results);
      return results;

    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sync metadata for a specific Zoho module
   */
  async syncModuleMetadata(zohoModule: string): Promise<number> {
    console.log(`[Field Cache] Syncing metadata for ${zohoModule} module...`);
    
    try {
      // Fetch fields from Zoho CRM
      const zohoFields = await zohoCRMService.getFieldsForModule(zohoModule);
      console.log(`[Field Cache] Retrieved ${zohoFields.length} fields from Zoho ${zohoModule} API`);

      const syncedFieldNames: string[] = [];
      
      // Upsert each field into cache
      for (const field of zohoFields) {
        const cacheMetadata: InsertFieldMetadataCache = {
          zohoModule,
          fieldApiName: field.api_name,
          fieldLabel: field.field_label,
          dataType: field.data_type,
          isCustomField: field.custom_field || false,
          isRequired: field.required || false,
          maxLength: field.length || null,
          picklistValues: field.pick_list_values || null,
          fieldMetadata: field as any, // Store full Zoho field object
        };

        await storage.upsertFieldMetadata(cacheMetadata);
        syncedFieldNames.push(field.api_name);
      }

      // Clean up stale fields (fields that no longer exist in Zoho)
      const deletedCount = await storage.deleteStaleFieldMetadata(zohoModule, syncedFieldNames);
      if (deletedCount > 0) {
        console.log(`[Field Cache] Cleaned up ${deletedCount} stale fields for ${zohoModule}`);
      }

      // Update sync timestamp for this module
      await storage.refreshFieldMetadataSync(zohoModule);
      
      console.log(`[Field Cache] Successfully synced ${zohoFields.length} fields for ${zohoModule}`);
      return zohoFields.length;

    } catch (error) {
      console.error(`[Field Cache] Failed to sync metadata for ${zohoModule}:`, error);
      throw error;
    }
  }

  /**
   * Get cached field metadata for a specific module
   */
  async getCachedFields(zohoModule: string): Promise<FieldMetadataCache[]> {
    return await storage.getFieldMetadataCache({ zohoModule });
  }

  /**
   * Get cached field metadata for a specific field
   */
  async getCachedField(zohoModule: string, fieldApiName: string): Promise<FieldMetadataCache | null> {
    const metadata = await storage.getFieldMetadata(zohoModule, fieldApiName);
    return metadata || null;
  }

  /**
   * Check if field exists in cache
   */
  async isFieldCached(zohoModule: string, fieldApiName: string): Promise<boolean> {
    const metadata = await this.getCachedField(zohoModule, fieldApiName);
    return metadata !== null;
  }

  /**
   * Get cache statistics for monitoring
   */
  async getCacheStats(): Promise<CacheStats> {
    const allFields = await storage.getFieldMetadataCache();
    
    let lastSyncTime: Date | null = null;
    if (allFields.length > 0) {
      // Find the most recent sync time
      lastSyncTime = allFields.reduce((latest, field) => {
        return (!latest || field.lastSynced! > latest) ? field.lastSynced! : latest;
      }, null as Date | null);
    }

    const cacheAge = lastSyncTime 
      ? (Date.now() - lastSyncTime.getTime()) / (1000 * 60 * 60) // hours
      : 0;

    return {
      totalFields: allFields.length,
      customFields: allFields.filter(f => f.isCustomField).length,
      requiredFields: allFields.filter(f => f.isRequired).length,
      lastSyncTime,
      cacheAge: Math.round(cacheAge * 100) / 100, // round to 2 decimals
    };
  }

  /**
   * Force refresh cache for all modules
   */
  async forceRefresh(): Promise<{
    success: boolean;
    results?: { leads: number; contacts: number; errors: string[] };
    error?: string;
  }> {
    try {
      console.log('[Field Cache] Force refresh requested...');
      const results = await this.syncAllModuleMetadata();
      return { success: true, results };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Field Cache] Force refresh failed:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Get field mapping suggestions for dynamic form fields
   */
  async getFieldMappingSuggestions(formFields: string[], zohoModule: string = 'Leads'): Promise<{
    [formField: string]: FieldMetadataCache | null;
  }> {
    const cachedFields = await this.getCachedFields(zohoModule);
    const suggestions: { [formField: string]: FieldMetadataCache | null } = {};

    for (const formField of formFields) {
      // Try exact match first
      let match = cachedFields.find(f => f.fieldApiName.toLowerCase() === formField.toLowerCase());
      
      // Try partial match on field label
      if (!match) {
        match = cachedFields.find(f => 
          f.fieldLabel.toLowerCase().includes(formField.toLowerCase()) ||
          formField.toLowerCase().includes(f.fieldLabel.toLowerCase())
        );
      }

      // Try common field name patterns
      if (!match) {
        const commonMappings: { [key: string]: string } = {
          'firstname': 'First_Name',
          'lastname': 'Last_Name', 
          'email': 'Email',
          'phone': 'Phone',
          'company': 'Company',
          'title': 'Designation',
          'message': 'Description',
        };
        
        const mappedName = commonMappings[formField.toLowerCase()];
        if (mappedName) {
          match = cachedFields.find(f => f.fieldApiName === mappedName);
        }
      }

      suggestions[formField] = match || null;
    }

    return suggestions;
  }
}

export const fieldMetadataCacheService = FieldMetadataCacheService.getInstance();