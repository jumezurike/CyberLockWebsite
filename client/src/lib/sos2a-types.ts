// Types for the SOS²A assessment tool
export interface ContactInfo {
  name: string;
  pointOfContact: string;
  email: string;
  contactEmail: string;
  phone: string;
  sameAsContact?: boolean;
}

export interface FrameworkSelection {
  operations: string[];
  management: string[];
  technology: string[];
  people?: string[]; // Added people domain
}

export interface ComplianceRequirements {
  frameworks: string[]; // NIST, CIS, etc.
  standards: string[]; // ISO, ANSI, etc.
  compliance: string[]; // HIPAA, PCI-DSS, etc.
  regulations: string[]; // CCPA, GDPR, etc.
  guidelines: string[]; // Guidelines (optional) for security
  healthcare: string[]; // Healthcare-specific regulations (HIPAA, HITECH, etc.)
  financial: string[]; // Financial/payment regulations (PCI-DSS, SOX, etc.)
  industrySpecific: string[]; // Industry-specific regulations (NERC CIP, TISAX, etc.)
}

export interface PolicyDocuments {
  policies: string[];
  procedures: string[];
  plans: string[];
  guides: string[];
}

export interface DeviceInventoryTracking {
  // 1. Identification
  deviceId?: string;
  makeModel?: string;
  colorDescription?: string;
  serialNumber?: string;
  owner?: string;
  deviceNickname?: string;
  
  // 2. Classification
  deviceType?: string[];
  endpointCategory?: string[];
  operatingSystem?: string;
  browsersInstalled?: string[];
  
  // 3. Network & Location
  ipAddress?: string;
  macAddress?: string;
  networkZone?: string[];
  lastKnownLocation?: string;
  assignedDepartment?: string;
  
  // 4. Security Posture
  encryptionStatus?: string[];
  antivirusInstalled?: boolean;
  firewallActive?: boolean;
  patchStatus?: string;
  securityComplianceLevel?: string[];
  vpnMdmEnrollment?: boolean;
  tpmPresent?: boolean;
  
  // 5. Usage & Monitoring
  lastLoginDate?: string;
  lastNetworkCheckin?: string;
  deviceStatus?: string;
  deviceRiskScore?: number;
  
  // 6. Lifecycle & Ownership
  procurementDate?: string;
  warrantyExpiration?: string;
  deviceLifecycleStatus?: string;
  assignedPolicies?: string[];
}

export interface IdentityBehaviorHygiene {
  // 1. Authentication Practices
  passwordPolicyCompliance?: boolean;
  passwordPolicyDetails?: string;
  mfaStatus?: boolean;
  mfaTypes?: string[];
  biometricAuthentication?: boolean;
  biometricTypes?: string[];
  
  // 2. Access Behavior
  loginPatterns?: string;
  remoteAccessFrequency?: string;
  sessionDuration?: string;
  abnormalAccessDetection?: boolean;
  locationBasedAccess?: boolean;
  
  // 3. Identity Protection
  identityProtectionTraining?: boolean;
  trainingCompletionDate?: string;
  phishingAwarenessLevel?: string;
  securityIncidentHistory?: boolean;
  incidentDetails?: string;
  
  // 4. Privileged Access Management
  privilegedAccountInventory?: boolean;
  justInTimeAccess?: boolean;
  privilegeEscalationControls?: boolean;
  adminAccountReview?: string;
  separationOfDuties?: boolean;
  
  // 5. Identity Lifecycle Management
  onboardingStatus?: string;
  offboardingProcess?: boolean;
  accessReviewFrequency?: string;
  roleChanges?: boolean;
  accountDormancyMonitoring?: boolean;
}

export interface Sos2aFormData {
  // 1. Business Information
  businessName: string;
  businessAddress: string;
  businessLocation: {
    city: string;
    state: string;
    country: string;
    zipCode?: string;
  };
  industry: string;
  customIndustry?: string;
  showCustomIndustry?: boolean;
  employeeCount: string;
  businessServices: string;
  
  // 2. Infrastructure Mode of Operation
  operationMode: string[];
  customOperationMode?: string;
  showCustomOperationMode?: boolean;
  internetPresence: string[];
  primaryConcerns: string[];
  vulnerabilities: string[];
  
  // 3. Security Risks & Vulnerabilities
  securityRisks?: string[];
  websiteVulnerabilities?: string[];
  endDeviceVulnerabilities?: string[];
  
  // 3. Configuration Baseline
  configurationManagement?: string;
  systemHardeningApproach?: string;
  
  // Architecture Diagrams for Threat Modeling
  hasArchitectureDiagrams?: boolean;
  architectureDiagramFiles?: File[];
  cisBenchmarks?: string[];
  configBaseline?: string; // Added for dropdown selection
  primaryCisBenchmark?: string; // Added for dropdown selection
  cisVersion?: string; // Added for version selection
  operatingSystems?: string[]; // List of selected operating systems
  customOperatingSystem?: string; // Custom/legacy OS input
  showCustomOperatingSystem?: boolean; // Controls visibility of custom OS field
  
  // 4. Security Control Framework
  securityMeasures: string[];
  frameworks: FrameworkSelection;
  
  // 5. Compliance
  complianceRequirements: ComplianceRequirements;
  
  // 6. Regulatory Requirements
  regulatoryRequirements?: string[];
  
  // 7. Standards
  healthcareStandards?: string[];
  healthcareGuidelines?: string[];
  securityGuidelines?: string[];
  governmentGuidelines?: string[];
  privacyGuidelines?: string[];
  cloudIotGuidelines?: string[];
  operationalGuidelines?: string[];
  policyDocuments: PolicyDocuments;
  
  // 8. Relevant ACQ Tool (Assessment, Checklist, Questionnaire)
  relevantACQTools?: {
    assessments?: string[];
    checklists?: string[];
    questionnaires?: string[];
  };
  
  // 9. Adversarial Insight (MITRE ATT&CK)
  osHardening: {
    stig: boolean;
    scap: boolean;
    guidelines: string[];
  };
  // Enhanced MITRE ATT&CK fields
  mitreTactics?: string[]; // MITRE ATT&CK Tactics with TA IDs
  threatActorTypes?: string[]; // Different types of threat actors
  adversarialInsights: {
    mitreAttackIds: string[];
  };
  threatActors?: string[];
  
  // Additional Regulatory Content
  educationRequirements?: string[]; // Education sector regulatory requirements
  cloudRequirements?: string[]; // Cloud security requirements
  cyberRequirements?: string[]; // Cybersecurity standard requirements
  esgRequirements?: string[]; // Environmental & Social Governance requirements
  bestPracticeFrameworks?: string[]; // Best practice frameworks (ITIL, COBIT, OWASP)
  
  // 10. ISMS
  ismsImplementation?: string;
  ismsPolicies?: string[];
  ismsPlans?: string[];
  ismsProcedures?: string[];
  ismsProcesses?: string[];
  ismsLeadership?: {
    executiveSupport?: boolean;
    ciso?: boolean;
    boardReporting?: boolean;
    securityCommittee?: boolean;
  };
  
  // 11. Device Inventory Tracking
  deviceInventoryTracking?: DeviceInventoryTracking;
  
  // 12. Identity Behavior & Hygiene
  identityBehaviorHygiene?: IdentityBehaviorHygiene;
  
  // 13. Contact and Confirmation
  contactInfo: ContactInfo;
  
  // Report options
  matrixData: any | null; // Using any here since matrix data can be complex and varied
  reportType: 'preliminary' | 'comprehensive';
  preliminaryReportId?: string; // Reference to preliminary report ID (required for comprehensive reports)
  remediationStrategies?: Array<{issue: string; strategy: string}>; // Remediation strategies from preliminary report
  availabilityConfirmation: boolean;
  referralPermission: boolean;
  
  // Legal agreements
  eulaAccepted: boolean;
}

export interface SecurityRisk {
  severity: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
}

export interface SecurityMeasure {
  id: string;
  label: string;
  implemented: boolean;
}

export interface ComplianceStatus {
  standard: string;
  status: 'Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Not Applicable';
  gaps: string[];
}

export interface MatrixItem {
  infraType: string;
  risks: string[];
  vulnerabilities: string[];
  educationAwareness: boolean;
  ismsImplemented: boolean;
  riskManagementProcess: boolean;
  relevantACQTools?: {
    assessments?: string[];
    checklists?: string[];
    questionnaires?: string[];
  };
  relevantQuestionnaires?: string[]; // Maintaining for backward compatibility
  // New field for recommended standards from standardsLibrary (with healthcare highlighting)
  recommendedStandards?: Array<{id: string, name: string, isHealthcareRelevant: boolean}>;
  
  // Original control categories (maintaining for backward compatibility)
  operationControls: {
    frameworks: string[];
    applicable: boolean;
    implemented: boolean;
    gaps: string[];
  };
  managementControls: {
    frameworks: string[];
    applicable: boolean;
    implemented: boolean;
    gaps: string[];
  };
  technologyControls: {
    frameworks: string[];
    applicable: boolean;
    implemented: boolean;
    gaps: string[];
    osHardening: {
      stig: boolean;
      scap: boolean;
      implemented: boolean;
    };
  };
  peopleControls: {
    frameworks: string[];
    applicable: boolean;
    implemented: boolean;
    gaps: string[];
  };
  
  // 10 Security Parameters for Gap Analysis
  accessControl: {
    userAccessManagement: boolean;
    privilegeManagement: boolean;
    multiFactorAuth: boolean;
    passwordPolicy: boolean;
    implementationLevel: number; // 0-5 (Not Implemented to Optimized)
    gaps: string[];
    notes: string;
  };
  
  identityAndAccessManagement: {
    centralizedIdentityManagement: boolean;
    roleBasedAccessControl: boolean;
    justInTimeAccess: boolean;
    privilegedAccessManagement: boolean;
    implementationLevel: number; // 0-5 (Not Implemented to Optimized)
    gaps: string[];
    notes: string;
  };
  
  dataProtection: {
    dataEncryption: boolean;
    dataClassification: boolean;
    dataBackup: boolean;
    dataDeletion: boolean;
    implementationLevel: number;
    gaps: string[];
    notes: string;
  };
  
  securityAwareness: {
    trainingProgram: boolean;
    phishingSimulations: boolean;
    securityCulture: boolean;
    incidentReporting: boolean;
    implementationLevel: number;
    gaps: string[];
    notes: string;
  };
  
  incidentResponse: {
    irPlan: boolean;
    irTeam: boolean;
    irTesting: boolean;
    forensicCapabilities: boolean;
    implementationLevel: number;
    gaps: string[];
    notes: string;
  };
  
  networkSecurity: {
    firewalls: boolean;
    segmentation: boolean;
    intrusionDetection: boolean;
    wirelessSecurity: boolean;
    implementationLevel: number;
    gaps: string[];
    notes: string;
  };
  
  applicationSecurity: {
    secureCoding: boolean;
    vulnerabilityScanning: boolean;
    patchManagement: boolean;
    secureDeployment: boolean;
    implementationLevel: number;
    gaps: string[];
    notes: string;
  };
  
  thirdPartyManagement: {
    vendorAssessment: boolean;
    contractualRequirements: boolean;
    ongoingMonitoring: boolean;
    offboardingProcess: boolean;
    implementationLevel: number;
    gaps: string[];
    notes: string;
  };
  
  assetManagement: {
    inventoryManagement: boolean;
    assetClassification: boolean;
    endOfLifeManagement: boolean;
    assetTracking: boolean;
    implementationLevel: number;
    gaps: string[];
    notes: string;
  };
  
  securityGovernance: {
    securityPolicies: boolean;
    riskAssessment: boolean;
    complianceManagement: boolean;
    securityRoles: boolean;
    implementationLevel: number;
    gaps: string[];
    notes: string;
  };
  
  complianceManagement: {
    regulatoryMapping: boolean;
    complianceMonitoring: boolean;
    auditPreparation: boolean;
    remediationTracking: boolean;
    implementationLevel: number;
    gaps: string[];
    notes: string;
  };
  complianceStandards: {
    pciDss: boolean;
    hipaa: boolean;
    cmmc: boolean;
    gdpr: boolean;
    ccpa: boolean;
    soc2: boolean;
    iso27001: boolean;
    cyberEssentialsUk: boolean;
    ferpa: boolean;
    glba: boolean;
    pipeda: boolean;
    ftcSafeguardRules: boolean;
    sbaCsg: boolean;
  };
  regulatoryRequirements: {
    pciDss: boolean;
    coppa: boolean;
    hipaa: boolean;
    gdpr: boolean;
    ccpa: boolean;
    glba: boolean;
    ferpa: boolean;
    pipeda: boolean;
    ftcSafeguardRules: boolean;
    fisma: boolean;
    dfars: boolean;
  };
  standards: {
    iso27001: boolean;
    iso27002: boolean;
    nistCsf: boolean;
    nist80053: boolean;
    iso27018: boolean;
    iso27005: boolean;
    cisCsc: boolean;
    nist800171: boolean;
    itil: boolean;
    cobit: boolean;
  };
  mitreTactics: string[]; // MITRE ATT&CK Tactics
  mitreTechniques: string[]; // MITRE ATT&CK Techniques
  policyDocuments: {
    policies: string[];
    procedures: string[];
    plans: string[];
    processes: string[];
  };
  osHardening: {
    stigScap: boolean;
    guidelines: string[];
  };
  isms: {
    implementation: string;
    // 1. Traditional 4Ps components (maintaining backward compatibility)
    policies: string[];
    plans: string[];
    procedures: string[];
    processes: string[];
    
    // 2. Expanded ISO 27001-aligned components
    governanceLeadership?: {
      ismsScope?: boolean;
      rolesResponsibilities?: boolean;
      managementReview?: boolean;
      statementOfApplicability?: boolean;
    };
    riskManagement?: {
      riskAssessmentMethodology?: boolean;
      riskRegister?: boolean;
      riskTreatmentPlan?: boolean;
    };
    assetManagement?: {
      assetInventory?: boolean;
      assetClassification?: boolean;
      dataFlowDiagrams?: boolean;
    };
    complianceLegal?: {
      regulatoryComplianceRegister?: boolean;
      contractualSecurityClauses?: boolean;
      auditReports?: boolean;
    };
    operationalControls?: {
      secureConfigurationBaselines?: boolean;
      changeManagementLogs?: boolean;
      backupTestingRecords?: boolean;
    };
    performanceEvaluation?: {
      keyPerformanceIndicators?: boolean;
      securityMetricsDashboard?: boolean;
      internalAuditReports?: boolean;
    };
    continuousImprovement?: {
      correctiveActionPlans?: boolean;
      lessonsLearnedRepository?: boolean;
      ismsImprovementRoadmap?: boolean;
    };
  };
}

export interface ScorecardItem {
  parameter: string;
  weight: number;
  score: number; // 0-100 score for this parameter
  notes?: string; // Optional notes about this score
}

export interface RasbitaRiskItem {
  id?: string; // Used for database identification
  assetName: string;
  assetValue: number; // AV
  threatName: string;
  exposureFactor: number; // EF (percentage as decimal, e.g., 0.3 for 30%)
  annualizedRateOfOccurrence: number; // ARO
  singleLossExpectancy: number; // SLE = AV * EF
  annualizedLossExpectancy: number; // ALE = SLE * ARO
  annualCostOfSafeguard: number; // ACS
  annualizedLossExpectancyAfterControls?: number; // ALE after implementing controls
  netRiskReductionBenefit: number; // NRRB = [ALE(prior) - ALE(post)] - ACS
  priority: 'Critical' | 'High' | 'Medium' | 'Low'; // Based on impact and probability
  probability?: number; // 0-1 representing likelihood of occurrence
  impact: number; // 1-10 representing severity of impact
  // Additional properties for RASBITA calculations
  likelihood?: number; // 1-10 scale for likelihood calculation
  threatLevel?: number; // 1-10 scale for threat severity
  safeguardEffectiveness?: number; // 1-10 scale for effectiveness
  confidentiality?: number; // 1-10 scale for confidentiality impact
  integrity?: number; // 1-10 scale for integrity impact
  availability?: number; // 1-10 scale for availability impact
  feasibilityFactors: {
    organizational: boolean;
    behavioral: boolean;
    technical: boolean;
    political: boolean;
    operational?: boolean; // Some functions expect this property
    economic?: boolean; // Some functions expect this property
  };
  deviceInfo?: {
    deviceType: string;
    deviceCount: number;
    damagedDevices: number;
  };
  useCustomAssetValue?: boolean;
  customAssetValue?: string;
}

export interface RasbitaReport {
  id: string | number;
  userId?: number;
  businessId: string;
  title: string;
  incidentCategory: string;
  createdAt: string;
  updatedAt?: string;
  overallRiskScore: number;
  company: {
    name?: string;
    department?: string;
    reportGenerator?: {
      name?: string;
      title?: string;
    };
    logo?: string;
  };
  incident: {
    title: string;
    description: string;
    date: string;
    category: string;
    affectedSystems: string;
  };
  riskItems: RasbitaRiskItem[];
  governanceMaturity?: {
    governanceScore: number; // 0-4 tiered score
    managementScore: number; // 0-4 tiered score
    completed?: boolean; // Indicates whether the assessment has been completed
  };
  rasbitaCategories: {
    govern: number;
    identify: number;
    protect: number;
    detect: number;
    respond: number;
    recover: number;
  };
  financialSummary: {
    totalAssetValue: number;
    totalAnnualizedLossExpectancy: number;
    totalCostOfSafeguards: number;
    totalNetRiskReductionBenefit: number;
  };
  dashboard: {
    mostFrequentUser: string;
    mostCurrentReportDate: string;
    userCount: number;
    mostFrequentThreat: string;
    leastFrequentThreat: string;
    minThreatCost: number;
    maxThreatCost: number;
    minALE: number;
    maxALE: number;
    minACS: number;
    maxACS: number;
    mostFrequentPriority: string;
  };
  // Device impact data
  deviceType?: string;
  totalDevices?: number;
  affectedDevices?: number;
  percentageAffected?: string;
  totalDataCount?: number;
  dataLost?: number;
  
  // Financial impact data
  damagedDevicesCost?: number;
  threatSpreadCost?: number;
  residualCost?: number;
}

export interface AssessmentReport {
  id: string;
  businessId: string;
  reportType: 'preliminary' | 'comprehensive';
  preliminaryReportId?: string; // Reference to preliminary report ID (required for comprehensive reports)
  createdAt: string;
  updatedAt?: string; // Last modification date
  age?: number; // Age of the assessment in days
  securityScore: number;
  businessLocation: {
    state: string;
    country: string;
    zipCode?: string;
  };
  remediationStrategies?: Array<{issue: string; strategy: string}>; // Remediation strategies from preliminary report
  industry: string;
  businessServices: string;
  operationModes: string[];
  internetPresence: string[];
  findings: SecurityRisk[];
  vulnerabilities: {
    critical: string[];
    high: string[];
    medium: string[];
    low: string[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  frameworkGaps: {
    operations: string[];
    management: string[];
    technology: string[];
  };
  complianceStatus: {
    standards: ComplianceStatus[];
    regulations: ComplianceStatus[];
    frameworks: ComplianceStatus[];
  };
  policyDocumentStatus: {
    existing: string[];
    missing: string[];
    recommendations: string[];
  };
  osHardeningStatus: {
    stig: {
      compliant: boolean;
      gaps: string[];
    };
    scap: {
      compliant: boolean;
      gaps: string[];
    };
  };
  ismsStatus: {
    implementation: string;
    // Traditional 4Ps components
    policies: {
      implemented: string[];
      missing: string[];
    };
    plans: {
      implemented: string[];
      missing: string[];
    };
    procedures: {
      implemented: string[];
      missing: string[];
    };
    processes: {
      implemented: string[];
      missing: string[];
    };
    // Expanded ISO 27001-aligned components
    governanceLeadership?: {
      implemented: string[];
      missing: string[];
      score?: number; // 0-4 maturity score
    };
    riskManagement?: {
      implemented: string[];
      missing: string[];
      score?: number; // 0-4 maturity score
    };
    assetManagement?: {
      implemented: string[];
      missing: string[];
      score?: number; // 0-4 maturity score
    };
    complianceLegal?: {
      implemented: string[];
      missing: string[];
      score?: number; // 0-4 maturity score
    };
    operationalControls?: {
      implemented: string[];
      missing: string[];
      score?: number; // 0-4 maturity score
    };
    performanceEvaluation?: {
      implemented: string[];
      missing: string[];
      score?: number; // 0-4 maturity score
    };
    continuousImprovement?: {
      implemented: string[];
      missing: string[];
      score?: number; // 0-4 maturity score
    };
    iso27001Alignment?: {
      clause4?: number; // 0-4 alignment score
      clause5?: number; // 0-4 alignment score
      clause6?: number; // 0-4 alignment score
      clause7?: number; // 0-4 alignment score
      clause8?: number; // 0-4 alignment score
      clause9?: number; // 0-4 alignment score
      clause10?: number; // 0-4 alignment score
      overallScore?: number; // Overall alignment score
    };
    recommendedNext: string[];
  };
  mitreAttackCoverage: {
    covered: string[];
    vulnerable: string[];
    recommendations: string[];
  };
  matrixData: MatrixItem[];
  scorecard: ScorecardItem[]; // New scorecard items with specific parameters
  rasbitaScore: {
    total: number;
    categories: {
      govern: number;
      identify: number;
      protect: number;
      detect: number;
      respond: number;
      recover: number;
      // Legacy fields for compatibility
      risk?: number;
      securityControls?: number;
      architecture?: number;
    };
    gpaScores?: {
      total: number;
      govern: number;
      identify: number;
      protect: number;
      detect: number;
      respond: number;
      recover: number;
    };
    hipaaCompliance?: number | null;
    industryType?: string;
  };
  // Explicit categories for compatibility with RasbitaReport format
  rasbitaCategories?: {
    govern: number;
    identify: number;
    protect: number;
    detect: number;
    respond: number;
    recover: number;
  };
}
