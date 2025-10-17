/**
 * Field Mapping Utilities
 * 
 * Maps source file columns to Zoho CRM fields
 */

import { getFieldMappings } from '../modules';

export interface MappingResult {
  mapped: any[];
  unmappedColumns: string[];
  mappingCount: number;
}

export class FieldMapper {
  /**
   * Map fields using predefined mappings
   */
  mapFields(
    records: any[],
    moduleName: 'Accounts' | 'Contacts' | 'Resources',
    customMappings?: Record<string, string>
  ): MappingResult {
    const result: MappingResult = {
      mapped: [],
      unmappedColumns: [],
      mappingCount: 0
    };

    // Get default mappings for this module
    const defaultMappings = getFieldMappings(moduleName);
    const mappings = { ...defaultMappings, ...customMappings };

    // Track which columns were mapped
    const sourceColumns = new Set<string>();
    
    for (const record of records) {
      const mappedRecord: any = {};

      for (const [sourceField, value] of Object.entries(record)) {
        sourceColumns.add(sourceField);

        // Map field if mapping exists
        if (mappings[sourceField]) {
          mappedRecord[mappings[sourceField]] = value;
          result.mappingCount++;
        } else {
          // Pass through unmapped fields as-is (in case they're already correct)
          mappedRecord[sourceField] = value;
        }
      }

      result.mapped.push(mappedRecord);
    }

    // Identify unmapped columns
    result.unmappedColumns = Array.from(sourceColumns).filter(
      col => !mappings[col]
    );

    if (result.unmappedColumns.length > 0) {
      console.log(`[FieldMapper] Warning: ${result.unmappedColumns.length} unmapped columns:`, 
        result.unmappedColumns.join(', '));
    }

    console.log(`[FieldMapper] Mapped ${result.mapped.length} records using ${Object.keys(mappings).length} field mappings`);

    return result;
  }

  /**
   * Auto-detect and suggest mappings based on column names
   */
  suggestMappings(
    headers: string[],
    moduleName: 'Accounts' | 'Contacts' | 'Resources'
  ): Record<string, string> {
    const suggestions: Record<string, string> = {};
    const defaultMappings = getFieldMappings(moduleName);

    for (const header of headers) {
      // Exact match
      if (defaultMappings[header]) {
        suggestions[header] = defaultMappings[header];
        continue;
      }

      // Fuzzy match (case-insensitive, spaces/underscores ignored)
      const normalized = header.toLowerCase().replace(/[_\s-]/g, '');
      
      for (const [source, target] of Object.entries(defaultMappings)) {
        const normalizedSource = source.toLowerCase().replace(/[_\s-]/g, '');
        
        if (normalized === normalizedSource || normalized.includes(normalizedSource)) {
          suggestions[header] = target;
          break;
        }
      }
    }

    return suggestions;
  }

  /**
   * Split Full_Name into First_Name and Last_Name
   */
  splitFullName(fullName: string): { First_Name: string; Last_Name: string } {
    const parts = fullName.trim().split(/\s+/);
    
    if (parts.length === 0) {
      return { First_Name: '', Last_Name: '' };
    } else if (parts.length === 1) {
      return { First_Name: '', Last_Name: parts[0] };
    } else {
      return {
        First_Name: parts.slice(0, -1).join(' '),
        Last_Name: parts[parts.length - 1]
      };
    }
  }

  /**
   * Apply common field transformations
   */
  applyTransformations(
    record: any,
    moduleName: 'Accounts' | 'Contacts' | 'Resources'
  ): any {
    const transformed = { ...record };

    // Split Full_Name if present
    if (transformed.Full_Name && !transformed.First_Name && !transformed.Last_Name) {
      const { First_Name, Last_Name } = this.splitFullName(transformed.Full_Name);
      transformed.First_Name = First_Name;
      transformed.Last_Name = Last_Name;
      delete transformed.Full_Name;
    }

    // Ensure Last_Name exists for Contacts (Zoho requirement)
    if (moduleName === 'Contacts' && !transformed.Last_Name) {
      if (transformed.First_Name) {
        transformed.Last_Name = transformed.First_Name;
        transformed.First_Name = '';
      } else if (transformed.Email) {
        transformed.Last_Name = transformed.Email.split('@')[0];
      } else {
        transformed.Last_Name = 'Unknown';
      }
    }

    return transformed;
  }
}

// Export singleton instance
export const fieldMapper = new FieldMapper();
