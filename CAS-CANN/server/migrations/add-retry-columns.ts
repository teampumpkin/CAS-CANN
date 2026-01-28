import { db } from "../db";
import { sql } from "drizzle-orm";

/**
 * Auto-migration: Adds next_retry_at and last_sync_at columns to form_submissions table
 * This migration runs automatically on server startup and is safe to run multiple times
 */
export async function migrateRetryColumns() {
  console.log("[Migration] Checking for missing retry columns...");
  
  try {
    // Check if columns exist
    const columnCheck = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'form_submissions' 
      AND column_name IN ('next_retry_at', 'last_sync_at')
    `);
    
    const existingColumns = columnCheck.rows.map((row: any) => row.column_name);
    const hasNextRetryAt = existingColumns.includes('next_retry_at');
    const hasLastSyncAt = existingColumns.includes('last_sync_at');
    
    if (hasNextRetryAt && hasLastSyncAt) {
      console.log("[Migration] ✅ All retry columns already exist");
      return { success: true, applied: false };
    }
    
    // Add missing columns
    if (!hasNextRetryAt) {
      console.log("[Migration] Adding next_retry_at column...");
      await db.execute(sql`
        ALTER TABLE form_submissions 
        ADD COLUMN next_retry_at timestamp
      `);
      console.log("[Migration] ✅ Added next_retry_at column");
    }
    
    if (!hasLastSyncAt) {
      console.log("[Migration] Adding last_sync_at column...");
      await db.execute(sql`
        ALTER TABLE form_submissions 
        ADD COLUMN last_sync_at timestamp
      `);
      console.log("[Migration] ✅ Added last_sync_at column");
    }
    
    console.log("[Migration] ✅ Migration completed successfully");
    return { success: true, applied: true };
    
  } catch (error) {
    console.error("[Migration] ❌ Error during migration:", error);
    throw error;
  }
}
