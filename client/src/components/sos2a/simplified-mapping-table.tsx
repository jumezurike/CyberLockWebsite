import React from 'react';

interface MappingItem {
  domain: string;
  parameters: string[];
  explanation: string;
}

export default function SimplifiedMappingTable() {
  const mappingData: MappingItem[] = [
    {
      domain: "Access Control",
      parameters: ["Security Risks & Vulnerabilities", "Adversarial Insight (MITRE ATT&CK)"],
      explanation: "Controls access to reduce risk of privilege misuse, phishing, lateral movement."
    },
    {
      domain: "Data Protection",
      parameters: ["Baseline Configuration", "Standards & Guidelines"],
      explanation: "Enforces encryption, data classification, and storage/transmission protections."
    },
    {
      domain: "Security Awareness",
      parameters: ["Adversarial Insight (MITRE ATT&CK)", "Information Security Management System (ISMS)"],
      explanation: "Addresses social engineering and insider threats through training and governance."
    },
    {
      domain: "Incident Response",
      parameters: ["Security Risks & Vulnerabilities", "ISMS"],
      explanation: "Helps detect, respond to, and recover from cyber events; tracked under management systems."
    },
    {
      domain: "Network Security",
      parameters: ["Infrastructure Mode of Operation", "Baseline Configuration"],
      explanation: "Involves firewall, segmentation, and monitoring tied to secure network infrastructure setup."
    },
    {
      domain: "Application Security",
      parameters: ["Security Control vs Framework", "Standards & Guidelines"],
      explanation: "Aligns secure code and vulnerability scanning with OWASP, NIST, etc."
    },
    {
      domain: "Third-Party Management",
      parameters: ["Regulatory Requirements", "Compliance Requirements"],
      explanation: "Ensures vendors meet necessary laws and compliance frameworks like HIPAA, SOC 2, ISO."
    },
    {
      domain: "Asset Management",
      parameters: ["Relevant ACQ Tools", "Infrastructure Mode of Operation"],
      explanation: "Tracks hardware/software across the environment and uses asset discovery tools."
    },
    {
      domain: "Security Governance",
      parameters: ["ISMS", "Security Control vs Framework"],
      explanation: "Ensures policy, leadership, and risk strategy align with control frameworks (e.g., NIST, ISO)."
    },
    {
      domain: "Compliance Management",
      parameters: ["Compliance Requirements", "Regulatory Requirements"],
      explanation: "Ensures controls meet HIPAA, GDPR, CMMC, etc., and are documented and auditable."
    }
  ];

  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Cybersecurity Domains → SOS²A Parameters</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border text-left w-1/5">Cybersecurity Domain</th>
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
                  <div key={i} className="mb-1 last:mb-0">{param}</div>
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