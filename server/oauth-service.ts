import { storage } from './storage';
import type { OAuthToken, InsertOAuthToken } from '@shared/schema';

export interface TokenInfo {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  scope: string;
  tokenType: string;
}

export class OAuthService {
  private static instance: OAuthService;
  private tokenCache: Map<string, TokenInfo> = new Map();
  private refreshPromises: Map<string, Promise<TokenInfo | null>> = new Map();
  private backgroundRefreshTimer: NodeJS.Timeout | null = null;

  static getInstance(): OAuthService {
    if (!OAuthService.instance) {
      OAuthService.instance = new OAuthService();
    }
    return OAuthService.instance;
  }

  /**
   * Get a valid access token, automatically refreshing if needed
   */
  async getValidToken(provider: string = 'zoho_crm'): Promise<string | null> {
    try {
      // Check cache first
      const cached = this.tokenCache.get(provider);
      if (cached && this.isTokenValid(cached)) {
        return cached.accessToken;
      }

      // Get from database
      const tokenRecord = await this.getActiveToken(provider);
      if (!tokenRecord) {
        console.log(`[OAuth] No active token found for provider: ${provider}`);
        return null;
      }

      // Check if token needs refresh
      if (this.needsRefresh(tokenRecord)) {
        console.log(`[OAuth] Token for ${provider} needs refresh`);
        const refreshed = await this.refreshToken(provider, tokenRecord);
        if (refreshed) {
          this.cacheToken(provider, refreshed);
          return refreshed.accessToken;
        }
        return null;
      }

      // Token is still valid
      const tokenInfo: TokenInfo = {
        accessToken: tokenRecord.accessToken || '',
        refreshToken: tokenRecord.refreshToken ?? undefined,
        expiresAt: tokenRecord.expiresAt || new Date(Date.now() + 3600000), // 1 hour default
        scope: tokenRecord.scope || '',
        tokenType: tokenRecord.tokenType || 'Bearer'
      };

      this.cacheToken(provider, tokenInfo);
      return tokenInfo.accessToken;

    } catch (error) {
      console.error(`[OAuth] Error getting valid token for ${provider}:`, error);
      return null;
    }
  }

  /**
   * Store new OAuth tokens from authorization flow
   */
  async storeTokens(provider: string, tokenData: {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
    token_type?: string;
  }): Promise<boolean> {
    try {
      const expiresAt = tokenData.expires_in 
        ? new Date(Date.now() + (tokenData.expires_in * 1000))
        : new Date(Date.now() + 3600000); // 1 hour default

      // Deactivate existing tokens
      await this.deactivateExistingTokens(provider);

      // Store new token
      const newToken: InsertOAuthToken = {
        provider,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt,
        scope: tokenData.scope || '',
        tokenType: tokenData.token_type || 'Bearer',
        isActive: true
      };

      const stored = await storage.createOAuthToken(newToken);
      
      // Cache the new token
      const tokenInfo: TokenInfo = {
        accessToken: stored.accessToken || '',
        refreshToken: stored.refreshToken ?? undefined,
        expiresAt: stored.expiresAt || expiresAt,
        scope: stored.scope || '',
        tokenType: stored.tokenType || 'Bearer'
      };

      this.cacheToken(provider, tokenInfo);

      console.log(`[OAuth] Successfully stored tokens for ${provider}`);
      console.log(`[OAuth] Token expires at: ${expiresAt.toISOString()}`);
      
      // Start background refresh timer when we have valid tokens
      this.startBackgroundTokenRefresh();
      
      return true;

    } catch (error) {
      console.error(`[OAuth] Error storing tokens for ${provider}:`, error);
      return false;
    }
  }

  /**
   * Refresh an expired token
   */
  private async refreshToken(provider: string, tokenRecord: OAuthToken): Promise<TokenInfo | null> {
    // Prevent multiple simultaneous refresh attempts
    const existingPromise = this.refreshPromises.get(provider);
    if (existingPromise) {
      return existingPromise;
    }

    const refreshPromise = this.performTokenRefresh(provider, tokenRecord);
    this.refreshPromises.set(provider, refreshPromise);

    try {
      const result = await refreshPromise;
      this.refreshPromises.delete(provider);
      return result;
    } catch (error) {
      this.refreshPromises.delete(provider);
      throw error;
    }
  }

  private async performTokenRefresh(provider: string, tokenRecord: OAuthToken): Promise<TokenInfo | null> {
    if (!tokenRecord.refreshToken) {
      console.error(`[OAuth] No refresh token available for ${provider}`);
      return null;
    }

    try {
      console.log(`[OAuth] Refreshing token for ${provider}`);

      if (provider === 'zoho_crm') {
        return await this.refreshZohoToken(tokenRecord);
      }

      console.error(`[OAuth] Unknown provider for refresh: ${provider}`);
      return null;

    } catch (error) {
      console.error(`[OAuth] Failed to refresh token for ${provider}:`, error);
      // Mark token as inactive if refresh fails
      await storage.updateOAuthToken(tokenRecord.id, { isActive: false });
      this.tokenCache.delete(provider);
      return null;
    }
  }

  private async refreshZohoToken(tokenRecord: OAuthToken): Promise<TokenInfo | null> {
    const refreshUrl = "https://accounts.zoho.com/oauth/v2/token";
    
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      refresh_token: tokenRecord.refreshToken!,
    });

    const response = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zoho token refresh failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Zoho token refresh error: ${data.error}`);
    }

    // Store refreshed token
    const expiresAt = new Date(Date.now() + (data.expires_in * 1000));
    
    await storage.updateOAuthToken(tokenRecord.id, {
      accessToken: data.access_token,
      expiresAt,
      lastRefreshed: new Date(),
    });

    const tokenInfo: TokenInfo = {
      accessToken: data.access_token,
      refreshToken: tokenRecord.refreshToken ?? undefined,
      expiresAt,
      scope: tokenRecord.scope || '',
      tokenType: data.token_type || 'Bearer'
    };

    console.log(`[OAuth] Successfully refreshed Zoho token, expires at: ${expiresAt.toISOString()}`);
    return tokenInfo;
  }

  /**
   * Check token health and validity
   */
  async checkTokenHealth(provider: string = 'zoho_crm'): Promise<{
    isValid: boolean;
    expiresAt?: Date;
    needsRefresh: boolean;
    timeToExpiry?: number;
  }> {
    const tokenRecord = await this.getActiveToken(provider);
    
    if (!tokenRecord || !tokenRecord.accessToken) {
      return { isValid: false, needsRefresh: true };
    }

    const now = new Date();
    const expiresAt = tokenRecord.expiresAt || new Date(0);
    const timeToExpiry = expiresAt.getTime() - now.getTime();
    const needsRefresh = timeToExpiry < 300000; // Refresh if expires in < 5 minutes

    return {
      isValid: timeToExpiry > 0,
      expiresAt,
      needsRefresh,
      timeToExpiry
    };
  }

  /**
   * Initialize OAuth service - check and refresh tokens on startup
   */
  async initialize(): Promise<void> {
    console.log('[OAuth] Initializing OAuth service...');
    
    try {
      const health = await this.checkTokenHealth('zoho_crm');
      console.log('[OAuth] Token health check:', health);

      if (health.needsRefresh && health.isValid) {
        console.log('[OAuth] Proactively refreshing token on startup');
        await this.getValidToken('zoho_crm');
      }

      if (!health.isValid) {
        console.log('[OAuth] No valid token found - manual authentication required');
        console.log('[OAuth] Visit: http://localhost:5000/oauth/zoho/connect to authenticate');
      } else {
        // Start background token refresh if we have valid tokens
        this.startBackgroundTokenRefresh();
      }

    } catch (error) {
      console.error('[OAuth] Error during initialization:', error);
    }
  }

  /**
   * Start background token refresh timer
   */
  private startBackgroundTokenRefresh(): void {
    // Clear existing timer if any
    if (this.backgroundRefreshTimer) {
      clearInterval(this.backgroundRefreshTimer);
    }

    // Check and refresh tokens every 15 minutes
    this.backgroundRefreshTimer = setInterval(async () => {
      try {
        console.log('[OAuth] Background token health check...');
        const health = await this.checkTokenHealth('zoho_crm');
        
        if (health.needsRefresh && health.isValid) {
          console.log('[OAuth] Background token refresh triggered');
          await this.getValidToken('zoho_crm');
        } else if (!health.isValid) {
          console.log('[OAuth] Background check: Token invalid, manual authentication required');
        }
      } catch (error) {
        console.error('[OAuth] Background token refresh error:', error);
      }
    }, 15 * 60 * 1000); // 15 minutes

    console.log('[OAuth] Background token refresh timer started (15min interval)');
  }

  /**
   * Stop background token refresh timer
   */
  private stopBackgroundTokenRefresh(): void {
    if (this.backgroundRefreshTimer) {
      clearInterval(this.backgroundRefreshTimer);
      this.backgroundRefreshTimer = null;
      console.log('[OAuth] Background token refresh timer stopped');
    }
  }

  // Helper methods
  private async getActiveToken(provider: string): Promise<OAuthToken | null> {
    const tokens = await storage.getOAuthTokens({ provider, isActive: true });
    return tokens.length > 0 ? tokens[0] : null;
  }

  private async deactivateExistingTokens(provider: string): Promise<void> {
    const existingTokens = await storage.getOAuthTokens({ provider, isActive: true });
    for (const token of existingTokens) {
      await storage.updateOAuthToken(token.id, { isActive: false });
    }
  }

  private isTokenValid(tokenInfo: TokenInfo): boolean {
    return tokenInfo.expiresAt.getTime() > Date.now() + 60000; // Valid if expires in > 1 minute
  }

  private needsRefresh(tokenRecord: OAuthToken): boolean {
    if (!tokenRecord.expiresAt) return true;
    return tokenRecord.expiresAt.getTime() < Date.now() + 300000; // Refresh if expires in < 5 minutes
  }

  private cacheToken(provider: string, tokenInfo: TokenInfo): void {
    this.tokenCache.set(provider, tokenInfo);
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(provider: string, redirectUri: string): string {
    if (provider === 'zoho_crm') {
      // Build URL manually to ensure proper encoding
      const baseUrl = 'https://accounts.zoho.com/oauth/v2/auth';
      const params = [
        `scope=${encodeURIComponent('ZohoCRM.modules.leads.ALL,ZohoCRM.modules.contacts.ALL,ZohoCRM.settings.fields.ALL')}`,
        `client_id=${encodeURIComponent(process.env.ZOHO_CLIENT_ID!)}`,
        `response_type=code`,
        `access_type=offline`,
        `redirect_uri=${encodeURIComponent(redirectUri)}`
      ];
      
      const fullUrl = `${baseUrl}?${params.join('&')}`;
      console.log(`[OAuth Service] Generated authorization URL: ${fullUrl}`);
      
      return fullUrl;
    }
    
    throw new Error(`Unknown provider: ${provider}`);
  }
}

export const oauthService = OAuthService.getInstance();