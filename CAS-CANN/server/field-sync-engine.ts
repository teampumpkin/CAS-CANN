import { storage } from "./storage";
import { zohoCRMService, ZohoField, ZohoFieldCreateRequest } from "./zoho-crm-service";
import { FieldMapping, InsertFieldMapping, FormSubmission, FormConfiguration, SubmitFieldsMap } from "@shared/schema";
import { formConfigEngine } from "./form-config-engine";

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

    // Hoist excludedFieldsInSync to outer scope so both success and error logs can access it
    let excludedFieldsInSync: string[] = [];

    try {
      console.log(`[FieldSync] Starting field sync for submission ${submission.id} (${submission.formName})`);
      
      // Step 0: Load form configuration to check flags
      const formConfig = await formConfigEngine.getFormConfiguration(submission.formName);
      const autoCreateFields = formConfig ? formConfigEngine.shouldAutoCreateFields(formConfig) : true;
      const strictMapping = formConfig?.strictMapping ?? false;
      
      console.log(`[FieldSync] Form config for "${submission.formName}":`, {
        hasConfig: !!formConfig,
        autoCreateFields,
        strictMapping,
        configuredFields: formConfig?.submitFields ? Object.keys(formConfig.submitFields as SubmitFieldsMap).length : 0
      });
      
      // Log the operation start
      await storage.createSubmissionLog({
        submissionId: submission.id,
        operation: "field_sync",
        status: "in_progress",
        details: {
          module: submission.zohoModule,
          formName: submission.formName,
          fieldCount: Object.keys(submission.submissionData as any).length,
          autoCreateFields,
          strictMapping
        }
      });

      // Step 1: Get current field mappings from database
      const existingMappings = await storage.getFieldMappings({
        zohoModule: submission.zohoModule
      });

      // Step 2: Filter submission data if strictMapping is enabled
      let dataToProcess = submission.submissionData as Record<string, any>;
      
      if (formConfig && strictMapping) {
        const submitFields = (formConfig.submitFields || {}) as SubmitFieldsMap;
        const configuredFieldNames = new Set(Object.keys(submitFields));
        
        // Only process fields that are in the configuration
        dataToProcess = {};
        for (const [key, value] of Object.entries(submission.submissionData as Record<string, any>)) {
          if (configuredFieldNames.has(key)) {
            dataToProcess[key] = value;
          } else {
            excludedFieldsInSync.push(key);
          }
        }
        
        console.log(`[FieldSync] Strict mapping: filtered from ${Object.keys(submission.submissionData as any).length} to ${Object.keys(dataToProcess).length} fields`);
        if (excludedFieldsInSync.length > 0) {
          console.log(`[FieldSync] Excluded fields (strictMapping):`, excludedFieldsInSync);
        }
      }

      // Step 3: Compare form fields against existing mappings
      const comparison = await this.compareFields(
        dataToProcess,
        existingMappings,
        submission.zohoModule
      );

      result.fieldsProcessed = comparison.existing.length + comparison.missing.length;

      // Step 4: Create missing fields in Zoho CRM (only if autoCreateFields is enabled)
      if (comparison.missing.length > 0 && autoCreateFields) {
        console.log(`[FieldSync] Creating ${comparison.missing.length} missing fields in Zoho CRM (autoCreateFields=true)`);
        
        for (const missingField of comparison.missing) {
          try {
            await this.createFieldInZohoCRM(missingField, submission.zohoModule);
            result.fieldsCreated++;
            result.details.created.push(missingField.fieldName);
          } catch (error) {
            const errorMsg = `Failed to create field ${missingField.fieldName}: ${error instanceof Error ? error.message : 'Unknown error'}`;
            result.errors.push(errorMsg);
            result.details.failed.push(missingField.fieldName);
            console.error(`[FieldSync] ${errorMsg}`);
          }
        }
      } else if (comparison.missing.length > 0 && !autoCreateFields) {
        console.log(`[FieldSync] Skipping creation of ${comparison.missing.length} missing fields (autoCreateFields=false)`);
        // Log skipped fields for reference
        for (const missingField of comparison.missing) {
          console.log(`[FieldSync] Skipped field: ${missingField.fieldName} (autoCreateFields disabled)`);
        }
      }

      // Step 5: Update field mappings in database
      await this.updateFieldMappingsFromZoho(submission.zohoModule);
      result.fieldsSynced = result.fieldsCreated + comparison.existing.length;

      // Mark existing fields as still valid
      result.details.existing = comparison.existing.map(f => f.fieldName);

      // Determine overall success - missing fields without autoCreate is NOT an error
      result.success = result.errors.length === 0;

      const duration = Date.now() - startTime;
      
      // Log the operation completion with excluded fields for audit visibility
      await storage.createSubmissionLog({
        submissionId: submission.id,
        operation: "field_sync",
        status: result.success ? "success" : "failed",
        details: {
          ...result.details,
          duration,
          fieldsProcessed: result.fieldsProcessed,
          fieldsCreated: result.fieldsCreated,
          skippedFieldCreation: !autoCreateFields && comparison.missing.length > 0,
          excludedFields: excludedFieldsInSync,
          excludedFieldsCount: excludedFieldsInSync.length
        },
        duration,
        errorMessage: result.errors.length > 0 ? result.errors.join("; ") : undefined
      });

      console.log(`[FieldSync] Completed field sync for submission ${submission.id} in ${duration}ms: ${result.fieldsCreated} created, ${result.errors.length} errors`);

    } catch (error) {
      const errorMsg = `Field sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      result.errors.push(errorMsg);
      result.success = false;

      console.error(`[FieldSync] ${errorMsg}`);
      
      // Log the error with excluded fields for audit consistency
      await storage.createSubmissionLog({
        submissionId: submission.id,
        operation: "field_sync",
        status: "failed",
        details: { 
          error: errorMsg,
          excludedFields: excludedFieldsInSync,
          excludedFieldsCount: excludedFieldsInSync.length
        },
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
    zohoModule: string
  ): Promise<FieldComparisonResult> {
    const existingFieldNames = new Set(existingMappings.map(m => m.fieldName));
    
    // Also check the field metadata cache (contains ALL Zoho fields including existing ones)
    const cachedFields = await storage.getFieldMetadataCache({ zohoModule });
    for (const cached of cachedFields) {
      existingFieldNames.add(cached.fieldApiName);
    }
    
    // Create case-insensitive lookup map (lowercase -> actual name)
    const fieldNameMap = new Map<string, string>();
    for (const fieldName of Array.from(existingFieldNames)) {
      fieldNameMap.set(fieldName.toLowerCase(), fieldName);
    }
    
    const missing: FieldComparisonResult["missing"] = [];
    const needsUpdate: FieldMapping[] = [];

    // Check each form field (no extra fields will be created)
    // Note: Lead_Source is a standard Zoho field, will be populated automatically
    for (const [formFieldName, value] of Object.entries(formData)) {
      const zohoFieldName = zohoCRMService.convertToZohoFieldName(formFieldName);
      
      // Case-insensitive check: if field exists with any case variation, use the existing name
      const existingFieldName = fieldNameMap.get(zohoFieldName.toLowerCase());
      
      if (!existingFieldName) {
        // Field doesn't exist, need to create it
        const fieldType = zohoCRMService.detectFieldType(value, formFieldName);
        
        missing.push({
          fieldName: zohoFieldName,
          formFieldName,
          fieldType,
          sampleValue: value
        });
      } else {
        // Field exists, check if it needs update
        const existingMapping = existingMappings.find(m => m.fieldName.toLowerCase() === existingFieldName.toLowerCase());
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
    zohoModule: string
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
  async updateFieldMappingsFromZoho(zohoModule: string): Promise<void> {
    try {
      console.log(`[FieldSync] Refreshing field mappings for module ${zohoModule}`);
      
      const zohoFields = await zohoCRMService.getModuleFields(zohoModule);
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
      const length = Math.ceil(Math.max(50, sampleValue.length * 1.5));
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