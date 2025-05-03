import React, { useState, useEffect } from "react";
import { Sos2aFormData, MatrixItem, AssessmentReport } from "@/lib/sos2a-types";
import QuestionnaireForm from "@/components/sos2a/questionnaire-form-fixed";
import MatrixForm from "@/components/sos2a/matrix-form";
import ReportDisplay from "@/components/sos2a/report-display";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  const [step, setStep] = useState<'questionnaire' | 'matrix' | 'report'>('questionnaire'); // Start at questionnaire (first step)
  const [formData, setFormData] = useState<Sos2aFormData | null>(null);
  const [matrixData, setMatrixData] = useState<MatrixItem[] | null>(null);
  const [report, setReport] = useState<AssessmentReport | null>(null); // Don't use sample report by default
  const [savedAssessments, setSavedAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("");
  const { toast } = useToast();
  
  // Progress percentage based on current step and report type
  const isComprehensive = formData?.reportType === 'comprehensive';
  const progressPercentage = step === 'questionnaire' 
    ? 25 
    : step === 'matrix' 
      ? 50 
      : (step === 'report' && !isComprehensive)
        ? 75  // Preliminary report (75% complete)
        : 100; // Comprehensive report (100% complete)
  
  // Show review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Handle form submission
  const handleQuestionnaireSubmit = (data: Sos2aFormData) => {
    console.log("Parent component received form submission", data);
    // First show the review modal
    setFormData(data);
    setShowReviewModal(true);
    
    // Show informative toast with clear next steps
    toast({
      title: "Questionnaire received",
      description: "Please review your submission details before proceeding to the next step.",
    });
  };
  
  // Handle final submission after review
  const handleFinalSubmit = () => {
    setShowReviewModal(false);
    setStep('matrix');
    toast({
      title: "Assessment confirmed",
      description: "Moving to Interview & Matrix Population step. This is where our expert system will apply industry-specific knowledge to your assessment.",
    });
  };
  
  // Generate scorecard data with the 12 standard parameters
  const generateScorecardData = (data: MatrixItem[], reportType: 'preliminary' | 'comprehensive') => {
    // Each parameter has equal weight of 10%
    const standardWeight = 10;
    
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
      item.operationControls.implemented 
    ) ? 70 : 40);
    
    // Question 3 - Management Security
    const managementSecurityScore = generateScore(data.some(item => 
      item.managementControls.implemented
    ) ? 65 : 35);
    
    // Question 4 - Technology Security
    const technologySecurityScore = generateScore(data.some(item => 
      item.technologyControls.implemented
    ) ? 60 : 30);
    
    // Question 5 - People Security
    const peopleSecurityScore = generateScore(data.some(item => 
      item.peopleControls.implemented
    ) ? 55 : 25);
    
    // Question 6 - Standards & Frameworks
    const standardsScore = generateScore(data.some(item => 
      item.standards.nistCsf || 
      item.standards.iso27001 || 
      item.standards.cisCsc
    ) ? 75 : 45);
    
    // Question 7 - Compliance Requirements
    const complianceScore = generateScore(data.some(item => 
      item.complianceStandards.pciDss || 
      item.complianceStandards.hipaa || 
      item.complianceStandards.gdpr
    ) ? 65 : 40);
    
    // Question 8 - Regulatory Requirements
    const regulatoryScore = generateScore(data.some(item => 
      item.regulatoryRequirements.pciDss || 
      item.regulatoryRequirements.hipaa || 
      item.regulatoryRequirements.gdpr
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
    
    return [
      { parameter: "Operation Security", weight: standardWeight, score: operationSecurityScore },
      { parameter: "Management Security", weight: standardWeight, score: managementSecurityScore },
      { parameter: "Technology Security", weight: standardWeight, score: technologySecurityScore },
      { parameter: "People Security", weight: standardWeight, score: peopleSecurityScore },
      { parameter: "Standards & Frameworks", weight: standardWeight, score: standardsScore },
      { parameter: "Compliance Requirements", weight: standardWeight, score: complianceScore },
      { parameter: "Regulatory Requirements", weight: standardWeight, score: regulatoryScore },
      { parameter: "Information Security Management", weight: standardWeight, score: ismsScore },
      { parameter: "Risk Management Process", weight: standardWeight, score: riskManagementScore },
      { parameter: "Education & Awareness", weight: standardWeight, score: educationAwarenessScore },
    ];
  };

  // Handle matrix submission
  const handleMatrixSubmit = async (data: MatrixItem[]) => {
    setMatrixData(data);
    
    const reportType = formData?.reportType || 'preliminary';
    
    // Generate the report based on the form and matrix data
    const calculatedRasbitaScore = calculateRasbitaScore(data, formData);
    
    // Create the rasbitaCategories property in the format expected by the RasbitaReport type
    const rasbitaCategories = {
      govern: calculatedRasbitaScore.categories.govern,
      identify: calculatedRasbitaScore.categories.identify,
      protect: calculatedRasbitaScore.categories.protect, 
      detect: calculatedRasbitaScore.categories.detect,
      respond: calculatedRasbitaScore.categories.respond,
      recover: calculatedRasbitaScore.categories.recover
    };
    
    const generatedReport: AssessmentReport = {
      id: 'report-' + Date.now(),
      businessId: data[0].infraType + '-' + Date.now(),
      reportType: reportType,
      createdAt: new Date().toISOString(),
      securityScore: calculateSecurityScore(data),
      businessLocation: formData?.businessLocation || { state: "Unknown", country: "Unknown", zipCode: "" },
      industry: formData?.industry || "Unknown",
      businessServices: formData?.businessServices || "Unknown",
      operationModes: formData?.operationMode || [],
      internetPresence: formData?.internetPresence || [],
      findings: identifySecurityRisks(data),
      vulnerabilities: categorizeLVulnerabilities(data),
      recommendations: generateRecommendations(data),
      frameworkGaps: identifyFrameworkGaps(data),
      complianceStatus: evaluateComplianceStatus(data),
      policyDocumentStatus: evaluatePolicyDocumentStatus(data),
      osHardeningStatus: evaluateOsHardeningStatus(data),
      ismsStatus: evaluateIsmsStatus(data, formData),
      mitreAttackCoverage: evaluateMitreAttackCoverage(data),
      matrixData: data,
      scorecard: generateScorecardData(data, reportType),
      rasbitaScore: calculatedRasbitaScore,
      rasbitaCategories: rasbitaCategories
    };
    
    setReport(generatedReport);
    setStep('report');
    
    // Save the assessment to the database
    try {
      // We already calculated RASBITA score above, reuse it for consistency
      // The rasbitaCategories property is already in the format expected by the RasbitaReport type
      
      const response = await apiRequest("POST", "/api/assessments", {
        businessName: formData?.businessName || "Unknown",
        industry: formData?.industry || "Unknown",
        businessLocation: formData?.businessLocation || { state: "Unknown", country: "Unknown", zipCode: "" },
        reportType: reportType,
        securityScore: calculateSecurityScore(data),
        findings: JSON.stringify(identifySecurityRisks(data)),
        recommendations: JSON.stringify(generateRecommendations(data)),
        matrixData: JSON.stringify(data),
        rasbitaScore: JSON.stringify(calculatedRasbitaScore),
        rasbitaCategories: JSON.stringify(rasbitaCategories),
        createdAt: new Date().toISOString()
      });
      
      if (!response.ok) {
        throw new Error("Failed to save assessment");
      }
      
      // Refresh the list of saved assessments
      const assessmentsResponse = await apiRequest("GET", "/api/assessments");
      if (assessmentsResponse.ok) {
        const assessments = await assessmentsResponse.json();
        setSavedAssessments(assessments);
      }
    } catch (error) {
      console.error("Error saving assessment:", error);
    }
  };
  
  // Go back to previous step
  const handleBack = () => {
    if (step === 'matrix') setStep('questionnaire');
    if (step === 'report') setStep('matrix');
  };
  
  // Handle starting over
  const handleStartOver = () => {
    setStep('questionnaire');
    setFormData(null);
    setMatrixData(null);
    setReport(null);
    setSelectedAssessmentId("");
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
          {/* Saved Assessments Selector */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex-1">
              <Select 
                value={selectedAssessmentId} 
                onValueChange={(value) => setSelectedAssessmentId(value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Load a saved assessment" />
                </SelectTrigger>
                <SelectContent>
                  {savedAssessments.map((assessment) => (
                    <SelectItem key={assessment.id} value={assessment.id.toString()}>
                      {new Date(assessment.createdAt).toLocaleDateString()} - {assessment.industry || 'Unknown'} ({assessment.reportType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => loadAssessment(selectedAssessmentId)}
                disabled={!selectedAssessmentId || isLoading}
                variant="outline"
              >
                Load Report
              </Button>
              
              {selectedAssessmentId && (
                <Button 
                  onClick={() => deleteAssessment(selectedAssessmentId)}
                  disabled={isLoading}
                  variant="destructive"
                  className="px-3"
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
            </div>
            
            <Button 
              onClick={handleStartOver}
              disabled={isLoading}
              variant="secondary"
            >
              Start New Assessment
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Assessment Progress</h2>
            <Progress value={progressPercentage} className="h-2" />
            
            <div className="flex justify-between text-sm">
              <div className={`${step === 'questionnaire' ? 'text-primary font-medium' : ''}`}>
                1. Inquiry & Questionnaire
              </div>
              <div className={`${step === 'matrix' ? 'text-primary font-medium' : ''}`}>
                2. Interview & Matrix Population (Gap Analysis)
              </div>
              {isComprehensive ? (
                <div className={`${step === 'report' ? 'text-primary font-medium' : ''}`}>
                  3. Preliminary Report → 4. Comprehensive Report
                </div>
              ) : (
                <div className={`${step === 'report' ? 'text-primary font-medium' : ''}`}>
                  3. Preliminary Report
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
          <QuestionnaireForm onSubmit={handleQuestionnaireSubmit} />
        </div>
      )}
      
      {/* Step 2: Matrix Population */}
      {step === 'matrix' && formData && (
        <div className="matrix-container">
          <MatrixForm 
            operationModes={formData.operationMode}
            internetPresence={formData.internetPresence}
            onSubmit={handleMatrixSubmit}
            onBack={handleBack}
          />
        </div>
      )}
      
      {/* Step 3: Report Display */}
      {step === 'report' && report && (
        <div className="report-container">
          <ReportDisplay report={report} onBack={handleBack} />
        </div>
      )}
    </div>
  );
}