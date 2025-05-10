// Matrix mappings for different infrastructure modes
import { MatrixItem } from "./sos2a-types";

// Comprehensive Standards & Guidelines list organized by category
export const standardsAndGuidelinesLibrary = {
  // Universal Security Standards (Mandatory)
  universal: [
    { id: "iso-27001", name: "ISO 27001 - Information Security Management System (ISMS)", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "iso-27002", name: "ISO 27002 - Controls for information security", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "nist-csf", name: "NIST Cybersecurity Framework (CSF)", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "nist-800-53", name: "NIST SP 800-53 - Security controls", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "cis-controls", name: "CIS Controls - 18 prioritized security best practices", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "soc-2", name: "SOC 2 - Security, Availability, Confidentiality", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "pci-dss", name: "PCI-DSS - Payment Card Industry Data Security Standard", isHealthcareRelevant: false, type: "standard", enforcement: "mandatory" }
  ],
  
  // Healthcare-Specific Standards (Mandatory)
  healthcare: [
    { id: "hipaa-security", name: "HIPAA Security Rule - U.S. mandate for protecting health data (PHI)", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "hitrust-csf", name: "HITRUST CSF - Certifiable framework combining HIPAA, ISO 27001, NIST", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "hipaa-privacy", name: "HIPAA Privacy Rule - Governs PHI use/disclosure", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "21-cfr-part-11", name: "21 CFR Part 11 (FDA) - Electronic records/signatures for medical devices", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "gdpr-healthcare", name: "GDPR (for EU healthcare) - Protects patient data in Europe", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "nist-800-66", name: "NIST SP 800-66 - HIPAA Security Rule implementation guide", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "dicom-security", name: "DICOM Security - Medical imaging data protection", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "hl7-fhir-security", name: "HL7 FHIR Security - Standards for healthcare API security", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" }
  ],
  
  // Government & Critical Infrastructure Standards (Mandatory)
  government: [
    { id: "fisma", name: "FISMA - U.S. federal agency security", isHealthcareRelevant: false, type: "standard", enforcement: "mandatory" },
    { id: "fedramp", name: "FedRAMP - Cloud security for U.S. government", isHealthcareRelevant: false, type: "standard", enforcement: "mandatory" },
    { id: "cmmc", name: "CMMC - Cybersecurity Maturity Model Certification", isHealthcareRelevant: false, type: "standard", enforcement: "mandatory" },
    { id: "nerc-cip", name: "NERC CIP - North American electric grid security", isHealthcareRelevant: false, type: "standard", enforcement: "mandatory" }
  ],
  
  // Financial & Payment Standards (Mandatory)
  financial: [
    { id: "glba", name: "GLBA - Gramm-Leach-Bliley Act (financial data)", isHealthcareRelevant: false, type: "standard", enforcement: "mandatory" },
    { id: "sox", name: "SOX - Sarbanes-Oxley (financial reporting controls)", isHealthcareRelevant: false, type: "standard", enforcement: "mandatory" },
    { id: "psd2", name: "PSD2 - EU payment services directive", isHealthcareRelevant: false, type: "standard", enforcement: "mandatory" }
  ],
  
  // Cloud & Data Privacy Standards (Mandatory)
  privacy: [
    { id: "iso-27701", name: "ISO 27701 - Privacy extension to ISO 27001", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "ccpa", name: "CCPA - California Consumer Privacy Act", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "soc-1", name: "SOC 1 - Financial reporting controls (SSAE 18)", isHealthcareRelevant: false, type: "standard", enforcement: "mandatory" }
  ],
  
  // Emerging & Regional Standards (Mandatory)
  regional: [
    { id: "apec-cbpr", name: "APEC CBPR - Asia-Pacific Economic Cooperation Cross-Border Privacy Rules", isHealthcareRelevant: false, type: "standard", enforcement: "mandatory" },
    { id: "pdpa-thailand", name: "PDPA (Thailand) - Personal Data Protection Act", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "lgpd-brazil", name: "LGPD (Brazil) - Lei Geral de Proteção de Dados", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "pipa-south-korea", name: "PIPA (South Korea) - Personal Information Protection Act", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" },
    { id: "pipl-china", name: "PIPL (China) - Personal Information Protection Law", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" }
  ],
  
  // Industry-Specific Standards (Mandatory)
  industry: [
    { id: "iec-62443", name: "IEC 62443 - Industrial control systems (ICS)", isHealthcareRelevant: false, type: "standard", enforcement: "mandatory" },
    { id: "tisax", name: "TISAX - Automotive industry security", isHealthcareRelevant: false, type: "standard", enforcement: "mandatory" },
    { id: "fips-140", name: "FIPS 140-2/3 - Cryptographic module validation", isHealthcareRelevant: true, type: "standard", enforcement: "mandatory" }
  ],
  
  // Regional Guidelines (Voluntary)
  regionalGuidelines: [
    { id: "cccs-33", name: "CCCS 33 (Canada) - Baseline cyber requirements", isHealthcareRelevant: false, type: "guideline", enforcement: "voluntary" },
    { id: "ens-spain", name: "ENS (Spain) - National Security Framework", isHealthcareRelevant: false, type: "guideline", enforcement: "voluntary" },
    { id: "meiti", name: "MEITI (Saudi Arabia) - Critical infrastructure protection", isHealthcareRelevant: false, type: "guideline", enforcement: "voluntary" }
  ],
  
  // Universal Security Guidelines (Voluntary)
  universalGuidelines: [
    { id: "nist-800-171", name: "NIST SP 800-171 - Protecting Controlled Unclassified Information (CUI)", isHealthcareRelevant: false, type: "guideline", enforcement: "voluntary" },
    { id: "nist-800-63", name: "NIST SP 800-63 - Digital Identity Guidelines (Authentication)", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" },
    { id: "cis-benchmarks", name: "CIS Benchmarks - Configuration baselines for OS/apps", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" },
    { id: "owasp-top-10", name: "OWASP Top 10 - Web application security risks", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" },
    { id: "sans-csc", name: "SANS Critical Security Controls - Prioritized defense actions", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" },
    { id: "iso-27004", name: "ISO/IEC 27004 - Information security measurement metrics", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" }
  ],
  
  // Healthcare-Specific Guidelines (Voluntary)
  healthcareGuidelines: [
    { id: "nist-800-66-r2", name: "NIST SP 800-66 Rev. 2 - HIPAA Security Rule implementation guide", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" },
    { id: "hhs-hipaa-security", name: "HHS HIPAA Security Series - Detailed guidance (Risk analysis, Encryption, Breach)", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" },
    { id: "fda-medical-cybersec", name: "FDA Pre-market Cybersecurity Guidance - Medical device security", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" },
    { id: "mds2", name: "MDS2 (Medical Device Security Standard) - Manufacturer disclosure form", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" },
    { id: "nh-isac", name: "NH-ISAC Healthcare Cybersecurity Framework - Threat intelligence sharing", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" },
    { id: "ama-cybersec", name: "AMA Cybersecurity Guidelines - Physician practice recommendations", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" }
  ],
  
  // Government Guidelines (Voluntary)
  governmentGuidelines: [
    { id: "nist-ir-8374", name: "NIST IR 8374 - Cybersecurity Framework for critical infrastructure", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" },
    { id: "cisa-healthcare", name: "CISA Healthcare Sector Cybersecurity Guidelines - U.S. critical infrastructure", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" },
    { id: "enisa-healthcare", name: "ENISA Healthcare Cybersecurity Guidelines (EU)", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" }
  ],
  
  // Privacy Guidelines (Voluntary)
  privacyGuidelines: [
    { id: "nist-privacy", name: "NIST Privacy Framework - Complement to NIST CSF", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" },
    { id: "edpb-gdpr", name: "EDPB GDPR Guidelines - EU data protection interpretations", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" },
    { id: "hhs-hipaa-cloud", name: "HHS Guidance on HIPAA & Cloud Computing", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" }
  ],
  
  // Cloud & IoT Guidelines (Voluntary)
  cloudGuidelines: [
    { id: "csa-cloud-matrix", name: "CSA Cloud Controls Matrix - Cloud security best practices", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" },
    { id: "nist-800-144", name: "NIST SP 800-144 - Cloud computing security guidelines", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" },
    { id: "iomt-security", name: "IoMT (Internet of Medical Things) Security Guidelines - H-ISAC", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" }
  ],
  
  // Operational Guidelines (Voluntary)
  operationalGuidelines: [
    { id: "nist-800-61", name: "NIST SP 800-61 - Computer Security Incident Handling Guide", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" },
    { id: "nist-800-40", name: "NIST SP 800-40 Rev. 4 - Patch management", isHealthcareRelevant: true, type: "guideline", enforcement: "voluntary" },
    { id: "bis-3", name: "BIS 3.0 - Banking industry security guidelines", isHealthcareRelevant: false, type: "guideline", enforcement: "voluntary" }
  ]
};

// Healthcare Standards with Key Requirements
export const healthcareStandardDetails = {
  "hipaa-security": {
    scope: "U.S. healthcare providers",
    keyRequirements: ["Encryption", "Access controls", "Audit logs"],
    importance: "High"
  },
  "hitrust-csf": {
    scope: "Certifiable (HIPAA + ISO 27001)",
    keyRequirements: ["19 domains", "156 controls"],
    importance: "High"
  },
  "21-cfr-part-11": {
    scope: "FDA-regulated medical devices",
    keyRequirements: ["Audit trails", "Electronic signatures"],
    importance: "High"
  },
  "dicom-security": {
    scope: "Medical imaging systems",
    keyRequirements: ["Secure storage/transmission of MRI/X-rays"],
    importance: "Medium"
  }
};

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
  // Restructured to match the specific ACQ Tool categories based on comprehensive framework information
  
  // Category 1: Assessments - For comprehensive evaluations
  assessments: [
    { id: "hipaa-sra", name: "HIPAA Security Risk Assessment (SRA) Tool", purpose: "Protected Health Information (PHI) security", applicability: "Healthcare providers, insurers, business associates" },
    { id: "nist-csf-assessment", name: "NIST Cybersecurity Framework Self-Assessment", purpose: "Cyber risk management", applicability: "Critical infrastructure, federal agencies" },
    { id: "iso-27001-assessment", name: "ISO 27001 Self-Assessment Questionnaire", purpose: "Information Security Management System (ISMS)", applicability: "Organizations of all sizes" },
    { id: "soc2-readiness", name: "SOC 2 Readiness Questionnaire", purpose: "Trust services criteria (security, availability, confidentiality)", applicability: "Cloud service providers, SaaS companies" },
    { id: "cis-csat", name: "CIS Controls Self-Assessment Tool (CSAT)", purpose: "Foundational cybersecurity practices", applicability: "All organizations" },
    { id: "fedramp-saq", name: "FedRAMP Security Assessment Questionnaire", purpose: "Cloud security for U.S. government", applicability: "Cloud service providers" },
    { id: "hitrust-mycsf", name: "HITRUST MyCSF Self-Assessment", purpose: "Healthcare-specific security framework", applicability: "Healthcare organizations" }
  ],
  
  // Category 2: Checklists - For verification and validation
  checklists: [
    { id: "ccpa-checklist", name: "CCPA Compliance Checklist", purpose: "California consumer privacy", applicability: "Businesses handling CA resident data" },
    { id: "ferpa-checklist", name: "FERPA Compliance Checklist", purpose: "Education records privacy", applicability: "Educational institutions" },
    { id: "fisma-checklist", name: "FISMA Compliance Checklist", purpose: "Federal information security", applicability: "Federal agencies, contractors" },
    { id: "glba-safeguards", name: "GLBA Safeguards Rule Self-Assessment", purpose: "Financial information protection", applicability: "Financial institutions" },
    { id: "nydfs-cybersecurity", name: "NYDFS Cybersecurity Self-Assessment", purpose: "Financial services cybersecurity", applicability: "NY-regulated financial institutions" },
    { id: "sox-itgc", name: "SOX IT General Controls (ITGC) Questionnaire", purpose: "Financial reporting IT controls", applicability: "Public companies" }
  ],
  
  // Category 3: Questionnaires - PCI-DSS and other specialized questionnaires
  questionnaires: [
    // PCI-DSS SAQs (Payment Card Industry Data Security Standard)
    { id: "saq-a", name: "PCI-DSS SAQ A", purpose: "Payment security", applicability: "Card-not-present merchants, third-party processing" },
    { id: "saq-a-ep", name: "PCI-DSS SAQ A-EP", purpose: "Payment security", applicability: "E-commerce merchants with third-party processing" },
    { id: "saq-b", name: "PCI-DSS SAQ B", purpose: "Payment security", applicability: "Merchants with imprint-only or standalone terminals" },
    { id: "saq-b-ip", name: "PCI-DSS SAQ B-IP", purpose: "Payment security", applicability: "Merchants with standalone IP-connected terminals" },
    { id: "saq-c", name: "PCI-DSS SAQ C", purpose: "Payment security", applicability: "Merchants with payment application systems" },
    { id: "saq-c-vt", name: "PCI-DSS SAQ C-VT", purpose: "Payment security", applicability: "Merchants with virtual terminals" },
    { id: "saq-d-merchant", name: "PCI-DSS SAQ D (Merchant)", purpose: "Payment security", applicability: "All merchants not eligible for other SAQs" },
    { id: "saq-p2pe-hw", name: "PCI-DSS SAQ P2PE-HW", purpose: "Payment security", applicability: "Hardware payment terminal P2PE" },
    
    // Other regulatory questionnaires
    { id: "gdpr-compliance", name: "GDPR Compliance Questionnaire", purpose: "EU data protection", applicability: "Organizations processing EU citizen data" },
    { id: "hipaa-privacy", name: "HIPAA Privacy Rule Questionnaire", purpose: "PHI privacy practices", applicability: "Healthcare organizations, business associates" },
    { id: "hipaa-breach", name: "HIPAA Breach Notification Assessment", purpose: "Breach notification readiness", applicability: "Healthcare organizations" }
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
  
  // Get basic universal standards and guidelines to recommend initially
  const initialStandards = [
    ...standardsAndGuidelinesLibrary.universal.map(standard => ({
      id: standard.id,
      name: standard.name,
      isHealthcareRelevant: standard.isHealthcareRelevant || false
    })),
    ...standardsAndGuidelinesLibrary.universalGuidelines.map(guideline => ({
      id: guideline.id,
      name: guideline.name,
      isHealthcareRelevant: guideline.isHealthcareRelevant || false
    }))
  ];
  
  // Initialize the matrix item with the appropriate values
  return {
    infraType,
    risks: commonRisks[infraType as keyof typeof commonRisks] || [],
    vulnerabilities: commonVulnerabilities[infraType as keyof typeof commonVulnerabilities] || [],
    educationAwareness: educationAwarenessNeeded[infraType as keyof typeof educationAwarenessNeeded] || false,
    ismsImplemented: false,
    riskManagementProcess: false,
    isms: {
      processes: [],
      implementation: "none",
      policies: [],
      plans: [],
      procedures: []
    },
    relevantQuestionnaires: relevantQuestionnaires[infraType as keyof typeof relevantQuestionnaires] || [],
    // Initialize with recommended standards from our library
    recommendedStandards: initialStandards,
    // Initialize ACQ tools categories from a lookup table
    relevantACQTools: {
      // Standard assessments for all infrastructure types
      assessments: infraType === 'healthcare' ? 
                  [...assessmentTools.assessments.map(item => item.name)] : 
                  (assessmentTools.legacy_questionnaires && 
                   infraType in assessmentTools.legacy_questionnaires ? 
                   [...assessmentTools.legacy_questionnaires[infraType as keyof typeof assessmentTools.legacy_questionnaires]] : 
                   []),
      
      // Add standard checklists based on infrastructure type
      checklists: infraType === 'website' ?
                 assessmentTools.checklists.filter(item => item.id === "ccpa-checklist" || item.id === "gdpr-compliance").map(item => item.name) :
                 (infraType === 'cloud-servers' ?
                 assessmentTools.checklists.filter(item => item.id === "cis-csat" || item.id === "sox-itgc").map(item => item.name) :
                 []),
      
      // Add questionnaires based on infrastructure type
      questionnaires: infraType === 'commercial-internet' || infraType === 'website' ?
                     assessmentTools.questionnaires.filter(item => 
                       item.id.startsWith("saq-") || item.id === "gdpr-compliance").map(item => item.name).slice(0, 3) :
                     [],
    },
    // 10 Security Parameters with default values
    accessControl: {
      userAccessManagement: false,
      privilegeManagement: false,
      multiFactorAuth: false,
      passwordPolicy: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    dataProtection: {
      dataEncryption: false,
      dataClassification: false,
      dataBackup: false,
      dataDeletion: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    securityAwareness: {
      trainingProgram: false,
      phishingSimulations: false,
      securityCulture: false,
      incidentReporting: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    incidentResponse: {
      irPlan: false,
      irTeam: false,
      irTesting: false,
      forensicCapabilities: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    networkSecurity: {
      firewalls: false,
      segmentation: false,
      intrusionDetection: false,
      wirelessSecurity: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    applicationSecurity: {
      secureCoding: false,
      vulnerabilityScanning: false,
      patchManagement: false,
      secureDeployment: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    thirdPartyManagement: {
      vendorAssessment: false,
      contractualRequirements: false,
      ongoingMonitoring: false,
      offboardingProcess: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    assetManagement: {
      inventoryManagement: false,
      assetClassification: false,
      endOfLifeManagement: false,
      assetTracking: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    securityGovernance: {
      securityPolicies: false,
      riskAssessment: false,
      complianceManagement: false,
      securityRoles: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    complianceManagement: {
      regulatoryMapping: false,
      complianceMonitoring: false,
      auditPreparation: false,
      remediationTracking: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    // isms property moved to top level
    ismsDetails: {
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
    // Add the 12 SOS²A Parameters
    infrastructureMode: {
      cloud: infraType.includes('cloud'),
      hybrid: false,
      onPremises: !infraType.includes('cloud') && !infraType.includes('mobile'),
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    securityRisks: {
      assessmentPerformed: false,
      vulnerabilitiesDocumented: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    baselineConfig: {
      documented: false,
      reviewed: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    securityControlFramework: {
      nist: false,
      iso27001: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    complianceRequirements: {
      hipaa: false,
      gdpr: false,
      pci: false,
      cmmc: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    regulatoryReqs: {
      dfars: false,
      nistsp800: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    standardsGuidelines: {
      fips: false,
      fedramp: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    relevantAcqTools: {
      sam: false,
      sbir: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    adversarialInsight: {
      mitreMapped: false,
      threatModeling: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    informationSecurityManagementSystem: {
      ismsImplemented: false,
      iso27001Compliant: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    deviceInventoryTracking: {
      inventorySystem: false,
      updatedRegularly: false,
      assetTagging: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
    identityBehaviorHygiene: {
      userAwarnessTraining: false,
      passwordPolicy: false,
      mfaImplemented: false,
      implementationLevel: 0,
      gaps: [],
      notes: "",
    },
  };
}

// Helper function to auto-select appropriate compliance standards based on infrastructure type
export function autoSelectComplianceStandards(infraType: string, industry: string = ""): {
  complianceStandards: MatrixItem['complianceStandards'];
  regulatoryRequirements: MatrixItem['regulatoryRequirements'];
  standards: MatrixItem['standards'];
  recommendedStandards?: Array<{id: string, name: string, isHealthcareRelevant: boolean}>;
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
  
  // Array to store recommended standards from our comprehensive library
  let recommendedStandards: Array<{id: string, name: string, isHealthcareRelevant: boolean}> = [];
  
  // Always include these universal standards and guidelines as a baseline
  recommendedStandards = recommendedStandards.concat(standardsAndGuidelinesLibrary.universal);
  recommendedStandards = recommendedStandards.concat(standardsAndGuidelinesLibrary.universalGuidelines);
  
  // Check if healthcare industry
  const isHealthcare = industry.toLowerCase() === "healthcare";
  
  // Set recommended standards for healthcare/sensitive data systems
  if (infraType === "website" || infraType === "cloud-servers" || infraType === "office-servers") {
    complianceStandards.hipaa = true;
    regulatoryRequirements.hipaa = true;
    standards.nistCsf = true;
    standards.iso27001 = true;
    
    // Add healthcare standards for these infrastructure types
    if (isHealthcare) {
      recommendedStandards = recommendedStandards.concat(standardsAndGuidelinesLibrary.healthcare);
      // Also add healthcare-specific guidelines for these infrastructure types
      recommendedStandards = recommendedStandards.concat(standardsAndGuidelinesLibrary.healthcareGuidelines);
    }
  }
  
  // Payment systems
  if (infraType === "website" || infraType === "commercial-internet") {
    complianceStandards.pciDss = true;
    regulatoryRequirements.pciDss = true;
    
    // Add financial standards
    recommendedStandards = recommendedStandards.concat(standardsAndGuidelinesLibrary.financial);
  }
  
  // Customer data handling systems
  if (infraType === "website" || infraType === "cloud-servers" || infraType === "social-media") {
    complianceStandards.gdpr = true;
    regulatoryRequirements.gdpr = true;
    complianceStandards.ccpa = true;
    regulatoryRequirements.ccpa = true;
    
    // Add privacy standards and guidelines
    recommendedStandards = recommendedStandards.concat(standardsAndGuidelinesLibrary.privacy);
    recommendedStandards = recommendedStandards.concat(standardsAndGuidelinesLibrary.privacyGuidelines);
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
  
  // If the industry is government/critical infrastructure
  if (industry.toLowerCase() === "government" || industry.toLowerCase() === "critical infrastructure") {
    recommendedStandards = recommendedStandards.concat(standardsAndGuidelinesLibrary.government);
    recommendedStandards = recommendedStandards.concat(standardsAndGuidelinesLibrary.governmentGuidelines);
  }
  
  // If the industry is finance
  if (industry.toLowerCase() === "finance" || industry.toLowerCase() === "banking") {
    recommendedStandards = recommendedStandards.concat(standardsAndGuidelinesLibrary.financial);
    // Also add operational guidelines for financial institutions
    recommendedStandards = recommendedStandards.concat(standardsAndGuidelinesLibrary.operationalGuidelines);
  }
  
  // Remove duplicates from recommendedStandards
  recommendedStandards = recommendedStandards.filter((standard, index, self) => 
    index === self.findIndex((s) => s.id === standard.id)
  );
  
  // Sort standards to put healthcare-relevant ones at the top when industry is healthcare
  if (isHealthcare) {
    recommendedStandards.sort((a, b) => {
      if (a.isHealthcareRelevant && !b.isHealthcareRelevant) return -1;
      if (!a.isHealthcareRelevant && b.isHealthcareRelevant) return 1;
      return 0;
    });
  }

  return { complianceStandards, regulatoryRequirements, standards, recommendedStandards };
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
      standards: autoSelectedStandards.standards,
      // Add the recommended standards to a new property (will need to update MatrixItem type)
      recommendedStandards: autoSelectedStandards.recommendedStandards || []
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
      standards: autoSelectedStandards.standards,
      // Add the recommended standards to a new property
      recommendedStandards: autoSelectedStandards.recommendedStandards || []
    };
    
    matrixData.push(enhancedMatrixItem);
  });
  
  return matrixData;
}