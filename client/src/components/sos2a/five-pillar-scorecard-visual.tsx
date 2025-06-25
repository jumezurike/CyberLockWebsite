/**
 * Five Pillar Scorecard Visual Component
 * Displays the comprehensive 5 pillar scoring with visual representations
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Shield, TrendingUp, DollarSign, Building, Lock } from 'lucide-react';
import { FivePillarScorecard } from '@/lib/five-pillar-scorecard';

interface FivePillarScorecardVisualProps {
  scorecard: FivePillarScorecard;
  className?: string;
}

export default function FivePillarScorecardVisual({ 
  scorecard, 
  className = "" 
}: FivePillarScorecardVisualProps) {
  
  const overallScore = scorecard.calculateOverallScore();
  const pillarBreakdown = scorecard.getScoreBreakdown();
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Prepare data for radar chart
  const radarData = pillarBreakdown.map(pillar => ({
    pillar: pillar.pillar.split(' ')[0], // Shortened names for radar
    score: pillar.score,
    fullName: pillar.pillar
  }));
  
  // Prepare data for bar chart
  const barData = pillarBreakdown.map(pillar => ({
    name: pillar.pillar,
    score: pillar.score,
    weight: pillar.weight * 100,
    contribution: pillar.contribution
  }));
  
  // Get score color and status
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };
  
  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 80) return "bg-blue-100";
    if (score >= 70) return "bg-yellow-100";
    if (score >= 60) return "bg-orange-100";
    return "bg-red-100";
  };
  
  const getScoreStatus = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 70) return "Satisfactory";
    if (score >= 60) return "Needs Improvement";
    return "Critical";
  };
  
  const pillarIcons = {
    "Qualitative Assessment": Shield,
    "Quantitative Analysis": TrendingUp,
    "RASBITA Cost-Benefit": DollarSign,
    "RASBITA Governance": Building,
    "Architecture Threat Modeling": Lock
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Score Header */}
      <Card className={`${getScoreBgColor(overallScore)} border-2`}>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            <span className={getScoreColor(overallScore)}>
              {overallScore.toFixed(1)}%
            </span>
          </CardTitle>
          <p className="text-lg font-medium">
            Overall Security Posture: {getScoreStatus(overallScore)}
          </p>
        </CardHeader>
      </Card>
      
      {/* Five Pillars Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {pillarBreakdown.map((pillar, index) => {
          const IconComponent = pillarIcons[pillar.pillar as keyof typeof pillarIcons] || Shield;
          
          return (
            <Card key={index} className="text-center">
              <CardHeader className="pb-2">
                <div className="flex justify-center mb-2">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-sm font-medium leading-tight">
                  {pillar.pillar}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className={`text-2xl font-bold ${getScoreColor(pillar.score)}`}>
                  {pillar.score.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Weight: {(pillar.weight * 100).toFixed(0)}%
                </div>
                <Progress value={pillar.score} className="mt-2 h-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Security Posture Radar</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="pillar" />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={false}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value}%`, 
                    props.payload.fullName
                  ]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pillar Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value}%`, 
                    name === 'score' ? 'Score' : 'Weight'
                  ]}
                />
                <Bar dataKey="score" fill="#8884d8" name="Score">
                  {barData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Pillar Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Pillar Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pillarBreakdown.map((pillar, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{pillar.pillar}</h4>
                  <Badge variant="outline">
                    {pillar.score.toFixed(1)}% 
                    (Weight: {(pillar.weight * 100).toFixed(0)}%)
                  </Badge>
                </div>
                <Progress value={pillar.score} className="mb-2" />
                <div className="text-sm text-gray-600">
                  Contribution to overall score: {pillar.contribution.toFixed(1)} points
                </div>
                <div className={`text-sm font-medium ${getScoreColor(pillar.score)}`}>
                  Status: {getScoreStatus(pillar.score)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Summary Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pillarBreakdown
              .sort((a, b) => a.score - b.score)
              .slice(0, 3)
              .map((pillar, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="destructive" className="mt-1">
                    {index + 1}
                  </Badge>
                  <div>
                    <div className="font-medium">{pillar.pillar}</div>
                    <div className="text-sm text-gray-600">
                      Current score: {pillar.score.toFixed(1)}% - 
                      Focus on improving this pillar for maximum impact
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}