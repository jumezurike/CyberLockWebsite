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

// Service Requests table
export const serviceRequests = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  // Organization Information
  companyName: text("company_name").notNull(),
  contactPersonName: text("contact_person_name").notNull(),
  contactPersonTitle: text("contact_person_title").notNull(),
  address: jsonb("address").notNull(), // {street, city, state, zipCode, country}
  primaryEmail: text("primary_email").notNull(),
  secondaryEmail: text("secondary_email"),
  officePhone: text("office_phone"),
  mobilePhone: text("mobile_phone"),
  preferredContactMethod: text("preferred_contact_method").notNull(), // email, phone, mobile
  
  // Service Selection
  serviceCategory: text("service_category").notNull(), // IT Services, AI Solutions, Cybersecurity, Combined Services
  selectedServices: jsonb("selected_services").notNull(), // Array of selected services with quantities
  
  // Project Details
  organizationDescription: text("organization_description"),
  projectDescription: text("project_description"),
  uploadedFiles: jsonb("uploaded_files"), // Array of file paths/URLs
  relevantLinks: text("relevant_links").array(),
  urgencyLevel: text("urgency_level").notNull(), // Critical, High, Medium, Low
  
  // Scheduling
  desiredStartDate: date("desired_start_date"),
  desiredEndDate: date("desired_end_date"),
  flexibleDates: boolean("flexible_dates").default(false),
  selectedTimeSlots: jsonb("selected_time_slots"), // Available time slots selected
  
  // Pricing
  calculatedTotal: integer("calculated_total"), // Total cost in cents
  pricingBreakdown: jsonb("pricing_breakdown"), // Detailed pricing calculation
  hourlyRateEstimate: integer("hourly_rate_estimate"), // Estimated hours * rate
  
  // Approval Workflow
  quoteGenerated: boolean("quote_generated").default(false),
  quoteData: jsonb("quote_data"), // Generated quote details
  clientApproved: boolean("client_approved").default(false),
  digitalSignature: text("digital_signature"),
  approvedAt: timestamp("approved_at"),
  revisionCount: integer("revision_count").default(0),
  revisionHistory: jsonb("revision_history"), // Array of revision changes
  
  // Status tracking
  status: text("status").default("pending"), // pending, quoted, approved, in_progress, completed, cancelled
  assignedTo: integer("assigned_to").references(() => users.id),
  internalNotes: text("internal_notes"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Service Catalog table for pricing management
export const serviceCatalog = pgTable("service_catalog", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // IT Services, AI Solutions, Cybersecurity
  serviceName: text("service_name").notNull(),
  basePrice: integer("base_price"), // Base price in cents
  priceType: text("price_type").notNull(), // fixed, hourly, per_unit
  unit: text("unit"), // For per_unit pricing (e.g., "drop" for cable drops)
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team Availability table for scheduling
export const teamAvailability = pgTable("team_availability", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  availableDate: date("available_date").notNull(),
  timeSlots: jsonb("time_slots").notNull(), // Array of available time slots
  isBlocked: boolean("is_blocked").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics tracking tables
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  page: text("page"),
  action: text("action"), // page_view, assessment_start, assessment_complete, early_access_submit, etc.
  metadata: jsonb("metadata"), // Additional data like assessment_id, duration, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const userActivity = pgTable("user_activity", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  date: date("date").notNull(),
  activityType: text("activity_type").notNull(), // daily_active, monthly_active, assessment, payment
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  amount: integer("amount").notNull(), // Amount in cents
  currency: text("currency").default("usd"),
  status: text("status").notNull(), // pending, completed, failed, refunded
  paymentProvider: text("payment_provider").default("stripe"),
  paymentId: text("payment_id"), // External payment ID
  productType: text("product_type"), // assessment, subscription, early_access
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const webTraffic = pgTable("web_traffic", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  source: text("source").notNull(), // organic, direct, social, referral, paid
  page: text("page").notNull(),
  visitors: integer("visitors").default(0),
  pageViews: integer("page_views").default(0),
  bounceRate: integer("bounce_rate").default(0), // Percentage
  avgSessionDuration: integer("avg_session_duration").default(0), // Seconds
  createdAt: timestamp("created_at").defaultNow(),
});

export const monthlyMetrics = pgTable("monthly_metrics", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  totalUsers: integer("total_users").default(0),
  newUsers: integer("new_users").default(0),
  activeUsers: integer("active_users").default(0),
  paidUsers: integer("paid_users").default(0),
  revenue: integer("revenue").default(0), // In cents
  assessmentsCompleted: integer("assessments_completed").default(0),
  earlyAccessSubmissions: integer("early_access_submissions").default(0),
  growthRate: integer("growth_rate").default(0), // Percentage * 100
  organicTrafficPercent: integer("organic_traffic_percent").default(0), // Percentage * 100
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Visitor tracking for anonymous users
export const visitorSessions = pgTable("visitor_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referrerUrl: text("referrer_url"),
  landingPage: text("landing_page"),
  country: text("country"),
  region: text("region"),
  isBot: boolean("is_bot").default(false),
  sessionStart: timestamp("session_start").defaultNow(),
  sessionEnd: timestamp("session_end"),
  lastActivity: timestamp("last_activity").defaultNow(),
  totalPageViews: integer("total_page_views").default(1),
  sessionDuration: integer("session_duration").default(0), // seconds
});

export const visitorPageViews = pgTable("visitor_page_views", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => visitorSessions.sessionId),
  page: text("page").notNull(),
  title: text("title"),
  timeOnPage: integer("time_on_page").default(0), // seconds
  timestamp: timestamp("timestamp").defaultNow(),
});

// Viewer invitation system
export const viewerInvitations = pgTable("viewer_invitations", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  invitationToken: text("invitation_token").notNull().unique(),
  invitedBy: integer("invited_by").references(() => users.id),
  status: text("status").default("pending"), // pending, accepted, expired, revoked
  role: text("role").default("viewer"), // viewer, admin (future expansion)
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  companyName: true,
  role: true,
});

// Admin user schemas
export const insertAdminUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  role: z.enum(["admin", "super_admin", "viewer"], {
    required_error: "Admin role is required"
  }),
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Viewer invitation schemas
export const createInvitationSchema = z.object({
  email: z.string().email("Invalid email format"),
  role: z.enum(["viewer", "admin"], {
    required_error: "Role is required"
  }).default("viewer"),
});

export const acceptInvitationSchema = z.object({
  token: z.string().min(1, "Invitation token is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
export type CreateInvitation = z.infer<typeof createInvitationSchema>;
export type AcceptInvitation = z.infer<typeof acceptInvitationSchema>;
export type ViewerInvitation = typeof viewerInvitations.$inferSelect;
export type InsertViewerInvitation = typeof viewerInvitations.$inferInsert;

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

// Universal Wallet Address (UWA) table
export const uwas = pgTable("uwas", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  assessmentId: integer("assessment_id").references(() => assessments.id),
  uwaValue: text("uwa_value").notNull(),
  identityType: text("identity_type").notNull(), // Human, Machine, API, Third-Party
  machineType: text("machine_type"), // cloud, physical (only for Machine identity type)
  associatedName: text("associated_name"), // Name of the entity this UWA belongs to
  componentData: jsonb("component_data"), // JSON of the components used to generate this UWA
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUwaSchema = z.object({
  userId: z.number().optional(),
  assessmentId: z.number().optional(),
  uwaValue: z.string().min(1, "UWA value is required"),
  identityType: z.enum(["Human", "Machine", "API", "Third-Party"], {
    required_error: "Identity type is required"
  }),
  machineType: z.enum(["cloud", "physical"]).optional(),
  associatedName: z.string().optional(),
  componentData: z.any().optional(),
  status: z.string().optional(),
});

export type InsertUwa = z.infer<typeof insertUwaSchema>;
export type Uwa = typeof uwas.$inferSelect;

// Service Request Schemas
export const insertServiceRequestSchema = createInsertSchema(serviceRequests, {
  companyName: z.string().min(2, "Company name is required"),
  contactPersonName: z.string().min(2, "Contact person name is required"),
  contactPersonTitle: z.string().min(2, "Contact person title is required"),
  primaryEmail: z.string().email("Valid email is required"),
  secondaryEmail: z.string().email("Valid email format").optional().or(z.literal("")),
  officePhone: z.string().optional().or(z.literal("")),
  mobilePhone: z.string().optional().or(z.literal("")),
  preferredContactMethod: z.enum(["email", "phone", "mobile"], {
    required_error: "Preferred contact method is required"
  }),
  serviceCategory: z.enum(["IT Services", "AI Solutions", "Cybersecurity", "Combined Services"], {
    required_error: "Service category is required"
  }),
  urgencyLevel: z.enum(["Critical", "High", "Medium", "Low"], {
    required_error: "Urgency level is required"
  }),
}).omit({
  id: true,
  status: true,
  assignedTo: true,
  internalNotes: true,
  quoteGenerated: true,
  clientApproved: true,
  approvedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;
export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type ServiceCatalog = typeof serviceCatalog.$inferSelect;
export type TeamAvailability = typeof teamAvailability.$inferSelect;

// Visitor tracking schemas
export const insertVisitorSessionSchema = z.object({
  sessionId: z.string(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  referrerUrl: z.string().optional(),
  landingPage: z.string(),
  country: z.string().optional(),
  region: z.string().optional(),
  isBot: z.boolean().optional(),
});

export const insertVisitorPageViewSchema = z.object({
  sessionId: z.string(),
  page: z.string(),
  title: z.string().optional(),
  timeOnPage: z.number().optional(),
});

export type InsertVisitorSession = z.infer<typeof insertVisitorSessionSchema>;
export type VisitorSession = typeof visitorSessions.$inferSelect;

export type InsertVisitorPageView = z.infer<typeof insertVisitorPageViewSchema>;
export type VisitorPageView = typeof visitorPageViews.$inferSelect;
