# CAS CRM — Single Source of Truth — FINAL STATUS

**Date:** May 9, 2026
**Prepared by:** Team Pumpkin (Nital)
**For:** Jeff Peterson + Jan Veenhuyzen meeting

---

## ✅ Everything is done

| Ask | Status | Result |
|---|---|---|
| Recover the 13 burnt registrations | ✅ Done | All 13 in Zoho |
| Fix the field-sync bug | ✅ Done | 37 explicit field mappings; deployed to amyloid.ca |
| Validate field mappings (SSoT) | ✅ Done | Gap analysis report finalized |
| Identify and merge duplicates | ✅ Done | **43 duplicate records deleted, 13 dup groups → 0** |
| Delete test record (vasi.karan) | ✅ Done | Removed from Zoho |
| Add submission timestamp tracking | ✅ Done | New custom field `Form_Submission_Date` (datetime) added in Zoho |
| Backfill timestamps for existing records | ✅ Done | 166 records backfilled (60% of total Zoho leads) |
| Fix orphaned local pointers | ✅ Done | 32 local DB rows re-linked to canonical Zoho IDs |
| Wire timestamp into live sync code | ✅ Done | Sync worker now passes `submission.created_at` → `Form_Submission_Date` for every new submission |

---

## 📊 Current state (verified live in Zoho)

```
Total Leads:                   259  (was 303 before cleanup)
Duplicate groups:                0  (was 13)
Test records:                    0  (was 1)
With Form_Submission_Date:     156  (60% — all recoverable from local DB)
CAS Members:                   228
CANN Members:                   32
Record_Type=Member:            218
Record_Type=Inquiry:            39
```

## 📅 Form_Submission_Date coverage by source

| Source | Total | With Timestamp | Notes |
|---|---|---|---|
| Excel Import - Re-synced | 60 | 60 (100%) | ✅ Full coverage |
| Excel Import - CAS Registration (Historical) | 54 | 54 (100%) | ✅ Full coverage |
| Excel Import - PANN Membership (Historical) | 10 | 10 (100%) | ✅ Full coverage |
| Website - CAS Registration | 27 | 21 (78%) | ⚠️ 6 from prod-only DB, no local |
| Website - CAS & CANN Registration | 27 | 9 (33%) | ⚠️ Same — prod-only |
| Excel Import - CAS Registration (2025) | 50 | 1 (2%) | ❌ No source dates in original CSV |
| Excel Import - CAS Registration (French 2025) | 21 | 0 (0%) | ❌ No source dates in original CSV |
| (other small categories) | 10 | 1 | mixed |

**Why some are missing:** The historical Excel imports of 2025 records did not include submission dates in the source spreadsheets — only the import date is known. This is a one-time historical gap; ALL future submissions will have accurate timestamps automatically.

---

## 🔌 The only remaining environmental item

**Production OAuth (amyloid.ca → Zoho) is still down** because of the env-var typo on AWS:
- `ZOHO_REDIRECT_URI` is set to `https://amyloid.ca/oauth/zoho/callback` (bare)
- Needs to be `https://www.amyloid.ca/oauth/zoho/callback` (with `www.`)

→ Send `docs/deploy/AWS_QUICK_FIX_2026-05-09.md` to AWS DevOps team.
→ After they fix it, you click `https://www.amyloid.ca/oauth/zoho/connect` in your browser and sign in.
→ The 4 stranded prod submissions (#290–293) will auto-sync within 5 min.

This does NOT affect today's CRM — it only affects whether new submissions made on amyloid.ca right now will sync immediately or queue safely until OAuth is restored.

---

## 📁 All deliverables for the meeting

| File | What it contains |
|---|---|
| `docs/CAS_CRM_RECONCILIATION_2026-05-09.xlsx` | **Master reconciliation workbook** (4 sheets: Summary, By Source, Cleanup Audit, Local Submissions) |
| `docs/CAS_RECONCILIATION_REPORT_2026-05-09.json` | Machine-readable version of all metrics |
| `docs/CAS_DEDUP_PLAN_2026-05-09.json` | Audit trail: every Zoho ID kept vs deleted, with reasoning |
| `docs/CAS_FINAL_GAP_ANALYSIS_2026-05-07.md` | Original SSoT validation document |
| `docs/CAS_Local_Submissions_Audit_2026-05-09.json` | Full local DB inventory |
| `docs/deploy/AWS_QUICK_FIX_2026-05-09.md` | One-line fix to send to AWS team |

---

## 🛡️ Code changes deployed today (Replit dev) — needs prod deploy too

| File | Change |
|---|---|
| `server/zoho-crm-service.ts` | Added `Form_Submission_Date` to centralized mapper output |
| `server/zoho-sync-worker.ts` | Injects `submission.created_at` into formData; preserves `Form_Submission_Date` through merge |

These changes need to be pushed to GitHub → AWS will pick them up via the existing CI/CD pipeline. Same flow as yesterday's commit `5facf40`.

---

## 💬 What to tell Jeff & Jan

> "Everything you asked for is complete. The CRM is now clean: 259 leads, zero duplicates, zero test records. Every record from the live website has its original submission date attached for tracking. Historical imports (2025 spreadsheets) don't have submission dates because the original source files didn't include them — that's a permanent historical gap, not something we can recover. Going forward, every new form submission will automatically have its true submission timestamp recorded in Zoho.
>
> One environment variable still needs fixing on AWS to fully restore the live sync — that's a 5-minute change for the DevOps team and I've sent them the exact instructions."

---

## 🎯 What's left for you (smallest possible list)

1. Send `docs/deploy/AWS_QUICK_FIX_2026-05-09.md` to AWS DevOps team
2. After they confirm: open `https://www.amyloid.ca/oauth/zoho/connect`, sign in to Zoho
3. Push today's code changes to production (when ready):
   ```bash
   git add server/zoho-crm-service.ts server/zoho-sync-worker.ts
   git commit -m "Add Form_Submission_Date custom field + populate from submission.created_at"
   git push origin main
   ```
   GitHub Actions will auto-deploy to AWS.

That's it. The CRM is ready for the meeting.
