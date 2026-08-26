/**
 * Admin authentication — routes and middleware.
 *
 * Implements W3 of docs/SERVICES_MAP_AND_MEMBER_ACCESS_PLAN_2026-08-07.md.
 * Contract and rationale for every rule below live in
 * server/__tests__/admin-auth.test.ts.
 *
 *   POST /api/admin/auth/login
 *   POST /api/admin/auth/logout
 *   GET  /api/admin/auth/me
 *   POST /api/admin/auth/change-password
 *
 * Deliberately isolated from server/routes.ts so it can be mounted (and
 * tested) without booting Zoho, the sync worker, or the database.
 *
 * This is a separate authority from `requireAutomationAuth` (a single shared
 * static key) and from the legacy event-admin basic auth. Neither is accepted
 * here.
 */

import type { Express, Request, Response, NextFunction } from "express";
// Type-only import: brings express-session's types into the program so the
// `declare module` augmentation below resolves and `req.session` is typed.
// tsconfig restricts `types` to ["node", "vite/client"], so without this the
// augmentation target cannot be found.
import type {} from "express-session";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { storage } from "./storage";
import type { AdminUser, PublicAdminUser } from "@shared/schema";

// ---------------------------------------------------------------------------
// Policy
// ---------------------------------------------------------------------------

export const BCRYPT_COST = 12;
/** bcrypt silently ignores input past 72 bytes; cap it rather than truncate. */
export const MAX_PASSWORD_BYTES = 72;
export const MIN_PASSWORD_LENGTH = 12;
export const MAX_EMAIL_LENGTH = 320;
export const LOCKOUT_THRESHOLD = 5;
export const LOCKOUT_WINDOW_MINUTES = 15;

/**
 * A single opaque failure. Wrong password, unknown email, and deactivated
 * account must be indistinguishable, or the endpoint becomes an oracle for
 * which admin accounts exist.
 */
const INVALID_CREDENTIALS = { message: "Invalid email or password" } as const;
const LOCKED_OUT = {
  message: "Too many failed attempts. Try again later.",
} as const;

/**
 * Compared against when no admin matches, so an unknown email costs the same
 * wall-clock time as a wrong password. Hash of a value nothing can supply.
 */
const DUMMY_HASH = bcrypt.hashSync("__no_such_admin__", BCRYPT_COST);

// ---------------------------------------------------------------------------
// Session typing
// ---------------------------------------------------------------------------

declare module "express-session" {
  interface SessionData {
    adminId?: number;
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AdminUser;
    }
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Email validation.
 *
 * Order matters:
 *   1. Reject control characters FIRST (NUL, CR, LF) — CR/LF are header
 *      injection vectors and must never be silently trimmed away. Tab is
 *      excluded from this check because it is treated as paste noise below.
 *   2. Trim and lowercase, so " Admin@Amyloid.CA " resolves to one identity.
 *   3. Apply a strict format. A permissive regex lets through "admin@localhost"
 *      (no TLD), "admin@.amyloid.ca" (leading dot) and "admin@amyloid.ca,"
 *      (trailing comma), all of which must be rejected.
 */
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000A-\u001F\u007F]/;
const EMAIL_FORMAT =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

const emailSchema = z
  .string()
  .refine((v) => !CONTROL_CHARACTERS.test(v), "control characters not allowed")
  .transform((v) => v.trim().toLowerCase())
  .refine(
    (v) => v.length >= 3 && v.length <= MAX_EMAIL_LENGTH,
    "invalid email length",
  )
  .refine((v) => EMAIL_FORMAT.test(v), "invalid email format");

const passwordSchema = z
  .string()
  .min(1)
  .refine(
    (v) => Buffer.byteLength(v, "utf8") <= MAX_PASSWORD_BYTES,
    `password must be at most ${MAX_PASSWORD_BYTES} bytes`,
  );

const newPasswordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH)
  .refine(
    (v) => Buffer.byteLength(v, "utf8") <= MAX_PASSWORD_BYTES,
    `password must be at most ${MAX_PASSWORD_BYTES} bytes`,
  );

// `.strict()` is not used: unknown keys are dropped, never trusted. A body
// carrying `role: "superadmin"` or `adminId: 999` is silently ignored.
const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const changePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: newPasswordSchema,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toPublicAdmin(admin: AdminUser): PublicAdminUser {
  return {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    isActive: admin.isActive,
    lastLoginAt: admin.lastLoginAt,
    createdAt: admin.createdAt,
  };
}

/** Promisified session.regenerate — prevents session fixation on login. */
function regenerateSession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => (err ? reject(err) : resolve()));
  });
}

function saveSession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.save((err) => (err ? reject(err) : resolve()));
  });
}

function destroySession(req: Request): Promise<void> {
  return new Promise((resolve) => {
    if (!req.session) return resolve();
    req.session.destroy(() => resolve());
  });
}

/**
 * Revokes every OTHER session belonging to this admin, leaving the caller
 * signed in. Used after a password change so a stolen session dies with the
 * credential that created it.
 *
 * Works against any store implementing `all()` — memorystore returns a map
 * keyed by sid, some stores return an array; both shapes are handled.
 */
async function destroyOtherSessions(
  req: Request,
  adminId: number,
): Promise<void> {
  const store = req.sessionStore;
  if (!store?.all || !store.destroy) return;

  const sessions = await new Promise<Record<string, any> | any[] | null>(
    (resolve) => {
      try {
        store.all!((err: unknown, result: any) =>
          resolve(err ? null : result ?? null),
        );
      } catch {
        resolve(null);
      }
    },
  );
  if (!sessions) return;

  const entries: Array<[string, any]> = Array.isArray(sessions)
    ? sessions.map((s) => [s?.sid ?? s?.id, s])
    : Object.entries(sessions);

  await Promise.all(
    entries
      .filter(
        ([sid, data]) =>
          sid && sid !== req.sessionID && data?.adminId === adminId,
      )
      .map(
        ([sid]) =>
          new Promise<void>((resolve) => store.destroy!(sid, () => resolve())),
      ),
  );
}

function clientIp(req: Request): string | null {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.ip ?? null;
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

/**
 * Gate for every admin-only route.
 *
 * Re-reads the admin from storage on EVERY request rather than trusting what
 * was stamped into the session at login. Without this, deactivating an admin
 * would have no effect until their session happened to expire.
 */
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const adminId = req.session?.adminId;
  if (!adminId) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  try {
    const admin = await storage.getAdminUserById(adminId);
    if (!admin || !admin.isActive) {
      await destroySession(req);
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    req.admin = admin;
    next();
  } catch (error) {
    console.error("[AdminAuth] requireAdmin lookup failed:", error);
    res.status(500).json({ message: "Authentication check failed" });
  }
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

export function registerAdminAuthRoutes(app: Express): void {
  // -------------------------------------------------------------------------
  // POST /api/admin/auth/login
  // -------------------------------------------------------------------------
  app.post("/api/admin/auth/login", async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      // Validation runs before any storage lookup so malformed input never
      // reaches the database and never reveals whether an account exists.
      res.status(400).json({ message: "Invalid email or password format" });
      return;
    }

    const { email, password } = parsed.data;

    try {
      // Lockout is checked first and answered identically for known and
      // unknown emails, so the 429 itself is not an enumeration oracle.
      const failures = await storage.countRecentFailedLogins({
        email,
        withinMinutes: LOCKOUT_WINDOW_MINUTES,
      });
      if (failures >= LOCKOUT_THRESHOLD) {
        res.status(429).json(LOCKED_OUT);
        return;
      }

      const admin = await storage.getAdminUserByEmail(email);

      // Always run a comparison, even with no match, to keep timing flat.
      const hash = admin?.passwordHash ?? DUMMY_HASH;
      const passwordMatches = await bcrypt.compare(password, hash);

      if (!admin || !admin.isActive || !passwordMatches) {
        await storage.recordFailedLogin({
          email,
          ipAddress: clientIp(req),
          userAgent: req.headers["user-agent"] ?? null,
        });
        res.status(401).json(INVALID_CREDENTIALS);
        return;
      }

      // Regenerate before storing identity: a session id chosen by an
      // attacker must not survive into an authenticated session.
      await regenerateSession(req);
      req.session.adminId = admin.id;
      await saveSession(req);

      await storage.clearFailedLogins({ email });
      await storage.updateAdminLastLogin(admin.id);

      res.status(200).json({ admin: toPublicAdmin(admin) });
    } catch (error) {
      console.error("[AdminAuth] login failed:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/admin/auth/logout — idempotent
  // -------------------------------------------------------------------------
  app.post("/api/admin/auth/logout", async (req: Request, res: Response) => {
    await destroySession(req);
    res.clearCookie("cas.sid", { path: "/" });
    res.status(200).json({ message: "Logged out" });
  });

  // -------------------------------------------------------------------------
  // GET /api/admin/auth/me
  // -------------------------------------------------------------------------
  app.get(
    "/api/admin/auth/me",
    requireAdmin,
    (req: Request, res: Response) => {
      res.status(200).json({ admin: toPublicAdmin(req.admin!) });
    },
  );

  // -------------------------------------------------------------------------
  // POST /api/admin/auth/change-password
  // -------------------------------------------------------------------------
  app.post(
    "/api/admin/auth/change-password",
    requireAdmin,
    async (req: Request, res: Response) => {
      const parsed = changePasswordSchema.safeParse(req.body ?? {});
      if (!parsed.success) {
        res.status(400).json({ message: "Invalid password" });
        return;
      }

      const { currentPassword, newPassword } = parsed.data;
      // The target is always the caller. Any `adminId` in the body is ignored.
      const admin = req.admin!;

      try {
        const currentMatches = await bcrypt.compare(
          currentPassword,
          admin.passwordHash,
        );
        if (!currentMatches) {
          res.status(400).json({ message: "Current password is incorrect" });
          return;
        }

        if (await bcrypt.compare(newPassword, admin.passwordHash)) {
          res
            .status(400)
            .json({ message: "New password must differ from the current one" });
          return;
        }

        const hash = await bcrypt.hash(newPassword, BCRYPT_COST);
        await storage.updateAdminPassword(admin.id, hash);

        // Every other session dies with the old credential; the caller stays in.
        await destroyOtherSessions(req, admin.id);

        res.status(200).json({ message: "Password updated" });
      } catch (error) {
        console.error("[AdminAuth] change-password failed:", error);
        res.status(500).json({ message: "Password change failed" });
      }
    },
  );
}
