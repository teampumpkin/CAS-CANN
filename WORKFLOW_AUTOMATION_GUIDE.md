# Zoho CRM Workflow Automation System

## Overview

This comprehensive system allows you to manage Zoho CRM workflows programmatically via API, enabling automated email notifications, field updates, webhooks, and other automation tasks without manual setup in Zoho CRM.

---

## Architecture

### Components

1. **OAuth Service** (`server/oauth-service.ts`)
   - Manages Zoho OAuth authentication with comprehensive scopes
   - Handles token refresh automatically
   - Uses `ZohoCRM.settings.workflow_rules.ALL` for full automation access

2. **Workflow Service** (`server/zoho-workflow-service.ts`)
   - Core automation engine with complete CRUD operations
   - Supports workflow rules, email notifications, webhooks, tasks
   - Built-in templates for common use cases

3. **Admin API Endpoints** (`server/routes.ts`)
   - RESTful API for programmatic workflow management
   - Protected by API key authentication
   - Full CRUD operations on workflows and actions

4. **Email Notification Service** (`server/email-notification-service.ts`)
   - Pre-built email templates for CAS/CANN registrations
   - Configurable recipients and content
   - Integration with Zoho CRM's email system

---

## OAuth Scopes

The system uses these comprehensive Zoho CRM OAuth scopes:

| Scope | Purpose |
|-------|---------|
| `ZohoCRM.modules.ALL` | Full module access (Leads, Contacts, etc.) |
| `ZohoCRM.settings.fields.ALL` | Custom field creation/management |
| `ZohoCRM.settings.layouts.READ` | Layout information access |
| `ZohoCRM.settings.profiles.READ` | Profile information access |
| `ZohoCRM.send_mail.all.CREATE` | Send emails via CRM |
| `ZohoCRM.settings.workflow_rules.ALL` | **✅ Workflow rules management (includes all automation: email notifications, webhooks, tasks, field updates)** |
| `ZohoCRM.settings.email_templates.READ` | Email template access |

**Note:** The `ZohoCRM.settings.automation.ALL` scope does not exist in Zoho's API. The `ZohoCRM.settings.workflow_rules.ALL` scope provides complete workflow automation capabilities.

---

## Re-Authentication Required

**IMPORTANT:** You must re-authenticate with Zoho to get a new OAuth token that includes the automation scope.

### Step-by-Step Re-Authentication

1. **Visit the OAuth authorization page:**
   ```
   https://amyloid.ca/oauth/zoho/connect
   ```

2. **Authorize the application** with the new scopes

3. **Verify authentication:**
   ```bash
   curl -H "X-Automation-API-Key: YOUR_API_KEY" \
        https://amyloid.ca/api/admin/workflow-stats
   ```

---

## API Endpoints

All endpoints require the `X-Automation-API-Key` header with your API key.

### Workflow Rules

#### List All Workflows
```http
GET /api/admin/email-workflows?module=Leads
X-Automation-API-Key: YOUR_API_KEY
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "module": "Leads",
  "workflows": [...]
}
```

#### Get Specific Workflow
```http
GET /api/admin/email-workflows/{workflowId}
X-Automation-API-Key: YOUR_API_KEY
```

#### Create Workflow
```http
POST /api/admin/setup-email-workflows
X-Automation-API-Key: YOUR_API_KEY
Content-Type: application/json

{
  "recreate": false
}
```

**This creates 3 workflows:**
1. CANN Membership notifications
2. CAS-only membership notifications  
3. Contact form notifications

#### Update Workflow
```http
PUT /api/admin/email-workflows/{workflowId}
X-Automation-API-Key: YOUR_API_KEY
Content-Type: application/json

{
  "name": "Updated Workflow Name",
  "state": "active"
}
```

#### Delete Workflows
```http
DELETE /api/admin/email-workflows
X-Automation-API-Key: YOUR_API_KEY
Content-Type: application/json

{
  "ids": ["workflowId1", "workflowId2"]
}
```

### Email Notifications

#### List All Email Notifications
```http
GET /api/admin/email-notifications
X-Automation-API-Key: YOUR_API_KEY
```

#### Delete Email Notifications
```http
DELETE /api/admin/email-notifications
X-Automation-API-Key: YOUR_API_KEY
Content-Type: application/json

{
  "ids": ["notificationId1", "notificationId2"]
}
```

### Workflow Statistics

#### Get Workflow Stats
```http
GET /api/admin/workflow-stats
X-Automation-API-Key: YOUR_API_KEY
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "moduleCount": {...},
    "actionsCount": {...},
    "timestamp": "2025-10-31T..."
  }
}
```

---

## Programmatic Workflow Creation

### Example: Create Registration Email Workflows

```javascript
const response = await fetch('https://amyloid.ca/api/admin/setup-email-workflows', {
  method: 'POST',
  headers: {
    'X-Automation-API-Key': process.env.AUTOMATION_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recreate: false  // Set to true to delete and recreate existing workflows
  })
});

const result = await response.json();
console.log(result);
```

**Expected Output:**
```json
{
  "success": true,
  "message": "Email workflows created successfully",
  "workflows": {
    "cann": "6999043000000925123",
    "cas": "6999043000000925124",
    "contact": "6999043000000925125"
  },
  "emailNotifications": {
    "cann": "6999043000000925223",
    "cas": "6999043000000925224",
    "contact": "6999043000000925225"
  }
}
```

---

## Workflow Templates

### CANN Membership Workflow

**Trigger:** New Lead created with `Lead_Source` containing "CANN"

**Email Recipients:**
- `CAS@amyloid.ca`
- `CANN@amyloid.ca`
- `vasi.karan@teampumpkin.com`

**Email Content:**
- Subject: "New CANN Membership Registration"
- HTML template with member details
- Professional medical aesthetic

### CAS-Only Membership Workflow

**Trigger:** New Lead created with `Lead_Source` containing "CAS" but NOT "CANN"

**Email Recipients:**
- `CAS@amyloid.ca`
- `vasi.karan@teampumpkin.com`

### Contact Form Workflow

**Trigger:** New Lead created with `Lead_Source` containing "Contact"

**Email Recipients:**
- `CAS@amyloid.ca`
- `vasi.karan@teampumpkin.com`

---

## Workflow Configuration Structure

Each workflow follows this structure:

```json
{
  "name": "Workflow Name",
  "module": "Leads",
  "description": "Description",
  "criteria": {
    "filter": {
      "comparison_type": "all",
      "conditions_matched": "1",
      "group_operator": "and",
      "group": [
        {
          "api_name": "Lead_Source",
          "comparator": "contains",
          "value": "CANN"
        }
      ]
    }
  },
  "execution_time": "on_create",
  "actions": [
    {
      "type": "email_notification",
      "id": "emailNotificationActionId"
    }
  ]
}
```

---

## Error Handling

### Common Errors

1. **OAuth Scope Missing**
   ```json
   {
     "success": false,
     "message": "OAUTH_SCOPE_MISMATCH"
   }
   ```
   **Solution:** Re-authenticate with updated scopes

2. **Invalid API Key**
   ```json
   {
     "success": false,
     "message": "Invalid or missing automation API key"
   }
   ```
   **Solution:** Include `X-Automation-API-Key` header

3. **Workflow Not Found**
   ```json
   {
     "success": false,
     "message": "Workflow not found"
   }
   ```
   **Solution:** Verify workflow ID exists

---

## Testing

### 1. Test OAuth Authentication
```bash
curl https://amyloid.ca/oauth/zoho/connect
```

### 2. Test Workflow Creation
```bash
curl -X POST https://amyloid.ca/api/admin/setup-email-workflows \
  -H "X-Automation-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"recreate": false}'
```

### 3. Test Workflow Listing
```bash
curl https://amyloid.ca/api/admin/email-workflows \
  -H "X-Automation-API-Key: YOUR_API_KEY"
```

### 4. Test Statistics
```bash
curl https://amyloid.ca/api/admin/workflow-stats \
  -H "X-Automation-API-Key: YOUR_API_KEY"
```

---

## Future Enhancements

### Planned Features

1. **Webhook Automation**
   - Create webhooks for external system integration
   - Real-time data sync with external APIs

2. **Field Update Actions**
   - Automatically update fields based on conditions
   - Lead scoring and qualification automation

3. **Task Automation**
   - Create follow-up tasks automatically
   - Assign tasks based on lead source

4. **Custom Function Integration**
   - Execute custom Deluge scripts via API
   - Complex business logic automation

5. **Workflow Templates Library**
   - Pre-built templates for common use cases
   - Import/export workflow configurations

6. **Workflow Analytics**
   - Track workflow execution rates
   - Monitor email delivery success
   - Performance metrics dashboard

---

## Security

### API Key Management

- Store API keys in environment variables
- Never commit keys to version control
- Rotate keys regularly
- Use separate keys for dev/staging/production

### OAuth Token Security

- Tokens stored encrypted in database
- Automatic token refresh every 50 minutes
- Tokens deactivated when new ones are issued
- Single active token per provider

---

## Support

For issues or questions:

1. Check the [Zoho CRM API Documentation](https://www.zoho.com/crm/developer/docs/api/v8/)
2. Review workflow logs in Zoho CRM (Setup → Automation → Workflow Rules)
3. Check application logs for detailed error messages
4. Contact: vasi.karan@teampumpkin.com

---

## Changelog

### Version 1.0 (October 31, 2025)

- ✅ Initial release with full CRUD workflow management
- ✅ Email notification automation for CAS/CANN registrations
- ✅ OAuth scope updates for automation access
- ✅ Admin API endpoints with authentication
- ✅ Comprehensive documentation
- ✅ Workflow statistics and monitoring
