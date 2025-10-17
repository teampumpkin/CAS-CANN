import { importHandler } from './import/import-handler';
import * as fs from 'fs';
import * as path from 'path';

async function testDryRun() {
  console.log('🧪 Testing DRY RUN mode (should NOT hit Zoho)\n');

  const testDir = path.join(process.cwd(), 'logs/test');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  const testCsvPath = path.join(testDir, 'dryrun_test.csv');
  const csvContent = `Email,First Name,Last Name
test1@example.com,Test,User1
test2@example.com,Test,User2`;

  fs.writeFileSync(testCsvPath, csvContent);

  // DRY RUN - should NOT create records in Zoho
  const result = await importHandler.importFile({
    moduleName: 'Contacts',
    filePath: testCsvPath,
    dryRun: true
  });

  console.log('\n📊 Dry Run Results:');
  console.log(`   Records would create: ${result.recordsCreated}`);
  console.log(`   Actually created in Zoho: Check logs above for POST requests`);
  console.log(`   (Should see "DRY RUN" messages, NO actual Zoho API calls)\n`);

  fs.unlinkSync(testCsvPath);
  process.exit(0);
}

testDryRun();
