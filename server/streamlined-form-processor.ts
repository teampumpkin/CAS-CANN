import { storage } from './storage';
import { zohoCRMService } from './zoho-crm-service';
import { errorHandlingService } from './error-handling-service';
import type { InsertFormSubmission } from '@shared/schema';

export interface FormProcessingResult {
  success: boolean;
  submissionId?: number;
  zohoCrmId?: string;
  formName: string;
  processedFields: string[];
  errors?: string[];
  processingTime: number;
}

export interface FormFieldMapping {
  formField: string;
  zohoField: string;
  fieldType: 'text' | 'email' | 'phone' | 'number' | 'date' | 'boolean' | 'url';
  isRequired: boolean;
}

/**
 * EXPLICIT FIELD MAPPING FOR CAS/CANN REGISTRATION FORM
 * Only these fields will be sent to Zoho CRM - all others are ignored
 * Maps form field names to exact Zoho API field names
 */
const CAS_CANN_FIELD_MAPPING: Record<string, { zohoField: string; fieldType: FormFieldMapping['fieldType'] }> = {
  // Name fields - fullName gets split into First_Name and Last_Name
  'fullName': { zohoField: 'SPLIT_NAME', fieldType: 'text' },
  
  // Contact info
  'email': { zohoField: 'Email', fieldType: 'email' },
  
  // Professional info
  'discipline': { zohoField: 'Industry', fieldType: 'text' },
  'subspecialty': { zohoField: 'Sub_Specialty', fieldType: 'text' },
  'institution': { zohoField: 'Company', fieldType: 'text' },
  
  // Amyloidosis specific
  'amyloidosisType': { zohoField: 'Amyloidosis_Type', fieldType: 'text' },
  
  // Membership preferences
  'wantsMembership': { zohoField: 'CAS_Member', fieldType: 'boolean' },
  'wantsCANNMembership': { zohoField: 'PANN_Member', fieldType: 'boolean' },
  
  // Communication preferences
  'wantsCommunications': { zohoField: 'CAS_Communications', fieldType: 'boolean' },
  'cannCommunications': { zohoField: 'CANN_Communication_Consent', fieldType: 'boolean' },
  
  // Services map
  'wantsServicesMapInclusion': { zohoField: 'Services_Map_Inclusion', fieldType: 'boolean' },
};

export class StreamlinedFormProcessor {
  private static instance: StreamlinedFormProcessor;

  static getInstance(): StreamlinedFormProcessor {
    if (!StreamlinedFormProcessor.instance) {
      StreamlinedFormProcessor.instance = new StreamlinedFormProcessor();
    }
    return StreamlinedFormProcessor.instance;
  }

  /**
   * Process form submission directly to Zoho CRM
   * Focus: Pure form-to-CRM sync with form-specific field mapping
   */
  async processFormSubmission(
    formName: string, 
    submissionData: Record<string, any>,
    sourceUrl?: string
  ): Promise<FormProcessingResult> {
    const startTime = Date.now();
    
    try {
      console.log(`[Form Processor] Processing form "${formName}" with ${Object.keys(submissionData).length} fields`);

      // 1. Store submission in local database first
      const submission = await this.storeSubmission(formName, submissionData, sourceUrl);
      console.log(`[Form Processor] Stored submission ${submission.id} locally`);

      // 2. Map form fields to Zoho CRM fields
      const fieldMapping = this.createFormSpecificFieldMapping(formName, submissionData);
      const crmData = this.transformDataForZoho(submissionData, fieldMapping);
      
      // 3. Determine Zoho module (default to Leads for most forms)
      const zohoModule = this.determineZohoModule(formName, submissionData);
      
      // 4. Add source identification
      if (this.isCASCANNForm(formName)) {
        crmData['Lead_Source'] = 'Website - CAS & CANN Registration';
      } else {
        crmData['Lead_Source'] = `Web Form: ${formName}`;
      }
      if (sourceUrl) {
        crmData['Website'] = sourceUrl;
      }

      console.log(`[Form Processor] Mapped ${Object.keys(crmData).length} fields for Zoho ${zohoModule}`);
      console.log(`[Form Processor] CRM Data:`, crmData);

      // 5. Push to Zoho CRM
      const crmResult = await zohoCRMService.createRecord(zohoModule, crmData);
      
      if (crmResult && crmResult.data && crmResult.data.length > 0) {
        const zohoCrmId = crmResult.data[0].details.id;
        
        // Update submission with CRM ID
        await storage.updateFormSubmission(submission.id, {
          zohoCrmId,
        });

        console.log(`[Form Processor] ✅ Success! CRM Record created: ${zohoCrmId}`);

        return {
          success: true,
          submissionId: submission.id,
          zohoCrmId,
          formName,
          processedFields: Object.keys(crmData),
          processingTime: Date.now() - startTime,
        };

      } else {
        throw new Error('Zoho CRM response did not contain expected data structure');
      }

    } catch (error) {
      console.error(`[Form Processor] Error processing form "${formName}":`, error);
      
      // Handle error using the error handling service (if submission exists)
      try {
        if (error instanceof Error) {
          const submissions = await storage.getFormSubmissions({});
          const latestSubmission = submissions
            .filter(s => s.formName === formName)
            .sort((a, b) => (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0))[0];
          
          if (latestSubmission) {
            await errorHandlingService.handleError(
              latestSubmission.id, 
              error, 
              'form_processing',
              { formName, fieldCount: Object.keys(submissionData).length }
            );
          }
        }
      } catch (errorHandlingError) {
        console.error('[Form Processor] Error handling service failed:', errorHandlingError);
      }

      return {
        success: false,
        formName,
        processedFields: [],
        errors: [error instanceof Error ? error.message : String(error)],
        processingTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Store form submission in local database
   */
  private async storeSubmission(
    formName: string, 
    submissionData: Record<string, any>, 
    sourceUrl?: string
  ): Promise<{ id: number; formName: string; submissionData: any; createdAt: Date | null }> {
    const submission: InsertFormSubmission = {
      formName,
      submissionData,
      sourceForm: `Web Form: ${formName}`,
      zohoModule: this.determineZohoModule(formName, submissionData),
    };

    const createdSubmission = await storage.createFormSubmission(submission);
    console.log(`[Form Processor] Created submission with ID: ${createdSubmission.id}`);
    
    // Verify the submission was created successfully
    if (!createdSubmission || !createdSubmission.id) {
      console.error(`[Form Processor] Failed to create submission properly`);
      throw new Error(`Failed to create submission properly`);
    }

    // Return the created submission directly (no need to retrieve again)
    return {
      id: createdSubmission.id,
      formName: createdSubmission.formName, 
      submissionData: createdSubmission.submissionData,
      createdAt: createdSubmission.createdAt,
    };
  }

  /**
   * Check if this is a CAS/CANN registration form
   * Uses exact form name matching to prevent false positives
   */
  private isCASCANNForm(formName: string): boolean {
    const exactMatches = [
      'cas-cann-registration',
      'cas_cann_registration', 
      'cas & cann registration',
      'cas-registration',
      'cann-registration',
      'join-cas',
      'join cas',
      'cas-member-registration',
      'cann-member-registration',
    ];
    
    const lowerName = formName.toLowerCase().trim();
    return exactMatches.includes(lowerName) || 
           (lowerName.includes('cas') && lowerName.includes('cann'));
  }

  /**
   * Split full name into first and last name
   * For single-word names, uses the name as Last_Name (Zoho requires Last_Name for Leads)
   */
  private splitFullName(fullName: string): { firstName: string; lastName: string } {
    if (!fullName || typeof fullName !== 'string') {
      return { firstName: '', lastName: '' };
    }
    
    const trimmed = fullName.trim();
    const parts = trimmed.split(/\s+/);
    
    if (parts.length === 1) {
      // Single word name - use as Last_Name since Zoho requires it for Leads
      return { firstName: '', lastName: parts[0] };
    }
    
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');
    
    return { firstName, lastName };
  }

  /**
   * Create form-specific field mapping
   * Uses EXPLICIT mapping for CAS/CANN forms - only whitelisted fields are sent
   */
  private createFormSpecificFieldMapping(
    formName: string, 
    submissionData: Record<string, any>
  ): FormFieldMapping[] {
    const mapping: FormFieldMapping[] = [];
    
    // Get actual fields from this form submission
    const formFields = Object.keys(submissionData);
    
    console.log(`[Form Processor] Creating field mapping for "${formName}" with fields:`, formFields);

    // For CAS/CANN forms, use STRICT explicit mapping - only send whitelisted fields
    if (this.isCASCANNForm(formName)) {
      console.log(`[Form Processor] Using STRICT CAS/CANN field mapping - only whitelisted fields will be sent`);
      
      formFields.forEach(fieldName => {
        const explicitMapping = CAS_CANN_FIELD_MAPPING[fieldName];
        
        if (explicitMapping) {
          mapping.push({
            formField: fieldName,
            zohoField: explicitMapping.zohoField,
            fieldType: explicitMapping.fieldType,
            isRequired: fieldName === 'email' || fieldName === 'fullName',
          });
          console.log(`[Form Processor] ✓ Mapped: ${fieldName} → ${explicitMapping.zohoField}`);
        } else {
          console.log(`[Form Processor] ✗ Skipped (not in whitelist): ${fieldName}`);
        }
      });
      
      console.log(`[Form Processor] CAS/CANN mapping complete: ${mapping.length} fields will be sent to Zoho`);
      return mapping;
    }

    // For other forms, use the generic mapping (fallback)
    formFields.forEach(fieldName => {
      const fieldValue = submissionData[fieldName];
      const fieldType = this.detectFieldType(fieldName, fieldValue);
      
      // Map form field to appropriate Zoho field
      const zohoField = this.mapToZohoField(fieldName, fieldType);
      
      mapping.push({
        formField: fieldName,
        zohoField,
        fieldType,
        isRequired: this.isFieldRequired(fieldName, fieldValue),
      });
    });

    console.log(`[Form Processor] Created ${mapping.length} field mappings for "${formName}"`);
    return mapping;
  }

  /**
   * Transform form data to Zoho CRM format using field mapping
   * Handles special cases like name splitting for CAS/CANN forms
   */
  private transformDataForZoho(
    submissionData: Record<string, any>, 
    fieldMapping: FormFieldMapping[]
  ): Record<string, any> {
    const crmData: Record<string, any> = {};
    
    fieldMapping.forEach(mapping => {
      const formValue = submissionData[mapping.formField];
      
      if (formValue !== undefined && formValue !== null && formValue !== '') {
        // Special handling for fullName - split into First_Name and Last_Name
        if (mapping.zohoField === 'SPLIT_NAME') {
          const { firstName, lastName } = this.splitFullName(formValue);
          if (firstName) {
            crmData['First_Name'] = firstName;
            console.log(`[Form Processor] Split name: First_Name = "${firstName}"`);
          }
          if (lastName) {
            crmData['Last_Name'] = lastName;
            console.log(`[Form Processor] Split name: Last_Name = "${lastName}"`);
          }
        } else {
          // Transform value based on field type
          const transformedValue = this.transformFieldValue(formValue, mapping.fieldType);
          crmData[mapping.zohoField] = transformedValue;
        }
      }
    });

    return crmData;
  }

  /**
   * Detect field type from field name and value
   */
  private detectFieldType(fieldName: string, fieldValue: any): FormFieldMapping['fieldType'] {
    const lowerName = fieldName.toLowerCase();
    
    // Email detection
    if (lowerName.includes('email') || lowerName.includes('e-mail')) {
      return 'email';
    }
    
    // Phone detection
    if (lowerName.includes('phone') || lowerName.includes('mobile') || 
        lowerName.includes('telephone') || lowerName.includes('tel')) {
      return 'phone';
    }
    
    // URL/Website detection
    if (lowerName.includes('website') || lowerName.includes('url') || 
        lowerName.includes('link')) {
      return 'url';
    }
    
    // Date detection
    if (lowerName.includes('date') || lowerName.includes('birthday') || 
        lowerName.includes('birth')) {
      return 'date';
    }
    
    // Number detection
    if (lowerName.includes('age') || lowerName.includes('year') || 
        lowerName.includes('number') || typeof fieldValue === 'number') {
      return 'number';
    }
    
    // Boolean detection
    if (typeof fieldValue === 'boolean' || lowerName.includes('agree') || 
        lowerName.includes('consent') || lowerName.includes('subscribe')) {
      return 'boolean';
    }
    
    // Default to text
    return 'text';
  }

  /**
   * Map form field name to appropriate Zoho CRM field
   */
  private mapToZohoField(fieldName: string, fieldType: FormFieldMapping['fieldType']): string {
    const lowerName = fieldName.toLowerCase();
    
    // Standard field mappings
    if (lowerName.includes('first') && lowerName.includes('name')) return 'First_Name';
    if (lowerName.includes('last') && lowerName.includes('name')) return 'Last_Name';
    if (lowerName === 'name' || lowerName === 'fullname' || lowerName === 'full_name') return 'Full_Name';
    
    if (fieldType === 'email') return 'Email';
    if (fieldType === 'phone') return 'Phone';
    if (fieldType === 'url' || lowerName.includes('website')) return 'Website';
    
    if (lowerName.includes('company') || lowerName.includes('organization')) return 'Company';
    if (lowerName.includes('title') || lowerName.includes('position') || lowerName.includes('job')) return 'Designation';
    if (lowerName.includes('industry')) return 'Industry';
    if (lowerName.includes('city')) return 'City';
    if (lowerName.includes('state') || lowerName.includes('province')) return 'State';
    if (lowerName.includes('country')) return 'Country';
    if (lowerName.includes('zip') || lowerName.includes('postal')) return 'Zip_Code';
    if (lowerName.includes('address')) return 'Street';
    
    if (lowerName.includes('message') || lowerName.includes('comment') || lowerName.includes('note')) return 'Description';
    if (lowerName.includes('subject') || lowerName.includes('topic')) return 'Description';
    
    // For any other field, create a custom field name
    // Convert to Title_Case format that Zoho expects
    const customFieldName = fieldName
      .split(/[_\s-]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('_');
    
    return customFieldName;
  }

  /**
   * Transform field value based on its type
   */
  private transformFieldValue(value: any, fieldType: FormFieldMapping['fieldType']): any {
    switch (fieldType) {
      case 'email':
        return typeof value === 'string' ? value.toLowerCase().trim() : value;
      
      case 'phone':
        // Clean up phone number
        if (typeof value === 'string') {
          return value.replace(/[^\d+\-\s\(\)]/g, '').trim();
        }
        return value;
      
      case 'boolean':
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
          const lower = value.toLowerCase();
          return lower === 'true' || lower === 'yes' || lower === '1' || lower === 'on';
        }
        return Boolean(value);
      
      case 'number':
        return typeof value === 'string' ? parseFloat(value) || 0 : Number(value) || 0;
      
      case 'date':
        if (value instanceof Date) return value.toISOString().split('T')[0];
        if (typeof value === 'string') {
          const date = new Date(value);
          return isNaN(date.getTime()) ? value : date.toISOString().split('T')[0];
        }
        return value;
      
      default:
        return typeof value === 'string' ? value.trim() : value;
    }
  }

  /**
   * Determine if field is required
   */
  private isFieldRequired(fieldName: string, fieldValue: any): boolean {
    const lowerName = fieldName.toLowerCase();
    
    // Common required fields
    if (lowerName.includes('email') || lowerName.includes('name')) {
      return true;
    }
    
    // If field has a value, consider it important
    return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
  }

  /**
   * Determine which Zoho module to use based on form name and data
   */
  private determineZohoModule(formName: string, submissionData: Record<string, any>): 'Leads' | 'Contacts' {
    const lowerFormName = formName.toLowerCase();
    
    // Contact forms typically go to Contacts
    if (lowerFormName.includes('contact') || lowerFormName.includes('inquiry')) {
      return 'Contacts';
    }
    
    // Everything else goes to Leads by default
    return 'Leads';
  }

  /**
   * Get processing statistics
   */
  async getProcessingStats(): Promise<{
    totalProcessed: number;
    successfulSubmissions: number;
    failedSubmissions: number;
    formBreakdown: Record<string, { total: number; success: number; failed: number }>;
    recentSubmissions: any[];
  }> {
    try {
      const allSubmissions = await storage.getFormSubmissions({});
      
      const totalProcessed = allSubmissions.length;
      const successfulSubmissions = allSubmissions.filter(s => s.zohoCrmId !== null).length;
      const failedSubmissions = allSubmissions.filter(s => s.errorMessage !== null).length;
      
      // Form breakdown
      const formBreakdown: Record<string, { total: number; success: number; failed: number }> = {};
      
      allSubmissions.forEach(submission => {
        if (!formBreakdown[submission.formName]) {
          formBreakdown[submission.formName] = { total: 0, success: 0, failed: 0 };
        }
        
        formBreakdown[submission.formName].total++;
        
        if (submission.zohoCrmId !== null) {
          formBreakdown[submission.formName].success++;
        } else if (submission.errorMessage !== null) {
          formBreakdown[submission.formName].failed++;
        }
      });

      // Recent submissions (last 10)
      const recentSubmissions = allSubmissions
        .sort((a, b) => (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0))
        .slice(0, 10)
        .map(s => ({
          id: s.id,
          formName: s.formName,
          syncStatus: s.zohoCrmId ? 'synced' : (s.errorMessage ? 'failed' : 'pending'),
          submittedAt: s.createdAt,
          zohoCrmId: s.zohoCrmId,
        }));

      return {
        totalProcessed,
        successfulSubmissions,
        failedSubmissions,
        formBreakdown,
        recentSubmissions,
      };

    } catch (error) {
      console.error('[Form Processor] Failed to get processing stats:', error);
      throw error;
    }
  }
}

export const streamlinedFormProcessor = StreamlinedFormProcessor.getInstance();