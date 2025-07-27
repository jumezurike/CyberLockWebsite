import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RiskItem {
  id: string;
  threat: string;
  assetValue: number;
  exposureFactor: number; // 0-1 scale
  likelihood: number; // 1-5 scale
  impact: number; // 1-5 scale
  currentControls: string;
  controlEffectiveness: number; // 0-1 scale
}

interface HeatmapData {
  riskItems: RiskItem[];
  totalAssetValue: number;
  annualIncidentRate: number;
  controlInvestment: number;
}

export default function CBFHeatmap() {
  const [heatmapData, setHeatmapData] = useState<HeatmapData>({
    riskItems: [
      {
        id: '1',
        threat: 'Data Breach - Patient Records',
        assetValue: 500000,
        exposureFactor: 0.8,
        likelihood: 3,
        impact: 5,
        currentControls: 'Encryption, Access Controls',
        controlEffectiveness: 0.7
      },
      {
        id: '2', 
        threat: 'Ransomware Attack',
        assetValue: 300000,
        exposureFactor: 0.9,
        likelihood: 4,
        impact: 4,
        currentControls: 'Backup Systems, EDR',
        controlEffectiveness: 0.6
      },
      {
        id: '3',
        threat: 'Insider Threat - Privileged Access',
        assetValue: 200000,
        exposureFactor: 0.6,
        likelihood: 2,
        impact: 4,
        currentControls: 'RBAC, Monitoring',
        controlEffectiveness: 0.8
      },
      {
        id: '4',
        threat: 'Third-Party Vendor Breach',
        assetValue: 150000,
        exposureFactor: 0.7,
        likelihood: 3,
        impact: 3,
        currentControls: 'Vendor Assessments',
        controlEffectiveness: 0.5
      },
      {
        id: '5',
        threat: 'Network Infrastructure Attack',
        assetValue: 400000,
        exposureFactor: 0.5,
        likelihood: 2,
        impact: 3,
        currentControls: 'Firewalls, IDS/IPS',
        controlEffectiveness: 0.7
      }
    ],
    totalAssetValue: 1550000,
    annualIncidentRate: 0.15,
    controlInvestment: 250000
  });

  // Risk Level Matrix (Impact × Likelihood)
  const RISK_MATRIX = {
    1: { 1: 'Very Low', 2: 'Low', 3: 'Low', 4: 'Medium', 5: 'Medium' },
    2: { 1: 'Low', 2: 'Low', 3: 'Medium', 4: 'Medium', 5: 'High' },
    3: { 1: 'Low', 2: 'Medium', 3: 'Medium', 4: 'High', 5: 'High' },
    4: { 1: 'Medium', 2: 'Medium', 3: 'High', 4: 'High', 5: 'Very High' },
    5: { 1: 'Medium', 2: 'High', 3: 'High', 4: 'Very High', 5: 'Very High' }
  };

  // Get risk score and level for a given impact and likelihood
  const getRiskScore = (impact: number, likelihood: number) => {
    const score = impact * likelihood;
    const level = RISK_MATRIX[impact as keyof typeof RISK_MATRIX][likelihood as keyof typeof RISK_MATRIX[1]];
    return { score, level };
  };

  // Get color class based on risk score
  const getRiskColor = (score: number) => {
    if (score <= 6) return 'bg-blue-100 text-blue-800';
    if (score <= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Calculate RASBITA-CBF metrics
  const calculateCBFMetrics = () => {
    let totalSLE = 0;
    let totalALE = 0;
    let totalResidualRisk = 0;
    let weightedRiskScore = 0;
    let totalWeight = 0;

    heatmapData.riskItems.forEach(item => {
      // Single Loss Expectancy (SLE) = Asset Value × Exposure Factor
      const sle = item.assetValue * item.exposureFactor;
      
      // Annualized Loss Expectancy (ALE) = SLE × Annual Rate of Occurrence
      const aro = heatmapData.annualIncidentRate * (item.likelihood / 5);
      const ale = sle * aro;
      
      // Risk Score (Impact × Likelihood)
      const riskScore = item.impact * item.likelihood;
      
      // Residual Risk after controls
      const residualRisk = ale * (1 - item.controlEffectiveness);
      
      totalSLE += sle;
      totalALE += ale;
      totalResidualRisk += residualRisk;
      weightedRiskScore += riskScore * item.assetValue;
      totalWeight += item.assetValue;
    });

    // Net Risk Reduction Benefit (NRRB) = Total ALE - (Residual Risk + Control Investment)
    const nrrb = totalALE - (totalResidualRisk + heatmapData.controlInvestment);
    
    // CBF Score (0-100% scale)
    const cbfScore = Math.min(100, Math.max(0, (nrrb / totalALE) * 100));
    
    // ROI = (Risk Reduction Value - Control Investment) / Control Investment
    const riskReductionValue = totalALE - totalResidualRisk;
    const roi = heatmapData.controlInvestment > 0 ? 
      ((riskReductionValue - heatmapData.controlInvestment) / heatmapData.controlInvestment) * 100 : 0;

    return {
      totalSLE: Math.round(totalSLE),
      totalALE: Math.round(totalALE), 
      totalResidualRisk: Math.round(totalResidualRisk),
      nrrb: Math.round(nrrb),
      cbfScore: Math.round(cbfScore * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      riskReductionValue: Math.round(riskReductionValue),
      avgRiskScore: totalWeight > 0 ? Math.round((weightedRiskScore / totalWeight) * 100) / 100 : 0
    };
  };

  const metrics = calculateCBFMetrics();

  const updateRiskItem = (id: string, field: keyof RiskItem, value: any) => {
    setHeatmapData(prev => ({
      ...prev,
      riskItems: prev.riskItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateGlobalData = (field: keyof Omit<HeatmapData, 'riskItems'>, value: number) => {
    setHeatmapData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            RASBITA-CBF Risk Heatmap Analysis
            <div className="text-right">
              <div className="text-sm text-gray-600">CBF Score</div>
              <div className="text-2xl font-bold text-blue-600">{metrics.cbfScore}%</div>
            </div>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Comprehensive financial risk assessment with impact vs likelihood analysis
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="heatmap" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="heatmap">Risk Heatmap</TabsTrigger>
              <TabsTrigger value="financial">Financial Analysis</TabsTrigger>
              <TabsTrigger value="metrics">CBF Metrics</TabsTrigger>
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="heatmap" className="space-y-6">
              {/* 5x5 Risk Matrix */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Scoring Matrix</CardTitle>
                  <p className="text-sm text-gray-600">Impact (rows) × Likelihood (columns)</p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border text-xs">
                      <thead>
                        <tr>
                          <th className="p-2 border bg-gray-100 font-semibold"></th>
                          <th className="p-2 border bg-gray-100 font-semibold">1<br/>Rare</th>
                          <th className="p-2 border bg-gray-100 font-semibold">2<br/>Unlikely</th>
                          <th className="p-2 border bg-gray-100 font-semibold">3<br/>Possible</th>
                          <th className="p-2 border bg-gray-100 font-semibold">4<br/>Likely</th>
                          <th className="p-2 border bg-gray-100 font-semibold">5<br/>Very Likely</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[5, 4, 3, 2, 1].map(impact => (
                          <tr key={impact}>
                            <td className="p-2 border bg-gray-100 font-semibold">
                              {impact}<br/>
                              <span className="text-xs">
                                {impact === 5 && 'Extreme'}
                                {impact === 4 && 'Major'}
                                {impact === 3 && 'Moderate'}
                                {impact === 2 && 'Minor'}
                                {impact === 1 && 'Trivial'}
                              </span>
                            </td>
                            {[1, 2, 3, 4, 5].map(likelihood => {
                              const score = impact * likelihood;
                              return (
                                <td key={likelihood} className={`p-2 border text-center font-semibold ${getRiskColor(score)}`}>
                                  {score}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-100 border"></div>
                      <span className="text-sm">Low Risk (1-6)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-100 border"></div>
                      <span className="text-sm">Medium Risk (7-10)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 border"></div>
                      <span className="text-sm">High Risk (11-25)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Items Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-2 px-3 border text-left font-medium">Threat/Risk</th>
                          <th className="py-2 px-3 border text-center font-medium">Asset Value</th>
                          <th className="py-2 px-3 border text-center font-medium">Impact</th>
                          <th className="py-2 px-3 border text-center font-medium">Likelihood</th>
                          <th className="py-2 px-3 border text-center font-medium">Risk Score</th>
                          <th className="py-2 px-3 border text-center font-medium">Risk Level</th>
                          <th className="py-2 px-3 border text-center font-medium">SLE</th>
                          <th className="py-2 px-3 border text-center font-medium">ALE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {heatmapData.riskItems.map(item => {
                          const { score, level } = getRiskScore(item.impact, item.likelihood);
                          const sle = item.assetValue * item.exposureFactor;
                          const aro = heatmapData.annualIncidentRate * (item.likelihood / 5);
                          const ale = sle * aro;
                          
                          return (
                            <tr key={item.id}>
                              <td className="py-2 px-3 border">{item.threat}</td>
                              <td className="py-2 px-3 border text-center">${item.assetValue.toLocaleString()}</td>
                              <td className="py-2 px-3 border text-center">{item.impact}</td>
                              <td className="py-2 px-3 border text-center">{item.likelihood}</td>
                              <td className="py-2 px-3 border text-center font-medium">{score}</td>
                              <td className="py-2 px-3 border text-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(score)}`}>
                                  {level}
                                </span>
                              </td>
                              <td className="py-2 px-3 border text-center">${Math.round(sle).toLocaleString()}</td>
                              <td className="py-2 px-3 border text-center">${Math.round(ale).toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total SLE</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      ${metrics.totalSLE.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">Single Loss Expectancy</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total ALE</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      ${metrics.totalALE.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">Annualized Loss Expectancy</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">NRRB</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${metrics.nrrb > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${metrics.nrrb.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">Net Risk Reduction Benefit</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">ROI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${metrics.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metrics.roi > 0 ? '+' : ''}{metrics.roi}%
                    </div>
                    <p className="text-sm text-gray-600">Return on Investment</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Asset Value:</span>
                        <span className="font-semibold">${heatmapData.totalAssetValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Annual Incident Rate:</span>
                        <span className="font-semibold">{(heatmapData.annualIncidentRate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Control Investment:</span>
                        <span className="font-semibold">${heatmapData.controlInvestment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Risk Reduction Value:</span>
                        <span className="font-semibold">${metrics.riskReductionValue.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Residual Risk:</span>
                        <span className="font-semibold">${metrics.totalResidualRisk.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Risk Score:</span>
                        <span className="font-semibold">{metrics.avgRiskScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost Avoidance:</span>
                        <span className="font-semibold text-green-600">${(metrics.totalALE - metrics.totalResidualRisk).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Net Benefit:</span>
                        <span className={`font-semibold ${metrics.nrrb > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${metrics.nrrb.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>RASBITA-CBF Score Breakdown</CardTitle>
                  <p className="text-sm text-gray-600">100% scoring methodology</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-2">
                      {metrics.cbfScore}%
                    </div>
                    <div className="text-lg text-gray-600">
                      RASBITA-CBF Overall Score
                    </div>
                    <Progress value={metrics.cbfScore} className="w-full mt-4" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round((metrics.riskReductionValue / metrics.totalALE) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Risk Reduction</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round((1 - (metrics.totalResidualRisk / metrics.totalALE)) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Control Effectiveness</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {metrics.roi > 0 ? Math.min(100, Math.round(metrics.roi)) : 0}%
                      </div>
                      <div className="text-sm text-gray-600">Investment Efficiency</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">CBF Scoring Formula:</h4>
                    <div className="text-sm space-y-1">
                      <div><strong>SLE</strong> = Asset Value × Exposure Factor</div>
                      <div><strong>ALE</strong> = SLE × Annual Rate of Occurrence</div>
                      <div><strong>NRRB</strong> = Total ALE - (Residual Risk + Control Investment)</div>
                      <div><strong>CBF Score</strong> = (NRRB / Total ALE) × 100%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="configuration" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Global Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="totalAssetValue">Total Asset Value ($)</Label>
                      <Input
                        id="totalAssetValue"
                        type="number"
                        value={heatmapData.totalAssetValue}
                        onChange={(e) => updateGlobalData('totalAssetValue', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="annualIncidentRate">Annual Incident Rate (%)</Label>
                      <Input
                        id="annualIncidentRate"
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={heatmapData.annualIncidentRate}
                        onChange={(e) => updateGlobalData('annualIncidentRate', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="controlInvestment">Control Investment ($)</Label>
                      <Input
                        id="controlInvestment"
                        type="number"
                        value={heatmapData.controlInvestment}
                        onChange={(e) => updateGlobalData('controlInvestment', Number(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Items Configuration</CardTitle>
                  <p className="text-sm text-gray-600">Modify individual risk assessments</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {heatmapData.riskItems.map(item => (
                      <div key={item.id} className="border p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <Label>Threat</Label>
                            <Input
                              value={item.threat}
                              onChange={(e) => updateRiskItem(item.id, 'threat', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Asset Value ($)</Label>
                            <Input
                              type="number"
                              value={item.assetValue}
                              onChange={(e) => updateRiskItem(item.id, 'assetValue', Number(e.target.value))}
                            />
                          </div>
                          <div>
                            <Label>Impact (1-5)</Label>
                            <Select value={item.impact.toString()} onValueChange={(value) => updateRiskItem(item.id, 'impact', Number(value))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 - Trivial</SelectItem>
                                <SelectItem value="2">2 - Minor</SelectItem>
                                <SelectItem value="3">3 - Moderate</SelectItem>
                                <SelectItem value="4">4 - Major</SelectItem>
                                <SelectItem value="5">5 - Extreme</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Likelihood (1-5)</Label>
                            <Select value={item.likelihood.toString()} onValueChange={(value) => updateRiskItem(item.id, 'likelihood', Number(value))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 - Rare</SelectItem>
                                <SelectItem value="2">2 - Unlikely</SelectItem>
                                <SelectItem value="3">3 - Possible</SelectItem>
                                <SelectItem value="4">4 - Likely</SelectItem>
                                <SelectItem value="5">5 - Very Likely</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}