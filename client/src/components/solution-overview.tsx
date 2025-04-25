export default function SolutionOverview() {
  return (
    <section id="solution" className="py-16 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-primary mb-4">CyberLockX's Unmatched Advantages</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">Our patented technology provides security that competitors simply can't match.</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="py-4 px-6 text-left text-sm font-semibold">Component</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold">Breakthrough Capabilities</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold">Why Competitors Can't Compete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr>
                  <td className="py-4 px-6 font-medium">AFAAI Browser</td>
                  <td className="py-4 px-6">
                    <ul className="list-disc list-inside text-neutral-700">
                      <li>U.S. Patent 10,911,217 (ECSMID: End-point to end-point cryptographic system) + DataShieldAI = Quantum-proof OWASP immunity</li>
                      <li>Encrypts all data (cache/RAM/transit)</li>
                    </ul>
                  </td>
                  <td className="py-4 px-6 text-neutral-700">Others rely on vulnerable TLS or bolt-on VPNs</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Secure Cloud (Google Docs/Sheets)</td>
                  <td className="py-4 px-6">
                    <ul className="list-disc list-inside text-neutral-700">
                      <li>Advanced encryption by tokens and cell-level</li>
                      <li>Customizable data access controls</li>
                    </ul>
                  </td>
                  <td className="py-4 px-6 text-neutral-700">Competitors offer limited document-level encryption only</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">SOS²A AI Agent</td>
                  <td className="py-4 px-6">
                    <ul className="list-disc list-inside text-neutral-700">
                      <li>Live compliance engine: Auto-generates HIPAA/ISO/SOC/GDPR reports</li>
                      <li>Self-healing mitigations (e.g., auto-patching)</li>
                    </ul>
                  </td>
                  <td className="py-4 px-6 text-neutral-700">Guardz/CrowdStrike: Manual evidence collection</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Hybrid SOC</td>
                  <td className="py-4 px-6">
                    <ul className="list-disc list-inside text-neutral-700">
                      <li>AI + human analysts 24/7</li>
                      <li>Custom OWASP/SANS rules for healthcare workflows</li>
                    </ul>
                  </td>
                  <td className="py-4 px-6 text-neutral-700">Pure AI tools (Cynet) miss business-context threats</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Integrated Apps</td>
                  <td className="py-4 px-6">
                    <ul className="list-disc list-inside text-neutral-700">
                      <li>One quantum-safe surface for:
                        <ul className="list-disc list-inside ml-4">
                          <li>Google Docs/Sheets (cell-level encryption)</li>
                          <li>Cloud (AWS/Azure/GCP)</li>
                          <li>Secure Meet (E2E-encrypted)</li>
                          <li>Payments (PCI DSS-ready)</li>
                          <li>AI Augmentation</li>
                        </ul>
                      </li>
                    </ul>
                  </td>
                  <td className="py-4 px-6 text-neutral-700">Competitors secure endpoints or apps—never both</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold font-heading mb-4 text-primary">The CyberLockX Unfair Advantage</h3>
            <ul className="space-y-4">
              <li>
                <span className="font-semibold text-blue-500">Patented Immunity:</span>
                <p className="text-neutral-700">ECSMID's end-to-end cryptographic system for mobile and IoT devices (Claim 2) + DataShieldAI's granular encryption = Unhackable by design, even at the cell level.</p>
              </li>
              <li>
                <span className="font-semibold text-blue-500">Compliance Autopilot:</span>
                <p className="text-neutral-700">SOS²A maps controls in real time to HIPAA, HITECH, NIST CSF 2.0, ISO 27001, SOC 2, and GDPR requirements.</p>
              </li>
              <li>
                <span className="font-semibold text-blue-500">Business-Ready Security:</span>
                <p className="text-neutral-700">Secure Docs/Sheets: Encrypt individual words/cells in Google Workspace.
                Secure Meet: E2E-encrypted calls with auto-logged GDPR evidence.
                Secure Payments: PCI DSS-ready transactions inside the browser.</p>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold font-heading mb-4 text-primary">Competitive Knockout Blows</h3>
            <ul className="space-y-4">
              <li>
                <span className="font-semibold text-blue-500">Against Guardz:</span>
                <p className="text-neutral-700">"Guardz documents breaches. CyberLockX's patented browser prevents them while auto-filing your compliance reports—even encrypting individual spreadsheet cells."</p>
              </li>
              <li>
                <span className="font-semibold text-blue-500">Against CrowdStrike/Cynet:</span>
                <p className="text-neutral-700">"Their $30k tools can't encrypt cached files, unify apps, or generate audit proof—we do all three in one hub while protecting every word in your documents."</p>
              </li>
              <li>
                <span className="font-semibold text-blue-500">Against All:</span>
                <p className="text-neutral-700">"We replace your:
                ✖️ VPN and
                ✖️ EDR and
                ✖️ Compliance consultants and
                ✖️ Secure SaaS apps
                ...with one patented solution."</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
