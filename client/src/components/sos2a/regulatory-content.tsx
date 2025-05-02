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

interface RegulatoryContentProps {
  form: {
    control: Control<Sos2aFormData>;
  };
}

export function RegulatoryContent({ form }: RegulatoryContentProps) {
  return (
    <div className="space-y-8">
      {/* Global Data Protection */}
      <div>
        <h4 className="font-medium text-lg border-b pb-2 mb-4">Global Data Protection Regulations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            key="gdpr"
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
            key="ccpa"
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
                  <FormLabel className="font-medium">PCI-DSS (Global)</FormLabel>
                  <FormDescription>
                    Payment Card Industry Data Security Standard
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Requirements:</strong> Secure cardholder data, quarterly vulnerability scans</span>
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
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Safeguards Rule:</strong> Protect customer financial data</span>
                    </div>
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
                  <FormLabel className="font-medium">NIST SP 800-171 (USA)</FormLabel>
                  <FormDescription>
                    CUI Protection for DoD Contractors
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Requirements:</strong> Protect CUI (Controlled Unclassified Information)</span>
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
                    checked={field.value?.includes("nis2")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "nis2"]
                        : (field.value || [])?.filter(
                            (value) => value !== "nis2"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">NIS2 Directive (EU)</FormLabel>
                  <FormDescription>
                    EU Critical Infrastructure Security
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Requirements:</strong> Incident reporting within 24 hours</span>
                    </div>
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Industry-specific */}
      <div>
        <h4 className="font-medium text-lg border-b pb-2 mb-4">Industry-Specific Regulations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="regulatoryRequirements"
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
                  <FormLabel className="font-medium">IEC 62443 (Industrial)</FormLabel>
                  <FormDescription>
                    Industrial Automation and Control Systems Security
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Focus:</strong> Secure industrial control systems and operational technology</span>
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
                  <FormLabel className="font-medium">TISAX (Automotive)</FormLabel>
                  <FormDescription>
                    Trusted Information Security Assessment Exchange
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Requirements:</strong> Secure prototype data, supply chain audits</span>
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
                    checked={field.value?.includes("fips")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "fips"]
                        : (field.value || [])?.filter(
                            (value) => value !== "fips"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">FIPS 140-2/3 (Cryptography)</FormLabel>
                  <FormDescription>
                    Federal Information Processing Standard
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Focus:</strong> Cryptographic module validation for federal systems</span>
                    </div>
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}