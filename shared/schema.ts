import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email"),
  companyName: text("company_name"),
  role: text("role").default("user"),
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
  overallRiskScore: integer("overall_risk_score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  company: jsonb("company").notNull(),
  incident: jsonb("incident").notNull(),
  riskItems: jsonb("risk_items").notNull(),
  rasbitaCategories: jsonb("rasbita_categories").notNull(),
  financialSummary: jsonb("financial_summary").notNull(),
  dashboard: jsonb("dashboard").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  companyName: true,
  role: true,
});

export const insertAssessmentSchema = z.object({
  userId: z.number().optional(),
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  employeeCount: z.string().min(1, "Employee count is required"),
  securityMeasures: z.array(z.string()),
  primaryConcerns: z.array(z.string()),
  contactInfo: z.object({
    name: z.string(),
    email: z.string().email("Invalid email format"),
    phone: z.string(),
  }),
  reportType: z.enum(["preliminary", "comprehensive"]),
  securityScore: z.number().optional(),
  matrixData: z.any().optional(),
  findings: z.any().optional(),
  recommendations: z.any().optional(),
});

export const insertEarlyAccessSubmissionSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  companySize: z.string(),
  industry: z.string(),
  interestedIn: z.array(z.string()).min(1, { message: "Please select at least one product." }),
  investmentLevel: z.string(),
  additionalInfo: z.string().optional(),
  status: z.string().optional()
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

export type InsertEarlyAccessSubmission = z.infer<typeof insertEarlyAccessSubmissionSchema>;
export type EarlyAccessSubmission = typeof earlyAccessSubmissions.$inferSelect;

export const insertRasbitaReportSchema = z.object({
  userId: z.number().optional(),
  businessId: z.string().optional(),
  title: z.string().min(3, "Report title is required"),
  incidentCategory: z.string().min(1, "Incident category is required"),
  overallRiskScore: z.number(),
  company: z.any(),
  incident: z.any(),
  riskItems: z.array(z.any()),
  rasbitaCategories: z.any(),
  financialSummary: z.any(),
  dashboard: z.any(),
});

export type InsertRasbitaReport = z.infer<typeof insertRasbitaReportSchema>;
export type RasbitaReport = typeof rasbitaReports.$inferSelect;
