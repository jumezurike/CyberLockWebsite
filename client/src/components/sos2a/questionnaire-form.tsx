import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sos2aFormData } from "@/lib/sos2a-types";
import { assessmentTools, standardsAndGuidelinesLibrary } from "@/lib/matrix-mappings";
import { RegulatoryContent } from "./regulatory-content";
import { StandardsContent } from "./standards-content";
import { EulaAgreement } from "./eula-agreement";
import { AlertCircle, UserPlus, FileDown, Eye, Copy, Trash, CheckCircle, Clock, ArrowRight, Plus, Filter, Upload, Download, Monitor, Cpu, CloudCog, Users, RotateCcw, Wallet } from "lucide-react";
import { Section13Content } from "./section13-elegant";
import { useToast } from "@/hooks/use-toast";
import { calculateDeviceRiskScore, getRiskLevelFromScore, fetchWazuhRiskScore } from "@/lib/rasbita-risk-scoring";

// Helper function to safely handle potentially undefined arrays
function safeArray<T>(arr: T[] | undefined): T[] {
  return arr || [];
}

const formSchema = z.object({
  // 1. Business Information
  businessName: z.string().min(2, "Business name is required"),
  businessAddress: z.string().min(5, "Business address is required"),
  businessLocation: z.object({
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required"),
    zipCode: z.string().optional(),
  }),
  industry: z.string().min(2, "Industry is required"),
  customIndustry: z.string().optional(),
  showCustomIndustry: z.boolean().optional(),
  employeeCount: z.string().min(1, "Employee count is required"),
  businessServices: z.string().min(1, "Business services description is required"),
  
  // Legal agreements
  eulaAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the End User License Agreement",
  }),
});

interface QuestionnaireFormProps {
  onSubmit: (data: Sos2aFormData) => void;
}

export default function QuestionnaireForm({ onSubmit }: QuestionnaireFormProps) {
  const [eulaAccepted, setEulaAccepted] = useState(false);
  const [currentTab, setCurrentTab] = useState("business");
  const { toast } = useToast();

  const form = useForm<Sos2aFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessAddress: "",
      businessLocation: {
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
      industry: "",
      eulaAccepted: false,
    },
  });

  // Form submission handler
  const handleSubmit = form.handleSubmit((data: Sos2aFormData) => {
    console.log("Form submitted with data:", data);
    onSubmit(data);
  });

  // Tab order for navigation
  const tabOrder = [
    "business", "infrastructure", "risks", "baseline", 
    "security", "compliance", "regulatory", "standards",
    "acq-tools", "adversarial", "isms", "device-inventory",
    "identity-behavior", "contact", "review"
  ];

  // Navigation functions
  const nextTab = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex < tabOrder.length - 1) {
      setCurrentTab(tabOrder[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabOrder[currentIndex - 1]);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">SOS²A Assessment Questionnaire</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-8 lg:grid-cols-15">
                <TabsTrigger value="business">1. Business</TabsTrigger>
                <TabsTrigger value="infrastructure">2. Infrastructure</TabsTrigger>
                <TabsTrigger value="risks">3. Risks</TabsTrigger>
                <TabsTrigger value="baseline">4. Baseline</TabsTrigger>
                <TabsTrigger value="security">5. Security</TabsTrigger>
                <TabsTrigger value="compliance">6. Compliance</TabsTrigger>
                <TabsTrigger value="regulatory">7. Regulatory</TabsTrigger>
                <TabsTrigger value="standards">8. Standards</TabsTrigger>
                <TabsTrigger value="acq-tools">9. ACQ Tools</TabsTrigger>
                <TabsTrigger value="adversarial">10. Adversarial</TabsTrigger>
                <TabsTrigger value="isms">11. ISMS</TabsTrigger>
                <TabsTrigger value="device-inventory">12. Device</TabsTrigger>
                <TabsTrigger value="identity-behavior">13. Identity</TabsTrigger>
                <TabsTrigger value="contact">14. Contact</TabsTrigger>
                <TabsTrigger value="review">15. Review</TabsTrigger>
              </TabsList>

              {/* Business Information Tab */}
              <TabsContent value="business" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="government">Government</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="businessAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your complete business address" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="businessLocation.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="businessLocation.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province *</FormLabel>
                        <FormControl>
                          <Input placeholder="State/Province" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="businessLocation.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" disabled>
                    Previous Step
                  </Button>
                  <Button type="button" onClick={nextTab}>
                    Next Step
                  </Button>
                </div>
              </TabsContent>

              {/* Review Tab */}
              <TabsContent value="review" className="space-y-6">
                <div className="border rounded-md p-4 bg-gray-50">
                  <h3 className="text-lg font-medium mb-4">Assessment Review</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please review your information before submitting.
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Business Name:</div>
                      <div>{form.getValues("businessName")}</div>
                      
                      <div className="font-medium">Industry:</div>
                      <div>{form.getValues("industry")}</div>
                      
                      <div className="font-medium">Address:</div>
                      <div>{form.getValues("businessAddress")}</div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 mt-4">
                  <h4 className="text-base font-medium mb-2">Final Step: Submit Your Assessment</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click the button below to submit your completed questionnaire.
                  </p>
                  
                  <div className="mb-6">
                    <EulaAgreement 
                      isChecked={eulaAccepted}
                      onCheckChange={(checked) => {
                        setEulaAccepted(checked);
                        form.setValue("eulaAccepted", checked);
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevTab}>
                      Previous Step
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-[#7936b0] hover:bg-[#6b2aa2] text-white font-medium text-lg py-4 px-8"
                      disabled={!eulaAccepted}
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