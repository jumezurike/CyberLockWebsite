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

// Define assessment tools categorized by type and relevance
export const assessmentTools = {
  // Restructured to match the specific ACQ Tool categories
  
  // Category 1: Assessments - For comprehensive evaluations
  assessments: [
    "HIPAA Security Risk Assessment (SRA) Tool",
    "NIST Cybersecurity Framework Self-Assessment Tool",
    "ISO 27001 Self-Assessment Questionnaire (Annex A Controls)",
    "HITRUST MyCSF Self-Assessment",
    "FedRAMP Security Assessment Questionnaire (SAQ)",
    "SOC 2 Readiness Assessment (Security, Availability, Confidentiality, Processing Integrity, Privacy)"
  ],
  
  // Category 2: Checklists - For verification and validation
  checklists: [
    "FERPA Compliance Checklist",
    "GLBA Safeguards Rule Self-Assessment",
    "FISMA Compliance Checklist",
    "CCPA Compliance Checklist",
    "CIS Controls Self-Assessment Tool (CSAT)",
    "SOX IT General Controls (ITGC) Questionnaire"
  ],
  
  // Category 3: Questionnaires - For specific information gathering
  questionnaires: [
    "SAQ A (Card-not-present Merchants)",
    "SAQ B (Merchants with Imprint-only or Standalone Terminals)",
    "SAQ C (Merchants with Payment Application Systems)",
    "SAQ B-IP (Merchants with Standalone IP-Connected Terminals)",
    "SAQ A-EP (E-commerce Merchants with Third-Party Processing)",
    "SAQ C-VT (Merchants with Virtual Terminals)",
    "SAQ D (Merchant)",
    "SAQ P2PE-HW (Hardware Payment Terminal P2PE)",
    "GDPR Compliance Questionnaire (Articles 5-30)",
    "NYDFS Cybersecurity Self-Assessment Tool"
  ],

  // Keeping the original structure for backward compatibility
  // Category 1: Questionnaires - For information gathering and initial assessments
  legacy_questionnaires: {
    'pci-dss': [
      "SAQ A (Card-not-present Merchants)",
      "SAQ B (Merchants with Imprint-only or Standalone Terminals)",
      "SAQ C (Merchants with Payment Application Systems)",
      "SAQ B-IP (Merchants with Standalone IP-Connected Terminals)",
      "SAQ A-EP (E-commerce Merchants with Third-Party Processing)",
      "SAQ C-VT (Merchants with Virtual Terminals)",
      "SAQ D (Merchants with Full Cardholder Data Environment)",
      "SAQ P2PE-HW (Hardware Payment Terminal P2PE)"
    ],
    'hipaa': [
      "HIPAA Security Risk Assessment (SRA) Tool",
      "HIPAA Privacy Rule Compliance Questionnaire",
      "HIPAA Breach Notification Readiness Assessment",
      "HIPAA Security Rule Technical Safeguards Questionnaire",
      "HIPAA Administrative Safeguards Assessment"
    ],
    'gdpr': [
      "GDPR Compliance Questionnaire (Articles 5-30)",
      "GDPR Data Protection Impact Assessment Questionnaire",
      "GDPR Data Subject Rights Readiness Questionnaire",
      "GDPR Cross-Border Data Transfer Assessment"
    ],
    'other': [
      "FERPA Compliance Questionnaire",
      "CCPA Consumer Rights Implementation Questionnaire",
      "GLBA Financial Privacy Questionnaire",
      "SOX IT General Controls (ITGC) Questionnaire"
    ]
  },
  
  // Category 2: Checklists - For validating compliance with specific controls or requirements
  legacy_checklists: {
    'pci-dss': [
      "PCI DSS Firewall Configuration Checklist",
      "PCI DSS Log Review Checklist",
      "PCI DSS Vendor Management Checklist",
      "PCI DSS Secure Coding Checklist"
    ],
    'hipaa': [
      "HIPAA Business Associate Agreement Checklist",
      "HIPAA Contingency Planning Checklist",
      "HIPAA Security Incident Response Checklist",
      "HIPAA Workstation Security Checklist"
    ],
    'nist': [
      "NIST SP 800-171 Controls Checklist",
      "NIST CSF Basic Hygiene Checklist",
      "NIST Incident Response Preparedness Checklist"
    ],
    'industry': [
      "Healthcare Data Protection Checklist",
      "Financial Services Authentication Checklist",
      "Retail E-commerce Security Checklist", 
      "Cloud Service Provider Security Checklist"
    ]
  },
  
  // Category 3: Assessment Tools - For comprehensive evaluations and scoring
  legacy_assessmentTools: {
    'comprehensive': [
      "ISO 27001 Self-Assessment Questionnaire (Annex A Controls)",
      "NIST Cybersecurity Framework Self-Assessment Tool",
      "SOC 2 Readiness Assessment (Security, Availability, Confidentiality, Processing Integrity, Privacy)"
    ],
    'specialized': [
      "HITRUST MyCSF Self-Assessment",
      "FedRAMP Security Assessment Questionnaire (SAQ)",
      "CIS Controls Self-Assessment Tool (CSAT)",
      "NYDFS Cybersecurity Self-Assessment Tool"
    ],
    'regulatory': [
      "FISMA Compliance Assessment Tool",
      "CMMC Assessment Tool",
      "GDPR Readiness Assessment Tool"
    ],
    'industry-specific': [
      "Healthcare Security Maturity Assessment Tool",
      "Financial Services Cyber Resilience Assessment",
      "Critical Infrastructure Security Assessment Tool"
    ]
  }
};

// Define questionnaires based on infrastructure mode and industry
export const relevantQuestionnaires = {
  // Basic infrastructure questionnaires (PCI-DSS focused)
  "isp-modem": ["PCI-DSS: SAQ A", "CIS: CSAT Basic"],
  "mobile-hotspot": ["PCI-DSS: SAQ A", "PCI-DSS: SAQ B", "CIS: CSAT Basic"],
  "commercial-internet": ["PCI-DSS: SAQ A", "PCI-DSS: SAQ B", "PCI-DSS: SAQ C", "CIS: CSAT Basic", "CIS: CSAT Intermediate"],
  "dedicated-connection": ["PCI-DSS: SAQ B", "PCI-DSS: SAQ C", "PCI-DSS: SAQ D", "CIS: CSAT Intermediate"],
  "satellite": ["PCI-DSS: SAQ A", "PCI-DSS: SAQ B", "CIS: CSAT Basic"],
  "other": ["PCI-DSS: SAQ A", "CIS: CSAT Basic"],
  
  // Industry-specific questionnaires
  "healthcare": [
    "HIPAA: Security Risk Assessment Tool",
    "HIPAA: Privacy Rule Compliance Questionnaire",
    "HIPAA: Breach Notification Readiness",
    "NIST CSF: Healthcare Profile",
    "ISO 27001: Healthcare Implementation Checklist", 
    "HITRUST: CSF Self-Assessment",
    "ONC: Security Risk Assessment Tool"
  ],
  "finance": [
    "PCI-DSS: SAQ D",
    "SOC 2: Type II Readiness Assessment",
    "NYDFS: 23 NYCRR 500 Cybersecurity Self-Assessment",
    "GLBA: Safeguards Rule Assessment",
    "ISO 27001: Financial Services Implementation Checklist",
    "FFIEC: Cybersecurity Assessment Tool"
  ],
  "education": [
    "FERPA: Data Privacy Assessment",
    "NIST CSF: Education Profile",
    "CIS: CSAT Education Profile",
    "COPPA: Compliance Checklist"
  ],
  "government": [
    "FedRAMP: Security Assessment Questionnaire",
    "FISMA: Controls Assessment",
    "CMMC: Level 2 Assessment",
    "NIST 800-53: Controls Implementation Checklist"
  ],
  "retail": [
    "PCI-DSS: SAQ D",
    "CCPA: Consumer Privacy Compliance Checklist",
    "ISO 27001: Retail Implementation Checklist",
    "GDPR: Retail-focused Data Protection Questionnaire"
  ],
  "tech-saas": [
    "SOC 2: Type II Readiness Assessment",
    "ISO 27001: Cloud Services Checklist",
    "GDPR: Data Protection Questionnaire",
    "CSA: Cloud Controls Matrix Self-Assessment"
  ]
};

// Healthcare-specific questionnaire details and requirements
export const healthcareQuestionnaires = {
  "HIPAA: Security Risk Assessment Tool": {
    purpose: "Protected Health Information (PHI) security assessment",
    applicability: "Healthcare providers, insurers, business associates",
    keyFocusAreas: [
      "Administrative safeguards",
      "Physical safeguards",
      "Technical safeguards",
      "Organizational requirements",
      "Policies and procedures"
    ],
    resourceLink: "HHS SRA Tool",
    requiredFor: "HIPAA compliance",
    criticalQuestions: [
      "Are encryption technologies implemented for ePHI?",
      "Are audit controls in place to track PHI access?",
      "Are workforce members trained on security policies?",
      "Is there a documented risk analysis process?",
      "Are there documented incident response procedures?"
    ]
  },
  "HIPAA: Privacy Rule Compliance Questionnaire": {
    purpose: "PHI privacy practices assessment",
    applicability: "Covered entities, business associates",
    keyFocusAreas: [
      "Notice of Privacy Practices",
      "Patient access rights",
      "Minimum necessary standards",
      "Administrative requirements",
      "Use and disclosure limitations"
    ],
    resourceLink: "OCR Privacy Rule Guidance",
    requiredFor: "HIPAA compliance",
    criticalQuestions: [
      "Is there a compliant Notice of Privacy Practices?",
      "Are processes in place for patient access to PHI?",
      "Are authorization procedures documented and followed?",
      "Is there a Privacy Officer appointed?",
      "Are minimum necessary standards implemented?"
    ]
  },
  "HIPAA: Breach Notification Readiness": {
    purpose: "Breach detection and notification preparedness",
    applicability: "Covered entities, business associates",
    keyFocusAreas: [
      "Breach detection capabilities",
      "Risk assessment procedures",
      "Notification timelines and processes",
      "Documentation requirements",
      "Media and HHS notification processes"
    ],
    resourceLink: "OCR Breach Notification Rule",
    requiredFor: "HIPAA compliance",
    criticalQuestions: [
      "Is there a defined process to identify breaches?",
      "Is there a documented breach risk assessment procedure?",
      "Are notification templates prepared?",
      "Are staff trained on breach identification?",
      "Is there a 60-day notification timeline procedure?"
    ]
  },
  "HITRUST: CSF Self-Assessment": {
    purpose: "Comprehensive healthcare security framework assessment",
    applicability: "Healthcare organizations seeking certification",
    keyFocusAreas: [
      "Information protection program",
      "Endpoint protection",
      "Portable media security",
      "Third-party assurance",
      "Incident management"
    ],
    resourceLink: "HITRUST CSF",
    requiredFor: "HITRUST certification",
    criticalQuestions: [
      "Is there a formal information security management program?",
      "Are controls mapped to multiple regulatory requirements?",
      "Is there a third-party risk management process?",
      "Are technical vulnerabilities managed through a structured process?",
      "Is there a business continuity plan specific to healthcare operations?"
    ]
  },
  "ONC: Security Risk Assessment Tool": {
    purpose: "Security risk assessment for EHR Meaningful Use",
    applicability: "Healthcare providers with EHR systems",
    keyFocusAreas: [
      "EHR system security",
      "PHI transmission security",
      "Access management",
      "Audit controls",
      "Device and media controls"
    ],
    resourceLink: "ONC SRA Tool",
    requiredFor: "Meaningful Use attestation",
    criticalQuestions: [
      "Are EHR systems protected by access controls?",
      "Is transmitted PHI encrypted?",
      "Are audit logs enabled and reviewed?",
      "Is there a documented contingency plan for EHR systems?",
      "Are mobile devices securely managed?"
    ]
  }
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
    isms: {
      implementation: "none",
      policies: [],
      plans: [],
      procedures: [],
      processes: [],
    },
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

// Helper function to auto-select appropriate compliance standards based on infrastructure type
export function autoSelectComplianceStandards(infraType: string): {
  complianceStandards: MatrixItem['complianceStandards'];
  regulatoryRequirements: MatrixItem['regulatoryRequirements'];
  standards: MatrixItem['standards'];
} {
  // Default all to false
  const complianceStandards: MatrixItem['complianceStandards'] = {
    pciDss: false,
    hipaa: false,
    cmmc: false,
    gdpr: false,
    ccpa: false,
    soc2: false,
    iso27001: false,
    cyberEssentialsUk: false,
    ferpa: false,
    glba: false,
    pipeda: false,
    ftcSafeguardRules: false,
    sbaCsg: false,
  };
  
  const regulatoryRequirements: MatrixItem['regulatoryRequirements'] = {
    pciDss: false,
    coppa: false,
    hipaa: false,
    gdpr: false,
    ccpa: false,
    glba: false,
    ferpa: false,
    pipeda: false,
    ftcSafeguardRules: false,
    fisma: false,
    dfars: false,
  };
  
  const standards: MatrixItem['standards'] = {
    iso27001: false,
    iso27002: false,
    nistCsf: false,
    nist80053: false,
    iso27018: false,
    iso27005: false,
    cisCsc: false,
    nist800171: false,
    itil: false,
    cobit: false,
  };
  
  // Set recommended standards for healthcare/sensitive data systems
  if (infraType === "website" || infraType === "cloud-servers" || infraType === "office-servers") {
    complianceStandards.hipaa = true;
    regulatoryRequirements.hipaa = true;
    standards.nistCsf = true;
    standards.iso27001 = true;
  }
  
  // Payment systems
  if (infraType === "website" || infraType === "commercial-internet") {
    complianceStandards.pciDss = true;
    regulatoryRequirements.pciDss = true;
  }
  
  // Customer data handling systems
  if (infraType === "website" || infraType === "cloud-servers" || infraType === "social-media") {
    complianceStandards.gdpr = true;
    regulatoryRequirements.gdpr = true;
    complianceStandards.ccpa = true;
    regulatoryRequirements.ccpa = true;
  }
  
  // Dedicated systems typically need stronger standards
  if (infraType === "dedicated-connection") {
    standards.nistCsf = true;
    standards.iso27001 = true;
    standards.iso27002 = true;
    complianceStandards.soc2 = true;
  }
  
  // Education systems
  if (infraType === "website" || infraType === "cloud-servers") {
    complianceStandards.ferpa = true;
    regulatoryRequirements.ferpa = true;
  }

  return { complianceStandards, regulatoryRequirements, standards };
}

// Generate matrix data based on selected operation modes and internet presence
export function generateInitialMatrixData(operationModes: string[], internetPresence: string[]): MatrixItem[] {
  const matrixData: MatrixItem[] = [];
  
  // Add operation modes to matrix
  operationModes.forEach(mode => {
    const baseMatrixItem = createMatrixItemForInfraMode(mode);
    
    // Auto-select appropriate compliance standards based on infrastructure type
    const autoSelectedStandards = autoSelectComplianceStandards(mode);
    
    // Merge the auto-selected standards with the base matrix item
    const enhancedMatrixItem: MatrixItem = {
      ...baseMatrixItem,
      complianceStandards: autoSelectedStandards.complianceStandards,
      regulatoryRequirements: autoSelectedStandards.regulatoryRequirements,
      standards: autoSelectedStandards.standards
    };
    
    matrixData.push(enhancedMatrixItem);
  });
  
  // Add internet presence to matrix
  internetPresence.forEach(presence => {
    const baseMatrixItem = createMatrixItemForInfraMode(presence);
    
    // Auto-select appropriate compliance standards based on infrastructure type
    const autoSelectedStandards = autoSelectComplianceStandards(presence);
    
    // Merge the auto-selected standards with the base matrix item
    const enhancedMatrixItem: MatrixItem = {
      ...baseMatrixItem,
      complianceStandards: autoSelectedStandards.complianceStandards,
      regulatoryRequirements: autoSelectedStandards.regulatoryRequirements,
      standards: autoSelectedStandards.standards
    };
    
    matrixData.push(enhancedMatrixItem);
  });
  
  return matrixData;
}