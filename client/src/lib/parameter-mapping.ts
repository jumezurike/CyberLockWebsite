/**
 * Default Parameter Mapping
 * 
 * This file contains the formal mapping between the 12 cybersecurity core domains
 * used in gap analysis and the 12 default SOS²A parameters.
 * 
 * This mapping demonstrates how each security domain intersects with the
 * fundamental assessment parameters, creating a multi-dimensional
 * analysis framework.
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
 * 
 * The 12 cybersecurity core domains are:
 * 1. Access Control
 * 2. Identity and Access Management (IAM)
 * 3. Data Protection
 * 4. Security Awareness
 * 5. Incident Response
 * 6. Network Security
 * 7. Application Security
 * 8. Third-Party Management
 * 9. Asset Management
 * 10. Security Governance
 * 11. Compliance Management
 * 12. Risk Management
 */

import { MatrixItem } from "./sos2a-types";

// Interface for the parameter mapping
export interface ParameterMapping {
  securityParameter: keyof Pick<MatrixItem, 
    'accessControl' | 'identityAndAccessManagement' | 'dataProtection' | 'securityAwareness' |
    'incidentResponse' | 'networkSecurity' | 'applicationSecurity' |
    'thirdPartyManagement' | 'assetManagement' | 'securityGovernance' |
    'complianceManagement'
  >;
  description: string;
  frameworkMappings: {
    parameterName: string;
    relevance: 'critical' | 'high' | 'medium' | 'low';
    description: string;
  }[];
}

/**
 * Comprehensive mapping between cybersecurity core domains and default SOS²A parameters
 * The mapping shows how each security domain intersects with and is evaluated through
 * the lens of the 12 default SOS²A parameters.
 */
export const securityParameterMappings: ParameterMapping[] = [
  {
    securityParameter: 'accessControl',
    description: 'Controls that manage who can access systems, what permissions they have, and how they authenticate',
    frameworkMappings: [
      {
        parameterName: 'Infrastructure Mode of Operation',
        relevance: 'high',
        description: 'Access control requirements vary significantly based on infrastructure type (cloud, on-premises, hybrid)'
      },
      {
        parameterName: 'Security Risks & Vulnerabilities',
        relevance: 'critical',
        description: 'Unauthorized access is a primary risk; weak authentication is a common vulnerability'
      },
      {
        parameterName: 'Baseline Configuration',
        relevance: 'high',
        description: 'Authentication settings, permission models, and privilege configurations form core baselines'
      },
      {
        parameterName: 'Security Control vs Framework',
        relevance: 'medium',
        description: 'Maps to access control domains in frameworks like ISO 27001 (A.9) and NIST CSF (PR.AC)'
      },
      {
        parameterName: 'Compliance Requirements',
        relevance: 'high',
        description: 'Major standards (PCI DSS, HIPAA, etc.) have specific access control requirements'
      },
      {
        parameterName: 'Regulatory Requirements',
        relevance: 'high',
        description: 'Regulations mandate access controls (HIPAA 164.312(a), GDPR Article 32)'
      },
      {
        parameterName: 'Standards & Guidelines',
        relevance: 'high',
        description: 'References standards like NIST 800-53 AC controls and ISO 27001 A.9 controls'
      },
      {
        parameterName: 'Relevant ACQ Tools',
        relevance: 'medium',
        description: 'Identifies tools for IAM assessment, authentication testing, and privilege audit'
      },
      {
        parameterName: 'Adversarial Insight (MITRE ATT&CK)',
        relevance: 'high',
        description: 'Maps to Initial Access (TA0001) and Privilege Escalation (TA0004) tactics'
      },
      {
        parameterName: 'Information Security Management System (ISMS)',
        relevance: 'high',
        description: 'Access control is a core component of ISMS frameworks; policies for managing access rights and privileges are required'
      },
      {
        parameterName: 'Device Inventory Tracking',
        relevance: 'high',
        description: 'Device identity is a critical factor in access decisions and Zero Trust architecture'
      },
      {
        parameterName: 'Identity Behavior & Hygiene',
        relevance: 'critical',
        description: 'Identity hygiene directly impacts access control effectiveness through proper credential management and authorization'
      }
    ]
  },
  {
    securityParameter: 'identityAndAccessManagement',
    description: 'Comprehensive management of digital identities, permissions, and access rights across all systems and resources',
    frameworkMappings: [
      {
        parameterName: 'Infrastructure Mode of Operation',
        relevance: 'critical',
        description: 'IAM architecture differs fundamentally by infrastructure (cloud IAM services vs. on-premises directory services)'
      },
      {
        parameterName: 'Security Risks & Vulnerabilities',
        relevance: 'critical',
        description: 'Identity theft and privilege abuse are critical risks; improper rights management is a severe vulnerability'
      },
      {
        parameterName: 'Baseline Configuration',
        relevance: 'high',
        description: 'Centralized identity stores, role definitions, and access policies form essential baselines'
      },
      {
        parameterName: 'Security Control vs Framework',
        relevance: 'high',
        description: 'Core component in frameworks like ISO 27001 (A.9.2), NIST CSF (PR.AC-1), and NIST 800-53 (IA controls)'
      },
      {
        parameterName: 'Compliance Requirements',
        relevance: 'high',
        description: 'Standards require robust identity management (PCI DSS 8.1, HIPAA 164.308(a)(4))'
      },
      {
        parameterName: 'Regulatory Requirements',
        relevance: 'high',
        description: 'Regulations mandate identity verification and least privilege (GDPR, HIPAA, SOX)'
      },
      {
        parameterName: 'Standards & Guidelines',
        relevance: 'high',
        description: 'References standards like NIST 800-63 (Digital Identity), ISO 27001 A.9.2, and NIST SP 800-207 (Zero Trust)'
      },
      {
        parameterName: 'Relevant ACQ Tools',
        relevance: 'high',
        description: 'Identifies tools for directory service assessment, privilege mapping, and access certification'
      },
      {
        parameterName: 'Adversarial Insight (MITRE ATT&CK)',
        relevance: 'high',
        description: 'Maps to Initial Access (TA0001), Credential Access (TA0006), and Privilege Escalation (TA0004) tactics'
      },
      {
        parameterName: 'Information Security Management System (ISMS)',
        relevance: 'high',
        description: 'IAM is a fundamental component of ISMS; requires formal processes for identity lifecycle management'
      },
      {
        parameterName: 'Device Inventory Tracking',
        relevance: 'critical',
        description: 'Devices have identities (certificates, MAC/IP, device IDs) that must be managed; enables enforcement of least privilege'
      },
      {
        parameterName: 'Identity Behavior & Hygiene',
        relevance: 'critical',
        description: 'Identity behavior analytics is the core of modern IAM for detecting anomalies and ensuring proper user authentication'
      }
    ]
  },
  {
    securityParameter: 'dataProtection',
    description: 'Measures that safeguard information assets throughout their lifecycle, from creation to deletion',
    frameworkMappings: [
      {
        parameterName: 'Infrastructure Mode of Operation',
        relevance: 'high',
        description: 'Data protection techniques vary by infrastructure (cloud encryption vs. on-premises DLP)'
      },
      {
        parameterName: 'Security Risks & Vulnerabilities',
        relevance: 'critical',
        description: 'Data breaches are a critical risk; unencrypted data storage is a severe vulnerability'
      },
      {
        parameterName: 'Baseline Configuration',
        relevance: 'high',
        description: 'Encryption standards, DLP configurations, and backup settings form key baselines'
      },
      {
        parameterName: 'Security Control vs Framework',
        relevance: 'medium',
        description: 'Maps to data protection domains in ISO 27001 (A.8, A.18) and NIST CSF (PR.DS)'
      },
      {
        parameterName: 'Compliance Requirements',
        relevance: 'high',
        description: 'Data protection is central to most standards (PCI DSS encryption, HIPAA safeguards)'
      },
      {
        parameterName: 'Regulatory Requirements',
        relevance: 'high',
        description: 'Many regulations focus primarily on data protection (GDPR, CCPA, HIPAA)'
      },
      {
        parameterName: 'Standards & Guidelines',
        relevance: 'high',
        description: 'References standards like NIST 800-53 SC/MP controls and ISO 27001 A.8/A.18'
      },
      {
        parameterName: 'Relevant ACQ Tools',
        relevance: 'medium',
        description: 'Identifies tools for encryption testing, DLP assessment, and data classification'
      },
      {
        parameterName: 'Adversarial Insight (MITRE ATT&CK)',
        relevance: 'high',
        description: 'Maps to Collection (TA0009) and Exfiltration (TA0010) tactics'
      },
      {
        parameterName: 'Information Security Management System (ISMS)',
        relevance: 'high',
        description: 'Data protection is a cornerstone of ISMS programs; requires defined processes for handling, storing, and protecting sensitive information'
      },
      {
        parameterName: 'Device Inventory Tracking',
        relevance: 'high',
        description: 'Data protection is only possible when all devices storing or processing sensitive data are inventoried and managed'
      },
      {
        parameterName: 'Identity Behavior & Hygiene',
        relevance: 'high',
        description: 'User behavior patterns can identify potential data exfiltration and improper data handling practices'
      }
    ]
  },
  {
    securityParameter: 'securityAwareness',
    description: 'Educational programs that transform users from vulnerabilities into security assets through knowledge and training',
    frameworkMappings: [
      {
        parameterName: 'Infrastructure Mode of Operation',
        relevance: 'medium',
        description: 'Awareness needs vary by infrastructure (cloud security vs. on-premises focus)'
      },
      {
        parameterName: 'Security Risks & Vulnerabilities',
        relevance: 'high',
        description: 'Social engineering is a primary risk; lack of security awareness is a human vulnerability'
      },
      {
        parameterName: 'Baseline Configuration',
        relevance: 'low',
        description: 'Limited baseline configurations apply, mostly for phishing simulation platforms'
      },
      {
        parameterName: 'Security Control vs Framework',
        relevance: 'medium',
        description: 'Maps to awareness domains in ISO 27001 (A.7.2.2) and NIST CSF (PR.AT)'
      },
      {
        parameterName: 'Compliance Requirements',
        relevance: 'high',
        description: 'Most standards require security awareness training (PCI DSS 12.6, HIPAA)'
      },
      {
        parameterName: 'Regulatory Requirements',
        relevance: 'medium',
        description: 'Many regulations require security training (HIPAA, GLBA, GDPR implicitly)'
      },
      {
        parameterName: 'Standards & Guidelines',
        relevance: 'medium',
        description: 'References standards like NIST 800-53 AT controls and ISO 27001 A.7.2.2'
      },
      {
        parameterName: 'Relevant ACQ Tools',
        relevance: 'medium',
        description: 'Identifies tools for phishing simulation, training platforms, and awareness assessment'
      },
      {
        parameterName: 'Adversarial Insight (MITRE ATT&CK)',
        relevance: 'high',
        description: 'Maps to Social Engineering precursors to Initial Access (TA0001)'
      },
      {
        parameterName: 'Information Security Management System (ISMS)',
        relevance: 'high',
        description: 'Security awareness is a required component of ISMS; ISO 27001 specifically mandates awareness training'
      },
      {
        parameterName: 'Device Inventory Tracking',
        relevance: 'medium',
        description: 'Security awareness must include guidance on authorized devices and proper device usage'
      },
      {
        parameterName: 'Identity Behavior & Hygiene',
        relevance: 'high',
        description: 'Security awareness directly shapes identity hygiene practices like password management and phishing awareness'
      }
    ]
  },
  {
    securityParameter: 'incidentResponse',
    description: 'Capability to detect, respond to, and recover from security incidents, minimizing their impact',
    frameworkMappings: [
      {
        parameterName: 'Infrastructure Mode of Operation',
        relevance: 'high',
        description: 'IR capabilities differ by infrastructure (cloud monitoring vs. on-premises SIEM)'
      },
      {
        parameterName: 'Security Risks & Vulnerabilities',
        relevance: 'high',
        description: 'Delayed detection is a major risk; insufficient response capability is a vulnerability'
      },
      {
        parameterName: 'Baseline Configuration',
        relevance: 'medium',
        description: 'Baseline configurations for SIEM, EDR, and monitoring tools'
      },
      {
        parameterName: 'Security Control vs Framework',
        relevance: 'high',
        description: 'Maps directly to response domains in NIST CSF (DE, RS) and ISO 27001 (A.16)'
      },
      {
        parameterName: 'Compliance Requirements',
        relevance: 'high',
        description: 'Standards require incident handling (PCI DSS 12.10, HIPAA Breach Notification)'
      },
      {
        parameterName: 'Regulatory Requirements',
        relevance: 'high',
        description: 'Regulations often focus on breach response (GDPR 72-hour notification)'
      },
      {
        parameterName: 'Standards & Guidelines',
        relevance: 'high',
        description: 'References standards like NIST 800-61 and ISO 27035 for incident management'
      },
      {
        parameterName: 'Relevant ACQ Tools',
        relevance: 'high',
        description: 'Identifies tools for IR planning, breach simulation, and forensic capabilities'
      },
      {
        parameterName: 'Adversarial Insight (MITRE ATT&CK)',
        relevance: 'high',
        description: 'Uses the entire ATT&CK framework to model detection and response capabilities'
      },
      {
        parameterName: 'Information Security Management System (ISMS)',
        relevance: 'high',
        description: 'Incident management is a required process within ISMS; ISO 27001 A.16 mandates incident response procedures'
      },
      {
        parameterName: 'Device Inventory Tracking',
        relevance: 'high',
        description: 'Comprehensive device inventory is essential for effective incident scoping, containment, and forensics'
      },
      {
        parameterName: 'Identity Behavior & Hygiene',
        relevance: 'high',
        description: 'Identity behavior analytics enable detection of abnormal activities that indicate potential security incidents'
      }
    ]
  },
  {
    securityParameter: 'networkSecurity',
    description: 'Protection of network infrastructure and communications, forming the backbone of modern systems',
    frameworkMappings: [
      {
        parameterName: 'Infrastructure Mode of Operation',
        relevance: 'high',
        description: 'Network security is fundamentally shaped by infrastructure mode (cloud, VPN, etc.)'
      },
      {
        parameterName: 'Security Risks & Vulnerabilities',
        relevance: 'high',
        description: 'Network attacks are common risks; unpatched devices are critical vulnerabilities'
      },
      {
        parameterName: 'Baseline Configuration',
        relevance: 'high',
        description: 'Network device configurations, segmentation designs, and firewall rules form key baselines'
      },
      {
        parameterName: 'Security Control vs Framework',
        relevance: 'high',
        description: 'Maps to network domains in ISO 27001 (A.13) and NIST CSF (PR.AC, PR.DS, DE.CM)'
      },
      {
        parameterName: 'Compliance Requirements',
        relevance: 'high',
        description: 'Standards have network security requirements (PCI DSS network segments, firewalls)'
      },
      {
        parameterName: 'Regulatory Requirements',
        relevance: 'medium',
        description: 'Some regulations specify network controls (HIPAA network security)'
      },
      {
        parameterName: 'Standards & Guidelines',
        relevance: 'high',
        description: 'References standards like NIST 800-53 SC controls and ISO 27001 A.13'
      },
      {
        parameterName: 'Relevant ACQ Tools',
        relevance: 'high',
        description: 'Identifies tools for vulnerability scanning, network monitoring, and penetration testing'
      },
      {
        parameterName: 'Adversarial Insight (MITRE ATT&CK)',
        relevance: 'high',
        description: 'Maps to Network-based tactics like Lateral Movement (TA0008) and Command and Control (TA0011)'
      },
      {
        parameterName: 'Information Security Management System (ISMS)',
        relevance: 'high',
        description: 'Network security is a core component of ISMS frameworks; ISO 27001 A.13 mandates network security controls'
      },
      {
        parameterName: 'Device Inventory Tracking',
        relevance: 'critical',
        description: 'Complete network device inventory is essential for network security; unknown devices create unmanaged access points'
      },
      {
        parameterName: 'Identity Behavior & Hygiene',
        relevance: 'high',
        description: 'Identity behavior patterns on networks help identify anomalous activities and potential lateral movement'
      }
    ]
  },
  {
    securityParameter: 'applicationSecurity',
    description: 'Practices ensuring software applications are developed, deployed, and maintained securely',
    frameworkMappings: [
      {
        parameterName: 'Infrastructure Mode of Operation',
        relevance: 'medium',
        description: 'Application security needs vary by deployment model (cloud-native vs. on-premises)'
      },
      {
        parameterName: 'Security Risks & Vulnerabilities',
        relevance: 'high',
        description: 'Application vulnerabilities (OWASP Top 10) are primary risks; legacy code is vulnerable'
      },
      {
        parameterName: 'Baseline Configuration',
        relevance: 'high',
        description: 'Secure coding standards, patching schedules, and SAST/DAST settings form baselines'
      },
      {
        parameterName: 'Security Control vs Framework',
        relevance: 'high',
        description: 'Maps to application security in ISO 27001 (A.14) and NIST CSF (PR.IP)'
      },
      {
        parameterName: 'Compliance Requirements',
        relevance: 'medium',
        description: 'Some standards include application security (PCI DSS 6, secure development)'
      },
      {
        parameterName: 'Regulatory Requirements',
        relevance: 'medium',
        description: 'Regulations increasingly focus on secure development and privacy by design'
      },
      {
        parameterName: 'Standards & Guidelines',
        relevance: 'high',
        description: 'References standards like OWASP ASVS, NIST 800-53 SA controls, and ISO 27034'
      },
      {
        parameterName: 'Relevant ACQ Tools',
        relevance: 'high',
        description: 'Identifies tools for application scanning, code review, and API security testing'
      },
      {
        parameterName: 'Adversarial Insight (MITRE ATT&CK)',
        relevance: 'high',
        description: 'Maps to Exploitation tactics (Initial Access, Execution, Privilege Escalation)'
      },
      {
        parameterName: 'Information Security Management System (ISMS)',
        relevance: 'high',
        description: 'Secure systems development and acquisition is a core ISMS domain in ISO 27001 A.14'
      },
      {
        parameterName: 'Device Inventory Tracking',
        relevance: 'medium',
        description: 'Application security requires tracking all devices that access or host applications to ensure proper protection'
      },
      {
        parameterName: 'Identity Behavior & Hygiene',
        relevance: 'high',
        description: 'Identity behavior patterns are critical for detecting compromised accounts in web applications'
      }
    ]
  },
  {
    securityParameter: 'thirdPartyManagement',
    description: 'Processes to assess and mitigate risks from external partners, vendors, and service providers',
    frameworkMappings: [
      {
        parameterName: 'Infrastructure Mode of Operation',
        relevance: 'high',
        description: 'Third-party integration varies by infrastructure (cloud service providers vs. on-site contractors)'
      },
      {
        parameterName: 'Security Risks & Vulnerabilities',
        relevance: 'high',
        description: 'Supply chain attacks are growing risks; inadequate vendor assessments are vulnerabilities'
      },
      {
        parameterName: 'Baseline Configuration',
        relevance: 'medium',
        description: 'Baseline contractual requirements and minimum security standards for vendors'
      },
      {
        parameterName: 'Security Control vs Framework',
        relevance: 'high',
        description: 'Maps to supply chain domains in ISO 27001 (A.15) and NIST CSF (ID.SC)'
      },
      {
        parameterName: 'Compliance Requirements',
        relevance: 'high',
        description: 'Standards increasingly focus on third parties (PCI DSS 12.8, SOC 2 vendor management)'
      },
      {
        parameterName: 'Regulatory Requirements',
        relevance: 'high',
        description: 'Regulations hold organizations accountable for vendor actions (GDPR, HIPAA Business Associates)'
      },
      {
        parameterName: 'Standards & Guidelines',
        relevance: 'high',
        description: 'References standards like NIST 800-53 SA controls and ISO 27001 A.15'
      },
      {
        parameterName: 'Relevant ACQ Tools',
        relevance: 'medium',
        description: 'Identifies tools for vendor risk assessment, supplier monitoring, and audit management'
      },
      {
        parameterName: 'Adversarial Insight (MITRE ATT&CK)',
        relevance: 'medium',
        description: 'Maps to Supply Chain Compromise techniques in Initial Access (T1195)'
      },
      {
        parameterName: 'Information Security Management System (ISMS)',
        relevance: 'high',
        description: 'Supplier relationships are a specific control domain in ISO 27001 A.15, requiring formal supplier security policies'
      },
      {
        parameterName: 'Device Inventory Tracking',
        relevance: 'high',
        description: 'Device inventory must include third-party managed devices accessing organizational systems'
      },
      {
        parameterName: 'Identity Behavior & Hygiene',
        relevance: 'high',
        description: 'Third-party access must be monitored for abnormal identity behaviors indicative of compromised credentials'
      }
    ]
  },
  {
    securityParameter: 'assetManagement',
    description: 'Identification, tracking, and proper management of all IT assets, ensuring nothing falls through security cracks',
    frameworkMappings: [
      {
        parameterName: 'Infrastructure Mode of Operation',
        relevance: 'high',
        description: 'Asset types and management approaches vary by infrastructure (cloud resources vs. physical assets)'
      },
      {
        parameterName: 'Security Risks & Vulnerabilities',
        relevance: 'high',
        description: 'Unknown assets pose significant risks; unpatched/unmanaged assets are vulnerable'
      },
      {
        parameterName: 'Baseline Configuration',
        relevance: 'high',
        description: 'Asset inventory processes, lifecycle management, and classification schemes form baselines'
      },
      {
        parameterName: 'Security Control vs Framework',
        relevance: 'high',
        description: 'Maps to asset management in ISO 27001 (A.8) and NIST CSF (ID.AM)'
      },
      {
        parameterName: 'Compliance Requirements',
        relevance: 'medium',
        description: 'Standards require asset management (PCI DSS 2.4 asset inventory, SOC 2 Common Criteria)'
      },
      {
        parameterName: 'Regulatory Requirements',
        relevance: 'medium',
        description: 'Some regulations require asset tracking for regulated data (HIPAA, GDPR asset registers)'
      },
      {
        parameterName: 'Standards & Guidelines',
        relevance: 'high',
        description: 'References standards like NIST 800-53 CM controls and ISO 27001 A.8'
      },
      {
        parameterName: 'Relevant ACQ Tools',
        relevance: 'high',
        description: 'Identifies tools for asset discovery, inventory management, and lifecycle tracking'
      },
      {
        parameterName: 'Adversarial Insight (MITRE ATT&CK)',
        relevance: 'medium',
        description: 'Relates to Discovery tactics (TA0007) where attackers map organizational assets'
      },
      {
        parameterName: 'Information Security Management System (ISMS)',
        relevance: 'high',
        description: 'Asset management is a fundamental ISMS requirement in ISO 27001 A.8, covering inventory and classification'
      },
      {
        parameterName: 'Device Inventory Tracking',
        relevance: 'critical',
        description: 'Device inventory is the foundation of asset management; complete and accurate device inventory essential'
      },
      {
        parameterName: 'Identity Behavior & Hygiene',
        relevance: 'high',
        description: 'Identity behaviors applied to asset usage identify suspicious access to critical assets'
      }
    ]
  },
  {
    securityParameter: 'securityGovernance',
    description: 'Framework of policies, procedures, and oversight that directs the security program and ensures alignment with business objectives',
    frameworkMappings: [
      {
        parameterName: 'Infrastructure Mode of Operation',
        relevance: 'medium',
        description: 'Governance varies somewhat by infrastructure (cloud governance vs. traditional IT governance)'
      },
      {
        parameterName: 'Security Risks & Vulnerabilities',
        relevance: 'high',
        description: 'Poor governance is a meta-risk that amplifies other risks; policy gaps are vulnerabilities'
      },
      {
        parameterName: 'Baseline Configuration',
        relevance: 'medium',
        description: 'Baseline policy frameworks, documentation standards, and governance processes'
      },
      {
        parameterName: 'Security Control vs Framework',
        relevance: 'high',
        description: 'Governance is the foundation of all security frameworks; maps to ISO 27001 (A.5, A.6)'
      },
      {
        parameterName: 'Compliance Requirements',
        relevance: 'high',
        description: 'Standards require governance (SOC 2, ISO 27001 policy requirements)'
      },
      {
        parameterName: 'Regulatory Requirements',
        relevance: 'high',
        description: 'Regulations increasingly focus on governance (GDPR, NYCRR 500 governance requirements)'
      },
      {
        parameterName: 'Standards & Guidelines',
        relevance: 'high',
        description: 'References standards like NIST 800-53 PL/PM controls and ISO 27001 clauses 4-10'
      },
      {
        parameterName: 'Relevant ACQ Tools',
        relevance: 'medium',
        description: 'Identifies tools for policy management, compliance tracking, and risk registers'
      },
      {
        parameterName: 'Adversarial Insight (MITRE ATT&CK)',
        relevance: 'low',
        description: 'Limited direct mapping, but indirectly supports defense against all tactics'
      },
      {
        parameterName: 'Information Security Management System (ISMS)',
        relevance: 'critical',
        description: 'Security governance is the foundation of ISMS; ISO 27001 clauses 4-10 define the core governance mechanisms'
      },
      {
        parameterName: 'Device Inventory Tracking',
        relevance: 'high',
        description: 'Security governance must define policies for device inventory and management'
      },
      {
        parameterName: 'Identity Behavior & Hygiene',
        relevance: 'high',
        description: 'Governance frameworks must establish policies for identity management and acceptable use'
      }
    ]
  },
  {
    securityParameter: 'complianceManagement',
    description: 'Monitoring and maintenance of adherence to applicable laws, regulations, and standards',
    frameworkMappings: [
      {
        parameterName: 'Infrastructure Mode of Operation',
        relevance: 'medium',
        description: 'Compliance needs vary by infrastructure (cloud compliance vs. on-premises requirements)'
      },
      {
        parameterName: 'Security Risks & Vulnerabilities',
        relevance: 'high',
        description: 'Non-compliance is both a risk (fines, penalties) and a vulnerability indicator'
      },
      {
        parameterName: 'Baseline Configuration',
        relevance: 'medium',
        description: 'Baseline configurations for compliance monitoring and audit processes'
      },
      {
        parameterName: 'Security Control vs Framework',
        relevance: 'high',
        description: 'Compliance management is integral to frameworks like ISO 27001 (A.18) and NIST CSF'
      },
      {
        parameterName: 'Compliance Requirements',
        relevance: 'critical',
        description: 'Self-referential: the process of managing compliance with standards'
      },
      {
        parameterName: 'Regulatory Requirements',
        relevance: 'high',
        description: 'The process of managing compliance with regulations and laws'
      },
      {
        parameterName: 'Standards & Guidelines',
        relevance: 'high',
        description: 'References standards like NIST 800-53 AU controls and ISO 27001 A.18'
      },
      {
        parameterName: 'Relevant ACQ Tools',
        relevance: 'high',
        description: 'Identifies tools for compliance tracking, audit management, and evidence collection'
      },
      {
        parameterName: 'Adversarial Insight (MITRE ATT&CK)',
        relevance: 'low',
        description: 'Limited direct mapping, but compliance gaps can indicate exploitable weaknesses'
      },
      {
        parameterName: 'Information Security Management System (ISMS)',
        relevance: 'high',
        description: 'Compliance monitoring and evaluation is a core component of ISMS; ISO 27001 requires internal audits and management reviews'
      },
      {
        parameterName: 'Device Inventory Tracking',
        relevance: 'high',
        description: 'Many compliance frameworks require accurate device inventory for demonstrating control over systems within scope'
      },
      {
        parameterName: 'Identity Behavior & Hygiene',
        relevance: 'high',
        description: 'Identity management controls are essential compliance requirements in most regulatory frameworks'
      }
    ]
  },
  {
    securityParameter: 'assetManagement',
    description: 'Management of all IT assets (hardware, software, data) throughout their lifecycle from procurement to disposition',
    frameworkMappings: [
      {
        parameterName: 'Device Inventory Tracking',
        relevance: 'critical',
        description: 'Device inventory is the foundation of asset management; enables tracking of device lifecycle from procurement to retirement'
      },
      {
        parameterName: 'Infrastructure Mode of Operation',
        relevance: 'high',
        description: 'Asset types and management approaches differ by infrastructure (cloud resources vs. on-premises equipment)'
      },
      {
        parameterName: 'Security Risks & Vulnerabilities',
        relevance: 'high',
        description: 'Unmanaged assets are major security risks; missing devices create blind spots in security posture'
      },
      {
        parameterName: 'Baseline Configuration',
        relevance: 'high',
        description: 'Asset management provides the foundation for configuration baselines and standard builds'
      },
      {
        parameterName: 'Security Control vs Framework',
        relevance: 'medium',
        description: 'Maps to asset management domains in ISO 27001 (A.8) and NIST CSF (ID.AM)'
      },
      {
        parameterName: 'Compliance Requirements',
        relevance: 'high',
        description: 'Standards require asset inventory and management (PCI DSS 2.4, HIPAA asset tracking)'
      },
      {
        parameterName: 'Regulatory Requirements',
        relevance: 'medium',
        description: 'Regulations often require tracking of assets that store or process sensitive data'
      },
      {
        parameterName: 'Standards & Guidelines',
        relevance: 'medium',
        description: 'References standards like NIST 800-53 CM controls and ISO 27001 A.8'
      },
      {
        parameterName: 'Relevant ACQ Tools',
        relevance: 'high',
        description: 'Identifies tools for asset discovery, tracking, and management'
      },
      {
        parameterName: 'Adversarial Insight (MITRE ATT&CK)',
        relevance: 'medium',
        description: 'Unmanaged assets are primary targets for attackers through Discovery (TA0007) tactics'
      },
      {
        parameterName: 'Information Security Management System (ISMS)',
        relevance: 'high',
        description: 'Asset management is a required component of ISMS frameworks; ISO 27001 requires an inventory of assets'
      },
      {
        parameterName: 'Identity Behavior & Hygiene',
        relevance: 'high',
        description: 'Links between users and the devices they access; creates accountability for asset usage'
      }
    ]
  },
  {
    securityParameter: 'identityAndAccessManagement',
    description: 'Comprehensive management of digital identities, permissions, authentication, and access controls',
    frameworkMappings: [
      {
        parameterName: 'Identity Behavior & Hygiene',
        relevance: 'critical',
        description: 'Core component of modern IAM; enables monitoring and analysis of identity behaviors for anomaly detection'
      },
      {
        parameterName: 'Device Inventory Tracking',
        relevance: 'critical',
        description: 'Devices have identities that must be managed; enables enforcement of device-based access controls'
      },
      {
        parameterName: 'Infrastructure Mode of Operation',
        relevance: 'high',
        description: 'Identity management approaches vary by infrastructure (cloud identity providers vs. on-premises directories)'
      },
      {
        parameterName: 'Security Risks & Vulnerabilities',
        relevance: 'critical',
        description: 'Compromised identities and credential theft are primary attack vectors; improper authentication is a critical vulnerability'
      },
      {
        parameterName: 'Baseline Configuration',
        relevance: 'high',
        description: 'Identity stores, MFA settings, and access control policies form essential security baselines'
      },
      {
        parameterName: 'Security Control vs Framework',
        relevance: 'high',
        description: 'Maps to IAM domains in frameworks like NIST CSF (PR.AC), ISO 27001 (A.9)'
      },
      {
        parameterName: 'Compliance Requirements',
        relevance: 'high',
        description: 'Standards mandate strong authentication and access controls (PCI DSS 8, HIPAA Security Rule)'
      },
      {
        parameterName: 'Regulatory Requirements',
        relevance: 'high',
        description: 'Regulations focus on identity verification and authorization (GDPR, HIPAA)'
      },
      {
        parameterName: 'Standards & Guidelines',
        relevance: 'high',
        description: 'References standards like NIST 800-63 (Digital Identity) and ISO 27001 A.9.2'
      },
      {
        parameterName: 'Relevant ACQ Tools',
        relevance: 'high',
        description: 'Identifies tools for identity security assessment, privilege analysis, and access control testing'
      },
      {
        parameterName: 'Adversarial Insight (MITRE ATT&CK)',
        relevance: 'high',
        description: 'Maps to Credential Access (TA0006), Privilege Escalation (TA0004), and Initial Access (TA0001) tactics'
      },
      {
        parameterName: 'Information Security Management System (ISMS)',
        relevance: 'critical',
        description: 'Identity and access management is a cornerstone of ISMS; requires formal processes for identity lifecycle management'
      }
    ]
  }
];