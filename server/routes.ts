import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import crypto from "crypto";
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
  insertServiceRequestSchema,
  serviceRequests,
  insertFieldWorkOrderSchema,
  updateFieldWorkOrderSchema,
  insertTechnicianFeedbackSchema,
  insertCystServiceReportSchema,
  insertCystReportSchema,
  insertCystPhotoSchema
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
    clientUser?: {
      id: number;
      email: string;
      role: string;
      fullName?: string;
    };
    technicianUser?: {
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

const requireClientAuth = (req: any, res: any, next: any) => {
  if (!req.session.clientUser) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

const requireTechnicianAuth = (req: any, res: any, next: any) => {
  if (!req.session.technicianUser && !req.session.adminUser) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  // Allow technicians with their own session or admins/super_admins
  const isValidTechnician = req.session.technicianUser?.role === 'technician';
  const isValidAdmin = req.session.adminUser && ['admin', 'super_admin'].includes(req.session.adminUser.role);
  
  if (!isValidTechnician && !isValidAdmin) {
    return res.status(403).json({ error: "Technician access required" });
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

  // Technician Authentication Routes
  app.post("/api/technician/login", async (req, res) => {
    try {
      const { username, password } = adminLoginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.role !== 'technician') {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      req.session.technicianUser = {
        id: user.id,
        username: user.username,
        role: user.role || 'technician',
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
      console.error("Technician login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/technician/me", requireTechnicianAuth, async (req, res) => {
    try {
      const userId = req.session.technicianUser?.id || req.session.adminUser?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        req.session.technicianUser = undefined;
        req.session.adminUser = undefined;
        return res.status(401).json({ error: "User not found" });
      }
      res.json({ 
        id: user.id, 
        username: user.username, 
        role: user.role, 
        fullName: user.fullName 
      });
    } catch (error) {
      console.error("Get technician user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.post("/api/technician/logout", (req, res) => {
    req.session.technicianUser = undefined;
    res.json({ message: "Logged out successfully" });
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
            interestedIn: submission.interestedIn || [],
            investmentLevel: submission.investmentLevel,
            additionalInfo: submission.additionalInfo || "",
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
  
  // Create subscription-based payment with one-time fee tracking
  app.post("/api/create-subscription", async (req, res) => {
    try {
      const { 
        email, 
        firstName, 
        lastName, 
        companyName,
        planId, 
        planName,
        billingPeriod,
        amount, 
        monthlyAmount, 
        oneTimeFees = [],
        monthlyAddons = []
      } = req.body;
      
      // Use amount if monthlyAmount is not provided (for backwards compatibility)
      const finalAmount = monthlyAmount || amount;
      
      if (!email || !planId || !finalAmount) {
        return res.status(400).json({ 
          error: "Email, plan ID, and amount are required" 
        });
      }

      // Check if customer already exists
      let customer = await storage.getCustomerByEmail(email);
      let stripeCustomer;
      
      if (customer) {
        // Get existing Stripe customer
        if (customer.stripeCustomerId) {
          stripeCustomer = await stripe.customers.retrieve(customer.stripeCustomerId);
        } else {
          // Create new Stripe customer for existing DB customer
          stripeCustomer = await stripe.customers.create({
            email: email,
            name: `${firstName || ''} ${lastName || ''}`.trim(),
            metadata: {
              companyName: companyName || '',
            }
          });
          
          // Update customer record with Stripe ID
          customer = await storage.updateCustomer(customer.id, {
            stripeCustomerId: stripeCustomer.id
          });
        }
      } else {
        // Create new Stripe customer
        stripeCustomer = await stripe.customers.create({
          email: email,
          name: `${firstName || ''} ${lastName || ''}`.trim(),
          metadata: {
            companyName: companyName || '',
          }
        });
        
        // Create customer record in database
        customer = await storage.createCustomer({
          email: email,
          stripeCustomerId: stripeCustomer.id,
          firstName: firstName,
          lastName: lastName,
          companyName: companyName,
          planId: planId,
          planName: planName,
          billingPeriod: billingPeriod || 'monthly'
        });
      }

      // Filter out one-time fees that have already been purchased
      const validOneTimeFees = [];
      for (const fee of oneTimeFees) {
        const hasPurchased = await storage.hasOneTimePurchase(customer.id, fee.type);
        if (!hasPurchased) {
          validOneTimeFees.push(fee);
        }
      }

      // Calculate total for first payment (monthly + valid one-time fees)
      const monthlyAmountCents = Math.round(finalAmount * 100);
      const oneTimeTotal = validOneTimeFees.reduce((total, fee) => total + fee.amount, 0);
      const oneTimeTotalCents = Math.round(oneTimeTotal * 100);
      
      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomer.id,
        items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${planName} - ${billingPeriod === 'yearly' ? 'Annual' : 'Monthly'} Plan`,
              },
              unit_amount: monthlyAmountCents,
              recurring: {
                interval: billingPeriod === 'yearly' ? 'year' : 'month',
              },
            } as any,
          }
        ],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          planId: planId,
          customerId: customer.id.toString(),
          oneTimeFees: JSON.stringify(validOneTimeFees),
        }
      });

      // Add one-time fees to the first invoice if any
      if (oneTimeTotalCents > 0 && subscription.latest_invoice && typeof subscription.latest_invoice === 'object') {
        await stripe.invoiceItems.create({
          customer: stripeCustomer!.id,
          amount: oneTimeTotalCents,
          currency: 'usd',
          description: `One-time fees: ${validOneTimeFees.map(f => f.description).join(', ')}`,
          invoice: subscription.latest_invoice.id,
        });
        
        // Finalize the invoice to include the one-time fees
        await stripe.invoices.finalizeInvoice(subscription.latest_invoice.id);
      }

      // Update customer record with subscription info
      await storage.updateCustomer(customer.id, {
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status
      });

      // Store subscription items for tracking
      await storage.createSubscriptionItem({
        customerId: customer.id,
        itemType: 'base_plan',
        itemName: planName,
        monthlyAmount: monthlyAmountCents,
        isActive: true
      });

      // Store monthly addons
      for (const addon of monthlyAddons) {
        await storage.createSubscriptionItem({
          customerId: customer.id,
          itemType: 'monthly_addons',
          itemName: addon.name,
          monthlyAmount: Math.round(addon.amount * 100),
          quantity: addon.quantity || 1,
          isActive: true
        });
      }

      const latestInvoice = subscription.latest_invoice;
      const clientSecret = latestInvoice && typeof latestInvoice === 'object' && latestInvoice.payment_intent && typeof latestInvoice.payment_intent === 'object' 
        ? latestInvoice.payment_intent.client_secret 
        : null;

      res.json({
        clientSecret: clientSecret,
        subscriptionId: subscription.id,
        customerId: customer.id,
        oneTimeFeesIncluded: validOneTimeFees.length,
        oneTimeFeesSkipped: oneTimeFees.length - validOneTimeFees.length
      });
      
    } catch (error: any) {
      console.error("Subscription creation error:", error);
      res.status(500).json({ error: "Payment processing error" });
    }
  });
  
  // Handle successful subscription payment and record one-time purchases
  app.post("/api/subscription-success", async (req, res) => {
    try {
      const { subscriptionId, paymentIntentId } = req.body;
      
      if (!subscriptionId) {
        return res.status(400).json({ error: "Subscription ID is required" });
      }
      
      // Retrieve the subscription
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      if (subscription.status !== 'active') {
        return res.status(400).json({ error: "Subscription is not active" });
      }
      
      // Get customer info
      const customerId = parseInt(subscription.metadata.customerId);
      const customer = await storage.updateCustomer(customerId, {
        subscriptionStatus: subscription.status
      });
      
      // Record one-time fees if they were included
      const oneTimeFees = JSON.parse(subscription.metadata.oneTimeFees || '[]');
      for (const fee of oneTimeFees) {
        await storage.recordOneTimePurchase({
          customerId: customerId,
          feeType: fee.type,
          feeAmount: Math.round(fee.amount * 100),
          description: fee.description,
          stripePaymentIntentId: paymentIntentId || (subscription.latest_invoice && typeof subscription.latest_invoice === 'object' && subscription.latest_invoice.payment_intent && typeof subscription.latest_invoice.payment_intent === 'object' ? subscription.latest_invoice.payment_intent.id : undefined),
          status: 'completed'
        });
      }
      
      res.json({
        success: true,
        message: "Subscription activated successfully",
        customer: customer,
        oneTimeFeesRecorded: oneTimeFees.length
      });
      
    } catch (error: any) {
      console.error("Subscription success error:", error);
      res.status(500).json({ error: "Error processing subscription success" });
    }
  });

  // Check customer's one-time purchase history
  app.post("/api/check-customer-fees", async (req, res) => {
    try {
      const { email, feeTypes = [] } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      const customer = await storage.getCustomerByEmail(email);
      if (!customer) {
        return res.json({ 
          customerExists: false, 
          purchasedFees: [] 
        });
      }
      
      const purchasedFees = [];
      for (const feeType of feeTypes) {
        const hasPurchased = await storage.hasOneTimePurchase(customer.id, feeType);
        if (hasPurchased) {
          purchasedFees.push(feeType);
        }
      }
      
      res.json({
        customerExists: true,
        customerId: customer.id,
        purchasedFees: purchasedFees,
        allPurchases: await storage.getOneTimePurchases(customer.id)
      });
      
    } catch (error: any) {
      console.error("Error checking customer fees:", error);
      res.status(500).json({ error: "Error checking customer fees" });
    }
  });

  // Legacy endpoint for backward compatibility
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
        await sendServiceRequestNotification(request);
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

  // Field Technician Portal Routes
  // -------------------------------------------------------------------------

  // Get work orders for a technician
  app.get("/api/technician/work-orders", requireTechnicianAuth, async (req, res) => {
    try {
      const technicianId = req.session.adminUser?.id;
      if (!technicianId) {
        return res.status(401).json({ error: "Technician ID required" });
      }
      
      const workOrders = await storage.getFieldWorkOrdersByTechnician(technicianId);
      res.json(workOrders);
    } catch (error) {
      console.error("Error fetching technician work orders:", error);
      res.status(500).json({ error: "Failed to fetch work orders" });
    }
  });

  // Get specific work order details
  app.get("/api/technician/work-orders/:id", requireTechnicianAuth, async (req, res) => {
    try {
      const workOrderId = parseInt(req.params.id);
      const workOrder = await storage.getFieldWorkOrderById(workOrderId);
      
      if (!workOrder) {
        return res.status(404).json({ error: "Work order not found" });
      }

      // Verify technician has access to this work order
      const technicianId = req.session.adminUser?.id;
      if (workOrder.technicianId !== technicianId && req.session.adminUser?.role !== 'super_admin') {
        return res.status(403).json({ error: "Access denied to this work order" });
      }

      res.json(workOrder);
    } catch (error) {
      console.error("Error fetching work order:", error);
      res.status(500).json({ error: "Failed to fetch work order" });
    }
  });

  // Update work order (time tracking, status, etc.)
  app.put("/api/technician/work-orders/:id", requireTechnicianAuth, async (req, res) => {
    try {
      const workOrderId = parseInt(req.params.id);
      const technicianId = req.session.adminUser?.id;
      
      // Verify work order exists and technician has access
      const existingWorkOrder = await storage.getFieldWorkOrderById(workOrderId);
      if (!existingWorkOrder) {
        return res.status(404).json({ error: "Work order not found" });
      }
      
      if (existingWorkOrder.technicianId !== technicianId && req.session.adminUser?.role !== 'super_admin') {
        return res.status(403).json({ error: "Access denied to this work order" });
      }

      // Validate update data
      const validatedData = updateFieldWorkOrderSchema.parse(req.body);
      
      // Calculate total hours worked if both arrived and departed times are provided
      const updates = { ...validatedData };
      // Note: totalHoursWorked field will be calculated in the database or handled elsewhere
      
      const updatedWorkOrder = await storage.updateFieldWorkOrder(workOrderId, updates);
      res.json(updatedWorkOrder);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error updating work order:", error);
      res.status(500).json({ error: "Failed to update work order" });
    }
  });

  // Create new work order (admin only)
  app.post("/api/technician/work-orders", requireTechnicianAuth, async (req, res) => {
    try {
      // Only super admins can create work orders
      if (req.session.adminUser?.role !== 'super_admin') {
        return res.status(403).json({ error: "Super admin access required" });
      }

      const validatedData = insertFieldWorkOrderSchema.parse(req.body);
      const workOrder = await storage.createFieldWorkOrder(validatedData);
      res.status(201).json(workOrder);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating work order:", error);
      res.status(500).json({ error: "Failed to create work order" });
    }
  });

  // Submit technician feedback
  app.post("/api/technician/feedback", requireTechnicianAuth, async (req, res) => {
    try {
      const technicianId = req.session.adminUser?.id;
      if (!technicianId) {
        return res.status(401).json({ error: "Technician ID required" });
      }

      const feedbackData = {
        ...req.body,
        technicianId: technicianId
      };

      const validatedData = insertTechnicianFeedbackSchema.parse(feedbackData);
      const feedback = await storage.createTechnicianFeedback(validatedData);
      
      res.status(201).json(feedback);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error submitting technician feedback:", error);
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  });

  // Get all technician feedback (admin only)
  app.get("/api/admin/technician-feedback", requireAdminAuth, async (req, res) => {
    try {
      const feedback = await storage.getAllTechnicianFeedback();
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching technician feedback:", error);
      res.status(500).json({ error: "Failed to fetch technician feedback" });
    }
  });

  // Note: CYST Service Report routes moved to the legal compliance section below

  // File upload endpoint for technicians
  app.post("/api/technician/upload-files", requireTechnicianAuth, async (req, res) => {
    try {
      // For demonstration purposes, simulate file upload
      // In production, integrate with proper file storage service like Replit Object Storage
      const { workOrderId, uploadType } = req.body;
      
      if (!workOrderId || !uploadType) {
        return res.status(400).json({ error: "Work order ID and upload type are required" });
      }
      
      // Simulate file paths based on upload type and timestamp
      const timestamp = Date.now();
      const mockFilePaths = [
        `/uploads/work-order-${workOrderId}/${uploadType}-${timestamp}-photo1.jpg`,
        `/uploads/work-order-${workOrderId}/${uploadType}-${timestamp}-photo2.jpg`
      ];
      
      console.log(`Simulated file upload for work order ${workOrderId}, type: ${uploadType}`);
      
      res.json({ 
        success: true, 
        filePaths: mockFilePaths,
        message: `${mockFilePaths.length} files uploaded successfully`,
        uploadType,
        workOrderId
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ error: "Failed to upload files" });
    }
  });

  // Note: CYST Service Report update routes moved to the legal compliance section below

  // =========================================================================
  // CLIENT AUTHENTICATION & RBAC SYSTEM
  // =========================================================================

  // Client authentication middleware
  const requireClientAuth = (req: any, res: any, next: any) => {
    if (!req.session.clientUser) {
      return res.status(401).json({ error: "Client authentication required" });
    }
    next();
  };

  // Register new client account (triggered by service payment)
  app.post("/api/client/auth/register", async (req, res) => {
    try {
      const { fullName, email, phone, password, companyName, serviceRequestId } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Account already exists with this email" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Generate username from email
      const username = email.split('@')[0] + '_' + Date.now();
      
      // Create user account
      const newUser = await storage.createUser({
        username,
        password: hashedPassword,
        fullName,
        email,
        phone,
        companyName,
        role: 'client'
      });

      // Generate email verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create client account record
      await storage.createClientAccount({
        userId: newUser.id,
        serviceRequestId: serviceRequestId || null,
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
        accountCreatedFromPayment: true,
        paymentConfirmed: false
      });

      // Send verification email
      try {
        await sendClientVerificationEmail(email, verificationToken, fullName);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Continue with registration even if email fails
      }

      res.json({ 
        message: "Account created successfully. Please check your email for verification instructions.",
        userId: newUser.id 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Verify email
  app.post("/api/client/auth/verify-email", async (req, res) => {
    try {
      const { token, email } = req.body;
      
      // Find client account with matching token
      const clientAccount = await storage.getClientAccountByVerificationToken(token);
      if (!clientAccount) {
        return res.status(400).json({ error: "Invalid or expired verification token" });
      }

      // Check if token is expired
      if (new Date() > new Date(clientAccount.emailVerificationExpiry!)) {
        return res.status(400).json({ error: "Verification token has expired" });
      }

      // Verify user email matches
      const user = await storage.getUser(clientAccount.userId);
      if (!user || user.email !== email) {
        return res.status(400).json({ error: "Email verification failed" });
      }

      // Update user as email verified
      await storage.updateUser(user.id, { isEmailVerified: true });
      
      // Generate MFA code
      const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
      const mfaExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Update client account with MFA code
      await storage.updateClientAccount(clientAccount.id, {
        emailVerificationToken: null,
        emailVerificationExpiry: null,
        mfaVerificationCode: mfaCode,
        mfaVerificationExpiry: mfaExpiry
      });

      // Send MFA code via email
      try {
        await sendMfaCode(email, mfaCode, user.fullName || 'Client');
      } catch (error) {
        console.error('Failed to send MFA code:', error);
      }

      res.json({ message: "Email verified. Please complete MFA verification." });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ error: "Email verification failed" });
    }
  });

  // Verify MFA
  app.post("/api/client/auth/verify-mfa", async (req, res) => {
    try {
      const { code, email } = req.body;
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      // Find client account
      const clientAccount = await storage.getClientAccountByUserId(user.id);
      if (!clientAccount) {
        return res.status(400).json({ error: "Client account not found" });
      }

      // Verify MFA code
      if (clientAccount.mfaVerificationCode !== code) {
        return res.status(400).json({ error: "Invalid verification code" });
      }

      // Check if code is expired
      if (new Date() > new Date(clientAccount.mfaVerificationExpiry!)) {
        return res.status(400).json({ error: "Verification code has expired" });
      }

      // Update user and client account
      await storage.updateUser(user.id, { 
        mfaEnabled: true,
        lastLoginAt: new Date()
      });
      
      await storage.updateClientAccount(clientAccount.id, {
        mfaVerificationCode: null,
        mfaVerificationExpiry: null,
        captchaVerified: true // Auto-verify for now
      });

      // Create session
      req.session.clientUser = {
        id: user.id,
        email: user.email!,
        role: user.role!,
        fullName: user.fullName || undefined
      };

      res.json({ 
        message: "Account activated successfully",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      });
    } catch (error) {
      console.error("MFA verification error:", error);
      res.status(500).json({ error: "MFA verification failed" });
    }
  });

  // Client login
  app.post("/api/client/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Check if account is verified
      if (!user.isEmailVerified) {
        return res.status(400).json({ error: "Please verify your email before logging in" });
      }

      // Update last login
      await storage.updateUser(user.id, { lastLoginAt: new Date() });

      // Create session
      req.session.clientUser = {
        id: user.id,
        email: user.email!,
        role: user.role!,
        fullName: user.fullName || undefined
      };

      res.json({ 
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Get current client user
  app.get("/api/client/auth/user", async (req, res) => {
    try {
      if (!req.session.clientUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.clientUser.id);
      if (!user) {
        req.session.clientUser = undefined;
        return res.status(401).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        companyName: user.companyName,
        phone: user.phone
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Client logout
  app.post("/api/client/auth/logout", (req, res) => {
    req.session.clientUser = undefined;
    res.json({ message: "Logged out successfully" });
  });

  // Get client service data with real-time tracking
  app.get("/api/client/service-data", requireClientAuth, async (req, res) => {
    try {
      // Get client account
      const clientAccount = await storage.getClientAccountByUserId(req.session.clientUser!.id);
      if (!clientAccount || !clientAccount.serviceRequestId) {
        return res.status(404).json({ error: "No service request found" });
      }

      // Get service request
      const serviceRequest = await storage.getServiceRequest(clientAccount.serviceRequestId);
      if (!serviceRequest) {
        return res.status(404).json({ error: "Service request not found" });
      }

      // Get assigned technician (if any)
      const workOrders = await storage.getWorkOrdersByServiceRequestId(clientAccount.serviceRequestId);
      let assignedTechnician = null;
      let workOrder = null;

      if (workOrders.length > 0) {
        workOrder = workOrders[0]; // Get the latest work order
        if (workOrder.technicianId) {
          const techProfile = await storage.getTechnicianProfileByTechId(workOrder.technicianId);
          if (techProfile) {
            const techUser = await storage.getUser(techProfile.userId);
            if (techUser) {
              assignedTechnician = {
                id: techProfile.id,
                name: techUser.fullName || techUser.username,
                phone: techUser.phone || 'Not provided',
                email: techUser.email || 'Not provided',
                specializations: techProfile.specializations || [],
                rating: techProfile.rating || 5,
                estimatedArrival: workOrder.dispatchedAt || new Date().toISOString()
              };
            }
          }
        }
      }

      // Get documents from work order
      const documents = [];
      if (workOrder && workOrder.serviceReportFile) {
        documents.push({
          id: 1,
          fileName: 'Service Report.pdf',
          fileType: 'PDF',
          uploadedAt: workOrder.updatedAt || new Date().toISOString(),
          fileSize: '2.5 MB',
          downloadUrl: `/api/documents/work-order/${workOrder.id}/report`
        });
      }

      const responseData = {
        serviceRequest: {
          id: serviceRequest.id,
          companyName: serviceRequest.companyName,
          contactName: serviceRequest.contactPersonName,
          contactEmail: serviceRequest.primaryEmail,
          contactPhone: serviceRequest.officePhone,
          serviceType: serviceRequest.serviceCategory,
          priority: serviceRequest.urgencyLevel || 'Medium',
          status: serviceRequest.status,
          scheduledDate: serviceRequest.desiredStartDate,
          estimatedDuration: serviceRequest.timeCapHours || 2,
          totalCost: serviceRequest.calculatedTotal || 0,
          description: serviceRequest.projectDescription,
          createdAt: serviceRequest.createdAt
        },
        assignedTechnician,
        workOrder: workOrder ? {
          id: workOrder.id,
          status: workOrder.status,
          arrivedAt: workOrder.arrivedAt,
          departedAt: workOrder.departedAt,
          totalHoursWorked: workOrder.totalHoursWorked,
          workDescription: workOrder.workDescription,
          beforePhotos: workOrder.beforePhotos || [],
          afterPhotos: workOrder.afterPhotos || [],
          serviceReportFile: workOrder.serviceReportFile,
          clientSignature: workOrder.clientSignature,
          closingRemarks: workOrder.closingRemarks
        } : null,
        documents
      };

      res.json(responseData);
    } catch (error) {
      console.error("Get service data error:", error);
      res.status(500).json({ error: "Failed to get service data" });
    }
  });

  // Helper function to send verification email
  async function sendClientVerificationEmail(email: string, token: string, name: string) {
    try {
      if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
        console.log('Mailgun not configured, skipping email');
        return;
      }

      const Mailgun = require('mailgun.js');
      const formData = require('form-data');
      const mailgunClient = new Mailgun(formData);
      const mg = mailgunClient.client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY!,
      });

      const verificationUrl = `${process.env.APP_URL || 'https://cyberlockx.xyz'}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

      await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
        from: `CyberLockX <${process.env.NOTIFICATION_EMAIL}>`,
        to: [email],
        subject: 'Verify Your CyberLockX Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Welcome to CyberLockX, ${name}!</h2>
            <p>Thank you for creating your account. Please verify your email address to complete your registration.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6b7280;">${verificationUrl}</p>
            <p style="color: #6b7280; font-size: 14px;">This link will expire in 24 hours.</p>
          </div>
        `
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      // Don't throw error, just log it
    }
  }

  // Helper function to send MFA code
  async function sendMfaCode(email: string, code: string, name: string) {
    try {
      if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
        console.log('Mailgun not configured, skipping MFA email');
        return;
      }

      const Mailgun = require('mailgun.js');
      const formData = require('form-data');
      const mailgunClient = new Mailgun(formData);
      const mg = mailgunClient.client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY!,
      });

      await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
        from: `CyberLockX <${process.env.NOTIFICATION_EMAIL}>`,
        to: [email],
        subject: 'Your CyberLockX Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Account Verification</h2>
            <p>Hello ${name},</p>
            <p>Your verification code is:</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                ${code}
              </div>
            </div>
            <p>Enter this code to complete your account setup. This code will expire in 10 minutes.</p>
            <p style="color: #6b7280; font-size: 14px;">For security reasons, do not share this code with anyone.</p>
          </div>
        `
      });
    } catch (error) {
      console.error('Error sending MFA code:', error);
      // Don't throw error, just log it
    }
  }
  
  // Service Ticket API routes
  app.get("/api/tickets", requireAdminAuth, async (req, res) => {
    try {
      const tickets = await storage.getAllServiceTickets();
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });

  app.get("/api/tickets/search", requireAdminAuth, async (req, res) => {
    try {
      const searchParams = {
        chronologicalNumber: req.query.chronologicalNumber ? parseInt(req.query.chronologicalNumber as string) : undefined,
        status: req.query.status as "open" | "assigned" | "completed" | "in_progress" | "closed" | "cancelled" | undefined,
        stateCode: req.query.stateCode as string,
        cityCode: req.query.cityCode as string,
        companyCode: req.query.companyCode as string,
        assignedTechnicianId: req.query.assignedTechnicianId ? parseInt(req.query.assignedTechnicianId as string) : undefined,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };
      
      const tickets = await storage.searchServiceTickets(searchParams);
      res.json(tickets);
    } catch (error) {
      console.error("Error searching tickets:", error);
      res.status(500).json({ error: "Failed to search tickets" });
    }
  });

  app.get("/api/tickets/:id", requireAdminAuth, async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const ticket = await storage.getServiceTicketById(ticketId);
      
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      
      res.json(ticket);
    } catch (error) {
      console.error("Error fetching ticket:", error);
      res.status(500).json({ error: "Failed to fetch ticket" });
    }
  });

  app.post("/api/tickets", requireAdminAuth, async (req, res) => {
    try {
      const ticketData = req.body;
      const newTicket = await storage.createServiceTicket(ticketData);
      res.json(newTicket);
    } catch (error) {
      console.error("Error creating ticket:", error);
      res.status(500).json({ error: "Failed to create ticket" });
    }
  });

  app.patch("/api/tickets/:id/assign", requireAdminAuth, async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const { technicianId } = req.body;
      
      const updatedTicket = await storage.assignTicketToTechnician(ticketId, technicianId);
      
      if (!updatedTicket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      
      res.json(updatedTicket);
    } catch (error) {
      console.error("Error assigning ticket:", error);
      res.status(500).json({ error: "Failed to assign ticket" });
    }
  });

  app.patch("/api/tickets/:id/status", requireAdminAuth, async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const { status } = req.body;
      
      const updatedTicket = await storage.updateTicketStatus(ticketId, status);
      
      if (!updatedTicket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      
      res.json(updatedTicket);
    } catch (error) {
      console.error("Error updating ticket status:", error);
      res.status(500).json({ error: "Failed to update ticket status" });
    }
  });

  // Automatically create tickets when service requests are created
  app.post("/api/service-requests", async (req, res) => {
    try {
      const serviceRequestData = req.body;
      
      // Create the service request first
      const serviceRequest = await storage.createServiceRequest(serviceRequestData);
      
      // Extract location information for ticket generation
      const address = serviceRequest.address as any;
      
      // Generate ticket with naming convention
      const ticketData = {
        serviceRequestId: serviceRequest.id,
        stateCode: extractStateCode(address?.state || ''),
        cityCode: extractCityCode(address?.city || ''),
        companyCode: extractCompanyCode(serviceRequest.companyName),
        clientCompanyName: serviceRequest.companyName,
        clientLocation: `${address?.city || ''}, ${address?.state || ''}`,
        serviceDescription: serviceRequest.projectDescription || '',
        priority: mapUrgencyToPriority(serviceRequest.urgencyLevel || 'medium')
      };
      
      // Create the ticket
      const ticket = await storage.createServiceTicket(ticketData);
      
      res.json({
        serviceRequest,
        ticket
      });
    } catch (error) {
      console.error("Error creating service request and ticket:", error);
      res.status(500).json({ error: "Failed to create service request" });
    }
  });

  // Helper functions for ticket naming convention
  function extractStateCode(state: string): string {
    const stateMap: { [key: string]: string } = {
      'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
      'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
      'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
      'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
      'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
      'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
      'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
      'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
      'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
      'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
    };
    return stateMap[state] || state.substring(0, 2).toUpperCase();
  }

  function extractCityCode(city: string): string {
    return city.replace(/[^A-Za-z]/g, '').substring(0, 4).toUpperCase().padEnd(4, 'X');
  }

  function extractCompanyCode(companyName: string): string {
    const words = companyName.split(' ').filter(word => word.length > 0);
    if (words.length >= 3) {
      return words.slice(0, 3).map(word => word.charAt(0).toUpperCase()).join('');
    } else if (words.length === 2) {
      return (words[0].substring(0, 2) + words[1].charAt(0)).toUpperCase();
    } else {
      return companyName.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase().padEnd(3, 'X');
    }
  }

  function mapUrgencyToPriority(urgency: string): 'low' | 'medium' | 'high' | 'critical' {
    const urgencyMap: { [key: string]: 'low' | 'medium' | 'high' | 'critical' } = {
      'Low': 'low',
      'Medium': 'medium', 
      'High': 'high',
      'Critical': 'critical'
    };
    return urgencyMap[urgency] || 'medium';
  }

  // CYST Reports API Routes (Legal Compliance)
  
  // Get all CYST reports (admin only)
  app.get("/api/cyst-reports", requireAdminAuth, async (req, res) => {
    try {
      const reports = await storage.getCystReports();
      res.json(reports);
    } catch (error) {
      console.error("Error getting CYST reports:", error);
      res.status(500).json({ error: "Failed to get CYST reports" });
    }
  });

  // Get CYST report by ID
  app.get("/api/cyst-reports/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getCystReport(id);
      if (!report) {
        return res.status(404).json({ error: "CYST report not found" });
      }
      res.json(report);
    } catch (error) {
      console.error("Error getting CYST report:", error);
      res.status(500).json({ error: "Failed to get CYST report" });
    }
  });

  // Get CYST reports by technician (technician can see their own)
  app.get("/api/technician/cyst-reports", requireTechnicianAuth, async (req, res) => {
    try {
      const technicianId = req.session.technicianUser?.id;
      if (!technicianId) {
        return res.status(401).json({ error: "Technician authentication required" });
      }
      
      const reports = await storage.getCystReportsByTechnician(technicianId);
      res.json(reports);
    } catch (error) {
      console.error("Error getting technician CYST reports:", error);
      res.status(500).json({ error: "Failed to get CYST reports" });
    }
  });

  // Get CYST reports by work order
  app.get("/api/work-orders/:workOrderId/cyst-reports", requireAdminAuth, async (req, res) => {
    try {
      const workOrderId = parseInt(req.params.workOrderId);
      const reports = await storage.getCystReportsByWorkOrder(workOrderId);
      res.json(reports);
    } catch (error) {
      console.error("Error getting work order CYST reports:", error);
      res.status(500).json({ error: "Failed to get CYST reports" });
    }
  });

  // Create new CYST report (technician only)
  app.post("/api/cyst-reports", requireTechnicianAuth, async (req, res) => {
    try {
      const technicianId = req.session.technicianUser?.id;
      if (!technicianId) {
        return res.status(401).json({ error: "Technician authentication required" });
      }

      const validatedData = insertCystReportSchema.parse({
        ...req.body,
        technicianId
      });
      
      const report = await storage.createCystReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating CYST report:", error);
      res.status(500).json({ error: "Failed to create CYST report" });
    }
  });

  // Update CYST report (technician can update their own drafts)
  app.put("/api/cyst-reports/:id", requireTechnicianAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const technicianId = req.session.technicianUser?.id;
      
      // Check if report exists and belongs to this technician
      const existingReport = await storage.getCystReport(id);
      if (!existingReport) {
        return res.status(404).json({ error: "CYST report not found" });
      }
      
      if (existingReport.technicianId !== technicianId) {
        return res.status(403).json({ error: "Can only update your own reports" });
      }
      
      if (existingReport.status !== 'draft') {
        return res.status(400).json({ error: "Can only update draft reports" });
      }

      const report = await storage.updateCystReport(id, req.body);
      if (!report) {
        return res.status(404).json({ error: "CYST report not found" });
      }
      res.json(report);
    } catch (error) {
      console.error("Error updating CYST report:", error);
      res.status(500).json({ error: "Failed to update CYST report" });
    }
  });

  // Submit CYST report for manager approval
  app.post("/api/cyst-reports/:id/submit", requireTechnicianAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const technicianId = req.session.technicianUser?.id;
      
      const existingReport = await storage.getCystReport(id);
      if (!existingReport) {
        return res.status(404).json({ error: "CYST report not found" });
      }
      
      if (existingReport.technicianId !== technicianId) {
        return res.status(403).json({ error: "Can only submit your own reports" });
      }
      
      if (existingReport.status !== 'draft') {
        return res.status(400).json({ error: "Report has already been submitted" });
      }

      const report = await storage.updateCystReportStatus(id, 'submitted');
      res.json(report);
    } catch (error) {
      console.error("Error submitting CYST report:", error);
      res.status(500).json({ error: "Failed to submit CYST report" });
    }
  });

  // Approve CYST report (admin/manager only)
  app.post("/api/cyst-reports/:id/approve", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { managerName, managerSignature } = req.body;
      
      if (!managerName || !managerSignature) {
        return res.status(400).json({ error: "Manager name and signature required" });
      }

      // Update with manager approval
      const report = await storage.updateCystReport(id, {
        managerName,
        managerSignature,
        managerSignedAt: new Date(),
        legallyValid: true
      });
      
      if (!report) {
        return res.status(404).json({ error: "CYST report not found" });
      }

      // Set status to approved
      const approvedReport = await storage.updateCystReportStatus(id, 'approved');
      res.json(approvedReport);
    } catch (error) {
      console.error("Error approving CYST report:", error);
      res.status(500).json({ error: "Failed to approve CYST report" });
    }
  });

  // CYST Photos API Routes
  
  // Get photos for a CYST report
  app.get("/api/cyst-reports/:reportId/photos", requireAdminAuth, async (req, res) => {
    try {
      const reportId = parseInt(req.params.reportId);
      const photos = await storage.getCystPhotosByReport(reportId);
      res.json(photos);
    } catch (error) {
      console.error("Error getting CYST photos:", error);
      res.status(500).json({ error: "Failed to get CYST photos" });
    }
  });

  // Upload photo for CYST report (technician only)
  app.post("/api/cyst-reports/:reportId/photos", requireTechnicianAuth, async (req, res) => {
    try {
      const reportId = parseInt(req.params.reportId);
      const technicianId = req.session.technicianUser?.id;
      
      if (!technicianId) {
        return res.status(401).json({ error: "Technician authentication required" });
      }

      const validatedData = insertCystPhotoSchema.parse({
        ...req.body,
        cystReportId: reportId,
        technicianId
      });
      
      const photo = await storage.createCystPhoto(validatedData);
      res.status(201).json(photo);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating CYST photo:", error);
      res.status(500).json({ error: "Failed to upload photo" });
    }
  });

  // Delete CYST photo (technician can delete their own)
  app.delete("/api/cyst-photos/:id", requireTechnicianAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const technicianId = req.session.technicianUser?.id;
      
      const photo = await storage.getCystPhoto(id);
      if (!photo) {
        return res.status(404).json({ error: "Photo not found" });
      }
      
      if (photo.technicianId !== technicianId) {
        return res.status(403).json({ error: "Can only delete your own photos" });
      }

      await storage.deleteCystPhoto(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting CYST photo:", error);
      res.status(500).json({ error: "Failed to delete photo" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
