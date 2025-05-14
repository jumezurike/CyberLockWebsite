import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Shield, Download, Upload, UserPlus, FileText, AlertTriangle } from 'lucide-react';
import UserIdentityTemplate from '@/components/identity-behavior/user-identity-template';

// Sample identity data for display purposes
const sampleIdentities = [
  {
    id: 'EMP001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'IT Manager',
    department: 'Information Technology',
    type: 'human',
    accessLevel: 'privileged',
    mfaEnabled: true,
    lastActive: '2025-05-01',
    riskScore: 'low'
  },
  {
    id: 'EMP002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'Finance Director',
    department: 'Finance',
    type: 'human',
    accessLevel: 'admin',
    mfaEnabled: true,
    lastActive: '2025-05-11',
    riskScore: 'low'
  },
  {
    id: 'SVC001',
    name: 'Backup Service',
    email: 'backup-service@system.internal',
    role: 'Automated Process',
    department: 'Operations',
    type: 'machine',
    accessLevel: 'standard',
    mfaEnabled: false,
    lastActive: '2025-05-12',
    riskScore: 'medium'
  },
  {
    id: 'API001',
    name: 'Payment Gateway',
    email: 'api-monitor@example.com',
    role: 'External Service',
    department: 'Finance',
    type: 'api',
    accessLevel: 'limited',
    mfaEnabled: true,
    lastActive: '2025-05-10',
    riskScore: 'medium'
  },
  {
    id: 'VEN001',
    name: 'Tech Support Inc.',
    email: 'support@techsupport.example.com',
    role: 'Technical Support',
    department: 'External',
    type: 'third-party',
    accessLevel: 'limited',
    mfaEnabled: true,
    lastActive: '2025-04-30',
    riskScore: 'high'
  }
];

export default function IdentityManagement() {
  // Function to download the CSV template
  const downloadTemplate = () => {
    // The content includes the header and sample data
    const csvHeader = "user_id,first_name,last_name,email,role,department,identity_type,access_level,government_id_type,government_id_issuing_authority,mfa_enabled,mfa_type,location,manager,employment_status,last_password_change,last_security_training,system_access,typical_login_hours,login_anomaly_threshold,inactive_account_days,credential_exposure_check,session_timeout_minutes,privilege_escalation_alerts,federation_source";
    
    // Sample data rows provided in the template
    const sampleData = [
      "EMP001,John,Smith,john.smith@example.com,IT Manager,Information Technology,human,privileged,drivers_license,NY-DMV,yes,app+sms,Headquarters,jane.doe@example.com,Full Time,2025-04-15,2025-03-01,\"ERP, CRM, IT Admin Portal\",9:00-17:00,medium,30,yes,60,yes,Active Directory",
      "EMP002,Sarah,Johnson,sarah.johnson@example.com,Finance Director,Finance,human,admin,state_id,CA-DMV,yes,hardware,Headquarters,executive@example.com,Full Time,2025-04-20,2025-03-01,\"ERP, Finance Portal, Expense System\",8:00-18:00,high,30,yes,30,yes,Okta SSO",
      "SVC001,Backup,Service,backup-service@system.internal,Automated Process,Operations,machine,standard,not_applicable,not_applicable,no,,Data Center,john.smith@example.com,System,2025-01-15,N/A,\"Backup System, Storage Access\",,low,365,no,0,yes,Local",
      "API001,Payment,Gateway,api-monitor@example.com,External Service,Finance,api,limited,not_applicable,not_applicable,yes,api-key,Cloud,sarah.johnson@example.com,Service,2025-03-30,N/A,\"Payment Processing System\",,high,90,yes,15,yes,AWS IAM",
      "VEN001,Tech Support,Inc.,support@techsupport.example.com,Technical Support,External,third-party,limited,passport,US-State-Dept,yes,app,Remote,john.smith@example.com,Vendor,2025-04-01,2025-02-15,\"Ticketing System, Knowledge Base\",9:00-20:00,medium,45,yes,20,yes,External IDP"
    ];
    
    const csvContent = [csvHeader, ...sampleData].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user-identity-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // In a real implementation, this would process the CSV file
    console.log('File upload triggered', event.target.files?.[0]?.name);
    alert('File upload functionality would be implemented here');
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Users className="mr-2 h-8 w-8 text-blue-600" />
              Universal Identity Verification System
            </h1>
            <p className="text-gray-500 mt-1">
              Centralized management for human, machine, API, and third-party identities
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={downloadTemplate} variant="outline" className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import Identities
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </Button>
            <Button className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Identity
            </Button>
          </div>
        </div>
        
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Identity Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Human Users</span>
                  <Badge>2</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Machine Identities</span>
                  <Badge variant="outline">1</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>API Identities</span>
                  <Badge variant="secondary">1</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Third-Party</span>
                  <Badge variant="destructive">1</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Access Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Standard</span>
                  <Badge>1</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Limited</span>
                  <Badge variant="outline">2</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Admin</span>
                  <Badge variant="secondary">1</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Privileged</span>
                  <Badge variant="destructive">1</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Security Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>MFA Enabled</span>
                  <Badge className="bg-green-500">4</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>MFA Disabled</span>
                  <Badge variant="destructive">1</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Password Expired</span>
                  <Badge variant="outline">0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Security Training Due</span>
                  <Badge variant="secondary">2</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Low Risk</span>
                  <Badge className="bg-green-500">2</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Medium Risk</span>
                  <Badge className="bg-yellow-500">2</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>High Risk</span>
                  <Badge className="bg-red-500">1</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Critical Risk</span>
                  <Badge variant="destructive">0</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Identity Management Interface */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Identity Management</CardTitle>
            <CardDescription>
              View and manage all identities across your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Identities</TabsTrigger>
                <TabsTrigger value="human">Human</TabsTrigger>
                <TabsTrigger value="machine">Machine</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
                <TabsTrigger value="third-party">Third-Party</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email / Contact</TableHead>
                        <TableHead>Role / Department</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Access Level</TableHead>
                        <TableHead>MFA</TableHead>
                        <TableHead>Risk Score</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleIdentities.map((identity) => (
                        <TableRow key={identity.id}>
                          <TableCell className="font-medium">{identity.id}</TableCell>
                          <TableCell>{identity.name}</TableCell>
                          <TableCell>{identity.email}</TableCell>
                          <TableCell>{identity.role} / {identity.department}</TableCell>
                          <TableCell>
                            <Badge variant={
                              identity.type === 'human' ? 'default' :
                              identity.type === 'machine' ? 'outline' :
                              identity.type === 'api' ? 'secondary' : 'destructive'
                            }>
                              {identity.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              identity.accessLevel === 'standard' ? 'default' :
                              identity.accessLevel === 'limited' ? 'outline' :
                              identity.accessLevel === 'admin' ? 'secondary' : 'destructive'
                            }>
                              {identity.accessLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {identity.mfaEnabled ? (
                              <Badge className="bg-green-500">Enabled</Badge>
                            ) : (
                              <Badge variant="outline" className="text-red-500 border-red-500">Disabled</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              identity.riskScore === 'low' ? 'bg-green-500' :
                              identity.riskScore === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                            }>
                              {identity.riskScore}
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
              </TabsContent>
              
              <TabsContent value="human">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email / Contact</TableHead>
                        <TableHead>Role / Department</TableHead>
                        <TableHead>Access Level</TableHead>
                        <TableHead>MFA</TableHead>
                        <TableHead>Risk Score</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleIdentities.filter(i => i.type === 'human').map((identity) => (
                        <TableRow key={identity.id}>
                          <TableCell className="font-medium">{identity.id}</TableCell>
                          <TableCell>{identity.name}</TableCell>
                          <TableCell>{identity.email}</TableCell>
                          <TableCell>{identity.role} / {identity.department}</TableCell>
                          <TableCell>
                            <Badge variant={
                              identity.accessLevel === 'standard' ? 'default' :
                              identity.accessLevel === 'limited' ? 'outline' :
                              identity.accessLevel === 'admin' ? 'secondary' : 'destructive'
                            }>
                              {identity.accessLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {identity.mfaEnabled ? (
                              <Badge className="bg-green-500">Enabled</Badge>
                            ) : (
                              <Badge variant="outline" className="text-red-500 border-red-500">Disabled</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              identity.riskScore === 'low' ? 'bg-green-500' :
                              identity.riskScore === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                            }>
                              {identity.riskScore}
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
              </TabsContent>
              
              {/* Similar tables for other tabs (machine, api, third-party) would go here */}
              <TabsContent value="machine">
                <div className="flex justify-center py-10">
                  <div className="text-center">
                    <Shield className="h-20 w-20 text-blue-200 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">View Filtered Machine Identities</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      In a complete implementation, this tab would show machine identities filtered from the main list.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="api">
                <div className="flex justify-center py-10">
                  <div className="text-center">
                    <Shield className="h-20 w-20 text-blue-200 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">View Filtered API Identities</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      In a complete implementation, this tab would show API identities filtered from the main list.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="third-party">
                <div className="flex justify-center py-10">
                  <div className="text-center">
                    <Shield className="h-20 w-20 text-blue-200 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">View Filtered Third-Party Identities</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      In a complete implementation, this tab would show third-party identities filtered from the main list.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Template Information */}
        <UserIdentityTemplate />
      </div>
    </div>
  );
}