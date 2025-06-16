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
