**To:** Jeff Peterson, Jan Veenhuyzen
**From:** Nital — Team Pumpkin
**Subject:** CAS/CANN — Full status report + 4 audit files for tomorrow's review

Hi Jeff, hi Jan,

Ahead of tomorrow's call I want to put everything we know on the table in one place, so we can use the time to make decisions instead of re-discovering facts.

**Attached (5 files):**

1. **`CAS_Master_Status_Report_2026-05-07.md`** — the one-page narrative. Read this first.
2. **`CAS_TeamPumpkin_Database_Snapshot_2026-05-07.xlsx`** — every row in our application database, flattened.
3. **`CAS_3Way_Comparison_2026-05-07.xlsx`** — side-by-side of our DB, the SSOT v6 file, and the live CRM. 247 unique people, 246 of them have a discrepancy somewhere.
4. **`CAS_CRM_Deep_Audit_2026-05-07.xlsx`** — live scan of the CRM as it stands today, with every data-quality gap quantified.
5. **`CAS_Duplicate_Merge_Proposal_2026-05-07.xlsx`** — 7 duplicate clusters detected in Leads, ranked by data completeness so the winner is obvious. **Read-only — we did not merge anything.**

**Three things surfaced that we did not know before:**

- The **SSOT v6 file has "Unknown" in every consent and membership column** (228 of 232 rows). It cannot be the consent source. The actual Yes/No values in CRM came from somewhere else — most likely the MS Forms export Jan mentioned, which we have never seen. **Could you send it?**
- **No web form submissions since Feb 21, 2026.** Zero in 75+ days. Either the public form is broken, or every new record since February was entered manually. We will diagnose this week.
- **CASL is not defensible today.** The audit-trail table exists but is empty. The Master Report lays out a 3-day plan to fix it.

**What we are asking from tomorrow's call:**

The Master Report ends with a list of six decisions (A1–A6) plus a proposed week-by-week plan. The shortest version: tell us which of the 7 duplicate merges to execute, send the MS Forms file, and give us the green light to start the CASL build on Friday.

**What we are NOT doing without your sign-off:**

- No merges, no deletes, no overwrites of any non-empty CRM field.
- No mass communications until CASL items are wired up.

Standing by for your direction.

— Nital
Team Pumpkin
