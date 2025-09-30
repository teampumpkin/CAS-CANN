/**
 * Centralized Configuration for Production Deployment
 * All domain, URL, and environment settings in ONE place
 */

// Production domain - THE ONLY domain for this deployment
export const PRODUCTION_DOMAIN = 'amyloid.ca';
export const PRODUCTION_BASE_URL = `https://${PRODUCTION_DOMAIN}`;

/**
 * Detect if we're running in production based on domain
 */
export function isProduction(host?: string): boolean {
  if (!host) return false;
  return host === PRODUCTION_DOMAIN || host.includes(PRODUCTION_DOMAIN);
}

/**
 * Get the correct base URL for the current environment
 * ALWAYS returns production URL for deployed app
 */
export function getBaseUrl(host?: string): string {
  // Always use production URL for the live deployment
  return PRODUCTION_BASE_URL;
}

/**
 * Get OAuth redirect URI for Zoho
 */
export function getOAuthRedirectUri(): string {
  return `${PRODUCTION_BASE_URL}/oauth/zoho/callback`;
}

/**
 * Get API base URL
 */
export function getApiBaseUrl(): string {
  return `${PRODUCTION_BASE_URL}/api`;
}

/**
 * Configuration constants
 */
export const CONFIG = {
  // Domain settings
  DOMAIN: PRODUCTION_DOMAIN,
  BASE_URL: PRODUCTION_BASE_URL,
  
  // API endpoints
  API_BASE_URL: getApiBaseUrl(),
  OAUTH_REDIRECT_URI: getOAuthRedirectUri(),
  
  // Zoho CRM settings
  ZOHO_API_BASE_URL: 'https://www.zohoapis.com/crm/v8',
  ZOHO_OAUTH_URL: 'https://accounts.zoho.com/oauth/v2',
  
  // Environment
  IS_PRODUCTION: true,
  NODE_ENV: process.env.NODE_ENV || 'production',
} as const;

console.log('[Config] Initialized with production domain:', PRODUCTION_DOMAIN);
console.log('[Config] Base URL:', PRODUCTION_BASE_URL);
console.log('[Config] OAuth Redirect URI:', getOAuthRedirectUri());
