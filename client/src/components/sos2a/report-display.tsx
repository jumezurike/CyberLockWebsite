import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AssessmentReport } from "@/lib/sos2a-types";

interface ReportDisplayProps {
  report: AssessmentReport;
  onBack: () => void;
}

export default function ReportDisplay({ report, onBack }: ReportDisplayProps) {
  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Assessment Report</CardTitle>
          <CardDescription>
            {report.reportType === 'comprehensive' ? 'Comprehensive' : 'Preliminary'} security assessment report for {report.businessServices}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Generated on: {formatDate(report.createdAt)}</p>
              <p className="text-sm text-muted-foreground">Report ID: {report.id}</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Security Score</span>
              <div className="flex items-center">
                <Progress value={report.securityScore} className="h-2 w-24 mr-2" />
                <span className="font-bold">{report.securityScore}%</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Business:</p>
              <p>{report.businessServices}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Industry:</p>
              <p>{report.industry}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Location:</p>
              <p>{report.businessLocation.state}, {report.businessLocation.country}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Assessment Type:</p>
              <p className="capitalize">{report.reportType}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid grid-cols-6 mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="mitre">MITRE ATT&CK</TabsTrigger>
          <TabsTrigger value="rasbita">RASBITA Score</TabsTrigger>
        </TabsList>
        
        {/* Summary Tab */}
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
              <CardDescription>Overview of security assessment findings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Operation Modes</h3>
                <div className="flex flex-wrap gap-2">
                  {report.operationModes.map((mode, index) => (
                    <Badge key={index} className="capitalize">{mode}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Internet Presence</h3>
                <div className="flex flex-wrap gap-2">
                  {report.internetPresence.map((presence, index) => (
                    <Badge key={index} className="capitalize">{presence}</Badge>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-4 border rounded-md">
                    <span className="text-3xl font-bold text-primary">{report.securityScore}%</span>
                    <span className="text-sm text-muted-foreground text-center">Security Score</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-md">
                    <span className="text-3xl font-bold text-primary">{report.findings.filter(f => f.severity === 'High').length}</span>
                    <span className="text-sm text-muted-foreground text-center">High Risks</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-md">
                    <span className="text-3xl font-bold text-primary">{report.vulnerabilities.critical.length + report.vulnerabilities.high.length}</span>
                    <span className="text-sm text-muted-foreground text-center">Critical/High Vulnerabilities</span>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-md">
                    <span className="text-3xl font-bold text-primary">{report.rasbitaScore.total}</span>
                    <span className="text-sm text-muted-foreground text-center">RASBITA Score</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Recommendations Summary</h3>
                <Accordion type="single" collapsible>
                  <AccordionItem value="immediate">
                    <AccordionTrigger>
                      <span className="font-medium">Immediate Actions ({report.recommendations.immediate.length})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {report.recommendations.immediate.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="short-term">
                    <AccordionTrigger>
                      <span className="font-medium">Short-Term Actions ({report.recommendations.shortTerm.length})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {report.recommendations.shortTerm.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="long-term">
                    <AccordionTrigger>
                      <span className="font-medium">Long-Term Actions ({report.recommendations.longTerm.length})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {report.recommendations.longTerm.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Risks Tab */}
        <TabsContent value="risks">
          <Card>
            <CardHeader>
              <CardTitle>Security Risks & Vulnerabilities</CardTitle>
              <CardDescription>Identified risks and vulnerabilities in your infrastructure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Security Risks</h3>
                <div className="space-y-4">
                  {report.findings.map((finding, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{finding.title}</h4>
                        <Badge variant={finding.severity === 'High' ? 'destructive' : finding.severity === 'Medium' ? 'default' : 'secondary'}>
                          {finding.severity} Risk
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{finding.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Vulnerabilities</h3>
                <Accordion type="single" collapsible>
                  <AccordionItem value="critical">
                    <AccordionTrigger>
                      <span className="font-medium text-destructive">Critical Vulnerabilities ({report.vulnerabilities.critical.length})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {report.vulnerabilities.critical.map((vuln, index) => (
                          <li key={index}>{vuln}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="high">
                    <AccordionTrigger>
                      <span className="font-medium text-orange-500">High Vulnerabilities ({report.vulnerabilities.high.length})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {report.vulnerabilities.high.map((vuln, index) => (
                          <li key={index}>{vuln}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="medium">
                    <AccordionTrigger>
                      <span className="font-medium text-yellow-500">Medium Vulnerabilities ({report.vulnerabilities.medium.length})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {report.vulnerabilities.medium.map((vuln, index) => (
                          <li key={index}>{vuln}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="low">
                    <AccordionTrigger>
                      <span className="font-medium">Low Vulnerabilities ({report.vulnerabilities.low.length})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {report.vulnerabilities.low.map((vuln, index) => (
                          <li key={index}>{vuln}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Controls Tab */}
        <TabsContent value="controls">
          <Card>
            <CardHeader>
              <CardTitle>Security Controls Assessment</CardTitle>
              <CardDescription>Analysis of security controls implementation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Framework Gaps</h3>
                <Accordion type="single" collapsible>
                  <AccordionItem value="operations">
                    <AccordionTrigger>
                      <span className="font-medium">Operations Controls</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      {report.frameworkGaps.operations.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-2">
                          {report.frameworkGaps.operations.map((gap, index) => (
                            <li key={index}>{gap}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No operation control gaps identified.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="management">
                    <AccordionTrigger>
                      <span className="font-medium">Management Controls</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      {report.frameworkGaps.management.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-2">
                          {report.frameworkGaps.management.map((gap, index) => (
                            <li key={index}>{gap}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No management control gaps identified.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="technology">
                    <AccordionTrigger>
                      <span className="font-medium">Technology Controls</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      {report.frameworkGaps.technology.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-2">
                          {report.frameworkGaps.technology.map((gap, index) => (
                            <li key={index}>{gap}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No technology control gaps identified.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">OS Hardening Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">STIG Status</h4>
                      <Badge variant={report.osHardeningStatus.stig.compliant ? 'default' : 'outline'}>
                        {report.osHardeningStatus.stig.compliant ? 'Compliant' : 'Non-Compliant'}
                      </Badge>
                    </div>
                    {report.osHardeningStatus.stig.gaps.length > 0 && (
                      <div className="mt-2">
                        <h5 className="text-sm font-medium">Gaps:</h5>
                        <ul className="list-disc pl-5 text-sm">
                          {report.osHardeningStatus.stig.gaps.map((gap, index) => (
                            <li key={index}>{gap}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">SCAP Status</h4>
                      <Badge variant={report.osHardeningStatus.scap.compliant ? 'default' : 'outline'}>
                        {report.osHardeningStatus.scap.compliant ? 'Compliant' : 'Non-Compliant'}
                      </Badge>
                    </div>
                    {report.osHardeningStatus.scap.gaps.length > 0 && (
                      <div className="mt-2">
                        <h5 className="text-sm font-medium">Gaps:</h5>
                        <ul className="list-disc pl-5 text-sm">
                          {report.osHardeningStatus.scap.gaps.map((gap, index) => (
                            <li key={index}>{gap}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Policy Document Status</h3>
                <Accordion type="single" collapsible>
                  <AccordionItem value="existing">
                    <AccordionTrigger>
                      <span className="font-medium">Existing Documents ({report.policyDocumentStatus.existing.length})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      {report.policyDocumentStatus.existing.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-2">
                          {report.policyDocumentStatus.existing.map((doc, index) => (
                            <li key={index}>{doc}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No existing policy documents identified.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="missing">
                    <AccordionTrigger>
                      <span className="font-medium">Missing Documents ({report.policyDocumentStatus.missing.length})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      {report.policyDocumentStatus.missing.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-2">
                          {report.policyDocumentStatus.missing.map((doc, index) => (
                            <li key={index}>{doc}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No missing policy documents identified.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="recommendations">
                    <AccordionTrigger>
                      <span className="font-medium">Recommendations ({report.policyDocumentStatus.recommendations.length})</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      {report.policyDocumentStatus.recommendations.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-2">
                          {report.policyDocumentStatus.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No policy document recommendations available.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Compliance Tab */}
        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>Status of compliance with standards, regulations, and frameworks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Standards</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {report.complianceStatus.standards.map((item, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{item.standard}</h4>
                        <Badge variant={item.status === 'Compliant' ? 'default' : 'outline'}>
                          {item.status}
                        </Badge>
                      </div>
                      {item.gaps.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium">Gaps:</h5>
                          <ul className="list-disc pl-5 text-sm">
                            {item.gaps.map((gap, gapIndex) => (
                              <li key={gapIndex}>{gap}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Regulations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {report.complianceStatus.regulations.map((item, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{item.standard}</h4>
                        <Badge variant={item.status === 'Compliant' ? 'default' : 'outline'}>
                          {item.status}
                        </Badge>
                      </div>
                      {item.gaps.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium">Gaps:</h5>
                          <ul className="list-disc pl-5 text-sm">
                            {item.gaps.map((gap, gapIndex) => (
                              <li key={gapIndex}>{gap}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Frameworks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {report.complianceStatus.frameworks.map((item, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{item.standard}</h4>
                        <Badge variant={item.status === 'Compliant' ? 'default' : 'outline'}>
                          {item.status}
                        </Badge>
                      </div>
                      {item.gaps.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium">Gaps:</h5>
                          <ul className="list-disc pl-5 text-sm">
                            {item.gaps.map((gap, gapIndex) => (
                              <li key={gapIndex}>{gap}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* MITRE ATT&CK Tab */}
        <TabsContent value="mitre">
          <Card>
            <CardHeader>
              <CardTitle>MITRE ATT&CK Coverage</CardTitle>
              <CardDescription>Analysis of MITRE ATT&CK tactics and techniques</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Covered Techniques</h3>
                {report.mitreAttackCoverage.covered.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {report.mitreAttackCoverage.covered.map((technique, index) => (
                      <Badge key={index} variant="default">{technique}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No MITRE ATT&CK techniques are currently covered.</p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Vulnerable Techniques</h3>
                {report.mitreAttackCoverage.vulnerable.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {report.mitreAttackCoverage.vulnerable.map((technique, index) => (
                      <Badge key={index} variant="outline">{technique}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No vulnerable MITRE ATT&CK techniques identified.</p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                {report.mitreAttackCoverage.recommendations.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {report.mitreAttackCoverage.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No MITRE ATT&CK recommendations available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* RASBITA Score Tab */}
        <TabsContent value="rasbita">
          <Card>
            <CardHeader>
              <CardTitle>RASBITA Score Analysis</CardTitle>
              <CardDescription>Comprehensive RASBITA scoring methodology breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 rounded-full border-8 border-primary flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold">{report.rasbitaScore.total}</span>
                </div>
                <h3 className="text-xl font-semibold">Overall RASBITA Score</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border rounded-md p-4 flex flex-col items-center">
                  <h4 className="text-sm text-muted-foreground mb-2">Risk</h4>
                  <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center">
                    <span className="text-xl font-bold">{report.rasbitaScore.categories.risk}</span>
                  </div>
                </div>
                <div className="border rounded-md p-4 flex flex-col items-center">
                  <h4 className="text-sm text-muted-foreground mb-2">Adversarial Insight</h4>
                  <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center">
                    <span className="text-xl font-bold">{report.rasbitaScore.categories.adversarialInsight}</span>
                  </div>
                </div>
                <div className="border rounded-md p-4 flex flex-col items-center">
                  <h4 className="text-sm text-muted-foreground mb-2">Security Controls</h4>
                  <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center">
                    <span className="text-xl font-bold">{report.rasbitaScore.categories.securityControls}</span>
                  </div>
                </div>
                <div className="border rounded-md p-4 flex flex-col items-center">
                  <h4 className="text-sm text-muted-foreground mb-2">Business Impact</h4>
                  <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center">
                    <span className="text-xl font-bold">{report.rasbitaScore.categories.businessImpact}</span>
                  </div>
                </div>
                <div className="border rounded-md p-4 flex flex-col items-center">
                  <h4 className="text-sm text-muted-foreground mb-2">Information Assurance</h4>
                  <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center">
                    <span className="text-xl font-bold">{report.rasbitaScore.categories.informationAssurance}</span>
                  </div>
                </div>
                <div className="border rounded-md p-4 flex flex-col items-center">
                  <h4 className="text-sm text-muted-foreground mb-2">Threat Intelligence</h4>
                  <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center">
                    <span className="text-xl font-bold">{report.rasbitaScore.categories.threatIntelligence}</span>
                  </div>
                </div>
                <div className="border rounded-md p-4 flex flex-col items-center">
                  <h4 className="text-sm text-muted-foreground mb-2">Architecture</h4>
                  <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center">
                    <span className="text-xl font-bold">{report.rasbitaScore.categories.architecture}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-muted rounded-md">
                <h3 className="text-lg font-semibold mb-2">About RASBITA Scoring</h3>
                <p className="text-sm">
                  The RASBITA scoring methodology provides a comprehensive assessment of security posture by evaluating seven critical domains: Risk, Adversarial Insight, Security Controls, Business Impact, Information Assurance, Threat Intelligence, and Architecture. Each domain is scored on a scale of 0-100, with the overall RASBITA score representing a balanced average of all domains.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back to Matrix
        </Button>
        <Button onClick={() => window.print()}>
          Print Report
        </Button>
      </div>
    </div>
  );
}