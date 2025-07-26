/**
 * Deep Scan Parameters to Qualitative Analysis Proof Mapping
 * 15 Deep Scan Parameters for Quantitative Analysis (25% weight = 15 × 6.66% each)
 * CRITICAL: These scans CANNOT be performed during qualitative assessment/analysis
 * Industry professional tools required for authentic quantitative results
 */

export interface DeepScanMapping {
  parameter: string;
  weight: number; // 6.66% each
  qualitativeAreas: string[];
  validationMethod: string;
  industryTools: string[];
}

export const deepScanMappings: DeepScanMapping[] = [
  {
    parameter: "Vulnerability",
    weight: 6.66,
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Baseline Configuration"],
    validationMethod: "Quantitative CVE counts, CVSS scores, vulnerability age analysis providing measurable security posture metrics.",
    industryTools: ["Nessus", "Qualys", "Rapid7", "OpenVAS"]
  },
  {
    parameter: "Patch Management", 
    weight: 6.66,
    qualitativeAreas: ["Baseline Configuration", "Standards & Guidelines"],
    validationMethod: "Patch compliance percentages, missing patch counts, update deployment metrics with timeline analysis.",
    industryTools: ["WSUS", "SCCM", "Tanium", "Red Hat Satellite"]
  },
  {
    parameter: "Misconfigurations",
    weight: 6.66,
    qualitativeAreas: ["Baseline Configuration", "Standards & Guidelines", "Regulatory Requirements"],
    validationMethod: "Configuration audit results, CIS benchmark compliance scores, security hardening metrics.",
    industryTools: ["Nessus", "Chef InSpec", "AWS Config", "Azure Security Center"]
  },
  {
    parameter: "Malware",
    weight: 6.66,
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Relevant ACQ Tools"],
    validationMethod: "Malware detection rates, infection statistics, threat signature matching, behavioral analysis results.",
    industryTools: ["CrowdStrike", "Carbon Black", "Symantec", "Trend Micro"]
  },
  {
    parameter: "Endpoint Security",
    weight: 6.66,
    qualitativeAreas: ["Device Inventory Tracking", "Relevant ACQ Tools", "Security Risks & Vulnerabilities"],
    validationMethod: "EDR metrics, endpoint compliance scores, device security posture measurements, agent deployment statistics.",
    industryTools: ["Microsoft Defender", "SentinelOne", "CrowdStrike Falcon", "Carbon Black"]
  },
  {
    parameter: "Credential Exposure",
    weight: 6.66,
    qualitativeAreas: ["Identity Behavior & Hygiene", "Compliance Requirements"],
    validationMethod: "Exposed credential counts, dark web monitoring alerts, password policy compliance metrics.",
    industryTools: ["Have I Been Pwned", "Digital Shadows", "Recorded Future", "SpyCloud"]
  },
  {
    parameter: "IAM",
    weight: 6.66,
    qualitativeAreas: ["Identity Behavior & Hygiene", "Standards & Guidelines", "Compliance Requirements"],
    validationMethod: "IAM audit logs, access review compliance, privilege escalation detection, authentication success/failure rates.",
    industryTools: ["SailPoint", "Okta", "CyberArk", "Azure AD"]
  },
  {
    parameter: "Email Security (Phishing screening)",
    weight: 6.66,
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Security Control vs Framework"],
    validationMethod: "Phishing detection rates, click-through statistics, user behavior analysis, email threat intelligence.",
    industryTools: ["Proofpoint", "Mimecast", "Microsoft Defender for Office 365", "Barracuda"]
  },
  {
    parameter: "Email Security (Spoofing)",
    weight: 6.66,
    qualitativeAreas: ["Security Control vs Framework", "Regulatory Requirements"],
    validationMethod: "DMARC/SPF/DKIM compliance scores, spoofing attempt detection, email authentication metrics.",
    industryTools: ["Proofpoint", "Mimecast", "Agari", "Valimail"]
  },
  {
    parameter: "Cloud Security Posture",
    weight: 6.66,
    qualitativeAreas: ["Baseline Configuration", "Standards & Guidelines", "Compliance Requirements"],
    validationMethod: "CSPM compliance scores, cloud resource misconfiguration counts, security policy adherence metrics.",
    industryTools: ["Prisma Cloud", "AWS Security Hub", "Azure Security Center", "Google Cloud Security Command Center"]
  },
  {
    parameter: "Network Exposure",
    weight: 6.66,
    qualitativeAreas: ["Security Control vs Framework", "Adversarial Insight (MITRE ATT&CK)", "Baseline Configuration"],
    validationMethod: "Network vulnerability scans, open port analysis, attack surface measurements, network segmentation validation.",
    industryTools: ["Nmap", "Shodan", "Censys", "RiskIQ"]
  },
  {
    parameter: "Zero Trust",
    weight: 6.66,
    qualitativeAreas: ["Security Control vs Framework", "Baseline Configuration", "Standards & Guidelines"],
    validationMethod: "Zero Trust maturity scoring, microsegmentation effectiveness, least privilege compliance metrics.",
    industryTools: ["Zscaler", "Palo Alto Prisma", "Microsoft Zero Trust", "Okta"]
  },
  {
    parameter: "Data Security & Leakage",
    weight: 6.66,
    qualitativeAreas: ["Compliance Requirements", "Regulatory Requirements", "Information Security Management System (ISMS)"],
    validationMethod: "DLP policy violations, data classification compliance, sensitive data exposure metrics, encryption coverage analysis.",
    industryTools: ["Symantec DLP", "Forcepoint", "Microsoft Purview", "Varonis"]
  },
  {
    parameter: "Browser & Web Security",
    weight: 6.66,
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Standards & Guidelines", "Relevant ACQ Tools"],
    validationMethod: "Web application vulnerability scans, browser security policy compliance, web traffic analysis metrics.",
    industryTools: ["Burp Suite", "OWASP ZAP", "Acunetix", "Veracode"]
  },
  {
    parameter: "Dark Web Exposure",
    weight: 6.66,
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Identity Behavior & Hygiene", "Adversarial Insight (MITRE ATT&CK)"],
    validationMethod: "Dark web monitoring alerts, exposed asset discovery, threat intelligence correlation, credential compromise detection.",
    industryTools: ["Digital Shadows", "Recorded Future", "IntSights", "Flashpoint"]
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