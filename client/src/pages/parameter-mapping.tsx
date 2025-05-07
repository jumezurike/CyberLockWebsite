import React, { useState } from 'react';
import ParameterMappingSection from '../components/sos2a/parameter-mapping-table';
import RelationshipStrengthMappingTable, { ReverseRelationshipStrengthMappingTable } from '../components/sos2a/relationship-strength-mapping-table';
import DeviceIdentitySynergyTable from '../components/sos2a/device-identity-synergy-table';

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

      <DeviceIdentitySynergyTable />

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