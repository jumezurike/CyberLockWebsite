// SECURE BACKUP - July 17th Working Baseline
// Date: July 22, 2025 21:10
// Status: FULLY FUNCTIONAL - DO NOT MODIFY
// Contains: Complete working report-display.tsx (504 lines) with all errors fixed

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
                        Step 3 of 4
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-primary">
                        75%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div style={{ width: "75%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="line-through">Complete Matrix Population</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="line-through">Review Assessment Findings</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="font-medium">Generate Preliminary Report</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                    <span className="text-gray-400">Schedule Comprehensive Assessment</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Business Assessment Context */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Business Assessment Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Organization Overview</h3>
                <p className="font-medium">{report.businessName}</p>
                <p>{report.industry}</p>
                <p className="text-sm text-muted-foreground">Employee Count: {report.employeeCount}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Assessment Timeline</h3>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Created: {formatDate(report.createdAt)}</span>
                </div>
                {report.completedAt && (
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Completed: {formatDate(report.completedAt)}</span>
                  </div>
                )}
                <div className="text-sm">
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    report.reportType === 'preliminary' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {report.reportType === 'preliminary' ? 'Preliminary Assessment' : 'Comprehensive Assessment'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Measures & Concerns */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Current Security Posture</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Security Measures in Place</h3>
                <ul className="space-y-1">
                  {(report.securityMeasures || []).map((measure, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {measure}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Primary Security Concerns</h3>
                <ul className="space-y-1">
                  {(report.primaryConcerns || []).map((concern, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      {concern}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
            <div className="bg-gray-50 p-3 rounded border">
              <p className="font-medium">{report.contactInfo?.name}</p>
              <p className="text-sm">{report.contactInfo?.email}</p>
              {report.contactInfo?.phone && (
                <p className="text-sm">{report.contactInfo.phone}</p>
              )}
            </div>
          </div>
          
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
                  <p className="font-bold">{report.rasbitaScore?.categories?.risk || 'N/A'}</p>
                </div>
                <div className="bg-primary/5 rounded p-2">
                  <p className="text-xs text-muted-foreground">Security</p>
                  <p className="font-bold">{report.rasbitaScore?.categories?.securityControls || 'N/A'}</p>
                </div>
                <div className="bg-primary/5 rounded p-2">
                  <p className="text-xs text-muted-foreground">Architecture</p>
                  <p className="font-bold">{report.rasbitaScore?.categories?.architecture || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-3">Summary Findings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="border rounded-md p-3 text-center">
                <div className="text-lg font-bold text-red-500">{(report.findings || []).filter(f => f.severity === 'High').length}</div>
                <div className="text-sm">High Risks</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-lg font-bold text-orange-500">{(report.findings || []).filter(f => f.severity === 'Medium').length}</div>
                <div className="text-sm">Medium Risks</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-lg font-bold text-amber-500">{(report.vulnerabilities?.critical || []).length}</div>
                <div className="text-sm">Critical Vulnerabilities</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-lg font-bold text-blue-500">{(report.recommendations?.immediate || []).length}</div>
                <div className="text-sm">Immediate Actions</div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="scorecard" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
              <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="risks">Risks & Vulnerabilities</TabsTrigger>
              <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
              <TabsTrigger value="frameworks">Framework Gaps</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scorecard" className="space-y-4 pt-4">
              {/* Only display scorecard if the report has it */}
              {report.scorecard ? (
                <Scorecard scorecard={report.scorecard} reportType={report.reportType} report={report} />
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
                  {(report.recommendations?.immediate || []).map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Short Term (30-90 days)</h3>
                <ul className="space-y-2 list-disc pl-5">
                  {(report.recommendations?.shortTerm || []).map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Long Term (6-12 months)</h3>
                <ul className="space-y-2 list-disc pl-5">
                  {(report.recommendations?.longTerm || []).map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="risks" className="space-y-4 pt-4">
              <div>
                <h3 className="font-medium mb-2">Security Findings</h3>
                <div className="space-y-3">
                  {(report.findings || []).map((finding, index) => (
                    <div key={index} className="border-l-4 border-l-red-500 pl-4 py-2">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium">{finding.category}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          finding.severity === 'High' ? 'bg-red-100 text-red-800' :
                          finding.severity === 'Medium' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {finding.severity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{finding.description}</p>
                      <p className="text-sm">{finding.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Vulnerabilities</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-red-600 font-medium mb-2">Critical ({(report.vulnerabilities?.critical || []).length})</h4>
                    <div className="space-y-2">
                      {(report.vulnerabilities?.critical || []).map((vuln, index) => (
                        <div key={index} className="text-sm bg-red-50 p-2 rounded border-l-4 border-l-red-500">
                          {vuln}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-orange-600 font-medium mb-2">High ({(report.vulnerabilities?.high || []).length})</h4>
                    <div className="space-y-2">
                      {(report.vulnerabilities?.high || []).map((vuln, index) => (
                        <div key={index} className="text-sm bg-orange-50 p-2 rounded border-l-4 border-l-orange-500">
                          {vuln}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-yellow-600 font-medium mb-2">Medium ({(report.vulnerabilities?.medium || []).length})</h4>
                    <div className="space-y-2">
                      {(report.vulnerabilities?.medium || []).map((vuln, index) => (
                        <div key={index} className="text-sm bg-yellow-50 p-2 rounded border-l-4 border-l-yellow-500">
                          {vuln}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="compliance" className="space-y-4 pt-4">
              <div>
                <h3 className="font-medium mb-2">Industry Standards</h3>
                <div className="space-y-3">
                  {(report.complianceStatus?.standards || []).map((standard, index) => (
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
                  {(report.complianceStatus?.regulations || []).map((regulation, index) => (
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
                  {(report.frameworkGaps?.operations || []).length > 0 ? (
                    (report.frameworkGaps?.operations || []).map((gap, index) => (
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
                  {(report.frameworkGaps?.management || []).length > 0 ? (
                    (report.frameworkGaps?.management || []).map((gap, index) => (
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
                  {(report.frameworkGaps?.technology || []).length > 0 ? (
                    (report.frameworkGaps?.technology || []).map((gap, index) => (
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
            <Button 
              variant="default" 
              onClick={() => setEvidenceDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Comprehensive Assessment
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="border-green-600 text-green-600 hover:bg-green-50"
            onClick={() => {
              const element = document.createElement('a');
              const file = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
              element.href = URL.createObjectURL(file);
              element.download = `${report.businessName || 'assessment'}-report.json`;
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Evidence Collection Dialog */}
      <Dialog open={evidenceDialog} onOpenChange={setEvidenceDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Comprehensive Assessment</DialogTitle>
            <DialogDescription>
              To proceed with a comprehensive assessment, your organization needs to implement 
              the recommended security measures and collect evidence for 6 months.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Next Steps:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Implement recommended security controls</li>
                <li>Deploy SOC monitoring solutions</li>
                <li>Establish incident response procedures</li>
                <li>Begin 6-month evidence collection period</li>
                <li>Schedule comprehensive assessment review</li>
              </ul>
            </div>
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Implementation Required</AlertTitle>
              <AlertDescription className="text-blue-700">
                Evidence collection requires active implementation of security measures.
                Contact our team to begin the comprehensive assessment process.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEvidenceDialog(false)}>
              Close
            </Button>
            <Button 
              onClick={() => {
                window.open('mailto:info@cyberlockx.xyz?subject=Comprehensive Assessment Request', '_blank');
                setEvidenceDialog(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FileText className="mr-2 h-4 w-4" />
              Contact Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}