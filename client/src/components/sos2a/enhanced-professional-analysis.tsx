import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssessmentReport } from "@/lib/sos2a-types";
import { Shield, Building2, BarChart3, AlertTriangle, CheckCircle, Target } from "lucide-react";
import FivePillarGraphs from "./five-pillar-graphs";

interface EnhancedProfessionalAnalysisProps {
  report: AssessmentReport;
}

export default function EnhancedProfessionalAnalysis({ report }: EnhancedProfessionalAnalysisProps) {
  return (
    <div className="mt-8 border-t pt-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-3">
          <Shield className="h-8 w-8 text-primary mr-3" />
          <h2 className="text-3xl font-bold text-gray-900">Enhanced Professional Analysis</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Comprehensive business-ready cybersecurity assessment with 5-pillar visual scorecard and strategic recommendations
        </p>
      </div>

      <Tabs defaultValue="scorecard" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="executive" className="text-sm">Executive Summary</TabsTrigger>
          <TabsTrigger value="scorecard" className="text-sm">Visual Scorecard</TabsTrigger>
          <TabsTrigger value="pillargraphs" className="text-sm">5 Pillar Graphs</TabsTrigger>
          <TabsTrigger value="compliance" className="text-sm">Compliance</TabsTrigger>
          <TabsTrigger value="recommendations" className="text-sm">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="executive" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center text-2xl">
                <Building2 className="mr-3 h-6 w-6 text-primary" />
                Business Context Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Organization Profile</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Name:</span>
                      <span className="font-medium">{report.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry:</span>
                      <span className="font-medium">{report.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Services:</span>
                      <span className="font-medium">{report.businessServices}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assessment Type:</span>
                      <span className="capitalize font-medium">{report.reportType}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3">Cybersecurity Posture</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Overall Security Score:</span>
                      <div className="flex items-center">
                        <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                          <div 
                            className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                            style={{ width: `${report.securityScore}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-lg">{report.securityScore}%</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {report.securityScore >= 80 ? "Strong security posture with minor improvements needed" :
                       report.securityScore >= 60 ? "Moderate security posture requiring attention" :
                       report.securityScore >= 40 ? "Below average security posture needing significant improvement" :
                       "Critical security gaps requiring immediate attention"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scorecard" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center text-2xl">
                <BarChart3 className="mr-3 h-6 w-6 text-primary" />
                5-Pillar RASBITA Framework Visual Scorecard
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Comprehensive 500% Framework Capacity (5 Pillars × 100% = 500%/5 = 100% when complete)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                {[
                  { name: "Qualitative Assessment", score: report.qualitativeScore || 85, weight: "20%", status: "Always Included", color: "bg-emerald-500" },
                  { name: "Quantitative Analysis", score: report.quantitativeScore || 0, weight: "25%", status: "Deep Scan Required", color: "bg-gray-500" },
                  { name: "RASBITA Cost-Benefit", score: report.cbfScore || 0, weight: "25%", status: "Incident Data Required", color: "bg-blue-500" },
                  { name: "RASBITA Governance", score: report.rgmScore || 78, weight: "15%", status: "Always Included", color: "bg-purple-500" },
                  { name: "Architecture Threat Modeling", score: report.architectureScore || 0, weight: "15%", status: "Diagrams Required", color: "bg-orange-500" }
                ].map((pillar, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-semibold">{pillar.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>Weight: {pillar.weight}</span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            pillar.status === "Always Included" ? "bg-green-100 text-green-800" :
                            pillar.status.includes("Required") ? "bg-blue-100 text-blue-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {pillar.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {pillar.score > 0 ? (
                          <>
                            <div className="text-2xl font-bold">{pillar.score}%</div>
                            <div className={`text-sm px-2 py-1 rounded ${
                              pillar.score > 80 ? "bg-green-100 text-green-800" :
                              pillar.score > 60 ? "bg-yellow-100 text-yellow-800" :
                              pillar.score > 30 ? "bg-orange-100 text-orange-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {pillar.score > 80 ? ">80% Low Risk" :
                               pillar.score > 60 ? "60-80% Medium Risk" :
                               pillar.score > 30 ? "30-60% High Risk" :
                               "<30% Critical Risk"}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-xl font-bold text-gray-400">N/A</div>
                            <div className="text-xs text-gray-500">Data Required</div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${pillar.score > 0 ? pillar.color : 'bg-gray-300'}`}
                        style={{ width: `${pillar.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pillargraphs" className="space-y-6">
          <FivePillarGraphs report={report} />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "PCI-DSS", status: "Partially Compliant", description: "Payment card industry data security", requirements: ["Secure payment processing", "Cardholder data protection", "Regular security testing"] },
              { name: "HIPAA", status: "Non-Compliant", description: "Healthcare data protection", requirements: ["Patient data encryption", "Access controls", "Audit logging"] },
              { name: "CMMC", status: "Level 2", description: "Cybersecurity maturity model", requirements: ["Access control", "Incident response", "Risk management"] },
              { name: "GDPR/CCPA", status: "Compliant", description: "Data privacy regulations", requirements: ["Consent management", "Data portability", "Breach notification"] },
              { name: "SOC 2", status: "In Progress", description: "Service organization controls", requirements: ["Security controls", "Availability", "Confidentiality"] },
              { name: "ISO 27001", status: "Planning", description: "Information security management", requirements: ["ISMS implementation", "Risk assessment", "Continuous improvement"] }
            ].map((framework, index) => (
              <Card key={index} className="border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{framework.name}</CardTitle>
                      <CardDescription className="text-sm">{framework.description}</CardDescription>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      framework.status === "Compliant" ? "bg-green-100 text-green-800" :
                      framework.status === "Partially Compliant" || framework.status === "Level 2" ? "bg-yellow-100 text-yellow-800" :
                      framework.status === "In Progress" || framework.status === "Planning" ? "bg-blue-100 text-blue-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {framework.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div>
                    <h5 className="font-medium text-sm mb-2">Key Requirements:</h5>
                    <ul className="text-sm space-y-1">
                      {framework.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid gap-6">
            <Card className="border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="flex items-center text-red-800">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Critical Security Threats & Immediate Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Identified Threats</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 mt-1.5"></span>
                          <span>Unencrypted sensitive data transmission</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 mt-1.5"></span>
                          <span>Insufficient access controls and monitoring</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 mt-1.5"></span>
                          <span>Outdated security policies and procedures</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 mt-1.5"></span>
                          <span>Inadequate incident response capabilities</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Immediate Actions (0-30 days)</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                          <span>Implement multi-factor authentication</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                          <span>Conduct security awareness training</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                          <span>Update and patch all systems</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                          <span>Establish backup and recovery procedures</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center text-blue-800">
                  <Target className="mr-2 h-5 w-5" />
                  Strategic Security Improvements
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Short-term (30-90 days)</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Enhanced monitoring systems</li>
                      <li>• Security policy updates</li>
                      <li>• Vendor security assessments</li>
                      <li>• Regular vulnerability scans</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Medium-term (3-6 months)</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Security architecture review</li>
                      <li>• Compliance framework implementation</li>
                      <li>• Advanced threat detection</li>
                      <li>• Security metrics program</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Long-term (6-12 months)</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Zero-trust architecture</li>
                      <li>• Security automation</li>
                      <li>• Continuous compliance monitoring</li>
                      <li>• Security culture transformation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}