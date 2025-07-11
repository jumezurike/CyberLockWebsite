import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, ArrowRight, FileText, Users, Database, Shield, TrendingUp, Search, Building, FileCheck, BarChart } from "lucide-react";

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "completed" | "current" | "pending";
  category: string;
}

export default function AssessmentWorkflow() {
  const [currentStep, setCurrentStep] = useState(1);

  const workflowSteps: WorkflowStep[] = [
    {
      id: 1,
      title: "Inquiry & Questionnaire",
      description: "Initial Data Collection",
      icon: <FileText className="h-5 w-5" />,
      status: "completed",
      category: "Preliminary Phase"
    },
    {
      id: 2,
      title: "Interview & Matrix Population",
      description: "Stakeholder Input",
      icon: <Users className="h-5 w-5" />,
      status: "current",
      category: "Preliminary Phase"
    },
    {
      id: 3,
      title: "Matrix Population",
      description: "Infrastructure Data",
      icon: <Database className="h-5 w-5" />,
      status: "pending",
      category: "Preliminary Phase"
    },
    {
      id: 4,
      title: "RASBITA-RGM",
      description: "Risk Governance & Management",
      icon: <Shield className="h-5 w-5" />,
      status: "pending",
      category: "Preliminary Phase"
    },
    {
      id: 5,
      title: "Gap Analysis",
      description: "Identifying Missing Controls from Sections 2-13",
      icon: <Search className="h-5 w-5" />,
      status: "pending",
      category: "Preliminary Phase"
    },
    {
      id: 6,
      title: "Preliminary Report",
      description: "Qualitative Expert Opinion Analysis",
      icon: <FileCheck className="h-5 w-5" />,
      status: "pending",
      category: "Preliminary Phase"
    },
    {
      id: 7,
      title: "Architecture Threat Modeling",
      description: "Deep STRIDE Analysis with System Architecture",
      icon: <Building className="h-5 w-5" />,
      status: "pending",
      category: "Comprehensive Phase"
    },
    {
      id: 8,
      title: "RASBITA-CBF",
      description: "Cost-Benefit Financial Analysis",
      icon: <TrendingUp className="h-5 w-5" />,
      status: "pending",
      category: "Comprehensive Phase"
    },
    {
      id: 9,
      title: "Comprehensive Report",
      description: "Quantitative Analysis with 6+ Months Monitoring Data",
      icon: <BarChart className="h-5 w-5" />,
      status: "pending",
      category: "Comprehensive Phase"
    }
  ];

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "current";
    return "pending";
  };

  const progressPercentage = ((currentStep - 1) / 9) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            SOS²A Assessment Workflow
          </CardTitle>
          <CardDescription>
            9-Step Healthcare Organizational and System Security Analysis Process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{currentStep}/9 Steps Completed</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <div className="grid gap-4">
        {workflowSteps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isLast = index === workflowSteps.length - 1;
          
          return (
            <div key={step.id} className="relative">
              <Card className={`transition-all duration-200 ${
                status === "current" 
                  ? "border-primary shadow-md" 
                  : status === "completed"
                  ? "border-green-500/50 bg-green-50/50"
                  : "border-muted"
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Step Status Icon */}
                    <div className={`flex-shrink-0 rounded-full p-2 ${
                      status === "completed"
                        ? "bg-green-100 text-green-600"
                        : status === "current"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {status === "completed" ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {step.icon}
                        <h3 className="font-semibold text-lg">
                          {step.id}. {step.title}
                        </h3>
                        <Badge variant={
                          status === "completed" ? "default" :
                          status === "current" ? "secondary" : "outline"
                        }>
                          {status === "completed" ? "Complete" :
                           status === "current" ? "In Progress" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{step.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {step.category}
                      </Badge>
                    </div>

                    {/* Action Button */}
                    {status === "current" && (
                      <Button 
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="flex-shrink-0"
                      >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex justify-center py-2">
                  <div className={`w-0.5 h-8 ${
                    status === "completed" ? "bg-green-500" : "bg-muted"
                  }`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Phase Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Phases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Phase 1: Data Collection</h4>
              <p className="text-sm text-muted-foreground">Steps 1-3: Gather stakeholder input and infrastructure data</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-orange-600">Phase 2: Analysis</h4>
              <p className="text-sm text-muted-foreground">Steps 4-7: Risk assessment and architecture review</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Phase 3: Reporting</h4>
              <p className="text-sm text-muted-foreground">Steps 8-9: Generate preliminary and comprehensive reports</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}