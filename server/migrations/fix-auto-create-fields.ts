import { db } from "../db";
import { sql } from "drizzle-orm";

/**
 * One-time migration: Updates legacy form configurations to have autoCreateFields=true
 * 
 * Background: The original createFormConfiguration() defaulted autoCreateFields to false,
 * which suppressed missing-field diagnostics. This migration fixes existing configs
 * created under the old default. New configs will default to true going forward.
 * 
 * This migration is idempotent and safe to run multiple times - it uses a marker
 * table to track completion.
 */
export async function migrateAutoCreateFields() {
  console.log("[Migration] Checking autoCreateFields default migration...");
  
  try {
    // Create migrations tracking table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS applied_migrations (
        id serial PRIMARY KEY,
        migration_name varchar(255) NOT NULL UNIQUE,
        applied_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Check if this migration has already been applied
    const migrationCheck = await db.execute(sql`
      SELECT migration_name FROM applied_migrations 
      WHERE migration_name = 'fix_auto_create_fields_v1'
    `);
    
    if (migrationCheck.rows.length > 0) {
      console.log("[Migration] ✅ autoCreateFields migration already applied");
      return { success: true, applied: false };
    }
    
    // First, ensure the column exists (production DB may not have it)
    console.log("[Migration] Ensuring auto_create_fields column exists...");
    await db.execute(sql`
      ALTER TABLE form_configurations 
      ADD COLUMN IF NOT EXISTS auto_create_fields boolean DEFAULT true
    `);
    
    // Run the migration: update all false/null values to true
    // This is a one-time fix for configs created under the old false default
    console.log("[Migration] Updating form_configurations.auto_create_fields to true...");
    
    const updateResult = await db.execute(sql`
      UPDATE form_configurations 
      SET auto_create_fields = true 
      WHERE auto_create_fields IS NOT TRUE
    `);
    
    const updatedCount = (updateResult as any).rowCount || 0;
    console.log(`[Migration] ✅ Updated ${updatedCount} config(s) to autoCreateFields=true`);
    
    // Record migration completion
    await db.execute(sql`
      INSERT INTO applied_migrations (migration_name) 
      VALUES ('fix_auto_create_fields_v1')
    `);
    
    console.log("[Migration] ✅ autoCreateFields migration completed successfully");
    return { success: true, applied: true, updatedCount };
    
  } catch (error) {
    console.error("[Migration] ❌ Error during autoCreateFields migration:", error);
    throw error;
  }
}
