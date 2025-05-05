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
  { deviceType: 'Desktop', make: 'Dell', model: 'OptiPlex', browserName: 'Google Chrome', count: 15, managementLevel: 'partial' },
  { deviceType: 'Laptop', make: 'HP', model: 'EliteBook', browserName: 'Google Chrome', count: 22, managementLevel: 'partial' },
  { deviceType: 'Mobile', make: 'Apple', model: 'iPhone', browserName: 'Safari', count: 8, managementLevel: 'minimal' },
  { deviceType: 'Mobile', make: 'Samsung', model: 'Galaxy S21', browserName: 'Samsung Internet', count: 5, managementLevel: 'none' },
  { deviceType: 'Tablet', make: 'Apple', model: 'iPad', browserName: 'Safari', count: 3, managementLevel: 'minimal' },
  { deviceType: 'Server', make: 'Various', model: 'Various', browserName: 'Headless Chrome', count: 2, managementLevel: 'full' },
];

const deviceTypes = ['Desktop', 'Laptop', 'Mobile', 'Tablet', 'Server', 'Wearable', 'Other'];
const browserOptions = [
  'Google Chrome', 
  'Mozilla Firefox', 
  'Microsoft Edge', 
  'Safari', 
  'Samsung Internet', 
  'Brave',
  'Opera',
  'Vivaldi',
  'Tor Browser',
  'DuckDuckGo Browser',
  'Opera Mini',
  'UC Browser',
  'Headless Chrome',
  'Other'
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
  
  const handleNewDeviceChange = (field: keyof DeviceInventory, value: any) => {
    setNewDevice(prev => ({
      ...prev,
      [field]: field === 'count' ? (parseInt(value) || 0) : value
    }));
  };
  
  const handleDeviceChange = (index: number, field: keyof DeviceInventory, value: any) => {
    const updatedDevices = [...devices];
    
    if (field === 'count') {
      const numValue = parseInt(value) || 0;
      updatedDevices[index][field] = numValue >= 0 ? numValue : 0;
    } else {
      updatedDevices[index][field] = value;
    }
    
    setDevices(updatedDevices);
  };
  
  const addDevice = () => {
    if (newDevice.make.trim() === '' || newDevice.model.trim() === '') {
      alert('Please enter both make and model for the device');
      return;
    }
    
    setDevices(prev => [...prev, {...newDevice}]);
    setNewDevice({
      deviceType: 'Desktop',
      make: '',
      model: '',
      browserName: 'Google Chrome',
      count: 1,
      managementLevel: 'partial'
    });
  };
  
  const removeDevice = (index: number) => {
    setDevices(prev => prev.filter((_, i) => i !== index));
  };
  
  const calculateTotalDevices = () => {
    return devices.reduce((total, device) => total + device.count, 0);
  };
  
  const calculateRiskScore = () => {
    const totalDevices = calculateTotalDevices();
    if (totalDevices === 0) return 0;
    
    // Calculate percentage of managed browsers
    let managedDeviceCount = 0;
    let unmanageableDeviceCount = 0;
    let riskScore = 0;
    
    devices.forEach(device => {
      if (device.count === 0) return;
      
      // Management level factors
      let managementFactor = 0;
      switch(device.managementLevel) {
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
      
      managedDeviceCount += device.count * managementFactor;
      
      // Browsers like Samsung Internet have limited enterprise management options
      if (['Samsung Internet', 'Opera Mini', 'UC Browser'].includes(device.browserName) && 
          ['Mobile', 'Tablet'].includes(device.deviceType)) {
        unmanageableDeviceCount += device.count;
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
    const uniqueBrowsers = new Set(devices.map(d => d.browserName));
    const browserDiversity = uniqueBrowsers.size;
    
    if (browserDiversity > 2) {
      riskScore += (browserDiversity - 2) * 0.5; // Add 0.5 points per browser type above 2
    }
    
    // Device type diversity
    const uniqueDeviceTypes = new Set(devices.map(d => d.deviceType));
    if (uniqueDeviceTypes.size > 3) {
      riskScore += (uniqueDeviceTypes.size - 3) * 0.3; // Add 0.3 points per device type above 3
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
  
  const getRiskLevel = (score: number) => {
    if (score <= 3) return { level: 'Low', color: 'text-green-600' };
    if (score <= 6) return { level: 'Medium', color: 'text-yellow-600' };
    if (score <= 8) return { level: 'High', color: 'text-orange-600' };
    return { level: 'Critical', color: 'text-red-600' };
  };
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Device Browser Inventory</h2>
      <p className="mb-4 text-gray-700">
        Document the devices in your organization and their installed browsers. This information
        will help calculate your browser security risk score and identify potential vulnerabilities.
      </p>
      
      <div className="mb-8 p-5 border border-gray-200 rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium mb-3">Add New Device</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Device Type</label>
            <select 
              value={newDevice.deviceType}
              onChange={(e) => handleNewDeviceChange('deviceType', e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              {deviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Make</label>
            <input 
              type="text" 
              value={newDevice.make}
              onChange={(e) => handleNewDeviceChange('make', e.target.value)}
              placeholder="e.g. Dell, Apple, HP" 
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Model</label>
            <input 
              type="text" 
              value={newDevice.model}
              onChange={(e) => handleNewDeviceChange('model', e.target.value)}
              placeholder="e.g. OptiPlex, MacBook Pro" 
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Browser</label>
            <select 
              value={newDevice.browserName}
              onChange={(e) => handleNewDeviceChange('browserName', e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              {browserOptions.map(browser => (
                <option key={browser} value={browser}>{browser}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Number of Devices</label>
            <input 
              type="number" 
              value={newDevice.count}
              onChange={(e) => handleNewDeviceChange('count', e.target.value)}
              min="1"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Management Level</label>
            <select 
              value={newDevice.managementLevel}
              onChange={(e) => handleNewDeviceChange('managementLevel', e.target.value as any)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="full">Full (Centrally Managed)</option>
              <option value="partial">Partial (Some Policies)</option>
              <option value="minimal">Minimal (Updates Only)</option>
              <option value="none">None (Unmanaged)</option>
            </select>
          </div>
        </div>
        
        <button 
          type="button"
          onClick={addDevice}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Device
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border text-left">Device Type</th>
                <th className="px-4 py-2 border text-left">Make</th>
                <th className="px-4 py-2 border text-left">Model</th>
                <th className="px-4 py-2 border text-left">Browser</th>
                <th className="px-4 py-2 border text-left">Count</th>
                <th className="px-4 py-2 border text-left">Management Level</th>
                <th className="px-4 py-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-2 border">
                    <select 
                      value={device.deviceType}
                      onChange={(e) => handleDeviceChange(index, 'deviceType', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    >
                      {deviceTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="text"
                      value={device.make}
                      onChange={(e) => handleDeviceChange(index, 'make', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="text"
                      value={device.model}
                      onChange={(e) => handleDeviceChange(index, 'model', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <select 
                      value={device.browserName}
                      onChange={(e) => handleDeviceChange(index, 'browserName', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    >
                      {browserOptions.map(browser => (
                        <option key={browser} value={browser}>{browser}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="number"
                      min="0"
                      value={device.count}
                      onChange={(e) => handleDeviceChange(index, 'count', e.target.value)}
                      className="w-20 px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <select 
                      value={device.managementLevel}
                      onChange={(e) => handleDeviceChange(index, 'managementLevel', e.target.value as any)}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="full">Full (Centrally Managed)</option>
                      <option value="partial">Partial (Some Policies)</option>
                      <option value="minimal">Minimal (Updates Only)</option>
                      <option value="none">None (Unmanaged)</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 border">
                    <button 
                      type="button" 
                      onClick={() => removeDevice(index)}
                      className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td className="px-4 py-2 border" colSpan={4}>TOTAL DEVICES</td>
                <td className="px-4 py-2 border">{calculateTotalDevices()}</td>
                <td className="px-4 py-2 border" colSpan={2}></td>
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
              {calculateTotalDevices() === 0 && (
                <li>No browser data provided. Please enter your organization's browser inventory.</li>
              )}
              
              {calculateTotalDevices() > 0 && (
                <>
                  <li>
                    Your organization has {calculateTotalDevices()} browser instances across {
                      new Set(devices.map(d => d.browserName)).size
                    } different browser types.
                  </li>
                  
                  {devices.filter(d => d.managementLevel === 'none' && d.count > 0).length > 0 && (
                    <li className="text-orange-600">
                      You have unmanaged browsers in your environment, representing a significant security risk.
                    </li>
                  )}
                  
                  {devices.filter(d => ['Mobile', 'Tablet'].includes(d.deviceType)).reduce((sum, d) => sum + d.count, 0) / calculateTotalDevices() > 0.4 && (
                    <li className="text-yellow-600">
                      Over 40% of your browser instances are on mobile devices, which typically have fewer management options.
                    </li>
                  )}
                  
                  {devices.filter(d => d.managementLevel === 'full').length === 0 && calculateTotalDevices() > 0 && (
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
              
              {new Set(devices.map(d => d.browserName)).size > 3 && (
                <li className="text-yellow-600">
                  Reduce browser diversity by standardizing on fewer browser types (2-3 maximum).
                </li>
              )}
              
              {devices.some(d => d.browserName === 'Other' && d.count > 0) && (
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