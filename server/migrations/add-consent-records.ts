import { db } from "../db";
import { sql } from "drizzle-orm";

/**
 * Auto-migration: Creates the consent_records table used for CASL / PIPEDA /
 * Quebec Law 25 burden-of-proof record-keeping.
 *
 * Idempotent — safe to run multiple times. Designed to also self-heal when
 * invoked lazily from storage code, so the table is guaranteed to exist
 * before the first insert even in environments where the server entry-point
 * never imported this file (e.g. AWS ECS prod where index.prod.ts is frozen).
 */
let cachedPromise: Promise<void> | null = null;

export function ensureConsentRecordsTable(): Promise<void> {
  if (cachedPromise) return cachedPromise;
  cachedPromise = (async () => {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS consent_records (
        id SERIAL PRIMARY KEY,
        submission_id INTEGER REFERENCES form_submissions(id) ON DELETE SET NULL,
        email VARCHAR(255) NOT NULL,
        source VARCHAR(100) NOT NULL,
        form_version VARCHAR(50) NOT NULL DEFAULT 'v1',
        consents JSONB NOT NULL,
        legal_text_shown JSONB NOT NULL,
        ip_address VARCHAR(64),
        user_agent TEXT,
        locale VARCHAR(10) DEFAULT 'en',
        withdrawn_at TIMESTAMP,
        withdrawn_via VARCHAR(100),
        withdrawn_reason TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_consent_records_email ON consent_records (email)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_consent_records_submission_id ON consent_records (submission_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_consent_records_created_at ON consent_records (created_at)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_consent_records_source ON consent_records (source)`);
  })().catch((err) => {
    cachedPromise = null;
    throw err;
  });
  return cachedPromise;
}

export async function migrateConsentRecords() {
  console.log("[Migration] Checking consent_records table...");
  try {
    await ensureConsentRecordsTable();
    console.log("[Migration] ✅ consent_records table ready");
    return { success: true };
  } catch (error) {
    console.error("[Migration] ❌ Error creating consent_records table:", error);
    throw error;
  }
}
