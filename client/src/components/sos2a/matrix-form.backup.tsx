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
  ismsProcesses?: string[];
  onSubmit: (matrixData: MatrixItem[]) => void;
  onBack: () => void;
}

// Map of process IDs to their display labels
const processIdToLabelMap: Record<string, string> = {
  "info-security-policy": "Define Information Security Policy",
  "risk-assessments": "Conduct Risk Assessments",
  "asset-inventory": "Perform Asset Inventory",
  "access-control": "Establish Access Control Rules",
  "identity-management": "Configure Identity Management",
  "data-encryption": "Apply Data Encryption",
  "security-awareness": "Conduct Security Awareness Training",
  "change-management": "Implement Change Management",
  "vulnerability-scanning": "Conduct Vulnerability Scanning",
  "incident-response": "Perform Security Incident Response",
  "privileged-access": "Implement Privileged Access Management",
  "security-audits": "Conduct Regular Security Audits",
  "network-security": "Implement Network Security Controls",
  "backup-recovery": "Implement Backup and Recovery Procedures",
  "penetration-testing": "Conduct Penetration Testing",
  "data-classification": "Implement Data Classification",
  "vendor-risk": "Establish Vendor Risk Management",
  "physical-security": "Implement Physical Security Controls",
};

export default function MatrixForm({ operationModes, internetPresence, ismsProcesses = [], onSubmit, onBack }: MatrixFormProps) {
  // Generate initial matrix data based on selected operation modes and internet presence
  const initialMatrixData = generateInitialMatrixData(operationModes, internetPresence);
  
  // Convert process IDs to their display labels
  // Make sure ismsProcesses is always an array
  const safeIsmsProcesses = Array.isArray(ismsProcesses) ? ismsProcesses : [];
  const processLabels = safeIsmsProcesses.map(id => processIdToLabelMap[id] || id);
  
  console.log("Matrix Form received ISMS processes (IDs):", ismsProcesses);
  console.log("Using safe array:", safeIsmsProcesses);
  console.log("Mapped to process labels:", processLabels);
  
  // Ensure each item has isms property initialized
  initialMatrixData.forEach(item => {
    if (!item.isms) {
      item.isms = {
        processes: processLabels,
        implementation: "none",
        policies: [],
        plans: [],
        procedures: []
      };
    } else {
      // Update processes if they exist
      item.isms.processes = processLabels;
    }
    
    // Add debug log for each item
    console.log(`Matrix item ${item.id || 'unknown'} has ISMS processes:`, item.isms.processes);
  });
  
  const [matrixData, setMatrixData] = useState<MatrixItem[]>(initialMatrixData);
  const [currentInfraIndex, setCurrentInfraIndex] = useState(0);
  const [showScorecard, setShowScorecard] = useState(false);
  
  // Function to update a specific matrix item
  const updateMatrixItem = (index: number, updatedItem: MatrixItem) => {
    const newMatrixData = [...matrixData];
    // Ensure isms object is initialized
    if (!updatedItem.isms) {
      updatedItem.isms = {
        processes: [],
        implementation: "none",
        policies: [],
        plans: [],
        procedures: []
      };
    }
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
                  {/* ISMS Policies Section temporarily removed for testing */}
                  
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
                  
                  {/* ISMS Processes Section */}
                  <div>
                    <h4 className="font-medium mb-3 border-b pb-2">ISMS Processes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-1" 
                          checked={currentItem.isms?.processes?.includes("Define Information Security Policy") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Define Information Security Policy"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Define Information Security Policy");
                            
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
                        <Label htmlFor="isms-process-1">Define Information Security Policy</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-2" 
                          checked={currentItem.isms?.processes?.includes("Conduct Risk Assessments") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Conduct Risk Assessments"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Conduct Risk Assessments");
                            
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
                        <Label htmlFor="isms-process-2">Conduct Risk Assessments</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-3" 
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
                        <Label htmlFor="isms-process-3">Perform Asset Inventory</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-4" 
                          checked={currentItem.isms?.processes?.includes("Access Control Rules") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Access Control Rules"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Access Control Rules");
                            
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
                        <Label htmlFor="isms-process-4">Establish Access Control Rules</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-5" 
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
                        <Label htmlFor="isms-process-5">Configure Identity Management</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-6" 
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
                        <Label htmlFor="isms-process-6">Apply Data Encryption</Label>
                      </div>
                      
                      {/* New processes starting with #7 */}
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-7" 
                          checked={currentItem.isms?.processes?.includes("Conduct Security Awareness Training") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Conduct Security Awareness Training"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Conduct Security Awareness Training");
                            
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
                        <Label htmlFor="isms-process-7">Conduct Security Awareness Training</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-8" 
                          checked={currentItem.isms?.processes?.includes("Implement Change Management") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Implement Change Management"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Implement Change Management");
                            
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
                        <Label htmlFor="isms-process-8">Implement Change Management</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-9" 
                          checked={currentItem.isms?.processes?.includes("Conduct Vulnerability Scanning") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Conduct Vulnerability Scanning"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Conduct Vulnerability Scanning");
                            
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
                        <Label htmlFor="isms-process-9">Conduct Vulnerability Scanning</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-10" 
                          checked={currentItem.isms?.processes?.includes("Perform Security Incident Response") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Perform Security Incident Response"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Perform Security Incident Response");
                            
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
                        <Label htmlFor="isms-process-10">Perform Security Incident Response</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-11" 
                          checked={currentItem.isms?.processes?.includes("Implement Privileged Access Management") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Implement Privileged Access Management"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Implement Privileged Access Management");
                            
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
                        <Label htmlFor="isms-process-11">Implement Privileged Access Management</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-12" 
                          checked={currentItem.isms?.processes?.includes("Conduct Regular Security Audits") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Conduct Regular Security Audits"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Conduct Regular Security Audits");
                            
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
                        <Label htmlFor="isms-process-12">Conduct Regular Security Audits</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-13" 
                          checked={currentItem.isms?.processes?.includes("Implement Network Security Controls") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Implement Network Security Controls"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Implement Network Security Controls");
                            
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
                        <Label htmlFor="isms-process-13">Implement Network Security Controls</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-14" 
                          checked={currentItem.isms?.processes?.includes("Implement Backup and Recovery Procedures") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Implement Backup and Recovery Procedures"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Implement Backup and Recovery Procedures");
                            
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
                        <Label htmlFor="isms-process-14">Implement Backup and Recovery Procedures</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-15" 
                          checked={currentItem.isms?.processes?.includes("Conduct Penetration Testing") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Conduct Penetration Testing"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Conduct Penetration Testing");
                            
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
                        <Label htmlFor="isms-process-15">Conduct Penetration Testing</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-16" 
                          checked={currentItem.isms?.processes?.includes("Implement Data Classification") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Implement Data Classification"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Implement Data Classification");
                            
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
                        <Label htmlFor="isms-process-16">Implement Data Classification</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-17" 
                          checked={currentItem.isms?.processes?.includes("Establish Vendor Risk Management") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Establish Vendor Risk Management"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Establish Vendor Risk Management");
                            
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
                        <Label htmlFor="isms-process-17">Establish Vendor Risk Management</Label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="isms-process-18" 
                          checked={currentItem.isms?.processes?.includes("Implement Physical Security Controls") || false}
                          onCheckedChange={(checked) => {
                            const updatedProcesses = checked 
                              ? [...(currentItem.isms?.processes || []), "Implement Physical Security Controls"]
                              : (currentItem.isms?.processes || []).filter(p => p !== "Implement Physical Security Controls");
                            
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
                        <Label htmlFor="isms-process-18">Implement Physical Security Controls</Label>
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