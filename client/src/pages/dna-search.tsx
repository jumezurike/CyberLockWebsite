import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Search, Shield, AlertTriangle, CheckCircle, User, Phone, Mail, FileText, Fingerprint } from 'lucide-react';
import { Link } from 'wouter';

interface DNAProfile {
  id: string;
  uwa: string;
  fullName: string;
  email: string;
  phone: string;
  identityType: 'Human' | 'Machine' | 'API' | 'Service Account';
  governmentId: {
    type: string;
    issuingAuthority: string;
    verificationStatus: 'Verified' | 'Pending' | 'Failed';
  };
  riskClassification: 'Low' | 'Medium' | 'High' | 'Critical';
  profileImage: string;
  department: string;
  role: string;
  accessLevel: string;
  lastActivity: string;
  behavioralPatterns: {
    normalLoginHours: string;
    typicalLocations: string[];
    securityCompliance: string;
  };
}

const mockDNAProfiles: DNAProfile[] = [
  {
    id: '1',
    uwa: 'CLX-1234567-8901234-5678901-2345678-9012345-6789012',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1-555-0123',
    identityType: 'Human',
    governmentId: {
      type: 'Driver\'s License',
      issuingAuthority: 'CA DMV',
      verificationStatus: 'Verified'
    },
    riskClassification: 'Low',
    profileImage: '/api/placeholder/60/60',
    department: 'IT Security',
    role: 'Security Analyst',
    accessLevel: 'Standard',
    lastActivity: '2025-06-08 09:15:22',
    behavioralPatterns: {
      normalLoginHours: '8:00 AM - 6:00 PM',
      typicalLocations: ['San Francisco, CA', 'Remote Office'],
      securityCompliance: 'Excellent'
    }
  },
  {
    id: '2',
    uwa: 'CLX-9876543-2109876-5432109-8765432-1098765-4321098',
    fullName: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+1-555-0456',
    identityType: 'Human',
    governmentId: {
      type: 'Passport',
      issuingAuthority: 'US State Department',
      verificationStatus: 'Verified'
    },
    riskClassification: 'Medium',
    profileImage: '/api/placeholder/60/60',
    department: 'Finance',
    role: 'Financial Analyst',
    accessLevel: 'Privileged',
    lastActivity: '2025-06-08 11:30:15',
    behavioralPatterns: {
      normalLoginHours: '7:00 AM - 7:00 PM',
      typicalLocations: ['New York, NY', 'Home Office'],
      securityCompliance: 'Good'
    }
  }
];

export default function DNASearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [searchResults, setSearchResults] = useState<DNAProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<DNAProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    
    // Simulate API search
    setTimeout(() => {
      const results = mockDNAProfiles.filter(profile => {
        const query = searchQuery.toLowerCase();
        switch (searchType) {
          case 'name':
            return profile.fullName.toLowerCase().includes(query);
          case 'email':
            return profile.email.toLowerCase().includes(query);
          case 'phone':
            return profile.phone.includes(query);
          default:
            return false;
        }
      });
      
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'Verified': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Pending': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'Failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="p-6">
        <div className="mb-6">
          <Link href="/identity-management" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Identity Management
          </Link>
          
          <h1 className="text-3xl font-bold mt-2">UIVS & Universal Digital Identity</h1>
          <p className="text-gray-600 mt-1">
            Search and verify Universal Wallet Addresses using the Data Nuclear Aggregate (DNA) system
          </p>
        </div>

        {/* UIVS Explanation */}
        <Card className="mb-8 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="p-12">
            <div className="relative w-full max-w-7xl mx-auto">
              {/* Title and description at top */}
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Universal Digital Identity</h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  The DNA forms an immutable, verifiable identity core that combines government-verified credentials with behavioral intelligence.
                </p>
              </div>

              {/* Central Layout with sections positioned around circle */}
              <div className="relative h-[700px] w-full">
                {/* Central biometric icon with large spinning circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative w-[600px] h-[600px]">
                    {/* Extra large spinning dashed circle that cuts across the cards */}
                    <div className="absolute inset-0 w-[600px] h-[600px] border-4 border-dashed border-gray-400 rounded-full animate-spin" style={{animationDuration: '12s'}}></div>
                    
                    {/* Central biometric icon */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-lg z-10">
                        <Fingerprint className="h-14 w-14 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Government Identity Verification - Top Left */}
                <div className="absolute top-0 left-0 w-80">
                  <Card className="bg-white shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <h3 className="font-semibold text-gray-800 text-sm">Government Identity Verification</h3>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Government ID Type</span>
                          <Badge className="bg-red-100 text-red-800 text-xs">Critical</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Driver's license, state ID, passport, or other official identification</p>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Issuing Authority</span>
                          <Badge className="bg-red-100 text-red-800 text-xs">Critical</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Government entity that issued the identification document</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Core Identity - Top Right */}
                <div className="absolute top-0 right-0 w-80">
                  <Card className="bg-white shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                        <h3 className="font-semibold text-gray-800 text-sm">Core Identity</h3>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Full Name</span>
                          <Badge className="bg-red-100 text-red-800 text-xs">Critical</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Legal name as appears on official documents</p>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Unique Identifier</span>
                          <Badge className="bg-red-100 text-red-800 text-xs">Critical</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Universal ID that persists across all systems</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Organizational Context - Middle Right */}
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-80">
                  <Card className="bg-white shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <h3 className="font-semibold text-gray-800 text-sm">Organizational Context</h3>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Department/Team</span>
                        </div>
                        <p className="text-xs text-gray-500">Organizational unit or functional group</p>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Role/Position</span>
                        </div>
                        <p className="text-xs text-gray-500">Job function or service purpose</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Access & Entitlements - Middle Left */}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-80">
                  <Card className="bg-white shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <h3 className="font-semibold text-gray-800 text-sm">Access & Entitlements</h3>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Access Level</span>
                        </div>
                        <p className="text-xs text-gray-500">Privilege tier and permission scope</p>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Authentication Methods</span>
                        </div>
                        <p className="text-xs text-gray-500">MFA status and credential mechanisms</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Behavioral Patterns - Bottom Left */}
                <div className="absolute bottom-0 left-0 w-80">
                  <Card className="bg-white shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                        <h3 className="font-semibold text-gray-800 text-sm">Behavioral Patterns</h3>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Access Patterns</span>
                        </div>
                        <p className="text-xs text-gray-500">Typical login hours and behavioral baselines</p>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Security Posture</span>
                        </div>
                        <p className="text-xs text-gray-500">Compliance with security policies and training</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Risk Indicators - Bottom Right */}
                <div className="absolute bottom-0 right-0 w-80">
                  <Card className="bg-white shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <h3 className="font-semibold text-gray-800 text-sm">Risk Indicators</h3>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Risk Classification</span>
                        </div>
                        <p className="text-xs text-gray-500">Assessment of identity risk level</p>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Anomaly Detection</span>
                        </div>
                        <p className="text-xs text-gray-500">Tracking of unusual behaviors or access patterns</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Additional Information at bottom */}
              <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Continuous Identity Verification</h3>
                    <p className="text-sm text-gray-600">
                      The DNA continuously verifies all aspects of identity through a multi-layered approach. Government-issued ID creates the strong foundation that anchors the digital identity to a real-world, verifiable entity, enabling powerful accountability throughout the system.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Color-Coded Non-Fungible Image Verification</h3>
                    <div className="text-sm text-gray-600 space-y-3">
                      <p>
                        <strong>Advanced Security Feature:</strong> All identity profiles must include a color-coded non-fungible profile image that contains hidden encrypted data using steganography.
                      </p>
                      <p>
                        This creates a cryptographically unique visual identifier that cannot be duplicated or transferred between identities.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Interface */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              DNA Search Interface
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="searchType">Search By</Label>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Full Name</SelectItem>
                    <SelectItem value="email">Email Address</SelectItem>
                    <SelectItem value="phone">Phone Number</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="searchQuery">Search Query</Label>
                <Input
                  id="searchQuery"
                  placeholder={`Enter ${searchType === 'name' ? 'full name' : searchType === 'email' ? 'email address' : 'phone number'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch} 
                  disabled={!searchQuery || isSearching}
                  className="w-full"
                >
                  {isSearching ? 'Searching...' : 'Search DNA'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search Results ({searchResults.length} found)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchResults.map((profile) => (
                  <div 
                    key={profile.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedProfile(profile)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{profile.fullName}</h3>
                          <p className="text-sm text-gray-600">{profile.email}</p>
                          <p className="text-sm text-gray-600">{profile.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRiskColor(profile.riskClassification)}>
                          {profile.riskClassification} Risk
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {getVerificationIcon(profile.governmentId.verificationStatus)}
                          <span className="text-sm">{profile.governmentId.verificationStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Profile View */}
        {selectedProfile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                DNA Profile: {selectedProfile.fullName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Core Identity */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Core Identity</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">UWA:</span>
                        <span className="font-mono text-sm">{selectedProfile.uwa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-semibold">{selectedProfile.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Identity Type:</span>
                        <Badge variant="outline">{selectedProfile.identityType}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Classification:</span>
                        <Badge className={getRiskColor(selectedProfile.riskClassification)}>
                          {selectedProfile.riskClassification}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Government Verification */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Government Identity Verification</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID Type:</span>
                        <span>{selectedProfile.governmentId.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Issuing Authority:</span>
                        <span>{selectedProfile.governmentId.issuingAuthority}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Verification Status:</span>
                        <div className="flex items-center space-x-2">
                          {getVerificationIcon(selectedProfile.governmentId.verificationStatus)}
                          <span>{selectedProfile.governmentId.verificationStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organizational & Behavioral */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Organizational Context</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span>{selectedProfile.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Role/Position:</span>
                        <span>{selectedProfile.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Access Level:</span>
                        <Badge variant="outline">{selectedProfile.accessLevel}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Activity:</span>
                        <span className="text-sm">{selectedProfile.lastActivity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Behavioral Patterns */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Behavioral Patterns</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Normal Login Hours:</span>
                        <span className="text-sm">{selectedProfile.behavioralPatterns.normalLoginHours}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Typical Locations:</span>
                        <span className="text-sm">{selectedProfile.behavioralPatterns.typicalLocations.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Security Compliance:</span>
                        <Badge variant="outline">{selectedProfile.behavioralPatterns.securityCompliance}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>{selectedProfile.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{selectedProfile.phone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}