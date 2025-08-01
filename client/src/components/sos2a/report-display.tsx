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
import { EnhancedProfessionalAnalysis } from "./enhanced-professional-analysis";
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
                              {report.rasbitaScore?.gpaScores?.[domain as keyof typeof report.rasbitaScore.gpaScores] || "N/A"}
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
          
          
          {/* Assessment Overview Section - Enhanced Visual Design */}
          <div className="border-t pt-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 rounded-full p-3">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Assessment Overview</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-green-300" />
                    <span className="text-sm text-blue-100">CyberLockX SOS²A Methodology</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                <p className="text-base leading-relaxed">
                  This comprehensive preliminary assessment provides an <strong className="text-yellow-200">in-depth analysis</strong> of your organization's cybersecurity posture using our proprietary <strong className="text-yellow-200">CyberLockX SOS²A methodology</strong>. 
                </p>
                <p className="text-sm text-blue-100 mt-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Critical insights and actionable recommendations included below
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Key Findings - Enhanced */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-600 rounded-full p-2">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-800">Key Findings</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Overall security score:</span>
                    </div>
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {report.securityScore}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Critical vulnerabilities:</span>
                    </div>
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {report.vulnerabilities && Array.isArray(report.vulnerabilities.critical) 
                        ? report.vulnerabilities.critical.length 
                        : 0}
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Compliance gaps:</span>
                    </div>
                    <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {report.findings && Array.isArray(report.findings) 
                        ? report.findings.filter(f => f.severity === 'Medium' || f.severity === 'High').length 
                        : 5}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recommended Actions - Enhanced */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-600 rounded-full p-2">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-green-800">Recommended Actions</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium">Immediate:</span>
                    </div>
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {report.recommendations && Array.isArray(report.recommendations.immediate) 
                        ? report.recommendations.immediate.length 
                        : 0} actions
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium">Short-term:</span>
                    </div>
                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {report.recommendations && Array.isArray(report.recommendations.shortTerm) 
                        ? report.recommendations.shortTerm.length 
                        : 0} initiatives
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Long-term:</span>
                    </div>
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {report.recommendations && Array.isArray(report.recommendations.longTerm) 
                        ? report.recommendations.longTerm.length 
                        : 0} strategic goals
                    </div>
                  </div>
                </div>
              </div>
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
          
          
          {/* ========== REDUNDANT TAB NAVIGATION REMOVED ==========
              Previously contained: Visual Scorecard, Compliance, Risk Analysis, 
              Scorecard, Recommendations, Implementation Guidance tabs.
              These duplicated content that is comprehensively covered in the 
              Enhanced Professional Analysis section below.
              Removed per user approval to clean up the interface.
              ====================================================== */}
        </CardContent>
      </Card>
      
      {/* Enhanced Professional Analysis Section */}
      <EnhancedProfessionalAnalysis report={report} />

      
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
