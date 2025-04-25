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
        doc.text("RASBITA™ GOV & MGNT SELF-SCORING Assessment", 16, yPosition + 8);
        
        yPosition += 15;
        
        // Governance Score
        doc.setFont("helvetica", "bold");
        doc.text("Governance Maturity:", 16, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(`Tier ${report.governanceMaturity.governanceScore}: ${getTierLabel(report.governanceMaturity.governanceScore)} (${report.governanceMaturity.governanceScore * 25}%)`, 90, yPosition);
        
        yPosition += 7;
        
        // Management Score
        doc.setFont("helvetica", "bold");
        doc.text("Management Maturity:", 16, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(`Tier ${report.governanceMaturity.managementScore}: ${getTierLabel(report.governanceMaturity.managementScore)} (${report.governanceMaturity.managementScore * 25}%)`, 90, yPosition);
        
        yPosition += 10;
        
        // Relationship note
        doc.setFontSize(9);
        doc.setFillColor(232, 240, 254); // Light blue
        doc.rect(14, yPosition, 182, 15, 'F');
        doc.setTextColor(0, 40, 140); // Dark blue
        doc.text("Note: Higher governance and management maturity (higher tier) typically results in a lower RASBITA™ risk", 16, yPosition + 5);
        doc.text("score, indicating reduced security risk exposure due to better cybersecurity practices.", 16, yPosition + 10);
        doc.setTextColor(0, 0, 0); // Reset to black
        
        yPosition += 20;
        
        // Governance assessment explanation
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Governance Assessment Explanation:", 16, yPosition);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        
        let govExplanation = "";
        switch(report.governanceMaturity.governanceScore) {
          case 0:
            govExplanation = "Organization has no formalized cybersecurity governance processes";
            break;
          case 1:
            govExplanation = "Organization has some informal risk practices but lacks consistency";
            break;
          case 2:
            govExplanation = "Organization has approved risk management practices with some documentation";
            break;
          case 3:
            govExplanation = "Organization consistently applies risk-informed policies across the enterprise";
            break;
          case 4:
            govExplanation = "Organization actively adapts cybersecurity practices to counter evolving threats";
            break;
          default:
            govExplanation = "Assessment not completed";
        }
        
        doc.text(govExplanation, 16, yPosition + 5);
        yPosition += 12;
        
        // Management assessment explanation
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Management Assessment Explanation:", 16, yPosition);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        
        let mgmtExplanation = "";
        switch(report.governanceMaturity.managementScore) {
          case 0:
            mgmtExplanation = "No defined management processes for cybersecurity implementation";
            break;
          case 1:
            mgmtExplanation = "Ad-hoc management of cybersecurity activities with limited awareness";
            break;
          case 2:
            mgmtExplanation = "Management follows structured approach with defined responsibilities";
            break;
          case 3:
            mgmtExplanation = "Established processes consistently managed with regular reviews";
            break;
          case 4:
            mgmtExplanation = "Proactive management practices that continuously improve security posture";
            break;
          default:
            mgmtExplanation = "Assessment not completed";
        }
        
        doc.text(mgmtExplanation, 16, yPosition + 5);
        yPosition += 15;
        
        // Tier Legend Table
        autoTable(doc, {
          startY: yPosition,
          head: [['Tier', 'Name', 'Percentage', 'Description']],
          body: [
            ['Tier 0', 'None', '0%', 'Completely uninformed about cybersecurity risk'],
            ['Tier 1', 'Partial', '25%', 'Limited awareness and implementation of risk practices'],
            ['Tier 2', 'Risk Informed', '50%', 'Risk-informed practices, but inconsistently implemented'],
            ['Tier 3', 'Repeatable', '75%', 'Formally approved, consistently implemented across organization'],
            ['Tier 4', 'Adaptive', '100%', 'Adaptive practices that continuously evolve with changing threats']
          ],
          theme: 'grid',
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [105, 42, 187], textColor: 255 },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 25 },
            2: { cellWidth: 20 },
            3: { cellWidth: 'auto' }
          }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 8;
        
        // Improvement recommendations
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Improvement Recommendations:", 16, yPosition);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        
        let recommendation = "";
        if (report.governanceMaturity.governanceScore < 4) {
          recommendation = `Focus on improving your governance practices from Tier ${report.governanceMaturity.governanceScore} to Tier ${Math.min(report.governanceMaturity.governanceScore + 1, 4)} by formalizing cybersecurity policies and risk management processes.`;
        } else {
          recommendation = "Maintain your excellent Tier 4 governance practices while continuously adapting to emerging threats and technologies.";
        }
        
        // Handle text wrapping for recommendation
        const splitRecommendation = doc.splitTextToSize(recommendation, 180);
        doc.text(splitRecommendation, 16, yPosition + 5);
        
        yPosition = (doc as any).lastAutoTable.finalY + 15;
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