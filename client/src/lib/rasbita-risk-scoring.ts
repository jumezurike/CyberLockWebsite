// RASBITA Risk Scoring System
// Connects Section #3 Security Risks to Section #12 Device Risk Scores

export interface RasbitaRiskFactor {
  id: string;
  name: string;
  likelihood: 'rare' | 'unlikely' | 'likely' | 'very-likely' | 'most-certain';
  impact: 'trivial' | 'minor' | 'moderate' | 'major' | 'extreme';
  likelihoodScore: number; // 1-5
  impactScore: number; // 1-5
}

// Likelihood mapping to numerical values
const LIKELIHOOD_SCORES = {
  'rare': 1,
  'unlikely': 2, 
  'likely': 3,
  'very-likely': 4,
  'most-certain': 5
};

// Impact mapping to numerical values
const IMPACT_SCORES = {
  'trivial': 1,
  'minor': 2,
  'moderate': 3, 
  'major': 4,
  'extreme': 5
};

// Security risks from Section #3 mapped to RASBITA factors
export const SECURITY_RISK_RASBITA_MAPPING: Record<string, RasbitaRiskFactor> = {
  // Website Security Risks
  'phishing-spoofing-web': {
    id: 'phishing-spoofing-web',
    name: 'Phishing & Spoofing - Website',
    likelihood: 'very-likely',
    impact: 'major',
    likelihoodScore: 4,
    impactScore: 4
  },
  'data-breaches-web': {
    id: 'data-breaches-web', 
    name: 'Data Breaches - Website',
    likelihood: 'likely',
    impact: 'extreme',
    likelihoodScore: 3,
    impactScore: 5
  },
  'sql-injection-web': {
    id: 'sql-injection-web',
    name: 'SQL Injection - Website', 
    likelihood: 'unlikely',
    impact: 'extreme',
    likelihoodScore: 2,
    impactScore: 5
  },
  'ddos-web': {
    id: 'ddos-web',
    name: 'DDoS Attacks - Website',
    likelihood: 'likely',
    impact: 'major',
    likelihoodScore: 3,
    impactScore: 4
  },
  'malware-hacking-web': {
    id: 'malware-hacking-web',
    name: 'Malware & Hacking - Website',
    likelihood: 'very-likely',
    impact: 'extreme',
    likelihoodScore: 4,
    impactScore: 5
  },

  // Social Media Security Risks
  'social-engineering-socmed': {
    id: 'social-engineering-socmed',
    name: 'Social Engineering - SocMedia',
    likelihood: 'very-likely',
    impact: 'major',
    likelihoodScore: 4,
    impactScore: 4
  },
  'impersonation-socmed': {
    id: 'impersonation-socmed',
    name: 'Impersonation - SocMed',
    likelihood: 'likely',
    impact: 'moderate',
    likelihoodScore: 3,
    impactScore: 3
  },
  'data-privacy-socmed': {
    id: 'data-privacy-socmed',
    name: 'Data Privacy Violation - SocMed',
    likelihood: 'likely',
    impact: 'major',
    likelihoodScore: 3,
    impactScore: 4
  },
  'reputation-socmed': {
    id: 'reputation-socmed',
    name: 'Reputational Damages - SocMed',
    likelihood: 'very-likely',
    impact: 'major',
    likelihoodScore: 4,
    impactScore: 4
  },
  'account-hijack-socmed': {
    id: 'account-hijack-socmed',
    name: 'Account Hijacking - SocMed',
    likelihood: 'likely',
    impact: 'moderate',
    likelihoodScore: 3,
    impactScore: 3
  },

  // Website Vulnerabilities
  'unpatched-web': {
    id: 'unpatched-web',
    name: 'Unpatched Software and Plugins - Website',
    likelihood: 'very-likely',
    impact: 'major',
    likelihoodScore: 4,
    impactScore: 4
  },
  'insecure-uploads': {
    id: 'insecure-uploads',
    name: 'Insecure File Uploads - Website',
    likelihood: 'unlikely',
    impact: 'extreme',
    likelihoodScore: 2,
    impactScore: 5
  },
  'xss': {
    id: 'xss',
    name: 'Cross-Site Scripting (XSS) - Website',
    likelihood: 'likely',
    impact: 'major',
    likelihoodScore: 3,
    impactScore: 4
  },
  'unsecured-apis': {
    id: 'unsecured-apis',
    name: 'Unsecured APIs - Website',
    likelihood: 'likely',
    impact: 'extreme',
    likelihoodScore: 3,
    impactScore: 5
  },
  'misconfigured-servers': {
    id: 'misconfigured-servers',
    name: 'Misconfigured Servers - Website',
    likelihood: 'very-likely',
    impact: 'major',
    likelihoodScore: 4,
    impactScore: 4
  },
  'third-party-deps': {
    id: 'third-party-deps',
    name: 'Third-Party Dependencies - Website',
    likelihood: 'very-likely',
    impact: 'moderate',
    likelihoodScore: 4,
    impactScore: 3
  },

  // End Device System Vulnerabilities
  'unpatched-os': {
    id: 'unpatched-os',
    name: 'Unpatched OS or Software - EDS',
    likelihood: 'very-likely',
    impact: 'major',
    likelihoodScore: 4,
    impactScore: 4
  },
  'mdm-misconfig': {
    id: 'mdm-misconfig',
    name: 'Misconfigured MDM Policies Causing Data Exposure - EDS',
    likelihood: 'likely',
    impact: 'extreme',
    likelihoodScore: 3,
    impactScore: 5
  },
  'weak-auth-eds': {
    id: 'weak-auth-eds',
    name: 'Weak Authentication Methods - EDS',
    likelihood: 'very-likely',
    impact: 'major',
    likelihoodScore: 4,
    impactScore: 4
  },
  'unsecured-byod': {
    id: 'unsecured-byod',
    name: 'Unsecured BYOD Devices - EDS',
    likelihood: 'very-likely',
    impact: 'extreme',
    likelihoodScore: 4,
    impactScore: 5
  },
  'default-creds': {
    id: 'default-creds',
    name: 'Default Credentials on Devices - EDS',
    likelihood: 'likely',
    impact: 'extreme',
    likelihoodScore: 3,
    impactScore: 5
  },
  'removable-media': {
    id: 'removable-media',
    name: 'Unsecured Removable Media - EDS',
    likelihood: 'very-likely',
    impact: 'moderate',
    likelihoodScore: 4,
    impactScore: 3
  }
};

// Calculate device risk score (0-100) based on organization's feared security risks
export function calculateDeviceRiskScore(
  organizationSecurityRisks: string[],
  deviceType: string = 'workstation',
  deviceCount: number = 1
): number {
  if (!organizationSecurityRisks || organizationSecurityRisks.length === 0) {
    return 0;
  }

  let totalRiskScore = 0;
  const applicableRisks: RasbitaRiskFactor[] = [];

  // Get RASBITA factors for the organization's feared security risks
  organizationSecurityRisks.forEach(riskId => {
    const riskFactor = SECURITY_RISK_RASBITA_MAPPING[riskId];
    if (riskFactor) {
      applicableRisks.push(riskFactor);
    }
  });

  // Calculate risk score for each applicable risk
  applicableRisks.forEach(risk => {
    const riskScore = risk.likelihoodScore * risk.impactScore;
    totalRiskScore += riskScore;
  });

  // Apply device type multipliers
  const deviceMultipliers: Record<string, number> = {
    'server': 1.3,
    'workstation': 1.0,
    'laptop': 1.1,
    'mobile': 1.2,
    'tablet': 1.1,
    'router': 1.4,
    'switch': 1.3,
    'firewall': 1.2,
    'iot': 1.5
  };

  const multiplier = deviceMultipliers[deviceType.toLowerCase()] || 1.0;
  totalRiskScore = totalRiskScore * multiplier;

  // Convert to 0-100 scale
  // Maximum possible score: 5 risks * 5 likelihood * 5 impact * 1.5 multiplier = 187.5
  // Scale to 0-100
  const maxPossibleScore = 187.5;
  let deviceRiskScore = Math.min((totalRiskScore / maxPossibleScore) * 100, 100);

  // Round to nearest integer
  return Math.round(deviceRiskScore);
}

// Get risk level description based on score
export function getRiskLevelFromScore(score: number): string {
  if (score >= 80) return 'Very High';
  if (score >= 60) return 'High'; 
  if (score >= 40) return 'Medium';
  if (score >= 20) return 'Low';
  return 'Very Low';
}

// Get applicable risks for display
export function getApplicableRisks(organizationSecurityRisks: string[]): RasbitaRiskFactor[] {
  return organizationSecurityRisks
    .map(riskId => SECURITY_RISK_RASBITA_MAPPING[riskId])
    .filter(Boolean);
}