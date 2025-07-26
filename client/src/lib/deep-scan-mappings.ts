/**
 * Deep Scan Parameters to Qualitative Analysis Proof Mapping
 * 17 Extended Deep Scan Parameters for Quantitative Analysis (Industry tools Deep Scan 100%)
 * Each parameter represents 5.88% of the complete Quantitative Analysis pillar (100% ÷ 17 = 5.88%)
 * CRITICAL: Actual data point measurement required - NO random sampling or estimation
 * Industry professional tools required for authentic quantitative results
 * Evolution from original 12 combined parameters to 17 individual parameters
 * 
 * DATA MEASUREMENT PRINCIPLE:
 * ✅ AUTHENTIC DATA POINTS: Direct measurement from actual systems and tools
 * ❌ NO SAMPLING: Random sampling, estimation, or synthetic data prohibited
 * ✅ VERIFIED METRICS: Quantifiable, measurable, and auditable data sources
 * 
 * FIVE PILLARS STRUCTURE (Each 100% when Complete):
 * 1. Qualitative Assessment (Updated 100%) - 12 parameters refined scoring
 * 2. Quantitative Analysis (Industry tools Deep Scan 100%) - 17 parameters with trend analysis
 * 3. RASBITA Cost-Benefit Analysis (Detailed 100% - RASBITA-CBF) - Financial impact modeling
 * 4. RASBITA Governance & Management (Maturity 100% - RASBITA-RGM) - NIST CSF 2.0 radar
 * 5. Architecture Threat Modeling & App Sec (Complete 100%) - STRIDE + SAST/DAST
 * 
 * SCANNING CAPABILITY CLASSIFICATION:
 * ✔️ Directly Detectable: 12 parameters with full deep scanning capability
 * ⚠️ Limited/Indirect: 5 parameters requiring complementary tools
 */

export interface DeepScanMapping {
  parameter: string;
  weight: number; // 5.88% each (100% ÷ 17 parameters within Quantitative Analysis pillar)
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
    validationMethod: "Direct CVE data collection from actual systems, measured CVSS scores, and real vulnerability age analysis - NO sampling.",
    industryTools: ["Tenable", "Qualys", "Wazuh", "OpenVAS"]
  },
  {
    parameter: "Patch Mgmt", 
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Baseline Configuration", "Standards & Guidelines"],
    validationMethod: "Direct agent data collection providing actual patch compliance metrics and precise missing patch counts from all systems.",
    industryTools: ["WSUS", "SCCM", "Tanium", "Red Hat Satellite"]
  },
  {
    parameter: "Misconfigurations",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Baseline Configuration", "Standards & Guidelines", "Regulatory Requirements"],
    validationMethod: "Complete configuration data extraction from actual OS/AD/cloud/firewall systems with measured CIS benchmark compliance.",
    industryTools: ["Nessus", "Chef InSpec", "AWS Config", "Azure Security Center"]
  },
  {
    parameter: "Malware",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Relevant ACQ Tools"],
    validationMethod: "Real-time malware detection data from actual endpoint scans providing measured detection rates and precise infection counts.",
    industryTools: ["CrowdStrike", "SentinelOne", "Microsoft Defender XDR", "Trend Micro"]
  },
  {
    parameter: "Endpoint Security",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Device Inventory Tracking", "Relevant ACQ Tools", "Security Risks & Vulnerabilities"],
    validationMethod: "Direct EDR/XDR data extraction providing measured endpoint compliance scores and actual agent deployment metrics.",
    industryTools: ["CrowdStrike", "SentinelOne", "Microsoft Defender XDR", "Carbon Black"]
  },
  {
    parameter: "Credential Exposure",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Identity Behavior & Hygiene", "Compliance Requirements"],
    validationMethod: "Direct credential database queries and dark web monitoring providing actual leaked credential counts and exposure metrics.",
    industryTools: ["Have I Been Pwned", "Digital Shadows", "Recorded Future", "SpyCloud"]
  },
  {
    parameter: "IAM",
    weight: 5.88,
    scanningCapability: "partial",
    qualitativeAreas: ["Identity Behavior & Hygiene", "Standards & Guidelines", "Compliance Requirements"],
    validationMethod: "Direct IAM system analysis providing actual overprivileged role counts and precise unused account metrics.",
    industryTools: ["SailPoint", "Okta", "CyberArk", "Azure AD"],
    limitations: "Partial - overprivileged roles, unused accounts"
  },
  {
    parameter: "Email Security (Phishing)",
    weight: 5.88,
    scanningCapability: "partial",
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Security Control vs Framework"],
    validationMethod: "Direct email security tool data providing measured phishing detection rates and actual click-through statistics.",
    industryTools: ["Proofpoint", "Mimecast", "Microsoft Defender for Office 365", "Barracuda"],
    limitations: "Partial - scanning headers, links, sandboxing"
  },
  {
    parameter: "Cloud Security Posture",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Baseline Configuration", "Standards & Guidelines", "Compliance Requirements"],
    validationMethod: "Direct CSPM tool data extraction providing measured compliance scores and actual misconfiguration counts from live cloud environments.",
    industryTools: ["Prisma Cloud", "Wiz", "AWS Security Hub", "Azure Security Center"]
  },
  {
    parameter: "Network Exposure",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Security Control vs Framework", "Adversarial Insight (MITRE ATT&CK)", "Baseline Configuration"],
    validationMethod: "Direct network scanning data providing actual open port counts, measured firewall gaps, and precise attack surface metrics.",
    industryTools: ["Nmap", "Shodan", "Censys", "RiskIQ"]
  },
  {
    parameter: "Zero Trust",
    weight: 5.88,
    scanningCapability: "indirect",
    qualitativeAreas: ["Security Control vs Framework", "Baseline Configuration", "Standards & Guidelines"],
    validationMethod: "Direct zero trust architecture analysis providing measured policy enforcement metrics and actual trust verification data.",
    industryTools: ["Zscaler", "Palo Alto Prisma", "Microsoft Zero Trust", "Okta"],
    limitations: "Needs architecture + policy enforcement tools, not just scanners"
  },
  {
    parameter: "Data Security & Leakage",
    weight: 5.88,
    scanningCapability: "indirect",
    qualitativeAreas: ["Compliance Requirements", "Regulatory Requirements", "Information Security Management System (ISMS)"],
    validationMethod: "Direct DLP tool data extraction providing actual data leakage incidents and measured endpoint visibility metrics.",
    industryTools: ["Symantec DLP", "Forcepoint", "Microsoft Purview", "Varonis"],
    limitations: "Needs DLP (Data Loss Prevention) + endpoint visibility"
  },
  {
    parameter: "Browser & Web Security",
    weight: 5.88,
    scanningCapability: "indirect",
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Standards & Guidelines", "Relevant ACQ Tools"],
    validationMethod: "Direct browser security tool data providing measured web threat detection rates and actual security violation counts.",
    industryTools: ["Burp Suite", "OWASP ZAP", "Acunetix", "Veracode"],
    limitations: "Needs secure browser tech or proxy inspection tools"
  },
  {
    parameter: "Dark Web Exposure",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Security Risks & Vulnerabilities", "Identity Behavior & Hygiene", "Adversarial Insight (MITRE ATT&CK)"],
    validationMethod: "Direct dark web monitoring data providing actual exposed asset counts and measured credential compromise incidents.",
    industryTools: ["Digital Shadows", "Recorded Future", "IntSights", "Flashpoint"]
  },
  {
    parameter: "Compliance & Frameworks",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Compliance Requirements", "Regulatory Requirements", "Standards & Guidelines"],
    validationMethod: "Direct compliance tool data extraction providing measured NIST/HIPAA/CIS/PCI-DSS scores and actual compliance metrics.",
    industryTools: ["ServiceNow GRC", "MetricStream", "LogicGate", "NAVEX One"]
  },
  {
    parameter: "Threat Intelligence",
    weight: 5.88,
    scanningCapability: "direct",
    qualitativeAreas: ["Adversarial Insight (MITRE ATT&CK)", "Security Risks & Vulnerabilities", "Relevant ACQ Tools"],
    validationMethod: "Direct threat intelligence feed data providing actual IOC counts, measured threat indicators, and precise MITRE ATT&CK alignment metrics.",
    industryTools: ["Recorded Future", "ThreatConnect", "Anomali", "IBM X-Force"]
  },
  {
    parameter: "Security Awareness & Insider threat",
    weight: 5.88,
    scanningCapability: "indirect",
    qualitativeAreas: ["Identity Behavior & Hygiene", "Information Security Management System (ISMS)", "Compliance Requirements"],
    validationMethod: "Direct UEBA and training platform data providing measured behavioral analytics and actual security awareness metrics.",
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
    dataIntegrityRequirement: "AUTHENTIC DATA POINTS ONLY - NO sampling, estimation, or synthetic data permitted",
    recommendedToolCombination: [
      "Direct vulnerability scanner data (Tenable, Qualys, Wazuh) - measured CVE counts",
      "Actual EDR/XDR metrics (CrowdStrike, SentinelOne, Microsoft Defender XDR) - real endpoint statistics",
      "Live SIEM data (Splunk, Wazuh, LogRhythm) - actual event logs and measurements",
      "Real CSPM/CIEM metrics (Prisma Cloud, Wiz) - measured cloud compliance data",
      "Authentic threat intelligence feeds - actual IOC counts and indicators",
      "Direct DLP + IAM system data - measured policy violations and access metrics",
      "Actual security awareness metrics (KnowBe4) - measured training completion and test results"
    ],
    fivePillarsWeight: {
      "Qualitative Assessment": "Updated 100% - Refined based on actual evidence, accurate scoring of 12 parameters",
      "Quantitative Analysis": "Industry tools Deep Scan 100% - Professional scanning tools, 17 parameters with trend analysis (6+ months)",
      "RASBITA Cost-Benefit Analysis": "Detailed 100% (RASBITA-CBF) - Comprehensive financial impact modeling, actual incident costs",
      "RASBITA Governance & Management": "Maturity 100% (RASBITA-RGM) - NIST CSF 2.0 radar analysis, governance effectiveness",
      "Architecture Threat Modeling & App Sec": "Complete 100% - STRIDE threat modeling, data flow analysis, SAST/DAST"
    }
  };
}