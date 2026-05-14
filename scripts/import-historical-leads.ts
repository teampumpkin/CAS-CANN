import XLSX from 'xlsx';
import { oauthService } from '../server/oauth-service';

const V2_LAYOUT_ID = '6999043000002392001';

const FILES = [
  {
    path: 'attached_assets/Canadian_Amyloidosis_Society_(CAS)_Membership_Registration_Fo_1778749183880.xlsx',
    lang: 'EN' as const,
    sourceFormLabel: 'Excel Import - CAS Registration (EN)',
  },
  {
    path: 'attached_assets/CAS_Membership_Registration_Form-15-Dec-2025-French-Final_1778749183888.xlsx',
    lang: 'FR' as const,
    sourceFormLabel: 'Excel Import - CAS Registration (FR)',
  },
];

const COL_MAP = {
  EN: {
    cas_member: 'I would like to become a member of the Canadian Amyloidosis Society (CAS)',
    name: 'Full name (first and last)',
    email: 'Email address',
    designation: 'Discipline (physician, nursing, genetic counsellor, etc)',
    subspecialty: 'Sub-specialty area of focus (cardiology, hematology, neurology, etc)',
    company: 'Center or Clinic Name/Institution',
    cas_comm: 'I would like to receive communication from the Canadian Amyloidosis Society (email, newsletters)',
    map_incl: 'I would like my center/clinic to be included in the Canadian Amyloidosis Services Map ',
    map_name: 'Center or Clinic Name/Institution2',
    map_addr: 'Center or Clinic Address',
    map_phone: 'Center or Clinic Phone Number\r\n',
    map_fax: 'Center or Clinic Fax Number ',
    map_contact_consent: 'I may be contacted, if needed, by the CAS to provide information for the Canadian Amyloidosis Services Map ',
    completion: 'Completion time',
  },
  FR: {
    cas_member: "Je souhaite devenir membre de la Société canadienne de l'amyloïdose \r\n",
    name: 'Nom complet (prénom et nom)\r\n',
    email: 'Adresse électronique\r\n',
    designation: 'Profession (médecin, soins infirmiers, conseiller en génétique, etc.)\r\n',
    subspecialty: 'Domaine de spécialisation (cardiologie, hématologie, neurologie, etc.)\r\n',
    company: 'Nom du centre ou de la clinique/Institution\r\n',
    cas_comm: "Je souhaite recevoir des communications de la Société canadienne de l'amyloïdose (courriel, bulletins d'information) \r\n",
    map_incl: "Je souhaite que mon centre/clinique soit inclus dans la carte canadienne des services d'amyloïdose  ",
    map_name: 'Nom du centre ou de la clinique/Institution\r\n2',
    map_addr: 'Adresse du centre ou de la clinique\r\n',
    map_phone: 'Numéro de téléphone du centre ou de la clinique\r\n',
    map_fax: 'Numéro de télécopieur du centre ou de la clinique\r\n',
    map_contact_consent: "Je peux être contacté, si nécessaire, par la SCA pour fournir des informations pour la carte canadienne des services d'amyloïdose \r\n",
    completion: 'Completion time',
  },
};

function clean(v: any): string {
  if (v == null) return '';
  // Strip Unicode bidi control chars (LRM, RLM, LRE, RLE, PDF, LRO, RLO, etc.)
  return String(v)
    .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, '')
    .replace(/\r\n|\r|\n/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}
function sanitizePhone(v: any): { value: string | undefined; note: string | undefined } {
  const raw = clean(v);
  if (!raw) return { value: undefined, note: undefined };
  // If multiple numbers (slash, "or", comma, semicolon), take the first chunk
  const firstChunk = raw.split(/\s*(?:\/|,|;|\bor\b|\band\b)\s*/i)[0];
  // Strip everything except digits, +, -, (, ), space, x
  let extracted = firstChunk
    .replace(/[^0-9+\-\(\)\s xX]/g, ' ')
    .replace(/\(\s*\)/g, ' ')        // remove empty parens left after stripping
    .replace(/\s+/g, ' ')
    .trim();
  const digitCount = (extracted.match(/\d/g) || []).length;
  if (digitCount < 7) return { value: undefined, note: raw !== '.' ? `Phone: ${raw}` : undefined };
  const note = raw !== extracted ? `Original phone: ${raw}` : undefined;
  return { value: extracted.substring(0, 30), note };
}
function sanitizeEmail(v: any): string | undefined {
  const raw = clean(v).toLowerCase();
  if (!raw) return undefined;
  // Take first email if multiple separated by comma/semicolon/space
  const first = raw.split(/[,;\s]+/)[0].replace(/[,;]+$/, '');
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(first) ? first : undefined;
}
function isYes(v: any): boolean {
  const s = String(v || '').trim().toLowerCase();
  return s === 'yes' || s === 'oui';
}
function parseDate(v: any): string {
  if (!v) return new Date().toISOString().replace(/\.\d+Z$/, '+00:00');
  // MS Forms format: "9/4/24 21:23:26"
  const m = String(v).match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})\s+(\d{1,2}):(\d{2}):(\d{2})$/);
  if (m) {
    let [, mo, d, y, h, mi, s] = m;
    if (y.length === 2) y = '20' + y;
    const dt = new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s));
    return dt.toISOString().replace(/\.\d+Z$/, '+00:00');
  }
  const dt = new Date(v);
  return isNaN(dt.getTime()) ? new Date().toISOString().replace(/\.\d+Z$/, '+00:00') : dt.toISOString().replace(/\.\d+Z$/, '+00:00');
}

function normalizeKey(s: string): string {
  return s.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}
function normalizeRow(row: any): any {
  const out: Record<string, any> = {};
  for (const k of Object.keys(row)) out[normalizeKey(k)] = row[k];
  return out;
}

function buildLead(rawRow: any, lang: 'EN' | 'FR', sourceFormLabel: string): any {
  const row = normalizeRow(rawRow);
  const rawMap = COL_MAP[lang];
  const m: any = {};
  for (const k of Object.keys(rawMap)) m[k] = normalizeKey((rawMap as any)[k]);
  const casMember = isYes(row[m.cas_member]);
  const name = clean(row[m.name]);
  const email = sanitizeEmail(row[m.email]);
  const mapIncl = isYes(row[m.map_incl]);
  const mapConsent = isYes(row[m.map_contact_consent]);

  const phoneSan = sanitizePhone(row[m.map_phone]);
  const faxSan = sanitizePhone(row[m.map_fax]);

  const descParts: string[] = [];
  if (row[m.map_contact_consent] !== undefined && row[m.map_contact_consent] !== '')
    descParts.push(`Map contact consent: ${mapConsent ? 'Yes' : 'No'}`);
  if (phoneSan.note) descParts.push(phoneSan.note);
  if (faxSan.note) descParts.push(`Fax: ${clean(row[m.map_fax])}`.replace(/^Fax: $/, ''));

  const lead: Record<string, any> = {
    Layout: { id: V2_LAYOUT_ID },
    Last_Name: name || '(Unknown)',
    Email: email,
    Professional_Designation: clean(row[m.designation]) || undefined,
    subspecialty: clean(row[m.subspecialty]).substring(0, 50) || undefined,
    Company: clean(row[m.company]).substring(0, 100) || undefined,
    CAS_Member: casMember,
    CANN_Member: false,
    CAS_Communications: isYes(row[m.cas_comm]) ? 'Yes' : 'No',
    CANN_Communications: 'No',
    Services_Map_Inclusion: mapIncl ? 'Yes' : 'No',
    Record_Type: casMember ? 'Member' : 'Inquiry',
    Lead_Source: 'Excel Import - CAS Registration',
    Source_Form: sourceFormLabel,
    Form_Submission_Date: parseDate(row[m.completion]),
    Description: descParts.length ? descParts.join('\n') : undefined,
  };

  if (mapIncl) {
    lead.Map_Clinic_Name = clean(row[m.map_name]) || undefined;
    lead.Map_Clinic_Address = clean(row[m.map_addr]) || undefined;
    if (phoneSan.value) lead.Map_Clinic_Phone = phoneSan.value;
    if (faxSan.value) lead.Map_Clinic_Fax = faxSan.value;
  }

  for (const k of Object.keys(lead)) if (lead[k] === undefined) delete lead[k];
  return lead;
}

async function main() {
  const dryRun = !process.argv.includes('--commit');
  console.log(`\n===== HISTORICAL IMPORT ${dryRun ? '(DRY RUN)' : '(LIVE)'} =====\n`);

  const allLeads: any[] = [];
  for (const f of FILES) {
    const wb = XLSX.readFile(f.path);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });
    console.log(`\n📄 ${f.path.split('/').pop()} (${f.lang}): ${rows.length} rows`);
    let skipped = 0;
    for (const row of rows) {
      const lead = buildLead(row, f.lang, f.sourceFormLabel);
      if (!lead.Email && lead.Last_Name === '(Unknown)') { skipped++; continue; }
      allLeads.push(lead);
    }
    if (skipped) console.log(`  ⚠️  Skipped ${skipped} blank rows`);
  }

  console.log(`\n✅ Total mapped leads: ${allLeads.length}`);

  if (dryRun) {
    console.log('\n========= DRY-RUN SAMPLES (first 3 EN + first 2 FR) =========');
    const enSamples = allLeads.filter(l => l.Source_Form.includes('(EN)')).slice(0, 3);
    const frSamples = allLeads.filter(l => l.Source_Form.includes('(FR)')).slice(0, 2);
    for (const s of [...enSamples, ...frSamples]) {
      console.log('\n---');
      for (const [k, v] of Object.entries(s)) console.log(`  ${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`);
    }
    console.log('\n💡 To commit for real, run: npx tsx scripts/import-historical-leads.ts --commit');
    return;
  }

  // LIVE: POST in batches of 100
  const token = await oauthService.getValidToken('zoho_crm');

  // If --retry-failed: query Zoho for already-imported emails and skip them
  const retryMode = process.argv.includes('--retry-failed');
  let toImport = allLeads;
  if (retryMode) {
    console.log('\n🔍 Querying Zoho for already-imported leads...');
    const existing = new Set<string>();
    let page = 1;
    while (true) {
      const sr = await fetch(`https://www.zohoapis.com/crm/v8/Leads/search?criteria=(Lead_Source:equals:Excel Import - CAS Registration)&fields=Email&page=${page}&per_page=200`, {
        headers: { Authorization: `Zoho-oauthtoken ${token}` },
      });
      if (sr.status === 204) break;
      const sj = await sr.json();
      for (const r of sj.data || []) if (r.Email) existing.add(r.Email.toLowerCase());
      if (!sj.info?.more_records) break;
      page++;
    }
    console.log(`  Found ${existing.size} already-imported leads. Filtering...`);
    toImport = allLeads.filter(l => !l.Email || !existing.has(l.Email));
    console.log(`  Re-importing ${toImport.length} missing leads (originally ${allLeads.length})`);
  }
  allLeads.length = 0;
  allLeads.push(...toImport);

  const created: any[] = [];
  const errors: any[] = [];
  for (let i = 0; i < allLeads.length; i += 100) {
    const batch = allLeads.slice(i, i + 100);
    console.log(`\n📤 POSTing batch ${Math.floor(i / 100) + 1} (${batch.length} leads)...`);
    const r = await fetch('https://www.zohoapis.com/crm/v8/Leads', {
      method: 'POST',
      headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: batch, trigger: [] }),
    });
    const j = await r.json();
    for (let idx = 0; idx < (j.data || []).length; idx++) {
      const rec = j.data[idx];
      if (rec.code === 'SUCCESS') created.push({ idx: i + idx, id: rec.details?.id, email: batch[idx].Email });
      else errors.push({ idx: i + idx, email: batch[idx].Email, code: rec.code, message: rec.message, details: rec.details });
    }
    console.log(`  ✅ ${(j.data || []).filter((d: any) => d.code === 'SUCCESS').length}/${batch.length} succeeded`);
  }

  console.log(`\n===== RESULTS =====`);
  console.log(`✅ Created: ${created.length}`);
  console.log(`❌ Failed:  ${errors.length}`);
  if (errors.length) {
    console.log('\nFirst 10 errors:');
    for (const e of errors.slice(0, 10)) console.log('  ', JSON.stringify(e));
  }
}

main().catch(e => { console.error('FATAL', e); process.exit(1); });
