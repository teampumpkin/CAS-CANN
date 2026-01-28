# Docker Testing Instructions

## Prerequisites

- Docker installed locally
- Node.js 20+ (for local development)

## Build Docker Image

```bash
# Clone the repository
git clone https://github.com/teampumpkin/CAS-CANN.git
cd CAS-CANN

# Build the image
docker build -t cas-cann:latest .
```

## Run Container Locally

```bash
# Run with required environment variables
docker run -d \
  --name cas-cann \
  -p 5000:5000 \
  -e DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" \
  -e SESSION_SECRET="your-session-secret" \
  -e ZOHO_CLIENT_ID="your-zoho-client-id" \
  -e ZOHO_CLIENT_SECRET="your-zoho-client-secret" \
  -e ZOHO_REDIRECT_URI="https://your-domain.com/api/zoho/callback" \
  -e NODE_ENV="production" \
  cas-cann:latest
```

## Verify Container Health

```bash
# Check container is running
docker ps

# Test health endpoint
curl http://localhost:5000/health

# Expected response:
# {"status":"healthy","timestamp":"...","port":5000,"environment":"production",...}

# Test ping endpoint
curl http://localhost:5000/ping

# Expected response: pong
```

## View Container Logs

```bash
# Follow logs
docker logs -f cas-cann

# Look for:
# - "Server listening on 0.0.0.0:5000"
# - "Zoho background sync worker started"
# - No ERROR messages
```

## Stop and Remove Container

```bash
docker stop cas-cann
docker rm cas-cann
```

## Troubleshooting

### Container exits immediately
- Check logs: `docker logs cas-cann`
- Ensure DATABASE_URL is valid and accessible

### Health check fails
- Verify port 5000 is exposed
- Check container logs for startup errors
- Ensure database connection works

### Build fails
- Clear Docker cache: `docker build --no-cache -t cas-cann:latest .`
- Ensure all files are committed (not in .gitignore)
