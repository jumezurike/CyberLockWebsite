import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, RefreshCw, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// The 31+ identity components as specified
const identityComponents = [
  { id: "name", label: "Name", category: "Personal" },
  { id: "address", label: "Address", category: "Personal" },
  { id: "birthplace", label: "Birthplace", category: "Personal" },
  { id: "dateOfBirth", label: "Date of Birth", category: "Personal" },
  { id: "pin", label: "PIN", category: "Security", uwaUsed: false, note: "Not used for UWA - changes often" },
  { id: "snImei", label: "SN/IMEI", category: "Device" },
  { id: "phoneEinSsnBvn", label: "Ph#/EIN/SSN/BVN", category: "Identity" },
  { id: "driverLicensePassport", label: "Driver License/Passport", category: "Identity" },
  { id: "primaryAuthDeviceImei", label: "Primary Auth Device IMEI/IOT S/N", category: "Device" },
  { id: "makeModelOs", label: "Make/Model+OS", category: "Device" },
  { id: "dateOfManufacture", label: "Manufacturing Date (DOM)", category: "Device" },
  { id: "ec2DoIdMacSn", label: "EC2/DO ID/MAC/SN", category: "Server" },
  { id: "os", label: "OS", category: "Server" },
  { id: "uuid", label: "UUID", category: "Server" },
  { id: "serverId", label: "Server ID", category: "Server" },
  { id: "environment", label: "Environment (PR/ST/TD)", category: "Server" },
  { id: "ipAddress", label: "IP Address", category: "Network" },
  { id: "businessCertifications", label: "Business Certifications", category: "Business" },
  { id: "businessLicenses", label: "Business Licenses", category: "Business" },
  { id: "utilityBills", label: "Utility Bills", category: "Business" },
  // Additional components for comprehensive coverage
  { id: "macAddress", label: "MAC Address", category: "Network" },
  { id: "vinNumber", label: "VIN Number", category: "Vehicle" },
  { id: "plateNumber", label: "Plate Number", category: "Vehicle" },
  { id: "apiKey", label: "API Key", category: "API" },
  { id: "clientId", label: "Client ID", category: "API" },
  { id: "certificateFingerprint", label: "Certificate Fingerprint", category: "Security" },
  { id: "publicKeyHash", label: "Public Key Hash", category: "Security" },
  { id: "biometricHash", label: "Biometric Hash", category: "Biometric" },
  { id: "geolocationCode", label: "Geolocation Code", category: "Location" },
  { id: "organizationId", label: "Organization ID", category: "Organizational" },
  { id: "departmentCode", label: "Department Code", category: "Organizational" },
  // Avatar Identity Components - Intermediate Category
  { id: "avatarPicture", label: "Avatar Picture", category: "Intermediate", identityType: "Avatar", identificationType: "Picture" },
  { id: "pictureHash", label: "Picture Hash", category: "Intermediate", identityType: "Avatar", identificationType: "Picture" }
];

// Default configuration based on your specifications
const defaultConfiguration = {
  human: {
    name: true,
    address: true,
    birthplace: true,
    dateOfBirth: true,
    pin: false, // Not used for UWA
    snImei: true,
    phoneEinSsnBvn: true,
    driverLicensePassport: true,
    primaryAuthDeviceImei: true,
    makeModelOs: true,
    dateOfManufacture: false,
    ec2DoIdMacSn: false,
    os: false,
    uuid: false,
    serverId: false,
    environment: false,
    ipAddress: false,
    businessCertifications: false,
    businessLicenses: false,
    utilityBills: false,
    macAddress: false,
    vinNumber: false,
    plateNumber: false,
    apiKey: false,
    clientId: false,
    certificateFingerprint: false,
    publicKeyHash: false,
    biometricHash: false,
    geolocationCode: false,
    organizationId: false,
    departmentCode: false,
    avatarPicture: false,
    pictureHash: false
  },
  machine: {
    name: false,
    address: true,
    birthplace: false,
    dateOfBirth: false,
    pin: false,
    snImei: true,
    phoneEinSsnBvn: false,
    driverLicensePassport: false,
    primaryAuthDeviceImei: false,
    makeModelOs: true,
    dateOfManufacture: true,
    ec2DoIdMacSn: true,
    os: true,
    uuid: true,
    serverId: true,
    environment: true,
    ipAddress: true,
    businessCertifications: false,
    businessLicenses: false,
    utilityBills: false,
    macAddress: true,
    vinNumber: false,
    plateNumber: false,
    apiKey: false,
    clientId: false,
    certificateFingerprint: false,
    publicKeyHash: false,
    biometricHash: false,
    geolocationCode: false,
    organizationId: false,
    departmentCode: false,
    avatarPicture: false,
    pictureHash: false
  },
  api: {
    name: false,
    address: false,
    birthplace: false,
    dateOfBirth: false,
    pin: false,
    snImei: false,
    phoneEinSsnBvn: false,
    driverLicensePassport: false,
    primaryAuthDeviceImei: false,
    makeModelOs: false,
    dateOfManufacture: false,
    ec2DoIdMacSn: true,
    os: true,
    uuid: true,
    serverId: true,
    environment: true,
    ipAddress: true,
    businessCertifications: false,
    businessLicenses: false,
    utilityBills: false,
    macAddress: false,
    vinNumber: false,
    plateNumber: false,
    apiKey: true,
    clientId: true,
    certificateFingerprint: true,
    publicKeyHash: true,
    biometricHash: false,
    geolocationCode: false,
    organizationId: true,
    departmentCode: false,
    avatarPicture: false,
    pictureHash: false
  },
  thirdParty: {
    name: true,
    address: true,
    birthplace: false,
    dateOfBirth: false,
    pin: false,
    snImei: false,
    phoneEinSsnBvn: true,
    driverLicensePassport: false,
    primaryAuthDeviceImei: false,
    makeModelOs: false,
    dateOfManufacture: false,
    ec2DoIdMacSn: false,
    os: false,
    uuid: false,
    serverId: false,
    environment: false,
    ipAddress: false,
    businessCertifications: true,
    businessLicenses: true,
    utilityBills: true,
    macAddress: false,
    vinNumber: false,
    plateNumber: false,
    apiKey: false,
    clientId: false,
    certificateFingerprint: true,
    publicKeyHash: false,
    biometricHash: false,
    geolocationCode: false,
    organizationId: true,
    departmentCode: false,
    avatarPicture: false,
    pictureHash: false
  },
  avatar: {
    name: false,
    address: false,
    birthplace: false,
    dateOfBirth: false,
    pin: false,
    snImei: false,
    phoneEinSsnBvn: false,
    driverLicensePassport: false,
    primaryAuthDeviceImei: false,
    makeModelOs: false,
    dateOfManufacture: false,
    ec2DoIdMacSn: false,
    os: false,
    uuid: false,
    serverId: false,
    environment: false,
    ipAddress: false,
    businessCertifications: false,
    businessLicenses: false,
    utilityBills: false,
    macAddress: false,
    vinNumber: false,
    plateNumber: false,
    apiKey: false,
    clientId: false,
    certificateFingerprint: false,
    publicKeyHash: false,
    biometricHash: false,
    geolocationCode: false,
    organizationId: false,
    departmentCode: false,
    avatarPicture: true,
    pictureHash: true
  }
};

export const UwaComponentMatrix = () => {
  const [configuration, setConfiguration] = useState(defaultConfiguration);
  const [isModified, setIsModified] = useState(false);
  const { toast } = useToast();

  // Handle component selection change
  const handleComponentChange = useCallback((entityType: keyof typeof configuration, componentId: string, checked: boolean) => {
    setConfiguration(prev => ({
      ...prev,
      [entityType]: {
        ...prev[entityType],
        [componentId]: checked
      }
    }));
    setIsModified(true);
  }, []);

  // Reset to default configuration
  const resetToDefault = useCallback(() => {
    setConfiguration(defaultConfiguration);
    setIsModified(false);
    toast({
      title: "Configuration Reset",
      description: "UWA component matrix has been reset to default settings.",
    });
  }, [toast]);

  // Save configuration
  const saveConfiguration = useCallback(() => {
    // Here you would typically save to your backend/storage
    localStorage.setItem('uwaComponentMatrix', JSON.stringify(configuration));
    setIsModified(false);
    toast({
      title: "Configuration Saved",
      description: "UWA component matrix configuration has been saved successfully.",
    });
  }, [configuration, toast]);

  // Get component count for each entity type
  const getComponentCount = (entityType: keyof typeof configuration) => {
    return Object.values(configuration[entityType]).filter(Boolean).length;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>UWA Component Selection Matrix</CardTitle>
          <CardDescription>
            Select the components needed for your UWA intermediate representation. Required fields depend on identity type. 
            Organizations can customize which fields to include in their UWA generation based on their specific needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Organizations can override the default configuration. All 31 identity components can be used to create a customized UWA.
              PIN is excluded by default as it changes frequently and compromises UWA stability.
            </AlertDescription>
          </Alert>

          {/* Entity Type Summary */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold text-purple-700">Human</div>
              <Badge variant="secondary">{getComponentCount('human')} components</Badge>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold text-blue-700">Machine</div>
              <Badge variant="secondary">{getComponentCount('machine')} components</Badge>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold text-green-700">API</div>
              <Badge variant="secondary">{getComponentCount('api')} components</Badge>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold text-orange-700">Third-Party</div>
              <Badge variant="secondary">{getComponentCount('thirdParty')} components</Badge>
            </div>
          </div>

          {/* Component Matrix Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Components of Identification</TableHead>
                  <TableHead className="text-center w-1/6">
                    <div className="text-purple-700 font-semibold">Human</div>
                  </TableHead>
                  <TableHead className="text-center w-1/6">
                    <div className="text-blue-700 font-semibold">Machine</div>
                  </TableHead>
                  <TableHead className="text-center w-1/6">
                    <div className="text-green-700 font-semibold">API</div>
                  </TableHead>
                  <TableHead className="text-center w-1/6">
                    <div className="text-orange-700 font-semibold">Third-Party</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {identityComponents.map((component) => (
                  <TableRow key={component.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{component.label}</div>
                        {component.note && (
                          <div className="text-xs text-red-600 mt-1">{component.note}</div>
                        )}
                        <Badge variant="outline" className="text-xs mt-1">
                          {component.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {component.uwaUsed === false ? (
                        <span className="text-red-500 text-xs">Not used for UWA</span>
                      ) : (
                        <Checkbox
                          checked={configuration.human[component.id as keyof typeof configuration.human]}
                          onCheckedChange={(checked) => 
                            handleComponentChange('human', component.id, checked as boolean)
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {component.uwaUsed === false ? (
                        <span className="text-red-500 text-xs">Not used for UWA</span>
                      ) : (
                        <Checkbox
                          checked={configuration.machine[component.id as keyof typeof configuration.machine]}
                          onCheckedChange={(checked) => 
                            handleComponentChange('machine', component.id, checked as boolean)
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {component.uwaUsed === false ? (
                        <span className="text-red-500 text-xs">Not used for UWA</span>
                      ) : (
                        <Checkbox
                          checked={configuration.api[component.id as keyof typeof configuration.api]}
                          onCheckedChange={(checked) => 
                            handleComponentChange('api', component.id, checked as boolean)
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {component.uwaUsed === false ? (
                        <span className="text-red-500 text-xs">Not used for UWA</span>
                      ) : (
                        <Checkbox
                          checked={configuration.thirdParty[component.id as keyof typeof configuration.thirdParty]}
                          onCheckedChange={(checked) => 
                            handleComponentChange('thirdParty', component.id, checked as boolean)
                          }
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6">
            <Button variant="outline" onClick={resetToDefault}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
            
            <div className="space-x-2">
              {isModified && (
                <Badge variant="secondary">Unsaved changes</Badge>
              )}
              <Button onClick={saveConfiguration} disabled={!isModified}>
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>
            </div>
          </div>

          {/* Configuration Preview */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Current Configuration Summary</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Human: {getComponentCount('human')} of {identityComponents.filter(c => c.uwaUsed !== false).length} components selected</div>
              <div>Machine: {getComponentCount('machine')} of {identityComponents.filter(c => c.uwaUsed !== false).length} components selected</div>
              <div>API: {getComponentCount('api')} of {identityComponents.filter(c => c.uwaUsed !== false).length} components selected</div>
              <div>Third-Party: {getComponentCount('thirdParty')} of {identityComponents.filter(c => c.uwaUsed !== false).length} components selected</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};