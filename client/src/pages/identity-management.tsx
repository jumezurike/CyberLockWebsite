import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, AlertTriangle, Download, Upload, ChevronLeft } from 'lucide-react';
import { Link } from 'wouter';

// Sample data for demonstration purposes
const identitiesData = [
  {
    id: 'EMP001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'IT Manager',
    department: 'Information Technology',
    type: 'human',
    accessLevel: 'privileged',
    lastActive: '2025-05-01',
    riskLevel: 'low'
  },
  {
    id: 'EMP002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'Finance Director',
    department: 'Finance',
    type: 'human',
    accessLevel: 'admin',
    lastActive: '2025-05-11',
    riskLevel: 'high'
  },
  {
    id: 'SVC001',
    name: 'Backup Service',
    email: 'backup-service@system.internal',
    role: 'Automated Process',
    department: 'Operations',
    type: 'machine',
    accessLevel: 'standard',
    lastActive: '2025-05-12',
    riskLevel: 'medium'
  },
  {
    id: 'API001',
    name: 'Payment Gateway',
    email: 'api-monitor@example.com',
    role: 'External Service',
    department: 'Finance',
    type: 'api',
    accessLevel: 'limited',
    lastActive: '2025-05-10',
    riskLevel: 'high'
  },
  {
    id: 'VEN001',
    name: 'Tech Support Inc.',
    email: 'support@techsupport.example.com',
    role: 'Technical Support',
    department: 'External',
    type: 'third-party',
    accessLevel: 'limited',
    lastActive: '2025-04-30',
    riskLevel: 'medium'
  }
];

// Recent activities data
const recentActivities = [
  {
    id: 1,
    type: 'Unusual Login Location',
    details: 'Sarah Johnson (EMP002) logged in from an unusual location - New York, NY',
    timestamp: '2025-05-12 08:42:13',
    severity: 'warning'
  },
  {
    id: 2,
    type: 'Privileged Access',
    details: 'John Smith (EMP001) escalated privileges on Finance Database',
    timestamp: '2025-05-11 14:37:22',
    severity: 'info'
  },
  {
    id: 3,
    type: 'Failed Authentication',
    details: 'Multiple failed login attempts for API001 from unauthorized IP',
    timestamp: '2025-05-10 23:15:51',
    severity: 'high'
  }
];

export default function IdentityManagement() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Count high risk identities
  const highRiskCount = identitiesData.filter(id => id.riskLevel === 'high').length;
  
  // Count by identity type
  const humanCount = identitiesData.filter(id => id.type === 'human').length;
  const machineCount = identitiesData.filter(id => id.type === 'machine').length;
  const apiCount = identitiesData.filter(id => id.type === 'api').length;
  const thirdPartyCount = identitiesData.filter(id => id.type === 'third-party').length;
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="p-6">
        <div className="mb-6">
          <Link href="/sos2a-tool" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Assessment
          </Link>
          
          <h1 className="text-3xl font-bold mt-2">Identity Management</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all identity types across your organization using our patented Universal Identity Verification System (UIVS).
          </p>
        </div>
        
        <Tabs defaultValue="dashboard" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 bg-gray-100">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="identities">Identities</TabsTrigger>
            <TabsTrigger value="import-export">Import / Export</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Identities Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-3">
                    <h3 className="font-medium text-gray-500">Total Identities</h3>
                    <p className="text-sm text-gray-500">All managed identities</p>
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-blue-500 mr-3" />
                      <span className="text-3xl font-bold">{identitiesData.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* High Risk Identities Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-3">
                    <h3 className="font-medium text-gray-500">High Risk Identities</h3>
                    <p className="text-sm text-gray-500">Require attention</p>
                    <div className="flex items-center">
                      <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
                      <span className="text-3xl font-bold">{highRiskCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Identity Types Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-3">
                    <h3 className="font-medium text-gray-500">Identity Types</h3>
                    <p className="text-sm text-gray-500">Distribution by category</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-500">{humanCount} Human</Badge>
                      <Badge className="bg-gray-500">{machineCount} Machine</Badge>
                      <Badge className="bg-purple-500">{apiCount} API</Badge>
                      <Badge className="bg-orange-500">{thirdPartyCount} Third-Party</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activities Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-4">
                  <h3 className="font-medium text-gray-500">Recent Activities</h3>
                  <p className="text-sm text-gray-500">Latest identity-related security events</p>
                  
                  <div className="space-y-4">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="border-l-4 pl-4 py-2" 
                        style={{ 
                          borderColor: activity.severity === 'high' ? 'rgb(239, 68, 68)' : 
                                      activity.severity === 'warning' ? 'rgb(245, 158, 11)' : 
                                      'rgb(59, 130, 246)'
                        }}>
                        <div className="flex justify-between">
                          <h4 className="font-medium">{activity.type}</h4>
                          <Badge 
                            className={
                              activity.severity === 'high' ? 'bg-red-500' :
                              activity.severity === 'warning' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }
                          >
                            {activity.severity.charAt(0).toUpperCase() + activity.severity.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm mt-1">{activity.details}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Identities Tab */}
          <TabsContent value="identities">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between mb-4">
                  <h3 className="font-medium text-gray-500">Managed Identities</h3>
                  <Button size="sm">Add New Identity</Button>
                </div>
                
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Access Level</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {identitiesData.map(identity => (
                        <TableRow key={identity.id}>
                          <TableCell className="font-medium">{identity.id}</TableCell>
                          <TableCell>{identity.name}</TableCell>
                          <TableCell>
                            <Badge className={
                              identity.type === 'human' ? 'bg-blue-500' :
                              identity.type === 'machine' ? 'bg-gray-500' :
                              identity.type === 'api' ? 'bg-purple-500' :
                              'bg-orange-500'
                            }>
                              {identity.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{identity.department}</TableCell>
                          <TableCell>{identity.accessLevel}</TableCell>
                          <TableCell>{identity.lastActive}</TableCell>
                          <TableCell>
                            <Badge className={
                              identity.riskLevel === 'low' ? 'bg-green-500' :
                              identity.riskLevel === 'medium' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }>
                              {identity.riskLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Import / Export Tab */}
          <TabsContent value="import-export">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-8">
                  {/* Import Identities Section */}
                  <div>
                    <h3 className="text-xl font-medium mb-2">Import Identities</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Import user identities from a CSV file. Use our template for the correct format.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Upload CSV File</p>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm">Choose File</Button>
                          <span className="text-sm text-gray-500">No file chosen</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="ml-auto"
                            onClick={() => {
                              // Download template functionality
                              const csvHeader = "user_id,first_name,last_name,email,role,department,identity_type,access_level,government_id_type,government_id_issuing_authority,mfa_enabled,mfa_type,location,manager,employment_status,last_password_change,last_security_training,system_access,typical_login_hours,login_anomaly_threshold,inactive_account_days,credential_exposure_check,session_timeout_minutes,privilege_escalation_alerts,federation_source";
                              
                              const sampleData = [
                                "EMP001,John,Smith,john.smith@example.com,IT Manager,Information Technology,human,privileged,drivers_license,NY-DMV,yes,app+sms,Headquarters,jane.doe@example.com,Full Time,2025-04-15,2025-03-01,\"ERP, CRM, IT Admin Portal\",9:00-17:00,medium,30,yes,60,yes,Active Directory",
                                "EMP002,Sarah,Johnson,sarah.johnson@example.com,Finance Director,Finance,human,admin,state_id,CA-DMV,yes,hardware,Headquarters,executive@example.com,Full Time,2025-04-20,2025-03-01,\"ERP, Finance Portal, Expense System\",8:00-18:00,high,30,yes,30,yes,Okta SSO",
                                "SVC001,Backup,Service,backup-service@system.internal,Automated Process,Operations,machine,standard,not_applicable,not_applicable,no,,Data Center,john.smith@example.com,System,2025-01-15,N/A,\"Backup System, Storage Access\",,low,365,no,0,yes,Local",
                                "API001,Payment,Gateway,api-monitor@example.com,External Service,Finance,api,limited,not_applicable,not_applicable,yes,api-key,Cloud,sarah.johnson@example.com,Service,2025-03-30,N/A,\"Payment Processing System\",,high,90,yes,15,yes,AWS IAM",
                                "VEN001,Tech Support,Inc.,support@techsupport.example.com,Technical Support,External,third-party,limited,passport,US-State-Dept,yes,app,Remote,john.smith@example.com,Vendor,2025-04-01,2025-02-15,\"Ticketing System, Knowledge Base\",9:00-20:00,medium,45,yes,20,yes,External IDP"
                              ];
                              
                              const csvContent = [csvHeader, ...sampleData].join('\n');
                              
                              const blob = new Blob([csvContent], { type: 'text/csv' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = 'user-identity-template.csv';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            Get Template
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Import Rules</h4>
                        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                          <li>The CSV file must follow the template format</li>
                          <li>First row must contain column headers</li>
                          <li>User IDs must be unique</li>
                          <li>Required fields: User ID, First Name, Last Name, Email, Identity Type</li>
                          <li>For machine identities, provide: contact owner, IMEI, serial number, and unique identifier (UID)</li>
                          <li>For API identities, include: contact owner, token ID, and source system information</li>
                          <li>For human identities, government ID fields are required for DNA integration</li>
                          <li>Government ID information will be validated during import</li>
                        </ul>
                      </div>
                      
                      <Button className="w-full sm:w-auto" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload and Import
                      </Button>
                    </div>
                  </div>
                  
                  {/* Export Identities Section */}
                  <div className="border-t pt-8">
                    <h3 className="text-xl font-medium mb-2">Export Identities</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Export your DDNA repository data to a CSV file for backup or analysis.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Export Options</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <Button variant="outline" size="sm">Export All Identities</Button>
                          <Button variant="outline" size="sm">Export Human Users</Button>
                          <Button variant="outline" size="sm">Export Machine Identities</Button>
                          <Button variant="outline" size="sm">Export Third-Party Access</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Templates Tab */}
          <TabsContent value="templates">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium text-gray-500 mb-4">Identity Templates</h3>
                
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Standard User Template</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Basic template for standard employee accounts with normal access privileges
                    </p>
                    <div className="flex gap-2">
                      <Badge>Human</Badge>
                      <Badge variant="outline">Standard Access</Badge>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">Use Template</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Privileged Admin Template</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Template for IT administrators with elevated system privileges
                    </p>
                    <div className="flex gap-2">
                      <Badge>Human</Badge>
                      <Badge variant="destructive">Privileged Access</Badge>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">Use Template</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Service Account Template</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Template for automated service accounts with specific access scopes
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Machine</Badge>
                      <Badge variant="outline">Limited Access</Badge>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">Use Template</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">API Integration Template</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Template for API connections with proper authentication settings
                    </p>
                    <div className="flex gap-2">
                      <Badge className="bg-purple-500">API</Badge>
                      <Badge variant="outline">Limited Access</Badge>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">Use Template</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">Vendor Access Template</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Template for third-party vendor accounts with restricted permissions
                    </p>
                    <div className="flex gap-2">
                      <Badge className="bg-orange-500">Third-Party</Badge>
                      <Badge variant="outline">Limited Access</Badge>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">Use Template</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}