import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Clock, MapPin, CheckCircle, Upload, Star, MessageSquare, FileText, Camera, User, Building } from 'lucide-react';
import CystReportForm from '@/components/technician/cyst-report-form';
import FileUpload from '@/components/technician/file-upload';

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
  // Service request details
  serviceRequest?: {
    companyName: string;
    contactPersonName: string;
    projectDescription: string;
    address: any;
    officePhone: string;
    primaryEmail: string;
    requestCreated: string;
  };
}

export default function TechnicianPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [filteredWorkOrders, setFilteredWorkOrders] = useState<WorkOrder[]>([]);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Time tracking state
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Work details state
  const [workDescription, setWorkDescription] = useState('');
  const [equipmentUsed, setEquipmentUsed] = useState('');
  const [closingRemarks, setClosingRemarks] = useState('');
  const [issuesEncountered, setIssuesEncountered] = useState('');
  const [recommendedFollowUp, setRecommendedFollowUp] = useState('');

  // File upload state
  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);
  const [serviceDocuments, setServiceDocuments] = useState<string[]>([]);

  // Client signature state
  const [clientSignature, setClientSignature] = useState('');
  const [clientSignatureName, setClientSignatureName] = useState('');

  // CYST Report state
  const [cystReport, setCystReport] = useState<any>(null);
  const [showCystForm, setShowCystForm] = useState(false);

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
    checkAuth();
    
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkOrders();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/technician/me');
      if (response.ok) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const response = await fetch('/api/technician/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Login failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed",
        variant: "destructive",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/technician/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setWorkOrders([]);
      setSelectedWorkOrder(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const fetchWorkOrders = async () => {
    try {
      const response = await fetch('/api/technician/work-orders');
      if (!response.ok) {
        throw new Error('Failed to fetch work orders');
      }
      const orders = await response.json();
      setWorkOrders(orders);
      setFilteredWorkOrders(orders);
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

  // Filter work orders based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredWorkOrders(workOrders);
    } else {
      const filtered = workOrders.filter(order => {
        const searchLower = searchQuery.toLowerCase();
        const canonicalNumber = `WO-${String(order.id).padStart(4, '0')}`;
        return canonicalNumber.toLowerCase().includes(searchLower) ||
               order.serviceRequest?.companyName?.toLowerCase().includes(searchLower) ||
               order.serviceRequest?.contactPersonName?.toLowerCase().includes(searchLower) ||
               order.status.toLowerCase().includes(searchLower);
      });
      setFilteredWorkOrders(filtered);
    }
  }, [searchQuery, workOrders]);

  // Generate canonical work order number
  const getCanonicalWorkOrderNumber = (id: number) => {
    return `WO-${String(id).padStart(4, '0')}`;
  };

  const loadWorkOrderData = (workOrder: WorkOrder) => {
    setWorkDescription(workOrder.workDescription || '');
    setEquipmentUsed(workOrder.equipmentUsed?.join(', ') || '');
    setClosingRemarks(workOrder.closingRemarks || '');
    setIssuesEncountered(workOrder.issuesEncountered || '');
    setRecommendedFollowUp(workOrder.recommendedFollowUp || '');
    setArrivalTime(workOrder.arrivedAt ? new Date(workOrder.arrivedAt).toISOString().slice(0, 16) : '');
    setDepartureTime(workOrder.departedAt ? new Date(workOrder.departedAt).toISOString().slice(0, 16) : '');
    setBeforePhotos(workOrder.beforePhotos || []);
    setAfterPhotos(workOrder.afterPhotos || []);
    setServiceDocuments(workOrder.serviceReportFile ? [workOrder.serviceReportFile] : []);
    setClientSignature(workOrder.clientSignature || '');
    setClientSignatureName(workOrder.clientSignatureName || '');
    
    // Load CYST report if exists
    fetchCystReport(workOrder.id);
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

  const fetchCystReport = async (workOrderId: number) => {
    try {
      const response = await fetch(`/api/technician/work-orders/${workOrderId}/cyst-report`);
      if (response.ok) {
        const report = await response.json();
        setCystReport(report);
      }
    } catch (error) {
      // CYST report doesn't exist yet, which is fine
      setCystReport(null);
    }
  };

  const handleClockIn = async () => {
    const now = new Date().toISOString();
    setArrivalTime(now.slice(0, 16));
    await updateWorkOrder({
      arrivedAt: now,
      status: 'on_site'
    });
  };

  const handleClockOut = async () => {
    const now = new Date().toISOString();
    setDepartureTime(now.slice(0, 16));
    await updateWorkOrder({
      departedAt: now,
      status: 'completed',
      workCompleted: true
    });
  };

  const handleCystReportSave = (reportData: any) => {
    setCystReport(reportData);
    setShowCystForm(false);
    toast({
      title: "CYST Report Created",
      description: "E1T1 Tech Field Service Report has been created and is court-admissible",
    });
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

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Technician Portal Login</CardTitle>
            <CardDescription>Enter your credentials to access the technician portal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginLoading}
              >
                {loginLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Test credentials: tech1 / tech123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Field Technician Portal</h1>
          <p className="text-gray-600 mt-2">Manage your service requests, time tracking, and feedback</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
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
                {filteredWorkOrders.length} of {workOrders.length} work order(s) displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Search Bar */}
              <div className="mb-4">
                <Input
                  placeholder="Search by work order number, company, contact, or status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              {filteredWorkOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {searchQuery ? 'No work orders match your search' : 'No work orders assigned'}
                </p>
              ) : (
                filteredWorkOrders.map((order) => (
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
                      <h3 className="font-medium">{getCanonicalWorkOrderNumber(order.id)}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {order.serviceRequest?.companyName || 'Unknown Company'}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      Contact: {order.serviceRequest?.contactPersonName || 'Unknown'}
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
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tracking">Time</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="cyst">CYST Report</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{getCanonicalWorkOrderNumber(selectedWorkOrder.id)}</CardTitle>
                    <CardDescription>
                      Service Request #{selectedWorkOrder.serviceRequestId} • {selectedWorkOrder.serviceRequest?.companyName || 'Unknown Company'}
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

                {/* Original Service Request Details */}
                {selectedWorkOrder.serviceRequest && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Original Service Request Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Company</Label>
                          <p className="text-sm text-gray-900 mt-1">{selectedWorkOrder.serviceRequest.companyName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Contact Person</Label>
                          <p className="text-sm text-gray-900 mt-1">{selectedWorkOrder.serviceRequest.contactPersonName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Phone</Label>
                          <p className="text-sm text-gray-900 mt-1">{selectedWorkOrder.serviceRequest.officePhone || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Email</Label>
                          <p className="text-sm text-gray-900 mt-1">{selectedWorkOrder.serviceRequest.primaryEmail || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Project Description</Label>
                        <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded-md">
                          {selectedWorkOrder.serviceRequest.projectDescription || 'No description provided'}
                        </p>
                      </div>

                      {selectedWorkOrder.serviceRequest.address && (
                        <div>
                          <Label className="text-sm font-medium">Service Address</Label>
                          <p className="text-sm text-gray-900 mt-1">
                            {typeof selectedWorkOrder.serviceRequest.address === 'object' ? (
                              `${selectedWorkOrder.serviceRequest.address.street || ''}, ${selectedWorkOrder.serviceRequest.address.city || ''}, ${selectedWorkOrder.serviceRequest.address.state || ''} ${selectedWorkOrder.serviceRequest.address.zipCode || ''}`
                            ) : selectedWorkOrder.serviceRequest.address}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <Label className="text-sm font-medium">Request Created</Label>
                        <p className="text-sm text-gray-900 mt-1">
                          {new Date(selectedWorkOrder.serviceRequest.requestCreated).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="tracking" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Time Tracking & Clock In/Out
                    </CardTitle>
                    <CardDescription>Record arrival and departure times for accurate billing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Quick Clock In/Out Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        onClick={handleClockIn}
                        disabled={!!selectedWorkOrder.arrivedAt}
                        className="h-16 text-lg"
                        variant={selectedWorkOrder.arrivedAt ? "outline" : "default"}
                      >
                        <Clock className="h-6 w-6 mr-2" />
                        {selectedWorkOrder.arrivedAt ? "Clocked In" : "Clock In"}
                      </Button>
                      <Button
                        onClick={handleClockOut}
                        disabled={!selectedWorkOrder.arrivedAt || !!selectedWorkOrder.departedAt}
                        className="h-16 text-lg"
                        variant={selectedWorkOrder.departedAt ? "outline" : "default"}
                      >
                        <CheckCircle className="h-6 w-6 mr-2" />
                        {selectedWorkOrder.departedAt ? "Clocked Out" : "Clock Out"}
                      </Button>
                    </div>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="arrivalTime">Manual Arrival Time</Label>
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
                        <Label htmlFor="departureTime">Manual Departure Time</Label>
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
                      disabled={(!arrivalTime && !!selectedWorkOrder.arrivedAt) || 
                               (!!selectedWorkOrder.arrivedAt && !!selectedWorkOrder.departedAt)}
                    >
                      {!selectedWorkOrder.arrivedAt ? 'Save Manual Arrival Time' : 
                       !selectedWorkOrder.departedAt ? 'Save Manual Departure Time' : 'Times Recorded'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Photos Tab */}
              <TabsContent value="photos" className="space-y-4">
                <div className="space-y-6">
                  <FileUpload
                    workOrderId={selectedWorkOrder.id}
                    uploadType="before"
                    title="Before Photos"
                    description="Take photos before starting work to document initial conditions"
                    onUpload={setBeforePhotos}
                    existingFiles={beforePhotos}
                  />
                  
                  <FileUpload
                    workOrderId={selectedWorkOrder.id}
                    uploadType="after"
                    title="After Photos"
                    description="Take photos after completing work to show final results"
                    onUpload={setAfterPhotos}
                    existingFiles={afterPhotos}
                  />
                  
                  <FileUpload
                    workOrderId={selectedWorkOrder.id}
                    uploadType="documents"
                    title="Service Documentation"
                    description="Upload signed service reports and other documentation"
                    onUpload={setServiceDocuments}
                    existingFiles={serviceDocuments}
                  />
                </div>
              </TabsContent>

              {/* CYST Report Tab */}
              <TabsContent value="cyst" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      E1T1 CYST Service Report
                    </CardTitle>
                    <CardDescription>
                      Court-admissible field technician service report with handwritten signature collection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {cystReport ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <div>
                              <p className="font-medium text-green-900">CYST Report Created</p>
                              <p className="text-sm text-green-700">
                                Report ID: {cystReport.id} | Created: {new Date(cystReport.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" onClick={() => setShowCystForm(true)}>
                            View/Edit Report
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Business Name</Label>
                            <p className="text-sm text-gray-600">{cystReport.businessName}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Service Date</Label>
                            <p className="text-sm text-gray-600">{cystReport.serviceDate}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Technician</Label>
                            <p className="text-sm text-gray-600">{cystReport.technicianName}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Status</Label>
                            <Badge className="bg-blue-500 text-white">Court-Admissible</Badge>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Create CYST Service Report</h3>
                        <p className="text-gray-600 mb-4">
                          Generate a court-admissible E1T1 Tech Field Service Report with handwritten signature collection
                        </p>
                        <Button onClick={() => setShowCystForm(true)}>
                          Create CYST Report
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* CYST Report Form Modal */}
                {showCystForm && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>E1T1 CYST Service Report Form</CardTitle>
                      <CardDescription>Complete all fields for court-admissible documentation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CystReportForm 
                        workOrderId={selectedWorkOrder.id}
                        onSave={handleCystReportSave}
                      />
                    </CardContent>
                  </Card>
                )}
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
                      <Label className="text-base font-medium">Client Signature Collection</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div>
                          <Label htmlFor="clientSignatureName">Client Name for Signature</Label>
                          <Input
                            id="clientSignatureName"
                            value={clientSignatureName}
                            onChange={(e) => setClientSignatureName(e.target.value)}
                            placeholder="Full name of client signing"
                          />
                        </div>
                        <div>
                          <Label htmlFor="clientSignature">Handwritten Signature Code</Label>
                          <Input
                            id="clientSignature"
                            value={clientSignature}
                            onChange={(e) => setClientSignature(e.target.value)}
                            placeholder="Digital signature or verification code"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Collect handwritten signature on paper form and enter verification code above for court admissibility
                      </p>
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