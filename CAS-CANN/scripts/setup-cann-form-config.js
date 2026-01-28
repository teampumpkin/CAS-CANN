#!/usr/bin/env node

/**
 * Setup script for CANN Membership Form Configuration
 * 
 * This script creates the form configuration for "Join CANN Today" membership form
 * and sets up appropriate field mappings for Zoho CRM integration.
 */

const { storage } = require('../server/storage.js');

async function setupCANNFormConfiguration() {
  console.log('🚀 Setting up CANN Membership Form Configuration...');

  try {
    // Check if configuration already exists
    const existingConfig = await storage.getFormConfiguration("Join CANN Today");
    
    if (existingConfig) {
      console.log('📋 CANN form configuration already exists:', existingConfig.id);
      console.log('📊 Current configuration:', {
        formName: existingConfig.formName,
        zohoModule: existingConfig.zohoModule,
        isActive: existingConfig.isActive,
        fieldMappings: existingConfig.fieldMappings
      });
      return existingConfig;
    }

    // Create CANN form configuration
    const cannFormConfig = {
      formName: "Join CANN Today",
      zohoModule: "Leads", // Map to Leads module in Zoho CRM
      description: "Canadian Amyloidosis Nursing Network membership application form",
      isActive: true,
      fieldMappings: {
        // Basic membership info
        "membershipRequest": {
          "zohoField": "membershipRequest",
          "fieldType": "picklist",
          "isRequired": true,
          "description": "Whether user wants CAS membership"
        },
        "fullName": {
          "zohoField": "fullName", 
          "fieldType": "text",
          "isRequired": false,
          "description": "Full name of the applicant"
        },
        "emailAddress": {
          "zohoField": "emailAddress",
          "fieldType": "email", 
          "isRequired": false,
          "description": "Email address of the applicant"
        },
        "discipline": {
          "zohoField": "discipline",
          "fieldType": "text",
          "isRequired": false,
          "description": "Professional discipline (nurse, physician, etc.)"
        },
        "subspecialty": {
          "zohoField": "subspecialty",
          "fieldType": "text",
          "isRequired": false,
          "description": "Sub-specialty area of focus"
        },
        "institutionName": {
          "zohoField": "institutionName",
          "fieldType": "text",
          "isRequired": false,
          "description": "Center or clinic name/institution"
        },
        "communicationConsent": {
          "zohoField": "communicationConsent",
          "fieldType": "picklist",
          "isRequired": false,
          "description": "Consent for communication from CAS"
        },

        // Services map related fields
        "servicesMapConsent": {
          "zohoField": "servicesMapConsent",
          "fieldType": "picklist",
          "isRequired": true,
          "description": "Consent for including center in services map"
        },
        "mapInstitutionName": {
          "zohoField": "mapInstitutionName",
          "fieldType": "text",
          "isRequired": false,
          "description": "Institution name for services map"
        },
        "institutionAddress": {
          "zohoField": "institutionAddress",
          "fieldType": "text",
          "isRequired": false,
          "description": "Full address of institution"
        },
        "institutionPhone": {
          "zohoField": "institutionPhone",
          "fieldType": "phone",
          "isRequired": false,
          "description": "Institution phone number"
        },
        "institutionFax": {
          "zohoField": "institutionFax",
          "fieldType": "text",
          "isRequired": false,
          "description": "Institution fax number"
        },
        "followUpConsent": {
          "zohoField": "followUpConsent",
          "fieldType": "picklist",
          "isRequired": false,
          "description": "Consent for follow-up contact by CAS"
        }
      },
      settings: {
        "autoCreateFields": true,
        "enableRetries": true,
        "maxRetries": 3,
        "syncRequired": true,
        "trackingEnabled": true,
        "notificationEmail": "admin@amyloid.ca"
      }
    };

    // Create the configuration
    const createdConfig = await storage.createFormConfiguration(cannFormConfig);
    console.log('✅ CANN form configuration created successfully!');
    console.log('📋 Configuration ID:', createdConfig.id);
    console.log('🎯 Zoho Module:', createdConfig.zohoModule);
    console.log('📊 Field Mappings Count:', Object.keys(createdConfig.fieldMappings).length);

    // Log the field mappings for verification
    console.log('\n📋 Field Mappings:');
    Object.entries(createdConfig.fieldMappings).forEach(([formField, config]) => {
      console.log(`  • ${formField} → ${config.zohoField} (${config.fieldType})`);
    });

    console.log('\n🎉 CANN form is now configured for automatic Zoho CRM integration!');
    console.log('🔄 The system will automatically:');
    console.log('   - Create missing fields in Zoho CRM');
    console.log('   - Map form data to appropriate Zoho fields');
    console.log('   - Track submission status and sync progress');
    console.log('   - Retry failed submissions automatically');

    return createdConfig;

  } catch (error) {
    console.error('❌ Error setting up CANN form configuration:', error);
    throw error;
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupCANNFormConfiguration()
    .then((config) => {
      console.log('\n🎯 Setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupCANNFormConfiguration };