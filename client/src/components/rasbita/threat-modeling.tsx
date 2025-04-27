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
              Step 2: Attacks
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
                The data flow diagram (DFD) helps establish the movement of data between trust boundaries. 
                This critical first step identifies where security controls should be implemented based on 
                how data moves through the system.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-semibold text-chart-4 mb-2">Architectural Components</h3>
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
                Using the STRIDE methodology, we identify potential threats to each component in the data flow diagram. 
                This approach ensures complete coverage across all threat categories: Spoofing, Tampering, Repudiation, 
                Information Disclosure, Denial of Service, and Elevation of Privilege.
              </p>
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
            
            <div className="space-y-4">
              <h3 className="font-semibold">Identified Threats by Severity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-3 rounded-md bg-red-50">
                  <h4 className="font-medium text-red-800 mb-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Critical Threats (Score 16-25)
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-red-700">
                    <li>SQL Injection targeting patient data (S:5, I:5)</li>
                    <li>Ransomware affecting critical systems (S:4, I:5)</li>
                    <li>Privilege escalation in admin interface (S:4, I:5)</li>
                    <li>Authentication bypass in patient portal (S:3, I:5)</li>
                  </ul>
                </div>
                <div className="border p-3 rounded-md bg-orange-50">
                  <h4 className="font-medium text-orange-800 mb-1 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    High Risk Threats (Score 10-15)
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-orange-700">
                    <li>Session hijacking in user portal (S:3, I:4)</li>
                    <li>Cross-site scripting in search functionality (S:4, I:3)</li>
                    <li>Third-party API data exposure (S:3, I:4)</li>
                    <li>Weak authentication scheme (S:3, I:4)</li>
                  </ul>
                </div>
                <div className="border p-3 rounded-md bg-yellow-50">
                  <h4 className="font-medium text-yellow-800 mb-1 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Medium Risk Threats (Score 5-9)
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-yellow-700">
                    <li>Insecure direct object references (S:3, I:3)</li>
                    <li>Sensitive data exposure in logs (S:2, I:4)</li>
                    <li>Broken authentication mechanisms (S:2, I:4)</li>
                    <li>API endpoint without rate limiting (S:3, I:2)</li>
                  </ul>
                </div>
                <div className="border p-3 rounded-md bg-blue-50">
                  <h4 className="font-medium text-blue-800 mb-1 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Low Risk Threats (Score 1-4)
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-blue-700">
                    <li>Verbose error messages (S:2, I:2)</li>
                    <li>Missing HTTP security headers (S:2, I:2)</li>
                    <li>Insecure cookie attributes (S:2, I:2)</li>
                    <li>Software version disclosure (S:1, I:2)</li>
                  </ul>
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
                Mitigation strategies address each identified risk by either updating system design, 
                introducing security controls, or accepting the risk after assessment. Each STRIDE category 
                has specific mitigation approaches to counter the particular threat type.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">STRIDE Mitigation Approaches</h3>
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
              <div className="space-y-4">
                <h3 className="font-semibold">Security Controls Implementation</h3>
                <div className="border p-3 rounded-md bg-green-50">
                  <h4 className="font-medium text-green-800 mb-1">Implemented Controls</h4>
                  <ul className="list-disc pl-5 text-sm text-green-700">
                    <li>Multi-factor authentication</li>
                    <li>Data encryption at rest and in transit</li>
                    <li>Web application firewall</li>
                    <li>Network segmentation</li>
                    <li>Secure coding practices</li>
                  </ul>
                </div>
                <div className="border p-3 rounded-md bg-blue-50">
                  <h4 className="font-medium text-blue-800 mb-1">Recommended Controls</h4>
                  <ul className="list-disc pl-5 text-sm text-blue-700">
                    <li>API gateway with rate limiting</li>
                    <li>Zero trust network architecture</li>
                    <li>Enhanced logging and monitoring</li>
                    <li>Regular penetration testing</li>
                    <li>Security key management system</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Defense Strategy</h3>
                <div className="border p-3 rounded-md bg-purple-50">
                  <h4 className="font-medium text-purple-800 mb-1">Attack Surface Reduction</h4>
                  <ul className="list-disc pl-5 text-sm text-purple-700">
                    <li>Minimize third-party integrations</li>
                    <li>Implement least privilege access model</li>
                    <li>Disable unnecessary services and features</li>
                    <li>Regular security code reviews</li>
                    <li>Vulnerability management program</li>
                  </ul>
                </div>
                <div className="border p-3 rounded-md bg-gray-50">
                  <h4 className="font-medium text-gray-800 mb-1">Defense in Depth Strategy</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    <li>Input validation at multiple layers</li>
                    <li>Sequential security controls</li>
                    <li>Redundant security mechanisms</li>
                    <li>Isolated security zones</li>
                    <li>Regular security assessments</li>
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
                The validation step ensures that our threat model accurately reflects the system being modeled
                and that mitigations align with organizational policies and risk management objectives. 
                This step confirms the completeness and effectiveness of the threat modeling process.
              </p>
            </div>
            
            <div className="border p-4 rounded-md">
              <h3 className="font-medium text-gray-800 mb-3">Validation Checklist</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Data Flow Diagram Validation</h4>
                      <p className="text-sm text-gray-600">The diagram accurately reflects the system/application being modeled, including all components, data flows, and trust boundaries.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Threat Coverage Validation</h4>
                      <p className="text-sm text-gray-600">All six STRIDE threat categories have been applied to each component of the data flow diagram with no gaps in coverage.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Mitigation Effectiveness</h4>
                      <p className="text-sm text-gray-600">Proposed mitigations are appropriate for the identified threats and will effectively reduce risk to acceptable levels.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Policy Alignment</h4>
                      <p className="text-sm text-gray-600">All mitigations are in line with organizational policies, compliance requirements, and risk management objectives.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border p-4 rounded-md bg-gray-50">
                <h3 className="font-medium text-gray-800 mb-3">Risk Assessment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Critical Threats:</span>
                    <Badge className="bg-red-500">4 identified</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">High Risk Threats:</span>
                    <Badge className="bg-orange-500">4 identified</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Medium Risk Threats:</span>
                    <Badge className="bg-yellow-500">4 identified</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Low Risk Threats:</span>
                    <Badge className="bg-blue-500">4 identified</Badge>
                  </div>
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Threats:</span>
                      <Badge className="bg-purple-600">16 identified</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border p-4 rounded-md bg-gray-50">
                <h3 className="font-medium text-gray-800 mb-3">Implementation Recommendations</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Key className="h-4 w-4 text-chart-4 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Address all critical and high risk threats in the current development cycle</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Key className="h-4 w-4 text-chart-4 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Schedule medium risk threat mitigations in the next release cycle</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Key className="h-4 w-4 text-chart-4 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Document accepted risks with business justification</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Key className="h-4 w-4 text-chart-4 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Establish ongoing threat modeling as part of the secure development lifecycle</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Key className="h-4 w-4 text-chart-4 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Set up continuous validation through regular penetration testing</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border p-4 rounded-md bg-green-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-green-800">Threat Model Approval Status</h3>
                <Badge className="bg-green-600">Approved</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span>Document Version: 1.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <Workflow className="h-4 w-4 text-gray-600" />
                  <span>Review Date: April 27, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-600" />
                  <span>Next Review: October 27, 2025</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}