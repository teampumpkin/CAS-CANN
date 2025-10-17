/**
 * Accounts Module Schema (Institutions)
 * 
 * Represents hospitals, clinics, and centers in the Canadian Amyloidosis Directory
 */

import { ModuleSchema } from '../types';

export const accountsSchema: ModuleSchema = {
  moduleName: 'Accounts',
  
  // Fields required for valid institution record
  requiredFields: [
    'Account_Name',           // Institution name
    'Institution_ID'          // CAS unique identifier
  ],
  
  // Optional but recommended fields
  optionalFields: [
    // Basic Information
    'Institution_Type',       // Hospital, Clinic, Medical Center, etc.
    'Province',               // Canadian province
    'City',
    'Postal_Code',
    'Phone',
    'Email',
    'Website',
    
    // Address fields
    'Billing_Street',
    'Billing_City',
    'Billing_State',          // Province
    'Billing_Code',           // Postal code
    'Billing_Country',
    
    // Services
    'Services_Available',     // What amyloidosis services they offer
    'Specialty_Type',         // Cardiac, Renal, Neurological, etc.
    
    // Bilingual support
    'Institution_Name_FR',    // French institution name
    'Services_Available_FR',  // French services description
    
    // Administrative
    'Active_Status',          // Active, Inactive
    'Last_Updated',
    'Data_Source',            // Which file/import this came from
    
    // Tagging
    'Tag'                     // Will be set to 'DataSyncService'
  ],
  
  // Lookup/relationship fields
  lookupFields: [],
  
  // Fields used for deduplication
  uniqueIdentifiers: [
    'Institution_ID',         // Primary dedup field
    'Account_Name'            // Secondary dedup (fuzzy matching)
  ]
};

/**
 * Field mappings for common data sources
 */
export const accountsFieldMappings = {
  // Standard column names → Zoho field names
  'Institution ID': 'Institution_ID',
  'Institution Name': 'Account_Name',
  'Institution Name (EN)': 'Account_Name',
  'Institution Name (FR)': 'Institution_Name_FR',
  'Type': 'Institution_Type',
  'Province': 'Province',
  'City': 'City',
  'Postal Code': 'Postal_Code',
  'Phone': 'Phone',
  'Email': 'Email',
  'Website': 'Website',
  'Services': 'Services_Available',
  'Services (EN)': 'Services_Available',
  'Services (FR)': 'Services_Available_FR',
  'Specialty': 'Specialty_Type',
  'Address': 'Billing_Street',
  'Status': 'Active_Status'
};

/**
 * Generate empty template for Accounts
 */
export function generateAccountsTemplate(): Record<string, string> {
  return {
    Institution_ID: '',
    Account_Name: '',
    Institution_Type: '',
    Province: '',
    City: '',
    Postal_Code: '',
    Phone: '',
    Email: '',
    Website: '',
    Services_Available: '',
    Institution_Name_FR: '',
    Services_Available_FR: '',
    Specialty_Type: '',
    Active_Status: 'Active',
    Tag: 'DataSyncService'
  };
}
