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
import ScoreCardVisualizations from "./scorecard-visualizations";

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
  const [showScorecard, setShowScorecard] = useState(false);
  
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
        implemented: checked
      }
    };
    updateMatrixItem(currentInfraIndex, updatedItem);
  };
  
  // Handler for people control implementation toggle
  const handlePeopleControlImplementedChange = (checked: boolean) => {
    const updatedItem = { 
      ...matrixData[currentInfraIndex], 
      peopleControls: {
        ...matrixData[currentInfraIndex].peopleControls || {
          frameworks: [],
          applicable: false,
          implemented: false,
          gaps: []
        },
        implemented: checked
      }
    };
    updateMatrixItem(currentInfraIndex, updatedItem);
  };

  // Get current matrix item being edited
  const currentItem = matrixData[currentInfraIndex];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Security Matrix: Infrastructure Components</CardTitle>
        <CardDescription>
          Review and complete the security matrix for each infrastructure component.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="font-medium mb-2">Infrastructure Components (Internet Gateway & Footprint)</h3>
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
          <Separator className="my-4" />
        </div>
        
        <Tabs defaultValue="infrastructureMode" className="w-full">
          <ScrollArea className="max-w-full">
            <TabsList className="w-full mb-4 flex-wrap">
              <TabsTrigger value="infrastructureMode">Infrastructure Mode of Operation</TabsTrigger>
              <TabsTrigger value="securityRisks">Security Risks & Vulnerabilities</TabsTrigger>
              <TabsTrigger value="baselineConfig">Baseline Configuration</TabsTrigger>
              <TabsTrigger value="securityControlFramework">Security Control vs Framework</TabsTrigger>
              
              <TabsTrigger value="complianceRequirements">Compliance Requirements</TabsTrigger>
              <TabsTrigger value="regulatoryRequirements">Regulatory Requirements</TabsTrigger>
              <TabsTrigger value="standardsGuidelines">Standards & Guidelines</TabsTrigger>
              <TabsTrigger value="relevantAcqTools">Relevant ACQ Tools</TabsTrigger>
              
              <TabsTrigger value="adversarialInsight">Adversarial Insight (MITRE ATT&CK)</TabsTrigger>
              <TabsTrigger value="isms">Information Security Management System (ISMS)</TabsTrigger>
              <TabsTrigger value="deviceInventory">Device Inventory Tracking</TabsTrigger>
              <TabsTrigger value="identityBehavior">Identity Behavior & Hygiene</TabsTrigger>
            </TabsList>
          </ScrollArea>
          
          {/* Infrastructure Mode of Operation Tab */}
          <TabsContent value="infrastructureMode">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Infrastructure Mode Implementation</h3>
                <div className="rounded-md border p-4">
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Key Controls</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Switch 
                          id="im-cloud" 
                          checked={currentItem.infrastructureMode?.cloud || false}
                          onCheckedChange={(checked) => {
                            const updatedItem = { 
                              ...currentItem, 
                              infrastructureMode: {
                                ...currentItem.infrastructureMode || {},
                                cloud: checked
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="im-cloud">Cloud</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Switch 
                          id="im-hybrid" 
                          checked={currentItem.infrastructureMode?.hybrid || false}
                          onCheckedChange={(checked) => {
                            const updatedItem = { 
                              ...currentItem, 
                              infrastructureMode: {
                                ...currentItem.infrastructureMode || {},
                                hybrid: checked
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="im-hybrid">Hybrid</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Switch 
                          id="im-on-premises" 
                          checked={currentItem.infrastructureMode?.onPremises || false}
                          onCheckedChange={(checked) => {
                            const updatedItem = { 
                              ...currentItem, 
                              infrastructureMode: {
                                ...currentItem.infrastructureMode || {},
                                onPremises: checked
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="im-on-premises">On-Premises</Label>
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
                            currentItem.infrastructureMode?.implementationLevel === level ? 'border-primary bg-primary/10' : ''
                          }`}
                          onClick={() => {
                            const updatedItem = { 
                              ...currentItem, 
                              infrastructureMode: {
                                ...currentItem.infrastructureMode || {},
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
                      {currentItem.infrastructureMode?.gaps?.map((gap, index) => (
                        <Badge key={index} variant="secondary" className="gap-2">
                          {gap}
                          <button 
                            className="text-xs hover:text-primary"
                            onClick={() => {
                              const updatedItem = { 
                                ...currentItem, 
                                infrastructureMode: {
                                  ...currentItem.infrastructureMode || {},
                                  gaps: currentItem.infrastructureMode?.gaps?.filter((_, i) => i !== index) || []
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
                        id="im-gap" 
                        placeholder="Add a gap in infrastructure mode..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const inputValue = (e.target as HTMLInputElement).value;
                            if (inputValue.trim()) {
                              const updatedItem = { 
                                ...currentItem, 
                                infrastructureMode: {
                                  ...currentItem.infrastructureMode || {
                                    gaps: []
                                  },
                                  gaps: [...(currentItem.infrastructureMode?.gaps || []), inputValue]
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
                          const input = document.getElementById('im-gap') as HTMLInputElement;
                          const inputValue = input.value;
                          if (inputValue.trim()) {
                            const updatedItem = { 
                              ...currentItem, 
                              infrastructureMode: {
                                ...currentItem.infrastructureMode || {
                                  gaps: []
                                },
                                gaps: [...(currentItem.infrastructureMode?.gaps || []), inputValue]
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
                    placeholder="Enter notes about infrastructure mode implementation..."
                    value={currentItem.infrastructureMode?.notes || ''}
                    onChange={(e) => {
                      const updatedItem = { 
                        ...currentItem, 
                        infrastructureMode: {
                          ...currentItem.infrastructureMode || {
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
          
          {/* Security Risks & Vulnerabilities Tab */}
          <TabsContent value="securityRisks">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Security Risks & Vulnerabilities Implementation</h3>
                <div className="rounded-md border p-4">
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Key Controls</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Switch 
                          id="sr-assessment" 
                          checked={currentItem.securityRisks?.assessmentPerformed || false}
                          onCheckedChange={(checked) => {
                            const updatedItem = { 
                              ...currentItem, 
                              securityRisks: {
                                ...currentItem.securityRisks || {},
                                assessmentPerformed: checked
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="sr-assessment">Assessment Performed</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Switch 
                          id="sr-vulnerabilities" 
                          checked={currentItem.securityRisks?.vulnerabilitiesDocumented || false}
                          onCheckedChange={(checked) => {
                            const updatedItem = { 
                              ...currentItem, 
                              securityRisks: {
                                ...currentItem.securityRisks || {},
                                vulnerabilitiesDocumented: checked
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="sr-vulnerabilities">Vulnerabilities Documented</Label>
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
                            currentItem.securityRisks?.implementationLevel === level ? 'border-primary bg-primary/10' : ''
                          }`}
                          onClick={() => {
                            const updatedItem = { 
                              ...currentItem, 
                              securityRisks: {
                                ...currentItem.securityRisks || {},
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
                      {currentItem.securityRisks?.gaps?.map((gap, index) => (
                        <Badge key={index} variant="secondary" className="gap-2">
                          {gap}
                          <button 
                            className="text-xs hover:text-primary"
                            onClick={() => {
                              const updatedItem = { 
                                ...currentItem, 
                                securityRisks: {
                                  ...currentItem.securityRisks || {},
                                  gaps: currentItem.securityRisks?.gaps?.filter((_, i) => i !== index) || []
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
                        id="sr-gap" 
                        placeholder="Add a gap in security risks & vulnerabilities..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const inputValue = (e.target as HTMLInputElement).value;
                            if (inputValue.trim()) {
                              const updatedItem = { 
                                ...currentItem, 
                                securityRisks: {
                                  ...currentItem.securityRisks || {
                                    gaps: []
                                  },
                                  gaps: [...(currentItem.securityRisks?.gaps || []), inputValue]
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
                          const input = document.getElementById('sr-gap') as HTMLInputElement;
                          const inputValue = input.value;
                          if (inputValue.trim()) {
                            const updatedItem = { 
                              ...currentItem, 
                              securityRisks: {
                                ...currentItem.securityRisks || {
                                  gaps: []
                                },
                                gaps: [...(currentItem.securityRisks?.gaps || []), inputValue]
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
                    placeholder="Enter notes about security risks & vulnerabilities..."
                    value={currentItem.securityRisks?.notes || ''}
                    onChange={(e) => {
                      const updatedItem = { 
                        ...currentItem, 
                        securityRisks: {
                          ...currentItem.securityRisks || {
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
          
          {/* Information Security Management System (ISMS) Tab */}
          <TabsContent value="isms">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Information Security Management System (ISMS)</h3>
                <p className="text-sm text-gray-600 mb-4">Indicate the current implementation state of your Information Security Management System</p>
                
                {/* Simple ISMS Implementation Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md mb-6">
                  <div className="flex items-center space-x-3">
                    <Switch 
                      id="isms-implemented" 
                      checked={currentItem.informationSecurityManagementSystem?.ismsImplemented || false}
                      onCheckedChange={(checked) => {
                        const updatedItem = { 
                          ...currentItem, 
                          informationSecurityManagementSystem: {
                            ...currentItem.informationSecurityManagementSystem || {},
                            ismsImplemented: checked
                          }
                        };
                        updateMatrixItem(currentInfraIndex, updatedItem);
                      }}
                    />
                    <Label htmlFor="isms-implemented">ISMS Implemented</Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Switch 
                      id="isms-iso27001" 
                      checked={currentItem.informationSecurityManagementSystem?.iso27001Compliant || false}
                      onCheckedChange={(checked) => {
                        const updatedItem = { 
                          ...currentItem, 
                          informationSecurityManagementSystem: {
                            ...currentItem.informationSecurityManagementSystem || {},
                            iso27001Compliant: checked
                          }
                        };
                        updateMatrixItem(currentInfraIndex, updatedItem);
                      }}
                    />
                    <Label htmlFor="isms-iso27001">ISO 27001 Compliant</Label>
                  </div>
                </div>
                
                {/* ISMS Processes Simplified Section */}
                <div className="rounded-md border p-4 mb-6">
                  <h4 className="font-medium mb-3 border-b pb-2">ISMS Processes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Group 1: Documentation and Policy */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-security-policy" 
                        checked={currentItem.isms?.processes?.includes("Information Security Policy") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Information Security Policy"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Information Security Policy");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-security-policy">Define and document information security policy</Label>
                    </div>
                    
                    {/* Group 2: Risk Assessment */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-risk-assessment" 
                        checked={currentItem.isms?.processes?.includes("Risk Assessment") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Risk Assessment"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Risk Assessment");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-risk-assessment">Conduct regular risk assessments (HIPAA)</Label>
                    </div>
                    
                    {/* Group 3: Asset Management */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-asset-inventory" 
                        checked={currentItem.isms?.processes?.includes("Asset Inventory") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Asset Inventory"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Asset Inventory");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-asset-inventory">Perform asset inventory and classification</Label>
                    </div>
                    
                    {/* Group 4: Access Control */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-access-control" 
                        checked={currentItem.isms?.processes?.includes("Access Control") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Access Control"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Access Control");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-access-control">Establish access control rules</Label>
                    </div>
                    
                    {/* Group 5: IAM */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-iam" 
                        checked={currentItem.isms?.processes?.includes("Identity Management") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Identity Management"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Identity Management");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-iam">Configure identity and authentication systems</Label>
                    </div>
                    
                    {/* Group 6: Encryption */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-encryption" 
                        checked={currentItem.isms?.processes?.includes("Data Encryption") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Data Encryption"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Data Encryption");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-encryption">Apply encryption for data (PHI protection)</Label>
                    </div>
                    
                    {/* Group 7: Secure Configuration */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-secure-baseline" 
                        checked={currentItem.isms?.processes?.includes("Secure Baseline") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Secure Baseline"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Secure Baseline");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-secure-baseline">Implement secure baseline configurations</Label>
                    </div>
                    
                    {/* Group 8: Vulnerability Management */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-vulnerability-mgmt" 
                        checked={currentItem.isms?.processes?.includes("Vulnerability Management") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Vulnerability Management"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Vulnerability Management");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-vulnerability-mgmt">Monitor and manage system vulnerabilities</Label>
                    </div>
                    
                    {/* Group 9: Patch Management */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-patch-mgmt" 
                        checked={currentItem.isms?.processes?.includes("Patch Management") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Patch Management"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Patch Management");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-patch-mgmt">Develop patch management process</Label>
                    </div>
                    
                    {/* Group 10: Endpoint Protection */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-endpoint-protection" 
                        checked={currentItem.isms?.processes?.includes("Endpoint Protection") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Endpoint Protection"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Endpoint Protection");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-endpoint-protection">Install anti-malware/endpoint protection</Label>
                    </div>
                    
                    {/* Group 11: Network Security */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-network-segmentation" 
                        checked={currentItem.isms?.processes?.includes("Network Segmentation") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Network Segmentation"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Network Segmentation");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-network-segmentation">Segment network and restrict lateral movement</Label>
                    </div>
                    
                    {/* Group 12: Firewall/IDS */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-firewall-ids" 
                        checked={currentItem.isms?.processes?.includes("Firewall and IDS") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Firewall and IDS"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Firewall and IDS");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-firewall-ids">Implement firewall and intrusion detection</Label>
                    </div>
                    
                    {/* Group 13: Log Monitoring */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-log-monitoring" 
                        checked={currentItem.isms?.processes?.includes("Log Monitoring") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Log Monitoring"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Log Monitoring");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-log-monitoring">Monitor logs and system activity</Label>
                    </div>
                    
                    {/* Group 14: Backup & Recovery */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-backup-recovery" 
                        checked={currentItem.isms?.processes?.includes("Data Backup") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Data Backup"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Data Backup");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-backup-recovery">Conduct regular backups and verify recovery</Label>
                    </div>
                    
                    {/* Group 15: Incident Response */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-incident-response" 
                        checked={currentItem.isms?.processes?.includes("Incident Response") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Incident Response"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Incident Response");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-incident-response">Document incident response procedures</Label>
                    </div>
                    
                    {/* Group 16: Physical Security */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-physical-security" 
                        checked={currentItem.isms?.processes?.includes("Physical Security") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Physical Security"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Physical Security");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-physical-security">Secure physical access to assets (HIPAA)</Label>
                    </div>
                    
                    {/* Group 17: App Security Testing */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-app-security" 
                        checked={currentItem.isms?.processes?.includes("Application Security") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Application Security"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Application Security");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-app-security">Conduct security testing on applications</Label>
                    </div>
                    
                    {/* Group 18: Vendor Management */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-vendor-mgmt" 
                        checked={currentItem.isms?.processes?.includes("Vendor Management") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Vendor Management"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Vendor Management");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-vendor-mgmt">Evaluate third-party service providers</Label>
                    </div>
                    
                    {/* Group 19: Security Awareness */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-training-awareness" 
                        checked={currentItem.isms?.processes?.includes("Security Awareness") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Security Awareness"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Security Awareness");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-training-awareness">Train employees on security awareness</Label>
                    </div>
                    
                    {/* Group 20: Compliance Management */}
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        id="process-compliance-mgmt" 
                        checked={currentItem.isms?.processes?.includes("Compliance Management") || false}
                        onCheckedChange={(checked) => {
                          const updatedProcesses = checked 
                            ? [...(currentItem.isms?.processes || []), "Compliance Management"]
                            : (currentItem.isms?.processes || []).filter(p => p !== "Compliance Management");
                          
                          const updatedItem = { 
                            ...currentItem, 
                            isms: {
                              ...currentItem.isms || {},
                              processes: updatedProcesses
                            }
                          };
                          updateMatrixItem(currentInfraIndex, updatedItem);
                        }}
                      />
                      <Label htmlFor="process-compliance-mgmt">Align security controls with regulations</Label>
                    </div>
                  </div>
                </div>
                
                {/* Implementation Level */}
                <div className="rounded-md border p-4 mb-6">
                  <h4 className="font-medium mb-3 border-b pb-2">Implementation Level</h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {[0, 1, 2, 3, 4, 5].map((level) => (
                      <div 
                        key={level}
                        className={`rounded-md border p-2 cursor-pointer hover:border-primary hover:bg-primary/5 ${
                          currentItem.informationSecurityManagementSystem?.implementationLevel === level ? 'border-primary bg-primary/10' : ''
                        }`}
                        onClick={() => {
                          const updatedItem = { 
                            ...currentItem, 
                            informationSecurityManagementSystem: {
                              ...currentItem.informationSecurityManagementSystem || {},
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
                            {level === 2 && 'Defined'}
                            {level === 3 && 'Managed'}
                            {level === 4 && 'Measured'}
                            {level === 5 && 'Optimized'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Notes */}
                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-3 border-b pb-2">Notes</h4>
                  <textarea 
                    className="w-full rounded-md border p-2 min-h-[100px]"
                    value={currentItem.informationSecurityManagementSystem?.notes || ''}
                    onChange={(e) => {
                      const updatedItem = { 
                        ...currentItem, 
                        informationSecurityManagementSystem: {
                          ...currentItem.informationSecurityManagementSystem || {},
                          notes: e.target.value
                        }
                      };
                      updateMatrixItem(currentInfraIndex, updatedItem);
                    }}
                    placeholder="Add notes about ISMS implementation..."
                  ></textarea>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Add remaining 9 tabs for the other SOS²A parameters following the same pattern */}
          {/* ... */}
          
        </Tabs>
        
        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              onClick={() => setShowScorecard(!showScorecard)}
            >
              {showScorecard ? "Hide Report" : "Generate Report"}
            </Button>
            <Button onClick={() => onSubmit(matrixData)}>Save and Continue</Button>
          </div>
        </div>
        
        {/* SCORECARD Visualizations */}
        {showScorecard && <ScoreCardVisualizations data={matrixData} />}
      </CardContent>
    </Card>
  );
}