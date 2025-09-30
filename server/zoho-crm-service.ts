import { FieldMapping, InsertFieldMapping } from "@shared/schema";
import { oauthService } from "./oauth-service";
import { dedicatedTokenManager } from "./dedicated-token-manager";

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
   */
  private async getAccessToken(): Promise<string> {
    // Use dedicated token manager with proactive health check
    const health = await dedicatedTokenManager.checkTokenHealth('zoho_crm');
    
    if (!health.isValid) {
      const errorMsg = health.error || 'Token is invalid or expired';
      console.error(`[Zoho CRM] Token health check failed: ${errorMsg}`);
      throw new Error(`No valid Zoho CRM access token available. Please authenticate via /oauth/zoho/connect`);
    }

    if (health.needsRefresh && health.isValid) {
      console.log('[Zoho CRM] Proactively refreshing token before API call');
      const refreshed = await dedicatedTokenManager.forceRefreshToken('zoho_crm');
      if (refreshed) {
        return refreshed.accessToken;
      }
    }
    
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
        console.log(`[Zoho API] OAuth error (401), attempting token refresh and retry`);
        // Force token refresh by clearing cache
        await oauthService.getValidToken('zoho_crm');
        return this.makeRequest(endpoint, method, body, retryCount + 1);
      }

      if (!response.ok) {
        const errorDetails = this.extractErrorDetails(responseData, response.status);
        console.error(`[Zoho API v8 Error] ${response.status}:`, errorDetails);
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
      return response.data || [];
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

      // Get layout information if not provided
      if (!fieldData.layouts) {
        const layoutInfo = await this.getDefaultLayoutForModule(moduleName);
        fieldData.layouts = [{
          id: layoutInfo.layoutId,
          section_id: layoutInfo.sectionId
        }];
      }

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

      const response = await this.makeRequest<ZohoApiResponse<ZohoField>>(
        `/settings/fields?module=${moduleName}`,
        "POST",
        { fields: [fieldData] }
      );

      if (response.data && response.data.length > 0) {
        return response.data[0];
      } else {
        throw new Error("Failed to create field - no data returned from v8 API");
      }
    } catch (error) {
      console.error(`Failed to create field ${fieldData.api_name} in module ${moduleName} using v8 API:`, error);
      throw error;
    }
  }

  // Core API methods
  async createRecord(moduleName: string, recordData: ZohoRecord): Promise<ZohoRecord> {
    try {
      // v8 API best practice: validate record data
      if (!recordData || Object.keys(recordData).length === 0) {
        throw new Error("Record data cannot be empty");
      }

      const response = await this.makeRequest<ZohoApiResponse<ZohoRecord>>(
        `/${moduleName}`,
        "POST",
        { data: [recordData] }
      );

      if (response.data && response.data.length > 0) {
        const createdRecord = response.data[0];
        console.log(`[Zoho v8] Successfully created record in ${moduleName}:`, createdRecord.id);
        return createdRecord;
      } else {
        throw new Error("Failed to create record - no data returned from v8 API");
      }
    } catch (error) {
      console.error(`Failed to create record in module ${moduleName} using v8 API:`, error);
      throw error;
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

  /**
   * Get all fields for a specific module (for metadata caching)
   */
  async getFieldsForModule(moduleName: string): Promise<ZohoField[]> {
    try {
      const response = await this.makeRequest<ZohoApiResponse<ZohoField>>(
        `/settings/fields?module=${moduleName}`
      );
      return response.data || [];
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
    // Convert form field names to Zoho API names
    // Remove special characters and spaces, convert to camelCase
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
    const mappingLookup = new Map(fieldMappings.map(m => [m.fieldName, m]));

    for (const [fieldName, value] of Object.entries(formData)) {
      const mapping = mappingLookup.get(fieldName);
      
      if (mapping) {
        // Use existing mapping
        if (mapping.fieldType === "boolean") {
          zohoData[fieldName] = this.convertToBoolean(value);
        } else if (mapping.fieldType === "multiselectpicklist" && Array.isArray(value)) {
          zohoData[fieldName] = value.join(";"); // Zoho uses semicolon separator
        } else {
          zohoData[fieldName] = value;
        }
      } else {
        // New field - convert based on detected type
        const zohoFieldName = this.convertToZohoFieldName(fieldName);
        const fieldType = this.detectFieldType(value, fieldName);
        
        if (fieldType === "boolean") {
          zohoData[zohoFieldName] = this.convertToBoolean(value);
        } else if (fieldType === "multiselectpicklist" && Array.isArray(value)) {
          zohoData[zohoFieldName] = value.join(";");
        } else {
          zohoData[zohoFieldName] = value;
        }
      }
    }

    return zohoData;
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