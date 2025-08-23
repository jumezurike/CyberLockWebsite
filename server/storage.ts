import { 
  users, 
  type User, 
  type InsertUser, 
  type Assessment, 
  type InsertAssessment, 
  assessments, 
  earlyAccessSubmissions, 
  type InsertEarlyAccessSubmission, 
  type EarlyAccessSubmission,
  rasbitaReports,
  type InsertRasbitaReport,
  type RasbitaReport,
  uwas,
  type InsertUwa,
  type Uwa,
  visitorSessions,
  visitorPageViews,
  type InsertVisitorSession,
  type VisitorSession,
  type InsertVisitorPageView,
  type VisitorPageView,
  viewerInvitations,
  type ViewerInvitation,
  type InsertViewerInvitation,
  clientAccounts,
  serviceRequests,
  serviceCatalog,
  teamAvailability,
  fieldWorkOrders,
  technicianProfiles,
  technicianFeedback,
  cystServiceReports,
  serviceTickets,
  cystReports,
  cystPhotos,
  type ServiceRequest,
  type InsertServiceRequest,
  type ServiceCatalog,
  type TeamAvailability,
  type FieldWorkOrder,
  type InsertFieldWorkOrder,
  type UpdateFieldWorkOrder,
  type TechnicianFeedback,
  type InsertTechnicianFeedback,
  type CystServiceReport,
  type InsertCystServiceReport,
  type ServiceTicket,
  type InsertServiceTicket,
  type SearchTicket,
  type CystReport,
  type InsertCystReport,
  type CystPhoto,
  type InsertCystPhoto
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, and } from "drizzle-orm";

// Interface for storage operations
// Interface for assessment search parameters
export interface AssessmentSearchParams {
  companyName?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface AnalyticsMetrics {
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsers30Days: number;
  paidUsers: number;
  totalRevenue: number;
  assessmentsCompleted: number;
  earlyAccessSubmissions: number;
  monthOverMonthGrowth: number;
  completedAssessmentsThisMonth: number;
  earlyAccessSubmissionsThisMonth: number;
}

export interface MonthlyGrowthData {
  month: string;
  users: number;
  revenue: number;
  assessments: number;
}

export interface VisitorAnalytics {
  totalVisitors: number;
  uniqueVisitorsToday: number;
  uniqueVisitorsThisMonth: number;
  totalPageViews: number;
  pageViewsToday: number;
  averageSessionDuration: number;
  topPages: Array<{ page: string; views: number }>;
  trafficSources: Array<{ source: string; visitors: number }>;
}

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Admin user operations
  getAllAdminUsers(): Promise<User[]>;
  createAdminUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: number, hashedPassword: string): Promise<boolean>;
  deleteAdminUser(id: number): Promise<boolean>;
  
  // Assessment operations
  getAllAssessments(): Promise<Assessment[]>;
  searchAssessments(params: AssessmentSearchParams): Promise<Assessment[]>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: number, assessment: InsertAssessment): Promise<Assessment | undefined>;
  deleteAssessment(id: number): Promise<boolean>;
  
  // Early Access operations
  getAllEarlyAccessSubmissions(): Promise<EarlyAccessSubmission[]>;
  getEarlyAccessSubmission(id: number): Promise<EarlyAccessSubmission | undefined>;
  createEarlyAccessSubmission(submission: InsertEarlyAccessSubmission): Promise<EarlyAccessSubmission>;
  updateEarlyAccessSubmissionStatus(id: number, status: string): Promise<EarlyAccessSubmission | undefined>;
  deleteEarlyAccessSubmission(id: number): Promise<boolean>;
  
  // RASBITA operations
  getAllRasbitaReports(): Promise<RasbitaReport[]>;
  getRasbitaReportById(id: number): Promise<RasbitaReport | undefined>;
  createRasbitaReport(report: InsertRasbitaReport): Promise<RasbitaReport>;
  updateRasbitaReport(id: number, report: InsertRasbitaReport): Promise<RasbitaReport | undefined>;
  deleteRasbitaReport(id: number): Promise<boolean>;
  getRasbitaReportsByUser(userId: number): Promise<RasbitaReport[]>;
  
  // UWA operations
  getAllUwas(): Promise<Uwa[]>;
  getUwaById(id: number): Promise<Uwa | undefined>;
  getUwasByUserId(userId: number): Promise<Uwa[]>;
  getUwasByIdentityType(identityType: string): Promise<Uwa[]>;
  createUwa(uwa: InsertUwa): Promise<Uwa>;
  updateUwa(id: number, uwa: InsertUwa): Promise<Uwa | undefined>;
  deleteUwa(id: number): Promise<boolean>;
  
  // Analytics operations
  getAnalyticsMetrics(): Promise<AnalyticsMetrics>;
  getMonthlyGrowthData(): Promise<MonthlyGrowthData[]>;
  trackPayment(userId: number, amount: number, paymentId: string, productType: string): Promise<void>;
  
  // Visitor tracking operations
  createVisitorSession(session: InsertVisitorSession): Promise<VisitorSession>;
  updateVisitorSession(sessionId: string, data: { sessionEnd?: Date; sessionDuration?: number; totalPageViews?: number }): Promise<void>;
  createVisitorPageView(pageView: InsertVisitorPageView): Promise<VisitorPageView>;
  getVisitorAnalytics(): Promise<VisitorAnalytics>;
  getVisitorSession(sessionId: string): Promise<VisitorSession | undefined>;

  // Client account operations
  createClientAccount(account: any): Promise<any>;
  getClientAccountByUserId(userId: number): Promise<any>;
  getClientAccountByVerificationToken(token: string): Promise<any>;
  updateClientAccount(id: number, updates: any): Promise<any>;
  updateUser(id: number, updates: any): Promise<any>;

  // Service Request operations
  getAllServiceRequests(): Promise<ServiceRequest[]>;
  getServiceRequestById(id: number): Promise<ServiceRequest | undefined>;
  getServiceRequest(id: number): Promise<ServiceRequest | undefined>;
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  updateServiceRequest(id: number, request: Partial<ServiceRequest>): Promise<ServiceRequest | undefined>;
  deleteServiceRequest(id: number): Promise<boolean>;

  // Field Work Order operations
  getAllFieldWorkOrders(): Promise<FieldWorkOrder[]>;
  getFieldWorkOrderById(id: number): Promise<FieldWorkOrder | undefined>;
  getFieldWorkOrdersByTechnician(technicianId: number): Promise<FieldWorkOrder[]>;
  getFieldWorkOrdersByServiceRequest(serviceRequestId: number): Promise<FieldWorkOrder[]>;
  getWorkOrdersByServiceRequestId(serviceRequestId: number): Promise<FieldWorkOrder[]>;
  createFieldWorkOrder(workOrder: InsertFieldWorkOrder): Promise<FieldWorkOrder>;
  updateFieldWorkOrder(id: number, updates: UpdateFieldWorkOrder): Promise<FieldWorkOrder | undefined>;
  
  // Technician Feedback operations
  getAllTechnicianFeedback(): Promise<TechnicianFeedback[]>;
  getTechnicianFeedbackById(id: number): Promise<TechnicianFeedback | undefined>;
  getTechnicianFeedbackByWorkOrder(workOrderId: number): Promise<TechnicianFeedback | undefined>;
  createTechnicianFeedback(feedback: InsertTechnicianFeedback): Promise<TechnicianFeedback>;

  // Service Ticket operations
  getAllServiceTickets(): Promise<ServiceTicket[]>;
  getServiceTicketById(id: number): Promise<ServiceTicket | undefined>;
  getServiceTicketByNumber(ticketNumber: string): Promise<ServiceTicket | undefined>;
  searchServiceTickets(searchParams: SearchTicket): Promise<ServiceTicket[]>;
  createServiceTicket(ticket: InsertServiceTicket): Promise<ServiceTicket>;
  updateServiceTicket(id: number, updates: Partial<ServiceTicket>): Promise<ServiceTicket | undefined>;
  assignTicketToTechnician(ticketId: number, technicianId: number): Promise<ServiceTicket | undefined>;
  updateTicketStatus(ticketId: number, status: string): Promise<ServiceTicket | undefined>;
  getNextChronologicalNumber(): Promise<number>;
  
  // CYST Reports for legal compliance
  createCystReport(report: InsertCystReport): Promise<CystReport>;
  getCystReport(id: number): Promise<CystReport | undefined>;
  getCystReports(): Promise<CystReport[]>;
  getCystReportsByTechnician(technicianId: number): Promise<CystReport[]>;
  getCystReportsByWorkOrder(workOrderId: number): Promise<CystReport[]>;
  updateCystReport(id: number, report: Partial<InsertCystReport>): Promise<CystReport | undefined>;
  updateCystReportStatus(id: number, status: string): Promise<CystReport | undefined>;
  deleteCystReport(id: number): Promise<void>;
  generateCystReportNumber(): Promise<string>;
  
  // CYST Photos
  createCystPhoto(photo: InsertCystPhoto): Promise<CystPhoto>;
  getCystPhoto(id: number): Promise<CystPhoto | undefined>;
  getCystPhotosByReport(cystReportId: number): Promise<CystPhoto[]>;
  getCystPhotosByWorkOrder(workOrderId: number): Promise<CystPhoto[]>;
  deleteCystPhoto(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        username: insertUser.username,
        password: insertUser.password,
        fullName: insertUser.fullName || null,
        email: insertUser.email || null,
        companyName: insertUser.companyName || null,
        role: insertUser.role || "user",
        createdAt: new Date(),
      })
      .returning();
    return user;
  }

  // Admin user operations
  async getAllAdminUsers(): Promise<User[]> {
    return await db.select().from(users).where(sql`role IN ('admin', 'super_admin', 'viewer')`);
  }

  async createAdminUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values({
      username: user.username,
      password: user.password,
      fullName: user.fullName || null,
      email: user.email || null,
      companyName: user.companyName || null,
      role: user.role || "admin",
      createdAt: new Date(),
    }).returning();
    return newUser;
  }

  async updateUserPassword(id: number, hashedPassword: string): Promise<boolean> {
    const result = await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async deleteAdminUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Assessment operations
  async getAllAssessments(): Promise<Assessment[]> {
    return await db.select().from(assessments).where(eq(assessments.isDeleted, false));
  }
  
  async searchAssessments(params: AssessmentSearchParams): Promise<Assessment[]> {
    let conditions = [];
    
    // Filter by company name if provided (case insensitive partial match)
    if (params.companyName) {
      conditions.push(
        sql`LOWER(${assessments.businessName}) LIKE LOWER(${'%' + params.companyName + '%'})`
      );
    }
    
    // Filter by date range if provided
    if (params.fromDate) {
      conditions.push(
        sql`${assessments.createdAt} >= ${params.fromDate}`
      );
    }
    
    if (params.toDate) {
      // Add one day to include the end date fully
      const toDatePlusOneDay = new Date(params.toDate);
      toDatePlusOneDay.setDate(toDatePlusOneDay.getDate() + 1);
      
      conditions.push(
        sql`${assessments.createdAt} < ${toDatePlusOneDay}`
      );
    }
    
    // If we have conditions, add them to the query
    if (conditions.length > 0) {
      // Combine all conditions with AND
      const whereClause = conditions.reduce((acc, condition) => {
        if (acc === null) return condition;
        return sql`${acc} AND ${condition}`;
      }, null as any);
      
      return await db.select()
        .from(assessments)
        .where(whereClause)
        .orderBy(desc(assessments.createdAt));
    }
    
    // If no conditions, return all assessments ordered by most recent first
    return await db.select()
      .from(assessments)
      .orderBy(desc(assessments.createdAt));
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    const [assessment] = await db.select().from(assessments).where(eq(assessments.id, id));
    return assessment;
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    // Calculate security score
    const securityScore = this.calculateSecurityScore(insertAssessment);
    
    const [assessment] = await db
      .insert(assessments)
      .values({
        userId: insertAssessment.userId || null,
        businessName: insertAssessment.businessName,
        industry: insertAssessment.industry,
        employeeCount: insertAssessment.employeeCount,
        securityMeasures: insertAssessment.securityMeasures || [],
        primaryConcerns: insertAssessment.primaryConcerns || [],
        contactInfo: insertAssessment.contactInfo,
        reportType: insertAssessment.reportType,
        securityScore,
        matrixData: insertAssessment.matrixData || null,
        findings: insertAssessment.findings || null,
        recommendations: insertAssessment.recommendations || null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return assessment;
  }

  async updateAssessment(id: number, updatedAssessment: InsertAssessment): Promise<Assessment | undefined> {
    // Check if assessment exists
    const existingAssessment = await this.getAssessment(id);
    if (!existingAssessment) {
      return undefined;
    }
    
    // Calculate security score
    const securityScore = this.calculateSecurityScore(updatedAssessment);
    
    const [assessment] = await db
      .update(assessments)
      .set({
        userId: updatedAssessment.userId || existingAssessment.userId,
        businessName: updatedAssessment.businessName,
        industry: updatedAssessment.industry,
        employeeCount: updatedAssessment.employeeCount,
        securityMeasures: updatedAssessment.securityMeasures || existingAssessment.securityMeasures,
        primaryConcerns: updatedAssessment.primaryConcerns || existingAssessment.primaryConcerns,
        contactInfo: updatedAssessment.contactInfo,
        reportType: updatedAssessment.reportType,
        securityScore,
        matrixData: updatedAssessment.matrixData || existingAssessment.matrixData,
        findings: updatedAssessment.findings || existingAssessment.findings,
        recommendations: updatedAssessment.recommendations || existingAssessment.recommendations,
        updatedAt: new Date()
      })
      .where(eq(assessments.id, id))
      .returning();
    
    return assessment;
  }

  async deleteAssessment(id: number): Promise<boolean> {
    const result = await db
      .delete(assessments)
      .where(eq(assessments.id, id));
    
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  private calculateSecurityScore(assessment: InsertAssessment): number {
    // This is a simple algorithm to calculate a security score
    // In a real implementation, this would be more sophisticated
    
    // Base score
    let score = 40;
    
    // Add points for each security measure (max 30 points)
    if (assessment.securityMeasures) {
      score += Math.min(assessment.securityMeasures.length * 3, 30);
    }
    
    // Subtract points for each primary concern (max 20 points penalty)
    if (assessment.primaryConcerns) {
      score -= Math.min(assessment.primaryConcerns.length * 2, 20);
    }
    
    // Add points for matrix data completeness (max 20 points)
    if (assessment.matrixData) {
      score += 20;
    }
    
    // Add points for comprehensive report type (10 points)
    if (assessment.reportType === "comprehensive") {
      score += 10;
    }
    
    // Ensure the score is between 0 and 100
    return Math.max(0, Math.min(score, 100));
  }
  
  // Early Access operations
  async getAllEarlyAccessSubmissions(): Promise<EarlyAccessSubmission[]> {
    return await db.select().from(earlyAccessSubmissions);
  }

  async getEarlyAccessSubmission(id: number): Promise<EarlyAccessSubmission | undefined> {
    const [submission] = await db.select().from(earlyAccessSubmissions).where(eq(earlyAccessSubmissions.id, id));
    return submission;
  }

  async createEarlyAccessSubmission(submission: InsertEarlyAccessSubmission): Promise<EarlyAccessSubmission> {
    const [newSubmission] = await db
      .insert(earlyAccessSubmissions)
      .values({
        fullName: submission.fullName,
        email: submission.email,
        company: submission.company,
        phone: submission.phone,
        companySize: submission.companySize,
        industry: submission.industry,
        interestedIn: submission.interestedIn,
        investmentLevel: submission.investmentLevel,
        additionalInfo: submission.additionalInfo || null,
        status: submission.status || "pending",
        createdAt: new Date()
      })
      .returning();
    
    return newSubmission;
  }

  async updateEarlyAccessSubmissionStatus(id: number, status: string): Promise<EarlyAccessSubmission | undefined> {
    const existingSubmission = await this.getEarlyAccessSubmission(id);
    if (!existingSubmission) {
      return undefined;
    }
    
    const [submission] = await db
      .update(earlyAccessSubmissions)
      .set({ status })
      .where(eq(earlyAccessSubmissions.id, id))
      .returning();
    
    return submission;
  }

  async deleteEarlyAccessSubmission(id: number): Promise<boolean> {
    const result = await db
      .delete(earlyAccessSubmissions)
      .where(eq(earlyAccessSubmissions.id, id));
    
    return result.rowCount !== null && result.rowCount > 0;
  }

  // RASBITA operations
  async getAllRasbitaReports(): Promise<RasbitaReport[]> {
    return await db.select().from(rasbitaReports);
  }

  async getRasbitaReportById(id: number): Promise<RasbitaReport | undefined> {
    const [report] = await db.select().from(rasbitaReports).where(eq(rasbitaReports.id, id));
    return report;
  }

  async createRasbitaReport(report: InsertRasbitaReport): Promise<RasbitaReport> {
    const [newReport] = await db
      .insert(rasbitaReports)
      .values({
        userId: report.userId || null,
        businessId: report.businessId || `business-${Date.now()}`,
        title: report.title,
        incidentCategory: report.incidentCategory,
        overallRiskScore: report.overallRiskScore.toString(),
        company: report.company,
        incident: report.incident,
        riskItems: report.riskItems,
        rasbitaCategories: report.rasbitaCategories,
        financialSummary: report.financialSummary,
        dashboard: report.dashboard,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return newReport;
  }

  async updateRasbitaReport(id: number, updatedReport: InsertRasbitaReport): Promise<RasbitaReport | undefined> {
    const existingReport = await this.getRasbitaReportById(id);
    if (!existingReport) {
      return undefined;
    }
    
    const [report] = await db
      .update(rasbitaReports)
      .set({
        title: updatedReport.title,
        incidentCategory: updatedReport.incidentCategory,
        overallRiskScore: updatedReport.overallRiskScore.toString(),
        company: updatedReport.company,
        incident: updatedReport.incident,
        riskItems: updatedReport.riskItems,
        rasbitaCategories: updatedReport.rasbitaCategories,
        financialSummary: updatedReport.financialSummary,
        dashboard: updatedReport.dashboard,
        updatedAt: new Date()
      })
      .where(eq(rasbitaReports.id, id))
      .returning();
    
    return report;
  }

  async deleteRasbitaReport(id: number): Promise<boolean> {
    await db
      .delete(rasbitaReports)
      .where(eq(rasbitaReports.id, id));
    
    // Check if the report still exists
    const report = await this.getRasbitaReportById(id);
    return !report;
  }

  async getRasbitaReportsByUser(userId: number): Promise<RasbitaReport[]> {
    return await db
      .select()
      .from(rasbitaReports)
      .where(eq(rasbitaReports.userId, userId));
  }

  // UWA operations
  async getAllUwas(): Promise<Uwa[]> {
    return await db.select().from(uwas);
  }

  async getUwaById(id: number): Promise<Uwa | undefined> {
    const [uwa] = await db.select().from(uwas).where(eq(uwas.id, id));
    return uwa;
  }

  async getUwasByUserId(userId: number): Promise<Uwa[]> {
    return await db
      .select()
      .from(uwas)
      .where(eq(uwas.userId, userId));
  }

  async getUwasByIdentityType(identityType: string): Promise<Uwa[]> {
    return await db
      .select()
      .from(uwas)
      .where(eq(uwas.identityType, identityType));
  }

  async createUwa(insertUwa: InsertUwa): Promise<Uwa> {
    const [uwa] = await db
      .insert(uwas)
      .values({
        userId: insertUwa.userId || null,
        assessmentId: insertUwa.assessmentId || null,
        identityType: insertUwa.identityType,
        machineType: insertUwa.machineType || null,
        associatedName: insertUwa.associatedName || null,
        uwaValue: insertUwa.uwaValue,
        componentData: insertUwa.componentData || {},
        status: insertUwa.status || "active",
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return uwa;
  }

  async updateUwa(id: number, updatedUwa: InsertUwa): Promise<Uwa | undefined> {
    const existingUwa = await this.getUwaById(id);
    if (!existingUwa) {
      return undefined;
    }
    
    const [uwa] = await db
      .update(uwas)
      .set({
        identityType: updatedUwa.identityType,
        machineType: updatedUwa.machineType || existingUwa.machineType,
        associatedName: updatedUwa.associatedName || existingUwa.associatedName,
        uwaValue: updatedUwa.uwaValue,
        componentData: updatedUwa.componentData || existingUwa.componentData,
        status: updatedUwa.status || existingUwa.status,
        updatedAt: new Date()
      })
      .where(eq(uwas.id, id))
      .returning();
    
    return uwa;
  }

  async deleteUwa(id: number): Promise<boolean> {
    await db
      .delete(uwas)
      .where(eq(uwas.id, id));
    
    // Check if the UWA still exists
    const uwa = await this.getUwaById(id);
    return !uwa;
  }

  // Analytics operations
  async getAnalyticsMetrics(): Promise<AnalyticsMetrics> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Get total users count
    const [totalUsersResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    const totalUsers = totalUsersResult?.count || 0;

    // Get new users this month
    const [newUsersResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`${users.createdAt} >= ${firstOfThisMonth}`);
    const newUsersThisMonth = newUsersResult?.count || 0;

    // Get active users (simplified approach - users with recent assessments)
    const [activeUsersResult] = await db
      .select({ count: sql<number>`count(DISTINCT ${assessments.userId})` })
      .from(assessments)
      .where(sql`${assessments.createdAt} >= ${thirtyDaysAgo}`);
    const activeUsers30Days = activeUsersResult?.count || 0;

    // Calculate paid users from Stripe payments (placeholder - will be implemented when payment tracking is added)
    const paidUsers = 0;
    const totalRevenue = 0;

    // Get completed assessments count
    const [assessmentsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(assessments)
      .where(sql`${assessments.status} = 'completed'`);
    const assessmentsCompleted = assessmentsResult?.count || 0;

    // Get completed assessments this month
    const [assessmentsThisMonthResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(assessments)
      .where(sql`${assessments.status} = 'completed' AND ${assessments.createdAt} >= ${firstOfThisMonth}`);
    const completedAssessmentsThisMonth = assessmentsThisMonthResult?.count || 0;

    // Get early access submissions count
    const [earlyAccessResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(earlyAccessSubmissions);
    const earlyAccessSubmissionsCount = earlyAccessResult?.count || 0;

    // Get early access submissions this month
    const [earlyAccessThisMonthResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(earlyAccessSubmissions)
      .where(sql`${earlyAccessSubmissions.createdAt} >= ${firstOfThisMonth}`);
    const earlyAccessSubmissionsThisMonth = earlyAccessThisMonthResult?.count || 0;

    // Calculate month-over-month growth for users
    const [lastMonthUsersResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`${users.createdAt} >= ${firstOfLastMonth} AND ${users.createdAt} < ${firstOfThisMonth}`);
    const lastMonthUsers = lastMonthUsersResult?.count || 1; // Avoid division by zero
    
    const monthOverMonthGrowth = lastMonthUsers > 0 
      ? Math.round(((newUsersThisMonth - lastMonthUsers) / lastMonthUsers) * 100)
      : 0;

    return {
      totalUsers,
      newUsersThisMonth,
      activeUsers30Days,
      paidUsers,
      totalRevenue,
      assessmentsCompleted,
      earlyAccessSubmissions: earlyAccessSubmissionsCount,
      monthOverMonthGrowth,
      completedAssessmentsThisMonth,
      earlyAccessSubmissionsThisMonth
    };
  }

  async getMonthlyGrowthData(): Promise<MonthlyGrowthData[]> {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

    // Get monthly user registration data
    const monthlyData = await db
      .select({
        month: sql<string>`TO_CHAR(${users.createdAt}, 'YYYY-MM')`,
        users: sql<number>`count(*)`
      })
      .from(users)
      .where(sql`${users.createdAt} >= ${sixMonthsAgo}`)
      .groupBy(sql`TO_CHAR(${users.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${users.createdAt}, 'YYYY-MM')`);

    // Get monthly assessment completion data
    const monthlyAssessments = await db
      .select({
        month: sql<string>`TO_CHAR(${assessments.createdAt}, 'YYYY-MM')`,
        assessments: sql<number>`count(*)`
      })
      .from(assessments)
      .where(sql`${assessments.createdAt} >= ${sixMonthsAgo} AND ${assessments.status} = 'completed'`)
      .groupBy(sql`TO_CHAR(${assessments.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${assessments.createdAt}, 'YYYY-MM')`);

    // Combine data by month
    const monthlyMap = new Map<string, MonthlyGrowthData>();

    monthlyData.forEach(data => {
      monthlyMap.set(data.month, {
        month: data.month,
        users: data.users,
        revenue: 0, // Will be populated when payment tracking is implemented
        assessments: 0
      });
    });

    monthlyAssessments.forEach(data => {
      const existing = monthlyMap.get(data.month);
      if (existing) {
        existing.assessments = data.assessments;
      } else {
        monthlyMap.set(data.month, {
          month: data.month,
          users: 0,
          revenue: 0,
          assessments: data.assessments
        });
      }
    });

    return Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month));
  }

  async trackPayment(userId: number, amount: number, paymentId: string, productType: string): Promise<void> {
    // This method will be implemented when payment tracking tables are created
    // For now, this is a placeholder for future Stripe integration
    console.log(`Payment tracked: User ${userId}, Amount: $${amount/100}, Payment ID: ${paymentId}, Type: ${productType}`);
  }

  // Visitor tracking operations
  async createVisitorSession(session: InsertVisitorSession): Promise<VisitorSession> {
    const [newSession] = await db
      .insert(visitorSessions)
      .values({
        sessionId: session.sessionId,
        ipAddress: session.ipAddress || null,
        userAgent: session.userAgent || null,
        referrerUrl: session.referrerUrl || null,
        landingPage: session.landingPage,
        country: session.country || null,
        region: session.region || null,
        isBot: session.isBot || false,
        sessionStart: new Date(),
        lastActivity: new Date(),
        totalPageViews: 1,
        sessionDuration: 0
      })
      .returning();
    return newSession;
  }

  async updateVisitorSession(sessionId: string, data: { sessionEnd?: Date; sessionDuration?: number; totalPageViews?: number }): Promise<void> {
    const updateData: any = { lastActivity: new Date() };
    
    if (data.sessionEnd) {
      updateData.sessionEnd = data.sessionEnd;
    }
    if (data.sessionDuration !== undefined) {
      updateData.sessionDuration = data.sessionDuration;
    }
    if (data.totalPageViews !== undefined) {
      updateData.totalPageViews = data.totalPageViews;
    }

    await db
      .update(visitorSessions)
      .set(updateData)
      .where(eq(visitorSessions.sessionId, sessionId));
  }

  async createVisitorPageView(pageView: InsertVisitorPageView): Promise<VisitorPageView> {
    const [newPageView] = await db
      .insert(visitorPageViews)
      .values({
        sessionId: pageView.sessionId,
        page: pageView.page,
        title: pageView.title || null,
        timeOnPage: pageView.timeOnPage || 0,
        timestamp: new Date()
      })
      .returning();
    return newPageView;
  }

  async getVisitorSession(sessionId: string): Promise<VisitorSession | undefined> {
    const [session] = await db
      .select()
      .from(visitorSessions)
      .where(eq(visitorSessions.sessionId, sessionId));
    return session;
  }

  async getVisitorAnalytics(): Promise<VisitorAnalytics> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get total unique visitors
    const [totalVisitorsResult] = await db
      .select({ count: sql<number>`count(DISTINCT ${visitorSessions.sessionId})` })
      .from(visitorSessions);
    const totalVisitors = totalVisitorsResult?.count || 0;

    // Get unique visitors today
    const [visitorsToday] = await db
      .select({ count: sql<number>`count(DISTINCT ${visitorSessions.sessionId})` })
      .from(visitorSessions)
      .where(sql`${visitorSessions.sessionStart} >= ${today}`);
    const uniqueVisitorsToday = visitorsToday?.count || 0;

    // Get unique visitors this month
    const [visitorsThisMonth] = await db
      .select({ count: sql<number>`count(DISTINCT ${visitorSessions.sessionId})` })
      .from(visitorSessions)
      .where(sql`${visitorSessions.sessionStart} >= ${firstOfThisMonth}`);
    const uniqueVisitorsThisMonth = visitorsThisMonth?.count || 0;

    // Get total page views
    const [totalPageViewsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(visitorPageViews);
    const totalPageViews = totalPageViewsResult?.count || 0;

    // Get page views today
    const [pageViewsToday] = await db
      .select({ count: sql<number>`count(*)` })
      .from(visitorPageViews)
      .where(sql`${visitorPageViews.timestamp} >= ${today}`);
    const pageViewsTodayCount = pageViewsToday?.count || 0;

    // Get average session duration
    const [avgDurationResult] = await db
      .select({ avg: sql<number>`avg(${visitorSessions.sessionDuration})` })
      .from(visitorSessions)
      .where(sql`${visitorSessions.sessionDuration} > 0`);
    const averageSessionDuration = Math.round(avgDurationResult?.avg || 0);

    // Get top pages (exclude asset files)
    const topPagesResult = await db
      .select({
        page: visitorPageViews.page,
        views: sql<number>`count(*)`
      })
      .from(visitorPageViews)
      .where(sql`
        ${visitorPageViews.page} NOT LIKE '%.ico' AND
        ${visitorPageViews.page} NOT LIKE '%.png' AND 
        ${visitorPageViews.page} NOT LIKE '%.jpg' AND
        ${visitorPageViews.page} NOT LIKE '%.css' AND
        ${visitorPageViews.page} NOT LIKE '%.js' AND
        ${visitorPageViews.page} NOT LIKE '%/src/%' AND
        ${visitorPageViews.page} NOT LIKE '%/assets/%'
      `)
      .groupBy(visitorPageViews.page)
      .orderBy(sql`count(*) desc`)
      .limit(10);

    const topPages = topPagesResult.map(row => ({
      page: row.page === '/' ? 'Home Page' : row.page,
      views: row.views
    }));

    // Get traffic sources (simplified - using referrer URL)
    const trafficSourcesResult = await db
      .select({
        source: sql<string>`
          CASE 
            WHEN ${visitorSessions.referrerUrl} IS NULL OR ${visitorSessions.referrerUrl} = '' THEN 'direct'
            WHEN ${visitorSessions.referrerUrl} LIKE '%google%' THEN 'google'
            WHEN ${visitorSessions.referrerUrl} LIKE '%facebook%' THEN 'facebook'
            WHEN ${visitorSessions.referrerUrl} LIKE '%twitter%' OR ${visitorSessions.referrerUrl} LIKE '%x.com%' THEN 'twitter'
            WHEN ${visitorSessions.referrerUrl} LIKE '%linkedin%' THEN 'linkedin'
            ELSE 'other'
          END
        `,
        visitors: sql<number>`count(DISTINCT ${visitorSessions.sessionId})`
      })
      .from(visitorSessions)
      .groupBy(sql`
        CASE 
          WHEN ${visitorSessions.referrerUrl} IS NULL OR ${visitorSessions.referrerUrl} = '' THEN 'direct'
          WHEN ${visitorSessions.referrerUrl} LIKE '%google%' THEN 'google'
          WHEN ${visitorSessions.referrerUrl} LIKE '%facebook%' THEN 'facebook'
          WHEN ${visitorSessions.referrerUrl} LIKE '%twitter%' OR ${visitorSessions.referrerUrl} LIKE '%x.com%' THEN 'twitter'
          WHEN ${visitorSessions.referrerUrl} LIKE '%linkedin%' THEN 'linkedin'
          ELSE 'other'
        END
      `)
      .orderBy(sql`count(DISTINCT ${visitorSessions.sessionId}) desc`)
      .limit(5);

    const trafficSources = trafficSourcesResult.map(row => ({
      source: row.source,
      visitors: row.visitors
    }));

    return {
      totalVisitors,
      uniqueVisitorsToday,
      uniqueVisitorsThisMonth,
      totalPageViews,
      pageViewsToday: pageViewsTodayCount,
      averageSessionDuration,
      topPages,
      trafficSources
    };
  }

  // Viewer invitation operations
  async createViewerInvitation(invitation: InsertViewerInvitation): Promise<ViewerInvitation> {
    const [newInvitation] = await db
      .insert(viewerInvitations)
      .values({
        email: invitation.email,
        invitationToken: invitation.invitationToken,
        invitedBy: invitation.invitedBy,
        status: invitation.status || "pending",
        role: invitation.role || "viewer",
        expiresAt: invitation.expiresAt,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return newInvitation;
  }

  async getViewerInvitationByToken(token: string): Promise<ViewerInvitation | undefined> {
    const [invitation] = await db
      .select()
      .from(viewerInvitations)
      .where(eq(viewerInvitations.invitationToken, token));
    return invitation;
  }

  async getViewerInvitationByEmail(email: string): Promise<ViewerInvitation | undefined> {
    const [invitation] = await db
      .select()
      .from(viewerInvitations)
      .where(eq(viewerInvitations.email, email))
      .orderBy(desc(viewerInvitations.createdAt));
    return invitation;
  }

  async getAllViewerInvitations(): Promise<ViewerInvitation[]> {
    return await db
      .select()
      .from(viewerInvitations)
      .orderBy(desc(viewerInvitations.createdAt));
  }

  async updateViewerInvitationStatus(token: string, status: string, acceptedAt?: Date): Promise<ViewerInvitation | undefined> {
    const [invitation] = await db
      .update(viewerInvitations)
      .set({ 
        status, 
        acceptedAt: acceptedAt || null,
        updatedAt: new Date()
      })
      .where(eq(viewerInvitations.invitationToken, token))
      .returning();
    return invitation;
  }

  async deleteViewerInvitation(id: number): Promise<boolean> {
    const result = await db
      .delete(viewerInvitations)
      .where(eq(viewerInvitations.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Service Request operations
  async getAllServiceRequests(): Promise<ServiceRequest[]> {
    return await db
      .select()
      .from(serviceRequests)
      .orderBy(desc(serviceRequests.createdAt));
  }

  async getServiceRequestById(id: number): Promise<ServiceRequest | undefined> {
    const [request] = await db
      .select()
      .from(serviceRequests)
      .where(eq(serviceRequests.id, id));
    return request;
  }

  async createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest> {
    const [newRequest] = await db
      .insert(serviceRequests)
      .values({
        ...request,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newRequest;
  }

  async updateServiceRequest(id: number, request: Partial<ServiceRequest>): Promise<ServiceRequest | undefined> {
    const [updatedRequest] = await db
      .update(serviceRequests)
      .set({
        ...request,
        updatedAt: new Date(),
      })
      .where(eq(serviceRequests.id, id))
      .returning();
    return updatedRequest;
  }

  async deleteServiceRequest(id: number): Promise<boolean> {
    const result = await db
      .delete(serviceRequests)
      .where(eq(serviceRequests.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Field Work Order operations
  async getAllFieldWorkOrders(): Promise<FieldWorkOrder[]> {
    return await db
      .select()
      .from(fieldWorkOrders)
      .orderBy(desc(fieldWorkOrders.createdAt));
  }

  async getFieldWorkOrderById(id: number): Promise<FieldWorkOrder | undefined> {
    const [workOrder] = await db
      .select()
      .from(fieldWorkOrders)
      .where(eq(fieldWorkOrders.id, id));
    return workOrder;
  }

  async getFieldWorkOrdersByTechnician(technicianId: number): Promise<FieldWorkOrder[]> {
    const workOrdersWithServiceRequests = await db
      .select({
        id: fieldWorkOrders.id,
        serviceRequestId: fieldWorkOrders.serviceRequestId,
        technicianId: fieldWorkOrders.technicianId,
        dispatchedAt: fieldWorkOrders.dispatchedAt,
        arrivedAt: fieldWorkOrders.arrivedAt,
        departedAt: fieldWorkOrders.departedAt,
        totalHoursWorked: fieldWorkOrders.totalHoursWorked,
        workDescription: fieldWorkOrders.workDescription,
        equipmentUsed: fieldWorkOrders.equipmentUsed,
        partsReplaced: fieldWorkOrders.partsReplaced,
        beforePhotos: fieldWorkOrders.beforePhotos,
        afterPhotos: fieldWorkOrders.afterPhotos,
        serviceReportFile: fieldWorkOrders.serviceReportFile,
        additionalDocuments: fieldWorkOrders.additionalDocuments,
        workCompleted: fieldWorkOrders.workCompleted,
        clientSignature: fieldWorkOrders.clientSignature,
        clientSignatureName: fieldWorkOrders.clientSignatureName,
        clientSignatureTimestamp: fieldWorkOrders.clientSignatureTimestamp,
        closingRemarks: fieldWorkOrders.closingRemarks,
        issuesEncountered: fieldWorkOrders.issuesEncountered,
        recommendedFollowUp: fieldWorkOrders.recommendedFollowUp,
        workQualityRating: fieldWorkOrders.workQualityRating,
        timeEfficiencyRating: fieldWorkOrders.timeEfficiencyRating,
        status: fieldWorkOrders.status,
        createdAt: fieldWorkOrders.createdAt,
        updatedAt: fieldWorkOrders.updatedAt,
        // Service request details
        companyName: serviceRequests.companyName,
        contactPersonName: serviceRequests.contactPersonName,
        projectDescription: serviceRequests.projectDescription,
        address: serviceRequests.address,
        officePhone: serviceRequests.officePhone,
        primaryEmail: serviceRequests.primaryEmail,
        requestCreated: serviceRequests.createdAt
      })
      .from(fieldWorkOrders)
      .leftJoin(serviceRequests, eq(fieldWorkOrders.serviceRequestId, serviceRequests.id))
      .where(eq(fieldWorkOrders.technicianId, technicianId))
      .orderBy(desc(fieldWorkOrders.createdAt));

    // Transform the data to include serviceRequest object
    return workOrdersWithServiceRequests.map(row => ({
      id: row.id,
      serviceRequestId: row.serviceRequestId,
      technicianId: row.technicianId,
      dispatchedAt: row.dispatchedAt,
      arrivedAt: row.arrivedAt,
      departedAt: row.departedAt,
      totalHoursWorked: row.totalHoursWorked,
      workDescription: row.workDescription,
      equipmentUsed: row.equipmentUsed,
      partsReplaced: row.partsReplaced,
      beforePhotos: row.beforePhotos,
      afterPhotos: row.afterPhotos,
      serviceReportFile: row.serviceReportFile,
      additionalDocuments: row.additionalDocuments,
      workCompleted: row.workCompleted,
      clientSignature: row.clientSignature,
      clientSignatureName: row.clientSignatureName,
      clientSignatureTimestamp: row.clientSignatureTimestamp,
      closingRemarks: row.closingRemarks,
      issuesEncountered: row.issuesEncountered,
      recommendedFollowUp: row.recommendedFollowUp,
      workQualityRating: row.workQualityRating,
      timeEfficiencyRating: row.timeEfficiencyRating,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      serviceRequest: row.companyName ? {
        companyName: row.companyName,
        contactPersonName: row.contactPersonName,
        projectDescription: row.projectDescription,
        address: row.address,
        officePhone: row.officePhone,
        primaryEmail: row.primaryEmail,
        requestCreated: row.requestCreated
      } : undefined
    }));
  }

  async getFieldWorkOrdersByServiceRequest(serviceRequestId: number): Promise<FieldWorkOrder[]> {
    return await db
      .select()
      .from(fieldWorkOrders)
      .where(eq(fieldWorkOrders.serviceRequestId, serviceRequestId))
      .orderBy(desc(fieldWorkOrders.createdAt));
  }

  async createFieldWorkOrder(workOrder: InsertFieldWorkOrder): Promise<FieldWorkOrder> {
    const [newWorkOrder] = await db
      .insert(fieldWorkOrders)
      .values({
        ...workOrder,
        status: "assigned",
        workCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newWorkOrder;
  }

  async updateFieldWorkOrder(id: number, updates: UpdateFieldWorkOrder): Promise<FieldWorkOrder | undefined> {
    const [updatedWorkOrder] = await db
      .update(fieldWorkOrders)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(fieldWorkOrders.id, id))
      .returning();
    return updatedWorkOrder;
  }

  // Technician Feedback operations
  async getAllTechnicianFeedback(): Promise<TechnicianFeedback[]> {
    return await db
      .select()
      .from(technicianFeedback)
      .orderBy(desc(technicianFeedback.submittedAt));
  }

  async getTechnicianFeedbackById(id: number): Promise<TechnicianFeedback | undefined> {
    const [feedback] = await db
      .select()
      .from(technicianFeedback)
      .where(eq(technicianFeedback.id, id));
    return feedback;
  }

  async getTechnicianFeedbackByWorkOrder(workOrderId: number): Promise<TechnicianFeedback | undefined> {
    const [feedback] = await db
      .select()
      .from(technicianFeedback)
      .where(eq(technicianFeedback.workOrderId, workOrderId));
    return feedback;
  }

  async createTechnicianFeedback(feedback: InsertTechnicianFeedback): Promise<TechnicianFeedback> {
    const [newFeedback] = await db
      .insert(technicianFeedback)
      .values({
        ...feedback,
        submittedAt: new Date(),
      })
      .returning();
    return newFeedback;
  }

  // CYST Service Report operations
  async getCystServiceReportById(id: number): Promise<CystServiceReport | undefined> {
    const [report] = await db
      .select()
      .from(cystServiceReports)
      .where(eq(cystServiceReports.id, id));
    return report;
  }

  async getCystServiceReportByWorkOrder(workOrderId: number): Promise<CystServiceReport | undefined> {
    const [report] = await db
      .select()
      .from(cystServiceReports)
      .where(eq(cystServiceReports.workOrderId, workOrderId));
    return report;
  }

  async getAllCystServiceReports(): Promise<CystServiceReport[]> {
    return await db
      .select()
      .from(cystServiceReports)
      .orderBy(desc(cystServiceReports.createdAt));
  }

  async createCystServiceReport(report: InsertCystServiceReport): Promise<CystServiceReport> {
    const [newReport] = await db
      .insert(cystServiceReports)
      .values({
        ...report,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newReport;
  }

  async updateCystServiceReport(id: number, updates: Partial<InsertCystServiceReport>): Promise<CystServiceReport | undefined> {
    const [updatedReport] = await db
      .update(cystServiceReports)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(cystServiceReports.id, id))
      .returning();
    return updatedReport;
  }

  // Client account operations implementations
  async createClientAccount(account: any): Promise<any> {
    const [newAccount] = await db
      .insert(clientAccounts)
      .values({
        userId: account.userId,
        serviceRequestId: account.serviceRequestId,
        emailVerificationToken: account.emailVerificationToken,
        emailVerificationExpiry: account.emailVerificationExpiry,
        accountCreatedFromPayment: account.accountCreatedFromPayment || true,
        paymentConfirmed: account.paymentConfirmed || false,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newAccount;
  }

  async getClientAccountByUserId(userId: number): Promise<any> {
    const [account] = await db.select().from(clientAccounts).where(eq(clientAccounts.userId, userId));
    return account;
  }

  async getClientAccountByVerificationToken(token: string): Promise<any> {
    const [account] = await db.select().from(clientAccounts).where(eq(clientAccounts.emailVerificationToken, token));
    return account;
  }

  async updateClientAccount(id: number, updates: any): Promise<any> {
    const [updatedAccount] = await db
      .update(clientAccounts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(clientAccounts.id, id))
      .returning();
    return updatedAccount;
  }

  async updateUser(id: number, updates: any): Promise<any> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Service request alias method
  async getServiceRequest(id: number): Promise<ServiceRequest | undefined> {
    return this.getServiceRequestById(id);
  }

  // Work orders alias method
  async getWorkOrdersByServiceRequestId(serviceRequestId: number): Promise<FieldWorkOrder[]> {
    return this.getFieldWorkOrdersByServiceRequest(serviceRequestId);
  }

  // Missing technician profile method
  async getTechnicianProfileByTechId(technicianId: number): Promise<any> {
    const [profile] = await db.select().from(technicianProfiles).where(eq(technicianProfiles.id, technicianId));
    return profile;
  }

  // Service Ticket operations
  async getAllServiceTickets(): Promise<ServiceTicket[]> {
    return await db.select().from(serviceTickets).orderBy(desc(serviceTickets.createdAt));
  }

  async getServiceTicketById(id: number): Promise<ServiceTicket | undefined> {
    const [ticket] = await db.select().from(serviceTickets).where(eq(serviceTickets.id, id));
    return ticket;
  }

  async getServiceTicketByNumber(ticketNumber: string): Promise<ServiceTicket | undefined> {
    const [ticket] = await db.select().from(serviceTickets).where(eq(serviceTickets.ticketNumber, ticketNumber));
    return ticket;
  }

  async searchServiceTickets(searchParams: SearchTicket): Promise<ServiceTicket[]> {
    const conditions = [];
    
    if (searchParams.chronologicalNumber !== undefined) {
      conditions.push(eq(serviceTickets.chronologicalNumber, searchParams.chronologicalNumber));
    }
    if (searchParams.status) {
      conditions.push(eq(serviceTickets.status, searchParams.status));
    }
    if (searchParams.stateCode) {
      conditions.push(eq(serviceTickets.stateCode, searchParams.stateCode));
    }
    if (searchParams.cityCode) {
      conditions.push(eq(serviceTickets.cityCode, searchParams.cityCode));
    }
    if (searchParams.companyCode) {
      conditions.push(eq(serviceTickets.companyCode, searchParams.companyCode));
    }
    if (searchParams.assignedTechnicianId) {
      conditions.push(eq(serviceTickets.assignedTechnicianId, searchParams.assignedTechnicianId));
    }
    
    let query = db.select().from(serviceTickets);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(serviceTickets.createdAt));
  }

  async createServiceTicket(ticket: InsertServiceTicket): Promise<ServiceTicket> {
    const chronologicalNumber = await this.getNextChronologicalNumber();
    const now = new Date();
    const ticketDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const formattedDate = ticketDate.replace(/-/g, ''); // YYYYMMDD format
    
    const ticketNumber = `${ticket.stateCode}${ticket.cityCode}${formattedDate}${ticket.companyCode}${chronologicalNumber.toString().padStart(2, '0')}`;
    
    const [newTicket] = await db
      .insert(serviceTickets)
      .values({
        ticketNumber,
        serviceRequestId: ticket.serviceRequestId,
        workOrderId: ticket.workOrderId || null,
        stateCode: ticket.stateCode,
        cityCode: ticket.cityCode,
        ticketDate: ticketDate,
        companyCode: ticket.companyCode,
        chronologicalNumber,
        clientCompanyName: ticket.clientCompanyName,
        clientLocation: ticket.clientLocation,
        serviceDescription: ticket.serviceDescription || null,
        priority: ticket.priority || 'medium',
        status: 'open',
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return newTicket;
  }

  async updateServiceTicket(id: number, updates: Partial<ServiceTicket>): Promise<ServiceTicket | undefined> {
    const [updatedTicket] = await db
      .update(serviceTickets)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(serviceTickets.id, id))
      .returning();
    return updatedTicket;
  }

  async assignTicketToTechnician(ticketId: number, technicianId: number): Promise<ServiceTicket | undefined> {
    const [updatedTicket] = await db
      .update(serviceTickets)
      .set({
        assignedTechnicianId: technicianId,
        assignedAt: new Date(),
        status: 'assigned',
        updatedAt: new Date(),
      })
      .where(eq(serviceTickets.id, ticketId))
      .returning();
    return updatedTicket;
  }

  async updateTicketStatus(ticketId: number, status: string): Promise<ServiceTicket | undefined> {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };
    
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }
    
    const [updatedTicket] = await db
      .update(serviceTickets)
      .set(updateData)
      .where(eq(serviceTickets.id, ticketId))
      .returning();
    return updatedTicket;
  }

  async getNextChronologicalNumber(): Promise<number> {
    const [result] = await db
      .select({ maxNumber: sql<number>`COALESCE(MAX(${serviceTickets.chronologicalNumber}), -1)` })
      .from(serviceTickets);
    return (result?.maxNumber || -1) + 1;
  }

  // CYST Reports for legal compliance
  async createCystReport(report: InsertCystReport): Promise<CystReport> {
    const reportNumber = await this.generateCystReportNumber();
    
    const [newReport] = await db
      .insert(cystReports)
      .values({
        ...report,
        reportNumber,
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return newReport;
  }

  async getCystReport(id: number): Promise<CystReport | undefined> {
    const [report] = await db
      .select()
      .from(cystReports)
      .where(eq(cystReports.id, id));
    return report;
  }

  async getCystReports(): Promise<CystReport[]> {
    return await db
      .select()
      .from(cystReports)
      .orderBy(desc(cystReports.createdAt));
  }

  async getCystReportsByTechnician(technicianId: number): Promise<CystReport[]> {
    return await db
      .select()
      .from(cystReports)
      .where(eq(cystReports.technicianId, technicianId))
      .orderBy(desc(cystReports.createdAt));
  }

  async getCystReportsByWorkOrder(workOrderId: number): Promise<CystReport[]> {
    return await db
      .select()
      .from(cystReports)
      .where(eq(cystReports.workOrderId, workOrderId))
      .orderBy(desc(cystReports.createdAt));
  }

  async updateCystReport(id: number, report: Partial<InsertCystReport>): Promise<CystReport | undefined> {
    const [updatedReport] = await db
      .update(cystReports)
      .set({
        ...report,
        updatedAt: new Date(),
      })
      .where(eq(cystReports.id, id))
      .returning();
    return updatedReport;
  }

  async updateCystReportStatus(id: number, status: string): Promise<CystReport | undefined> {
    const [updatedReport] = await db
      .update(cystReports)
      .set({
        status,
        updatedAt: new Date(),
        ...(status === 'submitted' && { submittedAt: new Date() }),
        ...(status === 'approved' && { approvedAt: new Date() }),
      })
      .where(eq(cystReports.id, id))
      .returning();
    return updatedReport;
  }

  async deleteCystReport(id: number): Promise<void> {
    await db.delete(cystReports).where(eq(cystReports.id, id));
  }

  async generateCystReportNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    
    // Get count of reports today
    const today = now.toISOString().split('T')[0];
    const [result] = await db
      .select({ 
        count: sql<number>`count(*)` 
      })
      .from(cystReports)
      .where(sql`DATE(${cystReports.createdAt}) = ${today}`);
    
    const dailySequence = ((result?.count ?? 0) + 1).toString().padStart(3, '0');
    
    return `CYST-${year}${month}${day}-${dailySequence}`;
  }

  // CYST Photos
  async createCystPhoto(photo: InsertCystPhoto): Promise<CystPhoto> {
    const [newPhoto] = await db
      .insert(cystPhotos)
      .values({
        ...photo,
        uploadedAt: new Date(),
        createdAt: new Date(),
      })
      .returning();
    return newPhoto;
  }

  async getCystPhoto(id: number): Promise<CystPhoto | undefined> {
    const [photo] = await db
      .select()
      .from(cystPhotos)
      .where(eq(cystPhotos.id, id));
    return photo;
  }

  async getCystPhotosByReport(cystReportId: number): Promise<CystPhoto[]> {
    return await db
      .select()
      .from(cystPhotos)
      .where(eq(cystPhotos.cystReportId, cystReportId))
      .orderBy(desc(cystPhotos.uploadedAt));
  }

  async getCystPhotosByWorkOrder(workOrderId: number): Promise<CystPhoto[]> {
    return await db
      .select()
      .from(cystPhotos)
      .where(eq(cystPhotos.workOrderId, workOrderId))
      .orderBy(desc(cystPhotos.uploadedAt));
  }

  async deleteCystPhoto(id: number): Promise<void> {
    await db.delete(cystPhotos).where(eq(cystPhotos.id, id));
  }
}

export const storage = new DatabaseStorage();
