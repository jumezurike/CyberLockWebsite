import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PdfExport } from '@/components/rasbita/pdf-export';
import { Shield, AlertCircle, AlertTriangle, AlertOctagon, CheckCircle, Lock, FileText } from 'lucide-react';
import ThreatModeling from '@/components/rasbita/threat-modeling';

export default function ThreatModelingPage() {
  const { toast } = useToast();
  const [showThreatModel, setShowThreatModel] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // To confirm the component is actually rendering
    console.log("ThreatModelingPage mounted");
    setIsLoaded(true);
  }, []);
  
  // Handle export to PDF functionality if needed
  const handleExportPdf = () => {
    toast({
      title: "PDF Export",
      description: "Threat modeling PDF export is generated.",
      duration: 5000,
    });
  };

  if (!isLoaded) {
    return <div className="container mx-auto p-8 text-center">Loading threat modeling...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-purple-700 mb-2">RASBITA™ Threat Modeling</h1>
        <p className="text-gray-600">Standalone Security Architecture Threat Assessment</p>
      </div>
      
      {!showThreatModel ? (
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
          <CardHeader>
            <CardTitle className="text-xl text-chart-4">Architecture Security Analysis</CardTitle>
            <CardDescription>
              Comprehensive threat modeling for healthcare applications and infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Why Threat Modeling Matters
              </h3>
              <p className="text-blue-700 text-sm">
                Threat modeling is a crucial process that identifies potential security threats to your architecture 
                and enables you to implement appropriate countermeasures. By systematically analyzing your system's 
                components, data flows, and trust boundaries, you can proactively address vulnerabilities before they're exploited.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="border border-gray-200 rounded-md p-4 bg-white">
                <h3 className="font-semibold text-purple-700 mb-2">Key Benefits</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 bg-green-500 rounded-full min-w-[8px] min-h-[8px]"></div>
                    <span>Identify architectural vulnerabilities before they're exploited</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 bg-green-500 rounded-full min-w-[8px] min-h-[8px]"></div>
                    <span>Understand attack vectors and potential impact</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 bg-green-500 rounded-full min-w-[8px] min-h-[8px]"></div>
                    <span>Prioritize security controls based on risk level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 bg-green-500 rounded-full min-w-[8px] min-h-[8px]"></div>
                    <span>Build security into your architecture from the start</span>
                  </li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4 bg-white">
                <h3 className="font-semibold text-purple-700 mb-2">When To Use This Tool</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 bg-red-500 rounded-full min-w-[8px] min-h-[8px]"></div>
                    <span>During application design and development phases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 bg-red-500 rounded-full min-w-[8px] min-h-[8px]"></div>
                    <span>Before implementing new features or integrations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 bg-red-500 rounded-full min-w-[8px] min-h-[8px]"></div>
                    <span>After security incidents to improve defensive controls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 bg-red-500 rounded-full min-w-[8px] min-h-[8px]"></div>
                    <span>As part of regular security assessments</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700 mb-2">Threat Modeling Framework</h3>
              <p className="text-gray-600 text-sm mb-4">
                This assessment follows the industry-standard STRIDE methodology for threat modeling, analyzing 
                your system across six key threat categories: Spoofing, Tampering, Repudiation, Information disclosure, 
                Denial of service, and Elevation of privilege.
              </p>
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                <div className="bg-red-50 p-2 rounded border border-red-100 text-center">
                  <span className="block font-semibold text-red-700">S</span>
                  <span className="text-red-600">Spoofing</span>
                </div>
                <div className="bg-orange-50 p-2 rounded border border-orange-100 text-center">
                  <span className="block font-semibold text-orange-700">T</span>
                  <span className="text-orange-600">Tampering</span>
                </div>
                <div className="bg-yellow-50 p-2 rounded border border-yellow-100 text-center">
                  <span className="block font-semibold text-yellow-700">R</span>
                  <span className="text-yellow-600">Repudiation</span>
                </div>
                <div className="bg-green-50 p-2 rounded border border-green-100 text-center">
                  <span className="block font-semibold text-green-700">I</span>
                  <span className="text-green-600">Information</span>
                </div>
                <div className="bg-blue-50 p-2 rounded border border-blue-100 text-center">
                  <span className="block font-semibold text-blue-700">D</span>
                  <span className="text-blue-600">Denial</span>
                </div>
                <div className="bg-purple-50 p-2 rounded border border-purple-100 text-center">
                  <span className="block font-semibold text-purple-700">E</span>
                  <span className="text-purple-600">Elevation</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => setShowThreatModel(true)}
              className="w-full bg-chart-4 hover:bg-chart-4/90"
            >
              Start RASBITA™ Threat Modeling
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-chart-4">Architectural Threat Assessment</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowThreatModel(false)} 
                className="text-sm"
              >
                Back to Introduction
              </Button>
              <Button 
                onClick={handleExportPdf} 
                className="bg-chart-4 hover:bg-chart-4/90 text-sm"
              >
                <FileText className="h-4 w-4 mr-1" />
                Export to PDF
              </Button>
            </div>
          </div>
          
          {/* The standalone threat modeling component */}
          <ThreatModeling standalone={true} />
          
          {/* Additional resources */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>
                Recommendations based on your threat model assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-md">
                  <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Integration with SOS²A
                  </h3>
                  <p className="text-purple-700 text-sm">
                    This threat model can be incorporated into your full SOS²A (Healthcare Organizational and System Security Analysis) 
                    for a comprehensive security assessment. The threat model serves as a foundation for understanding your 
                    architecture's security strengths and weaknesses.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border p-3 rounded-md bg-white">
                    <h4 className="font-medium text-gray-800 mb-1">Architectural Improvements</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      <li>Implement segregation of duties</li>
                      <li>Add defense-in-depth layers</li>
                      <li>Apply zero trust principles</li>
                      <li>Enhance API security controls</li>
                    </ul>
                  </div>
                  
                  <div className="border p-3 rounded-md bg-white">
                    <h4 className="font-medium text-gray-800 mb-1">Process Improvements</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      <li>Implement secure SDLC</li>
                      <li>Regular threat model reviews</li>
                      <li>Automated security testing</li>
                      <li>Incident response planning</li>
                    </ul>
                  </div>
                  
                  <div className="border p-3 rounded-md bg-white">
                    <h4 className="font-medium text-gray-800 mb-1">Documentation Needs</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      <li>Security architecture diagrams</li>
                      <li>Data flow documentation</li>
                      <li>Trust boundary definitions</li>
                      <li>Control implementation guides</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}