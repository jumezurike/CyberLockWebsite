import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Download, Copy, Save } from "lucide-react";
import UwaRecordsTable from "./uwa-records-table";

const IdentityManagement = () => {
  const [identityType, setIdentityType] = useState<string>("all");
  const [identificationMethod, setIdentificationMethod] = useState<string>("all");
  const [selectedMachineType, setSelectedMachineType] = useState<string>("vm");
  const { toast } = useToast();
  
  // UWA generation fields
  const [instanceUUID, setInstanceUUID] = useState<string>("1c-49ca-47ae-bebe-4087c52abbf4");
  const [environment, setEnvironment] = useState<string>("PR");
  const [googleLocation, setGoogleLocation] = useState<string>("2X57+XH+");
  const [osName, setOsName] = useState<string>("centosl");
  const [generatedUwa, setGeneratedUwa] = useState<string>("CLX-PR9ca-4-7ae-beb-e-4087c-52abbf4-X57+XH+-centosl");
  
  // Matrix selections
  const [matrixSelections, setMatrixSelections] = useState({
    human: {
      name: false,
      address: false,
      birthplace: false,
      dateOfBirth: false,
      pin: false,
      snImei: false,
      phoneEinSsn: false,
      driverLicensePassport: false,
      primaryAuthDevice: false,
      makeModelOs: false
    },
    machine: {
      name: false,
      address: false,
      birthplace: false,
      dateOfBirth: false,
      pin: false,
      snImei: true,
      phoneEinSsn: false,
      driverLicensePassport: false,
      primaryAuthDevice: false,
      makeModelOs: true,
      manufacturingDate: true,
      ec2DoIdMacSn: true,
      os: true,
      uuid: true,
      serverId: true,
      environment: true,
      ipAddress: true
    },
    api: {
      name: false,
      address: false,
      birthplace: false,
      dateOfBirth: false,
      pin: false,
      snImei: false,
      phoneEinSsn: false,
      driverLicensePassport: false,
      primaryAuthDevice: false,
      makeModelOs: true,
      manufacturingDate: false,
      ec2DoIdMacSn: false,
      os: true,
      uuid: true,
      serverId: true,
      environment: true,
      ipAddress: true
    },
    thirdParty: {
      name: false,
      address: false,
      birthplace: false,
      dateOfBirth: false,
      pin: false,
      snImei: false,
      phoneEinSsn: true,
      driverLicensePassport: false,
      primaryAuthDevice: false,
      makeModelOs: false,
      businessCertifications: true,
      businessLicenses: true,
      utilityBills: true
    }
  });
  
  // Generate UWA function
  const generateUwa = () => {
    // This is a simplified algorithm for demo purposes
    // In a real app, this would incorporate more cryptographic functionality
    
    // Format based on the machine type (virtual or physical)
    let uwa = "CLX-";
    
    if (selectedMachineType === "vm") {
      // Virtual machine UWA format
      uwa += environment;
      uwa += instanceUUID.substring(instanceUUID.length - 26, instanceUUID.length - 22);
      uwa += "-";
      uwa += instanceUUID.substring(instanceUUID.length - 20, instanceUUID.length - 17);
      uwa += "-";
      uwa += instanceUUID.substring(instanceUUID.length - 16, instanceUUID.length - 13);
      uwa += "-";
      uwa += instanceUUID.substring(instanceUUID.length - 12, instanceUUID.length - 9);
      uwa += "-";
      uwa += instanceUUID.substring(instanceUUID.length - 8, instanceUUID.length - 2);
      uwa += "-";
      uwa += googleLocation.substring(0, Math.min(7, googleLocation.length));
      uwa += "-";
      uwa += osName.substring(0, Math.min(7, osName.length));
    } else {
      // Physical device UWA format - for demo purposes using similar format
      uwa += environment;
      uwa += instanceUUID.substring(instanceUUID.length - 20, instanceUUID.length - 16);
      uwa += "-";
      uwa += "PHY-";
      uwa += instanceUUID.substring(instanceUUID.length - 12, instanceUUID.length - 8);
      uwa += "-";
      uwa += googleLocation.substring(0, Math.min(5, googleLocation.length));
      uwa += "-";
      uwa += osName.substring(0, Math.min(5, osName.length));
    }
    
    setGeneratedUwa(uwa);
    
    // Success notification
    toast({
      title: "UWA Generated",
      description: "UWA has been generated successfully!",
    });
    
    return uwa;
  };
  
  // Copy UWA to clipboard
  const copyUwaToClipboard = () => {
    navigator.clipboard.writeText(generatedUwa);
    toast({
      title: "Copied to Clipboard",
      description: "UWA has been copied to clipboard.",
    });
  };
  
  // Download template function
  const downloadTemplate = () => {
    // Create a template CSV
    const csvContent = "Identity Type,Identification Method,User ID,Full Name,Contact Info\nHuman,Biometric,EMP-001,John Doe,john.doe@example.com\nMachine,Hardware,SRV-001,Web Server 1,admin@example.com";
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "identity-template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Template Downloaded",
      description: "Identity management template has been downloaded.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Universal Identity Verification System (UIVS)</h4>
        <p className="text-xs text-blue-700 mb-3">
          For organizations with multiple users, we recommend using our Identity Management system to import and manage all your users in one place with our patented Universal Identity Verification System (UIVS).
        </p>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={downloadTemplate}>
            <Download className="h-3 w-3 mr-1" /> Download Template
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Filter by Identity Type</CardTitle>
            <CardDescription className="text-xs">
              Select an identity type to filter the identity component inventory list below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Identity Type</Label>
                <Select 
                  value={identityType} 
                  onValueChange={setIdentityType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="human">Human</SelectItem>
                    <SelectItem value="machine">Machine</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="thirdParty">Third-Party</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-xs">Identification Method</Label>
                <Select 
                  value={identificationMethod} 
                  onValueChange={setIdentificationMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Methods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="biometric">Biometric</SelectItem>
                    <SelectItem value="hardware">Hardware</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                    <SelectItem value="token">Token-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Identity Component Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="sm" variant="outline" className="w-full">
              Add Identity Component
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* UWA Component Selection Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">UWA Component Selection Matrix</CardTitle>
          <CardDescription className="text-xs">
            Select the components needed for your UWA intermediate representation. Required fields depend on identity type. Organizations can customize which fields to include in their UWA generation based on their specific needs.
          </CardDescription>
          <p className="text-xs text-muted-foreground mt-1">
            The matrix below shows an example configuration. All 31 identity components can be used to create a customized UWA.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted/30">
                  <th className="p-2 text-left font-medium border">Components of Identification</th>
                  <th className="p-2 text-center font-medium border">Human</th>
                  <th className="p-2 text-center font-medium border">Machine</th>
                  <th className="p-2 text-center font-medium border">API</th>
                  <th className="p-2 text-center font-medium border">Third-Party</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">Name</td>
                  <td className="p-2 border text-center">
                    <Checkbox 
                      checked={matrixSelections.human.name}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          human: {...matrixSelections.human, name: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <Checkbox 
                      checked={matrixSelections.machine.name}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          machine: {...matrixSelections.machine, name: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <Checkbox 
                      checked={matrixSelections.api.name}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          api: {...matrixSelections.api, name: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <Checkbox 
                      checked={matrixSelections.thirdParty.name}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          thirdParty: {...matrixSelections.thirdParty, name: !!checked}
                        })
                      }
                    />
                  </td>
                </tr>
                
                <tr>
                  <td className="p-2 border">Address</td>
                  <td className="p-2 border text-center">
                    <Checkbox 
                      checked={matrixSelections.human.address}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          human: {...matrixSelections.human, address: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <Checkbox 
                      checked={matrixSelections.machine.address}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          machine: {...matrixSelections.machine, address: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <Checkbox 
                      checked={matrixSelections.api.address}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          api: {...matrixSelections.api, address: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <Checkbox 
                      checked={matrixSelections.thirdParty.address}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          thirdParty: {...matrixSelections.thirdParty, address: !!checked}
                        })
                      }
                    />
                  </td>
                </tr>
                
                <tr>
                  <td className="p-2 border">SN/IMEI</td>
                  <td className="p-2 border text-center">
                    <Checkbox 
                      checked={matrixSelections.human.snImei}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          human: {...matrixSelections.human, snImei: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center bg-green-50">
                    <Checkbox 
                      checked={matrixSelections.machine.snImei}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          machine: {...matrixSelections.machine, snImei: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <Checkbox 
                      checked={matrixSelections.api.snImei}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          api: {...matrixSelections.api, snImei: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <Checkbox 
                      checked={matrixSelections.thirdParty.snImei}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          thirdParty: {...matrixSelections.thirdParty, snImei: !!checked}
                        })
                      }
                    />
                  </td>
                </tr>
                
                <tr>
                  <td className="p-2 border">Make/Model+OS</td>
                  <td className="p-2 border text-center">
                    <Checkbox 
                      checked={matrixSelections.human.makeModelOs}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          human: {...matrixSelections.human, makeModelOs: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center bg-green-50">
                    <Checkbox 
                      checked={matrixSelections.machine.makeModelOs}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          machine: {...matrixSelections.machine, makeModelOs: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center bg-green-50">
                    <Checkbox 
                      checked={matrixSelections.api.makeModelOs}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          api: {...matrixSelections.api, makeModelOs: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <Checkbox 
                      checked={matrixSelections.thirdParty.makeModelOs}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          thirdParty: {...matrixSelections.thirdParty, makeModelOs: !!checked}
                        })
                      }
                    />
                  </td>
                </tr>
                
                <tr>
                  <td className="p-2 border">OS</td>
                  <td className="p-2 border text-center">-</td>
                  <td className="p-2 border text-center bg-green-50">
                    <Checkbox 
                      checked={matrixSelections.machine.os}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          machine: {...matrixSelections.machine, os: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center bg-green-50">
                    <Checkbox 
                      checked={matrixSelections.api.os}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          api: {...matrixSelections.api, os: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center">-</td>
                </tr>
                
                <tr>
                  <td className="p-2 border">UUID</td>
                  <td className="p-2 border text-center">-</td>
                  <td className="p-2 border text-center bg-green-50">
                    <Checkbox 
                      checked={matrixSelections.machine.uuid}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          machine: {...matrixSelections.machine, uuid: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center bg-green-50">
                    <Checkbox 
                      checked={matrixSelections.api.uuid}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          api: {...matrixSelections.api, uuid: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center">-</td>
                </tr>
                
                <tr>
                  <td className="p-2 border">Environment (PR/ST/TD)</td>
                  <td className="p-2 border text-center">-</td>
                  <td className="p-2 border text-center bg-green-50">
                    <Checkbox 
                      checked={matrixSelections.machine.environment}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          machine: {...matrixSelections.machine, environment: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center bg-green-50">
                    <Checkbox 
                      checked={matrixSelections.api.environment}
                      onCheckedChange={(checked) => 
                        setMatrixSelections({
                          ...matrixSelections,
                          api: {...matrixSelections.api, environment: !!checked}
                        })
                      }
                    />
                  </td>
                  <td className="p-2 border text-center">-</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            The UWA (Universal Wallet Address) will be generated using the fields marked above
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2">UWA Templates by Identity Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Card className="border-2 border-blue-200 hover:border-blue-300 cursor-pointer transition-all">
              <CardContent className="p-3 text-center">
                <p className="text-3xl mb-1">🧑</p>
                <p className="text-xs">Human UWA Template</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-green-300 hover:border-green-400 cursor-pointer transition-all">
              <CardContent className="p-3 text-center">
                <p className="text-3xl mb-1">💻</p>
                <p className="text-xs">Machine UWA Template</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-purple-200 hover:border-purple-300 cursor-pointer transition-all">
              <CardContent className="p-3 text-center">
                <p className="text-3xl mb-1">⚙️</p>
                <p className="text-xs">API UWA Template</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-amber-200 hover:border-amber-300 cursor-pointer transition-all">
              <CardContent className="p-3 text-center">
                <p className="text-3xl mb-1">🏢</p>
                <p className="text-xs">Third-Party UWA Template</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Machine Type for UWA Generation</h3>
          <div className="flex space-x-2 mb-2">
            <div 
              className={`flex-1 p-2 border rounded-md cursor-pointer text-center ${selectedMachineType === 'vm' ? 'bg-blue-50 border-blue-200' : ''}`}
              onClick={() => setSelectedMachineType('vm')}
            >
              <p className="text-xs font-medium">Virtual Machine</p>
            </div>
            <div 
              className={`flex-1 p-2 border rounded-md cursor-pointer text-center ${selectedMachineType === 'physical' ? 'bg-blue-50 border-blue-200' : ''}`}
              onClick={() => setSelectedMachineType('physical')}
            >
              <p className="text-xs font-medium">Physical Device</p>
            </div>
          </div>
          
          <div className="p-3 border rounded-md bg-gray-50">
            <p className="text-xs font-medium mb-1">Virtual UWA Format (VM):</p>
            <p className="text-xs text-muted-foreground mb-2">
              Uses InstanceUUID + Environment + Address + OSname
            </p>
            <p className="text-xs text-muted-foreground">
              Uses instance identifiers instead of hardware identifiers
            </p>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">UWA Generation Preview</CardTitle>
          <CardDescription className="text-xs">
            Selected template: Machine UWA (Virtual Machine)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-xs">Instance UUID</Label>
              <Input 
                value={instanceUUID} 
                onChange={(e) => setInstanceUUID(e.target.value)}
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Environment</Label>
              <Select 
                value={environment} 
                onValueChange={setEnvironment}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Production (PR)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PR">Production (PR)</SelectItem>
                  <SelectItem value="ST">Staging (ST)</SelectItem>
                  <SelectItem value="TD">Test/Dev (TD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Google Location</Label>
              <Input 
                value={googleLocation} 
                onChange={(e) => setGoogleLocation(e.target.value)}
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">OS Name</Label>
              <Input 
                value={osName} 
                onChange={(e) => setOsName(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md mb-4">
            <div className="flex justify-between items-center mb-1">
              <Label className="text-xs">Generated UWA:</Label>
              <Button size="sm" variant="ghost" onClick={copyUwaToClipboard} className="h-7 text-xs">
                <Copy className="h-3 w-3 mr-1" /> Copy
              </Button>
            </div>
            <p className="font-mono text-sm bg-white p-2 rounded border">{generatedUwa}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Algorithm: Last26InstanceUUID + First2Env + Last7Address + First7OSname
            </p>
            <p className="text-xs text-muted-foreground">
              Formatted in 7-character chunks for readability
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Generate Your Own UWA(Cloud Server)</h3>
            <div className="flex items-center gap-2 mt-3">
              <Button
                onClick={() => setGeneratedUwa("CLX-PR9ca-4-7ae-beb-e-4087c-52abbf4-X57+XH+-centosl")}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Refresh
              </Button>
              <Button
                onClick={generateUwa}
                variant="default"
                size="sm"
                className="text-xs"
              >
                <Save className="h-3 w-3 mr-1" /> Generate UWA
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Always starts with CLX
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* UWA Records Table */}
      <UwaRecordsTable />
    </div>
  );
};

export default IdentityManagement;