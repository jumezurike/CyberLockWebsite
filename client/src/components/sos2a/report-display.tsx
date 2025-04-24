import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssessmentReport } from "@/lib/sos2a-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileText, Download, Calendar, Clock } from "lucide-react";

interface ReportDisplayProps {
  report: AssessmentReport;
  onBack: () => void;
}

export default function ReportDisplay({ report, onBack }: ReportDisplayProps) {
  const [evidenceDialog, setEvidenceDialog] = useState(false);
  
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
  
  const isComprehensiveReport = report.reportType === 'comprehensive';
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold">
                {report.reportType === 'preliminary' ? 'Preliminary' : 'Comprehensive'} Assessment Report
              </CardTitle>
              <CardDescription>
                Generated on {formatDate(report.createdAt)}
              </CardDescription>
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
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary text-white">
                        Step 3 of 4
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-primary">
                        75% Complete
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div style={{ width: "75%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs text-center">
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">Questionnaire</p>
                      <p className="text-xs text-green-600">Data Collection</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">Matrix Population</p>
                      <p className="text-xs text-green-600">Gap Analysis</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mx-auto">3</div>
                      <p className="font-medium">Preliminary Report</p>
                      <p className="text-xs text-muted-foreground">Qualitative Assessment</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center mx-auto">4</div>
                      <p className="text-muted-foreground">Comprehensive Report</p>
                      <p className="text-xs text-muted-foreground">With Evidence Collection</p>
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
                        Step 4 of 4
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
                  <div className="grid grid-cols-4 gap-2 text-xs text-center">
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">Questionnaire</p>
                      <p className="text-xs text-green-600">Data Collection</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">Matrix Population</p>
                      <p className="text-xs text-green-600">Gap Analysis</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">Preliminary Report</p>
                      <p className="text-xs text-green-600">Remediation Plan</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mx-auto">4</div>
                      <p className="font-medium">Comprehensive Report</p>
                      <p className="text-xs text-muted-foreground">Evidence-Based</p>
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
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Business Information</h3>
              <p className="font-medium">{report.businessId}</p>
              <p>{report.industry} | {report.businessLocation.state}, {report.businessLocation.country}</p>
              <p className="text-sm text-muted-foreground">{report.businessServices}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">RASBITA Score Components</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-primary/5 rounded p-2">
                  <p className="text-xs text-muted-foreground">Risk</p>
                  <p className="font-bold">{report.rasbitaScore.categories.risk}</p>
                </div>
                <div className="bg-primary/5 rounded p-2">
                  <p className="text-xs text-muted-foreground">Security</p>
                  <p className="font-bold">{report.rasbitaScore.categories.securityControls}</p>
                </div>
                <div className="bg-primary/5 rounded p-2">
                  <p className="text-xs text-muted-foreground">Architecture</p>
                  <p className="font-bold">{report.rasbitaScore.categories.architecture}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-3">Summary Findings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="border rounded-md p-3 text-center">
                <div className="text-lg font-bold text-red-500">{report.findings.filter(f => f.severity === 'High').length}</div>
                <div className="text-sm">High Risks</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-lg font-bold text-orange-500">{report.findings.filter(f => f.severity === 'Medium').length}</div>
                <div className="text-sm">Medium Risks</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-lg font-bold text-amber-500">{report.vulnerabilities.critical.length}</div>
                <div className="text-sm">Critical Vulnerabilities</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-lg font-bold text-blue-500">{report.recommendations.immediate.length}</div>
                <div className="text-sm">Immediate Actions</div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="recommendations" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="risks">Risks & Vulnerabilities</TabsTrigger>
              <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
              <TabsTrigger value="frameworks">Framework Gaps</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recommendations" className="space-y-4 pt-4">
              <div>
                <h3 className="font-medium mb-2">Immediate Actions</h3>
                <ul className="space-y-2 list-disc pl-5">
                  {report.recommendations.immediate.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Short Term (30-90 days)</h3>
                <ul className="space-y-2 list-disc pl-5">
                  {report.recommendations.shortTerm.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Long Term (90+ days)</h3>
                <ul className="space-y-2 list-disc pl-5">
                  {report.recommendations.longTerm.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="risks" className="space-y-4 pt-4">
              <div>
                <h3 className="font-medium mb-2">Security Risks</h3>
                <div className="space-y-3">
                  {report.findings.map((finding, index) => (
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
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Vulnerabilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border rounded-md p-3">
                    <h4 className="text-red-600 font-medium mb-2">Critical ({report.vulnerabilities.critical.length})</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {report.vulnerabilities.critical.map((vuln, index) => (
                        <li key={index}>{vuln}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="border rounded-md p-3">
                    <h4 className="text-orange-600 font-medium mb-2">High ({report.vulnerabilities.high.length})</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {report.vulnerabilities.high.map((vuln, index) => (
                        <li key={index}>{vuln}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="compliance" className="space-y-4 pt-4">
              <div>
                <h3 className="font-medium mb-2">Compliance Standards</h3>
                <div className="space-y-3">
                  {report.complianceStatus.standards.map((standard, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <span>{standard.standard}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        standard.status === 'Compliant' ? 'bg-green-100 text-green-800' :
                        standard.status === 'Partially Compliant' ? 'bg-amber-100 text-amber-800' :
                        standard.status === 'Non-Compliant' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>{standard.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Regulatory Requirements</h3>
                <div className="space-y-3">
                  {report.complianceStatus.regulations.map((regulation, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <span>{regulation.standard}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        regulation.status === 'Compliant' ? 'bg-green-100 text-green-800' :
                        regulation.status === 'Partially Compliant' ? 'bg-amber-100 text-amber-800' :
                        regulation.status === 'Non-Compliant' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>{regulation.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="frameworks" className="space-y-4 pt-4">
              <div>
                <h3 className="font-medium mb-2">Operation Control Gaps</h3>
                <ul className="list-disc pl-5">
                  {report.frameworkGaps.operations.length > 0 ? (
                    report.frameworkGaps.operations.map((gap, index) => (
                      <li key={index}>{gap}</li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">No operational framework gaps identified</li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Management Control Gaps</h3>
                <ul className="list-disc pl-5">
                  {report.frameworkGaps.management.length > 0 ? (
                    report.frameworkGaps.management.map((gap, index) => (
                      <li key={index}>{gap}</li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">No management framework gaps identified</li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Technology Control Gaps</h3>
                <ul className="list-disc pl-5">
                  {report.frameworkGaps.technology.length > 0 ? (
                    report.frameworkGaps.technology.map((gap, index) => (
                      <li key={index}>{gap}</li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">No technology framework gaps identified</li>
                  )}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex flex-col md:flex-row justify-between gap-4">
        <Button variant="outline" onClick={onBack}>
          Back to Matrix Population
        </Button>
        
        <div className="flex flex-col md:flex-row gap-2">
          {report.reportType === 'preliminary' && (
            <Button variant="default" onClick={() => setEvidenceDialog(true)}>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Evidence Collection
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
            <DialogTitle>Schedule Evidence Collection</DialogTitle>
            <DialogDescription>
              Following your <span className="text-primary font-medium">free preliminary assessment</span>, the comprehensive (quantitative) assessment monitors the implementation of your mitigation strategies.
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
            <Button type="button" onClick={() => setEvidenceDialog(false)}>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}