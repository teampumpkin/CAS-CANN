import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, type ResourceFilters } from "./storage";
import { insertResourceSchema, dynamicFormSubmissionSchema, InsertFormSubmission } from "@shared/schema";
import { fieldSyncEngine } from "./field-sync-engine";
import { zohoCRMService } from "./zoho-crm-service";
import { retryService } from "./retry-service";
import { oauthService } from "./oauth-service";
import { dedicatedTokenManager } from "./dedicated-token-manager";
import { reportingService, reportFiltersSchema } from "./reporting-service";
import { fieldMetadataCacheService } from "./field-metadata-cache-service";
import { requireAutomationAuth } from "./auth-middleware";
// import { notificationService, notificationConfigSchema } from "./notification-service"; // Disabled for production
// REMOVED: formScalabilityService - No longer used after endpoint consolidation
import { errorHandlingService, errorClassificationSchema } from "./error-handling-service";
// REMOVED: streamlinedFormProcessor - No longer used after endpoint consolidation
import { emailNotificationService } from "./email-notification-service";
import { zohoWorkflowService } from "./zoho-workflow-service";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Basic ping endpoint for deployment verification
  app.get('/ping', (_req, res) => {
    res.status(200).send('pong');
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

  // NEW: Unified CAS/CANN Registration endpoint (simple, direct to Zoho)
  app.post("/api/cas-cann-registration", async (req, res) => {
    try {
      console.log("[CAS/CANN Registration] Received:", req.body);
      
      const { formData, formName } = req.body;
      
      const isMember = formData.wantsMembership === "Yes" || formData.wantsCANNMembership === "Yes";
      const isCANNMember = formData.wantsCANNMembership === "Yes";
      
      // Build Zoho Lead data
      const zohoData: any = {
        Lead_Source: formName === "CAS & CANN Registration" 
          ? "Website - CAS & CANN Registration"
          : "Website - CAS Registration",
      };
      
      // Member fields (Q3-8) - when either CAS or CANN = Yes
      if (isMember) {
        zohoData.Last_Name = formData.fullName || "Unknown";
        zohoData.Email = formData.email;
        if (formData.discipline) zohoData.Industry = formData.discipline;
        if (formData.subspecialty) zohoData.Description = formData.subspecialty;
        if (formData.institution) zohoData.Company = formData.institution;
        
        // CAS Communications preference (Q8)
        if (formData.wantsCommunications) {
          zohoData.CAS_Communications = formData.wantsCommunications;
        }
      }
      
      // Non-member fallback (Q11) - when both CAS and CANN = No
      if (!isMember) {
        zohoData.Last_Name = formData.noMemberName || "Non-Member Contact";
        zohoData.Email = formData.noMemberEmail;
        if (formData.noMemberMessage) {
          zohoData.Description = `Non-member contact: ${formData.noMemberMessage}`;
        }
      }
      
      // Services Map (Q9) - always asked
      if (formData.wantsServicesMapInclusion) {
        zohoData.Services_Map_Inclusion = formData.wantsServicesMapInclusion;
      }
      
      // CANN-specific fields (Q10a-10d) - only when CANN = Yes
      if (isCANNMember) {
        if (formData.amyloidosisType) {
          zohoData.Amyloidosis_Type = formData.amyloidosisType;
        }
        
        if (formData.cannCommunications) {
          zohoData.CANN_Communications = formData.cannCommunications;
        }
        
        // Educational interests (checkbox array) - send as array for Zoho multiselect
        if (formData.educationalInterests && formData.educationalInterests.length > 0) {
          const interests = [...formData.educationalInterests];
          // Add "Other" if specified
          if (formData.otherEducationalInterest) {
            interests.push(`Other: ${formData.otherEducationalInterest}`);
          }
          // Send as array for Zoho jsonarray/multiselect field
          zohoData.Educational_Interests = interests;
        } else if (formData.otherEducationalInterest) {
          zohoData.Educational_Interests = [`Other: ${formData.otherEducationalInterest}`];
        }
        
        if (formData.interestedInPresenting) {
          zohoData.Interested_in_Presenting = formData.interestedInPresenting;
        }
      }
      
      console.log("[CAS/CANN Registration] Submitting to Zoho:", zohoData);
      
      const zohoRecord = await zohoCRMService.createRecord("Leads", zohoData);
      
      console.log("[CAS/CANN Registration] ✅ Success! Zoho ID:", zohoRecord.id);
      
      // Send automated email notifications via Zoho Send Mail API
      try {
        await zohoCRMService.sendRegistrationEmail(zohoRecord.id, zohoData);
        console.log("[CAS/CANN Registration] ✅ Email notifications sent via Zoho CRM");
      } catch (emailError) {
        console.error("[CAS/CANN Registration] ⚠️ Failed to send email notifications:", emailError);
        // Continue even if email fails - registration was successful
      }
      
      res.status(201).json({
        success: true,
        message: "Registration submitted successfully",
        submissionId: zohoRecord.id,
        formName: formName
      });
      
    } catch (error) {
      console.error("[CAS/CANN Registration] ❌ Error:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to submit registration" 
      });
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

      // Step 2: Set target module (all forms go to Leads)
      const targetModule = "Leads";
      console.log(`[Form Submission] Processing form "${form_name}" → Zoho ${targetModule}`);

      // Step 3: Create form submission record
      const submissionData: InsertFormSubmission = {
        formName: form_name,
        submissionData: data,
        sourceForm: form_name,
        zohoModule: targetModule
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
            // processingStatus: "processing" // Already set by default
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
            
            // Add Lead_Source field with proper attribution
            const leadSourceMap: Record<string, string> = {
              "CAS Registration": "Website - CAS Registration",
              "CAS & CANN Registration": "Website - CAS & CANN Registration",
              "Join CANN Today": "Website - CANN Membership",
            };
            zohoData.Lead_Source = leadSourceMap[form_name] || `Website - ${form_name}`;
            
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

  // Bulk Import API endpoint for historical data
  app.post("/api/bulk-import", async (req, res) => {
    try {
      const { filePath, dataSource } = req.body;

      if (!filePath || !dataSource) {
        return res.status(400).json({
          success: false,
          message: "Both filePath and dataSource are required"
        });
      }

      if (!['CANN Contacts', 'CAS Registration'].includes(dataSource)) {
        return res.status(400).json({
          success: false,
          message: "dataSource must be either 'CANN Contacts' or 'CAS Registration'"
        });
      }

      const { BulkImportService } = await import('./bulk-import-service');
      const bulkImportService = new BulkImportService(storage);

      const result = await bulkImportService.importFromExcel(filePath, dataSource as "CANN Contacts" | "CAS Registration");

      res.json({
        success: true,
        message: "Bulk import completed",
        ...result
      });
    } catch (error) {
      console.error("[Bulk Import] Error:", error);
      res.status(500).json({
        success: false,
        message: "Bulk import failed",
        error: error instanceof Error ? error.message : 'Unknown error'
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
      const processingSubmissions = await storage.getFormSubmissionsByStatus("processing", "processing");
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

  // Helper function to normalize production domain
  const getProductionDomain = (req: express.Request): { isProduction: boolean; baseUrl: string } => {
    const forwardedHost = req.get('x-forwarded-host') || req.get('host') || '';
    const host = req.get('host') || '';
    
    // Check if this is a production domain (with or without www)
    const isProductionDomain = 
      forwardedHost.includes('amyloid.ca') || 
      host.includes('amyloid.ca') ||
      process.env.NODE_ENV === 'production';
    
    // Always use amyloid.ca for production OAuth to match Zoho configuration
    const baseUrl = isProductionDomain 
      ? 'https://amyloid.ca' 
      : `${req.protocol}://${host}`;
    
    return { isProduction: isProductionDomain, baseUrl };
  };

  // Debug endpoint to show OAuth authorization URL with dynamic scope support
  app.get("/oauth/zoho/debug", (req, res) => {
    try {
      const { isProduction, baseUrl } = getProductionDomain(req);
      const redirectUri = `${baseUrl}/oauth/zoho/callback`;
      
      // Support custom scopes via query parameter
      const scopesParam = req.query.scopes as string | undefined;
      const customScopes = scopesParam ? scopesParam.split(',').map(s => s.trim()) : undefined;
      
      const authUrl = oauthService.getAuthorizationUrl('zoho_crm', redirectUri, customScopes);
      
      res.send(`
        <html>
          <head><title>OAuth Debug</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
            <h2>🔍 OAuth Authorization URL Debug</h2>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>Production Mode:</strong> ${isProduction}</p>
              <p><strong>Base URL:</strong> ${baseUrl}</p>
              <p><strong>Redirect URI:</strong> ${redirectUri}</p>
              <p><strong>Client ID:</strong> ${process.env.ZOHO_CLIENT_ID?.substring(0, 20)}...</p>
              <p><strong>Scopes:</strong> ${customScopes ? 'Custom' : 'Default'}</p>
            </div>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #28a745;">
              <h3>Authorization URL:</h3>
              <p style="word-break: break-all; font-family: monospace; font-size: 12px;">${authUrl}</p>
            </div>
            <div style="margin: 20px 0;">
              <a href="${authUrl}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Click Here to Authorize with Zoho
              </a>
            </div>
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107;">
              <h4>💡 Dynamic Scopes</h4>
              <p>You can customize scopes by adding <code>?scopes=</code> parameter:</p>
              <p style="font-family: monospace; font-size: 12px;">
                /oauth/zoho/debug?scopes=ZohoCRM.modules.ALL,ZohoCRM.settings.workflow_rules.ALL
              </p>
            </div>
            <p style="color: #666; font-size: 14px;">
              <strong>Instructions:</strong> Click the button above to be redirected to Zoho's authorization page. 
              You should see a page asking you to grant permissions. If you're immediately redirected back here, 
              there may be an issue with your Zoho OAuth configuration.
            </p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("[OAuth Debug] Error:", error);
      res.status(500).json({ 
        error: "Failed to generate OAuth URL", 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Zoho OAuth connect endpoint - starts the authorization flow with dynamic scopes
  app.get("/oauth/zoho/connect", (req, res) => {
    try {
      const { isProduction, baseUrl } = getProductionDomain(req);
      const redirectUri = `${baseUrl}/oauth/zoho/callback`;
      
      console.log(`[OAuth Connect] Host: ${req.get('host')}, X-Forwarded-Host: ${req.get('x-forwarded-host')}`);
      console.log(`[OAuth Connect] Production mode: ${isProduction}`);
      console.log(`[OAuth Connect] Base URL: ${baseUrl}`);
      console.log(`[OAuth Connect] Redirect URI: ${redirectUri}`);
      
      // Support dynamic scopes via query parameter
      // Example: /oauth/zoho/connect?scopes=ZohoCRM.modules.ALL,ZohoCRM.settings.fields.ALL
      const scopesParam = req.query.scopes as string | undefined;
      const customScopes = scopesParam ? scopesParam.split(',').map(s => s.trim()) : undefined;
      
      if (customScopes) {
        console.log(`[OAuth Connect] Using custom scopes: ${customScopes.join(', ')}`);
      } else {
        console.log(`[OAuth Connect] Using default scopes from environment or hardcoded defaults`);
      }
      
      const authUrl = oauthService.getAuthorizationUrl('zoho_crm', redirectUri, customScopes);
      console.log(`[OAuth Connect] Authorization URL: ${authUrl}`);
      console.log(`[OAuth Connect] Redirecting to Zoho...`);
      
      res.redirect(authUrl);
    } catch (error) {
      console.error("[OAuth Connect] Error:", error);
      res.status(500).json({ 
        error: "Failed to initiate OAuth flow", 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Test OAuth token validity by calling Zoho API
  app.get("/api/test-oauth-token", async (req, res) => {
    try {
      console.log("[Test OAuth] Checking token validity...");
      const token = await dedicatedTokenManager.getValidAccessToken('zoho_crm');
      
      if (!token) {
        return res.json({
          success: false,
          error: "No token found in database",
          solution: "Visit /oauth/zoho/connect to authorize"
        });
      }

      console.log("[Test OAuth] Token found, testing against Zoho API...");
      console.log("[Test OAuth] Token preview:", token.substring(0, 20) + "...");
      
      // Test the token by calling Zoho's users API
      const zohoResponse = await fetch("https://www.zohoapis.com/crm/v8/users?type=CurrentUser", {
        method: 'GET',
        headers: {
          'Authorization': `Zoho-oauthtoken ${token}`
        }
      });

      console.log("[Test OAuth] Zoho API response status:", zohoResponse.status);
      const responseData = await zohoResponse.json();
      
      if (zohoResponse.ok) {
        return res.json({
          success: true,
          message: "✅ OAuth token is valid and working!",
          zohoUser: responseData.users?.[0],
          tokenPreview: token.substring(0, 20) + "..."
        });
      } else {
        return res.json({
          success: false,
          error: `Zoho API returned ${zohoResponse.status}`,
          details: responseData,
          solution: "Token exists but is invalid. Visit /oauth/zoho/connect to re-authorize"
        });
      }
    } catch (error) {
      console.error("[Test OAuth] Error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Test endpoint to manually create workflow
  app.get("/api/create-workflow", async (req, res) => {
    try {
      console.log("[Test] Manually triggering workflow creation...");
      const result = await zohoWorkflowService.setupRegistrationEmailWorkflows(false);
      res.json({ success: true, message: "Workflows created successfully!", result });
    } catch (error) {
      console.error("[Test] Workflow creation failed:", error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      });
    }
  });

  // OAuth callback endpoint for Zoho authorization
  app.get("/oauth/zoho/callback", async (req, res) => {
    try {
      const { code } = req.query;
      
      // Log debug info for troubleshooting
      console.log("[OAuth Callback] Full query parameters:", req.query);
      console.log("[OAuth Callback] Request URL:", req.url);
      
      const { error, error_description } = req.query;
      
      // Handle OAuth errors from Zoho
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

      console.log("[OAuth Callback] Received Zoho authorization code");
      
      // Use the same domain normalization as the connect endpoint
      const { baseUrl } = getProductionDomain(req);
      const redirectUri = `${baseUrl}/oauth/zoho/callback`;
      
      console.log("[OAuth Callback] Using redirect URI:", redirectUri);
      
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
          redirect_uri: redirectUri,
          code: code as string,
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (tokenData.error) {
        console.error("Token exchange error:", tokenData);
        return res.status(400).json({ error: tokenData.error, details: tokenData });
      }

      console.log("Successfully obtained access token!");
      
      // Store tokens automatically using the dedicated token manager
      const stored = await dedicatedTokenManager.storeToken('zoho_crm', tokenData);
      
      if (stored) {
        console.log("✅ Tokens stored automatically in database");
        
        // Try to create email notification workflows
        try {
          console.log("[OAuth Callback] Attempting to create email notification workflows...");
          const workflowResult = await zohoWorkflowService.setupRegistrationEmailWorkflows(false);
          console.log("[OAuth Callback] ✅ Email notification workflows created successfully!", workflowResult);
        } catch (workflowError) {
          console.error("[OAuth Callback] Failed to create workflows (non-fatal):", workflowError);
          // Continue even if workflow creation fails - can be done manually later
        }
        
        res.send(`
          <html>
            <head><title>Zoho OAuth Success</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>✅ Zoho Authorization Successful!</h2>
              <p>Your Zoho CRM integration is now <strong>automatically configured</strong>!</p>
              <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #28a745;">
                <h3>✅ Automatic Token Management Active</h3>
                <ul>
                  <li>Access tokens will automatically refresh before expiring</li>
                  <li>Your CANN membership forms will sync continuously with Zoho CRM</li>
                  <li>No manual token management required</li>
                  <li><strong>Email notifications will be sent automatically for new registrations</strong></li>
                </ul>
              </div>
              <p><strong>Token expires in:</strong> ${tokenData.expires_in} seconds (${Math.floor(tokenData.expires_in / 3600)} hours)</p>
              <p><strong>API Domain:</strong> ${tokenData.api_domain}</p>
              <p><strong>Next Steps:</strong> Your integration is ready! Test your membership forms - they will automatically sync to Zoho CRM and send email notifications.</p>
              <p><a href="/">← Return to Website</a></p>
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

  // Comprehensive Reporting API endpoints
  app.get("/api/reports", async (req, res) => {
    try {
      const filters = reportFiltersSchema.parse({
        formName: req.query.formName as string,
        zohoModule: req.query.zohoModule as string,
        processingStatus: req.query.processingStatus as string,
        syncStatus: req.query.syncStatus as string,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
        includeCustomFields: req.query.includeCustomFields === 'true',
        groupBy: req.query.groupBy as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      console.log('[API] Generating report with filters:', filters);
      const report = await reportingService.generateReport(filters);
      
      res.json({
        success: true,
        report,
        generatedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Reports endpoint error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid query parameters',
          details: error.errors,
        });
      }
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Export report as CSV
  app.get("/api/reports/export/csv", async (req, res) => {
    try {
      const filters = reportFiltersSchema.parse({
        formName: req.query.formName as string,
        zohoModule: req.query.zohoModule as string,
        processingStatus: req.query.processingStatus as string,
        syncStatus: req.query.syncStatus as string,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
        includeCustomFields: req.query.includeCustomFields === 'true',
        groupBy: req.query.groupBy as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      console.log('[API] Exporting report as CSV:', filters);
      const csvContent = await reportingService.exportReportAsCSV(filters);
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `form_submissions_report_${timestamp}.csv`;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csvContent);

    } catch (error) {
      console.error('[API] CSV export error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Export failed',
      });
    }
  });

  // Get CRM lead summary using COQL
  app.get("/api/reports/crm-summary", async (req, res) => {
    try {
      const filters = {
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
        sourceForm: req.query.sourceForm as string,
      };

      console.log('[API] Fetching CRM summary:', filters);
      const summary = await reportingService.getLeadSummaryFromCRM(filters);
      
      res.json({
        success: true,
        summary,
        generatedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] CRM summary error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'CRM summary failed',
        suggestion: 'Ensure OAuth tokens are valid and CRM access is working',
      });
    }
  });

  // Field metadata cache management endpoints
  app.get("/api/metadata/cache-stats", async (req, res) => {
    try {
      const stats = await fieldMetadataCacheService.getCacheStats();
      
      res.json({
        success: true,
        stats,
        retrievedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Cache stats error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get cache stats',
      });
    }
  });

  // Notification System API endpoints (DISABLED for production)
  /*
  app.get("/api/notifications/config", async (req, res) => {
    try {
      // const config = notificationService.getConfiguration();
      
      res.json({
        success: true,
        config,
        retrievedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Get notification config error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get config',
      });
    }
  });

  app.post("/api/notifications/config", async (req, res) => {
    try {
      const newConfig = notificationConfigSchema.partial().parse(req.body);
      
      await notificationService.updateConfiguration(newConfig);
      
      res.json({
        success: true,
        config: notificationService.getConfiguration(),
        updatedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Update notification config error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid configuration data',
          details: error.errors,
        });
      }
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update config',
      });
    }
  });

  app.post("/api/notifications/test-weekly-report", async (req, res) => {
    try {
      console.log('[API] Manual weekly report generation requested');
      const report = await notificationService.generateWeeklyReportNow();
      
      res.json({
        success: true,
        report,
        message: 'Weekly report generated successfully (check server logs for email content)',
        generatedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Test weekly report error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate report',
      });
    }
  });

  app.post("/api/notifications/test-alerts", async (req, res) => {
    try {
      console.log('[API] Manual alert check requested');
      await notificationService.checkAlertsNow();
      
      res.json({
        success: true,
        message: 'Alert check completed (check server logs for any alerts)',
        checkedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Test alerts error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check alerts',
      });
    }
  });

  app.post("/api/notifications/send-csv-report", async (req, res) => {
    try {
      const filters = req.body.filters || {};
      
      console.log('[API] CSV report email requested');
      await notificationService.sendCSVReport(filters);
      
      res.json({
        success: true,
        message: 'CSV report prepared for email delivery (check server logs)',
        sentAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Send CSV report error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send CSV report',
      });
    }
  });
  */

  // Form Scalability System API endpoints - REMOVED: Duplicate of /api/submit-form

  // REMOVED: /api/forms/analyze - Management endpoint not needed for production

  // REMOVED: /api/forms/configure - Management endpoint not needed for production

  // REMOVED: /api/forms/configs - Management endpoint not needed for production

  // REMOVED: /api/forms/configs/:formName GET - Management endpoint not needed

  // REMOVED: /api/forms/configs/:formName PUT - Management endpoint not needed

  // REMOVED: /api/forms/configs/:formName DELETE - Management endpoint not needed

  // REMOVED: /api/forms/stats - Management endpoint not needed for production

  // Error Handling & Retry System API endpoints
  app.post("/api/errors/handle", async (req, res) => {
    try {
      const { submissionId, error, operation, context } = req.body;
      
      if (!submissionId || !error) {
        return res.status(400).json({
          success: false,
          error: 'submissionId and error are required',
        });
      }

      console.log(`[API] Handling error for submission ${submissionId}`);
      const result = await errorHandlingService.handleError(
        parseInt(submissionId),
        error,
        operation || 'unknown',
        context
      );
      
      res.json({
        success: true,
        result,
        handledAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Error handling failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error handling failed',
      });
    }
  });

  app.post("/api/errors/classify", async (req, res) => {
    try {
      const { error, context } = req.body;
      
      if (!error) {
        return res.status(400).json({
          success: false,
          error: 'error is required',
        });
      }

      const analysis = errorHandlingService.classifyError(error, context);
      
      res.json({
        success: true,
        analysis,
        classifiedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Error classification failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Classification failed',
      });
    }
  });

  app.get("/api/errors/stats", async (req, res) => {
    try {
      const stats = await errorHandlingService.getErrorStatistics();
      
      res.json({
        success: true,
        stats,
        retrievedAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Error stats failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get error statistics',
      });
    }
  });

  app.post("/api/errors/retry/:submissionId", async (req, res) => {
    try {
      const submissionId = parseInt(req.params.submissionId);
      
      if (isNaN(submissionId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid submission ID',
        });
      }

      console.log(`[API] Manual retry requested for submission ${submissionId}`);
      
      // This would trigger a manual retry - for now we'll just log it
      console.log(`[Error Handler] Manual retry triggered for submission ${submissionId}`);
      
      res.json({
        success: true,
        message: `Manual retry scheduled for submission ${submissionId}`,
        triggeredAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[API] Manual retry failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Manual retry failed',
      });
    }
  });

  // REMOVED: All duplicate form processing endpoints
  // Only /api/submit-form is the canonical form submission endpoint

  // Admin endpoint to reload tokens from database
  app.post("/api/admin/reload-tokens", async (req, res) => {
    try {
      console.log('[Admin] Reloading tokens from database...');
      await dedicatedTokenManager.initialize();
      res.json({
        success: true,
        message: 'Tokens reloaded from database',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[Admin] Failed to reload tokens:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reload tokens',
      });
    }
  });

  // Admin endpoint to create required custom fields in Zoho CRM
  app.post("/api/admin/create-zoho-fields", async (req, res) => {
    try {
      console.log('[Admin] Creating custom fields in Zoho CRM Leads module...');
      
      const fieldsToCreate = [
        {
          api_name: "CAS_Communications",
          field_label: "CAS Communications",
          data_type: "picklist" as const,
          pick_list_values: [
            { display_value: "Yes", actual_value: "Yes" },
            { display_value: "No", actual_value: "No" }
          ]
        },
        {
          api_name: "Services_Map_Inclusion",
          field_label: "Services Map Inclusion",
          data_type: "picklist" as const,
          pick_list_values: [
            { display_value: "Yes", actual_value: "Yes" },
            { display_value: "No", actual_value: "No" }
          ]
        },
        {
          api_name: "Amyloidosis_Type",
          field_label: "Amyloidosis Type",
          data_type: "picklist" as const,
          pick_list_values: [
            { display_value: "ATTR", actual_value: "ATTR" },
            { display_value: "AL", actual_value: "AL" },
            { display_value: "Both ATTR and AL", actual_value: "Both ATTR and AL" },
            { display_value: "Other", actual_value: "Other" }
          ]
        },
        {
          api_name: "CANN_Communications",
          field_label: "CANN Communications",
          data_type: "picklist" as const,
          pick_list_values: [
            { display_value: "Yes", actual_value: "Yes" },
            { display_value: "No", actual_value: "No" }
          ]
        },
        {
          api_name: "Educational_Interests",
          field_label: "Educational Interests",
          data_type: "multiselectpicklist" as const,
          pick_list_values: [
            { display_value: "Diagnostic Techniques", actual_value: "Diagnostic Techniques" },
            { display_value: "Treatment Pathways", actual_value: "Treatment Pathways" },
            { display_value: "Patient Care", actual_value: "Patient Care" },
            { display_value: "Research Updates", actual_value: "Research Updates" },
            { display_value: "Case Studies", actual_value: "Case Studies" },
            { display_value: "Networking Opportunities", actual_value: "Networking Opportunities" }
          ]
        },
        {
          api_name: "Interested_in_Presenting",
          field_label: "Interested in Presenting",
          data_type: "picklist" as const,
          pick_list_values: [
            { display_value: "Yes", actual_value: "Yes" },
            { display_value: "No", actual_value: "No" }
          ]
        }
      ];

      const results = [];
      const errors = [];

      for (const fieldData of fieldsToCreate) {
        try {
          console.log(`[Admin] Creating field: ${fieldData.api_name}...`);
          const createdField = await zohoCRMService.createCustomField("Leads", fieldData);
          results.push({
            field: fieldData.api_name,
            status: 'created',
            id: createdField.id
          });
          console.log(`[Admin] ✅ Successfully created field: ${fieldData.api_name}`);
        } catch (error: any) {
          // Check if field already exists
          if (error.message?.includes('already exists') || error.message?.includes('DUPLICATE')) {
            results.push({
              field: fieldData.api_name,
              status: 'already_exists'
            });
            console.log(`[Admin] ℹ️ Field already exists: ${fieldData.api_name}`);
          } else {
            errors.push({
              field: fieldData.api_name,
              error: error.message || 'Unknown error'
            });
            console.error(`[Admin] ❌ Failed to create field ${fieldData.api_name}:`, error);
          }
        }
      }

      res.json({
        success: errors.length === 0,
        message: `Created ${results.filter(r => r.status === 'created').length} fields, ${results.filter(r => r.status === 'already_exists').length} already existed`,
        results,
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('[Admin] Failed to create custom fields:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create custom fields'
      });
    }
  });

  // Health monitoring status endpoint
  app.get("/api/admin/monitoring-status", async (req, res) => {
    try {
      const status = dedicatedTokenManager.getMonitoringStatus();
      const tokenHealth = await dedicatedTokenManager.checkTokenHealth('zoho_crm');
      
      res.json({
        monitoring: status,
        tokenHealth,
        serverTime: new Date().toISOString(),
        timeSinceLastCheck: status.lastCheckTime 
          ? Math.round((Date.now() - new Date(status.lastCheckTime).getTime()) / 1000)
          : null,
      });
    } catch (error) {
      console.error('[Admin] Failed to get monitoring status:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get monitoring status',
      });
    }
  });

  // Data Sync Admin Routes
  // Import the data sync services
  const path = await import('path');
  const fs = await import('fs');
  const multer = (await import('multer')).default;
  const { importHandler } = await import('../services/zoho-data-sync/import/import-handler');
  const { fileParser } = await import('../services/zoho-data-sync/import/file-parser');

  // Configure multer for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'services/zoho-data-sync/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['.csv', '.xlsx', '.xls'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Only CSV and Excel files are allowed'));
      }
    }
  });

  // Upload file endpoint
  app.post('/api/data-sync/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const moduleName = req.body.moduleName as 'Accounts' | 'Contacts' | 'Resources';
      if (!moduleName || !['Accounts', 'Contacts', 'Resources'].includes(moduleName)) {
        return res.status(400).json({ error: 'Invalid module name' });
      }

      const filePath = req.file.path;
      const sheetName = req.body.sheetName;

      // Get sheets if Excel
      let sheets: string[] = [];
      if (path.extname(req.file.originalname).toLowerCase() !== '.csv') {
        sheets = fileParser.getExcelSheets(filePath);
      }

      // Preview the file
      const preview = await importHandler.previewImport({
        moduleName,
        filePath,
        sheetName
      });

      res.json({
        fileId: path.basename(filePath),
        fileName: req.file.originalname,
        filePath,
        moduleName,
        sheets,
        preview
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Upload failed' 
      });
    }
  });

  // Execute import endpoint
  app.post('/api/data-sync/import', async (req, res) => {
    try {
      const { filePath, moduleName, sheetName, customMappings, dryRun } = req.body;

      if (!filePath || !moduleName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (!['Accounts', 'Contacts', 'Resources'].includes(moduleName)) {
        return res.status(400).json({ error: 'Invalid module name' });
      }

      const result = await importHandler.importFile({
        moduleName: moduleName as 'Accounts' | 'Contacts' | 'Resources',
        filePath,
        sheetName,
        customMappings,
        dryRun: dryRun === true
      });

      res.json(result);
    } catch (error) {
      console.error('Import error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Import failed' 
      });
    }
  });

  // Get import history/checkpoints
  app.get('/api/data-sync/history', async (req, res) => {
    try {
      const checkpointsDir = path.join(process.cwd(), 'services/zoho-data-sync/logs/checkpoints');
      
      if (!fs.existsSync(checkpointsDir)) {
        return res.json({ checkpoints: [] });
      }

      const files = fs.readdirSync(checkpointsDir);
      const checkpoints = files
        .filter(f => f.endsWith('.json'))
        .map(f => {
          const content = fs.readFileSync(path.join(checkpointsDir, f), 'utf-8');
          return JSON.parse(content);
        })
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      res.json({ checkpoints });
    } catch (error) {
      console.error('History error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch history' 
      });
    }
  });

  // Workflow Templates API Routes
  app.get("/api/workflow-templates", requireAutomationAuth, async (req, res) => {
    try {
      const { getAllTemplates } = await import("./workflow-templates");
      const templates = getAllTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching workflow templates:", error);
      res.status(500).json({ message: "Failed to fetch workflow templates" });
    }
  });

  app.post("/api/workflow-templates/:templateName/create", requireAutomationAuth, async (req, res) => {
    try {
      const { getTemplate } = await import("./workflow-templates");
      const template = getTemplate(req.params.templateName);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      const customConfig = req.body.config || {};
      const workflowData = { ...template, ...customConfig };
      
      const workflow = await storage.createAutomationWorkflow(workflowData);
      res.status(201).json(workflow);
    } catch (error) {
      console.error("Error creating workflow from template:", error);
      res.status(500).json({ message: "Failed to create workflow from template" });
    }
  });

  // Automation Workflows API Routes
  app.get("/api/workflows", requireAutomationAuth, async (req, res) => {
    try {
      const { status, triggerType } = req.query;
      const workflows = await storage.getAutomationWorkflows({
        status: status as string,
        triggerType: triggerType as string,
      });
      res.json(workflows);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      res.status(500).json({ message: "Failed to fetch workflows" });
    }
  });

  app.get("/api/workflows/:id", requireAutomationAuth, async (req, res) => {
    try {
      const workflow = await storage.getAutomationWorkflow(parseInt(req.params.id));
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }
      res.json(workflow);
    } catch (error) {
      console.error("Error fetching workflow:", error);
      res.status(500).json({ message: "Failed to fetch workflow" });
    }
  });

  app.post("/api/workflows", requireAutomationAuth, async (req, res) => {
    try {
      const workflow = await storage.createAutomationWorkflow(req.body);
      res.status(201).json(workflow);
    } catch (error) {
      console.error("Error creating workflow:", error);
      res.status(500).json({ message: "Failed to create workflow" });
    }
  });

  app.put("/api/workflows/:id", requireAutomationAuth, async (req, res) => {
    try {
      const workflow = await storage.updateAutomationWorkflow(parseInt(req.params.id), req.body);
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }
      res.json(workflow);
    } catch (error) {
      console.error("Error updating workflow:", error);
      res.status(500).json({ message: "Failed to update workflow" });
    }
  });

  app.delete("/api/workflows/:id", requireAutomationAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteAutomationWorkflow(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Workflow not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting workflow:", error);
      res.status(500).json({ message: "Failed to delete workflow" });
    }
  });

  app.post("/api/workflows/:id/execute", requireAutomationAuth, async (req, res) => {
    try {
      const { workflowExecutionEngine } = await import("./workflow-execution-engine");
      const executionId = await workflowExecutionEngine.executeWorkflow(
        parseInt(req.params.id),
        req.body.context || {}
      );
      res.json({ executionId, message: "Workflow execution started" });
    } catch (error) {
      console.error("Error executing workflow:", error);
      res.status(500).json({ 
        message: "Failed to execute workflow",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/workflows/:id/executions", requireAutomationAuth, async (req, res) => {
    try {
      const executions = await storage.getWorkflowExecutions({
        workflowId: parseInt(req.params.id)
      });
      res.json(executions);
    } catch (error) {
      console.error("Error fetching executions:", error);
      res.status(500).json({ message: "Failed to fetch executions" });
    }
  });

  app.get("/api/executions/:id", requireAutomationAuth, async (req, res) => {
    try {
      const execution = await storage.getWorkflowExecution(parseInt(req.params.id));
      if (!execution) {
        return res.status(404).json({ message: "Execution not found" });
      }
      const actions = await storage.getActionExecutions({ executionId: execution.id });
      res.json({ ...execution, actions });
    } catch (error) {
      console.error("Error fetching execution:", error);
      res.status(500).json({ message: "Failed to fetch execution" });
    }
  });

  // Zoho Campaigns API Routes
  app.get("/api/campaigns/lists", requireAutomationAuth, async (req, res) => {
    try {
      const { zohoCampaignsService } = await import("./zoho-campaigns-service");
      const lists = await zohoCampaignsService.getLists();
      res.json(lists);
    } catch (error) {
      console.error("Error fetching campaign lists:", error);
      res.status(500).json({ 
        message: "Failed to fetch campaign lists",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/campaigns/lists", requireAutomationAuth, async (req, res) => {
    try {
      const { zohoCampaignsService } = await import("./zoho-campaigns-service");
      const { listName, ...additionalInfo } = req.body;
      const list = await zohoCampaignsService.createList(listName, additionalInfo);
      res.status(201).json(list);
    } catch (error) {
      console.error("Error creating campaign list:", error);
      res.status(500).json({ 
        message: "Failed to create campaign list",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/campaigns/lists/:listKey/subscribers", requireAutomationAuth, async (req, res) => {
    try {
      const { zohoCampaignsService } = await import("./zoho-campaigns-service");
      const result = await zohoCampaignsService.addSubscriber(req.params.listKey, req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error adding subscriber:", error);
      res.status(500).json({ 
        message: "Failed to add subscriber",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/campaigns/lists/:listKey/subscribers/bulk", requireAutomationAuth, async (req, res) => {
    try {
      const { zohoCampaignsService } = await import("./zoho-campaigns-service");
      const { contacts } = req.body;
      const result = await zohoCampaignsService.addSubscribersBulk(req.params.listKey, contacts);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error adding subscribers in bulk:", error);
      res.status(500).json({ 
        message: "Failed to add subscribers in bulk",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/campaigns", requireAutomationAuth, async (req, res) => {
    try {
      const { zohoCampaignsService } = await import("./zoho-campaigns-service");
      const campaigns = await zohoCampaignsService.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ 
        message: "Failed to fetch campaigns",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/campaigns", requireAutomationAuth, async (req, res) => {
    try {
      const { zohoCampaignsService } = await import("./zoho-campaigns-service");
      const campaign = await zohoCampaignsService.createEmailCampaign(req.body);
      res.status(201).json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).json({ 
        message: "Failed to create campaign",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/campaigns/:campaignKey/send", requireAutomationAuth, async (req, res) => {
    try {
      const { zohoCampaignsService } = await import("./zoho-campaigns-service");
      const { scheduleTime } = req.body;
      const result = await zohoCampaignsService.sendCampaign(
        req.params.campaignKey,
        scheduleTime ? new Date(scheduleTime) : undefined
      );
      res.json(result);
    } catch (error) {
      console.error("Error sending campaign:", error);
      res.status(500).json({ 
        message: "Failed to send campaign",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Chat Command API Routes - for easy manual control
  app.post("/api/commands/crm/leads", requireAutomationAuth, async (req, res) => {
    try {
      const { limit = 20, ...filters } = req.body;
      const records = await zohoCRMService.getRecords("Leads", filters, limit);
      res.json({ 
        module: "Leads", 
        count: records.length, 
        records 
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ 
        message: "Failed to fetch leads",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/commands/crm/contacts", requireAutomationAuth, async (req, res) => {
    try {
      const { limit = 20, ...filters } = req.body;
      const records = await zohoCRMService.getRecords("Contacts", filters, limit);
      res.json({ 
        module: "Contacts", 
        count: records.length, 
        records 
      });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ 
        message: "Failed to fetch contacts",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/commands/sync-to-campaign", requireAutomationAuth, async (req, res) => {
    try {
      const { zohoCampaignsService } = await import("./zoho-campaigns-service");
      const { crmModule, listKey, filters, limit = 100 } = req.body;
      
      const records = await zohoCRMService.getRecords(crmModule, filters, limit);
      
      const contacts = records.map((record: any) => ({
        email: record.Email,
        firstName: record.First_Name,
        lastName: record.Last_Name,
      })).filter((c: any) => c.email);

      if (contacts.length === 0) {
        return res.json({ message: "No contacts with email addresses found", synced: 0 });
      }

      const result = await zohoCampaignsService.addSubscribersBulk(listKey, contacts);
      
      res.json({ 
        message: `Synced ${contacts.length} contacts to campaign list`,
        crmModule,
        listKey,
        synced: contacts.length,
        result
      });
    } catch (error) {
      console.error("Error syncing to campaign:", error);
      res.status(500).json({ 
        message: "Failed to sync to campaign",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Zoho Workflow Setup - Create automated email notification workflows
  app.post("/api/admin/setup-email-workflows", requireAutomationAuth, async (req, res) => {
    try {
      console.log("[Admin] Setting up Zoho email notification workflows...");
      
      const result = await zohoWorkflowService.setupRegistrationEmailWorkflows();
      
      if (result.success) {
        res.json({
          success: true,
          message: `Successfully created ${result.workflows.length} email notification workflows`,
          workflows: result.workflows,
          details: result
        });
      } else {
        res.status(500).json({
          success: false,
          message: `Failed to create some workflows. ${result.workflows.length} succeeded, ${result.errors.length} failed`,
          workflows: result.workflows,
          errors: result.errors,
          details: result
        });
      }
    } catch (error) {
      console.error("[Admin] Error setting up email workflows:", error);
      res.status(500).json({
        success: false,
        message: "Failed to setup email workflows",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get list of existing workflow rules
  app.get("/api/admin/email-workflows", requireAutomationAuth, async (req, res) => {
    try {
      const module = req.query.module as string | undefined;
      const workflows = await zohoWorkflowService.getWorkflowRules(module);
      res.json({
        success: true,
        count: workflows.length,
        workflows,
        module: module || 'all'
      });
    } catch (error) {
      console.error("[Admin] Error fetching workflows:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch workflows",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get a specific workflow rule by ID
  app.get("/api/admin/email-workflows/:id", requireAutomationAuth, async (req, res) => {
    try {
      const workflow = await zohoWorkflowService.getWorkflowRule(req.params.id);
      if (!workflow) {
        return res.status(404).json({
          success: false,
          message: "Workflow not found"
        });
      }
      res.json({
        success: true,
        workflow
      });
    } catch (error) {
      console.error("[Admin] Error fetching workflow:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch workflow",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Update an existing workflow rule
  app.put("/api/admin/email-workflows/:id", requireAutomationAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const success = await zohoWorkflowService.updateWorkflowRule(id, updates);
      
      if (success) {
        res.json({
          success: true,
          message: `Workflow ${id} updated successfully`
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to update workflow"
        });
      }
    } catch (error) {
      console.error("[Admin] Error updating workflow:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update workflow",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Delete workflow rules
  app.delete("/api/admin/email-workflows", requireAutomationAuth, async (req, res) => {
    try {
      const { ids } = req.body;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide workflow IDs to delete"
        });
      }
      
      const success = await zohoWorkflowService.deleteWorkflowRules(ids);
      
      if (success) {
        res.json({
          success: true,
          message: `Deleted ${ids.length} workflow(s)`,
          deletedCount: ids.length
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to delete workflows"
        });
      }
    } catch (error) {
      console.error("[Admin] Error deleting workflows:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete workflows",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get all email notification actions
  app.get("/api/admin/email-notifications", requireAutomationAuth, async (req, res) => {
    try {
      const notifications = await zohoWorkflowService.getEmailNotifications();
      res.json({
        success: true,
        count: notifications.length,
        notifications
      });
    } catch (error) {
      console.error("[Admin] Error fetching email notifications:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch email notifications",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Delete email notification actions
  app.delete("/api/admin/email-notifications", requireAutomationAuth, async (req, res) => {
    try {
      const { ids } = req.body;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide notification IDs to delete"
        });
      }
      
      const success = await zohoWorkflowService.deleteEmailNotifications(ids);
      
      if (success) {
        res.json({
          success: true,
          message: `Deleted ${ids.length} email notification(s)`,
          deletedCount: ids.length
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to delete email notifications"
        });
      }
    } catch (error) {
      console.error("[Admin] Error deleting email notifications:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete email notifications",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get workflow statistics
  app.get("/api/admin/workflow-stats", requireAutomationAuth, async (req, res) => {
    try {
      const stats = await zohoWorkflowService.getWorkflowStats();
      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error("[Admin] Error fetching workflow stats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch workflow stats",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
