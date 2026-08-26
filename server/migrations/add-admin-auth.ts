import { db } from "../db";
import { sql } from "drizzle-orm";

/**
 * Auto-migration: creates the admin authentication tables (W3).
 *
 * Idempotent — safe to run repeatedly. Follows the same lazy/self-healing
 * pattern as add-consent-records.ts so the tables are guaranteed to exist even
 * in environments where the entry-point never imported this file.
 *
 * Also creates the `session` table used by connect-pg-simple. That table is
 * what makes sessions survive a restart and stay consistent across ECS tasks;
 * connect-pg-simple can create it itself, but doing it here keeps the schema
 * in one auditable place.
 */
let cachedPromise: Promise<void> | null = null;

export function ensureAdminAuthTables(): Promise<void> {
  if (cachedPromise) return cachedPromise;
  cachedPromise = (async () => {
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE admin_role AS ENUM ('admin', 'superadmin');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(320) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role admin_role NOT NULL DEFAULT 'admin',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users (email)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users (is_active)`);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS admin_login_attempts (
        id SERIAL PRIMARY KEY,
        email VARCHAR(320) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        attempted_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_email ON admin_login_attempts (email)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_attempted_at ON admin_login_attempts (attempted_at)`);

    // Session store table (connect-pg-simple's expected shape).
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" VARCHAR NOT NULL COLLATE "default",
        "sess" JSON NOT NULL,
        "expire" TIMESTAMP(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
      )
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire")`);
  })().catch((err) => {
    cachedPromise = null;
    throw err;
  });
  return cachedPromise;
}
