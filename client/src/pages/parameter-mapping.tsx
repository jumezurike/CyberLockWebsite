import React, { useState } from 'react';
import ParameterMappingSection from '../components/sos2a/parameter-mapping-table';
import RelationshipStrengthMappingTable, { ReverseRelationshipStrengthMappingTable } from '../components/sos2a/relationship-strength-mapping-table';

export default function ParameterMappingPage() {
  const [showRelationshipStrength, setShowRelationshipStrength] = useState(false);

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Default Parameter Mapping</h1>
        <p className="mb-6 text-gray-700">
          The mapping between Cybersecurity Core Domains and SOS²A Parameters provides three strategic values:
        </p>
        <ol className="list-decimal pl-6 mb-6 space-y-2">
          <li>It ties real-world threats (MITRE ATT&CK) to specific security controls</li>
          <li>It aligns with industry frameworks (NIST, ISO, HIPAA, DFARS, CMMC)</li>
          <li>It provides trackable, auditable information for leadership and compliance</li>
        </ol>
        
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Browser Security Baseline</h3>
          <p className="mb-3">
            Web browsers represent one of the most critical attack vectors in modern cybersecurity and require 
            specific baseline configurations as part of endpoint security.
          </p>
          <a 
            href="/browser-baseline" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            View Browser Security Controls
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14 5l7 7m0 0l-7 7m7-7H3" 
              />
            </svg>
          </a>
        </div>
        
        <div className="mb-6">
          <button 
            onClick={() => setShowRelationshipStrength(!showRelationshipStrength)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {showRelationshipStrength 
              ? "Show Standard Parameter Mapping" 
              : "Show Relationship Strength Mapping (Test)"}
          </button>
        </div>
      </div>

      {showRelationshipStrength ? (
        <div>
          <RelationshipStrengthMappingTable />
          <ReverseRelationshipStrengthMappingTable />
        </div>
      ) : (
        <ParameterMappingSection />
      )}
    </div>
  );
}