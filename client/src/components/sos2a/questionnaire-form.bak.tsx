import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sos2aFormData } from "@/lib/sos2a-types";
import { assessmentTools, standardsAndGuidelinesLibrary } from "@/lib/matrix-mappings";
import { RegulatoryContent } from "./regulatory-content";

const formSchema = z.object({
  // 1. Business Information
  businessName: z.string().min(2, "Business name is required"),
  businessAddress: z.string().min(5, "Business address is required"),
  businessLocation: z.object({
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
  internetPresence: z.array(z.string()).min(1, "At least one internet presence is required"),
  
  // 3. Configuration Baseline
  configurationManagement: z.string().optional(),
  cisBenchmarks: z.array(z.string()).optional(),
  
  // 4. Security Control Framework
  securityMeasures: z.array(z.string()),
  primaryConcerns: z.array(z.string()),
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
  }),
  
  // 6. Regulatory Requirements
  regulatoryRequirements: z.array(z.string()).optional(),
  
  // 7. Standards
  healthcareStandards: z.array(z.string()).optional(),
  
  policyDocuments: z.object({
    policies: z.array(z.string()),
    procedures: z.array(z.string()),
    plans: z.array(z.string()),
    guides: z.array(z.string()),
  }),
  
  // 8. Relevant ACQ Tool (Assessment, Checklist, Questionnaire)
  relevantACQTools: z.object({
    assessments: z.array(z.string()).optional(),
    checklists: z.array(z.string()).optional(),
    questionnaires: z.array(z.string()).optional(),
  }).optional(),
  relevantQuestionnaires: z.array(z.string()).optional(), // For backward compatibility
  
  // 9. Adversarial Insight
  osHardening: z.object({
    stig: z.boolean(),
    scap: z.boolean(),
    guidelines: z.array(z.string()),
  }),
  adversarialInsights: z.object({
    mitreAttackIds: z.array(z.string()),
  }),
  threatActors: z.array(z.string()).optional(),
  
  // 10. ISMS
  ismsImplementation: z.string().optional(),
  ismsPolicies: z.array(z.string()).optional(),
  ismsPlans: z.array(z.string()).optional(),
  ismsProcedures: z.array(z.string()).optional(),
  ismsProcesses: z.array(z.string()).optional(),
  
  // 11. Contact and Confirmation
  contactInfo: z.object({
    name: z.string().min(2, "Name is required"),
    pointOfContact: z.string().min(2, "Point of contact is required"),
    email: z.string().email("Invalid email address"),
    contactEmail: z.string().email("Invalid contact email address"),
    phone: z.string().min(10, "Valid phone number is required"),
    sameAsContact: z.boolean().optional(),
  }),
  
  // Report options
  matrixData: z.any().nullable(),
  reportType: z.enum(['preliminary', 'comprehensive']),
  availabilityConfirmation: z.boolean().refine(val => val === true, {
    message: "You must confirm your availability for the interview",
  }),
  referralPermission: z.boolean(),
});

interface QuestionnaireFormProps {
  onSubmit: (data: Sos2aFormData) => void;
}

export default function QuestionnaireForm({ onSubmit }: QuestionnaireFormProps) {
  const form = useForm<Sos2aFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // 1. Business Information
      businessName: "",
      businessAddress: "",
      businessLocation: {
        state: "",
        country: "",
        zipCode: "",
      },
      industry: "",
      customIndustry: "",
      showCustomIndustry: false,
      employeeCount: "",
      businessServices: "",
      
      // 2-3. Infrastructure and Configuration
      operationMode: [],
      internetPresence: [],
      configurationManagement: "",
      cisBenchmarks: [],
      
      // 4. Security Control Framework
      securityMeasures: [],
      primaryConcerns: [],
      frameworks: {
        operations: [],
        management: [],
        technology: [],
        people: [],
      },
      
      // 5-7. Compliance, Regulatory, Standards
      complianceRequirements: {
        frameworks: [],
        standards: [],
        compliance: [],
        regulations: [],
      },
      regulatoryRequirements: [],
      healthcareStandards: [],
      policyDocuments: {
        policies: [],
        procedures: [],
        plans: [],
        guides: [],
      },
      
      // 8-9. Questionnaires & Adversarial Insight
      relevantACQTools: {
        assessments: [],
        checklists: [],
        questionnaires: [],
      },
      relevantQuestionnaires: [], // For backward compatibility
      osHardening: {
        stig: false,
        scap: false,
        guidelines: [],
      },
      adversarialInsights: {
        mitreAttackIds: [],
      },
      threatActors: [],
      
      // 10. ISMS
      ismsImplementation: "",
      ismsPolicies: [],
      ismsPlans: [],
      ismsProcedures: [],
      ismsProcesses: [],
      
      // 11. Contact and Confirmation
      contactInfo: {
        name: "",
        pointOfContact: "",
        email: "",
        contactEmail: "",
        phone: "",
      },
      
      // Report options
      matrixData: null,
      reportType: 'preliminary',
      availabilityConfirmation: false,
      referralPermission: false,
    },
  });
  
  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });
  
  const operationModes = [
    { id: "isp-modem", label: "ISP Modem" },
    { id: "mobile-hotspot", label: "Mobile Hotspot" },
    { id: "commercial-internet", label: "Commercial Internet" },
    { id: "dedicated-connection", label: "Dedicated Connection" },
    { id: "satellite", label: "Satellite" },
    { id: "other", label: "Other" },
  ];
  
  const internetPresenceOptions = [
    { id: "website", label: "Website" },
    { id: "social-media", label: "Social Media" },
    { id: "cloud-servers", label: "Cloud Servers" },
    { id: "office-servers", label: "Office Servers" },
    { id: "hybrid", label: "Hybrid" },
    { id: "minimal", label: "Minimal" },
    { id: "none", label: "None" },
  ];
  
  const securityMeasureOptions = [
    { id: "firewall-vpn", label: "Firewall and VPN Solutions" },
    { id: "endpoint-security", label: "Endpoint and Device Security (EDR, MDM)" },
    { id: "network-segmentation", label: "Network Segmentation Solutions" },
    { id: "backup-disaster-recovery", label: "Backup and Disaster Recovery Solutions" },
    { id: "email-filtering", label: "Email Filtering and Anti-Phishing Solutions" },
    { id: "mfa", label: "Multi-Factor Authentication (MFA)" },
    { id: "dns-filtering", label: "DNS Filtering and Secure DNS" },
    { id: "cloud-security", label: "Cloud Security Tools (CASB, WAF)" },
    { id: "soc-incident-response", label: "SOC and Incident Response" },
    { id: "security-training", label: "Employee Training on Cybersecurity Threats Platforms" },
    { id: "data-encryption-dlp", label: "Data Encryption and DLP Solutions" },
    { id: "ids-ips", label: "Intrusion Detection/Prevention Systems" },
    { id: "antivirus", label: "Antivirus/Anti-malware Solutions" },
    { id: "none", label: "None Currently Implemented" },
  ];
  
  const primaryConcernOptions = [
    { id: "data-breach", label: "Data Breach" },
    { id: "ransomware", label: "Ransomware" },
    { id: "phishing", label: "Phishing" },
    { id: "insider-threats", label: "Insider Threats" },
    { id: "compliance", label: "Regulatory Compliance" },
    { id: "business-continuity", label: "Business Continuity" },
    { id: "remote-work", label: "Secure Remote Work" },
    { id: "byod", label: "BYOD Security" },
    { id: "third-party", label: "Third-Party/Vendor Risk" },
    { id: "iot", label: "IoT Device Security" },
  ];
  
  // Security Frameworks by domain
  const operationalFrameworks = [
    { id: "nist-csf", label: "NIST CSF" },
    { id: "cis-csc", label: "CIS CSC" },
    { id: "cyber-ess-uk", label: "Cyber Essentials (UK)" },
    { id: "cmmc", label: "CMMC" },
    { id: "mitre-attack", label: "MITRE ATT&CK" },
    { id: "pci-dss", label: "PCI-DSS" },
  ];
  
  const managementFrameworks = [
    { id: "nist-csf", label: "NIST CSF" },
    { id: "cis-csc", label: "CIS CSC" },
    { id: "iso-27001", label: "ISO 27001" },
    { id: "cobit", label: "COBIT" },
    { id: "cmmc", label: "CMMC" },
    { id: "itil", label: "ITIL" },
  ];
  
  const technologyFrameworks = [
    { id: "nist-csf", label: "NIST CSF" },
    { id: "cis-csc", label: "CIS CSC" },
    { id: "cyber-ess-uk", label: "Cyber Essentials (UK)" },
    { id: "cmmc", label: "CMMC" },
    { id: "soc2", label: "SOC 2" },
    { id: "nist-800-53", label: "NIST 800-53" },
  ];
  
  const peopleFrameworks = [
    { id: "sans-security-awareness", label: "SANS Security Awareness" },
    { id: "isaca-cism", label: "ISACA CISM" }, 
    { id: "nist-nice", label: "NIST NICE Framework" },
    { id: "iapp", label: "IAPP Privacy Certification" },
    { id: "cyber-essentials-plus", label: "Cyber Essentials Plus" },
    { id: "comp-tia-security", label: "CompTIA Security+" },
  ];
  
  // Compliance, standards, frameworks
  const complianceFrameworkOptions = [
    { id: "iso-27001", label: "ISO 27001" },
    { id: "nist-csf", label: "NIST CSF" },
    { id: "cis-csc", label: "CIS CSC" },
    { id: "cmmc", label: "CMMC" },
    { id: "cyber-ess-uk", label: "Cyber Essentials (UK)" },
  ];
  
  const standardsOptions = [
    { id: "iso-27001", label: "ISO 27001" },
    { id: "iso-27002", label: "ISO 27002" },
    { id: "iso-27005", label: "ISO 27005" },
    { id: "iso-27018", label: "ISO 27018" },
    { id: "nist-800-53", label: "NIST 800-53" },
    { id: "nist-800-171", label: "NIST 800-171" },
  ];
  
  const complianceOptions = [
    { id: "pci-dss", label: "PCI DSS" },
    { id: "hipaa", label: "HIPAA" },
    { id: "soc2", label: "SOC 2" },
    { id: "fedramp", label: "FedRAMP" },
    { id: "ferpa", label: "FERPA" },
    { id: "glba", label: "GLBA" },
  ];
  
  const regulationOptions = [
    { id: "gdpr", label: "GDPR" },
    { id: "ccpa", label: "CCPA" },
    { id: "pipeda", label: "PIPEDA" },
    { id: "shield-act", label: "NY SHIELD Act" },
    { id: "cpra", label: "CPRA" },
    { id: "ftc-safeguards", label: "FTC Safeguard Rules" },
  ];
  
  // Policy Documents
  const policyOptions = [
    { id: "acceptable-use", label: "Acceptable Use Policy" },
    { id: "information-security", label: "Information Security Policy" },
    { id: "password", label: "Password Policy" },
    { id: "data-classification", label: "Data Classification Policy" },
    { id: "remote-work", label: "Remote Work Policy" },
    { id: "byod", label: "BYOD Policy" },
  ];
  
  const procedureOptions = [
    { id: "incident-response", label: "Incident Response Procedures" },
    { id: "access-control", label: "Access Control Procedures" },
    { id: "patching", label: "Patching Procedures" },
    { id: "backup-restore", label: "Backup and Restore Procedures" },
    { id: "vulnerability-mgmt", label: "Vulnerability Management Procedures" },
    { id: "change-management", label: "Change Management Procedures" },
  ];
  
  const planOptions = [
    { id: "incident-response-plan", label: "Incident Response Plan" },
    { id: "business-continuity", label: "Business Continuity Plan" },
    { id: "disaster-recovery", label: "Disaster Recovery Plan" },
    { id: "security-awareness", label: "Security Awareness Training Plan" },
    { id: "data-breach", label: "Data Breach Response Plan" },
  ];
  
  const guideOptions = [
    { id: "password-guide", label: "Password Management Guide" },
    { id: "email-security", label: "Email Security Guide" },
    { id: "secure-remote-work", label: "Secure Remote Work Guide" },
    { id: "social-engineering", label: "Social Engineering Awareness Guide" },
    { id: "byod-guide", label: "BYOD Best Practices Guide" },
  ];
  
  // ACQ Tools options
  const assessmentOptions = assessmentTools.assessments.map(assessment => ({
    id: assessment.toLowerCase().replace(/\s+/g, '-'),
    label: assessment
  }));
  
  const checklistOptions = assessmentTools.checklists.map(checklist => ({
    id: checklist.toLowerCase().replace(/\s+/g, '-'),
    label: checklist
  }));
  
  const questionnaireOptions = assessmentTools.questionnaires.map(questionnaire => ({
    id: questionnaire.toLowerCase().replace(/\s+/g, '-'),
    label: questionnaire
  }));
  
  // Function to update Contact Email when "Same as above" is checked
  const handleSameAsContactChange = (checked: boolean) => {
    if (checked) {
      const currentEmail = form.getValues("contactInfo.email");
      form.setValue("contactInfo.contactEmail", currentEmail);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Healthcare Organizational and System Security Analysis (HOS²A)</CardTitle>
        <CardDescription>
          Complete this questionnaire to begin your assessment
        </CardDescription>
        <div className="mt-4 text-sm text-muted-foreground">
          <p className="mb-2">Our 11-step assessment process:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-left">
            <div>1. Business Information</div>
            <div>2. Infrastructure Mode</div>
            <div>3. Configuration Baseline</div>
            <div>4. Security Control Framework</div>
            <div>5. Compliance</div>
            <div>6. Regulatory Requirements</div>
            <div>7. Standards & Guidelines</div>
            <div>8. Relevant ACQ Tool</div>
            <div>9. Adversarial Insight</div>
            <div>10. Information Security Management System (ISMS)</div>
            <div>11. Contact & Confirmation</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="flex flex-wrap mb-4 overflow-x-auto">
                <TabsTrigger value="business" className="flex-shrink-0">1. Business Information</TabsTrigger>
                <TabsTrigger value="infrastructure" className="flex-shrink-0">2. Infrastructure Mode</TabsTrigger>
                <TabsTrigger value="configuration" className="flex-shrink-0">3. Configuration Baseline</TabsTrigger>
                <TabsTrigger value="security" className="flex-shrink-0">4. Security Controls vs Framework</TabsTrigger>
                <TabsTrigger value="compliance" className="flex-shrink-0">5. Compliance</TabsTrigger>
                <TabsTrigger value="regulatory" className="flex-shrink-0">6. Regulatory Requirements</TabsTrigger>
                <TabsTrigger value="standards" className="flex-shrink-0">7. Standards & Guidelines</TabsTrigger>
                <TabsTrigger value="questionnaires" className="flex-shrink-0">8. Relevant ACQ Tool</TabsTrigger>
                <TabsTrigger value="adversarial" className="flex-shrink-0">9. Adversarial Insight</TabsTrigger>
                <TabsTrigger value="isms" className="flex-shrink-0">10. Information Security Management System</TabsTrigger>
                <TabsTrigger value="contact" className="flex-shrink-0">11. Contact & Confirmation</TabsTrigger>
              </TabsList>
              
              {/* Business Information Tab */}
              <TabsContent value="business" className="space-y-6">
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="businessLocation.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state or province" {...field} />
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
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter country" {...field} />
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
                        <FormLabel>Zip/Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter zip or postal code" {...field} />
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
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          if (value === "other") {
                            // Show custom industry input
                            form.setValue("showCustomIndustry", true);
                            // Don't set industry field yet - it will be set via the custom input
                          } else {
                            form.setValue("showCustomIndustry", false);
                            field.onChange(value);
                          }
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance & Banking</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="professional-services">Professional Services</SelectItem>
                          <SelectItem value="hospitality">Hospitality</SelectItem>
                          <SelectItem value="energy">Energy & Utilities</SelectItem>
                          <SelectItem value="transportation">Transportation & Logistics</SelectItem>
                          <SelectItem value="nonprofit">Non-Profit</SelectItem>
                          <SelectItem value="other">Other (Please specify)</SelectItem>
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
                      <FormItem>
                        <FormLabel>Please specify your industry</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your industry" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              // Also update the main industry field
                              form.setValue("industry", e.target.value);
                            }}
                          />
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
                    <FormItem>
                      <FormLabel>Number of Employees</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          <SelectItem value="501-1000">501-1000</SelectItem>
                          <SelectItem value="1001+">1001+</SelectItem>
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
                          placeholder="Briefly describe your business services and offerings"
                          className="h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              {/* Infrastructure Tab */}
              <TabsContent value="infrastructure" className="space-y-6">
                <FormField
                  control={form.control}
                  name="operationMode"
                  render={() => (
                    <FormItem>
                      <FormLabel>Mode of Operation (select all that apply)</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {operationModes.map((mode) => (
                          <FormField
                            key={mode.id}
                            control={form.control}
                            name="operationMode"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={mode.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(mode.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...field.value, mode.id]
                                          : field.value?.filter(
                                              (value) => value !== mode.id
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {mode.label}
                                  </FormLabel>
                                </FormItem>
                              );
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
                  name="internetPresence"
                  render={() => (
                    <FormItem>
                      <FormLabel>Internet Presence (select all that apply)</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {internetPresenceOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="internetPresence"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={option.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...field.value, option.id]
                                          : field.value?.filter(
                                              (value) => value !== option.id
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="border rounded-md p-4 mb-6">
                  <h3 className="font-medium mb-4">
                    {form.watch('industry') === 'healthcare' 
                      ? "Current Healthcare Security Measures" 
                      : "Current Security Measures"}
                  </h3>
                  <FormField
                    control={form.control}
                    name="securityMeasures"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">
                            {form.watch('industry') === 'healthcare'
                              ? "Select security measures currently implemented in your healthcare organization"
                              : "Current Security Measures (select all that apply)"}
                          </FormLabel>
                          <FormDescription>
                            These help us understand your current security posture and identify gaps relative to industry standards.
                          </FormDescription>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {securityMeasureOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="securityMeasures"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...field.value, option.id]
                                            : field.value?.filter(
                                                (value) => value !== option.id
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        {form.watch('industry') === 'healthcare' && (
                          <FormDescription className="mt-4 text-amber-500">
                            Note: For healthcare organizations, endpoint and device security, data encryption, and MFA are typically required for HIPAA compliance.
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                

              </TabsContent>
              
              {/* Configuration Baseline Tab */}
              <TabsContent value="configuration" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Configuration Baseline</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Define your organization's configuration baseline to help assess security posture.
                  </p>
                  
                  <FormField
                    control={form.control}
                    name="configurationManagement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Configuration Management Approach</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select configuration approach" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ad-hoc">Ad-hoc (No formal configuration management)</SelectItem>
                            <SelectItem value="documented">Documented configurations</SelectItem>
                            <SelectItem value="automated">Automated configuration management</SelectItem>
                            <SelectItem value="compliance-driven">Compliance-driven configuration</SelectItem>
                            <SelectItem value="continuous">Continuous configuration validation</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">OS / System Hardening</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    System hardening is critical for protecting applications and systems. These practices help secure operating systems and configure them properly.
                  </p>
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="configurationManagement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Configuration Management Approach</FormLabel>
                          <FormDescription className="mb-2">
                            How does your organization manage and maintain secure configurations across systems?
                          </FormDescription>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select configuration management approach" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ad-hoc">Ad-hoc (No formal configuration management)</SelectItem>
                              <SelectItem value="documented">Documented configurations</SelectItem>
                              <SelectItem value="automated">Automated configuration management</SelectItem>
                              <SelectItem value="compliance-driven">Compliance-driven configuration</SelectItem>
                              <SelectItem value="continuous">Continuous configuration validation</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="mt-2">
                            An effective configuration management process ensures consistent application of security settings across all systems.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="osHardening.stig"
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
                              STIG (Security Technical Implementation Guides)
                            </FormLabel>
                            <FormDescription>
                              Standard security configurations for different operating systems
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="osHardening.scap"
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
                              SCAP (Security Content Automation Protocol)
                            </FormLabel>
                            <FormDescription>
                              Automated vulnerability checking and policy compliance
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cisBenchmarks"
                      render={() => (
                        <FormItem>
                          <FormLabel>CIS Benchmarks</FormLabel>
                          <FormDescription className="mb-2">
                            The Center for Internet Security (CIS) provides secure configuration guidelines. Select the benchmarks applicable to your organization:
                          </FormDescription>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <FormField
                              control={form.control}
                              name="cisBenchmarks"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("windows")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), "windows"]
                                          : (field.value || [])?.filter(
                                              (value) => value !== "windows"
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    CIS Windows Benchmark
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="cisBenchmarks"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("linux")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), "linux"]
                                          : (field.value || [])?.filter(
                                              (value) => value !== "linux"
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    CIS Linux Benchmark
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="cisBenchmarks"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("macos")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), "macos"]
                                          : (field.value || [])?.filter(
                                              (value) => value !== "macos"
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    CIS macOS Benchmark
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="cisBenchmarks"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("cloud")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), "cloud"]
                                          : (field.value || [])?.filter(
                                              (value) => value !== "cloud"
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    CIS Cloud Infrastructure Benchmark
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="cisBenchmarks"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("aws")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), "aws"]
                                          : (field.value || [])?.filter(
                                              (value) => value !== "aws"
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    CIS AWS Benchmark
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="cisBenchmarks"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("azure")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), "azure"]
                                          : (field.value || [])?.filter(
                                              (value) => value !== "azure"
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    CIS Azure Benchmark
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="cisBenchmarks"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("gcp")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), "gcp"]
                                          : (field.value || [])?.filter(
                                              (value) => value !== "gcp"
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    CIS Google Cloud Benchmark
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="cisBenchmarks"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("kubernetes")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), "kubernetes"]
                                          : (field.value || [])?.filter(
                                              (value) => value !== "kubernetes"
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    CIS Kubernetes Benchmark
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="cisBenchmarks"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("docker")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), "docker"]
                                          : (field.value || [])?.filter(
                                              (value) => value !== "docker"
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    CIS Docker Benchmark
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="cisBenchmarks"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("hipaa")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), "hipaa"]
                                          : (field.value || [])?.filter(
                                              (value) => value !== "hipaa"
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    CIS HIPAA Benchmark
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormDescription className="mt-3 text-amber-500">
                            Note: Organizations with compliance requirements should consider industry-specific CIS Benchmarks relevant to their operations.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Security Controls vs Framework Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="border rounded-md p-4 mb-6">
                  <h3 className="font-medium mb-4">Security Controls vs Framework</h3>
                  <FormDescription className="mb-4">
                    This section helps us identify if your organization is applying security controls properly across the four main domains (Operations, Management, Technology, and People), with a focus on your specific industry requirements.
                  </FormDescription>
                  
                  {form.watch('industry') === 'healthcare' && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <h4 className="text-sm font-medium text-blue-800 mb-1">Healthcare Industry Focus</h4>
                      <p className="text-sm text-blue-700">
                        Healthcare organizations have specific framework requirements related to patient data protection, 
                        HIPAA compliance, medical device security, and clinical systems integrity. We'll help identify the most 
                        appropriate frameworks for your healthcare organization.
                      </p>
                    </div>
                  )}
                  
                  {form.watch('industry') === 'finance' && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <h4 className="text-sm font-medium text-blue-800 mb-1">Finance Industry Focus</h4>
                      <p className="text-sm text-blue-700">
                        Financial organizations need to address PCI DSS, SOX compliance, and financial fraud protection. 
                        We'll help identify the most appropriate frameworks for your financial institution.
                      </p>
                    </div>
                  )}
                  
                  {form.watch('industry') && !['healthcare', 'finance'].includes(form.watch('industry')) && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <h4 className="text-sm font-medium text-blue-800 mb-1">Industry-Specific Guidance</h4>
                      <p className="text-sm text-blue-700">
                        Different industries have unique security requirements. Based on your {form.watch('industry')} industry 
                        selection, we'll help identify the most appropriate frameworks and controls for your organization.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="border rounded-md p-4 mb-6">
                  <h3 className="font-medium mb-4">
                    {form.watch('industry') === 'healthcare' 
                      ? "Healthcare Security Priorities" 
                      : "Security Priorities"}
                  </h3>
                  <FormField
                    control={form.control}
                    name="primaryConcerns"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">
                            {form.watch('industry') === 'healthcare'
                              ? "Select your healthcare organization's primary security concerns"
                              : "Select your organization's primary security concerns"}
                          </FormLabel>
                          <FormDescription>
                            This helps us prioritize recommendations based on your most pressing concerns.
                          </FormDescription>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {primaryConcernOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="primaryConcerns"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== option.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        {form.watch('industry') === 'healthcare' && (
                          <FormDescription className="mt-4 text-amber-500">
                            Note: For healthcare organizations, data breach prevention and ransomware protection are critical concerns given the sensitive nature of PHI.
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="border rounded-md p-4 mb-6">
                  <h3 className="font-medium mb-4">
                    {form.watch('industry') === 'healthcare' 
                      ? "Healthcare Security Frameworks by Domain" 
                      : "Security Frameworks by Domain"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please select any security frameworks currently implemented or being considered in your organization.
                  </p>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="frameworks.operations"
                      render={() => (
                        <FormItem>
                          <FormLabel>Operational Controls Frameworks</FormLabel>
                          <FormDescription className="mb-2">
                            Day-to-day security activities and processes
                          </FormDescription>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {operationalFrameworks.map((framework) => (
                              <FormField
                                key={framework.id}
                                control={form.control}
                                name="frameworks.operations"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={framework.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(framework.id)}
                                          onCheckedChange={(checked) => {
                                            const updatedValue = checked
                                              ? [...(field.value || []), framework.id]
                                              : (field.value || [])?.filter(
                                                  (value) => value !== framework.id
                                                );
                                            field.onChange(updatedValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {framework.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
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
                      name="frameworks.management"
                      render={() => (
                        <FormItem>
                          <FormLabel>Management Controls Frameworks</FormLabel>
                          <FormDescription className="mb-2">
                            Governance, policies, and oversight mechanisms
                          </FormDescription>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {managementFrameworks.map((framework) => (
                              <FormField
                                key={framework.id}
                                control={form.control}
                                name="frameworks.management"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={framework.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(framework.id)}
                                          onCheckedChange={(checked) => {
                                            const updatedValue = checked
                                              ? [...(field.value || []), framework.id]
                                              : (field.value || [])?.filter(
                                                  (value) => value !== framework.id
                                                );
                                            field.onChange(updatedValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {framework.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
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
                      name="frameworks.technology"
                      render={() => (
                        <FormItem>
                          <FormLabel>Technology Controls Frameworks</FormLabel>
                          <FormDescription className="mb-2">
                            Technical safeguards and security solutions
                          </FormDescription>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {technologyFrameworks.map((framework) => (
                              <FormField
                                key={framework.id}
                                control={form.control}
                                name="frameworks.technology"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={framework.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(framework.id)}
                                          onCheckedChange={(checked) => {
                                            const updatedValue = checked
                                              ? [...(field.value || []), framework.id]
                                              : (field.value || [])?.filter(
                                                  (value) => value !== framework.id
                                                );
                                            field.onChange(updatedValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {framework.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
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
                      name="frameworks.people"
                      render={() => (
                        <FormItem>
                          <FormLabel>People Controls Frameworks</FormLabel>
                          <FormDescription className="mb-2">
                            Human resource and awareness frameworks
                          </FormDescription>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {peopleFrameworks.map((framework) => (
                              <FormField
                                key={framework.id}
                                control={form.control}
                                name="frameworks.people"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={framework.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(framework.id)}
                                          onCheckedChange={(checked) => {
                                            const updatedValue = checked
                                              ? [...(field.value || []), framework.id]
                                              : (field.value || [])?.filter(
                                                  (value) => value !== framework.id
                                                );
                                            field.onChange(updatedValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {framework.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          {form.watch('industry') === 'healthcare' && (
                            <FormDescription className="mt-4 text-amber-500">
                              Note: For healthcare organizations, user awareness training and role-based certifications are critical for maintaining HIPAA compliance and reducing human-factor risks.
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormDescription className="mt-6 mb-4">
                      <strong>Framework Coverage by Security Control Domain</strong>
                    </FormDescription>
                    <div className="overflow-x-auto mb-4">
                      <table className="w-full min-w-[600px] border-collapse">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-800">
                            <th className="border border-slate-300 dark:border-slate-700 p-2 text-left">Framework</th>
                            <th className="border border-slate-300 dark:border-slate-700 p-2 text-center">Operations</th>
                            <th className="border border-slate-300 dark:border-slate-700 p-2 text-center">Management</th>
                            <th className="border border-slate-300 dark:border-slate-700 p-2 text-center">Technology</th>
                            <th className="border border-slate-300 dark:border-slate-700 p-2 text-center">People</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          <tr>
                            <td className="border border-slate-300 dark:border-slate-700 p-2">NIST CSF</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✓</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✓</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✓</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✗</td>
                          </tr>
                          <tr>
                            <td className="border border-slate-300 dark:border-slate-700 p-2">CIS CSC</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✓</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✓</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✓</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✗</td>
                          </tr>
                          <tr>
                            <td className="border border-slate-300 dark:border-slate-700 p-2">HIPAA</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✓</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✓</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✗</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✓✗</td>
                          </tr>
                          <tr>
                            <td className="border border-slate-300 dark:border-slate-700 p-2">ISO/IEC 27001</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✓</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✓</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✗</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✗</td>
                          </tr>
                          <tr>
                            <td className="border border-slate-300 dark:border-slate-700 p-2">HITRUST CSF</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✓</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✓</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✓</td>
                            <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">✓</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <FormDescription className="text-sm text-slate-500 mb-4">
                      <strong>Legend:</strong> ✓ = Explicit coverage | ✗ = Minimal/implied coverage | ✓✗ = Partial coverage
                    </FormDescription>
                    <FormDescription className="text-sm text-amber-500">
                      When selecting frameworks, consider your organization's security needs across all four domains. Our assessment will guide you through recommended framework adoption based on your specific requirements.
                    </FormDescription>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">OS / System Hardening</h3>
                  <FormDescription className="mb-4">
                    System hardening is critical for protecting applications and systems. These practices help secure operating systems and configure them properly.
                  </FormDescription>
                  
                  <div className="mb-6">
                    <FormField
                      control={form.control}
                      name="configurationManagement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Configuration Management Approach</FormLabel>
                          <FormDescription className="mb-2">
                            How does your organization manage and maintain secure configurations across systems?
                          </FormDescription>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select configuration management approach" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="manual">Manual Configuration Management</SelectItem>
                              <SelectItem value="automated-partial">Partially Automated Configuration Management</SelectItem>
                              <SelectItem value="automated-full">Fully Automated Configuration Management</SelectItem>
                              <SelectItem value="dcb">Desired Configuration Baseline (DCB)</SelectItem>
                              <SelectItem value="cmmc">CMMC Configuration Management</SelectItem>
                              <SelectItem value="hitrust">HITRUST Configuration Management</SelectItem>
                              <SelectItem value="none">No Formal Configuration Management</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            An effective configuration management process ensures consistent application of security settings across all systems.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <FormField
                        control={form.control}
                        name="osHardening.stig"
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
                                STIG (Security Technical Implementation Guides)
                              </FormLabel>
                              <FormDescription>
                                Standard security configurations for different operating systems
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="osHardening.scap"
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
                                SCAP (Security Content Automation Protocol)
                              </FormLabel>
                              <FormDescription>
                                Automated vulnerability checking and policy compliance
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <FormLabel className="mb-3 block">CIS Benchmarks</FormLabel>
                      <FormDescription className="mb-3">
                        The Center for Internet Security (CIS) provides secure configuration guidelines.
                        Select the benchmarks applicable to your organization:
                      </FormDescription>
                      <FormField
                        control={form.control}
                        name="cisBenchmarks"
                        render={({ field }) => (
                          <FormItem>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                { id: "cis-windows", label: "CIS Windows Benchmark" },
                                { id: "cis-linux", label: "CIS Linux Benchmark" },
                                { id: "cis-macos", label: "CIS macOS Benchmark" },
                                { id: "cis-cloud", label: "CIS Cloud Infrastructure Benchmark" },
                                { id: "cis-aws", label: "CIS AWS Benchmark" },
                                { id: "cis-azure", label: "CIS Azure Benchmark" },
                                { id: "cis-gcp", label: "CIS Google Cloud Benchmark" },
                                { id: "cis-kubernetes", label: "CIS Kubernetes Benchmark" },
                                { id: "cis-docker", label: "CIS Docker Benchmark" },
                                { id: "cis-hipaa", label: "CIS HIPAA Benchmark" },
                              ].map((option) => (
                                <FormField
                                  key={option.id}
                                  control={form.control}
                                  name="cisBenchmarks"
                                  render={({ field }) => (
                                    <FormItem
                                      key={option.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), option.id])
                                              : field.onChange(
                                                  (field.value || []).filter(
                                                    (value) => value !== option.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                            <FormDescription className="mt-4 text-amber-500">
                              Note: Organizations with compliance requirements should consider industry-specific CIS Benchmarks relevant to their operations.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Compliance Tab */}
              <TabsContent value="compliance" className="space-y-6">
                <div className="border rounded-md p-4 mb-6">
                  <h3 className="font-medium mb-4">Compliance Requirements</h3>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="complianceRequirements.frameworks"
                      render={() => (
                        <FormItem>
                          <FormLabel>Security Frameworks</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {complianceFrameworkOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="complianceRequirements.frameworks"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.id)}
                                          onCheckedChange={(checked) => {
                                            const updatedValue = checked
                                              ? [...(field.value || []), option.id]
                                              : (field.value || [])?.filter(
                                                  (value) => value !== option.id
                                                );
                                            field.onChange(updatedValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
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
                      name="complianceRequirements.standards"
                      render={() => (
                        <FormItem>
                          <FormLabel>Standards</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {standardsOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="complianceRequirements.standards"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.id)}
                                          onCheckedChange={(checked) => {
                                            const updatedValue = checked
                                              ? [...(field.value || []), option.id]
                                              : (field.value || [])?.filter(
                                                  (value) => value !== option.id
                                                );
                                            field.onChange(updatedValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
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
                      name="complianceRequirements.compliance"
                      render={() => (
                        <FormItem>
                          <FormLabel>Compliance</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {complianceOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="complianceRequirements.compliance"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.id)}
                                          onCheckedChange={(checked) => {
                                            const updatedValue = checked
                                              ? [...(field.value || []), option.id]
                                              : (field.value || [])?.filter(
                                                  (value) => value !== option.id
                                                );
                                            field.onChange(updatedValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
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
                      name="complianceRequirements.regulations"
                      render={() => (
                        <FormItem>
                          <FormLabel>Regulations</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {regulationOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="complianceRequirements.regulations"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.id)}
                                          onCheckedChange={(checked) => {
                                            const updatedValue = checked
                                              ? [...(field.value || []), option.id]
                                              : (field.value || [])?.filter(
                                                  (value) => value !== option.id
                                                );
                                            field.onChange(updatedValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Policy Documents</h3>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="policyDocuments.policies"
                      render={() => (
                        <FormItem>
                          <FormLabel>Policies</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {policyOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="policyDocuments.policies"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.id)}
                                          onCheckedChange={(checked) => {
                                            const updatedValue = checked
                                              ? [...(field.value || []), option.id]
                                              : (field.value || [])?.filter(
                                                  (value) => value !== option.id
                                                );
                                            field.onChange(updatedValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
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
                      name="policyDocuments.procedures"
                      render={() => (
                        <FormItem>
                          <FormLabel>Procedures</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {procedureOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="policyDocuments.procedures"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.id)}
                                          onCheckedChange={(checked) => {
                                            const updatedValue = checked
                                              ? [...(field.value || []), option.id]
                                              : (field.value || [])?.filter(
                                                  (value) => value !== option.id
                                                );
                                            field.onChange(updatedValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
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
                      name="policyDocuments.plans"
                      render={() => (
                        <FormItem>
                          <FormLabel>Plans</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {planOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="policyDocuments.plans"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.id)}
                                          onCheckedChange={(checked) => {
                                            const updatedValue = checked
                                              ? [...(field.value || []), option.id]
                                              : (field.value || [])?.filter(
                                                  (value) => value !== option.id
                                                );
                                            field.onChange(updatedValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
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
                      name="policyDocuments.guides"
                      render={() => (
                        <FormItem>
                          <FormLabel>Guides</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {guideOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="policyDocuments.guides"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.id)}
                                          onCheckedChange={(checked) => {
                                            const updatedValue = checked
                                              ? [...(field.value || []), option.id]
                                              : (field.value || [])?.filter(
                                                  (value) => value !== option.id
                                                );
                                            field.onChange(updatedValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Regulatory Requirements Tab - Using External Component */}
              <TabsContent value="regulatory" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Regulatory Requirements</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select all regulatory requirements applicable to your organization.
                  </p>
                  
                  <RegulatoryContent form={form} />
                </div>
              </TabsContent>
              
              {/* Standards & Guidelines Tab */}
              <TabsContent value="standards" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Standards & Guidelines</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the standards and guidelines relevant to your organization.
                  </p>
                              <FormField
                                control={form.control}
                                name="regulatoryRequirements"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes("gdpr")}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), "gdpr"]
                                            : (field.value || [])?.filter(
                                                (value) => value !== "gdpr"
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-medium">GDPR (EU)</FormLabel>
                                      <FormDescription>
                                        General Data Protection Regulation
                                        <div className="mt-2 text-xs">
                                          <span className="block"><strong>Applies to:</strong> Any organization processing EU residents' data</span>
                                          <span className="block"><strong>Penalties:</strong> Up to 4% global revenue or €20M</span>
                                        </div>
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="regulatoryRequirements"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes("ccpa")}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), "ccpa"]
                                            : (field.value || [])?.filter(
                                                (value) => value !== "ccpa"
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-medium">CCPA/CPRA (California)</FormLabel>
                                      <FormDescription>
                                        California Consumer Privacy Act
                                        <div className="mt-2 text-xs">
                                          <span className="block"><strong>Applies to:</strong> Businesses in California meeting certain thresholds</span>
                                        </div>
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="regulatoryRequirements"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes("pipeda")}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), "pipeda"]
                                            : (field.value || [])?.filter(
                                                (value) => value !== "pipeda"
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-medium">PIPEDA (Canada)</FormLabel>
                                      <FormDescription>
                                        Personal Information Protection and Electronic Documents Act
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          
                          {/* Healthcare Specific */}
                          <div>
                            <h4 className="font-medium text-lg border-b pb-2 mb-4 text-blue-600">Healthcare-Specific Regulations</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="regulatoryRequirements"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-blue-50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes("hipaa")}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), "hipaa"]
                                            : (field.value || [])?.filter(
                                                (value) => value !== "hipaa"
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-medium">HIPAA (USA)</FormLabel>
                                      <FormDescription>
                                        Health Insurance Portability and Accountability Act
                                        <div className="mt-2 text-xs">
                                          <span className="block"><strong>Key requirements:</strong> Security Rule, Privacy Rule, Breach Notification</span>
                                        </div>
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="regulatoryRequirements"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-blue-50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes("hitech")}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), "hitech"]
                                            : (field.value || [])?.filter(
                                                (value) => value !== "hitech"
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-medium">HITECH (USA)</FormLabel>
                                      <FormDescription>
                                        Health Information Technology for Economic and Clinical Health Act
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="regulatoryRequirements"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-blue-50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes("21cfr11")}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), "21cfr11"]
                                            : (field.value || [])?.filter(
                                                (value) => value !== "21cfr11"
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-medium">21 CFR Part 11 (FDA)</FormLabel>
                                      <FormDescription>
                                        Electronic records/signatures for FDA-regulated products
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="regulatoryRequirements"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-blue-50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes("mdr")}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), "mdr"]
                                            : (field.value || [])?.filter(
                                                (value) => value !== "mdr"
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-medium">Medical Device Regulation (EU)</FormLabel>
                                      <FormDescription>
                                        Cybersecurity for medical devices in EU
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          
                          {/* Financial & Payment */}
                          <div>
                            <h4 className="font-medium text-lg border-b pb-2 mb-4">Financial & Payment Regulations</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="regulatoryRequirements"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes("pci-dss")}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), "pci-dss"]
                                            : (field.value || [])?.filter(
                                                (value) => value !== "pci-dss"
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-medium">PCI-DSS</FormLabel>
                                      <FormDescription>
                                        Payment Card Industry Data Security Standard
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="regulatoryRequirements"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes("glba")}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), "glba"]
                                            : (field.value || [])?.filter(
                                                (value) => value !== "glba"
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-medium">GLBA (USA)</FormLabel>
                                      <FormDescription>
                                        Gramm-Leach-Bliley Act
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          
                          {/* Government & Critical Infrastructure */}
                          <div>
                            <h4 className="font-medium text-lg border-b pb-2 mb-4">Government & Critical Infrastructure</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="regulatoryRequirements"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes("cmmc")}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), "cmmc"]
                                            : (field.value || [])?.filter(
                                                (value) => value !== "cmmc"
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-medium">CMMC 2.0 (USA)</FormLabel>
                                      <FormDescription>
                                        Cybersecurity Maturity Model Certification
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="regulatoryRequirements"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes("nist-800-171")}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), "nist-800-171"]
                                            : (field.value || [])?.filter(
                                                (value) => value !== "nist-800-171"
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-medium">NIST SP 800-171</FormLabel>
                                      <FormDescription>
                                        Protection of CUI in non-federal systems
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          
                          {/* Emerging Regulations - with orange background */}
                          <div>
                            <h4 className="font-medium text-lg border-b pb-2 mb-4">Emerging Regulations</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="regulatoryRequirements"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-orange-50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes("dora")}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), "dora"]
                                            : (field.value || [])?.filter(
                                                (value) => value !== "dora"
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-medium">DORA (EU Digital Operational Resilience Act)</FormLabel>
                                      <FormDescription>
                                        Financial sector cyber resilience (2025)
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="regulatoryRequirements"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-orange-50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes("sec-cyber")}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), "sec-cyber"]
                                            : (field.value || [])?.filter(
                                                (value) => value !== "sec-cyber"
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-medium">SEC Cybersecurity Rules (USA)</FormLabel>
                                      <FormDescription>
                                        Incident disclosure in 8-K filings
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="regulatoryRequirements"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-orange-50">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes("china-dsl")}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), "china-dsl"]
                                            : (field.value || [])?.filter(
                                                (value) => value !== "china-dsl"
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-medium">China's DSL (Data Security Law)</FormLabel>
                                      <FormDescription>
                                        Data classification based on national importance
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <FormMessage className="mt-4" />
                        </div>
                      </div>
                    )}
                  />
                </div>
              </TabsContent>
              
              {/* Standards & Guidelines Tab */}
              <TabsContent value="standards" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Standards & Guidelines</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the standards and guidelines relevant to your organization.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="healthcare" className="space-y-4 pt-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Healthcare-Specific Regulations</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select regulations specific to healthcare organizations.
                  </p>
                </div>
              </TabsContent>
                        </div>
                        
                        {/* 21 CFR Part 11 */}
                        <div className="border p-4 rounded-md bg-blue-50 mb-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">21 CFR Part 11 (FDA - USA)</h5>
                              <p className="text-sm mt-1">Organizations using electronic records/signatures for FDA-regulated products</p>
                            </div>
                            <FormField
                              control={form.control}
                              name="regulatoryRequirements"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("21cfr11")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), "21cfr11"]
                                          : (field.value || [])?.filter(
                                              (value) => value !== "21cfr11"
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="mt-3 space-y-2">
                            <div className="flex gap-2">
                              <span className="font-medium text-sm">Requirements:</span>
                              <span className="text-sm">Audit trails, electronic signatures for medical devices</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* MDR */}
                        <div className="border p-4 rounded-md bg-blue-50 mb-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">Medical Device Regulation (MDR - EU)</h5>
                              <p className="text-sm mt-1">Medical device manufacturers selling in EU</p>
                            </div>
                            <FormField
                              control={form.control}
                              name="regulatoryRequirements"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("mdr")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), "mdr"]
                                          : (field.value || [])?.filter(
                                              (value) => value !== "mdr"
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="mt-3">
                            <div className="flex gap-2">
                              <span className="font-medium text-sm">Cybersecurity:</span>
                              <span className="text-sm">Secure by design for connected devices</span>
                            </div>
                          </div>
              
              {/* Financial Sector Tab */}
              <TabsContent value="financial" className="space-y-4 pt-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Financial Sector Regulations</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select regulations applicable to financial organizations.
                  </p>
                </div>
              </TabsContent>
                            <FormField
                              control={form.control}
                              name="regulatoryRequirements"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("psd2")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), "psd2"]
                                          : (field.value || [])?.filter(
                                              (value) => value !== "psd2"
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="mt-3">
                            <div className="flex gap-2">
                              <span className="font-medium text-sm">Strong Customer Authentication (SCA):</span>
                              <span className="text-sm">Multi-factor auth for payments</span>
                            </div>
                          </div>
              
              {/* Government & Critical Infrastructure Tab */}
              <TabsContent value="government" className="space-y-4 pt-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Government & Critical Infrastructure</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select regulations for government contractors and critical infrastructure.
                  </p>
                </div>
              </TabsContent>
              
              {/* Industry-specific Tab */}
              <TabsContent value="industry" className="space-y-4 pt-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Industry-Specific Regulations</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select regulations specific to your industry sector.
                  </p>
                </div>
              </TabsContent>
                            <FormField
                              control={form.control}
                              name="regulatoryRequirements"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("nerc-cip")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), "nerc-cip"]
                                          : (field.value || [])?.filter(
                                              (value) => value !== "nerc-cip"
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="mt-3">
                            <div className="flex gap-2">
                              <span className="font-medium text-sm">CIP-004:</span>
                              <span className="text-sm">Personnel training for critical systems</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* TISAX */}
                        <div className="border p-4 rounded-md bg-gray-50 mb-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">TISAX (Automotive - EU)</h5>
                              <p className="text-sm mt-1">Automotive manufacturers and suppliers</p>
                            </div>
                            <FormField
                              control={form.control}
                              name="regulatoryRequirements"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("tisax")}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), "tisax"]
                                          : (field.value || [])?.filter(
                                              (value) => value !== "tisax"
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="mt-3">
                            <div className="flex gap-2">
                              <span className="font-medium text-sm">Requirements:</span>
                              <span className="text-sm">Secure prototype data, supply chain audits</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                  
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Emerging Regulations</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select any upcoming regulations that may impact your organization in the near future.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {/* DORA */}
                    <div className="border p-4 rounded-md bg-orange-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">DORA (EU Digital Operational Resilience Act)</h5>
                          <p className="text-sm mt-1">Financial sector organizations in EU</p>
                        </div>
                        <FormField
                          control={form.control}
                          name="regulatoryRequirements"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("dora")}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), "dora"]
                                      : (field.value || [])?.filter(
                                          (value) => value !== "dora"
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="mt-3">
                        <div className="flex gap-2">
                          <span className="font-medium text-sm">Requirements:</span>
                          <span className="text-sm">Financial sector cyber resilience testing (2025 enforcement)</span>
                        </div>
                      </div>
                    </div>

                    {/* SEC Cybersecurity Rules */}
                    <div className="border p-4 rounded-md bg-orange-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">SEC Cybersecurity Rules (USA - 2023)</h5>
                          <p className="text-sm mt-1">Public companies</p>
                        </div>
                        <FormField
                          control={form.control}
                          name="regulatoryRequirements"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("sec-cyber")}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), "sec-cyber"]
                                      : (field.value || [])?.filter(
                                          (value) => value !== "sec-cyber"
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="mt-3">
                        <div className="flex gap-2">
                          <span className="font-medium text-sm">Requirements:</span>
                          <span className="text-sm">Public companies must disclose incidents in 8-K filings</span>
                        </div>
                      </div>
                    </div>

                    {/* China's DSL */}
                    <div className="border p-4 rounded-md bg-orange-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">China's DSL (Data Security Law)</h5>
                          <p className="text-sm mt-1">Organizations operating in China</p>
                        </div>
                        <FormField
                          control={form.control}
                          name="regulatoryRequirements"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("china-dsl")}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), "china-dsl"]
                                      : (field.value || [])?.filter(
                                          (value) => value !== "china-dsl"
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="mt-3">
                        <div className="flex gap-2">
                          <span className="font-medium text-sm">Requirements:</span>
                          <span className="text-sm">Data classification based on national importance</span>
                        </div>
                      </div>
                    </div>
                  </div>
                          <FormField
                            control={form.control}
                            name="regulatoryRequirements"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes("hipaa")}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), "hipaa"]
                                        : (field.value || [])?.filter(
                                            (value) => value !== "hipaa"
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>HIPAA</FormLabel>
                                  <FormDescription>
                                    Health Insurance Portability and Accountability Act
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="regulatoryRequirements"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes("hitech")}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), "hitech"]
                                        : (field.value || [])?.filter(
                                            (value) => value !== "hitech"
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>HITECH</FormLabel>
                                  <FormDescription>
                                    Health Information Technology for Economic and Clinical Health Act
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="regulatoryRequirements"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes("gdpr")}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), "gdpr"]
                                        : (field.value || [])?.filter(
                                            (value) => value !== "gdpr"
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>GDPR</FormLabel>
                                  <FormDescription>
                                    General Data Protection Regulation
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="regulatoryRequirements"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes("ccpa")}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), "ccpa"]
                                        : (field.value || [])?.filter(
                                            (value) => value !== "ccpa"
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>CCPA</FormLabel>
                                  <FormDescription>
                                    California Consumer Privacy Act
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              {/* Standards Tab */}
              <TabsContent value="standards" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Standards & Guidelines Library</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select from our comprehensive library of standards (mandatory) and guidelines (voluntary recommendations) that apply to your organization.
                  </p>
                  
                  <Tabs defaultValue="universal" className="w-full">
                    <TabsList className="grid w-full grid-cols-7">
                      <TabsTrigger value="universal">Universal Security</TabsTrigger>
                      <TabsTrigger value="healthcare" className="bg-blue-50">Healthcare-specific</TabsTrigger>
                      <TabsTrigger value="financial">Financial & Payment</TabsTrigger>
                      <TabsTrigger value="privacy">Cloud & Data Privacy</TabsTrigger>
                      <TabsTrigger value="government">Government & Critical Infrastructure</TabsTrigger>
                      <TabsTrigger value="regional">Emerging & Regional</TabsTrigger>
                      <TabsTrigger value="industry">Industry-specific</TabsTrigger>
                    </TabsList>
                    
                    {/* Regional Standards & Guidelines Tab */}
                    <TabsContent value="regional" className="space-y-4 pt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span className="text-sm font-medium">Standards (Mandatory)</span>
                        <div className="h-3 w-3 rounded-full bg-secondary ml-4"></div>
                        <span className="text-sm font-medium">Guidelines (Voluntary)</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <h4 className="font-medium">Emerging & Regional Standards</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Loop through regional standards */}
                          {standardsAndGuidelinesLibrary.regional.map((standard) => (
                            <FormField
                              key={standard.id}
                              control={form.control}
                              name="healthcareStandards"
                              render={({ field }) => (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-primary/5"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(standard.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), standard.id]
                                          : (field.value || [])?.filter(
                                              (value) => value !== standard.id
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">{standard.name}</FormLabel>
                                    <FormDescription>
                                      {standard.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        
                        <h4 className="font-medium mt-4">Regional Guidelines</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Loop through regional guidelines */}
                          {standardsAndGuidelinesLibrary.regionalGuidelines.map((guideline) => (
                            <FormField
                              key={guideline.id}
                              control={form.control}
                              name="healthcareStandards"
                              render={({ field }) => (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-secondary/5"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(guideline.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), guideline.id]
                                          : (field.value || [])?.filter(
                                              (value) => value !== guideline.id
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">{guideline.name}</FormLabel>
                                    <FormDescription>
                                      {guideline.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Universal Standards & Guidelines Tab */}
                    <TabsContent value="universal" className="space-y-4 pt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span className="text-sm font-medium">Standards (Mandatory)</span>
                        <div className="h-3 w-3 rounded-full bg-secondary ml-4"></div>
                        <span className="text-sm font-medium">Guidelines (Voluntary)</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <h4 className="font-medium">Universal Standards</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Loop through universal standards */}
                          {standardsAndGuidelinesLibrary.universal.map((standard) => (
                            <FormField
                              key={standard.id}
                              control={form.control}
                              name="healthcareStandards"
                              render={({ field }) => (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-primary/5"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(standard.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), standard.id]
                                          : (field.value || [])?.filter(
                                              (value) => value !== standard.id
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">{standard.name}</FormLabel>
                                    <FormDescription>
                                      {standard.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        
                        <h4 className="font-medium mt-4">Universal Guidelines</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Loop through universal guidelines */}
                          {standardsAndGuidelinesLibrary.universalGuidelines.map((guideline) => (
                            <FormField
                              key={guideline.id}
                              control={form.control}
                              name="healthcareStandards"
                              render={({ field }) => (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-secondary/5"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(guideline.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), guideline.id]
                                          : (field.value || [])?.filter(
                                              (value) => value !== guideline.id
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">{guideline.name}</FormLabel>
                                    <FormDescription>
                                      {guideline.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Healthcare-specific Standards & Guidelines Tab */}
                    <TabsContent value="healthcare" className="space-y-4 pt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span className="text-sm font-medium">Standards (Mandatory)</span>
                        <div className="h-3 w-3 rounded-full bg-secondary ml-4"></div>
                        <span className="text-sm font-medium">Guidelines (Voluntary)</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <h4 className="font-medium">Healthcare-specific Standards</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Loop through healthcare standards */}
                          {standardsAndGuidelinesLibrary.healthcare.map((standard) => (
                            <FormField
                              key={standard.id}
                              control={form.control}
                              name="healthcareStandards"
                              render={({ field }) => (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-primary/5"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(standard.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), standard.id]
                                          : (field.value || [])?.filter(
                                              (value) => value !== standard.id
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">{standard.name}</FormLabel>
                                    <FormDescription>
                                      {standard.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        
                        <h4 className="font-medium mt-4">Healthcare-specific Guidelines</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Loop through healthcare guidelines */}
                          {standardsAndGuidelinesLibrary.healthcareGuidelines.map((guideline) => (
                            <FormField
                              key={guideline.id}
                              control={form.control}
                              name="healthcareStandards"
                              render={({ field }) => (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-secondary/5"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(guideline.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), guideline.id]
                                          : (field.value || [])?.filter(
                                              (value) => value !== guideline.id
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">{guideline.name}</FormLabel>
                                    <FormDescription>
                                      {guideline.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Financial & Payment Standards & Guidelines Tab */}
                    <TabsContent value="financial" className="space-y-4 pt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span className="text-sm font-medium">Standards (Mandatory)</span>
                        <div className="h-3 w-3 rounded-full bg-secondary ml-4"></div>
                        <span className="text-sm font-medium">Guidelines (Voluntary)</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <h4 className="font-medium">Financial & Payment Standards</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Loop through financial standards */}
                          {standardsAndGuidelinesLibrary.financial.map((standard) => (
                            <FormField
                              key={standard.id}
                              control={form.control}
                              name="healthcareStandards"
                              render={({ field }) => (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-primary/5"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(standard.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), standard.id]
                                          : (field.value || [])?.filter(
                                              (value) => value !== standard.id
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">{standard.name}</FormLabel>
                                    <FormDescription>
                                      {standard.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        
                        <h4 className="font-medium mt-4">Financial & Payment Guidelines</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Loop through operational guidelines since there are no specific financial guidelines */}
                          {standardsAndGuidelinesLibrary.operationalGuidelines.map((guideline) => (
                            <FormField
                              key={guideline.id}
                              control={form.control}
                              name="healthcareStandards"
                              render={({ field }) => (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-secondary/5"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(guideline.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), guideline.id]
                                          : (field.value || [])?.filter(
                                              (value) => value !== guideline.id
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">{guideline.name}</FormLabel>
                                    <FormDescription>
                                      {guideline.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Cloud & Data Privacy Standards & Guidelines Tab */}
                    <TabsContent value="privacy" className="space-y-4 pt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span className="text-sm font-medium">Standards (Mandatory)</span>
                        <div className="h-3 w-3 rounded-full bg-secondary ml-4"></div>
                        <span className="text-sm font-medium">Guidelines (Voluntary)</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <h4 className="font-medium">Cloud & Data Privacy Standards</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Loop through privacy standards */}
                          {standardsAndGuidelinesLibrary.privacy.map((standard) => (
                            <FormField
                              key={standard.id}
                              control={form.control}
                              name="healthcareStandards"
                              render={({ field }) => (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-primary/5"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(standard.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), standard.id]
                                          : (field.value || [])?.filter(
                                              (value) => value !== standard.id
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">{standard.name}</FormLabel>
                                    <FormDescription>
                                      {standard.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        
                        <h4 className="font-medium mt-4">Cloud & Data Privacy Guidelines</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Loop through privacy guidelines */}
                          {standardsAndGuidelinesLibrary.privacyGuidelines.map((guideline) => (
                            <FormField
                              key={guideline.id}
                              control={form.control}
                              name="healthcareStandards"
                              render={({ field }) => (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-secondary/5"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(guideline.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), guideline.id]
                                          : (field.value || [])?.filter(
                                              (value) => value !== guideline.id
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">{guideline.name}</FormLabel>
                                    <FormDescription>
                                      {guideline.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                          
                          {/* Add cloud specific guidelines */}
                          {standardsAndGuidelinesLibrary.cloudGuidelines.map((guideline) => (
                            <FormField
                              key={guideline.id}
                              control={form.control}
                              name="healthcareStandards"
                              render={({ field }) => (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-secondary/5"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(guideline.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), guideline.id]
                                          : (field.value || [])?.filter(
                                              (value) => value !== guideline.id
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">{guideline.name}</FormLabel>
                                    <FormDescription>
                                      {guideline.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Government & Critical Infrastructure Standards & Guidelines Tab */}
                    <TabsContent value="government" className="space-y-4 pt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span className="text-sm font-medium">Standards (Mandatory)</span>
                        <div className="h-3 w-3 rounded-full bg-secondary ml-4"></div>
                        <span className="text-sm font-medium">Guidelines (Voluntary)</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <h4 className="font-medium">Government & Critical Infrastructure Standards</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Loop through government standards */}
                          {standardsAndGuidelinesLibrary.government.map((standard) => (
                            <FormField
                              key={standard.id}
                              control={form.control}
                              name="healthcareStandards"
                              render={({ field }) => (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-primary/5"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(standard.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), standard.id]
                                          : (field.value || [])?.filter(
                                              (value) => value !== standard.id
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">{standard.name}</FormLabel>
                                    <FormDescription>
                                      {standard.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        
                        <h4 className="font-medium mt-4">Government & Critical Infrastructure Guidelines</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Loop through government guidelines */}
                          {standardsAndGuidelinesLibrary.governmentGuidelines.map((guideline) => (
                            <FormField
                              key={guideline.id}
                              control={form.control}
                              name="healthcareStandards"
                              render={({ field }) => (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-secondary/5"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(guideline.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), guideline.id]
                                          : (field.value || [])?.filter(
                                              (value) => value !== guideline.id
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">{guideline.name}</FormLabel>
                                    <FormDescription>
                                      {guideline.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Industry-specific Standards & Guidelines Tab */}
                    <TabsContent value="industry" className="space-y-4 pt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span className="text-sm font-medium">Standards (Mandatory)</span>
                        <div className="h-3 w-3 rounded-full bg-secondary ml-4"></div>
                        <span className="text-sm font-medium">Guidelines (Voluntary)</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <h4 className="font-medium">Industry-specific Standards</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Loop through industry standards */}
                          {standardsAndGuidelinesLibrary.industry.map((standard) => (
                            <FormField
                              key={standard.id}
                              control={form.control}
                              name="healthcareStandards"
                              render={({ field }) => (
                                <FormItem
                                  className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-primary/5"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(standard.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...(field.value || []), standard.id]
                                          : (field.value || [])?.filter(
                                              (value) => value !== standard.id
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">{standard.name}</FormLabel>
                                    <FormDescription>
                                      {standard.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        
                        <h4 className="font-medium mt-4">Industry-specific Guidelines</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Industrial Control Systems Guidelines */}
                          <FormItem
                            className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-secondary/5"
                          >
                            <FormControl>
                              <Checkbox
                                checked={false}
                                onCheckedChange={(checked) => {
                                  // Implementation would be added here
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">IEC 62443 (Industrial Control Systems - ICS)</FormLabel>
                              <FormDescription>
                                Guide to ICS Security - Network segmentation, secure remote access, and ICS incident response.
                                Implement "zone and conduit" architectures per IEC 62443-3-3.
                              </FormDescription>
                            </div>
                          </FormItem>
                          
                          <FormItem
                            className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-secondary/5"
                          >
                            <FormControl>
                              <Checkbox
                                checked={false}
                                onCheckedChange={(checked) => {
                                  // Implementation would be added here
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">CISA ICS Defense-in-Depth Strategies</FormLabel>
                              <FormDescription>
                                Layered protections (physical, network, endpoint).
                                Deploy unidirectional gateways for OT/IT boundary protection.
                              </FormDescription>
                            </div>
                          </FormItem>
                          
                          <FormItem
                            className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-secondary/5"
                          >
                            <FormControl>
                              <Checkbox
                                checked={false}
                                onCheckedChange={(checked) => {
                                  // Implementation would be added here
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">ISA/IEC 62443 Cybersecurity Lifecycle Guide</FormLabel>
                              <FormDescription>
                                Secure development for ICS components (62443-4-1).
                                Apply secure coding practices to PLCs/RTUs.
                              </FormDescription>
                            </div>
                          </FormItem>
                          
                          {/* Automotive Industry Guidelines */}
                          <FormItem
                            className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-secondary/5"
                          >
                            <FormControl>
                              <Checkbox
                                checked={false}
                                onCheckedChange={(checked) => {
                                  // Implementation would be added here
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">ENX TISAX Assessment Guide (Automotive)</FormLabel>
                              <FormDescription>
                                Prototype data protection, supplier audits.
                                Encrypt design files and restrict access via VDR (Virtual Data Rooms).
                              </FormDescription>
                            </div>
                          </FormItem>
                          
                          <FormItem
                            className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-secondary/5"
                          >
                            <FormControl>
                              <Checkbox
                                checked={false}
                                onCheckedChange={(checked) => {
                                  // Implementation would be added here
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">Auto-ISAC Best Practices for Vehicle Cybersecurity</FormLabel>
                              <FormDescription>
                                ECU hardening, OTA update security.
                                Code signing for firmware updates.
                              </FormDescription>
                            </div>
                          </FormItem>
                          
                          <FormItem
                            className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-secondary/5"
                          >
                            <FormControl>
                              <Checkbox
                                checked={false}
                                onCheckedChange={(checked) => {
                                  // Implementation would be added here
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">ISO/SAE 21434 Practical Implementation Guide</FormLabel>
                              <FormDescription>
                                Threat modeling for connected vehicles.
                                Conduct TARA (Threat Analysis and Risk Assessment).
                              </FormDescription>
                            </div>
                          </FormItem>
                          
                          {/* Cryptographic Modules Guidelines */}
                          <FormItem
                            className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-secondary/5"
                          >
                            <FormControl>
                              <Checkbox
                                checked={false}
                                onCheckedChange={(checked) => {
                                  // Implementation would be added here
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">NIST CMVP Implementation Guidance (FIPS 140-2/3)</FormLabel>
                              <FormDescription>
                                Validating cryptographic modules (HSMs, TLS stacks).
                                Use FIPS-approved algorithms (AES-256, SHA-384).
                              </FormDescription>
                            </div>
                          </FormItem>
                          
                          <FormItem
                            className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-secondary/5"
                          >
                            <FormControl>
                              <Checkbox
                                checked={false}
                                onCheckedChange={(checked) => {
                                  // Implementation would be added here
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">CIS Cryptographic Benchmark</FormLabel>
                              <FormDescription>
                                Configuring FIPS-compliant OS/apps (e.g., Windows/Linux).
                                Enable FIPS mode in OS group policies.
                              </FormDescription>
                            </div>
                          </FormItem>
                          
                          <FormItem
                            className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md bg-secondary/5"
                          >
                            <FormControl>
                              <Checkbox
                                checked={false}
                                onCheckedChange={(checked) => {
                                  // Implementation would be added here
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">Cloud Security Alliance FIPS Guidance</FormLabel>
                              <FormDescription>
                                FIPS in cloud (AWS KMS, Azure Key Vault).
                                Use "FIPS-only" flags in cloud service configurations.
                              </FormDescription>
                            </div>
                          </FormItem>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>
              
              {/* Relevant ACQ Tools Tab */}
              <TabsContent value="questionnaires" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Relevant ACQ Tool (Assessment, Checklist, Questionnaire)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the assessment tools, checklists, and questionnaires relevant to your healthcare organization.
                  </p>
                  
                  {/* Assessments Section */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium mb-2">Assessments</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Comprehensive evaluation tools for security and compliance
                    </p>
                    
                    <FormField
                      control={form.control}
                      name="relevantACQTools.assessments"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {assessmentOptions.map((option) => (
                              <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), option.id]
                                        : (field.value || [])?.filter(
                                            (value) => value !== option.id
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>{option.label}</FormLabel>
                                </div>
                              </FormItem>
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Checklists Section */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium mb-2">Checklists</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Verification tools for regulatory and compliance requirements
                    </p>
                    
                    <FormField
                      control={form.control}
                      name="relevantACQTools.checklists"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {checklistOptions.map((option) => (
                              <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), option.id]
                                        : (field.value || [])?.filter(
                                            (value) => value !== option.id
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>{option.label}</FormLabel>
                                </div>
                              </FormItem>
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Questionnaires Section */}
                  <div>
                    <h4 className="text-md font-medium mb-2">Questionnaires</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Detailed information gathering tools for specific compliance needs
                    </p>
                    
                    <FormField
                      control={form.control}
                      name="relevantACQTools.questionnaires"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {questionnaireOptions.map((option) => (
                              <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), option.id]
                                        : (field.value || [])?.filter(
                                            (value) => value !== option.id
                                          );
                                      field.onChange(updatedValue);
                                      
                                      // Also update backward compatibility field if needed
                                      const relevantQuestionnaires = form.getValues("relevantQuestionnaires") || [];
                                      if (checked && !relevantQuestionnaires.includes(option.id)) {
                                        form.setValue("relevantQuestionnaires", [...relevantQuestionnaires, option.id]);
                                      } else if (!checked && relevantQuestionnaires.includes(option.id)) {
                                        form.setValue("relevantQuestionnaires", 
                                          relevantQuestionnaires.filter(value => value !== option.id)
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>{option.label}</FormLabel>
                                </div>
                              </FormItem>
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Adversarial Insight Tab */}
              <TabsContent value="adversarial" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Adversarial Insight (MITRE ATT&CK)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select threat actors and techniques most relevant to your university or educational institution.
                  </p>
                  
                  <FormField
                    control={form.control}
                    name="threatActors"
                    render={() => (
                      <FormItem>
                        <FormLabel>Threat Actors of Concern</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <FormField
                            control={form.control}
                            name="threatActors"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes("nation-state")}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), "nation-state"]
                                        : (field.value || [])?.filter(
                                            (value) => value !== "nation-state"
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Nation State Actors
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="threatActors"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes("ransomware")}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), "ransomware"]
                                        : (field.value || [])?.filter(
                                            (value) => value !== "ransomware"
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Ransomware Groups
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              {/* Information Security Management System (ISMS) Tab */}
              <TabsContent value="isms" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Information Security Management System (ISMS)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Provide information about your current Information Security Management System (ISMS) implementation.
                  </p>
                  
                  <FormField
                    control={form.control}
                    name="ismsImplementation"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel>Information Security Management System Implementation Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Information Security Management System implementation status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No formal Information Security Management System</SelectItem>
                            <SelectItem value="planning">Planning phase</SelectItem>
                            <SelectItem value="implementing">Currently implementing</SelectItem>
                            <SelectItem value="operational">Operational but not certified</SelectItem>
                            <SelectItem value="certified">ISO 27001 certified</SelectItem>
                            <SelectItem value="hipaa">HIPAA compliant</SelectItem>
                            <SelectItem value="hitrust">HITRUST certified</SelectItem>
                            <SelectItem value="other">Other framework</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-6">
                    <h4 className="font-medium">Information Security Management System Components (4Ps)</h4>
                    <FormDescription className="mb-4">
                      Information Security Management System (ISMS) is composed of four key components: Policies, Plans, Procedures, and Processes. Select which components you have implemented.
                      <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
                        <span className="font-semibold text-amber-700">University Security Note:</span> Educational institutions should focus on components that address student data protection, research integrity, campus safety, and compliance with educational regulations like FERPA.
                      </div>
                    </FormDescription>
                    
                    <FormField
                      control={form.control}
                      name="ismsPolicies"
                      render={() => (
                        <FormItem>
                          <FormLabel>Policies</FormLabel>
                          <FormDescription className="mb-2">
                            Formal documents that define your organization's security objectives, principles, and rules
                          </FormDescription>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {[
                              { id: "information-security-policy", label: "Information Security Policy" },
                              { id: "acceptable-use-policy", label: "Acceptable Use Policy" },
                              { id: "access-control-policy", label: "Access Control Policy" },
                              { id: "password-policy", label: "Password Policy" },
                              { id: "data-classification-policy", label: "Data Classification Policy" },
                              { id: "encryption-policy", label: "Encryption Policy" },
                              { id: "remote-work-policy", label: "Remote Work Policy" },
                              { id: "incident-response-policy", label: "Incident Response Policy" },
                              { id: "business-continuity-policy", label: "Business Continuity Policy" },
                              { id: "vendor-risk-management-policy", label: "Vendor Risk Management Policy" },
                              { id: "ferpa-privacy-policy", label: "FERPA Privacy Policy" },
                              { id: "research-data-security-policy", label: "Research Data Security Policy" },
                              { id: "student-data-handling-policy", label: "Student Data Handling Policy" },
                            ].map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="ismsPolicies"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), option.id]
                                            : (field.value || [])?.filter(
                                                (value) => value !== option.id
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ismsPlans"
                      render={() => (
                        <FormItem>
                          <FormLabel>Plans</FormLabel>
                          <FormDescription className="mb-2">
                            Strategic documents that outline how security objectives will be achieved over time
                          </FormDescription>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {[
                              { id: "risk-treatment-plan", label: "Risk Treatment Plan" },
                              { id: "disaster-recovery-plan", label: "Disaster Recovery Plan" },
                              { id: "business-continuity-plan", label: "Business Continuity Plan" },
                              { id: "security-awareness-training-plan", label: "Security Awareness Training Plan" },
                              { id: "vulnerability-management-plan", label: "Vulnerability Management Plan" },
                              { id: "compliance-monitoring-plan", label: "Compliance Monitoring Plan" },
                              { id: "network-security-plan", label: "Network Security Plan" },
                              { id: "cloud-security-plan", label: "Cloud Security Plan" },
                              { id: "physical-security-plan", label: "Physical Security Plan" },
                              { id: "third-party-audit-plan", label: "Third-Party Audit Plan" },
                              { id: "student-data-breach-response-plan", label: "Student Data Breach Response Plan" },
                              { id: "campus-security-plan", label: "Campus Security Plan" },
                            ].map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="ismsPlans"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), option.id]
                                            : (field.value || [])?.filter(
                                                (value) => value !== option.id
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ismsProcedures"
                      render={() => (
                        <FormItem>
                          <FormLabel>Procedures</FormLabel>
                          <FormDescription className="mb-2">
                            Step-by-step instructions for performing security-related tasks and activities
                          </FormDescription>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {[
                              { id: "user-access-provisioning-procedure", label: "User Access Provisioning Procedure" },
                              { id: "privileged-access-management-procedure", label: "Privileged Access Management (PAM) Procedure" },
                              { id: "patch-management-procedure", label: "Patch Management Procedure" },
                              { id: "backup-restoration-procedure", label: "Backup & Recovery Procedure" },
                              { id: "incident-reporting-procedure", label: "Incident Reporting/Escalation Procedure" },
                              { id: "forensic-data-collection-procedure", label: "Forensic Data Collection Procedure" },
                              { id: "secure-disposal-procedure", label: "Secure Disposal of Media Procedure" },
                              { id: "risk-assessment-methodology-procedure", label: "Risk Assessment Methodology Procedure" },
                              { id: "change-management-procedure", label: "Change Management Procedure" },
                              { id: "audit-log-review-procedure", label: "Audit Log Review Procedure" },
                              { id: "phi-access-procedure", label: "PHI Access Procedure" },
                              { id: "hipaa-audit-procedure", label: "HIPAA Audit Procedure" },
                              { id: "patient-data-transfer-procedure", label: "Patient Data Transfer Procedure" },
                            ].map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="ismsProcedures"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), option.id]
                                            : (field.value || [])?.filter(
                                                (value) => value !== option.id
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ismsProcesses"
                      render={() => (
                        <FormItem>
                          <FormLabel>Processes</FormLabel>
                          <FormDescription className="mb-2">
                            Ongoing activities and workflows that maintain and improve security operations
                          </FormDescription>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {[
                              { id: "continuous-monitoring-process", label: "Continuous Monitoring Process" },
                              { id: "security-incident-response-process", label: "Security Incident Response Process" },
                              { id: "access-review-process", label: "Access Review Process" },
                              { id: "configuration-management-process", label: "Configuration Management Process" },
                              { id: "penetration-testing-process", label: "Penetration Testing Process" },
                              { id: "data-leakage-prevention-process", label: "Data Leakage Prevention Process" },
                              { id: "threat-intelligence-gathering-process", label: "Threat Intelligence Gathering Process" },
                              { id: "security-policy-exception-process", label: "Security Policy Exception Process" },
                              { id: "asset-inventory-management-process", label: "Asset Inventory Management Process" },
                              { id: "compliance-gap-remediation-process", label: "Compliance Gap Remediation Process" },
                              { id: "hipaa-compliance-monitoring", label: "HIPAA Compliance Monitoring" },
                              { id: "healthcare-security-review", label: "Healthcare Security Review Process" },
                            ].map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="ismsProcesses"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), option.id]
                                            : (field.value || [])?.filter(
                                                (value) => value !== option.id
                                              );
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Contact & Confirmation Tab */}
              <TabsContent value="contact" className="space-y-6">
                <div className="border rounded-md p-4 mb-6">
                  <h3 className="font-medium mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="contactInfo.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactInfo.pointOfContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role / Point of Contact</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g., IT Manager, Security Officer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactInfo.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox 
                        id="same-as-contact" 
                        onCheckedChange={(checked) => {
                          form.setValue("contactInfo.sameAsContact", checked === true);
                          handleSameAsContactChange(checked === true);
                        }}
                      />
                      <label
                        htmlFor="same-as-contact"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Use same email as above for contact email
                      </label>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="contactInfo.contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email (for assessment communications)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter contact email address" 
                              {...field} 
                              disabled={form.watch("contactInfo.sameAsContact")}
                            />
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
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="border rounded-md p-4 mb-6">
                  <h3 className="font-medium mb-4">Assessment Details</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="reportType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Assessment Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-start space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="preliminary" className="mt-1" />
                                </FormControl>
                                <div className="space-y-1">
                                  <FormLabel className="font-medium">Preliminary Assessment</FormLabel>
                                  <p className="text-sm text-muted-foreground">
                                    Qualitative assessment focusing on expert opinions and observational analysis 
                                    to identify security gaps based on industry best practices. Includes immediate 
                                    mitigation recommendations.
                                  </p>
                                </div>
                              </FormItem>
                              <FormItem className="flex items-start space-x-3 space-y-0 mt-4">
                                <FormControl>
                                  <RadioGroupItem value="comprehensive" className="mt-1" />
                                </FormControl>
                                <div className="space-y-1">
                                  <FormLabel className="font-medium">Comprehensive Assessment</FormLabel>
                                  <p className="text-sm text-muted-foreground">
                                    Quantitative assessment requiring 6 months of evidence collection following 
                                    the preliminary assessment. Tracks all observable events in your network, 
                                    infrastructure, and applications to measure improvement and compliance.
                                    Includes detailed security maturity metrics and RASBITA scoring.
                                  </p>
                                </div>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Confirmation</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="availabilityConfirmation"
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
                              I confirm my availability for a follow-up interview to populate the assessment matrix
                            </FormLabel>
                            <FormDescription>
                              This is required to complete the SOS²A assessment process
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="referralPermission"
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
                              I give permission to use this assessment for referral purposes
                            </FormLabel>
                            <FormDescription>
                              Your information will be anonymized if used for referrals
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <Button type="submit" className="w-full">
              Submit Questionnaire
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}