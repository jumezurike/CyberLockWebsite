import React from 'react';
import { Button } from "@/components/ui/button";
import { RasbitaReport } from "@shared/schema";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
// Helper function to get tier label
function getTierLabel(score: number | null): string {
  if (score === null) return "Not assessed";
  
  switch (score) {
    case 0: return "None";
    case 1: return "Partial";
    case 2: return "Risk Informed";
    case 3: return "Repeatable";
    case 4: return "Adaptive";
    default: return "Unknown";
  }
}

interface PdfExportProps {
  report: RasbitaReport;
}

export function PdfExport({ report }: PdfExportProps) {
  const exportToPdf = () => {
    try {
      const doc = new jsPDF();
      
      // Document title
      doc.setFontSize(20);
      doc.setTextColor(105, 42, 187); // Purple theme color
      doc.text("RASBITA™ Security Incident Report", 14, 20);
      
      // Report meta information
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Company: ${report.company || 'N/A'}`, 14, 30);
      doc.text(`Incident: ${report.title || 'N/A'}`, 14, 37);
      doc.text(`Date: ${new Date(report.createdAt || new Date()).toLocaleDateString()}`, 14, 44);
      doc.text(`Category: ${report.incidentCategory || 'N/A'}`, 14, 51);
      
      // RISK SCORE
      doc.setFillColor(245, 245, 245);
      doc.rect(14, 56, 182, 12, 'F');
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Risk Score", 16, 64);
      doc.setFont("helvetica", "normal");
      
      const riskScore = parseFloat(report.overallRiskScore || "0");
      let riskColor;
      let riskLevel;
      
      if (riskScore > 46) {
        riskColor = [220, 53, 69]; // Red
        riskLevel = "P1 - Critical";
      } else if (riskScore >= 36) {
        riskColor = [253, 126, 20]; // Orange
        riskLevel = "P2 - High";
      } else if (riskScore >= 21) {
        riskColor = [255, 193, 7]; // Yellow
        riskLevel = "P3 - Medium";
      } else {
        riskColor = [40, 167, 69]; // Green
        riskLevel = "P4 - Low";
      }
      
      doc.setTextColor(...riskColor);
      doc.text(`${riskScore.toFixed(1)} - ${riskLevel}`, 100, 64);
      doc.setTextColor(0, 0, 0);
      
      // GOVERNANCE & MANAGEMENT MATURITY
      if (report.governanceMaturity) {
        let yPosition = 75;
        
        doc.setFillColor(245, 245, 245);
        doc.rect(14, yPosition, 182, 12, 'F');
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Cybersecurity Risk Governance & Management Assessment", 16, yPosition + 8);
        
        yPosition += 15;
        
        // Governance Score
        doc.setFont("helvetica", "bold");
        doc.text("Governance Maturity:", 16, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(`Tier ${report.governanceMaturity.governanceScore}: ${getTierLabel(report.governanceMaturity.governanceScore)}`, 90, yPosition);
        
        yPosition += 7;
        
        // Management Score
        doc.setFont("helvetica", "bold");
        doc.text("Management Maturity:", 16, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(`Tier ${report.governanceMaturity.managementScore}: ${getTierLabel(report.governanceMaturity.managementScore)}`, 90, yPosition);
        
        yPosition += 14;
        
        // Tier Legend Table
        autoTable(doc, {
          startY: yPosition,
          head: [['Tier', 'Name', 'Description']],
          body: [
            ['Tier 0 (0-0)', 'None', '0% - Completely uninformed about cybersecurity risk'],
            ['Tier 1 (0-1)', 'Partial', '25% - Limited awareness and implementation'],
            ['Tier 2 (1-2)', 'Risk Informed', '50% - Risk-informed, inconsistently implemented'],
            ['Tier 3 (2-3)', 'Repeatable', '75% - Formally approved, consistently implemented'],
            ['Tier 4 (3-4)', 'Adaptive', '100% - Adaptive, continuously improved']
          ],
          theme: 'grid',
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [105, 42, 187], textColor: 255 },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 30 },
            2: { cellWidth: 'auto' }
          }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }
      
      // FINANCIAL IMPACT SUMMARY
      if (report.financialSummary) {
        let yPosition = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 15 : 120;
        
        doc.setFillColor(245, 245, 245);
        doc.rect(14, yPosition, 182, 12, 'F');
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Financial Impact Analysis", 16, yPosition + 8);
        
        yPosition += 15;
        
        autoTable(doc, {
          startY: yPosition,
          head: [['Metric', 'Value', 'Description']],
          body: [
            ['AV (Asset Value)', `$${report.financialSummary.assetValue || 0}`, 'Dollar value of the affected asset'],
            ['EF (Exposure Factor)', `${report.financialSummary.exposureFactor || 0}%`, 'Percentage of asset value at risk'],
            ['SLE (Single Loss Expectancy)', `$${report.financialSummary.singleLossExpectancy || 0}`, 'Financial loss from a single incident'],
            ['ARO (Annual Rate of Occurrence)', report.financialSummary.annualRateOccurrence || '0', 'Expected annual frequency of this incident'],
            ['ALE (Annual Loss Expectancy)', `$${report.financialSummary.annualLossExpectancy || 0}`, 'Expected annual cost of this incident'],
            ['ACS (Annual Countermeasure Savings)', `$${report.financialSummary.annualCountermeasureSavings || 0}`, 'Annual savings from implementing countermeasures'],
            ['NRRB (Net Risk Reduction Benefit)', `$${report.financialSummary.netRiskReductionBenefit || 0}`, 'Net benefit after implementation costs'],
          ],
          theme: 'grid',
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [105, 42, 187], textColor: 255 },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 30 },
            2: { cellWidth: 'auto' }
          }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }
      
      // RASBITA Categories
      if (report.rasbitaCategories && report.rasbitaCategories.length > 0) {
        doc.addPage();
        
        doc.setFontSize(14);
        doc.setTextColor(105, 42, 187); // Purple theme color
        doc.text("NIST CSF 2.0 Domain Assessment", 14, 20);
        
        autoTable(doc, {
          startY: 25,
          head: [['Domain', 'Score', 'Explanation']],
          body: report.rasbitaCategories.map(category => [
            category.category, 
            category.score || '0', 
            category.description || 'N/A'
          ]),
          theme: 'grid',
          styles: { fontSize: 9, cellPadding: 4 },
          headStyles: { fillColor: [105, 42, 187], textColor: 255 },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 15 },
            2: { cellWidth: 'auto' }
          }
        });
      }
      
      // Risk Items and technical details
      if (report.riskItems && report.riskItems.length > 0) {
        doc.addPage();
        
        doc.setFontSize(14);
        doc.setTextColor(105, 42, 187); // Purple theme color
        doc.text("Risk Assessment Details", 14, 20);
        
        autoTable(doc, {
          startY: 25,
          head: [['Factor', 'Value', 'Notes']],
          body: report.riskItems.map(item => [
            item.factor, 
            item.value || 'N/A', 
            item.notes || 'N/A'
          ]),
          theme: 'grid',
          styles: { fontSize: 9, cellPadding: 4 },
          headStyles: { fillColor: [105, 42, 187], textColor: 255 },
          columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 30 },
            2: { cellWidth: 'auto' }
          }
        });
      }
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `CyberLockX RASBITA™ Report | Generated on ${new Date().toLocaleString()} | Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2, 
          doc.internal.pageSize.getHeight() - 10, 
          { align: 'center' }
        );
      }
      
      // Save PDF
      doc.save(`RASBITA-Report-${report.id}-${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    }
  };

  return (
    <Button 
      onClick={exportToPdf} 
      className="bg-chart-4 hover:bg-chart-4/80 text-white flex items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <path d="M8 13h8"/>
        <path d="M8 17h8"/>
        <path d="M8 9h2"/>
      </svg>
      Export PDF
    </Button>
  );
}