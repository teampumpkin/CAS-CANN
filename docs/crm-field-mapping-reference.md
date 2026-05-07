# CRM Field Mapping Reference

**Document Purpose**: Reconciliation of all front-end form fields to Zoho CRM Leads module field names.
**Last Updated**: May 7, 2026 (refreshed against current `casRegistrationSchema` and `buildCentralizedZohoData`)
**Prepared For**: Blue Monarch CRM Architectural Review · CAS/CANN SSOT cleanup
**Source of truth**: `shared/schema.ts` (form schema) + `server/zoho-crm-service.ts:1726+` (`buildCentralizedZohoData`)

---

## Field Mapping Table

### Registration Form Fields (Member Path)

| # | Form Field (UI Label) | Form Data Key | Zoho CRM Field (API Name) | Data Type | Exists in Zoho | Notes |
|---|----------------------|---------------|--------------------------|-----------|----------------|-------|
| 1 | CAS Membership Selection | `wantsMembership` | `CAS_Member` | Boolean | Yes | Membership flag |
| 2 | CANN Membership Selection | `wantsCANNMembership` | `CANN_Member` | Boolean | Yes | Dependency enforced: CANN=Yes forces CAS=Yes |
| 3 | Full Name | `fullName` | `Last_Name` | Text | Yes (standard) | Zoho standard field |
| 4 | Email Address | `email` | `Email` | Email | Yes (standard) | Zoho standard field |
| 5 | Professional Designation | `discipline` | `Professional_Designation` | Text | Yes | Custom field |
| 6 | Sub-specialty Area of Focus | `subspecialty` | `subspecialty` (custom field, 50-char cap) | Text | Yes (custom) | Stored in the custom `subspecialty` field; truncated to 50 chars by `cleanAndTruncate()`. Not mirrored to `Description` for member records. |
| 7 | Primary Amyloidosis Type | `amyloidosisType` | `Amyloidosis_Type` | Picklist | Yes | Values: ATTR, AL, Both ATTR and AL, Other |
| 8 | Centre / Clinic Name | `institution` | `Company` + `Institution_Name` | Text | Yes | Mapped to both standard `Company` and custom `Institution_Name`. Sanitized via `cleanAndTruncate()` |
| 9 | Services Map Inclusion | `wantsServicesMapInclusion` | `Services_Map_Inclusion` | Picklist | Yes | Values: Yes, No |
| 10 | CAS Communication Consent | `wantsCommunications` | `CAS_Communications` | Picklist | Yes | Values: Yes, No |
| 11 | CANN Communication Consent | `cannCommunications` | `CANN_Communications` | Picklist | Yes | Values: Yes, No |

### Services Map Branch (Q9 = "Yes" — added April 2026, NEW since prior version of this doc)

| # | Form Field (UI Label) | Form Data Key | Zoho CRM Field (API Name) | Data Type | Notes |
|---|----------------------|---------------|--------------------------|-----------|-------|
| 9a | Centre / Clinic Name | `centerName` | `Map_Clinic_Name` | Text | Only sent when `wantsServicesMapInclusion = "Yes"` |
| 9b | Centre / Clinic Address | `centerAddress` | `Map_Clinic_Address` | Text | Same gating |
| 9c | Centre / Clinic Phone | `centerPhone` | `Map_Clinic_Phone` | Text | Sanitized via `sanitizePhone()` upstream |
| 9d | Centre / Clinic Fax | `centerFax` | `Map_Clinic_Fax` | Text | Sanitized via `sanitizePhone()` upstream |

### Registration Form Fields (Non-Member / Inquiry Path)

| # | Form Field (UI Label) | Form Data Key | Zoho CRM Field (API Name) | Data Type | Exists in Zoho | Notes |
|---|----------------------|---------------|--------------------------|-----------|----------------|-------|
| 12 | Contact Name | `noMemberName` | `Last_Name` | Text | Yes (standard) | Overwrites Last_Name for inquiry records |
| 13 | Contact Email | `noMemberEmail` | `Email` | Email | Yes (standard) | Overwrites Email for inquiry records |
| 14 | Contact Message | `noMemberMessage` | `Description` | Textarea | Yes (standard) | Free-text inquiry message |

### System-Generated Fields (Not on Form)

| # | Field Purpose | Zoho CRM Field (API Name) | Data Type | Exists in Zoho | Notes |
|---|--------------|--------------------------|-----------|----------------|-------|
| 15 | Record Classification | `Record_Type` | Picklist | Yes | Values: "Member", "Inquiry". 214 Members, 31 Inquiries. 100% populated. |
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

**Verification**: Last full audit (Feb 24, 2026, 245 records) confirmed **0 dependency violations**. Re-audit endpoint available at `POST /api/admin/zoho/fix-membership-dependencies` (supports `dryRun`) — should be re-run after the burnt-submission rescue (~13 new records).

---

## Record Type Classification

| Condition | Record_Type Value | Lead_Source Value |
|-----------|------------------|-------------------|
| CAS=Yes and/or CANN=Yes | `Member` | `Website - [Form Name]` |
| CAS=No and CANN=No (web form) | `Inquiry` | `Website - Contact Inquiry` |
| Excel import | `Member` or `Inquiry` (based on data) | `[Import Sheet Name]` |

**Status**: All 245 records classified. 214 Members, 31 Inquiries, 0 null.

---

## Administrative Views

Four custom views deployed in Zoho CRM Leads module:

| # | View Name | Filter Criteria | Record Count |
|---|-----------|----------------|--------------|
| 1 | CAS_Members | `CAS_Member = true` | 214 |
| 2 | CANN_Members | `CANN_Member = true` | 22 |
| 3 | Website_Registrations | `Lead_Source starts with "Website"` | 49 |
| 4 | Members_vs_Inquiries | `Record_Type is not empty` | 245 |

Additional views constructable using explicit field criteria:

| # | View Name | Filter Criteria |
|---|-----------|----------------|
| 5 | CAS Only (No CANN) | `CAS_Member = true AND CANN_Member = false` |
| 6 | Both CAS and CANN | `CAS_Member = true AND CANN_Member = true` |
| 7 | Non-Member Contacts | `Record_Type = "Inquiry"` |
| 8 | CAS Communications Eligible | `CAS_Communications = "Yes"` |
| 9 | CANN Communications Eligible | `CANN_Communications = "Yes"` |

---

## Zoho Layout Configuration

Records are assigned to the correct Zoho layout based on form type:

| Form Name | Zoho Layout | Layout ID |
|-----------|------------|-----------|
| CAS Registration | CAS Registration | `6999043000001335003` |
| CAS & CANN Registration | CAS and CANN | `6999043000000091055` |
| Excel Import - CAS Registration | CAS Registration | `6999043000001335003` |
| Excel Import - PANN Membership | CAS and CANN | `6999043000000091055` |

Layout is set via form configurations in the database and applied by:
- **Sync worker**: Reads layout from form config and passes to `createRecord`
- **Admin orphan re-sync**: Reads layout from form config (with fallback to CAS and CANN)
- **Admin remediation**: Updates layout on existing records to correct any historical misassignment
