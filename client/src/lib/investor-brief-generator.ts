import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { UserOptions } from 'jspdf-autotable';

// Extend jsPDF to include autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}

export const generateInvestorBrief = () => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add company logo (simulated as text for now)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(102, 50, 160); // Purple color
  doc.text("CyberLockX", 105, 20, { align: "center" });
  
  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.text("Investor Brief", 105, 35, { align: "center" });
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(102, 50, 160); // Purple line
  doc.line(20, 40, 190, 40);
  
  // Company overview
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Company Overview", 20, 55);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const companyOverview = 
    "CyberLockX is a specialized healthcare application security platform designed to " +
    "protect sensitive medical systems and patient data through advanced AI-driven security insights. " +
    "Founded in 2022, our mission is to democratize enterprise-grade cybersecurity specifically for " +
    "healthcare organizations, bringing automated HIPAA compliance and specialized protection for " +
    "clinical applications and patient data systems.";
  
  doc.setTextColor(0, 0, 0);
  const textLines = doc.splitTextToSize(companyOverview, 170);
  doc.text(textLines, 20, 65);
  
  // Market opportunity
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Market Opportunity", 20, 95);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const marketOpportunity = 
    "The healthcare cybersecurity market is growing at 20% CAGR and projected to reach $44 billion by 2030. " +
    "Healthcare providers face 821 attacks per week, with sensitive patient data the primary target. " +
    "Small and mid-sized healthcare providers lack the resources for comprehensive HIPAA protection despite " +
    "facing the same compliance requirements as large hospitals. Healthcare breaches cost more than any other " +
    "industry, averaging $10.93M per incident.";
  
  const marketLines = doc.splitTextToSize(marketOpportunity, 170);
  doc.text(marketLines, 20, 105);
  
  // Proprietary technology
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Our Technology", 20, 140);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const technology = 
    "CyberLockX's technology stack is built on three patented technologies:\n\n" +
    "1. HOS²A (Healthcare Organizational and System Security Analysis): AI-driven assessment tool designed " +
    "specifically for healthcare security needs.\n\n" +
    "2. AFAAI (Advanced Fingerprint Authentication and Artificial Intelligence): Patent-pending language " +
    "augmentation technology for enhanced security monitoring.\n\n" +
    "3. RASBITA (Risk Assessment Score By Impact and Threat Analysis): Quantum-resistant encryption " +
    "framework designed specifically for healthcare environments.";
  
  const techLines = doc.splitTextToSize(technology, 170);
  doc.text(techLines, 20, 150);
  
  // Add a new page
  doc.addPage();
  
  // Investment opportunity
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Investment Opportunity", 20, 20);
  
  // Create investment tiers table
  doc.autoTable({
    startY: 30,
    head: [['Tier', 'Investment', 'Benefits']],
    body: [
      ['Seed Partner', '$50,000 - $100,000', 'Early access, lifetime premium subscription, 5% equity, board advisor position'],
      ['Angel Partner', '$25,000 - $49,999', 'Early access, 3-year premium subscription, 2.5% equity'],
      ['Early Adopter', '$10,000 - $24,999', 'Early access, 1-year premium subscription, 1% equity'],
      ['Founding Member', '$5,000 - $9,999', 'Early access, 6-month premium subscription'],
    ],
    headStyles: { fillColor: [102, 50, 160] },
    theme: 'grid',
  });
  
  // Growth strategy
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Growth Strategy", 20, 120);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const strategy = 
    "Our go-to-market strategy focuses on:\n\n" +
    "1. Direct sales to small and mid-sized healthcare providers\n" +
    "2. Channel partnerships with healthcare IT service providers\n" +
    "3. Strategic alliances with compliance consultancies\n" +
    "4. Expansion into adjacent regulated markets (finance, insurance)\n\n" +
    "We project reaching $5M ARR by 2026 with a customer base of 500+ healthcare organizations.";
  
  const strategyLines = doc.splitTextToSize(strategy, 170);
  doc.text(strategyLines, 20, 130);
  
  // Leadership team
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Leadership Team", 20, 185);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const leadership = 
    "Josiah Umezurike, Founder/CTO: Cybersecurity expert with 6 granted patents, 3 U.S. patents\n" +
    "Mike Ikonomou, Co-CEO: Enterprise software development and business leadership experience\n" +
    "Christopher Amato, MBA, MSE, Co-CEO/CFO: Financial expertise and strategic business development\n" +
    "Solomon Sogunro, Lead Product Manager: AI and cybersecurity product development expert";
  
  const leadershipLines = doc.splitTextToSize(leadership, 170);
  doc.text(leadershipLines, 20, 195);
  
  // Add contact information footer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("For more information, contact: invest@cyberlockx.com | www.cyberlockx.xyz", 105, 280, { align: "center" });
  
  return doc;
};

export const downloadInvestorBrief = () => {
  const doc = generateInvestorBrief();
  doc.save("CyberLockX_Investor_Brief.pdf");
};