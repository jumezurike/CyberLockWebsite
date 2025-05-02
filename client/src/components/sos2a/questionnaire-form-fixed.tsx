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

// Helper function to safely handle potentially undefined arrays
function safeArray<T>(arr: T[] | undefined): T[] {
  return arr || [];
}

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
  systemHardeningApproach: z.string().optional(),
  primaryCisBenchmark: z.string().optional(),
  cisVersion: z.string().optional(),
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
    guidelines: z.array(z.string()).optional(),
    healthcare: z.array(z.string()).optional(),
    financial: z.array(z.string()).optional(),
    industrySpecific: z.array(z.string()).optional(),
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
  
  // 9. Adversarial Insight (MITRE ATT&CK)
  osHardening: z.object({
    stig: z.boolean(),
    scap: z.boolean(),
    guidelines: z.array(z.string()),
  }),
  adversarialInsights: z.object({
    mitreAttackIds: z.array(z.string()),
  }),
  threatActors: z.array(z.string()).optional(),
  mitreTactics: z.array(z.string()).optional(),
  threatActorTypes: z.array(z.string()).optional(),
  
  // Additional Regulatory Content
  educationRequirements: z.array(z.string()).optional(),
  cloudRequirements: z.array(z.string()).optional(),
  cyberRequirements: z.array(z.string()).optional(),
  esgRequirements: z.array(z.string()).optional(),
  bestPracticeFrameworks: z.array(z.string()).optional(),
  
  // 10. ISMS
  ismsImplementation: z.string().optional(),
  ismsPolicies: z.array(z.string()).optional(),
  ismsPlans: z.array(z.string()).optional(),
  ismsProcedures: z.array(z.string()).optional(),
  ismsProcesses: z.array(z.string()).optional(),
  ismsLeadership: z.object({
    executiveSupport: z.boolean().optional(),
    ciso: z.boolean().optional(),
    boardReporting: z.boolean().optional(),
    securityCommittee: z.boolean().optional(),
  }).optional(),
  
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
      systemHardeningApproach: "",
      primaryCisBenchmark: "",
      cisVersion: "",
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
        guidelines: [],
        healthcare: [],
        financial: [],
        industrySpecific: [],
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
      osHardening: {
        stig: false,
        scap: false,
        guidelines: [],
      },
      adversarialInsights: {
        mitreAttackIds: [],
      },
      threatActors: [],
      mitreTactics: [],
      threatActorTypes: [],
      
      // Additional Regulatory Content
      educationRequirements: [],
      cloudRequirements: [],
      cyberRequirements: [],
      esgRequirements: [],
      bestPracticeFrameworks: [],
      
      // 10. ISMS
      ismsImplementation: "",
      ismsPolicies: [],
      ismsPlans: [],
      ismsProcedures: [],
      ismsProcesses: [],
      ismsLeadership: {
        executiveSupport: false,
        ciso: false,
        boardReporting: false,
        securityCommittee: false,
      },
      
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
  
  const handleSubmit = form.handleSubmit((data: Sos2aFormData) => {
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
  // Healthcare-specific regulations
  const healthcareRegulationOptions = [
    { 
      id: "hipaa", 
      label: "HIPAA (USA)", 
      description: "Health Insurance Portability and Accountability Act",
      details: "Security Rule: Safeguards for ePHI, Breach Notification: Report within 60 days",
      type: "healthcare"
    },
    { 
      id: "hitech", 
      label: "HITECH (USA)", 
      description: "Health Information Technology for Economic and Clinical Health Act",
      type: "healthcare"
    },
    { 
      id: "hitrust", 
      label: "HITRUST CSF", 
      description: "Certification framework aligning with HIPAA/ISO 27001",
      type: "healthcare"
    },
    { 
      id: "21cfr-part11", 
      label: "21 CFR Part 11 (FDA)", 
      description: "Audit trails, electronic signatures for medical devices",
      type: "healthcare"
    },
    { 
      id: "mdr-eu", 
      label: "Medical Device Regulation (EU)", 
      description: "Secure by design for connected medical devices",
      type: "healthcare"
    },
  ];
  
  // Financial & payment regulations
  const financialRegulationOptions = [
    { 
      id: "pci-dss", 
      label: "PCI-DSS (Global)", 
      description: "Payment Card Industry Data Security Standard",
      details: "Secure cardholder data, quarterly vulnerability scans",
      type: "standard"
    },
    { 
      id: "glba", 
      label: "GLBA (USA)", 
      description: "Gramm-Leach-Bliley Act - financial data protection",
      details: "Safeguards Rule: Protect customer financial data",
      type: "standard"
    },
    { 
      id: "sox", 
      label: "SOX (USA)", 
      description: "Sarbanes-Oxley - financial reporting controls",
      details: "Section 404: IT controls for financial reporting",
      type: "standard"
    },
    { 
      id: "psd2", 
      label: "PSD2 (EU)", 
      description: "Payment Services Directive 2",
      details: "Strong Customer Authentication (SCA): Multi-factor auth for payments",
      type: "standard"
    },
  ];
  
  // Industry-specific regulations
  const industrySpecificRegulationOptions = [
    { 
      id: "nerc-cip", 
      label: "NERC CIP", 
      description: "North American Electric Grid",
      details: "CIP-004: Personnel training for critical systems",
      type: "standard"
    },
    { 
      id: "tisax", 
      label: "TISAX (Automotive - EU)", 
      description: "Trusted Information Security Assessment Exchange",
      details: "Secure prototype data, supply chain audits",
      type: "standard"
    },
    { 
      id: "iec-62443", 
      label: "IEC 62443", 
      description: "Industrial control systems (ICS) security",
      type: "standard"
    },
    { 
      id: "fips-140", 
      label: "FIPS 140-2/3", 
      description: "Cryptographic module validation",
      type: "standard"
    },
  ];
  
  // General compliance frameworks
  const complianceFrameworkOptions = [
    { 
      id: "iso-27001", 
      label: "ISO 27001", 
      description: "Information Security Management System (ISMS)",
      type: "standard"
    },
    { 
      id: "iso-27002", 
      label: "ISO 27002", 
      description: "Controls for information security",
      type: "standard"
    },
    { 
      id: "nist-csf", 
      label: "NIST CSF", 
      description: "Risk management (Identify, Protect, Detect, Respond, Recover)",
      type: "standard"
    },
    { 
      id: "nist-800-53", 
      label: "NIST SP 800-53", 
      description: "Security controls for federal systems (used beyond government)",
      type: "standard"
    },
    { 
      id: "cis-csc", 
      label: "CIS Controls", 
      description: "18 prioritized security best practices",
      type: "standard"
    },
    { 
      id: "soc-2", 
      label: "SOC 2", 
      description: "Security, Availability, Confidentiality (for cloud/services)",
      type: "standard"
    },
    { 
      id: "cmmc", 
      label: "CMMC", 
      description: "Cybersecurity Maturity Model Certification (U.S. defense)",
      type: "standard"
    },
    { 
      id: "cyber-ess-uk", 
      label: "Cyber Essentials (UK)", 
      description: "UK government-backed cybersecurity certification",
      type: "guideline"
    },
    { 
      id: "fisma", 
      label: "FISMA", 
      description: "U.S. federal agency security (aligned with NIST)",
      type: "standard"
    },
    { 
      id: "fedramp", 
      label: "FedRAMP", 
      description: "Cloud security for U.S. government",
      type: "standard"
    },
  ];
  
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
    { id: "change-management", label: "Change Management Procedures" },
    { id: "access-control", label: "Access Control Procedures" },
    { id: "system-backup", label: "System Backup Procedures" },
    { id: "vulnerability-management", label: "Vulnerability Management Procedures" },
    { id: "data-breach", label: "Data Breach Notification Procedures" },
  ];
  
  const planOptions = [
    { id: "disaster-recovery", label: "Disaster Recovery Plan" },
    { id: "business-continuity", label: "Business Continuity Plan" },
    { id: "incident-response", label: "Incident Response Plan" },
    { id: "information-security", label: "Information Security Plan" },
    { id: "risk-management", label: "Risk Management Plan" },
    { id: "data-security", label: "Data Security Plan" },
  ];
  
  const guideOptions = [
    { id: "security-awareness", label: "Security Awareness Guidelines" },
    { id: "secure-coding", label: "Secure Coding Guidelines" },
    { id: "system-hardening", label: "System Hardening Guidelines" },
    { id: "remote-work", label: "Remote Work Guidelines" },
    { id: "data-security", label: "Data Security Guidelines" },
    { id: "physical-security", label: "Physical Security Guidelines" },
  ];
  
  const assessmentOptions = assessmentTools.assessments.map((assessment) => ({
    id: assessment.id,
    label: assessment.name,
    purpose: assessment.purpose,
    applicability: assessment.applicability
  }));
  
  const checklistOptions = assessmentTools.checklists.map((checklist) => ({
    id: checklist.id,
    label: checklist.name,
    purpose: checklist.purpose,
    applicability: checklist.applicability
  }));
  
  const questionnaireOptions = assessmentTools.questionnaires.map((questionnaire) => ({
    id: questionnaire.id,
    label: questionnaire.name,
    purpose: questionnaire.purpose,
    applicability: questionnaire.applicability
  }));
  
  const handleIndustryChange = (value: string) => {
    if (value === "other") {
      form.setValue("showCustomIndustry", true);
    } else {
      form.setValue("showCustomIndustry", false);
      form.setValue("customIndustry", "");
    }
    form.setValue("industry", value);
  };
  
  const handleSameAsContactChange = (checked: boolean) => {
    if (checked) {
      const contactName = form.getValues("contactInfo.name");
      const contactEmail = form.getValues("contactInfo.email");
      
      form.setValue("contactInfo.pointOfContact", contactName);
      form.setValue("contactInfo.contactEmail", contactEmail);
    }
  };
  
  // Helper function to safely handle array operations with checkboxes
  const handleCheckboxArrayChange = (currentValues: string[] | undefined, optionId: string, checked: boolean): string[] => {
    if (checked) {
      // Add the item to the array, safely handling undefined by providing empty array default
      return [...(currentValues || []), optionId];
    } else {
      // Remove the item from the array, safely handling undefined
      return (currentValues || []).filter(value => value !== optionId);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="business">1. Business Info</TabsTrigger>
                <TabsTrigger value="infrastructure">2. Infrastructure Mode</TabsTrigger>
                <TabsTrigger value="baseline">3. Baseline Config</TabsTrigger>
                <TabsTrigger value="security">4. Security Control vs Framework</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="compliance">5. Compliance Requirements</TabsTrigger>
                <TabsTrigger value="regulatory">6. Regulatory Requirements</TabsTrigger>
                <TabsTrigger value="standards">7. Standards & Guidelines</TabsTrigger>
                <TabsTrigger value="acq-tools">8. Relevant ACQ Tools</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="adversarial">9. Adversarial Insight (MITRE ATT&CK)</TabsTrigger>
                <TabsTrigger value="isms">10. Information Security Management System (ISMS)</TabsTrigger>
                <TabsTrigger value="contact">11. Contact Confirmation</TabsTrigger>
                <TabsTrigger value="review" className="bg-[#7936b0] text-white hover:bg-[#6b2aa2]">12. Review & Submit</TabsTrigger>
              </TabsList>
              
              {/* Business Information Tab */}
              <TabsContent value="business" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">1. Business Information</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please provide details about your business, which will help us understand 
                    your organization's security needs.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your business name" {...field} />
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
                          <FormLabel>Industry</FormLabel>
                          <Select 
                            onValueChange={handleIndustryChange}
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
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="professional-services">Professional Services</SelectItem>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="government">Government</SelectItem>
                              <SelectItem value="energy">Energy & Utilities</SelectItem>
                              <SelectItem value="transportation">Transportation & Logistics</SelectItem>
                              <SelectItem value="nonprofit">Nonprofit</SelectItem>
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
                          <FormItem>
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
                        <FormItem>
                          <FormLabel>Number of Employees</FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select employee count" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-10">1-10</SelectItem>
                              <SelectItem value="11-50">11-50</SelectItem>
                              <SelectItem value="51-200">51-200</SelectItem>
                              <SelectItem value="201-500">201-500</SelectItem>
                              <SelectItem value="501-1000">501-1000</SelectItem>
                              <SelectItem value="1001-5000">1001-5000</SelectItem>
                              <SelectItem value="5001+">5001+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <FormField
                      control={form.control}
                      name="businessAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Business address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
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
                          <FormLabel>Zip/Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Zip/Postal Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <FormField
                      control={form.control}
                      name="businessServices"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Services Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Briefly describe your business services and operations" 
                              className="h-24"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* 2. Infrastructure Mode of Operation Tab */}
              <TabsContent value="infrastructure" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">2. Infrastructure Mode of Operation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the infrastructure and operational modes that apply to your organization.
                  </p>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="operationMode"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Connection Type</FormLabel>
                            <FormDescription>
                              Select all internet connection types used by your organization
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {operationModes.map((mode) => (
                              <FormField
                                key={mode.id}
                                control={form.control}
                                name="operationMode"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={mode.id}
                                      className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(mode.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, mode.id])
                                              : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== mode.id
                                                )
                                              );
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
                          <div className="mb-4">
                            <FormLabel>Internet Presence</FormLabel>
                            <FormDescription>
                              Select all that describe your organization's online presence
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {internetPresenceOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="internetPresence"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.id}
                                      className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md"
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* 3. Baseline Configuration Tab */}
              <TabsContent value="baseline" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">3. Baseline Configuration</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Define your organization's baseline security configuration and measures.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">Basic Security Measures</h4>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="securityMeasures"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel>Current Security Measures</FormLabel>
                                <FormDescription>
                                  Select all security measures currently implemented
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
                                          className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md"
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="primaryConcerns"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel>Primary Security Concerns</FormLabel>
                                <FormDescription>
                                  Select your organization's primary security concerns
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
                                          className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md"
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">Configuration Management</h4>
                      <div className="space-y-4">
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
                          name="configBaseline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Configuration Baseline Status</FormLabel>
                              <FormDescription className="mb-2">
                                What level of configuration baseline management does your organization maintain?
                              </FormDescription>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select baseline configuration status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="none">No formal baseline configurations</SelectItem>
                                  <SelectItem value="documented">Documented Configuration Baseline</SelectItem>
                                  <SelectItem value="reviewed">Regular Configuration Review</SelectItem>
                                  <SelectItem value="automated">Automated Configuration Management</SelectItem>
                                  <SelectItem value="continuous">Continuous Compliance Monitoring</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription className="mt-2">
                                Configuration baselines define the secure state all systems should maintain.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">OS / System Hardening</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        System hardening is critical for protecting applications and systems. Select the hardening approach your organization uses.
                      </p>
                      
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="systemHardeningApproach"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>System Hardening Approach</FormLabel>
                              <FormDescription className="mb-2">
                                Which system hardening methodology does your organization follow?
                              </FormDescription>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select system hardening approach" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="none">No formal hardening process</SelectItem>
                                  <SelectItem value="stig">STIG (Security Technical Implementation Guides)</SelectItem>
                                  <SelectItem value="scap">SCAP (Security Content Automation Protocol)</SelectItem>
                                  <SelectItem value="usgcb">USGCB (United States Government Configuration Baseline)</SelectItem>
                                  <SelectItem value="cis">CIS Hardened Images</SelectItem>
                                  <SelectItem value="custom">Custom Hardening Process</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription className="mt-2">
                                System hardening reduces the attack surface by removing unnecessary software, services, users, and configurations.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">CIS Benchmark</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        The Center for Internet Security (CIS) provides secure configuration guidelines.
                        Select the primary CIS Benchmark for your organization.
                      </p>
                      
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="primaryCisBenchmark"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary CIS Benchmark</FormLabel>
                              <FormDescription className="mb-2">
                                Which CIS Benchmark is most relevant to your organization?
                              </FormDescription>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select primary CIS Benchmark" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="none">No CIS Benchmark implemented</SelectItem>
                                  <SelectItem value="windows">CIS Windows Benchmark</SelectItem>
                                  <SelectItem value="linux">CIS Linux Benchmark</SelectItem>
                                  <SelectItem value="cloud">CIS Cloud Benchmarks</SelectItem>
                                  <SelectItem value="aws">CIS AWS Benchmark</SelectItem>
                                  <SelectItem value="azure">CIS Azure Benchmark</SelectItem>
                                  <SelectItem value="gcp">CIS Google Cloud Benchmark</SelectItem>
                                  <SelectItem value="kubernetes">CIS Kubernetes Benchmark</SelectItem>
                                  <SelectItem value="docker">CIS Docker Benchmark</SelectItem>
                                  <SelectItem value="mobile">CIS Mobile Benchmarks</SelectItem>
                                  <SelectItem value="network">CIS Network Benchmarks</SelectItem>
                                  <SelectItem value="hipaa">CIS HIPAA Benchmark</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription className="mt-2">
                                Your organization may use multiple CIS Benchmarks, but select the most critical one in this dropdown.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cisVersion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CIS Implementation Level</FormLabel>
                              <FormDescription className="mb-2">
                                Which implementation level has your organization achieved?
                              </FormDescription>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select implementation level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="none">Not implemented</SelectItem>
                                  <SelectItem value="level1">Level 1 (Essential)</SelectItem>
                                  <SelectItem value="level2">Level 2 (Advanced)</SelectItem>
                                  <SelectItem value="custom">Custom Implementation</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription className="mt-2">
                                CIS Level 1 provides essential security configurations. Level 2 adds advanced protection for sensitive environments.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormDescription className="mt-2">
                          Note: Organizations with compliance requirements should consider industry-specific CIS Benchmarks relevant to their operations.
                        </FormDescription>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* 4. Security Control vs Framework Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">4. Security Control vs Framework</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select security frameworks by domain (Operations, Management, Technology, People).
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">Operations Domain</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {operationalFrameworks.map((framework) => (
                          <FormField
                            key={framework.id}
                            control={form.control}
                            name="frameworks.operations"
                            render={({ field }) => (
                              <FormItem
                                key={framework.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(framework.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, framework.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== framework.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {framework.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">Management Domain</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {managementFrameworks.map((framework) => (
                          <FormField
                            key={framework.id}
                            control={form.control}
                            name="frameworks.management"
                            render={({ field }) => (
                              <FormItem
                                key={framework.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(framework.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, framework.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== framework.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {framework.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">Technology Domain</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {technologyFrameworks.map((framework) => (
                          <FormField
                            key={framework.id}
                            control={form.control}
                            name="frameworks.technology"
                            render={({ field }) => (
                              <FormItem
                                key={framework.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(framework.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, framework.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== framework.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {framework.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">People Domain</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {peopleFrameworks.map((framework) => (
                          <FormField
                            key={framework.id}
                            control={form.control}
                            name="frameworks.people"
                            render={({ field }) => (
                              <FormItem
                                key={framework.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(framework.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, framework.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== framework.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {framework.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* 5. Compliance Tab */}
              <TabsContent value="compliance" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">5. Compliance Requirements</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select compliance frameworks, standards, and regulations relevant to your organization.
                  </p>
                  
                  {/* Color-coded Legend */}
                  <div className="flex flex-wrap justify-center gap-6 mb-6 p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-600"></div>
                      <span className="text-sm font-medium">Standards (Mandatory)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-600"></div>
                      <span className="text-sm font-medium">Guidelines (Optional)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                      <span className="text-sm font-medium">Healthcare-Specific</span>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Universal Security Frameworks */}
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4 text-red-600">
                        <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2"></span>
                        Universal Security Frameworks <span className="text-sm font-normal">(Standards)</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {complianceFrameworkOptions.map((option) => (
                          option.type === "standard" && (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="complianceRequirements.frameworks"
                              render={({ field }) => (
                                <FormItem
                                  key={option.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), option.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== option.id
                                              ) || []
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">{option.label}</FormLabel>
                                    <FormDescription>
                                      {option.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          )
                        ))}
                      </div>
                    </div>
                    
                    {/* Optional Guidelines */}
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4 text-green-600">
                        <span className="inline-block w-3 h-3 rounded-full bg-green-600 mr-2"></span>
                        Security Framework Guidelines <span className="text-sm font-normal">(Optional)</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {complianceFrameworkOptions.map((option) => (
                          option.type === "guideline" && (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="complianceRequirements.guidelines"
                              render={({ field }) => (
                                <FormItem
                                  key={option.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), option.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== option.id
                                              ) || []
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">{option.label}</FormLabel>
                                    <FormDescription>
                                      {option.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          )
                        ))}
                      </div>
                    </div>
                    
                    {/* Healthcare-Specific */}
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4 text-blue-600">
                        <span className="inline-block w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
                        Healthcare-Specific Regulations <span className="text-sm font-normal">(Industry-Specific)</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {healthcareRegulationOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="complianceRequirements.healthcare"
                            render={({ field }) => (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-blue-50"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            ) || []
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">{option.label}</FormLabel>
                                  <FormDescription>
                                    {option.description}
                                    {option.details && (
                                      <div className="mt-2 text-xs">
                                        <span className="block">{option.details}</span>
                                      </div>
                                    )}
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Financial & Payment */}
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4 text-red-600">
                        <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2"></span>
                        Financial & Payment Regulations <span className="text-sm font-normal">(Standards)</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {financialRegulationOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="complianceRequirements.financial"
                            render={({ field }) => (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            ) || []
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">{option.label}</FormLabel>
                                  <FormDescription>
                                    {option.description}
                                    {option.details && (
                                      <div className="mt-2 text-xs">
                                        <span className="block">{option.details}</span>
                                      </div>
                                    )}
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Industry-Specific */}
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4 text-red-600">
                        <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2"></span>
                        Industry-Specific Regulations <span className="text-sm font-normal">(Standards)</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {industrySpecificRegulationOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="complianceRequirements.industrySpecific"
                            render={({ field }) => (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            ) || []
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">{option.label}</FormLabel>
                                  <FormDescription>
                                    {option.description}
                                    {option.details && (
                                      <div className="mt-2 text-xs">
                                        <span className="block">{option.details}</span>
                                      </div>
                                    )}
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* 6. Regulatory Requirements Tab */}
              <TabsContent value="regulatory" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">6. Regulatory Requirements</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select all regulatory requirements applicable to your organization.
                  </p>
                  
                  <RegulatoryContent form={form} />
                </div>
              </TabsContent>
              
              {/* 7. Standards & Guidelines Tab */}
              <TabsContent value="standards" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">7. Standards & Guidelines</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the standards and guidelines relevant to your organization.
                  </p>
                  
                  <StandardsContent form={form} />
                </div>
              </TabsContent>
              
              {/* 8. Relevant ACQ Tools Tab */}
              <TabsContent value="acq-tools" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">8. Relevant Assessment, Checklist & Questionnaire (ACQ) Tools</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the assessment tools and questionnaires relevant to your organization.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">Assessment Tools</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assessmentOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="relevantACQTools.assessments"
                            render={({ field }) => (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            ) || []
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1">
                                  <FormLabel className="font-normal">
                                    {option.label}
                                  </FormLabel>
                                  {option.purpose && (
                                    <p className="text-xs text-muted-foreground">
                                      {option.purpose}
                                      {option.applicability && ` • ${option.applicability}`}
                                    </p>
                                  )}
                                </div>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">Checklist Tools</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {checklistOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="relevantACQTools.checklists"
                            render={({ field }) => (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            ) || []
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1">
                                  <FormLabel className="font-normal">
                                    {option.label}
                                  </FormLabel>
                                  {option.purpose && (
                                    <p className="text-xs text-muted-foreground">
                                      {option.purpose}
                                      {option.applicability && ` • ${option.applicability}`}
                                    </p>
                                  )}
                                </div>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">Questionnaire Tools</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {questionnaireOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="relevantACQTools.questionnaires"
                            render={({ field }) => (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            ) || []
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1">
                                  <FormLabel className="font-normal">
                                    {option.label}
                                  </FormLabel>
                                  {option.purpose && (
                                    <p className="text-xs text-muted-foreground">
                                      {option.purpose}
                                      {option.applicability && ` • ${option.applicability}`}
                                    </p>
                                  )}
                                </div>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* 9. Adversarial Insight Tab */}
              <TabsContent value="adversarial" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">9. Adversarial Insight (MITRE ATT&CK)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the most relevant MITRE ATT&CK tactics and techniques for your threat model.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">Select Primary Tactics of Concern</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="mitreTactics"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-red-50">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("TA0043")}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), "TA0043"]
                                      : (field.value || [])?.filter(
                                          (value) => value !== "TA0043"
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium">Reconnaissance (TA0043)</FormLabel>
                                <FormDescription>
                                  Gathering information to plan future operations
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="mitreTactics"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-orange-50">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("TA0042")}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), "TA0042"]
                                      : (field.value || [])?.filter(
                                          (value) => value !== "TA0042"
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium">Resource Development (TA0042)</FormLabel>
                                <FormDescription>
                                  Establishing resources to support operations
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="mitreTactics"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-yellow-50">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("TA0001")}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), "TA0001"]
                                      : (field.value || [])?.filter(
                                          (value) => value !== "TA0001"
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium">Initial Access (TA0001)</FormLabel>
                                <FormDescription>
                                  Gaining entry into your environment
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="mitreTactics"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("TA0002")}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), "TA0002"]
                                      : (field.value || [])?.filter(
                                          (value) => value !== "TA0002"
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium">Execution (TA0002)</FormLabel>
                                <FormDescription>
                                  Running malicious code in your environment
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="mitreTactics"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("TA0003")}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), "TA0003"]
                                      : (field.value || [])?.filter(
                                          (value) => value !== "TA0003"
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium">Persistence (TA0003)</FormLabel>
                                <FormDescription>
                                  Maintaining access despite restarts or credentials changes
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="mitreTactics"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("TA0004")}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), "TA0004"]
                                      : (field.value || [])?.filter(
                                          (value) => value !== "TA0004"
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium">Privilege Escalation (TA0004)</FormLabel>
                                <FormDescription>
                                  Gaining higher-level permissions
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="mitreTactics"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("TA0006")}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), "TA0006"]
                                      : (field.value || [])?.filter(
                                          (value) => value !== "TA0006"
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium">Credential Access (TA0006)</FormLabel>
                                <FormDescription>
                                  Stealing credentials like passwords or access keys
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="mitreTactics"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("TA0010")}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), "TA0010"]
                                      : (field.value || [])?.filter(
                                          (value) => value !== "TA0010"
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium">Exfiltration (TA0010)</FormLabel>
                                <FormDescription>
                                  Stealing data from your network
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="mitreTactics"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-red-50">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("TA0040")}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), "TA0040"]
                                      : (field.value || [])?.filter(
                                          (value) => value !== "TA0040"
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium">Impact (TA0040)</FormLabel>
                                <FormDescription>
                                  Disrupting business and operations (e.g., ransomware)
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">Common Techniques by Tactic</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Based on your selected tactics, these are some common techniques to be aware of:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="rounded-md border p-4">
                          <h5 className="font-medium">Initial Access (TA0001)</h5>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li>• Phishing (T1566)</li>
                            <li>• Exploit Public-Facing Application (T1190)</li>
                            <li>• Valid Accounts (T1078)</li>
                          </ul>
                        </div>
                        
                        <div className="rounded-md border p-4">
                          <h5 className="font-medium">Credential Access (TA0006)</h5>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li>• Brute Force (T1110)</li>
                            <li>• OS Credential Dumping (T1003)</li>
                            <li>• Input Capture (T1056)</li>
                          </ul>
                        </div>
                        
                        <div className="rounded-md border p-4">
                          <h5 className="font-medium">Impact (TA0040)</h5>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li>• Data Encrypted for Impact (T1486)</li>
                            <li>• Account Access Removal (T1531)</li>
                            <li>• Disk Wipe (T1561)</li>
                          </ul>
                        </div>
                        
                        <div className="rounded-md border p-4">
                          <h5 className="font-medium">Exfiltration (TA0010)</h5>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li>• Exfiltration Over Web Service (T1567)</li>
                            <li>• Exfiltration Over Alternative Protocol (T1048)</li>
                            <li>• Automated Exfiltration (T1020)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">Threat Actor Types</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="threatActorTypes"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
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
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium">Nation State Actors</FormLabel>
                                <FormDescription>
                                  Government-backed groups with sophisticated capabilities
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="threatActorTypes"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
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
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium">Ransomware Groups</FormLabel>
                                <FormDescription>
                                  Criminal organizations focusing on encryption and extortion
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="threatActorTypes"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("hacktivists")}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), "hacktivists"]
                                      : (field.value || [])?.filter(
                                          (value) => value !== "hacktivists"
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium">Hacktivists</FormLabel>
                                <FormDescription>
                                  Politically or ideologically motivated groups
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="threatActorTypes"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("insider")}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), "insider"]
                                      : (field.value || [])?.filter(
                                          (value) => value !== "insider"
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium">Insider Threats</FormLabel>
                                <FormDescription>
                                  Current or former employees/contractors with legitimate access
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* 10. ISMS Tab */}
              <TabsContent value="isms" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">10. Information Security Management System (ISMS)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select ISMS implementation options and related documents.
                  </p>
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="ismsImplementation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ISMS Implementation Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select implementation status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None - Not Implemented</SelectItem>
                              <SelectItem value="planning">Planning Phase</SelectItem>
                              <SelectItem value="partial">Partially Implemented</SelectItem>
                              <SelectItem value="implemented">Fully Implemented</SelectItem>
                              <SelectItem value="certified">Implemented and Certified</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Indicate the current implementation state of your Information Security Management System
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">ISMS Policies</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {policyOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="ismsPolicies"
                            render={({ field }) => (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md"
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
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">ISMS Procedures</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {procedureOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="ismsProcedures"
                            render={({ field }) => (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md"
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
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">ISMS Plans</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {planOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="ismsPlans"
                            render={({ field }) => (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md"
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
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">ISMS Leadership</h4>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="ismsLeadership.executiveSupport"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Executive Leadership Support</FormLabel>
                                <FormDescription>
                                  Executive leadership actively supports and is involved in information security governance
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="ismsLeadership.ciso"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>CISO or Security Leader</FormLabel>
                                <FormDescription>
                                  Organization has a dedicated CISO or senior-level security leader position
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="ismsLeadership.boardReporting"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Board-Level Reporting</FormLabel>
                                <FormDescription>
                                  Regular security reporting to the board of directors or highest leadership level
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="ismsLeadership.securityCommittee"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Security Steering Committee</FormLabel>
                                <FormDescription>
                                  Cross-functional security committee that guides security initiatives and decisions
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Contact and Confirmation Tab */}
              <TabsContent value="contact" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">11. Contact Confirmation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Provide contact details for follow-up and select your assessment type.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactInfo.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
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
                          <FormLabel>Your Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactInfo.sameAsContact"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                handleSameAsContactChange(checked as boolean);
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Same as above</FormLabel>
                            <FormDescription>
                              Use the same name and email for the report point of contact
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-4">Report Point of Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="contactInfo.pointOfContact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Point of Contact Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Contact name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contactInfo.contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Point of Contact Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Contact email" {...field} />
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
                              <Input placeholder="Phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Assessment Type Selection</h3>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="reportType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Assessment Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select assessment type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="preliminary">Preliminary Assessment</SelectItem>
                              <SelectItem value="comprehensive">Comprehensive Assessment</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            <strong>Preliminary Assessment:</strong> Includes interview, matrix population, threat modeling, and qualitative assessment with recommendations.
                            <br />
                            <strong>Comprehensive Assessment:</strong> Evidence-based evaluation with detailed report and tailored remediation strategies.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="availabilityConfirmation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Availability Confirmation</FormLabel>
                            <FormDescription>
                              I confirm that I am available for a follow-up call or interview for additional information 
                              if needed for the assessment.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="referralPermission"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Referral Permission</FormLabel>
                            <FormDescription>
                              I give permission to be contacted about future services and offerings related to cybersecurity.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="button" className="mt-4" onClick={() => document.querySelector('[value="review"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}>
                    Continue to Review
                  </Button>
                </div>
              </TabsContent>
              
              {/* Review Tab */}
              <TabsContent value="review" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">12. Review & Submit Your Questionnaire</h3>
                  <p className="text-sm mb-4">
                    <span className="font-medium text-primary">This is the final step!</span> Please review your responses before submitting. After submission, our experts will review your information and schedule the interview phase for your security assessment.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="border rounded-md p-4 bg-gray-50">
                      <h4 className="text-base font-medium mb-3">Business Information Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Business Name:</div>
                          <div>{form.getValues("businessName")}</div>
                          
                          <div className="font-medium">Industry:</div>
                          <div>{form.getValues("industry") === "other" ? form.getValues("customIndustry") : form.getValues("industry")}</div>
                          
                          <div className="font-medium">Employee Count:</div>
                          <div>{form.getValues("employeeCount")}</div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-md p-4 bg-gray-50">
                      <h4 className="text-base font-medium mb-3">Infrastructure & Security</h4>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Operation Mode:</div>
                          <div>{form.getValues("operationMode").join(", ")}</div>
                          
                          <div className="font-medium">Internet Presence:</div>
                          <div>{form.getValues("internetPresence").join(", ")}</div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-md p-4 bg-gray-50">
                      <h4 className="text-base font-medium mb-3">Compliance Requirements</h4>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Selected Frameworks:</div>
                          <div>{form.getValues("complianceRequirements.frameworks").length > 0 ? 
                                form.getValues("complianceRequirements.frameworks").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">Healthcare Regulations:</div>
                          <div>{form.getValues("complianceRequirements.healthcare")?.length > 0 ? 
                                form.getValues("complianceRequirements.healthcare").join(", ") : 
                                "None selected"}</div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-md p-4 bg-gray-50">
                      <h4 className="text-base font-medium mb-3">Assessment Type</h4>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Selected Assessment Type:</div>
                          <div>{form.getValues("reportType") === "preliminary" ? "Preliminary Assessment" : "Comprehensive Assessment"}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 text-sm text-muted-foreground">
                      <p>By submitting this form, you confirm that all information provided is accurate to the best of your knowledge.</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 mt-4">
                  <h4 className="text-base font-medium mb-2">Final Step: Submit Your Assessment</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click the button below to submit your completed questionnaire. Our security experts will review your information and contact you to schedule the next steps in your assessment process.
                  </p>
                  <div className="flex justify-center w-full">
                    <Button type="submit" className="bg-[#7936b0] hover:bg-[#6b2aa2] text-white font-medium text-lg py-4 w-full">Submit Questionnaire</Button>
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