import React from 'react';

interface MappingItem {
  domain: string;
  parameters: string[];
  explanation: string;
}

export default function SimplifiedMappingTable() {
  const mappingData: MappingItem[] = [
    {
      domain: "Network Security",
      parameters: ["Infrastructure Mode of Operation", "Baseline Configuration"],
      explanation: "Covers how infrastructure is built, segmented, and monitored (e.g., secure cloud, on-prem)."
    },
    {
      domain: "Asset Management",
      parameters: ["Infrastructure Mode of Operation", "Device Inventory Tracking"],
      explanation: "Maintains awareness of all devices (OS, browsers, mobile, IoT) to ensure complete security coverage."
    },
    {
      domain: "Endpoint Security",
      parameters: ["Baseline Configuration", "Security Risks & Vulnerabilities", "Infrastructure Mode of Operation"],
      explanation: "Protects devices with EDR, patching, configuration management, and access controls."
    },
    {
      domain: "Access Control",
      parameters: ["Security Risks & Vulnerabilities", "Adversarial Insight (MITRE ATT&CK)"],
      explanation: "Controls access to reduce risk of privilege misuse, phishing, lateral movement."
    },
    {
      domain: "Identity & Access Management (IAM)",
      parameters: ["Identity, Behavior & Hygiene", "Adversarial Insight (MITRE ATT&CK)"],
      explanation: "Monitors user identities and behaviors to enforce least privilege and detect anomalies."
    },
    {
      domain: "Incident Response",
      parameters: ["Security Risks & Vulnerabilities", "ISMS", "Adversarial Insight (MITRE ATT&CK)"],
      explanation: "Helps detect, respond to, and recover from cyber events; tracked under management systems."
    },
    {
      domain: "Application Security",
      parameters: ["Security Control vs Framework", "Standards & Guidelines"],
      explanation: "Aligns secure code and vulnerability scanning with OWASP, NIST, etc."
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
      domain: "Security Governance",
      parameters: ["ISMS", "Security Control vs Framework"],
      explanation: "Ensures policy, leadership, and risk strategy align with control frameworks (e.g., NIST, ISO, DFARS)."
    },
    {
      domain: "Third-Party Management",
      parameters: ["Regulatory Requirements", "Compliance Requirements"],
      explanation: "Ensures vendors meet necessary laws and compliance frameworks like HIPAA, SOC 2, ISO."
    },
    {
      domain: "Compliance Management",
      parameters: ["Compliance Requirements", "Regulatory Requirements"],
      explanation: "Ensures controls meet HIPAA, GDPR, DFARS, CMMC, etc., and are documented and auditable."
    }
  ];

  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Cybersecurity Core Domains → SOS²A Parameters</h2>
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
              <td className="px-4 py-2 border font-medium">{item.domain}</td>
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