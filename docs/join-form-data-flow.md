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

## 2.6 Data protection notes

- Form input is validated server-side (Zod schemas) before storage.
- The Zoho connection uses OAuth 2.0; credentials are stored as server-side environment secrets, never in the codebase or browser.
- The visitor-facing form communicates over HTTPS.
- The local PostgreSQL copy provides an audit trail of every submission and its sync outcome.
