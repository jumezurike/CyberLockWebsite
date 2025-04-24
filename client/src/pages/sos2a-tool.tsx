import React, { useState } from "react";
import { Sos2aFormData, MatrixItem, AssessmentReport } from "@/lib/sos2a-types";
import QuestionnaireForm from "@/components/sos2a/questionnaire-form";
import MatrixForm from "@/components/sos2a/matrix-form";
import ReportDisplay from "@/components/sos2a/report-display";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Sos2aTool() {
  // State for multi-step form
  const [step, setStep] = useState<'questionnaire' | 'matrix' | 'report'>('questionnaire');
  const [formData, setFormData] = useState<Sos2aFormData | null>(null);
  const [matrixData, setMatrixData] = useState<MatrixItem[] | null>(null);
  const [report, setReport] = useState<AssessmentReport | null>(null);
  
  // Progress percentage based on current step
  const progressPercentage = step === 'questionnaire' ? 33 : step === 'matrix' ? 66 : 100;
  
  // Handle form submission
  const handleQuestionnaireSubmit = (data: Sos2aFormData) => {
    setFormData(data);
    setStep('matrix');
  };
  
  // Handle matrix submission
  const handleMatrixSubmit = (data: MatrixItem[]) => {
    setMatrixData(data);
    
    // Generate the report based on the form and matrix data
    const generatedReport: AssessmentReport = {
      id: 'report-' + Date.now(),
      businessId: data[0].infraType + '-' + Date.now(),
      reportType: formData?.reportType || 'preliminary',
      createdAt: new Date().toISOString(),
      securityScore: calculateSecurityScore(data),
      businessLocation: formData?.businessLocation || { state: "Unknown", country: "Unknown" },
      industry: formData?.industry || "Unknown",
      businessServices: formData?.businessServices || "Unknown",
      operationModes: formData?.operationMode || [],
      internetPresence: formData?.internetPresence || [],
      findings: identifySecurityRisks(data),
      vulnerabilities: categorizeLVulnerabilities(data),
      recommendations: generateRecommendations(data),
      frameworkGaps: identifyFrameworkGaps(data),
      complianceStatus: evaluateComplianceStatus(data),
      policyDocumentStatus: evaluatePolicyDocumentStatus(data),
      osHardeningStatus: evaluateOsHardeningStatus(data),
      mitreAttackCoverage: evaluateMitreAttackCoverage(data),
      matrixData: data,
      rasbitaScore: calculateRasbitaScore(data),
    };
    
    setReport(generatedReport);
    setStep('report');
  };
  
  // Go back to previous step
  const handleBack = () => {
    if (step === 'matrix') setStep('questionnaire');
    if (step === 'report') setStep('matrix');
  };
  
  // Calculate security score based on matrix data
  const calculateSecurityScore = (data: MatrixItem[]): number => {
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    // Calculate score based on implementations
    data.forEach(item => {
      // Operation controls
      if (item.operationControls.applicable) {
        maxPossibleScore += 10;
        if (item.operationControls.implemented) totalScore += 10;
      }
      
      // Management controls
      if (item.managementControls.applicable) {
        maxPossibleScore += 10;
        if (item.managementControls.implemented) totalScore += 10;
      }
      
      // Technology controls
      if (item.technologyControls.applicable) {
        maxPossibleScore += 10;
        if (item.technologyControls.implemented) totalScore += 10;
      }
      
      // OS Hardening
      maxPossibleScore += 5;
      if (item.osHardening.stigScap) totalScore += 5;
      
      // Education & Awareness
      if (item.educationAwareness) {
        totalScore += 5;
      }
      maxPossibleScore += 5;
    });
    
    // Return percentage score (0 to 100)
    return maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  };
  
  // Identify security risks based on matrix data
  const identifySecurityRisks = (data: MatrixItem[]) => {
    const prioritizedRisks = [];
    
    // Collect all risks from matrix data
    const allRisks = data.flatMap(item => 
      item.risks.map(risk => ({
        severity: determineSeverity(risk),
        title: risk,
        description: `Risk associated with ${item.infraType} infrastructure.`
      }))
    );
    
    // Filter out duplicate risks by title
    const uniqueRisks = allRisks.filter((risk, index, self) => 
      index === self.findIndex(r => r.title === risk.title)
    );
    
    // Prioritize by severity: High, Medium, Low
    const highRisks = uniqueRisks.filter(risk => risk.severity === 'High');
    const mediumRisks = uniqueRisks.filter(risk => risk.severity === 'Medium');
    const lowRisks = uniqueRisks.filter(risk => risk.severity === 'Low');
    
    return [...highRisks, ...mediumRisks, ...lowRisks];
  };
  
  // Determine risk severity based on risk title (simple heuristic)
  const determineSeverity = (riskTitle: string): 'High' | 'Medium' | 'Low' => {
    const highSeverityKeywords = ['breach', 'attack', 'unauthorized', 'malware', 'ransomware', 'theft', 'exposure'];
    const mediumSeverityKeywords = ['disruption', 'misconfiguration', 'default', 'outdated', 'weak', 'insecure'];
    
    const lowercaseTitle = riskTitle.toLowerCase();
    
    if (highSeverityKeywords.some(keyword => lowercaseTitle.includes(keyword))) {
      return 'High';
    } else if (mediumSeverityKeywords.some(keyword => lowercaseTitle.includes(keyword))) {
      return 'Medium';
    } else {
      return 'Low';
    }
  };
  
  // Categorize vulnerabilities by severity
  const categorizeLVulnerabilities = (data: MatrixItem[]) => {
    const allVulnerabilities = data.flatMap(item => item.vulnerabilities);
    
    // Simple categorization based on keywords
    const critical: string[] = [];
    const high: string[] = [];
    const medium: string[] = [];
    const low: string[] = [];
    
    const criticalKeywords = ['unpatched', 'outdated', 'default password', 'unsecured', 'exposed'];
    const highKeywords = ['weak', 'inadequate', 'misconfigured', 'insufficient'];
    const mediumKeywords = ['limited', 'incomplete', 'unclear', 'lack of'];
    
    allVulnerabilities.forEach(vuln => {
      const lowercaseVuln = vuln.toLowerCase();
      
      if (criticalKeywords.some(keyword => lowercaseVuln.includes(keyword))) {
        critical.push(vuln);
      } else if (highKeywords.some(keyword => lowercaseVuln.includes(keyword))) {
        high.push(vuln);
      } else if (mediumKeywords.some(keyword => lowercaseVuln.includes(keyword))) {
        medium.push(vuln);
      } else {
        low.push(vuln);
      }
    });
    
    return { critical, high, medium, low };
  };
  
  // Generate recommendations based on matrix data
  const generateRecommendations = (data: MatrixItem[]) => {
    const immediate: string[] = [];
    const shortTerm: string[] = [];
    const longTerm: string[] = [];
    
    // Check implementation status for critical controls
    data.forEach(item => {
      // If operation controls are not implemented, add recommendation
      if (item.operationControls.applicable && !item.operationControls.implemented) {
        immediate.push(`Implement operation controls for ${item.infraType} infrastructure using ${item.operationControls.frameworks.join(', ')} frameworks.`);
      }
      
      // If management controls are not implemented, add recommendation
      if (item.managementControls.applicable && !item.managementControls.implemented) {
        shortTerm.push(`Implement management controls for ${item.infraType} infrastructure using ${item.managementControls.frameworks.join(', ')} frameworks.`);
      }
      
      // If technology controls are not implemented, add recommendation
      if (item.technologyControls.applicable && !item.technologyControls.implemented) {
        shortTerm.push(`Implement technology controls for ${item.infraType} infrastructure using ${item.technologyControls.frameworks.join(', ')} frameworks.`);
      }
      
      // If OS hardening is not implemented but needed
      if (!item.osHardening.stigScap) {
        longTerm.push(`Implement OS hardening through STIG/SCAP for ${item.infraType} infrastructure.`);
      }
      
      // If education & awareness is needed but not implemented
      if (!item.educationAwareness) {
        immediate.push(`Develop and implement education & awareness training for users of ${item.infraType} infrastructure.`);
      }
    });
    
    return { immediate, shortTerm, longTerm };
  };
  
  // Identify framework gaps based on matrix data
  const identifyFrameworkGaps = (data: MatrixItem[]) => {
    const operations: string[] = [];
    const management: string[] = [];
    const technology: string[] = [];
    
    // Collect all implementation gaps for each control category
    data.forEach(item => {
      if (item.operationControls.gaps.length > 0) {
        operations.push(`${item.infraType}: ${item.operationControls.gaps.join(', ')}`);
      }
      
      if (item.managementControls.gaps.length > 0) {
        management.push(`${item.infraType}: ${item.managementControls.gaps.join(', ')}`);
      }
      
      if (item.technologyControls.gaps.length > 0) {
        technology.push(`${item.infraType}: ${item.technologyControls.gaps.join(', ')}`);
      }
    });
    
    return { operations, management, technology };
  };
  
  // Evaluate compliance status based on matrix data
  const evaluateComplianceStatus = (data: MatrixItem[]) => {
    const standards: any[] = [];
    const regulations: any[] = [];
    const frameworks: any[] = [];
    
    // For simplicity, we'll just check if any standards, regulations, or frameworks are needed
    // but not implemented and mark them as "Non-Compliant", otherwise "Compliant"
    
    // Identify applicable standards and their status
    const standardsMap = new Map<string, boolean>();
    data.forEach(item => {
      Object.entries(item.standards).forEach(([key, value]) => {
        if (value) {
          // If already in map and compliant, keep it as is
          // Otherwise, set the value (true for first occurrence, false if any item is non-compliant)
          const current = standardsMap.get(key);
          if (current !== false) { // Only update if not already marked non-compliant
            standardsMap.set(key, true);
          }
        }
      });
    });
    
    // Convert map to array of ComplianceStatus objects
    standardsMap.forEach((isCompliant, standardName) => {
      standards.push({
        standard: standardName,
        status: isCompliant ? 'Compliant' : 'Non-Compliant',
        gaps: [],
      });
    });
    
    // Similar logic for regulatory requirements
    const regulationsMap = new Map<string, boolean>();
    data.forEach(item => {
      Object.entries(item.regulatoryRequirements).forEach(([key, value]) => {
        if (value) {
          const current = regulationsMap.get(key);
          if (current !== false) {
            regulationsMap.set(key, true);
          }
        }
      });
    });
    
    regulationsMap.forEach((isCompliant, regName) => {
      regulations.push({
        standard: regName,
        status: isCompliant ? 'Compliant' : 'Non-Compliant',
        gaps: [],
      });
    });
    
    // For frameworks, use the implementation status from controls
    const frameworksMap = new Map<string, boolean>();
    data.forEach(item => {
      // Operation control frameworks
      item.operationControls.frameworks.forEach(framework => {
        const current = frameworksMap.get(framework);
        const isImplemented = item.operationControls.implemented;
        if (current !== false) { // Only update if not already marked non-compliant
          frameworksMap.set(framework, isImplemented);
        }
      });
      
      // Management control frameworks
      item.managementControls.frameworks.forEach(framework => {
        const current = frameworksMap.get(framework);
        const isImplemented = item.managementControls.implemented;
        if (current !== false) {
          frameworksMap.set(framework, isImplemented);
        }
      });
      
      // Technology control frameworks
      item.technologyControls.frameworks.forEach(framework => {
        const current = frameworksMap.get(framework);
        const isImplemented = item.technologyControls.implemented;
        if (current !== false) {
          frameworksMap.set(framework, isImplemented);
        }
      });
    });
    
    frameworksMap.forEach((isImplemented, frameworkName) => {
      frameworks.push({
        standard: frameworkName,
        status: isImplemented ? 'Compliant' : 'Non-Compliant',
        gaps: [],
      });
    });
    
    return { standards, regulations, frameworks };
  };
  
  // Evaluate policy document status based on matrix data
  const evaluatePolicyDocumentStatus = (data: MatrixItem[]) => {
    const existing: string[] = [];
    const missing: string[] = [];
    const recommendations: string[] = [];
    
    // Collect all policy documents from all infrastructure items
    const allPolicies = new Set<string>();
    const allProcedures = new Set<string>();
    const allPlans = new Set<string>();
    const allProcesses = new Set<string>();
    
    data.forEach(item => {
      item.policyDocuments.policies.forEach(policy => allPolicies.add(policy));
      item.policyDocuments.procedures.forEach(procedure => allProcedures.add(procedure));
      item.policyDocuments.plans.forEach(plan => allPlans.add(plan));
      item.policyDocuments.processes.forEach(process => allProcesses.add(process));
    });
    
    // For now, assume all are missing
    // In a real implementation, we would check against formData or stored data
    allPolicies.forEach(policy => {
      missing.push(`Policy: ${policy}`);
      recommendations.push(`Develop and implement ${policy} policy`);
    });
    
    allProcedures.forEach(procedure => {
      missing.push(`Procedure: ${procedure}`);
      recommendations.push(`Develop and implement ${procedure} procedure`);
    });
    
    allPlans.forEach(plan => {
      missing.push(`Plan: ${plan}`);
      recommendations.push(`Develop and implement ${plan}`);
    });
    
    allProcesses.forEach(process => {
      missing.push(`Process: ${process}`);
      recommendations.push(`Develop and implement ${process}`);
    });
    
    return { existing, missing, recommendations };
  };
  
  // Evaluate OS hardening status based on matrix data
  const evaluateOsHardeningStatus = (data: MatrixItem[]) => {
    const stigNeeded = data.some(item => item.technologyControls.osHardening.stig);
    const scapNeeded = data.some(item => item.technologyControls.osHardening.scap);
    
    // Assume none are implemented for this example
    const stig = {
      compliant: false,
      gaps: ['STIG is not implemented for required systems'],
    };
    
    const scap = {
      compliant: false,
      gaps: ['SCAP is not implemented for required systems'],
    };
    
    return { stig, scap };
  };
  
  // Evaluate MITRE ATT&CK coverage based on matrix data
  const evaluateMitreAttackCoverage = (data: MatrixItem[]) => {
    const covered: string[] = [];
    const vulnerable: string[] = [];
    const recommendations: string[] = [];
    
    // Collect all MITRE tactics and techniques
    const allTactics = new Set<string>();
    const allTechniques = new Set<string>();
    
    data.forEach(item => {
      item.mitreTactics.forEach(tactic => allTactics.add(tactic));
      item.mitreTechniques.forEach(technique => allTechniques.add(technique));
    });
    
    // For now, assume none are covered
    allTactics.forEach(tactic => {
      vulnerable.push(tactic);
      recommendations.push(`Implement controls to mitigate ${tactic} tactics`);
    });
    
    allTechniques.forEach(technique => {
      vulnerable.push(technique);
      recommendations.push(`Implement controls to mitigate ${technique} technique`);
    });
    
    return { covered, vulnerable, recommendations };
  };
  
  // Calculate RASBITA score based on matrix data
  const calculateRasbitaScore = (data: MatrixItem[]) => {
    // This is a simplified version of how the RASBITA score might be calculated
    const riskScore = 100 - Math.min(data.flatMap(item => item.risks).length * 5, 50);
    const adversarialInsightScore = Math.min(data.flatMap(item => item.mitreTechniques).length * 10, 100);
    const securityControlsScore = calculateSecurityControlsScore(data);
    const businessImpactScore = 70; // Placeholder value
    const informationAssuranceScore = data.some(item => item.osHardening.stigScap) ? 80 : 40;
    const threatIntelligenceScore = 60; // Placeholder value
    const architectureScore = data.some(item => 
      item.operationControls.implemented && 
      item.managementControls.implemented && 
      item.technologyControls.implemented
    ) ? 90 : 50;
    
    const totalScore = Math.round(
      (riskScore + adversarialInsightScore + securityControlsScore + 
        businessImpactScore + informationAssuranceScore + 
        threatIntelligenceScore + architectureScore) / 7
    );
    
    return {
      total: totalScore,
      categories: {
        risk: riskScore,
        adversarialInsight: adversarialInsightScore,
        securityControls: securityControlsScore,
        businessImpact: businessImpactScore,
        informationAssurance: informationAssuranceScore,
        threatIntelligence: threatIntelligenceScore,
        architecture: architectureScore,
      }
    };
  };
  
  // Calculate security controls score for RASBITA
  const calculateSecurityControlsScore = (data: MatrixItem[]): number => {
    const operationScore = calculateOperationScore(data);
    const managementScore = calculateManagementScore(data);
    const technologyScore = calculateTechnologyScore(data);
    
    return Math.round((operationScore + managementScore + technologyScore) / 3);
  };
  
  // Calculate operation score
  const calculateOperationScore = (data: MatrixItem[]): number => {
    const totalItems = data.length;
    const implementedItems = data.filter(item => item.operationControls.implemented).length;
    
    return Math.round((implementedItems / totalItems) * 100);
  };
  
  // Calculate management score
  const calculateManagementScore = (data: MatrixItem[]): number => {
    const totalItems = data.length;
    const implementedItems = data.filter(item => item.managementControls.implemented).length;
    
    return Math.round((implementedItems / totalItems) * 100);
  };
  
  // Calculate technology score
  const calculateTechnologyScore = (data: MatrixItem[]): number => {
    const totalItems = data.length;
    const implementedItems = data.filter(item => item.technologyControls.implemented).length;
    
    return Math.round((implementedItems / totalItems) * 100);
  };
  
  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            SMB Organizational and System Security Analysis (SOS²A)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Assessment Progress</h2>
            <Progress value={progressPercentage} className="h-2" />
            
            <div className="flex justify-between text-sm">
              <div className={`${step === 'questionnaire' ? 'text-primary font-medium' : ''}`}>
                1. Questionnaire
              </div>
              <div className={`${step === 'matrix' ? 'text-primary font-medium' : ''}`}>
                2. Interview & Matrix Population (Gap Analysis)
              </div>
              <div className={`${step === 'report' ? 'text-primary font-medium' : ''}`}>
                3. {formData?.reportType === 'comprehensive' ? 'Comprehensive' : 'Preliminary'} Report
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Step 1: Questionnaire */}
      {step === 'questionnaire' && (
        <div className="questionnaire-container">
          <QuestionnaireForm onSubmit={handleQuestionnaireSubmit} />
        </div>
      )}
      
      {/* Step 2: Matrix Population */}
      {step === 'matrix' && formData && (
        <div className="matrix-container">
          <MatrixForm 
            operationModes={formData.operationMode}
            internetPresence={formData.internetPresence}
            onSubmit={handleMatrixSubmit}
            onBack={handleBack}
          />
        </div>
      )}
      
      {/* Step 3: Report Display */}
      {step === 'report' && report && (
        <div className="report-container">
          <ReportDisplay report={report} onBack={handleBack} />
        </div>
      )}
    </div>
  );
}