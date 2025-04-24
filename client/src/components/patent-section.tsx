export default function PatentSection() {
  return (
    <section id="patents" className="py-16 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Protected by U.S. Patents & Patent-Pending Technologies
          </div>
          <h2 className="text-3xl font-bold font-heading text-primary mb-4">Advanced Patent-Protected Security</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">CyberLockX's security is built on three granted patents plus patent-pending technology for low-resource language AI, providing unbreakable protection, court-ready compliance, and self-learning threat prevention.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary text-white p-4">
            <h3 className="text-lg font-semibold">Patent-Powered Differentiators</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-neutral-100">
                  <th className="py-3 px-6 text-left text-sm font-semibold text-neutral-700">Component</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-neutral-700">Patented Innovation</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-neutral-700">Competitor Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr>
                  <td className="py-4 px-6 font-medium">AFAAI Browser</td>
                  <td className="py-4 px-6">
                    <ul className="list-disc list-inside text-neutral-700">
                      <li>ECSMID: End-point to end-point encryption system (Claim 2)</li>
                      <li>DLSeT: Distributed Ledger System for digital transactions (Claim 5)</li>
                    </ul>
                  </td>
                  <td className="py-4 px-6 text-neutral-700">Others rely on signature-based detection</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">SOS²A AI Agent</td>
                  <td className="py-4 px-6">
                    <ul className="list-disc list-inside text-neutral-700">
                      <li>DsTC: Decentralized secure true digital ID for compliance (Claim 4)</li>
                      <li>DLSeT: Distributed Ledger for secure electronic transactions (Claim 7)</li>
                    </ul>
                  </td>
                  <td className="py-4 px-6 text-neutral-700">Manual policy updates required elsewhere</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Hybrid SOC</td>
                  <td className="py-4 px-6">
                    <ul className="list-disc list-inside text-neutral-700">
                      <li>DLSeT: Distributed Ledger transaction verification (Claim 9)</li>
                    </ul>
                  </td>
                  <td className="py-4 px-6 text-neutral-700">Static AI models (Cynet, CrowdStrike)</td>
                </tr>
                <tr className="bg-secondary/10">
                  <td className="py-4 px-6 font-medium text-primary">Integrated Apps</td>
                  <td className="py-4 px-6">
                    <ul className="list-disc list-inside text-neutral-700">
                      <li>ECSMID (End-point to end-point Cryptographic System for Cloud, Mobile and IoT Devices) + DsTC (Decentralized Secure True digital ID for Communications): Unified quantum-safe surface for:
                        <ul className="list-disc list-inside ml-4">
                          <li>Google Docs/Sheets (cell-level encryption)</li>
                          <li>Cloud (AWS/Azure/GCP)</li>
                          <li>Secure Meet (E2E-encrypted)</li>
                          <li>Payments (PCI DSS-ready)</li>
                          <li>AI Language Augmentation (Ethnic language integration)</li>
                        </ul>
                      </li>
                    </ul>
                  </td>
                  <td className="py-4 px-6 font-medium text-red-600">Competitors secure endpoints or apps—never both</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <i className="fas fa-shield-alt text-3xl text-primary"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">U.S. Patent 10,911,217</h3>
            <p className="text-neutral-600 mb-3">ECSMID: End-point to end-point Cryptographic System for Cloud, Mobile and IoT Devices</p>
            <span className="text-xs bg-secondary/20 text-secondary px-3 py-1 rounded-full">Quantum-Resistant Encryption</span>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <i className="fas fa-link text-3xl text-primary"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">U.S. Patent 10,999,276</h3>
            <p className="text-neutral-600 mb-3">DsTC: Decentralized Secure True digital ID for Communications</p>
            <span className="text-xs bg-secondary/20 text-secondary px-3 py-1 rounded-full">Court-Ready Compliance</span>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <i className="fas fa-exchange-alt text-3xl text-primary"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">U.S. Patent 11,367,065</h3>
            <p className="text-neutral-600 mb-3">DLSeT: Distributed Ledger System for Electronic Transaction</p>
            <span className="text-xs bg-secondary/20 text-secondary px-3 py-1 rounded-full">Blockchain-Based Transaction Security</span>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center border-2 border-dashed border-secondary">
            <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <i className="fas fa-language text-3xl text-secondary"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Patent-Pending</h3>
            <p className="text-neutral-600 mb-3">AFAAI: Low-Resource Language Model With Cyberdefense</p>
            <span className="text-xs bg-secondary/20 text-secondary px-3 py-1 rounded-full">Secure Multilingual AI Technology</span>
          </div>
        </div>
      </div>
    </section>
  );
}
