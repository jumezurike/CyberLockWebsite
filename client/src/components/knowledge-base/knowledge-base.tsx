import React from 'react';
import { KnowledgeItem } from './knowledge-item';
import { Search } from 'lucide-react';

export interface KnowledgeBaseProps {
  title?: string;
  description?: string;
}

export function KnowledgeBase({ title = "Knowledge Base", description }: KnowledgeBaseProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const knowledgeItems = [
    {
      id: 'compliance-matrix',
      title: 'CyberLockX Compliance Matrix',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            CyberLockX aligns with multiple industry standards and regulations, providing comprehensive compliance coverage across various sectors.
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Standard Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Standard</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CyberLockX Alignment</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Universal Security Standards */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Universal Security Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ISO 27001</td>
                  <td className="px-6 py-4 text-sm text-gray-500">ISMS framework via ECSMID + SOS²A</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Universal Security Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ISO 27002</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Controls mapped in real-time via SOS²A</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Universal Security Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NIST CSF</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Risk-based controls built into SOS²A</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Universal Security Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NIST SP 800-53</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Low/mod baseline controls supported</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Universal Security Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">CIS Controls</td>
                  <td className="px-6 py-4 text-sm text-gray-500">18 control mapping through ECSMID</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Universal Security Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">SOC 2</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Supports SOC 2 Type II audit trails</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Universal Security Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PCI-DSS</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Secure browser + payments module</td>
                </tr>
                
                {/* Healthcare-Specific Standards */}
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Healthcare-Specific Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">HIPAA Security Rule</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Encrypts PHI, audit logs via Secure Docs</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Healthcare-Specific Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">HITRUST CSF</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Mapped to HITRUST through NIST+ISO</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Healthcare-Specific Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">HIPAA Privacy Rule</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Data access logging & control</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Healthcare-Specific Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">21 CFR Part 11</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Electronic signature + audit trails</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Healthcare-Specific Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GDPR</td>
                  <td className="px-6 py-4 text-sm text-gray-500">GDPR-compliant workflows & user rights</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Healthcare-Specific Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NIST SP 800-66</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Guide mapped in SOS²A</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Healthcare-Specific Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">DICOM Security</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Encryption of medical imaging files</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Healthcare-Specific Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">HL7 FHIR Security</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Secure API gateways for HL7 FHIR</td>
                </tr>
                
                {/* Government & Critical Infrastructure */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Government & Critical Infrastructure</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">FISMA</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Mapped to NIST controls</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Government & Critical Infrastructure</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">FedRAMP</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Browser-based FedRAMP-ready isolation</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Government & Critical Infrastructure</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">CMMC</td>
                  <td className="px-6 py-4 text-sm text-gray-500">CMMC practices (access, audit, update)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Government & Critical Infrastructure</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NERC CIP</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Critical asset protection via SIEVVE</td>
                </tr>
                
                {/* Financial & Payment Standards */}
                <tr className="bg-green-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Financial & Payment Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">GLBA</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Data encryption + financial data controls</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Financial & Payment Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">SOX</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Audit logs, access control</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Financial & Payment Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PSD2</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Secure session + MFA for EU</td>
                </tr>
                
                {/* Cloud & Data Privacy */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Cloud & Data Privacy</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ISO 27701</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Privacy by design + access controls</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Cloud & Data Privacy</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">CCPA</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Supports CCPA rights & disclosures</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Cloud & Data Privacy</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">SOC 1</td>
                  <td className="px-6 py-4 text-sm text-gray-500">SSAE 18-aligned logs</td>
                </tr>
                
                {/* Industry-Specific Standards */}
                <tr className="bg-yellow-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Industry-Specific Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">IEC 62443</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Protects ICS via browser isolation</td>
                </tr>
                <tr className="bg-yellow-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Industry-Specific Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TISAX</td>
                  <td className="px-6 py-4 text-sm text-gray-500">TISAX-level access control enforcement</td>
                </tr>
                <tr className="bg-yellow-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Industry-Specific Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">FIPS 140-2/3</td>
                  <td className="px-6 py-4 text-sm text-gray-500">FIPS 140-validated encryption</td>
                </tr>
                
                {/* Emerging & Regional Standards */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Emerging & Regional Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">CCCS 33</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Framework ready in modular design</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Emerging & Regional Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ENS</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Supports ENS mapping</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Emerging & Regional Standards</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">MEITI</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Aligns with critical infra protection</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-md mt-6">
            <h4 className="font-medium">Industry Coverage</h4>
            <p className="text-sm mt-1">
              CyberLockX's compliance coverage spans multiple industries, with particular depth in Healthcare 
              (8 standards), Universal Security (7 standards), and Government/Critical Infrastructure (4 standards).
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'competitive-advantages',
      title: 'CyberLockX Competitive Advantages',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            CyberLockX stands out from companies like Cylera, Fortified Health Security, and Huntress in several key ways, 
            making it an exceptional choice for healthcare and critical infrastructure cybersecurity.
          </p>
          
          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-4 space-y-2">
              <h4 className="font-medium text-primary">Specialization in Zero Trust & Identity-Centric Security</h4>
              <p className="text-sm text-muted-foreground">
                While Cylera and Fortified focus on IoT/endpoint monitoring and compliance, and Huntress offers managed detection 
                and response (MDR), CyberLockX specializes in Zero Trust Architecture (ZTA) with a unique identity-centric approach. 
                This ensures that every access request is continuously verified, minimizing breach risks even if endpoints are compromised.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4 space-y-2">
              <h4 className="font-medium text-primary">Proprietary Behavioral Biometrics & AI</h4>
              <p className="text-sm text-muted-foreground">
                Unlike traditional MDR or endpoint-based pricing models, CyberLockX integrates behavioral biometrics and AI-driven 
                anomaly detection, going beyond signature-based threats. This allows for real-time user behavior analysis, reducing 
                insider threats and credential-based attacks—something most competitors lack.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4 space-y-2">
              <h4 className="font-medium text-primary">Real-Time Adaptive Authentication</h4>
              <p className="text-sm text-muted-foreground">
                While others rely on static endpoint pricing ($/device/month), CyberLockX dynamically adjusts security postures 
                based on risk signals, such as:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                <li>Location anomalies</li>
                <li>Time-of-access irregularities</li>
                <li>Device fingerprinting</li>
                <li>Behavioral deviations</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                This makes it far more resilient against advanced attacks like ransomware and supply chain compromises.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4 space-y-2">
              <h4 className="font-medium text-primary">Compliance Automation for Healthcare (Beyond HIPAA)</h4>
              <p className="text-sm text-muted-foreground">
                Fortified and Cylera emphasize HIPAA compliance, but CyberLockX automates compliance for HIPAA, NIST, CMMC, 
                and HITRUST with built-in audit trails and policy enforcement, reducing manual workload for healthcare IT teams.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4 space-y-2">
              <h4 className="font-medium text-primary">No-Perimeter Security Model</h4>
              <p className="text-sm text-muted-foreground">
                While competitors still depend on network segmentation and endpoint monitoring, CyberLockX assumes breach and 
                eliminates implicit trust, making it ideal for hybrid cloud, remote work, and medical IoT environments where 
                traditional defenses fail.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4 space-y-2">
              <h4 className="font-medium text-primary">Transparent, Predictable Pricing</h4>
              <p className="text-sm text-muted-foreground">
                Unlike "custom pricing" models (which often lead to unpredictable costs), CyberLockX offers flat-rate, 
                scalable pricing based on active users or risk tiers—making budgeting easier for healthcare organizations.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4 space-y-2">
              <h4 className="font-medium text-primary">Proactive Threat Hunting + Automated Response</h4>
              <p className="text-sm text-muted-foreground">
                Huntress and Fortified provide SOC services, but CyberLockX combines AI-driven threat hunting with auto-remediation, such as:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                <li>Session freezing</li>
                <li>Step-up authentication</li>
                <li>Automatic access revocation</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                This reduces dependency on human analysts and speeds up incident response.
              </p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-md">
              <h4 className="font-semibold text-primary">Conclusion: Why CyberLockX Wins</h4>
              <p className="text-sm text-muted-foreground mt-2">
                While Cylera, Fortified, and Huntress excel in traditional healthcare security (endpoint monitoring, MDR, compliance), 
                CyberLockX redefines protection with Zero Trust, behavioral AI, and real-time adaptive policies. It's not just about 
                detecting threats—it's about preventing breaches before they happen by eliminating trust vulnerabilities.
              </p>
              <p className="text-sm font-medium text-primary mt-2">
                For healthcare organizations prioritizing identity-first security, compliance automation, and AI-driven Zero Trust, 
                CyberLockX is the superior choice.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'zero-trust-security',
      title: 'Zero Trust Security Architecture',
      content: (
        <div className="space-y-4">
          <p>
            CyberLockX implements a comprehensive Zero Trust Security Architecture that verifies every user, 
            device, and connection before granting access to applications and data.
          </p>
          
          <h4 className="font-medium">Key Components:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Never Trust, Always Verify:</span> Every access request is thoroughly authenticated, 
              authorized, and encrypted before granting access.
            </li>
            <li>
              <span className="font-medium">Least Privilege Access:</span> Users only receive access to the specific resources 
              they need for their role.
            </li>
            <li>
              <span className="font-medium">Micro-Segmentation:</span> Network environments are broken into secure zones with 
              separate access for different parts of the network.
            </li>
            <li>
              <span className="font-medium">Continuous Monitoring:</span> All resources are continuously monitored and validated 
              for configuration and security status.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'behavioral-biometrics',
      title: 'Behavioral Biometrics & AI Technology',
      content: (
        <div className="space-y-4">
          <p>
            CyberLockX leverages advanced behavioral biometrics and AI-driven anomaly detection to provide 
            enhanced security beyond traditional authentication methods.
          </p>
          
          <h4 className="font-medium">Key Features:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Keystroke Dynamics:</span> Analyzes typing patterns including speed, rhythm, and pressure.
            </li>
            <li>
              <span className="font-medium">Mouse Movement Analysis:</span> Monitors cursor movement, scroll patterns, and click behaviors.
            </li>
            <li>
              <span className="font-medium">User Navigation Patterns:</span> Learns how individuals interact with applications and systems.
            </li>
            <li>
              <span className="font-medium">Session Analytics:</span> Continuous verification throughout a session, not just at login.
            </li>
          </ul>
          
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <h4 className="font-medium text-blue-800">Advantage Over Traditional Methods</h4>
            <p className="text-sm text-blue-700 mt-1">
              Unlike simple authentication methods that can be compromised, behavioral biometrics provides 
              a continuous authentication layer that's extremely difficult to replicate or fake.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'adaptive-authentication',
      title: 'Real-Time Adaptive Authentication',
      content: (
        <div className="space-y-4">
          <p>
            CyberLockX's adaptive authentication dynamically adjusts security requirements based on risk signals and contextual factors.
          </p>
          
          <h4 className="font-medium">Risk Signals Monitored:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="bg-white p-3 rounded border">
              <h5 className="text-sm font-medium">Location Anomalies</h5>
              <p className="text-xs text-muted-foreground">
                Detects access attempts from unusual or impossible geographic locations.
              </p>
            </div>
            <div className="bg-white p-3 rounded border">
              <h5 className="text-sm font-medium">Time-of-Access Irregularities</h5>
              <p className="text-xs text-muted-foreground">
                Identifies login attempts outside normal working hours or patterns.
              </p>
            </div>
            <div className="bg-white p-3 rounded border">
              <h5 className="text-sm font-medium">Device Fingerprinting</h5>
              <p className="text-xs text-muted-foreground">
                Recognizes device characteristics and validates against known user devices.
              </p>
            </div>
            <div className="bg-white p-3 rounded border">
              <h5 className="text-sm font-medium">Behavioral Deviations</h5>
              <p className="text-xs text-muted-foreground">
                Spots changes in typing patterns, navigation habits, and system interactions.
              </p>
            </div>
          </div>
          
          <p className="mt-2">
            When suspicious activity is detected, CyberLockX can automatically require additional verification, 
            limit access privileges, or freeze a session entirely based on the severity of the anomaly.
          </p>
        </div>
      ),
    },
    {
      id: 'compliance-automation',
      title: 'Healthcare Compliance Automation',
      content: (
        <div className="space-y-4">
          <p>
            CyberLockX simplifies complex healthcare compliance requirements through automation and continuous monitoring.
          </p>
          
          <h4 className="font-medium">Supported Frameworks:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            <div className="bg-white p-3 rounded border text-center">
              <h5 className="text-sm font-medium">HIPAA</h5>
              <p className="text-xs text-muted-foreground">
                Health Insurance Portability and Accountability Act
              </p>
            </div>
            <div className="bg-white p-3 rounded border text-center">
              <h5 className="text-sm font-medium">NIST</h5>
              <p className="text-xs text-muted-foreground">
                National Institute of Standards and Technology
              </p>
            </div>
            <div className="bg-white p-3 rounded border text-center">
              <h5 className="text-sm font-medium">CMMC</h5>
              <p className="text-xs text-muted-foreground">
                Cybersecurity Maturity Model Certification
              </p>
            </div>
            <div className="bg-white p-3 rounded border text-center">
              <h5 className="text-sm font-medium">HITRUST</h5>
              <p className="text-xs text-muted-foreground">
                Health Information Trust Alliance
              </p>
            </div>
          </div>
          
          <h4 className="font-medium mt-4">Key Automation Features:</h4>
          <ul className="list-disc pl-5">
            <li>Automatic policy enforcement based on regulatory requirements</li>
            <li>Real-time compliance monitoring and violation alerts</li>
            <li>Comprehensive audit trails with tamper-proof logging</li>
            <li>Built-in reporting for regulatory inspections and audits</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'pricing-model',
      title: 'Transparent Pricing Model',
      content: (
        <div className="space-y-4">
          <p>
            CyberLockX offers a simple, predictable pricing structure that makes budgeting easier for healthcare organizations.
          </p>
          
          <div className="bg-primary/5 p-4 rounded-md border border-primary/20">
            <h4 className="font-medium">User-Based Pricing</h4>
            <p className="text-sm mt-1">
              Rather than charging per device (which can lead to unpredictable costs in healthcare environments 
              with numerous connected devices), CyberLockX prices are based on active users or risk tiers.
            </p>
            
            <div className="mt-3 grid gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Small Organizations (1-100 users)</span>
                <span className="font-medium">Custom pricing</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Medium Organizations (101-500 users)</span>
                <span className="font-medium">Custom pricing</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Large Organizations (501+ users)</span>
                <span className="font-medium">Custom pricing</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-3">
              * All plans include core Zero Trust security features. Advanced features available in higher tiers.
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Contact our sales team for a detailed quote based on your organization's specific needs and security requirements.
          </p>
        </div>
      ),
    },
    {
      id: 'automated-response',
      title: 'Proactive Threat Hunting & Automated Response',
      content: (
        <div className="space-y-4">
          <p>
            CyberLockX combines AI-Human driven threat hunting with automated response capabilities to reduce dependency 
            on AI or human analysts, accelerate incident response with less false positives while retaining the emotional 
            intelligence. This increases efficiency, protection, response while reducing burn-out for humans who remain 
            in the forefront of our process strategy.
          </p>
          
          <h4 className="font-medium">Automated Response Capabilities:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="bg-white p-3 rounded border">
              <h5 className="text-sm font-medium">Session Freezing</h5>
              <p className="text-xs text-muted-foreground">
                Immediately pauses suspicious user sessions while maintaining system state for investigation.
              </p>
            </div>
            <div className="bg-white p-3 rounded border">
              <h5 className="text-sm font-medium">Step-Up Authentication</h5>
              <p className="text-xs text-muted-foreground">
                Dynamically requires additional verification when unusual behavior is detected.
              </p>
            </div>
            <div className="bg-white p-3 rounded border">
              <h5 className="text-sm font-medium">Automatic Access Revocation</h5>
              <p className="text-xs text-muted-foreground">
                Revokes compromised credentials and access tokens to prevent lateral movement.
              </p>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-md border border-green-100 mt-4">
            <h4 className="font-medium text-green-800">Benefits of AI-Human Collaboration</h4>
            <ul className="list-disc pl-5 text-sm text-green-700 mt-2">
              <li>Rapid response to threats (seconds versus hours)</li>
              <li>Consistent enforcement of security policies with human oversight</li>
              <li>Reduced alert fatigue and burnout for security teams</li>
              <li>24/7 protection with human intelligence in the loop</li>
              <li>Detailed forensic data collection during incidents</li>
              <li>Emotional intelligence applied to complex security decisions</li>
              <li>Decreased false positives compared to purely automated systems</li>
              <li>Improved analyst job satisfaction with reduced mundane tasks</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];
  
  // Filter items based on search query
  const filteredItems = searchQuery 
    ? knowledgeItems.filter(item => {
        // Always search in title
        const titleMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        
        // For content, we can only search in string content
        // React nodes cannot be searched directly, so we only search in titles
        let contentMatch = false;
        
        return titleMatch || contentMatch;
      })
    : knowledgeItems;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {description && <p className="mt-3 text-lg text-muted-foreground">{description}</p>}
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
          placeholder="Search knowledge base..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <KnowledgeItem
              key={item.id}
              title={item.title}
              content={item.content}
              defaultOpen={filteredItems.length === 1}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">No results found for "{searchQuery}"</p>
            <button 
              className="mt-2 text-primary hover:underline"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}