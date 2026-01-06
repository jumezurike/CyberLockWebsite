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

  const simpleQuestions = [
    {
      id: "govern",
      code: "GV.OC01",
      category: "GOVERN",
      question: "Do you have a formal, written plan for how your clinic handles patient data security and responds to a cyber incident?"
    },
    {
      id: "identify",
      code: "ID.AM01",
      category: "IDENTIFY",
      question: "Do you know exactly all the devices (computers, tablets, servers) and software that have access to your patient records?"
    },
    {
      id: "protect",
      code: "PR.DS01",
      category: "PROTECT",
      question: "Is all sensitive patient data on your devices automatically encrypted?"
    },
    {
      id: "detect",
      code: "DE.CM01",
      category: "DETECT",
      question: "Do you have 24/7 active monitoring that alerts you to suspicious activity, or do you usually find out about problems after they happen?"
    },
    {
      id: "respond",
      code: "RS.RP01",
      category: "RESPOND",
      question: "If you detected a breach right now, is there a clear, assigned team with steps to contain it and notify patients within the legally required 60-hour window?"
    },
    {
      id: "recover",
      code: "RC.RP01",
      category: "RECOVER",
      question: "If you were hit by ransomware today, do you have a guaranteed and tested way to recover your data without paying the hackers?"
    }
  ];

  const calculateScore = (): number => {
    let yesCount = 0;
    Object.values(answers).forEach(a => {
      if (a === "yes") yesCount++;
    });
    return Math.round((yesCount / 6) * 100);
  };

  const getRecommendations = (): string[] => {
    const recommendations: string[] = [];
    
    if (answers.govern !== "yes") {
      recommendations.push("Develop a formal Incident Response Plan aligned with HIPAA requirements");
    }
    if (answers.identify !== "yes") {
      recommendations.push("Implement an asset inventory system to track all devices with PHI access");
    }
    if (answers.protect !== "yes") {
      recommendations.push("Deploy encryption for all data at rest and in transit to meet HIPAA Safe Harbor");
    }
    if (answers.detect !== "yes") {
      recommendations.push("Implement 24/7 security monitoring with automated threat detection");
    }
    if (answers.respond !== "yes") {
      recommendations.push("Establish a dedicated incident response team with clear escalation procedures");
    }
    if (answers.recover !== "yes") {
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

    // Convert yes/no to numeric scores for backend
    submitMutation.mutate({
      ...contactInfo,
      governScore: answers.govern === "yes" ? 4 : 0,
      identifyScore: answers.identify === "yes" ? 4 : 0,
      protectScore: answers.protect === "yes" ? 4 : 0,
      detectScore: answers.detect === "yes" ? 4 : 0,
      respondScore: answers.respond === "yes" ? 4 : 0,
      recoverScore: answers.recover === "yes" ? 4 : 0,
      totalScore
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
              {simpleQuestions.map((q, index) => (
                <div key={q.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">{q.category}</span>
                    <span className="text-xs text-gray-500">({q.code})</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 mb-3">{q.question}</p>
                  <RadioGroup 
                    value={answers[q.id]} 
                    onValueChange={(value) => setAnswers(prev => ({ ...prev, [q.id]: value }))}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id={`${q.id}-yes`} />
                      <Label htmlFor={`${q.id}-yes`} className="cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`${q.id}-no`} />
                      <Label htmlFor={`${q.id}-no`} className="cursor-pointer">No</Label>
                    </div>
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
              <h3 className="font-bold text-lg mb-3">Your Answers</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {simpleQuestions.map((q) => (
                  <div key={q.id} className="border rounded-lg p-3 text-center">
                    <p className="text-xs font-bold text-primary">{q.category}</p>
                    <p className={`text-xl font-bold ${reportData?.answers[q.id] === "yes" ? 'text-green-600' : 'text-red-600'}`}>
                      {reportData?.answers[q.id] === "yes" ? "Yes" : "No"}
                    </p>
                  </div>
                ))}
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

            {/* CTA */}
            <div className="bg-secondary/10 rounded-lg p-4 text-center">
              <p className="font-bold text-primary mb-2">Ready to close your security gaps?</p>
              <Button 
                className="bg-secondary hover:bg-secondary/90"
                onClick={() => {
                  resetModal();
                  document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
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
            
            {/* CTA Button */}
            <div className="mt-6 text-center">
              <button 
                onClick={() => setIsRiskCheckupOpen(true)}
                className="inline-block bg-white hover:bg-gray-100 text-secondary font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition duration-150 ease-in-out cursor-pointer"
                data-testid="button-claim-risk-checkup"
              >
                Claim Your Free Risk Checkup
              </button>
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