import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RasbitaReport } from '@/lib/sos2a-types';
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  AlertCircle, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowRightLeft,
  Lock,
  Workflow,
  Key
} from 'lucide-react';

interface ThreatModelingProps {
  report?: RasbitaReport;
  standalone?: boolean;
}

export default function ThreatModeling({ report, standalone = false }: ThreatModelingProps) {
  // Use default data if no report provided or for standalone mode
  const useDefaultData = !report || standalone;
  const [currentStep, setCurrentStep] = useState("step1");
  
  return (
    <Card className={standalone ? "mb-6" : "mt-6"}>
      <CardHeader className="bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Threat Modeling for Architecture</CardTitle>
            <CardDescription>
              Security architecture analysis using STRIDE methodology
            </CardDescription>
          </div>
          <Badge className="bg-chart-4 hover:bg-chart-4/90">4-Step Process</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="step1" className="space-y-4" onValueChange={setCurrentStep}>
          <TabsList className="grid grid-cols-4 gap-2">
            <TabsTrigger value="step1" className={currentStep === "step1" ? "bg-chart-4 text-white" : ""}>
              Step 1: Data Flow
            </TabsTrigger>
            <TabsTrigger value="step2" className={currentStep === "step2" ? "bg-chart-4 text-white" : ""}>
              Step 2: Attack Enumeration
            </TabsTrigger>
            <TabsTrigger value="step3" className={currentStep === "step3" ? "bg-chart-4 text-white" : ""}>
              Step 3: Mitigations
            </TabsTrigger>
            <TabsTrigger value="step4" className={currentStep === "step4" ? "bg-chart-4 text-white" : ""}>
              Step 4: Validation
            </TabsTrigger>
          </TabsList>
          
          {/* STEP 1: Data Flow Diagram */}
          <TabsContent value="step1" className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5" />
                Data Flow Diagram Analysis
              </h3>
              <p className="text-blue-700 text-sm">
                The process begins with analyzing your current architecture for data flow. We'll establish how 
                data moves between different trust levels in your system, identifying components, trust boundaries,
                and data flows that require security controls.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-md border border-gray-200 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Customer Input Required</h3>
              <p className="text-gray-700 text-sm mb-4">
                To create an accurate data flow diagram, please provide one or more of the following:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="border p-3 rounded-md bg-gray-50">
                  <h4 className="font-medium text-chart-4 mb-2">Acceptable Diagram Types</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Data Flow Diagram (DFD)</li>
                    <li>Swim Lane Diagram</li>
                    <li>API Architectural Diagram</li>
                    <li>Network Diagram</li>
                    <li>System Architecture Diagram</li>
                  </ul>
                </div>
                
                <div className="border p-3 rounded-md bg-gray-50">
                  <h4 className="font-medium text-chart-4 mb-2">Alternative Options</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>We can simulate a DFD using Microsoft Threat Modeling Tool</li>
                    <li>For concept designs, we follow a shift-left approach</li>
                    <li>We can work with you to create a data flow diagram</li>
                    <li>For existing applications, we can analyze deployed architecture</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200 mb-4">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Why This Step Matters
                </h4>
                <p className="text-sm text-yellow-700">
                  This defensive approach ensures your application is developed with proper security from 
                  inception. We'll establish all system components, identify assets that need protection, 
                  document and rate threats, and define trust levels and boundaries that require specific 
                  permissions.
                </p>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-chart-4" />
                </div>
                <label htmlFor="file-upload" className="cursor-pointer bg-chart-4 hover:bg-chart-4/90 text-white py-2 px-4 rounded text-sm">
                  Upload Your Diagram
                  <input id="file-upload" type="file" className="hidden" accept=".png,.jpg,.jpeg,.pdf,.docx,.vsdx,.xml,.drawio" />
                </label>
                <span className="text-xs text-gray-500">Upload files (PNG, JPG, PDF, DOCX, VSDX, Drawio)</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-semibold text-chart-4 mb-2">DFD Component Examples</h3>
              <p className="text-gray-600 text-sm mb-4">
                Below are examples of common components we'll identify in your data flow diagram. These are provided as 
                reference - your actual architecture may contain different elements specific to your system.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border p-3 rounded-md bg-white">
                  <h4 className="font-medium text-gray-800 mb-1">Entry Points</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    <li>Web Application Interfaces</li>
                    <li>API Endpoints</li>
                    <li>Remote Access Services</li>
                    <li>Email Communication</li>
                    <li>Authentication Services</li>
                  </ul>
                </div>
                <div className="border p-3 rounded-md bg-white">
                  <h4 className="font-medium text-gray-800 mb-1">Trust Boundaries</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    <li>Network Segmentation</li>
                    <li>Authentication Zones</li>
                    <li>Data Classification Boundaries</li>
                    <li>Internal/External Interfaces</li>
                    <li>User/System Contexts</li>
                  </ul>
                </div>
                <div className="border p-3 rounded-md bg-white">
                  <h4 className="font-medium text-gray-800 mb-1">Data Flows</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    <li>User → Application → Database</li>
                    <li>API Integrations</li>
                    <li>Authentication Processes</li>
                    <li>Backup and Recovery Flows</li>
                    <li>Interservice Communications</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border p-4 rounded-md">
              <h3 className="font-semibold text-gray-800 mb-2">DFD Element Categories</h3>
              <p className="text-gray-600 text-sm mb-4">
                The Microsoft Threat Modeling Tool organizes elements into these four categories. We'll use
                these to categorize components in your data flow diagram.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="font-medium text-gray-800 mb-1">Entity Elements</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    <li>Web Portal</li>
                    <li>Authentication Services</li>
                    <li>End Users / Patients</li>
                    <li>Healthcare Providers</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="font-medium text-gray-800 mb-1">Data Flow Elements</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    <li>API Requests/Responses</li>
                    <li>Database Queries</li>
                    <li>Authentication Flows</li>
                    <li>File Transfers</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="font-medium text-gray-800 mb-1">Data Store Elements</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    <li>Patient Database</li>
                    <li>Authentication Storage</li>
                    <li>Document Storage</li>
                    <li>Audit Logs</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="font-medium text-gray-800 mb-1">Process Elements</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    <li>Authentication Service</li>
                    <li>Payment Service</li>
                    <li>Risk Assessment</li>
                    <li>Reporting Functions</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* STEP 2: Attack Enumeration */}
          <TabsContent value="step2" className="space-y-6">
            <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-4">
              <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                STRIDE Threat Analysis
              </h3>
              <p className="text-red-700 text-sm">
                Based on your completed data flow diagram, we'll systematically identify potential threats to each component
                using the STRIDE methodology. This analysis ensures complete coverage across all threat categories: Spoofing, 
                Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-md border border-gray-200 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Attack Enumeration Process</h3>
              <p className="text-gray-700 text-sm mb-4">
                In this step, we'll examine each DFD element from Step 1 and identify potential threats based on your
                specific architecture. This requires an interactive consultation to understand your unique risks.
              </p>
              
              <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200 mb-4">
                <h4 className="font-medium text-yellow-800 mb-2">Customer Input Required</h4>
                <p className="text-sm text-yellow-700 mb-2">
                  To accurately enumerate attacks for your system, we'll need to gather additional information:
                </p>
                <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1">
                  <li>Existing security controls and countermeasures already in place</li>
                  <li>Industry-specific threat intelligence relevant to your sector</li>
                  <li>Historical security incidents or near-misses</li>
                  <li>Risk tolerance and security priorities</li>
                  <li>Regulatory/compliance requirements (HIPAA, GDPR, etc.)</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Analysis Methodology</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Our security experts will perform the following activities during the attack enumeration:
                </p>
                <ol className="list-decimal pl-6 text-sm text-gray-600 space-y-1">
                  <li>Categorize each DFD element by type (Process, Data Store, Data Flow, External Entity)</li>
                  <li>Apply relevant STRIDE categories to each element based on its type</li>
                  <li>Identify potential threats for each applicable STRIDE category</li>
                  <li>Perform risk assessment to prioritize threats</li>
                  <li>Document complete threat profile with severity levels</li>
                </ol>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border p-4 rounded-md">
                <h3 className="font-semibold text-gray-800 mb-3">STRIDE Threat Categories</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-md">
                    <span className="font-bold text-lg text-red-600 mt-0.5">S</span>
                    <div>
                      <h4 className="font-medium text-gray-800">Spoofing</h4>
                      <p className="text-sm text-gray-600">Impersonating something or someone else</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-md">
                    <span className="font-bold text-lg text-orange-600 mt-0.5">T</span>
                    <div>
                      <h4 className="font-medium text-gray-800">Tampering</h4>
                      <p className="text-sm text-gray-600">Modifying data or code without authorization</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-md">
                    <span className="font-bold text-lg text-yellow-600 mt-0.5">R</span>
                    <div>
                      <h4 className="font-medium text-gray-800">Repudiation</h4>
                      <p className="text-sm text-gray-600">Claiming to not have performed an action</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-md">
                    <span className="font-bold text-lg text-green-600 mt-0.5">I</span>
                    <div>
                      <h4 className="font-medium text-gray-800">Information Disclosure</h4>
                      <p className="text-sm text-gray-600">Exposing information to unauthorized entities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-md">
                    <span className="font-bold text-lg text-blue-600 mt-0.5">D</span>
                    <div>
                      <h4 className="font-medium text-gray-800">Denial of Service</h4>
                      <p className="text-sm text-gray-600">Denying or degrading service to users</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-md">
                    <span className="font-bold text-lg text-purple-600 mt-0.5">E</span>
                    <div>
                      <h4 className="font-medium text-gray-800">Elevation of Privilege</h4>
                      <p className="text-sm text-gray-600">Gaining capabilities without authorization</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 mb-2">Risk Assessment Methodology</h3>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium text-gray-800 mb-2">Likelihood Scoring (1-5)</h4>
                  <ul className="space-y-1 text-sm">
                    <li><span className="font-medium">1 - Improbable:</span> Never happened before, no reason to expect now</li>
                    <li><span className="font-medium">2 - Unlikely:</span> Possible but probably won't happen</li>
                    <li><span className="font-medium">3 - Likely:</span> More likely to occur than not</li>
                    <li><span className="font-medium">4 - Very Likely:</span> Would be surprising if it didn't occur</li>
                    <li><span className="font-medium">5 - Almost Certain:</span> Already happens regularly or imminent</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium text-gray-800 mb-2">Impact Scoring (1-5)</h4>
                  <ul className="space-y-1 text-sm">
                    <li><span className="font-medium">1 - Negligible:</span> Minimal effect on operations/compliance</li>
                    <li><span className="font-medium">2 - Minor:</span> Limited impact, easily manageable</li>
                    <li><span className="font-medium">3 - Moderate:</span> Significant but contained impact</li>
                    <li><span className="font-medium">4 - Major:</span> Substantial impact affecting multiple areas</li>
                    <li><span className="font-medium">5 - Severe:</span> Critical operations/data compromised</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">STRIDE Analysis Matrix Example</h3>
              <p className="text-gray-600 text-sm mb-4">
                Below is an example of how we map DFD elements against STRIDE categories to identify potential threats. 
                During consultation, we'll create a customized matrix specific to your architecture.
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-3 border text-left text-xs font-medium text-gray-600 uppercase tracking-wider">DFD Elements</th>
                      <th className="py-2 px-3 border text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Spoofing</th>
                      <th className="py-2 px-3 border text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tampering</th>
                      <th className="py-2 px-3 border text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Repudiation</th>
                      <th className="py-2 px-3 border text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Info Disclosure</th>
                      <th className="py-2 px-3 border text-left text-xs font-medium text-gray-600 uppercase tracking-wider">DoS</th>
                      <th className="py-2 px-3 border text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Elevation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-2 px-3 border font-medium">Entity (Users, Auth Systems)</td>
                      <td className="py-2 px-3 border">✓</td>
                      <td className="py-2 px-3 border"></td>
                      <td className="py-2 px-3 border">✓</td>
                      <td className="py-2 px-3 border"></td>
                      <td className="py-2 px-3 border"></td>
                      <td className="py-2 px-3 border">✓</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border font-medium">Data Flows (API requests/responses)</td>
                      <td className="py-2 px-3 border">✓</td>
                      <td className="py-2 px-3 border">✓</td>
                      <td className="py-2 px-3 border">✓</td>
                      <td className="py-2 px-3 border">✓</td>
                      <td className="py-2 px-3 border">✓</td>
                      <td className="py-2 px-3 border"></td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border font-medium">Data Stores (Databases, Storage)</td>
                      <td className="py-2 px-3 border"></td>
                      <td className="py-2 px-3 border">✓</td>
                      <td className="py-2 px-3 border">✓</td>
                      <td className="py-2 px-3 border">✓</td>
                      <td className="py-2 px-3 border">✓</td>
                      <td className="py-2 px-3 border"></td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border font-medium">Processes (Services, Applications)</td>
                      <td className="py-2 px-3 border">✓</td>
                      <td className="py-2 px-3 border">✓</td>
                      <td className="py-2 px-3 border">✓</td>
                      <td className="py-2 px-3 border">✓</td>
                      <td className="py-2 px-3 border">✓</td>
                      <td className="py-2 px-3 border">✓</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Risk Scoring Methodology</h3>
              <p className="text-gray-600 text-sm mb-4">
                Each identified threat will be assessed using the following risk scoring table. This allows us to 
                prioritize threats and develop appropriate mitigation strategies based on risk level.
              </p>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Description of Risk</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Impact (I) Score (1-5)</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Likelihood (L) Score (1-5)</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Risk Score Explanation</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Risk Score (I x L)</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Risk Level</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Mitigating Controls</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Implemented Control Y/N</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Residual Risk</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Residual Risk Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-2 px-3 border">Elevation Using Impersonation: Web portal may impersonate user context</td>
                      <td className="py-2 px-3 border text-center">4</td>
                      <td className="py-2 px-3 border text-center">3</td>
                      <td className="py-2 px-3 border">Major impact on integrity with likely occurrence</td>
                      <td className="py-2 px-3 border text-center font-medium">12</td>
                      <td className="py-2 px-3 border text-center"><span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">High</span></td>
                      <td className="py-2 px-3 border">Implement RBAC and session validation</td>
                      <td className="py-2 px-3 border text-center">TBD</td>
                      <td className="py-2 px-3 border text-center">TBD</td>
                      <td className="py-2 px-3 border text-center">TBD</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border">Spoofing the Mobile User: User may be spoofed leading to unauthorized access</td>
                      <td className="py-2 px-3 border text-center">5</td>
                      <td className="py-2 px-3 border text-center">3</td>
                      <td className="py-2 px-3 border">Severe impact on confidentiality with likely occurrence</td>
                      <td className="py-2 px-3 border text-center font-medium">15</td>
                      <td className="py-2 px-3 border text-center"><span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">High</span></td>
                      <td className="py-2 px-3 border">Implement MFA and device fingerprinting</td>
                      <td className="py-2 px-3 border text-center">TBD</td>
                      <td className="py-2 px-3 border text-center">TBD</td>
                      <td className="py-2 px-3 border text-center">TBD</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border">Data Flow Interruption: API Request may be intercepted</td>
                      <td className="py-2 px-3 border text-center">3</td>
                      <td className="py-2 px-3 border text-center">2</td>
                      <td className="py-2 px-3 border">Moderate impact on availability with unlikely occurrence</td>
                      <td className="py-2 px-3 border text-center font-medium">6</td>
                      <td className="py-2 px-3 border text-center"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Medium</span></td>
                      <td className="py-2 px-3 border">Implement TLS and API request signing</td>
                      <td className="py-2 px-3 border text-center">TBD</td>
                      <td className="py-2 px-3 border text-center">TBD</td>
                      <td className="py-2 px-3 border text-center">TBD</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border">Weak Authentication Scheme: Custom authentication susceptible to bypass</td>
                      <td className="py-2 px-3 border text-center">4</td>
                      <td className="py-2 px-3 border text-center">3</td>
                      <td className="py-2 px-3 border">Major impact on authentication with likely occurrence</td>
                      <td className="py-2 px-3 border text-center font-medium">12</td>
                      <td className="py-2 px-3 border text-center"><span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">High</span></td>
                      <td className="py-2 px-3 border">Implement OAuth 2.0 with modern standards</td>
                      <td className="py-2 px-3 border text-center">TBD</td>
                      <td className="py-2 px-3 border text-center">TBD</td>
                      <td className="py-2 px-3 border text-center">TBD</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-3 rounded-md bg-gray-50">
                  <h4 className="font-medium text-gray-800 mb-2">Risk Scoring Matrix</h4>
                  <p className="text-xs text-gray-600 mb-3">Impact (rows) × Likelihood (columns)</p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border text-xs">
                      <thead>
                        <tr>
                          <th className="p-1 border bg-gray-100"></th>
                          <th className="p-1 border bg-gray-100">1</th>
                          <th className="p-1 border bg-gray-100">2</th>
                          <th className="p-1 border bg-gray-100">3</th>
                          <th className="p-1 border bg-gray-100">4</th>
                          <th className="p-1 border bg-gray-100">5</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-1 border bg-gray-100">5</td>
                          <td className="p-1 border bg-yellow-100">5</td>
                          <td className="p-1 border bg-yellow-100">10</td>
                          <td className="p-1 border bg-red-100">15</td>
                          <td className="p-1 border bg-red-100">20</td>
                          <td className="p-1 border bg-red-100">25</td>
                        </tr>
                        <tr>
                          <td className="p-1 border bg-gray-100">4</td>
                          <td className="p-1 border bg-blue-100">4</td>
                          <td className="p-1 border bg-yellow-100">8</td>
                          <td className="p-1 border bg-red-100">12</td>
                          <td className="p-1 border bg-red-100">16</td>
                          <td className="p-1 border bg-red-100">20</td>
                        </tr>
                        <tr>
                          <td className="p-1 border bg-gray-100">3</td>
                          <td className="p-1 border bg-blue-100">3</td>
                          <td className="p-1 border bg-blue-100">6</td>
                          <td className="p-1 border bg-yellow-100">9</td>
                          <td className="p-1 border bg-red-100">12</td>
                          <td className="p-1 border bg-red-100">15</td>
                        </tr>
                        <tr>
                          <td className="p-1 border bg-gray-100">2</td>
                          <td className="p-1 border bg-blue-100">2</td>
                          <td className="p-1 border bg-blue-100">4</td>
                          <td className="p-1 border bg-blue-100">6</td>
                          <td className="p-1 border bg-yellow-100">8</td>
                          <td className="p-1 border bg-yellow-100">10</td>
                        </tr>
                        <tr>
                          <td className="p-1 border bg-gray-100">1</td>
                          <td className="p-1 border bg-blue-100">1</td>
                          <td className="p-1 border bg-blue-100">2</td>
                          <td className="p-1 border bg-blue-100">3</td>
                          <td className="p-1 border bg-blue-100">4</td>
                          <td className="p-1 border bg-yellow-100">5</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-100"></div>
                      <span className="text-xs">Low (1-6)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-100"></div>
                      <span className="text-xs">Medium (7-10)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-100"></div>
                      <span className="text-xs">High (11-25)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="border p-3 rounded-md bg-gray-50">
                    <h4 className="font-medium text-gray-800 mb-1">Customer Input for Risk Scoring</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      To accurately assess risks in your environment, we'll need your input on:
                    </p>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                      <li>Business impact of different types of security incidents</li>
                      <li>Historical data on previous security incidents</li>
                      <li>Industry-specific threat intelligence</li>
                      <li>Risk appetite and tolerance levels</li>
                      <li>Regulatory compliance requirements</li>
                    </ul>
                  </div>
                  
                  <div className="border p-3 rounded-md bg-gray-50">
                    <h4 className="font-medium text-gray-800 mb-1">Risk Assessment Next Steps</h4>
                    <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
                      <li>Complete risk assessment for all identified threats</li>
                      <li>Prioritize risks based on score and business impact</li>
                      <li>Develop mitigation strategies for high and medium risks</li>
                      <li>Document risk acceptance decisions for any unmitigated risks</li>
                      <li>Create implementation plan for security controls</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto mb-6">
                <h4 className="font-medium text-purple-800 mb-2">Microsoft TMT Identified STRIDE Threats</h4>
                <p className="text-sm text-purple-700 mb-3">
                  Below are some of the actual threats identified by the Microsoft Threat Modeling Tool for your application:
                </p>
                <table className="min-w-full bg-white border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Identified Risk</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Risk Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-2 px-3 border">Elevation Of Privilege: Elevation Using Impersonation</td>
                      <td className="py-2 px-3 border">Web Portal (Doppio/API:Payment service) may be able to impersonate the context of Web Member / User in order to gain additional privilege.</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border">Spoofing: Spoofing the Mobile Member/User External Entity</td>
                      <td className="py-2 px-3 border">Mobile Member/User may be spoofed by an attacker and this may lead to unauthorized access to web Portal (Doppio/API:Payment service). Consider using a standard authentication mechanism to identify the external entity.</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border">Repudiation: Potential Data Repudiation by web Portal</td>
                      <td className="py-2 px-3 border">Web Portal claims that it did not receive data from a source outside the trust boundary. Consider using logging or auditing to record the source, time, and summary of the received data.</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border">Denial Of Service: Process Crash or Stop</td>
                      <td className="py-2 px-3 border">Web Portal crashes, halts, stops or runs slowly; in all cases violating an availability metric.</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border">Information Disclosure: Weak Authentication Scheme</td>
                      <td className="py-2 px-3 border">Custom authentication schemes are susceptible to common weaknesses such as weak credential change management, credential equivalence, easily guessable credentials, null credentials, downgrade authentication or a weak credential change management system.</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border">Elevation Of Privilege: Remote Code Execution</td>
                      <td className="py-2 px-3 border">Mobile Member/User may be able to remotely execute code for web Portal (Doppio/API:Payment service).</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border">Tampering: Collision Attacks</td>
                      <td className="py-2 px-3 border">Attackers who can send a series of packets or messages may be able to overlap data. For example, packet 1 may be 100 bytes starting at offset 0. Packet 2 may be 100 bytes starting at offset 25. Packet 2 will overwrite 75 bytes of packet 1.</td>
                    </tr>
                  </tbody>
                </table>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h5 className="text-sm font-medium mb-2 text-gray-800">Risk Assessment Process</h5>
                  <p className="text-sm text-gray-600">
                    During our consultation, we'll work with you to assess each identified threat using the impact and likelihood scoring framework.
                    This will help prioritize which risks to address first in the mitigation phase.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* STEP 3: Mitigation */}
          <TabsContent value="step3" className="space-y-6">
            <div className="bg-green-50 p-4 rounded-md border border-green-200 mb-4">
              <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Mitigation Strategies
              </h3>
              <p className="text-green-700 text-sm">
                For each identified threat from Step 2, we'll develop custom mitigation strategies based on your 
                organization's security posture, existing controls, and resource constraints. This collaborative
                process ensures that security controls are practical, cost-effective, and aligned with your compliance requirements.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-md border border-gray-200 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Mitigation Strategy Development Process</h3>
              <p className="text-gray-700 text-sm mb-4">
                Our security experts will work with your team to develop a mitigation plan tailored to your specific needs.
                This interactive process requires additional input about your environment and constraints.
              </p>
              
              <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200 mb-4">
                <h4 className="font-medium text-yellow-800 mb-2">Customer Input Required</h4>
                <p className="text-sm text-yellow-700 mb-2">
                  To develop effective mitigations, we'll need the following information:
                </p>
                <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1">
                  <li>Current security controls and their effectiveness</li>
                  <li>Security budget and resource constraints</li>
                  <li>Implementation timeline requirements</li>
                  <li>Technical environment limitations</li>
                  <li>Compliance requirements and audit schedules</li>
                  <li>Security maturity level and appetite for change</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Our Mitigation Approach</h4>
                <p className="text-sm text-gray-600 mb-2">
                  We follow a structured process to develop mitigations:
                </p>
                <ol className="list-decimal pl-6 text-sm text-gray-600 space-y-1">
                  <li>Match each identified threat with corresponding control strategies</li>
                  <li>Prioritize mitigations based on risk severity and implementation complexity</li>
                  <li>Develop a phased implementation roadmap</li>
                  <li>Identify quick wins and critical controls for immediate implementation</li>
                  <li>Align with industry-standard frameworks relevant to your sector</li>
                </ol>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-800">Mitigation Planning</h3>
              <p className="text-gray-600 text-sm mb-4">
                Based on the risk assessment from Step 2, we develop a comprehensive mitigation plan for each identified risk. 
                This table tracks the complete mitigation lifecycle from planning through implementation to residual risk evaluation.
              </p>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Description of Risk</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Impact (I) Score (1-5)</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Likelihood (L) Score (1-5)</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Risk Score Explanation</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Risk Score (I x L)</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Risk Level</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Mitigating Controls</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Implemented Control Y/N</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Residual Risk</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Residual Risk Level</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Mitigation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-2 px-3 border">Elevation Using Impersonation: Web portal may impersonate user context</td>
                      <td className="py-2 px-3 border text-center">4</td>
                      <td className="py-2 px-3 border text-center">3</td>
                      <td className="py-2 px-3 border">Major impact on integrity with likely occurrence</td>
                      <td className="py-2 px-3 border text-center font-medium">12</td>
                      <td className="py-2 px-3 border text-center"><span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">High</span></td>
                      <td className="py-2 px-3 border">Implement RBAC and strong session validation</td>
                      <td className="py-2 px-3 border text-center">N</td>
                      <td className="py-2 px-3 border text-center">4</td>
                      <td className="py-2 px-3 border text-center"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Low</span></td>
                      <td className="py-2 px-3 border">
                        <ol className="list-decimal pl-3 text-xs">
                          <li>Implement RBAC for all services</li>
                          <li>Add context validation checks</li>
                          <li>Implement session monitoring</li>
                        </ol>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border">Spoofing the Mobile User: User may be spoofed leading to unauthorized access</td>
                      <td className="py-2 px-3 border text-center">5</td>
                      <td className="py-2 px-3 border text-center">3</td>
                      <td className="py-2 px-3 border">Severe impact on confidentiality with likely occurrence</td>
                      <td className="py-2 px-3 border text-center font-medium">15</td>
                      <td className="py-2 px-3 border text-center"><span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">High</span></td>
                      <td className="py-2 px-3 border">Implement MFA and device fingerprinting</td>
                      <td className="py-2 px-3 border text-center">N</td>
                      <td className="py-2 px-3 border text-center">6</td>
                      <td className="py-2 px-3 border text-center"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Medium</span></td>
                      <td className="py-2 px-3 border">
                        <ol className="list-decimal pl-3 text-xs">
                          <li>Deploy MFA for all user access</li>
                          <li>Implement device registration</li>
                          <li>Add anomaly detection alerts</li>
                          <li>Strengthen identity validation</li>
                        </ol>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border">Weak Authentication Scheme: Custom authentication susceptible to bypass</td>
                      <td className="py-2 px-3 border text-center">4</td>
                      <td className="py-2 px-3 border text-center">3</td>
                      <td className="py-2 px-3 border">Major impact on authentication with likely occurrence</td>
                      <td className="py-2 px-3 border text-center font-medium">12</td>
                      <td className="py-2 px-3 border text-center"><span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">High</span></td>
                      <td className="py-2 px-3 border">Implement OAuth 2.0 with modern standards</td>
                      <td className="py-2 px-3 border text-center">N</td>
                      <td className="py-2 px-3 border text-center">3</td>
                      <td className="py-2 px-3 border text-center"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Low</span></td>
                      <td className="py-2 px-3 border">
                        <ol className="list-decimal pl-3 text-xs">
                          <li>Replace custom auth with OAuth 2.0</li>
                          <li>Implement proper token validation</li>
                          <li>Add JWT signature verification</li>
                          <li>Configure proper token expiration</li>
                        </ol>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border">Data Flow Interruption: API Request may be intercepted</td>
                      <td className="py-2 px-3 border text-center">3</td>
                      <td className="py-2 px-3 border text-center">2</td>
                      <td className="py-2 px-3 border">Moderate impact on availability with unlikely occurrence</td>
                      <td className="py-2 px-3 border text-center font-medium">6</td>
                      <td className="py-2 px-3 border text-center"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Low</span></td>
                      <td className="py-2 px-3 border">Implement TLS and API request signing</td>
                      <td className="py-2 px-3 border text-center">Y</td>
                      <td className="py-2 px-3 border text-center">2</td>
                      <td className="py-2 px-3 border text-center"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Low</span></td>
                      <td className="py-2 px-3 border">
                        <ol className="list-decimal pl-3 text-xs">
                          <li>Maintain TLS 1.3 configuration</li>
                          <li>Verify HMAC implementation</li>
                          <li>Monitor for TLS downgrade attacks</li>
                        </ol>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">STRIDE Mitigation Strategy Reference</h3>
                  <div className="border p-3 rounded-md bg-white">
                    <h4 className="font-medium text-red-800 mb-1">Spoofing Mitigations</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      <li>Strong authentication mechanisms</li>
                      <li>Multi-factor authentication</li>
                      <li>Digital signatures</li>
                      <li>Unique identifiers and certificates</li>
                    </ul>
                  </div>
                  <div className="border p-3 rounded-md bg-white">
                    <h4 className="font-medium text-orange-800 mb-1">Tampering Mitigations</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      <li>Digital signatures</li>
                      <li>File permissions and access controls</li>
                      <li>Cryptographic hashes</li>
                      <li>Input validation at all trust boundaries</li>
                    </ul>
                  </div>
                  <div className="border p-3 rounded-md bg-white">
                    <h4 className="font-medium text-yellow-800 mb-1">Repudiation Mitigations</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      <li>Secure audit logging</li>
                      <li>Digital signatures for all transactions</li>
                      <li>Timestamps with secure time source</li>
                      <li>Strong user authentication and session management</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">&nbsp;</h3>
                  <div className="border p-3 rounded-md bg-white">
                    <h4 className="font-medium text-green-800 mb-1">Information Disclosure Mitigations</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      <li>Encryption (in transit and at rest)</li>
                      <li>Access controls and authorization</li>
                      <li>Data minimization policies</li>
                      <li>Privacy enhancing technologies</li>
                    </ul>
                  </div>
                  <div className="border p-3 rounded-md bg-white">
                    <h4 className="font-medium text-blue-800 mb-1">Denial of Service Mitigations</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      <li>Resource quotas and rate limiting</li>
                      <li>Scalable architecture</li>
                      <li>Traffic filtering</li>
                      <li>Redundant systems and failover</li>
                    </ul>
                  </div>
                  <div className="border p-3 rounded-md bg-white">
                    <h4 className="font-medium text-purple-800 mb-1">Elevation of Privilege Mitigations</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      <li>Principle of least privilege</li>
                      <li>Strong authorization controls</li>
                      <li>Input validation and sanitization</li>
                      <li>Security context verification</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border p-3 rounded-md bg-gray-50">
                  <h4 className="font-medium text-gray-800 mb-2">Mitigation Implementation Guide</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    For each identified risk, follow these steps to develop an effective mitigation plan:
                  </p>
                  <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1">
                    <li>Identify security controls that address the specific threat</li>
                    <li>Evaluate each control for effectiveness and implementation feasibility</li>
                    <li>Prioritize controls based on risk severity and implementation complexity</li>
                    <li>Document detailed implementation steps for each control</li>
                    <li>Assign implementation responsibility and deadlines</li>
                    <li>Establish metrics to measure control effectiveness</li>
                    <li>Plan for post-implementation validation testing</li>
                  </ol>
                </div>
                
                <div className="border p-3 rounded-md bg-gray-50">
                  <h4 className="font-medium text-gray-800 mb-2">Healthcare-Specific Considerations</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    For healthcare environments, also consider these specialized security controls:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li><span className="font-medium">PHI Protection:</span> Implement specific controls for protected health information</li>
                    <li><span className="font-medium">HIPAA Alignment:</span> Ensure controls satisfy HIPAA Security Rule requirements</li>
                    <li><span className="font-medium">Medical Device Integration:</span> Address unique risks of medical device connectivity</li>
                    <li><span className="font-medium">Clinical Workflow Impact:</span> Evaluate security control impact on clinical operations</li>
                    <li><span className="font-medium">Emergency Access:</span> Design break-glass procedures for emergency scenarios</li>
                    <li><span className="font-medium">Audit Trail:</span> Implement comprehensive audit logging for all PHI access</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* STEP 4: Validation */}
          <TabsContent value="step4" className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-md border border-purple-200 mb-4">
              <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Validation Process
              </h3>
              <p className="text-purple-700 text-sm">
                The final step validates that our threat model accurately reflects your system architecture, 
                and that the proposed mitigations align with your organization's policies and risk tolerance.
                This collaborative validation process confirms the completeness and effectiveness of the threat modeling exercise.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-md border border-gray-200 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Validation Process Overview</h3>
              <p className="text-gray-700 text-sm mb-4">
                We'll work with your team to complete the validation process through an interactive consultation.
                This meeting allows us to review all findings, adjust the model as needed, and finalize recommendations.
              </p>
              
              <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200 mb-4">
                <h4 className="font-medium text-yellow-800 mb-2">Schedule Threat Model Validation Meeting</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  Please provide your availability for a validation meeting with your key stakeholders:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-800">Preferred Meeting Date</label>
                    <input type="date" className="w-full p-2 border rounded text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-800">Preferred Time (Your Timezone)</label>
                    <input type="time" className="w-full p-2 border rounded text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-800">Key Stakeholders to Include</label>
                    <input type="text" className="w-full p-2 border rounded text-sm" placeholder="Security Lead, Development Manager, etc." />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-800">Meeting Format</label>
                    <select className="w-full p-2 border rounded text-sm">
                      <option>Virtual (Teams/Zoom)</option>
                      <option>In-person</option>
                      <option>Hybrid</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <button className="bg-chart-4 text-white px-4 py-2 rounded text-sm">Schedule Validation Meeting</button>
                </div>
              </div>
            </div>
            
            <div className="border p-4 rounded-md mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Validation Checklist</h3>
              <p className="text-sm text-gray-600 mb-4">
                Use this checklist during the validation meeting to ensure all aspects of the threat model have been verified.
                Check each item once it has been reviewed and confirmed by your team.
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Validation Item</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Description</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Stakeholder</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Status</th>
                      <th className="py-2 px-3 border text-left font-medium text-gray-700">Comments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-2 px-3 border">Data Flow Diagram Accuracy</td>
                      <td className="py-2 px-3 border">Verify all components, data flows, and trust boundaries</td>
                      <td className="py-2 px-3 border">Architecture Team</td>
                      <td className="py-2 px-3 border">
                        <select className="w-full p-1 border rounded text-xs">
                          <option value="">Select status</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Needs Revision</option>
                          <option value="na">Not Applicable</option>
                        </select>
                      </td>
                      <td className="py-2 px-3 border">
                        <input type="text" className="w-full p-1 border rounded text-xs" placeholder="Enter comments..." />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border">Threat Coverage Completeness</td>
                      <td className="py-2 px-3 border">Confirm all STRIDE categories applied to each component</td>
                      <td className="py-2 px-3 border">Security Team</td>
                      <td className="py-2 px-3 border">
                        <select className="w-full p-1 border rounded text-xs">
                          <option value="">Select status</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Needs Revision</option>
                          <option value="na">Not Applicable</option>
                        </select>
                      </td>
                      <td className="py-2 px-3 border">
                        <input type="text" className="w-full p-1 border rounded text-xs" placeholder="Enter comments..." />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border">Risk Assessment Accuracy</td>
                      <td className="py-2 px-3 border">Validate impact and likelihood scores for all threats</td>
                      <td className="py-2 px-3 border">Risk Management Team</td>
                      <td className="py-2 px-3 border">
                        <select className="w-full p-1 border rounded text-xs">
                          <option value="">Select status</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Needs Revision</option>
                          <option value="na">Not Applicable</option>
                        </select>
                      </td>
                      <td className="py-2 px-3 border">
                        <input type="text" className="w-full p-1 border rounded text-xs" placeholder="Enter comments..." />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border">Mitigation Effectiveness</td>
                      <td className="py-2 px-3 border">Review if controls adequately address identified risks</td>
                      <td className="py-2 px-3 border">Development Team</td>
                      <td className="py-2 px-3 border">
                        <select className="w-full p-1 border rounded text-xs">
                          <option value="">Select status</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Needs Revision</option>
                          <option value="na">Not Applicable</option>
                        </select>
                      </td>
                      <td className="py-2 px-3 border">
                        <input type="text" className="w-full p-1 border rounded text-xs" placeholder="Enter comments..." />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border">Implementation Feasibility</td>
                      <td className="py-2 px-3 border">Assess technical feasibility of recommended controls</td>
                      <td className="py-2 px-3 border">Engineering Team</td>
                      <td className="py-2 px-3 border">
                        <select className="w-full p-1 border rounded text-xs">
                          <option value="">Select status</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Needs Revision</option>
                          <option value="na">Not Applicable</option>
                        </select>
                      </td>
                      <td className="py-2 px-3 border">
                        <input type="text" className="w-full p-1 border rounded text-xs" placeholder="Enter comments..." />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border">Compliance Alignment</td>
                      <td className="py-2 px-3 border">Verify controls meet regulatory requirements (HIPAA, etc.)</td>
                      <td className="py-2 px-3 border">Compliance Officer</td>
                      <td className="py-2 px-3 border">
                        <select className="w-full p-1 border rounded text-xs">
                          <option value="">Select status</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Needs Revision</option>
                          <option value="na">Not Applicable</option>
                        </select>
                      </td>
                      <td className="py-2 px-3 border">
                        <input type="text" className="w-full p-1 border rounded text-xs" placeholder="Enter comments..." />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border p-4 rounded-md bg-gray-50">
                <h3 className="font-medium text-gray-800 mb-3">Risk Assessment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Critical Threats:</span>
                    <div className="flex items-center gap-1">
                      <input type="number" className="w-12 p-1 border rounded text-center text-sm" defaultValue="4" min="0" />
                      <Badge className="bg-red-500">identified</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">High Risk Threats:</span>
                    <div className="flex items-center gap-1">
                      <input type="number" className="w-12 p-1 border rounded text-center text-sm" defaultValue="4" min="0" />
                      <Badge className="bg-orange-500">identified</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Medium Risk Threats:</span>
                    <div className="flex items-center gap-1">
                      <input type="number" className="w-12 p-1 border rounded text-center text-sm" defaultValue="4" min="0" />
                      <Badge className="bg-yellow-500">identified</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Low Risk Threats:</span>
                    <div className="flex items-center gap-1">
                      <input type="number" className="w-12 p-1 border rounded text-center text-sm" defaultValue="4" min="0" />
                      <Badge className="bg-blue-500">identified</Badge>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Threats:</span>
                      <div className="flex items-center gap-1">
                        <input type="number" className="w-12 p-1 border rounded text-center text-sm" defaultValue="16" min="0" />
                        <Badge className="bg-purple-600">identified</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border p-4 rounded-md bg-gray-50">
                <h3 className="font-medium text-gray-800 mb-3">Implementation Recommendations</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <p className="text-sm">Address all critical and high risk threats in the current development cycle</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <p className="text-sm">Schedule medium risk threat mitigations in the next release cycle</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <p className="text-sm">Document accepted risks with business justification</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <p className="text-sm">Establish ongoing threat modeling as part of the secure development lifecycle</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <p className="text-sm">Set up continuous validation through regular penetration testing</p>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium mb-1">Additional Recommendations:</label>
                    <textarea className="w-full p-2 border rounded text-sm" rows={2} placeholder="Add your custom recommendations..."></textarea>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border p-4 rounded-md bg-green-50 mb-6">
              <h3 className="font-medium text-green-800 mb-3">Threat Model Approval</h3>
              <p className="text-sm text-green-700 mb-4">
                The final threat model requires formal approval from key stakeholders. Please complete the form below:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-800">Document Version</label>
                  <input type="text" className="w-full p-2 border rounded text-sm" defaultValue="1.0" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-800">Review Date</label>
                  <input type="date" className="w-full p-2 border rounded text-sm" defaultValue="2025-04-27" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-800">Next Review Date</label>
                  <input type="date" className="w-full p-2 border rounded text-sm" defaultValue="2025-10-27" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-800">Approval Status</label>
                  <select className="w-full p-2 border rounded text-sm">
                    <option value="pending">Pending Approval</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected - Needs Revision</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Security Team Approval</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <input type="text" className="w-full p-2 border rounded text-sm" placeholder="Name" />
                    </div>
                    <div>
                      <input type="text" className="w-full p-2 border rounded text-sm" placeholder="Title/Role" />
                    </div>
                    <div>
                      <input type="date" className="w-full p-2 border rounded text-sm" placeholder="Date" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Development Team Approval</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <input type="text" className="w-full p-2 border rounded text-sm" placeholder="Name" />
                    </div>
                    <div>
                      <input type="text" className="w-full p-2 border rounded text-sm" placeholder="Title/Role" />
                    </div>
                    <div>
                      <input type="date" className="w-full p-2 border rounded text-sm" placeholder="Date" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Executive Approval</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <input type="text" className="w-full p-2 border rounded text-sm" placeholder="Name" />
                    </div>
                    <div>
                      <input type="text" className="w-full p-2 border rounded text-sm" placeholder="Title/Role" />
                    </div>
                    <div>
                      <input type="date" className="w-full p-2 border rounded text-sm" placeholder="Date" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <button className="bg-chart-4 text-white px-4 py-2 rounded text-sm">Submit for Approval</button>
                <button className="bg-white border border-gray-300 px-4 py-2 rounded text-sm">Save as Draft</button>
                <button className="bg-white border border-gray-300 px-4 py-2 rounded text-sm">Export as PDF</button>
              </div>
            </div>
            
            <div className="border p-4 rounded-md bg-blue-50">
              <h3 className="font-medium text-blue-800 mb-3">Additional Recommendations</h3>
              <p className="text-sm text-blue-700 mb-4">
                Based on our experience with similar systems, we recommend the following additional security measures:
              </p>
              
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-md border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Regular Security Training</h4>
                  <p className="text-xs text-gray-600">We recommend implementing quarterly security awareness training for all development and operations staff focused on secure coding practices and threat awareness.</p>
                  <div className="flex justify-end mt-2">
                    <button className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Add to Plan</button>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-md border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Automated Security Scanning</h4>
                  <p className="text-xs text-gray-600">Implement automated security scanning in your CI/CD pipeline using tools like OWASP ZAP, SonarQube, and Snyk to detect vulnerabilities early in the development process.</p>
                  <div className="flex justify-end mt-2">
                    <button className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Add to Plan</button>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-md border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Security Champions Program</h4>
                  <p className="text-xs text-gray-600">Establish a security champions program where each development team designates a member responsible for security oversight and advocacy within their team.</p>
                  <div className="flex justify-end mt-2">
                    <button className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Add to Plan</button>
                  </div>
                </div>
                
                <div className="mt-3">
                  <label className="block text-sm font-medium text-blue-800 mb-1">Custom Recommendation:</label>
                  <div className="flex gap-2">
                    <input type="text" className="flex-grow p-2 border rounded text-sm" placeholder="Add your custom recommendation..." />
                    <button className="bg-blue-600 text-white px-3 py-2 rounded text-sm">Add</button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}