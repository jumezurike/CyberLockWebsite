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
                  height={36} 
                  wrapperStyle={{ 
                    paddingTop: 20, 
                    marginTop: 10,
                    borderTop: '1px solid #f0f0f0' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Component Radar Chart */}
        <div className="mt-6 border-t pt-6">
          <h4 className="text-lg font-semibold mb-4">SOS²A Component Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={150} width={500} height={500} data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-3 mt-4 text-sm">
                {radarData.map((item, index) => (
                  <div key={index} className="p-3 border rounded flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3" 
                      style={{ backgroundColor: COLORS[index % COLORS.length], opacity: item.notAssessed ? 0.3 : 1 }}
                    ></div>
                    <div className="flex-1">
                      <div className="font-medium">{item.subject}</div>
                      <div className="flex justify-between items-center mt-1">
                        <div className={`${item.notAssessed ? 'text-gray-500' : getScoreColor(item.A)} font-bold`}>
                          {item.notAssessed ? "Cannot be assessed" : `${item.A.toFixed(1)}%`}
                        </div>
                        {!item.notAssessed && (
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${getScoreColor(item.A).replace('text-', 'bg-')}`}
                              style={{ width: `${item.A}%` }}
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
        
        {/* NIST CSF 2.0 Radar Chart */}
        <div className="mt-6 border-t pt-6">
          <h4 className="text-lg font-semibold mb-4">NIST CSF 2.0 Framework Alignment (0-4 Tier Maturity)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                  { 
                    subject: "Govern", 
                    A: Math.min(4, Math.max(0, Math.round((report.rasbitaScore?.categories?.govern || 0) / 25))), 
                    fullMark: 4 
                  },
                  { 
                    subject: "Identify", 
                    A: Math.min(4, Math.max(0, Math.round((report.rasbitaScore?.categories?.identify || 0) / 25))), 
                    fullMark: 4 
                  },
                  { 
                    subject: "Protect", 
                    A: Math.min(4, Math.max(0, Math.round((report.rasbitaScore?.categories?.protect || 0) / 25))), 
                    fullMark: 4 
                  },
                  { 
                    subject: "Detect", 
                    A: Math.min(4, Math.max(0, Math.round((report.rasbitaScore?.categories?.detect || 0) / 25))), 
                    fullMark: 4 
                  },
                  { 
                    subject: "Respond", 
                    A: Math.min(4, Math.max(0, Math.round((report.rasbitaScore?.categories?.respond || 0) / 25))), 
                    fullMark: 4 
                  },
                  { 
                    subject: "Recover", 
                    A: Math.min(4, Math.max(0, Math.round((report.rasbitaScore?.categories?.recover || 0) / 25))), 
                    fullMark: 4 
                  }
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 4]} 
                    tickCount={5} 
                    tick={(props) => {
                      const { x, y, payload } = props;
                      return (
                        <g transform={`translate(${x},${y})`}>
                          <text
                            textAnchor="middle"
                            fill="#666"
                            fontSize={12}
                          >
                            {`Tier ${payload.value}`}
                          </text>
                        </g>
                      );
                    }}
                  />
                  <Radar
                    name="Maturity Tier"
                    dataKey="A"
                    stroke="#00C49F"
                    fill="#00C49F"
                    fillOpacity={0.6}
                  />
                  <Tooltip 
                    formatter={(value) => `Tier ${value}`} 
                    labelFormatter={(name) => `${name}`}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div className="p-3 border rounded mb-4">
                <h5 className="text-sm font-medium mb-2">NIST CSF Maturity Tier Legend</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start">
                    <div className="font-semibold w-16">Tier 1:</div>
                    <div>Partial - Risk management practices are not formalized and managed in an ad hoc manner.</div>
                  </div>
                  <div className="flex items-start">
                    <div className="font-semibold w-16">Tier 2:</div>
                    <div>Risk Informed - Risk management practices are approved but may not be established as organizational policy.</div>
                  </div>
                  <div className="flex items-start">
                    <div className="font-semibold w-16">Tier 3:</div>
                    <div>Repeatable - Organization-wide risk management practices are formally approved and expressed as policy.</div>
                  </div>
                  <div className="flex items-start">
                    <div className="font-semibold w-16">Tier 4:</div>
                    <div>Adaptive - Organization adapts cybersecurity practices based on lessons learned and predictive indicators.</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                {["Govern", "Identify", "Protect", "Detect", "Respond", "Recover"].map((item, index) => {
                  // Correctly type-check to ensure we get the right property
                  const categoryKey = item.toLowerCase();
                  const percentScore = report.rasbitaScore?.categories?.[categoryKey] || 0;
                  const tierScore = Math.min(4, Math.max(0, Math.round(percentScore / 25)));
                  return (
                    <div key={index} className="p-2 border rounded">
                      <div className="font-medium">{item}</div>
                      <div className={`${getScoreColor(percentScore)} font-bold mt-1`}>
                        Tier {tierScore}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {percentScore}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
              : "This preliminary scorecard is based on declared controls and assessment answers, providing an initial view of potential security posture without verification. Some components may be marked as 'Not Available' or 'Cannot be assessed' if required information was not provided."}
          </p>
          
          {/* Architecture Diagram Explanation */}
          {radarData.some(item => item.notAssessed) && (
            <div className="mt-3 p-3 bg-gray-50 border rounded-md">
              <h5 className="text-sm font-semibold mb-1">Architecture Analysis Component</h5>
              <p className="text-xs text-gray-600">
                The Architecture Analysis component requires uploaded architecture diagrams to be assessed. Without these diagrams, this component is marked as "Cannot be assessed" and is excluded from the overall score calculation. Your final score is calculated as an average of the available components only.
              </p>
            </div>
          )}
          
          <div className="mt-3">
            <div className="border rounded-md p-3 mb-4">
              <h5 className="text-sm font-semibold mb-2">SOS²A 5-Component Assessment Methodology</h5>
              <div className="text-xs text-gray-700 space-y-3">
                <div>
                  <span className="font-semibold text-primary">1. Risk Assessment (100%)</span>
                  <p className="mt-1">
                    {reportType === 'comprehensive' ? 
                    "Comprehensive risk assessment with detailed impact analysis based on actual threat intelligence and vulnerability scan data." : 
                    "Initial risk assessment based on questionnaire responses and industry benchmark data."}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-primary">2. Security Controls (100%)</span>
                  <p className="mt-1">
                    {reportType === 'comprehensive' ? 
                    "Validated security controls with effectiveness measurements, mapped to industry frameworks and regulatory requirements." : 
                    "Declared security controls without validation, providing baseline view of intended security measures."}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-primary">3. Architecture Analysis (100%)</span>
                  <p className="mt-1">
                    {reportType === 'comprehensive' ? 
                    "Thorough architecture assessment with security flow analysis, attack surface enumeration, and configuration review." : 
                    "Initial architecture review based on provided documentation without detailed validation."}
                    {radarData.some(item => item.subject === "Architecture Analysis" && item.notAssessed) && 
                    " (Note: This component requires architecture diagrams to be assessed and is currently marked as 'Cannot be assessed'.)"}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-primary">4. RASBITA Metrics (100%)</span>
                  <p className="mt-1">
                    {reportType === 'comprehensive' ? 
                    "Detailed RASBITA metrics with historical trend analysis, risk-adjusted return calculations, and governance maturity assessment." : 
                    "Baseline RASBITA measurements establishing initial cybersecurity governance posture."}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-primary">5. Resiliency (100%)</span>
                  <p className="mt-1">
                    {reportType === 'comprehensive' ? 
                    "Comprehensive resiliency assessment with incident response capabilities validation, recovery time objectives, and continuity planning verification." : 
                    "Initial resiliency review based on declared detection, response, and recovery measures without validation."}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-3">
                <h5 className="text-sm font-semibold">Report Types Explained</h5>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  <div className="text-xs">
                    <span className="font-medium inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                      </svg>
                      Preliminary Assessment:
                    </span> 
                    <p className="text-gray-600 mt-1">
                      A quick assessment that includes all five components with light scanning. It provides an initial view based on questionnaire responses, helpful for initial planning but pending verification.
                    </p>
                  </div>
                  <div className="text-xs mt-2">
                    <span className="font-medium inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Comprehensive Assessment:
                    </span>
                    <p className="text-gray-600 mt-1">
                      A thorough evaluation with deep scanning across all five components, based on 6 months of evidence collection using SOC monitoring, incident response tracking, and security tools, providing validated security posture.
                    </p>
                  </div>
                </div>
              </div>
              <div className="border rounded-md p-3">
                <h5 className="text-sm font-semibold">Scoring Benefits</h5>
                <p className="text-xs text-gray-600 mt-2">
                  The SOS²A methodology provides a comprehensive view of your security posture across five distinct components, delivering a much more detailed analysis than traditional single-dimension assessments. This approach ensures:
                </p>
                <ul className="text-xs text-gray-600 mt-2 space-y-1 list-disc ml-4">
                  <li>Complete coverage of all security aspects</li>
                  <li>Clear indication when components cannot be assessed</li>
                  <li>Accurate final scoring using only available components</li>
                  <li>Actionable insights across qualitative and quantitative metrics</li>
                  <li>Financial impact analysis for justified security investments</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}