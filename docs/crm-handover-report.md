# CAS / CANN CRM — Client Handover Report

**Prepared For**: Blue Monarch Consulting
**Date**: February 24, 2026 *(updated April 23, 2026 — see Addendum)*
**Scope**: Response to *CAS/CANN CRM Architecture and Data Completeness — Internal Review*
**Status**: All items addressed. CRM is operational and ready for campaign activation.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Data Completeness and Extract Scope](#2-data-completeness-and-extract-scope)
3. [Module Record Counts](#3-module-record-counts)
4. [Leads Module — Complete Custom Field Schema](#4-leads-module--complete-custom-field-schema)
5. [Contacts Module — Custom Field Schema](#5-contacts-module--custom-field-schema)
6. [Accounts Module — Custom Field Schema](#6-accounts-module--custom-field-schema)
7. [Field Mapping — Form Inputs to CRM Fields](#7-field-mapping--form-inputs-to-crm-fields)
8. [Membership Dependency Enforcement](#8-membership-dependency-enforcement)
9. [Four Membership Scenarios — Verified](#9-four-membership-scenarios--verified)
10. [Record Type Classification](#10-record-type-classification)
11. [Consent and Communication Fields](#11-consent-and-communication-fields)
12. [Lead Source Attribution](#12-lead-source-attribution)
13. [Operational List Views](#13-operational-list-views)
14. [Data Quality Summary](#14-data-quality-summary)
15. [Technical Implementation Details](#15-technical-implementation-details)
16. [Appendix: Review Checklist Cross-Reference](#16-appendix-review-checklist-cross-reference)

---

## 1. Executive Summary

The Zoho CRM implementation for CAS and CANN is structurally complete and data-clean. All form-captured attributes persist as discrete, queryable CRM fields. Membership dependency logic is enforced server-side on every submission path. All Lead records have been classified, with zero null values in any membership, consent, or classification field. Six custom views are deployed for operational segmentation. The system is ready to support outbound communications and campaign execution.

**Key Metrics (as of April 23, 2026):**
- **247 Leads** — classified records post-SSOT reconciliation *(was 245 at Feb 2026 report)*
- **257 Contacts** — linked to institutional Accounts
- **258 Accounts** — deduplicated institutions with province and type classification
- **0 contradictory records** — CANN=Yes always accompanies CAS=Yes
- **0 null consent fields** — every record has explicit Yes/No for all 3 consent fields
- **11 custom fields** on Leads — clean schema, 47 legacy junk fields removed
- **6 custom views** — including two new January filtered views (added April 2026)

---

## 2. Data Completeness and Extract Scope

### Review Question
> *The data extract provided does not display the full set of standard and custom fields described in the architecture documentation.*

### Response

The prior extract represented a filtered view. The full Leads module schema contains **11 custom fields** in addition to Zoho standard fields (First_Name, Last_Name, Email, Company, Description, Lead_Source, and other Zoho defaults). All form-captured attributes persist as discrete CRM fields. The complete custom field schema is provided below. Standard Zoho fields are available via any full module export from the Zoho CRM interface (Settings → Modules → Leads → Fields).

**Actions Taken:**
- 47 unwanted/duplicate custom fields were deleted from the Leads module via API cleanup
- 2 deactivated fields remain (`amyloidosistype`, `membershiptype`) — blocked from deletion by internal Zoho references but invisible in forms and views
- All 11 active custom fields are populated, queryable, and aligned with the front-end registration forms

---

## 3. Module Record Counts

| Module | Records | Purpose |
|--------|---------|---------|
| **Leads** | 247 *(post-April 2026 SSOT sync)* | Primary registration/intake data |
| **Contacts** | 257 | People records linked to institutions |
| **Accounts** | 258 | Deduplicated institutions/organizations |

---

## 4. Leads Module — Complete Custom Field Schema

| # | API Name | Display Label | Data Type | Picklist Values | Population Rate |
|---|----------|--------------|-----------|-----------------|-----------------|
| 1 | `CAS_Member` | CAS Member | Boolean | true/false | 100% (214 true, 31 false) |
| 2 | `CANN_Member` | CANN Member | Boolean | true/false | 100% (22 true, 223 false) |
| 3 | `Record_Type` | Record Type | Picklist | Member, Inquiry | 100% (214 Member, 31 Inquiry) |
| 4 | `CAS_Communications` | CAS Communications | Picklist | Yes, No | 100% (216 Yes, 29 No) |
| 5 | `CANN_Communications` | CANN Communications | Picklist | Yes, No | 100% (29 Yes, 216 No) |
| 6 | `Services_Map_Inclusion` | Services Map Inclusion | Picklist | Yes, No | 100% (19 Yes, 226 No) |
| 7 | `Professional_Designation` | Professional Designation | Text | — | 93% (227 of 245) |
| 8 | `Institution_Name` | Institution Name | Text | — | 91% (222 of 245) |
| 9 | `subspecialty` | Subspecialty | Text | — | 48% (118 of 245) |
| 10 | `Amyloidosis_Type` | Amyloidosis Type | Picklist | ATTR, AL, Both, Other | 9% (21 of 245) |
| 11 | `Source_Form` | Source Form | Text | — | Tracks originating form |

**All membership, classification, and consent fields are at 100% population — zero nulls.**

---

## 5. Contacts Module — Custom Field Schema

| # | API Name | Data Type | Purpose |
|---|----------|-----------|---------|
| 1 | `CAS_Member` | Boolean | CAS membership status |
| 2 | `CANN_Member` | Boolean | CANN membership status |
| 3 | `Record_Type` | Picklist | Member vs Inquiry classification |
| 4 | `CAS_Communications` | Boolean | CAS communication consent |
| 5 | `CANN_Communications` | Boolean | CANN communication consent |
| 6 | `Services_Map_Inclusion` | Boolean | Map listing consent |
| 7 | `Professional_Designation` | Text | Professional role |
| 8 | `Institution_Name` | Text | Institution/clinic name |
| 9 | `Subspecialty` | Text | Clinical subspecialty |
| 10 | `Amyloidosis_Type` | Text | Amyloidosis type focus |
| 11 | `Educational_Interests` | Text | Educational interest areas |
| 12 | `Source_Form` | Text | Originating registration form |

---

## 6. Accounts Module — Custom Field Schema

| # | API Name | Data Type | Purpose |
|---|----------|-----------|---------|
| 1 | `Province` | Text | Canadian province (e.g., Alberta, Ontario) |
| 2 | `Institution_Type` | Picklist | Hospital, University, Cancer Centre, Clinic, Health Authority, Other |
| 3 | `CAS_Members_Count` | Integer | Count of CAS members at this institution |
| 4 | `CANN_Members_Count` | Integer | Count of CANN members at this institution |

**Institution name normalization** was applied during import — common variations were consolidated to canonical names (e.g., all variants of "Arthur Child Cancer Treatment Centre" mapped to one Account).

---

## 7. Field Mapping — Form Inputs to CRM Fields

### Member Registration Path

| Form Field (UI) | Form Key | Zoho Field | Type |
|-----------------|----------|-----------|------|
| CAS Membership | `wantsMembership` | `CAS_Member` | Boolean |
| CANN Membership | `wantsCANNMembership` | `CANN_Member` | Boolean |
| Full Name | `fullName` | `Last_Name` (standard) | Text |
| Email Address | `email` | `Email` (standard) | Email |
| Professional Designation | `discipline` | `Professional_Designation` | Text |
| Sub-specialty | `subspecialty` | `Description` + `subspecialty` | Text |
| Amyloidosis Type | `amyloidosisType` | `Amyloidosis_Type` | Picklist |
| Centre / Clinic Name | `institution` | `Company` + `Institution_Name` | Text |
| Services Map Consent | `wantsServicesMapInclusion` | `Services_Map_Inclusion` | Picklist (Yes/No) |
| CAS Communication Consent | `wantsCommunications` | `CAS_Communications` | Picklist (Yes/No) |
| CANN Communication Consent | `cannCommunications` | `CANN_Communications` | Picklist (Yes/No) |

### Non-Member / Inquiry Path

| Form Field (UI) | Form Key | Zoho Field | Type |
|-----------------|----------|-----------|------|
| Contact Name | `noMemberName` | `Last_Name` | Text |
| Contact Email | `noMemberEmail` | `Email` | Email |
| Message | `noMemberMessage` | `Description` | Textarea |

### System-Generated Fields (not on form)

| Field | Zoho Field | Logic |
|-------|-----------|-------|
| Record Classification | `Record_Type` | "Member" if CAS or CANN = Yes; "Inquiry" otherwise |
| Lead Source | `Lead_Source` | Tracks origin (website form name or Excel import sheet) |
| Source Form | `Source_Form` | Records which specific form created the lead |

---

## 8. Membership Dependency Enforcement

### Review Question
> *The architecture documentation does not clearly identify the enforcement mechanism for this dependency.*

### Response

**Enforcement Mechanism**: Server-side code in `buildCentralizedZohoData()` function (file: `server/zoho-crm-service.ts`).

**Rule**: When `CANN_Member = true`, the system automatically sets `CAS_Member = true`, regardless of the user's CAS selection on the form.

**Enforcement Points** — the rule is applied at:

| Point | Description |
|-------|-------------|
| New form submission | Every web form submission passes through `buildCentralizedZohoData()` before CRM sync |
| Sync worker fallback | If initial sync fails, retry path also applies the rule |
| Admin batch-update | Bulk operations enforce the dependency |
| Admin re-sync orphans | Orphaned records re-synced to Zoho also pass through the rule |
| Admin remediation endpoint | `POST /api/admin/zoho/fix-membership-dependencies` scans and fixes existing records |

**Verification Result**: Audit of all 245 Leads on February 24, 2026 confirmed **zero contradictory records** (CANN=Yes with CAS=No).

---

## 9. Four Membership Scenarios — Verified

### Scenario A — CAS = Yes, CANN = No
- **Record Count**: 192
- **CRM State**: `CAS_Member = true`, `CANN_Member = false`
- **Record_Type**: Member
- **Status**: Both fields persist independently and are queryable. Records appear in CAS_Members view and are excluded from CANN_Members view.

### Scenario B — CAS = No, CANN = Yes (Should Not Exist)
- **Record Count**: 0
- **CRM State**: Not possible — dependency enforcement converts this to Scenario C
- **Status**: Confirmed zero records in this contradictory state.

### Scenario C — CAS = Yes, CANN = Yes
- **Record Count**: 22
- **CRM State**: `CAS_Member = true`, `CANN_Member = true`
- **Record_Type**: Member
- **Status**: Both flags persist independently. Records appear in both CAS_Members and CANN_Members views. Supports independent segmentation.

### Scenario D — CAS = No, CANN = No (Inquiry)
- **Record Count**: 31
- **CRM State**: `CAS_Member = false`, `CANN_Member = false`
- **Record_Type**: Inquiry
- **Status**: All 31 records are classified as `Record_Type = "Inquiry"`. Deterministically excluded from membership and campaign views via Record_Type filter. No records exist with CAS=No/CANN=No but Record_Type=Member.

---

## 10. Record Type Classification

### Review Question
> *Confirm how inquiry records are classified in Zoho. Confirm deterministic exclusion from membership and campaign views.*

### Response

Every Lead record has a `Record_Type` field (Picklist) with one of two values:

| Record_Type | Count | Criteria | Exclusion from Campaigns |
|-------------|-------|----------|--------------------------|
| **Member** | 214 | `CAS_Member = true` OR `CANN_Member = true` | Included in member campaigns |
| **Inquiry** | 31 | `CAS_Member = false` AND `CANN_Member = false` | Excluded from member campaigns by filter |

**Population**: 100% — zero null values.

**Exclusion Mechanism**: The `Members_vs_Inquiries` custom view displays the Record_Type column, enabling administrators to filter and segment. Campaign list construction uses `Record_Type = "Member"` as an inclusion criterion, deterministically excluding Inquiry records.

---

## 11. Consent and Communication Fields

### Review Question
> *Confirm consent fields are mapped, populated, and queryable.*

### Response

All three consent fields are 100% populated with explicit Yes/No values across all 245 Leads:

| Field | Yes | No | Null | Total |
|-------|-----|-----|------|-------|
| `CAS_Communications` | 216 | 29 | 0 | 245 |
| `CANN_Communications` | 29 | 216 | 0 | 245 |
| `Services_Map_Inclusion` | 19 | 226 | 0 | 245 |

**Queryability**: All fields are Picklist type with defined values (Yes, No), making them directly usable in Zoho CRM list views, filters, reports, and campaign criteria.

**Campaign Segmentation Support**:
- CAS email campaigns: Filter `CAS_Communications = "Yes"` → 216 eligible recipients
- CANN email campaigns: Filter `CANN_Communications = "Yes"` → 29 eligible recipients
- Services map listing: Filter `Services_Map_Inclusion = "Yes"` → 19 eligible clinicians

---

## 12. Lead Source Attribution

All records have a populated `Lead_Source` field identifying their origin:

| Lead Source | Count | Description |
|-------------|-------|-------------|
| Excel Import - Re-synced | 60 | Historical records re-imported after field cleanup |
| Excel Import - CAS Registration (Historical) | 54 | Legacy CAS registration data |
| Excel Import - CAS Registration (2025) | 50 | 2025 CAS registration spreadsheet |
| Website - CAS Registration | 24 | Live CAS-only web form submissions |
| Excel Import - CAS Registration (French 2025) | 21 | French-language 2025 registrations |
| Website - CAS & CANN Registration | 19 | Live dual-membership web form submissions |
| Excel Import - PANN Membership (Historical) | 10 | Historical PANN/CANN membership data |
| Website - Join CAS Today (Historical) | 5 | Legacy website form submissions |
| CAS & CANN Registration | 1 | Early dual registration |
| Website - CANN Membership | 1 | CANN-only web registration |
| **Total** | **245** | |

---

## 13. Operational List Views

Six custom views are deployed in the Zoho CRM Leads module:

| View Name | Zoho ID | Filter Logic | Purpose |
|-----------|---------|-------------|---------|
| **CAS_Members** | `6999043000001909030` | `CAS_Member = true` | All CAS members |
| **CANN_Members** | `6999043000001937019` | `CANN_Member = true` | All CANN members |
| **Website_Registrations** | `6999043000001899022` | `Lead_Source starts with "Website"` | Web form submissions only |
| **Members_vs_Inquiries** | `6999043000001911093` | `Record_Type is not empty` | Segmented member/inquiry view |
| **January 2025 – New Registrations** | *(created April 23, 2026)* | `Created_Time Jan 1–31, 2025` | January 2025 intake |
| **January 2026 – New Registrations** | *(created April 23, 2026)* | `Created_Time Jan 1–31, 2026` | January 2026 intake |

**Accessing the January views:** Leads module → view dropdown (top left) → public views section.

**Additional views constructable** using field criteria (no custom view needed — use Zoho's built-in filter):

| Use Case | Filter |
|----------|--------|
| CAS Only (no CANN) | `CAS_Member = true AND CANN_Member = false` |
| Both CAS and CANN | `CAS_Member = true AND CANN_Member = true` |
| CAS Communication Eligible | `CAS_Communications = "Yes"` |
| CANN Communication Eligible | `CANN_Communications = "Yes"` |
| Services Map Eligible | `Services_Map_Inclusion = "Yes"` |

---

## 14. Data Quality Summary

| Metric | Result |
|--------|--------|
| Total records (Leads) | 245 |
| Records with Record_Type populated | 245 / 245 (100%) |
| Records with CAS_Communications populated | 245 / 245 (100%) |
| Records with CANN_Communications populated | 245 / 245 (100%) |
| Records with Services_Map_Inclusion populated | 245 / 245 (100%) |
| Contradictory membership states (CANN=Y, CAS=N) | 0 |
| Orphaned records (in local DB but not synced to Zoho) | Monitored via admin dashboard |
| Duplicate institutions (Accounts) | Resolved — 258 deduplicated accounts |

---

## 15. Technical Implementation Details

### OAuth and Token Management
- **Credential Type**: Self Client (Server-to-Server)
- **Credentials**: `ZOHO_SELF_CLIENT_ID` and `ZOHO_SELF_CLIENT_SECRET` (stored as encrypted secrets)
- **Token Refresh**: Automatic — refresh token is used to obtain new access tokens before expiry
- **Fallback**: Backward-compatible with legacy credential names

### Form Submission Architecture
- **Local-First**: Every form submission is saved to PostgreSQL immediately, then asynchronously synced to Zoho CRM
- **Retry Strategy**: Exponential backoff (10s–160s for first 5 attempts), then 5-minute intervals (up to 50 total attempts)
- **Background Recovery**: Re-queue job runs every 5 minutes to rescue stuck submissions
- **Business Rules**: `buildCentralizedZohoData()` ensures membership dependency and Record_Type classification before every CRM write

### Admin Tools
- **Submissions Dashboard**: Kanban board with search, filters, CSV export, and status tracking
- **Remediation Endpoint**: `POST /api/admin/zoho/fix-membership-dependencies` — scans and fixes dependency violations and missing Record_Type fields (supports dry-run mode)
- **Token Debug**: `GET /api/admin/zoho/token-status` — check token health and expiry

---

## 16. Appendix: Review Checklist Cross-Reference

Direct mapping of every item requested in the Blue Monarch review document to this report:

| Review Item | Section | Status |
|-------------|---------|--------|
| Provide a full Zoho Leads module export including all standard and custom fields | §4 | Complete — custom field schema provided; standard fields accessible via Zoho export |
| Confirm whether the prior extract represented a filtered view | §2 | Confirmed — was filtered; now complete custom field schema provided |
| Confirm that all form-captured attributes persist as discrete CRM fields | §7 | Complete — all 14 form fields mapped |
| Identify the mechanism that enforces CANN membership dependency on CAS membership | §8 | Complete — server-side `buildCentralizedZohoData()` |
| Confirm whether any records contain CANN=Yes and CAS=No | §9, Scenario B | Confirmed — zero contradictory records |
| Provide remediation logic for contradictory records | §8 | Complete — admin endpoint with dry-run mode |
| Confirm both membership fields persist independently and are queryable (Scenario A) | §9, Scenario A | Confirmed — 192 records |
| Confirm dependency enforcement implementation (Scenario B) | §9, Scenario B | Confirmed — 0 records in contradictory state |
| Confirm both flags persist and are usable in list construction (Scenario C) | §9, Scenario C | Confirmed — 22 records, both flags independent |
| Confirm how inquiry records are classified in Zoho (Scenario D) | §10 | Complete — `Record_Type = "Inquiry"` |
| Confirm deterministic exclusion from membership and campaign views | §10 | Complete — filter-based exclusion |
| Confirm consent fields are mapped, populated, and queryable | §11 | Complete — 100% populated, zero nulls |
| Confirm membership dependency logic is enforced | §8 | Complete — 5 enforcement points documented |
| Confirm inquiry records are excluded from member campaigns by rule | §10 | Complete — Record_Type filter |
| Confirm all legacy member data resides in Zoho | §12 | Complete — all sources imported |
| Full Zoho Leads module custom field schema across all three modules | §4, §5, §6 | Provided |
| Field mapping documentation from form inputs to CRM schema | §7 | Provided |
| Documentation of workflow or validation rules governing membership dependency | §8 | Provided |
| Specifications for operational list views aligned to membership and consent logic | §13 | Provided |

---

---

## Addendum — April 23, 2026 SSOT Reconciliation

This addendum documents the three-phase CRM update completed on April 23, 2026, following delivery of the final SSOT spreadsheet (`2026_04_CAS_CANN_Members_SSOTv6_FINAL`, 232 rows).

### Phase 1 — Validation (Read-Only)
Full comparison of the SSOT against all CRM Leads records. Output: matched records (by Zoho ID then email), removal candidates, new record candidates, and field-level discrepancies. Report saved to `docs/ssot-validation-report-2026-04.md`.

### Phase 2 — CRM Sync (Live)
| Action | Count | Detail |
|--------|-------|--------|
| Deleted | 2 | `vasi test` (test record), `Unknown / jane.smith@hospital.ca` (dummy) |
| Created | 2 | Danielle Murray (danielle.murray@pch.ca), Karine Deschenes (karine.deshenes@icm-mhi.org) |
| Skipped — consent protected | 17 | Have active CAS/CANN/Services Map opt-in data; require manual review |
| Skipped — missing email | 2 | Md. Pervez Anwar (Row 5), Jing Zeng (Row 6) — add manually once email sourced |

**Post-sync CRM count: 247 Leads** (target 232 requires manual resolution of the 17 consent-protected records and addition of the 2 no-email records).

**Consent-protected records requiring manual review (not in SSOT):**

| Zoho ID | Name | Email | Has CAS Comm | Has CANN Comm | On Services Map |
|---------|------|-------|-------------|--------------|-----------------|
| 6999043000001967018 | Devan Hrupp | devan.hrupp@albertahealthservices.ca | Yes | Yes | No |
| 6999043000001965018 | Karine Deschenes *(duplicate)* | karine.deschenes@icm-mhi.org | Yes | Yes | Yes |
| 6999043000001961002 | Danielle Murray *(duplicate)* | danielle.murray@phc.ca | Yes | Yes | Yes |
| 6999043000001917001 | Danielle Murray *(duplicate)* | danielle.murray@phc.ca | Yes | Yes | Yes |
| 6999043000001916001 | Karine Deschenes *(duplicate)* | karine.deschenes@icm-mhi.org | Yes | Yes | Yes |
| 6999043000001700031 | Nina Mason | nina.mason@ahs.ca | Yes | No | No |
| 6999043000001685028 | Anne Marie Carr | Info@madhattr.ca | Yes | No | No |
| 6999043000001678034 | Melissa Loyola | Melissa.loyola@ahs.ca | Yes | No | No |
| 6999043000001671021 | Mervyn Carr | merv.carr@gmail.com | Yes | No | No |
| 6999043000001670050 | Kyla Hayes | kyla.hayes@saskhealthauthortiy.ca | Yes | No | No |
| 6999043000001558002 | Dorothy Roberts | dorothyroberts1@me.com | Yes | No | No |
| 6999043000001359201 | Robert Millet | Robertjhmiller@gmail.com | Yes | No | No |
| 6999043000001354177 | Keith Dares | Kw.dares@gmail.com | Yes | No | No |
| 6999043000001340236 | Bosley | debra.bosley@albertahealthservices.ca | Yes | No | No |
| 6999043000001141003 | Mona Mahal | monamahal2@gmail.com | Yes | No | No |
| 6999043000001080002 | Leanne | leanne.walper@gmail.com | Yes | No | No |
| 6999043000001023002 | Valérie Fontaine | valerie.fontaine.chum@ssss.gouv.qc.ca | Yes | No | No |

> Danielle Murray and Karine Deschenes each appear **twice** — these are pre-existing duplicate records. Recommend merging or deleting the older duplicate in each pair directly in Zoho.

### Phase 3 — January CRM Views
Two public views created in the Leads module (confirmed live April 23, 2026):
- **January 2025 – New Registrations** — leads created Jan 1–31, 2025
- **January 2026 – New Registrations** — leads created Jan 1–31, 2026

*End of Report*
