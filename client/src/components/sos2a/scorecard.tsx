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
  
  // Create radar chart data for all SOS²A components (sections 2-10)
  const sos2aComponents = [
    // Section 2: Business Information Assessment
    { 
      name: "Business Information", 
      score: report.rasbitaScore?.categories?.identify || 0,
      fullMark: 100 
    },
    // Section 3: Infrastructure Mode Assessment
    { 
      name: "Infrastructure Mode", 
      score: report.rasbitaScore?.categories?.protect || 0,
      fullMark: 100 
    },
    // Section 4: Configuration Baseline
    { 
      name: "Configuration Baseline", 
      score: report.rasbitaScore?.categories?.detect || 0,
      fullMark: 100 
    },
    // Section 5: Security Control Framework
    { 
      name: "Security Controls", 
      score: report.rasbitaScore?.categories?.govern || 0,
      fullMark: 100 
    },
    // Section 6: Compliance Requirements
    { 
      name: "Compliance", 
      score: report.rasbitaScore?.categories?.respond || 0,
      fullMark: 100 
    },
    // Section 7: Regulatory Requirements
    { 
      name: "Regulatory",
      score: report.rasbitaScore?.categories?.recover || 0,
      fullMark: 100
    },
    // Section 8: Standards
    { 
      name: "Standards", 
      score: report.rasbitaScore?.categories?.identify || 0,
      fullMark: 100 
    },
    // Section 9: MITRE ATT&CK / Adversarial Insight
    { 
      name: "Adversarial Insight", 
      score: report.rasbitaScore?.categories?.detect || 0,
      fullMark: 100 
    },
    // Section 10: ISMS Implementation
    { 
      name: "ISMS Implementation",
      // Check if ISMS data was provided, otherwise mark as N/A
      score: report.matrixData && report.matrixData.some(item => 
        item.isms?.implementation
      ) ? (report.rasbitaScore?.categories?.govern || 0) : 0,
      fullMark: 100,
      notAssessed: !(report.matrixData && report.matrixData.some(item => 
        item.isms?.implementation
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
        
        {/* SOS²A Components Pie Chart (Sections 2-10) */}
        <div className="mt-6 border-t pt-6">
          <h4 className="text-lg font-semibold mb-4">SOS²A Complete Assessment (Sections 2-10)</h4>
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
          <h4 className="text-lg font-semibold mb-4">NIST CSF 2.0 Framework Alignment (0-4 Tier Maturity)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                  { 
                    subject: "Govern", 
                    A: Math.min(4, Math.max(0, Math.round((report.rasbitaCategories?.govern || 0) / 25))), 
                    fullMark: 4 
                  },
                  { 
                    subject: "Identify", 
                    A: Math.min(4, Math.max(0, Math.round((report.rasbitaCategories?.identify || 0) / 25))), 
                    fullMark: 4 
                  },
                  { 
                    subject: "Protect", 
                    A: Math.min(4, Math.max(0, Math.round((report.rasbitaCategories?.protect || 0) / 25))), 
                    fullMark: 4 
                  },
                  { 
                    subject: "Detect", 
                    A: Math.min(4, Math.max(0, Math.round((report.rasbitaCategories?.detect || 0) / 25))), 
                    fullMark: 4 
                  },
                  { 
                    subject: "Respond", 
                    A: Math.min(4, Math.max(0, Math.round((report.rasbitaCategories?.respond || 0) / 25))), 
                    fullMark: 4 
                  },
                  { 
                    subject: "Recover", 
                    A: Math.min(4, Math.max(0, Math.round((report.rasbitaCategories?.recover || 0) / 25))), 
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
                  const categoryKey = item.toLowerCase() as keyof typeof report.rasbitaCategories;
                  const percentScore = report.rasbitaCategories?.[categoryKey] || 0;
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
              ? "This scorecard reflects quantitative measurements based on 6 months of evidence collection, showing the actual state of your security controls and their effectiveness across all nine SOS²A assessment sections (2-10)."
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
          
          <div className="mt-3">
            <div className="border rounded-md p-3 mb-4">
              <h5 className="text-sm font-semibold mb-2">SOS²A 9-Section Assessment Methodology (Sections 2-10)</h5>
              <div className="text-xs text-gray-700 space-y-3">
                <div>
                  <span className="font-semibold text-primary">1. Qualitative Assessment (100%)</span>
                  <p className="mt-1">
                    {reportType === 'comprehensive' ? 
                    "Refined based on actual evidence with more accurate scoring of each parameter and direct comparison to preliminary assessment." : 
                    "Initial assessment based on interview responses, providing a baseline view of security practices."}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-primary">2. Quantitative Analysis (100%)</span>
                  <p className="mt-1">
                    {reportType === 'comprehensive' ? 
                    "Deep scan using professional tools with detailed analysis of all 12 parameters, trend analysis showing changes over time, and performance metrics with statistical significance." : 
                    "Preliminary scan of the 12 key security parameters based on available evidence and declaration."}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-primary">3. RASBITA Cost-Benefit Analysis (100%)</span>
                  <p className="mt-1">
                    {reportType === 'comprehensive' ? 
                    "Comprehensive financial impact modeling with actual incident costs (if any occurred), detailed resource allocation analysis, and return on security investment calculations." : 
                    "Initial cost-benefit analysis based on industry benchmarks and estimated risk levels."}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-primary">4. RASBITA Governance & Management (100%)</span>
                  <p className="mt-1">
                    {reportType === 'comprehensive' ? 
                    "Detailed NIST CSF 2.0 radar analysis with maturity progression over time, governance structure effectiveness evaluation, and management control efficacy assessment." : 
                    "Baseline governance assessment using NIST CSF 2.0 framework with initial maturity levels."}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-primary">5. Architecture Threat Modeling (100%)</span>
                  <p className="mt-1">
                    {reportType === 'comprehensive' ? 
                    "Thorough data flow diagram analysis with comprehensive STRIDE threat modeling, validated mitigation strategies, and architectural security validation." : 
                    "Initial review of architecture diagrams if provided, with basic threat identification."}
                    {radarData.some(item => item.notAssessed) && 
                    " (Note: This component requires architecture diagrams to be assessed and is currently marked as 'Cannot be assessed'.)"}
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
                      A quick assessment that includes all nine sections (2-10) with light scanning. It provides an initial view based on questionnaire responses, helpful for initial planning but pending verification.
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
                      A thorough evaluation with deep scanning across all nine sections (2-10), based on 6 months of evidence collection using SOC monitoring, incident response tracking, and security tools, providing validated security posture.
                    </p>
                  </div>
                </div>
              </div>
              <div className="border rounded-md p-3">
                <h5 className="text-sm font-semibold">Scoring Benefits</h5>
                <p className="text-xs text-gray-600 mt-2">
                  The SOS²A methodology provides a comprehensive view of your security posture across nine distinct assessment sections (2-10), delivering a much more detailed analysis than traditional single-dimension assessments. This approach ensures:
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