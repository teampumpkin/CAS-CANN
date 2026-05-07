# CAS / CANN — Master Status Report
**Prepared by:** Team Pumpkin
**Date:** May 7, 2026
**For:** Jeff Peterson, Jan Veenhuyzen
**Status:** Read-only audit. No production data has been altered.

---

## 1. Executive Summary

This report consolidates everything we now know about the CAS / CANN data ecosystem: our application database, the live Zoho CRM, the SSOT v6 file we were given, the form submission history, and the bulk import history. Three previously unknown facts surfaced during this audit and need a joint decision in this week's meeting.

### 🚨 Critical findings

| # | Finding | Impact |
|---|---|---|
| 1 | **The SSOT v6 file contains "Unknown" for membership and consent on 228 of 232 rows.** Only 4 rows have any value at all. | The SSOT cannot be the source of truth for consent. Whoever populated Yes/No values into the CRM did so from a source we have never seen (likely MS Forms). |
| 2 | **No form submissions since Feb 21, 2026** — 75+ days of zero activity in `form_submissions`. | Either the public form is broken / disabled, or every new sign-up since February was entered manually directly into Zoho. Needs investigation. |
| 3 | **`consent_history` table is empty.** Schema is in place; no audit rows exist for any of our ~247 known people. | We are not CASL-defensible today. Backfill + write-on-submit is the highest priority engineering task. |

---

## 2. Database (PostgreSQL — our application's source of truth)

### 2.1 Tables and row counts

| Table | Rows | Earliest | Latest | Purpose |
|---|---|---|---|---|
| `form_submissions` | **173** | 2025-12-16 | **2026-02-21** | Every form ever submitted (web + bulk) |
| `submission_logs` | 1,535 | 2025-12-16 | 2026-02-24 | Every API call attempt to Zoho |
| `townhall_registrations` | 2 | 2025-11-28 | 2025-12-01 | CANN Townhall event sign-ups |
| `resources` | 9 | 2025-06-16 | 2025-11-19 | Clinician-uploaded files |
| `consent_history` | **0** | — | — | CASL audit trail (empty) |
| `consent_tokens` | 0 | — | — | Unsubscribe link tokens (none issued) |
| `campaign_syncs` | 0 | — | — | Newsletter sync log (no campaigns sent) |
| `oauth_tokens`, `field_mappings`, `field_metadata_cache`, `form_configurations`, `event_admins`, `users`, `applied_migrations`, `automation_workflows`, `action_executions`, `workflow_executions` | — | — | — | Infrastructure tables |

### 2.2 Form submission breakdown

| Form name | Source | Sync status | Count |
|---|---|---|---|
| Excel Import — CAS Registration | `excel-import` | synced | **127** |
| Excel Import — PANN Membership | `excel-import` | synced | **29** |
| CAS & CANN Registration (web) | website | synced | **16** |
| CAS Registration (web) | website | **failed** | **1** |
| **Total** | | | **173** |

**Web form submissions: 17 of 173 (only ~10%).** The vast majority of records were created by Excel imports, not by people filling out the form.

### 2.3 Submission timeline

| Month | Submissions |
|---|---|
| 2025-12 | 157 (the bulk import batch) |
| 2026-01 | 12 |
| 2026-02 | 4 |
| 2026-03 → today | **0** |

### 2.4 Submission log operations

| Operation | Status | Count | Note |
|---|---|---|---|
| `received` | success | 17 | Web form receipts |
| `crm_push` | success | 1,261 | Successful Zoho writes (incl. retries) |
| `crm_push` | failed | **6** | Hard failures |
| `retry_attempt` | failed | **251** | Records that needed retry — system recovered them |

**Translation:** the local-first / retry pipeline is working as designed. 251 retry-failures sounds bad, but they were eventually rescued. Only **6 records hard-failed** and are still unresolved in our DB.

---

## 3. Live Zoho CRM (production)

### 3.1 Module counts

| Module | Records |
|---|---|
| Leads | 243 |
| Contacts | 256 |
| Accounts | 258 |
| **Total people** | ~499 raw / ~247 unique |

### 3.2 Data-quality gaps (Leads)

| Gap | Count | % |
|---|---|---|
| Missing First or Last Name | **170** | 70% |
| Missing `Source_Form` | **115** | 47% |
| Missing `Institution_Name` | **19** | 8% |
| Missing Email | 0 | 0% |
| Custom views configured | **0** | — |

### 3.3 Duplicates (live scan, today)

| Match type | Clusters |
|---|---|
| Exact email | 0 |
| Same first+last name (different email) | 4 |
| Same email local-part across domains | 4 |
| Same phone | 0 |
| **Total clusters** | **7** covering 14 records (Leads only) |

> Jan reported 17 duplicates on April 30. The remaining 10 are likely Lead↔Contact cross-module pairs. We can extend the scan if the meeting calls for it.

### 3.4 Auth / infrastructure

- ✅ OAuth token refreshing automatically (Self Client, owner: Vasi Karan)
- ✅ Endpoint correct (`https://www.zohoapis.com/crm/v8/`)
- ❌ `org` scope missing (cosmetic, not blocking)

---

## 4. SSOT v6 File Review

**File:** `2026_04_CAS_CANN_Members_SSOTv6_FINAL.xlsx` (provided April 2026)
**Sheets:** 1 (`SSOT`) **Rows:** 232 **Columns:** 15

### 4.1 What's in it

| Field | Populated | Notes |
|---|---|---|
| `first_name`, `last_name`, `email` | 230 / 232 | 2 rows missing email |
| `institution`, `discipline`, `subspecialty` | mostly populated | |
| `zoho_lead_id` | 225 / 232 | Cross-reference to CRM |
| `cas_member` | **228 = "Unknown"**, 4 = blank | 🚨 No actual values |
| `cann_member` | **228 = "Unknown"**, 4 = blank | 🚨 No actual values |
| `cas_contact_permission` | **228 = "Unknown"**, 4 = blank | 🚨 No actual values |
| `cann_contact_permission` | **228 = "Unknown"**, 4 = blank | 🚨 No actual values |
| `map_inclusion_preference` | **228 = "Unknown"**, 4 = blank | 🚨 No actual values |
| `membership_scenario` | **228 = "Unknown"**, 4 = blank | 🚨 No actual values |

### 4.2 Source breakdown

| `source_dataset` | Count |
|---|---|
| SSOT | 226 |
| CRM | 2 |
| (blank) | 4 |

### 4.3 What this means

The SSOT file was a **directory of names + institutions** — not a consent register. Every Yes/No currently sitting in our CRM came from elsewhere. Most likely the **MS Forms** export Jan referenced. We have never seen the MS Forms file.

**Required action:** Jan to send the MS Forms export so we can run a 4-way comparison (DB ⇄ SSOT ⇄ MS Forms ⇄ CRM) and identify exactly which consent values are defensible.

---

## 5. Bulk Import History

| Import batch | Source file | Records loaded | Date |
|---|---|---|---|
| CAS Registration Excel | `CAS Registration_1760548966285.xlsx` | 127 | Dec 2025 |
| PANN / CANN Membership Excel | `CANN Contacts_1760548966283.xlsx` | 29 | Dec 2025 |
| **Total imported** | | **156** | |

**No deduplication was performed at import time.** Same person appearing in both Excel files would have created two records. This is one likely root cause of the 7+ duplicate clusters now in CRM.

---

## 6. CASL Compliance Status

| Requirement | Status |
|---|---|
| Express written consent on record | ❌ Not for any of 247 people |
| Audit trail of when/how consent was obtained | ❌ `consent_history` empty |
| Source-form documentation per record | ⚠️ Missing on 47% |
| Identification of sender in messaging | ⚠️ Pending newsletter wiring |
| Working unsubscribe mechanism | ❌ No `/unsubscribe` page |
| Granular preferences (CAS / CANN / Map) | ❌ No `/preferences` page |
| 10-day unsubscribe response | ❌ No mechanism |
| Records retained for 3 years | ✅ DB has full history |

**Risk:** sending a CASL-regulated message today would not be defensible. Any newsletter campaign must wait until items 1, 2, 5, 6 are in place.

---

## 7. What We Have Already Delivered

| File | Purpose | Audience |
|---|---|---|
| `CAS_TeamPumpkin_Database_Snapshot_2026-05-07.xlsx` | Every row in our DB, flattened | Jan |
| `CAS_3Way_Comparison_2026-05-07.xlsx` | DB ⇄ SSOT ⇄ CRM, 247 people, 246 with discrepancies | Jeff + Jan |
| `CAS_CRM_Deep_Audit_2026-05-07.xlsx` | Live CRM scan, every gap quantified | Jeff |
| `CAS_Duplicate_Merge_Proposal_2026-05-07.xlsx` | 7 read-only merge proposals with winner ranking | Jeff + Jan to action |
| `CAS_Master_Status_Report_2026-05-07.md` (this file) | One-page narrative tying everything together | Both |

---

## 8. Proposed Resolution Plan (for client approval)

### Phase A — Decisions (this week's meeting)
| # | Item | Owner | Decision needed |
|---|---|---|---|
| A1 | Approve 7 duplicate merges (per proposal sheet) | Jeff + Jan | Approve / edit / reject each cluster |
| A2 | Confirm SSOT v6 is NOT the consent source | Jeff + Jan | Confirm we should use MS Forms instead |
| A3 | Share MS Forms export | Jan | Send file |
| A4 | Authorize "fill empty fields" backfill | Jeff | Yes / no (no overwrites) |
| A5 | Authorize CASL build (items 11–15 below) | Jeff | Yes / no |
| A6 | Investigate Feb 21 → today form silence | Us + Jan | Verify form is reachable from public site |

### Phase B — Safe data fixes (Thu-Fri this week, ~12 hrs)
| # | Item | Method | Safety |
|---|---|---|---|
| B1 | Backfill 170 missing names → CRM | Pull from our DB, fill empties only | Never overwrites |
| B2 | Backfill 115 missing `Source_Form` → CRM | Same | Never overwrites |
| B3 | Backfill 19 missing institutions → CRM | Same | Never overwrites |
| B4 | Build 6 custom views in CRM | API POST | Read-only views |
| B5 | Execute approved merges from A1 | Per Jeff/Jan sign-off | Manual review |
| B6 | Fix Lyndsay Litwin / Kate Elzinga consent | Per Jan's verified values | Manual edits |

### Phase C — CASL (Fri-Tue, ~3 days)
| # | Item | Outcome |
|---|---|---|
| C1 | Wire form submission → write to `consent_history` | New sign-ups fully audit-logged |
| C2 | Backfill `consent_history` baseline for ~247 records | Defensible record exists |
| C3 | Build `/unsubscribe?token=` page | Anyone can opt out |
| C4 | Build `/preferences?token=` page | Granular control |
| C5 | Build token issuer for newsletter sends | Authorized links in emails |

### Phase D — Architectural (next week, joint with Jeff)
| # | Item |
|---|---|
| D1 | Decide single source of truth (DB or CRM, not both) |
| D2 | Implement soft-delete pattern (replace hard delete) |
| D3 | Lead vs Contact reclassification (per Jeff's guidance) |
| D4 | Build admin DB viewer for Jan (read-only) |
| D5 | Add fuzzy-name dedup at import + form (prevent recurrence) |

---

## 9. Timeline at a glance

```
Wed May  6  ─ Jeff + Jan merge call (we stand down)
Thu May  7  ─ This report delivered
Fri May  8  ─ Phase B backfill (pending Jeff approval)
Mon May 11 ─ Phase C CASL build begins
Wed May 13 ─ Phase C complete; defensible state reached
Mon May 18 ─ Phase D architectural decisions
Fri May 22 ─ All open items closed or scheduled
```

---

## 10. What we need from the client

1. **Decisions A1 → A6** (above)
2. **MS Forms export file** from Jan
3. **Verified consent values** for Lyndsay Litwin, Kate Elzinga
4. **Confirmation** that nobody is editing CRM by hand during our backfill window
5. **30-min architecture call** with Jeff next week (D1)

---

*End of report. Questions, edits, and corrections welcome — this is a living document and will be re-issued after the Wednesday meeting.*
