import { pgTable, text, serial, integer, boolean, varchar, timestamp } from "drizzle-orm/pg-core";
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
  email: z.string().email().optional(),
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
  noMemberEmail: z.string().email().optional(),
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
    if (!data.noMemberWantsServicesMap) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select whether you want your center included in the services map",
        path: ["noMemberWantsServicesMap"],
      });
    }
    
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
      } else if (!z.string().email().safeParse(data.noMemberEmail).success) {
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
