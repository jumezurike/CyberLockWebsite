import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import type { Sos2aFormData } from "@/lib/sos2a-types";
import { formSchema } from "@/lib/sos2a-types";

export function QuestionnaireForm() {
  const { toast } = useToast();
  
  const form = useForm<Sos2aFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessAddress: "",
      businessLocation: { city: "", state: "", country: "", zipCode: "" },
      industry: "",
      customIndustry: "",
      showCustomIndustry: false,
      employeeCount: "",
      businessServices: "",
      operationMode: [],
      customOperationMode: "",
      showCustomOperationMode: false,
      internetPresence: [],
      primaryConcerns: [],
      securityRisks: [],
      websiteVulnerabilities: [],
      endDeviceVulnerabilities: [],
      vulnerabilities: [],
      configurationManagement: "",
      systemHardeningApproach: "",
      operatingSystems: [],
      customOperatingSystem: "",
      showCustomOperatingSystem: false,
      networkInfrastructure: [],
      accessControl: [],
      dataProtection: [],
      incidentResponse: [],
      complianceFrameworks: [],
      budgetConstraints: "",
      securityResources: "",
      futureSecurityGoals: "",
      contactMethod: "",
      timeline: "",
      additionalComments: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      deviceInventory: {
        servers: [],
        laptops: [],
        desktops: [],
        tablets: [],
        smartphones: [],
        iot: [],
        containers: [],
        networkDevices: [],
        operatingSystems: [],
        mobileDevices: []
      },
      identityBehaviorHygiene: {
        authenticationMethods: [],
        privilegedAccounts: [],
        accountLifecycle: [],
        accessManagement: [],
        behaviorMonitoring: [],
        multifactorAuthentication: false,
        singleSignOn: false,
        privilegedAccessManagement: false,
        identityGovernance: false,
        riskBasedAuthentication: false,
        behaviorAnalytics: false,
        userAccountAuditing: false,
        privilegeEscalationDetection: false,
        suspiciousLoginDetection: false,
        unusedAccountDetection: false,
        privilegeEscalationAlerts: false,
        typicalLoginPatterns: "",
        anomalyDetectionFlags: false,
        dataAccessTrends: "",
        toolCommandUsage: ""
      }
    },
  });

  const onSubmit = (data: Sos2aFormData) => {
    console.log("Submitting assessment:", data);
    toast({
      title: "Assessment Submitted",
      description: "Your SOS²A questionnaire has been submitted successfully.",
    });
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          SOS²A Security Assessment Questionnaire
        </CardTitle>
        <CardDescription className="text-center">
          Healthcare Organizational and System Security Analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-7 lg:grid-cols-14">
                <TabsTrigger value="business">1. Business</TabsTrigger>
                <TabsTrigger value="infrastructure">2. Infrastructure</TabsTrigger>
                <TabsTrigger value="security">3. Security</TabsTrigger>
                <TabsTrigger value="network">4. Network</TabsTrigger>
                <TabsTrigger value="access">5. Access</TabsTrigger>
                <TabsTrigger value="data">6. Data</TabsTrigger>
                <TabsTrigger value="incident">7. Incident</TabsTrigger>
                <TabsTrigger value="compliance">8. Compliance</TabsTrigger>
                <TabsTrigger value="budget">9. Budget</TabsTrigger>
                <TabsTrigger value="goals">10. Goals</TabsTrigger>
                <TabsTrigger value="contact">11. Contact</TabsTrigger>
                <TabsTrigger value="device-inventory">12. Device Inventory</TabsTrigger>
                <TabsTrigger value="identity-behavior">13. Identity Behavior & Hygiene</TabsTrigger>
                <TabsTrigger value="confirmation">14. Confirmation</TabsTrigger>
              </TabsList>

              {/* 13. Identity Behavior & Hygiene Tab */}
              <TabsContent value="identity-behavior" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">13. Identity Behavior & Hygiene</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Track and manage identity behaviors, authentication practices, and user access patterns.
                  </p>

                  {/* UWA Records Management Section */}
                  <div className="border rounded-md p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">UWA Records Management</h4>
                        <p className="text-sm text-muted-foreground">
                          Manage Universal Wallet Address components and tracking
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Import Identity CSV
                        </Button>
                        <Button variant="outline" size="sm">
                          Download Template
                        </Button>
                        <Button variant="default" size="sm" className="bg-[#7936b0] hover:bg-[#6b2aa2]">
                          Manage DNA
                        </Button>
                      </div>
                    </div>

                    {/* Filter Controls */}
                    <div className="flex space-x-4 mb-4">
                      <div className="flex-1">
                        <label className="text-sm font-medium">Filter by Identity Type</label>
                        <select className="w-full mt-1 px-3 py-2 border rounded-md">
                          <option value="">All Types</option>
                          <option value="Physical Machine">Physical Machine</option>
                          <option value="Virtual Machine">Virtual Machine</option>
                          <option value="Human/Individual">Human/Individual</option>
                          <option value="Business Owner">Business Owner</option>
                          <option value="User Account">User Account</option>
                          <option value="Service Account">Service Account</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-sm font-medium">Identification Method</label>
                        <select className="w-full mt-1 px-3 py-2 border rounded-md">
                          <option value="">All Methods</option>
                          <option value="Serial Number">Serial Number</option>
                          <option value="MAC Address">MAC Address</option>
                          <option value="Biometric">Biometric</option>
                          <option value="Certificate">Certificate</option>
                          <option value="Token">Token</option>
                          <option value="Username/Password">Username/Password</option>
                        </select>
                      </div>
                    </div>

                    {/* UWA Records Table */}
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/10">
                          <tr>
                            <th className="text-left p-3 text-sm font-medium">UWA</th>
                            <th className="text-left p-3 text-sm font-medium">Identity Type</th>
                            <th className="text-left p-3 text-sm font-medium">ID Method</th>
                            <th className="text-left p-3 text-sm font-medium">Server ID</th>
                            <th className="text-left p-3 text-sm font-medium">UUID</th>
                            <th className="text-left p-3 text-sm font-medium">SN</th>
                            <th className="text-left p-3 text-sm font-medium">Make/Model</th>
                            <th className="text-left p-3 text-sm font-medium">Entity Type</th>
                            <th className="text-left p-3 text-sm font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t">
                            <td className="p-3 font-mono text-xs">CLX-PR8c4-47ae-bebe-4087c52abdf4</td>
                            <td className="p-3">Machine</td>
                            <td className="p-3">Serial Number</td>
                            <td className="p-3">srv-34522</td>
                            <td className="p-3 font-mono text-xs">1c-49ca-47ae-bebe-4087c52abdf4</td>
                            <td className="p-3">HX653-9871</td>
                            <td className="p-3">Dell PowerEdge R740</td>
                            <td className="p-3">
                              <Badge variant="outline">virtual machine</Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex space-x-1">
                                <Button variant="ghost" size="sm">👁</Button>
                                <Button variant="ghost" size="sm">📋</Button>
                                <Button variant="ghost" size="sm" className="text-red-600">🗑</Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-t bg-muted/5">
                            <td className="p-3 font-mono text-xs">CLX-PD-31a8ji-ebhs-39j5-acdoi4</td>
                            <td className="p-3">Machine</td>
                            <td className="p-3">Serial Number</td>
                            <td className="p-3">srv-67891</td>
                            <td className="p-3 font-mono text-xs">a8d45c3f...</td>
                            <td className="p-3">JK129-556P</td>
                            <td className="p-3">HPE ProLiant DL380</td>
                            <td className="p-3">
                              <Badge variant="outline">Virtual machine</Badge>
                              <div className="mt-1">
                                <Badge className="bg-green-500 hover:bg-green-600 text-xs">Yes</Badge>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex space-x-1">
                                <Button variant="ghost" size="sm">👁</Button>
                                <Button variant="ghost" size="sm">📋</Button>
                                <Button variant="ghost" size="sm" className="text-red-600">🗑</Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 text-sm text-muted-foreground">
                      Showing 2 of 2 UWA records
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.querySelector('[value="device-inventory"]')?.click()}
                    >
                      Previous Step
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => document.querySelector('[value="confirmation"]')?.click()}
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* 14. Confirmation Tab */}
              <TabsContent value="confirmation" className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">14. Contact Confirmation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Provide contact details for follow-up and select your assessment type.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-center w-full mt-6">
                    <Button 
                      type="submit" 
                      className="bg-[#7936b0] hover:bg-[#6b2aa2] text-white font-medium text-lg py-4 w-full"
                    >
                      Submit Questionnaire
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}