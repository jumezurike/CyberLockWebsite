import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RasbitaReport } from '@/lib/sos2a-types';

interface ThreatModelingProps {
  report?: RasbitaReport;
  standalone?: boolean;
}

export default function ThreatModeling({ report, standalone = false }: ThreatModelingProps) {
  // Use default data if no report provided or for standalone mode
  const useDefaultData = !report || standalone;
  
  return (
    <Card className={standalone ? "mb-6" : "mt-6"}>
      <CardHeader className="bg-gray-50">
        <CardTitle>Threat Modeling for Architecture</CardTitle>
        <CardDescription>
          Security architecture analysis using threat modeling methodology
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
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
                </ul>
              </div>
              <div className="border p-3 rounded-md bg-white">
                <h4 className="font-medium text-gray-800 mb-1">Trust Boundaries</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  <li>Network Segmentation</li>
                  <li>Authentication Zones</li>
                  <li>Data Classification Boundaries</li>
                  <li>Internal/External Interfaces</li>
                </ul>
              </div>
              <div className="border p-3 rounded-md bg-white">
                <h4 className="font-medium text-gray-800 mb-1">Data Flows</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  <li>User → Application → Database</li>
                  <li>API Integrations</li>
                  <li>Authentication Processes</li>
                  <li>Backup and Recovery Flows</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Threat Scenarios</h3>
              <div className="border p-3 rounded-md bg-red-50">
                <h4 className="font-medium text-red-800 mb-1">Critical Threats</h4>
                <ul className="list-disc pl-5 text-sm text-red-700">
                  <li>SQL Injection targeting patient data</li>
                  <li>Ransomware affecting critical systems</li>
                  <li>Privilege escalation in admin interface</li>
                </ul>
              </div>
              <div className="border p-3 rounded-md bg-orange-50">
                <h4 className="font-medium text-orange-800 mb-1">High Risk Threats</h4>
                <ul className="list-disc pl-5 text-sm text-orange-700">
                  <li>Session hijacking in user portal</li>
                  <li>Cross-site scripting in search functionality</li>
                  <li>Third-party API data exposure</li>
                </ul>
              </div>
              <div className="border p-3 rounded-md bg-yellow-50">
                <h4 className="font-medium text-yellow-800 mb-1">Medium Risk Threats</h4>
                <ul className="list-disc pl-5 text-sm text-yellow-700">
                  <li>Insecure direct object references</li>
                  <li>Sensitive data exposure in logs</li>
                  <li>Broken authentication mechanisms</li>
                </ul>
              </div>
              <div className="border p-3 rounded-md bg-blue-50">
                <h4 className="font-medium text-blue-800 mb-1">Low Risk Threats</h4>
                <ul className="list-disc pl-5 text-sm text-blue-700">
                  <li>Verbose error messages</li>
                  <li>Missing HTTP security headers</li>
                  <li>Insecure cookie attributes</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Architectural Controls</h3>
              <div className="border p-3 rounded-md bg-green-50">
                <h4 className="font-medium text-green-800 mb-1">Implemented Controls</h4>
                <ul className="list-disc pl-5 text-sm text-green-700">
                  <li>Multi-factor authentication</li>
                  <li>Data encryption at rest and in transit</li>
                  <li>Web application firewall</li>
                  <li>Network segmentation</li>
                </ul>
              </div>
              <div className="border p-3 rounded-md bg-blue-50">
                <h4 className="font-medium text-blue-800 mb-1">Recommended Controls</h4>
                <ul className="list-disc pl-5 text-sm text-blue-700">
                  <li>API gateway with rate limiting</li>
                  <li>Zero trust network architecture</li>
                  <li>Enhanced logging and monitoring</li>
                  <li>Regular penetration testing</li>
                </ul>
              </div>
              <div className="border p-3 rounded-md bg-purple-50">
                <h4 className="font-medium text-purple-800 mb-1">Attack Surface Reduction</h4>
                <ul className="list-disc pl-5 text-sm text-purple-700">
                  <li>Minimize third-party integrations</li>
                  <li>Implement least privilege access model</li>
                  <li>Disable unnecessary services and features</li>
                  <li>Regular security code reviews</li>
                </ul>
              </div>
              <div className="border p-3 rounded-md bg-gray-50">
                <h4 className="font-medium text-gray-800 mb-1">Defense in Depth Strategy</h4>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  <li>Input validation at multiple layers</li>
                  <li>Sequential security controls</li>
                  <li>Redundant security mechanisms</li>
                  <li>Isolated security zones</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}