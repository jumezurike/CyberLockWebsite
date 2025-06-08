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
            <div className="relative max-w-4xl mx-auto">
              {/* Central Biometric Icon with Spinning Circle */}
              <div className="flex flex-col items-center mb-12">
                <div className="relative">
                  <div className="absolute inset-0 border-2 border-dashed border-blue-300 rounded-full w-32 h-32 animate-spin" style={{animationDuration: '10s'}}></div>
                  <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center">
                    <Fingerprint className="h-16 w-16 text-white" />
                  </div>
                </div>
                <div className="text-center mt-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Universal Digital Identity</h2>
                  <p className="text-gray-600 max-w-md">
                    The DNA forms an immutable, verifiable identity core that combines government-verified credentials with behavioral intelligence.
                  </p>
                </div>
              </div>

              {/* Six Sections Around the Circle */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Government Identity Verification */}
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                      <h3 className="font-semibold text-gray-800">Government Identity Verification</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Government ID Type</span>
                        <Badge className="bg-red-100 text-red-800">Critical</Badge>
                      </div>
                      <p className="text-xs text-gray-500">Driver's license, state ID, passport, or other official identification</p>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Issuing Authority</span>
                        <Badge className="bg-red-100 text-red-800">Critical</Badge>
                      </div>
                      <p className="text-xs text-gray-500">Government entity that issued the identification document</p>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID Verification Status</span>
                      </div>
                      <p className="text-xs text-gray-500">Whether the ID has been validated and confirmed</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Core Identity */}
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                      <h3 className="font-semibold text-gray-800">Core Identity</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name</span>
                        <Badge className="bg-red-100 text-red-800">Critical</Badge>
                      </div>
                      <p className="text-xs text-gray-500">Legal name as appears on official documents</p>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Identity Type</span>
                      </div>
                      <p className="text-xs text-gray-500">Human, machine, service account, or API classification</p>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Unique Identifier</span>
                        <Badge className="bg-red-100 text-red-800">Critical</Badge>
                      </div>
                      <p className="text-xs text-gray-500">Universal ID that persists across all systems</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Organizational Context */}
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <h3 className="font-semibold text-gray-800">Organizational Context</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department/Team</span>
                      </div>
                      <p className="text-xs text-gray-500">Organizational unit or functional group</p>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Role/Position</span>
                      </div>
                      <p className="text-xs text-gray-500">Job function or service purpose</p>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reporting Hierarchy</span>
                      </div>
                      <p className="text-xs text-gray-500">Management chain and responsibility structure</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Access & Entitlements */}
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <h3 className="font-semibold text-gray-800">Access & Entitlements</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Access Level</span>
                      </div>
                      <p className="text-xs text-gray-500">Privilege tier and permission scope</p>
                      <div className="flex justify-between">
                        <span className="text-gray-600">System Entitlements</span>
                      </div>
                      <p className="text-xs text-gray-500">Specific rights and access grants across systems</p>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Authentication Methods</span>
                      </div>
                      <p className="text-xs text-gray-500">MFA status and credential mechanisms</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Behavioral Patterns */}
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <h3 className="font-semibold text-gray-800">Behavioral Patterns</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Access Patterns</span>
                      </div>
                      <p className="text-xs text-gray-500">Typical login hours and behavioral baselines</p>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location Data</span>
                      </div>
                      <p className="text-xs text-gray-500">Normal physical or network access points</p>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Security Posture</span>
                      </div>
                      <p className="text-xs text-gray-500">Compliance with security policies and training</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Indicators */}
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                      <h3 className="font-semibold text-gray-800">Risk Indicators</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Classification</span>
                      </div>
                      <p className="text-xs text-gray-500">Assessment of identity risk level</p>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Anomaly Detection</span>
                      </div>
                      <p className="text-xs text-gray-500">Tracking of unusual behaviors or access patterns</p>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Credential Exposure</span>
                      </div>
                      <p className="text-xs text-gray-500">Records of potential credential compromise events</p>
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