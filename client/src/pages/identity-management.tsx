import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'wouter';

// UWA Records with complete identity component tracking
const uwaRecordsData = [
  {
    id: 'EMP001',
    uwaGenerated: 'UWA-HUM-001-2025',
    identityType: 'human',
    identificationMethod: 'biometric',
    serverId: 'AD-SRV-01',
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    snModel: 'EMP-BADGE-001',
    makeModel: 'HID ProxCard',
    os: 'Windows 11',
    serverOwnerCompany: 'CyberLockX Internal',
    mac: '00:1B:44:11:3A:B7',
    environment: 'Production',
    ipAddress: '192.168.1.100',
    einBiz: 'EIN-123456789',
    address: '123 Business Ave, Tech City, TC 12345',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'IT Manager',
    department: 'Information Technology',
    components: {
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      userId: true,
      role: true,
      department: true,
      biometric: true,
      governmentId: true,
      mfa: true,
      location: true,
      manager: true,
      accessLevel: true,
      assignedRoles: true,
      entitlements: true
    }
  },
  {
    id: 'SVC001',
    uwaGenerated: 'UWA-MAC-001-2025',
    identityType: 'machine-physical',
    identificationMethod: 'certificate',
    serverId: 'BACKUP-SRV-01',
    uuid: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    snModel: 'DELL-PE-R750',
    makeModel: 'Dell PowerEdge R750',
    os: 'Ubuntu Server 22.04',
    serverOwnerCompany: 'CyberLockX Internal',
    mac: '00:50:56:A0:00:01',
    environment: 'Production',
    ipAddress: '192.168.1.50',
    einBiz: 'EIN-123456789',
    address: 'Data Center A, Rack 15',
    name: 'Backup Service',
    email: 'backup-service@system.internal',
    role: 'Automated Process',
    department: 'Operations',
    components: {
      deviceId: true,
      serialNumber: true,
      manufacturer: true,
      model: true,
      operatingSystem: true,
      macAddress: true,
      ipAddress: true,
      certificate: true,
      location: true,
      assignedDepartment: true,
      accessLevel: true,
      networkSegment: true
    }
  },
  {
    id: 'API001',
    uwaGenerated: 'UWA-API-001-2025',
    identityType: 'api',
    identificationMethod: 'api-key',
    serverId: 'PAY-API-01',
    uuid: null,
    snModel: 'STRIPE-API-V2',
    makeModel: 'Stripe Payment API',
    os: 'Cloud Service',
    serverOwnerCompany: 'Stripe Inc.',
    mac: null,
    environment: 'Production',
    ipAddress: '52.14.118.240',
    einBiz: 'EIN-987654321',
    address: 'Cloud Infrastructure',
    name: 'Payment Gateway',
    email: 'api-monitor@example.com',
    role: 'External Service',
    department: 'Finance',
    components: {
      apiKey: true,
      serviceEndpoint: true,
      accessLevel: true,
      rateLimit: true,
      authentication: true,
      authorization: true,
      monitoring: true,
      logging: true
    }
  }
];

export default function IdentityManagement() {
  const [selectedIdentityType, setSelectedIdentityType] = useState('all-types');
  const [selectedIdentificationMethod, setSelectedIdentificationMethod] = useState('all-methods');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  
  // Filter records based on selected filters
  const filteredRecords = uwaRecordsData.filter(record => {
    const typeMatch = selectedIdentityType === 'all-types' || record.identityType === selectedIdentityType;
    const methodMatch = selectedIdentificationMethod === 'all-methods' || record.identificationMethod === selectedIdentificationMethod;
    return typeMatch && methodMatch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="p-6">
        <div className="mb-6">
          <Link href="/sos2a-tool?tab=identity-behavior" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Assessment
          </Link>
          
          <h1 className="text-3xl font-bold mt-2">UWA Records Management</h1>
          <p className="text-gray-600 mt-1">
            Universal Wallet Address component tracking and identity management system.
          </p>
        </div>
        
        {/* Filter Options */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Filter Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <SelectItem value="username-password">Username/Password</SelectItem>
                    <SelectItem value="biometric">Biometric</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="token-based">Token-Based</SelectItem>
                    <SelectItem value="multi-factor">Multi-Factor</SelectItem>
                    <SelectItem value="api-key">API Key</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* UWA Records Table */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">UWA Records</h2>
              <div className="text-sm text-gray-600">
                Showing {filteredRecords.length} records
              </div>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No UWA records found. Create your first record to begin tracking digital identities.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>UWA(Generated)</TableHead>
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
                        <TableCell className="font-medium">{record.uwaGenerated}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{record.identityType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{record.identificationMethod}</Badge>
                        </TableCell>
                        <TableCell>{record.serverId}</TableCell>
                        <TableCell className="text-xs">{record.uuid || '-'}</TableCell>
                        <TableCell>{record.snModel}</TableCell>
                        <TableCell>{record.makeModel}</TableCell>
                        <TableCell>{record.os}</TableCell>
                        <TableCell>{record.serverOwnerCompany}</TableCell>
                        <TableCell className="text-xs">{record.mac || '-'}</TableCell>
                        <TableCell>{record.environment}</TableCell>
                        <TableCell>{record.ipAddress}</TableCell>
                        <TableCell>{record.einBiz}</TableCell>
                        <TableCell className="text-xs">{record.address}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); }}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); }}>
                              <Trash2 className="h-3 w-3" />
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