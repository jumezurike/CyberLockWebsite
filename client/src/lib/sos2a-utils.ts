import { MatrixItem, SecurityRisk } from "./sos2a-types";

export function identifySecurityRisks(data: MatrixItem[]): SecurityRisk[] {
  const risks: SecurityRisk[] = [];
  
  data.forEach(item => {
    // Check for missing management controls
    if (item.managementControls?.applicable && !item.managementControls?.implemented) {
      risks.push({
        severity: 'Medium',
        title: `Management Controls Gap in ${item.infraType}`,
        description: `Required management controls are not implemented for ${item.infraType} systems.`
      });
    }
    
    // Check for missing technology controls
    if (item.technologyControls?.applicable && !item.technologyControls?.implemented) {
      risks.push({
        severity: 'High',
        title: `Technology Controls Missing for ${item.infraType}`,
        description: `Critical technology controls are not implemented for ${item.infraType} infrastructure.`
      });
    }
    
    // Check for missing operation controls
    if (item.operationControls?.applicable && !item.operationControls?.implemented) {
      risks.push({
        severity: 'High',
        title: `Operation Controls Missing for ${item.infraType}`,
        description: `Operation controls are not implemented for ${item.infraType} infrastructure, creating security gaps.`
      });
    }
  });
  
  return risks.slice(0, 10); // Limit to top 10 risks
}

export function categorizeLVulnerabilities(data: MatrixItem[]) {
  const vulnerabilities = {
    critical: [] as string[],
    high: [] as string[],
    medium: [] as string[],
    low: [] as string[]
  };
  
  data.forEach(item => {
    if (item.operationControls?.applicable && !item.operationControls?.implemented) {
      vulnerabilities.high.push(`Operation control gaps in ${item.infraType}`);
    }
    
    if (item.technologyControls?.applicable && !item.technologyControls?.implemented) {
      vulnerabilities.critical.push(`Technology control failures in ${item.infraType}`);
    }
    
    if (item.managementControls?.applicable && !item.managementControls?.implemented) {
      vulnerabilities.medium.push(`Management control gaps in ${item.infraType}`);
    }
  });
  
  return vulnerabilities;
}

export function identifyFrameworkGaps(data: MatrixItem[]) {
  const gaps: string[] = [];
  
  data.forEach(item => {
    if (item.operationControls?.frameworks?.length === 0) {
      gaps.push(`No operation frameworks defined for ${item.infraType}`);
    }
    
    if (item.managementControls?.frameworks?.length === 0) {
      gaps.push(`No management frameworks defined for ${item.infraType}`);
    }
    
    if (item.technologyControls?.frameworks?.length === 0) {
      gaps.push(`No technology frameworks defined for ${item.infraType}`);
    }
  });
  
  return gaps;
}

export function evaluateComplianceStatus(data: MatrixItem[]) {
  const total = data.length;
  const compliant = data.filter(item => 
    item.operationControls?.implemented && 
    item.managementControls?.implemented &&
    item.technologyControls?.implemented
  ).length;
  
  return {
    percentage: Math.round((compliant / total) * 100),
    compliant,
    total,
    status: compliant / total > 0.8 ? 'Good' : compliant / total > 0.5 ? 'Fair' : 'Poor'
  };
}

export function generateScorecardData(data: MatrixItem[], reportType: string) {
  const parameters = [
    { parameter: "Administrative Controls", weight: 25, score: calculateAdminScore(data) },
    { parameter: "Management Controls", weight: 25, score: calculateMgmtScore(data) },
    { parameter: "Technology Controls", weight: 25, score: calculateTechScore(data) },
    { parameter: "Framework Implementation", weight: 25, score: calculateFrameworkScore(data) }
  ];
  
  return parameters;
}

function calculateAdminScore(data: MatrixItem[]): number {
  const implemented = data.filter(item => item.operationControls?.implemented).length;
  return Math.round((implemented / data.length) * 100);
}

function calculateMgmtScore(data: MatrixItem[]): number {
  const applicable = data.filter(item => item.managementControls.applicable);
  const implemented = applicable.filter(item => item.managementControls.implemented).length;
  return applicable.length > 0 ? Math.round((implemented / applicable.length) * 100) : 0;
}

function calculateTechScore(data: MatrixItem[]): number {
  const applicable = data.filter(item => item.technologyControls.applicable);
  const implemented = applicable.filter(item => item.technologyControls.implemented).length;
  return applicable.length > 0 ? Math.round((implemented / applicable.length) * 100) : 0;
}

function calculateFrameworkScore(data: MatrixItem[]): number {
  const totalFrameworks = data.reduce((sum, item) => 
    sum + (item.operationControls?.frameworks?.length || 0) + 
    (item.managementControls?.frameworks?.length || 0) + 
    (item.technologyControls?.frameworks?.length || 0), 0);
  
  return totalFrameworks > 0 ? Math.min(100, Math.round(totalFrameworks * 10)) : 0;
}