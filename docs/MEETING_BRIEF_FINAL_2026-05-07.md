# 🎯 CAS / CANN — Final Meeting Brief
**For:** Nital (Team Pumpkin)
**Meeting:** Now — Jeff Peterson + Jan Veenhuyzen
**Total prep time:** 3 sessions over 3 days
**Status:** All findings consolidated. Ready to present.

---

## ⚡ OPEN WITH THIS (verbatim, 60 seconds)

> *"Three things up front before we get into the agenda.*
>
> *One — eight minutes ago we discovered the data we've been auditing for three days is from staging only. The live amyloid.ca site uses a separate Neon database in AWS that we don't have access to from our environment. We need read-only credentials to that prod DB to give you a true picture. The CRM analysis is unaffected because Zoho is shared.*
>
> *Two — the SSOT v6 file you gave us has 'Unknown' for membership and consent on 228 of 232 rows. It cannot be the consent source. Whoever populated CRM with Yes/No values used something else, most likely MS Forms. Jan, can you send that file?*
>
> *Three — we have not deleted, merged, or modified anything. Everything we've prepared is read-only proposals for your decision."*

Then go to the agenda.

---

## 📋 CLIENT ASKS — Every one mapped to status

| # | Client Ask | Owner | Today's Status | Decision Needed Today |
|---|---|---|---|---|
| 1 | DB snapshot | Us | ✅ Delivered (staging only) | Approve re-run on prod once we have access |
| 2 | 3-way comparison | Us | ✅ Delivered | Approve 4-way once MS Forms arrives |
| 3 | Live CRM audit | Us | ✅ Delivered | None |
| 4 | Stand down on duplicates | Us | ✅ Compliant | None |
| 5 | Merge 17 duplicates | Jeff + Jan | We delivered 7 in Leads + proposed how to handle | **Walk the proposal sheet, decide each cluster** |
| 6 | Fix Lyndsay Litwin / Kate Elzinga consent | Us | ⏸ Waiting | **Confirm correct values from MS Forms** |
| 7 | CASL defensible plan | Us | 🟡 Schema built, code pending | **Green-light Friday build** |
| 8 | Single source of truth | Us + Jeff | ❌ Blocked on architectural call | **Schedule next-week call** |
| 9 | MS Forms data | Jan | ❌ Never received | **Jan to send today/tomorrow** |
| 10 | Custom views in CRM | Us | ❌ Zero exist | Approve build (Friday) |
| 11 | Soft-delete pattern | Us | ❌ Not built | Approve next week |
| 12 | Newsletter capability | Us | ❌ Blocked by CASL | After CASL complete |
| 13 | Simpler architecture (DB ≡ CRM) | Us + Jeff | ❌ Architectural decision | Schedule call |
| 14 | Restore trust | Us | 🟡 Weekly Friday cadence proposed | **Approve cadence** |
| 15 | **NEW: Production DB visibility** | **Jeff** | 🚨 Just discovered | **Grant read access to prod Neon** |
| 16 | **NEW: Investigate Feb 21 form silence** | Us + Jeff | 🚨 Pending prod DB access | Owner + due date |

---

## 🚨 The 3 Findings They Don't Know Yet

### Finding 1 — Two databases, not one
- **Staging DB:** `helium` (Replit) — 173 records, last submission Feb 21
- **Production DB:** `ep-young-star-ad5l1son.c-2.us-east-1.aws.neon.tech` — UNKNOWN content
- **Consequence:** Every report so far reflects staging only. Need prod credentials to verify reality.

### Finding 2 — SSOT file has no consent data
- 232 rows · 228 marked "Unknown" in every consent + membership column
- The CRM Yes/No values came from somewhere we've never seen
- **Most likely source:** MS Forms (per Jan's earlier mention)
- **Action:** Jan must share the MS Forms export

### Finding 3 — CASL audit trail is empty
- `consent_history` table exists (we built it)
- 0 rows
- Sending any newsletter today = legal exposure under CASL
- **Action:** Approve Friday build kickoff

---

## 🔍 Live System Snapshot

### Production (amyloid.ca) — verified just now
| Check | Result |
|---|---|
| Site reachable | ✅ HTTP 200, 0.74s |
| `/health` endpoint | ✅ "healthy" |
| `/join-cas` page | ✅ HTTP 200 |
| `/api/cas-cann-registration` POST | ✅ Alive (rejected empty payload as expected) |
| Environment flag | ✅ `production` |
| Production DB | ✅ Connected to AWS Neon |

### Live CRM (Zoho)
| Module | Records | Notes |
|---|---|---|
| Leads | 243 | 70% missing names · 47% missing source · 0 custom views |
| Contacts | 256 | More than Leads = classification overlap |
| Accounts | 258 | Institutional layer |
| Custom views | **0** | Jan can't segment anyone |
| Duplicate clusters (Leads) | **7** | Read-only proposal delivered |
| OAuth | ✅ Auto-refreshing (Vasi Karan, Self Client) |

### Staging DB (Replit/Neon `helium`)
| Item | Count |
|---|---|
| Form submissions | 173 (16 web + 157 imports) |
| Submission logs | 1,535 |
| Successful CRM pushes | 1,261 |
| Hard failures | 6 |
| Last submission | Feb 21, 2026 (75-day silence) |
| Townhall registrations | 2 |
| Resources uploaded | 9 |
| CASL audit rows | **0** |

---

## 📅 The Plan (commit to this in the meeting)

### Phase A — This week (decisions + safe fixes)
| Day | Action | Owner |
|---|---|---|
| Wed (today) | Decisions A1–A6, get prod DB access, get MS Forms file | Jeff + Jan |
| Thu | Re-run audits against prod DB, prep backfill scripts | Us |
| Fri | Execute approved merges, backfill empty fields, build 6 custom views | Us |
| Fri 5pm | First weekly status email | Us |

### Phase B — Next week (CASL + architecture)
| Day | Action |
|---|---|
| Mon-Tue | Wire form → consent_history, backfill baseline for ~247 records |
| Wed-Thu | Build /unsubscribe + /preferences pages, token issuer |
| Thu | 30-min architecture call with Jeff (single source of truth) |
| Fri 5pm | Status email — CASL defensible state reached |

### Phase C — Week after (cleanup + prevention)
| Action |
|---|
| Soft-delete pattern replaces hard delete |
| Lead vs Contact reclassification |
| Fuzzy dedup at form + import (prevent recurrence) |
| Admin DB viewer for Jan (read-only) |
| Decommission staging-DB writes (CRM = SSOT) |

---

## 🎤 Talking Points During the Meeting

### When walking the duplicate proposal sheet
> *"We did not merge anything. The ⭐ winner column is just our suggestion based on which record has more populated fields. Override it on any cluster you want. Tell us 'merge these, leave those' and we'll execute Friday."*

### When discussing CASL
> *"Today, sending a CASL-regulated message would not be defensible. We can fix that in three build days. The audit-trail table is already in the database — it just needs to be wired to the form. Need your green light to start Friday."*

### When discussing the form silence
> *"We don't yet know if Feb 21 is the real last date or just the staging-DB last date. Once we have prod DB access we'll know in an hour. If the public form is genuinely silent, we'll find root cause within 24 hours of access."*

### When asked about timeline / past deadlines
> *"You're right that we've been slow. The new plan has weekly Friday-5pm status emails — every Friday until done. If we're going to miss a date, you'll hear it from us first."*

### When asked about CRM as SSOT
> *"The CRM cannot be the SSOT today. Two weeks of work between us and that state — the plan is in section Phase A through C. Step 1 is getting MS Forms data so we know what consent values are actually defensible. Step 11 is decommissioning the staging DB so there's only one source."*

---

## ❌ DO NOT in the meeting

- Don't defend April 23
- Don't blame the SSOT file (it just is what it is)
- Don't promise dates beyond what's in this brief
- Don't pitch new features — only execute their decisions
- Don't argue if Jan disputes a duplicate winner — write it down, fix later
- Don't say "we should have caught this earlier" — it sounds defensive

---

## ✅ Must leave the meeting with

1. **Production DB credentials** (or commitment from Jeff to provide)
2. **MS Forms file** from Jan (or commitment + date)
3. **Cluster-by-cluster decisions** on the 7 duplicates
4. **Green light** for Phase A backfill (B1–B4)
5. **Green light** for Phase B CASL build
6. **Calendar invite** for next-week architecture call
7. **Confirmation** of weekly Friday-5pm status cadence

---

## 📎 Files to Reference During the Call

| File | When to mention |
|---|---|
| `MEETING_BRIEF_FINAL_2026-05-07.md` (this file) | Your private script |
| `CAS_Master_Status_Report_2026-05-07.md` | "Section 4 covers SSOT review" |
| `CAS_Duplicate_Merge_Proposal_2026-05-07.xlsx` | **Open during call — Merge Proposal sheet** |
| `CAS_3Way_Comparison_2026-05-07.xlsx` | If Jan questions specific records |
| `CAS_CRM_Deep_Audit_2026-05-07.xlsx` | If Jeff questions CRM gaps |
| `CAS_TeamPumpkin_Database_Snapshot_2026-05-07.xlsx` | If anyone asks "what do you have?" |
| `CLIENT_EMAIL_2026-05-07.md` | The cover email (already drafted) |

---

## 🧭 The 5-Sentence Summary You Can Recite If Things Go Sideways

> *We've audited everything we can see in three days. The data shows three new findings: there are two databases not one, the SSOT file isn't actually a consent register, and CASL isn't defensible today. We've prepared four read-only reports plus a duplicate merge proposal — nothing has been changed in production. We need three things from you to move forward: production DB access, the MS Forms file, and approval to start the CASL build Friday. We'll send a status email every Friday at 5 PM until this is closed.*

---

**Go. You've got this.** Come back to me after the meeting with notes — I'll convert decisions into execution by Friday morning.
