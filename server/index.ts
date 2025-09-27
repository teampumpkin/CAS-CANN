import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

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
  // Initialize OAuth service on startup
  const { oauthService } = await import("./oauth-service");
  await oauthService.initialize();

  // Add health endpoint BEFORE routes registration
  app.get('/health', (_req, res) => {
    res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      port: process.env.PORT ? parseInt(process.env.PORT) : 5000,
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Setup OAuth proxy middleware with self-proxy protection
  const { createOAuthProxyMiddleware } = await import("./oauth-proxy");
  const oauthProxy = createOAuthProxyMiddleware();
  
  // Setup OAuth API router for direct handling
  const { createAPIRouter } = await import("./api-router");
  const apiRouter = await createAPIRouter();
  
  // Mount OAuth routes BEFORE Vite middleware (priority over catch-all)
  app.use('/api/oauth', apiRouter);
  
  // Register all other API routes BEFORE Vite middleware
  const server = await registerRoutes(app);
  
  // Add OAuth proxy middleware for frontend requests
  app.use(oauthProxy);
  
  // Add a temporary override for root path to test if changes are reaching Replit domain
  app.get('/', (req, res, next) => {
    const host = req.get('host') || req.get('x-forwarded-host');
    console.log(`[ROOT] Request from host: ${host}, forwarded-host: ${req.get('x-forwarded-host')}`);
    
    // Let Vite handle it by passing to next middleware
    next();
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
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
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
    reusePort: true,
  }, () => {
    log(`🚀 Server listening on 0.0.0.0:${port} (${process.env.NODE_ENV || 'development'})`);
  });
})();
