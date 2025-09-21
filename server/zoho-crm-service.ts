import { FieldMapping, InsertFieldMapping } from "@shared/schema";

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
  private accessToken: string;
  private orgId: string;

  constructor() {
    // Get configuration from environment variables
    this.accessToken = process.env.ZOHO_ACCESS_TOKEN || "";
    this.orgId = process.env.ZOHO_ORG_ID || "";
    this.baseUrl = "https://www.zohoapis.com/crm/v2";

    if (!this.accessToken) {
      console.warn("ZOHO_ACCESS_TOKEN not found in environment variables");
    }
    if (!this.orgId) {
      console.warn("ZOHO_ORG_ID not found in environment variables");
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
    };

    if (this.orgId) {
      headers["orgId"] = this.orgId;
    }

    try {
      console.log(`[Zoho API] ${method} ${url}`);
      
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error(`[Zoho API Error] ${response.status}:`, responseData);
        throw new Error(`Zoho API Error ${response.status}: ${responseData.message || 'Unknown error'}`);
      }

      return responseData as T;
    } catch (error) {
      console.error(`[Zoho API Request Failed] ${method} ${url}:`, error);
      throw error;
    }
  }

  // Metadata API methods
  async getModuleFields(moduleName: string): Promise<ZohoField[]> {
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

  async createCustomField(moduleName: string, fieldData: ZohoFieldCreateRequest): Promise<ZohoField> {
    try {
      const response = await this.makeRequest<ZohoApiResponse<ZohoField>>(
        `/settings/fields?module=${moduleName}`,
        "POST",
        { fields: [fieldData] }
      );

      if (response.data && response.data.length > 0) {
        return response.data[0];
      } else {
        throw new Error("Failed to create field - no data returned");
      }
    } catch (error) {
      console.error(`Failed to create field ${fieldData.api_name} in module ${moduleName}:`, error);
      throw error;
    }
  }

  // Core API methods
  async createRecord(moduleName: string, recordData: ZohoRecord): Promise<ZohoRecord> {
    try {
      const response = await this.makeRequest<ZohoApiResponse<ZohoRecord>>(
        `/${moduleName}`,
        "POST",
        { data: [recordData] }
      );

      if (response.data && response.data.length > 0) {
        return response.data[0];
      } else {
        throw new Error("Failed to create record - no data returned");
      }
    } catch (error) {
      console.error(`Failed to create record in module ${moduleName}:`, error);
      throw error;
    }
  }

  async updateRecord(moduleName: string, recordId: string, recordData: ZohoRecord): Promise<ZohoRecord> {
    try {
      const response = await this.makeRequest<ZohoApiResponse<ZohoRecord>>(
        `/${moduleName}/${recordId}`,
        "PUT",
        { data: [recordData] }
      );

      if (response.data && response.data.length > 0) {
        return response.data[0];
      } else {
        throw new Error("Failed to update record - no data returned");
      }
    } catch (error) {
      console.error(`Failed to update record ${recordId} in module ${moduleName}:`, error);
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
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      // Try to fetch user info as a simple test
      await this.makeRequest("/users?type=CurrentUser");
      return { 
        success: true, 
        message: "Successfully connected to Zoho CRM" 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to connect to Zoho CRM: ${error instanceof Error ? error.message : 'Unknown error'}` 
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