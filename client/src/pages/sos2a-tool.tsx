import React, { useState, useEffect } from "react";
import { Sos2aFormData, MatrixItem, AssessmentReport, SecurityRisk } from "@/lib/sos2a-types";
import { format, formatDistanceToNow, formatDistance, differenceInDays, parseISO } from "date-fns";
import QuestionnaireForm from "@/components/sos2a/questionnaire-form";
import MatrixForm from "@/components/sos2a/matrix-form";
import GapAnalysis from "@/components/sos2a/gap-analysis";
import ReportDisplay from "@/components/sos2a/report-display";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { GapAnalysisResult } from "@/lib/gap-analysis-types";

// Sample scorecard data for testing
const sampleScorecardData = [
  { parameter: "Phishing screening", weight: 8.33, score: 65 },
  { parameter: "Security awareness", weight: 8.33, score: 72 },
  { parameter: "External footprints", weight: 8.33, score: 48 },
  { parameter: "Dark web", weight: 8.33, score: 35 },
  { parameter: "Endpoint security", weight: 8.33, score: 80 },
  { parameter: "Cloud security", weight: 8.33, score: 58 },
  { parameter: "Data security", weight: 8.33, score: 71 },
  { parameter: "Browser security", weight: 8.33, score: 62 },
  { parameter: "Email protection", weight: 8.33, score: 75 },
  { parameter: "Compliances", weight: 8.33, score: 54 },
  { parameter: "Regulatory requirements", weight: 8.33, score: 42 },
  { parameter: "Frameworks", weight: 8.33, score: 65 },
  { parameter: "Device inventory", weight: 8.33, score: 70 },
];

// Sample report for testing purposes
const sampleReport: AssessmentReport = {
  id: 'sample-report-123',
  businessId: 'sample-business-123',
  reportType: 'preliminary',
  createdAt: new Date().toISOString(),
  securityScore: 68,
  businessLocation: { state: "California", country: "USA" },
  industry: "Technology",
  businessServices: "Cloud Services Provider",
  operationModes: ["Remote-First"],
  internetPresence: ["E-commerce", "Marketing"],
  ismsStatus: {
    implementation: "partial",
    policies: {
      implemented: ["information-security-policy", "acceptable-use-policy"],
      missing: ["access-control-policy", "password-policy", "data-classification-policy"]
    },
    plans: {
      implemented: ["disaster-recovery-plan"],
      missing: ["business-continuity-plan", "risk-treatment-plan"]
    },
    procedures: {
      implemented: ["incident-reporting-procedure"],
      missing: ["user-access-provisioning-procedure", "patch-management-procedure"]
    },
    processes: {
      implemented: ["security-incident-response-process"],
      missing: ["continuous-monitoring-process", "access-review-process"]
    },
    recommendedNext: ["Implement access control policy", "Develop patch management procedure"]
  },
  findings: [
    { severity: 'High', title: 'Unpatched Systems', description: 'Critical security patches missing on multiple systems.' },
    { severity: 'Medium', title: 'Weak Password Policies', description: 'Password policies do not enforce complexity requirements.' }
  ],
  vulnerabilities: {
    critical: ['Outdated SSL certificates', 'Default admin credentials'],
    high: ['Weak encryption implementation', 'Insecure file upload'],
    medium: ['Missing CSRF protections', 'Improper error handling'],
    low: ['Verbose error messages', 'Insecure cookie settings']
  },
  recommendations: {
    immediate: ['Implement patch management system', 'Update SSL certificates'],
    shortTerm: ['Enforce password complexity requirements', 'Implement MFA for all admin accounts'],
    longTerm: ['Conduct regular security training', 'Implement security monitoring solutions']
  },
  frameworkGaps: {
    operations: ['Missing incident response procedures', 'Inadequate change management process'],
    management: ['No defined security roles and responsibilities', 'Missing risk assessment process'],
    technology: ['No endpoint protection solution', 'Missing network segmentation']
  },
  complianceStatus: {
    standards: [
      { standard: 'ISO 27001', status: 'Partially Compliant', gaps: [] },
      { standard: 'NIST CSF', status: 'Non-Compliant', gaps: [] }
    ],
    regulations: [
      { standard: 'GDPR', status: 'Partially Compliant', gaps: [] },
      { standard: 'CCPA', status: 'Non-Compliant', gaps: [] }
    ],
    frameworks: [
      { standard: 'CIS Controls', status: 'Partially Compliant', gaps: [] },
      { standard: 'NIST 800-53', status: 'Non-Compliant', gaps: [] }
    ]
  },
  policyDocumentStatus: {
    existing: ['Acceptable Use Policy'],
    missing: ['Incident Response Plan', 'Business Continuity Plan', 'Disaster Recovery Plan'],
    recommendations: ['Develop missing policy documents']
  },
  osHardeningStatus: {
    stig: {
      compliant: false,
      gaps: ['STIG not implemented for required systems']
    },
    scap: {
      compliant: false,
      gaps: ['SCAP not implemented for required systems']
    }
  },
  mitreAttackCoverage: {
    covered: [],
    vulnerable: ['Initial Access', 'Execution', 'Persistence', 'Privilege Escalation'],
    recommendations: ['Implement controls to mitigate Initial Access tactics']
  },
  matrixData: [],
  scorecard: sampleScorecardData,
  rasbitaScore: {
    total: 68,
    categories: {
      govern: 65,
      identify: 70,
      protect: 75,
      detect: 60,
      respond: 62,
      recover: 55,
      // Legacy fields for backward compatibility
      risk: 70,
      securityControls: 75,
      architecture: 62
    }
  }
};

export default function Sos2aTool() {
  // State for multi-step form
  const [step, setStep] = useState<'questionnaire' | 'matrix' | 'gap-analysis' | 'report'>('questionnaire'); // Start at questionnaire (first step)
  const [formData, setFormData] = useState<Sos2aFormData | null>(null);
  const [matrixData, setMatrixData] = useState<MatrixItem[] | null>(null);
  const [gapAnalysisResult, setGapAnalysisResult] = useState<GapAnalysisResult | null>(null);
  const [report, setReport] = useState<AssessmentReport | null>(null); // Don't use sample report by default
  const [savedAssessments, setSavedAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  
  // Search state
  const [searchCompanyName, setSearchCompanyName] = useState<string>("");
  const [searchFromDate, setSearchFromDate] = useState<string>("");
  const [searchToDate, setSearchToDate] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  
  // State for form persistence
  const [hasSavedData, setHasSavedData] = useState<boolean>(false);
  
  // Parse query parameters on component mount
  useEffect(() => {
    // Get the tab parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      setSelectedTab(tabParam);
      // Ensure we're on the questionnaire step
      setStep('questionnaire');
    }
  }, []);
  
  const { toast } = useToast();
  
  // Load saved assessments from database
  const loadSavedAssessments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/assessments');
      if (response.ok) {
        const assessments = await response.json();
        setSavedAssessments(assessments);
        console.log("Loaded assessments from database:", assessments);
      }
    } catch (error) {
      console.error("Error loading saved assessments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('sos2a_form_data');
    const savedMatrixData = localStorage.getItem('sos2a_matrix_data');
    const savedStep = localStorage.getItem('sos2a_current_step');
    
    // Load saved assessments from database
    loadSavedAssessments();
    
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        // Only set saved data if it's not null and has a businessName
        if (parsedData && parsedData.businessName) {
          setFormData(parsedData);
          setHasSavedData(true);
          
          // Show toast notification about saved data
          toast({
            title: "Saved Data Restored",
            description: "Your previous form data has been loaded. You can continue where you left off.",
          });
        }
      } catch (error) {
        console.error("Error parsing saved form data:", error);
        // If there's an error, clear the invalid data
        localStorage.removeItem('sos2a_form_data');
      }
    }
    
    if (savedMatrixData) {
      try {
        const parsedMatrix = JSON.parse(savedMatrixData);
        if (parsedMatrix && Array.isArray(parsedMatrix)) {
          setMatrixData(parsedMatrix);
        }
      } catch (error) {
        console.error("Error parsing saved matrix data:", error);
        localStorage.removeItem('sos2a_matrix_data');
      }
    }
    
    if (savedStep) {
      const validSteps = ['questionnaire', 'matrix', 'gap-analysis', 'report'];
      if (validSteps.includes(savedStep)) {
        setStep(savedStep as 'questionnaire' | 'matrix' | 'gap-analysis' | 'report');
      }
    }
  }, []);
  
  // Progress percentage based on current step and report type
  const isComprehensive = formData?.reportType === 'comprehensive';
  const progressPercentage = step === 'questionnaire' 
    ? 20 
    : step === 'matrix' 
      ? 40 
      : step === 'gap-analysis'
        ? 60
        : (step === 'report' && !isComprehensive)
          ? 80  // Preliminary report (80% complete)
          : 100; // Comprehensive report (100% complete)
  
  // Show review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Helper functions for assessment lifecycle tracking
  
  // Calculate age of assessment in days
  const calculateAssessmentAge = (createdAt: string): number => {
    try {
      return differenceInDays(new Date(), parseISO(createdAt));
    } catch (error) {
      console.error("Error calculating assessment age:", error);
      return 0;
    }
  };
  
  // Format assessment age for display
  const formatAssessmentAge = (createdAt: string): string => {
    try {
      return formatDistanceToNow(parseISO(createdAt), { addSuffix: true });
    } catch (error) {
      console.error("Error formatting assessment age:", error);
      return "Unknown";
    }
  };
  
  // Get a badge color based on assessment age
  const getAgeBadgeColor = (age: number): string => {
    if (age <= 30) return "rgba(22, 163, 74, 0.2)"; // Current (green)
    if (age <= 90) return "rgba(37, 99, 235, 0.2)"; // Recent (blue)
    if (age <= 180) return "rgba(251, 191, 36, 0.2)"; // Aging (amber)
    return "rgba(220, 38, 38, 0.8)"; // Outdated (red, more opaque)
  };

  // Save form data to localStorage
  const saveFormDataToLocalStorage = (data: Sos2aFormData) => {
    try {
      localStorage.setItem('sos2a_form_data', JSON.stringify(data));
      localStorage.setItem('sos2a_current_step', 'questionnaire');
    } catch (error) {
      console.error("Error saving form data to localStorage:", error);
    }
  };
  
  // Save matrix data to localStorage
  const saveMatrixDataToLocalStorage = (data: MatrixItem[]) => {
    try {
      localStorage.setItem('sos2a_matrix_data', JSON.stringify(data));
      localStorage.setItem('sos2a_current_step', 'matrix');
    } catch (error) {
      console.error("Error saving matrix data to localStorage:", error);
    }
  };
  
  // Clear saved data from localStorage
  const clearSavedData = () => {
    localStorage.removeItem('sos2a_form_data');
    localStorage.removeItem('sos2a_matrix_data');
    localStorage.removeItem('sos2a_current_step');
    setHasSavedData(false);
  };

  // Auto-save form data as it's being filled out
  useEffect(() => {
    if (formData) {
      saveFormDataToLocalStorage(formData);
    }
  }, [formData]);
  
  // Handle form submission
  const handleQuestionnaireSubmit = (data: Sos2aFormData) => {
    console.log("Parent component received form submission", data);
    console.log("ISMS Processes from questionnaire:", data.ismsProcesses);
    
    // Force-add all processes for testing
    // Remove this code when done testing
    if (!data.ismsProcesses || data.ismsProcesses.length === 0) {
      console.log("Adding all processes for testing purposes");
      data.ismsProcesses = [
        "info-security-policy", "risk-assessments", "asset-inventory", 
        "access-control", "identity-management", "data-encryption", 
        "security-awareness", "change-management", "vulnerability-scanning", 
        "incident-response", "privileged-access", "security-audits", 
        "network-security", "backup-recovery", "penetration-testing", 
        "data-classification", "vendor-risk", "physical-security"
      ];
    }
    
    // First show the review modal
    setFormData(data);
    // Save to localStorage
    saveFormDataToLocalStorage(data);
    setShowReviewModal(true);
    
    // Show informative toast with clear next steps
    toast({
      title: "Questionnaire received",
      description: "Please review your submission details before proceeding to the next step.",
    });
  };
  
  // Handle final submission after review
  const handleFinalSubmit = async () => {
    if (!formData) return;
    
    setIsLoading(true);
    try {
      // Prepare assessment data for submission
      const assessmentData = {
        businessName: formData.businessName,
        industry: formData.showCustomIndustry ? formData.customIndustry : formData.industry,
        employeeCount: formData.employeeCount,
        securityMeasures: formData.securityMeasures || [],
        primaryConcerns: formData.primaryConcerns || [],
        contactInfo: formData.contactInfo,
        reportType: formData.reportType,
        matrixData: formData, // Store the entire form data as matrix data
        findings: {
          hasArchitectureDiagrams: formData.hasArchitectureDiagrams,
          submittedAt: new Date().toISOString(),
          businessLocation: formData.businessLocation,
          businessServices: formData.businessServices,
          operationMode: formData.operationMode,
          internetPresence: formData.internetPresence
        }
      };

      // Submit to database
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdAssessment = await response.json();
      console.log("Assessment saved to database:", createdAssessment);

      // Clear localStorage data since it's now persisted
      localStorage.removeItem('sos2a_form_data');
      
      setShowReviewModal(false);
      setStep('matrix');
      localStorage.setItem('sos2a_current_step', 'matrix');
      
      toast({
        title: "Assessment saved successfully",
        description: "Your questionnaire has been saved to the database. Moving to Interview & Matrix Population step.",
      });
      
      // Check if user provided architecture diagrams
      const hasArchitectureDiagrams = formData?.hasArchitectureDiagrams === true;
      
      if (!hasArchitectureDiagrams) {
        setTimeout(() => {
          toast({
            title: "Architecture Diagrams Not Provided",
            description: "The Architecture Threat Modeling component will be marked as 'Not Assessed' in your report. You can upload diagrams later for a more complete assessment.",
            duration: 6000,
          });
        }, 3000);
      }

    } catch (error) {
      console.error("Error saving assessment:", error);
      toast({
        title: "Error saving assessment",
        description: "Failed to save your assessment to the database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate scorecard data with the 12 standard parameters
  const generateScorecardData = (data: MatrixItem[], reportType: 'preliminary' | 'comprehensive') => {
    // Using 8.33% as weight since we have 12 parameters (adding up to 100%)
    const standardWeight = 8.33;
    
    // Function to generate a score based on reportType and implementation status
    const generateScore = (baseScore: number): number => {
      // Comprehensive reports have more accurate scores based on evidence
      // Preliminary reports are more estimate-based and tend to be more optimistic
      const randomFactor = reportType === 'comprehensive' 
        ? Math.floor(Math.random() * 20) - 10 // +/- 10% for comprehensive (more accurate)
        : Math.floor(Math.random() * 10)      // 0-10% uplift for preliminary (more optimistic)
      
      const finalScore = reportType === 'comprehensive'
        ? baseScore + randomFactor
        : baseScore + randomFactor;
        
      // Ensure score is between 0-100
      return Math.max(0, Math.min(100, finalScore));
    };
    
    // Question 2 - Operation Security
    const operationSecurityScore = generateScore(data.some(item => 
      item.operationControls?.implemented 
    ) ? 70 : 40);
    
    // Question 3 - Management Security
    const managementSecurityScore = generateScore(data.some(item => 
      item.managementControls?.implemented
    ) ? 65 : 35);
    
    // Question 4 - Technology Security
    const technologySecurityScore = generateScore(data.some(item => 
      item.technologyControls?.implemented
    ) ? 60 : 30);
    
    // Question 5 - People Security
    const peopleSecurityScore = generateScore(data.some(item => 
      item.peopleControls?.implemented
    ) ? 55 : 25);
    
    // Question 6 - Standards & Frameworks
    const standardsScore = generateScore(data.some(item => 
      item.standards?.nistCsf || 
      item.standards?.iso27001 || 
      item.standards?.cisCsc
    ) ? 75 : 45);
    
    // Question 7 - Compliance Requirements
    const complianceScore = generateScore(data.some(item => 
      item.complianceStandards?.pciDss || 
      item.complianceStandards?.hipaa || 
      item.complianceStandards?.gdpr
    ) ? 65 : 40);
    
    // Question 8 - Regulatory Requirements
    const regulatoryScore = generateScore(data.some(item => 
      item.regulatoryRequirements?.pciDss || 
      item.regulatoryRequirements?.hipaa || 
      item.regulatoryRequirements?.gdpr
    ) ? 70 : 45);
    
    // Question 9 - ISMS (Information Security Management System)
    const ismsScore = generateScore(data.some(item => 
      item.ismsImplemented
    ) ? 60 : 35);
    
    // Question 10 - Risk Management
    const riskManagementScore = generateScore(data.some(item => 
      item.riskManagementProcess
    ) ? 70 : 40);
    
    // Education & Awareness
    const educationAwarenessScore = generateScore(data.some(item => 
      item.educationAwareness
    ) ? 65 : 30);
    
    // Scores for the 12 proven threats used in quantitative analysis
    
    // 1. Phishing Screening
    const phishingScreeningScore = generateScore(data.some(item => 
      item.technologyControls?.frameworks?.includes('email_security')
    ) ? 65 : 35);
    
    // 2. Security Awareness 
    const securityAwarenessScore = generateScore(data.some(item => 
      item.educationAwareness
    ) ? 65 : 30);
    
    // 3. External Footprints
    const externalFootprintsScore = generateScore(data.some(item => 
      item.technologyControls?.frameworks?.includes('perimeter_security') ||
      item.technologyControls?.frameworks?.includes('network_security')
    ) ? 70 : 45);
    
    // 4. Dark Web
    const darkWebScore = generateScore(data.some(item => 
      item.risks?.includes('data_breach') || 
      item.vulnerabilities?.includes('credential_exposure')
    ) ? 45 : 25);
    
    // 5. Endpoint Security
    const endpointSecurityScore = generateScore(data.some(item => 
      item.technologyControls?.frameworks?.includes('endpoint_protection') ||
      item.technologyControls?.frameworks?.includes('device_security')
    ) ? 80 : 40);
    
    // 6. Cloud Security
    const cloudSecurityScore = generateScore(data.some(item => 
      item.technologyControls?.frameworks?.includes('cloud_security')
    ) ? 58 : 30);
    
    // 7. Data Security
    const dataSecurityScore = generateScore(data.some(item => 
      item.technologyControls?.frameworks?.includes('data_protection') ||
      item.technologyControls?.frameworks?.includes('encryption')
    ) ? 71 : 35);
    
    // 8. Browser Security
    const browserSecurityScore = generateScore(data.some(item => 
      item.technologyControls?.frameworks?.includes('web_security')
    ) ? 62 : 30);
    
    // 9. Email Protection
    const emailProtectionScore = generateScore(data.some(item => 
      item.technologyControls?.frameworks?.includes('email_security') ||
      item.technologyControls?.frameworks?.includes('spam_protection')
    ) ? 75 : 40);
    
    // 10. Compliances
    const compliancesScore = generateScore(data.some(item => 
      item.complianceStandards?.pciDss || 
      item.complianceStandards?.hipaa || 
      item.complianceStandards?.gdpr ||
      item.complianceStandards?.soc2
    ) ? 65 : 40);
    
    // 11. Regulatory Requirements
    const regulatoryRequirementsScore = generateScore(data.some(item => 
      item.regulatoryRequirements?.pciDss || 
      item.regulatoryRequirements?.hipaa || 
      item.regulatoryRequirements?.gdpr ||
      item.regulatoryRequirements?.fisma
    ) ? 70 : 45);
    
    // 12. Frameworks
    const frameworksScore = generateScore(data.some(item => 
      item.standards?.nistCsf || 
      item.standards?.iso27001 || 
      item.standards?.cisCsc
    ) ? 75 : 45);
    
    // 13. Device Inventory
    const deviceInventoryScore = generateScore(data.some(item => 
      item.technologyControls?.frameworks?.includes('device_inventory') ||
      item.technologyControls?.frameworks?.includes('asset_management')
    ) ? 70 : 40);
    
    return [
      // The 13 parameters used in quantitative analysis
      { parameter: "Phishing Screening", weight: standardWeight, score: phishingScreeningScore },
      { parameter: "Security Awareness", weight: standardWeight, score: securityAwarenessScore },
      { parameter: "External Footprints", weight: standardWeight, score: externalFootprintsScore },
      { parameter: "Dark Web", weight: standardWeight, score: darkWebScore },
      { parameter: "Endpoint Security", weight: standardWeight, score: endpointSecurityScore },
      { parameter: "Cloud Security", weight: standardWeight, score: cloudSecurityScore },
      { parameter: "Data Security", weight: standardWeight, score: dataSecurityScore },
      { parameter: "Browser Security", weight: standardWeight, score: browserSecurityScore },
      { parameter: "Email Protection", weight: standardWeight, score: emailProtectionScore },
      { parameter: "Compliances", weight: standardWeight, score: compliancesScore },
      { parameter: "Regulatory Requirements", weight: standardWeight, score: regulatoryRequirementsScore },
      { parameter: "Frameworks", weight: standardWeight, score: frameworksScore },
      { parameter: "Device Inventory", weight: standardWeight, score: deviceInventoryScore }
    ];
  };

  // Handle matrix submission
  const handleMatrixSubmit = async (data: MatrixItem[]) => {
    setMatrixData(data);
    // Save matrix data to localStorage
    saveMatrixDataToLocalStorage(data);
    
    // Proceed to gap analysis step
    setStep('gap-analysis');
    localStorage.setItem('sos2a_current_step', 'gap-analysis');
    
    toast({
      title: "Matrix Completion Successful",
      description: "Moving to Gap Analysis step to identify security deficits in your organization.",
    });
  };
  
  // Handle gap analysis completion
  const handleGapAnalysisComplete = async (result: GapAnalysisResult) => {
    // Store the gap analysis results
    setGapAnalysisResult(result);
    
    if (!formData || !matrixData) {
      toast({
        title: "Error Generating Report",
        description: "Missing required data for report generation. Please complete previous steps.",
        variant: "destructive",
      });
      return;
    }
    
    const reportType = formData?.reportType || 'preliminary';
    
    // Generate the report based on the form, matrix data, and gap analysis
    const calculatedRasbitaScore = calculateRasbitaScore(matrixData, formData);
    
    // Create the rasbitaCategories property in the format expected by the RasbitaReport type
    const rasbitaCategories = {
      govern: calculatedRasbitaScore.categories.govern,
      identify: calculatedRasbitaScore.categories.identify,
      protect: calculatedRasbitaScore.categories.protect, 
      detect: calculatedRasbitaScore.categories.detect,
      respond: calculatedRasbitaScore.categories.respond,
      recover: calculatedRasbitaScore.categories.recover
    };
    
    // Extract high-priority recommendations from gap analysis
    const criticalRecommendations = result.prioritizedRecommendations
      .filter(rec => rec.priority === 'Critical')
      .map(rec => rec.recommendation);
    
    const highRecommendations = result.prioritizedRecommendations
      .filter(rec => rec.priority === 'High')
      .map(rec => rec.recommendation);
    
    const mediumRecommendations = result.prioritizedRecommendations
      .filter(rec => rec.priority === 'Medium')
      .map(rec => rec.recommendation);
    
    const defaultRecommendations = generateRecommendations(matrixData);
    
    // Combine gap analysis findings with existing findings
    const gapFindings: SecurityRisk[] = Object.entries(result.parameterScores)
      .flatMap(([parameter, data]) => 
        data.gaps.slice(0, 3).map(gap => ({
          severity: gap.percentageImpact >= 3 ? 'High' as const : 
                   gap.percentageImpact >= 1 ? 'Medium' as const : 'Low' as const,
          title: `${parameter}: ${gap.controlName}`,
          description: gap.nextSteps
        }))
      );
    
    const combinedFindings: SecurityRisk[] = [
      ...gapFindings,
      ...identifySecurityRisks(matrixData)
    ].slice(0, 10); // Limit to top 10 findings
    
    // Generate the report with gap analysis data
    const generatedReport: AssessmentReport = {
      id: 'report-' + Date.now(),
      businessId: matrixData[0]?.infraType + '-' + Date.now() || 'business-' + Date.now(),
      reportType: reportType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      age: 0, // New report, age is 0 days
      securityScore: Math.round(result.overallScore.percentage), // Use gap analysis score
      businessLocation: formData?.businessLocation || { state: "Unknown", country: "Unknown", zipCode: "" },
      industry: formData?.industry || "Unknown",
      businessServices: formData?.businessServices || "Unknown",
      operationModes: formData?.operationMode || [],
      internetPresence: formData?.internetPresence || [],
      findings: combinedFindings,
      vulnerabilities: categorizeLVulnerabilities(matrixData),
      recommendations: {
        immediate: criticalRecommendations.length > 0 ? criticalRecommendations : defaultRecommendations.immediate,
        shortTerm: highRecommendations.length > 0 ? highRecommendations : defaultRecommendations.shortTerm,
        longTerm: mediumRecommendations.length > 0 ? mediumRecommendations : defaultRecommendations.longTerm
      },
      frameworkGaps: identifyFrameworkGaps(matrixData),
      complianceStatus: evaluateComplianceStatus(matrixData),
      policyDocumentStatus: evaluatePolicyDocumentStatus(matrixData),
      osHardeningStatus: evaluateOsHardeningStatus(matrixData),
      ismsStatus: evaluateIsmsStatus(matrixData, formData),
      mitreAttackCoverage: evaluateMitreAttackCoverage(matrixData),
      matrixData: matrixData,
      scorecard: generateScorecardData(matrixData, reportType),
      rasbitaScore: calculatedRasbitaScore,
      rasbitaCategories: rasbitaCategories
    };
    
    setReport(generatedReport);
    setStep('report');
    
    // Save the assessment to the database
    try {
      // We already calculated RASBITA score above, reuse it for consistency
      // The rasbitaCategories property is already in the format expected by the RasbitaReport type
      
      // Make sure we have the required contact info
      if (!formData?.contactInfo || !formData.contactInfo.name || !formData.contactInfo.email || !formData.contactInfo.phone) {
        console.error("Missing required contact information:", formData?.contactInfo);
        throw new Error("Missing required contact information");
      }
      
      // Make sure we have the required employee count
      if (!formData?.employeeCount) {
        console.error("Missing required employee count");
        throw new Error("Missing required employee count");
      }
      
      const assessmentData = {
        businessName: formData?.businessName || "Unknown",
        industry: formData?.industry || "Unknown",
        employeeCount: formData?.employeeCount,
        contactInfo: formData?.contactInfo,
        reportType: reportType,
        securityScore: Math.round(result.overallScore.percentage),
        securityMeasures: formData?.securityMeasures || [],
        primaryConcerns: formData?.primaryConcerns || [],
        findings: JSON.stringify(combinedFindings),
        recommendations: JSON.stringify({
          immediate: criticalRecommendations.length > 0 ? criticalRecommendations : defaultRecommendations.immediate,
          shortTerm: highRecommendations.length > 0 ? highRecommendations : defaultRecommendations.shortTerm,
          longTerm: mediumRecommendations.length > 0 ? mediumRecommendations : defaultRecommendations.longTerm
        }),
        matrixData: JSON.stringify(matrixData),
        gapAnalysis: JSON.stringify(result),
        rasbitaScore: JSON.stringify(calculatedRasbitaScore),
        rasbitaCategories: JSON.stringify(rasbitaCategories),
        createdAt: new Date().toISOString()
      };
      
      console.log("Saving assessment data:", assessmentData);
      
      const response = await apiRequest("POST", "/api/assessments", assessmentData);
      
      if (!response.ok) {
        // Get the detailed error message from the response if possible
        let errorMessage = "Failed to save assessment";
        try {
          const errorData = await response.json();
          console.error("Server error response:", errorData);
          errorMessage = errorData.error || errorMessage;
          
          // Log validation errors if they exist
          if (errorData.details) {
            console.error("Validation errors:", errorData.details);
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
        
        throw new Error(errorMessage);
      } else {
        const savedData = await response.json();
        console.log("Assessment saved successfully:", savedData);
      }
      
      // Show a success message
      toast({
        title: "Assessment Saved",
        description: "Your assessment has been successfully saved to the database and can be accessed from the Assessment History section.",
      });
      
      // Refresh the list of saved assessments
      const assessmentsResponse = await apiRequest("GET", "/api/assessments");
      if (assessmentsResponse.ok) {
        const assessments = await assessmentsResponse.json();
        setSavedAssessments(assessments);
        console.log("Fetched saved assessments:", assessments);
      } else {
        console.error("Failed to fetch saved assessments after saving");
      }
    } catch (error) {
      console.error("Error saving assessment:", error);
      toast({
        title: "Save Error",
        description: error instanceof Error ? error.message : "There was an error saving your assessment. Please try again or check the console for details.",
        variant: "destructive",
      });
    }
  };
  
  // Go back to previous step
  const handleBack = () => {
    if (step === 'matrix') setStep('questionnaire');
    if (step === 'gap-analysis') setStep('matrix');
    if (step === 'report') setStep('gap-analysis');
  };
  
  // Handle starting over
  const handleStartOver = () => {
    setStep('questionnaire');
    setFormData(null);
    setMatrixData(null);
    setGapAnalysisResult(null);
    setReport(null);
    setSelectedAssessmentId("");
    // Clear all saved data from localStorage
    clearSavedData();
    
    toast({
      title: "Starting Over",
      description: "All saved data has been cleared. You can now begin a new assessment.",
    });
  };
  
  // Search for assessments based on filters
  const handleSearchAssessments = async () => {
    setIsSearching(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (searchCompanyName) params.append('companyName', searchCompanyName);
      if (searchFromDate) params.append('fromDate', searchFromDate);
      if (searchToDate) params.append('toDate', searchToDate);
      
      const queryString = params.toString();
      const endpoint = queryString ? `/api/assessments?${queryString}` : '/api/assessments';
      
      const response = await apiRequest("GET", endpoint);
      
      if (!response.ok) {
        throw new Error("Failed to search assessments");
      }
      
      const assessments = await response.json();
      setSavedAssessments(assessments);
      
      // Show feedback to user
      toast({
        title: assessments.length > 0 ? "Search Results" : "No matches found",
        description: assessments.length > 0 
          ? `Found ${assessments.length} assessment(s) matching your criteria.` 
          : "Try broadening your search criteria.",
      });
      
    } catch (error) {
      console.error("Error searching assessments:", error);
      toast({
        title: "Search Error",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  // Clear all search filters and show all assessments
  const handleClearSearch = async () => {
    setSearchCompanyName("");
    setSearchFromDate("");
    setSearchToDate("");
    
    setIsLoading(true);
    try {
      const response = await apiRequest("GET", "/api/assessments");
      
      if (!response.ok) {
        throw new Error("Failed to fetch all assessments");
      }
      
      const assessments = await response.json();
      setSavedAssessments(assessments);
    } catch (error) {
      console.error("Error fetching all assessments:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch saved assessments on component mount
  useEffect(() => {
    const fetchSavedAssessments = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest("GET", "/api/assessments");
        
        if (!response.ok) {
          throw new Error("Failed to fetch saved assessments");
        }
        
        const assessments = await response.json();
        setSavedAssessments(assessments);
      } catch (error) {
        console.error("Error fetching saved assessments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSavedAssessments();
  }, []);
  
  // Load an assessment by ID
  const loadAssessment = async (id: string) => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const response = await apiRequest("GET", `/api/assessments/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load assessment with ID: ${id}`);
      }
      
      const assessment = await response.json();
      
      // Parse matrix data if it's stored as a string
      if (typeof assessment.matrixData === 'string' && assessment.matrixData) {
        try {
          assessment.matrixData = JSON.parse(assessment.matrixData);
        } catch (e) {
          console.error("Error parsing matrix data:", e);
          assessment.matrixData = null;
        }
      }
      
      // Calculate assessment age in days
      const assessmentAge = calculateAssessmentAge(assessment.createdAt);
      
      // Update the assessment with calculated age
      assessment.age = assessmentAge;
      
      // Set the report
      setReport(assessment);
      setStep('report');
      setSelectedAssessmentId(id);
      
    } catch (error) {
      console.error("Error loading assessment:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete an assessment by ID
  const deleteAssessment = async (id: string) => {
    if (!id) return;
    
    if (confirm("Are you sure you want to delete this assessment? This action cannot be undone.")) {
      setIsLoading(true);
      try {
        const response = await apiRequest("DELETE", `/api/assessments/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to delete assessment with ID: ${id}`);
        }
        
        // Remove the deleted assessment from the list
        setSavedAssessments(savedAssessments.filter(assessment => 
          assessment.id.toString() !== id
        ));
        
        // Reset selected assessment if it was deleted
        if (selectedAssessmentId === id) {
          setSelectedAssessmentId("");
          setReport(null);
          setStep('questionnaire');
        }
        
        toast({
          title: "Assessment deleted",
          description: "The assessment has been successfully deleted.",
          variant: "default",
        });
        
      } catch (error) {
        console.error("Error deleting assessment:", error);
        toast({
          title: "Error",
          description: "Failed to delete the assessment. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Calculate security score based on matrix data
  const calculateSecurityScore = (data: MatrixItem[]): number => {
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    // Calculate score based on implementations
    data.forEach(item => {
      // Operation controls
      if (item.operationControls.applicable) {
        maxPossibleScore += 10;
        if (item.operationControls.implemented) totalScore += 10;
      }
      
      // Management controls
      if (item.managementControls.applicable) {
        maxPossibleScore += 10;
        if (item.managementControls.implemented) totalScore += 10;
      }
      
      // Technology controls
      if (item.technologyControls.applicable) {
        maxPossibleScore += 10;
        if (item.technologyControls.implemented) totalScore += 10;
      }
      
      // OS Hardening
      maxPossibleScore += 5;
      if (item.osHardening.stigScap) totalScore += 5;
      
      // Education & Awareness
      if (item.educationAwareness) {
        totalScore += 5;
      }
      maxPossibleScore += 5;
    });
    
    // Return percentage score (0 to 100)
    return maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  };
  
  // Identify security risks based on matrix data
  const identifySecurityRisks = (data: MatrixItem[]) => {
    const prioritizedRisks = [];
    
    // Collect all risks from matrix data
    const allRisks = data.flatMap(item => 
      item.risks.map(risk => ({
        severity: determineSeverity(risk),
        title: risk,
        description: `Risk associated with ${item.infraType} infrastructure.`
      }))
    );
    
    // Filter out duplicate risks by title
    const uniqueRisks = allRisks.filter((risk, index, self) => 
      index === self.findIndex(r => r.title === risk.title)
    );
    
    // Prioritize by severity: High, Medium, Low
    const highRisks = uniqueRisks.filter(risk => risk.severity === 'High');
    const mediumRisks = uniqueRisks.filter(risk => risk.severity === 'Medium');
    const lowRisks = uniqueRisks.filter(risk => risk.severity === 'Low');
    
    return [...highRisks, ...mediumRisks, ...lowRisks];
  };
  
  // Determine risk severity based on risk title (simple heuristic)
  const determineSeverity = (riskTitle: string): 'High' | 'Medium' | 'Low' => {
    const highSeverityKeywords = ['breach', 'attack', 'unauthorized', 'malware', 'ransomware', 'theft', 'exposure'];
    const mediumSeverityKeywords = ['disruption', 'misconfiguration', 'default', 'outdated', 'weak', 'insecure'];
    
    const lowercaseTitle = riskTitle.toLowerCase();
    
    if (highSeverityKeywords.some(keyword => lowercaseTitle.includes(keyword))) {
      return 'High';
    } else if (mediumSeverityKeywords.some(keyword => lowercaseTitle.includes(keyword))) {
      return 'Medium';
    } else {
      return 'Low';
    }
  };
  
  // Categorize vulnerabilities by severity
  const categorizeLVulnerabilities = (data: MatrixItem[]) => {
    const allVulnerabilities = data.flatMap(item => item.vulnerabilities);
    
    // Simple categorization based on keywords
    const critical: string[] = [];
    const high: string[] = [];
    const medium: string[] = [];
    const low: string[] = [];
    
    const criticalKeywords = ['unpatched', 'outdated', 'default password', 'unsecured', 'exposed'];
    const highKeywords = ['weak', 'inadequate', 'misconfigured', 'insufficient'];
    const mediumKeywords = ['limited', 'incomplete', 'unclear', 'lack of'];
    
    allVulnerabilities.forEach(vuln => {
      const lowercaseVuln = vuln.toLowerCase();
      
      if (criticalKeywords.some(keyword => lowercaseVuln.includes(keyword))) {
        critical.push(vuln);
      } else if (highKeywords.some(keyword => lowercaseVuln.includes(keyword))) {
        high.push(vuln);
      } else if (mediumKeywords.some(keyword => lowercaseVuln.includes(keyword))) {
        medium.push(vuln);
      } else {
        low.push(vuln);
      }
    });
    
    return { critical, high, medium, low };
  };
  
  // Generate recommendations based on matrix data
  const generateRecommendations = (data: MatrixItem[]) => {
    const immediate: string[] = [];
    const shortTerm: string[] = [];
    const longTerm: string[] = [];
    
    // Check implementation status for critical controls
    data.forEach(item => {
      // If operation controls are not implemented, add recommendation
      if (item.operationControls.applicable && !item.operationControls.implemented) {
        immediate.push(`Implement operation controls for ${item.infraType} infrastructure using ${item.operationControls.frameworks.join(', ')} frameworks.`);
      }
      
      // If management controls are not implemented, add recommendation
      if (item.managementControls.applicable && !item.managementControls.implemented) {
        shortTerm.push(`Implement management controls for ${item.infraType} infrastructure using ${item.managementControls.frameworks.join(', ')} frameworks.`);
      }
      
      // If technology controls are not implemented, add recommendation
      if (item.technologyControls.applicable && !item.technologyControls.implemented) {
        shortTerm.push(`Implement technology controls for ${item.infraType} infrastructure using ${item.technologyControls.frameworks.join(', ')} frameworks.`);
      }
      
      // If OS hardening is not implemented but needed
      if (!item.osHardening.stigScap) {
        longTerm.push(`Implement OS hardening through STIG/SCAP for ${item.infraType} infrastructure.`);
      }
      
      // If education & awareness is needed but not implemented
      if (!item.educationAwareness) {
        immediate.push(`Develop and implement education & awareness training for users of ${item.infraType} infrastructure.`);
      }
    });
    
    return { immediate, shortTerm, longTerm };
  };
  
  // Evaluate Information Security Management System (ISMS) status based on form data and matrix items
  const evaluateIsmsStatus = (data: MatrixItem[], formData: Sos2aFormData | null) => {
    // Default implementation status if not provided in form data
    const implementation = formData?.ismsImplementation || 'none';
    
    // Collect all ISMS components from matrix items
    const allPolicies = new Set<string>();
    const allPlans = new Set<string>();
    const allProcedures = new Set<string>();
    const allProcesses = new Set<string>();
    
    // Recommended policies, plans, procedures, and processes based on industry
    const healthcareRecommendedPolicies = [
      "hipaa-privacy-policy",
      "hipaa-security-policy", 
      "phi-handling-policy", 
      "information-security-policy", 
      "data-classification-policy"
    ];
    
    const healthcareRecommendedPlans = [
      "phi-breach-response-plan",
      "healthcare-contingency-plan",
      "disaster-recovery-plan",
      "security-awareness-training-plan"
    ];
    
    const healthcareRecommendedProcedures = [
      "phi-access-procedure",
      "hipaa-audit-procedure",
      "patient-data-transfer-procedure",
      "incident-reporting-procedure"
    ];
    
    const healthcareRecommendedProcesses = [
      "hipaa-compliance-monitoring",
      "healthcare-security-review",
      "continuous-monitoring-process"
    ];
    
    // Process formData to identify implemented components
    const implementedPolicies = formData?.ismsPolicies || [];
    const implementedPlans = formData?.ismsPlans || [];
    const implementedProcedures = formData?.ismsProcedures || [];
    const implementedProcesses = formData?.ismsProcesses || [];
    
    // Process matrix data to identify recommended components based on infrastructure
    data.forEach(item => {
      // Add all ISMS components from the matrix item
      if (item.isms) {
        if (Array.isArray(item.isms.policies)) {
          item.isms.policies.forEach(policy => allPolicies.add(policy));
        }
        if (Array.isArray(item.isms.plans)) {
          item.isms.plans.forEach(plan => allPlans.add(plan));
        }
        if (Array.isArray(item.isms.procedures)) {
          item.isms.procedures.forEach(procedure => allProcedures.add(procedure));
        }
        if (Array.isArray(item.isms.processes)) {
          item.isms.processes.forEach(process => allProcesses.add(process));
        }
      }
      
      // For healthcare industry, add healthcare-specific components
      if (formData?.industry === "healthcare") {
        healthcareRecommendedPolicies.forEach(policy => allPolicies.add(policy));
        healthcareRecommendedPlans.forEach(plan => allPlans.add(plan));
        healthcareRecommendedProcedures.forEach(procedure => allProcedures.add(procedure));
        healthcareRecommendedProcesses.forEach(process => allProcesses.add(process));
      }
    });
    
    // Determine missing components (those recommended but not implemented)
    const missingPolicies = Array.from(allPolicies).filter(policy => !implementedPolicies.includes(policy));
    const missingPlans = Array.from(allPlans).filter(plan => !implementedPlans.includes(plan));
    const missingProcedures = Array.from(allProcedures).filter(procedure => !implementedProcedures.includes(procedure));
    const missingProcesses = Array.from(allProcesses).filter(process => !implementedProcesses.includes(process));
    
    // Generate recommendations for next steps
    const recommendedNext: string[] = [];
    
    // Prioritize recommendations based on implementation status
    if (implementation === 'none' || implementation === 'planning') {
      // Starting from scratch - focus on foundational policies first
      if (missingPolicies.includes("information-security-policy")) {
        recommendedNext.push("Develop an Information Security Policy");
      }
      
      if (formData?.industry === "healthcare") {
        if (missingPolicies.includes("hipaa-privacy-policy")) {
          recommendedNext.push("Develop a HIPAA Privacy Policy");
        }
        if (missingPolicies.includes("hipaa-security-policy")) {
          recommendedNext.push("Develop a HIPAA Security Policy");
        }
      }
      
      if (missingPlans.includes("disaster-recovery-plan")) {
        recommendedNext.push("Create a Disaster Recovery Plan");
      }
      
    } else if (implementation === 'implementing' || implementation === 'operational') {
      // Building on existing foundation - focus on maturity
      if (missingProcesses.includes("continuous-monitoring-process")) {
        recommendedNext.push("Establish a Continuous Monitoring Process");
      }
      
      if (formData?.industry === "healthcare") {
        if (missingProcedures.includes("phi-access-procedure")) {
          recommendedNext.push("Implement PHI Access Procedures");
        }
        if (missingProcesses.includes("hipaa-compliance-monitoring")) {
          recommendedNext.push("Develop HIPAA Compliance Monitoring Process");
        }
      }
    } else if (implementation === 'certified' || implementation === 'hipaa' || implementation === 'hitrust') {
      // Mature program - focus on continuous improvement
      recommendedNext.push("Perform annual review and update of all ISMS components");
      recommendedNext.push("Conduct third-party assessment of ISMS effectiveness");
    }
    
    // Add a few general recommendations if list is too short
    if (recommendedNext.length < 3) {
      if (missingPlans.length > 0) {
        recommendedNext.push(`Develop missing plans (${missingPlans.slice(0, 2).join(", ")})`);
      }
      if (missingProcedures.length > 0) {
        recommendedNext.push(`Implement missing procedures (${missingProcedures.slice(0, 2).join(", ")})`);
      }
    }
    
    return {
      implementation,
      policies: {
        implemented: implementedPolicies,
        missing: missingPolicies
      },
      plans: {
        implemented: implementedPlans,
        missing: missingPlans
      },
      procedures: {
        implemented: implementedProcedures,
        missing: missingProcedures
      },
      processes: {
        implemented: implementedProcesses,
        missing: missingProcesses
      },
      recommendedNext
    };
  };
  
  // Identify framework control gaps based on matrix data
  const identifyFrameworkGaps = (data: MatrixItem[]) => {
    const operations: string[] = [];
    const management: string[] = [];
    const technology: string[] = [];
    
    // Collect all implementation gaps for each control category
    data.forEach(item => {
      if (item.operationControls.gaps.length > 0) {
        operations.push(`${item.infraType}: ${item.operationControls.gaps.join(', ')}`);
      }
      
      if (item.managementControls.gaps.length > 0) {
        management.push(`${item.infraType}: ${item.managementControls.gaps.join(', ')}`);
      }
      
      if (item.technologyControls.gaps.length > 0) {
        technology.push(`${item.infraType}: ${item.technologyControls.gaps.join(', ')}`);
      }
    });
    
    return { operations, management, technology };
  };
  
  // Evaluate compliance status based on matrix data
  const evaluateComplianceStatus = (data: MatrixItem[]) => {
    const standards: any[] = [];
    const regulations: any[] = [];
    const frameworks: any[] = [];
    
    // For simplicity, we'll just check if any standards, regulations, or frameworks are needed
    // but not implemented and mark them as "Non-Compliant", otherwise "Compliant"
    
    // Identify applicable standards and their status
    const standardsMap = new Map<string, boolean>();
    data.forEach(item => {
      Object.entries(item.standards).forEach(([key, value]) => {
        if (value) {
          // If already in map and compliant, keep it as is
          // Otherwise, set the value (true for first occurrence, false if any item is non-compliant)
          const current = standardsMap.get(key);
          if (current !== false) { // Only update if not already marked non-compliant
            standardsMap.set(key, true);
          }
        }
      });
    });
    
    // Convert map to array of ComplianceStatus objects
    standardsMap.forEach((isCompliant, standardName) => {
      standards.push({
        standard: standardName,
        status: isCompliant ? 'Compliant' : 'Non-Compliant',
        gaps: [],
      });
    });
    
    // Similar logic for regulatory requirements
    const regulationsMap = new Map<string, boolean>();
    data.forEach(item => {
      Object.entries(item.regulatoryRequirements).forEach(([key, value]) => {
        if (value) {
          const current = regulationsMap.get(key);
          if (current !== false) {
            regulationsMap.set(key, true);
          }
        }
      });
    });
    
    regulationsMap.forEach((isCompliant, regName) => {
      regulations.push({
        standard: regName,
        status: isCompliant ? 'Compliant' : 'Non-Compliant',
        gaps: [],
      });
    });
    
    // For frameworks, use the implementation status from controls
    const frameworksMap = new Map<string, boolean>();
    data.forEach(item => {
      // Operation control frameworks
      item.operationControls.frameworks.forEach(framework => {
        const current = frameworksMap.get(framework);
        const isImplemented = item.operationControls.implemented;
        if (current !== false) { // Only update if not already marked non-compliant
          frameworksMap.set(framework, isImplemented);
        }
      });
      
      // Management control frameworks
      item.managementControls.frameworks.forEach(framework => {
        const current = frameworksMap.get(framework);
        const isImplemented = item.managementControls.implemented;
        if (current !== false) {
          frameworksMap.set(framework, isImplemented);
        }
      });
      
      // Technology control frameworks
      item.technologyControls.frameworks.forEach(framework => {
        const current = frameworksMap.get(framework);
        const isImplemented = item.technologyControls.implemented;
        if (current !== false) {
          frameworksMap.set(framework, isImplemented);
        }
      });
    });
    
    frameworksMap.forEach((isImplemented, frameworkName) => {
      frameworks.push({
        standard: frameworkName,
        status: isImplemented ? 'Compliant' : 'Non-Compliant',
        gaps: [],
      });
    });
    
    return { standards, regulations, frameworks };
  };
  
  // Evaluate policy document status based on matrix data
  const evaluatePolicyDocumentStatus = (data: MatrixItem[]) => {
    const existing: string[] = [];
    const missing: string[] = [];
    const recommendations: string[] = [];
    
    // Collect all policy documents from all infrastructure items
    const allPolicies = new Set<string>();
    const allProcedures = new Set<string>();
    const allPlans = new Set<string>();
    const allProcesses = new Set<string>();
    
    data.forEach(item => {
      item.policyDocuments.policies.forEach(policy => allPolicies.add(policy));
      item.policyDocuments.procedures.forEach(procedure => allProcedures.add(procedure));
      item.policyDocuments.plans.forEach(plan => allPlans.add(plan));
      item.policyDocuments.processes.forEach(process => allProcesses.add(process));
    });
    
    // For now, assume all are missing
    // In a real implementation, we would check against formData or stored data
    allPolicies.forEach(policy => {
      missing.push(`Policy: ${policy}`);
      recommendations.push(`Develop and implement ${policy} policy`);
    });
    
    allProcedures.forEach(procedure => {
      missing.push(`Procedure: ${procedure}`);
      recommendations.push(`Develop and implement ${procedure} procedure`);
    });
    
    allPlans.forEach(plan => {
      missing.push(`Plan: ${plan}`);
      recommendations.push(`Develop and implement ${plan}`);
    });
    
    allProcesses.forEach(process => {
      missing.push(`Process: ${process}`);
      recommendations.push(`Develop and implement ${process}`);
    });
    
    return { existing, missing, recommendations };
  };
  
  // Evaluate OS hardening status based on matrix data
  const evaluateOsHardeningStatus = (data: MatrixItem[]) => {
    const stigNeeded = data.some(item => item.technologyControls.osHardening.stig);
    const scapNeeded = data.some(item => item.technologyControls.osHardening.scap);
    
    // Assume none are implemented for this example
    const stig = {
      compliant: false,
      gaps: ['STIG is not implemented for required systems'],
    };
    
    const scap = {
      compliant: false,
      gaps: ['SCAP is not implemented for required systems'],
    };
    
    return { stig, scap };
  };
  
  // Evaluate MITRE ATT&CK coverage based on matrix data
  const evaluateMitreAttackCoverage = (data: MatrixItem[]) => {
    const covered: string[] = [];
    const vulnerable: string[] = [];
    const recommendations: string[] = [];
    
    // Collect all MITRE tactics and techniques
    const allTactics = new Set<string>();
    const allTechniques = new Set<string>();
    
    data.forEach(item => {
      item.mitreTactics.forEach(tactic => allTactics.add(tactic));
      item.mitreTechniques.forEach(technique => allTechniques.add(technique));
    });
    
    // For now, assume none are covered
    allTactics.forEach(tactic => {
      vulnerable.push(tactic);
      recommendations.push(`Implement controls to mitigate ${tactic} tactics`);
    });
    
    allTechniques.forEach(technique => {
      vulnerable.push(technique);
      recommendations.push(`Implement controls to mitigate ${technique} technique`);
    });
    
    return { covered, vulnerable, recommendations };
  };
  
  // Calculate RASBITA score based on matrix data with industry-specific adjustments
  const calculateRasbitaScore = (data: MatrixItem[], formData?: Sos2aFormData | null) => {
    // Industry weight factors (healthcare gets higher weights for security)
    const industryWeights = {
      healthcare: {
        govern: 1.2,    // Higher governance importance for healthcare
        identify: 1.15, // Higher risk identification importance
        protect: 1.25,  // Much higher protection importance
        detect: 1.2,    // Higher detection importance
        respond: 1.3,   // Much higher response importance
        recover: 1.15   // Higher recovery importance
      },
      finance: {
        govern: 1.2,
        identify: 1.1,
        protect: 1.2,
        detect: 1.15,
        respond: 1.1,
        recover: 1.05
      },
      // Default weights for all other industries
      default: {
        govern: 1.0,
        identify: 1.0,
        protect: 1.0,
        detect: 1.0,
        respond: 1.0,
        recover: 1.0
      }
    };
    
    // Determine the industry from formData or the first matrix item
    const industry = formData?.industry?.toLowerCase() || '';
    const isHealthcare = industry === 'healthcare' || industry === 'medical' || 
                         industry === 'health' || industry === 'hospital';
    const isFinance = industry === 'finance' || industry === 'banking' || 
                      industry === 'financial services';
    
    // Select appropriate weights
    const weights = isHealthcare ? industryWeights.healthcare :
                    isFinance ? industryWeights.finance :
                    industryWeights.default;
    
    // Calculate scores for NIST CSF 2.0 domains
    
    // GOVERN - Based on management controls and governance frameworks
    let governScore = Math.round(calculateManagementScore(data) * 0.8 + 
      (data.some(item => item.standards.nistCsf || item.standards.iso27001) ? 20 : 0));
    
    // Apply industry weight to governance score
    governScore = Math.min(100, Math.round(governScore * weights.govern));
    
    // IDENTIFY - Based on asset inventory and risk identification
    let identifyScore = 100 - Math.min(data.flatMap(item => item.risks).length * 5, 50);
    
    // Apply industry weight to identify score
    identifyScore = Math.min(100, Math.round(identifyScore * weights.identify));
    
    // PROTECT - Based on security controls implementation
    let protectScore = calculateSecurityControlsScore(data);
    
    // Apply industry weight to protect score
    protectScore = Math.min(100, Math.round(protectScore * weights.protect));
    
    // DETECT - Based on monitoring capabilities and threat intelligence
    let detectScore = calculateThreatIntelligenceScore(data);
    
    // Apply industry weight to detect score
    detectScore = Math.min(100, Math.round(detectScore * weights.detect));
    
    // RESPOND - Based on incident response capabilities
    let respondScore = data.some(item => 
      item.operationControls.implemented && 
      item.operationControls.frameworks.includes('Incident Response')
    ) ? 80 : 40;
    
    // Apply industry weight to respond score
    respondScore = Math.min(100, Math.round(respondScore * weights.respond));
    
    // RECOVER - Based on business continuity/disaster recovery
    let recoverScore = data.some(item => 
      item.operationControls.implemented && 
      (item.operationControls.frameworks.includes('Disaster Recovery') || 
       item.operationControls.frameworks.includes('Business Continuity'))
    ) ? 75 : 35;
    
    // Apply industry weight to recover score
    recoverScore = Math.min(100, Math.round(recoverScore * weights.recover));
    
    // Calculate the total score as a weighted average based on industry
    const categoryScores = [
      { score: governScore, weight: weights.govern },
      { score: identifyScore, weight: weights.identify },
      { score: protectScore, weight: weights.protect },
      { score: detectScore, weight: weights.detect },
      { score: respondScore, weight: weights.respond },
      { score: recoverScore, weight: weights.recover }
    ];
    
    const totalWeightedScore = categoryScores.reduce((sum, cat) => sum + (cat.score * cat.weight), 0);
    const totalWeights = categoryScores.reduce((sum, cat) => sum + cat.weight, 0);
    const totalScore = Math.round(totalWeightedScore / totalWeights);
    
    // Calculate legacy scores for backward compatibility
    const riskScore = identifyScore;
    const architectureScore = data.some(item => 
      item.operationControls.implemented && 
      item.managementControls.implemented && 
      item.technologyControls.implemented
    ) ? 90 : 50;
    
    // GPA-style scoring for Information Security Management System (ISMS) maturity
    // Scale: 0-100 to 0-4.0
    const calculateGPAScore = (score: number): number => {
      return parseFloat((score / 25).toFixed(1)); // Convert 0-100 to 0-4.0 scale with one decimal
    };
    
    // Create GPA-equivalent scores for reporting
    const gpaScores = {
      total: calculateGPAScore(totalScore),
      govern: calculateGPAScore(governScore),
      identify: calculateGPAScore(identifyScore),
      protect: calculateGPAScore(protectScore),
      detect: calculateGPAScore(detectScore),
      respond: calculateGPAScore(respondScore),
      recover: calculateGPAScore(recoverScore)
    };
    
    // Healthcare-specific HIPAA compliance score (only calculated for healthcare industry)
    const hipaaComponents = isHealthcare ? {
      securityRuleScore: ((protectScore + detectScore) / 2) * 0.4, // 40% of compliance
      privacyRuleScore: governScore * 0.4, // 40% of compliance
      breachNotificationScore: respondScore * 0.2 // 20% of compliance
    } : null;
    
    const hipaaComplianceScore = hipaaComponents ? 
      Math.round(hipaaComponents.securityRuleScore + hipaaComponents.privacyRuleScore + hipaaComponents.breachNotificationScore) : null;
    
    return {
      total: totalScore,
      categories: {
        // New NIST CSF 2.0 domain scores
        govern: governScore,
        identify: identifyScore,
        protect: protectScore,
        detect: detectScore,
        respond: respondScore,
        recover: recoverScore,
        
        // Legacy fields for backward compatibility
        risk: riskScore,
        securityControls: protectScore,
        architecture: architectureScore
      },
      gpaScores: gpaScores,
      hipaaCompliance: isHealthcare ? hipaaComplianceScore : null,
      industryType: isHealthcare ? 'healthcare' : isFinance ? 'finance' : 'general'
    };
  };
  
  // Calculate security controls score for RASBITA
  const calculateSecurityControlsScore = (data: MatrixItem[]): number => {
    const operationScore = calculateOperationScore(data);
    const managementScore = calculateManagementScore(data);
    const technologyScore = calculateTechnologyScore(data);
    
    return Math.round((operationScore + managementScore + technologyScore) / 3);
  };
  
  // Calculate operation score
  const calculateOperationScore = (data: MatrixItem[]): number => {
    const totalItems = data.length;
    const implementedItems = data.filter(item => item.operationControls.implemented).length;
    
    return Math.round((implementedItems / totalItems) * 100);
  };
  
  // Calculate management score
  const calculateManagementScore = (data: MatrixItem[]): number => {
    const totalItems = data.length;
    const implementedItems = data.filter(item => item.managementControls.implemented).length;
    
    return Math.round((implementedItems / totalItems) * 100);
  };
  
  // Calculate technology score
  const calculateTechnologyScore = (data: MatrixItem[]): number => {
    const totalItems = data.length;
    const implementedItems = data.filter(item => item.technologyControls.implemented).length;
    
    return Math.round((implementedItems / totalItems) * 100);
  };
  
  // Calculate business impact score based on critical business services and assets
  const calculateBusinessImpactScore = (data: MatrixItem[]): number => {
    // Use risk information to determine business impact
    const riskCount = data.flatMap(item => item.risks).length;
    
    // More risks = higher business impact
    let baseScore = Math.min(riskCount * 10, 60);
    
    // Check if specific infrastructure types are present
    const hasFinancialSystems = data.some(item => 
      item.infraType.toLowerCase().includes('financial') || 
      item.infraType.toLowerCase().includes('payment')
    );
    
    const hasHealthcareData = data.some(item => 
      item.infraType.toLowerCase().includes('health') || 
      item.infraType.toLowerCase().includes('medical') ||
      item.infraType.toLowerCase().includes('patient')
    );
    
    // Add score for high-criticality systems
    if (hasFinancialSystems) baseScore += 20;
    if (hasHealthcareData) baseScore += 20;
    
    // Check if there are indications of e-commerce or web applications
    const hasEcommerce = data.some(item => 
      item.infraType.toLowerCase().includes('ecommerce') || 
      item.infraType.toLowerCase().includes('e-commerce')
    );
    
    const hasWebApp = data.some(item => 
      item.infraType.toLowerCase().includes('web app') || 
      item.infraType.toLowerCase().includes('webapp')
    );
    
    const hasMarketing = data.some(item => 
      item.infraType.toLowerCase().includes('marketing') || 
      item.infraType.toLowerCase().includes('website')
    );
    
    // Higher risk for e-commerce and web applications
    if (hasEcommerce) baseScore += 20;
    if (hasWebApp) baseScore += 15;
    if (hasMarketing) baseScore += 5;
    
    return Math.min(baseScore, 100);
  };
  
  // Calculate information assurance score based on OS hardening and data protection
  const calculateInformationAssuranceScore = (data: MatrixItem[]): number => {
    const hasOsHardening = data.some(item => item.osHardening.stigScap);
    const hasDataProtection = data.some(item => 
      item.managementControls.implemented && 
      item.managementControls.frameworks.includes('Data Protection')
    );
    const hasEncryption = data.some(item => 
      item.technologyControls.implemented && 
      (item.technologyControls.frameworks.includes('Encryption') || 
       item.technologyControls.frameworks.includes('Data Encryption'))
    );
    
    let score = 40; // Base score
    if (hasOsHardening) score += 20;
    if (hasDataProtection) score += 20;
    if (hasEncryption) score += 20;
    
    return Math.min(score, 100);
  };
  
  // Calculate threat intelligence score based on MITRE tactics and vulnerabilities
  const calculateThreatIntelligenceScore = (data: MatrixItem[]): number => {
    const mitreTacticsCount = data.flatMap(item => item.mitreTactics).length;
    const vulnerabilitiesCount = data.flatMap(item => item.vulnerabilities).length;
    
    // More tactics and vulnerabilities identified = better threat intelligence
    const tacticsScore = Math.min(mitreTacticsCount * 10, 60);
    const vulnerabilitiesScore = Math.min(vulnerabilitiesCount * 5, 40);
    
    return tacticsScore + vulnerabilitiesScore;
  };
  
  // Calculate architecture score based on implementation of all control types
  const calculateArchitectureScore = (data: MatrixItem[]): number => {
    // Check if all three control types are implemented
    const hasAllControls = data.some(item => 
      item.operationControls.implemented && 
      item.managementControls.implemented && 
      item.technologyControls.implemented
    );
    
    // Count items with specific framework implementations
    const hasNetworkSegmentation = data.some(item => 
      item.technologyControls.frameworks.includes('Network Segmentation')
    );
    
    const hasEndpointProtection = data.some(item => 
      item.technologyControls.frameworks.includes('Endpoint Protection')
    );
    
    const hasPatchManagement = data.some(item => 
      item.operationControls.frameworks.includes('Patch Management')
    );
    
    // Calculate score based on architecture components
    let score = hasAllControls ? 70 : 40;
    if (hasNetworkSegmentation) score += 10;
    if (hasEndpointProtection) score += 10;
    if (hasPatchManagement) score += 10;
    
    return Math.min(score, 100);
  };
  
  // Set document title based on current step
  useEffect(() => {
    if (step === 'questionnaire') {
      document.title = "HOS²A - Questionnaire";
    } else if (step === 'matrix') {
      document.title = "HOS²A - Matrix Population";
    } else if (step === 'gap-analysis') {
      document.title = "HOS²A - Gap Analysis";
    } else if (step === 'report') {
      document.title = "HOS²A - Assessment Report";
    }
  }, [step]);

  return (
    <div className="container mx-auto py-8">

      {/* Assessment Submission Confirmation Modal */}
      {showReviewModal && formData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-[#7936b0]">Assessment Submission Confirmation</h2>
            
            <div className="border rounded-md p-4 mb-4 bg-gray-50">
              <h3 className="font-medium mb-2">Assessment Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Business Name:</span> {formData.businessName}
                </div>
                <div>
                  <span className="font-medium">Industry:</span> {formData.industry}
                </div>
                <div>
                  <span className="font-medium">Report Type:</span> {formData.reportType === 'preliminary' ? 'Preliminary' : 'Comprehensive'}
                </div>
                <div>
                  <span className="font-medium">Contact:</span> {formData.contactInfo.name}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Next Steps in Your Assessment</h3>
              <p className="text-sm mb-2">
                Your assessment questionnaire has been successfully submitted. Here's what happens next:
              </p>
              <ol className="text-sm list-decimal pl-5 space-y-1">
                <li>You will now proceed to the <strong>Interview & Matrix Population</strong> step</li>
                <li>We'll review parameters from sections 2-10 of your questionnaire</li>
                <li>Our expert system will apply industry-specific knowledge to your organization's needs</li>
                <li>Additional interviews may be conducted to gather more detailed information</li>
                <li>A final assessment report will be generated based on all collected data</li>
              </ol>
            </div>
            
            <div className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#7936b0] hover:bg-[#6b2aa2] text-white" 
                onClick={handleFinalSubmit}
              >
                Proceed to Matrix Analysis
              </Button>
            </div>
          </div>
        </div>
      )}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Healthcare Organizational and System Security Analysis (HOS²A)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Assessment Search */}
          <div className="mb-6 border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-blue-50 p-3 border-b flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-600">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <h2 className="text-lg font-medium text-blue-700">Search Assessments</h2>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Company Name Search */}
                <div>
                  <Label className="text-sm font-medium mb-1 block">Company Name</Label>
                  <Input 
                    type="text" 
                    value={searchCompanyName}
                    onChange={(e) => setSearchCompanyName(e.target.value)}
                    placeholder="Enter company name"
                    className="w-full"
                  />
                </div>
                
                {/* From Date */}
                <div>
                  <Label className="text-sm font-medium mb-1 block">From Date</Label>
                  <Input 
                    type="date" 
                    value={searchFromDate}
                    onChange={(e) => setSearchFromDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                {/* To Date */}
                <div>
                  <Label className="text-sm font-medium mb-1 block">To Date</Label>
                  <Input 
                    type="date" 
                    value={searchToDate}
                    onChange={(e) => setSearchToDate(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  onClick={handleClearSearch}
                  variant="outline"
                  size="sm"
                  disabled={isSearching || (!searchCompanyName && !searchFromDate && !searchToDate)}
                  className="h-9"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m14.5 9-5 5"></path>
                    <path d="m9.5 9 5 5"></path>
                  </svg>
                  Clear
                </Button>
                <Button 
                  onClick={handleSearchAssessments}
                  disabled={isSearching || (!searchCompanyName && !searchFromDate && !searchToDate)}
                  className="bg-primary text-white hover:bg-primary/90 h-9"
                  size="sm"
                >
                  {isSearching ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Saved Assessments Section */}
          <div className="mb-6 border rounded-lg shadow-sm">
            <div className="bg-primary/10 p-3 border-b flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary">
                <path d="M12 8v4l3 3"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              <h2 className="text-lg font-medium">Assessment History</h2>
              {savedAssessments.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                  {savedAssessments.length} {savedAssessments.length === 1 ? 'report' : 'reports'}
                </span>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
                <div className="w-full md:flex-1">
                  <label className="text-sm font-medium mb-1 block">
                    Select a saved assessment to view
                  </label>
                  <Select 
                    value={selectedAssessmentId} 
                    onValueChange={(value) => setSelectedAssessmentId(value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={savedAssessments.length > 0 ? "Load a saved assessment" : "No saved assessments found"} />
                    </SelectTrigger>
                    <SelectContent>
                      {savedAssessments.length === 0 ? (
                        <div className="p-2 text-center text-muted-foreground text-sm">
                          No saved assessments found
                        </div>
                      ) : (
                        savedAssessments.map((assessment) => {
                          // Calculate and format the age for display
                          const age = calculateAssessmentAge(assessment.createdAt);
                          const ageDisplay = formatAssessmentAge(assessment.createdAt);
                          
                          return (
                            <SelectItem key={assessment.id} value={assessment.id.toString()}>
                              {format(parseISO(assessment.createdAt), 'MMM d, yyyy')} - {assessment.businessName || 'Unknown'} ({assessment.reportType}) 
                              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full inline-flex items-center" 
                                style={{
                                  backgroundColor: getAgeBadgeColor(age), 
                                  color: age > 180 ? '#fff' : age > 90 ? '#713f12' : age > 30 ? '#1e40af' : '#166534',
                                  fontWeight: 'medium'
                                }}>
                                {age <= 30 ? '✓ ' : age <= 90 ? '⚫ ' : age <= 180 ? '⚠ ' : '! '}
                                {ageDisplay}
                              </span>
                            </SelectItem>
                          );
                        })
                      )}
                    </SelectContent>
                  </Select>
                  
                  {savedAssessments.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Complete an assessment to have it saved in your history
                    </p>
                  )}
                </div>
                <div className="flex gap-2 w-full md:w-auto justify-end">
                  <Button 
                    onClick={() => loadAssessment(selectedAssessmentId)}
                    disabled={!selectedAssessmentId || isLoading}
                    variant="outline"
                    size="sm"
                    className="h-9"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    Load Report
                  </Button>
                  
                  {selectedAssessmentId && (
                    <Button 
                      onClick={() => deleteAssessment(selectedAssessmentId)}
                      disabled={isLoading}
                      variant="destructive"
                      size="sm"
                      className="h-9"
                      title="Delete selected assessment"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                      Delete
                    </Button>
                  )}
                  
                  <Button 
                    onClick={handleStartOver}
                    disabled={isLoading}
                    variant="secondary"
                    size="sm"
                    className="h-9"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Start New
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Assessment Progress</h2>
            <Progress value={progressPercentage} className="h-2" />
            
            <div className="flex justify-between text-sm">
              <div className={`${step === 'questionnaire' ? 'text-primary font-medium' : ''}`}>
                1. Inquiry & Questionnaire
              </div>
              <div className={`${step === 'matrix' ? 'text-primary font-medium' : ''}`}>
                2. Interview & Matrix Population
              </div>
              <div className={`${step === 'gap-analysis' ? 'text-primary font-medium' : ''}`}>
                3. Gap Analysis
              </div>
              {isComprehensive ? (
                <div className={`${step === 'report' ? 'text-primary font-medium' : ''}`}>
                  4. Preliminary Report → 5. Comprehensive Report
                </div>
              ) : (
                <div className={`${step === 'report' ? 'text-primary font-medium' : ''}`}>
                  4. Preliminary Report
                </div>
              )}
            </div>
            
            {/* Add extra info about report progression if comprehensive is selected */}
            {isComprehensive && (
              <div className="mt-2 bg-blue-50 p-3 rounded-md border border-blue-100 text-sm text-blue-700">
                <p><span className="font-medium">Note:</span> Comprehensive reports require completion of the preliminary report followed by 6 months of evidence collection using SOC monitoring, incident response tracking, and security tools.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Step 1: Inquiry & Questionnaire */}
      {step === 'questionnaire' && (
        <div className="questionnaire-container">
          {/* Show saved data notification when there's saved data */}
          {hasSavedData && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md flex justify-between items-center">
              <div>
                <h3 className="text-blue-800 font-medium">Your assessment data has been restored</h3>
                <p className="text-blue-600 text-sm">Your previous form data was automatically loaded. You can continue where you left off.</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (confirm("Are you sure you want to clear all saved data and start fresh?")) {
                    clearSavedData();
                    handleStartOver();
                  }
                }}
              >
                Clear & Start Fresh
              </Button>
            </div>
          )}
          <QuestionnaireForm onSubmit={handleQuestionnaireSubmit} />
        </div>
      )}
      
      {/* Step 2: Matrix Population */}
      {step === 'matrix' && formData && (
        <div className="matrix-container">
          {/* Show saved matrix data notification */}
          {matrixData && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md flex justify-between items-center">
              <div>
                <h3 className="text-blue-800 font-medium">Your matrix data has been restored</h3>
                <p className="text-blue-600 text-sm">You can continue working on your previous matrix population data.</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (confirm("Are you sure you want to clear the matrix data and start this step fresh?")) {
                    localStorage.removeItem('sos2a_matrix_data');
                    setMatrixData(null);
                    
                    toast({
                      title: "Matrix data cleared",
                      description: "Your matrix data has been cleared. You can start this step fresh.",
                    });
                  }
                }}
              >
                Clear Matrix Data
              </Button>
            </div>
          )}
          <MatrixForm 
            operationModes={formData.operationMode}
            internetPresence={formData.internetPresence}
            ismsProcesses={formData.ismsProcesses}
            onSubmit={handleMatrixSubmit}
            onBack={handleBack}
          />
        </div>
      )}
      
      {/* Step 3: Gap Analysis */}
      {step === 'gap-analysis' && formData && (
        <div className="gap-analysis-container">
          <GapAnalysis 
            formData={formData} 
            onComplete={handleGapAnalysisComplete} 
          />
          <div className="flex justify-between mt-6">
            <Button onClick={handleBack} variant="outline">
              Back to Matrix
            </Button>
          </div>
        </div>
      )}
      
      {/* Step 4: Report Display */}
      {step === 'report' && report && (
        <div className="report-container">
          <ReportDisplay report={report} onBack={handleBack} />
        </div>
      )}
    </div>
  );
}