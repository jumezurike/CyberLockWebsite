import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface CostBenefitData {
  financialModel: {
    totalSecurityBudget: number;
    preventionCosts: number;
    detectionCosts: number;
    responseCosts: number;
    recoveryCosts: number;
    potentialLosses: number;
  };
  incidentCosts: {
    directCosts: number;
    indirectCosts: number;
    businessImpact: number;
    recoveryTime: number;
  };
  resourceAllocation: {
    personnelCosts: number;
    technologyCosts: number;
    processCosts: number;
    complianceCosts: number;
  };
}

export default function RasbitaCostBenefitAnalysis() {
  const [costData, setCostData] = useState<CostBenefitData>({
    financialModel: {
      totalSecurityBudget: 0,
      preventionCosts: 0,
      detectionCosts: 0,
      responseCosts: 0,
      recoveryCosts: 0,
      potentialLosses: 0,
    },
    incidentCosts: {
      directCosts: 0,
      indirectCosts: 0,
      businessImpact: 0,
      recoveryTime: 0,
    },
    resourceAllocation: {
      personnelCosts: 0,
      technologyCosts: 0,
      processCosts: 0,
      complianceCosts: 0,
    },
  });

  const updateFinancialModel = (field: string, value: number) => {
    setCostData(prev => ({
      ...prev,
      financialModel: {
        ...prev.financialModel,
        [field]: value
      }
    }));
  };

  const updateIncidentCosts = (field: string, value: number) => {
    setCostData(prev => ({
      ...prev,
      incidentCosts: {
        ...prev.incidentCosts,
        [field]: value
      }
    }));
  };

  const updateResourceAllocation = (field: string, value: number) => {
    setCostData(prev => ({
      ...prev,
      resourceAllocation: {
        ...prev.resourceAllocation,
        [field]: value
      }
    }));
  };

  // Calculate ROI metrics
  const calculateROI = () => {
    const totalInvestment = costData.financialModel.totalSecurityBudget;
    const totalPotentialLoss = costData.financialModel.potentialLosses;
    const actualIncidentCost = costData.incidentCosts.directCosts + costData.incidentCosts.indirectCosts;
    
    const riskReductionValue = totalPotentialLoss - actualIncidentCost;
    const roi = totalInvestment > 0 ? ((riskReductionValue - totalInvestment) / totalInvestment) * 100 : 0;
    const costAvoidance = riskReductionValue;
    const paybackPeriod = totalInvestment > 0 ? totalInvestment / (riskReductionValue / 12) : 0;

    return {
      roi: Math.round(roi * 100) / 100,
      costAvoidance: Math.round(costAvoidance),
      paybackPeriod: Math.round(paybackPeriod * 100) / 100,
      totalInvestment: Math.round(totalInvestment),
      riskReductionValue: Math.round(riskReductionValue)
    };
  };

  const roiMetrics = calculateROI();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>RASBITA Cost-Benefit Analysis</CardTitle>
          <p className="text-sm text-gray-600">
            Comprehensive financial impact modeling and return on security investment calculations
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="financial-model" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="financial-model">Financial Model</TabsTrigger>
              <TabsTrigger value="incident-costs">Incident Costs</TabsTrigger>
              <TabsTrigger value="resource-allocation">Resource Allocation</TabsTrigger>
              <TabsTrigger value="roi-analysis">ROI Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="financial-model" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="totalBudget">Total Security Budget ($)</Label>
                    <Input
                      id="totalBudget"
                      type="number"
                      placeholder="Enter total annual security budget"
                      value={costData.financialModel.totalSecurityBudget || ''}
                      onChange={(e) => updateFinancialModel('totalSecurityBudget', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="preventionCosts">Prevention Costs ($)</Label>
                    <Input
                      id="preventionCosts"
                      type="number"
                      placeholder="Security tools, training, policies"
                      value={costData.financialModel.preventionCosts || ''}
                      onChange={(e) => updateFinancialModel('preventionCosts', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="detectionCosts">Detection Costs ($)</Label>
                    <Input
                      id="detectionCosts"
                      type="number"
                      placeholder="Monitoring, SIEM, SOC operations"
                      value={costData.financialModel.detectionCosts || ''}
                      onChange={(e) => updateFinancialModel('detectionCosts', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="responseCosts">Response Costs ($)</Label>
                    <Input
                      id="responseCosts"
                      type="number"
                      placeholder="Incident response, forensics"
                      value={costData.financialModel.responseCosts || ''}
                      onChange={(e) => updateFinancialModel('responseCosts', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="recoveryCosts">Recovery Costs ($)</Label>
                    <Input
                      id="recoveryCosts"
                      type="number"
                      placeholder="Business continuity, restoration"
                      value={costData.financialModel.recoveryCosts || ''}
                      onChange={(e) => updateFinancialModel('recoveryCosts', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="potentialLosses">Potential Losses Without Security ($)</Label>
                    <Input
                      id="potentialLosses"
                      type="number"
                      placeholder="Estimated annual risk exposure"
                      value={costData.financialModel.potentialLosses || ''}
                      onChange={(e) => updateFinancialModel('potentialLosses', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="incident-costs" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="directCosts">Direct Incident Costs ($)</Label>
                    <Input
                      id="directCosts"
                      type="number"
                      placeholder="Actual costs from security incidents"
                      value={costData.incidentCosts.directCosts || ''}
                      onChange={(e) => updateIncidentCosts('directCosts', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="indirectCosts">Indirect Incident Costs ($)</Label>
                    <Input
                      id="indirectCosts"
                      type="number"
                      placeholder="Productivity loss, reputation damage"
                      value={costData.incidentCosts.indirectCosts || ''}
                      onChange={(e) => updateIncidentCosts('indirectCosts', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="businessImpact">Business Impact Cost ($)</Label>
                    <Input
                      id="businessImpact"
                      type="number"
                      placeholder="Revenue loss, customer impact"
                      value={costData.incidentCosts.businessImpact || ''}
                      onChange={(e) => updateIncidentCosts('businessImpact', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="recoveryTime">Recovery Time (hours)</Label>
                    <Input
                      id="recoveryTime"
                      type="number"
                      placeholder="Average time to recover from incidents"
                      value={costData.incidentCosts.recoveryTime || ''}
                      onChange={(e) => updateIncidentCosts('recoveryTime', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="resource-allocation" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="personnelCosts">Personnel Costs ($)</Label>
                    <Input
                      id="personnelCosts"
                      type="number"
                      placeholder="Security staff salaries and benefits"
                      value={costData.resourceAllocation.personnelCosts || ''}
                      onChange={(e) => updateResourceAllocation('personnelCosts', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="technologyCosts">Technology Costs ($)</Label>
                    <Input
                      id="technologyCosts"
                      type="number"
                      placeholder="Security tools and infrastructure"
                      value={costData.resourceAllocation.technologyCosts || ''}
                      onChange={(e) => updateResourceAllocation('technologyCosts', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="processCosts">Process Costs ($)</Label>
                    <Input
                      id="processCosts"
                      type="number"
                      placeholder="Procedures, training, documentation"
                      value={costData.resourceAllocation.processCosts || ''}
                      onChange={(e) => updateResourceAllocation('processCosts', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="complianceCosts">Compliance Costs ($)</Label>
                    <Input
                      id="complianceCosts"
                      type="number"
                      placeholder="Audit, certification, regulatory"
                      value={costData.resourceAllocation.complianceCosts || ''}
                      onChange={(e) => updateResourceAllocation('complianceCosts', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="roi-analysis" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Return on Investment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {roiMetrics.roi > 0 ? '+' : ''}{roiMetrics.roi}%
                    </div>
                    <p className="text-sm text-gray-600">
                      {roiMetrics.roi > 0 ? 'Positive ROI' : 'Investment Recovery Needed'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cost Avoidance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      ${roiMetrics.costAvoidance.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">
                      Potential losses prevented
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payback Period</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {roiMetrics.paybackPeriod} months
                    </div>
                    <p className="text-sm text-gray-600">
                      Time to recover investment
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Investment Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Investment:</span>
                      <span className="font-semibold">${roiMetrics.totalInvestment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Reduction Value:</span>
                      <span className="font-semibold">${roiMetrics.riskReductionValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Net Benefit:</span>
                      <span className={`font-semibold ${roiMetrics.riskReductionValue - roiMetrics.totalInvestment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${(roiMetrics.riskReductionValue - roiMetrics.totalInvestment).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Investment Efficiency</label>
                    <Progress 
                      value={Math.min(100, Math.max(0, roiMetrics.roi + 50))} 
                      className="w-full"
                    />
                    <p className="text-xs text-gray-600">
                      Security investment effectiveness score
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}