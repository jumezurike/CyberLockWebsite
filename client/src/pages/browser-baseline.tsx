import React from 'react';
import BrowserSecurityBaseline from '../components/sos2a/browser-security-baseline';
import { Link } from 'wouter';

export default function BrowserBaselinePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-6">
        <Link href="/parameter-mapping">
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
            Back to Parameter Mapping
          </a>
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Browser Security Baseline</h1>
      <p className="mb-8 text-lg">
        Browser security is a critical component of the <span className="font-medium">Baseline Configuration</span> parameter
        within the SOS²A framework. As primary interfaces to the internet, browsers represent significant 
        attack vectors for organizational security postures.
      </p>
      
      <BrowserSecurityBaseline />
      
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Integration with SOS²A Parameters</h2>
        <p className="mb-4">
          Browser security configurations relate to multiple SOS²A parameters:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><span className="font-medium">Baseline Configuration</span> - Standardized browser settings represent core security controls</li>
          <li><span className="font-medium">Security Risks & Vulnerabilities</span> - Browsers can introduce vulnerabilities requiring mitigation</li>
          <li><span className="font-medium">Security Control vs Framework</span> - Browser policies map to requirements in frameworks like NIST and ISO</li>
          <li><span className="font-medium">Infrastructure Mode of Operation</span> - Browser distribution and management is part of endpoint infrastructure</li>
          <li><span className="font-medium">Standards & Guidelines</span> - Browser configurations should adhere to industry best practices</li>
        </ul>
      </div>
    </div>
  );
}