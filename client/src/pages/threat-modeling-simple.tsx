import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';
import { Shield, ArrowRightLeft, ChevronRight } from 'lucide-react';

export default function ThreatModelingSimple() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-purple-700 mb-2">RASBITA™ Threat Modeling</h1>
        <p className="text-gray-600">Standalone Security Architecture Threat Assessment</p>
      </div>
      
      <Card className="mb-8">
        <CardHeader className="bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>STRIDE Methodology Overview</CardTitle>
              <CardDescription>
                A comprehensive approach to identifying security threats
              </CardDescription>
            </div>
            <Badge className="bg-chart-4 hover:bg-chart-4/90">4-Step Process</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              STRIDE Threat Modeling Framework
            </h3>
            <p className="text-blue-700 text-sm">
              STRIDE is a comprehensive threat modeling framework that categorizes threats into six distinct types: 
              Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege. 
              Our four-step methodology implements this framework to systematically identify and mitigate security risks.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-red-50 p-3 rounded-md border border-red-100 text-center">
              <span className="block font-bold text-lg text-red-700 mb-1">S</span>
              <p className="text-sm text-red-600">Spoofing</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-md border border-orange-100 text-center">
              <span className="block font-bold text-lg text-orange-700 mb-1">T</span>
              <p className="text-sm text-orange-600">Tampering</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 text-center">
              <span className="block font-bold text-lg text-yellow-700 mb-1">R</span>
              <p className="text-sm text-yellow-600">Repudiation</p>
            </div>
            <div className="bg-green-50 p-3 rounded-md border border-green-100 text-center">
              <span className="block font-bold text-lg text-green-700 mb-1">I</span>
              <p className="text-sm text-green-600">Information<br/>Disclosure</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-md border border-blue-100 text-center">
              <span className="block font-bold text-lg text-blue-700 mb-1">D</span>
              <p className="text-sm text-blue-600">Denial of<br/>Service</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-md border border-purple-100 text-center">
              <span className="block font-bold text-lg text-purple-700 mb-1">E</span>
              <p className="text-sm text-purple-600">Elevation of<br/>Privilege</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-800">Our 4-Step Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border p-3 rounded-md bg-gray-50">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-chart-4 text-white flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium text-gray-800">Data Flow Diagram</h4>
                    <p className="text-xs text-gray-600">Identify components, boundaries, and data movements</p>
                  </div>
                </div>
              </div>
              <div className="border p-3 rounded-md bg-gray-50">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-chart-4 text-white flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium text-gray-800">Attack Enumeration</h4>
                    <p className="text-xs text-gray-600">Identify threats using STRIDE categories</p>
                  </div>
                </div>
              </div>
              <div className="border p-3 rounded-md bg-gray-50">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-chart-4 text-white flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium text-gray-800">Mitigation Strategies</h4>
                    <p className="text-xs text-gray-600">Address each identified risk with specific controls</p>
                  </div>
                </div>
              </div>
              <div className="border p-3 rounded-md bg-gray-50">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-chart-4 text-white flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-medium text-gray-800">Validation</h4>
                    <p className="text-xs text-gray-600">Verify mitigations align with risk management policies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Link href="/threat-modeling-full">
            <div className="flex justify-center">
              <Button className="bg-chart-4 hover:bg-chart-4/90">
                Access Full Threat Modeling Tool
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Link>
        </CardContent>
      </Card>
      
      <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-2">Why Threat Modeling Matters</h3>
        <p className="text-sm text-gray-700 mb-4">
          Threat modeling is a proactive approach to security that identifies potential threats before they can be exploited. 
          By systematically analyzing system components, data flows, and trust boundaries, organizations can implement effective 
          security controls that address specific vulnerabilities in their architecture.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-3 rounded-md bg-white">
            <h4 className="font-medium text-purple-700 mb-1">Healthcare Security Benefits</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              <li>Protection of sensitive patient data (PHI)</li>
              <li>HIPAA compliance assurance</li>
              <li>Prevention of ransomware attacks</li>
              <li>Reduced security incident costs</li>
              <li>Improved patient trust and confidence</li>
            </ul>
          </div>
          <div className="border p-3 rounded-md bg-white">
            <h4 className="font-medium text-purple-700 mb-1">When To Use This Tool</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              <li>During application design/development</li>
              <li>Before deploying new healthcare systems</li>
              <li>Following security incidents</li>
              <li>During regular security assessments</li>
              <li>When implementing third-party integrations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}