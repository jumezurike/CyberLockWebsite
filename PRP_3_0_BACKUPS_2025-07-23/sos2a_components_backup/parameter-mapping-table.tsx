import React from 'react';
import { securityParameterMappings } from '@/lib/parameter-mapping';
import { reverseParameterMappings } from '@/lib/reverse-parameter-mapping';
import SimplifiedMappingTable from './simplified-mapping-table';
import ReverseSimplifiedMappingTable from './reverse-simplified-mapping-table';

interface MappingTableProps {
  view: 'security-to-sos' | 'sos-to-security';
}

export function ParameterMappingTable({ view }: MappingTableProps) {
  // Convert the mappings to a table format
  const getSecurityToSosTable = () => {
    // Create a map to hold all relevance values
    const mappingTable: Record<string, Record<string, string>> = {};
    
    // Extract all unique SOS parameters
    const sosParameters = new Set<string>();
    securityParameterMappings.forEach(mapping => {
      mapping.frameworkMappings.forEach(fwMapping => {
        sosParameters.add(fwMapping.parameterName);
      });
    });
    
    // Initialize table structure
    securityParameterMappings.forEach(mapping => {
      mappingTable[mapping.securityParameter] = {};
      Array.from(sosParameters).forEach(param => {
        mappingTable[mapping.securityParameter][param] = '-';
      });
    });
    
    // Fill in relevance values
    securityParameterMappings.forEach(mapping => {
      mapping.frameworkMappings.forEach(fwMapping => {
        mappingTable[mapping.securityParameter][fwMapping.parameterName] = fwMapping.relevance;
      });
    });
    
    return {
      sosParameters: Array.from(sosParameters),
      mappingTable
    };
  };
  
  const getSosToSecurityTable = () => {
    // Create a map to hold all relevance values
    const mappingTable: Record<string, Record<string, string>> = {};
    
    // Extract all unique security parameters
    const securityParameters = new Set<string>();
    reverseParameterMappings.forEach(mapping => {
      mapping.securityDomainMappings.forEach(secMapping => {
        securityParameters.add(secMapping.securityParameter);
      });
    });
    
    // Initialize table structure
    reverseParameterMappings.forEach(mapping => {
      mappingTable[mapping.sosParameter] = {};
      Array.from(securityParameters).forEach(param => {
        mappingTable[mapping.sosParameter][param] = '-';
      });
    });
    
    // Fill in relevance values
    reverseParameterMappings.forEach(mapping => {
      mapping.securityDomainMappings.forEach(secMapping => {
        mappingTable[mapping.sosParameter][secMapping.securityParameter] = secMapping.relevance;
      });
    });
    
    return {
      securityParameters: Array.from(securityParameters),
      mappingTable
    };
  };

  const getRelevanceColorClass = (relevance: string) => {
    switch(relevance) {
      case 'critical':
        return 'bg-red-700 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-400';
      case 'low':
        return 'bg-blue-200';
      default:
        return 'bg-gray-100';
    }
  };
  
  const getRelevanceLabel = (relevance: string) => {
    switch(relevance) {
      case 'critical':
        return 'C';
      case 'high':
        return 'H';
      case 'medium':
        return 'M';
      case 'low':
        return 'L';
      default:
        return '-';
    }
  };

  // Format security parameter for display
  const formatSecurityParam = (param: string) => {
    // Add spaces before capital letters and capitalize the first letter
    return param
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  if (view === 'security-to-sos') {
    const { sosParameters, mappingTable } = getSecurityToSosTable();
    
    return (
      <div className="overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Cybersecurity Core Domains to SOS²A Parameters Mapping</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="sticky left-0 bg-gray-100 px-4 py-2 border">Cybersecurity Core Domain</th>
              {sosParameters.map((param, index) => (
                <th key={index} className="px-4 py-2 border whitespace-nowrap text-sm">{param}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(mappingTable).map(([secParam, mappings], rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="sticky left-0 bg-inherit px-4 py-2 border font-medium whitespace-nowrap">
                  {formatSecurityParam(secParam)}
                </td>
                {sosParameters.map((sosParam, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={`px-4 py-2 border text-center ${getRelevanceColorClass(mappings[sosParam])}`}
                  >
                    {getRelevanceLabel(mappings[sosParam])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-6 h-6 mr-2 bg-red-700 text-white flex items-center justify-center">C</div>
            <span>Critical</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 mr-2 bg-orange-500 text-white flex items-center justify-center">H</div>
            <span>High</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 mr-2 bg-yellow-400 flex items-center justify-center">M</div>
            <span>Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 mr-2 bg-blue-200 flex items-center justify-center">L</div>
            <span>Low</span>
          </div>
        </div>
      </div>
    );
  } else {
    const { securityParameters, mappingTable } = getSosToSecurityTable();
    
    return (
      <div className="overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">SOS²A Parameters to Cybersecurity Core Domains Mapping</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="sticky left-0 bg-gray-100 px-4 py-2 border">SOS²A Parameter</th>
              {securityParameters.map((param, index) => (
                <th key={index} className="px-4 py-2 border whitespace-nowrap text-sm">
                  {formatSecurityParam(param)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(mappingTable).map(([sosParam, mappings], rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="sticky left-0 bg-inherit px-4 py-2 border font-medium whitespace-nowrap">
                  {sosParam}
                </td>
                {securityParameters.map((secParam, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={`px-4 py-2 border text-center ${getRelevanceColorClass(mappings[secParam])}`}
                  >
                    {getRelevanceLabel(mappings[secParam])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-6 h-6 mr-2 bg-red-700 text-white flex items-center justify-center">C</div>
            <span>Critical</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 mr-2 bg-orange-500 text-white flex items-center justify-center">H</div>
            <span>High</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 mr-2 bg-yellow-400 flex items-center justify-center">M</div>
            <span>Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 mr-2 bg-blue-200 flex items-center justify-center">L</div>
            <span>Low</span>
          </div>
        </div>
      </div>
    );
  }
}

export default function ParameterMappingSection() {
  const [activeView, setActiveView] = React.useState<'security-to-sos' | 'sos-to-security'>('security-to-sos');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Default Parameter Mapping</h1>
      
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveView('security-to-sos')}
            className={`px-4 py-2 rounded ${
              activeView === 'security-to-sos' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200'
            }`}
          >
            Cybersecurity Core Domains → SOS²A
          </button>
          <button
            onClick={() => setActiveView('sos-to-security')}
            className={`px-4 py-2 rounded ${
              activeView === 'sos-to-security' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200'
            }`}
          >
            SOS²A → Cybersecurity Core Domains
          </button>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <ParameterMappingTable view={activeView} />
        </div>
      </div>
      
      <div className="mb-8">
        <SimplifiedMappingTable />
      </div>

      <div className="mb-8">
        <ReverseSimplifiedMappingTable />
      </div>

      <div className="prose max-w-none">
        <h2>Understanding the Mapping</h2>
        <p>
          This table shows the relationship between the 12 SOS²A parameters and the 12 cybersecurity 
          core domains used in gap analysis. The relevance level indicates the strength of the relationship 
          between each pair of parameters.
        </p>
        
        <h3>Relevance Levels</h3>
        <ul>
          <li><strong>Critical (C)</strong>: Essential relationship with fundamental impact</li>
          <li><strong>High (H)</strong>: Strong relationship with significant impact</li>
          <li><strong>Medium (M)</strong>: Moderate relationship with notable impact</li>
          <li><strong>Low (L)</strong>: Minor relationship with limited impact</li>
        </ul>
        
        <h3>How to Use This Mapping</h3>
        <p>
          Use this mapping to understand how cybersecurity core domains and assessment parameters interact:
        </p>
        <ul>
          <li>
            <strong>Cybersecurity Core Domains → SOS²A view</strong>: See how each cybersecurity core domain is evaluated across 
            the SOS²A parameters. This helps understand the assessment coverage for 
            each security area.
          </li>
          <li>
            <strong>SOS²A → Cybersecurity Core Domains view</strong>: See which cybersecurity core domains are most impacted by 
            each assessment parameter. This helps prioritize improvements based on assessment findings.
          </li>
        </ul>
        
        <p>
          This multi-dimensional mapping creates a comprehensive framework for security assessment, 
          ensuring that all critical relationships between cybersecurity core domains and assessment parameters 
          are properly addressed.
          
          This mapping helps SOS²A automate reporting and analysis across technical and administrative layers. 
          It ensures that your cybersecurity core domains are:
          
          • Tied to real-world threats (MITRE)
          • Aligned to frameworks (NIST, ISO, HIPAA, DFARS, CMMC)
          • Tracked and auditable for leadership and compliance
        </p>
      </div>
    </div>
  );
}