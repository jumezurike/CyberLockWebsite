import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, Shield, AlertTriangle, Users, Key } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function UserIdentityTemplate() {
  // Template data structure
  const templateStructure = [
    { field: 'user_id', description: 'Unique identifier for the user or identity', example: 'EMP001, SVC001', required: true, category: 'basic' },
    { field: 'first_name', description: 'First name for human users or service name for non-human identities', example: 'John, Backup', required: true, category: 'basic' },
    { field: 'last_name', description: 'Last name for human users or service identifier for non-human identities', example: 'Smith, Service', required: true, category: 'basic' },
    { field: 'email', description: 'Email address or notification endpoint', example: 'john.smith@example.com', required: true, category: 'basic' },
    { field: 'role', description: 'Job role or service function', example: 'IT Manager, Automated Process', required: true, category: 'basic' },
    { field: 'department', description: 'Department or functional area', example: 'Information Technology, Finance', required: true, category: 'basic' },
    { field: 'identity_type', description: 'Type of identity (human, machine, api, third-party)', example: 'human, machine, api, third-party', required: true, category: 'identity' },
    { field: 'access_level', description: 'Level of access granted (standard, limited, admin, privileged)', example: 'standard, limited, admin, privileged', required: true, category: 'access' },
    { field: 'government_id_type', description: 'Type of government-issued ID for human user accountability', example: 'drivers_license, state_id, passport, not_applicable', required: true, category: 'identity' },
    { field: 'government_id_issuing_authority', description: 'Authority that issued the government ID', example: 'CA-DMV, NY-DMV, US-State-Dept', required: true, category: 'identity' },
    { field: 'mfa_enabled', description: 'Whether multi-factor authentication is enabled', example: 'yes, no', required: true, category: 'access' },
    { field: 'mfa_type', description: 'Type of MFA used (app, sms, hardware token, etc.)', example: 'app, sms, hardware, api-key', required: false, category: 'access' },
    { field: 'location', description: 'Primary physical or logical location', example: 'Headquarters, Data Center, Cloud', required: false, category: 'basic' },
    { field: 'manager', description: 'Manager email or responsible party for the identity', example: 'jane.doe@example.com', required: false, category: 'basic' },
    { field: 'employment_status', description: 'Status for humans or service status for non-humans', example: 'Full Time, Contractor, System, Service', required: false, category: 'basic' },
    { field: 'last_password_change', description: 'Date of last credential rotation', example: '2025-04-15', required: false, category: 'security' },
    { field: 'last_security_training', description: 'Date of last security awareness training (N/A for non-human)', example: '2025-03-01, N/A', required: false, category: 'security' },
    { field: 'system_access', description: 'List of systems this identity can access', example: 'ERP, CRM, Finance Portal', required: false, category: 'access' },
    { field: 'typical_login_hours', description: 'Normal hours of activity', example: '9:00-17:00', required: false, category: 'behavior' },
    { field: 'login_anomaly_threshold', description: 'Sensitivity for login anomaly detection', example: 'low, medium, high', required: false, category: 'behavior' },
    { field: 'inactive_account_days', description: 'Days before account is flagged as inactive', example: '30, 90, 365', required: false, category: 'security' },
    { field: 'credential_exposure_check', description: 'Whether credential breach monitoring is enabled', example: 'yes, no', required: false, category: 'security' },
    { field: 'session_timeout_minutes', description: 'Minutes before automatic session termination', example: '15, 30, 60', required: false, category: 'security' },
    { field: 'privilege_escalation_alerts', description: 'Whether to alert on privilege escalation', example: 'yes, no', required: false, category: 'security' },
    { field: 'federation_source', description: 'Identity federation or SSO source', example: 'Active Directory, Okta SSO, AWS IAM', required: false, category: 'identity' },
  ];

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'basic':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Basic Info</Badge>;
      case 'identity':
        return <Badge variant="outline" className="border-purple-500 text-purple-700">Identity</Badge>;
      case 'access':
        return <Badge variant="outline" className="border-green-500 text-green-700">Access</Badge>;
      case 'security':
        return <Badge variant="outline" className="border-red-500 text-red-700">Security</Badge>;
      case 'behavior':
        return <Badge variant="outline" className="border-amber-500 text-amber-700">Behavior</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-xl">Universal Identity Template</CardTitle>
            <CardDescription>
              Standard CSV format for importing all identity types into the UIVS platform
            </CardDescription>
          </div>
          <Button onClick={() => {
            const link = document.createElement('a');
            link.href = '/templates/user-identity-template.csv';
            link.setAttribute('download', 'user-identity-template.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}>
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="structure">
          <TabsList className="mb-4 w-full md:w-auto">
            <TabsTrigger value="structure">
              <FileText className="h-4 w-4 mr-2" />
              Template Structure
            </TabsTrigger>
            <TabsTrigger value="best-practices">
              <Shield className="h-4 w-4 mr-2" />
              Best Practices
            </TabsTrigger>
            <TabsTrigger value="examples">
              <Users className="h-4 w-4 mr-2" />
              Example Identities
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="structure">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Field</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Example</TableHead>
                    <TableHead className="text-center">Required</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templateStructure.map((field) => (
                    <TableRow key={field.field}>
                      <TableCell className="font-medium">{field.field}</TableCell>
                      <TableCell>{field.description}</TableCell>
                      <TableCell><code className="px-1 py-0.5 bg-muted rounded text-sm">{field.example}</code></TableCell>
                      <TableCell className="text-center">
                        {field.required ? (
                          <Badge className="bg-blue-500">Required</Badge>
                        ) : (
                          <Badge variant="outline">Optional</Badge>
                        )}
                      </TableCell>
                      <TableCell>{getCategoryBadge(field.category)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="best-practices">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-2 flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-blue-500" />
                  Universal Identity Management Best Practices
                </h3>
                <p className="text-gray-600 mb-4">
                  Follow these guidelines when managing identities across your organization to ensure
                  proper security, compliance, and operational efficiency.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-green-200 bg-green-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Data Quality</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Ensure all required fields are completed</li>
                      <li>Use consistent naming conventions</li>
                      <li>Validate email addresses and identifiers</li>
                      <li>Keep data up-to-date with regular reviews</li>
                      <li>Use ISO date format (YYYY-MM-DD)</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border border-blue-200 bg-blue-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Multi-factor Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Enable MFA for all human users</li>
                      <li>Require hardware tokens for privileged access</li>
                      <li>Use certificate-based authentication for machine identities</li>
                      <li>Implement API keys with short rotation periods</li>
                      <li>Track MFA enrollment status</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border border-purple-200 bg-purple-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Segregation of Duties</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Ensure no single identity has conflicting permissions</li>
                      <li>Implement approval workflows for sensitive access</li>
                      <li>Maintain separation between development and production</li>
                      <li>Restrict third-party access to only required systems</li>
                      <li>Document access justifications</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border border-red-200 bg-red-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Lifecycle Management</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Implement formal onboarding/offboarding processes</li>
                      <li>Regularly audit inactive accounts</li>
                      <li>Automatically disable accounts after inactivity</li>
                      <li>Enforce credential rotation policies</li>
                      <li>Maintain historical access records</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium flex items-center text-base">
                  <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                  Common Pitfalls to Avoid
                </h4>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li className="text-gray-700">Using shared accounts instead of individual identities</li>
                  <li className="text-gray-700">Failing to document service account ownership and purpose</li>
                  <li className="text-gray-700">Neglecting non-human identities in security reviews</li>
                  <li className="text-gray-700">Overlooking federation source security controls</li>
                  <li className="text-gray-700">Inconsistent identity categorization across systems</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="examples">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Example Identities by Type</h3>
                <p className="text-gray-600 mb-4">
                  These examples demonstrate how to populate the template for different types of identities in your organization.
                </p>
              </div>
              
              <Tabs defaultValue="human">
                <TabsList className="mb-4">
                  <TabsTrigger value="human">Human Users</TabsTrigger>
                  <TabsTrigger value="machine">Machine Identities</TabsTrigger>
                  <TabsTrigger value="api">API Identities</TabsTrigger>
                  <TabsTrigger value="third-party">Third-Party</TabsTrigger>
                </TabsList>
                
                <TabsContent value="human">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Human User Example</CardTitle>
                      <CardDescription>Standard employee or contractor identity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <code className="text-xs block whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
{`user_id,first_name,last_name,email,role,department,identity_type,access_level,mfa_enabled,mfa_type,location,manager,employment_status,last_password_change,last_security_training,system_access,typical_login_hours,login_anomaly_threshold,inactive_account_days,credential_exposure_check,session_timeout_minutes,privilege_escalation_alerts,federation_source
EMP001,John,Smith,john.smith@example.com,IT Manager,Information Technology,human,privileged,yes,app+sms,Headquarters,jane.doe@example.com,Full Time,2025-04-15,2025-03-01,"ERP, CRM, IT Admin Portal",9:00-17:00,medium,30,yes,60,yes,Active Directory
`}
                      </code>
                    </CardContent>
                    <CardFooter className="bg-blue-50 border-t border-blue-100 text-sm text-blue-800">
                      <Key className="mr-2 h-4 w-4" />
                      Human identities should always have MFA enabled and complete security awareness training.
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="machine">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Machine Identity Example</CardTitle>
                      <CardDescription>Automated service or system account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <code className="text-xs block whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
{`user_id,first_name,last_name,email,role,department,identity_type,access_level,mfa_enabled,mfa_type,location,manager,employment_status,last_password_change,last_security_training,system_access,typical_login_hours,login_anomaly_threshold,inactive_account_days,credential_exposure_check,session_timeout_minutes,privilege_escalation_alerts,federation_source
SVC001,Backup,Service,backup-service@system.internal,Automated Process,Operations,machine,standard,no,,Data Center,john.smith@example.com,System,2025-01-15,N/A,"Backup System, Storage Access",,low,365,no,0,yes,Local
`}
                      </code>
                    </CardContent>
                    <CardFooter className="bg-purple-50 border-t border-purple-100 text-sm text-purple-800">
                      <Key className="mr-2 h-4 w-4" />
                      Machine identities should always have a human owner and regular credential rotation.
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="api">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">API Identity Example</CardTitle>
                      <CardDescription>Integration or service connection</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <code className="text-xs block whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
{`user_id,first_name,last_name,email,role,department,identity_type,access_level,mfa_enabled,mfa_type,location,manager,employment_status,last_password_change,last_security_training,system_access,typical_login_hours,login_anomaly_threshold,inactive_account_days,credential_exposure_check,session_timeout_minutes,privilege_escalation_alerts,federation_source
API001,Payment,Gateway,api-monitor@example.com,External Service,Finance,api,limited,yes,api-key,Cloud,sarah.johnson@example.com,Service,2025-03-30,N/A,"Payment Processing System",,high,90,yes,15,yes,AWS IAM
`}
                      </code>
                    </CardContent>
                    <CardFooter className="bg-green-50 border-t border-green-100 text-sm text-green-800">
                      <Key className="mr-2 h-4 w-4" />
                      API identities should use short-lived tokens and have strict access controls.
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="third-party">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Third-Party Identity Example</CardTitle>
                      <CardDescription>Vendor or external partner access</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <code className="text-xs block whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
{`user_id,first_name,last_name,email,role,department,identity_type,access_level,mfa_enabled,mfa_type,location,manager,employment_status,last_password_change,last_security_training,system_access,typical_login_hours,login_anomaly_threshold,inactive_account_days,credential_exposure_check,session_timeout_minutes,privilege_escalation_alerts,federation_source
VEN001,Tech Support,Inc.,support@techsupport.example.com,Technical Support,External,third-party,limited,yes,app,Remote,john.smith@example.com,Vendor,2025-04-01,2025-02-15,"Ticketing System, Knowledge Base",9:00-20:00,medium,45,yes,20,yes,External IDP
`}
                      </code>
                    </CardContent>
                    <CardFooter className="bg-orange-50 border-t border-orange-100 text-sm text-orange-800">
                      <Key className="mr-2 h-4 w-4" />
                      Third-party identities should have the strictest monitoring and limited access durations.
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}