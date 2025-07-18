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
  type Uwa
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc } from "drizzle-orm";

// Interface for storage operations
// Interface for assessment search parameters
export interface AssessmentSearchParams {
  companyName?: string;
  fromDate?: Date;
  toDate?: Date;
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
    return result.rowCount > 0;
  }

  async deleteAdminUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
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
}

export const storage = new DatabaseStorage();
