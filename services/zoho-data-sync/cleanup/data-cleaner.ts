/**
 * Data Cleaning Utilities
 * 
 * Handles normalization, validation, and deduplication of import data
 */

import { DataCleaningResult } from '../types';

export interface CleaningOptions {
  normalizeName?: boolean;
  normalizePhone?: boolean;
  normalizeEmail?: boolean;
  normalizePostalCode?: boolean;
  trimWhitespace?: boolean;
  removeEmptyRows?: boolean;
}

export class DataCleaner {
  private defaultOptions: CleaningOptions = {
    normalizeName: true,
    normalizePhone: true,
    normalizeEmail: true,
    normalizePostalCode: true,
    trimWhitespace: true,
    removeEmptyRows: true
  };

  constructor(private options: Partial<CleaningOptions> = {}) {
    this.options = { ...this.defaultOptions, ...options };
  }

  /**
   * Clean and normalize an array of records
   */
  cleanRecords(records: any[], sourceTag: string = 'DataSyncService'): DataCleaningResult {
    const result: DataCleaningResult = {
      originalRowCount: records.length,
      cleanedRowCount: 0,
      duplicatesRemoved: 0,
      invalidRowsSkipped: 0,
      fieldsNormalized: [],
      errors: [],
      warnings: []
    };

    const cleanedRecords: any[] = [];
    const seenKeys = new Set<string>();

    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      try {
        // Remove empty rows
        if (this.options.removeEmptyRows && this.isEmptyRow(record)) {
          result.invalidRowsSkipped++;
          continue;
        }

        // Clean the record
        const cleaned = this.cleanRecord(record, result.fieldsNormalized);

        // Add source tag
        cleaned.Tag = [sourceTag];
        cleaned.Data_Source = sourceTag;

        // Check for duplicates (basic implementation)
        const key = this.generateDedupeKey(cleaned);
        if (seenKeys.has(key)) {
          result.duplicatesRemoved++;
          result.warnings.push(`Row ${i + 1}: Duplicate record skipped (${key})`);
          continue;
        }

        seenKeys.add(key);
        cleanedRecords.push(cleaned);
        result.cleanedRowCount++;

      } catch (error) {
        result.invalidRowsSkipped++;
        result.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // Remove duplicates from fieldsNormalized array
    result.fieldsNormalized = [...new Set(result.fieldsNormalized)];

    console.log(`[DataCleaner] Cleaned ${result.cleanedRowCount}/${result.originalRowCount} records`);
    console.log(`[DataCleaner] Removed ${result.duplicatesRemoved} duplicates, skipped ${result.invalidRowsSkipped} invalid rows`);

    return { ...result, cleanedRecords } as any;
  }

  /**
   * Clean a single record
   */
  private cleanRecord(record: any, normalizedFields: string[]): any {
    const cleaned: any = {};

    for (const [key, value] of Object.entries(record)) {
      if (value === null || value === undefined || value === '') {
        continue;
      }

      let cleanValue = value;

      // Trim whitespace
      if (this.options.trimWhitespace && typeof cleanValue === 'string') {
        cleanValue = cleanValue.trim();
      }

      // Normalize based on field name/type
      if (this.options.normalizeName && this.isNameField(key)) {
        cleanValue = this.normalizePersonName(String(cleanValue));
        normalizedFields.push(key);
      } else if (this.options.normalizeEmail && this.isEmailField(key)) {
        cleanValue = this.normalizeEmail(String(cleanValue));
        normalizedFields.push(key);
      } else if (this.options.normalizePhone && this.isPhoneField(key)) {
        cleanValue = this.normalizePhone(String(cleanValue));
        normalizedFields.push(key);
      } else if (this.options.normalizePostalCode && this.isPostalCodeField(key)) {
        cleanValue = this.normalizePostalCode(String(cleanValue));
        normalizedFields.push(key);
      }

      cleaned[key] = cleanValue;
    }

    return cleaned;
  }

  /**
   * Normalize person name to Title Case
   */
  private normalizePersonName(name: string): string {
    return name
      .split(' ')
      .map(word => {
        // Handle special cases like "von", "de", "O'Brien"
        if (word.length === 0) return '';
        if (['von', 'de', 'van', 'der'].includes(word.toLowerCase())) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ')
      .trim();
  }

  /**
   * Normalize email to lowercase
   */
  private normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Normalize phone number (Canadian format)
   */
  private normalizePhone(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Canadian phone: (XXX) XXX-XXXX
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    
    return phone; // Return original if not standard format
  }

  /**
   * Normalize Canadian postal code
   */
  private normalizePostalCode(postal: string): string {
    // Remove spaces and convert to uppercase
    const cleaned = postal.replace(/\s/g, '').toUpperCase();
    
    // Canadian format: A1A 1A1
    if (/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(cleaned)) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    }
    
    return postal; // Return original if not valid format
  }

  /**
   * Generate deduplication key from record
   */
  private generateDedupeKey(record: any): string {
    // Priority: Email > Institution_ID > Account_Name > Resource_Name
    if (record.Email) return `email:${record.Email.toLowerCase()}`;
    if (record.Institution_ID) return `inst:${record.Institution_ID}`;
    if (record.Account_Name) return `account:${record.Account_Name.toLowerCase()}`;
    if (record.Resource_Name && record.Linked_Institution_ID) {
      return `resource:${record.Resource_Name}:${record.Linked_Institution_ID}`;
    }
    
    // Fallback: stringify the whole record
    return JSON.stringify(record);
  }

  /**
   * Check if row is empty (all values null/undefined/empty string)
   */
  private isEmptyRow(record: any): boolean {
    return Object.values(record).every(val => 
      val === null || val === undefined || val === ''
    );
  }

  /**
   * Field type detection helpers
   */
  private isNameField(fieldName: string): boolean {
    const nameFields = ['name', 'first', 'last', 'full'];
    return nameFields.some(f => fieldName.toLowerCase().includes(f));
  }

  private isEmailField(fieldName: string): boolean {
    return fieldName.toLowerCase().includes('email');
  }

  private isPhoneField(fieldName: string): boolean {
    const phoneFields = ['phone', 'mobile', 'tel'];
    return phoneFields.some(f => fieldName.toLowerCase().includes(f));
  }

  private isPostalCodeField(fieldName: string): boolean {
    const postalFields = ['postal', 'zip', 'code'];
    return postalFields.some(f => fieldName.toLowerCase().includes(f));
  }
}

// Export singleton instance
export const dataCleaner = new DataCleaner();
