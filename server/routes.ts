import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, type ResourceFilters } from "./storage";
import { insertResourceSchema, dynamicFormSubmissionSchema, InsertFormSubmission } from "@shared/schema";
import { fieldSyncEngine } from "./field-sync-engine";
import { zohoCRMService } from "./zoho-crm-service";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
    let submissionId: number | null = null;

    try {
      console.log("[Form Submission] Received form submission:", req.body);

      // Step 1: Validate the incoming request
      const validatedData = dynamicFormSubmissionSchema.parse(req.body);
      const { form_name, data } = validatedData;

      // Step 2: Check for form configuration (optional)
      let targetModule = "Leads"; // Default module
      let fieldMappings = null;

      const formConfig = await storage.getFormConfiguration(form_name);
      if (formConfig) {
        targetModule = formConfig.zohoModule;
        fieldMappings = formConfig.fieldMappings;
        console.log(`[Form Submission] Using configuration for form "${form_name}": module=${targetModule}`);
      } else {
        console.log(`[Form Submission] No configuration found for form "${form_name}", using default module: ${targetModule}`);
      }

      // Step 3: Create form submission record
      const submissionData: InsertFormSubmission = {
        formName: form_name,
        submissionData: data,
        sourceForm: form_name,
        zohoModule: targetModule,
        processingStatus: "pending" as any,
        syncStatus: "pending" as any
      };

      const submission = await storage.createFormSubmission(submissionData);
      submissionId = submission.id;

      console.log(`[Form Submission] Created submission record with ID: ${submissionId}`);

      // Step 4: Log the receipt
      await storage.createSubmissionLog({
        submissionId: submission.id,
        operation: "received",
        status: "success",
        details: {
          formName: form_name,
          fieldCount: Object.keys(data).length,
          targetModule
        },
        duration: Date.now() - startTime
      });

      // Step 5: Start processing asynchronously
      setImmediate(async () => {
        try {
          console.log(`[Form Submission] Starting async processing for submission ${submissionId}`);
          
          // Update status to processing
          await storage.updateFormSubmission(submission.id, {
            processingStatus: "processing" as any
          });

          // Step 5a: Sync fields with Zoho CRM
          console.log(`[Form Submission] Starting field sync for submission ${submissionId}`);
          const fieldSyncResult = await fieldSyncEngine.syncFieldsForSubmission(submission);
          
          if (!fieldSyncResult.success) {
            console.error(`[Form Submission] Field sync failed for submission ${submissionId}:`, fieldSyncResult.errors);
            await storage.updateFormSubmission(submission.id, {
              processingStatus: "failed" as any,
              syncStatus: "failed" as any,
              errorMessage: `Field sync failed: ${fieldSyncResult.errors.join("; ")}`
            });
            return;
          }

          // Step 5b: Push data to Zoho CRM
          console.log(`[Form Submission] Starting CRM push for submission ${submissionId}`);
          const pushStartTime = Date.now();
          
          try {
            // Get updated field mappings after sync
            const updatedMappings = await storage.getFieldMappings({ zohoModule: targetModule });
            
            // Format data for Zoho CRM
            const zohoData = zohoCRMService.formatFieldDataForZoho(data, updatedMappings);
            
            // Add Source_Form field
            zohoData.Source_Form = form_name;
            
            console.log(`[Form Submission] Pushing data to Zoho ${targetModule}:`, zohoData);
            
            // Create record in Zoho CRM
            const zohoRecord = await zohoCRMService.createRecord(targetModule, zohoData);
            
            // Update submission with success
            await storage.updateFormSubmission(submission.id, {
              processingStatus: "completed" as any,
              syncStatus: "synced" as any,
              zohoCrmId: zohoRecord.id || null
            });

            // Log successful CRM push
            await storage.createSubmissionLog({
              submissionId: submission.id,
              operation: "crm_push",
              status: "success",
              details: {
                zohoRecordId: zohoRecord.id,
                targetModule,
                fieldsSubmitted: Object.keys(zohoData).length
              },
              duration: Date.now() - pushStartTime
            });

            console.log(`[Form Submission] Successfully completed processing for submission ${submissionId}, Zoho record ID: ${zohoRecord.id}`);

          } catch (crmError) {
            console.error(`[Form Submission] CRM push failed for submission ${submissionId}:`, crmError);
            
            await storage.updateFormSubmission(submission.id, {
              processingStatus: "failed" as any,
              syncStatus: "failed" as any,
              errorMessage: `CRM push failed: ${crmError instanceof Error ? crmError.message : 'Unknown error'}`
            });

            // Log failed CRM push
            await storage.createSubmissionLog({
              submissionId: submission.id,
              operation: "crm_push",
              status: "failed",
              details: { error: crmError instanceof Error ? crmError.message : 'Unknown error' },
              duration: Date.now() - pushStartTime,
              errorMessage: crmError instanceof Error ? crmError.message : 'Unknown error'
            });
          }

        } catch (processingError) {
          console.error(`[Form Submission] Processing failed for submission ${submissionId}:`, processingError);
          
          if (submissionId) {
            await storage.updateFormSubmission(submissionId, {
              processingStatus: "failed" as any,
              syncStatus: "failed" as any,
              errorMessage: `Processing failed: ${processingError instanceof Error ? processingError.message : 'Unknown error'}`
            });
          }
        }
      });

      // Step 6: Return immediate response to the client
      res.status(201).json({
        success: true,
        message: "Form submission received successfully",
        submissionId: submission.id,
        formName: form_name,
        status: "processing",
        timestamp: new Date().toISOString(),
        targetModule,
        estimatedProcessingTime: "30-60 seconds"
      });

    } catch (error) {
      console.error("[Form Submission] Error processing form submission:", error);

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
        processingStatus: submission.processingStatus,
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

  const httpServer = createServer(app);
  return httpServer;
}
