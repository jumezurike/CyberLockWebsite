import React from 'react';

interface ReverseMappingItem {
  parameter: string;
  domains: string[];
  explanation: string;
}

export default function ReverseSimplifiedMappingTable() {
  const mappingData: ReverseMappingItem[] = [
    {
      parameter: "Infrastructure Mode of Operation",
      domains: ["Network Security", "Asset Management", "Endpoint Security"],
      explanation: "Covers how infrastructure is built, segmented, and monitored (e.g., secure cloud, on-prem)."
    },
    {
      parameter: "Security Risks & Vulnerabilities",
      domains: ["Access Control", "Incident Response", "Application Security", "Endpoint Security"],
      explanation: "Risk is reduced by limiting access, preparing for incidents, securing code, and hardening endpoints."
    },
    {
      parameter: "Baseline Configuration",
      domains: ["Data Protection", "Network Security", "Endpoint Security"],
      explanation: "Default security settings (firewalls, encryption, device hardening) to reduce exposure."
    },
    {
      parameter: "Security Control vs Framework",
      domains: ["Application Security", "Security Governance"],
      explanation: "Connects technical controls to NIST, ISO, or SOC 2 frameworks; shows maturity."
    },
    {
      parameter: "Compliance Requirements",
      domains: ["Compliance Management", "Third-Party Management"],
      explanation: "Ensures operational processes meet laws and industry frameworks (HIPAA, PCI-DSS, CMMC, etc.)."
    },
    {
      parameter: "Regulatory Requirements",
      domains: ["Compliance Management", "Third-Party Management"],
      explanation: "Focuses on actual regulations (e.g., HIPAA, CCPA, GDPR, DFARS) and their legal implications."
    },
    {
      parameter: "Standards & Guidelines",
      domains: ["Data Protection", "Application Security"],
      explanation: "Aligns with security best practices like OWASP, CIS, ISO 27002, NIST 800-171."
    },
    {
      parameter: "Relevant ACQ Tools",
      domains: ["Asset Management", "Security Governance", "Endpoint Security"],
      explanation: "Ensures tools are being tracked, approved, and governed (e.g., vulnerability scanners, EDR, endpoint protection)."
    },
    {
      parameter: "Adversarial Insight (MITRE ATT&CK)",
      domains: ["Access Control", "Security Awareness", "Incident Response"],
      explanation: "Maps real attacker behavior to defenses, phishing simulation, lateral movement detection."
    },
    {
      parameter: "Information Security Management System (ISMS)",
      domains: ["Security Governance", "Security Awareness", "Incident Response"],
      explanation: "Governance system that defines policies, risk posture, education, and monitoring for security."
    }
  ];

  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">SOS²A Parameters → Cybersecurity Core Domains</h2>
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
                  <div key={i} className="mb-1 last:mb-0">- {domain}</div>
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