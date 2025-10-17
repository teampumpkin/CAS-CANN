/**
 * Chat-based Import Tool
 * Import files directly from attached_assets via chat commands
 */

import { importHandler } from './import/import-handler';
import * as fs from 'fs';
import * as path from 'path';

interface ChatImportOptions {
  fileName: string;
  module: 'Accounts' | 'Contacts' | 'Resources';
  sheetName?: string;
  dryRun?: boolean;
}

export async function chatImport(options: ChatImportOptions) {
  // Handle path from both project root and zoho-data-sync directory
  let filePath = path.join(process.cwd(), 'attached_assets', options.fileName);
  
  // If not found, try from parent directory (when running from zoho-data-sync)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), '..', '..', 'attached_assets', options.fileName);
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${options.fileName}\nSearched in: ${filePath}`);
  }

  console.log(`\n🚀 Starting chat-based import...`);
  console.log(`   File: ${options.fileName}`);
  console.log(`   Module: ${options.module}`);
  console.log(`   Mode: ${options.dryRun ? 'DRY RUN' : 'LIVE IMPORT'}\n`);

  const result = await importHandler.importFile({
    filePath,
    moduleName: options.module,
    sheetName: options.sheetName,
    dryRun: options.dryRun ?? true, // Default to dry run for safety
  });

  return result;
}

// List available files in attached_assets
export function listAttachedFiles(): string[] {
  const assetsDir = path.join(process.cwd(), 'attached_assets');
  
  if (!fs.existsSync(assetsDir)) {
    return [];
  }

  return fs.readdirSync(assetsDir)
    .filter(file => file.endsWith('.xlsx') || file.endsWith('.xls') || file.endsWith('.csv'))
    .sort();
}

// CLI helper
export function showAvailableFiles() {
  const files = listAttachedFiles();
  console.log('\n📁 Available files in attached_assets:\n');
  files.forEach((file, idx) => {
    console.log(`   ${idx + 1}. ${file}`);
  });
  console.log('\n');
  return files;
}
