# Milestone 2 — Gap Analysis Against SOW

**Scope:** CAS Website Platform — Map Implementation + Gated Member Access (MVP)
**Assessed:** 2026-08-10, against the `staging` branch and the live QA environment
**Method:** each item verified against running code, the database, and the Zoho CRM — not against intent

---

## 1. Headline

| | |
|---|---|
| Acceptance criteria fully met | **3 of 7** |
| Public map + directory | Substantially built and rendering real data |
| Member Portal (marked *Required*) | **Not started** |
| Clinical trial layer | **Not started** — no field exists in the CRM |
| Dataset readiness | **2 of 119** candidates published |
| SOW delivery dates | **All four have passed** (last was 31 July 2026) |

The build side of the map is in good shape. The two largest gaps are the member
portal and the clinical-trial layer, and the largest *risk* is dataset
completeness, which sits with CAS rather than with the build.

---

## 2. Item-by-item status

### 2.1 Public Geospatial Map (Primary)

| SOW item | Status | Notes |
|---|---|---|
| Homepage-embedded map, institution points (name, city, province) | **Done** | Renders published clinics only |
| Public link per institution | **Pending** | Zoho has a standard `Website` field; not read or displayed |
| Cluster visualization with legend | **Done** | Density-coloured markers, legend retained |
| Normalized architecture for future layers | **Partial** | See §3.1 — one row per CRM lead, not per institution |
| Clinical trial participation at institution level | **Not started** | See §3.2 — no such field in Zoho |
| Filter: participating vs non-participating | **Not started** | Blocked by the above |

### 2.2 Directory Alignment

| SOW item | Status | Notes |
|---|---|---|
| Directory 1:1 with institutional dataset | **Done** | `/directory` and homepage both read `GET /api/map/clinics` |
| Single shared data model | **Done** | One source, one shape |
| Institution detail limited to approved public fields | **Partial** | See §3.3 — currently exceeds scope |

### 2.3 Data Model & Governance

| SOW item | Status | Notes |
|---|---|---|
| Backend-controlled updates, no public edits | **Done** | Publishing is admin-only |
| Moderation before publishing | **Done** | Approve-with-map-preview; nothing reaches the public map unreviewed |
| Structured dataset with geolocation fields | **Partial** | `latitude`/`longitude` populated, but `coordinate_source = city_lookup` on every row — city centroids, not geocoded addresses |
| Registration / submission / admin forms aligned to normalized architecture | **Not started** | No form work done in this milestone |
| Data requirements finalized against validated CAS requirements | **Not started** | CAS decision, still open |

### 2.4 Member Portal (MVP — **Required**)

| SOW item | Status |
|---|---|
| Member login capability | **Not started** |
| Gate content public vs member-only | **Not started** |
| Restrict resources / educational archives | **Not started** |

The admin authentication that exists (`admin_users`, session-based, 97 tests) is
for **CAS staff moderating content**. It is a different audience and does not
satisfy this section. A member portal prototype existed on `staging` and was
removed at CAS/TP direction as design exploration rather than production code;
it is preserved on `backup/staging-before-overwrite-5c21a2f`.

---

## 3. Issues requiring a decision

### 3.1 Data model does not match the agreed merge design

The plan and the SOW both call for an institution-led model. What shipped is
**one row per CRM lead**, keyed on `zoho_record_id`.

Consequence: three clinicians who each name the same hospital produce three
records, not one institution with three affiliated specialists. The map *looks*
merged because markers cluster visually, but the underlying data is not.

At 2 published rows this is cheap to change. At 50+ it becomes a migration with
dedup logic. **Recommend resolving before further publishing.**

### 3.2 Clinical trial participation has no data to render

The SOW requires trial participation at institution level, a participating /
non-participating filter, and non-endorsement language.

**There is no clinical-trial field anywhere in the Zoho Leads module** (all 71
fields checked). This is not a build task yet — it needs a field defined, a
collection method, and CAS-approved non-endorsement wording, before any UI can
be built.

### 3.3 Public pages currently exceed the agreed scope

SOW Non-Scope states: *"Provider-level profiles or personal contact details."*

The institution detail panel currently shows the individual clinician's **name
and professional designation** — e.g. *"Contact at this centre: [name],
Physician."* Amyloidosis type and sub-specialty are defensible as institutional
attributes; the named individual is not.

**Recommend removing the personal name and designation from public output**
before any production release. This is a small change.

### 3.4 Geolocation is city-level, not address-level

Acceptance requires *"All institutions render at correct geographic
coordinates."* Coordinates currently come from a bundled city lookup, so every
clinic in a city resolves to the same point.

At national zoom this is below one rendered pixel and visually indistinguishable.
It becomes material if zoom, or proximity search, is ever added. Address-level
geocoding (Google) is designed but not implemented.

### 3.5 Dataset completeness is the critical path

119 members have opted into the map; **2 are published**. The SOW makes delivery
explicitly conditional on *"a validated single source-of-truth dataset"* and
*"sufficient completeness of institutional and clinic data."*

This is a CAS governance dependency, not a build task, and it currently gates
the first acceptance criterion.

### 3.6 Residual invented content

`/directory` still renders two registries — *"Canadian Registry for Amyloidosis
Research (CRAP)"* (500+ participants) and *"CAPER"* (300+) — plus a secondary
hardcoded treatment-centre list. No evidence these registries exist.

`/directory` is currently `stagingOnly`, so this is not publicly visible, but it
must be resolved before that route is enabled in production.

---

## 4. Acceptance criteria scorecard

| Criterion | Met | Blocking gap |
|---|---|---|
| All institutions render at correct coordinates | ✗ | City-level precision; 2 of 119 published (§3.4, §3.5) |
| Interactions reveal institution-level information only | ✗ | Shows named clinician (§3.3) |
| Directory mirrors the same validated dataset | ✓ | — |
| Clinical trial display includes non-endorsement language | ✗ | No trial feature or data (§3.2) |
| Member login restricts designated private content | ✗ | Not started (§2.4) |
| Registration and admin forms align to normalized data | ✗ | Not started (§2.3) |
| SSOT validated and sufficiently complete | ✗ | CAS dependency (§3.5) |

---

## 5. Recommended sequence

Ordered by dependency, not by effort.

| # | Work | Owner | Notes |
|---|---|---|---|
| 1 | Remove provider-level personal detail from public output | TP | Small; closes a live scope breach |
| 2 | Decide institution-vs-lead data model, migrate | TP + CAS | Cheapest now, at 2 rows |
| 3 | Define clinical-trial field, collection method, non-endorsement wording | **CAS** | Blocks two acceptance criteria |
| 4 | Review and publish the 117 remaining candidates | **CAS** | Gates the first acceptance criterion |
| 5 | Build member login + content gating | TP | The only *Required* item at zero |
| 6 | Align registration/admin forms to the normalized model | TP + CAS | Requires #2 settled first |
| 7 | Address-level geocoding | TP | Optional unless zoom/proximity is wanted |
| 8 | Resolve or remove the registries block | **CAS** | Before `/directory` goes public |

Items 3, 4, and 8 are **CAS decisions and cannot be unblocked by the build team.**

---

## 6. Timeline position

| SOW milestone | Date | Status |
|---|---|---|
| CRM remediation, SSOT validated | 17 Jul 2026 | Passed |
| Normalized data model + form architecture finalized | 20 Jul 2026 | Passed — not complete |
| Production build of map, directory, member portal MVP | 21–24 Jul 2026 | Passed — map/directory built, portal not started |
| QA, stakeholder review, launch | 27–31 Jul 2026 | Passed |

All four dates have passed. A revised schedule should be agreed, with §5 items 3,
4, and 8 dated by CAS since the build cannot proceed past them.

---

## 7. Delivered in this milestone (for completeness)

Not part of the gap analysis, recorded so the remaining scope is read in context.

- Public map rebuilt on real geometry (d3-geo, Lambert Conformal Conic) with
  latitude/longitude positioning, replacing hand-placed coordinates
- Homepage and `/directory` driven by approved records; filters derived from
  live values
- Admin console: authentication, leads view, services-map moderation with
  map preview before publishing
- `Map_Approved` written back to the CRM on approval
- Homepage "Network Reach" figures derived from the database, with an override
  for figures CAS counts outside it
- Admin authentication test suite (97 cases)
