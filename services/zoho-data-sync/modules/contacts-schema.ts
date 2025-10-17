/**
 * Contacts Module Schema (Healthcare Professionals / Members)
 * 
 * Represents CAS/CANN members - healthcare professionals
 */

import { ModuleSchema } from '../types';

export const contactsSchema: ModuleSchema = {
  moduleName: 'Contacts',
  
  // Fields required for valid contact record
  requiredFields: [
    'Email',                  // Primary unique identifier
    'Last_Name'               // Required by Zoho
  ],
  
  // Optional but recommended fields
  optionalFields: [
    // Personal Information
    'First_Name',
    'Full_Name',              // Will be split into First/Last if provided
    'Salutation',             // Dr., Mr., Ms., etc.
    
    // Professional Information
    'Professional_Designation', // RN, MD, NP, etc.
    'Specialty',              // Cardiology, Nephrology, etc.
    'Job_Title',              // Clinical Nurse, Physician, etc.
    
    // Contact Information
    'Phone',
    'Mobile',
    'Mailing_Street',
    'Mailing_City',
    'Mailing_State',          // Province
    'Mailing_Zip',            // Postal code
    'Mailing_Country',
    
    // Membership Details
    'Membership_Type',        // CAS Member, CANN Member, Both
    'Member_Since',           // Date joined
    'Membership_Status',      // Active, Inactive, Pending
    'Interests',              // Areas of interest
    'Language_Preference',    // English, French, Bilingual
    
    // Consent & Communication
    'Email_Opt_In',           // Boolean for email consent
    'Newsletter_Subscription',
    'Event_Notifications',
    
    // Administrative
    'Data_Source',            // Which registration form/import
    'Last_Updated',
    
    // Tagging
    'Tag'                     // Will be set to 'DataSyncService'
  ],
  
  // Lookup/relationship fields
  lookupFields: [
    {
      fieldName: 'Account_Name',      // Institution they work at
      referencedModule: 'Accounts',
      referencedField: 'Institution_ID'
    }
  ],
  
  // Fields used for deduplication
  uniqueIdentifiers: [
    'Email'                   // Primary dedup field
  ]
};

/**
 * Field mappings for common data sources
 */
export const contactsFieldMappings = {
  // CANN Contacts
  'Email': 'Email',
  'Email Address': 'Email',
  'Full Name': 'Full_Name',
  'First Name': 'First_Name',
  'Last Name': 'Last_Name',
  'Professional Designation': 'Professional_Designation',
  'Designation': 'Professional_Designation',
  'Specialty': 'Specialty',
  'Job Title': 'Job_Title',
  'Title': 'Job_Title',
  'Phone': 'Phone',
  'Mobile': 'Mobile',
  'Institution': 'Account_Name',
  'Institution Name': 'Account_Name',
  'Institution ID': 'Institution_ID',
  'Membership Type': 'Membership_Type',
  'Type': 'Membership_Type',
  'Language': 'Language_Preference',
  'Language Preference': 'Language_Preference',
  
  // CAS Registration
  'Timestamp': 'Created_Time',
  'Member Since': 'Member_Since',
  'Status': 'Membership_Status',
  'Interests': 'Interests',
  'Email Opt-In': 'Email_Opt_In',
  'Newsletter': 'Newsletter_Subscription'
};

/**
 * Generate empty template for Contacts
 */
export function generateContactsTemplate(): Record<string, string> {
  return {
    Email: '',
    First_Name: '',
    Last_Name: '',
    Professional_Designation: '',
    Specialty: '',
    Job_Title: '',
    Phone: '',
    Account_Name: '',
    Institution_ID: '',
    Membership_Type: '',
    Membership_Status: 'Active',
    Language_Preference: 'English',
    Email_Opt_In: 'false',
    Tag: 'DataSyncService'
  };
}
