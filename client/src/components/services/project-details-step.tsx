import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Upload, Link, AlertTriangle, Zap, Clock, Flag } from "lucide-react";

const projectDetailsSchema = z.object({
  organizationDescription: z.string().min(10, "Please provide a brief description of your organization"),
  projectDescription: z.string().min(20, "Please provide detailed project requirements"),
  relevantLinks: z.array(z.string().url("Please enter valid URLs")).optional(),
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
  const [newLink, setNewLink] = React.useState("");
  const [relevantLinks, setRelevantLinks] = React.useState<string[]>(data.relevantLinks || []);

  const form = useForm<ProjectDetailsData>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: {
      organizationDescription: data.organizationDescription || "",
      projectDescription: data.projectDescription || "",
      relevantLinks: data.relevantLinks || [],
      urgencyLevel: data.urgencyLevel || "Medium",
    },
  });

  const addLink = () => {
    if (newLink && isValidUrl(newLink)) {
      setRelevantLinks(prev => [...prev, newLink]);
      setNewLink("");
    }
  };

  const removeLink = (index: number) => {
    setRelevantLinks(prev => prev.filter((_, i) => i !== index));
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const onSubmit = (values: ProjectDetailsData) => {
    onUpdate({
      ...values,
      relevantLinks: relevantLinks,
      uploadedFiles: data.uploadedFiles || [], // Preserve uploaded files
    });
    onNext();
  };

  const getUrgencyDetails = (level: string) => {
    switch (level) {
      case "Critical":
        return {
          icon: AlertTriangle,
          color: "red",
          description: "Requires immediate attention - business critical",
          timeline: "24-48 hours response",
        };
      case "High":
        return {
          icon: Zap,
          color: "orange",
          description: "Important project with tight deadline",
          timeline: "2-3 business days response",
        };
      case "Medium":
        return {
          icon: Clock,
          color: "yellow",
          description: "Standard priority project",
          timeline: "1 week response",
        };
      case "Low":
        return {
          icon: Flag,
          color: "green",
          description: "Flexible timeline, can be scheduled",
          timeline: "2-3 weeks response",
        };
      default:
        return {
          icon: Clock,
          color: "gray",
          description: "",
          timeline: "",
        };
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Organization Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Organization Overview</CardTitle>
            <CardDescription>Help us understand your business</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="organizationDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brief Description of Your Organization *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your organization's industry, size, main activities, current technology infrastructure, and key business objectives..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Project Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Requirements</CardTitle>
            <CardDescription>Detailed information about your project needs</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="projectDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Project Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide comprehensive details about your project including:
- Specific goals and objectives
- Current challenges or pain points
- Desired outcomes and success metrics
- Technical requirements and constraints
- Integration needs with existing systems
- Timeline expectations
- Budget considerations"
                      className="min-h-[150px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Supporting Documents</CardTitle>
            <CardDescription>Upload any relevant files, diagrams, or specifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-sm text-gray-600">
                <p className="mb-2">Drag and drop files here, or click to browse</p>
                <p className="text-xs">Supported formats: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG (max 10MB per file)</p>
              </div>
              <Button type="button" variant="outline" className="mt-4">
                Choose Files
              </Button>
            </div>
            {data.uploadedFiles && data.uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Uploaded Files:</h4>
                <div className="space-y-2">
                  {data.uploadedFiles.map((file: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{file}</span>
                      <Button type="button" variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Relevant Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Relevant Links</CardTitle>
            <CardDescription>Share any relevant websites, documentation, or resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/documentation"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addLink}
                disabled={!newLink || !isValidUrl(newLink)}
                variant="outline"
              >
                <Link className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>

            {relevantLinks.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Added Links:</Label>
                {relevantLinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 truncate flex-1"
                    >
                      {link}
                    </a>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLink(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Urgency Level */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Urgency</CardTitle>
            <CardDescription>How quickly do you need this project completed?</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="urgencyLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urgency Level *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-3"
                    >
                      {["Critical", "High", "Medium", "Low"].map((level) => {
                        const details = getUrgencyDetails(level);
                        const Icon = details.icon;
                        
                        return (
                          <div
                            key={level}
                            className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                              field.value === level
                                ? `border-${details.color}-300 bg-${details.color}-50`
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <RadioGroupItem value={level} id={level} />
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`p-2 bg-${details.color}-100 rounded-full`}>
                                <Icon className={`h-4 w-4 text-${details.color}-600`} />
                              </div>
                              <div className="flex-1">
                                <Label htmlFor={level} className="font-medium cursor-pointer">
                                  {level}
                                </Label>
                                <p className="text-sm text-gray-600">{details.description}</p>
                                <Badge variant="secondary" className="text-xs mt-1">
                                  {details.timeline}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Service Selection
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