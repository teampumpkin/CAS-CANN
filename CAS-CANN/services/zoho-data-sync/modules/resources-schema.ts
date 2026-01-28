/**
 * Resources Module Schema (Custom Module)
 * 
 * Represents documents, referral forms, and guides linked to institutions
 */

import { ModuleSchema } from '../types';

export const resourcesSchema: ModuleSchema = {
  moduleName: 'Resources',
  
  // Fields required for valid resource record
  requiredFields: [
    'Resource_Name',          // Name of the document/resource
    'Resource_Type'           // Document, Referral Form, Guide, etc.
  ],
  
  // Optional but recommended fields
  optionalFields: [
    // Basic Information
    'Resource_Description',
    'Resource_URL',           // Link to download/view
    'File_Name',
    'File_Type',              // PDF, DOC, etc.
    'File_Size',
    
    // Categorization
    'Category',               // Clinical, Administrative, Educational, etc.
    'Amyloidosis_Type',       // AL, ATTR, AA, etc.
    'Target_Audience',        // Physicians, Nurses, Patients, etc.
    'Language',               // English, French, Bilingual
    
    // Bilingual fields
    'Resource_Name_FR',
    'Resource_Description_FR',
    
    // Linking
    'Linked_Institution_ID',  // Links to Accounts.Institution_ID
    'Institution_Name',       // Lookup to display name
    
    // Access Control
    'Is_Public',              // Public or member-only
    'Access_Level',           // Public, Member, Admin
    
    // Administrative
    'Created_Date',
    'Last_Updated',
    'Data_Source',
    
    // Tagging
    'Tag'                     // Will be set to 'DataSyncService'
  ],
  
  // Lookup/relationship fields
  lookupFields: [
    {
      fieldName: 'Linked_Institution_ID',
      referencedModule: 'Accounts',
      referencedField: 'Institution_ID'
    }
  ],
  
  // Fields used for deduplication
  uniqueIdentifiers: [
    'Resource_Name',          // Name should be unique per institution
    'Linked_Institution_ID'   // Combined with name for uniqueness
  ]
};

/**
 * Field mappings for common data sources
 */
export const resourcesFieldMappings = {
  'Resource Name': 'Resource_Name',
  'Name': 'Resource_Name',
  'Resource Name (EN)': 'Resource_Name',
  'Resource Name (FR)': 'Resource_Name_FR',
  'Description': 'Resource_Description',
  'Description (EN)': 'Resource_Description',
  'Description (FR)': 'Resource_Description_FR',
  'Type': 'Resource_Type',
  'Resource Type': 'Resource_Type',
  'URL': 'Resource_URL',
  'File': 'File_Name',
  'File Name': 'File_Name',
  'Category': 'Category',
  'Amyloidosis Type': 'Amyloidosis_Type',
  'Audience': 'Target_Audience',
  'Target Audience': 'Target_Audience',
  'Language': 'Language',
  'Institution ID': 'Linked_Institution_ID',
  'Linked Institution': 'Linked_Institution_ID',
  'Institution': 'Institution_Name',
  'Public': 'Is_Public',
  'Access': 'Access_Level'
};

/**
 * Generate empty template for Resources
 */
export function generateResourcesTemplate(): Record<string, string> {
  return {
    Resource_Name: '',
    Resource_Type: '',
    Resource_Description: '',
    Resource_URL: '',
    Category: '',
    Amyloidosis_Type: '',
    Target_Audience: '',
    Language: 'English',
    Linked_Institution_ID: '',
    Is_Public: 'true',
    Access_Level: 'Public',
    Tag: 'DataSyncService'
  };
}
