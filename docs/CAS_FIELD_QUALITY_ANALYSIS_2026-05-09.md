# CAS Zoho — Live Field Quality Analysis

**Generated:** 2026-05-09 (live data, 259 leads analyzed)
**Companion file:** `docs/CAS_FIELD_QUALITY_ANALYSIS_2026-05-09.xlsx` (5 tabs)

---

## 🔴 The two problems in one paragraph

1. **Unwanted fields on layout** — 38 of 83 Zoho Lead fields are completely empty (0% populated) across all 259 records. They're showing up as empty rows in every record because the layout includes every field. 14 of those 38 are **junk fields created by a sync bug** (e.g. `centername`, `discipline`, `wantsmembership`) that should be deleted from Zoho entirely.

2. **Missing data** — `First_Name` is 0% populated (the data is actually in `Last_Name` — forms collect a single "Full Name"), `Company` is only 61% populated (the data is in `Institution_Name`), and `Source_Form` is only 56% populated (older sync code didn't write it).

---

## 📊 What I found in live data (per-field)

### ✅ Fields working well (100% populated)
`Email`, `Last_Name`, `Lead_Source`, `Owner`, `CAS_Member`, `CANN_Member`, `Record_Status`, `Email_Opt_Out`, `Full_Name`, `Locked`, `Is_Converted`, `Change_Log_Time`

### ⚠️ Fields with partial coverage (real data gaps)
| Field | Coverage | Why |
|---|---|---|
| `First_Name` | **0%** (0/259) | Forms only collect Full Name → stored in Last_Name instead |
| `Company` | 61% (159/259) | Data is in `Institution_Name` (97%) — wrong field used |
| `Source_Form` | 56% (144/259) | Older sync code didn't write it; only newer records have it |
| `Form_Submission_Date` | 60% (156/259) | 2025 Excel imports had no source dates (known/documented) |
| `subspecialty` | 90% (232/259) | Some imports lacked this field |

### 🔴 Fields that should be REMOVED FROM LAYOUT (38 always-empty fields)
**Custom junk created by sync bug** (also delete from Zoho entirely):
- `centername`, `centerfax`, `centeraddress`, `centerphone`
- `discipline`, `institution`, `nomemberemail`, `nomembername`, `nomembermessage`

**Lowercase duplicate fields** (sync wrote to BOTH proper and these — also delete):
- `wantsmembership` (duplicate of `CAS_Member`)
- `wantscommunications` (duplicate of `CAS_Communications`)
- `wantsservicesmapinclusion` (duplicate of `Services_Map_Inclusion`)
- `wantscannmembership` (duplicate of `CANN_Member`)
- `canncommunications` (duplicate of `CANN_Communications`)

**Zoho built-ins not used by CAS** (just hide from layout):
- `Phone`, `Mobile`, `Fax`, `Website`, `Lead_Status`
- `No_of_Employees`, `Annual_Revenue`, `Salutation`, `Tag`
- `Street`, `State`, `Zip_Code`, `Country` (address fields not collected)
- `Converted_Date_Time`, `Lead_Conversion_Time`, `Converted_Account/Contact/Deal`
- `Last_Visited_Time`, `First_Visited_Time/URL`, `Days_Visited`, `Average_Time_Spent_Minutes`
- `Number_Of_Chats`, `Visitor_Score`, `Referrer`
- `Last_Enriched_Time`, `Enrich_Status`
- `Unsubscribed_Mode`, `Unsubscribed_Time`

---

## 🛠️ Manual fix checklist for Zoho

### Phase 1 — Delete junk fields (ONE-TIME, ~10 min)
For each field in the **"Fields to DELETE"** tab of the Excel:
1. Zoho CRM → **Setup** (gear icon, top-right) → **Modules and Fields**
2. Click **Leads**
3. Find the field by name → click the **⋯** menu → **Delete**
4. Confirm

These 14 junk/duplicate fields will be permanently removed. ✅ Tick each as done in the Excel.

### Phase 2 — Edit the layout to remove unused fields (~15 min)
1. Zoho CRM → **Setup** → **Modules and Fields** → **Leads** → **Layouts**
2. Edit the **CAS Registration** layout (and **CAS and CANN** layout — both need this)
3. For each field listed in the **"Layout Cleanup Plan"** tab:
   - Hover over the field on the canvas → drag it back to the unused-fields panel on the right
4. Save

### Phase 3 — Fix the missing data (1 decision needed first)
Discuss with Jeff & Jan:

**A. First_Name / Last_Name split** — Recommended: keep current setup, just hide First_Name from layout. (Splitting names like "Mary O'Sullivan" automatically is risky.)

**B. Company vs Institution_Name** — Recommended: I can backfill Company from Institution_Name in 1 minute (programmatic). Want me to?

**C. Source_Form backfill** — Recommended: I can backfill Source_Form from Lead_Source for the 115 missing records in 1 minute (programmatic). Want me to?

---

## 📋 Side-by-side: what's in the layout NOW vs what SHOULD be in the layout

| Currently shown | Recommended |
|---|---|
| 83 fields | ~25 fields |
| Includes 38 always-empty fields | Only fields with actual data |
| Includes 14 junk/duplicate fields | Junk fields deleted from Zoho |
| Confusing for staff | Clean, focused on CAS workflow |

**Recommended fields to KEEP on layout:**
- **Identity:** `Last_Name` (carries full name), `Email`, `Owner`
- **Membership status:** `CAS_Member`, `CANN_Member`, `Record_Type`
- **Communications consent:** `CAS_Communications`, `CANN_Communications`
- **Professional info:** `Institution_Name`, `Professional_Designation`, `subspecialty`, `Amyloidosis_Type`
- **Source tracking:** `Lead_Source`, `Source_Form`, `Form_Submission_Date`
- **Map opt-in:** `Services_Map_Inclusion`
- **Audit:** `Created_Time`, `Modified_Time`, `Last_Activity_Time`
- **System:** `Email_Opt_Out`, `Record_Status`, `Layout`

That's ~20-25 fields — clean, no clutter, every field has data.

---

## 💬 What to tell Jeff & Jan in the meeting

> "I pulled live data from all 259 records and analyzed every field. The layout is showing 38 fields that are always empty — that's why the records look cluttered. Many of those are junk fields auto-created by a sync bug, which we should permanently delete from Zoho.
>
> The 'missing data' you're seeing is mostly a field-mapping issue, not actually missing — the full name is stored in Last_Name (because the forms collect a single Full Name field), and Institution data is in Institution_Name not Company. I have a manual checklist with every field, every action, and a recommended cleanup plan in the workbook."

---

## 🔧 What I can automate after the meeting

If Jeff/Jan approve, I can do these in minutes (no manual Zoho clicking):
1. ✅ Backfill `Company` from `Institution_Name` (159 → ~250 populated)
2. ✅ Backfill `Source_Form` from `Lead_Source` (144 → 259 populated)
3. ✅ Programmatically delete the 14 junk fields from Zoho
4. ✅ Programmatically remove unused fields from the layout

Just say the word and which ones you want done.
