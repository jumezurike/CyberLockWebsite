import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, AlertTriangle, Info, Shield, MapPin, Key, Clock, Filter } from 'lucide-react';
import { Link } from 'wouter';

interface SecurityEvent {
  id: string;
  type: 'Unusual Login Location' | 'Privileged Access' | 'Failed Authentication' | 'Account Lockout' | 'Password Change';
  severity: 'Info' | 'Warning' | 'High' | 'Critical';
  description: string;
  user: string;
  userId: string;
  timestamp: string;
  location?: string;
  ipAddress?: string;
  details: string;
}

const securityEvents: SecurityEvent[] = [
  {
    id: '1',
    type: 'Unusual Login Location',
    severity: 'Warning',
    description: 'Sarah Johnson (EMP002) logged in from an unusual location - New York, NY',
    user: 'Sarah Johnson',
    userId: 'EMP002',
    timestamp: '2025-05-12 08:42:13',
    location: 'New York, NY',
    ipAddress: '192.168.1.100',
    details: 'Login detected from geographic location outside normal pattern'
  },
  {
    id: '2',
    type: 'Privileged Access',
    severity: 'Info',
    description: 'John Smith (EMP001) escalated privileges on Finance Database',
    user: 'John Smith',
    userId: 'EMP001',
    timestamp: '2025-05-11 14:37:22',
    details: 'Administrative access granted to financial systems'
  },
  {
    id: '3',
    type: 'Failed Authentication',
    severity: 'High',
    description: 'Multiple failed login attempts for API001 from unauthorized IP',
    user: 'API Service Account',
    userId: 'API001',
    timestamp: '2025-05-10 23:15:51',
    ipAddress: '203.0.113.0',
    details: '5 consecutive failed authentication attempts detected'
  },
  {
    id: '4',
    type: 'Account Lockout',
    severity: 'Critical',
    description: 'Account EMP003 locked due to suspicious activity',
    user: 'Michael Brown',
    userId: 'EMP003',
    timestamp: '2025-05-10 16:20:30',
    details: 'Account automatically locked after security policy violation'
  },
  {
    id: '5',
    type: 'Password Change',
    severity: 'Info',
    description: 'Password updated for user EMP002',
    user: 'Sarah Johnson',
    userId: 'EMP002',
    timestamp: '2025-05-09 10:15:45',
    details: 'User-initiated password change completed successfully'
  }
];

export default function SecurityEvents() {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Info': return <Info className="h-4 w-4" />;
      case 'Warning': return <AlertTriangle className="h-4 w-4" />;
      case 'High': return <AlertTriangle className="h-4 w-4" />;
      case 'Critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Unusual Login Location': return <MapPin className="h-5 w-5 text-yellow-600" />;
      case 'Privileged Access': return <Shield className="h-5 w-5 text-blue-600" />;
      case 'Failed Authentication': return <Key className="h-5 w-5 text-red-600" />;
      case 'Account Lockout': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'Password Change': return <Key className="h-5 w-5 text-green-600" />;
      default: return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredEvents = securityEvents.filter(event => {
    const severityMatch = severityFilter === 'all' || event.severity === severityFilter;
    const typeMatch = typeFilter === 'all' || event.type === typeFilter;
    return severityMatch && typeMatch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="p-6">
        <div className="mb-6">
          <Link href="/identity-management" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Identity Management
          </Link>
          
          <h1 className="text-3xl font-bold mt-2">Recent Activities</h1>
          <p className="text-gray-600 mt-1">
            Latest identity-related security events
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Event Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Severity</label>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="Info">Info</SelectItem>
                    <SelectItem value="Warning">Warning</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Unusual Login Location">Unusual Login Location</SelectItem>
                    <SelectItem value="Privileged Access">Privileged Access</SelectItem>
                    <SelectItem value="Failed Authentication">Failed Authentication</SelectItem>
                    <SelectItem value="Account Lockout">Account Lockout</SelectItem>
                    <SelectItem value="Password Change">Password Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>Security Events ({filteredEvents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div key={event.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded-lg border">
                        {getEventIcon(event.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{event.type}</h3>
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(event.severity)}>
                      <div className="flex items-center space-x-1">
                        {getSeverityIcon(event.severity)}
                        <span>{event.severity}</span>
                      </div>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium mb-1">User</p>
                      <p className="font-semibold">{event.user}</p>
                      <p className="text-gray-600">({event.userId})</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 font-medium mb-1">Timestamp</p>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{event.timestamp}</span>
                      </div>
                    </div>
                    
                    {event.location && (
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Location</p>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    )}
                    
                    {event.ipAddress && (
                      <div>
                        <p className="text-gray-500 font-medium mb-1">IP Address</p>
                        <span className="font-mono text-sm">{event.ipAddress}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-gray-500 font-medium mb-1">Details</p>
                    <p className="text-gray-700">{event.details}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No events found matching the selected filters.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSeverityFilter('all');
                    setTypeFilter('all');
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}