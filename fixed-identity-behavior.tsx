import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// This is a simplified version for the identity behavior section in one tab
const IdentityBehaviorTab = () => {
  const form = useForm();

  return (
    <Tabs defaultValue="identification" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="identification">1. Identification</TabsTrigger>
        <TabsTrigger value="authentication">2. Authentication</TabsTrigger>
      </TabsList>
      
      <TabsContent value="identification" className="space-y-4 mt-4">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User ID input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">User ID</label>
                    <p className="text-xs text-muted-foreground">Employee ID, service account name</p>
                    <input 
                      className="w-full p-2 border rounded-md text-sm" 
                      placeholder="Enter user ID"
                    />
                  </div>
                  
                  {/* Full Name / Role input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name / Role</label>
                    <input 
                      className="w-full p-2 border rounded-md text-sm" 
                      placeholder="Enter full name and role"
                    />
                  </div>
                  
                  {/* Contact Info input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Info</label>
                    <p className="text-xs text-muted-foreground">Email, phone for emergency access</p>
                    <input 
                      className="w-full p-2 border rounded-md text-sm" 
                      placeholder="Enter contact information"
                    />
                  </div>
                  
                  {/* Identity Type select */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Identity Type</label>
                    <select className="w-full p-2 border rounded-md text-sm">
                      <option value="" disabled selected>Select identity type</option>
                      <option value="human">Human</option>
                      <option value="machine">Machine</option>
                      <option value="api">API</option>
                      <option value="third-party">Third-Party</option>
                    </select>
                  </div>
                  
                  {/* Identification Method select */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Identification Method</label>
                    <select className="w-full p-2 border rounded-md text-sm">
                      <option value="" disabled selected>Select identification method</option>
                      <option value="username">Username</option>
                      <option value="email">Email Address</option>
                      <option value="employee-id">Employee ID</option>
                      <option value="badge">Badge Number</option>
                      <option value="device-id">Device ID</option>
                      <option value="certificate">Certificate</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="button">Next</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="authentication" className="space-y-4 mt-4">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">MFA Types</label>
                    <p className="text-xs text-muted-foreground mb-3">Select all MFA types that are implemented</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {["Mobile App Authenticator", "Hardware Tokens/Keys", "Biometrics", "Push Notifications", "Phone Calls"].map((type) => (
                        <div key={type} className="flex items-start space-x-2">
                          <input type="checkbox" id={type.replace(/\s+/g, '-').toLowerCase()} className="mt-1" />
                          <label htmlFor={type.replace(/\s+/g, '-').toLowerCase()} className="text-sm">{type}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-md flex items-start space-x-3">
                    <input type="checkbox" id="biometric-auth" className="mt-1" />
                    <div className="space-y-1">
                      <label htmlFor="biometric-auth" className="text-sm font-medium">Biometric Authentication</label>
                      <p className="text-xs text-muted-foreground">Do you use biometric authentication?</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="button">Next</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default IdentityBehaviorTab;