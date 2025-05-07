  {
    sosParameter: 'Device Inventory Tracking',
    description: 'Comprehensive inventory management of all hardware devices in the environment including laptops, phones, IoT devices, and servers',
    securityDomainMappings: [
      {
        securityParameter: 'identityBehaviorHygiene',
        relevance: 'critical',
        description: 'Strong bidirectional relationship with Identity Behavior & Hygiene; device usage and authentication are core aspects of identity behavior'
      },
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
        relevance: 'critical',
        description: 'Devices have identities (certificates, MAC/IP, device IDs) that must be managed; strongly interrelates with Identity Behavior & Hygiene; enables enforcement of least privilege'
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
  },