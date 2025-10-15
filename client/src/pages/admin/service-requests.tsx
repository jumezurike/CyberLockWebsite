import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import AdminLogin from "./login";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Mail,
  Phone,
  Briefcase,
  ClipboardList
} from "lucide-react";

interface ServiceRequest {
  id: number;
  companyName: string;
  contactPersonName: string;
  contactPersonTitle: string;
  primaryEmail: string;
  secondaryEmail?: string;
  officePhone?: string;
  mobilePhone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  serviceCategory: string;
  selectedServices?: any[];
  organizationDescription?: string;
  projectDescription?: string;
  urgencyLevel: string;
  desiredStartDate?: string;
  desiredEndDate?: string;
  calculatedTotal?: number;
  pricingBreakdown?: any;
  status: string;
  assignedTo?: number;
  technicianId?: number;
  createdAt: string;
  updatedAt: string;
}

interface Technician {
  id: number;
  username: string;
  fullName?: string;
  email: string;
  role: string;
}

export default function ServiceRequestsPage() {
  const { isLoading: authLoading, isAuthenticated } = useAdminAuth();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [assigningTechnician, setAssigningTechnician] = useState<number | null>(null);

  const { data: serviceRequests = [], isLoading } = useQuery<ServiceRequest[]>({
    queryKey: ["/api/admin/service-requests"],
    enabled: isAuthenticated,
  });

  const { data: technicians = [] } = useQuery<Technician[]>({
    queryKey: ["/api/admin/technicians"],
    enabled: isAuthenticated,
  });

  const createWorkOrderMutation = useMutation({
    mutationFn: async ({ serviceRequestId, technicianId }: { serviceRequestId: number; technicianId: number }) => {
      return await apiRequest("/api/admin/work-orders/create", "POST", { 
        serviceRequestId, 
        technicianId 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/service-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/work-orders"] });
      toast({
        title: "Success",
        description: "Work order created and technician assigned successfully",
      });
      setAssigningTechnician(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create work order",
        variant: "destructive",
      });
    },
  });

  const handleAssignTechnician = (technicianId: number) => {
    if (assigningTechnician) {
      createWorkOrderMutation.mutate({
        serviceRequestId: assigningTechnician,
        technicianId,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      pending: { variant: "secondary", label: "Pending" },
      quoted: { variant: "default", label: "Quoted" },
      approved: { variant: "default", label: "Approved" },
      in_progress: { variant: "default", label: "In Progress" },
      dispatched: { variant: "default", label: "Dispatched" },
      on_site: { variant: "default", label: "On Site" },
      completed: { variant: "outline", label: "Completed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    };
    
    const config = statusConfig[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig: Record<string, { variant: "default" | "secondary" | "destructive", label: string }> = {
      Critical: { variant: "destructive", label: "Critical" },
      High: { variant: "destructive", label: "High" },
      Medium: { variant: "default", label: "Medium" },
      Low: { variant: "secondary", label: "Low" },
    };
    
    const config = urgencyConfig[urgency] || { variant: "secondary", label: urgency };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Service Requests
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage all incoming service requests and assign technicians
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : serviceRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-slate-600 dark:text-slate-400">
                <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No service requests found</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {serviceRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        Service Request #{request.id}
                      </CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(request.status)}
                        {getUrgencyBadge(request.urgencyLevel)}
                        <Badge variant="outline">{request.serviceCategory}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Created: {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Customer Information */}
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Customer Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-600 dark:text-slate-400">Company:</span>
                          <p className="font-medium">{request.companyName}</p>
                        </div>
                        <div>
                          <span className="text-slate-600 dark:text-slate-400">Contact:</span>
                          <p className="font-medium">{request.contactPersonName}</p>
                          <p className="text-slate-500">{request.contactPersonTitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-600">{request.primaryEmail}</span>
                        </div>
                        {request.officePhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-600">{request.officePhone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Service Details */}
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Service Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        {request.projectDescription && (
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">Project:</span>
                            <p className="font-medium line-clamp-3">{request.projectDescription}</p>
                          </div>
                        )}
                        {request.address && (
                          <div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                              <MapPin className="w-3 h-3" />
                              <span>Location:</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300">
                              {request.address.street}, {request.address.city}, {request.address.state} {request.address.zipCode}
                            </p>
                          </div>
                        )}
                        {request.desiredStartDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-600">
                              Start: {new Date(request.desiredStartDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {request.calculatedTotal && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-3 h-3 text-slate-400" />
                            <span className="font-semibold text-slate-900 dark:text-white">
                              ${(request.calculatedTotal / 100).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRequest(request)}
                      data-testid={`button-view-details-${request.id}`}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    
                    {request.status === 'pending' && !request.technicianId && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setAssigningTechnician(request.id)}
                        data-testid={`button-assign-${request.id}`}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Assign Technician
                      </Button>
                    )}
                    
                    {request.technicianId && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Assigned to Technician
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Service Request #{selectedRequest?.id}</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                {getStatusBadge(selectedRequest.status)}
                {getUrgencyBadge(selectedRequest.urgencyLevel)}
                <Badge variant="outline">{selectedRequest.serviceCategory}</Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-slate-600 dark:text-slate-400">Company</dt>
                      <dd className="font-medium">{selectedRequest.companyName}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-600 dark:text-slate-400">Contact Person</dt>
                      <dd className="font-medium">{selectedRequest.contactPersonName}</dd>
                      <dd className="text-slate-500">{selectedRequest.contactPersonTitle}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-600 dark:text-slate-400">Primary Email</dt>
                      <dd>{selectedRequest.primaryEmail}</dd>
                    </div>
                    {selectedRequest.secondaryEmail && (
                      <div>
                        <dt className="text-slate-600 dark:text-slate-400">Secondary Email</dt>
                        <dd>{selectedRequest.secondaryEmail}</dd>
                      </div>
                    )}
                    {selectedRequest.officePhone && (
                      <div>
                        <dt className="text-slate-600 dark:text-slate-400">Office Phone</dt>
                        <dd>{selectedRequest.officePhone}</dd>
                      </div>
                    )}
                    {selectedRequest.mobilePhone && (
                      <div>
                        <dt className="text-slate-600 dark:text-slate-400">Mobile Phone</dt>
                        <dd>{selectedRequest.mobilePhone}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Service Location</h3>
                  {selectedRequest.address && (
                    <address className="not-italic text-sm">
                      {selectedRequest.address.street}<br />
                      {selectedRequest.address.city}, {selectedRequest.address.state} {selectedRequest.address.zipCode}
                      {selectedRequest.address.country && <><br />{selectedRequest.address.country}</>}
                    </address>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Project Details</h3>
                {selectedRequest.organizationDescription && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Organization Description</h4>
                    <p className="text-sm">{selectedRequest.organizationDescription}</p>
                  </div>
                )}
                {selectedRequest.projectDescription && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Project Description</h4>
                    <p className="text-sm whitespace-pre-wrap">{selectedRequest.projectDescription}</p>
                  </div>
                )}
              </div>

              {selectedRequest.selectedServices && selectedRequest.selectedServices.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Selected Services</h3>
                  <div className="space-y-2">
                    {selectedRequest.selectedServices.map((service: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div>
                          <p className="font-medium">{service.serviceName}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Quantity: {service.quantity} × {service.priceType}
                          </p>
                        </div>
                        <p className="font-semibold">${(service.basePrice / 100).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {selectedRequest.desiredStartDate && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Desired Start Date</h4>
                    <p>{new Date(selectedRequest.desiredStartDate).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedRequest.desiredEndDate && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Desired End Date</h4>
                    <p>{new Date(selectedRequest.desiredEndDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {selectedRequest.calculatedTotal && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Total Estimate</h3>
                    <p className="text-2xl font-bold text-primary">
                      ${(selectedRequest.calculatedTotal / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Technician Modal */}
      <Dialog open={!!assigningTechnician} onOpenChange={() => setAssigningTechnician(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Select a technician to create a work order for Service Request #{assigningTechnician}
            </p>
            <Select onValueChange={(value) => handleAssignTechnician(parseInt(value))}>
              <SelectTrigger data-testid="select-technician">
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id.toString()}>
                    {tech.fullName || tech.username} - {tech.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
