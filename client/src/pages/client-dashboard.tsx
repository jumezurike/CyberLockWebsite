import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  MapPin, 
  CheckCircle, 
  FileText, 
  Star, 
  Calendar, 
  User, 
  Phone, 
  Mail,
  Download,
  Eye,
  Wrench,
  Shield
} from 'lucide-react';

interface ClientServiceData {
  serviceRequest: {
    id: number;
    companyName: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    serviceType: string;
    priority: string;
    status: string;
    scheduledDate: string;
    estimatedDuration: string;
    totalCost: number;
    description: string;
    createdAt: string;
  };
  assignedTechnician: {
    id: number;
    name: string;
    phone: string;
    email: string;
    specializations: string[];
    rating: number;
    estimatedArrival: string;
  } | null;
  workOrder: {
    id: number;
    status: string;
    arrivedAt: string | null;
    departedAt: string | null;
    totalHoursWorked: number | null;
    workDescription: string | null;
    beforePhotos: string[];
    afterPhotos: string[];
    serviceReportFile: string | null;
    clientSignature: string | null;
    closingRemarks: string | null;
  } | null;
  documents: {
    id: number;
    fileName: string;
    fileType: string;
    uploadedAt: string;
    fileSize: string;
    downloadUrl: string;
  }[];
}

export default function ClientDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch client service data
  const { data: serviceData, isLoading, error } = useQuery<ClientServiceData>({
    queryKey: ['/api/client/service-data'],
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !serviceData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Service Data Found</h3>
              <p className="text-gray-600">Please contact support if you believe this is an error.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const { serviceRequest, assignedTechnician, workOrder, documents } = serviceData;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Dashboard</h1>
          <p className="text-gray-600">Track your CyberLockX service request and technician progress</p>
        </div>

        {/* Service Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Status</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge className={getStatusColor(serviceRequest.status)}>
                {serviceRequest.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">Request #{serviceRequest.id}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Technician Status</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {assignedTechnician ? (
                <div>
                  <div className="text-lg font-bold">{assignedTechnician.name}</div>
                  <p className="text-xs text-muted-foreground">
                    ETA: {new Date(assignedTechnician.estimatedArrival).toLocaleTimeString()}
                  </p>
                </div>
              ) : (
                <div className="text-lg font-bold text-gray-500">Not Assigned</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Work Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {workOrder?.arrivedAt ? (
                <div>
                  {workOrder.departedAt ? (
                    <div className="text-lg font-bold text-green-600">Completed</div>
                  ) : (
                    <div className="text-lg font-bold text-blue-600">In Progress</div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Started: {formatDate(workOrder.arrivedAt)}
                  </p>
                </div>
              ) : (
                <div className="text-lg font-bold text-gray-500">Not Started</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technician">Technician</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Service Type</label>
                    <p className="text-lg">{serviceRequest.serviceType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Priority</label>
                    <Badge variant="outline" className="ml-2">
                      {serviceRequest.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Scheduled Date</label>
                    <p className="text-lg">{formatDate(serviceRequest.scheduledDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estimated Duration</label>
                    <p className="text-lg">{serviceRequest.estimatedDuration}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-lg">{serviceRequest.description}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technician Tab */}
          <TabsContent value="technician" className="space-y-6 mt-6">
            {assignedTechnician ? (
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Technician</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{assignedTechnician.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">
                          {assignedTechnician.rating}/5 Rating
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{assignedTechnician.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{assignedTechnician.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Specializations</label>
                    <div className="flex gap-2 mt-1">
                      {assignedTechnician.specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary">{spec}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Estimated Arrival</label>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatDate(assignedTechnician.estimatedArrival)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Technician Not Assigned</h3>
                  <p className="text-gray-600">A technician will be assigned to your service request soon.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Work Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {workOrder ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Arrival Time</label>
                        <p className="text-lg">
                          {workOrder.arrivedAt ? formatDate(workOrder.arrivedAt) : 'Not arrived yet'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Departure Time</label>
                        <p className="text-lg">
                          {workOrder.departedAt ? formatDate(workOrder.departedAt) : 'Still on-site'}
                        </p>
                      </div>
                      {workOrder.totalHoursWorked && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Hours Worked</label>
                          <p className="text-lg">{workOrder.totalHoursWorked} hours</p>
                        </div>
                      )}
                    </div>

                    {workOrder.workDescription && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Work Description</label>
                        <p className="text-lg">{workOrder.workDescription}</p>
                      </div>
                    )}

                    {workOrder.closingRemarks && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Closing Remarks</label>
                        <p className="text-lg">{workOrder.closingRemarks}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Work Not Started</h3>
                    <p className="text-gray-600">Progress updates will appear here once work begins.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Documents</CardTitle>
                <CardDescription>
                  All documents related to your service request, including technician reports and photos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <h4 className="font-medium">{doc.fileName}</h4>
                            <p className="text-sm text-gray-600">
                              {doc.fileType} • {doc.fileSize} • {formatDate(doc.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Yet</h3>
                    <p className="text-gray-600">
                      Documents will appear here as the technician completes work and uploads reports.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}