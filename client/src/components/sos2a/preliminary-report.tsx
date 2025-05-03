import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sos2aFormData } from "@/lib/sos2a-types";
import { 
  ArrowDownToLine, 
  ShieldAlert, 
  AlertCircle, 
  FileClock, 
  Fingerprint, 
  FileCheck 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Helper to generate a unique ID for the preliminary report
const generateUniqueId = () => {
  return 'prelim_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
};

interface PreliminaryReportProps {
  formData: Sos2aFormData;
  updateFormData: (data: Partial<Sos2aFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function PreliminaryReport({
  formData,
  updateFormData,
  onNext,
  onPrev,
}: PreliminaryReportProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadReport = () => {
    setIsDownloading(true);
    
    // Simulate download delay
    setTimeout(() => {
      setIsDownloading(false);
    }, 2000);
  };

  // Calculate security score based on formData
  const calculateSecurityScore = () => {
    // This is a simplified placeholder calculation
    // In a real implementation, would be a more complex algorithm based on assessment data
    const baseScore = 35; // Starting from a basic level
    
    // Add points based on security measures
    const securityMeasuresScore = (formData.securityMeasures?.length || 0) * 5;
    
    // Add points based on matrix data completeness
    const matrixDataScore = formData.matrixData ? 15 : 0;
    
    return Math.min(baseScore + securityMeasuresScore + matrixDataScore, 100);
  };

  // Generate risk findings based on form data
  const generateRiskFindings = () => {
    const findings = [];
    
    if (!formData.securityMeasures?.includes("mfa")) {
      findings.push({
        severity: "High",
        title: "Missing Multi-Factor Authentication",
        description: "Multi-factor authentication is not implemented, leaving accounts vulnerable to credential-based attacks."
      });
    }
    
    if (!formData.securityMeasures?.includes("backup")) {
      findings.push({
        severity: "High",
        title: "Inadequate Data Backup Procedures",
        description: "Without proper backup and disaster recovery protocols, your organization risks permanent data loss during incidents."
      });
    }
    
    if (!formData.securityMeasures?.includes("training")) {
      findings.push({
        severity: "Medium",
        title: "Insufficient Security Awareness Training",
        description: "Employees lack formal cybersecurity training, increasing vulnerability to social engineering attacks."
      });
    }
    
    if (!formData.securityMeasures?.includes("encryption")) {
      findings.push({
        severity: "Medium",
        title: "Data Not Properly Encrypted",
        description: "Sensitive data at rest and in transit is not adequately encrypted, increasing exposure risk."
      });
    }
    
    if (!formData.securityMeasures?.includes("network")) {
      findings.push({
        severity: "Medium",
        title: "Weak Network Segmentation",
        description: "Network lacks proper segmentation, which could allow lateral movement if perimeter defenses are compromised."
      });
    }
    
    // Always include some low-severity findings
    findings.push({
      severity: "Low",
      title: "Security Policy Documentation Needs Improvement",
      description: "Security policies and procedures should be better documented and regularly reviewed."
    });
    
    findings.push({
      severity: "Low",
      title: "Asset Inventory Incomplete",
      description: "Hardware and software asset inventory is incomplete, creating blind spots in security management."
    });
    
    return findings;
  };
  
  const securityScore = calculateSecurityScore();
  const riskFindings = generateRiskFindings();
  const businessName = formData.businessName || "Your Business";
  const currentDate = new Date().toLocaleDateString();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-primary">Step 3: Preliminary Report</h2>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
        <div className="flex items-start">
          <div className="mr-3 text-yellow-500">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-yellow-700">Preliminary Report Notice</h4>
            <p className="text-sm text-yellow-600">
              This is a qualitative preliminary report based on the information provided in the questionnaire and interview.
              A comprehensive quantitative report requires 6 months of continuous monitoring and will be available in Step 4.
            </p>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-primary">Cybersecurity Risk & Compliance Assessment</h3>
              <p className="text-neutral-600">For: {businessName}</p>
              <p className="text-neutral-600">Date: {currentDate}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="outline" className="mr-2" onClick={handleDownloadReport} disabled={isDownloading}>
                {isDownloading ? (
                  <>Downloading... <FileClock className="ml-2 h-4 w-4 animate-spin" /></>
                ) : (
                  <>Download PDF <ArrowDownToLine className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="findings">Risk Findings</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold text-lg mb-4">Security Posture Summary</h4>
                <div className="flex flex-col md:flex-row gap-4 md:gap-10 mb-6">
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 mb-2">Overall Security Score</p>
                    <div className="flex items-center">
                      <Progress value={securityScore} className="h-3 flex-1 mr-3" />
                      <span className="font-medium">{securityScore}%</span>
                    </div>
                    <div className="mt-4 text-sm text-neutral-500">
                      {securityScore < 50 ? (
                        <span className="text-red-600">Your security posture needs significant improvement.</span>
                      ) : securityScore < 70 ? (
                        <span className="text-yellow-600">Your security posture is adequate but has room for improvement.</span>
                      ) : (
                        <span className="text-green-600">Your security posture is good but can be further strengthened.</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-neutral-50 p-3 rounded">
                        <p className="text-sm text-neutral-600">High Risk Findings</p>
                        <p className="text-xl font-medium text-red-600">
                          {riskFindings.filter(f => f.severity === "High").length}
                        </p>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded">
                        <p className="text-sm text-neutral-600">Medium Risk Findings</p>
                        <p className="text-xl font-medium text-yellow-600">
                          {riskFindings.filter(f => f.severity === "Medium").length}
                        </p>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded">
                        <p className="text-sm text-neutral-600">Low Risk Findings</p>
                        <p className="text-xl font-medium text-blue-600">
                          {riskFindings.filter(f => f.severity === "Low").length}
                        </p>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded">
                        <p className="text-sm text-neutral-600">Security Measures</p>
                        <p className="text-xl font-medium text-neutral-600">
                          {formData.securityMeasures?.length || 0}/10
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold text-lg mb-4">Executive Summary</h4>
                <p className="text-neutral-600 mb-4">
                  This preliminary report highlights the current cybersecurity state of {businessName}, with an emphasis on 
                  assessing its organizational and system security posture. While this is an initial overview, it is part 
                  of a larger effort to align security controls with industry compliance standards, regulations, and best 
                  practices.
                </p>
                <p className="text-neutral-600">
                  The purpose of this report is to illustrate the need for comprehensive monitoring, threat detection, and 
                  an effective incident response system, which will be implemented in the next phase of the security 
                  assessment process.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold text-lg mb-4">Mode of Operation & Security Risks</h4>
                <div className="mb-4">
                  <h5 className="font-medium mb-2">Primary Areas of Operation:</h5>
                  <ul className="list-disc list-inside text-neutral-600 space-y-1">
                    <li>Website & Social Media Presence</li>
                    {formData.industry === "retail" && <li>POS Systems & Payment Processing</li>}
                    <li>Email Communication</li>
                    <li>Internet Access through ISP/Mobile Data</li>
                    {formData.securityMeasures?.includes("cloud") && <li>Cloud Services & Storage</li>}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h5 className="font-medium mb-2">Identified Security Risks:</h5>
                  <ul className="list-disc list-inside text-neutral-600 space-y-1">
                    {formData.primaryConcerns?.includes("phishing") && (
                      <li>Phishing & Spoofing: Cybercriminals can exploit weak points in website and email security to deceive users into disclosing sensitive information.</li>
                    )}
                    {formData.primaryConcerns?.includes("data-breach") && (
                      <li>Data Privacy Breaches: Inadequate controls around data handling can lead to unauthorized access and leaks of personal data.</li>
                    )}
                    {formData.primaryConcerns?.includes("malware") && (
                      <li>Malware & Hacking: Without robust defenses, external threats such as malware and hacking can compromise both systems and data.</li>
                    )}
                    {formData.primaryConcerns?.includes("third-party") && (
                      <li>Third-Party Risks: Vendors and partners may introduce security vulnerabilities if not properly vetted and monitored.</li>
                    )}
                    <li>Account Hijacking: Cyber attackers could target user accounts to gain privileged access, leading to data compromise.</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="findings" className="space-y-4">
              {riskFindings.map((finding, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-lg border shadow-sm"
                >
                  <div className="flex items-center mb-3">
                    <div 
                      className={`mr-3 p-2 rounded-full
                        ${finding.severity === "High" ? "bg-red-100 text-red-600" : 
                          finding.severity === "Medium" ? "bg-yellow-100 text-yellow-600" :
                          "bg-blue-100 text-blue-600"}`}
                    >
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div>
                      <span 
                        className={`text-xs font-semibold uppercase px-2 py-1 rounded
                          ${finding.severity === "High" ? "bg-red-100 text-red-600" : 
                            finding.severity === "Medium" ? "bg-yellow-100 text-yellow-600" :
                            "bg-blue-100 text-blue-600"}`}
                      >
                        {finding.severity} Risk
                      </span>
                      <h4 className="font-medium text-lg">{finding.title}</h4>
                    </div>
                  </div>
                  <p className="text-neutral-600 ml-10">
                    {finding.description}
                  </p>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-6">
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold text-lg mb-4">Key Security Recommendations</h4>
                
                <div className="space-y-4">
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Fingerprint className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium">Access Control Policies</h5>
                      <p className="text-neutral-600 text-sm">
                        Implement strict access control measures and enforce multi-factor authentication (MFA) for all 
                        critical systems to ensure only authorized personnel can access sensitive data and systems.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileCheck className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium">Regular Software Updates & Patches</h5>
                      <p className="text-neutral-600 text-sm">
                        Continuously update all software and systems, patching vulnerabilities to prevent exploitation by 
                        cybercriminals. Ensure both in-house and third-party systems are up-to-date.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <i className="fas fa-user-shield text-primary"></i>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium">Employee Training</h5>
                      <p className="text-neutral-600 text-sm">
                        Invest in regular training to help employees recognize phishing attempts, social engineering tactics, 
                        and how to report suspicious activities. Awareness is a key component in preventing these types of attacks.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <i className="fas fa-tasks text-primary"></i>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium">Incident Response Plan (IRP)</h5>
                      <p className="text-neutral-600 text-sm">
                        Develop and implement an incident response strategy that outlines clear procedures for detecting, 
                        containing, and mitigating cybersecurity threats in real-time. This will help minimize damage and 
                        downtime in the event of an attack.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <i className="fas fa-desktop text-primary"></i>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium">SOC Monitoring</h5>
                      <p className="text-neutral-600 text-sm">
                        Establish continuous monitoring via a Security Operations Center (SOC), utilizing automated tools and 
                        threat detection systems (SIEM, IDS/IPS) to identify unusual activity early and respond swiftly to 
                        potential threats.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold text-lg mb-4">Next Steps</h4>
                <p className="text-neutral-600 mb-4">
                  This report outlines the preliminary cybersecurity risks and compliance gaps at {businessName}. While not 
                  exhaustive, it underscores the importance of moving forward with a comprehensive SOC infrastructure, robust 
                  incident response strategies, and continuous security monitoring to achieve compliance and mitigate potential 
                  cyber threats.
                </p>
                <p className="text-neutral-600">
                  The next steps will involve further detailed assessments and the refinement of the security posture to meet 
                  industry standards and regulatory requirements. This includes implementing the recommended security measures 
                  and enrolling in the 6-month continuous monitoring program to develop a comprehensive security assessment report.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onPrev}>
          Back to Matrix
        </Button>
        <Button 
          onClick={() => {
            // Generate a unique ID for this preliminary report
            const preliminaryReportId = generateUniqueId();
            
            // Extract remediation strategies from risk findings
            const remediationStrategies = riskFindings.map(finding => ({
              issue: finding.title,
              strategy: `Remediate the ${finding.severity.toLowerCase()} risk: ${finding.description}`
            }));
            
            // Update form data with preliminary report info
            updateFormData({ 
              reportType: "preliminary",
              preliminaryReportId,
              remediationStrategies
            });
            
            onNext();
          }} 
          className="bg-secondary hover:bg-orange-600"
        >
          Continue to Comprehensive Report
        </Button>
      </div>
    </div>
  );
}
