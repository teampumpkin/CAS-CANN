# Message for Jan — Zoho Duplicate Merges (May 9, 2026)

Hi Jan,

The CAS data rescue is complete — all 13 burnt registrations are now in Zoho (Leads count went from 247 to 303). The field-sync bug is patched and live.

The rescue did create some duplicate pairs that need merging in the Zoho UI. The full list is in the attached spreadsheet:

📎 **`docs/CAS_Duplicate_Merge_Checklist_2026-05-07.xlsx`** — 12 duplicate pairs

## How to merge in Zoho (for each pair)

1. Open the Leads module in Zoho CRM
2. Search for the email address from column "Email" in the spreadsheet
3. Two records will appear — one is the older record (column "Keep ID"), one is the new rescue record (column "Merge ID")
4. Select both → click "More" → "Find and Merge Duplicates"
5. Choose the **Keep ID** record as the master
6. Tick "use" on any field where the rescue record has more complete info (institution, designation, consent flags)
7. Confirm merge

Each merge takes ~1 minute. Total time: ~15 min for all 12.

## Two more pairs may appear soon

Once AWS finishes the OAuth fix (separate ticket), 4 more submissions will auto-sync. Among those:
- **Niloufar Ahmadbeigi** (`ahmadbeigi@hhsc.ca`) — submitted twice, will create a new dup pair, please merge
- **Emilie Theberge** (`emilie.theberge@ubc.ca`) — single submission, no merge needed (but check against any existing record with that email)

## After all merges done

Please reply confirming "all 12+ pairs merged" so Jeff and I can sign off the SSoT validation in our next meeting.

Thank you!
Nital
