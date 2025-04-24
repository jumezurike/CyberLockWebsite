import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ScorecardItem } from '@/lib/sos2a-types';

interface ScorecardProps {
  scorecard: ScorecardItem[];
  reportType: 'preliminary' | 'comprehensive';
}

export default function Scorecard({ scorecard, reportType }: ScorecardProps) {
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

  // Colors for the pie chart
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
    '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57',
    '#83a6ed', '#8884d8'
  ];

  // Function to determine status color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Format percentage with fixed decimals
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Security Scorecard {reportType === 'comprehensive' ? '(Evidence-Based)' : '(Assessment-Based)'}</span>
          <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore.toFixed(1)}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Security Parameter</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scorecard.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.parameter}</TableCell>
                    <TableCell>{item.weight}%</TableCell>
                    <TableCell className={getScoreColor(item.score)}>
                      {item.score}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Additional context for scorecard */}
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-semibold mb-2">
            {reportType === 'comprehensive' 
              ? "Evidence-Based Scoring Methodology" 
              : "Assessment-Based Scoring Methodology"}
          </h4>
          <p className="text-sm text-gray-600">
            {reportType === 'comprehensive' 
              ? "This scorecard reflects quantitative measurements based on 6 months of evidence collection, showing the actual state of your security controls and their effectiveness."
              : "This preliminary scorecard is based on declared controls and assessment answers, providing an initial view of potential security posture without verification."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}