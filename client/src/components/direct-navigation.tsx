import React, { useState } from 'react';
import { Link } from 'wouter';
import { ChevronDown, ChevronUp, Menu } from 'lucide-react';

export default function DirectNavigation() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`fixed bottom-4 right-4 z-50 bg-white shadow-lg rounded-lg border border-gray-300 transition-all duration-300 ${isExpanded ? 'p-4' : 'p-2'}`}>
      {isExpanded ? (
        // Expanded view
        <>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-700">Quick Navigation</h3>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Collapse navigation"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col space-y-2">
            <Link href="/">
              <span className="text-blue-600 hover:underline cursor-pointer">Home</span>
            </Link>
            <Link href="/rasbita">
              <span className="text-blue-600 hover:underline cursor-pointer">RASBITA Report</span>
            </Link>
            <Link href="/rasbita-governance">
              <span className="text-blue-600 hover:underline cursor-pointer">RASBITA Governance</span>
            </Link>
            <Link href="/threat-modeling">
              <span className="text-blue-600 hover:underline cursor-pointer">Threat Modeling (Overview)</span>
            </Link>
            <Link href="/threat-modeling-full">
              <span className="text-blue-600 hover:underline cursor-pointer">Threat Modeling (4-Step STRIDE)</span>
            </Link>
            <Link href="/knowledge-base">
              <span className="text-blue-600 hover:underline cursor-pointer">Knowledge Base</span>
            </Link>
            <Link href="/about-us">
              <span className="text-blue-600 hover:underline cursor-pointer">About Us</span>
            </Link>
          </div>
        </>
      ) : (
        // Collapsed view - just shows an icon
        <button 
          onClick={() => setIsExpanded(true)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/90 focus:outline-none"
          aria-label="Expand navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}