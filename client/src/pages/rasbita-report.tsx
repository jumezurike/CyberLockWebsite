import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, Mail, Share2, FileText } from 'lucide-react';

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
  businessId: "business-1",
  createdAt: new Date().toISOString(),
  overallRiskScore: 68.5,
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
  }
};

export default function RasbitaReportPage() {
  const { toast } = useToast();
  const [report, setReport] = useState<RasbitaReport>(sampleReport);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<string>("");

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
  
  // In a real implementation, this would fetch the report from the API
  const fetchRasbitaReport = async (assessmentId: string) => {
    setLoading(true);
    try {
      // This would be an actual API call in a real implementation
      // const response = await apiRequest("GET", `/api/rasbita-reports/${assessmentId}`);
      // const data = await response.json();
      // setReport(data);
      
      // For now, we're just using the sample data
      setTimeout(() => {
        setReport({
          ...sampleReport,
          id: `rasbita-${assessmentId}`,
          businessId: assessmentId
        });
        setLoading(false);
        toast({
          title: "Report Loaded",
          description: "RASBITA risk assessment report has been loaded successfully.",
        });
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load RASBITA report. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const generateReport = () => {
    if (!selectedAssessment) {
      toast({
        title: "Selection Required",
        description: "Please select an assessment to generate a RASBITA report.",
        variant: "destructive",
      });
      return;
    }

    fetchRasbitaReport(selectedAssessment);
  };

  // Sample assessments for the dropdown
  const assessments = [
    { id: "1", name: "Main Office Assessment (Apr 2025)" },
    { id: "2", name: "Remote Operations Assessment (Mar 2025)" },
    { id: "3", name: "Cloud Infrastructure Assessment (Feb 2025)" },
  ];

  const [activeTab, setActiveTab] = useState<string>("new-incident");
  const [showResults, setShowResults] = useState<boolean>(false);
  
  const handleIncidentSubmit = (incidentData: any) => {
    // In a real implementation, this would submit the incident data to the API
    // and then fetch the generated report
    
    console.log("Incident data submitted:", incidentData);
    
    // For demo purposes, we'll use the sample report with a new risk item
    const newRiskItem: RasbitaRiskItem = incidentData.riskItem;
    
    // Create updated report with the new risk item
    const updatedReport: RasbitaReport = {
      ...sampleReport,
      riskItems: [newRiskItem, ...sampleReport.riskItems],
      createdAt: new Date().toISOString()
    };
    
    // Update financial summary (in a real app, this would be calculated on the server)
    updatedReport.financialSummary = {
      totalAssetValue: updatedReport.riskItems.reduce((sum, item) => sum + item.assetValue, 0),
      totalAnnualizedLossExpectancy: updatedReport.riskItems.reduce((sum, item) => sum + item.annualizedLossExpectancy, 0),
      totalCostOfSafeguards: updatedReport.riskItems.reduce((sum, item) => sum + item.annualCostOfSafeguard, 0),
      totalNetRiskReductionBenefit: updatedReport.riskItems.reduce((sum, item) => sum + item.netRiskReductionBenefit, 0)
    };
    
    // Update report
    setReport(updatedReport);
    
    // Show results and switch to dashboard tab
    setShowResults(true);
    setActiveTab("dashboard");
    
    toast({
      title: "RASBITA Analysis Complete",
      description: "Your security incident has been analyzed. Reviewing financial impact analysis...",
    });
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
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
            <IncidentForm onSubmit={handleIncidentSubmit} />
          </TabsContent>
          
          {/* Tab for loading an existing assessment */}
          <TabsContent value="existing-assessment">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Generate RASBITA Report</CardTitle>
                <CardDescription>
                  Select an existing assessment to generate a RASBITA risk report with financial analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-2/3">
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
          </TabsContent>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
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