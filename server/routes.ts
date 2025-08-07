import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import { storage } from "./storage";
import { 
  insertAssessmentSchema, 
  insertEarlyAccessSubmissionSchema, 
  insertRasbitaReportSchema, 
  insertUwaSchema,
  adminLoginSchema,
  insertAdminUserSchema,
  changePasswordSchema,
  insertVisitorSessionSchema,
  insertVisitorPageViewSchema,
  createInvitationSchema,
  acceptInvitationSchema,
  insertServiceRequestSchema
} from "@shared/schema";
import { ZodError } from "zod";
import Stripe from "stripe";
import { initMailgun, sendEarlyAccessNotification, sendApprovalNotification, sendInvitationEmail, sendServiceRequestNotification } from "./email-service";

// Initialize Stripe with API key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Session configuration
declare module 'express-session' {
  interface SessionData {
    adminUser?: {
      id: number;
      username: string;
      role: string;
      fullName?: string;
    };
  }
}

// Authentication middleware
const requireAdminAuth = (req: any, res: any, next: any) => {
  if (!req.session.adminUser) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

const requireSuperAdmin = (req: any, res: any, next: any) => {
  if (!req.session.adminUser || req.session.adminUser.role !== 'super_admin') {
    return res.status(403).json({ error: "Super admin access required" });
  }
  next();
};

// Visitor tracking middleware
const visitorTrackingMiddleware = async (req: any, res: any, next: any) => {
  // Skip tracking for API routes and admin routes
  if (req.path.startsWith('/api/') || req.path.startsWith('/admin/')) {
    return next();
  }

  try {
    // Generate or retrieve session ID from cookie
    let sessionId = req.cookies?.visitor_session;
    if (!sessionId) {
      sessionId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      res.cookie('visitor_session', sessionId, { maxAge: 30 * 60 * 1000, httpOnly: true }); // 30 minutes
    }

    // Check if session exists in database
    let session = await storage.getVisitorSession(sessionId);
    
    if (!session) {
      // Create new visitor session
      const newSession = {
        sessionId,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent') || '',
        referrerUrl: req.get('Referer') || '',
        landingPage: req.path,
        country: req.get('CF-IPCountry') || '', // Cloudflare country header
        region: req.get('CF-IPState') || '', // Cloudflare state header
        isBot: /bot|crawler|spider|crawling/i.test(req.get('User-Agent') || '')
      };
      
      session = await storage.createVisitorSession(newSession);
    }

    // Log page view
    await storage.createVisitorPageView({
      sessionId,
      page: req.path,
      title: req.get('X-Page-Title') || req.path
    });

    // Update session activity
    await storage.updateVisitorSession(sessionId, {
      totalPageViews: (session.totalPageViews || 0) + 1
    });

  } catch (error) {
    console.error('Visitor tracking error:', error);
    // Don't fail the request if tracking fails
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure cookie parser and visitor tracking middleware
  app.use(cookieParser());
  
  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'cyberlockx-admin-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Apply visitor tracking middleware
  app.use(visitorTrackingMiddleware);

  // Initialize Mailgun (optional, will warn but not fail if keys not available)
  initMailgun();
  
  // Admin Authentication Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = adminLoginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || !['admin', 'super_admin', 'viewer'].includes(user.role || '')) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      req.session.adminUser = {
        id: user.id,
        username: user.username,
        role: user.role || 'viewer',
        fullName: user.fullName || undefined
      };
      
      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role, 
          fullName: user.fullName 
        } 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ error: "Invalid login data" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/admin/me", requireAdminAuth, (req, res) => {
    res.json(req.session.adminUser);
  });

  // Admin user management routes
  app.get("/api/admin/users", requireSuperAdmin, async (req, res) => {
    try {
      const users = await storage.getAllAdminUsers();
      const safeUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }));
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({ error: "Failed to fetch admin users" });
    }
  });

  app.post("/api/admin/users", requireSuperAdmin, async (req, res) => {
    try {
      const userData = insertAdminUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const newUser = await storage.createAdminUser({
        username: userData.username,
        password: hashedPassword,
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role
      });
      
      const safeUser = {
        id: newUser.id,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      };
      
      res.json(safeUser);
    } catch (error) {
      console.error("Error creating admin user:", error);
      res.status(400).json({ error: "Failed to create admin user" });
    }
  });

  app.patch("/api/admin/users/:id/password", requireAdminAuth, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
      
      // Users can only change their own password, unless they're super admin
      if (req.session.adminUser?.id !== userId && req.session.adminUser?.role !== 'super_admin') {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      const updated = await storage.updateUserPassword(userId, hashedNewPassword);
      
      if (!updated) {
        return res.status(500).json({ error: "Failed to update password" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(400).json({ error: "Failed to change password" });
    }
  });

  app.delete("/api/admin/users/:id", requireSuperAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Prevent deleting yourself
      if (req.session.adminUser?.id === userId) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }
      
      const deleted = await storage.deleteAdminUser(userId);
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting admin user:", error);
      res.status(500).json({ error: "Failed to delete admin user" });
    }
  });

  // Viewer Invitation System Routes
  app.post("/api/admin/invitations", requireSuperAdmin, async (req, res) => {
    try {
      const { email, role } = createInvitationSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }
      
      // Check if there's already a pending invitation
      const existingInvitation = await storage.getViewerInvitationByEmail(email);
      if (existingInvitation && existingInvitation.status === 'pending') {
        return res.status(400).json({ error: "Pending invitation already exists for this email" });
      }
      
      // Generate unique invitation token
      const invitationToken = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Set expiration to 7 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      const invitation = await storage.createViewerInvitation({
        email,
        invitationToken,
        invitedBy: req.session.adminUser?.id || null,
        role,
        expiresAt,
        status: "pending"
      });
      
      // Send invitation email
      try {
        const invitationUrl = `${req.protocol}://${req.get('host')}/accept-invitation?token=${invitationToken}`;
        const inviterName = req.session.adminUser?.fullName || req.session.adminUser?.username || "CyberLockX Admin";
        const emailSent = await sendInvitationEmail(email, role, invitationToken, inviterName);
        if (!emailSent) {
          console.warn(`Failed to send invitation email to ${email}, but invitation was created successfully`);
        } else {
          console.log(`Invitation email sent successfully to ${email} with ${role} role`);
        }
      } catch (emailError) {
        console.error("Failed to send invitation email:", emailError);
        // Don't fail the request if email fails - invitation is still valid
      }
      
      res.json({ 
        success: true, 
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          expiresAt: invitation.expiresAt,
          status: invitation.status
        }
      });
    } catch (error) {
      console.error("Error creating invitation:", error);
      res.status(400).json({ error: "Failed to create invitation" });
    }
  });

  app.get("/api/admin/invitations", requireSuperAdmin, async (req, res) => {
    try {
      const invitations = await storage.getAllViewerInvitations();
      const safeInvitations = invitations.map(inv => ({
        id: inv.id,
        email: inv.email,
        role: inv.role,
        status: inv.status,
        expiresAt: inv.expiresAt,
        acceptedAt: inv.acceptedAt,
        createdAt: inv.createdAt
      }));
      res.json(safeInvitations);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      res.status(500).json({ error: "Failed to fetch invitations" });
    }
  });

  app.delete("/api/admin/invitations/:id", requireSuperAdmin, async (req, res) => {
    try {
      const invitationId = parseInt(req.params.id);
      const deleted = await storage.deleteViewerInvitation(invitationId);
      if (!deleted) {
        return res.status(404).json({ error: "Invitation not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting invitation:", error);
      res.status(500).json({ error: "Failed to delete invitation" });
    }
  });

  // Public invitation acceptance routes
  app.get("/api/invitations/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const invitation = await storage.getViewerInvitationByToken(token);
      
      if (!invitation) {
        return res.status(404).json({ error: "Invitation not found" });
      }
      
      if (invitation.status !== 'pending') {
        return res.status(400).json({ error: "Invitation is no longer valid" });
      }
      
      if (new Date() > invitation.expiresAt) {
        await storage.updateViewerInvitationStatus(token, 'expired');
        return res.status(400).json({ error: "Invitation has expired" });
      }
      
      res.json({
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt
      });
    } catch (error) {
      console.error("Error validating invitation:", error);
      res.status(500).json({ error: "Failed to validate invitation" });
    }
  });

  app.post("/api/invitations/accept", async (req, res) => {
    try {
      const { token, username, password, fullName } = acceptInvitationSchema.parse(req.body);
      
      const invitation = await storage.getViewerInvitationByToken(token);
      if (!invitation) {
        return res.status(404).json({ error: "Invitation not found" });
      }
      
      if (invitation.status !== 'pending') {
        return res.status(400).json({ error: "Invitation is no longer valid" });
      }
      
      if (new Date() > invitation.expiresAt) {
        await storage.updateViewerInvitationStatus(token, 'expired');
        return res.status(400).json({ error: "Invitation has expired" });
      }
      
      // Check if username is taken
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username is already taken" });
      }
      
      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await storage.createAdminUser({
        username,
        password: hashedPassword,
        fullName,
        email: invitation.email,
        role: invitation.role
      });
      
      // Mark invitation as accepted
      await storage.updateViewerInvitationStatus(token, 'accepted', new Date());
      
      // Automatically log in the new user
      req.session.adminUser = {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role || 'viewer',
        fullName: newUser.fullName || undefined
      };
      
      res.json({ 
        success: true, 
        user: { 
          id: newUser.id, 
          username: newUser.username, 
          role: newUser.role, 
          fullName: newUser.fullName 
        } 
      });
    } catch (error) {
      console.error("Error accepting invitation:", error);
      res.status(400).json({ error: "Failed to accept invitation" });
    }
  });
  
  // API routes
  
  // Get all assessments (for a user)
  app.get("/api/assessments", async (req, res) => {
    try {
      const { companyName, fromDate, toDate } = req.query;
      
      // If search parameters are provided, use filtered search
      if (companyName || fromDate || toDate) {
        const searchParams = {
          companyName: companyName as string || undefined,
          fromDate: fromDate ? new Date(fromDate as string) : undefined,
          toDate: toDate ? new Date(toDate as string) : undefined,
        };
        const assessments = await storage.searchAssessments(searchParams);
        res.json(assessments);
      } else {
        // Otherwise get all assessments
        const assessments = await storage.getAllAssessments();
        res.json(assessments);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ error: "Failed to fetch assessments" });
    }
  });

  // Get assessment by ID
  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const assessment = await storage.getAssessment(parseInt(req.params.id));
      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      console.error("Error fetching assessment:", error);
      res.status(500).json({ error: "Failed to fetch assessment" });
    }
  });

  // Get assessment report by ID
  app.get("/api/assessments/:id/report", async (req, res) => {
    try {
      const assessment = await storage.getAssessment(parseInt(req.params.id));
      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }
      
      // Handle preliminary vs comprehensive assessments differently
      if (assessment.reportType === "preliminary") {
        // Preliminary assessments use 5-pillar framework with conditional logic
        // Minimum requirement: Qualitative Assessment (20%) + RASBITA Governance (15%) = 35%
        // Additional pillars based on available data (incident history, system diagrams)
        res.json(assessment);
      } else {
        // Comprehensive assessments require full matrixData and findings
        if (!assessment.findings || !assessment.matrixData) {
          return res.status(400).json({ error: "Report not available for this assessment" });
        }
        res.json(assessment);
      }
    } catch (error) {
      console.error("Error fetching assessment report:", error);
      res.status(500).json({ error: "Failed to fetch assessment report" });
    }
  });

  // Create a new assessment
  app.post("/api/assessments", async (req, res) => {
    try {
      console.log("Received assessment data:", JSON.stringify(req.body, null, 2));
      
      // Validate the request data
      let validatedData;
      try {
        validatedData = insertAssessmentSchema.parse(req.body);
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          console.error("Assessment validation error:", validationError.errors);
          return res.status(400).json({ 
            error: "Validation error", 
            details: validationError.errors,
            receivedData: {
              businessName: req.body.businessName,
              industry: req.body.industry,
              employeeCount: req.body.employeeCount,
              contactInfo: req.body.contactInfo,
              reportType: req.body.reportType
            }
          });
        }
        throw validationError;
      }
      
      // Create the assessment
      console.log("Validated assessment data:", validatedData);
      const newAssessment = await storage.createAssessment(validatedData);
      console.log("Assessment created successfully:", newAssessment.id);
      res.status(201).json(newAssessment);
    } catch (error) {
      console.error("Error creating assessment:", error);
      res.status(500).json({ 
        error: "Failed to create assessment", 
        message: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      });
    }
  });

  // Update an assessment
  app.put("/api/assessments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAssessmentSchema.parse(req.body);
      const updatedAssessment = await storage.updateAssessment(id, validatedData);
      if (!updatedAssessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }
      res.json(updatedAssessment);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        console.error("Error updating assessment:", error);
        res.status(500).json({ error: "Failed to update assessment" });
      }
    }
  });

  // Delete an assessment
  app.delete("/api/assessments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAssessment(id);
      if (!success) {
        return res.status(404).json({ error: "Assessment not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting assessment:", error);
      res.status(500).json({ error: "Failed to delete assessment" });
    }
  });

  // User routes
  app.post("/api/users/register", async (req, res) => {
    try {
      const { username, password, fullName, email, companyName, role } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }
      
      const newUser = await storage.createUser({
        username,
        password,
        fullName,
        email,
        companyName,
        role
      });
      
      // Don't return the password in the response
      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.post("/api/users/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Validate inputs
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      
      // Check if user exists and password matches
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      
      // Don't return the password in the response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });
  
  // Early Access routes
  app.post("/api/early-access/submit", async (req, res) => {
    try {
      const validatedData = insertEarlyAccessSubmissionSchema.parse(req.body);
      const submission = await storage.createEarlyAccessSubmission(validatedData);
      
      // Send email notification
      try {
        await sendEarlyAccessNotification({
          fullName: validatedData.fullName,
          email: validatedData.email,
          company: validatedData.company,
          phone: validatedData.phone,
          companySize: validatedData.companySize,
          industry: validatedData.industry,
          interestedIn: validatedData.interestedIn,
          investmentLevel: validatedData.investmentLevel,
          additionalInfo: validatedData.additionalInfo
        });
        console.log('Email notification sent for submission ID:', submission.id);
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Continue with response even if email fails
      }
      
      res.status(201).json({ 
        success: true, 
        message: "Your early access application has been submitted successfully", 
        submissionId: submission.id 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        console.error("Error submitting early access application:", error);
        res.status(500).json({ error: "Failed to submit early access application" });
      }
    }
  });
  
  app.get("/api/early-access/submissions", requireAdminAuth, async (req, res) => {
    try {
      const submissions = await storage.getAllEarlyAccessSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching early access submissions:", error);
      res.status(500).json({ error: "Failed to fetch early access submissions" });
    }
  });
  
  app.get("/api/early-access/submissions/:id", requireAdminAuth, async (req, res) => {
    try {
      const submission = await storage.getEarlyAccessSubmission(parseInt(req.params.id));
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      console.error("Error fetching early access submission:", error);
      res.status(500).json({ error: "Failed to fetch early access submission" });
    }
  });
  
  app.patch("/api/early-access/submissions/:id/status", requireAdminAuth, async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const submission = await storage.updateEarlyAccessSubmissionStatus(parseInt(req.params.id), status);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      
      // Send approval email if status is "approved"
      if (status === "approved") {
        try {
          await sendApprovalNotification({
            fullName: submission.fullName,
            email: submission.email,
            company: submission.company,
            phone: submission.phone,
            companySize: submission.companySize,
            industry: submission.industry,
            interestedIn: submission.interestedIn,
            investmentLevel: submission.investmentLevel,
            additionalInfo: submission.additionalInfo,
          });
        } catch (emailError) {
          console.error("Error sending approval email:", emailError);
          // Don't fail the status update if email fails
        }
      }
      
      res.json(submission);
    } catch (error) {
      console.error("Error updating early access submission status:", error);
      res.status(500).json({ error: "Failed to update early access submission status" });
    }
  });

  app.delete("/api/early-access/submissions/:id", requireAdminAuth, async (req, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      
      // First check if submission exists and is approved or rejected
      const submission = await storage.getEarlyAccessSubmission(submissionId);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      
      if (submission.status === 'pending' || submission.status === 'reviewed') {
        return res.status(400).json({ error: "Cannot delete pending or under review submissions" });
      }
      
      const deleted = await storage.deleteEarlyAccessSubmission(submissionId);
      if (!deleted) {
        return res.status(404).json({ error: "Submission not found" });
      }
      
      res.json({ success: true, message: "Submission deleted successfully" });
    } catch (error) {
      console.error("Error deleting early access submission:", error);
      res.status(500).json({ error: "Failed to delete early access submission" });
    }
  });

  // RASBITA Report API
  // -------------------------------------------------------------------------
  
  // Get all RASBITA reports
  app.get("/api/rasbita-reports", async (req, res) => {
    try {
      const reports = await storage.getAllRasbitaReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching RASBITA reports:", error);
      res.status(500).json({ error: "Failed to fetch RASBITA reports" });
    }
  });

  // Get RASBITA report by ID
  app.get("/api/rasbita-reports/:id", async (req, res) => {
    try {
      // Special case for "new" - return 404 to let client handle it
      if (req.params.id === "new") {
        return res.status(404).json({ error: "Creating new report" });
      }
      
      const report = await storage.getRasbitaReportById(parseInt(req.params.id));
      if (!report) {
        return res.status(404).json({ error: "RASBITA report not found" });
      }
      res.json(report);
    } catch (error) {
      console.error("Error fetching RASBITA report:", error);
      res.status(500).json({ error: "Failed to fetch RASBITA report" });
    }
  });

  // Create a new RASBITA report
  app.post("/api/rasbita-reports", async (req, res) => {
    try {
      const validatedData = insertRasbitaReportSchema.parse(req.body);
      const newReport = await storage.createRasbitaReport(validatedData);
      res.status(201).json(newReport);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        console.error("Error creating RASBITA report:", error);
        res.status(500).json({ error: "Failed to create RASBITA report" });
      }
    }
  });

  // Update a RASBITA report
  app.put("/api/rasbita-reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertRasbitaReportSchema.parse(req.body);
      const updatedReport = await storage.updateRasbitaReport(id, validatedData);
      if (!updatedReport) {
        return res.status(404).json({ error: "RASBITA report not found" });
      }
      res.json(updatedReport);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        console.error("Error updating RASBITA report:", error);
        res.status(500).json({ error: "Failed to update RASBITA report" });
      }
    }
  });

  // Delete a RASBITA report
  app.delete("/api/rasbita-reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteRasbitaReport(id);
      if (!success) {
        return res.status(404).json({ error: "RASBITA report not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting RASBITA report:", error);
      res.status(500).json({ error: "Failed to delete RASBITA report" });
    }
  });

  // Get RASBITA reports for a specific user
  app.get("/api/users/:userId/rasbita-reports", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reports = await storage.getRasbitaReportsByUser(userId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching user RASBITA reports:", error);
      res.status(500).json({ error: "Failed to fetch user RASBITA reports" });
    }
  });

  // UWA API
  // -------------------------------------------------------------------------
  
  // Get all UWAs
  app.get("/api/uwas", async (req, res) => {
    try {
      // Filter by identity type if provided
      const { identityType, userId } = req.query;
      
      if (identityType) {
        const uwas = await storage.getUwasByIdentityType(identityType as string);
        res.json(uwas);
      } else if (userId) {
        const uwas = await storage.getUwasByUserId(parseInt(userId as string));
        res.json(uwas);
      } else {
        const uwas = await storage.getAllUwas();
        res.json(uwas);
      }
    } catch (error) {
      console.error("Error fetching UWAs:", error);
      res.status(500).json({ error: "Failed to fetch UWAs" });
    }
  });

  // Get UWA by ID
  app.get("/api/uwas/:id", async (req, res) => {
    try {
      const uwa = await storage.getUwaById(parseInt(req.params.id));
      if (!uwa) {
        return res.status(404).json({ error: "UWA not found" });
      }
      res.json(uwa);
    } catch (error) {
      console.error("Error fetching UWA:", error);
      res.status(500).json({ error: "Failed to fetch UWA" });
    }
  });

  // Create a new UWA
  app.post("/api/uwas", async (req, res) => {
    try {
      console.log("Received UWA data:", JSON.stringify(req.body, null, 2));
      
      // Validate the request data
      const validatedData = insertUwaSchema.parse(req.body);
      
      // Create the UWA
      const newUwa = await storage.createUwa(validatedData);
      console.log("UWA created successfully:", newUwa.id);
      res.status(201).json(newUwa);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        console.error("Error creating UWA:", error);
        res.status(500).json({ 
          error: "Failed to create UWA", 
          message: error instanceof Error ? error.message : "Unknown error",
          stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
        });
      }
    }
  });

  // Update a UWA
  app.put("/api/uwas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertUwaSchema.parse(req.body);
      const updatedUwa = await storage.updateUwa(id, validatedData);
      if (!updatedUwa) {
        return res.status(404).json({ error: "UWA not found" });
      }
      res.json(updatedUwa);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        console.error("Error updating UWA:", error);
        res.status(500).json({ error: "Failed to update UWA" });
      }
    }
  });

  // Delete a UWA
  app.delete("/api/uwas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteUwa(id);
      if (!success) {
        return res.status(404).json({ error: "UWA not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting UWA:", error);
      res.status(500).json({ error: "Failed to delete UWA" });
    }
  });

  // Stripe Payment Integration API
  // -------------------------------------------------------------------------
  
  // Create a payment intent for checkout
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { planId, amount, addons = [] } = req.body;
      
      if (!planId || !amount) {
        return res.status(400).json({ error: "Plan ID and amount are required" });
      }
      
      // Calculate total amount (in cents as Stripe requires)
      const totalAmount = Math.round(parseFloat(amount) * 100);
      
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: "usd",
        metadata: {
          planId,
          addons: JSON.stringify(addons)
        },
        // Secure the payment intent with ECSMID encryption technology
        description: "CyberLockX Secured Payment - Protected by ECSMID Encryption",
      });
      
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        error: "Failed to create payment intent",
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  // Confirm payment completion and provision services
  app.post("/api/payment-success", async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ error: "Payment Intent ID is required" });
      }
      
      // Retrieve the payment intent to confirm it's successful
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ error: "Payment has not succeeded" });
      }
      
      // Extract metadata from the payment intent
      const planId = paymentIntent.metadata.planId;
      const addons = JSON.parse(paymentIntent.metadata.addons || '[]');
      
      // Here you would typically:
      // 1. Update the user's subscription status in the database
      // 2. Provision any services that were purchased
      // 3. Send confirmation emails, etc.
      
      // For now, we'll just return success
      res.status(200).json({
        success: true,
        message: "Payment processed successfully",
        planId,
        addons
      });
    } catch (error) {
      console.error("Error processing payment success:", error);
      res.status(500).json({ 
        error: "Failed to process payment success",
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Dashboard Monitoring Data API
  // -------------------------------------------------------------------------
  
  // Endpoint for monitoring data
  app.get("/api/monitoring-data", async (req, res) => {
    try {
      // In a real application, this would fetch actual monitoring data from a database
      // For now, we'll return mock data to demonstrate the dashboard functionality
      
      res.status(200).json({
        securityScore: 72,
        lastUpdated: new Date().toISOString(),
        issues: [
          {
            id: 1,
            title: "Outdated SSL Certificate",
            description: "The SSL certificate for the main domain is expiring within 14 days.",
            severity: "High",
            affectedSystems: "Web Server",
            discovered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: "open"
          },
          {
            id: 2,
            title: "Vulnerable Dependency",
            description: "Application uses a library with known security vulnerabilities (CVE-2025-1234).",
            severity: "Critical",
            affectedSystems: "Payment Processing",
            discovered: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: "open"
          },
          {
            id: 3,
            title: "Unsecured API Endpoint",
            description: "The /api/user endpoint is accessible without proper authentication.",
            severity: "High",
            affectedSystems: "User Management API",
            discovered: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: "remediated"
          },
          {
            id: 4,
            title: "Excessive Login Attempts",
            description: "Multiple failed login attempts detected from IP range 203.0.113.x",
            severity: "Medium",
            affectedSystems: "Authentication System",
            discovered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: "open"
          },
          {
            id: 5,
            title: "Missing Content Security Policy",
            description: "No Content-Security-Policy header is set on public pages",
            severity: "Medium",
            affectedSystems: "Web Application",
            discovered: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: "open"
          }
        ],
        complianceStatus: [
          { standard: "PCI DSS", status: "Partially Compliant", score: 78 },
          { standard: "GDPR", status: "Compliant", score: 92 },
          { standard: "HIPAA", status: "Non-Compliant", score: 65 },
          { standard: "SOC 2", status: "Partially Compliant", score: 81 }
        ],
        systemHealth: {
          servers: { status: "Healthy", uptime: "99.99%" },
          databases: { status: "Warning", uptime: "99.87%" },
          applications: { status: "Healthy", uptime: "99.95%" }
        },
        securityEvents: {
          today: 23,
          thisWeek: 142,
          thisMonth: 587
        }
      });
    } catch (error) {
      console.error("Error fetching monitoring data:", error);
      res.status(500).json({ 
        error: "Failed to fetch monitoring data",
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Endpoint for generating reports
  app.post("/api/generate-report", async (req, res) => {
    try {
      const { type } = req.body;
      
      if (!type || !['executive', 'technical', 'compliance'].includes(type)) {
        return res.status(400).json({ error: "Valid report type is required" });
      }
      
      // In a real application, this would generate an actual report based on real data
      // For now, we'll simulate a report generation
      
      console.log(`Generating ${type} report`);
      
      // Simulate processing time
      setTimeout(() => {
        res.status(200).json({
          success: true,
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} report generated successfully`,
          reportUrl: `/reports/sample-${type}-report.pdf`
        });
      }, 1000);
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ 
        error: "Failed to generate report",
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Analytics API Routes
  // -------------------------------------------------------------------------
  
  // Get analytics dashboard metrics (admin only)
  app.get("/api/analytics/metrics", requireAdminAuth, async (req, res) => {
    try {
      const metrics = await storage.getAnalyticsMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching analytics metrics:", error);
      res.status(500).json({ error: "Failed to fetch analytics metrics" });
    }
  });

  // Get monthly growth data (admin only)
  app.get("/api/analytics/growth", requireAdminAuth, async (req, res) => {
    try {
      const growthData = await storage.getMonthlyGrowthData();
      res.json(growthData);
    } catch (error) {
      console.error("Error fetching growth data:", error);
      res.status(500).json({ error: "Failed to fetch growth data" });
    }
  });

  // Track payment completion (called from Stripe webhook or payment success)
  app.post("/api/analytics/track-payment", async (req, res) => {
    try {
      const { userId, amount, paymentId, productType } = req.body;
      
      if (!userId || !amount || !paymentId) {
        return res.status(400).json({ error: "Missing required payment tracking data" });
      }
      
      await storage.trackPayment(userId, amount, paymentId, productType || 'assessment');
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking payment:", error);
      res.status(500).json({ error: "Failed to track payment" });
    }
  });

  // Get visitor analytics (admin only)
  app.get("/api/analytics/visitors", requireAdminAuth, async (req, res) => {
    try {
      const visitorAnalytics = await storage.getVisitorAnalytics();
      res.json(visitorAnalytics);
    } catch (error) {
      console.error("Error fetching visitor analytics:", error);
      res.status(500).json({ error: "Failed to fetch visitor analytics" });
    }
  });

  // Service Request routes
  app.get("/api/service-requests", requireAdminAuth, async (req, res) => {
    try {
      const requests = await storage.getAllServiceRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error getting service requests:", error);
      res.status(500).json({ error: "Failed to get service requests" });
    }
  });

  app.get("/api/service-requests/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.getServiceRequestById(id);
      if (!request) {
        return res.status(404).json({ error: "Service request not found" });
      }
      res.json(request);
    } catch (error) {
      console.error("Error getting service request:", error);
      res.status(500).json({ error: "Failed to get service request" });
    }
  });

  app.post("/api/service-requests", async (req, res) => {
    try {
      const validatedData = insertServiceRequestSchema.parse(req.body);
      const request = await storage.createServiceRequest(validatedData);
      
      // Send notification email
      try {
        const mailgun = initMailgun();
        if (mailgun) {
          await sendServiceRequestNotification(mailgun, request);
        }
      } catch (emailError) {
        console.error("Failed to send service request notification:", emailError);
        // Don't fail the entire request if email fails
      }
      
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating service request:", error);
      res.status(500).json({ error: "Failed to create service request" });
    }
  });

  app.put("/api/service-requests/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.updateServiceRequest(id, req.body);
      if (!request) {
        return res.status(404).json({ error: "Service request not found" });
      }
      res.json(request);
    } catch (error) {
      console.error("Error updating service request:", error);
      res.status(500).json({ error: "Failed to update service request" });
    }
  });

  app.delete("/api/service-requests/:id", requireSuperAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteServiceRequest(id);
      if (!success) {
        return res.status(404).json({ error: "Service request not found" });
      }
      res.json({ message: "Service request deleted" });
    } catch (error) {
      console.error("Error deleting service request:", error);
      res.status(500).json({ error: "Failed to delete service request" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
