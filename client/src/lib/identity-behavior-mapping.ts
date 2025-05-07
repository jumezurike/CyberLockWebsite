  {
    sosParameter: 'Identity Behavior & Hygiene',
    description: 'Monitoring and management of user identity behaviors, authentication practices, and access patterns across users and devices',
    securityDomainMappings: [
      {
        securityParameter: 'identityAndAccessManagement',
        relevance: 'critical',
        description: 'Identity behavior analytics is the core of modern IAM for detecting anomalies and ensuring proper user authentication'
      },
      {
        securityParameter: 'accessControl',
        relevance: 'critical',
        description: 'Identity hygiene directly impacts access control effectiveness through proper credential management and authorization'
      },
      {
        securityParameter: 'securityAwareness',
        relevance: 'high',
        description: 'User behavior reflects security awareness; training affects identity hygiene practices and credential protection'
      },
      {
        securityParameter: 'incidentResponse',
        relevance: 'high',
        description: 'Identity anomaly detection is a key trigger for incident response; behavior analytics identify compromises and account takeovers'
      },
      {
        securityParameter: 'dataProtection',
        relevance: 'high',
        description: 'Identity hygiene impacts data access control, authentication security, and potential for unauthorized data exposure'
      },
      {
        securityParameter: 'assetManagement',
        relevance: 'high',
        description: 'Device identities must be managed alongside user identities; creates strong links between users and their authorized devices'
      },
      {
        securityParameter: 'networkSecurity',
        relevance: 'high',
        description: 'Network access is increasingly based on identity rather than location; requires monitoring of identity behaviors for anomalies'
      },
      {
        securityParameter: 'securityGovernance',
        relevance: 'high',
        description: 'Governance includes identity lifecycle management policies, credential standards, and monitoring practices'
      },
      {
        securityParameter: 'complianceManagement',
        relevance: 'medium',
        description: 'Compliance frameworks increasingly require monitoring of identity behaviors, MFA enforcement, and access logging'
      },
      {
        securityParameter: 'thirdPartyManagement',
        relevance: 'medium',
        description: 'Third-party identities present unique risks and require special monitoring for unusual access patterns'
      },
      {
        securityParameter: 'applicationSecurity',
        relevance: 'medium',
        description: 'Applications must enforce identity hygiene requirements like MFA and proper session management'
      }
    ]
  }