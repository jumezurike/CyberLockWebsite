import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Sos2aFormData } from "@/lib/sos2a-types";
import { assessmentTools, standardsAndGuidelinesLibrary } from "@/lib/matrix-mappings";
import { StandardsContent } from "./standards-content";
import { EulaAgreement } from "./eula-agreement";
import { UwaRecordsTable } from "../identity-behavior/uwa-records-table";
import { UwaComponentMatrix } from "../identity-behavior/uwa-component-matrix";
import { useToast } from "@/hooks/use-toast";
import { FivePillarScorecard, DeviceRiskAssessment, OrganizationalVulnerabilities } from "@/lib/five-pillar-scorecard";
import { Database, Upload, Download } from "lucide-react";

// Helper function to safely handle potentially undefined arrays
function safeArray<T>(arr: T[] | undefined): T[] {
  return arr || [];
}

// Safe checkbox value function that ensures boolean output
function safeCheckboxValue(value: any): boolean {
  return value === true;
}

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessAddress: z.string().min(1, "Business address is required"),
  businessLocation: z.string().min(1, "Business location is required"),
  industry: z.string().min(1, "Industry is required"),
  customIndustry: z.string().optional(),
  showCustomIndustry: z.boolean().default(false),
  employeeCount: z.string().min(1, "Employee count is required"),
  businessServices: z.array(z.string()).min(1, "At least one business service is required"),
  operationMode: z.array(z.string()).min(1, "At least one operation mode is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactEmail: z.string().email("Valid email is required"),
});

interface QuestionnaireFormProps {
  onSubmit: (data: Sos2aFormData) => void;
}

export default function QuestionnaireForm({ onSubmit }: QuestionnaireFormProps) {
  const { toast } = useToast();
  const [eulaAccepted, setEulaAccepted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<Sos2aFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessAddress: "",
      businessLocation: "",
      industry: "",
      customIndustry: "",
      showCustomIndustry: false,
      employeeCount: "",
      businessServices: [],
      operationMode: [],
      contactName: "",
      contactEmail: "",
    },
  });

  const assessOrganizationalVulnerabilities = (): OrganizationalVulnerabilities => {
    const formData = form.getValues();
    
    const vulnerabilities: OrganizationalVulnerabilities = {
      hasPasswordPolicy: false,
      hasIncidentResponse: false,
      hasDataBackup: false,
      hasEmployeeTraining: false,
      hasAccessControls: false,
      riskScore: 0
    };

    let riskFactors = 0;
    const totalEmployees = parseInt(formData.employeeCount) || 0;
    
    if (totalEmployees > 100) riskFactors += 2;
    else if (totalEmployees > 50) riskFactors += 1;
    
    if (safeArray(formData.businessServices).includes("cloud-services")) riskFactors += 1;
    if (safeArray(formData.operationMode).includes("remote")) riskFactors += 1;
    
    vulnerabilities.riskScore = Math.min(riskFactors * 25, 100);
    
    return vulnerabilities;
  };

  const handleSubmit = form.handleSubmit((data: Sos2aFormData) => {
    if (!eulaAccepted) {
      toast({
        title: "EULA Required",
        description: "Please accept the End User License Agreement to proceed.",
        variant: "destructive",
      });
      return;
    }

    const organizationalVulnerabilities = assessOrganizationalVulnerabilities();
    const deviceRiskAssessment: DeviceRiskAssessment = {
      totalDevices: 0,
      vulnerableDevices: 0,
      riskLevel: "low",
      recommendations: []
    };

    const fivePillarScorecard: FivePillarScorecard = {
      governance: { score: 75, recommendations: ["Implement formal security governance"] },
      risk: { score: 65, recommendations: ["Conduct regular risk assessments"] },
      compliance: { score: 80, recommendations: ["Maintain compliance documentation"] },
      technical: { score: 70, recommendations: ["Update technical controls"] },
      operational: { score: 75, recommendations: ["Enhance operational procedures"] },
      overall: { score: 73, grade: "B" }
    };

    const enhancedData = {
      ...data,
      organizationalVulnerabilities,
      deviceRiskAssessment,
      fivePillarScorecard,
      submittedAt: new Date().toISOString(),
    };

    onSubmit(enhancedData);
    
    toast({
      title: "Assessment Submitted",
      description: "Your HOS²A assessment has been successfully submitted for analysis.",
    });
  });

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-blue-900">
          HOS²A - Healthcare Organizational and System Security Analysis
        </CardTitle>
        <p className="text-center text-gray-600 mt-2">
          Complete cybersecurity assessment with optional Universal Identification Verification System (UIVS)
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="business">Business Info</TabsTrigger>
                <TabsTrigger value="inventory">Device Inventory</TabsTrigger>
                <TabsTrigger value="identity">Identity & UWA</TabsTrigger>
                <TabsTrigger value="network">Network Security</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="standards">Standards</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              {/* 1. Business Information Tab */}
              <TabsContent value="business" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="businessAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your business address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="businessLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, State/Province, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="employeeCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Employees</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter employee count" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* 2. Device Inventory Tab */}
              <TabsContent value="inventory" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Device Inventory Tracking</h3>
                  <p className="text-sm text-gray-600">
                    Track and manage your organization's devices to improve security visibility.
                  </p>
                </div>
              </TabsContent>

              {/* 3. Identity & UWA Tab */}
              <TabsContent value="identity" className="space-y-6">
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-semibold text-lg text-blue-900">Identity Behavior & Hygiene Management</h3>
                      <Badge variant="secondary" className="text-xs">OPTIONAL</Badge>
                    </div>
                    <p className="text-sm text-blue-700 mb-4">
                      <strong>Optional Advanced Feature:</strong> Comprehensive identity management with Universal Wallet Address (UWA) generation. This section is not required to complete the assessment.
                    </p>
                    
                    {/* Import/Download Buttons Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {/* Import CSV Button */}
                      <div className="space-y-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold flex items-center justify-center"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '.csv';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const csvContent = event.target?.result as string;
                                  const lines = csvContent.split('\n');
                                  const headers = lines[0].split(',').map(h => h.trim());
                                  
                                  const expectedHeaders = [
                                    'User ID', 'Full Name/Role', 'Contact Info', 'Identity Type', 'Identification Method',
                                    'MFA Types', 'Biometric Types', 'Login Patterns', 'Remote Access Frequency', 'Session Duration',
                                    'Location Controls', 'Training Date', 'Phishing Awareness', 'Security Incidents', 'Privileged Account',
                                    'JIT Access', 'Escalation Controls', 'Admin Review', 'Separation Duties', 'Onboarding Status',
                                    'Offboarding Process', 'Access Review', 'Role Change Process', 'Certification Status'
                                  ];
                                  
                                  const isValidFormat = expectedHeaders.every(header => headers.includes(header));
                                  
                                  if (isValidFormat) {
                                    toast({
                                      title: "Identity CSV Import Successful",
                                      description: `${file.name} has been processed. Found ${lines.length - 1} identity records.`,
                                    });
                                  } else {
                                    toast({
                                      title: "Invalid CSV Format",
                                      description: "Please use the provided template for identity data import.",
                                      variant: "destructive",
                                    });
                                  }
                                };
                                reader.readAsText(file);
                              }
                            };
                            input.click();
                          }}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Import Identity CSV
                        </Button>
                        <p className="text-xs text-gray-600 text-center">
                          <strong>CSV Import:</strong> Upload organizational identity data in standardized format. Bulk import user records for comprehensive identity management.
                        </p>
                      </div>

                      {/* Download Template Button */}
                      <div className="space-y-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          className="w-full border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold flex items-center justify-center"
                          onClick={() => {
                            const headers = [
                              'User ID', 'Full Name/Role', 'Contact Info', 'Identity Type', 'Identification Method',
                              'MFA Types', 'Biometric Types', 'Login Patterns', 'Remote Access Frequency', 'Session Duration',
                              'Location Controls', 'Training Date', 'Phishing Awareness', 'Security Incidents', 'Privileged Account',
                              'JIT Access', 'Escalation Controls', 'Admin Review', 'Separation Duties', 'Onboarding Status',
                              'Offboarding Process', 'Access Review', 'Role Change Process', 'Certification Status'
                            ];
                            
                            const csvContent = headers.join(',') + '\n';
                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement('a');
                            
                            if (link.download !== undefined) {
                              const url = URL.createObjectURL(blob);
                              link.setAttribute('href', url);
                              link.setAttribute('download', 'identity_template.csv');
                              link.style.visibility = 'hidden';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                            
                            toast({
                              title: "Template Downloaded",
                              description: "CSV template for identity data import has been downloaded.",
                            });
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Template
                        </Button>
                        <p className="text-xs text-gray-600 text-center">
                          <strong>CSV Template:</strong> Download standardized format for identity data. Ensures proper structure for successful import and UWA generation.
                        </p>
                      </div>

                      {/* Manage DNA Button */}
                      <div className="space-y-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          className="w-full border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold flex items-center justify-center"
                          onClick={() => {
                            // Navigation to DDNA management interface
                            toast({
                              title: "DDNA Management",
                              description: "Opening Digital Data Nucleic Authority interface for DNA repository management.",
                            });
                          }}
                        >
                          <Database className="mr-2 h-4 w-4" />
                          Manage DNA
                        </Button>
                        <p className="text-xs text-gray-600 text-center">
                          <strong>DDNA Management:</strong> Access Digital Data Nucleic Authority for DNA (Data Nuclear Aggregate) repository management and UWA shadow communication channels.
                        </p>
                      </div>
                    </div>
                  </div>
                
                  {/* UWA Records Table */}
                  <UwaRecordsTable />
                  
                  {/* UWA Component Matrix */}
                  <UwaComponentMatrix />
                </div>
              </TabsContent>

              {/* 4. Network Security Tab */}
              <TabsContent value="network" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Network Security Controls</h3>
                  <p className="text-sm text-gray-600">
                    Assess your network security infrastructure and controls.
                  </p>
                </div>
              </TabsContent>

              {/* 5. Compliance Tab */}
              <TabsContent value="compliance" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Regulatory Compliance</h3>
                  <p className="text-sm text-gray-600">
                    Review compliance requirements and regulatory frameworks.
                  </p>
                </div>
              </TabsContent>

              {/* 6. Standards Tab */}
              <TabsContent value="standards" className="space-y-6">
                <StandardsContent />
              </TabsContent>

              {/* 7. Contact and Confirmation Tab */}
              <TabsContent value="contact" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg mb-4">Organization Contact Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Primary contact name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@organization.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg mb-4">Assessment Confirmation</h3>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800 mb-2">
                        Ready to submit your HOS²A assessment. This will generate your comprehensive security analysis report.
                      </p>
                    </div>
                    
                    <EulaAgreement 
                      onAcceptanceChange={setEulaAccepted}
                      accepted={eulaAccepted}
                    />
                    
                    <div className="flex justify-center mt-8">
                      <Button type="submit" size="lg" className="px-8">
                        Submit Assessment
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}