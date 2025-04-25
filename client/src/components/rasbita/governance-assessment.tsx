import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface GovernanceAssessmentProps {
  onComplete: (scores: GovernanceScores) => void;
}

export interface GovernanceScores {
  governanceScore: number; // 0-4 (represents Tiers 0, 0-1, 1-2, 2-3, 3-4)
  managementScore: number; // 0-4 (represents Tiers 0, 0-1, 1-2, 2-3, 3-4)
  monthsAtTier: number; // Number of months at current tier
  desireToImprove: boolean; // Whether they want to improve
  // Percentage completion mapping: 
  // Tier 0 (0-0): 0%
  // Tier 1 (0-1): 25%
  // Tier 2 (1-2): 50%
  // Tier 3 (2-3): 75%
  // Tier 4 (3-4): 100%
}

export default function GovernanceAssessment({ onComplete }: GovernanceAssessmentProps) {
  const [activeTab, setActiveTab] = useState("governance");
  const [governanceScore, setGovernanceScore] = useState<number>(0); // Default to Tier 0
  const [managementScore, setManagementScore] = useState<number>(0); // Default to Tier 0
  const [monthsAtTier, setMonthsAtTier] = useState<number>(0);
  const [desireToImprove, setDesireToImprove] = useState<boolean>(false);
  
  const handleSubmit = () => {
    onComplete({
      governanceScore,
      managementScore,
      monthsAtTier,
      desireToImprove
    });
  };
  
  const isComplete = governanceScore !== null && managementScore !== null;
  
  return (
    <Card className="w-full mb-8">
      <CardHeader className="bg-purple-50">
        <CardTitle className="text-chart-4">Cybersecurity Risk Governance Assessment</CardTitle>
        <CardDescription>
          Evaluate your organization's cybersecurity risk governance and management maturity based on NIST CSF 2.0 framework
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="governance">Cybersecurity Risk Governance</TabsTrigger>
            <TabsTrigger value="management">Cybersecurity Risk Management</TabsTrigger>
            <TabsTrigger value="additional">Additional Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="governance">
            <div className="space-y-6">
              <div className="text-lg font-semibold text-chart-4">
                Question 1: What cybersecurity risk governance tier is your organization?
              </div>
              <p className="text-gray-600">
                Evaluate your organization's approach to cybersecurity risk governance.
                Select the tier that best describes your current maturity level.
              </p>
              
              <RadioGroup 
                value={governanceScore?.toString() || "0"} 
                onValueChange={(value) => setGovernanceScore(parseInt(value))}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="0" id="governance-0" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="governance-0" className="text-base font-semibold">Tier 0: None (0%)</Label>
                    <p className="text-sm text-gray-500">
                      Not currently part of the cybersecurity risk governance and management practices in the organization.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="1" id="governance-1" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="governance-1" className="text-base font-semibold">Tier 1-2: Partial (25%)</Label>
                    <p className="text-sm text-gray-500">
                      Application of cybersecurity risk governance is ad hoc and prioritization is not 
                      explicitly considered.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="2" id="governance-2" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="governance-2" className="text-base font-semibold">Tier 2-3: Risk Informed (50%)</Label>
                    <p className="text-sm text-gray-500">
                      Risk management practices are approved by management but may not be established as organization-wide policy. 
                      The prioritization of cybersecurity activities and protection needs is directly informed by organizational risk objectives, 
                      the threat environment, or business/mission requirements.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="3" id="governance-3" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="governance-3" className="text-base font-semibold">Tier 3-4: Repeatable (75%)</Label>
                    <p className="text-sm text-gray-500">
                      The organization's risk management practices are formally approved and expressed as policy.
                      Risk-informed policies, processes, and procedures are defined, implemented as intended, and reviewed.
                      Organizational cybersecurity practices are regularly updated based on the application of risk management
                      processes to changes in business/mission requirements, threats, and technological landscape.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="4" id="governance-4" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="governance-4" className="text-base font-semibold">Tier 4-5: Adaptive (100%)</Label>
                    <p className="text-sm text-gray-500">
                      There is an organization-wide approach to managing cybersecurity risks that uses risk-informed policies, 
                      processes, and procedures to address potential cybersecurity events. The relationship between cybersecurity 
                      risks and organizational objectives is clearly understood and considered when making decisions. 
                      Executives monitor cybersecurity risks in the same context as financial and other organizational risks. 
                      The organizational budget is based on an understanding of the current and predicted risk environment.
                    </p>
                  </div>
                </div>
              </RadioGroup>
              
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("management")}
                  className="bg-chart-4 text-white hover:bg-purple-700"
                >
                  Continue to Risk Management
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="management">
            <div className="space-y-6">
              <div className="text-lg font-semibold text-chart-4">
                Question 1 (continued): What cybersecurity risk management tier is your organization?
              </div>
              <p className="text-gray-600">
                Evaluate your organization's approach to cybersecurity risk management.
                Select the tier that best describes your current maturity level.
              </p>
              
              <RadioGroup 
                value={managementScore?.toString() || "0"} 
                onValueChange={(value) => setManagementScore(parseInt(value))}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="0" id="management-0" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="management-0" className="text-base font-semibold">Tier 0-1: None (0%)</Label>
                    <p className="text-sm text-gray-500">
                      Not currently part of the cybersecurity risk governance and management practices in the organization.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="1" id="management-1" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="management-1" className="text-base font-semibold">Tier 1-2: Partial (25%)</Label>
                    <p className="text-sm text-gray-500">
                      There is limited awareness of cybersecurity risks at the organizational level.
                      The organization implements cybersecurity risk management on an irregular, case-by-case basis.
                      The organization may not have processes that enable cybersecurity information to be shared within the organization.
                      The organization is generally unaware of the cybersecurity risks associated with its third-party suppliers or business partners.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="2" id="management-2" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="management-2" className="text-base font-semibold">Tier 2: Risk Informed</Label>
                    <p className="text-sm text-gray-500">
                      There is an awareness of cybersecurity risks at the organizational level, but an organization-wide approach to managing cybersecurity risks has not been established.
                      Consideration of cybersecurity in organizational objectives and programs may occur at some but not all levels of the organization. 
                      Cyber risk assessment of organizational and external assets occurs, but is not typically repeatable or reoccurring.
                      Cybersecurity information is shared within the organization on an informal basis.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="3" id="management-3" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="management-3" className="text-base font-semibold">Tier 3: Repeatable</Label>
                    <p className="text-sm text-gray-500">
                      There is an organization-wide approach to managing cybersecurity risks. Cybersecurity information is routinely shared throughout the organization.
                      Consistent methods are in place to respond effectively to changes in risk. Personnel possess the knowledge and skills to perform their appointed roles and responsibilities.
                      The organization consistently and accurately monitors cybersecurity risks of assets. Senior cybersecurity and non-cybersecurity executives communicate regularly regarding cybersecurity risks.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="4" id="management-4" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="management-4" className="text-base font-semibold">Tier 4: Adaptive</Label>
                    <p className="text-sm text-gray-500">
                      The organization adapts its cybersecurity practices based on previous and current cybersecurity activities, including lessons learned and predictive indicators.
                      The organization uses real-time or near real-time information to understand and consistently act upon cybersecurity risks associated with the products and services it provides and uses.
                      Cybersecurity information is consistently and accurately shared throughout the organization and with authorized third parties.
                    </p>
                  </div>
                </div>
              </RadioGroup>
              
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setActiveTab("governance")}>
                  Back to Governance
                </Button>
                <Button 
                  className="bg-chart-4 text-white hover:bg-purple-700" 
                  onClick={() => setActiveTab("additional")}
                >
                  Continue to Additional Questions
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="additional">
            <div className="space-y-6">
              <div className="text-lg font-semibold text-chart-4">
                Question 2: Time at Current Tier and Improvement Goals
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="months-at-tier" className="text-md font-medium">
                    How many months has your organization been at Tier {governanceScore}?
                  </Label>
                  <Input 
                    id="months-at-tier" 
                    type="number" 
                    min="0"
                    value={monthsAtTier.toString()} 
                    onChange={(e) => setMonthsAtTier(parseInt(e.target.value) || 0)}
                    className="max-w-xs"
                  />
                </div>
                
                <div className="flex items-start space-x-2 pt-4">
                  <Checkbox 
                    id="improvement" 
                    checked={desireToImprove}
                    onCheckedChange={(checked) => {
                      setDesireToImprove(checked === true);
                    }}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="improvement"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Would you like to improve your cybersecurity maturity?
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Our SOS²A (SMB Organizational and System Security Analysis) can help you improve your security maturity.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-purple-50 p-4 rounded-md">
                <h3 className="font-medium text-chart-4 mb-2">Why this matters</h3>
                <p className="text-sm text-gray-700">
                  Understanding your current tier and how long you've been operating at this level helps establish your organization's security maturity baseline. 
                  Organizations that remain at lower tiers for extended periods face increased risk exposure.
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  CyberLockX's SOS²A assessment can help you identify gaps and create a roadmap to reach higher tiers of cybersecurity maturity.
                </p>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("management")}
                >
                  Back to Risk Management
                </Button>
                <Button 
                  className="bg-chart-4 text-white hover:bg-purple-700" 
                  onClick={handleSubmit}
                >
                  Complete Assessment
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {isComplete && governanceScore !== null && managementScore !== null && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center text-green-700 gap-2 mb-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold">Assessment Complete!</span>
            </div>
            <p className="text-sm text-green-600">
              Based on your selections, your organization is at:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-green-600">
              <li>• Governance Tier: {getTierLabel(governanceScore)}</li>
              <li>• Management Tier: {getTierLabel(managementScore)}</li>
              <li>• Time at current tier: {monthsAtTier} months</li>
              <li>• Improvement desired: {desireToImprove ? 'Yes' : 'No'}</li>
            </ul>
            <p className="mt-2 text-sm text-green-600">
              Click "Complete Assessment" to incorporate these results into your RASBITA report.
              {desireToImprove && <span className="font-semibold"> We recommend using SOS²A to improve your security maturity.</span>}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getTierLabel(score: number | null): string {
  if (score === null) return "Not assessed";
  
  switch (score) {
    case 0: return "Tier 0: None";
    case 1: return "Tier 1: Partial";
    case 2: return "Tier 2: Risk Informed";
    case 3: return "Tier 3: Repeatable";
    case 4: return "Tier 4: Adaptive";
    default: return "Unknown";
  }
}