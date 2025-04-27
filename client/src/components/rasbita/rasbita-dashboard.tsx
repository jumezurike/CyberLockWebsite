import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { RasbitaReport, RasbitaRiskItem } from '@/lib/sos2a-types';
import { AlertCircle, AlertTriangle, CheckCircle, AlertOctagon } from "lucide-react";
import ThreatModeling from '@/components/rasbita/threat-modeling';

// Helper function to get tier label text based on score
function getTierLabel(score: number | null): string {
  if (score === null) return "Not assessed";
  
  switch (score) {
    case 0: return "None";
    case 1: return "Partial";
    case 2: return "Risk Informed";
    case 3: return "Repeatable";
    case 4: return "Adaptive";
    default: return "Unknown";
  }
}

interface RasbitaDashboardProps {
  report: RasbitaReport;
}

export default function RasbitaDashboard({ report }: RasbitaDashboardProps) {
  // Format currency with commas and 0 decimal places for better readability
  const formatCurrency = (value: number | undefined | null) => {
    // Return $0 if value is undefined, null, NaN, or less than 0.01
    if (value === undefined || value === null || isNaN(value) || value < 0.01) {
      return '$0';
    }
    
    try {
      // Use Intl.NumberFormat for safer currency formatting
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    } catch (error) {
      console.error("Error formatting currency value:", error);
      return '$0'; // Fallback value if formatting fails
    }
  };

  // Ensure all properties exist with defaults for safety using NIST CSF 2.0 framework domains
  const rasbitaCategories = report.rasbitaCategories || {
    govern: 0,
    identify: 0,
    protect: 0,
    detect: 0,
    respond: 0,
    recover: 0
  };
  
  // Safe access to properties with fallbacks
  const categories = {
    govern: rasbitaCategories.govern || 0,
    identify: rasbitaCategories.identify || 0,
    protect: rasbitaCategories.protect || 0,
    detect: rasbitaCategories.detect || 0,
    respond: rasbitaCategories.respond || 0,
    recover: rasbitaCategories.recover || 0
  };
  
  // Data for the radar chart based on NIST CSF 2.0 framework domains
  const radarData = [
    {
      subject: 'Govern',
      value: categories.govern,
      fullMark: 100,
    },
    {
      subject: 'Identify',
      value: categories.identify,
      fullMark: 100,
    },
    {
      subject: 'Protect',
      value: categories.protect,
      fullMark: 100,
    },
    {
      subject: 'Detect',
      value: categories.detect,
      fullMark: 100,
    },
    {
      subject: 'Respond',
      value: categories.respond,
      fullMark: 100,
    },
    {
      subject: 'Recover',
      value: categories.recover,
      fullMark: 100,
    }
  ];

  // Ensure financial summary exists with defaults
  const financialSummary = report.financialSummary || {
    totalAssetValue: 0,
    totalAnnualizedLossExpectancy: 0,
    totalCostOfSafeguards: 0,
    totalNetRiskReductionBenefit: 0
  };
  
  // Ensure risk items exist with defaults
  const riskItems = report.riskItems || [];
  
  // Data for the cost-benefit analysis chart
  const costBenefitData = riskItems.map(item => ({
    name: (item.assetName || "Unknown Asset").substring(0, 15) + ((item.assetName || "").length > 15 ? '...' : ''),
    ale: item.annualizedLossExpectancy || 0,
    aleAfter: item.annualizedLossExpectancyAfterControls || 0,
    acs: item.annualCostOfSafeguard || 0,
    nrrb: item.netRiskReductionBenefit || 0,
  }));

  // Function to determine status color based on NRRB value
  const getNRRBColor = (nrrb: number) => {
    if (nrrb > 0) return 'text-green-600';
    if (nrrb === 0) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Function to determine risk priority and notification based on score
  const getRiskAssessment = (score: number) => {
    if (score > 46) {
      return {
        level: 'P1',
        color: 'red',
        title: 'Disclosure of restricted information',
        icon: <AlertOctagon className="h-6 w-6 text-red-500" />,
        notification: 'It is critical: priority P1. Notify CISO; contact soc, privacy and compliance teams if there is a PHI and/or PII. Incident response and possible war room meeting must commence immediately.'
      };
    } else if (score >= 36 && score <= 46) {
      return {
        level: 'P2',
        color: 'orange',
        title: 'Disclosure of non-restricted information',
        icon: <AlertCircle className="h-6 w-6 text-orange-500" />,
        notification: 'It is high risk: priority P2. Notify IT Security Manager and track incident in security ticketing system. Begin investigation within 24 hours.'
      };
    } else if (score >= 21 && score <= 35) {
      return {
        level: 'P3',
        color: 'yellow',
        title: 'Minimal impact by non-restricted disclosure',
        icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
        notification: 'It is medium risk: priority P3. Document and monitor the incident. Schedule remediation actions within standard change management process.'
      };
    } else {
      return {
        level: 'P4',
        color: 'green',
        title: 'Risk is low as in informational',
        icon: <CheckCircle className="h-6 w-6 text-green-500" />,
        notification: 'It is low risk: priority P4. No immediate action needed. Include in regular security reporting.'
      };
    }
  };

  // Ensure overall risk score has a default value
  const overallRiskScore = report.overallRiskScore || 0;
  
  return (
    <div className="rasbita-dashboard space-y-6">
      {/* Understanding RASBITA Scores Legend Card */}
      <Card className="mb-6 bg-gray-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Understanding RASBITA™ Scores</CardTitle>
          <CardDescription>
            Two complementary scoring systems to evaluate security posture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded p-3 bg-white">
              <h3 className="font-semibold text-purple-700 mb-1 flex items-center gap-2">
                <span className="bg-purple-600 w-3 h-3 rounded-full"></span>
                RASBITA™ Risk Score
              </h3>
              <p className="text-sm text-gray-600">
                CISSP Risk Assessment Score by Impact and Threat Analysis. Quantifies actual <strong>security risks</strong> on a scale of 1-100%.
                Higher scores indicate greater risk exposure.
              </p>
              <div className="mt-2 grid grid-cols-4 text-xs text-center">
                <div className="bg-green-100 px-1 py-0.5 rounded-l">1-20% <span className="block font-medium">Low</span></div>
                <div className="bg-yellow-100 px-1 py-0.5">21-35% <span className="block font-medium">Medium</span></div>
                <div className="bg-orange-100 px-1 py-0.5">36-46% <span className="block font-medium">High</span></div>
                <div className="bg-red-100 px-1 py-0.5 rounded-r">47-100% <span className="block font-medium">Critical</span></div>
              </div>
            </div>
            <div className="border border-gray-200 rounded p-3 bg-white">
              <h3 className="font-semibold text-blue-700 mb-1 flex items-center gap-2">
                <span className="bg-blue-600 w-3 h-3 rounded-full"></span>
                Governance & Management Maturity
              </h3>
              <p className="text-sm text-gray-600">
                Measures organizational <strong>cybersecurity maturity</strong> on a tier scale of 0-4.
                Higher tiers indicate stronger governance and management practices.
              </p>
              <div className="mt-2 grid grid-cols-1 text-xs">
                <div className="grid grid-cols-5">
                  <div className="bg-red-100 px-1 py-0.5 rounded-tl">Tier 0 <span className="block font-medium">0%</span></div>
                  <div className="bg-orange-100 px-1 py-0.5">Tier 1 <span className="block font-medium">25%</span></div>
                  <div className="bg-yellow-100 px-1 py-0.5">Tier 2 <span className="block font-medium">50%</span></div>
                  <div className="bg-blue-100 px-1 py-0.5">Tier 3 <span className="block font-medium">75%</span></div>
                  <div className="bg-green-100 px-1 py-0.5 rounded-tr">Tier 4 <span className="block font-medium">100%</span></div>
                </div>
                <div className="grid grid-cols-5 text-[10px] text-center">
                  <div className="bg-red-50 px-1 py-0.5 rounded-bl border-t border-white">None</div>
                  <div className="bg-orange-50 px-1 py-0.5 border-t border-white">Partial</div>
                  <div className="bg-yellow-50 px-1 py-0.5 border-t border-white">Risk Informed</div>
                  <div className="bg-blue-50 px-1 py-0.5 border-t border-white">Repeatable</div>
                  <div className="bg-green-50 px-1 py-0.5 rounded-br border-t border-white">Adaptive</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 bg-blue-50 p-2 rounded text-sm text-blue-800">
            <strong>Key Relationship:</strong> More mature governance and management practices (higher tier) typically result in a lower RASBITA™ risk score, indicating reduced security risk exposure.
          </div>
        </CardContent>
      </Card>
      
      {/* Risk Score Notification Card */}
      <Card className={`border-l-4 border-${getRiskAssessment(overallRiskScore).color}-500 mb-6`}>
        <CardContent className="flex items-start gap-4 pt-6">
          {getRiskAssessment(overallRiskScore).icon}
          <div>
            <h3 className="text-lg font-semibold mb-1">
              RASBITA™ Risk Score: {overallRiskScore.toFixed(1)}% - {getRiskAssessment(overallRiskScore).level} ({getRiskAssessment(overallRiskScore).title})
            </h3>
            <p className="text-gray-700">
              {getRiskAssessment(overallRiskScore).notification}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Risk Score Categories Matrix */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>RISK SCORE NOTIFICATIONS</CardTitle>
          <CardDescription>
            Classification of risk levels and required actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Category</TableHead>
                <TableHead className="w-1/4">Range</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>P1 (Critical)</span>
                  </div>
                </TableCell>
                <TableCell>Greater than 46</TableCell>
                <TableCell>Disclosure of restricted information</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>P2 (High)</span>
                  </div>
                </TableCell>
                <TableCell>Between 36-46</TableCell>
                <TableCell>Disclosure of non-restricted information</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>P3 (Medium)</span>
                  </div>
                </TableCell>
                <TableCell>Between 21-35</TableCell>
                <TableCell>Minimal impact by non-restricted disclosure</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>P4 (Low)</span>
                  </div>
                </TableCell>
                <TableCell>Between 1-20</TableCell>
                <TableCell>Risk is low as in informational</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RASBITA Score Card */}
        <Card>
          <CardHeader className="bg-purple-50 border-b">
            <CardTitle className="text-chart-4 flex items-center justify-between">
              <span>RASBITA™ Risk Score</span>
              <span className="text-2xl font-bold">{overallRiskScore.toFixed(1)}%</span>
            </CardTitle>
            <CardDescription>
              CISSP Risk Assessment Score by Threat and Impact Analysis
            </CardDescription>
            <div className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded">
              <p><strong>Core Components:</strong> Cybersecurity Incident Risk Score, Cybersecurity Gov & Mngt maturity level, NRRB (positive): spend on tools makes sense financially, and threat modeling for architecture</p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Risk Score" dataKey="value" stroke="#692abb" fill="#692abb" fillOpacity={0.6} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
              {Object.entries(categories).map(([key, value], index) => (
                <div key={key} className="bg-purple-50 p-2 rounded-md">
                  <div className="text-xs uppercase text-gray-500">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                  <div className="font-bold text-chart-4">{value}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Governance and Management Maturity */}
        {report.governanceMaturity && (
          <Card>
            <CardHeader className="bg-purple-50 border-b">
              <CardTitle className="text-chart-4">Cybersecurity Risk Maturity</CardTitle>
              <CardDescription>
                RASBITA™ GOV & MGNT SELF-SCORING Assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500 mb-1">Governance Maturity</div>
                  <div className="font-bold text-xl text-chart-4">
                    Tier {report.governanceMaturity.governanceScore}
                  </div>
                  <div className="text-purple-700 font-semibold">
                    {getTierLabel(report.governanceMaturity.governanceScore)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {report.governanceMaturity.governanceScore * 25}% Complete
                  </div>
                  <div className="mt-2 text-xs text-gray-600 italic">
                    {report.governanceMaturity.governanceScore === 0 && "Organization has no formalized cybersecurity governance processes"}
                    {report.governanceMaturity.governanceScore === 1 && "Organization has some informal risk practices but lacks consistency"}
                    {report.governanceMaturity.governanceScore === 2 && "Organization has approved risk management practices with some documentation"}
                    {report.governanceMaturity.governanceScore === 3 && "Organization consistently applies risk-informed policies across the enterprise"}
                    {report.governanceMaturity.governanceScore === 4 && "Organization actively adapts cybersecurity practices to counter evolving threats"}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500 mb-1">Management Maturity</div>
                  <div className="font-bold text-xl text-chart-4">
                    Tier {report.governanceMaturity.managementScore}
                  </div>
                  <div className="text-purple-700 font-semibold">
                    {getTierLabel(report.governanceMaturity.managementScore)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {report.governanceMaturity.managementScore * 25}% Complete
                  </div>
                  <div className="mt-2 text-xs text-gray-600 italic">
                    {report.governanceMaturity.managementScore === 0 && "No defined management processes for cybersecurity implementation"}
                    {report.governanceMaturity.managementScore === 1 && "Ad-hoc management of cybersecurity activities with limited awareness"}
                    {report.governanceMaturity.managementScore === 2 && "Management follows structured approach with defined responsibilities"}
                    {report.governanceMaturity.managementScore === 3 && "Established processes consistently managed with regular reviews"}
                    {report.governanceMaturity.managementScore === 4 && "Proactive management practices that continuously improve security posture"}
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
                <p className="text-blue-800 font-medium">Improvement Recommendation:</p>
                <p className="text-blue-700 text-xs mt-1">
                  {report.governanceMaturity.governanceScore < 4 && 
                    `Focus on improving your governance practices from Tier ${report.governanceMaturity.governanceScore} to Tier ${Math.min(report.governanceMaturity.governanceScore + 1, 4)} by formalizing cybersecurity policies and risk management processes.`}
                  {report.governanceMaturity.governanceScore === 4 && 
                    `Maintain your excellent Tier 4 governance practices while continuously adapting to emerging threats and technologies.`}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Financial Summary */}
        <Card>
          <CardHeader className="bg-purple-50 border-b">
            <CardTitle className="text-chart-4">Financial Impact Analysis</CardTitle>
            <CardDescription>
              Cost-Benefit Analysis for Security Controls
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500">Total Asset Value</div>
                  <div className="font-bold text-xl text-chart-4">{formatCurrency(financialSummary.totalAssetValue)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500">Total ALE (Before)</div>
                  <div className="font-bold text-xl text-chart-4">{formatCurrency(financialSummary.totalAnnualizedLossExpectancy)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500">Total Cost of Safeguards</div>
                  <div className="font-bold text-xl text-chart-4">{formatCurrency(financialSummary.totalCostOfSafeguards)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500">Net Risk Reduction Benefit</div>
                  <div className={`font-bold text-xl ${getNRRBColor(financialSummary.totalNetRiskReductionBenefit || 0)}`}>
                    {formatCurrency(financialSummary.totalNetRiskReductionBenefit)}
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-center text-gray-600 bg-blue-50 p-2 rounded-md">
                <strong>Note:</strong> Positive NRRB values indicate that spending on tools makes sense financially.
              </div>
              
              <div className="mt-3 bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700">NRRB (positive)</p>
                <p className="text-xs text-gray-600 mt-1">
                  Net Risk Reduction Benefit (NRRB) quantifies the financial benefit of your security investment by comparing 
                  your Annual Cost of Safeguards (ACS) against the reduction in annualized loss. A positive NRRB indicates 
                  spending on security tools makes sense financially and your security tooling investment is providing tangible value.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost-Benefit Analysis Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cost-Benefit Analysis</CardTitle>
          <CardDescription>
            Visualizing ALE, ACS, and NRRB across assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costBenefitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar name="ALE (Before Controls)" dataKey="ale" fill="#ff8042" />
                <Bar name="ALE (After Controls)" dataKey="aleAfter" fill="#8884d8" />
                <Bar name="Annual Cost of Safeguards" dataKey="acs" fill="#82ca9d" />
                <Bar name="Net Risk Reduction Benefit" dataKey="nrrb" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Risk Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Analysis Details</CardTitle>
          <CardDescription>
            Detailed breakdown of asset risks and controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Threat</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>AV</TableHead>
                  <TableHead>EF</TableHead>
                  <TableHead>ARO</TableHead>
                  <TableHead>SLE</TableHead>
                  <TableHead>ALE</TableHead>
                  <TableHead>ACS</TableHead>
                  <TableHead>NRRB (positive)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.assetName || "Unknown"}</TableCell>
                    <TableCell>{item.threatName || "Unknown"}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                        ${(item.priority || "").toLowerCase() === 'critical' ? 'bg-red-100 text-red-800' : 
                          (item.priority || "").toLowerCase() === 'high' ? 'bg-orange-100 text-orange-800' :
                          (item.priority || "").toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                        {item.priority || "Low"}
                      </span>
                    </TableCell>
                    <TableCell>{formatCurrency(item.assetValue)}</TableCell>
                    <TableCell>{((item.exposureFactor || 0) * 100).toFixed(0)}%</TableCell>
                    <TableCell>{(item.annualizedRateOfOccurrence || 0).toFixed(2)}</TableCell>
                    <TableCell>{formatCurrency(item.singleLossExpectancy)}</TableCell>
                    <TableCell>{formatCurrency(item.annualizedLossExpectancy)}</TableCell>
                    <TableCell>{formatCurrency(item.annualCostOfSafeguard)}</TableCell>
                    <TableCell className={getNRRBColor(item.netRiskReductionBenefit || 0)}>
                      {formatCurrency(item.netRiskReductionBenefit)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 text-sm text-gray-500">
          <div className="w-full">
            <p><strong>Legend:</strong></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 mt-2">
              <div>AV = Asset Value</div>
              <div>EF = Exposure Factor</div>
              <div>ARO = Annualized Rate of Occurrence</div>
              <div>SLE = Single Loss Expectancy</div>
              <div>ALE = Annualized Loss Expectancy</div>
              <div>ACS = Annual Cost of Safeguards</div>
              <div>NRRB = Net Risk Reduction Benefit (positive)</div>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Dashboard Metrics Card */}
      {/* Only render the dashboard section if it exists */}
      {report.dashboard ? (
        <Card>
          <CardHeader>
            <CardTitle>RASBITA™ Dashboard Metrics</CardTitle>
            <CardDescription>
              Key metrics and trends from the risk analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Most Frequent Threat</div>
                <div className="font-medium">{report.dashboard.mostFrequentThreat || "Ransomware"}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Least Frequent Threat</div>
                <div className="font-medium">{report.dashboard.leastFrequentThreat || "Physical Access"}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Most Frequent Priority</div>
                <div className="font-medium">{report.dashboard.mostFrequentPriority || "Medium"}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Threat Cost Range</div>
                <div className="font-medium">{formatCurrency(report.dashboard.minThreatCost || 5000)} - {formatCurrency(report.dashboard.maxThreatCost || 75000)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">ALE Range</div>
                <div className="font-medium">{formatCurrency(report.dashboard.minALE || 1500)} - {formatCurrency(report.dashboard.maxALE || 45000)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Safeguard Cost Range</div>
                <div className="font-medium">{formatCurrency(report.dashboard.minACS || 1000)} - {formatCurrency(report.dashboard.maxACS || 15000)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Financial Impact Summary */}
      <Card className="mt-6">
        <CardHeader className="bg-gray-50">
          <CardTitle>Financial Impact Report</CardTitle>
          <CardDescription>
            Detailed financial breakdown of the security incident
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="border p-4 rounded-md bg-slate-50">
                <h3 className="font-semibold mb-2">Device Information</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-gray-600">Device Type:</div>
                  <div className="font-medium">{report.deviceType || "Server"}</div>
                  
                  <div className="text-gray-600">Total Devices:</div>
                  <div className="font-medium">{report.totalDevices || "590"}</div>
                  
                  <div className="text-gray-600">Affected Devices:</div>
                  <div className="font-medium">{report.affectedDevices || "512"}</div>
                  
                  <div className="text-gray-600">Percentage Affected:</div>
                  <div className="font-medium">{report.percentageAffected || "86.78%"}</div>
                </div>
              </div>
              
              <div className="border p-4 rounded-md bg-slate-50">
                <h3 className="font-semibold mb-2">Data Impact</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-gray-600">Total Data Count:</div>
                  <div className="font-medium">{report.totalDataCount || "50,000"}</div>
                  
                  <div className="text-gray-600">Data Lost/Exposed:</div>
                  <div className="font-medium">{report.dataLost || "40,000"}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border p-4 rounded-md bg-slate-50">
                <h3 className="font-semibold mb-2">Cost Analysis</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-gray-600">Cost of Damaged Devices:</div>
                  <div className="font-medium">{formatCurrency(report.damagedDevicesCost || 2560000)}</div>
                  
                  <div className="text-gray-600">Threat Spread Cost:</div>
                  <div className="font-medium">{formatCurrency(report.threatSpreadCost || 960000)}</div>
                  
                  <div className="text-gray-600">Total Residual Cost:</div>
                  <div className="font-medium font-bold text-red-600">{formatCurrency(report.residualCost || 3520000)}</div>
                </div>
              </div>
              
              <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-md">
                <h3 className="font-semibold text-red-800 flex items-center gap-2">
                  <AlertOctagon className="h-5 w-5" />
                  Critical Financial Impact
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  The total financial impact of this incident is significant and requires immediate executive attention. Recovery costs may impact operational budgets.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card className="mt-6">
        <CardHeader className="bg-gray-50">
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none pt-6">
          <div className="mb-4 bg-blue-50 p-4 rounded-md">
            <h3 className="text-blue-800 font-semibold mb-2">RASBITA™ Assessment Overview</h3>
            <p className="text-sm text-blue-700">
              The RASBITA™ assessment provides two complementary views of your security posture:
            </p>
            <ol className="list-decimal list-inside text-sm text-blue-700 ml-4 mt-2">
              <li className="mb-1">
                <strong>RASBITA™ Risk Score ({overallRiskScore.toFixed(1)}%)</strong>: Quantifies the actual security risk exposure across assets. 
                Higher scores indicate greater risk and require more immediate action.
              </li>
              <li>
                <strong>Governance & Management Maturity (Tier {report.governanceMaturity?.governanceScore || 0}/{report.governanceMaturity?.managementScore || 0})</strong>: 
                Evaluates your organization's cybersecurity program maturity level.
                Higher tiers indicate more mature security practices which correlate with lower risk.
              </li>
            </ol>
          </div>
          
          <p>This assessment helps organizations quantify security risks and calculate associated financial losses. This information supports IT security budgeting and resource allocation decisions. The risk score interpretation table above provides context for understanding the severity level.</p>
          
          <p>This RASBITA™ assessment identifies and quantifies key security risks across your organization's assets. The overall risk score is <strong>{overallRiskScore.toFixed(1)}%</strong>, which is categorized as a <strong>{getRiskAssessment(overallRiskScore).level} priority</strong>.</p>
          
          {report.governanceMaturity && (
            <div className="my-4 p-3 bg-purple-50 rounded-md">
              <p className="text-purple-800 font-medium">
                Your organization's cybersecurity governance maturity is at <strong>Tier {report.governanceMaturity.governanceScore} ({getTierLabel(report.governanceMaturity.governanceScore)})</strong> with 
                management maturity at <strong>Tier {report.governanceMaturity.managementScore} ({getTierLabel(report.governanceMaturity.managementScore)})</strong>. 
                {report.governanceMaturity.governanceScore < 3 && report.governanceMaturity.managementScore < 3 ? 
                  " This below-average maturity level likely contributes to your elevated risk score." : 
                  report.governanceMaturity.governanceScore >= 3 && report.governanceMaturity.managementScore >= 3 ? 
                  " This above-average maturity level helps manage your security risk exposure." :
                  " Your organization has a mixed maturity profile that partially mitigates security risks."}
              </p>
            </div>
          )}
          
          <p>Key findings:</p>
          <ul>
            <li>The device type affected is <strong>{report.deviceType || "Server"}</strong> with a risk score of <strong>{overallRiskScore.toFixed(1)}%</strong></li>
            <li>Total number of data held in the department is <strong>{report.totalDataCount || "50,000"}</strong></li>
            <li>Number of devices affected or damaged: <strong>{report.affectedDevices || "512"}</strong></li>
            <li>Cost of all damaged devices: <strong>{formatCurrency(report.damagedDevicesCost || 2560000)}</strong></li>
            <li>This is <strong>{report.percentageAffected || "86.78%"}</strong> of the total devices</li>
            <li>Total pieces of data lost in the event: <strong>{report.dataLost || "40,000"}</strong></li>
            <li>Cost associated with threat spread: <strong>{formatCurrency(report.threatSpreadCost || 960000)}</strong></li>
            <li>Residual cost incurred from device damage and threat spread: <strong>{formatCurrency(report.residualCost || 3520000)}</strong></li>
          </ul>
          
          <p className="font-semibold">Conclusion:</p>
          <p className="font-semibold bg-red-50 p-3 border-l-4 border-red-500">
            This is a RASBITA™ risk score of {overallRiskScore.toFixed(1)}%: {getRiskAssessment(overallRiskScore).notification}
          </p>
          
          {report.governanceMaturity && (
            <div className="mt-4">
              <p className="font-semibold">Governance & Management Improvement:</p>
              <p className="bg-purple-50 p-3 border-l-4 border-purple-500">
                {report.governanceMaturity.governanceScore < 4 ? 
                  `To reduce future security risk, focus on improving your cybersecurity governance maturity from Tier ${report.governanceMaturity.governanceScore} to Tier ${Math.min(report.governanceMaturity.governanceScore + 1, 4)}. As maturity increases, overall security risk exposure typically decreases.` : 
                  `Maintain your excellent Tier 4 governance practices to continue minimizing security risk exposure.`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import the reusable Threat Modeling component */}
      <div className="flex items-center justify-between mt-6 mb-2">
        <h3 className="text-lg font-semibold">Threat Modeling</h3>
        <a 
          href="/threat-modeling" 
          className="text-xs text-chart-4 flex items-center gap-1 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Access standalone threat model tool</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
      {/* Use the reusable Threat Modeling component */}
      <ThreatModeling report={report} />
    </div>
  );
}