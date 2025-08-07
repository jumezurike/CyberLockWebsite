import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

const schedulingSchema = z.object({
  desiredStartDate: z.string().min(1, "Start date is required"),
  desiredEndDate: z.string().min(1, "End date is required"),
  flexibleDates: z.boolean().default(false),
}).refine((data) => {
  if (data.desiredStartDate && data.desiredEndDate) {
    return new Date(data.desiredStartDate) <= new Date(data.desiredEndDate);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["desiredEndDate"],
});

type SchedulingData = z.infer<typeof schedulingSchema>;

interface SchedulingStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

// Mock availability data - in production this would come from your API
const AVAILABLE_SLOTS = [
  { date: "2025-02-10", slots: ["09:00-12:00", "13:00-17:00"] },
  { date: "2025-02-11", slots: ["10:00-14:00", "15:00-18:00"] },
  { date: "2025-02-12", slots: ["09:00-12:00"] },
  { date: "2025-02-13", slots: ["13:00-17:00"] },
  { date: "2025-02-14", slots: ["09:00-12:00", "14:00-16:00"] },
  { date: "2025-02-17", slots: ["09:00-17:00"] },
  { date: "2025-02-18", slots: ["10:00-15:00"] },
];

export default function SchedulingStep({ data, onUpdate, onNext, onPrev }: SchedulingStepProps) {
  const [selectedTimeSlots, setSelectedTimeSlots] = React.useState<Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>>(data.selectedTimeSlots || []);

  const form = useForm<SchedulingData>({
    resolver: zodResolver(schedulingSchema),
    defaultValues: {
      desiredStartDate: data.desiredStartDate || "",
      desiredEndDate: data.desiredEndDate || "",
      flexibleDates: data.flexibleDates || false,
    },
  });

  const handleTimeSlotToggle = (date: string, timeSlot: string, checked: boolean) => {
    const [startTime, endTime] = timeSlot.split('-');
    
    if (checked) {
      setSelectedTimeSlots(prev => [...prev, { date, startTime, endTime }]);
    } else {
      setSelectedTimeSlots(prev => 
        prev.filter(slot => !(slot.date === date && slot.startTime === startTime))
      );
    }
  };

  const isTimeSlotSelected = (date: string, timeSlot: string) => {
    const [startTime] = timeSlot.split('-');
    return selectedTimeSlots.some(slot => 
      slot.date === date && slot.startTime === startTime
    );
  };

  const onSubmit = (values: SchedulingData) => {
    onUpdate({
      ...values,
      selectedTimeSlots: selectedTimeSlots,
    });
    onNext();
  };

  const formatDateForDisplay = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, MMMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Project Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Project Timeline
            </CardTitle>
            <CardDescription>When would you like the project to begin and end?</CardDescription>
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
                        {...field}
                        min={format(new Date(), "yyyy-MM-dd")}
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
                    <FormLabel>Desired End Date *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        min={form.watch("desiredStartDate") || format(new Date(), "yyyy-MM-dd")}
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
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">
                    I'm flexible with these dates and can adjust based on your availability
                  </FormLabel>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Team Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Available Time Slots
            </CardTitle>
            <CardDescription>
              Select preferred time slots for meetings and project kickoff (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {AVAILABLE_SLOTS.map((day) => (
                <div key={day.date} className="border rounded-lg p-4">
                  <div className="font-semibold mb-3 text-gray-900">
                    {formatDateForDisplay(day.date)}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {day.slots.map((slot) => {
                      const isSelected = isTimeSlotSelected(day.date, slot);
                      return (
                        <div
                          key={slot}
                          className={`flex items-center space-x-2 p-2 rounded-md border transition-colors ${
                            isSelected 
                              ? "bg-blue-50 border-blue-200" 
                              : "hover:bg-gray-50 border-gray-200"
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => 
                              handleTimeSlotToggle(day.date, slot, !!checked)
                            }
                          />
                          <Label className="cursor-pointer text-sm font-medium">
                            {slot}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {selectedTimeSlots.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-sm mb-3">Selected Time Slots:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTimeSlots.map((slot, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {formatDateForDisplay(slot.date)} • {slot.startTime}-{slot.endTime}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> These time slots are for initial meetings and project planning. 
                The actual project work will be scheduled based on your requirements and our team's availability.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Urgency Impact */}
        {data.urgencyLevel && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-orange-800">
                <Clock className="h-4 w-4" />
                <span className="font-semibold">Project Urgency: {data.urgencyLevel}</span>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                {data.urgencyLevel === "Critical" 
                  ? "We'll prioritize your project and provide expedited scheduling options."
                  : data.urgencyLevel === "High"
                  ? "We'll work to accommodate your timeline within our next available slots."
                  : "Standard scheduling applies. We'll work within your preferred timeline."
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project Details
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