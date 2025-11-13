# Canadian Amyloidosis Society (CAS) Website

## Overview
This project is a modern, patient-focused website for the Canadian Amyloidosis Society (CAS). Its primary purpose is to serve as a comprehensive platform for education, resource sharing, and community building, connecting patients, caregivers, and healthcare professionals with vital resources and support for amyloidosis care across Canada. The vision is to enhance amyloidosis awareness and treatment, offering a centralized hub for critical information and fostering a supportive community.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The project features a minimalist + Flat 2.0 hybrid design with soft shadows and rounded corners, utilizing Rosarivo (serif) and Mulish (sans-serif) fonts. It prioritizes clear visual hierarchy, a professional medical aesthetic, interactive elements, and smooth animations. Key enhancements include redesigned statistics cards, a two-level healthcare center popup system, an interactive map with advanced clustering, and enhanced navigation. Brand colors (#00AFE6 and #00DD89) are consistently applied. Accessibility (WCAG 2.1 Level AA) is a core focus, including an accessibility tools widget, keyboard navigation, screen reader support, high contrast modes, font size adjustment, dyslexia-friendly fonts, and custom cursor sizes. A unified light/dark theme system with `localStorage` persistence and system preference detection is implemented.

### Technical Implementations
The frontend is built with React 18 and TypeScript, using Vite for building, Tailwind CSS with shadcn/ui for styling, Radix UI for primitives, Framer Motion for animations, and Wouter for routing. TanStack Query manages server state. Comprehensive French language support is integrated through a dynamic translation system.

The backend uses Node.js with Express.js, PostgreSQL (Neon serverless), and Drizzle ORM for type-safe database operations. It features a RESTful API with structured error handling and `connect-pg-simple` for session management.

Key features include:
- **Content Management**: Documentation for bilingual support and brand consistency.
- **Interactive Healthcare Directory Map**: Displays 25+ Canadian facilities with clickable markers and detailed modals.
- **CANN Integration**: A dedicated page for the Canadian Amyloidosis Network.
- **Dynamic Multi-Form Lead Capture System**: Integrates with Zoho CRM v8 API for CAS Registration and CANN Membership forms, featuring automatic OAuth token refresh, intelligent field mapping, and distinct `Lead_Source` attribution. It handles field lookups, custom field creation, and data type conversions.
- **Bulk Import System**: Excel-based historical data import with configurable column mapping for Zoho CRM, including automatic field sync and type-safe transformations.
- **Zoho CRM Data Integration Service**: A standalone service for processing CSV/Excel files into Zoho (Accounts, Contacts, Resources) with an admin UI for file upload, preview, and import execution. It includes safety tags, dry-run mode, bilingual field support, data cleaning, validation, and batch processing.
- **Bulletproof Form Submission System**: Local-first architecture ensuring form submissions are saved to PostgreSQL immediately and then asynchronously synced to Zoho CRM with exponential backoff and retry logic. It gracefully handles token expiration, network failures, and rate limits, with automatic token refresh before expiration.
- **Unified CAS & CANN Registration Form**: A single comprehensive form (`/join-cas`) with conditional logic, replacing all other registration forms. It includes automated email notifications (pending SMTP credentials) and extensive UI/UX enhancements like gradient sections, smooth transitions, and comprehensive mobile optimization and accessibility.

### Feature Specifications
- Homepage: Reordered sections with interactive map prominence.
- Amyloidosis Detail Pages: Simplified design, consistent branding, professional medical aesthetic.
- Events Integration: CAS Journal Club and CANN Educational Series with member notifications.
- Clinician-First Focus: Enhanced hero sections, restructured navigation (Clinical Tools, Research Hub, Professional Network), governance documents, and contributor portal.
- Contact & Footer: Professional contact system, comprehensive FAQ, and bilingual UX.
- About Pages: Redesigned for medical professionals ("About Amyloidosis") and clinical practice ("About CAS").
- Performance Optimization: `OptimizedImage` component with lazy loading, bundle optimization, and query optimization.
- Navigation: Enhanced design with prominent CAS logo as home link, mobile optimization, and fixed scroll behavior.
- Zoho CRM OAuth Setup: Detailed guide for setting up and troubleshooting Zoho CRM integration, including automatic token refresh and debug endpoints (see dedicated section below).

## Zoho CRM OAuth Setup Guide

### Prerequisites
1. **Zoho CRM Account**: Active Zoho CRM account (US datacenter: accounts.zoho.com)
2. **Environment Variables** (configured in Replit Secrets):
   - `ZOHO_CLIENT_ID`: OAuth client ID from Zoho API Console
   - `ZOHO_CLIENT_SECRET`: OAuth client secret from Zoho API Console
   - `ZOHO_ORG_ID`: Your Zoho CRM organization ID

### Initial Setup (One-Time Configuration)

#### Step 1: Register App in Zoho API Console
1. Visit **https://api-console.zoho.com** (US datacenter)
2. Click "Add Client ID" or "GET STARTED"
3. Select **"Server-based Applications"** as client type
4. Fill in the application details:
   - **Client Name**: "CAS Website"
   - **Homepage URL**: `https://amyloid.ca`
   - **Authorized Redirect URI**: `https://amyloid.ca/oauth/zoho/callback`
     - ⚠️ **Critical**: Must be **exactly** `https://amyloid.ca/oauth/zoho/callback` (case-sensitive, no trailing slash)
     - For development/testing, also add: `https://[your-replit-url]/oauth/zoho/callback`
5. Click "CREATE"
6. Navigate to the **"Client Secret"** tab
7. Copy your **Client ID** and **Client Secret**
8. Add them to Replit Secrets (never commit to version control)

#### Step 2: Authenticate the Application
1. **Important**: If you previously hit Zoho's rate limit (10 attempts per 10 minutes), wait 10-15 minutes before proceeding
2. Visit `https://amyloid.ca/oauth/zoho/connect` in your browser
3. You'll be automatically redirected to Zoho's authorization page
4. Review the requested permissions (CRM access, field management, email sending)
5. Click **"Accept"** to grant permissions
6. Zoho redirects you back to `/oauth/zoho/callback` with an authorization code
7. The system automatically performs these steps:
   - Exchanges the authorization code for access token + refresh token (code valid for 2 minutes only)
   - Deactivates any existing tokens for the provider (marks `is_active=false` in database)
   - Stores both new tokens in PostgreSQL `oauth_tokens` table with expiration timestamp
   - Caches tokens in memory for fast API request performance
   - Resets consecutive failure counter to zero
   - Starts the automatic token refresh health monitoring system (30-second intervals)

**Note:** Email notification workflow creation requires Zoho CRM Enterprise API access and is not available with standard OAuth. Configure workflows manually in Zoho CRM Settings → Automation → Workflow Rules.

#### Step 3: Verify Successful Authentication
After authentication, look for these confirmation messages in server logs:

```
[TokenManager] ✅ Token successfully stored and cached for zoho_crm
[TokenManager] 📊 Expires: [timestamp]
[TokenManager] Token management system initialized successfully
```

Then verify background sync starts working:
```
[Zoho Sync Worker] Found X pending submissions
[Zoho Sync Worker] ✅ Successfully synced submission #XX to Zoho CRM (ID: XXXXX)
```

### How Automatic Token Refresh Works

**Bulletproof Design Principles:**
1. **Proactive Refresh**: Tokens are refreshed **10 minutes before expiration** (not after they expire)
2. **Health Check System**: Runs every 30 seconds checking all token expiration statuses
3. **Intelligent Error Handling**:
   - **Permanent Errors** (invalid_grant, invalid_client, invalid_code, invalid_client_secret): Token marked inactive → requires manual re-authentication
   - **Temporary Errors** (network timeouts, rate limits, API downtime): Token stays active → system keeps retrying automatically
4. **Failure Monitoring**: After 5 consecutive refresh failures, system logs alert: `⚠️⚠️⚠️ ALERT: X consecutive refresh failures!`
5. **Zero Manual Intervention**: Once authenticated, runs 24/7 without human intervention unless permanent token revocation occurs

**Token Lifecycle:**
- **Access Token**: Expires in 1 hour → automatically refreshed every 50 minutes
- **Refresh Token**: Never expires (unless manually revoked in Zoho console)
- **Cache**: In-memory cache cleared on server restart → automatically reloaded from database

### Troubleshooting Common Errors

**❌ Error: "invalid_redirect_uri"**
- **Cause**: Redirect URI in authorization request doesn't match Zoho console configuration
- **Fix**: 
  1. Visit `/oauth/zoho/debug` to see what URI the system is generating
  2. Ensure Zoho console has **exactly** `https://amyloid.ca/oauth/zoho/callback`
  3. Check for mismatches: `https` vs `http`, `www.amyloid.ca` vs `amyloid.ca`, trailing slash

**❌ Error: "invalid_code" or "invalid_grant"**
- **Cause**: Authorization code expired (2-minute limit) or already used (single-use only)
- **Fix**: Visit `/oauth/zoho/connect` again to generate fresh authorization code

**❌ Error: "throttles_limit_exceeded"**
- **Cause**: Exceeded Zoho's 10 authorization attempts per 10 minutes per client ID
- **Fix**: Wait 10-15 minutes for rate limit to reset, then retry

**❌ Tokens not refreshing automatically**
- **Check server logs** for `[TokenManager]` messages showing refresh attempts and results
- **Verify active token exists** in database:
  ```sql
  SELECT id, provider, expires_at, is_active, refresh_token IS NOT NULL as has_refresh
  FROM oauth_tokens 
  WHERE provider='zoho_crm' AND is_active=true;
  ```
- **Solution**: If no active token with `refresh_token`, re-authenticate at `/oauth/zoho/connect`

**❌ Form submissions not syncing to Zoho**
- **Check sync worker logs**: Look for `[Zoho Sync Worker]` messages in server logs
- **Verify pending submissions**:
  ```sql
  SELECT id, created_at, zoho_synced, zoho_crm_id, retry_count 
  FROM form_submissions 
  WHERE zoho_synced=false 
  ORDER BY created_at DESC;
  ```
- **Common causes**:
  - No valid OAuth token (re-authenticate)
  - Zoho API rate limits (system auto-retries with exponential backoff)
  - Network connectivity issues (system auto-retries)

### OAuth Debug Endpoints

**`/oauth/zoho/debug`** - Shows OAuth configuration
- Displays: Generated authorization URL, redirect URI, client ID, scopes (`ZohoCRM.modules.ALL,ZohoCRM.settings.ALL`)
- Shows: Production mode status, base URL detected
- Use: Verify redirect URI matches Zoho console before authenticating

**`/oauth/zoho/connect`** - Initiates OAuth flow
- Action: Redirects to Zoho authorization page
- Use: Start authentication or re-authenticate after token expiration
- Note: Automatically detects production vs development URL

**`/oauth/zoho/callback`** - OAuth callback endpoint
- Action: Receives authorization code from Zoho, exchanges for tokens, stores in database
- Use: Don't visit directly - Zoho redirects here automatically
- Response: HTML page showing success or error with details

### Security & Best Practices

✅ **Secrets Management**
- Store `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_ORG_ID` in Replit Secrets (encrypted)
- Never commit secrets to version control
- Refresh tokens stored in PostgreSQL (database-level encryption)

✅ **Token Storage**
- Access tokens cached in memory for performance (cleared on restart)
- Refresh tokens persisted in database `oauth_tokens` table
- Old tokens deactivated (`is_active=false`) when new tokens stored

✅ **Automatic Recovery**
- Health check system runs every 30 seconds
- Temporary failures don't break the system - it keeps retrying
- Logs provide full audit trail of all refresh attempts

✅ **Production Monitoring**
- Monitor server logs for `[TokenManager]` messages
- Alert on consecutive failure warnings: `⚠️⚠️⚠️ ALERT: X consecutive refresh failures`
- Verify background sync worker is processing submissions: `[Zoho Sync Worker]` messages

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Framer Motion**: Animation library for React.
- **Lucide React**: Icon library.

### Data Management
- **TanStack Query**: Server state management and caching.
- **React Hook Form**: Form state management with validation.
- **Zod**: Schema validation for forms and API.

### Database and Backend
- **Neon Database**: Serverless PostgreSQL hosting.
- **Drizzle ORM**: Type-safe database operations.
- **Express.js**: Web application framework for Node.js.
- **Connect-pg-simple**: PostgreSQL session store for session management.

### Integrations
- **Zoho CRM**: For lead capture, data management, and bulk imports.