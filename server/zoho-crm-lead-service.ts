/**
 * Zoho CRM Lead Service - Handles lead creation and field mapping
 */

import { zohoTokenManager } from './zoho-token-manager';

interface ZohoLeadData {
  fullName?: string;
  emailAddress?: string;
  discipline?: string;
  subspecialty?: string;
  institutionName?: string;
  communicationConsent?: string;
  servicesMapConsent?: string;
  amyloidosisType?: string;
  otherAmyloidosisType?: string;
  areasOfInterest?: string;
  otherInterest?: string;
  presentingInterest?: string;
  presentationTopic?: string;
  followUpConsent?: string;
  institutionAddress?: string;
  institutionPhone?: string;
  membershipRequest?: string;
}

interface ZohoLeadResponse {
  data: Array<{
    code: string;
    details: {
      id: string;
      Created_Time: string;
      Modified_Time: string;
      Created_By: {
        id: string;
        name: string;
      };
    };
    message: string;
    status: string;
  }>;
}

export class ZohoCRMLeadService {
  private apiDomain: string;

  constructor() {
    // Determine API domain based on region
    this.apiDomain = process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.com';
    console.log(`[ZohoCRMLeadService] Initialized with API domain: ${this.apiDomain}`);
  }

  /**
   * Create a lead in Zoho CRM
   */
  async createLead(formData: ZohoLeadData): Promise<{
    success: boolean;
    leadId?: string;
    createdTime?: string;
    error?: string;
  }> {
    const requestId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    console.log(`[${requestId}] Creating lead in Zoho CRM`);

    try {
      // Get valid access token
      const accessToken = await zohoTokenManager.getValidAccessToken();
      
      // Map form fields to Zoho CRM fields
      const leadData = this.mapFormToZohoFields(formData);
      
      console.log(`[${requestId}] Mapped lead data:`, {
        Last_Name: leadData.Last_Name,
        Email: leadData.Email,
        Company: leadData.Company,
        fieldCount: Object.keys(leadData).length
      });

      // Prepare the request payload
      const payload = {
        data: [leadData],
        trigger: ['approval', 'workflow', 'blueprint']
      };

      // Make the API request
      const response = await this.makeApiRequest('/crm/v3/Leads', 'POST', payload, accessToken);
      
      const result = response as ZohoLeadResponse;
      
      if (result.data && result.data[0]) {
        const leadResponse = result.data[0];
        
        if (leadResponse.status === 'success') {
          console.log(`[${requestId}] Lead created successfully:`, {
            leadId: leadResponse.details.id,
            createdTime: leadResponse.details.Created_Time
          });
          
          return {
            success: true,
            leadId: leadResponse.details.id,
            createdTime: leadResponse.details.Created_Time
          };
        } else {
          console.error(`[${requestId}] Lead creation failed:`, leadResponse);
          return {
            success: false,
            error: leadResponse.message || 'Failed to create lead'
          };
        }
      }

      console.error(`[${requestId}] Unexpected response format:`, result);
      return {
        success: false,
        error: 'Invalid response from Zoho CRM'
      };

    } catch (error) {
      console.error(`[${requestId}] Error creating lead:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Map form fields to Zoho CRM lead fields
   */
  private mapFormToZohoFields(formData: ZohoLeadData): Record<string, any> {
    // Start with required fields
    const zohoLead: Record<string, any> = {
      // Last_Name is required in Zoho CRM
      Last_Name: formData.fullName || 'Unknown',
      Lead_Source: 'Website',
      Lead_Status: 'Not Contacted'
    };

    // Map optional standard fields
    if (formData.emailAddress) {
      zohoLead.Email = formData.emailAddress;
    }

    if (formData.institutionName) {
      zohoLead.Company = formData.institutionName;
    }

    if (formData.institutionPhone) {
      zohoLead.Phone = formData.institutionPhone;
    }

    // Add description with all form data
    zohoLead.Description = this.formatDescription(formData);

    // Map custom fields (these need to be created in Zoho CRM)
    // Custom fields typically use underscores instead of spaces
    const customFieldMappings = {
      discipline: 'Professional_Designation',
      subspecialty: 'Subspecialty',
      amyloidosisType: 'Amyloidosis_Type',
      otherAmyloidosisType: 'Other_Amyloidosis_Type',
      areasOfInterest: 'Areas_of_Interest',
      otherInterest: 'Other_Interest',
      presentingInterest: 'Presenting_Interest',
      presentationTopic: 'Presentation_Topic',
      communicationConsent: 'Communication_Consent',
      servicesMapConsent: 'Services_Map_Consent',
      followUpConsent: 'Follow_Up_Consent',
      membershipRequest: 'Membership_Request',
      institutionAddress: 'Institution_Address'
    };

    // Add custom fields if they have values
    Object.entries(customFieldMappings).forEach(([formField, zohoField]) => {
      const value = formData[formField as keyof ZohoLeadData];
      if (value) {
        zohoLead[zohoField] = value;
      }
    });

    // Add metadata
    zohoLead.Form_Source = 'Join CANN Today';
    zohoLead.Submission_Date = new Date().toISOString();

    return zohoLead;
  }

  /**
   * Format a comprehensive description field
   */
  private formatDescription(formData: ZohoLeadData): string {
    const sections = [
      `Form Submission: Join CANN Today`,
      `Submitted: ${new Date().toLocaleString()}`,
      '',
      '=== Professional Information ===',
      `Name: ${formData.fullName || 'Not provided'}`,
      `Email: ${formData.emailAddress || 'Not provided'}`,
      `Professional Designation: ${formData.discipline || 'Not provided'}`,
      `Subspecialty: ${formData.subspecialty || 'Not provided'}`,
      `Institution: ${formData.institutionName || 'Not provided'}`,
      formData.institutionAddress ? `Institution Address: ${formData.institutionAddress}` : '',
      formData.institutionPhone ? `Institution Phone: ${formData.institutionPhone}` : '',
      '',
      '=== Amyloidosis Information ===',
      `Amyloidosis Type: ${formData.amyloidosisType || 'Not provided'}`,
      formData.otherAmyloidosisType ? `Other Type Details: ${formData.otherAmyloidosisType}` : '',
      '',
      '=== Professional Interests ===',
      `Areas of Interest: ${formData.areasOfInterest || 'Not provided'}`,
      formData.otherInterest ? `Other Interests: ${formData.otherInterest}` : '',
      `Presenting Interest: ${formData.presentingInterest || 'Not specified'}`,
      formData.presentationTopic ? `Presentation Topic: ${formData.presentationTopic}` : '',
      '',
      '=== Consent Information ===',
      `Communication Consent: ${formData.communicationConsent || 'Not provided'}`,
      `Services Map Consent: ${formData.servicesMapConsent || 'Not provided'}`,
      `Follow-up Consent: ${formData.followUpConsent || 'Not provided'}`,
      '',
      '=== Membership ===',
      `Membership Request: ${formData.membershipRequest || 'Not specified'}`
    ].filter(line => line !== ''); // Remove empty lines

    return sections.join('\n');
  }

  /**
   * Make API request to Zoho CRM
   */
  private async makeApiRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any,
    accessToken?: string
  ): Promise<any> {
    const url = `${this.apiDomain}${endpoint}`;
    
    // Get token if not provided
    const token = accessToken || await zohoTokenManager.getValidAccessToken();
    
    console.log(`[ZohoCRMLeadService] ${method} ${url}`);
    
    const headers: Record<string, string> = {
      'Authorization': `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined
      });

      const responseText = await response.text();
      
      // Parse response
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('[ZohoCRMLeadService] Failed to parse response:', responseText);
        throw new Error(`Invalid JSON response from Zoho: ${responseText}`);
      }

      // Check for rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || '60';
        console.error(`[ZohoCRMLeadService] Rate limited. Retry after ${retryAfter} seconds`);
        throw new Error(`API rate limit exceeded. Please try again in ${retryAfter} seconds.`);
      }

      // Check for authentication errors
      if (response.status === 401) {
        console.error('[ZohoCRMLeadService] Authentication failed. Token may be invalid.');
        throw new Error('Authentication failed. Please re-authorize the application.');
      }

      // Check for other errors
      if (!response.ok) {
        console.error(`[ZohoCRMLeadService] API error (${response.status}):`, responseData);
        const errorMessage = this.extractErrorMessage(responseData);
        throw new Error(errorMessage);
      }

      return responseData;
    } catch (error) {
      console.error('[ZohoCRMLeadService] Request failed:', error);
      throw error;
    }
  }

  /**
   * Extract error message from Zoho API response
   */
  private extractErrorMessage(responseData: any): string {
    // Check for various error formats
    if (responseData.data && Array.isArray(responseData.data) && responseData.data[0]) {
      const firstError = responseData.data[0];
      if (firstError.message) return firstError.message;
      if (firstError.code) return `Error code: ${firstError.code}`;
    }
    
    if (responseData.message) return responseData.message;
    if (responseData.error) return responseData.error;
    if (responseData.code) return `Error code: ${responseData.code}`;
    
    return 'An error occurred while processing your request';
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return zohoTokenManager.isConfigured();
  }
}

// Export singleton instance
export const zohoCRMLeadService = new ZohoCRMLeadService();