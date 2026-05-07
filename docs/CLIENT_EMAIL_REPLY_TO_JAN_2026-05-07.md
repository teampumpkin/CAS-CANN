# Reply to Jan — Test registration, notifications, and the 4-source SSOT plan
**Subject:** Re: CAS CRM SSOT — Test registration recovered, notification fix shipping today, ready to start the English list
**To:** Jan Veenhuyzen
**Cc:** Jeff Peterson
**From:** Nital
**Date:** May 7, 2026

---

Hi Jan,

Thank you for the email and the clarity around the four input sources. You've given us exactly the structure we needed — we agree, English first, validate end-to-end in CRM, then French, then PANN once you've de-duped against the website registrations.

Before we start that, I want to address the two urgent things you flagged at the end of your email, because both have answers and one is already fixed.

---

## 1. Your test registration from yesterday — recovered

We found it. Your test submission (Jane Good, University of Calgary, Nurse, Cardiology, ATTR/AL, both CAS and CANN) **did reach our database** — it never actually got lost. What failed was the next step: the push from our database into Zoho CRM.

It's now in your CRM as of this morning, **Zoho ID `6999043000002306005`**. You can search for "Jane Good" or `janegood@gmail.com` to verify.

While investigating, we found one other production submission stuck the same way:
- **Glory Lister** (`glister@shaw.ca`, SECFS) — also recovered, **Zoho ID `6999043000002313002`**

That brings the total recovered submissions today to **three** (one from February, two from yesterday). All three are now safely in CRM with their full data intact.

## 2. Why your test didn't appear immediately — the real cause

There is **no intentional delay** between the database and the CRM. Our system is designed to push every new registration to Zoho within **10 seconds** of the form being submitted. When it works, the record is in your CRM almost instantly.

However, when the push to Zoho fails for any reason (network blip, picklist mismatch, expired token, etc.), our system retries quietly for hours before giving up. During that window the record is in our database but not yet in your CRM, and **no one was being alerted**. That is what happened to your test yesterday.

**What we are fixing this week:**
- Same-day Slack/email alert to our team the moment any submission fails its first 5 retries (instead of waiting silently for hours)
- Direct push from form → Zoho with retry-in-foreground, so an immediate failure shows up in our error log right away
- A 5-minute "stuck submissions" admin dashboard at `/admin/sync-status` so we can see in real-time anything that hasn't reached CRM

**The realistic delay you should expect after this week:** new registrations visible in CRM within **30 seconds**, with same-day alerting if anything ever fails.

## 3. Why you stopped getting notification emails — root cause + fix

Honest answer: the code that sends notification emails to `CAS@amyloid.ca` and `CANN@amyloid.ca` was written and tested, but **it was never wired into the form submission pipeline**. So every registration since the migration to the bulletproof database-first flow has gone into Zoho without firing the notification email. The mailbox was never receiving anything because nothing was being sent.

This is fixed in code as of this afternoon. The wire is now: form submission → save to DB → push to Zoho → send notification to `CAS@amyloid.ca` (and `CANN@amyloid.ca` if the registration includes CANN). Production deploy is going out today.

**A test we will run for you tomorrow morning:** we'll submit a fresh test registration to the live site, you should receive a notification email at `CAS@amyloid.ca` within 1 minute, and the record should be in CRM within 30 seconds. We'll send you a screenshot timeline of the test.

---

## 4. The 4-source SSOT plan — agreed, here's the proposed sequence

| # | Source | Status | Owner | Target |
|---|---|---|---|---|
| 1 | English MS Excel membership list | **Awaiting your file** (not received with this email) | Jan to send | This week |
| 2 | French MS Excel membership list | **Awaiting your file** (not received with this email) | Jan to send | After English validated |
| 3 | PANN Excel (deduped against website registrations) | Holding for your dedupe | Jan to send | After French validated |
| 4 | Website registrations | **Live and pushing to CRM** (now repaired — see above) | Team Pumpkin | Continuous |

**A small request:** Your email mentioned the English and French Excel files are attached, but they didn't come through to us. Could you re-send them when you have a moment? As soon as we have the English file we will:
- Pull every column from your Excel (including the registration date/time stamp you flagged)
- Map each column to the correct CRM field (creating a new custom field if Zoho doesn't have one — e.g. "MS Forms Original Registration Date")
- Import to a *staged* view in CRM so you can validate every record before we mark them live
- Send you a side-by-side validation report (Excel vs CRM) so you can confirm 100% match
- Only then move on to the French file

We will do this **one source at a time, exactly as Jeff suggested** — no parallel imports, no rushing.

---

## 5. About the "clear the CRM and re-engage" idea

I want to flag one thing for you and Jeff to consider before we wipe anything:

The 243 records currently in CRM include all the website registrations to date plus the records we already imported from your earlier Excel (back in April). If we hard-delete all 243, we lose:
- Every website registration not yet in your master Excel files (e.g. the Corey Bacher / Jane Good / Glory Lister types we just recovered)
- The April Validation work you, Jeff and Vasi already signed off on
- The CASL audit trail timestamp baseline we wrote yesterday for all 243 records

**A safer alternative we'd like to propose:**

Instead of clearing the CRM, we mark every existing record as `Status = "Pre-Validation"` and you treat the CRM as empty for member-facing purposes. Then:
1. We import the English Excel into a fresh "Validated 2026" view
2. Every record that matches an existing Pre-Validation record gets merged (data preserved)
3. Every record that doesn't match becomes a brand-new "Validated" record
4. After all 4 sources are imported, any record still showing `Pre-Validation` status either:
   - Gets archived (preserved but excluded from communications), or
   - Gets soft-deleted (you can restore for 90 days)

This gives you the same clean outcome — only validated members are visible in your member list — without the risk of losing 8 months of website registrations or the CASL log.

If you and Jeff prefer the hard-clear approach, we can absolutely do it — but we'd want to take a full export of everything to Excel first as a permanent archive, just so nothing is gone forever.

**Could you confirm which approach you prefer?** Hard-clear-and-rebuild, or stage-and-validate?

---

## Summary — the asks

| # | What we need from you | When |
|---|---|---|
| 1 | Re-send the English and French Excel attachments | This week |
| 2 | Decision: hard-clear-and-rebuild vs stage-and-validate | Before we start the import |
| 3 | Confirm `CAS@amyloid.ca` is monitored so we can verify the notification fix works tomorrow | This week |
| 4 | 30-min screen-share with Jan to walk Jane Good's recovered record + the Duplicates tab from the file we sent yesterday | This week |

| # | What we are doing | When |
|---|---|---|
| 1 | Notification email pipeline wired to fire on every successful sync | Deploying today |
| 2 | Stuck-submission alerting (same-day notice if any retry exceeds 5 attempts) | This week |
| 3 | Admin dashboard at `/admin/sync-status` for real-time visibility | This week |
| 4 | Test registration tomorrow morning to verify both fixes end-to-end | Tomorrow |
| 5 | Import staging area ready for the English Excel as soon as you send it | Within 24h of receiving the file |

Please reply with the two attachments and your preference on item #2 above. We'll start the English import the moment we have the file.

Best,
**Nital**
Team Pumpkin

---

### Internal note for Vasi/team (not for client)
Code change in `server/zoho-sync-worker.ts` to call `emailNotificationService.sendRegistrationNotification()` after every successful sync — fire-and-forget so notification failures don't block syncs. Test before deploy: submit form → check `CAS@amyloid.ca` inbox.
