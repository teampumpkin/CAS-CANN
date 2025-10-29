# Marketing Automation Platform - Chat-Driven Control

This is a headless marketing automation system that connects Zoho CRM with Zoho Campaigns. You control everything through chat conversations instead of clicking through a UI.

## Quick Start

### 1. First-Time Setup

You need to authenticate with Zoho first:

1. Visit the OAuth callback URL (ask me to generate it)
2. Approve the connection
3. Your tokens will be stored securely

### 2. API Key Setup

All automation endpoints are protected with an API key. The default development key is: `dev-automation-key-change-in-production`

**For production**: Set the `AUTOMATION_API_KEY` environment variable to a secure random key.

When making API calls, include the key in one of two ways:
- Header: `X-Automation-API-Key: your-api-key-here`
- Query param: `?apiKey=your-api-key-here`

### 3. Access the Dashboard

Visit: **http://localhost:5000/admin/automation**

This gives you a visual view of:
- Active workflows
- Pre-built templates
- Campaign lists from Zoho

The dashboard automatically includes the API key in all requests.

## How to Use (Chat Commands)

### Check Your CRM Data

**"Show me my leads"**
- API: `POST /api/commands/crm/leads`
- Returns: Latest 20 leads from Zoho CRM

**"Show me contacts"**
- API: `POST /api/commands/crm/contacts`
- Returns: Latest 20 contacts from Zoho CRM

### Manage Campaign Lists

**"Show my campaign lists"**
- API: `GET /api/campaigns/lists`
- Returns: All mailing lists from Zoho Campaigns

**"Create a new campaign list called 'Newsletter 2025'"**
- API: `POST /api/campaigns/lists`
- Body: `{ "listName": "Newsletter 2025" }`

### Sync CRM to Campaigns

**"Sync all my leads to the nurture campaign"**
- API: `POST /api/commands/sync-to-campaign`
- Body: 
```json
{
  "crmModule": "Leads",
  "listKey": "YOUR_LIST_KEY",
  "filters": {},
  "limit": 100
}
```

### Create Automation Workflows

**"Create a workflow from the 'new-lead-to-nurture-campaign' template"**
- API: `POST /api/workflow-templates/new-lead-to-nurture-campaign/create`
- This sets up an automation that adds new leads to your campaign automatically

**Available Templates:**
1. `new-lead-to-nurture-campaign` - Auto-add new leads to nurture list
2. `qualified-lead-to-sales-campaign` - Move qualified leads to sales list
3. `contact-created-welcome-email` - Send welcome email to new contacts
4. `lead-status-won-to-customer-campaign` - Convert won leads to customers
5. `high-value-lead-notification` - Flag and process high-value leads
6. `monthly-newsletter-blast` - Manual trigger for newsletter
7. `sync-crm-to-campaign-list` - Bulk sync CRM data

### Execute Workflows

**"Run workflow #3"**
- API: `POST /api/workflows/3/execute`
- Body: `{ "context": {} }`

**"Activate workflow #2"**
- API: `PUT /api/workflows/2`
- Body: `{ "status": "active" }`

### Monitor Executions

**"Show me executions for workflow #1"**
- API: `GET /api/workflows/1/executions`

**"Show me details for execution #5"**
- API: `GET /api/executions/5`

## Workflow Structure

Each workflow has:

### Trigger
When should this run?
- `manual` - You trigger it
- `crm_record_created` - When a new CRM record is created
- `crm_record_updated` - When a CRM record changes
- `crm_field_changed` - When a specific field changes
- `scheduled` - On a schedule (future feature)

### Conditions (Optional)
What criteria must be met?
- Field equals/not equals value
- Field contains text
- Field is empty/not empty
- Numeric comparisons

### Actions
What should happen?
- `add_to_campaign` - Add contact to Zoho Campaigns list
- `send_email` - Send/schedule a campaign
- `update_crm_field` - Update a field in Zoho CRM
- `create_crm_record` - Create a new CRM record
- `wait` - Pause for X seconds
- `http_request` - Call any API

## Example Workflows

### Example 1: Auto-Nurture New Leads

```json
{
  "name": "Auto-Nurture New Leads",
  "triggerType": "crm_record_created",
  "triggerConfig": {
    "module": "Leads"
  },
  "conditions": [
    {
      "field": "Email",
      "operator": "is_not_empty"
    }
  ],
  "actions": [
    {
      "type": "add_to_campaign",
      "config": {
        "listKey": "abc123",
        "email": "{{Email}}",
        "firstName": "{{First_Name}}",
        "lastName": "{{Last_Name}}"
      }
    }
  ]
}
```

### Example 2: Qualified Lead → Sales Team

```json
{
  "name": "Qualified Lead Alert",
  "triggerType": "crm_field_changed",
  "triggerConfig": {
    "module": "Leads",
    "field": "Lead_Status"
  },
  "conditions": [
    {
      "field": "Lead_Status",
      "operator": "equals",
      "value": "Qualified"
    }
  ],
  "actions": [
    {
      "type": "add_to_campaign",
      "config": {
        "listKey": "sales_xyz",
        "email": "{{Email}}"
      }
    },
    {
      "type": "update_crm_field",
      "config": {
        "module": "Leads",
        "recordId": "{{id}}",
        "field": "Rating",
        "value": "Hot"
      }
    }
  ]
}
```

## Technical Architecture

### Backend Services
- **Zoho CRM Service** (`server/zoho-crm-service.ts`) - CRM API client
- **Zoho Campaigns Service** (`server/zoho-campaigns-service.ts`) - Campaigns API client
- **Workflow Execution Engine** (`server/workflow-execution-engine.ts`) - Orchestrates workflows
- **Workflow Templates** (`server/workflow-templates.ts`) - Pre-built workflows

### Database Tables
- `automation_workflows` - Workflow definitions
- `workflow_executions` - Execution history
- `action_executions` - Individual action results
- `campaign_syncs` - Campaign sync tracking
- `oauth_tokens` - Zoho authentication

### API Endpoints

**Workflows:**
- `GET /api/workflows` - List all workflows
- `POST /api/workflows` - Create workflow
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow
- `POST /api/workflows/:id/execute` - Execute workflow
- `GET /api/workflows/:id/executions` - View execution history

**Templates:**
- `GET /api/workflow-templates` - List all templates
- `POST /api/workflow-templates/:name/create` - Create from template

**Campaigns:**
- `GET /api/campaigns/lists` - List campaign lists
- `POST /api/campaigns/lists` - Create list
- `POST /api/campaigns/lists/:listKey/subscribers` - Add subscriber
- `POST /api/campaigns/lists/:listKey/subscribers/bulk` - Bulk add
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `POST /api/campaigns/:campaignKey/send` - Send campaign

**Commands:**
- `POST /api/commands/crm/leads` - Fetch leads
- `POST /api/commands/crm/contacts` - Fetch contacts
- `POST /api/commands/sync-to-campaign` - Bulk sync CRM to campaign

## Chat Examples for You to Try

1. **"List all my workflows"**
2. **"Create a workflow from the welcome email template"**
3. **"Show me my last 10 leads"**
4. **"Sync all qualified leads to my sales campaign"**
5. **"Execute the newsletter workflow"**
6. **"Show me what happened in execution #3"**
7. **"Create a new campaign list for webinar attendees"**

## Next Steps

1. **Authenticate with Zoho** - Get your OAuth tokens set up
2. **Test CRM connection** - Fetch some leads/contacts
3. **Set up campaign lists** - Create lists in Zoho Campaigns
4. **Create your first workflow** - Start with a template
5. **Activate and test** - Turn it on and watch it work!

You control everything by talking to me. No clicking, no UI navigation - just tell me what you want to do!
