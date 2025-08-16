import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCystReportSchema } from "@shared/schema";
import { z } from "zod";
import { Plus, FileText, Download, Upload, Eye, Clock, CheckCircle, XCircle, AlertCircle, Camera, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type CystReport = {
  id: number;
  reportNumber: string;
  businessName: string;
  businessDescription?: string;
  technicianName: string;
  serviceDate: string;
  completionStatus: string;
  status: string;
  legallyValid: boolean;
  managerName?: string;
  managerSignedAt?: string;
  createdAt: string;
  updatedAt: string;
  workDescription?: string;
  technicianContact?: string;
  followupRequired?: boolean;
};

type CystPhoto = {
  id: number;
  cystReportId: number;
  filename: string;
  originalName: string;
  fileUrl: string;
  photoType: 'before' | 'after' | 'during';
  description?: string;
  uploadedAt: string;
};

// Enhanced form schema for frontend validation
const cystReportFormSchema = insertCystReportSchema.extend({
  serviceDate: z.string().min(1, "Service date is required"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  technicianName: z.string().min(2, "Technician name must be at least 2 characters"),
  completionStatus: z.enum(["Pending", "In Progress", "Completed"]),
  businessType: z.array(z.string()).optional(),
  servicesPerformed: z.array(z.string()).optional(),
});

type CystReportFormValues = z.infer<typeof cystReportFormSchema>;

const businessTypes = [
  "Healthcare Facility", "Manufacturing", "Financial Services", "Retail", "Technology",
  "Education", "Government", "Non-Profit", "Transportation", "Energy", "Other"
];

const serviceTypes = [
  "Network Security Assessment", "Vulnerability Scanning", "Penetration Testing",
  "Security Awareness Training", "Incident Response", "Compliance Audit",
  "System Hardening", "Firewall Configuration", "Endpoint Security", "Data Backup Recovery"
];

export default function TechnicianCystReports() {
  const [selectedReport, setSelectedReport] = useState<CystReport | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [reportPhotos, setReportPhotos] = useState<CystPhoto[]>([]);
  
  const queryClient = useQueryClient();

  // Form for creating/editing reports
  const form = useForm<CystReportFormValues>({
    resolver: zodResolver(cystReportFormSchema),
    defaultValues: {
      businessName: "",
      businessDescription: "",
      technicianName: "",
      technicianContact: "",
      serviceDate: new Date().toISOString().split('T')[0],
      completionStatus: "Pending",
      workDescription: "",
      followupRequired: false,
      businessType: [],
      servicesPerformed: [],
    },
  });

  // Get current user info
  const { data: currentUser } = useQuery<{ id: number; fullName?: string; username: string; role: string }>({
    queryKey: ["/api/technician/me"],
    retry: false,
  });

  // Get all CYST reports for the current technician
  const { data: reports = [], isLoading } = useQuery<CystReport[]>({
    queryKey: ["/api/technician/cyst-reports"],
    enabled: !!currentUser,
  });

  // Create CYST report mutation
  const createReportMutation = useMutation({
    mutationFn: async (data: CystReportFormValues) => {
      return await apiRequest("/api/cyst-reports", "POST", {
        ...data,
        technicianId: currentUser?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/technician/cyst-reports"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Report Created",
        description: "CYST report has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create CYST report. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Submit report mutation
  const submitReportMutation = useMutation({
    mutationFn: async (reportId: number) => {
      return await apiRequest(`/api/cyst-reports/${reportId}/submit`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/technician/cyst-reports"] });
      toast({
        title: "Report Submitted",
        description: "CYST report has been submitted for manager approval.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update technician name when user data loads
  useEffect(() => {
    if (currentUser?.fullName && form.getValues().technicianName === "") {
      form.setValue("technicianName", currentUser.fullName);
    }
  }, [currentUser, form]);

  const handleCreateReport = (data: CystReportFormValues) => {
    createReportMutation.mutate(data);
  };

  const handleSubmitReport = (reportId: number) => {
    submitReportMutation.mutate(reportId);
  };

  // Photo upload mutation
  const uploadPhotoMutation = useMutation({
    mutationFn: async ({ reportId, photoData }: { reportId: number; photoData: any }) => {
      return await apiRequest(`/api/cyst-reports/${reportId}/photos`, "POST", photoData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cyst-reports/${selectedReport?.id}/photos`] });
      toast({ title: "Success", description: "Photo uploaded successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to upload photo", variant: "destructive" });
    },
  });

  // Fetch photos for selected report
  const { data: photos = [] } = useQuery({
    queryKey: [`/api/cyst-reports/${selectedReport?.id}/photos`],
    enabled: !!selectedReport?.id,
  });

  // PDF Generation Function
  const generatePDF = async (report: CystReport) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('CYST Report - Cybersecurity Support Technician', 20, 20);
    doc.setFontSize(12);
    doc.text(`Report #: ${report.reportNumber}`, 20, 35);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);
    
    // Business Information
    doc.setFontSize(14);
    doc.text('Business Information', 20, 65);
    doc.setFontSize(10);
    doc.text(`Business Name: ${report.businessName}`, 20, 75);
    doc.text(`Description: ${report.businessDescription || 'N/A'}`, 20, 85);
    
    // Technician Information
    doc.setFontSize(14);
    doc.text('Technician Information', 20, 105);
    doc.setFontSize(10);
    doc.text(`Technician: ${report.technicianName}`, 20, 115);
    doc.text(`Contact: ${report.technicianContact || 'N/A'}`, 20, 125);
    doc.text(`Service Date: ${report.serviceDate}`, 20, 135);
    
    // Service Details
    doc.setFontSize(14);
    doc.text('Service Details', 20, 155);
    doc.setFontSize(10);
    doc.text(`Completion Status: ${report.completionStatus}`, 20, 165);
    doc.text(`Work Description: ${report.workDescription || 'N/A'}`, 20, 175);
    doc.text(`Follow-up Required: ${report.followupRequired ? 'Yes' : 'No'}`, 20, 185);
    
    // Legal Status
    doc.setFontSize(14);
    doc.text('Legal Status', 20, 205);
    doc.setFontSize(10);
    doc.text(`Status: ${report.status}`, 20, 215);
    doc.text(`Legally Valid: ${report.legallyValid ? 'Yes' : 'No'}`, 20, 225);
    
    if (report.managerName) {
      doc.text(`Manager: ${report.managerName}`, 20, 235);
      doc.text(`Manager Signed: ${report.managerSignedAt ? new Date(report.managerSignedAt).toLocaleDateString() : 'N/A'}`, 20, 245);
    }
    
    // Footer
    doc.setFontSize(8);
    doc.text('This document is generated for manual completion and legal compliance.', 20, 280);
    doc.text('CyberLockX - Cybersecurity Support Services', 20, 290);
    
    // Save the PDF
    doc.save(`CYST-Report-${report.reportNumber}.pdf`);
    
    toast({
      title: "Success",
      description: "PDF report downloaded successfully",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Clock className="h-4 w-4" />;
      case "submitted":
        return <AlertCircle className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-500";
      case "submitted":
        return "bg-yellow-500";
      case "approved":
        return "bg-green-500";
      default:
        return "bg-red-500";
    }
  };

  const filteredReports = reports.filter((report) => {
    if (filterStatus === "all") return true;
    return report.status === filterStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading CYST reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CYST Reports</h1>
          <p className="text-gray-600">Cybersecurity Support Technician Reports - Legal Compliance Documents</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New CYST Report</DialogTitle>
              <DialogDescription>
                Create a new Cybersecurity Support Technician report for legal compliance.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateReport)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="technicianName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technician Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter technician name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="businessDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the business and its operations..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="serviceDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="completionStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Completion Status *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="workDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the work performed..."
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
                  name="followupRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Follow-up Required</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Check if additional follow-up work is needed
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={createReportMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createReportMutation.isPending}
                  >
                    {createReportMutation.isPending ? "Creating..." : "Create Report"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center space-x-4">
        <Label htmlFor="status-filter">Filter by Status:</Label>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reports</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No CYST Reports Found</h3>
            <p className="text-gray-500 mb-6 text-center">
              {filterStatus === "all" 
                ? "You haven't created any CYST reports yet."
                : `No reports found with status: ${filterStatus}`
              }
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {report.reportNumber}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {report.businessName}
                    </CardDescription>
                  </div>
                  <Badge 
                    className={`${getStatusColor(report.status)} text-white flex items-center space-x-1`}
                  >
                    {getStatusIcon(report.status)}
                    <span className="capitalize">{report.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Service Date:</span>
                    <span className="font-medium">
                      {new Date(report.serviceDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <Badge variant="outline" className="capitalize">
                      {report.completionStatus}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Legal Status:</span>
                    <span className={`font-medium ${report.legallyValid ? 'text-green-600' : 'text-orange-600'}`}>
                      {report.legallyValid ? 'Legally Valid' : 'Pending Validation'}
                    </span>
                  </div>

                  {report.managerName && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Approved By:</span>
                      <span className="font-medium">{report.managerName}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setSelectedReport(report)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => generatePDF(report)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedReport(report);
                      setIsPhotoDialogOpen(true);
                    }}
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                  
                  {report.status === 'draft' && (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleSubmitReport(report.id)}
                      disabled={submitReportMutation.isPending}
                    >
                      <Upload className="mr-1 h-3 w-3" />
                      Submit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>CYST Report: {selectedReport.reportNumber}</span>
              </DialogTitle>
              <DialogDescription>
                Detailed view of the Cybersecurity Support Technician report
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Business Name</Label>
                  <p className="mt-1 font-medium">{selectedReport.businessName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Service Date</Label>
                  <p className="mt-1 font-medium">
                    {new Date(selectedReport.serviceDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedReport.businessDescription && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Business Description</Label>
                  <p className="mt-1">{selectedReport.businessDescription}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Report Status</Label>
                  <Badge className={`mt-1 ${getStatusColor(selectedReport.status)} text-white`}>
                    {selectedReport.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Completion Status</Label>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {selectedReport.completionStatus}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Legal Validity</Label>
                  <Badge 
                    variant="outline" 
                    className={`mt-1 ${selectedReport.legallyValid ? 'border-green-500 text-green-700' : 'border-orange-500 text-orange-700'}`}
                  >
                    {selectedReport.legallyValid ? 'Legally Valid' : 'Pending Validation'}
                  </Badge>
                </div>
              </div>

              {selectedReport.managerName && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <Label className="text-sm font-medium text-green-700">Manager Approval</Label>
                  <p className="mt-1 text-green-800">
                    Approved by {selectedReport.managerName} on{' '}
                    {selectedReport.managerSignedAt 
                      ? new Date(selectedReport.managerSignedAt).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedReport(null)}>
                  Close
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => generatePDF(selectedReport)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Photo Management Dialog */}
      <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Manage Photos - {selectedReport?.reportNumber}</DialogTitle>
            <DialogDescription>
              Upload before/after photos for legal documentation and compliance
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Photo Upload Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Before Photos */}
              <div className="space-y-4">
                <h3 className="font-medium text-green-700">Before Photos</h3>
                <ObjectUploader
                  maxNumberOfFiles={5}
                  maxFileSize={10485760}
                  onGetUploadParameters={async () => {
                    const response = await apiRequest('/api/objects/upload', 'POST');
                    return { method: 'PUT' as const, url: response.uploadURL };
                  }}
                  onComplete={async (result) => {
                    if (result.successful && result.successful.length > 0) {
                      const uploadedFile = result.successful[0];
                      const photoData = {
                        filename: `before_${Date.now()}.jpg`,
                        originalName: uploadedFile.name,
                        fileUrl: uploadedFile.uploadURL,
                        photoType: 'before',
                        description: 'Before work photo',
                        fileSize: uploadedFile.size,
                        mimeType: uploadedFile.type,
                      };
                      uploadPhotoMutation.mutate({
                        reportId: selectedReport!.id,
                        photoData,
                      });
                    }
                  }}
                  buttonClassName="w-full"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Upload Before Photo
                </ObjectUploader>
                
                {/* Display Before Photos */}
                <div className="space-y-2">
                  {photos.filter((photo: CystPhoto) => photo.photoType === 'before').map((photo: CystPhoto) => (
                    <div key={photo.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm truncate">{photo.originalName}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          await apiRequest(`/api/cyst-photos/${photo.id}`, 'DELETE');
                          queryClient.invalidateQueries({ queryKey: [`/api/cyst-reports/${selectedReport?.id}/photos`] });
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* During Photos */}
              <div className="space-y-4">
                <h3 className="font-medium text-blue-700">During Work Photos</h3>
                <ObjectUploader
                  maxNumberOfFiles={5}
                  maxFileSize={10485760}
                  onGetUploadParameters={async () => {
                    const response = await apiRequest('/api/objects/upload', 'POST');
                    return { method: 'PUT' as const, url: response.uploadURL };
                  }}
                  onComplete={async (result) => {
                    if (result.successful && result.successful.length > 0) {
                      const uploadedFile = result.successful[0];
                      const photoData = {
                        filename: `during_${Date.now()}.jpg`,
                        originalName: uploadedFile.name,
                        fileUrl: uploadedFile.uploadURL,
                        photoType: 'during',
                        description: 'During work photo',
                        fileSize: uploadedFile.size,
                        mimeType: uploadedFile.type,
                      };
                      uploadPhotoMutation.mutate({
                        reportId: selectedReport!.id,
                        photoData,
                      });
                    }
                  }}
                  buttonClassName="w-full"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Upload During Photo
                </ObjectUploader>
                
                {/* Display During Photos */}
                <div className="space-y-2">
                  {photos.filter((photo: CystPhoto) => photo.photoType === 'during').map((photo: CystPhoto) => (
                    <div key={photo.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm truncate">{photo.originalName}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          await apiRequest(`/api/cyst-photos/${photo.id}`, 'DELETE');
                          queryClient.invalidateQueries({ queryKey: [`/api/cyst-reports/${selectedReport?.id}/photos`] });
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* After Photos */}
              <div className="space-y-4">
                <h3 className="font-medium text-purple-700">After Photos</h3>
                <ObjectUploader
                  maxNumberOfFiles={5}
                  maxFileSize={10485760}
                  onGetUploadParameters={async () => {
                    const response = await apiRequest('/api/objects/upload', 'POST');
                    return { method: 'PUT' as const, url: response.uploadURL };
                  }}
                  onComplete={async (result) => {
                    if (result.successful && result.successful.length > 0) {
                      const uploadedFile = result.successful[0];
                      const photoData = {
                        filename: `after_${Date.now()}.jpg`,
                        originalName: uploadedFile.name,
                        fileUrl: uploadedFile.uploadURL,
                        photoType: 'after',
                        description: 'After work photo',
                        fileSize: uploadedFile.size,
                        mimeType: uploadedFile.type,
                      };
                      uploadPhotoMutation.mutate({
                        reportId: selectedReport!.id,
                        photoData,
                      });
                    }
                  }}
                  buttonClassName="w-full"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Upload After Photo
                </ObjectUploader>
                
                {/* Display After Photos */}
                <div className="space-y-2">
                  {photos.filter((photo: CystPhoto) => photo.photoType === 'after').map((photo: CystPhoto) => (
                    <div key={photo.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm truncate">{photo.originalName}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          await apiRequest(`/api/cyst-photos/${photo.id}`, 'DELETE');
                          queryClient.invalidateQueries({ queryKey: [`/api/cyst-reports/${selectedReport?.id}/photos`] });
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setIsPhotoDialogOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}