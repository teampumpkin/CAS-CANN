/**
 * Database Snapshot Export
 * ------------------------
 * Exports the full form_submissions table to an Excel workbook.
 * Flattens submission_data JSON into columns so every form field is visible.
 *
 * Deliverable for: CAS CRM May 6, 2026 review meeting (Jeff + Jan).
 * Output: docs/CAS_TeamPumpkin_Database_Snapshot_<DATE>.xlsx
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { db } from '../server/db';
import { formSubmissions } from '../shared/schema';

async function exportDatabaseSnapshot() {
  console.log('[DB Snapshot] Starting export...');

  const rows = await db.select().from(formSubmissions);
  console.log(`[DB Snapshot] Loaded ${rows.length} rows from form_submissions`);

  // Discover every unique key inside submission_data across all rows
  const submissionDataKeys = new Set<string>();
  for (const r of rows) {
    const data = (r.submissionData || {}) as Record<string, any>;
    for (const k of Object.keys(data)) submissionDataKeys.add(k);
  }
  const sortedKeys = Array.from(submissionDataKeys).sort();
  console.log(`[DB Snapshot] Found ${sortedKeys.length} distinct submission_data keys`);

  // Build flattened rows: every column visible, every JSON field exploded
  const flatRows = rows.map((r) => {
    const data = (r.submissionData || {}) as Record<string, any>;
    const flat: Record<string, any> = {
      id: r.id,
      form_name: r.formName,
      source_form: r.sourceForm,
      zoho_module: r.zohoModule,
      zoho_crm_id: r.zohoCrmId || '',
      processing_status: r.processingStatus,
      sync_status: r.syncStatus,
      retry_count: r.retryCount,
      error_message: r.errorMessage || '',
      created_at: r.createdAt ? new Date(r.createdAt).toISOString() : '',
      updated_at: r.updatedAt ? new Date(r.updatedAt).toISOString() : '',
      last_sync_at: r.lastSyncAt ? new Date(r.lastSyncAt).toISOString() : '',
    };
    for (const k of sortedKeys) {
      const v = data[k];
      flat[`field__${k}`] =
        v === null || v === undefined
          ? ''
          : typeof v === 'object'
          ? JSON.stringify(v)
          : v;
    }
    return flat;
  });

  // Source-form summary
  const sourceCounts: Record<string, number> = {};
  for (const r of rows) {
    const src = r.sourceForm || '(null)';
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  }
  const summaryRows = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([source_form, count]) => ({ source_form, count }));
  summaryRows.push({ source_form: 'TOTAL', count: rows.length });

  // Sync-status summary
  const syncCounts: Record<string, number> = {};
  for (const r of rows) {
    const s = r.syncStatus || 'unknown';
    syncCounts[s] = (syncCounts[s] || 0) + 1;
  }
  const syncRows = Object.entries(syncCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([sync_status, count]) => ({ sync_status, count }));

  // Build workbook
  const wb = XLSX.utils.book_new();

  const readme = [
    { Field: 'Title', Value: 'CAS / CANN — Team Pumpkin Database Snapshot' },
    { Field: 'Generated', Value: new Date().toISOString() },
    { Field: 'Source', Value: 'PostgreSQL form_submissions table (production)' },
    { Field: 'Total rows', Value: rows.length },
    { Field: 'Distinct submission_data fields', Value: sortedKeys.length },
    { Field: '', Value: '' },
    {
      Field: 'IMPORTANT CAVEATS',
      Value:
        'This is the raw, unfiltered Team Pumpkin database. It contains live website form submissions, bulk Excel imports, test records, and rows with parsing errors. Treat as evidence, not as the canonical source of truth.',
    },
    {
      Field: 'Test records to ignore',
      Value:
        'Submissions with email containing "test", "vasi", "verify@example", or full_name "Jane Smith" are internal test data.',
    },
    {
      Field: 'Source forms',
      Value: 'See "Source Form Summary" sheet for full breakdown.',
    },
    {
      Field: 'Sync status',
      Value:
        'See "Sync Status Summary" sheet — only rows with sync_status=synced and a non-empty zoho_crm_id are reflected in Zoho CRM.',
    },
  ];

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(readme), 'README');
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(summaryRows),
    'Source Form Summary'
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(syncRows),
    'Sync Status Summary'
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(flatRows),
    'All Submissions (flattened)'
  );

  const dateStr = new Date().toISOString().slice(0, 10);
  const outDir = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `CAS_TeamPumpkin_Database_Snapshot_${dateStr}.xlsx`);
  XLSX.writeFile(wb, outPath);

  console.log(`[DB Snapshot] Written to: ${outPath}`);
  console.log(`[DB Snapshot] Source form breakdown:`);
  for (const s of summaryRows) console.log(`  ${s.count.toString().padStart(4)}  ${s.source_form}`);
  return outPath;
}

exportDatabaseSnapshot()
  .then((p) => {
    console.log(`\n✅ Database snapshot ready: ${p}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Database snapshot failed:', err);
    process.exit(1);
  });
