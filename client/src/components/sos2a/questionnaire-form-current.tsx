import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sos2aFormData } from "@/lib/sos2a-types";
import { assessmentTools, standardsAndGuidelinesLibrary } from "@/lib/matrix-mappings";
import { RegulatoryContent } from "./regulatory-content";
import { StandardsContent } from "./standards-content";
import { EulaAgreement } from "./eula-agreement";
import UwaRecordsTable from "../identity-behavior/uwa-records-table";
import { Plus, Download, Upload } from "lucide-react";

// Helper function to safely handle potentially undefined arrays
function safeArray<T>(arr: T[] | undefined): T[] {
  return arr || [];
}

const formSchema = z.object({
  // 1. Business Information
  businessName: z.string().min(2, "Business name is required"),
  businessAddress: z.string().min(5, "Business address is required"),
  businessLocation: z.object({
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required"),
    zipCode: z.string().optional(),
  }),
  industry: z.string().min(2, "Industry is required"),
  customIndustry: z.string().optional(),
  showCustomIndustry: z.boolean().optional(),
  employeeCount: z.string().min(1, "Employee count is required"),
  businessServices: z.string().min(5, "Business services description is required"),
  
  // 2. Infrastructure Mode of Operation
  operationMode: z.array(z.string()).min(1, "At least one operation mode is required"),
  customOperationMode: z.string().optional(),
  showCustomOperationMode: z.boolean().optional(),
  internetPresence: z.array(z.string()).min(1, "At least one internet presence is required"),
  
  // 3. Security Risks & Vulnerabilities
  primaryConcerns: z.array(z.string()),
  securityRisks: z.array(z.string()).default([]),
  websiteVulnerabilities: z.array(z.string()).default([]),
  endDeviceVulnerabilities: z.array(z.string()).default([]),
  
  // Legacy field - kept for backward compatibility
  vulnerabilities: z.array(z.string()).default([]),
  
  // 3. Configuration Baseline
  configurationManagement: z.string().optional(),
  systemHardeningApproach: z.string().optional(),
  operatingSystems: z.array(z.string()).optional(),
  customOperatingSystem: z.string().optional(),
  showCustomOperatingSystem: z.boolean().optional(),
  primaryCisBenchmark: z.string().optional(),
  cisVersion: z.string().optional(),
  cisBenchmarks: z.array(z.string()).optional(),
  
  // 4. Security Control Framework
  securityMeasures: z.array(z.string()),
  frameworks: z.object({
    operations: z.array(z.string()),
    management: z.array(z.string()),
    technology: z.array(z.string()),
    people: z.array(z.string()),
  }),
  
  // 5. Compliance
  complianceRequirements: z.object({
    frameworks: z.array(z.string()),
    standards: z.array(z.string()),
    compliance: z.array(z.string()),
    regulations: z.array(z.string()),
    guidelines: z.array(z.string()).optional(),
    healthcare: z.array(z.string()).optional(),
    financial: z.array(z.string()).optional(),
    industrySpecific: z.array(z.string()).optional(),
  }),
  
  // 6. Regulatory Requirements
  regulatoryRequirements: z.array(z.string()).optional(),
  
  // 7. Standards
  healthcareStandards: z.array(z.string()).optional(),
  
  // 8. Assessment Approach
  securityAssessmentApproach: z.string(),
  securityToolsSoftware: z.array(z.string()).optional(),
  securityToolsVersions: z.array(z.string()).optional(),
  
  // 9. Governance & Leadership
  informationSecurityGovernance: z.string(),
  leadershipCommitment: z.string(),
  stakeholderAccountability: z.string(),
  riskManagementApproach: z.string(),
  
  // 10. Policies & Procedures
  securityPolicyDocumentation: z.string(),
  incidentResponseProcedures: z.string(),
  disasterRecoveryPlan: z.string(),
  businessContinuityPlan: z.string(),
  
  // 11. Device Inventory
  deviceInventory: z.array(z.object({
    deviceType: z.string(),
    make: z.string(),
    model: z.string(),
    serialNumber: z.string(),
    osVersion: z.string().optional(),
    lastUpdated: z.string().optional(),
    vulnerabilities: z.array(z.string()).optional(),
    riskLevel: z.string().optional(),
    authorizedUsers: z.array(z.string()).optional(),
    notes: z.string().optional(),
  })).optional(),
  
  filteredDeviceInventory: z.array(z.object({
    deviceType: z.string(),
    make: z.string(),
    model: z.string(),
    serialNumber: z.string(),
    osVersion: z.string().optional(),
    lastUpdated: z.string().optional(),
    vulnerabilities: z.array(z.string()).optional(),
    riskLevel: z.string().optional(),
    authorizedUsers: z.array(z.string()).optional(),
    notes: z.string().optional(),
  })).optional(),
  
  // 12. Identity & Access Management
  authenticationPractices: z.string(),
  accessControlMethods: z.string(),
  
  // 13. Contact Information
  contactName: z.string().min(2, "Contact name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  preferredContact: z.string(),
  bestTimeToContact: z.string(),
  
  // 14. Agreement
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms" }),
  })
});

interface QuestionnaireFormProps {
  onSubmit: (data: Sos2aFormData) => void;
  selectedTab?: string | null;
}

export default function QuestionnaireForm({ onSubmit, selectedTab }: QuestionnaireFormProps) {
  const [activeTab, setActiveTab] = useState(selectedTab || "business-info");

  // Initialize form with default values
  const form = useForm<Sos2aFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessAddress: "",
      businessLocation: {
        city: "",
        state: "",
        country: "",
        zipCode: ""
      },
      industry: "",
      customIndustry: "",
      showCustomIndustry: false,
      employeeCount: "",
      businessServices: "",
      operationMode: [],
      customOperationMode: "",
      showCustomOperationMode: false,
      internetPresence: [],
      primaryConcerns: [],
      securityRisks: [],
      websiteVulnerabilities: [],
      endDeviceVulnerabilities: [],
      vulnerabilities: [],
      configurationManagement: "",
      systemHardeningApproach: "",
      operatingSystems: [],
      customOperatingSystem: "",
      showCustomOperatingSystem: false,
      primaryCisBenchmark: "",
      cisVersion: "",
      cisBenchmarks: [],
      securityMeasures: [],
      frameworks: {
        operations: [],
        management: [],
        technology: [],
        people: []
      },
      complianceRequirements: {
        frameworks: [],
        standards: [],
        compliance: [],
        regulations: [],
        guidelines: [],
        healthcare: [],
        financial: [],
        industrySpecific: []
      },
      regulatoryRequirements: [],
      healthcareStandards: [],
      securityAssessmentApproach: "",
      securityToolsSoftware: [],
      securityToolsVersions: [],
      informationSecurityGovernance: "",
      leadershipCommitment: "",
      stakeholderAccountability: "",
      riskManagementApproach: "",
      securityPolicyDocumentation: "",
      incidentResponseProcedures: "",
      disasterRecoveryPlan: "",
      businessContinuityPlan: "",
      deviceInventory: [],
      filteredDeviceInventory: [],
      authenticationPractices: "",
      accessControlMethods: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      preferredContact: "",
      bestTimeToContact: "",
      acceptTerms: false
    }
  });

  // Handle form submission
  const handleSubmit = form.handleSubmit((data: Sos2aFormData) => {
    onSubmit(data);
  });

  // Industry selection handling
  const handleIndustryChange = (value: string) => {
    form.setValue("industry", value);
    form.setValue("showCustomIndustry", value === "other");
  };

  // Operation mode handling
  const handleOperationModeChange = (checked: boolean, value: string) => {
    const currentValues = form.getValues("operationMode");
    
    if (checked) {
      if (!currentValues.includes(value)) {
        form.setValue("operationMode", [...currentValues, value]);
      }
      
      if (value === "other") {
        form.setValue("showCustomOperationMode", true);
      }
    } else {
      form.setValue("operationMode", currentValues.filter(v => v !== value));
      
      if (value === "other") {
        form.setValue("showCustomOperationMode", false);
        form.setValue("customOperationMode", "");
      }
    }
  };

  // Operating system handling
  const handleOperatingSystemChange = (checked: boolean, value: string) => {
    const currentValues = safeArray(form.getValues("operatingSystems"));
    
    if (checked) {
      if (!currentValues.includes(value)) {
        form.setValue("operatingSystems", [...currentValues, value]);
      }
      
      if (value === "other") {
        form.setValue("showCustomOperatingSystem", true);
      }
    } else {
      form.setValue("operatingSystems", currentValues.filter(v => v !== value));
      
      if (value === "other") {
        form.setValue("showCustomOperatingSystem", false);
        form.setValue("customOperatingSystem", "");
      }
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>SOS²A Assessment Questionnaire</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="business-info">Business</TabsTrigger>
                <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="device-inventory">Devices</TabsTrigger>
                <TabsTrigger value="identity-behavior">Identity</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="governance">Governance</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              {/* 1. Business Information Tab */}
              <TabsContent value="business-info" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">1. Business Information</h3>
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem className="mb-4">
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
                      <FormItem className="mb-4">
                        <FormLabel>Business/Office/Home Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your business address (No P.O. Box)" 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Please enter the full address where your business is physically located.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="businessLocation.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="businessLocation.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="State/Province" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="businessLocation.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="businessLocation.zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal/ZIP Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Postal/ZIP Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Industry</FormLabel>
                        <Select 
                          onValueChange={(value) => handleIndustryChange(value)}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="financial">Financial Services</SelectItem>
                            <SelectItem value="government">Government</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="telecommunications">Telecommunications</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("showCustomIndustry") && (
                    <FormField
                      control={form.control}
                      name="customIndustry"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Specify Industry</FormLabel>
                          <FormControl>
                            <Input placeholder="Specify your industry" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="employeeCount"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Number of Employees</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employee count range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-10">1-10</SelectItem>
                            <SelectItem value="11-50">11-50</SelectItem>
                            <SelectItem value="51-200">51-200</SelectItem>
                            <SelectItem value="201-500">201-500</SelectItem>
                            <SelectItem value="501-1000">501-1,000</SelectItem>
                            <SelectItem value="1001-5000">1,001-5,000</SelectItem>
                            <SelectItem value="5001+">5,001+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="businessServices"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Services Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your main business services and operations"
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Briefly describe your organization's main activities and services
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-6 flex justify-end">
                    <Button 
                      type="button"
                      onClick={() => document.querySelector('[value="infrastructure"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* 12. Device Inventory Tracking Tab */}
              <TabsContent value="device-inventory" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">12. Device Inventory Tracking</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Track and manage your organization's devices to improve security visibility and control.
                  </p>
                  
                  {/* Device Inventory Table Section */}
                  <div className="border rounded-md p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Device Inventory</h4>
                      <Button 
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Add Device
                      </Button>
                    </div>
                    
                    <div className="mb-4 border-2 border-blue-200 p-4 rounded-md bg-blue-50">
                      <div className="flex items-center mb-2">
                        <h5 className="text-sm font-medium text-blue-800">Filter Devices</h5>
                        <div className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">Filter Tool</div>
                      </div>
                      <p className="text-xs text-blue-700 mb-3">Select a device type to filter the inventory list below</p>
                      <div className="bg-white p-2 rounded border border-blue-200">
                        <Select defaultValue="all">
                          <SelectTrigger className="w-[200px] bg-white border-blue-300 focus:ring-blue-500">
                            <SelectValue placeholder="Filter by device type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Workstation">Workstations</SelectItem>
                            <SelectItem value="Laptop">Laptops</SelectItem>
                            <SelectItem value="Mobile Phone">Mobile Devices</SelectItem>
                            <SelectItem value="Server">Servers</SelectItem>
                            <SelectItem value="Network Device">Network Equipment</SelectItem>
                            <SelectItem value="IoT Device">IoT Devices</SelectItem>
                            <SelectItem value="Medical Device">Medical Devices</SelectItem>
                            <SelectItem value="Transportation Device">Transportation Devices</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="rounded-md border overflow-hidden">
                      <div className="grid grid-cols-9 bg-gray-100 p-2 font-medium text-sm">
                        <div>Device Type</div>
                        <div>Make/Model</div>
                        <div>Serial/Asset #</div>
                        <div>Risk Level</div>
                        <div>Owner</div>
                        <div>Operating System</div>
                        <div>MAC Address</div>
                        <div>IP Address</div>
                        <div>Environment</div>
                      </div>
                      
                      <div className="grid grid-cols-9 p-2 border-t text-sm hover:bg-gray-50">
                        <div>No devices added</div>
                        <div>—</div>
                        <div>—</div>
                        <div>—</div>
                        <div>—</div>
                        <div>—</div>
                        <div>—</div>
                        <div>—</div>
                        <div>—</div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 mb-6 bg-green-50 mt-4">
                      <h5 className="text-sm font-medium mb-2">Import Device Inventory</h5>
                      <p className="text-sm text-muted-foreground mb-3">
                        Upload a CSV file with your device inventory. Download the template to see the required format.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-3.5 h-3.5 mr-1" />
                          Download Template
                        </Button>
                        <Button variant="outline" size="sm">
                          <Upload className="w-3.5 h-3.5 mr-1" />
                          Upload CSV
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Device Tracking Forms */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">1. Identification</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.deviceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Device ID / Asset Tag</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter device ID or asset tag" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.makeModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Make / Model</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter device make and model" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.serialNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Serial Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter device serial number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.owner"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Owner / Assigned User</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter device owner or assigned user" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("regulatory-compliance")}>
                    Previous Step
                  </Button>
                  <Button onClick={() => setActiveTab("identity-behavior")}>
                    Next Step
                  </Button>
                </div>
              </TabsContent>
              
              {/* 13. Identity Behavior & Hygiene Tab */}
              <TabsContent value="identity-behavior" className="space-y-6">
                <div className="space-y-6">
                  <div className="border rounded-md p-4 mb-6 bg-blue-50">
                    <h4 className="font-medium text-blue-700 mb-2">Universal Identity Verification System (UIVS)</h4>
                    <p className="text-sm mb-4">
                      For organizations with multiple users, we recommend using our Identity Management system to import and manage all your users in one place with our patented Universal Identity Verification System (UIVS).
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        type="button" 
                        variant="default" 
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Manage User Identities
                      </Button>
                      <Button 
                        type="button" 
                        variant="default" 
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Download CSV Template
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        Upload CSV
                      </Button>
                    </div>
                  </div>

                  {/* 1. Identification Section */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">1. Identification</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.userId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User ID</FormLabel>
                            <FormDescription>Employee ID, service account name</FormDescription>
                            <FormControl>
                              <Input placeholder="Enter user ID" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.fullNameRole"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name / Role</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter full name and role" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.contactInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Info</FormLabel>
                            <FormDescription>Email, phone for emergency access</FormDescription>
                            <FormControl>
                              <Input placeholder="Enter contact information" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter department" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <Button 
                      type="button"
                      onClick={() => document.querySelector('[value="device-inventory"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
                    >
                      Previous Step
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => document.querySelector('[value="governance"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* 14. Contact and Confirmation Tab */}
              <TabsContent value="contact" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">14. Contact and Confirmation</h3>
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="preferredContact"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Preferred Contact Method</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select contact method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="text">Text Message</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bestTimeToContact"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Best Time to Contact</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="morning">Morning (8am-12pm)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (12pm-5pm)</SelectItem>
                            <SelectItem value="evening">Evening (5pm-8pm)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <div className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="grid gap-1.5 leading-none">
                            <FormLabel className="text-sm">
                              I agree to the terms and conditions
                            </FormLabel>
                            <FormDescription className="text-xs">
                              By submitting this form, you agree to our <a href="#" className="text-primary underline">Terms of Service</a> and <a href="#" className="text-primary underline">Privacy Policy</a>
                            </FormDescription>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-6 flex justify-between">
                    <Button 
                      type="button"
                      onClick={() => document.querySelector('[value="assessment"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
                    >
                      Previous Step
                    </Button>
                    <Button type="submit">Submit Assessment</Button>
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