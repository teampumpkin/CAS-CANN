/**
 * File Parsing Utilities
 * 
 * Handles CSV and Excel file parsing
 */

import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import * as fs from 'fs';

export interface ParseResult {
  data: any[];
  headers: string[];
  rowCount: number;
  errors: string[];
}

export class FileParser {
  /**
   * Parse CSV file
   */
  parseCSV(filePath: string): ParseResult {
    const result: ParseResult = {
      data: [],
      headers: [],
      rowCount: 0,
      errors: []
    };

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      const parsed = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim()
      });

      result.data = parsed.data as any[];
      result.headers = parsed.meta.fields || [];
      result.rowCount = result.data.length;
      
      if (parsed.errors && parsed.errors.length > 0) {
        result.errors = parsed.errors.map(e => `Row ${e.row}: ${e.message}`);
      }

      console.log(`[FileParser] Parsed CSV: ${result.rowCount} rows, ${result.headers.length} columns`);
      
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : String(error));
    }

    return result;
  }

  /**
   * Parse Excel file (XLSX/XLS)
   */
  parseExcel(filePath: string, sheetName?: string): ParseResult {
    const result: ParseResult = {
      data: [],
      headers: [],
      rowCount: 0,
      errors: []
    };

    try {
      const workbook = XLSX.readFile(filePath);
      
      // Use specified sheet or first sheet
      const sheet = sheetName 
        ? workbook.Sheets[sheetName]
        : workbook.Sheets[workbook.SheetNames[0]];

      if (!sheet) {
        throw new Error(`Sheet "${sheetName || workbook.SheetNames[0]}" not found`);
      }

      // Convert to JSON with header row
      const jsonData = XLSX.utils.sheet_to_json(sheet, {
        raw: false, // Format values as strings
        defval: ''  // Default value for empty cells
      });

      result.data = jsonData;
      result.rowCount = jsonData.length;
      
      // Extract headers from first row keys
      if (jsonData.length > 0) {
        result.headers = Object.keys(jsonData[0] as Record<string, any>);
      }

      console.log(`[FileParser] Parsed Excel: ${result.rowCount} rows, ${result.headers.length} columns`);
      console.log(`[FileParser] Sheet: ${sheetName || workbook.SheetNames[0]}`);
      
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : String(error));
    }

    return result;
  }

  /**
   * Auto-detect file type and parse
   */
  parseFile(filePath: string, sheetName?: string): ParseResult {
    const ext = filePath.toLowerCase().split('.').pop();
    
    if (ext === 'csv') {
      return this.parseCSV(filePath);
    } else if (ext === 'xlsx' || ext === 'xls') {
      return this.parseExcel(filePath, sheetName);
    } else {
      return {
        data: [],
        headers: [],
        rowCount: 0,
        errors: [`Unsupported file type: ${ext}`]
      };
    }
  }

  /**
   * Get list of sheets in an Excel file
   */
  getExcelSheets(filePath: string): string[] {
    try {
      const workbook = XLSX.readFile(filePath);
      return workbook.SheetNames;
    } catch (error) {
      console.error('[FileParser] Failed to read Excel sheets:', error);
      return [];
    }
  }
}

// Export singleton instance
export const fileParser = new FileParser();
