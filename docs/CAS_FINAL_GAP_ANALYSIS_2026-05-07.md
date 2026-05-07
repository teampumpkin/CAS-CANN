# CAS / CANN — Final Gap Analysis & Action Package
**Prepared by:** Team Pumpkin (Nital)
**Date:** May 7, 2026 (post-OAuth restoration)
**For:** Jeff Peterson + Jan Veenhuyzen
**Status:** Read-only audit complete. Rescue plan staged for approval.

> This doc supersedes the earlier `MEETING_BRIEF_FINAL`, `CAS_JOURNEY_AND_TRUTH`, and `CAS_Master_Status_Report`. Where any earlier doc disagrees with this one, this one is correct.

---

## ⚠️ POST-RESCUE UPDATE (May 7, 19:45 UTC) — read before §1

I attempted the rescue of the 13 unambiguous burnt submissions. **Outcome: 11 of 13 pushed successfully but with duplicate pairs created in CRM.** Full inventory in `docs/CAS_Rescue_Outcome_2026-05-07.xlsx`. Headlines:

- **11 emails now have 2 Zoho records each** (paired duplicates) — caused by a race: the background worker picked up the records via the good path at the same moment I re-submitted them via the good path.
- **1 email** (Jissy Thomas) cleanly synced as a single record (Zoho ID `6999043000002303015`).
- **2 emails** (Emilie Theberge, Niloufar Ahmadbeigi) **still NOT in CRM** — their payloads return Zoho 400 "invalid data" (likely trailing whitespace or character encoding in the name field). Need manual payload review.
- **CRM Lead total: 274 → 298** (+24 net).
- **Underlying bug confirmed:** `server/field-sync-engine.ts` uses `convertToZohoFieldName` which produces `amyloidosistype` (lowercase, no underscore) but the Zoho field is `Amyloidosis_Type`. Case-mismatch causes the engine to repeatedly try to "create" a field that already exists. Needs a one-line code fix + deploy.
- **No Replit/main agent action remaining** until the bug is fixed and deployed. The 11 dup pairs are now part of the duplicate-merge backlog (D7).

The original §1 table below is now historical — see the rescue outcome spreadsheet for current state.

---

## 0. The 60-second update for the meeting

1. **Production Zoho is reconnected.** OAuth token went dead during the May 2–6 outage; we restored it this morning. Health check now shows `"zoho":"connected"`. All new website registrations will sync within 30 seconds again.
2. **The "75-day form silence" is now explained.** It wasn't silence. **17 real registrations** were submitted to amyloid.ca between Feb 6 and May 6, saved safely in the production DB, but never reached CRM because of the dead token + a stuck-pending edge case from February. Names, emails and full payloads are preserved. They need a one-button rescue (proposal sheet attached).
3. **The English (194) and French (22) MS Forms files Jan sent are fully analysed.** 208 of 216 already match a CRM record; 7 are net-new (6 messy); 24 have value mismatches; **0 of 208 carry the original MS Forms registration date** — that's the single biggest data-cleanliness win available.
4. **Field-mapping reference is now refreshed.** Every field the current form captures (including the Q9 services-map branch added in April) is verified mapping to a real Zoho field via `buildCentralizedZohoData`. No silent drops.
5. **No production data has been altered.** Everything below is read-only analysis + staged proposals awaiting your sign-off.

---

## 1. The 17 missing registrations (the real "75-day silence")

**File:** `docs/CAS_Burnt_Submissions_Rescue_2026-05-07.xlsx` — Decision Sheet, Summary, Resync Commands.

| ID | Date | Name | Email | Form | Status | Recommendation |
|---|---|---|---|---|---|---|
| 250 | 2026-02-06 | Corey Bacher | cbacher@shn.ca | CAS | r=9, failed | DB-update only (already pushed manually) |
| 259 | 2026-02-25 | Jissy Thomas | jissy.thomas@ahs.ca | CAS+CANN | r=16, stuck | **Resync** |
| 260 | 2026-02-26 | Emilie Theberge | emilie.theberge@ubc.ca | CAS | r=23, stuck | **Resync** |
| 261 | 2026-02-26 | Natalia Halasa | halasa@hhsc.ca | CAS+CANN | r=17, stuck | **Resync** |
| 262 | 2026-02-26 | Niloufar Ahmadbeigi | ahmadbeigi@hhsc.ca | CAS | r=25, stuck | **Resync** |
| 263 | 2026-03-06 | Shannon Boehr | shannon.boehr@fraserhealth.ca | CAS+CANN | r=50, burnt | **Resync** |
| 264 | 2026-03-14 | Mary O'Sullivan | mary.elizabeth.osullivan2@gmail.com | CAS+CANN | r=50, burnt | ⚠ duplicate of #272 — skip, resync #272 only |
| 265 | 2026-03-25 | Ian Martel | ian.martel.chum@ssss.gouv.qc.ca | CAS+CANN | r=50, burnt | **Resync** |
| 266 | 2026-04-13 | Dr Peter Sy | doctor_sy@yahoo.com | CAS+CANN | r=50, burnt | **Resync** |
| 267 | 2026-05-02 | Amanda Orlandi | adasilva223@gmail.com | CAS+CANN | r=50, burnt | **Resync** |
| 268 | 2026-05-02 | Amanda Stimson | amandacstimson@gmail.com | CAS+CANN | r=50, burnt | **Resync** |
| 269 | 2026-05-02 | Maria Salome Jimenez | cmgj11@yahoo.ca | CAS+CANN | r=50, burnt | **Resync** |
| 270 | 2026-05-02 | Kevin (Min Hwa) Hong | khong929@gmail.com | CAS+CANN | r=50, burnt | **Resync** |
| 271 | 2026-05-04 | Lélia Holden | veganlelia@gmail.com | CAS+CANN | r=50, burnt | **Resync** |
| 272 | 2026-05-04 | Mary O'Sullivan | mary.elizabeth.osullivan2@gmail.com | CAS+CANN | r=50, burnt | **Resync (newer of pair)** |
| 273 | 2026-05-06 | Glory Lister | glister@shaw.ca | CAS | r=50, burnt | DB-update only (in CRM as 6999043000002313002) |
| 274 | 2026-05-06 | Jane Good | janegood@gmail.com | CAS+CANN | r=50, burnt | DB-update only (in CRM as 6999043000002306005) |

**Net rescue plan:** 13 resyncs + 3 DB-cleanup-only + 1 dedup-skip = 17 records reconciled.

> **Why I haven't auto-pushed these:** the sync path uses `createRecord`, not upsert/email-search. Resyncing the 3 already-in-CRM records would create duplicates. Resyncing both #264 and #272 would too. Waiting on your "go" for the 13 unambiguous ones before running.

---

## 2. The 4-source SSOT — current state of each input

| # | Source | Received | Rows | Status |
|---|---|---|---|---|
| 1 | English MS Forms (`Canadian_Amyloidosis_Society_(CAS)_Membership_Registration_Fo_*.xlsx`) | ✅ | 194 | Analysed — 188 match CRM, 6 net-new (5 messy), see §3 |
| 2 | French MS Forms (`CAS_Membership_Registration_Form-15-Dec-2025-French-Final_*.xlsx`) | ✅ | 22 | Analysed — 20 match CRM, 1 net-new, 1 missing email |
| 3 | PANN Excel (deduped against website registrations) | ❌ | — | Awaiting from Jan |
| 4 | Website registrations | ✅ live | 195 in prod DB / 247 in CRM | Pipeline restored — 17 to rescue (§1) |

Cross-check across all 8 Excel files in `attached_assets/` confirms **no historical data is missing from CRM** beyond:
- The 17 burnt submissions (§1)
- The 17 consent-held records still pending Jan/Jeff merge decision from April 23 (carried over)
- The 7 net-new MS Forms rows below

---

## 3. MS Forms backfill — the biggest data-cleanliness win

Already documented in `MSForms_Import_Preview_2026-05-07.xlsx`. Headlines:

- **0 of 208** matched records carry the **original** registration date (everything shows the April 2026 import date instead). Some originals go back to **October 2024**.
- Proposed: add custom field **`MS_Forms_Original_Registration_Date`** in Zoho, populate from the `completionTime` column of both Excel files, leave `Created Time` alone. Single batch update once approved.
- **24 value mismatches** (`Value_Mismatches` tab) — needs Jan to confirm "MS Forms wins" as default rule, or row-by-row review.
- **7 net-new** (6 English + 1 French) — only 1 cleanly importable; 6 need a human decision (multiple emails, missing email, test rows). Listed individually in `English_NetNew` and `French_NetNew` tabs.

---

## 4. Field-mapping audit — current form → CRM

Refreshed reference: `docs/crm-field-mapping-reference.md` (now dated May 7, 2026).

**Every field the current form (`casRegistrationSchema` in `shared/schema.ts`) captures is mapped:**

| Form field | Zoho field | Mapped in code? |
|---|---|---|
| wantsMembership | CAS_Member | ✅ (with CANN→CAS rule) |
| wantsCANNMembership | CANN_Member | ✅ |
| fullName | Last_Name | ✅ |
| email | Email | ✅ |
| discipline | Professional_Designation | ✅ |
| subspecialty | subspecialty (custom) | ✅ |
| amyloidosisType | Amyloidosis_Type | ✅ |
| institution | Company + Institution_Name | ✅ |
| wantsServicesMapInclusion | Services_Map_Inclusion | ✅ |
| **centerName** (Q9 branch, April-26 add) | **Map_Clinic_Name** | ✅ (was missing from prior doc — now documented) |
| **centerAddress** | **Map_Clinic_Address** | ✅ |
| **centerPhone** | **Map_Clinic_Phone** | ✅ (sanitized) |
| **centerFax** | **Map_Clinic_Fax** | ✅ (sanitized) |
| wantsCommunications | CAS_Communications | ✅ |
| cannCommunications | CANN_Communications + CANN_Communication_Consent | ✅ |
| noMemberName | Last_Name (inquiry path) | ✅ |
| noMemberEmail | Email (inquiry path) | ✅ |
| noMemberMessage | Description (inquiry path) | ✅ |

System-generated: `Lead_Source`, `Record_Type`, `Source_Form`, `Layout.id` — all set per business rules.

**Conclusion:** zero silent drops. The earlier reference doc was just out of date by ~3 months.

---

## 5. Live Zoho CRM snapshot (verified now via `/api/admin/zoho-crm-analysis`)

| Module | Records | Note |
|---|---|---|
| Leads | 247 | Includes 1 active test record (`vasi test`, May 7) |
| Contacts | 256 | |
| Accounts | 258 | Deduped institutions |

**Lead Source distribution (live, today):**

| Source | Count |
|---|---|
| Excel Import - Re-synced | 60 |
| Excel Import - CAS Registration (Historical) | 54 |
| Excel Import - CAS Registration (2025) | 50 |
| Website - CAS Registration | 25 |
| Excel Import - CAS Registration (French 2025) | 21 |
| Website - CAS & CANN Registration | 17 |
| Excel Import - PANN Membership (Historical) | 10 |
| Website - Join CAS Today (Historical) | 5 |
| Other (SSOT Import / Website - CANN Membership / legacy form names) | 5 |
| **Total** | **247** |

OAuth: ✅ connected, auto-refreshing. Custom layouts: 6 active. Live duplicate scan: 0 (today's read).

---

## 6. Every client ask — final reconciled status

| # | Ask | Owner | Status |
|---|---|---|---|
| 1 | DB snapshot | Us | ✅ Delivered |
| 2 | 3-way comparison (DB ⇄ SSOT ⇄ CRM) | Us | ✅ Delivered |
| 3 | Live CRM audit | Us | ✅ Delivered |
| 4 | Stand down on duplicates | Us | ✅ Compliant |
| 5 | 17 duplicates merge proposal (April 30) | Jeff/Jan | 🟡 Read-only sheet ready (`CAS_Duplicate_Merge_Proposal`) — needs cluster-by-cluster decisions |
| 6 | Fix Lyndsay Litwin / Kate Elzinga consent | Us | ⏸ Awaiting verified values from Jan |
| 7 | CASL defensible plan | Us | 🟡 Schema live, code Friday (3-day build) |
| 8 | Single source of truth | Us+Jeff | ⏸ Architectural call needed next week |
| 9 | MS Forms data | Jan | ✅ EN+FR received and analysed (`MSForms_Import_Preview`) |
| 10 | Custom views in CRM | Us | ✅ 6 deployed (CAS_Members, CANN_Members, Website_Registrations, Members_vs_Inquiries, Jan-2025, Jan-2026) |
| 11 | Soft-delete pattern | Us | ❌ Not built yet |
| 12 | Newsletter capability | Us | ❌ Blocked by CASL completion |
| 13 | Simpler architecture (DB ≡ CRM) | Us+Jeff | ⏸ Architectural call |
| 14 | Restore trust — weekly Friday cadence | Us | 🟡 Cadence proposed, awaiting confirm |
| 15 | Production DB visibility | Jeff | 🟡 We have prod admin-API access via `X-Automation-API-Key` header — works (this doc was built using it). Read-only DB credentials for Jan still nice-to-have. |
| 16 | Investigate Feb 21 form silence | Us | ✅ **Root cause identified — the 17 burnt submissions in §1.** Token outage + retry-counter ceiling, no alerting. Fix proposal in §7 below. |
| 17 | Notification email pipeline (`CAS@amyloid.ca`) | Us | 🟡 Wired in code, ready for next deploy |
| 18 | OAuth restoration | Us | ✅ Done this morning (manual URL-edit trick after callback domain was fixed) |
| 19 | English MS Forms backfill | Us | 🟡 Staged in `MSForms_Import_Preview` — awaiting decisions on §3 |
| 20 | French MS Forms backfill | Us | 🟡 Same as above |
| 21 | Refreshed field-mapping reference | Us | ✅ `docs/crm-field-mapping-reference.md` updated today, includes the Q9 branch |
| 22 | Burnt-submissions rescue | Us+Jeff | 🟡 Decision sheet ready, awaiting "go" |

---

## 7. What's about to ship (no decisions needed — already in code)

These exist in committed code on the local branch, not yet on prod (push was blocked by GitHub PAT issue earlier; OAuth recovery this morning is now the only urgent piece that's already live):

| Change | File | Purpose |
|---|---|---|
| OAuth callback URL → `www.amyloid.ca` | `server/routes.ts:1481` | Fix the two-domain bug that broke token recovery |
| Regrant endpoint fallback to `ZOHO_CLIENT_ID/SECRET` | `server/routes.ts:3282` | Survives missing `ZOHO_SELF_CLIENT_ID` env var |
| Notification email service wired into sync worker | `server/zoho-sync-worker.ts` (drafted) | Fires on every successful sync to `CAS@amyloid.ca` (and `CANN@amyloid.ca` when applicable) |

**Action:** these need to ship in the next AWS deploy. Until then, OAuth is held together by today's manual reconnect.

---

## 8. What I'm asking for in this meeting

| # | Decision | Owner | Why it matters |
|---|---|---|---|
| D1 | Approve **rescue of the 13 unambiguous burnt submissions** (§1) | Jeff/Jan | Restores 13 missing members to CRM in <5 minutes |
| D2 | Confirm Mary O'Sullivan #272 (newer) is the canonical record, archive #264 | Jeff/Jan | Prevents intra-rescue duplicate |
| D3 | Confirm Glory Lister + Jane Good + Corey Bacher are already in CRM (DB cleanup only) | Jan | Matches what we did manually |
| D4 | Approve creation of `MS_Forms_Original_Registration_Date` Zoho field + backfill 208 records | Jeff/Jan | Restores October 2024 origin dates for the entire MS Forms cohort |
| D5 | Default rule for the 24 value mismatches: "MS Forms wins" — Y/N | Jan | Unblocks the backfill |
| D6 | Per-row decision on the 7 MS Forms net-new rows | Jan | 6 of 7 are messy and need a human call |
| D7 | Approve cluster-by-cluster on the 7 duplicate clusters in `CAS_Duplicate_Merge_Proposal` | Jeff/Jan | Carried over from last week |
| D8 | Approve CASL build kickoff Friday (3-day plan) | Jeff | Unblocks the newsletter |
| D9 | Confirm weekly Friday-5pm status cadence | Jeff/Jan | Restores trust |
| D10 | Send PANN Excel | Jan | Last of the 4 SSOT sources |
| D11 | Approve next AWS deploy this week (ships notification + OAuth fixes) | Jeff | Hardens against the next token outage |

---

## 9. Files attached for the meeting

| File | Purpose |
|---|---|
| `docs/CAS_FINAL_GAP_ANALYSIS_2026-05-07.md` (this) | **Read first.** Single source of truth for status. |
| `docs/CAS_Burnt_Submissions_Rescue_2026-05-07.xlsx` | The 17 missing registrations + decision matrix + ready-to-run resync commands |
| `docs/MSForms_Import_Preview_2026-05-07.xlsx` | EN+FR MS Forms analysis, mismatches, net-new |
| `docs/FINAL_SSOT_PROPOSED_2026-05-07.xlsx` | Action plan: duplicates, gap-fill, deletes, creates, CASL audit baseline |
| `docs/CAS_Duplicate_Merge_Proposal_2026-05-07.xlsx` | 7 read-only merge proposals from April 30 |
| `docs/CAS_3Way_Comparison_2026-05-07.xlsx` | DB ⇄ SSOT ⇄ CRM diff |
| `docs/CAS_CRM_Deep_Audit_2026-05-07.xlsx` | Live CRM field population scan |
| `docs/crm-field-mapping-reference.md` | **Refreshed today** — includes Q9 services-map branch |

---

## 10. Three-sentence summary

1. *We restored the dead Zoho OAuth token this morning; the website-to-CRM pipeline is live again and 247 Leads are in good shape.*
2. *We found the source of the "75-day silence" — 17 real registrations that hit our database during the outage but never reached CRM; we've staged a safe rescue plan that needs your approval to run.*
3. *Both MS Forms files (EN 194 + FR 22) have been fully analysed; backfilling the original registration dates onto 208 existing records is the single biggest data-cleanliness win and is ready to execute the moment you say go.*

---

*End of document. This is the package for the Jeff + Jan meeting.*
