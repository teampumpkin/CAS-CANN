/**
 * Type definitions for Zoho Data Sync Service
 */

export interface ImportSource {
  fileName: string;
  filePath: string;
  fileType: 'csv' | 'xlsx';
  sheetName?: string; // For Excel files
  uploadedAt: Date;
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  targetModule: 'Accounts' | 'Contacts' | 'Resources';
  transformation?: 'uppercase' | 'lowercase' | 'titlecase' | 'trim' | 'normalize_phone' | 'normalize_email';
}

export interface DataCleaningResult {
  originalRowCount: number;
  cleanedRowCount: number;
  duplicatesRemoved: number;
  invalidRowsSkipped: number;
  fieldsNormalized: string[];
  errors: string[];
  warnings: string[];
}

export interface ImportResult {
  module: 'Accounts' | 'Contacts' | 'Resources';
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  recordsFailed: number;
  errors: Array<{
    row: number;
    record: any;
    error: string;
  }>;
  warnings: string[];
  sourceTag: string;
  executionTime: number; // milliseconds
}

export interface RelationshipValidationResult {
  module: string;
  totalRecords: number;
  linkedRecords: number;
  unlinkedRecords: number;
  brokenLinks: Array<{
    recordId: string;
    linkedModule: string;
    linkedFieldValue: string;
    error: string;
  }>;
}

export interface ModuleSchema {
  moduleName: 'Accounts' | 'Contacts' | 'Resources';
  requiredFields: string[];
  optionalFields: string[];
  lookupFields: Array<{
    fieldName: string;
    referencedModule: string;
    referencedField: string;
  }>;
  uniqueIdentifiers: string[]; // Fields used for deduplication
}
