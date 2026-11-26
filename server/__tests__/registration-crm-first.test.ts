/**
 * POST /api/cas-cann-registration — CRM-first behaviour.
 *
 * Everything that could reach Zoho, the database or a mail server is mocked;
 * DATABASE_URL points at a closed local port as a second guard.
 *
 * What is pinned here:
 *  - a successful push is saved as completed/synced in ONE insert (no window in
 *    which the background worker could see it as pending and push it again)
 *  - a failed or timed-out push is saved pending, held back from the worker for
 *    the grace period
 *  - a push that finishes after the timeout is recorded on the row (only if the
 *    row is still untouched) and the inbox email is sent exactly once
 *  - DB / log failures after a successful push still answer 201 and still send
 *    the inbox email exactly once
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

const h = vi.hoisted(() => {
  process.env.DATABASE_URL = "postgres://nobody:nothing@127.0.0.1:1/none";
  process.env.ZOHO_CLIENT_ID = "";
  process.env.ZOHO_CLIENT_SECRET = "";
  // Anything not explicitly mocked: callable, chainable, awaitable to itself.
  const any: any = new Proxy(function () {}, {
    get: (_t, p) => (p === "then" ? undefined : any),
    apply: () => any,
    construct: () => any,
  });
  const storage: Record<string, any> = {
    createFormSubmission: vi.fn(),
    markPendingSubmissionSynced: vi.fn(),
    updateFormSubmission: vi.fn(),
    createSubmissionLog: vi.fn(),
    createConsentRecord: vi.fn(),
  };
  const storageProxy = new Proxy(storage, {
    get: (t, p: string) => (p in t ? t[p] : any),
  });
  return {
    any,
    storage,
    storageProxy,
    pushToZohoCRM: vi.fn(),
    sendRegistrationNotification: vi.fn(),
  };
});

vi.mock("../db", () => ({ db: h.any, pool: h.any }));
vi.mock("../storage", () => ({ storage: h.storageProxy }));
vi.mock("../zoho-push-service", () => ({ pushToZohoCRM: h.pushToZohoCRM }));
vi.mock("../email-notification-service", () => ({
  emailNotificationService: new Proxy(
    { sendRegistrationNotification: h.sendRegistrationNotification },
    { get: (t: any, p: string) => (p in t ? t[p] : h.any) },
  ),
}));
vi.mock("../zoho-crm-service", () => ({ zohoCRMService: h.any, buildCentralizedZohoData: h.any }));
vi.mock("../dedicated-token-manager", () => ({ dedicatedTokenManager: h.any }));
vi.mock("../oauth-service", () => ({ oauthService: h.any }));
vi.mock("../zoho-workflow-service", () => ({ zohoWorkflowService: h.any, ZohoWorkflowService: h.any }));
vi.mock("../zoho-campaigns-service", () => ({ zohoCampaignsService: h.any }));

import request from "supertest";
import express, { type Express } from "express";
import { registerRoutes } from "../routes";

const BODY = {
  formName: "CAS/CANN Registration Form",
  formData: {
    firstName: "Test",
    lastName: "Person",
    email: "test.person@example.com",
    wantsMembership: "Yes",
    wantsCANNMembership: "No",
    discipline: "Cardiology",
    institution: "Example Hospital",
  },
};

let app: Express;

async function buildApp(): Promise<Express> {
  const a = express();
  a.use(express.json());
  await registerRoutes(a);
  return a;
}

/** Waits for fire-and-forget work (dynamic imports, late promise chains) to settle. */
const settle = () => new Promise((r) => setTimeout(r, 50));

/** A Zoho push the test finishes by hand, after the route's 10 s timeout has fired. */
function deferredPush() {
  let resolve!: (v: { zohoCrmId: string; action: "created" | "updated" }) => void;
  const promise = new Promise<{ zohoCrmId: string; action: "created" | "updated" }>((r) => (resolve = r));
  h.pushToZohoCRM.mockReturnValue(promise);
  return { resolve };
}

beforeEach(async () => {
  vi.clearAllMocks();
  h.storage.createFormSubmission.mockImplementation(async (s: any, init?: any) => ({ id: 101, ...s, ...(init ?? {}) }));
  h.storage.markPendingSubmissionSynced.mockResolvedValue(true);
  h.storage.updateFormSubmission.mockResolvedValue(undefined);
  h.storage.createSubmissionLog.mockResolvedValue({});
  h.storage.createConsentRecord.mockResolvedValue({});
  h.sendRegistrationNotification.mockResolvedValue(undefined);
  if (!app) app = await buildApp();
});

describe("POST /api/cas-cann-registration (CRM-first)", () => {
  it("saves a successful push as synced in a single insert and emails once", async () => {
    h.pushToZohoCRM.mockResolvedValue({ zohoCrmId: "Z1", action: "created" });

    const res = await request(app).post("/api/cas-cann-registration").send(BODY);
    await settle();

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ success: true, submissionId: 101, zohoCrmId: "Z1" });
    expect(h.storage.createFormSubmission).toHaveBeenCalledTimes(1);
    const [, init] = h.storage.createFormSubmission.mock.calls[0];
    expect(init).toMatchObject({ processingStatus: "completed", syncStatus: "synced", zohoCrmId: "Z1", errorMessage: null });
    expect(init.nextRetryAt).toBeUndefined();
    expect(h.storage.updateFormSubmission).not.toHaveBeenCalled();
    expect(h.storage.markPendingSubmissionSynced).not.toHaveBeenCalled();
    expect(h.sendRegistrationNotification).toHaveBeenCalledTimes(1);
    expect(h.sendRegistrationNotification.mock.calls[0][0]).toMatchObject({ leadId: "Z1", membershipType: "CAS", discipline: "Cardiology" });
  });

  it("queues a failed push as pending, held back from the worker, with no email", async () => {
    h.pushToZohoCRM.mockRejectedValue(new Error("Zoho said no"));
    const before = Date.now();

    const res = await request(app).post("/api/cas-cann-registration").send(BODY);
    await settle();

    expect(res.status).toBe(201);
    expect(res.body.zohoCrmId).toBeUndefined();
    const [, init] = h.storage.createFormSubmission.mock.calls[0];
    expect(init.syncStatus).toBeUndefined();
    expect(init.processingStatus).toBeUndefined();
    expect(init.errorMessage).toContain("Zoho said no");
    expect(init.nextRetryAt.getTime()).toBeGreaterThanOrEqual(before + 9 * 60 * 1000);
    expect(h.storage.updateFormSubmission).not.toHaveBeenCalled();
    expect(h.storage.markPendingSubmissionSynced).not.toHaveBeenCalled();
    expect(h.sendRegistrationNotification).not.toHaveBeenCalled();
  });

  it("records a push that succeeds after the timeout and emails once", async () => {
    const push = deferredPush();

    const res = await request(app).post("/api/cas-cann-registration").send(BODY);
    expect(res.status).toBe(201);
    expect(res.body.zohoCrmId).toBeUndefined();
    const [, init] = h.storage.createFormSubmission.mock.calls[0];
    expect(init.errorMessage).toContain("timed out");
    expect(init.nextRetryAt).toBeInstanceOf(Date);
    await settle();
    expect(h.storage.markPendingSubmissionSynced).not.toHaveBeenCalled();
    expect(h.sendRegistrationNotification).not.toHaveBeenCalled();

    push.resolve({ zohoCrmId: "Z2", action: "created" });
    await settle();
    expect(h.storage.markPendingSubmissionSynced).toHaveBeenCalledWith(101, "Z2");
    expect(h.sendRegistrationNotification).toHaveBeenCalledTimes(1);
    expect(h.sendRegistrationNotification.mock.calls[0][0]).toMatchObject({ leadId: "Z2" });
  }, 20_000);

  it("does not email for a late success if the row was already taken", async () => {
    h.storage.markPendingSubmissionSynced.mockResolvedValue(false);
    const push = deferredPush();

    const res = await request(app).post("/api/cas-cann-registration").send(BODY);
    expect(res.status).toBe(201);
    push.resolve({ zohoCrmId: "Z3", action: "created" });
    await settle();
    expect(h.storage.markPendingSubmissionSynced).toHaveBeenCalledWith(101, "Z3");
    expect(h.sendRegistrationNotification).not.toHaveBeenCalled();
  }, 20_000);

  it("emails once if a timed-out push lands after the DB insert failed", async () => {
    h.storage.createFormSubmission.mockRejectedValue(new Error("db down"));
    const push = deferredPush();

    const res = await request(app).post("/api/cas-cann-registration").send(BODY);
    expect(res.status).toBe(500);
    await settle();
    expect(h.sendRegistrationNotification).not.toHaveBeenCalled();

    push.resolve({ zohoCrmId: "Z6", action: "created" });
    await settle();
    expect(h.storage.markPendingSubmissionSynced).not.toHaveBeenCalled();
    expect(h.sendRegistrationNotification).toHaveBeenCalledTimes(1);
    expect(h.sendRegistrationNotification.mock.calls[0][0]).toMatchObject({ leadId: "Z6" });
  }, 20_000);

  it("answers 201 and still emails once when the DB insert fails after a successful push", async () => {
    h.pushToZohoCRM.mockResolvedValue({ zohoCrmId: "Z4", action: "created" });
    h.storage.createFormSubmission.mockRejectedValue(new Error("db down"));

    const res = await request(app).post("/api/cas-cann-registration").send(BODY);
    await settle();

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ success: true, zohoCrmId: "Z4" });
    expect(h.sendRegistrationNotification).toHaveBeenCalledTimes(1);
    expect(h.sendRegistrationNotification.mock.calls[0][0]).toMatchObject({ leadId: "Z4" });
  });

  it("still answers 201 and emails once when the audit log write fails", async () => {
    h.pushToZohoCRM.mockResolvedValue({ zohoCrmId: "Z5", action: "updated" });
    h.storage.createSubmissionLog.mockRejectedValue(new Error("log table locked"));

    const res = await request(app).post("/api/cas-cann-registration").send(BODY);
    await settle();

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ success: true, submissionId: 101, zohoCrmId: "Z5" });
    expect(h.sendRegistrationNotification).toHaveBeenCalledTimes(1);
  });

  it("answers 500 when the push fails and the DB insert fails too", async () => {
    h.pushToZohoCRM.mockRejectedValue(new Error("Zoho said no"));
    h.storage.createFormSubmission.mockRejectedValue(new Error("db down"));

    const res = await request(app).post("/api/cas-cann-registration").send(BODY);
    await settle();

    expect(res.status).toBe(500);
    expect(h.sendRegistrationNotification).not.toHaveBeenCalled();
  });
});
