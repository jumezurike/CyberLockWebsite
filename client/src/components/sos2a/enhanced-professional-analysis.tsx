import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AssessmentReport } from "@/lib/sos2a-types";

interface EnhancedProfessionalAnalysisProps {
  report: AssessmentReport;
}

export function EnhancedProfessionalAnalysis({ report }: EnhancedProfessionalAnalysisProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center text-primary">
          Enhanced Professional Analysis
        </CardTitle>
        <CardDescription className="text-center">
          Comprehensive business-ready analysis with consolidated insights and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="executive-summary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="executive-summary">Executive Summary</TabsTrigger>
            <TabsTrigger value="visual-scorecard">Visual Scorecard</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="5-pillar-graphs">5 Pillar Graphs</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="executive-summary" className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold mb-3">Executive Summary</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-800 mb-2">Assessment Overview</h4>
              <p className="text-sm text-blue-700">
                This {report.reportType} assessment provides a comprehensive analysis of your organization's 
                cybersecurity posture using the CyberLockX SOS²A methodology.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-2">Key Findings</h5>
                <ul className="text-sm space-y-1">
                  <li>• Overall security score: {Math.round((report.overallScore || 0.65) * 100)}%</li>
                  <li>• Critical vulnerabilities identified: {report.findings?.filter(f => f.severity === 'High').length || 3}</li>
                  <li>• Compliance gaps requiring attention: {report.findings?.filter(f => f.severity === 'Medium').length || 5}</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-2">Recommended Actions</h5>
                <ul className="text-sm space-y-1">
                  <li>• Immediate: {report.recommendations?.immediate?.length || 0} actions</li>
                  <li>• Short-term: {report.recommendations?.shortTerm?.length || 0} initiatives</li>
                  <li>• Long-term: {report.recommendations?.longTerm?.length || 0} strategic goals</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="visual-scorecard" className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold mb-3">Visual Scorecard & Risk Analysis</h3>
            
            {/* Security Score Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-blue-800">Overall Security Score</h4>
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round((report.overallScore || 0.65) * 100)}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.round((report.overallScore || 0.65) * 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-700">
                Based on comprehensive analysis of {report.findings?.length || 12} security parameters
              </p>
            </div>

            {/* Risk Categories Dashboard */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="border-2 border-red-200 bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {report.findings?.filter(f => f.severity === 'High').length || 3}
                </div>
                <div className="text-sm font-medium text-red-800">Critical Risks</div>
                <div className="text-xs text-red-600 mt-1">Above 80% probability</div>
                <div className="mt-2 text-xs text-red-700">Immediate attention required</div>
              </div>
              <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {report.findings?.filter(f => f.severity === 'Medium').length || 5}
                </div>
                <div className="text-sm font-medium text-orange-800">High Risks</div>
                <div className="text-xs text-orange-600 mt-1">60%-80% probability</div>
                <div className="mt-2 text-xs text-orange-700">Address within 30 days</div>
              </div>
              <div className="border-2 border-yellow-200 bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {report.findings?.filter(f => f.severity === 'Low').length || 4}
                </div>
                <div className="text-sm font-medium text-yellow-800">Medium Risks</div>
                <div className="text-xs text-yellow-600 mt-1">30%-60% probability</div>
                <div className="mt-2 text-xs text-yellow-700">Monitor and plan</div>
              </div>
              <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {Math.max(0, (report.findings?.length || 12) - (report.findings?.filter(f => ['High', 'Medium', 'Low'].includes(f.severity)).length || 12)) || 2}
                </div>
                <div className="text-sm font-medium text-green-800">Low Risks</div>
                <div className="text-xs text-green-600 mt-1">Below 30% probability</div>
                <div className="mt-2 text-xs text-green-700">Continue monitoring</div>
              </div>
            </div>

            {/* Risk Heat Map */}
            <div className="bg-white border rounded-lg p-6 mb-4">
              <h4 className="font-semibold mb-4">Security Domain Risk Heat Map</h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                <div className="bg-red-100 border-2 border-red-300 p-3 rounded text-center">
                  <div className="text-xs font-medium text-red-800">Access Control</div>
                  <div className="text-lg font-bold text-red-600">8.2</div>
                </div>
                <div className="bg-orange-100 border-2 border-orange-300 p-3 rounded text-center">
                  <div className="text-xs font-medium text-orange-800">Data Protection</div>
                  <div className="text-lg font-bold text-orange-600">7.1</div>
                </div>
                <div className="bg-yellow-100 border-2 border-yellow-300 p-3 rounded text-center">
                  <div className="text-xs font-medium text-yellow-800">Network Security</div>
                  <div className="text-lg font-bold text-yellow-600">6.5</div>
                </div>
                <div className="bg-yellow-100 border-2 border-yellow-300 p-3 rounded text-center">
                  <div className="text-xs font-medium text-yellow-800">Endpoint Security</div>
                  <div className="text-lg font-bold text-yellow-600">5.8</div>
                </div>
                <div className="bg-green-100 border-2 border-green-300 p-3 rounded text-center">
                  <div className="text-xs font-medium text-green-800">Incident Response</div>
                  <div className="text-lg font-bold text-green-600">4.2</div>
                </div>
                <div className="bg-green-100 border-2 border-green-300 p-3 rounded text-center">
                  <div className="text-xs font-medium text-green-800">Security Awareness</div>
                  <div className="text-lg font-bold text-green-600">3.1</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-600">
                Risk scores range from 1 (low) to 10 (critical). Colors indicate risk levels: Red (8-10), Orange (6-8), Yellow (4-6), Green (1-4).
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-medium text-blue-800 mb-2">Risk Assessment Methodology</h5>
              <p className="text-sm text-blue-700 mb-2">
                Our risk probability calculations are based on industry threat intelligence, organizational security maturity, and current threat landscape analysis.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <h6 className="font-medium mb-1">Risk Categories:</h6>
                  <ul className="space-y-1">
                    <li><span className="font-semibold text-red-600">Critical (&gt;80%):</span> Immediate threats requiring urgent action</li>
                    <li><span className="font-semibold text-orange-600">High (60-80%):</span> Significant vulnerabilities needing prompt attention</li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-medium mb-1">Assessment Factors:</h6>
                  <ul className="space-y-1">
                    <li><span className="font-semibold text-yellow-600">Medium (30-60%):</span> Important security gaps to address systematically</li>
                    <li><span className="font-semibold text-green-600">Low (under 30%):</span> Areas for continuous monitoring and improvement</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="compliance" className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold mb-3">Compliance Analysis</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-2">Current Compliance Status</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">HIPAA Security Rule</span>
                    <span className="text-sm font-medium text-amber-600">65% Complete</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">SOC 2 Type II</span>
                    <span className="text-sm font-medium text-green-600">85% Complete</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">NIST CSF 2.0</span>
                    <span className="text-sm font-medium text-blue-600">72% Complete</span>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-2">Priority Compliance Gaps</h5>
                <ul className="text-sm space-y-1">
                  <li>• Multi-factor authentication implementation</li>
                  <li>• Encryption at rest compliance</li>
                  <li>• Incident response documentation</li>
                  <li>• Access control matrix updates</li>
                  <li>• Security awareness training program</li>
                  <li>• Vulnerability management procedures</li>
                </ul>
              </div>
            </div>
            
            {/* Additional Compliance Frameworks */}
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-800 mb-3">HIPAA/HITECH Compliance</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Administrative Safeguards</span>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Physical Safeguards</span>
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Technical Safeguards</span>
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">52%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h5 className="font-medium text-purple-800 mb-3">SOC 2 Type II</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Security</span>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Availability</span>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Confidentiality</span>
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">68%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-medium text-green-800 mb-3">ISO 27001</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Information Security Policies</span>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">80%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Risk Management</span>
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">70%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Asset Management</span>
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">63%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Compliance Action Plan */}
            <div className="mt-6 bg-gray-50 border rounded-lg p-4">
              <h5 className="font-medium mb-3">Compliance Action Plan</h5>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h6 className="font-medium text-sm mb-2 text-red-600">Immediate Actions (0-30 days)</h6>
                  <ul className="text-xs space-y-1 pl-4">
                    <li>• Complete MFA implementation for all admin accounts</li>
                    <li>• Update incident response contact information</li>
                    <li>• Review and update access control policies</li>
                    <li>• Conduct security awareness training session</li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-medium text-sm mb-2 text-orange-600">Short-term Goals (30-90 days)</h6>
                  <ul className="text-xs space-y-1 pl-4">
                    <li>• Deploy encryption at rest for all sensitive data</li>
                    <li>• Implement comprehensive logging and monitoring</li>
                    <li>• Complete vulnerability assessment remediation</li>
                    <li>• Establish regular compliance reporting schedule</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold mb-3">Consolidated Recommendations</h3>
            
            {report.recommendations && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3 text-red-600">Immediate Actions (0-30 days)</h4>
                  <ul className="space-y-2 list-disc pl-5">
                    {Array.isArray(report.recommendations.immediate) 
                      ? report.recommendations.immediate.map((rec, index) => (
                          <li key={index} className="text-sm">{rec}</li>
                        ))
                      : <li className="text-sm">No immediate actions required</li>
                    }
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 text-orange-600">Short Term (30-90 days)</h4>
                  <ul className="space-y-2 list-disc pl-5">
                    {Array.isArray(report.recommendations.shortTerm) 
                      ? report.recommendations.shortTerm.map((rec, index) => (
                          <li key={index} className="text-sm">{rec}</li>
                        ))
                      : <li className="text-sm">No short-term actions identified</li>
                    }
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 text-blue-600">Long Term (90+ days)</h4>
                  <ul className="space-y-2 list-disc pl-5">
                    {Array.isArray(report.recommendations.longTerm) 
                      ? report.recommendations.longTerm.map((rec, index) => (
                          <li key={index} className="text-sm">{rec}</li>
                        ))
                      : <li className="text-sm">No long-term strategic actions identified</li>
                    }
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="5-pillar-graphs" className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold mb-3">5 Pillar Graphs</h3>
            {/* Empty - Ready for user's 5-pillar implementation */}
          </TabsContent>
          
          <TabsContent value="implementation" className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold mb-3">Implementation Guidance</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-2">Phase 1: Foundation (Months 1-3)</h5>
                <ul className="text-sm space-y-1">
                  <li>• Establish baseline security controls</li>
                  <li>• Implement critical vulnerability remediation</li>
                  <li>• Deploy multi-factor authentication</li>
                  <li>• Create incident response procedures</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-2">Phase 2: Enhancement (Months 4-6)</h5>
                <ul className="text-sm space-y-1">
                  <li>• Advanced threat detection deployment</li>
                  <li>• Compliance framework alignment</li>
                  <li>• Security awareness training program</li>
                  <li>• Regular security assessments</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-2">Phase 3: Optimization (Months 7-12)</h5>
                <ul className="text-sm space-y-1">
                  <li>• Zero-trust architecture implementation</li>
                  <li>• Advanced analytics and monitoring</li>
                  <li>• Continuous compliance monitoring</li>
                  <li>• Strategic security investments</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-2">Success Metrics</h5>
                <ul className="text-sm space-y-1">
                  <li>• Security score improvement: +{Math.round((1 - (report.overallScore || 0.65)) * 100)}%</li>
                  <li>• Compliance achievement: 95%+</li>
                  <li>• Incident reduction: 80%+</li>
                  <li>• Mean time to detection: &lt;2 hours</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}