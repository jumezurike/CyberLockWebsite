import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import UserIdentityTemplate from '@/components/identity-behavior/user-identity-template';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  AlertCircle, 
  Download, 
  Edit, 
  FileUp, 
  Lock, 
  Trash, 
  User, 
  UserCog,
  Shield 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock user data - would be replaced with actual API data
const mockUsers = [
  {
    id: 'EMP001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    jobTitle: 'IT Manager',
    department: 'Information Technology',
    identityType: 'human',
    privilegeLevel: 'high',
    mfaStatus: true,
    uivsStatus: 'verified',
    lastActivity: '2023-05-05T15:30:00Z',
    complianceStatus: 'compliant'
  },
  {
    id: 'EMP002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    jobTitle: 'HR Specialist',
    department: 'Human Resources',
    identityType: 'human',
    privilegeLevel: 'medium',
    mfaStatus: true,
    uivsStatus: 'pending',
    lastActivity: '2023-05-04T09:15:00Z',
    complianceStatus: 'compliant'
  },
  {
    id: 'API003',
    firstName: 'API',
    lastName: 'Gateway',
    email: 'api.gateway@system.local',
    jobTitle: 'System',
    department: 'Engineering',
    identityType: 'api',
    privilegeLevel: 'high',
    mfaStatus: true,
    uivsStatus: 'verified',
    lastActivity: '2023-05-05T16:45:00Z',
    complianceStatus: 'compliant'
  }
];

export default function IdentityManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Filter users based on search query
  const filteredUsers = mockUsers.filter(user => {
    const searchFields = [
      user.id, 
      user.firstName, 
      user.lastName, 
      user.email, 
      user.jobTitle, 
      user.department
    ].map(field => field.toLowerCase());
    
    return searchFields.some(field => field.includes(searchQuery.toLowerCase()));
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate file processing
    setTimeout(() => {
      setIsUploading(false);
      setUploadStatus('success');
      setFile(null);
      
      // Reset status after some time
      setTimeout(() => {
        setUploadStatus('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-6">
        <Link href="/sos2a-tool">
          <a className="text-blue-600 hover:underline flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to Assessment Tool
          </a>
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Identity Management</h1>
          <p className="text-gray-600">
            Manage and secure your organization's user identities with our Universal Identity Verification System (UIVS).
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <Shield className="text-primary h-5 w-5 mr-2" />
                <span className="font-medium text-primary">UIVS Active</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-80 text-sm">
                The Universal Identity Verification System (UIVS) is actively protecting your organization's identities.
                This patented system ensures sovereign identity protection across your digital ecosystem.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <UserIdentityTemplate />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Identity Import</CardTitle>
            <CardDescription>
              Upload your completed user identity CSV template to import multiple users at once.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="max-w-md"
                />
                <Button 
                  onClick={handleUpload} 
                  disabled={!file || isUploading}
                  className="flex items-center space-x-2"
                >
                  {isUploading ? (
                    <><span className="animate-spin">↻</span> <span>Uploading...</span></>
                  ) : (
                    <><FileUp size={18} /> <span>Upload</span></>
                  )}
                </Button>
              </div>
              
              {uploadStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>User identities successfully imported!</span>
                </div>
              )}
              
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">The import process will:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Validate the CSV format and required fields</li>
                  <li>Check for duplicate user identities</li>
                  <li>Process each identity through the UIVS system</li>
                  <li>Create secure identity profiles for each user</li>
                  <li>Apply your organization's security policies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Identity Statistics</CardTitle>
            <CardDescription>
              Overview of your organization's identity posture.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span>Total Identities</span>
                <span className="font-medium">{mockUsers.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Human Users</span>
                <span className="font-medium">{mockUsers.filter(u => u.identityType === 'human').length}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Non-Human Identities</span>
                <span className="font-medium">{mockUsers.filter(u => u.identityType !== 'human').length}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>UIVS Verified</span>
                <span className="font-medium">{mockUsers.filter(u => u.uivsStatus === 'verified').length}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Compliance Rate</span>
                <span className="font-medium text-green-600">
                  {(mockUsers.filter(u => u.complianceStatus === 'compliant').length / mockUsers.length * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span>MFA Adoption</span>
                <span className="font-medium text-green-600">
                  {(mockUsers.filter(u => u.mfaStatus).length / mockUsers.length * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User Identity Database</CardTitle>
            <div className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search users..."
                className="max-w-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
              <Button className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Add User</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>UIVS Status</TableHead>
                  <TableHead>Privileges</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No users found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-sm">{user.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>{user.jobTitle}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Badge variant={user.identityType === 'human' ? 'default' : 'secondary'}>
                          {user.identityType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.uivsStatus === 'verified' ? 'default' : 'outline'}>
                          {user.uivsStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          user.privilegeLevel === 'high' ? 'destructive' : 
                          user.privilegeLevel === 'medium' ? 'secondary' : 'outline'
                        }>
                          {user.privilegeLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <UserCog className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Lock className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <span>Identity Behavior Analytics</span>
          </CardTitle>
          <CardDescription>
            Behavioral analytics for your organization's identities powered by advanced machine learning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-md">
            <p className="text-amber-800">
              Identity Behavior Analytics module is coming soon. This feature will use AI to detect abnormal access patterns,
              potential insider threats, and other security anomalies based on user behavior.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}