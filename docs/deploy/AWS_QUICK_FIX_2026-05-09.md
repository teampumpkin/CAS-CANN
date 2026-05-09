# AWS Team — One-Line Fix Needed (May 9, 2026)

**Status:** Code is already deployed and live ✅ (GitHub Actions run 25553372360 succeeded yesterday).
**Only blocker:** one environment variable on the ECS task is wrong.

---

## What to change

On the ECS task definition for service `cas-website-task-service-k7z3yzx3` (cluster `cas-cann26`, region `ap-south-1`):

| Variable | Current value (wrong) | Correct value |
|---|---|---|
| `ZOHO_REDIRECT_URI` | `https://amyloid.ca/oauth/zoho/callback` | `https://www.amyloid.ca/oauth/zoho/callback` |

The bare domain `amyloid.ca` returns HTTP 405 on that path — only `www.amyloid.ca` has the working callback route.

## Steps (5 minutes)

1. ECS console → task definition → edit → change the env var → save new revision
2. Update the service to use the new revision → force new deployment
3. Wait ~3 min for the new task to be healthy
4. Confirm in Zoho Developer Console (api-console.zoho.com → CAS Self Client → Authorized Redirect URIs) that `https://www.amyloid.ca/oauth/zoho/callback` is listed. If not, add it and save.
5. Tell Nital it's ready

## After AWS confirms, Nital does this (2 minutes)

1. Open `https://www.amyloid.ca/oauth/zoho/connect` in a browser
2. Sign in to Zoho when prompted
3. Should land on a success page (no "Not Found")
4. Verify with `curl https://www.amyloid.ca/api/test-oauth-token` → expect `"success": true`

## What automatically heals after that

The 4 stranded submissions on prod (#290–#293) will auto-retry within 5 minutes:
- **#290** Niloufar Ahmadbeigi — will sync → real new Lead in Zoho ✅
- **#291** Emilie Theberge — will sync → real new Lead in Zoho ✅
- **#292** Niloufar Ahmadbeigi (DUP of #290 — same email, submitted twice) — will create a 2nd Lead, Jan will need to merge it
- **#293** HEALTHCHECK test record — will create a junk Lead, Nital should manually delete from Zoho after it appears

Total expected outcome: 2 real new Leads, 2 cleanup tasks (1 merge for Jan, 1 delete for Nital).
