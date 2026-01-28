/**
 * Batch Import Script - Process All 12 Excel Files
 * Imports data into Accounts, Contacts, and Resources modules
 */

import { chatImport } from './chat-import';
import * as fs from 'fs';
import * as path from 'path';

interface ImportLog {
  fileName: string;
  module: string;
  phase: 'dry-run' | 'live';
  status: 'success' | 'failed';
  recordsProcessed: number;
  recordsCreated: number;
  recordsSkipped: number;
  recordsFailed: number;
  errors: any[];
  timestamp: string;
}

const importLogs: ImportLog[] = [];

// File-to-Module mapping
const FILE_MAPPING = {
  accounts: [
    { file: 'Canadian Amyloidosis Society-Centers_for_Map-03-March-2025-English_1760708332637.xlsx', sheet: undefined },
    { file: 'Canadian Amyloidosis Society-Centers_for_Map-French-03-March-2025_1760708332638.xlsx', sheet: undefined },
    { file: 'CAS_Directory_Export_Populated_May2025_1760708332639.xlsx', sheet: 'Institutions' },
    { file: 'CAS_Directory_Master_Reorganized_v2_1760708332639.xlsx', sheet: undefined },
    { file: 'CAS_Intake_Form_EN_1760708332640.xlsx', sheet: undefined },
  ],
  contacts: [
    { file: 'Canadian Amyloidosis Society-Membership Registration-English-07-May-2025_1760708332638.xlsx', sheet: undefined },
    { file: 'CAS Membership Registration Form (French)-07-May-2025_1760708332639.xlsx', sheet: undefined },
    { file: 'CAS_Membership_Registration_Upgraded_EN_v2_1760708332640.xlsx', sheet: undefined },
  ],
  resources: [
    { file: 'CAS_Directory_Export_Populated_May2025_1760708332639.xlsx', sheet: 'Resources' },
    { file: 'CAS_Field_Spec_Updated_May2025_1760708332639.xlsx', sheet: undefined },
  ],
};

async function processFile(
  fileName: string, 
  module: 'Accounts' | 'Contacts' | 'Resources',
  sheetName?: string,
  dryRun: boolean = true
) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📂 Processing: ${fileName}`);
  console.log(`   Module: ${module}`);
  console.log(`   Sheet: ${sheetName || 'default'}`);
  console.log(`   Mode: ${dryRun ? 'DRY RUN' : 'LIVE IMPORT'}`);
  console.log(`${'='.repeat(80)}\n`);

  try {
    const result = await chatImport({
      fileName,
      module,
      sheetName,
      dryRun,
    });

    const log: ImportLog = {
      fileName,
      module,
      phase: dryRun ? 'dry-run' : 'live',
      status: result.recordsFailed === 0 ? 'success' : 'failed',
      recordsProcessed: result.recordsProcessed,
      recordsCreated: result.recordsCreated,
      recordsSkipped: result.recordsSkipped,
      recordsFailed: result.recordsFailed,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    };

    importLogs.push(log);

    console.log(`\n✅ ${dryRun ? 'DRY RUN' : 'LIVE IMPORT'} COMPLETE`);
    console.log(`   Processed: ${result.recordsProcessed}`);
    console.log(`   Created: ${result.recordsCreated}`);
    console.log(`   Skipped: ${result.recordsSkipped}`);
    console.log(`   Failed: ${result.recordsFailed}\n`);

    return result;
  } catch (error) {
    const log: ImportLog = {
      fileName,
      module,
      phase: dryRun ? 'dry-run' : 'live',
      status: 'failed',
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsSkipped: 0,
      recordsFailed: 0,
      errors: [{ error: error instanceof Error ? error.message : String(error) }],
      timestamp: new Date().toISOString(),
    };

    importLogs.push(log);
    console.error(`\n❌ IMPORT FAILED: ${error instanceof Error ? error.message : String(error)}\n`);
    throw error;
  }
}

async function main() {
  console.log('\n🚀 BATCH IMPORT - PROCESSING 12 FILES\n');
  console.log('Sequence: Accounts → Contacts → Resources\n');

  // Phase 1: Import Accounts (Institutions)
  console.log('\n📊 PHASE 1: ACCOUNTS (Institutions)\n');
  for (const { file, sheet } of FILE_MAPPING.accounts) {
    // Dry run first
    await processFile(file, 'Accounts', sheet, true);
    // Live import
    await processFile(file, 'Accounts', sheet, false);
  }

  // Phase 2: Import Contacts (Members)
  console.log('\n👥 PHASE 2: CONTACTS (Members)\n');
  for (const { file, sheet } of FILE_MAPPING.contacts) {
    // Dry run first
    await processFile(file, 'Contacts', sheet, true);
    // Live import
    await processFile(file, 'Contacts', sheet, false);
  }

  // Phase 3: Import Resources (Documents)
  console.log('\n📁 PHASE 3: RESOURCES (Documents)\n');
  for (const { file, sheet } of FILE_MAPPING.resources) {
    // Dry run first
    await processFile(file, 'Resources', sheet, true);
    // Live import
    await processFile(file, 'Resources', sheet, false);
  }

  // Generate master report
  generateMasterReport();
}

function generateMasterReport() {
  console.log('\n' + '='.repeat(80));
  console.log('📈 MASTER IMPORT REPORT');
  console.log('='.repeat(80) + '\n');

  const summary = {
    Accounts: { processed: 0, created: 0, skipped: 0, failed: 0 },
    Contacts: { processed: 0, created: 0, skipped: 0, failed: 0 },
    Resources: { processed: 0, created: 0, skipped: 0, failed: 0 },
  };

  // Aggregate stats (only live imports)
  importLogs
    .filter(log => log.phase === 'live')
    .forEach(log => {
      const module = log.module as keyof typeof summary;
      summary[module].processed += log.recordsProcessed;
      summary[module].created += log.recordsCreated;
      summary[module].skipped += log.recordsSkipped;
      summary[module].failed += log.recordsFailed;
    });

  // Print summary
  Object.entries(summary).forEach(([module, stats]) => {
    console.log(`${module}:`);
    console.log(`   Total Processed: ${stats.processed}`);
    console.log(`   Successfully Created: ${stats.created}`);
    console.log(`   Skipped: ${stats.skipped}`);
    console.log(`   Failed: ${stats.failed}\n`);
  });

  // Save report to JSON
  const reportPath = path.join(process.cwd(), 'services/zoho-data-sync/logs/batch-import-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    summary,
    detailedLogs: importLogs,
    timestamp: new Date().toISOString(),
  }, null, 2));

  console.log(`\n💾 Full report saved to: ${reportPath}\n`);
  console.log('='.repeat(80) + '\n');
}

// Run the batch import
main().catch(error => {
  console.error('\n❌ BATCH IMPORT FAILED:', error);
  process.exit(1);
});
