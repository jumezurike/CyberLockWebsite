// Matrix mappings for different infrastructure modes
import { MatrixItem } from "./sos2a-types";

// Define common security frameworks for different domains
export const commonFrameworks = {
  operations: {
    "isp-modem": ["nist-csf", "cyber-ess-uk", "mitre-attack", "pci-dss", "cis-csc"],
    "mobile-hotspot": ["nist-csf", "cyber-ess-uk", "mitre-attack", "cis-csc"],
    "commercial-internet": ["nist-csf", "cyber-ess-uk", "mitre-attack", "pci-dss", "cis-csc"],
    "dedicated-connection": ["nist-csf", "cis-csc", "cyber-ess-uk", "cmmc", "mitre-attack"],
    "satellite": ["nist-csf", "cis-csc", "cyber-ess-uk", "mitre-attack"],
    "other": ["nist-csf", "cis-csc"],
  },
  management: {
    "isp-modem": ["nist-csf", "cis-csc", "cyber-ess-uk", "mitre-attack"],
    "mobile-hotspot": ["nist-csf", "cis-csc", "cyber-ess-uk", "mitre-attack"],
    "commercial-internet": ["nist-csf", "cis-csc", "cyber-ess-uk", "cmmc", "mitre-attack"],
    "dedicated-connection": ["nist-csf", "cis-csc", "cyber-ess-uk", "cmmc", "mitre-attack"],
    "satellite": ["nist-csf", "cis-csc", "cyber-ess-uk", "mitre-attack"],
    "other": ["nist-csf", "cis-csc"],
  },
  technology: {
    "isp-modem": ["nist-csf", "cis-csc", "cyber-ess-uk", "cmmc", "mitre-attack", "pci-dss"],
    "mobile-hotspot": ["nist-csf", "cis-csc", "cyber-ess-uk", "mitre-attack"],
    "commercial-internet": ["nist-csf", "cis-csc", "cyber-ess-uk", "cmmc", "mitre-attack", "pci-dss"],
    "dedicated-connection": ["nist-csf", "cis-csc", "cyber-ess-uk", "cmmc", "mitre-attack", "pci-dss"],
    "satellite": ["nist-csf", "cis-csc", "cyber-ess-uk", "cmmc", "mitre-attack"],
    "other": ["nist-csf", "cis-csc"],
  },
};

// Define common risks for each infrastructure mode
export const commonRisks = {
  "isp-modem": [
    "Unauthorized access",
    "Eavesdropping and traffic interception",
    "Default credentials exploitation",
    "Firmware vulnerabilities",
    "Man-in-the-middle attacks",
  ],
  "mobile-hotspot": [
    "Data interception in transit",
    "Rogue access points",
    "Device theft or loss",
    "Battery drain/denial of service",
    "Public network exposure",
  ],
  "commercial-internet": [
    "DDoS attacks",
    "Data breaches",
    "Malware and ransomware",
    "Phishing attacks",
    "Service disruptions",
  ],
  "dedicated-connection": [
    "Provider infrastructure failures",
    "Physical line damage",
    "Border Gateway Protocol (BGP) attacks",
    "SLA violations",
    "Credential theft"
  ],
  "satellite": [
    "Signal jamming and interference",
    "Weather-related disruptions",
    "Higher latency impact",
    "Physical satellite vulnerabilities",
    "Signal interception"
  ],
  "other": [
    "Unknown network architecture risks",
    "Potential compatibility issues",
    "Non-standard configuration vulnerabilities",
    "Untested security controls",
    "Incomplete documentation"
  ],
  "website": [
    "Phishing & Spoofing",
    "Data Breaches",
    "SQL Injection", 
    "DDoS Attacks",
    "Malware & Hacking"
  ],
  "social-media": [
    "Social Engineering",
    "Impersonation",
    "Data Privacy Violation",
    "Reputational Damages",
    "Account Hijacking"
  ]
};

// Define common vulnerabilities for each infrastructure mode
export const commonVulnerabilities = {
  "isp-modem": [
    "Outdated firmware",
    "Weak default passwords",
    "Unsecured management interfaces",
    "Unpatched security vulnerabilities",
    "Insufficient logging",
  ],
  "mobile-hotspot": [
    "Weak encryption protocols",
    "Insecure authentication methods",
    "Default or simple passwords",
    "Unpatched firmware vulnerabilities",
    "Lack of device management controls",
  ],
  "commercial-internet": [
    "Inadequate bandwidth for peak loads",
    "Inadequate perimeter security",
    "Lack of redundancy",
    "Misconfigured firewalls and security appliances",
    "Insufficient monitoring",
  ],
  "dedicated-connection": [
    "Single point of failure",
    "Inadequate physical security",
    "Misconfigured routing protocols",
    "Lack of backup connections",
    "Insufficient QoS implementation",
  ],
  "satellite": [
    "Limited bandwidth capacity",
    "Susceptibility to weather interference",
    "High latency affecting real-time applications",
    "Inadequate encryption for transmission",
    "Limited provider redundancy options",
  ],
  "other": [
    "Unknown configuration status",
    "Potential lack of security documentation",
    "Unidentified legacy components",
    "Potential misconfigured security settings",
    "Unclear update and patching procedures",
  ],
  "website": [
    "Weak Authentication and Access Control",
    "Unpatched Software and Plugins", 
    "Insecure File Uploads",
    "Cross-Site Scripting (XSS)",
    "Unsecured APIs",
    "Misconfigured Servers",
    "Third-Party Dependencies"
  ],
  "cloud-servers": [
    "Inadequate access controls",
    "Misconfigurations",
    "Shared tenancy risks",
    "Insecure APIs",
    "Inadequate encryption",
    "Insufficient monitoring",
    "Incomplete backup strategies"
  ],
  "office-servers": [
    "Physical access vulnerabilities",
    "Outdated operating systems",
    "Insufficient backup procedures",
    "Inadequate environmental controls",
    "Poor network segmentation"
  ]
};

// Define questionnaires based on infrastructure mode
export const relevantQuestionnaires = {
  "isp-modem": ["SAQ A"],
  "mobile-hotspot": ["SAQ A", "SAQ B"],
  "commercial-internet": ["SAQ A", "SAQ B", "SAQ C"],
  "dedicated-connection": ["SAQ B", "SAQ C", "SAQ D"],
  "satellite": ["SAQ A", "SAQ B"],
  "other": ["SAQ A"],
};

// Define MITRE ATT&CK tactics and techniques for different infrastructure modes
export const mitreMappings = {
  tactics: {
    "isp-modem": ["Initial Access", "Persistence", "Defense Evasion"],
    "mobile-hotspot": ["Initial Access", "Defense Evasion", "Exfiltration"],
    "commercial-internet": ["Initial Access", "Defense Evasion", "Lateral Movement", "Exfiltration"],
    "dedicated-connection": ["Initial Access", "Command and Control", "Lateral Movement"],
    "satellite": ["Initial Access", "Command and Control", "Exfiltration"],
    "other": ["Initial Access"],
    "website": ["Initial Access", "Defense Evasion", "Lateral Movement", "Exfiltration"],
  },
  techniques: {
    "isp-modem": ["T1133: External Remote Services", "T1078: Valid Accounts"],
    "mobile-hotspot": ["T1078: Valid Accounts", "T1557: Man-in-the-Middle"],
    "commercial-internet": ["T1595: Active Scanning", "T1190: Exploit Public-Facing Application"],
    "dedicated-connection": ["T1133: External Remote Services", "T1071: Application Layer Protocol"],
    "satellite": ["T1205: Traffic Signaling", "T1071: Application Layer Protocol"],
    "other": ["T1078: Valid Accounts"],
    "website": ["T1566: Phishing", "T1595: Active Scanning"],
  },
};

// Define policy documents required for different infrastructure modes
export const policyDocuments = {
  policies: {
    "isp-modem": ["acceptable-use", "information-security", "remote-work"],
    "mobile-hotspot": ["acceptable-use", "byod", "remote-work", "information-security"],
    "commercial-internet": ["acceptable-use", "information-security", "data-classification"],
    "dedicated-connection": ["acceptable-use", "information-security", "data-classification"],
    "satellite": ["acceptable-use", "information-security", "remote-work"],
    "other": ["acceptable-use", "information-security"],
    "website": ["acceptable-use", "information-security", "password"],
  },
  procedures: {
    "isp-modem": ["incident-response", "access-control"],
    "mobile-hotspot": ["incident-response", "access-control", "patching"],
    "commercial-internet": ["incident-response", "access-control", "backup-restore", "vulnerability-mgmt"],
    "dedicated-connection": ["incident-response", "access-control", "backup-restore", "vulnerability-mgmt", "change-management"],
    "satellite": ["incident-response", "access-control", "backup-restore"],
    "other": ["incident-response", "access-control"],
    "website": ["incident-response", "access-control", "vulnerability-mgmt", "patching"],
  },
  plans: {
    "isp-modem": ["incident-response-plan", "security-awareness"],
    "mobile-hotspot": ["incident-response-plan", "security-awareness"],
    "commercial-internet": ["incident-response-plan", "business-continuity", "disaster-recovery", "security-awareness"],
    "dedicated-connection": ["incident-response-plan", "business-continuity", "disaster-recovery", "security-awareness", "data-breach"],
    "satellite": ["incident-response-plan", "business-continuity", "disaster-recovery"],
    "other": ["incident-response-plan"],
    "website": ["incident-response-plan", "business-continuity", "disaster-recovery", "security-awareness", "data-breach"],
  },
  processes: {
    "isp-modem": ["Vulnerability Management Process", "Incident Response Process"],
    "mobile-hotspot": ["Vulnerability Management Process", "Incident Response Process", "Device Lifecycle Management"],
    "commercial-internet": ["Vulnerability Management Process", "Incident Response Process", "System Hardening Process", "Patch Management Process"],
    "dedicated-connection": ["Vulnerability Management Process", "Incident Response Process", "System Hardening Process", "Patch Management Process", "Change Management Process"],
    "satellite": ["Vulnerability Management Process", "Incident Response Process", "System Hardening Process"],
    "other": ["Vulnerability Management Process", "Incident Response Process"],
    "website": ["Vulnerability Management Process", "Incident Response Process", "System Hardening Process", "Patch Management Process", "Content Management Process"],
  },
};

// Define which infrastructure types typically require education and awareness training
export const educationAwarenessNeeded = {
  "isp-modem": false,
  "mobile-hotspot": true, // Mobile hotspots require user education about secure usage
  "commercial-internet": false,
  "dedicated-connection": false,
  "satellite": true, // Satellite connections require special awareness for limitations
  "other": false,
  "website": false,
  "social-media": true, // Social media requires education about safe usage and policies
  "cloud-servers": true, // Cloud services require education on secure access
  "office-servers": true, // Local servers require education on physical security
  "hybrid": true, // Hybrid environments require education on both cloud and on-prem
  "minimal": false,
  "none": false,
};

// Helper function to initialize a matrix item based on infrastructure mode
export function createMatrixItemForInfraMode(infraType: string): MatrixItem {
  // Default false values for boolean fields
  const defaultBooleanFalse = false;
  
  // Initialize the matrix item with the appropriate values
  return {
    infraType,
    risks: commonRisks[infraType as keyof typeof commonRisks] || [],
    vulnerabilities: commonVulnerabilities[infraType as keyof typeof commonVulnerabilities] || [],
    educationAwareness: educationAwarenessNeeded[infraType as keyof typeof educationAwarenessNeeded] || false,
    relevantQuestionnaires: relevantQuestionnaires[infraType as keyof typeof relevantQuestionnaires] || [],
    operationControls: {
      frameworks: commonFrameworks.operations[infraType as keyof typeof commonFrameworks.operations] || [],
      applicable: true,
      implemented: false,
      gaps: [],
    },
    managementControls: {
      frameworks: commonFrameworks.management[infraType as keyof typeof commonFrameworks.management] || [],
      applicable: true,
      implemented: false,
      gaps: [],
    },
    technologyControls: {
      frameworks: commonFrameworks.technology[infraType as keyof typeof commonFrameworks.technology] || [],
      applicable: true,
      implemented: false,
      gaps: [],
      osHardening: {
        stig: false,
        scap: false,
        implemented: false,
      },
    },
    complianceStandards: {
      pciDss: defaultBooleanFalse,
      hipaa: defaultBooleanFalse,
      cmmc: defaultBooleanFalse,
      gdpr: defaultBooleanFalse,
      ccpa: defaultBooleanFalse,
      soc2: defaultBooleanFalse,
      iso27001: defaultBooleanFalse,
      cyberEssentialsUk: defaultBooleanFalse,
      ferpa: defaultBooleanFalse,
      glba: defaultBooleanFalse,
      pipeda: defaultBooleanFalse,
      ftcSafeguardRules: defaultBooleanFalse,
      sbaCsg: defaultBooleanFalse,
    },
    regulatoryRequirements: {
      pciDss: defaultBooleanFalse,
      coppa: defaultBooleanFalse,
      hipaa: defaultBooleanFalse,
      gdpr: defaultBooleanFalse,
      ccpa: defaultBooleanFalse,
      glba: defaultBooleanFalse,
      ferpa: defaultBooleanFalse,
      pipeda: defaultBooleanFalse,
      ftcSafeguardRules: defaultBooleanFalse,
      fisma: defaultBooleanFalse,
      dfars: defaultBooleanFalse,
    },
    standards: {
      iso27001: defaultBooleanFalse,
      iso27002: defaultBooleanFalse,
      nistCsf: defaultBooleanFalse,
      nist80053: defaultBooleanFalse,
      iso27018: defaultBooleanFalse,
      iso27005: defaultBooleanFalse,
      cisCsc: defaultBooleanFalse,
      nist800171: defaultBooleanFalse,
      itil: defaultBooleanFalse,
      cobit: defaultBooleanFalse,
    },
    mitreTactics: mitreMappings.tactics[infraType as keyof typeof mitreMappings.tactics] || [],
    mitreTechniques: mitreMappings.techniques[infraType as keyof typeof mitreMappings.techniques] || [],
    policyDocuments: {
      policies: policyDocuments.policies[infraType as keyof typeof policyDocuments.policies] || [],
      procedures: policyDocuments.procedures[infraType as keyof typeof policyDocuments.procedures] || [],
      plans: policyDocuments.plans[infraType as keyof typeof policyDocuments.plans] || [],
      processes: policyDocuments.processes[infraType as keyof typeof policyDocuments.processes] || [],
    },
    osHardening: {
      stigScap: false,
      guidelines: [],
    },
  };
}

// Generate matrix data based on selected operation modes and internet presence
export function generateInitialMatrixData(operationModes: string[], internetPresence: string[]): MatrixItem[] {
  const matrixData: MatrixItem[] = [];
  
  // Add operation modes to matrix
  operationModes.forEach(mode => {
    matrixData.push(createMatrixItemForInfraMode(mode));
  });
  
  // Add internet presence to matrix
  internetPresence.forEach(presence => {
    matrixData.push(createMatrixItemForInfraMode(presence));
  });
  
  return matrixData;
}