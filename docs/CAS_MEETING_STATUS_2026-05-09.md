# CAS CRM Single Source of Truth — Status for Jeff & Jan Meeting

**Date:** May 9, 2026
**Prepared by:** Team Pumpkin (Nital)

## ✅ Done

- All 13 burnt registrations recovered into Zoho (Leads: 247 → 303)
- Field-sync bug identified and patched (`server/zoho-crm-service.ts` — 37 explicit field mappings added)
- Code deployed to production (commit `5facf40`, GitHub Actions run 25553372360 succeeded May 8)
- amyloid.ca returning HTTP 200 with new code
- Field-mapping validation complete — see `docs/CAS_FINAL_GAP_ANALYSIS_2026-05-07.md`
- 12 duplicate pairs identified and documented for merge

## 🟡 Pending — assigned to others

| Owner | Task | ETA |
|---|---|---|
| AWS team | Fix `ZOHO_REDIRECT_URI` env var on ECS (`amyloid.ca` → `www.amyloid.ca`) | 5 min when they start |
| Nital | Re-authorize Zoho OAuth on prod (after AWS done) | 2 min |
| Jan | Merge 12 duplicate pairs in Zoho UI | ~15 min |
| Auto | 4 stranded prod submissions (#290–293) sync once OAuth restored | Automatic |
| Nital | Delete healthcheck Lead (#293) from Zoho after it appears | 1 min |
| Jan | Merge one additional dup pair (Niloufar #290 vs #292) once it appears | 1 min |

## 📊 Final-state numbers (after all pending items complete)

- Zoho Leads: 305 (303 current + 2 from real stranded prod submissions)
- Pending merges: 13 (12 from rescue + 1 from prod double-submit)
- Pending deletes: 1 (healthcheck test record)

## 📁 Reference docs

- `docs/CAS_FINAL_GAP_ANALYSIS_2026-05-07.md` — full SSoT validation
- `docs/CAS_Duplicate_Merge_Checklist_2026-05-07.xlsx` — Jan's merge list
- `docs/CAS_Burnt_Submissions_Rescue_2026-05-07.xlsx` — what was rescued
- `docs/CAS_Rescue_Outcome_2026-05-07.xlsx` — rescue results
- `docs/deploy/AWS_QUICK_FIX_2026-05-09.md` — env var fix for AWS team
- `docs/JAN_MERGE_MESSAGE_2026-05-09.md` — message to send Jan

## 🛡️ What was learned

- Both Replit and AWS prod push to the same Zoho org → manual cross-env rescues create dup risk. Won't happen again unless we do another rescue.
- The bulletproof local-first architecture worked exactly as designed — zero data loss during the outage; everything queued safely until OAuth was restored.
- Long-term improvement to evaluate (Q3): separate Zoho sandbox org for development. Not urgent.
