/**
 * Device Inventory Tracking and Identity Behavior & Hygiene Synergy
 * 
 * This file documents the powerful synergistic relationship between 
 * Device Inventory Tracking and Identity Behavior & Hygiene parameters.
 * Together, these domains create a comprehensive security foundation that
 * addresses both the "what" (devices) and "who" (identities) aspects of
 * cybersecurity.
 */

export interface SynergyMapping {
  deviceInventoryFunction: string;
  identityBehaviorFunction: string;
  synergisticOutcome: string;
}

/**
 * Documented synergies between Device Inventory Tracking and Identity Behavior & Hygiene
 */
export const deviceIdentitySynergies: SynergyMapping[] = [
  {
    deviceInventoryFunction: "Tracks what is in the environment",
    identityBehaviorFunction: "Tracks who is in the environment",
    synergisticOutcome: "Full asset + identity correlation (e.g., \"User X logged into Device Y from anomalous location\")"
  },
  {
    deviceInventoryFunction: "Ensures devices are patched/secured",
    identityBehaviorFunction: "Ensures identities follow least privilege",
    synergisticOutcome: "Closes lateral movement risks (e.g., a compromised device + overprivileged account = breach)"
  },
  {
    deviceInventoryFunction: "Maps to CIS Control 1 (Inventory)",
    identityBehaviorFunction: "Maps to CIS Control 5 (Account Mgmt)",
    synergisticOutcome: "Compliance coverage (e.g., NIST 800-171, GDPR)"
  },
  {
    deviceInventoryFunction: "Enables device-based access policies",
    identityBehaviorFunction: "Enables identity-based authentication policies",
    synergisticOutcome: "Zero Trust architecture foundation (verify both user and device before granting access)"
  },
  {
    deviceInventoryFunction: "Identifies unauthorized devices",
    identityBehaviorFunction: "Identifies abnormal authentication patterns",
    synergisticOutcome: "Enhanced threat detection (correlating device anomalies with identity anomalies)"
  },
  {
    deviceInventoryFunction: "Manages device lifecycle (procurement to retirement)",
    identityBehaviorFunction: "Manages identity lifecycle (onboarding to offboarding)",
    synergisticOutcome: "Complete lifecycle security coverage for both technical and human assets"
  }
];

/**
 * Security benefits resulting from the synergy between Device Inventory Tracking and Identity Behavior & Hygiene
 */
export const synergisticSecurityBenefits = [
  "Improved detection of account takeover attacks by correlating unusual device access with unusual identity behavior",
  "Prevention of unauthorized access via comprehensive device-identity verification",
  "Enhanced audit capabilities showing which specific users accessed which specific devices",
  "Stronger compliance posture covering multiple regulatory frameworks",
  "Reduced attack surface through proper management of both device and identity lifecycles",
  "More accurate risk assessment by understanding both identity and device context"
];