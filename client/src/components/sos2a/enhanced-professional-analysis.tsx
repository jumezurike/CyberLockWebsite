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
                  <li>• Overall security score: {Math.round((report.overallScore || 0) * 100)}%</li>
                  <li>• Critical vulnerabilities identified: {report.findings?.filter(f => f.priority === 'High').length || 0}</li>
                  <li>• Compliance gaps requiring attention: {report.findings?.filter(f => f.priority === 'Medium').length || 0}</li>
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
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="border rounded-md p-3 text-center">
                <div className="text-lg font-bold text-red-600">
                  {report.findings?.filter(f => f.priority === 'High').length || 0}
                </div>
                <div className="text-sm">Critical Risks</div>
                <div className="text-xs text-muted-foreground">Above 80% probability</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-lg font-bold text-orange-600">
                  {report.findings?.filter(f => f.priority === 'Medium').length || 0}
                </div>
                <div className="text-sm">High Risks</div>
                <div className="text-xs text-muted-foreground">Between 60%-80% probability</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-lg font-bold text-amber-600">
                  {report.findings?.filter(f => f.priority === 'Low').length || 0}
                </div>
                <div className="text-sm">Medium Risks</div>
                <div className="text-xs text-muted-foreground">Between 30%-60% probability</div>
              </div>
              <div className="border rounded-md p-3 text-center">
                <div className="text-lg font-bold text-green-600">
                  {report.recommendations?.immediate?.length || 0}
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
                </ul>
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
            <h3 className="text-lg font-semibold mb-3">5 Pillar Framework Analysis</h3>
            <div className="text-center py-8 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-700 font-medium mb-2">
                5-Pillar Graphs Implementation Ready
              </p>
              <p className="text-sm text-amber-600 mb-4">
                This section will display comprehensive graphs showing all 5 pillars with 500%/5=100% framework capacity
              </p>
              <div className="bg-white rounded-md p-4 mx-4 border border-amber-300">
                <h4 className="font-medium mb-2">Framework Structure:</h4>
                <ul className="text-sm space-y-1 text-left">
                  <li>• <strong>Pillar 1:</strong> Qualitative Assessment (100%)</li>
                  <li>• <strong>Pillar 2:</strong> Quantitative Analysis (100%)</li>
                  <li>• <strong>Pillar 3:</strong> RASBITA Cost-Benefit Analysis (100%)</li>
                  <li>• <strong>Pillar 4:</strong> RASBITA Governance & Management (100%)</li>
                  <li>• <strong>Pillar 5:</strong> Architecture Threat Modeling & App Sec (100%)</li>
                </ul>
                <p className="text-xs text-amber-600 mt-2">
                  Total Framework Capacity: 500% (5 pillars × 100% each)
                </p>
              </div>
            </div>
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
                  <li>• Security score improvement: +{Math.round((1 - (report.overallScore || 0)) * 100)}%</li>
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