import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Download, Users, FileText, AlertTriangle, ChevronRight } from 'lucide-react';

// CSV template header (must match user-identity-template.csv)
const CSV_HEADER = "user_id,first_name,last_name,email,role,department,identity_type,access_level,government_id_type,government_id_issuing_authority,mfa_enabled,mfa_type,location,manager,employment_status,last_password_change,last_security_training,system_access,typical_login_hours,login_anomaly_threshold,inactive_account_days,credential_exposure_check,session_timeout_minutes,privilege_escalation_alerts,federation_source";

interface UserIdentity {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  department: string;
  identity_type: string;
  access_level: string;
  government_id_type: string;
  government_id_issuing_authority: string;
  mfa_enabled: string;
  mfa_type?: string;
  location?: string;
  manager?: string;
  employment_status?: string;
  last_password_change?: string;
  last_security_training?: string;
  system_access?: string;
  typical_login_hours?: string;
  login_anomaly_threshold?: string;
  inactive_account_days?: string;
  credential_exposure_check?: string;
  session_timeout_minutes?: string;
  privilege_escalation_alerts?: string;
  federation_source?: string;
}

interface UserIdentityManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserIdentityManager({ open, onOpenChange }: UserIdentityManagerProps) {
  const [tab, setTab] = useState('upload');
  const [identities, setIdentities] = useState<UserIdentity[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Function to handle CSV file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    setImportErrors([]);
    
    const file = event.target.files?.[0];
    if (!file) {
      setIsUploading(false);
      return;
    }

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
        setImportErrors(['The CSV file does not contain any data rows.']);
        setIsUploading(false);
        return;
      }

      const header = lines[0].trim();
      if (!header.includes('user_id') || !header.includes('identity_type')) {
        setImportErrors(['The CSV file does not have the correct headers. Please use the template.']);
        setIsUploading(false);
        return;
      }

      const headerFields = header.split(',');
      const parsedIdentities: UserIdentity[] = [];
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;
        
        const values = parseCSVLine(line);
        
        if (values.length !== headerFields.length) {
          errors.push(`Line ${i + 1}: Incorrect number of fields (${values.length} instead of ${headerFields.length})`);
          continue;
        }
        
        const identity: Record<string, string> = {};
        
        headerFields.forEach((field, index) => {
          identity[field] = values[index] || '';
        });
        
        // Validate required fields
        if (!identity.user_id || !identity.first_name || !identity.last_name || !identity.email || 
            !identity.role || !identity.department || !identity.identity_type || !identity.access_level) {
          errors.push(`Line ${i + 1}: Missing required fields for user ${identity.user_id || 'unknown'}`);
          continue;
        }
        
        parsedIdentities.push(identity as UserIdentity);
      }

      if (errors.length > 0) {
        setImportErrors(errors);
      }
      
      if (parsedIdentities.length > 0) {
        setIdentities(parsedIdentities);
        toast({
          title: "Identities imported",
          description: `Successfully imported ${parsedIdentities.length} identities.`,
        });
        
        if (errors.length === 0) {
          setTab('review');
        }
      }
    } catch (error) {
      setImportErrors([`Error parsing CSV file: ${error instanceof Error ? error.message : String(error)}`]);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Helper function to properly parse CSV line with quoted fields
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  };

  // Function to download the user identity template
  const downloadTemplate = () => {
    // The content includes the header and sample data
    const csvContent = [
      CSV_HEADER,
      'EMP001,John,Smith,john.smith@example.com,IT Manager,Information Technology,human,privileged,drivers_license,NY-DMV,yes,app+sms,Headquarters,jane.doe@example.com,Full Time,2025-04-15,2025-03-01,"ERP, CRM, IT Admin Portal",9:00-17:00,medium,30,yes,60,yes,Active Directory',
      'EMP002,Sarah,Johnson,sarah.johnson@example.com,Finance Director,Finance,human,admin,state_id,CA-DMV,yes,hardware,Headquarters,executive@example.com,Full Time,2025-04-20,2025-03-01,"ERP, Finance Portal, Expense System",8:00-18:00,high,30,yes,30,yes,Okta SSO',
      'SVC001,Backup,Service,backup-service@system.internal,Automated Process,Operations,machine,standard,not_applicable,not_applicable,no,,Data Center,john.smith@example.com,System,2025-01-15,N/A,"Backup System, Storage Access",,low,365,no,0,yes,Local',
      'API001,Payment,Gateway,api-monitor@example.com,External Service,Finance,api,limited,not_applicable,not_applicable,yes,api-key,Cloud,sarah.johnson@example.com,Service,2025-03-30,N/A,"Payment Processing System",,high,90,yes,15,yes,AWS IAM',
      'VEN001,Tech Support,Inc.,support@techsupport.example.com,Technical Support,External,third-party,limited,passport,US-State-Dept,yes,app,Remote,john.smith@example.com,Vendor,2025-04-01,2025-02-15,"Ticketing System, Knowledge Base",9:00-20:00,medium,45,yes,20,yes,External IDP'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'user-identity-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Function to save the identities
  const saveIdentities = () => {
    // Here you would typically send the identities to your backend
    // For now, we'll just show a success toast
    toast({
      title: 'Identities saved',
      description: `${identities.length} identities have been successfully saved.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Users className="mr-2 h-5 w-5 text-blue-600" />
            Universal Identity Verification System (UIVS)
          </DialogTitle>
          <DialogDescription>
            Import, review, and manage user identities across your organization
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="upload">
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload Identities
            </TabsTrigger>
            <TabsTrigger value="review" disabled={identities.length === 0}>
              <FileText className="mr-2 h-4 w-4" />
              Review Identities
            </TabsTrigger>
            <TabsTrigger value="help">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Help & Guidelines
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-6">
            <div className="border rounded-lg p-6 bg-blue-50">
              <h3 className="font-medium text-lg mb-4">Import User Identities</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload a CSV file containing your organization's identities. The file must follow our template format.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="identity-file" className="text-base">CSV File</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadTemplate}
                    className="flex items-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Input
                    id="identity-file"
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="flex-1"
                    disabled={isUploading}
                  />
                  
                  <Button
                    variant="default"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? 'Uploading...' : 'Upload File'}
                  </Button>
                </div>

                {importErrors.length > 0 && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTitle className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Import Errors
                    </AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                        {importErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                
                {identities.length > 0 && (
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <Badge className="bg-green-500">{identities.length} Identities</Badge>
                      <span className="ml-2 text-sm text-gray-600">Ready for review</span>
                    </div>
                    <Button onClick={() => setTab('review')}>
                      Review Identities
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="review" className="space-y-4">
            <h3 className="font-medium text-lg">Review Imported Identities</h3>
            <p className="text-sm text-gray-600 mb-4">
              Review the imported identities before saving. Currently displaying {identities.length} identities.
            </p>
            
            <div className="border rounded overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role / Department</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Access Level</TableHead>
                    <TableHead>MFA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {identities.map((identity, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{identity.user_id}</TableCell>
                      <TableCell>{identity.first_name} {identity.last_name}</TableCell>
                      <TableCell>{identity.email}</TableCell>
                      <TableCell>{identity.role} / {identity.department}</TableCell>
                      <TableCell>
                        <Badge variant={
                          identity.identity_type === 'human' ? 'default' :
                          identity.identity_type === 'machine' ? 'outline' :
                          identity.identity_type === 'api' ? 'secondary' : 'destructive'
                        }>
                          {identity.identity_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          identity.access_level === 'standard' ? 'default' :
                          identity.access_level === 'limited' ? 'outline' :
                          identity.access_level === 'admin' ? 'secondary' : 'destructive'
                        }>
                          {identity.access_level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {identity.mfa_enabled === 'yes' ? (
                          <Badge className="bg-green-500">Enabled</Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-500 border-red-500">Disabled</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="help" className="space-y-6">
            <h3 className="font-medium text-lg">User Identity Management Guidelines</h3>
            <p className="text-sm text-gray-600 mb-4">
              Learn how to effectively manage identities within the Universal Identity Verification System (UIVS).
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-base mb-2">CSV Format Requirements</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>File must be in CSV format</li>
                  <li>The first row must contain the column headers</li>
                  <li>All required fields must be populated</li>
                  <li>Each row represents a single identity</li>
                  <li>Use quotation marks for values containing commas</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-base mb-2">Identity Types</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><strong>Human:</strong> Employees, contractors, and staff</li>
                  <li><strong>Machine:</strong> Servers, workstations, and devices</li>
                  <li><strong>API:</strong> Application interfaces and services</li>
                  <li><strong>Third-party:</strong> Vendors, partners, and guests</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-base mb-2">Required Fields</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><strong>user_id:</strong> Unique identifier</li>
                  <li><strong>first_name, last_name:</strong> Identity names</li>
                  <li><strong>email:</strong> Contact email address</li>
                  <li><strong>role, department:</strong> Organizational context</li>
                  <li><strong>identity_type:</strong> Type of identity</li>
                  <li><strong>access_level:</strong> Level of access rights</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-base mb-2">Security Best Practices</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Enable MFA for all human users</li>
                  <li>Regularly review access levels and permissions</li>
                  <li>Set appropriate session timeout values</li>
                  <li>Configure login anomaly detection</li>
                  <li>Document system access requirements</li>
                </ul>
              </div>
            </div>
            
            <Textarea 
              className="w-full h-32 mt-4"
              placeholder="You can paste CSV data here as well..."
              onChange={(e) => {
                if (e.target.value.trim() !== '') {
                  // Process pasted CSV data
                  const text = e.target.value;
                  const file = new File([text], "pasted-data.csv", { type: "text/csv" });
                  
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(file);
                  
                  if (fileInputRef.current) {
                    const event = {
                      target: {
                        files: dataTransfer.files
                      }
                    } as unknown as React.ChangeEvent<HTMLInputElement>;
                    
                    handleFileUpload(event);
                  }
                }
              }}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          
          <Button
            disabled={identities.length === 0}
            onClick={saveIdentities}
          >
            Save {identities.length > 0 ? `${identities.length} Identities` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}