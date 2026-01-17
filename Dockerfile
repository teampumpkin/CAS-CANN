# Stage 1: Build application
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build argument for environment
ARG VITE_ENVIRONMENT=production
ENV VITE_ENVIRONMENT=$VITE_ENVIRONMENT

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build frontend and bundle server (VITE_ENVIRONMENT is baked into the frontend build)
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS production

# Install wget for health checks
RUN apk add --no-cache wget

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built application from builder stage
# dist/ contains: bundled server (index.js) + frontend assets (client/)
COPY --from=builder /app/dist ./dist

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose application port
EXPOSE 5000

# Health check - verifies application is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -q --spider http://localhost:5000/health || exit 1

# Start production server
CMD ["node", "dist/index.js"]
