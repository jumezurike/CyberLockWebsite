import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  AlertCircle, CheckCircle, Info, AlertTriangle, ArrowRight,
  BarChart2, PieChart as PieChartIcon, Activity
} from 'lucide-react';

import { Sos2aFormData } from '@/lib/sos2a-types';
import { 
  GapAnalysisResult, 
  GapItem,
  PrioritizedRecommendation,
  GapAnalysisParameter
} from '@/lib/gap-analysis-types';
import { performGapAnalysisWithParameterizedScoring } from '@/lib/gap-analysis';
import { expertKnowledgeConfig } from '@/lib/expert-knowledge-config';
import { performQualitativeAnalysis, createIntegratedFivePillarScorecard } from '@/lib/qualitative-analysis-integration';
import FivePillarScorecardVisual from './five-pillar-scorecard-visual';

interface GapAnalysisProps {
  formData: Sos2aFormData;
  onComplete: (result: GapAnalysisResult) => void;
}

export default function GapAnalysis({ formData, onComplete }: GapAnalysisProps) {
  // Perform comprehensive qualitative analysis
  const [qualitativeResult, setQualitativeResult] = useState(() => {
    return performQualitativeAnalysis(formData);
  });
  
  const [fivePillarScorecard, setFivePillarScorecard] = useState(() => {
    return createIntegratedFivePillarScorecard(qualitativeResult);
  });
  
  // Keep original gap analysis for backward compatibility
  const gapAnalysisResult = qualitativeResult.gapAnalysis;
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Proceed to next step
  const handleComplete = () => {
    onComplete(gapAnalysisResult);
  };
  
  // Colors for charts
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
    '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
  ];
  
  // Function to determine status color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Function to determine status background color based on score
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };
  
  // Function to determine priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-600';
      case 'High': return 'text-orange-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };
  
  // Function to determine priority background color
  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Format data for radar chart
  const radarData = Object.entries(gapAnalysisResult.parameterScores).map(([parameter, data]) => ({
    parameter,
    score: data.earnedPercentage * 10, // Scale from 0-10 to 0-100
    fullMark: 100
  }));
  
  // Format data for bar chart showing parameter scores
  const barData = Object.entries(gapAnalysisResult.parameterScores).map(([parameter, data]) => ({
    parameter,
    score: data.earnedPercentage * 10, // Scale from 0-10 to 0-100
    gaps: data.gaps.length
  }));
  
  // Format data for gap count by parameter
  const gapCountData = Object.entries(gapAnalysisResult.parameterScores).map(([parameter, data]) => ({
    parameter,
    count: data.gaps.length
  })).sort((a, b) => b.count - a.count);
  
  // Count total gaps
  const totalGaps = Object.values(gapAnalysisResult.parameterScores).reduce(
    (total, param) => total + param.gaps.length, 0
  );
  
  return (
    <div className="gap-analysis">
      <h2 className="text-2xl font-bold mb-4">Security Gap Analysis</h2>
      
      <Card className="mb-6">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex justify-between items-center">
            <span>Overall Security Score</span>
            <span className={`text-3xl font-bold ${getScoreColor(gapAnalysisResult.overallScore.percentage)}`}>
              {gapAnalysisResult.overallScore.percentage.toFixed(1)}%
              <span className="ml-2 text-lg">
                (Grade: {gapAnalysisResult.overallScore.grade})
              </span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded-md flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-bold text-primary mb-2">{totalGaps}</div>
              <div className="text-sm text-gray-600">Security Gaps Identified</div>
            </div>
            <div className="p-4 border rounded-md flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-bold text-chart-4 mb-2">
                {gapAnalysisResult.prioritizedRecommendations.filter(r => r.priority === 'Critical').length}
              </div>
              <div className="text-sm text-gray-600">Critical Priority Gaps</div>
            </div>
            <div className="p-4 border rounded-md flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-bold text-chart-3 mb-2">
                {Object.entries(gapAnalysisResult.parameterScores).filter(([_, data]) => 
                  data.earnedPercentage * 10 < 60
                ).length}
              </div>
              <div className="text-sm text-gray-600">Parameters Below Minimum Threshold</div>
            </div>
          </div>
          
          <Alert className={`${getScoreBgColor(gapAnalysisResult.overallScore.percentage)} text-white mb-6`}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Security Posture Assessment</AlertTitle>
            <AlertDescription>
              {gapAnalysisResult.overallScore.percentage >= 80 
                ? "Your organization has a strong security posture with only minor gaps."
                : gapAnalysisResult.overallScore.percentage >= 60
                ? "Your organization has a moderate security posture with significant gaps that need attention."
                : "Your organization has a weak security posture with critical gaps that require immediate remediation."}
            </AlertDescription>
          </Alert>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="scorecard">5 Pillars</TabsTrigger>
              <TabsTrigger value="parameters">Parameter Scores</TabsTrigger>
              <TabsTrigger value="gaps">Identified Gaps</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            
            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="py-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-primary" />
                    Security Parameter Scores
                  </h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="parameter" tick={{ fill: '#666', fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="Score"
                          dataKey="score"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                        <RechartsTooltip formatter={(value) => `${value}%`} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-chart-3" />
                    Gaps by Parameter
                  </h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={gapCountData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="parameter" type="category" width={150} />
                        <RechartsTooltip />
                        <Bar dataKey="count" fill="#FF8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
                  Top Critical Recommendations
                </h3>
                <div className="space-y-3">
                  {gapAnalysisResult.prioritizedRecommendations
                    .filter(rec => rec.priority === 'Critical')
                    .slice(0, 3)
                    .map((rec, index) => (
                      <div key={index} className="p-4 border rounded-md">
                        <div className="flex items-start">
                          <Badge className={getPriorityBgColor(rec.priority)} variant="outline">
                            {rec.priority}
                          </Badge>
                          <div className="ml-3 flex-1">
                            <div className="font-medium">{rec.recommendation}</div>
                            <div className="text-sm text-gray-600 mt-1">{rec.impact}</div>
                            <div className="flex items-center text-sm text-gray-500 mt-2">
                              <span className="mr-4">Effort: {rec.estimatedEffort}</span>
                              <span>Timeframe: {rec.timeframe}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  {gapAnalysisResult.prioritizedRecommendations.filter(rec => rec.priority === 'Critical').length === 0 && (
                    <div className="p-4 border rounded-md bg-green-50">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <div className="text-green-800">No critical recommendations identified. Good job!</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 text-right">
                  <Button onClick={() => setActiveTab('recommendations')}>
                    View All Recommendations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* PARAMETERS TAB */}
            <TabsContent value="parameters" className="py-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Parameter Scores Details</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Each security parameter contributes 10% to the overall security score. 
                  The table below shows how well your organization meets the expert requirements for each parameter.
                </p>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Gaps</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(gapAnalysisResult.parameterScores).map(([parameter, data], index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{parameter}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={`mr-2 ${getScoreColor(data.earnedPercentage * 10)}`}>
                              {(data.earnedPercentage * 10).toFixed(1)}%
                            </span>
                            <Progress 
                              value={data.earnedPercentage * 10} 
                              className={`w-24 ${getScoreBgColor(data.earnedPercentage * 10)}`}
                            />
                          </div>
                        </TableCell>
                        <TableCell>{data.gaps.length}</TableCell>
                        <TableCell className="text-right">
                          <Badge className={getPriorityBgColor(
                            data.earnedPercentage * 10 >= 80 ? 'Low' : 
                            data.earnedPercentage * 10 >= 60 ? 'Medium' : 
                            data.earnedPercentage * 10 >= 40 ? 'High' : 'Critical'
                          )}>
                            {data.earnedPercentage * 10 >= 80 ? 'Good' : 
                             data.earnedPercentage * 10 >= 60 ? 'Needs Improvement' : 
                             data.earnedPercentage * 10 >= 40 ? 'At Risk' : 'Critical'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Parameter Score Distribution</h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="parameter" />
                      <YAxis domain={[0, 100]} />
                      <RechartsTooltip />
                      <Bar dataKey="score" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
            
            {/* FIVE PILLARS SCORECARD TAB */}
            <TabsContent value="scorecard" className="py-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Five Pillars Security Scorecard</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Comprehensive assessment across all five pillars of cybersecurity maturity.
                  This scorecard integrates qualitative assessment results with quantitative analysis,
                  cost-benefit evaluation, governance maturity, and threat modeling.
                </p>
              </div>
              
              <FivePillarScorecardVisual scorecard={fivePillarScorecard} />
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Qualitative Assessment Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Parameters Assessed:</strong> {qualitativeResult.parameterBreakdown.length}
                  </div>
                  <div>
                    <strong>Overall Score:</strong> {qualitativeResult.overallScore}%
                  </div>
                  <div>
                    <strong>Evidence Supplied:</strong> {qualitativeResult.qualitativeAssessment.evidenceSupplied.length} items
                  </div>
                  <div>
                    <strong>Data Quality:</strong> {qualitativeResult.comparisonResults.dataQualityScore}%
                  </div>
                </div>
                
                <div className="mt-4">
                  <strong>Accuracy Improvement:</strong> 
                  <span className={qualitativeResult.comparisonResults.accuracyImprovement > 0 ? 'text-green-600' : 'text-red-600'}>
                    {qualitativeResult.comparisonResults.accuracyImprovement > 0 ? '+' : ''}
                    {qualitativeResult.comparisonResults.accuracyImprovement}% 
                  </span>
                  compared to preliminary assessment
                </div>
              </div>
            </TabsContent>
            
            {/* GAPS TAB */}
            <TabsContent value="gaps" className="py-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Identified Security Gaps</h3>
                <p className="text-sm text-gray-600 mb-4">
                  The following gaps were identified by comparing your organization's security controls 
                  against expert knowledge and industry best practices.
                </p>
                
                <div className="mt-6 space-y-6">
                  {Object.entries(gapAnalysisResult.parameterScores)
                    .filter(([_, data]) => data.gaps.length > 0)
                    .map(([parameter, data], index) => (
                      <Card key={index}>
                        <CardHeader className={`${
                          data.earnedPercentage * 10 >= 80 ? 'bg-green-50' : 
                          data.earnedPercentage * 10 >= 60 ? 'bg-yellow-50' : 'bg-red-50'
                        }`}>
                          <CardTitle className="flex justify-between items-center text-lg">
                            <span>{parameter}</span>
                            <span className={getScoreColor(data.earnedPercentage * 10)}>
                              {(data.earnedPercentage * 10).toFixed(1)}%
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Control</TableHead>
                                <TableHead>Expected Level</TableHead>
                                <TableHead>Reported Level</TableHead>
                                <TableHead>Impact</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {data.gaps.map((gap, gapIndex) => (
                                <TableRow key={gapIndex}>
                                  <TableCell className="font-medium">
                                    <div>{gap.controlName}</div>
                                    <div className="text-xs text-gray-500">{gap.controlId}</div>
                                  </TableCell>
                                  <TableCell>{gap.expertLevel}</TableCell>
                                  <TableCell className={
                                    gap.reportedLevel === 0 ? 'text-red-600' : 
                                    gap.reportedLevel < gap.expertLevel ? 'text-yellow-600' : 'text-green-600'
                                  }>
                                    {gap.reportedLevel}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={getPriorityBgColor(
                                      gap.percentageImpact >= 3 ? 'Critical' :
                                      gap.percentageImpact >= 2 ? 'High' :
                                      gap.percentageImpact >= 1 ? 'Medium' : 'Low'
                                    )}>
                                      {gap.percentageImpact.toFixed(1)}% impact
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          
                          <div className="mt-4 p-3 border rounded-md bg-gray-50">
                            <h4 className="font-medium mb-2">Recommended Next Steps:</h4>
                            <ul className="list-disc ml-5 space-y-1">
                              {data.recommendations.map((rec, recIndex) => (
                                <li key={recIndex} className="text-sm">{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  
                  {Object.values(gapAnalysisResult.parameterScores).every(data => data.gaps.length === 0) && (
                    <div className="p-6 border rounded-md bg-green-50 text-center">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                      <h3 className="text-xl font-semibold text-green-800 mb-2">Perfect Score!</h3>
                      <p className="text-green-700">
                        Congratulations! No security gaps were identified. Your organization meets or exceeds 
                        all expert requirements for security controls.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* RECOMMENDATIONS TAB */}
            <TabsContent value="recommendations" className="py-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Prioritized Recommendations</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Based on the identified gaps, the following recommendations are prioritized to help you 
                  improve your security posture effectively.
                </p>
                
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="p-3 border rounded-md bg-red-50">
                    <h4 className="font-semibold text-red-800 mb-1">Critical</h4>
                    <div className="text-2xl font-bold text-red-700">
                      {gapAnalysisResult.prioritizedRecommendations.filter(r => r.priority === 'Critical').length}
                    </div>
                  </div>
                  <div className="p-3 border rounded-md bg-orange-50">
                    <h4 className="font-semibold text-orange-800 mb-1">High</h4>
                    <div className="text-2xl font-bold text-orange-700">
                      {gapAnalysisResult.prioritizedRecommendations.filter(r => r.priority === 'High').length}
                    </div>
                  </div>
                  <div className="p-3 border rounded-md bg-yellow-50">
                    <h4 className="font-semibold text-yellow-800 mb-1">Medium</h4>
                    <div className="text-2xl font-bold text-yellow-700">
                      {gapAnalysisResult.prioritizedRecommendations.filter(r => r.priority === 'Medium').length}
                    </div>
                  </div>
                  <div className="p-3 border rounded-md bg-green-50">
                    <h4 className="font-semibold text-green-800 mb-1">Low</h4>
                    <div className="text-2xl font-bold text-green-700">
                      {gapAnalysisResult.prioritizedRecommendations.filter(r => r.priority === 'Low').length}
                    </div>
                  </div>
                </div>
                
                {/* Group recommendations by priority */}
                {['Critical', 'High', 'Medium', 'Low'].map(priority => {
                  const recommendations = gapAnalysisResult.prioritizedRecommendations
                    .filter(r => r.priority === priority);
                  
                  if (recommendations.length === 0) return null;
                  
                  return (
                    <div key={priority} className="mb-8">
                      <h4 className={`text-md font-semibold mb-3 ${getPriorityColor(priority)}`}>
                        {priority} Priority Recommendations
                      </h4>
                      <div className="space-y-3">
                        {recommendations.map((rec, index) => (
                          <div key={index} className="p-4 border rounded-md">
                            <div className="flex items-start">
                              <Badge className={getPriorityBgColor(rec.priority)} variant="outline">
                                {rec.priority}
                              </Badge>
                              <div className="ml-3 flex-1">
                                <div className="font-medium">{rec.recommendation}</div>
                                <div className="text-sm text-gray-600 mt-1">{rec.impact}</div>
                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                  <span className="mr-4">Effort: {rec.estimatedEffort}</span>
                                  <span>Timeframe: {rec.timeframe}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                {gapAnalysisResult.prioritizedRecommendations.length === 0 && (
                  <div className="p-6 border rounded-md bg-green-50 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-green-800 mb-2">No Recommendations Needed!</h3>
                    <p className="text-green-700">
                      Your organization's security controls meet or exceed all expert requirements. 
                      Continue maintaining your current security posture.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="text-md font-semibold mb-2">About the Gap Analysis</h3>
        <p className="text-sm text-gray-600">
          This gap analysis compares your organization's security controls against expert knowledge
          and industry best practices. The analysis is based on 10 key security parameters, each contributing
          10% to the overall security score. Recommendations are prioritized based on their potential impact
          on your security posture.
        </p>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button onClick={handleComplete} className="bg-primary">
          Continue to Report Generation
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}