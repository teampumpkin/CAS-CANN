import { dedicatedTokenManager } from "./dedicated-token-manager";

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
   * Create email notification workflow for new lead registrations
   */
  async createRegistrationEmailWorkflow(): Promise<void> {
    try {
      console.log('[Workflow] Creating automated email notification workflow...');

      const accessToken = await dedicatedTokenManager.getValidAccessToken('zoho_crm');
      if (!accessToken) {
        throw new Error('No valid Zoho access token available');
      }

      // Step 1: Create email notification action
      const emailActionId = await this.createEmailNotificationAction(accessToken);
      console.log(`[Workflow] Created email notification action: ${emailActionId}`);

      // Step 2: Create workflow rule
      const workflowId = await this.createWorkflowRule(accessToken, emailActionId);
      console.log(`[Workflow] ✅ Created workflow rule: ${workflowId}`);

      console.log('[Workflow] Email automation setup complete!');
    } catch (error) {
      console.error('[Workflow] Failed to create email workflow:', error);
      throw error;
    }
  }

  /**
   * Create email notification action
   */
  private async createEmailNotificationAction(accessToken: string): Promise<string> {
    const url = `${this.ZOHO_API_BASE}/settings/automation/workflow_rules/actions/email_notifications`;

    const payload = {
      email_notifications: [
        {
          name: "CAS CANN Registration Notification",
          module: {
            api_name: "Leads"
          },
          from_email: {
            type: "current_user"
          },
          to_emails: [
            {
              type: "email",
              email: "CAS@amyloid.ca"
            },
            {
              type: "email",
              email: "vasi.karan@teampumpkin.com"
            },
            {
              type: "email",  
              email: "CANN@amyloid.ca"
            }
          ],
          subject: "New Registration - {{Lead Source}}",
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #00AFE6, #00DD89); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">New Registration Received</h1>
              </div>
              
              <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                <h2 style="color: #1f2937; border-bottom: 2px solid #00AFE6; padding-bottom: 8px;">Registrant Details</h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong>Name:</strong></td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{Last Name}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong>Email:</strong></td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{Email}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong>Discipline:</strong></td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{Industry}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong>Institution:</strong></td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">{{Company}}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;"><strong>Lead Source:</strong></td>
                    <td style="padding: 12px 0; text-align: right;">{{Lead Source}}</td>
                  </tr>
                </table>
                
                <div style="margin-top: 30px; text-align: center;">
                  <a href="https://crm.zoho.com/crm/org20085707052/tab/Leads/{{Lead ID}}" 
                     style="display: inline-block; background: linear-gradient(135deg, #00AFE6, #00DD89); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
                    View in CRM
                  </a>
                </div>
              </div>
            </div>
          `
        }
      ]
    };

    console.log('[Workflow] Creating email notification action...');

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
    console.log('[Workflow] Email notification response:', JSON.stringify(result, null, 2));

    if (result.email_notifications && result.email_notifications.length > 0) {
      const action = result.email_notifications[0];
      if (action.status === 'success' && action.details) {
        return action.details.id;
      }
    }

    throw new Error('Failed to get email notification action ID from response');
  }

  /**
   * Create workflow rule
   */
  private async createWorkflowRule(accessToken: string, emailActionId: string): Promise<string> {
    const url = `${this.ZOHO_API_BASE}/settings/automation/workflow_rules`;

    const payload = {
      workflow_rules: [
        {
          name: "Auto-Email CAS CANN Registrations",
          description: "Send email notifications when new leads are created from website registration",
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
                  group_operator: "or",
                  group: [
                    {
                      comparator: "equal",
                      field: {
                        api_name: "Lead_Source"
                      },
                      value: "Website - CAS Registration"
                    },
                    {
                      comparator: "equal",
                      field: {
                        api_name: "Lead_Source"
                      },
                      value: "Website - CAS & CANN Registration"
                    }
                  ]
                }
              },
              instant_actions: {
                actions: [
                  {
                    type: "email_notifications",
                    id: emailActionId
                  }
                ]
              }
            }
          ]
        }
      ]
    };

    console.log('[Workflow] Creating workflow rule...');

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
    console.log('[Workflow] Workflow rule response:', JSON.stringify(result, null, 2));

    if (result.workflow_rules && result.workflow_rules.length > 0) {
      const rule = result.workflow_rules[0];
      if (rule.status === 'success' && rule.details) {
        return rule.details.id;
      }
    }

    throw new Error('Failed to get workflow rule ID from response');
  }
}

export const zohoWorkflowService = ZohoWorkflowService.getInstance();
