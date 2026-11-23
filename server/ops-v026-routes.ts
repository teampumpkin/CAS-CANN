/**
 * TEMPORARY ops endpoints for the v0.26 CRM migration (23 Nov 2026) — website DB follow-up.
 *
 * Purpose: the 6 CRM records created by the migration came from 6 existing form submissions whose `zoho_crm_id`
 * still points at long-deleted Zoho ids. These endpoints relink exactly those 6 rows (one column) to the new ids,
 * without anyone needing direct database access. Nothing else is read or written.
 *
 * Safety:
 *  - Auth: header `X-Ops-Token`. Only its SHA-256 is in the code (OPS_TOKEN_SHA256 env var may override it).
 *    Missing/wrong token, or any call after OPS_EXPIRES_AT, falls through to the site's normal handling of unknown
 *    paths (next('route')), so the endpoints are indistinguishable from paths that don't exist.
 *  - Writes are dry-run unless the body carries the exact confirm phrase.
 *  - Every write runs in ONE transaction with SELECT ... FOR UPDATE: each row must still hold the expected old id,
 *    be completed/synced, and its submission email must match the expected SHA-256. Any mismatch rolls back all 6.
 *  - Never touches submission_data, statuses, retries, timestamps, submission_logs or any other row.
 *  - Every call is logged (without the token).
 * Remove this file and its one registration line once the relink is verified.
 */
import type { Express, Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { pool } from "./db";

const OPS_TOKEN_SHA256 = process.env.OPS_TOKEN_SHA256 || "9076330450158ad91deff82024687904e6ef335bdad53133c583fbdf38a29af4";
const OPS_EXPIRES_AT = new Date("2026-12-07T00:00:00Z");

type RelinkRow = { id: number; oldZohoId: string; newZohoId: string; emailSha256: string; ssot: string };
export const RELINK_ROWS: RelinkRow[] = [
  { id: 370, oldZohoId: '6999043000003030001', newZohoId: '6999043000004138005', emailSha256: '756da0641e87dc854b46b7cf2da43bac0f0c1d4360bc7c4044c9804ec884e613', ssot: 'SSOT-139' },
  { id: 307, oldZohoId: '6999043000002515001', newZohoId: '6999043000004135013', emailSha256: '64c35640918da7304472cf797a66943e3890b3f638a5cc9fca62179a00aebb61', ssot: 'SSOT-143' },
  { id: 366, oldZohoId: '6999043000002897001', newZohoId: '6999043000004148016', emailSha256: '3bbe37a5a0aac3f9cb4568f7be1a10cd73b6b0943f10d90419f908e3dc2f349a', ssot: 'SSOT-152' },
  { id: 306, oldZohoId: '6999043000002513001', newZohoId: '6999043000004130016', emailSha256: '657cd92013914ba47451033ee1253584eec09ea2f1e5b2dba2ea9665f122af4b', ssot: 'SSOT-195' },
  { id: 311, oldZohoId: '6999043000002594001', newZohoId: '6999043000004138007', emailSha256: '2062d9dc92afaa2faf1e68c0d005526fc10f76e1239c97fbed6683aa63888e63', ssot: 'SSOT-214' },
  { id: 314, oldZohoId: '6999043000002605001', newZohoId: '6999043000004146009', emailSha256: '3f57bcff1ca37b4cf8de2ed1ac15ede67d3bbf7ebeba2ab23ce68047172b2123', ssot: 'SSOT-267' }
];
/** CRM records merged away on 23 Nov 2026 — no submission may point at these. */
export const MERGED_AWAY_IDS: string[] = [
  '6999043000003162095',
  '6999043000003162106',
  '6999043000003162125',
  '6999043000003162127',
  '6999043000003162134',
  '6999043000003162136',
  '6999043000003162139',
  '6999043000003162202',
  '6999043000003162204',
  '6999043000003162228',
  '6999043000003162232',
  '6999043000003162241',
  '6999043000003162268',
  '6999043000003162269',
  '6999043000003162271',
  '6999043000003162273',
  '6999043000003162276',
  '6999043000003162282',
  '6999043000003162285',
  '6999043000003162286',
  '6999043000003162287',
  '6999043000003162292',
  '6999043000003162294',
  '6999043000003162301',
  '6999043000003162302',
  '6999043000003162303',
  '6999043000003162304',
  '6999043000003162318',
  '6999043000003162319',
  '6999043000003162320',
  '6999043000003162321',
  '6999043000003162322',
  '6999043000003162323',
  '6999043000003162324',
  '6999043000003162325',
  '6999043000003162326',
  '6999043000003162327',
  '6999043000003162328',
  '6999043000003162329',
  '6999043000003162330',
  '6999043000003162331',
  '6999043000003467057'
];
/** Duplicates whose merge was held — links to these are valid and are left alone. */
export const HELD_DUPLICATE_IDS: string[] = ['6999043000003162058', '6999043000003162120', '6999043000003162137', '6999043000003162278', '6999043000003162342'];
const MAX_ID_IN_20NOV_DUMP = 401;

const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

export function opsAuth(now: () => Date = () => new Date()) {
  return (req: Request, res: Response, next: NextFunction) => {
    const tok = req.get("x-ops-token") || "";
    const ok = now() < OPS_EXPIRES_AT && tok.length > 0 && /^[0-9a-f]{64}$/i.test(OPS_TOKEN_SHA256) &&
      crypto.timingSafeEqual(Buffer.from(sha256(tok), "hex"), Buffer.from(OPS_TOKEN_SHA256, "hex"));
    console.log(`[OPS v026] ${req.method} ${req.path} auth=${ok ? "ok" : "denied"} ip=${req.ip} xff=${req.get("x-forwarded-for") || ""}`);
    if (!ok) return next("route");
    next();
  };
}

type Check = { id: number; ssot: string; found: boolean; zohoCrmId: string | null; status: string; emailMatches: boolean;
               state: "OLD" | "NEW" | "UNEXPECTED"; problems: string[] };

async function inspect(client: any, forUpdate: boolean): Promise<Check[]> {
  const r = await client.query(
    `SELECT id, zoho_crm_id, processing_status::text AS ps, sync_status::text AS ss,
            lower(trim(submission_data->>'email')) AS email
       FROM public.form_submissions WHERE id = ANY($1::int[]) ORDER BY id ${forUpdate ? "FOR UPDATE" : ""}`,
    [RELINK_ROWS.map((x) => x.id)]);
  const byId = new Map<number, any>(r.rows.map((x: any) => [Number(x.id), x]));
  return RELINK_ROWS.map((exp) => {
    const row = byId.get(exp.id);
    const problems: string[] = [];
    if (!row) return { id: exp.id, ssot: exp.ssot, found: false, zohoCrmId: null, status: "", emailMatches: false, state: "UNEXPECTED", problems: ["row not found"] };
    const emailMatches = !!row.email && sha256(row.email) === exp.emailSha256;
    if (!emailMatches) problems.push("email does not match expected person");
    if (row.ps !== "completed" || row.ss !== "synced") problems.push(`status ${row.ps}/${row.ss} (expected completed/synced)`);
    const state = row.zoho_crm_id === exp.oldZohoId ? "OLD" : row.zoho_crm_id === exp.newZohoId ? "NEW" : "UNEXPECTED";
    if (state === "UNEXPECTED") problems.push(`zoho_crm_id ${row.zoho_crm_id} is neither the old (${exp.oldZohoId}) nor the new (${exp.newZohoId}) id`);
    return { id: exp.id, ssot: exp.ssot, found: true, zohoCrmId: row.zoho_crm_id, status: `${row.ps}/${row.ss}`, emailMatches, state, problems };
  });
}

async function change(direction: "relink" | "rollback", apply: boolean): Promise<any> {
  let client: any;
  try { client = await pool.connect(); }
  catch (e: any) { return { ok: false, applied: false, reason: `database connection failed, nothing changed: ${e?.message || e}` }; }
  let result: any;
  try {
    await client.query("BEGIN");
    const checks = await inspect(client, true);
    const want = direction === "relink" ? "OLD" : "NEW";
    const blocked = checks.filter((c) => c.problems.length > 0 || c.state !== want);
    if (blocked.length > 0) {
      await client.query("ROLLBACK");
      return { ok: false, applied: false, reason: `every row must be in state ${want} with no problems; nothing changed`, checks };
    }
    const changes = [];
    for (const exp of RELINK_ROWS) {
      const [from, to] = direction === "relink" ? [exp.oldZohoId, exp.newZohoId] : [exp.newZohoId, exp.oldZohoId];
      const u = await client.query(
        `UPDATE public.form_submissions SET zoho_crm_id = $1
          WHERE id = $2 AND zoho_crm_id = $3 AND processing_status = 'completed' AND sync_status = 'synced'`,
        [to, exp.id, from]);
      if (u.rowCount !== 1) throw new Error(`row ${exp.id}: ${u.rowCount} rows updated, expected 1`);
      changes.push({ id: exp.id, ssot: exp.ssot, from, to });
    }
    if (apply) await client.query("COMMIT"); else await client.query("ROLLBACK");
    result = { ok: true, applied: apply, dryRun: !apply, changes };
  } catch (e: any) {
    await client.query("ROLLBACK").catch(() => {});
    return { ok: false, applied: false,
             reason: `not applied (or outcome unknown if the error hit during COMMIT) - check GET /api/ops/v026/db/verify: ${e?.message || e}` };
  } finally {
    client.release();
  }
  if (apply) {
    try { result.after = await inspect(pool, false); }
    catch (e: any) { result.afterError = `committed; post-check read failed (${e?.message || e}) - check GET /api/ops/v026/db/verify`; }
  }
  return result;
}

export function registerOpsV026Routes(app: Express, now?: () => Date) {
  const auth = opsAuth(now);

  // READ-ONLY: state of the 6 rows, links to merged-away records (must be none), registrations since 20 Nov.
  app.get("/api/ops/v026/db/precheck", auth, async (_req, res) => {
    try {
      const checks = await inspect(pool, false);
      const merged = await pool.query(
        `SELECT id, zoho_crm_id FROM public.form_submissions WHERE zoho_crm_id = ANY($1::text[]) ORDER BY id`, [MERGED_AWAY_IDS]);
      const held = await pool.query(
        `SELECT id, zoho_crm_id FROM public.form_submissions WHERE zoho_crm_id = ANY($1::text[]) ORDER BY id`, [HELD_DUPLICATE_IDS]);
      const recent = await pool.query(
        `SELECT id, created_at, processing_status::text AS processing_status, sync_status::text AS sync_status, zoho_crm_id
           FROM public.form_submissions WHERE id > $1 ORDER BY id`, [MAX_ID_IN_20NOV_DUMP]);
      const total = await pool.query(`SELECT count(*)::int AS n, max(id)::int AS max_id FROM public.form_submissions`);
      res.json({
        readyToRelink: checks.every((c) => c.state === "OLD" && c.problems.length === 0) && merged.rows.length === 0,
        rows: checks, linksToMergedAway: merged.rows, linksToHeldDuplicates: held.rows,
        rowsSince20NovDump: recent.rows, totals: total.rows[0],
      });
    } catch (e: any) { res.status(500).json({ error: e?.message || String(e) }); }
  });

  // WRITE (dry run unless body.confirm === "RELINK-6"): old Zoho id -> new Zoho id on the 6 rows, all or nothing.
  app.post("/api/ops/v026/db/relink", auth, async (req, res) => {
    try {
      const result = await change("relink", req.body?.confirm === "RELINK-6");
      console.log(`[OPS v026] relink result ok=${result.ok} applied=${result.applied}`);
      res.status(result.ok ? 200 : 409).json(result);
    } catch (e: any) { res.status(500).json({ error: e?.message || String(e) }); }
  });

  // READ-ONLY: after the relink every row must be in state NEW.
  app.get("/api/ops/v026/db/verify", auth, async (_req, res) => {
    try {
      const checks = await inspect(pool, false);
      res.json({ allRelinked: checks.every((c) => c.state === "NEW" && c.problems.length === 0), rows: checks });
    } catch (e: any) { res.status(500).json({ error: e?.message || String(e) }); }
  });

  // WRITE (dry run unless body.confirm === "ROLLBACK-6"): new Zoho id -> old Zoho id, all or nothing.
  app.post("/api/ops/v026/db/rollback", auth, async (req, res) => {
    try {
      const result = await change("rollback", req.body?.confirm === "ROLLBACK-6");
      console.log(`[OPS v026] rollback result ok=${result.ok} applied=${result.applied}`);
      res.status(result.ok ? 200 : 409).json(result);
    } catch (e: any) { res.status(500).json({ error: e?.message || String(e) }); }
  });
}
