import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowRight, Mail, Phone, Smartphone } from "lucide-react";

const organizationSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactPersonName: z.string().min(2, "Contact person name is required"),
  contactPersonTitle: z.string().min(2, "Contact person title is required"),
  address: z.object({
    street: z.string().min(2, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(3, "ZIP code is required"),
    country: z.string().min(2, "Country is required"),
  }),
  primaryEmail: z.string().email("Valid email is required"),
  secondaryEmail: z.string().email("Valid email format").optional().or(z.literal("")),
  officePhone: z.string().optional().or(z.literal("")),
  mobilePhone: z.string().optional().or(z.literal("")),
  preferredContactMethod: z.enum(["email", "phone", "mobile"], {
    required_error: "Preferred contact method is required"
  }),
});

type OrganizationData = z.infer<typeof organizationSchema>;

// Comprehensive list of professional titles
const PROFESSIONAL_TITLES = [
  // C-Level Executives
  "CEO - Chief Executive Officer",
  "COO - Chief Operating Officer", 
  "CTO - Chief Technology Officer",
  "CIO - Chief Information Officer",
  "CISO - Chief Information Security Officer",
  "CFO - Chief Financial Officer",
  "CMO - Chief Marketing Officer",
  "CPO - Chief Product Officer",
  "CHO - Chief Human Resources Officer",
  "CDO - Chief Data Officer",
  "CCO - Chief Compliance Officer",
  
  // Senior Leadership
  "President",
  "Vice President",
  "Senior Vice President",
  "Executive Vice President",
  "Managing Director",
  "General Manager",
  "Regional Manager",
  "Branch Manager",
  
  // IT & Technology Leadership
  "IT Director",
  "IT Manager", 
  "Systems Administrator",
  "Network Administrator",
  "Database Administrator",
  "Security Administrator",
  "DevOps Manager",
  "Software Development Manager",
  "Infrastructure Manager",
  "Cybersecurity Manager",
  "Help Desk Manager",
  "Technical Support Manager",
  
  // Operations & Management
  "Operations Manager",
  "Operations Director",
  "Project Manager",
  "Program Manager",
  "Product Manager",
  "Business Analyst",
  "Process Manager",
  "Quality Manager",
  "Facilities Manager",
  "Office Manager",
  
  // Healthcare Specific
  "Chief Medical Officer",
  "Medical Director",
  "Hospital Administrator",
  "Healthcare IT Manager",
  "HIPAA Compliance Officer",
  "Practice Manager",
  "Clinical Director",
  "Nursing Director",
  "Healthcare Quality Manager",
  
  // Legal & Compliance
  "General Counsel",
  "Legal Director",
  "Compliance Manager",
  "Risk Manager",
  "Privacy Officer",
  "Data Protection Officer",
  "Legal Operations Manager",
  "Contract Manager",
  
  // Finance & Accounting
  "Controller",
  "Finance Director",
  "Accounting Manager",
  "Finance Manager",
  "Budget Manager",
  "Financial Analyst",
  "Treasurer",
  "Audit Manager",
  
  // Human Resources
  "HR Director",
  "HR Manager",
  "HR Business Partner",
  "Talent Acquisition Manager",
  "Training Manager",
  "Employee Relations Manager",
  "Benefits Manager",
  
  // Education Specific
  "Superintendent",
  "Principal",
  "Vice Principal",
  "IT Coordinator",
  "Technology Director",
  "Academic Dean",
  "Registrar",
  "Student Services Director",
  
  // Sales & Marketing
  "Sales Director",
  "Sales Manager",
  "Marketing Director",
  "Marketing Manager",
  "Business Development Manager",
  "Account Manager",
  "Customer Success Manager",
  
  // Technical Roles
  "Senior Systems Engineer",
  "Network Engineer",
  "Security Engineer",
  "Software Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Data Engineer",
  "Solutions Architect",
  "Technical Architect",
  
  // Specialized Roles
  "Procurement Manager",
  "Vendor Manager",
  "Contract Administrator",
  "Business Owner",
  "Partner",
  "Consultant",
  "Advisor",
  "Board Member",
  "Other"
];

interface OrganizationInfoStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

export default function OrganizationInfoStep({ data, onUpdate, onNext }: OrganizationInfoStepProps) {
  const form = useForm<OrganizationData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      companyName: data.companyName || "",
      contactPersonName: data.contactPersonName || "",
      contactPersonTitle: data.contactPersonTitle || "",
      address: {
        street: data.address?.street || "",
        city: data.address?.city || "",
        state: data.address?.state || "",
        zipCode: data.address?.zipCode || "",
        country: data.address?.country || "",
      },
      primaryEmail: data.primaryEmail || "",
      secondaryEmail: data.secondaryEmail || "",
      officePhone: data.officePhone || "",
      mobilePhone: data.mobilePhone || "",
      preferredContactMethod: data.preferredContactMethod || "email",
    },
  });

  const onSubmit = (values: OrganizationData) => {
    onUpdate(values);
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Company Information</CardTitle>
            <CardDescription>Tell us about your organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corporation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPersonName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPersonTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person Title *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your title/role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {PROFESSIONAL_TITLES.map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Address Information</CardTitle>
            <CardDescription>Your organization's primary address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Business Street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province *</FormLabel>
                    <FormControl>
                      <Input placeholder="NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="10001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country *</FormLabel>
                  <FormControl>
                    <Input placeholder="United States" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
            <CardDescription>How we can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="primaryEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@acmecorp.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondaryEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Email (Optional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="backup@acmecorp.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="officePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobilePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 987-6543" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="preferredContactMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Contact Method *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                          <Mail className="h-4 w-4" />
                          Email
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phone" id="phone" />
                        <Label htmlFor="phone" className="flex items-center gap-2 cursor-pointer">
                          <Phone className="h-4 w-4" />
                          Office Phone
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mobile" id="mobile" />
                        <Label htmlFor="mobile" className="flex items-center gap-2 cursor-pointer">
                          <Smartphone className="h-4 w-4" />
                          Mobile Phone
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Continue to Service Selection
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}