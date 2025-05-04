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
  
  // Legal agreements
  eulaAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the End User License Agreement",
  }),
});

interface QuestionnaireFormProps {
  onSubmit: (data: Sos2aFormData) => void;
}

export default function QuestionnaireForm({ onSubmit }: QuestionnaireFormProps) {
  const [eulaAccepted, setEulaAccepted] = useState(false);
  
  // Helper function to handle OS checkbox changes
  const handleOsCheckboxChange = (currentValues: string[] = [], os: any, isChecked: boolean): string[] => {
    let newValues = [...(currentValues || [])];
    
    if (isChecked) {
      // Add the selected OS
      newValues.push(os.id);
    } else {
      // Remove the OS if unchecked
      newValues = newValues.filter(id => id !== os.id);
    }
    
    // Check if any "Other" OS option is selected
    const hasOtherOs = newValues.some(id => 
      id === "other-windows-server" || 
      id === "other-windows-client" || 
      id === "other-rhel" || 
      id === "other-debian" || 
      id === "other-linux" || 
      id === "other-unix" || 
      id === "other-cloud" || 
      id === "other-container" || 
      id === "other-network" || 
      id === "other-mobile" || 
      id === "other-os"
    );
    
    // When we return, the form will update - so we need to set the "showCustomOperatingSystem" field
    setTimeout(() => {
      form.setValue("showCustomOperatingSystem", hasOtherOs);
      if (!hasOtherOs) {
        form.setValue("customOperatingSystem", "");
      }
    }, 0);
    
    return newValues;
  };
  
  const form = useForm<Sos2aFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // 1. Business Information
      businessName: "",
      businessAddress: "",
      businessLocation: {
        city: "",
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
      customOperationMode: "",
      showCustomOperationMode: false,
      internetPresence: [],
      configurationManagement: "",
      systemHardeningApproach: "",
      operatingSystems: [],
      customOperatingSystem: "",
      showCustomOperatingSystem: false,
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
      
      // Legal agreements
      eulaAccepted: false,
    },
  });
  
  const handleSubmit = form.handleSubmit((data: Sos2aFormData) => {
    // Debug logs to check form submission
    console.log("Form submitted", data);
    console.log("EULA status:", eulaAccepted);
    
    // Update the EULA acceptance state in the form data
    const updatedData = {
      ...data,
      eulaAccepted: eulaAccepted
    };
    console.log("Calling parent onSubmit with data");
    try {
      onSubmit(updatedData);
      console.log("Parent onSubmit completed");
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  });
  
  const operationModes = [
    { id: "isp-modem", label: "ISP Modem" },
    { id: "mobile-hotspot", label: "Mobile Hotspot" },
    { id: "commercial-internet", label: "Commercial Internet" },
    { id: "dedicated-connection", label: "Dedicated Connection" },
    { id: "satellite", label: "Satellite" },
    { id: "ai-applications", label: "AI Applications (ChatGPT, Mistral, DeepSeek, etc.)" },
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
  
  // Vulnerability options categorized by type
  const vulnerabilitiesOptions = [
    // Website vulnerabilities
    { id: "weak-auth-web", label: "Weak Authentication and Access Control - Website", category: "web" },
    { id: "unpatched-web", label: "Unpatched Software and Plugins - Website", category: "web" },
    { id: "insecure-uploads", label: "Insecure File Uploads - Website", category: "web" },
    { id: "xss", label: "Cross-Site Scripting (XSS) - Website", category: "web" },
    { id: "unsecured-apis", label: "Unsecured APIs - Website", category: "web" },
    { id: "misconfigured-servers", label: "Misconfigured Servers - Website", category: "web" },
    { id: "third-party-deps", label: "Third-Party Dependencies - Website", category: "web" },
    { id: "sql-injection", label: "SQL Injection - Website", category: "web" },
    
    // End Device Security (EDS) vulnerabilities
    { id: "unpatched-os", label: "Unpatched OS or Software - EDS", category: "eds" },
    { id: "mdm-misconfig", label: "Misconfigured MDM Policies Causing Data Exposure - EDS", category: "eds" },
    { id: "weak-auth-eds", label: "Weak Authentication Methods - EDS", category: "eds" },
    { id: "unsecured-byod", label: "Unsecured BYOD Devices - EDS", category: "eds" },
    { id: "default-creds", label: "Default Credentials on Devices - EDS", category: "eds" },
    { id: "removable-media", label: "Unsecured Removable Media - EDS", category: "eds" },
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
    // Universal Security Standards
    { 
      id: "iso-27001", 
      label: "ISO 27001", 
      description: "Information Security Management System (ISMS)",
      type: "standard",
      family: "Universal Security Standards"
    },
    { 
      id: "iso-27002", 
      label: "ISO 27002", 
      description: "Controls for information security",
      type: "standard",
      family: "Universal Security Standards"
    },
    { 
      id: "nist-csf", 
      label: "NIST CSF", 
      description: "Risk management (Identify, Protect, Detect, Respond, Recover)",
      type: "standard",
      family: "Universal Security Standards"
    },
    { 
      id: "nist-800-53", 
      label: "NIST SP 800-53", 
      description: "Security controls for federal systems (used beyond government)",
      type: "standard",
      family: "Universal Security Standards"
    },
    { 
      id: "cis-csc", 
      label: "CIS Controls", 
      description: "18 prioritized security best practices",
      type: "standard",
      family: "Universal Security Standards"
    },
    { 
      id: "soc-2", 
      label: "SOC 2", 
      description: "Security, Availability, Confidentiality (for cloud/services)",
      type: "standard",
      family: "Universal Security Standards"
    },
    { 
      id: "pci-dss-comp", 
      label: "PCI-DSS", 
      description: "Payment Card Industry Data Security Standard",
      type: "standard",
      family: "Universal Security Standards"
    },
    
    // Healthcare-Specific Standards
    { 
      id: "hipaa-security", 
      label: "HIPAA Security Rule", 
      description: "Security standards for electronic protected health information",
      type: "healthcare",
      family: "Healthcare-Specific Standards"
    },
    { 
      id: "hitrust-csf", 
      label: "HITRUST CSF", 
      description: "Healthcare-focused security framework",
      type: "healthcare",
      family: "Healthcare-Specific Standards"
    },
    { 
      id: "hipaa-privacy", 
      label: "HIPAA Privacy Rule", 
      description: "Standards for individually identifiable health information",
      type: "healthcare",
      family: "Healthcare-Specific Standards"
    },
    { 
      id: "21-cfr-part-11", 
      label: "21 CFR Part 11", 
      description: "Electronic records and signatures in clinical trials",
      type: "healthcare",
      family: "Healthcare-Specific Standards"
    },
    { 
      id: "nist-800-66", 
      label: "NIST SP 800-66", 
      description: "Implementing HIPAA Security Rule",
      type: "healthcare",
      family: "Healthcare-Specific Standards"
    },
    { 
      id: "dicom-security", 
      label: "DICOM Security", 
      description: "Security for medical imaging",
      type: "healthcare",
      family: "Healthcare-Specific Standards"
    },
    { 
      id: "hl7-fhir-security", 
      label: "HL7 FHIR Security", 
      description: "Security for healthcare data exchange",
      type: "healthcare",
      family: "Healthcare-Specific Standards"
    },
    
    // Government & Critical Infrastructure
    { 
      id: "cmmc", 
      label: "CMMC", 
      description: "Cybersecurity Maturity Model Certification (U.S. defense)",
      type: "standard",
      family: "Government & Critical Infrastructure"
    },
    { 
      id: "fisma", 
      label: "FISMA", 
      description: "U.S. federal agency security (aligned with NIST)",
      type: "standard",
      family: "Government & Critical Infrastructure"
    },
    { 
      id: "fedramp", 
      label: "FedRAMP", 
      description: "Cloud security for U.S. government",
      type: "standard",
      family: "Government & Critical Infrastructure"
    },
    { 
      id: "nerc-cip-comp", 
      label: "NERC CIP", 
      description: "Critical infrastructure protection for power grid",
      type: "standard",
      family: "Government & Critical Infrastructure"
    },
    
    // Financial & Payment Standards (additional ones beyond PCI-DSS)
    { 
      id: "sox-comp", 
      label: "SOX", 
      description: "Sarbanes-Oxley Act financial controls",
      type: "standard",
      family: "Financial & Payment Standards"
    },
    { 
      id: "psd2-comp", 
      label: "PSD2", 
      description: "Payment Services Directive 2 (EU)",
      type: "standard",
      family: "Financial & Payment Standards"
    },
    
    // Cloud & Data Privacy
    { 
      id: "iso-27701", 
      label: "ISO 27701", 
      description: "Privacy information management extension to ISO 27001",
      type: "standard",
      family: "Cloud & Data Privacy"
    },
    { 
      id: "ccpa-comp", 
      label: "CCPA", 
      description: "California Consumer Privacy Act",
      type: "standard",
      family: "Cloud & Data Privacy"
    },
    { 
      id: "soc-1", 
      label: "SOC 1", 
      description: "Controls relevant to financial reporting",
      type: "standard",
      family: "Cloud & Data Privacy"
    },
    
    // Industry-Specific Standards
    { 
      id: "iec-62443-comp", 
      label: "IEC 62443", 
      description: "Industrial automation and control systems security",
      type: "standard",
      family: "Industry-Specific Standards"
    },
    { 
      id: "tisax-comp", 
      label: "TISAX", 
      description: "Trusted Information Security Assessment Exchange (automotive)",
      type: "standard",
      family: "Industry-Specific Standards"
    },
    { 
      id: "fips-140-comp", 
      label: "FIPS 140-2/3", 
      description: "Security requirements for cryptographic modules",
      type: "standard",
      family: "Industry-Specific Standards"
    },
    
    // Emerging & Regional Standards
    { 
      id: "cccs-33", 
      label: "CCCS 33", 
      description: "Canadian Centre for Cyber Security baseline controls",
      type: "standard",
      family: "Emerging & Regional Standards"
    },
    { 
      id: "ens", 
      label: "ENS", 
      description: "Esquema Nacional de Seguridad (Spanish National Security Framework)",
      type: "standard",
      family: "Emerging & Regional Standards"
    },
    { 
      id: "meiti", 
      label: "MEITI", 
      description: "Middle East Information Technology Infrastructure",
      type: "standard",
      family: "Emerging & Regional Standards"
    },
    { 
      id: "cyber-ess-uk", 
      label: "Cyber Essentials (UK)", 
      description: "UK government-backed cybersecurity certification",
      type: "guideline",
      family: "Emerging & Regional Standards"
    },
  ];
  
  const policyOptions = [
    { id: "acceptable-use", label: "Acceptable Use Policy" },
    { id: "information-security", label: "Information Security Policy" },
    { id: "system-security", label: "System Security Plan (SSP)" },
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
  
  // Operating System options for baseline configuration
  const operatingSystemOptions = [
    // Windows OS
    { id: "windows-server-2022", label: "Windows Server 2022", category: "Windows Server" },
    { id: "windows-server-2019", label: "Windows Server 2019", category: "Windows Server" },
    { id: "windows-server-2016", label: "Windows Server 2016", category: "Windows Server" },
    { id: "windows-server-2012-r2", label: "Windows Server 2012 R2", category: "Windows Server" },
    { id: "other-windows-server", label: "Other Windows Server", category: "Windows Server" },
    { id: "windows-11", label: "Windows 11", category: "Windows Client" },
    { id: "windows-10", label: "Windows 10", category: "Windows Client" },
    { id: "windows-8.1", label: "Windows 8.1", category: "Windows Client" },
    { id: "other-windows-client", label: "Other Windows Client", category: "Windows Client" },
    
    // Linux Distributions
    { id: "rhel-9", label: "Red Hat Enterprise Linux (RHEL) 9", category: "Red Hat Family" },
    { id: "rhel-8", label: "Red Hat Enterprise Linux (RHEL) 8", category: "Red Hat Family" },
    { id: "rhel-7", label: "Red Hat Enterprise Linux (RHEL) 7", category: "Red Hat Family" },
    { id: "centos-8-stream", label: "CentOS 8 Stream", category: "Red Hat Family" },
    { id: "centos-7", label: "CentOS 7", category: "Red Hat Family" },
    { id: "oracle-linux-9", label: "Oracle Linux 9", category: "Red Hat Family" },
    { id: "oracle-linux-8", label: "Oracle Linux 8", category: "Red Hat Family" },
    { id: "oracle-linux-7", label: "Oracle Linux 7", category: "Red Hat Family" },
    { id: "other-redhat", label: "Other Red Hat Family OS", category: "Red Hat Family" },
    
    { id: "debian-12", label: "Debian 12", category: "Debian Family" },
    { id: "debian-11", label: "Debian 11", category: "Debian Family" },
    { id: "debian-10", label: "Debian 10", category: "Debian Family" },
    { id: "ubuntu-22.04", label: "Ubuntu 22.04 LTS", category: "Debian Family" },
    { id: "ubuntu-20.04", label: "Ubuntu 20.04 LTS", category: "Debian Family" },
    { id: "ubuntu-18.04", label: "Ubuntu 18.04 LTS", category: "Debian Family" },
    { id: "other-debian", label: "Other Debian Family OS", category: "Debian Family" },
    
    { id: "sles-15", label: "SUSE Linux Enterprise Server (SLES) 15", category: "SUSE Family" },
    { id: "sles-12", label: "SUSE Linux Enterprise Server (SLES) 12", category: "SUSE Family" },
    { id: "opensuse-leap-15", label: "openSUSE Leap 15", category: "SUSE Family" },
    { id: "other-suse", label: "Other SUSE Family OS", category: "SUSE Family" },
    
    { id: "amazon-linux-2023", label: "Amazon Linux 2023", category: "Other Linux" },
    { id: "amazon-linux-2", label: "Amazon Linux 2", category: "Other Linux" },
    { id: "almalinux-9", label: "AlmaLinux 9", category: "Other Linux" },
    { id: "almalinux-8", label: "AlmaLinux 8", category: "Other Linux" },
    { id: "rocky-linux-9", label: "Rocky Linux 9", category: "Other Linux" },
    { id: "rocky-linux-8", label: "Rocky Linux 8", category: "Other Linux" },
    { id: "fedora-latest", label: "Fedora (Latest)", category: "Other Linux" },
    { id: "other-linux", label: "Other Linux Distribution", category: "Other Linux" },
    
    // Unix-Based OS
    { id: "ibm-aix-7.2", label: "IBM AIX 7.2", category: "Unix-Based OS" },
    { id: "ibm-aix-7.1", label: "IBM AIX 7.1", category: "Unix-Based OS" },
    { id: "solaris-11.4", label: "Solaris 11.4", category: "Unix-Based OS" },
    { id: "solaris-11.3", label: "Solaris 11.3", category: "Unix-Based OS" },
    { id: "hp-ux-11i-v3", label: "HP-UX 11i v3", category: "Unix-Based OS" },
    { id: "other-unix", label: "Other Unix OS", category: "Unix-Based OS" },
    
    // Cloud/Container OS
    { id: "gcp-compute-engine", label: "Google Compute Engine (GCE)", category: "Cloud/Container OS" },
    { id: "azure-vm-linux", label: "Azure Virtual Machines (Linux)", category: "Cloud/Container OS" },
    { id: "azure-vm-windows", label: "Azure Virtual Machines (Windows)", category: "Cloud/Container OS" },
    { id: "aws-ami", label: "Amazon Machine Image (AMI)", category: "Cloud/Container OS" },
    { id: "docker", label: "Docker", category: "Cloud/Container OS" },
    { id: "kubernetes", label: "Kubernetes", category: "Cloud/Container OS" },
    { id: "other-cloud", label: "Other Cloud/Container Platform", category: "Cloud/Container OS" },
    
    // Network/Embedded OS
    { id: "cisco-ios", label: "Cisco IOS (Router/Switch OS)", category: "Network/Embedded OS" },
    { id: "vmware-esxi-8", label: "VMware ESXi 8.0", category: "Network/Embedded OS" },
    { id: "vmware-esxi-7", label: "VMware ESXi 7.0", category: "Network/Embedded OS" },
    { id: "pfsense", label: "PfSense (Firewall OS)", category: "Network/Embedded OS" },
    { id: "other-network", label: "Other Network/Embedded OS", category: "Network/Embedded OS" },
    
    // Mobile OS
    { id: "android-enterprise", label: "Android (Enterprise)", category: "Mobile OS" },
    { id: "ios-enterprise", label: "iOS (Enterprise)", category: "Mobile OS" },
    { id: "other-mobile", label: "Other Mobile OS", category: "Mobile OS" },
    
    // Legacy/Other OS
    { id: "mainframe", label: "Mainframe OS", category: "Legacy/Other" },
    { id: "as400", label: "AS/400", category: "Legacy/Other" },
    { id: "dos", label: "DOS-based systems", category: "Legacy/Other" },
    { id: "other-legacy", label: "Other Legacy System", category: "Legacy/Other" },
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
  
  // We already have a handleOsCheckboxChange function defined above

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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
                                            const newValue = checked
                                              ? [...field.value, mode.id]
                                              : field.value?.filter(
                                                  (value) => value !== mode.id
                                                );
                                            
                                            // Set the showCustomOperationMode based on whether "other" is selected
                                            if (mode.id === 'other') {
                                              form.setValue('showCustomOperationMode', checked);
                                            }
                                            
                                            return field.onChange(newValue);
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
                    
                    {form.watch('showCustomOperationMode') && (
                      <FormField
                        control={form.control}
                        name="customOperationMode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Other Operation Mode</FormLabel>
                            <FormDescription className="mb-2">
                              Please specify the other operation mode(s) used in your environment
                            </FormDescription>
                            <FormControl>
                              <Input placeholder="Enter other operation mode" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
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
                                            const newValue = checked
                                              ? [...field.value, option.id]
                                              : field.value?.filter(
                                                  (value) => value !== option.id
                                                );
                                            
                                            // Set the showCustomOperationMode based on whether "other" is selected
                                            if (option.id === 'other') {
                                              form.setValue('showCustomOperationMode', checked);
                                            }
                                            
                                            return field.onChange(newValue);
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
                        
                        <FormField
                          control={form.control}
                          name="operatingSystems"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Operating Systems</FormLabel>
                              <FormDescription className="mb-2">
                                Select the operating systems used in your environment
                              </FormDescription>
                              <div className="border rounded-md p-4 max-h-80 overflow-y-auto">
                                <div className="space-y-6">
                                  {/* Windows OS Section */}
                                  <div>
                                    <h4 className="text-md font-medium mb-2">Windows</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {operatingSystemOptions
                                        .filter(os => os.category === "Windows Server" || os.category === "Windows Client")
                                        .map(os => (
                                          <FormItem key={os.id} className="flex items-center space-x-2">
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(os.id)}
                                                onCheckedChange={(checked) => {
                                                  const newValues = handleOsCheckboxChange(field.value, os, checked === true);
                                                  field.onChange(newValues);
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal text-sm">
                                              {os.label}
                                            </FormLabel>
                                          </FormItem>
                                        ))}
                                    </div>
                                  </div>
                                  
                                  {/* Linux Distributions */}
                                  <div>
                                    <h4 className="text-md font-medium mb-2">Linux Distributions</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {operatingSystemOptions
                                        .filter(os => 
                                          os.category === "Red Hat Family" || 
                                          os.category === "Debian Family" || 
                                          os.category === "SUSE Family" || 
                                          os.category === "Other Linux"
                                        )
                                        .map(os => (
                                          <FormItem key={os.id} className="flex items-center space-x-2">
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(os.id)}
                                                onCheckedChange={(checked) => {
                                                  const newValues = handleOsCheckboxChange(field.value, os, checked === true);
                                                  field.onChange(newValues);
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal text-sm">
                                              {os.label}
                                            </FormLabel>
                                          </FormItem>
                                        ))}
                                    </div>
                                  </div>
                                  
                                  {/* Unix-Based OS */}
                                  <div>
                                    <h4 className="text-md font-medium mb-2">Unix-Based OS</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {operatingSystemOptions
                                        .filter(os => os.category === "Unix-Based OS")
                                        .map(os => (
                                          <FormItem key={os.id} className="flex items-center space-x-2">
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(os.id)}
                                                onCheckedChange={(checked) => {
                                                  const newValues = handleOsCheckboxChange(field.value, os, checked === true);
                                                  field.onChange(newValues);
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal text-sm">
                                              {os.label}
                                            </FormLabel>
                                          </FormItem>
                                        ))}
                                    </div>
                                  </div>
                                  
                                  {/* Cloud/Container OS */}
                                  <div>
                                    <h4 className="text-md font-medium mb-2">Cloud/Container OS</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {operatingSystemOptions
                                        .filter(os => os.category === "Cloud/Container OS")
                                        .map(os => (
                                          <FormItem key={os.id} className="flex items-center space-x-2">
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(os.id)}
                                                onCheckedChange={(checked) => {
                                                  const newValues = handleOsCheckboxChange(field.value, os, checked === true);
                                                  field.onChange(newValues);
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal text-sm">
                                              {os.label}
                                            </FormLabel>
                                          </FormItem>
                                        ))}
                                    </div>
                                  </div>
                                  
                                  {/* Network/Embedded OS & Mobile OS */}
                                  <div>
                                    <h4 className="text-md font-medium mb-2">Network/Embedded OS & Mobile</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {operatingSystemOptions
                                        .filter(os => os.category === "Network/Embedded OS" || os.category === "Mobile OS")
                                        .map(os => (
                                          <FormItem key={os.id} className="flex items-center space-x-2">
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(os.id)}
                                                onCheckedChange={(checked) => {
                                                  const newValues = handleOsCheckboxChange(field.value, os, checked === true);
                                                  field.onChange(newValues);
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal text-sm">
                                              {os.label}
                                            </FormLabel>
                                          </FormItem>
                                        ))}
                                    </div>
                                  </div>
                                  
                                  {/* Legacy/Other OS Section */}
                                  <div>
                                    <h4 className="text-md font-medium mb-2">Legacy/Other Operating Systems</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                      {operatingSystemOptions
                                        .filter(os => os.category === "Legacy/Other")
                                        .map(os => (
                                          <FormItem key={os.id} className="flex items-center space-x-2">
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(os.id)}
                                                onCheckedChange={(checked) => {
                                                  const newValues = handleOsCheckboxChange(field.value, os, checked === true);
                                                  field.onChange(newValues);
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal text-sm">
                                              {os.label}
                                            </FormLabel>
                                          </FormItem>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <FormDescription className="mt-2">
                                CIS benchmarks and security configurations will be customized based on your OS selection.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Custom OS input field that appears when any "Other" OS option is checked */}
                        {form.watch("showCustomOperatingSystem") && (
                          <FormField
                            control={form.control}
                            name="customOperatingSystem"
                            render={({ field }) => (
                              <FormItem className="mt-4">
                                <FormLabel>Custom Operating System Details</FormLabel>
                                <FormDescription className="mb-2">
                                  Please provide details about any custom, legacy, or other operating systems you selected above. 
                                  Include version numbers, edition information, and any special configurations.
                                </FormDescription>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Example: 'Other Windows Server' - Windows Server 2003 R2 Standard, still used for legacy application X. 'Other Unix OS' - HP-UX 11i v2 running on critical financial systems." 
                                    className="min-h-[100px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
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
                    {/* Security Frameworks by Family */}
                    <div>
                      <h4 className="font-medium text-lg border-b pb-2 mb-4 text-red-600">
                        <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2"></span>
                        Security Frameworks <span className="text-sm font-normal">(Standards)</span>
                      </h4>
                      
                      {/* Group standards by family */}
                      {Array.from(new Set(complianceFrameworkOptions
                          .filter(option => option.type === "standard" && option.family)
                          .map(option => option.family)))
                        .sort()
                        .map(family => (
                          <div key={family} className="mb-6">
                            <h5 className="font-medium text-md border-b pb-1 mb-3 text-primary">
                              {family}
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {complianceFrameworkOptions
                                .filter(option => option.type === "standard" && option.family === family)
                                .map((option) => (
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
                                ))}
                            </div>
                          </div>
                        ))
                      }
                      
                      {/* Handle standards without a family (backwards compatibility) */}
                      {complianceFrameworkOptions.filter(option => option.type === "standard" && !option.family).length > 0 && (
                        <div className="mb-6">
                          <h5 className="font-medium text-md border-b pb-1 mb-3 text-primary">
                            Other Standards
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {complianceFrameworkOptions
                              .filter(option => option.type === "standard" && !option.family)
                              .map((option) => (
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
                              ))}
                          </div>
                        </div>
                      )}
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
                    <span className="text-orange-600 font-medium">Note: This section focuses on MITRE ATT&CK for infrastructure operations - separate from STRIDE Architecture Threat Modeling.</span> Select the most relevant MITRE ATT&CK tactics and techniques based on your infrastructure operation mode.
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
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-blue-50">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes("TA0007")}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), "TA0007"]
                                      : (field.value || [])?.filter(
                                          (value) => value !== "TA0007"
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium">Discovery (TA0007)</FormLabel>
                                <FormDescription>
                                  Gaining knowledge about the system and internal network
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
                          <h5 className="font-medium">Discovery (TA0007)</h5>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li>• Network Service Scanning (T1046)</li>
                            <li>• Account Discovery (T1087)</li>
                            <li>• Permission Groups Discovery (T1069)</li>
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
                    
                    <div className="mt-8 border-t pt-8">
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">Architecture Threat Modeling (STRIDE)</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        <span className="text-orange-600 font-medium">Note: This is separate from MITRE ATT&CK and uses the STRIDE methodology.</span> Architecture diagrams are essential for comprehensive threat modeling using the STRIDE methodology. Upload any existing architecture diagrams to enhance your security assessment.
                      </p>
                      
                      <FormField
                        control={form.control}
                        name="hasArchitectureDiagrams"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange}
                                />
                                <FormLabel className="font-medium">
                                  We have architecture diagrams available for this assessment
                                </FormLabel>
                              </div>
                            </FormControl>
                            <FormDescription className="ml-6 mt-1">
                              Architecture diagrams enable the Architecture Threat Modeling component of SOS²A assessment
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("hasArchitectureDiagrams") && (
                        <div className="ml-6 mb-6 p-4 border border-dashed rounded-md bg-muted/50">
                          <h5 className="font-medium mb-2">Upload Architecture Diagrams</h5>
                          <p className="text-sm text-muted-foreground mb-3">
                            Upload diagrams in PNG, JPG, PDF format. Include network diagrams, data flow diagrams, application architecture, etc.
                          </p>
                          <div className="flex items-center justify-center w-full">
                            <label htmlFor="architecture-diagrams" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/30">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF (MAX. 10MB per file)</p>
                              </div>
                              <input 
                                id="architecture-diagrams" 
                                type="file" 
                                className="hidden" 
                                accept=".png,.jpg,.jpeg,.pdf"
                                multiple
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    const fileArray = Array.from(e.target.files);
                                    form.setValue('architectureDiagramFiles', fileArray);
                                  }
                                }}
                              />
                            </label>
                          </div>
                          
                          {/* Display uploaded files */}
                          {form.watch('architectureDiagramFiles') && form.watch('architectureDiagramFiles').length > 0 && (
                            <div className="mt-4">
                              <h6 className="text-sm font-medium mb-2">Uploaded Diagrams:</h6>
                              <ul className="text-sm space-y-1">
                                {Array.from(form.watch('architectureDiagramFiles')).map((file, index) => (
                                  <li key={index} className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <h5 className="font-medium mb-2">Architecture Threat Modeling Impact</h5>
                        <p className="text-sm text-muted-foreground mb-4">
                          <span className="text-orange-600 font-medium">This uses the STRIDE methodology, which is distinct from MITRE ATT&CK:</span> Architecture diagram analysis enables comprehensive threat modeling through STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege).
                        </p>
                        <div className="bg-purple-50 rounded-md p-3 border border-purple-100">
                          <p className="text-sm text-purple-800">
                            <span className="font-medium">Note:</span> If no architecture diagrams are provided, the Architecture Threat Modeling component will be marked as "Cannot be assessed" in your report. Your final score will be calculated based on the remaining components.
                          </p>
                        </div>
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
                    {/* Section 1: Business Information */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">1. Business Information</h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            const element = document.querySelector('[data-value="business"]');
                            if (element instanceof HTMLElement) {
                              element.click();
                            }
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Business Name:</div>
                          <div>{form.getValues("businessName")}</div>
                          
                          <div className="font-medium">Business Address:</div>
                          <div>{form.getValues("businessAddress")}</div>
                          
                          <div className="font-medium">Location:</div>
                          <div>{[
                            form.getValues("businessLocation.state"),
                            form.getValues("businessLocation.country"),
                            form.getValues("businessLocation.zipCode")
                          ].filter(Boolean).join(", ")}</div>
                          
                          <div className="font-medium">Industry:</div>
                          <div>{form.getValues("industry") === "other" ? form.getValues("customIndustry") : form.getValues("industry")}</div>
                          
                          <div className="font-medium">Employee Count:</div>
                          <div>{form.getValues("employeeCount")}</div>
                          
                          <div className="font-medium">Business Services:</div>
                          <div>{form.getValues("businessServices")}</div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2-3: Infrastructure and Configuration */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">2-3. Infrastructure & Configuration</h4>
                        <div className="space-x-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={() => document.querySelector('[data-value="infrastructure"]')?.click()}
                          >
                            Edit Infrastructure
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={() => document.querySelector('[data-value="baseline"]')?.click()}
                          >
                            Edit Configuration
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Operation Mode:</div>
                          <div>{form.getValues("operationMode").join(", ") || "None selected"}</div>
                          
                          {form.getValues("showCustomOperationMode") && (
                            <>
                              <div className="font-medium">Custom Operation Mode:</div>
                              <div>{form.getValues("customOperationMode") || "Not specified"}</div>
                            </>
                          )}
                          
                          <div className="font-medium">Internet Presence:</div>
                          <div>{form.getValues("internetPresence").join(", ") || "None selected"}</div>
                          
                          <div className="font-medium">Configuration Management:</div>
                          <div>{form.getValues("configurationManagement") || "Not specified"}</div>
                          
                          <div className="font-medium">Operating Systems:</div>
                          <div className="text-xs">
                            {form.getValues("operatingSystems")?.length > 0 
                              ? form.getValues("operatingSystems").map(osId => {
                                  const os = operatingSystemOptions.find(o => o.id === osId);
                                  return os ? os.label : osId;
                                }).join(", ") 
                              : "None selected"}
                          </div>
                          
                          {form.getValues("showCustomOperatingSystem") && (
                            <>
                              <div className="font-medium">Custom OS Details:</div>
                              <div className="text-xs">{form.getValues("customOperatingSystem") || "Not specified"}</div>
                            </>
                          )}
                          
                          <div className="font-medium">System Hardening Approach:</div>
                          <div>{form.getValues("systemHardeningApproach") || "Not specified"}</div>
                          
                          <div className="font-medium">CIS Benchmark & Version:</div>
                          <div>{form.getValues("primaryCisBenchmark") ? `${form.getValues("primaryCisBenchmark")} ${form.getValues("cisVersion") || ""}` : "Not specified"}</div>
                          
                          <div className="font-medium">CIS Benchmarks:</div>
                          <div>{form.getValues("cisBenchmarks")?.length > 0 ? form.getValues("cisBenchmarks").join(", ") : "None selected"}</div>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Security Control Framework */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">4. Security Control Framework</h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => document.querySelector('[data-value="security"]')?.click()}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Security Measures:</div>
                          <div>{form.getValues("securityMeasures").length > 0 ? form.getValues("securityMeasures").join(", ") : "None selected"}</div>
                          
                          <div className="font-medium">Primary Concerns:</div>
                          <div>{form.getValues("primaryConcerns").length > 0 ? form.getValues("primaryConcerns").join(", ") : "None selected"}</div>
                          
                          <div className="font-medium">Operations Frameworks:</div>
                          <div>{form.getValues("frameworks.operations").length > 0 ? form.getValues("frameworks.operations").join(", ") : "None selected"}</div>
                          
                          <div className="font-medium">Management Frameworks:</div>
                          <div>{form.getValues("frameworks.management").length > 0 ? form.getValues("frameworks.management").join(", ") : "None selected"}</div>
                          
                          <div className="font-medium">Technology Frameworks:</div>
                          <div>{form.getValues("frameworks.technology").length > 0 ? form.getValues("frameworks.technology").join(", ") : "None selected"}</div>
                          
                          <div className="font-medium">People Frameworks:</div>
                          <div>{form.getValues("frameworks.people").length > 0 ? form.getValues("frameworks.people").join(", ") : "None selected"}</div>
                        </div>
                      </div>
                    </div>

                    {/* Section 5-7: Compliance, Regulatory, Standards */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">5-7. Compliance & Standards</h4>
                        <div className="space-x-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={() => document.querySelector('[data-value="compliance"]')?.click()}
                          >
                            Edit Compliance
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={() => document.querySelector('[data-value="regulatory"]')?.click()}
                          >
                            Edit Regulatory
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={() => document.querySelector('[data-value="standards"]')?.click()}
                          >
                            Edit Standards
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              // Find the standards tab and click it first
                              document.querySelector('[data-value="standards"]')?.click();
                              // Then scroll to guidelines section
                              setTimeout(() => {
                                const guidelinesSection = document.getElementById('guidelines-section');
                                if (guidelinesSection) {
                                  guidelinesSection.scrollIntoView({ behavior: 'smooth' });
                                }
                              }, 100);
                            }}
                          >
                            Edit Guidelines
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Compliance Frameworks:</div>
                          <div>{form.getValues("complianceRequirements.frameworks").length > 0 ? 
                                form.getValues("complianceRequirements.frameworks").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">Compliance Standards:</div>
                          <div>{form.getValues("complianceRequirements.standards").length > 0 ? 
                                form.getValues("complianceRequirements.standards").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">Compliance Requirements:</div>
                          <div>{form.getValues("complianceRequirements.compliance").length > 0 ? 
                                form.getValues("complianceRequirements.compliance").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">Regulatory Requirements:</div>
                          <div>{form.getValues("regulatoryRequirements")?.length > 0 ? 
                                form.getValues("regulatoryRequirements").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">Healthcare Standards:</div>
                          <div>{form.getValues("healthcareStandards")?.length > 0 ? 
                                form.getValues("healthcareStandards").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">Security Guidelines:</div>
                          <div>{form.getValues("securityGuidelines")?.length > 0 ? 
                                form.getValues("securityGuidelines").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">Healthcare Guidelines:</div>
                          <div>{form.getValues("healthcareGuidelines")?.length > 0 ? 
                                form.getValues("healthcareGuidelines").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">Privacy Guidelines:</div>
                          <div>{form.getValues("privacyGuidelines")?.length > 0 ? 
                                form.getValues("privacyGuidelines").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">Government Guidelines:</div>
                          <div>{form.getValues("governmentGuidelines")?.length > 0 ? 
                                form.getValues("governmentGuidelines").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">Cloud/IoT Guidelines:</div>
                          <div>{form.getValues("cloudIotGuidelines")?.length > 0 ? 
                                form.getValues("cloudIotGuidelines").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">Operational Guidelines:</div>
                          <div>{form.getValues("operationalGuidelines")?.length > 0 ? 
                                form.getValues("operationalGuidelines").join(", ") : 
                                "None selected"}</div>
                        </div>
                      </div>
                    </div>

                    {/* Section 8: ACQ Tools */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">8. Assessment, Checklist & Questionnaire Tools</h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => document.querySelector('[data-value="acq-tools"]')?.click()}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Assessments:</div>
                          <div>{form.getValues("relevantACQTools.assessments")?.length > 0 ? 
                                form.getValues("relevantACQTools.assessments").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">Checklists:</div>
                          <div>{form.getValues("relevantACQTools.checklists")?.length > 0 ? 
                                form.getValues("relevantACQTools.checklists").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">Questionnaires:</div>
                          <div>{form.getValues("relevantACQTools.questionnaires")?.length > 0 ? 
                                form.getValues("relevantACQTools.questionnaires").join(", ") : 
                                "None selected"}</div>
                        </div>
                      </div>
                    </div>

                    {/* Section 9: Adversarial Insight */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">9. Adversarial Insight (MITRE ATT&CK)</h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => document.querySelector('[data-value="adversarial"]')?.click()}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">STIG Implementation:</div>
                          <div>{form.getValues("osHardening.stig") ? "Yes" : "No"}</div>
                          
                          <div className="font-medium">SCAP Implementation:</div>
                          <div>{form.getValues("osHardening.scap") ? "Yes" : "No"}</div>
                          
                          <div className="font-medium">OS Hardening Guidelines:</div>
                          <div>{form.getValues("osHardening.guidelines")?.length > 0 ? 
                                form.getValues("osHardening.guidelines").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">MITRE ATT&CK Techniques:</div>
                          <div>{form.getValues("adversarialInsights.mitreAttackIds")?.length > 0 ? 
                                form.getValues("adversarialInsights.mitreAttackIds").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">Threat Actors:</div>
                          <div>{form.getValues("threatActors")?.length > 0 ? 
                                form.getValues("threatActors").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">Threat Actor Types:</div>
                          <div>{form.getValues("threatActorTypes")?.length > 0 ? 
                                form.getValues("threatActorTypes").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">MITRE Tactics:</div>
                          <div>{form.getValues("mitreTactics")?.length > 0 ? 
                                form.getValues("mitreTactics").join(", ") : 
                                "None selected"}</div>
                        </div>
                      </div>
                    </div>

                    {/* Section 10: ISMS */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">10. Information Security Management System (ISMS)</h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => document.querySelector('[data-value="isms"]')?.click()}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">ISMS Implementation Status:</div>
                          <div>{form.getValues("ismsImplementation") || "Not specified"}</div>
                          
                          <div className="font-medium">ISMS Policies:</div>
                          <div>{form.getValues("ismsPolicies")?.length > 0 ? 
                                form.getValues("ismsPolicies").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">ISMS Plans:</div>
                          <div>{form.getValues("ismsPlans")?.length > 0 ? 
                                form.getValues("ismsPlans").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">ISMS Procedures:</div>
                          <div>{form.getValues("ismsProcedures")?.length > 0 ? 
                                form.getValues("ismsProcedures").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">ISMS Processes:</div>
                          <div>{form.getValues("ismsProcesses")?.length > 0 ? 
                                form.getValues("ismsProcesses").join(", ") : 
                                "None selected"}</div>
                                
                          <div className="font-medium">Executive Support:</div>
                          <div>{form.getValues("ismsLeadership.executiveSupport") ? "Yes" : "No"}</div>
                          
                          <div className="font-medium">CISO Appointed:</div>
                          <div>{form.getValues("ismsLeadership.ciso") ? "Yes" : "No"}</div>
                          
                          <div className="font-medium">Board Reporting:</div>
                          <div>{form.getValues("ismsLeadership.boardReporting") ? "Yes" : "No"}</div>
                          
                          <div className="font-medium">Security Committee:</div>
                          <div>{form.getValues("ismsLeadership.securityCommittee") ? "Yes" : "No"}</div>
                        </div>
                      </div>
                    </div>

                    {/* Section 11: Contact Information */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">11. Contact Information</h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => document.querySelector('[data-value="contact"]')?.click()}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Contact Name:</div>
                          <div>{form.getValues("contactInfo.name")}</div>
                          
                          <div className="font-medium">Point of Contact:</div>
                          <div>{form.getValues("contactInfo.pointOfContact")}</div>
                          
                          <div className="font-medium">Contact Email:</div>
                          <div>{form.getValues("contactInfo.contactEmail")}</div>
                          
                          <div className="font-medium">Email:</div>
                          <div>{form.getValues("contactInfo.email")}</div>
                          
                          <div className="font-medium">Phone:</div>
                          <div>{form.getValues("contactInfo.phone")}</div>
                        </div>
                      </div>
                    </div>

                    {/* Assessment Type */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">Assessment Type</h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => document.querySelector('[data-value="contact"]')?.click()}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Selected Assessment Type:</div>
                          <div>{form.getValues("reportType") === "preliminary" ? "Preliminary Assessment" : "Comprehensive Assessment"}</div>
                          
                          <div className="font-medium">Availability for Interview:</div>
                          <div>{form.getValues("availabilityConfirmation") ? "Confirmed" : "Not confirmed"}</div>
                          
                          <div className="font-medium">Referral Permission:</div>
                          <div>{form.getValues("referralPermission") ? "Yes" : "No"}</div>
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
                  
                  <div className="mb-6">
                    <EulaAgreement 
                      isChecked={eulaAccepted}
                      onCheckChange={(checked) => {
                        setEulaAccepted(checked);
                        form.setValue("eulaAccepted", checked);
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-center w-full">
                    <Button 
                      type="submit" 
                      className="bg-[#7936b0] hover:bg-[#6b2aa2] text-white font-medium text-lg py-4 w-full"
                      disabled={!eulaAccepted}
                      onClick={() => {
                        console.log("Submit button clicked directly");
                        console.log("Form is valid:", form.formState.isValid);
                        console.log("Form errors:", form.formState.errors);
                        
                        // If there are validation errors, display them
                        if (Object.keys(form.formState.errors).length > 0) {
                          console.error("Form validation errors:", form.formState.errors);
                        }
                      }}
                    >
                      Submit Questionnaire
                    </Button>
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