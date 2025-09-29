import { storage } from "./storage";
import { zohoCRMService, ZohoField, ZohoFieldCreateRequest } from "./zoho-crm-service";
import { FieldMapping, InsertFieldMapping, FormSubmission } from "@shared/schema";

export interface FieldSyncResult {
  success: boolean;
  fieldsProcessed: number;
  fieldsCreated: number;
  fieldsSynced: number;
  errors: string[];
  details: {
    existing: string[];
    created: string[];
    failed: string[];
  };
}

export interface FieldComparisonResult {
  existing: FieldMapping[];
  missing: Array<{
    fieldName: string;
    formFieldName: string;
    fieldType: string;
    sampleValue: any;
  }>;
  needsUpdate: FieldMapping[];
}

export class FieldSyncEngine {
  private readonly MAX_FIELD_LENGTH = 255;
  private readonly MAX_PICKLIST_VALUES = 100;

  constructor() {}

  /**
   * Main sync method - compares form data against CRM fields and creates missing ones
   */
  async syncFieldsForSubmission(submission: FormSubmission): Promise<FieldSyncResult> {
    const startTime = Date.now();
    const syncId = `fieldsync_${submission.id}_${Math.random().toString(36).substr(2, 6)}`;
    
    const result: FieldSyncResult = {
      success: false,
      fieldsProcessed: 0,
      fieldsCreated: 0,
      fieldsSynced: 0,
      errors: [],
      details: {
        existing: [],
        created: [],
        failed: []
      }
    };

    try {
      console.log(`\n=== [FIELD SYNC START] Sync ID: ${syncId} ===`);
      console.log(`[${syncId}] Submission: ${submission.id} (${submission.formName})`);
      console.log(`[${syncId}] Target Module: ${submission.zohoModule}`);
      console.log(`[${syncId}] Form Data Fields: ${Object.keys(submission.submissionData as any).join(', ')}`);
      console.log(`[${syncId}] Total Fields to Process: ${Object.keys(submission.submissionData as any).length}`);
      
      // Log the operation start
      await storage.createSubmissionLog({
        submissionId: submission.id,
        operation: "field_sync",
        status: "in_progress",
        details: {
          module: submission.zohoModule,
          formName: submission.formName,
          fieldCount: Object.keys(submission.submissionData as any).length,
          syncId: syncId
        }
      });

      // Step 1: Get current field mappings from database
      console.log(`[${syncId}] 📋 Step 1: Retrieving existing field mappings from database...`);
      const mappingLookupStartTime = Date.now();
      
      const existingMappings = await storage.getFieldMappings({
        zohoModule: submission.zohoModule
      });
      
      const mappingLookupDuration = Date.now() - mappingLookupStartTime;
      console.log(`[${syncId}] ✅ Field mappings retrieved (${mappingLookupDuration}ms):`, {
        mappingCount: existingMappings.length,
        existingFields: existingMappings.map(m => ({
          field: m.fieldName,
          type: m.fieldType,
          isCustom: m.isCustomField,
          lastSynced: m.lastSyncedAt
        }))
      });

      // Step 2: Compare form fields against existing mappings
      console.log(`[${syncId}] 🔍 Step 2: Analyzing field differences...`);
      const comparisonStartTime = Date.now();
      
      const comparison = await this.compareFields(
        submission.submissionData as Record<string, any>,
        existingMappings,
        submission.zohoModule,
        syncId
      );
      
      const comparisonDuration = Date.now() - comparisonStartTime;
      console.log(`[${syncId}] ✅ Field comparison completed (${comparisonDuration}ms):`, {
        existingFields: comparison.existing.length,
        missingFields: comparison.missing.length,
        fieldsNeedingUpdate: comparison.needsUpdate.length,
        missingFieldNames: comparison.missing.map(f => f.fieldName),
        existingFieldNames: comparison.existing.map(f => f.fieldName)
      });

      result.fieldsProcessed = comparison.existing.length + comparison.missing.length;

      // Step 3: Create missing fields in Zoho CRM
      if (comparison.missing.length > 0) {
        console.log(`[${syncId}] 🔧 Step 3: Creating ${comparison.missing.length} missing fields in Zoho CRM...`);
        
        for (let i = 0; i < comparison.missing.length; i++) {
          const missingField = comparison.missing[i];
          const fieldCreateStartTime = Date.now();
          
          console.log(`[${syncId}] Creating field ${i + 1}/${comparison.missing.length}: ${missingField.fieldName}`, {
            fieldType: missingField.fieldType,
            sampleValue: missingField.sampleValue,
            targetModule: submission.zohoModule
          });
          
          try {
            await this.createFieldInZohoCRM(missingField, submission.zohoModule, syncId);
            const fieldCreateDuration = Date.now() - fieldCreateStartTime;
            
            result.fieldsCreated++;
            result.details.created.push(missingField.fieldName);
            
            console.log(`[${syncId}] ✅ Field created successfully (${fieldCreateDuration}ms): ${missingField.fieldName}`);
            
          } catch (error) {
            const fieldCreateDuration = Date.now() - fieldCreateStartTime;
            const errorMsg = `Failed to create field ${missingField.fieldName}: ${error instanceof Error ? error.message : 'Unknown error'}`;
            
            result.errors.push(errorMsg);
            result.details.failed.push(missingField.fieldName);
            
            console.error(`[${syncId}] ❌ Field creation failed (${fieldCreateDuration}ms): ${missingField.fieldName}`, {
              error: error instanceof Error ? error.message : 'Unknown error',
              stack: error instanceof Error ? error.stack : undefined,
              fieldType: missingField.fieldType
            });
          }
        }
        
        console.log(`[${syncId}] Field creation phase completed:`, {
          attempted: comparison.missing.length,
          successful: result.fieldsCreated,
          failed: result.details.failed.length,
          successRate: `${((result.fieldsCreated / comparison.missing.length) * 100).toFixed(1)}%`
        });
      } else {
        console.log(`[${syncId}] ✅ No missing fields detected, all form fields already exist in CRM`);
      }

      // Step 4: Update field mappings in database
      console.log(`[${syncId}] 🔄 Step 4: Refreshing field mappings from Zoho...`);
      const mappingUpdateStartTime = Date.now();
      
      await this.updateFieldMappingsFromZoho(submission.zohoModule, syncId);
      const mappingUpdateDuration = Date.now() - mappingUpdateStartTime;
      
      result.fieldsSynced = result.fieldsCreated + comparison.existing.length;

      // Mark existing fields as still valid
      result.details.existing = comparison.existing.map(f => f.fieldName);

      // Determine overall success
      result.success = result.errors.length === 0;

      const duration = Date.now() - startTime;
      
      console.log(`[${syncId}] ✅ Field mappings refreshed (${mappingUpdateDuration}ms)`);
      console.log(`[${syncId}] 🎉 FIELD SYNC COMPLETED (${duration}ms):`, {
        success: result.success,
        fieldsProcessed: result.fieldsProcessed,
        fieldsCreated: result.fieldsCreated,
        fieldsSynced: result.fieldsSynced,
        errorCount: result.errors.length,
        existingFields: result.details.existing.length,
        createdFields: result.details.created,
        failedFields: result.details.failed
      });
      
      // Log the operation completion
      await storage.createSubmissionLog({
        submissionId: submission.id,
        operation: "field_sync",
        status: result.success ? "success" : "failed",
        details: {
          ...result.details,
          duration,
          fieldsProcessed: result.fieldsProcessed,
          fieldsCreated: result.fieldsCreated,
          syncId: syncId,
          timings: {
            mappingLookup: mappingLookupDuration,
            fieldComparison: comparisonDuration,
            mappingUpdate: mappingUpdateDuration
          }
        },
        duration,
        errorMessage: result.errors.length > 0 ? result.errors.join("; ") : undefined
      });

      console.log(`=== [FIELD SYNC END] Sync ID: ${syncId} ===\n`);

    } catch (error) {
      const errorMsg = `Field sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      result.errors.push(errorMsg);
      result.success = false;

      console.error(`[FieldSync] ${errorMsg}`);
      
      // Log the error
      await storage.createSubmissionLog({
        submissionId: submission.id,
        operation: "field_sync",
        status: "failed",
        details: { error: errorMsg },
        duration: Date.now() - startTime,
        errorMessage: errorMsg
      });
    }

    return result;
  }

  /**
   * Compare form fields against existing field mappings
   */
  private async compareFields(
    formData: Record<string, any>,
    existingMappings: FieldMapping[],
    zohoModule: string,
    syncId: string
  ): Promise<FieldComparisonResult> {
    const existingFieldNames = new Set(existingMappings.map(m => m.fieldName));
    const missing: FieldComparisonResult["missing"] = [];
    const needsUpdate: FieldMapping[] = [];

    // Add Source_Form field if not exists
    if (!existingFieldNames.has("Source_Form")) {
      missing.push({
        fieldName: "Source_Form",
        formFieldName: "Source_Form",
        fieldType: "text",
        sampleValue: "form_name"
      });
    }

    // Check each form field
    for (const [formFieldName, value] of Object.entries(formData)) {
      const zohoFieldName = zohoCRMService.convertToZohoFieldName(formFieldName);
      
      if (!existingFieldNames.has(zohoFieldName)) {
        const fieldType = zohoCRMService.detectFieldType(value, formFieldName);
        
        missing.push({
          fieldName: zohoFieldName,
          formFieldName,
          fieldType,
          sampleValue: value
        });
      } else {
        // Check if existing field needs update (e.g., new picklist values)
        const existingMapping = existingMappings.find(m => m.fieldName === zohoFieldName);
        if (existingMapping && this.needsFieldUpdate(existingMapping, value)) {
          needsUpdate.push(existingMapping);
        }
      }
    }

    return {
      existing: existingMappings.filter(m => !needsUpdate.includes(m)),
      missing,
      needsUpdate
    };
  }

  /**
   * Create a field in Zoho CRM and update local mappings
   */
  private async createFieldInZohoCRM(
    fieldInfo: FieldComparisonResult["missing"][0],
    zohoModule: string,
    syncId: string
  ): Promise<void> {
    const fieldRequest: ZohoFieldCreateRequest = {
      api_name: fieldInfo.fieldName,
      field_label: fieldInfo.formFieldName,
      data_type: fieldInfo.fieldType as any,
      required: false
    };

    // Set length for text fields
    if (fieldInfo.fieldType === "text") {
      fieldRequest.length = Math.min(this.getFieldLength(fieldInfo.sampleValue), this.MAX_FIELD_LENGTH);
    }

    // Generate picklist values for appropriate fields
    if (fieldInfo.fieldType === "picklist" || fieldInfo.fieldType === "multiselectpicklist") {
      fieldRequest.pick_list_values = this.generatePicklistFromValue(fieldInfo.sampleValue);
    }

    console.log(`[FieldSync] Creating field ${fieldInfo.fieldName} in ${zohoModule}:`, fieldRequest);

    // Create field in Zoho CRM
    const createdField = await zohoCRMService.createCustomField(zohoModule, fieldRequest);

    // Save field mapping to database
    const mappingData: InsertFieldMapping = {
      zohoModule,
      fieldName: fieldInfo.fieldName,
      fieldType: fieldInfo.fieldType,
      isCustomField: true,
      picklistValues: fieldRequest.pick_list_values || null,
      isRequired: false,
      maxLength: fieldRequest.length || null
    };

    await storage.createFieldMapping(mappingData);
    console.log(`[FieldSync] Saved field mapping for ${fieldInfo.fieldName}`);
  }

  /**
   * Update field mappings from Zoho CRM (refresh our local cache)
   */
  async updateFieldMappingsFromZoho(zohoModule: string, syncId: string): Promise<void> {
    try {
      console.log(`[${syncId}] 🔄 Refreshing field mappings for module: ${zohoModule}`);
      const fetchStartTime = Date.now();
      
      const zohoFields = await zohoCRMService.getModuleFields(zohoModule);
      const fetchDuration = Date.now() - fetchStartTime;
      
      console.log(`[${syncId}] ✅ Retrieved ${zohoFields.length} fields from Zoho (${fetchDuration}ms):`, {
        module: zohoModule,
        fieldCount: zohoFields.length,
        customFields: zohoFields.filter(f => f.custom_field).length,
        standardFields: zohoFields.filter(f => !f.custom_field).length
      });
      const existingMappings = await storage.getFieldMappings({ zohoModule });
      const existingFieldNames = new Set(existingMappings.map(m => m.fieldName));

      for (const zohoField of zohoFields) {
        if (!existingFieldNames.has(zohoField.api_name)) {
          // New field found in Zoho - add to our mappings
          const mappingData: InsertFieldMapping = {
            zohoModule,
            fieldName: zohoField.api_name,
            fieldType: this.mapZohoDataTypeToOurType(zohoField.data_type),
            isCustomField: zohoField.custom_field || false,
            picklistValues: zohoField.pick_list_values || null,
            isRequired: zohoField.required || false,
            maxLength: zohoField.length || null
          };

          await storage.createFieldMapping(mappingData);
        } else {
          // Update sync time for existing mappings
          const existingMapping = existingMappings.find(m => m.fieldName === zohoField.api_name);
          if (existingMapping) {
            await storage.updateFieldMappingSyncTime(existingMapping.id);
          }
        }
      }

      console.log(`[FieldSync] Updated ${zohoFields.length} field mappings for ${zohoModule}`);
    } catch (error) {
      console.error(`[FieldSync] Failed to update field mappings from Zoho:`, error);
      throw error;
    }
  }

  /**
   * Check if an existing field mapping needs updates
   */
  private needsFieldUpdate(mapping: FieldMapping, newValue: any): boolean {
    // For picklist fields, check if we have new values
    if ((mapping.fieldType === "picklist" || mapping.fieldType === "multiselectpicklist") && Array.isArray(newValue)) {
      const existingValues = new Set(
        (mapping.picklistValues as any)?.map((pv: any) => pv.actual_value) || []
      );
      return newValue.some(val => !existingValues.has(val));
    }

    return false;
  }

  /**
   * Get appropriate field length based on sample value
   */
  private getFieldLength(sampleValue: any): number {
    if (typeof sampleValue === "string") {
      // Add buffer for longer values, minimum 50, maximum 255
      const length = Math.max(50, sampleValue.length * 1.5);
      return Math.min(length, this.MAX_FIELD_LENGTH);
    }
    return 100; // Default length
  }

  /**
   * Generate picklist values from a sample value
   */
  private generatePicklistFromValue(value: any): Array<{ display_value: string; actual_value: string }> {
    if (Array.isArray(value)) {
      return value.slice(0, this.MAX_PICKLIST_VALUES).map(v => ({
        display_value: String(v),
        actual_value: String(v)
      }));
    } else if (typeof value === "string") {
      // For single values, create a basic picklist
      return [
        { display_value: value, actual_value: value },
        { display_value: "Other", actual_value: "Other" }
      ];
    }
    return [];
  }

  /**
   * Map Zoho data types to our internal field types
   */
  private mapZohoDataTypeToOurType(zohoDataType: string): string {
    const mapping: Record<string, string> = {
      "text": "text",
      "textarea": "text",
      "email": "email",
      "phone": "phone",
      "picklist": "picklist",
      "multiselectpicklist": "multiselectpicklist",
      "boolean": "boolean",
      "checkbox": "boolean",
      "number": "text",
      "decimal": "text",
      "currency": "text",
      "date": "text",
      "datetime": "text",
      "url": "text"
    };

    return mapping[zohoDataType.toLowerCase()] || "text";
  }

  /**
   * Bulk sync all pending form submissions
   */
  async syncAllPendingSubmissions(): Promise<{ processed: number; successful: number; failed: number }> {
    console.log("[FieldSync] Starting bulk sync of pending submissions");
    
    const pendingSubmissions = await storage.getFormSubmissionsByStatus("pending", "pending");
    let successful = 0;
    let failed = 0;

    for (const submission of pendingSubmissions) {
      try {
        const result = await this.syncFieldsForSubmission(submission);
        if (result.success) {
          successful++;
          
          // Update submission status to ready for CRM push
          await storage.updateFormSubmission(submission.id, {
            processingStatus: "completed" as any
          });
        } else {
          failed++;
          console.error(`[FieldSync] Failed to sync fields for submission ${submission.id}:`, result.errors);
        }
      } catch (error) {
        failed++;
        console.error(`[FieldSync] Error processing submission ${submission.id}:`, error);
      }
    }

    console.log(`[FieldSync] Bulk sync completed: ${successful} successful, ${failed} failed out of ${pendingSubmissions.length} total`);
    
    return {
      processed: pendingSubmissions.length,
      successful,
      failed
    };
  }
}

export const fieldSyncEngine = new FieldSyncEngine();