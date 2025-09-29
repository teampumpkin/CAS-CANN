/**
 * Simple Zoho CRM Service
 * Direct integration using refresh token for lead creation
 */

interface ZohoTokenResponse {
  access_token: string;
  api_domain: string;
  token_type: string;
  expires_in: number;
}

interface ZohoLeadResponse {
  data: Array<{
    code: string;
    details: {
      id: string;
      Created_Time: string;
    };
    message: string;
    status: string;
  }>;
}

export class SimpleZohoService {
  private clientId: string;
  private clientSecret: string;
  private refreshToken: string;
  
  constructor() {
    this.clientId = process.env.ZOHO_CLIENT_ID || '';
    this.clientSecret = process.env.ZOHO_CLIENT_SECRET || '';
    this.refreshToken = process.env.ZOHO_REFRESH_TOKEN || '';
    
    if (!this.clientId || !this.clientSecret || !this.refreshToken) {
      console.error('[Zoho Service] Missing required credentials:', {
        hasClientId: !!this.clientId,
        hasClientSecret: !!this.clientSecret,
        hasRefreshToken: !!this.refreshToken
      });
    }
  }

  /**
   * Step 1: Get fresh access token using refresh token
   */
  async getAccessToken(): Promise<{ token: string; apiDomain: string }> {
    const requestId = `token_${Date.now()}`;
    console.log(`[${requestId}] Refreshing Zoho access token...`);
    
    try {
      const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
      const params = new URLSearchParams({
        refresh_token: this.refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token'
      });

      console.log(`[${requestId}] Making token refresh request to Zoho OAuth endpoint`);
      
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        console.error(`[${requestId}] Token refresh failed:`, {
          status: response.status,
          statusText: response.statusText,
          response: responseText
        });
        throw new Error(`Failed to refresh token: ${response.status} ${responseText}`);
      }

      const data: ZohoTokenResponse = JSON.parse(responseText);
      
      if (!data.access_token) {
        console.error(`[${requestId}] No access token in response:`, data);
        throw new Error('No access token received from Zoho');
      }

      console.log(`[${requestId}] Access token refreshed successfully`, {
        tokenLength: data.access_token.length,
        expiresIn: data.expires_in,
        apiDomain: data.api_domain
      });

      return {
        token: data.access_token,
        apiDomain: data.api_domain || 'https://www.zohoapis.com'
      };
    } catch (error) {
      console.error(`[${requestId}] Error refreshing access token:`, error);
      throw error;
    }
  }

  /**
   * Step 2: Create lead in Zoho CRM
   */
  async createLead(formData: any): Promise<{ success: boolean; leadId?: string; error?: string }> {
    const requestId = `lead_${Date.now()}`;
    console.log(`[${requestId}] Creating lead in Zoho CRM...`);
    
    try {
      // First, get the access token
      const { token, apiDomain } = await this.getAccessToken();
      
      // Prepare lead data for Zoho CRM
      const leadData = {
        data: [{
          Last_Name: formData.fullName || formData.data?.fullName || 'Unknown',
          Email: formData.emailAddress || formData.data?.emailAddress || '',
          Company: formData.institutionName || formData.data?.institutionName || 'Unknown',
          Phone: formData.data?.institutionPhone || '',
          Lead_Source: 'Website',
          Description: this.formatLeadDescription(formData),
          // Custom fields - these will be created if they don't exist
          Professional_Designation: formData.data?.discipline || '',
          Subspecialty: formData.data?.subspecialty || '',
          Amyloidosis_Type: formData.data?.amyloidosisType || '',
          Areas_of_Interest: formData.data?.areasOfInterest || '',
          Communication_Consent: formData.data?.communicationConsent || 'No',
          Presenting_Interest: formData.data?.presentingInterest || '',
          Presentation_Topic: formData.data?.presentationTopic || '',
          Source_Form: formData.form_name || 'Join CANN Today',
          Membership_Request: formData.data?.membershipRequest || ''
        }],
        trigger: ["workflow"]
      };

      console.log(`[${requestId}] Sending lead data to Zoho CRM:`, {
        apiDomain,
        hasToken: !!token,
        leadName: leadData.data[0].Last_Name,
        leadEmail: leadData.data[0].Email
      });

      const leadUrl = `${apiDomain}/crm/v2/Leads`;
      const leadResponse = await fetch(leadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      });

      const leadResponseText = await leadResponse.text();
      
      if (!leadResponse.ok) {
        console.error(`[${requestId}] Lead creation failed:`, {
          status: leadResponse.status,
          statusText: leadResponse.statusText,
          response: leadResponseText
        });
        return {
          success: false,
          error: `Failed to create lead: ${leadResponse.status} ${leadResponseText}`
        };
      }

      const leadResult: ZohoLeadResponse = JSON.parse(leadResponseText);
      
      if (leadResult.data && leadResult.data[0]) {
        const lead = leadResult.data[0];
        
        if (lead.status === 'success') {
          console.log(`[${requestId}] Lead created successfully:`, {
            leadId: lead.details.id,
            createdTime: lead.details.Created_Time,
            message: lead.message
          });
          
          return {
            success: true,
            leadId: lead.details.id
          };
        } else {
          console.error(`[${requestId}] Lead creation returned error:`, lead);
          return {
            success: false,
            error: `Lead creation failed: ${lead.message || 'Unknown error'}`
          };
        }
      }

      console.error(`[${requestId}] Unexpected response structure:`, leadResult);
      return {
        success: false,
        error: 'Unexpected response from Zoho CRM'
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
   * Helper: Format lead description with all form data
   */
  private formatLeadDescription(formData: any): string {
    const data = formData.data || {};
    const lines = [
      `Form: ${formData.form_name || 'Unknown'}`,
      `Submitted: ${new Date().toISOString()}`,
      '',
      'Professional Information:',
      `- Designation: ${data.discipline || 'Not provided'}`,
      `- Subspecialty: ${data.subspecialty || 'Not provided'}`,
      `- Institution: ${data.institutionName || 'Not provided'}`,
      '',
      'Amyloidosis Information:',
      `- Type: ${data.amyloidosisType || 'Not provided'}`,
      data.otherAmyloidosisType ? `- Other Type: ${data.otherAmyloidosisType}` : '',
      '',
      'Interests:',
      `- Areas: ${data.areasOfInterest || 'Not provided'}`,
      data.otherInterest ? `- Other: ${data.otherInterest}` : '',
      `- Presenting Interest: ${data.presentingInterest || 'No'}`,
      data.presentationTopic ? `- Topic: ${data.presentationTopic}` : '',
      '',
      'Consent:',
      `- Communication: ${data.communicationConsent || 'No'}`,
      `- Services Map: ${data.servicesMapConsent || 'No'}`,
      `- Follow-up: ${data.followUpConsent || 'No'}`
    ].filter(line => line); // Remove empty lines
    
    return lines.join('\n');
  }

  /**
   * Check if credentials are configured
   */
  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret && this.refreshToken);
  }
}

// Export singleton instance
export const simpleZohoService = new SimpleZohoService();