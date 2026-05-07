# CAS / CANN — Client Meeting Package
**For:** Jeff Peterson + Jan Veenhuyzen
**From:** Team Pumpkin
**Date:** May 7, 2026
**Purpose:** Live meeting walk-through + status + timeline ask

---

## 📦 What we are sharing with you today

| # | File | What it is | When to open in the call |
|---|---|---|---|
| 1 | **`CLIENT_MEETING_PACKAGE_2026-05-07.md`** *(this doc)* | Meeting agenda + summary + ask | Open first |
| 2 | `CAS_JOURNEY_AND_TRUTH_2026-05-07.md` | Full 4-month history + honest current state | Reference if asked "where are we?" |
| 3 | `CAS_TeamPumpkin_Database_Snapshot_2026-05-07.xlsx` | The DB Jan asked to see — every row in our staging database | When Jan says "show me the database" |
| 4 | `CAS_3Way_Comparison_2026-05-07.xlsx` | DB ⇄ SSOT ⇄ CRM — 247 people, who appears where | When discussing data completeness |
| 5 | `CAS_CRM_Deep_Audit_2026-05-07.xlsx` | Live Zoho CRM audit — every Lead with its consent + classification fields | When discussing CRM cleanliness |
| 6 | `CAS_Duplicate_Merge_Proposal_2026-05-07.xlsx` | 7 duplicate clusters — read-only proposal with suggested winners | **Walk this sheet line by line** |
| 7 | `CAS_CANN_ValidationReport_2026_04.xlsx` *(from April)* | The April 23 validation work — 19 to remove, 4 to add, 124 discrepancies | If Jeff asks "what about April work?" |

**All seven files are ready to send.** Use the email template at the bottom of this doc.

---

## 🎯 The Meeting in 3 Sentences

1. The CRM is in better shape than recent reports suggested — **247 classified records, 100% populated consent and membership fields, 6 working list views, 99% form sync rate.**
2. Three things stand between today and a defensible newsletter send: **CASL audit logging (3 build days), 17 consent-held records (your decision), and 7 duplicate clusters (your decision).**
3. **Give us until Friday May 22 and we will deliver: clean data, CASL-defensible consent log, working unsubscribe + preferences pages, and the first newsletter test send.**

---

## ⏰ The Time Ask (the main reason for this meeting)

We are asking for a **15-day extension** to close out three items properly rather than rush them and create new problems.

### Why we need 15 more days

| Item | Why it can't be rushed | Days |
|---|---|---|
| CASL consent log build | Legal exposure if wrong. Needs form wiring + backfill + unsubscribe page + preferences page + token issuer | 5 |
| 17 consent-held records resolution | Need your sign-off on each one — Jan's expertise required | 2 (your time) |
| 7 duplicate clusters resolution | Same — your sign-off on winners | 2 (your time) |
| Production DB read access + audit | Confirm form is flowing live, no surprises before campaign send | 1 |
| Zoho Campaigns hookup + test send | Internal QA before any real send | 3 |
| Buffer for unknowns | (Always 1 day) | 1 |

**Total: 14 working days from May 8 → Friday May 22**

### What you will receive on May 22 (committed deliverables)

1. ✅ CASL-defensible consent audit log live, backfilled for all 247 records
2. ✅ Public `/unsubscribe?token=…` page (single-click)
3. ✅ Public `/preferences?token=…` page (CAS / CANN / Map separate toggles)
4. ✅ All 17 consent-held records resolved per your decisions
5. ✅ All 7 duplicate clusters merged or marked per your decisions
6. ✅ 2 missing-email records added (Md. Pervez Anwar, Jing Zeng) once you provide emails
7. ✅ Test newsletter sent to internal team and verified
8. ✅ Production DB audit report (once we have read-only access)
9. ✅ Weekly Friday 5pm status email — every Friday until done

### What we need from YOU to honor this date

| # | Need | Owner | By when |
|---|---|---|---|
| A | Decisions on the 7 duplicate clusters | Jeff + Jan | End of this meeting |
| B | Decisions on the 17 consent-held records | Jeff + Jan | This week |
| C | Production DB read-only credentials | Jeff | This week |
| D | Email addresses for Md. Pervez Anwar + Jing Zeng | Jan | This week |
| E | Confirmation: send first newsletter from `news@amyloid.ca` (or other) | Jan | This week |
| F | Approval to start CASL build Friday May 8 | Jeff | End of this meeting |

If any of A–F slip, we slip the May 22 date by the same amount, transparently.

---

## 📋 Meeting Agenda (60 minutes)

| Time | Topic | Who leads |
|---|---|---|
| 0:00–0:05 | Open: state where we are honestly | Us |
| 0:05–0:15 | Walk the duplicate proposal sheet — get decisions | Us → Jan |
| 0:15–0:25 | Walk the 17 consent-held list — get decisions | Us → Jan |
| 0:25–0:35 | CASL plan walkthrough + sign-off ask | Us → Jeff |
| 0:35–0:45 | Production DB access + Friday status cadence | Us → Jeff |
| 0:45–0:55 | Open Q&A — anything Jan or Jeff want to raise | Them |
| 0:55–1:00 | Recap commitments + send calendar invite for May 22 demo | Us |

---

## 🗣️ The Open (verbatim — say this in the first 90 seconds)

> *"Thanks for making the time. Three things up front before we get into the agenda.*
>
> *One — we want to apologize for the bumpy communication over the last two weeks. We were over-reporting health and under-reporting risk. The honest picture is in the journey document we shared this morning.*
>
> *Two — the CRM itself is in better shape than we've been making it sound. 247 records, all classified, 100% populated consent fields, 6 working views, 99% form sync rate. The architecture is doing its job.*
>
> *Three — we have three remaining gaps before a defensible newsletter: the CASL consent log, the 17 records you flagged, and the 7 duplicate clusters. We'd like to walk through each of these today, get your decisions, and commit to a Friday May 22 finish line."*

Then start the agenda.

---

## 🚫 Do NOT say in the meeting

- "It's all done" — it isn't
- "We told you that already" — even if you did
- "That was on April 23" — own the present
- Defend the past more than 1 sentence per topic
- Promise dates beyond what's in this doc
- Pitch new features

---

## 📬 Cover email to send before the meeting

```
Subject: CAS — Files for today's call + the ask

Hi Jeff and Jan,

Ahead of today's call, attached/linked are the files we'll walk through:

1. CLIENT_MEETING_PACKAGE — the agenda and what we're asking for (start here)
2. CAS_JOURNEY_AND_TRUTH — full 4-month history, honest status
3. Database snapshot — the DB Jan asked to see
4. 3-way comparison — DB / SSOT / CRM
5. CRM deep audit — every Lead with consent + classification
6. Duplicate proposal — 7 clusters for your sign-off (we'll walk this live)
7. April Validation Report — for context

The headline ask: 15 working days (until Friday May 22) to deliver
CASL-compliant consent logging, the unsubscribe + preferences pages,
the resolved duplicate + consent-held records, and the first
newsletter test send. We'll send a Friday 5pm status email every
week between now and then.

See you on the call.

— Vasi & Nital, Team Pumpkin
```

---

## ✅ Must leave the meeting with

1. ✅ Decisions on the 7 duplicate clusters (or commitment + date)
2. ✅ Plan for the 17 consent-held records
3. ✅ Green light to start CASL build Friday May 8
4. ✅ Production DB credentials request submitted
5. ✅ Acceptance of May 22 finish-line date
6. ✅ Calendar invite for May 22 demo
7. ✅ Acknowledgment of weekly Friday-5pm cadence

---

## 🧭 If things go sideways — the 5-sentence recovery

> *"We hear you. We've been slow. Here's what we're committing to right now: every Friday at 5 PM, you get a status email — no exceptions. By May 22, you have a CASL-defensible newsletter system. If we slip a date, you hear it from us first, not after the fact. Let's spend the rest of this call getting your decisions on the duplicates and the 17 records so we can move."*

---

*End of meeting package. Open file 6 (Duplicate Merge Proposal) when Jan is ready to walk the clusters.*
