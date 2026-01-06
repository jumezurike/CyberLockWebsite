import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { generateInvestorBrief } from "@/lib/investor-brief-generator";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import jsPDF from "jspdf";
import { FileDown } from "lucide-react";

// Category detailed explanations for PDF report
const categoryExplanations: Record<string, { title: string; description: string; importance: string; subcategories: string }> = {
  govern: {
    title: "GOVERN (GV)",
    description: "Governance establishes and monitors your organization's cybersecurity risk management strategy, expectations, and policy. This is the foundation that guides all other security activities.",
    importance: "Without proper governance, security efforts become fragmented and reactive. Strong governance ensures leadership accountability, clear policies, and alignment with business objectives.",
    subcategories: "This category expands into 18 subcategories covering Organizational Context, Risk Management Strategy, Roles & Responsibilities, Policy, Oversight, and Cybersecurity Supply Chain Risk Management."
  },
  identify: {
    title: "IDENTIFY (ID)",
    description: "Identify helps you understand your current cybersecurity posture by cataloging assets, business environment, governance structures, and potential risks.",
    importance: "You cannot protect what you don't know exists. Asset management gaps are the #1 cause of undetected breaches in healthcare. Complete visibility is essential for HIPAA compliance.",
    subcategories: "This category expands into 17 subcategories covering Asset Management, Business Environment, Governance, Risk Assessment, and Risk Management Strategy."
  },
  protect: {
    title: "PROTECT (PR)",
    description: "Protect develops and implements appropriate safeguards to ensure delivery of critical services and limit the impact of potential cybersecurity incidents.",
    importance: "Protection controls are your first line of defense. For healthcare, this includes encryption (HIPAA Safe Harbor), access controls, and staff security awareness training.",
    subcategories: "This category expands into 22 subcategories covering Identity Management & Access Control, Awareness & Training, Data Security, Information Protection, and Platform Security."
  },
  detect: {
    title: "DETECT (DE)",
    description: "Detect develops and implements activities to identify the occurrence of a cybersecurity event in a timely manner.",
    importance: "The average time to detect a healthcare breach is 287 days. Faster detection means smaller breaches, lower costs, and reduced regulatory penalties. 24/7 monitoring is critical.",
    subcategories: "This category expands into 18 subcategories covering Anomalies & Events, Security Continuous Monitoring, and Detection Processes."
  },
  respond: {
    title: "RESPOND (RS)",
    description: "Respond develops and implements activities to take action regarding a detected cybersecurity incident to contain its impact.",
    importance: "HIPAA requires breach notification within 60 hours of discovery. A tested incident response plan ensures you meet this deadline and minimize damage to patients and reputation.",
    subcategories: "This category expands into 16 subcategories covering Response Planning, Communications, Analysis, Mitigation, and Improvements."
  },
  recover: {
    title: "RECOVER (RC)",
    description: "Recover develops and implements activities to maintain resilience and restore any capabilities or services impaired by a cybersecurity incident.",
    importance: "Ransomware attacks on healthcare increased 94% in 2023. Without tested, immutable backups and a recovery plan, you risk extended downtime, patient harm, and ransom payments.",
    subcategories: "This category expands into 17 subcategories covering Recovery Planning, Improvements, and Communications."
  }
};

// Score interpretation helper
const getScoreInterpretation = (score: number): { level: string; meaning: string; color: string } => {
  if (score === 0) return { level: "Not Implemented", meaning: "Critical gap - immediate action required. This represents significant compliance and security risk.", color: "#DC2626" };
  if (score === 1) return { level: "Initial/Ad Hoc", meaning: "Informal practices exist but are inconsistent. High risk of gaps and failures under pressure.", color: "#EA580C" };
  if (score === 2) return { level: "Developing", meaning: "Basic processes are documented but not consistently followed or tested. Moderate risk.", color: "#CA8A04" };
  if (score === 3) return { level: "Defined", meaning: "Processes are documented, tested, and followed. Good foundation but room for improvement.", color: "#16A34A" };
  return { level: "Managed/Optimized", meaning: "Mature, continuously improved processes with metrics and automation. Industry best practice.", color: "#059669" };
};

// Generate PDF report function
const generatePDFReport = (
  reportData: { totalScore: number; answers: Record<string, string>; recommendations: string[] },
  contactInfo: { fullName: string; email: string; company: string; phone: string; companySize: string; industry: string }
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Header
  doc.setFillColor(30, 64, 175); // Primary blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("CyberLockX Security Risk Assessment", margin, 25);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("NIST CSF 2.0 Preliminary Analysis Report", margin, 35);

  // Reset text color
  doc.setTextColor(0, 0, 0);
  yPos = 55;

  // Contact Info Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Assessment Details", margin, yPos);
  yPos += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Organization: ${contactInfo.company}`, margin, yPos);
  yPos += 6;
  doc.text(`Contact: ${contactInfo.fullName} | ${contactInfo.email} | ${contactInfo.phone}`, margin, yPos);
  yPos += 6;
  doc.text(`Industry: ${contactInfo.industry} | Size: ${contactInfo.companySize}`, margin, yPos);
  yPos += 6;
  doc.text(`Assessment Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, yPos);
  yPos += 15;

  // Overall Score with Pie Chart
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPos, pageWidth - margin * 2, 50, 'F');
  
  // Draw pie chart
  const centerX = margin + 35;
  const centerY = yPos + 25;
  const radius = 18;
  const scorePercent = reportData.totalScore / 100;
  
  // Background circle (remaining)
  doc.setFillColor(220, 220, 220);
  doc.circle(centerX, centerY, radius, 'F');
  
  // Score arc (filled portion)
  if (scorePercent > 0) {
    const scoreColor = reportData.totalScore >= 70 ? [22, 163, 74] : reportData.totalScore >= 40 ? [202, 138, 4] : [220, 38, 38];
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    
    // Draw pie slice using multiple small triangles
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (2 * Math.PI * scorePercent);
    const segments = Math.ceil(scorePercent * 36);
    
    for (let i = 0; i < segments; i++) {
      const angle1 = startAngle + (i / 36) * 2 * Math.PI;
      const angle2 = startAngle + ((i + 1) / 36) * 2 * Math.PI;
      if (angle2 > endAngle) break;
      
      const x1 = centerX + radius * Math.cos(angle1);
      const y1 = centerY + radius * Math.sin(angle1);
      const x2 = centerX + radius * Math.cos(angle2);
      const y2 = centerY + radius * Math.sin(angle2);
      
      doc.triangle(centerX, centerY, x1, y1, x2, y2, 'F');
    }
  }
  
  // Center circle (donut hole)
  doc.setFillColor(245, 245, 245);
  doc.circle(centerX, centerY, 10, 'F');
  
  // Score text inside donut
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(`${Math.round(reportData.totalScore)}%`, centerX - 6, centerY + 3);
  
  // Score label
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const overallLabel = reportData.totalScore >= 70 ? "GOOD" : reportData.totalScore >= 40 ? "NEEDS IMPROVEMENT" : "CRITICAL";
  doc.text(`Overall Security Score: ${Math.round(reportData.totalScore)}%`, margin + 70, yPos + 20);
  doc.setFontSize(12);
  doc.text(overallLabel, margin + 70, yPos + 32);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Based on NIST Cybersecurity Framework 2.0 preliminary assessment", margin + 70, yPos + 42);
  
  yPos += 60;

  // Category Breakdown
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Domain Analysis", margin, yPos);
  yPos += 10;

  const categories = ['govern', 'identify', 'protect', 'detect', 'respond', 'recover'];
  
  categories.forEach((catId) => {
    const score = parseInt(reportData.answers[catId] || "0");
    const scorePercent = score === 0 ? 0 : score === 1 ? 4.16 : score === 2 ? 8.32 : score === 3 ? 12.48 : 16.66;
    const interpretation = getScoreInterpretation(score);
    const explanation = categoryExplanations[catId];
    
    // Check if we need a new page
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    // Category header with score bar
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos, pageWidth - margin * 2, 35, 'F');
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 64, 175);
    doc.text(explanation.title, margin + 5, yPos + 8);
    
    // Score indicator
    const hexColor = interpretation.color;
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    doc.setFillColor(r, g, b);
    doc.rect(pageWidth - margin - 45, yPos + 3, 40, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(`${scorePercent.toFixed(2)}%`, pageWidth - margin - 40, yPos + 10);
    
    // Score bar
    doc.setFillColor(220, 220, 220);
    doc.rect(margin + 5, yPos + 14, pageWidth - margin * 2 - 10, 4, 'F');
    doc.setFillColor(r, g, b);
    doc.rect(margin + 5, yPos + 14, (pageWidth - margin * 2 - 10) * (score / 4), 4, 'F');
    
    // Interpretation
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`Level: ${interpretation.level}`, margin + 5, yPos + 25);
    doc.setFont("helvetica", "normal");
    doc.text(interpretation.meaning.substring(0, 100), margin + 5, yPos + 31);
    
    yPos += 40;
    
    // Description (if space allows)
    if (yPos < 230) {
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      const descLines = doc.splitTextToSize(explanation.description, pageWidth - margin * 2 - 10);
      doc.text(descLines, margin + 5, yPos);
      yPos += descLines.length * 4 + 5;
      
      // Subcategories note
      doc.setFont("helvetica", "italic");
      doc.text(explanation.subcategories, margin + 5, yPos);
      yPos += 10;
    }
  });

  // New page for recommendations
  doc.addPage();
  yPos = 20;
  
  // Recommendations section
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Priority Recommendations", margin, yPos);
  yPos += 12;
  
  reportData.recommendations.forEach((rec, index) => {
    doc.setFillColor(254, 242, 242);
    doc.rect(margin, yPos, pageWidth - margin * 2, 15, 'F');
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(185, 28, 28);
    doc.text(`${index + 1}.`, margin + 5, yPos + 10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const recLines = doc.splitTextToSize(rec, pageWidth - margin * 2 - 20);
    doc.text(recLines, margin + 15, yPos + 10);
    yPos += 20;
  });
  
  yPos += 10;
  
  // Next Steps
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Next Steps: Full HOS²A Assessment", margin, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const nextStepsText = [
    "This preliminary assessment covers 6 high-level questions from the NIST CSF 2.0 framework.",
    "The complete HOS²A (Healthcare Organizational and System Security Analysis) assessment",
    "expands this analysis across all 118 subcategories, providing:",
    "",
    "• Detailed gap analysis across all 6 NIST CSF 2.0 functions",
    "• HIPAA compliance mapping and risk quantification",
    "• Custom remediation roadmap with prioritized actions",
    "• Cost-benefit analysis using RASBITA methodology",
    "• Executive-ready compliance documentation"
  ];
  
  nextStepsText.forEach((line) => {
    doc.text(line, margin, yPos);
    yPos += 6;
  });
  
  yPos += 15;
  
  // CTA Box
  doc.setFillColor(30, 64, 175);
  doc.rect(margin, yPos, pageWidth - margin * 2, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Ready to secure your organization?", margin + 10, yPos + 12);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Schedule your free 1-hour consultation:", margin + 10, yPos + 22);
  doc.setTextColor(200, 230, 255);
  doc.text("https://cal.com/cyberlockx/cybersecurity-consultation", margin + 10, yPos + 30);
  
  // Footer
  doc.setTextColor(128, 128, 128);
  doc.setFontSize(8);
  doc.text("CyberLockX | info@cyberlockx.xyz | www.cyberlockx.com", margin, 285);
  doc.text("This report is confidential and intended for the named recipient only.", pageWidth - margin - 80, 285);

  // Save PDF
  doc.save(`CyberLockX-Risk-Assessment-${contactInfo.company.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
};

// NIST CSF 2.0 Risk Assessment Schema
const riskAssessmentSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  company: z.string().min(2, { message: "Company name is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  companySize: z.string().min(1, { message: "Please select company size" }),
  industry: z.string().min(1, { message: "Please select industry" }),
  governScore: z.number().min(0).max(4),
  identifyScore: z.number().min(0).max(4),
  protectScore: z.number().min(0).max(4),
  detectScore: z.number().min(0).max(4),
  respondScore: z.number().min(0).max(4),
  recoverScore: z.number().min(0).max(4),
  totalScore: z.number().min(0).max(100),
});

type RiskAssessmentData = z.infer<typeof riskAssessmentSchema>;

// NIST CSF 2.0 Questions
const nistQuestions = [
  {
    id: "govern",
    code: "GV.OC01",
    category: "GOVERN",
    question: "Do you have a formal, written plan for how your clinic handles patient data security and responds to a cyber incident?",
    options: [
      { value: 0, label: "No plan exists" },
      { value: 1, label: "Informal/undocumented procedures" },
      { value: 2, label: "Basic written plan, not regularly tested" },
      { value: 3, label: "Comprehensive plan, tested annually" },
      { value: 4, label: "Fully documented, tested quarterly, staff trained" }
    ]
  },
  {
    id: "identify",
    code: "ID.AM01",
    category: "IDENTIFY",
    question: "Do you know exactly all the devices (computers, tablets, servers) and software that have access to your patient records?",
    options: [
      { value: 0, label: "No inventory exists" },
      { value: 1, label: "Partial list, not maintained" },
      { value: 2, label: "Complete list, updated occasionally" },
      { value: 3, label: "Automated inventory, updated weekly" },
      { value: 4, label: "Real-time asset tracking with risk classification" }
    ]
  },
  {
    id: "protect",
    code: "PR.DS01",
    category: "PROTECT",
    question: "Is all sensitive patient data on your devices automatically encrypted?",
    options: [
      { value: 0, label: "No encryption" },
      { value: 1, label: "Some data encrypted manually" },
      { value: 2, label: "Most data encrypted at rest" },
      { value: 3, label: "All data encrypted at rest and in transit" },
      { value: 4, label: "End-to-end encryption with key management" }
    ]
  },
  {
    id: "detect",
    code: "DE.CM01",
    category: "DETECT",
    question: "Do you have 24/7 active monitoring that alerts you to suspicious activity, or do you usually find out about problems after they happen?",
    options: [
      { value: 0, label: "No monitoring in place" },
      { value: 1, label: "Basic antivirus only" },
      { value: 2, label: "Periodic log reviews" },
      { value: 3, label: "Automated alerts with business-hours response" },
      { value: 4, label: "24/7 SOC monitoring with immediate response" }
    ]
  },
  {
    id: "respond",
    code: "RS.RP01",
    category: "RESPOND",
    question: "If you detected a breach right now, is there a clear, assigned team with steps to contain it and notify patients within the legally required 60-hour window?",
    options: [
      { value: 0, label: "No response plan or team" },
      { value: 1, label: "Informal understanding of who to call" },
      { value: 2, label: "Written plan, no dedicated team" },
      { value: 3, label: "Dedicated team, documented procedures" },
      { value: 4, label: "Tested response team with 60-hour compliance verified" }
    ]
  },
  {
    id: "recover",
    code: "RC.RP01",
    category: "RECOVER",
    question: "If you were hit by ransomware today, do you have a guaranteed and tested way to recover your data without paying the hackers?",
    options: [
      { value: 0, label: "No backups" },
      { value: 1, label: "Occasional manual backups" },
      { value: 2, label: "Regular backups, not tested" },
      { value: 3, label: "Automated backups, tested quarterly" },
      { value: 4, label: "Immutable backups with verified recovery < 4 hours" }
    ]
  }
];

// Simple Risk Assessment Modal Component - 6 Questions with Yes/No answers
function RiskCheckupModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    email: "",
    company: "",
    phone: "",
    companySize: "",
    industry: ""
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState<{
    totalScore: number;
    answers: Record<string, string>;
    recommendations: string[];
  } | null>(null);

  const submitMutation = useMutation({
    mutationFn: async (data: RiskAssessmentData) => {
      return apiRequest('POST', '/api/risk-assessments', data);
    },
    onSuccess: () => {
      console.log("Risk assessment saved successfully");
    },
    onError: (error) => {
      console.error("Error saving risk assessment:", error);
    }
  });

  const assessmentQuestions = [
    {
      id: "govern",
      code: "GV.OC01",
      category: "GOVERN",
      question: "Do you have a formal, written plan for how your clinic handles patient data security and responds to a cyber incident?",
      options: [
        { value: 0, label: "No plan exists" },
        { value: 1, label: "Informal/undocumented procedures" },
        { value: 2, label: "Basic written plan, not regularly tested" },
        { value: 3, label: "Comprehensive plan, tested annually" },
        { value: 4, label: "Fully documented, tested quarterly, staff trained" }
      ]
    },
    {
      id: "identify",
      code: "ID.AM01",
      category: "IDENTIFY",
      question: "Do you know exactly all the devices (computers, tablets, servers) and software that have access to your patient records?",
      options: [
        { value: 0, label: "No inventory exists" },
        { value: 1, label: "Partial list, not maintained" },
        { value: 2, label: "Complete list, updated occasionally" },
        { value: 3, label: "Automated inventory, updated weekly" },
        { value: 4, label: "Real-time asset tracking with risk classification" }
      ]
    },
    {
      id: "protect",
      code: "PR.DS01",
      category: "PROTECT",
      question: "Is all sensitive patient data on your devices automatically encrypted?",
      options: [
        { value: 0, label: "No encryption" },
        { value: 1, label: "Some data encrypted manually" },
        { value: 2, label: "Most data encrypted at rest" },
        { value: 3, label: "All data encrypted at rest and in transit" },
        { value: 4, label: "End-to-end encryption with key management" }
      ]
    },
    {
      id: "detect",
      code: "DE.CM01",
      category: "DETECT",
      question: "Do you have 24/7 active monitoring that alerts you to suspicious activity, or do you usually find out about problems after they happen?",
      options: [
        { value: 0, label: "No monitoring in place" },
        { value: 1, label: "Basic antivirus only" },
        { value: 2, label: "Periodic log reviews" },
        { value: 3, label: "Automated alerts with business-hours response" },
        { value: 4, label: "24/7 SOC monitoring with immediate response" }
      ]
    },
    {
      id: "respond",
      code: "RS.RP01",
      category: "RESPOND",
      question: "If you detected a breach right now, is there a clear, assigned team with steps to contain it and notify patients within the legally required 60-hour window?",
      options: [
        { value: 0, label: "No response plan or team" },
        { value: 1, label: "Informal understanding of who to call" },
        { value: 2, label: "Written plan, no dedicated team" },
        { value: 3, label: "Dedicated team, documented procedures" },
        { value: 4, label: "Tested response team with 60-hour compliance verified" }
      ]
    },
    {
      id: "recover",
      code: "RC.RP01",
      category: "RECOVER",
      question: "If you were hit by ransomware today, do you have a guaranteed and tested way to recover your data without paying the hackers?",
      options: [
        { value: 0, label: "No backups" },
        { value: 1, label: "Occasional manual backups" },
        { value: 2, label: "Regular backups, not tested" },
        { value: 3, label: "Automated backups, tested quarterly" },
        { value: 4, label: "Immutable backups with verified recovery < 4 hours" }
      ]
    }
  ];

  // Score values: 0=0%, 1=4.16%, 2=8.32%, 3=12.48%, 4=16.66% (each question max ~16.66%, total 100%)
  const getScoreValue = (value: number): number => {
    const scoreMap: Record<number, number> = {
      0: 0,
      1: 4.16,
      2: 8.32,
      3: 12.48,
      4: 16.66
    };
    return scoreMap[value] || 0;
  };

  const calculateScore = (): number => {
    let total = 0;
    Object.values(answers).forEach(a => {
      total += getScoreValue(parseInt(a));
    });
    return Math.round(total * 100) / 100; // Round to 2 decimal places
  };

  const getRecommendations = (): string[] => {
    const recommendations: string[] = [];
    
    if (parseInt(answers.govern) <= 1) {
      recommendations.push("Develop a formal Incident Response Plan aligned with HIPAA requirements");
    }
    if (parseInt(answers.identify) <= 1) {
      recommendations.push("Implement an asset inventory system to track all devices with PHI access");
    }
    if (parseInt(answers.protect) <= 1) {
      recommendations.push("Deploy encryption for all data at rest and in transit to meet HIPAA Safe Harbor");
    }
    if (parseInt(answers.detect) <= 1) {
      recommendations.push("Implement 24/7 security monitoring with automated threat detection");
    }
    if (parseInt(answers.respond) <= 1) {
      recommendations.push("Establish a dedicated incident response team with clear escalation procedures");
    }
    if (parseInt(answers.recover) <= 1) {
      recommendations.push("Deploy immutable backup solutions with regular recovery testing");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Your security posture is strong! Consider advanced threat hunting and red team exercises.");
    }
    
    return recommendations;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactInfo.fullName || !contactInfo.email || !contactInfo.company || 
        !contactInfo.phone || !contactInfo.companySize || !contactInfo.industry) {
      toast({
        title: "Please fill all contact fields",
        variant: "destructive"
      });
      return;
    }

    if (Object.keys(answers).length < 6) {
      toast({
        title: "Please answer all 6 questions",
        variant: "destructive"
      });
      return;
    }

    const totalScore = calculateScore();
    const recommendations = getRecommendations();

    setReportData({
      totalScore,
      answers,
      recommendations
    });

    // Submit scores to backend
    submitMutation.mutate({
      ...contactInfo,
      governScore: parseInt(answers.govern) || 0,
      identifyScore: parseInt(answers.identify) || 0,
      protectScore: parseInt(answers.protect) || 0,
      detectScore: parseInt(answers.detect) || 0,
      respondScore: parseInt(answers.respond) || 0,
      recoverScore: parseInt(answers.recover) || 0,
      totalScore: Math.round(totalScore)
    });

    setShowReport(true);
  };

  const resetModal = () => {
    setContactInfo({ fullName: "", email: "", company: "", phone: "", companySize: "", industry: "" });
    setAnswers({});
    setShowReport(false);
    setReportData(null);
    onClose();
  };

  const getScoreColor = (score: number): string => {
    if (score < 50) return "text-red-600";
    if (score < 80) return "text-yellow-600";
    return "text-green-600";
  };

  const getScoreLabel = (score: number): string => {
    if (score < 50) return "Critical Risk";
    if (score < 80) return "Needs Improvement";
    return "Good Posture";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetModal()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            {showReport ? "Your Cyber Risk Assessment Report" : "FREE S/HOS²A Cyber Risk Checkup"}
          </DialogTitle>
        </DialogHeader>

        {!showReport ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-gray-600">
              Answer 6 quick questions based on NIST CSF 2.0 to receive your personalized cyber risk score.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="font-semibold">Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Smith"
                    value={contactInfo.fullName}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    placeholder="Acme Inc."
                    value={contactInfo.company}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (123) 456-7890"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Company Size</Label>
                  <Select value={contactInfo.companySize} onValueChange={(v) => setContactInfo(prev => ({ ...prev, companySize: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select company size" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="500+">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Industry</Label>
                  <Select value={contactInfo.industry} onValueChange={(v) => setContactInfo(prev => ({ ...prev, industry: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical-practice">Medical Practice</SelectItem>
                      <SelectItem value="clinic">Clinic</SelectItem>
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="health-tech">Health Tech</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="dental">Dental Practice</SelectItem>
                      <SelectItem value="mental-health">Mental Health</SelectItem>
                      <SelectItem value="other-healthcare">Other Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 6 Questions */}
            <div className="space-y-4">
              <h3 className="font-semibold">Security Assessment (NIST CSF 2.0)</h3>
              {assessmentQuestions.map((q) => (
                <div key={q.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">{q.category}</span>
                    <span className="text-xs text-gray-500">({q.code})</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 mb-3">{q.question}</p>
                  <RadioGroup 
                    value={answers[q.id]} 
                    onValueChange={(value) => setAnswers(prev => ({ ...prev, [q.id]: value }))}
                    className="space-y-2"
                  >
                    {q.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value.toString()} id={`${q.id}-${option.value}`} />
                        <Label htmlFor={`${q.id}-${option.value}`} className="cursor-pointer text-sm">
                          {option.label} <span className="text-gray-400">({getScoreValue(option.value)}%)</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90">
              Get My Risk Score
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center p-6 bg-gradient-to-r from-primary to-primary/80 rounded-xl text-white">
              <p className="text-sm opacity-90 mb-2">Your Cyber Risk Score</p>
              <p className={`text-6xl font-bold ${reportData?.totalScore && reportData.totalScore >= 80 ? 'text-green-300' : reportData?.totalScore && reportData.totalScore >= 50 ? 'text-yellow-300' : 'text-red-300'}`}>
                {reportData?.totalScore}%
              </p>
              <p className="text-lg mt-2">{getScoreLabel(reportData?.totalScore || 0)}</p>
            </div>

            {/* Question Results */}
            <div>
              <h3 className="font-bold text-lg mb-3">Domain Scores</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {assessmentQuestions.map((q) => {
                  const score = parseInt(reportData?.answers[q.id] || "0");
                  const scorePercent = getScoreValue(score);
                  return (
                    <div key={q.id} className="border rounded-lg p-3 text-center">
                      <p className="text-xs font-bold text-primary">{q.category}</p>
                      <p className={`text-xl font-bold ${score >= 3 ? 'text-green-600' : score >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {scorePercent}%
                      </p>
                      <p className="text-xs text-gray-500">{score}/4</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="font-bold text-lg mb-3">Priority Recommendations</h3>
              <ul className="space-y-2">
                {reportData?.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Download PDF Button */}
            <Button 
              className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
              onClick={() => {
                if (reportData) {
                  generatePDFReport(reportData, contactInfo);
                  toast({
                    title: "Report Downloaded",
                    description: "Your PDF report has been saved to your downloads folder."
                  });
                }
              }}
              data-testid="button-download-pdf"
            >
              <FileDown className="w-4 h-4" />
              Download Full PDF Report
            </Button>

            {/* CTA */}
            <div className="bg-secondary/10 rounded-lg p-4 text-center">
              <p className="font-bold text-primary mb-2">Ready to close your security gaps?</p>
              <Button 
                className="bg-secondary hover:bg-secondary/90"
                onClick={() => {
                  window.open('https://cal.com/cyberlockx/free-hos2a-cyber-risk-checkup-consultation', '_blank');
                }}
                data-testid="button-schedule-consultation"
              >
                Schedule Free Consultation
              </Button>
            </div>

            <Button variant="outline" onClick={resetModal} className="w-full">
              Close Report
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  companySize: z.string(),
  industry: z.string(),
  otherIndustry: z.string().optional(),
  interestedIn: z.array(z.string()).min(1, { message: "Please select at least one product." }),
  investmentLevel: z.string(),
  additionalInfo: z.string().optional(),
  privacyPolicy: z.boolean().refine(val => val === true, { message: "You must agree to the privacy policy." })
}).refine((data) => {
  if (data.industry === "other" && (!data.otherIndustry || data.otherIndustry.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Please specify your industry",
  path: ["otherIndustry"]
});

type FormData = z.infer<typeof formSchema>;

export default function EarlyAccess() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [isRiskCheckupOpen, setIsRiskCheckupOpen] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      phone: "",
      companySize: "",
      industry: "",
      otherIndustry: "",
      interestedIn: [],
      investmentLevel: "",
      additionalInfo: "",
      privacyPolicy: false
    }
  });

  const selectedIndustry = form.watch("industry");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/early-access/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }
      
      setSubmittedData(data);
      setSubmitted(true);
      toast({
        title: "Success!",
        description: "Your early access application has been submitted.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Something went wrong.",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const products = [
    { id: "sos2a", name: "S/HOS²A Organizational and System Security Assessment" },
    { id: "secure-cloud", name: "Secure Cloud (Google Docs/Sheets)" },
    { id: "secure-business-cloud", name: "Secure Business Cloud (Azure/AWS/GCP)" },
    { id: "secure-meet", name: "Secure Meet" },
    { id: "secure-payment", name: "Secure Payment" },
    { id: "secure-digital-id", name: "Secure True Digital ID" },
    { id: "secure-ai", name: "Secure AI Language Augmentation" }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-4">Application Received!</h1>
            <p className="text-lg text-neutral-600 mb-6">
              Thank you for your interest in becoming an early partner with CyberLockX.
              Our team will review your application and contact you within 48 hours.
            </p>
            <div className="bg-neutral-100 p-6 rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-2">What happens next?</h2>
              <ol className="text-left space-y-2 text-neutral-700">
                <li className="flex items-start">
                  <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0">1</span>
                  <span>Our team will review your application within 48 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0">2</span>
                  <span>You'll receive a personalized investment proposal</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0">3</span>
                  <span>Schedule a demo with our product team</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0">4</span>
                  <span>Join our Founder's Circle and begin your early access journey</span>
                </li>
              </ol>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium">
                Return to Homepage
              </Link>
              <button 
                onClick={() => {
                  if (submittedData) {
                    generateInvestorBrief(submittedData);
                  }
                }} 
                className="bg-transparent hover:bg-neutral-100 text-primary border border-primary px-6 py-3 rounded-lg font-medium"
              >
                Download Investor Brief
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Join the CyberLockX Founder's and Partner's Circle</h1>
          <div className="text-lg text-neutral-600 max-w-3xl mx-auto mb-6 space-y-4">
            <p>
              Be among the first to pioneer autonomous healthcare security. We are productizing government-grade encryption to solve a foundational problem: automating costly and manual security audits.
            </p>
            <p>
              We are now building the integrated system that automatically fixes risks.
            </p>
            <p>
              Join our Founders and Partners Circle to access revolutionary products, co-develop the solution, and scale with us from the ground up.
            </p>
          </div>
          
          {/* Limited 2025 Pilot Slots Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-6 shadow-lg border-2 border-red-500">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="bg-yellow-400 text-red-800 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  LIMITED TIME
                </div>
                <div className="bg-white text-red-700 px-4 py-2 rounded-lg font-bold text-lg">
                  🔥 2026 PILOT SLOTS
                </div>
                <div className="bg-yellow-400 text-red-800 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  EXCLUSIVE
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-3">Only 25 Pilot Partner Slots Available</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-white/20 text-yellow-300">
                      <th className="px-4 py-3 font-bold">Partner Tier</th>
                      <th className="px-4 py-3 font-bold text-center">Slots</th>
                      <th className="px-4 py-3 font-bold">For Whom</th>
                      <th className="px-4 py-3 font-bold">Key Partnership Benefits</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white/10 border-b border-white/10">
                      <td className="px-4 py-4 font-bold text-yellow-300 whitespace-nowrap">🏥 Healthcare Pilot Partner</td>
                      <td className="px-4 py-4 text-center font-semibold">15</td>
                      <td className="px-4 py-4 text-white/80">Medical practices, clinics, hospitals</td>
                      <td className="px-4 py-4">
                        <ul className="text-white/90 space-y-1">
                          <li>• 20% discount on all services</li>
                          <li>• Deploy our live SOS²A AI Audit Engine</li>
                          <li>• Co-design features for clinical workflows</li>
                          <li>• Direct founder access</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="bg-white/10 border-b border-white/10">
                      <td className="px-4 py-4 font-bold text-yellow-300 whitespace-nowrap">🏢 Enterprise Security Pilot Partner</td>
                      <td className="px-4 py-4 text-center font-semibold">5</td>
                      <td className="px-4 py-4 text-white/80">Tech firms, MSPs, large enterprises</td>
                      <td className="px-4 py-4">
                        <ul className="text-white/90 space-y-1">
                          <li>• All Healthcare Partner benefits</li>
                          <li>• Priority integration for your tech stack</li>
                          <li>• Influence on core platform architecture</li>
                          <li>• Potential revenue share on joint solutions</li>
                          <li>• Custom feature development</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="bg-white/10">
                      <td className="px-4 py-4 font-bold text-yellow-300 whitespace-nowrap">💡 Strategic Investor Partner</td>
                      <td className="px-4 py-4 text-center font-semibold">5</td>
                      <td className="px-4 py-4 text-white/80">Angels & VCs funding integration & growth</td>
                      <td className="px-4 py-4">
                        <ul className="text-white/90 space-y-1">
                          <li>• All Enterprise Partner benefits (optional)</li>
                          <li>• Equity stake in CyberLockX Inc.</li>
                          <li>• Full strategic & due diligence access</li>
                          <li>• Fund the bridge from audit to auto-remediation</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* CTA Button to Form */}
              <div className="mt-6 text-center">
                <a 
                  href="#apply-form" 
                  className="inline-block bg-yellow-400 hover:bg-yellow-500 text-red-800 font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition duration-150 ease-in-out"
                >
                  Ready to Secure Your Exclusive Slot?
                </a>
              </div>
              
              <div className="mt-4 p-4 bg-white/10 rounded-lg">
                <div className="text-center">
                  <div className="text-yellow-300 font-bold text-lg">Applications close:</div>
                  <div className="text-xl font-bold">March 31, 2026</div>
                </div>
              </div>
              
              {/* Founder's Circle Benefits */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-white">🚀 Build With Us!</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-yellow-300 text-center">Founder's Circle Benefits (Developer Partners)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-2">🔓</div>
                    <div className="font-bold text-sm">Early Product Access</div>
                    <div className="text-xs opacity-80">Be the first to try our patented security technologies</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-2">💰</div>
                    <div className="font-bold text-sm">Exclusive Pricing</div>
                    <div className="text-xs opacity-80">Up to 50% off retail pricing, locked in for life</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-2">📢</div>
                    <div className="font-bold text-sm">Product Direction Influence</div>
                    <div className="text-xs opacity-80">Direct input on feature priorities and roadmap</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-2">👥</div>
                    <div className="font-bold text-sm">Direct Access to Leadership</div>
                    <div className="text-xs opacity-80">Regular meetings with our executive team</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-2">🛠️</div>
                    <div className="font-bold text-sm">Custom Feature Development</div>
                    <div className="text-xs opacity-80">Build and shape features tailored to your needs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8">
          {/* FREE S/HOS²A Cyber Risk Checkup Section */}
          <div className="bg-secondary text-white rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-center mb-4">✅ FREE S/HOS²A Cyber Risk Checkup for Healthcare Clinics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🔍</div>
                <div className="text-sm">Identify hidden risks and compliance gaps in your EHR systems</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">💬</div>
                <div className="text-sm">Personalized report showing real HIPAA/EHR vulnerabilities</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-sm">30-minute assessment with immediate actionable insights</div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">🎯 Perfect for clinics, medical practices, and healthcare organizations looking to strengthen their cybersecurity posture</p>
            </div>
            
            {/* Zero-Risk Guarantee */}
            <div className="mt-4 p-4 bg-white/20 rounded-lg border border-white/30">
              <div className="text-center">
                <p className="text-sm font-bold text-white mb-2">Our Zero-Risk Guarantee:</p>
                <p className="text-xl font-bold text-yellow-300">🛡️ 100% Breach-Free Healthcare Guarantee</p>
                <p className="text-sm mt-1">Pay only if we stop a threat • 90-day trial • $0 risk</p>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setIsRiskCheckupOpen(true)}
                className="inline-block bg-white hover:bg-gray-100 text-secondary font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition duration-150 ease-in-out cursor-pointer"
                data-testid="button-claim-risk-checkup"
              >
                Claim Your Free Risk Checkup
              </button>
              <a 
                href="https://cal.com/cyberlockx/cybersecurity-consultation?overlayCalendar=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition duration-150 ease-in-out"
                data-testid="link-general-consultation"
              >
                Book a Consultation
              </a>
            </div>
          </div>

          <div id="apply-form">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-xl font-bold text-primary mb-6">Apply for the 2026 Pilot Program</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Inc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="companySize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select company size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-50">11-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-500">201-500 employees</SelectItem>
                              <SelectItem value="501-1000">501-1000 employees</SelectItem>
                              <SelectItem value="1000+">1000+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="finance">Finance & Banking</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="government">Government</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {selectedIndustry === "other" && (
                    <FormField
                      control={form.control}
                      name="otherIndustry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please specify your industry</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your industry" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="interestedIn"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Products of Interest</FormLabel>
                          <p className="text-sm text-neutral-500">Select all that apply</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {products.map((product) => (
                            <FormField
                              key={product.id}
                              control={form.control}
                              name="interestedIn"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={product.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(product.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, product.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== product.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {product.name}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="investmentLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Potential Investment Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select investment level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="healthcare">Healthcare Pilot Partner (15 slots)</SelectItem>
                            <SelectItem value="enterprise">Enterprise Security Pilot Partner (5 slots)</SelectItem>
                            <SelectItem value="strategic">Strategic Investor Partner (5 slots)</SelectItem>
                            <SelectItem value="development">Development Partner (Build With Us)</SelectItem>
                            <SelectItem value="undecided">Not sure yet</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your security needs or any specific questions you have"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="privacyPolicy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the <a href="#" className="text-primary underline">privacy policy</a> and understand that my information will be used as described.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
      
      <RiskCheckupModal 
        isOpen={isRiskCheckupOpen} 
        onClose={() => setIsRiskCheckupOpen(false)} 
      />
    </div>
  );
}