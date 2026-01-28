# 🔍 Email Flow Diagnostic Guide

## Why Your Email Flow Isn't Working

Based on the system setup, here are the **most likely reasons** and how to fix them:

---

## 🎯 Root Cause Analysis

### **Reason #1: Workflows Don't Exist in Zoho (Most Likely)**

**Problem:** The workflows need to be created in Zoho CRM, but this hasn't been done yet.

**How to Check:**
```bash
curl https://amyloid.ca/api/admin/email-workflows \
  -H "X-Automation-API-Key: $AUTOMATION_API_KEY"
```

**Expected if workflows DON'T exist:**
```json
{
  "success": true,
  "count": 0,
  "workflows": []
}
```

**Expected if workflows DO exist:**
```json
{
  "success": true,
  "count": 3,
  "workflows": [
    { "name": "CANN Membership Notification", "state": "active" },
    { "name": "CAS Membership Notification", "state": "active" },
    { "name": "Contact Form Notification", "state": "active" }
  ]
}
```

**Fix:**
```bash
# Create all 3 workflows
curl -X POST https://amyloid.ca/api/admin/setup-email-workflows \
  -H "X-Automation-API-Key: $AUTOMATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"recreate": false}'
```

---

### **Reason #2: OAuth Token Doesn't Have Workflow Scope**

**Problem:** You need to re-authenticate with the corrected OAuth scopes.

**How to Check:**
The OAuth scope error you saw earlier (`Invalid OAuth Scope`) confirms this is the issue.

**Fix:**
1. Visit: `https://amyloid.ca/oauth/zoho/connect`
2. Click "Accept" on Zoho's authorization page
3. Workflows will be created automatically after OAuth completes

---

### **Reason #3: Workflows Exist But Are Inactive**

**Problem:** Workflows were created but are in "inactive" state.

**How to Check:**
```bash
curl https://amyloid.ca/api/admin/email-workflows \
  -H "X-Automation-API-Key: $AUTOMATION_API_KEY"
```

Look for `"state": "inactive"` in the response.

**Fix:**
```bash
# Update workflow to active state
curl -X PUT https://amyloid.ca/api/admin/email-workflows/WORKFLOW_ID \
  -H "X-Automation-API-Key: $AUTOMATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"state": "active"}'
```

---

### **Reason #4: Lead_Source Field Not Set Correctly**

**Problem:** Form submissions aren't setting the `Lead_Source` field that triggers workflows.

**How to Check:**
Submit a test form and check the Lead in Zoho CRM. The `Lead_Source` field should contain:
- "CANN Membership Registration" (for CANN members)
- "CAS Membership Registration" (for CAS-only members)
- "Contact Form Submission" (for non-members)

**Fix:**
This is already correctly implemented in `/server/routes.ts` at the `/api/join-cas` endpoint:
```typescript
Lead_Source: cannMembership 
  ? "CANN Membership Registration"
  : casMembership 
    ? "CAS Membership Registration"
    : "Contact Form Submission"
```

---

## 🚀 Complete Setup Checklist

Follow these steps in order:

### ✅ **Step 1: Re-Authenticate with Zoho**
```
Visit: https://amyloid.ca/oauth/zoho/connect
```

**What happens:**
- Redirects to Zoho authorization page
- Click "Accept" to grant permissions with corrected scopes
- Automatically stores OAuth token
- **Automatically attempts to create workflows**

### ✅ **Step 2: Verify Workflows Were Created**
```bash
curl https://amyloid.ca/api/admin/email-workflows \
  -H "X-Automation-API-Key: $AUTOMATION_API_KEY"
```

**Expected:** 3 workflows listed

### ✅ **Step 3: If Workflows Weren't Created, Create Manually**
```bash
curl -X POST https://amyloid.ca/api/admin/setup-email-workflows \
  -H "X-Automation-API-Key: $AUTOMATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"recreate": false}'
```

### ✅ **Step 4: Test with Real Form Submission**
1. Go to `https://amyloid.ca/join-cas`
2. Fill out the form completely
3. Submit
4. Check your email (CAS@amyloid.ca, etc.)

### ✅ **Step 5: Verify Lead in Zoho CRM**
1. Log into Zoho CRM
2. Go to Leads module
3. Find the newly created lead
4. Check that `Lead_Source` field is set correctly

---

## 🔍 Advanced Diagnostics

### Check OAuth Token Health
```bash
curl https://amyloid.ca/api/admin/workflow-stats \
  -H "X-Automation-API-Key: $AUTOMATION_API_KEY"
```

If you get a 401 or "No valid token" error, you need to re-authenticate.

### Check Workflow Details
```bash
# Get specific workflow
curl https://amyloid.ca/api/admin/email-workflows/WORKFLOW_ID \
  -H "X-Automation-API-Key: $AUTOMATION_API_KEY"
```

Look for:
- `"state": "active"` (should be active)
- `"criteria"` (should filter by Lead_Source)
- `"actions"` (should have email notification action)

### Check Email Notification Actions
```bash
curl https://amyloid.ca/api/admin/email-notifications?module=Leads \
  -H "X-Automation-API-Key: $AUTOMATION_API_KEY"
```

This lists all email notification actions configured.

---

## 📧 How Email Flow Works (When Configured Correctly)

```
User Submits Form at /join-cas
         ↓
Backend POST /api/join-cas
         ↓
Create Lead in Zoho CRM with Lead_Source field
  - Lead_Source = "CANN Membership Registration"
  - Lead_Source = "CAS Membership Registration"
  - Lead_Source = "Contact Form Submission"
         ↓
Zoho Workflow Rule Triggers (checks Lead_Source)
         ↓
Zoho Email Notification Action Executes
  - Sends HTML email to designated recipients
  - Uses pre-configured email template
         ↓
Recipients Receive Email
  ✅ CAS@amyloid.ca (always)
  ✅ CANN@amyloid.ca (CANN only)
  ✅ vasi.karan@teampumpkin.com (always)
```

---

## 🎯 Quick Fix (Most Common Issue)

**If you haven't re-authenticated since the OAuth scope fix:**

1. **Visit:** `https://amyloid.ca/oauth/zoho/connect`
2. **Click:** "Accept" on Zoho's page
3. **Wait:** 10 seconds for automatic workflow creation
4. **Test:** Submit a form at `/join-cas`

This single step should fix 95% of email flow issues!

---

## 🆘 Still Not Working?

If you've completed all steps and emails still aren't sending:

### Check Zoho CRM Directly
1. Log into Zoho CRM
2. Go to **Setup** → **Automation** → **Workflow Rules**
3. Look for:
   - "CANN Membership Notification"
   - "CAS Membership Notification"
   - "Contact Form Notification"
4. Check if they're **Active** and have **Email Notification** actions

### Check Email Delivery in Zoho
1. Go to a Lead in Zoho CRM
2. Check the **Notes** or **Activity** timeline
3. Look for email send notifications
4. Check if emails are being sent but not delivered (spam folder?)

### Manual Workflow Creation in Zoho UI
If API creation fails, you can create workflows manually:
1. Go to **Setup** → **Automation** → **Workflow Rules**
2. Click **Create Rule**
3. Module: **Leads**
4. Condition: **Lead_Source contains CANN** (for CANN workflow)
5. Add Action: **Email Notification**
6. Recipients: CAS@amyloid.ca, CANN@amyloid.ca, vasi.karan@teampumpkin.com

---

## ✅ Summary

**Most likely issue:** Workflows don't exist in Zoho yet.

**Fix:**
```bash
# Step 1: Re-authenticate
Open in browser: https://amyloid.ca/oauth/zoho/connect

# Step 2: Verify (wait 10 seconds after auth)
curl https://amyloid.ca/api/admin/email-workflows \
  -H "X-Automation-API-Key: $AUTOMATION_API_KEY"

# Step 3: If count is 0, create manually
curl -X POST https://amyloid.ca/api/admin/setup-email-workflows \
  -H "X-Automation-API-Key: $AUTOMATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"recreate": false}'
```

After this, your email flow will work! 🎉
