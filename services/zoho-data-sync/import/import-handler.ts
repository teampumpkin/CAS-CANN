/**
 * Import Handler
 * 
 * Main import pipeline orchestrator
 */

import { fileParser } from './file-parser';
import { fieldMapper } from './field-mapper';
import { dataCleaner } from '../cleanup/data-cleaner';
import { dataValidator } from '../cleanup/data-validator';
import { zohoSyncAPI } from '../auth/zoho-sync-api';
import { ImportResult } from '../types';

export interface ImportOptions {
  moduleName: 'Accounts' | 'Contacts' | 'Resources';
  filePath: string;
  sheetName?: string;
  customMappings?: Record<string, string>;
  dryRun?: boolean;
  batchSize?: number;
  skipValidation?: boolean;
  skipCleaning?: boolean;
}

export class ImportHandler {
  /**
   * Execute full import pipeline
   */
  async importFile(options: ImportOptions): Promise<ImportResult> {
    const startTime = Date.now();
    
    console.log(`\n🚀 Starting import: ${options.filePath} → ${options.moduleName}`);
    console.log(`   Mode: ${options.dryRun ? 'DRY RUN' : 'LIVE IMPORT'}\n`);

    const result: ImportResult = {
      module: options.moduleName,
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsSkipped: 0,
      recordsFailed: 0,
      errors: [],
      warnings: [],
      sourceTag: 'DataSyncService',
      executionTime: 0
    };

    try {
      // Step 1: Parse file
      console.log('Step 1: Parsing file...');
      const parseResult = fileParser.parseFile(options.filePath, options.sheetName);
      
      if (parseResult.errors.length > 0) {
        throw new Error(`Parse errors: ${parseResult.errors.join(', ')}`);
      }

      result.recordsProcessed = parseResult.rowCount;
      console.log(`✅ Parsed ${result.recordsProcessed} rows\n`);

      // Step 2: Map fields
      console.log('Step 2: Mapping fields...');
      const mappingResult = fieldMapper.mapFields(
        parseResult.data,
        options.moduleName,
        options.customMappings
      );

      if (mappingResult.unmappedColumns.length > 0) {
        result.warnings.push(`Unmapped columns: ${mappingResult.unmappedColumns.join(', ')}`);
      }

      // Apply transformations
      const transformedRecords = mappingResult.mapped.map(record =>
        fieldMapper.applyTransformations(record, options.moduleName)
      );

      console.log(`✅ Mapped ${transformedRecords.length} records\n`);

      // Step 3: Clean data (optional)
      let cleanedRecords = transformedRecords;
      
      if (!options.skipCleaning) {
        console.log('Step 3: Cleaning data...');
        const cleanResult = dataCleaner.cleanRecords(transformedRecords, 'DataSyncService') as any;
        cleanedRecords = cleanResult.cleanedRecords;
        result.recordsSkipped += cleanResult.invalidRowsSkipped + cleanResult.duplicatesRemoved;
        console.log(`✅ Cleaned ${cleanedRecords.length} records (${result.recordsSkipped} skipped)\n`);
      }

      // Step 4: Validate (optional)
      let validRecords = cleanedRecords;
      
      if (!options.skipValidation) {
        console.log('Step 4: Validating data...');
        const validationResult = dataValidator.validateRecords(cleanedRecords, options.moduleName);
        validRecords = validationResult.valid;
        result.recordsSkipped += validationResult.invalid.length;
        
        if (validationResult.invalid.length > 0) {
          validationResult.invalid.forEach((inv, idx) => {
            result.errors.push({
              row: idx,
              record: inv.record,
              error: inv.errors.join(', ')
            });
          });
        }
        
        console.log(`✅ Validated ${validRecords.length} records (${validationResult.invalid.length} invalid)\n`);
      }

      // Step 5: Import to Zoho
      console.log(`Step 5: Importing to Zoho ${options.moduleName}...`);
      
      const importOptions = {
        dryRun: options.dryRun,
        sourceTag: 'DataSyncService',
        excludeTags: ['WebForm'],
        batchSize: options.batchSize || 100
      };

      const upsertResult = await zohoSyncAPI.batchCreateRecords(
        options.moduleName,
        validRecords
      );

      result.recordsCreated = upsertResult.created;
      result.recordsFailed = upsertResult.failed;
      
      upsertResult.errors.forEach((errObj, idx) => {
        result.errors.push({
          row: idx,
          record: errObj.record,
          error: errObj.error
        });
      });

      console.log(`✅ Import complete: ${result.recordsCreated} created, ${result.recordsFailed} failed\n`);

      // Calculate duration
      result.executionTime = Date.now() - startTime;

      // Summary
      const success = result.recordsFailed === 0;
      console.log('📊 Import Summary:');
      console.log(`   Total rows: ${result.recordsProcessed}`);
      console.log(`   Imported: ${result.recordsCreated}`);
      console.log(`   Skipped: ${result.recordsSkipped}`);
      console.log(`   Failed: ${result.recordsFailed}`);
      console.log(`   Duration: ${Math.round(result.executionTime / 1000)}s`);
      console.log(`   Status: ${success ? '✅ SUCCESS' : '⚠️  PARTIAL SUCCESS'}\n`);

      return result;

    } catch (error) {
      result.errors.push({
        row: -1,
        record: {},
        error: error instanceof Error ? error.message : String(error)
      });
      result.executionTime = Date.now() - startTime;
      
      console.error('❌ Import failed:', error);
      return result;
    }
  }

  /**
   * Preview import without executing
   */
  async previewImport(options: ImportOptions): Promise<{
    headers: string[];
    sampleRecords: any[];
    suggestedMappings: Record<string, string>;
    estimatedRows: number;
  }> {
    console.log(`\n🔍 Previewing import: ${options.filePath}\n`);

    const parseResult = fileParser.parseFile(options.filePath, options.sheetName);
    
    if (parseResult.errors.length > 0) {
      throw new Error(`Parse errors: ${parseResult.errors.join(', ')}`);
    }

    const suggestedMappings = fieldMapper.suggestMappings(parseResult.headers, options.moduleName);
    const sampleRecords = parseResult.data.slice(0, 5); // First 5 records

    console.log(`📋 Preview:`);
    console.log(`   Headers: ${parseResult.headers.join(', ')}`);
    console.log(`   Estimated rows: ${parseResult.rowCount}`);
    console.log(`   Suggested mappings: ${Object.keys(suggestedMappings).length} fields\n`);

    return {
      headers: parseResult.headers,
      sampleRecords,
      suggestedMappings,
      estimatedRows: parseResult.rowCount
    };
  }
}

// Export singleton instance
export const importHandler = new ImportHandler();
