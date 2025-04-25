import { Link } from "wouter";

export default function Sos2aSection() {
  const steps = [
    {
      number: 1,
      title: "Inquiry & Questionnaire",
      description: "Initial business inquiry and detailed questionnaire to collect data from the SMB."
    },
    {
      number: 2,
      title: "Interview & Matrix Population",
      description: "Follow-up interview to populate the security assessment matrix."
    },
    {
      number: 3,
      title: "Preliminary Report",
      description: "Stakeholder preliminary report with initial qualitative analysis."
    },
    {
      number: 4,
      title: "Comprehensive Report",
      description: "Full security assessment with monitoring data after 6 months."
    }
  ];

  return (
    <section id="sos2a" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-primary mb-4">SMB Organizational and System Security Analysis (SOS<sup>2</sup>A)</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">Our comprehensive security analysis tool provides real-time audit, compliance proof, and threat prevention for small and medium businesses.</p>
        </div>

        {/* Process Steps */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            {steps.map((step) => (
              <div key={step.number} className="flex-1 flex flex-col items-center text-center px-4 mb-6 md:mb-0">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4">{step.number}</div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SOS²A Demo Application */}
        <div className="bg-neutral-50 rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <h3 className="text-xl font-semibold font-heading mb-4 text-chart-4">SOS<sup>2</sup>A Assessment Tool</h3>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-chart-4 text-white py-3 px-4">
                  <h4 className="font-medium">Assessment Steps</h4>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    <li className="flex items-center text-chart-4 font-medium">
                      <div className="w-8 h-8 rounded-full bg-chart-4 text-white flex items-center justify-center mr-3">1</div>
                      <span>Inquiry & Questionnaire</span>
                    </li>
                    <li className="flex items-center text-neutral-600">
                      <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center mr-3">2</div>
                      <span>Interview & Matrix Population</span>
                    </li>
                    <li className="flex items-center text-neutral-600">
                      <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center mr-3">3</div>
                      <span>Preliminary Report</span>
                    </li>
                    <li className="flex items-center text-neutral-600">
                      <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center mr-3">4</div>
                      <span>Comprehensive Report</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link 
                      href="/sos2a-tool" 
                      className="w-full bg-chart-4 hover:bg-[hsl(266,63%,60%)] text-white py-2 px-4 rounded transition duration-150 ease-in-out block text-center"
                    >
                      Start Assessment
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-semibold mb-4 text-chart-4">What You'll Receive</h4>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-chart-4/10 flex items-center justify-center mr-4 mt-1">
                      <i className="fas fa-file-alt text-chart-4"></i>
                    </div>
                    <div>
                      <h5 className="font-medium text-chart-4">Preliminary Report</h5>
                      <p className="text-sm text-neutral-600">A qualitative assessment of your current security posture with initial recommendations.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-chart-4/10 flex items-center justify-center mr-4 mt-1">
                      <i className="fas fa-shield-alt text-chart-4"></i>
                    </div>
                    <div>
                      <h5 className="font-medium text-chart-4">Risk Assessment</h5>
                      <p className="text-sm text-neutral-600">Identification of key vulnerabilities and potential threats to your business.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-chart-4/10 flex items-center justify-center mr-4 mt-1">
                      <i className="fas fa-tasks text-chart-4"></i>
                    </div>
                    <div>
                      <h5 className="font-medium text-chart-4">Mitigation Strategies</h5>
                      <p className="text-sm text-neutral-600">Actionable recommendations to improve your security posture.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-chart-4/10 flex items-center justify-center mr-4 mt-1">
                      <i className="fas fa-chart-line text-chart-4"></i>
                    </div>
                    <div>
                      <h5 className="font-medium text-chart-4">Compliance Guidance</h5>
                      <p className="text-sm text-neutral-600">Insights into your compliance status with relevant regulations and standards.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <p className="text-neutral-600 mb-4 text-sm">
                    <i className="fas fa-info-circle text-chart-4 mr-2"></i>
                    The complete assessment includes continuous monitoring for 6 months to develop a comprehensive security report with quantitative analysis.
                  </p>
                  <Link 
                    href="/sos2a-tool" 
                    className="bg-secondary hover:bg-orange-600 text-white py-2 px-6 rounded-md shadow-sm transition duration-150 ease-in-out inline-block"
                  >
                    Start Free Assessment
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
