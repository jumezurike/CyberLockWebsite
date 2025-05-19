import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileSpreadsheet } from 'lucide-react';

export default function CleanIdentityManagement() {
  const { toast } = useToast();
  const [selectedIdentityType, setSelectedIdentityType] = useState<string>("All Types");
  
  // Import CSV functionality
  const handleImportCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({
          title: "CSV Import",
          description: `${file.name} selected for import. Processing...`,
        });
      }
    };
    input.click();
  };
  
  // Download Template functionality
  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/templates/identity-management-template.csv';
    link.setAttribute('download', 'identity-management-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Template Downloaded",
      description: "Fill this template with your identity information and import it back.",
    });
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium mb-4">Identity Component Inventory</h2>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="mr-4 border p-3 rounded-md bg-gray-50">
              <div className="flex items-center mb-1">
                <span className="block text-sm font-medium">Filter by Identity Type</span>
                <div className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">Filter</div>
              </div>
              <p className="text-xs text-gray-500 mb-2">Select an identity type to filter the inventory list below</p>
              <Select value={selectedIdentityType} onValueChange={setSelectedIdentityType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Types">All Types</SelectItem>
                  <SelectItem value="Human">Human</SelectItem>
                  <SelectItem value="Machine">Machine</SelectItem>
                  <SelectItem value="API">API</SelectItem>
                  <SelectItem value="Third-Party">Third-Party</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button className="bg-purple-600 hover:bg-purple-700">Add Identity</Button>
        </div>
        
        {/* Identity Table */}
        <div className="border rounded border-gray-200">
          <div className="grid grid-cols-6 bg-gray-50 p-3 border-b border-gray-200 text-sm font-medium text-gray-700">
            <div>Identity Type</div>
            <div>User/Entity ID</div>
            <div>Name/Identifier</div>
            <div>Authentication Type</div>
            <div>Access Level</div>
            <div>Department/Group</div>
          </div>
          
          <div className="p-6 text-center text-gray-500 bg-white">
            No identities added yet. Click "Add Identity" to begin tracking identity components.
          </div>
        </div>
      </div>
      
      {/* Import Identity Inventory section */}
      <div>
        <h2 className="text-lg font-medium mb-2">Import Identity Inventory</h2>
        <p className="text-gray-600 text-sm mb-4">
          Use these options to import existing identity component inventory data.
        </p>
        
        <div className="flex gap-4">
          <Button 
            onClick={handleImportCSV}
            variant="default"
            className="bg-purple-600 hover:bg-purple-700"
          >
            Import CSV
          </Button>
          
          <Button 
            onClick={handleDownloadTemplate}
            variant="outline"
            className="bg-white border-gray-200 text-gray-800 flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Download Template
          </Button>
        </div>
      </div>
      
      {/* Form Sections - Aligned with Identity Component needs */}
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-medium mb-2">1. Basic Identification</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="user-id">User/Entity ID</Label>
              <Input id="user-id" placeholder="Enter unique identifier (e.g., EMP001)" />
            </div>
            <div>
              <Label htmlFor="first-name">First Name/Service Name</Label>
              <Input id="first-name" placeholder="Enter first name or service name" />
            </div>
            <div>
              <Label htmlFor="last-name">Last Name/Service Identifier</Label>
              <Input id="last-name" placeholder="Enter last name or service identifier" />
            </div>
            <div>
              <Label htmlFor="email">Email/Notification Endpoint</Label>
              <Input id="email" placeholder="Enter email or notification endpoint" />
            </div>
            <div>
              <Label htmlFor="role">Role/Function</Label>
              <Input id="role" placeholder="Enter job role or service function" />
            </div>
            <div>
              <Label htmlFor="department">Department/Group</Label>
              <Input id="department" placeholder="Enter department or group" />
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-2">2. Identity Classification</h2>
          <p className="text-gray-600 text-sm mb-4">
            Classify your identity by type and access level to determine appropriate security controls and policies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="identity-type-select">Identity Type</Label>
              <Select>
                <SelectTrigger id="identity-type-select">
                  <SelectValue placeholder="Select identity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="human">Human</SelectItem>
                  <SelectItem value="machine">Machine</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="third-party">Third-Party</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="access-level">Access Level</Label>
              <Select>
                <SelectTrigger id="access-level">
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="limited">Limited</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="privileged">Privileged</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="employment-status">Employment/Service Status</Label>
              <Select>
                <SelectTrigger id="employment-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="system">System Service</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Primary Location</Label>
              <Input id="location" placeholder="Enter physical or logical location" />
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-2">3. Authentication & Identification</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="auth-method">Primary Authentication Method</Label>
              <Select>
                <SelectTrigger id="auth-method">
                  <SelectValue placeholder="Select authentication method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="username-password">Username/Password</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="api-key">API Key</SelectItem>
                  <SelectItem value="oauth">OAuth</SelectItem>
                  <SelectItem value="saml">SAML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="mfa-enabled">MFA Enabled</Label>
              <Select>
                <SelectTrigger id="mfa-enabled">
                  <SelectValue placeholder="Is MFA enabled?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="not-applicable">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="mfa-type">MFA Type</Label>
              <Select>
                <SelectTrigger id="mfa-type">
                  <SelectValue placeholder="Select MFA type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="app">Authentication App</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="hardware">Hardware Token</SelectItem>
                  <SelectItem value="uwa">Universal Wallet Address</SelectItem>
                  <SelectItem value="not-applicable">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="government-id-type">Government ID Type</Label>
              <Select>
                <SelectTrigger id="government-id-type">
                  <SelectValue placeholder="Select government ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drivers-license">Driver's License</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="national-id">National ID</SelectItem>
                  <SelectItem value="military-id">Military ID</SelectItem>
                  <SelectItem value="state-id">State ID</SelectItem>
                  <SelectItem value="not-applicable">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="biometric-type">Biometric Authentication</Label>
              <Select>
                <SelectTrigger id="biometric-type">
                  <SelectValue placeholder="Select biometric type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fingerprint">Fingerprint</SelectItem>
                  <SelectItem value="facial">Facial Recognition</SelectItem>
                  <SelectItem value="voice">Voice Recognition</SelectItem>
                  <SelectItem value="iris">Iris Scan</SelectItem>
                  <SelectItem value="not-applicable">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="issuing-authority">ID Issuing Authority</Label>
              <Input id="issuing-authority" placeholder="Enter ID issuing authority" />
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-2">4. Security & Behavior</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="federation-source">Federation/SSO Source</Label>
              <Input id="federation-source" placeholder="Enter federation or SSO source" />
            </div>
            <div>
              <Label htmlFor="last-password-change">Last Credential Change</Label>
              <Input id="last-password-change" type="date" placeholder="Pick a date" />
            </div>
            <div>
              <Label htmlFor="last-security-training">Last Security Training</Label>
              <Input id="last-security-training" type="date" placeholder="Pick a date" />
            </div>
            <div>
              <Label htmlFor="typical-login-hours">Typical Login Hours</Label>
              <Input id="typical-login-hours" placeholder="e.g., 9:00-17:00" />
            </div>
            <div>
              <Label htmlFor="login-anomaly-threshold">Login Anomaly Threshold</Label>
              <Select>
                <SelectTrigger id="login-anomaly-threshold">
                  <SelectValue placeholder="Select threshold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="inactive-account-days">Inactive Account Days</Label>
              <Input id="inactive-account-days" placeholder="e.g., 30, 90, 365" />
            </div>
            <div>
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" placeholder="e.g., 15, 30, 60" />
            </div>
            <div>
              <Label htmlFor="system-access">System Access List</Label>
              <Input id="system-access" placeholder="e.g., ERP, CRM, Finance Portal" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}