import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GovernanceAndManagementAssessment, { GovernanceScores } from "@/components/rasbita/governance-and-management-assessment";
import { RasbitaReport } from '@/lib/sos2a-types';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PdfExport } from '@/components/rasbita/pdf-export';
import { FileText, AlertCircle, AlertTriangle, AlertOctagon, CheckCircle, Info } from 'lucide-react';

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

function getTierDescription(score: number | null, type: "governance" | "management"): string {
  if (score === null) return "";
  
  if (type === "governance") {
    switch (score) {
      case 0:
        return "Not currently part of the cybersecurity risk governance practices in the organization.";
      case 1:
        return "Application of the organizational cybersecurity risk strategy is managed in an ad hoc manner. Prioritization is ad hoc and not formally based on objectives or threat environment.";
      case 2:
        return "Risk management practices are approved by management but may not be established as organization-wide policy. Prioritization is informed by organizational risk objectives, threat environment, or business requirements.";
      case 3:
        return "The organization's risk management practices are formally approved and expressed as policy. Cybersecurity practices are regularly updated based on the application of risk management processes.";
      case 4:
        return "There is an organization-wide approach to managing cybersecurity risks that uses risk-informed policies, processes, and procedures to address potential cybersecurity events.";
      default:
        return "";
    }
  } else {
    switch (score) {
      case 0:
        return "Not currently part of the cybersecurity risk management practices in the organization.";
      case 1:
        return "Limited awareness of cybersecurity risks at the organizational level. The organization implements cybersecurity risk management on an irregular, case-by-case basis.";
      case 2:
        return "Awareness of cybersecurity risks exists, but an organization-wide approach to managing cybersecurity risks has not been established. Cybersecurity information is shared within the organization on an informal basis.";
      case 3:
        return "Organization-wide approach to managing cybersecurity risks. Cybersecurity information is routinely shared throughout the organization. Consistent methods are in place to respond effectively to changes in risk.";
      case 4:
        return "The organization adapts its cybersecurity practices based on previous activities and predictive indicators. Real-time information is used to understand and act upon cybersecurity risks associated with the products and services.";
      default:
        return "";
    }
  }
}

export default function RasbitaGovernance() {
  const { toast } = useToast();
  const [showAssessment, setShowAssessment] = useState(false);
  const [report, setReport] = useState<RasbitaReport>({
    id: "standalone-gov-assessment",
    title: "Standalone Governance & Management Assessment",
    company: { name: "Your Organization" },
    governanceMaturity: {
      governanceScore: 0,
      managementScore: 0,
      completed: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  
  // When assessment is completed
  const handleGovernanceComplete = (scores: GovernanceScores) => {
    const updatedReport = {
      ...report,
      governanceMaturity: {
        ...scores,
        completed: true
      },
      updatedAt: new Date().toISOString()
    };
    
    setReport(updatedReport);
    setShowAssessment(false);
    
    // Show success toast
    toast({
      title: "Governance Assessment Complete",
      description: "Your Governance & Management maturity assessment has been completed successfully.",
      duration: 5000,
    });
    
    // Optional - save to server
    apiRequest("POST", "/api/rasbita-reports", updatedReport)
      .then(response => {
        if (response.ok) {
          console.log("Assessment saved to server");
        }
      })
      .catch(error => {
        console.error("Error saving assessment:", error);
      });
  };
  
  // Get color indicator for tier level
  const getTierColor = (score: number) => {
    switch(score) {
      case 0: return "red";
      case 1: return "orange";
      case 2: return "yellow";
      case 3: return "blue";
      case 4: return "green";
      default: return "gray";
    }
  };
  
  // Get icon for tier level
  const getTierIcon = (score: number) => {
    switch(score) {
      case 0: return <AlertOctagon className="h-6 w-6 text-red-500" />;
      case 1: return <AlertTriangle className="h-6 w-6 text-orange-500" />;
      case 2: return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      case 3: return <Info className="h-6 w-6 text-blue-500" />;
      case 4: return <CheckCircle className="h-6 w-6 text-green-500" />;
      default: return <Info className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-purple-700 mb-2">RASBITA™ GOV & MGNT SELF-SCORING</h1>
        <p className="text-gray-600">Standalone Cybersecurity Risk Governance & Management Maturity Assessment</p>
      </div>
      
      {showAssessment ? (
        <GovernanceAndManagementAssessment onComplete={handleGovernanceComplete} />
      ) : (
        <div className="space-y-6">
          {/* Introduction Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
            <CardHeader>
              <CardTitle className="text-xl text-chart-4">Crisis Response Tool</CardTitle>
              <CardDescription>
                Emergency assessment of governance and management controls during security incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Why This Assessment Matters During A Crisis
                </h3>
                <p className="text-blue-700 text-sm">
                  Understanding your organization's cybersecurity governance and management maturity is critical during 
                  security incidents. This assessment helps identify gaps in your organization's ability to respond effectively 
                  to threats and provides actionable recommendations for improving your security posture.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="border border-gray-200 rounded-md p-4 bg-white">
                  <h3 className="font-semibold text-purple-700 mb-2">Key Benefits</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 bg-green-500 rounded-full min-w-[8px] min-h-[8px]"></div>
                      <span>Rapidly assess your organization's current security maturity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 bg-green-500 rounded-full min-w-[8px] min-h-[8px]"></div>
                      <span>Identify critical governance and management gaps</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 bg-green-500 rounded-full min-w-[8px] min-h-[8px]"></div>
                      <span>Receive targeted recommendations for improvement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 bg-green-500 rounded-full min-w-[8px] min-h-[8px]"></div>
                      <span>Generate stakeholder-ready PDF reports</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-md p-4 bg-white">
                  <h3 className="font-semibold text-purple-700 mb-2">When To Use This Tool</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 bg-red-500 rounded-full min-w-[8px] min-h-[8px]"></div>
                      <span>During active security incidents to assess response capabilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 bg-red-500 rounded-full min-w-[8px] min-h-[8px]"></div>
                      <span>For rapid decision-making during a cybersecurity crisis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 bg-red-500 rounded-full min-w-[8px] min-h-[8px]"></div>
                      <span>To provide executives with maturity insights during emergencies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 bg-red-500 rounded-full min-w-[8px] min-h-[8px]"></div>
                      <span>As part of a preliminary incident assessment</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold text-gray-700 mb-2">Assessment Framework</h3>
                <p className="text-gray-600 text-sm mb-4">
                  This assessment is based on the NIST Cybersecurity Framework 2.0 and evaluates your organization's 
                  maturity across governance and management tiers from 0 (None) to 4 (Adaptive).
                </p>
                
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="grid grid-cols-5">
                    <div className="bg-red-100 px-1 py-1 rounded-tl">Tier 0 <span className="block font-medium">0%</span></div>
                    <div className="bg-orange-100 px-1 py-1">Tier 1 <span className="block font-medium">25%</span></div>
                    <div className="bg-yellow-100 px-1 py-1">Tier 2 <span className="block font-medium">50%</span></div>
                    <div className="bg-blue-100 px-1 py-1">Tier 3 <span className="block font-medium">75%</span></div>
                    <div className="bg-green-100 px-1 py-1 rounded-tr">Tier 4 <span className="block font-medium">100%</span></div>
                  </div>
                  <div className="grid grid-cols-5 text-[10px] text-center">
                    <div className="bg-red-50 px-1 py-1 rounded-bl border-t border-white">None</div>
                    <div className="bg-orange-50 px-1 py-1 border-t border-white">Partial</div>
                    <div className="bg-yellow-50 px-1 py-1 border-t border-white">Risk Informed</div>
                    <div className="bg-blue-50 px-1 py-1 border-t border-white">Repeatable</div>
                    <div className="bg-green-50 px-1 py-1 rounded-br border-t border-white">Adaptive</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => setShowAssessment(true)}
                className="w-full bg-chart-4 hover:bg-chart-4/90"
              >
                Start RASBITA™ GOV & MGNT Assessment
              </Button>
            </CardFooter>
          </Card>
          
          {/* Results Card - Only shown if assessment is completed */}
          {report.governanceMaturity?.completed && (
            <Card className="border-chart-4">
              <CardHeader>
                <CardTitle className="text-chart-4">Assessment Results</CardTitle>
                <CardDescription>
                  Your organization's current cybersecurity governance and management maturity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-500 text-white p-1 rounded-full mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-blue-800 font-medium text-sm">Key Relationship</h4>
                      <p className="text-blue-600 text-xs mt-1">Higher governance and management maturity (higher tier) typically results in a lower RASBITA™ risk score, indicating reduced security risk exposure due to better cybersecurity practices.</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg text-purple-700">Governance Maturity</h3>
                      {getTierIcon(report.governanceMaturity.governanceScore)}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`bg-${getTierColor(report.governanceMaturity.governanceScore)}-500 w-2 h-2 rounded-full`}></div>
                      <span className="text-sm text-gray-600">Current Tier:</span>
                    </div>
                    <p className="text-2xl font-bold">Tier {report.governanceMaturity.governanceScore}</p>
                    <p className="text-gray-500 text-sm">{getTierLabel(report.governanceMaturity.governanceScore)} - {report.governanceMaturity.governanceScore * 25}% Complete</p>
                    <p className="mt-2 text-sm text-gray-600">
                      {getTierDescription(report.governanceMaturity.governanceScore, "governance")}
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg text-purple-700">Management Maturity</h3>
                      {getTierIcon(report.governanceMaturity.managementScore)}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`bg-${getTierColor(report.governanceMaturity.managementScore)}-500 w-2 h-2 rounded-full`}></div>
                      <span className="text-sm text-gray-600">Current Tier:</span>
                    </div>
                    <p className="text-2xl font-bold">Tier {report.governanceMaturity.managementScore}</p>
                    <p className="text-gray-500 text-sm">{getTierLabel(report.governanceMaturity.managementScore)} - {report.governanceMaturity.managementScore * 25}% Complete</p>
                    <p className="mt-2 text-sm text-gray-600">
                      {getTierDescription(report.governanceMaturity.managementScore, "management")}
                    </p>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-md mb-4">
                  <h3 className="font-semibold text-purple-700 mb-2">Improvement Recommendations</h3>
                  <div className="space-y-2 text-sm text-purple-800">
                    {report.governanceMaturity.governanceScore < 4 && (
                      <div className="flex items-start gap-2">
                        <div className="min-w-[16px] mt-0.5">→</div>
                        <p>
                          <strong>Governance:</strong> Focus on improving your governance practices from Tier {report.governanceMaturity.governanceScore} to Tier {Math.min(report.governanceMaturity.governanceScore + 1, 4)} by {
                            report.governanceMaturity.governanceScore === 0 ? "establishing basic cybersecurity processes and policies" :
                            report.governanceMaturity.governanceScore === 1 ? "formalizing risk management practices and getting management approval" :
                            report.governanceMaturity.governanceScore === 2 ? "consistently applying policies across the organization" :
                            "implementing continuous improvement mechanisms for cybersecurity governance"
                          }.
                        </p>
                      </div>
                    )}
                    
                    {report.governanceMaturity.managementScore < 4 && (
                      <div className="flex items-start gap-2">
                        <div className="min-w-[16px] mt-0.5">→</div>
                        <p>
                          <strong>Management:</strong> Work toward improving your management practices from Tier {report.governanceMaturity.managementScore} to Tier {Math.min(report.governanceMaturity.managementScore + 1, 4)} by {
                            report.governanceMaturity.managementScore === 0 ? "implementing basic cybersecurity risk awareness among leadership" :
                            report.governanceMaturity.managementScore === 1 ? "establishing structured approaches to cybersecurity management" :
                            report.governanceMaturity.managementScore === 2 ? "implementing consistent processes with regular reviews" :
                            "developing proactive and adaptive management practices"
                          }.
                        </p>
                      </div>
                    )}
                    
                    {report.governanceMaturity.governanceScore === 4 && report.governanceMaturity.managementScore === 4 && (
                      <div className="flex items-start gap-2">
                        <div className="min-w-[16px] mt-0.5">→</div>
                        <p>
                          <strong>Maintenance:</strong> Your organization has achieved the highest maturity level. Focus on maintaining these excellent practices while continuously adapting to emerging threats and technologies.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <Button 
                    onClick={() => setShowAssessment(true)}
                    variant="outline"
                    className="w-full md:w-auto"
                  >
                    Update Assessment
                  </Button>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <PdfExport report={report} />
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => {
                        toast({
                          title: "GOV & MGNT Assessment Report",
                          description: "The PDF report includes a detailed breakdown of your organization's cybersecurity governance and management maturity with recommendations.",
                          duration: 5000,
                        });
                      }}
                    >
                      <FileText className="h-4 w-4" />
                      Report Info
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}