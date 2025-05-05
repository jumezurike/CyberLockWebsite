import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MatrixItem } from "@/lib/sos2a-types";
import { generateInitialMatrixData } from "@/lib/matrix-mappings";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface MatrixFormProps {
  operationModes: string[];
  internetPresence: string[];
  onSubmit: (matrixData: MatrixItem[]) => void;
  onBack: () => void;
}

export default function MatrixForm({ operationModes, internetPresence, onSubmit, onBack }: MatrixFormProps) {
  // Generate initial matrix data based on selected operation modes and internet presence
  const [matrixData, setMatrixData] = useState<MatrixItem[]>(
    generateInitialMatrixData(operationModes, internetPresence)
  );
  const [currentInfraIndex, setCurrentInfraIndex] = useState(0);
  
  // Function to update a specific matrix item
  const updateMatrixItem = (index: number, updatedItem: MatrixItem) => {
    const newMatrixData = [...matrixData];
    newMatrixData[index] = updatedItem;
    setMatrixData(newMatrixData);
  };
  
  // Handler for education awareness toggle
  const handleEducationAwarenessChange = (checked: boolean) => {
    const updatedItem = { ...matrixData[currentInfraIndex], educationAwareness: checked };
    updateMatrixItem(currentInfraIndex, updatedItem);
  };
  
  // Handler for compliance standard toggle
  const handleComplianceStandardChange = (standardKey: keyof MatrixItem['complianceStandards'], checked: boolean) => {
    const updatedItem = { 
      ...matrixData[currentInfraIndex], 
      complianceStandards: {
        ...matrixData[currentInfraIndex].complianceStandards,
        [standardKey]: checked
      }
    };
    updateMatrixItem(currentInfraIndex, updatedItem);
  };
  
  // Handler for regulatory requirement toggle
  const handleRegulatoryRequirementChange = (reqKey: keyof MatrixItem['regulatoryRequirements'], checked: boolean) => {
    const updatedItem = { 
      ...matrixData[currentInfraIndex], 
      regulatoryRequirements: {
        ...matrixData[currentInfraIndex].regulatoryRequirements,
        [reqKey]: checked
      }
    };
    updateMatrixItem(currentInfraIndex, updatedItem);
  };
  
  // Handler for standards toggle
  const handleStandardChange = (stdKey: keyof MatrixItem['standards'], checked: boolean) => {
    const updatedItem = { 
      ...matrixData[currentInfraIndex], 
      standards: {
        ...matrixData[currentInfraIndex].standards,
        [stdKey]: checked
      }
    };
    updateMatrixItem(currentInfraIndex, updatedItem);
  };
  
  // Handler for operational control implementation toggle
  const handleOperationControlImplementedChange = (checked: boolean) => {
    const updatedItem = { 
      ...matrixData[currentInfraIndex], 
      operationControls: {
        ...matrixData[currentInfraIndex].operationControls,
        implemented: checked
      }
    };
    updateMatrixItem(currentInfraIndex, updatedItem);
  };
  
  // Handler for management control implementation toggle
  const handleManagementControlImplementedChange = (checked: boolean) => {
    const updatedItem = { 
      ...matrixData[currentInfraIndex], 
      managementControls: {
        ...matrixData[currentInfraIndex].managementControls,
        implemented: checked
      }
    };
    updateMatrixItem(currentInfraIndex, updatedItem);
  };
  
  // Handler for technology control implementation toggle
  const handleTechnologyControlImplementedChange = (checked: boolean) => {
    const updatedItem = { 
      ...matrixData[currentInfraIndex], 
      technologyControls: {
        ...matrixData[currentInfraIndex].technologyControls,
        implemented: checked,
      }
    };
    updateMatrixItem(currentInfraIndex, updatedItem);
  };
  
  // Handler for OS hardening implementation toggle
  const handleOsHardeningChange = (key: "stig" | "scap", checked: boolean) => {
    const updatedItem = { 
      ...matrixData[currentInfraIndex], 
      technologyControls: {
        ...matrixData[currentInfraIndex].technologyControls,
        osHardening: {
          ...matrixData[currentInfraIndex].technologyControls.osHardening,
          [key]: checked,
        }
      }
    };
    updateMatrixItem(currentInfraIndex, updatedItem);
  };
  
  // Handler for STIG SCAP toggle
  const handleStigScapChange = (checked: boolean) => {
    const updatedItem = { 
      ...matrixData[currentInfraIndex], 
      osHardening: {
        ...matrixData[currentInfraIndex].osHardening,
        stigScap: checked,
      }
    };
    updateMatrixItem(currentInfraIndex, updatedItem);
  };
  
  // Handler for adding a gap in operational controls
  const handleAddOperationalGap = (gap: string) => {
    if (!gap.trim()) return;
    
    const updatedItem = { 
      ...matrixData[currentInfraIndex], 
      operationControls: {
        ...matrixData[currentInfraIndex].operationControls,
        gaps: [...matrixData[currentInfraIndex].operationControls.gaps, gap]
      }
    };
    updateMatrixItem(currentInfraIndex, updatedItem);
  };
  
  // Handler for adding a gap in management controls
  const handleAddManagementGap = (gap: string) => {
    if (!gap.trim()) return;
    
    const updatedItem = { 
      ...matrixData[currentInfraIndex], 
      managementControls: {
        ...matrixData[currentInfraIndex].managementControls,
        gaps: [...matrixData[currentInfraIndex].managementControls.gaps, gap]
      }
    };
    updateMatrixItem(currentInfraIndex, updatedItem);
  };
  
  // Handler for adding a gap in technology controls
  const handleAddTechnologyGap = (gap: string) => {
    if (!gap.trim()) return;
    
    const updatedItem = { 
      ...matrixData[currentInfraIndex], 
      technologyControls: {
        ...matrixData[currentInfraIndex].technologyControls,
        gaps: [...matrixData[currentInfraIndex].technologyControls.gaps, gap]
      }
    };
    updateMatrixItem(currentInfraIndex, updatedItem);
  };
  
  // Handler for adding an OS hardening guideline
  const handleAddOsHardeningGuideline = (guideline: string) => {
    if (!guideline.trim()) return;
    
    const updatedItem = { 
      ...matrixData[currentInfraIndex], 
      osHardening: {
        ...matrixData[currentInfraIndex].osHardening,
        guidelines: [...matrixData[currentInfraIndex].osHardening.guidelines, guideline]
      }
    };
    updateMatrixItem(currentInfraIndex, updatedItem);
  };
  
  const handleSubmit = () => {
    onSubmit(matrixData);
  };
  
  const currentItem = matrixData[currentInfraIndex];
  
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Interview & Matrix Population</CardTitle>
          <CardDescription>
            Review and confirm the security controls, frameworks, and requirements for each infrastructure component.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Infrastructure navigation */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Infrastructure Components</h3>
            <div className="flex flex-wrap gap-2">
              {matrixData.map((item, index) => (
                <Button 
                  key={index}
                  variant={currentInfraIndex === index ? "default" : "outline"}
                  onClick={() => setCurrentInfraIndex(index)}
                >
                  {item.infraType}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Main tabs for the 10 gap analysis parameters */}
          <Tabs defaultValue="accessControl" className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="accessControl">Access Control</TabsTrigger>
              <TabsTrigger value="dataProtection">Data Protection</TabsTrigger>
              <TabsTrigger value="securityAwareness">Security Awareness</TabsTrigger>
              <TabsTrigger value="incidentResponse">Incident Response</TabsTrigger>
              <TabsTrigger value="networkSecurity">Network Security</TabsTrigger>
            </TabsList>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="applicationSecurity">Application Security</TabsTrigger>
              <TabsTrigger value="thirdPartyManagement">Third Party Management</TabsTrigger>
              <TabsTrigger value="assetManagement">Asset Management</TabsTrigger>
              <TabsTrigger value="securityGovernance">Security Governance</TabsTrigger>
              <TabsTrigger value="complianceManagement">Compliance Management</TabsTrigger>
            </TabsList>
            
            {/* Access Control Tab */}
            <TabsContent value="accessControl">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Access Control Implementation</h3>
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Key Controls</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="ac-user-access-management" 
                            checked={currentItem.accessControl?.userAccessManagement || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                accessControl: {
                                  ...currentItem.accessControl || {},
                                  userAccessManagement: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="ac-user-access-management">User Access Management</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="ac-privilege-management" 
                            checked={currentItem.accessControl?.privilegeManagement || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                accessControl: {
                                  ...currentItem.accessControl || {},
                                  privilegeManagement: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="ac-privilege-management">Privilege Management</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="ac-mfa" 
                            checked={currentItem.accessControl?.multiFactorAuth || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                accessControl: {
                                  ...currentItem.accessControl || {},
                                  multiFactorAuth: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="ac-mfa">Multi-Factor Authentication</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="ac-password-policy" 
                            checked={currentItem.accessControl?.passwordPolicy || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                accessControl: {
                                  ...currentItem.accessControl || {},
                                  passwordPolicy: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="ac-password-policy">Password Policy</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Implementation Level</h4>
                      <div className="flex items-center gap-4">
                        <Label>
                          Not Implemented
                          <div className="flex items-center gap-1 mt-1">
                            <Checkbox 
                              id="ac-not-implemented" 
                              checked={currentItem.accessControl?.implementationLevel === 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    accessControl: {
                                      ...currentItem.accessControl || {},
                                      implementationLevel: 0
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }
                              }}
                            />
                            <span className="text-sm">Level 0</span>
                          </div>
                        </Label>
                        
                        <Label>
                          Initial
                          <div className="flex items-center gap-1 mt-1">
                            <Checkbox 
                              id="ac-initial" 
                              checked={currentItem.accessControl?.implementationLevel === 1}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    accessControl: {
                                      ...currentItem.accessControl || {},
                                      implementationLevel: 1
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }
                              }}
                            />
                            <span className="text-sm">Level 1</span>
                          </div>
                        </Label>
                        
                        <Label>
                          Developing
                          <div className="flex items-center gap-1 mt-1">
                            <Checkbox 
                              id="ac-developing" 
                              checked={currentItem.accessControl?.implementationLevel === 2}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    accessControl: {
                                      ...currentItem.accessControl || {},
                                      implementationLevel: 2
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }
                              }}
                            />
                            <span className="text-sm">Level 2</span>
                          </div>
                        </Label>
                        
                        <Label>
                          Defined
                          <div className="flex items-center gap-1 mt-1">
                            <Checkbox 
                              id="ac-defined" 
                              checked={currentItem.accessControl?.implementationLevel === 3}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    accessControl: {
                                      ...currentItem.accessControl || {},
                                      implementationLevel: 3
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }
                              }}
                            />
                            <span className="text-sm">Level 3</span>
                          </div>
                        </Label>
                        
                        <Label>
                          Managed
                          <div className="flex items-center gap-1 mt-1">
                            <Checkbox 
                              id="ac-managed" 
                              checked={currentItem.accessControl?.implementationLevel === 4}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    accessControl: {
                                      ...currentItem.accessControl || {},
                                      implementationLevel: 4
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }
                              }}
                            />
                            <span className="text-sm">Level 4</span>
                          </div>
                        </Label>
                        
                        <Label>
                          Optimized
                          <div className="flex items-center gap-1 mt-1">
                            <Checkbox 
                              id="ac-optimized" 
                              checked={currentItem.accessControl?.implementationLevel === 5}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    accessControl: {
                                      ...currentItem.accessControl || {},
                                      implementationLevel: 5
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }
                              }}
                            />
                            <span className="text-sm">Level 5</span>
                          </div>
                        </Label>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Implementation Gaps</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentItem.accessControl?.gaps?.map((gap, index) => (
                          <Badge key={index} variant="secondary" className="gap-2">
                            {gap}
                            <button 
                              className="text-xs hover:text-primary"
                              onClick={() => {
                                const updatedItem = { 
                                  ...currentItem, 
                                  accessControl: {
                                    ...currentItem.accessControl || {},
                                    gaps: currentItem.accessControl?.gaps?.filter((_, i) => i !== index) || []
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                              }}
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          id="ac-gap" 
                          placeholder="Add a gap in access control..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const inputValue = (e.target as HTMLInputElement).value;
                              if (inputValue.trim()) {
                                const updatedItem = { 
                                  ...currentItem, 
                                  accessControl: {
                                    ...currentItem.accessControl || {},
                                    gaps: [...(currentItem.accessControl?.gaps || []), inputValue]
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            const input = document.getElementById('ac-gap') as HTMLInputElement;
                            const inputValue = input.value;
                            if (inputValue.trim()) {
                              const updatedItem = { 
                                ...currentItem, 
                                accessControl: {
                                  ...currentItem.accessControl || {},
                                  gaps: [...(currentItem.accessControl?.gaps || []), inputValue]
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notes</h3>
                  <div className="rounded-md border p-4">
                    <textarea
                      className="w-full h-24 p-2 border rounded"
                      placeholder="Enter notes about access control implementation..."
                      value={currentItem.accessControl?.notes || ''}
                      onChange={(e) => {
                        const updatedItem = { 
                          ...currentItem, 
                          accessControl: {
                            ...currentItem.accessControl || {},
                            notes: e.target.value
                          }
                        };
                        updateMatrixItem(currentInfraIndex, updatedItem);
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Data Protection Tab */}
            <TabsContent value="dataProtection">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Data Protection Implementation</h3>
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Key Controls</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="dp-data-encryption" 
                            checked={currentItem.dataProtection?.dataEncryption || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                dataProtection: {
                                  ...currentItem.dataProtection || {},
                                  dataEncryption: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="dp-data-encryption">Data Encryption</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="dp-data-classification" 
                            checked={currentItem.dataProtection?.dataClassification || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                dataProtection: {
                                  ...currentItem.dataProtection || {},
                                  dataClassification: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="dp-data-classification">Data Classification</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="dp-data-backup" 
                            checked={currentItem.dataProtection?.dataBackup || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                dataProtection: {
                                  ...currentItem.dataProtection || {},
                                  dataBackup: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="dp-data-backup">Data Backup</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="dp-data-deletion" 
                            checked={currentItem.dataProtection?.dataDeletion || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                dataProtection: {
                                  ...currentItem.dataProtection || {},
                                  dataDeletion: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="dp-data-deletion">Data Deletion</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Implementation Level</h4>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {[0, 1, 2, 3, 4, 5].map((level) => (
                          <div 
                            key={level}
                            className={`rounded-md border p-2 cursor-pointer hover:border-primary hover:bg-primary/5 ${
                              currentItem.dataProtection?.implementationLevel === level ? 'border-primary bg-primary/10' : ''
                            }`}
                            onClick={() => {
                              const updatedItem = { 
                                ...currentItem, 
                                dataProtection: {
                                  ...currentItem.dataProtection || {},
                                  implementationLevel: level
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          >
                            <div className="text-center">
                              <p className="text-sm font-semibold">{level}</p>
                              <p className="text-xs">
                                {level === 0 && 'Not Implemented'}
                                {level === 1 && 'Initial'}
                                {level === 2 && 'Repeatable'}
                                {level === 3 && 'Defined'}
                                {level === 4 && 'Managed'}
                                {level === 5 && 'Optimized'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Implementation Gaps</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentItem.dataProtection?.gaps?.map((gap, index) => (
                          <Badge key={index} variant="secondary" className="gap-2">
                            {gap}
                            <button 
                              className="text-xs hover:text-primary"
                              onClick={() => {
                                const updatedItem = { 
                                  ...currentItem, 
                                  dataProtection: {
                                    ...currentItem.dataProtection,
                                    gaps: currentItem.dataProtection.gaps.filter((_, i) => i !== index)
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                              }}
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          id="dp-gap" 
                          placeholder="Add a gap in data protection..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const inputValue = (e.target as HTMLInputElement).value;
                              if (inputValue.trim()) {
                                const updatedItem = { 
                                  ...currentItem, 
                                  dataProtection: {
                                    ...currentItem.dataProtection || {
                                      gaps: []
                                    },
                                    gaps: [...(currentItem.dataProtection?.gaps || []), inputValue]
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            const input = document.getElementById('dp-gap') as HTMLInputElement;
                            const inputValue = input.value;
                            if (inputValue.trim()) {
                              const updatedItem = { 
                                ...currentItem, 
                                dataProtection: {
                                  ...currentItem.dataProtection || {
                                    gaps: []
                                  },
                                  gaps: [...(currentItem.dataProtection?.gaps || []), inputValue]
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notes</h3>
                  <div className="rounded-md border p-4">
                    <textarea
                      className="w-full h-24 p-2 border rounded"
                      placeholder="Enter notes about data protection implementation..."
                      value={currentItem.dataProtection?.notes || ''}
                      onChange={(e) => {
                        const updatedItem = { 
                          ...currentItem, 
                          dataProtection: {
                            ...currentItem.dataProtection || {
                              gaps: []
                            },
                            notes: e.target.value
                          }
                        };
                        updateMatrixItem(currentInfraIndex, updatedItem);
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Security Awareness Tab */}
            <TabsContent value="securityAwareness">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Security Awareness Implementation</h3>
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Key Controls</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="sa-training-program" 
                            checked={currentItem.securityAwareness?.trainingProgram || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                securityAwareness: {
                                  ...currentItem.securityAwareness || {},
                                  trainingProgram: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="sa-training-program">Training Program</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="sa-phishing-simulations" 
                            checked={currentItem.securityAwareness?.phishingSimulations || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                securityAwareness: {
                                  ...currentItem.securityAwareness || {},
                                  phishingSimulations: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="sa-phishing-simulations">Phishing Simulations</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="sa-security-culture" 
                            checked={currentItem.securityAwareness?.securityCulture || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                securityAwareness: {
                                  ...currentItem.securityAwareness || {},
                                  securityCulture: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="sa-security-culture">Security Culture</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="sa-incident-reporting" 
                            checked={currentItem.securityAwareness?.incidentReporting || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                securityAwareness: {
                                  ...currentItem.securityAwareness || {},
                                  incidentReporting: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="sa-incident-reporting">Incident Reporting</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Implementation Level</h4>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {[0, 1, 2, 3, 4, 5].map((level) => (
                          <div 
                            key={level}
                            className={`rounded-md border p-2 cursor-pointer hover:border-primary hover:bg-primary/5 ${
                              currentItem.securityAwareness?.implementationLevel === level ? 'border-primary bg-primary/10' : ''
                            }`}
                            onClick={() => {
                              const updatedItem = { 
                                ...currentItem, 
                                securityAwareness: {
                                  ...currentItem.securityAwareness || {},
                                  implementationLevel: level
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          >
                            <div className="text-center">
                              <p className="text-sm font-semibold">{level}</p>
                              <p className="text-xs">
                                {level === 0 && 'Not Implemented'}
                                {level === 1 && 'Initial'}
                                {level === 2 && 'Repeatable'}
                                {level === 3 && 'Defined'}
                                {level === 4 && 'Managed'}
                                {level === 5 && 'Optimized'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Implementation Gaps</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentItem.securityAwareness?.gaps?.map((gap, index) => (
                          <Badge key={index} variant="secondary" className="gap-2">
                            {gap}
                            <button 
                              className="text-xs hover:text-primary"
                              onClick={() => {
                                const updatedItem = { 
                                  ...currentItem, 
                                  securityAwareness: {
                                    ...currentItem.securityAwareness,
                                    gaps: currentItem.securityAwareness.gaps.filter((_, i) => i !== index)
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                              }}
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          id="sa-gap" 
                          placeholder="Add a gap in security awareness..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const inputValue = (e.target as HTMLInputElement).value;
                              if (inputValue.trim()) {
                                const updatedItem = { 
                                  ...currentItem, 
                                  securityAwareness: {
                                    ...currentItem.securityAwareness || {
                                      gaps: []
                                    },
                                    gaps: [...(currentItem.securityAwareness?.gaps || []), inputValue]
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            const input = document.getElementById('sa-gap') as HTMLInputElement;
                            const inputValue = input.value;
                            if (inputValue.trim()) {
                              const updatedItem = { 
                                ...currentItem, 
                                securityAwareness: {
                                  ...currentItem.securityAwareness || {
                                    gaps: []
                                  },
                                  gaps: [...(currentItem.securityAwareness?.gaps || []), inputValue]
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notes</h3>
                  <div className="rounded-md border p-4">
                    <textarea
                      className="w-full h-24 p-2 border rounded"
                      placeholder="Enter notes about security awareness implementation..."
                      value={currentItem.securityAwareness?.notes || ''}
                      onChange={(e) => {
                        const updatedItem = { 
                          ...currentItem, 
                          securityAwareness: {
                            ...currentItem.securityAwareness || {
                              gaps: []
                            },
                            notes: e.target.value
                          }
                        };
                        updateMatrixItem(currentInfraIndex, updatedItem);
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Incident Response Tab */}
            <TabsContent value="incidentResponse">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Incident Response Implementation</h3>
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Key Controls</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="ir-plan" 
                            checked={currentItem.incidentResponse?.irPlan || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                incidentResponse: {
                                  ...currentItem.incidentResponse || {},
                                  irPlan: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="ir-plan">Incident Response Plan</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="ir-team" 
                            checked={currentItem.incidentResponse?.irTeam || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                incidentResponse: {
                                  ...currentItem.incidentResponse || {},
                                  irTeam: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="ir-team">Incident Response Team</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="ir-testing" 
                            checked={currentItem.incidentResponse?.irTesting || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                incidentResponse: {
                                  ...currentItem.incidentResponse || {},
                                  irTesting: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="ir-testing">IR Testing/Exercises</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="ir-forensic" 
                            checked={currentItem.incidentResponse?.forensicCapabilities || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                incidentResponse: {
                                  ...currentItem.incidentResponse || {},
                                  forensicCapabilities: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="ir-forensic">Forensic Capabilities</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Implementation Level</h4>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {[0, 1, 2, 3, 4, 5].map((level) => (
                          <div 
                            key={level}
                            className={`rounded-md border p-2 cursor-pointer hover:border-primary hover:bg-primary/5 ${
                              currentItem.incidentResponse?.implementationLevel === level ? 'border-primary bg-primary/10' : ''
                            }`}
                            onClick={() => {
                              const updatedItem = { 
                                ...currentItem, 
                                incidentResponse: {
                                  ...currentItem.incidentResponse || {},
                                  implementationLevel: level
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          >
                            <div className="text-center">
                              <p className="text-sm font-semibold">{level}</p>
                              <p className="text-xs">
                                {level === 0 && 'Not Implemented'}
                                {level === 1 && 'Initial'}
                                {level === 2 && 'Repeatable'}
                                {level === 3 && 'Defined'}
                                {level === 4 && 'Managed'}
                                {level === 5 && 'Optimized'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Implementation Gaps</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentItem.incidentResponse?.gaps?.map((gap, index) => (
                          <Badge key={index} variant="secondary" className="gap-2">
                            {gap}
                            <button 
                              className="text-xs hover:text-primary"
                              onClick={() => {
                                const updatedItem = { 
                                  ...currentItem, 
                                  incidentResponse: {
                                    ...currentItem.incidentResponse,
                                    gaps: currentItem.incidentResponse.gaps.filter((_, i) => i !== index)
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                              }}
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          id="ir-gap" 
                          placeholder="Add a gap in incident response..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const inputValue = (e.target as HTMLInputElement).value;
                              if (inputValue.trim()) {
                                const updatedItem = { 
                                  ...currentItem, 
                                  incidentResponse: {
                                    ...currentItem.incidentResponse || {
                                      gaps: []
                                    },
                                    gaps: [...(currentItem.incidentResponse?.gaps || []), inputValue]
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            const input = document.getElementById('ir-gap') as HTMLInputElement;
                            const inputValue = input.value;
                            if (inputValue.trim()) {
                              const updatedItem = { 
                                ...currentItem, 
                                incidentResponse: {
                                  ...currentItem.incidentResponse || {
                                    gaps: []
                                  },
                                  gaps: [...(currentItem.incidentResponse?.gaps || []), inputValue]
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notes</h3>
                  <div className="rounded-md border p-4">
                    <textarea
                      className="w-full h-24 p-2 border rounded"
                      placeholder="Enter notes about incident response implementation..."
                      value={currentItem.incidentResponse?.notes || ''}
                      onChange={(e) => {
                        const updatedItem = { 
                          ...currentItem, 
                          incidentResponse: {
                            ...currentItem.incidentResponse || {
                              gaps: []
                            },
                            notes: e.target.value
                          }
                        };
                        updateMatrixItem(currentInfraIndex, updatedItem);
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Network Security Tab */}
            <TabsContent value="networkSecurity">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Network Security Implementation</h3>
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Key Controls</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="ns-firewalls" 
                            checked={currentItem.networkSecurity?.firewalls || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                networkSecurity: {
                                  ...currentItem.networkSecurity || {},
                                  firewalls: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="ns-firewalls">Firewalls</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="ns-segmentation" 
                            checked={currentItem.networkSecurity?.segmentation || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                networkSecurity: {
                                  ...currentItem.networkSecurity || {},
                                  segmentation: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="ns-segmentation">Network Segmentation</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="ns-ids" 
                            checked={currentItem.networkSecurity?.intrusionDetection || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                networkSecurity: {
                                  ...currentItem.networkSecurity || {},
                                  intrusionDetection: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="ns-ids">Intrusion Detection</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="ns-wireless" 
                            checked={currentItem.networkSecurity?.wirelessSecurity || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                networkSecurity: {
                                  ...currentItem.networkSecurity || {},
                                  wirelessSecurity: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="ns-wireless">Wireless Security</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Implementation Level</h4>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {[0, 1, 2, 3, 4, 5].map((level) => (
                          <div 
                            key={level}
                            className={`rounded-md border p-2 cursor-pointer hover:border-primary hover:bg-primary/5 ${
                              currentItem.networkSecurity?.implementationLevel === level ? 'border-primary bg-primary/10' : ''
                            }`}
                            onClick={() => {
                              const updatedItem = { 
                                ...currentItem, 
                                networkSecurity: {
                                  ...currentItem.networkSecurity || {},
                                  implementationLevel: level
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          >
                            <div className="text-center">
                              <p className="text-sm font-semibold">{level}</p>
                              <p className="text-xs">
                                {level === 0 && 'Not Implemented'}
                                {level === 1 && 'Initial'}
                                {level === 2 && 'Repeatable'}
                                {level === 3 && 'Defined'}
                                {level === 4 && 'Managed'}
                                {level === 5 && 'Optimized'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Implementation Gaps</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentItem.networkSecurity?.gaps?.map((gap, index) => (
                          <Badge key={index} variant="secondary" className="gap-2">
                            {gap}
                            <button 
                              className="text-xs hover:text-primary"
                              onClick={() => {
                                const updatedItem = { 
                                  ...currentItem, 
                                  networkSecurity: {
                                    ...currentItem.networkSecurity,
                                    gaps: currentItem.networkSecurity.gaps.filter((_, i) => i !== index)
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                              }}
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          id="ns-gap" 
                          placeholder="Add a gap in network security..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const inputValue = (e.target as HTMLInputElement).value;
                              if (inputValue.trim()) {
                                const updatedItem = { 
                                  ...currentItem, 
                                  networkSecurity: {
                                    ...currentItem.networkSecurity || {
                                      gaps: []
                                    },
                                    gaps: [...(currentItem.networkSecurity?.gaps || []), inputValue]
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            const input = document.getElementById('ns-gap') as HTMLInputElement;
                            const inputValue = input.value;
                            if (inputValue.trim()) {
                              const updatedItem = { 
                                ...currentItem, 
                                networkSecurity: {
                                  ...currentItem.networkSecurity || {
                                    gaps: []
                                  },
                                  gaps: [...(currentItem.networkSecurity?.gaps || []), inputValue]
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notes</h3>
                  <div className="rounded-md border p-4">
                    <textarea
                      className="w-full h-24 p-2 border rounded"
                      placeholder="Enter notes about network security implementation..."
                      value={currentItem.networkSecurity?.notes || ''}
                      onChange={(e) => {
                        const updatedItem = { 
                          ...currentItem, 
                          networkSecurity: {
                            ...currentItem.networkSecurity || {
                              gaps: []
                            },
                            notes: e.target.value
                          }
                        };
                        updateMatrixItem(currentInfraIndex, updatedItem);
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Application Security Tab */}
            <TabsContent value="applicationSecurity">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Application Security Implementation</h3>
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Key Controls</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="as-secure-coding" 
                            checked={currentItem.applicationSecurity?.secureCoding || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                applicationSecurity: {
                                  ...currentItem.applicationSecurity || {},
                                  secureCoding: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="as-secure-coding">Secure Coding Practices</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="as-vulnerability-scanning" 
                            checked={currentItem.applicationSecurity?.vulnerabilityScanning || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                applicationSecurity: {
                                  ...currentItem.applicationSecurity || {},
                                  vulnerabilityScanning: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="as-vulnerability-scanning">Vulnerability Scanning</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="as-patch-management" 
                            checked={currentItem.applicationSecurity?.patchManagement || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                applicationSecurity: {
                                  ...currentItem.applicationSecurity || {},
                                  patchManagement: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="as-patch-management">Patch Management</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="as-secure-deployment" 
                            checked={currentItem.applicationSecurity?.secureDeployment || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                applicationSecurity: {
                                  ...currentItem.applicationSecurity || {},
                                  secureDeployment: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="as-secure-deployment">Secure Deployment</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Implementation Level</h4>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {[0, 1, 2, 3, 4, 5].map((level) => (
                          <div 
                            key={level}
                            className={`rounded-md border p-2 cursor-pointer hover:border-primary hover:bg-primary/5 ${
                              currentItem.applicationSecurity?.implementationLevel === level ? 'border-primary bg-primary/10' : ''
                            }`}
                            onClick={() => {
                              const updatedItem = { 
                                ...currentItem, 
                                applicationSecurity: {
                                  ...currentItem.applicationSecurity || {},
                                  implementationLevel: level
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          >
                            <div className="text-center">
                              <p className="text-sm font-semibold">{level}</p>
                              <p className="text-xs">
                                {level === 0 && 'Not Implemented'}
                                {level === 1 && 'Initial'}
                                {level === 2 && 'Repeatable'}
                                {level === 3 && 'Defined'}
                                {level === 4 && 'Managed'}
                                {level === 5 && 'Optimized'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Implementation Gaps</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentItem.applicationSecurity?.gaps?.map((gap, index) => (
                          <Badge key={index} variant="secondary" className="gap-2">
                            {gap}
                            <button 
                              className="text-xs hover:text-primary"
                              onClick={() => {
                                const updatedItem = { 
                                  ...currentItem, 
                                  applicationSecurity: {
                                    ...currentItem.applicationSecurity,
                                    gaps: currentItem.applicationSecurity.gaps.filter((_, i) => i !== index)
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                              }}
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          id="as-gap" 
                          placeholder="Add a gap in application security..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const inputValue = (e.target as HTMLInputElement).value;
                              if (inputValue.trim()) {
                                const updatedItem = { 
                                  ...currentItem, 
                                  applicationSecurity: {
                                    ...currentItem.applicationSecurity || {
                                      gaps: []
                                    },
                                    gaps: [...(currentItem.applicationSecurity?.gaps || []), inputValue]
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            const input = document.getElementById('as-gap') as HTMLInputElement;
                            const inputValue = input.value;
                            if (inputValue.trim()) {
                              const updatedItem = { 
                                ...currentItem, 
                                applicationSecurity: {
                                  ...currentItem.applicationSecurity || {
                                    gaps: []
                                  },
                                  gaps: [...(currentItem.applicationSecurity?.gaps || []), inputValue]
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notes</h3>
                  <div className="rounded-md border p-4">
                    <textarea
                      className="w-full h-24 p-2 border rounded"
                      placeholder="Enter notes about application security implementation..."
                      value={currentItem.applicationSecurity?.notes || ''}
                      onChange={(e) => {
                        const updatedItem = { 
                          ...currentItem, 
                          applicationSecurity: {
                            ...currentItem.applicationSecurity || {
                              gaps: []
                            },
                            notes: e.target.value
                          }
                        };
                        updateMatrixItem(currentInfraIndex, updatedItem);
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Third Party Management Tab */}
            <TabsContent value="thirdPartyManagement">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Third Party Management Implementation</h3>
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Key Controls</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="tpm-vendor-assessment" 
                            checked={currentItem.thirdPartyManagement?.vendorAssessment || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                thirdPartyManagement: {
                                  ...currentItem.thirdPartyManagement || {},
                                  vendorAssessment: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="tpm-vendor-assessment">Vendor Assessment</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="tpm-contractual-requirements" 
                            checked={currentItem.thirdPartyManagement?.contractualRequirements || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                thirdPartyManagement: {
                                  ...currentItem.thirdPartyManagement || {},
                                  contractualRequirements: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="tpm-contractual-requirements">Contractual Requirements</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="tpm-ongoing-monitoring" 
                            checked={currentItem.thirdPartyManagement?.ongoingMonitoring || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                thirdPartyManagement: {
                                  ...currentItem.thirdPartyManagement || {},
                                  ongoingMonitoring: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="tpm-ongoing-monitoring">Ongoing Monitoring</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="tpm-offboarding-process" 
                            checked={currentItem.thirdPartyManagement?.offboardingProcess || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                thirdPartyManagement: {
                                  ...currentItem.thirdPartyManagement || {},
                                  offboardingProcess: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="tpm-offboarding-process">Offboarding Process</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Implementation Level</h4>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {[0, 1, 2, 3, 4, 5].map((level) => (
                          <div 
                            key={level}
                            className={`rounded-md border p-2 cursor-pointer hover:border-primary hover:bg-primary/5 ${
                              currentItem.thirdPartyManagement?.implementationLevel === level ? 'border-primary bg-primary/10' : ''
                            }`}
                            onClick={() => {
                              const updatedItem = { 
                                ...currentItem, 
                                thirdPartyManagement: {
                                  ...currentItem.thirdPartyManagement || {},
                                  implementationLevel: level
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          >
                            <div className="text-center">
                              <p className="text-sm font-semibold">{level}</p>
                              <p className="text-xs">
                                {level === 0 && 'Not Implemented'}
                                {level === 1 && 'Initial'}
                                {level === 2 && 'Repeatable'}
                                {level === 3 && 'Defined'}
                                {level === 4 && 'Managed'}
                                {level === 5 && 'Optimized'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Implementation Gaps</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentItem.thirdPartyManagement?.gaps?.map((gap, index) => (
                          <Badge key={index} variant="secondary" className="gap-2">
                            {gap}
                            <button 
                              className="text-xs hover:text-primary"
                              onClick={() => {
                                const updatedItem = { 
                                  ...currentItem, 
                                  thirdPartyManagement: {
                                    ...currentItem.thirdPartyManagement,
                                    gaps: currentItem.thirdPartyManagement.gaps.filter((_, i) => i !== index)
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                              }}
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          id="tpm-gap" 
                          placeholder="Add a gap in third party management..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const inputValue = (e.target as HTMLInputElement).value;
                              if (inputValue.trim()) {
                                const updatedItem = { 
                                  ...currentItem, 
                                  thirdPartyManagement: {
                                    ...currentItem.thirdPartyManagement || {
                                      gaps: []
                                    },
                                    gaps: [...(currentItem.thirdPartyManagement?.gaps || []), inputValue]
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            const input = document.getElementById('tpm-gap') as HTMLInputElement;
                            const inputValue = input.value;
                            if (inputValue.trim()) {
                              const updatedItem = { 
                                ...currentItem, 
                                thirdPartyManagement: {
                                  ...currentItem.thirdPartyManagement || {
                                    gaps: []
                                  },
                                  gaps: [...(currentItem.thirdPartyManagement?.gaps || []), inputValue]
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notes</h3>
                  <div className="rounded-md border p-4">
                    <textarea
                      className="w-full h-24 p-2 border rounded"
                      placeholder="Enter notes about third party management implementation..."
                      value={currentItem.thirdPartyManagement?.notes || ''}
                      onChange={(e) => {
                        const updatedItem = { 
                          ...currentItem, 
                          thirdPartyManagement: {
                            ...currentItem.thirdPartyManagement || {
                              gaps: []
                            },
                            notes: e.target.value
                          }
                        };
                        updateMatrixItem(currentInfraIndex, updatedItem);
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Asset Management Tab */}
            <TabsContent value="assetManagement">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Asset Management Implementation</h3>
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Key Controls</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="am-inventory-management" 
                            checked={currentItem.assetManagement?.inventoryManagement || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                assetManagement: {
                                  ...currentItem.assetManagement || {},
                                  inventoryManagement: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="am-inventory-management">Inventory Management</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="am-asset-classification" 
                            checked={currentItem.assetManagement?.assetClassification || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                assetManagement: {
                                  ...currentItem.assetManagement || {},
                                  assetClassification: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="am-asset-classification">Asset Classification</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="am-end-of-life" 
                            checked={currentItem.assetManagement?.endOfLifeManagement || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                assetManagement: {
                                  ...currentItem.assetManagement || {},
                                  endOfLifeManagement: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="am-end-of-life">End-of-Life Management</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="am-asset-tracking" 
                            checked={currentItem.assetManagement?.assetTracking || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                assetManagement: {
                                  ...currentItem.assetManagement || {},
                                  assetTracking: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="am-asset-tracking">Asset Tracking</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Implementation Level</h4>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {[0, 1, 2, 3, 4, 5].map((level) => (
                          <div 
                            key={level}
                            className={`rounded-md border p-2 cursor-pointer hover:border-primary hover:bg-primary/5 ${
                              currentItem.assetManagement?.implementationLevel === level ? 'border-primary bg-primary/10' : ''
                            }`}
                            onClick={() => {
                              const updatedItem = { 
                                ...currentItem, 
                                assetManagement: {
                                  ...currentItem.assetManagement || {},
                                  implementationLevel: level
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          >
                            <div className="text-center">
                              <p className="text-sm font-semibold">{level}</p>
                              <p className="text-xs">
                                {level === 0 && 'Not Implemented'}
                                {level === 1 && 'Initial'}
                                {level === 2 && 'Repeatable'}
                                {level === 3 && 'Defined'}
                                {level === 4 && 'Managed'}
                                {level === 5 && 'Optimized'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Implementation Gaps</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentItem.assetManagement?.gaps?.map((gap, index) => (
                          <Badge key={index} variant="secondary" className="gap-2">
                            {gap}
                            <button 
                              className="text-xs hover:text-primary"
                              onClick={() => {
                                const updatedItem = { 
                                  ...currentItem, 
                                  assetManagement: {
                                    ...currentItem.assetManagement,
                                    gaps: currentItem.assetManagement.gaps.filter((_, i) => i !== index)
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                              }}
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          id="am-gap" 
                          placeholder="Add a gap in asset management..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const inputValue = (e.target as HTMLInputElement).value;
                              if (inputValue.trim()) {
                                const updatedItem = { 
                                  ...currentItem, 
                                  assetManagement: {
                                    ...currentItem.assetManagement || {
                                      gaps: []
                                    },
                                    gaps: [...(currentItem.assetManagement?.gaps || []), inputValue]
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            const input = document.getElementById('am-gap') as HTMLInputElement;
                            const inputValue = input.value;
                            if (inputValue.trim()) {
                              const updatedItem = { 
                                ...currentItem, 
                                assetManagement: {
                                  ...currentItem.assetManagement || {
                                    gaps: []
                                  },
                                  gaps: [...(currentItem.assetManagement?.gaps || []), inputValue]
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notes</h3>
                  <div className="rounded-md border p-4">
                    <textarea
                      className="w-full h-24 p-2 border rounded"
                      placeholder="Enter notes about asset management implementation..."
                      value={currentItem.assetManagement?.notes || ''}
                      onChange={(e) => {
                        const updatedItem = { 
                          ...currentItem, 
                          assetManagement: {
                            ...currentItem.assetManagement || {
                              gaps: []
                            },
                            notes: e.target.value
                          }
                        };
                        updateMatrixItem(currentInfraIndex, updatedItem);
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Security Governance Tab */}
            <TabsContent value="securityGovernance">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Security Governance Implementation</h3>
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Key Controls</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="sg-security-policies" 
                            checked={currentItem.securityGovernance?.securityPolicies || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                securityGovernance: {
                                  ...currentItem.securityGovernance || {},
                                  securityPolicies: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="sg-security-policies">Security Policies</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="sg-risk-assessment" 
                            checked={currentItem.securityGovernance?.riskAssessment || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                securityGovernance: {
                                  ...currentItem.securityGovernance || {},
                                  riskAssessment: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="sg-risk-assessment">Risk Assessment</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="sg-compliance-management" 
                            checked={currentItem.securityGovernance?.complianceManagement || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                securityGovernance: {
                                  ...currentItem.securityGovernance || {},
                                  complianceManagement: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="sg-compliance-management">Compliance Management</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="sg-security-roles" 
                            checked={currentItem.securityGovernance?.securityRoles || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                securityGovernance: {
                                  ...currentItem.securityGovernance || {},
                                  securityRoles: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="sg-security-roles">Security Roles</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Implementation Level</h4>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {[0, 1, 2, 3, 4, 5].map((level) => (
                          <div 
                            key={level}
                            className={`rounded-md border p-2 cursor-pointer hover:border-primary hover:bg-primary/5 ${
                              currentItem.securityGovernance?.implementationLevel === level ? 'border-primary bg-primary/10' : ''
                            }`}
                            onClick={() => {
                              const updatedItem = { 
                                ...currentItem, 
                                securityGovernance: {
                                  ...currentItem.securityGovernance || {},
                                  implementationLevel: level
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          >
                            <div className="text-center">
                              <p className="text-sm font-semibold">{level}</p>
                              <p className="text-xs">
                                {level === 0 && 'Not Implemented'}
                                {level === 1 && 'Initial'}
                                {level === 2 && 'Repeatable'}
                                {level === 3 && 'Defined'}
                                {level === 4 && 'Managed'}
                                {level === 5 && 'Optimized'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Implementation Gaps</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentItem.securityGovernance?.gaps?.map((gap, index) => (
                          <Badge key={index} variant="secondary" className="gap-2">
                            {gap}
                            <button 
                              className="text-xs hover:text-primary"
                              onClick={() => {
                                const updatedItem = { 
                                  ...currentItem, 
                                  securityGovernance: {
                                    ...currentItem.securityGovernance,
                                    gaps: currentItem.securityGovernance.gaps.filter((_, i) => i !== index)
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                              }}
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          id="sg-gap" 
                          placeholder="Add a gap in security governance..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const inputValue = (e.target as HTMLInputElement).value;
                              if (inputValue.trim()) {
                                const updatedItem = { 
                                  ...currentItem, 
                                  securityGovernance: {
                                    ...currentItem.securityGovernance || {
                                      gaps: []
                                    },
                                    gaps: [...(currentItem.securityGovernance?.gaps || []), inputValue]
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            const input = document.getElementById('sg-gap') as HTMLInputElement;
                            const inputValue = input.value;
                            if (inputValue.trim()) {
                              const updatedItem = { 
                                ...currentItem, 
                                securityGovernance: {
                                  ...currentItem.securityGovernance || {
                                    gaps: []
                                  },
                                  gaps: [...(currentItem.securityGovernance?.gaps || []), inputValue]
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notes</h3>
                  <div className="rounded-md border p-4">
                    <textarea
                      className="w-full h-24 p-2 border rounded"
                      placeholder="Enter notes about security governance implementation..."
                      value={currentItem.securityGovernance?.notes || ''}
                      onChange={(e) => {
                        const updatedItem = { 
                          ...currentItem, 
                          securityGovernance: {
                            ...currentItem.securityGovernance || {
                              gaps: []
                            },
                            notes: e.target.value
                          }
                        };
                        updateMatrixItem(currentInfraIndex, updatedItem);
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Compliance Management Tab */}
            <TabsContent value="complianceManagement">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Compliance Management Implementation</h3>
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Key Controls</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="cm-regulatory-mapping" 
                            checked={currentItem.complianceManagement?.regulatoryMapping || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                complianceManagement: {
                                  ...currentItem.complianceManagement || {},
                                  regulatoryMapping: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="cm-regulatory-mapping">Regulatory Mapping</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="cm-compliance-monitoring" 
                            checked={currentItem.complianceManagement?.complianceMonitoring || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                complianceManagement: {
                                  ...currentItem.complianceManagement || {},
                                  complianceMonitoring: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="cm-compliance-monitoring">Compliance Monitoring</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="cm-audit-preparation" 
                            checked={currentItem.complianceManagement?.auditPreparation || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                complianceManagement: {
                                  ...currentItem.complianceManagement || {},
                                  auditPreparation: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="cm-audit-preparation">Audit Preparation</Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch 
                            id="cm-remediation-tracking" 
                            checked={currentItem.complianceManagement?.remediationTracking || false}
                            onCheckedChange={(checked) => {
                              const updatedItem = { 
                                ...currentItem, 
                                complianceManagement: {
                                  ...currentItem.complianceManagement || {},
                                  remediationTracking: checked
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          />
                          <Label htmlFor="cm-remediation-tracking">Remediation Tracking</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Implementation Level</h4>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {[0, 1, 2, 3, 4, 5].map((level) => (
                          <div 
                            key={level}
                            className={`rounded-md border p-2 cursor-pointer hover:border-primary hover:bg-primary/5 ${
                              currentItem.complianceManagement?.implementationLevel === level ? 'border-primary bg-primary/10' : ''
                            }`}
                            onClick={() => {
                              const updatedItem = { 
                                ...currentItem, 
                                complianceManagement: {
                                  ...currentItem.complianceManagement || {},
                                  implementationLevel: level
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                            }}
                          >
                            <div className="text-center">
                              <p className="text-sm font-semibold">{level}</p>
                              <p className="text-xs">
                                {level === 0 && 'Not Implemented'}
                                {level === 1 && 'Initial'}
                                {level === 2 && 'Repeatable'}
                                {level === 3 && 'Defined'}
                                {level === 4 && 'Managed'}
                                {level === 5 && 'Optimized'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Implementation Gaps</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentItem.complianceManagement?.gaps?.map((gap, index) => (
                          <Badge key={index} variant="secondary" className="gap-2">
                            {gap}
                            <button 
                              className="text-xs hover:text-primary"
                              onClick={() => {
                                const updatedItem = { 
                                  ...currentItem, 
                                  complianceManagement: {
                                    ...currentItem.complianceManagement,
                                    gaps: currentItem.complianceManagement.gaps.filter((_, i) => i !== index)
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                              }}
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          id="cm-gap" 
                          placeholder="Add a gap in compliance management..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const inputValue = (e.target as HTMLInputElement).value;
                              if (inputValue.trim()) {
                                const updatedItem = { 
                                  ...currentItem, 
                                  complianceManagement: {
                                    ...currentItem.complianceManagement || {
                                      gaps: []
                                    },
                                    gaps: [...(currentItem.complianceManagement?.gaps || []), inputValue]
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            const input = document.getElementById('cm-gap') as HTMLInputElement;
                            const inputValue = input.value;
                            if (inputValue.trim()) {
                              const updatedItem = { 
                                ...currentItem, 
                                complianceManagement: {
                                  ...currentItem.complianceManagement || {
                                    gaps: []
                                  },
                                  gaps: [...(currentItem.complianceManagement?.gaps || []), inputValue]
                                }
                              };
                              updateMatrixItem(currentInfraIndex, updatedItem);
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notes</h3>
                  <div className="rounded-md border p-4">
                    <textarea
                      className="w-full h-24 p-2 border rounded"
                      placeholder="Enter notes about compliance management implementation..."
                      value={currentItem.complianceManagement?.notes || ''}
                      onChange={(e) => {
                        const updatedItem = { 
                          ...currentItem, 
                          complianceManagement: {
                            ...currentItem.complianceManagement || {
                              gaps: []
                            },
                            notes: e.target.value
                          }
                        };
                        updateMatrixItem(currentInfraIndex, updatedItem);
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Security Controls Tab */}
            <TabsContent value="controls">
              <div className="space-y-8">
                {/* Operation Controls */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Operation Controls</h3>
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Frameworks</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentItem.operationControls.frameworks.map((framework, index) => (
                          <Badge key={index}>{framework}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center space-x-4">
                        <Switch 
                          id="operation-implemented" 
                          checked={currentItem.operationControls.implemented}
                          onCheckedChange={handleOperationControlImplementedChange}
                        />
                        <Label htmlFor="operation-implemented">
                          {currentItem.operationControls.implemented 
                            ? "Operational controls are implemented" 
                            : "Operational controls are not implemented"}
                        </Label>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Implementation Gaps</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentItem.operationControls.gaps.map((gap, index) => (
                          <Badge key={index} variant="secondary" className="gap-2">
                            {gap}
                            <button 
                              className="text-xs hover:text-primary"
                              onClick={() => {
                                const updatedItem = { 
                                  ...currentItem, 
                                  operationControls: {
                                    ...currentItem.operationControls,
                                    gaps: currentItem.operationControls.gaps.filter((_, i) => i !== index)
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                              }}
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          id="operation-gap" 
                          placeholder="Add a gap..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddOperationalGap((e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            const input = document.getElementById('operation-gap') as HTMLInputElement;
                            handleAddOperationalGap(input.value);
                            input.value = '';
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Management Controls */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Management Controls</h3>
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Frameworks</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentItem.managementControls.frameworks.map((framework, index) => (
                          <Badge key={index}>{framework}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center space-x-4">
                        <Switch 
                          id="management-implemented" 
                          checked={currentItem.managementControls.implemented}
                          onCheckedChange={handleManagementControlImplementedChange}
                        />
                        <Label htmlFor="management-implemented">
                          {currentItem.managementControls.implemented 
                            ? "Management controls are implemented" 
                            : "Management controls are not implemented"}
                        </Label>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Implementation Gaps</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentItem.managementControls.gaps.map((gap, index) => (
                          <Badge key={index} variant="secondary" className="gap-2">
                            {gap}
                            <button 
                              className="text-xs hover:text-primary"
                              onClick={() => {
                                const updatedItem = { 
                                  ...currentItem, 
                                  managementControls: {
                                    ...currentItem.managementControls,
                                    gaps: currentItem.managementControls.gaps.filter((_, i) => i !== index)
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                              }}
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          id="management-gap" 
                          placeholder="Add a gap..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddManagementGap((e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            const input = document.getElementById('management-gap') as HTMLInputElement;
                            handleAddManagementGap(input.value);
                            input.value = '';
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Technology Controls */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Technology Controls</h3>
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Frameworks</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentItem.technologyControls.frameworks.map((framework, index) => (
                          <Badge key={index}>{framework}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center space-x-4">
                        <Switch 
                          id="technology-implemented" 
                          checked={currentItem.technologyControls.implemented}
                          onCheckedChange={handleTechnologyControlImplementedChange}
                        />
                        <Label htmlFor="technology-implemented">
                          {currentItem.technologyControls.implemented 
                            ? "Technology controls are implemented" 
                            : "Technology controls are not implemented"}
                        </Label>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">OS Hardening</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="stig" 
                            checked={currentItem.technologyControls.osHardening.stig}
                            onCheckedChange={(checked) => handleOsHardeningChange("stig", checked === true)}
                          />
                          <Label htmlFor="stig">STIG (Security Technical Implementation Guide)</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="scap" 
                            checked={currentItem.technologyControls.osHardening.scap}
                            onCheckedChange={(checked) => handleOsHardeningChange("scap", checked === true)}
                          />
                          <Label htmlFor="scap">SCAP (Security Content Automation Protocol)</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Implementation Gaps</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentItem.technologyControls.gaps.map((gap, index) => (
                          <Badge key={index} variant="secondary" className="gap-2">
                            {gap}
                            <button 
                              className="text-xs hover:text-primary"
                              onClick={() => {
                                const updatedItem = { 
                                  ...currentItem, 
                                  technologyControls: {
                                    ...currentItem.technologyControls,
                                    gaps: currentItem.technologyControls.gaps.filter((_, i) => i !== index)
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                              }}
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          id="technology-gap" 
                          placeholder="Add a gap..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddTechnologyGap((e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            const input = document.getElementById('technology-gap') as HTMLInputElement;
                            handleAddTechnologyGap(input.value);
                            input.value = '';
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">OS Hardening Guidelines</h3>
                  <div className="rounded-md border p-4">
                    <div className="mb-4">
                      <div className="flex items-center space-x-4">
                        <Switch 
                          id="stig-scap" 
                          checked={currentItem.osHardening.stigScap}
                          onCheckedChange={handleStigScapChange}
                        />
                        <Label htmlFor="stig-scap">
                          {currentItem.osHardening.stigScap 
                            ? "STIG/SCAP is implemented" 
                            : "STIG/SCAP is not implemented"}
                        </Label>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Hardening Guidelines</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentItem.osHardening.guidelines.map((guideline, index) => (
                          <Badge key={index} variant="secondary" className="gap-2">
                            {guideline}
                            <button 
                              className="text-xs hover:text-primary"
                              onClick={() => {
                                const updatedItem = { 
                                  ...currentItem, 
                                  osHardening: {
                                    ...currentItem.osHardening,
                                    guidelines: currentItem.osHardening.guidelines.filter((_, i) => i !== index)
                                  }
                                };
                                updateMatrixItem(currentInfraIndex, updatedItem);
                              }}
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          id="os-guideline" 
                          placeholder="Add a guideline..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddOsHardeningGuideline((e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            const input = document.getElementById('os-guideline') as HTMLInputElement;
                            handleAddOsHardeningGuideline(input.value);
                            input.value = '';
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Compliance & Standards Tab */}
            <TabsContent value="compliance">
              <div className="space-y-8">
                <Accordion type="single" collapsible defaultValue="standards">
                  {/* Standards */}
                  <AccordionItem value="standards">
                    <AccordionTrigger>
                      <h3 className="text-lg font-semibold">Standards</h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4 p-4">
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="iso27001" 
                            checked={currentItem.standards.iso27001}
                            onCheckedChange={(checked) => handleStandardChange("iso27001", checked === true)}
                          />
                          <Label htmlFor="iso27001">ISO 27001</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="iso27002" 
                            checked={currentItem.standards.iso27002}
                            onCheckedChange={(checked) => handleStandardChange("iso27002", checked === true)}
                          />
                          <Label htmlFor="iso27002">ISO 27002</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="nistCsf" 
                            checked={currentItem.standards.nistCsf}
                            onCheckedChange={(checked) => handleStandardChange("nistCsf", checked === true)}
                          />
                          <Label htmlFor="nistCsf">NIST CSF</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="nist80053" 
                            checked={currentItem.standards.nist80053}
                            onCheckedChange={(checked) => handleStandardChange("nist80053", checked === true)}
                          />
                          <Label htmlFor="nist80053">NIST 800-53</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="iso27018" 
                            checked={currentItem.standards.iso27018}
                            onCheckedChange={(checked) => handleStandardChange("iso27018", checked === true)}
                          />
                          <Label htmlFor="iso27018">ISO 27018</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="iso27005" 
                            checked={currentItem.standards.iso27005}
                            onCheckedChange={(checked) => handleStandardChange("iso27005", checked === true)}
                          />
                          <Label htmlFor="iso27005">ISO 27005</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="cisCsc" 
                            checked={currentItem.standards.cisCsc}
                            onCheckedChange={(checked) => handleStandardChange("cisCsc", checked === true)}
                          />
                          <Label htmlFor="cisCsc">CIS CSC</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="nist800171" 
                            checked={currentItem.standards.nist800171}
                            onCheckedChange={(checked) => handleStandardChange("nist800171", checked === true)}
                          />
                          <Label htmlFor="nist800171">NIST 800-171</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="itil" 
                            checked={currentItem.standards.itil}
                            onCheckedChange={(checked) => handleStandardChange("itil", checked === true)}
                          />
                          <Label htmlFor="itil">ITIL</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="cobit" 
                            checked={currentItem.standards.cobit}
                            onCheckedChange={(checked) => handleStandardChange("cobit", checked === true)}
                          />
                          <Label htmlFor="cobit">COBIT</Label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Compliance Standards */}
                  <AccordionItem value="compliance">
                    <AccordionTrigger>
                      <h3 className="text-lg font-semibold">Compliance Standards</h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4 p-4">
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="pciDss" 
                            checked={currentItem.complianceStandards.pciDss}
                            onCheckedChange={(checked) => handleComplianceStandardChange("pciDss", checked === true)}
                          />
                          <Label htmlFor="pciDss">PCI DSS</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="hipaa" 
                            checked={currentItem.complianceStandards.hipaa}
                            onCheckedChange={(checked) => handleComplianceStandardChange("hipaa", checked === true)}
                          />
                          <Label htmlFor="hipaa">HIPAA</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="cmmc" 
                            checked={currentItem.complianceStandards.cmmc}
                            onCheckedChange={(checked) => handleComplianceStandardChange("cmmc", checked === true)}
                          />
                          <Label htmlFor="cmmc">CMMC</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="soc2" 
                            checked={currentItem.complianceStandards.soc2}
                            onCheckedChange={(checked) => handleComplianceStandardChange("soc2", checked === true)}
                          />
                          <Label htmlFor="soc2">SOC 2</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="cyberEssentialsUk" 
                            checked={currentItem.complianceStandards.cyberEssentialsUk}
                            onCheckedChange={(checked) => handleComplianceStandardChange("cyberEssentialsUk", checked === true)}
                          />
                          <Label htmlFor="cyberEssentialsUk">Cyber Essentials (UK)</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="ferpa" 
                            checked={currentItem.complianceStandards.ferpa}
                            onCheckedChange={(checked) => handleComplianceStandardChange("ferpa", checked === true)}
                          />
                          <Label htmlFor="ferpa">FERPA</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="glba" 
                            checked={currentItem.complianceStandards.glba}
                            onCheckedChange={(checked) => handleComplianceStandardChange("glba", checked === true)}
                          />
                          <Label htmlFor="glba">GLBA</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="sbaCsg" 
                            checked={currentItem.complianceStandards.sbaCsg}
                            onCheckedChange={(checked) => handleComplianceStandardChange("sbaCsg", checked === true)}
                          />
                          <Label htmlFor="sbaCsg">SBA CSG</Label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Regulatory Requirements */}
                  <AccordionItem value="regulatory">
                    <AccordionTrigger>
                      <h3 className="text-lg font-semibold">Regulatory Requirements</h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4 p-4">
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="reg-pciDss" 
                            checked={currentItem.regulatoryRequirements.pciDss}
                            onCheckedChange={(checked) => handleRegulatoryRequirementChange("pciDss", checked === true)}
                          />
                          <Label htmlFor="reg-pciDss">PCI DSS</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="coppa" 
                            checked={currentItem.regulatoryRequirements.coppa}
                            onCheckedChange={(checked) => handleRegulatoryRequirementChange("coppa", checked === true)}
                          />
                          <Label htmlFor="coppa">COPPA</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="reg-hipaa" 
                            checked={currentItem.regulatoryRequirements.hipaa}
                            onCheckedChange={(checked) => handleRegulatoryRequirementChange("hipaa", checked === true)}
                          />
                          <Label htmlFor="reg-hipaa">HIPAA</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="gdpr" 
                            checked={currentItem.regulatoryRequirements.gdpr}
                            onCheckedChange={(checked) => handleRegulatoryRequirementChange("gdpr", checked === true)}
                          />
                          <Label htmlFor="gdpr">GDPR</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="ccpa" 
                            checked={currentItem.regulatoryRequirements.ccpa}
                            onCheckedChange={(checked) => handleRegulatoryRequirementChange("ccpa", checked === true)}
                          />
                          <Label htmlFor="ccpa">CCPA</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="reg-glba" 
                            checked={currentItem.regulatoryRequirements.glba}
                            onCheckedChange={(checked) => handleRegulatoryRequirementChange("glba", checked === true)}
                          />
                          <Label htmlFor="reg-glba">GLBA</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="reg-ferpa" 
                            checked={currentItem.regulatoryRequirements.ferpa}
                            onCheckedChange={(checked) => handleRegulatoryRequirementChange("ferpa", checked === true)}
                          />
                          <Label htmlFor="reg-ferpa">FERPA</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="pipeda" 
                            checked={currentItem.regulatoryRequirements.pipeda}
                            onCheckedChange={(checked) => handleRegulatoryRequirementChange("pipeda", checked === true)}
                          />
                          <Label htmlFor="pipeda">PIPEDA</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="ftcSafeguardRules" 
                            checked={currentItem.regulatoryRequirements.ftcSafeguardRules}
                            onCheckedChange={(checked) => handleRegulatoryRequirementChange("ftcSafeguardRules", checked === true)}
                          />
                          <Label htmlFor="ftcSafeguardRules">FTC Safeguard Rules</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="fisma" 
                            checked={currentItem.regulatoryRequirements.fisma}
                            onCheckedChange={(checked) => handleRegulatoryRequirementChange("fisma", checked === true)}
                          />
                          <Label htmlFor="fisma">FISMA</Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Checkbox 
                            id="dfars" 
                            checked={currentItem.regulatoryRequirements.dfars}
                            onCheckedChange={(checked) => handleRegulatoryRequirementChange("dfars", checked === true)}
                          />
                          <Label htmlFor="dfars">DFARS</Label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
            
            {/* MITRE ATT&CK Tab */}
            <TabsContent value="mitre">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">MITRE ATT&CK Tactics</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentItem.mitreTactics.map((tactic, index) => (
                      <Badge key={index} variant="outline">{tactic}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">MITRE ATT&CK Techniques</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentItem.mitreTechniques.map((technique, index) => (
                      <Badge key={index} variant="outline">{technique}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Policy Documents Tab */}
            <TabsContent value="policies">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Policies</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentItem.policyDocuments.policies.map((policy, index) => (
                      <Badge key={index} variant="outline">{policy}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Procedures</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentItem.policyDocuments.procedures.map((procedure, index) => (
                      <Badge key={index} variant="outline">{procedure}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Plans</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentItem.policyDocuments.plans.map((plan, index) => (
                      <Badge key={index} variant="outline">{plan}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Processes</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentItem.policyDocuments.processes.map((process, index) => (
                      <Badge key={index} variant="outline">{process}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={handleSubmit}>
              Next: Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}