---
name: Zoho CRM v8 quirks (CAS Leads / V3 layout)
description: Non-obvious Zoho CRM v8 API behaviors that bit us mapping the /join-cas form to the "CAS and CANN V3" Leads layout. Read before touching Zoho field mapping or bulk import.
---

# Zoho CRM v8 quirks

## Picklist rename-in-place keeps the OLD stored value
**Rule:** Renaming a picklist option's label in the Zoho UI changes only the `display_value`; the underlying `actual_value` stays whatever it was originally created as (e.g. "Option 1"). To make stored value == label you must DELETE the option and ADD a fresh one.
**Why:** Map_Province showed "Alberta"/"British Columbia" in the UI but stored `Option 1`/`Option 2`. Caused silent data mismatch risk on import.
**How to apply:** When verifying a picklist, fetch `/settings/fields?module=Leads&layout_id=<id>` and compare each option's `display_value` vs `actual_value`. They must match. Don't trust the UI.

## Record reads return DISPLAY labels; creates ACCEPT display labels
**Rule:** A GET on a record returns the picklist's display label (not actual_value), and a POST/create will also accept the display label and match it. So sending "Both ATTR and AL" works even though the stored actual_value is "Both".
**How to apply:** Don't panic about display-vs-actual for create payloads — Zoho matches on label. The province delete+re-add was still worth doing for cleanliness, but value!=label does NOT necessarily break creates.

## Layout "required" rules are NOT exposed in field metadata, and they DRIFT
**Rule:** Only `Last_Name` shows `system_mandatory: true` in `/settings/fields`. But the V3 layout ALSO requires `First_Name`, `Primary_Email_Address`, and `Company`. Worse, the required set CHANGES whenever the user edits the layout in the Zoho UI — fields that previously synced fine start failing. These layout-level requirements are invisible in field metadata — discoverable only empirically (attempt a create; read `MANDATORY_NOT_FOUND` errors one at a time).
**Why:** A throwaway-create audit found `First_Name` AND (separately) `Amyloidosis_Type` AND `Amyloidosis_Type_Other` had ALL become hard-required for every record (not just for "Other"). `Amyloidosis_Type_Other` required-for-all breaks every normal member (ATTR/AL/Both); `Amyloidosis_Type` required-for-all breaks non-member inquiries (they don't collect it). These should be optional at the layout level — the /join-cas form already enforces type-required-for-members and other-detail-required-for-Other client-side.
**How to apply:** Re-run a throwaway-create audit (one per submission path: full member, member+Other, non-member inquiry) before any production cutover, because the required set is not stable. For the XLSX bulk import every row MUST satisfy whatever the current required set is. To find it, do throwaway creates and watch the error chain, then DELETE the test lead.

## Non-member inquiry path needs First_Name + Primary_Email_Address synthesized
**Rule:** Non-members (wantsMembership=No, wantsCANNMembership=No) only provide a single `noMemberName` and `noMemberEmail`. The mapper must split `noMemberName` into First_Name/Last_Name (last token = Last_Name, rest = First_Name; single token → both) and mirror `noMemberEmail` into BOTH `Email` and `Primary_Email_Address`, or the V3 create 400s on the required First_Name / Primary_Email_Address.

## For KNOWN_CENTRALIZED_FORMS the sync worker bypasses the smart mapper
**Rule:** In `zoho-sync-worker.ts`, forms in `KNOWN_CENTRALIZED_FORMS` (incl. 'CAS/CANN Registration Form') set `zohoData = {}`, so `mergedData = { ...centralResult.zohoData }` — `buildCentralizedZohoData` output IS the exact production payload (no smart-mapper keys to clobber it).
**How to apply:** Testing `buildCentralizedZohoData` directly is a faithful end-to-end test for the /join-cas form. The merge-clobber concern (smart mapper winning on `{ ...central, ...smart }`) does NOT apply to this form.

## "Other" amyloidosis path: split picklist from free text
**Rule:** The /join-cas form sends `amyloidosisType` as `"Other: <free text>"` (embedded) but ALSO sends `amyloidosisTypeOther` separately. The centralized mapper (`buildCentralizedZohoData`) must map this to `Amyloidosis_Type = "Other"` + `Amyloidosis_Type_Other = <free text>`, otherwise the conditional-required rule rejects the create and the submission never syncs.
**Why:** Found that every "Other" submission would 400 with MANDATORY_NOT_FOUND on Amyloidosis_Type_Other.

## Other API gotchas
- COQL endpoint (`POST /coql`) returns `OAUTH_SCOPE_MISMATCH` — our token lacks that scope. Read records with a plain `GET /Leads/<id>?fields=...` raw fetch instead.
- `searchRecordByEmail` throws a harmless "Unexpected end of JSON input" (empty body) then the worker falls back to create — expected, not a bug.
- Datetime fields must use `+00:00` offset format, not `.000Z`.
- To read a record reliably in a script, use `zohoCRMService.getAccessToken()` + raw `fetch` (the service's internal GET via `makeRequest` chokes on empty/204 bodies).
