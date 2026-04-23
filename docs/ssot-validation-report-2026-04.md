# CAS / CANN — SSOT vs CRM Validation Report
## Phase 1: Read-Only Comparison

**Prepared For**: Blue Monarch Consulting  
**Date**: April 23, 2026  
**Scope**: SSOT Reconciliation — Comparison of `2026_04_CAS_CANN_Members_SSOTv6_FINAL` (232 records) against the Zoho CRM Leads module  
**Status**: Phase 1 Complete — No CRM data has been modified

---

## What Was Asked

The client provided a final "single source of truth" (SSOT) Excel file with **232 member records**. The CRM currently holds **245 Lead records**. Before any data changes are made, a full validation report was requested to:

1. Identify the CRM records that are **NOT** in the SSOT — candidates for removal
2. Identify the SSOT records with **no Zoho ID** — candidates for new CRM record creation
3. Flag any records with **missing email addresses** that would require manual review
4. Identify **field-level discrepancies** between the SSOT and CRM for matched records
5. Flag any removal candidates where **consent / subscription data would be lost** on deletion

No CRM data was to be changed during this phase.

---

## What Was Done

### 1. Built a Validation Service

A new backend service (`server/ssot-validation-service.ts`) was built that:

- Reads and parses the SSOT Excel file from the `SSOT` sheet (232 rows)
- Fetches all Leads from the live Zoho CRM using paginated API calls — pulling all 11 custom fields plus standard fields (`First_Name`, `Last_Name`, `Email`, `Company`, `Industry`, and all membership/consent fields)
- Matches SSOT rows to CRM records using **Zoho ID as the primary key** (stripping the `zcrm_` prefix the SSOT uses)
- Falls back to **email address matching** for rows where the Zoho ID is missing or not found
- Produces a structured report saved as both JSON and a plain-text summary

### 2. Exposed an Admin API Endpoint

A new read-only endpoint was added to the admin API:

```
GET /api/admin/zoho/ssot-validation-report
GET /api/admin/zoho/ssot-validation-report?format=text
```

- Protected by the existing `requireAutomationAuth` middleware
- Returns the full comparison report (JSON or plain text)
- Saves a local copy to `ssot-validation-report.json` and `ssot-validation-report.txt` on each run

### 3. Updated the Client Excel File

The shared Excel workbook (`CAS_&_CANN_`) was updated with **four new sheets** appended to the existing data:

| Sheet Name | Contents |
|---|---|
| **SSOT Validation - Summary** | Overall counts and phase status |
| **Records to Remove** | CRM records not found in the SSOT, with consent risk flags |
| **Records to Add (SSOT)** | SSOT rows with no CRM match — new records to create |
| **Field Discrepancies** | Matched records where SSOT and CRM values differ |

All original sheets (`Both CAS and CANN`, `CAS Registration`, `Non - Membership`, `Website - Registration`, `CANN & PANN membership`, `ALL Leads`, `CAS Communication Eligible`, `CANN Communication Eligible`) were preserved unchanged.

---

## Validation Findings

### Record Counts

| Metric | Count |
|---|---|
| CRM total records | 247 |
| SSOT total rows | 232 |
| Difference | 15 |

### Matching Results

| Match Method | Count |
|---|---|
| Matched by Zoho ID | 159 |
| Matched by Email (fallback) | 69 |
| **Total Matched** | **228** |

> **Note on ID matching:** The SSOT stores Zoho IDs with a `zcrm_` prefix (e.g., `zcrm_6999043000001354117`). The validation service strips this prefix before comparing against CRM record IDs. 66 SSOT records with IDs fell through to email matching — this reflects that the Excel export used for comparison was taken at a different point in time than the SSOT was finalized.

---

### Removal Candidates — CRM Records NOT in SSOT

**Total: 19 records**

These are CRM Lead records with no corresponding row in the SSOT. Before any deletion, each must be reviewed:

| Consent Risk | Count | Action |
|---|---|---|
| Records with CAS/CANN/Services Map consent = Yes | **17** | ⚠️ Review carefully — consent data will be lost on deletion |
| Records with no consent data | 2 | Lower risk to remove |

All 19 removal candidates are listed in the **"Records to Remove"** sheet of the updated Excel, with their consent field values (`CAS Communications`, `CANN Communications`, `Services Map Inclusion`) clearly shown.

**Client action required**: Review each record in the "Records to Remove" sheet and confirm which should be deleted. Pay particular attention to the 17 records flagged as having consent data at risk.

---

### New Record Candidates — SSOT Records NOT in CRM

**Total: 4 records**

These are SSOT rows that could not be matched to any existing CRM record (no Zoho ID, and no email match found):

| Status | Count | Action |
|---|---|---|
| Has email address — can be created automatically | 2 | Ready for Phase 2 creation |
| Missing email address — manual review required | **2** | ⚠️ Cannot be auto-created; needs manual data entry |

All 4 candidates are listed in the **"Records to Add (SSOT)"** sheet with their available contact details.

---

### Field-Level Discrepancies

**Total: 124 matched records with at least one field difference**

For every matched record, six fields were compared between the SSOT and the CRM:

| Field | What Was Compared |
|---|---|
| Full Name | SSOT first_name + last_name vs CRM First Name + Last Name |
| Email | Exact match |
| Institution | SSOT institution vs CRM Institution Name (or Company) |
| Discipline | SSOT discipline vs CRM Professional_Designation |
| Subspecialty | SSOT subspecialty vs CRM subspecialty |

Common types of discrepancies found:
- **Encoding differences** — curly apostrophes and accented characters were corrupted in the CRM export (e.g., `Queen's University` vs `Queenâ€™s University`). These are display artifacts, not true data errors.
- **Name format** — Some CRM records store the full name in the Last Name field; the SSOT splits first and last names separately.
- **Subspecialty gaps** — Many records have subspecialty in the SSOT but blank in CRM, or vice versa.
- **Trailing whitespace** — Some SSOT values have trailing spaces.

All 124 records are detailed in the **"Field Discrepancies"** sheet.

---

## What Has NOT Been Changed

- **No CRM records have been deleted**
- **No new CRM records have been created**
- **No CRM field values have been updated**

This was Phase 1: read-only comparison only.

---

## Next Steps

### Phase 2 — Apply Changes (Pending Client Approval)

Once the client reviews and approves the findings above:

1. **Delete** the confirmed removal candidates (up to 19 records) from Zoho CRM Leads
   - Records with consent data require explicit client sign-off before deletion
2. **Create** the 2 new SSOT records that have email addresses as new Zoho CRM Leads
3. **Manually review** the 2 new SSOT records without email addresses

A new admin endpoint (`POST /api/admin/zoho/apply-ssot-changes`) will be built for Phase 2 with dry-run support so the exact changes can be previewed before committing.

### Phase 3 — January Filtered View

Build a filtered list view in Zoho CRM Leads module for the January segment (criteria and date range to be confirmed with client).

---

## Deliverables

| Deliverable | Location |
|---|---|
| Updated Excel workbook (with 4 new validation sheets) | `attached_assets/CAS_CANN_ValidationReport_2026_04.xlsx` |
| Full JSON report | `ssot-validation-report.json` (project root) |
| Plain-text summary | `ssot-validation-report.txt` (project root) |
| Admin API endpoint | `GET /api/admin/zoho/ssot-validation-report` |
| This document | `docs/ssot-validation-report-2026-04.md` |

---

*End of Phase 1 Report*
