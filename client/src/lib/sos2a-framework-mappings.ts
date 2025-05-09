/**
 * SOS²A Default Parameters Mapping
 * This file contains the mapping between SOS²A parameters and their framework categories,
 * validation gates, proof requirements, and automation levels.
 */

export interface FrameworkMapping {
  parameter: string;
  matchingFrameworkCategories: string[];
  validationGates: string[];
  proofRequired: string[];
  automationLevel: string;
}

export const frameworkMappings: FrameworkMapping[] = [
  {
    parameter: "Infrastructure Mode of Operation",
    matchingFrameworkCategories: ["#6 Cloud BattleSpace", "#7 Network CyberRange"],
    validationGates: ["Attack path simulation", "Autonomous pentesting"],
    proofRequired: ["Cloud service dependency graphs", "Network topology maps with CVE overlays"],
    automationLevel: "✅ 95%"
  },
  {
    parameter: "Security Risks & Vulnerabilities",
    matchingFrameworkCategories: ["#1 Vulnerability Stormtracker", "#3 Endpoint War Room"],
    validationGates: ["AI-driven criticality scoring", "Threat containment verification"],
    proofRequired: ["Real-time risk heatmaps", "EDR auto-remediation logs with MITRE technique tags"],
    automationLevel: "✅ 97%"
  },
  {
    parameter: "Baseline Configuration",
    matchingFrameworkCategories: ["#2 Configuration Enforcer", "#14 Cloud-Native Armor"],
    validationGates: ["Policy-as-code runtime validation", "Immutable deployment checks"],
    proofRequired: ["Terraform compliance logs", "K8s CIS benchmark attestations"],
    automationLevel: "✅ 96%"
  },
  {
    parameter: "Security Control vs Framework",
    matchingFrameworkCategories: ["#11 Compliance Autopilot", "#5 Phishing Killchain"],
    validationGates: ["Continuous control monitoring", "AI lure testing"],
    proofRequired: ["NIST CSF → ISO 27001 mapping reports", "Phishing simulation coverage matrices"],
    automationLevel: "⚠️ 88%"
  },
  {
    parameter: "Compliance Requirements",
    matchingFrameworkCategories: ["#11 Compliance Autopilot"],
    validationGates: ["Real-time audit trails"],
    proofRequired: ["SOC2/ISO27001 evidence packs with tool-generated timestamps"],
    automationLevel: "✅ 92%"
  },
  {
    parameter: "Regulatory Requirements",
    matchingFrameworkCategories: ["#8 Data DNA Mapping", "#12 Third-Party CyberXRay"],
    validationGates: ["Synthetic data validation", "Vendor breach simulations"],
    proofRequired: ["GDPR data flow maps", "Vendor SOC2 Type II attestation packages"],
    automationLevel: "⚠️ 75%"
  },
  {
    parameter: "Standards & Guidelines",
    matchingFrameworkCategories: ["#2 Configuration Enforcer", "#9 AppSec WarGames"],
    validationGates: ["CIS benchmark enforcement", "Runtime protection testing"],
    proofRequired: ["NIST 800-53 implementation scores", "OWASP Top 10 coverage dashboards"],
    automationLevel: "✅ 90%"
  },
  {
    parameter: "Relevant ACQ Tools",
    matchingFrameworkCategories: ["#12 Third-Party CyberXRay", "#13 IoT/OT Sentinel"],
    validationGates: ["Automated vendor assessments", "Device fingerprinting"],
    proofRequired: ["Vendor security scorecards", "OT device inventories with firmware versions"],
    automationLevel: "⚠️ 65%"
  },
  {
    parameter: "Adversarial Insight (MITRE ATT&CK)",
    matchingFrameworkCategories: ["#10 Threat Weathermap", "#7 Network CyberRange"],
    validationGates: ["Automated ATT&CK playbooks", "Breach simulation"],
    proofRequired: ["Technique heatmaps", "Adversarial TTP detection timelines"],
    automationLevel: "✅ 94%"
  },
  {
    parameter: "ISMS",
    matchingFrameworkCategories: ["#11 Compliance Autopilot", "#15 AI Security Vault"],
    validationGates: ["Integrated risk management", "Model testing"],
    proofRequired: ["ISO 27001 Statement of Applicability", "AI risk registers"],
    automationLevel: "⚠️ 83%"
  },
  {
    parameter: "Device Inventory Tracking",
    matchingFrameworkCategories: ["#1 Vulnerability Stormtracker", "#13 IoT/OT Sentinel"],
    validationGates: ["Passive network discovery", "PLC monitoring"],
    proofRequired: ["CMDB auto-updates with network context", "OT device communication diagrams"],
    automationLevel: "✅ 98%"
  },
  {
    parameter: "Identity Behavior & Hygiene",
    matchingFrameworkCategories: ["#4 Identity Fortress", "#10 Threat Weathermap"],
    validationGates: ["Just-in-time access approvals", "UEBA analytics"],
    proofRequired: ["Privilege escalation graphs", "Anomalous login attempt timelines"],
    automationLevel: "⚠️ 78%"
  }
];

/**
 * Get automation level percentage as a number
 * @param automationLevel String like "✅ 95%" or "⚠️ 78%"
 * @returns Number between 0-100
 */
export function getAutomationPercentage(automationLevel: string): number {
  const percentMatch = automationLevel.match(/(\d+)%/);
  if (percentMatch && percentMatch[1]) {
    return parseInt(percentMatch[1], 10);
  }
  return 0;
}

/**
 * Check if an automation level is considered satisfactory (90% or higher)
 * @param automationLevel String like "✅ 95%" or "⚠️ 78%"
 * @returns Boolean indicating if level is satisfactory
 */
export function isAutomationLevelSatisfactory(automationLevel: string): boolean {
  return getAutomationPercentage(automationLevel) >= 90;
}

/**
 * Get all framework mappings for a specific parameter
 * @param parameterName The name of the SOS²A parameter
 * @returns The framework mapping or undefined if not found
 */
export function getFrameworkMappingByParameter(parameterName: string): FrameworkMapping | undefined {
  return frameworkMappings.find(mapping => mapping.parameter === parameterName);
}