import React from 'react';

// Define relationship strength type
type RelationshipStrength = 'Critical' | 'High' | 'Medium' | 'Low';

// Helper function to ensure type safety
const asRelationshipStrength = (value: string): RelationshipStrength => {
  if (value === 'Critical' || value === 'High' || value === 'Medium' || value === 'Low') {
    return value as RelationshipStrength;
  }
  return 'Medium'; // Default fallback
};

// Define interface with relationship strength
interface DomainParameterMapping {
  domain: string;
  parameters: {
    name: string;
    strength: RelationshipStrength;
  }[];
  explanation: string;
}

// Use different colors based on strength
const getStrengthColor = (strength: RelationshipStrength): string => {
  switch (strength) {
    case 'Critical':
      return 'bg-red-100 text-red-800';
    case 'High':
      return 'bg-green-100 text-green-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'Low':
      return 'bg-gray-100 text-gray-800';
    default:
      return '';
  }
};

export default function RelationshipStrengthMappingTable() {
  // Sample data with relationship strengths
  const mappingData: DomainParameterMapping[] = [
    {
      domain: "Security Awareness",
      parameters: [
        { name: "Information Security Management System (ISMS)", strength: 'High' },
        { name: "Adversarial Insight (MITRE ATT&CK)", strength: 'Medium' },
        { name: "Security Risks & Vulnerabilities", strength: 'Low' }
      ],
      explanation: "Educates users on security threats, policies, and safe practices."
    },
    {
      domain: "Asset Management",
      parameters: [
        { name: "Baseline Configuration", strength: 'High' },
        { name: "Infrastructure Mode of Operation", strength: 'High' },
        { name: "Relevant ACQ Tools", strength: 'Medium' }
      ],
      explanation: "Tracks hardware/software inventory, ownership, and lifecycle management."
    },
    {
      domain: "Security Governance",
      parameters: [
        { name: "Information Security Management System (ISMS)", strength: 'High' },
        { name: "Security Control vs Framework", strength: 'Medium' },
        { name: "Relevant ACQ Tools", strength: 'Low' }
      ],
      explanation: "Establishes security policies, standards, and compliance oversight."
    },
    {
      domain: "Compliance Management",
      parameters: [
        { name: "Compliance Requirements", strength: 'High' },
        { name: "Regulatory Requirements", strength: 'High' },
        { name: "Security Control vs Framework", strength: 'Medium' }
      ],
      explanation: "Ensures controls meet HIPAA, GDPR, DFARS, CMMC, etc., and are documented and auditable."
    },
    {
      domain: "Identity & Access Management (IAM)",
      parameters: [
        { name: "Baseline Configuration", strength: 'High' },
        { name: "Security Risks & Vulnerabilities", strength: 'Medium' }
      ],
      explanation: "Manages digital identities, authentication, and authorization across systems; ensures proper identity lifecycle management."
    },
    {
      domain: "Access Control",
      parameters: [
        { name: "Baseline Configuration", strength: 'High' },
        { name: "Security Risks & Vulnerabilities", strength: 'High' },
        { name: "Adversarial Insight (MITRE ATT&CK)", strength: 'Medium' }
      ],
      explanation: "Manages how identities interact with systems based on least privilege principles."
    },
    {
      domain: "Network Security",
      parameters: [
        { name: "Infrastructure Mode of Operation", strength: 'High' },
        { name: "Security Risks & Vulnerabilities", strength: 'High' },
        { name: "Baseline Configuration", strength: 'Medium' }
      ],
      explanation: "Protects network infrastructure through segmentation, monitoring, and secure architecture."
    },
    {
      domain: "Data Protection",
      parameters: [
        { name: "Baseline Configuration", strength: 'High' },
        { name: "Standards & Guidelines", strength: 'Medium' },
        { name: "Regulatory Requirements", strength: 'Medium' }
      ],
      explanation: "Safeguards sensitive information through encryption, classification, and access restrictions."
    },
    {
      domain: "Application Security",
      parameters: [
        { name: "Security Risks & Vulnerabilities", strength: 'High' },
        { name: "Standards & Guidelines", strength: 'High' },
        { name: "Baseline Configuration", strength: 'Medium' }
      ],
      explanation: "Ensures software is developed securely using OWASP principles and secure coding."
    },
    {
      domain: "Endpoint Security",
      parameters: [
        { name: "Baseline Configuration", strength: 'High' },
        { name: "Security Risks & Vulnerabilities", strength: 'Medium' },
        { name: "Infrastructure Mode of Operation", strength: 'Medium' }
      ],
      explanation: "Protects devices with EDR, patching, and configuration management."
    },
    {
      domain: "Incident Response",
      parameters: [
        { name: "Security Risks & Vulnerabilities", strength: 'High' },
        { name: "Adversarial Insight (MITRE ATT&CK)", strength: 'High' },
        { name: "Information Security Management System (ISMS)", strength: 'Medium' }
      ],
      explanation: "Guides security breach detection, response, and recovery procedures."
    },
    {
      domain: "Third-Party Management",
      parameters: [
        { name: "Regulatory Requirements", strength: 'High' },
        { name: "Compliance Requirements", strength: 'High' },
        { name: "Security Control vs Framework", strength: 'Medium' },
        { name: "Information Security Management System (ISMS)", strength: 'Medium' }
      ],
      explanation: "Manages vendor/partner risk through assessments, contractual requirements, and controls."
    }
  ];

  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Cybersecurity Core Domains → SOS²A Parameters (with Relationship Strength)</h2>
      <div className="mb-3 flex items-center gap-4">
        <div className="text-sm">Relationship Strength:</div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">Critical</span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">High</span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">Low</span>
        </div>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border text-left w-1/5">Cybersecurity Core Domain</th>
            <th className="px-4 py-2 border text-left w-2/5">Mapped SOS²A Parameters</th>
            <th className="px-4 py-2 border text-left w-2/5">Explanation</th>
          </tr>
        </thead>
        <tbody>
          {mappingData.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="px-4 py-2 border font-medium">{index + 1}. {item.domain}</td>
              <td className="px-4 py-2 border">
                {item.parameters.map((param, i) => (
                  <div key={i} className="mb-1 last:mb-0 flex items-center">
                    <span className={`mr-2 px-2 py-0.5 rounded text-xs font-medium ${getStrengthColor(param.strength)}`}>
                      {param.strength}
                    </span>
                    {param.name}
                  </div>
                ))}
              </td>
              <td className="px-4 py-2 border">{item.explanation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Define interface for reverse mapping
interface ParameterDomainMapping {
  parameter: string;
  domains: {
    name: string;
    strength: RelationshipStrength;
  }[];
  explanation: string;
}

// Reverse mapping table with relationship strengths
export function ReverseRelationshipStrengthMappingTable() {
  // Sample data with relationship strengths
  const mappingData: ParameterDomainMapping[] = [
    {
      parameter: "Infrastructure Mode of Operation",
      domains: [
        { name: "Network Security", strength: 'High' },
        { name: "Endpoint Security", strength: 'Medium' },
        { name: "Asset Management", strength: 'Medium' }
      ],
      explanation: "How systems and networks are architected, deployed, and maintained."
    },
    {
      parameter: "Security Risks & Vulnerabilities",
      domains: [
        { name: "Access Control", strength: 'High' },
        { name: "Application Security", strength: 'High' },
        { name: "Incident Response", strength: 'High' },
        { name: "Security Awareness", strength: 'Low' }
      ],
      explanation: "Technical weaknesses that could be exploited by attackers, like outdated software."
    },
    {
      parameter: "Baseline Configuration",
      domains: [
        { name: "Access Control", strength: 'High' },
        { name: "Network Security", strength: 'Medium' },
        { name: "Data Protection", strength: 'High' },
        { name: "Application Security", strength: 'Medium' },
        { name: "Endpoint Security", strength: 'High' },
        { name: "Asset Management", strength: 'High' },
        { name: "Identity & Access Management (IAM)", strength: 'High' }
      ],
      explanation: "Standardized security settings for systems, networks, and applications."
    },
    {
      parameter: "Security Control vs Framework",
      domains: [
        { name: "Security Governance", strength: 'Medium' },
        { name: "Third-Party Management", strength: 'Medium' },
        { name: "Compliance Management", strength: 'Medium' }
      ],
      explanation: "Maps organizations' measures against industry frameworks (NIST, HIPAA, etc.)."
    },
    {
      parameter: "Compliance Requirements",
      domains: [
        { name: "Compliance Management", strength: 'High' }, 
        { name: "Third-Party Management", strength: 'High' }
      ],
      explanation: "Ensures operational processes meet laws and industry frameworks (HIPAA, PCI-DSS, CMMC, etc.)."
    },
    {
      parameter: "Regulatory Requirements",
      domains: [
        { name: "Compliance Management", strength: 'High' }, 
        { name: "Third-Party Management", strength: 'High' },
        { name: "Data Protection", strength: 'Medium' }
      ],
      explanation: "Focuses on actual regulations (e.g., HIPAA, CCPA, GDPR, DFARS) and their legal implications."
    },
    {
      parameter: "Standards & Guidelines",
      domains: [
        { name: "Data Protection", strength: 'Medium' }, 
        { name: "Application Security", strength: 'High' }
      ],
      explanation: "Aligns with security best practices like OWASP, CIS, ISO 27002, NIST 800-171."
    },
    {
      parameter: "Relevant ACQ Tools",
      domains: [
        { name: "Asset Management", strength: 'Medium' }, 
        { name: "Security Governance", strength: 'Low' }
      ],
      explanation: "Ensures tools are being tracked, approved, and governed (e.g., vulnerability scanners, EDR)."
    },
    {
      parameter: "Adversarial Insight (MITRE ATT&CK)",
      domains: [
        { name: "Access Control", strength: 'Medium' }, 
        { name: "Security Awareness", strength: 'Medium' }, 
        { name: "Incident Response", strength: 'High' }
      ],
      explanation: "Maps real attacker behavior to defenses, phishing simulation, lateral movement detection."
    },
    {
      parameter: "Information Security Management System (ISMS)",
      domains: [
        { name: "Security Governance", strength: 'High' }, 
        { name: "Security Awareness", strength: 'High' }, 
        { name: "Incident Response", strength: 'Medium' },
        { name: "Third-Party Management", strength: 'Medium' }
      ],
      explanation: "Governance system that defines policies, risk posture, education, and monitoring for security."
    }
  ];

  return (
    <div className="w-full overflow-x-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">SOS²A Parameters → Cybersecurity Core Domains (with Relationship Strength)</h2>
      <div className="mb-3 flex items-center gap-4">
        <div className="text-sm">Relationship Strength:</div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">Critical</span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">High</span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">Low</span>
        </div>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border text-left w-1/5">SOS²A Parameter</th>
            <th className="px-4 py-2 border text-left w-2/5">Mapped Cybersecurity Core Domains</th>
            <th className="px-4 py-2 border text-left w-2/5">Explanation</th>
          </tr>
        </thead>
        <tbody>
          {mappingData.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="px-4 py-2 border font-medium">{index + 1}. {item.parameter}</td>
              <td className="px-4 py-2 border">
                {item.domains.map((domain, i) => (
                  <div key={i} className="mb-1 last:mb-0 flex items-center">
                    <span className={`mr-2 px-2 py-0.5 rounded text-xs font-medium ${getStrengthColor(asRelationshipStrength(domain.strength))}`}>
                      {domain.strength}
                    </span>
                    {domain.name}
                  </div>
                ))}
              </td>
              <td className="px-4 py-2 border">{item.explanation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}