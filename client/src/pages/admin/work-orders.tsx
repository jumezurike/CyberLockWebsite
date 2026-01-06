import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLogin from "./login";
import { Printer, FileText, User, MapPin, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface WorkOrder {
  id: number;
  serviceRequestId: number;
  technicianId: number;
  status: string;
  workDescription?: string;
  dispatchedAt?: string;
  arrivedAt?: string;
  departedAt?: string;
  workCompleted: boolean;
  createdAt: string;
  serviceRequest?: {
    id: number;
    companyName: string;
    contactPersonName: string;
    primaryEmail: string;
    officePhone?: string;
    address?: any;
    serviceCategory?: string;
    projectDescription?: string;
    urgencyLevel?: string;
  };
  technician?: {
    id: number;
    username: string;
    email: string;
    fullName?: string;
  };
}

export default function WorkOrdersPage() {
  const { isLoading: authLoading, isAuthenticated } = useAdminAuth();
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [printMode, setPrintMode] = useState(false);

  const { data: workOrders = [], isLoading } = useQuery<WorkOrder[]>({
    queryKey: ["/api/admin/work-orders"],
    enabled: isAuthenticated,
  });

  const handlePrint = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setPrintMode(true);
    
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 100);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      assigned: { variant: "secondary", label: "Assigned" },
      en_route: { variant: "default", label: "En Route" },
      on_site: { variant: "default", label: "On Site" },
      completed: { variant: "outline", label: "Completed" },
      reviewed: { variant: "outline", label: "Reviewed" },
    };
    
    const config = statusConfig[status] || { variant: "secondary", label: status };
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

  if (printMode && selectedWorkOrder) {
    return (
      <div className="p-8 bg-white print:p-0">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center border-b-2 border-gray-800 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">CyberLockX</h1>
            <p className="text-sm text-gray-600">Professional Services Work Order</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Work Order #{selectedWorkOrder.id}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Status</p>
                <p className="text-lg">{selectedWorkOrder.status}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Created</p>
                <p className="text-lg">{new Date(selectedWorkOrder.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {selectedWorkOrder.serviceRequest && (
            <>
              <div className="mb-6 border-t pt-4">
                <h3 className="text-lg font-bold mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Company Name</p>
                    <p>{selectedWorkOrder.serviceRequest.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Contact Person</p>
                    <p>{selectedWorkOrder.serviceRequest.contactPersonName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Email</p>
                    <p>{selectedWorkOrder.serviceRequest.primaryEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Phone</p>
                    <p>{selectedWorkOrder.serviceRequest.officePhone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {selectedWorkOrder.serviceRequest.address && (
                <div className="mb-6 border-t pt-4">
                  <h3 className="text-lg font-bold mb-3">Service Location</h3>
                  <p>
                    {selectedWorkOrder.serviceRequest.address.street}<br />
                    {selectedWorkOrder.serviceRequest.address.city}, {selectedWorkOrder.serviceRequest.address.state} {selectedWorkOrder.serviceRequest.address.zipCode}
                  </p>
                </div>
              )}
            </>
          )}

          {selectedWorkOrder.technician && (
            <div className="mb-6 border-t pt-4">
              <h3 className="text-lg font-bold mb-3">Assigned Technician</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Name</p>
                  <p>{selectedWorkOrder.technician.fullName || selectedWorkOrder.technician.username}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Email</p>
                  <p>{selectedWorkOrder.technician.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6 border-t pt-4">
            <h3 className="text-lg font-bold mb-3">Service Details</h3>
            {selectedWorkOrder.serviceRequest?.serviceCategory && (
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-600">Service Category</p>
                <p>{selectedWorkOrder.serviceRequest.serviceCategory}</p>
              </div>
            )}
            {selectedWorkOrder.serviceRequest?.projectDescription && (
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-600">Project Description</p>
                <p className="whitespace-pre-wrap">{selectedWorkOrder.serviceRequest.projectDescription}</p>
              </div>
            )}
            {selectedWorkOrder.workDescription && (
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-600">Work Description</p>
                <p className="whitespace-pre-wrap">{selectedWorkOrder.workDescription}</p>
              </div>
            )}
          </div>

          {(selectedWorkOrder.dispatchedAt || selectedWorkOrder.arrivedAt || selectedWorkOrder.departedAt) && (
            <div className="mb-6 border-t pt-4">
              <h3 className="text-lg font-bold mb-3">Timeline</h3>
              <div className="grid grid-cols-3 gap-3">
                {selectedWorkOrder.dispatchedAt && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Dispatched</p>
                    <p>{new Date(selectedWorkOrder.dispatchedAt).toLocaleString()}</p>
                  </div>
                )}
                {selectedWorkOrder.arrivedAt && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Arrived</p>
                    <p>{new Date(selectedWorkOrder.arrivedAt).toLocaleString()}</p>
                  </div>
                )}
                {selectedWorkOrder.departedAt && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Departed</p>
                    <p>{new Date(selectedWorkOrder.departedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
            <p>CyberLockX Professional Services</p>
            <p>Healthcare Apps & Devices Security Hub (HASH)</p>
            <p>info@cyberlockx.xyz</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Work Orders</h1>
          <p className="text-gray-600 mt-2">View and manage all work orders</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : workOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">No work orders found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {workOrders.map((workOrder) => (
              <Card key={workOrder.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Work Order #{workOrder.id}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Service Request #{workOrder.serviceRequestId}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(workOrder.status)}
                      {workOrder.workCompleted && (
                        <Badge variant="outline" className="bg-green-50">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      {workOrder.serviceRequest && (
                        <>
                          <div className="flex items-start gap-2">
                            <User className="h-4 w-4 text-gray-500 mt-1" />
                            <div>
                              <p className="font-semibold">{workOrder.serviceRequest.companyName}</p>
                              <p className="text-sm text-gray-600">{workOrder.serviceRequest.contactPersonName}</p>
                            </div>
                          </div>
                          {workOrder.serviceRequest.address && (
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                              <p className="text-sm">
                                {workOrder.serviceRequest.address.city}, {workOrder.serviceRequest.address.state}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {workOrder.technician && (
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 text-gray-500 mt-1" />
                          <div>
                            <p className="text-sm font-semibold">Technician</p>
                            <p className="text-sm text-gray-600">
                              {workOrder.technician.fullName || workOrder.technician.username}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm font-semibold">Created</p>
                          <p className="text-sm text-gray-600">
                            {new Date(workOrder.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedWorkOrder(workOrder)}
                      data-testid={`button-view-${workOrder.id}`}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrint(workOrder)}
                      data-testid={`button-print-${workOrder.id}`}
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedWorkOrder && !printMode} onOpenChange={(open) => !open && setSelectedWorkOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Work Order #{selectedWorkOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedWorkOrder && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Status</h4>
                <div className="flex gap-2">
                  {getStatusBadge(selectedWorkOrder.status)}
                  {selectedWorkOrder.workCompleted && (
                    <Badge variant="outline" className="bg-green-50">Completed</Badge>
                  )}
                </div>
              </div>

              {selectedWorkOrder.serviceRequest && (
                <div>
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><span className="font-medium">Company:</span> {selectedWorkOrder.serviceRequest.companyName}</p>
                    <p><span className="font-medium">Contact:</span> {selectedWorkOrder.serviceRequest.contactPersonName}</p>
                    <p><span className="font-medium">Email:</span> {selectedWorkOrder.serviceRequest.primaryEmail}</p>
                    {selectedWorkOrder.serviceRequest.officePhone && (
                      <p><span className="font-medium">Phone:</span> {selectedWorkOrder.serviceRequest.officePhone}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedWorkOrder.technician && (
                <div>
                  <h4 className="font-semibold mb-2">Assigned Technician</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedWorkOrder.technician.fullName || selectedWorkOrder.technician.username}</p>
                    <p><span className="font-medium">Email:</span> {selectedWorkOrder.technician.email}</p>
                  </div>
                </div>
              )}

              {selectedWorkOrder.serviceRequest?.projectDescription && (
                <div>
                  <h4 className="font-semibold mb-2">Project Description</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedWorkOrder.serviceRequest.projectDescription}</p>
                  </div>
                </div>
              )}

              {selectedWorkOrder.workDescription && (
                <div>
                  <h4 className="font-semibold mb-2">Work Description</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedWorkOrder.workDescription}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={() => handlePrint(selectedWorkOrder)} data-testid="button-print-modal">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Work Order
                </Button>
                <Button variant="outline" onClick={() => setSelectedWorkOrder(null)} data-testid="button-close-modal">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
