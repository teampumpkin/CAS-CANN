import { pgTable, text, serial, integer, boolean, varchar, timestamp, json, jsonb, pgEnum, unique, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Resources table for document management
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(), // PDF, DOCX, XLSX, PNG
  fileSize: varchar("file_size", { length: 50 }),
  amyloidosisType: varchar("amyloidosis_type", { length: 50 }).notNull(), // AL, ATTR, AA, ALect2, General
  resourceType: varchar("resource_type", { length: 100 }).notNull(), // form, tool, article, pathway, visual, research
  category: varchar("category", { length: 100 }).notNull(), // toolkit, guidelines, articles, webinars, libraries, education
  audience: varchar("audience", { length: 100 }).notNull(), // clinician, patient, caregiver, researcher
  language: varchar("language", { length: 10 }).notNull().default("en"), // en, fr
  region: varchar("region", { length: 50 }).notNull().default("national"), // provincial codes or national
  isPublic: boolean("is_public").notNull().default(true),
  requiresLogin: boolean("requires_login").notNull().default(false),
  submittedBy: varchar("submitted_by", { length: 255 }),
  submitterRole: varchar("submitter_role", { length: 255 }),
  submitterOrganization: varchar("submitter_organization", { length: 255 }),
  consentAgreed: boolean("consent_agreed").default(false),
  phiConfirmation: boolean("phi_confirmation").default(false),
  editorialCharter: boolean("editorial_charter").default(false),
  moderatedBy: varchar("moderated_by", { length: 255 }),
  isApproved: boolean("is_approved").notNull().default(false),
  tags: text("tags").array(), // Array of tags
  downloadCount: integer("download_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  downloadCount: true,
});

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

// Unified CAS and CANN Registration Form Schema
export const casRegistrationSchema = z.object({
  // Question 1: CAS membership
  wantsMembership: z.enum(["Yes", "No"], {
    required_error: "Please select whether you want to become a CAS member",
  }),
  
  // Question 2: CANN membership (required)
  wantsCANNMembership: z.enum(["Yes", "No"], {
    required_error: "Please select whether you want to join CANN",
  }),
  
  // Questions 3-10: Core member information (shown when either Q1 or Q2 = "Yes")
  fullName: z.string().optional(),
  email: z.string().optional(),
  discipline: z.string().optional(),
  subspecialty: z.string().optional(),
  amyloidosisType: z.enum(["ATTR", "AL", "Both ATTR and AL", "Other"]).optional(), // Q7: visible to ALL members
  institution: z.string().optional(),
  wantsServicesMapInclusion: z.enum(["Yes", "No"]).optional(), // Q9
  wantsCommunications: z.enum(["Yes", "No"]).optional(), // Q10
  
  // Question 11: CANN Communications (shown only when Q2 = "Yes")
  cannCommunications: z.enum(["Yes", "No"]).optional(),
  
  // Non-member contact fallback (only if both Q1 = No AND Q2 = No)
  noMemberName: z.string().optional(),
  noMemberEmail: z.string().optional(),
  noMemberMessage: z.string().optional(),
}).superRefine((data, ctx) => {
  // If CANN membership is Yes, they automatically become CAS members too
  const isMember = data.wantsMembership === "Yes" || data.wantsCANNMembership === "Yes";
  
  // Validation for membership path (shown when either Q1 or Q2 = "Yes")
  if (isMember) {
    if (!data.fullName || data.fullName.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Full name is required",
        path: ["fullName"],
      });
    }
    
    if (!data.email || data.email.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email address is required",
        path: ["email"],
      });
    } else if (!z.string().email().safeParse(data.email).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid email address",
        path: ["email"],
      });
    }
    
    if (!data.discipline || data.discipline.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Discipline is required",
        path: ["discipline"],
      });
    }
    
    if (!data.subspecialty || data.subspecialty.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sub-specialty area is required",
        path: ["subspecialty"],
      });
    }
    
    if (!data.amyloidosisType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select the type of amyloidosis patients you care for",
        path: ["amyloidosisType"],
      });
    }
    
    if (!data.institution || data.institution.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Centre or Clinic Name/Institution is required",
        path: ["institution"],
      });
    }
    
    if (!data.wantsCommunications) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select whether you want to receive communications",
        path: ["wantsCommunications"],
      });
    }
  }
  
  // Validation for CANN-specific field (Q11, shown only when Q2 = "Yes")
  if (data.wantsCANNMembership === "Yes") {
    if (!data.cannCommunications) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select whether you want to receive CANN communications",
        path: ["cannCommunications"],
      });
    }
  }
  
  // Validation for non-member contact fallback (shown only when both Q1 = No AND Q2 = No)
  if (!isMember) {
    if (!data.noMemberName || data.noMemberName.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name is required",
        path: ["noMemberName"],
      });
    }
    
    if (!data.noMemberEmail || data.noMemberEmail.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required",
        path: ["noMemberEmail"],
      });
    } else if (!z.string().email().safeParse(data.noMemberEmail).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid email address",
        path: ["noMemberEmail"],
      });
    }
  }
});

export type CASRegistrationForm = z.infer<typeof casRegistrationSchema>;

// Dynamic Multi-Form Lead Capture System Tables

// Enums for status values
export const processingStatusEnum = pgEnum("processing_status", ["pending", "processing", "completed", "failed"]);
export const syncStatusEnum = pgEnum("sync_status", ["pending", "synced", "failed"]);
export const logStatusEnum = pgEnum("log_status", ["success", "failed", "in_progress"]);
export const operationEnum = pgEnum("operation", ["received", "field_sync", "crm_push", "retry_attempt"]);

// Form submissions table - stores all incoming form data dynamically
export const formSubmissions = pgTable("form_submissions", {
  id: serial("id").primaryKey(),
  formName: varchar("form_name", { length: 255 }).notNull(), // Unique identifier for the form
  submissionData: jsonb("submission_data").notNull(), // Dynamic form fields as JSONB for better performance
  sourceForm: varchar("source_form", { length: 255 }).notNull(), // Tracking field for CRM
  zohoModule: varchar("zoho_module", { length: 100 }).notNull().default("Leads"), // Target Zoho module
  zohoCrmId: varchar("zoho_crm_id", { length: 100 }), // Zoho record ID after successful sync
  processingStatus: processingStatusEnum("processing_status").notNull().default("pending"),
  syncStatus: syncStatusEnum("sync_status").notNull().default("pending"),
  errorMessage: text("error_message"), // Error details if sync failed
  retryCount: integer("retry_count").notNull().default(0),
  lastRetryAt: timestamp("last_retry_at"),
  nextRetryAt: timestamp("next_retry_at"), // When to attempt next retry (exponential backoff)
  lastSyncAt: timestamp("last_sync_at"), // Timestamp when successfully synced to Zoho
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_form_submissions_form_name").on(table.formName),
  index("idx_form_submissions_zoho_module").on(table.zohoModule),
  index("idx_form_submissions_sync_status").on(table.syncStatus),
  index("idx_form_submissions_processing_status").on(table.processingStatus),
  index("idx_form_submissions_zoho_crm_id").on(table.zohoCrmId),
]);

// Submission logs table - tracks all submission attempts and operations
export const submissionLogs = pgTable("submission_logs", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id").notNull().references(() => formSubmissions.id, { onDelete: "cascade" }),
  operation: operationEnum("operation").notNull(),
  status: logStatusEnum("status").notNull(),
  details: jsonb("details"), // Additional operation details
  errorMessage: text("error_message"),
  duration: integer("duration"), // Operation duration in milliseconds
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_submission_logs_submission_id").on(table.submissionId),
]);

// Field mappings table - tracks CRM field mappings and types
export const fieldMappings = pgTable("field_mappings", {
  id: serial("id").primaryKey(),
  zohoModule: varchar("zoho_module", { length: 100 }).notNull(), // Leads, Contacts, etc.
  fieldName: varchar("field_name", { length: 255 }).notNull(), // Field name in Zoho CRM
  fieldType: varchar("field_type", { length: 50 }).notNull(), // text, email, phone, picklist, multi_select, boolean
  isCustomField: boolean("is_custom_field").notNull().default(false),
  picklistValues: jsonb("picklist_values"), // Array of allowed values for picklist fields
  isRequired: boolean("is_required").notNull().default(false),
  maxLength: integer("max_length"), // For text fields
  lastSyncedAt: timestamp("last_synced_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  unique("unique_zoho_module_field").on(table.zohoModule, table.fieldName),
  index("idx_field_mappings_zoho_module").on(table.zohoModule),
]);

// Form configurations table - centralized form-to-CRM mapping registry
export const formConfigurations = pgTable("form_configurations", {
  id: serial("id").primaryKey(),
  formName: varchar("form_name", { length: 255 }).notNull().unique(),
  zohoModule: varchar("zoho_module", { length: 100 }).notNull().default("Leads"),
  zohoLayoutId: varchar("zoho_layout_id", { length: 100 }), // Zoho CRM layout ID (CAS, CANN, etc.)
  zohoLayoutName: varchar("zoho_layout_name", { length: 255 }), // Layout name for reference
  leadSourceTag: text("lead_source_tag"), // Unique identifier in Zoho Lead_Source field
  displayFields: jsonb("display_fields"), // Fields to show on form UI (stored as JSON array)
  submitFields: jsonb("submit_fields"), // Field mappings: { formField: { zohoField, label, required, fieldType } }
  fieldMappings: jsonb("field_mappings"), // Legacy: Custom field name mappings (deprecated)
  strictMapping: boolean("strict_mapping").notNull().default(true), // Only send configured fields to Zoho
  autoCreateFields: boolean("auto_create_fields").notNull().default(false), // Auto-create missing Zoho fields
  isActive: boolean("is_active").notNull().default(true),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_form_configurations_active").on(table.isActive),
  index("idx_form_configurations_lead_source").on(table.leadSourceTag),
]);

// Insert schemas for form submission system
export const insertFormSubmissionSchema = createInsertSchema(formSubmissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  zohoCrmId: true,
  processingStatus: true,
  syncStatus: true,
  errorMessage: true,
  retryCount: true,
  lastRetryAt: true,
  nextRetryAt: true,
  lastSyncAt: true,
});

export const insertSubmissionLogSchema = createInsertSchema(submissionLogs).omit({
  id: true,
  createdAt: true,
});

export const insertFieldMappingSchema = createInsertSchema(fieldMappings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastSyncedAt: true,
});

export const insertFormConfigurationSchema = createInsertSchema(formConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Field Metadata Cache for Zoho CRM fields - enables efficient dynamic field mapping
export const fieldMetadataCache = pgTable("field_metadata_cache", {
  id: serial("id").primaryKey(),
  zohoModule: varchar("zoho_module", { length: 100 }).notNull(), // Leads, Contacts, etc
  fieldApiName: varchar("field_api_name", { length: 255 }).notNull(),
  fieldLabel: varchar("field_label", { length: 255 }).notNull(),
  dataType: varchar("data_type", { length: 50 }).notNull(),
  isCustomField: boolean("is_custom_field").notNull().default(false),
  isRequired: boolean("is_required").notNull().default(false),
  maxLength: integer("max_length"),
  picklistValues: jsonb("picklist_values"), // For dropdown fields
  fieldMetadata: jsonb("field_metadata"), // Full Zoho field object
  lastSynced: timestamp("last_synced").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  unique("unique_module_field_api").on(table.zohoModule, table.fieldApiName),
  index("idx_field_metadata_module").on(table.zohoModule),
  index("idx_field_metadata_last_synced").on(table.lastSynced),
]);

export const insertFieldMetadataCacheSchema = createInsertSchema(fieldMetadataCache).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for form submission system
export type FormSubmission = typeof formSubmissions.$inferSelect;
export type InsertFormSubmission = z.infer<typeof insertFormSubmissionSchema>;
export type SubmissionLog = typeof submissionLogs.$inferSelect;
export type InsertSubmissionLog = z.infer<typeof insertSubmissionLogSchema>;
export type FieldMapping = typeof fieldMappings.$inferSelect;
export type InsertFieldMapping = z.infer<typeof insertFieldMappingSchema>;
export type FormConfiguration = typeof formConfigurations.$inferSelect;
export type InsertFormConfiguration = z.infer<typeof insertFormConfigurationSchema>;
export type FieldMetadataCache = typeof fieldMetadataCache.$inferSelect;
export type InsertFieldMetadataCache = z.infer<typeof insertFieldMetadataCacheSchema>;

// Form field mapping configuration types
export interface SubmitFieldConfig {
  zohoField: string;       // Target Zoho CRM field API name
  label: string;           // Human-readable label for the field
  required?: boolean;      // Whether field is required for submission
  fieldType?: string;      // Field type: text, email, phone, picklist, boolean
  maxLength?: number;      // Max length for text fields
  picklistValues?: string[]; // Allowed values for picklist fields
}

export type SubmitFieldsMap = Record<string, SubmitFieldConfig>;

// Zod schema for validating submit field configurations
export const submitFieldConfigSchema = z.object({
  zohoField: z.string().min(1),
  label: z.string().min(1),
  required: z.boolean().optional(),
  fieldType: z.enum(["text", "email", "phone", "picklist", "multiselectpicklist", "boolean"]).optional(),
  maxLength: z.number().optional(),
  picklistValues: z.array(z.string()).optional(),
});

export const submitFieldsMapSchema = z.record(z.string(), submitFieldConfigSchema);

// Dynamic form submission schema - validates the API request format
export const dynamicFormSubmissionSchema = z.object({
  form_name: z.string().min(1, "Form name is required"),
  data: z.record(z.string(), z.any()).refine(
    (data) => Object.keys(data).length > 0,
    "Form data cannot be empty"
  ),
});

export type DynamicFormSubmission = z.infer<typeof dynamicFormSubmissionSchema>;

// OAuth Token Management for Zoho CRM
export const oauthTokens = pgTable("oauth_tokens", {
  id: serial("id").primaryKey(),
  provider: varchar("provider", { length: 50 }).notNull(), // "zoho_crm"
  accessToken: text("access_token"), // Encrypted access token
  refreshToken: text("refresh_token"), // Encrypted refresh token  
  expiresAt: timestamp("expires_at"), // Token expiration timestamp
  scope: text("scope"), // OAuth scopes granted
  tokenType: varchar("token_type", { length: 50 }).default("Bearer"), 
  isActive: boolean("is_active").notNull().default(true),
  lastRefreshed: timestamp("last_refreshed").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_oauth_tokens_provider").on(table.provider),
  index("idx_oauth_tokens_active").on(table.isActive),
]);

export const insertOAuthTokenSchema = createInsertSchema(oauthTokens).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastRefreshed: true,
});

export type OAuthToken = typeof oauthTokens.$inferSelect;
export type InsertOAuthToken = z.infer<typeof insertOAuthTokenSchema>;

export const workflowStatusEnum = pgEnum("workflow_status", ["active", "paused", "archived"]);
export const triggerTypeEnum = pgEnum("trigger_type", ["crm_record_created", "crm_record_updated", "crm_field_changed", "manual", "scheduled"]);
export const actionTypeEnum = pgEnum("action_type", ["add_to_campaign", "send_email", "update_crm_field", "create_crm_record", "wait", "http_request"]);
export const executionStatusEnum = pgEnum("execution_status", ["pending", "running", "completed", "failed", "skipped"]);

export const automationWorkflows = pgTable("automation_workflows", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  triggerType: triggerTypeEnum("trigger_type").notNull(),
  triggerConfig: jsonb("trigger_config").notNull(),
  conditions: jsonb("conditions"),
  actions: jsonb("actions").notNull(),
  status: workflowStatusEnum("status").notNull().default("active"),
  executionCount: integer("execution_count").notNull().default(0),
  lastExecutedAt: timestamp("last_executed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_automation_workflows_status").on(table.status),
  index("idx_automation_workflows_trigger_type").on(table.triggerType),
]);

export const insertAutomationWorkflowSchema = createInsertSchema(automationWorkflows).omit({
  id: true,
  executionCount: true,
  lastExecutedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type AutomationWorkflow = typeof automationWorkflows.$inferSelect;
export type InsertAutomationWorkflow = z.infer<typeof insertAutomationWorkflowSchema>;

export const workflowExecutions = pgTable("workflow_executions", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").notNull().references(() => automationWorkflows.id, { onDelete: "cascade" }),
  status: executionStatusEnum("status").notNull().default("pending"),
  triggerData: jsonb("trigger_data"),
  executionContext: jsonb("execution_context"),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  duration: integer("duration"),
}, (table) => [
  index("idx_workflow_executions_workflow_id").on(table.workflowId),
  index("idx_workflow_executions_status").on(table.status),
]);

export const insertWorkflowExecutionSchema = createInsertSchema(workflowExecutions).omit({
  id: true,
  startedAt: true,
  completedAt: true,
  duration: true,
});

export type WorkflowExecution = typeof workflowExecutions.$inferSelect;
export type InsertWorkflowExecution = z.infer<typeof insertWorkflowExecutionSchema>;

export const actionExecutions = pgTable("action_executions", {
  id: serial("id").primaryKey(),
  executionId: integer("execution_id").notNull().references(() => workflowExecutions.id, { onDelete: "cascade" }),
  actionType: actionTypeEnum("action_type").notNull(),
  actionConfig: jsonb("action_config").notNull(),
  status: executionStatusEnum("status").notNull().default("pending"),
  result: jsonb("result"),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  duration: integer("duration"),
}, (table) => [
  index("idx_action_executions_execution_id").on(table.executionId),
  index("idx_action_executions_status").on(table.status),
]);

export const insertActionExecutionSchema = createInsertSchema(actionExecutions).omit({
  id: true,
  startedAt: true,
  completedAt: true,
  duration: true,
});

export type ActionExecution = typeof actionExecutions.$inferSelect;
export type InsertActionExecution = z.infer<typeof insertActionExecutionSchema>;

export const campaignSyncs = pgTable("campaign_syncs", {
  id: serial("id").primaryKey(),
  zohoCampaignId: varchar("zoho_campaign_id", { length: 100 }).notNull(),
  campaignName: varchar("campaign_name", { length: 255 }).notNull(),
  listId: varchar("list_id", { length: 100 }),
  metadata: jsonb("metadata"),
  lastSyncedAt: timestamp("last_synced_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_campaign_syncs_zoho_id").on(table.zohoCampaignId),
]);

export const insertCampaignSyncSchema = createInsertSchema(campaignSyncs).omit({
  id: true,
  lastSyncedAt: true,
  createdAt: true,
});

export type CampaignSync = typeof campaignSyncs.$inferSelect;
export type InsertCampaignSync = z.infer<typeof insertCampaignSyncSchema>;

// CANN Townhall Event Registrations
export const townhallRegistrations = pgTable("townhall_registrations", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  institution: varchar("institution", { length: 255 }).notNull(),
  isCannMember: boolean("is_cann_member").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_townhall_registrations_email").on(table.email),
  index("idx_townhall_registrations_created_at").on(table.createdAt),
]);

export const insertTownhallRegistrationSchema = createInsertSchema(townhallRegistrations).omit({
  id: true,
  createdAt: true,
});

export type TownhallRegistration = typeof townhallRegistrations.$inferSelect;
export type InsertTownhallRegistration = z.infer<typeof insertTownhallRegistrationSchema>;

// Admin credentials for event management
export const eventAdmins = pgTable("event_admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEventAdminSchema = createInsertSchema(eventAdmins).omit({
  id: true,
  createdAt: true,
});

export type EventAdmin = typeof eventAdmins.$inferSelect;
export type InsertEventAdmin = z.infer<typeof insertEventAdminSchema>;
