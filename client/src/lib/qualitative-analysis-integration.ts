/**
 * Qualitative Analysis Integration
 * Maps SOS2A questionnaire parameters to gap analysis and integrates with 5 pillar scorecard
 */

import { Sos2aFormData } from './sos2a-types';
import { GapAnalysisResult, GapAnalysisParameter } from './gap-analysis-types';
import { performGapAnalysisWithParameterizedScoring } from './gap-analysis';
import { expertKnowledgeConfig } from './expert-knowledge-config';
import { 
  QualitativeAssessment, 
  FivePillarScorecard,
  QualitativeParameter,
  ComparisonResult
} from './five-pillar-scorecard';
import { frameworkMappings, getAutomationPercentage } from './sos2a-framework-mappings';

// Map 12 SOS2A questionnaire parameters to 11 gap analysis parameters (Updated: Added IAM)
export const QUESTIONNAIRE_TO_GAP_MAPPING: Record<string, GapAnalysisParameter[]> = {
  "Infrastructure Mode of Operation": ["NetworkSecurity", "AssetManagement"],
  "Security Risks & Vulnerabilities": ["SecurityGovernance", "AssetManagement"],
  "Baseline Configuration": ["ApplicationSecurity", "ComplianceManagement"],
  "Security Control vs Framework": ["SecurityGovernance", "ComplianceManagement"],
  "Compliance Requirements": ["ComplianceManagement"],
  "Regulatory Requirements": ["ComplianceManagement", "ThirdPartyManagement"],
  "Standards & Guidelines": ["SecurityGovernance", "ApplicationSecurity"],
  "Relevant ACQ Tools": ["ThirdPartyManagement", "AssetManagement"],
  "Adversarial Insight (MITRE ATT&CK)": ["IncidentResponse", "NetworkSecurity"],
  "ISMS": ["SecurityGovernance", "DataProtection"],
  "Device Inventory Tracking": ["AssetManagement"],
  "Identity Behavior & Hygiene": ["AccessControl", "SecurityAwareness", "IAM"]
};

export interface QualitativeAnalysisResult {
  gapAnalysis: GapAnalysisResult;
  qualitativeAssessment: QualitativeAssessment;
  overallScore: number;
  parameterBreakdown: QualitativeParameter[];
  comparisonResults: ComparisonResult;
}

/**
 * Performs comprehensive qualitative analysis using questionnaire data
 */
export function performQualitativeAnalysis(formData: Sos2aFormData): QualitativeAnalysisResult {
  // Step 1: Perform gap analysis using existing system
  const gapAnalysis = performGapAnalysisWithParameterizedScoring(formData, expertKnowledgeConfig);
  
  // Step 2: Map questionnaire responses to qualitative parameters
  const qualitativeParameters = mapQuestionnaireToQualitativeParameters(formData, gapAnalysis);
  
  // Step 3: Calculate comparison results
  const comparisonResults = calculateComparisonResults(formData, gapAnalysis);
  
  // Step 4: Create qualitative assessment
  const qualitativeAssessment: QualitativeAssessment = {
    parameters: qualitativeParameters,
    evidenceSupplied: extractEvidenceFromFormData(formData),
    organizationSuppliedData: extractOrganizationData(formData),
    preliminaryComparison: comparisonResults,
    overallScore: calculateOverallQualitativeScore(qualitativeParameters)
  };
  
  return {
    gapAnalysis,
    qualitativeAssessment,
    overallScore: qualitativeAssessment.overallScore,
    parameterBreakdown: qualitativeParameters,
    comparisonResults
  };
}

/**
 * Maps questionnaire responses to 12 qualitative parameters
 */
function mapQuestionnaireToQualitativeParameters(
  formData: Sos2aFormData, 
  gapAnalysis: GapAnalysisResult
): QualitativeParameter[] {
  const parameters: QualitativeParameter[] = [];
  
  frameworkMappings.forEach((mapping, index) => {
    const relatedGapParams = QUESTIONNAIRE_TO_GAP_MAPPING[mapping.parameter] || [];
    
    // Calculate score based on related gap analysis parameters
    let parameterScore = 75; // Base score
    
    if (relatedGapParams.length > 0) {
      const avgGapScore = relatedGapParams.reduce((sum, gapParam) => {
        const gapData = gapAnalysis.parameterScores[gapParam];
        return sum + (gapData ? gapData.earnedPercentage * 10 : 0);
      }, 0) / relatedGapParams.length;
      
      parameterScore = avgGapScore;
    }
    
    // Adjust score based on automation level
    const automationLevel = getAutomationPercentage(mapping.automationLevel);
    parameterScore = (parameterScore * 0.7) + (automationLevel * 0.3);
    
    parameters.push({
      id: `param_${index + 1}`,
      name: mapping.parameter,
      category: getCategoryFromParameter(mapping.parameter),
      score: Math.round(parameterScore),
      evidence: mapping.proofRequired,
      refinementNotes: `Automation level: ${mapping.automationLevel}. Validation gates: ${mapping.validationGates.join(', ')}`
    });
  });
  
  return parameters;
}

/**
 * Calculate comparison results between supplied and preliminary data
 */
function calculateComparisonResults(
  formData: Sos2aFormData, 
  gapAnalysis: GapAnalysisResult
): ComparisonResult {
  // Base preliminary score estimation
  const preliminaryScore = 65; // Typical preliminary assessment baseline
  
  // Current assessment score
  const currentScore = gapAnalysis.overallScore.percentage;
  
  // Calculate improvements
  const suppliedVsPreliminary = ((currentScore - preliminaryScore) / preliminaryScore) * 100;
  const accuracyImprovement = Math.max(0, currentScore - preliminaryScore);
  
  // Data quality score based on completeness
  const dataQualityScore = calculateDataQualityScore(formData);
  
  return {
    suppliedVsPreliminary: Math.round(suppliedVsPreliminary),
    accuracyImprovement: Math.round(accuracyImprovement),
    dataQualityScore: Math.round(dataQualityScore)
  };
}

/**
 * Extract evidence from form data
 */
function extractEvidenceFromFormData(formData: Sos2aFormData): string[] {
  const evidence: string[] = [];
  
  // Add security measures as evidence
  if (formData.securityMeasures) {
    evidence.push(...formData.securityMeasures.map(m => `Security Measure: ${m}`));
  }
  
  // Add frameworks as evidence
  if (formData.frameworks) {
    Object.entries(formData.frameworks).forEach(([category, items]) => {
      if (items && items.length > 0) {
        evidence.push(...items.map(item => `Framework (${category}): ${item}`));
      }
    });
  }
  
  // Add compliance requirements as evidence
  if (formData.complianceRequirements) {
    Object.entries(formData.complianceRequirements).forEach(([category, items]) => {
      if (items && items.length > 0) {
        evidence.push(...items.map(item => `Compliance (${category}): ${item}`));
      }
    });
  }
  
  return evidence;
}

/**
 * Extract organization-supplied data
 */
function extractOrganizationData(formData: Sos2aFormData): string[] {
  return [
    `Business: ${formData.businessName}`,
    `Industry: ${formData.industry}`,
    `Size: ${formData.employeeCount}`,
    `Operations: ${formData.operationMode?.join(', ') || 'Not specified'}`,
    `Services: ${formData.businessServices}`
  ];
}

/**
 * Calculate overall qualitative score
 */
function calculateOverallQualitativeScore(parameters: QualitativeParameter[]): number {
  if (parameters.length === 0) return 0;
  
  const totalScore = parameters.reduce((sum, param) => sum + param.score, 0);
  return Math.round(totalScore / parameters.length);
}

/**
 * Calculate data quality score based on form completeness
 */
function calculateDataQualityScore(formData: Sos2aFormData): number {
  let score = 0;
  let totalChecks = 0;
  
  // Check required fields
  const requiredFields = [
    'businessName', 'industry', 'employeeCount', 'businessServices'
  ];
  
  requiredFields.forEach(field => {
    totalChecks++;
    if (formData[field as keyof Sos2aFormData]) score++;
  });
  
  // Check array fields
  const arrayFields = ['operationMode', 'securityMeasures'];
  arrayFields.forEach(field => {
    totalChecks++;
    const value = formData[field as keyof Sos2aFormData] as string[];
    if (value && value.length > 0) score++;
  });
  
  // Check frameworks object
  totalChecks++;
  if (formData.frameworks && Object.values(formData.frameworks).some(arr => arr && arr.length > 0)) {
    score++;
  }
  
  // Check compliance requirements
  totalChecks++;
  if (formData.complianceRequirements && 
      Object.values(formData.complianceRequirements).some(arr => arr && arr.length > 0)) {
    score++;
  }
  
  return (score / totalChecks) * 100;
}

/**
 * Get category from parameter name
 */
function getCategoryFromParameter(parameterName: string): string {
  const categoryMap: Record<string, string> = {
    "Infrastructure Mode of Operation": "Infrastructure",
    "Security Risks & Vulnerabilities": "Risk Management",
    "Baseline Configuration": "Configuration",
    "Security Control vs Framework": "Governance",
    "Compliance Requirements": "Compliance",
    "Regulatory Requirements": "Compliance",
    "Standards & Guidelines": "Standards",
    "Relevant ACQ Tools": "Tools",
    "Adversarial Insight (MITRE ATT&CK)": "Threat Intelligence",
    "ISMS": "Governance",
    "Device Inventory Tracking": "Asset Management",
    "Identity Behavior & Hygiene": "Identity"
  };
  
  return categoryMap[parameterName] || "General";
}

/**
 * Create integrated 5 pillar scorecard with qualitative analysis
 */
export function createIntegratedFivePillarScorecard(
  qualitativeResult: QualitativeAnalysisResult
): FivePillarScorecard {
  // Mock data for other pillars (to be implemented separately)
  const mockQuantitative = {
    deepScanResults: [],
    monitoringMetrics: [],
    incidentResults: [],
    trendAnalysis: [],
    performanceMetrics: [],
    statisticalSignificance: 0.95,
    overallScore: 75 // Placeholder
  };
  
  const mockCostBenefit = {
    financialImpactModeling: {
      totalSecurityBudget: 0,
      preventionCosts: 0,
      detectionCosts: 0,
      responseCosts: 0,
      recoveryCosts: 0,
      potentialLosses: 0,
      riskReductionValue: 0
    },
    actualIncidentCosts: [],
    resourceAllocationAnalysis: {
      personnelCosts: 0,
      technologyCosts: 0,
      processCosts: 0,
      complianceCosts: 0,
      efficiencyGains: 0,
      resourceOptimization: 0
    },
    securityInvestmentROI: {
      investmentAmount: 0,
      benefitsRealized: 0,
      timeToRealize: 0,
      roi: 0,
      paybackPeriod: 0,
      npv: 0
    },
    costBenefitRatio: 1.0,
    overallScore: 70 // Placeholder
  };
  
  const mockGovernance = {
    nistCSF2RadarAnalysis: {
      identify: 75,
      protect: 80,
      detect: 70,
      respond: 65,
      recover: 60,
      govern: 85
    },
    maturityProgression: [],
    governanceStructureEffectiveness: {
      policyEffectiveness: 75,
      processMaturity: 70,
      riskManagementEffectiveness: 80,
      complianceLevel: 85,
      stakeholderEngagement: 75
    },
    managementControlEfficacy: {
      preventiveControls: 80,
      detectiveControls: 75,
      correctiveControls: 70,
      overallEffectiveness: 75
    },
    overallScore: 75 // Placeholder
  };
  
  const mockThreatModeling = {
    dataFlowDiagramAnalysis: {
      dataFlowComplexity: 3,
      trustBoundaries: 5,
      dataStores: 8,
      processes: 12,
      externalEntities: 4,
      vulnerabilityScore: 25
    },
    strideModelingResults: {
      spoofing: { likelihood: 3, impact: 4, riskLevel: "Medium", mitigations: [] },
      tampering: { likelihood: 2, impact: 5, riskLevel: "Medium", mitigations: [] },
      repudiation: { likelihood: 2, impact: 3, riskLevel: "Low", mitigations: [] },
      informationDisclosure: { likelihood: 4, impact: 5, riskLevel: "High", mitigations: [] },
      denialOfService: { likelihood: 3, impact: 4, riskLevel: "Medium", mitigations: [] },
      elevationOfPrivilege: { likelihood: 2, impact: 5, riskLevel: "Medium", mitigations: [] }
    },
    mitigationStrategies: [],
    architecturalValidation: {
      securityArchitectureScore: 75,
      designPrinciplesAdherence: 80,
      threatModelingCompleteness: 70,
      securityControlsIntegration: 75
    },
    sastDastResults: {
      sastFindings: [],
      dastFindings: [],
      overallSecurityScore: 75,
      criticalIssues: 0,
      remedationPriority: []
    },
    overallScore: 75 // Placeholder
  };
  
  return new FivePillarScorecard(
    qualitativeResult.qualitativeAssessment,
    mockQuantitative,
    mockCostBenefit,
    mockGovernance,
    mockThreatModeling
  );
}