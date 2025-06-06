import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, Edit, Trash2, Eye, Plus } from 'lucide-react';
import { Link } from 'wouter';

// Enhanced Records data - will connect to form submissions
const recordsData: any[] = [];

export default function IdentityManagement() {
  const [selectedIdentityType, setSelectedIdentityType] = useState('all-types');
  const [selectedIdentificationMethod, setSelectedIdentificationMethod] = useState('all-methods');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [componentFilter, setComponentFilter] = useState('all-components');
  
  // Enhanced filter system
  const filteredRecords = recordsData.filter(record => {
    const typeMatch = selectedIdentityType === 'all-types' || record.identityType === selectedIdentityType;
    const methodMatch = selectedIdentificationMethod === 'all-methods' || record.identificationMethod === selectedIdentificationMethod;
    const componentMatch = componentFilter === 'all-components' || hasRequiredComponents(record, componentFilter);
    return typeMatch && methodMatch && componentMatch;
  });

  // Enhanced record calculations
  const totalRecords = recordsData.length;
  const activeRecords = recordsData.filter(record => record.status !== 'inactive').length;
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
            </div>
          </CardContent>
        </Card>

        {/* Record Counters and Add Button */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-6 text-sm">
            <span>Total Records: <Badge variant="outline">{totalRecords}</Badge></span>
            <span>Active: <Badge variant="outline">{activeRecords}</Badge></span>
            <span>Filtered: <Badge variant="secondary">{filteredCount}</Badge></span>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Add UWA Record
          </Button>
        </div>

        {/* Records Table */}
        <Card>
          <CardContent className="p-6">

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