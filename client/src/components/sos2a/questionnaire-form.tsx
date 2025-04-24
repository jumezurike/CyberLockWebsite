import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Sos2aFormData } from "@/lib/sos2a-types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessAddress: z.string().min(5, "Business address is required"),
  businessLocation: z.object({
    state: z.string().min(2, "State or province is required"),
    country: z.string().min(2, "Country is required"),
  }),
  industry: z.string().min(1, "Please select your industry"),
  employeeCount: z.string().min(1, "Please select employee count"),
  businessServices: z.string().min(5, "Please describe the business services you offer"),
  operationMode: z.array(z.string()).min(1, "Please select at least one mode of operation"),
  internetPresence: z.array(z.string()).min(1, "Please select at least one internet presence type"),
  securityMeasures: z.array(z.string()).min(1, "Please select at least one security measure"),
  primaryConcerns: z.array(z.string()).min(1, "Please select at least one primary concern"),
  frameworks: z.object({
    operations: z.array(z.string()).optional(),
    management: z.array(z.string()).optional(),
    technology: z.array(z.string()).optional(),
  }),
  complianceRequirements: z.object({
    frameworks: z.array(z.string()).optional(),
    standards: z.array(z.string()).optional(),
    compliance: z.array(z.string()).optional(),
    regulations: z.array(z.string()).optional(),
  }),
  policyDocuments: z.object({
    policies: z.array(z.string()).optional(),
    procedures: z.array(z.string()).optional(),
    plans: z.array(z.string()).optional(),
    guides: z.array(z.string()).optional(),
  }),
  osHardening: z.object({
    stig: z.boolean().optional(),
    scap: z.boolean().optional(),
    guidelines: z.array(z.string()).optional(),
  }),
  adversarialInsights: z.object({
    mitreAttackIds: z.array(z.string()).optional(),
  }),
  contactInfo: z.object({
    name: z.string().min(2, "Contact name is required"),
    pointOfContact: z.string().min(2, "Business point of contact is required"),
    email: z.string().email("Invalid email address"),
    contactEmail: z.string().email("Invalid point of contact email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    sameAsContact: z.boolean().optional(),
  }),
  availabilityConfirmation: z.boolean().refine(val => val === true, {
    message: "You must confirm your availability to participate in the assessment within 30 days"
  }),
  referralPermission: z.boolean().refine(val => val === true, {
    message: "You must provide referral permission to proceed with the free assessment"
  }),
});

interface QuestionnaireFormProps {
  formData: Sos2aFormData;
  updateFormData: (data: Partial<Sos2aFormData>) => void;
  onNext: () => void;
}

export default function QuestionnaireForm({ 
  formData, 
  updateFormData, 
  onNext 
}: QuestionnaireFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: formData.businessName || "",
      businessAddress: formData.businessAddress || "",
      businessLocation: formData.businessLocation || {
        state: "",
        country: "",
      },
      industry: formData.industry || "",
      employeeCount: formData.employeeCount || "",
      businessServices: formData.businessServices || "",
      operationMode: formData.operationMode || [],
      internetPresence: formData.internetPresence || [],
      securityMeasures: formData.securityMeasures || [],
      primaryConcerns: formData.primaryConcerns || [],
      frameworks: {
        operations: formData.frameworks?.operations || [],
        management: formData.frameworks?.management || [],
        technology: formData.frameworks?.technology || [],
      },
      complianceRequirements: {
        frameworks: formData.complianceRequirements?.frameworks || [],
        standards: formData.complianceRequirements?.standards || [],
        compliance: formData.complianceRequirements?.compliance || [],
        regulations: formData.complianceRequirements?.regulations || [],
      },
      policyDocuments: {
        policies: formData.policyDocuments?.policies || [],
        procedures: formData.policyDocuments?.procedures || [],
        plans: formData.policyDocuments?.plans || [],
        guides: formData.policyDocuments?.guides || [],
      },
      osHardening: {
        stig: formData.osHardening?.stig || false,
        scap: formData.osHardening?.scap || false,
        guidelines: formData.osHardening?.guidelines || [],
      },
      adversarialInsights: {
        mitreAttackIds: formData.adversarialInsights?.mitreAttackIds || [],
      },
      contactInfo: {
        name: formData.contactInfo?.name || "",
        pointOfContact: formData.contactInfo?.pointOfContact || "",
        email: formData.contactInfo?.email || "",
        contactEmail: formData.contactInfo?.contactEmail || "",
        phone: formData.contactInfo?.phone || "",
        sameAsContact: formData.contactInfo?.sameAsContact || false,
      },
      availabilityConfirmation: formData.availabilityConfirmation || false,
      referralPermission: formData.referralPermission || false,
    },
  });

  const securityMeasures = [
    { id: "firewall", label: "Firewall and VPN Solutions" },
    { id: "endpoint", label: "Endpoint and Device Security (EDR, MDM)" },
    { id: "mfa", label: "Multi-Factor Authentication (MFA)" },
    { id: "backup", label: "Backup and Disaster Recovery" },
    { id: "training", label: "Employee Training on Cybersecurity" },
    { id: "encryption", label: "Data Encryption and DLP Tools" },
    { id: "network", label: "Network Segmentation" },
    { id: "email", label: "Email Filtering and Anti-Phishing Tools" },
    { id: "dns", label: "DNS Filtering and Secure DNS" },
    { id: "cloud", label: "Cloud Security Tools (CASB, WAF)" },
  ];

  const operationModeOptions = [
    { id: "isp-modem", label: "ISP Modem" },
    { id: "mobile-hotspot", label: "Mobile Hotspot" },
    { id: "commercial-internet", label: "Commercial Internet" },
    { id: "dedicated-connection", label: "Dedicated Connection" },
    { id: "satellite", label: "Satellite" },
    { id: "other", label: "Other" },
  ];

  const internetPresenceOptions = [
    { id: "website", label: "Website" },
    { id: "cloud-servers", label: "Servers in the Cloud" },
    { id: "office-servers", label: "Servers in the Office" },
    { id: "hybrid", label: "Hybrid (Cloud & On-Premises)" },
    { id: "minimal", label: "Minimal Presence" },
    { id: "none", label: "No Internet Presence" },
  ];
  
  const primaryConcerns = [
    { id: "data-breach", label: "Data Breaches" },
    { id: "ransomware", label: "Ransomware Attacks" },
    { id: "compliance", label: "Regulatory Compliance" },
    { id: "phishing", label: "Phishing & Social Engineering" },
    { id: "insider", label: "Insider Threats" },
    { id: "malware", label: "Malware & Viruses" },
    { id: "ddos", label: "DDoS Attacks" },
    { id: "third-party", label: "Third-Party/Vendor Risks" },
    { id: "cloud-security", label: "Cloud Security" },
    { id: "remote-work", label: "Remote Work Security" },
  ];

  const securityFrameworks = {
    operations: [
      { id: "nist-csf", label: "NIST CSF" },
      { id: "cis-csc", label: "CIS CSC V8" },
      { id: "cyber-ess-uk", label: "CYBER ESS UK" },
      { id: "cmmc", label: "CMMC" },
      { id: "mitre-attack", label: "MITRE ATT&CK" },
      { id: "pci-dss", label: "PCI-DSS" },
    ],
    management: [
      { id: "nist-csf", label: "NIST CSF" },
      { id: "cis-csc", label: "CIS CSC V8" },
      { id: "cyber-ess-uk", label: "CYBER ESS UK" },
      { id: "cmmc", label: "CMMC" },
      { id: "mitre-attack", label: "MITRE ATT&CK" },
    ],
    technology: [
      { id: "nist-csf", label: "NIST CSF" },
      { id: "cis-csc", label: "CIS CSC V8" },
      { id: "cyber-ess-uk", label: "CYBER ESS UK" },
      { id: "cmmc", label: "CMMC" },
      { id: "mitre-attack", label: "MITRE ATT&CK" },
      { id: "pci-dss", label: "PCI-DSS" },
    ],
  };
  
  const complianceRequirements = {
    frameworks: [
      { id: "nist", label: "NIST" },
      { id: "cis", label: "CIS" },
      { id: "iso", label: "ISO" },
      { id: "cobit", label: "COBIT" },
      { id: "cmmc", label: "CMMC" },
    ],
    standards: [
      { id: "iso-27001", label: "ISO 27001" },
      { id: "iso-27002", label: "ISO 27002" },
      { id: "iso-27017", label: "ISO 27017 (Cloud)" },
      { id: "iso-27018", label: "ISO 27018 (PII)" },
      { id: "ansi", label: "ANSI" },
      { id: "ieee", label: "IEEE" },
    ],
    compliance: [
      { id: "hipaa", label: "HIPAA (Healthcare)" },
      { id: "pci-dss", label: "PCI-DSS (Payment Card)" },
      { id: "sox", label: "SOX (Financial)" },
      { id: "fedramp", label: "FedRAMP (Government)" },
      { id: "fisma", label: "FISMA (Federal)" },
      { id: "ferpa", label: "FERPA (Education)" },
    ],
    regulations: [
      { id: "ccpa", label: "CCPA (California)" },
      { id: "gdpr", label: "GDPR (EU)" },
      { id: "pipeda", label: "PIPEDA (Canada)" },
      { id: "lgpd", label: "LGPD (Brazil)" },
      { id: "coppa", label: "COPPA (Children's Privacy)" },
      { id: "shield", label: "Privacy Shield" },
    ],
  };
  
  const policyDocuments = {
    policies: [
      { id: "acceptable-use", label: "Acceptable Use Policy" },
      { id: "information-security", label: "Information Security Policy" },
      { id: "data-classification", label: "Data Classification Policy" },
      { id: "password", label: "Password Policy" },
      { id: "byod", label: "BYOD Policy" },
      { id: "remote-work", label: "Remote Work Policy" },
    ],
    procedures: [
      { id: "incident-response", label: "Incident Response Procedures" },
      { id: "backup-restore", label: "Backup and Restore Procedures" },
      { id: "access-control", label: "Access Control Procedures" },
      { id: "change-management", label: "Change Management Procedures" },
      { id: "vulnerability-mgmt", label: "Vulnerability Management Procedures" },
      { id: "patching", label: "Patching Procedures" },
    ],
    plans: [
      { id: "disaster-recovery", label: "Disaster Recovery Plan" },
      { id: "business-continuity", label: "Business Continuity Plan" },
      { id: "incident-response-plan", label: "Incident Response Plan" },
      { id: "security-awareness", label: "Security Awareness Training Plan" },
      { id: "data-breach", label: "Data Breach Response Plan" },
    ],
    guides: [
      { id: "security-baseline", label: "Security Baseline Guides" },
      { id: "hardening", label: "System Hardening Guides" },
      { id: "configuration", label: "Secure Configuration Guides" },
      { id: "admin", label: "Admin Procedure Guides" },
      { id: "user", label: "End User Security Guides" },
    ],
  };
  
  const osHardeningOptions = [
    { id: "stig", label: "Security Technical Implementation Guides (STIG)" },
    { id: "scap", label: "Security Content Automation Protocol (SCAP)" },
    { id: "cis-benchmarks", label: "CIS Benchmarks" },
    { id: "ms-security-baseline", label: "Microsoft Security Baseline" },
    { id: "nist-800-53", label: "NIST 800-53 Controls" },
    { id: "nist-800-171", label: "NIST 800-171 Controls" },
  ];

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFormData(values);
    onNext();
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-primary">Step 1: Questionnaire</h2>
      <p className="mb-6 text-neutral-600">
        Please complete this initial questionnaire to help us understand your business and cybersecurity needs.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              name="businessLocation.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your state or province" {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="usa">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "usa" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          United States
                        </div>
                      </SelectItem>
                      <SelectItem value="canada">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "canada" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          Canada
                        </div>
                      </SelectItem>
                      <SelectItem value="uk">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "uk" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          United Kingdom
                        </div>
                      </SelectItem>
                      <SelectItem value="eu">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "eu" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          European Union
                        </div>
                      </SelectItem>
                      <SelectItem value="other">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "other" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          Other
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="finance">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "finance" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          Financial Services
                        </div>
                      </SelectItem>
                      <SelectItem value="healthcare">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "healthcare" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          Healthcare
                        </div>
                      </SelectItem>
                      <SelectItem value="retail">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "retail" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          Retail
                        </div>
                      </SelectItem>
                      <SelectItem value="manufacturing">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "manufacturing" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          Manufacturing
                        </div>
                      </SelectItem>
                      <SelectItem value="technology">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "technology" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          Technology
                        </div>
                      </SelectItem>
                      <SelectItem value="education">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "education" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          Education
                        </div>
                      </SelectItem>
                      <SelectItem value="government">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "government" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          Government
                        </div>
                      </SelectItem>
                      <SelectItem value="nonprofit">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "nonprofit" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          Non-Profit
                        </div>
                      </SelectItem>
                      <SelectItem value="other">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "other" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          Other
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1-10">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "1-10" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          1-10
                        </div>
                      </SelectItem>
                      <SelectItem value="11-50">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "11-50" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          11-50
                        </div>
                      </SelectItem>
                      <SelectItem value="51-200">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "51-200" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          51-200
                        </div>
                      </SelectItem>
                      <SelectItem value="201-500">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "201-500" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          201-500
                        </div>
                      </SelectItem>
                      <SelectItem value="500+">
                        <div className="flex items-center gap-2">
                          <div className={`${field.value === "500+" ? "visible" : "invisible"} text-primary`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          500+
                        </div>
                      </SelectItem>
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
                  <FormLabel>Business Services</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What type of business services do you offer?"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="operationMode"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Mode of Operation (select all that apply)</FormLabel>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {operationModeOptions.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="operationMode"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {item.label}
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
            </div>
            
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="internetPresence"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Internet Presence (select all that apply)</FormLabel>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {internetPresenceOptions.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="internetPresence"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {item.label}
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
            </div>

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="securityMeasures"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Current Security Measures (select all that apply)</FormLabel>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {securityMeasures.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="securityMeasures"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {item.label}
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
            </div>

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="primaryConcerns"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Primary Concerns (select all that apply)</FormLabel>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {primaryConcerns.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="primaryConcerns"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {item.label}
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
            </div>

            <div className="md:col-span-2 mt-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="text-lg font-medium mb-4 text-primary">Security Framework Controls</h3>
              <p className="mb-4 text-slate-600">Select the security frameworks applicable to your business across these domains:</p>
              
              {/* Operations Frameworks */}
              <div className="mb-8">
                <h4 className="text-md font-semibold mb-3 text-slate-800">Operations Domain</h4>
                <FormField
                  control={form.control}
                  name="frameworks.operations"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {securityFrameworks.operations.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="frameworks.operations"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {item.label}
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
              </div>
              
              {/* Management Frameworks */}
              <div className="mb-8">
                <h4 className="text-md font-semibold mb-3 text-slate-800">Management Domain</h4>
                <FormField
                  control={form.control}
                  name="frameworks.management"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {securityFrameworks.management.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="frameworks.management"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {item.label}
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
              </div>
              
              {/* Technology Frameworks */}
              <div>
                <h4 className="text-md font-semibold mb-3 text-slate-800">Technology Domain</h4>
                <FormField
                  control={form.control}
                  name="frameworks.technology"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {securityFrameworks.technology.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="frameworks.technology"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {item.label}
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
              </div>
            </div>

            <div className="md:col-span-2 mt-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="text-lg font-medium mb-4 text-primary">Compliance Requirements</h3>
              <p className="mb-4 text-slate-600">Select the compliance requirements applicable to your business:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Compliance Frameworks */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold mb-3 text-slate-800">Frameworks</h4>
                  <FormField
                    control={form.control}
                    name="complianceRequirements.frameworks"
                    render={() => (
                      <FormItem>
                        <div className="space-y-2">
                          {complianceRequirements.frameworks.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="complianceRequirements.frameworks"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {item.label}
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
                </div>
                
                {/* Compliance Standards */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold mb-3 text-slate-800">Standards</h4>
                  <FormField
                    control={form.control}
                    name="complianceRequirements.standards"
                    render={() => (
                      <FormItem>
                        <div className="space-y-2">
                          {complianceRequirements.standards.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="complianceRequirements.standards"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {item.label}
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
                </div>
                
                {/* Compliance Regulations */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold mb-3 text-slate-800">Compliance</h4>
                  <FormField
                    control={form.control}
                    name="complianceRequirements.compliance"
                    render={() => (
                      <FormItem>
                        <div className="space-y-2">
                          {complianceRequirements.compliance.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="complianceRequirements.compliance"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {item.label}
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
                </div>
                
                {/* Regulations */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold mb-3 text-slate-800">Regulations</h4>
                  <p className="text-xs text-slate-500 mb-2">Location-based regulations will be automatically suggested based on your business location</p>
                  <FormField
                    control={form.control}
                    name="complianceRequirements.regulations"
                    render={() => (
                      <FormItem>
                        <div className="space-y-2">
                          {complianceRequirements.regulations.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="complianceRequirements.regulations"
                              render={({ field }) => {
                                // Highlight California regulations if state is California
                                const isHighlighted = 
                                  (item.id === "ccpa" && form.getValues("businessLocation")?.state?.toLowerCase().includes("california"));
                                
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <div>
                                      <FormLabel className={`font-normal cursor-pointer ${isHighlighted ? 'text-primary font-medium' : ''}`}>
                                        {item.label} {isHighlighted && '(Recommended)'}
                                      </FormLabel>
                                      {isHighlighted && (
                                        <p className="text-xs text-primary">Required for businesses in California</p>
                                      )}
                                    </div>
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
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 mt-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="text-lg font-medium mb-4 text-primary">Policy Documents</h3>
              <p className="mb-4 text-slate-600">Select the policy documents you currently have in place:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Policies */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold mb-3 text-slate-800">Policies</h4>
                  <FormField
                    control={form.control}
                    name="policyDocuments.policies"
                    render={() => (
                      <FormItem>
                        <div className="space-y-2">
                          {policyDocuments.policies.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="policyDocuments.policies"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {item.label}
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
                </div>
                
                {/* Procedures */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold mb-3 text-slate-800">Procedures</h4>
                  <FormField
                    control={form.control}
                    name="policyDocuments.procedures"
                    render={() => (
                      <FormItem>
                        <div className="space-y-2">
                          {policyDocuments.procedures.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="policyDocuments.procedures"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {item.label}
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
                </div>
                
                {/* Plans */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold mb-3 text-slate-800">Plans</h4>
                  <FormField
                    control={form.control}
                    name="policyDocuments.plans"
                    render={() => (
                      <FormItem>
                        <div className="space-y-2">
                          {policyDocuments.plans.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="policyDocuments.plans"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {item.label}
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
                </div>
                
                {/* Guides */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold mb-3 text-slate-800">Guides</h4>
                  <FormField
                    control={form.control}
                    name="policyDocuments.guides"
                    render={() => (
                      <FormItem>
                        <div className="space-y-2">
                          {policyDocuments.guides.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="policyDocuments.guides"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {item.label}
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
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 mt-6 p-6 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="text-lg font-medium mb-4 text-primary">OS Hardening</h3>
              <p className="mb-4 text-slate-600">Select the OS hardening standards you currently implement:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormField
                    control={form.control}
                    name="osHardening.stig"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-md font-medium cursor-pointer">
                            Security Technical Implementation Guides (STIG)
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Department of Defense standards for secure installations
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <FormField
                    control={form.control}
                    name="osHardening.scap"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-md font-medium cursor-pointer">
                            Security Content Automation Protocol (SCAP)
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Automated vulnerability management, measurement, and policy compliance
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-md font-semibold mb-3 text-slate-800">Additional Guidelines</h4>
                <FormField
                  control={form.control}
                  name="osHardening.guidelines"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {osHardeningOptions.slice(2).map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="osHardening.guidelines"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {item.label}
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
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-4 text-primary">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactInfo.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contactInfo.sameAsContact"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              
                              // If checked, copy the name to point of contact
                              if (checked) {
                                const yourName = form.getValues().contactInfo.name;
                                const yourEmail = form.getValues().contactInfo.email;
                                
                                form.setValue("contactInfo.pointOfContact", yourName);
                                form.setValue("contactInfo.contactEmail", yourEmail);
                              }
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal cursor-pointer">
                            I am the business point of contact
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactInfo.pointOfContact"
                    render={({ field }) => {
                      const { sameAsContact } = form.getValues().contactInfo;
                      
                      return (
                        <FormItem>
                          <FormLabel>Business Point of Contact</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Name of business point of contact" 
                              {...field} 
                              disabled={sameAsContact === true}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="contactInfo.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email address" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactInfo.contactEmail"
                  render={({ field }) => {
                    const { sameAsContact } = form.getValues().contactInfo;
                    
                    return (
                      <FormItem>
                        <FormLabel>Point of Contact Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Email for point of contact" 
                            type="email" 
                            {...field} 
                            disabled={sameAsContact === true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="contactInfo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Business phone number (with area code)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-4 text-primary">Participation Agreements</h3>
              
              <FormField
                control={form.control}
                name="availabilityConfirmation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal cursor-pointer">
                        I confirm that I would be available to complete this assessment within 30 days if chosen.
                      </FormLabel>
                      <FormMessage />
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
                      <FormLabel className="font-normal cursor-pointer">
                        As part of the free SOS²A assessment, I agree that my organization will remain accessible 
                        to those who may inquire about the program based on our participation.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button type="submit" className="bg-secondary hover:bg-orange-600">
              Continue to Interview & Matrix Population
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
