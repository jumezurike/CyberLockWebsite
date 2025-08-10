import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, Eye, User, Clock, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ServiceTicket {
  id: number;
  ticketNumber: string;
  serviceRequestId: number;
  workOrderId?: number;
  stateCode: string;
  cityCode: string;
  ticketDate: string;
  companyCode: string;
  chronologicalNumber: number;
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'closed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTechnicianId?: number;
  assignedAt?: string;
  completedAt?: string;
  clientCompanyName: string;
  clientLocation: string;
  serviceDescription?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  assigned: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  critical: 'bg-red-100 text-red-600'
};

export function TicketManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<ServiceTicket | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all tickets
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['/api/tickets'],
    queryFn: () => apiRequest('/api/tickets') as Promise<ServiceTicket[]>
  });

  // Fetch technicians for assignment
  const { data: technicians = [] } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: () => apiRequest('/api/admin/users') as Promise<any[]>
  });

  // Update ticket status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ ticketId, status }: { ticketId: number; status: string }) =>
      apiRequest(`/api/tickets/${ticketId}/status`, 'PATCH', { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      toast({ title: 'Success', description: 'Ticket status updated successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update ticket status' });
    }
  });

  // Assign technician mutation
  const assignTechnicianMutation = useMutation({
    mutationFn: ({ ticketId, technicianId }: { ticketId: number; technicianId: number }) =>
      apiRequest(`/api/tickets/${ticketId}/assign`, 'PATCH', { technicianId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      toast({ title: 'Success', description: 'Technician assigned successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to assign technician' });
    }
  });

  // Filter tickets based on search query and filters
  const filteredTickets = (tickets as ServiceTicket[]).filter((ticket: ServiceTicket) => {
    const matchesSearch = searchQuery === '' || 
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.clientCompanyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.chronologicalNumber.toString().includes(searchQuery);
    
    const matchesStatus = statusFilter === '' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === '' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => (
    <Badge className={statusColors[status as keyof typeof statusColors]}>
      {status.replace('_', ' ').toUpperCase()}
    </Badge>
  );

  const getPriorityBadge = (priority: string) => (
    <Badge variant="outline" className={priorityColors[priority as keyof typeof priorityColors]}>
      {priority.toUpperCase()}
    </Badge>
  );

  const handleStatusChange = (ticketId: number, status: string) => {
    updateStatusMutation.mutate({ ticketId, status });
  };

  const handleTechnicianAssignment = (ticketId: number, technicianId: number) => {
    assignTechnicianMutation.mutate({ ticketId, technicianId });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Tickets</h1>
          <p className="text-gray-600">Manage and track service tickets with automated naming convention</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tickets or chronological number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setStatusFilter('');
                setPriorityFilter('');
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Grid */}
      <div className="grid gap-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Filter className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
              <p className="text-gray-600">
                {searchQuery || statusFilter || priorityFilter 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first service ticket to get started'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket: ServiceTicket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{ticket.ticketNumber}</h3>
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Company</p>
                        <p className="font-medium">{ticket.clientCompanyName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Location</p>
                        <p className="font-medium">{ticket.clientLocation}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Chronological #</p>
                        <p className="font-medium text-lg">#{ticket.chronologicalNumber.toString().padStart(2, '0')}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Created</p>
                        <p className="font-medium">{formatDate(ticket.createdAt)}</p>
                      </div>
                    </div>

                    {ticket.serviceDescription && (
                      <div className="mt-3">
                        <p className="text-gray-500 text-sm">Service Description</p>
                        <p className="text-sm mt-1">{ticket.serviceDescription}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Ticket Details - {ticket.ticketNumber}</DialogTitle>
                          <DialogDescription>
                            Comprehensive ticket information and management options
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Status</Label>
                              <Select 
                                value={ticket.status} 
                                onValueChange={(status) => handleStatusChange(ticket.id, status)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="open">Open</SelectItem>
                                  <SelectItem value="assigned">Assigned</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Assigned Technician</Label>
                              <Select 
                                value={ticket.assignedTechnicianId?.toString() || ""} 
                                onValueChange={(techId) => handleTechnicianAssignment(ticket.id, parseInt(techId))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select technician" />
                                </SelectTrigger>
                                <SelectContent>
                                  {technicians.filter((tech: any) => tech.role === 'admin').map((tech: any) => (
                                    <SelectItem key={tech.id} value={tech.id.toString()}>
                                      {tech.fullName || tech.username}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Internal Notes</Label>
                            <Textarea 
                              placeholder="Add internal notes..."
                              value={ticket.internalNotes || ''}
                              className="min-h-20"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="text-gray-500">Service Request ID</Label>
                              <p>{ticket.serviceRequestId}</p>
                            </div>
                            <div>
                              <Label className="text-gray-500">Work Order ID</Label>
                              <p>{ticket.workOrderId || 'Not assigned'}</p>
                            </div>
                            <div>
                              <Label className="text-gray-500">Created Date</Label>
                              <p>{formatDate(ticket.createdAt)}</p>
                            </div>
                            <div>
                              <Label className="text-gray-500">Last Updated</Label>
                              <p>{formatDate(ticket.updatedAt)}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {ticket.status === 'open' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusChange(ticket.id, 'assigned')}
                        disabled={updateStatusMutation.isPending}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Assign
                      </Button>
                    )}

                    {ticket.status === 'assigned' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusChange(ticket.id, 'in_progress')}
                        disabled={updateStatusMutation.isPending}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Start Work
                      </Button>
                    )}

                    {ticket.status === 'in_progress' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusChange(ticket.id, 'completed')}
                        disabled={updateStatusMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {['open', 'assigned', 'in_progress', 'completed', 'closed', 'cancelled'].map(status => {
          const count = (tickets as ServiceTicket[]).filter((t: ServiceTicket) => t.status === status).length;
          return (
            <Card key={status}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}