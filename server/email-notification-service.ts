import { dedicatedTokenManager } from "./dedicated-token-manager";

export interface EmailRecipient {
  user_name: string;
  email: string;
}

export interface RegistrationEmailData {
  fullName: string;
  email: string;
  discipline?: string;
  membershipType: 'CAS' | 'CAS & CANN' | 'Contact';
  institution?: string;
  leadId: string;
}

export class EmailNotificationService {
  private static instance: EmailNotificationService;
  private readonly ZOHO_API_BASE = "https://www.zohoapis.com/crm/v8";

  static getInstance(): EmailNotificationService {
    if (!EmailNotificationService.instance) {
      EmailNotificationService.instance = new EmailNotificationService();
    }
    return EmailNotificationService.instance;
  }

  /**
   * Send registration notification emails to CAS and CANN
   */
  async sendRegistrationNotification(data: RegistrationEmailData): Promise<void> {
    try {
      console.log(`[Email Notification] Preparing to send registration notification for ${data.fullName}`);

      const recipients: EmailRecipient[] = [
        { user_name: "CAS Team", email: "CAS@amyloid.ca" },
        { user_name: "Karan Vasi", email: "vasi.karan@teampumpkin.com" }
      ];

      // Add CANN email if it's a CANN registration
      if (data.membershipType === 'CAS & CANN') {
        recipients.push({ user_name: "CANN Team", email: "CANN@amyloid.ca" });
      }

      // Create email body
      const emailSubject = this.getEmailSubject(data.membershipType);
      const emailContent = this.getEmailContent(data);

      // Send email to each recipient
      for (const recipient of recipients) {
        await this.sendEmail({
          leadId: data.leadId,
          to: [recipient],
          subject: emailSubject,
          content: emailContent
        });
      }

      console.log(`[Email Notification] ✅ Successfully sent notifications to ${recipients.map(r => r.email).join(', ')}`);
    } catch (error) {
      console.error(`[Email Notification] ❌ Failed to send notification:`, error);
      // Don't throw - we don't want email failures to block registration
    }
  }

  /**
   * Get current Zoho user info using Accounts API
   */
  private async getCurrentUser(): Promise<{ user_name: string; email: string } | null> {
    try {
      const accessToken = await dedicatedTokenManager.getValidAccessToken('zoho_crm');
      if (!accessToken) {
        return null;
      }

      // Use Zoho Accounts API which doesn't require extra scopes
      const response = await fetch('https://accounts.zoho.com/oauth/user/info', {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      });

      if (!response.ok) {
        console.error('[Email Notification] Failed to get user info:', response.status);
        return null;
      }

      const data = await response.json();
      if (data.Email) {
        return {
          user_name: data.Display_Name || `${data.First_Name} ${data.Last_Name}` || "CAS Admin",
          email: data.Email
        };
      }
      return null;
    } catch (error) {
      console.error('[Email Notification] Error getting current user:', error);
      return null;
    }
  }

  /**
   * Send email using Zoho CRM Send Mail API
   */
  private async sendEmail(params: {
    leadId: string;
    to: EmailRecipient[];
    subject: string;
    content: string;
  }): Promise<void> {
    try {
      const accessToken = await dedicatedTokenManager.getValidAccessToken('zoho_crm');
      if (!accessToken) {
        throw new Error('No valid Zoho access token available');
      }

      // Get current user's email for "from" address
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('Unable to get current user email for sending');
      }

      const url = `${this.ZOHO_API_BASE}/Leads/${params.leadId}/actions/send_mail`;

      const payload = {
        data: [
          {
            from: currentUser,
            to: params.to,
            subject: params.subject,
            content: params.content,
            mail_format: "html",
            org_email: true
          }
        ]
      };

      console.log(`[Email Notification] Sending email to ${params.to.map(r => r.email).join(', ')}`);
      console.log(`[Email Notification] Payload:`, JSON.stringify(payload, null, 2));

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
        throw new Error(`Zoho Send Mail API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log(`[Email Notification] Send mail response:`, result);

      if (result.data && result.data[0]?.code === 'SUCCESS') {
        console.log(`[Email Notification] ✅ Email sent successfully to ${params.to.map(r => r.email).join(', ')}`);
      } else {
        throw new Error(`Email send failed: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      console.error(`[Email Notification] Error sending email:`, error);
      throw error;
    }
  }

  /**
   * Generate email subject based on membership type
   */
  private getEmailSubject(membershipType: string): string {
    switch (membershipType) {
      case 'CAS & CANN':
        return '🎉 New CANN Membership Registration';
      case 'CAS':
        return '🎉 New CAS Membership Registration';
      default:
        return '📧 New Contact Form Submission';
    }
  }

  /**
   * Generate email content with registration details
   */
  private getEmailContent(data: RegistrationEmailData): string {
    const membershipBadge = data.membershipType === 'CAS & CANN' 
      ? '<span style="background: linear-gradient(135deg, #00AFE6, #00DD89); color: white; padding: 4px 12px; border-radius: 12px; font-weight: 600; font-size: 12px;">CAS & CANN</span>'
      : data.membershipType === 'CAS'
      ? '<span style="background: #00AFE6; color: white; padding: 4px 12px; border-radius: 12px; font-weight: 600; font-size: 12px;">CAS Only</span>'
      : '<span style="background: #9CA3AF; color: white; padding: 4px 12px; border-radius: 12px; font-weight: 600; font-size: 12px;">Non-Member Contact</span>';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #00AFE6, #00DD89); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">
            ${data.membershipType === 'Contact' ? 'New Contact Submission' : 'New Registration Received'}
          </h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 14px;">
            ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <!-- Content -->
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          
          <!-- Membership Type Badge -->
          <div style="margin-bottom: 24px; text-align: center;">
            ${membershipBadge}
          </div>

          <!-- Registration Details -->
          <h2 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; border-bottom: 2px solid #00AFE6; padding-bottom: 8px;">
            ${data.membershipType === 'Contact' ? 'Contact' : 'Registrant'} Details
          </h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                <strong style="color: #4b5563; font-size: 14px;">Full Name:</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">
                <span style="color: #1f2937; font-size: 14px;">${data.fullName}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                <strong style="color: #4b5563; font-size: 14px;">Email:</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">
                <a href="mailto:${data.email}" style="color: #00AFE6; text-decoration: none; font-size: 14px;">${data.email}</a>
              </td>
            </tr>
            ${data.discipline ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                <strong style="color: #4b5563; font-size: 14px;">Discipline/Title:</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">
                <span style="color: #1f2937; font-size: 14px;">${data.discipline}</span>
              </td>
            </tr>
            ` : ''}
            ${data.institution ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                <strong style="color: #4b5563; font-size: 14px;">Institution:</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">
                <span style="color: #1f2937; font-size: 14px;">${data.institution}</span>
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 12px 0;">
                <strong style="color: #4b5563; font-size: 14px;">Membership Type:</strong>
              </td>
              <td style="padding: 12px 0; text-align: right;">
                <span style="color: #1f2937; font-size: 14px; font-weight: 600;">${data.membershipType}</span>
              </td>
            </tr>
          </table>

          <!-- CRM Link -->
          <div style="margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">View in Zoho CRM:</p>
            <a href="https://crm.zoho.com/crm/org20085707052/tab/Leads/${data.leadId}" 
               style="display: inline-block; background: linear-gradient(135deg, #00AFE6, #00DD89); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
              Open Lead Record
            </a>
          </div>

        </div>

        <!-- Footer -->
        <div style="margin-top: 20px; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
          <p style="margin: 0;">This is an automated notification from the Canadian Amyloidosis Society website.</p>
          <p style="margin: 8px 0 0 0;">
            <a href="https://amyloid.ca" style="color: #00AFE6; text-decoration: none;">amyloid.ca</a>
          </p>
        </div>

      </body>
      </html>
    `;
  }
}

export const emailNotificationService = EmailNotificationService.getInstance();
