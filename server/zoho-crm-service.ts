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

        // Zoho can return HTTP 200 with an error status inside the data item
        // e.g. {"status": "error", "code": "INVALID_DATA", "message": "...", "details": {...}}
        if (createdRecord.status === "error") {
          const zohoCode = createdRecord.code || "UNKNOWN_ERROR";
          const zohoMessage = createdRecord.message || "Zoho rejected the record";
          const zohoDetails = createdRecord.details ? JSON.stringify(createdRecord.details) : "";
          const fullError = `Zoho API rejected record: [${zohoCode}] ${zohoMessage}${zohoDetails ? ` — ${zohoDetails}` : ""}`;
          console.error(`[Zoho CRM] Record creation REJECTED by Zoho API: ${fullError}`);
          console.error(`[Zoho CRM] Full rejection response:`, JSON.stringify(createdRecord, null, 2));
          throw new Error(fullError);
        }

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

  async createOperationalViews(): Promise<{ created: string[]; failed: { name: string; error: string }[] }> {
    const created: string[] = [];
    const failed: { name: string; error: string }[] = [];

    const views = [
      {
        name: "CAS Only",
        description: "Scenario A — CAS member only, no CANN membership",
        criteria: {
          group: [
            { field: { api_name: "CAS_Member" }, comparator: "equal", value: "true" },
            { field: { api_name: "CANN_Member" }, comparator: "equal", value: "false" }
          ],
          group_operator: "and"
        }
      },
      {
        name: "Both CAS and CANN",
        description: "Scenario C — holds both CAS and CANN membership",
        criteria: {
          group: [
            { field: { api_name: "CAS_Member" }, comparator: "equal", value: "true" },
            { field: { api_name: "CANN_Member" }, comparator: "equal", value: "true" }
          ],
          group_operator: "and"
        }
      },
      {
        name: "Non-Member Contacts",
        description: "Scenario D — inquiry records, not members",
        criteria: {
          group: [
            { field: { api_name: "Record_Type" }, comparator: "equal", value: "Inquiry" }
          ],
          group_operator: "and"
        }
      },
      {
        name: "CAS Communications Eligible",
        description: "CAS members who have consented to CAS communications",
        criteria: {
          group: [
            { field: { api_name: "CAS_Member" }, comparator: "equal", value: "true" },
            { field: { api_name: "CAS_Communications" }, comparator: "equal", value: "Yes" }
          ],
          group_operator: "and"
        }
      },
      {
        name: "CANN Communications Eligible",
        description: "CANN members who have consented to CANN communications",
        criteria: {
          group: [
            { field: { api_name: "CANN_Member" }, comparator: "equal", value: "true" },
            { field: { api_name: "CANN_Communications" }, comparator: "equal", value: "Yes" }
          ],
          group_operator: "and"
        }
      }
    ];

    for (const view of views) {
      try {
        console.log(`[Zoho Views] Creating view: ${view.name}...`);
        const payload = {
          custom_views: [
            {
              name: view.name,
              module: { api_name: "Leads" },
              access_type: "public",
              criteria: view.criteria,
              sort_by: { api_name: "Last_Name" },
              sort_order: "asc",
              fields: [
                { api_name: "Last_Name" },
                { api_name: "Email" },
                { api_name: "CAS_Member" },
                { api_name: "CANN_Member" },
                { api_name: "Record_Type" },
                { api_name: "Lead_Source" }
              ]
            }
          ]
        };

        const response = await this.makeRequest<any>("/settings/custom_views?module=Leads", "POST", payload);

        if (response?.custom_views?.[0]?.status === "success" || response?.custom_views?.[0]?.id) {
          console.log(`[Zoho Views] ✅ Created: ${view.name}`);
          created.push(view.name);
        } else {
          const errMsg = response?.custom_views?.[0]?.message || JSON.stringify(response);
          console.error(`[Zoho Views] ❌ Failed: ${view.name} — ${errMsg}`);
          failed.push({ name: view.name, error: errMsg });
        }
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        console.error(`[Zoho Views] ❌ Exception for ${view.name}: ${errMsg}`);
        failed.push({ name: view.name, error: errMsg });
      }
    }

    return { created, failed };
  }

  async fixEmailTemplates(): Promise<Array<{ name: string; fixed: boolean; changes: string[]; error?: string }>> {
    const templates = [
      {
        id: "6999043000000903020",
        name: "CAS CANN Membership Email Template",
        fixSubject: (s: string) => {
          const changes: string[] = [];
          let fixed = s;
          if (fixed.includes("${!Leads.First_Name} - New CAS Membership Registration")) {
            fixed = fixed.replace(
              "${!Leads.First_Name} - New CAS Membership Registration",
              "${!Leads.First_Name} ${!Leads.Last_Name} - New CAS & CANN Membership Registration"
            );
            changes.push("Subject: added Last_Name and updated title to 'CAS & CANN'");
          }
          return { fixed, changes };
        },
        fixBody: (b: string) => {
          const changes: string[] = [];
          let fixed = b;
          if (fixed.includes("${!Leads.Industry}")) {
            fixed = fixed.replace(/\$\{!Leads\.Industry\}/g, "${!Leads.Professional_Designation}");
            changes.push("Body: replaced ${!Leads.Industry} with ${!Leads.Professional_Designation}");
          }
          if (fixed.includes("${!Leads.amyloidosistype}")) {
            fixed = fixed.replace(/<tr[^>]*>(?:(?!<\/tr>)[\s\S])*\$\{!Leads\.amyloidosistype\}(?:(?!<\/tr>)[\s\S])*<\/tr>/gi, "");
            changes.push("Body: removed deactivated amyloidosistype field row");
          }
          return { fixed, changes };
        }
      },
      {
        id: "6999043000000903027",
        name: "Non-Member Contact Email Template",
        fixSubject: (s: string) => {
          const changes: string[] = [];
          let fixed = s;
          if (fixed.startsWith("? ") || fixed.startsWith("?")) {
            fixed = fixed.replace(/^\?\s*/, "");
            changes.push("Subject: removed leading '?' corruption");
          }
          if (fixed.includes("{{Last_Name}}")) {
            fixed = fixed.replace(/\{\{Last_Name\}\}/g, "${!Leads.Last_Name}");
            changes.push("Subject: fixed {{Last_Name}} → ${!Leads.Last_Name}");
          }
          return { fixed, changes };
        },
        fixBody: (b: string) => {
          const changes: string[] = [];
          let fixed = b;
          const simpleReplacements: Array<[string, string]> = [
            ["{{Last_Name}}", "${!Leads.Last_Name}"],
            ["{{Email}}", "${!Leads.Email}"],
            ["{{Description}}", "${!Leads.Description}"],
          ];
          for (const [from, to] of simpleReplacements) {
            if (fixed.includes(from)) {
              fixed = fixed.split(from).join(to);
              changes.push(`Body: fixed ${from} → ${to}`);
            }
          }
          for (const field of ["{{RECORD_ID}}", "{{CURRENT_DATE}}", "{{CURRENT_TIME}}"]) {
            if (fixed.includes(field)) {
              const escaped = field.replace(/[{}]/g, "\\$&");
              fixed = fixed.replace(new RegExp(`<tr[^>]*>(?:(?!</tr>)[\\s\\S])*${escaped}(?:(?!</tr>)[\\s\\S])*</tr>`, "gi"), "");
              changes.push(`Body: removed ${field} row`);
            }
          }
          return { fixed, changes };
        }
      },
      {
        id: "6999043000000903013",
        name: "CAS Registration Email Template",
        fixSubject: (s: string) => {
          const changes: string[] = [];
          let fixed = s;
          if (fixed.includes("{{Last_Name}}") || fixed.includes("{{Industry}}")) {
            fixed = fixed
              .replace(/\{\{Last_Name\}\}/g, "${!Leads.Last_Name}")
              .replace(/\{\{Industry\}\}/g, "${!Leads.Professional_Designation}");
            changes.push("Subject: fixed {{Last_Name}} and {{Industry}} to correct Zoho syntax and field");
          }
          return { fixed, changes };
        },
        fixBody: (b: string) => {
          const changes: string[] = [];
          let fixed = b;
          const simpleReplacements: Array<[string, string]> = [
            ["{{Last_Name}}", "${!Leads.Last_Name}"],
            ["{{Email}}", "${!Leads.Email}"],
            ["{{Industry}}", "${!Leads.Professional_Designation}"],
            ["{{Description}}", "${!Leads.Description}"],
            ["{{Company}}", "${!Leads.Company}"],
            ["{{CAS_Communications}}", "${!Leads.CAS_Communications}"],
            ["{{Services_Map_Inclusion}}", "${!Leads.Services_Map_Inclusion}"],
          ];
          for (const [from, to] of simpleReplacements) {
            if (fixed.includes(from)) {
              fixed = fixed.split(from).join(to);
              changes.push(`Body: fixed ${from} → ${to}`);
            }
          }
          for (const field of ["{{RECORD_ID}}", "{{CURRENT_DATE}}", "{{CURRENT_TIME}}"]) {
            if (fixed.includes(field)) {
              const escaped = field.replace(/[{}]/g, "\\$&");
              fixed = fixed.replace(new RegExp(`<tr[^>]*>(?:(?!</tr>)[\\s\\S])*${escaped}(?:(?!</tr>)[\\s\\S])*</tr>`, "gi"), "");
              changes.push(`Body: removed ${field} row`);
            }
          }
          return { fixed, changes };
        }
      }
    ];

    const results: Array<{ name: string; fixed: boolean; changes: string[]; error?: string }> = [];
    const accessToken = await this.getAccessToken();
    const authHeader = `Zoho-oauthtoken ${accessToken}`;

    for (const t of templates) {
      const allChanges: string[] = [];
      try {
        const getResp = await fetch(`${this.baseUrl}/settings/email_templates/${t.id}`, {
          headers: { Authorization: authHeader }
        });
        if (!getResp.ok) {
          results.push({ name: t.name, fixed: false, changes: [], error: `GET failed with status ${getResp.status}` });
          continue;
        }
        const getData = await getResp.json();
        const current = getData?.email_templates?.[0];
        if (!current) {
          results.push({ name: t.name, fixed: false, changes: [], error: "Template not found in Zoho response" });
          continue;
        }

        const subjectResult = t.fixSubject(current.subject || "");
        const bodyResult = t.fixBody(current.mail_content || current.content || "");

        allChanges.push(...subjectResult.changes, ...bodyResult.changes);

        if (allChanges.length === 0) {
          console.log(`[Fix Templates] ✅ ${t.name} — already clean, no changes needed`);
          results.push({ name: t.name, fixed: true, changes: ["No changes needed — already correct"] });
          continue;
        }

        const putResp = await fetch(`${this.baseUrl}/settings/email_templates/${t.id}`, {
          method: "PUT",
          headers: { Authorization: authHeader, "Content-Type": "application/json" },
          body: JSON.stringify({
            email_templates: [
              {
                name: current.name,
                subject: subjectResult.fixed,
                mail_content: bodyResult.fixed
              }
            ]
          })
        });

        const putData = await putResp.json();
        const success = putData?.email_templates?.[0]?.status === "success" || putData?.email_templates?.[0]?.id;
        if (success) {
          console.log(`[Fix Templates] ✅ ${t.name} — ${allChanges.length} fix(es) applied`);
          results.push({ name: t.name, fixed: true, changes: allChanges });
        } else {
          const errMsg = putData?.email_templates?.[0]?.message || JSON.stringify(putData);
          console.error(`[Fix Templates] ❌ ${t.name} — Zoho rejected update: ${errMsg}`);
          results.push({ name: t.name, fixed: false, changes: allChanges, error: `Zoho rejected: ${errMsg}` });
        }
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        console.error(`[Fix Templates] ❌ ${t.name} — Exception: ${errMsg}`);
        results.push({ name: t.name, fixed: false, changes: allChanges, error: errMsg });
      }
    }

    return results;
  }

  async createWorkflowRules(): Promise<Array<{ name: string; created: boolean; id?: string; error?: string; rawResponse?: any }>> {
    const accessToken = await this.getAccessToken();
    const authHeader = `Zoho-oauthtoken ${accessToken}`;
    const baseUrl = this.baseUrl;

    const TEMPLATE_IDS = {
      casOnlyAdmin:    "6999043000000903013",
      casAndCannAdmin: "6999043000000903020",
      nonMemberAdmin:  "6999043000000903027",
      casWelcome:      "6999043000001079001",
      cannWelcome:     "6999043000001079008",
    };

    const ADMIN_EMAILS = ["CAS@amyloid.ca", "vasi.karan@teampumpkin.com"];
    const CANN_ADMIN_EMAILS = ["CAS@amyloid.ca", "CANN@amyloid.ca", "vasi.karan@teampumpkin.com"];

    const makeAdminRecipient = (emails: string[]) => ({
      type: "emails",
      details: { emails }
    });

    const LEAD_EMAIL_RECIPIENT = {
      type: "merge_field",
      details: { api_name: "${!Leads.Email}" }
    };

    const createEmailNotification = async (notifName: string, templateId: string, toRecipients: object[]) => {
      const payload = {
        email_notifications: [{
          name: notifName,
          feature_type: "workflow",
          template: { id: templateId },
          module: { api_name: "Leads" },
          recipients: { to: toRecipients }
        }]
      };
      const resp = await fetch(`${baseUrl}/settings/automation/email_notifications`, {
        method: "POST",
        headers: { Authorization: authHeader, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await resp.json() as any;
      const notif = data?.email_notifications?.[0];
      if (notif?.status === "success" && notif?.details?.id) {
        console.log(`[Workflow Rules] ✅ Email notification created: "${notifName}" (ID: ${notif.details.id})`);
        return notif.details.id as string;
      }
      const errMsg = notif?.message || JSON.stringify(data).substring(0, 300);
      throw new Error(`Failed to create email notification "${notifName}": ${errMsg}`);
    };

    const createWorkflowRule = async (
      ruleName: string,
      description: string,
      criteriaGroup: object[],
      groupOperator: string,
      notificationIds: string[]
    ) => {
      const criteriaDetails = criteriaGroup.length > 0
        ? { criteria: { group_operator: groupOperator, group: criteriaGroup } }
        : null;

      const payload = {
        workflow_rules: [{
          name: ruleName,
          description,
          module: { api_name: "Leads" },
          execute_when: {
            type: "create",
            details: { trigger_module: { api_name: "Leads" } }
          },
          conditions: notificationIds.map((id, idx) => ({
            sequence_number: idx + 1,
            criteria_details: criteriaDetails,
            instant_actions: {
              actions: [{ id, type: "email_notifications" }]
            },
            scheduled_actions: null
          }))
        }]
      };

      console.log(`[Workflow Rules] Payload for "${ruleName}":`, JSON.stringify(payload, null, 2));
      const resp = await fetch(`${baseUrl}/settings/automation/workflow_rules`, {
        method: "POST",
        headers: { Authorization: authHeader, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await resp.json() as any;
      console.log(`[Workflow Rules] Response for "${ruleName}":`, JSON.stringify(data, null, 2));
      return data;
    };

    const results: Array<{ name: string; created: boolean; id?: string; error?: string; rawResponse?: any }> = [];

    const ruleDefs = [
      {
        name: "CAS New Lead - CAS Only Registration",
        description: "Fires when a new lead registers for CAS membership only (not CANN). Notifies admin team and sends welcome email to registrant.",
        criteriaGroup: [
          { comparator: "equal", field: { api_name: "CAS_Member" }, type: "value", value: "true" },
          { comparator: "equal", field: { api_name: "CANN_Member" }, type: "value", value: "false" },
        ],
        groupOperator: "AND",
        notifications: [
          { name: "CAS Admin Notif - CAS Only",   templateId: TEMPLATE_IDS.casOnlyAdmin, to: [makeAdminRecipient(ADMIN_EMAILS)] },
          { name: "CAS Welcome Email - CAS Only",  templateId: TEMPLATE_IDS.casWelcome,   to: [LEAD_EMAIL_RECIPIENT] },
        ]
      },
      {
        name: "CAS New Lead - CAS and CANN Registration",
        description: "Fires when a new lead registers for both CAS and CANN membership. Notifies admin team and sends welcome emails to registrant.",
        criteriaGroup: [
          { comparator: "equal", field: { api_name: "CAS_Member" }, type: "value", value: "true" },
          { comparator: "equal", field: { api_name: "CANN_Member" }, type: "value", value: "true" },
        ],
        groupOperator: "AND",
        notifications: [
          { name: "CAS Admin Notif - CAS & CANN",  templateId: TEMPLATE_IDS.casAndCannAdmin, to: [makeAdminRecipient(CANN_ADMIN_EMAILS)] },
          { name: "CAS Welcome Email - CAS & CANN", templateId: TEMPLATE_IDS.casWelcome,      to: [LEAD_EMAIL_RECIPIENT] },
          { name: "CANN Welcome Email - CAS & CANN",templateId: TEMPLATE_IDS.cannWelcome,     to: [LEAD_EMAIL_RECIPIENT] },
        ]
      },
      {
        name: "CAS New Lead - Non-Member Inquiry",
        description: "Fires when a new lead submits a contact inquiry without requesting membership. Notifies admin team.",
        criteriaGroup: [
          { comparator: "equal", field: { api_name: "Record_Type" }, type: "value", value: "Inquiry" },
        ],
        groupOperator: "AND",
        notifications: [
          { name: "CAS Admin Notif - Non-Member",  templateId: TEMPLATE_IDS.nonMemberAdmin, to: [makeAdminRecipient(ADMIN_EMAILS)] },
        ]
      }
    ];

    for (const rule of ruleDefs) {
      try {
        console.log(`[Workflow Rules] Creating email notifications for: ${rule.name}...`);
        const notifIds: string[] = [];
        for (const notif of rule.notifications) {
          const id = await createEmailNotification(notif.name, notif.templateId, notif.to);
          notifIds.push(id);
        }

        console.log(`[Workflow Rules] Creating rule: ${rule.name} with ${notifIds.length} email action(s)...`);
        const data = await createWorkflowRule(rule.name, rule.description, rule.criteriaGroup, rule.groupOperator, notifIds);
        const ruleResult = data?.workflow_rules?.[0];

        if (ruleResult?.status === "success" || ruleResult?.details?.id) {
          const ruleId = ruleResult?.id || ruleResult?.details?.id;
          console.log(`[Workflow Rules] ✅ Rule created: ${rule.name} (ID: ${ruleId})`);
          results.push({ name: rule.name, created: true, id: ruleId });
        } else {
          const errMsg = ruleResult?.message || JSON.stringify(data).substring(0, 300);
          console.error(`[Workflow Rules] ❌ Rule failed: ${rule.name} — ${errMsg}`);
          results.push({ name: rule.name, created: false, error: errMsg, rawResponse: data });
        }
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        console.error(`[Workflow Rules] ❌ Exception for ${rule.name}: ${errMsg}`);
        results.push({ name: rule.name, created: false, error: errMsg });
      }
    }

    return results;
  }
}

export const zohoCRMService = new ZohoCRMService();

/**
 * Centralized CAS/CANN Field Mapping Utility
 * 
 * Single source of truth for mapping form submission data to Zoho CRM fields.
 * Used by: zoho-sync-worker (fallback), admin batch-update, admin re-sync orphans.
 * 
 * Business Rules Enforced:
 * 1. CANN→CAS dependency: CANN_Member=true forces CAS_Member=true
 * 2. Record_Type classification: "Member" vs "Inquiry" for email segmentation
 * 3. Lead_Source differentiation: Non-member inquiries get distinct source
 * 4. Consent fields always mapped to both standard and legacy Zoho field names
 */

export interface CentralizedMappingOptions {
  formData: Record<string, any>;
  formName: string;
  layoutId?: string;
  isExcelImport?: boolean;
  isResync?: boolean;
}

export interface CentralizedMappingResult {
  zohoData: Record<string, any>;
  recordType: "Member" | "Inquiry";
  leadSource: string;
  appliedRules: string[];
}

function cleanAndTruncate(val: string, maxLen: number): string {
  if (!val) return val;
  return val.replace(/\r\n|\r|\n/g, ', ').substring(0, maxLen);
}

function sanitizePhone(phone: string): string | undefined {
  if (!phone) return undefined;
  let cleaned = phone.toString().split(/\s*[xX]\s*|\s*ext\.?\s*/i)[0];
  cleaned = cleaned.replace(/[^\d\-\+\s\(\)]/g, '').trim();
  return cleaned.substring(0, 30) || undefined;
}

export function buildCentralizedZohoData(options: CentralizedMappingOptions): CentralizedMappingResult {
  const { formData, formName, layoutId, isExcelImport = false, isResync = false } = options;
  const appliedRules: string[] = [];

  const zohoData: Record<string, any> = {};

  if (layoutId) {
    zohoData.Layout = { id: layoutId };
  }

  // --- Standard identity fields ---
  if (formData.fullName) zohoData.Last_Name = formData.fullName;
  if (formData.email) zohoData.Email = formData.email;

  // --- Professional info ---
  if (formData.discipline) {
    zohoData.Professional_Designation = formData.discipline;
  }

  // --- Institution (map to both Company and Institution_Name) ---
  if (formData.institution) {
    zohoData.Company = cleanAndTruncate(formData.institution, 100);
    zohoData.Institution_Name = cleanAndTruncate(formData.institution, 100);
  }

  // --- Subspecialty ---
  if (formData.subspecialty) {
    zohoData.subspecialty = formData.subspecialty.toString().substring(0, 50);
  }

  // --- Amyloidosis type (Amyloidosis_Type is the active field; amyloidosistype is deactivated — do NOT send it) ---
  if (formData.amyloidosisType) {
    zohoData.Amyloidosis_Type = formData.amyloidosisType;
  }

  // --- Address/contact info ---
  if (formData.institutionAddress) zohoData.institutionaddress = cleanAndTruncate(formData.institutionAddress, 50);
  if (formData.institutionPhone) zohoData.institutionphone = sanitizePhone(formData.institutionPhone);
  if (formData.institutionFax) zohoData.institutionfax = sanitizePhone(formData.institutionFax);
  if (formData.province) zohoData.province = formData.province;

  // --- Membership flags with CANN→CAS dependency enforcement ---
  const wantsCAS = formData.wantsMembership === 'Yes' || formData.wantsMembership === true;
  const wantsCANN = formData.wantsCANNMembership === 'Yes' || formData.wantsCANNMembership === true;

  if (formData.wantsMembership !== undefined || formData.wantsCANNMembership !== undefined) {
    let casMember = wantsCAS;

    // BUSINESS RULE: CANN membership implies CAS membership
    if (wantsCANN && !casMember) {
      casMember = true;
      appliedRules.push('CANN→CAS dependency: forced CAS_Member=true because CANN_Member=true');
    }

    zohoData.CAS_Member = casMember;
    zohoData.wantsmembership = casMember;
    zohoData.CANN_Member = wantsCANN;
  }

  // --- Record_Type classification ---
  const isMember = wantsCAS || wantsCANN;
  const recordType: "Member" | "Inquiry" = isMember ? "Member" : "Inquiry";
  zohoData.Record_Type = recordType;
  appliedRules.push(`Record_Type set to "${recordType}"`);

  // --- Lead_Source ---
  let leadSource: string;
  if (isExcelImport && isResync) {
    leadSource = 'Excel Import - Re-synced';
  } else if (isExcelImport) {
    leadSource = formName;
  } else if (!isMember) {
    leadSource = 'Website - Contact Inquiry';
    appliedRules.push('Lead_Source set to "Website - Contact Inquiry" for non-member');
  } else {
    leadSource = `Website - ${formName}`;
  }
  zohoData.Lead_Source = leadSource;

  // --- Communication consent fields (mapped to BOTH standard and legacy field names) ---
  if (formData.wantsCommunications !== undefined) {
    const wantsCom = formData.wantsCommunications === 'Yes' || formData.wantsCommunications === true;
    zohoData.CAS_Communications = wantsCom ? 'Yes' : 'No';
    zohoData.wantscommunications = wantsCom;
    zohoData.communicationconsent = wantsCom;
  }

  if (formData.cannCommunications !== undefined) {
    const wantsCANNCom = formData.cannCommunications === 'Yes' || formData.cannCommunications === true;
    zohoData.CANN_Communications = wantsCANNCom ? 'Yes' : 'No';
    zohoData.CANN_Communication_Consent = wantsCANNCom ? 'Yes' : 'No';
  }

  // --- Services map inclusion consent ---
  if (formData.wantsServicesMapInclusion !== undefined) {
    const wantsMap = formData.wantsServicesMapInclusion === 'Yes' || formData.wantsServicesMapInclusion === true;
    zohoData.Services_Map_Inclusion = wantsMap ? 'Yes' : 'No';
    zohoData.wantsservicesmapinclusion = wantsMap;
    zohoData.servicesmapconsent = wantsMap;
  }

  // --- Non-member inquiry fields ---
  if (!isMember) {
    if (formData.noMemberName) zohoData.Last_Name = formData.noMemberName;
    if (formData.noMemberEmail) zohoData.Email = formData.noMemberEmail;
    if (formData.noMemberMessage) zohoData.Description = formData.noMemberMessage;
  }

  // --- Source form tracking ---
  zohoData.Source_Form = formName;

  return {
    zohoData,
    recordType,
    leadSource,
    appliedRules,
  };
}