import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowRight, ArrowLeft, Calendar, Clock } from "lucide-react";

const schedulingSchema = z.object({
  desiredStartDate: z.string().min(1, "Start date is required"),
  desiredEndDate: z.string().optional(),
  flexibleDates: z.boolean().default(false),
});

type SchedulingData = z.infer<typeof schedulingSchema>;

interface SchedulingStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function SchedulingStep({ data, onUpdate, onNext, onPrev }: SchedulingStepProps) {
  const form = useForm<SchedulingData>({
    resolver: zodResolver(schedulingSchema),
    defaultValues: {
      desiredStartDate: data.desiredStartDate || "",
      desiredEndDate: data.desiredEndDate || "",
      flexibleDates: data.flexibleDates || false,
    },
  });

  const onSubmit = (values: SchedulingData) => {
    onUpdate(values);
    onNext();
  };

  // Get tomorrow's date as minimum
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Project Scheduling
            </CardTitle>
            <CardDescription>When would you like to start this project?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="desiredStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Start Date *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        min={getTomorrowDate()}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="desiredEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Completion Date (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        min={form.watch("desiredStartDate") || getTomorrowDate()}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="flexibleDates"
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
                      I'm flexible with dates
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Check this if your dates can be adjusted based on our availability
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">Scheduling Notes</h4>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Emergency services available 24/7 with premium rates</li>
                    <li>• Standard services scheduled during business hours</li>
                    <li>• Site visits require $75 non-refundable fee</li>
                    <li>• We'll contact you to confirm final scheduling</li>
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
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Continue to Pricing
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}