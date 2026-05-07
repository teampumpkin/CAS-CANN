import XLSX from 'xlsx';
import { zohoCRMService } from '../../server/zoho-crm-service';

(async () => {
  const wb = XLSX.readFile('docs/MSForms_Import_Preview_2026-05-07.xlsx');
  const enNew: any[] = XLSX.utils.sheet_to_json(wb.Sheets['English_NetNew']);
  const frNew: any[] = XLSX.utils.sheet_to_json(wb.Sheets['French_NetNew']);
  console.log('=== ENGLISH NET-NEW (6) ===');
  enNew.forEach(r=>console.log(`  #${r.msFormsId} | ${r.fullName} | ${r.email} | ${r.discipline} | ${r.institution} | ${r.completionTime?.slice(0,10)}`));
  console.log('\n=== FRENCH NET-NEW (1) ===');
  frNew.forEach(r=>console.log(`  #${r.msFormsId} | ${r.fullName} | ${r.email} | ${r.discipline} | ${r.institution} | ${r.completionTime?.slice(0,10)}`));

  // Pull ALL CRM data with key fields for discrepancy check
  console.log('\nFetching full CRM data...');
  const fields = 'id,Email,Last_Name,First_Name,Full_Name,Discipline,Subspecialty,Company,Institution,CAS_Member,CANN_Member,Wants_Communications,Source_Form,Created_Time,Original_Registration_Date,MS_Forms_Original_Date';
  const leads:any[] = [];
  for (let p=1; p<=5; p++) {
    const recs = await zohoCRMService.getRecords('Leads', { page:p, per_page:200, fields });
    leads.push(...recs); if (recs.length<200) break;
  }
  const contacts:any[] = [];
  for (let p=1; p<=3; p++) {
    const recs = await zohoCRMService.getRecords('Contacts', { page:p, per_page:200, fields });
    contacts.push(...recs); if (recs.length<200) break;
  }
  const allCrm = [...leads.map(r=>({...r,__module:'Leads'})), ...contacts.map(r=>({...r,__module:'Contacts'}))];
  const byEmail = new Map<string, any>();
  for (const r of allCrm) {
    const e = (r.Email||'').toLowerCase();
    if (!e) continue;
    if (!byEmail.has(e)) byEmail.set(e, r); // first match wins
  }

  // Discrepancy check on EN/FR existing rows
  const enAll: any[] = XLSX.utils.sheet_to_json(wb.Sheets['English_All']);
  const frAll: any[] = XLSX.utils.sheet_to_json(wb.Sheets['French_All']);
  const allMs = [...enAll, ...frAll].filter(r=>r.email);

  const discrepancies: any[] = [];
  let crmHasOrigDate = 0;
  let crmMissingOrigDate = 0;
  for (const m of allMs) {
    const c = byEmail.get(m.email.toLowerCase());
    if (!c) continue;
    const issues: string[] = [];
    const norm = (s:any) => String(s||'').trim().toLowerCase();
    if (m.fullName && c.Full_Name && norm(m.fullName) !== norm(c.Full_Name) && !norm(c.Full_Name).includes(norm(m.fullName).split(' ')[0])) issues.push(`name:"${m.fullName}" vs CRM:"${c.Full_Name}"`);
    if (m.discipline && c.Discipline && norm(m.discipline) !== norm(c.Discipline)) issues.push(`discipline:"${m.discipline}" vs CRM:"${c.Discipline}"`);
    if (m.institution && c.Company && norm(m.institution) !== norm(c.Company)) issues.push(`institution:"${m.institution}" vs CRM:"${c.Company}"`);
    if (c.MS_Forms_Original_Date || c.Original_Registration_Date) crmHasOrigDate++; else crmMissingOrigDate++;
    if (issues.length) discrepancies.push({ email:m.email, msFormsId:m.msFormsId, source:m.sourceLanguage, msFormsDate:m.completionTime?.slice(0,10), crmModule:c.__module, crmId:c.id, issues:issues.join(' | ') });
  }
  console.log(`\nCRM records WITH MS Forms original date: ${crmHasOrigDate}`);
  console.log(`CRM records MISSING MS Forms original date: ${crmMissingOrigDate}`);
  console.log(`Discrepancies found (existing records, value mismatch): ${discrepancies.length}`);

  // Append to existing workbook
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(discrepancies), 'Value_Mismatches');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([
    {Action:'CREATE new Lead', Count: 7, Detail:'6 English + 1 French net-new'},
    {Action:'BACKFILL MS Forms date on existing record', Count: crmMissingOrigDate, Detail:'Add the original MS Forms Completion time as the registration date of record'},
    {Action:'REVIEW value mismatches', Count: discrepancies.length, Detail:'Name/discipline/institution differs between MS Forms and CRM — needs Jan to choose source of truth per row'},
    {Action:'NO CHANGE NEEDED', Count: crmHasOrigDate - discrepancies.length, Detail:'Already enriched and matching'},
  ]), 'Action_Plan');
  XLSX.writeFile(wb, 'docs/MSForms_Import_Preview_2026-05-07.xlsx');
  console.log('\nUpdated workbook with Value_Mismatches and Action_Plan tabs.');
  process.exit(0);
})().catch(e=>{console.error(e);process.exit(1);});
