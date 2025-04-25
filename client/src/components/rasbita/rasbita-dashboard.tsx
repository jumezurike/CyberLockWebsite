import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { RasbitaReport, RasbitaRiskItem } from '@/lib/sos2a-types';

interface RasbitaDashboardProps {
  report: RasbitaReport;
}

export default function RasbitaDashboard({ report }: RasbitaDashboardProps) {
  // Format currency with commas and 2 decimal places
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Data for the radar chart
  const radarData = [
    {
      subject: 'R (Risk)',
      value: report.rasbitaCategories.risk,
      fullMark: 100,
    },
    {
      subject: 'A (Adversarial)',
      value: report.rasbitaCategories.adversarialInsight,
      fullMark: 100,
    },
    {
      subject: 'S (Security)',
      value: report.rasbitaCategories.securityControls,
      fullMark: 100,
    },
    {
      subject: 'B (Business)',
      value: report.rasbitaCategories.businessImpact,
      fullMark: 100,
    },
    {
      subject: 'I (Information)',
      value: report.rasbitaCategories.informationAssurance,
      fullMark: 100,
    },
    {
      subject: 'T (Threat)',
      value: report.rasbitaCategories.threatIntelligence,
      fullMark: 100,
    },
    {
      subject: 'A (Architecture)',
      value: report.rasbitaCategories.architecture,
      fullMark: 100,
    },
  ];

  // Data for the cost-benefit analysis chart
  const costBenefitData = report.riskItems.map(item => ({
    name: item.assetName.substring(0, 15) + (item.assetName.length > 15 ? '...' : ''),
    ale: item.annualizedLossExpectancy,
    aleAfter: item.annualizedLossExpectancyAfterControls,
    acs: item.annualCostOfSafeguard,
    nrrb: item.netRiskReductionBenefit,
  }));

  // Function to determine status color based on NRRB value
  const getNRRBColor = (nrrb: number) => {
    if (nrrb > 0) return 'text-green-600';
    if (nrrb === 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="rasbita-dashboard space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RASBITA Score Card */}
        <Card>
          <CardHeader className="bg-purple-50 border-b">
            <CardTitle className="text-chart-4 flex items-center justify-between">
              <span>RASBITA™ Risk Score</span>
              <span className="text-2xl font-bold">{report.overallRiskScore.toFixed(1)}%</span>
            </CardTitle>
            <CardDescription>
              CISSP Risk Assessment Score by Threat and Impact Analysis
            </CardDescription>
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
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-7 gap-2 text-center">
              {Object.entries(report.rasbitaCategories).map(([key, value], index) => (
                <div key={key} className="bg-purple-50 p-2 rounded-md">
                  <div className="text-xs uppercase text-gray-500">{key.charAt(0).toUpperCase()}</div>
                  <div className="font-bold text-chart-4">{value}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                  <div className="font-bold text-xl text-chart-4">{formatCurrency(report.financialSummary.totalAssetValue)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500">Total ALE (Before)</div>
                  <div className="font-bold text-xl text-chart-4">{formatCurrency(report.financialSummary.totalAnnualizedLossExpectancy)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500">Total Cost of Safeguards</div>
                  <div className="font-bold text-xl text-chart-4">{formatCurrency(report.financialSummary.totalCostOfSafeguards)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500">Net Risk Reduction Benefit</div>
                  <div className={`font-bold text-xl ${getNRRBColor(report.financialSummary.totalNetRiskReductionBenefit)}`}>
                    {formatCurrency(report.financialSummary.totalNetRiskReductionBenefit)}
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-center text-gray-600 bg-blue-50 p-2 rounded-md">
                <strong>Note:</strong> Positive NRRB values indicate cost-effective security controls.
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
                  <TableHead>NRRB</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.riskItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.assetName}</TableCell>
                    <TableCell>{item.threatName}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                        ${item.priority === 'Critical' ? 'bg-red-100 text-red-800' : 
                          item.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                          item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                        {item.priority}
                      </span>
                    </TableCell>
                    <TableCell>{formatCurrency(item.assetValue)}</TableCell>
                    <TableCell>{(item.exposureFactor * 100).toFixed(0)}%</TableCell>
                    <TableCell>{item.annualizedRateOfOccurrence.toFixed(2)}</TableCell>
                    <TableCell>{formatCurrency(item.singleLossExpectancy)}</TableCell>
                    <TableCell>{formatCurrency(item.annualizedLossExpectancy)}</TableCell>
                    <TableCell>{formatCurrency(item.annualCostOfSafeguard)}</TableCell>
                    <TableCell className={getNRRBColor(item.netRiskReductionBenefit)}>
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
              <div>NRRB = Net Risk Reduction Benefit</div>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Dashboard Metrics Card */}
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
              <div className="font-medium">{report.dashboard.mostFrequentThreat}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-sm text-gray-500">Least Frequent Threat</div>
              <div className="font-medium">{report.dashboard.leastFrequentThreat}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-sm text-gray-500">Most Frequent Priority</div>
              <div className="font-medium">{report.dashboard.mostFrequentPriority}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-sm text-gray-500">Threat Cost Range</div>
              <div className="font-medium">{formatCurrency(report.dashboard.minThreatCost)} - {formatCurrency(report.dashboard.maxThreatCost)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-sm text-gray-500">ALE Range</div>
              <div className="font-medium">{formatCurrency(report.dashboard.minALE)} - {formatCurrency(report.dashboard.maxALE)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-sm text-gray-500">Safeguard Cost Range</div>
              <div className="font-medium">{formatCurrency(report.dashboard.minACS)} - {formatCurrency(report.dashboard.maxACS)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}