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
  
  // Create radar chart data for the five SOS²A components
  const sos2aComponents = [
    { 
      name: "Qualitative Assessment", 
      score: report.rasbitaScore?.categories?.identify || 0,
      fullMark: 100 
    },
    { 
      name: "Quantitative Analysis", 
      score: report.rasbitaScore?.categories?.protect || 0,
      fullMark: 100 
    },
    { 
      name: "RASBITA Cost-Benefit", 
      score: report.rasbitaScore?.categories?.detect || 0,
      fullMark: 100 
    },
    { 
      name: "RASBITA Gov & Mgmt", 
      score: report.rasbitaScore?.categories?.govern || 0,
      fullMark: 100 
    },
    { 
      name: "Architecture Threat Modeling",
      // Check if architecture diagrams were provided, otherwise mark as N/A
      score: report.matrixData && report.matrixData.some(item => 
        item.technologyControls?.frameworks?.includes("architecture")
      ) ? (report.rasbitaScore?.categories?.respond || 0) : 0,
      fullMark: 100,
      notAssessed: !(report.matrixData && report.matrixData.some(item => 
        item.technologyControls?.frameworks?.includes("architecture")
      ))
    }
  ];
  // Format components for radar chart
  const radarData = sos2aComponents.map(component => ({
    subject: component.name,
    A: component.score,
    fullMark: component.fullMark,
    notAssessed: component.notAssessed || false
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
          
          <div className="h-[450px]">
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
                <Legend 
                  verticalAlign="bottom" 
                  height={60} 
                  wrapperStyle={{ 
                    paddingTop: 30, 
                    marginTop: 15,
                    borderTop: '1px solid #f0f0f0' 
                  }}
                  iconSize={10}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* SOS²A Five Components Pie Chart */}
        <div className="mt-6 border-t pt-6">
          <h4 className="text-lg font-semibold mb-4">SOS²A Five Components Assessment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sos2aComponents.map(comp => ({
                      name: comp.name,
                      value: comp.score,
                      notAssessed: comp.notAssessed || false
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value, percent }) => 
                      `${name}: ${value}%`
                    }
                  >
                    {sos2aComponents.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        opacity={entry.notAssessed ? 0.3 : 1}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value}%`} 
                    labelFormatter={(name) => `${name}`}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{
                      paddingLeft: 20
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-3 mt-4 text-sm">
                {sos2aComponents.map((item, index) => (
                  <div key={index} className="p-3 border rounded flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3" 
                      style={{ backgroundColor: COLORS[index % COLORS.length], opacity: item.notAssessed ? 0.3 : 1 }}
                    ></div>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="flex justify-between items-center mt-1">
                        <div className={`${item.notAssessed ? 'text-gray-500' : getScoreColor(item.score)} font-bold`}>
                          {item.notAssessed ? "Cannot be assessed" : item.score === 0 ? "Not Available" : `${item.score}%`}
                        </div>
                        {!item.notAssessed && item.score > 0 && (
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${getScoreColor(item.score).replace('text-', 'bg-')}`}
                              style={{ width: `${item.score}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* NIST CSF 2.0 Radar Chart for RASBITA Governance & Management */}
        <div className="mt-6 border-t pt-6">
          <h4 className="text-lg font-semibold mb-4">NIST CSF 2.0 Framework Alignment</h4>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                { subject: "Govern", A: report.rasbitaCategories?.govern || 0, fullMark: 100 },
                { subject: "Identify", A: report.rasbitaCategories?.identify || 0, fullMark: 100 },
                { subject: "Protect", A: report.rasbitaCategories?.protect || 0, fullMark: 100 },
                { subject: "Detect", A: report.rasbitaCategories?.detect || 0, fullMark: 100 },
                { subject: "Respond", A: report.rasbitaCategories?.respond || 0, fullMark: 100 },
                { subject: "Recover", A: report.rasbitaCategories?.recover || 0, fullMark: 100 }
              ]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Framework Alignment"
                  dataKey="A"
                  stroke="#00C49F"
                  fill="#00C49F"
                  fillOpacity={0.6}
                />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mt-4 text-center text-sm">
            {["Govern", "Identify", "Protect", "Detect", "Respond", "Recover"].map((item, index) => (
              <div key={index} className="p-2 border rounded">
                <div className="font-medium">{item}</div>
                <div className={`${getScoreColor(report.rasbitaCategories?.[item.toLowerCase()] || 0)} font-bold mt-1`}>
                  {report.rasbitaCategories?.[item.toLowerCase()] ? `${report.rasbitaCategories[item.toLowerCase()]}%` : "N/A"}
                </div>
              </div>
            ))}
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
              ? "This scorecard reflects quantitative measurements based on 6 months of evidence collection, showing the actual state of your security controls and their effectiveness across all five SOS²A components."
              : "This preliminary scorecard is based on declared controls and assessment answers, providing an initial view of potential security posture without verification. Some components may be marked as 'Not Available' or 'Cannot be assessed' if required information was not provided."}
          </p>
          
          {/* Architecture Diagram Explanation */}
          {radarData.some(item => item.notAssessed) && (
            <div className="mt-3 p-3 bg-gray-50 border rounded-md">
              <h5 className="text-sm font-semibold mb-1">Architecture Threat Modeling Component</h5>
              <p className="text-xs text-gray-600">
                The Architecture Threat Modeling component requires uploaded architecture diagrams to be assessed. Without these diagrams, this component is marked as "Cannot be assessed" and is excluded from the overall score calculation. Your final score is calculated as an average of the available components only.
              </p>
            </div>
          )}
          
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-3">
              <h5 className="text-sm font-semibold">SOS²A 5-Component Score</h5>
              <p className="text-xs text-gray-600 mt-1">
                SOS²A uses five integrated components to provide a 500% view of your security posture, where each component contributes 100%. This provides a more comprehensive assessment than traditional single-dimension security tools.
              </p>
            </div>
            <div className="border rounded-md p-3">
              <h5 className="text-sm font-semibold">Report Types</h5>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="text-xs">
                  <span className="font-medium">Preliminary:</span> 
                  <p className="text-gray-600">Quick assessment based on questionnaire responses</p>
                </div>
                <div className="text-xs">
                  <span className="font-medium">Comprehensive:</span> 
                  <p className="text-gray-600">Detailed assessment with evidence collection and verification</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}