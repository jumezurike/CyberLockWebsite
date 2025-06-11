// RASBITA Preliminary Assessment Scoring Engine
// Authentic qualitative analysis for preliminary reports only

import { type Sos2aFormData } from "@/lib/sos2a-types";

export interface QualitativeScores {
  overallScore: number;
  technical: number;
  operational: number;
  scorecard: {
    overallScore: number;
    categories: Array<{
      name: string;
      score: number;
      weight: number;
    }>;
  };
}

export interface GovernanceMaturity {
  overall: number;
  governance: number;
  identify: number;
  protect: number;
  detect: number;
  respond: number;
  recover: number;
}

// Pillar 1: Qualitative Assessment (12 Security Parameters)
export function calculateQualitativeScores(data: Sos2aFormData): QualitativeScores {
  const scores = {
    phishingScreening: calculatePhishingScore(data),
    securityAwareness: calculateAwarenessScore(data),
    externalFootprints: calculateFootprintScore(data),
    darkWeb: calculateDarkWebScore(data),
    endpointSecurity: calculateEndpointScore(data),
    cloudSecurity: calculateCloudScore(data),
    dataSecurity: calculateDataScore(data),
    browserSecurity: calculateBrowserScore(data),
    emailProtection: calculateEmailScore(data),
    compliances: calculateComplianceScore(data),
    regulatory: calculateRegulatoryScore(data),
    frameworks: calculateFrameworkScore(data)
  };

  const categories = [
    { name: "Phishing Screening", score: scores.phishingScreening, weight: 8.33 },
    { name: "Security Awareness", score: scores.securityAwareness, weight: 8.33 },
    { name: "External Footprints", score: scores.externalFootprints, weight: 8.33 },
    { name: "Dark Web", score: scores.darkWeb, weight: 8.33 },
    { name: "Endpoint Security", score: scores.endpointSecurity, weight: 8.33 },
    { name: "Cloud Security", score: scores.cloudSecurity, weight: 8.33 },
    { name: "Data Security", score: scores.dataSecurity, weight: 8.33 },
    { name: "Browser Security", score: scores.browserSecurity, weight: 8.33 },
    { name: "Email Protection", score: scores.emailProtection, weight: 8.33 },
    { name: "Compliances", score: scores.compliances, weight: 8.33 },
    { name: "Regulatory Requirements", score: scores.regulatory, weight: 8.33 },
    { name: "Frameworks", score: scores.frameworks, weight: 8.33 }
  ];

  const overallScore = Math.round(
    categories.reduce((sum, cat) => sum + (cat.score * cat.weight / 100), 0)
  );

  return {
    overallScore,
    technical: Math.round((scores.endpointSecurity + scores.cloudSecurity + scores.dataSecurity + scores.browserSecurity) / 4),
    operational: Math.round((scores.phishingScreening + scores.securityAwareness + scores.emailProtection) / 3),
    scorecard: {
      overallScore,
      categories
    }
  };
}

// Pillar 4: NIST CSF 2.0 Governance Maturity Assessment
export function calculateGovernanceMaturity(data: Sos2aFormData): GovernanceMaturity {
  const identify = calculateIdentifyMaturity(data);
  const protect = calculateProtectMaturity(data);
  const detect = calculateDetectMaturity(data);
  const respond = calculateRespondMaturity(data);
  const recover = calculateRecoverMaturity(data);
  const governance = calculateGovernFunction(data);

  const overall = Math.round((identify + protect + detect + respond + recover + governance) / 6);

  return {
    overall,
    governance,
    identify,
    protect,
    detect,
    respond,
    recover
  };
}

// Check for security incidents to determine Pillar 3 inclusion
export function checkForIncidents(data: Sos2aFormData): boolean {
  // Check various incident indicators from questionnaire
  const incidentKeywords = [
    'breach', 'attack', 'incident', 'compromise', 'malware', 
    'phishing', 'ransomware', 'unauthorized', 'violation'
  ];

  // Check in various text fields for incident mentions
  const textFields = [
    data.businessServices,
    data.currentChallenges,
    data.securityConcerns,
    data.previousIncidents
  ].filter(Boolean);

  return textFields.some(field => 
    incidentKeywords.some(keyword => 
      field?.toLowerCase().includes(keyword)
    )
  );
}

// Check for architectural data to determine Pillar 5 inclusion
export function checkArchitecturalData(data: Sos2aFormData): boolean {
  return !!(
    data.networkDiagram ||
    data.applicationArchitecture ||
    data.dataFlowDiagram ||
    data.systemTopology
  );
}

// Individual scoring functions for 12 security parameters
function calculatePhishingScore(data: Sos2aFormData): number {
  let score = 0;
  
  // Email security measures
  if (data.emailSecurity?.includes('spam-filter')) score += 25;
  if (data.emailSecurity?.includes('phishing-protection')) score += 25;
  if (data.securityTraining?.includes('phishing-awareness')) score += 30;
  if (data.incidentResponse?.includes('email-security')) score += 20;
  
  return Math.min(score, 100);
}

function calculateAwarenessScore(data: Sos2aFormData): number {
  let score = 0;
  
  if (data.securityTraining?.includes('regular-training')) score += 40;
  if (data.securityTraining?.includes('phishing-simulation')) score += 30;
  if (data.securityPolicies?.includes('security-awareness')) score += 20;
  if (data.employeeBackground?.includes('security-clearance')) score += 10;
  
  return Math.min(score, 100);
}

function calculateFootprintScore(data: Sos2aFormData): number {
  let score = 50; // Baseline
  
  // Reduce score for larger internet presence
  if (data.internetPresence?.includes('website')) score -= 10;
  if (data.internetPresence?.includes('social-media')) score -= 10;
  if (data.internetPresence?.includes('online-services')) score -= 15;
  if (data.internetPresence?.includes('cloud-services')) score -= 15;
  
  return Math.max(score, 0);
}

function calculateDarkWebScore(data: Sos2aFormData): number {
  // Without monitoring tools, assume baseline risk
  let score = 70;
  
  // Adjust based on business exposure
  if (data.industry === 'healthcare') score -= 20;
  if (data.industry === 'financial') score -= 25;
  if (data.customerDataTypes?.includes('personal-info')) score -= 10;
  if (data.customerDataTypes?.includes('financial-data')) score -= 15;
  
  return Math.max(score, 0);
}

function calculateEndpointScore(data: Sos2aFormData): number {
  let score = 0;
  
  if (data.antivirus?.includes('enterprise-solution')) score += 30;
  if (data.antivirus?.includes('real-time-protection')) score += 25;
  if (data.systemUpdates?.includes('automatic-updates')) score += 25;
  if (data.deviceManagement?.includes('endpoint-protection')) score += 20;
  
  return Math.min(score, 100);
}

function calculateCloudScore(data: Sos2aFormData): number {
  let score = 0;
  
  if (data.cloudSecurity?.includes('encryption')) score += 30;
  if (data.cloudSecurity?.includes('access-controls')) score += 25;
  if (data.cloudSecurity?.includes('backup-strategy')) score += 25;
  if (data.cloudProvider?.includes('enterprise-tier')) score += 20;
  
  return Math.min(score, 100);
}

function calculateDataScore(data: Sos2aFormData): number {
  let score = 0;
  
  if (data.dataEncryption?.includes('at-rest')) score += 25;
  if (data.dataEncryption?.includes('in-transit')) score += 25;
  if (data.dataBackup?.includes('regular-backups')) score += 25;
  if (data.dataClassification?.includes('implemented')) score += 25;
  
  return Math.min(score, 100);
}

function calculateBrowserScore(data: Sos2aFormData): number {
  let score = 0;
  
  if (data.browserSecurity?.includes('managed-browsers')) score += 30;
  if (data.browserSecurity?.includes('security-extensions')) score += 25;
  if (data.webFiltering?.includes('content-filtering')) score += 25;
  if (data.webFiltering?.includes('malware-protection')) score += 20;
  
  return Math.min(score, 100);
}

function calculateEmailScore(data: Sos2aFormData): number {
  let score = 0;
  
  if (data.emailSecurity?.includes('encryption')) score += 30;
  if (data.emailSecurity?.includes('dlp')) score += 25;
  if (data.emailSecurity?.includes('sandbox')) score += 25;
  if (data.emailProvider?.includes('enterprise')) score += 20;
  
  return Math.min(score, 100);
}

function calculateComplianceScore(data: Sos2aFormData): number {
  let score = 0;
  
  if (data.complianceFrameworks?.includes('iso27001')) score += 25;
  if (data.complianceFrameworks?.includes('nist')) score += 25;
  if (data.complianceFrameworks?.includes('sox')) score += 25;
  if (data.auditFrequency?.includes('annual')) score += 25;
  
  return Math.min(score, 100);
}

function calculateRegulatoryScore(data: Sos2aFormData): number {
  let score = 0;
  
  if (data.regulatoryCompliance?.includes('hipaa')) score += 25;
  if (data.regulatoryCompliance?.includes('gdpr')) score += 25;
  if (data.regulatoryCompliance?.includes('pci-dss')) score += 25;
  if (data.complianceReporting?.includes('regular')) score += 25;
  
  return Math.min(score, 100);
}

function calculateFrameworkScore(data: Sos2aFormData): number {
  let score = 0;
  
  if (data.securityFramework?.includes('nist-csf')) score += 30;
  if (data.securityFramework?.includes('iso27001')) score += 25;
  if (data.riskManagement?.includes('formal-process')) score += 25;
  if (data.securityGovernance?.includes('security-committee')) score += 20;
  
  return Math.min(score, 100);
}

// NIST CSF 2.0 Function Maturity Calculations
function calculateIdentifyMaturity(data: Sos2aFormData): number {
  let score = 0;
  
  if (data.assetInventory?.includes('comprehensive')) score += 25;
  if (data.riskAssessment?.includes('regular')) score += 25;
  if (data.securityPolicies?.includes('documented')) score += 25;
  if (data.governanceStructure?.includes('established')) score += 25;
  
  return Math.min(score, 100);
}

function calculateProtectMaturity(data: Sos2aFormData): number {
  let score = 0;
  
  if (data.accessControls?.includes('implemented')) score += 25;
  if (data.dataProtection?.includes('encryption')) score += 25;
  if (data.securityTraining?.includes('regular')) score += 25;
  if (data.maintenanceControls?.includes('patch-management')) score += 25;
  
  return Math.min(score, 100);
}

function calculateDetectMaturity(data: Sos2aFormData): number {
  let score = 0;
  
  if (data.monitoringSolution?.includes('siem')) score += 30;
  if (data.logManagement?.includes('centralized')) score += 25;
  if (data.anomalyDetection?.includes('implemented')) score += 25;
  if (data.threatIntelligence?.includes('subscribed')) score += 20;
  
  return Math.min(score, 100);
}

function calculateRespondMaturity(data: Sos2aFormData): number {
  let score = 0;
  
  if (data.incidentResponse?.includes('plan-documented')) score += 30;
  if (data.incidentResponse?.includes('team-trained')) score += 25;
  if (data.communicationPlan?.includes('established')) score += 25;
  if (data.forensicCapability?.includes('available')) score += 20;
  
  return Math.min(score, 100);
}

function calculateRecoverMaturity(data: Sos2aFormData): number {
  let score = 0;
  
  if (data.recoveryPlan?.includes('documented')) score += 30;
  if (data.backupStrategy?.includes('tested')) score += 25;
  if (data.businessContinuity?.includes('plan-exists')) score += 25;
  if (data.recoveryTesting?.includes('regular')) score += 20;
  
  return Math.min(score, 100);
}

function calculateGovernFunction(data: Sos2aFormData): number {
  let score = 0;
  
  if (data.securityGovernance?.includes('board-oversight')) score += 30;
  if (data.riskManagement?.includes('enterprise-wide')) score += 25;
  if (data.securityStrategy?.includes('aligned-business')) score += 25;
  if (data.performanceMetrics?.includes('tracked')) score += 20;
  
  return Math.min(score, 100);
}

// Additional helper functions for report generation
export function generateFindings(data: Sos2aFormData, scores: QualitativeScores): string[] {
  const findings: string[] = [];
  
  if (scores.overallScore < 50) {
    findings.push("Overall security posture requires immediate attention");
  }
  
  if (scores.technical < 60) {
    findings.push("Technical security controls need strengthening");
  }
  
  if (scores.operational < 60) {
    findings.push("Operational security practices require improvement");
  }
  
  if (!data.incidentResponse?.includes('plan-documented')) {
    findings.push("Incident response plan not documented");
  }
  
  if (!data.dataBackup?.includes('regular-backups')) {
    findings.push("Regular backup strategy not implemented");
  }
  
  return findings;
}

export function identifyVulnerabilities(data: Sos2aFormData, scores: QualitativeScores): any {
  const vulnerabilities = {
    critical: [] as string[],
    high: [] as string[],
    medium: [] as string[],
    low: [] as string[]
  };
  
  if (scores.overallScore < 30) {
    vulnerabilities.critical.push("Severe security posture deficiency");
  }
  
  if (!data.dataEncryption?.includes('at-rest')) {
    vulnerabilities.high.push("Data at rest not encrypted");
  }
  
  if (!data.securityTraining?.includes('regular-training')) {
    vulnerabilities.medium.push("Regular security training not implemented");
  }
  
  if (!data.systemUpdates?.includes('automatic-updates')) {
    vulnerabilities.medium.push("Automatic system updates not configured");
  }
  
  return vulnerabilities;
}

export function generateRecommendations(data: Sos2aFormData, scores: QualitativeScores, hasIncidents: boolean): any {
  const recommendations = {
    immediate: [] as string[],
    shortTerm: [] as string[],
    longTerm: [] as string[]
  };
  
  if (scores.overallScore < 50) {
    recommendations.immediate.push("Implement basic security controls immediately");
  }
  
  if (hasIncidents) {
    recommendations.immediate.push("Review and strengthen incident response procedures");
  }
  
  if (!data.dataBackup?.includes('tested')) {
    recommendations.shortTerm.push("Test backup and recovery procedures");
  }
  
  recommendations.longTerm.push("Develop comprehensive security program");
  
  return recommendations;
}

export function identifyFrameworkGaps(data: Sos2aFormData): string[] {
  const gaps: string[] = [];
  
  if (!data.securityFramework?.includes('nist-csf')) {
    gaps.push("NIST Cybersecurity Framework not implemented");
  }
  
  if (!data.complianceFrameworks?.includes('iso27001')) {
    gaps.push("ISO 27001 compliance gap identified");
  }
  
  return gaps;
}

export function calculateComplianceStatus(data: Sos2aFormData): any {
  const totalChecks = 10;
  let compliantChecks = 0;
  
  if (data.securityPolicies?.includes('documented')) compliantChecks++;
  if (data.dataEncryption?.includes('implemented')) compliantChecks++;
  if (data.accessControls?.includes('implemented')) compliantChecks++;
  if (data.incidentResponse?.includes('plan-documented')) compliantChecks++;
  if (data.securityTraining?.includes('regular-training')) compliantChecks++;
  
  return {
    standards: [],
    regulations: [],
    frameworks: []
  };
}

export function assessPolicyStatus(data: Sos2aFormData): string {
  if (data.securityPolicies?.includes('comprehensive')) {
    return "Comprehensive policies implemented";
  } else if (data.securityPolicies?.includes('basic')) {
    return "Basic policies in place";
  }
  return "Policy documentation needs development";
}

export function assessOSHardening(data: Sos2aFormData): string {
  if (data.systemHardening?.includes('implemented')) {
    return "OS hardening measures implemented";
  }
  return "OS hardening assessment needed";
}

export function assessISMSStatus(data: Sos2aFormData): string {
  if (data.informationSecurity?.includes('isms-implemented')) {
    return "ISMS framework operational";
  }
  return "ISMS implementation required";
}

export function calculateMITRECoverage(data: Sos2aFormData): number {
  let coverage = 0;
  
  if (data.threatDetection?.includes('implemented')) coverage += 20;
  if (data.incidentResponse?.includes('plan-documented')) coverage += 20;
  if (data.accessControls?.includes('implemented')) coverage += 20;
  if (data.dataProtection?.includes('encryption')) coverage += 20;
  if (data.monitoringSolution?.includes('siem')) coverage += 20;
  
  return Math.min(coverage, 100);
}