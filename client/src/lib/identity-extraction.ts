// Identity data extraction and component mapping system
import { IdentityBehaviorHygiene } from './sos2a-types';

export interface IdentityRecord {
  id: string;
  uwaGenerated?: string;
  identityType: string;
  identificationMethod: string;
  serverId?: string;
  uuid?: string;
  snModel?: string;
  makeModel?: string;
  os?: string;
  serverOwnerCompany?: string;
  mac?: string;
  environment?: string;
  ipAddress?: string;
  einBiz?: string;
  address?: string;
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  components: Record<string, boolean>;
  extractedAt: string;
  status: 'active' | 'inactive' | 'pending';
}

// Component mapping based on identity type and identification method
export const COMPONENT_MATRIX = {
  human: {
    'username-password': ['firstName', 'lastName', 'email', 'userId', 'role', 'department', 'phoneNumber'],
    'employee-id': ['firstName', 'lastName', 'employeeId', 'department', 'role', 'manager', 'email'],
    'vendor-id': ['vendorId', 'companyName', 'contactPerson', 'email', 'phoneNumber', 'contractNumber'],
    'contractor-id': ['contractorId', 'firstName', 'lastName', 'company', 'email', 'projectAssignment'],
    'certificate': ['certificateId', 'firstName', 'lastName', 'issuingAuthority', 'expirationDate', 'role'],
    'smart-card': ['cardId', 'firstName', 'lastName', 'department', 'accessLevel', 'issuedDate'],
    'single-sign-on': ['ssoId', 'firstName', 'lastName', 'email', 'federatedSource', 'role'],
    'token-based': ['tokenId', 'firstName', 'lastName', 'email', 'tokenType', 'expirationDate'],
    'service-account': ['serviceAccountId', 'serviceName', 'purpose', 'owner', 'accessLevel'],
    'system-account': ['systemAccountId', 'systemName', 'purpose', 'administrator', 'accessLevel'],
    'uwa': ['uwaAddress', 'firstName', 'lastName', 'email', 'walletType', 'verificationLevel'],
    'mfa': ['firstName', 'lastName', 'email', 'mfaMethod', 'backupMethod', 'enrollmentDate'],
    'fingerprint': ['firstName', 'lastName', 'biometricId', 'scanQuality', 'enrollmentDate'],
    'voice': ['firstName', 'lastName', 'voicePrint', 'language', 'enrollmentDate'],
    'facial': ['firstName', 'lastName', 'faceId', 'confidence', 'enrollmentDate'],
    'iris': ['firstName', 'lastName', 'irisId', 'scanQuality', 'enrollmentDate'],
    'driver-license': ['licenseNumber', 'firstName', 'lastName', 'state', 'expirationDate', 'class'],
    'passport': ['passportNumber', 'firstName', 'lastName', 'country', 'expirationDate', 'nationality'],
    'national-id': ['nationalId', 'firstName', 'lastName', 'country', 'dateOfBirth', 'citizenship'],
    'military-id': ['militaryId', 'firstName', 'lastName', 'branch', 'rank', 'clearanceLevel'],
    'state-id': ['stateId', 'firstName', 'lastName', 'state', 'expirationDate', 'address'],
    'birth-certificate': ['certificateNumber', 'firstName', 'lastName', 'birthDate', 'birthPlace', 'parents'],
    'social-security-card': ['ssn', 'firstName', 'lastName', 'dateOfBirth', 'issuedDate'],
    'certificate-of-citizenship': ['certificateNumber', 'firstName', 'lastName', 'country', 'naturalizationDate']
  },
  'machine-physical': {
    'certificate': ['deviceId', 'certificateId', 'manufacturer', 'model', 'serialNumber', 'issuingCA'],
    'smart-card': ['deviceId', 'cardId', 'manufacturer', 'model', 'firmware', 'cryptoCapability'],
    'token-based': ['deviceId', 'tokenId', 'manufacturer', 'model', 'tokenType', 'keyLength'],
    'system-account': ['deviceId', 'systemAccount', 'manufacturer', 'model', 'os', 'purpose']
  },
  'machine-virtual': {
    'certificate': ['vmId', 'certificateId', 'hypervisor', 'os', 'purpose', 'issuingCA'],
    'token-based': ['vmId', 'tokenId', 'hypervisor', 'os', 'tokenType', 'purpose'],
    'system-account': ['vmId', 'systemAccount', 'hypervisor', 'os', 'purpose', 'owner']
  },
  api: {
    'token-based': ['apiKey', 'serviceName', 'provider', 'endpoint', 'tokenType', 'scopes'],
    'certificate': ['apiKey', 'serviceName', 'provider', 'endpoint', 'certificateId', 'issuingCA'],
    'uwa': ['uwaAddress', 'serviceName', 'provider', 'endpoint', 'walletType', 'chainNetwork']
  },
  'third-party': {
    'single-sign-on': ['providerId', 'providerName', 'federatedSource', 'endpoint', 'protocol', 'trustLevel'],
    'certificate': ['providerId', 'providerName', 'certificateId', 'endpoint', 'issuingCA', 'trustLevel'],
    'token-based': ['providerId', 'providerName', 'tokenId', 'endpoint', 'tokenType', 'scopes']
  }
};

// Extract identity record from form data
export function extractIdentityRecord(
  formData: any,
  identityType: string,
  identificationMethod: string
): IdentityRecord {
  const components = getApplicableComponents(identityType, identificationMethod);
  const componentStatus: Record<string, boolean> = {};
  
  // Map available components based on form data
  components.forEach(component => {
    componentStatus[component] = hasComponentData(formData, component);
  });

  // Generate unique ID
  const recordId = `${identityType.toUpperCase()}-${Date.now()}`;
  
  return {
    id: recordId,
    identityType,
    identificationMethod,
    name: getFullName(formData),
    email: formData.identityBehaviorHygiene?.email || formData.contactInfo?.email,
    role: formData.identityBehaviorHygiene?.role,
    department: formData.identityBehaviorHygiene?.departmentTeam,
    components: componentStatus,
    extractedAt: new Date().toISOString(),
    status: 'active',
    // Technical fields - populate from device data if available
    serverId: formData.deviceInventoryTracking?.deviceId,
    uuid: generateUUID(),
    snModel: formData.deviceInventoryTracking?.serialNumber,
    makeModel: formData.deviceInventoryTracking?.makeModel,
    os: formData.deviceInventoryTracking?.operatingSystem,
    serverOwnerCompany: formData.businessInfo?.businessName,
    mac: formData.deviceInventoryTracking?.macAddress,
    environment: formData.deviceInventoryTracking?.environment,
    ipAddress: formData.deviceInventoryTracking?.ipAddress,
    einBiz: formData.businessInfo?.businessEin,
    address: formData.businessInfo?.businessAddress
  };
}

// Get applicable components for identity type and method combination
export function getApplicableComponents(
  identityType: string,
  identificationMethod: string
): string[] {
  const typeComponents = COMPONENT_MATRIX[identityType as keyof typeof COMPONENT_MATRIX];
  if (!typeComponents) return [];
  
  return typeComponents[identificationMethod as keyof typeof typeComponents] || [];
}

// Check if component data exists in form
function hasComponentData(formData: any, component: string): boolean {
  // Map component names to actual form fields
  const fieldMapping: Record<string, string[]> = {
    firstName: ['identityBehaviorHygiene.firstName', 'contactInfo.name'],
    lastName: ['identityBehaviorHygiene.lastName'],
    email: ['identityBehaviorHygiene.email', 'contactInfo.email'],
    phoneNumber: ['identityBehaviorHygiene.phoneNumber', 'contactInfo.phone'],
    userId: ['identityBehaviorHygiene.userId'],
    role: ['identityBehaviorHygiene.role'],
    department: ['identityBehaviorHygiene.departmentTeam'],
    deviceId: ['deviceInventoryTracking.deviceId'],
    serialNumber: ['deviceInventoryTracking.serialNumber'],
    manufacturer: ['deviceInventoryTracking.makeModel'],
    model: ['deviceInventoryTracking.makeModel'],
    operatingSystem: ['deviceInventoryTracking.operatingSystem'],
    macAddress: ['deviceInventoryTracking.macAddress'],
    ipAddress: ['deviceInventoryTracking.ipAddress']
  };

  const paths = fieldMapping[component] || [component];
  
  return paths.some(path => {
    const value = getNestedValue(formData, path);
    return value !== undefined && value !== null && value !== '';
  });
}

// Get nested object value by path
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Extract full name from form data
function getFullName(formData: any): string {
  const firstName = formData.identityBehaviorHygiene?.firstName || '';
  const lastName = formData.identityBehaviorHygiene?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  
  return fullName || formData.contactInfo?.name || 'Unknown';
}

// Generate UUID for records
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Extract multiple records from complete form data
export function extractAllIdentityRecords(formData: any): IdentityRecord[] {
  const records: IdentityRecord[] = [];
  
  // Extract human identity if data exists
  if (formData.identityBehaviorHygiene?.firstName || formData.identityBehaviorHygiene?.email) {
    const method = formData.identityBehaviorHygiene?.identificationMethod || 'username-password';
    records.push(extractIdentityRecord(formData, 'human', method));
  }
  
  // Extract device/machine identities if device data exists
  if (formData.deviceInventoryTracking?.deviceId || formData.deviceInventoryTracking?.makeModel) {
    records.push(extractIdentityRecord(formData, 'machine-physical', 'certificate'));
  }
  
  // Extract API identities if API data exists (can be extended based on form structure)
  // This would be populated when API configuration sections are added to the form
  
  return records;
}