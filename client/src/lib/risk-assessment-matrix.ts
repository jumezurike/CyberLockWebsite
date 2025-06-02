// Risk Assessment Matrix for Device Inventory
// Maps security vulnerabilities to device risk levels using likelihood vs impact

export interface RiskFactor {
  id: string;
  name: string;
  likelihood: number; // 1-5 scale
  impact: number; // 1-5 scale
  category: string;
}

export interface DeviceRiskProfile {
  deviceType: string;
  baseRiskFactors: RiskFactor[];
  vulnerabilityMultipliers: Record<string, number>;
}

// Risk Level Matrix (Likelihood x Impact)
export const RISK_MATRIX: Record<number, Record<number, string>> = {
  1: { 1: 'Very Low', 2: 'Low', 3: 'Low', 4: 'Medium', 5: 'Medium' },
  2: { 1: 'Low', 2: 'Low', 3: 'Medium', 4: 'Medium', 5: 'High' },
  3: { 1: 'Low', 2: 'Medium', 3: 'Medium', 4: 'High', 5: 'High' },
  4: { 1: 'Medium', 2: 'Medium', 3: 'High', 4: 'High', 5: 'Very High' },
  5: { 1: 'Medium', 2: 'High', 3: 'High', 4: 'Very High', 5: 'Very High' }
};

// Security vulnerability mappings from Section 3
export const VULNERABILITY_RISK_FACTORS: Record<string, RiskFactor> = {
  // Primary Security Concerns
  'data-breach': {
    id: 'data-breach',
    name: 'Data Breach/Loss',
    likelihood: 3,
    impact: 5,
    category: 'data-protection'
  },
  'ransomware': {
    id: 'ransomware',
    name: 'Ransomware Attacks',
    likelihood: 4,
    impact: 5,
    category: 'malware'
  },
  'phishing': {
    id: 'phishing',
    name: 'Phishing/Social Engineering',
    likelihood: 4,
    impact: 3,
    category: 'human-factor'
  },
  'unauthorized-access': {
    id: 'unauthorized-access',
    name: 'Unauthorized Access',
    likelihood: 3,
    impact: 4,
    category: 'access-control'
  },
  'insider-threats': {
    id: 'insider-threats',
    name: 'Insider Threats',
    likelihood: 2,
    impact: 4,
    category: 'human-factor'
  },
  'compliance-violations': {
    id: 'compliance-violations',
    name: 'Compliance Violations',
    likelihood: 3,
    impact: 4,
    category: 'regulatory'
  },
  'system-downtime': {
    id: 'system-downtime',
    name: 'System Downtime/Availability',
    likelihood: 3,
    impact: 3,
    category: 'availability'
  },
  'third-party-risks': {
    id: 'third-party-risks',
    name: 'Third-party/Vendor Risks',
    likelihood: 2,
    impact: 3,
    category: 'supply-chain'
  },

  // Website Vulnerabilities
  'sql-injection': {
    id: 'sql-injection',
    name: 'SQL Injection',
    likelihood: 3,
    impact: 5,
    category: 'web-security'
  },
  'xss': {
    id: 'xss',
    name: 'Cross-Site Scripting (XSS)',
    likelihood: 4,
    impact: 3,
    category: 'web-security'
  },
  'csrf': {
    id: 'csrf',
    name: 'Cross-Site Request Forgery',
    likelihood: 3,
    impact: 3,
    category: 'web-security'
  },
  'broken-authentication': {
    id: 'broken-authentication',
    name: 'Broken Authentication',
    likelihood: 3,
    impact: 4,
    category: 'authentication'
  },
  'insecure-deserialization': {
    id: 'insecure-deserialization',
    name: 'Insecure Deserialization',
    likelihood: 2,
    impact: 4,
    category: 'web-security'
  },

  // End Device Vulnerabilities
  'unpatched-software': {
    id: 'unpatched-software',
    name: 'Unpatched Software',
    likelihood: 4,
    impact: 4,
    category: 'patch-management'
  },
  'weak-passwords': {
    id: 'weak-passwords',
    name: 'Weak Passwords',
    likelihood: 4,
    impact: 3,
    category: 'authentication'
  },
  'malware-infections': {
    id: 'malware-infections',
    name: 'Malware Infections',
    likelihood: 3,
    impact: 4,
    category: 'malware'
  },
  'unsecured-wifi': {
    id: 'unsecured-wifi',
    name: 'Unsecured WiFi Networks',
    likelihood: 4,
    impact: 3,
    category: 'network-security'
  },
  'usb-threats': {
    id: 'usb-threats',
    name: 'USB/Removable Media Threats',
    likelihood: 3,
    impact: 3,
    category: 'physical-security'
  }
};

// Device type risk profiles
export const DEVICE_RISK_PROFILES: Record<string, DeviceRiskProfile> = {
  'server': {
    deviceType: 'Server',
    baseRiskFactors: [
      VULNERABILITY_RISK_FACTORS['data-breach'],
      VULNERABILITY_RISK_FACTORS['unauthorized-access'],
      VULNERABILITY_RISK_FACTORS['system-downtime']
    ],
    vulnerabilityMultipliers: {
      'unpatched-software': 1.5,
      'weak-passwords': 1.3,
      'sql-injection': 1.4,
      'broken-authentication': 1.4
    }
  },
  'workstation': {
    deviceType: 'Workstation/Desktop',
    baseRiskFactors: [
      VULNERABILITY_RISK_FACTORS['phishing'],
      VULNERABILITY_RISK_FACTORS['malware-infections'],
      VULNERABILITY_RISK_FACTORS['unpatched-software']
    ],
    vulnerabilityMultipliers: {
      'phishing': 1.3,
      'malware-infections': 1.4,
      'weak-passwords': 1.2,
      'usb-threats': 1.3
    }
  },
  'mobile': {
    deviceType: 'Mobile Device',
    baseRiskFactors: [
      VULNERABILITY_RISK_FACTORS['unsecured-wifi'],
      VULNERABILITY_RISK_FACTORS['data-breach'],
      VULNERABILITY_RISK_FACTORS['unauthorized-access']
    ],
    vulnerabilityMultipliers: {
      'unsecured-wifi': 1.4,
      'weak-passwords': 1.5,
      'malware-infections': 1.2
    }
  },
  'network': {
    deviceType: 'Network Equipment',
    baseRiskFactors: [
      VULNERABILITY_RISK_FACTORS['unauthorized-access'],
      VULNERABILITY_RISK_FACTORS['system-downtime'],
      VULNERABILITY_RISK_FACTORS['unpatched-software']
    ],
    vulnerabilityMultipliers: {
      'unpatched-software': 1.6,
      'weak-passwords': 1.4,
      'unauthorized-access': 1.3
    }
  },
  'iot': {
    deviceType: 'IoT Device',
    baseRiskFactors: [
      VULNERABILITY_RISK_FACTORS['weak-passwords'],
      VULNERABILITY_RISK_FACTORS['unpatched-software'],
      VULNERABILITY_RISK_FACTORS['unauthorized-access']
    ],
    vulnerabilityMultipliers: {
      'weak-passwords': 1.6,
      'unpatched-software': 1.5,
      'unauthorized-access': 1.4
    }
  }
};

// Calculate risk level for a device based on identified vulnerabilities
export function calculateDeviceRiskLevel(
  deviceType: string,
  identifiedVulnerabilities: string[],
  securityMeasures: string[] = []
): { riskLevel: string; riskScore: number; factors: string[] } {
  const profile = DEVICE_RISK_PROFILES[deviceType.toLowerCase()] || DEVICE_RISK_PROFILES['workstation'];
  
  let totalLikelihood = 0;
  let totalImpact = 0;
  let factorCount = 0;
  const activeFactors: string[] = [];

  // Base risk factors for device type
  profile.baseRiskFactors.forEach(factor => {
    totalLikelihood += factor.likelihood;
    totalImpact += factor.impact;
    factorCount++;
    activeFactors.push(factor.name);
  });

  // Add risk from identified vulnerabilities
  identifiedVulnerabilities.forEach(vuln => {
    const riskFactor = VULNERABILITY_RISK_FACTORS[vuln];
    if (riskFactor) {
      const multiplier = profile.vulnerabilityMultipliers[vuln] || 1.0;
      totalLikelihood += riskFactor.likelihood * multiplier;
      totalImpact += riskFactor.impact * multiplier;
      factorCount++;
      activeFactors.push(riskFactor.name);
    }
  });

  // Reduce risk based on security measures
  const riskReduction = calculateRiskReduction(securityMeasures);
  
  const avgLikelihood = Math.max(1, Math.min(5, Math.round((totalLikelihood / factorCount) * (1 - riskReduction))));
  const avgImpact = Math.max(1, Math.min(5, Math.round(totalImpact / factorCount)));
  
  const riskLevel = RISK_MATRIX[avgLikelihood]?.[avgImpact] || 'Medium';
  const riskScore = avgLikelihood * avgImpact;

  return {
    riskLevel,
    riskScore,
    factors: activeFactors
  };
}

// Calculate risk reduction based on implemented security measures
function calculateRiskReduction(securityMeasures: string[]): number {
  const riskReductionMap: Record<string, number> = {
    'antivirus-edr': 0.2,
    'firewall': 0.15,
    'encryption': 0.2,
    'backup-recovery': 0.1,
    'patch-management': 0.25,
    'access-controls': 0.2,
    'network-monitoring': 0.15,
    'security-training': 0.1,
    'incident-response': 0.1,
    'vulnerability-scanning': 0.15
  };

  let totalReduction = 0;
  securityMeasures.forEach(measure => {
    totalReduction += riskReductionMap[measure] || 0;
  });

  return Math.min(0.5, totalReduction); // Max 50% risk reduction
}

// Get risk level color for UI display
export function getRiskLevelColor(riskLevel: string): string {
  const colorMap: Record<string, string> = {
    'Very Low': 'text-green-600 bg-green-50',
    'Low': 'text-green-500 bg-green-50',
    'Medium': 'text-yellow-600 bg-yellow-50',
    'High': 'text-orange-600 bg-orange-50',
    'Very High': 'text-red-600 bg-red-50'
  };
  
  return colorMap[riskLevel] || 'text-gray-600 bg-gray-50';
}