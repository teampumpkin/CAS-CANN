import { storage } from "./storage";
import { FormConfiguration } from "@shared/schema";

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
    
    try {
      await this.refreshCache();
      this.initialized = true;
      console.log("[FormConfigEngine] Initialization complete - cache warmed");
    } catch (error) {
      console.error("[FormConfigEngine] Initialization error:", error);
      this.initialized = true;
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

  async getAllFormConfigurations(): Promise<FormConfiguration[]> {
    return await storage.getFormConfigurations();
  }

  private shouldRefreshCache(): boolean {
    return Date.now() - this.lastCacheRefresh > this.cacheTimeout;
  }

  private async refreshCache(): Promise<void> {
    const configs = await storage.getFormConfigurations();
    this.configCache.clear();
    for (const config of configs) {
      if (config.isActive) {
        this.configCache.set(config.formName, config);
      }
    }
    this.lastCacheRefresh = Date.now();
    console.log(`[FormConfigEngine] Cache refreshed with ${this.configCache.size} active configurations`);
  }

  validateFormData(formName: string, data: Record<string, any>): FormConfigValidationResult {
    return { valid: true, errors: [], warnings: [] };
  }

  async filterAndMapFormData(
    formName: string, 
    rawData: Record<string, any>
  ): Promise<FilteredFormData> {
    const config = await this.getFormConfiguration(formName);
    const fieldMappings = (config?.fieldMappings as Record<string, string>) || {};
    
    const filteredData: Record<string, any> = {};
    const mappedFields: Array<{ formField: string; zohoField: string; value: any }> = [];
    const excludedFields: string[] = [];

    for (const [formField, value] of Object.entries(rawData)) {
      const zohoField = fieldMappings[formField];
      if (zohoField && value !== undefined && value !== null && value !== '') {
        filteredData[zohoField] = value;
        mappedFields.push({ formField, zohoField, value });
      } else if (!zohoField) {
        excludedFields.push(formField);
      }
    }

    return {
      filteredData,
      leadSource: `Website - ${formName}`,
      excludedFields,
      mappedFields
    };
  }

  clearCache(): void {
    this.configCache.clear();
    this.lastCacheRefresh = 0;
    console.log("[FormConfigEngine] Cache cleared");
  }
}

export const formConfigEngine = new FormConfigEngine();
