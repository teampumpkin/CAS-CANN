import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./static";
import { pool } from "./db";

const app = express();

// Behind AWS ALB / any reverse proxy in production so secure cookies work.
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Member session middleware (backs the member login portal).
// Sessions are stored in the `member_sessions` table via connect-pg-simple.
const PgSession = connectPgSimple(session);
if (!process.env.SESSION_SECRET && process.env.NODE_ENV === "production") {
  console.warn("[Session] SESSION_SECRET is not set in production — set it in the environment.");
}
app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "member_sessions",
      createTableIfMissing: false, // created by the add-member-tables migration
    }),
    name: "cas.sid",
    secret: process.env.SESSION_SECRET || "dev-session-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      // "auto" = secure cookie only over HTTPS (honors trust proxy); works on HTTP dev/staging too.
      secure: "auto",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }),
);

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
  // Detect and log environment
  const isProduction = process.env.REPLIT_DEPLOYMENT === '1' || process.env.NODE_ENV === 'production';
  const environment = isProduction ? 'PRODUCTION' : 'DEVELOPMENT';
  
  console.log(`\n========================================`);
  console.log(`🌍 Environment: ${environment}`);
  console.log(`📦 NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`🚀 REPLIT_DEPLOYMENT: ${process.env.REPLIT_DEPLOYMENT || 'not set'}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? process.env.DATABASE_URL.split('@')[1]?.split('/')[0] : 'not configured'}`);
  console.log(`========================================\n`);

  // Run database migrations
  const { migrateRetryColumns } = await import("./migrations/add-retry-columns");
  await migrateRetryColumns();
  
  const { migrateAutoCreateFields } = await import("./migrations/fix-auto-create-fields");
  await migrateAutoCreateFields();

  const { migrateConsentRecords } = await import("./migrations/add-consent-records");
  await migrateConsentRecords();

  const { migrateMemberTables } = await import("./migrations/add-member-tables");
  await migrateMemberTables();

  // Initialize dedicated token management system
  const { dedicatedTokenManager } = await import("./dedicated-token-manager");
  await dedicatedTokenManager.initialize();

  // Initialize OAuth service on startup
  const { oauthService } = await import("./oauth-service");
  await oauthService.initialize();

  // Initialize field metadata cache service
  const { fieldMetadataCacheService } = await import("./field-metadata-cache-service");
  await fieldMetadataCacheService.initialize();

  // Initialize form configuration engine (ensures legacy defaults for autoCreateFields)
  const { formConfigEngine } = await import("./form-config-engine");
  await formConfigEngine.initialize();

  // Initialize Zoho sync worker (BULLETPROOF: processes pending form submissions)
  const { zohoSyncWorker } = await import("./zoho-sync-worker");
  zohoSyncWorker.start();
  console.log('[Server] Zoho background sync worker started');

  // Initialize notification service (DISABLED for production)
  // const { notificationService } = await import("./notification-service");
  // Note: notificationService initializes automatically via its constructor

  const server = await registerRoutes(app);

  // Add health endpoint BEFORE Vite middleware to ensure it's handled by Express
  app.get('/health', (_req, res) => {
    const isProduction = process.env.REPLIT_DEPLOYMENT === '1' || process.env.NODE_ENV === 'production';
    res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      port: process.env.PORT ? parseInt(process.env.PORT) : 5000,
      environment: isProduction ? 'production' : 'development',
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

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    // Dynamic import to prevent vite from being bundled in production
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use PORT environment variable for production deployments
  // For Autoscale deployments, Replit provides a dynamic PORT
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  
  server.listen({
    port,
    host: "0.0.0.0",
    // reusePort is unsupported on macOS (ENOTSUP); enable only where supported (e.g. Linux/Replit)
    reusePort: process.platform !== "darwin",
  }, () => {
    log(`🚀 Server listening on 0.0.0.0:${port} (${process.env.NODE_ENV || 'development'})`);
  });
})();
