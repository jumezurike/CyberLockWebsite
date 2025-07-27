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
    // Use the age property if available, otherwise calculate it
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center border-b pb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {report.reportType === 'preliminary' ? 'Preliminary Assessment Report' : 'Comprehensive Assessment Report'}
        </h1>
        <div className="flex items-center justify-center space-x-4 text-muted-foreground">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Generated on {formatDate(report.createdAt)}
          </span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Assessment ID: {report.id}
          </span>
        </div>
        
        {/* Assessment Lifecycle Info */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <span className={`${getAgeStatusInfo().color} flex items-center`}>
              {getAgeStatusInfo().icon}
              <span className="ml-1 font-medium">{getAgeStatusInfo().label}</span>
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{formatAssessmentAge()}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            This is a {report.reportType} assessment
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              This {report.reportType} report highlights the current cybersecurity state of your organization, with an emphasis on assessing its organizational and system security 
              posture. While this is an initial overview, it provides valuable insights into industry standard compliance requirements, regulations, and best 
              practices. The purpose of this report is to illustrate the need for comprehensive monitoring, threat detection, and an effective incident response system.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              As part of this assessment, we've conducted an architectural review using our STRIDE threat modeling methodology, which evaluates your systems for 
              Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege threats. This analysis has identified architectural 
              vulnerabilities and recommended mitigation controls that are incorporated into our overall risk assessment.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Business Information & RASBITA Score */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Business Information</h3>
              <p className="font-medium">{report.businessId}</p>
              <p>{report.industry} | {
                report.businessLocation && typeof report.businessLocation === 'object' 
                  ? `${report.businessLocation.state || 'Unknown'}, ${report.businessLocation.country || 'Unknown'}` 
                  : 'Unknown location'
              }</p>
              <p className="text-sm text-muted-foreground">{report.businessServices}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">RASBITA Score Components</h3>
                <div className="bg-purple-100 text-purple-900 font-bold px-3 py-1 rounded-full flex items-center">
                  <span>Overall: {report.rasbitaScore?.overall || "N/A"}%</span>
                  <span className="ml-1 text-xs px-2 py-0.5 bg-purple-800 text-white rounded-full">RASBITA™</span>
                </div>
              </div>
              {report.rasbitaScore && (
                <>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-primary/5 rounded-md p-2 border-l-4 border-red-500">
                      <p className="text-xs font-bold text-red-700">R</p>
                      <p className="text-[10px] text-muted-foreground">Risk</p>
                      <p className="text-xs font-bold">{report.rasbitaScore.categories?.risk || "N/A"}%</p>
                    </div>
                    <div className="bg-primary/5 rounded-md p-2 border-l-4 border-orange-500">
                      <p className="text-xs font-bold text-orange-700">A</p>
                      <p className="text-[10px] text-muted-foreground">Adversarial</p>
                      <p className="text-xs font-bold">{report.rasbitaScore.categories?.adversarial || "N/A"}%</p>
                    </div>
                    <div className="bg-primary/5 rounded-md p-2 border-l-4 border-amber-500">
                      <p className="text-xs font-bold text-amber-700">S</p>
                      <p className="text-[10px] text-muted-foreground">Security</p>
                      <p className="text-xs font-bold">{report.rasbitaScore.categories?.security || "N/A"}%</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center mt-2">
                    <div className="bg-primary/5 rounded-md p-2 border-l-4 border-blue-500">
                      <p className="text-xs font-bold text-blue-700">B</p>
                      <p className="text-[10px] text-muted-foreground">Business</p>
                      <p className="text-xs font-bold">{report.rasbitaScore.categories?.business || "N/A"}%</p>
                    </div>
                    <div className="bg-primary/5 rounded-md p-2 border-l-4 border-indigo-500">
                      <p className="text-xs font-bold text-indigo-700">I</p>
                      <p className="text-[10px] text-muted-foreground">Information</p>
                      <p className="text-xs font-bold">{report.rasbitaScore.categories?.information || "N/A"}%</p>
                    </div>
                    <div className="bg-primary/5 rounded-md p-2 border-l-4 border-purple-500">
                      <p className="text-xs font-bold text-purple-700">T</p>
                      <p className="text-[10px] text-muted-foreground">Threat</p>
                      <p className="text-xs font-bold">{report.rasbitaScore.categories?.threat || "N/A"}%</p>
                    </div>
                    <div className="bg-primary/5 rounded-md p-2 border-l-4 border-pink-500">
                      <p className="text-xs font-bold text-pink-700">A</p>
                      <p className="text-[10px] text-muted-foreground">Architecture</p>
                      <p className="text-xs font-bold">{report.rasbitaScore.categories?.architecture || "N/A"}%</p>
                      <p className="text-[10px] text-muted-foreground">Positive value = spend makes sense</p>
                    </div>
                  </div>
                  
                  {/* NIST CSF 2.0 Framework Compliance */}
                  <div className="mt-3 border-t pt-2">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xs font-medium text-muted-foreground">NIST CSF 2.0 Framework Maturity</h3>
                      <div className="bg-blue-100 text-blue-900 text-xs px-2 py-0.5 rounded-full">
                        Overall Rating: {report.rasbitaScore?.overall || "N/A"}%
                      </div>
                    </div>
                    <div className="grid grid-cols-6 gap-1 text-center">
                      {['govern', 'identify', 'protect', 'detect', 'respond', 'recover'].map((domain) => (
                        <div key={domain} className="bg-blue-50 rounded p-1">
                          <p className="text-[10px] capitalize">{domain}</p>
                          <p className="text-xs font-bold text-blue-700">
                            {report.rasbitaScore?.categories?.[domain as keyof typeof report.rasbitaScore.categories] || "N/A"}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Report Tabs */}
      <div className="border-t pt-8 mt-8">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="summary">Overview</TabsTrigger>
          </TabsList>

          {/* Summary Findings Tab */}
          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Summary Findings</CardTitle>
                <CardDescription>
                  Key insights and findings from your security assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Assessment Overview</h3>
                    <p className="text-sm text-muted-foreground">
                      Your organization has been evaluated against industry-standard cybersecurity frameworks
                      including NIST CSF 2.0, resulting in an overall security score of {report.securityScore}%.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Key Strengths</h3>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>Established security governance framework</li>
                      <li>Basic identity and access management controls</li>
                      <li>Regular security awareness training</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Priority Areas for Improvement</h3>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>Enhanced threat detection and monitoring capabilities</li>
                      <li>Incident response procedures and testing</li>
                      <li>Data encryption and protection measures</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* CyberLockX Logo */}
      <div className="flex justify-center items-center border-t pt-8 mt-8">
        <div className="text-center">
          <img src={logoImage} alt="CyberLockX Logo" className="h-12 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Securing every CLICK!!!</p>
          <p className="text-xs text-muted-foreground">Healthcare Apps & Devices Security Hub</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center border-t pt-8 mt-8">
        <Button onClick={() => setEvidenceDialog(true)} variant="outline" className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          View Evidence
        </Button>
        <Button onClick={() => setLifecycleDialog(true)} variant="outline" className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Assessment Lifecycle
        </Button>
        <Button onClick={onBack} variant="outline">
          Return to Matrix
        </Button>
      </div>

      {/* Evidence Dialog */}
      <Dialog open={evidenceDialog} onOpenChange={setEvidenceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assessment Evidence</DialogTitle>
            <DialogDescription>
              Review the evidence and data sources used in this assessment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm">
              <h3 className="font-medium mb-2">Evidence Sources</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Questionnaire responses and documentation review</li>
                <li>• Network and system configuration analysis</li>
                <li>• Security control implementation validation</li>
                <li>• Compliance framework assessment</li>
              </ul>
            </div>
            <div className="text-sm">
              <h3 className="font-medium mb-2">Assessment Methodology</h3>
              <p className="text-muted-foreground">
                This assessment follows the HOS²A (Healthcare Organizational and System Security Analysis) 
                framework, incorporating NIST CSF 2.0 guidelines and industry best practices for healthcare 
                cybersecurity.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setEvidenceDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assessment Lifecycle Dialog */}
      <Dialog open={lifecycleDialog} onOpenChange={setLifecycleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assessment Lifecycle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <strong>Report Type:</strong> {report.reportType === 'preliminary' ? 'Preliminary Assessment' : 'Comprehensive Assessment'}
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Assessment Age: {formatAssessmentAge()}</div>
              <div className="flex items-center text-sm">
                <span className={`${getAgeStatusInfo().color} mr-2`}>
                  {getAgeStatusInfo().icon}
                </span>
                <span>{getAgeStatusInfo().label}</span>
              </div>
            </div>
            {report.reportType === 'preliminary' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Preliminary Assessment</AlertTitle>
                <AlertDescription>
                  This is a preliminary report. For a comprehensive analysis with quantitative metrics
                  and detailed remediation guidance, consider upgrading to a full assessment.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setLifecycleDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}