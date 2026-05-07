# CAS / CANN — Meeting Briefing
**For:** Wednesday May 6, 2026 — 1:30 PM ET (Jeff + Jan + Team Pumpkin internal pre-brief)
**Generated:** May 7, 2026
**Author:** Team Pumpkin

---

## 1. What we are bringing to the meeting

| # | Deliverable | Path |
|---|-------------|------|
| 1 | Full Team Pumpkin database snapshot (Excel) | `docs/CAS_TeamPumpkin_Database_Snapshot_2026-05-07.xlsx` |
| 2 | 3-way comparison (DB ⇄ SSOTv6 ⇄ CRM) | `docs/CAS_3Way_Comparison_2026-05-07.xlsx` |
| 3 | CASL compliance proposal (this document, §4) | this file |
| 4 | New consent audit tables in PostgreSQL | `consent_history`, `consent_tokens` (live) |

---

## 2. The numbers Jeff asked for — confirmed

### Database (form_submissions)
- **173 total rows** in the Team Pumpkin database
- **156** came from `excel-import` (bulk historical CAS Excel)
- **17** came from the live website registration form
- Of those 17 website rows: ~5 are internal test records (excluded from comparison)

### Source comparison (unique people across all three sources)
| Where the person appears | Count |
|---|---|
| In all three (DB + SSOT + CRM) | **145** |
| In SSOT + CRM but **not** in our DB | **85** ← created in Zoho directly or never went through our pipeline |
| In DB + CRM but **not** in SSOT | **11** ← post-SSOT website signups |
| In DB only | 2 |
| In SSOT only | 2 |
| In CRM only | 2 |
| **Total unique people identified** | **247** |

### Quality flags
- **246 of 247** records have at least one inconsistency between sources (mostly: SSOT does not carry the consent fields, so DB/CRM consent values cannot be cross-validated against SSOT)
- **10 people** have duplicate records in at least one source (this is the population Jeff and Jan will work through Wednesday; we are no longer touching it)

---

## 3. What we are saying about Phase 1–3

We will lead with this, before they ask:

> "On April 23 we delivered a 'final' status report. That report measured field population and pipeline health, not data accuracy across the three sources. The 3-way comparison we are handing you today is the accuracy view we should have produced then. We own that gap."

Do not say "successful." Do not say "structurally sound." Do not say "complete."

---

## 4. CASL compliance proposal (NEW — for Jeff's review)

Jeff flagged this as the legal risk that must be solved before any newsletter goes out.

### What we did today (already live in staging DB)
1. **`consent_history` table** — every consent change (opt-in, opt-out, preference update) writes one row with: email, field name, old value, new value, source, IP, user-agent, timestamp.
2. **`consent_tokens` table** — single-use, expiring tokens that authorize the unsubscribe and preferences self-service pages without requiring a login.

### What we still need to build this week (proposing to Jeff)
| # | Item | Effort | Owner |
|---|---|---|---|
| C1 | Wire `/join-cas` form submit handler to write a `consent_history` row for every Yes/No on `wantsCommunications`, `cannCommunications`, `wantsServicesMapInclusion` | 2 hrs | Vasi |
| C2 | One-time backfill: write one `consent_history` row per existing CRM record using its current consent values (source = `bulk_import_backfill`) so we have a baseline timestamp for everyone | 3 hrs | Vasi |
| C3 | Public `/unsubscribe?token=…` page — single-click opt-out, writes to `consent_history`, updates Zoho | 4 hrs | Vasi |
| C4 | Public `/preferences?token=…` page — let recipient choose CAS / CANN / Map separately | 4 hrs | Vasi |
| C5 | Token-issuing helper used when sending newsletters (Zoho Campaigns merge field) | 2 hrs | Vasi |
| C6 | Audit existing CRM records and flag any with `*_Communications = "Yes"` that have no traceable opt-in source — these need re-confirmation before any send | 1 hr report | Vasi |

### Form already CASL-OK on opt-in
We confirmed today that `/join-cas` Yes/No questions for communications and map inclusion default to **unselected** — they are opt-IN, not pre-checked opt-OUT. ✅

### What is NOT yet CASL-OK
- No proof-of-consent timestamp for any of the 247 historical records (C2 fixes)
- No unsubscribe page exists (C3 fixes)
- No granular preferences page (C4 fixes)
- No traceable record of who opted in via what method, when (C1 + C2 fix going forward and historically)

**Recommendation to Jeff:** delay any newsletter send until C1, C2, C3, C5 are live. C4 and C6 can follow within a week. We commit to C1–C3 + C5 by EOD Friday May 8.

---

## 5. What we are NOT doing this week (per Jeff's "stand down")

- ❌ Not merging the 17 duplicates — Jeff and Jan handle this themselves Wed 1:30 PM
- ❌ Not deleting any record — even ones Jan flagged as deletable on April 30 — until they confirm Wed
- ❌ Not pushing more cleanup commits to the SSOT branch
- ❌ Not running any bulk operations against Zoho

---

## 6. What we ARE asking Jan / Jeff for in the meeting

1. **Format check** — does the database snapshot Excel give Jan what she asked for ("show me the database I've never seen")?
2. **CASL plan approval** — green-light C1–C5 by Friday?
3. **MS Forms access** — can Jan share the original Microsoft Forms responses so we can do a true 4-way comparison? (We have never seen the original opt-in records.)
4. **Listen-only invite** — would Jeff allow one Team Pumpkin person on the merge call to take notes and answer schema questions if needed?
5. **30-day "trust restored" definition** — what does success look like for them by June 6?

---

## 7. Internal team — what to do before the meeting

- [ ] Vasi: open both Excel files, walk through them once, be ready to answer "where did this number come from?"
- [ ] Vasi: be prepared to **stop talking** when Jeff cuts in. Answer the exact question, in 2 sentences, then wait.
- [ ] Nital: if asked anything technical, defer to Vasi — do not improvise
- [ ] Whoever takes notes: capture every Jan/Jeff direct quote verbatim — these become next week's plan
- [ ] After the meeting: 15-min internal debrief, update this doc with what changed
