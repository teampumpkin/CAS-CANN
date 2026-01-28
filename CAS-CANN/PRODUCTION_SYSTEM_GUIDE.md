# Canadian Amyloidosis Society - Lead Capture System
## Production System Guide

---

## 🎯 System Overview

Your Canadian Amyloidosis Society website now has a **fully operational, production-ready Lead Capture System** that automatically syncs form submissions from your website to Zoho CRM.

### ✅ Current Status: **LIVE & OPERATIONAL**

---

## 📊 Current Data in System

### **Total Records: 21**
- **20 Historical Imports** (from Excel files)
  - 18 CAS Registration records
  - 2 CANN Contact records
  - All tagged with "(Historical)" suffix for reporting
  
- **1 Live Form Submission** 
  - Successfully synced from website to Zoho CRM
  - Proves system is working end-to-end

### **Sync Success Rate: 100%**
All 21 records are synced to Zoho CRM Leads module with proper Lead_Source attribution.

---

## 🔄 How the System Works

### **Automatic Processing Flow**

```
User Fills Form → Database → Field Sync → Zoho CRM → Success ✅
    (Website)      (Saved)    (Auto)      (Lead Created)
```

### **Step-by-Step Process**

1. **Form Submission**
   - User submits CAS Registration or CANN Membership form
   - Data validated on frontend using React Hook Form + Zod
   - Sent to backend API endpoint

2. **Database Storage**
   - Submission saved to PostgreSQL database
   - Assigned processing_status: "pending"
   - Background processor picks it up automatically

3. **Field Synchronization**
   - System checks Zoho CRM for existing fields
   - Creates custom fields automatically if needed
   - Respects Zoho's field types (text, phone, email, etc.)

4. **CRM Push**
   - Data formatted according to Zoho requirements
   - Phone/email fields converted to strings
   - Lead_Source automatically assigned based on form type
   - Record created in Zoho Leads module

5. **Confirmation**
   - Database updated with Zoho record ID
   - Status changed to "synced"
   - User sees success message on website

---

## 🏷️ Lead Source Attribution

Your forms automatically tag submissions with unique Lead_Source values for reporting:

### **Website Forms (Live Submissions)**
| Form Name | Lead Source in Zoho |
|-----------|---------------------|
| Join CAS Today | `Website - Join CAS Today` |
| Join CANN Today | `Website - CANN Membership` |

### **Historical Imports**
| Import Type | Lead Source in Zoho |
|-------------|---------------------|
| CAS Registration (Excel) | `Website - Join CAS Today (Historical)` |
| CANN Contacts (Excel) | `Website - CANN Membership (Historical)` |

This allows you to:
- Track which channel brings in leads
- Separate historical data from live submissions
- Create reports in Zoho CRM by Lead_Source

---

## 🔐 System Components

### **1. OAuth Token Management**
- **Auto-refresh**: Tokens refresh automatically every 15 minutes
- **Backup system**: Multiple tokens supported
- **Health monitoring**: 24/7 token validity checks
- **Status**: ✅ Active and working

### **2. Field Metadata Cache**
- **Auto-sync**: Refreshes field mappings daily
- **Smart detection**: Respects existing Zoho field types
- **Custom fields**: Creates new fields when needed
- **Current fields**: 101 fields mapped in Leads module

### **3. Error Retry System**
- **Automatic retries**: Failed submissions retry every 60 seconds
- **Smart handling**: Different retry logic for different error types
- **Max attempts**: 5 retries before marking as failed
- **Status**: ✅ Running

### **4. Background Processing**
- **Real-time**: Submissions processed immediately
- **Queue system**: Handles multiple submissions
- **Status tracking**: Updates database at each step
- **Current status**: ✅ Operational

---

## 📥 Bulk Import System

### **How to Import Historical Data**

The system includes a bulk import tool for Excel files.

#### **Supported Formats**

**1. CANN Contacts Format**
Excel file with columns:
- Full Name
- Email
- Discipline
- Institution Name
- Subspecialty
- Amyloidosis Type
- Areas of Interest
- etc.

**2. CAS Registration Format**
Excel file with Q-numbered columns:
- Q2 = Full Name
- Q3 = Email
- Q4 = Discipline
- Q5 = Institution
- etc.

#### **How to Run Import**

```bash
# Place your Excel file in attached_assets/ folder
# Then run:
tsx server/bulk-import-runner.ts
```

The script will:
1. Read Excel file
2. Transform data to proper format
3. Create submissions in database
4. Automatically sync to Zoho CRM
5. Tag all imports with "(Historical)" suffix

---

## 🛠️ Database Management

### **Current Database Tables**

1. **form_submissions** - All form submissions
2. **field_mappings** - Zoho field metadata cache
3. **submission_logs** - Detailed processing logs
4. **oauth_tokens** - Access token management
5. **form_configurations** - Form settings

### **Checking Submissions**

```sql
-- View all submissions
SELECT id, form_name, sync_status, zoho_crm_id 
FROM form_submissions 
ORDER BY id DESC;

-- Count by status
SELECT 
  sync_status,
  COUNT(*) as count
FROM form_submissions
GROUP BY sync_status;

-- Recent submissions only
SELECT * FROM form_submissions 
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### **Manual Processing**

If submissions get stuck in "pending" status:

```bash
tsx server/process-pending-submissions.ts
```

This will manually process and sync any pending submissions.

---

## 🔍 Monitoring & Troubleshooting

### **System Health Checks**

1. **OAuth Token Status**
   - Check logs for: `[OAuth] Token health check`
   - Should show: `isValid: true`

2. **Field Cache Status**
   - Check logs for: `[Field Cache] Cache statistics`
   - Should show: `totalFields: 101`

3. **Background Processing**
   - Check logs for: `[Error Handler] Retry processor started`
   - Should run every 60 seconds

### **Common Issues & Solutions**

#### **Issue: Submission stuck in "pending"**
**Solution**: Run manual processing
```bash
tsx server/process-pending-submissions.ts
```

#### **Issue: Field type mismatch error**
**Solution**: System automatically detects and converts types
- Phone fields → strings
- Email fields → strings
- Boolean values → handled based on Zoho field type

#### **Issue: OAuth token expired**
**Solution**: Automatic refresh every 15 minutes
- If issues persist, check ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET

#### **Issue: Custom field creation fails**
**Solution**: Check field name format
- Must start with letter
- Only alphanumeric characters
- No special characters except underscore

---

## 📈 Analytics & Reporting

### **In Your Database**

```sql
-- Submissions by form type
SELECT 
  form_name,
  COUNT(*) as total,
  COUNT(CASE WHEN sync_status = 'synced' THEN 1 END) as synced
FROM form_submissions
GROUP BY form_name;

-- Historical vs Live submissions
SELECT 
  CASE 
    WHEN source_form LIKE '%Historical%' THEN 'Historical Import'
    ELSE 'Live Website'
  END as submission_type,
  COUNT(*) as count
FROM form_submissions
GROUP BY submission_type;

-- Sync success rate
SELECT 
  ROUND(
    100.0 * COUNT(CASE WHEN sync_status = 'synced' THEN 1 END) / COUNT(*),
    2
  ) as success_rate_percentage
FROM form_submissions;
```

### **In Zoho CRM**

Create reports using `Lead_Source` field:
- Filter by "Website - Join CAS Today" for CAS registrations
- Filter by "Website - CANN Membership" for CANN submissions
- Filter by "(Historical)" suffix for imported data

---

## 🚀 Next Steps & Best Practices

### **Recommended Actions**

1. **Monitor First Week**
   - Check daily that submissions sync successfully
   - Review Zoho CRM for data quality
   - Verify Lead_Source attribution

2. **Set Up Alerts** (Optional)
   - Create alerts in Zoho for new leads
   - Set up email notifications for form submissions
   - Monitor sync failures

3. **Regular Maintenance**
   - Review failed submissions weekly
   - Clean up test data periodically
   - Update field mappings as needed

### **Data Quality Tips**

- ✅ All phone numbers converted to strings automatically
- ✅ Email validation happens on frontend
- ✅ Required fields enforced in forms
- ✅ Long text truncated to field limits (with warnings)
- ✅ Multi-select fields limited to 210 characters

### **Security Best Practices**

- ✅ OAuth tokens stored in database, not code
- ✅ Auto-refresh prevents token expiration
- ✅ Secrets managed via Replit environment
- ✅ No credentials in logs or error messages

---

## 📞 Support Information

### **System Files**

**Core Services:**
- `server/zoho-crm-service.ts` - Zoho API integration
- `server/field-sync-engine.ts` - Field synchronization
- `server/dedicated-token-manager.ts` - OAuth management
- `server/bulk-import-service.ts` - Excel import system

**API Endpoints:**
- `POST /api/submit-form` - Form submission endpoint
- `GET /api/submit-form/:id` - Check submission status
- `POST /api/bulk-import` - Bulk import endpoint

**Utility Scripts:**
- `server/bulk-import-runner.ts` - Import Excel files
- `server/process-pending-submissions.ts` - Manual processing

### **Environment Variables Required**

```
ZOHO_CLIENT_ID=<your_client_id>
ZOHO_CLIENT_SECRET=<your_client_secret>
ZOHO_ORG_ID=<your_org_id>
DATABASE_URL=<postgres_connection_string>
```

---

## ✅ System Verification Checklist

- [x] Database cleaned (66 test records removed)
- [x] 20 historical records imported and synced
- [x] 1 live form submission tested and verified
- [x] OAuth token auto-refresh working
- [x] Field metadata cache synced
- [x] Background error retry system active
- [x] Lead_Source attribution correct
- [x] All 21 records in Zoho CRM
- [x] 100% sync success rate

---

## 📊 Final Statistics

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CANADIAN AMYLOIDOSIS SOCIETY
  LEAD CAPTURE SYSTEM STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Total Records:        21
  ├─ Historical:        20 (95.2%)
  └─ Live:              1 (4.8%)

  Sync Status:          
  ├─ Synced:           21 (100%)
  ├─ Pending:          0 (0%)
  └─ Failed:           0 (0%)

  Zoho CRM Integration: ✅ ACTIVE
  OAuth Token:          ✅ VALID
  Auto-Refresh:         ✅ ENABLED
  Field Cache:          ✅ SYNCED (101 fields)
  Error Retry:          ✅ RUNNING

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STATUS: PRODUCTION READY ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

**Last Updated**: October 16, 2025  
**System Version**: Production v1.0  
**Documentation**: Complete
