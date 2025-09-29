/**
 * Zoho Token Manager - Handles access token refresh and caching
 */

interface TokenData {
  accessToken: string;
  tokenExpiry: Date;
}

export class ZohoTokenManager {
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.validateCredentials();
  }

  private validateCredentials(): void {
    const required = ['ZOHO_CLIENT_ID', 'ZOHO_CLIENT_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.warn(`[ZohoTokenManager] Missing credentials: ${missing.join(', ')}`);
    }
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  async getValidAccessToken(): Promise<string> {
    // Check if we have a refresh token
    if (!process.env.ZOHO_REFRESH_TOKEN) {
      throw new Error('No refresh token available. Please complete OAuth authorization first.');
    }

    // Check if current token is valid (with 5-minute buffer)
    const now = new Date();
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    if (this.accessToken && this.tokenExpiry && 
        now < new Date(this.tokenExpiry.getTime() - bufferTime)) {
      console.log('[ZohoTokenManager] Using cached access token');
      return this.accessToken;
    }

    // If a refresh is already in progress, wait for it
    if (this.refreshPromise) {
      console.log('[ZohoTokenManager] Waiting for ongoing token refresh');
      return await this.refreshPromise;
    }

    // Refresh the token
    console.log('[ZohoTokenManager] Refreshing access token');
    this.refreshPromise = this.refreshAccessToken();
    
    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Refresh the access token using the refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
    const clientId = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;

    if (!refreshToken || !clientId || !clientSecret) {
      throw new Error('Missing required credentials for token refresh');
    }

    // Determine the correct auth URL based on region
    const authUrl = process.env.ZOHO_AUTH_URL || 'https://accounts.zoho.com';
    const tokenEndpoint = `${authUrl}/oauth/v2/token`;

    try {
      console.log(`[ZohoTokenManager] Requesting new token from ${tokenEndpoint}`);
      
      const params = new URLSearchParams({
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token'
      });

      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error('[ZohoTokenManager] Token refresh failed:', {
          status: response.status,
          response: responseText
        });
        throw new Error(`Token refresh failed: ${response.status} ${responseText}`);
      }

      const data = JSON.parse(responseText);

      if (!data.access_token) {
        console.error('[ZohoTokenManager] No access token in response:', data);
        throw new Error('No access token received from Zoho');
      }

      // Cache the new token
      this.accessToken = data.access_token;
      this.tokenExpiry = new Date(Date.now() + (data.expires_in || 3600) * 1000);

      console.log('[ZohoTokenManager] Access token refreshed successfully', {
        expiresIn: data.expires_in,
        expiryTime: this.tokenExpiry.toISOString()
      });

      if (!this.accessToken) {
        throw new Error('Failed to cache access token');
      }

      return this.accessToken;
    } catch (error) {
      console.error('[ZohoTokenManager] Error refreshing token:', error);
      
      // Clear cached token on error
      this.accessToken = null;
      this.tokenExpiry = null;
      
      throw error;
    }
  }

  /**
   * Generate the OAuth authorization URL
   */
  static getAuthorizationUrl(customRedirectUri?: string): string {
    const authUrl = process.env.ZOHO_AUTH_URL || 'https://accounts.zoho.com';
    const clientId = process.env.ZOHO_CLIENT_ID;
    
    let redirectUri = customRedirectUri || process.env.ZOHO_REDIRECT_URI;
    if (!redirectUri) {
      redirectUri = process.env.NODE_ENV === 'production' 
        ? 'https://amyloid.ca/api/oauth/zoho/callback'
        : 'http://localhost:5000/api/oauth/zoho/callback';
    }

    if (!clientId) {
      throw new Error('ZOHO_CLIENT_ID is not configured');
    }

    const url = new URL(`${authUrl}/oauth/v2/auth`);
    url.searchParams.append('scope', 'ZohoCRM.modules.leads.ALL,ZohoCRM.settings.fields.ALL');
    url.searchParams.append('client_id', clientId);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('access_type', 'offline');
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('prompt', 'consent');

    return url.toString();
  }

  /**
   * Exchange authorization code for tokens
   */
  static async exchangeCodeForTokens(code: string): Promise<{ 
    accessToken: string; 
    refreshToken: string; 
    expiresIn: number 
  }> {
    const authUrl = process.env.ZOHO_AUTH_URL || 'https://accounts.zoho.com';
    const clientId = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;
    const redirectUri = process.env.ZOHO_REDIRECT_URI || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://amyloid.ca/api/oauth/zoho/callback'
        : 'http://localhost:5000/api/oauth/zoho/callback');

    if (!clientId || !clientSecret) {
      throw new Error('Missing ZOHO_CLIENT_ID or ZOHO_CLIENT_SECRET');
    }

    const tokenEndpoint = `${authUrl}/oauth/v2/token`;

    console.log('[ZohoTokenManager] Exchanging authorization code for tokens');

    const params = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    });

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('[ZohoTokenManager] Code exchange failed:', responseText);
      throw new Error(`Failed to exchange code: ${response.status} ${responseText}`);
    }

    const data = JSON.parse(responseText);

    if (!data.access_token || !data.refresh_token) {
      console.error('[ZohoTokenManager] Missing tokens in response:', data);
      throw new Error('Invalid token response from Zoho');
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in || 3600
    };
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!(
      process.env.ZOHO_CLIENT_ID &&
      process.env.ZOHO_CLIENT_SECRET &&
      process.env.ZOHO_REFRESH_TOKEN
    );
  }
}

// Export singleton instance
export const zohoTokenManager = new ZohoTokenManager();