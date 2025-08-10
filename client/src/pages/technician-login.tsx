import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Wrench, 
  Shield, 
  User, 
  ArrowRight, 
  CheckCircle, 
  Mail, 
  Phone,
  FileText,
  Clock,
  AlertTriangle,
  Loader2,
  Building,
  Upload,
  Plus,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Types
interface ServiceRequest {
  id: number;
  companyName: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  projectDetails: string;
  selectedServices: string[];
  totalCost: number;
  status: string;
  createdAt: string;
}

interface WorkOrder {
  id: number;
  serviceRequestId: number;
  technicianId: number;
  status: string;
  assignedAt: string;
  startedAt?: string;
  completedAt?: string;
  workCompleted: boolean;
  workDescription?: string;
  hoursWorked?: number;
  totalHoursWorked?: number;
  createdAt: string;
  updatedAt: string;
  serviceRequest?: ServiceRequest;
}

interface TimeEntry {
  id: number;
  workOrderId: number;
  technicianId: number;
  startTime: string;
  endTime?: string;
  description: string;
  duration?: number;
  createdAt: string;
}

interface Photo {
  id: number;
  workOrderId: number;
  technicianId: number;
  filename: string;
  description: string;
  createdAt: string;
}

interface CYSTReport {
  id: number;
  workOrderId: number;
  technicianId: number;
  beforeDescription: string;
  duringDescription: string;
  afterDescription: string;
  createdAt: string;
  updatedAt: string;
}

interface ClientFeedback {
  id: number;
  workOrderId: number;
  technicianId: number;
  rating: number;
  comments?: string;
  clientSignature?: string;
  createdAt: string;
}

export default function TechnicianLogin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [filteredWorkOrders, setFilteredWorkOrders] = useState<WorkOrder[]>([]);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Time tracking state
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [newTimeDescription, setNewTimeDescription] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Photos state
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [newPhotoDescription, setNewPhotoDescription] = useState('');
  
  // CYST Report state
  const [cystReport, setCystReport] = useState<CYSTReport | null>(null);
  const [cystFormData, setCystFormData] = useState({
    beforeDescription: '',
    duringDescription: '',
    afterDescription: ''
  });
  
  // Client feedback state
  const [clientFeedback, setClientFeedback] = useState<ClientFeedback | null>(null);
  const [feedbackFormData, setFeedbackFormData] = useState({
    rating: 5,
    comments: '',
    clientSignature: ''
  });

  const { toast } = useToast();

  // Authentication check on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredWorkOrders(workOrders);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = workOrders.filter(order => {
      const workOrderNumber = getCanonicalWorkOrderNumber(order.id).toLowerCase();
      const companyName = order.serviceRequest?.companyName?.toLowerCase() || '';
      const contactName = order.serviceRequest?.contactPersonName?.toLowerCase() || '';
      const status = order.status.toLowerCase();
      
      return workOrderNumber.includes(query) ||
             companyName.includes(query) ||
             contactName.includes(query) ||
             status.includes(query);
    });
    
    setFilteredWorkOrders(filtered);
  }, [searchQuery, workOrders]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/technician/me');
      if (response.ok) {
        setIsAuthenticated(true);
        loadWorkOrders();
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
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
        toast({
          title: "Login Successful", 
          description: "Welcome to the Technician Portal!"
        });
        setIsAuthenticated(true);
        loadWorkOrders();
      } else {
        const error = await response.json();
        toast({
          title: "Login Failed",
          description: error.error || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: "Connection failed",
        variant: "destructive"
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
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const loadWorkOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/technician/work-orders');
      if (!response.ok) {
        throw new Error('Failed to fetch work orders');
      }
      const orders: WorkOrder[] = await response.json();
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
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadWorkOrderData = async (workOrder: WorkOrder) => {
    // Load all related data for the selected work order
    try {
      // Load time entries, photos, CYST report, and feedback
      // This would be implemented with actual API calls
    } catch (error) {
      console.error('Error loading work order data:', error);
    }
  };

  const getCanonicalWorkOrderNumber = (id: number) => {
    return `WO-${String(id).padStart(4, '0')}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      assigned: { color: 'bg-blue-500', label: 'Assigned' },
      started: { color: 'bg-yellow-500', label: 'In Progress' },
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
            <CardTitle>Technician Portal</CardTitle>
            <CardDescription>Enter your credentials to access work orders</CardDescription>
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
                          <p className="mt-1">{selectedWorkOrder.serviceRequest.companyName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Contact Person</Label>
                          <p className="mt-1">{selectedWorkOrder.serviceRequest.contactPersonName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Email</Label>
                          <p className="mt-1">{selectedWorkOrder.serviceRequest.contactPersonEmail}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Phone</Label>
                          <p className="mt-1">{selectedWorkOrder.serviceRequest.contactPersonPhone}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Project Details</Label>
                        <p className="mt-1">{selectedWorkOrder.serviceRequest.projectDetails}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Selected Services</Label>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {selectedWorkOrder.serviceRequest.selectedServices.map((service, index) => (
                            <Badge key={index} variant="outline">{service}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="tracking">
                <Card>
                  <CardHeader>
                    <CardTitle>Time Tracking</CardTitle>
                    <CardDescription>Track arrival, departure, and work duration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">Time tracking functionality would be implemented here</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="photos">
                <Card>
                  <CardHeader>
                    <CardTitle>Photo Documentation</CardTitle>
                    <CardDescription>Upload before and after photos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">Photo upload functionality would be implemented here</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cyst">
                <Card>
                  <CardHeader>
                    <CardTitle>CYST Report</CardTitle>
                    <CardDescription>Create comprehensive service report</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">CYST report functionality would be implemented here</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Work Details</CardTitle>
                    <CardDescription>Document work performed and equipment used</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">Work details functionality would be implemented here</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="feedback">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Feedback</CardTitle>
                    <CardDescription>Collect client signature and feedback</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">Feedback collection functionality would be implemented here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Work Order Selected</h3>
                  <p className="text-gray-500">Select a work order from the list to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}