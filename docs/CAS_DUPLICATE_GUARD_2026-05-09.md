# Duplicate Lead Guard — Behaviour Change (May 9, 2026)

**Task:** #18 — Stop new form submissions from creating duplicate Leads

## What changed

The Zoho sync worker now does an **email lookup first** before creating a Lead. If the email already exists in the Leads module, the existing Lead is **updated** instead of a duplicate being created.

## Before vs After

| Scenario | Before | After |
|---|---|---|
| First-time submitter (`new@example.com`) | New Lead created | New Lead created (unchanged) |
| Same person submits twice in a row | **2 Leads** in inbox | **1 Lead**, latest values applied |
| Existing CAS member re-registers also for CANN | **2 Leads** (Jeff/Jan must dedupe) | **1 Lead** with both `CAS_Member=true` AND `CANN_Member=true` |
| Existing CAS member submits a non-member inquiry form | Could downgrade `CAS_Member` to false | `CAS_Member` stays true (upgrade-only rule) |
| Submission with no email at all | Lead created (no email) | Lead created (no lookup possible — fallback) |
| Zoho search API itself fails | n/a | Falls back to create (sync never blocked) |

## Merge rules (when an existing Lead is found)

- **`CAS_Member` / `CANN_Member`** — upgrade-only. `true` always wins, never downgrades to `false`.
- **`Form_Submission_Date`** — always overwritten to the latest submission's timestamp.
- **All other fields** — latest non-empty value wins. Blank/null/empty-string values from the new submission are **dropped** so they don't wipe existing data.
- **`Layout`** — never sent on update (Zoho rejects layout changes via update).

## Implementation

- New helper: `zohoCRMService.searchRecordByEmail(module, email)` — uses Zoho v8 `/{module}/search?email=...` endpoint, returns null on 204 (no match) instead of throwing.
- Sync worker `syncSubmission()` now branches on lookup result: update vs create. Action is logged in submission_logs as `details.action: "created" | "updated"` for traceability.
- If the lookup itself fails (network, auth, etc.), the worker falls back to create — better a duplicate than a stuck submission.

## Files

- `server/zoho-crm-service.ts` — added `searchRecordByEmail`
- `server/zoho-sync-worker.ts` — added duplicate guard branch in `syncSubmission`
