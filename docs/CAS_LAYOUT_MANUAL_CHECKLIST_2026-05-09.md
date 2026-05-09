# CAS Zoho Leads — Manual Layout Assignment Checklist

**Generated:** 2026-05-09
**For:** Nital → to walk through with Jeff & Jan, then execute manually in Zoho CRM UI

---

## ⚠️ The problem in one paragraph

When the 259 leads were created/imported in Zoho, **none of them were assigned to a Layout**. Zoho has 2 layouts configured for the Leads module ("CAS Registration" and "CAS and CANN"), but every record currently shows `Layout = (none)`. That's why every field is showing on every record instead of the proper page-layout-specific view Jan & Jeff set up before.

**Verified counts (live from Zoho, 2026-05-09):**

| Status | Count |
|---|---|
| ✅ Already on correct layout | 0 |
| 🔴 No layout assigned (need fix) | **259** |
| ⚠️ On wrong layout | 0 |
| ❓ Need manual review | 0 |

---

## 📋 Available layouts in Zoho (Leads module)

| Layout Name | Layout ID | Use For |
|---|---|---|
| **CAS Registration** | `6999043000001335003` | CAS-only members (no CANN) |
| **CAS and CANN** | `6999043000000091055` | Joint CAS + CANN members, PANN historicals |

---

## 🛠️ Manual fix — step-by-step in Zoho UI

For each row in the Bulk Update Plan below, do this:

1. Open Zoho CRM → **Leads** module
2. Top-right → **Filter** (funnel icon) → set **Lead Source** equals **"<value from row>"**
3. Click **Select All** at the top of the result list
4. Top toolbar → **More** → **Mass Update**
5. Field: **Layout** → Value: **<target layout from row>**
6. Click **Update** → confirm
7. ✅ Tick the row off below
8. Repeat for next row

---

## 🎯 Bulk Update Plan (12 groups, 259 records total)

| ☐ | Filter: Lead Source equals... | Set Layout to... | Records |
|---|---|---|---|
| ☐ | `Excel Import - Re-synced` | **CAS Registration** | 60 |
| ☐ | `Excel Import - CAS Registration (Historical)` | **CAS Registration** | 54 |
| ☐ | `Excel Import - CAS Registration (2025)` | **CAS Registration** | 50 |
| ☐ | `Website - CAS Registration` | **CAS Registration** | 27 |
| ☐ | `Excel Import - CAS Registration (French 2025)` | **CAS Registration** | 21 |
| ☐ | `Website - Join CAS Today (Historical)` | **CAS Registration** | 5 |
| ☐ | `SSOT Import` | **CAS Registration** | 2 |
| ☐ | `Website - CAS & CANN Registration` | **CAS and CANN** | 27 |
| ☐ | `Excel Import - PANN Membership (Historical)` | **CAS and CANN** | 10 |
| ☐ | `Website - CAS/CANN Registration Form` | **CAS and CANN** | 1 |
| ☐ | `CAS & CANN Registration` | **CAS and CANN** | 1 |
| ☐ | `Website - CANN Membership` | **CAS and CANN** | 1 |
| | **TOTAL** | | **259** |

**Sub-totals:**
- 219 records → **CAS Registration** layout
- 40 records → **CAS and CANN** layout

---

## ✅ How to verify after each batch

After each Mass Update:
1. Stay on the same filtered view
2. Click any record → top of detail page should now show the layout name beside the title (e.g. "CAS Registration ▾")
3. Only the fields belonging to that layout should appear

If a record still shows all fields → the mass update didn't apply (refresh and retry).

---

## 🤔 If Jan or Jeff want a DIFFERENT mapping

The mapping above uses this rule:
> If the record came from a CAS-only registration form or import, use **CAS Registration**.
> If the record came from a CAS+CANN combined form or PANN historical import, use **CAS and CANN**.

If they want a different rule (e.g. "everyone with CANN_Member=true goes to CAS and CANN regardless of source"), open `docs/CAS_LAYOUT_MANUAL_CHECKLIST_2026-05-09.xlsx` → "Per-Record Detail" tab → re-sort/filter by `CAS Member` / `CANN Member` columns and adjust which records go where.

The Per-Record Detail tab has every Lead ID, email, source, and current member flags so you can build any custom grouping you need.

---

## 📁 Companion file

- **`docs/CAS_LAYOUT_MANUAL_CHECKLIST_2026-05-09.xlsx`** — same plan as a workbook with 3 tabs:
  - `README` — instructions
  - `Bulk Update Plan` — the 12 groups above
  - `Per-Record Detail` — every single Lead with ID, email, source, current layout, expected layout

---

## 🔧 Why I'm not doing it for you

You asked for a **manual checklist** — Jan & Jeff want to verify each batch as it's applied (and may want to tweak the mapping). Doing it via the Zoho UI also gives them the audit trail they're used to seeing.

If after the meeting you want me to do the remaining batches programmatically (the API supports `Layout: { id: ... }` on every PUT), just say the word and I'll automate it in 2 minutes.
