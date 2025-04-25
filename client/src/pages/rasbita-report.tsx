import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, Mail, Share2, FileText, Save, Inbox, Calendar, CheckSquare } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RasbitaDashboard from "@/components/rasbita/rasbita-dashboard";
import IncidentForm from "@/components/rasbita/incident-form";
import GovernanceAssessment, { GovernanceScores } from "@/components/rasbita/governance-assessment";
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
    governanceScore: 3, // Tier 3: Repeatable
    managementScore: 2  // Tier 2: Risk Informed
  },
  rasbitaCategories: {
    govern: 72,
    identify: 68,
    protect: 65,
    detect: 70,
    respond: 63,
    recover: 58
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
  const [showResults, setShowResults] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showGovernanceAssessment, setShowGovernanceAssessment] = useState(false);
  const [assessments, setAssessments] = useState<any[]>([]);
  
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
      governanceMaturity: scores
    }));
    
    // Hide the governance assessment form and show results
    setShowGovernanceAssessment(false);
    setShowResults(true);
    
    toast({
      title: "Governance Assessment Complete",
      description: "Your organization's governance and management maturity has been assessed.",
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

  // Function to generate and download PDF report
  const exportToPdf = () => {
    try {
      setExportLoading(true);
      const doc = new jsPDF();
      
      // Add header with logo and title
      doc.setFontSize(22);
      doc.setTextColor(105, 42, 187); // CyberLockX purple
      doc.text("RASBITA™ Risk Assessment Report", 20, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("CISSP Risk Assessment Score by Threat and Impact Analysis", 20, 30);
      
      // Add report generation details
      doc.setFontSize(10);
      doc.text(`Report ID: ${report.id}`, 20, 40);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);
      
      // Add executive summary
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Executive Summary", 20, 55);
      
      doc.setFontSize(10);
      doc.text("This RASBITA report provides a comprehensive analysis of security risks and their", 20, 65);
      doc.text("financial impact on your organization. Below is a summary of key findings.", 20, 70);
      
      // Add financial summary table
      doc.setFontSize(12);
      doc.text("Financial Impact Summary", 20, 85);
      
      // @ts-ignore - jspdf-autotable typings
      doc.autoTable({
        startY: 90,
        head: [['Metric', 'Value ($)']],
        body: [
          ['Total Asset Value', report.financialSummary.totalAssetValue.toLocaleString()],
          ['Total Annual Loss Expectancy (ALE)', report.financialSummary.totalAnnualizedLossExpectancy.toLocaleString()],
          ['Total Cost of Safeguards (ACS)', report.financialSummary.totalCostOfSafeguards.toLocaleString()],
          ['Net Risk Reduction Benefit (NRRB)', report.financialSummary.totalNetRiskReductionBenefit.toLocaleString()]
        ],
        theme: 'grid',
        headStyles: { fillColor: [105, 42, 187] }
      });
      
      // Add risk items table on a new page
      doc.addPage();
      doc.setFontSize(14);
      doc.text("Detailed Risk Analysis", 20, 20);
      
      // Prepare risk items for table
      const riskItemsTableData = report.riskItems.map(item => [
        item.assetName,
        item.threatName,
        item.priority,
        '$' + item.assetValue.toLocaleString(),
        '$' + item.annualizedLossExpectancy.toLocaleString(),
        '$' + item.annualCostOfSafeguard.toLocaleString(),
        '$' + item.netRiskReductionBenefit.toLocaleString()
      ]);
      
      // @ts-ignore - jspdf-autotable typings
      doc.autoTable({
        startY: 30,
        head: [['Asset', 'Threat', 'Priority', 'Asset Value', 'ALE', 'Safeguard Cost', 'NRRB']],
        body: riskItemsTableData,
        theme: 'grid',
        headStyles: { fillColor: [105, 42, 187] },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 25 },
          2: { cellWidth: 20 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 }
        },
        styles: { fontSize: 8, cellPadding: 2 }
      });
      
      // Add RASBITA score section
      const yPos = (doc as any).lastAutoTable.finalY + 10;
      
      doc.setFontSize(14);
      doc.text("RASBITA Risk Categories", 20, yPos);
      
      // @ts-ignore - jspdf-autotable typings
      doc.autoTable({
        startY: yPos + 10,
        head: [['NIST CSF 2.0 Domain', 'Score']],
        body: [
          ['Govern', report.rasbitaCategories.govern],
          ['Identify', report.rasbitaCategories.identify],
          ['Protect', report.rasbitaCategories.protect],
          ['Detect', report.rasbitaCategories.detect],
          ['Respond', report.rasbitaCategories.respond],
          ['Recover', report.rasbitaCategories.recover]
        ],
        theme: 'grid',
        headStyles: { fillColor: [105, 42, 187] }
      });
      
      // Add governance maturity section if available
      if (report.governanceMaturity) {
        const governanceYPos = (doc as any).lastAutoTable.finalY + 10;
        
        doc.setFontSize(14);
        doc.text("Governance & Management Maturity", 20, governanceYPos);
        
        // @ts-ignore - jspdf-autotable typings
        doc.autoTable({
          startY: governanceYPos + 10,
          head: [['Capability', 'Maturity Tier']],
          body: [
            ['Cybersecurity Risk Governance', `Tier ${report.governanceMaturity.governanceScore}`],
            ['Cybersecurity Risk Management', `Tier ${report.governanceMaturity.managementScore}`]
          ],
          theme: 'grid',
          headStyles: { fillColor: [105, 42, 187] }
        });
      }
      
      // Add recommendations page
      doc.addPage();
      doc.setFontSize(14);
      doc.text("Recommendations & Next Steps", 20, 20);
      
      doc.setFontSize(10);
      doc.text("Based on the RASBITA analysis, we recommend the following actions:", 20, 30);
      
      const recommendations = [
        "Prioritize securing assets with 'Critical' and 'High' risk levels",
        "Implement safeguards with positive Net Risk Reduction Benefit (NRRB)",
        "Focus on threats with highest Annual Loss Expectancy (ALE)",
        "Consider additional controls for frequently occurring threats",
        "Review and update this assessment quarterly or after significant changes"
      ];
      
      let yPosRec = 40;
      recommendations.forEach((rec, index) => {
        doc.text(`${index + 1}. ${rec}`, 20, yPosRec);
        yPosRec += 10;
      });
      
      // Add footer with company info
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          "CyberLockX - The Ultimate SMB Application Security Hub - Securing every CLICK!!!",
          (doc as any).internal.pageSize.getWidth() / 2, 
          (doc as any).internal.pageSize.getHeight() - 10, 
          { align: 'center' }
        );
        doc.text(
          `Page ${i} of ${pageCount}`,
          (doc as any).internal.pageSize.getWidth() - 20, 
          (doc as any).internal.pageSize.getHeight() - 10
        );
      }
      
      // Save the PDF
      doc.save(`RASBITA_Report_${report.id}_${new Date().toISOString().slice(0, 10)}.pdf`);
      
      toast({
        title: "PDF Export Successful",
        description: "Your RASBITA report has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
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
        
        // Ensure dashboard is shown
        setShowResults(true);
        
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
          
          // Add NIST CSF 2.0 framework domain scores
          newReport.rasbitaCategories = {
            govern: Math.round(55 + Math.random() * 25),
            identify: Math.round(55 + Math.random() * 25),
            protect: Math.round(55 + Math.random() * 25),
            detect: Math.round(55 + Math.random() * 25),
            respond: Math.round(55 + Math.random() * 25),
            recover: Math.round(55 + Math.random() * 25)
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
          createdAt: new Date().toISOString()
        });
        // Clear any initial form data
        setInitialFormData(null);
        toast({
          title: "New Report Created",
          description: "A new RASBITA report template has been created.",
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
      
      {showGovernanceAssessment ? (
        <GovernanceAssessment onComplete={handleGovernanceComplete} />
      ) : (
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
                    onClick={() => setShowGovernanceAssessment(true)}
                    className="flex items-center gap-2 text-chart-4 border-chart-4"
                  >
                    <CheckSquare className="h-4 w-4" />
                    <span>Governance Assessment</span>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToPdf}
                    disabled={exportLoading}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>{exportLoading ? "Exporting..." : "Export PDF"}</span>
                  </Button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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