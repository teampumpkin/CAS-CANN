/**
 * Session + admin auth wiring.
 *
 * Exists as one module so the two entry-points (index.ts for dev, index.prod.ts
 * for the ECS build) cannot drift apart. Both call configureAuth(app) once,
 * before registerRoutes.
 */

import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import createMemoryStore from "memorystore";
import type { Express } from "express";
import { registerAdminAuthRoutes } from "./admin-auth-routes";
import { registerAdminDataRoutes } from "./admin-data-routes";
import { registerAdminMapRoutes } from "./admin-map-routes";
import { registerSiteStatsRoutes } from "./site-stats-routes";

const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

export function configureAuth(app: Express): void {
  const isProduction = process.env.NODE_ENV === "production";
  const secret = process.env.SESSION_SECRET;

  // A missing secret in production means every session cookie is signed with a
  // guessable key and can be forged. Refuse to start rather than serve that.
  if (isProduction && !secret) {
    throw new Error(
      "SESSION_SECRET is required in production. Generate one with: openssl rand -base64 32",
    );
  }

  let store: session.Store;
  if (process.env.DATABASE_URL) {
    const PgStore = connectPgSimple(session);
    store = new PgStore({
      conString: process.env.DATABASE_URL,
      tableName: "session",
      createTableIfMissing: true,
    });
  } else {
    // Local dev without a database. Sessions die on restart; that is fine here
    // and must never be the production path — hence the DATABASE_URL branch.
    const MemoryStore = createMemoryStore(session);
    store = new MemoryStore({ checkPeriod: 86_400_000 });
  }

  // TLS terminates at nginx upstream, which forwards to Express over plain
  // HTTP. Without this, req.protocol reads "http" and req.secure is false.
  app.set("trust proxy", 1);

  app.use(
    session({
      name: "connect.sid",
      secret: secret ?? "dev-only-insecure-secret",
      resave: false,
      saveUninitialized: false,
      store,
      cookie: {
        httpOnly: true,
        // "auto", not `isProduction`. With `secure: true`, express-session
        // silently refuses to set the cookie whenever it cannot prove the
        // connection is HTTPS — which is what happens if the upstream proxy
        // does not forward X-Forwarded-Proto. The symptom is a 200 from
        // /login with no Set-Cookie, then 401 from every later request.
        // "auto" sets the Secure flag when it can detect TLS and falls back
        // to a working cookie when it cannot.
        secure: "auto",
        sameSite: "lax",
        maxAge: EIGHT_HOURS_MS,
        path: "/",
      },
    }),
  );

  registerAdminAuthRoutes(app);
  registerAdminDataRoutes(app);
  registerAdminMapRoutes(app);
  registerSiteStatsRoutes(app);
}
