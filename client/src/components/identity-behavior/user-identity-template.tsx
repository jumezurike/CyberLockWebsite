import { useState } from 'react';
import { Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function UserIdentityTemplate() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/templates/user-identity-template.csv';
    link.setAttribute('download', 'user-identity-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Universal Identity Verification System (UIVS)</CardTitle>
        <CardDescription>
          Our patented identity management system for tracking and securing all identity types across your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="template">Template Guide</TabsTrigger>
            <TabsTrigger value="identity-types">Identity Types</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold">What is the Universal Identity Verification System?</h3>
              <p>
                The Universal Identity Verification System (UIVS) is CyberLockX's patented technology for managing 
                and securing all identity types across your organization - human users, machine identities, API access, 
                and third-party contractors. UIVS provides:
              </p>
              
              <ul className="list-disc pl-5 space-y-2 my-4">
                <li>
                  <strong>Comprehensive Identity Tracking</strong> - Monitor all identity types in a unified system
                </li>
                <li>
                  <strong>Behavior Analytics</strong> - Detect suspicious activity and anomalous patterns
                </li>
                <li>
                  <strong>Access Governance</strong> - Apply least privilege principles across your organization
                </li>
                <li>
                  <strong>Real-time Verification</strong> - Continuously validate identity authenticity
                </li>
                <li>
                  <strong>Sovereign Identity Protection</strong> - Ensure identity data remains under your control
                </li>
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100 my-4">
                <h4 className="text-blue-800 font-medium mb-2">Why Identity Management Matters</h4>
                <p className="text-blue-700 text-sm">
                  According to industry research, over 80% of data breaches involve compromised or misused identities.
                  By implementing proper identity management, you can significantly reduce your attack surface and 
                  security risk exposure.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download CSV Template
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="template" className="space-y-4">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold">User Identity Template Guide</h3>
              <p>
                Our template follows a standardized format for importing user identities into the CyberLockX 
                system. To successfully import your user data, please follow these guidelines:
              </p>
              
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full border rounded-md">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left border-b">Field</th>
                      <th className="p-2 text-left border-b">Description</th>
                      <th className="p-2 text-left border-b">Required</th>
                      <th className="p-2 text-left border-b">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">User ID</td>
                      <td className="p-2">Unique identifier for the user or identity</td>
                      <td className="p-2">Yes</td>
                      <td className="p-2 font-mono text-sm">EMP001</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">First Name</td>
                      <td className="p-2">First name or identity label</td>
                      <td className="p-2">Yes</td>
                      <td className="p-2 font-mono text-sm">John</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Last Name</td>
                      <td className="p-2">Last name or secondary identifier</td>
                      <td className="p-2">Yes</td>
                      <td className="p-2 font-mono text-sm">Doe</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Email</td>
                      <td className="p-2">Email address or contact endpoint</td>
                      <td className="p-2">Yes</td>
                      <td className="p-2 font-mono text-sm">john.doe@example.com</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Job Title</td>
                      <td className="p-2">Role or function title</td>
                      <td className="p-2">Yes</td>
                      <td className="p-2 font-mono text-sm">IT Manager</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Department</td>
                      <td className="p-2">Organizational department or group</td>
                      <td className="p-2">Yes</td>
                      <td className="p-2 font-mono text-sm">Information Technology</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Identity Type</td>
                      <td className="p-2">Category of identity (human, machine, api, third-party)</td>
                      <td className="p-2">Yes</td>
                      <td className="p-2 font-mono text-sm">human</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Privilege Level</td>
                      <td className="p-2">Level of access privileges (high, medium, low)</td>
                      <td className="p-2">Yes</td>
                      <td className="p-2 font-mono text-sm">medium</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Access Level</td>
                      <td className="p-2">Specific access category (admin, standard, limited, etc.)</td>
                      <td className="p-2">Yes</td>
                      <td className="p-2 font-mono text-sm">standard</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">MFA Enabled</td>
                      <td className="p-2">Whether MFA is enabled (yes/no)</td>
                      <td className="p-2">Yes</td>
                      <td className="p-2 font-mono text-sm">yes</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Contact Info</td>
                      <td className="p-2">Secondary contact information</td>
                      <td className="p-2">No</td>
                      <td className="p-2 font-mono text-sm">555-123-4567</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Notes</td>
                      <td className="p-2">Additional notes or comments</td>
                      <td className="p-2">No</td>
                      <td className="p-2 font-mono text-sm">Primary administrator</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-md border border-amber-100 mt-6">
                <h4 className="text-amber-800 font-medium mb-2">Important Notes</h4>
                <ul className="list-disc pl-5 space-y-1 text-amber-700 text-sm">
                  <li>The first row of the CSV file must contain the column headers exactly as shown</li>
                  <li>Use standard CSV format with commas as separators</li>
                  <li>Dates should be in YYYY-MM-DD format</li>
                  <li>The system will validate all entries during import</li>
                  <li>Machine and API identities should include appropriate contact owners</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download CSV Template
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="identity-types" className="space-y-4">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold">Understanding Identity Types</h3>
              <p>
                Modern organizations manage multiple identity types, each with unique security requirements.
                CyberLockX's Universal Identity Verification System (UIVS) provides comprehensive protection
                for all identity categories:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium text-blue-700">Human Identities</h4>
                  <p className="text-sm mt-2">
                    Employee accounts, contractor accounts, and other human users. These require standard 
                    authentication methods, behavioral monitoring, and security awareness training.
                  </p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium text-blue-700">Machine Identities</h4>
                  <p className="text-sm mt-2">
                    Service accounts, automated processes, and system identities. These require strict 
                    privilege management, regular rotation of credentials, and detailed activity logging.
                  </p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium text-blue-700">API Identities</h4>
                  <p className="text-sm mt-2">
                    API keys, tokens, and authentication credentials for services. These require 
                    robust rate limiting, access scoping, and regular validation checks.
                  </p>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium text-blue-700">Third-Party Identities</h4>
                  <p className="text-sm mt-2">
                    Vendor accounts, partner access, and external system integrations. These require 
                    strict access controls, thorough vetting, and isolated permission sets.
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mt-6">
                <h4 className="text-blue-800 font-medium mb-2">Identity Behavior Monitoring</h4>
                <p className="text-blue-700 text-sm">
                  Our patented system tracks normal behavior patterns for each identity type and alerts 
                  when anomalous activity is detected - such as access from unusual locations, at unusual times,
                  or to unusual resources. This behavioral analysis provides an additional layer of security
                  beyond traditional authentication methods.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download CSV Template
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}