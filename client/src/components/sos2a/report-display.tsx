import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssessmentReport } from "@/lib/sos2a-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileText, Download, Calendar, Clock } from "lucide-react";
import Scorecard from "./scorecard";

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
                        Step 3 of 5
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-primary">
                        60% Complete
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div style={{ width: "60%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-xs text-center">
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">Inquiry & Questionnaire</p>
                      <p className="text-xs text-green-600">Data Collection</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">Matrix Population</p>
                      <p className="text-xs text-green-600">Gap Analysis</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">Architecture Analysis</p>
                      <p className="text-xs text-green-600">Threat Modeling</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center mx-auto">4</div>
                      <p className="text-muted-foreground">Preliminary Report</p>
                      <p className="text-xs text-muted-foreground">Qualitative Assessment</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center mx-auto">5</div>
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
                        Step 5 of 5
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
                  <div className="grid grid-cols-5 gap-2 text-xs text-center">
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">Inquiry & Questionnaire</p>
                      <p className="text-xs text-green-600">Data Collection</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">Matrix Population</p>
                      <p className="text-xs text-green-600">Gap Analysis</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">Architecture Analysis</p>
                      <p className="text-xs text-green-600">Threat Modeling</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">✓</div>
                      <p className="font-medium text-green-700">Preliminary Report</p>
                      <p className="text-xs text-green-600">Remediation Plan</p>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mx-auto">5</div>
                      <p className="font-medium">Comprehensive Report</p>
                      <p className="text-xs text-green-600">Evidence-Based</p>
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
              <p>{report.industry} | {report.businessLocation.state}, {report.businessLocation.country}</p>
              <p className="text-sm text-muted-foreground">{report.businessServices}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">RASBITA Score Components</h3>
                <div className="bg-purple-100 text-purple-900 font-bold px-3 py-1 rounded-full flex items-center">
                  <span>Overall: {report.rasbitaScore.total}%</span>
                  <span className="ml-1 text-xs px-2 py-0.5 bg-purple-800 text-white rounded-full">RASBITA™</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-primary/5 rounded-md p-2 border-l-4 border-red-500">
                  <p className="text-xs text-muted-foreground">Cybersecurity Incident Risk Score</p>
                  <p className="font-bold text-red-600">{report.rasbitaScore.categories.risk || report.rasbitaScore.categories.govern}</p>
                </div>
                <div className="bg-primary/5 rounded-md p-2 border-l-4 border-purple-500">
                  <p className="text-xs text-muted-foreground">Cybersecurity Gov & Mngt maturity level</p>
                  <p className="font-bold text-purple-600">{report.rasbitaScore.categories.securityControls || report.rasbitaScore.categories.protect}</p>
                </div>
                <div className="bg-primary/5 rounded-md p-2 border-l-4 border-green-500">
                  <p className="text-xs text-muted-foreground">NRRB (positive)</p>
                  <p className="font-bold text-green-600">{report.rasbitaScore.categories.architecture || report.rasbitaScore.categories.respond}</p>
                  <p className="text-[10px] text-muted-foreground">Positive value = spend makes sense</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-3">Summary Findings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="border rounded-md p-3 text-center">
                <div className="text-lg font-bold text-red-600">{report.vulnerabilities.critical.length}</div>
                <div className="text-sm">Critical Vulnerabilities</div>
                <div className="text-xs text-muted-foreground">Greater than 80% probability</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-lg font-bold text-orange-600">{report.findings.filter(f => f.severity === 'High').length}</div>
                <div className="text-sm">High Risks</div>
                <div className="text-xs text-muted-foreground">Between 60%-80% probability</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-lg font-bold text-amber-600">{report.findings.filter(f => f.severity === 'Medium').length}</div>
                <div className="text-sm">Medium Risks</div>
                <div className="text-xs text-muted-foreground">Between 30%-60% probability</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-lg font-bold text-green-600">{report.recommendations.immediate.length}</div>
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
            <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
              <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="risks">Risks & Vulnerabilities</TabsTrigger>
              <TabsTrigger value="architecture">Architecture Analysis</TabsTrigger>
              <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
              <TabsTrigger value="frameworks">Framework Control Gaps</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scorecard" className="space-y-4 pt-4">
              {/* Only display scorecard if the report has it */}
              {report.scorecard ? (
                <Scorecard scorecard={report.scorecard} reportType={report.reportType} />
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">Scorecard data is not available for this report.</p>
                </div>
              )}
            </TabsContent>
            
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
                    <li className="text-muted-foreground">No operational framework control gaps identified</li>
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
                    <li className="text-muted-foreground">No management framework control gaps identified</li>
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
                    <li className="text-muted-foreground">No technology framework control gaps identified</li>
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
    </>
  );
}