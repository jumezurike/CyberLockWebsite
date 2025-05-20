import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Simple identity form section
const BasicIdentitySection = ({ form }) => {
  return (
    <div className="space-y-6">
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
};

export default BasicIdentitySection;