# CAS/CANN Website - Technical Architecture Document

**Version:** 1.0  
**Date:** January 2025  
**Website:** amyloid.ca (Production) | Replit (Staging)

---

## Executive Summary

The Canadian Amyloidosis Society (CAS) website is a full-stack web application that serves as the primary digital platform for patient education, healthcare professional networking, and member registration. The system integrates with Zoho CRM for lead management and member data synchronization.

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CAS/CANN SYSTEM ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   END USERS     │
                              │ (Patients, HCPs,│
                              │   Caregivers)   │
                              └────────┬────────┘
                                       │ HTTPS
                                       ▼
              ┌────────────────────────────────────────────────┐
              │              CLOUDFLARE / DNS                   │
              │         (SSL/TLS, DDoS Protection)              │
              └────────────────────────┬───────────────────────┘
                                       │
           ┌───────────────────────────┴───────────────────────┐
           │                                                   │
           ▼                                                   ▼
┌─────────────────────┐                           ┌─────────────────────┐
│   REPLIT STAGING    │                           │  AWS ECS PRODUCTION │
│   (Development)     │                           │    (amyloid.ca)     │
│                     │                           │                     │
│ VITE_ENVIRONMENT=   │                           │ VITE_ENVIRONMENT=   │
│     staging         │                           │    production       │
│                     │                           │                     │
│ Features:           │                           │ Features:           │
│ • Full nav dropdown │                           │ • Simplified nav    │
│ • Interactive map   │                           │ • No map section    │
│ • Resource upload   │                           │ • Partnerships only │
└──────────┬──────────┘                           └──────────┬──────────┘
           │                                                 │
           └─────────────────────┬───────────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │    EXPRESS.JS SERVER    │
                    │      (Node.js 20)       │
                    │                         │
                    │ • RESTful API Routes    │
                    │ • Form Validation       │
                    │ • Session Management    │
                    │ • Static File Serving   │
                    └────────────┬────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐     ┌───────────────────┐     ┌───────────────────┐
│   REACT 18    │     │   ZOHO SYNC       │     │   POSTGRESQL      │
│   FRONTEND    │     │   WORKER          │     │   (Neon Cloud)    │
│               │     │                   │     │                   │
│ • TypeScript  │     │ • Background sync │     │ • Form submissions│
│ • Tailwind    │     │ • Auto retry      │     │ • Event regs      │
│ • Framer      │     │ • Token refresh   │     │ • OAuth tokens    │
│ • TanStack    │     │ • Error handling  │     │ • Submission logs │
└───────────────┘     └─────────┬─────────┘     └───────────────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │      ZOHO CRM           │
                    │    (External API)       │
                    │                         │
                    │ • OAuth 2.0 Auth        │
                    │ • Leads Module          │
                    │ • 241 Records           │
                    │ • Custom Fields         │
                    └─────────────────────────┘
```

---

## 2. Technology Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 18.x |
| TypeScript | Type Safety | 5.x |
| Vite | Build Tool | 5.x |
| Tailwind CSS | Styling | 3.x |
| shadcn/ui | UI Components | Latest |
| Radix UI | Accessible Primitives | Latest |
| Framer Motion | Animations | Latest |
| Wouter | Routing | Latest |
| TanStack Query | Server State | v5 |
| React Hook Form | Form Management | Latest |
| Zod | Schema Validation | Latest |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime | 20.x |
| Express.js | Web Framework | 4.x |
| Drizzle ORM | Database ORM | Latest |
| PostgreSQL | Database | 15.x |
| Neon | Serverless DB Hosting | Cloud |

### Infrastructure
| Component | Service | Purpose |
|-----------|---------|---------|
| Staging | Replit | Development & Testing |
| Production | AWS ECS | Live Website |
| Container Registry | AWS ECR | Docker Images |
| CI/CD | GitHub Actions | Automated Deployment |
| DNS/SSL | Cloudflare | Domain & Security |

### Integrations
| Service | Purpose | API Version |
|---------|---------|-------------|
| Zoho CRM | Lead Management | v8 |
| OAuth 2.0 | Authentication | Standard |

---

## 3. Database Schema

### Core Tables

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐     ┌─────────────────────────┐
│    form_submissions     │     │    submission_logs      │
├─────────────────────────┤     ├─────────────────────────┤
│ id (PK)                 │────►│ id (PK)                 │
│ form_name               │     │ submission_id (FK)      │
│ submission_data (JSON)  │     │ operation               │
│ source_form             │     │ status                  │
│ zoho_module             │     │ details (JSON)          │
│ zoho_crm_id             │     │ created_at              │
│ processing_status       │     └─────────────────────────┘
│ retry_count             │
│ last_retry_at           │
│ created_at              │
│ updated_at              │
└─────────────────────────┘

┌─────────────────────────┐     ┌─────────────────────────┐
│    oauth_tokens         │     │   townhall_registrations│
├─────────────────────────┤     ├─────────────────────────┤
│ id (PK)                 │     │ id (PK)                 │
│ service_name            │     │ first_name              │
│ access_token            │     │ last_name               │
│ refresh_token           │     │ email                   │
│ token_type              │     │ institution             │
│ expires_at              │     │ is_cann_member          │
│ created_at              │     │ created_at              │
│ updated_at              │     └─────────────────────────┘
└─────────────────────────┘

┌─────────────────────────┐     ┌─────────────────────────┐
│    resources            │     │   field_metadata_cache  │
├─────────────────────────┤     ├─────────────────────────┤
│ id (PK)                 │     │ id (PK)                 │
│ title                   │     │ module_name             │
│ description             │     │ field_name              │
│ resource_type           │     │ field_metadata (JSON)   │
│ file_url                │     │ cached_at               │
│ submitted_by            │     │ expires_at              │
│ status                  │     └─────────────────────────┘
│ created_at              │
└─────────────────────────┘
```

---

## 4. Zoho CRM Integration

### Data Flow: Form Submission → Zoho CRM

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FORM SUBMISSION DATA FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

  USER                    WEBSITE                  DATABASE              ZOHO CRM
   │                         │                        │                     │
   │  1. Submit Form         │                        │                     │
   │ ───────────────────────►│                        │                     │
   │                         │                        │                     │
   │                         │  2. Validate & Save    │                     │
   │                         │ ──────────────────────►│                     │
   │                         │                        │                     │
   │  3. Success Response    │                        │                     │
   │ ◄───────────────────────│                        │                     │
   │   (Immediate - no       │                        │                     │
   │    Zoho dependency)     │                        │                     │
   │                         │                        │                     │
   │                         │        BACKGROUND WORKER                     │
   │                         │        ═══════════════════════════           │
   │                         │                        │                     │
   │                         │  4. Check for pending  │                     │
   │                         │ ◄──────────────────────│                     │
   │                         │     submissions        │                     │
   │                         │                        │                     │
   │                         │  5. Refresh OAuth      │                     │
   │                         │ ─────────────────────────────────────────────►
   │                         │                        │                     │
   │                         │  6. Create Lead        │                     │
   │                         │ ─────────────────────────────────────────────►
   │                         │                        │                     │
   │                         │  7. Update status      │                     │
   │                         │ ──────────────────────►│                     │
   │                         │   (synced + zoho_id)   │                     │
```

### Field Mapping: Form → Zoho CRM

| Form Field | Zoho Standard Field | Zoho Custom Field | Notes |
|------------|---------------------|-------------------|-------|
| fullName | Last_Name | - | Zoho requires Last_Name |
| email | Email | - | Primary identifier |
| discipline | Professional_Designation | discipline | Mapped to both |
| subspecialty | - | subspecialty | Max 50 chars |
| institution | Company | Institution_Name, institution | Mapped to 3 fields |
| institutionAddress | - | institutionaddress | Max 50 chars |
| institutionPhone | Phone | - | Extensions stripped |
| province | State | - | Canadian province |
| amyloidosisType | - | Amyloidosis_Type, amyloidosistype | Mapped to both |
| wantsMembership | - | CAS_Registration | Boolean → "Yes"/"No" |
| wantsCANNMembership | - | CANN_Registration | Boolean → "Yes"/"No" |
| wantsCommunications | - | Marketing_Emails | Boolean → "Yes"/"No" |

### Lead Source Attribution

| Form Source | Lead_Source Value | Layout |
|-------------|-------------------|--------|
| Website - Join CAS/CANN | Website - CAS & CANN Registration | CAS and CANN |
| Excel Import (2025) | Excel Import - CAS Registration (2025) | CAS and CANN |
| Excel Import (Historical) | Excel Import - CAS Registration (Historical) | CAS and CANN |
| Excel Import (French) | Excel Import - CAS Registration (French 2025) | CAS and CANN |
| Excel Import (PANN) | Excel Import - PANN Membership (Historical) | CAS and CANN |

### OAuth Token Management

```
┌─────────────────────────────────────────────────────────────────┐
│                    ZOHO OAUTH FLOW                               │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Website    │      │  Token DB    │      │  Zoho API    │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                     │
       │ 1. Check token      │                     │
       │ ───────────────────►│                     │
       │                     │                     │
       │ 2. Token expired?   │                     │
       │ ◄───────────────────│                     │
       │                     │                     │
       │ 3. Refresh token    │                     │
       │ ────────────────────────────────────────►│
       │                     │                     │
       │ 4. New access token │                     │
       │ ◄────────────────────────────────────────│
       │                     │                     │
       │ 5. Store new token  │                     │
       │ ───────────────────►│                     │
       │                     │                     │
       │ 6. Make API call    │                     │
       │ ────────────────────────────────────────►│
```

---

## 5. Zoho Sync Worker (Background Processing)

### Bulletproof Sync Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYNC WORKER ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────┐
                    │     ZOHO SYNC WORKER        │
                    │   (Background Service)      │
                    ├─────────────────────────────┤
                    │ • Runs every 30 seconds     │
                    │ • Processes pending records │
                    │ • Auto-retry on failure     │
                    │ • Exponential backoff       │
                    │ • Max 5 retries             │
                    └─────────────┬───────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │  Token Manager  │ │   CRM Service   │ │  Error Handler  │
    ├─────────────────┤ ├─────────────────┤ ├─────────────────┤
    │ • Auto refresh  │ │ • Create leads  │ │ • Log failures  │
    │ • Token caching │ │ • Field mapping │ │ • Retry logic   │
    │ • Expiry check  │ │ • Validation    │ │ • Notifications │
    └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Processing States

| Status | Description | Action |
|--------|-------------|--------|
| pending | New submission, not yet synced | Worker picks up |
| processing | Currently being processed | Wait for completion |
| completed | Successfully synced to Zoho | Done - zoho_crm_id populated |
| failed | Sync failed, will retry | Retry with backoff |
| permanently_failed | Max retries exceeded | Manual intervention |

---

## 6. API Endpoints

### Public Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/cas-cann-registration` | Submit CAS/CANN registration form |
| POST | `/api/townhall-registration` | Submit event registration |
| GET | `/health` | Health check for load balancers |

### Admin Endpoints (Protected)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/admin/zoho-crm-analysis` | CRM data summary | API Key |
| POST | `/api/admin/zoho-delete-test-records` | Delete test records | API Key |
| POST | `/api/admin/zoho-deduplicate` | Remove duplicates | API Key |
| POST | `/api/admin/resync-orphaned-records` | Re-sync failed records | API Key |
| GET | `/api/admin/event-registrations` | Event registration list | Password |

---

## 7. Deployment Pipeline

### CI/CD Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PIPELINE                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Developer  │    │   GitHub     │    │   AWS ECR    │    │   AWS ECS    │
│   (Replit)   │    │   Actions    │    │   Registry   │    │   Cluster    │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │                   │
       │ 1. git push main  │                   │                   │
       │ ─────────────────►│                   │                   │
       │                   │                   │                   │
       │                   │ 2. Build Docker   │                   │
       │                   │    (VITE_ENV=prod)│                   │
       │                   │ ─────────────────►│                   │
       │                   │                   │                   │
       │                   │ 3. Push image     │                   │
       │                   │ ─────────────────►│                   │
       │                   │                   │                   │
       │                   │ 4. Deploy service │                   │
       │                   │ ─────────────────────────────────────►│
       │                   │                   │                   │
       │                   │ 5. Health check   │                   │
       │                   │ ◄─────────────────────────────────────│
       │                   │                   │                   │
       │ 6. Deployment     │                   │                   │
       │    complete       │                   │                   │
       │ ◄─────────────────│                   │                   │
```

### Environment Configuration

| Environment | Platform | Domain | Build Arg |
|-------------|----------|--------|-----------|
| Staging | Replit | *.repl.co | VITE_ENVIRONMENT=staging |
| Production | AWS ECS | amyloid.ca | VITE_ENVIRONMENT=production |

---

## 8. Data Summary

### Current Zoho CRM Records: 241

| Source | Count | Description |
|--------|-------|-------------|
| Excel Import - Re-synced | 60 | Migrated records |
| Excel Import - CAS Registration (Historical) | 54 | Legacy data |
| Excel Import - CAS Registration (2025) | 50 | Current year |
| Website - CAS Registration | 24 | Web form submissions |
| Excel Import - CAS Registration (French 2025) | 21 | French registrations |
| Website - CAS & CANN Registration | 15 | Combined form |
| Excel Import - PANN Membership (Historical) | 10 | Legacy PANN |
| Website - Join CAS Today (Historical) | 5 | Old form |
| CAS & CANN Registration | 1 | Direct entry |
| Website - CANN Membership | 1 | CANN only |

---

## 9. Security Features

### Authentication & Authorization

| Feature | Implementation |
|---------|----------------|
| Zoho OAuth | OAuth 2.0 with auto-refresh |
| Admin API | API Key header authentication |
| Event Admin | Username/Password protection |
| Session | PostgreSQL session store |

### Data Protection

| Measure | Description |
|---------|-------------|
| HTTPS | All traffic encrypted via Cloudflare |
| Environment Variables | Secrets stored in environment, not code |
| Input Validation | Zod schemas for all form inputs |
| SQL Injection | Drizzle ORM parameterized queries |
| XSS Protection | React DOM escaping |

---

## 10. Capabilities Summary

### Current Features

| Capability | Status | Description |
|------------|--------|-------------|
| Member Registration | ✅ Live | CAS & CANN combined form |
| Zoho CRM Sync | ✅ Live | Real-time background sync |
| Event Registration | ✅ Live | CANN Townhall events |
| Healthcare Directory | ✅ Staging | Interactive map (25+ facilities) |
| Resource Upload | ✅ Staging | Clinician resource sharing |
| Bilingual Support | ✅ Live | English/French translations |
| OAuth Token Management | ✅ Live | Auto-refresh, no manual intervention |
| Bulk Data Import | ✅ Complete | Excel → Zoho migration done |

### Planned Features

| Capability | Status | Description |
|------------|--------|-------------|
| Email Notifications | 🔄 Pending | SMTP credentials needed |
| Resource Moderation | ✅ Staging | Ready for production |
| Healthcare Directory | 🔄 Pending | Awaiting production approval |

---

## 11. Support & Maintenance

### Key Files (Protected)

| File | Purpose | DO NOT MODIFY |
|------|---------|---------------|
| `Dockerfile` | Production build | ⚠️ Protected |
| `.github/workflows/deploy.yml` | CI/CD pipeline | ⚠️ Protected |
| `server/index.prod.ts` | Production server | ⚠️ Protected |

### Environment-Based Feature Control

To show/hide features between staging and production:

```typescript
import { isStaging, isProduction } from "@/hooks/useEnvironment";

// Show only in staging
{isStaging() && <NewFeature />}

// Show only in production  
{isProduction() && <ProductionFeature />}
```

---

**Document prepared for:** CAS/CANN Technical Review  
**Last updated:** January 2025  
**Contact:** Project Lead
