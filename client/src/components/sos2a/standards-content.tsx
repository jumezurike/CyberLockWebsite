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
      {/* Universal Security Standards */}
      <div className="mb-6">
        <h4 className="font-medium text-lg border-b pb-2 mb-4">Universal Security Standards <span className="text-sm font-normal text-red-600">(Mandatory)</span></h4>
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
                    Information Security Management System Standard
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
                    Security and Privacy Controls for Federal Information Systems
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
                
      {/* Healthcare-specific Standards */}
      <div className="mb-6">
        <h4 className="font-medium text-lg border-b pb-2 mb-4 text-blue-600">Healthcare-specific Standards <span className="text-sm font-normal text-red-600">(Mandatory for Healthcare)</span></h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <FormLabel className="font-medium">DICOM</FormLabel>
                  <FormDescription>
                    Digital Imaging and Communications in Medicine
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
                  <FormLabel className="font-medium">HL7</FormLabel>
                  <FormDescription>
                    Health Level Seven International
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Industry-specific Standards */}
      <div>
        <h4 className="font-medium text-lg border-b pb-2 mb-4">Industry-specific Standards</h4>
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
                    Industrial Automation and Control Systems Security
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
                    Federal Information Processing Standard (Cryptographic Modules)
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