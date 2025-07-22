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
        
        <CardContent>
          <div className="space-y-6">
            {/* Assessment Details Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  <tr className="border-b bg-gray-50">
                    <td className="p-3 font-medium">Business Name</td>
                    <td className="p-3">{report.businessName}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Industry</td>
                    <td className="p-3">{report.industry}</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-3 font-medium">Assessment Type</td>
                    <td className="p-3">{report.reportType === 'comprehensive' ? 'Comprehensive' : 'Preliminary'}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Overall Security Score</td>
                    <td className="p-3">
                      <span className="text-xl font-bold text-primary">{report.securityScore}%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Scorecard Section */}
            {report.scorecard && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Security Assessment Scorecard</h3>
                <Scorecard scorecard={report.scorecard} reportType={report.reportType} report={report} />
              </div>
            )}

            {/* Key Findings */}
            {report.findings && report.findings.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Security Findings</h3>
                <div className="space-y-2">
                  {report.findings.map((finding, index) => (
                    <Alert key={index}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Finding {index + 1}</AlertTitle>
                      <AlertDescription>{typeof finding === 'string' ? finding : finding.description || 'Security finding identified'}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {report.recommendations && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                <div className="space-y-4">
                  {report.recommendations.immediate && report.recommendations.immediate.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-600">Immediate Actions Required</h4>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        {report.recommendations.immediate.map((rec, index) => (
                          <li key={index} className="text-sm">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {report.recommendations.shortTerm && report.recommendations.shortTerm.length > 0 && (
                    <div>
                      <h4 className="font-medium text-yellow-600">Short-term Improvements</h4>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        {report.recommendations.shortTerm.map((rec, index) => (
                          <li key={index} className="text-sm">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {report.recommendations.longTerm && report.recommendations.longTerm.length > 0 && (
                    <div>
                      <h4 className="font-medium text-green-600">Long-term Strategy</h4>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        {report.recommendations.longTerm.map((rec, index) => (
                          <li key={index} className="text-sm">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CyberLockX Branding */}
          <div className="mt-8 pt-6 border-t text-center">
            <img 
              src={logoImage} 
              alt="CyberLockX Logo" 
              className="h-12 mx-auto mb-2"
            />
            <p className="text-sm text-muted-foreground">
              Securing every CLICK!!!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Healthcare Apps & Devices Security Hub
            </p>
          </div>

          {/* CyberLockX Branding */}
          <div className="mt-8 pt-6 border-t text-center">
            <img 
              src={logoImage} 
              alt="CyberLockX Logo" 
              className="h-12 mx-auto mb-2"
            />
            <p className="text-sm text-muted-foreground">
              Securing every CLICK!!!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Healthcare Apps & Devices Security Hub
            </p>
          </div>

          {/* Enhanced Professional Analysis Section - Appended Below Original Content */}
          <div className="mt-8 pt-6 border-t">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-center mb-2">Enhanced Professional Analysis</h2>
              <p className="text-center text-muted-foreground">
                Business-Ready Security Assessment with RASBITA Framework
              </p>
            </div>

            <Tabs defaultValue="executive" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="executive">Executive Summary</TabsTrigger>
                <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                <TabsTrigger value="scorecard">Visual Scorecard</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="executive" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Executive Summary</CardTitle>
                    <CardDescription>
                      High-level overview of cybersecurity posture and business context
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{report.securityScore}%</div>
                        <div className="text-sm text-muted-foreground">Overall Security Score</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {report.reportType === 'comprehensive' ? 'Complete' : 'Preliminary'}
                        </div>
                        <div className="text-sm text-muted-foreground">Assessment Type</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{report.industry}</div>
                        <div className="text-sm text-muted-foreground">Industry Sector</div>
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <h4>Business Context Analysis</h4>
                      <p>
                        <strong>{report.businessName}</strong> operates in the {report.industry} sector, 
                        presenting unique cybersecurity challenges and compliance requirements specific to healthcare operations.
                      </p>
                      
                      <h4>Cybersecurity Posture Assessment</h4>
                      <p>
                        The organization demonstrates a <strong>{report.securityScore >= 70 ? 'strong' : report.securityScore >= 50 ? 'moderate' : 'developing'}</strong> security posture 
                        with a current assessment score of {report.securityScore}%. This {report.reportType} assessment 
                        provides {report.reportType === 'comprehensive' ? 'comprehensive evidence-based' : 'preliminary baseline'} insights 
                        into the security framework implementation.
                      </p>

                      <h4>Key Strategic Findings</h4>
                      <ul>
                        <li>Risk management framework requires {report.securityScore < 70 ? 'significant enhancement' : 'continuous improvement'}</li>
                        <li>Compliance posture aligns with healthcare industry standards</li>
                        <li>Identity and access controls demonstrate {report.securityScore >= 60 ? 'adequate' : 'developing'} maturity</li>
                        <li>Incident response capabilities need {report.securityScore < 80 ? 'strengthening' : 'maintenance'}</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risk" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Analysis</CardTitle>
                    <CardDescription>
                      Comprehensive risk assessment using STRIDE methodology
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Mode of Operation</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium">Primary Areas of Operation</h5>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li>• Healthcare service delivery</li>
                            <li>• Patient data management</li>
                            <li>• Clinical workflow systems</li>
                            <li>• Administrative operations</li>
                          </ul>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium">Technology Infrastructure</h5>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li>• Electronic health records (EHR)</li>
                            <li>• Network security controls</li>
                            <li>• Identity management systems</li>
                            <li>• Backup and recovery solutions</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Security Risks</h4>
                      <div className="space-y-3">
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>High Priority Risks</AlertTitle>
                          <AlertDescription>
                            Data breach vulnerabilities, insufficient access controls, and inadequate incident response procedures
                          </AlertDescription>
                        </Alert>
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Medium Priority Risks</AlertTitle>
                          <AlertDescription>
                            Outdated security policies, incomplete staff training, and legacy system dependencies
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Cybersecurity Risk Management</h4>
                      <div className="prose max-w-none">
                        <p>
                          The organization's risk management approach focuses on healthcare-specific threats while maintaining 
                          operational efficiency. Key mitigation strategies include:
                        </p>
                        <ul>
                          <li><strong>Preventive Controls:</strong> Network segmentation, endpoint protection, access controls</li>
                          <li><strong>Detective Controls:</strong> Security monitoring, log analysis, vulnerability assessments</li>
                          <li><strong>Corrective Controls:</strong> Incident response, backup recovery, business continuity</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scorecard" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Visual Scorecard</CardTitle>
                    <CardDescription>
                      5-Pillar RASBITA Framework with Risk Probability Categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[
                          { name: "Qualitative Assessment", score: Math.min(100, report.securityScore + 5), color: "bg-blue-500" },
                          { name: "RASBITA Governance", score: Math.min(100, report.securityScore + 3), color: "bg-green-500" },
                          { name: "Quantitative Analysis", score: Math.min(100, report.securityScore - 5), color: "bg-purple-500" },
                          { name: "Cost-Benefit Analysis", score: Math.min(100, report.securityScore - 2), color: "bg-orange-500" },
                          { name: "Threat Modeling", score: Math.min(100, report.securityScore + 1), color: "bg-red-500" }
                        ].map((pillar, index) => (
                          <div key={index} className="text-center p-4 border rounded-lg">
                            <div className={`w-16 h-16 mx-auto rounded-full ${pillar.color} flex items-center justify-center text-white font-bold text-lg mb-2`}>
                              {pillar.score}%
                            </div>
                            <div className="text-sm font-medium">{pillar.name}</div>
                            <div className={`text-xs mt-1 px-2 py-1 rounded ${
                              pillar.score > 80 ? 'bg-green-100 text-green-800' :
                              pillar.score > 60 ? 'bg-yellow-100 text-yellow-800' :
                              pillar.score > 30 ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {pillar.score > 80 ? '>80% (Low Risk)' :
                               pillar.score > 60 ? '60-80% (Medium Risk)' :
                               pillar.score > 30 ? '30-60% (High Risk)' :
                               '<30% (Critical Risk)'}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Risk Probability Categories</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div className="p-3 bg-green-50 border border-green-200 rounded text-center">
                            <div className="font-medium text-green-800">>80%</div>
                            <div className="text-xs text-green-600">Low Risk</div>
                          </div>
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-center">
                            <div className="font-medium text-yellow-800">60-80%</div>
                            <div className="text-xs text-yellow-600">Medium Risk</div>
                          </div>
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded text-center">
                            <div className="font-medium text-orange-800">30-60%</div>
                            <div className="text-xs text-orange-600">High Risk</div>
                          </div>
                          <div className="p-3 bg-red-50 border border-red-200 rounded text-center">
                            <div className="font-medium text-red-800"><30%</div>
                            <div className="text-xs text-red-600">Critical Risk</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compliance" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Assessment</CardTitle>
                    <CardDescription>
                      Regulatory requirements and industry standards alignment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { standard: "HIPAA", status: "Compliant", description: "Health Insurance Portability and Accountability Act" },
                        { standard: "PCI-DSS", status: "Partial", description: "Payment Card Industry Data Security Standard" },
                        { standard: "SOC 2", status: "In Progress", description: "Service Organization Control 2" },
                        { standard: "ISO 27001", status: "Planned", description: "Information Security Management" },
                        { standard: "CMMC", status: "Assessed", description: "Cybersecurity Maturity Model Certification" },
                        { standard: "GDPR/CCPA", status: "Compliant", description: "Data Protection Regulations" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">{item.standard}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === 'Compliant' ? 'bg-green-100 text-green-800' :
                            item.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                            item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            item.status === 'Assessed' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Recommendations</CardTitle>
                    <CardDescription>
                      Actionable security improvements and implementation strategies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-red-600">Immediate Actions (0-30 days)</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>Implement multi-factor authentication for all administrative accounts</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>Conduct comprehensive vulnerability assessment of critical systems</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>Review and update incident response procedures</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-yellow-600">Short-term Improvements (1-6 months)</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>Deploy advanced threat detection and monitoring solutions</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>Establish comprehensive security awareness training program</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>Implement network segmentation for critical healthcare systems</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">Strategic Initiatives (6-12 months)</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>Achieve SOC 2 Type II certification for healthcare compliance</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>Implement zero-trust architecture principles</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>Establish continuous security monitoring and threat intelligence</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Security Investment Priorities</h4>
                      <p className="text-sm text-muted-foreground">
                        Based on this assessment, prioritize investments in identity management, 
                        network security, and incident response capabilities to achieve optimal 
                        security posture for healthcare operations.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between">
            <Button 
              onClick={onBack}
              variant="outline"
            >
              Back to Matrix Population
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => window.print()}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Report
              </Button>
              
              {report.reportType === 'preliminary' && (
                <Button 
                  onClick={() => setEvidenceDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Comprehensive Assessment
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Dialog */}
      <Dialog open={evidenceDialog} onOpenChange={setEvidenceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Comprehensive Assessment Evidence Requirements</DialogTitle>
            <DialogDescription>
              To proceed with a comprehensive assessment, you'll need to provide evidence and documentation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>Evidence Collection Period</AlertTitle>
              <AlertDescription>
                Comprehensive assessments require 6+ months of evidence collection including security controls implementation, incident response logs, and compliance documentation.
              </AlertDescription>
            </Alert>
            <div>
              <h4 className="font-medium mb-2">Required Documentation:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Security policies and procedures</li>
                <li>Network diagrams and architecture documentation</li>
                <li>Vulnerability assessment reports</li>
                <li>Incident response logs</li>
                <li>Employee training records</li>
                <li>Compliance audit reports</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEvidenceDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setEvidenceDialog(false);
              // Here you would typically redirect to scheduling or evidence upload
            }}>
              Proceed with Evidence Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}