import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email").unique(),
  companyName: text("company_name"),
  phone: text("phone"),
  role: text("role").default("user"), // client, technician, admin, super_admin, viewer
  isEmailVerified: boolean("is_email_verified").default(false),
  mfaEnabled: boolean("mfa_enabled").default(false),
  mfaSecret: text("mfa_secret"),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Client accounts linked to service requests
export const clientAccounts = pgTable("client_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  serviceRequestId: integer("service_request_id").references(() => serviceRequests.id),
  accountCreatedFromPayment: boolean("account_created_from_payment").default(true),
  paymentConfirmed: boolean("payment_confirmed").default(false),
  emailVerificationToken: text("email_verification_token"),
  emailVerificationExpiry: timestamp("email_verification_expiry"),
  mfaVerificationCode: text("mfa_verification_code"),
  mfaVerificationExpiry: timestamp("mfa_verification_expiry"),
  captchaVerified: boolean("captcha_verified").default(false),
  accessLevel: text("access_level").default("basic"), // basic, premium, enterprise
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Technician profiles
export const technicianProfiles = pgTable("technician_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  technicianId: text("technician_id").notNull().unique(),
  specializations: text("specializations").array(),
  certifications: jsonb("certifications"),
  availabilitySchedule: jsonb("availability_schedule"),
  currentStatus: text("current_status").default("available"), // available, assigned, on_break, off_duty
  rating: integer("rating").default(5),
  completedJobs: integer("completed_jobs").default(0),
  joinedDate: timestamp("joined_date").defaultNow(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  address: jsonb("address"), // {street, city, state, zipCode, country}
  primaryEmail: text("primary_email").notNull(),
  secondaryEmail: text("secondary_email"),
  officePhone: text("office_phone"),
  mobilePhone: text("mobile_phone"),
  preferredContactMethod: text("preferred_contact_method").notNull(), // email, phone, mobile
  
  // Service Selection
  serviceCategory: text("service_category").notNull(), // IT Services, AI Solutions, Cybersecurity, Combined Services
  selectedServices: jsonb("selected_services"), // Array of selected services with quantities
  
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
  
  // Time Cap Billing
  timeCapHours: integer("time_cap_hours"), // Hours included in fixed incident pricing
  overageHourlyRate: integer("overage_hourly_rate").default(7500), // $75/hour in cents for overage
  
  // Approval Workflow
  quoteGenerated: boolean("quote_generated").default(false),
  quoteData: jsonb("quote_data"), // Generated quote details
  clientApproved: boolean("client_approved").default(false),
  digitalSignature: text("digital_signature"),
  approvedAt: timestamp("approved_at"),
  revisionCount: integer("revision_count").default(0),
  revisionHistory: jsonb("revision_history"), // Array of revision changes
  
  // Status tracking
  status: text("status").default("pending"), // pending, quoted, approved, in_progress, dispatched, on_site, completed, cancelled
  assignedTo: integer("assigned_to").references(() => users.id),
  technicianId: integer("technician_id").references(() => users.id),
  internalNotes: text("internal_notes"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Field Technician Work Orders
export const fieldWorkOrders = pgTable("field_work_orders", {
  id: serial("id").primaryKey(),
  serviceRequestId: integer("service_request_id").references(() => serviceRequests.id).notNull(),
  technicianId: integer("technician_id").references(() => users.id).notNull(),
  
  // Time tracking
  dispatchedAt: timestamp("dispatched_at"),
  arrivedAt: timestamp("arrived_at"),
  departedAt: timestamp("departed_at"),
  totalHoursWorked: integer("total_hours_worked"), // minutes
  
  // Work details
  workDescription: text("work_description"),
  equipmentUsed: text("equipment_used").array(),
  partsReplaced: jsonb("parts_replaced"), // Array of {part, quantity, cost}
  
  // File uploads
  beforePhotos: text("before_photos").array(),
  afterPhotos: text("after_photos").array(),
  serviceReportFile: text("service_report_file"),
  additionalDocuments: text("additional_documents").array(),
  
  // Completion details
  workCompleted: boolean("work_completed").default(false),
  clientSignature: text("client_signature"),
  clientSignatureName: text("client_signature_name"),
  clientSignatureTimestamp: timestamp("client_signature_timestamp"),
  
  // Closing remarks
  closingRemarks: text("closing_remarks"),
  issuesEncountered: text("issues_encountered"),
  recommendedFollowUp: text("recommended_follow_up"),
  
  // Quality metrics
  workQualityRating: integer("work_quality_rating"), // 1-5 scale
  timeEfficiencyRating: integer("time_efficiency_rating"), // 1-5 scale
  
  status: text("status").default("assigned"), // assigned, en_route, on_site, completed, reviewed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// E1T1 CYST Field Service Report table
export const cystServiceReports = pgTable("cyst_service_reports", {
  id: serial("id").primaryKey(),
  workOrderId: integer("work_order_id").references(() => fieldWorkOrders.id).notNull(),
  technicianId: integer("technician_id").references(() => users.id).notNull(),
  
  // Business Information
  businessName: text("business_name").notNull(),
  businessDescription: text("business_description"),
  businessType: text("business_type"), // SMB Gen-Contracting, SMB (IT), Health, etc.
  
  // Technician Details
  technicianName: text("technician_name").notNull(),
  technicianContact: text("technician_contact"),
  serviceDate: date("service_date").notNull(),
  checkinTime: text("checkin_time"),
  checkoutTime: text("checkout_time"),
  
  // Organization Providing Service
  providerName: text("provider_name"),
  providerAddress: text("provider_address"),
  providerContact: text("provider_contact"),
  providerContactPerson: text("provider_contact_person"),
  providerPhone: text("provider_phone"),
  
  // Organization Receiving Service  
  receiverName: text("receiver_name"),
  receiverAddress: text("receiver_address"),
  receiverContact: text("receiver_contact"),
  receiverContactPerson: text("receiver_contact_person"),
  receiverPhone: text("receiver_phone"),
  
  // Service Types Performed (checkboxes)
  serviceDiagnosis: boolean("service_diagnosis").default(false),
  serviceCabling: boolean("service_cabling").default(false),
  serviceSoftwareInstallation: boolean("service_software_installation").default(false),
  serviceNetworkInstallation: boolean("service_network_installation").default(false),
  serviceVirusRemoval: boolean("service_virus_removal").default(false),
  serviceComputerOptimization: boolean("service_computer_optimization").default(false),
  serviceSos2a: boolean("service_sos2a").default(false),
  serviceWebsiteEncryption: boolean("service_website_encryption").default(false),
  serviceThreatModeling: boolean("service_threat_modeling").default(false),
  serviceWifiSetup: boolean("service_wifi_setup").default(false),
  serviceComputerMaintenance: boolean("service_computer_maintenance").default(false),
  
  // Service Details
  serviceTypes: text("service_types"), // Diagnosis, Cabling, etc.
  completionStatus: text("completion_status"), // Pending/In Progress/Completed
  workDescription: text("work_description"),
  
  // Devices worked on
  devices: jsonb("devices"), // Array of device records with Type, OS, Make, Model, S/N, Tagged, Counts
  
  // Follow-up
  followupRequired: boolean("followup_required").default(false),
  managerOnDuty: text("manager_on_duty"),
  managerSignature: text("manager_signature"),
  managerName: text("manager_name"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Technician Feedback System
export const technicianFeedback = pgTable("technician_feedback", {
  id: serial("id").primaryKey(),
  workOrderId: integer("work_order_id").references(() => fieldWorkOrders.id).notNull(),
  serviceRequestId: integer("service_request_id").references(() => serviceRequests.id).notNull(),
  technicianId: integer("technician_id").references(() => users.id).notNull(),
  
  // Feedback to company
  serviceQualityRating: integer("service_quality_rating"), // 1-5 scale
  communicationRating: integer("communication_rating"), // 1-5 scale
  siteAccessibilityRating: integer("site_accessibility_rating"), // 1-5 scale
  
  feedbackComments: text("feedback_comments"),
  improvementSuggestions: text("improvement_suggestions"),
  wouldWorkAgain: boolean("would_work_again"),
  
  // Internal feedback about the job
  jobComplexityRating: integer("job_complexity_rating"), // 1-5 scale
  resourcesAdequateRating: integer("resources_adequate_rating"), // 1-5 scale
  timeAllocationRating: integer("time_allocation_rating"), // 1-5 scale
  
  internalComments: text("internal_comments"),
  equipmentIssues: text("equipment_issues"),
  trainingNeeded: text("training_needed"),
  
  submittedAt: timestamp("submitted_at").defaultNow(),
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

// Service Tickets with custom naming convention
export const serviceTickets = pgTable("service_tickets", {
  id: serial("id").primaryKey(),
  ticketNumber: text("ticket_number").notNull().unique(), // SCCOLA20250809OHI00 format
  serviceRequestId: integer("service_request_id").references(() => serviceRequests.id).notNull(),
  workOrderId: integer("work_order_id").references(() => fieldWorkOrders.id),
  
  // Ticket components for search and tracking
  stateCode: text("state_code").notNull(), // SC
  cityCode: text("city_code").notNull(), // COLA
  ticketDate: date("ticket_date").notNull(), // Date ticket was created
  companyCode: text("company_code").notNull(), // OHI
  chronologicalNumber: integer("chronological_number").notNull(), // 00, 01, 02, etc.
  
  // Ticket status and tracking
  status: text("status").default("open"), // open, assigned, in_progress, completed, closed, cancelled
  priority: text("priority").default("medium"), // low, medium, high, critical
  
  // Assignment and tracking
  assignedTechnicianId: integer("assigned_technician_id").references(() => users.id),
  assignedAt: timestamp("assigned_at"),
  completedAt: timestamp("completed_at"),
  
  // Additional tracking info
  clientCompanyName: text("client_company_name").notNull(),
  clientLocation: text("client_location").notNull(),
  serviceDescription: text("service_description"),
  internalNotes: text("internal_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  phone: true,
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

// Service Ticket schemas
export const insertServiceTicketSchema = z.object({
  serviceRequestId: z.number(),
  workOrderId: z.number().optional(),
  stateCode: z.string().length(2, "State code must be 2 characters"),
  cityCode: z.string().length(4, "City code must be 4 characters"),
  companyCode: z.string().length(3, "Company code must be 3 characters"),
  clientCompanyName: z.string().min(1, "Client company name is required"),
  clientLocation: z.string().min(1, "Client location is required"),
  serviceDescription: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
});

export const searchTicketSchema = z.object({
  chronologicalNumber: z.number().min(0).optional(),
  status: z.enum(["open", "assigned", "in_progress", "completed", "closed", "cancelled"]).optional(),
  stateCode: z.string().length(2).optional(),
  cityCode: z.string().length(4).optional(),
  companyCode: z.string().length(3).optional(),
  assignedTechnicianId: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type InsertServiceTicket = z.infer<typeof insertServiceTicketSchema>;
export type ServiceTicket = typeof serviceTickets.$inferSelect;
export type SearchTicket = z.infer<typeof searchTicketSchema>;

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

// User registration and authentication schemas
export const insertClientAccountSchema = createInsertSchema(clientAccounts);
export const insertTechnicianProfileSchema = createInsertSchema(technicianProfiles);

export const userRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyName: z.string().optional(),
  serviceRequestId: z.number().optional(),
});

export const emailVerificationSchema = z.object({
  token: z.string().min(32, "Invalid verification token"),
  email: z.string().email("Invalid email address"),
});

export const mfaVerificationSchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
  email: z.string().email("Invalid email address"),
});

export type ClientAccount = typeof clientAccounts.$inferSelect;
export type InsertClientAccount = z.infer<typeof insertClientAccountSchema>;
export type TechnicianProfile = typeof technicianProfiles.$inferSelect;
export type InsertTechnicianProfile = z.infer<typeof insertTechnicianProfileSchema>;
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type EmailVerification = z.infer<typeof emailVerificationSchema>;
export type MfaVerification = z.infer<typeof mfaVerificationSchema>;

// Service Request Schemas
export const insertServiceRequestSchema = createInsertSchema(serviceRequests, {
  companyName: z.string().min(2, "Company name is required"),
  contactPersonName: z.string().min(2, "Contact person name is required"),
  contactPersonTitle: z.string().min(2, "Contact person title is required"),
  primaryEmail: z.string().email("Valid email is required"),
  secondaryEmail: z.string().email("Valid email format").optional().or(z.literal("")),
  officePhone: z.string().optional().or(z.literal("")),
  mobilePhone: z.string().optional().or(z.literal("")),
  address: z.any().optional(),
  selectedServices: z.any().optional(),
  preferredContactMethod: z.enum(["email", "phone", "mobile"], {
    required_error: "Preferred contact method is required"
  }),
  serviceCategory: z.enum(["Help Desk & Support", "IT Services", "Industry-Specific Services", "Emergency Services", "Managed Services"], {
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

// Field Work Order Schemas
export const insertFieldWorkOrderSchema = createInsertSchema(fieldWorkOrders, {
  serviceRequestId: z.number().positive("Service request ID is required"),
  technicianId: z.number().positive("Technician ID is required"),
  workDescription: z.string().min(10, "Work description must be at least 10 characters"),
  closingRemarks: z.string().min(5, "Closing remarks are required"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateFieldWorkOrderSchema = z.object({
  arrivedAt: z.string().datetime().optional(),
  departedAt: z.string().datetime().optional(),
  workDescription: z.string().optional(),
  equipmentUsed: z.array(z.string()).optional(),
  partsReplaced: z.any().optional(),
  beforePhotos: z.array(z.string()).optional(),
  afterPhotos: z.array(z.string()).optional(),
  serviceReportFile: z.string().optional(),
  additionalDocuments: z.array(z.string()).optional(),
  workCompleted: z.boolean().optional(),
  clientSignature: z.string().optional(),
  clientSignatureName: z.string().optional(),
  closingRemarks: z.string().optional(),
  issuesEncountered: z.string().optional(),
  recommendedFollowUp: z.string().optional(),
  status: z.enum(["assigned", "en_route", "on_site", "completed", "reviewed"]).optional(),
});

// Technician Feedback Schemas  
export const insertTechnicianFeedbackSchema = createInsertSchema(technicianFeedback, {
  workOrderId: z.number().positive("Work order ID is required"),
  serviceRequestId: z.number().positive("Service request ID is required"),
  technicianId: z.number().positive("Technician ID is required"),
  serviceQualityRating: z.number().min(1).max(5),
  communicationRating: z.number().min(1).max(5),
  siteAccessibilityRating: z.number().min(1).max(5),
  feedbackComments: z.string().min(10, "Feedback comments must be at least 10 characters"),
}).omit({
  id: true,
  submittedAt: true,
});

export type InsertFieldWorkOrder = z.infer<typeof insertFieldWorkOrderSchema>;
export type FieldWorkOrder = typeof fieldWorkOrders.$inferSelect;
export type UpdateFieldWorkOrder = z.infer<typeof updateFieldWorkOrderSchema>;

export type InsertTechnicianFeedback = z.infer<typeof insertTechnicianFeedbackSchema>;

// CYST Service Report schemas
export const insertCystServiceReportSchema = createInsertSchema(cystServiceReports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCystServiceReport = z.infer<typeof insertCystServiceReportSchema>;
export type CystServiceReport = typeof cystServiceReports.$inferSelect;
export type TechnicianFeedback = typeof technicianFeedback.$inferSelect;

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

// CYST Reports for legal compliance (E1T1 Tech Field Technician Service Report)
export const cystReports = pgTable("cyst_reports", {
  id: serial("id").primaryKey(),
  workOrderId: integer("work_order_id").references(() => fieldWorkOrders.id),
  technicianId: integer("technician_id").references(() => users.id),
  reportNumber: text("report_number").notNull().unique(), // Auto-generated unique number
  
  // Business Information
  businessName: text("business_name").notNull(),
  businessDescription: text("business_description"),
  businessType: text("business_type").array(), // SMB Gen-Contracting, SMB (IT), etc.
  
  // Technician Details
  technicianName: text("technician_name").notNull(),
  technicianContact: text("technician_contact"),
  serviceDate: date("service_date").notNull(),
  checkinTime: text("checkin_time"),
  checkoutTime: text("checkout_time"),
  
  // Service Organization Details
  providerName: text("provider_name"),
  providerAddress: text("provider_address"),
  providerContact: text("provider_contact"),
  providerContactPerson: text("provider_contact_person"),
  
  receiverName: text("receiver_name"),
  receiverAddress: text("receiver_address"),
  receiverContact: text("receiver_contact"),
  receiverContactPerson: text("receiver_contact_person"),
  
  // Service Details
  serviceTypes: text("service_types"),
  completionStatus: text("completion_status").notNull(), // Pending, In Progress, Completed
  workDescription: text("work_description"),
  servicesPerformed: text("services_performed").array(), // Diagnosis, Cabling, etc.
  
  // Device Information (JSON array of devices)
  deviceInfo: jsonb("device_info"), // [{type, os, make, model, serial, tagged, count}]
  
  // Follow-up and Legal
  followupRequired: boolean("followup_required").default(false),
  managerName: text("manager_name"), // Manager on Duty
  managerSignature: text("manager_signature"), // Digital signature
  managerSignedAt: timestamp("manager_signed_at"),
  technicianSignature: text("technician_signature"),
  technicianSignedAt: timestamp("technician_signed_at"),
  
  // Document Management
  pdfUrl: text("pdf_url"), // URL to signed PDF document
  documentHash: text("document_hash"), // For integrity verification
  legallyValid: boolean("legally_valid").default(false),
  
  // Audit Trail
  status: text("status").default("draft"), // draft, signed, submitted, approved
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Photos attached to CYST reports
export const cystPhotos = pgTable("cyst_photos", {
  id: serial("id").primaryKey(),
  cystReportId: integer("cyst_report_id").references(() => cystReports.id),
  workOrderId: integer("work_order_id").references(() => fieldWorkOrders.id),
  technicianId: integer("technician_id").references(() => users.id),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  fileUrl: text("file_url").notNull(), // Object storage URL
  photoType: text("photo_type").notNull(), // before, after, during
  description: text("description"),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// CYST Report schemas
export const insertCystReportSchema = z.object({
  workOrderId: z.number().optional(),
  technicianId: z.number(),
  businessName: z.string().min(1, "Business name is required"),
  businessDescription: z.string().optional(),
  businessType: z.array(z.string()).optional(),
  technicianName: z.string().min(1, "Technician name is required"),
  technicianContact: z.string().optional(),
  serviceDate: z.string(), // Will be converted to date
  checkinTime: z.string().optional(),
  checkoutTime: z.string().optional(),
  providerName: z.string().optional(),
  providerAddress: z.string().optional(),
  providerContact: z.string().optional(),
  providerContactPerson: z.string().optional(),
  receiverName: z.string().optional(),
  receiverAddress: z.string().optional(),
  receiverContact: z.string().optional(),
  receiverContactPerson: z.string().optional(),
  serviceTypes: z.string().optional(),
  completionStatus: z.enum(["Pending", "In Progress", "Completed"]),
  workDescription: z.string().optional(),
  servicesPerformed: z.array(z.string()).optional(),
  deviceInfo: z.any().optional(),
  followupRequired: z.boolean().default(false),
  managerName: z.string().optional(),
  managerSignature: z.string().optional(),
  technicianSignature: z.string().optional(),
});

export const insertCystPhotoSchema = z.object({
  cystReportId: z.number().optional(),
  workOrderId: z.number().optional(),
  technicianId: z.number(),
  filename: z.string(),
  originalName: z.string(),
  fileUrl: z.string(),
  photoType: z.enum(["before", "after", "during"]),
  description: z.string().optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
});

export type InsertCystReport = z.infer<typeof insertCystReportSchema>;
export type CystReport = typeof cystReports.$inferSelect;

export type InsertCystPhoto = z.infer<typeof insertCystPhotoSchema>;
export type CystPhoto = typeof cystPhotos.$inferSelect;
