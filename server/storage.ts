import {
  users,
  resources,
  formSubmissions,
  submissionLogs,
  fieldMappings,
  formConfigurations,
  oauthTokens,
  fieldMetadataCache,
  automationWorkflows,
  workflowExecutions,
  actionExecutions,
  campaignSyncs,
  members,
  passwordResets,
  memberEvents,
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
  type OAuthToken,
  type InsertOAuthToken,
  type FieldMetadataCache,
  type InsertFieldMetadataCache,
  type AutomationWorkflow,
  type InsertAutomationWorkflow,
  type WorkflowExecution,
  type InsertWorkflowExecution,
  type ActionExecution,
  type InsertActionExecution,
  type CampaignSync,
  type InsertCampaignSync,
  type Member,
  type InsertMember,
  type PasswordReset,
  type InsertPasswordReset,
  type MemberEvent,
  type InsertMemberEvent,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, desc, gte, lte, notInArray, isNull, or } from "drizzle-orm";

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
  zohoModule?: string;
  processingStatus?: string;
  syncStatus?: string;
  zohoCrmId?: string;
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
  zohoModule?: string;
  fieldType?: string;
  isCustomField?: boolean;
  isRequired?: boolean;
}

export interface FieldMetadataCacheFilters {
  zohoModule?: string;
  isCustomField?: boolean;
  isRequired?: boolean;
  lastSyncedBefore?: Date;
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
  getFieldMapping(zohoModule: string, fieldName: string): Promise<FieldMapping | undefined>;
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

  // OAuth token operations
  getOAuthTokens(filters?: { provider?: string; isActive?: boolean }): Promise<OAuthToken[]>;
  getOAuthToken(id: number): Promise<OAuthToken | undefined>;
  createOAuthToken(token: InsertOAuthToken): Promise<OAuthToken>;
  updateOAuthToken(id: number, updates: Partial<OAuthToken>): Promise<OAuthToken | undefined>;
  deleteOAuthToken(id: number): Promise<boolean>;

  // Field metadata cache operations
  getFieldMetadataCache(filters?: FieldMetadataCacheFilters): Promise<FieldMetadataCache[]>;
  getFieldMetadata(zohoModule: string, fieldApiName: string): Promise<FieldMetadataCache | undefined>;
  createFieldMetadata(metadata: InsertFieldMetadataCache): Promise<FieldMetadataCache>;
  updateFieldMetadata(id: number, updates: Partial<FieldMetadataCache>): Promise<FieldMetadataCache | undefined>;
  upsertFieldMetadata(metadata: InsertFieldMetadataCache): Promise<FieldMetadataCache>;
  deleteFieldMetadata(id: number): Promise<boolean>;
  deleteStaleFieldMetadata(zohoModule: string, keepFieldNames: string[]): Promise<number>;
  refreshFieldMetadataSync(zohoModule: string): Promise<void>;

  // Automation workflow operations
  getAutomationWorkflows(filters?: { status?: string; triggerType?: string }): Promise<AutomationWorkflow[]>;
  getAutomationWorkflow(id: number): Promise<AutomationWorkflow | undefined>;
  createAutomationWorkflow(workflow: InsertAutomationWorkflow): Promise<AutomationWorkflow>;
  updateAutomationWorkflow(id: number, updates: Partial<AutomationWorkflow>): Promise<AutomationWorkflow | undefined>;
  deleteAutomationWorkflow(id: number): Promise<boolean>;
  incrementExecutionCount(id: number): Promise<void>;

  // Workflow execution operations
  getWorkflowExecutions(filters?: { workflowId?: number; status?: string }): Promise<WorkflowExecution[]>;
  getWorkflowExecution(id: number): Promise<WorkflowExecution | undefined>;
  createWorkflowExecution(execution: InsertWorkflowExecution): Promise<WorkflowExecution>;
  updateWorkflowExecution(id: number, updates: Partial<WorkflowExecution>): Promise<WorkflowExecution | undefined>;
  deleteWorkflowExecution(id: number): Promise<boolean>;

  // Action execution operations
  getActionExecutions(filters?: { executionId?: number; status?: string }): Promise<ActionExecution[]>;
  getActionExecution(id: number): Promise<ActionExecution | undefined>;
  createActionExecution(action: InsertActionExecution): Promise<ActionExecution>;
  updateActionExecution(id: number, updates: Partial<ActionExecution>): Promise<ActionExecution | undefined>;
  deleteActionExecution(id: number): Promise<boolean>;

  // Campaign sync operations
  getCampaignSyncs(filters?: { zohoCampaignId?: string }): Promise<CampaignSync[]>;
  getCampaignSync(id: number): Promise<CampaignSync | undefined>;
  createCampaignSync(sync: InsertCampaignSync): Promise<CampaignSync>;
  updateCampaignSync(id: number, updates: Partial<CampaignSync>): Promise<CampaignSync | undefined>;
  deleteCampaignSync(id: number): Promise<boolean>;

  // Member operations
  getMember(id: number): Promise<Member | undefined>;
  getMemberByEmail(email: string): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: number, updates: Partial<Member>): Promise<Member | undefined>;
  updateMemberLastLogin(id: number): Promise<void>;
  updateMemberPassword(id: number, passwordHash: string): Promise<void>;
  deleteMember(id: number): Promise<boolean>;
  getMembers(filters?: { status?: string; role?: string }): Promise<Member[]>;

  // Password reset operations
  createPasswordReset(reset: InsertPasswordReset): Promise<PasswordReset>;
  getPasswordResetByEmail(email: string): Promise<PasswordReset | undefined>;
  getActivePasswordReset(email: string): Promise<PasswordReset | undefined>;
  incrementPasswordResetAttempts(id: number): Promise<void>;
  markPasswordResetUsed(id: number): Promise<void>;
  deleteExpiredPasswordResets(): Promise<number>;

  // Member events operations
  getMemberEvents(filters?: { accessLevel?: string; isPublished?: boolean; hasRecording?: boolean }): Promise<MemberEvent[]>;
  getMemberEvent(id: number): Promise<MemberEvent | undefined>;
  createMemberEvent(event: InsertMemberEvent): Promise<MemberEvent>;
  updateMemberEvent(id: number, updates: Partial<MemberEvent>): Promise<MemberEvent | undefined>;
  deleteMemberEvent(id: number): Promise<boolean>;
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
    // Get pending submissions that are ready to retry (nextRetryAt is null or in the past)
    return await db
      .select()
      .from(formSubmissions)
      .where(
        and(
          eq(formSubmissions.processingStatus, processingStatus as any),
          eq(formSubmissions.syncStatus, syncStatus as any),
          or(
            isNull(formSubmissions.nextRetryAt),
            lte(formSubmissions.nextRetryAt, new Date())
          )
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

  // Field metadata cache operations
  async getFieldMetadataCache(filters?: FieldMetadataCacheFilters): Promise<FieldMetadataCache[]> {
    const conditions = [];

    if (filters?.zohoModule) {
      conditions.push(eq(fieldMetadataCache.zohoModule, filters.zohoModule));
    }
    if (filters?.isCustomField !== undefined) {
      conditions.push(eq(fieldMetadataCache.isCustomField, filters.isCustomField));
    }
    if (filters?.isRequired !== undefined) {
      conditions.push(eq(fieldMetadataCache.isRequired, filters.isRequired));
    }
    if (filters?.lastSyncedBefore) {
      conditions.push(lte(fieldMetadataCache.lastSynced, filters.lastSyncedBefore));
    }

    return await db
      .select()
      .from(fieldMetadataCache)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(fieldMetadataCache.lastSynced));
  }

  async getFieldMetadata(zohoModule: string, fieldApiName: string): Promise<FieldMetadataCache | undefined> {
    const [metadata] = await db
      .select()
      .from(fieldMetadataCache)
      .where(and(
        eq(fieldMetadataCache.zohoModule, zohoModule),
        eq(fieldMetadataCache.fieldApiName, fieldApiName)
      ));
    return metadata || undefined;
  }

  async createFieldMetadata(metadata: InsertFieldMetadataCache): Promise<FieldMetadataCache> {
    const [created] = await db.insert(fieldMetadataCache).values(metadata).returning();
    return created;
  }

  async updateFieldMetadata(id: number, updates: Partial<FieldMetadataCache>): Promise<FieldMetadataCache | undefined> {
    const [updated] = await db
      .update(fieldMetadataCache)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(fieldMetadataCache.id, id))
      .returning();
    return updated || undefined;
  }

  async upsertFieldMetadata(metadata: InsertFieldMetadataCache): Promise<FieldMetadataCache> {
    // Try to find existing metadata
    const existing = await this.getFieldMetadata(metadata.zohoModule, metadata.fieldApiName);
    
    if (existing) {
      // Update existing record
      const updated = await this.updateFieldMetadata(existing.id, {
        fieldLabel: metadata.fieldLabel,
        dataType: metadata.dataType,
        isCustomField: metadata.isCustomField,
        isRequired: metadata.isRequired,
        maxLength: metadata.maxLength,
        picklistValues: metadata.picklistValues,
        fieldMetadata: metadata.fieldMetadata,
        lastSynced: new Date(),
      });
      return updated!;
    } else {
      // Create new record
      return await this.createFieldMetadata({
        ...metadata,
        lastSynced: new Date(),
      });
    }
  }

  async deleteFieldMetadata(id: number): Promise<boolean> {
    const result = await db.delete(fieldMetadataCache).where(eq(fieldMetadataCache.id, id));
    return (result.rowCount || 0) > 0;
  }

  async deleteStaleFieldMetadata(zohoModule: string, keepFieldNames: string[]): Promise<number> {
    if (keepFieldNames.length === 0) {
      // Delete all metadata for this module if no fields to keep
      const result = await db
        .delete(fieldMetadataCache)
        .where(eq(fieldMetadataCache.zohoModule, zohoModule));
      return result.rowCount || 0;
    }

    // Use notInArray for proper SQL generation
    
    // Delete metadata not in the keepFieldNames list
    const result = await db
      .delete(fieldMetadataCache)
      .where(and(
        eq(fieldMetadataCache.zohoModule, zohoModule),
        notInArray(fieldMetadataCache.fieldApiName, keepFieldNames)
      ));
    
    return result.rowCount || 0;
  }

  async refreshFieldMetadataSync(zohoModule: string): Promise<void> {
    await db
      .update(fieldMetadataCache)
      .set({ lastSynced: new Date(), updatedAt: new Date() })
      .where(eq(fieldMetadataCache.zohoModule, zohoModule));
  }

  // Automation workflow operations
  async getAutomationWorkflows(filters?: { status?: string; triggerType?: string }): Promise<AutomationWorkflow[]> {
    const conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(automationWorkflows.status, filters.status as any));
    }
    if (filters?.triggerType) {
      conditions.push(eq(automationWorkflows.triggerType, filters.triggerType as any));
    }

    return await db
      .select()
      .from(automationWorkflows)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(automationWorkflows.createdAt));
  }

  async getAutomationWorkflow(id: number): Promise<AutomationWorkflow | undefined> {
    const [workflow] = await db.select().from(automationWorkflows).where(eq(automationWorkflows.id, id));
    return workflow || undefined;
  }

  async createAutomationWorkflow(workflow: InsertAutomationWorkflow): Promise<AutomationWorkflow> {
    const [created] = await db.insert(automationWorkflows).values(workflow).returning();
    return created;
  }

  async updateAutomationWorkflow(id: number, updates: Partial<AutomationWorkflow>): Promise<AutomationWorkflow | undefined> {
    const [updated] = await db
      .update(automationWorkflows)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(automationWorkflows.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteAutomationWorkflow(id: number): Promise<boolean> {
    const result = await db.delete(automationWorkflows).where(eq(automationWorkflows.id, id));
    return (result.rowCount || 0) > 0;
  }

  async incrementExecutionCount(id: number): Promise<void> {
    const [current] = await db.select().from(automationWorkflows).where(eq(automationWorkflows.id, id));
    if (current) {
      await db
        .update(automationWorkflows)
        .set({
          executionCount: current.executionCount + 1,
          lastExecutedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(automationWorkflows.id, id));
    }
  }

  // Workflow execution operations
  async getWorkflowExecutions(filters?: { workflowId?: number; status?: string }): Promise<WorkflowExecution[]> {
    const conditions = [];
    
    if (filters?.workflowId) {
      conditions.push(eq(workflowExecutions.workflowId, filters.workflowId));
    }
    if (filters?.status) {
      conditions.push(eq(workflowExecutions.status, filters.status as any));
    }

    return await db
      .select()
      .from(workflowExecutions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(workflowExecutions.startedAt));
  }

  async getWorkflowExecution(id: number): Promise<WorkflowExecution | undefined> {
    const [execution] = await db.select().from(workflowExecutions).where(eq(workflowExecutions.id, id));
    return execution || undefined;
  }

  async createWorkflowExecution(execution: InsertWorkflowExecution): Promise<WorkflowExecution> {
    const [created] = await db.insert(workflowExecutions).values(execution).returning();
    return created;
  }

  async updateWorkflowExecution(id: number, updates: Partial<WorkflowExecution>): Promise<WorkflowExecution | undefined> {
    const [updated] = await db
      .update(workflowExecutions)
      .set(updates)
      .where(eq(workflowExecutions.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteWorkflowExecution(id: number): Promise<boolean> {
    const result = await db.delete(workflowExecutions).where(eq(workflowExecutions.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Action execution operations
  async getActionExecutions(filters?: { executionId?: number; status?: string }): Promise<ActionExecution[]> {
    const conditions = [];
    
    if (filters?.executionId) {
      conditions.push(eq(actionExecutions.executionId, filters.executionId));
    }
    if (filters?.status) {
      conditions.push(eq(actionExecutions.status, filters.status as any));
    }

    return await db
      .select()
      .from(actionExecutions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(actionExecutions.startedAt));
  }

  async getActionExecution(id: number): Promise<ActionExecution | undefined> {
    const [action] = await db.select().from(actionExecutions).where(eq(actionExecutions.id, id));
    return action || undefined;
  }

  async createActionExecution(action: InsertActionExecution): Promise<ActionExecution> {
    const [created] = await db.insert(actionExecutions).values(action).returning();
    return created;
  }

  async updateActionExecution(id: number, updates: Partial<ActionExecution>): Promise<ActionExecution | undefined> {
    const [updated] = await db
      .update(actionExecutions)
      .set(updates)
      .where(eq(actionExecutions.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteActionExecution(id: number): Promise<boolean> {
    const result = await db.delete(actionExecutions).where(eq(actionExecutions.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Campaign sync operations
  async getCampaignSyncs(filters?: { zohoCampaignId?: string }): Promise<CampaignSync[]> {
    const conditions = [];
    
    if (filters?.zohoCampaignId) {
      conditions.push(eq(campaignSyncs.zohoCampaignId, filters.zohoCampaignId));
    }

    return await db
      .select()
      .from(campaignSyncs)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(campaignSyncs.lastSyncedAt));
  }

  async getCampaignSync(id: number): Promise<CampaignSync | undefined> {
    const [sync] = await db.select().from(campaignSyncs).where(eq(campaignSyncs.id, id));
    return sync || undefined;
  }

  async createCampaignSync(sync: InsertCampaignSync): Promise<CampaignSync> {
    const [created] = await db.insert(campaignSyncs).values(sync).returning();
    return created;
  }

  async updateCampaignSync(id: number, updates: Partial<CampaignSync>): Promise<CampaignSync | undefined> {
    const [updated] = await db
      .update(campaignSyncs)
      .set({ ...updates, lastSyncedAt: new Date() })
      .where(eq(campaignSyncs.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCampaignSync(id: number): Promise<boolean> {
    const result = await db.delete(campaignSyncs).where(eq(campaignSyncs.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Member operations
  async getMember(id: number): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member || undefined;
  }

  async getMemberByEmail(email: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.email, email.toLowerCase()));
    return member || undefined;
  }

  async createMember(member: InsertMember): Promise<Member> {
    const [created] = await db.insert(members).values({
      ...member,
      email: member.email.toLowerCase(),
    }).returning();
    return created;
  }

  async updateMember(id: number, updates: Partial<Member>): Promise<Member | undefined> {
    const [updated] = await db
      .update(members)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(members.id, id))
      .returning();
    return updated || undefined;
  }

  async updateMemberLastLogin(id: number): Promise<void> {
    await db
      .update(members)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(members.id, id));
  }

  async updateMemberPassword(id: number, passwordHash: string): Promise<void> {
    await db
      .update(members)
      .set({ 
        passwordHash,
        passwordChangedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(members.id, id));
  }

  async deleteMember(id: number): Promise<boolean> {
    const result = await db.delete(members).where(eq(members.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getMembers(filters?: { status?: string; role?: string }): Promise<Member[]> {
    const conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(members.status, filters.status as any));
    }
    if (filters?.role) {
      conditions.push(eq(members.role, filters.role as any));
    }

    return await db
      .select()
      .from(members)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(members.createdAt));
  }

  // Password reset operations
  async createPasswordReset(reset: InsertPasswordReset): Promise<PasswordReset> {
    const [created] = await db.insert(passwordResets).values({
      ...reset,
      email: reset.email.toLowerCase(),
    }).returning();
    return created;
  }

  async getPasswordResetByEmail(email: string): Promise<PasswordReset | undefined> {
    const [reset] = await db
      .select()
      .from(passwordResets)
      .where(eq(passwordResets.email, email.toLowerCase()))
      .orderBy(desc(passwordResets.createdAt));
    return reset || undefined;
  }

  async getActivePasswordReset(email: string): Promise<PasswordReset | undefined> {
    const [reset] = await db
      .select()
      .from(passwordResets)
      .where(
        and(
          eq(passwordResets.email, email.toLowerCase()),
          eq(passwordResets.isUsed, false),
          gte(passwordResets.expiresAt, new Date())
        )
      )
      .orderBy(desc(passwordResets.createdAt));
    return reset || undefined;
  }

  async incrementPasswordResetAttempts(id: number): Promise<void> {
    const [current] = await db.select().from(passwordResets).where(eq(passwordResets.id, id));
    if (current) {
      await db
        .update(passwordResets)
        .set({ attempts: current.attempts + 1 })
        .where(eq(passwordResets.id, id));
    }
  }

  async markPasswordResetUsed(id: number): Promise<void> {
    await db
      .update(passwordResets)
      .set({ isUsed: true })
      .where(eq(passwordResets.id, id));
  }

  async deleteExpiredPasswordResets(): Promise<number> {
    const result = await db
      .delete(passwordResets)
      .where(
        or(
          lte(passwordResets.expiresAt, new Date()),
          eq(passwordResets.isUsed, true)
        )
      );
    return result.rowCount || 0;
  }

  // Member events operations
  async getMemberEvents(filters?: { accessLevel?: string; isPublished?: boolean; hasRecording?: boolean }): Promise<MemberEvent[]> {
    const conditions = [];
    
    if (filters?.accessLevel) {
      conditions.push(eq(memberEvents.accessLevel, filters.accessLevel as any));
    }
    if (filters?.isPublished !== undefined) {
      conditions.push(eq(memberEvents.isPublished, filters.isPublished));
    }
    if (filters?.hasRecording) {
      conditions.push(isNull(memberEvents.recordingUrl));
    }

    return await db
      .select()
      .from(memberEvents)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(memberEvents.eventDate));
  }

  async getMemberEvent(id: number): Promise<MemberEvent | undefined> {
    const [event] = await db.select().from(memberEvents).where(eq(memberEvents.id, id));
    return event || undefined;
  }

  async createMemberEvent(event: InsertMemberEvent): Promise<MemberEvent> {
    const [created] = await db.insert(memberEvents).values(event).returning();
    return created;
  }

  async updateMemberEvent(id: number, updates: Partial<MemberEvent>): Promise<MemberEvent | undefined> {
    const [updated] = await db
      .update(memberEvents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(memberEvents.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteMemberEvent(id: number): Promise<boolean> {
    const result = await db.delete(memberEvents).where(eq(memberEvents.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
