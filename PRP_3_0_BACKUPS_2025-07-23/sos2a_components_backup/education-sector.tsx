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

interface EducationSectorProps {
  form: {
    control: Control<Sos2aFormData>;
  };
}

export function EducationSector({ form }: EducationSectorProps) {
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
      {/* Education Sector Compliance */}
      <div>
        <h4 className="font-medium text-lg border-b pb-2 mb-4 text-green-600">
          <span className="inline-block w-3 h-3 rounded-full bg-green-600 mr-2"></span>
          Education Sector Compliance <span className="text-sm font-normal">(Guidelines)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            key="ferpa"
            control={form.control}
            name="educationRequirements"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("ferpa")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "ferpa"]
                        : (field.value || [])?.filter(
                            (value) => value !== "ferpa"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">FERPA</FormLabel>
                  <FormDescription>
                    Family Educational Rights and Privacy Act
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Region:</strong> United States</span>
                      <span className="block"><strong>Purpose:</strong> Privacy and security of student educational records</span>
                      <span className="block"><strong>Requirements:</strong> Protect student records, parental access rights</span>
                    </div>
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            key="coppa"
            control={form.control}
            name="educationRequirements"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("coppa")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "coppa"]
                        : (field.value || [])?.filter(
                            (value) => value !== "coppa"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">COPPA</FormLabel>
                  <FormDescription>
                    Children's Online Privacy Protection Act
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Region:</strong> United States</span>
                      <span className="block"><strong>Purpose:</strong> Protecting the privacy of children online</span>
                      <span className="block"><strong>Requirements:</strong> Parental consent for data collection</span>
                    </div>
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Cloud Security Compliance */}
      <div>
        <h4 className="font-medium text-lg border-b pb-2 mb-4 text-red-600">
          <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2"></span>
          Cloud Security Compliance <span className="text-sm font-normal">(Standards)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            key="csa-star"
            control={form.control}
            name="cloudRequirements"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("csa-star")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "csa-star"]
                        : (field.value || [])?.filter(
                            (value) => value !== "csa-star"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">CSA STAR</FormLabel>
                  <FormDescription>
                    Cloud Security Alliance - Security Trust Assurance and Risk
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Region:</strong> Global</span>
                      <span className="block"><strong>Purpose:</strong> Assurance and transparency for cloud computing security</span>
                      <span className="block"><strong>Requirements:</strong> Continuous monitoring, security controls</span>
                    </div>
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            key="fedramp"
            control={form.control}
            name="cloudRequirements"
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
                    Federal Risk and Authorization Management Program
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Region:</strong> U.S. Federal Agencies</span>
                      <span className="block"><strong>Purpose:</strong> Security assessment for cloud services used by the government</span>
                      <span className="block"><strong>Requirements:</strong> Continuous monitoring, risk management</span>
                    </div>
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Cybersecurity Standards */}
      <div>
        <h4 className="font-medium text-lg border-b pb-2 mb-4 text-red-600">
          <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2"></span>
          Cybersecurity Standards <span className="text-sm font-normal">(Standards)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            key="iso27001"
            control={form.control}
            name="cyberRequirements"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
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
                  <FormLabel className="font-medium">ISO/IEC 27001</FormLabel>
                  <FormDescription>
                    Information Security Management
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Region:</strong> International</span>
                      <span className="block"><strong>Purpose:</strong> Comprehensive information security management</span>
                      <span className="block"><strong>Requirements:</strong> Risk assessment, security controls</span>
                    </div>
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            key="soc2"
            control={form.control}
            name="cyberRequirements"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("soc2")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "soc2"]
                        : (field.value || [])?.filter(
                            (value) => value !== "soc2"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">SOC 2</FormLabel>
                  <FormDescription>
                    System and Organization Controls
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Region:</strong> Global</span>
                      <span className="block"><strong>Purpose:</strong> Controls relevant to security, availability, processing integrity, confidentiality, and privacy</span>
                      <span className="block"><strong>Requirements:</strong> Regular audits, continuous monitoring</span>
                    </div>
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            key="nist-csf"
            control={form.control}
            name="cyberRequirements"
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
                  <FormLabel className="font-medium">NIST Cybersecurity Framework</FormLabel>
                  <FormDescription>
                    National Institute of Standards and Technology CSF
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Region:</strong> United States, widely adopted internationally</span>
                      <span className="block"><strong>Purpose:</strong> Standardized cybersecurity risk management framework</span>
                      <span className="block"><strong>Core Functions:</strong> Identify, Protect, Detect, Respond, Recover</span>
                    </div>
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            key="cis-controls"
            control={form.control}
            name="cyberRequirements"
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
                    Center for Internet Security Controls
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Region:</strong> Global</span>
                      <span className="block"><strong>Purpose:</strong> Prioritized cybersecurity best practices</span>
                      <span className="block"><strong>Implementation Groups:</strong> IG1 (Basic), IG2 (Foundational), IG3 (Organizational)</span>
                    </div>
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Environmental & Social Compliance */}
      <div>
        <h4 className="font-medium text-lg border-b pb-2 mb-4 text-green-600">
          <span className="inline-block w-3 h-3 rounded-full bg-green-600 mr-2"></span>
          Environmental & Social Compliance <span className="text-sm font-normal">(Guidelines)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            key="esg"
            control={form.control}
            name="esgRequirements"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("esg")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "esg"]
                        : (field.value || [])?.filter(
                            (value) => value !== "esg"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">ESG Standards</FormLabel>
                  <FormDescription>
                    Environmental, Social, and Governance Standards
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Region:</strong> Global</span>
                      <span className="block"><strong>Purpose:</strong> Sustainability and corporate social responsibility reporting</span>
                      <span className="block"><strong>IT Impact:</strong> Data center energy efficiency, responsible recycling</span>
                    </div>
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Best-Practice Frameworks */}
      <div>
        <h4 className="font-medium text-lg border-b pb-2 mb-4 text-green-600">
          <span className="inline-block w-3 h-3 rounded-full bg-green-600 mr-2"></span>
          Best-Practice Frameworks <span className="text-sm font-normal">(Guidelines)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            key="itil"
            control={form.control}
            name="bestPracticeFrameworks"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("itil")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "itil"]
                        : (field.value || [])?.filter(
                            (value) => value !== "itil"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">ITIL</FormLabel>
                  <FormDescription>
                    Information Technology Infrastructure Library
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Focus:</strong> IT service management best practices</span>
                    </div>
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            key="cobit"
            control={form.control}
            name="bestPracticeFrameworks"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("cobit")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "cobit"]
                        : (field.value || [])?.filter(
                            (value) => value !== "cobit"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">COBIT</FormLabel>
                  <FormDescription>
                    Control Objectives for Information and Related Technologies
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Focus:</strong> IT governance and management framework</span>
                    </div>
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            key="owasp"
            control={form.control}
            name="bestPracticeFrameworks"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes("owasp")}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked
                        ? [...(field.value || []), "owasp"]
                        : (field.value || [])?.filter(
                            (value) => value !== "owasp"
                          );
                      field.onChange(updatedValue);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-medium">OWASP Top 10</FormLabel>
                  <FormDescription>
                    Open Web Application Security Project
                    <div className="mt-2 text-xs">
                      <span className="block"><strong>Focus:</strong> Web application security risks and mitigations</span>
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