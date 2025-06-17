import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, type ResourceFilters } from "./storage";
import { insertResourceSchema } from "@shared/schema";
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

  // Membership application API route
  app.post("/api/membership", async (req, res) => {
    try {
      const membershipSchema = z.object({
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        email: z.string().email(),
        phone: z.string().min(10),
        address: z.string().min(5),
        city: z.string().min(2),
        province: z.string().min(2),
        postalCode: z.string().min(6),
        membershipType: z.enum(["individual", "family", "professional", "corporate", "student"]),
        interests: z.array(z.string()).min(1),
        experience: z.enum(["patient", "caregiver", "healthcare", "researcher", "advocate", "other"]),
        howHeard: z.string().min(1),
        additionalInfo: z.string().optional(),
        newsletter: z.boolean().default(true),
        terms: z.boolean().refine(val => val === true, {
          message: 'Terms and conditions must be accepted'
        })
      });

      const validatedData = membershipSchema.parse(req.body);
      
      console.log("Membership application received:", {
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        email: validatedData.email,
        membershipType: validatedData.membershipType,
        interests: validatedData.interests,
        timestamp: new Date().toISOString()
      });

      res.status(200).json({ 
        message: "Membership application submitted successfully",
        membershipId: `CAS-${Date.now()}`
      });
    } catch (error) {
      console.error("Membership application error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors.map(e => e.message) 
        });
      }
      res.status(500).json({ message: "Failed to process membership application" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
