interface Feature {
  icon: string;
  title: string;
  description: string;
}

export default function FeaturesSection() {
  const features: Feature[] = [
    {
      icon: "fas fa-shield-alt",
      title: "Healthcare Organizational and System Security Analysis (SOS²A)",
      description: "AI agent that automates real-time audit, compliance proof (HIPAA, ISO, SOC, and GDPR) and threat prevention—turning all healthcare activity into auditable evidence."
    },
    {
      icon: "fas fa-file-alt",
      title: "Secure Cloud (Google Docs/Sheets)",
      description: "Safeguards data with advanced encryption by tokens, cell level, and data access controls for complete document security."
    },
    {
      icon: "fas fa-video",
      title: "Secure Meet",
      description: "Encrypted communications platform for secure video conferences, messaging, and collaboration with E2E encryption."
    },
    {
      icon: "fas fa-credit-card",
      title: "Secure Payment",
      description: "Advanced transaction encryption to protect your financial data and customer information with patented security."
    },
    {
      icon: "fas fa-cloud",
      title: "Secure Business Cloud",
      description: "Robust data protection and collaboration tools, with seamless integration for managed service providers."
    },
    {
      icon: "fas fa-fingerprint",
      title: "Secure True Digital ID",
      description: "Next-generation identity verification and industry-specific encryption for unparalleled security."
    },
    {
      icon: "fas fa-brain",
      title: "Secure ML/AI Language Augmentation",
      description: "Threat-anomaly detection, text, form data, cookies, cache encryption and language enhancement."
    }
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-primary mb-4">Core Features</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">Our integrated secure browser ensures data security and privacy while simplifying your cybersecurity needs.</p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-neutral-50 rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden">
              <div className="bg-primary p-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white/10 mx-auto">
                  <i className={`${feature.icon} text-2xl text-white`}></i>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold font-heading mb-3 text-primary">{feature.title}</h3>
                <p className="text-neutral-600 mb-4">{feature.description}</p>
                <a href="#" className="text-secondary hover:text-green-600 font-medium inline-flex items-center">
                  Learn more <i className="fas fa-arrow-right ml-2"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
