import {
  GapAnalysisParameter,
  ParameterRequirement,
  UserImplementation,
  GapAnalysisResult,
  GapItem,
  PrioritizedRecommendation,
  ExpertKnowledgeConfiguration
} from './gap-analysis-types';
import { Sos2aFormData } from './sos2a-types';

/**
 * Performs the gap analysis by comparing expert requirements against user-reported implementations
 * 
 * @param userResponses - User responses from the SOS2A assessment form
 * @param organizationProfile - Profile information about the organization being assessed
 * @returns Complete gap analysis results
 */
export function performGapAnalysisWithParameterizedScoring(
  userResponses: Sos2aFormData,
  expertConfig: ExpertKnowledgeConfiguration
): GapAnalysisResult {
  // Define the 10 core assessment parameters
  const assessmentParameters: GapAnalysisParameter[] = [
    "AccessControl",
    "DataProtection",
    "SecurityAwareness",
    "IncidentResponse",
    "NetworkSecurity",
    "ApplicationSecurity",
    "ThirdPartyManagement",
    "AssetManagement",
    "SecurityGovernance",
    "ComplianceManagement"
  ];
  
  // Extract key profile information
  const organizationProfile = {
    industry: userResponses.industry,
    size: userResponses.employeeCount,
    infraComponents: userResponses.operationMode,
    dataSensitivity: determineDataSensitivityLevel(userResponses),
    regulatoryRequirements: userResponses.regulatoryRequirements || []
  };
  
  // Get expert requirements for each parameter
  const expertRequirements: Record<GapAnalysisParameter, ParameterRequirement[]> = {} as Record<GapAnalysisParameter, ParameterRequirement[]>;
  for (const parameter of assessmentParameters) {
    expertRequirements[parameter] = getExpertRequirementsForParameter(
      parameter, 
      organizationProfile,
      expertConfig
    );
  }
  
  // Extract user responses for each parameter
  const userImplementations: Record<GapAnalysisParameter, UserImplementation[]> = {} as Record<GapAnalysisParameter, UserImplementation[]>;
  for (const parameter of assessmentParameters) {
    userImplementations[parameter] = extractUserImplementationsForParameter(
      parameter, 
      userResponses
    );
  }
  
  // Calculate score and identify gaps for each parameter
  const parameterResults: Record<GapAnalysisParameter, {
    earnedPercentage: number;
    maxPercentage: number;
    gaps: GapItem[];
    recommendations: string[];
  }> = {} as Record<GapAnalysisParameter, {
    earnedPercentage: number;
    maxPercentage: number;
    gaps: GapItem[];
    recommendations: string[];
  }>;
  let overallPercentage = 0;
  
  for (const parameter of assessmentParameters) {
    const parameterRequirements = expertRequirements[parameter] || [];
    const parameterImplementations = userImplementations[parameter] || [];
    
    // Calculate maximum points available for this parameter
    // All parameters are normalized to be worth 10% of total score
    const parameterMaxPoints = 10;
    
    // Calculate earned points based on match with expert requirements
    let earnedPoints = 0;
    const parameterGaps: GapItem[] = [];
    
    for (const requirement of parameterRequirements) {
      // Each requirement contributes equally to the parameter's 10%
      const requirementWeight = 10 / parameterRequirements.length;
      
      // Check if requirement is implemented
      const matchingImplementation = parameterImplementations.find(
        (impl: UserImplementation) => impl.controlId === requirement.controlId
      );
      
      if (!matchingImplementation) {
        // Complete gap - 0 points
        parameterGaps.push({
          controlId: requirement.controlId,
          controlName: requirement.name,
          expertLevel: requirement.expectedLevel,
          reportedLevel: 0,
          percentageImpact: requirementWeight,
          nextSteps: generateGuidance(requirement, organizationProfile)
        });
      } else {
        // Requirement exists, calculate alignment percentage
        const expertLevel = requirement.expectedLevel; // Expected maturity level (0-5)
        const reportedLevel = matchingImplementation.implementationLevel; // Reported level (0-5)
        
        // Calculate points based on reported vs expected level
        const alignmentPercentage = Math.min(1, reportedLevel / expertLevel);
        const pointsEarned = requirementWeight * alignmentPercentage;
        earnedPoints += pointsEarned;
        
        // Only add to gaps if not fully implemented
        if (alignmentPercentage < 1) {
          parameterGaps.push({
            controlId: requirement.controlId,
            controlName: requirement.name,
            expertLevel: expertLevel,
            reportedLevel: reportedLevel,
            percentageImpact: requirementWeight * (1 - alignmentPercentage),
            nextSteps: generateGuidance(requirement, organizationProfile, reportedLevel)
          });
        }
      }
    }
    
    // Store results for this parameter
    parameterResults[parameter] = {
      earnedPercentage: earnedPoints,
      maxPercentage: parameterMaxPoints,
      gaps: parameterGaps,
      recommendations: generateParameterRecommendations(parameterGaps, parameter, organizationProfile)
    };
    
    // Add to overall score
    overallPercentage += earnedPoints;
  }
  
  return {
    overallScore: {
      percentage: overallPercentage,
      grade: convertPercentageToGrade(overallPercentage)
    },
    parameterScores: parameterResults,
    prioritizedRecommendations: generatePrioritizedRecommendations(parameterResults, organizationProfile)
  };
}

/**
 * Determines data sensitivity level based on user responses
 */
function determineDataSensitivityLevel(userResponses: Sos2aFormData): 'Low' | 'Medium' | 'High' | 'Critical' {
  // If healthcare industry, default to at least High
  if (userResponses.industry === 'Healthcare' || userResponses.complianceRequirements?.healthcare?.length > 0) {
    return 'High';
  }
  
  // If financial industry, default to at least High
  if (userResponses.industry === 'Financial' || userResponses.complianceRequirements?.financial?.length > 0) {
    return 'High';
  }
  
  // If PCI-DSS or GDPR are selected, default to at least Medium
  if (
    (userResponses.regulatoryRequirements && 
    (userResponses.regulatoryRequirements.includes('PCI-DSS') || 
     userResponses.regulatoryRequirements.includes('GDPR')))
  ) {
    return 'Medium';
  }
  
  // Default to Medium for now
  return 'Medium';
}

/**
 * Get expert requirements for a specific parameter
 */
function getExpertRequirementsForParameter(
  parameter: GapAnalysisParameter, 
  organizationProfile: any,
  expertConfig: ExpertKnowledgeConfiguration
): ParameterRequirement[] {
  // Get base requirements from expert knowledge configuration
  const baseRequirements = expertConfig.requirements[parameter] || [];
  
  // Filter based on industry, size, and other factors
  return baseRequirements.filter(requirement => {
    // If requirement specifies industries, check if organization's industry is included
    if (requirement.industry && requirement.industry.length > 0) {
      if (!requirement.industry.includes(organizationProfile.industry)) {
        return false;
      }
    }
    
    // If requirement specifies infrastructure components, check if at least one matches
    if (requirement.infraComponents && requirement.infraComponents.length > 0) {
      const hasMatchingInfra = requirement.infraComponents.some(
        infra => organizationProfile.infraComponents.includes(infra)
      );
      if (!hasMatchingInfra) {
        return false;
      }
    }
    
    // All filters passed
    return true;
  });
}

/**
 * Extract user implementations for a specific parameter
 */
function extractUserImplementationsForParameter(
  parameter: GapAnalysisParameter, 
  userResponses: Sos2aFormData
): UserImplementation[] {
  // This function will need to map the user responses to specific controls
  // The exact implementation depends on how user responses are structured
  // Below is a template that needs to be customized based on form structure
  
  const implementations: UserImplementation[] = [];
  
  switch (parameter) {
    case "AccessControl":
      // Extract access control implementations from user responses
      if (userResponses.securityMeasures && userResponses.securityMeasures.includes('access-control')) {
        // Add mapped implementations based on responses
        // This is a placeholder and needs real mapping logic
        implementations.push({
          controlId: 'AC-1',
          implementationLevel: 3, // This would be derived from the responses
          notes: 'User reported basic access controls'
        });
      }
      break;
      
    case "DataProtection":
      // Extract data protection implementations from user responses
      if (userResponses.securityMeasures && userResponses.securityMeasures.includes('encryption')) {
        // Add mapped implementations
        implementations.push({
          controlId: 'DP-1',
          implementationLevel: 2,
          notes: 'User reported basic encryption'
        });
      }
      break;
      
    // Add cases for other parameters
    default:
      // No specific mappings for this parameter
      break;
  }
  
  return implementations;
}

/**
 * Generate specific guidance for a gap
 */
function generateGuidance(
  requirement: ParameterRequirement, 
  organizationProfile: any,
  currentLevel: number = 0
): string {
  const { industry, size } = organizationProfile;
  
  // Base guidance template
  let guidance = `Implement ${requirement.name}: ${requirement.description}`;
  
  // Add industry-specific guidance if applicable
  if (industry === 'Healthcare' && requirement.controlId.startsWith('AC')) {
    guidance += ' Ensure this control meets HIPAA requirements for access controls.';
  } else if (industry === 'Financial' && requirement.controlId.startsWith('DP')) {
    guidance += ' Consider PCI-DSS requirements for data protection.';
  }
  
  // Add size-appropriate guidance
  if (size === 'Small' || size === '1-50') {
    guidance += ' Consider cloud-based solutions that require minimal maintenance.';
  } else if (size === 'Enterprise' || parseInt(size) > 1000) {
    guidance += ' Enterprise-grade solutions with centralized management are recommended.';
  }
  
  // If partially implemented, give specific guidance to improve
  if (currentLevel > 0) {
    guidance = `Enhance your current implementation of ${requirement.name} (Level ${currentLevel}) to reach the expected maturity level (Level ${requirement.expectedLevel}).`;
  }
  
  return guidance;
}

/**
 * Generate parameter-specific recommendations
 */
function generateParameterRecommendations(
  gaps: GapItem[], 
  parameter: GapAnalysisParameter, 
  organizationProfile: any
): string[] {
  if (gaps.length === 0) {
    return [`Your organization meets all expert requirements for ${parameter}.`];
  }
  
  // Generate overall recommendations based on the parameter and gaps
  const recommendations: string[] = [];
  
  // Sort gaps by impact
  const sortedGaps = [...gaps].sort((a, b) => b.percentageImpact - a.percentageImpact);
  
  switch (parameter) {
    case "AccessControl":
      if (sortedGaps.length > 0) {
        recommendations.push(`Implement stronger access control mechanisms to address ${sortedGaps.length} identified gaps.`);
      }
      break;
      
    case "DataProtection":
      if (sortedGaps.length > 0) {
        recommendations.push(`Enhance data protection measures to safeguard sensitive information.`);
      }
      break;
      
    case "SecurityAwareness":
      if (sortedGaps.length > 0) {
        recommendations.push(`Implement a comprehensive security awareness training program.`);
      }
      break;
      
    // Add cases for other parameters
    default:
      recommendations.push(`Address ${sortedGaps.length} gaps in ${parameter} to improve your security posture.`);
      break;
  }
  
  // Add top 3 most impactful specific recommendations
  sortedGaps.slice(0, 3).forEach(gap => {
    recommendations.push(gap.nextSteps);
  });
  
  return recommendations;
}

/**
 * Generate prioritized recommendations across all parameters
 */
function generatePrioritizedRecommendations(
  parameterResults: Record<GapAnalysisParameter, {
    earnedPercentage: number;
    maxPercentage: number;
    gaps: GapItem[];
    recommendations: string[];
  }>, 
  organizationProfile: any
): PrioritizedRecommendation[] {
  const allGaps: (GapItem & { parameter: string })[] = [];
  
  // Collect all gaps across parameters
  Object.keys(parameterResults).forEach(parameter => {
    const param = parameter as GapAnalysisParameter;
    parameterResults[param].gaps.forEach((gap: GapItem) => {
      allGaps.push({
        ...gap,
        parameter
      });
    });
  });
  
  // Sort gaps by impact
  const sortedGaps = [...allGaps].sort((a, b) => b.percentageImpact - a.percentageImpact);
  
  // Generate prioritized recommendations for top gaps
  const recommendations: PrioritizedRecommendation[] = [];
  
  // Set priority based on percentage impact
  sortedGaps.forEach(gap => {
    let priority: 'Critical' | 'High' | 'Medium' | 'Low' = 'Low';
    
    if (gap.percentageImpact >= 5) {
      priority = 'Critical';
    } else if (gap.percentageImpact >= 3) {
      priority = 'High';
    } else if (gap.percentageImpact >= 1) {
      priority = 'Medium';
    }
    
    // Set timeframe based on priority
    let timeframe: 'Immediate' | 'Short-term' | 'Long-term' = 'Long-term';
    if (priority === 'Critical') {
      timeframe = 'Immediate';
    } else if (priority === 'High') {
      timeframe = 'Short-term';
    }
    
    // Set estimated effort (would ideally be based on specific control implementation difficulty)
    const estimatedEffort: 'Low' | 'Medium' | 'High' = 
      gap.expertLevel > 3 ? 'High' : gap.expertLevel > 1 ? 'Medium' : 'Low';
    
    recommendations.push({
      priority,
      impact: `Potential improvement of ${gap.percentageImpact.toFixed(1)}% in overall score`,
      recommendation: gap.nextSteps,
      controlIds: [gap.controlId],
      estimatedEffort,
      timeframe
    });
  });
  
  return recommendations.slice(0, 10); // Return top 10 recommendations
}

/**
 * Convert percentage score to letter grade
 */
function convertPercentageToGrade(percentage: number): string {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}