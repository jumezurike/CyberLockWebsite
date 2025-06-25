import { ExpertKnowledgeConfiguration, GapAnalysisParameter } from './gap-analysis-types';

/**
 * Expert knowledge configuration for SOS²A gap analysis
 * 
 * This configuration contains the expert-determined requirements for each parameter
 * that organizations should implement based on their profile.
 */
export const expertKnowledgeConfig: ExpertKnowledgeConfiguration = {
  requirements: {
    // 1. ACCESS CONTROL (10%)
    "AccessControl": [
      {
        controlId: 'AC-1',
        name: 'Access Control Policy',
        description: 'Formal access control policy that defines roles, responsibilities, and procedures',
        expectedLevel: 4,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls']
      },
      {
        controlId: 'AC-2',
        name: 'Account Management',
        description: 'Process for requesting, establishing, issuing, and closing user accounts',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls']
      },
      {
        controlId: 'AC-3',
        name: 'Least Privilege',
        description: 'Principle of least privilege implemented for all user and system accounts',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls']
      },
      {
        controlId: 'AC-4',
        name: 'Strong Authentication',
        description: 'Multi-factor authentication for all privileged accounts and remote access',
        expectedLevel: 4,
        industry: ['Healthcare', 'Financial'],
        infraComponents: ['remote-access', 'cloud-hosted'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls', 'HIPAA', 'PCI-DSS']
      },
      {
        controlId: 'AC-5',
        name: 'Access Review',
        description: 'Regular review and validation of access rights',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'HIPAA', 'PCI-DSS']
      }
    ],
    
    // 2. DATA PROTECTION (10%)
    "DataProtection": [
      {
        controlId: 'DP-1',
        name: 'Data Classification',
        description: 'Data classification policy and procedures',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls']
      },
      {
        controlId: 'DP-2',
        name: 'Encryption at Rest',
        description: 'Encryption of sensitive data at rest',
        expectedLevel: 4,
        industry: ['Healthcare', 'Financial'],
        infraComponents: ['data-storage', 'cloud-hosted'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'HIPAA', 'PCI-DSS']
      },
      {
        controlId: 'DP-3',
        name: 'Encryption in Transit',
        description: 'Encryption of sensitive data in transit',
        expectedLevel: 4,
        industry: ['Healthcare', 'Financial'],
        infraComponents: ['internet-facing', 'remote-access', 'cloud-hosted'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'HIPAA', 'PCI-DSS']
      },
      {
        controlId: 'DP-4',
        name: 'Data Backup',
        description: 'Regular backup of critical data with encryption',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls']
      },
      {
        controlId: 'DP-5',
        name: 'Data Destruction',
        description: 'Secure data destruction procedures',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'HIPAA', 'PCI-DSS']
      }
    ],
    
    // 3. SECURITY AWARENESS (10%)
    "SecurityAwareness": [
      {
        controlId: 'SA-1',
        name: 'Security Awareness Program',
        description: 'Formal security awareness and training program',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls']
      },
      {
        controlId: 'SA-2',
        name: 'Phishing Training',
        description: 'Regular phishing simulation exercises',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government'],
        frameworks: ['NIST SP 800-53', 'CIS Controls']
      },
      {
        controlId: 'SA-3',
        name: 'Compliance Training',
        description: 'Industry-specific compliance training',
        expectedLevel: 4,
        industry: ['Healthcare', 'Financial'],
        frameworks: ['HIPAA', 'PCI-DSS', 'GDPR']
      },
      {
        controlId: 'SA-4',
        name: 'Security Updates',
        description: 'Regular security updates and bulletins for staff',
        expectedLevel: 2,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001']
      }
    ],
    
    // 4. INCIDENT RESPONSE (10%)
    "IncidentResponse": [
      {
        controlId: 'IR-1',
        name: 'Incident Response Plan',
        description: 'Documented incident response plan with defined roles and responsibilities',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls']
      },
      {
        controlId: 'IR-2',
        name: 'Incident Response Team',
        description: 'Established incident response team with defined roles',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government'],
        frameworks: ['NIST SP 800-53', 'ISO 27001']
      },
      {
        controlId: 'IR-3',
        name: 'Incident Testing',
        description: 'Regular testing of incident response procedures',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'HIPAA']
      },
      {
        controlId: 'IR-4',
        name: 'Incident Reporting',
        description: 'Procedures for reporting and documenting security incidents',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'HIPAA', 'PCI-DSS']
      },
      {
        controlId: 'IR-5',
        name: 'Incident Analysis',
        description: 'Process for analyzing and learning from security incidents',
        expectedLevel: 2,
        industry: ['Healthcare', 'Financial', 'Government'],
        frameworks: ['NIST SP 800-53', 'ISO 27001']
      }
    ],
    
    // 5. NETWORK SECURITY (10%)
    "NetworkSecurity": [
      {
        controlId: 'NS-1',
        name: 'Network Segmentation',
        description: 'Logical separation of critical network segments',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government'],
        infraComponents: ['enterprise-network', 'multi-site'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls']
      },
      {
        controlId: 'NS-2',
        name: 'Firewall Protection',
        description: 'Properly configured firewalls with restrictive rules',
        expectedLevel: 4,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        infraComponents: ['internet-facing', 'remote-access'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls', 'PCI-DSS']
      },
      {
        controlId: 'NS-3',
        name: 'Intrusion Detection/Prevention',
        description: 'Intrusion detection or prevention systems monitoring network traffic',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government'],
        infraComponents: ['internet-facing', 'enterprise-network'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls']
      },
      {
        controlId: 'NS-4',
        name: 'Secure Remote Access',
        description: 'Secure VPN or other encrypted remote access solution',
        expectedLevel: 4,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        infraComponents: ['remote-access'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls', 'HIPAA', 'PCI-DSS']
      },
      {
        controlId: 'NS-5',
        name: 'Network Monitoring',
        description: 'Continuous network monitoring and logging',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government'],
        infraComponents: ['internet-facing', 'enterprise-network'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls']
      }
    ],
    
    // 6. APPLICATION SECURITY (10%)
    "ApplicationSecurity": [
      {
        controlId: 'AS-1',
        name: 'Secure Development',
        description: 'Secure software development lifecycle (SDLC) practices',
        expectedLevel: 3,
        industry: ['Technology', 'Financial', 'Healthcare'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'OWASP']
      },
      {
        controlId: 'AS-2',
        name: 'Application Testing',
        description: 'Regular security testing of applications including static and dynamic analysis',
        expectedLevel: 3,
        industry: ['Technology', 'Financial', 'Healthcare'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'OWASP']
      },
      {
        controlId: 'AS-3',
        name: 'Secure Configuration',
        description: 'Secure baseline configurations for applications',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls', 'OWASP']
      },
      {
        controlId: 'AS-4',
        name: 'Input Validation',
        description: 'Input validation controls for all applications',
        expectedLevel: 3,
        industry: ['Technology', 'Financial', 'Healthcare'],
        infraComponents: ['internet-facing'],
        frameworks: ['NIST SP 800-53', 'OWASP']
      },
      {
        controlId: 'AS-5',
        name: 'API Security',
        description: 'Security controls for APIs including authentication and authorization',
        expectedLevel: 3,
        industry: ['Technology', 'Financial'],
        infraComponents: ['internet-facing', 'cloud-hosted'],
        frameworks: ['NIST SP 800-53', 'OWASP']
      }
    ],
    
    // 7. THIRD-PARTY MANAGEMENT (10%)
    "ThirdPartyManagement": [
      {
        controlId: 'TP-1',
        name: 'Vendor Assessment',
        description: 'Process for assessing security posture of third-party vendors',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'HIPAA', 'PCI-DSS']
      },
      {
        controlId: 'TP-2',
        name: 'Vendor Contracts',
        description: 'Security and privacy requirements in vendor contracts',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'HIPAA', 'PCI-DSS']
      },
      {
        controlId: 'TP-3',
        name: 'Vendor Access Control',
        description: 'Controls for managing third-party access to systems and data',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'HIPAA', 'PCI-DSS']
      },
      {
        controlId: 'TP-4',
        name: 'Vendor Monitoring',
        description: 'Ongoing monitoring of vendor security compliance',
        expectedLevel: 2,
        industry: ['Healthcare', 'Financial'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'HIPAA', 'PCI-DSS']
      }
    ],
    
    // 8. ASSET MANAGEMENT (10%)
    "AssetManagement": [
      {
        controlId: 'AM-1',
        name: 'Asset Inventory',
        description: 'Comprehensive inventory of hardware and software assets',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls']
      },
      {
        controlId: 'AM-2',
        name: 'Asset Classification',
        description: 'Classification of assets based on criticality and sensitivity',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government'],
        frameworks: ['NIST SP 800-53', 'ISO 27001']
      },
      {
        controlId: 'AM-3',
        name: 'Endpoint Protection',
        description: 'Endpoint protection on all managed devices',
        expectedLevel: 4,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls', 'HIPAA', 'PCI-DSS']
      },
      {
        controlId: 'AM-4',
        name: 'Patch Management',
        description: 'Timely application of security patches to all systems',
        expectedLevel: 4,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls', 'HIPAA', 'PCI-DSS']
      },
      {
        controlId: 'AM-5',
        name: 'Software License Management',
        description: 'Management of software licenses and versions',
        expectedLevel: 2,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001']
      }
    ],
    
    // 9. SECURITY GOVERNANCE (10%)
    "SecurityGovernance": [
      {
        controlId: 'SG-1',
        name: 'Security Policy',
        description: 'Comprehensive information security policy',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls']
      },
      {
        controlId: 'SG-2',
        name: 'Risk Assessment',
        description: 'Regular security risk assessments',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'HIPAA', 'PCI-DSS']
      },
      {
        controlId: 'SG-3',
        name: 'Security Roles',
        description: 'Defined security roles and responsibilities',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government'],
        frameworks: ['NIST SP 800-53', 'ISO 27001']
      },
      {
        controlId: 'SG-4',
        name: 'Security Metrics',
        description: 'Defined security metrics and regular reporting',
        expectedLevel: 2,
        industry: ['Healthcare', 'Financial', 'Government'],
        frameworks: ['NIST SP 800-53', 'ISO 27001']
      },
      {
        controlId: 'SG-5',
        name: 'Executive Support',
        description: 'Executive-level support and oversight of security program',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government'],
        frameworks: ['NIST SP 800-53', 'ISO 27001']
      }
    ],
    
    // 10. COMPLIANCE MANAGEMENT (10%)
    "ComplianceManagement": [
      {
        controlId: 'CM-1',
        name: 'Compliance Identification',
        description: 'Identification of applicable regulatory and compliance requirements',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'HIPAA', 'PCI-DSS', 'GDPR']
      },
      {
        controlId: 'CM-2',
        name: 'Compliance Monitoring',
        description: 'Regular monitoring and assessment of compliance status',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'HIPAA', 'PCI-DSS', 'GDPR']
      },
      {
        controlId: 'CM-3',
        name: 'Audit Management',
        description: 'Management of internal and external security audits',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'HIPAA', 'PCI-DSS', 'GDPR']
      },
      {
        controlId: 'CM-4',
        name: 'Documentation Management',
        description: 'Management of compliance documentation and evidence',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'HIPAA', 'PCI-DSS', 'GDPR']
      },
      {
        controlId: 'CM-5',
        name: 'Regulatory Changes',
        description: 'Process for tracking and implementing regulatory changes',
        expectedLevel: 2,
        industry: ['Healthcare', 'Financial'],
        frameworks: ['HIPAA', 'PCI-DSS', 'GDPR']
      }
    ],
    
    // 11. IDENTITY & ACCESS MANAGEMENT (IAM) (~9.09%)
    "IAM": [
      {
        controlId: 'IAM-1',
        name: 'Identity Lifecycle Management',
        description: 'Comprehensive management of digital identities from creation to deactivation',
        expectedLevel: 4,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Manufacturing', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls']
      },
      {
        controlId: 'IAM-2',
        name: 'Privileged Access Management',
        description: 'Enhanced controls for privileged and administrative accounts',
        expectedLevel: 4,
        industry: ['Healthcare', 'Financial', 'Government'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'HIPAA', 'PCI-DSS']
      },
      {
        controlId: 'IAM-3',
        name: 'Identity Behavior Analytics',
        description: 'Monitoring and analysis of user behavior patterns for anomaly detection',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government'],
        frameworks: ['NIST SP 800-53', 'ISO 27001']
      },
      {
        controlId: 'IAM-4',
        name: 'Single Sign-On (SSO)',
        description: 'Centralized authentication system for improved user experience and security',
        expectedLevel: 3,
        industry: ['Healthcare', 'Financial', 'Government', 'Education', 'Technology'],
        frameworks: ['NIST SP 800-53', 'ISO 27001', 'CIS Controls']
      },
      {
        controlId: 'IAM-5',
        name: 'Identity Federation',
        description: 'Secure identity sharing across organizational boundaries',
        expectedLevel: 2,
        industry: ['Healthcare', 'Financial', 'Government'],
        infraComponents: ['cloud-hosted', 'hybrid'],
        frameworks: ['NIST SP 800-53', 'ISO 27001']
      }
    ]
  }
};