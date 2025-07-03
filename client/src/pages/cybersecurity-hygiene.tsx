import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FunctionalAreaAssessment from "@/components/nist-csf-functional-area-assessment";
import { ArrowLeft, Target, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { Link } from 'wouter';

interface CybersecurityHygieneResult {
  overallScore: number;
  overallTier: number;
  categoryScores: {
    [key in 'GOVERN' | 'IDENTIFY' | 'PROTECT' | 'DETECT' | 'RESPOND' | 'RECOVER']: {
      score: number;
      tier: number;
      functionalAreas: any[];
    }
  };
  hygieneLevel: 'Critical Risk' | 'High Risk' | 'Moderate Risk' | 'Good' | 'Excellent';
  recommendations: string[];
}

export default function CybersecurityHygiene() {
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<CybersecurityHygieneResult | null>(null);

  const handleAssessmentComplete = (result: CybersecurityHygieneResult) => {
    setAssessmentResult(result);
    setShowAssessment(false);
  };

  const getHygieneLevelColor = (level: string): string => {
    switch (level) {
      case 'Excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'Good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Moderate Risk': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High Risk': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Critical Risk': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHygieneLevelIcon = (level: string) => {
    switch (level) {
      case 'Excellent': return <Shield className="h-5 w-5 text-green-600" />;
      case 'Good': return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'Moderate Risk': return <Target className="h-5 w-5 text-yellow-600" />;
      case 'High Risk': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'Critical Risk': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Target className="h-5 w-5 text-gray-600" />;
    }
  };

  if (showAssessment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowAssessment(false)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>
        </div>
        <FunctionalAreaAssessment onComplete={handleAssessmentComplete} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-purple-700 mb-2">
          NIST CSF 2.0 Cybersecurity Hygiene Assessment
        </h1>
        <p className="text-gray-600">
          Comprehensive tier-based evaluation across all NIST Cybersecurity Framework functional areas
        </p>
      </div>

      {assessmentResult ? (
        <div className="space-y-6">
          {/* Results Overview */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {getHygieneLevelIcon(assessmentResult.hygieneLevel)}
                Cybersecurity Hygiene Results
              </CardTitle>
              <CardDescription>
                Your organization's comprehensive cybersecurity maturity assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Overall Score */}
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                  <div className="text-4xl font-bold text-purple-700 mb-2">
                    {assessmentResult.overallScore.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                  <Badge className={`mt-2 ${getHygieneLevelColor(assessmentResult.hygieneLevel)}`}>
                    {assessmentResult.hygieneLevel}
                  </Badge>
                </div>

                {/* Overall Tier */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
                  <div className="text-4xl font-bold text-blue-700 mb-2">
                    Tier {assessmentResult.overallTier}
                  </div>
                  <div className="text-sm text-gray-600">Maturity Level</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {assessmentResult.overallTier === 4 ? 'Optimized' :
                     assessmentResult.overallTier === 3 ? 'Adaptive' :
                     assessmentResult.overallTier === 2 ? 'Repeatable' :
                     assessmentResult.overallTier === 1 ? 'Risk Informed' : 'Partial'}
                  </div>
                </div>

                {/* Categories Assessed */}
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-purple-50 rounded-lg">
                  <div className="text-4xl font-bold text-green-700 mb-2">6</div>
                  <div className="text-sm text-gray-600">NIST Categories</div>
                  <div className="text-xs text-gray-500 mt-2">Complete Assessment</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance Breakdown</CardTitle>
              <CardDescription>
                Detailed scores across all NIST CSF 2.0 categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(assessmentResult.categoryScores).map(([category, data]) => {
                  const getCategoryColor = (cat: string) => {
                    switch (cat) {
                      case 'GOVERN': return 'border-purple-200 bg-purple-50';
                      case 'IDENTIFY': return 'border-blue-200 bg-blue-50';
                      case 'PROTECT': return 'border-green-200 bg-green-50';
                      case 'DETECT': return 'border-yellow-200 bg-yellow-50';
                      case 'RESPOND': return 'border-orange-200 bg-orange-50';
                      case 'RECOVER': return 'border-red-200 bg-red-50';
                      default: return 'border-gray-200 bg-gray-50';
                    }
                  };

                  return (
                    <div 
                      key={category} 
                      className={`p-4 border-2 rounded-lg ${getCategoryColor(category)}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-sm">{category}</h3>
                        <Badge variant="outline" className="text-xs">
                          Tier {data.tier}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold mb-1">
                        {data.score.toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-600">
                        {data.functionalAreas.length} functional areas assessed
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {assessmentResult.recommendations.length > 0 && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-blue-700">Priority Improvement Recommendations</CardTitle>
                <CardDescription>
                  Strategic recommendations to enhance your cybersecurity hygiene
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assessmentResult.recommendations.map((recommendation, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-700">
                        {index + 1}
                      </div>
                      <p className="text-sm text-blue-800">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => setShowAssessment(true)}
              variant="outline"
            >
              Retake Assessment
            </Button>
            <Button
              onClick={() => {
                setAssessmentResult(null);
                setShowAssessment(false);
              }}
              variant="outline"
            >
              Start New Assessment
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Introduction */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-xl text-purple-700">
                Comprehensive Cybersecurity Hygiene Evaluation
              </CardTitle>
              <CardDescription>
                Assess your organization's cybersecurity maturity across all NIST CSF 2.0 functional areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold text-gray-800 mb-2">What This Assessment Provides</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span><strong>Tier-based scoring (0-4)</strong> for each of the 22 NIST CSF functional areas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span><strong>Cybersecurity Hygiene Level</strong> calculation based on comprehensive maturity assessment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span><strong>Category performance breakdown</strong> across GOVERN, IDENTIFY, PROTECT, DETECT, RESPOND, RECOVER</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span><strong>Priority recommendations</strong> for improving your cybersecurity posture</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold text-gray-800 mb-2">Assessment Structure</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>GOVERN</span>
                        <Badge variant="outline" className="text-xs">6 areas</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>IDENTIFY</span>
                        <Badge variant="outline" className="text-xs">7 areas</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>PROTECT</span>
                        <Badge variant="outline" className="text-xs">4 areas</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>DETECT</span>
                        <Badge variant="outline" className="text-xs">2 areas</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>RESPOND</span>
                        <Badge variant="outline" className="text-xs">4 areas</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>RECOVER</span>
                        <Badge variant="outline" className="text-xs">3 areas</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold text-gray-800 mb-2">Maturity Tiers</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tier 0: Partial</span>
                        <span className="text-gray-500">0-20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tier 1: Risk Informed</span>
                        <span className="text-gray-500">21-40%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tier 2: Repeatable</span>
                        <span className="text-gray-500">41-60%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tier 3: Adaptive</span>
                        <span className="text-gray-500">61-80%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tier 4: Optimized</span>
                        <span className="text-gray-500">81-100%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Key Innovation: Hygiene-Based Scoring</h3>
                  <p className="text-sm text-blue-700">
                    This assessment calculates your <strong>Cybersecurity Hygiene Level</strong> by evaluating 
                    the collective maturity of all functional areas. Each area's tier score (0-4) contributes 
                    to your overall hygiene score, weighted by the number of subcategories in each area, 
                    providing a true representation of your organizational cybersecurity maturity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Start Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Ready to Begin?</CardTitle>
              <CardDescription>
                The assessment takes approximately 15-20 minutes to complete and covers all 22 NIST CSF functional areas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowAssessment(true)}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                Start Cybersecurity Hygiene Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}