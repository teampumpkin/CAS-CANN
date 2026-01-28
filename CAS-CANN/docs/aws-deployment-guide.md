# CAS Website - Complete Architecture & AWS Deployment Guide

## Table of Contents
1. [Current Architecture Overview](#current-architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Application Components](#application-components)
4. [Data Flow](#data-flow)
5. [AWS Deployment Architecture](#aws-deployment-architecture)
6. [Deployment Process](#deployment-process)
7. [GitHub Bridge Deployment (Recommended)](#github-bridge-deployment-recommended)
8. [Environment Configuration](#environment-configuration)
9. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Current Architecture Overview

The Canadian Amyloidosis Society (CAS) website is a full-stack web application that serves as a platform for:
- Healthcare professional registration (CAS & CANN membership)
- Educational resources and events
- Healthcare facility directory with interactive map
- Zoho CRM integration for lead management

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                    │
│                         (Desktop / Mobile)                                   │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │ HTTPS (Port 5000)
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EXPRESS.JS SERVER                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         FRONTEND (React + Vite)                      │   │
│  │  • Single Page Application                                           │   │
│  │  • Tailwind CSS + shadcn/ui components                              │   │
│  │  • Wouter for client-side routing                                   │   │
│  │  • TanStack Query for data fetching                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│  ┌─────────────────────────────────▼───────────────────────────────────┐   │
│  │                         BACKEND API (/api/*)                         │   │
│  │  • RESTful endpoints for forms, resources, events                   │   │
│  │  • Session management (connect-pg-simple)                           │   │
│  │  • Form validation with Zod schemas                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│  ┌─────────────────────────────────▼───────────────────────────────────┐   │
│  │                      BACKGROUND WORKERS                              │   │
│  │  • TokenManager: OAuth token refresh (Zoho)                         │   │
│  │  • ZohoSyncWorker: Async form submission sync                       │   │
│  │  • FieldMetadataCache: CRM field caching                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  NEON POSTGRES  │    │   ZOHO CRM API  │    │  FILE STORAGE   │
│   (Database)    │    │   (External)    │    │  (Local/Assets) │
│                 │    │                 │    │                 │
│ • form_submissions│  │ • Leads module  │    │ • Uploaded docs │
│ • oauth_tokens  │    │ • Accounts      │    │ • Stock images  │
│ • resources     │    │ • Custom fields │    │ • PDF resources │
│ • event_registrations│ OAuth v2 auth  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | UI component library |
| Radix UI | Accessible primitives |
| Wouter | Client-side routing |
| TanStack Query | Server state management |
| Framer Motion | Animations |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| TypeScript | Type safety |
| Drizzle ORM | Database queries |
| Zod | Schema validation |
| Passport | Authentication |
| express-session | Session management |

### Database
| Technology | Purpose |
|------------|---------|
| PostgreSQL | Primary database |
| Neon | Serverless Postgres hosting |
| Drizzle Kit | Schema migrations |

### External Integrations
| Service | Purpose |
|---------|---------|
| Zoho CRM | Lead management, contact storage |
| Nodemailer | Email notifications (pending SMTP) |

---

## Application Components

### 1. Frontend Pages

```
/                           → Homepage with interactive map
/about-amyloidosis          → Disease information
/about-cas                  → Organization information
/join-cas                   → Unified registration form
/cann                       → CANN network page
/events                     → Events listing
/events/cann-townhall/register → Event registration
/clinical-tools             → Resources for clinicians
/upload-resource            → Resource submission portal
/admin/resources/moderation → Resource moderation (admin)
/eventsdownload             → Event registrations export (admin)
```

### 2. API Endpoints

```
POST /api/form-submissions              → Submit any form
GET  /api/form-configs                  → Get form configurations
GET  /api/form-configs/:formName        → Get specific form config

POST /api/event-registrations           → Register for event
GET  /api/event-registrations           → List registrations (admin)

POST /api/resources                     → Submit resource
GET  /api/resources                     → List resources
PATCH /api/resources/:id/status         → Approve/reject resource

GET  /api/health                        → Health check
GET  /api/ping                          → Simple ping
```

### 3. Background Services

**TokenManager** (server/token-manager.ts)
- Manages OAuth tokens for Zoho CRM
- Auto-refreshes tokens before expiry
- Health monitoring every 3.3 minutes

**ZohoSyncWorker** (server/zoho-sync-worker.ts)
- Polls for pending form submissions every 10 seconds
- Syncs to Zoho CRM with retry logic
- Exponential backoff on failures

**FieldMetadataCache** (server/field-metadata-cache-service.ts)
- Caches Zoho CRM field definitions
- Daily sync to keep field mappings current

---

## Data Flow

### Form Submission Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  User    │───▶│  React   │───▶│ Express  │───▶│ Postgres │───▶│  Zoho    │
│  Browser │    │  Form    │    │  API     │    │  (save)  │    │  CRM     │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
                                      │                              ▲
                                      │         Background           │
                                      └──────────Worker──────────────┘
                                              (async sync)
```

1. **User submits form** → React form with validation
2. **API receives data** → Express validates with Zod
3. **Save to PostgreSQL** → Immediate local storage (bulletproof)
4. **Return success** → User sees confirmation
5. **Background sync** → Worker syncs to Zoho CRM asynchronously
6. **Retry on failure** → Exponential backoff ensures delivery

### Zoho CRM Data Structure

**Leads Module (249 records)**
```
Lead_Source options:
├── Excel Import - CAS Registration (Historical)     [63]
├── Website - CAS Registration                       [62]
├── Excel Import - CAS Registration (2025)           [54]
├── Excel Import - CAS Registration (French 2025)    [21]
├── Excel Import - PANN Membership (Historical)      [21]
├── Website - CAS & CANN Registration                [17]
├── Website - PANN Membership                        [5]
├── Website - Join CAS Today (Historical)            [5]
└── Website - CANN Membership                        [1]

Key Fields:
├── Professional_Designation (text)
├── Institution_Name (text)
├── Sub_Specialty (text)
├── CAS_Member (boolean)
├── PANN_Member (boolean)
├── CAS_Communications (picklist: Yes/No)
└── Services_Map_Inclusion (picklist: Yes/No)
```

**Accounts Module (101 records)**
- Healthcare centers across Canada
- Used for Services Map display

---

## AWS Deployment Architecture

### Target AWS Infrastructure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INTERNET                                        │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                         ┌────────▼────────┐
                         │    Route 53     │  DNS: amyloid.ca
                         │   (DNS Zone)    │  *.amyloid.ca
                         └────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │  ACM Certificate│  SSL/TLS termination
                         │   (SSL/HTTPS)   │  Auto-renewal
                         └────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │  Application    │  Port 443 (HTTPS)
                         │  Load Balancer  │  Health: /health
                         └────────┬────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  ECS Task 1     │    │  ECS Task 2     │    │  ECS Task N     │
│  (Container)    │    │  (Container)    │    │  (Container)    │
│                 │    │                 │    │                 │
│  Port 5000      │    │  Port 5000      │    │  Port 5000      │
└────────┬────────┘    └────────┬────────┘    └────────┬────────┘
         │                      │                      │
         └──────────────────────┼──────────────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
     ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
     │    Neon     │   │   Secrets   │   │  CloudWatch │
     │  PostgreSQL │   │   Manager   │   │    Logs     │
     │ (External)  │   │  (ENV vars) │   │ (Monitoring)│
     └─────────────┘   └─────────────┘   └─────────────┘
```

### AWS Services Required

| Service | Purpose | Estimated Cost |
|---------|---------|----------------|
| **ECR** | Docker image registry | ~$0.10/GB/month |
| **ECS Fargate** | Container hosting | ~$30-50/month (1 vCPU, 2GB) |
| **Application Load Balancer** | Traffic distribution | ~$20/month + data |
| **Route 53** | DNS hosting | ~$0.50/month |
| **ACM** | SSL certificates | Free |
| **Secrets Manager** | Secure credentials | ~$0.40/secret/month |
| **CloudWatch** | Logging & monitoring | ~$5-10/month |
| **VPC** | Network isolation | Free |

**Estimated Total: ~$60-100/month** (depending on traffic)

---

## Deployment Process

### "Republish" Workflow

```
┌───────────────────────────────────────────────────────────────────────────┐
│                          REPLIT (Development)                              │
│                                                                            │
│  1. Developer makes changes                                                │
│  2. Tests locally on Replit                                               │
│  3. Clicks "Republish" button                                             │
└─────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                          BUILD PHASE                                       │
│                                                                            │
│  1. npm run build (Vite frontend)                                         │
│  2. esbuild (Bundle server)                                               │
│  3. docker build (Create image)                                           │
│  4. docker push (Upload to ECR)                                           │
└─────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                          DEPLOY PHASE                                      │
│                                                                            │
│  1. aws ecs update-service --force-new-deployment                         │
│  2. ECS pulls new image from ECR                                          │
│  3. Rolling deployment (zero downtime)                                    │
│  4. Old containers drain, new containers start                            │
│  5. Health checks pass → traffic shifts                                   │
└───────────────────────────────────────────────────────────────────────────┘
```

### Dockerfile (Multi-stage Build)

```dockerfile
# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Build backend
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY --from=frontend-builder /app/dist ./dist
COPY server ./server
COPY shared ./shared
RUN npx esbuild server/index.ts --bundle --platform=node --outfile=dist/server.js

# Stage 3: Production runtime
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/node_modules ./node_modules
COPY package.json ./

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -q --spider http://localhost:5000/health || exit 1

CMD ["node", "dist/server.js"]
```

### ECS Task Definition

```json
{
  "family": "cas-website",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [
    {
      "name": "cas-app",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/cas-website:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "PORT", "value": "5000"}
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:cas/database-url"
        },
        {
          "name": "ZOHO_CLIENT_ID",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:cas/zoho-client-id"
        },
        {
          "name": "ZOHO_CLIENT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:cas/zoho-client-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/cas-website",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "wget -q --spider http://localhost:5000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

### Republish Script (scripts/deploy-aws.sh)

```bash
#!/bin/bash
set -e

# Configuration
AWS_REGION="us-east-1"
ECR_REPOSITORY="cas-website"
ECS_CLUSTER="cas-production"
ECS_SERVICE="cas-website-service"
AWS_ACCOUNT_ID="123456789012"

echo "🚀 Starting AWS deployment..."

# Step 1: Build frontend
echo "📦 Building frontend..."
npm run build

# Step 2: Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Step 3: Build Docker image
echo "🐳 Building Docker image..."
docker build -t $ECR_REPOSITORY:latest .
docker tag $ECR_REPOSITORY:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest

# Step 4: Push to ECR
echo "⬆️  Pushing to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest

# Step 5: Update ECS service
echo "🔄 Updating ECS service..."
aws ecs update-service \
  --cluster $ECS_CLUSTER \
  --service $ECS_SERVICE \
  --force-new-deployment \
  --region $AWS_REGION

echo "✅ Deployment initiated! Monitor progress in AWS Console."
echo "🔗 https://console.aws.amazon.com/ecs/home?region=$AWS_REGION#/clusters/$ECS_CLUSTER/services/$ECS_SERVICE/deployments"
```

---

## GitHub Bridge Deployment (Recommended)

Using GitHub as a bridge between Replit and AWS provides version control, automated deployments, and easier collaboration. This is the **recommended approach** for production deployments.

### GitHub Bridge Architecture

```
┌───────────────────────────────────────────────────────────────────────────┐
│                          REPLIT (Development)                              │
│                                                                            │
│  1. Developer makes changes                                                │
│  2. Tests locally on Replit                                               │
│  3. Commits and pushes to GitHub                                          │
└─────────────────────────────────┬─────────────────────────────────────────┘
                                  │ git push
                                  ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                           GITHUB REPOSITORY                                │
│                                                                            │
│  • Version control & history                                              │
│  • Branch protection rules                                                │
│  • Pull request reviews                                                   │
│  • Triggers GitHub Actions on push                                        │
└─────────────────────────────────┬─────────────────────────────────────────┘
                                  │ GitHub Actions (automatic)
                                  ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         GITHUB ACTIONS WORKFLOW                            │
│                                                                            │
│  1. Checkout code                                                         │
│  2. Build frontend (npm run build)                                        │
│  3. Build Docker image                                                    │
│  4. Push to AWS ECR                                                       │
│  5. Deploy to ECS (rolling update)                                        │
└─────────────────────────────────┬─────────────────────────────────────────┘
                                  │
                                  ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                              AWS ECS                                       │
│                                                                            │
│  • Pulls new image from ECR                                               │
│  • Rolling deployment (zero downtime)                                     │
│  • Health checks pass → traffic shifts                                    │
└───────────────────────────────────────────────────────────────────────────┘
```

### Benefits of GitHub Bridge

| Feature | Direct Deploy | GitHub Bridge |
|---------|---------------|---------------|
| Version History | Manual tags | Full git history |
| Rollback | Re-deploy old image | `git revert` + auto-deploy |
| Code Review | None | Pull requests |
| Audit Trail | CloudWatch only | Git commits + Actions logs |
| Team Collaboration | Share AWS creds | GitHub permissions |
| Automation | Manual script | Fully automatic |

### Step 1: Connect Replit to GitHub

1. In Replit, click **Git** in the sidebar (branch icon)
2. Click **Connect to GitHub**
3. Authorize Replit to access your GitHub account
4. Create a new repository: `cas-website`
5. Push your code: `git push -u origin main`

### Step 2: Set Up GitHub Repository Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

| Secret Name | Description | How to Get It |
|-------------|-------------|---------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key | AWS Console → IAM → Users → Security credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key | Generated with access key |
| `AWS_REGION` | AWS region (e.g., `us-east-1`) | Your chosen region |
| `AWS_ACCOUNT_ID` | 12-digit AWS account ID | AWS Console → top right menu |
| `ECR_REPOSITORY` | ECR repo name (`cas-website`) | From ECR setup |
| `ECS_CLUSTER` | ECS cluster name (`cas-production`) | From ECS setup |
| `ECS_SERVICE` | ECS service name (`cas-website-service`) | From ECS setup |

### Step 3: Create GitHub Actions Workflow

Create the file `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to AWS ECS

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  AWS_REGION: ${{ secrets.AWS_REGION }}
  ECR_REPOSITORY: ${{ secrets.ECR_REPOSITORY }}
  ECS_CLUSTER: ${{ secrets.ECS_CLUSTER }}
  ECS_SERVICE: ${{ secrets.ECS_SERVICE }}

jobs:
  deploy:
    name: Build and Deploy
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, tag, and push Docker image
        id: build-image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:latest .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
          echo "image=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster $ECS_CLUSTER \
            --service $ECS_SERVICE \
            --force-new-deployment

      - name: Wait for deployment
        run: |
          echo "Waiting for ECS deployment to stabilize..."
          aws ecs wait services-stable \
            --cluster $ECS_CLUSTER \
            --services $ECS_SERVICE
          echo "Deployment complete!"

      - name: Deployment Summary
        run: |
          echo "## Deployment Summary" >> $GITHUB_STEP_SUMMARY
          echo "- **Image:** ${{ steps.build-image.outputs.image }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Cluster:** $ECS_CLUSTER" >> $GITHUB_STEP_SUMMARY
          echo "- **Service:** $ECS_SERVICE" >> $GITHUB_STEP_SUMMARY
          echo "- **Status:** Deployed successfully" >> $GITHUB_STEP_SUMMARY
```

### Step 4: Deployment Workflow

After setup, deployments are fully automatic:

```
Developer Experience:

1. Make changes in Replit
2. Test locally (workflow running)
3. Commit changes:
   $ git add .
   $ git commit -m "Add new feature"
   $ git push

4. GitHub Actions automatically:
   → Builds Docker image
   → Pushes to ECR
   → Deploys to ECS
   → Verifies health

5. Done! Live in ~5-10 minutes
```

### Optional: Branch Protection

For team safety, add branch protection rules:

1. Go to **Settings** → **Branches** → **Add rule**
2. Branch name pattern: `main`
3. Enable:
   - Require pull request before merging
   - Require status checks to pass
   - Require branches to be up to date

This ensures all changes go through code review before deploying.

### Optional: Staging Environment

Add a staging environment that deploys from `develop` branch:

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches:
      - develop

env:
  AWS_REGION: ${{ secrets.AWS_REGION }}
  ECR_REPOSITORY: ${{ secrets.ECR_REPOSITORY }}
  ECS_CLUSTER: cas-staging  # Different cluster
  ECS_SERVICE: cas-website-staging

jobs:
  deploy:
    # Same steps as production...
```

### Rollback via GitHub

To rollback to a previous version:

```bash
# Option 1: Revert the bad commit
git revert HEAD
git push
# → Automatic re-deploy with previous code

# Option 2: Deploy specific commit
# Go to Actions → Run workflow → Select branch/tag

# Option 3: AWS Console
# ECS → Service → Update → Select previous task definition
```

### Comparison: Deployment Methods

| Method | When to Use | Complexity |
|--------|-------------|------------|
| **GitHub Actions (Recommended)** | Production deployments | Medium (one-time setup) |
| **Manual Script** | Testing, emergency fixes | Low |
| **Terraform + GitHub** | Full infrastructure as code | High |

---

## Environment Configuration

### Required Secrets (AWS Secrets Manager)

| Secret Name | Description |
|-------------|-------------|
| `cas/database-url` | PostgreSQL connection string |
| `cas/zoho-client-id` | Zoho CRM OAuth client ID |
| `cas/zoho-client-secret` | Zoho CRM OAuth client secret |
| `cas/zoho-refresh-token` | Zoho CRM refresh token |
| `cas/session-secret` | Express session secret |
| `cas/event-admin-password` | Event admin dashboard password |

### Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Runtime environment |
| `PORT` | `5000` | Server port |
| `REPLIT_DEPLOYMENT` | `1` | Signals production mode |

### Current Secrets (from Replit)

These need to be migrated to AWS Secrets Manager:

```
DATABASE_URL          → cas/database-url
ZOHO_CLIENT_ID        → cas/zoho-client-id
ZOHO_CLIENT_SECRET    → cas/zoho-client-secret
SESSION_SECRET        → cas/session-secret
EVENT_ADMIN_USERNAME  → cas/event-admin-username
EVENT_ADMIN_PASSWORD  → cas/event-admin-password
```

---

## Monitoring & Maintenance

### Health Endpoints

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `GET /health` | Full health check | JSON with DB, Zoho status |
| `GET /ping` | Simple ping | `"pong"` |

### CloudWatch Alarms (Recommended)

| Alarm | Threshold | Action |
|-------|-----------|--------|
| High CPU | >80% for 5 min | Scale up / Alert |
| Memory Usage | >85% | Alert |
| 5xx Errors | >10/min | Alert |
| Health Check Failures | >3 consecutive | Replace container |
| Response Time | >2s avg | Alert |

### Log Groups

```
/ecs/cas-website           → Application logs
/ecs/cas-website/access    → HTTP access logs
/aws/alb/cas-website       → Load balancer logs
```

### Backup Strategy

| Component | Strategy | Frequency |
|-----------|----------|-----------|
| Database (Neon) | Point-in-time recovery | Continuous |
| Docker Images | ECR retention | Keep last 10 |
| Secrets | AWS backup | Daily |

---

## Infrastructure as Code (Terraform)

### Main Configuration (infrastructure/main.tf)

```hcl
provider "aws" {
  region = "us-east-1"
}

# VPC
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "cas-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
}

# ECR Repository
resource "aws_ecr_repository" "cas_website" {
  name                 = "cas-website"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "cas_production" {
  name = "cas-production"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# Application Load Balancer
resource "aws_lb" "cas_alb" {
  name               = "cas-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = module.vpc.public_subnets
}

resource "aws_lb_target_group" "cas_tg" {
  name        = "cas-tg"
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 3
  }
}

# HTTPS Listener
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.cas_alb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = aws_acm_certificate.cas_cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.cas_tg.arn
  }
}

# ECS Service
resource "aws_ecs_service" "cas_service" {
  name            = "cas-website-service"
  cluster         = aws_ecs_cluster.cas_production.id
  task_definition = aws_ecs_task_definition.cas_task.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.cas_tg.arn
    container_name   = "cas-app"
    container_port   = 5000
  }

  deployment_configuration {
    maximum_percent         = 200
    minimum_healthy_percent = 100
  }
}
```

---

## Migration Checklist

### Phase 1: Preparation
- [ ] Create AWS account (if not exists)
- [ ] Install AWS CLI and configure credentials
- [ ] Install Docker locally for testing
- [ ] Create ECR repository

### Phase 2: Infrastructure Setup
- [ ] Create VPC with public/private subnets
- [ ] Set up security groups
- [ ] Create Application Load Balancer
- [ ] Configure Route 53 hosted zone
- [ ] Request ACM certificate for domain
- [ ] Create ECS cluster

### Phase 3: Secrets & Configuration
- [ ] Create secrets in AWS Secrets Manager
- [ ] Copy all environment variables from Replit
- [ ] Create IAM roles for ECS tasks
- [ ] Set up CloudWatch log groups

### Phase 4: GitHub Bridge Setup (Recommended)
- [ ] Connect Replit to GitHub
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Add AWS credentials as GitHub Secrets
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Test workflow with manual trigger

### Phase 5: Build & Deploy
- [ ] Create Dockerfile in repository
- [ ] Test Docker build locally
- [ ] Push to main branch (triggers deployment)
- [ ] Verify GitHub Actions workflow succeeds
- [ ] Verify ECS service health checks

### Phase 6: DNS & Go Live
- [ ] Update DNS to point to ALB
- [ ] Verify SSL certificate
- [ ] Test all functionality
- [ ] Monitor for 24-48 hours
- [ ] Decommission Replit hosting

---

## Summary

### Current State (Replit)
- Development environment with hot reload
- PostgreSQL on Neon (external)
- Zoho CRM integration working
- 350 total records in CRM (249 leads + 101 accounts)

### Target State (AWS)
- Production-grade container hosting
- Zero-downtime deployments
- Auto-scaling capability
- Professional monitoring & logging
- ~$60-100/month estimated cost

### Key Benefits of AWS Migration
1. **Reliability**: Multi-AZ deployment with auto-recovery
2. **Scalability**: Easy to scale up during traffic spikes
3. **Security**: VPC isolation, IAM roles, encrypted secrets
4. **Monitoring**: CloudWatch metrics, logs, and alarms
5. **Control**: Full infrastructure ownership

---

*Document Version: 1.1*
*Last Updated: December 2025*
*Application: CAS Website*
*Change Log: Added GitHub Bridge deployment section with GitHub Actions workflow*
