import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// NIST CSF 2.0 Complete Functional Areas
interface FunctionalArea {
  id: string;
  category: 'GOVERN' | 'IDENTIFY' | 'PROTECT' | 'DETECT' | 'RESPOND' | 'RECOVER';
  name: string;
  description: string;
  subcategories: number;
}

interface TierScore {
  functionalAreaId: string;
  currentTier: number; // 0-4
  targetTier: number; // 0-4
  timeAtTier: number; // months
}

interface CybersecurityHygieneResult {
  overallScore: number; // 0-100%
  overallTier: number; // 0-4
  categoryScores: {
    [key in 'GOVERN' | 'IDENTIFY' | 'PROTECT' | 'DETECT' | 'RESPOND' | 'RECOVER']: {
      score: number;
      tier: number;
      functionalAreas: TierScore[];
    }
  };
  hygieneLevel: 'Critical Risk' | 'High Risk' | 'Moderate Risk' | 'Good' | 'Excellent';
  recommendations: string[];
}

// Complete NIST CSF 2.0 Functional Areas (106 subcategories total)
const NIST_CSF_FUNCTIONAL_AREAS: FunctionalArea[] = [
  // GOVERN (26 subcategories)
  { id: 'GV-OC', category: 'GOVERN', name: 'Organizational Context', description: 'Understanding the organizational environment', subcategories: 5 },
  { id: 'GV-RM', category: 'GOVERN', name: 'Risk Management Strategy', description: 'Risk management strategy and expectations', subcategories: 7 },
  { id: 'GV-RR', category: 'GOVERN', name: 'Roles, Responsibilities', description: 'Cybersecurity roles and responsibilities', subcategories: 2 },
  { id: 'GV-PO', category: 'GOVERN', name: 'Policy', description: 'Cybersecurity policy establishment and management', subcategories: 3 },
  { id: 'GV-OV', category: 'GOVERN', name: 'Oversight', description: 'Cybersecurity oversight and governance', subcategories: 3 },
  { id: 'GV-SC', category: 'GOVERN', name: 'Supply Chain Risk Management', description: 'Supply chain risk management', subcategories: 6 },

  // IDENTIFY (43 subcategories)
  { id: 'ID-AM', category: 'IDENTIFY', name: 'Asset Management', description: 'Asset management policies and procedures', subcategories: 6 },
  { id: 'ID-RA', category: 'IDENTIFY', name: 'Risk Assessment', description: 'Risk assessment and risk management', subcategories: 10 },
  { id: 'ID-IM', category: 'IDENTIFY', name: 'Improvement', description: 'Improvement activities and processes', subcategories: 4 },
  { id: 'ID-BE', category: 'IDENTIFY', name: 'Business Environment', description: 'Business environment understanding', subcategories: 5 },
  { id: 'ID-GV', category: 'IDENTIFY', name: 'Governance', description: 'Governance and risk management integration', subcategories: 4 },
  { id: 'ID-SC', category: 'IDENTIFY', name: 'Supply Chain Risk Assessment', description: 'Supply chain risk assessment', subcategories: 5 },
  { id: 'ID-RA-NEW', category: 'IDENTIFY', name: 'Risk Assessment Processes', description: 'Risk assessment processes and methodologies', subcategories: 9 },

  // PROTECT (23 subcategories)  
  { id: 'PR-AC', category: 'PROTECT', name: 'Identity Management, Authentication and Access Control', description: 'Access control and identity management', subcategories: 7 },
  { id: 'PR-AT', category: 'PROTECT', name: 'Awareness and Training', description: 'Security awareness and training', subcategories: 5 },
  { id: 'PR-DS', category: 'PROTECT', name: 'Data Security', description: 'Data protection and privacy', subcategories: 8 },
  { id: 'PR-IP', category: 'PROTECT', name: 'Information Protection Processes and Procedures', description: 'Information protection processes', subcategories: 3 },

  // DETECT (8 subcategories)
  { id: 'DE-AE', category: 'DETECT', name: 'Anomalies and Events', description: 'Anomaly and event detection', subcategories: 5 },
  { id: 'DE-CM', category: 'DETECT', name: 'Security Continuous Monitoring', description: 'Continuous security monitoring', subcategories: 3 },

  // RESPOND (9 subcategories)
  { id: 'RS-RP', category: 'RESPOND', name: 'Response Planning', description: 'Response planning and procedures', subcategories: 1 },
  { id: 'RS-CO', category: 'RESPOND', name: 'Communications', description: 'Response communications', subcategories: 5 },
  { id: 'RS-AN', category: 'RESPOND', name: 'Analysis', description: 'Response analysis activities', subcategories: 1 },
  { id: 'RS-MI', category: 'RESPOND', name: 'Mitigation', description: 'Response mitigation activities', subcategories: 2 },

  // RECOVER (7 subcategories)
  { id: 'RC-RP', category: 'RECOVER', name: 'Recovery Planning', description: 'Recovery planning and processes', subcategories: 3 },
  { id: 'RC-IM', category: 'RECOVER', name: 'Improvements', description: 'Recovery improvements', subcategories: 2 },
  { id: 'RC-CO', category: 'RECOVER', name: 'Communications', description: 'Recovery communications', subcategories: 2 }
];

interface FunctionalAreaAssessmentProps {
  onComplete: (result: CybersecurityHygieneResult) => void;
}

export default function FunctionalAreaAssessment({ onComplete }: FunctionalAreaAssessmentProps) {
  const [activeCategory, setActiveCategory] = useState<'GOVERN' | 'IDENTIFY' | 'PROTECT' | 'DETECT' | 'RESPOND' | 'RECOVER'>('GOVERN');
  const [tierScores, setTierScores] = useState<{ [key: string]: TierScore }>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const categories = ['GOVERN', 'IDENTIFY', 'PROTECT', 'DETECT', 'RESPOND', 'RECOVER'] as const;

  const handleTierChange = (functionalAreaId: string, field: keyof TierScore, value: number) => {
    setTierScores(prev => ({
      ...prev,
      [functionalAreaId]: {
        ...prev[functionalAreaId],
        functionalAreaId,
        [field]: value,
        currentTier: prev[functionalAreaId]?.currentTier || 0,
        targetTier: prev[functionalAreaId]?.targetTier || 0,
        timeAtTier: prev[functionalAreaId]?.timeAtTier || 0
      }
    }));
  };

  const calculateCybersecurityHygiene = (): CybersecurityHygieneResult => {
    const categoryScores: CybersecurityHygieneResult['categoryScores'] = {
      GOVERN: { score: 0, tier: 0, functionalAreas: [] },
      IDENTIFY: { score: 0, tier: 0, functionalAreas: [] },
      PROTECT: { score: 0, tier: 0, functionalAreas: [] },
      DETECT: { score: 0, tier: 0, functionalAreas: [] },
      RESPOND: { score: 0, tier: 0, functionalAreas: [] },
      RECOVER: { score: 0, tier: 0, functionalAreas: [] }
    };

    let totalScore = 0;
    let totalPossible = 0;

    // Calculate scores for each category
    categories.forEach(category => {
      const functionalAreas = NIST_CSF_FUNCTIONAL_AREAS.filter(fa => fa.category === category);
      let categoryTotal = 0;
      let categoryPossible = 0;

      functionalAreas.forEach(fa => {
        const score = tierScores[fa.id];
        if (score) {
          // Weight by subcategory count for accuracy
          const areaScore = (score.currentTier / 4) * 100 * fa.subcategories;
          categoryTotal += areaScore;
          categoryPossible += 100 * fa.subcategories;
          categoryScores[category].functionalAreas.push(score);
        } else {
          // Default to tier 0 if not assessed
          categoryPossible += 100 * fa.subcategories;
        }
      });

      categoryScores[category].score = categoryPossible > 0 ? (categoryTotal / categoryPossible) * 100 : 0;
      categoryScores[category].tier = Math.round((categoryScores[category].score / 100) * 4);
      
      totalScore += categoryTotal;
      totalPossible += categoryPossible;
    });

    const overallScore = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;
    const overallTier = Math.round((overallScore / 100) * 4);

    // Determine hygiene level
    let hygieneLevel: CybersecurityHygieneResult['hygieneLevel'];
    if (overallScore >= 90) hygieneLevel = 'Excellent';
    else if (overallScore >= 75) hygieneLevel = 'Good';
    else if (overallScore >= 50) hygieneLevel = 'Moderate Risk';
    else if (overallScore >= 25) hygieneLevel = 'High Risk';
    else hygieneLevel = 'Critical Risk';

    // Generate recommendations based on lowest performing categories
    const recommendations: string[] = [];
    const sortedCategories = Object.entries(categoryScores)
      .sort(([,a], [,b]) => a.score - b.score)
      .slice(0, 3);

    sortedCategories.forEach(([category, data]) => {
      if (data.score < 75) {
        switch (category) {
          case 'GOVERN':
            recommendations.push(`Strengthen cybersecurity governance (${data.score.toFixed(0)}%) - Focus on risk management strategy and organizational context`);
            break;
          case 'IDENTIFY':
            recommendations.push(`Improve identification capabilities (${data.score.toFixed(0)}%) - Enhance asset management and risk assessment processes`);
            break;
          case 'PROTECT':
            recommendations.push(`Enhance protection controls (${data.score.toFixed(0)}%) - Strengthen access control and data security measures`);
            break;
          case 'DETECT':
            recommendations.push(`Improve detection capabilities (${data.score.toFixed(0)}%) - Enhance monitoring and anomaly detection`);
            break;
          case 'RESPOND':
            recommendations.push(`Strengthen incident response (${data.score.toFixed(0)}%) - Improve response planning and communications`);
            break;
          case 'RECOVER':
            recommendations.push(`Enhance recovery capabilities (${data.score.toFixed(0)}%) - Strengthen recovery planning and improvement processes`);
            break;
        }
      }
    });

    return {
      overallScore,
      overallTier,
      categoryScores,
      hygieneLevel,
      recommendations
    };
  };

  const handleComplete = () => {
    const result = calculateCybersecurityHygiene();
    setIsCompleted(true);
    onComplete(result);
  };

  const getCompletionPercentage = () => {
    const totalAreas = NIST_CSF_FUNCTIONAL_AREAS.length;
    const completedAreas = Object.keys(tierScores).length;
    return (completedAreas / totalAreas) * 100;
  };

  const getTierLabel = (tier: number): string => {
    switch (tier) {
      case 0: return 'Tier 0: Partial';
      case 1: return 'Tier 1: Risk Informed';
      case 2: return 'Tier 2: Repeatable';
      case 3: return 'Tier 3: Adaptive';
      case 4: return 'Tier 4: Optimized';
      default: return 'Not Set';
    }
  };

  const getCategoryBadgeColor = (category: string): string => {
    switch (category) {
      case 'GOVERN': return 'bg-purple-100 text-purple-800';
      case 'IDENTIFY': return 'bg-blue-100 text-blue-800';
      case 'PROTECT': return 'bg-green-100 text-green-800';
      case 'DETECT': return 'bg-yellow-100 text-yellow-800';
      case 'RESPOND': return 'bg-orange-100 text-orange-800';
      case 'RECOVER': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isCompleted) {
    const result = calculateCybersecurityHygiene();
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-green-700">NIST CSF 2.0 Cybersecurity Hygiene Assessment Complete</CardTitle>
          <CardDescription>Your comprehensive cybersecurity maturity evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-4xl font-bold text-purple-700">{result.overallScore.toFixed(1)}%</div>
              <div className="text-lg text-gray-600">Overall Cybersecurity Hygiene</div>
              <div className="text-sm text-gray-500">Tier {result.overallTier} - {result.hygieneLevel}</div>
            </div>

            {/* Category Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map(category => {
                const categoryData = result.categoryScores[category];
                return (
                  <div key={category} className="p-4 border rounded-lg">
                    <Badge className={`mb-2 ${getCategoryBadgeColor(category)}`}>
                      {category}
                    </Badge>
                    <div className="text-lg font-semibold">{categoryData.score.toFixed(0)}%</div>
                    <div className="text-xs text-gray-500">Tier {categoryData.tier}</div>
                    <Progress value={categoryData.score} className="mt-2 h-2" />
                  </div>
                );
              })}
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Priority Recommendations</h3>
                <ul className="space-y-1 text-sm text-blue-700">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-purple-700">NIST CSF 2.0 Functional Area Tier Assessment</CardTitle>
        <CardDescription>
          Assess your organization's cybersecurity maturity across all {NIST_CSF_FUNCTIONAL_AREAS.length} functional areas
        </CardDescription>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Assessment Progress</span>
            <span>{Object.keys(tierScores).length} of {NIST_CSF_FUNCTIONAL_AREAS.length} areas completed</span>
          </div>
          <Progress value={getCompletionPercentage()} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as any)}>
          <TabsList className="grid grid-cols-6 mb-6">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="text-xs"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <div className="space-y-4">
                <div className="mb-4">
                  <Badge className={getCategoryBadgeColor(category)}>
                    {category} ({NIST_CSF_FUNCTIONAL_AREAS.filter(fa => fa.category === category).length} functional areas)
                  </Badge>
                </div>

                {NIST_CSF_FUNCTIONAL_AREAS
                  .filter(fa => fa.category === category)
                  .map(functionalArea => {
                    const currentScore = tierScores[functionalArea.id];
                    return (
                      <Card key={functionalArea.id} className="border-l-4 border-l-purple-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">
                            {functionalArea.id}: {functionalArea.name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {functionalArea.description} ({functionalArea.subcategories} subcategories)
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Current Tier */}
                          <div>
                            <Label className="text-xs font-medium text-gray-700">Current Implementation Tier</Label>
                            <RadioGroup
                              value={currentScore?.currentTier?.toString() || "0"}
                              onValueChange={(value) => handleTierChange(functionalArea.id, 'currentTier', parseInt(value))}
                              className="flex flex-wrap gap-4 mt-2"
                            >
                              {[0, 1, 2, 3, 4].map(tier => (
                                <div key={tier} className="flex items-center space-x-2">
                                  <RadioGroupItem value={tier.toString()} id={`${functionalArea.id}-current-${tier}`} />
                                  <Label htmlFor={`${functionalArea.id}-current-${tier}`} className="text-xs">
                                    {getTierLabel(tier)}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          {/* Target Tier */}
                          <div>
                            <Label className="text-xs font-medium text-gray-700">Target Tier (12 months)</Label>
                            <RadioGroup
                              value={currentScore?.targetTier?.toString() || "0"}
                              onValueChange={(value) => handleTierChange(functionalArea.id, 'targetTier', parseInt(value))}
                              className="flex flex-wrap gap-4 mt-2"
                            >
                              {[0, 1, 2, 3, 4].map(tier => (
                                <div key={tier} className="flex items-center space-x-2">
                                  <RadioGroupItem value={tier.toString()} id={`${functionalArea.id}-target-${tier}`} />
                                  <Label htmlFor={`${functionalArea.id}-target-${tier}`} className="text-xs">
                                    Tier {tier}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          {/* Time at Current Tier */}
                          <div>
                            <Label className="text-xs font-medium text-gray-700">Months at Current Tier</Label>
                            <RadioGroup
                              value={currentScore?.timeAtTier?.toString() || "0"}
                              onValueChange={(value) => handleTierChange(functionalArea.id, 'timeAtTier', parseInt(value))}
                              className="flex flex-wrap gap-4 mt-2"
                            >
                              {[0, 3, 6, 12, 24, 36].map(months => (
                                <div key={months} className="flex items-center space-x-2">
                                  <RadioGroupItem value={months.toString()} id={`${functionalArea.id}-time-${months}`} />
                                  <Label htmlFor={`${functionalArea.id}-time-${months}`} className="text-xs">
                                    {months === 0 ? 'New' : `${months}mo`}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-6 flex justify-between">
          <div className="text-sm text-gray-600">
            Complete all functional areas to calculate your cybersecurity hygiene level
          </div>
          <Button 
            onClick={handleComplete}
            disabled={Object.keys(tierScores).length < NIST_CSF_FUNCTIONAL_AREAS.length}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Calculate Cybersecurity Hygiene
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}