/**
 * Deep Scan Parameters to Qualitative Analysis Proof Mapping
 * 17 Extended Deep Scan Parameters for Quantitative Analysis (25% weight = 17 × ~1.47% each)
 * CRITICAL: These scans CANNOT be performed during qualitative assessment/analysis
 * Industry professional tools required for authentic quantitative results
 * Evolution from original 12 combined parameters to 17 individual parameters
 */

export interface DeepScanMapping {
  parameter: string;
  weight: number; // ~1.47% each (25% ÷ 17 parameters)
  qualitativeAreas: string[];
  validationMethod: string;
  industryTools: string[];
}

export const deepScanMappings: DeepScanMapping[] = [
  {
    parameter: "Vulnerability",
    weight: 1.47,
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Baseline Configuration"],
    validationMethod: "Quantitative CVE counts, CVSS scores, vulnerability age analysis providing measurable security posture metrics.",
    industryTools: ["Nessus", "Qualys", "Rapid7", "OpenVAS"]
  },
  {
    parameter: "Patch Mgmt", 
    weight: 1.47,
    qualitativeAreas: ["Baseline Configuration", "Standards & Guidelines"],
    validationMethod: "Patch compliance percentages, missing patch counts, update deployment metrics with timeline analysis.",
    industryTools: ["WSUS", "SCCM", "Tanium", "Red Hat Satellite"]
  },
  {
    parameter: "Misconfigurations",
    weight: 1.47,
    qualitativeAreas: ["Baseline Configuration", "Standards & Guidelines", "Regulatory Requirements"],
    validationMethod: "Configuration audit results, CIS benchmark compliance scores, security hardening metrics.",
    industryTools: ["Nessus", "Chef InSpec", "AWS Config", "Azure Security Center"]
  },
  {
    parameter: "Malware",
    weight: 1.47,
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Relevant ACQ Tools"],
    validationMethod: "Malware detection rates, infection statistics, threat signature matching, behavioral analysis results.",
    industryTools: ["CrowdStrike", "Carbon Black", "Symantec", "Trend Micro"]
  },
  {
    parameter: "Endpoint Security",
    weight: 1.47,
    qualitativeAreas: ["Device Inventory Tracking", "Relevant ACQ Tools", "Security Risks & Vulnerabilities"],
    validationMethod: "EDR metrics, endpoint compliance scores, device security posture measurements, agent deployment statistics.",
    industryTools: ["Microsoft Defender", "SentinelOne", "CrowdStrike Falcon", "Carbon Black"]
  },
  {
    parameter: "Credential Exposure",
    weight: 1.47,
    qualitativeAreas: ["Identity Behavior & Hygiene", "Compliance Requirements"],
    validationMethod: "Exposed credential counts, dark web monitoring alerts, password policy compliance metrics.",
    industryTools: ["Have I Been Pwned", "Digital Shadows", "Recorded Future", "SpyCloud"]
  },
  {
    parameter: "IAM",
    weight: 1.47,
    qualitativeAreas: ["Identity Behavior & Hygiene", "Standards & Guidelines", "Compliance Requirements"],
    validationMethod: "IAM audit logs, access review compliance, privilege escalation detection, authentication success/failure rates.",
    industryTools: ["SailPoint", "Okta", "CyberArk", "Azure AD"]
  },
  {
    parameter: "Email Security (Phishing)",
    weight: 1.47,
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Security Control vs Framework"],
    validationMethod: "Phishing detection rates, click-through statistics, user behavior analysis, email threat intelligence.",
    industryTools: ["Proofpoint", "Mimecast", "Microsoft Defender for Office 365", "Barracuda"]
  },
  {
    parameter: "Cloud Security Posture",
    weight: 1.47,
    qualitativeAreas: ["Baseline Configuration", "Standards & Guidelines", "Compliance Requirements"],
    validationMethod: "CSPM compliance scores, cloud resource misconfiguration counts, security policy adherence metrics.",
    industryTools: ["Prisma Cloud", "AWS Security Hub", "Azure Security Center", "Google Cloud Security Command Center"]
  },
  {
    parameter: "Network Exposure",
    weight: 1.47,
    qualitativeAreas: ["Security Control vs Framework", "Adversarial Insight (MITRE ATT&CK)", "Baseline Configuration"],
    validationMethod: "Network vulnerability scans, open port analysis, attack surface measurements, network segmentation validation.",
    industryTools: ["Nmap", "Shodan", "Censys", "RiskIQ"]
  },
  {
    parameter: "Zero Trust",
    weight: 1.47,
    qualitativeAreas: ["Security Control vs Framework", "Baseline Configuration", "Standards & Guidelines"],
    validationMethod: "Zero Trust maturity scoring, microsegmentation effectiveness, least privilege compliance metrics.",
    industryTools: ["Zscaler", "Palo Alto Prisma", "Microsoft Zero Trust", "Okta"]
  },
  {
    parameter: "Data Security & Leakage",
    weight: 1.47,
    qualitativeAreas: ["Compliance Requirements", "Regulatory Requirements", "Information Security Management System (ISMS)"],
    validationMethod: "DLP policy violations, data classification compliance, sensitive data exposure metrics, encryption coverage analysis.",
    industryTools: ["Symantec DLP", "Forcepoint", "Microsoft Purview", "Varonis"]
  },
  {
    parameter: "Browser & Web Security",
    weight: 1.47,
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Standards & Guidelines", "Relevant ACQ Tools"],
    validationMethod: "Web application vulnerability scans, browser security policy compliance, web traffic analysis metrics.",
    industryTools: ["Burp Suite", "OWASP ZAP", "Acunetix", "Veracode"]
  },
  {
    parameter: "Dark Web Exposure",
    weight: 1.47,
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Identity Behavior & Hygiene", "Adversarial Insight (MITRE ATT&CK)"],
    validationMethod: "Dark web monitoring alerts, exposed asset discovery, threat intelligence correlation, credential compromise detection.",
    industryTools: ["Digital Shadows", "Recorded Future", "IntSights", "Flashpoint"]
  },
  {
    parameter: "Compliance & Frameworks",
    weight: 1.47,
    qualitativeAreas: ["Compliance Requirements", "Regulatory Requirements", "Standards & Guidelines"],
    validationMethod: "Automated GRC platform dashboards provide numerical evidence of adherence to compliance, regulatory frameworks (ISO, SOC2, HIPAA), and validate documented standards.",
    industryTools: ["ServiceNow GRC", "MetricStream", "LogicGate", "NAVEX One"]
  },
  {
    parameter: "Threat Intelligence",
    weight: 1.47,
    qualitativeAreas: ["Adversarial Insight (MITRE ATT&CK)", "Security Risks & Vulnerabilities", "Relevant ACQ Tools"],
    validationMethod: "Threat intelligence reports quantitatively validate adversarial threats, effectiveness of threat mitigation tools, and alignment to known adversarial patterns via MITRE ATT&CK.",
    industryTools: ["Recorded Future", "ThreatConnect", "Anomali", "IBM X-Force"]
  },
  {
    parameter: "Security Awareness & Insider threat",
    weight: 1.47,
    qualitativeAreas: ["Identity Behavior & Hygiene", "Information Security Management System (ISMS)", "Compliance Requirements"],
    validationMethod: "Insider risk analytics quantitatively verify effectiveness of security awareness programs, adherence to ISMS controls, validate behavior monitoring and insider threat policies.",
    industryTools: ["KnowBe4", "Proofpoint", "Microsoft Viva", "Forcepoint UEBA"]
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