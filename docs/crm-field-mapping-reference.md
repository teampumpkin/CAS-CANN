# CRM Field Mapping Reference

**Document Purpose**: Reconciliation of all front-end form fields to Zoho CRM Leads module field names.
**Last Updated**: February 24, 2026
**Prepared For**: Blue Monarch CRM Architectural Review

---

## Field Mapping Table

### Registration Form Fields (Member Path)

| # | Form Field (UI Label) | Form Data Key | Zoho CRM Field (API Name) | Data Type | Exists in Zoho | Notes |
|---|----------------------|---------------|--------------------------|-----------|----------------|-------|
| 1 | CAS Membership Selection | `wantsMembership` | `CAS_Member` | Boolean | Yes | Also mapped to legacy `wantsmembership` |
| 2 | CANN Membership Selection | `wantsCANNMembership` | `CANN_Member` | Boolean | Yes | Dependency enforced: CANN=Yes forces CAS=Yes |
| 3 | Full Name | `fullName` | `Last_Name` | Text | Yes (standard) | Zoho standard field |
| 4 | Email Address | `email` | `Email` | Email | Yes (standard) | Zoho standard field |
| 5 | Professional Designation | `discipline` | `Professional_Designation` | Text | Yes | Also mapped to legacy `discipline` |
| 6 | Sub-specialty Area of Focus | `subspecialty` | `Description` | Textarea | Yes (standard) | Also mapped to legacy `subspecialty` |
| 7 | Primary Amyloidosis Type | `amyloidosisType` | `Amyloidosis_Type` | Picklist | Yes | Values: ATTR, AL, Both ATTR and AL, Other |
| 8 | Centre / Clinic Name | `institution` | `Company` + `Institution_Name` | Text | Yes | Mapped to both standard `Company` and custom `Institution_Name`. Sanitized via `cleanAndTruncate()` |
| 9 | Services Map Inclusion | `wantsServicesMapInclusion` | `Services_Map_Inclusion` | Picklist | Yes | Values: Yes, No. Also mapped to legacy `wantsservicesmapinclusion`, `servicesmapconsent` |
| 10 | CAS Communication Consent | `wantsCommunications` | `CAS_Communications` | Picklist | Yes | Values: Yes, No. Also mapped to legacy `wantscommunications`, `communicationconsent` |
| 11 | CANN Communication Consent | `cannCommunications` | `CANN_Communications` + `CANN_Communication_Consent` | Picklist | Yes | Values: Yes, No. Mapped to both field names |

### Registration Form Fields (Non-Member / Inquiry Path)

| # | Form Field (UI Label) | Form Data Key | Zoho CRM Field (API Name) | Data Type | Exists in Zoho | Notes |
|---|----------------------|---------------|--------------------------|-----------|----------------|-------|
| 12 | Contact Name | `noMemberName` | `Last_Name` | Text | Yes (standard) | Overwrites Last_Name for inquiry records |
| 13 | Contact Email | `noMemberEmail` | `Email` | Email | Yes (standard) | Overwrites Email for inquiry records |
| 14 | Contact Message | `noMemberMessage` | `Description` | Textarea | Yes (standard) | Free-text inquiry message |

### System-Generated Fields (Not on Form)

| # | Field Purpose | Zoho CRM Field (API Name) | Data Type | Exists in Zoho | Notes |
|---|--------------|--------------------------|-----------|----------------|-------|
| 15 | Record Classification | `Record_Type` | Picklist | **No — pending creation** | Values: "Member", "Inquiry". Differentiates members from non-member contacts. In field creation endpoint, awaiting OAuth fix. |
| 16 | Lead Source Attribution | `Lead_Source` | Picklist | Yes (standard) | Values: "Website - CAS Registration", "Website - CAS & CANN Registration", "Website - Contact Inquiry", "Excel Import - [name]" |
| 17 | Source Form Tracking | `Source_Form` | Text | Yes | Records which form created the lead |
| 18 | Layout Assignment | `Layout.id` | Object | Yes (standard) | Zoho layout ID, set when configured |

---

## Membership Dependency Logic

**Enforcement Mechanism**: Server-side, in `buildCentralizedZohoData()` (file: `server/zoho-crm-service.ts`)

**Rule**: If `CANN_Member = true`, then `CAS_Member` is forced to `true` regardless of user selection.

**Applied At**:
- Every new form submission (via sync worker post-processing)
- Sync worker fallback path
- Admin batch-update operations
- Admin re-sync orphan operations

**Verification**: Dry-run of remediation endpoint on Feb 24, 2026 confirmed **0 dependency violations** exist across 100 synced records.

---

## Record Type Classification

| Condition | Record_Type Value | Lead_Source Value |
|-----------|------------------|-------------------|
| CAS=Yes and/or CANN=Yes | `Member` | `Website - [Form Name]` |
| CAS=No and CANN=No (web form) | `Inquiry` | `Website - Contact Inquiry` |
| Excel import | `Member` or `Inquiry` (based on data) | `[Import Sheet Name]` |

**Status**: `Record_Type` field needs to be created in Zoho CRM (included in field creation endpoint). 100 historical records require backfill via remediation endpoint.

---

## Administrative Views Supported

All 7 operational views requested by Blue Monarch can be constructed using explicit field criteria:

| # | View Name | Filter Criteria | Fields Required |
|---|-----------|----------------|-----------------|
| 1 | CAS Members | `CAS_Member = true` | CAS_Member |
| 2 | CANN Members | `CANN_Member = true` | CANN_Member |
| 3 | CAS Only | `CAS_Member = true AND CANN_Member = false` | CAS_Member, CANN_Member |
| 4 | Both CAS and CANN | `CAS_Member = true AND CANN_Member = true` | CAS_Member, CANN_Member |
| 5 | Non-Member Contacts | `Record_Type = "Inquiry"` (or `CAS_Member = false AND CANN_Member = false`) | Record_Type (preferred) or CAS_Member + CANN_Member |
| 6 | CAS Communications Eligible | `CAS_Communications = "Yes"` | CAS_Communications |
| 7 | CANN Communications Eligible | `CANN_Communications = "Yes"` | CANN_Communications |

---

## Open Items

1. **Zoho OAuth Scope**: Current token returns 401 (invalid scope). Re-authorization required before:
   - Running `POST /api/admin/create-zoho-fields` to create `Record_Type` field
   - Running `POST /api/admin/zoho/fix-membership-dependencies` (live mode) to backfill 100 records
   - Verifying live field persistence end-to-end

2. **Legacy Duplicate Fields**: The Zoho Leads module contains both properly-named picklist fields (e.g., `CAS_Communications`) and legacy lowercase boolean fields (e.g., `wantscommunications`). Both are populated for backward compatibility. Consider deprecating legacy fields once all integrations use the picklist versions.

3. **Full Zoho Leads Module Export**: A complete export of all standard and custom fields with sample data should be provided to Blue Monarch once OAuth is restored. The field metadata cache (176 fields, 60 custom) can serve as a reference in the interim.
