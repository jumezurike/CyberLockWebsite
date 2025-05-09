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
                <div className="rounded-md border p-4">
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">The 4Ps of ISMS Implementation</h4>
                    
                    <Accordion type="single" collapsible className="w-full">
                      {/* People */}
                      <AccordionItem value="people">
                        <AccordionTrigger className="font-medium">People</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Checkbox 
                                id="isms-people-roles" 
                                checked={currentItem.ismsImplementation?.people?.rolesResponsibilitiesDefined || false}
                                onCheckedChange={(checked) => {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    ismsImplementation: {
                                      ...currentItem.ismsImplementation || {},
                                      people: {
                                        ...(currentItem.ismsImplementation?.people || {}),
                                        rolesResponsibilitiesDefined: !!checked
                                      }
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }}
                              />
                              <Label htmlFor="isms-people-roles">Roles & Responsibilities Defined</Label>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Checkbox 
                                id="isms-people-awareness" 
                                checked={currentItem.ismsImplementation?.people?.securityAwarenessDone || false}
                                onCheckedChange={(checked) => {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    ismsImplementation: {
                                      ...currentItem.ismsImplementation || {},
                                      people: {
                                        ...(currentItem.ismsImplementation?.people || {}),
                                        securityAwarenessDone: !!checked
                                      }
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }}
                              />
                              <Label htmlFor="isms-people-awareness">Security Awareness Training</Label>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Checkbox 
                                id="isms-people-competence" 
                                checked={currentItem.ismsImplementation?.people?.competencyAssessed || false}
                                onCheckedChange={(checked) => {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    ismsImplementation: {
                                      ...currentItem.ismsImplementation || {},
                                      people: {
                                        ...(currentItem.ismsImplementation?.people || {}),
                                        competencyAssessed: !!checked
                                      }
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }}
                              />
                              <Label htmlFor="isms-people-competence">Competency Assessment</Label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      {/* Processes */}
                      <AccordionItem value="processes">
                        <AccordionTrigger className="font-medium">Processes</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Checkbox 
                                id="isms-process-policy" 
                                checked={currentItem.ismsImplementation?.processes?.informationSecurityPolicy || false}
                                onCheckedChange={(checked) => {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    ismsImplementation: {
                                      ...currentItem.ismsImplementation || {},
                                      processes: {
                                        ...(currentItem.ismsImplementation?.processes || {}),
                                        informationSecurityPolicy: !!checked
                                      }
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }}
                              />
                              <Label htmlFor="isms-process-policy">Information Security Policy</Label>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Checkbox 
                                id="isms-process-risk" 
                                checked={currentItem.ismsImplementation?.processes?.riskAssessment || false}
                                onCheckedChange={(checked) => {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    ismsImplementation: {
                                      ...currentItem.ismsImplementation || {},
                                      processes: {
                                        ...(currentItem.ismsImplementation?.processes || {}),
                                        riskAssessment: !!checked
                                      }
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }}
                              />
                              <Label htmlFor="isms-process-risk">Risk Assessment & Treatment</Label>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Checkbox 
                                id="isms-process-incident" 
                                checked={currentItem.ismsImplementation?.processes?.incidentManagement || false}
                                onCheckedChange={(checked) => {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    ismsImplementation: {
                                      ...currentItem.ismsImplementation || {},
                                      processes: {
                                        ...(currentItem.ismsImplementation?.processes || {}),
                                        incidentManagement: !!checked
                                      }
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }}
                              />
                              <Label htmlFor="isms-process-incident">Incident Management</Label>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Checkbox 
                                id="isms-process-continuity" 
                                checked={currentItem.ismsImplementation?.processes?.businessContinuity || false}
                                onCheckedChange={(checked) => {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    ismsImplementation: {
                                      ...currentItem.ismsImplementation || {},
                                      processes: {
                                        ...(currentItem.ismsImplementation?.processes || {}),
                                        businessContinuity: !!checked
                                      }
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }}
                              />
                              <Label htmlFor="isms-process-continuity">Business Continuity</Label>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Checkbox 
                                id="isms-process-compliance" 
                                checked={currentItem.ismsImplementation?.processes?.complianceManagement || false}
                                onCheckedChange={(checked) => {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    ismsImplementation: {
                                      ...currentItem.ismsImplementation || {},
                                      processes: {
                                        ...(currentItem.ismsImplementation?.processes || {}),
                                        complianceManagement: !!checked
                                      }
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }}
                              />
                              <Label htmlFor="isms-process-compliance">Compliance Management</Label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      {/* Products */}
                      <AccordionItem value="products">
                        <AccordionTrigger className="font-medium">Products</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Checkbox 
                                id="isms-product-asset" 
                                checked={currentItem.ismsImplementation?.products?.assetManagement || false}
                                onCheckedChange={(checked) => {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    ismsImplementation: {
                                      ...currentItem.ismsImplementation || {},
                                      products: {
                                        ...(currentItem.ismsImplementation?.products || {}),
                                        assetManagement: !!checked
                                      }
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }}
                              />
                              <Label htmlFor="isms-product-asset">Asset Management</Label>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Checkbox 
                                id="isms-product-access" 
                                checked={currentItem.ismsImplementation?.products?.accessControl || false}
                                onCheckedChange={(checked) => {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    ismsImplementation: {
                                      ...currentItem.ismsImplementation || {},
                                      products: {
                                        ...(currentItem.ismsImplementation?.products || {}),
                                        accessControl: !!checked
                                      }
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }}
                              />
                              <Label htmlFor="isms-product-access">Access Control Systems</Label>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Checkbox 
                                id="isms-product-crypto" 
                                checked={currentItem.ismsImplementation?.products?.cryptography || false}
                                onCheckedChange={(checked) => {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    ismsImplementation: {
                                      ...currentItem.ismsImplementation || {},
                                      products: {
                                        ...(currentItem.ismsImplementation?.products || {}),
                                        cryptography: !!checked
                                      }
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }}
                              />
                              <Label htmlFor="isms-product-crypto">Cryptography</Label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      {/* Partners */}
                      <AccordionItem value="partners">
                        <AccordionTrigger className="font-medium">Partners</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Checkbox 
                                id="isms-partners-supplier" 
                                checked={currentItem.ismsImplementation?.partners?.supplierRelationships || false}
                                onCheckedChange={(checked) => {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    ismsImplementation: {
                                      ...currentItem.ismsImplementation || {},
                                      partners: {
                                        ...(currentItem.ismsImplementation?.partners || {}),
                                        supplierRelationships: !!checked
                                      }
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }}
                              />
                              <Label htmlFor="isms-partners-supplier">Supplier Relationships</Label>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Checkbox 
                                id="isms-partners-service" 
                                checked={currentItem.ismsImplementation?.partners?.serviceAgreements || false}
                                onCheckedChange={(checked) => {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    ismsImplementation: {
                                      ...currentItem.ismsImplementation || {},
                                      partners: {
                                        ...(currentItem.ismsImplementation?.partners || {}),
                                        serviceAgreements: !!checked
                                      }
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }}
                              />
                              <Label htmlFor="isms-partners-service">Service Level Agreements</Label>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Checkbox 
                                id="isms-partners-monitoring" 
                                checked={currentItem.ismsImplementation?.partners?.partnerMonitoring || false}
                                onCheckedChange={(checked) => {
                                  const updatedItem = { 
                                    ...currentItem, 
                                    ismsImplementation: {
                                      ...currentItem.ismsImplementation || {},
                                      partners: {
                                        ...(currentItem.ismsImplementation?.partners || {}),
                                        partnerMonitoring: !!checked
                                      }
                                    }
                                  };
                                  updateMatrixItem(currentInfraIndex, updatedItem);
                                }}
                              />
                              <Label htmlFor="isms-partners-monitoring">Partner Monitoring & Auditing</Label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">ISMS Implementation Level</h4>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {[0, 1, 2, 3, 4, 5].map((level) => (
                        <div 
                          key={level}
                          className={`rounded-md border p-2 cursor-pointer hover:border-primary hover:bg-primary/5 ${
                            currentItem.ismsImplementation?.implementationLevel === level ? 'border-primary bg-primary/10' : ''
                          }`}
                          onClick={() => {
                            const updatedItem = { 
                              ...currentItem, 
                              ismsImplementation: {
                                ...currentItem.ismsImplementation || {},
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
                              {level === 2 && 'Managed'}
                              {level === 3 && 'Defined'}
                              {level === 4 && 'Measured'}
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
                      {currentItem.ismsImplementation?.gaps?.map((gap, index) => (
                        <Badge key={index} variant="secondary" className="gap-2">
                          {gap}
                          <button 
                            className="text-xs hover:text-primary"
                            onClick={() => {
                              const updatedItem = { 
                                ...currentItem, 
                                ismsImplementation: {
                                  ...currentItem.ismsImplementation || {},
                                  gaps: currentItem.ismsImplementation?.gaps?.filter((_, i) => i !== index) || []
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
                                ismsImplementation: {
                                  ...currentItem.ismsImplementation || {
                                    gaps: []
                                  },
                                  gaps: [...(currentItem.ismsImplementation?.gaps || []), inputValue]
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
                              ismsImplementation: {
                                ...currentItem.ismsImplementation || {
                                  gaps: []
                                },
                                gaps: [...(currentItem.ismsImplementation?.gaps || []), inputValue]
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