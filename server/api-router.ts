import { Router } from "express";
import { storage } from "./storage";
import { oauthService } from "./oauth-service";
import { retryService } from "./retry-service";

export async function createAPIRouter() {
  const router = Router();

  // OAuth endpoints
  router.get("/oauth/zoho/auth", (req, res) => {
    console.log("[OAuth Auth] Endpoint hit, redirecting to connect");
    res.redirect("/oauth/zoho/connect");
  });

  router.get("/oauth/test", (req, res) => {
    console.log("[OAuth Test] Test endpoint hit");
    res.json({
      message: "OAuth backend is working!",
      timestamp: new Date().toISOString(),
      host: req.get('host'),
      forwardedHost: req.get('x-forwarded-host')
    });
  });

  router.get('/health-check', async (_req, res) => {
    try {
      const healthCheck = await oauthService.checkTokenHealth();
      const tokenCount = await storage.getOAuthTokens({ provider: 'zoho_crm', isActive: true });
      
      res.status(200).json({
        status: 'healthy',
        oauth: {
          isValid: healthCheck.isValid,
          needsRefresh: healthCheck.needsRefresh,
          activeTokens: tokenCount.length
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).json({
        status: 'oauth_error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  router.post("/retry-failed-submissions", async (req, res) => {
    try {
      if (retryService.isRetryProcessing()) {
        return res.status(409).json({
          success: false,
          message: "Retry operation already in progress"
        });
      }

      const result = await retryService.retryAllFailedSubmissions();
      res.json({
        success: true,
        message: "Retry operation completed",
        stats: result
      });
    } catch (error) {
      console.error("Retry all failed submissions error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retry submissions",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // OAuth connect endpoint - starts the authorization flow
  router.get("/zoho/connect", (req, res) => {
    try {
      // Use ZOHO_REDIRECT_URI if available, otherwise detect production environment
      let redirectUri: string;
      
      if (process.env.ZOHO_REDIRECT_URI) {
        redirectUri = process.env.ZOHO_REDIRECT_URI;
        console.log(`[OAuth Connect] Using environment ZOHO_REDIRECT_URI: ${redirectUri}`);
      } else {
        // Auto-detect based on host
        const forwardedHost = req.get('x-forwarded-host') || req.get('host');
        const isProduction = forwardedHost === 'amyloid.ca' || process.env.NODE_ENV === 'production';
        
        let baseUrl: string;
        if (isProduction) {
          baseUrl = 'https://amyloid.ca';
        } else if (forwardedHost === 'cas-website-prod-connect11.replit.app') {
          baseUrl = 'https://cas-website-prod-connect11.replit.app';
        } else {
          baseUrl = `${req.protocol}://${req.get('host')}`;
        }
        redirectUri = `${baseUrl}/oauth/zoho/callback`;
        
        console.log(`[OAuth Connect] Host: ${req.get('host')}, X-Forwarded-Host: ${req.get('x-forwarded-host')}, NODE_ENV: ${process.env.NODE_ENV}`);
        console.log(`[OAuth Connect] Detected production: ${isProduction}, Using base URL: ${baseUrl}`);
      }
      
      console.log(`[OAuth Connect] Final redirect URI: ${redirectUri}`);
      
      const authUrl = oauthService.getAuthorizationUrl('zoho_crm', redirectUri);
      console.log(`[OAuth Connect] Full authorization URL: ${authUrl}`);
      
      res.redirect(authUrl);
    } catch (error) {
      console.error("OAuth connect error:", error);
      res.status(500).send("OAuth initialization failed");
    }
  });

  // OAuth callback endpoint for Zoho authorization
  router.get("/zoho/callback", async (req, res) => {
    try {
      const { code, error, error_description } = req.query;
      
      // Handle OAuth errors first
      if (error) {
        console.error("OAuth Error:", { error, error_description });
        return res.status(400).send(`
          <html>
            <head><title>OAuth Error</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>❌ OAuth Authorization Failed</h2>
              <p><strong>Error:</strong> ${error}</p>
              <p><strong>Description:</strong> ${error_description || 'No description provided'}</p>
              <p><a href="/oauth/zoho/connect">← Try Again</a></p>
            </body>
          </html>
        `);
      }
      
      if (!code) {
        console.error("No authorization code received. Query params:", req.query);
        return res.status(400).send(`
          <html>
            <head><title>OAuth Error</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>❌ Authorization code not provided</h2>
              <p>Zoho did not provide an authorization code. Please check your OAuth configuration.</p>
              <p><strong>Query parameters received:</strong> ${JSON.stringify(req.query)}</p>
              <p><a href="/oauth/zoho/connect">← Try Again</a></p>
            </body>
          </html>
        `);
      }
      
      console.log("Received Zoho authorization code:", code);
      
      // Exchange code for access token
      const tokenResponse = await fetch("https://accounts.zoho.com/oauth/v2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.ZOHO_CLIENT_ID!,
          client_secret: process.env.ZOHO_CLIENT_SECRET!,
          redirect_uri: (() => {
            const forwardedHost = req.get('x-forwarded-host') || req.get('host');
            if (forwardedHost === 'amyloid.ca' || process.env.NODE_ENV === 'production') {
              return 'https://amyloid.ca/oauth/zoho/callback';
            } else if (forwardedHost === 'cas-website-prod-connect11.replit.app') {
              return 'https://cas-website-prod-connect11.replit.app/oauth/zoho/callback';
            } else {
              return `${req.protocol}://${req.get('host')}/oauth/zoho/callback`;
            }
          })(),
          code: code as string,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Token exchange failed:", errorText);
        throw new Error(`Token exchange failed: ${errorText}`);
      }

      const tokenData = await tokenResponse.json();
      console.log("Successfully obtained access token!");
      
      // Store tokens automatically using the OAuth service
      const stored = await oauthService.storeTokens('zoho_crm', tokenData);
      
      if (stored) {
        console.log("✅ Tokens stored automatically in database");
        
        // Success page with instructions
        res.send(`
          <html>
            <head>
              <title>OAuth Success</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; }
                .success { color: #059669; }
                .next-steps { background: #f0f9ff; padding: 15px; border-radius: 8px; margin-top: 20px; }
                .button { display: inline-block; background: #0079f2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
              </style>
            </head>
            <body>
              <h2 class="success">✅ OAuth Connection Successful!</h2>
              <p>Your Zoho CRM integration is now active. Form submissions will automatically sync to your CRM.</p>
              
              <div class="next-steps">
                <h3>Next Steps:</h3>
                <ol>
                  <li>Process pending form submissions</li>
                  <li>Test new form submissions</li>
                  <li>Monitor the integration health</li>
                </ol>
              </div>
              
              <div>
                <a href="/oauth-test" class="button">View Integration Status</a>
                <a href="/" class="button">Return to Website</a>
              </div>
            </body>
          </html>
        `);
      } else {
        console.error("❌ Failed to store tokens in database");
        res.status(500).send(`
          <html>
            <head><title>Storage Error</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>❌ Error Storing Tokens</h2>
              <p>Authentication succeeded but token storage failed. Please try again.</p>
              <p><a href="/oauth/zoho/connect">← Retry Authentication</a></p>
            </body>
          </html>
        `);
      }
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.status(500).send(`
        <html>
          <head><title>OAuth Error</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>❌ OAuth Authentication Failed</h2>
            <p>There was an error processing your authentication. Please try again.</p>
            <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
            <p><a href="/oauth/zoho/connect">← Try Again</a></p>
          </body>
        </html>
      `);
    }
  });

  return router;
}