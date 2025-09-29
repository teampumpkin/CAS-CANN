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

// CAS Registration Form Schema
export const casRegistrationSchema = z.object({
  // Question 1: Main membership question
  wantsMembership: z.enum(["Yes", "No"], {
    required_error: "Please select whether you want to become a CAS member",
  }),
  
  // For "Yes" membership path (questions 2-7 from previous spec, then question 8 for services map)
  fullName: z.string().optional(),
  email: z.string().optional(),
  discipline: z.string().optional(),
  subspecialty: z.string().optional(),
  institution: z.string().optional(),
  wantsCommunications: z.enum(["Yes", "No"]).optional(),
  wantsServicesMapInclusion: z.enum(["Yes", "No"]).optional(),
  
  // For services map "Yes" path (questions 9-13 from previous spec)
  centerName: z.string().optional(),
  centerAddress: z.string().optional(),
  centerPhone: z.string().optional(),
  centerFax: z.string().optional(),
  allowsContact: z.enum(["Yes", "No"]).optional(),
  
  // For "No" membership path - new questions
  // Question 2: Services map for non-members
  noMemberWantsServicesMap: z.enum(["Yes", "No"]).optional(),
  
  // Questions 3-6: Center details for non-members (always required when wantsMembership = "No")
  noMemberCenterName: z.string().optional(),
  noMemberCenterAddress: z.string().optional(),
  noMemberCenterPhone: z.string().optional(),
  noMemberCenterFax: z.string().optional(),
  
  // Question 7: Allow contact for services map (required when wantsMembership = "No")
  noMemberAllowsContact: z.enum(["Yes", "No"]).optional(),
  
  // Questions 8-12: Contact details for non-members (only when allowsContact = "Yes")
  noMemberEmail: z.string().optional(),
  noMemberDiscipline: z.string().optional(),
  noMemberSubspecialty: z.string().optional(),
  noMemberCenterNameForContact: z.string().optional(),
  noMemberWantsCommunications: z.enum(["Yes", "No"]).optional(),
}).superRefine((data, ctx) => {
  // Conditional validation for "Yes" membership path
  if (data.wantsMembership === "Yes") {
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
    
    if (!data.institution || data.institution.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Center or Clinic Name/Institution is required",
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
    
    if (!data.wantsServicesMapInclusion) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select whether you want your center included in the services map",
        path: ["wantsServicesMapInclusion"],
      });
    }
    
    // Conditional validation for services map "Yes" path
    if (data.wantsServicesMapInclusion === "Yes") {
      if (!data.centerName || data.centerName.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Center or Clinic Name is required",
          path: ["centerName"],
        });
      }
      
      if (!data.centerAddress || data.centerAddress.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Center or Clinic Address is required",
          path: ["centerAddress"],
        });
      }
      
      if (!data.centerPhone || data.centerPhone.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Center or Clinic Phone Number is required",
          path: ["centerPhone"],
        });
      }
      
      if (!data.centerFax || data.centerFax.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Center or Clinic Fax Number is required",
          path: ["centerFax"],
        });
      }
      
      if (!data.allowsContact) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select whether you may be contacted by CAS",
          path: ["allowsContact"],
        });
      }
    }
  }
  
  // Conditional validation for "No" membership path
  if (data.wantsMembership === "No") {
    // Question 2: Services map selection is required
    if (!data.noMemberWantsServicesMap) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select whether you want your center included in the services map",
        path: ["noMemberWantsServicesMap"],
      });
    }
    
    // Questions 3-7 are always required for "No" path
    if (!data.noMemberCenterName || data.noMemberCenterName.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Center or Clinic Name/Institution is required",
        path: ["noMemberCenterName"],
      });
    }
    
    if (!data.noMemberCenterAddress || data.noMemberCenterAddress.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Center or Clinic Address is required",
        path: ["noMemberCenterAddress"],
      });
    }
    
    if (!data.noMemberCenterPhone || data.noMemberCenterPhone.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Center or Clinic Phone Number is required",
        path: ["noMemberCenterPhone"],
      });
    }
    
    if (!data.noMemberCenterFax || data.noMemberCenterFax.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Center or Clinic Fax Number is required",
        path: ["noMemberCenterFax"],
      });
    }
    
    if (!data.noMemberAllowsContact) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select whether you may be contacted by CAS",
        path: ["noMemberAllowsContact"],
      });
    }
    
    // Conditional validation when non-member allows contact (Questions 8-12)
    if (data.noMemberAllowsContact === "Yes") {
      if (!data.noMemberEmail || data.noMemberEmail.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email address is required",
          path: ["noMemberEmail"],
        });
      } else if (data.noMemberEmail && !z.string().email().safeParse(data.noMemberEmail).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid email address",
          path: ["noMemberEmail"],
        });
      }
      
      if (!data.noMemberDiscipline || data.noMemberDiscipline.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discipline is required",
          path: ["noMemberDiscipline"],
        });
      }
      
      if (!data.noMemberSubspecialty || data.noMemberSubspecialty.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sub-specialty area is required",
          path: ["noMemberSubspecialty"],
        });
      }
      
      if (!data.noMemberCenterNameForContact || data.noMemberCenterNameForContact.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Center or Clinic Name/Institution is required",
          path: ["noMemberCenterNameForContact"],
        });
      }
      
      if (!data.noMemberWantsCommunications) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select whether you want to receive communications",
          path: ["noMemberWantsCommunications"],
        });
      }
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
  processingStatus: processingStatusEnum("processing_status").notNull().default("pending"),
  syncStatus: syncStatusEnum("sync_status").notNull().default("pending"),
  errorMessage: text("error_message"), // Error details if sync failed
  retryCount: integer("retry_count").notNull().default(0),
  lastRetryAt: timestamp("last_retry_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_form_submissions_form_name").on(table.formName),
  index("idx_form_submissions_sync_status").on(table.syncStatus),
  index("idx_form_submissions_processing_status").on(table.processingStatus),
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
]);

// Form configurations table - optional form-to-module mappings and settings
export const formConfigurations = pgTable("form_configurations", {
  id: serial("id").primaryKey(),
  formName: varchar("form_name", { length: 255 }).notNull().unique(),
  fieldMappings: jsonb("field_mappings"), // Custom field name mappings
  isActive: boolean("is_active").notNull().default(true),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for form submission system
export const insertFormSubmissionSchema = createInsertSchema(formSubmissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  processingStatus: true,
  syncStatus: true,
  errorMessage: true,
  retryCount: true,
  lastRetryAt: true,
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

// Types for form submission system
export type FormSubmission = typeof formSubmissions.$inferSelect;
export type InsertFormSubmission = z.infer<typeof insertFormSubmissionSchema>;
export type SubmissionLog = typeof submissionLogs.$inferSelect;
export type InsertSubmissionLog = z.infer<typeof insertSubmissionLogSchema>;
export type FieldMapping = typeof fieldMappings.$inferSelect;
export type InsertFieldMapping = z.infer<typeof insertFieldMappingSchema>;
export type FormConfiguration = typeof formConfigurations.$inferSelect;
export type InsertFormConfiguration = z.infer<typeof insertFormConfigurationSchema>;

// Dynamic form submission schema - validates the API request format
export const dynamicFormSubmissionSchema = z.object({
  form_name: z.string().min(1, "Form name is required"),
  data: z.record(z.string(), z.any()).refine(
    (data) => Object.keys(data).length > 0,
    "Form data cannot be empty"
  ),
});

export type DynamicFormSubmission = z.infer<typeof dynamicFormSubmissionSchema>;


