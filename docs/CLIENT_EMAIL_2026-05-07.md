# Email to Send — Jeff Peterson + Jan Veenhuyzen
**Subject:** CAS CRM — Source of Truth Status, Form Audit, and Path to May 22 Finish Line
**From:** Nital (Team Pumpkin)
**Date:** May 7, 2026

---

Hi Jeff and Jan,

Following our May 4 working session and Jan's email of the 17 records, we've spent the last three days running a full top-to-bottom reconciliation. This email is the honest status — what's true, what we lost, what we fixed today, what still needs your sign-off, and what we're committing to deliver by Friday May 22.

I've attached two files at the bottom; please open them in this order: **(1) the Final SSOT Proposed Excel** and **(2) the Execution Plan**.

---

## 1. Direct answers to your five concerns from the May 4 call

### (a) Correct record count + data integrity → **Done today**
- Live CRM has **243 Leads** as of this morning (was 247 in April; 4 records changed since)
- We pulled every source — live CRM, SSOT v6 (232 rows), MS Forms YES/NO (14 rows including 4 test rows), our local database (173 form submissions), April Validation Report — and cross-referenced them all in a single dataset
- **108 empty fields filled today directly from your SSOT and MS Forms** (105 succeeded, 3 fixed manually after picklist mismatch). Records that had a blank Institution, Discipline or Subspecialty now show the value from your authoritative sources
- Estimated final count after merges: **236 records → 232 (matches your SSOT target)**

### (b) Correct views for Jan (CAS / CANN / Both / Neither) → **Already exists, needs walkthrough**
The CRM has 6 custom views including "All CAN Members," "CAS Communication Eligible," "CANN Communication Eligible," and "Both CAS and CANN." When you log in you'll now see exactly what Vasi sees. We'll do a 10-minute screen-share to confirm you can navigate them.

### (c) CASL subscription preferences visibility → **Audit ready, action needed**
Of 243 records, **only 9 have provable express consent** (the MS Forms YES rows where the timestamp + email + consent question are documented). The remaining 234 records have consent flags in the CRM but **no provable evidence trail**. Today we wrote a baseline `consent_history` log entry for every record (723 rows total) so from this point forward every change is timestamped and audit-defensible. **Decision needed from Jeff:** do we treat the 234 baseline records as PEBR (Pre-Existing Business Relationship — legal defense) or do we send a re-confirmation email to all of them?

### (d) Sending email from CRM (with Outlook directory sync) → **Plan, needs your IT call**
Zoho CRM supports outbound email through its native engine (already wired) **or** through an IMAP/SMTP bridge to your Microsoft 365 tenant so messages are sent from your @amyloid.ca address with full deliverability and end up in your Outlook Sent folder. We need a 30-minute call with whoever owns your Microsoft 365 tenant to set up the bridge. We can do this any day next week.

### (e) Newsletter targeted send + review process → **Built, needs content + sign-off**
Once item (d) is set up, the workflow is: build segment in CRM → render newsletter from approved template → preview to 2 internal QA addresses → Jan signs off → send. We will demonstrate the full flow with the first real newsletter as our acceptance test.

---

## 2. Form submission audit — the honest answer

You asked how many submissions we lost.

| Source | Total | Successfully in CRM | Lost / Stuck |
|---|---|---|---|
| Website forms (CAS Registration, CANN Membership, etc.) routed through our database | 173 | 172 | **1 stuck since Feb 6, 2026 — recovered today** |
| MS Forms (Microsoft form, Excel exports) | 14 (10 real + 4 test rows) | 14 | 0 |
| Excel imports (legacy historical data) | 247 imported in April → 243 alive today | 243 | 0 (4 records changed naturally) |

**The one stuck record:** Corey Bacher (Physician, Scarborough Health Network, ATTR), submitted Feb 6, 2026 through the website form. The submission saved correctly to our database immediately, but the Zoho sync hit our 50-retry limit and was held back for manual review (this is by design — we do not silently lose data). **It is now live in your CRM as of this morning** (Zoho ID `6999043000002312004`). We've reset the alerting so any future stuck record gets flagged the same day, not three months later.

**No other data was lost.** Every form submission since the start of the project is accounted for either in CRM or in our database with full audit trail.

---

## 3. The 17 records you flagged in your email — proposal

We agree with Jeff that **merging is safer than deleting**. We've identified **7 confirmed duplicate clusters** in the live CRM (some are the records on your 17-list, some are different). For each cluster we computed a "completeness score" — the record with the most filled fields wins, and we copy in any missing fields from the duplicates before deleting them.

The full breakdown is on the **"Duplicates" tab of the attached Excel**. We are not running any merges until you and Jan sign off cluster-by-cluster.

For the remaining records on your 17-list that are not exact duplicates (e.g. someone who registered through MS Forms AND the website with different consent answers — the Devon Krupp / lead-says-Yes-contact-says-False issue you raised), we propose:
1. We bring all conflicting records onto one screen with all fields visible
2. Jan picks the correct answer per field
3. We update the winner record and delete the others (with backup)
4. We log everything to consent_history so the decision is auditable

This is a 90-minute call we'd like to schedule with Jan this week.

---

## 4. What we did today (all backed up, all reversible except where noted)

| Action | Result | Reversible? |
|---|---|---|
| Filled 108 empty fields from SSOT/MS Forms | 105 succeeded automatically + 3 fixed manually | Yes — full backup in `docs/backups/` |
| Backfilled 723 consent_history rows for all 243 records | All records now have CASL timestamp baseline | Yes — DB rollback |
| Recovered Corey Bacher (stuck since Feb 6) into CRM | Now live in Zoho | Yes — can delete |
| Built proposed clean dataset spreadsheet | 7-tab Excel ready for your review | n/a — proposal only |
| Built dry-run merge script (not executed) | 7 clusters analyzed, winners picked | n/a — pending sign-off |

---

## 5. The May 22 commitment

To get from "243 records with gaps" to "232-record CASL-defensible Single Source of Truth ready for newsletter," here is what we'll deliver and when:

| Friday | Deliverable |
|---|---|
| **May 9** | Encoding artifacts fixed (124 records); duplicate cluster walkthrough call with Jan; Corey Bacher confirmed live |
| **May 15** | 7 duplicate clusters merged (after sign-off); 17 multi-source conflicts resolved with Jan; Outlook/M365 bridge configured; consent re-confirmation email drafted for your review |
| **May 22** | First newsletter test send to internal QA list; CRM final-state snapshot delivered; CASL audit log live; you take the keys |

We are asking for **15 working days, not weeks.** Status update every Friday by 5pm ET.

---

## 6. What we need from you

| # | Need | Owner | Deadline |
|---|---|---|---|
| 1 | Confirm receipt of this email + attached proposal | Jeff or Jan | This week |
| 2 | 90-minute call with Jan to walk Duplicates tab + 17 conflicts | Jan | Within 7 days |
| 3 | Decision: PEBR claim vs re-confirmation email for 234 baseline records | Jeff | Before May 15 |
| 4 | 30-minute call with Microsoft 365 / IT owner for Outlook bridge | Jeff to introduce | Next week |
| 5 | Sign-off on duplicate cluster winners (in writing — email reply OK) | Jan | After call in #2 |
| 6 | Newsletter content + recipient segment criteria for the May 22 test send | Jan | By May 19 |

---

## Attachments

1. **`FINAL_SSOT_PROPOSED_2026-05-07.xlsx`** — 7 sheets:
   - Action Plan
   - Duplicates (your sign-off needed)
   - To Update (108 gap fills — 105 already done)
   - To Delete (with risk flags)
   - To Create (none currently — all sources accounted for)
   - Consent Audit (CASL evidence per record)
   - Validation Issues
2. **`CRM_CLEANUP_EXECUTION_PLAN_2026-05-07.md`** — Step-by-step run order, safety guarantees, before/after snapshot

---

We've heard the frustration loud and clear and we own the bumpy comms. The data is now actually moving forward instead of sideways. We're committed to the May 22 finish line.

Please reply with availability for the 90-minute call with Jan this week.

Best,
**Nital**
Team Pumpkin
