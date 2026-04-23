# CRM SSOT Sync — Phase 2 Completion Report
**Date:** April 23, 2026
**Prepared for:** CAS / CANN Client

---

## Summary of All Three Phases

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Validate website & MS Form data against CRM | ✅ Complete |
| Phase 2 | Apply SSOT deletions and new record creation | ✅ Complete |
| Phase 3 | Create filtered January CRM views | ✅ Complete |

---

## Phase 2 — What Was Executed (April 23, 2026)

### Records Deleted (2)
| Zoho ID | Name | Email | Reason |
|---------|------|-------|--------|
| 6999043000001974001 | vasi test | vasi.karan@teampumpkin.com | Test record — not in SSOT |
| 6999043000001074001 | Unknown | jane.smith@hospital.ca | Dummy record — not in SSOT |

### Records Created in CRM (2)
| Zoho ID | Name | Email | SSOT Row |
|---------|------|-------|----------|
| 6999043000002227001 | Danielle Murray | danielle.murray@pch.ca | Row 230 |
| 6999043000002228001 | Karine Deschenes | karine.deshenes@icm-mhi.org | Row 232 |

### Records Skipped — Consent Data Protected (17)
These 17 CRM records are **not present in the SSOT** but were deliberately preserved because they carry active consent / opt-in preferences. Per the project requirements, records with subscription or opt-in data cannot be deleted without explicit review.

| Zoho ID | Name | Email | CAS Comm | CANN Comm | Services Map |
|---------|------|-------|----------|-----------|--------------|
| 6999043000001967018 | Devan Hrupp | devan.hrupp@albertahealthservices.ca | Yes | Yes | No |
| 6999043000001965018 | Karine Deschenes | karine.deschenes@icm-mhi.org | Yes | Yes | Yes |
| 6999043000001961002 | Danielle Murray | danielle.murray@phc.ca | Yes | Yes | Yes |
| 6999043000001917001 | Danielle Murray | danielle.murray@phc.ca | Yes | Yes | Yes |
| 6999043000001916001 | Karine Deschenes | karine.deschenes@icm-mhi.org | Yes | Yes | Yes |
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

> **Note:** Danielle Murray and Karine Deschenes each appear **twice** in this list (different Zoho IDs, same email). These are legacy duplicate records from before the SSOT exercise. Recommend manual merge or deletion of duplicates directly in Zoho.

### Records Skipped — Missing Email (2)
These 2 SSOT rows could not be created in the CRM because they have no email address. They must be added manually once an email is sourced.

| SSOT Row | Name |
|----------|------|
| Row 5 | Md. Pervez Anwar |
| Row 6 | Jing Zeng |

---

## Current CRM Record Count vs. 232 Target

| | Count |
|--|-------|
| CRM total records (post-Phase 2) | **247** |
| SSOT rows | 232 |
| SSOT rows matched in CRM | 230 |
| CRM records not in SSOT (consent-protected) | 17 |
| SSOT rows not in CRM (missing email) | 2 |

### Path to 232

The 232 target is reachable with two manual steps:

1. **Review and remove the 17 consent-protected records** — these people are not in the approved SSOT. You may choose to retain, archive, or delete them. If all 17 are removed: 247 − 17 = **230**.
2. **Add the 2 no-email records manually** — source an email for Md. Pervez Anwar and Jing Zeng and add them in Zoho: 230 + 2 = **232**.

---

## Phase 3 — January CRM Views Created

Two public filtered views are now live in the Zoho CRM Leads module:

| View Name | Filter | Columns Shown |
|-----------|--------|---------------|
| January 2025 – New Registrations | Created_Time Jan 1–31, 2025 | Last Name, First Name, Email, Lead Source |
| January 2026 – New Registrations | Created_Time Jan 1–31, 2026 | Last Name, First Name, Email, Lead Source |

**How to access:** In Zoho CRM → Leads → click the view dropdown (top left) → scroll to the public views section.

---

## Outstanding Items for Client Action

1. **Decide on 17 consent-protected records** — review the table above; remove duplicates (Danielle Murray × 2, Karine Deschenes × 2) at minimum
2. **Source emails for Md. Pervez Anwar and Jing Zeng** — add manually to Zoho once confirmed
3. **Download CRM export** — client to export from Zoho for their own records (Excel available directly from CRM)
4. **Incremental data cleanup** — all-caps names, missing first names, and other formatting issues remain as-is per client direction; recommend cleaning within Zoho incrementally

---

*Report generated automatically from live CRM and SSOT data on April 23, 2026.*
