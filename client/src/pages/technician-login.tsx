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
  X,
  Camera,
  Star,
  Pen,
  Save
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
  arrivedAt?: string;
  departedAt?: string;
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

  // Additional state for manual time tracking
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");

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

  // Time tracking functions
  const handleClockIn = async () => {
    if (!selectedWorkOrder) return;
    
    try {
      const now = new Date().toISOString();
      const response = await fetch('/api/technician/clock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          workOrderId: selectedWorkOrder.id,
          arrivedAt: now 
        })
      });
      
      if (response.ok) {
        setSelectedWorkOrder({
          ...selectedWorkOrder,
          arrivedAt: now
        });
        toast({ title: "Clocked In", description: "Arrival time recorded" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to clock in", variant: "destructive" });
    }
  };

  const handleClockOut = async () => {
    if (!selectedWorkOrder) return;
    
    try {
      const now = new Date().toISOString();
      const response = await fetch('/api/technician/clock-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          workOrderId: selectedWorkOrder.id,
          departedAt: now 
        })
      });
      
      if (response.ok) {
        setSelectedWorkOrder({
          ...selectedWorkOrder,
          departedAt: now
        });
        toast({ title: "Clocked Out", description: "Departure time recorded" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to clock out", variant: "destructive" });
    }
  };

  const handleTimeTracking = async () => {
    if (!selectedWorkOrder) return;
    
    try {
      const timeData: any = {};
      if (arrivalTime && !selectedWorkOrder.arrivedAt) {
        timeData.arrivedAt = arrivalTime;
      }
      if (departureTime && selectedWorkOrder.arrivedAt && !selectedWorkOrder.departedAt) {
        timeData.departedAt = departureTime;
      }
      
      const response = await fetch('/api/technician/update-time', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          workOrderId: selectedWorkOrder.id,
          ...timeData
        })
      });
      
      if (response.ok) {
        setSelectedWorkOrder({
          ...selectedWorkOrder,
          ...timeData
        });
        toast({ title: "Time Updated", description: "Manual time entry saved" });
        setArrivalTime("");
        setDepartureTime("");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update time", variant: "destructive" });
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
                          {selectedWorkOrder.serviceRequest.selectedServices?.map((service, index) => (
                            <Badge key={index} variant="outline">{service}</Badge>
                          )) || <span className="text-sm text-gray-500">No services specified</span>}
                        </div>
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
                        <Label htmlFor="manualArrivalTime">Manual Arrival Time</Label>
                        <Input
                          id="manualArrivalTime"
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
                        <Label htmlFor="manualDepartureTime">Manual Departure Time</Label>
                        <Input
                          id="manualDepartureTime"
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

              <TabsContent value="photos" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Photo Documentation
                    </CardTitle>
                    <CardDescription>Upload before and after photos of work performed</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="beforePhoto">Before Photo</Label>
                        <Input
                          id="beforePhoto"
                          type="file"
                          accept="image/*"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="afterPhoto">After Photo</Label>
                        <Input
                          id="afterPhoto"
                          type="file"
                          accept="image/*"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="photoDescription">Photo Description</Label>
                      <textarea
                        id="photoDescription"
                        className="w-full mt-1 p-2 border rounded-md"
                        rows={3}
                        placeholder="Describe the work performed and any notable observations..."
                        value={newPhotoDescription}
                        onChange={(e) => setNewPhotoDescription(e.target.value)}
                      />
                    </div>
                    <Button className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photos
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cyst" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      E1T1 Tech Field Technician Service (CYST) Report
                    </CardTitle>
                    <CardDescription>Cybersecurity Support Technician field service documentation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Business Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Business Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="businessName">Business Name</Label>
                          <Input id="businessName" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="businessDescription">Description</Label>
                          <Input id="businessDescription" className="mt-1" />
                        </div>
                      </div>
                      <div>
                        <Label>Type of Business</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                          {[
                            'SMB Gen-Contracting', 'SMB (IT)', 'SMB (Social Impact)', 'Health',
                            'SMB (Accounting/Tax)', 'Education', 'Non-profit (Church)', 'SMB (Food)'
                          ].map((type) => (
                            <label key={type} className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Technician Details */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Technician's Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="techName">Technician Name</Label>
                          <Input id="techName" className="mt-1" defaultValue="tech1" />
                        </div>
                        <div>
                          <Label htmlFor="techContact">Technician Contact Info</Label>
                          <Input id="techContact" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="serviceDate">Date of Service</Label>
                          <Input id="serviceDate" type="date" className="mt-1" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="checkinTime">Check-in Time</Label>
                          <Input id="checkinTime" type="time" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="checkoutTime">Check-out Time</Label>
                          <Input id="checkoutTime" type="time" className="mt-1" />
                        </div>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Service Details</h3>
                      
                      {/* Organization Providing Service */}
                      <div className="space-y-3">
                        <h4 className="font-medium">Organization Providing Service</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="providerName">Name & Address</Label>
                            <textarea id="providerName" className="w-full mt-1 p-2 border rounded-md" rows={2} />
                          </div>
                          <div>
                            <Label htmlFor="providerContact">Contact Info</Label>
                            <Input id="providerContact" className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="providerPerson">Contact Person & Phone</Label>
                            <Input id="providerPerson" className="mt-1" />
                          </div>
                        </div>
                      </div>

                      {/* Organization Receiving Service */}
                      <div className="space-y-3">
                        <h4 className="font-medium">Organization Receiving Service</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="receiverName">Name & Address</Label>
                            <textarea id="receiverName" className="w-full mt-1 p-2 border rounded-md" rows={2} />
                          </div>
                          <div>
                            <Label htmlFor="receiverContact">Contact Info</Label>
                            <Input id="receiverContact" className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="receiverPerson">Contact Person & Phone</Label>
                            <Input id="receiverPerson" className="mt-1" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Service Types and Status */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="serviceTypes">Service Types (Diagnosis, Cabling, etc.)</Label>
                          <Input id="serviceTypes" className="mt-1" />
                        </div>
                        <div>
                          <Label>Completion Status</Label>
                          <select className="w-full mt-1 p-2 border rounded-md">
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Description of Work */}
                    <div>
                      <Label htmlFor="workDescription">Description of Work Done</Label>
                      <textarea 
                        id="workDescription" 
                        className="w-full mt-1 p-2 border rounded-md" 
                        rows={4}
                        placeholder="Detailed description of work performed..."
                      />
                    </div>

                    {/* Service Performed Checkboxes */}
                    <div>
                      <Label>Service Performed</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {[
                          'Diagnosis', 'Cabling', 'Software Installation', 'Network Installation',
                          'Virus Removal', 'Computer Optimization', 'SOS2A', 'Website Encryption',
                          'Threat Modeling', 'Wi-Fi Setup', 'Computer Maintenance'
                        ].map((service) => (
                          <label key={service} className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">{service}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Device Information Table */}
                    <div>
                      <Label>Device Information</Label>
                      <div className="mt-2 overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 p-2 text-left">Device Type</th>
                              <th className="border border-gray-300 p-2 text-left">OS</th>
                              <th className="border border-gray-300 p-2 text-left">Make</th>
                              <th className="border border-gray-300 p-2 text-left">Model</th>
                              <th className="border border-gray-300 p-2 text-left">S/N</th>
                              <th className="border border-gray-300 p-2 text-left">Tagged (Y/N)</th>
                              <th className="border border-gray-300 p-2 text-left">Counts</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[1, 2, 3].map((row) => (
                              <tr key={row}>
                                <td className="border border-gray-300 p-2">
                                  <Input className="w-full border-0" />
                                </td>
                                <td className="border border-gray-300 p-2">
                                  <Input className="w-full border-0" />
                                </td>
                                <td className="border border-gray-300 p-2">
                                  <Input className="w-full border-0" />
                                </td>
                                <td className="border border-gray-300 p-2">
                                  <Input className="w-full border-0" />
                                </td>
                                <td className="border border-gray-300 p-2">
                                  <Input className="w-full border-0" />
                                </td>
                                <td className="border border-gray-300 p-2">
                                  <select className="w-full border-0">
                                    <option>Y</option>
                                    <option>N</option>
                                  </select>
                                </td>
                                <td className="border border-gray-300 p-2">
                                  <Input className="w-full border-0" type="number" />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Follow-up and Manager Sign-off */}
                    <div className="space-y-4">
                      <div>
                        <Label>Follow-up Required?</Label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="followup" value="yes" />
                            <span>Yes</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="followup" value="no" />
                            <span>No</span>
                          </label>
                        </div>
                      </div>

                      {/* Manager Sign-off Section */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Manager on Duty (MOD) Sign-off</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="modName">Manager Name</Label>
                            <Input id="modName" className="mt-1" placeholder="Manager name" />
                          </div>
                          <div>
                            <Label htmlFor="modSignature">Digital Signature</Label>
                            <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                              <Pen className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Manager signature required</p>
                              <Button variant="outline" className="mt-2" size="sm">
                                Capture Signature
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save CYST Report
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Work Details & Equipment
                    </CardTitle>
                    <CardDescription>Document detailed work performed and equipment used</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="workPerformed">Work Performed</Label>
                      <textarea
                        id="workPerformed"
                        className="w-full mt-1 p-2 border rounded-md"
                        rows={4}
                        placeholder="Detailed description of work performed..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="equipmentUsed">Equipment/Parts Used</Label>
                      <textarea
                        id="equipmentUsed"
                        className="w-full mt-1 p-2 border rounded-md"
                        rows={3}
                        placeholder="List equipment, tools, and parts used..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="additionalNotes">Additional Notes</Label>
                      <textarea
                        id="additionalNotes"
                        className="w-full mt-1 p-2 border rounded-md"
                        rows={3}
                        placeholder="Any additional observations or recommendations..."
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="workCompleted"
                        className="rounded"
                      />
                      <Label htmlFor="workCompleted">Mark work as completed</Label>
                    </div>
                    <Button className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Save Work Details
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="feedback" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Client Feedback & Signature
                    </CardTitle>
                    <CardDescription>Collect client satisfaction rating and digital signature</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Service Rating</Label>
                      <div className="flex items-center gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setFeedbackFormData({...feedbackFormData, rating})}
                            className={`p-2 rounded ${
                              feedbackFormData.rating >= rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          >
                            <Star className="h-6 w-6" fill={feedbackFormData.rating >= rating ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {feedbackFormData.rating}/5 stars
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="clientComments">Client Comments</Label>
                      <textarea
                        id="clientComments"
                        className="w-full mt-1 p-2 border rounded-md"
                        rows={3}
                        placeholder="Client feedback and comments..."
                        value={feedbackFormData.comments}
                        onChange={(e) => setFeedbackFormData({...feedbackFormData, comments: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientSignature">Client Signature</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Pen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Digital signature capture would be implemented here</p>
                        <Button variant="outline" className="mt-2">
                          Capture Signature
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Client Feedback
                    </Button>
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