// ============================================================================
// ⚠️  PROTECTED FILE - DO NOT MODIFY WITHOUT APPROVAL
// ============================================================================
// This is the PRODUCTION server entry point for AWS ECS deployment.
// It intentionally has NO Vite imports to avoid build errors.
//
// For development, use: server/index.ts (includes Vite dev server)
// For production, use: server/index.prod.ts (this file)
//
// Before modifying:
// 1. Consult with the project lead
// 2. Ensure changes don't break the production build
// 3. Test with: npx esbuild server/index.prod.ts --platform=node --bundle
//
// To add/hide features between staging and production:
// - Use isStaging()/isProduction() from client/src/hooks/useEnvironment.ts
// - Do NOT modify this file for feature visibility
//
// Last verified: January 2025
// ============================================================================

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./static";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  console.log(`\n========================================`);
  console.log(`🌍 Environment: PRODUCTION`);
  console.log(`📦 NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`🚀 REPLIT_DEPLOYMENT: ${process.env.REPLIT_DEPLOYMENT || 'not set'}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? process.env.DATABASE_URL.split('@')[1]?.split('/')[0] : 'not configured'}`);
  console.log(`========================================\n`);

  const { migrateRetryColumns } = await import("./migrations/add-retry-columns");
  await migrateRetryColumns();
  
  const { migrateAutoCreateFields } = await import("./migrations/fix-auto-create-fields");
  await migrateAutoCreateFields();

  const { dedicatedTokenManager } = await import("./dedicated-token-manager");
  await dedicatedTokenManager.initialize();

  const { oauthService } = await import("./oauth-service");
  await oauthService.initialize();

  const { fieldMetadataCacheService } = await import("./field-metadata-cache-service");
  await fieldMetadataCacheService.initialize();

  const { formConfigEngine } = await import("./form-config-engine");
  await formConfigEngine.initialize();

  const { zohoSyncWorker } = await import("./zoho-sync-worker");
  zohoSyncWorker.start();
  console.log('[Server] Zoho background sync worker started');

  const server = await registerRoutes(app);

  app.get('/health', (_req, res) => {
    res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      port: process.env.PORT ? parseInt(process.env.PORT) : 5000,
      environment: 'production',
      replitDeployment: process.env.REPLIT_DEPLOYMENT === '1',
      databaseHost: process.env.DATABASE_URL ? process.env.DATABASE_URL.split('@')[1]?.split('/')[0] : 'not configured'
    });
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  serveStatic(app);

  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`🚀 Server listening on 0.0.0.0:${port} (production)`);
  });
})();
