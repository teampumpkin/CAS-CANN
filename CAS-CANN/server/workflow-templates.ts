import type { InsertAutomationWorkflow } from "@shared/schema";

export const workflowTemplates: Record<string, InsertAutomationWorkflow> = {
  "new-lead-to-nurture-campaign": {
    name: "New Lead → Nurture Campaign",
    description: "Automatically add new leads to nurture email campaign list",
    triggerType: "crm_record_created",
    triggerConfig: {
      module: "Leads",
      conditions: [
        {
          field: "Lead_Status",
          operator: "equals",
          value: "New"
        }
      ]
    },
    conditions: [
      {
        field: "Email",
        operator: "is_not_empty"
      }
    ],
    actions: [
      {
        type: "add_to_campaign",
        config: {
          listKey: "{{NURTURE_LIST_KEY}}",
          email: "{{Email}}",
          firstName: "{{First_Name}}",
          lastName: "{{Last_Name}}"
        }
      }
    ],
    status: "paused"
  },

  "qualified-lead-to-sales-campaign": {
    name: "Qualified Lead → Sales Campaign",
    description: "Add qualified leads to sales follow-up campaign",
    triggerType: "crm_field_changed",
    triggerConfig: {
      module: "Leads",
      field: "Lead_Status",
      conditions: [
        {
          field: "Lead_Status",
          operator: "equals",
          value: "Qualified"
        }
      ]
    },
    conditions: [
      {
        field: "Email",
        operator: "is_not_empty"
      }
    ],
    actions: [
      {
        type: "add_to_campaign",
        config: {
          listKey: "{{SALES_LIST_KEY}}",
          email: "{{Email}}",
          firstName: "{{First_Name}}",
          lastName: "{{Last_Name}}"
        }
      },
      {
        type: "update_crm_field",
        config: {
          module: "Leads",
          recordId: "{{id}}",
          field: "Description",
          value: "Added to sales campaign on {{NOW}}"
        }
      }
    ],
    status: "paused"
  },

  "contact-created-welcome-email": {
    name: "New Contact → Welcome Email",
    description: "Send welcome email campaign when new contact is created",
    triggerType: "crm_record_created",
    triggerConfig: {
      module: "Contacts",
    },
    conditions: [
      {
        field: "Email",
        operator: "is_not_empty"
      }
    ],
    actions: [
      {
        type: "add_to_campaign",
        config: {
          listKey: "{{WELCOME_LIST_KEY}}",
          email: "{{Email}}",
          firstName: "{{First_Name}}",
          lastName: "{{Last_Name}}"
        }
      }
    ],
    status: "paused"
  },

  "lead-status-won-to-customer-campaign": {
    name: "Lead Won → Customer Campaign",
    description: "Move won leads to customer onboarding campaign",
    triggerType: "crm_field_changed",
    triggerConfig: {
      module: "Leads",
      field: "Lead_Status",
      conditions: [
        {
          field: "Lead_Status",
          operator: "equals",
          value: "Closed-Won"
        }
      ]
    },
    conditions: [
      {
        field: "Email",
        operator: "is_not_empty"
      }
    ],
    actions: [
      {
        type: "add_to_campaign",
        config: {
          listKey: "{{CUSTOMER_ONBOARDING_LIST_KEY}}",
          email: "{{Email}}",
          firstName: "{{First_Name}}",
          lastName: "{{Last_Name}}"
        }
      },
      {
        type: "create_crm_record",
        config: {
          module: "Contacts",
          data: {
            First_Name: "{{First_Name}}",
            Last_Name: "{{Last_Name}}",
            Email: "{{Email}}",
            Phone: "{{Phone}}",
            Lead_Source: "Converted from Lead"
          }
        }
      }
    ],
    status: "paused"
  },

  "high-value-lead-notification": {
    name: "High Value Lead → Notification",
    description: "Create task and send notification for high value leads",
    triggerType: "crm_record_created",
    triggerConfig: {
      module: "Leads",
      conditions: [
        {
          field: "Annual_Revenue",
          operator: "greater_than",
          value: 100000
        }
      ]
    },
    conditions: [],
    actions: [
      {
        type: "update_crm_field",
        config: {
          module: "Leads",
          recordId: "{{id}}",
          field: "Rating",
          value: "Hot"
        }
      },
      {
        type: "add_to_campaign",
        config: {
          listKey: "{{VIP_LIST_KEY}}",
          email: "{{Email}}",
          firstName: "{{First_Name}}",
          lastName: "{{Last_Name}}",
          additionalFields: {
            "Annual Revenue": "{{Annual_Revenue}}"
          }
        }
      }
    ],
    status: "paused"
  },

  "monthly-newsletter-blast": {
    name: "Monthly Newsletter Blast",
    description: "Manual trigger to send monthly newsletter",
    triggerType: "manual",
    triggerConfig: {},
    conditions: [],
    actions: [
      {
        type: "send_email",
        config: {
          campaignKey: "{{NEWSLETTER_CAMPAIGN_KEY}}"
        }
      }
    ],
    status: "paused"
  },

  "sync-crm-to-campaign-list": {
    name: "Sync CRM to Campaign List",
    description: "Manual bulk sync from CRM module to campaign list",
    triggerType: "manual",
    triggerConfig: {},
    conditions: [],
    actions: [
      {
        type: "http_request",
        config: {
          url: "{{API_BASE_URL}}/api/commands/sync-to-campaign",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: {
            crmModule: "{{CRM_MODULE}}",
            listKey: "{{LIST_KEY}}",
            filters: {},
            limit: 500
          }
        }
      }
    ],
    status: "paused"
  }
};

export function getTemplateNames(): string[] {
  return Object.keys(workflowTemplates);
}

export function getTemplate(name: string): InsertAutomationWorkflow | undefined {
  return workflowTemplates[name];
}

export function getAllTemplates(): Array<{ name: string; template: InsertAutomationWorkflow }> {
  return Object.entries(workflowTemplates).map(([name, template]) => ({ name, template }));
}
