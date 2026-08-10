import { db } from "../db";
import { sql } from "drizzle-orm";

/**
 * Auto-migration: creates the tables that back the member login portal
 *   - members            (member accounts / profiles)
 *   - password_resets    (OTP-based forgot-password flow)
 *   - member_sessions    (express-session store via connect-pg-simple)
 *   - member_events      (members-only events + recordings)
 * plus the member_status / member_role enums.
 *
 * Idempotent — safe to run repeatedly. Runs on startup so the tables exist
 * on staging/prod (AWS ECS) without a manual db:push.
 */
let cachedPromise: Promise<void> | null = null;

export function ensureMemberTables(): Promise<void> {
  if (cachedPromise) return cachedPromise;
  cachedPromise = (async () => {
    // Enums (CREATE TYPE has no IF NOT EXISTS — guard with DO blocks)
    await db.execute(sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'member_status') THEN
          CREATE TYPE member_status AS ENUM ('pending', 'active', 'suspended', 'inactive');
        END IF;
      END $$;
    `);
    await db.execute(sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'member_role') THEN
          CREATE TYPE member_role AS ENUM ('cas_member', 'cann_member', 'cas_cann_member', 'admin');
        END IF;
      END $$;
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        full_name VARCHAR(255) NOT NULL,
        password_hash TEXT NOT NULL,
        role member_role NOT NULL DEFAULT 'cas_member',
        status member_status NOT NULL DEFAULT 'active',
        discipline VARCHAR(255),
        subspecialty VARCHAR(255),
        institution VARCHAR(255),
        amyloidosis_type VARCHAR(100),
        is_cas_member BOOLEAN NOT NULL DEFAULT false,
        is_cann_member BOOLEAN NOT NULL DEFAULT false,
        wants_communications BOOLEAN NOT NULL DEFAULT false,
        wants_cann_communications BOOLEAN NOT NULL DEFAULT false,
        wants_services_map_inclusion BOOLEAN NOT NULL DEFAULT false,
        form_submission_id INTEGER REFERENCES form_submissions(id),
        last_login_at TIMESTAMP,
        password_changed_at TIMESTAMP,
        email_verified BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_members_email ON members (email)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_members_status ON members (status)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_members_role ON members (role)`);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS password_resets (
        id SERIAL PRIMARY KEY,
        member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        otp_hash TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        attempts INTEGER NOT NULL DEFAULT 0,
        max_attempts INTEGER NOT NULL DEFAULT 3,
        is_used BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_password_resets_member_id ON password_resets (member_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_password_resets_email ON password_resets (email)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_password_resets_expires ON password_resets (expires_at)`);

    // connect-pg-simple compatible session store
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS member_sessions (
        sid VARCHAR(255) PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      )
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_member_sessions_expire ON member_sessions (expire)`);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS member_events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date TIMESTAMP NOT NULL,
        event_type VARCHAR(100) NOT NULL,
        location VARCHAR(255),
        meeting_link VARCHAR(500),
        recording_url VARCHAR(500),
        thumbnail_url VARCHAR(500),
        duration INTEGER,
        speakers TEXT[],
        tags TEXT[],
        access_level member_role NOT NULL DEFAULT 'cas_member',
        is_published BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_member_events_event_date ON member_events (event_date)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_member_events_access_level ON member_events (access_level)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_member_events_is_published ON member_events (is_published)`);

    // Uploaded recording file columns (member-only recordings served via stream endpoint)
    await db.execute(sql`ALTER TABLE member_events ADD COLUMN IF NOT EXISTS recording_storage_key VARCHAR(500)`);
    await db.execute(sql`ALTER TABLE member_events ADD COLUMN IF NOT EXISTS recording_file_name VARCHAR(255)`);
    await db.execute(sql`ALTER TABLE member_events ADD COLUMN IF NOT EXISTS recording_mime_type VARCHAR(120)`);
    await db.execute(sql`ALTER TABLE member_events ADD COLUMN IF NOT EXISTS recording_size_bytes BIGINT`);

    // Public CAS/CANN event card fields + audience
    await db.execute(sql`ALTER TABLE member_events ADD COLUMN IF NOT EXISTS presentation_title VARCHAR(500)`);
    await db.execute(sql`ALTER TABLE member_events ADD COLUMN IF NOT EXISTS speaker VARCHAR(500)`);
    await db.execute(sql`ALTER TABLE member_events ADD COLUMN IF NOT EXISTS topic VARCHAR(500)`);
    await db.execute(sql`ALTER TABLE member_events ADD COLUMN IF NOT EXISTS time_label VARCHAR(120)`);
    await db.execute(sql`ALTER TABLE member_events ADD COLUMN IF NOT EXISTS format VARCHAR(120)`);
    await db.execute(sql`ALTER TABLE member_events ADD COLUMN IF NOT EXISTS cme_credits VARCHAR(120)`);
    await db.execute(sql`ALTER TABLE member_events ADD COLUMN IF NOT EXISTS registration_url VARCHAR(500)`);
    await db.execute(sql`ALTER TABLE member_events ADD COLUMN IF NOT EXISTS registration_status VARCHAR(255)`);
    await db.execute(sql`ALTER TABLE member_events ADD COLUMN IF NOT EXISTS requires_cann_membership BOOLEAN NOT NULL DEFAULT false`);
    await db.execute(sql`ALTER TABLE member_events ADD COLUMN IF NOT EXISTS audience VARCHAR(20) NOT NULL DEFAULT 'members'`);

    // Admin-approved clinics shown on the public Canada services map (sourced from leads)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS map_clinics (
        id SERIAL PRIMARY KEY,
        submission_id INTEGER REFERENCES form_submissions(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        city VARCHAR(120),
        province VARCHAR(10) NOT NULL,
        address VARCHAR(500),
        phone VARCHAR(60),
        email VARCHAR(255),
        website VARCHAR(500),
        type VARCHAR(40) NOT NULL DEFAULT 'clinic',
        specialties TEXT[],
        services TEXT[],
        description TEXT,
        is_published BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_map_clinics_province ON map_clinics (province)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_map_clinics_is_published ON map_clinics (is_published)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_map_clinics_submission_id ON map_clinics (submission_id)`);

    // Member resources library (uploaded videos + study materials, member-only)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS member_resources (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        kind VARCHAR(20) NOT NULL DEFAULT 'document',
        category VARCHAR(120),
        storage_key VARCHAR(500) NOT NULL,
        file_name VARCHAR(255),
        mime_type VARCHAR(160),
        size_bytes BIGINT,
        thumbnail_url VARCHAR(500),
        access_level member_role NOT NULL DEFAULT 'cas_member',
        is_published BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_member_resources_kind ON member_resources (kind)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_member_resources_access_level ON member_resources (access_level)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_member_resources_is_published ON member_resources (is_published)`);
  })().catch((err) => {
    cachedPromise = null;
    throw err;
  });
  return cachedPromise;
}

export async function migrateMemberTables() {
  console.log("[Migration] Checking member portal tables...");
  try {
    await ensureMemberTables();
    console.log("[Migration] ✅ member portal tables ready");
    return { success: true };
  } catch (error) {
    console.error("[Migration] ❌ Error creating member portal tables:", error);
    throw error;
  }
}
