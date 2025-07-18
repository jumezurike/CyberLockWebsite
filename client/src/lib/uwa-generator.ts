// Universal Wallet Address (UWA) Generation System
// Generates 45-digit UWAs starting with CLX using specific algorithms for each entity type

export interface UWAComponents {
  // Personal/Human Components
  name?: string;
  address?: string;
  birthplace?: string;
  dateOfBirth?: string;
  phoneEinSsn?: string;
  driverLicensePassport?: string;
  primaryAuthDeviceImei?: string;
  
  // Machine/Server Components
  instanceUuid?: string;
  environment?: string;
  osName?: string;
  serialNumber?: string;
  macAddress?: string;
  ipAddress?: string;
  serverId?: string;
  
  // Auto/Vehicle Components
  dateOfManufacture?: string;
  vinNumber?: string;
  plateNumber?: string;
  
  // Business Components
  businessCertifications?: string;
  businessLicenses?: string;
  utilityBills?: string;
  
  // Common Components
  makeModelOs?: string;
  imeiSn?: string;
}

export interface UWARecord {
  id: number;
  uwa: string;
  entityType: 'physical-machine' | 'virtual-machine' | 'human-individual' | 'business-owner' | 'user-account' | 'service-account';
  components: UWAComponents;
  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
}

export class UWAGenerator {
  
  // Physical Machine Entity UWA Generation
  static generatePhysicalMachineUWA(components: UWAComponents): string {
    const { serialNumber, environment, address, osName, macAddress } = components;
    
    if (!serialNumber || !environment || !address || !osName) {
      throw new Error('Missing required components for physical machine UWA generation');
    }
    
    // Extract components according to algorithm
    const cleanSerial = serialNumber.replace(/[^A-Z0-9]/g, '').toUpperCase();
    const first2Env = environment.slice(0, 2).toUpperCase();
    const last7Address = this.extractGoogleLocation(address).slice(-7);
    const first7OsName = osName.slice(0, 7).toUpperCase();
    
    // Calculate how many characters we have so far
    let combined = `${cleanSerial}${first2Env}${last7Address}${first7OsName}`;
    
    // If we need more characters to reach 42, use MAC address
    if (combined.length < 42 && macAddress) {
      const cleanMac = macAddress.replace(/[^A-Z0-9]/g, '').toUpperCase();
      const neededChars = 42 - combined.length;
      combined += cleanMac.slice(0, neededChars);
    }
    
    return this.chunkAndFormat(combined);
  }

  // Virtual Machine Entity UWA Generation
  static generateVirtualMachineUWA(components: UWAComponents): string {
    const { instanceUuid, environment, address, osName } = components;
    
    if (!instanceUuid || !environment || !address || !osName) {
      throw new Error('Missing required components for virtual machine UWA generation');
    }
    
    // Extract components according to algorithm
    const last26Uuid = instanceUuid.replace(/-/g, '').slice(-26);
    const first2Env = environment.slice(0, 2).toUpperCase();
    const last7Address = this.extractGoogleLocation(address).slice(-7);
    const first7OsName = osName.slice(0, 7);
    
    // Combine: Last26InstanceUUID + First2Env + Last7Address + First7OSname
    const combined = `${last26Uuid}${first2Env}${last7Address}${first7OsName}`;
    
    return this.chunkAndFormat(combined);
  }
  
  // Business Owner Entity UWA Generation
  static generateBusinessUWA(components: UWAComponents): string {
    const { dateOfBirth, phoneEinSsn, name, imeiSn, birthplace, address } = components;
    
    if (!dateOfBirth || !phoneEinSsn || !name || !imeiSn || !birthplace || !address) {
      throw new Error('Missing required components for business UWA generation');
    }
    
    // Extract components according to algorithm
    const eightDob = dateOfBirth.replace(/[^0-9]/g, '').slice(0, 8); // MMDDYYYY -> 8 digits
    const last5Ein = phoneEinSsn.replace(/[^0-9]/g, '').slice(-5);
    const initials = this.extractInitials(name);
    const last13Imei = imeiSn.replace(/[^0-9]/g, '').slice(-13);
    const last7Birthplace = this.extractGoogleLocation(birthplace).slice(-7);
    const last7Address = this.extractGoogleLocation(address).slice(-7);
    
    // Combine: 8DOB + Last5EIN + InitialsFLName + Last13NumbersIMEI + Last7BirthPlace + Last7Address
    const combined = `${eightDob}${last5Ein}${initials}${last13Imei}${last7Birthplace}${last7Address}`;
    
    return this.chunkAndFormat(combined);
  }
  
  // Machine (Auto) Entity UWA Generation
  static generateAutoUWA(components: UWAComponents): string {
    const { dateOfManufacture, vinNumber, name, plateNumber, imeiSn, address } = components;
    
    if (!dateOfManufacture || !vinNumber || !name || !plateNumber || !imeiSn || !address) {
      throw new Error('Missing required components for auto UWA generation');
    }
    
    // Extract components according to algorithm
    const fourDom = dateOfManufacture.replace(/[^0-9]/g, '').slice(-4); // MMYY -> 4 digits
    const vinNum = vinNumber.replace(/[^A-Z0-9]/g, '');
    const initials = this.extractInitials(name);
    const plateNum = plateNumber.replace(/[^A-Z0-9]/g, '');
    
    // Dynamic IMEI length based on plate number length
    const plateLength = plateNum.length;
    const imeiLength = plateLength === 7 ? 5 : plateLength === 6 ? 6 : 7;
    const imeiNumbers = imeiSn.replace(/[^0-9]/g, '').slice(-imeiLength);
    
    const last7Address = this.extractGoogleLocation(address).slice(-7);
    
    // Combine: 4DOM + VIN# + InitialFLname + Plate# + IMEInumbers + Last7Address
    const combined = `${fourDom}${vinNum}${initials}${plateNum}${imeiNumbers}${last7Address}`;
    
    return this.chunkAndFormat(combined);
  }
  
  // Individual/Person Entity UWA Generation (variant of business)
  static generatePersonUWA(components: UWAComponents): string {
    const { dateOfBirth, phoneEinSsn, name, imeiSn, birthplace, driverLicensePassport } = components;
    
    if (!dateOfBirth || !phoneEinSsn || !name || !imeiSn || !birthplace || !driverLicensePassport) {
      throw new Error('Missing required components for person UWA generation');
    }
    
    // Same as business but use driver license instead of address
    const eightDob = dateOfBirth.replace(/[^0-9]/g, '').slice(0, 8);
    const last5Ein = phoneEinSsn.replace(/[^0-9]/g, '').slice(-5);
    const initials = this.extractInitials(name);
    const last13Imei = imeiSn.replace(/[^0-9]/g, '').slice(-13);
    const last7Birthplace = this.extractGoogleLocation(birthplace).slice(-7);
    const last7DriverLic = driverLicensePassport.replace(/[^A-Z0-9]/g, '').slice(-7);
    
    const combined = `${eightDob}${last5Ein}${initials}${last13Imei}${last7Birthplace}${last7DriverLic}`;
    
    return this.chunkAndFormat(combined);
  }
  
  // Helper: Extract location identifier from address
  private static extractGoogleLocation(address: string): string {
    // Look for Google Plus Code pattern (e.g., "2X57+XH")
    const plusCodeMatch = address.match(/[0-9A-Z]{4}\+[0-9A-Z]{2,}/i);
    if (plusCodeMatch) {
      return plusCodeMatch[0].toUpperCase();
    }
    
    // Check if address contains arrow notation for conversion
    const arrowMatch = address.match(/->([A-Z0-9+]+)$/i);
    if (arrowMatch) {
      return arrowMatch[1].toUpperCase();
    }
    
    // For regular addresses, create a location identifier from key components
    // Extract numbers and first letters of words to create identifier
    const words = address.toUpperCase().split(/\s+/);
    let locationId = '';
    
    // Get numbers from address (street number, zip, etc.)
    const numbers = address.match(/\d+/g) || [];
    if (numbers.length > 0) {
      locationId += numbers[0].substring(0, 4).padEnd(4, '0');
    } else {
      locationId += '0000';
    }
    
    // Get first letters of significant words (skip common words)
    const skipWords = ['ST', 'STREET', 'AVE', 'AVENUE', 'RD', 'ROAD', 'BLVD', 'BOULEVARD', 'DR', 'DRIVE'];
    for (const word of words) {
      if (word.length > 1 && !skipWords.includes(word) && locationId.length < 6) {
        locationId += word.charAt(0);
      }
    }
    
    // Ensure we have at least 6 characters
    locationId = locationId.substring(0, 6).padEnd(6, 'X');
    
    // Format as location code: XXXX+XX
    return `${locationId.substring(0, 4)}+${locationId.substring(4, 6)}`;
  }
  
  // Helper: Extract initials from full name
  private static extractInitials(fullName: string): string {
    const names = fullName.trim().split(/\s+/);
    let initials = '';
    
    if (names.length >= 1) initials += names[0].charAt(0).toUpperCase();
    if (names.length >= 2) initials += names[1].charAt(0).toUpperCase();
    if (names.length >= 3) initials += names[2].charAt(0).toUpperCase();
    else if (names.length === 2) initials += '0'; // Replace missing middle with 0
    
    return initials;
  }
  
  // Helper: Format UWA by chunking in 7s with CLX prefix
  private static chunkAndFormat(combined: string): string {
    // Ensure we have exactly 42 characters for proper 7-character chunking
    let processedString = combined.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Pad or truncate to ensure proper length for 6 chunks of 7 characters each
    if (processedString.length < 42) {
      processedString = processedString.padEnd(42, '0');
    } else if (processedString.length > 42) {
      processedString = processedString.substring(0, 42);
    }
    
    const chunks = [];
    for (let i = 0; i < processedString.length; i += 7) {
      chunks.push(processedString.slice(i, i + 7));
    }
    
    return `CLX-${chunks.join('-')}`;
  }
  
  // Validate UWA format
  static validateUWA(uwa: string): boolean {
    // Should start with CLX- and have exactly 6 chunks of 7 characters each
    const pattern = /^CLX-[A-Z0-9]{7}-[A-Z0-9]{7}-[A-Z0-9]{7}-[A-Z0-9]{7}-[A-Z0-9]{7}-[A-Z0-9]{7}$/;
    return pattern.test(uwa);
  }
  
  // Generate UWA based on entity type
  static generateUWA(entityType: string, components: UWAComponents): string {
    switch (entityType) {
      case 'physical-machine':
        return this.generatePhysicalMachineUWA(components);
      case 'virtual-machine':
        return this.generateVirtualMachineUWA(components);
      case 'business-owner':
        return this.generateBusinessUWA(components);
      case 'human-individual':
        return this.generatePersonUWA(components);
      case 'user-account':
      case 'service-account':
        return this.generatePersonUWA(components); // Use person UWA for account types
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  }
}