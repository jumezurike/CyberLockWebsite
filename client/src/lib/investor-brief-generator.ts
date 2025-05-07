import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

interface EarlyAccessSubmission {
  fullName: string;
  email: string;
  company: string;
  phone?: string;
  companySize?: string;
  industry?: string;
  interestedIn: string[];
  investmentLevel?: string;
  additionalInfo?: string;
}

/**
 * Generates a professional investor brief PDF for a CyberLockX early access submission
 */
export function generateInvestorBrief(submission: EarlyAccessSubmission): void {
  const doc = new jsPDF();
  
  // Add logos and headers
  const pageWidth = doc.internal.pageSize.width;
  
  // Title
  doc.setFontSize(24);
  doc.setTextColor(0, 60, 113); // CyberLockX blue
  doc.text('CyberLockX Investment Brief', pageWidth / 2, 20, { align: 'center' });
  
  // Company info section
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('Company Information', 14, 35);
  
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  
  // Company details table
  autoTable(doc, {
    startY: 40,
    head: [['Detail', 'Value']],
    body: [
      ['Company Name', submission.company || 'Not provided'],
      ['Industry', submission.industry || 'Not provided'],
      ['Company Size', submission.companySize || 'Not provided'],
      ['Point of Contact', submission.fullName],
      ['Contact Email', submission.email],
      ['Contact Phone', submission.phone || 'Not provided'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [0, 60, 113], textColor: [255, 255, 255] },
    styles: { overflow: 'linebreak', cellWidth: 'wrap' },
    columnStyles: { 0: { cellWidth: 50 } },
  });
  
  // Investment & Interest Information
  const finalY = (doc as any).lastAutoTable.finalY || 120;
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('Investment Information', 14, finalY + 15);
  
  // Interest areas
  autoTable(doc, {
    startY: finalY + 20,
    head: [['Areas of Interest']],
    body: submission.interestedIn.map(item => [item]),
    theme: 'grid',
    headStyles: { fillColor: [0, 60, 113], textColor: [255, 255, 255] },
  });
  
  // Investment level
  const interestY = (doc as any).lastAutoTable.finalY || 160;
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Potential Investment Level:', 14, interestY + 10);
  doc.setFontSize(16);
  doc.setTextColor(0, 60, 113);
  doc.text(submission.investmentLevel || 'To be determined', 14, interestY + 20);
  
  // Additional information
  if (submission.additionalInfo && submission.additionalInfo.trim() !== '') {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Additional Information:', 14, interestY + 35);
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    
    // Split long text into multiple lines
    const textLines = doc.splitTextToSize(submission.additionalInfo, pageWidth - 30);
    doc.text(textLines, 14, interestY + 45);
  }
  
  // CyberLockX Value Proposition
  const valuePropositionY = interestY + (submission.additionalInfo ? 80 : 40);
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('CyberLockX Value Proposition', 14, valuePropositionY);
  
  const valuePoints = [
    ['Market Opportunity', 'The cybersecurity market for healthcare is projected to reach $125B by 2027 with a CAGR of 19.3%. CyberLockX is positioned to capture significant market share.'],
    ['Patented Technology', 'Triple-patented security technology including quantum-safe encryption, RASBITA risk management, and AFAAI language augmentation.'],
    ['Regulatory Compliance', 'Automated compliance with healthcare regulations (HIPAA, GDPR) providing immediate value to healthcare organizations.'],
    ['Competitive Advantage', 'The only healthcare-focused platform that eliminates threats, automates compliance, and unifies clinical apps/devices with patented security.'],
  ];
  
  autoTable(doc, {
    startY: valuePropositionY + 5,
    head: [['Advantage', 'Description']],
    body: valuePoints,
    theme: 'grid',
    headStyles: { fillColor: [0, 60, 113], textColor: [255, 255, 255] },
    styles: { overflow: 'linebreak', cellWidth: 'wrap' },
    columnStyles: { 0: { cellWidth: 50 } },
  });
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('CONFIDENTIAL - For investment purposes only', pageWidth / 2, pageHeight - 10, { align: 'center' });
  doc.text('© 2025 CyberLockX - All Rights Reserved', pageWidth / 2, pageHeight - 6, { align: 'center' });
  
  // Download the PDF
  doc.save(`CyberLockX_Investor_Brief_${submission.company.replace(/[^a-z0-9]/gi, '_')}.pdf`);
}