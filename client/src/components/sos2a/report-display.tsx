import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssessmentReport } from "@/lib/sos2a-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileText, Download, Calendar, Clock, AlertTriangle, Shield, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow, differenceInDays, parseISO } from "date-fns";
import Scorecard from "./scorecard";
import logoImage from "@/assets/cyberlockx-logo-resized.png";

interface ReportDisplayProps {
  report: AssessmentReport;
  onBack: () => void;
}

export default function ReportDisplay({ report, onBack }: ReportDisplayProps) {
  const [evidenceDialog, setEvidenceDialog] = useState(false);
  const [lifecycleDialog, setLifecycleDialog] = useState(false);
  
  // Format date
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
  
  // Calculate and format assessment age
  const getAssessmentAge = (): number => {
    if (report.age !== undefined) {
      return report.age;
    }
    return differenceInDays(new Date(), parseISO(report.createdAt));
  };
  
  // Format age for display
  const formatAssessmentAge = (): string => {
    return formatDistanceToNow(parseISO(report.createdAt), { addSuffix: true });
  };
  
  // Get appropriate icon and color based on assessment age
  const getAgeStatusInfo = (): { icon: React.ReactNode, color: string, label: string } => {
    const age = getAssessmentAge();
    
    if (age <= 30) {
      return { 
        icon: <CheckCircle2 className="h-5 w-5" />, 
        color: "text-green-600",
        label: "Current"
      };
    }
    
    if (age <= 90) {
      return { 
        icon: <Shield className="h-5 w-5" />, 
        color: "text-blue-600",
        label: "Recent"
      };
    }
    
    if (age <= 180) {
      return { 
        icon: <AlertCircle className="h-5 w-5" />, 
        color: "text-amber-600",
        label: "Aging"
      };
    }
    
    return { 
      icon: <AlertTriangle className="h-5 w-5" />, 
      color: "text-red-600",
      label: "Outdated"
    };
  };
  
  const ageInfo = getAgeStatusInfo();
  const isComprehensive = report.reportType === 'comprehensive';
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold">
                Healthcare Organizational and System Security Analysis (HOS²A) {isComprehensive ? 'Comprehensive' : 'Preliminary'} Report
              </CardTitle>
              <div className="mt-2 mb-1">
                <h2 className="text-lg font-semibold text-primary">{report.businessName}</h2>
                <p className="text-sm text-muted-foreground">{report.industry} | {report.location || 'Unknown location'}</p>
              </div>
              <CardDescription>
                Generated on {formatDate(report.createdAt)}
              </CardDescription>
              
              {/* Assessment Age Information */}
              <div className={`mt-1 flex items-center gap-1 ${ageInfo.color}`}>
                {ageInfo.icon}
                <span className="text-xs font-medium">
                  {ageInfo.label}: {formatAssessmentAge()}
                </span>
              </div>
              
              {report.reportType === 'preliminary' && (
                <div className="mt-2 text-sm text-blue-600">
                  This is a preliminary assessment. For a comprehensive assessment with deeper analysis and evidence-based scoring, proceed to the comprehensive assessment path.
                </div>
              )}
              
              {report.reportType === 'comprehensive' && (
                <div className="mt-2 text-sm text-green-600">
                  This comprehensive assessment includes evidence collected over a 6+ month period and provides a more accurate view of your security posture.
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center bg-primary/10 p-3 rounded-md">
              <span className="text-2xl font-bold text-primary">{report.securityScore}%</span>
              <span className="text-xs text-muted-foreground">Security Score</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Assessment Details Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  <tr className="border-b bg-gray-50">
                    <td className="p-3 font-medium">Business Name</td>
                    <td className="p-3">{report.businessName}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Industry</td>
                    <td className="p-3">{report.industry}</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-3 font-medium">Assessment Type</td>
                    <td className="p-3">{report.reportType === 'comprehensive' ? 'Comprehensive' : 'Preliminary'}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Overall Security Score</td>
                    <td className="p-3">
                      <span className="text-xl font-bold text-primary">{report.securityScore}%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Scorecard Section */}
            {report.scorecard && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Security Assessment Scorecard</h3>
                <Scorecard scorecard={report.scorecard} reportType={report.reportType} report={report} />
              </div>
            )}

            {/* Key Findings */}
            {report.findings && report.findings.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Security Findings</h3>
                <div className="space-y-2">
                  {report.findings.map((finding, index) => (
                    <Alert key={index}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Finding {index + 1}</AlertTitle>
                      <AlertDescription>{typeof finding === 'string' ? finding : finding.description || 'Security finding identified'}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {report.recommendations && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                <div className="space-y-4">
                  {report.recommendations.immediate && report.recommendations.immediate.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-600">Immediate Actions Required</h4>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        {report.recommendations.immediate.map((rec, index) => (
                          <li key={index} className="text-sm">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {report.recommendations.shortTerm && report.recommendations.shortTerm.length > 0 && (
                    <div>
                      <h4 className="font-medium text-yellow-600">Short-term Improvements</h4>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        {report.recommendations.shortTerm.map((rec, index) => (
                          <li key={index} className="text-sm">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {report.recommendations.longTerm && report.recommendations.longTerm.length > 0 && (
                    <div>
                      <h4 className="font-medium text-green-600">Long-term Strategy</h4>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        {report.recommendations.longTerm.map((rec, index) => (
                          <li key={index} className="text-sm">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CyberLockX Branding */}
          <div className="mt-8 pt-6 border-t text-center">
            <img 
              src={logoImage} 
              alt="CyberLockX Logo" 
              className="h-12 mx-auto mb-2"
            />
            <p className="text-sm text-muted-foreground">
              Securing every CLICK!!!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Healthcare Apps & Devices Security Hub
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between">
            <Button 
              onClick={onBack}
              variant="outline"
            >
              Back to Matrix Population
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => window.print()}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Report
              </Button>
              
              {report.reportType === 'preliminary' && (
                <Button 
                  onClick={() => setEvidenceDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Comprehensive Assessment
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Dialog */}
      <Dialog open={evidenceDialog} onOpenChange={setEvidenceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Comprehensive Assessment Evidence Requirements</DialogTitle>
            <DialogDescription>
              To proceed with a comprehensive assessment, you'll need to provide evidence and documentation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>Evidence Collection Period</AlertTitle>
              <AlertDescription>
                Comprehensive assessments require 6+ months of evidence collection including security controls implementation, incident response logs, and compliance documentation.
              </AlertDescription>
            </Alert>
            <div>
              <h4 className="font-medium mb-2">Required Documentation:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Security policies and procedures</li>
                <li>Network diagrams and architecture documentation</li>
                <li>Vulnerability assessment reports</li>
                <li>Incident response logs</li>
                <li>Employee training records</li>
                <li>Compliance audit reports</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEvidenceDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setEvidenceDialog(false);
              // Here you would typically redirect to scheduling or evidence upload
            }}>
              Proceed with Evidence Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}