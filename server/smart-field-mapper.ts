import { storage } from "./storage";
import { FieldMetadataCache } from "@shared/schema";

interface FieldMatchResult {
  formField: string;
  zohoField: string;
  matchType: "exact" | "normalized" | "similarity" | "standard";
  confidence: number;
}

interface SmartMappingResult {
  mappedFields: FieldMatchResult[];
  unmappedFields: string[];
  zohoData: Record<string, any>;
  leadSource: string;
}

const STANDARD_FIELD_MAPPINGS: Record<string, string> = {
  'fullname': 'Last_Name',
  'full_name': 'Last_Name',
  'name': 'Last_Name',
  'lastname': 'Last_Name',
  'last_name': 'Last_Name',
  'firstname': 'First_Name',
  'first_name': 'First_Name',
  'email': 'Email',
  'emailaddress': 'Email',
  'email_address': 'Email',
  'company': 'Company',
  'companyname': 'Company',
  'company_name': 'Company',
  'organization': 'Company',
  'phone': 'Phone',
  'phonenumber': 'Phone',
  'phone_number': 'Phone',
  'mobile': 'Mobile',
  'mobilenumber': 'Mobile',
  'mobile_number': 'Mobile',
  'website': 'Website',
  'city': 'City',
  'state': 'State',
  'country': 'Country',
  'description': 'Description',
  'title': 'Designation',
  'designation': 'Designation',
};

export class SmartFieldMapper {
  private zohoFieldCache: Map<string, FieldMetadataCache[]> = new Map();
  private cacheTimeout = 5 * 60 * 1000;
  private lastCacheRefresh = 0;

  async initialize(): Promise<void> {
    await this.refreshCache();
    console.log("[SmartFieldMapper] Initialized with field metadata cache");
  }

  private async refreshCache(): Promise<void> {
    const fields = await storage.getFieldMetadataCache({ zohoModule: "Leads" });
    this.zohoFieldCache.set("Leads", fields);
    this.lastCacheRefresh = Date.now();
    console.log(`[SmartFieldMapper] Cache refreshed with ${fields.length} Leads fields`);
  }

  private shouldRefreshCache(): boolean {
    return Date.now() - this.lastCacheRefresh > this.cacheTimeout;
  }

  private normalizeFieldName(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    if (s1 === s2) return 1.0;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;
    
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    if (longer.length === 0) return 1.0;
    
    let matches = 0;
    for (let i = 0; i < shorter.length; i++) {
      if (longer.includes(shorter[i])) matches++;
    }
    
    return matches / longer.length;
  }

  async findBestMatch(formField: string, zohoModule: string = "Leads"): Promise<FieldMatchResult | null> {
    if (this.shouldRefreshCache()) {
      await this.refreshCache();
    }

    const normalizedFormField = this.normalizeFieldName(formField);
    
    if (STANDARD_FIELD_MAPPINGS[normalizedFormField]) {
      return {
        formField,
        zohoField: STANDARD_FIELD_MAPPINGS[normalizedFormField],
        matchType: "standard",
        confidence: 1.0
      };
    }

    const zohoFields = this.zohoFieldCache.get(zohoModule) || [];
    
    for (const zf of zohoFields) {
      if (this.normalizeFieldName(zf.fieldApiName) === normalizedFormField) {
        return {
          formField,
          zohoField: zf.fieldApiName,
          matchType: "exact",
          confidence: 1.0
        };
      }
    }

    for (const zf of zohoFields) {
      const normalizedZoho = this.normalizeFieldName(zf.fieldApiName);
      const normalizedLabel = this.normalizeFieldName(zf.fieldLabel);
      
      if (normalizedZoho === normalizedFormField || normalizedLabel === normalizedFormField) {
        return {
          formField,
          zohoField: zf.fieldApiName,
          matchType: "normalized",
          confidence: 0.95
        };
      }
    }

    let bestMatch: FieldMatchResult | null = null;
    let bestScore = 0.6;

    for (const zf of zohoFields) {
      const apiSimilarity = this.calculateSimilarity(formField, zf.fieldApiName);
      const labelSimilarity = this.calculateSimilarity(formField, zf.fieldLabel);
      const maxSimilarity = Math.max(apiSimilarity, labelSimilarity);
      
      if (maxSimilarity > bestScore) {
        bestScore = maxSimilarity;
        bestMatch = {
          formField,
          zohoField: zf.fieldApiName,
          matchType: "similarity",
          confidence: maxSimilarity
        };
      }
    }

    return bestMatch;
  }

  async mapFormDataToZoho(
    formData: Record<string, any>,
    formName: string,
    zohoModule: string = "Leads"
  ): Promise<SmartMappingResult> {
    const mappedFields: FieldMatchResult[] = [];
    const unmappedFields: string[] = [];
    const zohoData: Record<string, any> = {};

    console.log(`[SmartFieldMapper] Auto-mapping form "${formName}" with ${Object.keys(formData).length} fields`);

    for (const [formField, value] of Object.entries(formData)) {
      if (value === null || value === undefined || value === "") {
        continue;
      }

      const match = await this.findBestMatch(formField, zohoModule);
      
      if (match && match.confidence >= 0.6) {
        mappedFields.push(match);
        zohoData[match.zohoField] = this.formatValue(value, match.zohoField);
        console.log(`[SmartFieldMapper] ✓ ${formField} → ${match.zohoField} (${match.matchType}, ${Math.round(match.confidence * 100)}%)`);
      } else {
        unmappedFields.push(formField);
        console.log(`[SmartFieldMapper] ✗ ${formField} - no match found (excluded)`);
      }
    }

    const leadSource = `Website - ${formName}`;
    zohoData.Lead_Source = leadSource;

    console.log(`[SmartFieldMapper] Result: ${mappedFields.length} mapped, ${unmappedFields.length} excluded, Lead_Source: "${leadSource}"`);

    return {
      mappedFields,
      unmappedFields,
      zohoData,
      leadSource
    };
  }

  private formatValue(value: any, zohoField: string): any {
    if (typeof value === "boolean") {
      return value;
    }
    
    if (typeof value === "string") {
      const lower = value.toLowerCase();
      if (lower === "yes" || lower === "true") return true;
      if (lower === "no" || lower === "false") return false;
    }
    
    if (Array.isArray(value)) {
      return value.join(";");
    }
    
    if (typeof value === "string" && value.length > 255) {
      console.log(`[SmartFieldMapper] ⚠️ Truncated ${zohoField} from ${value.length} to 255 chars`);
      return value.substring(0, 255);
    }
    
    return value;
  }

  async getFieldMetadataForModule(zohoModule: string = "Leads"): Promise<FieldMetadataCache[]> {
    if (this.shouldRefreshCache()) {
      await this.refreshCache();
    }
    return this.zohoFieldCache.get(zohoModule) || [];
  }
}

export const smartFieldMapper = new SmartFieldMapper();
