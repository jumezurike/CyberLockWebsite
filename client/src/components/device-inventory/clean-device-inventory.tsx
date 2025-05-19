import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileSpreadsheet } from 'lucide-react';

export default function CleanDeviceInventory() {
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
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium mb-4">Device Inventory</h2>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="mr-4 border p-3 rounded-md bg-gray-50">
              <div className="flex items-center mb-1">
                <span className="block text-sm font-medium">Filter by Device Type</span>
                <div className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">Filter</div>
              </div>
              <p className="text-xs text-gray-500 mb-2">Select a device type to filter the inventory list below</p>
              <Select value={selectedDeviceType} onValueChange={setSelectedDeviceType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Types">All Types</SelectItem>
                  <SelectItem value="Workstation">Workstation</SelectItem>
                  <SelectItem value="Server">Server</SelectItem>
                  <SelectItem value="Mobile Device">Mobile Device</SelectItem>
                  <SelectItem value="Network Device">Network Device</SelectItem>
                  <SelectItem value="IoT Device">IoT Device</SelectItem>
                  <SelectItem value="Transportation Device">Transportation Device</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button className="bg-purple-600 hover:bg-purple-700">Add Device</Button>
        </div>
        
        {/* Device Table - Exactly matching the reference */}
        <div className="border rounded border-gray-200">
          <div className="grid grid-cols-5 bg-gray-50 p-3 border-b border-gray-200 text-sm font-medium text-gray-700">
            <div>Device Type</div>
            <div>Make/Model</div>
            <div>Serial/Asset #</div>
            <div>Risk Level</div>
            <div>Owner</div>
          </div>
          
          <div className="p-6 text-center text-gray-500 bg-white">
            No devices added yet. Click "Add Device" to begin tracking devices.
          </div>
        </div>
      </div>
      
      {/* Import Device Inventory section */}
      <div>
        <h2 className="text-lg font-medium mb-2">Import Device Inventory</h2>
        <p className="text-gray-600 text-sm mb-4">
          Use these options to import existing device inventory data.
        </p>
        
        <div className="flex gap-4">
          <Button 
            onClick={handleImportCSV}
            variant="default"
            className="bg-purple-600 hover:bg-purple-700"
          >
            Import CSV
          </Button>
          
          <Button 
            onClick={handleDownloadTemplate}
            variant="outline"
            className="bg-white border-gray-200 text-gray-800 flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Download Template
          </Button>
        </div>
      </div>
      
      {/* Form Sections - Exactly as in reference */}
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-medium mb-2">1. Identification</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        
        <div>
          <h2 className="text-lg font-medium mb-2">2. Classification</h2>
          <p className="text-gray-600 text-sm mb-4">
            Classify your device by type and sensitivity level to determine appropriate security controls and policies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="device-type-select">Device Type</Label>
              <Select>
                <SelectTrigger id="device-type-select">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workstation">Workstation</SelectItem>
                  <SelectItem value="laptop">Laptop</SelectItem>
                  <SelectItem value="server">Server</SelectItem>
                  <SelectItem value="mobilephone">Mobile Phone</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="networkdevice">Network Device</SelectItem>
                  <SelectItem value="iotdevice">IoT Device</SelectItem>
                  <SelectItem value="transportationdevice">Transportation Device</SelectItem>
                </SelectContent>
              </Select>
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
        
        <div>
          <h2 className="text-lg font-medium mb-2">3. Network & Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        
        <div>
          <h2 className="text-lg font-medium mb-2">4. Security Posture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="os-version">Operating System & Version</Label>
              <Input id="os-version" placeholder="Enter OS and version" />
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
      </div>
    </div>
  );
}