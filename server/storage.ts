import {
  users,
  resources,
  type User,
  type InsertUser,
  type Resource,
  type InsertResource,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, desc } from "drizzle-orm";

export interface ResourceFilters {
  amyloidosisType?: string;
  resourceType?: string;
  category?: string;
  audience?: string;
  language?: string;
  region?: string;
  isPublic?: boolean;
  isApproved?: boolean;
  search?: string;
}

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Resource operations
  getResources(filters?: ResourceFilters): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: number, updates: Partial<InsertResource>): Promise<Resource | undefined>;
  deleteResource(id: number): Promise<boolean>;
  incrementDownloadCount(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Resource operations
  async getResources(filters?: ResourceFilters): Promise<Resource[]> {
    const conditions = [];
    
    if (filters) {
      if (filters.amyloidosisType) {
        conditions.push(eq(resources.amyloidosisType, filters.amyloidosisType));
      }
      if (filters.resourceType) {
        conditions.push(eq(resources.resourceType, filters.resourceType));
      }
      if (filters.category) {
        conditions.push(eq(resources.category, filters.category));
      }
      if (filters.audience) {
        conditions.push(eq(resources.audience, filters.audience));
      }
      if (filters.language) {
        conditions.push(eq(resources.language, filters.language));
      }
      if (filters.region) {
        conditions.push(eq(resources.region, filters.region));
      }
      if (filters.isPublic !== undefined) {
        conditions.push(eq(resources.isPublic, filters.isPublic));
      }
      if (filters.isApproved !== undefined) {
        conditions.push(eq(resources.isApproved, filters.isApproved));
      }
      if (filters.search) {
        conditions.push(like(resources.title, `%${filters.search}%`));
      }
    }

    let query = db.select().from(resources);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(resources.createdAt));
  }

  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource || undefined;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db
      .insert(resources)
      .values(resource)
      .returning();
    return newResource;
  }

  async updateResource(id: number, updates: Partial<InsertResource>): Promise<Resource | undefined> {
    const [updatedResource] = await db
      .update(resources)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(resources.id, id))
      .returning();
    return updatedResource || undefined;
  }

  async deleteResource(id: number): Promise<boolean> {
    const result = await db.delete(resources).where(eq(resources.id, id));
    return (result.rowCount || 0) > 0;
  }

  async incrementDownloadCount(id: number): Promise<void> {
    const [current] = await db.select().from(resources).where(eq(resources.id, id));
    if (current) {
      await db
        .update(resources)
        .set({ 
          downloadCount: (current.downloadCount || 0) + 1
        })
        .where(eq(resources.id, id));
    }
  }
}

export const storage = new DatabaseStorage();
