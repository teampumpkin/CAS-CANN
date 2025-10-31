# ✅ Zoho Workflow Automation - Working API Endpoints

## Overview
This document lists the **CORRECT, WORKING** API endpoints for Zoho CRM workflow automation. These endpoints use the `zohoWorkflowService` and are fully functional.

---

## 🔐 Authentication

All endpoints require the `X-Automation-API-Key` header:

```bash
X-Automation-API-Key: YOUR_API_KEY
```

Get your API key from environment variables:
```bash
echo $AUTOMATION_API_KEY
```

---

## 📍 OAuth Endpoints

### 1. **Start OAuth Authorization**
```http
GET /oauth/zoho/connect
```

**Purpose:** Initiates Zoho OAuth flow with correct scopes  
**Usage:** Visit this URL in browser to authorize

**Example:**
```bash
# Visit in browser
https://amyloid.ca/oauth/zoho/connect
```

**What happens:**
1. Redirects to Zoho authorization page
2. User clicks "Accept"
3. Redirects back to callback
4. Stores OAuth token automatically
5. Attempts to create workflows automatically

---

### 2. **OAuth Callback** 
```http
GET /oauth/zoho/callback?code=...
```

**Purpose:** Receives authorization code from Zoho  
**Note:** Called automatically by Zoho, don't call manually

---

## 📋 Workflow Management Endpoints

### 3. **Create All Registration Email Workflows**
```http
POST /api/admin/setup-email-workflows
Content-Type: application/json
X-Automation-API-Key: YOUR_API_KEY

{
  "recreate": false
}
```

**Purpose:** Creates all 3 registration email workflows programmatically  
**Creates:**
- CANN Membership Email Workflow
- CAS Membership Email Workflow  
- Contact Form Email Workflow

**Response:**
```json
{
  "success": true,
  "message": "Successfully created 3 email notification workflows",
  "workflows": [
    {
      "id": "6999043000000001",
      "name": "CANN Membership Email Notification",
      "module": "Leads",
      "state": "active"
    },
    ...
  ],
  "details": { ... }
}
```

**cURL Example:**
```bash
curl -X POST https://amyloid.ca/api/admin/setup-email-workflows \
  -H "X-Automation-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"recreate": false}'
```

**Parameters:**
- `recreate` (boolean): If `true`, deletes existing workflows before creating. Default: `false`

---

### 4. **List All Workflows**
```http
GET /api/admin/email-workflows?module=Leads
X-Automation-API-Key: YOUR_API_KEY
```

**Purpose:** Get list of all workflow rules  
**Query Parameters:**
- `module` (optional): Filter by module (e.g., "Leads", "Contacts")

**Response:**
```json
{
  "success": true,
  "count": 3,
  "module": "Leads",
  "workflows": [
    {
      "id": "6999043000000001",
      "name": "CANN Membership Email Notification",
      "module_name": "Leads",
      "state": "active",
      "created_time": "2025-10-31T08:30:00Z",
      "modified_time": "2025-10-31T08:30:00Z"
    },
    ...
  ]
}
```

**cURL Example:**
```bash
curl https://amyloid.ca/api/admin/email-workflows?module=Leads \
  -H "X-Automation-API-Key: YOUR_API_KEY"
```

---

### 5. **Get Specific Workflow**
```http
GET /api/admin/email-workflows/{workflowId}
X-Automation-API-Key: YOUR_API_KEY
```

**Purpose:** Get detailed information about a specific workflow  
**Path Parameters:**
- `workflowId`: Zoho workflow rule ID

**Response:**
```json
{
  "success": true,
  "workflow": {
    "id": "6999043000000001",
    "name": "CANN Membership Email Notification",
    "module_name": "Leads",
    "state": "active",
    "criteria": { ... },
    "actions": [ ... ],
    "created_time": "2025-10-31T08:30:00Z",
    "modified_time": "2025-10-31T08:30:00Z"
  }
}
```

**cURL Example:**
```bash
curl https://amyloid.ca/api/admin/email-workflows/6999043000000001 \
  -H "X-Automation-API-Key: YOUR_API_KEY"
```

---

### 6. **Update Workflow**
```http
PUT /api/admin/email-workflows/{workflowId}
Content-Type: application/json
X-Automation-API-Key: YOUR_API_KEY

{
  "name": "Updated Workflow Name",
  "state": "active"
}
```

**Purpose:** Update an existing workflow rule  
**Path Parameters:**
- `workflowId`: Zoho workflow rule ID

**Request Body:**
```json
{
  "name": "New Workflow Name",
  "state": "active" | "inactive"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Workflow 6999043000000001 updated successfully"
}
```

**cURL Example:**
```bash
curl -X PUT https://amyloid.ca/api/admin/email-workflows/6999043000000001 \
  -H "X-Automation-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name", "state": "active"}'
```

---

### 7. **Delete Workflows**
```http
DELETE /api/admin/email-workflows
Content-Type: application/json
X-Automation-API-Key: YOUR_API_KEY

{
  "ids": ["6999043000000001", "6999043000000002"]
}
```

**Purpose:** Delete one or more workflow rules  
**Request Body:**
```json
{
  "ids": ["workflowId1", "workflowId2", ...]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Deleted 2 workflow(s)",
  "deletedCount": 2
}
```

**cURL Example:**
```bash
curl -X DELETE https://amyloid.ca/api/admin/email-workflows \
  -H "X-Automation-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"ids": ["6999043000000001", "6999043000000002"]}'
```

---

### 8. **Get Workflow Statistics**
```http
GET /api/admin/workflow-stats
X-Automation-API-Key: YOUR_API_KEY
```

**Purpose:** Get overview of workflow system status  
**Response:**
```json
{
  "success": true,
  "stats": {
    "totalWorkflows": 3,
    "activeWorkflows": 3,
    "inactiveWorkflows": 0,
    "modules": {
      "Leads": 3
    }
  }
}
```

**cURL Example:**
```bash
curl https://amyloid.ca/api/admin/workflow-stats \
  -H "X-Automation-API-Key: YOUR_API_KEY"
```

---

### 9. **List Email Notification Actions**
```http
GET /api/admin/email-notifications?module=Leads&workflow_id=6999043000000001
X-Automation-API-Key: YOUR_API_KEY
```

**Purpose:** Get list of email notification actions  
**Query Parameters:**
- `module` (optional): Filter by module
- `workflow_id` (optional): Filter by workflow ID

**Response:**
```json
{
  "success": true,
  "count": 3,
  "notifications": [ ... ]
}
```

**cURL Example:**
```bash
curl https://amyloid.ca/api/admin/email-notifications?module=Leads \
  -H "X-Automation-API-Key: YOUR_API_KEY"
```

---

### 10. **Delete Email Notification Actions**
```http
DELETE /api/admin/email-notifications
Content-Type: application/json
X-Automation-API-Key: YOUR_API_KEY

{
  "ids": ["actionId1", "actionId2"]
}
```

**Purpose:** Delete specific email notification actions  
**Request Body:**
```json
{
  "ids": ["actionId1", "actionId2", ...]
}
```

**cURL Example:**
```bash
curl -X DELETE https://amyloid.ca/api/admin/email-notifications \
  -H "X-Automation-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"ids": ["actionId1", "actionId2"]}'
```

---

## 🧪 Test Endpoints

### 11. **Manual Workflow Creation Test**
```http
GET /api/create-workflow
```

**Purpose:** Test endpoint to manually trigger workflow creation  
**Note:** Development/testing only

**cURL Example:**
```bash
curl https://amyloid.ca/api/create-workflow
```

---

## ⚠️ Non-Functional Endpoints

**These endpoints DO NOT work** (they use non-existent storage methods):

❌ `/api/workflows` - DON'T USE  
❌ `/api/workflows/:id` - DON'T USE  
❌ `/api/workflow-templates` - DON'T USE  
❌ `/api/executions/:id` - DON'T USE

**Use the `/api/admin/email-workflows` endpoints instead!**

---

## 🚀 Quick Start Guide

### Step 1: Authenticate with Zoho
```bash
# Visit in browser
https://amyloid.ca/oauth/zoho/connect
```

### Step 2: Create Workflows
```bash
curl -X POST https://amyloid.ca/api/admin/setup-email-workflows \
  -H "X-Automation-API-Key: $AUTOMATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"recreate": false}'
```

### Step 3: Verify Workflows
```bash
curl https://amyloid.ca/api/admin/email-workflows \
  -H "X-Automation-API-Key: $AUTOMATION_API_KEY"
```

### Step 4: Check Statistics
```bash
curl https://amyloid.ca/api/admin/workflow-stats \
  -H "X-Automation-API-Key: $AUTOMATION_API_KEY"
```

---

## 📊 Workflow Details

### CANN Membership Workflow
- **Trigger:** Lead_Source contains "CANN"
- **Action:** Email notification
- **Recipients:** CAS@amyloid.ca, CANN@amyloid.ca, vasi.karan@teampumpkin.com

### CAS Membership Workflow
- **Trigger:** Lead_Source contains "CAS" AND NOT "CANN"
- **Action:** Email notification
- **Recipients:** CAS@amyloid.ca, vasi.karan@teampumpkin.com

### Contact Form Workflow
- **Trigger:** Lead_Source contains "Contact"
- **Action:** Email notification
- **Recipients:** CAS@amyloid.ca, vasi.karan@teampumpkin.com

---

## 🔍 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing or invalid API key)
- `404` - Not Found (workflow doesn't exist)
- `500` - Internal Server Error

---

## 📝 Notes

1. All endpoints require `X-Automation-API-Key` header
2. OAuth token must be valid (re-authenticate if expired)
3. Workflows are created in Zoho CRM and execute automatically
4. Use `recreate: true` to delete and recreate existing workflows
5. Production domain: `https://amyloid.ca`

---

## ✅ Endpoint Summary

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/oauth/zoho/connect` | Start OAuth | ✅ Working |
| GET | `/oauth/zoho/callback` | OAuth callback | ✅ Working |
| POST | `/api/admin/setup-email-workflows` | Create workflows | ✅ Working |
| GET | `/api/admin/email-workflows` | List workflows | ✅ Working |
| GET | `/api/admin/email-workflows/:id` | Get workflow | ✅ Working |
| PUT | `/api/admin/email-workflows/:id` | Update workflow | ✅ Working |
| DELETE | `/api/admin/email-workflows` | Delete workflows | ✅ Working |
| GET | `/api/admin/email-notifications` | List email actions | ✅ Working |
| DELETE | `/api/admin/email-notifications` | Delete email actions | ✅ Working |
| GET | `/api/admin/workflow-stats` | Get statistics | ✅ Working |
| GET | `/api/create-workflow` | Test endpoint | ✅ Working |
| * | `/api/workflows` | Generic workflows | ❌ BROKEN |
| * | `/api/workflow-templates` | Templates | ❌ BROKEN |

---

**For detailed implementation guide, see `WORKFLOW_AUTOMATION_GUIDE.md`**
