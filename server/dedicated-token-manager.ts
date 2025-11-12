import { storage } from './storage';
import type { OAuthToken, InsertOAuthToken } from '@shared/schema';

/**
 * Dedicated Token Management System for Zoho CRM
 * Handles token storage, retrieval, validation, refresh, and health monitoring
 */
export class DedicatedTokenManager {
  private static instance: DedicatedTokenManager;
  private tokenCache: Map<string, TokenInfo> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private readonly TOKEN_REFRESH_BUFFER_MS = 300000; // 5 minutes before expiry
  private readonly HEALTH_CHECK_INTERVAL_MS = 60000; // 1 minute health checks
  private lastHealthCheckTime: Date | null = null;
  private healthCheckCount = 0;

  static getInstance(): DedicatedTokenManager {
    if (!DedicatedTokenManager.instance) {
      DedicatedTokenManager.instance = new DedicatedTokenManager();
    }
    return DedicatedTokenManager.instance;
  }

  /**
   * Initialize the token management system
   */
  async initialize(): Promise<void> {
    console.log('[TokenManager] Initializing dedicated token management system...');
    
    // Load existing tokens from database
    await this.loadTokensFromDatabase();
    
    // Start health monitoring
    this.startHealthMonitoring();
    
    // Perform initial health check
    await this.performHealthCheck();
    
    console.log('[TokenManager] Token management system initialized successfully');
  }

  /**
   * Store new OAuth tokens from authorization flow
   */
  async storeToken(provider: string, tokenData: {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
    token_type?: string;
  }): Promise<boolean> {
    try {
      console.log(`[TokenManager] 🔐 Starting token storage for provider: ${provider}`);
      console.log(`[TokenManager] Token data received:`, {
        has_access_token: !!tokenData.access_token,
        has_refresh_token: !!tokenData.refresh_token,
        expires_in: tokenData.expires_in
      });
      
      const expiresAt = tokenData.expires_in 
        ? new Date(Date.now() + (tokenData.expires_in * 1000))
        : new Date(Date.now() + 3600000); // 1 hour default

      console.log(`[TokenManager] 📅 Token will expire at: ${expiresAt.toISOString()}`);

      // Deactivate existing tokens for this provider
      console.log(`[TokenManager] 🔄 Deactivating existing tokens for ${provider}...`);
      await this.deactivateExistingTokens(provider);

      // Create new token record
      const newToken: InsertOAuthToken = {
        provider,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt,
        scope: tokenData.scope || '',
        tokenType: tokenData.token_type || 'Bearer',
        isActive: true
      };

      console.log(`[TokenManager] 💾 Calling storage.createOAuthToken...`);
      const createdToken = await storage.createOAuthToken(newToken);
      console.log(`[TokenManager] ✅ Database insert successful! Token ID: ${createdToken.id}`);
      
      // Verify the token was actually stored
      const verification = await storage.getOAuthToken(createdToken.id);
      if (verification) {
        console.log(`[TokenManager] ✅ Token verified in database with ID: ${verification.id}`);
      } else {
        console.error(`[TokenManager] ❌ WARNING: Token not found after insertion!`);
      }
      
      // Cache the token
      this.cacheToken(provider, {
        accessToken: createdToken.accessToken || '',
        refreshToken: createdToken.refreshToken || undefined,
        expiresAt: createdToken.expiresAt || new Date(Date.now() + 3600000),
        scope: createdToken.scope || '',
        tokenType: createdToken.tokenType || 'Bearer'
      });

      console.log(`[TokenManager] ✅ Token successfully stored and cached for ${provider}`);
      console.log(`[TokenManager] 📊 Expires: ${expiresAt.toISOString()}`);
      return true;

    } catch (error) {
      console.error(`[TokenManager] ❌ FAILED to store token for ${provider}:`, error);
      console.error(`[TokenManager] Error details:`, {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      return false;
    }
  }

  /**
   * Get a valid access token, auto-refreshing if needed
   */
  async getValidAccessToken(provider: string = 'zoho_crm'): Promise<string | null> {
    try {
      // Check cache first
      const cached = this.tokenCache.get(provider);
      if (cached && this.isTokenValid(cached)) {
        return cached.accessToken;
      }

      // Load from database
      const tokenRecord = await this.getActiveTokenRecord(provider);
      if (!tokenRecord || !tokenRecord.accessToken) {
        console.log(`[TokenManager] No active token found for provider: ${provider}`);
        return null;
      }

      // Check if token needs refresh
      if (this.needsRefresh(tokenRecord)) {
        console.log(`[TokenManager] Token for ${provider} needs refresh, attempting refresh...`);
        const refreshed = await this.refreshTokenIfNeeded(provider, tokenRecord);
        if (refreshed) {
          return refreshed.accessToken;
        }
        return null;
      }

      // Token is valid, cache and return
      const tokenInfo: TokenInfo = {
        accessToken: tokenRecord.accessToken,
        refreshToken: tokenRecord.refreshToken || undefined,
        expiresAt: tokenRecord.expiresAt || new Date(Date.now() + 3600000),
        scope: tokenRecord.scope || '',
        tokenType: tokenRecord.tokenType || 'Bearer'
      };

      this.cacheToken(provider, tokenInfo);
      return tokenInfo.accessToken;

    } catch (error) {
      console.error(`[TokenManager] Error getting valid token for ${provider}:`, error);
      return null;
    }
  }

  /**
   * Check token health status
   */
  async checkTokenHealth(provider: string = 'zoho_crm'): Promise<TokenHealthStatus> {
    const tokenRecord = await this.getActiveTokenRecord(provider);
    
    if (!tokenRecord || !tokenRecord.accessToken) {
      return { 
        isValid: false, 
        needsRefresh: true, 
        provider,
        error: 'No active token found' 
      };
    }

    const now = new Date();
    const expiresAt = tokenRecord.expiresAt || new Date(0);
    const timeToExpiry = expiresAt.getTime() - now.getTime();
    const needsRefresh = timeToExpiry < this.TOKEN_REFRESH_BUFFER_MS;

    return {
      isValid: timeToExpiry > 0,
      expiresAt,
      needsRefresh,
      timeToExpiry,
      provider,
      lastRefreshed: tokenRecord.lastRefreshed
    };
  }

  /**
   * Force refresh a token
   */
  async forceRefreshToken(provider: string = 'zoho_crm'): Promise<TokenInfo | null> {
    const tokenRecord = await this.getActiveTokenRecord(provider);
    if (!tokenRecord) {
      return null;
    }

    return await this.refreshTokenIfNeeded(provider, tokenRecord);
  }

  /**
   * Get all stored tokens (for admin/debug)
   */
  async getAllTokens(): Promise<OAuthToken[]> {
    return await storage.getOAuthTokens();
  }

  /**
   * Clear all tokens for a provider
   */
  async clearTokens(provider: string): Promise<void> {
    await this.deactivateExistingTokens(provider);
    this.tokenCache.delete(provider);
    console.log(`[TokenManager] Cleared all tokens for provider: ${provider}`);
  }

  // Private helper methods
  private async loadTokensFromDatabase(): Promise<void> {
    try {
      const tokens = await storage.getOAuthTokens({ isActive: true });
      console.log(`[TokenManager] Loaded ${tokens.length} active tokens from database`);
      
      for (const token of tokens) {
        if (token.accessToken) {
          this.cacheToken(token.provider, {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken || undefined,
            expiresAt: token.expiresAt || new Date(Date.now() + 3600000),
            scope: token.scope || '',
            tokenType: token.tokenType || 'Bearer'
          });
        }
      }
    } catch (error) {
      console.error('[TokenManager] Error loading tokens from database:', error);
    }
  }

  private cacheToken(provider: string, tokenInfo: TokenInfo): void {
    this.tokenCache.set(provider, tokenInfo);
  }

  private isTokenValid(tokenInfo: TokenInfo): boolean {
    return tokenInfo.expiresAt.getTime() > Date.now() + 60000; // Valid if expires in > 1 minute
  }

  private needsRefresh(tokenRecord: OAuthToken): boolean {
    if (!tokenRecord.expiresAt) return true;
    const timeToExpiry = tokenRecord.expiresAt.getTime() - Date.now();
    return timeToExpiry < this.TOKEN_REFRESH_BUFFER_MS;
  }

  private async getActiveTokenRecord(provider: string): Promise<OAuthToken | null> {
    const tokens = await storage.getOAuthTokens({ provider, isActive: true });
    return tokens.length > 0 ? tokens[0] : null;
  }

  private async deactivateExistingTokens(provider: string): Promise<void> {
    const existingTokens = await storage.getOAuthTokens({ provider, isActive: true });
    for (const token of existingTokens) {
      await storage.updateOAuthToken(token.id, { isActive: false });
    }
  }

  private async refreshTokenIfNeeded(provider: string, tokenRecord: OAuthToken): Promise<TokenInfo | null> {
    if (!tokenRecord.refreshToken) {
      console.error(`[TokenManager] No refresh token available for ${provider}`);
      return null;
    }

    try {
      console.log(`[TokenManager] Starting token refresh for ${provider}...`);

      if (provider === 'zoho_crm') {
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
          console.error(`[TokenManager] Zoho token refresh failed: ${response.status} ${errorText}`);
          throw new Error(`Zoho token refresh failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();

        if (data.error) {
          console.error(`[TokenManager] Zoho token refresh error: ${data.error}`);
          throw new Error(`Zoho token refresh error: ${data.error}`);
        }

        // Update token in database
        const expiresAt = new Date(Date.now() + (data.expires_in * 1000));
        
        await storage.updateOAuthToken(tokenRecord.id, {
          accessToken: data.access_token,
          expiresAt,
          lastRefreshed: new Date(),
        });

        const tokenInfo: TokenInfo = {
          accessToken: data.access_token,
          refreshToken: tokenRecord.refreshToken,
          expiresAt,
          scope: tokenRecord.scope || '',
          tokenType: data.token_type || 'Bearer'
        };

        // Update cache
        this.cacheToken(provider, tokenInfo);

        console.log(`[TokenManager] ✅ Successfully refreshed ${provider} token, expires at: ${expiresAt.toISOString()}`);
        return tokenInfo;
      }

      console.error(`[TokenManager] Unknown provider for refresh: ${provider}`);
      return null;

    } catch (error) {
      console.error(`[TokenManager] Failed to refresh token for ${provider}:`, error);
      // Mark token as inactive if refresh fails
      await storage.updateOAuthToken(tokenRecord.id, { isActive: false });
      this.tokenCache.delete(provider);
      return null;
    }
  }

  private startHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, this.HEALTH_CHECK_INTERVAL_MS);

    console.log('[TokenManager] Health monitoring started');
  }

  private async performHealthCheck(): Promise<void> {
    try {
      this.lastHealthCheckTime = new Date();
      this.healthCheckCount++;
      
      const providers = Array.from(this.tokenCache.keys());
      
      for (const provider of providers) {
        const health = await this.checkTokenHealth(provider);
        
        if (!health.isValid || health.needsRefresh) {
          if (!health.isValid) {
            console.log(`[TokenManager] Health check #${this.healthCheckCount} failed for ${provider}: ${health.error || 'Token expired'}`);
          } else {
            console.log(`[TokenManager] Health check #${this.healthCheckCount}: ${provider} needs refresh soon (${Math.round((health.timeToExpiry || 0) / 1000)}s remaining)`);
          }
          
          const tokenRecord = await this.getActiveTokenRecord(provider);
          if (tokenRecord && tokenRecord.refreshToken) {
            console.log(`[TokenManager] 🔄 Auto-refreshing token for ${provider}...`);
            const refreshed = await this.refreshTokenIfNeeded(provider, tokenRecord);
            if (refreshed) {
              console.log(`[TokenManager] ✅ Auto-refresh successful for ${provider}`);
            } else {
              console.error(`[TokenManager] ❌ Auto-refresh failed for ${provider} - Manual re-authentication required`);
              console.error(`[TokenManager] Please visit: /oauth/zoho/connect to re-authenticate`);
            }
          } else {
            console.error(`[TokenManager] ❌ No refresh token available for ${provider} - Manual re-authentication required`);
            console.error(`[TokenManager] Please visit: /oauth/zoho/connect to authenticate`);
          }
        }
      }
    } catch (error) {
      console.error('[TokenManager] Error during health check:', error);
    }
  }

  /**
   * Get health monitoring status
   */
  getMonitoringStatus() {
    return {
      isRunning: this.healthCheckInterval !== null,
      lastCheckTime: this.lastHealthCheckTime,
      totalChecks: this.healthCheckCount,
      checkIntervalMs: this.HEALTH_CHECK_INTERVAL_MS,
      activeProviders: Array.from(this.tokenCache.keys()),
    };
  }

  /**
   * Shutdown the token manager
   */
  shutdown(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    this.tokenCache.clear();
    console.log('[TokenManager] Token management system shutdown');
  }
}

// Types
export interface TokenInfo {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  scope: string;
  tokenType: string;
}

export interface TokenHealthStatus {
  isValid: boolean;
  expiresAt?: Date;
  needsRefresh: boolean;
  timeToExpiry?: number;
  provider: string;
  lastRefreshed?: Date | null;
  error?: string;
}

// Singleton instance
export const dedicatedTokenManager = DedicatedTokenManager.getInstance();