import { dedicatedTokenManager } from "./dedicated-token-manager";

interface CampaignListResponse {
  list_of_details: Array<{
    listkey: string;
    listname: string;
    subscriber_count: number;
    [key: string]: any;
  }>;
}

interface CampaignResponse {
  campaign_key: string;
  campaign_name: string;
  status: string;
  [key: string]: any;
}

interface SubscriberResponse {
  contact_email: string;
  email_id?: string;
  [key: string]: any;
}

class ZohoCampaignsService {
  private baseUrl = "https://campaigns.zoho.com/api/v1.1";

  private async getAccessToken(): Promise<string> {
    const token = await dedicatedTokenManager.getValidAccessToken();
    if (!token) {
      throw new Error("No valid Zoho access token available. Please authenticate first.");
    }
    return token;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const accessToken = await this.getAccessToken();
    
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Authorization": `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    console.log(`[Zoho Campaigns] ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Zoho Campaigns] API Error (${response.status}):`, errorText);
      throw new Error(`Zoho Campaigns API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  }

  async getLists(): Promise<CampaignListResponse> {
    return await this.makeRequest("/getmailinglists");
  }

  async getList(listKey: string): Promise<any> {
    return await this.makeRequest(`/getlistdetails?listkey=${listKey}`);
  }

  async createList(listName: string, additionalInfo?: any): Promise<any> {
    return await this.makeRequest("/createmailinglist", {
      method: "POST",
      body: JSON.stringify({
        listname: listName,
        ...additionalInfo
      }),
    });
  }

  async addSubscriber(listKey: string, contactInfo: {
    email: string;
    firstName?: string;
    lastName?: string;
    [key: string]: any;
  }): Promise<SubscriberResponse> {
    const data: any = {
      listkey: listKey,
      contactinfo: {
        "Contact Email": contactInfo.email,
        ...(contactInfo.firstName && { "First Name": contactInfo.firstName }),
        ...(contactInfo.lastName && { "Last Name": contactInfo.lastName }),
      }
    };

    Object.keys(contactInfo).forEach(key => {
      if (!['email', 'firstName', 'lastName'].includes(key)) {
        data.contactinfo[key] = contactInfo[key];
      }
    });

    return await this.makeRequest("/json/listsubscribe", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async addSubscribersBulk(listKey: string, contacts: Array<{
    email: string;
    firstName?: string;
    lastName?: string;
    [key: string]: any;
  }>): Promise<any> {
    const jsondata = contacts.map(contact => ({
      "Contact Email": contact.email,
      ...(contact.firstName && { "First Name": contact.firstName }),
      ...(contact.lastName && { "Last Name": contact.lastName }),
      ...Object.keys(contact).reduce((acc, key) => {
        if (!['email', 'firstName', 'lastName'].includes(key)) {
          acc[key] = contact[key];
        }
        return acc;
      }, {} as Record<string, any>)
    }));

    return await this.makeRequest("/json/listsubscribe", {
      method: "POST",
      body: JSON.stringify({
        listkey: listKey,
        jsondata: JSON.stringify(jsondata)
      }),
    });
  }

  async getCampaigns(): Promise<any> {
    return await this.makeRequest("/campaigns");
  }

  async getCampaign(campaignKey: string): Promise<CampaignResponse> {
    return await this.makeRequest(`/getcampaigndetails?campaignkey=${campaignKey}`);
  }

  async createEmailCampaign(data: {
    campaignName: string;
    subject: string;
    fromEmail: string;
    listKey: string;
    htmlContent?: string;
    [key: string]: any;
  }): Promise<CampaignResponse> {
    return await this.makeRequest("/createcampaign", {
      method: "POST",
      body: JSON.stringify({
        campaign_name: data.campaignName,
        subject: data.subject,
        from_email: data.fromEmail,
        listkey: data.listKey,
        ...(data.htmlContent && { html_content: data.htmlContent }),
        ...data
      }),
    });
  }

  async sendCampaign(campaignKey: string, scheduleTime?: Date): Promise<any> {
    const body: any = { campaignkey: campaignKey };
    
    if (scheduleTime) {
      body.schedule_time = scheduleTime.toISOString();
    }

    return await this.makeRequest("/sendcampaign", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async scheduleCampaign(campaignKey: string, scheduleTime: Date): Promise<any> {
    return await this.makeRequest("/schedulecampaign", {
      method: "POST",
      body: JSON.stringify({
        campaignkey: campaignKey,
        schedule_time: scheduleTime.toISOString()
      }),
    });
  }

  async getCampaignStats(campaignKey: string): Promise<any> {
    return await this.makeRequest(`/getcampaignstats?campaignkey=${campaignKey}`);
  }

  async getSubscribers(listKey: string, page: number = 1, limit: number = 100): Promise<any> {
    return await this.makeRequest(`/listsubscribers?listkey=${listKey}&page=${page}&limit=${limit}`);
  }

  async unsubscribe(listKey: string, email: string): Promise<any> {
    return await this.makeRequest("/json/listunsubscribe", {
      method: "POST",
      body: JSON.stringify({
        listkey: listKey,
        contactinfo: {
          "Contact Email": email
        }
      }),
    });
  }
}

export const zohoCampaignsService = new ZohoCampaignsService();
