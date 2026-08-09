/**
 * Admin authentication — route contract tests.
 *
 * STATUS: specification-first. These tests describe the contract for W3 of
 * docs/SERVICES_MAP_AND_MEMBER_ACCESS_PLAN_2026-08-07.md and will FAIL until
 * server/admin-auth-routes.ts exists. That is intentional — they are the spec.
 *
 * Scope is admin AUTH only:
 *   POST /api/admin/auth/login
 *   POST /api/admin/auth/logout
 *   GET  /api/admin/auth/me
 *   POST /api/admin/auth/change-password
 *   plus the requireAdmin middleware, exercised through a synthetic route.
 *
 * Admin user management (create/list/deactivate) and the map moderation
 * endpoints are out of scope and belong in their own suites.
 *
 * Storage is mocked so the suite is hermetic: no Postgres, no Zoho, no network.
 */

import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import request from "supertest";
import express, { type Express } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import bcrypt from "bcryptjs";

// ---------------------------------------------------------------------------
// Mocked storage layer
// ---------------------------------------------------------------------------

const mockStorage = {
  getAdminUserByEmail: vi.fn(),
  getAdminUserById: vi.fn(),
  updateAdminLastLogin: vi.fn(),
  updateAdminPassword: vi.fn(),
  countRecentFailedLogins: vi.fn(),
  recordFailedLogin: vi.fn(),
  clearFailedLogins: vi.fn(),
};

vi.mock("../storage", () => ({ storage: mockStorage }));

// Will not resolve until W3 is implemented. That is the point.
const { registerAdminAuthRoutes, requireAdmin } = await import(
  "../admin-auth-routes"
);

// ---------------------------------------------------------------------------
// Constants & fixtures
// ---------------------------------------------------------------------------

const VALID_PASSWORD = "correct-horse-battery-staple";
const NEW_PASSWORD = "another-long-passphrase-99";
const ADMIN_EMAIL = "admin@amyloid.ca";

/** bcrypt silently ignores input beyond 72 bytes — see the truncation suite. */
const BCRYPT_MAX_BYTES = 72;
const MIN_BCRYPT_COST = 12;
const MAX_EMAIL_LENGTH = 320;
const LOCKOUT_THRESHOLD = 5;

let PASSWORD_HASH: string;

function makeAdmin(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    email: ADMIN_EMAIL,
    passwordHash: PASSWORD_HASH,
    role: "admin",
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  };
}

function buildApp(): Express {
  const app = express();
  app.use(express.json());

  const MemoryStore = createMemoryStore(session);
  app.use(
    session({
      secret: "test-secret",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({ checkPeriod: 86_400_000 }),
      cookie: { httpOnly: true, sameSite: "lax", maxAge: 8 * 60 * 60 * 1000 },
    }),
  );

  registerAdminAuthRoutes(app);

  // Synthetic protected route — exercises requireAdmin in isolation.
  app.get("/api/test/protected", requireAdmin, (_req, res) =>
    res.json({ ok: true }),
  );

  // Test-only route that forces an anonymous session to exist, so the
  // session-fixation test has a real pre-login cookie to compare against.
  // Without this, saveUninitialized:false means no cookie is ever issued
  // pre-login and the assertion passes vacuously.
  app.get("/api/test/seed-session", (req, res) => {
    (req.session as unknown as Record<string, unknown>).seeded = true;
    res.json({ ok: true });
  });

  return app;
}

function cookiesOf(res: request.Response): string[] {
  return (res.headers["set-cookie"] as unknown as string[]) ?? [];
}

/** Extract the raw connect.sid value (id + signature) from a Set-Cookie list. */
function sidOf(res: request.Response): string | undefined {
  const raw = cookiesOf(res).find((c) => c.startsWith("connect.sid="));
  return raw?.split(";")[0].split("=")[1];
}

async function loginAgent(app: Express, password = VALID_PASSWORD) {
  const agent = request.agent(app);
  const res = await agent
    .post("/api/admin/auth/login")
    .send({ email: ADMIN_EMAIL, password });
  expect(res.status).toBe(200);
  return agent;
}

beforeAll(async () => {
  PASSWORD_HASH = await bcrypt.hash(VALID_PASSWORD, MIN_BCRYPT_COST);
});

beforeEach(() => {
  vi.clearAllMocks();
  mockStorage.getAdminUserByEmail.mockResolvedValue(makeAdmin());
  mockStorage.getAdminUserById.mockResolvedValue(makeAdmin());
  mockStorage.countRecentFailedLogins.mockResolvedValue(0);
  mockStorage.updateAdminLastLogin.mockResolvedValue(undefined);
  mockStorage.updateAdminPassword.mockResolvedValue(undefined);
  mockStorage.recordFailedLogin.mockResolvedValue(undefined);
  mockStorage.clearFailedLogins.mockResolvedValue(undefined);
});

// ---------------------------------------------------------------------------
// POST /api/admin/auth/login — happy path
// ---------------------------------------------------------------------------

describe("POST /api/admin/auth/login — success", () => {
  it("returns 200 and the admin profile for valid credentials", async () => {
    const res = await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: VALID_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.admin).toMatchObject({
      id: 1,
      email: ADMIN_EMAIL,
      role: "admin",
    });
  });

  it("sets an HttpOnly, SameSite session cookie", async () => {
    const res = await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: VALID_PASSWORD });

    const jar = cookiesOf(res).join(";");
    expect(jar).toMatch(/HttpOnly/i);
    expect(jar).toMatch(/SameSite=(Lax|Strict)/i);
  });

  it("NEVER returns the password hash", async () => {
    const res = await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: VALID_PASSWORD });

    expect(JSON.stringify(res.body)).not.toContain(PASSWORD_HASH);
    expect(JSON.stringify(res.body)).not.toMatch(/passwordHash|password_hash/);
  });

  it("records the successful login timestamp", async () => {
    await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: VALID_PASSWORD });

    expect(mockStorage.updateAdminLastLogin).toHaveBeenCalledWith(1);
  });

  it("clears the failure counter after a successful login", async () => {
    await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: VALID_PASSWORD });

    expect(mockStorage.clearFailedLogins).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Email handling — normalization
// ---------------------------------------------------------------------------

describe("login — email normalization", () => {
  it.each([
    ["uppercase", "ADMIN@AMYLOID.CA"],
    ["mixed case", "Admin@Amyloid.Ca"],
    ["leading whitespace", "   admin@amyloid.ca"],
    ["trailing whitespace", "admin@amyloid.ca   "],
    ["surrounding whitespace", "  admin@amyloid.ca  "],
    ["tab padded", "\tadmin@amyloid.ca\t"],
  ])("normalizes %s before lookup", async (_label, email) => {
    const res = await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email, password: VALID_PASSWORD });

    expect(res.status).toBe(200);
    expect(mockStorage.getAdminUserByEmail).toHaveBeenCalledWith(ADMIN_EMAIL);
  });
});

// ---------------------------------------------------------------------------
// Email handling — validation
// ---------------------------------------------------------------------------

describe("login — email validation", () => {
  it.each([
    ["empty string", ""],
    ["whitespace only", "   "],
    ["no local part", "@amyloid.ca"],
    ["no domain", "admin@"],
    ["no at sign", "adminamyloid.ca"],
    ["bare word", "not-an-email"],
    ["double at", "admin@@amyloid.ca"],
    ["internal space", "ad min@amyloid.ca"],
    ["trailing comma", "admin@amyloid.ca,"],
    ["no TLD", "admin@localhost"],
    ["leading dot in domain", "admin@.amyloid.ca"],
    ["newline injection", "admin@amyloid.ca\nBcc: attacker@evil.com"],
    ["null byte", "admin@amyloid.ca\u0000"],
    ["carriage return", "admin@amyloid.ca\r"],
    ["over length limit", `${"a".repeat(MAX_EMAIL_LENGTH)}@amyloid.ca`],
  ])("returns 400 for %s", async (_label, email) => {
    const res = await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email, password: VALID_PASSWORD });

    expect(res.status).toBe(400);
    expect(mockStorage.getAdminUserByEmail).not.toHaveBeenCalled();
  });

  it.each([
    ["null", null],
    ["number", 12345],
    ["boolean", true],
    ["array", ["admin@amyloid.ca"]],
    ["object", { toString: "admin@amyloid.ca" }],
    ["nested object", { email: ADMIN_EMAIL }],
  ])("returns 400 when email is a %s, not a string", async (_label, email) => {
    const res = await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email, password: VALID_PASSWORD });

    expect(res.status).toBe(400);
    expect(mockStorage.getAdminUserByEmail).not.toHaveBeenCalled();
  });

  it.each([
    ["SQL injection", "admin@amyloid.ca' OR '1'='1"],
    ["SQL comment", "admin@amyloid.ca'--"],
    ["template injection", "${process.env.DATABASE_URL}@amyloid.ca"],
  ])("never authenticates on %s", async (_label, email) => {
    const res = await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email, password: VALID_PASSWORD });

    expect(res.status).not.toBe(200);
    expect(res.headers["set-cookie"]).toBeUndefined();
  });

  it("accepts an email at exactly the length limit", async () => {
    const local = "a".repeat(MAX_EMAIL_LENGTH - "@amyloid.ca".length);
    const email = `${local}@amyloid.ca`;
    expect(email.length).toBe(MAX_EMAIL_LENGTH);
    mockStorage.getAdminUserByEmail.mockResolvedValue(makeAdmin({ email }));

    const res = await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email, password: VALID_PASSWORD });

    expect(res.status).toBe(200);
  });
});

// ---------------------------------------------------------------------------
// Password validation
// ---------------------------------------------------------------------------

describe("login — password validation", () => {
  it.each([
    ["missing", undefined],
    ["empty string", ""],
    ["null", null],
    ["number", 12345],
    ["boolean", true],
    ["array", ["correct-horse-battery-staple"]],
  ])("returns 400 when password is %s", async (_label, password) => {
    const res = await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password });

    expect(res.status).toBe(400);
  });

  it("returns 400 for an empty body", async () => {
    const res = await request(buildApp()).post("/api/admin/auth/login").send({});
    expect(res.status).toBe(400);
  });

  it("ignores unexpected extra fields rather than trusting them", async () => {
    const res = await request(buildApp()).post("/api/admin/auth/login").send({
      email: ADMIN_EMAIL,
      password: VALID_PASSWORD,
      role: "superadmin",
      isActive: true,
      id: 999,
    });

    expect(res.status).toBe(200);
    expect(res.body.admin.role).toBe("admin");
    expect(res.body.admin.id).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// bcrypt 72-byte truncation
//
// bcrypt hashes only the first 72 bytes of input. Without an explicit length
// cap, a password sharing its first 72 bytes with the real one authenticates.
// ---------------------------------------------------------------------------

describe("login — bcrypt 72-byte truncation", () => {
  const longPassword = "P".repeat(BCRYPT_MAX_BYTES);

  beforeEach(async () => {
    const hash = await bcrypt.hash(longPassword, MIN_BCRYPT_COST);
    mockStorage.getAdminUserByEmail.mockResolvedValue(
      makeAdmin({ passwordHash: hash }),
    );
  });

  it("confirms the underlying truncation this guards against", async () => {
    const hash = await bcrypt.hash(longPassword, MIN_BCRYPT_COST);
    // bcrypt itself accepts the longer string — hence the cap in the route.
    await expect(
      bcrypt.compare(`${longPassword}EXTRA`, hash),
    ).resolves.toBe(true);
  });

  it("rejects a password that only matches within the first 72 bytes", async () => {
    const res = await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: `${longPassword}EXTRA` });

    expect(res.status).not.toBe(200);
    expect(res.headers["set-cookie"]).toBeUndefined();
  });

  it("rejects multi-byte input whose UTF-8 length exceeds 72 bytes", async () => {
    // 25 × 3-byte characters = 75 bytes, but only 25 JS string units —
    // a .length check in the route would miss this.
    const res = await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: "☃".repeat(25) });

    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// Authentication failures
// ---------------------------------------------------------------------------

describe("login — authentication failures", () => {
  it("rejects a wrong password with 401", async () => {
    const res = await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: "wrong-password" });

    expect(res.status).toBe(401);
  });

  it("rejects an unknown email with 401", async () => {
    mockStorage.getAdminUserByEmail.mockResolvedValue(undefined);

    const res = await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email: "nobody@example.com", password: VALID_PASSWORD });

    expect(res.status).toBe(401);
  });

  it("rejects a deactivated admin even with the correct password", async () => {
    mockStorage.getAdminUserByEmail.mockResolvedValue(
      makeAdmin({ isActive: false }),
    );

    const res = await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: VALID_PASSWORD });

    expect(res.status).toBe(401);
  });

  it("does not establish a session for a deactivated admin", async () => {
    mockStorage.getAdminUserByEmail.mockResolvedValue(
      makeAdmin({ isActive: false }),
    );
    const agent = request.agent(buildApp());

    await agent
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: VALID_PASSWORD });

    expect((await agent.get("/api/admin/auth/me")).status).toBe(401);
  });

  it("records each failed attempt", async () => {
    await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: "wrong-password" });

    expect(mockStorage.recordFailedLogin).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Account enumeration
// ---------------------------------------------------------------------------

describe("login — account enumeration", () => {
  it("returns an identical response for wrong password and unknown email", async () => {
    const app = buildApp();

    const wrongPassword = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: "wrong-password" });

    mockStorage.getAdminUserByEmail.mockResolvedValue(undefined);
    const unknownEmail = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: "nobody@example.com", password: VALID_PASSWORD });

    expect(unknownEmail.status).toBe(wrongPassword.status);
    expect(unknownEmail.body).toEqual(wrongPassword.body);
  });

  it("returns an identical response for a deactivated admin", async () => {
    const app = buildApp();

    const wrongPassword = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: "wrong-password" });

    mockStorage.getAdminUserByEmail.mockResolvedValue(
      makeAdmin({ isActive: false }),
    );
    const deactivated = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: VALID_PASSWORD });

    expect(deactivated.status).toBe(wrongPassword.status);
    expect(deactivated.body).toEqual(wrongPassword.body);
  });

  /**
   * Timing-based enumeration: the route must run a dummy bcrypt comparison
   * when no admin matches, so an unknown email costs the same as a wrong
   * password. Asserted by code review, not here — wall-clock assertions are
   * flaky in CI, and mocking bcrypt's CJS default export to count calls is
   * fragile enough to be worse than the gap it closes.
   */
  it.todo("compares against a dummy hash when the admin does not exist");
});

// ---------------------------------------------------------------------------
// Session fixation
// ---------------------------------------------------------------------------

describe("login — session fixation", () => {
  it("issues a different session id than the pre-login anonymous session", async () => {
    const app = buildApp();
    const agent = request.agent(app);

    const seeded = await agent.get("/api/test/seed-session");
    const anonSid = sidOf(seeded);
    // Guard the guard: if no anonymous cookie was issued this proves nothing.
    expect(anonSid).toBeDefined();

    const login = await agent
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: VALID_PASSWORD });

    const authSid = sidOf(login);
    expect(authSid).toBeDefined();
    expect(authSid).not.toBe(anonSid);
  });

  it("does not authenticate a session id chosen by the attacker", async () => {
    const app = buildApp();
    const attackerSid = sidOf(await request(app).get("/api/test/seed-session"));

    await request(app)
      .post("/api/admin/auth/login")
      .set("Cookie", `connect.sid=${attackerSid}`)
      .send({ email: ADMIN_EMAIL, password: VALID_PASSWORD });

    // The pre-seeded id must not have become an authenticated session.
    const res = await request(app)
      .get("/api/admin/auth/me")
      .set("Cookie", `connect.sid=${attackerSid}`);

    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Lockout
// ---------------------------------------------------------------------------

describe("login — lockout", () => {
  it("returns 429 once the threshold is reached, even with the right password", async () => {
    mockStorage.countRecentFailedLogins.mockResolvedValue(LOCKOUT_THRESHOLD);

    const res = await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: VALID_PASSWORD });

    expect(res.status).toBe(429);
    expect(res.headers["set-cookie"]).toBeUndefined();
  });

  it("still permits login one attempt below the threshold", async () => {
    mockStorage.countRecentFailedLogins.mockResolvedValue(
      LOCKOUT_THRESHOLD - 1,
    );

    const res = await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: VALID_PASSWORD });

    expect(res.status).toBe(200);
  });

  it("scopes the counter per account, not globally", async () => {
    await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: "wrong-password" });

    // A global counter would let one attacker lock out every admin.
    expect(mockStorage.countRecentFailedLogins).toHaveBeenCalledWith(
      expect.objectContaining({ email: ADMIN_EMAIL }),
    );
    expect(mockStorage.recordFailedLogin).toHaveBeenCalledWith(
      expect.objectContaining({ email: ADMIN_EMAIL }),
    );
  });

  it("does not lock out a different admin", async () => {
    mockStorage.countRecentFailedLogins.mockImplementation(
      async ({ email }: { email: string }) =>
        email === ADMIN_EMAIL ? LOCKOUT_THRESHOLD : 0,
    );
    const other = "other@amyloid.ca";
    mockStorage.getAdminUserByEmail.mockResolvedValue(
      makeAdmin({ id: 2, email: other }),
    );

    const res = await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email: other, password: VALID_PASSWORD });

    expect(res.status).toBe(200);
  });

  it("bounds the counter to a recent window rather than all time", async () => {
    await request(buildApp())
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: "wrong-password" });

    // Without a window, one bad day locks an admin out permanently.
    expect(mockStorage.countRecentFailedLogins).toHaveBeenCalledWith(
      expect.objectContaining({ withinMinutes: expect.any(Number) }),
    );
  });

  it("does not reveal account validity through the lockout response", async () => {
    mockStorage.countRecentFailedLogins.mockResolvedValue(LOCKOUT_THRESHOLD);
    const app = buildApp();

    const known = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: VALID_PASSWORD });

    mockStorage.getAdminUserByEmail.mockResolvedValue(undefined);
    const unknown = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: "nobody@example.com", password: VALID_PASSWORD });

    expect(unknown.status).toBe(known.status);
    expect(unknown.body).toEqual(known.body);
  });
});

// ---------------------------------------------------------------------------
// GET /api/admin/auth/me
// ---------------------------------------------------------------------------

describe("GET /api/admin/auth/me", () => {
  it("returns the current admin when authenticated", async () => {
    const agent = await loginAgent(buildApp());
    const res = await agent.get("/api/admin/auth/me");

    expect(res.status).toBe(200);
    expect(res.body.admin).toMatchObject({
      id: 1,
      email: ADMIN_EMAIL,
      role: "admin",
    });
  });

  it("never includes the password hash", async () => {
    const agent = await loginAgent(buildApp());
    const res = await agent.get("/api/admin/auth/me");

    expect(JSON.stringify(res.body)).not.toMatch(/passwordHash|password_hash/);
    expect(JSON.stringify(res.body)).not.toContain(PASSWORD_HASH);
  });

  it("returns 401 without a session", async () => {
    expect((await request(buildApp()).get("/api/admin/auth/me")).status).toBe(
      401,
    );
  });

  it.each([
    ["forged", "connect.sid=s%3Aforged-session-id.bogussignature"],
    ["unsigned", "connect.sid=plain-session-id"],
    ["empty", "connect.sid="],
  ])("returns 401 for a %s session cookie", async (_label, cookie) => {
    const res = await request(buildApp())
      .get("/api/admin/auth/me")
      .set("Cookie", cookie);

    expect(res.status).toBe(401);
  });

  it("returns 401 once the admin is deactivated mid-session", async () => {
    const agent = await loginAgent(buildApp());
    mockStorage.getAdminUserById.mockResolvedValue(
      makeAdmin({ isActive: false }),
    );

    expect((await agent.get("/api/admin/auth/me")).status).toBe(401);
  });

  it("returns 401 once the admin is deleted mid-session", async () => {
    const agent = await loginAgent(buildApp());
    mockStorage.getAdminUserById.mockResolvedValue(undefined);

    expect((await agent.get("/api/admin/auth/me")).status).toBe(401);
  });

  it("re-reads the admin on every request rather than trusting the session", async () => {
    const agent = await loginAgent(buildApp());
    mockStorage.getAdminUserById.mockClear();

    await agent.get("/api/admin/auth/me");

    expect(mockStorage.getAdminUserById).toHaveBeenCalledWith(1);
  });
});

// ---------------------------------------------------------------------------
// POST /api/admin/auth/logout
// ---------------------------------------------------------------------------

describe("POST /api/admin/auth/logout", () => {
  it("destroys the session so /me stops authenticating", async () => {
    const agent = await loginAgent(buildApp());

    expect((await agent.post("/api/admin/auth/logout")).status).toBe(200);
    expect((await agent.get("/api/admin/auth/me")).status).toBe(401);
  });

  it("is idempotent when no session exists", async () => {
    expect(
      (await request(buildApp()).post("/api/admin/auth/logout")).status,
    ).toBe(200);
  });

  it("clears the session cookie", async () => {
    const agent = await loginAgent(buildApp());
    const jar = cookiesOf(await agent.post("/api/admin/auth/logout")).join(";");

    expect(jar).toMatch(/connect\.sid=;|Expires=Thu, 01 Jan 1970/i);
  });

  it("does not let a captured cookie be replayed after logout", async () => {
    const app = buildApp();
    const agent = request.agent(app);
    const login = await agent
      .post("/api/admin/auth/login")
      .send({ email: ADMIN_EMAIL, password: VALID_PASSWORD });
    const captured = `connect.sid=${sidOf(login)}`;

    await agent.post("/api/admin/auth/logout");

    const replay = await request(app)
      .get("/api/admin/auth/me")
      .set("Cookie", captured);

    expect(replay.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// POST /api/admin/auth/change-password
// ---------------------------------------------------------------------------

describe("POST /api/admin/auth/change-password", () => {
  const body = { currentPassword: VALID_PASSWORD, newPassword: NEW_PASSWORD };

  it("changes the password with the correct current password", async () => {
    const agent = await loginAgent(buildApp());
    const res = await agent.post("/api/admin/auth/change-password").send(body);

    expect(res.status).toBe(200);
    expect(mockStorage.updateAdminPassword).toHaveBeenCalled();
  });

  it("stores a bcrypt hash, never the plaintext", async () => {
    const agent = await loginAgent(buildApp());
    await agent.post("/api/admin/auth/change-password").send(body);

    const [, storedHash] = mockStorage.updateAdminPassword.mock.calls[0];
    expect(storedHash).not.toBe(NEW_PASSWORD);
    expect(storedHash).toMatch(/^\$2[aby]\$\d{2}\$/);
    await expect(bcrypt.compare(NEW_PASSWORD, storedHash)).resolves.toBe(true);
  });

  it(`uses a bcrypt cost factor of at least ${MIN_BCRYPT_COST}`, async () => {
    const agent = await loginAgent(buildApp());
    await agent.post("/api/admin/auth/change-password").send(body);

    const [, storedHash] = mockStorage.updateAdminPassword.mock.calls[0];
    const cost = Number(storedHash.split("$")[2]);
    expect(cost).toBeGreaterThanOrEqual(MIN_BCRYPT_COST);
  });

  it("returns 401 when not authenticated", async () => {
    const res = await request(buildApp())
      .post("/api/admin/auth/change-password")
      .send(body);

    expect(res.status).toBe(401);
    expect(mockStorage.updateAdminPassword).not.toHaveBeenCalled();
  });

  it("returns 400 when the current password is wrong", async () => {
    const agent = await loginAgent(buildApp());
    const res = await agent.post("/api/admin/auth/change-password").send({
      currentPassword: "not-my-password",
      newPassword: NEW_PASSWORD,
    });

    expect(res.status).toBe(400);
    expect(mockStorage.updateAdminPassword).not.toHaveBeenCalled();
  });

  it.each([
    ["too short", "short"],
    ["empty", ""],
    ["missing", undefined],
    ["null", null],
    ["number", 12345],
    ["same as current", VALID_PASSWORD],
    ["over 72 bytes", "P".repeat(BCRYPT_MAX_BYTES + 1)],
    ["over 72 bytes as UTF-8", "☃".repeat(25)],
  ])("returns 400 when the new password is %s", async (_label, newPassword) => {
    const agent = await loginAgent(buildApp());
    const res = await agent
      .post("/api/admin/auth/change-password")
      .send({ currentPassword: VALID_PASSWORD, newPassword });

    expect(res.status).toBe(400);
    expect(mockStorage.updateAdminPassword).not.toHaveBeenCalled();
  });

  it("changes only the calling admin's password", async () => {
    const agent = await loginAgent(buildApp());
    await agent.post("/api/admin/auth/change-password").send({
      ...body,
      adminId: 999, // must be ignored, not honoured
    });

    const [targetId] = mockStorage.updateAdminPassword.mock.calls[0];
    expect(targetId).toBe(1);
  });

  it("invalidates other sessions after a password change", async () => {
    const app = buildApp();
    const staleAgent = await loginAgent(app);
    const activeAgent = await loginAgent(app);

    await activeAgent.post("/api/admin/auth/change-password").send(body);

    expect((await staleAgent.get("/api/admin/auth/me")).status).toBe(401);
  });

  it("keeps the calling session usable after the change", async () => {
    const agent = await loginAgent(buildApp());
    await agent.post("/api/admin/auth/change-password").send(body);

    expect((await agent.get("/api/admin/auth/me")).status).toBe(200);
  });
});

// ---------------------------------------------------------------------------
// requireAdmin middleware
// ---------------------------------------------------------------------------

describe("requireAdmin middleware", () => {
  it("blocks unauthenticated requests with 401", async () => {
    const res = await request(buildApp()).get("/api/test/protected");

    expect(res.status).toBe(401);
    expect(res.body.ok).toBeUndefined();
  });

  it("allows an authenticated admin through", async () => {
    const agent = await loginAgent(buildApp());
    const res = await agent.get("/api/test/protected");

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it("blocks after logout", async () => {
    const agent = await loginAgent(buildApp());
    await agent.post("/api/admin/auth/logout");

    expect((await agent.get("/api/test/protected")).status).toBe(401);
  });

  it("blocks an admin deactivated mid-session", async () => {
    const agent = await loginAgent(buildApp());
    mockStorage.getAdminUserById.mockResolvedValue(
      makeAdmin({ isActive: false }),
    );

    expect((await agent.get("/api/test/protected")).status).toBe(401);
  });

  it("does not accept the legacy automation API key as admin auth", async () => {
    const res = await request(buildApp())
      .get("/api/test/protected")
      .set("X-Automation-API-Key", "dev-automation-key-change-in-production");

    expect(res.status).toBe(401);
  });

  it("does not accept the legacy event-admin basic auth as admin auth", async () => {
    const basic = Buffer.from("cannAdmin:Townhall2025!").toString("base64");
    const res = await request(buildApp())
      .get("/api/test/protected")
      .set("Authorization", `Basic ${basic}`);

    expect(res.status).toBe(401);
  });
});
