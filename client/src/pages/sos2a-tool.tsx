import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { differenceInDays, parseISO, formatDistanceToNow } from "date-fns";

// Import components
import QuestionnaireForm from "@/components/sos2a/questionnaire-form";
import MatrixForm from "@/components/sos2a/matrix-form";
import GapAnalysis from "@/components/sos2a/gap-analysis";
import ReportDisplay from "@/components/sos2a/report-display";

// Import types and utilities
import { 
  Sos2aFormData, 
  MatrixItem, 
  AssessmentReport,
  GapAnalysisResult,
  SecurityRisk 
} from "@/lib/sos2a-types";
import { 
  identifySecurityRisks, 
  categorizeLVulnerabilities, 
  identifyFrameworkGaps,
  evaluateComplianceStatus,
  generateScorecardData
} from "@/lib/sos2a-utils";

export default function Sos2aTool() {
  // State for multi-step form
  const [step, setStep] = useState<'questionnaire' | 'matrix' | 'gap-analysis' | 'report'>('questionnaire');
  const [formData, setFormData] = useState<Sos2aFormData | null>(null);
  const [matrixData, setMatrixData] = useState<MatrixItem[] | null>(null);
  const [gapAnalysisResult, setGapAnalysisResult] = useState<GapAnalysisResult | null>(null);
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [savedAssessments, setSavedAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  
  // Search state
  const [searchCompanyName, setSearchCompanyName] = useState<string>("");
  const [searchFromDate, setSearchFromDate] = useState<string>("");
  const [searchToDate, setSearchToDate] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  
  // State for form persistence
  const [hasSavedData, setHasSavedData] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  const { toast } = useToast();

  // Calculate progress percentage based on current step
  const progressPercentage = step === 'questionnaire' ? 25 : 
                            step === 'matrix' ? 50 : 
                            step === 'gap-analysis' ? 75 : 100;

  // Check if comprehensive report is selected
  const isComprehensive = formData?.reportType === 'comprehensive';

  // Load saved assessments on component mount
  useEffect(() => {
    loadSavedAssessments();
  }, []);

  // Function to load saved assessments
  const loadSavedAssessments = async () => {
    try {
      const response = await apiRequest("GET", "/api/assessments");
      const data = await response.json();
      console.log("Loaded assessments:", data);
      setSavedAssessments(data);
    } catch (error) {
      console.error("Error loading saved assessments:", error);
    }
  };

  // Function to load a specific assessment report
  const loadAssessmentReport = async (assessmentId: string) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("GET", `/api/assessments/${assessmentId}/report`);
      const data = await response.json();
      
      if (data) {
        setReport(data);
        setStep('report');
        
        toast({
          title: "Report Loaded",
          description: "Assessment report has been loaded successfully.",
        });
      }
    } catch (error) {
      console.error("Error loading assessment report:", error);
      toast({
        title: "Load Failed",
        description: "Could not load the assessment report.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to continue an existing assessment
  const continueAssessment = async (assessmentId: string) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("GET", `/api/assessments/${assessmentId}`);
      const data = await response.json();
      
      if (data) {
        setFormData(data);
        setStep('matrix');
        
        toast({
          title: "Assessment Loaded",
          description: "Continuing with existing assessment.",
        });
      }
    } catch (error) {
      console.error("Error loading assessment:", error);
      toast({
        title: "Load Failed",
        description: "Could not load the assessment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter assessments based on search criteria
  const filteredAssessments = (savedAssessments || []).filter(assessment => {
    const matchesName = !searchCompanyName || 
      assessment.businessName?.toLowerCase().includes(searchCompanyName.toLowerCase());
    
    // Handle date filtering more robustly
    let matchesDate = true;
    if (searchFromDate || searchToDate) {
      if (assessment.createdAt) {
        const assessmentDate = new Date(assessment.createdAt);
        const fromDate = searchFromDate ? new Date(searchFromDate) : null;
        const toDate = searchToDate ? new Date(searchToDate) : null;
        
        matchesDate = (!fromDate || assessmentDate >= fromDate) && 
                     (!toDate || assessmentDate <= toDate);
      } else {
        // If no createdAt date and date filters are applied, exclude from results
        matchesDate = false;
      }
    }
    
    return matchesName && matchesDate;
  });

  // Handle questionnaire submission
  const handleQuestionnaireSubmit = (data: Sos2aFormData) => {
    setFormData(data);
    setShowReviewModal(true);
  };

  // Handle final submission after review
  const handleFinalSubmit = () => {
    setShowReviewModal(false);
    setStep('matrix');
    saveFormData(formData);
    
    toast({
      title: "Assessment Submitted",
      description: "Your questionnaire has been submitted. Proceeding to matrix population.",
    });
  };

  // Handle matrix submission
  const handleMatrixSubmit = (data: MatrixItem[]) => {
    setMatrixData(data);
    setStep('gap-analysis');
    saveMatrixData(data);
  };

  // Handle gap analysis completion
  const handleGapAnalysisComplete = (result: GapAnalysisResult) => {
    setGapAnalysisResult(result);
    generateReport(result);
  };

  // Handle back navigation
  const handleBack = () => {
    if (step === 'matrix') {
      setStep('questionnaire');
    } else if (step === 'gap-analysis') {
      setStep('matrix');
    } else if (step === 'report') {
      setStep('gap-analysis');
    }
  };

  // Generate the final report
  const generateReport = async (result: GapAnalysisResult) => {
    if (!formData || !matrixData) {
      console.error("Missing required data for report generation");
      return;
    }
    
    const reportType = formData?.reportType || 'preliminary';
    
    // Generate the report with gap analysis data
    const generatedReport: AssessmentReport = {
      id: 'report-' + Date.now(),
      businessId: matrixData[0]?.infraType + '-' + Date.now() || 'business-' + Date.now(),
      reportType: reportType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      age: 0,
      securityScore: Math.round(result.overallScore.percentage),
      businessLocation: formData?.businessLocation || { state: "Unknown", country: "Unknown", zipCode: "" },
      industry: formData?.industry || "Unknown",
      businessServices: formData?.businessServices || "Unknown",
      operationModes: formData?.operationMode || [],
      internetPresence: formData?.internetPresence || [],
      findings: identifySecurityRisks(matrixData),
      vulnerabilities: categorizeLVulnerabilities(matrixData),
      recommendations: {
        immediate: ["Implement critical security controls"],
        shortTerm: ["Enhance monitoring capabilities"],
        longTerm: ["Develop comprehensive security program"]
      },
      frameworkGaps: identifyFrameworkGaps(matrixData),
      complianceStatus: evaluateComplianceStatus(matrixData),
      matrixData: matrixData,
      scorecard: generateScorecardData(matrixData, reportType)
    };
    
    setReport(generatedReport);
    setStep('report');
    
    toast({
      title: "Report Generated",
      description: "Your assessment report has been generated successfully.",
    });
  };

  // Save form data to localStorage
  const saveFormData = (data: Sos2aFormData | null) => {
    if (data) {
      localStorage.setItem('sos2a_form_data', JSON.stringify(data));
    }
  };

  // Save matrix data to localStorage
  const saveMatrixData = (data: MatrixItem[] | null) => {
    if (data) {
      localStorage.setItem('sos2a_matrix_data', JSON.stringify(data));
    }
  };

  // Clear saved data
  const clearSavedData = () => {
    localStorage.removeItem('sos2a_form_data');
    localStorage.removeItem('sos2a_matrix_data');
    setHasSavedData(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate assessment age
  const calculateAssessmentAge = (createdAt: string): number => {
    return differenceInDays(new Date(), parseISO(createdAt));
  };

  // Format assessment age
  const formatAssessmentAge = (createdAt: string): string => {
    return formatDistanceToNow(parseISO(createdAt), { addSuffix: true });
  };

  return (
    <div className="container mx-auto py-8">
      {/* Assessment Submission Confirmation Modal */}
      {showReviewModal && formData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-[#7936b0]">Assessment Submission Confirmation</h2>
            
            <div className="border rounded-md p-4 mb-4 bg-gray-50">
              <h3 className="font-medium mb-2">Assessment Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Business Name:</span> {formData.businessName}
                </div>
                <div>
                  <span className="font-medium">Industry:</span> {formData.industry}
                </div>
                <div>
                  <span className="font-medium">Report Type:</span> {formData.reportType === 'preliminary' ? 'Preliminary' : 'Comprehensive'}
                </div>
                <div>
                  <span className="font-medium">Contact:</span> {formData.contactInfo.name}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#7936b0] hover:bg-[#6b2aa2] text-white" 
                onClick={handleFinalSubmit}
              >
                Proceed to Matrix Analysis
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Healthcare Organizational and System Security Analysis (HOS²A)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Assessment Search and History - Hide when displaying report */}
          {step !== 'report' && (
            <>
              {/* Assessment Search */}
              <div className="mb-6 border rounded-lg shadow-sm overflow-hidden">
                <div className="bg-blue-50 p-3 border-b flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-600">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                  <h2 className="text-lg font-medium text-blue-700">Search Assessments</h2>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium mb-1 block">Company Name</Label>
                      <Input 
                        type="text" 
                        value={searchCompanyName}
                        onChange={(e) => setSearchCompanyName(e.target.value)}
                        placeholder="Enter company name"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-1 block">From Date</Label>
                      <Input 
                        type="date" 
                        value={searchFromDate}
                        onChange={(e) => setSearchFromDate(e.target.value)}
                        className="w-full"
                        placeholder="mm/dd/yyyy"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-1 block">To Date</Label>
                      <Input 
                        type="date" 
                        value={searchToDate}
                        onChange={(e) => setSearchToDate(e.target.value)}
                        className="w-full"
                        placeholder="mm/dd/yyyy"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSearchCompanyName("");
                        setSearchFromDate("");
                        setSearchToDate("");
                      }}
                      className="text-sm"
                    >
                      Clear
                    </Button>
                    <Button 
                      onClick={() => {
                        // Search functionality is automatic via filteredAssessments
                        // This button can trigger a manual refresh if needed
                        loadSavedAssessments();
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Assessment History Section */}
              <div className="mb-6 border rounded-lg shadow-sm">
                <div className="bg-primary/10 p-3 border-b flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary">
                      <path d="M12 8v4l3 3"></path>
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                    <h2 className="text-lg font-medium">Assessment History</h2>
                  </div>
                  <div className="flex items-center text-sm text-primary font-medium">
                    {filteredAssessments.length} reports
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Select a saved assessment to view</Label>
                      <Select value={selectedAssessmentId} onValueChange={setSelectedAssessmentId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Load a saved assessment" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredAssessments.map((assessment) => (
                            <SelectItem key={assessment.id} value={assessment.id.toString()}>
                              {assessment.businessName} - {assessment.industry} ({assessment.reportType === 'preliminary' ? 'Preliminary' : 'Comprehensive'})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => selectedAssessmentId && loadAssessmentReport(selectedAssessmentId)}
                        disabled={!selectedAssessmentId || isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Load Report
                      </Button>
                      <Button 
                        onClick={() => {
                          if (selectedAssessmentId && confirm('Are you sure you want to delete this assessment?')) {
                            deleteAssessment(selectedAssessmentId);
                          }
                        }}
                        disabled={!selectedAssessmentId || isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </Button>
                      <Button 
                        onClick={() => {
                          setStep('questionnaire');
                          setFormData({} as any);
                          setSelectedAssessmentId("");
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Start New
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Assessment Progress</h2>
            <Progress value={progressPercentage} className="h-2" />
            
            <div className="flex justify-between text-sm">
              <div className={`${step === 'questionnaire' ? 'text-primary font-medium' : ''}`}>
                1. Inquiry & Questionnaire
              </div>
              <div className={`${step === 'matrix' ? 'text-primary font-medium' : ''}`}>
                2. Interview & Matrix Population
              </div>
              <div className={`${step === 'gap-analysis' ? 'text-primary font-medium' : ''}`}>
                3. Gap Analysis
              </div>
              <div className={`${step === 'report' ? 'text-primary font-medium' : ''}`}>
                4. {isComprehensive ? 'Preliminary Report → Comprehensive Report' : 'Preliminary Report'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Step 1: Inquiry & Questionnaire */}
      {step === 'questionnaire' && (
        <div className="questionnaire-container">
          <QuestionnaireForm onSubmit={handleQuestionnaireSubmit} />
        </div>
      )}
      
      {/* Step 2: Matrix Population */}
      {step === 'matrix' && formData && (
        <div className="matrix-container">
          <MatrixForm 
            operationModes={formData.operationMode}
            internetPresence={formData.internetPresence}
            ismsProcesses={formData.ismsProcesses}
            onSubmit={handleMatrixSubmit}
            onBack={handleBack}
          />
        </div>
      )}
      
      {/* Step 3: Gap Analysis */}
      {step === 'gap-analysis' && formData && (
        <div className="gap-analysis-container">
          <GapAnalysis 
            formData={formData} 
            onComplete={handleGapAnalysisComplete} 
          />
          <div className="flex justify-between mt-6">
            <Button onClick={handleBack} variant="outline">
              Back to Matrix
            </Button>
          </div>
        </div>
      )}
      
      {/* Step 4: Report Display */}
      {step === 'report' && report && (
        <div className="report-container">
          <ReportDisplay report={report} onBack={handleBack} />
        </div>
      )}
    </div>
  );
}