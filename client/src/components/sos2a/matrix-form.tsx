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
                
                <div className="space-y-6">
                  {/* ISMS Policies Section */}
                  <div>
                    <h4 className="font-medium mb-3 border-b pb-2">ISMS Policies</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-policy-acceptable-use" 
                          checked={currentItem.isms?.policies?.includes("Acceptable Use Policy") || false}
                          onCheckedChange={(checked) => {
                            const updatedPolicies = checked 
                              ? [...(currentItem.isms?.policies || []), "Acceptable Use Policy"]
                              : (currentItem.isms?.policies || []).filter(p => p !== "Acceptable Use Policy");
                            
                            const updatedItem = { 
                              ...currentItem, 
                              isms: {
                                ...currentItem.isms || {},
                                policies: updatedPolicies
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="isms-policy-acceptable-use">Acceptable Use Policy</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-policy-info-security" 
                          checked={currentItem.isms?.policies?.includes("Information Security Policy") || false}
                          onCheckedChange={(checked) => {
                            const updatedPolicies = checked 
                              ? [...(currentItem.isms?.policies || []), "Information Security Policy"]
                              : (currentItem.isms?.policies || []).filter(p => p !== "Information Security Policy");
                            
                            const updatedItem = { 
                              ...currentItem, 
                              isms: {
                                ...currentItem.isms || {},
                                policies: updatedPolicies
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="isms-policy-info-security">Information Security Policy</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-policy-system-security" 
                          checked={currentItem.isms?.policies?.includes("System Security Plan (SSP)") || false}
                          onCheckedChange={(checked) => {
                            const updatedPolicies = checked 
                              ? [...(currentItem.isms?.policies || []), "System Security Plan (SSP)"]
                              : (currentItem.isms?.policies || []).filter(p => p !== "System Security Plan (SSP)");
                            
                            const updatedItem = { 
                              ...currentItem, 
                              isms: {
                                ...currentItem.isms || {},
                                policies: updatedPolicies
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="isms-policy-system-security">System Security Plan (SSP)</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-policy-password" 
                          checked={currentItem.isms?.policies?.includes("Password Policy") || false}
                          onCheckedChange={(checked) => {
                            const updatedPolicies = checked 
                              ? [...(currentItem.isms?.policies || []), "Password Policy"]
                              : (currentItem.isms?.policies || []).filter(p => p !== "Password Policy");
                            
                            const updatedItem = { 
                              ...currentItem, 
                              isms: {
                                ...currentItem.isms || {},
                                policies: updatedPolicies
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="isms-policy-password">Password Policy</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-policy-data-classification" 
                          checked={currentItem.isms?.policies?.includes("Data Classification Policy") || false}
                          onCheckedChange={(checked) => {
                            const updatedPolicies = checked 
                              ? [...(currentItem.isms?.policies || []), "Data Classification Policy"]
                              : (currentItem.isms?.policies || []).filter(p => p !== "Data Classification Policy");
                            
                            const updatedItem = { 
                              ...currentItem, 
                              isms: {
                                ...currentItem.isms || {},
                                policies: updatedPolicies
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="isms-policy-data-classification">Data Classification Policy</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-policy-remote-work" 
                          checked={currentItem.isms?.policies?.includes("Remote Work Policy") || false}
                          onCheckedChange={(checked) => {
                            const updatedPolicies = checked 
                              ? [...(currentItem.isms?.policies || []), "Remote Work Policy"]
                              : (currentItem.isms?.policies || []).filter(p => p !== "Remote Work Policy");
                            
                            const updatedItem = { 
                              ...currentItem, 
                              isms: {
                                ...currentItem.isms || {},
                                policies: updatedPolicies
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="isms-policy-remote-work">Remote Work Policy</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-policy-byod" 
                          checked={currentItem.isms?.policies?.includes("BYOD Policy") || false}
                          onCheckedChange={(checked) => {
                            const updatedPolicies = checked 
                              ? [...(currentItem.isms?.policies || []), "BYOD Policy"]
                              : (currentItem.isms?.policies || []).filter(p => p !== "BYOD Policy");
                            
                            const updatedItem = { 
                              ...currentItem, 
                              isms: {
                                ...currentItem.isms || {},
                                policies: updatedPolicies
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="isms-policy-byod">BYOD Policy</Label>
                      </div>
                    </div>
                  </div>
                  
                  {/* ISMS Procedures Section */}
                  <div>
                    <h4 className="font-medium mb-3 border-b pb-2">ISMS Procedures</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-procedure-incident" 
                          checked={currentItem.isms?.procedures?.includes("Incident Response Procedures") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcedures = checked 
                              ? [...(currentItem.isms?.procedures || []), "Incident Response Procedures"]
                              : (currentItem.isms?.procedures || []).filter(p => p !== "Incident Response Procedures");
                            
                            const updatedItem = { 
                              ...currentItem, 
                              isms: {
                                ...currentItem.isms || {},
                                procedures: updatedProcedures
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="isms-procedure-incident">Incident Response Procedures</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-procedure-change" 
                          checked={currentItem.isms?.procedures?.includes("Change Management Procedures") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcedures = checked 
                              ? [...(currentItem.isms?.procedures || []), "Change Management Procedures"]
                              : (currentItem.isms?.procedures || []).filter(p => p !== "Change Management Procedures");
                            
                            const updatedItem = { 
                              ...currentItem, 
                              isms: {
                                ...currentItem.isms || {},
                                procedures: updatedProcedures
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="isms-procedure-change">Change Management Procedures</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-procedure-access" 
                          checked={currentItem.isms?.procedures?.includes("Access Control Procedures") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcedures = checked 
                              ? [...(currentItem.isms?.procedures || []), "Access Control Procedures"]
                              : (currentItem.isms?.procedures || []).filter(p => p !== "Access Control Procedures");
                            
                            const updatedItem = { 
                              ...currentItem, 
                              isms: {
                                ...currentItem.isms || {},
                                procedures: updatedProcedures
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="isms-procedure-access">Access Control Procedures</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-procedure-backup" 
                          checked={currentItem.isms?.procedures?.includes("System Backup Procedures") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcedures = checked 
                              ? [...(currentItem.isms?.procedures || []), "System Backup Procedures"]
                              : (currentItem.isms?.procedures || []).filter(p => p !== "System Backup Procedures");
                            
                            const updatedItem = { 
                              ...currentItem, 
                              isms: {
                                ...currentItem.isms || {},
                                procedures: updatedProcedures
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="isms-procedure-backup">System Backup Procedures</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-procedure-vulnerability" 
                          checked={currentItem.isms?.procedures?.includes("Vulnerability Management Procedures") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcedures = checked 
                              ? [...(currentItem.isms?.procedures || []), "Vulnerability Management Procedures"]
                              : (currentItem.isms?.procedures || []).filter(p => p !== "Vulnerability Management Procedures");
                            
                            const updatedItem = { 
                              ...currentItem, 
                              isms: {
                                ...currentItem.isms || {},
                                procedures: updatedProcedures
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="isms-procedure-vulnerability">Vulnerability Management Procedures</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-procedure-breach" 
                          checked={currentItem.isms?.procedures?.includes("Data Breach Notification Procedures") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcedures = checked 
                              ? [...(currentItem.isms?.procedures || []), "Data Breach Notification Procedures"]
                              : (currentItem.isms?.procedures || []).filter(p => p !== "Data Breach Notification Procedures");
                            
                            const updatedItem = { 
                              ...currentItem, 
                              isms: {
                                ...currentItem.isms || {},
                                procedures: updatedProcedures
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="isms-procedure-breach">Data Breach Notification Procedures</Label>
                      </div>
                    </div>
                  </div>
                  
                  {/* ISMS Processes Section */}
                  <div>
                    <h4 className="font-medium mb-3 border-b pb-2">ISMS Processes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-security-policy" 
                          checked={currentItem.isms?.processes?.includes("Define and document an organization-wide information security policy") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Define and document an organization-wide information security policy"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Define and document an organization-wide information security policy");
                            
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
                        <Label htmlFor="isms-process-security-policy">Define and document an organization-wide information security policy</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-risk-assessments" 
                          checked={currentItem.isms?.processes?.includes("Conduct regular risk assessments") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Conduct regular risk assessments"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Conduct regular risk assessments");
                            
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
                        <Label htmlFor="isms-process-risk-assessments">Conduct regular risk assessments (HIPAA mandated)</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-asset-inventory" 
                          checked={currentItem.isms?.processes?.includes("Perform asset inventory and classification") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Perform asset inventory and classification"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Perform asset inventory and classification");
                            
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
                        <Label htmlFor="isms-process-asset-inventory">Perform asset inventory and classification</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-access-control" 
                          checked={currentItem.isms?.processes?.includes("Establish access control rules") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Establish access control rules"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Establish access control rules");
                            
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
                        <Label htmlFor="isms-process-access-control">Establish access control rules (least privilege)</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-iam" 
                          checked={currentItem.isms?.processes?.includes("Configure and manage identity and authentication systems") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Configure and manage identity and authentication systems"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Configure and manage identity and authentication systems");
                            
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
                        <Label htmlFor="isms-process-iam">Configure and manage IAM systems</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-encryption" 
                          checked={currentItem.isms?.processes?.includes("Apply encryption for data at rest and in transit") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Apply encryption for data at rest and in transit"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Apply encryption for data at rest and in transit");
                            
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
                        <Label htmlFor="isms-process-encryption">Apply encryption for data (PHI protection)</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-configurations" 
                          checked={currentItem.isms?.processes?.includes("Implement secure baseline configurations") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Implement secure baseline configurations"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Implement secure baseline configurations");
                            
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
                        <Label htmlFor="isms-process-configurations">Implement secure baseline configurations</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-vulnerability" 
                          checked={currentItem.isms?.processes?.includes("Monitor and manage system vulnerabilities") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Monitor and manage system vulnerabilities"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Monitor and manage system vulnerabilities");
                            
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
                        <Label htmlFor="isms-process-vulnerability">Monitor and manage system vulnerabilities</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-patch" 
                          checked={currentItem.isms?.processes?.includes("Develop and execute a patch management process") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Develop and execute a patch management process"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Develop and execute a patch management process");
                            
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
                        <Label htmlFor="isms-process-patch">Develop patch management process</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-endpoint" 
                          checked={currentItem.isms?.processes?.includes("Install endpoint protection") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Install endpoint protection"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Install endpoint protection");
                            
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
                        <Label htmlFor="isms-process-endpoint">Install anti-malware and endpoint protection</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-network" 
                          checked={currentItem.isms?.processes?.includes("Segment the network") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Segment the network"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Segment the network");
                            
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
                        <Label htmlFor="isms-process-network">Segment the network and restrict lateral movement</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-firewall" 
                          checked={currentItem.isms?.processes?.includes("Implement firewall and intrusion detection") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Implement firewall and intrusion detection"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Implement firewall and intrusion detection");
                            
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
                        <Label htmlFor="isms-process-firewall">Implement firewall and intrusion detection</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-logs" 
                          checked={currentItem.isms?.processes?.includes("Monitor logs and system activity") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Monitor logs and system activity"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Monitor logs and system activity");
                            
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
                        <Label htmlFor="isms-process-logs">Monitor logs and system activity with SIEM</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-backups" 
                          checked={currentItem.isms?.processes?.includes("Conduct regular backups") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Conduct regular backups"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Conduct regular backups");
                            
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
                        <Label htmlFor="isms-process-backups">Conduct regular backups and verify recovery</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-incidents" 
                          checked={currentItem.isms?.processes?.includes("Document incident response procedures") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Document incident response procedures"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Document incident response procedures");
                            
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
                        <Label htmlFor="isms-process-incidents">Document incident response procedures</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-physical" 
                          checked={currentItem.isms?.processes?.includes("Secure physical access to assets") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Secure physical access to assets"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Secure physical access to assets");
                            
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
                        <Label htmlFor="isms-process-physical">Secure physical access to assets (HIPAA)</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-testing" 
                          checked={currentItem.isms?.processes?.includes("Conduct security testing on applications") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Conduct security testing on applications"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Conduct security testing on applications");
                            
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
                        <Label htmlFor="isms-process-testing">Conduct security testing on applications</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-vendors" 
                          checked={currentItem.isms?.processes?.includes("Evaluate third-party service providers") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Evaluate third-party service providers"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Evaluate third-party service providers");
                            
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
                        <Label htmlFor="isms-process-vendors">Evaluate third-party service providers</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-contracts" 
                          checked={currentItem.isms?.processes?.includes("Formalize contracts with third parties") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Formalize contracts with third parties"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Formalize contracts with third parties");
                            
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
                        <Label htmlFor="isms-process-contracts">Formalize contracts and BAAs (HIPAA)</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-training" 
                          checked={currentItem.isms?.processes?.includes("Train employees on security awareness") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Train employees on security awareness"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Train employees on security awareness");
                            
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
                        <Label htmlFor="isms-process-training">Train employees on security awareness (HIPAA)</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-phishing" 
                          checked={currentItem.isms?.processes?.includes("Simulate phishing attacks") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Simulate phishing attacks"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Simulate phishing attacks");
                            
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
                        <Label htmlFor="isms-process-phishing">Simulate phishing attacks and evaluate readiness</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-data-retention" 
                          checked={currentItem.isms?.processes?.includes("Define data retention and disposal rules") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Define data retention and disposal rules"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Define data retention and disposal rules");
                            
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
                        <Label htmlFor="isms-process-data-retention">Define data retention and disposal rules</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-change-management" 
                          checked={currentItem.isms?.processes?.includes("Document change management processes") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Document change management processes"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Document change management processes");
                            
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
                        <Label htmlFor="isms-process-change-management">Document change management processes</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-compliance" 
                          checked={currentItem.isms?.processes?.includes("Align security controls with regulations") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Align security controls with regulations"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Align security controls with regulations");
                            
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
                        <Label htmlFor="isms-process-compliance">Align security controls with regulations (HIPAA)</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-cloud" 
                          checked={currentItem.isms?.processes?.includes("Monitor cloud services for misconfigurations") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Monitor cloud services for misconfigurations"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Monitor cloud services for misconfigurations");
                            
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
                        <Label htmlFor="isms-process-cloud">Monitor cloud services for misconfigurations</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-privacy" 
                          checked={currentItem.isms?.processes?.includes("Establish privacy management process") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Establish privacy management process"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Establish privacy management process");
                            
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
                        <Label htmlFor="isms-process-privacy">Establish privacy management process (HIPAA/GDPR)</Label>
                      </div>
                    </div>
                  </div>
                  
                  {/* ISMS Plans Section */}
                  <div>
                    <h4 className="font-medium mb-3 border-b pb-2">ISMS Plans</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-plan-disaster" 
                          checked={currentItem.isms?.plans?.includes("Disaster Recovery Plan") || false}
                          onCheckedChange={(checked) => {
                            const updatedPlans = checked 
                              ? [...(currentItem.isms?.plans || []), "Disaster Recovery Plan"]
                              : (currentItem.isms?.plans || []).filter(p => p !== "Disaster Recovery Plan");
                            
                            const updatedItem = { 
                              ...currentItem, 
                              isms: {
                                ...currentItem.isms || {},
                                plans: updatedPlans
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="isms-plan-disaster">Disaster Recovery Plan</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-plan-continuity" 
                          checked={currentItem.isms?.plans?.includes("Business Continuity Plan") || false}
                          onCheckedChange={(checked) => {
                            const updatedPlans = checked 
                              ? [...(currentItem.isms?.plans || []), "Business Continuity Plan"]
                              : (currentItem.isms?.plans || []).filter(p => p !== "Business Continuity Plan");
                            
                            const updatedItem = { 
                              ...currentItem, 
                              isms: {
                                ...currentItem.isms || {},
                                plans: updatedPlans
                              }
                            };
                            updateMatrixItem(currentInfraIndex, updatedItem);
                          }}
                        />
                        <Label htmlFor="isms-plan-continuity">Business Continuity Plan</Label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Implementation Level */}
                  <div>
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
                  
                  {/* Implementation Gaps */}
                  <div>
                    <h4 className="font-medium mb-3 border-b pb-2">Implementation Gaps</h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {currentItem.informationSecurityManagementSystem?.gaps?.map((gap, index) => (
                        <Badge key={index} variant="secondary" className="gap-2">
                          {gap}
                          <button 
                            className="text-xs hover:text-primary"
                            onClick={() => {
                              const updatedItem = { 
                                ...currentItem, 
                                informationSecurityManagementSystem: {
                                  ...currentItem.informationSecurityManagementSystem || {},
                                  gaps: currentItem.informationSecurityManagementSystem?.gaps?.filter((_, i) => i !== index) || []
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
                        id="isms-gap" 
                        placeholder="Add a gap in ISMS implementation..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const inputValue = (e.target as HTMLInputElement).value;
                            if (inputValue.trim()) {
                              const updatedItem = { 
                                ...currentItem, 
                                informationSecurityManagementSystem: {
                                  ...currentItem.informationSecurityManagementSystem || {
                                    gaps: []
                                  },
                                  gaps: [...(currentItem.informationSecurityManagementSystem?.gaps || []), inputValue]
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
                          const input = document.getElementById('isms-gap') as HTMLInputElement;
                          const inputValue = input.value;
                          if (inputValue.trim()) {
                            const updatedItem = { 
                              ...currentItem, 
                              informationSecurityManagementSystem: {
                                ...currentItem.informationSecurityManagementSystem || {
                                  gaps: []
                                },
                                gaps: [...(currentItem.informationSecurityManagementSystem?.gaps || []), inputValue]
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
                  
                  {/* Notes */}
                  <div>
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