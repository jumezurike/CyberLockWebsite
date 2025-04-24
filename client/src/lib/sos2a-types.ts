// Types for the SOS²A assessment tool
export interface ContactInfo {
  name: string;
  pointOfContact: string;
  email: string;
  contactEmail: string;
  phone: string;
}

export interface Sos2aFormData {
  businessName: string;
  businessAddress: string;
  industry: string;
  employeeCount: string;
  businessServices: string;
  operationMode: string;
  internetPresence: string[];
  securityMeasures: string[];
  primaryConcerns: string[];
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
  complianceRequirements: Record<string, boolean>;
}

export interface AssessmentReport {
  id: string;
  businessId: string;
  reportType: 'preliminary' | 'comprehensive';
  createdAt: string;
  securityScore: number;
  findings: SecurityRisk[];
  recommendations: string[];
  complianceStatus: ComplianceStatus[];
  matrixData: MatrixItem[];
}
