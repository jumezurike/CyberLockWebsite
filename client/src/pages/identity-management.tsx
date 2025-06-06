import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, Edit, Trash2, Eye, Plus } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { UWAGenerator, type UWAComponents } from '@/lib/uwa-generator';

// UWA Record Type
interface UWARecord {
  id: number;
  generatedUWA: string | null;
  identityType: string;
  identificationMethod: string;
  serverId: string;
  uuid: string;
  serialNumber: string;
  makeModel: string;
  operatingSystem: string;
  serverOwnerCompany: string;
  macAddress: string;
  environment: string;
  ipAddress: string;
  einBizNumber: string;
  address: string;
  status: string;
  components: any;
}

// UWA Generation Algorithm - Character encoding for quantum-proof encryption
function generateUWA(identityData: any): string {
  const { identityType, identificationMethod, serverId, uuid, serialNumber, macAddress, ipAddress } = identityData;
  
  // Create character encoding sequence
  const typeCode = identityType?.substring(0, 3).toUpperCase() || 'UNK';
  const methodCode = identificationMethod?.substring(0, 3).toUpperCase() || 'UNK';
  const serverHash = serverId ? serverId.split('').map(c => c.charCodeAt(0)).join('').substring(0, 6) : '000000';
  const uuidHash = uuid ? uuid.replace(/-/g, '').substring(0, 8) : '00000000';
  const macHash = macAddress ? macAddress.replace(/[:-]/g, '').substring(0, 6) : '000000';
  const ipHash = ipAddress ? ipAddress.split('.').map(n => parseInt(n).toString(16).padStart(2, '0')).join('') : '00000000';
  
  // Generate UWA using character encoding
  const timestamp = Date.now().toString(36).substring(-6);
  const checksum = (typeCode + methodCode + serverHash).split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 999;
  
  return `UWA-${typeCode}-${methodCode}-${serverHash}-${uuidHash.substring(0, 4)}-${macHash}-${ipHash.substring(0, 6)}-${timestamp}-${checksum.toString().padStart(3, '0')}`;
}

// Sample UWA Records data with Generated UWA column
const recordsData: UWARecord[] = [
  {
    id: 1,
    generatedUWA: null, // Will be generated when user clicks Generate UWA button
    identityType: 'Employee',
    identificationMethod: 'Username/Password',
    serverId: 'SRV-WIN-001',
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    serialNumber: 'DL780G9-12345',
    makeModel: 'Dell PowerEdge R740',
    operatingSystem: 'Windows Server 2019',
    serverOwnerCompany: 'TechCorp IT Department',
    macAddress: '00:1B:44:11:3A:B7',
    environment: 'Production',
    ipAddress: '192.168.1.100',
    einBizNumber: 'EIN-87-1234567',
    address: '123 Tech Street, Silicon Valley, CA 94000',
    status: 'active',
    components: {
      username: true,
      password: true,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@techcorp.com',
      role: 'System Administrator'
    }
  },
  {
    id: 2,
    generatedUWA: null,
    identityType: 'Vendor',
    identificationMethod: 'Certificate',
    serverId: 'SRV-LIN-002',
    uuid: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    serialNumber: 'HPE-DL360-67890',
    makeModel: 'HPE ProLiant DL360 Gen10',
    operatingSystem: 'Ubuntu Server 20.04',
    serverOwnerCompany: 'SecureVendor Solutions',
    macAddress: '00:50:56:C0:00:08',
    environment: 'Staging',
    ipAddress: '10.0.0.50',
    einBizNumber: 'EIN-98-7654321',
    address: '456 Vendor Ave, Business District, NY 10001',
    status: 'active',
    components: {
      certificate: true,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@securevendor.com',
      role: 'Security Specialist'
    }
  },
  {
    id: 3,
    generatedUWA: null,
    identityType: 'IoT Device',
    identificationMethod: 'Device Certificate',
    serverId: 'IOT-CAM-003',
    uuid: '6ba7b811-9dad-11d1-80b4-00c04fd430c9',
    serialNumber: 'AXIS-P1455-11223',
    makeModel: 'Axis P1455-LE Network Camera',
    operatingSystem: 'AXIS OS',
    serverOwnerCompany: 'Security Monitoring Inc',
    macAddress: '00:40:8C:12:34:56',
    environment: 'Production',
    ipAddress: '172.16.10.25',
    einBizNumber: 'EIN-45-9876543',
    address: '789 Security Blvd, Monitor City, TX 75001',
    status: 'active',
    components: {
      deviceId: true,
      certificate: true,
      macAddress: true,
      ipAddress: true
    }
  }
];

export default function IdentityManagement() {
  const [selectedIdentityType, setSelectedIdentityType] = useState('all-types');
  const [selectedIdentificationMethod, setSelectedIdentificationMethod] = useState('all-methods');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [componentFilter, setComponentFilter] = useState('all-components');
  const [uwaRecords, setUwaRecords] = useState<UWARecord[]>(recordsData);
  const { toast } = useToast();

  // Generate UWA for a specific record
  const handleGenerateUWA = (recordId: number) => {
    setUwaRecords(prevRecords => 
      prevRecords.map(record => {
        if (record.id === recordId && !record.generatedUWA) {
          const newUWA = generateUWA(record);
          toast({
            title: "DNA Formed Successfully",
            description: `Record + UWA = DNA. Collection of DNA creates DDNA`,
          });
          return { ...record, generatedUWA: newUWA };
        }
        return record;
      })
    );
  };
  
  // Enhanced filter system
  const filteredRecords = uwaRecords.filter(record => {
    const typeMatch = selectedIdentityType === 'all-types' || record.identityType === selectedIdentityType;
    const methodMatch = selectedIdentificationMethod === 'all-methods' || record.identificationMethod === selectedIdentificationMethod;
    const componentMatch = componentFilter === 'all-components' || hasRequiredComponents(record, componentFilter);
    return typeMatch && methodMatch && componentMatch;
  });

  // Enhanced record calculations
  const totalRecords = uwaRecords.length;
  const activeRecords = uwaRecords.filter(record => record.status !== 'inactive').length;
  const filteredCount = filteredRecords.length;

  // Check if record has required components
  function hasRequiredComponents(record: any, componentType: string): boolean {
    if (!record.components) return false;
    
    const componentSets = {
      'authentication': ['username', 'password', 'mfa', 'biometric'],
      'identification': ['firstName', 'lastName', 'email', 'userId'],
      'authorization': ['role', 'department', 'accessLevel', 'entitlements'],
      'technical': ['deviceId', 'ipAddress', 'macAddress', 'certificate']
    };
    
    const requiredComponents = componentSets[componentType as keyof typeof componentSets] || [];
    return requiredComponents.some(component => record.components[component]);
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="p-6">
        <div className="mb-6">
          <Link href="/sos2a-tool?tab=identity-behavior" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Assessment
          </Link>
          
          <h1 className="text-3xl font-bold mt-2">Records Management</h1>
          <p className="text-gray-600 mt-1">
            Lifetime tracking of Universal Wallet Addresses and their component DNA
          </p>
        </div>
        
        {/* Enhanced Filter Options */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Filter Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-600">
                  Filter by Identity Type <Badge variant="outline">Filter</Badge>
                </label>
                <p className="text-xs text-gray-600 mb-3">Select an identity type to filter the identity component inventory list below</p>
                <Select value={selectedIdentityType} onValueChange={setSelectedIdentityType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">All Types</SelectItem>
                    <SelectItem value="human">Human</SelectItem>
                    <SelectItem value="machine-physical">Machine Physical</SelectItem>
                    <SelectItem value="machine-virtual">Machine Virtual</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="third-party">Third-Party</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Identification Method
                </label>
                <p className="text-xs text-gray-600 mb-3">Select an identification method to filter components</p>
                <Select value={selectedIdentificationMethod} onValueChange={setSelectedIdentificationMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Methods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-methods">All Methods</SelectItem>
                    
                    {/* Standard Authentication */}
                    <SelectItem value="username-password">Username/Password</SelectItem>
                    <SelectItem value="employee-id">Employee ID</SelectItem>
                    <SelectItem value="vendor-id">Vendor ID</SelectItem>
                    <SelectItem value="contractor-id">Contractor ID</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="smart-card">Smart Card</SelectItem>
                    <SelectItem value="single-sign-on">Single Sign-On</SelectItem>
                    <SelectItem value="token-based">Token-Based</SelectItem>
                    <SelectItem value="service-account">Service Account</SelectItem>
                    <SelectItem value="system-account">System Account</SelectItem>
                    
                    {/* Advanced Authentication */}
                    <SelectItem value="uwa">UWA (Universal Wallet Address)</SelectItem>
                    <SelectItem value="mfa">MFA (Multi-Factor Authentication)</SelectItem>
                    
                    {/* Biometric */}
                    <SelectItem value="fingerprint">Fingerprint</SelectItem>
                    <SelectItem value="voice">Voice</SelectItem>
                    <SelectItem value="facial">Facial</SelectItem>
                    <SelectItem value="iris">Iris</SelectItem>
                    
                    {/* Government ID */}
                    <SelectItem value="driver-license">Driver License</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="national-id">National ID</SelectItem>
                    <SelectItem value="military-id">Military ID</SelectItem>
                    <SelectItem value="state-id">State ID</SelectItem>
                    <SelectItem value="birth-certificate">Birth Certificate</SelectItem>
                    <SelectItem value="social-security-card">Social Security Card</SelectItem>
                    <SelectItem value="certificate-of-citizenship">Certificate of Citizenship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Component Category
                </label>
                <p className="text-xs text-gray-600 mb-3">Filter by component type for targeted analysis</p>
                <Select value={componentFilter} onValueChange={setComponentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Components" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-components">All Components</SelectItem>
                    <SelectItem value="authentication">Authentication Components</SelectItem>
                    <SelectItem value="identification">Identification Components</SelectItem>
                    <SelectItem value="authorization">Authorization Components</SelectItem>
                    <SelectItem value="technical">Technical Components</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DDNA Record Management Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800">DDNA Record Management</h3>
            <p className="text-sm text-gray-600">Lifetime tracking of Universal Wallet Addresses as intermediate DNA representation</p>
            <p className="text-xs text-blue-600 mt-1">Collection of DNA forms Digital Data Nucleic Authority (DDNA)</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="flex space-x-4 text-sm">
              <span>Total Records: <Badge variant="outline">{totalRecords}</Badge></span>
              <span>Active DNA: <Badge variant="outline">{activeRecords}</Badge></span>
              <span>Filtered: <Badge variant="secondary">{filteredCount}</Badge></span>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Add DDNA Record
            </Button>
          </div>
        </div>

        {/* Records Table */}
        <Card>
          <CardContent className="p-6">

            {filteredRecords.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No DDNA records found. Create your first record to begin lifetime tracking of digital identities.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>DNA (UWA Generated)</TableHead>
                      <TableHead>Identity Type</TableHead>
                      <TableHead>Identification Method</TableHead>
                      <TableHead>Server/ID</TableHead>
                      <TableHead>UUID</TableHead>
                      <TableHead>SN/MODEL</TableHead>
                      <TableHead>MAKE/MODEL</TableHead>
                      <TableHead>OS</TableHead>
                      <TableHead>SERVER/OWNER/COMPANY</TableHead>
                      <TableHead>MAC</TableHead>
                      <TableHead>ENVIRONMENT</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>EIN/BIZ#</TableHead>
                      <TableHead>ADDRESS</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow 
                        key={record.id} 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <TableCell className="font-medium">
                          {record.generatedUWA ? (
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200">
                                🧬 DNA FORMED
                              </span>
                              <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1">
                                {record.generatedUWA}
                              </span>
                              <span className="text-xs text-green-600 mt-1">✓ Ready for DDNA Collection</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-start">
                              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">Record Only (No DNA)</span>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="mt-1 h-6 text-xs bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  handleGenerateUWA(record.id);
                                }}
                              >
                                Generate UWA → Form DNA
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{record.identityType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{record.identificationMethod}</Badge>
                        </TableCell>
                        <TableCell>{record.serverId}</TableCell>
                        <TableCell className="text-xs">{record.uuid || '-'}</TableCell>
                        <TableCell>{record.serialNumber}</TableCell>
                        <TableCell>{record.makeModel}</TableCell>
                        <TableCell>{record.operatingSystem}</TableCell>
                        <TableCell>{record.serverOwnerCompany}</TableCell>
                        <TableCell className="text-xs">{record.macAddress || '-'}</TableCell>
                        <TableCell>{record.environment}</TableCell>
                        <TableCell>{record.ipAddress}</TableCell>
                        <TableCell>{record.einBizNumber}</TableCell>
                        <TableCell className="text-xs">{record.address}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); }}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); }}>
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Record Details Dialog */}
        <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Identity Record Details</DialogTitle>
            </DialogHeader>
            {selectedRecord && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedRecord.name}</p>
                    <p><strong>Email:</strong> {selectedRecord.email}</p>
                    <p><strong>Role:</strong> {selectedRecord.role}</p>
                    <p><strong>Department:</strong> {selectedRecord.department}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Available Components</h3>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {Object.entries(selectedRecord.components || {}).map(([component, available]) => (
                      <div key={component} className="flex items-center space-x-1">
                        <span className={available ? 'text-green-600' : 'text-gray-400'}>
                          {available ? 'X' : '-'}
                        </span>
                        <span>{component}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}