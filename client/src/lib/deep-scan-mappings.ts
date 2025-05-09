/**
 * Deep Scan Parameters to Qualitative Analysis Proof Mapping
 * This file contains the mapping between deep scan parameters (quantitative) 
 * and their corresponding qualitative assessment areas, along with how 
 * deep scanning provides proof and validation.
 */

export interface DeepScanMapping {
  parameter: string;
  qualitativeAreas: string[];
  validationMethod: string;
}

export const deepScanMappings: DeepScanMapping[] = [
  {
    parameter: "Vulnerability & Patch Mgmt",
    qualitativeAreas: [
      "Security Risks & Vulnerabilities",
      "Baseline Configuration"
    ],
    validationMethod: "Provides quantitative CVE & vulnerability counts, patch levels, asset exposure, directly validating risks, vulnerabilities, and configuration baselines."
  },
  {
    parameter: "Misconfigurations",
    qualitativeAreas: [
      "Baseline Configuration",
      "Standards & Guidelines",
      "Regulatory Requirements"
    ],
    validationMethod: "Quantitative proof via configuration audits, compliance percentages against CIS or NIST baselines, demonstrating adherence to standards & regulatory requirements."
  },
  {
    parameter: "Malware & Endpoint Security",
    qualitativeAreas: [
      "Security Risks & Vulnerabilities",
      "Relevant ACQ Tools",
      "Device Inventory Tracking"
    ],
    validationMethod: "Endpoint security logs validate malware presence, device integrity, EDR effectiveness. Confirms inventory accuracy through endpoint detection."
  },
  {
    parameter: "Credential Exposure & IAM",
    qualitativeAreas: [
      "Identity Behavior & Hygiene",
      "Compliance Requirements",
      "Standards & Guidelines"
    ],
    validationMethod: "IAM audit logs quantitatively validate adherence to credential management standards, demonstrate identity hygiene, compliance with regulatory identity requirements."
  },
  {
    parameter: "Phishing & Email Security",
    qualitativeAreas: [
      "Security Risks & Vulnerabilities",
      "Security Control vs Framework",
      "Regulatory Requirements"
    ],
    validationMethod: "Phishing detection statistics quantify security control effectiveness, validate compliance with regulatory email security mandates."
  },
  {
    parameter: "Cloud Security Posture",
    qualitativeAreas: [
      "Baseline Configuration",
      "Standards & Guidelines",
      "Compliance & Regulatory Requirements"
    ],
    validationMethod: "Cloud Security Posture Management (CSPM) tools quantitatively validate adherence to cloud baselines, regulatory compliance, and alignment with industry standards."
  },
  {
    parameter: "Network Exposure & Zero Trust",
    qualitativeAreas: [
      "Security Control vs Framework",
      "Adversarial Insight (MITRE ATT&CK)",
      "Baseline Configuration"
    ],
    validationMethod: "Quantitative proof via network exposure scans, segmentation compliance, validating Zero Trust architecture effectiveness and mapping to adversarial attack vectors (MITRE ATT&CK)."
  },
  {
    parameter: "Data Security & Leakage",
    qualitativeAreas: [
      "Compliance Requirements",
      "Regulatory Requirements",
      "Information Security Management System (ISMS)"
    ],
    validationMethod: "Data leakage scans & DLP logs provide quantifiable proof of adherence to data security policies, validating regulatory and compliance requirements within ISMS frameworks."
  },
  {
    parameter: "Browser & Web Security",
    qualitativeAreas: [
      "Security Risks & Vulnerabilities",
      "Standards & Guidelines",
      "Relevant ACQ Tools"
    ],
    validationMethod: "Web vulnerability reports quantitatively prove adherence to secure browser standards, validate relevant tools' effectiveness, and identify web-based risks."
  },
  {
    parameter: "Compliance & Frameworks",
    qualitativeAreas: [
      "Compliance Requirements",
      "Regulatory Requirements",
      "Standards & Guidelines"
    ],
    validationMethod: "Automated GRC platform dashboards provide numerical evidence of adherence to compliance, regulatory frameworks (ISO, SOC2, HIPAA), and validate documented standards."
  },
  {
    parameter: "Threat Intelligence",
    qualitativeAreas: [
      "Adversarial Insight (MITRE ATT&CK)",
      "Security Risks & Vulnerabilities",
      "Relevant ACQ Tools"
    ],
    validationMethod: "Threat intelligence reports quantitatively validate adversarial threats, effectiveness of threat mitigation tools, and alignment to known adversarial patterns via MITRE ATT&CK."
  },
  {
    parameter: "Security Awareness & Insider Risk",
    qualitativeAreas: [
      "Identity Behavior & Hygiene",
      "Information Security Management System (ISMS)",
      "Compliance Requirements"
    ],
    validationMethod: "Insider risk analytics quantitatively verify effectiveness of security awareness programs, adherence to ISMS controls, validate behavior monitoring and insider threat policies."
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