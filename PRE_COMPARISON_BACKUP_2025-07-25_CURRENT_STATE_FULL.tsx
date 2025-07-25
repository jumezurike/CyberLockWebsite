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

  const isComprehensiveReport = report.reportType === 'comprehensive';

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Assessment Header Card */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${isComprehensiveReport ? 'bg-purple-100' : 'bg-blue-100'}`}>
                <FileText className={`h-6 w-6 ${isComprehensiveReport ? 'text-purple-600' : 'text-blue-600'}`} />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {isComprehensiveReport ? 'Comprehensive' : 'Preliminary'} Assessment Report
                </CardTitle>
                <CardDescription className="text-sm">
                  Generated on {formatDate(report.createdAt)} • Assessment ID: {report.id}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center ${getAgeStatusInfo().color} text-sm font-medium`}>
                {getAgeStatusInfo().icon}
                <span className="ml-1">{getAgeStatusInfo().label}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isComprehensiveReport && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <div className="text-sm text-purple-700 mb-3">
                <strong>Comprehensive Report - Assessment Progress Tracking</strong>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                    <p className="font-medium text-green-700">1. Qualitative Report</p>
                    <p className="text-xs text-green-600">Risk Assessment Complete</p>
                  </div>
                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                    <p className="font-medium text-green-700">2. Quantitative Analysis</p>
                    <p className="text-xs text-green-600">Evidence Collection</p>
                  </div>
                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                    <p className="font-medium text-green-700">3. Adversarial Insight</p>
                    <p className="text-xs text-green-600">Threat Vector Analysis</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
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
                <div className="grid grid-cols-3 gap-2 text-center">
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
                      <p className="text-xs font-bold text-red-700">R</p>
                      <p className="text-[10px] text-muted-foreground">Risk</p>
                      <p className="text-xs font-bold">{report.rasbitaScore.risk || "N/A"}%</p>
                    </div>
                    <div className="bg-primary/5 rounded-md p-2 border-l-4 border-orange-500">
                      <p className="text-xs font-bold text-orange-700">A</p>
                      <p className="text-[10px] text-muted-foreground">Adversarial</p>
                      <p className="text-xs font-bold">{report.rasbitaScore.adversarial || "N/A"}%</p>
                    </div>
                    <div className="bg-primary/5 rounded-md p-2 border-l-4 border-amber-500">
                      <p className="text-xs font-bold text-amber-700">S</p>
                      <p className="text-[10px] text-muted-foreground">Security</p>
                      <p className="text-xs font-bold">{report.rasbitaScore.security || "N/A"}%</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center mt-2">
                    <div className="bg-primary/5 rounded-md p-2 border-l-4 border-blue-500">
                      <p className="text-xs font-bold text-blue-700">B</p>
                      <p className="text-[10px] text-muted-foreground">Business</p>
                      <p className="text-xs font-bold">{report.rasbitaScore.business || "N/A"}%</p>
                    </div>
                    <div className="bg-primary/5 rounded-md p-2 border-l-4 border-indigo-500">
                      <p className="text-xs font-bold text-indigo-700">I</p>
                      <p className="text-[10px] text-muted-foreground">Information</p>
                      <p className="text-xs font-bold">{report.rasbitaScore.information || "N/A"}%</p>
                    </div>
                    <div className="bg-primary/5 rounded-md p-2 border-l-4 border-purple-500">
                      <p className="text-xs font-bold text-purple-700">T</p>
                      <p className="text-[10px] text-muted-foreground">Threat</p>
                      <p className="text-xs font-bold">{report.rasbitaScore.threat || "N/A"}%</p>
                    </div>
                    <div className="bg-primary/5 rounded-md p-2 border-l-4 border-pink-500">
                      <p className="text-xs font-bold text-pink-700">A</p>
                      <p className="text-[10px] text-muted-foreground">Architecture</p>
                      <p className="text-xs font-bold">{report.rasbitaScore.architecture || "N/A"}%</p>
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
      
      {/* Report Tabs */}
      <div className="border-t pt-8 mt-8">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Overview</TabsTrigger>
            <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          {/* Summary Findings Tab */}
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

          {/* Scorecard Tab with Visual Elements */}
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
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security Recommendations</CardTitle>
                <CardDescription>
                  Prioritized action items to improve your security posture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
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
        </Tabs>
      </div>

      {/* CyberLockX Logo */}
      <div className="flex justify-center items-center border-t pt-8 mt-8">
        <div className="text-center">
          <img src={logoImage} alt="CyberLockX Logo" className="h-12 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Securing every CLICK!!!</p>
          <p className="text-xs text-muted-foreground">Healthcare Apps & Devices Security Hub</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center border-t pt-8 mt-8">
        <Button onClick={() => setEvidenceDialog(true)} variant="outline" className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          View Evidence
        </Button>
        <Button onClick={() => setLifecycleDialog(true)} variant="outline" className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Assessment Lifecycle
        </Button>
        <Button onClick={onBack} variant="outline">
          Return to Matrix
        </Button>
      </div>

      {/* Evidence Dialog */}
      <Dialog open={evidenceDialog} onOpenChange={setEvidenceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assessment Evidence</DialogTitle>
            <DialogDescription>
              Evidence and artifacts collected during the security assessment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              This assessment was conducted based on the information provided in your security questionnaire
              and includes evidence from:
            </div>
            <ul className="text-sm space-y-2 ml-4 list-disc">
              <li>Security control implementation verification</li>
              <li>Network architecture and configuration analysis</li>
              <li>Identity and access management review</li>
              <li>Compliance framework assessment</li>
              <li>Risk and vulnerability analysis</li>
            </ul>
          </div>
          <DialogFooter>
            <Button onClick={() => setEvidenceDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lifecycle Dialog */}
      <Dialog open={lifecycleDialog} onOpenChange={setLifecycleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assessment Lifecycle Information</DialogTitle>
            <DialogDescription>
              Understanding your assessment status and next steps
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <strong>Report Type:</strong> {report.reportType === 'preliminary' ? 'Preliminary Assessment' : 'Comprehensive Assessment'}
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Assessment Age: {formatAssessmentAge()}</div>
              <div className="flex items-center text-sm">
                <span className={`${getAgeStatusInfo().color} mr-2`}>
                  {getAgeStatusInfo().icon}
                </span>
                <span>{getAgeStatusInfo().label}</span>
              </div>
            </div>
            {report.reportType === 'preliminary' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Preliminary Assessment</AlertTitle>
                <AlertDescription>
                  This is a preliminary report. For a comprehensive analysis with quantitative metrics
                  and detailed remediation guidance, consider upgrading to a full assessment.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setLifecycleDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}