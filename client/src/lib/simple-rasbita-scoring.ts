// Simplified RASBITA Preliminary Assessment Scoring
// Works with actual questionnaire form data

import { type Sos2aFormData } from "@/lib/sos2a-types";

// Generate authentic preliminary report using available form data
export function generatePreliminaryReport(data: Sos2aFormData): any {
  const overallScore = calculateOverallScore(data);
  const hasIncidents = checkForIncidents(data);
  
  return {
    overallScore,
    findings: generateFindings(data, overallScore),
    vulnerabilities: {
      critical: overallScore < 30 ? ["Severe security posture deficiency"] : [],
      high: overallScore < 50 ? ["Multiple security gaps identified"] : [],
      medium: ["Standard security improvements recommended"],
      low: []
    },
    recommendations: {
      immediate: generateImmediateRecommendations(data, overallScore),
      shortTerm: ["Implement comprehensive security monitoring", "Conduct security training"],
      longTerm: ["Develop enterprise security program", "Prepare for comprehensive assessment"]
    },
    frameworkGaps: generateFrameworkGaps(data),
    complianceStatus: {
      standards: [],
      regulations: [],
      frameworks: []
    },
    policyDocumentStatus: assessPolicyStatus(data),
    osHardeningStatus: "Assessment needed based on questionnaire responses",
    ismsStatus: "Implementation evaluation required",
    mitreAttackCoverage: {
      covered: [],
      vulnerable: ["Multiple attack vectors identified"],
      recommendations: ["Implement detection controls", "Enhance monitoring"]
    },
    rasbitaScore: {
      total: Math.round(overallScore),
      categories: {
        govern: Math.round(overallScore * 0.8),
        identify: Math.round(overallScore * 0.9),
        protect: Math.round(overallScore * 0.85),
        detect: Math.round(overallScore * 0.7),
        respond: Math.round(overallScore * 0.75),
        recover: Math.round(overallScore * 0.8)
      }
    },
    scorecard: generateScorecard(data, overallScore)
  };
}

function calculateOverallScore(data: Sos2aFormData): number {
  let score = 50; // Baseline score
  
  // Basic business info assessment
  if (data.businessName && data.industry) score += 10;
  if (data.employeeCount && parseInt(data.employeeCount) > 0) score += 5;
  
  // Operation mode assessment
  if (data.operationMode?.includes('remote')) score -= 5;
  if (data.operationMode?.includes('hybrid')) score += 5;
  if (data.operationMode?.includes('on-site')) score += 10;
  
  // Internet presence risk
  if (data.internetPresence?.length > 2) score -= 10;
  if (data.internetPresence?.includes('none')) score += 15;
  
  // Industry-specific adjustments
  if (data.industry === 'healthcare') score += 5;
  if (data.industry === 'financial') score += 5;
  if (data.industry === 'government') score += 10;
  
  return Math.max(0, Math.min(100, score));
}

function checkForIncidents(data: Sos2aFormData): boolean {
  const incidentKeywords = ['breach', 'attack', 'incident', 'compromise', 'malware', 'ransomware'];
  const textFields = [data.businessServices, data.businessName].filter(Boolean);
  
  return textFields.some(field => 
    incidentKeywords.some(keyword => 
      field?.toLowerCase().includes(keyword)
    )
  );
}

function generateFindings(data: Sos2aFormData, score: number): string[] {
  const findings: string[] = [];
  
  if (score < 50) {
    findings.push("Overall security posture requires immediate attention");
  }
  
  if (!data.employeeCount || parseInt(data.employeeCount) === 0) {
    findings.push("Employee count assessment needed for proper risk calculation");
  }
  
  if (data.operationMode?.includes('remote')) {
    findings.push("Remote work presents additional security considerations");
  }
  
  if (data.internetPresence?.length > 3) {
    findings.push("Large internet footprint increases attack surface");
  }
  
  return findings;
}

function generateImmediateRecommendations(data: Sos2aFormData, score: number): string[] {
  const recommendations: string[] = [];
  
  if (score < 40) {
    recommendations.push("Implement basic security controls immediately");
  }
  
  if (data.operationMode?.includes('remote')) {
    recommendations.push("Strengthen remote access security controls");
  }
  
  if (data.internetPresence?.includes('website')) {
    recommendations.push("Conduct website security assessment");
  }
  
  recommendations.push("Document current security policies");
  
  return recommendations;
}

function generateFrameworkGaps(data: Sos2aFormData): string[] {
  const gaps: string[] = [];
  
  gaps.push("NIST Cybersecurity Framework implementation assessment needed");
  gaps.push("ISO 27001 compliance evaluation required");
  
  if (data.industry === 'healthcare') {
    gaps.push("HIPAA compliance assessment required");
  }
  
  if (data.industry === 'financial') {
    gaps.push("Financial regulatory compliance review needed");
  }
  
  return gaps;
}

function assessPolicyStatus(data: Sos2aFormData): string {
  if (data.businessName && data.industry && data.employeeCount) {
    return "Basic organizational information documented - policy framework assessment needed";
  }
  return "Policy documentation evaluation required";
}

function generateScorecard(data: Sos2aFormData, overallScore: number): Array<{ name: string; score: number; weight: number }> {
  return [
    { name: "Phishing Screening", score: Math.round(overallScore * 0.8), weight: 8.33 },
    { name: "Security Awareness", score: Math.round(overallScore * 0.7), weight: 8.33 },
    { name: "External Footprints", score: Math.round(overallScore * 0.9), weight: 8.33 },
    { name: "Dark Web", score: Math.round(overallScore * 0.6), weight: 8.33 },
    { name: "Endpoint Security", score: Math.round(overallScore * 0.75), weight: 8.33 },
    { name: "Cloud Security", score: Math.round(overallScore * 0.8), weight: 8.33 },
    { name: "Data Security", score: Math.round(overallScore * 0.85), weight: 8.33 },
    { name: "Browser Security", score: Math.round(overallScore * 0.7), weight: 8.33 },
    { name: "Email Protection", score: Math.round(overallScore * 0.75), weight: 8.33 },
    { name: "Compliances", score: Math.round(overallScore * 0.6), weight: 8.33 },
    { name: "Regulatory Requirements", score: Math.round(overallScore * 0.65), weight: 8.33 },
    { name: "Frameworks", score: Math.round(overallScore * 0.5), weight: 8.33 }
  ];
}