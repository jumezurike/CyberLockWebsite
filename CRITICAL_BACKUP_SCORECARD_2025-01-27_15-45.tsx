// BACKUP: client/src/components/sos2a/scorecard.tsx
// Created: 2025-01-27 15:45 before removing redundant tabs
// Purpose: Complete backup of scorecard component

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { ScorecardItem, AssessmentReport } from '@/lib/sos2a-types';

interface ScorecardProps {
  scorecard: ScorecardItem[];
  reportType: 'preliminary' | 'comprehensive';
  report: AssessmentReport;
}

export default function Scorecard({ scorecard, reportType, report }: ScorecardProps) {
  // Calculate overall score as weighted average
  const overallScore = scorecard.reduce((total, item) => {
    return total + (item.score * item.weight) / 100;
  }, 0);

  // Format for pie chart
  const pieData = scorecard.map((item) => ({
    name: item.parameter,
    value: item.score,
    fullScore: item.weight * 100 / 100,
    weight: item.weight
  }));
  
  // Create radar chart data for the 5 components
  const radarData = [
    { 
      subject: "Qualitative Assessment", 
      A: report.rasbitaScore?.categories?.risk || 0,
      fullMark: 100,
      notAssessed: false 
    },
    { 
      subject: "Quantitative Analysis", 
      A: report.rasbitaScore?.categories?.securityControls || 0,
      fullMark: 100,
      notAssessed: false 
    },
    { 
      subject: "RASBITA Cost-Benefit Analysis", 
      A: report.rasbitaScore?.categories?.architecture || 0,
      fullMark: 100,
      notAssessed: !report.architectureDiagramsProvided
    },
    { 
      subject: "RASBITA Governance & Management", 
      A: ((report.rasbitaScore?.categories?.govern || 0) + 
         (report.rasbitaScore?.categories?.identify || 0) + 
         (report.rasbitaScore?.categories?.protect || 0)) / 3,
      fullMark: 100,
      notAssessed: false 
    },
    { 
      subject: "Architecture Threat Modeling", 
      A: ((report.rasbitaScore?.categories?.detect || 0) + 
         (report.rasbitaScore?.categories?.respond || 0) + 
         (report.rasbitaScore?.categories?.recover || 0)) / 3,
      fullMark: 100,
      notAssessed: false 
    }
  ];

  // Colors for the pie chart
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
    '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
  ];

  // Function to determine status color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // Function to determine status background based on score
  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    if (score >= 40) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Overall Security Score: <span className={`text-2xl ${getScoreColor(Math.round(overallScore))}`}>
              {Math.round(overallScore)}%
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* 5-Pillar Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>5-Pillar RASBITA Framework Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" className="text-xs" />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Pillar Breakdown</h4>
              {radarData.map((item, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border ${getScoreBackground(item.A)} ${item.notAssessed ? 'opacity-50' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.subject}</span>
                    <span className={`font-bold ${getScoreColor(item.A)}`}>
                      {item.notAssessed ? 'N/A' : `${Math.round(item.A)}%`}
                    </span>
                  </div>
                  {item.notAssessed && (
                    <p className="text-xs text-gray-500 mt-1">
                      Not assessed - requires architecture diagrams
                    </p>
                  )}
                </div>
              ))}
              
              <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500%</div>
                  <div className="text-sm text-muted-foreground">
                    Total Framework Capacity
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    500% ÷ 5 pillars = 100% maximum per pillar
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Scorecard Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Assessment Scorecard</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parameter</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Weighted Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scorecard.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.parameter}</TableCell>
                  <TableCell>
                    <span className={getScoreColor(item.score)}>
                      {item.score}%
                    </span>
                  </TableCell>
                  <TableCell>{item.weight}%</TableCell>
                  <TableCell>
                    <span className={getScoreColor(item.score * item.weight / 100)}>
                      {Math.round(item.score * item.weight / 100)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.score >= 80 ? 'bg-green-100 text-green-800' :
                      item.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      item.score >= 40 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.score >= 80 ? 'Excellent' :
                       item.score >= 60 ? 'Good' :
                       item.score >= 40 ? 'Fair' : 'Needs Improvement'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Score Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scorecard}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="parameter" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    fontSize={10}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}