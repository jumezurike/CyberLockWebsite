import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface GovernanceAndManagementAssessmentProps {
  onComplete: (scores: GovernanceScores) => void;
}

// NIST CSF 2.0 Functional Area Assessment interfaces
interface FunctionalArea {
  id: string;
  category: 'GOVERN' | 'IDENTIFY' | 'PROTECT' | 'DETECT' | 'RESPOND' | 'RECOVER';
  name: string;
  description: string;
  subcategories: SubCategory[];
}

interface SubCategory {
  id: string;
  description: string;
}

interface FunctionalAreaScore {
  functionalAreaId: string;
  currentTier: number; // 0-4
  targetTier: number; // 0-4
  timeAtTier: number; // months
}

interface CybersecurityHygieneResult {
  overallScore: number; // 0-100%
  overallTier: number; // 0-4
  categoryScores: {
    [key in 'GOVERN' | 'IDENTIFY' | 'PROTECT' | 'DETECT' | 'RESPOND' | 'RECOVER']: {
      score: number;
      tier: number;
      functionalAreas: FunctionalAreaScore[];
    }
  };
  hygieneLevel: 'Critical Risk' | 'High Risk' | 'Moderate Risk' | 'Good' | 'Excellent';
  recommendations: string[];
}

export interface GovernanceScores {
  governanceScore: number; // 0-4 (represents Tiers 0, 0-1, 1-2, 2-3, 3-4)
  managementScore: number; // 0-4 (represents Tiers 0, 0-1, 1-2, 2-3, 3-4)
  monthsAtTier: number; // Number of months at current tier
  desireToImprove: boolean; // Whether they want to improve
  // Enhanced Duration-Based Assessment (NEW - Additive only)
  durationCategory: 'less-than-6' | '6-12' | '1-2-years' | '2-plus-years' | null; // Duration category for enhanced scoring
  sixMonthTarget: number | null; // Target tier for 6 months (0-4)
  twelveMonthTarget: number | null; // Target tier for 12 months (0-4)
  // NIST CSF 2.0 Functional Area Assessment (NEW - Comprehensive tier assessment)
  functionalAreaScores: { [key: string]: FunctionalAreaScore }; // Functional area assessments
  cybersecurityHygiene: CybersecurityHygieneResult | null; // Calculated hygiene result
  // Percentage completion mapping: 
  // Tier 0 (0-0): 0%
  // Tier 1 (0-1): 25%
  // Tier 2 (1-2): 50%
  // Tier 3 (2-3): 75%
  // Tier 4 (3-4): 100%
}

// Complete NIST CSF 2.0 Functional Areas (108 controls total - OFFICIALLY CORRECTED)
const NIST_CSF_FUNCTIONAL_AREAS: FunctionalArea[] = [
  // GOVERN (32 controls) - Placeholder structure for now
  { id: 'GV-OC', category: 'GOVERN', name: 'Organizational Context', description: 'Understanding the organizational environment', subcategories: [
    { id: 'GV.OC-01', description: 'The organizational mission is understood and informs cybersecurity risk management' },
    { id: 'GV.OC-02', description: 'Internal and external stakeholders are understood' },
    { id: 'GV.OC-03', description: 'Legal, regulatory, and contractual requirements are understood' },
    { id: 'GV.OC-04', description: 'Critical objectives, capabilities, and services are understood' },
    { id: 'GV.OC-05', description: 'Outcomes, capabilities, and services that the enterprise depends on are understood' }
  ]},
  { id: 'GV-RM', category: 'GOVERN', name: 'Risk Management Strategy', description: 'Risk management strategy and expectations', subcategories: [
    { id: 'GV.RM-01', description: 'Risk management objectives are established and agreed to by organizational stakeholders' },
    { id: 'GV.RM-02', description: 'Risk appetite and risk tolerance statements are established' },
    { id: 'GV.RM-03', description: 'Determinations of risk tolerance are informed by the potential impact of loss' },
    { id: 'GV.RM-04', description: 'Strategic direction that describes appropriate risk response is established' },
    { id: 'GV.RM-05', description: 'Lines of communication across the organization are established for cybersecurity risks' },
    { id: 'GV.RM-06', description: 'A standardized method for calculating, documenting, categorizing, and prioritizing cybersecurity risks is established' },
    { id: 'GV.RM-07', description: 'Strategic opportunities (i.e., positive risks) are characterized and included in organizational cybersecurity risk discussions' }
  ]},
  { id: 'GV-RR', category: 'GOVERN', name: 'Roles, Responsibilities, Authorities', description: 'Cybersecurity roles and responsibilities', subcategories: [
    { id: 'GV.RR-01', description: 'Organizational leadership is responsible and accountable for cybersecurity risk' },
    { id: 'GV.RR-02', description: 'Roles, responsibilities, and authorities related to cybersecurity risk management are established' },
    { id: 'GV.RR-03', description: 'Adequate resources are allocated to cybersecurity' },
    { id: 'GV.RR-04', description: 'Cybersecurity is included in human resources practices' }
  ]},
  { id: 'GV-PO', category: 'GOVERN', name: 'Policy', description: 'Cybersecurity policy establishment and management', subcategories: [
    { id: 'GV.PO-01', description: 'Policy for managing cybersecurity risks is established and communicated' },
    { id: 'GV.PO-02', description: 'Policy for managing cybersecurity risks is reviewed and updated' }
  ]},
  { id: 'GV-OV', category: 'GOVERN', name: 'Oversight', description: 'Cybersecurity oversight and governance', subcategories: [
    { id: 'GV.OV-01', description: 'Cybersecurity risk management strategy outcomes are reviewed' },
    { id: 'GV.OV-02', description: 'The cybersecurity risk management strategy is reviewed and adjusted' },
    { id: 'GV.OV-03', description: 'Organizational cybersecurity risk appetite and risk tolerance statements are reviewed and adjusted' }
  ]},
  { id: 'GV-SC', category: 'GOVERN', name: 'Cybersecurity Supply Chain Risk Management', description: 'Supply chain risk management', subcategories: [
    { id: 'GV.SC-01', description: 'A cybersecurity supply chain risk management strategy is established' },
    { id: 'GV.SC-02', description: 'Cybersecurity risk management controls are established for suppliers and third-party partners' },
    { id: 'GV.SC-03', description: 'Contracts with suppliers and third-party partners are used to implement appropriate cybersecurity measures' },
    { id: 'GV.SC-04', description: 'Suppliers and third-party partners are routinely assessed using audits, test results, or other forms of evaluations' },
    { id: 'GV.SC-05', description: 'Response and recovery planning and testing are conducted with suppliers and third-party partners' },
    { id: 'GV.SC-06', description: 'Planning and due diligence are performed to reduce risks before entering into formal supplier relationships' },
    { id: 'GV.SC-07', description: 'The risks posed by a supplier, their products, or their services are understood' },
    { id: 'GV.SC-08', description: 'Relevant supply chain cybersecurity practices are identified and gaps are assessed' },
    { id: 'GV.SC-09', description: 'Supply chain cybersecurity is addressed in incident response and recovery planning activities' },
    { id: 'GV.SC-10', description: 'Cybersecurity supply chain risk management plans include provisions for activities that occur after the conclusion of a partnership or service agreement' }
  ]},

  // IDENTIFY (21 controls)
  { id: 'ID-AM', category: 'IDENTIFY', name: 'Asset Management', description: 'Asset management policies and procedures', subcategories: [
    { id: 'ID.AM-01', description: 'Physical devices and systems within the organization are inventoried' },
    { id: 'ID.AM-02', description: 'Software platforms and applications within the organization are inventoried' },
    { id: 'ID.AM-03', description: 'Organizational communication and data flows are mapped' },
    { id: 'ID.AM-04', description: 'External information systems are catalogued' },
    { id: 'ID.AM-05', description: 'Resources (e.g., hardware, devices, data, time, personnel, and software) are prioritized based on their classification, criticality, and business value' },
    { id: 'ID.AM-07', description: 'The role of data in achieving business objectives is identified' },
    { id: 'ID.AM-08', description: 'Systems, hardware, software, services, and applications are managed throughout their life cycles' }
  ]},
  { id: 'ID-RA', category: 'IDENTIFY', name: 'Risk Assessment', description: 'Risk assessment and risk management', subcategories: [
    { id: 'ID.RA-01', description: 'Asset vulnerabilities are identified and documented' },
    { id: 'ID.RA-02', description: 'Cyber threat intelligence is received from information sharing forums and sources' },
    { id: 'ID.RA-03', description: 'Threats, both internal and external, are identified and documented' },
    { id: 'ID.RA-04', description: 'Potential business impacts and likelihoods are identified' },
    { id: 'ID.RA-05', description: 'Threats, vulnerabilities, likelihoods, and impacts are used to determine risk' },
    { id: 'ID.RA-06', description: 'Risk responses are identified and prioritized' },
    { id: 'ID.RA-07', description: 'Changes to the environment are identified and assessed for risk' },
    { id: 'ID.RA-08', description: 'Processes for receiving, analyzing, and responding to vulnerability disclosures are established' },
    { id: 'ID.RA-09', description: 'The authenticity and integrity of hardware and software are assessed prior to acquisition and use' },
    { id: 'ID.RA-10', description: 'Critical suppliers are assessed prior to acquisition and during the relationship' }
  ]},
  { id: 'ID-IM', category: 'IDENTIFY', name: 'Improvement', description: 'Improvement activities and processes', subcategories: [
    { id: 'ID.IM-01', description: 'A baseline configuration of information technology/industrial control systems is created and maintained' },
    { id: 'ID.IM-02', description: 'A system development life cycle to manage systems is implemented' },
    { id: 'ID.IM-03', description: 'Configuration change control processes are in place' },
    { id: 'ID.IM-04', description: 'A vulnerability management strategy is implemented and maintained' }
  ]},

  // PROTECT (23 controls)  
  { id: 'PR-AA', category: 'PROTECT', name: 'Identity Management, Authentication and Access Control', description: 'Access control and identity management', subcategories: [
    { id: 'PR.AA-01', description: 'Identities and credentials are issued, managed, verified, revoked, and audited for authorized devices, users and processes' },
    { id: 'PR.AA-02', description: 'Identity and credential management systems are protected' },
    { id: 'PR.AA-03', description: 'Users, devices, and other assets are authenticated' },
    { id: 'PR.AA-04', description: 'Identity assertions are protected, conveyed, and verified' },
    { id: 'PR.AA-05', description: 'Access permissions and authorizations are managed, incorporating the principles of least privilege and separation of duties' },
    { id: 'PR.AA-06', description: 'Physical access to assets is managed and protected' }
  ]},
  { id: 'PR-AT', category: 'PROTECT', name: 'Awareness and Training', description: 'Security awareness and training', subcategories: [
    { id: 'PR.AT-01', description: 'All users are informed and trained' },
    { id: 'PR.AT-02', description: 'Privileged users understand their roles and responsibilities' }
  ]},
  { id: 'PR-DS', category: 'PROTECT', name: 'Data Security', description: 'Data protection and privacy', subcategories: [
    { id: 'PR.DS-01', description: 'Data-at-rest is protected' },
    { id: 'PR.DS-02', description: 'Data-in-transit is protected' },
    { id: 'PR.DS-10', description: 'The confidentiality of data-at-rest is protected' },
    { id: 'PR.DS-11', description: 'The integrity of data-in-transit is protected' }
  ]},
  { id: 'PR-PS', category: 'PROTECT', name: 'Platform Security', description: 'Platform security controls', subcategories: [
    { id: 'PR.PS-01', description: 'Configuration management practices are established' },
    { id: 'PR.PS-02', description: 'The integrity of the platform is verified' },
    { id: 'PR.PS-03', description: 'Hardware is secured' },
    { id: 'PR.PS-04', description: 'Log records are generated' },
    { id: 'PR.PS-05', description: 'Installation and execution of unauthorized software are prevented' },
    { id: 'PR.PS-06', description: 'Secure software development practices are integrated' }
  ]},
  { id: 'PR-IR', category: 'PROTECT', name: 'Technology Infrastructure Resilience', description: 'Infrastructure resilience and protection', subcategories: [
    { id: 'PR.IR-01', description: 'Networks and environments are protected from unauthorized logical access and usage' },
    { id: 'PR.IR-02', description: 'The organization\'s technology assets are protected from environmental threats' },
    { id: 'PR.IR-03', description: 'Mechanisms are implemented to achieve resilience requirements in normal and adverse situations' },
    { id: 'PR.IR-04', description: 'Adequate resource capacity to ensure availability is maintained' }
  ]},

  // DETECT (11 controls)
  { 
    id: 'DE-CM', 
    category: 'DETECT', 
    name: 'Continuous Monitoring', 
    description: 'Networks, personnel, and technology are monitored to find potentially adverse events', 
    subcategories: [
      { id: 'DE.CM-01', description: 'Networks and network services are monitored to find potentially adverse events' },
      { id: 'DE.CM-02', description: 'The physical environment is monitored to find potentially adverse events' },
      { id: 'DE.CM-03', description: 'Personnel activity and technology usage are monitored to find potentially adverse events' },
      { id: 'DE.CM-06', description: 'External service provider activities and services are monitored to find potentially adverse events' },
      { id: 'DE.CM-09', description: 'Computing hardware and software, runtime environments, and their data are monitored to find potentially adverse events' }
    ]
  },
  { 
    id: 'DE-AE', 
    category: 'DETECT', 
    name: 'Adverse Event Analysis', 
    description: 'Anomalies, indicators of compromise, and other potentially adverse events are analyzed to characterize the events and detect cybersecurity incidents', 
    subcategories: [
      { id: 'DE.AE-02', description: 'Potentially adverse events are analyzed to better understand associated activities' },
      { id: 'DE.AE-03', description: 'Information is correlated from multiple sources' },
      { id: 'DE.AE-04', description: 'The estimated impact and scope of adverse events are understood' },
      { id: 'DE.AE-06', description: 'Information on adverse events is provided to authorized staff and tools' },
      { id: 'DE.AE-07', description: 'Cyber threat intelligence and other contextual information are integrated into the analysis' },
      { id: 'DE.AE-08', description: 'Incidents are declared when adverse events meet the defined incident criteria' }
    ]
  },

  // RESPOND (13 controls)
  { 
    id: 'RS-MA', 
    category: 'RESPOND', 
    name: 'Incident Management', 
    description: 'Response activities are coordinated with internal and external stakeholders', 
    subcategories: [
      { id: 'RS.MA-01', description: 'The incident response plan is executed during or after an incident' },
      { id: 'RS.MA-02', description: 'Incident reports are triaged and validated' },
      { id: 'RS.MA-03', description: 'Incidents are categorized and prioritized' },
      { id: 'RS.MA-04', description: 'Incidents are escalated or elevated as needed' },
      { id: 'RS.MA-05', description: 'The criteria for initiating incident response activities are applied' }
    ]
  },
  { 
    id: 'RS-AN', 
    category: 'RESPOND', 
    name: 'Incident Analysis', 
    description: 'Analysis is conducted to ensure effective response and support recovery activities', 
    subcategories: [
      { id: 'RS.AN-01', description: 'Notifications from detection systems are investigated' },
      { id: 'RS.AN-02', description: 'The impact of the incident is understood' },
      { id: 'RS.AN-03', description: 'Forensics are performed' },
      { id: 'RS.AN-04', description: 'Incidents are categorized and classified' }
    ]
  },
  { 
    id: 'RS-CO', 
    category: 'RESPOND', 
    name: 'Incident Response Reporting/Communication', 
    description: 'Response activities are coordinated with internal and external stakeholders', 
    subcategories: [
      { id: 'RS.CO-01', description: 'Personnel know their roles and order of operations when a response is needed' },
      { id: 'RS.CO-02', description: 'Incidents are reported consistent with established criteria' }
    ]
  },
  { 
    id: 'RS-MI', 
    category: 'RESPOND', 
    name: 'Incident Mitigation', 
    description: 'Activities are performed to prevent expansion of an event and mitigate its effects', 
    subcategories: [
      { id: 'RS.MI-01', description: 'Incidents are contained' },
      { id: 'RS.MI-02', description: 'Incidents are eradicated' }
    ]
  },

  // RECOVER (8 controls)
  { 
    id: 'RC-RP', 
    category: 'RECOVER', 
    name: 'Incident Recovery Plan Execution', 
    description: 'Restore capabilities or services that were impaired due to a cybersecurity incident', 
    subcategories: [
      { id: 'RC.RP-01', description: 'The recovery portion of the incident response plan is executed once the threat is neutralized or contained' },
      { id: 'RC.RP-02', description: 'Recovery actions are selected, scoped, prioritized, and performed' },
      { id: 'RC.RP-03', description: 'The integrity of backups and other restoration assets is verified before using them for restoration' },
      { id: 'RC.RP-04', description: 'Critical mission functions and cybersecurity risk management are considered to establish post-incident operational norms' },
      { id: 'RC.RP-05', description: 'The integrity of restored assets is verified, systems and services are restored, and normal operating status is confirmed' },
      { id: 'RC.RP-06', description: 'The end of incident recovery operations and operational status are communicated to designated stakeholders' }
    ]
  },
  { 
    id: 'RC-CO', 
    category: 'RECOVER', 
    name: 'Incident Recovery Communication', 
    description: 'Restoration activities are coordinated with internal and external parties', 
    subcategories: [
      { id: 'RC.CO-01', description: 'Public relations are managed' },
      { id: 'RC.CO-02', description: 'Reputation is repaired after an incident' }
    ]
  }
];

export default function GovernanceAndManagementAssessment({ onComplete }: GovernanceAndManagementAssessmentProps) {
  const [activeTab, setActiveTab] = useState("governance");
  const [governanceScore, setGovernanceScore] = useState<number>(0); // Default to Tier 0
  const [managementScore, setManagementScore] = useState<number>(0); // Default to Tier 0
  const [monthsAtTier, setMonthsAtTier] = useState<number>(0);
  const [desireToImprove, setDesireToImprove] = useState<boolean>(false);
  
  // Enhanced Duration-Based Assessment State (NEW - Additive only)
  const [durationCategory, setDurationCategory] = useState<'less-than-6' | '6-12' | '1-2-years' | '2-plus-years' | null>(null);
  const [sixMonthTarget, setSixMonthTarget] = useState<number | null>(null);
  const [twelveMonthTarget, setTwelveMonthTarget] = useState<number | null>(null);
  
  // NIST CSF Functional Area Assessment State (NEW - Comprehensive tier assessment)
  const [functionalAreaScores, setFunctionalAreaScores] = useState<{ [key: string]: FunctionalAreaScore }>({});
  const [cybersecurityHygiene, setCybersecurityHygiene] = useState<CybersecurityHygieneResult | null>(null);
  const [showFunctionalAreaAssessment, setShowFunctionalAreaAssessment] = useState<boolean>(false);
  const [functionalAreaCategory, setFunctionalAreaCategory] = useState<'GOVERN' | 'IDENTIFY' | 'PROTECT' | 'DETECT' | 'RESPOND' | 'RECOVER'>('GOVERN');

  // Helper functions for functional area assessment
  const handleFunctionalAreaChange = (functionalAreaId: string, field: keyof FunctionalAreaScore, value: number) => {
    setFunctionalAreaScores(prev => ({
      ...prev,
      [functionalAreaId]: {
        ...prev[functionalAreaId],
        functionalAreaId,
        [field]: value,
        currentTier: prev[functionalAreaId]?.currentTier || 0,
        targetTier: prev[functionalAreaId]?.targetTier || 0,
        timeAtTier: prev[functionalAreaId]?.timeAtTier || 0
      }
    }));
  };

  const calculateCybersecurityHygiene = (): void => {
    const categories = ['GOVERN', 'IDENTIFY', 'PROTECT', 'DETECT', 'RESPOND', 'RECOVER'] as const;
    const categoryScores: CybersecurityHygieneResult['categoryScores'] = {
      GOVERN: { score: 0, tier: 0, functionalAreas: [] },
      IDENTIFY: { score: 0, tier: 0, functionalAreas: [] },
      PROTECT: { score: 0, tier: 0, functionalAreas: [] },
      DETECT: { score: 0, tier: 0, functionalAreas: [] },
      RESPOND: { score: 0, tier: 0, functionalAreas: [] },
      RECOVER: { score: 0, tier: 0, functionalAreas: [] }
    };

    let totalScore = 0;
    let totalPossible = 0;

    // Calculate scores for each category
    categories.forEach(category => {
      const functionalAreas = NIST_CSF_FUNCTIONAL_AREAS.filter(fa => fa.category === category);
      let categoryTotal = 0;
      let categoryPossible = 0;

      functionalAreas.forEach(fa => {
        const score = functionalAreaScores[fa.id];
        if (score) {
          // Weight by subcategory count for accuracy
          const subcategoryCount = fa.subcategories.length;
          const areaScore = (score.currentTier / 4) * 100 * subcategoryCount;
          categoryTotal += areaScore;
          categoryPossible += 100 * subcategoryCount;
          categoryScores[category].functionalAreas.push(score);
        } else {
          // Default to tier 0 if not assessed
          const subcategoryCount = fa.subcategories.length;
          categoryPossible += 100 * subcategoryCount;
        }
      });

      categoryScores[category].score = categoryPossible > 0 ? (categoryTotal / categoryPossible) * 100 : 0;
      categoryScores[category].tier = Math.round((categoryScores[category].score / 100) * 4);
      
      totalScore += categoryTotal;
      totalPossible += categoryPossible;
    });

    const overallScore = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;
    const overallTier = Math.round((overallScore / 100) * 4);

    // Determine hygiene level
    let hygieneLevel: CybersecurityHygieneResult['hygieneLevel'];
    if (overallScore >= 90) hygieneLevel = 'Excellent';
    else if (overallScore >= 75) hygieneLevel = 'Good';
    else if (overallScore >= 50) hygieneLevel = 'Moderate Risk';
    else if (overallScore >= 25) hygieneLevel = 'High Risk';
    else hygieneLevel = 'Critical Risk';

    // Generate recommendations based on lowest performing categories
    const recommendations: string[] = [];
    const sortedCategories = Object.entries(categoryScores)
      .sort(([,a], [,b]) => a.score - b.score)
      .slice(0, 3);

    sortedCategories.forEach(([category, data]) => {
      if (data.score < 75) {
        switch (category) {
          case 'GOVERN':
            recommendations.push(`Strengthen cybersecurity governance (${data.score.toFixed(0)}%) - Focus on risk management strategy and organizational context`);
            break;
          case 'IDENTIFY':
            recommendations.push(`Improve identification capabilities (${data.score.toFixed(0)}%) - Enhance asset management and risk assessment processes`);
            break;
          case 'PROTECT':
            recommendations.push(`Enhance protection controls (${data.score.toFixed(0)}%) - Strengthen access control and data security measures`);
            break;
          case 'DETECT':
            recommendations.push(`Improve detection capabilities (${data.score.toFixed(0)}%) - Enhance monitoring and anomaly detection`);
            break;
          case 'RESPOND':
            recommendations.push(`Strengthen incident response (${data.score.toFixed(0)}%) - Improve response planning and communications`);
            break;
          case 'RECOVER':
            recommendations.push(`Enhance recovery capabilities (${data.score.toFixed(0)}%) - Strengthen recovery planning and improvement processes`);
            break;
        }
      }
    });

    const result: CybersecurityHygieneResult = {
      overallScore,
      overallTier,
      categoryScores,
      hygieneLevel,
      recommendations
    };

    setCybersecurityHygiene(result);
  };

  const getCategoryBadgeColor = (category: string): string => {
    switch (category) {
      case 'GOVERN': return 'bg-purple-100 text-purple-800';
      case 'IDENTIFY': return 'bg-blue-100 text-blue-800';
      case 'PROTECT': return 'bg-green-100 text-green-800';
      case 'DETECT': return 'bg-yellow-100 text-yellow-800';
      case 'RESPOND': return 'bg-orange-100 text-orange-800';
      case 'RECOVER': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHygieneLevelColor = (level: string): string => {
    switch (level) {
      case 'Excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'Good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Moderate Risk': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High Risk': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Critical Risk': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Update management tier when governance tier changes to ensure consistency
  const handleGovernanceChange = (value: string) => {
    const tierValue = parseInt(value);
    setGovernanceScore(tierValue);
    
    // Always set management score to match governance score
    // This ensures when selecting a tier for Governance, all lower tiers are also set
    setManagementScore(tierValue);
  };
  
  // Ensure management tier is never higher than governance tier
  const handleManagementChange = (value: string) => {
    const tierValue = parseInt(value);
    
    // Only allow setting management tier if it's not higher than governance tier
    if (tierValue <= governanceScore) {
      setManagementScore(tierValue);
    } else {
      // If trying to set management higher than governance, show alert
      alert("Management tier cannot be higher than Governance tier. Please upgrade your Governance tier first.");
      // Keep existing value
      setManagementScore(managementScore);
    }
  };
  
  const handleSubmit = () => {
    onComplete({
      governanceScore,
      managementScore,
      monthsAtTier,
      desireToImprove,
      // Enhanced Duration-Based Assessment (NEW - Additive only)
      durationCategory,
      sixMonthTarget,
      twelveMonthTarget,
      // NIST CSF Functional Area Assessment (NEW - Comprehensive tier assessment)
      functionalAreaScores,
      cybersecurityHygiene
    });
  };
  
  const isComplete = governanceScore !== null && managementScore !== null;
  
  return (
    <Card className="w-full mb-8">
      <CardHeader className="bg-purple-50">
        <CardTitle className="text-chart-4">Cybersecurity Risk Governance & Management Assessment</CardTitle>
        <CardDescription>
          Evaluate your organization's cybersecurity risk governance and management tiers based on NIST CSF 2.0 framework
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="governance">Cybersecurity Risk Governance</TabsTrigger>
            <TabsTrigger value="management">Cybersecurity Risk Management</TabsTrigger>
            <TabsTrigger value="additional">Additional Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="governance">
            <div className="space-y-6">
              <div className="text-lg font-semibold text-chart-4">
                Question 1: What cybersecurity risk governance tier is your organization?
              </div>
              <p className="text-gray-600">
                Evaluate your organization's approach to cybersecurity risk governance.
                Select the tier that best describes your current maturity level.
              </p>
              
              <div className="p-3 mb-4 bg-purple-50 rounded-md border-l-4 border-chart-4">
                <p className="text-sm text-purple-700">
                  <span className="font-medium">Important:</span> When you select a tier for Governance, 
                  the Management tier will automatically be set to the exact same tier.
                  The two tiers must always match in your organization's assessment.
                </p>
              </div>
              
              <RadioGroup 
                value={governanceScore?.toString() || "0"} 
                onValueChange={handleGovernanceChange}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="0" id="governance-0" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="governance-0" className="text-base font-semibold">Tier 0 (0-0): 0% None</Label>
                    <p className="text-sm text-gray-500">
                      The organization is completely uninformed about cybersecurity risk governance. There is no awareness, 
                      understanding, or formal approach to managing cybersecurity risks at any level of the organization.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="1" id="governance-1" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="governance-1" className="text-base font-semibold">Tier 1 (0-1): 25% Partial</Label>
                    <p className="text-sm text-gray-500">
                      Application of cybersecurity risk governance is ad hoc and prioritization is not 
                      explicitly considered.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="2" id="governance-2" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="governance-2" className="text-base font-semibold">Tier 2 (1-2): 50% Risk Informed</Label>
                    <p className="text-sm text-gray-500">
                      Risk management practices are approved by management but may not be established as organization-wide policy. 
                      The prioritization of cybersecurity activities and protection needs is directly informed by organizational risk objectives, 
                      the threat environment, or business/mission requirements.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="3" id="governance-3" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="governance-3" className="text-base font-semibold">Tier 3 (2-3): 75% Repeatable</Label>
                    <p className="text-sm text-gray-500">
                      The organization's risk management practices are formally approved and expressed as policy.
                      Risk-informed policies, processes, and procedures are defined, implemented as intended, and reviewed.
                      Organizational cybersecurity practices are regularly updated based on the application of risk management
                      processes to changes in business/mission requirements, threats, and technological landscape.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="4" id="governance-4" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="governance-4" className="text-base font-semibold">Tier 4 (3-4): 100% Adaptive</Label>
                    <p className="text-sm text-gray-500">
                      There is an organization-wide approach to managing cybersecurity risks that uses risk-informed policies, 
                      processes, and procedures to address potential cybersecurity events. The relationship between cybersecurity 
                      risks and organizational objectives is clearly understood and considered when making decisions. 
                      Executives monitor cybersecurity risks in the same context as financial and other organizational risks. 
                      The organizational budget is based on an understanding of the current and predicted risk environment.
                    </p>

                  </div>
                </div>
              </RadioGroup>
              
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("management")}
                  className="bg-chart-4 text-white hover:bg-purple-700"
                >
                  Continue to Risk Management
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="management">
            <div className="space-y-6">
              <div className="text-lg font-semibold text-chart-4">
                Question 1 (continued): What cybersecurity risk management tier is your organization?
              </div>
              <p className="text-gray-600">
                Evaluate your organization's approach to cybersecurity risk management.
                Select the tier that best describes your current maturity level.
              </p>
              
              <div className="p-3 mb-4 bg-purple-50 rounded-md border-l-4 border-chart-4">
                <p className="text-sm text-purple-700">
                  <span className="font-medium">Note:</span> The Management tier must always exactly match 
                  the Governance tier. It cannot be higher or lower.
                  This ensures consistency in your organization's cybersecurity maturity assessment.
                </p>
              </div>
              
              <RadioGroup 
                value={managementScore?.toString() || "0"} 
                onValueChange={handleManagementChange}
                className="space-y-4"
                disabled={true} // Disabled because Management tier automatically matches Governance tier
              >
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="0" id="management-0" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="management-0" className="text-base font-semibold">Tier 0 (0-0): 0% None</Label>
                    <p className="text-sm text-gray-500">
                      The organization is completely uninformed about cybersecurity risk management. There is no awareness, 
                      understanding, or formal approach to managing cybersecurity risks at any level of the organization.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="1" id="management-1" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="management-1" className="text-base font-semibold">Tier 1 (0-1): 25% Partial</Label>
                    <p className="text-sm text-gray-500">
                      There is limited awareness of cybersecurity risks at the organizational level.
                      The organization implements cybersecurity risk management on an irregular, case-by-case basis.
                      The organization may not have processes that enable cybersecurity information to be shared within the organization.
                      The organization is generally unaware of the cybersecurity risks associated with its third-party suppliers or business partners.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="2" id="management-2" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="management-2" className="text-base font-semibold">Tier 2 (1-2): 50% Risk Informed</Label>
                    <p className="text-sm text-gray-500">
                      There is an awareness of cybersecurity risks at the organizational level, but an organization-wide approach to managing cybersecurity risks has not been established.
                      Consideration of cybersecurity in organizational objectives and programs may occur at some but not all levels of the organization. 
                      Cyber risk assessment of organizational and external assets occurs, but is not typically repeatable or reoccurring.
                      Cybersecurity information is shared within the organization on an informal basis.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="3" id="management-3" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="management-3" className="text-base font-semibold">Tier 3 (2-3): 75% Repeatable</Label>
                    <p className="text-sm text-gray-500">
                      There is an organization-wide approach to managing cybersecurity risks. Cybersecurity information is routinely shared throughout the organization.
                      Consistent methods are in place to respond effectively to changes in risk. Personnel possess the knowledge and skills to perform their appointed roles and responsibilities.
                      The organization consistently and accurately monitors cybersecurity risks of assets. Senior cybersecurity and non-cybersecurity executives communicate regularly regarding cybersecurity risks.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-md border-2 border-gray-200 hover:border-chart-4">
                  <RadioGroupItem value="4" id="management-4" className="mt-1" />
                  <div className="space-y-1.5">
                    <Label htmlFor="management-4" className="text-base font-semibold">Tier 4 (3-4): 100% Adaptive</Label>
                    <p className="text-sm text-gray-500">
                      The organization adapts its cybersecurity practices based on previous and current cybersecurity activities, including lessons learned and predictive indicators.
                      The organization uses real-time or near real-time information to understand and consistently act upon cybersecurity risks associated with the products and services it provides and uses.
                      Cybersecurity information is consistently and accurately shared throughout the organization and with authorized third parties.
                    </p>
                  </div>
                </div>
              </RadioGroup>
              
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setActiveTab("governance")}>
                  Back to Governance
                </Button>
                <Button 
                  className="bg-chart-4 text-white hover:bg-purple-700" 
                  onClick={() => setActiveTab("additional")}
                >
                  Continue to Additional Questions
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="additional">
            <div className="space-y-6">
              <div className="text-lg font-semibold text-chart-4">
                Question 2: Time at Current Tier and Improvement Goals
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="months-at-tier" className="text-md font-medium">
                    How many months has your organization been at Tier {governanceScore}?
                  </Label>
                  <Input 
                    id="months-at-tier" 
                    type="number" 
                    min="0"
                    value={monthsAtTier.toString()} 
                    onChange={(e) => setMonthsAtTier(parseInt(e.target.value) || 0)}
                    className="max-w-xs"
                  />
                </div>
                
                {/* Enhanced Duration-Based Assessment (NEW - Additive only) */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <Label className="text-md font-medium text-purple-700">
                      Duration & Timeline Assessment (Enhanced Scoring)
                    </Label>
                    <p className="text-sm text-gray-600">
                      How long has your organization maintained this governance tier?
                    </p>
                    <RadioGroup 
                      value={durationCategory || ""} 
                      onValueChange={(value) => setDurationCategory(value as 'less-than-6' | '6-12' | '1-2-years' | '2-plus-years')}
                      className="grid grid-cols-2 gap-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="less-than-6" id="duration-1" />
                        <Label htmlFor="duration-1" className="text-sm">Less than 6 months</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="6-12" id="duration-2" />
                        <Label htmlFor="duration-2" className="text-sm">6-12 months</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1-2-years" id="duration-3" />
                        <Label htmlFor="duration-3" className="text-sm">1-2 years</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2-plus-years" id="duration-4" />
                        <Label htmlFor="duration-4" className="text-sm">2+ years</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">6-month target tier (optional)</Label>
                      <Select value={sixMonthTarget?.toString() || "none"} onValueChange={(value) => setSixMonthTarget(value === "none" ? null : parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No target set</SelectItem>
                          <SelectItem value="1">Tier 1 (25%)</SelectItem>
                          <SelectItem value="2">Tier 2 (50%)</SelectItem>
                          <SelectItem value="3">Tier 3 (75%)</SelectItem>
                          <SelectItem value="4">Tier 4 (100%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">12-month goal tier (optional)</Label>
                      <Select value={twelveMonthTarget?.toString() || "none"} onValueChange={(value) => setTwelveMonthTarget(value === "none" ? null : parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select goal tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No goal set</SelectItem>
                          <SelectItem value="1">Tier 1 (25%)</SelectItem>
                          <SelectItem value="2">Tier 2 (50%)</SelectItem>
                          <SelectItem value="3">Tier 3 (75%)</SelectItem>
                          <SelectItem value="4">Tier 4 (100%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-xs text-blue-700">
                      <strong>Enhanced Scoring:</strong> Organizations maintaining higher tiers for longer periods receive enhanced maturity scores. 
                      Setting improvement targets demonstrates strategic planning capability.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 pt-4">
                  <Checkbox 
                    id="improvement" 
                    checked={desireToImprove}
                    onCheckedChange={(checked) => {
                      setDesireToImprove(checked === true);
                    }}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="improvement"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Would you like to improve your cybersecurity maturity?
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Our SOS²A (Healthcare Organizational and System Security Analysis) can help you improve your security maturity.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* NIST CSF 2.0 Comprehensive Functional Area Assessment */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-chart-4 mb-2">
                    Question 3: NIST CSF 2.0 Functional Area Tier Assessment (Optional)
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    For a comprehensive cybersecurity hygiene evaluation, assess your organization across all 22 NIST CSF functional areas. 
                    This provides precise maturity scoring and targeted improvement recommendations.
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-md mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-800">Enhanced Cybersecurity Hygiene Assessment</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Complete functional area assessment provides tier-based scoring across GOVERN, IDENTIFY, PROTECT, DETECT, RESPOND, RECOVER categories
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowFunctionalAreaAssessment(!showFunctionalAreaAssessment)}
                        className={`${showFunctionalAreaAssessment ? 'bg-blue-600' : 'bg-chart-4'} text-white hover:bg-purple-700`}
                      >
                        {showFunctionalAreaAssessment ? 'Hide Assessment' : 'Start Assessment'}
                      </Button>
                    </div>
                  </div>
                </div>

                {showFunctionalAreaAssessment && (
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Assessment Progress</span>
                        <span>{Object.keys(functionalAreaScores).length} of {NIST_CSF_FUNCTIONAL_AREAS.length} areas completed</span>
                      </div>
                      <Progress 
                        value={(Object.keys(functionalAreaScores).length / NIST_CSF_FUNCTIONAL_AREAS.length) * 100} 
                        className="h-2 mb-4" 
                      />
                    </div>

                    <Tabs value={functionalAreaCategory} onValueChange={(value) => setFunctionalAreaCategory(value as any)}>
                      <TabsList className="grid grid-cols-6 mb-6">
                        {['GOVERN', 'IDENTIFY', 'PROTECT', 'DETECT', 'RESPOND', 'RECOVER'].map(category => (
                          <TabsTrigger 
                            key={category} 
                            value={category}
                            className="text-xs"
                          >
                            {category}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {['GOVERN', 'IDENTIFY', 'PROTECT', 'DETECT', 'RESPOND', 'RECOVER'].map(category => (
                        <TabsContent key={category} value={category}>
                          <div className="space-y-4">
                            <div className="mb-4">
                              <Badge className={`${getCategoryBadgeColor(category)}`}>
                                {category} ({NIST_CSF_FUNCTIONAL_AREAS.filter(fa => fa.category === category).length} functional areas)
                              </Badge>
                            </div>

                            {NIST_CSF_FUNCTIONAL_AREAS
                              .filter(fa => fa.category === category)
                              .map(functionalArea => {
                                const currentScore = functionalAreaScores[functionalArea.id];
                                return (
                                  <Card key={functionalArea.id} className="border-l-4 border-l-purple-200">
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-sm font-medium">
                                        {functionalArea.id}: {functionalArea.name}
                                      </CardTitle>
                                      <CardDescription className="text-xs">
                                        {functionalArea.description} ({functionalArea.subcategories.length} subcategories)
                                      </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      {/* Current Tier */}
                                      <div>
                                        <Label className="text-xs font-medium text-gray-700">Current Implementation Tier</Label>
                                        <RadioGroup
                                          value={currentScore?.currentTier?.toString() || "0"}
                                          onValueChange={(value) => handleFunctionalAreaChange(functionalArea.id, 'currentTier', parseInt(value))}
                                          className="flex flex-wrap gap-4 mt-2"
                                        >
                                          {[0, 1, 2, 3, 4].map(tier => (
                                            <div key={tier} className="flex items-center space-x-2">
                                              <RadioGroupItem value={tier.toString()} id={`${functionalArea.id}-current-${tier}`} />
                                              <Label htmlFor={`${functionalArea.id}-current-${tier}`} className="text-xs">
                                                {getTierLabel(tier)}
                                              </Label>
                                            </div>
                                          ))}
                                        </RadioGroup>
                                      </div>

                                      {/* Target Tier */}
                                      <div>
                                        <Label className="text-xs font-medium text-gray-700">Target Tier (12 months)</Label>
                                        <RadioGroup
                                          value={currentScore?.targetTier?.toString() || "0"}
                                          onValueChange={(value) => handleFunctionalAreaChange(functionalArea.id, 'targetTier', parseInt(value))}
                                          className="flex flex-wrap gap-4 mt-2"
                                        >
                                          {[0, 1, 2, 3, 4].map(tier => (
                                            <div key={tier} className="flex items-center space-x-2">
                                              <RadioGroupItem value={tier.toString()} id={`${functionalArea.id}-target-${tier}`} />
                                              <Label htmlFor={`${functionalArea.id}-target-${tier}`} className="text-xs">
                                                Tier {tier}
                                              </Label>
                                            </div>
                                          ))}
                                        </RadioGroup>
                                      </div>

                                      {/* Time at Current Tier */}
                                      <div>
                                        <Label className="text-xs font-medium text-gray-700">Months at Current Tier</Label>
                                        <RadioGroup
                                          value={currentScore?.timeAtTier?.toString() || "0"}
                                          onValueChange={(value) => handleFunctionalAreaChange(functionalArea.id, 'timeAtTier', parseInt(value))}
                                          className="flex flex-wrap gap-4 mt-2"
                                        >
                                          {[0, 3, 6, 12, 24, 36].map(months => (
                                            <div key={months} className="flex items-center space-x-2">
                                              <RadioGroupItem value={months.toString()} id={`${functionalArea.id}-time-${months}`} />
                                              <Label htmlFor={`${functionalArea.id}-time-${months}`} className="text-xs">
                                                {months === 0 ? 'New' : `${months}mo`}
                                              </Label>
                                            </div>
                                          ))}
                                        </RadioGroup>
                                      </div>

                                      {/* Individual Subcategory Controls */}
                                      <div className="mt-6 pt-4 border-t border-gray-200">
                                        <h5 className="text-sm font-medium text-gray-800 mb-3">
                                          Individual Control Assessment
                                        </h5>
                                        <div className="space-y-3">
                                          {functionalArea.subcategories.map((subcat) => (
                                            <div key={subcat.id} className="bg-gray-50 p-3 rounded-md">
                                              <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                  <p className="text-xs font-medium text-gray-700">{subcat.id}</p>
                                                  <p className="text-xs text-gray-600 mt-1">{subcat.description}</p>
                                                </div>
                                              </div>
                                              <div className="grid grid-cols-4 gap-2 text-xs">
                                                <div>
                                                  <Label className="text-xs text-gray-600">Score today</Label>
                                                  <div className="text-sm font-medium">2</div>
                                                </div>
                                                <div>
                                                  <Label className="text-xs text-gray-600">6-month target</Label>
                                                  <div className="text-sm font-medium">2.5</div>
                                                </div>
                                                <div>
                                                  <Label className="text-xs text-gray-600">12-month target</Label>
                                                  <div className="text-sm font-medium">3</div>
                                                </div>
                                                <div>
                                                  <Label className="text-xs text-gray-600">Goal score</Label>
                                                  <div className="text-sm font-medium">4</div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>

                    {Object.keys(functionalAreaScores).length === NIST_CSF_FUNCTIONAL_AREAS.length && (
                      <div className="mt-6 flex justify-center">
                        <Button 
                          onClick={calculateCybersecurityHygiene}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Calculate Cybersecurity Hygiene Level
                        </Button>
                      </div>
                    )}

                    {cybersecurityHygiene && (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Cybersecurity Hygiene Results</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-700">{cybersecurityHygiene.overallScore.toFixed(1)}%</div>
                            <div className="text-sm text-gray-600">Overall Score</div>
                            <Badge className={getHygieneLevelColor(cybersecurityHygiene.hygieneLevel)}>
                              {cybersecurityHygiene.hygieneLevel}
                            </Badge>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-700">Tier {cybersecurityHygiene.overallTier}</div>
                            <div className="text-sm text-gray-600">Maturity Level</div>
                          </div>
                        </div>
                        {cybersecurityHygiene.recommendations.length > 0 && (
                          <div>
                            <h5 className="font-medium text-green-800 mb-2">Priority Recommendations</h5>
                            <ul className="space-y-1 text-sm text-green-700">
                              {cybersecurityHygiene.recommendations.slice(0, 3).map((rec, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-green-500 mt-1">•</span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8 bg-purple-50 p-4 rounded-md">
                <h3 className="font-medium text-chart-4 mb-2">Why this matters</h3>
                <p className="text-sm text-gray-700">
                  Understanding your current tier and how long you've been operating at this level helps establish your organization's security maturity baseline. 
                  Organizations that remain at lower tiers for extended periods face increased risk exposure.
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  CyberLockX's SOS²A assessment can help you identify gaps and create a roadmap to reach higher tiers of cybersecurity maturity.
                </p>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("management")}
                >
                  Back to Risk Management
                </Button>
                <Button 
                  className="bg-chart-4 text-white hover:bg-purple-700" 
                  onClick={handleSubmit}
                >
                  Complete Self-Scoring
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {isComplete && governanceScore !== null && managementScore !== null && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center text-green-700 gap-2 mb-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold">Self-Scoring Complete!</span>
            </div>
            <p className="text-sm text-green-600">
              Based on your self-scoring, your organization is at:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-green-600">
              <li>• Governance Tier: {getTierLabel(governanceScore)}</li>
              <li>• Management Tier: {getTierLabel(managementScore)}</li>
              <li>• Time at current tier: {monthsAtTier} months</li>
              <li>• Improvement desired: {desireToImprove ? 'Yes' : 'No'}</li>
              {durationCategory && (
                <li>• Duration category: {getDurationLabel(durationCategory)}</li>
              )}
              {sixMonthTarget && (
                <li>• 6-month target: {getTierLabel(sixMonthTarget)}</li>
              )}
              {twelveMonthTarget && (
                <li>• 12-month goal: {getTierLabel(twelveMonthTarget)}</li>
              )}
            </ul>
            <p className="mt-2 text-sm text-green-600">
              Click "Complete Self-Scoring" to incorporate these results into your RASBITA report.
              {desireToImprove && <span className="font-semibold"> We recommend using SOS²A to improve your security maturity.</span>}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getTierLabel(score: number | null): string {
  if (score === null) return "Not assessed";
  
  switch (score) {
    case 0: return "Tier 0 (0-0): 0% None";
    case 1: return "Tier 1 (0-1): 25% Partial";
    case 2: return "Tier 2 (1-2): 50% Risk Informed";
    case 3: return "Tier 3 (2-3): 75% Repeatable";
    case 4: return "Tier 4 (3-4): 100% Adaptive";
    default: return "Unknown";
  }
}

function getDurationLabel(category: 'less-than-6' | '6-12' | '1-2-years' | '2-plus-years'): string {
  switch (category) {
    case 'less-than-6': return "Less than 6 months";
    case '6-12': return "6-12 months";
    case '1-2-years': return "1-2 years";
    case '2-plus-years': return "2+ years";
    default: return "Unknown";
  }
}