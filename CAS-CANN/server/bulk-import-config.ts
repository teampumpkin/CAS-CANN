/**
 * Bulk Import Configuration
 * Maps Excel column names to form field names for historical data import
 */

export const excelColumnMappings = {
  // CANN Contacts mapping
  "CANN Contacts": {
    "fullName": "fullName",
    "email": "emailAddress",
    "amyloidosisType": "amyloidosisType",
    "areasOfInterest": "areasOfInterest",
    "communicationConsent": "communicationConsent",
    "institution": "institutionName",
    "presentingInterest": "presentingInterest",
    "professionalDesignation": "discipline",
    "subspecialty": "subspecialty"
  },
  
  // CAS Registration mapping
  "CAS Registration": {
    "Q2 (Yes): Full Name": "fullName",
    "Q3 (Yes): Email Address": "email",
    "Q4 (Yes): Medical Discipline": "discipline",
    "Q5 (Yes): Medical Subspecialty": "subspecialty",
    "Q6 (Yes): Center or Clinic Name/Institution": "institution",
    "Q7 (Yes): I would like to receive communication from CAS (email, newsletters)": "communicationConsent",
    "Q8 (Yes): I would like my center/clinic included in the Services Map": "servicesMapConsent",
    "Q9 (Yes): Services Map - Center Name": "centerName",
    "Q10 (Yes): Services Map - Center Address": "centerAddress",
    "Q11 (Yes): Services Map - Center Phone": "centerPhone",
    "Q12 (Yes): Services Map - Center Fax": "centerFax"
  }
};

export const formNameMapping = {
  "CANN Contacts": "Join CANN Today",
  "CAS Registration": "Join CAS Today"
};
