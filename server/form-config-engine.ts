import { storage } from "./storage";
import { FormConfiguration, SubmitFieldConfig, SubmitFieldsMap, submitFieldsMapSchema } from "@shared/schema";

export interface FormConfigValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FilteredFormData {
  filteredData: Record<string, any>;
  leadSource: string;
  excludedFields: string[];
  mappedFields: Array<{ formField: string; zohoField: string; value: any }>;
}

export class FormConfigEngine {
  private configCache: Map<string, FormConfiguration> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private lastCacheRefresh: number = 0;
  private initialized: boolean = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    // Warm up the cache on startup
    try {
      await this.refreshCache();
      this.initialized = true;
      console.log("[FormConfigEngine] Initialization complete - cache warmed");
    } catch (error) {
      console.error("[FormConfigEngine] Initialization error:", error);
      this.initialized = true; // Mark as initialized to prevent retry loops
    }
  }

  async getFormConfiguration(formName: string): Promise<FormConfiguration | null> {
    if (this.shouldRefreshCache()) {
      await this.refreshCache();
    }

    const cached = this.configCache.get(formName);
    if (cached) {
      return cached;
    }

    const config = await storage.getFormConfiguration(formName);
    if (config) {
      this.configCache.set(formName, config);
      return config;
    }
    return null;
  }

  async getActiveFormConfigurations(): Promise<FormConfiguration[]> {
    return await storage.getActiveFormConfigurations();
  }

  async getAllFormConfigurations(): Promise<FormConfiguration[]> {
    return await storage.getFormConfigurations();
  }

  private shouldRefreshCache(): boolean {
    return Date.now() - this.lastCacheRefresh > this.cacheTimeout;
  }

  private async refreshCache(): Promise<void> {
    const configs = await storage.getActiveFormConfigurations();
    this.configCache.clear();
    for (const config of configs) {
      this.configCache.set(config.formName, config);
    }
    this.lastCacheRefresh = Date.now();
    console.log(`[FormConfigEngine] Cache refreshed with ${configs.length} configurations`);
  }

  clearCache(): void {
    this.configCache.clear();
    this.lastCacheRefresh = 0;
  }

  validateFormConfiguration(config: Partial<FormConfiguration>): FormConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!config.formName || config.formName.trim().length === 0) {
      errors.push("Form name is required");
    }

    if (!config.zohoModule || config.zohoModule.trim().length === 0) {
      errors.push("Zoho module is required");
    }

    if (!config.leadSourceTag || config.leadSourceTag.trim().length === 0) {
      warnings.push("Lead source tag is recommended for CRM identification");
    }

    if (config.submitFields) {
      const parseResult = submitFieldsMapSchema.safeParse(config.submitFields);
      if (!parseResult.success) {
        errors.push(`Invalid submit fields configuration: ${parseResult.error.message}`);
      }
    } else {
      warnings.push("No submit fields configured - all form fields will be excluded from CRM sync");
    }

    if (config.displayFields && !Array.isArray(config.displayFields)) {
      errors.push("Display fields must be an array");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  filterFormDataForZoho(
    formData: Record<string, any>,
    config: FormConfiguration
  ): FilteredFormData {
    const filteredData: Record<string, any> = {};
    const excludedFields: string[] = [];
    const mappedFields: Array<{ formField: string; zohoField: string; value: any }> = [];

    const submitFields = (config.submitFields || {}) as SubmitFieldsMap;
    const fieldMappings = (config.fieldMappings || {}) as Record<string, string>;
    const isStrictMapping = config.strictMapping ?? false;

    for (const [formField, value] of Object.entries(formData)) {
      const fieldConfig = submitFields[formField];
      const simpleMapping = fieldMappings[formField];

      if (fieldConfig) {
        const zohoField = fieldConfig.zohoField;
        filteredData[zohoField] = value;
        mappedFields.push({ formField, zohoField, value });
      } else if (simpleMapping) {
        filteredData[simpleMapping] = value;
        mappedFields.push({ formField, zohoField: simpleMapping, value });
      } else if (!isStrictMapping) {
        filteredData[formField] = value;
        mappedFields.push({ formField, zohoField: formField, value });
      } else {
        excludedFields.push(formField);
      }
    }

    const leadSource = config.leadSourceTag || `Form: ${config.formName}`;

    console.log(`[FormConfigEngine] Filtered form data for "${config.formName}":`, {
      totalFields: Object.keys(formData).length,
      mappedCount: mappedFields.length,
      excludedCount: excludedFields.length,
      strictMapping: isStrictMapping,
      leadSource
    });

    return {
      filteredData,
      leadSource,
      excludedFields,
      mappedFields
    };
  }

  getConfiguredZohoFields(config: FormConfiguration): string[] {
    const submitFields = (config.submitFields || {}) as SubmitFieldsMap;
    return Object.values(submitFields).map(f => f.zohoField);
  }

  getRequiredFields(config: FormConfiguration): string[] {
    const submitFields = (config.submitFields || {}) as SubmitFieldsMap;
    return Object.entries(submitFields)
      .filter(([_, fieldConfig]) => fieldConfig.required)
      .map(([formField]) => formField);
  }

  validateSubmissionData(
    formData: Record<string, any>,
    config: FormConfiguration
  ): { valid: boolean; missingRequired: string[]; errors: string[] } {
    const requiredFields = this.getRequiredFields(config);
    const missingRequired: string[] = [];
    const errors: string[] = [];

    for (const field of requiredFields) {
      const value = formData[field];
      if (value === undefined || value === null || value === "") {
        missingRequired.push(field);
      }
    }

    if (missingRequired.length > 0) {
      errors.push(`Missing required fields: ${missingRequired.join(", ")}`);
    }

    return {
      valid: missingRequired.length === 0,
      missingRequired,
      errors
    };
  }

  shouldAutoCreateFields(config: FormConfiguration): boolean {
    // Default to true for legacy behavior - only disable when explicitly set to false
    return config.autoCreateFields ?? true;
  }

  async createFormConfiguration(data: {
    formName: string;
    zohoModule?: string;
    leadSourceTag?: string;
    displayFields?: string[];
    submitFields?: SubmitFieldsMap;
    strictMapping?: boolean;
    autoCreateFields?: boolean;
    description?: string;
  }): Promise<FormConfiguration> {
    const validation = this.validateFormConfiguration(data as Partial<FormConfiguration>);
    if (!validation.valid) {
      throw new Error(`Invalid configuration: ${validation.errors.join("; ")}`);
    }

    const config = await storage.createFormConfiguration({
      formName: data.formName,
      zohoModule: data.zohoModule || "Leads",
      leadSourceTag: data.leadSourceTag || `Form: ${data.formName}`,
      displayFields: data.displayFields || [],
      submitFields: data.submitFields || {},
      strictMapping: data.strictMapping ?? false, // Default to false: allow unmapped fields
      autoCreateFields: data.autoCreateFields ?? true, // Default to true for legacy behavior
      isActive: true,
      description: data.description || null,
    });

    this.clearCache();
    return config;
  }

  async updateFormConfiguration(
    formName: string,
    updates: Partial<{
      zohoModule: string;
      leadSourceTag: string;
      displayFields: string[];
      submitFields: SubmitFieldsMap;
      strictMapping: boolean;
      autoCreateFields: boolean;
      isActive: boolean;
      description: string;
    }>
  ): Promise<FormConfiguration | null> {
    const updated = await storage.updateFormConfigurationByName(formName, updates);
    if (updated) {
      this.clearCache();
      return updated;
    }
    return null;
  }

  async deleteFormConfiguration(formName: string): Promise<boolean> {
    const deleted = await storage.deleteFormConfigurationByName(formName);
    if (deleted) {
      this.clearCache();
    }
    return deleted;
  }

  async getOrCreateDefaultConfig(formName: string): Promise<FormConfiguration> {
    let config = await this.getFormConfiguration(formName);
    
    if (!config) {
      console.log(`[FormConfigEngine] No configuration found for "${formName}", creating default`);
      config = await this.createFormConfiguration({
        formName,
        zohoModule: "Leads",
        leadSourceTag: `Form: ${formName}`,
        strictMapping: false,
        autoCreateFields: true,
        description: `Auto-generated configuration for ${formName}`
      });
    }

    return config;
  }
}

export const formConfigEngine = new FormConfigEngine();
