import { dedicatedTokenManager } from "./dedicated-token-manager";

/**
 * Zoho Workflow Service
 * Manages automated email workflows using Zoho CRM's built-in workflow rules and email actions
 * 
 * This service creates 3 workflows:
 * 1. CANN Membership - Sends to CAS@amyloid.ca, CANN@amyloid.ca, vasi.karan@teampumpkin.com
 * 2. CAS-Only Membership - Sends to CAS@amyloid.ca, vasi.karan@teampumpkin.com
 * 3. Contact Form - Sends to CAS@amyloid.ca, vasi.karan@teampumpkin.com
 */
export class ZohoWorkflowService {
  private static instance: ZohoWorkflowService;
  private readonly ZOHO_API_BASE = "https://www.zohoapis.com/crm/v8";

  static getInstance(): ZohoWorkflowService {
    if (!ZohoWorkflowService.instance) {
      ZohoWorkflowService.instance = new ZohoWorkflowService();
    }
    return ZohoWorkflowService.instance;
  }

  /**
   * Get access token with automatic refresh
   */
  private async getAccessToken(): Promise<string> {
    const health = await dedicatedTokenManager.checkTokenHealth('zoho_crm');
    
    if (!health.isValid) {
      throw new Error('No valid Zoho CRM access token available');
    }

    if (health.needsRefresh && health.isValid) {
      const refreshed = await dedicatedTokenManager.forceRefreshToken('zoho_crm');
      if (refreshed) {
        return refreshed.accessToken;
      }
    }
    
    const token = await dedicatedTokenManager.getValidAccessToken('zoho_crm');
    if (!token) {
      throw new Error("No valid Zoho CRM access token available");
    }
    return token;
  }

  /**
   * Setup all email notification workflows
   * Creates 3 workflows for different registration types
   */
  async setupRegistrationEmailWorkflows(): Promise<{
    success: boolean;
    workflows: { name: string; id?: string }[];
    errors: string[];
  }> {
    const results = {
      success: true,
      workflows: [] as { name: string; id?: string }[],
      errors: [] as string[]
    };

    try {
      console.log('[Zoho Workflow] Setting up all registration email workflows...');
      const accessToken = await this.getAccessToken();

      // Create 3 separate email notification actions with conditional logic
      const workflows = [
        {
          name: "CANN Membership Notification",
          leadSourceFilter: "CANN",
          filterType: "contains" as const,
          recipients: [
            { type: "email" as const, email: "CAS@amyloid.ca" },
            { type: "email" as const, email: "CANN@amyloid.ca" },
            { type: "email" as const, email: "vasi.karan@teampumpkin.com" }
          ],
          subject: "🎉 New CANN Membership Registration",
          template: this.getCANNEmailTemplate()
        },
        {
          name: "CAS Membership Notification",
          leadSourceFilter: "CAS",
          filterType: "contains" as const,
          excludeFilter: "CANN",
          recipients: [
            { type: "email" as const, email: "CAS@amyloid.ca" },
            { type: "email" as const, email: "vasi.karan@teampumpkin.com" }
          ],
          subject: "🎉 New CAS Membership Registration",
          template: this.getCASEmailTemplate()
        },
        {
          name: "Contact Form Notification",
          leadSourceFilter: "Contact",
          filterType: "contains" as const,
          recipients: [
            { type: "email" as const, email: "CAS@amyloid.ca" },
            { type: "email" as const, email: "vasi.karan@teampumpkin.com" }
          ],
          subject: "📧 New Contact Form Submission",
          template: this.getContactEmailTemplate()
        }
      ];

      for (const config of workflows) {
        try {
          const workflowId = await this.createEmailWorkflow(accessToken, config);
          results.workflows.push({ name: config.name, id: workflowId });
          console.log(`[Zoho Workflow] ✅ Created: ${config.name}`);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          results.errors.push(`${config.name}: ${errorMsg}`);
          console.error(`[Zoho Workflow] ❌ Failed to create ${config.name}:`, error);
        }
      }

      results.success = results.errors.length === 0;
      console.log(`[Zoho Workflow] Setup complete: ${results.workflows.length}/${workflows.length} workflows created`);
      
      return results;
    } catch (error) {
      console.error('[Zoho Workflow] Fatal error setting up workflows:', error);
      results.success = false;
      results.errors.push(error instanceof Error ? error.message : 'Unknown error');
      return results;
    }
  }

  /**
   * Create a single email workflow with action and rule
   */
  private async createEmailWorkflow(
    accessToken: string,
    config: {
      name: string;
      leadSourceFilter: string;
      filterType: "contains" | "equals";
      excludeFilter?: string;
      recipients: Array<{ type: "email"; email: string }>;
      subject: string;
      template: string;
    }
  ): Promise<string> {
    console.log(`[Zoho Workflow] Creating workflow: ${config.name}`);

    // Step 1: Create email notification action
    const emailActionId = await this.createEmailNotificationAction(accessToken, {
      name: config.name,
      recipients: config.recipients,
      subject: config.subject,
      body: config.template
    });

    console.log(`[Zoho Workflow] Created email action for ${config.name}: ${emailActionId}`);

    // Step 2: Create workflow rule with conditions
    const workflowId = await this.createWorkflowRule(accessToken, {
      name: config.name.replace("Notification", "Workflow"),
      emailActionId,
      leadSourceFilter: config.leadSourceFilter,
      filterType: config.filterType,
      excludeFilter: config.excludeFilter
    });

    console.log(`[Zoho Workflow] Created workflow rule for ${config.name}: ${workflowId}`);
    return workflowId;
  }

  /**
   * Get the current user's ID for from_address
   */
  private async getCurrentUserId(accessToken: string): Promise<string> {
    try {
      const url = `${this.ZOHO_API_BASE}/users?type=CurrentUser`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get current user: ${response.status}`);
      }

      const result = await response.json();
      if (result.users && result.users.length > 0) {
        return result.users[0].id;
      }
      
      throw new Error('No user found in response');
    } catch (error) {
      console.error('[Zoho Workflow] Failed to get current user ID:', error);
      throw error;
    }
  }

  /**
   * Create email notification action
   */
  private async createEmailNotificationAction(
    accessToken: string,
    config: {
      name: string;
      recipients: Array<{ type: "email"; email: string }>;
      subject: string;
      body: string;
    }
  ): Promise<string> {
    // Get current user ID for from_address
    const userId = await this.getCurrentUserId(accessToken);
    
    const url = `${this.ZOHO_API_BASE}/settings/automation/email_notifications`;

    const payload = {
      email_notifications: [
        {
          name: config.name,
          module: {
            api_name: "Leads"
          },
          from_address: {
            resource: {
              id: userId
            },
            type: "user"
          },
          to_emails: config.recipients,
          subject: config.subject,
          body: config.body
        }
      ]
    };

    console.log(`[Zoho Workflow] Creating email notification with from_address user ID: ${userId}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create email notification: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.email_notifications && result.email_notifications.length > 0) {
      const action = result.email_notifications[0];
      if (action.status === 'success' && action.details) {
        return action.details.id;
      }
    }

    throw new Error('Failed to get email notification action ID from response');
  }

  /**
   * Create workflow rule with conditional logic
   */
  private async createWorkflowRule(
    accessToken: string,
    config: {
      name: string;
      emailActionId: string;
      leadSourceFilter: string;
      filterType: "contains" | "equals";
      excludeFilter?: string;
    }
  ): Promise<string> {
    const url = `${this.ZOHO_API_BASE}/settings/automation/workflow_rules`;

    // Build criteria based on filter configuration
    let criteriaGroup: any[] = [
      {
        comparator: config.filterType === "contains" ? "contains" : "equal",
        field: {
          api_name: "Lead_Source"
        },
        value: config.leadSourceFilter
      }
    ];

    // Add exclusion filter if specified (for CAS-only workflow)
    if (config.excludeFilter) {
      criteriaGroup.push({
        comparator: "does_not_contain",
        field: {
          api_name: "Lead_Source"
        },
        value: config.excludeFilter
      });
    }

    const payload = {
      workflow_rules: [
        {
          name: config.name,
          description: `Auto-send email notifications for ${config.name.toLowerCase()}`,
          module: {
            api_name: "Leads"
          },
          execute_when: {
            type: "create",
            details: {}
          },
          status: {
            active: true
          },
          conditions: [
            {
              sequence_number: 1,
              criteria_details: {
                criteria: {
                  group_operator: "and",
                  group: criteriaGroup
                }
              },
              instant_actions: {
                actions: [
                  {
                    type: "email_notifications",
                    id: config.emailActionId
                  }
                ]
              }
            }
          ]
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create workflow rule: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.workflow_rules && result.workflow_rules.length > 0) {
      const rule = result.workflow_rules[0];
      if (rule.status === 'success' && rule.details) {
        return rule.details.id;
      }
    }

    throw new Error('Failed to get workflow rule ID from response');
  }

  /**
   * Get list of all workflow rules
   */
  async getWorkflowRules(module?: string): Promise<any[]> {
    try {
      const accessToken = await this.getAccessToken();
      let url = `${this.ZOHO_API_BASE}/settings/automation/workflow_rules`;
      
      if (module) {
        url += `?module=${encodeURIComponent(module)}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch workflows: ${response.status}`);
      }

      const result = await response.json();
      return result.workflow_rules || [];
    } catch (error) {
      console.error('[Zoho Workflow] Error fetching workflows:', error);
      return [];
    }
  }

  /**
   * Get a specific workflow rule by ID
   */
  async getWorkflowRule(workflowId: string): Promise<any | null> {
    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.ZOHO_API_BASE}/settings/automation/workflow_rules/${workflowId}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch workflow: ${response.status}`);
      }

      const result = await response.json();
      return result.workflow_rules?.[0] || null;
    } catch (error) {
      console.error('[Zoho Workflow] Error fetching workflow:', error);
      return null;
    }
  }

  /**
   * Update an existing workflow rule
   */
  async updateWorkflowRule(workflowId: string, updates: any): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.ZOHO_API_BASE}/settings/automation/workflow_rules/${workflowId}`;

      const payload = {
        workflow_rules: [updates]
      };

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update workflow: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log(`[Zoho Workflow] Updated workflow ${workflowId}`);
      return result.workflow_rules?.[0]?.status === 'success';
    } catch (error) {
      console.error('[Zoho Workflow] Error updating workflow:', error);
      return false;
    }
  }

  /**
   * Delete workflow rules
   */
  async deleteWorkflowRules(workflowIds: string[]): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.ZOHO_API_BASE}/settings/automation/workflow_rules?ids=${workflowIds.join(',')}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete workflows: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log(`[Zoho Workflow] Deleted ${workflowIds.length} workflows`);
      return result.workflow_rules?.[0]?.status === 'success';
    } catch (error) {
      console.error('[Zoho Workflow] Error deleting workflows:', error);
      return false;
    }
  }

  /**
   * Get all email notification actions
   */
  async getEmailNotifications(): Promise<any[]> {
    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.ZOHO_API_BASE}/settings/automation/email_notifications`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch email notifications: ${response.status}`);
      }

      const result = await response.json();
      return result.email_notifications || [];
    } catch (error) {
      console.error('[Zoho Workflow] Error fetching email notifications:', error);
      return [];
    }
  }

  /**
   * Delete email notification actions
   */
  async deleteEmailNotifications(notificationIds: string[]): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();
      const url = `${this.ZOHO_API_BASE}/settings/automation/email_notifications?ids=${notificationIds.join(',')}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete email notifications: ${response.status} - ${errorText}`);
      }

      console.log(`[Zoho Workflow] Deleted ${notificationIds.length} email notifications`);
      return true;
    } catch (error) {
      console.error('[Zoho Workflow] Error deleting email notifications:', error);
      return false;
    }
  }

  /**
   * Get workflow usage statistics
   */
  async getWorkflowStats(): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      
      // Get module-wise count
      const moduleCountUrl = `${this.ZOHO_API_BASE}/settings/automation/workflow_rules/counts`;
      const moduleCountResponse = await fetch(moduleCountUrl, {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      });

      const moduleCount = moduleCountResponse.ok ? await moduleCountResponse.json() : {};

      // Get actions count
      const actionsCountUrl = `${this.ZOHO_API_BASE}/settings/automation/workflow_rules/actions/count`;
      const actionsCountResponse = await fetch(actionsCountUrl, {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      });

      const actionsCount = actionsCountResponse.ok ? await actionsCountResponse.json() : {};

      return {
        moduleCount: moduleCount.count || {},
        actionsCount: actionsCount.count || {},
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('[Zoho Workflow] Error fetching workflow stats:', error);
      return {
        moduleCount: {},
        actionsCount: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Email template for CANN membership registrations
   */
  private getCANNEmailTemplate(): string {
    return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #00AFE6, #00DD89); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">New CANN Membership</h1>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
    <div style="margin-bottom: 20px; text-align: center;">
      <span style="background: linear-gradient(135deg, #00AFE6, #00DD89); color: white; padding: 6px 14px; border-radius: 12px; font-weight: 600; font-size: 12px;">CAS & CANN</span>
    </div>
    
    <h2 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; border-bottom: 2px solid #00AFE6; padding-bottom: 8px;">Registrant Details</h2>
    
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Name:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{Last Name}}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Email:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;"><a href="mailto:{{Email}}" style="color: #00AFE6;">{{Email}}</a></td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Discipline:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{Industry}}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Subspecialty:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{Description}}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Institution:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{Company}}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>CAS Communications:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{CAS Communications}}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Services Map:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{Services Map Inclusion}}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Amyloidosis Type:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{Amyloidosis Type}}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>CANN Communications:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{CANN Communications}}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Educational Interests:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{Educational Interests}}</td></tr>
      <tr><td style="padding: 10px 0;"><strong>Interested in Presenting:</strong></td><td style="padding: 10px 0; text-align: right;">{{Interested in Presenting}}</td></tr>
    </table>
    
    <div style="margin-top: 25px; padding: 18px; background: #f9fafb; border-radius: 8px; text-align: center;">
      <a href="https://crm.zoho.com/crm/org20085707052/tab/Leads/{{Lead ID}}" style="display: inline-block; background: linear-gradient(135deg, #00AFE6, #00DD89); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View in CRM</a>
    </div>
  </div>
  
  <div style="margin-top: 15px; padding: 15px; text-align: center; color: #9ca3af; font-size: 12px;">
    <p style="margin: 0;">Automated from Canadian Amyloidosis Society</p>
  </div>
</div>
    `.trim();
  }

  /**
   * Email template for CAS-only membership registrations
   */
  private getCASEmailTemplate(): string {
    return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #00AFE6, #00DD89); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">New CAS Membership</h1>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
    <div style="margin-bottom: 20px; text-align: center;">
      <span style="background: #00AFE6; color: white; padding: 6px 14px; border-radius: 12px; font-weight: 600; font-size: 12px;">CAS Only</span>
    </div>
    
    <h2 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; border-bottom: 2px solid #00AFE6; padding-bottom: 8px;">Registrant Details</h2>
    
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Name:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{Last Name}}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Email:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;"><a href="mailto:{{Email}}" style="color: #00AFE6;">{{Email}}</a></td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Discipline:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{Industry}}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Subspecialty:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{Description}}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Institution:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{Company}}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>CAS Communications:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{CAS Communications}}</td></tr>
      <tr><td style="padding: 10px 0;"><strong>Services Map:</strong></td><td style="padding: 10px 0; text-align: right;">{{Services Map Inclusion}}</td></tr>
    </table>
    
    <div style="margin-top: 25px; padding: 18px; background: #f9fafb; border-radius: 8px; text-align: center;">
      <a href="https://crm.zoho.com/crm/org20085707052/tab/Leads/{{Lead ID}}" style="display: inline-block; background: linear-gradient(135deg, #00AFE6, #00DD89); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View in CRM</a>
    </div>
  </div>
  
  <div style="margin-top: 15px; padding: 15px; text-align: center; color: #9ca3af; font-size: 12px;">
    <p style="margin: 0;">Automated from Canadian Amyloidosis Society</p>
  </div>
</div>
    `.trim();
  }

  /**
   * Email template for non-member contact form submissions
   */
  private getContactEmailTemplate(): string {
    return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #00AFE6, #00DD89); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">New Contact Submission</h1>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
    <div style="margin-bottom: 20px; text-align: center;">
      <span style="background: #9CA3AF; color: white; padding: 6px 14px; border-radius: 12px; font-weight: 600; font-size: 12px;">Non-Member Contact</span>
    </div>
    
    <h2 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; border-bottom: 2px solid #00AFE6; padding-bottom: 8px;">Contact Details</h2>
    
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Name:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{Last Name}}</td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Email:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;"><a href="mailto:{{Email}}" style="color: #00AFE6;">{{Email}}</a></td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><strong>Discipline:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{Industry}}</td></tr>
      <tr><td style="padding: 10px 0;"><strong>Institution:</strong></td><td style="padding: 10px 0; text-align: right;">{{Company}}</td></tr>
    </table>
    
    <div style="margin-top: 25px; padding: 18px; background: #f9fafb; border-radius: 8px; text-align: center;">
      <a href="https://crm.zoho.com/crm/org20085707052/tab/Leads/{{Lead ID}}" style="display: inline-block; background: linear-gradient(135deg, #00AFE6, #00DD89); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View in CRM</a>
    </div>
  </div>
  
  <div style="margin-top: 15px; padding: 15px; text-align: center; color: #9ca3af; font-size: 12px;">
    <p style="margin: 0;">Automated from Canadian Amyloidosis Society</p>
  </div>
</div>
    `.trim();
  }
}

export const zohoWorkflowService = ZohoWorkflowService.getInstance();
