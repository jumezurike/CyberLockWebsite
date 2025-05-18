import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, AlertTriangle, Download, Upload, ChevronLeft, Fingerprint } from 'lucide-react';
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
          <Link href="/sos2a-tool?tab=identity-behavior" className="inline-flex items-center text-blue-600 hover:text-blue-800">
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
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Data Nuclear Aggregate (DNA) Model</h2>
              <p className="text-gray-600">
                The DNA approach forms the foundation of our identity verification system by aggregating all identity data into a comprehensive profile. Government-verified ID creates strong accountability and anchors digital identities to real-world entities.
              </p>
              
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                    </span>
                    <h3 className="font-semibold text-lg">Data Nuclear Aggregate (DNA)</h3>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">DNA PROTECTED</Badge>
                </div>
                <p className="text-sm text-gray-500 mb-8">The comprehensive aggregation of identity data forming a complete digital profile</p>
                
                <div className="relative">
                  {/* Encircling layout with dashed line going around all identity elements */}
                  <div className="relative py-10">
                    <div className="flex flex-col items-center">
                      {/* Container for entire identity visualization with dashed encircling line */}
                      <div className="relative w-full max-w-3xl">
                        {/* Center blue fingerprint element with white edge */}
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                              <Fingerprint className="h-10 w-10 text-indigo-600" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Dashed spinning circle that surrounds everything */}
                        <div className="w-full aspect-square opacity-30 absolute left-0 top-0">
                          <div className="w-full h-full rounded-full border-4 border-dashed border-gray-400 animate-spin-slow"></div>
                        </div>
                      </div>
                      
                      {/* Text content matching reference image exactly */}
                      <div className="text-center mt-32 mb-16">
                        <h3 className="text-xl font-medium mb-1">Universal Digital Identity</h3>
                        <p className="text-sm text-gray-600 max-w-md mx-auto">
                          The DNA forms an immutable, verifiable identity core that combines government-verified credentials with behavioral intelligence.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* First row of boxes - matching reference image exactly */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* We removed connection lines to match the reference image */}
                    {/* Government Identity Verification */}
                    <div className="border rounded-lg p-4 bg-red-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                        </span>
                        <h5 className="font-semibold">Government Identity Verification</h5>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Government ID Type</span>
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Driver's license, state ID, passport, or other official identification</p>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Issuing Authority</span>
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Government entity that issued the identification document</p>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">ID Verification Status</span>
                        </div>
                        <p className="text-xs text-gray-500">Whether the ID has been validated and confirmed</p>
                      </div>
                    </div>
                    
                    {/* Core Identity */}
                    <div className="border rounded-lg p-4 bg-purple-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-purple-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
                        </span>
                        <h5 className="font-semibold">Core Identity</h5>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Full Name</span>
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Legal name as appears on official documents</p>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Identity Type</span>
                        </div>
                        <p className="text-xs text-gray-500">Human, machine, service account, or API classification</p>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Unique Identifier</span>
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Universal ID that persists across all systems</p>
                      </div>
                    </div>
                    
                    {/* Organizational Context */}
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                        </span>
                        <h5 className="font-semibold">Organizational Context</h5>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Department/Team</span>
                        </div>
                        <p className="text-xs text-gray-500">Organizational unit or functional group</p>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Role/Position</span>
                        </div>
                        <p className="text-xs text-gray-500">Job function or service purpose</p>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reporting Hierarchy</span>
                        </div>
                        <p className="text-xs text-gray-500">Management chain and responsibility structure</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* No vertical connector to match reference */}
                  
                  {/* Second row of boxes - matching reference image */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* No connections to match reference image */}
                    
                    {/* Access & Entitlements */}
                    <div className="border rounded-lg p-4 bg-indigo-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-indigo-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                        </span>
                        <h5 className="font-semibold">Access & Entitlements</h5>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Access Level</span>
                        </div>
                        <p className="text-xs text-gray-500">Privilege tier and permission scope</p>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">System Entitlements</span>
                        </div>
                        <p className="text-xs text-gray-500">Specific rights and access grants across systems</p>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Authentication Methods</span>
                        </div>
                        <p className="text-xs text-gray-500">MFA status and credential mechanisms</p>
                      </div>
                    </div>
                    
                    {/* Behavioral Patterns */}
                    <div className="border rounded-lg p-4 bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="13" r="2"/><path d="m20 17-2-2-2 2-2-2"/></svg>
                        </span>
                        <h5 className="font-semibold">Behavioral Patterns</h5>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Access Patterns</span>
                        </div>
                        <p className="text-xs text-gray-500">Typical login hours and behavioral baselines</p>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location Data</span>
                        </div>
                        <p className="text-xs text-gray-500">Normal physical or network access points</p>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Security Posture</span>
                        </div>
                        <p className="text-xs text-gray-500">Compliance with security policies and training</p>
                      </div>
                    </div>
                    
                    {/* Risk Indicators */}
                    <div className="border rounded-lg p-4 bg-amber-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-amber-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8.5 14.5-5-5 5-5"/><path d="m15.5 4.5 5 5-5 5"/><path d="M13 8 8 12"/></svg>
                        </span>
                        <h5 className="font-semibold">Risk Indicators</h5>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Risk Classification</span>
                        </div>
                        <p className="text-xs text-gray-500">Assessment of identity risk level</p>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Anomaly Detection</span>
                        </div>
                        <p className="text-xs text-gray-500">Tracking of unusual behaviors or access patterns</p>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Credential Exposure</span>
                        </div>
                        <p className="text-xs text-gray-500">Records of potential credential compromise events</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Three connected elements - Bottom Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Lifecycle Management */}
                    <div className="border rounded-lg p-4 bg-cyan-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-cyan-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        </span>
                        <h5 className="font-semibold">Lifecycle Management</h5>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Creation & Onboarding</span>
                        </div>
                        <p className="text-xs text-gray-500">Initial provisioning and account creation</p>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Credential Rotation</span>
                        </div>
                        <p className="text-xs text-gray-500">Password changes and certificate renewals</p>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deprovisioning Process</span>
                        </div>
                        <p className="text-xs text-gray-500">Account deactivation and offboarding workflows</p>
                      </div>
                    </div>
                    
                    {/* Visual Identity Verification */}
                    <div className="border rounded-lg p-4 bg-violet-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-violet-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        </span>
                        <h5 className="font-semibold">Visual Identity Verification</h5>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Color-Coded Profile Image</span>
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Non-fungible cryptographically signed profile picture with embedded steganographic data</p>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Image Modification History</span>
                        </div>
                        <p className="text-xs text-gray-500">Immutable record of all changes to visual identity elements</p>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Visual Hash Verification</span>
                        </div>
                        <p className="text-xs text-gray-500">Cryptographic validation of image integrity and authenticity</p>
                      </div>
                    </div>
                    
                    {/* Empty cell to maintain grid balance */}
                    <div className="relative">
                      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                        <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16v.01"/><path d="M12 8v5"/><path d="M21.71 7.29c.18.1.29.29.29.49v8.44c0 .2-.11.39-.29.49l-8 4.5a.5.5 0 0 1-.48 0l-8-4.5A.51.51 0 0 1 5 16.22V7.78c0-.2.11-.39.29-.49l8-4.5a.5.5 0 0 1 .48 0l8 4.5Z"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Continuous Identity Verification Section */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-semibold text-lg mb-4">Continuous Identity Verification</h3>
                <p className="text-sm text-gray-600 mb-6">
                  The DNA continuously verifies all aspects of identity through a multi-layered approach. Government-issued ID creates the strong foundation that anchors the digital identity to a real-world, verifiable entity, enabling powerful accountability throughout the system.
                </p>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-purple-600 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 7v5l2 2"/><path d="M9 17H7"/><path d="M17 17h-2"/></svg>
                    </span>
                    <div>
                      <h4 className="font-semibold mb-2">Color-Coded Non-Fungible Image Verification</h4>
                      <p className="text-sm text-gray-600">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs mr-2">Advanced Security Feature:</span>  
                        All identity profiles must include a color-coded non-fungible profile image that contains hidden encrypted data using steganography. This creates a cryptographically unique visual identifier that cannot be duplicated or transferred between identities. The embedded data can only be detected and verified through a specialized decryption process.
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        All image changes are permanently recorded in an immutable ledger, creating a complete audit trail of visual identity modifications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* User Identity Template Section */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-semibold text-lg mb-4">User Identity Template</h3>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Universal Identity Template</h4>
                  <Button variant="outline" size="sm" className="bg-blue-50 border-blue-200 text-blue-700">
                    Download Template
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Standard CSV format for importing all identity types into the UIVS platform
                </p>
                
                <div className="border rounded-lg overflow-hidden mb-6">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <div className="flex gap-4">
                      <div className="border-b-2 border-blue-500 px-3 py-2 text-blue-600 font-medium text-sm">
                        Template Structure
                      </div>
                      <div className="px-3 py-2 text-gray-500 font-medium text-sm">
                        Best Practices
                      </div>
                      <div className="px-3 py-2 text-gray-500 font-medium text-sm">
                        Example Identities
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Example</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 text-sm">
                        <tr>
                          <td className="px-6 py-2 font-medium">user_id</td>
                          <td className="px-6 py-2 text-gray-500">Unique identifier for the user or identity</td>
                          <td className="px-6 py-2 text-gray-500">EMP001, SVC001</td>
                          <td className="px-6 py-2 text-blue-600">Required</td>
                          <td className="px-6 py-2">Basic Info</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-2 font-medium">first_name</td>
                          <td className="px-6 py-2 text-gray-500">First name for human users or service name for non-human identities</td>
                          <td className="px-6 py-2 text-gray-500">John, Backup</td>
                          <td className="px-6 py-2 text-blue-600">Required</td>
                          <td className="px-6 py-2">Basic Info</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-2 font-medium">last_name</td>
                          <td className="px-6 py-2 text-gray-500">Last name for human users or service identifier for non-human identities</td>
                          <td className="px-6 py-2 text-gray-500">Smith, Service</td>
                          <td className="px-6 py-2 text-blue-600">Required</td>
                          <td className="px-6 py-2">Basic Info</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-2 font-medium">email</td>
                          <td className="px-6 py-2 text-gray-500">Email address or notification endpoint</td>
                          <td className="px-6 py-2 text-gray-500">john.smith@example.com</td>
                          <td className="px-6 py-2 text-blue-600">Required</td>
                          <td className="px-6 py-2">Basic Info</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-2 font-medium">role</td>
                          <td className="px-6 py-2 text-gray-500">Job role or service function</td>
                          <td className="px-6 py-2 text-gray-500">IT Manager, Automated Process</td>
                          <td className="px-6 py-2 text-blue-600">Required</td>
                          <td className="px-6 py-2">Basic Info</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-2 font-medium">department</td>
                          <td className="px-6 py-2 text-gray-500">Department or functional area</td>
                          <td className="px-6 py-2 text-gray-500">Information Technology, Finance</td>
                          <td className="px-6 py-2 text-blue-600">Required</td>
                          <td className="px-6 py-2">Basic Info</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Additional Templates */}
                <h4 className="font-semibold mb-3">Additional Templates</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Download specialized templates for different identity management needs
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between mb-1">
                      <h5 className="font-medium">Machine Identity Template</h5>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        Download
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Specialized template for tracking machine identities with IMEI, serial numbers, UIDs and hardware details.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between mb-1">
                      <h5 className="font-medium">Third-Party Vendor Template</h5>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        Download
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Template for managing external vendor access and third-party relationships.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between mb-1">
                      <h5 className="font-medium">API Identity Template</h5>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        Download
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Template for tracking API keys, service tokens, UUIDs, and source system identifiers.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between mb-1">
                      <h5 className="font-medium">Identity-Device Mapping Template</h5>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        Download
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Map users to authorized devices for comprehensive access control.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}