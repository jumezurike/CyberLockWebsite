import React from 'react';
import { Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComprehensiveDeviceInventory from '../components/device-inventory/comprehensive-device-inventory';
import BrowserInventoryFormNew from '../components/sos2a/browser-inventory-form-new';
import DeviceInventoryTemplate from '../components/device-inventory/device-inventory-template';
import ExactMatchInventory from '../components/device-inventory/exact-match-inventory';

export default function DeviceInventoryPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Link href="/dashboard" className="text-blue-600 hover:underline flex items-center mb-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Device Inventory Tracking</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 font-medium mr-2 px-2.5 py-0.5 rounded-full">5</span>
          <div className="text-sm text-gray-600">
            SOS²A Framework Parameter
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-6">
        Tracking your organization's hardware inventory is a foundational component of effective cybersecurity. 
        This comprehensive inventory helps identify vulnerabilities, prioritize security controls, and ensure 
        complete coverage of your digital assets.
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-3">Why Device Inventory Matters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <div className="text-blue-600 font-semibold mb-2">Risk Assessment</div>
            <p className="text-gray-700 text-sm">
              A complete device inventory enables accurate risk assessment by identifying all potential attack vectors.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="text-blue-600 font-semibold mb-2">Compliance Requirements</div>
            <p className="text-gray-700 text-sm">
              Most security frameworks (NIST, ISO, HIPAA, DFARS, CMMC) require maintaining accurate hardware inventories.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="text-blue-600 font-semibold mb-2">SOC Monitoring Integration</div>
            <p className="text-gray-700 text-sm">
              Effective device inventory is essential for comprehensive SOC monitoring and ensuring complete security visibility.
            </p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="sections" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="sections">Detailed Device Inventory</TabsTrigger>
          <TabsTrigger value="comprehensive">Dashboard View</TabsTrigger>
          <TabsTrigger value="browser">Browser Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sections" className="space-y-6">
          {/* Add template download component */}
          <DeviceInventoryTemplate />
          
          <div className="bg-white rounded-lg">
            <ExactMatchInventory />
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-start">
              <span className="bg-blue-100 text-blue-800 font-medium mr-3 px-2.5 py-0.5 rounded-full">Info</span>
              <div>
                <h3 className="font-semibold text-lg">Why Device Categories Matter</h3>
                <p className="text-gray-700 mt-1">
                  Our device inventory form follows the key categories identified in the NIST Cybersecurity Framework 
                  for complete device tracking. Each section serves a specific purpose in managing the security 
                  lifecycle of devices in your organization.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="comprehensive" className="space-y-6">
          {/* Add template download component */}
          <DeviceInventoryTemplate />
          
          <div className="bg-white rounded-lg">
            <ComprehensiveDeviceInventory />
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-start">
              <span className="bg-blue-100 text-blue-800 font-medium mr-3 px-2.5 py-0.5 rounded-full">Info</span>
              <div>
                <h3 className="font-semibold text-lg">Device Inventory & Identity Connection</h3>
                <p className="text-gray-700 mt-1">
                  Device inventory is a core component of the DNA (Data Nuclear Aggregate) framework. Each device is linked 
                  to an identity, creating a secure and verifiable mapping between users and their devices. This mapping 
                  enables improved security monitoring and more accurate threat detection based on behavioral analytics.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="browser">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Browser Device Inventory</h2>
            <p className="text-gray-700 mb-4">
              Web browsers represent a significant security risk as they directly connect your internal systems to the 
              internet. Complete the inventory below to document all devices running web browsers in your organization.
            </p>
            
            <div className="mb-6">
              <BrowserInventoryFormNew />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="border-t border-gray-200 pt-8 mt-8">
        <h2 className="text-xl font-semibold mb-4">6-Month Assessment Timeline</h2>
        <p className="text-gray-700 mb-4">
          The comprehensive assessment requires tracking devices over a 6-month period. This evaluation captures 
          how security is improved over time, with special focus on closing monitoring gaps and ensuring all 
          critical devices are properly protected.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="font-medium text-green-800 mb-1">Month 1</div>
            <div className="text-sm text-gray-700">Initial device inventory and baseline establishment</div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="font-medium text-blue-800 mb-1">Month 2</div>
            <div className="text-sm text-gray-700">Deploy monitoring agents and verify coverage</div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="font-medium text-gray-800 mb-1">Month 3</div>
            <div className="text-sm text-gray-700">Apply security patches and configuration standards</div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="font-medium text-gray-800 mb-1">Month 4</div>
            <div className="text-sm text-gray-700">Verify security improvements and monitoring effectiveness</div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="font-medium text-gray-800 mb-1">Month 5</div>
            <div className="text-sm text-gray-700">Refine security controls based on SOC data</div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="font-medium text-gray-800 mb-1">Month 6</div>
            <div className="text-sm text-gray-700">Final assessment and documentation of improvements</div>
          </div>
        </div>
      </div>
    </div>
  );
}