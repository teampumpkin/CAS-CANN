# AWS Deploy Briefing — CAS Production Hotfix

**Date:** May 8, 2026
**Severity:** HIGH — production form pipeline currently dropping every new submission to "stranded" status
**Estimated time to fix:** 10–15 minutes once the AWS engineer is in front of the console
**Prepared by:** Replit Agent on behalf of Nital (Team Pumpkin)

---

## TL;DR — What you need to do

1. **Pull and deploy commit `5facf40`** from the Replit repo into the production GitHub repo (`server/zoho-crm-service.ts` is the only meaningful change — 37 added lines, no deletions).
2. **Verify the OAuth callback redirect-URI** is registered as `https://www.amyloid.ca/oauth/zoho/callback` in **both** the Zoho Developer Console AND the env-var that drives the connect endpoint.
3. **Restart the ECS task** so the new code is live AND any missing env vars are picked up.
4. **Have Nital complete the OAuth dance** (`https://www.amyloid.ca/oauth/zoho/connect`) — this only works after step 2.
5. **Confirm** with `https://www.amyloid.ca/api/test-oauth-token` returning `success: true`.

---

## Symptoms in production right now

- `https://www.amyloid.ca/api/test-oauth-token` returns: `{"success":false,"error":"No token found in database"}`
- `https://www.amyloid.ca/api/admin/zoho-crm-analysis` returns `totalRecords: 0` (every Zoho API call fails)
- New form submissions ARE being accepted (HTTP 201, saved to PostgreSQL) — they are NOT pushing to Zoho CRM
- The bulletproof local-first architecture means **zero data loss**; everything queued in `form_submissions` will sync the moment OAuth is restored

## Root causes (two separate bugs, both must be fixed)

### Bug 1: Field-sync engine flattens camelCase incorrectly
- **File:** `server/zoho-crm-service.ts`
- **Function:** `convertToZohoFieldName()` (around line 874)
- **Behavior:** `'amyloidosisType'` → normalized to `'amyloidosistype'` → no underscore → tries to register a brand-new Zoho field that already exists as `Amyloidosis_Type`
- **Impact:** Every form submission containing custom picklist fields (any registration form) eventually marks itself as `failed` after the field-sync step
- **Fix:** Commit `5facf40` adds explicit mappings for all CAS/CANN custom Zoho fields. Pure dictionary additions — no logic change, no risk of regression.

### Bug 2: OAuth callback redirect-URI mismatch
- **Symptom:** `/oauth/zoho/connect` redirects Zoho to `https://amyloid.ca/oauth/zoho/callback` (bare domain — no `www`)
- **Reality:** The bare domain returns HTTP 405 Method Not Allowed for that path; only `www.amyloid.ca` has the working callback route
- **User experience:** Whoever runs the OAuth dance sees a "Not Found" page and the token never lands in the DB
- **Fix:** Update the env var (likely `ZOHO_REDIRECT_URI` or similar) on the ECS task to `https://www.amyloid.ca/oauth/zoho/callback`, AND ensure that exact URL is in Zoho Developer Console → CAS Self Client → Authorized Redirect URIs.

---

## The patch (commit `5facf40`)

**File changed:** `server/zoho-crm-service.ts` only (the docs and other files in the commit are non-code).

**Diff summary:** Adds 37 lines between line 906 and 945, all inside the `standardFieldMappings` Record literal. Pure additions — no existing line is modified or removed.

**Patch file in this Replit:** `docs/deploy/CAS_field_sync_fix.patch` (229 lines, includes commit metadata)

**Apply via either:**
- `git cherry-pick 5facf40` (if the prod repo has the same git history)
- `git am docs/deploy/CAS_field_sync_fix.patch` (standard email-format patch)
- Manual copy-paste of the 37 added lines

Pre-existing TypeScript warnings in the repo are NOT introduced by this patch — they were there before and the production build already runs through them.

---

## Verification checklist (run these in order after deploy)

| # | Action | Expected result |
|---|---|---|
| 1 | `curl https://www.amyloid.ca/api/test-oauth-token` | `"No token found in database"` (NOT `"ZOHO_SELF_CLIENT_ID not configured"` — that would mean secrets are missing) |
| 2 | Visit `https://www.amyloid.ca/oauth/zoho/connect` in browser, log in to Zoho | Should redirect to `https://www.amyloid.ca/oauth/zoho/callback?...` (note the `www.`) and complete without "Not Found" |
| 3 | `curl https://www.amyloid.ca/api/test-oauth-token` again | `{"success":true,...}` |
| 4 | `curl -H "X-Automation-API-Key: <KEY>" https://www.amyloid.ca/api/admin/zoho-crm-analysis` | `totalRecords: 303` (or higher — the count keeps growing) |
| 5 | Submit a real test form on amyloid.ca, wait 30 seconds, check Zoho | New Lead appears |

---

## Required environment variables (verify all present)

| Variable | Used by |
|---|---|
| `ZOHO_SELF_CLIENT_ID` | OAuth token refresh + manual code exchange |
| `ZOHO_SELF_CLIENT_SECRET` | Same |
| `ZOHO_REDIRECT_URI` (or whatever drives the connect endpoint) | Must equal `https://www.amyloid.ca/oauth/zoho/callback` |
| `DATABASE_URL` | PostgreSQL — already working |
| `AUTOMATION_API_KEY` | Admin endpoints — already working |

---

## What NOT to do

- ❌ Do not click "Publish" in Replit — that does not update amyloid.ca
- ❌ Do not modify `Dockerfile`, `.github/workflows/deploy.yml`, or `server/index.prod.ts` unless explicitly approved
- ❌ Do not regenerate the Zoho Self Client secret unless you also update it in AWS at the same moment

---

## After deploy, ping Nital

She has a client meeting today and needs to confirm:
- 12 duplicate pairs in CRM (from yesterday's rescue) — Jan will merge in Zoho UI using `docs/CAS_Duplicate_Merge_Checklist_2026-05-07.xlsx`
- 7 records that fail Record_Type remediation with "invalid data" — need manual Zoho review
- Master meeting doc: `docs/CAS_FINAL_GAP_ANALYSIS_2026-05-07.md`
