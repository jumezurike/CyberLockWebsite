// Types for the Gap Analysis system

// The 10 parameters for gap analysis
export type GapAnalysisParameter = 
  | 'AccessControl'
  | 'DataProtection'
  | 'SecurityAwareness'
  | 'IncidentResponse'
  | 'NetworkSecurity'
  | 'ApplicationSecurity'
  | 'ThirdPartyManagement'
  | 'AssetManagement'
  | 'SecurityGovernance'
  | 'ComplianceManagement';

// Each gap analysis parameter can have multiple requirements
export interface ParameterRequirement {
  controlId: string;
  name: string;
  description: string;
  expectedLevel: number; // 0-5 scale for maturity level
  industry?: string[];  // List of industries where this is required
  infraComponents?: string[]; // List of infrastructure components where this is required
  frameworks?: string[]; // Frameworks that include this requirement
  standardsMapping?: string[]; // Related standards/regulations
}

// Implementation reported by the user during assessment
export interface UserImplementation {
  controlId: string;
  implementationLevel: number; // 0-5 scale
  notes?: string; // User-provided notes about implementation
}

// Result of comparing expert requirements with user implementation
export interface GapAnalysisResult {
  // Overall results
  overallScore: {
    percentage: number;
    grade: string;
  };
  
  // Parameter-level results
  parameterScores: {
    [key in GapAnalysisParameter]?: {
      earnedPercentage: number;
      maxPercentage: number;
      gaps: GapItem[];
      recommendations: string[];
    }
  };
  
  // Prioritized recommendations
  prioritizedRecommendations: PrioritizedRecommendation[];
}

// Individual gap identified during analysis
export interface GapItem {
  controlId: string;
  controlName: string;
  expertLevel: number;
  reportedLevel: number;
  percentageImpact: number;
  nextSteps: string;
}

// Prioritized recommendation for remediation
export interface PrioritizedRecommendation {
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  impact: string;
  recommendation: string;
  controlIds: string[]; // Reference to the control IDs this addresses
  estimatedEffort: 'Low' | 'Medium' | 'High';
  timeframe: 'Immediate' | 'Short-term' | 'Long-term';
}

// Expert knowledge configuration for gap analysis
export interface ExpertKnowledgeConfiguration {
  requirements: {
    [key in GapAnalysisParameter]?: ParameterRequirement[];
  }
}