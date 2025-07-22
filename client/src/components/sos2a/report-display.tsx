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

interface EnhancedReportDisplayProps {
  report: AssessmentReport;
  onBack: () => void;
}

export default function EnhancedReportDisplay({ report, onBack }: EnhancedReportDisplayProps) {
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
  const isComprehensive = report.reportType === 'comprehensive';
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold">
                Healthcare Organizational and System Security Analysis (HOS²A) {isComprehensive ? 'Comprehensive' : 'Preliminary'} Report
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
          <Tabs defaultValue="executive-summary" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="executive-summary">Executive Summary</TabsTrigger>
              <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
              <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            
            {/* Executive Summary Tab */}
            <TabsContent value="executive-summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Executive Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed">
                    This {isComprehensive ? 'comprehensive' : 'preliminary'} report highlights the current cybersecurity state of {report.businessName}, 
                    with an emphasis on assessing its organizational and system security posture. While this is an {isComprehensive ? 'detailed analysis' : 'initial overview'}, 
                    it is part of a larger effort to align security controls with industry compliance standards, regulations, and best practices.
                  </p>
                  <p className="text-sm leading-relaxed">
                    The purpose of this report is to illustrate the need for comprehensive monitoring, threat detection, and an effective 
                    incident response system. As part of this assessment, we've conducted an architectural review using our STRIDE 
                    threat modeling methodology, which evaluates your systems for Spoofing, Tampering, Repudiation, Information 
                    Disclosure, Denial of Service, and Elevation of Privilege threats.
                  </p>
                  <p className="text-sm leading-relaxed">
                    This analysis has identified architectural vulnerabilities and recommended mitigation controls that are 
                    incorporated into our overall risk assessment framework.
                  </p>
                </CardContent>
              </Card>

              {/* Business Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong>Industry:</strong> {report.industry}</div>
                    <div><strong>Location:</strong> {report.location || 'Unknown location'}</div>
                    <div><strong>Assessment Type:</strong> {isComprehensive ? 'Comprehensive' : 'Preliminary'}</div>
                    <div><strong>Overall Security Score:</strong> <span className="font-bold text-primary">{report.securityScore}%</span></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Risk Analysis Tab */}
            <TabsContent value="risk-analysis" className="space-y-4">
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
                      <li><strong>Phishing & Spoofing:</strong> Cybercriminals exploiting weak email and social media security</li>
                      <li><strong>Data Privacy Breaches:</strong> Vulnerabilities in POS systems and social media controls</li>
                      <li><strong>Malware & Hacking:</strong> Threats to unpatched systems and insecure applications</li>
                      <li><strong>Account Hijacking:</strong> Unauthorized access to social platforms, impacting reputation</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Potential Vulnerabilities</h4>
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      <li>Weak authentication mechanisms and lack of multi-factor authentication (MFA)</li>
                      <li>Outdated or unpatched software exposing critical systems</li>
                      <li>Misconfigured cloud and network services leading to data leaks</li>
                      <li>Insecure APIs and file uploads increase attack surface</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cybersecurity Risk Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Risk Identification</h4>
                    <p className="text-sm mb-2">SOS²A identifies the following primary risks:</p>
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      <li><strong>Data Exfiltration:</strong> Unauthorized access to sensitive information</li>
                      <li><strong>Business Disruption:</strong> Operational downtime from ransomware or DDoS attacks</li>
                      <li><strong>Reputational Damage:</strong> Misinformation or breaches affecting public trust</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Risk Assessment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Likelihood:</strong>
                        <ul className="mt-1 ml-4 list-disc space-y-1">
                          <li><span className="text-red-600">High:</span> Phishing attacks, unpatched vulnerabilities</li>
                          <li><span className="text-amber-600">Medium:</span> Ransomware and DDoS attacks</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Impact:</strong>
                        <ul className="mt-1 ml-4 list-disc space-y-1">
                          <li><span className="text-red-600">High:</span> Compliance violations and customer data breaches</li>
                          <li><span className="text-amber-600">Medium:</span> Temporary operational disruptions</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Risk Mitigation Strategies</h4>
                    <div className="space-y-3">
                      <div>
                        <strong className="text-sm">Technical Controls:</strong>
                        <ul className="text-sm mt-1 ml-4 list-disc space-y-1">
                          <li>Deploy SIEM and IDS/IPS tools for continuous monitoring</li>
                          <li>Implement endpoint protection and encryption for data in transit and at rest</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-sm">Procedural Controls:</strong>
                        <ul className="text-sm mt-1 ml-4 list-disc space-y-1">
                          <li>Develop an Incident Response Plan (IRP) with defined roles and processes</li>
                          <li>Enforce MFA and strict role-based access controls</li>
                          <li>Conduct regular employee training on phishing awareness and secure data handling</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Scorecard Tab */}
            <TabsContent value="scorecard" className="space-y-4">
              {/* RASBITA Score Components */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>RASBITA Score Components</span>
                    <span className="text-2xl font-bold text-primary">
                      {report.rasbitaScore?.overall || 'N/A'}% RASBITA™
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    Overall score based on comprehensive security posture analysis
                  </div>
                </CardContent>
              </Card>

              {/* Visual Scorecard */}
              <Scorecard 
                scorecard={[
                  { parameter: 'Qualitative Assessment', score: report.rasbitaScore?.categories?.risk || 42, weight: 20 },
                  { parameter: 'Quantitative Analysis', score: report.rasbitaScore?.categories?.securityControls || 0, weight: 25 },
                  { parameter: 'RASBITA Cost-Benefit Analysis', score: report.rasbitaScore?.categories?.architecture || 0, weight: 25 },
                  { parameter: 'RASBITA Governance & Management', score: ((report.rasbitaScore?.categories?.govern || 0) + (report.rasbitaScore?.categories?.identify || 0) + (report.rasbitaScore?.categories?.protect || 0)) / 3, weight: 15 },
                  { parameter: 'Architecture Threat Modeling', score: ((report.rasbitaScore?.categories?.detect || 0) + (report.rasbitaScore?.categories?.respond || 0) + (report.rasbitaScore?.categories?.recover || 0)) / 3, weight: 15 }
                ]}
                reportType={report.reportType}
                report={report}
              />

              {/* Summary Findings with Risk Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Summary Findings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-3xl font-bold text-red-600">
                        {report.summary?.criticalVulnerabilities || 0}
                      </div>
                      <div className="text-sm text-red-700">Critical Vulnerabilities</div>
                      <div className="text-xs text-red-600">Greater than 80% probability</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600">
                        {report.summary?.highRisks || 0}
                      </div>
                      <div className="text-sm text-orange-700">High Risks</div>
                      <div className="text-xs text-orange-600">Between 60%-80% probability</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">
                        {report.summary?.mediumRisks || 0}
                      </div>
                      <div className="text-sm text-yellow-700">Medium Risks</div>
                      <div className="text-xs text-yellow-600">Between 30%-60% probability</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {report.summary?.lowRisks || 0}
                      </div>
                      <div className="text-sm text-green-700">Low Risks</div>
                      <div className="text-xs text-green-600">Below 30% probability</div>
                    </div>
                  </div>
                  
                  <div className="text-sm space-y-2">
                    <h4 className="font-semibold">Risk Probability Categories:</h4>
                    <ul className="space-y-1 ml-4 list-disc">
                      <li><strong className="text-red-600">Critical</strong> – Greater than 80% probability of occurrence</li>
                      <li><strong className="text-orange-600">High</strong> – Between 60% and 80% probability of occurrence</li>
                      <li><strong className="text-yellow-600">Medium</strong> – Between 30% and 60% probability of occurrence</li>
                      <li><strong className="text-green-600">Low</strong> – Below 30% probability of occurrence</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Compliance and Regulatory Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Applicable Standards</h4>
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      <li><strong>PCI-DSS:</strong> Protection of cardholder data in payment systems</li>
                      <li><strong>HIPAA:</strong> Safeguarding healthcare-related data</li>
                      <li><strong>CMMC:</strong> Meeting cybersecurity maturity requirements for defense contractors</li>
                      <li><strong>GDPR & CCPA:</strong> Enforcing data privacy for global and California-specific regulations</li>
                      <li><strong>SOC 2, ISO/IEC 27001:</strong> Continuous monitoring and data protection standards</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Compliance Gaps</h4>
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      <li>Limited implementation of data encryption protocols</li>
                      <li>Lack of routine security audits and employee awareness programs</li>
                      <li>Missing documentation and procedures for incident response</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SOC Framework: Monitoring, Detection, and Incident Response</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Key Components of the SOC Framework</h4>
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      <li><strong>Continuous Monitoring:</strong> Real-time monitoring of systems and network traffic using SIEM tools</li>
                      <li><strong>Threat Detection:</strong> Leveraging automated tools to identify and flag suspicious activities early</li>
                      <li><strong>Incident Response Plan (IRP):</strong> A well-defined IRP to respond swiftly to detected incidents, minimizing downtime and impact</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security Threats & Mitigation Strategies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Threats Identified</h4>
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      <li><strong>Phishing & Social Engineering:</strong> Exploiting employee vulnerabilities</li>
                      <li><strong>DDoS Attacks:</strong> Overloading network services, disrupting operations</li>
                      <li><strong>Reputational Damage:</strong> Compromised social media accounts spreading misinformation</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Mitigation Strategies</h4>
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      <li><strong>Access Control Policies:</strong> Enforce MFA and role-based access control across all platforms</li>
                      <li><strong>Regular Updates & Patches:</strong> Ensure all software is current and free of known vulnerabilities</li>
                      <li><strong>Employee Training:</strong> Ongoing cybersecurity education for recognizing and avoiding threats</li>
                      <li><strong>SOC Integration:</strong> Establish continuous monitoring and automated detection mechanisms</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="text-sm space-y-2 ml-4 list-decimal">
                    <li>Strengthen web security with encryption, secure coding, and regular vulnerability scans</li>
                    <li>Enhance data privacy controls to meet GDPR, CCPA, and PCI-DSS standards</li>
                    <li>Build a robust SOC framework with continuous monitoring and real-time threat detection</li>
                    <li>Train employees on cybersecurity best practices, focusing on phishing awareness and secure data handling</li>
                    <li>Implement MFA across critical systems to reduce unauthorized access</li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* CyberLockX Branding */}
          <div className="border-t pt-6">
            <div className="text-center space-y-2">
              <img 
                src={logoImage} 
                alt="CyberLockX Logo" 
                className="h-12 mx-auto"
              />
              <p className="text-sm font-medium text-primary">
                Securing every CLICK!!!
              </p>
              <p className="text-xs text-muted-foreground">
                Healthcare Apps & Devices Security Hub
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <Button 
                onClick={onBack}
                variant="outline"
              >
                Back to Matrix Population
              </Button>
              <Button variant="default">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              {!isComprehensive && (
                <Button variant="default" className="bg-green-600 hover:bg-green-700">
                  Schedule Comprehensive Assessment
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Dialog */}
      <Dialog open={evidenceDialog} onOpenChange={setEvidenceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Evidence Requirements for Comprehensive Assessment</DialogTitle>
            <DialogDescription>
              Comprehensive assessments require 6+ months of documented evidence and implementation of security controls.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Lifecycle Dialog */}
      <Dialog open={lifecycleDialog} onOpenChange={setLifecycleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assessment Lifecycle Information</DialogTitle>
            <DialogDescription>
              This assessment is {formatAssessmentAge()}. Security assessments should be updated every 6-12 months 
              to maintain accuracy and compliance.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}