import XLSX from 'xlsx';
import { excelColumnMappings, formNameMapping } from './bulk-import-config';
import type { IStorage } from './storage';

export interface BulkImportResult {
  totalRows: number;
  successCount: number;
  failedCount: number;
  errors: Array<{ row: number; error: string }>;
  submissionIds: number[];
}

export class BulkImportService {
  constructor(private storage: IStorage) {}

  /**
   * Import data from Excel file
   */
  async importFromExcel(
    filePath: string,
    dataSource: "CANN Contacts" | "CAS Registration"
  ): Promise<BulkImportResult> {
    const result: BulkImportResult = {
      totalRows: 0,
      successCount: 0,
      failedCount: 0,
      errors: [],
      submissionIds: []
    };

    try {
      // Read Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet);

      result.totalRows = rawData.length;
      console.log(`[Bulk Import] Processing ${result.totalRows} rows from ${dataSource}`);

      // Get column mapping for this data source
      const columnMapping = excelColumnMappings[dataSource];
      const formName = formNameMapping[dataSource];

      // Process each row
      for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i] as Record<string, any>;
        
        try {
          // Map Excel columns to form fields
          const formData = this.mapExcelRowToFormData(row, columnMapping);
          
          // Skip empty rows
          if (Object.keys(formData).length === 0) {
            continue;
          }

          // Create form submission
          const submission = await this.storage.createFormSubmission({
            formName,
            submissionData: formData,
            sourceForm: `Historical Import - ${dataSource}`,
            zohoModule: "Leads"
          });

          result.submissionIds.push(submission.id);
          result.successCount++;
          
          console.log(`[Bulk Import] Row ${i + 1}: Created submission ${submission.id} for ${formData.fullName || formData.email}`);
        } catch (error) {
          result.failedCount++;
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          result.errors.push({ row: i + 1, error: errorMsg });
          console.error(`[Bulk Import] Row ${i + 1} failed:`, errorMsg);
        }
      }

      console.log(`[Bulk Import] Completed: ${result.successCount} success, ${result.failedCount} failed`);
      return result;
    } catch (error) {
      console.error(`[Bulk Import] Fatal error reading Excel file:`, error);
      throw error;
    }
  }

  /**
   * Map Excel row columns to form field names
   */
  private mapExcelRowToFormData(
    excelRow: Record<string, any>,
    columnMapping: Record<string, string>
  ): Record<string, any> {
    const formData: Record<string, any> = {};

    for (const [excelColumn, formField] of Object.entries(columnMapping)) {
      const value = excelRow[excelColumn];
      
      // Skip null, undefined, or empty string values
      if (value !== null && value !== undefined && value !== '') {
        // Convert Excel date numbers to ISO strings
        if (excelColumn.toLowerCase().includes('timestamp') && typeof value === 'number') {
          formData[formField] = this.excelDateToISO(value);
        } else {
          formData[formField] = value;
        }
      }
    }

    return formData;
  }

  /**
   * Convert Excel date serial number to ISO date string
   */
  private excelDateToISO(excelDate: number): string {
    const date = XLSX.SSF.parse_date_code(excelDate);
    return new Date(date.y, date.m - 1, date.d, date.H, date.M, date.S).toISOString();
  }
}
