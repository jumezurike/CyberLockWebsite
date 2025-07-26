/**
 * Deep Scan Parameters to Qualitative Analysis Proof Mapping
 * 17 Extended Deep Scan Parameters for Quantitative Analysis (25% weight = 17 × 5.88% each)
 * CRITICAL: These scans CANNOT be performed during qualitative assessment/analysis
 * Industry professional tools required for authentic quantitative results
 * Evolution from original 12 combined parameters to 17 individual parameters
 * 
 * SCANNING CAPABILITY CLASSIFICATION:
 * ✔️ Directly Detectable: 12 parameters with full deep scanning capability
 * ⚠️ Limited/Indirect: 5 parameters requiring complementary tools
 */

export interface DeepScanMapping {
  parameter: string;
  weight: number; // 5.88% each (authentic weight calculation)
  scanningCapability: "direct" | "partial" | "indirect"; // Deep scanning detection level
  qualitativeAreas: string[];
  validationMethod: string;
  industryTools: string[];
  limitations?: string; // For partial/indirect capabilities
}

export const deepScanMappings: DeepScanMapping[] = [
  {
    parameter: "Vulnerability",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Baseline Configuration"],
    validationMethod: "CVE scanning, OS/app weaknesses detection with quantitative CVSS scores and vulnerability age analysis.",
    industryTools: ["Tenable", "Qualys", "Wazuh", "OpenVAS"]
  },
  {
    parameter: "Patch Mgmt", 
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Baseline Configuration", "Standards & Guidelines"],
    validationMethod: "Agent-based scans or integrations providing patch compliance percentages and missing patch counts.",
    industryTools: ["WSUS", "SCCM", "Tanium", "Red Hat Satellite"]
  },
  {
    parameter: "Misconfigurations",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Baseline Configuration", "Standards & Guidelines", "Regulatory Requirements"],
    validationMethod: "OS, AD, cloud, firewall configuration audits with CIS benchmark compliance scores.",
    industryTools: ["Nessus", "Chef InSpec", "AWS Config", "Azure Security Center"]
  },
  {
    parameter: "Malware",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Relevant ACQ Tools"],
    validationMethod: "Signature-based & behavioral scans providing malware detection rates and infection statistics.",
    industryTools: ["CrowdStrike", "SentinelOne", "Microsoft Defender XDR", "Trend Micro"]
  },
  {
    parameter: "Endpoint Security",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Device Inventory Tracking", "Relevant ACQ Tools", "Security Risks & Vulnerabilities"],
    validationMethod: "EDR/XDR integrations providing endpoint compliance scores and agent deployment statistics.",
    industryTools: ["CrowdStrike", "SentinelOne", "Microsoft Defender XDR", "Carbon Black"]
  },
  {
    parameter: "Credential Exposure",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Identity Behavior & Hygiene", "Compliance Requirements"],
    validationMethod: "Checks for reused, leaked, or weak passwords with dark web monitoring alerts.",
    industryTools: ["Have I Been Pwned", "Digital Shadows", "Recorded Future", "SpyCloud"]
  },
  {
    parameter: "IAM",
    weight: 5.88,
    scanningCapability: "partial",
    qualitativeAreas: ["Identity Behavior & Hygiene", "Standards & Guidelines", "Compliance Requirements"],
    validationMethod: "Overprivileged roles and unused accounts detection with access review compliance metrics.",
    industryTools: ["SailPoint", "Okta", "CyberArk", "Azure AD"],
    limitations: "Partial - overprivileged roles, unused accounts"
  },
  {
    parameter: "Email Security (Phishing)",
    weight: 5.88,
    scanningCapability: "partial",
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Security Control vs Framework"],
    validationMethod: "Scanning headers, links, sandboxing with phishing detection rates and click-through statistics.",
    industryTools: ["Proofpoint", "Mimecast", "Microsoft Defender for Office 365", "Barracuda"],
    limitations: "Partial - scanning headers, links, sandboxing"
  },
  {
    parameter: "Cloud Security Posture",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Baseline Configuration", "Standards & Guidelines", "Compliance Requirements"],
    validationMethod: "CSPM (Cloud Security Posture Management) tools providing compliance scores and misconfiguration counts.",
    industryTools: ["Prisma Cloud", "Wiz", "AWS Security Hub", "Azure Security Center"]
  },
  {
    parameter: "Network Exposure",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Security Control vs Framework", "Adversarial Insight (MITRE ATT&CK)", "Baseline Configuration"],
    validationMethod: "Port scans, firewall gaps, lateral movement mapping with attack surface measurements.",
    industryTools: ["Nmap", "Shodan", "Censys", "RiskIQ"]
  },
  {
    parameter: "Zero Trust",
    weight: 5.88,
    scanningCapability: "indirect",
    qualitativeAreas: ["Security Control vs Framework", "Baseline Configuration", "Standards & Guidelines"],
    validationMethod: "Architecture + policy enforcement assessment requiring complementary tools beyond scanners.",
    industryTools: ["Zscaler", "Palo Alto Prisma", "Microsoft Zero Trust", "Okta"],
    limitations: "Needs architecture + policy enforcement tools, not just scanners"
  },
  {
    parameter: "Data Security & Leakage",
    weight: 5.88,
    scanningCapability: "indirect",
    qualitativeAreas: ["Compliance Requirements", "Regulatory Requirements", "Information Security Management System (ISMS)"],
    validationMethod: "DLP (Data Loss Prevention) + endpoint visibility requiring specialized tools.",
    industryTools: ["Symantec DLP", "Forcepoint", "Microsoft Purview", "Varonis"],
    limitations: "Needs DLP (Data Loss Prevention) + endpoint visibility"
  },
  {
    parameter: "Browser & Web Security",
    weight: 5.88,
    scanningCapability: "indirect",
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Standards & Guidelines", "Relevant ACQ Tools"],
    validationMethod: "Secure browser tech or proxy inspection tools for comprehensive web security analysis.",
    industryTools: ["Burp Suite", "OWASP ZAP", "Acunetix", "Veracode"],
    limitations: "Needs secure browser tech or proxy inspection tools"
  },
  {
    parameter: "Dark Web Exposure",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Identity Behavior & Hygiene", "Adversarial Insight (MITRE ATT&CK)"],
    validationMethod: "Integrated threat intel feeds providing exposed asset discovery and credential compromise detection.",
    industryTools: ["Digital Shadows", "Recorded Future", "IntSights", "Flashpoint"]
  },
  {
    parameter: "Compliance & Frameworks",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Compliance Requirements", "Regulatory Requirements", "Standards & Guidelines"],
    validationMethod: "NIST, HIPAA, CIS, PCI-DSS reports generated through automated compliance scanning.",
    industryTools: ["ServiceNow GRC", "MetricStream", "LogicGate", "NAVEX One"]
  },
  {
    parameter: "Threat Intelligence",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Adversarial Insight (MITRE ATT&CK)", "Security Risks & Vulnerabilities", "Relevant ACQ Tools"],
    validationMethod: "Feeds for IOCs, malware, TTPs providing quantitative threat validation and MITRE ATT&CK alignment.",
    industryTools: ["Recorded Future", "ThreatConnect", "Anomali", "IBM X-Force"]
  },
  {
    parameter: "Security Awareness & Insider threat",
    weight: 5.88,
    scanningCapability: "indirect",
    qualitativeAreas: ["Identity Behavior & Hygiene", "Information Security Management System (ISMS)", "Compliance Requirements"],
    validationMethod: "Behavioral analytics and DLP triggers requiring UEBA and training LMS platforms.",
    industryTools: ["KnowBe4", "Proofpoint", "Microsoft Viva", "Forcepoint UEBA"],
    limitations: "Indirect - via behavioral analytics and DLP triggers"
  }
];

/**
 * Get deep scan parameters that validate a specific qualitative area
 * @param qualitativeArea The specific qualitative assessment area to find matching deep scan parameters for
 * @returns Array of deep scan parameters that validate the given qualitative area
 */
export function getDeepScanParametersByQualitativeArea(qualitativeArea: string): DeepScanMapping[] {
  return deepScanMappings.filter(mapping => 
    mapping.qualitativeAreas.some(area => 
      area.toLowerCase() === qualitativeArea.toLowerCase() || 
      area.toLowerCase().includes(qualitativeArea.toLowerCase())
    )
  );
}

/**
 * Generate a mapping showing which qualitative assessment areas are validated by each deep scan parameter
 * @returns Object with qualitative assessment areas as keys and arrays of deep scan parameters as values
 */
export function getQualitativeValidationMap(): Record<string, string[]> {
  const validationMap: Record<string, string[]> = {};
  
  deepScanMappings.forEach(mapping => {
    mapping.qualitativeAreas.forEach(area => {
      if (!validationMap[area]) {
        validationMap[area] = [];
      }
      validationMap[area].push(mapping.parameter);
    });
  });
  
  return validationMap;
}

/**
 * Get scanning capability summary for the 17 deep scan parameters
 * @returns Object with capability counts and recommended tool combinations
 */
export function getScanningCapabilitySummary() {
  const directCount = deepScanMappings.filter(m => m.scanningCapability === "direct").length;
  const partialCount = deepScanMappings.filter(m => m.scanningCapability === "partial").length;
  const indirectCount = deepScanMappings.filter(m => m.scanningCapability === "indirect").length;
  
  return {
    total: deepScanMappings.length,
    direct: directCount,
    partial: partialCount,
    indirect: indirectCount,
    recommendedToolCombination: [
      "Vulnerability scanner (e.g., Tenable, Qualys, Wazuh)",
      "EDR/XDR (e.g., CrowdStrike, SentinelOne, Microsoft Defender XDR)",
      "SIEM (e.g., Splunk, Wazuh, LogRhythm)",
      "CSPM/CIEM (e.g., Prisma Cloud, Wiz)",
      "Threat intelligence feeds",
      "DLP + IAM analyzers",
      "Security awareness platforms (e.g., KnowBe4)"
    ],
    fivePillarsWeight: {
      "Qualitative Assessment": "20%",
      "Quantitative Analysis": "25% (17 parameters × 5.88% each = 99.96%)",
      "RASBITA Cost-Benefit": "25%",
      "RASBITA Governance": "15%", 
      "Architecture Threat Modeling": "15%"
    }
  };
}