import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Clock, MapPin, CheckCircle, Upload, Star, MessageSquare } from 'lucide-react';

interface WorkOrder {
  id: number;
  serviceRequestId: number;
  technicianId: number;
  dispatchedAt?: string;
  arrivedAt?: string;
  departedAt?: string;
  totalHoursWorked?: number;
  workDescription?: string;
  equipmentUsed?: string[];
  beforePhotos?: string[];
  afterPhotos?: string[];
  serviceReportFile?: string;
  workCompleted: boolean;
  clientSignature?: string;
  clientSignatureName?: string;
  closingRemarks?: string;
  issuesEncountered?: string;
  recommendedFollowUp?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function TechnicianPortal() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Time tracking state
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  
  // Work details state
  const [workDescription, setWorkDescription] = useState('');
  const [equipmentUsed, setEquipmentUsed] = useState('');
  const [closingRemarks, setClosingRemarks] = useState('');
  const [issuesEncountered, setIssuesEncountered] = useState('');
  const [recommendedFollowUp, setRecommendedFollowUp] = useState('');

  // Feedback state
  const [feedbackForm, setFeedbackForm] = useState({
    serviceQualityRating: 5,
    communicationRating: 5,
    siteAccessibilityRating: 5,
    feedbackComments: '',
    improvementSuggestions: '',
    wouldWorkAgain: true,
    jobComplexityRating: 3,
    resourcesAdequateRating: 5,
    timeAllocationRating: 5,
    internalComments: '',
    equipmentIssues: '',
    trainingNeeded: ''
  });

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      const response = await fetch('/api/technician/work-orders');
      if (!response.ok) {
        throw new Error('Failed to fetch work orders');
      }
      const orders = await response.json();
      setWorkOrders(orders);
      if (orders.length > 0 && !selectedWorkOrder) {
        setSelectedWorkOrder(orders[0]);
        loadWorkOrderData(orders[0]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch work orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadWorkOrderData = (workOrder: WorkOrder) => {
    setWorkDescription(workOrder.workDescription || '');
    setEquipmentUsed(workOrder.equipmentUsed?.join(', ') || '');
    setClosingRemarks(workOrder.closingRemarks || '');
    setIssuesEncountered(workOrder.issuesEncountered || '');
    setRecommendedFollowUp(workOrder.recommendedFollowUp || '');
    setArrivalTime(workOrder.arrivedAt ? new Date(workOrder.arrivedAt).toISOString().slice(0, 16) : '');
    setDepartureTime(workOrder.departedAt ? new Date(workOrder.departedAt).toISOString().slice(0, 16) : '');
  };

  const updateWorkOrder = async (updates: any) => {
    if (!selectedWorkOrder) return;

    try {
      const response = await fetch(`/api/technician/work-orders/${selectedWorkOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update work order');
      }

      const updatedWorkOrder = await response.json();
      setSelectedWorkOrder(updatedWorkOrder);
      setWorkOrders(orders => 
        orders.map(order => 
          order.id === updatedWorkOrder.id ? updatedWorkOrder : order
        )
      );

      toast({
        title: "Success",
        description: "Work order updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update work order",
        variant: "destructive",
      });
    }
  };

  const handleTimeTracking = () => {
    const updates: any = {};
    
    if (arrivalTime && !selectedWorkOrder?.arrivedAt) {
      updates.arrivedAt = new Date(arrivalTime).toISOString();
      updates.status = 'on_site';
    }
    
    if (departureTime && arrivalTime) {
      updates.departedAt = new Date(departureTime).toISOString();
      updates.status = 'completed';
    }

    updateWorkOrder(updates);
  };

  const handleWorkDetails = () => {
    const updates = {
      workDescription,
      equipmentUsed: equipmentUsed.split(',').map(item => item.trim()).filter(Boolean),
      closingRemarks,
      issuesEncountered,
      recommendedFollowUp,
      workCompleted: true
    };

    updateWorkOrder(updates);
  };

  const submitFeedback = async () => {
    if (!selectedWorkOrder) return;

    try {
      const response = await fetch('/api/technician/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...feedbackForm,
          workOrderId: selectedWorkOrder.id,
          serviceRequestId: selectedWorkOrder.serviceRequestId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast({
        title: "Success",
        description: "Feedback submitted successfully",
      });

      // Update work order status to reviewed
      updateWorkOrder({ status: 'reviewed' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      assigned: { color: 'bg-blue-500', label: 'Assigned' },
      en_route: { color: 'bg-yellow-500', label: 'En Route' },
      on_site: { color: 'bg-green-500', label: 'On Site' },
      completed: { color: 'bg-purple-500', label: 'Completed' },
      reviewed: { color: 'bg-gray-500', label: 'Reviewed' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.assigned;
    return <Badge className={`${config.color} text-white`}>{config.label}</Badge>;
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Field Technician Portal</h1>
        <p className="text-gray-600 mt-2">Manage your service requests, time tracking, and feedback</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Work Orders List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Active Work Orders
              </CardTitle>
              <CardDescription>
                {workOrders.length} work order(s) assigned
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {workOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No work orders assigned</p>
              ) : (
                workOrders.map((order) => (
                  <div 
                    key={order.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedWorkOrder?.id === order.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedWorkOrder(order);
                      loadWorkOrderData(order);
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Work Order #{order.id}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Service Request #{order.serviceRequestId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Work Order Details */}
        <div className="lg:col-span-2">
          {selectedWorkOrder ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tracking">Time Tracking</TabsTrigger>
                <TabsTrigger value="details">Work Details</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Work Order #{selectedWorkOrder.id}</CardTitle>
                    <CardDescription>
                      Service Request #{selectedWorkOrder.serviceRequestId}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <div className="mt-1">{getStatusBadge(selectedWorkOrder.status)}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Work Completed</Label>
                        <div className="mt-1">
                          {selectedWorkOrder.workCompleted ? (
                            <Badge className="bg-green-500 text-white">Yes</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Total Time</Label>
                        <p className="mt-1">{formatDuration(selectedWorkOrder.totalHoursWorked)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Created</Label>
                        <p className="mt-1">{new Date(selectedWorkOrder.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tracking" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Time Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="arrivalTime">Arrival Time</Label>
                        <Input
                          id="arrivalTime"
                          type="datetime-local"
                          value={arrivalTime}
                          onChange={(e) => setArrivalTime(e.target.value)}
                          disabled={!!selectedWorkOrder.arrivedAt}
                        />
                        {selectedWorkOrder.arrivedAt && (
                          <p className="text-sm text-green-600 mt-1">
                            ✓ Arrived: {new Date(selectedWorkOrder.arrivedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="departureTime">Departure Time</Label>
                        <Input
                          id="departureTime"
                          type="datetime-local"
                          value={departureTime}
                          onChange={(e) => setDepartureTime(e.target.value)}
                          disabled={!selectedWorkOrder.arrivedAt || !!selectedWorkOrder.departedAt}
                        />
                        {selectedWorkOrder.departedAt && (
                          <p className="text-sm text-green-600 mt-1">
                            ✓ Departed: {new Date(selectedWorkOrder.departedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleTimeTracking}
                      className="w-full"
                      disabled={(!arrivalTime && selectedWorkOrder.arrivedAt) || 
                               (selectedWorkOrder.arrivedAt && selectedWorkOrder.departedAt)}
                    >
                      {!selectedWorkOrder.arrivedAt ? 'Record Arrival' : 
                       !selectedWorkOrder.departedAt ? 'Record Departure' : 'Times Recorded'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Work Details & Documentation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="workDescription">Work Description</Label>
                      <Textarea
                        id="workDescription"
                        placeholder="Describe the work performed..."
                        value={workDescription}
                        onChange={(e) => setWorkDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="equipmentUsed">Equipment Used (comma-separated)</Label>
                      <Input
                        id="equipmentUsed"
                        placeholder="Router, Cable tester, Drill..."
                        value={equipmentUsed}
                        onChange={(e) => setEquipmentUsed(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="closingRemarks">Closing Remarks</Label>
                      <Textarea
                        id="closingRemarks"
                        placeholder="Summary of work completion..."
                        value={closingRemarks}
                        onChange={(e) => setClosingRemarks(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="issuesEncountered">Issues Encountered</Label>
                      <Textarea
                        id="issuesEncountered"
                        placeholder="Any problems or complications..."
                        value={issuesEncountered}
                        onChange={(e) => setIssuesEncountered(e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="recommendedFollowUp">Recommended Follow-up</Label>
                      <Textarea
                        id="recommendedFollowUp"
                        placeholder="Future maintenance or recommendations..."
                        value={recommendedFollowUp}
                        onChange={(e) => setRecommendedFollowUp(e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <Label className="text-base font-medium">File Uploads</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <Button variant="outline" className="h-20 flex flex-col items-center">
                          <Upload className="h-6 w-6 mb-1" />
                          Before Photos
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col items-center">
                          <Upload className="h-6 w-6 mb-1" />
                          After Photos
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col items-center">
                          <Upload className="h-6 w-6 mb-1" />
                          Service Report
                        </Button>
                      </div>
                    </div>

                    <Button 
                      onClick={handleWorkDetails}
                      className="w-full"
                      disabled={!workDescription || !closingRemarks}
                    >
                      Save Work Details
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="feedback" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Client & Job Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Rate the Client/Site</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Service Quality (1-5)</Label>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                onClick={() => setFeedbackForm({...feedbackForm, serviceQualityRating: rating})}
                                className={`p-1 ${rating <= feedbackForm.serviceQualityRating ? 'text-yellow-500' : 'text-gray-300'}`}
                              >
                                <Star className="h-5 w-5 fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label>Communication (1-5)</Label>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                onClick={() => setFeedbackForm({...feedbackForm, communicationRating: rating})}
                                className={`p-1 ${rating <= feedbackForm.communicationRating ? 'text-yellow-500' : 'text-gray-300'}`}
                              >
                                <Star className="h-5 w-5 fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label>Site Accessibility (1-5)</Label>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                onClick={() => setFeedbackForm({...feedbackForm, siteAccessibilityRating: rating})}
                                className={`p-1 ${rating <= feedbackForm.siteAccessibilityRating ? 'text-yellow-500' : 'text-gray-300'}`}
                              >
                                <Star className="h-5 w-5 fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="feedbackComments">Client Feedback Comments</Label>
                      <Textarea
                        id="feedbackComments"
                        placeholder="Comments about working with this client..."
                        value={feedbackForm.feedbackComments}
                        onChange={(e) => setFeedbackForm({...feedbackForm, feedbackComments: e.target.value})}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="improvementSuggestions">Improvement Suggestions</Label>
                      <Textarea
                        id="improvementSuggestions"
                        placeholder="How could this client improve their processes..."
                        value={feedbackForm.improvementSuggestions}
                        onChange={(e) => setFeedbackForm({...feedbackForm, improvementSuggestions: e.target.value})}
                        rows={2}
                      />
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Internal Job Assessment</h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="internalComments">Internal Comments</Label>
                          <Textarea
                            id="internalComments"
                            placeholder="Internal notes about this job..."
                            value={feedbackForm.internalComments}
                            onChange={(e) => setFeedbackForm({...feedbackForm, internalComments: e.target.value})}
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="equipmentIssues">Equipment Issues</Label>
                          <Textarea
                            id="equipmentIssues"
                            placeholder="Any equipment problems encountered..."
                            value={feedbackForm.equipmentIssues}
                            onChange={(e) => setFeedbackForm({...feedbackForm, equipmentIssues: e.target.value})}
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={submitFeedback}
                      className="w-full"
                      disabled={!feedbackForm.feedbackComments || selectedWorkOrder.status === 'reviewed'}
                    >
                      {selectedWorkOrder.status === 'reviewed' ? 'Feedback Submitted' : 'Submit Feedback'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Work Order Selected</h3>
                  <p className="text-gray-500">Select a work order from the list to get started</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}