// BACKUP: shared/schema.ts
// Created: 2025-01-27 15:45 before removing redundant tabs
// Purpose: Complete backup of database schema

import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email"),
  companyName: text("company_name"),
  role: text("role").default("user"), // user, admin, super_admin, viewer
  createdAt: timestamp("created_at").defaultNow(),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  businessName: text("business_name").notNull(),
  industry: text("industry").notNull(),
  employeeCount: text("employee_count").notNull(),
  securityMeasures: text("security_measures").array(),
  primaryConcerns: text("primary_concerns").array(),
  contactInfo: jsonb("contact_info").notNull(),
  reportType: text("report_type").notNull(),
  securityScore: integer("security_score"),
  matrixData: jsonb("matrix_data"),
  findings: jsonb("findings"),
  recommendations: jsonb("recommendations"),
  status: text("status").default("draft"),
  reportData: jsonb("report_data"),
  completedAt: timestamp("completed_at"),
  riskScore: integer("risk_score"),
  isDeleted: boolean("is_deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const earlyAccessSubmissions = pgTable("early_access_submissions", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  phone: text("phone").notNull(),
  companySize: text("company_size").notNull(),
  industry: text("industry").notNull(),
  interestedIn: text("interested_in").array(),
  investmentLevel: text("investment_level").notNull(),
  additionalInfo: text("additional_info"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rasbitaReports = pgTable("rasbita_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  businessId: text("business_id"),
  title: text("title").notNull(),
  incidentCategory: text("incident_category").notNull(),
  overallRiskScore: text("overall_risk_score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  company: jsonb("company").notNull(),
  incident: jsonb("incident").notNull(),
  riskItems: jsonb("risk_items").notNull(),
  rasbitaCategories: jsonb("rasbita_categories").notNull(),
  financialSummary: jsonb("financial_summary").notNull(),
  dashboard: jsonb("dashboard").notNull(),
});

// Analytics tracking tables
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  country: text("country"),
  city: text("city"),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in seconds
  pageViews: integer("page_views").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  userId: integer("user_id").references(() => users.id),
  path: text("path").notNull(),
  title: text("title"),
  referrer: text("referrer"),
  timestamp: timestamp("timestamp").defaultNow(),
  timeOnPage: integer("time_on_page"), // in seconds
  exitPage: boolean("exit_page").default(false),
});

export const partnershipApplications = pgTable("partnership_applications", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  phone: text("phone").notNull(),
  website: text("website"),
  partnershipType: text("partnership_type").notNull(), // "integration", "reseller", "technology", "consulting"
  experienceLevel: text("experience_level").notNull(), // "beginner", "intermediate", "advanced", "expert"
  clientBase: text("client_base").notNull(), // "1-10", "11-50", "51-200", "200+"
  geographicFocus: text("geographic_focus").array(),
  proposalSummary: text("proposal_summary").notNull(),
  additionalInfo: text("additional_info"),
  status: text("status").default("pending"), // "pending", "approved", "rejected", "under_review"
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const insertAssessmentSchema = createInsertSchema(assessments);
export const insertEarlyAccessSchema = createInsertSchema(earlyAccessSubmissions);
export const insertRasbitaReportSchema = createInsertSchema(rasbitaReports);
export const insertUserSessionSchema = createInsertSchema(userSessions);
export const insertPageViewSchema = createInsertSchema(pageViews);
export const insertPartnershipApplicationSchema = createInsertSchema(partnershipApplications);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;
export type EarlyAccessSubmission = typeof earlyAccessSubmissions.$inferSelect;
export type InsertEarlyAccessSubmission = typeof earlyAccessSubmissions.$inferInsert;
export type RasbitaReport = typeof rasbitaReports.$inferSelect;
export type InsertRasbitaReport = typeof rasbitaReports.$inferInsert;
export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = typeof userSessions.$inferInsert;
export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = typeof pageViews.$inferInsert;
export type PartnershipApplication = typeof partnershipApplications.$inferSelect;
export type InsertPartnershipApplication = typeof partnershipApplications.$inferInsert;