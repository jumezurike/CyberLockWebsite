import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, ArrowRight, ArrowLeft, Building, Wrench, Brain, Shield, Users } from "lucide-react";
import OrganizationInfoStep from "@/components/services/organization-info-step";
import ServiceSelectionStep from "@/components/services/service-selection-step";
import ProjectDetailsStep from "@/components/services/project-details-step";
import SchedulingStep from "@/components/services/scheduling-step";
import PricingStep from "@/components/services/pricing-step";
import ApprovalStep from "@/components/services/approval-step";

const STEPS = [
  { id: 1, title: "Organization Info", description: "Company details and contact information", icon: Building },
  { id: 2, title: "Service Selection", description: "Choose your required services", icon: Wrench },
  { id: 3, title: "Project Details", description: "Describe your project requirements", icon: Brain },
  { id: 4, title: "Scheduling", description: "Select preferred timeline", icon: Clock },
  { id: 5, title: "Pricing", description: "Review cost estimate", icon: Users },
  { id: 6, title: "Approval", description: "Submit and approve quote", icon: CheckCircle },
];

export default function ServicesPortal() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Organization Info
    companyName: "",
    contactPersonName: "",
    contactPersonTitle: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    },
    primaryEmail: "",
    secondaryEmail: "",
    officePhone: "",
    mobilePhone: "",
    preferredContactMethod: "email" as "email" | "phone" | "mobile",
    
    // Service Selection
    serviceCategory: "" as "IT Services" | "AI Solutions" | "Cybersecurity" | "Combined Services" | "",
    selectedServices: [] as Array<{
      serviceName: string;
      quantity: number;
      basePrice: number;
      priceType: "fixed" | "hourly" | "per_unit";
      unit?: string;
    }>,
    
    // Project Details
    organizationDescription: "",
    projectDescription: "",
    uploadedFiles: [] as string[],
    relevantLinks: [] as string[],
    urgencyLevel: "Medium" as "Critical" | "High" | "Medium" | "Low",
    
    // Scheduling
    desiredStartDate: "",
    desiredEndDate: "",
    flexibleDates: false,
    selectedTimeSlots: [] as Array<{
      date: string;
      startTime: string;
      endTime: string;
    }>,
    
    // Pricing
    calculatedTotal: 0,
    pricingBreakdown: {} as Record<string, number>,
    hourlyRateEstimate: 0,
  });

  const progress = (currentStep / STEPS.length) * 100;

  const updateFormData = (stepData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <OrganizationInfoStep data={formData} onUpdate={updateFormData} onNext={nextStep} />;
      case 2:
        return <ServiceSelectionStep data={formData} onUpdate={updateFormData} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <ProjectDetailsStep data={formData} onUpdate={updateFormData} onNext={nextStep} onPrev={prevStep} />;
      case 4:
        return <SchedulingStep data={formData} onUpdate={updateFormData} onNext={nextStep} onPrev={prevStep} />;
      case 5:
        return <PricingStep data={formData} onUpdate={updateFormData} onNext={nextStep} onPrev={prevStep} />;
      case 6:
        return <ApprovalStep data={formData} onUpdate={updateFormData} onPrev={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">CyberLockX Services</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional IT services, AI solutions, and cybersecurity expertise tailored to your organization's needs
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Step {currentStep} of {STEPS.length}
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {STEPS.map((step) => {
                  const Icon = step.icon;
                  const isCompleted = currentStep > step.id;
                  const isCurrent = currentStep === step.id;
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                        isCompleted
                          ? "bg-green-50 text-green-700"
                          : isCurrent
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <div className="min-w-0">
                        <div className="font-medium text-xs truncate">{step.title}</div>
                        {isCurrent && (
                          <Badge variant="secondary" className="text-xs">
                            Current
                          </Badge>
                        )}
                        {isCompleted && (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                {React.createElement(STEPS[currentStep - 1].icon, { className: "h-6 w-6 text-blue-600" })}
                <div>
                  <CardTitle className="text-xl text-gray-900">
                    {STEPS[currentStep - 1].title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {STEPS[currentStep - 1].description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {renderStepContent()}
            </CardContent>
          </Card>
        </div>

        {/* Service Categories Overview (shown on first step) */}
        {currentStep === 1 && (
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Service Categories</h2>
              <p className="text-lg text-gray-600">Comprehensive solutions for modern organizations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <Wrench className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">IT Services</CardTitle>
                  <CardDescription>
                    Infrastructure, networking, and technical support solutions
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                    <Brain className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">AI Solutions</CardTitle>
                  <CardDescription>
                    Machine learning, automation, and intelligent systems
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors">
                    <Shield className="h-8 w-8 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">Cybersecurity</CardTitle>
                  <CardDescription>
                    Security assessments, threat monitoring, and compliance
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Combined Services</CardTitle>
                  <CardDescription>
                    Integrated solutions combining multiple service areas
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}