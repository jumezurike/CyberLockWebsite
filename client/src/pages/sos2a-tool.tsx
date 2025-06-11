import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { differenceInDays, parseISO, formatDistanceToNow } from "date-fns";

// Import components
import ReportDisplay from "@/components/sos2a/report-display";

// Import types
import { 
  Sos2aFormData, 
  AssessmentReport
} from "@/lib/sos2a-types";

export default function Sos2aTool() {
  const [step, setStep] = useState<'questionnaire' | 'report'>('questionnaire');
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [savedAssessments, setSavedAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  // Handle questionnaire submission and generate preliminary report
  const handleQuestionnaireSubmit = (data: Sos2aFormData) => {
    // Generate preliminary report immediately (qualitative assessment only)
    const preliminaryReport: AssessmentReport = {
      id: 'report-' + Date.now(),
      businessId: data.businessName?.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now() || 'business-' + Date.now(),
      reportType: 'preliminary',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      age: 0,
      securityScore: 0, // Preliminary qualitative assessment
      businessLocation: data.businessLocation || { city: "Unknown", state: "Unknown", country: "Unknown", zipCode: "" },
      industry: data.industry || "Unknown",
      businessServices: data.businessServices || "Unknown",
      operationModes: data.operationMode || [],
      internetPresence: data.internetPresence || [],
      findings: [],
      vulnerabilities: [],
      recommendations: {
        immediate: ["Implement foundational security controls", "Establish security policies"],
        shortTerm: ["Deploy monitoring solutions", "Conduct staff training"],
        longTerm: ["Develop comprehensive security program", "Prepare for comprehensive assessment"]
      },
      frameworkGaps: [],
      complianceStatus: {
        percentage: 0,
        compliant: 0,
        total: 1,
        status: "Initial Assessment"
      },
      policyDocumentStatus: "Not Assessed",
      osHardeningStatus: "Not Assessed", 
      ismsStatus: "Not Assessed",
      mitreAttackCoverage: 0,
      rasbitaScore: {
        overall: 0,
        governance: 0,
        technical: 0,
        operational: 0
      },
      matrixData: [],
      scorecard: {
        overallScore: 0,
        categories: [
          { name: "Phishing Screening", score: 0, weight: 8.33 },
          { name: "Security Awareness", score: 0, weight: 8.33 },
          { name: "External Footprints", score: 0, weight: 8.33 },
          { name: "Dark Web", score: 0, weight: 8.33 },
          { name: "Endpoint Security", score: 0, weight: 8.33 },
          { name: "Cloud Security", score: 0, weight: 8.33 },
          { name: "Data Security", score: 0, weight: 8.33 },
          { name: "Browser Security", score: 0, weight: 8.33 },
          { name: "Email Protection", score: 0, weight: 8.33 },
          { name: "Compliances", score: 0, weight: 8.33 },
          { name: "Regulatory Requirements", score: 0, weight: 8.33 },
          { name: "Frameworks", score: 0, weight: 8.33 }
        ]
      }
    };

    setReport(preliminaryReport);
    setStep('report');
    
    toast({
      title: "Preliminary Assessment Complete",
      description: "Your qualitative assessment report has been generated.",
    });
  };

  // Handle back navigation
  const handleBack = () => {
    if (step === 'report') {
      setStep('questionnaire');
    }
  };

  // Start new assessment
  const startNewAssessment = () => {
    setReport(null);
    setStep('questionnaire');
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Healthcare Organizational and System Security Analysis (HOS²A)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 'questionnaire' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-4">Preliminary Assessment Questionnaire</h2>
                <p className="text-muted-foreground">
                  Complete this questionnaire to receive a preliminary qualitative security assessment.
                  This provides the foundation for comprehensive assessment planning.
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-800 mb-2">Assessment Type: Preliminary</h3>
                <p className="text-sm text-blue-700">
                  This preliminary assessment provides qualitative analysis based on expert opinion and industry standards.
                  Comprehensive assessments require 6+ months of evidence collection using monitoring tools.
                </p>
              </div>

              {/* Import the working questionnaire form from the backup */}
              <QuestionnaireFormComponent onSubmit={handleQuestionnaireSubmit} />
            </div>
          )}

          {step === 'report' && report && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <Button variant="outline" onClick={handleBack}>
                  ← Back to Assessment
                </Button>
                <Button onClick={startNewAssessment}>
                  Start New Assessment
                </Button>
              </div>
              
              <ReportDisplay 
                report={report} 
                onBack={handleBack}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Placeholder for the working questionnaire form component
function QuestionnaireFormComponent({ onSubmit }: { onSubmit: (data: Sos2aFormData) => void }) {
  return (
    <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
      <p className="text-muted-foreground mb-4">
        Questionnaire form will be integrated here with all the fixes we implemented
      </p>
      <Button 
        onClick={() => {
          // Simulate form submission with sample data for testing
          const sampleData: Partial<Sos2aFormData> = {
            businessName: "Sample Healthcare Organization",
            industry: "Healthcare",
            businessServices: "Healthcare Services",
            businessLocation: {
              city: "Sample City",
              state: "Sample State", 
              country: "United States",
              zipCode: "12345"
            },
            operationMode: ["on-premises"],
            internetPresence: ["website"]
          };
          onSubmit(sampleData as Sos2aFormData);
        }}
      >
        Generate Sample Preliminary Report
      </Button>
    </div>
  );
}