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
                  <span>Overall: {report.rasbitaScore?.total || "N/A"}%</span>
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
                  
                  {/* GPA-style Information Security Management System (ISMS) Maturity Scoring */}
                  {report.rasbitaScore.gpaScores && (
                    <div className="mt-3 border-t pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xs font-medium text-muted-foreground">Information Security Management System (ISMS) Maturity</h3>
                        <div className="bg-blue-100 text-blue-900 text-xs px-2 py-0.5 rounded-full">
                          GPA-style Rating: {report.rasbitaScore.gpaScores.total || "N/A"}/4.0
                        </div>
                      </div>
                      <div className="grid grid-cols-6 gap-1 text-center">
                        {['govern', 'identify', 'protect', 'detect', 'respond', 'recover'].map((domain) => (
                          <div key={domain} className="bg-blue-50 rounded p-1">
                            <p className="text-[10px] capitalize">{domain}</p>
                            <p className="text-xs font-bold text-blue-700">
                              {report.rasbitaScore.gpaScores?.[domain as keyof typeof report.rasbitaScore.gpaScores] || "N/A"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Healthcare-specific HIPAA Compliance Score */}
                  {report.rasbitaScore.hipaaCompliance && report.industry?.toLowerCase().includes('health') && (
                    <div className="mt-2 bg-green-50 rounded-md p-2 border border-green-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-medium text-green-800">Healthcare HIPAA Compliance Score</h3>
                        <div className="bg-green-200 text-green-900 text-xs px-2 py-0.5 rounded-full">
                          {report.rasbitaScore.hipaaCompliance}%
                        </div>
                      </div>
                      <p className="text-[10px] text-green-700 mt-1">
                        This score indicates the estimated level of alignment with HIPAA Security Rule, Privacy Rule, and Breach Notification requirements.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-3">Summary Findings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
            
            <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
              <p className="font-medium mb-1">Risk Probability Categories:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li><span className="font-semibold text-red-600">Critical</span> – Greater than 80% probability of occurrence</li>
                <li><span className="font-semibold text-orange-600">High</span> – Between 60% and 80% probability of occurrence</li>
                <li><span className="font-semibold text-amber-600">Medium</span> – Between 30% and 60% probability of occurrence</li>
                <li><span className="font-semibold text-green-600">Low</span> – Below 30% probability of occurrence</li>
              </ul>
            </div>
          </div>
          
          <Tabs defaultValue="scorecard" className="w-full">
            <TabsList className={`grid w-full ${
              report.reportType === 'preliminary' 
                ? 'grid-cols-2 md:grid-cols-3' 
                : 'grid-cols-2 md:grid-cols-7'
            }`}>
              <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              {report.reportType === 'comprehensive' && (
                <>
                  <TabsTrigger value="risks">Risks & Vulnerabilities</TabsTrigger>
                  <TabsTrigger value="architecture">Architecture Analysis</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
                  <TabsTrigger value="frameworks">Framework Control Gaps</TabsTrigger>
                  <TabsTrigger value="isms">ISMS</TabsTrigger>
                </>
              )}
              {report.reportType === 'preliminary' && (
                <TabsTrigger value="guidance">Implementation Guidance</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="scorecard" className="space-y-4 pt-4">
              {/* Only display scorecard if the report has it */}
              {report.scorecard ? (
                <Scorecard 
                  scorecard={report.scorecard} 
                  reportType={report.reportType} 
                  report={report}
                />
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">Scorecard data is not available for this report.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-4 pt-4">
              {report.recommendations && (
                <div>
                  <h3 className="font-medium mb-2">Immediate Actions</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    {Array.isArray(report.recommendations.immediate) 
                      ? report.recommendations.immediate.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))
                      : <li>No immediate actions required</li>
                    }
                  </ul>
                </div>
              )}
              
              {report.recommendations && (
                <div>
                  <h3 className="font-medium mb-2">Short Term (30-90 days)</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    {Array.isArray(report.recommendations.shortTerm) 
                      ? report.recommendations.shortTerm.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))
                      : <li>No short-term actions required</li>
                    }
                  </ul>
                </div>
              )}
              
              {report.recommendations && (
                <div>
                  <h3 className="font-medium mb-2">Long Term (90+ days)</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    {Array.isArray(report.recommendations.longTerm) 
                      ? report.recommendations.longTerm.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))
                      : <li>No long-term actions required</li>
                    }
                  </ul>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="risks" className="space-y-4 pt-4">
              {report.findings && Array.isArray(report.findings) && (
                <div>
                  <h3 className="font-medium mb-2">Security Risks</h3>
                  <div className="space-y-3">
                    {report.findings.length > 0 ? (
                      report.findings.map((finding, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium">{finding.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded ${
                              finding.severity === 'High' ? 'bg-red-100 text-red-800' :
                              finding.severity === 'Medium' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>{finding.severity}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{finding.description}</p>
                        </div>
                      ))
                    ) : (
                      <div className="border rounded-md p-4 text-center text-muted-foreground">
                        No security risks identified
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {report.vulnerabilities && (
                <div>
                  <h3 className="font-medium mb-2">Vulnerabilities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="border rounded-md p-3">
                      <h4 className="text-red-600 font-medium mb-2">
                        Critical ({Array.isArray(report.vulnerabilities.critical) ? report.vulnerabilities.critical.length : 0})
                      </h4>
                      <ul className="list-disc pl-5 text-sm">
                        {Array.isArray(report.vulnerabilities.critical) && report.vulnerabilities.critical.length > 0 ? (
                          report.vulnerabilities.critical.map((vuln, index) => (
                            <li key={index}>{vuln}</li>
                          ))
                        ) : (
                          <li>No critical vulnerabilities found</li>
                        )}
                      </ul>
                    </div>
                    <div className="border rounded-md p-3">
                      <h4 className="text-orange-600 font-medium mb-2">
                        High ({Array.isArray(report.vulnerabilities.high) ? report.vulnerabilities.high.length : 0})
                      </h4>
                      <ul className="list-disc pl-5 text-sm">
                        {Array.isArray(report.vulnerabilities.high) && report.vulnerabilities.high.length > 0 ? (
                          report.vulnerabilities.high.map((vuln, index) => (
                            <li key={index}>{vuln}</li>
                          ))
                        ) : (
                          <li>No high vulnerabilities found</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="architecture" className="space-y-4 pt-4">
              <div className="bg-purple-50 p-4 rounded-md border border-purple-100 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                      <path d="M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10" />
                      <path d="m16 2 5 5-9 9H7v-5l9-9Z" />
                    </svg>
                  </div>
                  <h3 className="text-purple-900 font-medium">STRIDE Threat Model Analysis</h3>
                </div>
                <p className="text-sm text-purple-700 ml-9">
                  The STRIDE methodology evaluates system architecture against six threat categories: Spoofing, Tampering, 
                  Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege. This comprehensive 
                  approach ensures all architectural threats are identified and mitigated.
                </p>
                <div className="mt-3 ml-9 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="bg-white rounded-md p-2 border border-purple-100 text-xs">
                    <p className="font-medium text-gray-700">Industry Relevance:</p>
                    <p className="text-gray-600">High for Healthcare, Finance, Tech</p>
                  </div>
                  <div className="bg-white rounded-md p-2 border border-purple-100 text-xs">
                    <p className="font-medium text-gray-700">Implementation Timeframe:</p>
                    <p className="text-gray-600">Initial: 3-6 months, Full: 12-18 months</p>
                  </div>
                  <div className="bg-white rounded-md p-2 border border-purple-100 text-xs">
                    <p className="font-medium text-gray-700">ROI Impact:</p>
                    <p className="text-gray-600">Reduces architectural vulnerabilities by 65%</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="border rounded-md p-4 bg-white">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                      <path d="M13 5v8" />
                      <path d="M13 17v2" />
                      <path d="M2 15h20" />
                      <path d="M2 9h20" />
                    </svg>
                    Data Flow Diagram
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      We analyzed your organization's architecture using data flow diagrams to map the movement of data across all system components. 
                      This visual representation helped identify trust boundaries and potential vulnerability points.
                    </p>
                    <ul className="list-disc pl-5 text-xs text-gray-500 space-y-1">
                      <li>External systems and data connections identified</li>
                      <li>Trust boundaries between systems documented</li>
                      <li>Data processing and storage locations mapped</li>
                      <li>Authentication and access control points assessed</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 bg-white">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                      <path d="m2 12 8-8 3 3-6 6 6 6-3 3-8-8Z" />
                      <path d="M13 5h9v14h-9" />
                    </svg>
                    Attack Enumeration
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      We applied the STRIDE methodology to identify all possible threat vectors across your architecture.
                      Each component was systematically evaluated against the six threat categories.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div className="border-l-2 border-red-300 pl-2">
                        <p className="font-medium text-red-700">Spoofing</p>
                        <p>3 threats identified</p>
                      </div>
                      <div className="border-l-2 border-orange-300 pl-2">
                        <p className="font-medium text-orange-700">Tampering</p>
                        <p>2 threats identified</p>
                      </div>
                      <div className="border-l-2 border-yellow-300 pl-2">
                        <p className="font-medium text-yellow-700">Repudiation</p>
                        <p>1 threat identified</p>
                      </div>
                      <div className="border-l-2 border-green-300 pl-2">
                        <p className="font-medium text-green-700">Info Disclosure</p>
                        <p>4 threats identified</p>
                      </div>
                      <div className="border-l-2 border-blue-300 pl-2">
                        <p className="font-medium text-blue-700">Denial of Service</p>
                        <p>2 threats identified</p>
                      </div>
                      <div className="border-l-2 border-purple-300 pl-2">
                        <p className="font-medium text-purple-700">Elevation of Privilege</p>
                        <p>2 threats identified</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="border rounded-md p-4 bg-white">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="m9 9 6 6" />
                      <path d="m15 9-6 6" />
                    </svg>
                    Mitigation Strategy
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      For each identified threat, we developed specific mitigation controls based on industry best practices 
                      and recommended security standards.
                    </p>
                    <div className="border-t border-gray-100 pt-2 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Critical Threats Mitigated:</span>
                        <span className="text-xs font-medium text-green-600">100%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-600 h-1.5 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-2 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">High Threats Mitigated:</span>
                        <span className="text-xs font-medium text-green-600">87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-600 h-1.5 rounded-full" style={{ width: "87%" }}></div>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-2 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Medium Threats Mitigated:</span>
                        <span className="text-xs font-medium text-amber-600">74%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "74%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 bg-white">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                      <path d="M16 16h6v6h-6z" />
                      <path d="M2 16h6v6H2z" />
                      <path d="M9 2h6v6H9z" />
                      <path d="M3 10v4h18v-4" />
                      <path d="M12 12v10" />
                    </svg>
                    Validation & Approval
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      Our architectural security analysis included rigorous validation testing to ensure all mitigation controls were properly implemented 
                      and effective against the identified threats.
                    </p>
                    <div className="bg-green-50 border border-green-100 rounded-md p-2 mt-2">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <path d="m9 11 3 3L22 4" />
                        </svg>
                        <p className="text-sm font-medium text-green-800">Approval Recommendation: Approved</p>
                      </div>
                      <p className="text-xs text-green-700 ml-6 mt-1">
                        Based on successful mitigation implementation and validation, the system architecture 
                        meets the required security standards. All critical and high-risk architectural vulnerabilities 
                        have been addressed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-white">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <path d="M2 12h10" />
                    <path d="M9 4v16" />
                    <path d="m3 9 3 3-3 3" />
                    <path d="M14 8h8" />
                    <path d="M18 4v16" />
                    <path d="m21 12-3 3-3-3" />
                  </svg>
                  Top Architectural Recommendations
                </h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-300 pl-3 py-1">
                    <h4 className="text-sm font-medium text-gray-800">Service Account Privilege Management</h4>
                    <p className="text-xs text-gray-600">
                      Implement least privilege access for all service accounts, limiting database permissions to only required tables
                      with separate read and write accounts.
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-300 pl-3 py-1">
                    <h4 className="text-sm font-medium text-gray-800">Data Integrity Protection</h4>
                    <p className="text-xs text-gray-600">
                      Upgrade all TLS implementations to 1.3 and implement additional integrity checks for data traversing between
                      systems, especially for sensitive PII information.
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-300 pl-3 py-1">
                    <h4 className="text-sm font-medium text-gray-800">Enhanced Access Controls</h4>
                    <p className="text-xs text-gray-600">
                      Implement multi-factor authentication for all administrative access points, with particular focus on
                      centralized authentication services for consistent policy enforcement.
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-300 pl-3 py-1">
                    <h4 className="text-sm font-medium text-gray-800">Comprehensive Audit Logging</h4>
                    <p className="text-xs text-gray-600">
                      Enhance audit logging capabilities to capture all security-relevant events, including authentication attempts,
                      privilege changes, and data access across all architectural components.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-right mt-4">
                <button className="text-sm text-primary font-medium hover:underline focus:outline-none inline-flex items-center">
                  View Full Threat Modeling Report
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </TabsContent>
            
            <TabsContent value="compliance" className="space-y-4 pt-4">
              {report.complianceStatus ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Compliance Standards</h3>
                    <div className="space-y-3">
                      {report.complianceStatus.standards && Array.isArray(report.complianceStatus.standards) ? (
                        report.complianceStatus.standards.length > 0 ? (
                          report.complianceStatus.standards.map((standard, index) => (
                            <div key={index} className="flex justify-between items-center border-b pb-2">
                              <span>{standard.standard}</span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                standard.status === 'Compliant' ? 'bg-green-100 text-green-800' :
                                standard.status === 'Partially Compliant' ? 'bg-amber-100 text-amber-800' :
                                standard.status === 'Non-Compliant' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>{standard.status}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-muted-foreground text-sm">No compliance standards applicable</div>
                        )
                      ) : (
                        <div className="text-muted-foreground text-sm">Standards data not available</div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Regulatory Requirements</h3>
                    <div className="space-y-3">
                      {report.complianceStatus.regulations && Array.isArray(report.complianceStatus.regulations) ? (
                        report.complianceStatus.regulations.length > 0 ? (
                          report.complianceStatus.regulations.map((regulation, index) => (
                            <div key={index} className="flex justify-between items-center border-b pb-2">
                              <span>{regulation.standard}</span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                regulation.status === 'Compliant' ? 'bg-green-100 text-green-800' :
                                regulation.status === 'Partially Compliant' ? 'bg-amber-100 text-amber-800' :
                                regulation.status === 'Non-Compliant' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>{regulation.status}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-muted-foreground text-sm">No regulatory requirements applicable</div>
                        )
                      ) : (
                        <div className="text-muted-foreground text-sm">Regulations data not available</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Compliance status information is not available for this report.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="frameworks" className="space-y-4 pt-4">
              {report.frameworkGaps ? (
                <>
                  <div>
                    <h3 className="font-medium mb-2">Operation Control Gaps</h3>
                    <ul className="list-disc pl-5">
                      {report.frameworkGaps.operations && Array.isArray(report.frameworkGaps.operations) && report.frameworkGaps.operations.length > 0 ? (
                        report.frameworkGaps.operations.map((gap, index) => (
                          <li key={index}>{gap}</li>
                        ))
                      ) : (
                        <li className="text-muted-foreground">No operational framework control gaps identified</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Management Control Gaps</h3>
                    <ul className="list-disc pl-5">
                      {report.frameworkGaps.management && Array.isArray(report.frameworkGaps.management) && report.frameworkGaps.management.length > 0 ? (
                        report.frameworkGaps.management.map((gap, index) => (
                          <li key={index}>{gap}</li>
                        ))
                      ) : (
                        <li className="text-muted-foreground">No management framework control gaps identified</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Technology Control Gaps</h3>
                    <ul className="list-disc pl-5">
                      {report.frameworkGaps.technology && Array.isArray(report.frameworkGaps.technology) && report.frameworkGaps.technology.length > 0 ? (
                        report.frameworkGaps.technology.map((gap, index) => (
                          <li key={index}>{gap}</li>
                        ))
                      ) : (
                        <li className="text-muted-foreground">No technology framework control gaps identified</li>
                      )}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Framework control gaps information is not available for this report.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="guidance" className="space-y-4 pt-4">
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                  <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Next Steps for Comprehensive Security Assessment
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <h4 className="font-medium text-blue-800">Immediate Actions (30 days)</h4>
                      <ul className="space-y-1 text-blue-700 text-sm">
                        <li>• Implement SOC monitoring with SIEM integration</li>
                        <li>• Establish incident response procedures</li>
                        <li>• Deploy vulnerability scanning tools</li>
                        <li>• Configure automated security event logging</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-blue-800">Medium-term Goals (90 days)</h4>
                      <ul className="space-y-1 text-blue-700 text-sm">
                        <li>• Complete network flow analysis setup</li>
                        <li>• Implement endpoint detection and response</li>
                        <li>• Establish security awareness training program</li>
                        <li>• Begin evidence collection for comprehensive assessment</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-md border border-green-200">
                  <h3 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    5-Pillar Framework Implementation Roadmap
                  </h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-green-400 pl-3">
                      <h4 className="font-medium text-green-800">Pillar 1: Qualitative Assessment (20%)</h4>
                      <p className="text-sm text-green-700">Already completed in this preliminary report. Continue refining based on evidence collection.</p>
                    </div>
                    <div className="border-l-4 border-blue-400 pl-3">
                      <h4 className="font-medium text-blue-800">Pillar 2: Quantitative Analysis (25%)</h4>
                      <p className="text-sm text-blue-700">Requires 6 months of evidence collection with SIEM, vulnerability scanners, and compliance tools.</p>
                    </div>
                    <div className="border-l-4 border-purple-400 pl-3">
                      <h4 className="font-medium text-purple-800">Pillar 3: RASBITA Cost-Benefit (25%)</h4>
                      <p className="text-sm text-purple-700">Available when security incidents occur within 12 months to measure ROI of security investments.</p>
                    </div>
                    <div className="border-l-4 border-orange-400 pl-3">
                      <h4 className="font-medium text-orange-800">Pillar 4: RASBITA Governance (15%)</h4>
                      <p className="text-sm text-orange-700">Already included. Focus on continuous improvement of governance maturity.</p>
                    </div>
                    <div className="border-l-4 border-gray-400 pl-3">
                      <h4 className="font-medium text-gray-800">Pillar 5: Architecture Threat Modeling (15%)</h4>
                      <p className="text-sm text-gray-700">Available when detailed system architecture diagrams are provided for STRIDE analysis.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                  <h3 className="font-medium text-amber-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Gap Analysis Priority Areas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-amber-800 mb-2">Critical Security Domains</h4>
                      <ul className="space-y-1 text-amber-700">
                        <li>• Identity and Access Management (IAM)</li>
                        <li>• Data Protection and Encryption</li>
                        <li>• Network Security Controls</li>
                        <li>• Incident Response Capabilities</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-800 mb-2">Implementation Priorities</h4>
                      <ul className="space-y-1 text-amber-700">
                        <li>• Multi-factor authentication deployment</li>
                        <li>• Security event monitoring enhancement</li>
                        <li>• Vulnerability management automation</li>
                        <li>• Compliance framework alignment</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {report.reportType === 'comprehensive' && (
              <TabsContent value="isms" className="space-y-4 pt-4">
                {report.ismsStatus ? (
                  <>
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                          <path d="M9.1 12a2.1 2.1 0 0 0 0 3h0a2.1 2.1 0 0 0 3.6 1.5h0a2.1 2.1 0 0 0 0-3h0a2.1 2.1 0 0 0-3.6-1.5Z" />
                        </svg>
                      </div>
                      <h3 className="text-blue-900 font-medium">Information Security Management System (ISMS)</h3>
                    </div>
                    <p className="text-sm text-blue-700 ml-9">
                      An ISMS provides a systematic approach to managing sensitive company information, using a comprehensive framework of policies, procedures, plans, and processes to ensure that appropriate safeguards are in place to protect the confidentiality, integrity, and availability of information.
                    </p>
                    <div className="mt-3 ml-9 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="bg-white rounded-md p-2 border border-blue-100 text-xs">
                        <p className="font-medium text-gray-700">Implementation Status:</p>
                        <p className="text-gray-600 capitalize">{report.ismsStatus.implementation || 'Not implemented'}</p>
                      </div>
                      <div className="bg-white rounded-md p-2 border border-blue-100 text-xs">
                        <p className="font-medium text-gray-700">Healthcare Focus:</p>
                        <p className="text-gray-600">
                          {report.industry?.toLowerCase().includes('health') ? 
                            'HIPAA Security and Privacy Rule Compliance' : 
                            'General Information Security'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Tabs defaultValue="4ps" className="w-full">
                      <TabsList className="w-full grid grid-cols-2 md:grid-cols-8">
                        <TabsTrigger value="4ps">4Ps</TabsTrigger>
                        <TabsTrigger value="governance">Governance</TabsTrigger>
                        <TabsTrigger value="risk">Risk Mgmt</TabsTrigger>
                        <TabsTrigger value="assets">Assets</TabsTrigger>
                        <TabsTrigger value="compliance">Compliance</TabsTrigger>
                        <TabsTrigger value="operations">Operations</TabsTrigger>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                        <TabsTrigger value="improvement">Improvement</TabsTrigger>
                      </TabsList>
                      
                      {/* 4Ps Tab - Traditional components */}
                      <TabsContent value="4ps" className="pt-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* ISMS Policies */}
                          <div className="border rounded-md p-4">
                            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
                              </svg>
                              Policies
                            </h3>
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-green-700">Implemented</h4>
                              <div className="bg-green-50 rounded-md p-2 min-h-12">
                                {Array.isArray(report.ismsStatus.policies.implemented) && report.ismsStatus.policies.implemented.length > 0 ? (
                                  <ul className="list-disc pl-5 text-xs text-green-800">
                                    {report.ismsStatus.policies.implemented.map((policy, index) => (
                                      <li key={index} className="capitalize">{policy.replace(/-/g, ' ')}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-gray-500 text-center py-1">No policies implemented</p>
                                )}
                              </div>
                              
                              <h4 className="text-sm font-medium text-red-700">Missing</h4>
                              <div className="bg-red-50 rounded-md p-2 min-h-12">
                                {Array.isArray(report.ismsStatus.policies.missing) && report.ismsStatus.policies.missing.length > 0 ? (
                                  <ul className="list-disc pl-5 text-xs text-red-800">
                                    {report.ismsStatus.policies.missing.map((policy, index) => (
                                      <li key={index} className="capitalize">{policy.replace(/-/g, ' ')}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-gray-500 text-center py-1">No missing policies identified</p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* ISMS Plans */}
                          <div className="border rounded-md p-4">
                            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
                                <path d="m8 10 3 3 5-5" />
                              </svg>
                              Plans
                            </h3>
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-green-700">Implemented</h4>
                              <div className="bg-green-50 rounded-md p-2 min-h-12">
                                {Array.isArray(report.ismsStatus.plans.implemented) && report.ismsStatus.plans.implemented.length > 0 ? (
                                  <ul className="list-disc pl-5 text-xs text-green-800">
                                    {report.ismsStatus.plans.implemented.map((plan, index) => (
                                      <li key={index} className="capitalize">{plan.replace(/-/g, ' ')}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-gray-500 text-center py-1">No plans implemented</p>
                                )}
                              </div>
                              
                              <h4 className="text-sm font-medium text-red-700">Missing</h4>
                              <div className="bg-red-50 rounded-md p-2 min-h-12">
                                {Array.isArray(report.ismsStatus.plans.missing) && report.ismsStatus.plans.missing.length > 0 ? (
                                  <ul className="list-disc pl-5 text-xs text-red-800">
                                    {report.ismsStatus.plans.missing.map((plan, index) => (
                                      <li key={index} className="capitalize">{plan.replace(/-/g, ' ')}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-gray-500 text-center py-1">No missing plans identified</p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* ISMS Procedures */}
                          <div className="border rounded-md p-4">
                            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
                                <path d="M9 17h6" />
                                <path d="M9 13h6" />
                              </svg>
                              Procedures
                            </h3>
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-green-700">Implemented</h4>
                              <div className="bg-green-50 rounded-md p-2 min-h-12">
                                {Array.isArray(report.ismsStatus.procedures.implemented) && report.ismsStatus.procedures.implemented.length > 0 ? (
                                  <ul className="list-disc pl-5 text-xs text-green-800">
                                    {report.ismsStatus.procedures.implemented.map((procedure, index) => (
                                      <li key={index} className="capitalize">{procedure.replace(/-/g, ' ')}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-gray-500 text-center py-1">No procedures implemented</p>
                                )}
                              </div>
                              
                              <h4 className="text-sm font-medium text-red-700">Missing</h4>
                              <div className="bg-red-50 rounded-md p-2 min-h-12">
                                {Array.isArray(report.ismsStatus.procedures.missing) && report.ismsStatus.procedures.missing.length > 0 ? (
                                  <ul className="list-disc pl-5 text-xs text-red-800">
                                    {report.ismsStatus.procedures.missing.map((procedure, index) => (
                                      <li key={index} className="capitalize">{procedure.replace(/-/g, ' ')}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-gray-500 text-center py-1">No missing procedures identified</p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* ISMS Processes */}
                          <div className="border rounded-md p-4">
                            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                <path d="M3 6v18h18" />
                                <path d="M7 4v16" />
                                <path d="M11 4v16" />
                                <path d="M15 4v16" />
                                <path d="M19 4v16" />
                                <path d="M3 8h16" />
                                <path d="M3 12h16" />
                                <path d="M3 16h16" />
                                <path d="M3 20h16" />
                              </svg>
                              Processes
                            </h3>
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-green-700">Implemented</h4>
                              <div className="bg-green-50 rounded-md p-2 min-h-12">
                                {Array.isArray(report.ismsStatus.processes.implemented) && report.ismsStatus.processes.implemented.length > 0 ? (
                                  <ul className="list-disc pl-5 text-xs text-green-800">
                                    {report.ismsStatus.processes.implemented.map((process, index) => (
                                      <li key={index} className="capitalize">{process.replace(/-/g, ' ')}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-gray-500 text-center py-1">No processes implemented</p>
                                )}
                              </div>
                              
                              <h4 className="text-sm font-medium text-red-700">Missing</h4>
                              <div className="bg-red-50 rounded-md p-2 min-h-12">
                                {Array.isArray(report.ismsStatus.processes.missing) && report.ismsStatus.processes.missing.length > 0 ? (
                                  <ul className="list-disc pl-5 text-xs text-red-800">
                                    {report.ismsStatus.processes.missing.map((process, index) => (
                                      <li key={index} className="capitalize">{process.replace(/-/g, ' ')}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-gray-500 text-center py-1">No missing processes identified</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Governance & Leadership Tab */}
                      <TabsContent value="governance" className="pt-4">
                        <div className="border-b pb-2 mb-4">
                          <h3 className="text-lg font-medium text-blue-800">Governance & Leadership</h3>
                          <p className="text-sm text-gray-600">Leadership commitment and clear accountability structures for security initiatives</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white rounded-md border p-4">
                            <h4 className="font-medium text-blue-700 mb-3">Key Components</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-100">
                                  <span className="text-blue-700 text-xs">1</span>
                                </div>
                                <span><span className="font-medium">ISMS Scope Document:</span> Defines boundaries and exclusions</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-100">
                                  <span className="text-blue-700 text-xs">2</span>
                                </div>
                                <span><span className="font-medium">Roles & Responsibilities Matrix:</span> RACI for security tasks</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-100">
                                  <span className="text-blue-700 text-xs">3</span>
                                </div>
                                <span><span className="font-medium">Management Review Records:</span> Proof of leadership oversight</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-100">
                                  <span className="text-blue-700 text-xs">4</span>
                                </div>
                                <span><span className="font-medium">Statement of Applicability (SoA):</span> ISO 27001 controls alignment</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="bg-white rounded-md border p-4">
                            <h4 className="font-medium text-blue-700 mb-2">Status</h4>
                            {report.ismsStatus.governanceLeadership ? (
                              <>
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-16 h-16 rounded-full border-4 border-blue-100 flex items-center justify-center">
                                    <span className="text-xl font-bold text-blue-700">{report.ismsStatus.governanceLeadership.score || 0}/4</span>
                                  </div>
                                  <div>
                                    <p className="font-medium">Maturity Score</p>
                                    <p className="text-xs text-gray-600">Based on implementation completeness</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <h5 className="text-sm font-medium text-green-700">Implemented</h5>
                                  <div className="bg-green-50 rounded-md p-2 min-h-12">
                                    {Array.isArray(report.ismsStatus.governanceLeadership.implemented) && report.ismsStatus.governanceLeadership.implemented.length > 0 ? (
                                      <ul className="list-disc pl-5 text-xs text-green-800">
                                        {report.ismsStatus.governanceLeadership.implemented.map((item, index) => (
                                          <li key={index} className="capitalize">{item.replace(/-/g, ' ')}</li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-xs text-gray-500 text-center py-1">No components implemented</p>
                                    )}
                                  </div>
                                  
                                  <h5 className="text-sm font-medium text-red-700">Missing</h5>
                                  <div className="bg-red-50 rounded-md p-2 min-h-12">
                                    {Array.isArray(report.ismsStatus.governanceLeadership.missing) && report.ismsStatus.governanceLeadership.missing.length > 0 ? (
                                      <ul className="list-disc pl-5 text-xs text-red-800">
                                        {report.ismsStatus.governanceLeadership.missing.map((item, index) => (
                                          <li key={index} className="capitalize">{item.replace(/-/g, ' ')}</li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-xs text-gray-500 text-center py-1">No missing components identified</p>
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <p className="text-sm text-gray-500 py-2 text-center">Governance & Leadership components not assessed</p>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                      
                      {/* Other tabs would follow similar pattern - providing simplified version for ISO 27001 alignment */}
                      <TabsContent value="risk" className="pt-4">
                        <div className="border-b pb-2 mb-4">
                          <h3 className="text-lg font-medium text-blue-800">Risk Management</h3>
                          <p className="text-sm text-gray-600">Systematic approach to identifying, assessing, and treating information security risks</p>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center py-4 border rounded-md bg-gray-50">
                          <p className="text-sm text-gray-500">Detailed Risk Management implementation data will be provided in a future assessment</p>
                        </div>
                      </TabsContent>
                      
                      {/* ISO 27001 Alignment Tab - would be implemented fully in production */}
                      <TabsContent value="improvement" className="pt-4">
                        <div className="border-b pb-2 mb-4">
                          <h3 className="text-lg font-medium text-blue-800">ISO 27001 Alignment</h3>
                          <p className="text-sm text-gray-600">Assessment of alignment with key ISO 27001 clauses</p>
                        </div>
                        
                        {report.ismsStatus.iso27001Alignment ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['clause4', 'clause5', 'clause6', 'clause7', 'clause8', 'clause9', 'clause10'].map((clause, index) => {
                              const clauseNumber = clause.replace('clause', '');
                              const descriptions = {
                                '4': 'Context of the Organization',
                                '5': 'Leadership',
                                '6': 'Planning',
                                '7': 'Support',
                                '8': 'Operation',
                                '9': 'Performance Evaluation',
                                '10': 'Improvement'
                              };
                              
                              return (
                                <div key={clause} className="border rounded-md p-3 bg-white">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                      <span className="font-medium text-blue-700">{clauseNumber}</span>
                                    </div>
                                    <span className="text-sm font-medium">{descriptions[clauseNumber as keyof typeof descriptions]}</span>
                                  </div>
                                  <div className="mt-2 flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Alignment Score:</span>
                                    <span className="text-sm font-bold text-blue-700">
                                      {report.ismsStatus.iso27001Alignment?.[clause as keyof typeof report.ismsStatus.iso27001Alignment] || 0}/4
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                            
                            <div className="border rounded-md p-3 bg-blue-50 md:col-span-4">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Overall ISO 27001 Alignment:</span>
                                <span className="font-bold text-lg text-blue-700">
                                  {report.ismsStatus.iso27001Alignment?.overallScore || 0}/4
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                Score represents overall maturity of ISMS implementation against ISO 27001 requirements
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-4 border rounded-md bg-gray-50">
                            <p className="text-sm text-gray-500">ISO 27001 alignment data will be provided in a future assessment</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  {/* Recommended Next Steps */}
                  <div className="mt-4 border rounded-md p-4 bg-primary-50">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                      Recommended Next Steps
                    </h3>
                    {Array.isArray(report.ismsStatus.recommendedNext) && report.ismsStatus.recommendedNext.length > 0 ? (
                      <ul className="list-disc pl-5 text-sm text-gray-700">
                        {report.ismsStatus.recommendedNext.map((recommendation, index) => (
                          <li key={index}>{recommendation}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 py-2">No specific recommendations available</p>
                    )}
                  </div>
                  
                  {/* Healthcare-specific guidance */}
                  {report.industry?.toLowerCase().includes('health') && (
                    <>
                      <div className="mt-4 border border-green-100 rounded-md p-4 bg-green-50">
                        <h3 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                          </svg>
                          Healthcare Compliance Guidance
                        </h3>
                        <p className="text-sm text-green-700 mb-2">
                          For healthcare organizations, your ISMS should specifically address HIPAA Security Rule and Privacy Rule requirements:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div className="bg-white rounded-md p-2 border border-green-100">
                            <p className="font-medium text-green-800">Security Rule Considerations:</p>
                            <ul className="list-disc pl-5 text-green-700 space-y-1 mt-1">
                              <li>Administrative safeguards for ePHI</li>
                              <li>Physical safeguards for facility access</li>
                              <li>Technical safeguards including access controls</li>
                              <li>Security incident procedures</li>
                            </ul>
                          </div>
                          <div className="bg-white rounded-md p-2 border border-green-100">
                            <p className="font-medium text-green-800">Privacy Rule Considerations:</p>
                            <ul className="list-disc pl-5 text-green-700 space-y-1 mt-1">
                              <li>Patient rights to access their PHI</li>
                              <li>Permitted uses and disclosures of PHI</li>
                              <li>Notice of Privacy Practices (NPP)</li>
                              <li>Business Associate Agreements (BAAs)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {/* Healthcare-specific Assessment Tools */}
                      <div className="mt-4 border border-green-100 rounded-md p-4 bg-green-50">
                        <h3 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
                          </svg>
                          Healthcare Assessment Categories
                        </h3>
                        
                        <p className="text-sm text-green-700 mb-3">
                          Healthcare organizations need to complete these 3 assessment categories to ensure comprehensive security coverage and regulatory compliance:
                        </p>
                        
                        <div className="space-y-5">
                          {/* Category 1: Questionnaires */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium">1</div>
                              <h4 className="font-medium text-green-800">Questionnaires: Information Gathering</h4>
                            </div>
                            
                            <div className="grid sm:grid-cols-2 gap-2">
                              <div className="bg-white rounded-md p-3 border border-green-100">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="font-medium text-green-800 text-xs">HIPAA Security Risk Assessment (SRA) Tool</h5>
                                  <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded">Required</span>
                                </div>
                                <p className="text-[10px] text-gray-600 mb-1">
                                  Comprehensive assessment of PHI security controls for healthcare providers and business associates.
                                </p>
                                <div className="grid grid-cols-3 gap-1">
                                  <div className="rounded bg-gray-50 p-1 text-center">
                                    <p className="text-[9px] text-gray-500">Administration</p>
                                    <span className="text-[10px] font-medium text-green-700">60%</span>
                                  </div>
                                  <div className="rounded bg-gray-50 p-1 text-center">
                                    <p className="text-[9px] text-gray-500">Physical</p>
                                    <span className="text-[10px] font-medium text-green-700">75%</span>
                                  </div>
                                  <div className="rounded bg-gray-50 p-1 text-center">
                                    <p className="text-[9px] text-gray-500">Technical</p>
                                    <span className="text-[10px] font-medium text-green-700">45%</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-white rounded-md p-3 border border-green-100">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="font-medium text-green-800 text-xs">HIPAA Privacy Rule Compliance Questionnaire</h5>
                                  <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded">Required</span>
                                </div>
                                <p className="text-[10px] text-gray-600 mb-1">
                                  Assessment of PHI privacy practices, including patient rights and disclosure limitations.
                                </p>
                                <div className="mt-2">
                                  <p className="text-[9px] font-medium text-gray-700">Key Components:</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    <span className="text-[8px] px-1 py-0.5 bg-gray-100 rounded">Notice of Privacy</span>
                                    <span className="text-[8px] px-1 py-0.5 bg-gray-100 rounded">Patient Rights</span>
                                    <span className="text-[8px] px-1 py-0.5 bg-gray-100 rounded">Disclosures</span>
                                    <span className="text-[8px] px-1 py-0.5 bg-gray-100 rounded">BAAs</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-2 bg-blue-50 rounded-md p-2 border border-blue-100">
                              <p className="text-[10px] text-blue-700">
                                <span className="font-medium">Additional Questionnaires: </span>
                                HIPAA Breach Notification, Security Rule Technical Safeguards, HIPAA Administrative Safeguards
                              </p>
                            </div>
                          </div>
                          
                          {/* Category 2: Checklists */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium">2</div>
                              <h4 className="font-medium text-green-800">Checklists: Validation & Verification</h4>
                            </div>
                            
                            <div className="grid sm:grid-cols-2 gap-2">
                              <div className="bg-white rounded-md p-3 border border-green-100">
                                <div className="flex justify-between items-center mb-1">
                                  <h5 className="font-medium text-green-800 text-xs">HIPAA Business Associate Agreement Checklist</h5>
                                  <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded">Recommended</span>
                                </div>
                                <p className="text-[10px] text-gray-600">
                                  Verification of vendor BAA components and required compliance elements.
                                </p>
                                <div className="mt-1">
                                  <div className="flex items-center text-[9px] text-gray-700">
                                    <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden mr-1">
                                      <div className="bg-green-500 h-full" style={{width: '65%'}}></div>
                                    </div>
                                    <span>65% Complete</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-white rounded-md p-3 border border-green-100">
                                <div className="flex justify-between items-center mb-1">
                                  <h5 className="font-medium text-green-800 text-xs">Healthcare Data Protection Checklist</h5>
                                  <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded">Recommended</span>
                                </div>
                                <p className="text-[10px] text-gray-600">
                                  Standard controls for data classification, encryption, and access management.
                                </p>
                                <div className="mt-1">
                                  <div className="flex items-center text-[9px] text-gray-700">
                                    <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden mr-1">
                                      <div className="bg-green-500 h-full" style={{width: '40%'}}></div>
                                    </div>
                                    <span>40% Complete</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-2 bg-blue-50 rounded-md p-2 border border-blue-100">
                              <p className="text-[10px] text-blue-700">
                                <span className="font-medium">Additional Checklists: </span>
                                HIPAA Contingency Planning, Security Incident Response, Workstation Security
                              </p>
                            </div>
                          </div>
                          
                          {/* Category 3: Assessment Tools */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium">3</div>
                              <h4 className="font-medium text-green-800">Assessment Tools: Comprehensive Evaluation</h4>
                            </div>
                            
                            <div className="grid sm:grid-cols-2 gap-2">
                              <div className="bg-white rounded-md p-3 border border-green-100">
                                <div className="flex justify-between items-center mb-1">
                                  <h5 className="font-medium text-green-800 text-xs">HITRUST MyCSF Self-Assessment</h5>
                                  <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded">Advanced</span>
                                </div>
                                <p className="text-[10px] text-gray-600 mb-1">
                                  Comprehensive healthcare security framework with control mapping to multiple regulations.
                                </p>
                                <div className="mt-1 grid grid-cols-4 gap-1">
                                  {["Information Protection", "Endpoint Protection", "Third-party Assurance", "Incident Management"].map((area, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded p-0.5 text-center">
                                      <p className="text-[8px] text-gray-600">{area}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="bg-white rounded-md p-3 border border-green-100">
                                <div className="flex justify-between items-center mb-1">
                                  <h5 className="font-medium text-green-800 text-xs">Healthcare Security Maturity Assessment</h5>
                                  <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded">Advanced</span>
                                </div>
                                <p className="text-[10px] text-gray-600 mb-1">
                                  Measures organizational security maturity across multiple dimensions.
                                </p>
                                <div className="mt-1">
                                  <div className="flex items-center gap-x-2 text-[9px]">
                                    <div>
                                      <span className="font-medium">Maturity Score:</span>
                                      <span className="text-green-700"> 2.3/5</span>
                                    </div>
                                    <div>
                                      <span className="font-medium">Target:</span>
                                      <span className="text-green-700"> 3.5/5</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-2 bg-blue-50 rounded-md p-2 border border-blue-100">
                              <p className="text-[10px] text-blue-700">
                                <span className="font-medium">Additional Assessment Tools: </span>
                                ONC Security Risk Assessment Tool, ISO 27001 Healthcare Implementation, NIST CSF Healthcare Profile
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 bg-green-100 p-3 rounded-md">
                          <h4 className="text-sm font-medium text-green-800 mb-1">HIPAA Compliance Pathway</h4>
                          <p className="text-xs text-green-700">
                            Complete all 3 assessment categories to establish a robust HIPAA compliance program that addresses both Security and Privacy Rule requirements.
                          </p>
                          <p className="text-xs text-green-700 mt-1">
                            <span className="font-medium">Current completion status: </span>
                            <span className="text-green-900">42% (Basic) → </span>
                            <span className="text-yellow-700">65% (Intermediate) → </span>
                            <span className="text-gray-400">85% (Advanced)</span>
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Information Security Management System (ISMS) data is not available for this report.</p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex flex-col md:flex-row justify-between gap-4">
        <Button variant="outline" onClick={onBack}>
          Back to Matrix Population
        </Button>
        
        <div className="flex flex-col md:flex-row gap-2">
          {report.reportType === 'preliminary' && (
            <Button 
              variant="default" 
              onClick={() => setEvidenceDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Comprehensive Assessment
            </Button>
          )}
          
          <Button variant="secondary" onClick={() => window.print()}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
      
      {/* Evidence Collection Dialog */}
      <Dialog open={evidenceDialog} onOpenChange={setEvidenceDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade to Comprehensive Assessment</DialogTitle>
            <DialogDescription>
              Following your <span className="text-primary font-medium">free preliminary assessment</span>, the comprehensive (quantitative) assessment monitors the implementation of your mitigation strategies and provides verifiable evidence of compliance for regulators and stakeholders.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-md mb-4">
              <h4 className="text-blue-800 text-sm font-medium mb-2">SOC Framework: Monitoring, Detection, and Incident Response</h4>
              <p className="text-sm text-blue-700">
                Moving forward requires integrating continuous monitoring and detection into your cybersecurity framework,
                with a robust incident response plan to manage potential threats efficiently.
              </p>
            </div>
            
            <p className="text-sm font-medium">Step 1: Implement Mitigation Strategies</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><span className="font-medium">Access Control Policies:</span> Implement strict access controls with multi-factor authentication</li>
              <li><span className="font-medium">Regular Software Updates:</span> Continuously update all systems and patch vulnerabilities</li>
              <li><span className="font-medium">Employee Training:</span> Security awareness for recognizing phishing and social engineering</li>
              <li><span className="font-medium">Incident Response Plan:</span> Clear procedures for detecting and containing threats</li>
              <li><span className="font-medium">SOC Monitoring:</span> Establish continuous monitoring using automated tools</li>
            </ul>
            
            <p className="text-sm font-medium mt-4">Step 2: 6-Month Evidence Collection Using Industry Tools</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><span className="font-medium">SIEM Implementation:</span> Security Information & Event Management for log correlation</li>
              <li><span className="font-medium">Network Flow Analysis:</span> Track patterns and detect anomalies in network traffic</li>
              <li><span className="font-medium">Vulnerability Management:</span> Regular assessments to identify new security gaps</li>
              <li><span className="font-medium">Event Log Collection:</span> Centralized monitoring of system and application logs</li>
              <li><span className="font-medium">Incident Documentation:</span> Record and analyze security events and responses</li>
            </ul>
            
            <p className="text-sm mt-4">
              This comprehensive approach verifies the effectiveness of your security implementations through 
              observable evidence, enabling a quantitative assessment with detailed RASBITA scoring and 
              compliance verification against industry standards such as PCI-DSS, HIPAA, GDPR, and SOC 2.
            </p>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={() => setEvidenceDialog(false)}>
              Maybe Later
            </Button>
            <Button 
              type="button" 
              onClick={() => {
                // In a real application, this would open a calendar/scheduler
                // or send data to a backend to initiate the comprehensive assessment process
                alert("Your evidence collection schedule has been set! We'll contact you to begin the 6-month SOC monitoring period.");
                setEvidenceDialog(false);
              }}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Assessment Lifecycle Dialog */}
      <Dialog open={lifecycleDialog} onOpenChange={setLifecycleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assessment Lifecycle Information</DialogTitle>
            <DialogDescription>
              Understanding the lifecycle stage of your security assessment helps determine its current validity and actionability.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Assessment Age Information */}
            <div className="rounded-md border p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Assessment Age</h3>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${ageInfo.color} bg-opacity-20`}>
                  {ageInfo.label}
                </div>
              </div>
              
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">{formatDate(report.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span className="font-medium">{getAssessmentAge()} days ({formatAssessmentAge()})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize">{report.reportType}</span>
                </div>
              </div>
            </div>
            
            {/* Assessment Lifecycle Stages */}
            <div>
              <h3 className="text-sm font-medium mb-2">Assessment Lifecycle Stages</h3>
              <div className="space-y-3">
                <div className={`p-3 rounded-md border ${getAssessmentAge() <= 30 ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-600" />
                    <div>
                      <h4 className="text-sm font-medium">Current (0-30 days)</h4>
                      <p className="text-xs text-muted-foreground">
                        Assessment is current and provides an accurate reflection of your security posture. All findings and recommendations are relevant and should be acted upon.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-3 rounded-md border ${getAssessmentAge() > 30 && getAssessmentAge() <= 90 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 mt-0.5 text-blue-600" />
                    <div>
                      <h4 className="text-sm font-medium">Recent (31-90 days)</h4>
                      <p className="text-xs text-muted-foreground">
                        Assessment is still largely valid. Minor changes in your environment may have occurred. Review high-priority recommendations and consider updating soon.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-3 rounded-md border ${getAssessmentAge() > 90 && getAssessmentAge() <= 180 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50'}`}>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5 text-amber-600" />
                    <div>
                      <h4 className="text-sm font-medium">Aging (91-180 days)</h4>
                      <p className="text-xs text-muted-foreground">
                        Assessment is beginning to age. Significant changes may have occurred in your threat landscape. Consider performing a new assessment within the next quarter.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-3 rounded-md border ${getAssessmentAge() > 180 ? 'bg-red-50 border-red-200' : 'bg-gray-50'}`}>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 mt-0.5 text-red-600" />
                    <div>
                      <h4 className="text-sm font-medium">Outdated (180+ days)</h4>
                      <p className="text-xs text-muted-foreground">
                        Assessment is outdated. Your environment has likely changed substantially, and new threats have emerged. Performing a new assessment is strongly recommended.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Evidence Collection Information */}
            {report.reportType === 'comprehensive' && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium mb-2">Evidence Collection Methodology</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                        <path d="M21.18 8.02c-1-2.3-2.85-4.17-5.16-5.18"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium">SIEM Data Analysis</h4>
                      <p className="text-xs text-muted-foreground">
                        Security Information and Event Management (SIEM) tools collect and analyze log data from network devices, servers, and applications.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
                        <line x1="2" y1="20" x2="2.01" y2="20"></line>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium">Network Flow Analysis</h4>
                      <p className="text-xs text-muted-foreground">
                        Network flow analyzers monitor traffic patterns to identify unauthorized access and data exfiltration.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium">Vulnerability Assessment</h4>
                      <p className="text-xs text-muted-foreground">
                        Regular vulnerability scans identify security weaknesses in infrastructure, applications, and endpoints.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setLifecycleDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}