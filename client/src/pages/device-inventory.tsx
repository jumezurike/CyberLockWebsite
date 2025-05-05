import React from 'react';
import { Link } from 'wouter';
import BrowserInventoryFormNew from '../components/sos2a/browser-inventory-form-new';

export default function DeviceInventoryPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-6">
        <Link href="/browser-baseline">
          <a className="text-blue-600 hover:underline flex items-center">
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
            Back to Browser Security Baseline
          </a>
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Device Inventory Tracking</h1>
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
              <div className="text-blue-600 font-semibold mb-2">Security Control Coverage</div>
              <p className="text-gray-700 text-sm">
                Ensures security controls are applied to all devices, leaving no gaps in your security posture.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Browser Device Inventory</h2>
        <p className="text-gray-700 mb-4">
          Web browsers represent a significant security risk as they directly connect your internal systems to the 
          internet. Complete the inventory below to document all devices running web browsers in your organization.
        </p>
        
        <div className="mb-6">
          <BrowserInventoryFormNew />
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-8 mt-8">
        <h2 className="text-xl font-semibold mb-4">Device Inventory Parameter</h2>
        <p className="text-gray-700 mb-4">
          Device Inventory is now included as the 11th Default Parameter in the SOS²A assessment framework.
          This parameter captures endpoint assets, network components, IoT devices, and other hardware that
          may introduce security risks to your organization.
        </p>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-start">
            <span className="bg-blue-100 text-blue-800 font-medium mr-3 px-2.5 py-0.5 rounded-full">11</span>
            <div>
              <h3 className="font-semibold text-lg">Device Inventory</h3>
              <p className="text-gray-700 mt-1">
                Comprehensive tracking of hardware assets, their configurations, and security implications.
                This parameter connects with Baseline Configuration to ensure standardized security controls
                are applied across all devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}