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
  complianceRequirements: {
    standards: Record<string, boolean>;
    regulations: Record<string, boolean>;
    frameworks: Record<string, boolean>;
  };
  mitreTechniques: string[]; // MITRE ATT&CK IDs
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
