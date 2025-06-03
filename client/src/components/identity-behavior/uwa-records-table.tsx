import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, Eye, Save, X } from "lucide-react";
import { UWAGenerator, type UWAComponents, type UWARecord } from "@/lib/uwa-generator";
import { useToast } from "@/hooks/use-toast";

export const UwaRecordsTable = () => {
  const [records, setRecords] = useState<UWARecord[]>([]);
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [editingRecord, setEditingRecord] = useState<UWARecord | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<string>("");
  const [components, setComponents] = useState<UWAComponents>({});
  const [recordCounter, setRecordCounter] = useState(1);
  
  // Filter states
  const [filterIdentityType, setFilterIdentityType] = useState<string>("all");
  const [filterIdentificationMethod, setFilterIdentificationMethod] = useState<string>("all");
  
  const { toast } = useToast();

  // Helper function to format UWA in 7-character chunks
  const formatUWAChunks = (uwa: string): string => {
    const chunks: string[] = [];
    for (let i = 0; i < uwa.length; i += 7) {
      chunks.push(uwa.substring(i, i + 7));
    }
    return chunks.join('-');
  };

  // Filter records based on selected filters
  const filteredRecords = records.filter(record => {
    const identityTypeMatch = filterIdentityType === "all" || record.entityType === filterIdentityType;
    const methodMatch = filterIdentificationMethod === "all" || record.components.name?.toLowerCase().includes(filterIdentificationMethod.toLowerCase());
    return identityTypeMatch && methodMatch;
  });

  // Handle component input changes
  const handleComponentChange = useCallback((field: keyof UWAComponents, value: string) => {
    setComponents(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Generate UWA from components
  const generateUWA = useCallback(() => {
    if (!selectedEntityType) {
      toast({
        title: "Entity Type Required",
        description: "Please select an entity type before generating UWA",
        variant: "destructive"
      });
      return;
    }

    try {
      const uwa = UWAGenerator.generateUWA(selectedEntityType, components);
      
      const newRecord: UWARecord = {
        id: recordCounter,
        uwa,
        entityType: selectedEntityType as any,
        components: { ...components },
        createdAt: new Date(),
        isActive: true
      };

      setRecords(prev => [...prev, newRecord]);
      setRecordCounter(prev => prev + 1);
      setComponents({});
      setSelectedEntityType("");
      setIsAddingRecord(false);

      toast({
        title: "UWA Generated Successfully",
        description: `New UWA record #${recordCounter} created: ${formatUWAChunks(uwa).substring(0, 23)}...`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate UWA",
        variant: "destructive"
      });
    }
  }, [selectedEntityType, components, recordCounter, toast]);

  // Update existing record
  const updateRecord = useCallback(() => {
    if (!editingRecord) return;

    try {
      const updatedUWA = UWAGenerator.generateUWA(editingRecord.entityType, components);
      
      setRecords(prev => prev.map(record => 
        record.id === editingRecord.id 
          ? {
              ...record,
              uwa: updatedUWA,
              components: { ...components },
              updatedAt: new Date()
            }
          : record
      ));

      setEditingRecord(null);
      setComponents({});
      setSelectedEntityType("");

      toast({
        title: "Record Updated",
        description: `UWA record #${editingRecord.id} has been updated`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update record",
        variant: "destructive"
      });
    }
  }, [editingRecord, components, toast]);

  // Delete record
  const deleteRecord = useCallback((id: number) => {
    setRecords(prev => prev.filter(record => record.id !== id));
    toast({
      title: "Record Deleted",
      description: `UWA record #${id} has been permanently deleted`,
    });
  }, [toast]);

  // Start editing record
  const startEditing = useCallback((record: UWARecord) => {
    setEditingRecord(record);
    setComponents(record.components);
    setSelectedEntityType(record.entityType);
  }, []);

  // Cancel editing
  const cancelEditing = useCallback(() => {
    setEditingRecord(null);
    setComponents({});
    setSelectedEntityType("");
    setIsAddingRecord(false);
  }, []);

  // Component input fields for different entity types
  const renderComponentFields = () => {
    const commonFields = (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={components.name || ""}
              onChange={(e) => handleComponentChange("name", e.target.value)}
              placeholder="e.g., Josiah J. Umezurike"
            />
          </div>
          <div>
            <Label htmlFor="address">Address (Google Open Location)</Label>
            <Input
              id="address"
              value={components.address || ""}
              onChange={(e) => handleComponentChange("address", e.target.value)}
              placeholder="e.g., 1225 Laurel St. Columbia, SC 29201->2X57+XH"
            />
          </div>
        </div>
      </>
    );

    switch (selectedEntityType) {
      case 'physical-machine':
      case 'virtual-machine':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instanceUuid">Instance UUID</Label>
                <Input
                  id="instanceUuid"
                  value={components.instanceUuid || ""}
                  onChange={(e) => handleComponentChange("instanceUuid", e.target.value)}
                  placeholder="e.g., 1c-49ca-47ae-bebe-4087c52abbf4"
                />
              </div>
              <div>
                <Label htmlFor="environment">Environment</Label>
                <Select value={components.environment || ""} onValueChange={(value) => handleComponentChange("environment", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PR">Production (PR)</SelectItem>
                    <SelectItem value="ST">Staging (ST)</SelectItem>
                    <SelectItem value="TD">Test/Dev (TD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="osName">OS Name</Label>
                <Input
                  id="osName"
                  value={components.osName || ""}
                  onChange={(e) => handleComponentChange("osName", e.target.value)}
                  placeholder="e.g., centosl"
                />
              </div>
              <div>
                <Label htmlFor="address">Address (Google Location)</Label>
                <Input
                  id="address"
                  value={components.address || ""}
                  onChange={(e) => handleComponentChange("address", e.target.value)}
                  placeholder="e.g., 2X57+XH"
                />
              </div>
            </div>
          </div>
        );

      case 'business-owner':
        return (
          <div className="space-y-4">
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  value={components.dateOfBirth || ""}
                  onChange={(e) => handleComponentChange("dateOfBirth", e.target.value)}
                  placeholder="MM/DD/YYYY - e.g., 03/23/1974"
                />
              </div>
              <div>
                <Label htmlFor="phoneEinSsn">EIN/SSN/BVN</Label>
                <Input
                  id="phoneEinSsn"
                  value={components.phoneEinSsn || ""}
                  onChange={(e) => handleComponentChange("phoneEinSsn", e.target.value)}
                  placeholder="e.g., 83-2086239"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="imeiSn">IMEI/Serial Number</Label>
                <Input
                  id="imeiSn"
                  value={components.imeiSn || ""}
                  onChange={(e) => handleComponentChange("imeiSn", e.target.value)}
                  placeholder="e.g., 6732448576765342"
                />
              </div>
              <div>
                <Label htmlFor="birthplace">Birthplace (Google Location)</Label>
                <Input
                  id="birthplace"
                  value={components.birthplace || ""}
                  onChange={(e) => handleComponentChange("birthplace", e.target.value)}
                  placeholder="e.g., GXCR+WF"
                />
              </div>
            </div>
          </div>
        );

      case 'human-individual':
        return (
          <div className="space-y-4">
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  value={components.dateOfBirth || ""}
                  onChange={(e) => handleComponentChange("dateOfBirth", e.target.value)}
                  placeholder="MM/DD/YYYY - e.g., 03/23/1974"
                />
              </div>
              <div>
                <Label htmlFor="phoneEinSsn">Phone/EIN/SSN</Label>
                <Input
                  id="phoneEinSsn"
                  value={components.phoneEinSsn || ""}
                  onChange={(e) => handleComponentChange("phoneEinSsn", e.target.value)}
                  placeholder="e.g., 83-2086239"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="imeiSn">IMEI/Device Serial</Label>
                <Input
                  id="imeiSn"
                  value={components.imeiSn || ""}
                  onChange={(e) => handleComponentChange("imeiSn", e.target.value)}
                  placeholder="e.g., 6732448576765342"
                />
              </div>
              <div>
                <Label htmlFor="birthplace">Birthplace (Google Location)</Label>
                <Input
                  id="birthplace"
                  value={components.birthplace || ""}
                  onChange={(e) => handleComponentChange("birthplace", e.target.value)}
                  placeholder="e.g., GXCR+WF"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="driverLicensePassport">Driver License/Passport</Label>
              <Input
                id="driverLicensePassport"
                value={components.driverLicensePassport || ""}
                onChange={(e) => handleComponentChange("driverLicensePassport", e.target.value)}
                placeholder="Alphanumeric identifier"
              />
            </div>
          </div>
        );

      case 'machine-auto':
        return (
          <div className="space-y-4">
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfManufacture">Date of Manufacture</Label>
                <Input
                  id="dateOfManufacture"
                  value={components.dateOfManufacture || ""}
                  onChange={(e) => handleComponentChange("dateOfManufacture", e.target.value)}
                  placeholder="MM/YY - e.g., 12/09"
                />
              </div>
              <div>
                <Label htmlFor="vinNumber">VIN Number</Label>
                <Input
                  id="vinNumber"
                  value={components.vinNumber || ""}
                  onChange={(e) => handleComponentChange("vinNumber", e.target.value)}
                  placeholder="Vehicle Identification Number"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plateNumber">Plate Number</Label>
                <Input
                  id="plateNumber"
                  value={components.plateNumber || ""}
                  onChange={(e) => handleComponentChange("plateNumber", e.target.value)}
                  placeholder="License plate number"
                />
              </div>
              <div>
                <Label htmlFor="imeiSn">IMEI/Device Serial</Label>
                <Input
                  id="imeiSn"
                  value={components.imeiSn || ""}
                  onChange={(e) => handleComponentChange("imeiSn", e.target.value)}
                  placeholder="Device identifier"
                />
              </div>
            </div>
          </div>
        );

      case 'user-account':
      case 'service-account':
        return (
          <div className="space-y-4">
            {commonFields}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  value={components.dateOfBirth || ""}
                  onChange={(e) => handleComponentChange("dateOfBirth", e.target.value)}
                  placeholder="MM/DD/YYYY - e.g., 03/23/1974"
                />
              </div>
              <div>
                <Label htmlFor="phoneEinSsn">Phone/EIN/SSN</Label>
                <Input
                  id="phoneEinSsn"
                  value={components.phoneEinSsn || ""}
                  onChange={(e) => handleComponentChange("phoneEinSsn", e.target.value)}
                  placeholder="e.g., 83-2086239"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="imeiSn">IMEI/Serial Number</Label>
                <Input
                  id="imeiSn"
                  value={components.imeiSn || ""}
                  onChange={(e) => handleComponentChange("imeiSn", e.target.value)}
                  placeholder="e.g., 6732448576765342"
                />
              </div>
              <div>
                <Label htmlFor="birthplace">Birthplace (Google Location)</Label>
                <Input
                  id="birthplace"
                  value={components.birthplace || ""}
                  onChange={(e) => handleComponentChange("birthplace", e.target.value)}
                  placeholder="e.g., GXCR+WF"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="driverLicensePassport">Driver License/Passport</Label>
              <Input
                id="driverLicensePassport"
                value={components.driverLicensePassport || ""}
                onChange={(e) => handleComponentChange("driverLicensePassport", e.target.value)}
                placeholder="Alphanumeric identifier"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Please select an entity type to see component fields
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>UWA Records Management</CardTitle>
          <CardDescription>
            Lifetime tracking of Universal Wallet Addresses and their component DNA
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter and Add Record Section */}
          <div className="space-y-4 mb-6">
            {/* Filter Controls */}
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Label htmlFor="filter-identity-type" className="text-sm font-medium">Filter by Identity Type</Label>
                <Select value={filterIdentityType} onValueChange={setFilterIdentityType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="physical-machine">Physical Machine</SelectItem>
                    <SelectItem value="virtual-machine">Virtual Machine</SelectItem>
                    <SelectItem value="human-individual">Human/Individual</SelectItem>
                    <SelectItem value="business-owner">Business Owner</SelectItem>
                    <SelectItem value="user-account">User Account</SelectItem>
                    <SelectItem value="service-account">Service Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Label htmlFor="filter-identification-method" className="text-sm font-medium">Identification Method</Label>
                <Select value={filterIdentificationMethod} onValueChange={setFilterIdentificationMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Methods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="username">Username/Password</SelectItem>
                    <SelectItem value="employee">Employee ID</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="smart-card">Smart Card</SelectItem>
                    <SelectItem value="sso">Single Sign-On</SelectItem>
                    <SelectItem value="token">Token-based</SelectItem>
                    <SelectItem value="uwa">UWA</SelectItem>
                    <SelectItem value="mfa">MFA</SelectItem>
                    <SelectItem value="fingerprint">Fingerprint</SelectItem>
                    <SelectItem value="voice">Voice</SelectItem>
                    <SelectItem value="facial">Facial</SelectItem>
                    <SelectItem value="iris">Iris</SelectItem>
                    <SelectItem value="driver-license">Driver License</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="national-id">National ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Stats and Add Button */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Total Records: {records.length}</Badge>
                <Badge variant="outline">Active: {records.filter(r => r.isActive).length}</Badge>
                <Badge variant="secondary">Filtered: {filteredRecords.length}</Badge>
              </div>
              <Button onClick={() => setIsAddingRecord(true)} disabled={isAddingRecord || !!editingRecord}>
                <Plus className="h-4 w-4 mr-2" />
                Add UWA Record
              </Button>
            </div>
          </div>

          {/* Add/Edit Form */}
          {(isAddingRecord || editingRecord) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingRecord ? `Edit Record #${editingRecord.id}` : 'Create New UWA Record'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="entityType">Entity Type</Label>
                  <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physical-machine">Physical Machine</SelectItem>
                      <SelectItem value="virtual-machine">Virtual Machine</SelectItem>
                      <SelectItem value="human-individual">Human/Individual</SelectItem>
                      <SelectItem value="business-owner">Business Owner</SelectItem>
                      <SelectItem value="user-account">User Account</SelectItem>
                      <SelectItem value="service-account">Service Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {renderComponentFields()}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={cancelEditing}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={editingRecord ? updateRecord : generateUWA}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingRecord ? 'Update Record' : 'Generate UWA'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Records Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-xs">UWA(Generated)</TableHead>
                  <TableHead className="w-[90px] text-xs">Identity type</TableHead>
                  <TableHead className="w-[100px] text-xs">Identification method</TableHead>
                  <TableHead className="w-[70px] text-xs">Server/ID</TableHead>
                  <TableHead className="w-[70px] text-xs">UUID</TableHead>
                  <TableHead className="w-[70px] text-xs">SN/MODEL</TableHead>
                  <TableHead className="w-[70px] text-xs">MAKE/MODEL</TableHead>
                  <TableHead className="w-[50px] text-xs">OS</TableHead>
                  <TableHead className="w-[90px] text-xs">SERVER/OWNER/COMPANY</TableHead>
                  <TableHead className="w-[60px] text-xs">MAC</TableHead>
                  <TableHead className="w-[80px] text-xs">ENVIRONMENT</TableHead>
                  <TableHead className="w-[90px] text-xs">IP address</TableHead>
                  <TableHead className="w-[70px] text-xs">EIN/BIZ#</TableHead>
                  <TableHead className="w-[80px] text-xs">ADDRESS</TableHead>
                  <TableHead className="w-[80px] text-xs">Created</TableHead>
                  <TableHead className="w-[80px] text-xs">Updated</TableHead>
                  <TableHead className="w-[70px] text-xs">Status</TableHead>
                  <TableHead className="w-[100px] text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={18} className="text-center py-8 text-gray-500">
                      {records.length === 0 
                        ? "No UWA records found. Create your first record to begin tracking digital identities."
                        : "No records match the current filters. Try adjusting your filter criteria."
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-xs">
                        {formatUWAChunks(record.uwa).substring(0, 15)}...
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="secondary" className="text-xs">
                          {record.entityType.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {record.components.name || 'X'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {record.components.serverId || 'X'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {record.components.instanceUuid ? record.components.instanceUuid.substring(0, 8) + '...' : 'X'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {record.components.serialNumber || 'X'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {record.components.makeModelOs || 'X'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {record.components.osName || 'X'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {record.components.businessCertifications || 'X'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {record.components.macAddress || 'X'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {record.components.environment || 'X'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {record.components.ipAddress || 'X'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {record.components.phoneEinSsn || 'X'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {record.components.address || 'X'}
                      </TableCell>
                      <TableCell className="text-xs text-gray-600">
                        {record.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-xs text-gray-600">
                        {record.updatedAt ? record.updatedAt.toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.isActive ? "default" : "secondary"} className="text-xs">
                          {record.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>UWA Record #{record.id} Details</DialogTitle>
                                <DialogDescription>
                                  Complete component breakdown and UWA generation details
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Generated UWA</Label>
                                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                                    {record.uwa}
                                  </div>
                                </div>
                                <div>
                                  <Label>Components Used</Label>
                                  <div className="bg-gray-50 p-4 rounded space-y-2">
                                    {Object.entries(record.components).map(([key, value]) => (
                                      value && (
                                        <div key={key} className="flex justify-between">
                                          <span className="font-medium capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                                          </span>
                                          <span className="font-mono text-sm">{value}</span>
                                        </div>
                                      )
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => startEditing(record)}
                            disabled={!!editingRecord || isAddingRecord}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteRecord(record.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
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
    </div>
  );
};