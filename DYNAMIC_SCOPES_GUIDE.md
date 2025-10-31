# 🔧 Dynamic OAuth Scopes Guide

## Overview

The OAuth system now supports **dynamic scopes** - you can customize the permissions requested during authorization in three flexible ways:

1. **Environment Variables** (recommended for production)
2. **Query Parameters** (useful for testing)
3. **Hardcoded Defaults** (fallback)

---

## 🎯 **Method 1: Environment Variables** (Recommended)

Set the `ZOHO_OAUTH_SCOPES` environment variable with comma-separated scopes:

```bash
ZOHO_OAUTH_SCOPES="ZohoCRM.modules.ALL,ZohoCRM.settings.fields.ALL,ZohoCRM.settings.workflow_rules.ALL"
```

**Benefits:**
- ✅ Centralized configuration
- ✅ Easy to update without code changes
- ✅ Production-ready
- ✅ Automatically used by all authorization flows

**Example:**
```bash
# Add to your environment
export ZOHO_OAUTH_SCOPES="ZohoCRM.modules.ALL,ZohoCRM.settings.workflow_rules.ALL,ZohoCRM.send_mail.all.CREATE"

# Then authorize normally
curl https://amyloid.ca/oauth/zoho/connect
```

---

## 🎯 **Method 2: Query Parameters** (For Testing)

Pass custom scopes directly in the URL using the `scopes` query parameter:

```bash
https://amyloid.ca/oauth/zoho/connect?scopes=ZohoCRM.modules.ALL,ZohoCRM.settings.workflow_rules.ALL
```

**Benefits:**
- ✅ Quick testing of different scope combinations
- ✅ No environment changes needed
- ✅ Great for debugging

**Examples:**

### Minimal Scopes (Read-Only):
```
https://amyloid.ca/oauth/zoho/connect?scopes=ZohoCRM.modules.READ,ZohoCRM.settings.fields.READ
```

### Full Access:
```
https://amyloid.ca/oauth/zoho/connect?scopes=ZohoCRM.modules.ALL,ZohoCRM.settings.fields.ALL,ZohoCRM.settings.workflow_rules.ALL
```

### Workflow Automation Only:
```
https://amyloid.ca/oauth/zoho/connect?scopes=ZohoCRM.settings.workflow_rules.ALL,ZohoCRM.send_mail.all.CREATE
```

---

## 🎯 **Method 3: Hardcoded Defaults** (Fallback)

If neither environment variables nor query parameters are provided, the system uses these default scopes:

```typescript
[
  'ZohoCRM.modules.ALL',                    // Full module access
  'ZohoCRM.settings.fields.ALL',            // Custom field management
  'ZohoCRM.settings.layouts.READ',          // Layout information
  'ZohoCRM.settings.profiles.READ',         // Profile information
  'ZohoCRM.send_mail.all.CREATE',           // Send emails
  'ZohoCRM.settings.workflow_rules.ALL',    // Workflow automation
  'ZohoCRM.settings.email_templates.READ'   // Email templates
]
```

---

## 🔍 **Debug Your Scopes**

Use the debug endpoint to see exactly what scopes will be requested:

```
https://amyloid.ca/oauth/zoho/debug
```

Or with custom scopes:
```
https://amyloid.ca/oauth/zoho/debug?scopes=ZohoCRM.modules.ALL,ZohoCRM.settings.workflow_rules.ALL
```

This shows:
- ✅ The exact authorization URL
- ✅ Which scopes are being used (custom or default)
- ✅ OAuth configuration details

---

## 📋 **Available Zoho CRM Scopes**

### Module Access
- `ZohoCRM.modules.ALL` - Full CRUD access to all modules
- `ZohoCRM.modules.READ` - Read-only access to modules
- `ZohoCRM.modules.{module}.ALL` - Access to specific module (e.g., `ZohoCRM.modules.leads.ALL`)

### Settings & Configuration
- `ZohoCRM.settings.fields.ALL` - Manage custom fields
- `ZohoCRM.settings.fields.READ` - Read field metadata
- `ZohoCRM.settings.layouts.READ` - Read layout information
- `ZohoCRM.settings.profiles.READ` - Read user profiles
- `ZohoCRM.settings.workflow_rules.ALL` - **Manage workflows** (required for automation)
- `ZohoCRM.settings.email_templates.READ` - Read email templates

### Communication
- `ZohoCRM.send_mail.all.CREATE` - Send emails via CRM
- `ZohoCRM.notifications.ALL` - Manage notifications

### Other
- `ZohoCRM.users.READ` - Read user information
- `ZohoCRM.org.READ` - Read organization info

**Full documentation:** https://www.zoho.com/crm/developer/docs/api/v8/scopes.html

---

## 🚀 **Common Use Cases**

### Use Case 1: Full CRM Access (Default)
**Scopes:** All defaults  
**When to use:** Production environment, full integration

```bash
# Use environment variable
ZOHO_OAUTH_SCOPES="ZohoCRM.modules.ALL,ZohoCRM.settings.fields.ALL,ZohoCRM.settings.workflow_rules.ALL,ZohoCRM.send_mail.all.CREATE"
```

### Use Case 2: Read-Only Access
**When to use:** Analytics, reporting, data sync (no writes)

```bash
https://amyloid.ca/oauth/zoho/connect?scopes=ZohoCRM.modules.READ,ZohoCRM.settings.fields.READ
```

### Use Case 3: Workflow Automation Only
**When to use:** Just creating/managing workflows and sending emails

```bash
https://amyloid.ca/oauth/zoho/connect?scopes=ZohoCRM.settings.workflow_rules.ALL,ZohoCRM.send_mail.all.CREATE,ZohoCRM.modules.leads.READ
```

### Use Case 4: Lead Management Only
**When to use:** CRM integration focused on leads

```bash
https://amyloid.ca/oauth/zoho/connect?scopes=ZohoCRM.modules.leads.ALL,ZohoCRM.send_mail.all.CREATE
```

---

## 🔄 **Updating Scopes**

If you need to add or change scopes after authorization:

1. **Update your environment variable** or **use query parameter**
2. **Re-authorize** by visiting `/oauth/zoho/connect`
3. **Accept the new permissions** on Zoho's page
4. Your token will be updated with the new scopes

---

## 🛡️ **Security Best Practices**

1. **Principle of Least Privilege:** Only request scopes you actually need
2. **Production Environment:** Use environment variables, not query parameters
3. **Regular Audits:** Review and minimize scopes periodically
4. **Scope Validation:** Test with minimal scopes first, expand as needed

---

## 💡 **Examples in Action**

### Example 1: Test with Minimal Scopes
```bash
# Step 1: Test authorization with read-only access
curl "https://amyloid.ca/oauth/zoho/connect?scopes=ZohoCRM.modules.READ"

# Step 2: If successful, upgrade to full access
curl "https://amyloid.ca/oauth/zoho/connect?scopes=ZohoCRM.modules.ALL"
```

### Example 2: Production Setup
```bash
# Set environment variable (add to .env or Replit Secrets)
ZOHO_OAUTH_SCOPES="ZohoCRM.modules.ALL,ZohoCRM.settings.fields.ALL,ZohoCRM.settings.workflow_rules.ALL,ZohoCRM.send_mail.all.CREATE,ZohoCRM.settings.email_templates.READ"

# Authorize (uses environment variable automatically)
curl https://amyloid.ca/oauth/zoho/connect
```

### Example 3: Debug Scopes
```bash
# Check what scopes will be used (with custom scopes)
curl "https://amyloid.ca/oauth/zoho/debug?scopes=ZohoCRM.modules.ALL"

# Check default scopes
curl https://amyloid.ca/oauth/zoho/debug
```

---

## 📊 **Priority Order**

The system checks for scopes in this order:

1. **Query Parameter** (`?scopes=...`) - Highest priority
2. **Environment Variable** (`ZOHO_OAUTH_SCOPES`) - Medium priority
3. **Hardcoded Defaults** - Lowest priority (fallback)

---

## ✅ **Quick Reference**

| Action | URL | Notes |
|--------|-----|-------|
| Authorize with defaults | `https://amyloid.ca/oauth/zoho/connect` | Uses env var or hardcoded defaults |
| Authorize with custom scopes | `https://amyloid.ca/oauth/zoho/connect?scopes=SCOPE1,SCOPE2` | Override scopes for this auth |
| Debug default scopes | `https://amyloid.ca/oauth/zoho/debug` | See what scopes will be used |
| Debug custom scopes | `https://amyloid.ca/oauth/zoho/debug?scopes=SCOPE1,SCOPE2` | See auth URL with custom scopes |
| Test token validity | `https://amyloid.ca/api/test-oauth-token` | Check if current token works |

---

## 🎉 **Your Current Setup**

Right now, to fix the scope mismatch and enable workflow automation:

**Option A: Use Environment Variable (Recommended)**
```bash
# Add to Replit Secrets or .env
ZOHO_OAUTH_SCOPES=ZohoCRM.modules.ALL,ZohoCRM.settings.fields.ALL,ZohoCRM.settings.workflow_rules.ALL,ZohoCRM.send_mail.all.CREATE,ZohoCRM.settings.email_templates.READ

# Then visit
https://amyloid.ca/oauth/zoho/connect
```

**Option B: Use Default Scopes**
```bash
# Just visit (uses hardcoded defaults including workflow_rules.ALL)
https://amyloid.ca/oauth/zoho/connect
```

Both will fix your current `OAUTH_SCOPE_MISMATCH` error! 🚀
