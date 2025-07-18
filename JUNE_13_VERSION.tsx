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
  const [currentTab, setCurrentTab] = useState("business");
  const { toast } = useToast();

  // Tab order for navigation
  const tabOrder = [
    "business", "infrastructure", "risks", "baseline", 
    "security", "compliance", "regulatory", "standards",
    "acq-tools", "adversarial", "isms", "device-inventory",
    "identity-behavior", "contact", "review"
  ];

  // Navigation functions
  const nextTab = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex < tabOrder.length - 1) {
      setCurrentTab(tabOrder[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabOrder[currentIndex - 1]);
    }
  };
  
  // Independent device inventory state
  const [deviceInventory, setDeviceInventory] = useState<any[]>([]);
  const [deviceTypeFilter, setDeviceTypeFilter] = useState("all-types");

  // Default matrix configuration
  const defaultMatrixConfig = [
    // Driver's License Components
    { component: "Full Name (Driver License)", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: false },
    { component: "Driver License Number", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: false },
    { component: "Date of Birth (Driver License)", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: false },
    { component: "Address (Driver License)", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: false },
    { component: "Photo (Driver License)", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: false },
    { component: "Signature (Driver License)", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: false },
    { component: "Height/Weight (Driver License)", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: false },
    { component: "Eye Color (Driver License)", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: false },
    { component: "Expiration Date (Driver License)", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: false },
    
    // Passport Components
    { component: "Passport Number", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: false },
    { component: "Country of Issue (Passport)", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: false },
    { component: "Place of Birth (Passport)", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: false },
    { component: "Nationality (Passport)", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: false },
    { component: "MRZ Code (Passport)", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: false },
    
    // Social Security/National ID Components
    { component: "Social Security Number", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: true },
    { component: "National ID Number", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: true },
    { component: "Tax ID/EIN", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: true },
    
    // Device/Machine Components
    { component: "Device Serial Number", human: false, machinePhysical: true, machineVirtual: false, api: false, thirdParty: false },
    { component: "MAC Address", human: false, machinePhysical: true, machineVirtual: true, api: true, thirdParty: false },
    { component: "IMEI Number", human: false, machinePhysical: true, machineVirtual: false, api: false, thirdParty: false },
    { component: "Device Model Number", human: false, machinePhysical: true, machineVirtual: false, api: false, thirdParty: false },
    { component: "Operating System Version", human: false, machinePhysical: true, machineVirtual: true, api: true, thirdParty: false },
    { component: "IP Address", human: false, machinePhysical: true, machineVirtual: true, api: true, thirdParty: false },
    
    // Business/Organization Components
    { component: "Business License Number", human: false, machinePhysical: false, machineVirtual: false, api: false, thirdParty: true },
    { component: "Business Registration Address", human: false, machinePhysical: false, machineVirtual: false, api: false, thirdParty: true },
    { component: "Professional License Number", human: false, machinePhysical: false, machineVirtual: false, api: false, thirdParty: true },
    
    // Biometric Components
    { component: "Fingerprint Hash", human: true, machinePhysical: false, machineVirtual: false, api: false, thirdParty: false },
    { component: "Facial Recognition Hash", human: true, machinePhysical: false, machineVirtual: false, api: true, thirdParty: false },
    
    // Virtual/API Components
    { component: "User Account ID", human: false, machinePhysical: false, machineVirtual: true, api: true, thirdParty: false },
    { component: "API Key Hash", human: false, machinePhysical: false, machineVirtual: true, api: true, thirdParty: false },
    { component: "Digital Certificate Serial", human: false, machinePhysical: false, machineVirtual: true, api: true, thirdParty: false },
    { component: "OAuth Token Hash", human: false, machinePhysical: false, machineVirtual: true, api: true, thirdParty: false }
  ];

  // State for matrix configuration
  const [matrixConfig, setMatrixConfig] = useState(defaultMatrixConfig);
  
  // Identity upload state
  const [uploadedIdentities, setUploadedIdentities] = useState<any[]>([]);
  
  // UWA state management
  const [generatedUWA, setGeneratedUWA] = useState<string>('');
  
  // UWA generation function
  const generateUWA = (identityData: any, selectedComponents: any[]) => {
    // Generate UWA based on identity type + identification components
    const identityType = identityData.role || 'user';
    const name = `${identityData.firstName || ''} ${identityData.lastName || ''}`.trim();
    const email = identityData.email || '';
    
    // Create component identifier string
    const componentString = selectedComponents.map(comp => comp.component).join('|');
    const dataString = `${identityType}|${name}|${email}|${componentString}`;
    
    // Generate UWA using character encoding (preparing for quantum-proof encryption)
    let addressCode = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      addressCode = ((addressCode << 3) ^ char) + (i * 7);
    }
    
    // Format as UWA address (placeholder for quantum encryption integration)
    const baseCode = Math.abs(addressCode).toString(36).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `UWA${baseCode.substring(0, 6).padStart(6, '0')}${timestamp}`;
  };

  // Handle UWA generation
  const handleGenerateUWA = () => {
    const identityData = {
      firstName: form.getValues('identityBehaviorHygiene.firstName'),
      lastName: form.getValues('identityBehaviorHygiene.lastName'),
      email: form.getValues('identityBehaviorHygiene.email'),
      role: form.getValues('identityBehaviorHygiene.role'),
      identityType: form.getValues('identityBehaviorHygiene.identityType'),
      userId: form.getValues('identityBehaviorHygiene.userId')
    };
    
    // Get selected components from the matrix
    const selectedComponents = matrixConfig.filter(comp => 
      comp.human || comp.machinePhysical || comp.machineVirtual || comp.api || comp.thirdParty
    );
    
    const newUWA = generateUWA(identityData, selectedComponents);
    setGeneratedUWA(newUWA);
    
    toast({
      title: "UWA Generated Successfully",
      description: `Universal Wallet Address: ${newUWA}`,
    });
  };

  const updateMatrixConfig = (index: number, field: string, value: boolean) => {
    const newConfig = [...matrixConfig];
    newConfig[index] = { ...newConfig[index], [field]: value };
    setMatrixConfig(newConfig);
  };

  const resetToDefault = () => {
    setMatrixConfig([...defaultMatrixConfig]);
    toast({
      title: "Reset to Default Configuration",
      description: "Components reset to security best practice defaults",
    });
  };

  // CSV template download function
  const downloadIdentityTemplate = () => {
    console.log("Download function called");
    try {
      const csvContent = `user_id,first_name,last_name,email,role,department,identity_type,access_level,government_id_type,government_id_issuing_authority,mfa_enabled,mfa_type,location,manager,employment_status,last_password_change,last_security_training,system_access,typical_login_hours,login_anomaly_threshold,inactive_account_days,credential_exposure_check,session_timeout_minutes,privilege_escalation_alerts,federation_source
EMP001,John,Smith,john.smith@example.com,IT Manager,Information Technology,human,privileged,drivers_license,NY-DMV,yes,app+sms,Headquarters,jane.doe@example.com,Full Time,2025-04-15,2025-03-01,"ERP, CRM, IT Admin Portal",9:00-17:00,medium,30,yes,60,yes,Active Directory
EMP002,Sarah,Johnson,sarah.johnson@example.com,Finance Director,Finance,human,admin,state_id,CA-DMV,yes,hardware,Headquarters,executive@example.com,Full Time,2025-04-20,2025-03-01,"ERP, Finance Portal, Expense System",8:00-18:00,high,30,yes,30,yes,Okta SSO
SVC001,Backup,Service,backup-service@system.internal,Automated Process,Operations,machine-physical,standard,not_applicable,not_applicable,no,,Data Center,john.smith@example.com,System,2025-01-15,N/A,"Backup System, Storage Access",,low,365,no,0,yes,Local
API001,Payment,Gateway,api-monitor@example.com,External Service,Finance,api,limited,not_applicable,not_applicable,yes,api-key,Cloud,sarah.johnson@example.com,Service,2025-03-30,N/A,"Payment Processing System",,high,90,yes,15,yes,AWS IAM
VEN001,Tech Support,Inc.,support@techsupport.example.com,Technical Support,External,third-party,limited,passport,US-State-Dept,yes,app,Remote,john.smith@example.com,Vendor,2025-04-01,2025-02-15,"Ticketing System, Knowledge Base",9:00-20:00,medium,45,yes,20,yes,External IDP`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "user-identity-template.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Template Downloaded",
        description: "User identity template CSV has been downloaded successfully",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Could not download template. Please try again.",
        variant: "destructive",
      });
    }
  };

  // CSV upload handler
  const handleIdentityUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        const identities = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',');
            const identity: any = {};
            headers.forEach((header, index) => {
              identity[header.trim()] = values[index]?.trim() || '';
            });
            return identity;
          });

        setUploadedIdentities(identities);
        toast({
          title: "Identities Uploaded",
          description: `Successfully loaded ${identities.length} identity records`,
        });
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "Failed to parse CSV file. Please check the format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  // CSV Template Download Function
  const downloadCSVTemplate = () => {
    const csvHeaders = [
      "Device ID/Asset Tag",
      "Make/Model", 
      "Color/Physical Description",
      "Serial Number",
      "Location/Department",
      "Owner/Responsible Party",
      "Purchase Date",
      "Warranty Expiration",
      "Operating System",
      "Software Installed",
      "IP Address",
      "MAC Address",
      "Security Software",
      "Encryption Status",
      "Last Security Update",
      "Compliance Status",
      "Risk Level",
      "Data Classification",
      "Network Access",
      "Remote Access Capability",
      "Backup Status",
      "Monitoring Status",
      "Incident History",
      "Maintenance Schedule",
      "Disposal Method",
      "Handling Company",
      "Data Sanitization Method",
      "Disposal Date",
      "Disposal Certification"
    ];
    
    const csvContent = csvHeaders.join(",") + "\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "device-inventory-template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Template Downloaded",
      description: "Device inventory CSV template has been downloaded successfully.",
    });
  };

  // CSV Import Function
  const handleCSVImport = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        // Validate headers match expected format
        const expectedHeaders = [
          "Device ID/Asset Tag",
          "Make/Model", 
          "Color/Physical Description"
        ];
        
        const hasValidHeaders = expectedHeaders.every(header => 
          headers.some(h => h.trim() === header)
        );
        
        if (!hasValidHeaders) {
          toast({
            title: "Import Error",
            description: "CSV file format is invalid. Please use the provided template.",
            variant: "destructive",
          });
          return;
        }
        
        const deviceCount = lines.length - 1; // Exclude header
        toast({
          title: "Import Successful",
          description: `Successfully imported ${deviceCount} devices from CSV file.`,
        });
        
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to parse CSV file. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
  };

  // Add device to independent inventory
  const addDeviceToInventory = (deviceData: any) => {
    const newDevice = {
      id: Date.now(),
      deviceId: deviceData.deviceId || `DEV-${Date.now()}`,
      makeModel: deviceData.makeModel || '',
      serialNumber: deviceData.serialNumber || '',
      deviceType: deviceData.deviceType || '',
      owner: deviceData.owner || '',
      operatingSystem: deviceData.operatingSystem || '',
      ipAddress: deviceData.ipAddress || '',
      macAddress: deviceData.macAddress || '',
      environment: deviceData.environment || '',
      riskLevel: deviceData.riskLevel || 'Medium',
      ...deviceData
    };
    
    setDeviceInventory(prev => [...prev, newDevice]);
    
    toast({
      title: "Device Added",
      description: `Device ${newDevice.deviceId} has been added to inventory.`,
    });
  };

  // Remove device from inventory
  const removeDeviceFromInventory = (deviceId: number) => {
    setDeviceInventory(prev => prev.filter(device => device.id !== deviceId));
    
    toast({
      title: "Device Removed",
      description: "Device has been removed from inventory.",
    });
  };

  // Filter devices based on type
  const filteredDevices = deviceTypeFilter === "all-types" 
    ? deviceInventory 
    : deviceInventory.filter(device => device.deviceType === deviceTypeFilter);

  // Calculate device risk score based on Section #3 security risks
  const calculateDeviceRisk = (deviceType: string, ipAddress?: string) => {
    const formValues = form.getValues();
    const organizationSecurityRisks = [
      ...(formValues.securityRisks || []),
      ...(formValues.websiteVulnerabilities || []),
      ...(formValues.endDeviceVulnerabilities || [])
    ];

    return calculateDeviceRiskScore(organizationSecurityRisks, deviceType);
  };
  
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
      
      // 3. Security Risks & Vulnerabilities
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
      
      // 4. Security Control Framework
      securityMeasures: [],
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

  // Form submission handler - placed after form definition
  const handleSubmit = form.handleSubmit((data: Sos2aFormData) => {
    try {
      console.log("Form submitted with data:", data);
      const updatedData = {
        ...data,
        eulaAccepted: eulaAccepted
      };
      onSubmit(updatedData);
      toast({
        title: "Form Submitted Successfully",
        description: "Your assessment questionnaire has been submitted for review.",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
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
  
  // Website vulnerability options specifically for the form
  const websiteVulnerabilityOptions = [
    { id: "weak-auth-web", label: "Weak Authentication and Access Control - Website" },
    { id: "unpatched-web", label: "Unpatched Software and Plugins - Website" },
    { id: "insecure-uploads", label: "Insecure File Uploads - Website" },
    { id: "xss", label: "Cross-Site Scripting (XSS) - Website" },
    { id: "unsecured-apis", label: "Unsecured APIs - Website" },
    { id: "misconfigured-servers", label: "Misconfigured Servers - Website" },
    { id: "third-party-deps", label: "Third-Party Dependencies - Website" },
    { id: "sql-injection", label: "SQL Injection - Website" },
  ];
  
  // End device vulnerability options specifically for the form
  const endDeviceVulnerabilityOptions = [
    { id: "unpatched-os", label: "Unpatched OS or Software - EDS" },
    { id: "mdm-misconfig", label: "Misconfigured MDM Policies Causing Data Exposure - EDS" },
    { id: "weak-auth-eds", label: "Weak Authentication Methods - EDS" },
    { id: "unsecured-byod", label: "Unsecured BYOD Devices - EDS" },
    { id: "default-creds", label: "Default Credentials on Devices - EDS" },
    { id: "removable-media", label: "Unsecured Removable Media - EDS" },
  ];
  
  // Security Risk options
  const securityRiskOptions = [
    { id: "phishing-spoofing-web", label: "Phishing & Spoofing - Website" },
    { id: "social-engineering-socmed", label: "Social Engineering - SocMedia" },
    { id: "impersonation-socmed", label: "Impersonation - SocMed" },
    { id: "data-privacy-socmed", label: "Data Privacy Violation - SocMed" },
    { id: "data-breaches-web", label: "Data Breaches - Website" },
    { id: "sql-injection-web", label: "SQL Injection - Website" },
    { id: "ddos-web", label: "DDoS Attacks - Website" },
    { id: "reputation-socmed", label: "Reputational Damages - SocMed" },
    { id: "account-hijack-socmed", label: "Account Hijacking - SocMed" },
    { id: "malware-hacking-web", label: "Malware & Hacking - Website" },
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
  

  
  const processOptions = [
    { id: "info-security-policy", label: "Define Information Security Policy" },
    { id: "risk-assessments", label: "Conduct Risk Assessments" },
    { id: "asset-inventory", label: "Perform Asset Inventory" },
    { id: "access-control", label: "Establish Access Control Rules" },
    { id: "identity-management", label: "Configure Identity Management" },
    { id: "data-encryption", label: "Apply Data Encryption" },
    { id: "security-awareness", label: "Conduct Security Awareness Training" },
    { id: "change-management", label: "Implement Change Management" },
    { id: "vulnerability-scanning", label: "Conduct Vulnerability Scanning" },
    { id: "incident-response", label: "Perform Security Incident Response" },
    { id: "privileged-access", label: "Implement Privileged Access Management" },
    { id: "security-audits", label: "Conduct Regular Security Audits" },
    { id: "network-security", label: "Implement Network Security Controls" },
    { id: "backup-recovery", label: "Implement Backup and Recovery Procedures" },
    { id: "penetration-testing", label: "Conduct Penetration Testing" },
    { id: "data-classification", label: "Implement Data Classification" },
    { id: "vendor-risk", label: "Establish Vendor Risk Management" },
    { id: "physical-security", label: "Implement Physical Security Controls" },
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
    { id: "other-unix", label: "Other Unix OS (includes macOS)", category: "Unix-Based OS" },
    
    // macOS
    { id: "macos-ventura-13", label: "macOS Ventura 13", category: "macOS" },
    { id: "macos-monterey-12", label: "macOS Monterey 12", category: "macOS" },
    { id: "macos-big-sur-11", label: "macOS Big Sur 11", category: "macOS" },
    { id: "macos-catalina-10.15", label: "macOS Catalina 10.15", category: "macOS" },
    { id: "macos-mojave-10.14", label: "macOS Mojave 10.14", category: "macOS" },
    { id: "macos-server", label: "macOS Server", category: "macOS" },
    { id: "other-macos", label: "Other macOS Version", category: "macOS" },
    
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

  // Calculate workflow progress based on form completion
  const calculateWorkflowProgress = () => {
    const formValues = form.getValues();
    let completedSteps = 1; // Always start with step 1 (Inquiry & Questionnaire)
    
    // Step 2: Interview & Matrix Population (when business info is complete)
    if (formValues.businessName && formValues.industry) completedSteps = 2;
    
    // Step 3: Matrix Population (when infrastructure data is added)
    if (formValues.operationMode) completedSteps = 3;
    
    // Step 4: RASBITA Governance (when security measures are defined)
    if (formValues.securityMeasures?.length > 0) completedSteps = 4;
    
    // Step 5: RASBITA Score (when compliance data exists)
    if (formValues.complianceRequirements) completedSteps = 5;
    
    // Step 6: Gap Analysis (when regulatory requirements are defined)
    if (formValues.regulatoryRequirements?.length > 0) completedSteps = 6;
    
    // Step 7: Architecture Analysis (when standards are selected)
    if (formValues.standardsGuidelines?.length > 0) completedSteps = 7;
    
    // Step 8: Preliminary Report (when assessment type is selected and contact info complete)
    if (formValues.reportType && formValues.contactInfo?.name) completedSteps = 8;
    
    // Step 9: Comprehensive Report (when all major sections complete - ready for executive scorecard)
    if (formValues.contactInfo?.name && formValues.reportType && 
        formValues.complianceRequirements && 
        formValues.securityMeasures?.length > 0) completedSteps = 9;
    
    return completedSteps;
  };

  const currentStep = calculateWorkflowProgress();
  const workflowSteps = [
    { id: 1, title: "Inquiry & Questionnaire", description: "Initial Data Collection", isCore: true, requiresMonitoring: false },
    { id: 2, title: "Interview & Matrix Population", description: "Stakeholder Input", isCore: true, requiresMonitoring: false },
    { id: 3, title: "Matrix Population", description: "Infrastructure Data", isCore: true, requiresMonitoring: false },
    { id: 4, title: "RASBITA-RGM", description: "Risk Governance & Management", isCore: true, requiresMonitoring: false },
    { id: 5, title: "Gap Analysis", description: "Identifying Missing Controls from Sections 2-13", isCore: true, requiresMonitoring: false },
    { id: 6, title: "Preliminary Report", description: "Qualitative Expert Opinion Analysis", isCore: true, requiresMonitoring: false },
    { id: 7, title: "Architecture TM", description: "Deep STRIDE Analysis (if architecture data available)", isCore: false, requiresMonitoring: false },
    { id: 8, title: "RASBITA-CBF", description: "Cost-Benefit Financial Analysis (if incident/financial data available)", isCore: false, requiresMonitoring: false },
    { id: 9, title: "Comprehensive Report", description: "Enhanced Analysis with Extended Monitoring Data", isCore: false, requiresMonitoring: true }
  ];

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* SOS2A Workflow Progress Header */}
        <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-primary">SOS²A Assessment Progress</h3>
            <Badge variant="secondary" className="text-sm">
              Step {currentStep} of 9
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-9 gap-2 mb-3">
            {workflowSteps.map((step) => (
              <div key={step.id} className="flex flex-col items-center text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  step.id <= currentStep && step.isCore
                    ? 'bg-purple-600 text-white' 
                    : step.id <= currentStep && !step.isCore
                    ? 'bg-blue-600 text-white'
                    : step.id === currentStep + 1
                    ? 'bg-orange-500 text-white'
                    : step.isCore
                    ? 'bg-purple-200 text-purple-700'
                    : step.requiresMonitoring
                    ? 'bg-green-200 text-green-700'
                    : 'bg-blue-200 text-blue-700'
                }`}>
                  {step.id <= currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : step.id === currentStep + 1 ? (
                    <Clock className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-1 text-xs text-gray-600 hidden md:block">
                  {step.title.split(' ')[0]}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-sm text-gray-600">
            <strong>Current Phase:</strong> {workflowSteps[currentStep - 1]?.title} - {workflowSteps[currentStep - 1]?.description}
          </div>
          
          {currentStep < 9 && (
            <div className="mt-2 text-xs text-gray-500">
              <strong>Next:</strong> {workflowSteps[currentStep]?.title} - {workflowSteps[currentStep]?.description}
            </div>
          )}
          
          {currentStep >= 6 && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
              <CheckCircle className="h-4 w-4 inline mr-1" />
              <strong>Preliminary Report Ready:</strong> Core assessment complete. Architecture TM and RASBITA-CBF will be included if data is available.
            </div>
          )}
          
          {currentStep >= 6 && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
              <Clock className="h-4 w-4 inline mr-1" />
              <strong>Enhanced Analysis Available:</strong> Comprehensive report with extended monitoring data (6+ months) provides deeper quantitative insights.
            </div>
          )}
        </div>

          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-8">
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="business">1. Business Info</TabsTrigger>
                <TabsTrigger value="infrastructure">2. Infrastructure Mode</TabsTrigger>
                <TabsTrigger value="risks" className="bg-orange-50">3. Security Risks & Vulnerabilities</TabsTrigger>
                <TabsTrigger value="baseline">4. Baseline Config</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="security">5. Security Control vs Framework</TabsTrigger>
                <TabsTrigger value="compliance">6. Compliance Requirements</TabsTrigger>
                <TabsTrigger value="regulatory">7. Regulatory Requirements</TabsTrigger>
                <TabsTrigger value="standards">8. Standards & Guidelines</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="acq-tools">9. Relevant ACQ Tools</TabsTrigger>
                <TabsTrigger value="adversarial">10. Adversarial Insight (MITRE ATT&CK)</TabsTrigger>
                <TabsTrigger 
                value="isms" 
                onClick={() => {
                  setTimeout(() => {
                    // Add debug info to browser console
                    console.log("ISMS Tab clicked - looking for Processes section");
                    const processesSection = document.getElementById("ismsProcessesSection");
                    console.log("Processes section found:", !!processesSection);
                    console.log("Process options:", processOptions);
                    console.log("ismsProcesses value:", form.getValues("ismsProcesses"));
                    
                    // Make the section extra visible
                    if (processesSection) {
                      processesSection.style.boxShadow = "0 0 20px rgba(213, 63, 140, 0.8)";
                      processesSection.style.border = "4px solid red";
                      processesSection.style.padding = "20px";
                      processesSection.style.background = "#ffeeee";
                      processesSection.scrollIntoView({ behavior: "smooth" });
                    } else {
                      console.error("ISMS Processes section not found in the DOM!");
                    }
                  }, 500);
                }}
              >
                11. Information Security Management System (ISMS)
              </TabsTrigger>
                <TabsTrigger value="device-inventory">12. Device Inventory Tracking</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="identity-behavior">13. Identity Behavior & Hygiene</TabsTrigger>
                <TabsTrigger value="contact">14. Contact Confirmation</TabsTrigger>
                <TabsTrigger value="review" className="bg-[#7936b0] text-white hover:bg-[#6b2aa2]">15. Review & Submit Your Questionnaire</TabsTrigger>
                <TabsTrigger value="" disabled></TabsTrigger>
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
                    
                    {/* Primary Security Concerns section removed as it is redundant - now only in Security Risks & Vulnerabilities tab */}
                    
                    {/* Notice about vulnerabilities being moved */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <h4 className="text-sm font-medium text-blue-800 mb-1">Infrastructure Vulnerabilities</h4>
                      <p className="text-sm text-blue-700">
                        Vulnerabilities related to your infrastructure have been moved to the "Security Risks & Vulnerabilities" tab 
                        for a more comprehensive security assessment.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* 3. Security Risks & Vulnerabilities Tab */}
              <TabsContent value="risks" className="space-y-6">
                <div className="border rounded-md p-4 mb-6 bg-orange-50 border-orange-200">
                  <h3 className="font-medium mb-4">3. Security Risks & Vulnerabilities</h3>
                  <FormDescription className="mb-4">
                    This section helps us identify your organization's primary security concerns and specific vulnerabilities 
                    that may be present in your systems and infrastructure.
                  </FormDescription>
                  
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Security Risks Section */}
                <div className="border rounded-md p-4 mb-6 bg-blue-50 border-blue-200">
                  <h3 className="font-medium mb-4">Security Risks</h3>
                  <FormDescription className="mb-4">
                    Select the specific security risks that are most relevant to your organization's online presence.
                  </FormDescription>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {securityRiskOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="securityRisks"
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
                </div>
                
                {/* Website Vulnerabilities Section */}
                <div className="border rounded-md p-4 mb-6 bg-orange-50 border-orange-200">
                  <h3 className="font-medium mb-4">Website Vulnerabilities</h3>
                  <FormDescription className="mb-4">
                    If your organization operates a website, select any potential vulnerabilities that might exist in your web infrastructure.
                  </FormDescription>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {websiteVulnerabilityOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="websiteVulnerabilities"
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
                </div>

                {/* End Device Vulnerabilities Section */}
                <div className="border rounded-md p-4 mb-6 bg-orange-50 border-orange-200">
                  <h3 className="font-medium mb-4">End Device Security Vulnerabilities</h3>
                  <FormDescription className="mb-4">
                    Select any potential vulnerabilities related to your organization's end-user devices (computers, mobile devices, etc.).
                  </FormDescription>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {endDeviceVulnerabilityOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="endDeviceVulnerabilities"
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
                </div>

                {/* Conditional Notice Based on Infrastructure Mode */}
                {form.watch('operationMode')?.includes('commercial-internet') && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-6">
                    <h4 className="text-sm font-medium text-amber-800 mb-1">Commercial Internet Risk Alert</h4>
                    <p className="text-sm text-amber-700">
                      Using commercial internet introduces additional security concerns. We recommend implementing proper network 
                      segmentation, strong firewall rules, and regular security assessments.
                    </p>
                  </div>
                )}
                
                {form.watch('internetPresence')?.includes('website') && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-6">
                    <h4 className="text-sm font-medium text-amber-800 mb-1">Website Vulnerability Guidance</h4>
                    <p className="text-sm text-amber-700">
                      Operating a website increases your attack surface. Consider implementing Web Application Firewalls (WAF), 
                      regular security scans, and secure coding practices to mitigate web-specific vulnerabilities.
                    </p>
                  </div>
                )}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevTab}
                    disabled={currentTab === tabOrder[0]}
                  >
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Previous Step
                  </Button>
                  <Button
                    type="button"
                    onClick={nextTab}
                    disabled={currentTab === tabOrder[tabOrder.length - 1]}
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>
              
              {/* 4. Baseline Configuration Tab */}
              <TabsContent value="baseline" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">4. Baseline Configuration</h3>
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
                                    <h4 className="text-md font-medium mb-2 flex items-center gap-2">
                                      Unix-Based OS 
                                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full border border-blue-200">
                                        includes macOS
                                      </span>
                                    </h4>
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
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevTab}
                    disabled={currentTab === tabOrder[0]}
                  >
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Previous Step
                  </Button>
                  <Button
                    type="button"
                    onClick={nextTab}
                    disabled={currentTab === tabOrder[tabOrder.length - 1]}
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>
              
              {/* 4. Security Control vs Framework Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">5. Security Control vs Framework</h3>
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
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevTab}
                    disabled={currentTab === tabOrder[0]}
                  >
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Previous Step
                  </Button>
                  <Button
                    type="button"
                    onClick={nextTab}
                    disabled={currentTab === tabOrder[tabOrder.length - 1]}
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>
              
              {/* 5. Compliance Tab */}
              <TabsContent value="compliance" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">6. Compliance Requirements</h3>
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
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevTab}
                    disabled={currentTab === tabOrder[0]}
                  >
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Previous Step
                  </Button>
                  <Button
                    type="button"
                    onClick={nextTab}
                    disabled={currentTab === tabOrder[tabOrder.length - 1]}
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>
              
              {/* 6. Regulatory Requirements Tab */}
              <TabsContent value="regulatory" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">7. Regulatory Requirements</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select all regulatory requirements applicable to your organization.
                  </p>
                  
                  <RegulatoryContent form={form} />
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevTab}
                    disabled={currentTab === tabOrder[0]}
                  >
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Previous Step
                  </Button>
                  <Button
                    type="button"
                    onClick={nextTab}
                    disabled={currentTab === tabOrder[tabOrder.length - 1]}
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>
              
              {/* 7. Standards & Guidelines Tab */}
              <TabsContent value="standards" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">8. Standards & Guidelines</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the standards and guidelines relevant to your organization.
                  </p>
                  
                  <StandardsContent form={form} />
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevTab}
                    disabled={currentTab === tabOrder[0]}
                  >
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Previous Step
                  </Button>
                  <Button
                    type="button"
                    onClick={nextTab}
                    disabled={currentTab === tabOrder[tabOrder.length - 1]}
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>
              
              {/* 8. Relevant ACQ Tools Tab */}
              <TabsContent value="acq-tools" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">9. Relevant Assessment, Checklist & Questionnaire (ACQ) Tools</h3>
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
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevTab}
                    disabled={currentTab === tabOrder[0]}
                  >
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Previous Step
                  </Button>
                  <Button
                    type="button"
                    onClick={nextTab}
                    disabled={currentTab === tabOrder[tabOrder.length - 1]}
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>
              
              {/* 10. Adversarial Insight Tab */}
              <TabsContent value="adversarial" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">10. Adversarial Insight (MITRE ATT&CK)</h3>
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
                    
                    {/* Architecture Threat Modeling section removed from Adversarial Insight tab as requested */}
                  </div>
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevTab}
                    disabled={currentTab === tabOrder[0]}
                  >
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Previous Step
                  </Button>
                  <Button
                    type="button"
                    onClick={nextTab}
                    disabled={currentTab === tabOrder[tabOrder.length - 1]}
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>
              
              {/* 11. ISMS Tab */}
              <TabsContent value="isms" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">11. Information Security Management System (ISMS)</h3>
                  
                  <div className="mb-4 p-2 bg-blue-50 border border-blue-300 rounded">
                    <p className="text-sm text-blue-700">
                      <strong>Information:</strong> Complete the Information Security Management System (ISMS) implementation details below.
                    </p>
                  </div>
                  
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
                      <h4 className="font-medium text-lg border-b pb-2 mb-4">ISMS Processes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {processOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="ismsProcesses"
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
                                            (field.value || [])?.filter(
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
                    
                    <div className="mt-6">
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
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevTab}
                    disabled={currentTab === tabOrder[0]}
                  >
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Previous Step
                  </Button>
                  <Button
                    type="button"
                    onClick={nextTab}
                    disabled={currentTab === tabOrder[tabOrder.length - 1]}
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>
              
              {/* 12. Device Inventory Tracking Tab */}
              <TabsContent value="device-inventory" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">12. Device Inventory Tracking</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Track and manage your organization's devices to improve security visibility and control.
                  </p>
                  
                  {/* Device Inventory Management Section */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-lg">Device Inventory</h4>
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
                        onClick={() => {
                          toast({
                            title: "Add Device Instructions",
                            description: (
                              <div className="text-left space-y-2">
                                <p className="font-medium text-gray-900">Please use the comprehensive device form below to add a new device.</p>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                                  <p className="text-sm text-blue-800 font-medium mb-2">Required Information:</p>
                                  <div className="space-y-1 text-sm text-blue-700">
                                    <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                      <span>Device Type and Make/Model</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                      <span>Serial Number and Asset Tag</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                      <span>Owner/Assigned User</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                      <span>Security and Risk Assessment Details</span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-3">
                                  Complete the form below for comprehensive device tracking with automatic risk scoring.
                                </p>
                              </div>
                            ),
                            duration: 8000,
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Device
                      </Button>
                    </div>
                    
                    {/* Filter Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Filter className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Filter Devices</span>
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Filter Tool</span>
                      </div>
                      <p className="text-sm text-blue-700 mb-3">Select a device type to filter the inventory list below</p>
                      
                      <Select 
                        defaultValue="all-types" 
                        onValueChange={setDeviceTypeFilter}
                      >
                        <SelectTrigger className="w-48 bg-white border-blue-300">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-types">All Types</SelectItem>
                          <SelectItem value="laptop">Laptop</SelectItem>
                          <SelectItem value="desktop">Desktop</SelectItem>
                          <SelectItem value="server">Server</SelectItem>
                          <SelectItem value="mobile">Mobile Device</SelectItem>
                          <SelectItem value="tablet">Tablet</SelectItem>
                          <SelectItem value="printer">Printer</SelectItem>
                          <SelectItem value="scanner">Scanner</SelectItem>
                          <SelectItem value="router">Network Equipment - Router</SelectItem>
                          <SelectItem value="switch">Network Equipment - Switch</SelectItem>
                          <SelectItem value="firewall">Network Equipment - Firewall</SelectItem>
                          <SelectItem value="nas">Network Equipment - NAS</SelectItem>
                          <SelectItem value="san">Network Equipment - SAN</SelectItem>
                          <SelectItem value="internet-gateway">Network Equipment - Internet Gateway</SelectItem>
                          <SelectItem value="iot">IoT Device</SelectItem>
                          <SelectItem value="camera">Security Camera</SelectItem>
                          <SelectItem value="phone">VoIP Phone</SelectItem>
                          <SelectItem value="storage">External Storage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Device Inventory Table */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[2400px]">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">Device ID/Asset Tag</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[150px]">Make/Model</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[150px]">Color/Physical Description</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">Serial Number</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[150px]">Location/Department</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[150px]">Owner/Responsible Party</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">Purchase Date</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">Warranty Expiration</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">Operating System</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[150px]">Software Installed</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">IP Address</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">MAC Address</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">Security Software</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">Encryption Status</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">Last Security Update</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">Compliance Status</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[100px]">Risk Level</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">Data Classification</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">Network Access</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[150px]">Remote Access Capability</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">Backup Status</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">Monitoring Status</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">Incident History</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[150px]">Maintenance Schedule</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">Disposal Method</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[150px]">Handling Company</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[150px]">Data Sanitization Method</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[120px]">Disposal Date</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 min-w-[150px]">Disposal Certification</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td colSpan={29} className="px-4 py-8 text-center text-gray-500">
                                No devices added yet. Click "Add Device" to begin tracking comprehensive device information.
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    {/* Device Inventory Table */}
                    <div className="mt-6">
                      {filteredDevices.length > 0 ? (
                        <div className="rounded-md border overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="p-3 text-left font-medium">Device ID</th>
                                  <th className="p-3 text-left font-medium">Type</th>
                                  <th className="p-3 text-left font-medium">Make/Model</th>
                                  <th className="p-3 text-left font-medium">Owner</th>
                                  <th className="p-3 text-left font-medium">Environment</th>
                                  <th className="p-3 text-left font-medium">Risk Level</th>
                                  <th className="p-3 text-left font-medium">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredDevices.map((device) => (
                                  <tr key={device.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{device.deviceId}</td>
                                    <td className="p-3">{device.deviceType}</td>
                                    <td className="p-3">{device.makeModel}</td>
                                    <td className="p-3">{device.owner}</td>
                                    <td className="p-3">{device.environment}</td>
                                    <td className="p-3">
                                      <span className={`px-2 py-1 rounded text-xs ${
                                        device.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                                        device.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                                      }`}>
                                        {device.riskLevel}
                                      </span>
                                    </td>
                                    <td className="p-3">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeDeviceFromInventory(device.id)}
                                      >
                                        Remove
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>No devices in inventory. Click "Add Device" to get started.</p>
                        </div>
                      )}
                    </div>

                    {/* Import Device Inventory Section */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium mb-2">Import Device Inventory</h5>
                      <p className="text-sm text-gray-600 mb-4">
                        Use these options to import existing device inventory data or download a template.
                      </p>
                      <div className="flex gap-3 w-full">
                        <Button 
                          className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '.csv';
                            input.onchange = handleCSVImport;
                            input.click();
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Import CSV
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-gray-300 flex-1"
                          onClick={downloadCSVTemplate}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Template
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 1. Identification Section - Enhanced */}
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
                            <FormLabel>User/Owner</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select device owner/user" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="system-administrator">System Administrator</SelectItem>
                                <SelectItem value="it-manager">IT Manager</SelectItem>
                                <SelectItem value="network-administrator">Network Administrator</SelectItem>
                                <SelectItem value="security-analyst">Security Analyst</SelectItem>
                                <SelectItem value="database-administrator">Database Administrator</SelectItem>
                                <SelectItem value="service-account">Service Account</SelectItem>
                                <SelectItem value="shared-workstation">Shared Workstation</SelectItem>
                                <SelectItem value="executive-team">Executive Team</SelectItem>
                                <SelectItem value="it-department">IT Department</SelectItem>
                                <SelectItem value="finance-department">Finance Department</SelectItem>
                                <SelectItem value="hr-department">HR Department</SelectItem>
                                <SelectItem value="operations-team">Operations Team</SelectItem>
                                <SelectItem value="development-team">Development Team</SelectItem>
                                <SelectItem value="guest-access">Guest Access</SelectItem>
                                <SelectItem value="contractor">Contractor</SelectItem>
                                <SelectItem value="vendor">Vendor</SelectItem>
                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select user role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="administrator">Administrator</SelectItem>
                                <SelectItem value="super-user">Super User</SelectItem>
                                <SelectItem value="it-admin">IT Admin</SelectItem>
                                <SelectItem value="developer">Developer</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="executive">Executive</SelectItem>
                                <SelectItem value="guest">Guest</SelectItem>
                                <SelectItem value="service-account">Service Account</SelectItem>
                                <SelectItem value="contractor">Contractor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact: Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Enter email address" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact: Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="Enter phone number" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.deviceNickname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Device Nickname or Label (if used)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter device nickname or label" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.colorPhysicalDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color/Physical Description</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Black Dell laptop, Silver iPhone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.locationDepartment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location/Department</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., IT Department, Building A Floor 3" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.purchaseDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Purchase Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.warrantyExpiration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Warranty Expiration</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.softwareInstalled"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Software Installed</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List major software applications installed" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* 2. Classification Section */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">2. Classification</h4>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.deviceType"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>Device Type</FormLabel>
                              <FormDescription>
                                Select all that apply
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {[
                                "Laptop", 
                                "Desktop", 
                                "Server", 
                                "Mobile Device", 
                                "Tablet", 
                                "Printer", 
                                "Scanner",
                                "Router", 
                                "Switch", 
                                "Firewall", 
                                "NAS", 
                                "SAN", 
                                "Internet Gateway",
                                "IoT Device", 
                                "Security Camera", 
                                "VoIP Phone",
                                "External Storage",
                                "Smartwatch", 
                                "Transportation Device", 
                                "Other"
                              ].map((type) => (
                                <FormField
                                  key={type}
                                  control={form.control}
                                  name="deviceInventoryTracking.deviceType"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={type}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(type)}
                                            onCheckedChange={(checked) => {
                                              const updatedValue = checked
                                                ? [...(field.value || []), type]
                                                : field.value?.filter(
                                                    (value) => value !== type
                                                  ) || [];
                                              field.onChange(updatedValue);
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                          {type}
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
                        name="deviceInventoryTracking.endpointCategory"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>Endpoint Category</FormLabel>
                              <FormDescription>
                                Select all that apply
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {["User Device", "Shared Asset", "Infrastructure Device", "Monitoring System", "Security Device"].map((type) => (
                                <FormField
                                  key={type}
                                  control={form.control}
                                  name="deviceInventoryTracking.endpointCategory"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={type}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(type)}
                                            onCheckedChange={(checked) => {
                                              const updatedValue = checked
                                                ? [...(field.value || []), type]
                                                : field.value?.filter(
                                                    (value) => value !== type
                                                  ) || [];
                                              field.onChange(updatedValue);
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                          {type}
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
                        name="deviceInventoryTracking.operatingSystem"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Operating System & Version</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter OS and version (e.g., Windows 11, macOS 14.1)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.browsersInstalled"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>Browser(s) Installed + Engine</FormLabel>
                              <FormDescription>
                                Select all that apply
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {[
                                "Chrome (Chromium)", 
                                "Firefox (Gecko)",
                                "Safari (WebKit)",
                                "Edge (Chromium)",
                                "Opera (Chromium)",
                                "Brave (Chromium)",
                                "Internet Explorer (Trident)"
                              ].map((browser) => (
                                <FormField
                                  key={browser}
                                  control={form.control}
                                  name="deviceInventoryTracking.browsersInstalled"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={browser}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(browser)}
                                            onCheckedChange={(checked) => {
                                              const updatedValue = checked
                                                ? [...(field.value || []), browser]
                                                : field.value?.filter(
                                                    (value) => value !== browser
                                                  ) || [];
                                              field.onChange(updatedValue);
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                          {browser}
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
                  
                  {/* 3. Network & Location Section */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">3. Network & Location</h4>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="deviceInventoryTracking.ipAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>IP Address(es)</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter IP address(es)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="deviceInventoryTracking.macAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>MAC Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter MAC address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="deviceInventoryTracking.lastKnownLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Known Location</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter location (Office/Room/Geotag)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="deviceInventoryTracking.assignedDepartment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Assigned Department / Business Unit</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter department or business unit" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="deviceInventoryTracking.environment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Environment</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select environment" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="production">Production</SelectItem>
                                  <SelectItem value="staging-testing">Staging/Testing</SelectItem>
                                  <SelectItem value="development">Development</SelectItem>
                                  <SelectItem value="qa">QA</SelectItem>
                                  <SelectItem value="disaster-recovery">Disaster Recovery</SelectItem>
                                  <SelectItem value="training">Training</SelectItem>
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
                        name="deviceInventoryTracking.networkZone"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>Network Zone</FormLabel>
                              <FormDescription>
                                Select all that apply
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {[
                                "DMZ", 
                                "Internal", 
                                "Guest",
                                "Management",
                                "Secured/Isolated",
                                "IoT Network",
                                "VPN"
                              ].map((zone) => (
                                <FormField
                                  key={zone}
                                  control={form.control}
                                  name="deviceInventoryTracking.networkZone"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={zone}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(zone)}
                                            onCheckedChange={(checked) => {
                                              const updatedValue = checked
                                                ? [...(field.value || []), zone]
                                                : field.value?.filter(
                                                    (value) => value !== zone
                                                  ) || [];
                                              field.onChange(updatedValue);
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                          {zone}
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
                  
                  {/* 4. Security Posture Section */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">4. Security Posture</h4>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.encryptionStatus"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>Encryption Status</FormLabel>
                              <FormDescription>
                                Select all that apply
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {[
                                "Full Disk Encryption", 
                                "File-Level Encryption",
                                "Removable Media Encryption",
                                "No Encryption",
                                "Partial Encryption",
                                "Unknown"
                              ].map((status) => (
                                <FormField
                                  key={status}
                                  control={form.control}
                                  name="deviceInventoryTracking.encryptionStatus"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={status}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(status)}
                                            onCheckedChange={(checked) => {
                                              const updatedValue = checked
                                                ? [...(field.value || []), status]
                                                : field.value?.filter(
                                                    (value) => value !== status
                                                  ) || [];
                                              field.onChange(updatedValue);
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                          {status}
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="deviceInventoryTracking.antivirusInstalled"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Antivirus / EDR Installed?</FormLabel>
                                <FormDescription>
                                  Check if antivirus or endpoint detection and response is installed
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="deviceInventoryTracking.firewallActive"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Firewall Active?</FormLabel>
                                <FormDescription>
                                  Check if device firewall is active
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="deviceInventoryTracking.tpmPresent"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>TPM Present?</FormLabel>
                                <FormDescription>
                                  Check if Trusted Platform Module is present
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Automatic Device Risk Score Display */}
                      <div className="border rounded-md p-4 bg-blue-50">
                        <h5 className="font-medium mb-3 text-blue-800">Automatic Device Risk Assessment</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              Risk Score (Based on Section #3 Security Risks):
                            </p>
                            <div className="flex items-center space-x-3">
                              {(() => {
                                const deviceType = form.watch("deviceInventoryTracking.deviceType");
                                const ipAddress = form.watch("deviceInventoryTracking.ipAddress");
                                const riskScore = deviceType ? calculateDeviceRisk(deviceType, ipAddress || "") : 0;
                                const riskLevel = getRiskLevelFromScore(riskScore);
                                
                                return (
                                  <>
                                    <Badge 
                                      variant={
                                        riskScore >= 80 ? "destructive" :
                                        riskScore >= 60 ? "default" :
                                        riskScore >= 40 ? "secondary" : "outline"
                                      }
                                      className="text-lg px-3 py-1"
                                    >
                                      {riskScore}/100
                                    </Badge>
                                    <span className="text-sm font-medium">
                                      {riskLevel}
                                    </span>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-500">
                              This score is automatically calculated based on your organization's security risks from Section #3 and the device type selected above.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="deviceInventoryTracking.patchStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Patch Status (OS, App, Firmware)</FormLabel>
                              <Select 
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select patch status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="fully-patched">Fully Patched</SelectItem>
                                  <SelectItem value="patched-critical">Critical Patches Only</SelectItem>
                                  <SelectItem value="out-of-date">Out of Date</SelectItem>
                                  <SelectItem value="unknown">Unknown</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="deviceInventoryTracking.vpnMdmEnrollment"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>VPN Usage / MDM Enrollment?</FormLabel>
                                <FormDescription>
                                  Check if device uses VPN or is enrolled in Mobile Device Management
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.securityComplianceLevel"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>Security Compliance Level</FormLabel>
                              <FormDescription>
                                Select all that apply
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {[
                                "HIPAA", 
                                "CMMC",
                                "ISO 27001",
                                "NIST 800-171",
                                "SOC 2",
                                "PCI DSS",
                                "GDPR",
                                "FISMA",
                                "None"
                              ].map((compliance) => (
                                <FormField
                                  key={compliance}
                                  control={form.control}
                                  name="deviceInventoryTracking.securityComplianceLevel"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={compliance}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(compliance)}
                                            onCheckedChange={(checked) => {
                                              const updatedValue = checked
                                                ? [...(field.value || []), compliance]
                                                : field.value?.filter(
                                                    (value) => value !== compliance
                                                  ) || [];
                                              field.onChange(updatedValue);
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                          {compliance}
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
                  
                  {/* 5. Lifecycle Management Section - Disposal and data sanitization */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">5. Lifecycle Management</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.disposalLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Disposal/Decommission Location</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select disposal location" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="on-site-secure">On-site Secure Facility</SelectItem>
                                <SelectItem value="certified-recycler">Certified Recycler</SelectItem>
                                <SelectItem value="manufacturer-return">Manufacturer Return Program</SelectItem>
                                <SelectItem value="third-party-vendor">Third-party Vendor</SelectItem>
                                <SelectItem value="government-facility">Government Facility</SelectItem>
                                <SelectItem value="pending">Pending Disposal</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.handlingCompany"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Handling Company/Organization</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter specific company name (e.g., Each1Teach1 Tech)" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter the specific company handling the disposal/recycling
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deviceInventoryTracking.dataSanitizationMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Sanitization Method</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select data sanitization method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="dod-5220-22m">DoD 5220.22-M (3-pass)</SelectItem>
                                <SelectItem value="nist-800-88">NIST 800-88 Guidelines</SelectItem>
                                <SelectItem value="physical-destruction">Physical Destruction</SelectItem>
                                <SelectItem value="degaussing">Degaussing</SelectItem>
                                <SelectItem value="crypto-erase">Cryptographic Erasure</SelectItem>
                                <SelectItem value="secure-format">Secure Format</SelectItem>
                                <SelectItem value="not-performed">Not Performed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* 6. Usage & Monitoring Section */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">6. Usage & Monitoring</h4>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="deviceInventoryTracking.lastLoginDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Login Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="deviceInventoryTracking.lastNetworkCheckin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Network Check-in</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="deviceInventoryTracking.deviceStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Device Activity / Status</FormLabel>
                              <Select 
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select device status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                  <SelectItem value="in-repair">In Repair</SelectItem>
                                  <SelectItem value="retired">Retired</SelectItem>
                                  <SelectItem value="lost-stolen">Lost/Stolen</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="deviceInventoryTracking.deviceRiskScore"
                          render={({ field }) => {
                            const deviceType = form.watch("deviceInventoryTracking.deviceType");
                            const ipAddress = form.watch("deviceInventoryTracking.ipAddress");
                            const calculatedScore = deviceType ? calculateDeviceRisk(deviceType, ipAddress || "") : 0;
                            
                            return (
                              <FormItem>
                                <FormLabel>Device Risk Score</FormLabel>
                                <FormDescription>
                                  Auto-calculated from Section #3 security risks. Override with SIEM/EDR data if available.
                                </FormDescription>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-md">
                                    <span className="text-sm text-gray-600">Calculated Score:</span>
                                    <Badge 
                                      variant={
                                        calculatedScore >= 80 ? "destructive" :
                                        calculatedScore >= 60 ? "default" :
                                        calculatedScore >= 40 ? "secondary" : "outline"
                                      }
                                    >
                                      {calculatedScore}/100
                                    </Badge>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => field.onChange(calculatedScore)}
                                    >
                                      Use Calculated
                                    </Button>
                                  </div>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min="0" 
                                      max="100" 
                                      placeholder={`Auto-calculated: ${calculatedScore} (override if needed)`}
                                      {...field}
                                      onChange={e => {
                                        const value = e.target.value === '' ? undefined : Number(e.target.value);
                                        field.onChange(value);
                                      }}
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 7. Lifecycle & Ownership Section */}
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-lg p-6 mb-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">📋</span>
                      <h4 className="font-semibold text-lg text-gray-800">7. Lifecycle & Ownership</h4>
                      <span className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full font-medium border border-orange-200">Maintenance</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-6 font-medium">Track procurement, warranty, and management details</p>
                    
                    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                      <div className="space-y-6">
                        {/* First Row - Procurement and Warranty */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="deviceInventoryTracking.procurementDateVendor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Procurement Date / Vendor</FormLabel>
                                <FormControl>
                                  <Input 
                                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500" 
                                    placeholder="Enter procurement date and vendor" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="deviceInventoryTracking.warrantyExpiration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Warranty Expiration</FormLabel>
                                <FormControl>
                                  <Input 
                                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500" 
                                    type="date" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      
                        {/* Second Row - Lifecycle Status and Disposal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="deviceInventoryTracking.deviceLifecycleStatus"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Device Lifecycle Status</FormLabel>
                                <Select 
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                                      <SelectValue placeholder="Select lifecycle status" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="in-use">In Use</SelectItem>
                                    <SelectItem value="in-storage">In Storage</SelectItem>
                                    <SelectItem value="decommissioned">Decommissioned</SelectItem>
                                    <SelectItem value="pending-disposal">Pending Disposal</SelectItem>
                                    <SelectItem value="disposed">Disposed</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="deviceInventoryTracking.disposalDecommissionLocation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Disposal/Decommission Location</FormLabel>
                                <FormControl>
                                  <Input 
                                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500" 
                                    placeholder="Where device was sent if disposed" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        {/* Third Row - Handling Company and Data Sanitization */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="deviceInventoryTracking.handlingCompanyOrganization"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Handling Company/Organization</FormLabel>
                                <FormControl>
                                  <Input 
                                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500" 
                                    placeholder="Enter specific company name (e.g., Each1Teach1 Tech)" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription className="text-xs text-gray-500">
                                  Enter the specific company handling the disposal/recycling
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="deviceInventoryTracking.dataSanitizationMethod"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Data Sanitization Method</FormLabel>
                                <FormControl>
                                  <Input 
                                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500" 
                                    placeholder="How data was removed/destroyed" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        {/* Assigned Policies Section */}
                        <div className="border-t border-gray-200 pt-6">
                          <FormField
                            control={form.control}
                            name="deviceInventoryTracking.assignedPolicies"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel className="text-gray-700 font-medium">Assigned Policies or Group Tags</FormLabel>
                                  <FormDescription className="text-xs text-gray-500">
                                    Select all that apply
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                  {[
                                    "Finance Only", 
                                    "Executive", 
                                    "IT Admin",
                                    "Developer",
                                    "Guest Access",
                                    "Restricted Access",
                                    "BYOD",
                                    "Remote Worker",
                                    "Standard User"
                                  ].map((policy) => (
                                    <FormField
                                      key={policy}
                                      control={form.control}
                                      name="deviceInventoryTracking.assignedPolicies"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={policy}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                className="accent-orange-500"
                                                checked={field.value?.includes(policy)}
                                                onCheckedChange={(checked) => {
                                                  const updatedValue = checked
                                                    ? [...(field.value || []), policy]
                                                    : field.value?.filter(
                                                        (value) => value !== policy
                                                      ) || [];
                                                  field.onChange(updatedValue);
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer text-sm text-gray-700">
                                              {policy}
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
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevTab}
                  >
                    Previous Step
                  </Button>
                  <Button 
                    type="button"
                    onClick={nextTab}
                  >
                    Next Step
                  </Button>
                </div>
              </TabsContent>
              
              {/* 13. Identity Behavior & Hygiene Tab */}
              <TabsContent value="identity-behavior" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">13. Identity Behavior & Hygiene</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Track and manage identity behaviors, authentication practices, and security hygiene measures.
                  </p>

                  {/* Universal Identity Verification System (UIVS) - Optional Enhancement */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="text-lg font-semibold text-blue-800">
                        Universal Identity Verification System (UIVS)
                      </h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        Optional Enhancement
                      </span>
                    </div>
                    <p className="text-blue-700 mb-6">
                      <strong>Optional:</strong> For organizations wanting advanced identity management, our UIVS system can import and manage multiple users with Universal Wallet Address generation. You can skip this section if not needed for your assessment.
                    </p>
                    
                    {/* Action Buttons with Clear Explanations */}
                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white border border-blue-200 rounded-lg p-4">
                          <Button 
                            type="button" 
                            className="w-full bg-green-600 hover:bg-green-700 mb-3"
                            onClick={() => {
                              toast({
                                title: "UWA Management Activated",
                                description: "Opening Universal Wallet Address management dashboard...",
                              });
                              setTimeout(() => {
                                window.location.href = "/identity-management";
                              }, 1000);
                            }}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Manage User & Create UWA
                          </Button>
                          <p className="text-xs text-gray-600">
                            Access the identity management dashboard to view, edit, organize all user identities and create Universal Wallet Addresses. When UWA is generated, records become DNA for DDNA collection.
                          </p>
                        </div>
                        
                        <div className="bg-white border border-blue-200 rounded-lg p-4">
                          <Button 
                            type="button" 
                            variant="outline"
                            className="w-full border-blue-300 text-blue-700 hover:bg-blue-100 mb-3"
                            onClick={downloadIdentityTemplate}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Template
                          </Button>
                          <p className="text-xs text-gray-600">
                            Downloads a spreadsheet template containing the exact same Section #13 form fields as a spreadsheet for user multi-identity inventory and management.
                          </p>
                        </div>
                        
                        <div className="bg-white border border-blue-200 rounded-lg p-4">
                          <div className="relative">
                            <input
                              type="file"
                              accept=".csv"
                              onChange={handleIdentityUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              className="w-full border-blue-300 text-blue-700 hover:bg-blue-100 mb-3"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Import User CSV
                            </Button>
                          </div>
                          <p className="text-xs text-gray-600">
                            Upload your completed spreadsheet template to commit multiple user identities to the database for extraction.
                          </p>
                          {uploadedIdentities.length > 0 && (
                            <div className="text-sm text-green-600 flex items-center gap-1 mt-2">
                              <CheckCircle className="w-4 h-4" />
                              {uploadedIdentities.length} identities loaded
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                        <p className="text-sm text-yellow-800">
                          <strong>Workflow:</strong> Download template → Fill with identity data → Upload CSV → Data commits to database for extraction
                        </p>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-700 mb-3">
                          <strong>Note:</strong> UIVS is completely optional. You can proceed with the assessment using the basic identification form below.
                        </p>
                        <Button 
                          type="button" 
                          variant="outline"
                          size="sm"
                          className="text-gray-600 border-gray-300"
                          onClick={() => {
                            const formSection = document.querySelector('[data-section="identification-form"]');
                            if (formSection) {
                              formSection.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                        >
                          Skip to Basic Form
                        </Button>
                      </div>
                    </div>

                    {/* Filter Controls */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 mb-6 shadow-xl">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h6 className="text-xl font-bold text-purple-900 flex items-center gap-3">
                            <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"></div>
                            <span>Smart Authentication Filter</span>
                            <div className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                              AI-Powered
                            </div>
                          </h6>
                          <p className="text-sm text-purple-700 mt-2">Advanced multi-layer identity filtering with real-time validation</p>
                          <p className="text-xs text-purple-600 mt-1">Dynamic filtering • Security-first approach • Instant results</p>
                        </div>
                        <div className="bg-white px-4 py-3 rounded-lg border border-purple-200 shadow-sm">
                          <span className="text-purple-600 text-sm font-medium">Methods Available: </span>
                          <span className="font-bold text-purple-900 text-lg">21</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <label className="text-sm font-bold text-purple-800">
                              Identity Type Filter
                            </label>
                            <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">Active</span>
                          </div>
                          <p className="text-xs text-purple-600 mb-4">Dynamic filtering for comprehensive identity management</p>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-purple-700">Select Type</label>
                            <Select defaultValue="all-types">
                              <SelectTrigger className="w-full border-purple-200 hover:border-purple-300 focus:ring-purple-500">
                                <SelectValue placeholder="All Types" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all-types">🌟 All Types</SelectItem>
                                <SelectItem value="human">👤 Human</SelectItem>
                                <SelectItem value="machine-physical">🖥️ Machine Physical</SelectItem>
                                <SelectItem value="machine-virtual">☁️ Machine Virtual</SelectItem>
                                <SelectItem value="api">🔌 API</SelectItem>
                                <SelectItem value="third-party">🤝 Third-Party</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <label className="text-sm font-bold text-purple-800">
                              Authentication Method
                            </label>
                            <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs font-medium">21 Options</span>
                          </div>
                          <p className="text-xs text-purple-600 mb-4">Advanced authentication method selection with security categorization</p>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-purple-700">Select Method</label>
                            <Select defaultValue="all-methods">
                              <SelectTrigger className="w-full border-purple-200 hover:border-purple-300 focus:ring-purple-500">
                                <SelectValue placeholder="🔐 All Methods" />
                              </SelectTrigger>
                              <SelectContent className="max-h-80 overflow-y-auto">
                                <SelectItem value="all-methods">🌟 All Methods</SelectItem>
                                
                                {/* Standard Authentication */}
                                <div className="px-3 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-md mx-1 my-1">🔐 Standard Authentication</div>
                                <SelectItem value="username-password">🔑 Username/Password</SelectItem>
                                <SelectItem value="employee-id">👤 Employee ID</SelectItem>
                                <SelectItem value="vendor-id">🏢 Vendor ID</SelectItem>
                                <SelectItem value="contractor-id">👷 Contractor ID</SelectItem>
                                <SelectItem value="certificate">📜 Certificate</SelectItem>
                                <SelectItem value="smart-card">💳 Smart Card</SelectItem>
                                <SelectItem value="sso">🔗 Single Sign-On</SelectItem>
                                <SelectItem value="token">🎫 Token-based</SelectItem>
                                <SelectItem value="service-account">⚙️ Service Account</SelectItem>
                                <SelectItem value="system-account">🖥️ System Account</SelectItem>
                                
                                {/* Advanced Authentication */}
                                <div className="px-3 py-2 text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-md mx-1 my-1">🛡️ Advanced Authentication</div>
                                <SelectItem value="mfa">🔐 MFA (Multi-Factor Authentication)</SelectItem>
                                <SelectItem value="uwa">🌐 UWA (Universal Wallet Address)</SelectItem>
                                
                                {/* Biometric */}
                                <div className="px-3 py-2 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-md mx-1 my-1">🔬 Biometric</div>
                                <SelectItem value="biometric-fingerprint">👆 Biometric - Fingerprint</SelectItem>
                                <SelectItem value="biometric-voice">🎤 Biometric - Voice</SelectItem>
                                <SelectItem value="biometric-facial">👁️ Biometric - Facial</SelectItem>
                                <SelectItem value="biometric-iris">👁️ Biometric - Iris</SelectItem>
                                
                                {/* Government IDs */}
                                <div className="px-3 py-2 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-md mx-1 my-1">🏛️ Government IDs</div>
                                <SelectItem value="drivers-license">🚗 Driver's License</SelectItem>
                                <SelectItem value="passport">✈️ Passport</SelectItem>
                                <SelectItem value="national-id">🆔 National ID</SelectItem>
                                <SelectItem value="military-id">🎖️ Military ID</SelectItem>
                                <SelectItem value="state-id">🏛️ State ID</SelectItem>
                                <SelectItem value="birth-certificate">👶 Birth Certificate</SelectItem>
                                <SelectItem value="social-security">🔢 Social Security Card</SelectItem>
                                <SelectItem value="citizenship-certificate">📋 Certificate of Citizenship</SelectItem>
                                
                                {/* Avatar Identification */}
                                <div className="px-3 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-md mx-1 my-1">🎭 Avatar Identification</div>
                                <SelectItem value="picture">📸 Picture</SelectItem>
                                <SelectItem value="avatar-profile">👤 Avatar Profile</SelectItem>
                                
                                {/* Additional Options */}
                                <div className="px-3 py-2 text-sm font-bold text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-md mx-1 my-1">➕ Other</div>
                                <SelectItem value="other">❓ Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Extracted Identity Records */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6 shadow-lg">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h6 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            UWA Record Management
                          </h6>
                          <p className="text-sm text-blue-700 mt-1">Universal Wallet Address generation from identity + identification components</p>
                          <p className="text-xs text-blue-600 mt-1">Click any row to edit • Generate UWA • Records with UWA become DNA for DDNA</p>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <div className="bg-white px-3 py-2 rounded-lg border border-blue-200">
                            <span className="text-blue-600">Total: </span>
                            <span className="font-bold text-blue-900">1</span>
                          </div>
                          <div className="bg-white px-3 py-2 rounded-lg border border-blue-200">
                            <span className="text-blue-600">Active: </span>
                            <span className="font-bold text-blue-900">1</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto bg-white rounded-lg border border-blue-200">
                        <table className="min-w-full border-collapse">
                          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                            <tr>
                              <th className="border-r border-blue-500 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Generated UWA</th>
                              <th className="border-r border-blue-500 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Identity Type</th>
                              <th className="border-r border-blue-500 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">ID Method</th>
                              <th className="border-r border-blue-500 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">SERVER/ID</th>
                              <th className="border-r border-blue-500 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">UUID</th>
                              <th className="border-r border-blue-500 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">SN</th>
                              <th className="border-r border-blue-500 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">MAKE/MODEL</th>
                              <th className="border-r border-blue-500 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">OS</th>
                              <th className="border-r border-blue-500 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">SERVER/OWNER/COMPANY</th>
                              <th className="border-r border-blue-500 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">MAC</th>
                              <th className="border-r border-blue-500 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">UNIT/SERIAL</th>
                              <th className="border-r border-blue-500 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">ENVIRONMENT</th>
                              <th className="border-r border-blue-500 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">IP Address</th>
                              <th className="border-r border-blue-500 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">EIN/BIZ#</th>
                              <th className="border-r border-blue-500 px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">ADDRESS</th>
                              <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-blue-100">
                            {form.watch('identityBehaviorHygiene.firstName') || form.watch('identityBehaviorHygiene.lastName') || form.watch('identityBehaviorHygiene.email') ? (
                              <tr 
                                className="hover:bg-blue-50 cursor-pointer transition-all duration-200 group border-l-4 border-l-transparent hover:border-l-blue-500"
                                onClick={() => {
                                  // Scroll to the identification form section
                                  const identificationSection = document.querySelector('[data-section="identification"]');
                                  if (identificationSection) {
                                    identificationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  }
                                  toast({
                                    title: "Navigating to Form",
                                    description: "Scrolling to the identification form section for editing",
                                  });
                                }}
                              >
                                <td className="border-r border-blue-100 px-3 py-4 text-sm font-medium text-gray-900">
                                  <div className="flex items-center gap-2">
                                    {generatedUWA ? (
                                      <>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="font-mono text-xs bg-green-50 px-2 py-1 rounded border border-green-200 text-green-700">
                                          {generatedUWA}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                        <span className="text-gray-500 text-xs">Not Generated</span>
                                      </>
                                    )}
                                  </div>
                                </td>
                                <td className="border-r border-blue-100 px-3 py-4 text-sm font-medium text-gray-900">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    {form.watch('identityBehaviorHygiene.identityType') || 'Human'}
                                  </div>
                                </td>
                                <td className="border-r border-blue-100 px-3 py-4 text-sm text-gray-700">
                                  {form.watch('identityBehaviorHygiene.identificationMethod') || 'Not specified'}
                                </td>
                                <td className="border-r border-blue-100 px-3 py-4 text-sm text-gray-700">
                                  {form.watch('identityBehaviorHygiene.userId') || form.watch('identityBehaviorHygiene.firstName') || 'X'}
                                </td>
                                <td className="border-r border-blue-100 px-3 py-4 text-sm text-gray-700">
                                  {form.watch('identityBehaviorHygiene.email')?.split('@')[0] || 'X'}
                                </td>
                                <td className="border-r border-blue-100 px-3 py-4 text-sm text-gray-700">
                                  {form.watch('identityBehaviorHygiene.phoneNumber') || 'X'}
                                </td>
                                <td className="border-r border-blue-100 px-3 py-4 text-sm text-gray-700">
                                  {form.watch('identityBehaviorHygiene.role') || 'X'}
                                </td>
                                <td className="border-r border-blue-100 px-3 py-4 text-sm text-gray-700">
                                  {form.watch('identityBehaviorHygiene.identityType') === 'machine-physical' ? 'Linux/Windows' : 'X'}
                                </td>
                                <td className="border-r border-blue-100 px-3 py-4 text-sm text-gray-700">
                                  {`${form.watch('identityBehaviorHygiene.firstName') || ''} ${form.watch('identityBehaviorHygiene.lastName') || ''}`.trim() || 'X'}
                                </td>
                                <td className="border-r border-blue-100 px-3 py-4 text-sm text-gray-700">
                                  {form.watch('identityBehaviorHygiene.identityType') === 'machine-physical' ? 'XX:XX:XX:XX:XX:XX' : 'X'}
                                </td>
                                <td className="border-r border-blue-100 px-3 py-4 text-sm text-gray-700">
                                  {form.watch('identityBehaviorHygiene.userId') || 'X'}
                                </td>
                                <td className="border-r border-blue-100 px-3 py-4 text-sm text-gray-700">
                                  {form.watch('identityBehaviorHygiene.identityType') === 'machine-physical' ? 'Production' : 'Office'}
                                </td>
                                <td className="border-r border-blue-100 px-3 py-4 text-sm text-gray-700">
                                  {form.watch('identityBehaviorHygiene.identityType') === 'machine-physical' ? '192.168.1.100' : 'X'}
                                </td>
                                <td className="border-r border-blue-100 px-3 py-4 text-sm text-gray-700">
                                  {form.watch('identityBehaviorHygiene.role')?.includes('Business') ? '12-3456789' : 'X'}
                                </td>
                                <td className="border-r border-blue-100 px-3 py-4 text-sm text-gray-700">
                                  {form.watch('identityBehaviorHygiene.email')?.includes('@') ? 'Office Address' : 'X'}
                                </td>
                                <td className="border-r border-blue-100 px-3 py-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-mono rounded">
                                      {form.watch('identityBehaviorHygiene.firstName') && form.watch('identityBehaviorHygiene.lastName') 
                                        ? `UWA-${form.watch('identityBehaviorHygiene.firstName')?.slice(0,2).toUpperCase()}${form.watch('identityBehaviorHygiene.lastName')?.slice(0,2).toUpperCase()}-${Date.now().toString().slice(-6)}`
                                        : 'Not Generated'
                                      }
                                    </span>
                                    {form.watch('identityBehaviorHygiene.firstName') && form.watch('identityBehaviorHygiene.lastName') && (
                                      <span className="w-2 h-2 bg-green-500 rounded-full" title="UWA Generated"></span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-3 py-4">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="text-xs bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Scroll to form
                                        const identificationSection = document.querySelector('[data-section="identification"]');
                                        if (identificationSection) {
                                          identificationSection.scrollIntoView({ behavior: 'smooth' });
                                        }
                                      }}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="text-xs bg-red-50 border-red-200 hover:bg-red-100 text-red-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Delete this identity record?')) {
                                          // Clear form fields
                                          form.setValue('identityBehaviorHygiene.firstName', '');
                                          form.setValue('identityBehaviorHygiene.lastName', '');
                                          form.setValue('identityBehaviorHygiene.email', '');
                                          form.setValue('identityBehaviorHygiene.userId', '');
                                          toast({
                                            title: "Record Deleted",
                                            description: "Identity record has been removed from the system",
                                          });
                                        }
                                      }}
                                    >
                                      Delete
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      className="text-xs bg-green-600 hover:bg-green-700 text-white"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleGenerateUWA();
                                      }}
                                    >
                                      Generate UWA
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              <tr>
                                <td colSpan={16} className="px-6 py-12 text-center">
                                  <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                      <div className="text-blue-500 text-2xl">📋</div>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Identity Records Found</h3>
                                    <p className="text-sm text-gray-500 mb-2">Complete the identification form below to see live extracted records</p>
                                    <p className="text-xs text-blue-600">For multiple identities, use the CSV template above</p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Identity Component Inventory Header */}
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="text-lg font-medium text-gray-800">Identity Component Inventory</h5>
                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          size="sm"
                          variant="outline"
                          onClick={resetToDefault}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset to Default
                        </Button>
                        <Button 
                          type="button" 
                          size="sm"
                          onClick={() => {
                            // Scroll to the identification form section
                            const formSection = document.querySelector('[data-section="identification-form"]');
                            if (formSection) {
                              formSection.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start' 
                              });
                            }
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Identity Component
                        </Button>
                      </div>
                    </div>
                    
                    {/* Configuration Notice */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">i</span>
                        </div>
                        <div>
                          <h6 className="font-bold text-blue-900 mb-2">Identity Collection Method Selection</h6>
                          <div className="space-y-2 text-sm text-blue-800">
                            <p><strong>Multiple Identity Types:</strong> Use the CSV template above for bulk data collection and import</p>
                            <p><strong>Single Identity Type:</strong> Use the individual form below for direct data entry</p>
                            <p className="text-xs text-blue-600 mt-3">Organizations can customize which identity types use specific components, but can always reset to secure defaults.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* UWA Component Selection Matrix */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6 mb-6 shadow-xl">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h6 className="text-xl font-bold text-emerald-900 flex items-center gap-3">
                            <div className="w-3 h-3 bg-emerald-600 rounded-full animate-pulse"></div>
                            <span>UWA Matrix Configuration</span>
                            <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                              31 Components
                            </div>
                          </h6>
                          <p className="text-sm text-emerald-700 mt-2">Advanced component selection matrix for Universal Wallet Address generation from identity types + identification methods</p>
                          <p className="text-xs text-emerald-600 mt-1">Interactive matrix • Real-time validation • Custom UWA generation • Future DNA/DDNA expansion</p>
                        </div>
                        <div className="flex gap-3">
                          <div className="bg-white px-4 py-3 rounded-lg border border-emerald-200 shadow-sm">
                            <span className="text-emerald-600 text-sm font-medium">Active: </span>
                            <span className="font-bold text-emerald-900 text-lg">
                              {matrixConfig.filter(row => row.human || row.machinePhysical || row.machineVirtual || row.api || row.thirdParty).length}
                            </span>
                          </div>
                          <div className="bg-white px-4 py-3 rounded-lg border border-emerald-200 shadow-sm">
                            <span className="text-emerald-600 text-sm font-medium">Total: </span>
                            <span className="font-bold text-emerald-900 text-lg">31</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border-l-4 border-amber-500 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <p className="text-sm font-medium text-amber-800">
                            Dynamic Configuration: Customize component selection per identity type for optimized UWA generation
                          </p>
                        </div>
                      </div>

                      {/* Matrix Table */}
                      <div className="overflow-x-auto bg-white rounded-lg border border-emerald-200 shadow-sm">
                        <table className="min-w-full border-collapse">
                          <thead className="bg-gradient-to-r from-emerald-600 to-teal-600">
                            <tr>
                              <th className="border-r border-emerald-500 px-4 py-4 text-left font-bold text-white">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                  Components of Identification
                                </div>
                              </th>
                              <th className="border-r border-emerald-500 px-4 py-4 text-center font-bold text-white">
                                <div className="flex flex-col items-center gap-1">
                                  <span>👤</span>
                                  <span>Human</span>
                                </div>
                              </th>
                              <th className="border-r border-emerald-500 px-4 py-4 text-center font-bold text-white">
                                <div className="flex flex-col items-center gap-1">
                                  <span>🖥️</span>
                                  <span>Machine Physical</span>
                                </div>
                              </th>
                              <th className="border-r border-emerald-500 px-4 py-4 text-center font-bold text-white">
                                <div className="flex flex-col items-center gap-1">
                                  <span>☁️</span>
                                  <span>Machine Virtual</span>
                                </div>
                              </th>
                              <th className="border-r border-emerald-500 px-4 py-4 text-center font-bold text-white">
                                <div className="flex flex-col items-center gap-1">
                                  <span>🔌</span>
                                  <span>API</span>
                                </div>
                              </th>
                              <th className="px-4 py-4 text-center font-bold text-white">
                                <div className="flex flex-col items-center gap-1">
                                  <span>🤝</span>
                                  <span>Third-Party</span>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {matrixConfig.map((row, index) => (
                              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700">
                                  {row.component}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                  {row.note ? (
                                    <span className="text-xs text-red-600">{row.note}</span>
                                  ) : (
                                    <Checkbox 
                                      checked={row.human} 
                                      onCheckedChange={(checked) => updateMatrixConfig(index, 'human', !!checked)}
                                      className="mx-auto" 
                                    />
                                  )}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                  {row.note ? (
                                    <span className="text-xs text-red-600">{row.note}</span>
                                  ) : (
                                    <Checkbox 
                                      checked={row.machinePhysical} 
                                      onCheckedChange={(checked) => updateMatrixConfig(index, 'machinePhysical', !!checked)}
                                      className="mx-auto" 
                                    />
                                  )}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                  {row.note ? (
                                    <span className="text-xs text-red-600">{row.note}</span>
                                  ) : (
                                    <Checkbox 
                                      checked={row.machineVirtual} 
                                      onCheckedChange={(checked) => updateMatrixConfig(index, 'machineVirtual', !!checked)}
                                      className="mx-auto" 
                                    />
                                  )}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                  {row.note ? (
                                    <span className="text-xs text-red-600">{row.note}</span>
                                  ) : (
                                    <Checkbox 
                                      checked={row.api} 
                                      onCheckedChange={(checked) => updateMatrixConfig(index, 'api', !!checked)}
                                      className="mx-auto" 
                                    />
                                  )}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                  {row.note ? (
                                    <span className="text-xs text-red-600">{row.note}</span>
                                  ) : (
                                    <Checkbox 
                                      checked={row.thirdParty} 
                                      onCheckedChange={(checked) => updateMatrixConfig(index, 'thirdParty', !!checked)}
                                      className="mx-auto" 
                                    />
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                        <p className="text-sm font-medium text-blue-800">Selected Identity Matrix Fields</p>
                        <p className="text-xs text-blue-600 mt-1">
                          Components selected above will be used to generate the Universal Wallet Address (UWA) for identity verification.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Clear Separator and Instructions */}
                  <div className="my-8">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-6 py-2 text-gray-500 font-medium border border-gray-300 rounded-full">
                          OR
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Single Identity Form Instructions */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h5 className="text-xl font-bold text-green-900 mb-3">Single Identity Type Collection</h5>
                        <div className="space-y-2 text-sm text-green-800">
                          <p className="font-medium">Use this form below for individual identity data entry:</p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Direct form completion for one identity at a time</li>
                            <li>Real-time validation and component mapping</li>
                            <li>Immediate UWA generation upon completion</li>
                          </ul>
                        </div>
                        <div className="mt-4 p-3 bg-white border border-green-200 rounded-lg">
                          <p className="text-xs text-green-700 font-medium">
                            Perfect for organizations with limited identities or testing purposes
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 1. Identification Section */}
                  <div data-section="identification-form" className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">1. Identification</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.userId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User ID / Employee ID</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter user ID or employee ID" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.identificationMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Identification Method Name</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select identification method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {/* Standard Authentication */}
                                <div className="px-2 py-1 text-sm font-bold text-gray-700 bg-gray-100">1. Standard Authentication</div>
                                <SelectItem value="username-password">Username / Password</SelectItem>
                                <SelectItem value="employee-id">Employee ID</SelectItem>
                                <SelectItem value="vendor-id">Vendor ID</SelectItem>
                                <SelectItem value="contractor-id">Contractor ID</SelectItem>
                                <SelectItem value="certificate">Certificate</SelectItem>
                                <SelectItem value="smart-card">Smart Card</SelectItem>
                                <SelectItem value="single-sign-on">Single Sign-On</SelectItem>
                                <SelectItem value="token-based">Token-Based</SelectItem>
                                <SelectItem value="service-account">Service Account</SelectItem>
                                <SelectItem value="system-account">System Account</SelectItem>
                                
                                {/* Advanced Authentication */}
                                <div className="px-2 py-1 text-sm font-bold text-gray-700 bg-gray-100 mt-2">2. Advanced Authentication</div>
                                <SelectItem value="uwa">UWA (Universal Wallet Address)</SelectItem>
                                <SelectItem value="mfa">MFA (Multi Factor Authentication)</SelectItem>
                                
                                {/* Biometric */}
                                <div className="px-2 py-1 text-sm font-bold text-gray-700 bg-gray-100 mt-2">3. Biometric</div>
                                <SelectItem value="fingerprint">Fingerprint</SelectItem>
                                <SelectItem value="voice">Voice</SelectItem>
                                <SelectItem value="facial">Facial</SelectItem>
                                <SelectItem value="iris">Iris</SelectItem>
                                
                                {/* Government ID */}
                                <div className="px-2 py-1 text-sm font-bold text-gray-700 bg-gray-100 mt-2">4. Government ID</div>
                                <SelectItem value="driver-license">Driver License</SelectItem>
                                <SelectItem value="passport">Passport</SelectItem>
                                <SelectItem value="national-id">National ID</SelectItem>
                                <SelectItem value="military-id">Military ID</SelectItem>
                                <SelectItem value="state-id">State ID</SelectItem>
                                <SelectItem value="birth-certificate">Birth Certificate</SelectItem>
                                <SelectItem value="social-security-card">Social Security Card</SelectItem>
                                <SelectItem value="certificate-of-citizenship">Certificate of Citizenship</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.identityType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Identity Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select identity type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="human">Human</SelectItem>
                                <SelectItem value="machine-physical">Machine Physical</SelectItem>
                                <SelectItem value="machine-virtual">Machine Virtual</SelectItem>
                                <SelectItem value="api">API</SelectItem>
                                <SelectItem value="third-party">Third-Party</SelectItem>
                                <SelectItem value="avatar">Avatar</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="administrator">Administrator</SelectItem>
                                <SelectItem value="super-user">Super User</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="employee">Employee</SelectItem>
                                <SelectItem value="contractor">Contractor</SelectItem>
                                <SelectItem value="vendor">Vendor</SelectItem>
                                <SelectItem value="guest">Guest</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* 2. Authentication Practices Section */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">2. Authentication Practices</h4>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.passwordPolicyCompliance"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Password Policy Compliance</FormLabel>
                              <FormDescription>
                                Do you have a formal password policy that meets industry standards?
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.passwordPolicyDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password Policy Details</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your password policy requirements (length, complexity, rotation, etc.)" 
                                className="h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.mfaStatus"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Multi-Factor Authentication (MFA)</FormLabel>
                              <FormDescription>
                                Do you implement multi-factor authentication?
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.mfaTypes"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>MFA Types</FormLabel>
                              <FormDescription>
                                Select all MFA types that are implemented
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {[
                                "SMS/Text Messages", 
                                "Email Codes",
                                "Mobile App Authenticator",
                                "Hardware Tokens/Keys",
                                "Biometrics",
                                "Push Notifications",
                                "Phone Calls"
                              ].map((type) => (
                                <FormField
                                  key={type}
                                  control={form.control}
                                  name="identityBehaviorHygiene.mfaTypes"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={type}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(type)}
                                            onCheckedChange={(checked) => {
                                              const updatedValue = checked
                                                ? [...(field.value || []), type]
                                                : field.value?.filter(
                                                    (value) => value !== type
                                                  ) || [];
                                              field.onChange(updatedValue);
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                          {type}
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
                        name="identityBehaviorHygiene.biometricAuthentication"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Biometric Authentication</FormLabel>
                              <FormDescription>
                                Do you use biometric authentication?
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.biometricTypes"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>Biometric Types</FormLabel>
                              <FormDescription>
                                Select all biometric types that are used
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {[
                                "Fingerprint", 
                                "Facial Recognition",
                                "Voice Recognition",
                                "Iris Scanning",
                                "Palm Vein/Hand Geometry",
                                "Behavioral Biometrics"
                              ].map((type) => (
                                <FormField
                                  key={type}
                                  control={form.control}
                                  name="identityBehaviorHygiene.biometricTypes"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={type}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(type)}
                                            onCheckedChange={(checked) => {
                                              const updatedValue = checked
                                                ? [...(field.value || []), type]
                                                : field.value?.filter(
                                                    (value) => value !== type
                                                  ) || [];
                                              field.onChange(updatedValue);
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                          {type}
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
                  
                  {/* 3. Access & Permissions Section */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">3. Access & Permissions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.assignedRoles"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assigned Roles</FormLabel>
                            <FormControl>
                              <Input placeholder="RBAC groups, e.g., 'Finance-ReadOnly'" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.entitlements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Entitlements</FormLabel>
                            <FormControl>
                              <Input placeholder="Specific permissions like 'SQL DB Admin'" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.accessDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Access Duration</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select access duration" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="permanent">Permanent</SelectItem>
                                <SelectItem value="temporary">Temporary</SelectItem>
                                <SelectItem value="project-based">Project-Based</SelectItem>
                                <SelectItem value="time-limited">Time-Limited</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.accessTier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Access Tier</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select access tier" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="elevated">Elevated</SelectItem>
                                <SelectItem value="privileged">Privileged</SelectItem>
                                <SelectItem value="administrative">Administrative</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.departmentTeam"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department / Team</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter department or team" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.assignedRiskLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assigned Risk Level</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select risk level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.federatedIdentitySource"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Federated Identity Source</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select identity source" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active-directory">Active Directory</SelectItem>
                                <SelectItem value="azure-ad">Azure AD</SelectItem>
                                <SelectItem value="okta">Okta</SelectItem>
                                <SelectItem value="saml">SAML</SelectItem>
                                <SelectItem value="oauth">OAuth</SelectItem>
                                <SelectItem value="local">Local Account</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* 4. Access Behavior Section */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">4. Access Behavior</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.loginPatterns"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Login Patterns</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select typical login patterns" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="regular-business-hours">Regular Business Hours Only</SelectItem>
                                <SelectItem value="extended-hours">Extended Hours (Early/Late)</SelectItem>
                                <SelectItem value="24-7-operations">24/7 Operations</SelectItem>
                                <SelectItem value="mostly-remote">Primarily Remote Access</SelectItem>
                                <SelectItem value="irregular-varied">Irregular/Varied Patterns</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.remoteAccessFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Remote Access Frequency</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select remote access frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="rare">Rare (Almost Never)</SelectItem>
                                <SelectItem value="occasional">Occasional (Monthly)</SelectItem>
                                <SelectItem value="regular">Regular (Weekly)</SelectItem>
                                <SelectItem value="frequent">Frequent (Daily)</SelectItem>
                                <SelectItem value="primary-access">Primary Access Method</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.sessionDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Typical Session Duration</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select typical session duration" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="short">Short (&lt;1 hour)</SelectItem>
                                <SelectItem value="medium">Medium (1-4 hours)</SelectItem>
                                <SelectItem value="long">Long (4-8 hours)</SelectItem>
                                <SelectItem value="extended">Extended (&gt;8 hours)</SelectItem>
                                <SelectItem value="all-day">All Day Sessions</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="identityBehaviorHygiene.abnormalAccessDetection"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Abnormal Access Detection</FormLabel>
                                <FormDescription>
                                  Do you have systems to detect abnormal access patterns?
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="identityBehaviorHygiene.locationBasedAccess"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Location-Based Access Controls</FormLabel>
                                <FormDescription>
                                  Do you restrict access based on geographic location?
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 5. Identity Protection Section */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">5. Identity Protection</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="identityBehaviorHygiene.identityProtectionTraining"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Identity Protection Training</FormLabel>
                                <FormDescription>
                                  Do you provide identity protection training to users?
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="identityBehaviorHygiene.trainingCompletionDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Training Completion Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.phishingAwarenessLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phishing Awareness Level</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select phishing awareness level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="basic">Basic Awareness</SelectItem>
                                <SelectItem value="intermediate">Intermediate Understanding</SelectItem>
                                <SelectItem value="advanced">Advanced Knowledge</SelectItem>
                                <SelectItem value="expert">Expert Level</SelectItem>
                                <SelectItem value="unknown">Unknown/Not Measured</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.securityIncidentHistory"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Security Incident History</FormLabel>
                              <FormDescription>
                                Have you experienced identity-related security incidents in the past 12 months?
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.incidentDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Incident Details</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="If you had incidents, please provide brief details about the nature and impact" 
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
                  
                  {/* 5. Privileged Access Management Section */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">6. Privileged Access Management</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="identityBehaviorHygiene.privilegedAccountInventory"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Privileged Account Inventory</FormLabel>
                                <FormDescription>
                                  Do you maintain an inventory of privileged accounts?
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="identityBehaviorHygiene.justInTimeAccess"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Just-In-Time Access</FormLabel>
                                <FormDescription>
                                  Do you implement just-in-time access for privileged accounts?
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="identityBehaviorHygiene.privilegeEscalationControls"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Privilege Escalation Controls</FormLabel>
                                <FormDescription>
                                  Do you have controls to prevent unauthorized privilege escalation?
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.adminAccountReview"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Admin Account Review Frequency</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select review frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                                <SelectItem value="annually">Annually</SelectItem>
                                <SelectItem value="never">Never/Ad-hoc</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.separationOfDuties"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Separation of Duties</FormLabel>
                              <FormDescription>
                                Do you implement separation of duties for privileged operations?
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* 6. Identity Lifecycle Management Section */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">7. Identity Lifecycle Management</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.onboardingStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Onboarding Process Status</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select onboarding process status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="manual">Manual Process</SelectItem>
                                <SelectItem value="partially-automated">Partially Automated</SelectItem>
                                <SelectItem value="fully-automated">Fully Automated</SelectItem>
                                <SelectItem value="identity-governance">Identity Governance Solution</SelectItem>
                                <SelectItem value="no-process">No Formal Process</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="identityBehaviorHygiene.offboardingProcess"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Formal Offboarding Process</FormLabel>
                                <FormDescription>
                                  Do you have a formal offboarding process to revoke access?
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="identityBehaviorHygiene.accountDormancyMonitoring"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Account Dormancy Monitoring</FormLabel>
                                <FormDescription>
                                  Do you monitor and manage dormant/inactive accounts?
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.accessReviewFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Access Review Frequency</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select access review frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                                <SelectItem value="annually">Annually</SelectItem>
                                <SelectItem value="ad-hoc">Ad-hoc/No Regular Schedule</SelectItem>
                                <SelectItem value="never">Never Performed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.roleChanges"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Role Change Management Process</FormLabel>
                              <FormDescription>
                                Do you have a process to manage access rights when users change roles?
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* 8. Security Posture Section */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">8. Security Posture</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.passwordHygiene"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password Hygiene</FormLabel>
                            <FormControl>
                              <Input placeholder="Last changed, complexity, reuse status" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.breachedCredentialChecks"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Breached Credential Checks</FormLabel>
                              <FormDescription>
                                Do you check for breached credentials via services like HaveIBeenPwned?
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.sessionTimeoutSettings"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Session Timeout Settings</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select session timeout" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="15-minutes">15 Minutes</SelectItem>
                                <SelectItem value="30-minutes">30 Minutes</SelectItem>
                                <SelectItem value="1-hour">1 Hour</SelectItem>
                                <SelectItem value="2-hours">2 Hours</SelectItem>
                                <SelectItem value="4-hours">4 Hours</SelectItem>
                                <SelectItem value="8-hours">8 Hours</SelectItem>
                                <SelectItem value="no-timeout">No Timeout</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.unusedAccountDetection"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Unused Account Detection</FormLabel>
                              <FormDescription>
                                Do you detect and manage accounts inactive for 90+ days?
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.privilegeEscalationAlerts"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Privilege Escalation Alerts</FormLabel>
                              <FormDescription>
                                Do you monitor and alert on sudo/root usage logs?
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* 9. Behavior Monitoring Section */}
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-4">9. Behavior Monitoring</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.typicalLoginPatterns"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Typical Login Patterns</FormLabel>
                            <FormControl>
                              <Input placeholder="Time, location, device" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.anomalyDetectionFlags"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Anomaly Detection Flags</FormLabel>
                              <FormDescription>
                                Do you detect impossible travel, brute force attempts, etc.?
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.dataAccessTrends"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Access Trends</FormLabel>
                            <FormControl>
                              <Input placeholder="Unusual file downloads, cloud API calls" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="identityBehaviorHygiene.toolCommandUsage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tool/Command Usage</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., PowerShell, RDP, SSH frequency" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevTab}
                    >
                      Previous Step
                    </Button>
                    <Button 
                      type="button"
                      onClick={nextTab}
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* 14. Contact and Confirmation Tab */}
              <TabsContent value="contact" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">14. Contact Confirmation</h3>
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
                
                <div className="flex justify-between space-x-4 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevTab}
                  >
                    Previous Step
                  </Button>
                  <Button 
                    type="button" 
                    className="bg-[#7936b0] hover:bg-[#6b2aa2] text-white" 
                    onClick={nextTab}
                  >
                    Continue to Review
                  </Button>
                </div>
              </TabsContent>
              
              {/* Review Tab */}
              <TabsContent value="review" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">15. Review & Submit Your Questionnaire</h3>
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

                    {/* Section 2: Infrastructure Mode of Operation */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">2. Infrastructure Mode of Operation</h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            const tabTrigger = document.querySelector('[data-value="infrastructure"]') as HTMLElement;
                            if (tabTrigger) {
                              tabTrigger.click();
                            }
                          }}
                        >
                          Edit Infrastructure
                        </Button>
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
                        </div>
                      </div>
                    </div>
                    
                    {/* Section 3: Security Risks & Vulnerabilities */}
                    <div className="border rounded-md p-4 bg-orange-50 border-orange-200">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">3. Security Risks & Vulnerabilities</h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            const tabTrigger = document.querySelector('[data-value="risks"]') as HTMLElement;
                            if (tabTrigger) {
                              tabTrigger.click();
                            }
                          }}
                        >
                          Edit Risks
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Primary Security Concerns:</div>
                          <div>{form.getValues("primaryConcerns")?.length > 0 ? 
                              form.getValues("primaryConcerns").join(", ") : 
                              "None selected"}</div>
                              
                          <div className="font-medium">Security Risks:</div>
                          <div>{safeArray(form.getValues("securityRisks")).length > 0 ? 
                              safeArray(form.getValues("securityRisks")).join(", ") : 
                              "None selected"}</div>
                              
                          <div className="font-medium">Website Vulnerabilities:</div>
                          <div>{safeArray(form.getValues("websiteVulnerabilities")).length > 0 ? 
                              safeArray(form.getValues("websiteVulnerabilities")).map(vulnId => {
                                const vuln = websiteVulnerabilityOptions.find(v => v.id === vulnId);
                                return vuln ? vuln.label : vulnId;
                              }).join(", ") : 
                              "None identified"}</div>
                              
                          <div className="font-medium">End Device Vulnerabilities:</div>
                          <div>{safeArray(form.getValues("endDeviceVulnerabilities")).length > 0 ? 
                              safeArray(form.getValues("endDeviceVulnerabilities")).map(vulnId => {
                                const vuln = endDeviceVulnerabilityOptions.find(v => v.id === vulnId);
                                return vuln ? vuln.label : vulnId;
                              }).join(", ") : 
                              "None identified"}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Section 4: Baseline Configuration */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">4. Configuration Baseline</h4>
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
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
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

                    {/* Section 5: Security Control Framework */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">5. Security Control Framework</h4>
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

                    {/* Section 6-8: Compliance, Regulatory, Standards */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">6-8. Compliance, Regulatory & Standards</h4>
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

                    {/* Section 9: ACQ Tools */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">9. Relevant ACQ Tools</h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            const tabTrigger = document.querySelector('[data-value="acq-tools"]') as HTMLElement;
                            if (tabTrigger) {
                              tabTrigger.click();
                            }
                          }}
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

                    {/* Section 10: Adversarial Insight */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">10. Adversarial Insight (MITRE ATT&CK)</h4>
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

                    {/* Section 11: ISMS */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">11. Information Security Management System (ISMS)</h4>
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
                                
                          <div className="font-medium border-b border-blue-300 pb-1 mt-4">ISMS Processes:</div>
                          <div className="p-2 bg-blue-50 border border-blue-200 rounded-md mt-1">
                            {form.getValues("ismsProcesses")?.length > 0 ? 
                                form.getValues("ismsProcesses").map(id => {
                                  const option = processOptions.find(o => o.id === id);
                                  return option ? option.label : id;
                                }).join(", ") : 
                                "None selected"}
                          </div>
                                
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

                    {/* Section 12: Contact Information */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium">12. Contact Information</h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            const tabTrigger = document.querySelector('[data-value="contact"]') as HTMLElement;
                            if (tabTrigger) {
                              tabTrigger.click();
                            }
                          }}
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