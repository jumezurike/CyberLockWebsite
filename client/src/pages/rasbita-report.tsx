import React, { useState, useEffect } from 'react';
import { PdfExport } from '@/components/rasbita/pdf-export';
import { Download, Mail, Share2, FileText, Save, Inbox, Calendar, CheckSquare, AlertCircle, AlertOctagon, Shield } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RasbitaDashboard from "@/components/rasbita/rasbita-dashboard";
import IncidentForm from "@/components/rasbita/incident-form";
import GovernanceAndManagementAssessment, { GovernanceScores } from "@/components/rasbita/governance-and-management-assessment";
import { RasbitaReport, RasbitaRiskItem } from '@/lib/sos2a-types';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data for demonstration - in a real app this would come from the API
const sampleReport: RasbitaReport = {
  id: "rasbita-1",
  userId: 1,
  businessId: "business-1",
  title: "Quarterly Security Risk Assessment",
  incidentCategory: "Data Breach",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  overallRiskScore: 68.5,
  company: {
    name: "Acme Corporation",
    department: "Cybersecurity",
    reportGenerator: {
      name: "John Smith",
      title: "Security Analyst"
    }
  },
  incident: {
    title: "Customer Database Breach",
    description: "Unauthorized access to customer records detected through SQL injection vulnerability",
    date: new Date().toISOString().split('T')[0],
    category: "Data Breach",
    affectedSystems: "Customer Database, Web Application"
  },
  riskItems: [
    {
      assetName: "Web Application Server",
      assetValue: 85000,
      threatName: "SQL Injection",
      exposureFactor: 0.7,
      annualizedRateOfOccurrence: 0.25,
      singleLossExpectancy: 59500,
      annualizedLossExpectancy: 14875,
      annualCostOfSafeguard: 5000,
      annualizedLossExpectancyAfterControls: 2975,
      netRiskReductionBenefit: 6900,
      priority: "Critical",
      probability: 0.7,
      impact: 9,
      feasibilityFactors: {
        organizational: true,
        behavioral: true,
        technical: true,
        political: true
      }
    },
    {
      assetName: "Customer Database",
      assetValue: 150000,
      threatName: "Data Breach",
      exposureFactor: 0.8,
      annualizedRateOfOccurrence: 0.15,
      singleLossExpectancy: 120000,
      annualizedLossExpectancy: 18000,
      annualCostOfSafeguard: 12000,
      annualizedLossExpectancyAfterControls: 3600,
      netRiskReductionBenefit: 2400,
      priority: "High",
      probability: 0.6,
      impact: 10,
      feasibilityFactors: {
        organizational: true,
        behavioral: true,
        technical: true,
        political: false
      }
    },
    {
      assetName: "Employee Workstations",
      assetValue: 45000,
      threatName: "Malware",
      exposureFactor: 0.5,
      annualizedRateOfOccurrence: 0.4,
      singleLossExpectancy: 22500,
      annualizedLossExpectancy: 9000,
      annualCostOfSafeguard: 3500,
      annualizedLossExpectancyAfterControls: 2250,
      netRiskReductionBenefit: 3250,
      priority: "Medium",
      probability: 0.4,
      impact: 6,
      feasibilityFactors: {
        organizational: true,
        behavioral: false,
        technical: true,
        political: true
      }
    },
    {
      assetName: "Cloud Storage",
      assetValue: 35000,
      threatName: "Unauthorized Access",
      exposureFactor: 0.4,
      annualizedRateOfOccurrence: 0.3,
      singleLossExpectancy: 14000,
      annualizedLossExpectancy: 4200,
      annualCostOfSafeguard: 2000,
      annualizedLossExpectancyAfterControls: 840,
      netRiskReductionBenefit: 1360,
      priority: "Low",
      probability: 0.3,
      impact: 5,
      feasibilityFactors: {
        organizational: true,
        behavioral: true,
        technical: true,
        political: true
      }
    }
  ],
  governanceMaturity: {
    governanceScore: 0, // Tier 0: None
    managementScore: 0  // Tier 0: None
  },
  rasbitaCategories: {
    govern: 0,
    identify: 0,
    protect: 0,
    detect: 0,
    respond: 0,
    recover: 0
  },
  financialSummary: {
    totalAssetValue: 315000,
    totalAnnualizedLossExpectancy: 46075,
    totalCostOfSafeguards: 22500,
    totalNetRiskReductionBenefit: 13910
  },
  dashboard: {
    mostFrequentUser: "Security Admin",
    mostCurrentReportDate: new Date().toISOString(),
    userCount: 12,
    mostFrequentThreat: "Data Breach",
    leastFrequentThreat: "Physical Damage",
    minThreatCost: 4200,
    maxThreatCost: 18000,
    minALE: 4200,
    maxALE: 18000,
    minACS: 2000,
    maxACS: 12000,
    mostFrequentPriority: "High"
  },
  deviceType: "Database Server",
  totalDevices: 15,
  affectedDevices: 3,
  percentageAffected: "20%",
  totalDataCount: 25000,
  dataLost: 5000,
  damagedDevicesCost: 12000,
  threatSpreadCost: 8500,
  residualCost: 4000
};

export default function RasbitaReportPage() {
  const { toast } = useToast();
  const [report, setReport] = useState<RasbitaReport>(sampleReport);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<string>("");
  const [savedReports, setSavedReports] = useState<RasbitaReport[]>([]);
  const [initialFormData, setInitialFormData] = useState<any>(null);
  const [showResults, setShowResults] = useState(false); // Changed to false by default to enforce assessment flow
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showGovernanceAndManagementAssessment, setShowGovernanceAndManagementAssessment] = useState(true); // Changed to true by default to make it required
  const [assessments, setAssessments] = useState<any[]>([]);
  const [assessmentStep, setAssessmentStep] = useState<"governance" | "incident" | "results">("governance"); // Track assessment flow
  
  // Convert a report to form data format for editing
  const reportToFormData = (report: RasbitaReport) => {
    // Get the first risk item as our source
    const riskItem = report.riskItems[0];
    
    return {
      // Company information for reporting
      companyName: report.company.name || "",
      department: report.company.department || "",
      reportGeneratorName: report.company.reportGenerator?.name || "",
      reportGeneratorTitle: report.company.reportGenerator?.title || "",
      companyLogo: report.company.logo || "",
      
      // Basic incident information
      incidentTitle: report.incident.title,
      incidentDescription: report.incident.description,
      incidentDate: report.incident.date,
      incidentCategory: report.incident.category,
      affectedSystems: report.incident.affectedSystems,
      
      // RASBITA specific fields
      deviceType: riskItem.deviceInfo?.deviceType || "workstation",
      damagedDevices: String(riskItem.deviceInfo?.damagedDevices || 1),
      totalDevicesInDepartment: String(riskItem.deviceInfo?.deviceCount || 10),
      dataClass: "non_phi_pii", // Default, should be stored somewhere in the report
      dataSpread: "moderately_spread", // Default, should be stored somewhere in the report
      dataLossPercentage: "21_40", // Default, should be derived from exposureFactor
      deviceUsageFrequency: "daily", // Default
      deviceEnvironment: "production", // Default
      threatValue: String(riskItem.impact || 8),
      threatCost: String(Math.round(riskItem.assetValue / 10) || 5),
      machineCost: String(Math.round(riskItem.assetValue / riskItem.deviceInfo?.damagedDevices!) || 500),
      useCustomAssetValue: riskItem.useCustomAssetValue || false,
      customAssetValue: riskItem.customAssetValue || "",
      totalDataCount: report.totalDataCount ? String(report.totalDataCount) : "1000",
      annualizedRateOfOccurrence: String(riskItem.annualizedRateOfOccurrence || 0.5),
      
      // Additional information
      assetName: riskItem.assetName,
      existingSafeguards: "",
      
      // Feasibility factors
      organizationalFeasible: riskItem.feasibilityFactors?.organizational !== undefined ? 
        riskItem.feasibilityFactors.organizational : true,
      behavioralFeasible: riskItem.feasibilityFactors?.behavioral !== undefined ? 
        riskItem.feasibilityFactors.behavioral : true,
      technicalFeasible: riskItem.feasibilityFactors?.technical !== undefined ? 
        riskItem.feasibilityFactors.technical : true,
      politicalFeasible: riskItem.feasibilityFactors?.political !== undefined ? 
        riskItem.feasibilityFactors.political : true,
    };
  };
  
  // Load saved reports and assessments when the component mounts
  useEffect(() => {
    fetchSavedReports();
    fetchAssessments();
  }, []);
  
  // Handle governance assessment completion
  const handleGovernanceComplete = (scores: GovernanceScores) => {
    // Update the report with the governance scores
    setReport(prevReport => ({
      ...prevReport,
      governanceMaturity: {
        ...scores,
        completed: true
      }
    }));
    
    // Move to the next step in the assessment flow
    setShowGovernanceAndManagementAssessment(false);
    setAssessmentStep("incident");
    
    toast({
      title: "Governance Assessment Complete",
      description: "Your organization's governance and management maturity has been assessed. Continue with the incident assessment.",
    });
  };
  
  // Fetch assessments list from the API
  const fetchAssessments = async () => {
    try {
      const response = await apiRequest("GET", "/api/assessments");
      if (response.ok) {
        const data = await response.json();
        
        // Map assessment data to the format needed for the dropdown
        const formattedAssessments = data.map((assessment: any) => ({
          id: assessment.id.toString(),
          name: `${assessment.businessName} (${new Date(assessment.createdAt).toLocaleDateString()})`
        }));
        
        setAssessments(formattedAssessments);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
      // No toast here to avoid too many notifications at startup
    }
  };

  // Function to handle PDF export (simplified to use our PdfExport component)
  const exportToPdf = () => {
    try {
      setExportLoading(true);
      
      // The PdfExport component will handle the actual PDF generation
      // This function is now just a wrapper to manage loading state and show success/error messages
      
      // Set a timeout to simulate PDF generation time and show success message
      setTimeout(() => {
        toast({
          title: "PDF Export Successful",
          description: "Your RASBITA report has been downloaded as a PDF.",
        });
        setExportLoading(false);
      }, 500);
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
      setExportLoading(false);
    }
  };
  
  // Load saved reports from the API
  const fetchSavedReports = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("GET", "/api/rasbita-reports");
      const data = await response.json();
      setSavedReports(data);
      toast({
        title: "Reports Loaded",
        description: "Your saved RASBITA reports have been loaded successfully.",
      });
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast({
        title: "Error",
        description: "Failed to load saved reports. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific report from the API or create a new one from an assessment
  const fetchRasbitaReport = async (idInput: string) => {
    setLoading(true);
    
    console.log("fetchRasbitaReport called with:", idInput);
    
    try {
      // First check if this is a RASBITA report ID (if it exists in the database)
      const checkReportResponse = await apiRequest("GET", `/api/rasbita-reports/${idInput}`);
      
      // If found, use the existing report
      if (checkReportResponse.ok) {
        console.log("Found existing RASBITA report, loading...");
        const data = await checkReportResponse.json();
        console.log("Loaded report data:", data);
        
        setReport(data);
        
        // Convert the report to form data format for editing
        const formData = reportToFormData(data);
        setInitialFormData(formData);
        
        // Check if governance assessment has been completed
        if (data.governanceMaturity?.completed) {
          // If governance is already done, proceed to results
          setAssessmentStep("results");
          setShowResults(true);
          setShowGovernanceAndManagementAssessment(false);
        } else {
          // If governance is not done, start with governance assessment
          setAssessmentStep("governance");
          setShowGovernanceAndManagementAssessment(true);
          setShowResults(false);
        }
        
        toast({
          title: "Report Loaded",
          description: "RASBITA risk assessment report has been loaded successfully.",
        });
      } 
      // If not found, check if this is an assessment ID
      else if (idInput !== "new") {
        console.log("Report not found, checking if this is an assessment ID...");
        
        // Fetch the assessment
        const assessmentResponse = await apiRequest("GET", `/api/assessments/${idInput}`);
        
        if (assessmentResponse.ok) {
          console.log("Found assessment, creating new RASBITA report...");
          const assessmentData = await assessmentResponse.json();
          console.log("Assessment data:", assessmentData);
          
          // Create a new RASBITA report based on the assessment
          const newReport: Partial<RasbitaReport> = {
            id: "new", // Will be generated by server
            title: `${assessmentData.businessName} Risk Assessment`,
            incidentCategory: "general_assessment",
            overallRiskScore: assessmentData.securityScore || 50,
            businessId: `business-${Date.now()}`,
            company: {
              name: assessmentData.businessName,
              department: "Security"
            },
            incident: {
              date: new Date().toISOString().slice(0, 10),
              title: "Security Assessment",
              category: "general_assessment",
              description: `Security assessment for ${assessmentData.businessName}`,
              affectedSystems: "All Systems"
            },
            riskItems: generateRiskItemsFromAssessment(assessmentData),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          // Calculate financial summaries
          const riskItems = newReport.riskItems || [];
          newReport.financialSummary = {
            totalAssetValue: riskItems.reduce((sum, item) => sum + item.assetValue, 0),
            totalAnnualizedLossExpectancy: riskItems.reduce((sum, item) => sum + (item.annualizedLossExpectancy || 0), 0),
            totalCostOfSafeguards: riskItems.reduce((sum, item) => sum + (item.annualCostOfSafeguard || 0), 0),
            totalNetRiskReductionBenefit: riskItems.reduce((sum, item) => sum + (item.netRiskReductionBenefit || 0), 0)
          };
          
          // Add NIST CSF 2.0 framework domain scores - initialize all to 0
          newReport.rasbitaCategories = {
            govern: 0,
            identify: 0,
            protect: 0,
            detect: 0,
            respond: 0,
            recover: 0
          };
          
          // Add dashboard data with all required properties
          newReport.dashboard = {
            mostFrequentUser: "Security Analyst",
            mostCurrentReportDate: new Date().toISOString(),
            userCount: 1,
            mostFrequentThreat: "Ransomware",
            leastFrequentThreat: "Physical Access",
            mostFrequentPriority: "Medium",
            minThreatCost: riskItems.length > 0 ? Math.min(...riskItems.map(item => item.assetValue * 0.1)) : 0,
            maxThreatCost: riskItems.length > 0 ? Math.max(...riskItems.map(item => item.assetValue)) : 0,
            minALE: riskItems.length > 0 ? Math.min(...riskItems.map(item => item.annualizedLossExpectancy * 0.5)) : 0,
            maxALE: riskItems.length > 0 ? Math.max(...riskItems.map(item => item.annualizedLossExpectancy * 1.5)) : 0,
            minACS: riskItems.length > 0 ? Math.min(...riskItems.map(item => item.annualCostOfSafeguard * 0.5)) : 0,
            maxACS: riskItems.length > 0 ? Math.max(...riskItems.map(item => item.annualCostOfSafeguard * 1.5)) : 0
          };
          
          // Save the new report to the database
          console.log("Saving new report:", newReport);
          const saveResponse = await apiRequest("POST", "/api/rasbita-reports", newReport);
          
          if (!saveResponse.ok) {
            throw new Error("Failed to save new RASBITA report");
          }
          
          const savedReport = await saveResponse.json();
          console.log("Saved new report:", savedReport);
          
          setReport(savedReport);
          setInitialFormData(null); // No initial form data for new report
          
          // Ensure the results are shown
          setShowResults(true);
          
          toast({
            title: "New RASBITA Report Created",
            description: `Created RASBITA report for ${assessmentData.businessName}.`,
          });
        } else {
          throw new Error("Could not find assessment or report with the given ID");
        }
      } 
      // Handle "new" report case
      else {
        console.log("Creating brand new empty report");
        setReport({
          ...sampleReport,
          id: "new",
          createdAt: new Date().toISOString(),
          // Initialize governance maturity to Tier 0 for both scores
          governanceMaturity: {
            governanceScore: 0,
            managementScore: 0,
            completed: false
          }
        });
        // Clear any initial form data
        setInitialFormData(null);
        
        // Start with the governance assessment
        setAssessmentStep("governance");
        setShowGovernanceAndManagementAssessment(true);
        setShowResults(false);
        
        toast({
          title: "New Report Created",
          description: "Begin by completing the Governance & Management assessment.",
        });
      }
    } catch (error) {
      console.error("Error in fetchRasbitaReport:", error);
      toast({
        title: "Error",
        description: "Failed to load or create RASBITA report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to generate risk items from an assessment
  const generateRiskItemsFromAssessment = (assessment: any): RasbitaRiskItem[] => {
    const riskItems: RasbitaRiskItem[] = [];
    
    // Parse the matrix data if it's a string
    let matrixData;
    try {
      matrixData = typeof assessment.matrixData === 'string' 
        ? JSON.parse(assessment.matrixData) 
        : assessment.matrixData;
    } catch (e) {
      console.error("Error parsing matrix data:", e);
      matrixData = { items: [] };
    }
    
    // Extract items from matrix data
    const items = matrixData.items || [];
    
    // Create risk items for each matrix item
    items.forEach((item: any, index: number) => {
      const riskLevel = item.riskLevel || "Medium";
      const assetValue = getRiskLevelAssetValue(riskLevel);
      
      const riskItem: RasbitaRiskItem = {
        id: `item-${Date.now()}-${index}`,
        priority: riskLevel,
        assetName: item.assetName || "Unknown Asset",
        assetValue: assetValue,
        threatName: item.threatVector || "Unknown Threat",
        exposureFactor: getRiskLevelExposureFactor(riskLevel),
        singleLossExpectancy: Math.round(assetValue * getRiskLevelExposureFactor(riskLevel)),
        annualizedRateOfOccurrence: getRiskLevelARO(riskLevel),
        annualizedLossExpectancy: Math.round(
          assetValue * 
          getRiskLevelExposureFactor(riskLevel) * 
          getRiskLevelARO(riskLevel)
        ),
        safeguardEffectiveness: 6,
        annualCostOfSafeguard: Math.round(assetValue * 0.2),
        netRiskReductionBenefit: Math.round(
          (assetValue * getRiskLevelExposureFactor(riskLevel) * getRiskLevelARO(riskLevel)) - 
          (assetValue * 0.2)
        ),
        likelihood: getRiskLevelLikelihood(riskLevel),
        impact: getRiskLevelImpact(riskLevel),
        confidentiality: 7,
        integrity: 8,
        availability: 6,
        threatLevel: getRiskLevelThreatLevel(riskLevel),
        feasibilityFactors: {
          organizational: true,
          behavioral: true,
          technical: true,
          political: true,
          operational: true,
          economic: true
        }
      };
      
      riskItems.push(riskItem);
    });
    
    // If no items were found, create a default risk item
    if (riskItems.length === 0) {
      const defaultRiskItem: RasbitaRiskItem = {
        id: `item-${Date.now()}-default`,
        priority: "Medium",
        assetName: "Primary Business Systems",
        assetValue: 50000,
        threatName: "General Security Risk",
        exposureFactor: 0.3,
        singleLossExpectancy: 15000,
        annualizedRateOfOccurrence: 0.5,
        annualizedLossExpectancy: 7500,
        safeguardEffectiveness: 6,
        annualCostOfSafeguard: 3500,
        netRiskReductionBenefit: 4000,
        likelihood: 5,
        impact: 6,
        confidentiality: 7,
        integrity: 7,
        availability: 6,
        threatLevel: 5,
        feasibilityFactors: {
          organizational: true,
          behavioral: true,
          technical: true,
          political: true,
          operational: true,
          economic: true
        }
      };
      
      riskItems.push(defaultRiskItem);
    }
    
    return riskItems;
  };
  
  // Helper functions to convert risk levels to numerical values
  const getRiskLevelAssetValue = (riskLevel: string): number => {
    switch (riskLevel.toLowerCase()) {
      case 'critical': return 100000;
      case 'high': return 50000;
      case 'medium': return 25000;
      case 'low': return 10000;
      default: return 25000;
    }
  };
  
  const getRiskLevelExposureFactor = (riskLevel: string): number => {
    switch (riskLevel.toLowerCase()) {
      case 'critical': return 0.8;
      case 'high': return 0.6;
      case 'medium': return 0.4;
      case 'low': return 0.2;
      default: return 0.4;
    }
  };
  
  const getRiskLevelARO = (riskLevel: string): number => {
    switch (riskLevel.toLowerCase()) {
      case 'critical': return 1.0;
      case 'high': return 0.7;
      case 'medium': return 0.5;
      case 'low': return 0.3;
      default: return 0.5;
    }
  };
  
  const getRiskLevelLikelihood = (riskLevel: string): number => {
    switch (riskLevel.toLowerCase()) {
      case 'critical': return 9;
      case 'high': return 7;
      case 'medium': return 5;
      case 'low': return 3;
      default: return 5;
    }
  };
  
  const getRiskLevelImpact = (riskLevel: string): number => {
    switch (riskLevel.toLowerCase()) {
      case 'critical': return 9;
      case 'high': return 7;
      case 'medium': return 5;
      case 'low': return 3;
      default: return 5;
    }
  };
  
  const getRiskLevelThreatLevel = (riskLevel: string): number => {
    switch (riskLevel.toLowerCase()) {
      case 'critical': return 9;
      case 'high': return 7;
      case 'medium': return 5;
      case 'low': return 3;
      default: return 5;
    }
  };
  
  // Handle incident form submission
  const handleIncidentFormSubmit = (formData: any) => {
    // Process form data and update report
    console.log("Form submitted with data:", formData);
    
    // Update the report with the form data
    setReport(prevReport => {
      // Extract company information
      const company = {
        ...prevReport.company,
        name: formData.companyName || prevReport.company.name,
        department: formData.department || prevReport.company.department,
        reportGenerator: {
          name: formData.reportGeneratorName || (prevReport.company.reportGenerator?.name || ""),
          title: formData.reportGeneratorTitle || (prevReport.company.reportGenerator?.title || "")
        },
        logo: formData.companyLogo || prevReport.company.logo
      };
      
      // Extract incident information
      const incident = {
        title: formData.incidentTitle || "Security Assessment",
        description: formData.incidentDescription || "General security assessment",
        date: formData.incidentDate || new Date().toISOString().slice(0, 10),
        category: formData.incidentCategory || "general_assessment",
        affectedSystems: formData.affectedSystems || "All Systems"
      };
      
      // Process the risk item
      const threatValue = parseInt(formData.threatValue || "5", 10);
      const machineCost = parseInt(formData.machineCost || "1000", 10);
      const damagedDevices = parseInt(formData.damagedDevices || "1", 10);
      const assetValue = formData.useCustomAssetValue && formData.customAssetValue 
        ? parseInt(formData.customAssetValue.replace(/[^\d]/g, ''), 10) 
        : (machineCost * damagedDevices);
      
      // Calculate exposure factor based on data loss percentage
      let exposureFactor = 0.3; // Default
      switch (formData.dataLossPercentage) {
        case "0_20": exposureFactor = 0.1; break;
        case "21_40": exposureFactor = 0.3; break;
        case "41_60": exposureFactor = 0.5; break;
        case "61_80": exposureFactor = 0.7; break;
        case "81_100": exposureFactor = 0.9; break;
      }
      
      // Calculate other risk metrics
      const singleLossExpectancy = assetValue * exposureFactor;
      const annualizedRateOfOccurrence = parseFloat(formData.annualizedRateOfOccurrence || "0.5");
      const annualizedLossExpectancy = singleLossExpectancy * annualizedRateOfOccurrence;
      const annualCostOfSafeguard = assetValue * 0.2; // Assuming 20% of asset value
      const netRiskReductionBenefit = annualizedLossExpectancy - annualCostOfSafeguard;
      
      // Create the risk item
      const riskItem: RasbitaRiskItem = {
        id: `item-${Date.now()}`,
        assetName: formData.assetName || "Primary Business Systems",
        assetValue,
        threatName: formData.threatName || "Security Incident",
        exposureFactor,
        annualizedRateOfOccurrence,
        singleLossExpectancy,
        annualizedLossExpectancy,
        annualCostOfSafeguard,
        netRiskReductionBenefit,
        priority: threatValue >= 8 ? "Critical" : threatValue >= 6 ? "High" : threatValue >= 4 ? "Medium" : "Low",
        impact: threatValue,
        likelihood: annualizedRateOfOccurrence * 10,
        confidentiality: 7,
        integrity: 7,
        availability: 7,
        feasibilityFactors: {
          organizational: formData.organizationalFeasible || false,
          behavioral: formData.behavioralFeasible || false,
          technical: formData.technicalFeasible || false,
          political: formData.politicalFeasible || false
        },
        deviceInfo: {
          deviceType: formData.deviceType || "workstation",
          deviceCount: parseInt(formData.totalDevicesInDepartment || "10", 10),
          damagedDevices: damagedDevices
        },
        useCustomAssetValue: formData.useCustomAssetValue || false,
        customAssetValue: formData.customAssetValue || ""
      };
      
      // Update financial summary
      const financialSummary = {
        totalAssetValue: assetValue,
        totalAnnualizedLossExpectancy: annualizedLossExpectancy,
        totalCostOfSafeguards: annualCostOfSafeguard,
        totalNetRiskReductionBenefit: netRiskReductionBenefit
      };
      
      // Update the report
      return {
        ...prevReport,
        title: formData.incidentTitle || prevReport.title || "RASBITA Risk Assessment",
        company,
        incident,
        riskItems: [riskItem],
        financialSummary,
        deviceType: formData.deviceType || "workstation",
        totalDevices: parseInt(formData.totalDevicesInDepartment || "10", 10),
        affectedDevices: damagedDevices,
        percentageAffected: `${Math.round((damagedDevices / parseInt(formData.totalDevicesInDepartment || "10", 10)) * 100)}%`,
        totalDataCount: parseInt(formData.totalDataCount || "1000", 10),
        dataLost: Math.round(parseInt(formData.totalDataCount || "1000", 10) * exposureFactor),
        damagedDevicesCost: machineCost * damagedDevices,
        threatSpreadCost: Math.round(singleLossExpectancy * 0.3),
        residualCost: Math.round(singleLossExpectancy * 0.1),
        updatedAt: new Date().toISOString()
      };
    });
    
    // Automatically save to database
    setTimeout(() => saveReport(), 500);
    
    toast({
      title: "Risk Assessment Updated",
      description: "Your RASBITA risk assessment details have been updated.",
    });
  };
  
  // Save the current report to the API
  const saveReport = async () => {
    setSaveLoading(true);
    try {
      // Prepare the report object for saving
      const reportToSave = {
        ...report,
        // If it's a new report, remove the id field so the server will generate one
        ...(report.id === "new" ? { id: undefined } : {}),
        // Update the timestamps
        updatedAt: new Date().toISOString()
      };
      
      let response;
      
      if (report.id === "new" || typeof report.id === 'string') {
        // Create a new report
        response = await apiRequest("POST", "/api/rasbita-reports", reportToSave);
      } else {
        // Update an existing report
        response = await apiRequest("PUT", `/api/rasbita-reports/${report.id}`, reportToSave);
      }
      
      if (!response.ok) {
        throw new Error(`Failed to save report: ${response.statusText}`);
      }
      
      const savedReport = await response.json();
      setReport(savedReport);
      
      // Refresh the list of saved reports
      fetchSavedReports();
      
      toast({
        title: "Report Saved",
        description: "Your RASBITA report has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving report:", error);
      toast({
        title: "Error",
        description: "Failed to save RASBITA report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-purple-700">RASBITA™ Risk Assessment</h1>
        <div className="flex gap-4">
          <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select Report or Assessment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Create New Report</SelectItem>
              {savedReports.map((report) => (
                <SelectItem key={`report-${report.id}`} value={`${report.id}`}>
                  {report.title || `Report ${report.id}`}
                </SelectItem>
              ))}
              {assessments.map((assessment) => (
                <SelectItem key={`assessment-${assessment.id}`} value={assessment.id}>
                  {assessment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => fetchRasbitaReport(selectedAssessment)}
            disabled={!selectedAssessment || loading}
            className="bg-purple-700 text-white hover:bg-purple-800"
          >
            {loading ? "Loading..." : "Load"}
          </Button>
        </div>
      </div>
      
      {/* Sequential Assessment Flow */}
      {assessmentStep === "governance" && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-chart-4">STEP 1: Cybersecurity Risk Governance & Management Assessment</CardTitle>
              <CardDescription>
                Begin by assessing your organization's maturity in governing and managing cybersecurity risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <div className="flex items-start gap-2">
                  <div className="mt-1 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4" />
                      <path d="M12 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-800">Required Assessment</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      The Governance & Management assessment is a necessary first step in the RASBITA process. 
                      Your assessment results will be included in both SOS²A preliminary and comprehensive reports.
                    </p>
                  </div>
                </div>
              </div>
              
              <GovernanceAndManagementAssessment onComplete={handleGovernanceComplete} />
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Incident Form Step */}
      {assessmentStep === "incident" && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-chart-4">STEP 2: Risk Assessment Details</CardTitle>
              <CardDescription>
                Now that governance is assessed, provide details about the security incident or risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-4 rounded-md mb-6">
                <div className="flex items-start gap-2">
                  <CheckSquare className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-800">Governance Assessment Complete</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Your organization's governance maturity is now at Tier {report.governanceMaturity?.governanceScore || 0} and 
                      management maturity at Tier {report.governanceMaturity?.managementScore || 0}.
                    </p>
                  </div>
                </div>
              </div>
              
              <IncidentForm 
                onComplete={(formData: any) => {
                  handleIncidentFormSubmit(formData);
                  // Move to results after submitting incident form
                  setAssessmentStep("results");
                  setShowResults(true);
                }}
                initialData={initialFormData}
              />
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Results Dashboard */}
      {assessmentStep === "results" && (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="bg-purple-50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-chart-4">
                    {report.title || "RASBITA Risk Assessment Report"}
                  </CardTitle>
                  <CardDescription>
                    {report.company?.name ? `For ${report.company.name}` : "CISSP Risk Assessment Score by Threat and Impact Analysis"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAssessmentStep("governance");
                      setShowGovernanceAndManagementAssessment(true);
                      setShowResults(false);
                    }}
                    className="flex items-center gap-2 text-chart-4 border-chart-4"
                  >
                    <CheckSquare className="h-4 w-4" />
                    <span>Update Governance Assessment</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveReport}
                    disabled={saveLoading}
                    className="flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saveLoading ? "Saving..." : "Save"}</span>
                  </Button>
                  {exportLoading ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="flex items-center gap-1"
                    >
                      <span className="animate-spin mr-1">⏳</span>
                      <span>Exporting...</span>
                    </Button>
                  ) : (
                    <PdfExport report={report} />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="dashboard" className="flex-1">Dashboard</TabsTrigger>
                  <TabsTrigger value="form" className="flex-1">Incident Form</TabsTrigger>
                </TabsList>
                <TabsContent value="dashboard" className="mt-0">
                  {showResults && (
                    <RasbitaDashboard report={report} />
                  )}
                </TabsContent>
                <TabsContent value="form" className="mt-0">
                  <IncidentForm 
                    onComplete={(formData: any) => {
                      // Process form data and update report
                      console.log("Form submitted with data:", formData);
                      
                      // TODO: Transform form data into report format
                      
                      // Show the results tab
                      setShowResults(true);
                      setActiveTab("dashboard");
                    }}
                    initialData={initialFormData}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {report.governanceMaturity && (
            <Card className="border-chart-4 bg-purple-50/30">
              <CardHeader>
                <CardTitle className="text-chart-4">Governance & Management Maturity</CardTitle>
                <CardDescription>
                  Based on NIST CSF 2.0 Framework
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-lg text-purple-700 mb-2">Cybersecurity Risk Governance</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-green-500 w-2 h-2 rounded-full"></div>
                      <span className="font-medium">Tier {report.governanceMaturity.governanceScore}: </span>
                      <span>{getTierLabel(report.governanceMaturity.governanceScore)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {getTierDescription(report.governanceMaturity.governanceScore, "governance")}
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-lg text-purple-700 mb-2">Cybersecurity Risk Management</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-blue-500 w-2 h-2 rounded-full"></div>
                      <span className="font-medium">Tier {report.governanceMaturity.managementScore}: </span>
                      <span>{getTierLabel(report.governanceMaturity.managementScore)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {getTierDescription(report.governanceMaturity.managementScore, "management")}
                    </p>
                  </div>
                </div>
                
                {/* Tier Legend */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-2">
                  <h3 className="font-semibold text-purple-700 mb-3">RASBITA GOV & MGNT SELF-SCORING Tier Legend</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div className="border border-gray-200 rounded p-2 bg-gray-50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="bg-red-500 w-3 h-3 rounded-full"></div>
                        <span className="font-semibold">Tier 0 (0-0): None</span>
                      </div>
                      <p className="text-xs text-gray-600">0% - Completely uninformed about cybersecurity risk</p>
                    </div>
                    <div className="border border-gray-200 rounded p-2 bg-gray-50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="bg-orange-500 w-3 h-3 rounded-full"></div>
                        <span className="font-semibold">Tier 1 (0-1): Partial</span>
                      </div>
                      <p className="text-xs text-gray-600">25% - Limited awareness and implementation</p>
                    </div>
                    <div className="border border-gray-200 rounded p-2 bg-gray-50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="bg-yellow-500 w-3 h-3 rounded-full"></div>
                        <span className="font-semibold">Tier 2 (1-2): Risk Informed</span>
                      </div>
                      <p className="text-xs text-gray-600">50% - Risk-informed, inconsistently implemented</p>
                    </div>
                    <div className="border border-gray-200 rounded p-2 bg-gray-50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="bg-blue-500 w-3 h-3 rounded-full"></div>
                        <span className="font-semibold">Tier 3 (2-3): Repeatable</span>
                      </div>
                      <p className="text-xs text-gray-600">75% - Formally approved, consistently implemented</p>
                    </div>
                    <div className="border border-gray-200 rounded p-2 bg-gray-50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                        <span className="font-semibold">Tier 4 (3-4): Adaptive</span>
                      </div>
                      <p className="text-xs text-gray-600">100% - Adaptive, continuously improved</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                    <div className="flex gap-2 items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                      </svg>
                      <div>
                        <strong>Key Relationship</strong>: Higher governance and management maturity (higher tier) typically results in a lower RASBITA™ risk score, indicating reduced security risk exposure due to better cybersecurity practices.
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setShowGovernanceAndManagementAssessment(true)}
                    className="w-full bg-chart-4 hover:bg-chart-4/90"
                  >
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Complete Governance & Management Assessment
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-3">
                    <PdfExport report={report} />
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => {
                        // Show a toast explaining the PDF export
                        toast({
                          title: "Governance & Management Report",
                          description: "The PDF report includes a detailed breakdown of your organization's cybersecurity governance and management maturity assessment with improvement recommendations.",
                          duration: 5000,
                        });
                      }}
                    >
                      <FileText className="h-4 w-4" />
                      Report Details
                    </Button>
                  </div>
                  
                  <div className="mt-3 bg-purple-50 p-3 rounded-md border border-purple-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-purple-800 font-medium">Crisis Support Mode</p>
                        <p className="text-xs text-purple-700 mt-1">
                          Need a standalone governance assessment during an active security incident? 
                          Access the dedicated crisis tool:
                        </p>
                        <div className="mt-2">
                          <a 
                            href="/rasbita-governance" 
                            className="inline-flex items-center gap-1.5 text-xs font-medium bg-purple-700 text-white px-2.5 py-1.5 rounded hover:bg-purple-800 transition-colors"
                          >
                            <AlertOctagon className="h-3.5 w-3.5" />
                            Launch RASBITA GOV & MGNT Crisis Tool
                          </a>
                        </div>
                        
                        <p className="text-xs text-blue-700 mt-4">
                          Need to assess your architecture security? Access our standalone threat modeling tool:
                        </p>
                        <div className="mt-2">
                          <a 
                            href="/threat-modeling" 
                            className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-700 text-white px-2.5 py-1.5 rounded hover:bg-blue-800 transition-colors"
                          >
                            <Shield className="h-3.5 w-3.5" />
                            Launch RASBITA Threat Modeling Tool
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function getTierLabel(score: number | null): string {
  if (score === null) return "Not assessed";
  
  switch (score) {
    case 0: return "None";
    case 1: return "Partial";
    case 2: return "Risk Informed";
    case 3: return "Repeatable";
    case 4: return "Adaptive";
    default: return "Unknown";
  }
}

function getTierDescription(score: number | null, type: "governance" | "management"): string {
  if (score === null) return "";
  
  if (type === "governance") {
    switch (score) {
      case 0:
        return "Not currently part of the cybersecurity risk governance practices in the organization.";
      case 1:
        return "Application of the organizational cybersecurity risk strategy is managed in an ad hoc manner. Prioritization is ad hoc and not formally based on objectives or threat environment.";
      case 2:
        return "Risk management practices are approved by management but may not be established as organization-wide policy. Prioritization is informed by organizational risk objectives, threat environment, or business requirements.";
      case 3:
        return "The organization's risk management practices are formally approved and expressed as policy. Cybersecurity practices are regularly updated based on the application of risk management processes.";
      case 4:
        return "There is an organization-wide approach to managing cybersecurity risks that uses risk-informed policies, processes, and procedures to address potential cybersecurity events.";
      default:
        return "";
    }
  } else {
    switch (score) {
      case 0:
        return "Not currently part of the cybersecurity risk management practices in the organization.";
      case 1:
        return "Limited awareness of cybersecurity risks at the organizational level. The organization implements cybersecurity risk management on an irregular, case-by-case basis.";
      case 2:
        return "Awareness of cybersecurity risks exists, but an organization-wide approach to managing cybersecurity risks has not been established. Cybersecurity information is shared within the organization on an informal basis.";
      case 3:
        return "Organization-wide approach to managing cybersecurity risks. Cybersecurity information is routinely shared throughout the organization. Consistent methods are in place to respond effectively to changes in risk.";
      case 4:
        return "The organization adapts its cybersecurity practices based on previous activities and predictive indicators. Real-time information is used to understand and act upon cybersecurity risks associated with the products and services.";
      default:
        return "";
    }
  }
}