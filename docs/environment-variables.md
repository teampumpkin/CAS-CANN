# Required Environment Variables

## Overview

This document lists all environment variables required to run the CAS-CANN application in production.

## Required Variables

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string (Neon) | `postgresql://user:pass@host/db?sslmode=require` |
| `SESSION_SECRET` | Express session encryption key | Random 32+ character string |
| `ZOHO_CLIENT_ID` | Zoho CRM OAuth client ID | `1000.XXXXXXXXXXXX` |
| `ZOHO_CLIENT_SECRET` | Zoho CRM OAuth client secret | `xxxxxxxxxxxxxxxx` |
| `ZOHO_REDIRECT_URI` | OAuth callback URL | `https://amyloid.ca/api/zoho/callback` |

## Optional Variables

| Variable Name | Description | Default |
|--------------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Application port | `5000` |
| `EVENT_ADMIN_USERNAME` | Event admin login | `cannAdmin` |
| `EVENT_ADMIN_PASSWORD` | Event admin password | `Townhall2025!` |
| `ZOHO_FLOW_WEBHOOK_URL` | Zoho Flow webhook | (optional) |
| `ZOHO_FLOW_ZAPIKEY` | Zoho Flow API key | (optional) |

## AWS Secrets Manager Mapping

| Environment Variable | AWS Secret Path |
|---------------------|-----------------|
| `DATABASE_URL` | `cas/database-url` |
| `SESSION_SECRET` | `cas/session-secret` |
| `ZOHO_CLIENT_ID` | `cas/zoho-client-id` |
| `ZOHO_CLIENT_SECRET` | `cas/zoho-client-secret` |
| `ZOHO_REDIRECT_URI` | `cas/zoho-redirect-uri` |
| `EVENT_ADMIN_USERNAME` | `cas/event-admin-username` |
| `EVENT_ADMIN_PASSWORD` | `cas/event-admin-password` |

## GitHub Actions Secrets

Only these secrets are needed in GitHub:

| Secret Name | Description |
|-------------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM user access key for deployment |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret access key |

All other secrets are stored in AWS Secrets Manager and injected into ECS tasks at runtime.

## Where to Get Values

| Variable | Source |
|----------|--------|
| `DATABASE_URL` | Neon Dashboard → Connection Details |
| `SESSION_SECRET` | Generate: `openssl rand -base64 32` |
| `ZOHO_CLIENT_ID` | Zoho API Console → Self Client |
| `ZOHO_CLIENT_SECRET` | Zoho API Console → Self Client |
| `ZOHO_REDIRECT_URI` | Your domain + `/api/zoho/callback` |
