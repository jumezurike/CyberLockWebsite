import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Simple identity form
export function IdentityForm({ form }) {
  return (
    <div className="space-y-6">
      {/* 1. Identification section */}
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

      {/* 2. Authentication Practices Section */}
      <div className="border rounded-md p-4 mb-6">
        <h4 className="font-medium mb-4">2. Authentication Practices</h4>
        <div className="space-y-6">
          {/* MFA Types */}
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

          {/* Biometric Authentication */}
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
        </div>
      </div>
    </div>
  );
}