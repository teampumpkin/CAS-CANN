import { storage } from './storage';
import { zohoCRMService } from './zoho-crm-service';
import { fieldMetadataCacheService } from './field-metadata-cache-service';
import type { InsertFormSubmission } from '@shared/schema';
import { z } from 'zod';

// Form configuration schema for auto-processing
export const formConfigSchema = z.object({
  formName: z.string().min(1),
  formId: z.string().optional(), // HTML form ID if needed
  sourceLabel: z.string().min(1), // Unique source label for Zoho
  targetModule: z.enum(['Leads', 'Contacts']).default('Leads'),
  fieldMappings: z.record(z.string()).default({}), // Form field -> CRM field mappings
  isActive: z.boolean().default(true),
  autoProcessEnabled: z.boolean().default(true),
  customizations: z.object({
    leadSource: z.string().optional(),
    assignedTo: z.string().optional(), // Zoho user ID
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
    tags: z.array(z.string()).default([]),
  }).default({}),
});

export type FormConfig = z.infer<typeof formConfigSchema>;

export interface FormProcessingResult {
  success: boolean;
  formName: string;
  sourceLabel: string;
  submissionId?: string;
  zohoCrmId?: string;
  errors?: string[];
  warnings?: string[];
  fieldMappings: Record<string, string>;
  processingTime: number;
}

export interface FormAnalysis {
  formName: string;
  detectedFields: string[];
  recommendedMappings: Record<string, string>;
  suggestedSourceLabel: string;
  confidence: 'high' | 'medium' | 'low';
  targetModule: 'Leads' | 'Contacts';
  analysis: string[];
}

export class FormScalabilityService {
  private static instance: FormScalabilityService;
  private formConfigs: Map<string, FormConfig> = new Map();

  static getInstance(): FormScalabilityService {
    if (!FormScalabilityService.instance) {
      FormScalabilityService.instance = new FormScalabilityService();
    }
    return FormScalabilityService.instance;
  }

  constructor() {
    this.loadFormConfigurations();
  }

  /**
   * Load form configurations from storage or defaults
   */
  private async loadFormConfigurations() {
    console.log('[Form Scalability] Loading form configurations...');
    
    try {
      // In production, this would load from database
      // For now, setting up default configurations for common forms
      const defaultConfigs: FormConfig[] = [
        {
          formName: 'cann_membership_application',
          sourceLabel: 'CANN Membership Application',
          targetModule: 'Leads',
          fieldMappings: {
            'name': 'Full_Name',
            'firstName': 'First_Name',
            'lastName': 'Last_Name',
            'email': 'Email',
            'phone': 'Phone',
            'organization': 'Company',
            'title': 'Designation',
            'profession': 'Industry',
            'specialization': 'Description',
            'experience_years': 'Annual_Revenue',
            'membership_type': 'Lead_Source',
            'interest_areas': 'Description',
          },
          isActive: true,
          autoProcessEnabled: true,
          customizations: {
            leadSource: 'CANN Website',
            priority: 'Medium',
            tags: ['membership', 'healthcare_professional'],
          },
        },
        {
          formName: 'patient_resource_request',
          sourceLabel: 'Patient Resource Request',
          targetModule: 'Leads',
          fieldMappings: {
            'name': 'Full_Name',
            'email': 'Email',
            'phone': 'Phone',
            'amyloidosis_type': 'Description',
            'diagnosis_date': 'Description',
            'location': 'City',
            'resource_needs': 'Description',
          },
          isActive: true,
          autoProcessEnabled: true,
          customizations: {
            leadSource: 'Patient Resources',
            priority: 'High',
            tags: ['patient', 'resources', 'support'],
          },
        },
        {
          formName: 'healthcare_center_directory_request',
          sourceLabel: 'Healthcare Center Directory Request',
          targetModule: 'Leads',
          fieldMappings: {
            'name': 'Full_Name',
            'email': 'Email',
            'phone': 'Phone',
            'facility_name': 'Company',
            'facility_type': 'Industry',
            'location': 'City',
            'services': 'Description',
          },
          isActive: true,
          autoProcessEnabled: true,
          customizations: {
            leadSource: 'Healthcare Directory',
            priority: 'Medium',
            tags: ['healthcare_center', 'directory'],
          },
        },
      ];

      // Store default configurations
      for (const config of defaultConfigs) {
        this.formConfigs.set(config.formName, config);
      }

      console.log(`[Form Scalability] Loaded ${this.formConfigs.size} form configurations`);

    } catch (error) {
      console.error('[Form Scalability] Failed to load configurations:', error);
    }
  }

  /**
   * Automatically analyze and configure a new form
   */
  async analyzeNewForm(formName: string, sampleData: Record<string, any>): Promise<FormAnalysis> {
    console.log(`[Form Scalability] Analyzing new form: ${formName}`);
    console.log(`[Form Scalability] Sample data fields:`, Object.keys(sampleData));

    const detectedFields = Object.keys(sampleData);
    const analysis: string[] = [];

    // Get cached CRM fields for better mapping suggestions
    const leadsFields = await fieldMetadataCacheService.getCachedFields('Leads');
    const contactsFields = await fieldMetadataCacheService.getCachedFields('Contacts');

    // Analyze field names to suggest mappings
    const recommendedMappings: Record<string, string> = {};
    let confidence: 'high' | 'medium' | 'low' = 'medium';
    let targetModule: 'Leads' | 'Contacts' = 'Leads';

    // Field mapping intelligence
    for (const fieldName of detectedFields) {
      const lowerField = fieldName.toLowerCase();
      
      // Standard field mappings
      if (lowerField.includes('name') && !lowerField.includes('first') && !lowerField.includes('last')) {
        recommendedMappings[fieldName] = 'Full_Name';
      } else if (lowerField.includes('firstname') || lowerField.includes('first_name')) {
        recommendedMappings[fieldName] = 'First_Name';
      } else if (lowerField.includes('lastname') || lowerField.includes('last_name')) {
        recommendedMappings[fieldName] = 'Last_Name';
      } else if (lowerField.includes('email')) {
        recommendedMappings[fieldName] = 'Email';
      } else if (lowerField.includes('phone') || lowerField.includes('mobile')) {
        recommendedMappings[fieldName] = 'Phone';
      } else if (lowerField.includes('company') || lowerField.includes('organization')) {
        recommendedMappings[fieldName] = 'Company';
      } else if (lowerField.includes('title') || lowerField.includes('position')) {
        recommendedMappings[fieldName] = 'Designation';
      } else if (lowerField.includes('city') || lowerField.includes('location')) {
        recommendedMappings[fieldName] = 'City';
      } else if (lowerField.includes('website')) {
        recommendedMappings[fieldName] = 'Website';
      } else {
        // For unmapped fields, suggest Description or custom fields
        recommendedMappings[fieldName] = 'Description';
      }
    }

    // Analyze form purpose to determine confidence and target module
    const formNameLower = formName.toLowerCase();
    
    if (formNameLower.includes('patient') || formNameLower.includes('support')) {
      analysis.push('Form appears to be patient-focused - high priority processing recommended');
      confidence = 'high';
      targetModule = 'Leads';
    } else if (formNameLower.includes('membership') || formNameLower.includes('professional')) {
      analysis.push('Form appears to be for healthcare professionals - membership processing');
      confidence = 'high';
      targetModule = 'Leads';
    } else if (formNameLower.includes('contact') || formNameLower.includes('inquiry')) {
      analysis.push('General contact/inquiry form detected');
      confidence = 'medium';
      targetModule = 'Leads';
    } else if (formNameLower.includes('directory') || formNameLower.includes('center')) {
      analysis.push('Healthcare center/directory form detected');
      confidence = 'medium';
      targetModule = 'Leads';
    } else {
      analysis.push('Unknown form type - manual review recommended');
      confidence = 'low';
    }

    // Analyze field quality
    const standardFields = ['name', 'email', 'phone'].filter(field => 
      detectedFields.some(df => df.toLowerCase().includes(field))
    );

    if (standardFields.length >= 2) {
      analysis.push(`Standard fields detected: ${standardFields.join(', ')} - good data quality expected`);
      if (confidence !== 'high') confidence = 'medium';
    } else {
      analysis.push('Limited standard fields - may need manual field mapping review');
      confidence = 'low';
    }

    // Generate unique source label
    const suggestedSourceLabel = this.generateSourceLabel(formName);

    return {
      formName,
      detectedFields,
      recommendedMappings,
      suggestedSourceLabel,
      confidence,
      targetModule,
      analysis,
    };
  }

  /**
   * Generate a unique, descriptive source label for Zoho CRM
   */
  private generateSourceLabel(formName: string): string {
    // Convert form name to human-readable label
    const words = formName
      .replace(/[_-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    // Add CANN prefix if not present
    if (!words.toLowerCase().includes('cann') && !words.toLowerCase().includes('amyloid')) {
      return `CANN ${words}`;
    }

    return words;
  }

  /**
   * Automatically configure a new form based on analysis
   */
  async autoConfigureForm(analysis: FormAnalysis, customizations?: Partial<FormConfig>): Promise<FormConfig> {
    console.log(`[Form Scalability] Auto-configuring form: ${analysis.formName}`);

    const config: FormConfig = formConfigSchema.parse({
      formName: analysis.formName,
      sourceLabel: analysis.suggestedSourceLabel,
      targetModule: analysis.targetModule,
      fieldMappings: analysis.recommendedMappings,
      isActive: true,
      autoProcessEnabled: analysis.confidence !== 'low',
      customizations: {
        leadSource: 'CANN Website',
        priority: analysis.confidence === 'high' ? 'High' : 'Medium',
        tags: this.generateTags(analysis.formName),
      },
      ...customizations,
    });

    // Store the configuration
    this.formConfigs.set(config.formName, config);

    console.log(`[Form Scalability] ✅ Auto-configured form: ${config.formName}`);
    console.log(`[Form Scalability] Source label: ${config.sourceLabel}`);
    console.log(`[Form Scalability] Field mappings: ${Object.keys(config.fieldMappings).length} fields`);

    return config;
  }

  /**
   * Generate appropriate tags based on form name
   */
  private generateTags(formName: string): string[] {
    const tags: string[] = [];
    const lowerName = formName.toLowerCase();

    if (lowerName.includes('patient')) tags.push('patient');
    if (lowerName.includes('member')) tags.push('membership');
    if (lowerName.includes('professional')) tags.push('healthcare_professional');
    if (lowerName.includes('resource')) tags.push('resources');
    if (lowerName.includes('support')) tags.push('support');
    if (lowerName.includes('directory')) tags.push('directory');
    if (lowerName.includes('center')) tags.push('healthcare_center');
    if (lowerName.includes('contact')) tags.push('inquiry');
    if (lowerName.includes('newsletter')) tags.push('newsletter');

    // Add form type tag
    tags.push('auto_configured');

    return tags;
  }

  /**
   * Process form submission with automatic configuration
   */
  async processFormSubmission(formName: string, submissionData: Record<string, any>): Promise<FormProcessingResult> {
    const startTime = Date.now();
    console.log(`[Form Scalability] Processing form submission: ${formName}`);

    try {
      let config = this.formConfigs.get(formName);
      const errors: string[] = [];
      const warnings: string[] = [];

      // If form not configured, auto-configure it
      if (!config) {
        console.log(`[Form Scalability] Unknown form detected: ${formName}, analyzing...`);
        
        try {
          const analysis = await this.analyzeNewForm(formName, submissionData);
          config = await this.autoConfigureForm(analysis);
          
          warnings.push(`Form ${formName} was automatically configured. Consider reviewing the configuration.`);
          
          if (analysis.confidence === 'low') {
            warnings.push(`Low confidence in auto-configuration. Manual review recommended.`);
          }
        } catch (error) {
          errors.push(`Failed to auto-configure form: ${error instanceof Error ? error.message : 'Unknown error'}`);
          
          // Use fallback configuration
          config = {
            formName,
            sourceLabel: this.generateSourceLabel(formName),
            targetModule: 'Leads',
            fieldMappings: {
              'name': 'Full_Name',
              'email': 'Email',
              'phone': 'Phone',
            },
            isActive: true,
            autoProcessEnabled: true,
            customizations: {
              leadSource: 'CANN Website',
              priority: 'Medium',
              tags: ['unknown_form', 'needs_review'],
            },
          };
          
          this.formConfigs.set(formName, config);
          warnings.push('Using fallback configuration due to auto-configuration failure');
        }
      }

      if (!config.isActive) {
        throw new Error(`Form ${formName} is disabled`);
      }

      // Prepare CRM submission data
      const crmData: Record<string, any> = {};
      
      // Apply field mappings
      for (const [formField, crmField] of Object.entries(config.fieldMappings)) {
        if (submissionData[formField] !== undefined) {
          crmData[crmField] = submissionData[formField];
        }
      }

      // Add source label and custom fields
      crmData['Source_Form'] = config.sourceLabel;
      
      if (config.customizations.leadSource) {
        crmData['Lead_Source'] = config.customizations.leadSource;
      }
      
      if (config.customizations.assignedTo) {
        crmData['Owner'] = config.customizations.assignedTo;
      }

      // Store form submission with processing metadata
      const submissionRecord: InsertFormSubmission = {
        formName: config.formName,
        submissionData,
        zohoModule: config.targetModule,
        sourceForm: config.sourceLabel,
      };

      const submissionId = await storage.createFormSubmission(submissionRecord);

      let zohoCrmId: string | undefined;

      // Attempt to sync to Zoho CRM if auto-processing is enabled
      if (config.autoProcessEnabled) {
        try {
          const crmResult = await zohoCRMService.createRecord(config.targetModule, crmData);
          
          if (crmResult && crmResult.data && crmResult.data.length > 0) {
            zohoCrmId = crmResult.data[0].details.id;
            
            // Update submission with success
            await storage.updateFormSubmission(Number(submissionId), {
              zohoCrmId,
            });
            
            console.log(`[Form Scalability] ✅ Form submission synced to CRM: ${zohoCrmId}`);
          } else {
            throw new Error('CRM response did not contain expected data structure');
          }

        } catch (crmError) {
          const errorMessage = crmError instanceof Error ? crmError.message : 'CRM sync failed';
          errors.push(`CRM sync failed: ${errorMessage}`);
          
          // Update submission with error
          await storage.updateFormSubmission(Number(submissionId), {
            errorMessage,
          });
        }
      } else {
        // Update submission as completed but not synced (manual processing required)  
        // No update needed for manual processing
        
        warnings.push('Auto-processing disabled for this form - manual sync required');
      }

      const processingTime = Date.now() - startTime;

      return {
        success: errors.length === 0,
        formName: config.formName,
        sourceLabel: config.sourceLabel,
        submissionId: String(submissionId),
        zohoCrmId,
        errors: errors.length > 0 ? errors : undefined,
        warnings: warnings.length > 0 ? warnings : undefined,
        fieldMappings: config.fieldMappings,
        processingTime,
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown processing error';
      
      console.error(`[Form Scalability] Processing failed for ${formName}:`, error);
      
      return {
        success: false,
        formName,
        sourceLabel: formName,
        errors: [errorMessage],
        fieldMappings: {},
        processingTime,
      };
    }
  }

  /**
   * Get form configuration
   */
  getFormConfig(formName: string): FormConfig | undefined {
    return this.formConfigs.get(formName);
  }

  /**
   * Get all form configurations
   */
  getAllFormConfigs(): FormConfig[] {
    return Array.from(this.formConfigs.values());
  }

  /**
   * Update form configuration
   */
  async updateFormConfig(formName: string, updates: Partial<FormConfig>): Promise<FormConfig> {
    const existing = this.formConfigs.get(formName);
    if (!existing) {
      throw new Error(`Form configuration not found: ${formName}`);
    }

    const updated = formConfigSchema.parse({ ...existing, ...updates });
    this.formConfigs.set(formName, updated);
    
    console.log(`[Form Scalability] Updated configuration for ${formName}`);
    return updated;
  }

  /**
   * Create new form configuration
   */
  async createFormConfig(config: FormConfig): Promise<FormConfig> {
    const validated = formConfigSchema.parse(config);
    this.formConfigs.set(validated.formName, validated);
    
    console.log(`[Form Scalability] Created new configuration for ${validated.formName}`);
    return validated;
  }

  /**
   * Delete form configuration
   */
  async deleteFormConfig(formName: string): Promise<boolean> {
    const deleted = this.formConfigs.delete(formName);
    if (deleted) {
      console.log(`[Form Scalability] Deleted configuration for ${formName}`);
    }
    return deleted;
  }

  /**
   * Get processing statistics
   */
  async getProcessingStats(): Promise<{
    totalConfiguredForms: number;
    activeConfigurations: number;
    autoProcessingEnabled: number;
    recentSubmissions: number;
    successRate: number;
  }> {
    const configs = this.getAllFormConfigs();
    const totalConfiguredForms = configs.length;
    const activeConfigurations = configs.filter(c => c.isActive).length;
    const autoProcessingEnabled = configs.filter(c => c.autoProcessEnabled).length;

    // Get recent submissions (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentSubmissions = await storage.getFormSubmissions({
      dateFrom: yesterday,
    });

    const successfulSubmissions = recentSubmissions.filter(s => s.syncStatus === 'synced').length;
    const successRate = recentSubmissions.length > 0 
      ? (successfulSubmissions / recentSubmissions.length) * 100 
      : 0;

    return {
      totalConfiguredForms,
      activeConfigurations,
      autoProcessingEnabled,
      recentSubmissions: recentSubmissions.length,
      successRate: Math.round(successRate * 100) / 100,
    };
  }
}

export const formScalabilityService = FormScalabilityService.getInstance();