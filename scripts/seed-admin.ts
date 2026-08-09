/**
 * Create or update an admin account (W3).
 *
 *   npx tsx scripts/seed-admin.ts <email> [--role=admin|superadmin]
 *
 * The password is read from the ADMIN_PASSWORD environment variable, never
 * from argv — arguments land in shell history and in `ps` output for every
 * user on the box.
 *
 *   ADMIN_PASSWORD='...' npx tsx scripts/seed-admin.ts admin@amyloid.ca
 *
 * Re-running for an existing email resets that admin's password, which is the
 * supported recovery path: there is deliberately no forgot-password endpoint.
 */

import bcrypt from "bcryptjs";
import { storage } from "../server/storage";
import { ensureAdminAuthTables } from "../server/migrations/add-admin-auth";
import {
  BCRYPT_COST,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_BYTES,
} from "../server/admin-auth-routes";

async function main() {
  const [rawEmail, ...flags] = process.argv.slice(2);
  const roleFlag = flags.find((f) => f.startsWith("--role="));
  const role = (roleFlag?.split("=")[1] ?? "admin") as "admin" | "superadmin";

  if (!rawEmail) {
    console.error("Usage: ADMIN_PASSWORD='...' npx tsx scripts/seed-admin.ts <email> [--role=admin|superadmin]");
    process.exit(1);
  }
  if (!["admin", "superadmin"].includes(role)) {
    console.error(`Invalid role: ${role}. Expected 'admin' or 'superadmin'.`);
    process.exit(1);
  }

  const email = rawEmail.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error("ADMIN_PASSWORD environment variable is required.");
    console.error("Generate one with: openssl rand -base64 24");
    process.exit(1);
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    console.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    process.exit(1);
  }
  if (Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
    console.error(`Password must be at most ${MAX_PASSWORD_BYTES} bytes (bcrypt ignores anything beyond that).`);
    process.exit(1);
  }

  await ensureAdminAuthTables();

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  const existing = await storage.getAdminUserByEmail(email);

  if (existing) {
    await storage.updateAdminPassword(existing.id, passwordHash);
    console.log(`✅ Password reset for existing admin: ${email} (id ${existing.id}, role ${existing.role})`);
    if (!existing.isActive) {
      console.log("⚠️  This account is INACTIVE and cannot log in until reactivated.");
    }
  } else {
    const created = await storage.createAdminUser({
      email,
      passwordHash,
      role,
      isActive: true,
    });
    console.log(`✅ Created admin: ${created.email} (id ${created.id}, role ${created.role})`);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("❌ seed-admin failed:", error);
  process.exit(1);
});
