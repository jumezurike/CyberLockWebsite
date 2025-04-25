import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RasbitaRiskItem } from '@/lib/sos2a-types';
import { Mail, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Define the form schema with zod based on RASBITA specifications
const formSchema = z.object({
  // Company information for report
  companyName: z.string().optional(),
  department: z.string().optional(),
  reportGeneratorName: z.string().optional(),
  reportGeneratorTitle: z.string().optional(),
  companyLogo: z.string().optional(),
  
  // Basic incident information
  incidentTitle: z.string().min(5, "Title must be at least 5 characters"),
  incidentDescription: z.string().min(10, "Please provide more details about the incident"),
  incidentDate: z.string(),
  incidentCategory: z.enum([
    "denial_of_service",
    "unauthorized_external", 
    "unauthorized_internal", 
    "disclosure_name_dob", 
    "disclosure_name_ss",
    "disclosure_name_dob_ss",
    "social_engineering",
    "malware_server",
    "malware_workstation",
    "improper_usage", 
    "no_significant_loss"
  ]),
  
  // RASBITA specific fields from technical spec
  deviceType: z.enum(["workstation", "standard_workstation", "server", "standard_server"]),
  damagedDevices: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Damaged device count must be a non-negative number",
  }),
  totalDevicesInDepartment: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Total device count must be a non-negative number",
  }),
  dataClass: z.string(), // Accept any string from the extended options
  dataSpread: z.enum(["widely_spread", "moderately_spread", "limited_spread", "minimally_spread", "contained", "publicly_available"]),
  dataLossPercentage: z.enum(["1_20", "21_40", "41_60", "61_80", "81_100"]),
  deviceUsageFrequency: z.enum(["daily", "often", "rarely"]),
  deviceEnvironment: z.enum(["production", "staging", "testing", "disaster_recovery", "development"]),
  threatValue: z.string(),
  threatCost: z.string(),
  machineCost: z.string(),
  totalDataCount: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Total data count must be a non-negative number",
  }),
  annualizedRateOfOccurrence: z.enum(["1", "0.5", "0.33", "0.25"]),
  
  // Additional information
  assetName: z.string().min(3, "Asset name is required"),
  affectedSystems: z.string().min(3, "Please list the affected systems"),
  existingSafeguards: z.string(),
  
  // Feasibility factors
  organizationalFeasible: z.boolean(),
  behavioralFeasible: z.boolean(),
  technicalFeasible: z.boolean(),
  politicalFeasible: z.boolean(),
});

type IncidentFormData = z.infer<typeof formSchema>;

interface IncidentFormProps {
  onSubmit: (data: any) => void;
}

export default function IncidentForm({ onSubmit }: IncidentFormProps) {
  const { toast } = useToast();
  
  const form = useForm<IncidentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Company information for reporting
      companyName: "",
      department: "",
      reportGeneratorName: "",
      reportGeneratorTitle: "",
      companyLogo: "",
      
      // Basic incident information
      incidentTitle: "",
      incidentDescription: "",
      incidentDate: new Date().toISOString().split('T')[0],
      incidentCategory: "unauthorized_external",
      affectedSystems: "",
      
      // RASBITA specific fields from technical spec
      deviceType: "workstation",
      damagedDevices: "1",
      totalDevicesInDepartment: "10",
      dataClass: "non_phi_pii",
      dataSpread: "moderately_spread",
      dataLossPercentage: "21_40",
      deviceUsageFrequency: "daily",
      deviceEnvironment: "production",
      threatValue: "8", // Default for unauthorized_external
      threatCost: "5", // Default cost for unauthorized_external
      machineCost: "500", // Default for workstation
      totalDataCount: "1000",
      annualizedRateOfOccurrence: "0.5", // Once every 2 years
      
      // Additional information
      assetName: "",
      existingSafeguards: "",
      
      // Feasibility factors
      organizationalFeasible: true,
      behavioralFeasible: true,
      technicalFeasible: true,
      politicalFeasible: true,
    },
  });

  // Helper function to calculate addCalc (used in AV calculation)
  const addCalc = (totalDataCount: number, dataPercentage: number): number => {
    // This is a placeholder for the calculation mentioned in the spec
    // In the real application, this would implement the specific algorithm mentioned in
    // addCalc(totnum_asset, dataPercent) from the spec
    return totalDataCount * dataPercentage;
  };
  
  // Calculate total data size based on record count and average record size
  const calculateTotalDataSize = (): string => {
    const recordCount = Number(form.getValues().totalDataCount) || 0;
    const recordSizeInput = document.getElementById('record-size-input') as HTMLInputElement;
    const recordSize = recordSizeInput ? parseFloat(recordSizeInput.value || '32') : 32;
    
    const totalSizeKB = recordCount * recordSize;
    
    // Format total size with appropriate unit (KB, MB, GB, TB)
    if (totalSizeKB < 1024) {
      return `Total: ${totalSizeKB.toFixed(2)} KB`;
    } else if (totalSizeKB < 1024 * 1024) {
      return `Total: ${(totalSizeKB / 1024).toFixed(2)} MB`;
    } else if (totalSizeKB < 1024 * 1024 * 1024) {
      return `Total: ${(totalSizeKB / (1024 * 1024)).toFixed(2)} GB`;
    } else {
      return `Total: ${(totalSizeKB / (1024 * 1024 * 1024)).toFixed(2)} TB`;
    }
  };
  
  // Update the data size display when either record count or size changes
  const updateDataSizeDisplay = () => {
    const totalSizeElement = document.getElementById('total-data-size');
    if (totalSizeElement) {
      totalSizeElement.textContent = calculateTotalDataSize();
    }
  };
  
  // Get exposure factor value based on data loss percentage
  const getExposureFactorFromDataLoss = (dataLossPercentage: string): number => {
    switch(dataLossPercentage) {
      case '1_20': return 0.2;
      case '21_40': return 0.4;
      case '41_60': return 0.6;
      case '61_80': return 0.8;
      case '81_100': return 1;
      default: return 0.5;
    }
  };
  
  // Get data loss value from percentage range
  const getDataLossValue = (dataLossPercentage: string): number => {
    switch(dataLossPercentage) {
      case '1_20': return 10.4;
      case '21_40': return 11.8;
      case '41_60': return 13.2;
      case '61_80': return 14.6;
      case '81_100': return 16;
      default: return 12;
    }
  };
  
  // Get machine cost based on device type using the comprehensive list
  const getMachineCost = (deviceType: string): number => {
    // Find the device type in our expanded list
    const device = deviceTypeOptions.find(option => option.value === deviceType);
    
    // If found, use its cost, otherwise default to 0
    return device ? device.cost : 0;
  };
  
  // Get threat value based on incident category using the comprehensive list
  const getThreatValue = (incidentCategory: string): number => {
    // Find the category in our expanded list
    const category = categoryOptions.find(option => option.value === incidentCategory);
    
    // If found, derive the threat value from the cost (higher cost = higher threat)
    if (category) {
      const cost = category.cost;
      if (cost >= 5000) return 10;
      if (cost >= 2000) return 9;
      if (cost >= 1000) return 8;
      if (cost >= 500) return 7;
      if (cost >= 100) return 6;
      if (cost >= 50) return 5;
      if (cost >= 20) return 4;
      if (cost >= 10) return 3;
      if (cost > 0) return 2;
      return 0;
    }
    
    return 5; // Default medium threat value
  };
  
  // Get threat cost based on incident category using the comprehensive list
  const getThreatCost = (incidentCategory: string): number => {
    // Find the category in our expanded list
    const category = categoryOptions.find(option => option.value === incidentCategory);
    
    // If found, use its cost, otherwise default to a medium cost of 10
    return category ? category.cost : 10;
  };
  
  // Get data classification value weight from comprehensive list
  const getDataClassWeight = (dataClass: string): number => {
    // Find the data class in our expanded list
    const classification = dataClassOptions.find(option => option.value === dataClass);
    
    // If found, use its weight, otherwise default to 1
    return classification ? classification.value_weight : 1;
  };
  
  // Get priority based on device usage and data sensitivity from expanded list
  const calculatePriority = (dataClass: string, deviceUsageFrequency: string): 'Critical' | 'High' | 'Medium' | 'Low' => {
    // Get the data class weight value
    const dataWeight = getDataClassWeight(dataClass);
    
    // Get device usage value
    let usageWeight: number;
    switch(deviceUsageFrequency) {
      case 'daily': usageWeight = 9; break;
      case 'often': usageWeight = 5; break;
      case 'rarely': usageWeight = 2; break;
      default: usageWeight = 5;
    }
    
    // Calculate priority based on both factors
    const combinedScore = dataWeight * usageWeight;
    
    // Thresholds for priorities based on combined score
    if (combinedScore >= 60) return 'Critical';
    if (combinedScore >= 30) return 'High';
    if (combinedScore >= 10) return 'Medium';
    return 'Low';
  };

  const handleFormSubmit = (data: IncidentFormData) => {
    try {
      // Extract values from form
      const deviceType = data.deviceType;
      const damagedDevices = Number(data.damagedDevices);
      const totalDevicesInDepartment = Number(data.totalDevicesInDepartment);
      const exposureFactor = getExposureFactorFromDataLoss(data.dataLossPercentage);
      const annualizedRateOfOccurrence = Number(data.annualizedRateOfOccurrence);
      const machineCost = getMachineCost(deviceType);
      const threatValue = getThreatValue(data.incidentCategory); 
      const threatCost = getThreatCost(data.incidentCategory);
      const totalDataCount = Number(data.totalDataCount);
      
      // RASBITA Calculations according to the specification
      // Asset Value (AV) calculation
      const assetValue = (machineCost * damagedDevices) + 
        (addCalc(totalDataCount, exposureFactor) * threatCost);
      
      // Single Loss Expectancy (SLE) calculation
      const singleLossExpectancy = assetValue * exposureFactor;
      
      // Annualized Loss Expectancy (ALE) calculation
      const annualizedLossExpectancy = singleLossExpectancy * annualizedRateOfOccurrence;
      
      // Define a placeholder for the annual cost of safeguards (ACS)
      // In a real application, this would be populated from additional form fields
      const annualCostOfSafeguard = assetValue * 0.1; // Placeholder: 10% of asset value
      
      // Calculate ALE after controls (simplified for demo purposes)
      const estimatedAleAfterControls = annualizedLossExpectancy * 0.2;
      
      // Calculate Net Risk Reduction Benefit (NRRB)
      const netRiskReductionBenefit = (annualizedLossExpectancy - estimatedAleAfterControls) - annualCostOfSafeguard;
      
      // Determine priority based on data classification and device usage frequency
      const priority = calculatePriority(data.dataClass, data.deviceUsageFrequency);

      // Create the risk item with all calculated values
      const completeRiskItem: RasbitaRiskItem = {
        assetName: data.assetName,
        assetValue: assetValue,
        threatName: data.incidentCategory,
        exposureFactor: exposureFactor,
        annualizedRateOfOccurrence: annualizedRateOfOccurrence,
        singleLossExpectancy: singleLossExpectancy,
        annualizedLossExpectancy: annualizedLossExpectancy,
        annualCostOfSafeguard: annualCostOfSafeguard,
        annualizedLossExpectancyAfterControls: estimatedAleAfterControls,
        netRiskReductionBenefit: netRiskReductionBenefit,
        priority: priority,
        probability: exposureFactor, // Using exposureFactor as a proxy for probability
        impact: threatValue, // Using threatValue as a proxy for impact
        deviceInfo: {
          deviceType: deviceType,
          deviceCount: totalDevicesInDepartment,
          damagedDevices: damagedDevices,
        },
        feasibilityFactors: {
          organizational: data.organizationalFeasible,
          behavioral: data.behavioralFeasible,
          technical: data.technicalFeasible,
          political: data.politicalFeasible,
        }
      };

      // Combine incident data with risk item for the full submission
      const fullSubmission = {
        company: {
          name: data.companyName,
          department: data.department,
          reportGenerator: {
            name: data.reportGeneratorName,
            title: data.reportGeneratorTitle
          },
          logo: data.companyLogo
        },
        incident: {
          title: data.incidentTitle,
          description: data.incidentDescription,
          date: data.incidentDate,
          category: data.incidentCategory,
          affectedSystems: data.affectedSystems,
          dataClass: data.dataClass,
          dataSpread: data.dataSpread,
          dataLossPercentage: data.dataLossPercentage,
          deviceUsageFrequency: data.deviceUsageFrequency,
          deviceEnvironment: data.deviceEnvironment,
          totalDataCount: data.totalDataCount
        },
        riskItem: completeRiskItem
      };

      // Submit the data
      onSubmit(fullSubmission);

      toast({
        title: "RASBITA Analysis Complete",
        description: "Your security incident has been analyzed using the CISSP Risk Assessment Score by Impact and Threat Analysis methodology.",
      });
    } catch (error) {
      console.error("Error processing form data:", error);
      toast({
        title: "Error",
        description: "There was a problem processing your incident data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Expanded comprehensive options for the incident category dropdown
  const categoryOptions = [
    // Core categories from the RASBITA specification
    { value: "denial_of_service", label: "Denial of Service/DDoS", cost: 30 },
    { value: "unauthorized_external", label: "Unauthorized External Access", cost: 5 },
    { value: "unauthorized_internal", label: "Unauthorized Internal Access", cost: 5 },
    { value: "disclosure_name_dob", label: "Disclosure (Name and DOB)", cost: 10 },
    { value: "disclosure_name_ss", label: "Disclosure (Name and SS)", cost: 10 },
    { value: "disclosure_name_dob_ss", label: "Disclosure (Name, DOB, and SS)", cost: 30 },
    { value: "social_engineering", label: "Social Engineering", cost: 3 },
    { value: "malware_server", label: "Malware (Server)", cost: 2160 },
    { value: "malware_workstation", label: "Malware (Workstation)", cost: 720 },
    { value: "improper_usage", label: "Improper Usage", cost: 24 },
    { value: "no_significant_loss", label: "No Significant Loss", cost: 0 },
    
    // Extended categories for a more comprehensive assessment
    { value: "ransomware", label: "Ransomware Attack", cost: 4000 },
    { value: "business_email_compromise", label: "Business Email Compromise (BEC)", cost: 750 },
    { value: "phishing", label: "Phishing Campaign", cost: 500 },
    { value: "spear_phishing", label: "Targeted Spear Phishing", cost: 1200 },
    { value: "web_application_attack", label: "Web Application Attack (SQL Injection, XSS)", cost: 3500 },
    { value: "insider_threat_malicious", label: "Malicious Insider Threat", cost: 8000 },
    { value: "insider_threat_negligent", label: "Negligent Insider Incident", cost: 1800 },
    { value: "lost_device", label: "Lost/Stolen Device", cost: 970 },
    { value: "cloud_storage_breach", label: "Cloud Storage/Service Breach", cost: 2700 },
    { value: "supply_chain_attack", label: "Supply Chain Attack", cost: 7500 },
    { value: "credential_stuffing", label: "Credential Stuffing/Password Attack", cost: 450 },
    { value: "cryptojacking", label: "Cryptojacking", cost: 150 },
    { value: "zero_day_exploit", label: "Zero-Day Exploit", cost: 15000 },
    { value: "iot_device_compromise", label: "IoT Device Compromise", cost: 890 },
    { value: "api_breach", label: "API Security Breach", cost: 3200 },
  ];

  // Expanded options for device type dropdown
  const deviceTypeOptions = [
    // Core types from the RASBITA specification
    { value: "server", label: "Server", cost: 5000 },
    { value: "standard_server", label: "Standard Server", cost: 4000 },
    { value: "workstation", label: "Workstation", cost: 500 },
    { value: "standard_workstation", label: "Standard Workstation", cost: 300 },
    
    // Extended device types
    { value: "database_server", label: "Database Server", cost: 7000 },
    { value: "application_server", label: "Application Server", cost: 6500 },
    { value: "file_server", label: "File Server", cost: 4500 },
    { value: "web_server", label: "Web Server", cost: 5500 },
    { value: "mail_server", label: "Mail Server", cost: 4200 },
    { value: "authentication_server", label: "Authentication Server", cost: 8000 },
    { value: "mobile_device", label: "Mobile Device", cost: 800 },
    { value: "tablet", label: "Tablet", cost: 600 },
    { value: "network_device", label: "Network Device (Switch/Router)", cost: 3000 },
    { value: "iot_device", label: "IoT Device", cost: 300 },
    { value: "industrial_control_system", label: "Industrial Control System", cost: 12000 },
    { value: "cloud_instance", label: "Cloud Virtual Instance", cost: 2500 },
    { value: "virtual_machine", label: "Virtual Machine", cost: 1800 },
  ];
  
  // Expanded options for data class dropdown
  const dataClassOptions = [
    // Core classes from the RASBITA specification
    { value: "system_file", label: "System File", value_weight: 1 },
    { value: "non_phi_pii", label: "Non-PHI and PII Data", value_weight: 2 },
    { value: "phi", label: "Personal Health Record Information (PHI)", value_weight: 9 },
    { value: "pii", label: "Personal Identifiable Information (PII)", value_weight: 9 },
    
    // Extended data classifications
    { value: "pci_dss", label: "Payment Card Information (PCI)", value_weight: 9 },
    { value: "intellectual_property", label: "Intellectual Property", value_weight: 8 },
    { value: "trade_secrets", label: "Trade Secrets", value_weight: 10 },
    { value: "financial_records", label: "Financial Records", value_weight: 8 },
    { value: "employee_data", label: "Employee Data", value_weight: 7 },
    { value: "authentication_data", label: "Authentication Data (Credentials)", value_weight: 9 },
    { value: "encryption_keys", label: "Encryption Keys/Certificates", value_weight: 10 },
    { value: "source_code", label: "Source Code", value_weight: 8 },
    { value: "customer_database", label: "Customer Database", value_weight: 8 },
    { value: "biometric_data", label: "Biometric Data", value_weight: 10 },
    { value: "system_configurations", label: "System Configurations", value_weight: 6 },
    { value: "log_files", label: "Log Files", value_weight: 5 },
    { value: "backups", label: "System Backups", value_weight: 7 },
    { value: "classified_information", label: "Classified/Restricted Information", value_weight: 10 },
  ];
  
  // Options for data spread dropdown
  const dataSpreadOptions = [
    { value: "widely_spread", label: "Widely Spread (Value: 9)" },
    { value: "moderately_spread", label: "Moderately Spread (Value: 5)" },
    { value: "limited_spread", label: "Limited Spread (Value: 2)" },
  ];
  
  // Options for data loss percentage dropdown
  const dataLossPercentageOptions = [
    { value: "1_20", label: "1-20% (Value: 0.2)" },
    { value: "21_40", label: "21-40% (Value: 0.4)" },
    { value: "41_60", label: "41-60% (Value: 0.6)" },
    { value: "61_80", label: "61-80% (Value: 0.8)" },
    { value: "81_100", label: "81-100% (Value: 1.0)" },
  ];
  
  // Options for device usage frequency dropdown
  const deviceUsageFrequencyOptions = [
    { value: "daily", label: "Daily Basis (Value: 9)" },
    { value: "often", label: "Used Often (Value: 5)" },
    { value: "rarely", label: "Rarely Used (Value: 2)" },
  ];
  
  // Options for device environment dropdown
  const deviceEnvironmentOptions = [
    { value: "production", label: "Production Environment (Value: 9)" },
    { value: "staging", label: "Staging Environment (Value: 5)" },
    { value: "testing", label: "Testing Environment (Value: 2)" },
  ];
  
  // Options for annualized rate of occurrence dropdown
  const aroOptions = [
    { value: "1", label: "Once per year (ARO = 1)" },
    { value: "0.5", label: "Once every 2 years (ARO = 0.5)" },
    { value: "0.33", label: "Once every 3 years (ARO = 0.33)" },
    { value: "0.25", label: "Once every 4 years (ARO = 0.25)" },
  ];

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="bg-red-50">
          <CardTitle className="text-xl text-red-800">Security Incident Analysis</CardTitle>
          <CardDescription>
            Provide details about the security incident to generate a RASBITA risk and financial impact analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              {/* Company Information Section */}
              <div className="bg-purple-50 p-4 rounded-md mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-md font-medium">Company Information for Report</h3>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Report Distribution",
                          description: "Email distribution option will be available after report generation."
                        });
                      }}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Report Distribution",
                          description: "PDF export will be available after report generation."
                        });
                      }}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Report Distribution",
                          description: "SMS notification option will be available after report generation."
                        });
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      SMS
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What is your organization's name?</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter organization name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Which department is responsible for this report?</FormLabel>
                        <FormControl>
                          <Input placeholder="IT Security, Compliance, Risk Management, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reportGeneratorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Who is generating this report?</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reportGeneratorTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What is your title or position in the organization?</FormLabel>
                        <FormControl>
                          <Input placeholder="CISO, Security Analyst, IT Manager, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="companyLogo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Would you like to upload your organization's logo for the report?</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  // Convert to base64 for storage
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    if (event.target?.result) {
                                      field.onChange(event.target.result);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }} 
                            />
                            {field.value && typeof field.value === 'string' && (
                              <div className="h-16 w-16 relative overflow-hidden rounded border">
                                <img 
                                  src={field.value} 
                                  alt="Company logo preview" 
                                  className="h-full w-full object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload your company logo to appear on the generated report
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Tabs defaultValue="incident" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="incident">Incident Details</TabsTrigger>
                  <TabsTrigger value="asset">Asset Information</TabsTrigger>
                  <TabsTrigger value="threat">Threat Analysis</TabsTrigger>
                  <TabsTrigger value="safeguards">Safeguards & Feasibility</TabsTrigger>
                </TabsList>
                
                {/* Incident Details Tab */}
                <TabsContent value="incident" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="incidentTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What is the title of this security incident?</FormLabel>
                        <FormControl>
                          <Input placeholder="Unauthorized Database Access" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide a clear, concise title that summarizes the incident
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="incidentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>When did the incident occur?</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="incidentCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select the incident category that best describes the event:</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Auto-populate threat values based on incident category
                              const selectedCategory = categoryOptions.find(c => c.value === value);
                              if (selectedCategory) {
                                const threatValue = getThreatValue(value);
                                const threatCost = getThreatCost(value);
                                
                                form.setValue("threatValue", threatValue.toString());
                                form.setValue("threatCost", threatCost.toString());
                              }
                            }} 
                            defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select incident category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categoryOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="incidentDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please describe what happened during this security incident:</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the security incident in detail, including when it was discovered and initial impact assessment..."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide all relevant details that would help with the analysis
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="affectedSystems"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Which systems, applications, or data were affected by this incident?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Customer database, payment processing server, employee workstations..."
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          List all systems, applications, or data affected by this incident
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                {/* Device Information Tab */}
                <TabsContent value="asset" className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-md mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> According to the RASBITA methodology, device type, damage status, and usage information are critical to the risk calculation.
                    </p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="assetName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What is the most critical asset affected by this incident?</FormLabel>
                        <FormControl>
                          <Input placeholder="Customer Database" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide the name of the primary asset impacted
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="deviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What type of device was affected in this incident?</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Auto-populate device cost if a matching field exists
                              const selectedDevice = deviceTypeOptions.find(d => d.value === value);
                              if (selectedDevice && selectedDevice.cost) {
                                // If we have a machineCost field, populate it
                                if (form.getValues().hasOwnProperty("machineCost")) {
                                  form.setValue("machineCost", selectedDevice.cost.toString());
                                }
                              }
                            }} 
                            defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select device type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {deviceTypeOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the specific device type that was primarily affected
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="totalDataCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How many data records were affected by this incident?</FormLabel>
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-2 w-full">
                              <FormControl>
                                <Input
                                  id="data-count-input"
                                  type="number"
                                  min="0"
                                  placeholder="1000"
                                  {...field}
                                  onChange={e => {
                                    // Set the field value
                                    const newValue = parseFloat(e.target.value) || 0;
                                    field.onChange(newValue);
                                    
                                    // Update total size calculation
                                    const recordSizeInput = document.getElementById('record-size-input') as HTMLInputElement;
                                    const recordSize = recordSizeInput ? parseFloat(recordSizeInput.value || '32') : 32;
                                    const totalSizeElement = document.getElementById('total-data-size');
                                    
                                    if (totalSizeElement) {
                                      // Calculate total size
                                      const totalSizeKB = newValue * recordSize;
                                      let sizeDisplay = "";
                                      
                                      // Format with appropriate unit
                                      if (totalSizeKB < 1024) {
                                        sizeDisplay = `Total: ${totalSizeKB.toFixed(2)} KB`;
                                      } else if (totalSizeKB < 1024 * 1024) {
                                        sizeDisplay = `Total: ${(totalSizeKB / 1024).toFixed(2)} MB`;
                                      } else if (totalSizeKB < 1024 * 1024 * 1024) {
                                        sizeDisplay = `Total: ${(totalSizeKB / (1024 * 1024)).toFixed(2)} GB`;
                                      } else {
                                        sizeDisplay = `Total: ${(totalSizeKB / (1024 * 1024 * 1024)).toFixed(2)} TB`;
                                      }
                                      
                                      totalSizeElement.textContent = sizeDisplay;
                                    }
                                  }}
                                  className="flex-1"
                                />
                              </FormControl>
                              <Select 
                                onValueChange={(value) => {
                                  // Create a multiplier based on the selected scale
                                  let multiplier = 1;
                                  switch(value) {
                                    case "thousand": multiplier = 1000; break;
                                    case "million": multiplier = 1000000; break;
                                    case "billion": multiplier = 1000000000; break;
                                    default: multiplier = 1;
                                  }
                                  
                                  // Get base number from current input
                                  const inputElement = document.getElementById('data-count-input') as HTMLInputElement;
                                  const baseValue = inputElement ? parseFloat(inputElement.value || '0') : 0;
                                  
                                  // Calculate new count value with multiplier
                                  const newValue = baseValue * multiplier;
                                  
                                  // Apply multiplier to base value and update the form field
                                  field.onChange(newValue);
                                  
                                  // Update the total size calculation
                                  const recordSizeInput = document.getElementById('record-size-input') as HTMLInputElement;
                                  const recordSize = recordSizeInput ? parseFloat(recordSizeInput.value || '32') : 32;
                                  const totalSizeElement = document.getElementById('total-data-size');
                                  
                                  if (totalSizeElement) {
                                    // Calculate total size
                                    const totalSizeKB = newValue * recordSize;
                                    let sizeDisplay = "";
                                    
                                    // Format with appropriate unit
                                    if (totalSizeKB < 1024) {
                                      sizeDisplay = `Total: ${totalSizeKB.toFixed(2)} KB`;
                                    } else if (totalSizeKB < 1024 * 1024) {
                                      sizeDisplay = `Total: ${(totalSizeKB / 1024).toFixed(2)} MB`;
                                    } else if (totalSizeKB < 1024 * 1024 * 1024) {
                                      sizeDisplay = `Total: ${(totalSizeKB / (1024 * 1024)).toFixed(2)} GB`;
                                    } else {
                                      sizeDisplay = `Total: ${(totalSizeKB / (1024 * 1024 * 1024)).toFixed(2)} TB`;
                                    }
                                    
                                    totalSizeElement.textContent = sizeDisplay;
                                  }
                                }}
                                defaultValue="unit"
                              >
                                <SelectTrigger id="data-count-scale" className="w-[150px]">
                                  <SelectValue placeholder="Scale" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="unit">Individual Records</SelectItem>
                                  <SelectItem value="thousand">Thousands (K)</SelectItem>
                                  <SelectItem value="million">Millions (M)</SelectItem>
                                  <SelectItem value="billion">Billions (B)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <div className="text-sm font-medium text-green-600" id="data-size-indicator">
                                {Number(field.value) > 0 ? `≈ ${new Intl.NumberFormat().format(Number(field.value))} records` : "Enter the number of records"}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Avg. record size (KB):</span>
                                <Input 
                                  type="number" 
                                  min="0.1" 
                                  step="0.1"
                                  id="record-size-input"
                                  defaultValue="32"
                                  className="h-7 w-20 text-xs"
                                  onChange={(e) => {
                                    // Get the record size and count values
                                    const recordSize = parseFloat(e.target.value) || 32;
                                    const recordCount = Number(field.value) || 0;
                                    
                                    // Update the total size display
                                    const totalSizeElement = document.getElementById('total-data-size');
                                    if (totalSizeElement) {
                                      // Calculate total size
                                      const totalSizeKB = recordCount * recordSize;
                                      let sizeDisplay = "";
                                      
                                      // Format with appropriate unit
                                      if (totalSizeKB < 1024) {
                                        sizeDisplay = `Total: ${totalSizeKB.toFixed(2)} KB`;
                                      } else if (totalSizeKB < 1024 * 1024) {
                                        sizeDisplay = `Total: ${(totalSizeKB / 1024).toFixed(2)} MB`;
                                      } else if (totalSizeKB < 1024 * 1024 * 1024) {
                                        sizeDisplay = `Total: ${(totalSizeKB / (1024 * 1024)).toFixed(2)} GB`;
                                      } else {
                                        sizeDisplay = `Total: ${(totalSizeKB / (1024 * 1024 * 1024)).toFixed(2)} TB`;
                                      }
                                      
                                      totalSizeElement.textContent = sizeDisplay;
                                    }
                                  }}
                                />
                                <span className="text-xs font-medium text-purple-600" id="total-data-size">
                                  {Number(field.value) > 0 ? `Total: ${(Number(field.value) * 32).toFixed(2)} KB` : "Enter data count"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <FormDescription>
                            Total number of data records affected by this incident. Use the scale selector for large numbers.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="totalDevicesInDepartment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How many total devices are in this department or location?</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="10" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the total number of devices in the affected area
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="damagedDevices"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How many devices were damaged or compromised in this incident?</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the number of affected devices
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="deviceUsageFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How frequently is this device used for business operations?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select usage frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {deviceUsageFrequencyOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the typical usage pattern for this device
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="deviceEnvironment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>In which environment was the affected device located?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select environment" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {deviceEnvironmentOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The infrastructure environment in which the device is used
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                {/* Data Analysis Tab */}
                <TabsContent value="threat" className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-md mb-4">
                    <p className="text-sm text-purple-800">
                      <strong>Note:</strong> The data classification and exposure information is critical for calculating the risk score according to the RASBITA methodology.
                    </p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="dataClass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What type of data was affected in this incident?</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Auto-populate based on data classification 
                            const selectedClass = dataClassOptions.find(c => c.value === value);
                            if (selectedClass && selectedClass.value_weight) {
                              // Could set downstream values based on data classification
                            }
                          }} 
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select data classification" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {dataClassOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the classification level of the affected data (higher sensitivity = higher risk)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="dataSpread"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How widely was the data spread or exposed?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select data spread" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {dataSpreadOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Indicate how far the compromised data has spread (wider exposure = higher risk)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dataLossPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What percentage of data was lost or compromised?</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Auto-calculate exposure factor when data loss percentage changes
                              const exposureFactor = getExposureFactorFromDataLoss(value);
                              // Could potentially auto-populate other fields that depend on exposure factor
                            }}
                            defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select percentage range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {dataLossPercentageOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Estimate the percentage of affected data (impacts the Exposure Factor calculation)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="annualizedRateOfOccurrence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How often do you expect this type of incident to occur?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select occurrence rate" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {aroOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Frequency of occurrence directly impacts the Annualized Loss Expectancy (ALE) calculation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                {/* Safeguards & Feasibility Tab */}
                <TabsContent value="safeguards" className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-md mb-4">
                    <p className="text-sm text-green-800">
                      <strong>Note:</strong> The cost of safeguards is used to calculate the Net Risk Reduction Benefit (NRRB) in the RASBITA methodology.
                    </p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="existingSafeguards"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What security controls were already in place during this incident?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Firewall, IDS/IPS, data encryption, regular backups..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Include all security controls that were active but failed to prevent this incident
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="bg-purple-50 p-4 rounded-md mb-4">
                    <h4 className="font-medium text-purple-800 mb-2">Feasibility Assessment</h4>
                    <p className="text-sm text-purple-800 mb-4">
                      Indicate whether implementing additional safeguards would be feasible across these dimensions:
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="organizationalFeasible"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Organizational Feasibility</FormLabel>
                              <FormDescription>
                                Would additional controls align with business goals and strategies?
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="behavioralFeasible"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Behavioral Feasibility</FormLabel>
                              <FormDescription>
                                Would users accept and adapt to the new security measures?
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="technicalFeasible"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Technical Feasibility</FormLabel>
                              <FormDescription>
                                Do you have the technical expertise and resources to implement new controls?
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="politicalFeasible"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Political Feasibility</FormLabel>
                              <FormDescription>
                                Will you be able to secure cooperation across departments and management?
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 bg-yellow-50 rounded-md border-l-4 border-yellow-500">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>The RASBITA analysis will automatically calculate the Annual Cost of Safeguards (ACS) based on the asset value and appropriate risk factors</li>
                            <li>The Annualized Loss Expectancy (ALE) will be calculated as Single Loss Expectancy (SLE) multiplied by the Annualized Rate of Occurrence (ARO)</li>
                            <li>The Net Risk Reduction Benefit (NRRB) calculation will show if your security investments are cost-effective</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Distribution options */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-medium mb-3">Report Distribution Options</h3>
                <p className="text-sm text-gray-600 mb-4">Select how you want to distribute the RASBITA report:</p>
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    type="button" 
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    onClick={() => toast({
                      title: "Email Distribution",
                      description: "This feature will be available soon. The report will be emailed to specified stakeholders.",
                    })}
                  >
                    <Mail className="h-4 w-4" />
                    Email Report
                  </Button>
                  
                  <Button 
                    type="button" 
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    onClick={() => toast({
                      title: "PDF Export",
                      description: "This feature will be available soon. The report will be exported as a PDF document.",
                    })}
                  >
                    <FileText className="h-4 w-4" />
                    Export PDF
                  </Button>
                  
                  <Button 
                    type="button" 
                    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                    onClick={() => toast({
                      title: "SMS Notification",
                      description: "This feature will be available soon. Report summaries will be sent via SMS to key stakeholders.",
                    })}
                  >
                    <MessageSquare className="h-4 w-4" />
                    SMS Alert
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-chart-4 hover:bg-purple-700 text-white"
                >
                  Generate RASBITA Analysis
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}