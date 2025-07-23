import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { UserPlus, FileDown } from "lucide-react";

export function IdentityBehaviorSection({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-4">13. Identity Behavior & Hygiene</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Track and manage identity behaviors, authentication practices, and security hygiene measures.
        </p>
        
        {/* Universal Identity Verification System (UIVS) Section */}
        <div className="border rounded-md p-4 mb-6 bg-blue-50">
          <h4 className="font-medium text-blue-700 mb-2">Universal Identity Verification System (UIVS)</h4>
          <p className="text-sm mb-4">
            For organizations with multiple users, we recommend using our Identity Management system to import and manage all your users in one place with our patented Universal Identity Verification System (UIVS).
          </p>
          <div className="flex flex-wrap gap-3">
            <Button 
              type="button" 
              variant="default" 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/identity-management";
              }}
            >
              <UserPlus className="w-4 h-4 mr-2" /> Manage User Identities
            </Button>
            <Button 
              type="button" 
              variant="default" 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                const csvHeader = "user_id,first_name,last_name,email,role,department,identity_type,access_level,government_id_type,government_id_issuing_authority,mfa_enabled,mfa_type,location,manager,employment_status,last_password_change,last_security_training,system_access,typical_login_hours,login_anomaly_threshold,inactive_account_days,credential_exposure_check,session_timeout_minutes,privilege_escalation_alerts,federation_source";
                const sampleData = [
                  "EMP001,John,Smith,john.smith@example.com,IT Manager,Information Technology,human,privileged,drivers_license,NY-DMV,yes,app+sms,Headquarters,jane.doe@example.com,Full Time,2025-04-15,2025-03-01,\"ERP, CRM, IT Admin Portal\",9:00-17:00,medium,30,yes,60,yes,Active Directory"
                ];
                const csvContent = csvHeader + "\n" + sampleData.join("\n");
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', 'user-identity-template.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <FileDown className="w-4 h-4 mr-2" /> Download Template
            </Button>
          </div>
          
          {/* UWA Component Selection Matrix */}
          <div className="mt-6 border-t pt-4">
            <h5 className="text-sm font-medium mb-3">UWA Component Selection Matrix</h5>
            <p className="text-xs text-muted-foreground mb-4">
              Select the components needed for your UWA intermediate representation. Required fields depend on identity type. Organizations can customize which fields to include in their UWA generation based on their specific needs.
            </p>
            
            {/* UWA Matrix Table */}
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-xs border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 text-left">Components of Identification</th>
                    <th className="border border-gray-300 p-2 text-center">Human</th>
                    <th className="border border-gray-300 p-2 text-center">Machine</th>
                    <th className="border border-gray-300 p-2 text-center">API</th>
                    <th className="border border-gray-300 p-2 text-center">Third-Party</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Name", human: true, machine: false, api: false, thirdParty: false },
                    { name: "Address", human: true, machine: false, api: false, thirdParty: false },
                    { name: "Birthplace", human: true, machine: false, api: false, thirdParty: false },
                    { name: "Date of Birth", human: true, machine: false, api: false, thirdParty: false },
                    { name: "PIN", human: false, machine: false, api: false, thirdParty: false, note: "Not used for UWA" },
                    { name: "SN/IMEI", human: true, machine: true, api: false, thirdParty: false },
                    { name: "Ph#/EIN/SSN/BVN", human: true, machine: false, api: false, thirdParty: false },
                    { name: "Driver License/Passport", human: true, machine: false, api: false, thirdParty: false },
                    { name: "Primary Auth Device IMEI/IOT S/N", human: true, machine: false, api: false, thirdParty: false },
                    { name: "Make/Model+OS", human: false, machine: true, api: false, thirdParty: false },
                    { name: "Manufacturing Date (DOM)", human: false, machine: true, api: false, thirdParty: false },
                    { name: "EC2/DO ID/MAC/SN", human: false, machine: true, api: true, thirdParty: true },
                    { name: "OS", human: false, machine: true, api: true, thirdParty: true },
                    { name: "UUID", human: false, machine: true, api: true, thirdParty: true },
                    { name: "Server ID", human: false, machine: true, api: true, thirdParty: true },
                    { name: "Environment (PR/ST/TD)", human: false, machine: true, api: true, thirdParty: true },
                    { name: "IP Address", human: false, machine: true, api: true, thirdParty: true },
                    { name: "Business Certifications", human: false, machine: false, api: false, thirdParty: true },
                    { name: "Business Licenses", human: false, machine: false, api: false, thirdParty: true },
                    { name: "Utility Bills", human: false, machine: false, api: false, thirdParty: true }
                  ].map((component, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border border-gray-300 p-2">{component.name}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        {component.note ? component.note : (component.human ? "✓" : "")}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {component.note ? component.note : (component.machine ? "✓" : "")}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {component.note ? component.note : (component.api ? "✓" : "")}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {component.note ? component.note : (component.thirdParty ? "✓" : "")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <h6 className="text-xs font-medium text-yellow-800 mb-2">Selected Identity Matrix Fields</h6>
              <p className="text-xs text-yellow-700 mb-2">Advanced Feature - Universal Wallet Address (UWA)</p>
              <p className="text-xs text-yellow-600">
                The UWA system is an optional advanced identity feature that organizations can integrate as their security posture matures. This preview demonstrates how selected identity components are transformed into secure, portable identifiers across your infrastructure.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Identification */}
        <div className="border rounded-md p-4 mb-6">
          <h4 className="font-medium mb-4">1. Identification</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="identityBehaviorHygiene.userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormDescription>Employee ID, service account name</FormDescription>
                  <FormControl>
                    <Input placeholder="Enter user ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="identityBehaviorHygiene.fullNameRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name / Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name and role" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="identityBehaviorHygiene.contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Info</FormLabel>
                  <FormDescription>Email, phone for emergency access</FormDescription>
                  <FormControl>
                    <Input placeholder="Enter contact information" {...field} />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select identity type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="human">Human</SelectItem>
                      <SelectItem value="machine">Machine</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="third-party">Third Party</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="identityBehaviorHygiene.identificationMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identification Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select identification method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="username">Username</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="employee-id">Employee ID</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="smart-card">Smart Card</SelectItem>
                      <SelectItem value="sso">Single Sign-On</SelectItem>
                      <SelectItem value="token">Token-Based</SelectItem>
                      <SelectItem value="uwa">UWA</SelectItem>
                      <SelectItem value="mfa">MFA</SelectItem>
                      <SelectItem value="biometric">Biometric</SelectItem>
                      <SelectItem value="government-id">Government ID</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 2. Authentication Practices */}
        <div className="border rounded-md p-4 mb-6">
          <h4 className="font-medium mb-4">2. Authentication Practices</h4>
          
          <FormField
            control={form.control}
            name="identityBehaviorHygiene.passwordPolicyCompliance"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md mb-4">
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
              <FormItem className="mb-4">
                <FormLabel>Password Policy Details</FormLabel>
                <FormDescription>
                  Describe your password policy requirements (length, complexity, rotation, etc.)
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Describe password policy requirements..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="identityBehaviorHygiene.multifactorAuthentication"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md mb-4">
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
              <FormItem className="mb-4">
                <FormLabel>MFA Types</FormLabel>
                <FormDescription>
                  Select all MFA types that are implemented
                </FormDescription>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "Mobile App Authenticator",
                    "Hardware Tokens/Keys", 
                    "Biometrics",
                    "Push Notifications",
                    "Phone Calls",
                    "SMS/Text Messages",
                    "Email Codes"
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
                                  return checked
                                    ? field.onChange([...(field.value || []), type])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) => value !== type
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {type}
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

          <FormField
            control={form.control}
            name="identityBehaviorHygiene.biometricAuthentication"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md mb-4">
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
                <FormLabel>Biometric Types</FormLabel>
                <FormDescription>
                  Select all biometric types that are used
                </FormDescription>
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
                                  return checked
                                    ? field.onChange([...(field.value || []), type])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) => value !== type
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {type}
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

        {/* Additional forms 3-9 continue here with the same structure... */}
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.querySelector('[value="device-inventory"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
          >
            Previous Step
          </Button>
          <Button 
            type="button"
            onClick={() => document.querySelector('[value="contact"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
}