// Five Pillar Scorecard System
// Separates different risk assessment components to avoid confusion

export interface QualitativeAssessment {
  parameters: QualitativeParameter[];
  evidenceSupplied: string[];
  organizationSuppliedData: string[];
  preliminaryComparison: ComparisonResult;
  overallScore: number;
}

export interface QuantitativeAnalysis {
  deepScanResults: ScanResult[];
  monitoringMetrics: MonitoringData[];
  incidentResults: IncidentData[];
  trendAnalysis: TrendData[];
  performanceMetrics: PerformanceMetric[];
  statisticalSignificance: number;
  overallScore: number;
}

export interface RasbitaCostBenefit {
  financialImpactModeling: FinancialModel;
  actualIncidentCosts: IncidentCost[];
  resourceAllocationAnalysis: ResourceAnalysis;
  securityInvestmentROI: ROICalculation;
  costBenefitRatio: number;
  overallScore: number;
}

export interface RasbitaGovernance {
  nistCSF2RadarAnalysis: NistRadarData;
  maturityProgression: MaturityData[];
  governanceStructureEffectiveness: GovernanceMetrics;
  managementControlEfficacy: ControlAssessment;
  overallScore: number;
}

export interface ArchitectureThreatModeling {
  dataFlowDiagramAnalysis: DFDAnalysis;
  strideModelingResults: StrideAnalysis;
  mitigationStrategies: MitigationStrategy[];
  architecturalValidation: ArchValidation;
  sastDastResults: SecurityTestingResults;
  overallScore: number;
}

export interface QualitativeParameter {
  id: string;
  name: string;
  category: string;
  score: number; // 0-100
  evidence: string[];
  refinementNotes: string;
}

export interface ComparisonResult {
  suppliedVsPreliminary: number;
  accuracyImprovement: number;
  dataQualityScore: number;
}

export interface ScanResult {
  toolName: string;
  scanDate: Date;
  findings: Finding[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  score: number;
}

export interface Finding {
  id: string;
  description: string;
  severity: string;
  recommendation: string;
}

export interface MonitoringData {
  metric: string;
  value: number;
  timestamp: Date;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface IncidentData {
  id: string;
  date: Date;
  type: string;
  severity: string;
  impact: number;
  resolution: string;
  cost: number;
}

export interface TrendData {
  parameter: string;
  timeRange: string;
  dataPoints: DataPoint[];
  trend: 'improving' | 'stable' | 'declining';
  changePercentage: number;
}

export interface DataPoint {
  date: Date;
  value: number;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  variance: number;
  significance: number;
}

export interface FinancialModel {
  totalSecurityBudget: number;
  preventionCosts: number;
  detectionCosts: number;
  responseCosts: number;
  recoveryCosts: number;
  potentialLosses: number;
  riskReductionValue: number;
}

export interface IncidentCost {
  incidentId: string;
  date: Date;
  directCosts: number;
  indirectCosts: number;
  businessImpact: number;
  recoveryTime: number;
  totalCost: number;
}

export interface ResourceAnalysis {
  personnelCosts: number;
  technologyCosts: number;
  processCosts: number;
  complianceCosts: number;
  efficiencyGains: number;
  resourceOptimization: number;
}

export interface ROICalculation {
  investmentAmount: number;
  benefitsRealized: number;
  timeToRealize: number;
  roi: number;
  paybackPeriod: number;
  npv: number;
}

export interface NistRadarData {
  identify: number;
  protect: number;
  detect: number;
  respond: number;
  recover: number;
  govern: number; // NIST CSF 2.0
}

export interface MaturityData {
  date: Date;
  level: number;
  category: string;
  progressIndicators: string[];
}

export interface GovernanceMetrics {
  policyEffectiveness: number;
  processMaturity: number;
  riskManagementEffectiveness: number;
  complianceLevel: number;
  stakeholderEngagement: number;
}

export interface ControlAssessment {
  preventiveControls: number;
  detectiveControls: number;
  correctiveControls: number;
  overallEffectiveness: number;
}

export interface DFDAnalysis {
  dataFlowComplexity: number;
  trustBoundaries: number;
  dataStores: number;
  processes: number;
  externalEntities: number;
  vulnerabilityScore: number;
}

export interface StrideAnalysis {
  spoofing: ThreatCategory;
  tampering: ThreatCategory;
  repudiation: ThreatCategory;
  informationDisclosure: ThreatCategory;
  denialOfService: ThreatCategory;
  elevationOfPrivilege: ThreatCategory;
}

export interface ThreatCategory {
  likelihood: number;
  impact: number;
  riskLevel: string;
  mitigations: string[];
}

export interface MitigationStrategy {
  threatId: string;
  strategy: string;
  implementation: string;
  effectiveness: number;
  cost: number;
  timeline: string;
}

export interface ArchValidation {
  securityArchitectureScore: number;
  designPrinciplesAdherence: number;
  threatModelingCompleteness: number;
  securityControlsIntegration: number;
}

export interface SecurityTestingResults {
  sastFindings: Finding[];
  dastFindings: Finding[];
  overallSecurityScore: number;
  criticalIssues: number;
  remedationPriority: string[];
}

// Five Pillar Scorecard Calculator
export class FivePillarScorecard {
  qualitative: QualitativeAssessment;
  quantitative: QuantitativeAnalysis;
  rasbitaCostBenefit: RasbitaCostBenefit;
  rasbitaGovernance: RasbitaGovernance;
  architectureThreatModeling: ArchitectureThreatModeling;

  constructor(
    qualitative: QualitativeAssessment,
    quantitative: QuantitativeAnalysis,
    costBenefit: RasbitaCostBenefit,
    governance: RasbitaGovernance,
    threatModeling: ArchitectureThreatModeling
  ) {
    this.qualitative = qualitative;
    this.quantitative = quantitative;
    this.rasbitaCostBenefit = costBenefit;
    this.rasbitaGovernance = governance;
    this.architectureThreatModeling = threatModeling;
  }

  calculateOverallScore(): number {
    const weights = {
      qualitative: 0.20,
      quantitative: 0.25,
      costBenefit: 0.25,
      governance: 0.15,
      threatModeling: 0.15
    };

    return (
      this.qualitative.overallScore * weights.qualitative +
      this.quantitative.overallScore * weights.quantitative +
      this.rasbitaCostBenefit.overallScore * weights.costBenefit +
      this.rasbitaGovernance.overallScore * weights.governance +
      this.architectureThreatModeling.overallScore * weights.threatModeling
    );
  }

  getScoreBreakdown(): {
    pillar: string;
    score: number;
    weight: number;
    contribution: number;
  }[] {
    const weights = {
      qualitative: 0.20,
      quantitative: 0.25,
      costBenefit: 0.25,
      governance: 0.15,
      threatModeling: 0.15
    };

    return [
      {
        pillar: "Qualitative Assessment",
        score: this.qualitative.overallScore,
        weight: weights.qualitative,
        contribution: this.qualitative.overallScore * weights.qualitative
      },
      {
        pillar: "Quantitative Analysis",
        score: this.quantitative.overallScore,
        weight: weights.quantitative,
        contribution: this.quantitative.overallScore * weights.quantitative
      },
      {
        pillar: "RASBITA Cost-Benefit",
        score: this.rasbitaCostBenefit.overallScore,
        weight: weights.costBenefit,
        contribution: this.rasbitaCostBenefit.overallScore * weights.costBenefit
      },
      {
        pillar: "RASBITA Governance",
        score: this.rasbitaGovernance.overallScore,
        weight: weights.governance,
        contribution: this.rasbitaGovernance.overallScore * weights.governance
      },
      {
        pillar: "Architecture Threat Modeling",
        score: this.architectureThreatModeling.overallScore,
        weight: weights.threatModeling,
        contribution: this.architectureThreatModeling.overallScore * weights.threatModeling
      }
    ];
  }
}

// Device-specific risk assessment (separate from organizational vulnerabilities)
export interface DeviceRiskAssessment {
  deviceId: string;
  deviceType: string;
  operationalRisk: number; // Based on device usage patterns
  technicalRisk: number; // Based on device configuration
  businessImpact: number; // Based on device criticality
  overallRiskLevel: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
}

// Organizational vulnerability assessment (Section 3 - separate from device risk)
export interface OrganizationalVulnerabilities {
  primaryConcerns: string[];
  securityRisks: string[];
  websiteVulnerabilities: string[];
  endDeviceVulnerabilities: string[];
  overallVulnerabilityScore: number;
}