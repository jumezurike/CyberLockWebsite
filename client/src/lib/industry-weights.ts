import { GapAnalysisParameter } from './gap-analysis-types';

// Industry-specific parameter weight configurations
// Weights must sum to 100% for each industry
export interface IndustryWeights {
  [key: string]: {
    [K in GapAnalysisParameter]: number;
  };
}

export const INDUSTRY_PARAMETER_WEIGHTS: IndustryWeights = {
  'Healthcare': {
    'DataProtection': 15.0,        // HIPAA compliance critical
    'ComplianceManagement': 12.0,  // Heavy regulatory requirements
    'AccessControl': 11.0,         // Patient data access controls
    'IncidentResponse': 10.0,      // Breach notification requirements
    'SecurityGovernance': 9.5,     // Organizational security policies
    'IAM': 9.0,                    // Identity management for patient data
    'NetworkSecurity': 8.5,        // Network segmentation for PHI
    'ApplicationSecurity': 8.0,    // EMR and healthcare app security
    'AssetManagement': 7.0,        // Medical device inventory
    'SecurityAwareness': 6.0,      // Staff training on HIPAA
    'ThirdPartyManagement': 4.0    // Limited vendor relationships
  },
  
  'Financial Services': {
    'ComplianceManagement': 16.0,  // SOX, PCI-DSS, banking regulations
    'DataProtection': 14.0,        // Financial data protection
    'AccessControl': 12.0,         // Financial system access controls
    'IncidentResponse': 11.0,      // Regulatory reporting requirements
    'SecurityGovernance': 10.0,    // Board-level security oversight
    'NetworkSecurity': 9.0,        // Financial network protection
    'IAM': 8.5,                    // Customer identity management
    'ApplicationSecurity': 8.0,    // Banking application security
    'ThirdPartyManagement': 6.5,   // Vendor risk management
    'AssetManagement': 3.0,        // Limited physical assets
    'SecurityAwareness': 2.0       // Highly trained staff
  },
  
  'Manufacturing': {
    'AssetManagement': 14.0,       // Industrial control systems
    'NetworkSecurity': 13.0,       // OT/IT network security
    'ApplicationSecurity': 11.0,   // SCADA and control systems
    'AccessControl': 10.5,         // Physical and logical access
    'IncidentResponse': 10.0,      // Operational continuity
    'SecurityGovernance': 9.5,     // Safety-first culture
    'IAM': 9.0,                    // Employee and contractor access
    'ThirdPartyManagement': 8.0,   // Supply chain security
    'DataProtection': 7.0,         // Intellectual property
    'SecurityAwareness': 6.0,      // Worker safety training
    'ComplianceManagement': 2.0    // Limited regulatory requirements
  },
  
  'Technology': {
    'ApplicationSecurity': 16.0,   // Core business applications
    'DataProtection': 13.0,        // Customer and proprietary data
    'NetworkSecurity': 12.0,       // Infrastructure protection
    'AccessControl': 11.0,         // Development system access
    'SecurityGovernance': 10.0,    // Security-by-design culture
    'IAM': 9.5,                    // Developer and user access
    'IncidentResponse': 9.0,       // Rapid response capabilities
    'ThirdPartyManagement': 7.5,   // Third-party integrations
    'AssetManagement': 6.0,        // Cloud and on-premise assets
    'SecurityAwareness': 4.0,      // Technical staff awareness
    'ComplianceManagement': 2.0    // Minimal regulatory burden
  },
  
  'Education': {
    'DataProtection': 13.0,        // FERPA student data protection
    'AccessControl': 12.0,         // Student and faculty access
    'SecurityAwareness': 11.0,     // Campus-wide security training
    'ComplianceManagement': 10.5,  // FERPA and other education regulations
    'IAM': 10.0,                   // Student information systems
    'NetworkSecurity': 9.5,        // Campus network security
    'ApplicationSecurity': 9.0,    // Learning management systems
    'IncidentResponse': 8.0,       // Campus security coordination
    'SecurityGovernance': 7.5,     // Academic governance structure
    'AssetManagement': 6.5,        // Campus technology assets
    'ThirdPartyManagement': 3.0    // Limited vendor relationships
  },
  
  'Retail': {
    'DataProtection': 14.0,        // Customer payment data (PCI-DSS)
    'ComplianceManagement': 12.0,  // PCI-DSS and consumer protection
    'AccessControl': 11.5,         // POS and customer system access
    'ApplicationSecurity': 11.0,   // E-commerce and POS applications
    'ThirdPartyManagement': 10.0,  // Payment processor relationships
    'NetworkSecurity': 9.5,        // Store and corporate networks
    'IAM': 9.0,                    // Employee and customer access
    'IncidentResponse': 8.0,       // Breach response procedures
    'AssetManagement': 7.0,        // Store technology inventory
    'SecurityGovernance': 5.0,     // Corporate security policies
    'SecurityAwareness': 3.0       // Basic staff training
  },
  
  'Government': {
    'ComplianceManagement': 18.0,  // Extensive regulatory requirements
    'DataProtection': 14.0,        // Citizen data protection
    'SecurityGovernance': 12.0,    // Government security frameworks
    'AccessControl': 11.0,         // Classified information access
    'IncidentResponse': 10.0,      // National security implications
    'NetworkSecurity': 9.0,        // Critical infrastructure protection
    'IAM': 8.5,                    // Citizen and employee identity
    'ApplicationSecurity': 7.5,    // Government service applications
    'AssetManagement': 5.0,        // Government asset tracking
    'SecurityAwareness': 3.0,      // Mandatory security training
    'ThirdPartyManagement': 2.0    // Limited external vendors
  },
  
  // Default weights for unspecified industries
  'Default': {
    'AccessControl': 9.09,
    'DataProtection': 9.09,
    'SecurityAwareness': 9.09,
    'IncidentResponse': 9.09,
    'NetworkSecurity': 9.09,
    'ApplicationSecurity': 9.09,
    'ThirdPartyManagement': 9.09,
    'AssetManagement': 9.09,
    'SecurityGovernance': 9.09,
    'ComplianceManagement': 9.09,
    'IAM': 9.09
  }
};

/**
 * Get industry-specific parameter weights
 * @param industry - Organization's industry
 * @returns Parameter weights that sum to 100%
 */
export function getIndustryWeights(industry: string): { [K in GapAnalysisParameter]: number } {
  // Normalize industry name and check for exact match
  const normalizedIndustry = industry?.trim();
  
  // Direct match
  if (normalizedIndustry && INDUSTRY_PARAMETER_WEIGHTS[normalizedIndustry]) {
    return INDUSTRY_PARAMETER_WEIGHTS[normalizedIndustry];
  }
  
  // Partial match for common variations
  const industryLower = normalizedIndustry?.toLowerCase() || '';
  
  if (industryLower.includes('healthcare') || industryLower.includes('medical') || industryLower.includes('hospital')) {
    return INDUSTRY_PARAMETER_WEIGHTS['Healthcare'];
  }
  
  if (industryLower.includes('financial') || industryLower.includes('banking') || industryLower.includes('fintech')) {
    return INDUSTRY_PARAMETER_WEIGHTS['Financial Services'];
  }
  
  if (industryLower.includes('manufacturing') || industryLower.includes('industrial')) {
    return INDUSTRY_PARAMETER_WEIGHTS['Manufacturing'];
  }
  
  if (industryLower.includes('technology') || industryLower.includes('software') || industryLower.includes('tech')) {
    return INDUSTRY_PARAMETER_WEIGHTS['Technology'];
  }
  
  if (industryLower.includes('education') || industryLower.includes('school') || industryLower.includes('university')) {
    return INDUSTRY_PARAMETER_WEIGHTS['Education'];
  }
  
  if (industryLower.includes('retail') || industryLower.includes('commerce')) {
    return INDUSTRY_PARAMETER_WEIGHTS['Retail'];
  }
  
  if (industryLower.includes('government') || industryLower.includes('public sector')) {
    return INDUSTRY_PARAMETER_WEIGHTS['Government'];
  }
  
  // Return default weights if no match found
  return INDUSTRY_PARAMETER_WEIGHTS['Default'];
}

/**
 * Validate that industry weights sum to 100%
 * @param weights - Parameter weights to validate
 * @returns true if weights sum to 100% (within 0.1% tolerance)
 */
export function validateWeights(weights: { [K in GapAnalysisParameter]: number }): boolean {
  const sum = Object.values(weights).reduce((total, weight) => total + weight, 0);
  return Math.abs(sum - 100.0) < 0.1;
}

/**
 * Get list of supported industries
 * @returns Array of industry names with specific weight configurations
 */
export function getSupportedIndustries(): string[] {
  return Object.keys(INDUSTRY_PARAMETER_WEIGHTS).filter(industry => industry !== 'Default');
}