# Follow-up to Jan — Files received, here's what we found
**Subject:** Re: CAS CRM SSOT — English & French files analysed, 7 questions for you before import
**To:** Jan Veenhuyzen
**Cc:** Jeff Peterson
**From:** Nital
**Date:** May 7, 2026 (sent ~1 hour after the previous email)

---

Hi Jan,

The English and French files came through — thank you. We've already run them against the current CRM. Here's the headline before the long version:

> **Out of 216 total rows in your two files, 208 are already in CRM, 7 are net-new, and 1 is missing an email. The bigger work is backfilling the original MS Forms registration date on all 208 existing records — none of them currently carry that timestamp in CRM.**

I've attached `MSForms_Import_Preview_2026-05-07.xlsx` (8 tabs) which is our staging plan. Nothing has been written to CRM yet — we wanted you to see the proposed changes first.

## The numbers

| | English | French | Total |
|---|---|---|---|
| MS Forms rows you sent | 194 | 22 | 216 |
| Already match a CRM record | 188 | 20 | 208 |
| Net-new (need to be created) | 6 | 1 | 7 |
| Missing email entirely | 0 | 1 | 1 |

Reassuringly: there is **zero overlap** between your English and French files — so no risk of double-importing the same person.

## The big finding — original registration dates are missing on all 208 existing records

Every CRM record currently shows its CRM-creation date (April 2026, when the original import happened) instead of the date the person actually filled out the MS Form. Some of those original registrations go back to **October 2024**.

This is exactly the gap you flagged. Our proposed fix:
- Add a custom field in Zoho called `MS_Forms_Original_Registration_Date`
- Populate it from the "Completion time" column of your Excel files for all 208 matched records
- Leave the existing CRM "Created Time" alone (it represents when we imported, not when they registered)

This way you get **both** dates: when they registered, and when we imported. We can do this as one batch update once you approve.

## The medium finding — 24 value mismatches

For 24 of the 208 matched records, the value in your MS Forms file differs from what's currently in CRM (different name spelling, different discipline, different institution). Examples:

- The MS Form says "Physician", CRM says "Cardiologist"
- The MS Form says "University Health Network", CRM says "UHN"
- Slight name spellings ("Jean-François" vs "Jean Francois")

Tab `Value_Mismatches` in the attached file lists all 24 with both versions side by side. **For each, we need you to pick the source of truth** — usually that's the MS Forms version, but you'll know better case-by-case.

## The detailed finding — the 7 "net-new" rows are mostly messy

Only **1 of the 7** is cleanly importable. The other 6 have data-entry issues that need a human decision before we add them to CRM:

| MS Forms ID | Name | What's wrong |
|---|---|---|
| EN #55 | Rodolfo Pike | Two emails in the email field — which is primary? `Rodolfopike@gmail.com` or `Rodolfo.pike@easternhealth.ca`? |
| EN #132 | Amanda Fiander | Two emails — and one is marked **"personal, do not share or post please"** (CASL flag) |
| EN #145 | Md. Pervez Anwar | The email field contains a **Bangladesh postal address** — no email at all. Cannot import without one. |
| EN #181 | Jing Zeng | Name field says "Jing Zeng", email field contains another person's name "Alissa Linh" — looks like two people in one row |
| EN #182 | "JV / jv / jv / jv" | Almost certainly a **test submission**. Recommend skip. |
| EN #197 | Manal | First name only, no last name. Email field says "Toronto". Cannot import without an email. |
| FR #18 | Fabian Azzari | Two emails — `fabianazzari@yahoo.com` (personal) and `fabian-alejandro.azzari.med@ssss.gouv.qc.ca` (institutional). Which is primary? |

## What I need from you before we touch CRM

1. **The 7 net-new rows above** — for each, your call: import (and which email), skip, or contact for clarification?
2. **The 24 value mismatches** — confirm "MS Forms wins" as the default rule, or you'll review row-by-row in the Excel?
3. **Backfill the MS Forms registration date for all 208 records?** (This is reversible — say yes once and we run it.)
4. **The earlier email's question still stands**: hard-clear-and-rebuild vs stage-and-validate?

## What we're doing in parallel

- Notification email fix is in code, going to production deploy this evening
- Tomorrow morning's live test (Jane Good–style submission to `amyloid.ca` to verify both the CRM push and the email notification) is on
- French file import script is built and ready — same shape as the English one, just waiting on your decisions above

A 30-minute call tomorrow or Friday would let us walk through the 7 net-new rows and the 24 mismatches together. Please send a couple of times that work.

Best,
**Nital**
Team Pumpkin

**Attachment:** `MSForms_Import_Preview_2026-05-07.xlsx`
