import React from "react";
import { AssessmentReport } from "@/lib/sos2a-types";
// Import the 514-line component
import EnhancedReportDisplay from "../../../JUDECMISSINGCODE";

// Sample test data to preview the content
const testReport: AssessmentReport = {
  id: "test-514",
  businessName: "Healthcare Test Organization",
  industry: "Healthcare",
  location: "Test City, USA",
  createdAt: "2025-01-15T10:30:00Z",
  reportType: "preliminary",
  securityScore: 67,
  age: 12,
  summary: {
    criticalVulnerabilities: 3,
    highRisks: 7,
    mediumRisks: 12,
    lowRisks: 8
  },
  rasbitaScore: {
    overall: 67,
    categories: {
      risk: 42,
      securityControls: 0,
      architecture: 0,
      govern: 65,
      identify: 70,
      protect: 60,
      detect: 45,
      respond: 55,
      recover: 50
    }
  }
};

export default function TestStandalone() {
  const handleBack = () => {
    console.log("Back button clicked");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary mb-2">
            Standalone Test Page - 514 Line Content Preview
          </h1>
          <p className="text-muted-foreground">
            Testing the content from git commit f98d9b9 (514 lines) saved as JUDECMISSINGCODE
          </p>
        </div>
        
        <EnhancedReportDisplay 
          report={testReport}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}