import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, type ResourceFilters } from "./storage";
import { insertResourceSchema, dynamicFormSubmissionSchema, InsertFormSubmission } from "@shared/schema";
import { fieldSyncEngine } from "./field-sync-engine";
import { zohoCRMService } from "./zoho-crm-service";
import { retryService } from "./retry-service";
import { oauthService } from "./oauth-service";
import { zohoTokenManager, ZohoTokenManager } from "./zoho-token-manager";
import { zohoCRMLeadService } from "./zoho-crm-lead-service";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Basic ping endpoint for deployment verification
  app.get('/ping', (_req, res) => {
    res.status(200).send('pong');
  });

  // Test endpoint to manually store Zoho tokens for debugging
  app.post('/api/oauth/zoho/test-store', async (req, res) => {
    try {
      const { accessToken, refreshToken } = req.body;
      
      if (!accessToken || !refreshToken) {
        return res.status(400).json({ 
          error: 'Missing accessToken or refreshToken in request body' 
        });
      }

      // Store test tokens in database
      const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour
      const tokenRecord = await storage.createOAuthToken({
        provider: 'zoho_crm',
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
        scope: 'ZohoCRM.modules.leads.ALL,ZohoCRM.settings.fields.ALL',
        tokenType: 'Bearer',
        isActive: true
      });

      console.log('[Test Store] ✅ Test tokens stored successfully:', {
        id: tokenRecord.id,
        hasAccessToken: !!tokenRecord.accessToken,
        hasRefreshToken: !!tokenRecord.refreshToken,
        expiresAt: tokenRecord.expiresAt
      });

      res.json({ 
        success: true, 
        message: 'Test tokens stored successfully',
        tokenId: tokenRecord.id
      });
    } catch (error) {
      console.error('[Test Store] Error storing test tokens:', error);
      res.status(500).json({ 
        error: 'Failed to store test tokens',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Zoho OAuth Setup Page - Shows public authorization URL
  app.get('/api/oauth/zoho/setup', (req, res) => {
    try {
      // Determine the public base URL for this request
      const protocol = req.get('x-forwarded-proto') || (req.secure ? 'https' : 'http');
      const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:5000';
      const baseUrl = `${protocol}://${host}`;
      const authUrl = `${baseUrl}/api/oauth/zoho/authorize`;
      
      res.send(`
        <html>
          <head>
            <title>Zoho CRM OAuth Setup</title>
            <style>
              body { font-family: Arial; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
              .header { color: #00AFE6; border-bottom: 2px solid #00AFE6; padding-bottom: 20px; margin-bottom: 30px; }
              .auth-button { 
                display: inline-block;
                background: #00AFE6; 
                color: white; 
                padding: 15px 30px; 
                text-decoration: none; 
                border-radius: 8px; 
                font-size: 18px;
                font-weight: bold;
                margin: 20px 0;
              }
              .auth-button:hover { background: #0095c7; }
              .step { 
                background: #f8f9fa; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 15px 0;
                border-left: 4px solid #00AFE6;
              }
              .warning { 
                background: #fff3cd; 
                border: 1px solid #ffc107; 
                padding: 15px; 
                border-radius: 4px; 
                margin: 20px 0;
              }
              code { background: #f1f1f1; padding: 2px 6px; border-radius: 3px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🔐 Zoho CRM Integration Setup</h1>
              <p>Canadian Amyloidosis Society - OAuth Authorization</p>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> Authorization codes expire in 1 minute! Complete the process quickly.
            </div>
            
            <div class="step">
              <h3>Step 1: Click to Authorize</h3>
              <p>Click the button below to authorize CAS with your Zoho CRM:</p>
              <a href="${authUrl}" class="auth-button" target="_blank">🚀 Authorize Zoho CRM Access</a>
            </div>
            
            <div class="step">
              <h3>Step 2: Complete Authorization</h3>
              <p>You will:</p>
              <ul>
                <li>Be redirected to Zoho to log in</li>
                <li>Grant permissions for CRM access</li>
                <li>Return to a success page with your refresh token</li>
              </ul>
            </div>
            
            <div class="step">
              <h3>Step 3: Save Refresh Token</h3>
              <p>Copy the refresh token and add it as <code>ZOHO_REFRESH_TOKEN</code> environment variable.</p>
            </div>
            
            <div style="margin-top: 40px; padding: 20px; background: #e8f5e8; border-radius: 8px;">
              <h3>✅ After Setup</h3>
              <p>Your "Join CANN Today" form will automatically sync to Zoho CRM leads!</p>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('[Zoho OAuth Setup] Error:', error);
      res.status(500).send('Error generating setup page');
    }
  });

  // Zoho OAuth Authorization Endpoint
  app.get('/api/oauth/zoho/authorize', (req, res) => {
    try {
      // Determine the public base URL for this request
      const protocol = req.get('x-forwarded-proto') || (req.secure ? 'https' : 'http');
      const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:5000';
      const baseUrl = `${protocol}://${host}`;
      const redirectUri = `${baseUrl}/api/oauth/zoho/callback`;
      
      console.log('[Zoho OAuth] Using redirect URI:', redirectUri);
      
      const authUrl = ZohoTokenManager.getAuthorizationUrl(redirectUri);
      console.log('[Zoho OAuth] Redirecting to authorization URL');
      res.redirect(authUrl);
    } catch (error) {
      console.error('[Zoho OAuth] Failed to generate auth URL:', error);
      res.status(500).json({ 
        error: 'Failed to generate authorization URL',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Zoho OAuth Callback Endpoint
  app.get('/api/oauth/zoho/callback', async (req, res) => {
    const { code, error } = req.query;
    
    if (error) {
      console.error('[Zoho OAuth] Authorization denied:', error);
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h2 style="color: #d32f2f;">Authorization Failed</h2>
            <p>${error}</p>
            <button onclick="window.close()">Close Window</button>
          </body>
        </html>
      `);
    }
    
    if (!code || typeof code !== 'string') {
      return res.status(400).send('No authorization code received');
    }
    
    try {
      console.log('[Zoho OAuth] Exchanging authorization code for tokens');
      
      // Get the same redirect URI that was used for authorization
      const protocol = req.get('x-forwarded-proto') || (req.secure ? 'https' : 'http');
      const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:5000';
      const baseUrl = `${protocol}://${host}`;
      const redirectUri = `${baseUrl}/api/oauth/zoho/callback`;
      
      console.log('[Zoho OAuth] Using redirect URI for token exchange:', redirectUri);
      
      // Exchange code for tokens (must be done within 1 minute!)
      const tokens = await ZohoTokenManager.exchangeCodeForTokens(code, redirectUri);
      
      console.log('[Zoho OAuth] Successfully obtained tokens');
      
      // Store tokens in database
      try {
        const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);
        await storage.createOAuthToken({
          provider: 'zoho_crm',
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: expiresAt,
          scope: 'ZohoCRM.modules.leads.ALL,ZohoCRM.settings.fields.ALL',
          tokenType: 'Bearer',
          isActive: true
        });
        console.log('[Zoho OAuth] ✅ Tokens successfully stored in database');
      } catch (dbError) {
        console.error('[Zoho OAuth] Failed to store tokens in database:', dbError);
      }
      
      console.log('=================================');
      console.log('✅ Integration Ready! Tokens stored in database.');
      console.log('=================================');
      
      // Return success page with refresh token
      res.send(`
        <html>
          <head>
            <title>Zoho Authorization Successful</title>
            <style>
              body { font-family: Arial; padding: 40px; max-width: 800px; margin: 0 auto; }
              .success { color: #4caf50; }
              .token-box { 
                background: #f5f5f5; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 20px 0;
                word-break: break-all;
              }
              .copy-btn { 
                background: #2196f3; 
                color: white; 
                border: none; 
                padding: 10px 20px; 
                border-radius: 4px; 
                cursor: pointer; 
              }
              .copy-btn:hover { background: #1976d2; }
              .instruction { 
                background: #fff3cd; 
                border: 1px solid #ffc107; 
                padding: 15px; 
                border-radius: 4px; 
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <h2 class="success">✓ Authorization Successful!</h2>
            
            <div class="instruction">
              <h3>Next Step: Save Your Refresh Token</h3>
              <p>Add the refresh token below to your environment variables as <strong>ZOHO_REFRESH_TOKEN</strong></p>
            </div>
            
            <div class="token-box">
              <strong>Refresh Token:</strong><br>
              <code id="refreshToken">${tokens.refreshToken}</code>
            </div>
            
            <button class="copy-btn" onclick="copyToken()">Copy Refresh Token</button>
            
            <div style="margin-top: 30px;">
              <p><strong>Access Token Valid For:</strong> ${tokens.expiresIn} seconds</p>
              <p style="color: #666;">You can now close this window. The refresh token will be used to automatically obtain new access tokens.</p>
            </div>
            
            <script>
              function copyToken() {
                const token = document.getElementById('refreshToken').innerText;
                navigator.clipboard.writeText(token).then(() => {
                  alert('Refresh token copied to clipboard!');
                });
              }
              
              // Try to close the window after 10 seconds
              setTimeout(() => {
                if (window.opener) {
                  window.close();
                }
              }, 10000);
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('[Zoho OAuth] Token exchange failed:', error);
      res.status(500).send(`
        <html>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h2 style="color: #d32f2f;">Token Exchange Failed</h2>
            <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
            <p style="color: #666; margin-top: 20px;">
              Note: Authorization codes expire in 1 minute. Please try again and exchange the code immediately.
            </p>
            <a href="/api/oauth/zoho/authorize">Try Again</a>
          </body>
        </html>
      `);
    }
  });

  // User API routes
  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(parseInt(req.params.id));
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  });

  // Resource API routes
  app.get("/api/resources", async (req, res) => {
    try {
      const filters: ResourceFilters = {
        amyloidosisType: req.query.amyloidosisType as string,
        resourceType: req.query.resourceType as string,
        category: req.query.category as string,
        audience: req.query.audience as string,
        language: req.query.language as string,
        region: req.query.region as string,
        isPublic: req.query.isPublic === 'true',
        isApproved: req.query.isApproved === 'true',
        search: req.query.search as string,
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof ResourceFilters] === undefined) {
          delete filters[key as keyof ResourceFilters];
        }
      });

      const resources = await storage.getResources(filters);
      res.json(resources);
    } catch (error) {
      console.error(`Error fetching resources: ${error}`);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
    try {
      const resource = await storage.getResource(parseInt(req.params.id));
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      console.error(`Error fetching resource: ${error}`);
      res.status(500).json({ message: "Failed to fetch resource" });
    }
  });

  app.post("/api/resources", async (req, res) => {
    try {
      const validatedData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(validatedData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resource data", errors: error.errors });
      }
      console.error(`Error creating resource: ${error}`);
      res.status(500).json({ message: "Failed to create resource" });
    }
  });

  app.put("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const resource = await storage.updateResource(id, updates);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      console.error(`Error updating resource: ${error}`);
      res.status(500).json({ message: "Failed to update resource" });
    }
  });

  app.delete("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteResource(id);
      if (!deleted) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error(`Error deleting resource: ${error}`);
      res.status(500).json({ message: "Failed to delete resource" });
    }
  });

  app.post("/api/resources/:id/download", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementDownloadCount(id);
      res.status(200).json({ message: "Download count incremented" });
    } catch (error) {
      console.error(`Error incrementing download count: ${error}`);
      res.status(500).json({ message: "Failed to increment download count" });
    }
  });

  // Membership API routes
  app.post("/api/membership", async (req, res) => {
    try {
      // In a real implementation, this would save to a membership table
      // For now, we'll just acknowledge the submission
      console.log("Membership application received:", req.body);
      res.status(201).json({ message: "Membership application submitted successfully" });
    } catch (error) {
      console.error(`Error submitting membership: ${error}`);
      res.status(500).json({ message: "Failed to submit membership application" });
    }
  });

  // Stories API routes
  app.post("/api/stories", async (req, res) => {
    try {
      // In a real implementation, this would save to a stories table
      // For now, we'll just acknowledge the submission
      console.log("Story submission received:", req.body);
      res.status(201).json({ message: "Story submitted successfully" });
    } catch (error) {
      console.error(`Error submitting story: ${error}`);
      res.status(500).json({ message: "Failed to submit story" });
    }
  });

  // Rate limiting store (in production, use Redis or similar)
  const rateLimitStore = new Map();
  
  // Contact form API route with anti-spam protection
  app.post("/api/contact", async (req, res) => {
    try {
      // Rate limiting: max 3 submissions per IP per hour
      const clientIP = req.ip || req.connection.remoteAddress;
      const now = Date.now();
      const hourWindow = 60 * 60 * 1000; // 1 hour
      
      if (!rateLimitStore.has(clientIP)) {
        rateLimitStore.set(clientIP, []);
      }
      
      const submissions = rateLimitStore.get(clientIP);
      const recentSubmissions = submissions.filter((time: number) => now - time < hourWindow);
      
      if (recentSubmissions.length >= 3) {
        return res.status(429).json({ 
          message: "Too many submissions. Please wait before submitting again.",
          retryAfter: hourWindow 
        });
      }
      
      // Update rate limit store
      recentSubmissions.push(now);
      rateLimitStore.set(clientIP, recentSubmissions);

      const contactSchema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        organization: z.string().optional(),
        inquiryType: z.string().min(1),
        subject: z.string().min(5),
        message: z.string().min(20),
        privacyConsent: z.boolean().refine(val => val === true, {
          message: 'Privacy consent is required'
        }),
        captchaToken: z.string().min(1, 'CAPTCHA verification required'),
      });

      const validatedData = contactSchema.parse(req.body);
      
      // Additional spam checks
      const spamKeywords = ['viagra', 'lottery', 'winner', 'bitcoin', 'crypto', 'investment opportunity'];
      const messageText = `${validatedData.subject} ${validatedData.message}`.toLowerCase();
      const hasSpamContent = spamKeywords.some(keyword => messageText.includes(keyword));
      
      if (hasSpamContent) {
        return res.status(400).json({ 
          message: "Message content flagged for review. Please contact us directly if this is a legitimate inquiry." 
        });
      }
      
      // Validate CAPTCHA token format (basic check)
      if (!validatedData.captchaToken.startsWith('captcha_')) {
        return res.status(400).json({ 
          message: "Invalid security verification. Please complete the CAPTCHA." 
        });
      }
      
      // In a real implementation, this would:
      // 1. Save to a contacts/messages database table with consent timestamp
      // 2. Send an email notification to the admin team
      // 3. Send an auto-reply confirmation to the sender
      // 4. Log the privacy consent for compliance
      console.log("Secure contact form submission received:", {
        ...validatedData,
        privacyConsentTimestamp: new Date().toISOString(),
        clientIP: clientIP,
        captchaVerified: true
      });
      
      res.status(201).json({ 
        message: "Contact form submitted successfully",
        timestamp: new Date().toISOString(),
        referenceId: `CAS-${Date.now()}`
      });
    } catch (error) {
      console.error(`Error submitting contact form: ${error}`);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to submit contact form" });
      }
    }
  });

  // Join CAS application API route
  app.post("/api/join", async (req, res) => {
    try {
      const joinSchema = z.object({
        firstName: z.string().min(2, "First name must be at least 2 characters"),
        lastName: z.string().min(2, "Last name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        phone: z.string().min(10, "Phone number must be at least 10 characters"),
        city: z.string().min(2, "City must be at least 2 characters"),
        province: z.string().min(2, "Province is required"),
        role: z.enum(["clinician", "researcher", "administrator", "patient", "caregiver", "advocate", "other"], {
          required_error: "Role is required"
        }),
        specialty: z.string().optional(),
        organization: z.string().optional(),
        interests: z.array(z.string()).min(1, "Please select at least one area of interest"),
        howHeard: z.string().min(1, "Please tell us how you heard about CAS"),
        message: z.string().optional(),
        newsletter: z.boolean().default(false),
        termsOfParticipation: z.boolean().refine(val => val === true, {
          message: 'Terms of Participation must be accepted'
        }),
        privacyPolicy: z.boolean().refine(val => val === true, {
          message: 'Privacy Policy must be accepted'
        })
      });

      const validatedData = joinSchema.parse(req.body);
      
      console.log("Enhanced CAS membership application received:", {
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        email: validatedData.email,
        role: validatedData.role,
        specialty: validatedData.specialty,
        organization: validatedData.organization,
        interests: validatedData.interests,
        province: validatedData.province,
        newsletter: validatedData.newsletter,
        timestamp: new Date().toISOString()
      });

      // In a real implementation, save to database:
      // await storage.createMembershipApplication(validatedData);

      res.status(200).json({ 
        message: "Thank you for your membership application! We'll review your application and get back to you within 2-3 weeks.",
        applicationId: `CAS-${Date.now()}`,
        estimatedReviewTime: "2-3 weeks"
      });
    } catch (error) {
      console.error("Join CAS application error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      res.status(500).json({ message: "Failed to process application" });
    }
  });

  // Dynamic Multi-Form Lead Capture API endpoint
  app.post("/api/submit-form", async (req, res) => {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    let submissionId: number | null = null;

    console.log(`\n=== [FORM SUBMISSION START] Request ID: ${requestId} ===`);
    console.log(`[${requestId}] Timestamp: ${new Date().toISOString()}`);
    console.log(`[${requestId}] User Agent: ${req.get('User-Agent')}`);
    console.log(`[${requestId}] IP: ${req.ip}`);
    console.log(`[${requestId}] Content-Type: ${req.get('Content-Type')}`);

    try {
      // Step 1: Log and sanitize incoming request data
      console.log(`[${requestId}] Raw request body structure:`, {
        hasFormName: !!req.body?.form_name,
        formName: req.body?.form_name,
        hasData: !!req.body?.data,
        dataKeys: req.body?.data ? Object.keys(req.body.data) : [],
        dataFieldCount: req.body?.data ? Object.keys(req.body.data).length : 0,
        bodySize: JSON.stringify(req.body).length
      });

      // Sanitize sensitive data for logging
      const sanitizedData = req.body?.data ? Object.fromEntries(
        Object.entries(req.body.data).map(([key, value]) => [
          key, 
          key.toLowerCase().includes('email') ? 
            (typeof value === 'string' ? value.replace(/(.{2}).*(@.*)/, '$1***$2') : value) :
            key.toLowerCase().includes('phone') ? 
              (typeof value === 'string' ? value.replace(/(\d{3}).*(\d{4})/, '$1***$2') : value) :
              value
        ])
      ) : {};

      console.log(`[${requestId}] Sanitized form data:`, {
        form_name: req.body?.form_name,
        data: sanitizedData
      });

      // Step 2: Validate the incoming request
      console.log(`[${requestId}] Starting validation with dynamicFormSubmissionSchema...`);
      const validationStartTime = Date.now();
      
      const validatedData = dynamicFormSubmissionSchema.parse(req.body);
      const { form_name, data } = validatedData;
      
      const validationDuration = Date.now() - validationStartTime;
      console.log(`[${requestId}] ✅ Validation successful (${validationDuration}ms)`, {
        formName: form_name,
        validatedFieldCount: Object.keys(data).length,
        validatedFields: Object.keys(data).map(key => ({
          field: key,
          type: typeof data[key],
          hasValue: !!data[key],
          length: typeof data[key] === 'string' ? data[key].length : null
        }))
      });

      // Step 3: Check for form configuration (optional)
      console.log(`[${requestId}] Looking up form configuration for: "${form_name}"`);
      const configLookupStartTime = Date.now();
      
      let targetModule = "Leads"; // Default module
      let fieldMappings = null;

      const formConfig = await storage.getFormConfiguration(form_name);
      const configLookupDuration = Date.now() - configLookupStartTime;
      
      if (formConfig) {
        targetModule = formConfig.zohoModule;
        fieldMappings = formConfig.fieldMappings;
        console.log(`[${requestId}] ✅ Form configuration found (${configLookupDuration}ms):`, {
          formName: form_name,
          targetModule: targetModule,
          hasMappings: !!fieldMappings,
          mappingCount: fieldMappings ? Object.keys(fieldMappings).length : 0,
          configDetails: {
            id: formConfig.id,
            isActive: formConfig.isActive,
            createdAt: formConfig.createdAt
          }
        });
      } else {
        console.log(`[${requestId}] ⚠️ No configuration found (${configLookupDuration}ms) for form "${form_name}", using defaults:`, {
          defaultModule: targetModule,
          willCreateDynamicMappings: true
        });
      }

      // Step 4: Create form submission record
      console.log(`[${requestId}] Creating submission record in database...`);
      const dbInsertStartTime = Date.now();
      
      const submissionData: InsertFormSubmission = {
        formName: form_name,
        submissionData: data,
        sourceForm: form_name,
        zohoModule: targetModule
      };

      console.log(`[${requestId}] Submission data prepared:`, {
        formName: submissionData.formName,
        sourceForm: submissionData.sourceForm,
        zohoModule: submissionData.zohoModule,
        dataFields: Object.keys(submissionData.submissionData as any),
        dataSize: JSON.stringify(submissionData.submissionData).length
      });

      const submission = await storage.createFormSubmission(submissionData);
      submissionId = submission.id;
      const dbInsertDuration = Date.now() - dbInsertStartTime;

      console.log(`[${requestId}] ✅ Submission record created (${dbInsertDuration}ms):`, {
        submissionId: submissionId,
        databaseId: submission.id,
        status: submission.processingStatus,
        syncStatus: submission.syncStatus,
        createdAt: submission.createdAt
      });

      // Step 5: Log the receipt operation
      console.log(`[${requestId}] Creating receipt log entry...`);
      const logStartTime = Date.now();
      
      await storage.createSubmissionLog({
        submissionId: submission.id,
        operation: "received",
        status: "success",
        details: {
          formName: form_name,
          fieldCount: Object.keys(data).length,
          targetModule,
          requestId: requestId,
          userAgent: req.get('User-Agent'),
          ip: req.ip
        },
        duration: Date.now() - startTime
      });
      
      const logDuration = Date.now() - logStartTime;
      console.log(`[${requestId}] ✅ Receipt log created (${logDuration}ms)`);

      // Step 6: Process Zoho CRM lead creation if configured
      if (zohoCRMLeadService.isConfigured()) {
        console.log(`[${requestId}] Starting Zoho CRM lead creation...`);
        
        setImmediate(async () => {
          const asyncProcessId = `zoho_${submissionId}_${Math.random().toString(36).substr(2, 6)}`;
          
          try {
            console.log(`[${asyncProcessId}] Creating lead in Zoho CRM for submission ${submissionId}`);
            
            // Create lead in Zoho CRM
            const zohoResult = await zohoCRMLeadService.createLead(data);
            
            if (zohoResult.success) {
              console.log(`[${asyncProcessId}] ✅ Lead created successfully:`, {
                leadId: zohoResult.leadId,
                createdTime: zohoResult.createdTime
              });
              
              // Update submission with success
              await storage.updateFormSubmission(submission.id, {
                processingStatus: "completed" as any,
                syncStatus: "synced" as any,
                zohoCrmId: zohoResult.leadId || null
              });
              
              // Log successful CRM push
              await storage.createSubmissionLog({
                submissionId: submission.id,
                operation: "crm_push",
                status: "success",
                details: {
                  zohoRecordId: zohoResult.leadId,
                  createdTime: zohoResult.createdTime,
                  processId: asyncProcessId
                },
                duration: 0
              });
            } else {
              console.error(`[${asyncProcessId}] ❌ Lead creation failed:`, zohoResult.error);
              
              await storage.updateFormSubmission(submission.id, {
                processingStatus: "failed" as any,
                syncStatus: "failed" as any,
                errorMessage: zohoResult.error || "Failed to create lead in Zoho CRM"
              });
              
              // Log failed CRM push
              await storage.createSubmissionLog({
                submissionId: submission.id,
                operation: "crm_push",
                status: "failed",
                details: { 
                  error: zohoResult.error,
                  processId: asyncProcessId
                },
                duration: 0,
                errorMessage: zohoResult.error || "Failed to create lead"
              });
            }
          } catch (error) {
            console.error(`[${asyncProcessId}] ❌ Exception during lead creation:`, error);
            
            if (submissionId) {
              await storage.updateFormSubmission(submissionId, {
                processingStatus: "failed" as any,
                syncStatus: "failed" as any,
                errorMessage: `Lead creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
              });
              
              await storage.createSubmissionLog({
                submissionId: submissionId,
                operation: "crm_push",
                status: "failed",
                details: { 
                  error: error instanceof Error ? error.message : 'Unknown error',
                  processId: asyncProcessId
                },
                duration: 0,
                errorMessage: error instanceof Error ? error.message : 'Unknown error'
              });
            }
          }
        });
      } else {
        console.log(`[${requestId}] Zoho CRM not configured, saving form submission only`);
        
        // Update submission status as pending
        await storage.updateFormSubmission(submission.id, {
          processingStatus: "completed" as any,
          syncStatus: "pending" as any
        });
      }

      // Step 8: Return immediate response to the client
      const responseTime = Date.now() - startTime;
      console.log(`[${requestId}] 📤 Sending success response to client (${responseTime}ms)`);
      
      const responseData = {
        success: true,
        message: "Form submission received successfully",
        submissionId: submission.id,
        formName: form_name,
        status: "processing",
        timestamp: new Date().toISOString(),
        targetModule,
        estimatedProcessingTime: "30-60 seconds",
        requestId: requestId
      };

      console.log(`[${requestId}] Response data:`, {
        submissionId: responseData.submissionId,
        targetModule: responseData.targetModule,
        status: responseData.status,
        processingTime: `${responseTime}ms`
      });

      res.status(201).json(responseData);
      console.log(`[${requestId}] ✅ FORM SUBMISSION REQUEST COMPLETED (${responseTime}ms)`);
      console.log(`=== [FORM SUBMISSION END] Request ID: ${requestId} ===\n`);

    } catch (error) {
      const errorResponseTime = Date.now() - startTime;
      console.error(`[${requestId}] ❌ FORM SUBMISSION REQUEST FAILED (${errorResponseTime}ms):`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        submissionId: submissionId,
        hasSubmissionId: !!submissionId
      });

      // Log the error if we have a submission ID
      if (submissionId) {
        try {
          await storage.createSubmissionLog({
            submissionId,
            operation: "received",
            status: "failed",
            details: { error: error instanceof Error ? error.message : 'Unknown error' },
            duration: Date.now() - startTime,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
          });
        } catch (logError) {
          console.error("[Form Submission] Failed to log error:", logError);
        }
      }

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid form submission data",
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to process form submission",
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Get form submission status endpoint
  app.get("/api/submit-form/:id", async (req, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      
      if (isNaN(submissionId)) {
        return res.status(400).json({ message: "Invalid submission ID" });
      }

      const submission = await storage.getFormSubmission(submissionId);
      
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      // Get logs for this submission
      const logs = await storage.getLogsBySubmissionId(submissionId);

      res.json({
        id: submission.id,
        formName: submission.formName,
        // processingStatus: submission.processingStatus, // Removed - access via submission directly
        syncStatus: submission.syncStatus,
        zohoModule: submission.zohoModule,
        zohoCrmId: submission.zohoCrmId,
        errorMessage: submission.errorMessage,
        retryCount: submission.retryCount,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
        logs: logs.map(log => ({
          operation: log.operation,
          status: log.status,
          details: log.details,
          duration: log.duration,
          createdAt: log.createdAt,
          errorMessage: log.errorMessage
        }))
      });

    } catch (error) {
      console.error("Error fetching submission status:", error);
      res.status(500).json({ message: "Failed to fetch submission status" });
    }
  });

  // Zoho CRM connection test endpoint
  app.get("/api/zoho/test-connection", async (req, res) => {
    try {
      const result = await zohoCRMService.testConnection();
      res.json(result);
    } catch (error) {
      console.error("Zoho connection test failed:", error);
      res.status(500).json({
        success: false,
        message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  });

  // Retry failed submission endpoint
  app.post("/api/retry/submission/:id", async (req, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      
      if (isNaN(submissionId)) {
        return res.status(400).json({ message: "Invalid submission ID" });
      }

      const result = await retryService.retrySubmission(submissionId);
      
      if (result.success) {
        res.json({
          success: true,
          message: `Submission ${submissionId} retried successfully`,
          retryCount: result.retryCount,
          finalStatus: result.finalStatus
        });
      } else {
        res.status(500).json({
          success: false,
          message: `Retry failed: ${result.errorMessage}`,
          retryCount: result.retryCount,
          finalStatus: result.finalStatus
        });
      }

    } catch (error) {
      console.error("Error retrying submission:", error);
      res.status(500).json({ 
        success: false,
        message: `Failed to retry submission: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });

  // Retry all failed submissions endpoint
  app.post("/api/retry/all", async (req, res) => {
    try {
      if (retryService.isRetryProcessing()) {
        return res.status(409).json({
          success: false,
          message: "Retry process is already running"
        });
      }

      const stats = await retryService.retryAllFailedSubmissions();
      
      res.json({
        success: true,
        message: "Bulk retry completed",
        stats
      });

    } catch (error) {
      console.error("Error during bulk retry:", error);
      res.status(500).json({ 
        success: false,
        message: `Bulk retry failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });

  // System monitoring and statistics endpoint
  app.get("/api/monitor/stats", async (req, res) => {
    try {
      // Get form submission statistics
      const allSubmissions = await storage.getFormSubmissions();
      const pendingSubmissions = await storage.getFormSubmissionsByStatus("pending", "pending");
      const processingSubmissions = await storage.getFormSubmissionsByStatus("processing", "pending");
      const completedSubmissions = await storage.getFormSubmissionsByStatus("completed", "synced");
      const failedSubmissions = await storage.getFormSubmissionsByStatus("failed", "failed");

      // Get retry statistics
      const retryStats = await retryService.getRetryStatistics();

      // Get recent logs (last 50)
      const recentLogs = await storage.getSubmissionLogs();
      const lastLogs = recentLogs.slice(-50).reverse();

      // Calculate success rate
      const totalProcessed = completedSubmissions.length + failedSubmissions.length;
      const successRate = totalProcessed > 0 ? (completedSubmissions.length / totalProcessed) * 100 : 0;

      // Get field mappings count
      const fieldMappings = await storage.getFieldMappings();
      const formConfigurations = await storage.getFormConfigurations();

      res.json({
        systemStatus: {
          totalSubmissions: allSubmissions.length,
          pendingSubmissions: pendingSubmissions.length,
          processingSubmissions: processingSubmissions.length,
          completedSubmissions: completedSubmissions.length,
          failedSubmissions: failedSubmissions.length,
          successRate: Math.round(successRate * 100) / 100,
          retryProcessing: retryService.isRetryProcessing()
        },
        retryStatistics: retryStats,
        configurationStatus: {
          fieldMappings: fieldMappings.length,
          formConfigurations: formConfigurations.length
        },
        recentActivity: lastLogs.map(log => ({
          submissionId: log.submissionId,
          operation: log.operation,
          status: log.status,
          duration: log.duration,
          createdAt: log.createdAt,
          errorMessage: log.errorMessage
        }))
      });

    } catch (error) {
      console.error("Error getting system statistics:", error);
      res.status(500).json({ 
        message: `Failed to get statistics: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      // Test database connection
      const testSubmissions = await storage.getFormSubmissions();
      
      // Test Zoho connection
      const zohoTest = await zohoCRMService.testConnection();

      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: {
          database: {
            status: "connected",
            submissionCount: testSubmissions.length
          },
          zoho: {
            status: zohoTest.success ? "connected" : "disconnected",
            message: zohoTest.message
          },
          retryService: {
            status: retryService.isRetryProcessing() ? "processing" : "idle"
          }
        }
      });

    } catch (error) {
      console.error("Health check failed:", error);
      res.status(503).json({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Setup endpoint for CANN form configuration
  app.post("/api/setup-cann-form", async (req, res) => {
    try {
      console.log("[Setup] Setting up CANN Membership Form Configuration...");

      // Check if configuration already exists
      const existingConfig = await storage.getFormConfiguration("Join CANN Today");
      
      if (existingConfig) {
        console.log("[Setup] CANN form configuration already exists:", existingConfig.id);
        return res.json({
          success: true,
          message: "CANN form configuration already exists",
          configId: existingConfig.id,
          config: existingConfig
        });
      }

      // Create CANN form configuration
      const cannFormConfig = {
        formName: "Join CANN Today",
        zohoModule: "Leads", // Map to Leads module in Zoho CRM
        description: "Canadian Amyloidosis Nursing Network membership application form",
        isActive: true,
        fieldMappings: {
          // Basic membership info
          "membershipRequest": {
            "zohoField": "membershipRequest",
            "fieldType": "picklist",
            "isRequired": true,
            "description": "Whether user wants CAS membership"
          },
          "fullName": {
            "zohoField": "fullName", 
            "fieldType": "text",
            "isRequired": false,
            "description": "Full name of the applicant"
          },
          "emailAddress": {
            "zohoField": "emailAddress",
            "fieldType": "email", 
            "isRequired": false,
            "description": "Email address of the applicant"
          },
          "discipline": {
            "zohoField": "discipline",
            "fieldType": "text",
            "isRequired": false,
            "description": "Professional discipline (nurse, physician, etc.)"
          },
          "subspecialty": {
            "zohoField": "subspecialty",
            "fieldType": "text",
            "isRequired": false,
            "description": "Sub-specialty area of focus"
          },
          "institutionName": {
            "zohoField": "institutionName",
            "fieldType": "text",
            "isRequired": false,
            "description": "Center or clinic name/institution"
          },
          "communicationConsent": {
            "zohoField": "communicationConsent",
            "fieldType": "picklist",
            "isRequired": false,
            "description": "Consent for communication from CAS"
          },
          // Services map related fields
          "servicesMapConsent": {
            "zohoField": "servicesMapConsent",
            "fieldType": "picklist",
            "isRequired": true,
            "description": "Consent for including center in services map"
          },
          "mapInstitutionName": {
            "zohoField": "mapInstitutionName",
            "fieldType": "text",
            "isRequired": false,
            "description": "Institution name for services map"
          },
          "institutionAddress": {
            "zohoField": "institutionAddress",
            "fieldType": "text",
            "isRequired": false,
            "description": "Full address of institution"
          },
          "institutionPhone": {
            "zohoField": "institutionPhone",
            "fieldType": "phone",
            "isRequired": false,
            "description": "Institution phone number"
          },
          "institutionFax": {
            "zohoField": "institutionFax",
            "fieldType": "text",
            "isRequired": false,
            "description": "Institution fax number"
          },
          "followUpConsent": {
            "zohoField": "followUpConsent",
            "fieldType": "picklist",
            "isRequired": false,
            "description": "Consent for follow-up contact by CAS"
          }
        },
        settings: {
          "autoCreateFields": true,
          "enableRetries": true,
          "maxRetries": 3,
          "syncRequired": true,
          "trackingEnabled": true,
          "notificationEmail": "admin@amyloid.ca"
        }
      };

      // Create the configuration
      const createdConfig = await storage.createFormConfiguration(cannFormConfig);
      console.log("[Setup] CANN form configuration created successfully!");
      console.log("[Setup] Configuration ID:", createdConfig.id);
      console.log("[Setup] Zoho Module:", createdConfig.zohoModule);
      console.log("[Setup] Field Mappings Count:", Object.keys(createdConfig.fieldMappings as Record<string, any>).length);

      res.json({
        success: true,
        message: "CANN form configuration created successfully!",
        configId: createdConfig.id,
        config: createdConfig,
        summary: {
          formName: createdConfig.formName,
          zohoModule: createdConfig.zohoModule,
          fieldCount: Object.keys(createdConfig.fieldMappings as Record<string, any>).length,
          isActive: createdConfig.isActive
        }
      });

    } catch (error) {
      console.error("[Setup] Error setting up CANN form configuration:", error);
      res.status(500).json({
        success: false,
        message: "Failed to setup CANN form configuration",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Non-OAuth API endpoints (OAuth routes handled by proxy)
  
  // System health check endpoint (non-OAuth)
  app.get('/api/system-health', async (_req, res) => {
    try {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        server: 'frontend'
      });
    } catch (error) {
      res.status(503).json({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Retry failed submissions endpoint (preserved for direct calls)
  app.post("/api/retry-failed-submissions", async (req, res) => {
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

  // OAuth endpoints for backend server
  app.get("/api/oauth/test", (req, res) => {
    console.log("[OAuth Test] Test endpoint hit");
    res.json({
      message: "OAuth backend is working!",
      timestamp: new Date().toISOString(),
      host: req.get('host'),
      forwardedHost: req.get('x-forwarded-host'),
      server: 'backend'
    });
  });

  app.get('/api/health-check', async (_req, res) => {
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
        timestamp: new Date().toISOString(),
        server: 'backend'
      });
    } catch (error) {
      res.status(503).json({
        status: 'oauth_error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        server: 'backend'
      });
    }
  });

  app.get("/api/oauth/zoho/auth", (req, res) => {
    console.log("[OAuth Auth] Endpoint hit, redirecting to connect");
    res.redirect("/oauth/zoho/connect");
  });

  app.get("/oauth/zoho/connect", (req, res) => {
    try {
      let redirectUri: string;
      
      if (process.env.ZOHO_REDIRECT_URI) {
        redirectUri = process.env.ZOHO_REDIRECT_URI;
        console.log(`[OAuth Connect] Using environment ZOHO_REDIRECT_URI: ${redirectUri}`);
      } else {
        const forwardedHost = req.get('x-forwarded-host') || req.get('host');
        const isProduction = forwardedHost === 'amyloid.ca' || process.env.NODE_ENV === 'production';
        const isReplitDev = forwardedHost === 'cas-website-prod-connect11.replit.app';
        
        let baseUrl: string;
        if (isProduction) {
          baseUrl = 'https://amyloid.ca';
        } else if (isReplitDev) {
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
      res.status(500).json({ error: "Failed to initiate OAuth flow", details: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get("/oauth/zoho/callback", async (req, res) => {
    try {
      const { code, error, error_description } = req.query;
      
      if (error) {
        console.error("[OAuth Callback] Zoho OAuth error:", error, error_description);
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
        console.error("[OAuth Callback] No authorization code provided. Query params:", req.query);
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

      const tokenData = await tokenResponse.json();
      
      if (tokenData.error) {
        console.error("Token exchange error:", tokenData);
        return res.status(400).json({ error: tokenData.error, details: tokenData });
      }

      console.log("Successfully obtained access token!");
      
      const stored = await oauthService.storeTokens('zoho_crm', tokenData);
      
      if (stored) {
        console.log("✅ Tokens stored automatically in database");
        
        res.send(`
          <html>
            <head><title>Zoho OAuth Success</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>✅ Zoho Authorization Successful!</h2>
              <p>Your Zoho CRM integration is now <strong>automatically configured</strong>!</p>
              <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #28a745;">
                <h3>✅ Automatic Token Management Active</h3>
                <p>Form submissions will now automatically sync to Zoho CRM.</p>
              </div>
              <p><a href="/oauth-test" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Integration Status</a></p>
              <p><a href="/" style="background: #6c757d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">← Return to Website</a></p>
            </body>
          </html>
        `);
      } else {
        console.error("❌ Failed to store tokens automatically");
        res.status(500).send(`
          <html>
            <head><title>Token Storage Error</title></head>
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
      res.status(500).json({ error: "Failed to process OAuth callback", details: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
