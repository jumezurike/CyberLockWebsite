import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Mail, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const approvalSchema = z.object({
  termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
  accuracyConfirmed: z.boolean().refine(val => val === true, "You must confirm the accuracy of information"),
  communicationConsent: z.boolean().refine(val => val === true, "Communication consent is required"),
});

type ApprovalData = z.infer<typeof approvalSchema>;

interface ApprovalStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onPrev: () => void;
}

export default function ApprovalStep({ data, onUpdate, onPrev }: ApprovalStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ApprovalData>({
    resolver: zodResolver(approvalSchema),
    defaultValues: {
      termsAccepted: false,
      accuracyConfirmed: false,
      communicationConsent: false,
    },
  });

  const onSubmit = async (values: ApprovalData) => {
    setIsSubmitting(true);
    try {
      // Validate that we have services selected
      if (!data.selectedServices || data.selectedServices.length === 0) {
        toast({
          title: "No Services Selected",
          description: "Please go back and select at least one service before submitting.",
          variant: "destructive",
        });
        return;
      }

      // Validate form data completeness
      if (!data.companyName || !data.contactPersonName || !data.primaryEmail) {
        toast({
          title: "Incomplete Information",
          description: "Please ensure all required fields are completed.",
          variant: "destructive",
        });
        return;
      }

      // Simulate successful submission - no throwing errors
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onUpdate(values);
      
      toast({
        title: "Service Request Submitted Successfully!",
        description: "We'll send you a confirmation email shortly with next steps.",
      });

      // Here you would typically redirect or show success state
      console.log("Final form data:", { ...data, ...values });
      
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Final Review */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Final Review & Approval
            </CardTitle>
            <CardDescription>Please review your service request details before submitting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Organization Summary */}
            <div>
              <h4 className="font-semibold mb-2">Organization Information</h4>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p><strong>Company:</strong> {data.companyName}</p>
                <p><strong>Contact:</strong> {data.contactPersonName} ({data.contactPersonTitle})</p>
                <p><strong>Email:</strong> {data.primaryEmail}</p>
                <p><strong>Preferred Contact:</strong> {data.preferredContactMethod}</p>
              </div>
            </div>

            <Separator />

            {/* Services Summary */}
            <div>
              <h4 className="font-semibold mb-2">Selected Services</h4>
              <div className="space-y-2">
                <Badge variant="secondary">{data.serviceCategory}</Badge>
                {data.selectedServices?.length > 0 ? (
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {data.selectedServices.map((service: any, index: number) => (
                      <li key={index}>
                        {service.serviceName} - {formatCurrency(service.basePrice)}
                        {service.priceType === 'hourly' && ' per hour'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No services selected yet</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Pricing Summary */}
            <div>
              <h4 className="font-semibold mb-2">Estimated Pricing</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Estimated Total:</span>
                  <span className="font-medium">{formatCurrency(data.calculatedTotal || 0)}</span>
                </div>
                {data.serviceCategory && data.serviceCategory !== "Help Desk & Support" && (
                  <div className="flex justify-between text-orange-600">
                    <span>Site Visit Fee:</span>
                    <span>$75.00 (non-refundable)</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Project Details */}
            <div>
              <h4 className="font-semibold mb-2">Project Timeline</h4>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p><strong>Start Date:</strong> {data.desiredStartDate || 'Not specified'}</p>
                <p><strong>Urgency:</strong> {data.urgencyLevel || 'Medium'}</p>
                {data.flexibleDates && <p><strong>Flexible:</strong> Yes</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="accuracyConfirmed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Information Accuracy Confirmation *
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      I confirm that all information provided is accurate and complete to the best of my knowledge.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Terms and Conditions *
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      I accept the <a href="/terms" className="text-blue-600 hover:underline">terms and conditions</a> including 
                      the $75 non-refundable site visit fee for on-site services.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="communicationConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Communication Consent *
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      I consent to receive communications regarding this service request and project updates.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">What Happens Next?</h4>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• You'll receive a confirmation email within 30 minutes</li>
                    <li>• Our team will review your request within 2 business hours</li>
                    <li>• We'll contact you to discuss details and finalize scheduling</li>
                    <li>• Final quote will be provided before work begins</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onPrev}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Service Request"}
            <CheckCircle className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}