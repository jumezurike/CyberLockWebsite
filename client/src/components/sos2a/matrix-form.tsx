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
          
          {/* Main tabs for different categories */}
          <Tabs defaultValue="risks" className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="risks">Risks & Vulnerabilities</TabsTrigger>
              <TabsTrigger value="controls">Security Controls</TabsTrigger>
              <TabsTrigger value="compliance">Compliance & Standards</TabsTrigger>
              <TabsTrigger value="mitre">MITRE ATT&CK</TabsTrigger>
              <TabsTrigger value="policies">Policy Documents</TabsTrigger>
            </TabsList>
            
            {/* Risks & Vulnerabilities Tab */}
            <TabsContent value="risks">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Security Risks</h3>
                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    <ul className="space-y-2">
                      {currentItem.risks.map((risk, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Vulnerabilities</h3>
                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    <ul className="space-y-2">
                      {currentItem.vulnerabilities.map((vuln, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{vuln}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Education & Awareness</h3>
                <div className="flex items-center space-x-4">
                  <Switch 
                    id="education-awareness" 
                    checked={currentItem.educationAwareness}
                    onCheckedChange={handleEducationAwarenessChange}
                  />
                  <Label htmlFor="education-awareness">
                    {currentItem.educationAwareness 
                      ? "Education & Awareness programs are implemented" 
                      : "Education & Awareness programs are not implemented"}
                  </Label>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Relevant Questionnaires</h3>
                <div className="flex flex-wrap gap-2">
                  {currentItem.relevantQuestionnaires.map((q, index) => (
                    <Badge key={index} variant="outline">{q}</Badge>
                  ))}
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