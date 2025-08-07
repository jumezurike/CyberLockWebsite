import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";

const projectDetailsSchema = z.object({
  organizationDescription: z.string().min(10, "Please provide at least 10 characters"),
  projectDescription: z.string().min(20, "Please provide at least 20 characters"),
  urgencyLevel: z.enum(["Critical", "High", "Medium", "Low"], {
    required_error: "Please select an urgency level"
  }),
});

type ProjectDetailsData = z.infer<typeof projectDetailsSchema>;

interface ProjectDetailsStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ProjectDetailsStep({ data, onUpdate, onNext, onPrev }: ProjectDetailsStepProps) {
  const form = useForm<ProjectDetailsData>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: {
      organizationDescription: data.organizationDescription || "",
      projectDescription: data.projectDescription || "",
      urgencyLevel: data.urgencyLevel || "Medium",
    },
  });

  const onSubmit = (values: ProjectDetailsData) => {
    onUpdate(values);
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Details</CardTitle>
            <CardDescription>Tell us about your organization and project requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="organizationDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Briefly describe your organization, industry, and current IT setup..."
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
              name="projectDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your project requirements, goals, and any specific challenges you're facing..."
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="urgencyLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urgency Level *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Critical">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          Critical - Immediate Response Required
                        </div>
                      </SelectItem>
                      <SelectItem value="High">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          High - Within 24 Hours
                        </div>
                      </SelectItem>
                      <SelectItem value="Medium">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          Medium - Within 3-5 Days
                        </div>
                      </SelectItem>
                      <SelectItem value="Low">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-green-500" />
                          Low - Within 1-2 Weeks
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onPrev}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Continue to Scheduling
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}