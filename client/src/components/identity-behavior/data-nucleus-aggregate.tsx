import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fingerprint, Shield, Database, UserCheck, AlertCircle, Key, Building, Calendar, Clock, Lock } from 'lucide-react';

interface DNALayerProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  attributes: {
    name: string;
    description: string;
    criticalForIdentification?: boolean;
  }[];
}

const DNALayer: React.FC<DNALayerProps> = ({ title, icon, color, attributes }) => {
  return (
    <div className={`border rounded-lg p-4 ${color}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold text-sm md:text-base">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {attributes.map((attr, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            <div className="w-3 h-3 rounded-full mt-1 bg-gray-300 flex-shrink-0" />
            <div>
              <span className="font-medium">{attr.name}</span>
              {attr.criticalForIdentification && (
                <Badge className="ml-2 bg-red-500 text-white text-xs">Critical</Badge>
              )}
              <p className="text-xs text-gray-600">{attr.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DataNucleusAggregate() {
  const layers: DNALayerProps[] = [
    {
      title: "Government Identity Verification",
      icon: <Shield className="h-5 w-5 text-red-600" />,
      color: "bg-red-50 border-red-200",
      attributes: [
        { 
          name: "Government ID Type", 
          description: "Driver's license, state ID, passport, or other official identification",
          criticalForIdentification: true
        },
        { 
          name: "Issuing Authority", 
          description: "Government entity that issued the identification document",
          criticalForIdentification: true
        },
        { 
          name: "ID Verification Status", 
          description: "Whether the ID has been validated and confirmed"
        }
      ]
    },
    {
      title: "Core Identity",
      icon: <Fingerprint className="h-5 w-5 text-indigo-600" />,
      color: "bg-indigo-50 border-indigo-200",
      attributes: [
        { 
          name: "Full Name", 
          description: "Legal name as appears on official documents",
          criticalForIdentification: true
        },
        { 
          name: "Identity Type", 
          description: "Human, machine, service account, or API classification" 
        },
        { 
          name: "Unique Identifier", 
          description: "Universal ID that persists across all systems",
          criticalForIdentification: true
        }
      ]
    },
    {
      title: "Organizational Context",
      icon: <Building className="h-5 w-5 text-blue-600" />,
      color: "bg-blue-50 border-blue-200",
      attributes: [
        { 
          name: "Department/Team", 
          description: "Organizational unit or functional group" 
        },
        { 
          name: "Role/Position", 
          description: "Job function or service purpose" 
        },
        { 
          name: "Reporting Hierarchy", 
          description: "Management chain and responsibility structure" 
        }
      ]
    },
    {
      title: "Access & Entitlements",
      icon: <Key className="h-5 w-5 text-purple-600" />,
      color: "bg-purple-50 border-purple-200",
      attributes: [
        { 
          name: "Access Level", 
          description: "Privilege tier and permission scope" 
        },
        { 
          name: "System Entitlements", 
          description: "Specific rights and access grants across systems" 
        },
        { 
          name: "Authentication Methods", 
          description: "MFA status and credential mechanisms" 
        }
      ]
    },
    {
      title: "Behavioral Patterns",
      icon: <UserCheck className="h-5 w-5 text-green-600" />,
      color: "bg-green-50 border-green-200",
      attributes: [
        { 
          name: "Access Patterns", 
          description: "Typical login hours and behavioral baselines" 
        },
        { 
          name: "Location Data", 
          description: "Normal physical or network access points" 
        },
        { 
          name: "Security Posture", 
          description: "Compliance with security policies and training" 
        }
      ]
    },
    {
      title: "Risk Indicators",
      icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
      color: "bg-amber-50 border-amber-200",
      attributes: [
        { 
          name: "Risk Classification", 
          description: "Assessment of identity risk level" 
        },
        { 
          name: "Anomaly Detection", 
          description: "Tracking of unusual behaviors or access patterns" 
        },
        { 
          name: "Credential Exposure", 
          description: "Records of potential credential compromise events" 
        }
      ]
    },
    {
      title: "Lifecycle Management",
      icon: <Calendar className="h-5 w-5 text-teal-600" />,
      color: "bg-teal-50 border-teal-200",
      attributes: [
        { 
          name: "Creation & Onboarding", 
          description: "Initial provisioning and account creation" 
        },
        { 
          name: "Credential Rotation", 
          description: "Password changes and certificate renewals" 
        },
        { 
          name: "Deprovisioning Process", 
          description: "Account deactivation and offboarding workflows" 
        }
      ]
    }
  ];

  return (
    <Card className="mb-8">
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              Data Nuclear Aggregate (DNA)
            </CardTitle>
            <CardDescription>
              The comprehensive aggregation of identity data forming a complete digital profile
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-blue-500 text-blue-700 uppercase px-3 py-1 md:self-start">
            <Lock className="h-3.5 w-3.5 mr-1" /> DNA Protected
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-full max-w-3xl">
            {/* Center nucleus */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                  <Fingerprint className="h-10 w-10 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="w-full aspect-square opacity-20 absolute left-0 top-0">
              <div className="w-full h-full rounded-full border-4 border-dashed border-gray-400 animate-spin-slow"></div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-xl font-bold text-gray-800">Universal Digital Identity</h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              The DNA forms an immutable, verifiable identity core that combines government-verified credentials with behavioral intelligence
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {layers.map((layer, index) => (
            <DNALayer key={index} {...layer} />
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-indigo-700 mb-1">Continuous Identity Verification</h3>
              <p className="text-sm text-gray-700">
                The DNA continuously verifies all aspects of identity through a multi-layered approach. Government-issued ID creates the strong foundation that anchors the digital identity to a real-world, verifiable entity, enabling powerful accountability throughout the system.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}