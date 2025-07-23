import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Clock, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { Sos2aFormData } from "@/lib/sos2a-types";
import { Link } from "wouter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ComprehensiveReportProps {
  formData: Sos2aFormData;
  onPrev: () => void;
}

export default function ComprehensiveReport({
  formData,
  onPrev
}: ComprehensiveReportProps) {
  const businessName = formData.businessName || "Your Business";
  
  // Check if preliminary report exists
  const hasPreliminaryReport = !!formData.preliminaryReportId;
  const hasRemediationStrategies = formData.remediationStrategies && formData.remediationStrategies.length > 0;
  
  // If no preliminary report, show error and return
  if (!hasPreliminaryReport) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-primary">Step 4: Comprehensive Report</h2>
        
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Prerequisite Missing</AlertTitle>
          <AlertDescription>
            A preliminary report must be completed before generating a comprehensive report.
            The remediation and mitigation strategies from the preliminary report are required
            for the comprehensive assessment.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-start mt-6">
          <Button variant="default" onClick={onPrev}>
            Return to Generate Preliminary Report
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-primary">Step 4: Comprehensive Report</h2>
      
      {hasRemediationStrategies && (
        <Card className="mb-6 border-green-200">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 text-green-700">Remediation Strategies from Preliminary Report</h3>
            <p className="text-sm text-neutral-600 mb-4">
              These remediation strategies from your preliminary report (ID: {formData.preliminaryReportId}) 
              will be integrated into your comprehensive assessment:
            </p>
            <ul className="space-y-2 mb-4">
              {formData.remediationStrategies?.map((item, index) => (
                <li key={index} className="bg-green-50 p-3 rounded border border-green-100">
                  <p className="font-medium text-sm text-green-800">{item.issue}</p>
                  <p className="text-sm text-green-700">{item.strategy}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
        <div className="flex items-start">
          <div className="mr-4 mt-1">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-amber-800 mb-2">Comprehensive Report Not Yet Available</h3>
            <p className="text-amber-700 mb-3">
              The comprehensive security assessment report is generated after a 6-month monitoring period
              to provide quantitative analysis and a more detailed evaluation of your security posture.
            </p>
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-medium text-amber-800 mb-2">Why 6 months of monitoring is necessary:</h4>
              <ul className="list-disc list-inside text-amber-700 space-y-2">
                <li>Establish baseline security posture and identify trends</li>
                <li>Gather quantitative data to compare with qualitative analysis from preliminary assessment</li>
                <li>Validate risk management improvements based on NIST CSF and CIS CSC frameworks</li>
                <li>Generate tangible evidence for compliance documentation</li>
                <li>Detect sophisticated threats that may only become apparent over time</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
              <div className="w-40 h-40 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-20 w-20 text-primary opacity-50" />
              </div>
            </div>
            <div className="md:w-2/3 md:pl-8">
              <h3 className="text-xl font-semibold text-primary mb-4">Monitoring In Progress</h3>
              <p className="text-neutral-600 mb-4">
                Your preliminary report has been generated based on the qualitative assessment. To receive your
                comprehensive report with quantitative analysis, we need to monitor your systems for 6 months.
              </p>
              <p className="text-neutral-600 mb-4">
                During this period, SOS²A will collect data on your security posture, identify potential threats,
                and provide real-time protection against emerging vulnerabilities.
              </p>
              <div className="flex items-center bg-blue-50 p-4 rounded-lg">
                <Lock className="h-5 w-5 text-blue-600 mr-3" />
                <p className="text-blue-700 text-sm">
                  Your preliminary report is available for reference and contains initial recommendations to
                  improve your security posture while monitoring is in progress.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">What to Expect in Your Comprehensive Report</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium mb-2 text-primary">Identified Cybersecurity Risks/Threats</h4>
                <ul className="text-neutral-600 text-sm space-y-1">
                  <li>• Industry-specific threat patterns</li>
                  <li>• Actual attack attempts detected during monitoring</li>
                  <li>• Risk scoring based on real incidents</li>
                </ul>
              </div>
              
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium mb-2 text-primary">Identified Vulnerabilities</h4>
                <ul className="text-neutral-600 text-sm space-y-1">
                  <li>• System and application vulnerabilities</li>
                  <li>• Configuration weaknesses</li>
                  <li>• Security policy gaps</li>
                </ul>
              </div>
              
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium mb-2 text-primary">Detailed Mitigation Strategies</h4>
                <ul className="text-neutral-600 text-sm space-y-1">
                  <li>• Prioritized remediation roadmap</li>
                  <li>• Technical and procedural solutions</li>
                  <li>• Cost-benefit analysis for security investments</li>
                </ul>
              </div>
              
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium mb-2 text-primary">Compliance Documentation</h4>
                <ul className="text-neutral-600 text-sm space-y-1">
                  <li>• Gap analysis against relevant standards</li>
                  <li>• Evidence package for audits</li>
                  <li>• Compliance roadmap and certification readiness</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-neutral-50 p-6 rounded-lg">
              <h4 className="font-medium mb-3 text-primary">Business Impact Assessment</h4>
              <p className="text-neutral-600 mb-4">
                The comprehensive report will include a RASBITA (Risk Assessment Score by Impact and Threat Analysis)
                evaluation that assigns financial values to detected threats and potential breaches, helping you
                understand the business impact of your security posture.
              </p>
              <div className="text-center">
                <img 
                  src="https://via.placeholder.com/600x200?text=RASBITA+Score+Chart+(Sample)" 
                  alt="RASBITA Score Chart Sample" 
                  className="max-w-full h-auto rounded-lg opacity-50"
                />
                <p className="text-sm text-neutral-500 mt-2">
                  An example of the RASBITA scoring visualization that will be included in your comprehensive report
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Ready to Start Monitoring?</h3>
          <p className="text-neutral-600 mb-6">
            To proceed with the 6-month monitoring phase and receive your comprehensive report, you'll need to
            select a service plan that includes continuous monitoring.
          </p>
          
          <div className="bg-primary/5 p-6 rounded-lg">
            <h4 className="font-medium mb-4 text-primary">Continuous Monitoring & Response</h4>
            <ul className="text-neutral-600 space-y-2 mb-6">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>24/7 security monitoring and threat detection</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>Real-time security incident response</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>Monthly security status reports</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>Comprehensive security assessment report after 6 months</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>RASBITA score with financial impact analysis</span>
              </li>
            </ul>
            <div className="text-center">
              <p className="font-medium text-xl mb-4 text-primary">$65 <span className="text-sm font-normal text-neutral-600">per device / month</span></p>
              <Link href="/#pricing">
                <Button className="w-full sm:w-auto bg-secondary hover:bg-orange-600">
                  View Pricing Plans <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onPrev}>
          Back to Preliminary Report
        </Button>
        <Link href="/#contact">
          <Button className="bg-primary hover:bg-blue-700">
            Contact Sales
          </Button>
        </Link>
      </div>
    </div>
  );
}
