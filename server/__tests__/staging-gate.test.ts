/**
 * Staging password gate — behaviour tests.
 *
 * The gate reads VITE_ENVIRONMENT and STAGING_PASSWORD when it is registered,
 * so each test sets the environment first and then builds a fresh app.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import request from "supertest";
import express, { type Express } from "express";
import { registerStagingGate, safeNextPath, STAGING_ACCESS_PATH } from "../staging-gate";

const PASSWORD = "correct horse battery staple";

function buildApp(): Express {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  registerStagingGate(app);
  app.get("/ping", (_req, res) => res.send("pong"));
  app.get("/health", (_req, res) => res.json({ status: "healthy" }));
  app.get("/api/events", (_req, res) => res.json({ events: [] }));
  app.get("*", (_req, res) => res.type("html").send("<p>the site</p>"));
  return app;
}

/** Signs in through the form and returns the access cookie. */
async function signIn(app: Express): Promise<string> {
  const res = await request(app)
    .post(STAGING_ACCESS_PATH)
    .type("form")
    .send({ password: PASSWORD, next: "/" });
  expect(res.status).toBe(303);
  const cookie = res.headers["set-cookie"]?.[0];
  expect(cookie).toBeTruthy();
  return cookie!.split(";")[0];
}

const savedEnv = { ...process.env };

beforeEach(() => {
  delete process.env.VITE_ENVIRONMENT;
  delete process.env.STAGING_PASSWORD;
  process.env.SESSION_SECRET = "test-session-secret";
});

afterEach(() => {
  process.env = { ...savedEnv };
  vi.restoreAllMocks();
});

describe("when the gate is off", () => {
  it("leaves production open even if a staging password is set", async () => {
    process.env.VITE_ENVIRONMENT = "production";
    process.env.STAGING_PASSWORD = PASSWORD;
    const app = buildApp();

    expect((await request(app).get("/").accept("html")).status).toBe(200);
    expect((await request(app).get("/api/events")).status).toBe(200);
  });

  it("leaves staging open when no staging password is set", async () => {
    const app = buildApp();

    expect((await request(app).get("/").accept("html")).status).toBe(200);
    expect((await request(app).get("/api/events")).status).toBe(200);
  });
});

describe("when the site is in staging mode with a password", () => {
  beforeEach(() => {
    process.env.STAGING_PASSWORD = PASSWORD;
  });

  it("shows the password page instead of the site", async () => {
    const res = await request(buildApp()).get("/about").accept("html");

    expect(res.status).toBe(401);
    expect(res.text).toContain("Staging password");
    expect(res.text).toContain('value="/about"');
    expect(res.text).not.toContain("the site");
  });

  it("blocks API calls with a JSON error", async () => {
    const res = await request(buildApp()).get("/api/events");

    expect(res.status).toBe(401);
    expect(res.body.code).toBe("staging_locked");
  });

  it("keeps health checks open", async () => {
    const app = buildApp();

    expect((await request(app).get("/health")).status).toBe(200);
    expect((await request(app).get("/ping")).status).toBe(200);
  });

  it("rejects a wrong password", async () => {
    const res = await request(buildApp())
      .post(STAGING_ACCESS_PATH)
      .type("form")
      .send({ password: "wrong", next: "/" });

    expect(res.status).toBe(401);
    expect(res.text).toContain("That password is not correct.");
    expect(res.headers["set-cookie"]).toBeUndefined();
  });

  it("lets the visitor in after the right password", async () => {
    const app = buildApp();
    const res = await request(app)
      .post(STAGING_ACCESS_PATH)
      .type("form")
      .send({ password: PASSWORD, next: "/about" });

    expect(res.status).toBe(303);
    expect(res.headers.location).toBe("/about");

    const cookie = await signIn(app);
    const page = await request(app).get("/about").accept("html").set("Cookie", cookie);
    expect(page.status).toBe(200);
    expect(page.text).toContain("the site");

    const api = await request(app).get("/api/events").set("Cookie", cookie);
    expect(api.status).toBe(200);
  });

  it("ignores a forged access cookie", async () => {
    const res = await request(buildApp())
      .get("/api/events")
      .set("Cookie", "cas_staging_access=not-the-real-token");

    expect(res.status).toBe(401);
  });

  it("sets the access cookie to last 24 hours", async () => {
    const res = await request(buildApp())
      .post(STAGING_ACCESS_PATH)
      .type("form")
      .send({ password: PASSWORD, next: "/" });

    expect(res.headers["set-cookie"]?.[0]).toContain("Max-Age=86400");
  });

  it("asks for the password again after 24 hours", async () => {
    const app = buildApp();
    const signedInAt = Date.now();
    const cookie = await signIn(app);

    vi.spyOn(Date, "now").mockReturnValue(signedInAt + 23 * 60 * 60 * 1000);
    expect((await request(app).get("/api/events").set("Cookie", cookie)).status).toBe(200);

    vi.spyOn(Date, "now").mockReturnValue(signedInAt + 25 * 60 * 60 * 1000);
    expect((await request(app).get("/api/events").set("Cookie", cookie)).status).toBe(401);
  });

  it("stops accepting old cookies when the password changes", async () => {
    const cookie = await signIn(buildApp());

    process.env.STAGING_PASSWORD = "a new password";
    const res = await request(buildApp()).get("/api/events").set("Cookie", cookie);
    expect(res.status).toBe(401);
  });

  it("will not redirect to another site after sign-in", async () => {
    const res = await request(buildApp())
      .post(STAGING_ACCESS_PATH)
      .type("form")
      .send({ password: PASSWORD, next: "//evil.example" });

    expect(res.status).toBe(303);
    expect(res.headers.location).toBe("/");
  });

  it("slows down repeated wrong guesses", async () => {
    const app = buildApp();
    for (let i = 0; i < 10; i++) {
      await request(app).post(STAGING_ACCESS_PATH).type("form").send({ password: "wrong" });
    }
    const res = await request(app)
      .post(STAGING_ACCESS_PATH)
      .type("form")
      .send({ password: PASSWORD });

    expect(res.status).toBe(429);
  });
});

describe("safeNextPath", () => {
  it("keeps same-site paths and drops everything else", () => {
    expect(safeNextPath("/members-portal?tab=events")).toBe("/members-portal?tab=events");
    expect(safeNextPath("https://evil.example")).toBe("/");
    expect(safeNextPath("//evil.example")).toBe("/");
    expect(safeNextPath("/\\evil.example")).toBe("/");
    expect(safeNextPath(`${STAGING_ACCESS_PATH}?next=/`)).toBe("/");
    expect(safeNextPath(undefined)).toBe("/");
  });
});
