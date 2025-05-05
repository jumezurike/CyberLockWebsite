import React, { useState } from 'react';
import { Link } from 'wouter';

export default function BrowserSecurityBaseline() {
  const [activeTab, setActiveTab] = useState<'baseline' | 'reference'>('baseline');

  return (
    <div>
      <div className="mb-6">
        <nav className="flex border-b border-gray-300">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'baseline'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('baseline')}
          >
            Browser Baseline Controls
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'reference'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('reference')}
          >
            Browser Reference Guide
          </button>
        </nav>
      </div>

      {activeTab === 'baseline' ? (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Browser Security Baseline Requirements</h2>
            <p className="mb-4 text-gray-700">
              These browser security controls should be enforced across your organization as part of the 
              Baseline Configuration parameter requirements in the SOS²A assessment.
            </p>
            
            <div className="p-5 bg-blue-50 rounded-lg border border-blue-200 mb-4">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
                <h3 className="text-lg font-medium">Device Inventory Tracking</h3>
              </div>
              <p className="mb-3">
                Before implementing browser security controls, you need to complete a browser inventory across
                your organization. This inventory is critical to understanding your attack surface.
              </p>
              <Link href="/device-inventory">
                <a className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  Go to Device Inventory Tracking
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 ml-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M14 5l7 7m0 0l-7 7m7-7H3" 
                    />
                  </svg>
                </a>
              </Link>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Required Browser Security Controls</h3>
              <ul className="space-y-3">
                <li className="p-3 bg-white rounded border border-gray-200">
                  <div className="font-medium">1. Automatic Updates Enforcement</div>
                  <div className="text-gray-600 text-sm mt-1">
                    All browsers must be configured to automatically download and install updates.
                  </div>
                </li>
                <li className="p-3 bg-white rounded border border-gray-200">
                  <div className="font-medium">2. Extension Control</div>
                  <div className="text-gray-600 text-sm mt-1">
                    Browser extensions must be managed through organizational policies with unauthorized extensions blocked.
                  </div>
                </li>
                <li className="p-3 bg-white rounded border border-gray-200">
                  <div className="font-medium">3. TLS Configuration</div>
                  <div className="text-gray-600 text-sm mt-1">
                    Browsers must enforce TLS 1.2+ with weak cipher suites disabled.
                  </div>
                </li>
                <li className="p-3 bg-white rounded border border-gray-200">
                  <div className="font-medium">4. Download Restrictions</div>
                  <div className="text-gray-600 text-sm mt-1">
                    File download restrictions must be implemented based on file types and sources.
                  </div>
                </li>
                <li className="p-3 bg-white rounded border border-gray-200">
                  <div className="font-medium">5. Password Manager Controls</div>
                  <div className="text-gray-600 text-sm mt-1">
                    Organizational policy for password management in browsers must be enforced.
                  </div>
                </li>
                <li className="p-3 bg-white rounded border border-gray-200">
                  <div className="font-medium">6. Browser Sync Limitations</div>
                  <div className="text-gray-600 text-sm mt-1">
                    Browser synchronization features must be controlled to prevent data leakage.
                  </div>
                </li>
                <li className="p-3 bg-white rounded border border-gray-200">
                  <div className="font-medium">7. Certificate Pinning</div>
                  <div className="text-gray-600 text-sm mt-1">
                    Certificate pinning for critical internal applications should be implemented.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Web Browser Technical Reference</h2>
          <p className="mb-4 text-gray-700">
            This reference guide provides details about common browsers, their rendering engines,
            supported platforms, and device types. Use this information to understand the browser
            landscape in your organization and inform security decisions.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border text-left">Browser</th>
                  <th className="px-4 py-2 border text-left">Engine</th>
                  <th className="px-4 py-2 border text-left">OS / Platform</th>
                  <th className="px-4 py-2 border text-left">Endpoint Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border font-medium">Google Chrome</td>
                  <td className="px-4 py-2 border">Blink (Chromium)</td>
                  <td className="px-4 py-2 border">Windows, macOS, Linux, Android, iOS</td>
                  <td className="px-4 py-2 border">Desktop, Laptop, Mobile</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border font-medium">Mozilla Firefox</td>
                  <td className="px-4 py-2 border">Gecko</td>
                  <td className="px-4 py-2 border">Windows, macOS, Linux, Android, iOS</td>
                  <td className="px-4 py-2 border">Desktop, Laptop, Mobile</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-medium">Microsoft Edge</td>
                  <td className="px-4 py-2 border">Blink (Chromium)</td>
                  <td className="px-4 py-2 border">Windows, macOS, Android, iOS</td>
                  <td className="px-4 py-2 border">Desktop, Laptop, Mobile</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border font-medium">Safari</td>
                  <td className="px-4 py-2 border">WebKit</td>
                  <td className="px-4 py-2 border">macOS, iOS</td>
                  <td className="px-4 py-2 border">Mobile, Tablet</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-medium">Brave</td>
                  <td className="px-4 py-2 border">Blink (Chromium)</td>
                  <td className="px-4 py-2 border">Windows, macOS, Linux, Android, iOS</td>
                  <td className="px-4 py-2 border">Desktop, Laptop, Mobile</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border font-medium">Opera</td>
                  <td className="px-4 py-2 border">Blink (Chromium)</td>
                  <td className="px-4 py-2 border">Windows, macOS, Android</td>
                  <td className="px-4 py-2 border">Desktop, Laptop, Mobile</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-medium">Vivaldi</td>
                  <td className="px-4 py-2 border">Blink (Chromium)</td>
                  <td className="px-4 py-2 border">Windows, macOS, Linux</td>
                  <td className="px-4 py-2 border">Desktop, Laptop</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border font-medium">Tor Browser</td>
                  <td className="px-4 py-2 border">Gecko (modified)</td>
                  <td className="px-4 py-2 border">Windows, macOS, Linux</td>
                  <td className="px-4 py-2 border">Desktop, Laptop</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-medium">Samsung Internet</td>
                  <td className="px-4 py-2 border">Blink (Chromium)</td>
                  <td className="px-4 py-2 border">Android (Galaxy devices)</td>
                  <td className="px-4 py-2 border">Mobile</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border font-medium">DuckDuckGo Browser</td>
                  <td className="px-4 py-2 border">WebKit/Blink hybrid</td>
                  <td className="px-4 py-2 border">Android, iOS</td>
                  <td className="px-4 py-2 border">Mobile</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-medium">Opera Mini</td>
                  <td className="px-4 py-2 border">Presto (legacy)</td>
                  <td className="px-4 py-2 border">Android, iOS</td>
                  <td className="px-4 py-2 border">Mobile</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border font-medium">UC Browser</td>
                  <td className="px-4 py-2 border">Custom (Chromium-based)</td>
                  <td className="px-4 py-2 border">Android, iOS</td>
                  <td className="px-4 py-2 border">Mobile</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-medium">Lynx</td>
                  <td className="px-4 py-2 border">Text-based</td>
                  <td className="px-4 py-2 border">Linux/Unix</td>
                  <td className="px-4 py-2 border">Server, Terminal</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border font-medium">w3m</td>
                  <td className="px-4 py-2 border">Text-based</td>
                  <td className="px-4 py-2 border">Linux/Unix</td>
                  <td className="px-4 py-2 border">Server, Terminal</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-medium">Links</td>
                  <td className="px-4 py-2 border">Text-based</td>
                  <td className="px-4 py-2 border">Linux/Unix</td>
                  <td className="px-4 py-2 border">Server, Terminal</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border font-medium">Headless Chrome</td>
                  <td className="px-4 py-2 border">Blink (Chromium)</td>
                  <td className="px-4 py-2 border">Linux, servers</td>
                  <td className="px-4 py-2 border">Server</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-medium">Electron (CefSharp)</td>
                  <td className="px-4 py-2 border">Blink (Chromium)</td>
                  <td className="px-4 py-2 border">Windows, macOS, Linux</td>
                  <td className="px-4 py-2 border">Desktop, Server</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border font-medium">Samsung Internet (Watch)</td>
                  <td className="px-4 py-2 border">Blink (Wear OS)</td>
                  <td className="px-4 py-2 border">Wear OS, Tizen</td>
                  <td className="px-4 py-2 border">Wearable</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Security Implications</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-medium">Engine Diversity:</span> Multiple rendering engines complicate security testing and validation</li>
              <li><span className="font-medium">Update Management:</span> Different browsers have varied update mechanisms and schedules</li>
              <li><span className="font-medium">Policy Enforcement:</span> Management capabilities vary significantly by browser and platform</li>
              <li><span className="font-medium">Extension Control:</span> Browser extension management capabilities differ by browser</li>
              <li><span className="font-medium">Mobile Limitations:</span> Mobile browsers often have fewer enterprise management options</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}