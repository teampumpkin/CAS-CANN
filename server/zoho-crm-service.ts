import { FieldMapping, InsertFieldMapping } from "@shared/schema";
import { oauthService } from "./oauth-service";

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
    const token = await oauthService.getValidToken('zoho_crm');
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
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    // Get a valid access token (auto-refreshes if needed)
    const accessToken = await this.getAccessToken();
    
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    if (this.orgId) {
      headers["orgId"] = this.orgId;
    }

    console.log(`[${requestId}] 🔄 Zoho API ${method} ${endpoint}`, {
      url,
      method,
      hasBody: !!body,
      bodySize: body ? JSON.stringify(body).length : 0,
      retryCount,
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken.substring(0, 10)}...` // Mask token for security
      }
    });

    if (body && Object.keys(body).length > 0) {
      console.log(`[${requestId}] 📤 Request payload:`, JSON.stringify(body, null, 2));
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseData = await response.json();
      const duration = Date.now() - startTime;

      // Handle rate limiting (429) with exponential backoff
      if (response.status === 429 && retryCount < 3) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, retryCount) * 1000;
        console.log(`[${requestId}] ⏱️ Rate limited, retrying after ${delay}ms (attempt ${retryCount + 1}/3)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeRequest(endpoint, method, body, retryCount + 1);
      }

      console.log(`[${requestId}] 📥 Response received (${response.status}) in ${duration}ms:`, {
        status: response.status,
        statusText: response.statusText,
        duration,
        responseSize: JSON.stringify(responseData).length,
        contentType: response.headers.get('content-type'),
        hasData: !!responseData.data,
        dataCount: Array.isArray(responseData.data) ? responseData.data.length : 0
      });

      if (!response.ok) {
        const errorDetails = this.extractErrorDetails(responseData, response.status);
        console.error(`[${requestId}] ❌ Zoho API Error ${response.status}:`, {
          ...errorDetails,
          fullResponse: responseData,
          endpoint,
          method,
          duration
        });
        throw new Error(`Zoho API v8 Error ${response.status}: ${errorDetails.message}`);
      }

      console.log(`[${requestId}] ✅ Success:`, {
        endpoint,
        method,
        duration,
        success: true,
        dataType: responseData.data ? (Array.isArray(responseData.data) ? 'array' : 'object') : 'none'
      });

      return responseData as T;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${requestId}] 💥 Request failed after ${duration}ms:`, {
        endpoint,
        method,
        error: error instanceof Error ? error.message : String(error),
        duration,
        retryCount
      });
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
    const operationId = `fields_${moduleName}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const startTime = Date.now();
    
    console.log(`[${operationId}] 🔍 Fetching fields for module: ${moduleName}`);
    
    try {
      const response = await this.makeRequest<ZohoApiResponse<ZohoField>>(
        `/settings/fields?module=${moduleName}`
      );
      
      const fields = response.data || [];
      const duration = Date.now() - startTime;
      
      console.log(`[${operationId}] ✅ Fields retrieved successfully (${duration}ms):`, {
        module: moduleName,
        totalFields: fields.length,
        customFields: fields.filter(f => f.custom_field).length,
        standardFields: fields.filter(f => !f.custom_field).length,
        requiredFields: fields.filter(f => f.required).length,
        duration,
        fieldTypes: {
          text: fields.filter(f => f.data_type === 'text').length,
          email: fields.filter(f => f.data_type === 'email').length,
          phone: fields.filter(f => f.data_type === 'phone').length,
          picklist: fields.filter(f => f.data_type === 'picklist').length,
          other: fields.filter(f => !['text', 'email', 'phone', 'picklist'].includes(f.data_type)).length
        }
      });
      
      return fields;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${operationId}] 💥 Failed to fetch fields (${duration}ms):`, {
        module: moduleName,
        error: error instanceof Error ? error.message : String(error),
        duration
      });
      throw error;
    }
  }

  async createCustomField(moduleName: string, fieldData: ZohoFieldCreateRequest): Promise<ZohoField> {
    const operationId = `field_${moduleName}_${fieldData.api_name}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const startTime = Date.now();
    
    console.log(`[${operationId}] 🔧 Creating custom field in ${moduleName}:`, {
      module: moduleName,
      fieldName: fieldData.api_name,
      fieldLabel: fieldData.field_label,
      dataType: fieldData.data_type,
      required: fieldData.required,
      hasPicklistValues: !!(fieldData.pick_list_values && fieldData.pick_list_values.length > 0),
      picklistValueCount: fieldData.pick_list_values?.length || 0
    });
    
    try {
      // v8 API best practice: validate required fields before sending
      if (!fieldData.api_name || !fieldData.field_label || !fieldData.data_type) {
        console.error(`[${operationId}] ❌ Validation failed: Missing required field data`, {
          hasApiName: !!fieldData.api_name,
          hasFieldLabel: !!fieldData.field_label,
          hasDataType: !!fieldData.data_type
        });
        throw new Error("Missing required field data: api_name, field_label, and data_type are required");
      }

      console.log(`[${operationId}] ✅ Validation passed, creating field in Zoho...`);

      const response = await this.makeRequest<ZohoApiResponse<ZohoField>>(
        `/settings/fields?module=${moduleName}`,
        "POST",
        { fields: [fieldData] }
      );

      const duration = Date.now() - startTime;

      if (response.data && response.data.length > 0) {
        const createdField = response.data[0];
        console.log(`[${operationId}] 🎉 Field created successfully (${duration}ms):`, {
          fieldId: createdField.id,
          fieldName: createdField.api_name,
          fieldLabel: createdField.field_label,
          dataType: createdField.data_type,
          module: moduleName,
          duration,
          isCustomField: createdField.custom_field
        });
        return createdField;
      } else {
        console.error(`[${operationId}] ❌ No field data returned:`, {
          response,
          duration,
          module: moduleName,
          fieldName: fieldData.api_name
        });
        throw new Error("Failed to create field - no data returned from v8 API");
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${operationId}] 💥 Field creation failed (${duration}ms):`, {
        module: moduleName,
        fieldName: fieldData.api_name,
        error: error instanceof Error ? error.message : String(error),
        duration,
        fieldData: {
          ...fieldData,
          // Remove pick_list_values from error log to keep it concise
          pick_list_values: fieldData.pick_list_values ? `[${fieldData.pick_list_values.length} values]` : undefined
        }
      });
      throw error;
    }
  }

  // Core API methods
  async createRecord(moduleName: string, recordData: ZohoRecord): Promise<ZohoRecord> {
    const operationId = `create_${moduleName}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const startTime = Date.now();
    
    console.log(`[${operationId}] 🚀 Creating record in ${moduleName}:`, {
      module: moduleName,
      fieldCount: Object.keys(recordData).length,
      fields: Object.keys(recordData),
      hasRequiredFields: {
        hasLastName: !!recordData.Last_Name,
        hasEmail: !!recordData.Email,
        hasPhone: !!recordData.Phone,
        hasSourceForm: !!recordData.Source_Form
      }
    });

    try {
      // v8 API best practice: validate record data
      if (!recordData || Object.keys(recordData).length === 0) {
        console.error(`[${operationId}] ❌ Validation failed: Record data cannot be empty`);
        throw new Error("Record data cannot be empty");
      }

      console.log(`[${operationId}] ✅ Validation passed, sending to Zoho API...`);

      const response = await this.makeRequest<ZohoApiResponse<ZohoRecord>>(
        `/${moduleName}`,
        "POST",
        { data: [recordData] }
      );

      const duration = Date.now() - startTime;

      if (response.data && response.data.length > 0) {
        const createdRecord = response.data[0];
        console.log(`[${operationId}] 🎉 Record created successfully (${duration}ms):`, {
          recordId: createdRecord.id,
          module: moduleName,
          duration,
          fieldsCreated: Object.keys(recordData).length,
          leadDetails: {
            name: recordData.Last_Name || recordData.First_Name,
            email: recordData.Email,
            source: recordData.Source_Form
          }
        });
        return createdRecord;
      } else {
        console.error(`[${operationId}] ❌ No data returned from API:`, {
          response,
          duration,
          module: moduleName
        });
        throw new Error("Failed to create record - no data returned from v8 API");
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${operationId}] 💥 Record creation failed (${duration}ms):`, {
        module: moduleName,
        error: error instanceof Error ? error.message : String(error),
        duration,
        fieldCount: Object.keys(recordData).length,
        recordData: {
          ...recordData,
          // Mask sensitive data in logs
          Email: recordData.Email ? `${recordData.Email.substring(0, 3)}***` : undefined,
          Phone: recordData.Phone ? `***${recordData.Phone.slice(-4)}` : undefined
        }
      });
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