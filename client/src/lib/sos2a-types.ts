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
  // 1. Identification - Enhanced with structured user/owner and contact
  deviceId?: string;
  makeModel?: string;
  serialNumber?: string;
  owner?: string; // Dropdown selection
  firstName?: string;
  lastName?: string;
  role?: string; // User, Administrator, Super User, etc.
  contactEmail?: string; // Linked to owner
  contactPhone?: string; // Linked to owner
  deviceNickname?: string;
  colorDescription?: string; // Keep for backward compatibility
  
  // 2. Classification - Expanded with browser engines
  deviceType?: string[]; // Laptop, Desktop, Server, Mobile, Tablet, Router, Switch, Firewall, IoT Device, Smartwatch, Printer, Transportation Device, Other
  endpointCategory?: string[]; // User Device, Shared Asset, Infrastructure Device, Monitoring System, Security Device
  operatingSystem?: string;
  browsersInstalled?: string[]; // Chrome (Chromium), Firefox (Gecko), Safari (WebKit), Edge (Chromium), Opera (Chromium), Brave (Chromium), Internet Explorer (Trident)
  
  // 3. Network & Location - Added environment field
  ipAddress?: string;
  macAddress?: string;
  environment?: string; // Production, Development, Test, Staging
  lastKnownLocation?: string;
  assignedDepartment?: string;
  networkZone?: string[]; // DMZ, Internal, Guest, Management, Secured/Isolated, IoT Network, VPN
  
  // 4. Security Posture - Enhanced encryption and compliance options
  encryptionStatus?: string[]; // Full Disk Encryption, File-Level Encryption, Removable Media Encryption, No Encryption, Partial Encryption, Unknown
  antivirusInstalled?: boolean;
  firewallActive?: boolean;
  tpmPresent?: boolean;
  patchStatus?: string; // OS, App, Firmware patch status
  vpnMdmEnrollment?: boolean;
  securityComplianceLevel?: string[]; // HIPAA, CMMC, ISO 27001, NIST 800-171, SOC 2, PCI DSS, GDPR, FISMA, None
  
  // 5. Lifecycle Management - Disposal and data sanitization
  disposalLocation?: string;
  handlingCompany?: string; // e.g., Each1Teach1 Tech
  dataSanitizationMethod?: string;
  
  // 6. Usage & Monitoring - Streamlined
  lastLoginDate?: string;
  lastNetworkCheckin?: string;
  deviceStatus?: string; // Device Activity / Status
  deviceRiskScore?: number; // 0-100 from SIEM/EDR
  
  // 7. Lifecycle & Ownership - Maintenance and policy tracking
  procurementDate?: string;
  procurementVendor?: string;
  warrantyExpiration?: string;
  deviceLifecycleStatus?: string;
  assignedPolicies?: string[]; // Finance Only, Executive, IT Admin, Developer, Guest Access, Restricted Access, BYOD, Remote Worker, Standard User
  
  // Backward compatibility fields
  backupStatus?: boolean;
  backupFrequency?: string;
  backupType?: string;
  backupLocation?: string;
  backupFolder?: string;
  backupRetentionPeriod?: string;
  backupLastTested?: string;
  backupDetails?: string;
}

export interface IdentityComponent {
  id: string;
  identityType: string;
  userId: string;
  fullName: string;
  role: string;
  accessLevel: string;
  department: string;
  contactInfo: string;
  assignedRiskLevel: string;
  mfaEnabled: boolean;
  lastReview: string;
  status: string;
}

export interface IdentityBehaviorHygiene {
  // 1. Identification
  identificationMethod?: string;
  
  // Authentication Practices
  passwordPolicyCompliance?: boolean;
  passwordPolicyDetails?: string;
  mfaStatus?: boolean;
  mfaTypes?: string[];
  biometricAuthentication?: boolean;
  biometricTypes?: string[];
  
  // Password Management
  passwordLastChanged?: string;
  passwordComplexity?: string;
  passwordLength?: string;
  passwordExpirationDays?: string;
  
  // Federated Identity
  federatedIdentitySource?: string;
  otherFederatedIdentitySource?: string;
  
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
  
  // Access Control Models
  accessControlModel?: string; // ABAC, RBAC, ROBAC, None
  accessDuration?: string; // 1-30 days, 1-3 months, 1-6 months, permanent
  
  // 5. Identity Lifecycle Management
  onboardingStatus?: string;
  offboardingProcess?: boolean;
  accessReviewFrequency?: string;
  roleChanges?: boolean;
  accountDormancyMonitoring?: boolean;
  
  // New fields based on user request
  // 1. Identification
  userId?: string;
  fullNameRole?: string;
  contactInfo?: string;
  identityType?: string;
  
  // 2. Classification
  accessTier?: string;
  departmentTeam?: string;
  assignedRiskLevel?: string;
  federatedIdentitySource2?: string; // Adding a second field since we already have one
  
  // 3. Access & Permissions
  assignedRoles?: string;
  entitlements?: string;
  accessDuration2?: string; // Adding a second field since we already have one
  mfaStatus2?: string; // Adding a second field since we already have one
  mfaMethod?: string;
  
  // 4. Security Posture
  passwordHygiene?: string;
  breachedCredentialChecks?: boolean;
  sessionTimeoutSettings?: string;
  unusedAccountDetection?: boolean;
  privilegeEscalationAlerts?: boolean;
  
  // 5. Behavior Monitoring
  typicalLoginPatterns?: string;
  anomalyDetectionFlags?: boolean;
  dataAccessTrends?: string;
  toolCommandUsage?: string;
  
  // 6. Lifecycle & Governance
  onboardingOffboardingDate?: string;
  accessReviewSchedule?: string;
  certificationStatus?: boolean;
  incidentHistory?: string;
}

export interface DeviceInventoryItem {
  id: string;
  deviceType?: string;
  makeModel?: string;
  serialNumber?: string;
  sensitivityLevel?: string;
  networkZone?: string;
  lastKnownLocation?: string;
  owner?: string;
  patchStatus?: string;
  lastLoginDate?: string;
  osVersion?: string;
  operatingSystem?: string; // Added for device inventory bulk view
  securitySoftware?: string[];
  authorizedUsers?: string[];
  acquisitionDate?: string;
  expectedLifespan?: string;
  ownershipType?: string;
  disposalPlan?: string;
  notes?: string; // Added for device inventory bulk view
  encryptionStatus?: string; // Added for device inventory bulk view
  lastPatchDate?: string; // Added for device inventory bulk view
  
  // Network details
  macAddress?: string;
  ipAddress?: string;
  
  // Enhanced backup details
  backupStatus?: boolean;
  backupFrequency?: string; // Daily, Weekly, Monthly, etc.
  backupType?: string; // Full, Incremental, Differential
  backupLocation?: string; // Local, Network, Cloud
  backupFolder?: string; // Specific folder/path that is backed up
  backupRetentionPeriod?: string; // How long backups are kept
  backupLastTested?: string; // Date last tested for restoration
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
  
  // Device inventory list
  deviceInventory?: DeviceInventoryItem[];
  currentEditedDeviceIndex?: number;
  
  // Device filtering options
  deviceTypeFilter?: string;
  filteredDeviceInventory?: DeviceInventoryItem[];
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
  isms?: {
    processes?: string[];
    implementation?: string;
    policies?: string[];
    plans?: string[];
    procedures?: string[];
  };
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
  
  // 12 SOS²A Parameters
  infrastructureMode?: {
    cloud?: boolean;
    hybrid?: boolean;
    onPremises?: boolean;
    implementationLevel?: number;
    gaps?: string[];
    notes?: string;
  };
  
  securityRisks?: {
    assessmentPerformed?: boolean;
    vulnerabilitiesDocumented?: boolean;
    implementationLevel?: number;
    gaps?: string[];
    notes?: string;
  };
  
  baselineConfig?: {
    documented?: boolean;
    reviewed?: boolean;
    implementationLevel?: number;
    gaps?: string[];
    notes?: string;
  };
  
  securityControlFramework?: {
    nist?: boolean;
    iso27001?: boolean;
    implementationLevel?: number;
    gaps?: string[];
    notes?: string;
  };
  
  complianceRequirements?: {
    hipaa?: boolean;
    gdpr?: boolean;
    pci?: boolean;
    cmmc?: boolean;
    implementationLevel?: number;
    gaps?: string[];
    notes?: string;
  };
  
  // Rename this to avoid conflict with the existing property
  regulatoryReqs?: {
    dfars?: boolean;
    nistsp800?: boolean;
    implementationLevel?: number;
    gaps?: string[];
    notes?: string;
  };
  
  standardsGuidelines?: {
    fips?: boolean;
    fedramp?: boolean;
    implementationLevel?: number;
    gaps?: string[];
    notes?: string;
  };
  
  relevantAcqTools?: {
    sam?: boolean;
    sbir?: boolean;
    implementationLevel?: number;
    gaps?: string[];
    notes?: string;
  };
  
  adversarialInsight?: {
    mitreMapped?: boolean;
    threatModeling?: boolean;
    implementationLevel?: number;
    gaps?: string[];
    notes?: string;
  };
  
  informationSecurityManagementSystem?: {
    ismsImplemented?: boolean;
    iso27001Compliant?: boolean;
    implementationLevel?: number;
    gaps?: string[];
    notes?: string;
  };
  
  deviceInventoryTracking?: {
    // Section 1: Identification
    deviceId?: string;
    assetTag?: string;
    makeModel?: string;
    serialNumber?: string;
    owner?: string;
    ownerContact?: string;
    role?: string;
    
    // Section 2: Classification
    deviceType?: string;
    operatingSystem?: string;
    osVersion?: string;
    purpose?: string;
    classification?: string;
    transportationDeviceType?: string;
    browserEngine?: string;
    
    // Section 3: Network & Location
    ipAddress?: string;
    macAddress?: string;
    networkLocation?: string;
    environment?: string;
    networkZones?: string[];
    
    // Section 4: Security Posture
    encryptionStatus?: string[];
    antivirusStatus?: string;
    patchStatus?: string;
    vpnMdmEnrollment?: boolean;
    securityComplianceLevel?: string[];
    
    // Section 5: Lifecycle Management
    disposalLocation?: string;
    handlingCompany?: string;
    dataSanitizationMethod?: string;
    
    // Section 6: Usage & Monitoring
    lastLoginDate?: string;
    lastNetworkCheckin?: string;
    deviceStatus?: string;
    deviceRiskScore?: number;
    
    // Section 7: Lifecycle & Ownership
    procurementDateVendor?: string;
    warrantyExpiration?: string;
    deviceLifecycleStatus?: string;
    disposalDecommissionLocation?: string;
    handlingCompanyOrganization?: string;
    assignedPolicies?: string[];
    
    // Legacy fields for backward compatibility
    procurementDate?: string;
    procurementVendor?: string;
    
    // Legacy fields for backward compatibility
    inventorySystem?: boolean;
    updatedRegularly?: boolean;
    assetTagging?: boolean;
    implementationLevel?: number;
    gaps?: string[];
    notes?: string;
  };
  
  identityBehaviorHygiene?: {
    userAwarnessTraining?: boolean;
    passwordPolicy?: boolean;
    mfaImplemented?: boolean;
    implementationLevel?: number;
    gaps?: string[];
    notes?: string;
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
  // Legacy isms moved to ismsDetails
  ismsDetails: {
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

export interface GapAnalysisResult {
  // Overall results
  overallScore: {
    percentage: number;
    grade: string;
  };
  overallGapPercentage: number;
  parameterGaps: Array<{
    parameter: string;
    currentScore: number;
    industryBenchmark: number;
    gap: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }>;
  recommendations: Array<{
    area: string;
    recommendation: string;
    impact: string;
    effort: string;
  }>;
}

export interface AssessmentReport {
  id: string;
  businessId: string;
  businessName: string; // Added for organization identification
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
  location?: string; // Added for simplified location display
  remediationStrategies?: Array<{issue: string; strategy: string}>; // Remediation strategies from preliminary report
  industry: string;
  businessServices: string;
  operationModes: string[];
  internetPresence: string[];
  architectureDiagramsProvided?: boolean;
  
  // Summary data
  summary?: {
    criticalVulnerabilities: number;
    highRisks: number;
    mediumRisks: number;
    lowRisks: number;
  };
  
  // RASBITA scoring
  rasbitaScore?: {
    overall: number;
    total?: number;
    categories: {
      govern: number;
      identify: number;
      protect: number;
      detect: number;
      respond: number;
      recover: number;
      risk?: number;
      securityControls?: number;
      architecture?: number;
      adversarial?: number;
      security?: number;
      business?: number;
      information?: number;
      threat?: number;
      [key: string]: number | undefined;
    };
    gpaScores?: {
      [key: string]: number;
    };
    hipaaCompliance?: number;
  };
  
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
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
