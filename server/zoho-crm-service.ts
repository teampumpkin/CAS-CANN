import { FieldMapping, InsertFieldMapping, FormConfiguration, SubmitFieldConfig, SubmitFieldsMap } from "@shared/schema";
import { oauthService } from "./oauth-service";
import { dedicatedTokenManager } from "./dedicated-token-manager";
import { storage } from "./storage";

// Zoho CRM API types
export interface ZohoField {
  id: string;
  field_label: string;
  api_name: string;
  data_type: string;
  length?: number;
  required?: boolean;
  custom_field?: boolean;
  pick_list_values?: Array<{
    display_value: string;
    actual_value: string;
  }>;
}

export interface ZohoFieldCreateRequest {
  api_name: string;
  field_label: string;
  data_type: "text" | "email" | "phone" | "picklist" | "multiselectpicklist" | "boolean";
  length?: number;
  required?: boolean;
  pick_list_values?: Array<{
    display_value: string;
    actual_value: string;
  }>;
  layouts?: Array<{
    id: string;
    section_id?: string;
  }>;
  profiles?: Array<{
    id: string;
    permission_type: "read_write" | "read_only";
  }>;
}

// Zoho Layout API types
export interface ZohoLayout {
  id: string;
  name: string;
  sections: Array<{
    id: string;
    name: string;
    display_label: string;
  }>;
}

export interface ZohoLayoutResponse {
  layouts: ZohoLayout[];
}

export interface ZohoProfile {
  id: string;
  name: string;
  category?: boolean;
}

export interface ZohoRecord {
  id?: string;
  [key: string]: any;
}

export interface ZohoApiResponse<T> {
  data: T[];
  fields?: T[]; // Zoho returns 'fields' for settings/fields API, 'data' for records
  info?: {
    count: number;
    page: number;
    per_page: number;
    more_records: boolean;
  };
  message?: string;
  status?: string;
}

export interface ZohoErrorResponse {
  code: string;
  details: any;
  message: string;
  status: string;
}

export class ZohoCRMService {
  private baseUrl: string;
  private orgId: string;

  constructor() {
    // Get configuration from environment variables
    this.orgId = process.env.ZOHO_ORG_ID || "";
    this.baseUrl = "https://www.zohoapis.com/crm/v8";

    if (!this.orgId) {
      console.warn("ZOHO_ORG_ID not found in environment variables");
    }
  }

  /**
   * Get a valid access token, automatically refreshing if needed
   * BULLETPROOF: Attempts auto-refresh even for expired tokens
   */
  private async getAccessToken(): Promise<string> {
    // Layer 1: Check token health
    const health = await dedicatedTokenManager.checkTokenHealth('zoho_crm');
    
    // Layer 2: If invalid OR needs refresh, attempt automatic refresh
    if (!health.isValid || health.needsRefresh) {
      console.log(`[Zoho CRM] Token ${!health.isValid ? 'expired' : 'needs refresh'}, attempting auto-recovery...`);
      const refreshed = await dedicatedTokenManager.forceRefreshToken('zoho_crm');
      if (refreshed) {
        console.log('[Zoho CRM] ✅ Token auto-refreshed successfully');
        return refreshed.accessToken;
      }
      
      // If refresh failed, throw error with instructions
      console.error(`[Zoho CRM] ❌ Auto-refresh failed - manual authentication required`);
      throw new Error(`No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect`);
    }
    
    // Layer 3: Get validated token from cache/database
    const token = await dedicatedTokenManager.getValidAccessToken('zoho_crm');
    if (!token) {
      throw new Error("No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect");
    }
    return token;
  }

  private async makeRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    body?: any,
    retryCount: number = 0
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Get a valid access token (auto-refreshes if needed)
    const accessToken = await this.getAccessToken();
    
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    if (this.orgId) {
      headers["orgId"] = this.orgId;
    }

    try {
      console.log(`[Zoho API v8] ${method} ${url}`);
      
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseData = await response.json();

      // Handle rate limiting (429) with exponential backoff
      if (response.status === 429 && retryCount < 3) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, retryCount) * 1000;
        console.log(`[Zoho API] Rate limited, retrying after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeRequest(endpoint, method, body, retryCount + 1);
      }

      // Handle OAuth errors (401) with token refresh retry
      if (response.status === 401 && retryCount < 2) {
        console.log(`[Zoho API] OAuth error (401), forcing token refresh and retry...`);
        // Force token refresh using dedicated token manager
        const refreshed = await dedicatedTokenManager.forceRefreshToken('zoho_crm');
        if (refreshed) {
          console.log('[Zoho API] Token refreshed, retrying request...');
          return this.makeRequest(endpoint, method, body, retryCount + 1);
        }
        console.error('[Zoho API] Token refresh failed after 401 error');
      }

      if (!response.ok) {
        const errorDetails = this.extractErrorDetails(responseData, response.status);
        console.error(`[Zoho API v8 Error] ${response.status}:`, errorDetails);
        console.error(`[Zoho API v8 Full Response]:`, JSON.stringify(responseData, null, 2));
        throw new Error(`Zoho API v8 Error ${response.status}: ${errorDetails.message}`);
      }

      return responseData as T;
    } catch (error) {
      console.error(`[Zoho API v8 Request Failed] ${method} ${url}:`, error);
      throw error;
    }
  }

  private extractErrorDetails(responseData: any, statusCode: number): { message: string; code?: string } {
    // v8 API error response structure
    if (responseData.data && Array.isArray(responseData.data) && responseData.data[0]) {
      const errorData = responseData.data[0];
      return {
        message: errorData.message || errorData.details?.api_name || 'Unknown error',
        code: errorData.code
      };
    }
    
    // Fallback for other error formats
    return {
      message: responseData.message || responseData.error || `HTTP ${statusCode} Error`,
      code: responseData.code
    };
  }

  // Metadata API methods
  async getModuleFields(moduleName: string): Promise<ZohoField[]> {
    try {
      const response = await this.makeRequest<ZohoApiResponse<ZohoField>>(
        `/settings/fields?module=${moduleName}`
      );
      return response.fields || [];
    } catch (error) {
      console.error(`Failed to fetch fields for module ${moduleName} using v8 API:`, error);
      throw error;
    }
  }

  async createCustomField(moduleName: string, fieldData: ZohoFieldCreateRequest): Promise<ZohoField> {
    try {
      // v8 API best practice: validate required fields before sending
      if (!fieldData.api_name || !fieldData.field_label || !fieldData.data_type) {
        throw new Error("Missing required field data: api_name, field_label, and data_type are required");
      }

      // Get layout information if not provided (OPTIONAL - omit for now to fix HTTP 400)
      // Zoho v8 API may not require layouts for field creation
      // if (!fieldData.layouts) {
      //   const layoutInfo = await this.getDefaultLayoutForModule(moduleName);
      //   fieldData.layouts = [{
      //     id: layoutInfo.layoutId,
      //     section_id: layoutInfo.sectionId
      //   }];
      // }

      // Get profiles if not provided (REQUIRED by Zoho CRM v8 API)
      if (!fieldData.profiles || fieldData.profiles.length === 0) {
        const profiles = await this.getProfiles();
        if (profiles.length > 0) {
          // Add all profiles with read_write permission
          fieldData.profiles = profiles.map(profile => ({
            id: profile.id,
            permission_type: "read_write" as const
          }));
          console.log(`[Zoho CRM] Auto-added ${profiles.length} profiles for field ${fieldData.api_name}`);
        } else {
          console.warn(`[Zoho CRM] No profiles found for field ${fieldData.api_name} - field creation may fail`);
        }
      }

      console.log(`[Zoho CRM] Creating field ${fieldData.api_name} with layout and profile info:`, {
        layouts: fieldData.layouts,
        profiles: fieldData.profiles?.length || 0
      });

      // Debug: Log the exact payload being sent
      console.log(`[Zoho CRM DEBUG] Full field payload:`, JSON.stringify({ fields: [fieldData] }, null, 2));

      const response = await this.makeRequest<any>(
        `/settings/fields?module=${moduleName}`,
        "POST",
        { fields: [fieldData] }
      );

      // Zoho field creation API returns {fields: [{code, details, message}]} not {data: [...]}
      if (response.fields && response.fields.length > 0) {
        const result = response.fields[0];
        if (result.code === "SUCCESS" && result.details) {
          console.log(`[Zoho CRM] Successfully created field ${fieldData.api_name} with ID: ${result.details.id}`);
          // Return a ZohoField-like object
          return {
            id: result.details.id,
            api_name: fieldData.api_name,
            field_label: fieldData.field_label,
            data_type: fieldData.data_type
          } as ZohoField;
        } else {
          throw new Error(`Field creation failed: ${result.message || 'Unknown error'}`);
        }
      } else {
        throw new Error("Failed to create field - unexpected response structure from v8 API");
      }
    } catch (error) {
      console.error(`Failed to create field ${fieldData.api_name} in module ${moduleName} using v8 API:`, error);
      throw error;
    }
  }

  /**
   * Get all layouts for a module (public method for debugging and configuration)
   */
  async getLayouts(moduleName: string = "Leads"): Promise<ZohoLayout[]> {
    try {
      const response = await this.makeRequest<ZohoLayoutResponse>(
        `/settings/layouts?module=${moduleName}`
      );
      
      if (!response.layouts || response.layouts.length === 0) {
        console.log(`[Zoho CRM] No layouts found for module ${moduleName}`);
        return [];
      }
      
      console.log(`[Zoho CRM] Found ${response.layouts.length} layouts for ${moduleName}`);
      return response.layouts;
    } catch (error) {
      console.error(`[Zoho CRM] Failed to get layouts for ${moduleName}:`, error);
      throw error;
    }
  }

  /**
   * Get layout ID by name for a module
   */
  async getLayoutIdByName(layoutName: string, moduleName: string = "Leads"): Promise<string | null> {
    try {
      const layouts = await this.getLayouts(moduleName);
      const layout = layouts.find(l => l.name.toLowerCase() === layoutName.toLowerCase());
      return layout?.id || null;
    } catch (error) {
      console.error(`[Zoho CRM] Failed to find layout "${layoutName}":`, error);
      return null;
    }
  }

  // Core API methods
  async createRecord(moduleName: string, recordData: ZohoRecord, layoutId?: string): Promise<ZohoRecord> {
    try {
      // v8 API best practice: validate record data
      if (!recordData || Object.keys(recordData).length === 0) {
        throw new Error("Record data cannot be empty");
      }

      // Add layout to record if specified
      const dataToSend = layoutId 
        ? { ...recordData, Layout: { id: layoutId } }
        : recordData;

      // DEBUG: Log the exact payload being sent to Zoho
      console.log(`[Zoho CRM DEBUG] Creating record with data:`, JSON.stringify(dataToSend, null, 2));
      if (layoutId) {
        console.log(`[Zoho CRM DEBUG] Using layout ID: ${layoutId}`);
      }

      const response = await this.makeRequest<ZohoApiResponse<ZohoRecord>>(
        `/${moduleName}`,
        "POST",
        { data: [dataToSend] }
      );

      // DEBUG: Log full API response
      console.log(`[Zoho CRM DEBUG] Full API response:`, JSON.stringify(response, null, 2));

      if (response.data && response.data.length > 0) {
        const createdRecord = response.data[0];
        const recordId = createdRecord.details?.id || createdRecord.id;
        console.log(`[Zoho v8] Successfully created record in ${moduleName}:`, recordId);
        
        // Return record with normalized ID field
        return {
          ...createdRecord,
          id: recordId
        };
      } else {
        throw new Error("Failed to create record - no data returned from v8 API");
      }
    } catch (error) {
      console.error(`Failed to create record in module ${moduleName} using v8 API:`, error);
      throw error;
    }
  }

  /**
   * Send email notification for new registration using Zoho Send Mail API
   */
  async sendRegistrationEmail(leadId: string, leadData: any): Promise<void> {
    try {
      console.log(`[Zoho Email] Sending notification emails for lead ${leadId}...`);

      const accessToken = await this.getAccessToken();

      const registrationType = leadData.Lead_Source === 'Website - CAS & CANN Registration' 
        ? 'CAS & CANN Membership' 
        : 'CAS Membership';

      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #00AFE6, #00DD89); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Registration Received</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1f2937; border-bottom: 2px solid #00AFE6; padding-bottom: 8px;">Registrant Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong>Name:</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">${leadData.Last_Name || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong>Email:</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">${leadData.Email || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong>Discipline:</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">${leadData.Industry || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong>Institution:</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">${leadData.Company || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0;"><strong>Registration Type:</strong></td>
                <td style="padding: 12px 0; text-align: right;"><span style="background: linear-gradient(135deg, #00AFE6, #00DD89); color: white; padding: 4px 12px; border-radius: 6px; font-weight: bold;">${registrationType}</span></td>
              </tr>
            </table>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="https://crm.zoho.com/crm/org20085707052/tab/Leads/${leadId}" 
                 style="display: inline-block; background: linear-gradient(135deg, #00AFE6, #00DD89); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                View in CRM
              </a>
            </div>
          </div>
        </div>
      `;

      const recipients = [
        {
          user_name: "CAS Team",
          email: "CAS@amyloid.ca"
        },
        {
          user_name: "Vasi Karan",
          email: "vasi.karan@teampumpkin.com"
        }
      ];

      // Add CANN team if it's a CANN registration
      if (leadData.Lead_Source === 'Website - CAS & CANN Registration') {
        recipients.push({
          user_name: "CANN Team",
          email: "CANN@amyloid.ca"
        });
      }

      const emailPayload = {
        data: [{
          org_email: true,
          to: recipients,
          subject: `New ${registrationType} Registration - ${leadData.Last_Name}`,
          content: emailBody,
          mail_format: "html"
        }]
      };

      const url = `${this.baseUrl}/Leads/${leadId}/actions/send_mail`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Zoho Email] Failed to send email:', errorText);
        // Don't throw - email failure shouldn't break the registration
        return;
      }

      const result = await response.json();
      console.log('[Zoho Email] ✅ Email sent successfully!', result);
      
    } catch (error) {
      console.error('[Zoho Email] Error sending registration email:', error);
      // Don't throw - email failure shouldn't break the registration
    }
  }

  /**
   * Send welcome email to new member with event details
   */
  async sendWelcomeEmail(leadId: string, leadData: any): Promise<void> {
    try {
      console.log(`[Zoho Welcome Email] Sending welcome email for lead ${leadId}...`);

      const accessToken = await this.getAccessToken();
      const isCANNMember = leadData.Lead_Source?.includes('CANN');
      const memberName = leadData.Last_Name || 'there';

      // Build event details section
      const eventDetailsHTML = isCANNMember ? `
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">📅 Upcoming Events</h3>
          
          <div style="margin-bottom: 15px; padding: 15px; background: white; border-left: 4px solid #00AFE6; border-radius: 4px;">
            <h4 style="color: #00AFE6; margin: 0 0 8px 0;">CAS Journal Club - September Session</h4>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Date:</strong> September 25, 2025</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Time:</strong> 3-4 PM MST</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Topics:</strong></p>
            <ul style="margin: 5px 0; color: #6b7280;">
              <li>An Interesting Case of ATTR-neuropathy</li>
              <li>Cardiac Amyloidosis</li>
            </ul>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Presenters:</strong> Dr. Genevieve Matte, Dr. Edgar Da Silva</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Location:</strong> Virtual (No registration required)</p>
          </div>

          <div style="margin-bottom: 15px; padding: 15px; background: white; border-left: 4px solid #00DD89; border-radius: 4px;">
            <h4 style="color: #00DD89; margin: 0 0 8px 0;">CANN Educational Series</h4>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Date:</strong> October 7, 2025</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Time:</strong> 2-3 PM MST</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Location:</strong> Virtual Event</p>
            <p style="margin: 5px 0; color: #6b7280;">Topic and speaker to be announced. Visit the CANN Events page for details.</p>
          </div>

          <div style="padding: 15px; background: white; border-left: 4px solid #00AFE6; border-radius: 4px;">
            <h4 style="color: #00AFE6; margin: 0 0 8px 0;">CAS Journal Club - November Session</h4>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Date:</strong> November 27, 2025</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Time:</strong> 3-4 PM MST</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Location:</strong> Virtual (Details coming soon)</p>
          </div>
        </div>
      ` : `
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">📅 Upcoming Events</h3>
          
          <div style="margin-bottom: 15px; padding: 15px; background: white; border-left: 4px solid #00AFE6; border-radius: 4px;">
            <h4 style="color: #00AFE6; margin: 0 0 8px 0;">CAS Journal Club - September Session</h4>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Date:</strong> September 25, 2025</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Time:</strong> 3-4 PM MST</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Topics:</strong></p>
            <ul style="margin: 5px 0; color: #6b7280;">
              <li>An Interesting Case of ATTR-neuropathy</li>
              <li>Cardiac Amyloidosis</li>
            </ul>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Presenters:</strong> Dr. Genevieve Matte, Dr. Edgar Da Silva</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Location:</strong> Virtual (No registration required)</p>
          </div>

          <div style="padding: 15px; background: white; border-left: 4px solid #00AFE6; border-radius: 4px;">
            <h4 style="color: #00AFE6; margin: 0 0 8px 0;">CAS Journal Club - November Session</h4>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Date:</strong> November 27, 2025</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Time:</strong> 3-4 PM MST</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Location:</strong> Virtual (Details coming soon)</p>
          </div>
        </div>
      `;

      const emailBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6; color: #333;">
          <div style="background: linear-gradient(135deg, #00AFE6, #00DD89); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Welcome to ${isCANNMember ? 'CAS & CANN' : 'CAS'}!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Thank you for joining the Canadian Amyloidosis Society</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 16px; color: #374151; margin: 0 0 20px 0;">Dear ${memberName},</p>
            
            <p style="font-size: 15px; color: #4b5563; margin: 0 0 15px 0;">
              We're thrilled to welcome you to the Canadian Amyloidosis Society${isCANNMember ? ' and the Canadian Amyloidosis Nursing Network (CANN)' : ''}! 
              You're now part of a dedicated community working together to advance amyloidosis care, research, and education across Canada.
            </p>

            ${isCANNMember ? `
            <div style="background: linear-gradient(135deg, rgba(0,175,230,0.1), rgba(0,221,137,0.1)); padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00DD89;">
              <h3 style="color: #00DD89; margin-top: 0;">🎯 As a CANN Member</h3>
              <p style="color: #4b5563; margin: 0;">You'll receive exclusive access to nursing-focused educational resources, networking opportunities with fellow amyloidosis care specialists, and invitations to CANN-specific events throughout the year.</p>
            </div>
            ` : ''}

            <h3 style="color: #1f2937; margin: 25px 0 15px 0;">🚀 Getting Started</h3>
            <ul style="color: #4b5563; line-height: 1.8; margin: 0 0 20px 0;">
              <li><strong>Visit our website:</strong> <a href="https://amyloid.ca" style="color: #00AFE6; text-decoration: none;">amyloid.ca</a></li>
              <li><strong>Explore resources:</strong> Clinical tools, patient materials, and research updates</li>
              <li><strong>Join upcoming events:</strong> Journal Clubs and educational series (see below)</li>
              ${isCANNMember ? '<li><strong>Access CANN resources:</strong> Nursing-specific materials and case studies</li>' : ''}
              <li><strong>Connect with the network:</strong> Collaborate with fellow clinicians and researchers</li>
            </ul>

            ${eventDetailsHTML}

            <div style="background: linear-gradient(135deg, rgba(0,175,230,0.1), rgba(0,221,137,0.1)); padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">📬 Stay Connected</h3>
              <p style="color: #4b5563; margin: 0 0 10px 0;">You'll receive regular updates about:</p>
              <ul style="color: #4b5563; margin: 0;">
                <li>Upcoming events and educational opportunities</li>
                <li>New clinical resources and guidelines</li>
                <li>Research developments and publications</li>
                ${isCANNMember ? '<li>CANN-specific nursing education and networking events</li>' : ''}
                <li>Collaborative initiatives across Canada</li>
              </ul>
            </div>

            <p style="font-size: 15px; color: #4b5563; margin: 25px 0 15px 0;">
              If you have any questions or need assistance, please don't hesitate to reach out to us at 
              <a href="mailto:CAS@amyloid.ca" style="color: #00AFE6; text-decoration: none;">CAS@amyloid.ca</a>${isCANNMember ? ' or <a href="mailto:CANN@amyloid.ca" style="color: #00DD89; text-decoration: none;">CANN@amyloid.ca</a>' : ''}.
            </p>

            <p style="font-size: 15px; color: #4b5563; margin: 20px 0 0 0;">
              Welcome aboard!
            </p>
            
            <p style="font-size: 15px; color: #4b5563; margin: 5px 0 0 0; font-weight: 600;">
              The CAS Team${isCANNMember ? ' & CANN Executive Committee' : ''}
            </p>
          </div>

          <div style="background: #f9fafb; padding: 20px 30px; border-radius: 0 0 12px 12px; text-align: center; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              Canadian Amyloidosis Society${isCANNMember ? ' & CANN' : ''}<br>
              <a href="https://amyloid.ca" style="color: #00AFE6; text-decoration: none;">amyloid.ca</a>
            </p>
          </div>
        </div>
      `;

      const emailPayload = {
        data: [{
          org_email: true,
          to: [{
            user_name: memberName,
            email: leadData.Email
          }],
          subject: `Welcome to ${isCANNMember ? 'CAS & CANN' : 'CAS'} - Your Membership is Confirmed!`,
          content: emailBody,
          mail_format: "html"
        }]
      };

      const url = `${this.baseUrl}/Leads/${leadId}/actions/send_mail`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Zoho Welcome Email] Failed to send:', errorText);
        return;
      }

      const result = await response.json();
      console.log('[Zoho Welcome Email] ✅ Sent successfully to', leadData.Email);
      
    } catch (error) {
      console.error('[Zoho Welcome Email] Error:', error);
    }
  }

  async updateRecord(moduleName: string, recordId: string, recordData: ZohoRecord): Promise<ZohoRecord> {
    try {
      // v8 API best practice: validate inputs
      if (!recordId) {
        throw new Error("Record ID is required for update");
      }
      if (!recordData || Object.keys(recordData).length === 0) {
        throw new Error("Update data cannot be empty");
      }

      const response = await this.makeRequest<ZohoApiResponse<ZohoRecord>>(
        `/${moduleName}/${recordId}`,
        "PUT",
        { data: [recordData] }
      );

      if (response.data && response.data.length > 0) {
        console.log(`[Zoho v8] Successfully updated record ${recordId} in ${moduleName}`);
        return response.data[0];
      } else {
        throw new Error("Failed to update record - no data returned from v8 API");
      }
    } catch (error) {
      console.error(`Failed to update record ${recordId} in module ${moduleName} using v8 API:`, error);
      throw error;
    }
  }

  async getRecord(moduleName: string, recordId: string): Promise<ZohoRecord | null> {
    try {
      const response = await this.makeRequest<ZohoApiResponse<ZohoRecord>>(
        `/${moduleName}/${recordId}`
      );

      if (response.data && response.data.length > 0) {
        return response.data[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Failed to get record ${recordId} from module ${moduleName}:`, error);
      throw error;
    }
  }

  async getRecords(moduleName: string, options: { page?: number; per_page?: number; fields?: string } = {}): Promise<ZohoRecord[]> {
    try {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page.toString());
      if (options.per_page) params.append('per_page', options.per_page.toString());
      if (options.fields) params.append('fields', options.fields);
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await this.makeRequest<ZohoApiResponse<ZohoRecord>>(
        `/${moduleName}${queryString}`
      );

      return response.data || [];
    } catch (error) {
      console.error(`Failed to get records from module ${moduleName}:`, error);
      return [];
    }
  }

  /**
   * Get all fields for a specific module (for metadata caching)
   */
  async getFieldsForModule(moduleName: string): Promise<ZohoField[]> {
    try {
      const response = await this.makeRequest<ZohoApiResponse<ZohoField>>(
        `/settings/fields?module=${moduleName}`
      );
      return response.fields || [];
    } catch (error) {
      console.error(`Failed to fetch fields for module ${moduleName}:`, error);
      throw error;
    }
  }

  /**
   * Get default layout and section for a module (required for field creation)
   */
  private async getDefaultLayoutForModule(moduleName: string): Promise<{ layoutId: string; sectionId: string }> {
    try {
      const response = await this.makeRequest<ZohoLayoutResponse>(
        `/settings/layouts?module=${moduleName}`
      );

      if (!response.layouts || response.layouts.length === 0) {
        throw new Error(`No layouts found for module ${moduleName}`);
      }

      // Use the first layout (typically the default)
      const layout = response.layouts[0];
      
      if (!layout.sections || layout.sections.length === 0) {
        throw new Error(`No sections found in layout for module ${moduleName}`);
      }

      // Use the first section (typically a general information section)
      const section = layout.sections[0];
      
      console.log(`[Zoho CRM] Using layout ${layout.id} (${layout.name}) section ${section.id} (${section.display_label}) for ${moduleName}`);
      
      return {
        layoutId: layout.id,
        sectionId: section.id
      };
    } catch (error) {
      console.error(`Failed to get layout for module ${moduleName}:`, error);
      // Fallback: try without section_id (some Zoho versions might work with just layout)
      return {
        layoutId: "default",
        sectionId: "default"
      };
    }
  }

  /**
   * Get all profiles for the organization (required for field creation)
   */
  private async getProfiles(): Promise<ZohoProfile[]> {
    try {
      const response = await this.makeRequest<{ profiles: ZohoProfile[] }>(
        `/settings/profiles`
      );
      return response.profiles || [];
    } catch (error) {
      console.error(`Failed to get profiles:`, error);
      return [];
    }
  }

  // Helper methods for field type mapping
  detectFieldType(value: any, fieldName: string): "text" | "email" | "phone" | "picklist" | "multiselectpicklist" | "boolean" {
    // Check for email pattern
    if (typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "email";
    }

    // Check for phone pattern
    if (typeof value === "string" && /^\+?[\d\s\-\(\)]{10,}$/.test(value)) {
      return "phone";
    }

    // Check for boolean values
    if (typeof value === "boolean" || (typeof value === "string" && ["yes", "no", "true", "false"].includes(value.toLowerCase()))) {
      return "boolean";
    }

    // Check for array (multi-select)
    if (Array.isArray(value)) {
      return "multiselectpicklist";
    }

    // Check field name patterns for specific types
    const lowerFieldName = fieldName.toLowerCase();
    if (lowerFieldName.includes("email")) return "email";
    if (lowerFieldName.includes("phone") || lowerFieldName.includes("tel")) return "phone";
    if (lowerFieldName.includes("consent") || lowerFieldName.includes("agree")) return "boolean";

    // Default to text for everything else
    return "text";
  }

  convertToZohoFieldName(formFieldName: string): string {
    // Map common form field patterns to Zoho standard field names
    const standardFieldMappings: Record<string, string> = {
      // Name fields
      'fullname': 'Last_Name',
      'full_name': 'Last_Name',
      'name': 'Last_Name',
      'lastname': 'Last_Name',
      'last_name': 'Last_Name',
      'firstname': 'First_Name',
      'first_name': 'First_Name',
      
      // Email fields
      'email': 'Email',
      'emailaddress': 'Email',
      'email_address': 'Email',
      
      // Company fields
      'company': 'Company',
      'companyname': 'Company',
      'company_name': 'Company',
      'organization': 'Company',
      
      // Phone fields
      'phone': 'Phone',
      'phonenumber': 'Phone',
      'phone_number': 'Phone',
      'mobile': 'Mobile',
      'mobilenumber': 'Mobile',
      'mobile_number': 'Mobile',
    };
    
    // Normalize input for lookup
    const normalized = formFieldName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if we have a standard mapping
    if (standardFieldMappings[normalized]) {
      return standardFieldMappings[normalized];
    }
    
    // Otherwise, convert to Zoho API naming convention (camelCase with first letter capitalized for multi-word)
    return formFieldName
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars
      .split(/\s+/) // Split on whitespace
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
  }

  formatFieldDataForZoho(formData: Record<string, any>, fieldMappings: FieldMapping[]): Record<string, any> {
    const zohoData: Record<string, any> = {};
    // Create case-insensitive lookup map
    const mappingLookup = new Map(fieldMappings.map(m => [m.fieldName.toLowerCase(), m]));

    // Standard Zoho fields that should always use standard mapping
    const standardZohoFields = ['fullname', 'lastname', 'firstname', 'email', 'emailaddress', 'company', 'phone'];

    for (const [fieldName, value] of Object.entries(formData)) {
      const fieldNameLower = fieldName.toLowerCase();
      const normalizedFieldName = fieldNameLower.replace(/[^a-z0-9]/g, '');
      
      // Check if this should use standard Zoho field mapping
      const useStandardMapping = standardZohoFields.some(stdField => normalizedFieldName === stdField);
      
      let zohoFieldName: string;
      let fieldType: string;
      let maxLength: number | null = 255;
      
      if (useStandardMapping) {
        // Use standard Zoho field mapping (e.g., fullName → Last_Name)
        zohoFieldName = this.convertToZohoFieldName(fieldName);
        fieldType = this.detectFieldType(value, fieldName);
      } else {
        // Check for existing field mapping in Zoho
        const mapping = mappingLookup.get(fieldNameLower);
        if (mapping) {
          // Use existing Zoho field definition - RESPECT THE EXISTING TYPE
          zohoFieldName = mapping.fieldName;
          fieldType = mapping.fieldType;
          maxLength = mapping.maxLength;
        } else {
          // New custom field - detect type
          zohoFieldName = this.convertToZohoFieldName(fieldName);
          fieldType = this.detectFieldType(value, fieldName);
        }
      }
      
      // Format value based on the ZOHO field type (not detected type)
      if (fieldType === "boolean") {
        zohoData[zohoFieldName] = this.convertToBoolean(value);
      } else if (fieldType === "multiselectpicklist" && Array.isArray(value)) {
        let formatted = value.join(";");
        zohoData[zohoFieldName] = this.truncateField(formatted, zohoFieldName, maxLength);
      } else if (fieldType === "phone" || fieldType === "email") {
        // Phone and email fields must be strings in Zoho
        zohoData[zohoFieldName] = this.truncateField(String(value), zohoFieldName, maxLength);
      } else {
        // For text fields, keep the original value as-is (don't convert Yes/No to boolean)
        zohoData[zohoFieldName] = this.truncateField(value, zohoFieldName, maxLength);
      }
    }

    return zohoData;
  }

  /**
   * Format field data for Zoho CRM using form configuration
   * Delegates to FormConfigEngine for consistent filtering, then applies type formatting
   * Returns both formatted data and diagnostics (excluded fields)
   */
  async formatFieldDataForZohoWithConfig(
    formData: Record<string, any>,
    formConfig: FormConfiguration
  ): Promise<{ zohoData: Record<string, any>; excludedFields: string[]; leadSource: string }> {
    // Import formConfigEngine dynamically to avoid circular dependency
    const { formConfigEngine } = await import("./form-config-engine");
    
    // Delegate filtering to FormConfigEngine for consistent strictMapping behavior
    const filtered = formConfigEngine.filterFormDataForZoho(formData, formConfig);
    const submitFields = (formConfig.submitFields || {}) as SubmitFieldsMap;
    const fieldMappings = (formConfig.fieldMappings || {}) as Record<string, string>;
    const configuredFieldCount = Object.keys(submitFields).length + Object.keys(fieldMappings).length;
    
    console.log(`[Zoho CRM] Formatting data with config for form "${formConfig.formName}"`, {
      strictMapping: formConfig.strictMapping ?? false,
      configuredFields: configuredFieldCount,
      inputFields: Object.keys(formData).length,
      filteredFields: Object.keys(filtered.filteredData).length,
      excludedFields: filtered.excludedFields.length
    });

    // Apply type formatting to filtered data
    const zohoData: Record<string, any> = {};
    
    // Get field metadata for looking up actual Zoho field types
    const fieldMetadataCache = await storage.getFieldMetadataCache({ zohoModule: formConfig.zohoModule || "Leads" });
    const metadataByApiName = new Map(fieldMetadataCache.map(f => [f.fieldApiName, f]));
    
    for (const mapping of filtered.mappedFields) {
      const { formField, zohoField, value } = mapping;
      if (value === null || value === undefined) continue;
      
      // Get field config for type info - prefer submitFields, then metadata cache, then detection
      const fieldConfig = submitFields[formField];
      const zohoFieldMeta = metadataByApiName.get(zohoField);
      
      // Use actual Zoho field type from metadata if available
      let fieldType: string;
      let maxLength: number;
      
      if (fieldConfig?.fieldType) {
        fieldType = fieldConfig.fieldType;
        maxLength = fieldConfig.maxLength || 255;
      } else if (zohoFieldMeta) {
        fieldType = zohoFieldMeta.dataType;
        maxLength = zohoFieldMeta.maxLength || 255;
      } else {
        fieldType = this.detectFieldType(value, formField);
        maxLength = 255;
      }
      
      // Apply proper type formatting based on ACTUAL Zoho field type
      if (fieldType === "boolean") {
        zohoData[zohoField] = this.convertToBoolean(value);
      } else if (fieldType === "multiselectpicklist" && Array.isArray(value)) {
        zohoData[zohoField] = this.truncateField(value.join(";"), zohoField, maxLength);
      } else if (fieldType === "phone" || fieldType === "email") {
        zohoData[zohoField] = this.truncateField(String(value), zohoField, maxLength);
      } else {
        // For text fields, keep as string - DO NOT convert Yes/No to boolean
        zohoData[zohoField] = this.truncateField(String(value), zohoField, maxLength);
      }
      
      console.log(`[Zoho CRM] Formatted: ${formField} → ${zohoField} (${fieldType})`);
    }

    // Add Lead_Source from filtered result
    zohoData.Lead_Source = filtered.leadSource;
    console.log(`[Zoho CRM] Added Lead_Source: ${filtered.leadSource}`);

    console.log(`[Zoho CRM] Formatted ${Object.keys(zohoData).length} fields for Zoho CRM, excluded ${filtered.excludedFields.length}`);
    return { zohoData, excludedFields: filtered.excludedFields, leadSource: filtered.leadSource };
  }

  private truncateField(value: any, fieldName: string, maxLength?: number | null): any {
    // Skip non-string values or null maxLength
    if (typeof value !== "string" || !maxLength) {
      return value;
    }

    // If value is within limit, return as-is
    if (value.length <= maxLength) {
      return value;
    }

    // Truncate and log
    const truncated = value.substring(0, maxLength);
    console.log(`[Zoho CRM] ⚠️ Truncated field "${fieldName}" from ${value.length} to ${maxLength} chars`);
    
    return truncated;
  }

  private convertToBoolean(value: any): boolean {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      const lower = value.toLowerCase();
      return lower === "yes" || lower === "true" || lower === "1";
    }
    return Boolean(value);
  }

  // Test connection method
  async testConnection(): Promise<{ success: boolean; message: string; apiVersion?: string }> {
    try {
      // Try to fetch user info as a simple test for v8 API
      const response = await this.makeRequest<ZohoApiResponse<any>>("/users?type=CurrentUser");
      return { 
        success: true, 
        message: "Successfully connected to Zoho CRM v8 API",
        apiVersion: "v8"
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to connect to Zoho CRM v8: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  // Utility method to generate picklist values from form data
  generatePicklistValues(values: string[]): Array<{ display_value: string; actual_value: string }> {
    return values.map(value => ({
      display_value: value,
      actual_value: value
    }));
  }
}

export const zohoCRMService = new ZohoCRMService();