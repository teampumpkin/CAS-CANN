/**
 * Diagnose a failing admin login.
 *
 *   npx tsx --env-file-if-exists=.env scripts/diagnose-admin-login.ts <email>
 *
 * Optionally verify a specific password against the stored hash:
 *   ADMIN_PASSWORD='...' npx tsx --env-file-if-exists=.env scripts/diagnose-admin-login.ts <email>
 *
 * Read-only — changes nothing. Run it with the SAME DATABASE_URL the server
 * uses, otherwise you are inspecting a different database than the one the
 * seed command wrote to (the most common cause of "I created it but can't
 * log in").
 */

import bcrypt from "bcryptjs";
import { db } from "../server/db";
import { sql } from "drizzle-orm";
import { LOCKOUT_THRESHOLD, LOCKOUT_WINDOW_MINUTES } from "../server/admin-auth-routes";

const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

async function main() {
  const raw = process.argv[2];
  if (!raw) {
    console.error("Usage: npx tsx --env-file-if-exists=.env scripts/diagnose-admin-login.ts <email>");
    process.exit(1);
  }
  const email = raw.trim().toLowerCase();

  console.log(dim("── Admin login diagnosis ─────────────────────────────"));

  // 1. Which database are we actually looking at?
  const target = (() => {
    try {
      const u = new URL(process.env.DATABASE_URL ?? "");
      return `${u.hostname}:${u.port || 5432}${u.pathname}`;
    } catch {
      return "(DATABASE_URL not set or unparseable)";
    }
  })();
  console.log(`  database   ${target}`);
  console.log(`  looking up ${email}`);
  console.log("");

  // 2. Does the table exist at all?
  try {
    await db.execute(sql`SELECT 1 FROM admin_users LIMIT 1`);
  } catch {
    console.log(red("✖ admin_users table does not exist in this database."));
    console.log("  The server creates it on boot. Either the server has never");
    console.log("  started against this database, or you are pointed at the wrong one.");
    process.exit(1);
  }

  // 3. All accounts, so a typo or wrong-environment is obvious.
  const all = await db.execute(sql`SELECT email, role, is_active FROM admin_users ORDER BY id`);
  console.log(`  ${all.rows.length} admin account(s) in this database:`);
  all.rows.forEach((r: any) =>
    console.log(`     ${r.is_active ? green("active  ") : red("INACTIVE")} ${r.email}  (${r.role})`),
  );
  console.log("");

  const found = await db.execute(sql`
    SELECT id, email, role, is_active, password_hash, last_login_at, created_at
    FROM admin_users WHERE email = ${email}
  `);

  if (found.rows.length === 0) {
    console.log(red(`✖ No account for "${email}" in this database.`));
    console.log("");
    console.log("  Most likely: the seed command ran against a different DATABASE_URL.");
    console.log("  Ask whoever ran it to confirm which database it printed, and compare");
    console.log("  with the value above.");
    process.exit(1);
  }

  const admin = found.rows[0] as any;
  console.log(green("✔ Account exists"));
  console.log(`     id ${admin.id} · role ${admin.role} · created ${admin.created_at}`);
  console.log(`     last login: ${admin.last_login_at ?? dim("never")}`);

  if (!admin.is_active) {
    console.log("");
    console.log(red("✖ Account is INACTIVE — login will always return 401."));
    console.log("  Fix: UPDATE admin_users SET is_active = true WHERE email = '" + email + "';");
  }

  // 4. Hash sanity
  const hash: string = admin.password_hash ?? "";
  const looksLikeBcrypt = /^\$2[aby]\$\d{2}\$/.test(hash);
  console.log("");
  if (looksLikeBcrypt) {
    console.log(green(`✔ Password hash looks valid (${hash.slice(0, 7)}…, cost ${hash.split("$")[2]})`));
  } else {
    console.log(red(`✖ password_hash is not a bcrypt hash: "${hash.slice(0, 20)}…"`));
    console.log("  Re-run the seed script to reset it.");
  }

  // 5. Verify a candidate password, if supplied
  const candidate = process.env.ADMIN_PASSWORD;
  console.log("");
  if (candidate && looksLikeBcrypt) {
    const ok = await bcrypt.compare(candidate, hash);
    console.log(ok
      ? green("✔ ADMIN_PASSWORD matches the stored hash — the credential is correct.")
      : red("✖ ADMIN_PASSWORD does NOT match the stored hash."));
    if (!ok) {
      console.log("  Either the wrong password is being used, or the shell mangled it");
      console.log("  when seeding (unquoted $ ! or ` are the usual culprits).");
    }
  } else {
    console.log(dim("  (set ADMIN_PASSWORD to also verify the password against the hash)"));
  }

  // 6. Lockout
  const since = new Date(Date.now() - LOCKOUT_WINDOW_MINUTES * 60_000);
  const fails = await db.execute(sql`
    SELECT count(*)::int AS n FROM admin_login_attempts
    WHERE email = ${email} AND attempted_at >= ${since}
  `);
  const n = Number((fails.rows[0] as any).n);
  console.log("");
  if (n >= LOCKOUT_THRESHOLD) {
    console.log(red(`✖ LOCKED OUT — ${n} failed attempts in the last ${LOCKOUT_WINDOW_MINUTES} minutes (threshold ${LOCKOUT_THRESHOLD}).`));
    console.log("  Login returns 429 even with the correct password until the window passes.");
    console.log(`  Clear now: DELETE FROM admin_login_attempts WHERE email = '${email}';`);
  } else {
    console.log(green(`✔ Not locked out (${n}/${LOCKOUT_THRESHOLD} failed attempts in the last ${LOCKOUT_WINDOW_MINUTES} min)`));
  }

  console.log(dim("──────────────────────────────────────────────────────"));
  process.exit(0);
}

main().catch((e) => {
  console.error("Diagnosis failed:", e?.message ?? e);
  process.exit(1);
});
