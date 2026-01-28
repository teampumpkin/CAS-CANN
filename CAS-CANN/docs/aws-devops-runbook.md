# CAS Website - AWS DevOps Runbook

**Document Purpose**: Infrastructure setup and operations guide for AWS DevOps team  
**Application**: Canadian Amyloidosis Society (CAS) Website  
**Version**: 1.0  
**Last Updated**: December 2025

---

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Application Overview](#application-overview)
3. [AWS Resource Inventory](#aws-resource-inventory)
4. [Infrastructure Setup](#infrastructure-setup)
5. [IAM Configuration](#iam-configuration)
6. [Secrets Configuration](#secrets-configuration)
7. [Container Configuration](#container-configuration)
8. [Health Checks & Monitoring](#health-checks--monitoring)
9. [GitHub Actions Setup](#github-actions-setup)
10. [Operational Runbook](#operational-runbook)
11. [Troubleshooting Guide](#troubleshooting-guide)

---

## Quick Reference

### Critical Endpoints

| Endpoint | Purpose | Expected Response |
|----------|---------|-------------------|
| `GET /health` | Application health | `200 OK` with JSON |
| `GET /ping` | Simple liveness | `200 OK` "pong" |

### Key Ports

| Service | Port | Protocol |
|---------|------|----------|
| Application | 5000 | HTTP |
| ALB HTTPS | 443 | HTTPS |
| ALB HTTP | 80 | HTTP (redirect to 443) |

### Resource Sizing

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 0.5 vCPU | 1 vCPU |
| Memory | 1 GB | 2 GB |
| Instances | 1 | 2 (multi-AZ) |

---

## Application Overview

### Architecture Summary

```
Internet → ALB (443) → ECS Fargate (5000) → Neon PostgreSQL (External)
                                          → Zoho CRM API (External)
```

### Technology Stack

- **Runtime**: Node.js 20 (Alpine)
- **Framework**: Express.js + React (Vite)
- **Database**: PostgreSQL (Neon - external, no AWS RDS needed)
- **External APIs**: Zoho CRM (OAuth 2.0)

### Background Processes

The application runs these in-process workers (no separate containers needed):

| Worker | Interval | Purpose |
|--------|----------|---------|
| ZohoSyncWorker | 10 seconds | Syncs pending form submissions to Zoho CRM |
| TokenManager | 3.3 minutes | Refreshes OAuth tokens before expiry |
| FieldMetadataCache | 24 hours | Caches Zoho CRM field definitions |

**Important**: These workers run inside the main container. Each container instance runs its own workers. Design is idempotent - multiple instances won't cause conflicts.

### Database Tables

| Table | Purpose |
|-------|---------|
| `users` | Admin users |
| `resources` | Uploaded documents |
| `form_submissions` | Lead capture data |
| `submission_logs` | Sync audit trail |
| `field_mappings` | CRM field mappings |
| `form_configurations` | Dynamic form configs |
| `field_metadata_cache` | Zoho field cache |
| `oauth_tokens` | OAuth credentials |
| `automation_workflows` | Workflow definitions |
| `workflow_executions` | Workflow runs |
| `action_executions` | Action runs |
| `campaign_syncs` | Marketing syncs |
| `townhall_registrations` | Event signups |
| `event_admins` | Event admin users |

---

## AWS Resource Inventory

### Required AWS Services

| Service | Resource Name | Purpose |
|---------|---------------|---------|
| ECR | `cas-website` | Docker image registry |
| ECS Cluster | `cas-production` | Container orchestration |
| ECS Service | `cas-website-service` | Application service |
| ECS Task Definition | `cas-website` | Container spec |
| ALB | `cas-alb` | Load balancer |
| Target Group | `cas-tg` | Health checks |
| VPC | `cas-vpc` | Network isolation |
| Security Group | `cas-alb-sg` | ALB ingress |
| Security Group | `cas-ecs-sg` | ECS tasks |
| Route 53 | `amyloid.ca` | DNS zone |
| ACM | `*.amyloid.ca` | SSL certificate |
| Secrets Manager | `cas/*` | Credentials |
| CloudWatch Log Group | `/ecs/cas-website` | Logs |
| IAM Role | `cas-ecs-task-role` | Task permissions |
| IAM Role | `cas-ecs-execution-role` | Container startup |
| IAM User | `cas-github-actions` | CI/CD deployment |

---

## Infrastructure Setup

### 1. VPC Configuration

```hcl
# Terraform: vpc.tf
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "cas-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway   = true
  single_nat_gateway   = true
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Project     = "CAS Website"
    Environment = "production"
  }
}
```

### 2. Security Groups

```hcl
# ALB Security Group
resource "aws_security_group" "alb_sg" {
  name        = "cas-alb-sg"
  description = "Allow HTTPS inbound"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "HTTPS from internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP redirect"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "cas-alb-sg"
  }
}

# ECS Security Group
resource "aws_security_group" "ecs_sg" {
  name        = "cas-ecs-sg"
  description = "Allow traffic from ALB"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "HTTP from ALB"
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    description = "All outbound (DB, Zoho API)"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "cas-ecs-sg"
  }
}
```

### 3. ECR Repository

```bash
# Create ECR repository
aws ecr create-repository \
  --repository-name cas-website \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256 \
  --region us-east-1

# Lifecycle policy (keep last 10 images)
aws ecr put-lifecycle-policy \
  --repository-name cas-website \
  --lifecycle-policy-text '{
    "rules": [
      {
        "rulePriority": 1,
        "description": "Keep last 10 images",
        "selection": {
          "tagStatus": "any",
          "countType": "imageCountMoreThan",
          "countNumber": 10
        },
        "action": {
          "type": "expire"
        }
      }
    ]
  }' \
  --region us-east-1
```

### 4. Application Load Balancer

```hcl
# ALB
resource "aws_lb" "cas_alb" {
  name               = "cas-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = module.vpc.public_subnets

  enable_deletion_protection = true

  tags = {
    Name = "cas-alb"
  }
}

# Target Group
resource "aws_lb_target_group" "cas_tg" {
  name        = "cas-tg"
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    matcher             = "200"
  }

  stickiness {
    type            = "lb_cookie"
    cookie_duration = 86400
    enabled         = true
  }

  tags = {
    Name = "cas-tg"
  }
}

# HTTPS Listener
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.cas_alb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.cas_cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.cas_tg.arn
  }
}

# HTTP to HTTPS Redirect
resource "aws_lb_listener" "http_redirect" {
  load_balancer_arn = aws_lb.cas_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}
```

### 5. ECS Cluster

```hcl
resource "aws_ecs_cluster" "cas_production" {
  name = "cas-production"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  configuration {
    execute_command_configuration {
      logging = "OVERRIDE"
      log_configuration {
        cloud_watch_log_group_name = "/ecs/cas-website/exec"
      }
    }
  }

  tags = {
    Name        = "cas-production"
    Environment = "production"
  }
}

resource "aws_ecs_cluster_capacity_providers" "cas_fargate" {
  cluster_name = aws_ecs_cluster.cas_production.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE"
  }
}
```

### 6. ECS Service

```hcl
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

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  lifecycle {
    ignore_changes = [task_definition]
  }

  tags = {
    Name = "cas-website-service"
  }
}
```

---

## IAM Configuration

### ECS Task Execution Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRPull",
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudWatchLogs",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:us-east-1:*:log-group:/ecs/cas-website:*"
    },
    {
      "Sid": "SecretsManager",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:*:secret:cas/*"
    }
  ]
}
```

### ECS Task Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CloudWatchMetrics",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:PutMetricData"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "cloudwatch:namespace": "CAS/Website"
        }
      }
    }
  ]
}
```

### GitHub Actions IAM User Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ECRLogin",
      "Effect": "Allow",
      "Action": "ecr:GetAuthorizationToken",
      "Resource": "*"
    },
    {
      "Sid": "ECRPush",
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage"
      ],
      "Resource": "arn:aws:ecr:us-east-1:*:repository/cas-website"
    },
    {
      "Sid": "ECSDeployment",
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecs:DescribeServices",
        "ecs:DescribeClusters",
        "ecs:ListTasks",
        "ecs:DescribeTasks"
      ],
      "Resource": [
        "arn:aws:ecs:us-east-1:*:cluster/cas-production",
        "arn:aws:ecs:us-east-1:*:service/cas-production/cas-website-service"
      ]
    },
    {
      "Sid": "ECSWaitForStable",
      "Effect": "Allow",
      "Action": [
        "ecs:DescribeServices"
      ],
      "Resource": "*"
    }
  ]
}
```

### Create GitHub Actions User

```bash
# Create IAM user
aws iam create-user --user-name cas-github-actions

# Attach policy
aws iam put-user-policy \
  --user-name cas-github-actions \
  --policy-name CASGitHubActionsPolicy \
  --policy-document file://github-actions-policy.json

# Create access key
aws iam create-access-key --user-name cas-github-actions

# Output: Save AccessKeyId and SecretAccessKey for GitHub Secrets
```

---

## Secrets Configuration

### Secrets to Create in AWS Secrets Manager

| Secret Path | Description | Source |
|-------------|-------------|--------|
| `cas/database-url` | PostgreSQL connection string | Neon dashboard |
| `cas/zoho-client-id` | Zoho OAuth client ID | Zoho API Console |
| `cas/zoho-client-secret` | Zoho OAuth client secret | Zoho API Console |
| `cas/session-secret` | Express session secret | Generate random |
| `cas/event-admin-username` | Event admin login | `cannAdmin` |
| `cas/event-admin-password` | Event admin password | `Townhall2025!` |

### Create Secrets

```bash
# Database URL (from Neon)
aws secretsmanager create-secret \
  --name cas/database-url \
  --description "PostgreSQL connection string for CAS website" \
  --secret-string "postgresql://user:pass@host/db?sslmode=require"

# Zoho OAuth credentials
aws secretsmanager create-secret \
  --name cas/zoho-client-id \
  --description "Zoho CRM OAuth client ID" \
  --secret-string "1000.XXXX"

aws secretsmanager create-secret \
  --name cas/zoho-client-secret \
  --description "Zoho CRM OAuth client secret" \
  --secret-string "secret-value"

# Session secret (generate new)
aws secretsmanager create-secret \
  --name cas/session-secret \
  --description "Express session secret" \
  --secret-string "$(openssl rand -base64 32)"

# Event admin credentials
aws secretsmanager create-secret \
  --name cas/event-admin-username \
  --description "Event admin username" \
  --secret-string "cannAdmin"

aws secretsmanager create-secret \
  --name cas/event-admin-password \
  --description "Event admin password" \
  --secret-string "Townhall2025!"
```

---

## Container Configuration

### Dockerfile

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
RUN npm ci --omit=dev
COPY --from=frontend-builder /app/dist ./dist
COPY server ./server
COPY shared ./shared
RUN npx esbuild server/index.ts --bundle --platform=node --outfile=dist/server.js --packages=external

# Stage 3: Production runtime
FROM node:20-alpine AS production
RUN apk add --no-cache wget
WORKDIR /app
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/node_modules ./node_modules
COPY package.json ./

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
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
  "executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/cas-ecs-execution-role",
  "taskRoleArn": "arn:aws:iam::ACCOUNT_ID:role/cas-ecs-task-role",
  "containerDefinitions": [
    {
      "name": "cas-app",
      "image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/cas-website:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "PORT", "value": "5000"},
        {"name": "REPLIT_DEPLOYMENT", "value": "1"}
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:cas/database-url"
        },
        {
          "name": "ZOHO_CLIENT_ID",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:cas/zoho-client-id"
        },
        {
          "name": "ZOHO_CLIENT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:cas/zoho-client-secret"
        },
        {
          "name": "SESSION_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:cas/session-secret"
        },
        {
          "name": "EVENT_ADMIN_USERNAME",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:cas/event-admin-username"
        },
        {
          "name": "EVENT_ADMIN_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:cas/event-admin-password"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/cas-website",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs",
          "awslogs-create-group": "true"
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

---

## Health Checks & Monitoring

### Health Check Endpoints

**GET /health** - Full health check
```json
{
  "status": "healthy",
  "timestamp": "2025-12-24T12:00:00.000Z",
  "port": 5000,
  "environment": "production",
  "replitDeployment": true,
  "databaseHost": "ep-xxx.us-east-2.aws.neon.tech"
}
```

**GET /ping** - Simple liveness
```
pong
```

### ALB Health Check Configuration

| Setting | Value |
|---------|-------|
| Protocol | HTTP |
| Port | traffic-port (5000) |
| Path | /health |
| Healthy threshold | 2 |
| Unhealthy threshold | 3 |
| Timeout | 5 seconds |
| Interval | 30 seconds |
| Success codes | 200 |

### CloudWatch Alarms

```bash
# High CPU Alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "CAS-HighCPU" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --dimensions Name=ClusterName,Value=cas-production Name=ServiceName,Value=cas-website-service \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:cas-alerts

# High Memory Alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "CAS-HighMemory" \
  --metric-name MemoryUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 85 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --dimensions Name=ClusterName,Value=cas-production Name=ServiceName,Value=cas-website-service \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:cas-alerts

# Target Group Unhealthy Hosts
aws cloudwatch put-metric-alarm \
  --alarm-name "CAS-UnhealthyHosts" \
  --metric-name UnHealthyHostCount \
  --namespace AWS/ApplicationELB \
  --statistic Average \
  --period 60 \
  --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold \
  --evaluation-periods 2 \
  --dimensions Name=TargetGroup,Value=targetgroup/cas-tg/xxx Name=LoadBalancer,Value=app/cas-alb/xxx \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:cas-alerts

# 5xx Errors
aws cloudwatch put-metric-alarm \
  --alarm-name "CAS-5xxErrors" \
  --metric-name HTTPCode_Target_5XX_Count \
  --namespace AWS/ApplicationELB \
  --statistic Sum \
  --period 60 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --dimensions Name=LoadBalancer,Value=app/cas-alb/xxx \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:cas-alerts
```

### CloudWatch Log Groups

```bash
# Create log group
aws logs create-log-group --log-group-name /ecs/cas-website

# Set retention
aws logs put-retention-policy \
  --log-group-name /ecs/cas-website \
  --retention-in-days 30
```

---

## GitHub Actions Setup

### Required Repository Secrets

| Secret Name | Value |
|-------------|-------|
| `AWS_ACCESS_KEY_ID` | From IAM user `cas-github-actions` |
| `AWS_SECRET_ACCESS_KEY` | From IAM user `cas-github-actions` |
| `AWS_REGION` | `us-east-1` |
| `AWS_ACCOUNT_ID` | Your 12-digit account ID |
| `ECR_REPOSITORY` | `cas-website` |
| `ECS_CLUSTER` | `cas-production` |
| `ECS_SERVICE` | `cas-website-service` |

### Workflow File (.github/workflows/deploy.yml)

```yaml
name: Deploy to AWS ECS

on:
  push:
    branches: [main]
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
    timeout-minutes: 30

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

      - name: Build and push Docker image
        id: build-image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
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
          aws ecs wait services-stable \
            --cluster $ECS_CLUSTER \
            --services $ECS_SERVICE

      - name: Deployment summary
        run: |
          echo "## Deployment Complete" >> $GITHUB_STEP_SUMMARY
          echo "- **Image:** ${{ steps.build-image.outputs.image }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Cluster:** $ECS_CLUSTER" >> $GITHUB_STEP_SUMMARY
          echo "- **Service:** $ECS_SERVICE" >> $GITHUB_STEP_SUMMARY
```

---

## Operational Runbook

### Deploy New Version

```bash
# Automatic (via GitHub)
git push origin main
# → GitHub Actions builds and deploys

# Manual (emergency)
aws ecs update-service \
  --cluster cas-production \
  --service cas-website-service \
  --force-new-deployment
```

### Scale Service

```bash
# Scale up
aws ecs update-service \
  --cluster cas-production \
  --service cas-website-service \
  --desired-count 4

# Scale down
aws ecs update-service \
  --cluster cas-production \
  --service cas-website-service \
  --desired-count 2
```

### View Logs

```bash
# Recent logs
aws logs tail /ecs/cas-website --follow

# Search logs
aws logs filter-log-events \
  --log-group-name /ecs/cas-website \
  --filter-pattern "ERROR" \
  --start-time $(date -d '1 hour ago' +%s000)
```

### Rollback Deployment

```bash
# Option 1: Deploy previous image
aws ecs update-service \
  --cluster cas-production \
  --service cas-website-service \
  --task-definition cas-website:PREVIOUS_REVISION

# Option 2: Git revert (triggers auto-deploy)
git revert HEAD
git push origin main
```

### Restart Service

```bash
aws ecs update-service \
  --cluster cas-production \
  --service cas-website-service \
  --force-new-deployment
```

### Check Service Health

```bash
# Service status
aws ecs describe-services \
  --cluster cas-production \
  --services cas-website-service \
  --query 'services[0].{status:status,running:runningCount,desired:desiredCount,deployments:deployments}'

# Target group health
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:us-east-1:ACCOUNT_ID:targetgroup/cas-tg/xxx
```

### Update Secrets

```bash
# Update a secret
aws secretsmanager update-secret \
  --secret-id cas/zoho-client-secret \
  --secret-string "new-secret-value"

# Restart service to pick up new secrets
aws ecs update-service \
  --cluster cas-production \
  --service cas-website-service \
  --force-new-deployment
```

---

## Troubleshooting Guide

### Container Won't Start

**Symptoms**: Tasks fail to start, service stuck at 0 running tasks

**Check**:
1. View task stopped reason:
   ```bash
   aws ecs describe-tasks \
     --cluster cas-production \
     --tasks $(aws ecs list-tasks --cluster cas-production --service-name cas-website-service --query 'taskArns[0]' --output text)
   ```

2. Check CloudWatch logs:
   ```bash
   aws logs tail /ecs/cas-website --since 10m
   ```

**Common Causes**:
- Missing secrets → Verify secrets exist in Secrets Manager
- Invalid DATABASE_URL → Check Neon connection string
- Port already in use → Check container port is 5000

### Health Checks Failing

**Symptoms**: Tasks marked unhealthy, constant restarts

**Check**:
1. Verify health endpoint locally:
   ```bash
   curl -v http://localhost:5000/health
   ```

2. Check target group health:
   ```bash
   aws elbv2 describe-target-health --target-group-arn TARGET_GROUP_ARN
   ```

**Common Causes**:
- Container startup time > health check start period → Increase `startPeriod` to 90s
- Database connection timeout → Check security group allows outbound 5432
- Application error on startup → Check CloudWatch logs

### Zoho Sync Not Working

**Symptoms**: Form submissions stuck in "pending" status

**Check**:
1. Search logs for sync worker:
   ```bash
   aws logs filter-log-events \
     --log-group-name /ecs/cas-website \
     --filter-pattern "Zoho Sync Worker"
   ```

2. Check for OAuth token errors:
   ```bash
   aws logs filter-log-events \
     --log-group-name /ecs/cas-website \
     --filter-pattern "token"
   ```

**Common Causes**:
- OAuth token expired → Check Zoho refresh token in Secrets Manager
- Rate limiting → Reduce BATCH_SIZE in zoho-sync-worker.ts
- Field mapping mismatch → Check Zoho CRM field IDs

### High Memory Usage

**Symptoms**: Container OOMKilled, memory alarm triggered

**Check**:
1. CloudWatch metrics:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/ECS \
     --metric-name MemoryUtilization \
     --dimensions Name=ClusterName,Value=cas-production Name=ServiceName,Value=cas-website-service \
     --start-time $(date -d '1 hour ago' -Iseconds) \
     --end-time $(date -Iseconds) \
     --period 300 \
     --statistics Average
   ```

**Solutions**:
- Increase task memory from 2048 to 4096
- Check for memory leaks in application
- Review background worker intervals

---

## DNS Configuration

### Route 53 Records

| Record Type | Name | Value |
|-------------|------|-------|
| A (Alias) | amyloid.ca | ALB DNS name |
| A (Alias) | www.amyloid.ca | ALB DNS name |
| CNAME | *.amyloid.ca | ALB DNS name |

### ACM Certificate

```bash
# Request certificate
aws acm request-certificate \
  --domain-name amyloid.ca \
  --subject-alternative-names "*.amyloid.ca" \
  --validation-method DNS

# Add DNS validation records to Route 53
# Then validate
aws acm describe-certificate --certificate-arn CERT_ARN
```

---

## Cost Estimation

| Resource | Monthly Cost |
|----------|--------------|
| ECS Fargate (1 vCPU, 2GB, 2 tasks) | ~$50 |
| Application Load Balancer | ~$20 |
| NAT Gateway | ~$35 |
| CloudWatch Logs (5GB) | ~$3 |
| Secrets Manager (6 secrets) | ~$2.40 |
| Route 53 | ~$0.50 |
| ECR Storage | ~$0.10 |
| **Total** | **~$110/month** |

**Cost Optimization Options**:
- Use single NAT Gateway (already configured)
- Use Fargate Spot for non-critical tasks
- Reduce log retention
- Use single AZ for dev/staging

---

## Contacts

| Role | Contact |
|------|---------|
| Application Owner | [CAS Admin] |
| DevOps Lead | [Your Team] |
| On-Call | [PagerDuty/Slack] |

---

*Document Version: 1.0*  
*Created: December 2025*  
*For: AWS DevOps Team*
