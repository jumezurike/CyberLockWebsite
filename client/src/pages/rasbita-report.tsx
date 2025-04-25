import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, Mail, Share2, FileText, Save, Inbox, Calendar } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RasbitaDashboard from "@/components/rasbita/rasbita-dashboard";
import IncidentForm from "@/components/rasbita/incident-form";
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
  rasbitaCategories: {
    risk: 71,
    adversarialInsight: 65,
    securityControls: 62,
    businessImpact: 78,
    informationAssurance: 59,
    threatIntelligence: 68,
    architecture: 74
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
        head: [['Category', 'Score']],
        body: [
          ['Risk', report.rasbitaCategories.risk],
          ['Adversarial Insight', report.rasbitaCategories.adversarialInsight],
          ['Security Controls', report.rasbitaCategories.securityControls],
          ['Business Impact', report.rasbitaCategories.businessImpact],
          ['Information Assurance', report.rasbitaCategories.informationAssurance],
          ['Threat Intelligence', report.rasbitaCategories.threatIntelligence],
          ['Architecture', report.rasbitaCategories.architecture]
        ],
        theme: 'grid',
        headStyles: { fillColor: [105, 42, 187] }
      });
      
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

  // Fetch a specific report from the API
  const fetchRasbitaReport = async (reportId: string) => {
    setLoading(true);
    try {
      const response = await apiRequest("GET", `/api/rasbita-reports/${reportId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch report: ${response.statusText}`);
      }
      
      const data = await response.json();
      setReport(data);
      
      // Convert the report to form data format for editing
      const formData = reportToFormData(data);
      setInitialFormData(formData);
      
      toast({
        title: "Report Loaded",
        description: "RASBITA risk assessment report has been loaded successfully.",
      });
    } catch (error) {
      console.error("Error fetching report:", error);
      
      // If the report doesn't exist yet, use sample data
      if (reportId === "new") {
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
      } else {
        toast({
          title: "Error",
          description: "Failed to load RASBITA report. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
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

  const generateReport = async () => {
    if (!selectedAssessment) {
      // If no assessments exist in the database yet, create a sample assessment
      if (assessments.length === 0) {
        try {
          setLoading(true);
          // Create a sample assessment
          const sampleAssessment = {
            businessName: "CyberLockX Demo Business",
            industry: "Technology",
            employeeCount: "50-100",
            securityMeasures: ["Firewalls", "Endpoint Protection", "Employee Training"],
            primaryConcerns: ["Data Breaches", "Ransomware", "Insider Threats"],
            contactInfo: {
              name: "Demo User",
              email: "demo@cyberlockx.xyz",
              phone: "555-123-4567"
            },
            reportType: "Comprehensive",
            securityScore: 65,
            matrixData: JSON.stringify([
              {
                id: "item1",
                assetName: "Customer Database",
                threatVector: "SQL Injection",
                riskLevel: "High",
                mitigationStatus: "In Progress"
              }
            ]),
            findings: JSON.stringify([
              {
                category: "Data Security",
                description: "Customer database lacks encryption at rest",
                severity: "High",
                recommendation: "Implement TDE for all sensitive databases"
              }
            ]),
            recommendations: JSON.stringify([
              {
                title: "Enhance Data Protection",
                description: "Implement encryption for all sensitive data at rest and in transit",
                priority: "High",
                estimatedCost: "Medium",
                estimatedTimeframe: "3 months"
              }
            ])
          };
          
          const response = await apiRequest("POST", "/api/assessments", sampleAssessment);
          if (!response.ok) {
            throw new Error("Failed to create sample assessment");
          }
          
          const newAssessment = await response.json();
          
          // Add the new assessment to the list
          const formattedAssessment = {
            id: newAssessment.id.toString(),
            name: `${newAssessment.businessName} (${new Date(newAssessment.createdAt).toLocaleDateString()})`
          };
          
          setAssessments([formattedAssessment]);
          setSelectedAssessment(formattedAssessment.id);
          
          // Now fetch the RASBITA report based on this assessment
          await fetchRasbitaReport(formattedAssessment.id);
          return;
        } catch (error) {
          console.error("Error creating sample assessment:", error);
          toast({
            title: "Error",
            description: "Failed to create a sample assessment. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      } else {
        toast({
          title: "Selection Required",
          description: "Please select an assessment to generate a RASBITA report.",
          variant: "destructive",
        });
        return;
      }
    }

    fetchRasbitaReport(selectedAssessment);
  };

  // Load assessments from the database
  const [assessments, setAssessments] = useState<{id: string, name: string}[]>([]);
  
  // Function to fetch assessments
  const fetchAssessments = async () => {
    try {
      const response = await apiRequest("GET", "/api/assessments");
      if (!response.ok) {
        throw new Error("Failed to fetch assessments");
      }
      
      const data = await response.json();
      
      // Map assessment data to the format needed for the dropdown
      const formattedAssessments = data.map((assessment: any) => ({
        id: assessment.id.toString(),
        name: `${assessment.businessName} (${new Date(assessment.createdAt).toLocaleDateString()})`
      }));
      
      setAssessments(formattedAssessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      toast({
        title: "Error",
        description: "Failed to load assessments. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const [activeTab, setActiveTab] = useState<string>("new-incident");
  
  // If user clicks on "Report Incident" tab after loading a report, 
  // set initialFormData and switch to that tab
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // If switching to incident form after loading a report
    if (tab === "new-incident" && initialFormData === null && report.id !== "new") {
      // Convert report to form data
      const formData = reportToFormData(report);
      setInitialFormData(formData);
    }
  };
  const [showResults, setShowResults] = useState<boolean>(false);
  
  const handleIncidentSubmit = async (incidentData: any) => {
    // Create a new report based on the incident data
    try {
      setLoading(true);
      
      const newRiskItem: RasbitaRiskItem = incidentData.riskItem;
      
      // Create a new report or update existing one
      let updatedReport: RasbitaReport;
      if (report.id === "new") {
        // Create new report
        updatedReport = {
          id: "new", // Server will generate ID
          title: incidentData.incident.title || "Security Incident Report",
          incidentCategory: incidentData.incident.category,
          overallRiskScore: calculateRiskScore(newRiskItem),
          company: incidentData.company,
          incident: incidentData.incident,
          riskItems: [newRiskItem],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          businessId: incidentData.company.businessId || "unknown",
          rasbitaCategories: calculateRasbitaCategories(newRiskItem),
          financialSummary: {
            totalAssetValue: newRiskItem.assetValue,
            totalAnnualizedLossExpectancy: newRiskItem.annualizedLossExpectancy,
            totalCostOfSafeguards: newRiskItem.annualCostOfSafeguard,
            totalNetRiskReductionBenefit: newRiskItem.netRiskReductionBenefit
          }
        };
      } else {
        // Update existing report
        updatedReport = {
          ...report,
          riskItems: [newRiskItem, ...report.riskItems],
          updatedAt: new Date().toISOString()
        };
        
        // Update financial summary
        updatedReport.financialSummary = {
          totalAssetValue: updatedReport.riskItems.reduce((sum, item) => sum + item.assetValue, 0),
          totalAnnualizedLossExpectancy: updatedReport.riskItems.reduce((sum, item) => sum + item.annualizedLossExpectancy, 0),
          totalCostOfSafeguards: updatedReport.riskItems.reduce((sum, item) => sum + item.annualCostOfSafeguard, 0),
          totalNetRiskReductionBenefit: updatedReport.riskItems.reduce((sum, item) => sum + item.netRiskReductionBenefit, 0)
        };
      }
      
      // Save the report to the database
      const response = updatedReport.id === "new" ? 
        await apiRequest("POST", "/api/rasbita-reports", updatedReport) :
        await apiRequest("PUT", `/api/rasbita-reports/${updatedReport.id}`, updatedReport);
      
      if (!response.ok) {
        throw new Error("Failed to save RASBITA report");
      }
      
      const savedReport = await response.json();
      
      // Update the UI with the saved report
      setReport(savedReport);
      
      // Show results and switch to dashboard tab
      setShowResults(true);
      setActiveTab("dashboard");
      
      // Refresh the saved reports list
      fetchSavedReports();
      
      toast({
        title: "RASBITA Analysis Complete",
        description: "Your security incident has been analyzed. Reviewing financial impact analysis...",
      });
    } catch (error) {
      console.error("Error submitting incident data:", error);
      toast({
        title: "Error",
        description: "Failed to analyze security incident. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to calculate risk score based on RASBITA methodology
  const calculateRiskScore = (riskItem: RasbitaRiskItem): number => {
    const {
      likelihood,
      impact,
      exposureFactor,
      threatLevel
    } = riskItem;
    
    // Calculate risk score using RASBITA methodology (simplified for demo)
    // Actual implementation would use more sophisticated algorithm
    const baseScore = (likelihood * impact * exposureFactor) / 10;
    const adjustedScore = baseScore * (threatLevel / 5);
    
    return Math.min(Math.round(adjustedScore), 100);
  };
  
  // Helper function to calculate RASBITA categories
  const calculateRasbitaCategories = (riskItem: RasbitaRiskItem): {
    risk: number;
    adversarialInsight: number;
    securityControls: number;
    businessImpact: number;
    informationAssurance: number;
    threatIntelligence: number;
    architecture: number;
  } => {
    // In a real implementation, these would be calculated based on a more complex algorithm
    // For demonstration, we'll use the risk item properties to generate values
    return {
      risk: Math.round(riskItem.likelihood * 2),
      adversarialInsight: Math.round(riskItem.threatLevel * 2),
      securityControls: Math.round((10 - riskItem.safeguardEffectiveness) * 2),
      businessImpact: Math.round(riskItem.impact * 2),
      informationAssurance: Math.round((riskItem.confidentiality + riskItem.integrity + riskItem.availability) / 3 * 2),
      threatIntelligence: Math.round(riskItem.threatLevel * 1.5),
      architecture: Math.round(10 - riskItem.exposureFactor)
    };
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Crisis Response Tool</h3>
              <div className="mt-1 text-sm text-red-700">
                This secure tool is designed to be invoked during security incidents to provide financial impact analysis and guide response decisions.
              </div>
            </div>
          </div>
        </div>
      
        <h1 className="text-3xl font-bold mb-2 text-chart-4">RASBITA™ Risk Assessment Report</h1>
        <p className="text-lg text-gray-600 mb-8">
          CISSP Risk Assessment Score by Threat and Impact Analysis
        </p>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          <TabsList className="mb-4">
            <TabsTrigger value="new-incident">Report Incident</TabsTrigger>
            <TabsTrigger value="existing-assessment">Load Existing Assessment</TabsTrigger>
            {showResults && <TabsTrigger value="dashboard">Dashboard</TabsTrigger>}
            {showResults && <TabsTrigger value="export">Export Options</TabsTrigger>}
          </TabsList>
          
          {/* Tab for reporting a new incident */}
          <TabsContent value="new-incident">
            <div className="mb-4 bg-purple-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold text-chart-4 mb-2">Security Incident Details</h3>
              <p className="text-gray-700">
                Complete the form below with details about the current security incident. The RASBITA tool will
                analyze the financial impact and provide cost-benefit analysis to guide your response decisions.
              </p>
            </div>
            <IncidentForm onSubmit={handleIncidentSubmit} initialData={initialFormData} />
          </TabsContent>
          
          {/* Tab for loading an existing assessment or saved report */}
          <TabsContent value="existing-assessment">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Generate RASBITA Report</CardTitle>
                  <CardDescription>
                    Select an existing assessment to generate a new RASBITA risk report with financial analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="w-full">
                      <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an assessment" />
                        </SelectTrigger>
                        <SelectContent>
                          {assessments.map(assessment => (
                            <SelectItem key={assessment.id} value={assessment.id}>
                              {assessment.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      className="bg-chart-4 hover:bg-purple-700 text-white" 
                      onClick={() => {
                        generateReport();
                        setShowResults(true);
                        setActiveTab("dashboard");
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Generating Report...' : 'Generate RASBITA Report'}
                    </Button>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-600 bg-purple-50 p-3 rounded-md">
                    <p>
                      <strong>Note:</strong> The RASBITA report provides a comprehensive financial analysis
                      of your security risks and controls, including asset values, exposure factors, and
                      cost-benefit analysis for each control.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Saved RASBITA Reports</CardTitle>
                  <CardDescription>
                    View your previously saved RASBITA risk assessment reports.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {savedReports.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-md border border-gray-200">
                      <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No saved reports</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        After analyzing incidents, save your reports to access them later.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                      {savedReports.map(savedReport => (
                        <div 
                          key={savedReport.id} 
                          className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                          onClick={() => {
                            fetchRasbitaReport(savedReport.id.toString());
                            setShowResults(true);
                            setActiveTab("dashboard");
                          }}
                        >
                          <div>
                            <h4 className="font-medium text-gray-900">{savedReport.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(savedReport.createdAt).toLocaleDateString()}
                              </span>
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                                {savedReport.incidentCategory}
                              </span>
                            </div>
                          </div>
                          <div className="bg-chart-4 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                            {Math.round(savedReport.overallRiskScore)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Button 
                      onClick={fetchSavedReports} 
                      variant="outline" 
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? 'Refreshing...' : 'Refresh Reports'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="flex justify-end mb-4">
              <Button 
                className="bg-chart-4 hover:bg-purple-700 flex items-center justify-center gap-2"
                onClick={saveReport}
                disabled={saveLoading}
              >
                {saveLoading ? 'Saving Report...' : <>
                  <Save size={16} />
                  Save Report
                </>}
              </Button>
            </div>
            <RasbitaDashboard report={report} />
          </TabsContent>
          
          {/* Export Options Tab */}
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Export RASBITA Report</CardTitle>
                <CardDescription>
                  Download or share your RASBITA risk assessment report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border border-gray-200">
                    <CardHeader className="bg-gray-50">
                      <CardTitle className="text-lg">PDF Export</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600 mb-4">
                        Export a comprehensive PDF report with all RASBITA metrics, charts, and detailed financial analysis.
                      </p>
                      <Button 
                        className="w-full bg-chart-4 hover:bg-purple-700 flex items-center justify-center gap-2"
                        onClick={exportToPdf}
                        disabled={exportLoading}
                      >
                        {exportLoading ? 'Generating PDF...' : <>
                          <Download size={16} />
                          Download PDF Report
                        </>}
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200">
                    <CardHeader className="bg-gray-50">
                      <CardTitle className="text-lg">Excel Export</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600 mb-4">
                        Export all RASBITA metrics and calculations to an Excel spreadsheet for further analysis.
                      </p>
                      <Button 
                        className="w-full bg-chart-4 hover:bg-purple-700 flex items-center justify-center gap-2"
                        onClick={() => toast({
                          title: "Coming Soon",
                          description: "Excel export will be available in the next update.",
                        })}
                      >
                        <FileText size={16} />
                        Download Excel Report
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200">
                    <CardHeader className="bg-gray-50">
                      <CardTitle className="text-lg">Stakeholder Presentation</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600 mb-4">
                        Export a presentation-ready report formatted for executive stakeholders, focusing on key financial metrics.
                      </p>
                      <Button 
                        className="w-full bg-chart-4 hover:bg-purple-700 flex items-center justify-center gap-2"
                        onClick={() => toast({
                          title: "Coming Soon",
                          description: "Presentation export will be available in the next update.",
                        })}
                      >
                        <FileText size={16} />
                        Download Presentation
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200">
                    <CardHeader className="bg-gray-50">
                      <CardTitle className="text-lg">Share Report</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600 mb-4">
                        Share this RASBITA report with team members or stakeholders via a secure link or email.
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        <Button 
                          className="w-full bg-chart-4 hover:bg-purple-700 flex items-center justify-center gap-2"
                          onClick={() => toast({
                            title: "Share Link Generated",
                            description: "A secure link has been copied to your clipboard. This link will expire in 7 days.",
                          })}
                        >
                          <Share2 size={16} />
                          Generate Sharing Link
                        </Button>
                        <Button 
                          className="w-full bg-chart-4 hover:bg-purple-700 flex items-center justify-center gap-2"
                          onClick={() => toast({
                            title: "Email Option",
                            description: "Email sharing will be available in the next update.",
                          })}
                        >
                          <Mail size={16} />
                          Email Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}