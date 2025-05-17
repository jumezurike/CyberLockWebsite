import { useState } from 'react';
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
import { Download } from 'lucide-react';

export default function ExactMatchInventory() {
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
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Device Inventory</h2>
          <Button className="bg-purple-600 hover:bg-purple-700">Add Device</Button>
        </div>
      
        <div className="mb-4">
          <h3 className="text-base font-medium mb-2">Device Types</h3>
          <Select value={selectedDeviceType} onValueChange={setSelectedDeviceType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Types">All Types</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Device Table - Exactly matching the reference */}
        <div className="rounded-md overflow-hidden border mb-6">
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
        <div className="mb-8 border border-gray-200 rounded-lg">
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
      
      {/* Form Categories - Exactly as in reference */}
      <div className="space-y-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">1. Identification</h3>
          <div className="grid grid-cols-1 gap-4">
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
          <div className="space-y-4">
            <div>
              <Label htmlFor="device-type">Device Type</Label>
              <div className="text-sm text-gray-500 mb-2">Select the type of device</div>
              <div className="grid grid-cols-1 gap-2">
                {['Workstation', 'Laptop', 'Mobile Phone', 'Tablet', 'Server', 'Network Device', 'IoT Device', 'Medical Device', 'Other'].map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox id={`device-type-${type.toLowerCase().replace(/\s/g, '-')}`} />
                    <Label htmlFor={`device-type-${type.toLowerCase().replace(/\s/g, '-')}`}>{type}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="sensitivity-level">Data Sensitivity Level</Label>
              <Select>
                <SelectTrigger id="sensitivity-level">
                  <SelectValue placeholder="Select data sensitivity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">3. Network & Location</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="ip-address">IP Address</Label>
              <Input id="ip-address" placeholder="Enter IP address" />
            </div>
            <div>
              <Label htmlFor="mac-address">MAC Address</Label>
              <Input id="mac-address" placeholder="Enter MAC address" />
            </div>
            <div>
              <Label htmlFor="network-location">Network Location</Label>
              <Select>
                <SelectTrigger id="network-location">
                  <SelectValue placeholder="Select network location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="dmz">DMZ</SelectItem>
                  <SelectItem value="cloud">Cloud</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="physical-location">Physical Location</Label>
              <Input id="physical-location" placeholder="Enter physical location" />
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">4. Security Posture</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="os-version">Operating System & Version</Label>
              <Input id="os-version" placeholder="Enter OS and version" />
            </div>
            
            <div>
              <Label className="mb-2 block">Security Software Installed</Label>
              <div className="text-sm text-gray-500 mb-2">Select all security software installed on the device</div>
              <div className="grid grid-cols-1 gap-2">
                {['Antivirus', 'EDR/XDR', 'Firewall', 'DLP', 'Encryption', 'VPN', 'MFA', 'HIDS/HIPS', 'Other'].map(software => (
                  <div key={software} className="flex items-center space-x-2">
                    <Checkbox id={`security-${software.toLowerCase().replace(/\//g, '-')}`} />
                    <Label htmlFor={`security-${software.toLowerCase().replace(/\//g, '-')}`}>{software}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="patch-status">Patch Status</Label>
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
            
            <div>
              <Label htmlFor="last-updated">Last Updated Date</Label>
              <Input id="last-updated" type="date" placeholder="Pick a date" />
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">5. Usage & Monitoring</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="primary-function">Primary Function</Label>
              <Input id="primary-function" placeholder="Enter device's primary function" />
            </div>
            
            <div>
              <Label htmlFor="authorized-users">Authorized Users</Label>
              <Input id="authorized-users" placeholder="Enter authorized users" />
              <div className="text-xs text-gray-500 mt-1">List individuals or groups authorized to use this device</div>
            </div>
            
            <div>
              <Label htmlFor="monitoring-tools">Monitoring Tools</Label>
              <Input id="monitoring-tools" placeholder="Enter monitoring tools" />
              <div className="text-xs text-gray-500 mt-1">List monitoring tools or solutions used for this device</div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox id="backup-status" />
                <Label htmlFor="backup-status">Backup Status</Label>
              </div>
              <div className="text-xs text-gray-500 ml-6">Is this device backed up according to policy?</div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-2">Enhanced Backup Details</h4>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select>
                    <SelectTrigger id="backup-frequency">
                      <SelectValue placeholder="Select backup frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="backup-type">Backup Type</Label>
                  <Select>
                    <SelectTrigger id="backup-type">
                      <SelectValue placeholder="Select backup type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full</SelectItem>
                      <SelectItem value="incremental">Incremental</SelectItem>
                      <SelectItem value="differential">Differential</SelectItem>
                      <SelectItem value="mirror">Mirror</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="backup-location">Backup Location</Label>
                  <Select>
                    <SelectTrigger id="backup-location">
                      <SelectValue placeholder="Select backup location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local</SelectItem>
                      <SelectItem value="network">Network</SelectItem>
                      <SelectItem value="cloud">Cloud</SelectItem>
                      <SelectItem value="tape">Tape/Offline</SelectItem>
                      <SelectItem value="multiple">Multiple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="backup-path">Backup Folder/Path</Label>
                  <Input id="backup-path" placeholder="Enter specific backup folder or path" />
                  <div className="text-xs text-gray-500 mt-1">Specific files, folders, or paths that are backed up</div>
                </div>
                
                <div>
                  <Label htmlFor="retention-period">Backup Retention Period</Label>
                  <Select>
                    <SelectTrigger id="retention-period">
                      <SelectValue placeholder="Select retention period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="90days">90 Days</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="7years">7 Years</SelectItem>
                      <SelectItem value="indefinite">Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="restoration-test">Last Backup Restoration Test</Label>
                  <Input id="restoration-test" placeholder="mm/dd/yyyy" />
                  <div className="text-xs text-gray-500 mt-1">Date when backup restoration was last verified</div>
                </div>
                
                <div>
                  <Label htmlFor="backup-notes">Additional Backup Notes</Label>
                  <Input id="backup-notes" placeholder="Enter any additional backup details or notes" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">6. Lifecycle & Ownership</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="acquisition-date">Acquisition Date</Label>
              <Input id="acquisition-date" type="date" placeholder="Pick a date" />
            </div>
            
            <div>
              <Label htmlFor="expected-lifespan">Expected Lifespan</Label>
              <Select>
                <SelectTrigger id="expected-lifespan">
                  <SelectValue placeholder="Select expected lifespan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="2years">2 Years</SelectItem>
                  <SelectItem value="3years">3 Years</SelectItem>
                  <SelectItem value="4years">4 Years</SelectItem>
                  <SelectItem value="5years">5 Years</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="maintenance-schedule">Maintenance Schedule</Label>
              <Input id="maintenance-schedule" placeholder="Enter maintenance schedule" />
            </div>
            
            <div>
              <Label htmlFor="maintenance-contact">Maintenance Contact</Label>
              <Input id="maintenance-contact" placeholder="Enter maintenance contact" />
            </div>
            
            <div>
              <Label htmlFor="ownership-type">Ownership Type</Label>
              <Select>
                <SelectTrigger id="ownership-type">
                  <SelectValue placeholder="Select ownership type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owned">Owned</SelectItem>
                  <SelectItem value="leased">Leased</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="byod">BYOD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="disposal-plan">Disposal Plan</Label>
              <Input id="disposal-plan" placeholder="Enter disposal plan details" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}