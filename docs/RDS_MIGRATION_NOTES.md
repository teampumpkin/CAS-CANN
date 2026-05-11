# Neon → AWS RDS Postgres Migration Notes

**Date:** May 11, 2026 · **Task:** #21

## What changed in code

### 1. Database driver swapped (`server/db.ts`)
- **Before:** `@neondatabase/serverless` Pool over WebSocket — Neon-only.
- **After:** Standard `pg` Pool with `drizzle-orm/node-postgres` — works with RDS, Aurora, self-hosted, and Replit's built-in Helium.
- SSL is auto-enabled when the connection string contains `sslmode=require` or the host matches `*.rds.amazonaws.com`. RDS rejects non-SSL connections by default, so this is required.

### 2. Dependencies (`package.json`)
- Added: `pg`, `@types/pg`
- Removed: `@neondatabase/serverless`, `ws`, `@types/ws`

### 3. Stale secrets cleaned
- Removed: `NEON_DATABASE_URL` (was a leftover pointer to the old Neon DB)

## ⚠️ One thing only the user can do — Replit Helium DB still attached

`DATABASE_URL`, `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT` are currently **runtime-managed** secrets — meaning they are auto-set by Replit's built-in Helium Postgres database. The agent cannot delete or override them. As long as Helium is attached, **the Replit dev environment will keep connecting to Helium, not RDS**, regardless of what's in `.env`.

### To finish the dev-side migration:

1. **Open the Database tab** in the Replit sidebar.
2. **Detach / delete the Helium database.** This removes the runtime-managed `DATABASE_URL`, `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT` secrets.
3. **Open the Secrets tab** and add a new `DATABASE_URL` secret pointing at RDS:
   ```
   postgresql://USERNAME:PASSWORD@your-instance.xxxxxxxx.us-east-1.rds.amazonaws.com:5432/DBNAME?sslmode=require
   ```
   The `?sslmode=require` suffix is **mandatory** for RDS.
4. Restart the workflow. The startup banner should change from `🗄️ Database: helium` to `🗄️ Database: <your-rds-host>`.

**Production (AWS ECS) is unaffected by this** — there is no Helium DB on production. The driver swap alone is what fixes production once the user redeploys.

## Production (AWS ECS) checklist

The user has already updated the AWS Secrets Manager secret `cas/database-url`. To make the running production tasks pick up the new value and the new code:

1. **Push to `main`** — this triggers `.github/workflows/deploy.yml`, which builds a new image with the `pg` driver and forces a new ECS deployment. Both happen in one step. ✅ Recommended path.

2. **OR, if you only want to refresh the secret without rebuilding the image** (e.g. you rotate the RDS password later):
   ```bash
   aws ecs update-service \
     --cluster cas-cann26 \
     --service cas-website-task-service-k7z3yzx3 \
     --region ap-south-1 \
     --force-new-deployment
   ```
   ECS pulls secrets fresh on task start, so new tasks get the new value. Existing tasks keep the cached value in memory until they're replaced.

## RDS Security Group — must allow ECS tasks

Make sure the RDS instance's security group has an inbound rule:

| Type | Protocol | Port | Source |
|------|----------|------|--------|
| PostgreSQL | TCP | 5432 | The security group of the ECS tasks (e.g. `sg-xxxxxxxx`) — NOT a CIDR |

Using the ECS task SG as the source is more secure and survives subnet changes. If the rule is missing, the production app will hang on connect and ECS health checks will fail.

## Verification

After cutting over:
- Local Replit: startup log shows the RDS hostname; `npx tsx -e "import {pool} from './server/db.ts'; console.log((await pool.query('select count(*) from form_submissions')).rows[0])"` returns the expected row count.
- Production: open the deployed site, confirm any DB-backed page (e.g. registrations admin) returns data.

## Files changed

- `server/db.ts` — driver swap
- `package.json` / `package-lock.json` — dep swap
- `docs/RDS_MIGRATION_NOTES.md` — this doc
