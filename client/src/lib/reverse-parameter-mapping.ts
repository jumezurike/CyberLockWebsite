/**
 * Reverse SOS²A Parameter Mapping
 * 
 * This file contains the reverse mapping between the 12 default SOS²A parameters
 * and the security parameters used in gap analysis.
 * 
 * This reverse mapping demonstrates how each assessment parameter intersects with 
 * security domains, creating a top-down view of the assessment framework.
 * 
 * The 12 default SOS²A parameters are:
 * 1. Infrastructure Mode of Operation
 * 2. Security Risks & Vulnerabilities
 * 3. Baseline Configuration
 * 4. Security Control vs Framework
 * 5. Compliance Requirements
 * 6. Regulatory Requirements
 * 7. Standards & Guidelines
 * 8. Relevant ACQ Tools
 * 9. Adversarial Insight (MITRE ATT&CK)
 * 10. Information Security Management System (ISMS)
 * 11. Device Inventory Tracking
 * 12. Identity Behavior & Hygiene
 */

import { MatrixItem } from "./sos2a-types";

// Type for security parameter key
type SecurityParameterKey = keyof Pick<MatrixItem, 
  'accessControl' | 'identityAndAccessManagement' | 'dataProtection' | 'securityAwareness' |
  'incidentResponse' | 'networkSecurity' | 'applicationSecurity' |
  'thirdPartyManagement' | 'assetManagement' | 'securityGovernance' |
  'complianceManagement'
>;

// Interface for the reverse parameter mapping
export interface ReverseParameterMapping {
  sosParameter: string;
  description: string;
  securityDomainMappings: {
    securityParameter: SecurityParameterKey;
    relevance: 'critical' | 'high' | 'medium' | 'low';
    description: string;
  }[];
}

/**
 * Comprehensive reverse mapping from SOS²A parameters to security domains
 * The mapping shows how each assessment parameter impacts and evaluates
 * the various security domains in an organization.
 */
export const reverseParameterMappings: ReverseParameterMapping[] = [
  {
    sosParameter: 'Infrastructure Mode of Operation',
    description: 'The underlying technology environment that impacts security controls and requirements',
    securityDomainMappings: [
      {
        securityParameter: 'networkSecurity',
        relevance: 'high',
        description: 'Network security is fundamentally shaped by infrastructure mode (cloud, on-premises, hybrid)'
      },
      {
        securityParameter: 'dataProtection',
        relevance: 'high',
        description: 'Data protection techniques vary significantly by infrastructure type (cloud encryption vs. on-premises DLP)'
      },
      {
        securityParameter: 'accessControl',
        relevance: 'high',
        description: 'Access control requirements vary based on infrastructure (cloud IAM vs. on-premises directory services)'
      },
      {
        securityParameter: 'identityAndAccessManagement',
        relevance: 'critical',
        description: 'IAM architecture differs fundamentally by infrastructure (cloud IAM services vs. on-premises directory services)'
      },
      {
        securityParameter: 'thirdPartyManagement',
        relevance: 'high',
        description: 'Third-party integration concerns vary by infrastructure (cloud service providers vs. on-site contractors)'
      },
      {
        securityParameter: 'incidentResponse',
        relevance: 'high',
        description: 'IR capabilities differ by infrastructure type (cloud monitoring tools vs. on-premises SIEM)'
      },
      {
        securityParameter: 'applicationSecurity',
        relevance: 'medium',
        description: 'Application security needs vary by deployment model (cloud-native vs. traditional applications)'
      },
      {
        securityParameter: 'securityAwareness',
        relevance: 'medium',
        description: 'Training content differs based on infrastructure (cloud security vs. on-premises security)'
      },
      {
        securityParameter: 'assetManagement',
        relevance: 'high',
        description: 'Asset tracking approach varies by infrastructure (cloud resources vs. physical assets)'
      },
      {
        securityParameter: 'securityGovernance',
        relevance: 'high',
        description: 'Governance models must adapt to infrastructure type (cloud shared responsibility vs. on-premises)'
      },
      {
        securityParameter: 'complianceManagement',
        relevance: 'medium',
        description: 'Compliance requirements differ by infrastructure (cloud compliance vs. on-premises needs)'
      }
    ]
  },
  {
    sosParameter: 'Security Risks & Vulnerabilities',
    description: 'Identified threats and exploitable weaknesses in the organization\'s security posture',
    securityDomainMappings: [
      {
        securityParameter: 'accessControl',
        relevance: 'critical',
        description: 'Unauthorized access is a primary risk; weak authentication is a common vulnerability'
      },
      {
        securityParameter: 'identityAndAccessManagement',
        relevance: 'critical',
        description: 'Identity theft and privilege abuse are critical risks; improper rights management is a severe vulnerability'
      },
      {
        securityParameter: 'dataProtection',
        relevance: 'critical',
        description: 'Data breaches are a critical risk; unencrypted data storage is a severe vulnerability'
      },
      {
        securityParameter: 'networkSecurity',
        relevance: 'high',
        description: 'Network attacks are common risks; unpatched devices are significant vulnerabilities'
      },
      {
        securityParameter: 'applicationSecurity',
        relevance: 'high',
        description: 'Application vulnerabilities (OWASP Top 10) are primary risks; legacy code is vulnerable'
      },
      {
        securityParameter: 'securityAwareness',
        relevance: 'high',
        description: 'Social engineering is a primary risk; lack of user awareness is a human vulnerability'
      },
      {
        securityParameter: 'incidentResponse',
        relevance: 'high',
        description: 'Delayed detection is a major risk; insufficient response capability is a vulnerability'
      },
      {
        securityParameter: 'thirdPartyManagement',
        relevance: 'high',
        description: 'Supply chain attacks are growing risks; inadequate vendor assessments are vulnerabilities'
      },
      {
        securityParameter: 'assetManagement',
        relevance: 'high',
        description: 'Unknown assets are security blind spots; unmanaged devices introduce vulnerabilities'
      },
      {
        securityParameter: 'securityGovernance',
        relevance: 'high',
        description: 'Poor governance enables systemic risks; lack of risk management creates vulnerabilities'
      },
      {
        securityParameter: 'complianceManagement',
        relevance: 'high',
        description: 'Non-compliance is both a risk (fines, penalties) and a vulnerability indicator'
      }
    ]
  },
  {
    sosParameter: 'Baseline Configuration',
    description: 'Standard secure settings and configurations that form the foundation of the security program',
    securityDomainMappings: [
      {
        securityParameter: 'networkSecurity',
        relevance: 'high',
        description: 'Network device configurations, segmentation designs, and firewall rules form key baselines'
      },
      {
        securityParameter: 'accessControl',
        relevance: 'high',
        description: 'Authentication settings, permission models, and privilege configurations form core baselines'
      },
      {
        securityParameter: 'identityAndAccessManagement',
        relevance: 'high',
        description: 'Centralized identity stores, role definitions, and access policies form essential baselines'
      },
      {
        securityParameter: 'dataProtection',
        relevance: 'high',
        description: 'Encryption standards, DLP configurations, and backup settings form key baselines'
      },
      {
        securityParameter: 'applicationSecurity',
        relevance: 'high',
        description: 'Secure coding standards, patching schedules, and SAST/DAST settings form baselines'
      },
      {
        securityParameter: 'incidentResponse',
        relevance: 'medium',
        description: 'Baseline configurations for SIEM, EDR, and monitoring tools'
      },
      {
        securityParameter: 'thirdPartyManagement',
        relevance: 'medium',
        description: 'Baseline contractual requirements and minimum security standards for vendors'
      },
      {
        securityParameter: 'assetManagement',
        relevance: 'high',
        description: 'Standard configurations for asset types, lifecycle management policies, and inventory tools'
      },
      {
        securityParameter: 'securityGovernance',
        relevance: 'medium',
        description: 'Baseline policy templates, minimum control sets, and governance structures'
      },
      {
        securityParameter: 'complianceManagement',
        relevance: 'medium',
        description: 'Baseline configurations for compliance monitoring and audit processes'
      },
      {
        securityParameter: 'securityAwareness',
        relevance: 'low',
        description: 'Limited baseline configurations apply, mostly for phishing simulation platforms'
      }
    ]
  },
  {
    sosParameter: 'Security Control vs Framework',
    description: 'Alignment between implemented controls and recognized security frameworks like NIST CSF and ISO 27001',
    securityDomainMappings: [
      {
        securityParameter: 'securityGovernance',
        relevance: 'high',
        description: 'Governance is central to frameworks like ISO 27001 (clauses 4-10) and NIST CSF (ID.GV)'
      },
      {
        securityParameter: 'identityAndAccessManagement',
        relevance: 'high',
        description: 'Core component in frameworks like ISO 27001 (A.9.2), NIST CSF (PR.AC-1), and NIST 800-53 (IA controls)'
      },
      {
        securityParameter: 'incidentResponse',
        relevance: 'high',
        description: 'Maps directly to response domains in NIST CSF (DE, RS) and ISO 27001 (A.16)'
      },
      {
        securityParameter: 'networkSecurity',
        relevance: 'high',
        description: 'Maps to network domains in ISO 27001 (A.13) and NIST CSF (PR.AC, PR.DS, DE.CM)'
      },
      {
        securityParameter: 'applicationSecurity',
        relevance: 'high',
        description: 'Maps to application security in ISO 27001 (A.14) and NIST CSF (PR.IP)'
      },
      {
        securityParameter: 'complianceManagement',
        relevance: 'high',
        description: 'Compliance management is integral to frameworks like ISO 27001 (A.18) and NIST CSF'
      },
      {
        securityParameter: 'accessControl',
        relevance: 'medium',
        description: 'Maps to access control domains in frameworks like ISO 27001 (A.9) and NIST CSF (PR.AC)'
      },
      {
        securityParameter: 'dataProtection',
        relevance: 'medium',
        description: 'Maps to data protection domains in ISO 27001 (A.8, A.18) and NIST CSF (PR.DS)'
      },
      {
        securityParameter: 'thirdPartyManagement',
        relevance: 'high',
        description: 'Maps to supplier management in ISO 27001 (A.15) and NIST CSF (ID.SC)'
      },
      {
        securityParameter: 'assetManagement',
        relevance: 'high',
        description: 'Maps to asset management in ISO 27001 (A.8) and NIST CSF (ID.AM)'
      },
      {
        securityParameter: 'securityAwareness',
        relevance: 'medium',
        description: 'Maps to awareness domains in ISO 27001 (A.7.2.2) and NIST CSF (PR.AT)'
      }
    ]
  },
  {
    sosParameter: 'Compliance Requirements',
    description: 'Industry standards and best practices that must be followed to achieve certification',
    securityDomainMappings: [
      {
        securityParameter: 'complianceManagement',
        relevance: 'critical',
        description: 'Self-referential: the process of managing compliance with standards'
      },
      {
        securityParameter: 'dataProtection',
        relevance: 'high',
        description: 'Data protection is central to most standards (PCI DSS encryption, HIPAA safeguards)'
      },
      {
        securityParameter: 'accessControl',
        relevance: 'high',
        description: 'Major standards (PCI DSS, HIPAA, etc.) have specific access control requirements'
      },
      {
        securityParameter: 'identityAndAccessManagement',
        relevance: 'high',
        description: 'Standards require robust identity management (PCI DSS 8.1, HIPAA 164.308(a)(4))'
      },
      {
        securityParameter: 'networkSecurity',
        relevance: 'high',
        description: 'Standards have network security requirements (PCI DSS network segments, firewalls)'
      },
      {
        securityParameter: 'incidentResponse',
        relevance: 'high',
        description: 'Standards require incident handling (PCI DSS 12.10, HIPAA Breach Notification)'
      },
      {
        securityParameter: 'securityAwareness',
        relevance: 'high',
        description: 'Most standards require security awareness training (PCI DSS 12.6, HIPAA)'
      },
      {
        securityParameter: 'securityGovernance',
        relevance: 'high',
        description: 'Standards require governance controls (ISO 27001 clauses 4-10, HIPAA administrative safeguards)'
      },
      {
        securityParameter: 'thirdPartyManagement',
        relevance: 'high',
        description: 'Many standards address vendor management (PCI DSS 12.8, ISO 27001 A.15)'
      },
      {
        securityParameter: 'assetManagement',
        relevance: 'medium',
        description: 'Asset management appears in standards like ISO 27001 (A.8) and PCI DSS (9, 12.3)'
      },
      {
        securityParameter: 'applicationSecurity',
        relevance: 'medium',
        description: 'Some standards include application security (PCI DSS 6, secure development)'
      }
    ]
  },
  {
    sosParameter: 'Regulatory Requirements',
    description: 'Legal obligations that must be met to avoid penalties and demonstrate due care',
    securityDomainMappings: [
      {
        securityParameter: 'dataProtection',
        relevance: 'high',
        description: 'Many regulations focus primarily on data protection (GDPR, CCPA, HIPAA)'
      },
      {
        securityParameter: 'complianceManagement',
        relevance: 'high',
        description: 'The process of managing compliance with regulations and laws'
      },
      {
        securityParameter: 'incidentResponse',
        relevance: 'high',
        description: 'Regulations often focus on breach response (GDPR 72-hour notification)'
      },
      {
        securityParameter: 'accessControl',
        relevance: 'high',
        description: 'Regulations mandate access controls (HIPAA 164.312(a), GDPR Article 32)'
      },
      {
        securityParameter: 'identityAndAccessManagement',
        relevance: 'high',
        description: 'Regulations mandate identity verification and least privilege (GDPR, HIPAA, SOX)'
      },
      {
        securityParameter: 'securityGovernance',
        relevance: 'high',
        description: 'Regulations require governance processes (GDPR accountability principle, HIPAA)'
      },
      {
        securityParameter: 'thirdPartyManagement',
        relevance: 'high',
        description: 'Many regulations address vendor oversight (GDPR processor requirements, HIPAA BAAs)'
      },
      {
        securityParameter: 'networkSecurity',
        relevance: 'medium',
        description: 'Some regulations specify network controls (HIPAA network security)'
      },
      {
        securityParameter: 'securityAwareness',
        relevance: 'medium',
        description: 'Many regulations require security training (HIPAA, GLBA, GDPR implicitly)'
      },
      {
        securityParameter: 'applicationSecurity',
        relevance: 'medium',
        description: 'Regulations increasingly focus on secure development and privacy by design'
      },
      {
        securityParameter: 'assetManagement',
        relevance: 'medium',
        description: 'Some regulations require tracking of assets with sensitive data (GDPR data inventory)'
      }
    ]
  },
  {
    sosParameter: 'Standards & Guidelines',
    description: 'Technical specifications and recommendations from recognized security authorities',
    securityDomainMappings: [
      {
        securityParameter: 'accessControl',
        relevance: 'high',
        description: 'References standards like NIST 800-53 AC controls and ISO 27001 A.9 controls'
      },
      {
        securityParameter: 'identityAndAccessManagement',
        relevance: 'high',
        description: 'References standards like NIST 800-63 (Digital Identity), ISO 27001 A.9.2, and NIST SP 800-207 (Zero Trust)'
      },
      {
        securityParameter: 'dataProtection',
        relevance: 'high',
        description: 'References standards like NIST 800-53 SC/MP controls and ISO 27001 A.8/A.18'
      },
      {
        securityParameter: 'networkSecurity',
        relevance: 'high',
        description: 'References standards like NIST 800-53 SC controls and ISO 27001 A.13'
      },
      {
        securityParameter: 'applicationSecurity',
        relevance: 'high',
        description: 'References standards like OWASP ASVS, NIST 800-53 SA controls, and ISO 27034'
      },
      {
        securityParameter: 'incidentResponse',
        relevance: 'high',
        description: 'References standards like NIST 800-61 and ISO 27035 for incident management'
      },
      {
        securityParameter: 'thirdPartyManagement',
        relevance: 'high',
        description: 'References standards like ISO 27001 A.15 and NIST 800-53 SA-9 for vendor management'
      },
      {
        securityParameter: 'assetManagement',
        relevance: 'medium',
        description: 'References standards like ISO 27001 A.8.1 and NIST 800-53 CM controls'
      },
      {
        securityParameter: 'securityGovernance',
        relevance: 'high',
        description: 'References standards like ISO 27001 clauses 4-10 and NIST 800-39 for risk management'
      },
      {
        securityParameter: 'complianceManagement',
        relevance: 'high',
        description: 'References standards like NIST 800-53 AU controls and ISO 27001 A.18'
      },
      {
        securityParameter: 'securityAwareness',
        relevance: 'medium',
        description: 'References standards like NIST 800-53 AT controls and ISO 27001 A.7.2.2'
      }
    ]
  },
  {
    sosParameter: 'Relevant ACQ Tools',
    description: 'Security tools and technologies that support assessment, compliance, and quality assurance',
    securityDomainMappings: [
      {
        securityParameter: 'networkSecurity',
        relevance: 'high',
        description: 'Identifies tools for vulnerability scanning, network monitoring, and penetration testing'
      },
      {
        securityParameter: 'applicationSecurity',
        relevance: 'high',
        description: 'Identifies tools for application scanning, code review, and API security testing'
      },
      {
        securityParameter: 'incidentResponse',
        relevance: 'high',
        description: 'Identifies tools for IR planning, breach simulation, and forensic capabilities'
      },
      {
        securityParameter: 'complianceManagement',
        relevance: 'high',
        description: 'Identifies tools for compliance tracking, audit management, and evidence collection'
      },
      {
        securityParameter: 'dataProtection',
        relevance: 'medium',
        description: 'Identifies tools for encryption testing, DLP assessment, and data classification'
      },
      {
        securityParameter: 'identityAndAccessManagement',
        relevance: 'high',
        description: 'Identifies tools for identity governance, privileged access management, and identity lifecycle'
      },
      {
        securityParameter: 'accessControl',
        relevance: 'medium',
        description: 'Identifies tools for IAM assessment, authentication testing, and privilege audit'
      },
      {
        securityParameter: 'thirdPartyManagement',
        relevance: 'medium',
        description: 'Identifies tools for vendor risk assessment, contract management, and SLA monitoring'
      },
      {
        securityParameter: 'assetManagement',
        relevance: 'medium',
        description: 'Identifies tools for asset discovery, inventory management, and lifecycle tracking'
      },
      {
        securityParameter: 'securityGovernance',
        relevance: 'medium',
        description: 'Identifies tools for policy management, compliance tracking, and risk registers'
      },
      {
        securityParameter: 'securityAwareness',
        relevance: 'medium',
        description: 'Identifies tools for phishing simulation, training platforms, and awareness assessment'
      }
    ]
  },
  {
    sosParameter: 'Adversarial Insight (MITRE ATT&CK)',
    description: 'Threat actor tactics, techniques, and procedures that inform defense strategies',
    securityDomainMappings: [
      {
        securityParameter: 'incidentResponse',
        relevance: 'high',
        description: 'Uses the entire ATT&CK framework to model detection and response capabilities'
      },
      {
        securityParameter: 'accessControl',
        relevance: 'high',
        description: 'Maps to Initial Access (TA0001) and Privilege Escalation (TA0004) tactics'
      },
      {
        securityParameter: 'identityAndAccessManagement',
        relevance: 'critical',
        description: 'Maps to Credential Access (TA0006), Privilege Escalation (TA0004), and Initial Access (TA0001) tactics'
      },
      {
        securityParameter: 'dataProtection',
        relevance: 'high',
        description: 'Maps to Collection (TA0009) and Exfiltration (TA0010) tactics'
      },
      {
        securityParameter: 'networkSecurity',
        relevance: 'high',
        description: 'Maps to Network-based tactics like Lateral Movement (TA0008) and Command and Control (TA0011)'
      },
      {
        securityParameter: 'applicationSecurity',
        relevance: 'high',
        description: 'Maps to Exploitation tactics (Initial Access, Execution, Privilege Escalation)'
      },
      {
        securityParameter: 'securityAwareness',
        relevance: 'high',
        description: 'Maps to Social Engineering precursors to Initial Access (TA0001)'
      },
      {
        securityParameter: 'thirdPartyManagement',
        relevance: 'medium',
        description: 'Maps to Supply Chain Compromise and third-party vector techniques'
      },
      {
        securityParameter: 'assetManagement',
        relevance: 'medium',
        description: 'Unmanaged assets are targeted; maps to Discovery (TA0007) tactics'
      },
      {
        securityParameter: 'securityGovernance',
        relevance: 'low',
        description: 'Limited direct mapping, but indirectly supports defense against all tactics'
      },
      {
        securityParameter: 'complianceManagement',
        relevance: 'low',
        description: 'Limited direct mapping, but compliance gaps can indicate exploitable weaknesses'
      }
    ]
  },
  {
    sosParameter: 'Information Security Management System (ISMS)',
    description: 'Systematic approach to managing sensitive information and ensuring business continuity',
    securityDomainMappings: [
      {
        securityParameter: 'securityGovernance',
        relevance: 'critical',
        description: 'Security governance is the foundation of ISMS; ISO 27001 clauses 4-10 define the core governance mechanisms'
      },
      {
        securityParameter: 'dataProtection',
        relevance: 'high',
        description: 'Data protection is a cornerstone of ISMS programs; requires defined processes for handling sensitive information'
      },
      {
        securityParameter: 'accessControl',
        relevance: 'high',
        description: 'Access control is a core component of ISMS frameworks; policies for managing access rights are required'
      },
      {
        securityParameter: 'identityAndAccessManagement',
        relevance: 'high',
        description: 'Identity governance is a fundamental component of ISMS; ISO 27001 A.9.2 addresses user access management'
      },
      {
        securityParameter: 'incidentResponse',
        relevance: 'high',
        description: 'Incident management is a required process within ISMS; ISO 27001 A.16 mandates incident response procedures'
      },
      {
        securityParameter: 'networkSecurity',
        relevance: 'high',
        description: 'Network security is a core component of ISMS frameworks; ISO 27001 A.13 mandates network security controls'
      },
      {
        securityParameter: 'applicationSecurity',
        relevance: 'high',
        description: 'Secure systems development is a core ISMS domain in ISO 27001 A.14'
      },
      {
        securityParameter: 'thirdPartyManagement',
        relevance: 'high',
        description: 'Supplier relationships are an ISMS requirement; ISO 27001 A.15 addresses third-party security'
      },
      {
        securityParameter: 'assetManagement',
        relevance: 'high',
        description: 'Asset management is a fundamental ISMS component; ISO 27001 A.8 requires asset inventory and ownership'
      },
      {
        securityParameter: 'securityAwareness',
        relevance: 'high',
        description: 'Security awareness is a required component of ISMS; ISO 27001 specifically mandates awareness training'
      },
      {
        securityParameter: 'complianceManagement',
        relevance: 'high',
        description: 'Compliance monitoring is a core component of ISMS; ISO 27001 requires internal audits and management reviews'
      }
    ]
  }
,  {
    sosParameter: 'Device Inventory Tracking',
    description: 'Comprehensive inventory management of all hardware devices in the environment',
    securityDomainMappings: [
      {
        securityParameter: 'assetManagement',
        relevance: 'critical',
        description: 'Device inventory is the foundation of asset management; you cannot secure what you do not know exists'
      },
      {
        securityParameter: 'networkSecurity',
        relevance: 'high',
        description: 'Network security depends on knowing all connected devices and their associated risks'
      },
      {
        securityParameter: 'complianceManagement',
        relevance: 'high',
        description: 'Many compliance frameworks require complete device inventories (NIST, ISO, HIPAA)'
      },
      {
        securityParameter: 'securityGovernance',
        relevance: 'high',
        description: 'Governance requires visibility into all assets and their roles in the organization'
      },
      {
        securityParameter: 'dataProtection',
        relevance: 'medium',
        description: 'Understanding where organizational data resides requires knowledge of all devices'
      },
      {
        securityParameter: 'accessControl',
        relevance: 'medium',
        description: 'Device-based access control requires complete device inventory and tracking'
      },
      {
        securityParameter: 'incidentResponse',
        relevance: 'high',
        description: 'Effective incident response requires knowing all devices potentially affected by a security incident'
      }
    ]
  },  {
    sosParameter: 'Identity Behavior & Hygiene',
    description: 'Monitoring and management of user identity behaviors, authentication practices, and access patterns',
    securityDomainMappings: [
      {
        securityParameter: 'identityAndAccessManagement',
        relevance: 'critical',
        description: 'Identity behavior analytics is a core component of modern IAM for anomaly detection'
      },
      {
        securityParameter: 'accessControl',
        relevance: 'high',
        description: 'Identity hygiene directly impacts access control effectiveness through proper credential management'
      },
      {
        securityParameter: 'securityAwareness',
        relevance: 'high',
        description: 'User behavior reflects security awareness; training affects identity hygiene practices'
      },
      {
        securityParameter: 'incidentResponse',
        relevance: 'high',
        description: 'Identity anomaly detection is a key trigger for incident response; behavior analytics identify compromises'
      },
      {
        securityParameter: 'dataProtection',
        relevance: 'medium',
        description: 'Identity hygiene impacts data access control and potential for unauthorized data exposure'
      },
      {
        securityParameter: 'securityGovernance',
        relevance: 'medium',
        description: 'Governance includes identity lifecycle management policies and monitoring practices'
      },
      {
        securityParameter: 'complianceManagement',
        relevance: 'medium',
        description: 'Compliance frameworks increasingly require monitoring of identity behaviors (NIST, ISO)'
      }
    ]
  },
  {
    sosParameter: 'Device Inventory Tracking',
    description: 'Comprehensive inventory management of all hardware devices in the environment including laptops, phones, IoT devices, and servers',
    securityDomainMappings: [
      {
        securityParameter: 'assetManagement',
        relevance: 'critical',
        description: 'Device inventory is the foundation of asset management; tracks device lifecycle from procurement through retirement; prevents missing/unpatched devices'
      },
      {
        securityParameter: 'networkSecurity',
        relevance: 'critical',
        description: 'Network segmentation & NAC depend on knowing which devices are permitted; allows quarantine of unknown devices; prevents lateral movement by rogue devices'
      },
      {
        securityParameter: 'accessControl',
        relevance: 'high',
        description: 'IAM systems use device inventory to enforce policies; ensures only authorized and compliant devices can access sensitive resources'
      },
      {
        securityParameter: 'identityAndAccessManagement',
        relevance: 'high',
        description: 'Devices have identities (certificates, MAC/IP, device IDs) that must be managed; enables enforcement of least privilege based on device trustworthiness'
      },
      {
        securityParameter: 'complianceManagement',
        relevance: 'high',
        description: 'Regulations (GDPR, HIPAA, PCI DSS) require tracking devices that handle sensitive data; audits demand proof of device controls'
      },
      {
        securityParameter: 'incidentResponse',
        relevance: 'high',
        description: 'During a breach, responders need to identify compromised devices and accessed data; forensic investigations rely on device logs and inventory records'
      },
      {
        securityParameter: 'dataProtection',
        relevance: 'high',
        description: 'DLP tools block unauthorized devices from accessing sensitive files; encryption policies depend on knowing which devices store regulated data'
      },
      {
        securityParameter: 'thirdPartyManagement',
        relevance: 'medium',
        description: 'Vendor/contractor devices must be tracked and restricted; BYOD policies rely on inventory controls to prevent supply chain attacks'
      },
      {
        securityParameter: 'applicationSecurity',
        relevance: 'medium',
        description: 'Applications should only allow access from trusted devices; device attestation prevents unauthorized application access'
      },
      {
        securityParameter: 'securityGovernance',
        relevance: 'high',
        description: 'Policies must define how devices are classified, monitored, and retired; risk assessments depend on knowing device exposure'
      },
      {
        securityParameter: 'securityAwareness',
        relevance: 'medium',
        description: 'Employees must understand device registration importance and risks of using unauthorized devices to prevent bypassing security controls'
      }
    ]
  },  {
    sosParameter: 'Identity Behavior & Hygiene',
    description: 'Monitoring and management of user identity behaviors, authentication practices, and access patterns',
    securityDomainMappings: [
      {
        securityParameter: 'identityAndAccessManagement',
        relevance: 'critical',
        description: 'Identity behavior analytics is a core component of modern IAM for anomaly detection'
      },
      {
        securityParameter: 'accessControl',
        relevance: 'high',
        description: 'Identity hygiene directly impacts access control effectiveness through proper credential management'
      },
      {
        securityParameter: 'securityAwareness',
        relevance: 'high',
        description: 'User behavior reflects security awareness; training affects identity hygiene practices'
      },
      {
        securityParameter: 'incidentResponse',
        relevance: 'high',
        description: 'Identity anomaly detection is a key trigger for incident response; behavior analytics identify compromises'
      },
      {
        securityParameter: 'dataProtection',
        relevance: 'medium',
        description: 'Identity hygiene impacts data access control and potential for unauthorized data exposure'
      },
      {
        securityParameter: 'securityGovernance',
        relevance: 'medium',
        description: 'Governance includes identity lifecycle management policies and monitoring practices'
      },
      {
        securityParameter: 'complianceManagement',
        relevance: 'medium',
        description: 'Compliance frameworks increasingly require monitoring of identity behaviors (NIST, ISO)'
      }
    ]
  }];
