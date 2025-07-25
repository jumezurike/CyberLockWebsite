/**
 * TEST GAP ANALYSIS EXPERT SYSTEM
 * Testing the authentic expert knowledge process where I analyze
 * questionnaire responses against 11 cybersecurity core domains
 */

import { performGapAnalysisWithParameterizedScoring } from './client/src/lib/gap-analysis';
import { Sos2aFormData } from './client/src/lib/sos2a-types';

// Sample questionnaire data for testing expert analysis
const sampleHealthcareOrganization: Sos2aFormData = {
  // 1. Business Information
  businessName: "Regional Medical Center",
  businessAddress: "123 Healthcare Ave, Medical City, HC 12345",
  businessLocation: {
    city: "Medical City",
    state: "Healthcare State",
    country: "USA",
    zipCode: "12345"
  },
  industry: "Healthcare",
  employeeCount: "100-500",
  businessServices: "Primary care, emergency services, diagnostic imaging, laboratory services",
  
  // 2. Infrastructure Mode of Operation
  operationMode: ["cloud-based", "on-premises", "hybrid"],
  internetPresence: ["website", "patient-portal", "mobile-app"],
  primaryConcerns: ["data-security", "patient-privacy", "system-availability"],
  vulnerabilities: ["outdated-systems", "insufficient-access-controls"],
  
  // 3. Security Risks & Vulnerabilities
  securityRisks: ["ransomware", "phishing", "insider-threats"],
  websiteVulnerabilities: ["weak-authentication", "unencrypted-data"],
  endDeviceVulnerabilities: ["unpatched-systems", "weak-passwords"],
  
  // 4. Security Control Framework
  securityMeasures: ["access-control", "encryption", "backup-systems", "employee-training"],
  frameworks: {
    operations: ["NIST-CSF", "HIPAA"],
    management: ["ISO-27001"],
    technology: ["CIS-Controls"],
    people: ["Security-Awareness"]
  },
  
  // 5. Compliance Requirements
  complianceRequirements: {
    frameworks: ["NIST-CSF"],
    standards: ["ISO-27001"],
    compliance: ["HIPAA", "HITECH"],
    regulations: ["State-Health-Regulations"],
    guidelines: ["HHS-Guidance"],
    healthcare: ["HIPAA", "HITECH", "FDA-Medical-Device"],
    financial: [],
    industrySpecific: ["Joint-Commission"]
  },
  
  // 6. Regulatory Requirements
  regulatoryRequirements: ["HIPAA", "HITECH", "State-Health-Code"],
  
  // 7. Standards & Guidelines
  healthcareStandards: ["HL7", "DICOM", "IHE"],
  securityGuidelines: ["NIST-800-66", "HHS-Security-Rule"],
  policyDocuments: {
    policies: ["Privacy-Policy", "Security-Policy", "Access-Control-Policy"],
    procedures: ["Incident-Response", "Breach-Notification", "Access-Management"],
    plans: ["Disaster-Recovery", "Business-Continuity", "Risk-Management"],
    guides: ["Employee-Handbook", "Security-Awareness-Guide"]
  },
  
  // 8. Relevant ACQ Tools
  relevantACQTools: {
    assessments: ["HIPAA-Risk-Assessment", "Vulnerability-Assessment"],
    checklists: ["CIS-Healthcare-Checklist", "HIPAA-Compliance-Checklist"],
    questionnaires: ["HHS-SRA-Tool", "Joint-Commission-Survey"]
  },
  
  // 9. Adversarial Insight (MITRE ATT&CK)
  osHardening: {
    stig: true,
    scap: false,
    guidelines: ["CIS-Benchmarks", "NIST-800-53"]
  },
  
  // 10. ISMS
  ismsProcesses: ["Policy-Management", "Risk-Assessment", "Incident-Management"],
  
  // 11. Device Inventory Tracking
  deviceInventoryTracking: {
    deviceType: ["Laptop", "Desktop", "Server", "Mobile"],
    operatingSystem: "Windows 10/11, macOS, iOS",
    encryptionStatus: ["Full-Disk-Encryption"],
    antivirusInstalled: true,
    firewallActive: true,
    patchStatus: "Monthly",
    securityComplianceLevel: ["HIPAA"]
  },
  
  // 12. Identity Behavior & Hygiene
  identityBehaviorHygiene: {
    identityType: "Human",
    passwordPolicyCompliance: true,
    mfaStatus: true,
    mfaTypes: ["SMS", "App-Based"],
    accessControlModel: "RBAC",
    privilegedAccountInventory: true,
    accessReviewFrequency: "Quarterly"
  },
  
  // 13. Contact and Confirmation
  contactInfo: {
    name: "Dr. Sarah Johnson",
    title: "Chief Information Security Officer",
    email: "s.johnson@regionalmedical.com",
    phone: "(555) 123-4567"
  },
  
  // Report Configuration
  matrixData: null,
  reportType: 'preliminary',
  availabilityConfirmation: true,
  referralPermission: true,
  eulaAccepted: true
};

/**
 * EXPERT ANALYSIS PROCESS
 * This demonstrates how I, as the expert, analyze their responses
 * against the 11 cybersecurity core domains
 */

const expertConfig = {
  requirements: {
    // Example expert requirements for healthcare industry
    AccessControl: [
      {
        controlId: 'AC-1',
        name: 'Access Control Policy',
        description: 'Documented access control policy and procedures',
        expectedLevel: 4, // Required for healthcare
        industry: ['Healthcare'],
        infraComponents: ['cloud-based', 'on-premises']
      },
      {
        controlId: 'AC-2',
        name: 'Multi-Factor Authentication',
        description: 'MFA required for all privileged accounts',
        expectedLevel: 4,
        industry: ['Healthcare'],
        infraComponents: ['cloud-based', 'on-premises', 'hybrid']
      }
    ],
    DataProtection: [
      {
        controlId: 'DP-1',
        name: 'Data Encryption',
        description: 'Encryption of PHI at rest and in transit',
        expectedLevel: 5, // Critical for healthcare
        industry: ['Healthcare'],
        infraComponents: ['cloud-based', 'on-premises', 'hybrid']
      }
    ],
    IAM: [
      {
        controlId: 'IAM-1',
        name: 'Identity Management System',
        description: 'Centralized identity and access management',
        expectedLevel: 4,
        industry: ['Healthcare'],
        infraComponents: ['cloud-based', 'hybrid']
      }
    ]
    // ... other domains would have similar expert requirements
  }
};

// Test the expert analysis
console.log('=== EXPERT GAP ANALYSIS TEST ===');
console.log('Organization: Regional Medical Center (Healthcare)');
console.log('Analysis: What they have vs 11 cybersecurity core domains');
console.log('');

try {
  const gapAnalysisResult = performGapAnalysisWithParameterizedScoring(
    sampleHealthcareOrganization,
    expertConfig
  );
  
  console.log('EXPERT ANALYSIS RESULTS:');
  console.log(`Overall Security Score: ${gapAnalysisResult.overallScore.percentage.toFixed(1)}%`);
  console.log(`Security Grade: ${gapAnalysisResult.overallScore.grade}`);
  console.log('');
  
  console.log('DOMAIN-BY-DOMAIN EXPERT ASSESSMENT:');
  Object.entries(gapAnalysisResult.parameterScores).forEach(([domain, score]) => {
    console.log(`${domain}: ${score.earnedPercentage.toFixed(1)}% (${score.gaps.length} gaps identified)`);
  });
  
  console.log('');
  console.log('EXPERT RECOMMENDATIONS:');
  gapAnalysisResult.prioritizedRecommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec.title} (Impact: ${rec.impact})`);
  });
  
} catch (error) {
  console.error('Expert Analysis Error:', error);
}

export { sampleHealthcareOrganization, expertConfig };