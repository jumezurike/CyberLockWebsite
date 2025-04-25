interface CompetitiveFeature {
  feature: string;
  cyberLockX: {
    value: string;
    positive: boolean;
  };
  guardz: {
    value: string;
    positive: boolean;
  };
  crowdStrike: {
    value: string;
    positive: boolean;
  };
  cynet: {
    value: string;
    positive: boolean;
  };
}

export default function CompetitiveComparison() {
  const features: CompetitiveFeature[] = [
    {
      feature: "Target Market",
      cyberLockX: { value: "Built for Healthcare (all sizes)", positive: true },
      guardz: { value: "MSP-focused", positive: false },
      crowdStrike: { value: "Enterprise-only", positive: false },
      cynet: { value: "Mid-market+", positive: false }
    },
    {
      feature: "Encryption",
      cyberLockX: { value: "ECSMID (End-to-end IoT crypto) + DataShieldAI (PQC) (Patented)", positive: true },
      guardz: { value: "None", positive: false },
      crowdStrike: { value: "None", positive: false },
      cynet: { value: "Basic TLS", positive: false }
    },
    {
      feature: "Compliance Automation",
      cyberLockX: { value: "SOS²A real-time reports (ISO/SOC/GDPR)", positive: true },
      guardz: { value: "Insurance-focused", positive: false },
      crowdStrike: { value: "Manual", positive: false },
      cynet: { value: "Partial", positive: false }
    },
    {
      feature: "Threat Prevention",
      cyberLockX: { value: "OWASP-immune AFAAI browser + hybrid SOC", positive: true },
      guardz: { value: "MSP tools", positive: true },
      crowdStrike: { value: "EDR", positive: true },
      cynet: { value: "XDR", positive: true }
    },
    {
      feature: "SOC Support",
      cyberLockX: { value: "AI + human analysts (Healthcare-focused)", positive: true },
      guardz: { value: "AI-only", positive: false },
      crowdStrike: { value: "Humans ($$$)", positive: true },
      cynet: { value: "Humans ($$$)", positive: true }
    },
    {
      feature: "Pricing",
      cyberLockX: { value: "Healthcare-transparent (flat-rate)", positive: true },
      guardz: { value: "Affordable but limited", positive: true },
      crowdStrike: { value: "$20k+/year", positive: false },
      cynet: { value: "$15k+/year", positive: false }
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-primary mb-4">Competitive Comparison</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">See how CyberLockX stacks up against other cybersecurity solutions.</p>
        </div>
        
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-4 px-4 text-left text-sm font-semibold bg-primary text-white border-b">Feature</th>
                <th className="py-4 px-4 text-left text-sm font-semibold bg-primary text-white border-b">CyberLockX</th>
                <th className="py-4 px-4 text-left text-sm font-semibold bg-primary text-white border-b">Guardz</th>
                <th className="py-4 px-4 text-left text-sm font-semibold bg-primary text-white border-b">CrowdStrike</th>
                <th className="py-4 px-4 text-left text-sm font-semibold bg-primary text-white border-b">Cynet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {features.map((feature, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 font-medium">{feature.feature}</td>
                  <td className="py-3 px-4 text-neutral-700">
                    <span className="flex items-center">
                      <i className={`${feature.cyberLockX.positive ? 'fas fa-check text-green-600' : 'fas fa-times text-red-600'} mr-2`}></i>
                      {feature.cyberLockX.value}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-700">
                    <span className="flex items-center">
                      <i className={`${feature.guardz.positive ? 'fas fa-check text-green-600' : 'fas fa-times text-red-600'} mr-2`}></i>
                      {feature.guardz.value}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-700">
                    <span className="flex items-center">
                      <i className={`${feature.crowdStrike.positive ? 'fas fa-check text-green-600' : 'fas fa-times text-red-600'} mr-2`}></i>
                      {feature.crowdStrike.value}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-700">
                    <span className="flex items-center">
                      <i className={`${feature.cynet.positive ? 'fas fa-check text-green-600' : 'fas fa-times text-red-600'} mr-2`}></i>
                      {feature.cynet.value}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
