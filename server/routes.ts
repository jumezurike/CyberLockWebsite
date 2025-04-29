import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAssessmentSchema, insertEarlyAccessSubmissionSchema, insertRasbitaReportSchema } from "@shared/schema";
import { ZodError } from "zod";
import Stripe from "stripe";

// Initialize Stripe with API key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Get all assessments (for a user)
  app.get("/api/assessments", async (req, res) => {
    try {
      const assessments = await storage.getAllAssessments();
      res.json(assessments);
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

  // Create a new assessment
  app.post("/api/assessments", async (req, res) => {
    try {
      const validatedData = insertAssessmentSchema.parse(req.body);
      const newAssessment = await storage.createAssessment(validatedData);
      res.status(201).json(newAssessment);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        console.error("Error creating assessment:", error);
        res.status(500).json({ error: "Failed to create assessment" });
      }
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
  
  app.get("/api/early-access/submissions", async (req, res) => {
    try {
      const submissions = await storage.getAllEarlyAccessSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching early access submissions:", error);
      res.status(500).json({ error: "Failed to fetch early access submissions" });
    }
  });
  
  app.get("/api/early-access/submissions/:id", async (req, res) => {
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
  
  app.patch("/api/early-access/submissions/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const submission = await storage.updateEarlyAccessSubmissionStatus(parseInt(req.params.id), status);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      
      res.json(submission);
    } catch (error) {
      console.error("Error updating early access submission status:", error);
      res.status(500).json({ error: "Failed to update early access submission status" });
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
  
  const httpServer = createServer(app);
  return httpServer;
}
