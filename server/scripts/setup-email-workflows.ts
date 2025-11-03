/**
 * Setup Email Notification Workflows
 * 
 * This script creates two Zoho CRM workflow rules:
 * 1. Admin Notification Workflow - Notifies CAS/CANN team of new registrations
 * 2. Member Welcome Email Workflow - Sends welcome email to new members with event details
 */

import { ZohoWorkflowService } from '../zoho-workflow-service';

async function setupEmailWorkflows() {
  console.log('='.repeat(60));
  console.log('🚀 Setting up CAS/CANN Email Notification Workflows');
  console.log('='.repeat(60));
  console.log('');

  try {
    const workflowService = ZohoWorkflowService.getInstance();
    
    console.log('📧 Creating automated email workflows in Zoho CRM...');
    console.log('');
    
    const result = await workflowService.setupRegistrationEmailWorkflows();
    
    console.log('');
    console.log('='.repeat(60));
    console.log('📊 Setup Results');
    console.log('='.repeat(60));
    
    if (result.success) {
      console.log('✅ SUCCESS! All workflows created successfully');
      console.log('');
      console.log('Created workflows:');
      result.workflows.forEach(wf => {
        console.log(`  ✓ ${wf.name} (ID: ${wf.id})`);
      });
    } else {
      console.log('⚠️  PARTIAL SUCCESS - Some workflows failed');
      console.log('');
      if (result.workflows.length > 0) {
        console.log('Created workflows:');
        result.workflows.forEach(wf => {
          console.log(`  ✓ ${wf.name} (ID: ${wf.id})`);
        });
        console.log('');
      }
      if (result.errors.length > 0) {
        console.log('Errors:');
        result.errors.forEach(err => {
          console.log(`  ✗ ${err}`);
        });
      }
    }
    
    console.log('');
    console.log('='.repeat(60));
    console.log('📝 Next Steps');
    console.log('='.repeat(60));
    console.log('1. Test the workflows by submitting a registration at /join-cas');
    console.log('2. Check emails at:');
    console.log('   - CAS@amyloid.ca');
    console.log('   - CANN@amyloid.ca (for CANN registrations)');
    console.log('   - vasi.karan@teampumpkin.com');
    console.log('   - Member email addresses (welcome emails)');
    console.log('3. Verify Zoho CRM → Setup → Automation → Workflow Rules');
    console.log('');
    
    process.exit(result.success ? 0 : 1);
    
  } catch (error) {
    console.error('');
    console.error('='.repeat(60));
    console.error('❌ FATAL ERROR');
    console.error('='.repeat(60));
    console.error(error);
    console.error('');
    process.exit(1);
  }
}

// Run the setup
setupEmailWorkflows();
