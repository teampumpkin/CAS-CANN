# CAS Zoho — Live Field Quality Analysis (CORRECTED)

**Generated:** 2026-05-09 (live data, 259 leads analyzed)
**Companion file:** `docs/CAS_FIELD_QUALITY_ANALYSIS_2026-05-09.xlsx`

---

## ✅ Good news first

You were right — the forms DO collect lots of data, the proper layout DOES exist, and the proper fields ARE populated correctly. Here's the verified state:

| Proper Zoho field | Coverage | Status |
|---|---|---|
| Email | 259/259 (100%) | ✅ |
| Last_Name (carries full name) | 259/259 (100%) | ✅ |
| Lead_Source | 259/259 (100%) | ✅ |
| CAS_Member (true) | 228/259 (88%) | ✅ |
| CANN_Member (true) | 32/259 (12%) | ✅ |
| CAS_Communications | 257/259 (99%) | ✅ |
| CANN_Communications | 253/259 (98%) | ✅ |
| Services_Map_Inclusion | 256/259 (99%) | ✅ |
| Record_Type | 257/259 (99%) | ✅ |
| Institution_Name | 250/259 (97%) | ✅ |
| Professional_Designation | 248/259 (96%) | ✅ |
| subspecialty | 232/259 (90%) | ✅ |

The forms work, the sync writes the right data into the right proper fields. **No data loss.**

---

## 🔴 What's actually wrong — TWO problems

### Problem 1: The layout has 14 JUNK FIELDS (some appearing 2–3 times!)

When the forms were first wired up, Zoho's "auto-create fields on import" feature created **lowercase duplicates** of every form field name on the fly. These got added to the layout and were never cleaned up. They're all 0% populated:

| Junk field | On layout | Real data is in... |
|---|---|---|
| `discipline` | **2 copies** | `Professional_Designation` ✅ |
| `institution` | **3 copies** | `Institution_Name` ✅ |
| `centerphone` | **2 copies** | (not used) |
| `centeraddress` | **2 copies** | (not used) |
| `nomemberemail` | **2 copies** | `Email` (when filled) |
| `nomembermessage` | **2 copies** | `Description` (when filled) |
| `wantsmembership` | **2 copies** | `CAS_Member` ✅ |
| `wantsservicesmapinclusion` | **2 copies** | `Services_Map_Inclusion` ✅ |
| `wantscannmembership` | 1 copy | `CANN_Member` ✅ |
| `wantscommunications` | 1 copy | `CAS_Communications` ✅ |
| `canncommunications` | 1 copy | `CANN_Communications` ✅ |
| `centername` | 1 copy | (not used) |
| `centerfax` | 1 copy | (not used) |
| `nomembername` | 1 copy | `Last_Name` (when filled) |

**That's 23 layout slots wasted** on junk fields. Removing them shrinks the layout from 83 to 60 slots immediately, with zero data loss.

### Problem 2: 24 unused Zoho built-in fields are also on the layout

These are standard Zoho Lead fields that CAS doesn't use, but they're displayed because the layout includes them by default:

`Phone`, `Mobile`, `Fax`, `Website`, `Salutation`, `Tag`, `Lead_Status`, `Industry`, `No_of_Employees`, `Annual_Revenue`, `Street`, `State`, `Zip_Code`, `Country`, `Description`, `Last_Visited_Time`, `First_Visited_Time`, `First_Visited_URL`, `Average_Time_Spent_Minutes`, `Number_Of_Chats`, `Visitor_Score`, `Referrer`, `Days_Visited`, `Last_Enriched_Time`, `Enrich_Status`, `Converted_Date_Time`, `Lead_Conversion_Time`, `Converted_Account/Contact/Deal`, `Unsubscribed_Mode`, `Unsubscribed_Time`

These should just be hidden from the layout (don't delete — they're Zoho built-ins).

---

## 📊 Real data gaps (small, all explainable)

| Field | Coverage | Cause | Recommendation |
|---|---|---|---|
| `Amyloidosis_Type` | 35/259 (14%) | Older imports didn't capture it | Backfill from local DB where present |
| `First_Name` | 73/259 (28%) | Forms collect single "Full Name" → goes to Last_Name | **Just hide First_Name from layout** |
| `Source_Form` | 144/259 (56%) | Older sync code didn't write this field | Backfill from `Lead_Source` (1 minute) |
| `Form_Submission_Date` | 156/259 (60%) | Historical Excel imports had no source dates | Permanent gap, accepted |
| `Company` | 159/259 (61%) | Standard field unused; data is in Institution_Name | Backfill from `Institution_Name` (1 minute) |

---

## 🛠️ Clean manual checklist for Jeff & Jan

### Phase 1 — Fix the layout (~15 min in Zoho UI)

1. Zoho CRM → **Setup** → **Modules and Fields** → **Leads** → **Layouts**
2. Open the **CAS and CANN** layout
3. **Drag every duplicate field slot back to the unused panel** (right side):
   - All 3 copies of `institution` → drag to unused
   - Both copies of `discipline` → drag to unused
   - Both copies of `centerphone`, `centeraddress`, `nomemberemail`, `nomembermessage`, `wantsmembership`, `wantsservicesmapinclusion` → drag to unused
   - Single junk fields: `centername`, `centerfax`, `nomembername`, `wantscannmembership`, `wantscommunications`, `canncommunications` → drag to unused
4. **Drag the 24 Zoho built-ins** (list above) to unused
5. **Hide the entire "Address Information" section** (5 fields)
6. **Hide the entire "Visit Summary" section** (8 fields)
7. **Hide the "Description Information" section** (1 field)
8. Click **Save**
9. Repeat for the **CAS Registration** layout

### Phase 2 — Delete the junk fields permanently from the module (optional, ~5 min)
After Phase 1 confirms nothing breaks, you can also delete these 14 fields entirely:

Zoho → **Setup** → **Modules and Fields** → **Leads** → **Fields** → find each → **⋯** → **Delete**

Fields to delete: `discipline`, `institution`, `centername`, `centerphone`, `centerfax`, `centeraddress`, `nomemberemail`, `nomembername`, `nomembermessage`, `wantsmembership`, `wantsservicesmapinclusion`, `wantscannmembership`, `wantscommunications`, `canncommunications`

### Phase 3 — Backfill (I can do this programmatically in 2 min, with your approval)
1. Backfill `Source_Form` from `Lead_Source` for 115 records → 100% coverage
2. Backfill `Company` from `Institution_Name` for 91 records → 97% coverage
3. Backfill `Amyloidosis_Type` from local DB submission_data where available

---

## ✅ After all 3 phases, your Zoho will look like this

| | Before | After |
|---|---|---|
| Fields shown on layout | 83 (with 9 duplicates) | ~25 (no duplicates) |
| Always-empty fields visible | 38 | 0 |
| Junk fields in module | 14 | 0 |
| Coverage of `Source_Form` | 56% | 100% |
| Coverage of `Company` | 61% | 97% |

Records will display only the fields that matter for CAS workflow: identity, membership status, communication consent, professional info, and source tracking.

---

## 💬 What to tell Jeff & Jan

> "Good news — all the form data IS reaching Zoho correctly. The proper fields are properly populated. The 'many unwanted fields' problem is that the layout has 14 junk lowercase duplicate fields that were auto-created once when the forms were first wired up. Some are duplicated 2-3 times on the layout — that's why it looks so cluttered. The fix is to drag those out of the layout (15 min in the Zoho UI) and optionally delete them from the module entirely. After that, every field on the layout will have real data in it."

---

## 🤖 What I can automate for you (post-meeting)

If they want, I can do these without anyone clicking in Zoho:
1. **Programmatic layout cleanup** — remove all 14 junk fields + 24 unused built-ins from both layouts
2. **Programmatic field deletion** — delete the 14 junk fields from the Leads module
3. **Backfill Source_Form** — fix 115 records → 100% coverage
4. **Backfill Company** — fix 91 records → 97% coverage
5. **Backfill Amyloidosis_Type** — recover from local DB where available

Combined: ~5 minutes of automation. Just say which ones to run.
