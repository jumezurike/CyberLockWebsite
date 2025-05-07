import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, User, Users, UserPlus, Search, Filter, Download, ChevronLeft, AlertTriangle } from 'lucide-react';
import UserIdentityTemplate from '@/components/identity-behavior/user-identity-template';
import DataNucleusAggregate from '@/components/identity-behavior/data-nucleus-aggregate';
import SecureProfileImage from '@/components/identity-behavior/secure-profile-image';
import { Separator } from '@/components/ui/separator';

interface IdentityUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  identityType: string;
  accessLevel: string;
  riskLevel: string;
  mfaEnabled: boolean;
  lastActive: string;
  // Machine/API specific identifiers
  imei?: string;
  serialNumber?: string;
  uid?: string;
  contactOwner?: string;
  // API specific identifiers
  tokenId?: string;
  sourceSystem?: string;
}

export default function IdentityManagementPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [identities, setIdentities] = useState<IdentityUser[]>([
    {
      id: 'EMP001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'IT Manager',
      department: 'Information Technology',
      identityType: 'human',
      accessLevel: 'privileged',
      riskLevel: 'medium',
      mfaEnabled: true,
      lastActive: '2025-05-01'
    },
    {
      id: 'EMP002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      role: 'Finance Director',
      department: 'Finance',
      identityType: 'human',
      accessLevel: 'admin',
      riskLevel: 'high',
      mfaEnabled: true,
      lastActive: '2025-05-05'
    },
    {
      id: 'SVC001',
      name: 'Backup Service',
      email: 'backup-service@system.internal',
      role: 'Automated Process',
      department: 'Operations',
      identityType: 'machine',
      accessLevel: 'standard',
      riskLevel: 'low',
      mfaEnabled: false,
      lastActive: '2025-05-06',
      imei: '490154203237518',
      serialNumber: 'SVR2025-BK-328',
      uid: 'a8f2e9d1-c6b7-4e5f-9a3b-2d1c8e7f6a5b',
      contactOwner: 'John Smith'
    },
    {
      id: 'API001',
      name: 'Payment Gateway API',
      email: 'api-monitor@example.com',
      role: 'External Service',
      department: 'Finance',
      identityType: 'api',
      accessLevel: 'limited',
      riskLevel: 'high',
      mfaEnabled: true,
      lastActive: '2025-05-06',
      tokenId: 'pgw-api-c472e89a31b5',
      sourceSystem: 'Payment Processing Platform',
      contactOwner: 'Sarah Johnson'
    },
    {
      id: 'VEN001',
      name: 'Tech Support Inc.',
      email: 'support@techsupport.example.com',
      role: 'Technical Support',
      department: 'External',
      identityType: 'third-party',
      accessLevel: 'limited',
      riskLevel: 'medium',
      mfaEnabled: true,
      lastActive: '2025-04-28'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredIdentities = identities.filter(identity => 
    identity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    identity.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    identity.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getIdentityTypeBadge = (type: string) => {
    switch (type) {
      case 'human':
        return <Badge variant="default" className="bg-blue-500">Human</Badge>;
      case 'machine':
        return <Badge variant="outline" className="border-purple-500 text-purple-700">Machine</Badge>;
      case 'api':
        return <Badge variant="outline" className="border-green-500 text-green-700">API</Badge>;
      case 'third-party':
        return <Badge variant="outline" className="border-orange-500 text-orange-700">Third-Party</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case 'low':
        return <Badge variant="outline" className="border-green-500 text-green-700">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-amber-500 text-amber-700">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="border-red-500 text-red-700">High</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, we would parse the CSV file
      // and update the identities state with the new data
      alert('CSV upload functionality would be implemented here');
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/sos2a-tool">
          <Button variant="ghost" className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Assessment
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Identity Management</h1>
        <p className="text-gray-600">Manage and monitor all identity types across your organization using our patented Universal Identity Verification System (UIVS).</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="identities">Identities</TabsTrigger>
          <TabsTrigger value="import">Import / Export</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Identities</CardTitle>
                <CardDescription>All managed identities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500 mr-3" />
                  <span className="text-3xl font-bold">{identities.length}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">High Risk Identities</CardTitle>
                <CardDescription>Require attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
                  <span className="text-3xl font-bold">{identities.filter(id => id.riskLevel === 'high').length}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Identity Types</CardTitle>
                <CardDescription>Distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-500">{identities.filter(id => id.identityType === 'human').length} Human</Badge>
                  <Badge className="bg-purple-500">{identities.filter(id => id.identityType === 'machine').length} Machine</Badge>
                  <Badge className="bg-green-500">{identities.filter(id => id.identityType === 'api').length} API</Badge>
                  <Badge className="bg-orange-500">{identities.filter(id => id.identityType === 'third-party').length} Third-Party</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest identity-related security events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start border-l-4 border-amber-500 pl-4 py-2">
                  <div className="flex-1">
                    <p className="font-medium">Unusual Login Location</p>
                    <p className="text-sm text-gray-600">Sarah Johnson (EMP002) logged in from an unusual location - New York, NY</p>
                    <p className="text-xs text-gray-500 mt-1">Today, 09:32 AM</p>
                  </div>
                  <Badge variant="outline" className="border-amber-500 text-amber-700">Warning</Badge>
                </div>
                
                <div className="flex items-start border-l-4 border-red-500 pl-4 py-2">
                  <div className="flex-1">
                    <p className="font-medium">Failed Authentication Attempts</p>
                    <p className="text-sm text-gray-600">Multiple failed login attempts for Payment Gateway API (API001)</p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday, 11:47 PM</p>
                  </div>
                  <Badge variant="outline" className="border-red-500 text-red-700">Alert</Badge>
                </div>
                
                <div className="flex items-start border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex-1">
                    <p className="font-medium">Identity Added</p>
                    <p className="text-sm text-gray-600">New machine identity added: Database Backup Service (SVC002)</p>
                    <p className="text-xs text-gray-500 mt-1">May 4, 2025, 2:15 PM</p>
                  </div>
                  <Badge variant="outline" className="border-blue-500 text-blue-700">Info</Badge>
                </div>
                
                <div className="flex items-start border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex-1">
                    <p className="font-medium">Security Enhancement</p>
                    <p className="text-sm text-gray-600">MFA enabled for all third-party vendor accounts</p>
                    <p className="text-xs text-gray-500 mt-1">May 3, 2025, 10:02 AM</p>
                  </div>
                  <Badge variant="outline" className="border-green-500 text-green-700">Security</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="identities">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="md:col-span-3">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Digital Data Nucleic Authority (DDNA)</CardTitle>
                    <CardDescription>
                      Digital Registry and central repository for DNA components 
                      <Badge variant="outline" className="ml-2 border-blue-500 text-blue-600">
                        Government ID Verified
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search identities..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add New
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">ID</th>
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Department</th>
                        <th className="text-left py-3 px-4">Access Level</th>
                        <th className="text-left py-3 px-4">Risk Level</th>
                        <th className="text-left py-3 px-4">MFA</th>
                        <th className="text-left py-3 px-4">Last Active</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIdentities.length > 0 ? (
                        filteredIdentities.map((identity) => (
                          <tr key={identity.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{identity.id}</td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col">
                                <span>{identity.name}</span>
                                <span className="text-sm text-gray-500">{identity.email}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">{getIdentityTypeBadge(identity.identityType)}</td>
                            <td className="py-3 px-4">{identity.department}</td>
                            <td className="py-3 px-4">{identity.accessLevel}</td>
                            <td className="py-3 px-4">{getRiskLevelBadge(identity.riskLevel)}</td>
                            <td className="py-3 px-4">
                              {identity.mfaEnabled ? (
                                <Badge variant="outline" className="border-green-500 text-green-700">Enabled</Badge>
                              ) : (
                                <Badge variant="outline" className="border-red-500 text-red-700">Disabled</Badge>
                              )}
                            </td>
                            <td className="py-3 px-4">{identity.lastActive}</td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <User className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">Edit</Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9} className="py-4 text-center text-gray-500">
                            No identities found matching your search
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            {/* Selected identity profile panel */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">DNA Component Profile</CardTitle>
                <CardDescription>
                  Advanced authentication factors for John Smith
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <SecureProfileImage 
                    userId="EMP001"
                    userName="John Smith"
                  />
                  
                  <div className="w-full mt-6">
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-gray-500">Identity ID:</span>
                      <span className="font-medium">EMP001</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-gray-500">Factor Type:</span>
                      <span className="font-medium">What You Are</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-gray-500">Access Level:</span>
                      <span className="font-medium">Privileged</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-gray-500">Risk Level:</span>
                      <span className="font-medium text-amber-600">Medium</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-gray-500">Enabled Auth Factors:</span>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="border-blue-500 text-blue-700">What You Are</Badge>
                        <Badge variant="outline" className="border-green-500 text-green-700">What You Have</Badge>
                        <Badge variant="outline" className="border-purple-500 text-purple-700">What You Know</Badge>
                      </div>
                    </div>
                    
                    {/* Machine/API-specific details section */}
                    <div className="mt-4 bg-gray-50 p-3 rounded-md">
                      <h4 className="font-medium mb-2 text-sm">Machine/API Identifiers</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">IMEI/UUID:</span>
                          <span className="font-mono">490154203237518</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Serial Number:</span>
                          <span className="font-mono">SVR2025-BK-328</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">UID:</span>
                          <span className="font-mono text-xs">a8f2e9d1-c6b7-4e5f-9a3b-2d1c8e7f6a5b</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Contact Owner:</span>
                          <span>John Smith</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => alert('This would download the secured profile image with embedded tracking data')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Secured Image
                    </Button>
                    
                    <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-200">
                      <p className="text-xs text-blue-700">
                        This image contains encrypted DNA components using steganography. When shared, it creates an intermediate identity representation for tracking while maintaining visual quality.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <DataNucleusAggregate />
        </TabsContent>
        
        <TabsContent value="import">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Import Identities</CardTitle>
                <CardDescription>
                  Import user identities from a CSV file. Use our template for the correct format.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="csv-upload">Upload CSV File</Label>
                    <div className="flex items-center gap-4">
                      <Input 
                        id="csv-upload" 
                        type="file" 
                        accept=".csv" 
                        onChange={handleCsvUpload}
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={() => {
                        const link = document.createElement('a');
                        link.href = '/templates/user-identity-template.csv';
                        link.setAttribute('download', 'user-identity-template.csv');
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}>
                        <Download className="h-4 w-4 mr-2" />
                        Get Template
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Import Rules</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
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
                  
                  <Button className="w-full sm:w-auto">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload and Import
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Export Identities</CardTitle>
                <CardDescription>
                  Export your DDNA repository data to a CSV file for backup or analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label>Export Options</Label>
                    <div className="flex items-center gap-4 flex-wrap">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export All Identities
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Human Users
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Machine Identities
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Third-Party Access
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Data Nuclear Aggregate (DNA) Model</h2>
              <p className="text-gray-600 mb-6">
                The DNA approach forms the foundation of our identity verification system by aggregating all identity data into a comprehensive profile. Government-verified ID creates strong accountability and anchors digital identities to real-world entities.
              </p>
              <DataNucleusAggregate />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">User Identity Template</h2>
              <UserIdentityTemplate />
            </div>
          </div>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Additional Templates</CardTitle>
              <CardDescription>
                Download specialized templates for different identity management needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Machine Identity Template</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Specialized template for tracking machine identities with IMEI, serial numbers, UIDs and hardware details.
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Third-Party Vendor Template</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Template for managing external vendor access and third-party relationships.
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">API Identity Template</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Template for tracking API keys, service tokens, UUIDs, and source system identifiers.
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Identity-Device Mapping Template</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Map users to authorized devices for comprehensive access control.
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}