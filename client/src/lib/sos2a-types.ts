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
}

export interface ComplianceRequirements {
  frameworks: string[]; // NIST, CIS, etc.
  standards: string[]; // ISO, ANSI, etc.
  compliance: string[]; // HIPAA, PCI-DSS, etc.
  regulations: string[]; // CCPA, GDPR, etc.
}

export interface PolicyDocuments {
  policies: string[];
  procedures: string[];
  plans: string[];
  guides: string[];
}

export interface Sos2aFormData {
  businessName: string;
  businessAddress: string;
  businessLocation: {
    state: string;
    country: string;
  };
  industry: string;
  customIndustry?: string;
  showCustomIndustry?: boolean;
  employeeCount: string;
  businessServices: string;
  operationMode: string[];
  internetPresence: string[];
  securityMeasures: string[];
  primaryConcerns: string[];
  frameworks: FrameworkSelection;
  complianceRequirements: ComplianceRequirements;
  policyDocuments: PolicyDocuments;
  osHardening: {
    stig: boolean;
    scap: boolean;
    guidelines: string[];
  };
  adversarialInsights: {
    mitreAttackIds: string[];
  };
  contactInfo: ContactInfo;
  matrixData: any | null; // Using any here since matrix data can be complex and varied
  reportType: 'preliminary' | 'comprehensive';
  availabilityConfirmation: boolean;
  referralPermission: boolean;
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
  relevantQuestionnaires: string[]; // SAQ A, SAQ B, SAQ C, etc.
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
}

export interface ScorecardItem {
  parameter: string;
  weight: number;
  score: number; // 0-100 score for this parameter
  notes?: string; // Optional notes about this score
}

export interface RasbitaRiskItem {
  assetName: string;
  assetValue: number; // AV
  threatName: string;
  exposureFactor: number; // EF (percentage as decimal, e.g., 0.3 for 30%)
  annualizedRateOfOccurrence: number; // ARO
  singleLossExpectancy: number; // SLE = AV * EF
  annualizedLossExpectancy: number; // ALE = SLE * ARO
  annualCostOfSafeguard: number; // ACS
  annualizedLossExpectancyAfterControls: number; // ALE after implementing controls
  netRiskReductionBenefit: number; // NRRB = [ALE(prior) - ALE(post)] - ACS
  priority: 'Critical' | 'High' | 'Medium' | 'Low'; // Based on impact and probability
  probability: number; // 0-1 representing likelihood of occurrence
  impact: number; // 1-10 representing severity of impact
  feasibilityFactors: {
    organizational: boolean;
    behavioral: boolean;
    technical: boolean;
    political: boolean;
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
  rasbitaCategories: {
    risk: number;
    adversarialInsight: number;
    securityControls: number;
    businessImpact: number;
    informationAssurance: number;
    threatIntelligence: number;
    architecture: number;
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
  createdAt: string;
  securityScore: number;
  businessLocation: {
    state: string;
    country: string;
  };
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
      risk: number;
      adversarialInsight: number;
      securityControls: number;
      businessImpact: number;
      informationAssurance: number;
      threatIntelligence: number;
      architecture: number;
    };
  };
}
