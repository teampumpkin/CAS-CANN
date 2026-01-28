/**
 * Data Validation Utilities
 * 
 * Validates records against module schemas before import
 */

import { ModuleSchema } from '../types';
import { getModuleSchema } from '../modules';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingRequired: string[];
  invalidFields: string[];
}

export class DataValidator {
  /**
   * Validate a record against its module schema
   */
  validateRecord(
    record: any,
    moduleName: 'Accounts' | 'Contacts' | 'Resources'
  ): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      missingRequired: [],
      invalidFields: []
    };

    const schema = getModuleSchema(moduleName);

    // Check required fields
    for (const requiredField of schema.requiredFields) {
      if (!record[requiredField] || record[requiredField] === '') {
        result.missingRequired.push(requiredField);
        result.errors.push(`Missing required field: ${requiredField}`);
        result.isValid = false;
      }
    }

    // Validate email format if present
    if (record.Email && !this.isValidEmail(record.Email)) {
      result.invalidFields.push('Email');
      result.errors.push(`Invalid email format: ${record.Email}`);
      result.isValid = false;
    }

    // Validate phone format if present
    if (record.Phone && !this.isValidPhone(record.Phone)) {
      result.warnings.push(`Phone may have invalid format: ${record.Phone}`);
    }

    // Validate postal code if present
    if (record.Postal_Code && !this.isValidPostalCode(record.Postal_Code)) {
      result.warnings.push(`Postal code may have invalid format: ${record.Postal_Code}`);
    }

    // Validate Institution_ID format if present
    if (record.Institution_ID && record.Institution_ID.length > 50) {
      result.warnings.push('Institution_ID is unusually long (>50 chars)');
    }

    return result;
  }

  /**
   * Validate an array of records
   */
  validateRecords(
    records: any[],
    moduleName: 'Accounts' | 'Contacts' | 'Resources'
  ): {
    valid: any[];
    invalid: Array<{ record: any; errors: string[] }>;
    totalErrors: number;
    totalWarnings: number;
  } {
    const valid: any[] = [];
    const invalid: Array<{ record: any; errors: string[] }> = [];
    let totalErrors = 0;
    let totalWarnings = 0;

    for (const record of records) {
      const validation = this.validateRecord(record, moduleName);
      
      totalErrors += validation.errors.length;
      totalWarnings += validation.warnings.length;

      if (validation.isValid) {
        valid.push(record);
      } else {
        invalid.push({
          record,
          errors: validation.errors
        });
      }
    }

    console.log(`[Validator] ${valid.length} valid, ${invalid.length} invalid records for ${moduleName}`);
    
    return { valid, invalid, totalErrors, totalWarnings };
  }

  /**
   * Email validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Phone validation (flexible - accepts various formats)
   */
  private isValidPhone(phone: string): boolean {
    // Accept any string with 10+ digits
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
  }

  /**
   * Canadian postal code validation
   */
  private isValidPostalCode(postal: string): boolean {
    // Canadian format: A1A 1A1 or A1A1A1
    const cleaned = postal.replace(/\s/g, '').toUpperCase();
    return /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(cleaned);
  }
}

// Export singleton instance
export const dataValidator = new DataValidator();
