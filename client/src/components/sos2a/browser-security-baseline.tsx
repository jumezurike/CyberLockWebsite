import React from 'react';

interface BrowserSecurityData {
  browser: string;
  engine: string;
  platforms: string;
  endpointType: string;
  marketShare: string;
  securityConsiderations: string[];
}

export default function BrowserSecurityBaseline() {
  const browserSecurityData: BrowserSecurityData[] = [
    {
      browser: "Google Chrome",
      engine: "Blink (Chromium)",
      platforms: "Windows, macOS, Linux, Android, iOS",
      endpointType: "Desktop, Laptop, Mobile",
      marketShare: "High",
      securityConsiderations: [
        "Regular updates can be centrally managed via group policy",
        "Sandboxing isolates browser processes from system",
        "Site isolation prevents cross-site attacks",
        "Can enforce organization-wide security policies"
      ]
    },
    {
      browser: "Mozilla Firefox",
      engine: "Gecko",
      platforms: "Windows, macOS, Linux, Android, iOS",
      endpointType: "Desktop, Laptop, Mobile",
      marketShare: "Medium",
      securityConsiderations: [
        "Enhanced Tracking Protection blocks trackers by default",
        "Can disable vulnerable cryptographic protocols",
        "Container tabs isolate browsing sessions",
        "Enterprise policies can be deployed via JSON files"
      ]
    },
    {
      browser: "Microsoft Edge",
      engine: "Blink (Chromium)",
      platforms: "Windows, macOS, Android, iOS",
      endpointType: "Desktop, Laptop, Mobile",
      marketShare: "Medium-High",
      securityConsiderations: [
        "SmartScreen provides phishing and malware protection",
        "Application Guard isolates browser from enterprise data",
        "Built-in tracking prevention options",
        "Integration with Microsoft Defender for Office 365"
      ]
    },
    {
      browser: "Safari",
      engine: "WebKit",
      platforms: "macOS, iOS",
      endpointType: "Desktop, Laptop, Mobile, Tablet",
      marketShare: "High (on Apple devices)",
      securityConsiderations: [
        "Intelligent Tracking Prevention limits cross-site tracking",
        "Sandboxed renderer processes",
        "Content blockers can be deployed enterprise-wide",
        "Managed via MDM on enterprise Apple devices"
      ]
    },
    {
      browser: "Brave",
      engine: "Blink (Chromium)",
      platforms: "Windows, macOS, Linux, Android, iOS",
      endpointType: "Desktop, Laptop, Mobile",
      marketShare: "Low",
      securityConsiderations: [
        "Built-in ad and tracker blocking",
        "HTTPS Everywhere feature by default",
        "Script blocking capabilities",
        "Fingerprinting protection"
      ]
    },
    {
      browser: "Tor Browser",
      engine: "Gecko (modified)",
      platforms: "Windows, macOS, Linux",
      endpointType: "Desktop, Laptop",
      marketShare: "Very Low",
      securityConsiderations: [
        "Anonymizes browsing through onion routing",
        "NoScript and HTTPS Everywhere built-in",
        "Anti-fingerprinting techniques",
        "Isolation of tracking identifiers per site"
      ]
    }
  ];

  return (
    <div className="w-full mt-8 mb-8">
      <h2 className="text-xl font-semibold mb-4">Browser Security Baseline Configurations</h2>
      <p className="mb-4 text-gray-700">
        Web browsers are one of the primary attack vectors in modern cybersecurity. Organizations should establish 
        baseline configurations for approved browsers to minimize risks from these Internet-facing applications.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border text-left">Browser</th>
              <th className="px-4 py-2 border text-left">Engine</th>
              <th className="px-4 py-2 border text-left">Platforms</th>
              <th className="px-4 py-2 border text-left">Endpoint Types</th>
              <th className="px-4 py-2 border text-left">Security Considerations</th>
            </tr>
          </thead>
          <tbody>
            {browserSecurityData.map((browser, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="px-4 py-2 border font-medium">{browser.browser}</td>
                <td className="px-4 py-2 border">{browser.engine}</td>
                <td className="px-4 py-2 border">{browser.platforms}</td>
                <td className="px-4 py-2 border">{browser.endpointType}</td>
                <td className="px-4 py-2 border">
                  <ul className="list-disc pl-5">
                    {browser.securityConsiderations.map((consideration, i) => (
                      <li key={i} className="mb-1 last:mb-0">{consideration}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
        <h3 className="text-lg font-medium mb-2">Baseline Configuration Recommendations</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Standardize on a limited set of approved browsers within the organization</li>
          <li>Enforce automatic updates for all browsers to ensure security patches are applied</li>
          <li>Configure browsers to use enterprise certificate authorities and trusted root certificates</li>
          <li>Disable vulnerable plugins, extensions, and protocols (e.g., FTP, obsolete TLS versions)</li>
          <li>Enable phishing and malware protection features</li>
          <li>Deploy content filtering or DNS-based protection when possible</li>
          <li>Consider browser isolation technologies for high-risk users or sensitive activities</li>
          <li>Use Group Policy, MDM, or configuration management tools to deploy consistent browser settings</li>
        </ul>
      </div>
    </div>
  );
}