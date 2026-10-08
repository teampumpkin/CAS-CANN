import crypto from "crypto";
import type { Express, Request, Response } from "express";

/**
 * Staging password gate.
 *
 * The staging site must not be open to the public. When the site is in staging
 * mode (VITE_ENVIRONMENT is anything but "production" — the same flag that
 * switches on staging-only features, see client/src/hooks/useEnvironment.ts)
 * and STAGING_PASSWORD is set, every page and API call needs the password first.
 *
 * Production is never gated: the gate needs STAGING_PASSWORD, which production
 * does not set. (The production container does not carry VITE_ENVIRONMENT at
 * runtime, so the password is what keeps the gate off there.)
 *
 * Registered at the top of registerRoutes, so it covers every route registered
 * after it plus the page and asset serving. The admin console routes are
 * mounted before registerRoutes and stay behind their own admin login.
 */

export const STAGING_ACCESS_PATH = "/staging-access";
const COOKIE_NAME = "cas_staging_access";
const COOKIE_MAX_AGE_SECONDS = 24 * 60 * 60; // 24 hours
// Health checks must keep working, or the host marks the app as down.
const OPEN_PATHS = new Set(["/health", "/ping", "/api/health"]);
const MAX_ATTEMPTS = 10;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

export function isStagingMode(): boolean {
  return process.env.VITE_ENVIRONMENT !== "production";
}

function signature(password: string, issuedAt: number): string {
  return crypto
    .createHmac("sha256", process.env.SESSION_SECRET || "cas-staging-gate")
    .update(`staging-access:${issuedAt}:${password}`)
    .digest("hex");
}

/**
 * Proof the password was entered, as "<issued-at ms>.<signature>". The server
 * checks the age itself, so access ends after COOKIE_MAX_AGE_SECONDS even if a
 * browser keeps the cookie longer. Changing the password invalidates every cookie.
 */
function issueToken(password: string): string {
  const issuedAt = Date.now();
  return `${issuedAt}.${signature(password, issuedAt)}`;
}

function isValidToken(token: string, password: string): boolean {
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const issuedAt = Number(token.slice(0, dot));
  if (!Number.isSafeInteger(issuedAt)) return false;
  const age = Date.now() - issuedAt;
  // Allow a minute of clock skew for tokens issued "in the future".
  if (age < -60_000 || age > COOKIE_MAX_AGE_SECONDS * 1000) return false;
  return safeEqual(token.slice(dot + 1), signature(password, issuedAt));
}

/** Constant-time comparison that also works for strings of different lengths. */
function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) {
      try {
        return decodeURIComponent(part.slice(eq + 1).trim());
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}

/** Only same-site paths, so the form can't be used as an open redirect. */
export function safeNextPath(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\") ||
    value.startsWith(STAGING_ACCESS_PATH)
  ) {
    return "/";
  }
  return value;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Self-contained page: the site's own scripts and styles are locked too. */
function renderAccessPage(res: Response, status: number, next: string, error?: string): void {
  res
    .status(status)
    .set({
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    })
    .send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Staging site · Canadian Amyloidosis Society</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 16px; background: #0b1120; color: #e2e8f0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  main { width: 100%; max-width: 380px; background: #111a2e; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 32px 28px; }
  .badge { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
    color: #0b1120; background: linear-gradient(90deg, #00AFE6, #00DD89); border-radius: 999px; padding: 4px 12px; }
  h1 { font-size: 22px; margin: 16px 0 6px; }
  p { margin: 0 0 20px; color: #94a3b8; font-size: 14px; line-height: 1.5; }
  label { display: block; font-size: 14px; margin-bottom: 6px; }
  input { width: 100%; height: 44px; border-radius: 12px; border: 1px solid #334155; background: #0b1120;
    color: #e2e8f0; padding: 0 14px; font-size: 15px; }
  input:focus { outline: 2px solid #00AFE6; outline-offset: 1px; }
  button { width: 100%; height: 44px; margin-top: 16px; border: 0; border-radius: 12px; cursor: pointer;
    font-size: 15px; font-weight: 600; color: #fff; background: linear-gradient(90deg, #00AFE6, #00DD89); }
  .error { margin: 12px 0 0; color: #fca5a5; font-size: 14px; }
</style>
</head>
<body>
<main>
  <span class="badge">STAGING</span>
  <h1>Canadian Amyloidosis Society</h1>
  <p>This is a private preview of the website. Enter the staging password to continue.</p>
  <form method="post" action="${STAGING_ACCESS_PATH}">
    <input type="hidden" name="next" value="${escapeHtml(next)}">
    <label for="password">Staging password</label>
    <input id="password" name="password" type="password" autocomplete="current-password" required autofocus>
    ${error ? `<p class="error" role="alert">${escapeHtml(error)}</p>` : ""}
    <button type="submit">Enter site</button>
  </form>
</main>
</body>
</html>`);
}

export function registerStagingGate(app: Express): void {
  if (!isStagingMode()) return;

  const password = process.env.STAGING_PASSWORD;
  if (!password) {
    console.warn("[Staging Gate] Off: STAGING_PASSWORD is not set.");
    return;
  }

  const attemptsByIp = new Map<string, number[]>();
  console.log("[Staging Gate] On: visitors must enter the staging password.");

  const hasAccess = (req: Request) => {
    const token = readCookie(req, COOKIE_NAME);
    return !!token && isValidToken(token, password);
  };

  app.get(STAGING_ACCESS_PATH, (req, res) => {
    const next = safeNextPath(req.query.next);
    if (hasAccess(req)) return res.redirect(303, next);
    renderAccessPage(res, 200, next);
  });

  app.post(STAGING_ACCESS_PATH, (req, res) => {
    const next = safeNextPath(req.body?.next);
    const ip = req.ip || "unknown";
    const now = Date.now();
    const recent = (attemptsByIp.get(ip) || []).filter((t) => now - t < ATTEMPT_WINDOW_MS);

    if (recent.length >= MAX_ATTEMPTS) {
      attemptsByIp.set(ip, recent);
      return renderAccessPage(res, 429, next, "Too many attempts. Please wait 15 minutes and try again.");
    }

    const submitted = typeof req.body?.password === "string" ? req.body.password : "";
    if (!safeEqual(submitted, password)) {
      recent.push(now);
      attemptsByIp.set(ip, recent);
      return renderAccessPage(res, 401, next, "That password is not correct.");
    }

    attemptsByIp.delete(ip);
    res.cookie(COOKIE_NAME, issueToken(password), {
      httpOnly: true,
      sameSite: "lax",
      secure: req.secure,
      maxAge: COOKIE_MAX_AGE_SECONDS * 1000,
      path: "/",
    });
    res.redirect(303, next);
  });

  app.use((req, res, next) => {
    if (OPEN_PATHS.has(req.path) || hasAccess(req)) return next();

    res.set({ "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" });
    const wantsPage = (req.method === "GET" || req.method === "HEAD") && !req.path.startsWith("/api/") && req.accepts("html");
    if (wantsPage) {
      return renderAccessPage(res, 401, safeNextPath(req.originalUrl));
    }
    res.status(401).json({
      code: "staging_locked",
      message: "This staging site requires the staging password.",
    });
  });
}
