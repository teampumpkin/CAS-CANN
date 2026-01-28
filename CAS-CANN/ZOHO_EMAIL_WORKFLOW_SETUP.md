# Zoho CRM Email Workflow Setup Guide

## Overview
This guide explains how to set up automated email notifications for CAS and CANN member registrations using Zoho CRM's built-in Workflow Rules. This approach is more reliable than direct API email sending and allows for easy management through the Zoho CRM interface.

## Why Workflow Rules Instead of API Email Sending?

### Benefits of Workflow Rules:
- ✅ **More Reliable**: Zoho manages email delivery, retry logic, and sender authentication
- ✅ **Automatic**: Triggers on lead creation without additional API calls
- ✅ **No "From" Field Issues**: Zoho handles sender configuration automatically
- ✅ **Easy to Manage**: Edit email templates and rules directly in Zoho CRM UI
- ✅ **Better Deliverability**: Uses Zoho's email infrastructure and reputation
- ✅ **Audit Trail**: All email sends are logged in Zoho CRM

### Why Direct API Email Failed:
- ❌ Requires complex "from" field configuration
- ❌ Sender authentication issues
- ❌ More code to maintain
- ❌ Less reliable error handling

## Current Implementation Status

### ✅ Completed:
1. **Form Submission Flow**: Web form → API endpoint → Zoho CRM Lead creation ✅
2. **Data Mapping**: All form fields properly mapped to Zoho fields ✅
3. **Lead Source Attribution**: Proper tracking of CAS vs CANN registrations ✅
4. **Welcome Email Templates**: HTML templates with event details created (in code) ✅
5. **Admin Notification Templates**: Professional email templates for team notifications ✅
6. **OAuth Scope**: `ZohoCRM.settings.workflow_rules.ALL` permission granted ✅

### 🔄 Next Steps:
1. **Create Workflow Rules in Zoho CRM** (manual setup in Zoho UI - see below)
2. **Test Email Delivery** (verify emails arrive correctly)
3. **Monitor & Optimize** (track delivery rates, adjust as needed)

---

## Workflow Setup Instructions

### Workflow 1: Admin Notification Email

**Purpose**: Notify CAS/CANN team when new members register

**Setup Steps:**

1. **Access Workflow Rules**
   - Go to Zoho CRM → Setup → Automation → Workflow Rules
   - Click "Create Rule"

2. **Basic Details**
   - **Rule Name**: `CAS/CANN New Registration Admin Notification`
   - **Module**: Leads
   - **Description**: Send notification to admins when new CAS or CANN member registers

3. **When to Execute**
   - **Execute On**: Record Creation
   - **Condition**: 
     ```
     Lead Source equals "Website - CAS Registration"
     OR
     Lead Source equals "Website - CAS & CANN Registration"
     ```

4. **Instant Actions → Email Notification**
   - Click "+ Email Notification"
   - **Email Template**: Create new template (see template below)
   - **To**: 
     - CAS@amyloid.ca (always)
     - vasi.karan@teampumpkin.com (always)
     - CANN@amyloid.ca (when Lead Source contains "CANN")
   - **From**: Your organization email
   - **Subject**: `New ${if Lead Source contains "CANN" then "CANN" else "CAS"} Registration - ${Last Name}`

5. **Save & Activate**

#### Admin Email Template

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #00AFE6, #00DD89); color: white; padding: 30px; border-radius: 12px; text-align: center; }
    .content { background: white; padding: 30px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .detail-row { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .detail-label { font-weight: bold; color: #00AFE6; display: inline-block; width: 180px; }
    .button { display: inline-block; background: linear-gradient(135deg, #00AFE6, #00DD89); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 New Registration Received!</h1>
      <p>${if Lead Source contains "CANN" then "CANN Membership" else "CAS Membership"}</p>
    </div>
    
    <div class="content">
      <h2>Registration Details</h2>
      
      <div class="detail-row">
        <span class="detail-label">Name:</span>
        <span>${Last Name}</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">Email:</span>
        <span>${Email}</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">Discipline:</span>
        <span>${Industry}</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">Subspecialty:</span>
        <span>${Description}</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">Amyloidosis Type:</span>
        <span>${Amyloidosis Type}</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">Institution:</span>
        <span>${Company}</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">Services Map:</span>
        <span>${Services Map Inclusion}</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">Communications:</span>
        <span>${CAS Communications}</span>
      </div>
      
      ${if Lead Source contains "CANN" then 
        '<div class="detail-row">
          <span class="detail-label">CANN Communications:</span>
          <span>' + CANN Communications + '</span>
        </div>' 
      else ''}
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://crm.zoho.com/crm/org6999043/tab/Leads/${Lead ID}" class="button">
          View in CRM
        </a>
      </div>
    </div>
  </div>
</body>
</html>
```

---

### Workflow 2: Member Welcome Email

**Purpose**: Welcome new members and provide upcoming event information

**Setup Steps:**

1. **Create Rule**
   - **Rule Name**: `CAS/CANN Member Welcome Email`
   - **Module**: Leads
   - **Description**: Send welcome email to new members with event details

2. **When to Execute**
   - **Execute On**: Record Creation
   - **Condition**: Same as Workflow 1

3. **Instant Actions → Email Notification**
   - **To**: ${Email} (the member's email)
   - **From**: CAS@amyloid.ca or organization email
   - **Subject**: `Welcome to ${if Lead Source contains "CANN" then "CAS & CANN" else "CAS"} - Your Membership is Confirmed!`

4. **Save & Activate**

#### Welcome Email Template

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #00AFE6, #00DD89); color: white; padding: 30px; border-radius: 12px; text-align: center; }
    .content { background: white; padding: 30px; border-radius: 8px; margin-top: 20px; }
    .event-section { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .event-card { margin-bottom: 15px; padding: 15px; background: white; border-left: 4px solid #00AFE6; border-radius: 4px; }
    .event-card h4 { color: #00AFE6; margin: 0 0 8px 0; }
    .event-card.cann { border-left-color: #00DD89; }
    .event-card.cann h4 { color: #00DD89; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to ${if Lead Source contains "CANN" then "CAS & CANN" else "CAS"}!</h1>
      <p>Your membership has been confirmed</p>
    </div>
    
    <div class="content">
      <p>Dear ${Last Name},</p>
      
      <p>Thank you for joining the ${if Lead Source contains "CANN" then "Canadian Amyloidosis Society (CAS) and the Canadian Amyloidosis Nursing Network (CANN)" else "Canadian Amyloidosis Society (CAS)"}! We're excited to have you as part of our community dedicated to advancing amyloidosis care across Canada.</p>
      
      ${if Lead Source contains "CANN" then
        '<div class="event-section">
          <h3 style="color: #1f2937; margin-top: 0;">📅 Upcoming Events</h3>
          
          <div class="event-card">
            <h4>CAS Journal Club - September Session</h4>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Date:</strong> September 25, 2025</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Time:</strong> 3-4 PM MST</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Topics:</strong></p>
            <ul style="margin: 5px 0; color: #6b7280;">
              <li>An Interesting Case of ATTR-neuropathy</li>
              <li>Cardiac Amyloidosis</li>
            </ul>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Presenters:</strong> Dr. Genevieve Matte, Dr. Edgar Da Silva</p>
          </div>
          
          <div class="event-card">
            <h4>CAS Journal Club - November Session</h4>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Date:</strong> November 27, 2025</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Time:</strong> 3-4 PM MST</p>
          </div>
          
          <div class="event-card cann">
            <h4>CANN Educational Series</h4>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Date:</strong> October 7, 2025</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Description:</strong> Educational webinar series for nursing professionals focused on amyloidosis care</p>
          </div>
        </div>'
      else ''}
      
      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #00AFE6; margin-top: 0;">What's Next?</h3>
        <ul style="color: #1f2937;">
          <li><strong>Check your inbox</strong> for event invitations and updates</li>
          <li><strong>Visit our website</strong> at <a href="https://amyloid.ca" style="color: #00AFE6;">amyloid.ca</a> for resources</li>
          <li><strong>Connect with us</strong> if you have any questions or need support</li>
          ${if Lead Source contains "CANN" then '<li><strong>Access CANN resources</strong> and join our nursing professional network</li>' else ''}
        </ul>
      </div>
      
      <p>If you have any questions or need assistance, please don't hesitate to reach out to us at <a href="mailto:CAS@amyloid.ca" style="color: #00AFE6;">CAS@amyloid.ca</a>${if Lead Source contains "CANN" then ' or <a href="mailto:CANN@amyloid.ca" style="color: #00DD89;">CANN@amyloid.ca</a>' else ''}.</p>
      
      <p>Welcome aboard!</p>
      
      <p style="margin-top: 30px;">
        <strong>The ${if Lead Source contains "CANN" then "CAS & CANN" else "CAS"} Team</strong><br>
        Canadian Amyloidosis Society
      </p>
    </div>
    
    <div class="footer">
      <p>© 2025 Canadian Amyloidosis Society. All rights reserved.</p>
      <p>This email was sent because you registered at amyloid.ca</p>
    </div>
  </div>
</body>
</html>
```

---

## Testing the Workflows

### Test Checklist:

1. **Submit Test Registration**
   - Go to https://amyloid.ca/join-cas
   - Fill out form with test data
   - Submit

2. **Verify Lead Creation**
   - Check Zoho CRM → Leads
   - Confirm new lead appears with correct data
   - Verify Lead Source is set correctly

3. **Check Email Delivery**
   - **Admin Notification**: Check CAS@amyloid.ca, CANN@amyloid.ca (if CANN), vasi.karan@teampumpkin.com
   - **Welcome Email**: Check the member's email inbox
   - Verify all dynamic fields populated correctly
   - Test both CAS and CANN registrations

4. **Verify Email Content**
   - All merge fields display correctly (no ${...} showing)
   - Event details appear for CANN members
   - Links work properly
   - Formatting looks good on desktop and mobile

---

## Monitoring & Maintenance

### Workflow Performance
- Monitor email delivery rates in Zoho CRM
- Check for failed email sends
- Review bounce rates

### Template Updates
- Update event dates as new sessions are scheduled
- Keep contact information current
- Adjust messaging based on feedback

### Lead Source Tracking
- Ensure all registrations have correct Lead_Source
- Monitor both "Website - CAS Registration" and "Website - CAS & CANN Registration"

---

## Troubleshooting

### Emails Not Sending
1. Check workflow is **Active** (not paused)
2. Verify conditions match the Lead Source exactly
3. Check recipient email addresses are valid
4. Review Zoho email logs for errors

### Missing Dynamic Fields
1. Ensure field names in template match Zoho field API names
2. Check fields are populated in the lead record
3. Verify merge tag syntax: `${Field_Name}`

### Wrong Recipients
1. Review "To" field configuration in workflow
2. For CANN emails, ensure conditional logic is set up correctly
3. Test with different Lead Source values

---

## Event Information Reference

### CAS Journal Club
- **September 25, 2025** - 3-4 PM MST
  - Topics: An Interesting Case of ATTR-neuropathy, Cardiac Amyloidosis
  - Presenters: Dr. Genevieve Matte, Dr. Edgar Da Silva
- **November 27, 2025** - 3-4 PM MST

### CANN Educational Series
- **October 7, 2025**
  - Educational webinar series for nursing professionals

---

## Contact Information

**Primary Contact**: CAS@amyloid.ca  
**CANN Contact**: CANN@amyloid.ca  
**Technical Support**: vasi.karan@teampumpkin.com  
**Website**: https://amyloid.ca

---

## Next Steps for Newsletter

The next phase will involve:
1. Creating a newsletter template design
2. Setting up recurring email campaigns
3. Integrating with Zoho Campaigns or Zoho CRM Email Marketing
4. Building subscriber segmentation (CAS vs CANN members)

This will be addressed in a separate guide once the welcome emails are successfully deployed.
