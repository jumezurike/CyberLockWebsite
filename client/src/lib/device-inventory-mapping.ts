  {
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
  },