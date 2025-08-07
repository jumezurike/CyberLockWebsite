import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, CheckCircle, FileText, Send, User, Building, Calendar, DollarSign } from "lucide-react";

const approvalSchema = z.object({
  digitalSignature: z.string().min(5, "Digital signature is required (full name)"),
  agreesToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  additionalNotes: z.string().optional(),
});

type ApprovalData = z.infer<typeof approvalSchema>;

interface ApprovalStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onPrev: () => void;
}

export default function ApprovalStep({ data, onUpdate, onPrev }: ApprovalStepProps) {
  const [submitted, setSubmitted] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<ApprovalData>({
    resolver: zodResolver(approvalSchema),
    defaultValues: {
      digitalSignature: "",
      agreesToTerms: false,
      additionalNotes: "",
    },
  });

  const submitServiceRequest = useMutation({
    mutationFn: async (requestData: any) => {
      return apiRequest("POST", "/api/service-requests", requestData);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Service Request Submitted",
        description: "Your request has been successfully submitted. We'll contact you within 24 hours.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
      console.error("Service request submission error:", error);
    },
  });

  const onSubmit = (values: ApprovalData) => {
    const completeRequest = {
      ...data,
      ...values,
    };

    onUpdate(values);
    submitServiceRequest.mutate(completeRequest);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  if (submitted) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Request Submitted Successfully!</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Thank you for choosing CyberLockX. We've received your service request and will contact you 
            within 24 hours to discuss next steps.
          </p>
        </div>
        
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Reference Number:</span>
                <span className="font-mono font-medium">SRQ-{Date.now().toString(36).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Total:</span>
                <span className="font-semibold">{formatPrice(data.calculatedTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Priority Level:</span>
                <Badge variant="outline">{data.urgencyLevel}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-blue-800 text-sm">
            <strong>What's next?</strong><br />
            Our team will review your requirements and prepare a detailed proposal. 
            You'll receive an email confirmation shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Request Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Service Request Summary
            </CardTitle>
            <CardDescription>Review your request details before submission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Building className="h-4 w-4" />
                  <span className="font-semibold">Organization</span>
                </div>
                <div className="pl-6 space-y-1 text-sm">
                  <div><strong>{data.companyName}</strong></div>
                  <div>{data.contactPersonName} - {data.contactPersonTitle}</div>
                  <div>{data.primaryEmail}</div>
                  {data.officePhone && <div>Phone: {data.officePhone}</div>}
                </div>
              </div>

              {/* Contact Preferences */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="h-4 w-4" />
                  <span className="font-semibold">Contact Preferences</span>
                </div>
                <div className="pl-6 space-y-1 text-sm">
                  <div>Primary: {data.preferredContactMethod}</div>
                  <div>Service Category: {data.serviceCategory}</div>
                  <div>Priority: <Badge variant="outline">{data.urgencyLevel}</Badge></div>
                </div>
              </div>

              {/* Timeline */}
              {data.desiredStartDate && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4" />
                    <span className="font-semibold">Timeline</span>
                  </div>
                  <div className="pl-6 space-y-1 text-sm">
                    <div>Start: {new Date(data.desiredStartDate).toLocaleDateString()}</div>
                    <div>End: {new Date(data.desiredEndDate).toLocaleDateString()}</div>
                    {data.flexibleDates && (
                      <Badge variant="secondary" className="text-xs">Flexible Dates</Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-semibold">Estimated Cost</span>
                </div>
                <div className="pl-6 space-y-1 text-sm">
                  <div className="font-semibold text-blue-600 text-base">
                    {formatPrice(data.calculatedTotal)}
                  </div>
                  <div>{data.selectedServices?.length} service(s) selected</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Selected Services */}
            <div>
              <h4 className="font-semibold mb-2">Selected Services:</h4>
              <div className="space-y-2">
                {data.selectedServices?.map((service: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{service.serviceName}</span>
                    <Badge variant="outline" className="text-xs">
                      {service.quantity}x {formatPrice(service.basePrice)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Information</CardTitle>
            <CardDescription>Any final notes or special requirements?</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requirements, questions, or additional information you'd like to share..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Digital Signature & Agreement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Digital Signature & Agreement</CardTitle>
            <CardDescription>Confirm your service request submission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="digitalSignature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Digital Signature *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type your full name as digital signature"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreesToTerms"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel className="text-sm leading-relaxed">
                      I agree to the terms and conditions and authorize CyberLockX to proceed with this service request. 
                      I understand this is an estimate and final pricing will be confirmed before project commencement.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
              <p>
                By submitting this request, you acknowledge that:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>This is a service estimate and not a final quote</li>
                <li>Final pricing will be confirmed after detailed analysis</li>
                <li>Project timeline may be adjusted based on complexity</li>
                <li>Payment terms: 30% initiation, 40% milestone, 30% completion</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pricing
          </Button>
          <Button 
            type="submit" 
            disabled={submitServiceRequest.isPending}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {submitServiceRequest.isPending ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Service Request
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}