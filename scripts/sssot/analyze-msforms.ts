import XLSX from 'xlsx';
import * as fs from 'fs';
import { zohoCRMService } from '../../server/zoho-crm-service';

const EN_FILE = 'attached_assets/Canadian_Amyloidosis_Society_(CAS)_Membership_Registration_Fo_1778177613590.xlsx';
const FR_FILE = 'attached_assets/CAS_Membership_Registration_Form-15-Dec-2025-French-Final_1778177610674.xlsx';

const EN_MAP: Record<string,string> = {
  'I would like to become a member of the Canadian Amyloidosis Society (CAS)': 'wantsMembership',
  'Full name (first and last)': 'fullName',
  'Email address': 'email',
  'Discipline (physician, nursing, genetic counsellor, etc)': 'discipline',
  'Sub-specialty area of focus (cardiology, hematology, neurology, etc)': 'subspecialty',
  'Center or Clinic Name/Institution': 'institution',
  'I would like to receive communication from the Canadian Amyloidosis Society (email, newsletters)': 'wantsCommunications',
  'I would like my center/clinic to be included in the Canadian Amyloidosis Services Map ': 'wantsServicesMapInclusion',
  'Center or Clinic Name/Institution2': 'centerName',
  'Center or Clinic Address': 'centerAddress',
  'Center or Clinic Phone Number\r\n': 'centerPhone',
  'Center or Clinic Fax Number ': 'centerFax',
  'I may be contacted, if needed, by the CAS to provide information for the Canadian Amyloidosis Services Map ': 'mayBeContactedForMap',
  'Center or Clinic Name/Institution3': 'centerName3',
};
const FR_MAP: Record<string,string> = {
  "Je souhaite devenir membre de la Société canadienne de l'amyloïdose \r\n": 'wantsMembership',
  'Nom complet (prénom et nom)\r\n': 'fullName',
  'Adresse électronique\r\n': 'email',
  'Profession (médecin, soins infirmiers, conseiller en génétique, etc.)\r\n': 'discipline',
  'Domaine de spécialisation (cardiologie, hématologie, neurologie, etc.)\r\n': 'subspecialty',
  'Nom du centre ou de la clinique/Institution\r\n': 'institution',
  "Je souhaite recevoir des communications de la Société canadienne de l'amyloïdose (courriel, bulletins d'information) \r\n": 'wantsCommunications',
  "Je souhaite que mon centre/clinique soit inclus dans la carte canadienne des services d'amyloïdose  ": 'wantsServicesMapInclusion',
  'Nom du centre ou de la clinique/Institution\r\n2': 'centerName',
  'Adresse du centre ou de la clinique\r\n': 'centerAddress',
  'Numéro de téléphone du centre ou de la clinique\r\n': 'centerPhone',
  'Numéro de télécopieur du centre ou de la clinique\r\n': 'centerFax',
  "Je peux être contacté, si nécessaire, par la SCA pour fournir des informations pour la carte canadienne des services d'amyloïdose \r\n": 'mayBeContactedForMap',
  'Nom du centre ou de la clinique/Institution\r\n3': 'centerName3',
};
const FR_VALUE_MAP: Record<string,string> = { 'Oui':'Yes','Non':'No' };

function excelDateToISO(serial: any): string | null {
  if (!serial || typeof serial !== 'number') return null;
  const d = new Date(Math.round((serial - 25569) * 86400 * 1000));
  return d.toISOString();
}

function normalize(row: any, map: Record<string,string>, isFrench: boolean) {
  const out: any = {
    msFormsId: row['ID'],
    startTime: excelDateToISO(row['Start time']),
    completionTime: excelDateToISO(row['Completion time']),
    lastModifiedTime: excelDateToISO(row['Last modified time']) || null,
    sourceLanguage: isFrench ? 'French' : 'English',
  };
  for (const [k,v] of Object.entries(map)) {
    let val = row[k];
    if (typeof val === 'string') {
      val = val.trim();
      if (isFrench && FR_VALUE_MAP[val]) val = FR_VALUE_MAP[val];
    }
    out[v] = val ?? '';
  }
  return out;
}

(async () => {
  const enWb = XLSX.readFile(EN_FILE);
  const frWb = XLSX.readFile(FR_FILE);
  const enRows = XLSX.utils.sheet_to_json(enWb.Sheets[enWb.SheetNames[0]], {defval:''}).map((r:any)=>normalize(r, EN_MAP, false));
  const frRows = XLSX.utils.sheet_to_json(frWb.Sheets[frWb.SheetNames[0]], {defval:''}).map((r:any)=>normalize(r, FR_MAP, true));

  // Stats
  console.log('English rows:', enRows.length);
  console.log('French rows:', frRows.length);
  const enMissingEmail = enRows.filter(r=>!r.email).length;
  const frMissingEmail = frRows.filter(r=>!r.email).length;
  console.log('English missing email:', enMissingEmail);
  console.log('French missing email:', frMissingEmail);

  // Overlap between EN and FR
  const enEmails = new Set(enRows.map(r=>(r.email||'').toLowerCase()).filter(Boolean));
  const frInEn = frRows.filter(r=>r.email && enEmails.has(r.email.toLowerCase()));
  console.log('French emails ALSO in English file:', frInEn.length);

  // Pull current CRM (Leads + Contacts)
  console.log('\nFetching CRM Leads...');
  const leads:any[] = [];
  for (let p=1; p<=5; p++) {
    const recs = await zohoCRMService.getRecords('Leads', { page:p, per_page:200, fields:'id,Email,Last_Name,First_Name,Company' });
    leads.push(...recs);
    if (recs.length<200) break;
  }
  console.log('CRM Leads fetched:', leads.length);
  const contacts:any[] = [];
  for (let p=1; p<=3; p++) {
    const recs = await zohoCRMService.getRecords('Contacts', { page:p, per_page:200, fields:'id,Email,Last_Name,First_Name' });
    contacts.push(...recs);
    if (recs.length<200) break;
  }
  console.log('CRM Contacts fetched:', contacts.length);
  const crmEmails = new Set([...leads,...contacts].map((r:any)=>(r.Email||'').toLowerCase()).filter(Boolean));
  console.log('Unique CRM emails:', crmEmails.size);

  // Match analysis
  const enInCrm = enRows.filter(r=>r.email && crmEmails.has(r.email.toLowerCase())).length;
  const enNotInCrm = enRows.filter(r=>r.email && !crmEmails.has(r.email.toLowerCase()));
  const frInCrm = frRows.filter(r=>r.email && crmEmails.has(r.email.toLowerCase())).length;
  const frNotInCrm = frRows.filter(r=>r.email && !crmEmails.has(r.email.toLowerCase()) && !enEmails.has(r.email.toLowerCase()));
  console.log('\n=== ENGLISH FILE ===');
  console.log('Already in CRM:', enInCrm);
  console.log('NOT in CRM (net-new):', enNotInCrm.length);
  console.log('\n=== FRENCH FILE ===');
  console.log('Already in CRM:', frInCrm);
  console.log('In English file (will be merged):', frInEn.length);
  console.log('Net-new from French (not in CRM, not in English):', frNotInCrm.length);

  // Build staging Excel
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([
    {Metric:'English file rows', Value: enRows.length},
    {Metric:'French file rows', Value: frRows.length},
    {Metric:'English already in CRM', Value: enInCrm},
    {Metric:'English net-new', Value: enNotInCrm.length},
    {Metric:'French already in CRM', Value: frInCrm},
    {Metric:'French overlap with English', Value: frInEn.length},
    {Metric:'French net-new (after dedupe)', Value: frNotInCrm.length},
    {Metric:'TOTAL records to import', Value: enNotInCrm.length + frNotInCrm.length},
    {Metric:'TOTAL records to update (existing CRM)', Value: enInCrm + frInCrm},
    {Metric:'CRM unique emails currently', Value: crmEmails.size},
  ]), 'Summary');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(enRows), 'English_All');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(frRows), 'French_All');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(enNotInCrm), 'English_NetNew');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(frNotInCrm), 'French_NetNew');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(enRows.filter(r=>r.email && crmEmails.has(r.email.toLowerCase()))), 'English_Updates');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(frInEn.map(f=>{
    const e = enRows.find(en=>en.email && en.email.toLowerCase()===f.email.toLowerCase());
    return { email:f.email, fr_name:f.fullName, en_name:e?.fullName, fr_completion:f.completionTime, en_completion:e?.completionTime, fr_institution:f.institution, en_institution:e?.institution };
  })), 'EN_FR_Overlap');

  const outPath = 'docs/MSForms_Import_Preview_2026-05-07.xlsx';
  XLSX.writeFile(wb, outPath);
  console.log('\nWritten:', outPath);
  process.exit(0);
})().catch(e=>{console.error(e);process.exit(1);});
