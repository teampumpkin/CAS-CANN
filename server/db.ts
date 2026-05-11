import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

/**
 * Standard node-postgres Pool — works with any standard Postgres server,
 * including AWS RDS, RDS Aurora, self-hosted, and Replit's built-in Helium.
 *
 * SSL handling:
 *   - If DATABASE_URL contains `sslmode=require` (recommended for RDS),
 *     `pg` automatically negotiates TLS.
 *   - For RDS specifically, we set `rejectUnauthorized: false` to accept
 *     the AWS-issued certificate without bundling the rds-ca cert. This is
 *     safe because the connection is still encrypted; only the CA chain is
 *     not strictly verified. To enforce strict cert validation, mount the
 *     RDS CA bundle and set `ca: fs.readFileSync(...)`.
 *   - For local dev (no sslmode), SSL is disabled.
 */
const url = process.env.DATABASE_URL;
const wantsSSL = /sslmode=require/i.test(url) || /\.rds\.amazonaws\.com/i.test(url);

export const pool = new Pool({
  connectionString: url,
  ssl: wantsSSL ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });
