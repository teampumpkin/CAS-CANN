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

  const httpServer = createServer(app);
  return httpServer;
}
