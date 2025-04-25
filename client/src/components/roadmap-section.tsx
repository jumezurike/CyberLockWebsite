import { Link } from "wouter";

interface RoadmapItem {
  name: string;
  description: string;
  status: "current" | "development" | "planned";
  timeline: string;
  features: string[];
  investmentOptions?: {
    name: string;
    benefits: string[];
    price: string;
  }[];
}

export default function RoadmapSection() {
  const roadmapItems: RoadmapItem[] = [
    {
      name: "SOS²A Organizational and System Security Assessment",
      description: "Comprehensive healthcare security assessment tool with RASBITA scoring methodology",
      status: "current",
      timeline: "Available Now",
      features: [
        "Full security posture evaluation",
        "Detailed compliance gap analysis",
        "Actionable remediation steps",
        "Customized to your industry"
      ]
    },
    {
      name: "Secure Cloud",
      description: "End-to-end encrypted Google Docs and Sheets integration with cell-level security",
      status: "development",
      timeline: "Q3 2025",
      features: [
        "Cell-level encryption in spreadsheets",
        "Document-level access controls",
        "Quantum-resistant encryption",
        "Zero-knowledge architecture"
      ],
      investmentOptions: [
        {
          name: "Early Access",
          benefits: [
            "50% off launch pricing",
            "Private beta access",
            "Influence feature priorities"
          ],
          price: "$99/month"
        }
      ]
    },
    {
      name: "Secure Business Cloud",
      description: "Unified security layer for Azure, AWS, GCP, and Digital Ocean",
      status: "development",
      timeline: "Q4 2025",
      features: [
        "Multi-cloud security orchestration",
        "API and data encryption",
        "Centralized policy management",
        "Zero-trust architecture enforcement"
      ],
      investmentOptions: [
        {
          name: "Founder's Circle",
          benefits: [
            "40% off launch pricing",
            "Early access to beta program",
            "Direct input on feature development"
          ],
          price: "$149/month"
        }
      ]
    },
    {
      name: "Secure Meet",
      description: "Quantum-encrypted audio/video conferencing with verifiable compliance",
      status: "planned",
      timeline: "Q1 2026",
      features: [
        "End-to-end encrypted meetings",
        "Zero-trust authentication",
        "Compliance recording options",
        "Secure document sharing"
      ],
      investmentOptions: [
        {
          name: "Visionary Partner",
          benefits: [
            "Early development access",
            "Lifetime discount",
            "Brand as founding partner"
          ],
          price: "$199/month"
        }
      ]
    },
    {
      name: "Secure Payment",
      description: "PCI DSS-compliant payment processing with quantum encryption",
      status: "planned",
      timeline: "Q2 2026",
      features: [
        "Quantum-resistant payment processing",
        "Automatic PCI DSS compliance",
        "Tokenized transaction data",
        "Multi-currency support"
      ],
      investmentOptions: [
        {
          name: "Development Partner",
          benefits: [
            "Transaction fee discounts",
            "Early API access",
            "Custom integration support"
          ],
          price: "Custom"
        }
      ]
    },
    {
      name: "Secure True Digital ID",
      description: "Self-sovereign identity with quantum-proof verification",
      status: "planned",
      timeline: "Q3 2026",
      features: [
        "Decentralized identity management",
        "Biometric authentication",
        "Zero-knowledge proofs",
        "Cross-platform integration"
      ],
      investmentOptions: [
        {
          name: "Identity Pioneer",
          benefits: [
            "First access to technology",
            "Custom identity workflows",
            "Dedicated implementation support"
          ],
          price: "Custom"
        }
      ]
    },
    {
      name: "Secure AI Language Augmentation",
      description: "Revolutionary approach integrating ethnic languages into core AI processing",
      status: "planned",
      timeline: "Q4 2026",
      features: [
        "Elevating ethnic languages from translation-only status to foundational AI model components",
        "AFAAI oracle of knowledge with the unified alphabet (Σ<sub>U</sub>) system",
        "Keyless encryption resistant to quantum computing threats",
        "Authentic cultural and linguistic nuance preservation in AI interactions"
      ],
      investmentOptions: [
        {
          name: "AI Innovation Partner",
          benefits: [
            "Revolutionary access to first-of-its-kind ethnic language AI technology",
            "Participate in reshaping how AI processes non-English language structures",
            "Early access to secure, quantum-resistant language processing capabilities"
          ],
          price: "Custom"
        }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "current":
        return <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">Available Now</span>;
      case "development":
        return <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">In Development</span>;
      case "planned":
        return <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">Coming Soon</span>;
      default:
        return null;
    }
  };

  return (
    <section id="roadmap" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Product Roadmap
          </div>
          <h2 className="text-3xl font-bold font-heading text-primary mb-4">Build Together, Secure Together</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Join us on our journey to create the most comprehensive secure business application hub.
            Invest early in our roadmap and receive exclusive benefits.
          </p>
        </div>

        <div className="space-y-12">
          {roadmapItems.map((item, index) => (
            <div key={index} className={`bg-white rounded-lg shadow-md overflow-hidden border ${
              item.status === "current" ? "border-green-500" : 
              item.status === "development" ? "border-blue-500" : "border-purple-500"
            }`}>
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-bold text-primary mr-3">{item.name}</h3>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-neutral-600">{item.description}</p>
                  </div>
                  <div className="mt-3 md:mt-0">
                    <span className="inline-block bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full text-sm font-medium">
                      {item.timeline}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Key Features</h4>
                    <ul className="space-y-1">
                      {item.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {item.investmentOptions && (
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2">Early Investment Options</h4>
                      {item.investmentOptions.map((option, oIndex) => (
                        <div key={oIndex} className="mb-4 last:mb-0">
                          <div className="flex justify-between items-center">
                            <h5 className="font-medium text-primary">{option.name}</h5>
                            <span className="font-bold">{option.price}</span>
                          </div>
                          <ul className="mt-2 space-y-1">
                            {option.benefits.map((benefit, bIndex) => (
                              <li key={bIndex} className="text-sm flex items-start">
                                <span className="text-accent mr-2">→</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                          <Link href="/early-access" className="mt-3 inline-block bg-secondary hover:bg-secondary/90 text-white text-sm px-4 py-2 rounded-md">
                            Secure Your Spot
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-primary mb-4">Ready to Join the Innovation Journey?</h3>
          <p className="text-neutral-600 mb-6 max-w-3xl mx-auto">
            Become a founding partner and help shape the future of business security. Early investors get lifetime benefits, 
            priority access, and the opportunity to influence our product development.
          </p>
          <Link href="/early-access" className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium">
            Join the Founder's Circle
          </Link>
        </div>
      </div>
    </section>
  );
}