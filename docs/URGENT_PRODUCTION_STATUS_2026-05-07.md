# 🚨 URGENT — Production Sync Status (as of May 7, 2026, 6:30pm)

## Honest answer to "is every live submission reaching CRM?"

**No.** Production form submissions are being **saved correctly to the production database**, but **none are reaching Zoho CRM right now** because the production Zoho access token is invalid.

This is not a code bug — it's an **expired OAuth credential** that needs to be re-authorised by a Zoho admin user clicking one URL.

## Evidence (live probes of amyloid.ca, just now)

```
GET https://www.amyloid.ca/api/health
{
  "status": "healthy",
  "services": {
    "database":     {"status": "connected", "submissionCount": 194},
    "zoho":         {"status": "disconnected",
                     "message": "No valid Zoho CRM access token available.
                                 Please authenticate via /oauth/zoho/connect"},
    "retryService": {"status": "idle"}
  }
}

GET https://www.amyloid.ca/api/admin/monitoring-status
{
  "tokenHealth": {
    "isValid":      false,
    "needsRefresh": true,
    "provider":     "zoho_crm",
    "error":        "No active token found"
  }
}
```

| Check | Result |
|---|---|
| Production server up? | ✅ Yes (HTTP 200) |
| Production DB connected? | ✅ Yes (194 submissions) |
| Registration form endpoint working? | ✅ Yes (POST returns proper validation) |
| **Production Zoho CRM token?** | ❌ **DEAD — "No active token found"** |
| **Sync worker?** | ❌ Idle, can't push anything to CRM |

## What this means for the CAS / CANN team

- Anyone filling out the registration form **right now** has their data **safely in the production DB**, will get a confirmation popup on the website, but will **NOT** appear in CRM until the token is restored.
- Once the token is restored, the sync worker will **automatically push every backlogged submission** to CRM (this is what the bulletproof DB-first design is for — nothing is lost).
- **Notification emails are still not firing** — that fix is in code locally but not deployed (35 commits unpushed to production).

## Three fixes — in order of urgency

### 1. RECONNECT PRODUCTION ZOHO (5 minutes, do this now)

A Zoho admin (Vasi Karan or whoever owns the `Vasi Karan` CRM user) needs to:

1. Open this URL in a browser, signed into Zoho as a CRM admin:
   ```
   https://www.amyloid.ca/oauth/zoho/connect
   ```
2. It will redirect to Zoho's OAuth consent screen — click **Accept**.
3. Zoho will redirect back to `https://amyloid.ca/oauth/zoho/callback` and the new access + refresh token will be stored in production.
4. Verify it worked by visiting `https://www.amyloid.ca/api/health` — the `zoho` block should change from `"disconnected"` to `"connected"`.
5. Within ~10 seconds the sync worker will pick up any pending submissions and push them to CRM.

> Note: this is the **same OAuth flow** described in the replit.md "Zoho CRM OAuth Setup" section. It should not require any new credentials — it just refreshes the production token using the existing self-client.

### 2. DEPLOY THE 35 PENDING COMMITS (this evening)

Production is currently running code from before today's notification fix. Pending in `origin/main..HEAD`:

- `c793bdc` Fix notification emails and recover stuck form submissions ← **today's notification email fix**
- `cb86e6d` Add analysis and reporting for form submissions
- `4f31593` Ensure user data is consistently formatted before saving
- `4a85052` Fix field-level discrepancies found in Phase 1
- `626071c` task-11: cap SSOT audit log at 500 entries / 5 MB with automatic trimming
- `2c6f273` feat: persist audit log for every live SSOT apply run
- `00a84c5` feat(phase-3): Add January filtered views to Zoho CRM Leads module
- ...and 28 more

This requires a `git push origin main` to the production GitHub repo, which triggers the AWS ECS GitHub Actions deploy. Coordinate with whoever owns that repo (or do it yourself if you have push rights).

### 3. ADD TOKEN-FAILURE ALERTING (this week)

Right now the only way we discovered the prod token was dead is because **I happened to probe `/api/health`**. There's no automated alert when the token expires. Proposed:

- The `monitoring-status` endpoint already runs every 200 seconds and detects token failure
- Add a hook: when `tokenHealth.isValid === false` for >5 minutes, send a Slack/email alert to `vasi.karan@teampumpkin.com` and `nital@teampumpkin.com`
- This way we catch the next token expiry within 5 minutes instead of "whenever someone notices"

I can write that hook in a follow-up commit if you want.

## What I will NOT do without your sign-off

- Push 35 commits to production (you / whoever owns the repo controls deploys)
- Re-auth the Zoho token (only a CRM admin can complete the OAuth consent)
- Touch any submission/CRM data (everything's now staged, awaiting Jan's answers)

## TL;DR for the client (if Jan asks tonight)

> The website is accepting registrations and saving them safely. A Zoho authentication token expired and needs to be refreshed by a Zoho admin clicking one URL — this is a 5-minute fix. Once done, every submission from the past few days will automatically push to CRM (nothing is lost). The notification email fix is also ready to deploy at the same time.

---
**Generated:** 2026-05-07 18:30 UTC by Team Pumpkin engineering
