---
title: "CAS Website — Join Form Data Flow Documentation"
subtitle: "How registration data travels from the website to Zoho CRM"
date: "July 2026"
---

# Overview

This document explains what happens to the information a person enters into the **Join CAS / CANN registration form** on the Canadian Amyloidosis Society website (`amyloid.ca/join-cas`), from the moment they click **Submit** until the data appears in Zoho CRM.

It is written for two audiences:

- **Part 1 — Plain-language summary** for board members, administrators, and other non-technical stakeholders.
- **Part 2 — Technical reference** for IT staff and CRM administrators, including the complete field-by-field mapping.

---

# Part 1: Plain-Language Summary

## What the form collects

The Join CAS/CANN form is a single form that adapts to the visitor's answers:

1. **"Do you want to join CAS?"** and **"Do you want to join CANN?"** are asked first.
2. If the visitor answers **Yes** to either, the form asks for their professional details: name, email, professional designation, sub-specialty, the type of amyloidosis they care for, and their institution.
3. If they opt in to the **Amyloidosis Services Map**, the form also asks for their clinic name, address, and phone number so the clinic can appear on the public map.
4. If they answer **No** to both membership questions, the form becomes a simple contact/inquiry form (name, email, message).
5. A **consent checkbox** asks permission to send electronic communications (required under Canadian anti-spam law, CASL).

## What happens when they click Submit

The system uses a **"save first, sync second"** approach designed so that **no submission is ever lost**, even if the CRM is temporarily unavailable:

1. **Saved immediately** — The submission is written to the website's own secure database the instant it is received. This is the safety copy.
2. **Sent to Zoho CRM automatically** — Within seconds, a background process picks up the submission and sends it to Zoho CRM, where it becomes a record in the **Leads** module.
3. **Automatic retries if anything goes wrong** — If Zoho is unreachable (e.g., an outage or expired connection), the system keeps retrying automatically: quickly at first (every few seconds), then every 5 minutes, for up to roughly 4 days. Only after 50 failed attempts is a submission flagged for a human to review — it is never silently discarded.
4. **No duplicates** — Before creating a new CRM record, the system checks whether a person with the same email already exists. If so, it **updates** the existing record instead of creating a duplicate.

## Key business rules applied automatically

| Rule | What it means |
|------|---------------|
| **CANN members are always CAS members** | If someone joins CANN, they are automatically recorded as a CAS member too, reflecting the organizational relationship. |
| **Member vs. Inquiry classification** | Every record is tagged as either "Member" (joined CAS and/or CANN) or "Inquiry" (contacted us without joining). This drives email campaign segmentation. |
| **Source tracking** | Each record notes exactly which path it came from: CAS registration, CAS & CANN registration, or a contact inquiry. |
| **Membership is never downgraded** | If an existing member submits the form again and leaves a membership box unticked, their existing membership flags in the CRM are kept — a re-submission can add memberships but never remove them. |
| **Consent is recorded** | The consent checkbox answer is stored in the CRM as an explicit Yes/No for both CAS and CANN communications, supporting CASL compliance. |

## Where the data lives

| Location | Purpose | Retention |
|----------|---------|-----------|
| Website database (PostgreSQL) | Immediate safety copy of every submission and its sync status | Kept as the permanent local record |
| Zoho CRM — Leads module | The working record used for membership management and email campaigns | Managed per CRM data policies |

## Worked examples

**Example 1 — A nurse joins CANN**

Maria, a cardiology nurse in Halifax, answers *No* to CAS membership but *Yes* to CANN. She fills in her professional details and ticks the consent box.

- She is saved instantly to the website database, then synced to Zoho within seconds.
- Because CANN membership automatically includes CAS membership, her CRM record shows **both** `CANN_Member = true` and `CAS_Member = true`.
- Her record is classified as **"Member"**, sourced as **"Website - CAS & CANN Registration"**, and both communication consents are recorded as **"Yes"**.

**Example 2 — A physician joins CAS and opts into the Services Map**

Dr. Chen, a hematologist in Vancouver, answers *Yes* to CAS, *No* to CANN, and opts to have his clinic listed on the Amyloidosis Services Map.

- His CRM record shows `CAS_Member = true`, `CANN_Member = false`, classified as **"Member"**, sourced as **"Website - CAS Registration"**.
- His clinic name, street, city, province, and postal code are stored in the dedicated Map fields, ready for the Services Map.

**Example 3 — A visitor sends an inquiry without joining**

A caregiver answers *No* to both membership questions and writes a message asking about support resources.

- Only name, email, and message are collected.
- The CRM record is classified as **"Inquiry"** with source **"Website - Contact Inquiry"** — so inquiry contacts can be excluded from member-only email campaigns.

**Example 4 — An existing member submits the form again**

Dr. Chen (from Example 2) later re-submits the form to join CANN, but forgets to tick the CAS box.

- The system finds his existing CRM record by email and **updates** it rather than creating a duplicate.
- His `CANN_Member` flag is upgraded to `true`; his existing `CAS_Member = true` is **kept** (membership is never downgraded by a re-submission).

---

# Part 2: Technical Reference

## Architecture at a glance

```
Visitor browser (/join-cas)
        │  POST (validated with Zod schema)
        ▼
Express API  ──►  PostgreSQL: form_submissions   (immediate, local-first)
                          │
                          ▼  background sync worker (polls every 10 s)
                  buildCentralizedZohoData()      (business rules + field mapping)
                          │
                          ▼  Zoho CRM v8 REST API (OAuth, auto token refresh)
                  Zoho CRM — Leads module         (search-by-email upsert)
```

## 2.1 Form fields (client side)

Form: `client/src/pages/JoinCAS.tsx`, validation: `casRegistrationSchema` (Zod).

"Member path" = visitor answered **Yes** to CAS and/or CANN membership.

| Form field | Label | Required | Conditional logic |
|------------|-------|----------|-------------------|
| `wantsMembership` | Join CAS? | Yes | Yes/No |
| `wantsCANNMembership` | Join CANN? | Yes | Yes/No |
| `firstName` | First Name | Member path | |
| `lastName` | Last Name | Member path | |
| `primaryEmail` | Primary Email Address | Member path | |
| `secondaryEmail` | Secondary Email Address | No | |
| `discipline` | Professional Designation | Member path | e.g. Physician, Nurse |
| `subspecialty` | Sub-specialty Area of Focus | Member path | e.g. Cardiology, Hematology |
| `amyloidosisType` | Amyloidosis type primarily cared for | Member path | ATTR / AL / Both / Other |
| `amyloidosisTypeOther` | Please specify | If "Other" | Shown only when type = Other |
| `institution` | Institution name | Member path | |
| `wantsServicesMapInclusion` | Include clinic on Services Map? | Member path | Yes/No |
| `mapClinicName` | Clinic / Centre name | If Map = Yes | |
| `streetName` | Street name | If Map = Yes | |
| `postalCode` | Postal code | If Map = Yes | |
| `city` | City | If Map = Yes | |
| `province` | Province | If Map = Yes | |
| `phoneNumber` | Phone number | If Map = Yes | |
| `faxNumber` | Fax number | No | |
| `consentAll` | Consent to electronic communications | No (default unchecked) | Single CASL consent checkbox |
| `noMemberName` | Name | Inquiry path | Only when both membership answers are No |
| `noMemberEmail` | Email | Inquiry path | Only when both membership answers are No |
| `noMemberMessage` | Message | No | Inquiry path |

## 2.2 Local database storage

Table: `form_submissions` (PostgreSQL, defined in `shared/schema.ts`).

| Column | Type | Purpose |
|--------|------|---------|
| `id` | serial (PK) | Unique submission ID |
| `formName` | varchar(255) | "CAS/CANN Registration Form" |
| `submissionData` | jsonb | Full raw form payload (all fields above) |
| `sourceForm` | varchar(255) | Origin tracking |
| `zohoModule` | varchar(100) | Target module (default "Leads") |
| `processingStatus` | enum | pending / processing / completed / failed |
| `syncStatus` | enum | pending / synced / failed |
| `retryCount` | integer | Sync attempts so far (cap: 50) |
| `nextRetryAt` | timestamp | Next scheduled retry (backoff schedule) |

## 2.3 Field-by-field mapping to Zoho CRM

Performed by `buildCentralizedZohoData()` in `server/zoho-crm-service.ts` — the single source of truth for CRM mapping. Records are created/updated in the **Leads** module.

| Form field | Zoho CRM field (API name) | Transformation / rule |
|------------|---------------------------|------------------------|
| `firstName` | `First_Name` | Trimmed |
| `lastName` | `Last_Name` | Trimmed; for inquiries, derived by splitting `noMemberName` |
| `primaryEmail` | `Primary_Email_Address` + `Email` | Mirrored into standard `Email` field (used for dedupe) |
| `secondaryEmail` | `Secondary_Email_Address` | |
| `discipline` | `Professional_Designation` | |
| `institution` | `Company` | Truncated to 100 characters |
| `subspecialty` | `subspecialty` | Truncated to 50 characters |
| `amyloidosisType` | `Amyloidosis_Type` | If value is "Other: …", picklist value becomes "Other" |
| `amyloidosisTypeOther` | `Amyloidosis_Type_Other` | Free-text detail when type is Other |
| `wantsMembership` | `CAS_Member` | Boolean; **forced `true` when `CANN_Member` is `true`** |
| `wantsCANNMembership` | `CANN_Member` | Boolean |
| *(derived)* | `Record_Type` | "Member" if either membership = Yes; otherwise "Inquiry" |
| *(derived)* | `Lead_Source` | "Website - CAS & CANN Registration" (CANN = Yes) / "Website - CAS Registration" (CAS = Yes, CANN = No) / "Website - Contact Inquiry" (both No) |
| `consentAll` | `CAS_Communications`, `CANN_Communications` | Stored as picklist strings "Yes" / "No" |
| `mapClinicName` | `Map_Clinic_Name` | Only when Services Map inclusion = Yes |
| `streetName`, `city`, `province`, `postalCode` | `Map_Street`, `Map_City`, `Map_Province`, `Map_Postal_Code` | Only when Services Map inclusion = Yes |
| *(timestamp)* | `Form_Submission_Date` | ISO format `YYYY-MM-DDTHH:mm:ss+00:00` (Zoho datetime format) |

### Business rules enforced centrally

1. **CANN → CAS dependency**: `CANN_Member = true` always forces `CAS_Member = true`.
2. **Record_Type classification**: "Member" vs "Inquiry" — used for email campaign segmentation in Zoho.
3. **Lead_Source differentiation**: three distinct values (see table) so every record's origin is traceable.
4. **Consent values**: normalized to the exact picklist strings Zoho expects ("Yes"/"No").

## 2.4 Sync process and reliability

Component: background sync worker (`server/zoho-sync-worker.ts`).

- **Local-first**: the API route writes to `form_submissions` and returns success to the visitor immediately. The CRM sync is fully asynchronous — a Zoho outage never blocks or fails a form submission.
- **Polling**: the worker checks for `pending` submissions every **10 seconds**.
- **Retry strategy (two-phase)**:
  - *Fast phase*: first 5 attempts with exponential backoff — 10 s, 20 s, 40 s, 80 s, 160 s.
  - *Slow phase*: attempts 6–50 at **5-minute** intervals.
  - A separate re-queue job runs every 5 minutes to rescue submissions stuck in a failed state for 30+ minutes, with progressive backoff capping at 60-minute intervals.
  - **Cap**: 50 total attempts (≈ 4 days). After that, `processingStatus` is set to `failed` and the record is surfaced for **manual review** — it remains safely stored in PostgreSQL.
- **OAuth token management**: a dedicated token manager validates the Zoho access token before each request and automatically refreshes it (Zoho v8 API, Self Client credentials) on expiry — no manual re-authentication needed.

## 2.5 Deduplication / upsert behaviour

Before creating a Lead, the worker **searches Zoho by `Email`**:

- **No match** → a new Lead is created.
- **Match found** → the existing Lead is **updated** (upsert). Merge rules:
  - Text fields: the latest submission wins.
  - Membership flags (`CAS_Member`, `CANN_Member`): **upgrade-only** — once `true`, they are never reverted to `false` by a later submission.

## 2.6 Data protection, privacy & compliance

- **Validation**: form input is validated server-side (Zod schemas) before storage — malformed submissions are rejected with clear errors, never silently altered.
- **Transport security**: the visitor-facing form communicates over HTTPS only.
- **Credential handling**: the Zoho connection uses OAuth 2.0 (Self Client). Credentials are stored as server-side environment secrets, never in the codebase or browser.
- **Audit trail**: the local PostgreSQL copy provides a permanent record of every submission, its timestamps, and its sync outcome.
- **CASL (Canada's Anti-Spam Legislation)**: express consent for electronic communications is collected via the consent checkbox and stored as explicit "Yes"/"No" values (`CAS_Communications`, `CANN_Communications`) in the CRM. Email campaigns should segment on these fields.
- **PIPEDA considerations**: the form collects only the personal information needed for membership administration and the public Services Map (which is opt-in). Individuals who wish to access, correct, or delete their data can be handled by locating their record by email in Zoho and, if required, the local `form_submissions` table.

## 2.7 Admin tools & data remediation

The system includes administrative endpoints for maintaining CRM data quality:

| Tool | What it does |
|------|--------------|
| **Fix membership dependencies** (`POST /api/admin/zoho/fix-membership-dependencies`) | Scans existing Zoho records for CANN→CAS rule violations (CANN member not flagged as CAS member) and for records missing `Record_Type`. Fixes contradictory states and back-fills the classification on historical records. Supports a **dry-run mode** that reports what would change without changing anything. |
| **Re-sync orphans** | Finds submissions saved locally that never reached Zoho and pushes them through the centralized mapping again. |
| **Batch update** | Applies the centralized field mapping and business rules to a batch of existing records — useful after mapping rules change. |

All three tools route through the same `buildCentralizedZohoData()` function, so business rules are applied identically no matter how a record reaches Zoho.

## 2.8 Troubleshooting & FAQ (for administrators)

**Q: A person says they submitted the form, but I can't find them in Zoho.**
Check in this order: (1) Search Zoho Leads by their email — they may exist under a different spelling. (2) The sync may still be retrying — check the `form_submissions` table for their record and its `syncStatus`/`retryCount`. (3) If `processingStatus` is `failed` after 50 attempts, the submission is safe in the local database and can be re-synced with the re-sync tool.

**Q: Zoho was down for a day. Did we lose submissions?**
No. Every submission is saved locally first. The sync worker retries automatically for roughly 4 days, and a re-queue job rescues anything stuck. Once Zoho recovers, pending submissions flow through on their own — no action needed.

**Q: There's a duplicate person in Zoho. How did that happen?**
Dedupe matches on the `Email` field. Duplicates typically mean the person used two different email addresses. Merge them in Zoho; the membership flags follow upgrade-only logic, so keep whichever flags are `true`.

**Q: A CANN member shows `CAS_Member = false` in Zoho.**
This violates the CANN→CAS rule — usually a legacy record from before the rule existed. Run the **fix membership dependencies** tool (dry-run first) to correct it and any others.

**Q: Someone asked to stop receiving emails.**
Set `CAS_Communications` and/or `CANN_Communications` to "No" on their Zoho record, and honour the change in campaign segments. The original consent record remains in the local database for CASL audit purposes.

**Q: We renamed or added a field in Zoho. What needs updating?**
Field mapping lives in `buildCentralizedZohoData()` in `server/zoho-crm-service.ts`. Any new/renamed CRM field must be updated there (and in this document). Note: renaming a Zoho picklist value does **not** update existing records — old values remain until remediated.

## 2.9 Change management

When any of the following change, this document must be updated and the mapping code reviewed:

- Form fields added, removed, or renamed on `/join-cas`
- Zoho CRM custom fields or picklist values changed
- Business rules (membership dependency, classification, lead sources) revised
- Consent wording or CASL practices updated

---

# Glossary

| Term | Meaning |
|------|---------|
| **CAS** | Canadian Amyloidosis Society |
| **CANN** | Canadian Amyloidosis Nursing Network (an affiliate of CAS) |
| **CRM** | Customer Relationship Management system — here, Zoho CRM, where member records are managed |
| **Lead** | Zoho's name for a contact record in the Leads module; every form submission becomes or updates a Lead |
| **Sync** | The automatic transfer of a submission from the website's database to Zoho CRM |
| **Upsert** | "Update or insert" — update the existing record if one matches, otherwise create a new one |
| **Dedupe** | Duplicate prevention — matching incoming submissions to existing records by email |
| **OAuth** | The secure authorization standard used to connect the website to Zoho without sharing passwords |
| **API** | Application Programming Interface — the channel through which the website talks to Zoho |
| **CASL** | Canada's Anti-Spam Legislation — requires consent for commercial electronic messages |
| **PIPEDA** | Personal Information Protection and Electronic Documents Act — Canada's federal privacy law |
| **PostgreSQL** | The database used by the website to store submissions locally |
| **Backoff** | Retry strategy where the wait time between attempts increases progressively |

---

# Document control

| Item | Detail |
|------|--------|
| Document title | CAS Website — Join Form Data Flow Documentation |
| Version | 1.0 |
| Date | July 2026 |
| Scope | Join CAS/CANN form (`/join-cas`) → Zoho CRM data flow only |
| Out of scope | Event registrations, resource uploads, admin bulk imports (documented separately if needed) |
| Review trigger | Any change listed under "Change management" (section 2.9) |

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | July 2026 | Initial version |
