import {
  users,
  resources,
  formSubmissions,
  submissionLogs,
  fieldMappings,
  formConfigurations,
  type User,
  type InsertUser,
  type Resource,
  type InsertResource,
  type FormSubmission,
  type InsertFormSubmission,
  type SubmissionLog,
  type InsertSubmissionLog,
  type FieldMapping,
  type InsertFieldMapping,
  type FormConfiguration,
  type InsertFormConfiguration,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, desc, gte, lte } from "drizzle-orm";

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

export interface FormSubmissionFilters {
  formName?: string;
  processingStatus?: string;
  syncStatus?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface SubmissionLogFilters {
  submissionId?: number;
  operation?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface FieldMappingFilters {
  fieldType?: string;
  isCustomField?: boolean;
  isRequired?: boolean;
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

  // Form submission operations
  getFormSubmissions(filters?: FormSubmissionFilters): Promise<FormSubmission[]>;
  getFormSubmission(id: number): Promise<FormSubmission | undefined>;
  createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission>;
  updateFormSubmission(id: number, updates: Partial<FormSubmission>): Promise<FormSubmission | undefined>;
  deleteFormSubmission(id: number): Promise<boolean>;
  getFormSubmissionsByStatus(processingStatus: string, syncStatus: string): Promise<FormSubmission[]>;
  incrementRetryCount(id: number): Promise<void>;

  // Submission log operations  
  getSubmissionLogs(filters?: SubmissionLogFilters): Promise<SubmissionLog[]>;
  createSubmissionLog(log: InsertSubmissionLog): Promise<SubmissionLog>;
  getLogsBySubmissionId(submissionId: number): Promise<SubmissionLog[]>;

  // Field mapping operations
  getFieldMappings(filters?: FieldMappingFilters): Promise<FieldMapping[]>;
  getFieldMapping(fieldName: string): Promise<FieldMapping | undefined>;
  createFieldMapping(mapping: InsertFieldMapping): Promise<FieldMapping>;
  updateFieldMapping(id: number, updates: Partial<FieldMapping>): Promise<FieldMapping | undefined>;
  deleteFieldMapping(id: number): Promise<boolean>;
  updateFieldMappingSyncTime(id: number): Promise<void>;

  // Form configuration operations
  getFormConfigurations(): Promise<FormConfiguration[]>;
  getFormConfiguration(formName: string): Promise<FormConfiguration | undefined>;
  createFormConfiguration(config: InsertFormConfiguration): Promise<FormConfiguration>;
  updateFormConfiguration(id: number, updates: Partial<FormConfiguration>): Promise<FormConfiguration | undefined>;
  deleteFormConfiguration(id: number): Promise<boolean>;

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
      query = query.where(and(...conditions)) as any;
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

  // Form submission operations
  async getFormSubmissions(filters?: FormSubmissionFilters): Promise<FormSubmission[]> {
    const conditions = [];
    
    if (filters) {
      if (filters.formName) {
        conditions.push(eq(formSubmissions.formName, filters.formName));
      }
      if (filters.zohoModule) {
        conditions.push(eq(formSubmissions.zohoModule, filters.zohoModule));
      }
      if (filters.processingStatus) {
        conditions.push(eq(formSubmissions.processingStatus, filters.processingStatus as any));
      }
      if (filters.syncStatus) {
        conditions.push(eq(formSubmissions.syncStatus, filters.syncStatus as any));
      }
      if (filters.zohoCrmId) {
        conditions.push(eq(formSubmissions.zohoCrmId, filters.zohoCrmId));
      }
      if (filters.dateFrom) {
        conditions.push(gte(formSubmissions.createdAt, filters.dateFrom));
      }
      if (filters.dateTo) {
        conditions.push(lte(formSubmissions.createdAt, filters.dateTo));
      }
    }

    let query = db.select().from(formSubmissions);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return await query.orderBy(desc(formSubmissions.createdAt));
  }

  async getFormSubmission(id: number): Promise<FormSubmission | undefined> {
    const [submission] = await db.select().from(formSubmissions).where(eq(formSubmissions.id, id));
    return submission || undefined;
  }

  async createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission> {
    const [newSubmission] = await db
      .insert(formSubmissions)
      .values(submission)
      .returning();
    return newSubmission;
  }

  async updateFormSubmission(id: number, updates: Partial<FormSubmission>): Promise<FormSubmission | undefined> {
    const [updatedSubmission] = await db
      .update(formSubmissions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(formSubmissions.id, id))
      .returning();
    return updatedSubmission || undefined;
  }

  async deleteFormSubmission(id: number): Promise<boolean> {
    const result = await db.delete(formSubmissions).where(eq(formSubmissions.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getFormSubmissionsByStatus(processingStatus: string, syncStatus: string): Promise<FormSubmission[]> {
    return await db
      .select()
      .from(formSubmissions)
      .where(
        and(
          eq(formSubmissions.processingStatus, processingStatus as any),
          eq(formSubmissions.syncStatus, syncStatus as any)
        )
      )
      .orderBy(desc(formSubmissions.createdAt));
  }

  async incrementRetryCount(id: number): Promise<void> {
    const [current] = await db.select().from(formSubmissions).where(eq(formSubmissions.id, id));
    if (current) {
      await db
        .update(formSubmissions)
        .set({ 
          retryCount: current.retryCount + 1,
          lastRetryAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(formSubmissions.id, id));
    }
  }

  // Submission log operations
  async getSubmissionLogs(filters?: SubmissionLogFilters): Promise<SubmissionLog[]> {
    const conditions = [];
    
    if (filters) {
      if (filters.submissionId) {
        conditions.push(eq(submissionLogs.submissionId, filters.submissionId));
      }
      if (filters.operation) {
        conditions.push(eq(submissionLogs.operation, filters.operation as any));
      }
      if (filters.status) {
        conditions.push(eq(submissionLogs.status, filters.status as any));
      }
      if (filters.dateFrom) {
        conditions.push(gte(submissionLogs.createdAt, filters.dateFrom));
      }
      if (filters.dateTo) {
        conditions.push(lte(submissionLogs.createdAt, filters.dateTo));
      }
    }

    let query = db.select().from(submissionLogs);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return await query.orderBy(desc(submissionLogs.createdAt));
  }

  async createSubmissionLog(log: InsertSubmissionLog): Promise<SubmissionLog> {
    const [newLog] = await db
      .insert(submissionLogs)
      .values(log)
      .returning();
    return newLog;
  }

  async getLogsBySubmissionId(submissionId: number): Promise<SubmissionLog[]> {
    return await db
      .select()
      .from(submissionLogs)
      .where(eq(submissionLogs.submissionId, submissionId))
      .orderBy(desc(submissionLogs.createdAt));
  }

  // Field mapping operations
  async getFieldMappings(filters?: FieldMappingFilters): Promise<FieldMapping[]> {
    const conditions = [];
    
    if (filters) {
      if (filters.zohoModule) {
        conditions.push(eq(fieldMappings.zohoModule, filters.zohoModule));
      }
      if (filters.fieldType) {
        conditions.push(eq(fieldMappings.fieldType, filters.fieldType));
      }
      if (filters.isCustomField !== undefined) {
        conditions.push(eq(fieldMappings.isCustomField, filters.isCustomField));
      }
      if (filters.isRequired !== undefined) {
        conditions.push(eq(fieldMappings.isRequired, filters.isRequired));
      }
    }

    let query = db.select().from(fieldMappings);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return await query.orderBy(desc(fieldMappings.createdAt));
  }

  async getFieldMapping(zohoModule: string, fieldName: string): Promise<FieldMapping | undefined> {
    const [mapping] = await db
      .select()
      .from(fieldMappings)
      .where(
        and(
          eq(fieldMappings.zohoModule, zohoModule),
          eq(fieldMappings.fieldName, fieldName)
        )
      );
    return mapping || undefined;
  }

  async createFieldMapping(mapping: InsertFieldMapping): Promise<FieldMapping> {
    const [newMapping] = await db
      .insert(fieldMappings)
      .values(mapping)
      .returning();
    return newMapping;
  }

  async updateFieldMapping(id: number, updates: Partial<FieldMapping>): Promise<FieldMapping | undefined> {
    const [updatedMapping] = await db
      .update(fieldMappings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(fieldMappings.id, id))
      .returning();
    return updatedMapping || undefined;
  }

  async deleteFieldMapping(id: number): Promise<boolean> {
    const result = await db.delete(fieldMappings).where(eq(fieldMappings.id, id));
    return (result.rowCount || 0) > 0;
  }

  async updateFieldMappingSyncTime(id: number): Promise<void> {
    await db
      .update(fieldMappings)
      .set({ 
        lastSyncedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(fieldMappings.id, id));
  }

  // Form configuration operations
  async getFormConfigurations(): Promise<FormConfiguration[]> {
    return await db
      .select()
      .from(formConfigurations)
      .orderBy(desc(formConfigurations.createdAt));
  }

  async getFormConfiguration(formName: string): Promise<FormConfiguration | undefined> {
    const [config] = await db
      .select()
      .from(formConfigurations)
      .where(eq(formConfigurations.formName, formName));
    return config || undefined;
  }

  async createFormConfiguration(config: InsertFormConfiguration): Promise<FormConfiguration> {
    const [newConfig] = await db
      .insert(formConfigurations)
      .values(config)
      .returning();
    return newConfig;
  }

  async updateFormConfiguration(id: number, updates: Partial<FormConfiguration>): Promise<FormConfiguration | undefined> {
    const [updatedConfig] = await db
      .update(formConfigurations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(formConfigurations.id, id))
      .returning();
    return updatedConfig || undefined;
  }

  async deleteFormConfiguration(id: number): Promise<boolean> {
    const result = await db.delete(formConfigurations).where(eq(formConfigurations.id, id));
    return (result.rowCount || 0) > 0;
  }

  // OAuth token operations
  async getOAuthTokens(filters?: { provider?: string; isActive?: boolean }): Promise<OAuthToken[]> {
    const conditions = [];
    
    if (filters) {
      if (filters.provider) {
        conditions.push(eq(oauthTokens.provider, filters.provider));
      }
      if (filters.isActive !== undefined) {
        conditions.push(eq(oauthTokens.isActive, filters.isActive));
      }
    }

    return await db
      .select()
      .from(oauthTokens)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(oauthTokens.createdAt));
  }

  async getOAuthToken(id: number): Promise<OAuthToken | undefined> {
    const [token] = await db
      .select()
      .from(oauthTokens)
      .where(eq(oauthTokens.id, id));
    return token || undefined;
  }

  async createOAuthToken(token: InsertOAuthToken): Promise<OAuthToken> {
    const [newToken] = await db
      .insert(oauthTokens)
      .values(token)
      .returning();
    return newToken;
  }

  async updateOAuthToken(id: number, updates: Partial<OAuthToken>): Promise<OAuthToken | undefined> {
    const [updatedToken] = await db
      .update(oauthTokens)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(oauthTokens.id, id))
      .returning();
    return updatedToken || undefined;
  }

  async deleteOAuthToken(id: number): Promise<boolean> {
    const result = await db.delete(oauthTokens).where(eq(oauthTokens.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
