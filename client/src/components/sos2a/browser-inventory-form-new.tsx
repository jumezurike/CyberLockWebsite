import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, Info, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BrowserData {
  id: string;
  browserType: string;
  browserVersion: string;
  deviceCount: number;
  deviceType: string;
  deviceManufacturer: string;
  deviceModel: string;
  operatingSystem: string;
  osVersion: string;
  lastUpdated: string;
}

export default function BrowserInventoryForm() {
  const { toast } = useToast();
  const [browsers, setBrowsers] = useState<BrowserData[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [newBrowser, setNewBrowser] = useState<Partial<BrowserData>>({
    browserType: "",
    browserVersion: "",
    deviceCount: 1,
    deviceType: "",
    deviceManufacturer: "",
    deviceModel: "",
    operatingSystem: "",
    osVersion: "",
  });
  
  // Form validation states
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Browser security risk assessment
  const calculateBrowserRiskScore = (browser: BrowserData): number => {
    let score = 100; // Start with perfect score
    
    // Outdated browsers pose security risks
    if (browser.browserType === "Internet Explorer") {
      score -= 40; // IE is no longer supported and has major security issues
    } else if (browser.browserType === "Firefox" && parseFloat(browser.browserVersion) < 90) {
      score -= 20;
    } else if (browser.browserType === "Chrome" && parseFloat(browser.browserVersion) < 90) {
      score -= 15;
    } else if (browser.browserType === "Safari" && parseFloat(browser.browserVersion) < 14) {
      score -= 25;
    } else if (browser.browserType === "Edge" && browser.browserVersion.includes("Legacy")) {
      score -= 35;
    }
    
    // Apply operating system risk factors
    if (browser.operatingSystem === "Windows" && parseFloat(browser.osVersion) < 10) {
      score -= 30; // Older Windows versions have security issues
    } else if (browser.operatingSystem === "macOS" && parseFloat(browser.osVersion) < 11) {
      score -= 15;
    } else if (browser.operatingSystem === "Android" && parseFloat(browser.osVersion) < 10) {
      score -= 25;
    } else if (browser.operatingSystem === "iOS" && parseFloat(browser.osVersion) < 13) {
      score -= 20;
    }
    
    // Multiply by device count to represent scale of risk
    // But normalize to avoid extreme scores
    const countFactor = Math.min(browser.deviceCount / 10, 3);
    score = Math.max(0, Math.min(100, score - (countFactor * 5)));
    
    return Math.round(score);
  };
  
  const getRiskLevel = (score: number): "high" | "medium" | "low" => {
    if (score < 40) return "high";
    if (score < 70) return "medium";
    return "low";
  };
  
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!newBrowser.browserType) errors.browserType = "Browser type is required";
    if (!newBrowser.browserVersion) errors.browserVersion = "Browser version is required";
    if (!newBrowser.deviceType) errors.deviceType = "Device type is required";
    if (!newBrowser.operatingSystem) errors.operatingSystem = "Operating system is required";
    if (!newBrowser.osVersion) errors.osVersion = "OS version is required";
    
    // Validate deviceCount is a positive number
    if (!newBrowser.deviceCount || newBrowser.deviceCount < 1) {
      errors.deviceCount = "Device count must be at least 1";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleAddBrowser = () => {
    if (!validateForm()) return;
    
    const today = new Date();
    const browser: BrowserData = {
      id: crypto.randomUUID(),
      browserType: newBrowser.browserType || "",
      browserVersion: newBrowser.browserVersion || "",
      deviceCount: newBrowser.deviceCount || 1,
      deviceType: newBrowser.deviceType || "",
      deviceManufacturer: newBrowser.deviceManufacturer || "Unknown",
      deviceModel: newBrowser.deviceModel || "Unknown",
      operatingSystem: newBrowser.operatingSystem || "",
      osVersion: newBrowser.osVersion || "",
      lastUpdated: today.toISOString(),
    };
    
    setBrowsers([...browsers, browser]);
    
    // Reset form
    setNewBrowser({
      browserType: "",
      browserVersion: "",
      deviceCount: 1,
      deviceType: "",
      deviceManufacturer: "",
      deviceModel: "",
      operatingSystem: "",
      osVersion: "",
    });
    
    setFormOpen(false);
    
    toast({
      title: "Browser added",
      description: `Added ${browser.browserType} on ${browser.deviceCount} ${browser.deviceType} devices to inventory.`,
    });
  };
  
  const handleDeleteBrowser = (id: string) => {
    setBrowsers(browsers.filter(browser => browser.id !== id));
    toast({
      title: "Browser removed",
      description: "The browser entry has been removed from inventory.",
    });
  };
  
  // Calculate overall browser security posture
  const calculateOverallScore = (): number => {
    if (browsers.length === 0) return 0;
    
    const totalDevices = browsers.reduce((sum, browser) => sum + browser.deviceCount, 0);
    const weightedScore = browsers.reduce((sum, browser) => {
      const score = calculateBrowserRiskScore(browser);
      const weight = browser.deviceCount / totalDevices;
      return sum + (score * weight);
    }, 0);
    
    return Math.round(weightedScore);
  };
  
  // Count browsers by risk level
  const countBrowsersByRisk = () => {
    const counts = { high: 0, medium: 0, low: 0 };
    browsers.forEach(browser => {
      const score = calculateBrowserRiskScore(browser);
      const risk = getRiskLevel(score);
      counts[risk] += browser.deviceCount;
    });
    return counts;
  };
  
  const overallScore = calculateOverallScore();
  const riskCounts = countBrowsersByRisk();
  const totalDevices = browsers.reduce((sum, browser) => sum + browser.deviceCount, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {/* Risk summary card */}
        <Card>
          <CardHeader>
            <CardTitle>Browser Security Overview</CardTitle>
            <CardDescription>
              Track and assess the security of browsers across your organization
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="text-2xl font-bold">{totalDevices}</div>
                <div className="text-sm text-gray-600">Total Devices</div>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="text-2xl font-bold">
                  {overallScore}%
                </div>
                <div className="text-sm text-gray-600">Browser Security Score</div>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="text-2xl font-bold">
                  {browsers.length}
                </div>
                <div className="text-sm text-gray-600">Browser Types</div>
              </div>
            </div>
            
            {browsers.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className={`p-2 rounded-md ${riskCounts.high > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                  <div className="font-medium">{riskCounts.high}</div>
                  <div className="text-xs">High Risk Devices</div>
                </div>
                <div className={`p-2 rounded-md ${riskCounts.medium > 0 ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                  <div className="font-medium">{riskCounts.medium}</div>
                  <div className="text-xs">Medium Risk Devices</div>
                </div>
                <div className={`p-2 rounded-md ${riskCounts.low > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <div className="font-medium">{riskCounts.low}</div>
                  <div className="text-xs">Low Risk Devices</div>
                </div>
              </div>
            ) : null}
            
            {browsers.length === 0 ? (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No browsers added</AlertTitle>
                <AlertDescription>
                  Add browser information to begin tracking your organization's browser security posture.
                </AlertDescription>
              </Alert>
            ) : null}
            
            <div>
              <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogTrigger asChild>
                  <Button>Add Browser</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Browser to Inventory</DialogTitle>
                    <DialogDescription>
                      Enter details about the browser and devices it's installed on
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="browserType">Browser Type</Label>
                        <Select
                          value={newBrowser.browserType}
                          onValueChange={(value) => setNewBrowser({...newBrowser, browserType: value})}
                        >
                          <SelectTrigger id="browserType">
                            <SelectValue placeholder="Select browser" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Chrome">Chrome</SelectItem>
                            <SelectItem value="Firefox">Firefox</SelectItem>
                            <SelectItem value="Safari">Safari</SelectItem>
                            <SelectItem value="Edge">Edge</SelectItem>
                            <SelectItem value="Internet Explorer">Internet Explorer</SelectItem>
                            <SelectItem value="Opera">Opera</SelectItem>
                            <SelectItem value="Brave">Brave</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.browserType && (
                          <p className="text-xs text-red-500">{formErrors.browserType}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="browserVersion">Browser Version</Label>
                        <Input
                          id="browserVersion"
                          value={newBrowser.browserVersion}
                          onChange={(e) => setNewBrowser({...newBrowser, browserVersion: e.target.value})}
                          placeholder="e.g. 92.0.4515.107"
                        />
                        {formErrors.browserVersion && (
                          <p className="text-xs text-red-500">{formErrors.browserVersion}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deviceCount">Number of Devices</Label>
                      <Input
                        id="deviceCount"
                        type="number"
                        min="1"
                        value={newBrowser.deviceCount || ""}
                        onChange={(e) => setNewBrowser({...newBrowser, deviceCount: parseInt(e.target.value)})}
                      />
                      {formErrors.deviceCount && (
                        <p className="text-xs text-red-500">{formErrors.deviceCount}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="deviceType">Device Type</Label>
                        <Select
                          value={newBrowser.deviceType}
                          onValueChange={(value) => setNewBrowser({...newBrowser, deviceType: value})}
                        >
                          <SelectTrigger id="deviceType">
                            <SelectValue placeholder="Select device type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Desktop">Desktop</SelectItem>
                            <SelectItem value="Laptop">Laptop</SelectItem>
                            <SelectItem value="Tablet">Tablet</SelectItem>
                            <SelectItem value="Smartphone">Smartphone</SelectItem>
                            <SelectItem value="Kiosk">Kiosk</SelectItem>
                            <SelectItem value="IoT Device">IoT Device</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.deviceType && (
                          <p className="text-xs text-red-500">{formErrors.deviceType}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="deviceManufacturer">Device Manufacturer</Label>
                        <Input
                          id="deviceManufacturer"
                          value={newBrowser.deviceManufacturer}
                          onChange={(e) => setNewBrowser({...newBrowser, deviceManufacturer: e.target.value})}
                          placeholder="e.g. Dell, Apple, Samsung"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deviceModel">Device Model (Optional)</Label>
                      <Input
                        id="deviceModel"
                        value={newBrowser.deviceModel}
                        onChange={(e) => setNewBrowser({...newBrowser, deviceModel: e.target.value})}
                        placeholder="e.g. MacBook Pro, Galaxy S21"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="operatingSystem">Operating System</Label>
                        <Select
                          value={newBrowser.operatingSystem}
                          onValueChange={(value) => setNewBrowser({...newBrowser, operatingSystem: value})}
                        >
                          <SelectTrigger id="operatingSystem">
                            <SelectValue placeholder="Select OS" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Windows">Windows</SelectItem>
                            <SelectItem value="macOS">macOS</SelectItem>
                            <SelectItem value="Linux">Linux</SelectItem>
                            <SelectItem value="Chrome OS">Chrome OS</SelectItem>
                            <SelectItem value="iOS">iOS</SelectItem>
                            <SelectItem value="Android">Android</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.operatingSystem && (
                          <p className="text-xs text-red-500">{formErrors.operatingSystem}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="osVersion">OS Version</Label>
                        <Input
                          id="osVersion"
                          value={newBrowser.osVersion}
                          onChange={(e) => setNewBrowser({...newBrowser, osVersion: e.target.value})}
                          placeholder="e.g. 10, 11.4, 12"
                        />
                        {formErrors.osVersion && (
                          <p className="text-xs text-red-500">{formErrors.osVersion}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddBrowser}>Add to Inventory</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
        
        {/* Browser inventory table */}
        {browsers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Browser Inventory</CardTitle>
              <CardDescription>
                List of all browsers in your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Browser</TableHead>
                      <TableHead>Device Type</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Operating System</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {browsers.map((browser) => {
                      const score = calculateBrowserRiskScore(browser);
                      const riskLevel = getRiskLevel(score);
                      
                      return (
                        <TableRow key={browser.id}>
                          <TableCell>
                            <div className="font-medium">{browser.browserType}</div>
                            <div className="text-xs text-muted-foreground">v{browser.browserVersion}</div>
                          </TableCell>
                          <TableCell>
                            <div>{browser.deviceType}</div>
                            <div className="text-xs text-muted-foreground">
                              {browser.deviceManufacturer} {browser.deviceModel}
                            </div>
                          </TableCell>
                          <TableCell>{browser.deviceCount}</TableCell>
                          <TableCell>
                            <div>{browser.operatingSystem}</div>
                            <div className="text-xs text-muted-foreground">v{browser.osVersion}</div>
                          </TableCell>
                          <TableCell>
                            <div 
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                ${riskLevel === 'high' ? 'bg-red-100 text-red-800' : 
                                  riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-green-100 text-green-800'}`
                              }
                            >
                              {score}% - {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteBrowser(browser.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Security recommendations card */}
        {browsers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Browser Security Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                {riskCounts.high > 0 && (
                  <li className="text-red-600">
                    <strong>Critical:</strong> Update or replace browsers with high risk scores to improve security posture.
                  </li>
                )}
                {browsers.some(b => b.browserType === "Internet Explorer") && (
                  <li className="text-red-600">
                    <strong>Critical:</strong> Internet Explorer is outdated and poses significant security risks. Migrate to a modern browser.
                  </li>
                )}
                {browsers.some(b => b.operatingSystem === "Windows" && parseFloat(b.osVersion) < 10) && (
                  <li className="text-red-600">
                    <strong>Critical:</strong> Outdated Windows operating systems detected. Upgrade to Windows 10 or 11 for improved security.
                  </li>
                )}
                {browsers.some(b => 
                  (b.browserType === "Chrome" && parseFloat(b.browserVersion) < 90) || 
                  (b.browserType === "Firefox" && parseFloat(b.browserVersion) < 90) || 
                  (b.browserType === "Safari" && parseFloat(b.browserVersion) < 14) || 
                  (b.browserType === "Edge" && parseFloat(b.browserVersion) < 90)
                ) && (
                  <li className="text-yellow-600">
                    <strong>Important:</strong> Some browsers are using outdated versions. Update to the latest version to protect against known vulnerabilities.
                  </li>
                )}
                <li>
                  Implement browser policy controls to enforce security settings across all devices.
                </li>
                <li>
                  Consider using browser management tools for centralized updates and security configuration.
                </li>
                <li>
                  Regularly audit browser extensions and plugins across the organization to minimize attack surface.
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}