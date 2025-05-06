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