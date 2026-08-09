# Services Map + Admin Approval + Member Access — Implementation Plan

**Date:** 2026-08-07
**Branch:** re-evaluated against `main`. All plan-relevant files are **byte-identical** on `main` and `staging` — the 3 staging commits touch only summit content (`Events.tsx`, `CANNResources.tsx`, `SummitRecapSection.tsx`, `LanguageContext.tsx`, banner assets). This plan applies unchanged to either branch.
**Status:** Plan approved for scoping. Not yet started.

---

## 1. Goals

1. Show **real data** in the services map instead of the hardcoded fake array.
2. An **admin approves** what appears on the map.
3. **Zoho CRM is the data source** for map records and approval state.
4. **Admin login** backed by the Postgres database.
5. **Member login**, gating access to call recordings.

---

## 2. Decisions locked

| Area | Decision |
|---|---|
| Map rendering | Keep `react-canada-map`; project real coordinates into its 1113×942 SVG space |
| Coordinates | Google Maps Geocoding API, run once per clinic at approval time |
| Approval store | Zoho custom fields (`Map_Approved`, `Map_Latitude`, `Map_Longitude`) |
| Approval UX | Our own admin UI, writing back to Zoho |
| Pin identity | One pin per clinic, merged across members |
| Public read path | Postgres `map_clinics` table — **no in-memory cache, no sync jobs** |
| Admin auth | New `admin_users` table |
| Member auth | Magic link / email OTP, verified against Zoho membership |
| Recording tiers | Public / Members / CANN-only |
| Recording hosting | **Deferred** — to be decided |
| Directory page scope | Map + its shared List View only. Other page content out of scope |

### Explicitly rejected along the way

- **In-memory cache** — measured at ~528 bytes/entry (27 clinics = 19 KB, 1,400 = 722 KB), so memory was never the concern. Rejected because it adds a second source of truth, a cold-start path, and cross-task drift for a 1–3 ms latency gain that is invisible next to network RTT.
- **Scheduled sync jobs** — rejected in favour of write-on-approval. See the consequence in §8.2.

---

## 3. Current state

### 3.1 What already works

The **entire Zoho write path is already built.** The join form's Q9 collects map consent and writes these Lead fields:

| Form field | Zoho field |
|---|---|
| `wantsServicesMapInclusion` | `Services_Map_Inclusion` (Yes/No) |
| `centerName` | `Map_Clinic_Name` |
| `streetName` | `Map_Street` |
| `city` | `Map_City` |
| `province` | `Map_Province` |
| `postalCode` | `Map_Postal_Code` |
| `centerPhone` | `Map_Clinic_Phone` |
| `centerFax` | `Map_Clinic_Fax` |

Mapping lives in `server/zoho-crm-service.ts:1913-1929` and the form configs at `server/routes.ts:1315-1319`.

**Data volume:** the SSOT snapshot shows 247 CRM records, ~27 with `Services_Map_Inclusion = Yes`.

### 3.2 What the map does today

- `client/src/data/healthcareCenters.ts` — a hardcoded array of ~25 invented centers with hand-tuned `coordinates: {x, y}` percentages.
- `client/src/components/InteractiveCanadaMap.tsx` — renders `react-canada-map` and absolutely positions marker divs over it using those percentages.
- `client/src/pages/Directory.tsx` (route `/directory`) — has a List View / Map View toggle. **Both views read the same array**, so changing the data source changes both.

> **The map page does not exist in production today.** The committed route on both branches is `{stagingOnly && <Route path="/directory" component={Directory} />}` (`client/src/App.tsx:87`). `isStaging()` returns false when `VITE_ENVIRONMENT=production`, which the Dockerfile sets at build time — so `/directory` 404s on amyloid.ca. Un-gating it is a deliberate go-live step, not a side effect of this work. (An **uncommitted local change** in the current working tree already removes the gate; it is not on any branch.)
- `client/src/components/DirectoryPreviewSection.tsx` — rendered on the homepage, imports the same array.

`react-canada-map` is a fixed **1113×942** SVG with 13 province paths. It exposes **no marker API and no lat/lng support** — only per-province fill/hover colors and an `onClick`.

### 3.3 Auth reality check

- `server/auth-middleware.ts` is 26 lines: a single shared API key (`requireAutomationAuth`).
- Event admin login is hardcoded env credentials (`cannAdmin` / `Townhall2025!`) with base64 basic auth — `server/routes.ts:4190-4211`. No sessions, no hashing.
- `express-session`, `connect-pg-simple`, `passport`, and `passport-local` are all in `package.json` but **never wired into the server**. Dead dependencies.
- **No password hashing library is installed** — no `bcrypt`, `bcryptjs`, or `argon2` — despite `event_admins.password_hash` existing in the schema. That column has never been written to.
- The `users` table stores passwords in **plaintext** and is unused.

**Auth is effectively at zero.** Both existing tables are vestigial.

### 3.3.1 Admin pages are protected by environment gating, not authentication

Every existing admin page is `stagingOnly` — `/admin/data-sync`, `/admin/automation`, `/admin/submissions`, `/admin/resources/moderation`, `/upload-resource`, `/contributor-portal`, `/test-forms`. None of them has a login. Hiding the route *is* the access control.

That protection does not extend to the API. `server/index.prod.ts:90` calls the same `registerRoutes(app)` as dev, so **every Express endpoint is live in production regardless of the frontend flag.** These `/api/admin/*` routes currently have **no auth middleware at all** and are reachable on amyloid.ca:

| Endpoint | `server/routes.ts` | Effect |
|---|---|---|
| `POST /api/admin/reload-tokens` | 2424 | Reloads Zoho OAuth tokens |
| `POST /api/admin/create-zoho-fields` | 2443 | **Creates custom fields in the live CRM** |
| `GET /api/admin/monitoring-status` | 2582 | Exposes system status |
| `POST /api/admin/setup-email-workflows` | 2605 | Configures email workflows |
| `POST /api/setup-form-configurations` | 1295 | **Rewrites form→CRM field mappings** |

The majority of `/api/admin/*` routes *are* protected by `requireAutomationAuth`; these are the gaps. Closing them belongs in **W3** — see §5.

### 3.4 Email

Outbound email currently goes through **Zoho CRM's email API** (`server/email-notification-service.ts`), keyed on a `leadId`. `nodemailer` is installed but unused; no SMTP config is active in `.env.example`.

Relevant to W6: members *are* Zoho Leads, so magic-link emails can ride the existing Zoho path — but that couples login delivery to CRM availability. Decide before building W6.

---

## 4. Architecture

```
Join form  ──►  Zoho Lead (Services_Map_Inclusion = Yes)
                      │
                      ▼
              Admin UI: Pending queue        ← live Zoho read, admin page only
                      │
                  [Approve]
                      │
    ┌─────────────────┼──────────────────┐
    ▼                 ▼                  ▼
 Geocode         Write to Zoho      Upsert Postgres
 (Google)     (Map_Approved,         (map_clinics)
              Map_Latitude,                │
              Map_Longitude)               │
                                           ▼
                              Public map ── GET /api/map/clinics
```

**Zoho is never in the public read path.** The only writer to `map_clinics` is the admin approval action.

---

## 5. Workstreams

### W1 — Zoho fields + read layer

**Server:** `server/zoho-crm-service.ts`, `scripts/create-map-fields.ts` (new)

1. Create 3 custom Leads fields via a script following the existing `scripts/create-cas-fields.ts` pattern:
   - `Map_Approved` — picklist: `Pending` / `Approved` / `Rejected`
   - `Map_Latitude` — decimal
   - `Map_Longitude` — decimal
2. Add a **COQL / criteria search** method. The service currently has only `getRecords` (unfiltered pagination) and `searchRecordByEmail` — neither can filter on `Services_Map_Inclusion`.
3. Add a write method for the three approval fields.

### W2 — Postgres read model + public API

**Files:** `shared/schema.ts`, `server/storage.ts`, `server/routes.ts`

`map_clinics` table:

| Column | Notes |
|---|---|
| `id` | serial PK |
| `clinic_name` | display name |
| `clinic_name_normalized` | lowercased/trimmed, part of merge key |
| `street`, `city`, `province`, `postal_code` | from Zoho |
| `phone`, `fax` | from Zoho |
| `latitude`, `longitude` | from geocoding |
| `svg_x`, `svg_y` | projected position — **editable**, see §8.1 |
| `zoho_record_ids` | text[] — every Lead merged into this pin |
| `members` | jsonb — name, discipline, subspecialty, amyloidosis type |
| `published_at`, `updated_at` | |

Unique index on `(clinic_name_normalized, postal_code)` — the merge key.

**Endpoint:** `GET /api/map/clinics` — public, reads this table only.

### W3 — Admin authentication

**Files:** `shared/schema.ts`, `server/auth-middleware.ts`, `server/index.ts`, `scripts/seed-admin.ts` (new)

1. Install `bcrypt` + `@types/bcrypt`.
2. `admin_users` table: `email` (unique), `password_hash`, `role`, `is_active`, `last_login_at`, `created_at`.
3. Wire `express-session` + `connect-pg-simple` (already dependencies) so sessions are durable and shared across ECS tasks.
4. `requireAdmin` middleware plus the route contract below.

**Route contract** — must live in its own `server/admin-auth-routes.ts`, not inside the 4,468-line `registerRoutes`, so it can be tested without booting Zoho, the sync worker, and the DB. The `/api/admin/auth/*` namespace avoids colliding with the existing `POST /api/admin/events/login`.

| Method | Route | Success | Failure |
|---|---|---|---|
| `POST` | `/api/admin/auth/login` | 200 + session cookie | 400 invalid body · 401 bad creds or inactive · 429 locked out |
| `POST` | `/api/admin/auth/logout` | 200 (idempotent) | — |
| `GET` | `/api/admin/auth/me` | 200 + admin profile | 401 no/invalid session, or deactivated mid-session |
| `POST` | `/api/admin/auth/change-password` | 200 | 400 wrong current or weak new · 401 unauthenticated |

Rules the contract enforces: identical response for unknown-email and wrong-password (no user enumeration); password hash never serialized; session id regenerated on login; sessions revoked when an admin is deactivated or changes password; lockout after repeated failures; the automation API key is **not** accepted as admin auth.

Forgot-password is deliberately excluded — for a handful of trusted admins, a CLI reset avoids putting an email-delivery dependency in the login path.

**Tests:** `server/__tests__/admin-auth.test.ts` (vitest + supertest, storage mocked, `memorystore` session store). Written specification-first — they fail until this workstream lands.
5. Seed script for the first admin.
6. **Retire** the hardcoded `cannAdmin` / `Townhall2025!` credentials at `server/routes.ts:4191` and migrate `/eventsdownload` onto the new session auth.
7. **Close the unauthenticated `/api/admin/*` endpoints listed in §3.3.1** by applying `requireAdmin`. These are live in production today.

### W4 — Map admin UI

**Files:** `client/src/pages/admin/MapModeration.tsx` (new), `client/src/App.tsx`, `server/routes.ts`

- **Pending tab** — live Zoho query for `Services_Map_Inclusion = Yes AND Map_Approved != Approved`. Shows submitted clinic details for review.
- **Approve** — single request: geocode → write approval + coordinates to Zoho → upsert `map_clinics`.
- **Reject** — writes `Map_Approved = Rejected`, no Postgres row.
- **Published tab** — everything currently live, with per-row **re-sync from Zoho** and **remove**, plus **re-sync all**. This is the manual path for honouring a consent withdrawal made directly in the CRM (see §8.2).
- Editable `svg_x` / `svg_y` nudge control (see §8.1).

> **This page must NOT follow the `stagingOnly` pattern.** Admins have to approve records in production for the live map, so it is gated by **authentication** (`requireAdmin` from W3), not by environment. This is why W3 is a hard prerequisite — see §6.

### W5 — Map frontend

**Files:** `client/src/lib/canadaProjection.ts` (new), `client/src/components/InteractiveCanadaMap.tsx`, `client/src/pages/Directory.tsx`, `client/src/components/DirectoryPreviewSection.tsx`

1. **Projection module** — lat/lng → SVG x/y for the 1113×942 viewBox. Fit a Lambert Conformal Conic against known city positions, validate against held-out cities.
2. Replace the `healthcareCenters` import with `GET /api/map/clinics`; delete the fake array.
3. Merged-clinic popup listing the specialists at that centre.
4. Loading and empty states — the map launches empty (see §7).

### W6 — Member login + gated recordings

**Files:** `shared/schema.ts`, `server/member-auth-service.ts` (new), `client/src/pages/MemberLogin.tsx` (new), recordings page

1. `login_tokens` (single-use, expiring) and `member_sessions` tables.
2. Magic link flow: enter email → match against Zoho Leads → issue token → email link → verify → session cookie.
3. `recordings` table with `access_tier` enum (`public` / `members` / `cann_only`) and a **nullable** URL, so the hosting decision stays open.
4. Tier resolution: `members` = CAS or CANN member; `cann_only` = `CANN_Member = Yes` in Zoho.
5. **Gating enforced server-side on the fetch**, not by hiding UI.

---

## 6. Sequencing

> **Revised after re-evaluating against `main`.** The original plan had W3/W4 as an optional phase 2 behind a public map launch. That ordering does not work — see below.

| Phase | Workstreams | Outcome |
|---|---|---|
| 1 | W1 → W2 | Zoho fields, read layer, `map_clinics` table, public endpoint |
| 2 | **W3 → W4** | Admin auth + moderation UI, deployed to production |
| 3 | W5 + un-gate `/directory` | Real map goes live |
| 4 | W6 | Member login + gated recordings |

**Why W3/W4 must ship before the map goes live.** The only writer to `map_clinics` is the admin approval action (§4). If the moderation UI existed only on staging, approvals would populate the *staging* database, and production's `map_clinics` would stay empty — a live map with nothing on it. So admin auth and the moderation UI have to be in production before, or in the same release as, un-gating `/directory`.

> **Verify before building:** confirm whether staging and production point at separate `DATABASE_URL` values. Separate databases is the assumption above and the likely reality (`.env.example` and `.env.staging.example` are distinct files). If they *share* a database, phase 2 and 3 can be decoupled — but a shared production database being writable from staging is its own problem worth knowing about.

W6 remains independent and can run in parallel with any phase.

**Before committing to estimates:** run the W5 projection spike (§8.1).

---

## 7. Assumption carried

**All ~27 existing consented records start as `Pending`.** The map launches empty and fills as an admin reviews. This is the safe default for a public medical directory publishing real clinician names and clinic addresses that have never been verified. One sitting of admin work.

*This was not explicitly confirmed and can be flipped to auto-approve.*

---

## 8. Risks

### 8.1 Projection fit — the one genuine unknown

`react-canada-map`'s SVG projection is undocumented and unverified. If a Lambert Conformal Conic fit is poor, pins land in the wrong place.

**Mitigation:** store `svg_x` / `svg_y` as **editable** columns rather than purely derived, so an admin can nudge a pin. Spike this before estimating W5.

### 8.2 Consent withdrawal does not propagate

With no sync job, Postgres only learns what the admin UI tells it. Two flavours:

- An address edited in the CRM goes stale on the map. **Minor.**
- **A member withdrawing map consent in the CRM keeps appearing on the public map.** This is a consent problem, not staleness — and this codebase takes that seriously, with `consent_records` and `consent_history` carrying explicit CASL burden-of-proof comments.

There is no self-service path to catch it either: `client/src/pages/CommunicationsPreferences.tsx` is currently a **static page with no API calls at all**, and covers only CAS/CANN communication topics, not `Services_Map_Inclusion`.

**Mitigation:** W4's Published tab with per-row remove and re-sync. Depends on staff actually using it. Consider a follow-up to wire map consent into the preferences page.

### 8.3 Address data quality

27 hand-typed addresses; some will fail geocoding. Needs a visible **"could not geocode"** state in the admin UI rather than a silent drop.

### 8.4 Deployment topology unconfirmed

The ECS task definition is not in this repo. If `desiredCount > 1`, session storage must be shared — which `connect-pg-simple` in W3 already handles. Verify:

```bash
aws ecs describe-services --cluster cas-cann26 \
  --service cas-website-task-service-k7z3yzx3 \
  --query 'services[0].desiredCount'
```

---

## 9. Out of scope

- The rest of `/directory`: the second hardcoded `treatmentCenters` array, typed-in per-province counts, `programTypes` counts, and the `registries` block (`Canadian Registry for Amyloidosis Research (CRAP)` — 500+ participants; `CAPER` — 300+). **These appear to be invented and remain on the live page.** Recommend CAS confirms whether they are real, separately from this work.
- Recording hosting and upload pipeline — deferred.
- Auditing the other `stagingOnly` admin pages (`/admin/data-sync`, `/admin/automation`, `/admin/submissions`, `/contributor-portal`, `/upload-resource`) for whether they should move onto real auth. W3 closes their *API* gaps (§3.3.1); migrating the pages themselves is a separate call.

---

## 10. Go-live checklist for the map

Not code — decisions and steps that must accompany the release.

1. **Un-gate `/directory`** — remove `stagingOnly` from `client/src/App.tsx:87`. Currently a 404 in production.
2. **Add a nav entry.** There is no link to `/directory` in the Header or Footer. The only entry points today are two links in the homepage `DirectoryPreviewSection`. If this is meant to be a discoverable public services map, it needs a nav item.
3. **Homepage preview.** `DirectoryPreviewSection` renders on `/` and reads the same fake array — it must move to the API in the same release, or it will show invented centers on the homepage while `/directory` shows real ones.
4. **Confirm the first admin account** is seeded in the production database before launch.
5. **Confirm the ~27 pending records** have been reviewed, or accept that the map launches empty (§7).
