# CAS / CANN Newsletter Campaign Guide
**Prepared For**: Canadian Amyloidosis Society — Internal Team  
**Purpose**: Enable the CAS team to plan, build, and send newsletter campaigns independently using Zoho  
**Last Updated**: March 2026  
**Prerequisite**: Access to Zoho CRM (Leads module) and Zoho Campaigns

---

## Table of Contents

1. [How Your Audience Data Is Organized](#1-how-your-audience-data-is-organized)
2. [The Three Campaign Audiences](#2-the-three-campaign-audiences)
3. [The Golden Rule — Always Filter by Consent](#3-the-golden-rule--always-filter-by-consent)
4. [Zoho Tool to Use: Campaigns vs CRM](#4-zoho-tool-to-use-campaigns-vs-crm)
5. [Step-by-Step: Build Your Mailing List in Zoho CRM](#5-step-by-step-build-your-mailing-list-in-zoho-crm)
6. [Step-by-Step: Send a Campaign in Zoho Campaigns](#6-step-by-step-send-a-campaign-in-zoho-campaigns)
7. [Ongoing Maintenance — New Registrations](#7-ongoing-maintenance--new-registrations)
8. [Quick Reference — Segment Filter Cheat Sheet](#8-quick-reference--segment-filter-cheat-sheet)
9. [Troubleshooting Common Issues](#9-troubleshooting-common-issues)

---

## 1. How Your Audience Data Is Organized

Every person who has registered through the CAS website or was imported from historical records lives in **Zoho CRM → Leads module**. Each record stores:

| What it tracks | Field name in Zoho | Example values |
|---|---|---|
| Is this person a CAS member? | `CAS_Member` | Yes / No |
| Is this person a CANN member? | `CANN_Member` | Yes / No |
| Are they a member or just an inquiry? | `Record_Type` | Member / Inquiry |
| Do they consent to CAS emails? | `CAS_Communications` | Yes / No |
| Do they consent to CANN emails? | `CANN_Communications` | Yes / No |
| Are they on the services map? | `Services_Map_Inclusion` | Yes / No |

**Important**: Every single record has values in all of these fields — there are no blanks. This means your filters will always return reliable, complete results.

**Current numbers (as of February 2026):**
- 245 total Lead records
- 214 classified as Members, 31 classified as Inquiries
- 216 have consented to CAS emails
- 29 have consented to CANN emails
- 19 have consented to Services Map listing

New registrations from the website are automatically added to Zoho within minutes and inherit the same field structure.

---

## 2. The Three Campaign Audiences

You have three distinct audiences you can reach. They are mutually inclusive — a person can be in all three.

### Audience A — CAS General Newsletter
**Who:** Anyone who signed up for CAS membership and agreed to receive CAS communications.  
**Size:** 216 people  
**Use for:** CAS updates, Journal Club announcements, Summit invitations, general news

### Audience B — CANN Newsletter
**Who:** CANN network members who agreed to receive CANN communications.  
**Size:** 29 people  
**Use for:** CANN townhalls, CANN educational series, CANN-specific clinical updates

### Audience C — Services Map Clinicians
**Who:** Healthcare professionals who specifically asked to be listed on the CAS services map.  
**Size:** 19 people  
**Use for:** Map updates, listing changes, clinician-specific communications

> **Note on overlap**: All CANN members are also CAS members. If you send to both Audience A and Audience B, people in both lists will receive two separate emails unless you combine them into one send.

---

## 3. The Golden Rule — Always Filter by Consent

**Never send a campaign based on membership status alone.**

The correct filter for CAS emails is `CAS_Communications = Yes` — NOT just `CAS_Member = Yes`.

Why this matters: 29 records have `CAS_Member = Yes` but `CAS_Communications = No`. These people joined CAS but explicitly said they do not want email communications. Filtering only by membership would include them in violation of their stated preference.

| What you want to send | Correct filter to use | Wrong filter to avoid |
|---|---|---|
| CAS newsletter | `CAS_Communications = Yes` | `CAS_Member = Yes` |
| CANN newsletter | `CANN_Communications = Yes` | `CANN_Member = Yes` |
| Services map update | `Services_Map_Inclusion = Yes` | Province or institution filter |

Additionally, always add `Record_Type = Member` as a secondary filter. This deterministically excludes the 31 Inquiry records (people who submitted a contact form but did not join CAS or CANN).

---

## 4. Zoho Tool to Use: Campaigns vs CRM

Zoho has two separate products involved in sending newsletters:

| Product | What it does | Where to find it |
|---|---|---|
| **Zoho CRM** | Stores all your member data and lets you filter/segment your list | crm.zoho.com |
| **Zoho Campaigns** | Designs, sends, and tracks email newsletters | campaigns.zoho.com |

**The workflow is always:**  
Zoho CRM (build the list) → Zoho Campaigns (design and send the email)

Zoho Campaigns connects directly to your CRM data, so you do not need to export and re-import a spreadsheet. You sync a filtered view directly from CRM into a Campaigns mailing list.

---

## 5. Step-by-Step: Build Your Mailing List in Zoho CRM

Do this once per campaign type. Once a list is synced, it updates automatically as new members join.

### 5.1 — Use the Existing Pre-Built Views

Four views are already deployed in your Leads module. Go to **Zoho CRM → Leads** and look in the Views dropdown on the left:

| View name | What it shows | Use for |
|---|---|---|
| `CAS_Members` | All 214 CAS members | Starting point for CAS campaigns |
| `CANN_Members` | All 22 CANN members | Starting point for CANN campaigns |
| `Website_Registrations` | 49 web form submissions | Tracking recent sign-ups |
| `Members_vs_Inquiries` | All 245 records with classification | Auditing and segmentation review |

### 5.2 — Add the Consent Filter (Required)

The pre-built views filter by membership status. You must add the consent filter before using them for a campaign.

**For a CAS campaign:**
1. Open the `CAS_Members` view
2. Click **Filter** (top right of the lead list)
3. Add condition: `CAS_Communications` → `is` → `Yes`
4. Add condition: `Record_Type` → `is` → `Member`
5. Click **Apply**
6. You should see approximately 216 records

**For a CANN campaign:**
1. Open the `CANN_Members` view
2. Click **Filter**
3. Add condition: `CANN_Communications` → `is` → `Yes`
4. Add condition: `Record_Type` → `is` → `Member`
5. Click **Apply**
6. You should see approximately 29 records

**For a Services Map campaign:**
1. Open any view
2. Click **Filter**
3. Add condition: `Services_Map_Inclusion` → `is` → `Yes`
4. Click **Apply**
5. You should see approximately 19 records

### 5.3 — Save As a Custom View (Optional but Recommended)

After applying your filters, save the view so you don't have to re-apply them next time:

1. Click the **Save** or **Save as Custom View** option next to the filter panel
2. Name it clearly, e.g., `CAS_Campaign_List` or `CANN_Campaign_List`
3. This view will update automatically as new members join and as consent is updated

---

## 6. Step-by-Step: Send a Campaign in Zoho Campaigns

### 6.1 — Connect Zoho CRM to Zoho Campaigns (One-Time Setup)

This only needs to be done once.

1. Log in to **campaigns.zoho.com**
2. Go to **Contacts → Mailing Lists**
3. Click **Create List**
4. Name it (e.g., `CAS Newsletter List`)
5. Choose **Sync from Zoho CRM**
6. Select **Leads** as the module
7. Select the view you created in Step 5 (e.g., `CAS_Campaign_List`)
8. Map the fields:
   - First Name → `Last_Name` (note: CAS stores the full name in this field)
   - Email → `Email`
9. Set sync frequency to **Daily** so new members are added automatically
10. Click **Save and Sync**

Repeat this for your CANN list and any other segments.

### 6.2 — Create a New Campaign

1. In Zoho Campaigns, go to **Campaigns → Email Campaigns**
2. Click **Create Campaign**
3. Choose **Regular Campaign**
4. Fill in:
   - **Campaign Name**: Internal reference (e.g., "March 2026 CAS Newsletter")
   - **Subject Line**: What recipients will see in their inbox
   - **From Name**: Canadian Amyloidosis Society
   - **From Email**: Your CAS email address
   - **Reply-To**: The email address responses should go to

### 6.3 — Select Your Mailing List

1. On the **Recipients** step, select the mailing list you synced from CRM
2. Zoho Campaigns will show you the count of active subscribers
3. Confirm the number matches expectations (CAS: ~216, CANN: ~29)

### 6.4 — Design the Email

1. On the **Content** step, choose **Use Template** or **Create from Scratch**
2. Use the **Drag and Drop Editor** for the easiest experience
3. Include:
   - CAS logo at the top
   - Clear subject/headline
   - Body content
   - Footer with unsubscribe link (Zoho adds this automatically — do not remove it)

**Personalization tip**: You can insert the recipient's name using merge tags. Because CAS stores the full name in the `Last_Name` field, use:
```
${!Leads.Last_Name}
```
This will insert the full name (e.g., "Dr. Jane Smith") into your greeting.

### 6.5 — Test Before Sending

1. Click **Send Test Email**
2. Enter your own email address
3. Review the email in your inbox — check that:
   - Name personalization appears correctly
   - All links work
   - Images load
   - The email looks correct on mobile

### 6.6 — Schedule or Send

1. On the **Schedule** step, choose:
   - **Send Now** — delivers immediately
   - **Schedule for Later** — pick a specific date and time
2. Click **Send** or **Schedule**
3. Zoho will begin delivery and you will receive a confirmation

### 6.7 — Review Campaign Results

After sending, go to **Campaigns → Reports** to see:

| Metric | What it means |
|---|---|
| **Delivered** | Emails successfully received |
| **Opened** | Recipients who opened the email |
| **Clicked** | Recipients who clicked a link |
| **Unsubscribed** | Recipients who opted out |
| **Bounced** | Invalid or unreachable email addresses |

**Action required after each campaign**: Review bounce and unsubscribe reports. Bounced addresses indicate stale data that may need updating in CRM.

---

## 7. Ongoing Maintenance — New Registrations

You do not need to manually add new members to your campaign lists. Here is what happens automatically:

1. Someone fills out the registration form on the CAS website
2. Their record is saved to the CAS database within seconds
3. The record is synced to Zoho CRM (Leads module) within minutes
4. The record receives the correct values for `CAS_Member`, `CANN_Member`, `CAS_Communications`, `CANN_Communications`, and `Record_Type` automatically
5. If your Zoho Campaigns mailing list is set to sync daily from CRM, the new member appears in your list within 24 hours

**What you do need to do periodically:**

| Task | Frequency | How |
|---|---|---|
| Review bounce reports | After each send | Zoho Campaigns → Reports |
| Update email addresses for bounced records | Monthly | Edit directly in Zoho CRM Leads |
| Check for unsubscribes | After each send | Zoho Campaigns → Reports → Unsubscribes |
| Review new web registrations | Weekly | `Website_Registrations` view in CRM |
| Confirm sync is running | Monthly | Zoho Campaigns → Mailing Lists → Sync Status |

---

## 8. Quick Reference — Segment Filter Cheat Sheet

Use these exact filter combinations when building campaign lists in Zoho CRM:

### CAS General Newsletter (216 recipients)
```
CAS_Communications = Yes
AND Record_Type     = Member
```

### CANN Newsletter (29 recipients)
```
CANN_Communications = Yes
AND Record_Type      = Member
```

### Services Map Clinicians (19 recipients)
```
Services_Map_Inclusion = Yes
```

### CAS Members Who Are NOT in CANN (192 recipients)
```
CAS_Member          = Yes
AND CANN_Member     = No
AND CAS_Communications = Yes
AND Record_Type     = Member
```

### Both CAS and CANN Members (22 recipients)
```
CAS_Member          = Yes
AND CANN_Member     = Yes
AND CANN_Communications = Yes
```

### Inquiries Only (for outreach, not newsletter)
```
Record_Type = Inquiry
```

---

## 9. Troubleshooting Common Issues

### "My mailing list count is lower than expected"
- Check that the CRM view sync has run recently (Campaigns → Mailing Lists → last sync date)
- Confirm the filters in your CRM view are applied correctly
- Confirm you are filtering by `CAS_Communications = Yes`, not just `CAS_Member = Yes`

### "New members aren't appearing in my campaign list"
- Check the sync schedule in Zoho Campaigns (daily sync means up to 24-hour delay)
- Manually trigger a sync: Campaigns → Mailing Lists → select list → Sync Now
- Confirm the new member's record in CRM has `CAS_Communications = Yes`

### "A member says they didn't receive our newsletter"
1. Search for the member in Zoho CRM Leads by email
2. Confirm `CAS_Communications = Yes` on their record
3. In Zoho Campaigns, check if the email appears as "Bounced" for their address
4. If bounced, the email address may be invalid — contact the member to update it

### "A member wants to unsubscribe"
- If they click **Unsubscribe** in any Zoho Campaigns email, Zoho handles this automatically
- Their record in Zoho Campaigns is marked inactive; they will not receive future campaigns
- You should also manually update their CRM record: set `CAS_Communications = No`
- This keeps the CRM and Campaigns in sync for reporting purposes

### "I need to add someone manually who didn't use the website form"
1. In Zoho CRM, go to Leads → Create Lead
2. Fill in: Last_Name (full name), Email, and all relevant fields
3. Set `CAS_Member = true`, `CAS_Communications = Yes`, `Record_Type = Member`
4. Save the record — it will appear in your campaign list on the next sync

### "Merge tag for name is showing the wrong thing"
- CAS stores the full name in the `Last_Name` field (e.g., "Dr. Jane Smith")
- Use `${!Leads.Last_Name}` — not `${!Leads.First_Name}` — to display the full name
- First_Name is not reliably populated in the CAS dataset

---

*For technical issues with the Zoho CRM integration, contact your website/CRM technical team.*  
*For questions about Zoho Campaigns features, refer to [help.zoho.com/portal/en/kb/campaigns](https://help.zoho.com/portal/en/kb/campaigns).*
