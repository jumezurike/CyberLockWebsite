import { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Laptop, 
  Monitor, 
  Server, 
  Smartphone, 
  Tablet, 
  Router, 
  Printer,
  HardDrive,
  Shield,
  Plus,
  Download,
  ArrowDownToLine
} from 'lucide-react';

export default function ProductionDeviceInventory() {
  const { toast } = useToast();
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>("All Types");
  
  // Import CSV functionality
  const handleImportCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({
          title: "CSV Import",
          description: `${file.name} selected for import. Processing...`,
        });
      }
    };
    input.click();
  };
  
  // Download Template functionality
  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/templates/device-inventory-template.csv';
    link.setAttribute('download', 'device-inventory-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Template Downloaded",
      description: "Fill this template with your device information and import it back.",
    });
  };
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Device Inventory</h2>
          <Button className="bg-purple-600 hover:bg-purple-700">Add Device</Button>
        </div>
      
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Device Types</h3>
            <Select value={selectedDeviceType} onValueChange={setSelectedDeviceType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Types">All Types</SelectItem>
                <SelectItem value="Laptop">Laptop</SelectItem>
                <SelectItem value="Desktop">Desktop</SelectItem>
                <SelectItem value="Server">Server</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
                <SelectItem value="Network">Network</SelectItem>
                <SelectItem value="IoT">IoT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Device Table - Exactly matching the production layout */}
        <div className="rounded-md overflow-hidden border">
          <div className="grid grid-cols-6 bg-gray-50 p-3 border-b border-gray-200 font-semibold text-gray-700">
            <div>Device Type</div>
            <div>Make/Model</div>
            <div>Serial/Asset #</div>
            <div>Risk Level</div>
            <div>Owner</div>
            <div>Actions</div>
          </div>
          
          <div className="p-6 text-center text-gray-500 bg-white">
            No devices added yet. Click "Add Device" to begin tracking devices.
          </div>
        </div>
        
        {/* Import Device Inventory section */}
        <div className="mt-8 mb-8 border border-gray-200 rounded-lg">
          <div className="p-4">
            <h3 className="text-base font-semibold mb-1">Import Device Inventory</h3>
            <p className="text-gray-600 text-sm mb-4">
              Use these options to import existing device inventory data.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleImportCSV}
                variant="default"
                className="justify-center py-2 h-auto text-sm bg-purple-600 hover:bg-purple-700"
              >
                Import CSV
              </Button>
              
              <Button 
                onClick={handleDownloadTemplate}
                variant="outline"
                className="justify-center py-2 h-auto text-sm flex items-center bg-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Device Form Categories based on the production version */}
      <div className="space-y-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">1. Identification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="device-id">Device ID / Asset Tag</Label>
              <Input id="device-id" placeholder="Enter device ID or asset tag" />
            </div>
            <div>
              <Label htmlFor="make-model">Make / Model</Label>
              <Input id="make-model" placeholder="Enter device make and model" />
            </div>
            <div>
              <Label htmlFor="physical-desc">Color / Physical Description</Label>
              <Input id="physical-desc" placeholder="Enter device color or description" />
            </div>
            <div>
              <Label htmlFor="serial">Serial Number</Label>
              <Input id="serial" placeholder="Enter device serial number" />
            </div>
            <div>
              <Label htmlFor="owner">Owner / Assigned User</Label>
              <Input id="owner" placeholder="Enter device owner or assigned user" />
            </div>
            <div>
              <Label htmlFor="nickname">Device Nickname or Label (if used)</Label>
              <Input id="nickname" placeholder="Enter device nickname or label" />
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">2. Classification</h3>
          <div className="space-y-6">
            <div>
              <Label className="mb-2 block">Device Type</Label>
              <div className="text-sm text-gray-500 mb-2">Select all that apply</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Laptop', 'Desktop', 'Server', 'Mobile', 'Tablet', 'Router', 'Switch', 'Firewall', 'IoT Device', 'Smartwatch', 'Printer', 'Other'].map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox id={`device-type-${type.toLowerCase()}`} />
                    <Label htmlFor={`device-type-${type.toLowerCase()}`}>{type}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Endpoint Category</Label>
              <div className="text-sm text-gray-500 mb-2">Select all that apply</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['User Device', 'Shared Asset', 'Infrastructure Device', 'Monitoring System', 'Security Device'].map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox id={`endpoint-cat-${category.toLowerCase().replace(/\s/g, '-')}`} />
                    <Label htmlFor={`endpoint-cat-${category.toLowerCase().replace(/\s/g, '-')}`}>{category}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="os-version">Operating System & Version</Label>
              <Input id="os-version" placeholder="Enter OS and version (e.g., Windows 11, macOS 14.1)" />
            </div>
            
            <div>
              <Label className="mb-2 block">Browser(s) Installed + Engine</Label>
              <div className="text-sm text-gray-500 mb-2">Select all that apply</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  'Chrome (Chromium)',
                  'Firefox (Gecko)',
                  'Safari (WebKit)',
                  'Edge (Chromium)',
                  'Opera (Chromium)',
                  'Brave (Chromium)',
                  'Internet Explorer (Trident)'
                ].map(browser => (
                  <div key={browser} className="flex items-center space-x-2">
                    <Checkbox id={`browser-${browser.split(' ')[0].toLowerCase()}`} />
                    <Label htmlFor={`browser-${browser.split(' ')[0].toLowerCase()}`}>{browser}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">3. Network & Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ip-address">IP Address(es)</Label>
              <Input id="ip-address" placeholder="Enter IP address(es)" />
            </div>
            <div>
              <Label htmlFor="mac-address">MAC Address</Label>
              <Input id="mac-address" placeholder="Enter MAC address" />
            </div>
            <div>
              <Label htmlFor="location">Last Known Location</Label>
              <Input id="location" placeholder="Enter location (Office/Room/Geotag)" />
            </div>
            <div>
              <Label htmlFor="department">Assigned Department / Business Unit</Label>
              <Input id="department" placeholder="Enter department or business unit" />
            </div>
            
            <div className="md:col-span-2">
              <Label className="mb-2 block">Network Zone</Label>
              <div className="text-sm text-gray-500 mb-2">Select all that apply</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['DMZ', 'Internal', 'Guest', 'Management', 'Secured/Isolated', 'IoT Network', 'VPN'].map(zone => (
                  <div key={zone} className="flex items-center space-x-2">
                    <Checkbox id={`network-zone-${zone.toLowerCase().replace(/\//g, '-')}`} />
                    <Label htmlFor={`network-zone-${zone.toLowerCase().replace(/\//g, '-')}`}>{zone}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">4. Security Posture</h3>
          <div className="space-y-6">
            <div>
              <Label className="mb-2 block">Encryption Status</Label>
              <div className="text-sm text-gray-500 mb-2">Select all that apply</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  'Full Disk Encryption',
                  'File-Level Encryption',
                  'Removable Media Encryption',
                  'No Encryption',
                  'Partial Encryption',
                  'Unknown'
                ].map(status => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox id={`encryption-${status.toLowerCase().replace(/\s/g, '-')}`} />
                    <Label htmlFor={`encryption-${status.toLowerCase().replace(/\s/g, '-')}`}>{status}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="antivirus" />
                  <Label htmlFor="antivirus">Antivirus / EDR Installed?</Label>
                </div>
                <div className="text-xs text-gray-500 ml-6">Check if antivirus or endpoint detection and response is installed</div>
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="firewall" />
                  <Label htmlFor="firewall">Firewall Active?</Label>
                </div>
                <div className="text-xs text-gray-500 ml-6">Check if device firewall is active</div>
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="tpm" />
                  <Label htmlFor="tpm">TPM Present?</Label>
                </div>
                <div className="text-xs text-gray-500 ml-6">Check if Trusted Platform Module is present</div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="patch-status">Patch Status (OS, App, Firmware)</Label>
              <Select>
                <SelectTrigger id="patch-status">
                  <SelectValue placeholder="Select patch status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="up-to-date">Up to Date</SelectItem>
                  <SelectItem value="patches-pending">Patches Pending</SelectItem>
                  <SelectItem value="out-of-date">Out of Date</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="vpn-mdm" />
                  <Label htmlFor="vpn-mdm">VPN Usage / MDM Enrollment?</Label>
                </div>
                <div className="text-xs text-gray-500 ml-6">Check if device uses VPN or is enrolled in Mobile Device Management</div>
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Security Compliance Level</Label>
              <div className="text-sm text-gray-500 mb-2">Select all that apply</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['HIPAA', 'CMMC', 'ISO 27001', 'NIST 800-171', 'SOC 2', 'PCI DSS', 'GDPR', 'FISMA', 'None'].map(compliance => (
                  <div key={compliance} className="flex items-center space-x-2">
                    <Checkbox id={`compliance-${compliance.toLowerCase().replace(/\s/g, '-')}`} />
                    <Label htmlFor={`compliance-${compliance.toLowerCase().replace(/\s/g, '-')}`}>{compliance}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">5. Usage & Monitoring</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="last-login">Last Login Date</Label>
              <Input id="last-login" type="date" />
            </div>
            <div>
              <Label htmlFor="last-checkin">Last Network Check-in</Label>
              <Input id="last-checkin" type="date" />
            </div>
            <div>
              <Label htmlFor="device-status">Device Activity / Status</Label>
              <Select>
                <SelectTrigger id="device-status">
                  <SelectValue placeholder="Select device status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active / In Use</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">In Maintenance</SelectItem>
                  <SelectItem value="decommissioned">Decommissioned</SelectItem>
                  <SelectItem value="lost">Lost / Missing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="risk-score">Device Risk Score (Optional)</Label>
              <div className="text-xs text-gray-500 mb-1">If available from your SIEM/EDR, enter a risk score from 0-100</div>
              <Input id="risk-score" type="number" min="0" max="100" placeholder="Enter risk score (0-100)" />
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">6. Lifecycle & Ownership</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="procurement">Procurement Date / Vendor</Label>
              <Input id="procurement" placeholder="Enter procurement date and vendor" />
            </div>
            <div>
              <Label htmlFor="warranty">Warranty Expiration</Label>
              <Input id="warranty" type="date" />
            </div>
            <div>
              <Label htmlFor="lifecycle">Device Lifecycle Status</Label>
              <Select>
                <SelectTrigger id="lifecycle">
                  <SelectValue placeholder="Select lifecycle status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New / Recent</SelectItem>
                  <SelectItem value="mid-life">Mid Lifecycle</SelectItem>
                  <SelectItem value="approaching-eol">Approaching End of Life</SelectItem>
                  <SelectItem value="past-eol">Past End of Life</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <Label className="mb-2 block">Assigned Policies or Group Tags</Label>
              <div className="text-sm text-gray-500 mb-2">Select all that apply</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  'Finance Only',
                  'Executive',
                  'IT Admin',
                  'Developer',
                  'Guest Access',
                  'Restricted Access',
                  'BYOD',
                  'Remote Worker',
                  'Standard User'
                ].map(policy => (
                  <div key={policy} className="flex items-center space-x-2">
                    <Checkbox id={`policy-${policy.toLowerCase().replace(/\s/g, '-')}`} />
                    <Label htmlFor={`policy-${policy.toLowerCase().replace(/\s/g, '-')}`}>{policy}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}