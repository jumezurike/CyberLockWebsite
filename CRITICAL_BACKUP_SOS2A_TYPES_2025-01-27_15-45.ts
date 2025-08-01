// BACKUP: client/src/lib/sos2a-types.ts
// Created: 2025-01-27 15:45 before removing redundant tabs
// Purpose: Complete backup of types definition

export interface BusinessInformation {
  businessName: string;
  industry: string;
  location?: string;
  businessSize: string;
  annualRevenue: string;
  employeeCount: string;
  primaryOperations: string;
}

export interface ContactInformation {
  name: string;
  email: string;
  phone: string;
}

export interface Sos2aFormData {
  businessInformation: BusinessInformation;
  contactInfo: ContactInformation;
  reportType: 'preliminary' | 'comprehensive';
  securityMeasures: string[];
  primaryConcerns: string[];
  additionalInfo?: string;
}

export interface MatrixItem {
  assetName: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  threatVector: string;
  mitigationStatus: 'Not Started' | 'In Progress' | 'Completed';
  notes?: string;
}

export interface Finding {
  category: string;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  recommendation: string;
}

export interface Recommendation {
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  description: string;
  estimatedCost: 'Low' | 'Medium' | 'High';
  estimatedTimeframe: string;
}

export interface ScorecardItem {
  parameter: string;
  score: number;
  weight: number;
}

export interface SecurityRisk {
  id: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  impact: string;
  likelihood: string;
  riskScore: number;
  mitigation: string;
}

export interface RasbitaScore {
  overall: number;
  categories: {
    govern?: number;
    identify?: number;
    protect?: number;
    detect?: number;
    respond?: number;
    recover?: number;
    risk?: number;
    securityControls?: number;
    architecture?: number;
  };
}

export interface AssessmentSummary {
  criticalVulnerabilities: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
}

export interface AssessmentReport {
  id: string;
  businessName: string;
  industry: string;
  location?: string;
  createdAt: string;
  reportType: 'preliminary' | 'comprehensive';
  securityScore: number;
  age?: number;
  findings?: Finding[];
  recommendations?: {
    immediate?: Recommendation[];
    shortTerm?: Recommendation[];
    longTerm?: Recommendation[];
    items?: Recommendation[];
  };
  summary?: AssessmentSummary;
  rasbitaScore?: RasbitaScore;
  architectureDiagramsProvided?: boolean;
  matrixData?: {
    items: MatrixItem[];
  };
}