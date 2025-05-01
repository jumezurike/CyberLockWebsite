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
  
  // 8. Relevant Questionnaires
  relevantQuestionnaires: z.array(z.string()).optional(),
  
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
      relevantQuestionnaires: [],
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
            <div>7. Standards</div>
            <div>8. Relevant Questionnaires</div>
            <div>9. Adversarial Insight</div>
            <div>10. ISMS</div>
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
                <TabsTrigger value="security" className="flex-shrink-0">4. Security Control Framework</TabsTrigger>
                <TabsTrigger value="compliance" className="flex-shrink-0">5. Compliance</TabsTrigger>
                <TabsTrigger value="regulatory" className="flex-shrink-0">6. Regulatory Requirements</TabsTrigger>
                <TabsTrigger value="standards" className="flex-shrink-0">7. Standards</TabsTrigger>
                <TabsTrigger value="questionnaires" className="flex-shrink-0">8. Relevant Questionnaires</TabsTrigger>
                <TabsTrigger value="adversarial" className="flex-shrink-0">9. Adversarial Insight</TabsTrigger>
                <TabsTrigger value="isms" className="flex-shrink-0">10. ISMS</TabsTrigger>
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
                
                <FormField
                  control={form.control}
                  name="securityMeasures"
                  render={() => (
                    <FormItem>
                      <FormLabel>Current Security Measures (select all that apply)</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="primaryConcerns"
                  render={() => (
                    <FormItem>
                      <FormLabel>Primary Security Concerns (select all that apply)</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
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
                  <h3 className="font-medium mb-4">OS/System Hardening</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select system hardening guidelines and benchmarks implemented in your healthcare organization.
                  </p>
                  
                  <div className="space-y-4">
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
                              DoD security configurations for operating systems
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
                          <FormLabel>CIS Benchmarks Implemented</FormLabel>
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
                                    CIS Microsoft Windows Benchmark
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
                                    CIS Linux/Unix Benchmark
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
                                    CIS Apple macOS Benchmark
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
                                    CIS Cloud Platform Benchmarks
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Security Control Framework Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="border rounded-md p-4 mb-6">
                  <h3 className="font-medium mb-4">Current Healthcare Security Measures</h3>
                  <FormField
                    control={form.control}
                    name="securityMeasures"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">
                            Select security measures currently implemented in your healthcare organization
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
                        <FormDescription className="mt-4 text-amber-500">
                          Note: For healthcare organizations, endpoint and device security, data encryption, and MFA are typically required for HIPAA compliance.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="border rounded-md p-4 mb-6">
                  <h3 className="font-medium mb-4">Healthcare Security Priorities</h3>
                  <FormField
                    control={form.control}
                    name="primaryConcerns"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">
                            Select your healthcare organization's primary security concerns
                          </FormLabel>
                          <FormDescription>
                            This helps us prioritize recommendations based on your most pressing concerns in the healthcare setting.
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
                        <FormDescription className="mt-4 text-amber-500">
                          Note: For healthcare organizations, data breach prevention and ransomware protection are critical concerns given the sensitive nature of PHI.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="border rounded-md p-4 mb-6">
                  <h3 className="font-medium mb-4">Healthcare Security Frameworks by Domain</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please select any security frameworks currently implemented or being considered in your healthcare organization.
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
                    <FormDescription className="mt-4 text-amber-500">
                      Note: Healthcare organizations should consider implementing NIST CSF aligned with HIPAA Security Rule requirements. Our assessment will guide you through recommended framework adoption based on your specific needs.
                    </FormDescription>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Healthcare System Hardening</h3>
                  <FormDescription className="mb-4">
                    System hardening is critical for protecting healthcare applications and patient data. These practices help secure operating systems hosting healthcare applications.
                  </FormDescription>
                  
                  <div className="mb-6">
                    <FormField
                      control={form.control}
                      name="configurationManagement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Configuration Management Approach</FormLabel>
                          <FormDescription className="mb-2">
                            How does your organization manage and maintain secure configurations across healthcare systems?
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
                            An effective configuration management process ensures consistent application of security settings across all healthcare systems.
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
                                Standard security configurations for healthcare systems
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
                                Automated vulnerability checking for healthcare systems
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <FormLabel className="mb-3 block">CIS Benchmarks for Healthcare Systems</FormLabel>
                      <FormDescription className="mb-3">
                        The Center for Internet Security (CIS) provides secure configuration guidelines for healthcare systems.
                        Select the benchmarks applicable to your healthcare organization:
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
                              Note: For healthcare organizations, the CIS HIPAA Benchmark is recommended to help meet regulatory compliance requirements.
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
              
              {/* Regulatory Requirements Tab */}
              <TabsContent value="regulatory" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Regulatory Requirements</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select all healthcare regulatory requirements applicable to your organization.
                  </p>
                  
                  <FormField
                    control={form.control}
                    name="regulatoryRequirements"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
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
                  <h3 className="font-medium mb-4">Healthcare Security Standards</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select relevant healthcare security standards your organization follows or needs to implement.
                  </p>
                  
                  <FormField
                    control={form.control}
                    name="healthcareStandards"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <FormField
                            control={form.control}
                            name="healthcareStandards"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes("iso27001")}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), "iso27001"]
                                        : (field.value || [])?.filter(
                                            (value) => value !== "iso27001"
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>ISO 27001</FormLabel>
                                  <FormDescription>
                                    Information security management standard
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="healthcareStandards"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes("hitrust")}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), "hitrust"]
                                        : (field.value || [])?.filter(
                                            (value) => value !== "hitrust"
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>HITRUST CSF</FormLabel>
                                  <FormDescription>
                                    Health Information Trust Alliance Common Security Framework
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
              
              {/* Relevant Questionnaires Tab */}
              <TabsContent value="questionnaires" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Relevant Questionnaires</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select questionnaires that are applicable to your healthcare organization.
                  </p>
                  
                  <FormField
                    control={form.control}
                    name="relevantQuestionnaires"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <FormField
                            control={form.control}
                            name="relevantQuestionnaires"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes("sra")}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), "sra"]
                                        : (field.value || [])?.filter(
                                            (value) => value !== "sra"
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>HIPAA Security Risk Assessment (SRA)</FormLabel>
                                  <FormDescription>
                                    Assessment of security risks to protected health information
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="relevantQuestionnaires"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes("vendor")}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), "vendor"]
                                        : (field.value || [])?.filter(
                                            (value) => value !== "vendor"
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Vendor Security Assessment</FormLabel>
                                  <FormDescription>
                                    Assessment of third-party vendor security practices
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
              
              {/* Adversarial Insight Tab */}
              <TabsContent value="adversarial" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Adversarial Insight (MITRE ATT&CK)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select threat actors and techniques most relevant to your healthcare organization.
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
              
              {/* ISMS Tab */}
              <TabsContent value="isms" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Information Security Management System (ISMS)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Provide information about your current ISMS implementation.
                  </p>
                  
                  <FormField
                    control={form.control}
                    name="ismsImplementation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ISMS Implementation Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select ISMS implementation status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No formal ISMS</SelectItem>
                            <SelectItem value="planning">Planning phase</SelectItem>
                            <SelectItem value="implementing">Currently implementing</SelectItem>
                            <SelectItem value="operational">Operational but not certified</SelectItem>
                            <SelectItem value="certified">Certified (e.g., ISO 27001)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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