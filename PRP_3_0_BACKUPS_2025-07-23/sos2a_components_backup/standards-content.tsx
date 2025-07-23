import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { Sos2aFormData } from "@/lib/sos2a-types";

interface StandardsContentProps {
  form: {
    control: Control<Sos2aFormData>;
  };
}

export function StandardsContent({ form }: StandardsContentProps) {
  return (
    <div className="space-y-8">
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
      
      {/* Universal Security Standards */}
      <div className="mb-6">
        <h4 className="font-medium text-lg border-b pb-2 mb-4 text-red-600">
          <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2"></span>
          Universal Security Standards <span className="text-sm font-normal text-red-600">(Mandatory)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("iso-27001")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "iso-27001"]
                        : (field.value || [])?.filter(
                            (value) => value !== "iso-27001"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">ISO 27001</FormLabel>
                  <FormDescription>
                    Information Security Management System (ISMS)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("iso-27002")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "iso-27002"]
                        : (field.value || [])?.filter(
                            (value) => value !== "iso-27002"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">ISO 27002</FormLabel>
                  <FormDescription>
                    Controls for information security
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("nist-csf")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "nist-csf"]
                        : (field.value || [])?.filter(
                            (value) => value !== "nist-csf"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">NIST CSF</FormLabel>
                  <FormDescription>
                    Cybersecurity Framework (Identify, Protect, Detect, Respond, Recover)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("nist-800-53")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "nist-800-53"]
                        : (field.value || [])?.filter(
                            (value) => value !== "nist-800-53"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">NIST SP 800-53</FormLabel>
                  <FormDescription>
                    Security controls for federal systems (used beyond gov)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("cis-controls")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "cis-controls"]
                        : (field.value || [])?.filter(
                            (value) => value !== "cis-controls"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">CIS Controls</FormLabel>
                  <FormDescription>
                    18 prioritized security best practices
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("soc-2")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "soc-2"]
                        : (field.value || [])?.filter(
                            (value) => value !== "soc-2"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">SOC 2</FormLabel>
                  <FormDescription>
                    Security, Availability, Confidentiality (for cloud/services)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
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
        </div>
      </div>
                
      {/* Healthcare-specific Standards */}
      <div className="mb-6">
        <h4 className="font-medium text-lg border-b pb-2 mb-4 text-blue-600">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
          Healthcare-specific Standards <span className="text-sm font-normal text-blue-600">(Mandatory for Healthcare)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="healthcareStandards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-blue-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("hipaa-security")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "hipaa-security"]
                        : (field.value || [])?.filter(
                            (value) => value !== "hipaa-security"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">HIPAA Security Rule</FormLabel>
                  <FormDescription>
                    U.S. mandate for protecting health data (PHI)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="healthcareStandards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-blue-50">
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
                  <FormLabel className="font-medium">HITRUST CSF</FormLabel>
                  <FormDescription>
                    Certifiable framework combining HIPAA, ISO 27001, NIST
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="healthcareStandards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-blue-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("hipaa-privacy")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "hipaa-privacy"]
                        : (field.value || [])?.filter(
                            (value) => value !== "hipaa-privacy"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">HIPAA Privacy Rule</FormLabel>
                  <FormDescription>
                    Governs PHI use/disclosure
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="healthcareStandards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-blue-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("21cfr-part11")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "21cfr-part11"]
                        : (field.value || [])?.filter(
                            (value) => value !== "21cfr-part11"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">21 CFR Part 11 (FDA)</FormLabel>
                  <FormDescription>
                    Electronic records/signatures for medical devices
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="healthcareStandards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-blue-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("gdpr-healthcare")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "gdpr-healthcare"]
                        : (field.value || [])?.filter(
                            (value) => value !== "gdpr-healthcare"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">GDPR (for EU healthcare)</FormLabel>
                  <FormDescription>
                    Protects patient data in Europe
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="healthcareStandards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-blue-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("dicom")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "dicom"]
                        : (field.value || [])?.filter(
                            (value) => value !== "dicom"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">DICOM Security</FormLabel>
                  <FormDescription>
                    Medical imaging data protection
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="healthcareStandards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-blue-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("hl7")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "hl7"]
                        : (field.value || [])?.filter(
                            (value) => value !== "hl7"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">HL7 FHIR Security</FormLabel>
                  <FormDescription>
                    Standards for healthcare API security
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Government & Critical Infrastructure Standards */}
      <div className="mb-6">
        <h4 className="font-medium text-lg border-b pb-2 mb-4 text-red-600">
          <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2"></span>
          Government & Critical Infrastructure Standards <span className="text-sm font-normal text-red-600">(Mandatory for government/CI)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("fisma")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "fisma"]
                        : (field.value || [])?.filter(
                            (value) => value !== "fisma"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">FISMA</FormLabel>
                  <FormDescription>
                    U.S. federal agency security (aligned with NIST)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("fedramp")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "fedramp"]
                        : (field.value || [])?.filter(
                            (value) => value !== "fedramp"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">FedRAMP</FormLabel>
                  <FormDescription>
                    Cloud security for U.S. government
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
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
                  <FormLabel className="font-medium">CMMC</FormLabel>
                  <FormDescription>
                    Cybersecurity Maturity Model Certification (U.S. defense)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
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
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">NERC CIP</FormLabel>
                  <FormDescription>
                    North American electric grid security
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Financial & Payment Standards */}
      <div className="mb-6">
        <h4 className="font-medium text-lg border-b pb-2 mb-4 text-red-600">
          <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2"></span>
          Financial & Payment Standards <span className="text-sm font-normal text-red-600">(Mandatory for financial sector)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
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
                  <FormLabel className="font-medium">GLBA</FormLabel>
                  <FormDescription>
                    Gramm-Leach-Bliley Act (financial data)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("sox")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "sox"]
                        : (field.value || [])?.filter(
                            (value) => value !== "sox"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">SOX</FormLabel>
                  <FormDescription>
                    Sarbanes-Oxley (financial reporting controls)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
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
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">PSD2</FormLabel>
                  <FormDescription>
                    EU payment services directive
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Cloud & Data Privacy Standards */}
      <div className="mb-6">
        <h4 className="font-medium text-lg border-b pb-2 mb-4 text-red-600">
          <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2"></span>
          Cloud & Data Privacy Standards <span className="text-sm font-normal text-red-600">(Mandatory for relevant sectors)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("iso-27701")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "iso-27701"]
                        : (field.value || [])?.filter(
                            (value) => value !== "iso-27701"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">ISO 27701</FormLabel>
                  <FormDescription>
                    Privacy extension to ISO 27001
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
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
                  <FormLabel className="font-medium">CCPA</FormLabel>
                  <FormDescription>
                    California Consumer Privacy Act
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("soc-1")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "soc-1"]
                        : (field.value || [])?.filter(
                            (value) => value !== "soc-1"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">SOC 1</FormLabel>
                  <FormDescription>
                    Financial reporting controls (SSAE 18)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Industry-specific Standards */}
      <div className="mb-6">
        <h4 className="font-medium text-lg border-b pb-2 mb-4 text-red-600">
          <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2"></span>
          Industry-specific Standards <span className="text-sm font-normal text-red-600">(Mandatory for specific industries)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("iec-62443")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "iec-62443"]
                        : (field.value || [])?.filter(
                            (value) => value !== "iec-62443"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">IEC 62443</FormLabel>
                  <FormDescription>
                    Industrial control systems (ICS)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
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
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">TISAX</FormLabel>
                  <FormDescription>
                    Automotive industry security
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("fips-140")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "fips-140"]
                        : (field.value || [])?.filter(
                            (value) => value !== "fips-140"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">FIPS 140-2/3</FormLabel>
                  <FormDescription>
                    Cryptographic module validation
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Emerging & Regional Standards */}
      <div className="mb-6">
        <h4 className="font-medium text-lg border-b pb-2 mb-4 text-red-600">
          <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2"></span>
          Emerging & Regional Standards <span className="text-sm font-normal text-red-600">(Mandatory for specific regions)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("cccs-33")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "cccs-33"]
                        : (field.value || [])?.filter(
                            (value) => value !== "cccs-33"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">CCCS 33 (Canada)</FormLabel>
                  <FormDescription>
                    Baseline cyber requirements
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("ens-spain")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "ens-spain"]
                        : (field.value || [])?.filter(
                            (value) => value !== "ens-spain"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">ENS (Spain)</FormLabel>
                  <FormDescription>
                    National Security Framework
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="complianceRequirements.standards"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("meiti-saudi")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "meiti-saudi"]
                        : (field.value || [])?.filter(
                            (value) => value !== "meiti-saudi"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">MEITI (Saudi Arabia)</FormLabel>
                  <FormDescription>
                    Critical infrastructure protection
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Guidelines Section */}
      <div className="mt-8" id="guidelines-section">
        <h4 className="font-medium text-lg border-b pb-2 mb-4 text-green-600">
          <span className="inline-block w-3 h-3 rounded-full bg-green-600 mr-2"></span>
          Security Guidelines <span className="text-sm font-normal text-green-600">(Optional)</span>
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Unlike standards, guidelines provide recommended practices but are not mandatory. Select guidelines relevant to your organization.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="securityGuidelines"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("nist-800-171")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "nist-800-171"]
                        : (field.value || [])?.filter(
                            (value: string) => value !== "nist-800-171"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">NIST SP 800-171</FormLabel>
                  <FormDescription>
                    Protecting Controlled Unclassified Information (CUI)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="securityGuidelines"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("nist-800-63")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "nist-800-63"]
                        : (field.value || [])?.filter(
                            (value: string) => value !== "nist-800-63"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">NIST SP 800-63</FormLabel>
                  <FormDescription>
                    Digital Identity Guidelines (Authentication)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="securityGuidelines"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("cis-benchmarks")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "cis-benchmarks"]
                        : (field.value || [])?.filter(
                            (value: string) => value !== "cis-benchmarks"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">CIS Benchmarks</FormLabel>
                  <FormDescription>
                    Configuration baselines for OS/applications
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="securityGuidelines"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("owasp-top-10")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "owasp-top-10"]
                        : (field.value || [])?.filter(
                            (value: string) => value !== "owasp-top-10"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">OWASP Top 10</FormLabel>
                  <FormDescription>
                    Web application security risks
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="securityGuidelines"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("sans-critical-controls")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "sans-critical-controls"]
                        : (field.value || [])?.filter(
                            (value: string) => value !== "sans-critical-controls"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">SANS Critical Security Controls</FormLabel>
                  <FormDescription>
                    Prioritized defense actions
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="securityGuidelines"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("nist-800-88")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "nist-800-88"]
                        : (field.value || [])?.filter(
                            (value: string) => value !== "nist-800-88"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">NIST SP 800-88</FormLabel>
                  <FormDescription>
                    Guidelines for Media Sanitization
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="securityGuidelines"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("nist-800-61")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "nist-800-61"]
                        : (field.value || [])?.filter(
                            (value: string) => value !== "nist-800-61"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">NIST SP 800-61</FormLabel>
                  <FormDescription>
                    Computer Security Incident Handling Guide
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="securityGuidelines"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("iso-27004")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "iso-27004"]
                        : (field.value || [])?.filter(
                            (value: string) => value !== "iso-27004"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">ISO/IEC 27004</FormLabel>
                  <FormDescription>
                    Information security measurement metrics
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        
        <div className="mt-6">
          <h5 className="font-medium text-md border-b pb-2 mb-4 text-green-600">
            <span className="inline-block w-3 h-3 rounded-full bg-green-600 mr-2"></span>
            Healthcare-specific Guidelines <span className="text-sm font-normal text-green-600">(Optional)</span>
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="healthcareGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("nist-800-66")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "nist-800-66"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "nist-800-66"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">NIST SP 800-66 Rev. 2</FormLabel>
                    <FormDescription>
                      HIPAA Security Rule implementation guide
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="healthcareGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("hhs-hipaa-series")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "hhs-hipaa-series"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "hhs-hipaa-series"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">HHS HIPAA Security Series</FormLabel>
                    <FormDescription>
                      Detailed guidance on risk analysis and encryption
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="healthcareGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("fda-premarket")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "fda-premarket"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "fda-premarket"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">FDA Pre-market Cybersecurity Guidance</FormLabel>
                    <FormDescription>
                      Medical device security
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="healthcareGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("mds2")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "mds2"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "mds2"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">MDS2</FormLabel>
                    <FormDescription>
                      Medical Device Security Standard - Manufacturer disclosure form
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="healthcareGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("nh-isac")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "nh-isac"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "nh-isac"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">NH-ISAC Healthcare Cybersecurity Framework</FormLabel>
                    <FormDescription>
                      Threat intelligence sharing
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="healthcareGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("ama-guidelines")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "ama-guidelines"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "ama-guidelines"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">AMA Cybersecurity Guidelines</FormLabel>
                    <FormDescription>
                      Physician practice recommendations
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Government & Critical Infrastructure Guidelines */}
        <div className="mt-6">
          <h5 className="font-medium text-md border-b pb-2 mb-4 text-green-600">
            <span className="inline-block w-3 h-3 rounded-full bg-green-600 mr-2"></span>
            Government & Critical Infrastructure Guidelines <span className="text-sm font-normal text-green-600">(Optional)</span>
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="governmentGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("fedramp")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "fedramp"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "fedramp"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">FedRAMP Guidelines</FormLabel>
                    <FormDescription>
                      Federal cloud security requirements
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="governmentGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("dhs-cisa")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "dhs-cisa"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "dhs-cisa"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">DHS/CISA Guidance</FormLabel>
                    <FormDescription>
                      Critical infrastructure security guidance
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="governmentGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("800-82")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "800-82"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "800-82"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">NIST SP 800-82</FormLabel>
                    <FormDescription>
                      Industrial Control Systems Security Guide
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="governmentGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("dod-5220")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "dod-5220"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "dod-5220"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">DoD 5220.22-M</FormLabel>
                    <FormDescription>
                      National Industrial Security Program
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Privacy-Focused Guidelines */}
        <div className="mt-6">
          <h5 className="font-medium text-md border-b pb-2 mb-4 text-green-600">
            <span className="inline-block w-3 h-3 rounded-full bg-green-600 mr-2"></span>
            Privacy-Focused Guidelines <span className="text-sm font-normal text-green-600">(Optional)</span>
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="privacyGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("nist-800-53-privacy")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "nist-800-53-privacy"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "nist-800-53-privacy"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">NIST SP 800-53 Appendix J</FormLabel>
                    <FormDescription>
                      Privacy control catalog
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="privacyGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("gdpr-guidance")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "gdpr-guidance"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "gdpr-guidance"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">EDPB GDPR Guidance</FormLabel>
                    <FormDescription>
                      European Data Protection Board guidelines on GDPR implementation
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="privacyGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("nist-privacy-framework")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "nist-privacy-framework"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "nist-privacy-framework"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">NIST Privacy Framework</FormLabel>
                    <FormDescription>
                      Privacy risk management practices
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="privacyGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("ccpa-guidance")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "ccpa-guidance"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "ccpa-guidance"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">CCPA Compliance Guide</FormLabel>
                    <FormDescription>
                      California Consumer Privacy Act implementation guidance
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Cloud & IoT Guidelines */}
        <div className="mt-6">
          <h5 className="font-medium text-md border-b pb-2 mb-4 text-green-600">
            <span className="inline-block w-3 h-3 rounded-full bg-green-600 mr-2"></span>
            Cloud & IoT Guidelines <span className="text-sm font-normal text-green-600">(Optional)</span>
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cloudIotGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("cloud-security-alliance")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "cloud-security-alliance"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "cloud-security-alliance"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">CSA Cloud Controls Matrix</FormLabel>
                    <FormDescription>
                      Cloud Security Alliance's framework for cloud-specific security controls
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cloudIotGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("nist-iot")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "nist-iot"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "nist-iot"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">NIST IR 8259</FormLabel>
                    <FormDescription>
                      IoT device security guidance
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cloudIotGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("aws-well-architected")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "aws-well-architected"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "aws-well-architected"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">AWS Well-Architected Framework</FormLabel>
                    <FormDescription>
                      Best practices for cloud architectures
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cloudIotGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("azure-security")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "azure-security"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "azure-security"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">Azure Security Benchmarks</FormLabel>
                    <FormDescription>
                      Microsoft Azure cloud security guidance
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Operational Guidelines */}
        <div className="mt-6">
          <h5 className="font-medium text-md border-b pb-2 mb-4 text-green-600">
            <span className="inline-block w-3 h-3 rounded-full bg-green-600 mr-2"></span>
            Operational Guidelines <span className="text-sm font-normal text-green-600">(Optional)</span>
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="operationalGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("itil")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "itil"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "itil"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">ITIL Framework</FormLabel>
                    <FormDescription>
                      IT service management best practices
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="operationalGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("soc-operations")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "soc-operations"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "soc-operations"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">SOC Operations Framework</FormLabel>
                    <FormDescription>
                      Security operations center management guidance
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="operationalGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("devops-secure")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "devops-secure"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "devops-secure"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">DevSecOps Guidelines</FormLabel>
                    <FormDescription>
                      Secure software development lifecycle practices
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="operationalGuidelines"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-green-50">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes("nist-800-34")}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), "nist-800-34"]
                          : (field.value || [])?.filter(
                              (value: string) => value !== "nist-800-34"
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">NIST SP 800-34</FormLabel>
                    <FormDescription>
                      Contingency planning guide for information systems
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}