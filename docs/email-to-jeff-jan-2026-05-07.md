**To:** Jeff Peterson; Jan Veenhuyzen
**Cc:** Harmit; Parmeet
**Subject:** CAS CRM — Database snapshot + 3-way comparison ahead of tomorrow's 1:30 PM session

---

Jeff, Jan,

Thank you for Monday's session. We heard the feedback clearly and have stood down on cleanup as Jeff requested.

Per Jeff's request, two files are attached:

**1. CAS_TeamPumpkin_Database_Snapshot_2026-05-07.xlsx**
The complete contents of our PostgreSQL database — every form submission, every field, no filtering. Jan, this is the database you asked to see. The README sheet explains what each tab contains and flags test records to ignore.

**2. CAS_3Way_Comparison_2026-05-07.xlsx**
Person-by-person comparison across all three sources: our DB ⇄ SSOTv6 ⇄ Zoho CRM. Discrepancies and duplicates are on their own sheets so they're easy to scan.

**Headline numbers:**
- 247 unique people identified across all three sources
- 145 appear in all three (healthy base)
- 85 appear in SSOTv6 and CRM but were never in our database — these were created in Zoho directly or pre-date our pipeline
- 11 appear in our DB and CRM but not in SSOTv6 — post-SSOT website signups
- 10 people have duplicates in at least one source (the population for tomorrow's review)

**Owning the gap on April 23.** Our "final delivery" report measured field population and pipeline health, not data accuracy across the three sources. The 3-way comparison attached is the accuracy view we should have produced then. We own that gap.

**CASL — proposing a plan for your review.** We've started the foundation (consent audit table is now live in our staging database). To be defensible before any newsletter goes out, we'd like your sign-off this week to add:
- Per-submission consent audit logging on the website form
- One-time backfill so every existing CRM record has a baseline opt-in timestamp
- Public unsubscribe page (single-click, token-based)
- Public preferences page (granular CAS / CANN / Map choice)
- Token issuer for newsletter sends

We can have these live by EOD Friday if approved.

**Asks for tomorrow:**
1. Does the database snapshot give Jan what she needed visibility into?
2. CASL plan — green-light to proceed?
3. Can Jan share the original Microsoft Forms responses so we can include them in the next comparison?
4. Would you allow one Team Pumpkin person to join in listen-only mode?

We are not making any further changes to the data until you both confirm the merge decisions on tomorrow's call.

Thank you,
Nital
Team Pumpkin
