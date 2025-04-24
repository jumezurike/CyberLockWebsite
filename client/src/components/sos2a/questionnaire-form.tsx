import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Sos2aFormData } from "@/lib/sos2a-types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessAddress: z.string().min(5, "Business address is required"),
  industry: z.string().min(1, "Please select your industry"),
  employeeCount: z.string().min(1, "Please select employee count"),
  businessServices: z.string().min(5, "Please describe the business services you offer"),
  operationMode: z.string().min(1, "Please select your mode of operation"),
  internetPresence: z.array(z.string()).min(1, "Please select at least one internet presence type"),
  securityMeasures: z.array(z.string()).min(1, "Please select at least one security measure"),
  primaryConcerns: z.array(z.string()).min(1, "Please select at least one primary concern"),
  contactInfo: z.object({
    name: z.string().min(2, "Contact name is required"),
    pointOfContact: z.string().min(2, "Business point of contact is required"),
    email: z.string().email("Invalid email address"),
    contactEmail: z.string().email("Invalid point of contact email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
  }),
  availabilityConfirmation: z.boolean().refine(val => val === true, {
    message: "You must confirm your availability to participate in the assessment within 30 days"
  }),
  referralPermission: z.boolean().refine(val => val === true, {
    message: "You must provide referral permission to proceed with the free assessment"
  }),
});

interface QuestionnaireFormProps {
  formData: Sos2aFormData;
  updateFormData: (data: Partial<Sos2aFormData>) => void;
  onNext: () => void;
}

export default function QuestionnaireForm({ 
  formData, 
  updateFormData, 
  onNext 
}: QuestionnaireFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: formData.businessName || "",
      businessAddress: formData.businessAddress || "",
      industry: formData.industry || "",
      employeeCount: formData.employeeCount || "",
      businessServices: formData.businessServices || "",
      operationMode: formData.operationMode || "",
      internetPresence: formData.internetPresence || [],
      securityMeasures: formData.securityMeasures || [],
      primaryConcerns: formData.primaryConcerns || [],
      contactInfo: {
        name: formData.contactInfo?.name || "",
        pointOfContact: formData.contactInfo?.pointOfContact || "",
        email: formData.contactInfo?.email || "",
        contactEmail: formData.contactInfo?.contactEmail || "",
        phone: formData.contactInfo?.phone || "",
      },
      availabilityConfirmation: formData.availabilityConfirmation || false,
      referralPermission: formData.referralPermission || false,
    },
  });

  const securityMeasures = [
    { id: "firewall", label: "Firewall and VPN Solutions" },
    { id: "endpoint", label: "Endpoint and Device Security (EDR, MDM)" },
    { id: "mfa", label: "Multi-Factor Authentication (MFA)" },
    { id: "backup", label: "Backup and Disaster Recovery" },
    { id: "training", label: "Employee Training on Cybersecurity" },
    { id: "encryption", label: "Data Encryption and DLP Tools" },
    { id: "network", label: "Network Segmentation" },
    { id: "email", label: "Email Filtering and Anti-Phishing Tools" },
    { id: "dns", label: "DNS Filtering and Secure DNS" },
    { id: "cloud", label: "Cloud Security Tools (CASB, WAF)" },
  ];

  const internetPresenceOptions = [
    { id: "website", label: "Website" },
    { id: "cloud-servers", label: "Servers in the Cloud" },
    { id: "office-servers", label: "Servers in the Office" },
    { id: "hybrid", label: "Hybrid (Cloud & On-Premises)" },
    { id: "minimal", label: "Minimal Presence" },
    { id: "none", label: "No Internet Presence" },
  ];
  
  const primaryConcerns = [
    { id: "data-breach", label: "Data Breaches" },
    { id: "ransomware", label: "Ransomware Attacks" },
    { id: "compliance", label: "Regulatory Compliance" },
    { id: "phishing", label: "Phishing & Social Engineering" },
    { id: "insider", label: "Insider Threats" },
    { id: "malware", label: "Malware & Viruses" },
    { id: "ddos", label: "DDoS Attacks" },
    { id: "third-party", label: "Third-Party/Vendor Risks" },
    { id: "cloud-security", label: "Cloud Security" },
    { id: "remote-work", label: "Remote Work Security" },
  ];

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFormData(values);
    onNext();
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-primary">Step 1: Questionnaire</h2>
      <p className="mb-6 text-neutral-600">
        Please complete this initial questionnaire to help us understand your business and cybersecurity needs.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="businessAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your business address" {...field} />
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
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="finance">Financial Services</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="nonprofit">Non-Profit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Employees</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="11-50">11-50</SelectItem>
                      <SelectItem value="51-200">51-200</SelectItem>
                      <SelectItem value="201-500">201-500</SelectItem>
                      <SelectItem value="500+">500+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="businessServices"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Services</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What type of business services do you offer?"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="operationMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode of Operation</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your mode of operation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="isp-modem">ISP Modem</SelectItem>
                      <SelectItem value="mobile-hotspot">Mobile Hotspot</SelectItem>
                      <SelectItem value="commercial-internet">Commercial Internet</SelectItem>
                      <SelectItem value="dedicated-connection">Dedicated Connection</SelectItem>
                      <SelectItem value="satellite">Satellite</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="internetPresence"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Internet Presence (select all that apply)</FormLabel>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {internetPresenceOptions.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="internetPresence"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {item.label}
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

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="securityMeasures"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Current Security Measures (select all that apply)</FormLabel>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {securityMeasures.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="securityMeasures"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {item.label}
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

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="primaryConcerns"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Primary Concerns (select all that apply)</FormLabel>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {primaryConcerns.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="primaryConcerns"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {item.label}
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

            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-4 text-primary">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactInfo.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactInfo.pointOfContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Point of Contact</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Name of business point of contact" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactInfo.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email address" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactInfo.contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Point of Contact Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Email for point of contact" 
                          type="email" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactInfo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Business phone number (with area code)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-4 text-primary">Participation Agreements</h3>
              
              <FormField
                control={form.control}
                name="availabilityConfirmation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal cursor-pointer">
                        I confirm that I would be available to complete this assessment within 30 days if chosen.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="referralPermission"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal cursor-pointer">
                        As part of the free SOS²A assessment, I agree that my organization will remain accessible 
                        to those who may inquire about the program based on our participation.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button type="submit" className="bg-secondary hover:bg-orange-600">
              Continue to Interview & Matrix Population
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
