/**
 * Local Postgres health check.
 *
 *   npx tsx --env-file=.env scripts/check-postgres.ts
 *
 * Connects with the SAME DATABASE_URL the app uses, so a pass here means the
 * app will connect too. A bare `pg_isready` only proves something is listening
 * on the port — it says nothing about the database existing, the role being
 * valid, or the schema being migrated.
 *
 * Exits 0 when reachable, 1 otherwise, so mprocs shows a clear red/green.
 */

import pg from "pg";

const CONNECT_TIMEOUT_MS = 5_000;

/** Tables the app needs. Missing ones are reported, not fatal. */
const EXPECTED_TABLES = [
  "admin_users",
  "admin_login_attempts",
  "session",
  "form_submissions",
  "consent_records",
];

const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

function describeTarget(raw: string) {
  try {
    const u = new URL(raw);
    return {
      host: u.hostname || "localhost",
      port: u.port || "5432",
      database: decodeURIComponent(u.pathname.replace(/^\//, "")) || "(default)",
      user: decodeURIComponent(u.username) || "(current OS user)",
      isLocal: ["localhost", "127.0.0.1", "::1"].includes(u.hostname),
    };
  } catch {
    return null;
  }
}

function remedyFor(code: string | undefined, target: ReturnType<typeof describeTarget>) {
  const local = target?.isLocal ?? false;
  switch (code) {
    case "ECONNREFUSED":
      return local
        ? [
            "Postgres is not accepting connections on this port.",
            "",
            "  brew services list                 # is it installed / running?",
            "  brew services start postgresql@16  # start it",
            "  pg_isready                         # confirm",
          ]
        : ["The remote host refused the connection. Check the host, port, and any security group or firewall rule."];
    case "ENOTFOUND":
      return [`Host "${target?.host}" could not be resolved. Check DATABASE_URL for a typo.`];
    case "ETIMEDOUT":
      return ["The connection timed out — usually a firewall or security group blocking the port."];
    case "28P01":
      return ["Password authentication failed. Check the credentials in DATABASE_URL."];
    case "28000":
      return [`Role "${target?.user}" does not exist.`, "", `  createuser -s ${target?.user}`];
    case "3D000":
      return [`Database "${target?.database}" does not exist.`, "", `  createdb ${target?.database}`];
    default:
      return [];
  }
}

async function main() {
  const url = process.env.DATABASE_URL;

  console.log(dim("── Postgres health check ──────────────────────────────"));

  if (!url) {
    console.log(red("✖ DATABASE_URL is not set."));
    console.log("");
    console.log("  This script needs the .env file loaded:");
    console.log("    npx tsx --env-file=.env scripts/check-postgres.ts");
    console.log("");
    console.log(dim("  Note: `npm run dev` does not load .env either — tsx does not"));
    console.log(dim("  auto-load it and dotenv is not installed."));
    process.exit(1);
  }

  const target = describeTarget(url);
  if (!target) {
    console.log(red("✖ DATABASE_URL is not a valid connection URL."));
    process.exit(1);
  }

  console.log(`  target   ${target.host}:${target.port}/${target.database}`);
  console.log(`  user     ${target.user}`);
  console.log(`  location ${target.isLocal ? "local" : yellow("REMOTE — this is not a local database")}`);
  console.log("");

  const wantsSSL = /sslmode=require/i.test(url) || /\.rds\.amazonaws\.com/i.test(url);
  const pool = new pg.Pool({
    connectionString: url,
    ssl: wantsSSL ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: CONNECT_TIMEOUT_MS,
    max: 1,
  });

  const startedAt = Date.now();
  try {
    const { rows } = await pool.query<{
      version: string;
      db: string;
      usr: string;
    }>("SELECT version() AS version, current_database() AS db, current_user AS usr");

    const elapsed = Date.now() - startedAt;
    const version = rows[0].version.split(" ").slice(0, 2).join(" ");

    console.log(green(`✔ Connected in ${elapsed}ms`));
    console.log(`  ${version}  ·  db=${rows[0].db}  ·  user=${rows[0].usr}`);

    const { rows: tableRows } = await pool.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = ANY($1)`,
      [EXPECTED_TABLES],
    );
    const present = new Set(tableRows.map((r) => r.table_name));
    const missing = EXPECTED_TABLES.filter((t) => !present.has(t));

    console.log("");
    if (missing.length === 0) {
      console.log(green(`✔ All ${EXPECTED_TABLES.length} expected tables present`));
    } else {
      console.log(yellow(`⚠ Missing ${missing.length} table(s): ${missing.join(", ")}`));
      console.log(dim("  These are created automatically when the server boots,"));
      console.log(dim("  or run: npm run db:push"));
    }

    await pool.end();
    console.log(dim("───────────────────────────────────────────────────────"));
    process.exit(0);
  } catch (error: any) {
    const code = error?.code;
    console.log(red(`✖ Could not connect${code ? ` (${code})` : ""}`));
    // pg reports an empty message for some socket-level failures (ECONNREFUSED
    // among them), so fall back to something the reader can act on.
    const detail =
      (typeof error?.message === "string" && error.message.trim()) ||
      (code ? `socket error ${code}` : String(error));
    console.log(dim(`  ${detail}`));

    const remedy = remedyFor(code, target);
    if (remedy.length) {
      console.log("");
      remedy.forEach((line) => console.log(line ? `  ${line}` : ""));
    }

    await pool.end().catch(() => {});
    console.log(dim("───────────────────────────────────────────────────────"));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(red("✖ Health check crashed:"), error);
  process.exit(1);
});
