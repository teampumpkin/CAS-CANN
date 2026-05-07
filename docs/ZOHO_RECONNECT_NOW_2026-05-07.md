# 🔧 How to reconnect production Zoho — fastest path (no deploy required)

## What was broken with the URL you tried

The `/oauth/zoho/connect` URL on production sends Zoho the callback `https://amyloid.ca/oauth/zoho/callback` (no `www`) — but the AWS server **only serves `www.amyloid.ca`**. Every sub-path on the bare `amyloid.ca` domain returns 404. So when you click "Accept" on Zoho, it redirects back to a 404. That's the "Not Found" you saw.

I fixed the code (`server/routes.ts` line 1498 → now uses `https://www.amyloid.ca`), but **deploying that fix takes a git push to the AWS repo first**. There's a faster way that doesn't require a deploy at all.

---

## ✅ Fastest path — Self Client grant (5 minutes, no deploy)

Production is set up to use Zoho's **Self Client** auth, which generates a one-time grant code directly from Zoho's developer console. **No callback URL is needed.**

### Step-by-step (someone with Zoho admin access does this)

**1. Open Zoho API Console**

Go to: **https://api-console.zoho.com**

Sign in as the Zoho admin account that owns the CAS organisation (Vasi Karan or whoever owns CRM user `6999043000000575366`).

**2. Open the existing Self Client**

You should see a client called something like **"CAS Self Client"** with Client ID starting `1000.ZUIGR3UHMCQV0TD…`.

Click it → click the **"Generate Code"** tab at the top.

**3. Generate the grant code**

In the Scope field, paste this **exact** scope string:
```
ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoCRM.users.ALL,ZohoCRM.bulk.ALL,ZohoCRM.notifications.ALL
```

In the Time Duration field: pick **10 minutes** (gives us breathing room).

In the Scope Description: type anything (e.g. "CAS production reconnect 2026-05-07").

Click **CREATE**.

**4. Copy the grant code**

A code that looks like `1000.abc123def456...` will appear. **Copy it immediately — it expires in 10 minutes.**

**5. Send the code to me**

Paste the grant code back in this chat. I'll exchange it for the production refresh token in one API call (using the existing `/api/admin/zoho/regrant-token` endpoint that's already on production). Within ~30 seconds:
- Production will have a new valid token
- The sync worker will pick up every backlogged submission
- `/api/health` will flip to `"zoho":"connected"`
- I'll send you confirmation + the count of records synced

I cannot run step 1–4 myself because they require a logged-in Zoho admin browser session. But step 5 I can run from this environment the moment you give me the code.

---

## 🛠️ Backup path — Fix the OAuth callback flow properly (needs a deploy)

If you'd prefer the long-term fix so the `/oauth/zoho/connect` URL works permanently:

1. **Code change is done** — see commit on `main` branch (line 1498 in `server/routes.ts`).
2. **Add the new redirect URI to Zoho Developer Console:** in your Self Client settings → Authorized Redirect URIs → add `https://www.amyloid.ca/oauth/zoho/callback` (keep the old `https://amyloid.ca/oauth/zoho/callback` too, doesn't hurt).
3. **Push the 35 unpushed commits** (including this fix) to the production repo → AWS ECS auto-deploys.
4. After deploy, `/oauth/zoho/connect` will work end-to-end and the OAuth callback flow will be reusable for future re-auths.

**Recommendation:** do the Self Client grant **NOW** to unblock the backlog of stuck submissions, then schedule the deploy for tonight to fix the OAuth flow permanently. Both paths produce the same end state — but Self Client is faster and works with what's deployed today.

---

## What happens automatically once the token is restored

The bulletproof DB-first design means **you don't need to do anything else** after the token is back. The sync worker (already running in production) will:

1. Detect the new token within seconds
2. Scan the production DB for submissions with `sync_status = 'pending'` or `'failed'`
3. Push each one to Zoho one at a time, with a 10-second gap
4. Mark each as `'synced'` with the Zoho record ID
5. (Once we deploy the notification fix) fire a notification email per record

**Current backlog estimate:** unknown without DB access — could be anywhere from 5 to 50+ records depending on how long the token has been dead. I'll know within 1 minute of the token being restored.

---

## Reply to me with the grant code and I'll do the rest

Just paste the code in this chat (it looks like `1000.xxxxxxxxxx`). I'll handle the exchange, monitor the sync, and report back exactly how many records were recovered.
