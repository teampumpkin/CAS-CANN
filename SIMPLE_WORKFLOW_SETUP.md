# 5-Minute Zoho Email Setup Guide

## 🎯 Goal
Set up 2 automated email workflows so every registration automatically sends emails.

---

## Workflow 1: Admin Notifications (5 minutes)

### Step 1: Open Workflow Rules
1. Log into Zoho CRM: https://crm.zoho.com
2. Click **⚙️ Setup** (gear icon, top right)
3. Under **Automation**, click **Workflow Rules**
4. Click **+ Create Rule** button

### Step 2: Basic Settings
- **Rule Name**: `CANN Registration Notification`
- **Module**: Select "Leads"
- **Description**: `Send email to team when CANN member registers`
- Click **Next**

### Step 3: Set When to Execute
- **When**: Select "on a record action"
- **On**: Check ✅ **Create**
- Click **Next**

### Step 4: Set Conditions
- Click **Edit** next to "Execute based on"
- Set condition:
  ```
  Lead Source | contains | CANN
  ```
- Click **Save**
- Click **Next**

### Step 5: Add Email Action
1. Click **⊕** next to "Instant Actions"
2. Select **Email Notification**
3. Fill in the form:

**From**: Your organization email (e.g., noreply@amyloid.ca)

**To**: Click "+ To" three times and add:
- `CAS@amyloid.ca`
- `CANN@amyloid.ca`
- `vasi.karan@teampumpkin.com`

**Subject**:
```
New CANN Membership Registration - #Last_Name
```

**Body**: Click "Source" button and paste this:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px;">
  <div style="background: linear-gradient(135deg, #00AFE6, #00DD89); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0;">New CANN Membership</h1>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #e5e7eb;">
    <h2 style="color: #1f2937; border-bottom: 2px solid #00AFE6; padding-bottom: 8px;">Registration Details</h2>
    
    <table style="width: 100%;">
      <tr><td><strong>Name:</strong></td><td>#Last_Name</td></tr>
      <tr><td><strong>Email:</strong></td><td>#Email</td></tr>
      <tr><td><strong>Discipline:</strong></td><td>#Industry</td></tr>
      <tr><td><strong>Subspecialty:</strong></td><td>#Description</td></tr>
      <tr><td><strong>Institution:</strong></td><td>#Company</td></tr>
      <tr><td><strong>Amyloidosis Type:</strong></td><td>#Amyloidosis_Type</td></tr>
      <tr><td><strong>Services Map:</strong></td><td>#Services_Map_Inclusion</td></tr>
      <tr><td><strong>CAS Communications:</strong></td><td>#CAS_Communications</td></tr>
      <tr><td><strong>CANN Communications:</strong></td><td>#CANN_Communications</td></tr>
    </table>
    
    <div style="margin-top: 20px; text-align: center;">
      <a href="https://crm.zoho.com/crm/org6999043/tab/Leads/#Lead_ID" style="background: linear-gradient(135deg, #00AFE6, #00DD89); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">View in CRM</a>
    </div>
  </div>
</div>
```

4. Click **Save**
5. Click **Save** again (for the workflow rule)
6. Toggle the switch to **Active** ✅

### ✅ Done! First workflow is complete.

---

## Workflow 2: Welcome Email to Members (5 minutes)

### Step 1: Create New Rule
1. Still in Workflow Rules, click **+ Create Rule**
2. **Rule Name**: `CANN Member Welcome Email`
3. **Module**: Leads
4. **Description**: `Send welcome email to new CANN members`
5. Click **Next**

### Step 2: When to Execute
- **When**: on a record action
- **On**: Check ✅ **Create**
- Click **Next**

### Step 3: Conditions
- Set condition:
  ```
  Lead Source | contains | CANN
  ```
- Click **Next**

### Step 4: Add Email Action
1. Click **⊕** next to "Instant Actions"
2. Select **Email Notification**

**From**: CAS@amyloid.ca

**To**: Click "+ To" and add: `#Email` (this sends to the member)

**Subject**:
```
Welcome to CAS & CANN - Your Membership is Confirmed!
```

**Body**: Click "Source" and paste:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px;">
  <div style="background: linear-gradient(135deg, #00AFE6, #00DD89); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0;">Welcome to CAS & CANN!</h1>
    <p style="color: white;">Your membership has been confirmed</p>
  </div>
  
  <div style="background: white; padding: 30px;">
    <p>Dear #Last_Name,</p>
    
    <p>Thank you for joining the Canadian Amyloidosis Society (CAS) and the Canadian Amyloidosis Nursing Network (CANN)! We're excited to have you as part of our community dedicated to advancing amyloidosis care across Canada.</p>
    
    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #00AFE6; margin-top: 0;">📅 Upcoming Events</h3>
      
      <div style="background: white; padding: 15px; border-left: 4px solid #00AFE6; margin-bottom: 15px;">
        <h4 style="color: #00AFE6; margin: 0 0 8px 0;">CAS Journal Club - September Session</h4>
        <p style="margin: 5px 0;"><strong>Date:</strong> September 25, 2025</p>
        <p style="margin: 5px 0;"><strong>Time:</strong> 3-4 PM MST</p>
        <p style="margin: 5px 0;"><strong>Topics:</strong></p>
        <ul style="margin: 5px 0;">
          <li>An Interesting Case of ATTR-neuropathy</li>
          <li>Cardiac Amyloidosis</li>
        </ul>
        <p style="margin: 5px 0;"><strong>Presenters:</strong> Dr. Genevieve Matte, Dr. Edgar Da Silva</p>
      </div>
      
      <div style="background: white; padding: 15px; border-left: 4px solid #00AFE6; margin-bottom: 15px;">
        <h4 style="color: #00AFE6; margin: 0 0 8px 0;">CAS Journal Club - November Session</h4>
        <p style="margin: 5px 0;"><strong>Date:</strong> November 27, 2025</p>
        <p style="margin: 5px 0;"><strong>Time:</strong> 3-4 PM MST</p>
      </div>
      
      <div style="background: white; padding: 15px; border-left: 4px solid #00DD89;">
        <h4 style="color: #00DD89; margin: 0 0 8px 0;">CANN Educational Series</h4>
        <p style="margin: 5px 0;"><strong>Date:</strong> October 7, 2025</p>
        <p style="margin: 5px 0;">Educational webinar series for nursing professionals focused on amyloidosis care</p>
      </div>
    </div>
    
    <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #00AFE6; margin-top: 0;">What's Next?</h3>
      <ul>
        <li><strong>Check your inbox</strong> for event invitations and updates</li>
        <li><strong>Visit our website</strong> at <a href="https://amyloid.ca" style="color: #00AFE6;">amyloid.ca</a> for resources</li>
        <li><strong>Connect with us</strong> if you have any questions or need support</li>
        <li><strong>Access CANN resources</strong> and join our nursing professional network</li>
      </ul>
    </div>
    
    <p>If you have any questions, please reach out to us at <a href="mailto:CAS@amyloid.ca" style="color: #00AFE6;">CAS@amyloid.ca</a> or <a href="mailto:CANN@amyloid.ca" style="color: #00DD89;">CANN@amyloid.ca</a>.</p>
    
    <p>Welcome aboard!</p>
    
    <p style="margin-top: 30px;">
      <strong>The CAS & CANN Team</strong><br>
      Canadian Amyloidosis Society
    </p>
  </div>
  
  <div style="margin-top: 15px; padding: 15px; text-align: center; color: #9ca3af; font-size: 12px;">
    <p>© 2025 Canadian Amyloidosis Society. All rights reserved.</p>
  </div>
</div>
```

3. Click **Save**
4. Click **Save** again
5. Toggle to **Active** ✅

### ✅ Done! Second workflow complete.

---

## 🧪 Test It!

1. Go to your website: https://amyloid.ca/join-cas
2. Fill out the form with your own email
3. Submit
4. Check emails:
   - Team should receive admin notification
   - You should receive welcome email

---

## 📞 Need Help?

If you get stuck at any step, just tell me which step number and I'll provide more detailed guidance!

**Estimated Time**: 10 minutes total for both workflows
