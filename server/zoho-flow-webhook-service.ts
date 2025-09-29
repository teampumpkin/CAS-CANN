/**
 * Zoho Flow Webhook Service - Simple webhook integration for CANN form
 */

interface FormSubmissionData {
  fullName?: string;
  emailAddress?: string;
  discipline?: string;
  subspecialty?: string;
  institutionName?: string;
  communicationConsent?: string;
  servicesMapConsent?: string;
  amyloidosisType?: string;
  otherAmyloidosisType?: string;
  areasOfInterest?: string;
  otherInterest?: string;
  presentingInterest?: string;
  presentationTopic?: string;
  followUpConsent?: string;
  institutionAddress?: string;
  institutionPhone?: string;
  membershipRequest?: string;
}

export class ZohoFlowWebhookService {
  private webhookUrl: string;
  private zapiKey: string;

  constructor() {
    this.webhookUrl = process.env.ZOHO_FLOW_WEBHOOK_URL || '';
    this.zapiKey = process.env.ZOHO_FLOW_ZAPIKEY || '';
    
    if (!this.webhookUrl || !this.zapiKey) {
      console.error('[ZohoFlowWebhook] Missing required environment variables');
    } else {
      console.log('[ZohoFlowWebhook] Initialized successfully');
    }
  }

  /**
   * Submit form data to Zoho Flow webhook
   */
  async submitToWebhook(formData: FormSubmissionData): Promise<{
    success: boolean;
    error?: string;
    response?: any;
  }> {
    const requestId = `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    console.log(`[${requestId}] Submitting to Zoho Flow webhook`);

    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Webhook service not properly configured'
      };
    }

    try {
      // Prepare webhook payload with all form data
      const payload = {
        ...formData,
        formSource: 'Join CANN Today',
        submissionTime: new Date().toISOString(),
        requestId: requestId
      };

      console.log(`[${requestId}] Payload prepared:`, {
        fullName: payload.fullName,
        emailAddress: payload.emailAddress,
        discipline: payload.discipline,
        institutionName: payload.institutionName,
        submissionTime: payload.submissionTime
      });

      // Construct the complete webhook URL with zapikey
      const fullWebhookUrl = `${this.webhookUrl}&zapikey=${this.zapiKey}`;

      // Make the webhook request
      const response = await fetch(fullWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      console.log(`[${requestId}] Webhook response status: ${response.status}`);
      console.log(`[${requestId}] Webhook response: ${responseText}`);

      if (!response.ok) {
        console.error(`[${requestId}] Webhook failed with status ${response.status}: ${responseText}`);
        return {
          success: false,
          error: `Webhook request failed with status ${response.status}`
        };
      }

      // Try to parse response as JSON, but handle plain text responses
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        // If it's not JSON, use the text as-is
        responseData = responseText;
      }

      console.log(`[${requestId}] ✅ Successfully submitted to Zoho Flow webhook`);

      return {
        success: true,
        response: responseData
      };

    } catch (error) {
      console.error(`[${requestId}] Error submitting to webhook:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Check if the webhook service is properly configured
   */
  isConfigured(): boolean {
    return !!(this.webhookUrl && this.zapiKey);
  }

  /**
   * Get service status for debugging
   */
  getStatus() {
    return {
      configured: this.isConfigured(),
      hasWebhookUrl: !!this.webhookUrl,
      hasZapiKey: !!this.zapiKey,
      webhookDomain: this.webhookUrl ? new URL(this.webhookUrl).hostname : 'not set'
    };
  }
}

// Export singleton instance
export const zohoFlowWebhookService = new ZohoFlowWebhookService();