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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sos2aFormData } from "@/lib/sos2a-types";
import { assessmentTools, standardsAndGuidelinesLibrary } from "@/lib/matrix-mappings";
import { RegulatoryContent } from "./regulatory-content";
import { StandardsContent } from "./standards-content";
import { EulaAgreement } from "./eula-agreement";
import { AlertCircle, UserPlus, FileDown, Eye, Copy, Trash, CheckCircle, Clock, ArrowRight, Plus, Filter, Upload, Download, Monitor, Cpu, CloudCog, Users, RotateCcw, Wallet } from "lucide-react";
import { Section13Content } from "./section13-elegant";
import { useToast } from "@/hooks/use-toast";
import { calculateDeviceRiskScore, getRiskLevelFromScore, fetchWazuhRiskScore } from "@/lib/rasbita-risk-scoring";

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
  employeeCount: z.string().min(1, "Employee count is required"),
  businessDescription: z.string().min(10, "Business description is required"),
  
  // 2. Executive/Senior Leadership Contact Information
  contactInfo: z.object({
    name: z.string().min(2, "Contact name is required"),
    title: z.string().min(2, "Title is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    alternateContact: z.object({
      name: z.string().optional(),
      title: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
    }).optional(),
  }),

  // 3. Current Security Measures
  currentSecurityMeasures: z.object({
    firewalls: z.boolean().default(false),
    antiVirus: z.boolean().default(false),
    intrusionDetection: z.boolean().default(false),
    dataEncryption: z.boolean().default(false),
    accessControl: z.boolean().default(false),
    securityTraining: z.boolean().default(false),
    incidentResponse: z.boolean().default(false),
    regularBackups: z.boolean().default(false),
    networkSegmentation: z.boolean().default(false),
    vulnerabilityScanning: z.boolean().default(false),
    other: z.string().optional(),
  }),

  // 4. Primary Security Concerns
  primaryConcerns: z.array(z.string()).min(1, "At least one concern is required"),
  specificThreats: z.string().optional(),
  
  // 5. IT Infrastructure
  infrastructure: z.object({
    primarySystems: z.array(z.string()).min(1, "At least one system type is required"),
    cloudServices: z.array(z.string()).optional(),
    networkArchitecture: z.string().min(2, "Network architecture description is required"),
    criticalAssets: z.string().min(5, "Critical assets description is required"),
  }),

  // 6. Compliance Requirements
  complianceRequirements: z.object({
    required: z.array(z.string()).optional(),
    industry: z.array(z.string()).optional(),
    international: z.array(z.string()).optional(),
    additionalRequirements: z.string().optional(),
  }),

  // 7. Previous Security Incidents
  securityIncidents: z.object({
    hasIncidents: z.boolean().default(false),
    incidentDetails: z.string().optional(),
    impactAssessment: z.string().optional(),
    lessonsLearned: z.string().optional(),
  }),

  // 8. Budget and Timeline
  budgetTimeline: z.object({
    budgetRange: z.string().min(1, "Budget range is required"),
    timeline: z.string().min(1, "Timeline is required"),
    priority: z.string().min(1, "Priority level is required"),
    stakeholders: z.string().min(2, "Key stakeholders are required"),
  }),

  // 9. Assessment Scope and Objectives
  assessmentScope: z.object({
    scope: z.array(z.string()).min(1, "At least one scope area is required"),
    objectives: z.array(z.string()).min(1, "At least one objective is required"),
    deliverables: z.array(z.string()).min(1, "At least one deliverable is required"),
    constraints: z.string().optional(),
  }),

  // 10. Technology Assessment
  technologyAssessment: z.object({
    operatingSystems: z.array(z.string()).min(1, "At least one OS is required"),
    databases: z.array(z.string()).optional(),
    applications: z.array(z.string()).optional(),
    securityTools: z.array(z.string()).optional(),
    remoteAccess: z.boolean().default(false),
    mobileDevices: z.boolean().default(false),
    iotDevices: z.boolean().default(false),
  }),

  // 11. Risk Assessment Preferences
  riskPreferences: z.object({
    methodology: z.string().min(1, "Risk methodology is required"),
    riskTolerance: z.string().min(1, "Risk tolerance is required"),
    reportingPreferences: z.string().min(1, "Reporting preferences are required"),
  }),

  // 12. Device Inventory Tracking
  deviceInventoryTracking: z.object({
    deviceType: z.array(z.string()).optional(),
    trackingPreference: z.string().optional(),
    inventoryManagement: z.string().optional(),
    riskLevelAssignment: z.string().optional(),
  }),

  // 13. Identity Behavior Hygiene
  identityBehaviorHygiene: z.object({
    identityType: z.string().optional(),
    identificationMethod: z.string().optional(),
    componentCategory: z.string().optional(),
    uwaComponents: z.array(z.string()).optional(),
    recordsManagement: z.string().optional(),
  }),

  // Agreement and submission
  eulaAccepted: z.boolean().refine(val => val === true, "You must accept the EULA to proceed"),
  reportType: z.string().min(1, "Report type is required"),
});

interface QuestionnaireFormProps {
  onSubmit: (data: Sos2aFormData) => void;
}

export default function QuestionnaireForm({ onSubmit }: QuestionnaireFormProps) {
  const [currentSection, setCurrentSection] = useState(1);
  const { toast } = useToast();
  const totalSections = 13;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessAddress: "",
      businessLocation: {
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
      industry: "",
      employeeCount: "",
      businessDescription: "",
      contactInfo: {
        name: "",
        title: "",
        email: "",
        phone: "",
        alternateContact: {
          name: "",
          title: "",
          email: "",
          phone: "",
        },
      },
      currentSecurityMeasures: {
        firewalls: false,
        antiVirus: false,
        intrusionDetection: false,
        dataEncryption: false,
        accessControl: false,
        securityTraining: false,
        incidentResponse: false,
        regularBackups: false,
        networkSegmentation: false,
        vulnerabilityScanning: false,
        other: "",
      },
      primaryConcerns: [],
      specificThreats: "",
      infrastructure: {
        primarySystems: [],
        cloudServices: [],
        networkArchitecture: "",
        criticalAssets: "",
      },
      complianceRequirements: {
        required: [],
        industry: [],
        international: [],
        additionalRequirements: "",
      },
      securityIncidents: {
        hasIncidents: false,
        incidentDetails: "",
        impactAssessment: "",
        lessonsLearned: "",
      },
      budgetTimeline: {
        budgetRange: "",
        timeline: "",
        priority: "",
        stakeholders: "",
      },
      assessmentScope: {
        scope: [],
        objectives: [],
        deliverables: [],
        constraints: "",
      },
      technologyAssessment: {
        operatingSystems: [],
        databases: [],
        applications: [],
        securityTools: [],
        remoteAccess: false,
        mobileDevices: false,
        iotDevices: false,
      },
      riskPreferences: {
        methodology: "",
        riskTolerance: "",
        reportingPreferences: "",
      },
      deviceInventoryTracking: {
        deviceType: [],
        trackingPreference: "",
        inventoryManagement: "",
        riskLevelAssignment: "",
      },
      identityBehaviorHygiene: {
        identityType: "",
        identificationMethod: "",
        componentCategory: "",
        uwaComponents: [],
        recordsManagement: "",
      },
      eulaAccepted: false,
      reportType: "",
    },
  });

  const handleSubmit = form.handleSubmit((data: Sos2aFormData) => {
    console.log("Form submitted with data:", data);
    onSubmit(data);
    toast({
      title: "Assessment Submitted",
      description: "Your security assessment has been submitted successfully.",
    });
  });

  const nextSection = () => {
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="energy">Energy</SelectItem>
                        <SelectItem value="transportation">Transportation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="businessAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your complete business address"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="businessLocation.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
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
                    <FormLabel>State/Province *</FormLabel>
                    <FormControl>
                      <Input placeholder="State/Province" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessLocation.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="employeeCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Count *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee count" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-25">11-25 employees</SelectItem>
                        <SelectItem value="26-50">26-50 employees</SelectItem>
                        <SelectItem value="51-100">51-100 employees</SelectItem>
                        <SelectItem value="101-500">101-500 employees</SelectItem>
                        <SelectItem value="501-1000">501-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessLocation.zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP/Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="ZIP/Postal Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="businessDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your business operations, services, and key activities"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contactInfo.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Contact Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactInfo.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title/Position *</FormLabel>
                    <FormControl>
                      <Input placeholder="Job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contactInfo.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactInfo.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold mb-4">Alternate Contact (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="contactInfo.alternateContact.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternate Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactInfo.alternateContact.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title/Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <FormField
                  control={form.control}
                  name="contactInfo.alternateContact.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactInfo.alternateContact.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">Current Security Measures</Label>
              <p className="text-sm text-gray-600">Select all security measures currently implemented in your organization:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currentSecurityMeasures.firewalls"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Firewalls</FormLabel>
                        <FormDescription>Network perimeter security</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentSecurityMeasures.antiVirus"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Anti-virus Software</FormLabel>
                        <FormDescription>Malware protection</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentSecurityMeasures.intrusionDetection"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Intrusion Detection/Prevention</FormLabel>
                        <FormDescription>Network monitoring</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentSecurityMeasures.dataEncryption"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Data Encryption</FormLabel>
                        <FormDescription>Data protection at rest/transit</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentSecurityMeasures.accessControl"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Access Control Systems</FormLabel>
                        <FormDescription>User authentication & authorization</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentSecurityMeasures.securityTraining"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Security Training</FormLabel>
                        <FormDescription>Employee security awareness</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentSecurityMeasures.incidentResponse"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Incident Response Plan</FormLabel>
                        <FormDescription>Security incident procedures</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentSecurityMeasures.regularBackups"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Regular Backups</FormLabel>
                        <FormDescription>Data backup & recovery</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentSecurityMeasures.networkSegmentation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Network Segmentation</FormLabel>
                        <FormDescription>Network isolation & VLANs</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentSecurityMeasures.vulnerabilityScanning"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Vulnerability Scanning</FormLabel>
                        <FormDescription>Regular security assessments</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="currentSecurityMeasures.other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Security Measures</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe any other security measures not listed above"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Primary Security Concerns</Label>
              <p className="text-sm text-gray-600 mt-1">Select your organization's top security concerns:</p>
            </div>
            
            <FormField
              control={form.control}
              name="primaryConcerns"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Data Breach",
                      "Ransomware",
                      "Phishing Attacks",
                      "Insider Threats",
                      "Malware Infections",
                      "Identity Theft",
                      "System Downtime",
                      "Compliance Violations",
                      "Third-party Vendor Risks",
                      "Mobile Device Security",
                      "Cloud Security",
                      "Network Intrusions"
                    ].map((concern) => (
                      <FormField
                        key={concern}
                        control={form.control}
                        name="primaryConcerns"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={concern}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(concern)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...safeArray(field.value), concern])
                                      : field.onChange(
                                          safeArray(field.value).filter(
                                            (value) => value !== concern
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {concern}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specificThreats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specific Threats or Vulnerabilities</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe any specific threats, vulnerabilities, or security incidents your organization has experienced or is concerned about"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include any recent security incidents, known vulnerabilities, or industry-specific threats
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">IT Infrastructure Overview</Label>
              <p className="text-sm text-gray-600 mt-1">Provide details about your organization's IT infrastructure:</p>
            </div>

            <FormField
              control={form.control}
              name="infrastructure.primarySystems"
              render={() => (
                <FormItem>
                  <FormLabel>Primary Systems *</FormLabel>
                  <FormDescription>Select all system types used in your organization</FormDescription>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {[
                      "Windows Servers",
                      "Linux Servers",
                      "Database Systems",
                      "Web Applications",
                      "Email Systems",
                      "File Servers",
                      "Domain Controllers",
                      "Virtualization Platforms",
                      "Cloud Infrastructure",
                      "Network Equipment",
                      "Security Appliances",
                      "Backup Systems"
                    ].map((system) => (
                      <FormField
                        key={system}
                        control={form.control}
                        name="infrastructure.primarySystems"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={system}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(system)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...safeArray(field.value), system])
                                      : field.onChange(
                                          safeArray(field.value).filter(
                                            (value) => value !== system
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {system}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="infrastructure.cloudServices"
              render={() => (
                <FormItem>
                  <FormLabel>Cloud Services</FormLabel>
                  <FormDescription>Select cloud platforms and services in use</FormDescription>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {[
                      "Amazon Web Services (AWS)",
                      "Microsoft Azure",
                      "Google Cloud Platform",
                      "Microsoft 365",
                      "Google Workspace",
                      "Salesforce",
                      "Dropbox/OneDrive",
                      "Other SaaS Applications"
                    ].map((service) => (
                      <FormField
                        key={service}
                        control={form.control}
                        name="infrastructure.cloudServices"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={service}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...safeArray(field.value), service])
                                      : field.onChange(
                                          safeArray(field.value).filter(
                                            (value) => value !== service
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {service}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="infrastructure.networkArchitecture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network Architecture *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your network topology, connections, and architecture (e.g., LAN/WAN setup, VPNs, wireless networks, network segmentation)"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="infrastructure.criticalAssets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Critical Assets *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Identify your most critical IT assets, systems, and data that require the highest level of protection"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include databases, applications, servers, and data types that are essential to business operations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Compliance Requirements</Label>
              <p className="text-sm text-gray-600 mt-1">Select applicable regulatory and compliance requirements:</p>
            </div>

            <FormField
              control={form.control}
              name="complianceRequirements.required"
              render={() => (
                <FormItem>
                  <FormLabel>Federal/National Requirements</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {[
                      "HIPAA (Healthcare)",
                      "PCI DSS (Payment Cards)",
                      "SOX (Financial)",
                      "GLBA (Financial Services)",
                      "FERPA (Education)",
                      "FISMA (Federal Agencies)",
                      "CJIS (Criminal Justice)",
                      "ITAR (Defense/Export)"
                    ].map((requirement) => (
                      <FormField
                        key={requirement}
                        control={form.control}
                        name="complianceRequirements.required"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={requirement}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(requirement)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...safeArray(field.value), requirement])
                                      : field.onChange(
                                          safeArray(field.value).filter(
                                            (value) => value !== requirement
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {requirement}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="complianceRequirements.industry"
              render={() => (
                <FormItem>
                  <FormLabel>Industry Standards</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {[
                      "ISO 27001",
                      "NIST Cybersecurity Framework",
                      "CIS Controls",
                      "COBIT",
                      "ITIL",
                      "ISO 27002",
                      "NIST 800-53",
                      "SANS Top 20"
                    ].map((standard) => (
                      <FormField
                        key={standard}
                        control={form.control}
                        name="complianceRequirements.industry"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={standard}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(standard)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...safeArray(field.value), standard])
                                      : field.onChange(
                                          safeArray(field.value).filter(
                                            (value) => value !== standard
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {standard}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="complianceRequirements.international"
              render={() => (
                <FormItem>
                  <FormLabel>International Regulations</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {[
                      "GDPR (EU)",
                      "CCPA (California)",
                      "PIPEDA (Canada)",
                      "Privacy Act (Australia)",
                      "LGPD (Brazil)",
                      "PDPA (Singapore)",
                      "Data Protection Act (UK)",
                      "Other Regional Laws"
                    ].map((regulation) => (
                      <FormField
                        key={regulation}
                        control={form.control}
                        name="complianceRequirements.international"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={regulation}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(regulation)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...safeArray(field.value), regulation])
                                      : field.onChange(
                                          safeArray(field.value).filter(
                                            (value) => value !== regulation
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {regulation}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="complianceRequirements.additionalRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Requirements</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List any other compliance requirements, contractual obligations, or internal policies that apply to your organization"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Previous Security Incidents</Label>
              <p className="text-sm text-gray-600 mt-1">Information about past security incidents helps us better assess your risk profile:</p>
            </div>

            <FormField
              control={form.control}
              name="securityIncidents.hasIncidents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Has your organization experienced any security incidents in the past 3 years?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value === "true")}
                      value={field.value ? "true" : "false"}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="incidents-yes" />
                        <Label htmlFor="incidents-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="incidents-no" />
                        <Label htmlFor="incidents-no">No</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("securityIncidents.hasIncidents") && (
              <>
                <FormField
                  control={form.control}
                  name="securityIncidents.incidentDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incident Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a brief description of the security incidents (types, frequency, severity). No need for sensitive details."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include general information such as: malware infections, data breaches, phishing attacks, system compromises, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="securityIncidents.impactAssessment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impact Assessment</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the business impact of these incidents (downtime, data loss, financial impact, regulatory issues)"
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="securityIncidents.lessonsLearned"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lessons Learned & Improvements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What security improvements or changes were made following these incidents?"
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Budget and Timeline</Label>
              <p className="text-sm text-gray-600 mt-1">Help us understand your project constraints and priorities:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="budgetTimeline.budgetRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Range *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="under-10k">Under $10,000</SelectItem>
                        <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                        <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                        <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                        <SelectItem value="over-500k">Over $500,000</SelectItem>
                        <SelectItem value="tbd">To be determined</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budgetTimeline.timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Timeline *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate (1-2 weeks)</SelectItem>
                        <SelectItem value="1-month">1 Month</SelectItem>
                        <SelectItem value="3-months">3 Months</SelectItem>
                        <SelectItem value="6-months">6 Months</SelectItem>
                        <SelectItem value="12-months">12 Months</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="budgetTimeline.priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority Level *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="critical">Critical - Immediate action required</SelectItem>
                      <SelectItem value="high">High - Important for business operations</SelectItem>
                      <SelectItem value="medium">Medium - Part of planned improvements</SelectItem>
                      <SelectItem value="low">Low - Nice to have enhancement</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budgetTimeline.stakeholders"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Stakeholders *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List key stakeholders involved in security decisions (titles/roles, not names) and their involvement level"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include decision makers, IT staff, compliance officers, and other relevant personnel
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Assessment Scope and Objectives</Label>
              <p className="text-sm text-gray-600 mt-1">Define what you want to achieve with this security assessment:</p>
            </div>

            <FormField
              control={form.control}
              name="assessmentScope.scope"
              render={() => (
                <FormItem>
                  <FormLabel>Assessment Scope *</FormLabel>
                  <FormDescription>Select areas to be included in the assessment</FormDescription>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {[
                      "Network Security",
                      "Application Security",
                      "Data Protection",
                      "Access Control",
                      "Physical Security",
                      "Cloud Security",
                      "Mobile Device Security",
                      "Third-party Vendor Assessment",
                      "Compliance Review",
                      "Incident Response",
                      "Business Continuity",
                      "Employee Security Training"
                    ].map((scope) => (
                      <FormField
                        key={scope}
                        control={form.control}
                        name="assessmentScope.scope"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={scope}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(scope)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...safeArray(field.value), scope])
                                      : field.onChange(
                                          safeArray(field.value).filter(
                                            (value) => value !== scope
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {scope}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assessmentScope.objectives"
              render={() => (
                <FormItem>
                  <FormLabel>Primary Objectives *</FormLabel>
                  <FormDescription>What do you hope to achieve?</FormDescription>
                  <div className="grid grid-cols-1 gap-4 mt-2">
                    {[
                      "Identify security vulnerabilities and weaknesses",
                      "Ensure compliance with regulations and standards",
                      "Improve overall security posture",
                      "Develop incident response capabilities",
                      "Reduce cybersecurity risks",
                      "Implement security best practices",
                      "Create security policies and procedures",
                      "Train staff on security awareness"
                    ].map((objective) => (
                      <FormField
                        key={objective}
                        control={form.control}
                        name="assessmentScope.objectives"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={objective}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(objective)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...safeArray(field.value), objective])
                                      : field.onChange(
                                          safeArray(field.value).filter(
                                            (value) => value !== objective
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {objective}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assessmentScope.deliverables"
              render={() => (
                <FormItem>
                  <FormLabel>Expected Deliverables *</FormLabel>
                  <FormDescription>What outputs do you expect from the assessment?</FormDescription>
                  <div className="grid grid-cols-1 gap-4 mt-2">
                    {[
                      "Executive summary report",
                      "Detailed technical findings",
                      "Risk assessment matrix",
                      "Remediation recommendations",
                      "Implementation roadmap",
                      "Compliance gap analysis",
                      "Security policies and procedures",
                      "Training materials"
                    ].map((deliverable) => (
                      <FormField
                        key={deliverable}
                        control={form.control}
                        name="assessmentScope.deliverables"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={deliverable}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(deliverable)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...safeArray(field.value), deliverable])
                                      : field.onChange(
                                          safeArray(field.value).filter(
                                            (value) => value !== deliverable
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {deliverable}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assessmentScope.constraints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Constraints and Limitations</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe any constraints, limitations, or special considerations for the assessment (e.g., restricted access times, sensitive systems, regulatory restrictions)"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Technology Assessment</Label>
              <p className="text-sm text-gray-600 mt-1">Provide details about your technology environment:</p>
            </div>

            <FormField
              control={form.control}
              name="technologyAssessment.operatingSystems"
              render={() => (
                <FormItem>
                  <FormLabel>Operating Systems *</FormLabel>
                  <div className="space-y-4">
                    <div>
                      <FormDescription className="mb-2">Server Operating Systems</FormDescription>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          "Windows Server 2019/2022",
                          "Windows Server 2016",
                          "Windows Server 2012/2012 R2",
                          "Linux (Ubuntu)",
                          "Linux (CentOS/RHEL)",
                          "Linux (SUSE)",
                          "Unix-based OS (includes macOS)",
                          "VMware vSphere"
                        ].map((os) => (
                          <FormField
                            key={os}
                            control={form.control}
                            name="technologyAssessment.operatingSystems"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={os}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(os)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...safeArray(field.value), os])
                                          : field.onChange(
                                              safeArray(field.value).filter(
                                                (value) => value !== os
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-normal">
                                      {os === "Unix-based OS (includes macOS)" ? (
                                        <div className="flex items-center gap-2">
                                          Unix-based OS 
                                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                            includes macOS
                                          </Badge>
                                        </div>
                                      ) : (
                                        os
                                      )}
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <FormDescription className="mb-2">Desktop Operating Systems</FormDescription>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          "Windows 11",
                          "Windows 10",
                          "macOS",
                          "Linux Desktop"
                        ].map((os) => (
                          <FormField
                            key={os}
                            control={form.control}
                            name="technologyAssessment.operatingSystems"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={os}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(os)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...safeArray(field.value), os])
                                          : field.onChange(
                                              safeArray(field.value).filter(
                                                (value) => value !== os
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {os}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technologyAssessment.databases"
              render={() => (
                <FormItem>
                  <FormLabel>Database Systems</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {[
                      "Microsoft SQL Server",
                      "Oracle Database",
                      "MySQL",
                      "PostgreSQL",
                      "MongoDB",
                      "SQLite",
                      "Access",
                      "Other"
                    ].map((db) => (
                      <FormField
                        key={db}
                        control={form.control}
                        name="technologyAssessment.databases"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={db}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(db)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...safeArray(field.value), db])
                                      : field.onChange(
                                          safeArray(field.value).filter(
                                            (value) => value !== db
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {db}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technologyAssessment.applications"
              render={() => (
                <FormItem>
                  <FormLabel>Business Applications</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {[
                      "Microsoft Office 365",
                      "Google Workspace",
                      "Salesforce",
                      "SAP",
                      "Oracle Applications",
                      "Custom Web Applications",
                      "ERP Systems",
                      "CRM Systems"
                    ].map((app) => (
                      <FormField
                        key={app}
                        control={form.control}
                        name="technologyAssessment.applications"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={app}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(app)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...safeArray(field.value), app])
                                      : field.onChange(
                                          safeArray(field.value).filter(
                                            (value) => value !== app
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {app}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technologyAssessment.securityTools"
              render={() => (
                <FormItem>
                  <FormLabel>Security Tools</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {[
                      "Antivirus/Anti-malware",
                      "Firewall Management",
                      "SIEM Solutions",
                      "Vulnerability Scanners",
                      "Penetration Testing Tools",
                      "Identity Management",
                      "Data Loss Prevention",
                      "Backup Solutions"
                    ].map((tool) => (
                      <FormField
                        key={tool}
                        control={form.control}
                        name="technologyAssessment.securityTools"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={tool}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(tool)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...safeArray(field.value), tool])
                                      : field.onChange(
                                          safeArray(field.value).filter(
                                            (value) => value !== tool
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {tool}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Label className="text-base font-semibold">Additional Technology Components</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="technologyAssessment.remoteAccess"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Remote Access Solutions</FormLabel>
                        <FormDescription>VPN, RDP, etc.</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technologyAssessment.mobileDevices"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Mobile Device Management</FormLabel>
                        <FormDescription>BYOD policies, MDM</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technologyAssessment.iotDevices"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>IoT Devices</FormLabel>
                        <FormDescription>Smart devices, sensors</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );

      case 11:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Risk Assessment Preferences</Label>
              <p className="text-sm text-gray-600 mt-1">Help us tailor the assessment approach to your preferences:</p>
            </div>

            <FormField
              control={form.control}
              name="riskPreferences.methodology"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Risk Assessment Methodology *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select methodology" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="nist">NIST Cybersecurity Framework</SelectItem>
                      <SelectItem value="iso27001">ISO 27001</SelectItem>
                      <SelectItem value="cis">CIS Controls</SelectItem>
                      <SelectItem value="nist-800-53">NIST 800-53</SelectItem>
                      <SelectItem value="cobit">COBIT</SelectItem>
                      <SelectItem value="fair">FAIR (Factor Analysis of Information Risk)</SelectItem>
                      <SelectItem value="octave">OCTAVE</SelectItem>
                      <SelectItem value="custom">Custom/Hybrid Approach</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="riskPreferences.riskTolerance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizational Risk Tolerance *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk tolerance" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="very-low">Very Low - Minimal risk acceptance</SelectItem>
                      <SelectItem value="low">Low - Conservative approach</SelectItem>
                      <SelectItem value="moderate">Moderate - Balanced risk/benefit</SelectItem>
                      <SelectItem value="high">High - Aggressive growth focused</SelectItem>
                      <SelectItem value="variable">Variable - Depends on business area</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This helps us calibrate our recommendations to your organization's appetite for risk
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="riskPreferences.reportingPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reporting Preferences *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reporting preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="executive">Executive Summary Focus</SelectItem>
                      <SelectItem value="technical">Technical Detail Focus</SelectItem>
                      <SelectItem value="balanced">Balanced Executive + Technical</SelectItem>
                      <SelectItem value="compliance">Compliance-Focused</SelectItem>
                      <SelectItem value="actionable">Action-Oriented Recommendations</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How would you prefer the assessment results to be presented?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 12:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Device Inventory Tracking</Label>
              <p className="text-sm text-gray-600 mt-1">Track and manage your organization's devices to improve security visibility:</p>
            </div>

            <FormField
              control={form.control}
              name="deviceInventoryTracking.deviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Types</FormLabel>
                  <FormDescription>Select device types in your environment</FormDescription>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {[
                      "Physical Server",
                      "Virtual Server", 
                      "Desktop Computer",
                      "Laptop Computer",
                      "Mobile Device",
                      "Network Equipment",
                      "IoT Device",
                      "Security Appliance"
                    ].map((device) => (
                      <FormField
                        key={device}
                        control={form.control}
                        name="deviceInventoryTracking.deviceType"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={device}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(device)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), device])
                                      : field.onChange(
                                          (field.value || []).filter(
                                            (value) => value !== device
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {device}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deviceInventoryTracking.trackingPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tracking Preference</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tracking preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="automated">Automated Discovery</SelectItem>
                      <SelectItem value="manual">Manual Entry</SelectItem>
                      <SelectItem value="hybrid">Hybrid Approach</SelectItem>
                      <SelectItem value="existing">Use Existing System</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deviceInventoryTracking.inventoryManagement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inventory Management</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select management approach" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="centralized">Centralized Management</SelectItem>
                      <SelectItem value="distributed">Distributed Management</SelectItem>
                      <SelectItem value="departmental">Departmental Ownership</SelectItem>
                      <SelectItem value="third-party">Third-party Managed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deviceInventoryTracking.riskLevelAssignment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Level Assignment</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk assignment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic Based on Criticality</SelectItem>
                      <SelectItem value="manual">Manual Assignment</SelectItem>
                      <SelectItem value="policy-based">Policy-Based Rules</SelectItem>
                      <SelectItem value="risk-matrix">Risk Matrix Approach</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How should devices be assigned risk levels for prioritization?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 13:
        return <Section13Content form={form} />;

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-800">
              HOS²A Security Assessment Questionnaire
            </CardTitle>
            <p className="text-slate-600 mt-2">
              Section {currentSection} of {totalSections}: {
                currentSection === 1 ? "Business Information" :
                currentSection === 2 ? "Contact Information" :
                currentSection === 3 ? "Current Security Measures" :
                currentSection === 4 ? "Primary Security Concerns" :
                currentSection === 5 ? "IT Infrastructure" :
                currentSection === 6 ? "Compliance Requirements" :
                currentSection === 7 ? "Security Incidents" :
                currentSection === 8 ? "Budget and Timeline" :
                currentSection === 9 ? "Assessment Scope" :
                currentSection === 10 ? "Technology Assessment" :
                currentSection === 11 ? "Risk Preferences" :
                currentSection === 12 ? "Device Inventory" :
                currentSection === 13 ? "Identity Behavior" : ""
              }
            </p>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>Progress</span>
                <span>{Math.round((currentSection / totalSections) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentSection / totalSections) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-8">
                {renderSection()}

                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevSection}
                    disabled={currentSection === 1}
                    className="flex items-center gap-2"
                  >
                    ← Previous
                  </Button>

                  {currentSection === totalSections ? (
                    <div className="space-x-4">
                      <FormField
                        control={form.control}
                        name="eulaAccepted"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I accept the End User License Agreement *
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="reportType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Report Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select report type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="preliminary">Preliminary Report</SelectItem>
                                <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                                <SelectItem value="executive">Executive Summary</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Submit Assessment
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextSection}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      Next →
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}