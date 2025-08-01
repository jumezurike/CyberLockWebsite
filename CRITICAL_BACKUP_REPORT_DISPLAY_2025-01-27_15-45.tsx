// BACKUP: client/src/components/sos2a/report-display.tsx
// Created: 2025-01-27 15:45 before removing redundant tabs
// Purpose: Complete backup before PRP 3.0 approved changes

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
import { EnhancedProfessionalAnalysis } from "./enhanced-professional-analysis";
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
        
        <CardContent className="space-y-6">
          {/* Redundant tabs section - TO BE REMOVED */}
          <Tabs defaultValue="visual-scorecard" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="visual-scorecard">Visual Scorecard</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
              <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="implementation">Implementation Guidance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="visual-scorecard">
              {/* Empty content */}
            </TabsContent>
            <TabsContent value="compliance">
              {/* Empty content */}
            </TabsContent>
            <TabsContent value="risk-analysis">
              {/* Empty content */}
            </TabsContent>
            <TabsContent value="scorecard">
              {/* Empty content */}
            </TabsContent>
            <TabsContent value="recommendations">
              {/* Empty content */}
            </TabsContent>
            <TabsContent value="implementation">
              {/* Empty content */}
            </TabsContent>
          </Tabs>

          {/* Enhanced Professional Analysis - DO NOT TOUCH */}
          <EnhancedProfessionalAnalysis report={report} />

          {/* CyberLockX Logo and Action Buttons */}
          <div className="border-t pt-6">
            <div className="flex flex-col items-center space-y-4">
              <img src={logoImage} alt="CyberLockX Logo" className="h-12 opacity-80" />
              <div className="text-center">
                <p className="text-sm font-medium text-primary">Securing every CLICK!!!</p>
                <p className="text-xs text-muted-foreground">Healthcare Apps & Devices Security Hub</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="flex-1"
              >
                Back to Matrix Population
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setEvidenceDialog(true)}
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                Evidence Requirements
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLifecycleDialog(true)}
                className="flex-1"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Assessment Lifecycle
              </Button>
              <Button variant="default">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              {!isComprehensive && (
                <Button variant="default" className="bg-green-600 hover:bg-green-700">
                  Schedule Comprehensive Assessment
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Dialog */}
      <Dialog open={evidenceDialog} onOpenChange={setEvidenceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Evidence Requirements for Comprehensive Assessment</DialogTitle>
            <DialogDescription>
              Comprehensive assessments require 6+ months of documented evidence and implementation of security controls.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Lifecycle Dialog */}
      <Dialog open={lifecycleDialog} onOpenChange={setLifecycleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assessment Lifecycle Information</DialogTitle>
            <DialogDescription>
              This assessment is {formatAssessmentAge()}. Security assessments should be updated every 6-12 months 
              to maintain accuracy and compliance.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}