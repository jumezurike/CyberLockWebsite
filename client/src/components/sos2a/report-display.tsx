import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssessmentReport } from "@/lib/sos2a-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileText, Download, Calendar, Clock, AlertTriangle, Shield, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow, differenceInDays, parseISO } from "date-fns";
import Scorecard from "./scorecard";
import logoImage from "@/assets/cyberlockx-logo-resized.png";

interface ReportDisplayProps {
  report: AssessmentReport;
  onBack: () => void;
}

export default function ReportDisplay({ report, onBack }: ReportDisplayProps) {
  const [evidenceDialog, setEvidenceDialog] = useState(false);
  const [lifecycleDialog, setLifecycleDialog] = useState(false);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Calculate and format assessment age
  const getAssessmentAge = (): number => {
    // Use the age property if available, otherwise calculate it
    if (report.age !== undefined) {
      return report.age;
    }
    
    return differenceInDays(new Date(), parseISO(report.createdAt));
  };
  
  // Format age for display
  const formatAssessmentAge = (): string => {
    return formatDistanceToNow(parseISO(report.createdAt), { addSuffix: true });
  };
  
  // Get appropriate icon and color based on assessment age
  const getAgeStatusInfo = (): { icon: React.ReactNode, color: string, label: string } => {
    const age = getAssessmentAge();
    
    if (age <= 30) {
      return { 
        icon: <CheckCircle2 className="h-5 w-5" />, 
        color: "text-green-600",
        label: "Current"
      };
    }
    
    if (age <= 90) {
      return { 
        icon: <Shield className="h-5 w-5" />, 
        color: "text-blue-600",
        label: "Recent"
      };
    }
    
    if (age <= 180) {
      return { 
        icon: <AlertCircle className="h-5 w-5" />, 
        color: "text-amber-600",
        label: "Aging"
      };
    }
    
    return { 
      icon: <AlertTriangle className="h-5 w-5" />, 
      color: "text-red-600",
      label: "Outdated"
    };
  };
  
  const ageInfo = getAgeStatusInfo();
  const isComprehensiveReport = report.reportType === 'comprehensive';
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold">
                Healthcare Organizational and System Security Analysis (HOS²A) {report.reportType === 'preliminary' ? 'Preliminary' : 'Comprehensive'} Report
              </CardTitle>
              <div className="mt-2 mb-1">
                <h2 className="text-lg font-semibold text-primary">{report.businessName}</h2>
                <p className="text-sm text-muted-foreground">{report.industry} | {report.location || 'Unknown location'}</p>
              </div>
              <CardDescription>
                Generated on {formatDate(report.createdAt)}
              </CardDescription>
              
              {/* Assessment Age Information */}
              <div className={`mt-1 flex items-center gap-1 ${ageInfo.color}`}>
                {ageInfo.icon}
                <span className="text-xs font-medium">
                  {ageInfo.label}: {formatAssessmentAge()}
                </span>
                <button
                  type="button"
                  className="ml-1 text-xs underline hover:text-primary"
                  onClick={() => setLifecycleDialog(true)}
                >
                  Assessment Lifecycle Info
                </button>
              </div>
              
              {report.reportType === 'preliminary' && (
                <div className="mt-2 text-sm text-blue-600">
                  This is a preliminary assessment. For a comprehensive assessment with deeper analysis and evidence-based scoring, proceed to the comprehensive assessment path.
                </div>
              )}
              {report.reportType === 'comprehensive' && (
                <div className="mt-2 text-sm text-green-600">
                  This comprehensive assessment includes evidence collected over a 6+ month period and provides a more accurate view of your security posture.
                </div>
              )}
            </div>
            <div className="flex flex-col items-center bg-primary/10 p-3 rounded-md">
              <span className="text-2xl font-bold text-primary">{report.securityScore}%</span>
              <span className="text-xs text-muted-foreground">Security Score</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {report.reportType === 'preliminary' && (
            <div className="space-y-4">
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Preliminary Assessment</AlertTitle>
                <AlertDescription className="text-amber-700">
                  This is a <span className="font-medium">free preliminary assessment</span> for your first engagement. 
                  It provides a qualitative overview of your security posture based on expert opinion and industry standards. 
                  This report establishes the foundation for building a resilient cybersecurity framework and sets the stage 
                  for more detailed analysis. Moving forward with a comprehensive assessment requires implementing the 
                  recommended mitigation strategies, including SOC monitoring, incident response, and security controls, 
                  followed by 6 months of evidence collection.
                </AlertDescription>
              </Alert>
              
              <div className="bg-gray-50 p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-3">Assessment Progress</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-purple-600 text-white">
                        STEP 7 OF 9
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-purple-600">
                        78% Complete
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div style={{ width: "78%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-center mb-4">
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">1. Inquiry & Questionnaire</p>
                      <p className="text-xs text-green-600">Initial Data Collection</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">2. Interview & Matrix Population</p>
                      <p className="text-xs text-green-600">Stakeholder Input</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">3. Matrix Population</p>
                      <p className="text-xs text-green-600">Infrastructure Data</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-center mb-4">
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">4. RASBITA Governance</p>
                      <p className="text-xs text-green-600">Cybersecurity Governance Maturity</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">5. RASBITA Score</p>
                      <p className="text-xs text-green-600">Cost-Benefit Analysis</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">6. Gap Analysis</p>
                      <p className="text-xs text-green-600">Security Parameters</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-center">
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">7. Architecture Analysis</p>
                      <p className="text-xs text-green-600">Threat Modeling Complete</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center mx-auto">8</div>
                      <p className="font-medium text-gray-500">8. Preliminary Report</p>
                      <p className="text-xs text-gray-400">Qualitative Assessment</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center mx-auto">9</div>
                      <p className="font-medium text-gray-500">9. Comprehensive Report</p>
                      <p className="text-xs text-gray-400">Quantitative Analysis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {report.reportType === 'comprehensive' && (
            <div className="space-y-4">
              <Alert variant="default" className="bg-blue-50 border-blue-200">
                <FileText className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Comprehensive Assessment</AlertTitle>
                <AlertDescription className="text-blue-700">
                  This comprehensive assessment includes quantitative analysis based on 6 months of evidence 
                  collection using industry tools (SIEM, network flow analyzers, event log analytics, vulnerability assessment).
                  It measures verifiable improvements and compliance across your network, infrastructure, and applications.
                </AlertDescription>
              </Alert>
              
              <div className="bg-gray-50 p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-3">Assessment Progress</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-500 text-white">
                        Step 9 of 9
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-green-500">
                        100% Complete
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div style={{ width: "100%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-center mb-4">
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">1. Inquiry & Questionnaire</p>
                      <p className="text-xs text-green-600">Initial Data Collection</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">2. Interview & Matrix Population</p>
                      <p className="text-xs text-green-600">Stakeholder Input</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">3. Matrix Population</p>
                      <p className="text-xs text-green-600">Infrastructure Data</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-center mb-4">
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">4. RASBITA Governance</p>
                      <p className="text-xs text-green-600">Cybersecurity Governance Maturity</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">5. RASBITA Score</p>
                      <p className="text-xs text-green-600">Cost-Benefit Analysis</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">6. Gap Analysis</p>
                      <p className="text-xs text-green-600">Security Parameters</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-center">
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">7. Architecture Analysis</p>
                      <p className="text-xs text-green-600">Threat Modeling Complete</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">8. Preliminary Report</p>
                      <p className="text-xs text-green-600">Qualitative Assessment</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-purple-700">9. Comprehensive Report</p>
                      <p className="text-xs text-purple-600">Quantitative Analysis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {report.reportType === 'preliminary' && (
            <div className="border-b pb-4 mb-4">
              <h2 className="text-lg font-semibold mb-2">Executive Summary</h2>
              <p className="text-sm text-muted-foreground">
                This preliminary report highlights the current cybersecurity state of your organization, with an 
                emphasis on assessing its organizational and system security posture. While this is an initial overview, 
                it is part of a larger effort to align security controls with industry compliance standards, regulations, 
                and best practices. The purpose of this report is to illustrate the need for comprehensive monitoring, 
                threat detection, and an effective incident response system.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                As part of this assessment, we've conducted an architectural review using our STRIDE threat modeling methodology, 
                which evaluates your systems for Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, 
                and Elevation of Privilege threats. This analysis has identified architectural vulnerabilities and recommended 
                mitigation controls that are incorporated into our overall risk assessment.
              </p>
            </div>
          )}
          
          {report.reportType === 'comprehensive' && (
            <div className="border-b pb-4 mb-4">
              <h2 className="text-lg font-semibold mb-2">Executive Summary</h2>
              <p className="text-sm text-muted-foreground">
                This comprehensive report provides a detailed quantitative analysis of your organization's security posture
                based on 6 months of evidence collection following the implementation of recommended mitigation strategies.
                The assessment verifies compliance with industry standards and regulations, identifies remaining security
                gaps, and provides a roadmap for continuous security improvement. The RASBITA scoring methodology offers
                measurable metrics across risk, adversarial insight, security controls, business impact, information assurance,
                threat intelligence, and architecture domains.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Our assessment includes a comprehensive architectural risk analysis using the STRIDE threat modeling methodology.
                This thorough evaluation has documented security controls implemented since the preliminary assessment and verified
                their effectiveness through penetration testing and security validation. The threat modeling results show significant 
                improvement in architectural security controls, with all critical architectural vulnerabilities successfully mitigated
                as evidenced in the Approval Recommendation report.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Business Information</h3>
              <p className="font-medium">{report.businessId}</p>
              <p>{report.industry} | {
                report.businessLocation && typeof report.businessLocation === 'object' 
                  ? `${report.businessLocation.state || 'Unknown'}, ${report.businessLocation.country || 'Unknown'}` 
                  : 'Unknown location'
              }</p>
              <p className="text-sm text-muted-foreground">{report.businessServices}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">RASBITA Score Components</h3>
                <div className="bg-purple-100 text-purple-900 font-bold px-3 py-1 rounded-full flex items-center">
                  <span>Overall: {report.rasbitaScore?.overall || "N/A"}%</span>
                  <span className="ml-1 text-xs px-2 py-0.5 bg-purple-800 text-white rounded-full">RASBITA™</span>
                </div>
              </div>
              {report.rasbitaScore && (
                <>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-primary/5 rounded-md p-2 border-l-4 border-red-500">
                      <p className="text-xs text-muted-foreground">Cybersecurity Incident Risk Score</p>
                      <p className="font-bold text-red-600">
                        {/* Prioritize new NIST CSF 2.0 domains, fallback to legacy fields */}
                        {report.rasbitaScore.categories?.govern || 
                         report.rasbitaScore.categories?.risk || 
                         "N/A"}
                      </p>
                    </div>
                    <div className="bg-primary/5 rounded-md p-2 border-l-4 border-purple-500">
                      <p className="text-xs text-muted-foreground">Cybersecurity Gov & Mngt maturity level</p>
                      <p className="font-bold text-purple-600">
                        {/* Prioritize new NIST CSF 2.0 domains, fallback to legacy fields */}
                        {report.rasbitaScore.categories?.protect || 
                         report.rasbitaScore.categories?.securityControls || 
                         "N/A"}
                      </p>
                    </div>
                    <div className="bg-primary/5 rounded-md p-2 border-l-4 border-green-500">
                      <p className="text-xs text-muted-foreground">NRRB (positive)</p>
                      <p className="font-bold text-green-600">
                        {/* Prioritize new NIST CSF 2.0 domains, fallback to legacy fields */}
                        {report.rasbitaScore.categories?.respond || 
                         report.rasbitaScore.categories?.architecture || 
                         "N/A"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Positive value = spend makes sense</p>
                    </div>
                  </div>
                  
                  {/* NIST CSF 2.0 Framework Compliance */}
                  <div className="mt-3 border-t pt-2">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-medium text-muted-foreground">NIST CSF 2.0 Framework Maturity</h3>
                      <div className="bg-blue-100 text-blue-900 text-xs px-2 py-0.5 rounded-full">
                        Overall Rating: {report.rasbitaScore?.overall || "N/A"}%
                      </div>
                    </div>
                    <div className="grid grid-cols-6 gap-1 text-center">
                      {['govern', 'identify', 'protect', 'detect', 'respond', 'recover'].map((domain) => (
                        <div key={domain} className="bg-blue-50 rounded p-1">
                          <p className="text-[10px] capitalize">{domain}</p>
                          <p className="text-xs font-bold text-blue-700">
                            {report.rasbitaScore?.categories?.[domain as keyof typeof report.rasbitaScore.categories] || "N/A"}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Original Report Tabs with Visual Elements */}
      <div className="border-t pt-8 mt-8">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="summary">Summary Findings</TabsTrigger>
            <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="enhanced-executive">Enhanced Executive</TabsTrigger>
            <TabsTrigger value="enhanced-analysis">Enhanced Analysis</TabsTrigger>
          </TabsList>

          {/* Original Summary Findings Tab */}
          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Summary Findings</CardTitle>
                <CardDescription>
                  Key insights and findings from your security assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Assessment Overview</h3>
                    <p className="text-sm text-muted-foreground">
                      Your organization has been evaluated against industry-standard cybersecurity frameworks
                      including NIST CSF 2.0, resulting in an overall security score of {report.securityScore}%.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Key Strengths</h3>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>Established security governance framework</li>
                      <li>Basic identity and access management controls</li>
                      <li>Regular security awareness training</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Priority Areas for Improvement</h3>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>Enhanced threat detection and monitoring capabilities</li>
                      <li>Incident response procedures and testing</li>
                      <li>Data encryption and protection measures</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Original Scorecard Tab with Visual Elements */}
          <TabsContent value="scorecard" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">RASBITA Framework Score</CardTitle>
                  <CardDescription>
                    Comprehensive security posture analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Scorecard 
                    scorecard={report.scorecard || []}
                    reportType={report.reportType}
                    report={report}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Domain Breakdown</CardTitle>
                  <CardDescription>
                    NIST CSF 2.0 Framework Maturity Levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {report.rasbitaScore?.categories && ['govern', 'identify', 'protect', 'detect', 'respond', 'recover'].map((domain) => {
                      const score = report.rasbitaScore?.categories?.[domain as keyof typeof report.rasbitaScore.categories] || 0;
                      return (
                        <div key={domain} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize font-medium">{domain}</span>
                            <span className="font-bold">{score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Original Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security Recommendations</CardTitle>
                <CardDescription>
                  Prioritized actions to improve your security posture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="font-semibold text-red-700 mb-2">Critical Priority</h3>
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      <li>Implement multi-factor authentication for all user accounts</li>
                      <li>Establish comprehensive backup and recovery procedures</li>
                      <li>Deploy endpoint detection and response (EDR) solutions</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-amber-500 pl-4">
                    <h3 className="font-semibold text-amber-700 mb-2">High Priority</h3>
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      <li>Conduct regular security awareness training</li>
                      <li>Implement network segmentation controls</li>
                      <li>Establish incident response procedures</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-blue-700 mb-2">Medium Priority</h3>
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      <li>Regular penetration testing and vulnerability assessments</li>
                      <li>Enhanced logging and monitoring capabilities</li>
                      <li>Security policy documentation and review</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Original Implementation Guidance Tab */}
          <TabsContent value="implementation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Implementation Guidance</CardTitle>
                <CardDescription>
                  Step-by-step roadmap for security improvements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">1</span>
                      Immediate Actions (0-30 days)
                    </h3>
                    <ul className="text-sm space-y-1 ml-8 list-disc">
                      <li>Enable MFA for all administrative accounts</li>
                      <li>Update and patch all critical systems</li>
                      <li>Conduct security awareness training for all staff</li>
                      <li>Review and update access controls</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">2</span>
                      Short-term Goals (30-90 days)
                    </h3>
                    <ul className="text-sm space-y-1 ml-8 list-disc">
                      <li>Deploy endpoint security solutions</li>
                      <li>Implement network monitoring tools</li>
                      <li>Establish incident response procedures</li>
                      <li>Conduct security risk assessment</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">3</span>
                      Long-term Objectives (90-365 days)
                    </h3>
                    <ul className="text-sm space-y-1 ml-8 list-disc">
                      <li>Achieve compliance certification</li>
                      <li>Implement advanced threat detection</li>
                      <li>Establish security metrics and KPIs</li>
                      <li>Regular security testing and validation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Enhanced Executive Summary Tab with Business Information and Summary Findings */}
          <TabsContent value="enhanced-executive" className="space-y-4">
            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Industry:</strong> {report.industry}</div>
                  <div><strong>Location:</strong> {report.location || 'Unknown location'}</div>
                  <div><strong>Assessment Type:</strong> {isComprehensiveReport ? 'Comprehensive' : 'Preliminary'}</div>
                  <div><strong>Overall Security Score:</strong> <span className="font-bold text-primary">{report.securityScore}%</span></div>
                </div>
              </CardContent>
            </Card>

            {/* RASBITA Score Components */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>RASBITA Score Components</span>
                  <span className="text-2xl font-bold text-primary">
                    {report.rasbitaScore?.overall || report.securityScore || 'N/A'}% RASBITA™
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  Overall score based on comprehensive security posture analysis
                </div>
                {report.rasbitaScore?.categories && (
                  <div className="grid grid-cols-6 gap-2 text-center">
                    {['govern', 'identify', 'protect', 'detect', 'respond', 'recover'].map((domain) => (
                      <div key={domain} className="bg-blue-50 rounded p-2 border">
                        <p className="text-xs capitalize font-medium">{domain}</p>
                        <p className="text-sm font-bold text-blue-700">
                          {report.rasbitaScore?.categories?.[domain as keyof typeof report.rasbitaScore.categories] || "N/A"}%
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary Findings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Summary Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="border rounded-md p-3 text-center">
                    <div className="text-lg font-bold text-red-600">
                      {report.vulnerabilities && Array.isArray(report.vulnerabilities.critical) 
                        ? report.vulnerabilities.critical.length 
                        : 0}
                    </div>
                    <div className="text-sm">Critical Vulnerabilities</div>
                    <div className="text-xs text-muted-foreground">Greater than 80% probability</div>
                  </div>
                  <div className="border rounded-md p-3 text-center">
                    <div className="text-lg font-bold text-orange-600">
                      {report.findings && Array.isArray(report.findings) 
                        ? report.findings.filter(f => f.severity === 'High').length 
                        : 0}
                    </div>
                    <div className="text-sm">High Risks</div>
                    <div className="text-xs text-muted-foreground">Between 60%-80% probability</div>
                  </div>
                  <div className="border rounded-md p-3 text-center">
                    <div className="text-lg font-bold text-amber-600">
                      {report.findings && Array.isArray(report.findings) 
                        ? report.findings.filter(f => f.severity === 'Medium').length 
                        : 0}
                    </div>
                    <div className="text-sm">Medium Risks</div>
                    <div className="text-xs text-muted-foreground">Between 30%-60% probability</div>
                  </div>
                  <div className="border rounded-md p-3 text-center">
                    <div className="text-lg font-bold text-green-600">
                      {report.recommendations && Array.isArray(report.recommendations.immediate) 
                        ? report.recommendations.immediate.length 
                        : 0}
                    </div>
                    <div className="text-sm">Low Risks</div>
                    <div className="text-xs text-muted-foreground">Below 30% probability</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-md p-3 text-sm">
                  <p className="font-medium mb-2">Risk Probability Categories:</p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><span className="font-semibold text-red-600">Critical</span> – Greater than 80% probability of occurrence</li>
                    <li><span className="font-semibold text-orange-600">High</span> – Between 60% and 80% probability of occurrence</li>
                    <li><span className="font-semibold text-amber-600">Medium</span> – Between 30% and 60% probability of occurrence</li>
                    <li><span className="font-semibold text-green-600">Low</span> – Below 30% probability of occurrence</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Executive Summary Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Executive Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">
                  This {isComprehensiveReport ? 'comprehensive' : 'preliminary'} report highlights the current cybersecurity state of {report.businessName}, 
                  with an emphasis on assessing its organizational and system security posture. While this is an {isComprehensiveReport ? 'detailed analysis' : 'initial overview'}, 
                  it is part of a larger effort to align security controls with industry compliance standards, regulations, and best practices.
                </p>
                <p className="text-sm leading-relaxed">
                  The purpose of this report is to illustrate the need for comprehensive monitoring, threat detection, and an effective 
                  incident response system. As part of this assessment, we've conducted an architectural review using our STRIDE 
                  threat modeling methodology, which evaluates your systems for Spoofing, Tampering, Repudiation, Information 
                  Disclosure, Denial of Service, and Elevation of Privilege threats. This analysis has identified architectural 
                  vulnerabilities and recommended mitigation controls that are incorporated into our overall risk assessment framework.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Risk Analysis Tab */}
          <TabsContent value="enhanced-risk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mode of Operation & Security Risks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Primary Areas of Operation</h4>
                  <ul className="text-sm space-y-1 ml-4 list-disc">
                    <li><strong>Website & Social Media Presence:</strong> Customer engagement and marketing</li>
                    <li><strong>POS Systems & Cellular Data Networks:</strong> Transaction processing</li>
                    <li><strong>Email Communication (Without Website):</strong> Internal and external communications</li>
                    <li><strong>Internet Access through ISP/Mobile Data/Hotspots:</strong> Connectivity for operations</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-2">Identified Security Risks</h4>
                  <ul className="text-sm space-y-1 ml-4 list-disc">
                    <li><strong>Email-based attacks:</strong> Phishing campaigns targeting employee credentials</li>
                    <li><strong>Unpatched systems:</strong> Vulnerabilities in outdated software and operating systems</li>
                    <li><strong>Weak authentication:</strong> Password-based access without multi-factor authentication</li>
                    <li><strong>Data exposure:</strong> Sensitive information stored without proper encryption</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-2">Cybersecurity Risk Management</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <h5 className="font-semibold text-red-800 text-sm">Critical Risks</h5>
                      <p className="text-xs text-red-700 mt-1">Immediate action required</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded p-3">
                      <h5 className="font-semibold text-amber-800 text-sm">Medium Risks</h5>
                      <p className="text-xs text-amber-700 mt-1">Planned mitigation within 90 days</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <h5 className="font-semibold text-green-800 text-sm">Low Risks</h5>
                      <p className="text-xs text-green-700 mt-1">Ongoing monitoring</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Analysis Tab */}
          <TabsContent value="enhanced-analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Compliance Requirements</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>PCI-DSS:</strong> Payment card industry data security standard</div>
                    <div><strong>HIPAA:</strong> Health insurance portability and accountability act</div>
                    <div><strong>CMMC:</strong> Cybersecurity maturity model certification</div>
                    <div><strong>SOC 2:</strong> Service organization control 2 compliance</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-2">Mitigation Strategies</h4>
                  <ul className="text-sm space-y-1 ml-4 list-disc">
                    <li><strong>Email Security:</strong> Implement advanced threat protection and user training</li>
                    <li><strong>Patch Management:</strong> Establish automated update procedures</li>
                    <li><strong>Access Controls:</strong> Deploy multi-factor authentication and least privilege access</li>
                    <li><strong>Data Protection:</strong> Implement encryption at rest and in transit</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Implementation Steps</h4>
                  <ol className="text-sm space-y-2 ml-4 list-decimal">
                    <li><strong>Phase 1 (0-30 days):</strong> Deploy critical security controls and conduct staff training</li>
                    <li><strong>Phase 2 (30-90 days):</strong> Implement comprehensive monitoring and incident response</li>
                    <li><strong>Phase 3 (90-180 days):</strong> Achieve compliance certification and establish continuous improvement</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CyberLockX Logo and Branding */}
        <div className="mt-8 text-center border-t pt-6">
          <img src={logoImage} alt="CyberLockX Logo" className="h-12 mx-auto mb-2" />
          <p className="text-sm font-semibold text-primary">Securing every CLICK!!!</p>
          <p className="text-xs text-muted-foreground">Healthcare Apps & Devices Security Hub</p>
        </div>
      </div>
    </>
  );
};
