import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

export function IdentificationSection({ form }) {
  return (
    <div className="border rounded-md p-4 mb-6">
      <h4 className="font-medium mb-4">1. Identification</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="identityBehaviorHygiene.userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User ID</FormLabel>
              <FormDescription>
                Employee ID, service account name
              </FormDescription>
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
              <FormDescription>
                Email, phone for emergency access
              </FormDescription>
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
                  <SelectItem value="human">Human</SelectItem>
                  <SelectItem value="machine">Machine</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="third-party">Third-Party</SelectItem>
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
                  <SelectItem value="username">Username</SelectItem>
                  <SelectItem value="email">Email Address</SelectItem>
                  <SelectItem value="employee-id">Employee ID</SelectItem>
                  <SelectItem value="badge">Badge Number</SelectItem>
                  <SelectItem value="device-id">Device ID</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export function AuthenticationPracticesSection({ form }) {
  return (
    <div className="border rounded-md p-4 mb-6">
      <h4 className="font-medium mb-4">2. Authentication Practices</h4>
      <div className="space-y-6">
        <div>
          <FormLabel className="mb-2 block">MFA Types</FormLabel>
          <FormDescription className="mb-3">
            Select all MFA types that are implemented
          </FormDescription>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {["Mobile App Authenticator", "Hardware Tokens/Keys", "Biometrics", "Push Notifications", "Phone Calls"].map((type) => (
              <FormField
                key={type}
                control={form.control}
                name="identityBehaviorHygiene.mfaTypes"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={type}
                      className="flex items-start space-x-2"
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
                      <FormLabel className="font-normal text-sm cursor-pointer">
                        {type}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
        </div>

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
        
        <div>
          <FormLabel className="mb-2 block">Biometric Types</FormLabel>
          <FormDescription className="mb-3">
            Select all biometric types that are used
          </FormDescription>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {["Fingerprint", "Facial Recognition", "Voice Recognition", "Iris Scanning", "Palm Vein/Hand Geometry", "Behavioral Biometrics"].map((type) => (
              <FormField
                key={type}
                control={form.control}
                name="identityBehaviorHygiene.biometricTypes"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={type}
                      className="flex items-start space-x-2"
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
                      <FormLabel className="font-normal text-sm cursor-pointer">
                        {type}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccessBehaviorSection({ form }) {
  return (
    <div className="border rounded-md p-4 mb-6">
      <h4 className="font-medium mb-4">3. Access Behavior</h4>
      <div className="space-y-6">
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
                  <SelectItem value="short">Short (<1 hour)</SelectItem>
                  <SelectItem value="medium">Medium (1-4 hours)</SelectItem>
                  <SelectItem value="long">Long (4-8 hours)</SelectItem>
                  <SelectItem value="extended">Extended (>8 hours)</SelectItem>
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
            name="identityBehaviorHygiene.locationBasedControls"
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
  );
}

export function IdentityProtectionSection({ form }) {
  return (
    <div className="border rounded-md p-4 mb-6">
      <h4 className="font-medium mb-4">4. Identity Protection</h4>
      <div className="space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="identityBehaviorHygiene.lastTrainingDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Training Completion Date</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="mm/dd/yyyy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
              <FormDescription>
                If you had incidents, please provide brief details about the nature and impact
              </FormDescription>
              <FormControl>
                <Textarea className="h-24" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export function PrivilegedAccessSection({ form }) {
  return (
    <div className="border rounded-md p-4 mb-6">
      <h4 className="font-medium mb-4">5. Privileged Access Management</h4>
      <div className="space-y-6">
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
          name="identityBehaviorHygiene.adminAccountReviewFrequency"
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
                  <SelectItem value="never">Never</SelectItem>
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
  );
}

export function LifecycleSection({ form }) {
  return (
    <div className="border rounded-md p-4 mb-6">
      <h4 className="font-medium mb-4">6. Lifecycle & Governance</h4>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="offboarding">Offboarding</SelectItem>
                    <SelectItem value="offboarded">Offboarded</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="identityBehaviorHygiene.onboardingDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Onboarding/Offboarding Date</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="mm/dd/yyyy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="identityBehaviorHygiene.formalOffboardingProcess"
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
      </div>
    </div>
  );
}