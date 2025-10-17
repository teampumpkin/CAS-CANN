/**
 * Module Schemas Index
 * Exports all module schemas and utilities
 */

export * from './accounts-schema';
export * from './contacts-schema';
export * from './resources-schema';

import { accountsSchema, accountsFieldMappings, generateAccountsTemplate } from './accounts-schema';
import { contactsSchema, contactsFieldMappings, generateContactsTemplate } from './contacts-schema';
import { resourcesSchema, resourcesFieldMappings, generateResourcesTemplate } from './resources-schema';
import { ModuleSchema } from '../types';

export const moduleSchemas = {
  Accounts: accountsSchema,
  Contacts: contactsSchema,
  Resources: resourcesSchema
};

export const fieldMappings = {
  Accounts: accountsFieldMappings,
  Contacts: contactsFieldMappings,
  Resources: resourcesFieldMappings
};

export const templateGenerators = {
  Accounts: generateAccountsTemplate,
  Contacts: generateContactsTemplate,
  Resources: generateResourcesTemplate
};

/**
 * Get schema for a specific module
 */
export function getModuleSchema(moduleName: 'Accounts' | 'Contacts' | 'Resources'): ModuleSchema {
  return moduleSchemas[moduleName];
}

/**
 * Get field mappings for a specific module
 */
export function getFieldMappings(moduleName: 'Accounts' | 'Contacts' | 'Resources'): Record<string, string> {
  return fieldMappings[moduleName];
}

/**
 * Generate CSV template for a specific module
 */
export function generateTemplate(moduleName: 'Accounts' | 'Contacts' | 'Resources'): Record<string, string> {
  return templateGenerators[moduleName]();
}
