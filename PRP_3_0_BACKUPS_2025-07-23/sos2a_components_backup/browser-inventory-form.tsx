import React, { useState } from 'react';

interface DeviceInventory {
  deviceType: string;
  make: string;
  model: string;
  browserName: string;
  count: number;
  managementLevel: 'full' | 'partial' | 'minimal' | 'none';
}

const initialDevices: DeviceInventory[] = [
  { deviceType: 'Desktop', make: 'Dell', model: 'OptiPlex', browserName: 'Google Chrome', count: 0, managementLevel: 'partial' },
  { deviceType: 'Laptop', make: 'HP', model: 'EliteBook', browserName: 'Google Chrome', count: 0, managementLevel: 'partial' },
  { deviceType: 'Mobile', make: 'Apple', model: 'iPhone', browserName: 'Safari', count: 0, managementLevel: 'minimal' },
  { deviceType: 'Mobile', make: 'Samsung', model: 'Galaxy S21', browserName: 'Samsung Internet', count: 0, managementLevel: 'none' },
  { deviceType: 'Tablet', make: 'Apple', model: 'iPad', browserName: 'Safari', count: 0, managementLevel: 'minimal' },
  { deviceType: 'Server', make: 'Various', model: 'Various', browserName: 'Headless Chrome', count: 0, managementLevel: 'full' },
];

export default function BrowserInventoryForm() {
  const [devices, setDevices] = useState<DeviceInventory[]>(initialDevices);
  const [newDevice, setNewDevice] = useState<DeviceInventory>({
    deviceType: 'Desktop',
    make: '',
    model: '',
    browserName: 'Google Chrome',
    count: 1,
    managementLevel: 'partial'
  });
  const [submitted, setSubmitted] = useState(false);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  
  const handleChange = (index: number, field: keyof BrowserInventory, value: any) => {
    const updatedBrowsers = [...browsers];
    
    if (field === 'managementLevel') {
      updatedBrowsers[index][field] = value;
    } else {
      // For numeric fields, ensure we have a valid number
      const numValue = parseInt(value) || 0;
      updatedBrowsers[index][field] = numValue >= 0 ? numValue : 0;
    }
    
    setBrowsers(updatedBrowsers);
  };
  
  const calculateTotals = () => {
    return browsers.reduce((acc, browser) => {
      return {
        desktopCount: acc.desktopCount + browser.desktopCount,
        laptopCount: acc.laptopCount + browser.laptopCount,
        mobileCount: acc.mobileCount + browser.mobileCount,
        tabletCount: acc.tabletCount + browser.tabletCount,
        serverCount: acc.serverCount + browser.serverCount,
        otherCount: acc.otherCount + browser.otherCount,
        total: acc.total + browser.desktopCount + browser.laptopCount + browser.mobileCount + 
               browser.tabletCount + browser.serverCount + browser.otherCount
      };
    }, { desktopCount: 0, laptopCount: 0, mobileCount: 0, tabletCount: 0, serverCount: 0, otherCount: 0, total: 0 });
  };
  
  const calculateRiskScore = () => {
    const totals = calculateTotals();
    let totalDevices = totals.total;
    if (totalDevices === 0) return 0;
    
    // Calculate percentage of managed browsers
    let managedDeviceCount = 0;
    let unmanageableDeviceCount = 0;
    let riskScore = 0;
    
    browsers.forEach(browser => {
      const browserTotal = browser.desktopCount + browser.laptopCount + browser.mobileCount + 
                         browser.tabletCount + browser.serverCount + browser.otherCount;
      
      if (browserTotal === 0) return;
      
      // Management level factors
      let managementFactor = 0;
      switch(browser.managementLevel) {
        case 'full': 
          managementFactor = 1.0; 
          break;
        case 'partial': 
          managementFactor = 0.6; 
          break;
        case 'minimal': 
          managementFactor = 0.3; 
          break;
        case 'none': 
          managementFactor = 0; 
          break;
      }
      
      managedDeviceCount += browserTotal * managementFactor;
      
      // Browsers like Samsung Internet have limited enterprise management options
      if (['Samsung Internet', 'Opera Mini', 'UC Browser'].includes(browser.browser)) {
        unmanageableDeviceCount += browser.mobileCount;
      }
    });
    
    // Calculate the basic risk score (higher = more risk)
    const managementPercentage = managedDeviceCount / totalDevices;
    const unmanageablePercentage = unmanageableDeviceCount / totalDevices;
    
    // Base score: 10 = full risk, 0 = no risk
    riskScore = 10 - (managementPercentage * 10);
    
    // Add penalty for unmanageable browsers
    riskScore += unmanageablePercentage * 3;
    
    // Browser diversity penalty (more browsers = more complexity = more risk)
    const activeBrowserCount = browsers.filter(b => {
      const total = b.desktopCount + b.laptopCount + b.mobileCount + b.tabletCount + b.serverCount + b.otherCount;
      return total > 0;
    }).length;
    
    if (activeBrowserCount > 2) {
      riskScore += (activeBrowserCount - 2) * 0.5; // Add 0.5 points per browser above 2
    }
    
    // Cap the score at 10
    return Math.min(Math.round(riskScore * 10) / 10, 10);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = calculateRiskScore();
    setRiskScore(score);
    setSubmitted(true);
  };
  
  const totals = calculateTotals();
  
  const getRiskLevel = (score: number) => {
    if (score <= 3) return { level: 'Low', color: 'text-green-600' };
    if (score <= 6) return { level: 'Medium', color: 'text-yellow-600' };
    if (score <= 8) return { level: 'High', color: 'text-orange-600' };
    return { level: 'Critical', color: 'text-red-600' };
  };
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Browser Inventory Assessment</h2>
      <p className="mb-4 text-gray-700">
        Document the number of devices using each browser type in your organization. This information
        will help calculate your browser security risk score and identify management challenges.
      </p>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border text-left">Browser</th>
                <th className="px-4 py-2 border text-left">Desktop</th>
                <th className="px-4 py-2 border text-left">Laptop</th>
                <th className="px-4 py-2 border text-left">Mobile</th>
                <th className="px-4 py-2 border text-left">Tablet</th>
                <th className="px-4 py-2 border text-left">Server</th>
                <th className="px-4 py-2 border text-left">Other</th>
                <th className="px-4 py-2 border text-left">Management Level</th>
              </tr>
            </thead>
            <tbody>
              {browsers.map((browser, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-2 border font-medium">{browser.browser}</td>
                  <td className="px-4 py-2 border">
                    <input
                      type="number"
                      min="0"
                      value={browser.desktopCount}
                      onChange={(e) => handleChange(index, 'desktopCount', e.target.value)}
                      className="w-16 px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="number"
                      min="0"
                      value={browser.laptopCount}
                      onChange={(e) => handleChange(index, 'laptopCount', e.target.value)}
                      className="w-16 px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="number"
                      min="0"
                      value={browser.mobileCount}
                      onChange={(e) => handleChange(index, 'mobileCount', e.target.value)}
                      className="w-16 px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="number"
                      min="0"
                      value={browser.tabletCount}
                      onChange={(e) => handleChange(index, 'tabletCount', e.target.value)}
                      className="w-16 px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="number"
                      min="0"
                      value={browser.serverCount}
                      onChange={(e) => handleChange(index, 'serverCount', e.target.value)}
                      className="w-16 px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="number"
                      min="0"
                      value={browser.otherCount}
                      onChange={(e) => handleChange(index, 'otherCount', e.target.value)}
                      className="w-16 px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <select 
                      value={browser.managementLevel}
                      onChange={(e) => handleChange(index, 'managementLevel', e.target.value)}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="full">Full (Centrally Managed)</option>
                      <option value="partial">Partial (Some Policies)</option>
                      <option value="minimal">Minimal (Updates Only)</option>
                      <option value="none">None (Unmanaged)</option>
                    </select>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td className="px-4 py-2 border">TOTALS</td>
                <td className="px-4 py-2 border">{totals.desktopCount}</td>
                <td className="px-4 py-2 border">{totals.laptopCount}</td>
                <td className="px-4 py-2 border">{totals.mobileCount}</td>
                <td className="px-4 py-2 border">{totals.tabletCount}</td>
                <td className="px-4 py-2 border">{totals.serverCount}</td>
                <td className="px-4 py-2 border">{totals.otherCount}</td>
                <td className="px-4 py-2 border">{totals.total} devices total</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4">
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Calculate Browser Security Risk
          </button>
        </div>
      </form>
      
      {submitted && riskScore !== null && (
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Browser Security Risk Assessment</h3>
          
          <div className="flex items-center mb-4">
            <div className="text-lg mr-4">
              Risk Score: <span className={`font-bold ${getRiskLevel(riskScore).color}`}>{riskScore} / 10</span>
            </div>
            <div className="text-lg">
              Risk Level: <span className={`font-bold ${getRiskLevel(riskScore).color}`}>{getRiskLevel(riskScore).level}</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 h-4 rounded-full mb-4">
            <div 
              className={`h-4 rounded-full ${
                riskScore <= 3 ? 'bg-green-500' : 
                riskScore <= 6 ? 'bg-yellow-500' : 
                riskScore <= 8 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${riskScore * 10}%` }}
            ></div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Risk Assessment Insights:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {totals.total === 0 && (
                <li>No browser data provided. Please enter your organization's browser inventory.</li>
              )}
              
              {totals.total > 0 && (
                <>
                  <li>
                    Your organization has {totals.total} browser instances across {
                      browsers.filter(b => {
                        const total = b.desktopCount + b.laptopCount + b.mobileCount + 
                                     b.tabletCount + b.serverCount + b.otherCount;
                        return total > 0;
                      }).length
                    } different browser types.
                  </li>
                  
                  {browsers.filter(b => b.managementLevel === 'none' && 
                    (b.desktopCount + b.laptopCount + b.mobileCount + b.tabletCount + b.serverCount + b.otherCount > 0)
                  ).length > 0 && (
                    <li className="text-orange-600">
                      You have unmanaged browsers in your environment, representing a significant security risk.
                    </li>
                  )}
                  
                  {(totals.mobileCount / totals.total) > 0.4 && (
                    <li className="text-yellow-600">
                      Over 40% of your browser instances are on mobile devices, which typically have fewer management options.
                    </li>
                  )}
                  
                  {browsers.filter(b => b.managementLevel === 'full').length === 0 && totals.total > 0 && (
                    <li className="text-red-600">
                      None of your browsers are under full centralized management, creating security consistency challenges.
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>
          
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Recommendations:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {riskScore > 6 && (
                <li className="text-red-600">
                  <strong>High Priority:</strong> Implement centralized browser management via group policies, MDM, or configuration management tools.
                </li>
              )}
              
              {browsers.filter(b => {
                const total = b.desktopCount + b.laptopCount + b.mobileCount + b.tabletCount + b.serverCount + b.otherCount;
                return total > 0;
              }).length > 3 && (
                <li className="text-yellow-600">
                  Reduce browser diversity by standardizing on fewer browser types (2-3 maximum).
                </li>
              )}
              
              {browsers.some(b => b.browser === 'Other' && 
                (b.desktopCount + b.laptopCount + b.mobileCount + b.tabletCount + b.serverCount + b.otherCount > 0)) && (
                <li className="text-orange-600">
                  Identify and evaluate all "Other" browser types in your environment for security risks.
                </li>
              )}
              
              <li>
                Ensure automatic updates are enabled for all browsers in your environment.
              </li>
              
              <li>
                Document browser security requirements in your baseline configuration standards.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}