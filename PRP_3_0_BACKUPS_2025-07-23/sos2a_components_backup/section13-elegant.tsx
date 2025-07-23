import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { UserPlus, FileDown } from "lucide-react";

export function Section13Content({ form }: { form: any }) {
  return (
    <>
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
                "EMP001,John,Smith,john.smith@example.com,IT Manager,Information Technology,human,privileged,drivers_license,NY-DMV,yes,app+sms,\"123 Main St, New York, NY 10001\",jane.doe@example.com,Full Time,2025-04-15,2025-03-01,\"ERP, CRM, IT Admin Portal\",9:00-17:00,medium,30,yes,60,yes,Active Directory",
                "EMP002,Sarah,Johnson,sarah.johnson@example.com,Finance Director,Finance,human,admin,state_id,CA-DMV,yes,hardware,\"456 Oak Ave, Los Angeles, CA 90210\",executive@example.com,Full Time,2025-04-20,2025-03-01,\"ERP, Finance Portal, Expense System\",8:00-18:00,high,30,yes,30,yes,Okta SSO"
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
        
        {/* UWA Matrix Form */}
        <div className="p-4 border rounded-md mb-4 bg-muted/10 mt-4">
          <h5 className="text-sm font-medium mb-3">UWA Component Selection Matrix</h5>
          <p className="text-xs text-muted-foreground mb-3">
            Select the components needed for your UWA intermediate representation. Required fields depend on identity type.
            Organizations can customize which fields to include in their UWA generation based on their specific needs.
          </p>
          <div className="flex items-center gap-2 mb-3">
            <span className="h-4 w-4 text-amber-500">⚠</span>
            <p className="text-xs text-amber-500">
              The matrix below shows an example configuration. All 31 identity components can be used to create a customized UWA.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="py-2 px-3 text-left font-medium text-xs border-r">Components of Identification</th>
                  <th className="py-2 px-3 text-left font-medium text-xs border-r">Human</th>
                  <th className="py-2 px-3 text-left font-medium text-xs border-r">Machine</th>
                  <th className="py-2 px-3 text-left font-medium text-xs border-r">API</th>
                  <th className="py-2 px-3 text-left font-medium text-xs">Third-Party</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-muted/5">
                  <td className="py-2 px-3 border-r font-medium">Name</td>
                  <td className="py-2 px-3 border-r">
                    <Checkbox checked={true} className="data-[state=checked]:bg-primary" />
                  </td>
                  <td className="py-2 px-3 border-r">
                    <Checkbox checked={true} className="data-[state=checked]:bg-primary" />
                  </td>
                  <td className="py-2 px-3 border-r">
                    <Checkbox checked={false} />
                  </td>
                  <td className="py-2 px-3">
                    <Checkbox checked={true} className="data-[state=checked]:bg-primary" />
                  </td>
                </tr>
                <tr className="hover:bg-muted/5">
                  <td className="py-2 px-3 border-r font-medium">Address</td>
                  <td className="py-2 px-3 border-r">
                    <Checkbox checked={true} className="data-[state=checked]:bg-primary" />
                  </td>
                  <td className="py-2 px-3 border-r">
                    <Checkbox checked={false} />
                  </td>
                  <td className="py-2 px-3 border-r">
                    <Checkbox checked={false} />
                  </td>
                  <td className="py-2 px-3">
                    <Checkbox checked={true} className="data-[state=checked]:bg-primary" />
                  </td>
                </tr>
                <tr className="hover:bg-muted/5">
                  <td className="py-2 px-3 border-r font-medium">Phone Number</td>
                  <td className="py-2 px-3 border-r">
                    <Checkbox checked={true} className="data-[state=checked]:bg-primary" />
                  </td>
                  <td className="py-2 px-3 border-r">
                    <Checkbox checked={false} />
                  </td>
                  <td className="py-2 px-3 border-r">
                    <Checkbox checked={false} />
                  </td>
                  <td className="py-2 px-3">
                    <Checkbox checked={true} className="data-[state=checked]:bg-primary" />
                  </td>
                </tr>
                <tr className="hover:bg-muted/5">
                  <td className="py-2 px-3 border-r font-medium">Email</td>
                  <td className="py-2 px-3 border-r">
                    <Checkbox checked={true} className="data-[state=checked]:bg-primary" />
                  </td>
                  <td className="py-2 px-3 border-r">
                    <Checkbox checked={true} className="data-[state=checked]:bg-primary" />
                  </td>
                  <td className="py-2 px-3 border-r">
                    <Checkbox checked={true} className="data-[state=checked]:bg-primary" />
                  </td>
                  <td className="py-2 px-3">
                    <Checkbox checked={true} className="data-[state=checked]:bg-primary" />
                  </td>
                </tr>
                <tr className="hover:bg-muted/5">
                  <td className="py-2 px-3 border-r font-medium">Date of Birth</td>
                  <td className="py-2 px-3 border-r">
                    <Checkbox checked={true} className="data-[state=checked]:bg-primary" />
                  </td>
                  <td className="py-2 px-3 border-r">
                    <Checkbox checked={false} />
                  </td>
                  <td className="py-2 px-3 border-r">
                    <Checkbox checked={false} />
                  </td>
                  <td className="py-2 px-3">
                    <Checkbox checked={false} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 1. Identification Section */}
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
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="service-account">Service Account</SelectItem>
                    <SelectItem value="system-account">System Account</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
                    <SelectGroup>
                      <SelectLabel>Standard Authentication</SelectLabel>
                      <SelectItem value="username-password">Username/Password</SelectItem>
                      <SelectItem value="employee-id">Employee ID</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="smart-card">Smart Card</SelectItem>
                      <SelectItem value="sso">Single Sign-On</SelectItem>
                      <SelectItem value="token">Token-based</SelectItem>
                    </SelectGroup>
                    
                    <SelectGroup>
                      <SelectLabel>Advanced Authentication</SelectLabel>
                      <SelectItem value="mfa">MFA (Multi-Factor Authentication)</SelectItem>
                      <SelectItem value="uwa">UWA (Universal Wallet Address)</SelectItem>
                    </SelectGroup>
                    
                    <SelectGroup>
                      <SelectLabel>Biometric</SelectLabel>
                      <SelectItem value="biometric-fingerprint">Biometric - Fingerprint</SelectItem>
                      <SelectItem value="biometric-voice">Biometric - Voice</SelectItem>
                      <SelectItem value="biometric-facial">Biometric - Facial</SelectItem>
                      <SelectItem value="biometric-iris">Biometric - Iris</SelectItem>
                    </SelectGroup>
                    
                    <SelectGroup>
                      <SelectLabel>Government IDs</SelectLabel>
                      <SelectItem value="drivers-license">Driver's License</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="national-id">National ID</SelectItem>
                      <SelectItem value="military-id">Military ID</SelectItem>
                      <SelectItem value="state-id">State ID</SelectItem>
                      <SelectItem value="birth-certificate">Birth Certificate</SelectItem>
                      <SelectItem value="social-security">Social Security Card</SelectItem>
                      <SelectItem value="citizenship-certificate">Certificate of Citizenship</SelectItem>
                    </SelectGroup>
                    
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* 2. Authentication Practices Section */}
      <div className="border rounded-md p-4 mb-6">
        <h4 className="font-medium mb-4">2. Authentication Practices</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </div>

      {/* 3. Google Location Conversion Section */}
      <div className="border rounded-md p-4 mb-6">
        <h4 className="font-medium mb-4">3. Google Location Conversion</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="identityBehaviorHygiene.physicalAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Physical Address</FormLabel>
                <FormDescription>Full address for Google Maps conversion</FormDescription>
                <FormControl>
                  <Textarea 
                    placeholder="Enter full physical address"
                    className="resize-none"
                    rows={3}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      // Google location conversion logic - last 7 characters for UWA
                      const address = e.target.value;
                      if (address && address.length >= 7) {
                        const locationCode = address.slice(-7);
                        // This would trigger UWA component update with location data
                        console.log('Location code for UWA:', locationCode);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="identityBehaviorHygiene.locationVerification"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4 rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Location Verification</FormLabel>
                  <FormDescription>
                    Verify location through Google Maps integration
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* 4. Access Behavior Section */}
      <div className="border rounded-md p-4 mb-6">
        <h4 className="font-medium mb-4">4. Access Behavior</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <SelectValue placeholder="Select login pattern" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="regular-hours">Regular Business Hours</SelectItem>
                    <SelectItem value="extended-hours">Extended Hours</SelectItem>
                    <SelectItem value="24-7">24/7 Access</SelectItem>
                    <SelectItem value="scheduled">Scheduled Access</SelectItem>
                    <SelectItem value="on-demand">On-Demand</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="identityBehaviorHygiene.accessFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Frequency</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="occasional">Occasional</SelectItem>
                    <SelectItem value="emergency-only">Emergency Only</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* 5. Privilege Level Section */}
      <div className="border rounded-md p-4 mb-6">
        <h4 className="font-medium mb-4">5. Privilege Level</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="identityBehaviorHygiene.accessLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Level</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tier1">Tier 1 (Basic)</SelectItem>
                    <SelectItem value="tier2">Tier 2 (Standard)</SelectItem>
                    <SelectItem value="tier3">Tier 3 (Elevated)</SelectItem>
                    <SelectItem value="tier4">Tier 4 (Administrative)</SelectItem>
                    <SelectItem value="tier5">Tier 5 (Executive)</SelectItem>
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
        </div>
      </div>

      {/* 6. Risk Assessment Section */}
      <div className="border rounded-md p-4 mb-6">
        <h4 className="font-medium mb-4">6. Risk Assessment</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="identityBehaviorHygiene.assignedRiskLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned Risk Level</FormLabel>
                <FormDescription>E.g., "High" for finance admins</FormDescription>
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
                    <SelectItem value="azure-ad">Azure AD / Entra ID</SelectItem>
                    <SelectItem value="okta">Okta</SelectItem>
                    <SelectItem value="ping">PingIdentity</SelectItem>
                    <SelectItem value="aws">AWS IAM</SelectItem>
                    <SelectItem value="google">Google Workspace</SelectItem>
                    <SelectItem value="on-prem-ad">On-Prem Active Directory</SelectItem>
                    <SelectItem value="none">None - Local Accounts Only</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* 7. Access & Permissions Section */}
      <div className="border rounded-md p-4 mb-6">
        <h4 className="font-medium mb-4">7. Access & Permissions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="identityBehaviorHygiene.assignedRoles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned Roles</FormLabel>
                <FormDescription>RBAC groups, e.g., "Finance-ReadOnly"</FormDescription>
                <FormControl>
                  <Input placeholder="Enter assigned roles" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="identityBehaviorHygiene.systemAccess"
            render={({ field }) => (
              <FormItem>
                <FormLabel>System Access</FormLabel>
                <FormDescription>List of systems this identity can access</FormDescription>
                <FormControl>
                  <Textarea 
                    placeholder="Enter accessible systems"
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}