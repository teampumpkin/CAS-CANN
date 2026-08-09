import { db } from "../db";
import { sql } from "drizzle-orm";

/**
 * Auto-migration: creates map_clinics, the published services-map read model.
 * Idempotent — safe to run repeatedly.
 */
let cachedPromise: Promise<void> | null = null;

export function ensureMapClinicsTable(): Promise<void> {
  if (cachedPromise) return cachedPromise;
  cachedPromise = (async () => {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS map_clinics (
        id SERIAL PRIMARY KEY,
        zoho_record_id VARCHAR(100) NOT NULL UNIQUE,
        clinic_name VARCHAR(255) NOT NULL,
        street VARCHAR(255),
        city VARCHAR(120),
        province VARCHAR(10),
        postal_code VARCHAR(20),
        phone VARCHAR(50),
        fax VARCHAR(50),
        latitude TEXT,
        longitude TEXT,
        coordinate_source VARCHAR(30),
        published_by VARCHAR(255),
        published_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    // Added after the table shipped; ALTER keeps existing installs working.
    for (const col of [
      "contact_name VARCHAR(255)",
      "designation VARCHAR(150)",
      "subspecialty VARCHAR(255)",
      "amyloidosis_type VARCHAR(100)",
    ]) {
      await db.execute(sql.raw(`ALTER TABLE map_clinics ADD COLUMN IF NOT EXISTS ${col}`));
    }

    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_map_clinics_zoho_record_id ON map_clinics (zoho_record_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_map_clinics_province ON map_clinics (province)`);

    // Overrides for the homepage "Network Reach" figures. Empty by default —
    // every figure is derived from real data unless a row says otherwise.
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS site_stats (
        id SERIAL PRIMARY KEY,
        stat_key VARCHAR(60) NOT NULL UNIQUE,
        manual_value VARCHAR(30),
        note TEXT,
        updated_by VARCHAR(255),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_site_stats_key ON site_stats (stat_key)`);
  })().catch((err) => {
    cachedPromise = null;
    throw err;
  });
  return cachedPromise;
}
