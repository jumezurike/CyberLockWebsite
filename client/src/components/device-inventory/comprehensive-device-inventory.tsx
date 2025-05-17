import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { 
  AlertCircle, 
  Info, 
  Trash2, 
  Shield, 
  Server, 
  Smartphone, 
  PcCase,
  Monitor,
  Network,
  WifiIcon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DeviceInventoryItem } from "@/lib/sos2a-types";

// SOC Tools monitoring status interface
interface SocMonitoringStatus {
  splunk: boolean;
  wazuh: boolean;
  suricata: boolean;
  ntopng: boolean;
  misp: boolean;
  openvas: boolean;
  jira: boolean;
}

// Extended device inventory with SOC monitoring status and time tracking
interface ExtendedDeviceInventoryItem extends DeviceInventoryItem {
  socMonitoring: SocMonitoringStatus;
  lastUpdated: string;
  historyEntries: {
    date: string;
    action: string;
    description: string;
    user: string;
  }[];
  // Link to identity
  ownerId?: string;
  ownerName?: string;
}

export default function ComprehensiveDeviceInventory() {
  const { toast } = useToast();
  const [devices, setDevices] = useState<ExtendedDeviceInventoryItem[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<ExtendedDeviceInventoryItem | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [filterDeviceType, setFilterDeviceType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data - in a real implementation, this would come from an API
  useEffect(() => {
    const sampleDevices: ExtendedDeviceInventoryItem[] = [
      {
        id: "dev-001",
        deviceType: "Workstation",
        makeModel: "Dell Latitude 5520",
        serialNumber: "DELLLT5520123456",
        sensitivityLevel: "Medium",
        networkZone: "Corporate",
        lastKnownLocation: "HQ - Floor 3",
        owner: "John Smith",
        ownerId: "user-123",
        ownerName: "John Smith",
        patchStatus: "Up to date",
        lastLoginDate: "2025-05-16",
        osVersion: "Windows 11",
        operatingSystem: "Windows",
        securitySoftware: ["Wazuh Agent", "McAfee Endpoint", "Microsoft Defender"],
        authorizedUsers: ["John Smith", "IT Support"],
        acquisitionDate: "2024-01-15",
        expectedLifespan: "4 years",
        ownershipType: "Corporate",
        disposalPlan: "Secure Data Wipe",
        socMonitoring: {
          splunk: true,
          wazuh: true,
          suricata: true,
          ntopng: true,
          misp: false,
          openvas: true,
          jira: false
        },
        lastUpdated: "2025-05-17T08:30:00Z",
        historyEntries: [
          {
            date: "2025-05-17T08:30:00Z",
            action: "Patch Applied",
            description: "Windows security patches KB5031356 applied",
            user: "System Admin"
          },
          {
            date: "2025-05-01T14:22:00Z",
            action: "SOC Monitoring Added",
            description: "Device added to Wazuh and Splunk monitoring",
            user: "SOC Analyst"
          },
          {
            date: "2025-04-15T09:10:00Z",
            action: "Vulnerability Scan",
            description: "OpenVAS scan completed - 2 medium vulnerabilities found",
            user: "Security Team"
          }
        ]
      },
      {
        id: "dev-002",
        deviceType: "Server",
        makeModel: "Dell PowerEdge R740",
        serialNumber: "DELLPE740987654",
        sensitivityLevel: "High",
        networkZone: "Data Center",
        lastKnownLocation: "Server Room A",
        owner: "IT Department",
        ownerId: "dept-it",
        ownerName: "IT Department",
        patchStatus: "Update required",
        lastLoginDate: "2025-05-16",
        osVersion: "Windows Server 2022",
        operatingSystem: "Windows Server",
        securitySoftware: ["Wazuh Agent", "Microsoft Defender for Server"],
        authorizedUsers: ["Server Admin Team"],
        acquisitionDate: "2023-11-05",
        expectedLifespan: "5 years",
        ownershipType: "Corporate",
        disposalPlan: "Secure Data Wipe",
        socMonitoring: {
          splunk: true,
          wazuh: true,
          suricata: true,
          ntopng: true,
          misp: true,
          openvas: true,
          jira: true
        },
        lastUpdated: "2025-05-15T16:45:00Z",
        historyEntries: [
          {
            date: "2025-05-15T16:45:00Z",
            action: "Vulnerability Detected",
            description: "Critical vulnerability CVE-2025-1234 detected - requires patching",
            user: "Security Scanner"
          },
          {
            date: "2025-05-10T08:20:00Z",
            action: "Configuration Change",
            description: "Firewall rules updated to restrict access to port 8080",
            user: "Network Admin"
          }
        ]
      },
      {
        id: "dev-003",
        deviceType: "IoT Device",
        makeModel: "Medical Sensor Array MS-2000",
        serialNumber: "MS2000ABC78945",
        sensitivityLevel: "Critical",
        networkZone: "Clinical",
        lastKnownLocation: "Radiology Dept.",
        owner: "Medical Systems",
        ownerId: "dept-med",
        ownerName: "Medical Systems Department",
        patchStatus: "Out of date",
        lastLoginDate: "2025-05-10",
        osVersion: "Embedded Linux 4.2",
        operatingSystem: "Linux",
        securitySoftware: ["Custom Firewall"],
        authorizedUsers: ["Radiology Team", "Biomedical Engineering"],
        acquisitionDate: "2023-06-20",
        expectedLifespan: "7 years",
        ownershipType: "Leased",
        disposalPlan: "Vendor Returns",
        socMonitoring: {
          splunk: true,
          wazuh: false,
          suricata: true,
          ntopng: true,
          misp: false,
          openvas: false,
          jira: true
        },
        lastUpdated: "2025-05-10T11:20:00Z",
        historyEntries: [
          {
            date: "2025-05-10T11:20:00Z",
            action: "Security Alert",
            description: "Unusual traffic pattern detected - potential data exfiltration attempt",
            user: "SOC Analyst"
          },
          {
            date: "2025-04-28T13:15:00Z",
            action: "Maintenance",
            description: "Regular maintenance performed by vendor",
            user: "Vendor Technician"
          }
        ]
      },
      {
        id: "dev-004",
        deviceType: "Network Device",
        makeModel: "Cisco Catalyst 9300",
        serialNumber: "CAT9300XYZ456789",
        sensitivityLevel: "Critical",
        networkZone: "Network Core",
        lastKnownLocation: "Network Closet B",
        owner: "Network Operations",
        ownerId: "dept-netops",
        ownerName: "Network Operations Team",
        patchStatus: "Up to date",
        lastLoginDate: "2025-05-16",
        osVersion: "IOS-XE 17.6.3",
        operatingSystem: "Cisco IOS",
        securitySoftware: ["Cisco Secure"],
        authorizedUsers: ["Network Admin Team"],
        acquisitionDate: "2024-02-10",
        expectedLifespan: "6 years",
        ownershipType: "Corporate",
        disposalPlan: "Secure Erasure",
        socMonitoring: {
          splunk: true,
          wazuh: false,
          suricata: true,
          ntopng: true,
          misp: true,
          openvas: true,
          jira: true
        },
        lastUpdated: "2025-05-16T09:15:00Z",
        historyEntries: [
          {
            date: "2025-05-16T09:15:00Z",
            action: "Configuration Backup",
            description: "Weekly configuration backup performed",
            user: "Network Admin"
          },
          {
            date: "2025-05-01T10:30:00Z",
            action: "Firmware Update",
            description: "Updated to IOS-XE 17.6.3 to address security vulnerabilities",
            user: "Network Engineer"
          }
        ]
      },
      {
        id: "dev-005",
        deviceType: "Mobile Device",
        makeModel: "Apple iPhone 15 Pro",
        serialNumber: "IPHNE15P7654321",
        sensitivityLevel: "Medium",
        networkZone: "Mobile",
        lastKnownLocation: "Field",
        owner: "Sarah Johnson",
        ownerId: "user-456",
        ownerName: "Sarah Johnson",
        patchStatus: "Up to date",
        lastLoginDate: "2025-05-17",
        osVersion: "iOS 18.2",
        operatingSystem: "iOS",
        securitySoftware: ["MDM Agent", "Mobile Threat Defense"],
        authorizedUsers: ["Sarah Johnson"],
        acquisitionDate: "2024-03-15",
        expectedLifespan: "3 years",
        ownershipType: "BYOD",
        disposalPlan: "Factory Reset",
        socMonitoring: {
          splunk: true,
          wazuh: false,
          suricata: false,
          ntopng: true,
          misp: false,
          openvas: false,
          jira: false
        },
        lastUpdated: "2025-05-14T15:30:00Z",
        historyEntries: [
          {
            date: "2025-05-14T15:30:00Z",
            action: "OS Update",
            description: "Updated to iOS 18.2",
            user: "User"
          },
          {
            date: "2025-04-22T08:45:00Z",
            action: "Policy Update",
            description: "MDM policy updated to require biometric authentication",
            user: "Mobile Admin"
          }
        ]
      }
    ];
    
    setDevices(sampleDevices);
  }, []);

  // Calculate device statistics
  const getTotalDevicesByType = () => {
    const counts: {[key: string]: number} = {};
    devices.forEach(device => {
      const type = device.deviceType || "Unknown";
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  };

  const getMonitoringCoverage = () => {
    if (devices.length === 0) return 0;
    
    const fullyCovered = devices.filter(device => {
      const monitoring = device.socMonitoring;
      return monitoring.splunk && monitoring.wazuh && monitoring.suricata;
    }).length;
    
    return Math.round((fullyCovered / devices.length) * 100);
  };

  const getPatchStatus = () => {
    if (devices.length === 0) return { upToDate: 0, updating: 0, outOfDate: 0 };
    
    const upToDate = devices.filter(d => d.patchStatus === "Up to date").length;
    const updating = devices.filter(d => d.patchStatus === "Update in progress").length;
    const outOfDate = devices.filter(d => d.patchStatus === "Out of date" || d.patchStatus === "Update required").length;
    
    return {
      upToDate,
      updating,
      outOfDate
    };
  };

  const getDeviceIcon = (deviceType: string | undefined) => {
    switch(deviceType) {
      case "Workstation":
        return <PcCase className="h-4 w-4" />;
      case "Server":
        return <Server className="h-4 w-4" />;
      case "Mobile Device":
        return <Smartphone className="h-4 w-4" />;
      case "Network Device":
        return <Network className="h-4 w-4" />;
      case "IoT Device":
        return <WifiIcon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const handleOpenHistory = (device: ExtendedDeviceInventoryItem) => {
    setSelectedDevice(device);
    setHistoryOpen(true);
  };

  const deviceCounts = getTotalDevicesByType();
  const monitoringCoverage = getMonitoringCoverage();
  const patchStatus = getPatchStatus();

  // Filter and search devices
  const filteredDevices = devices.filter(device => {
    const matchesType = filterDeviceType === "all" || device.deviceType === filterDeviceType;
    const matchesSearch = searchTerm === "" || 
      (device.makeModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       device.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       device.owner?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList>
          <TabsTrigger value="inventory">Device Inventory</TabsTrigger>
          <TabsTrigger value="monitoring">SOC Monitoring</TabsTrigger>
          <TabsTrigger value="timeline">6-Month Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Device Inventory Dashboard</CardTitle>
              <CardDescription>
                Comprehensive tracking of all devices within your organization
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold">{devices.length}</div>
                  <div className="text-sm text-gray-600">Total Devices</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold">
                    {monitoringCoverage}%
                  </div>
                  <div className="text-sm text-gray-600">SOC Monitoring Coverage</div>
                </div>
                
                <div className={`p-4 rounded-lg ${patchStatus.outOfDate > 0 ? 'bg-orange-50' : 'bg-green-50'}`}>
                  <div className="text-2xl font-bold">
                    {patchStatus.upToDate} / {devices.length}
                  </div>
                  <div className="text-sm text-gray-600">Devices Up-to-Date</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold">
                    {Object.keys(deviceCounts).length}
                  </div>
                  <div className="text-sm text-gray-600">Device Categories</div>
                </div>
              </div>
              
              {/* Device Type Breakdown */}
              <div className="mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.entries(deviceCounts).map(([type, count]) => (
                  <div 
                    key={type}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      filterDeviceType === type ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => setFilterDeviceType(filterDeviceType === type ? "all" : type)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{type}</span>
                      <span className="bg-white text-gray-700 text-xs py-0.5 px-2 rounded-full">{count}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-xs">
                      {getDeviceIcon(type)}
                      <span className="ml-1">
                        {filterDeviceType === type ? 'Filtering active' : 'Click to filter'}
                      </span>
                    </div>
                  </div>
                ))}
                
                {filterDeviceType !== "all" && (
                  <div 
                    className="p-3 rounded-md border border-red-200 bg-red-50 cursor-pointer hover:bg-red-100 flex items-center justify-center"
                    onClick={() => setFilterDeviceType("all")}
                  >
                    <span className="text-red-600 text-sm font-medium">Clear Filter</span>
                  </div>
                )}
              </div>
              
              {/* Search and Add Device */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="relative w-full md:w-auto flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search devices by name, serial number, or owner..."
                    className="pl-9 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button>
                  Add Device
                </Button>
              </div>
              
              {/* Devices Table */}
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Type</TableHead>
                      <TableHead>Make/Model</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>OS/Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Security</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDevices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No devices found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDevices.map((device) => (
                        <TableRow key={device.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(device.deviceType)}
                              <span>{device.deviceType}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{device.makeModel}</div>
                              <div className="text-xs text-gray-500">S/N: {device.serialNumber}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {device.owner}
                            <div className="text-xs text-gray-500">{device.lastKnownLocation}</div>
                          </TableCell>
                          <TableCell>
                            {device.operatingSystem}
                            <div className="text-xs text-gray-500">{device.osVersion}</div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={
                                device.patchStatus === "Up to date" 
                                  ? "border-green-500 text-green-700 bg-green-50" 
                                  : device.patchStatus === "Update in progress"
                                    ? "border-blue-500 text-blue-700 bg-blue-50"
                                    : "border-orange-500 text-orange-700 bg-orange-50"
                              }
                            >
                              {device.patchStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {device.socMonitoring.wazuh && (
                                <div className="h-2 w-2 rounded-full bg-green-500" title="Wazuh Monitoring"></div>
                              )}
                              {device.socMonitoring.splunk && (
                                <div className="h-2 w-2 rounded-full bg-blue-500" title="Splunk Monitoring"></div>
                              )}
                              {device.socMonitoring.suricata && (
                                <div className="h-2 w-2 rounded-full bg-purple-500" title="Suricata Monitoring"></div>
                              )}
                              {!device.socMonitoring.wazuh && !device.socMonitoring.splunk && !device.socMonitoring.suricata && (
                                <div className="h-2 w-2 rounded-full bg-gray-300" title="No Core Monitoring"></div>
                              )}
                              <span className="text-xs text-gray-500 ml-1">
                                {Object.values(device.socMonitoring).filter(Boolean).length}/7 tools
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenHistory(device)}
                            >
                              <Clock className="h-4 w-4 mr-1" />
                              History
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>SOC Monitoring Dashboard</CardTitle>
              <CardDescription>
                Track which devices are being monitored by your SOC toolset
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
                <div 
                  className="bg-gray-50 p-4 rounded-lg border flex flex-col items-center cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-200"
                  onClick={() => window.open('/soc/splunk', '_blank')}
                >
                  <div className="font-medium mb-2">Splunk</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {devices.filter(d => d.socMonitoring.splunk).length}
                  </div>
                  <div className="text-xs text-gray-500">Devices Monitored</div>
                  <div className="mt-2 text-xs text-blue-600">Click to launch Splunk</div>
                </div>
                
                <div 
                  className="bg-gray-50 p-4 rounded-lg border flex flex-col items-center cursor-pointer transition-all hover:bg-green-50 hover:border-green-200"
                  onClick={() => window.open('/soc/wazuh', '_blank')}
                >
                  <div className="font-medium mb-2">Wazuh</div>
                  <div className="text-2xl font-bold text-green-600">
                    {devices.filter(d => d.socMonitoring.wazuh).length}
                  </div>
                  <div className="text-xs text-gray-500">Devices Monitored</div>
                  <div className="mt-2 text-xs text-green-600">Click to launch Wazuh</div>
                </div>
                
                <div 
                  className="bg-gray-50 p-4 rounded-lg border flex flex-col items-center cursor-pointer transition-all hover:bg-purple-50 hover:border-purple-200"
                  onClick={() => window.open('/soc/suricata', '_blank')}
                >
                  <div className="font-medium mb-2">Suricata</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {devices.filter(d => d.socMonitoring.suricata).length}
                  </div>
                  <div className="text-xs text-gray-500">Networks Monitored</div>
                  <div className="mt-2 text-xs text-purple-600">Click to launch Suricata</div>
                </div>
                
                <div 
                  className="bg-gray-50 p-4 rounded-lg border flex flex-col items-center cursor-pointer transition-all hover:bg-indigo-50 hover:border-indigo-200"
                  onClick={() => window.open('/soc/ntopng', '_blank')}
                >
                  <div className="font-medium mb-2">ntopng</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {devices.filter(d => d.socMonitoring.ntopng).length}
                  </div>
                  <div className="text-xs text-gray-500">Flow Monitoring</div>
                  <div className="mt-2 text-xs text-indigo-600">Click to launch ntopng</div>
                </div>
                
                <div 
                  className="bg-gray-50 p-4 rounded-lg border flex flex-col items-center cursor-pointer transition-all hover:bg-orange-50 hover:border-orange-200"
                  onClick={() => window.open('/soc/misp', '_blank')}
                >
                  <div className="font-medium mb-2">MISP</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {devices.filter(d => d.socMonitoring.misp).length}
                  </div>
                  <div className="text-xs text-gray-500">Threat Intel</div>
                  <div className="mt-2 text-xs text-orange-600">Click to launch MISP</div>
                </div>
                
                <div 
                  className="bg-gray-50 p-4 rounded-lg border flex flex-col items-center cursor-pointer transition-all hover:bg-teal-50 hover:border-teal-200"
                  onClick={() => window.open('/soc/openvas', '_blank')}
                >
                  <div className="font-medium mb-2">OpenVAS</div>
                  <div className="text-2xl font-bold text-teal-600">
                    {devices.filter(d => d.socMonitoring.openvas).length}
                  </div>
                  <div className="text-xs text-gray-500">Vulnerability Scanning</div>
                  <div className="mt-2 text-xs text-teal-600">Click to launch OpenVAS</div>
                </div>
                
                <div 
                  className="bg-gray-50 p-4 rounded-lg border flex flex-col items-center cursor-pointer transition-all hover:bg-red-50 hover:border-red-200"
                  onClick={() => window.open('/soc/jira', '_blank')}
                >
                  <div className="font-medium mb-2">Jira</div>
                  <div className="text-2xl font-bold text-red-600">
                    {devices.filter(d => d.socMonitoring.jira).length}
                  </div>
                  <div className="text-xs text-gray-500">Incident Tracking</div>
                  <div className="mt-2 text-xs text-red-600">Click to launch Jira</div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-700">SOC Monitoring Integration</h3>
                    <p className="text-sm text-gray-700 mt-1">
                      Comprehensive SOC monitoring requires a layered approach using multiple security tools. For optimal security posture, critical systems should have monitoring across Splunk, Wazuh and Suricata at minimum.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Splunk</TableHead>
                      <TableHead>Wazuh</TableHead>
                      <TableHead>Suricata</TableHead>
                      <TableHead>ntopng</TableHead>
                      <TableHead>MISP</TableHead>
                      <TableHead>OpenVAS</TableHead>
                      <TableHead>Jira</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {devices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell>
                          <div className="font-medium">{device.makeModel}</div>
                          <div className="text-xs text-gray-500">{device.serialNumber}</div>
                        </TableCell>
                        <TableCell>{device.deviceType}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              device.sensitivityLevel === "Critical" 
                                ? "border-red-500 text-red-700 bg-red-50" 
                                : device.sensitivityLevel === "High"
                                  ? "border-orange-500 text-orange-700 bg-orange-50"
                                  : "border-blue-500 text-blue-700 bg-blue-50"
                            }
                          >
                            {device.sensitivityLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div 
                            className={`flex items-center justify-center cursor-pointer ${device.socMonitoring.splunk ? 'hover:bg-blue-50 rounded-full p-1' : ''}`}
                            title={device.socMonitoring.splunk ? "View device in Splunk" : "Not monitored in Splunk"}
                            onClick={() => device.socMonitoring.splunk && window.open(`/soc/splunk?device=${device.id}`, '_blank')}
                          >
                            {device.socMonitoring.splunk ? 
                              <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
                              <AlertCircle className="h-4 w-4 text-gray-300" />
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <div 
                            className={`flex items-center justify-center cursor-pointer ${device.socMonitoring.wazuh ? 'hover:bg-blue-50 rounded-full p-1' : ''}`}
                            title={device.socMonitoring.wazuh ? "View device in Wazuh" : "Not monitored in Wazuh"}
                            onClick={() => device.socMonitoring.wazuh && window.open(`/soc/wazuh?device=${device.id}`, '_blank')}
                          >
                            {device.socMonitoring.wazuh ? 
                              <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
                              <AlertCircle className="h-4 w-4 text-gray-300" />
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <div 
                            className={`flex items-center justify-center cursor-pointer ${device.socMonitoring.suricata ? 'hover:bg-blue-50 rounded-full p-1' : ''}`}
                            title={device.socMonitoring.suricata ? "View device in Suricata" : "Not monitored in Suricata"}
                            onClick={() => device.socMonitoring.suricata && window.open(`/soc/suricata?device=${device.id}`, '_blank')}
                          >
                            {device.socMonitoring.suricata ? 
                              <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
                              <AlertCircle className="h-4 w-4 text-gray-300" />
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <div 
                            className={`flex items-center justify-center cursor-pointer ${device.socMonitoring.ntopng ? 'hover:bg-blue-50 rounded-full p-1' : ''}`}
                            title={device.socMonitoring.ntopng ? "View device in ntopng" : "Not monitored in ntopng"}
                            onClick={() => device.socMonitoring.ntopng && window.open(`/soc/ntopng?device=${device.id}`, '_blank')}
                          >
                            {device.socMonitoring.ntopng ? 
                              <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
                              <AlertCircle className="h-4 w-4 text-gray-300" />
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <div 
                            className={`flex items-center justify-center cursor-pointer ${device.socMonitoring.misp ? 'hover:bg-blue-50 rounded-full p-1' : ''}`}
                            title={device.socMonitoring.misp ? "View device in MISP" : "Not monitored in MISP"}
                            onClick={() => device.socMonitoring.misp && window.open(`/soc/misp?device=${device.id}`, '_blank')}
                          >
                            {device.socMonitoring.misp ? 
                              <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
                              <AlertCircle className="h-4 w-4 text-gray-300" />
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <div 
                            className={`flex items-center justify-center cursor-pointer ${device.socMonitoring.openvas ? 'hover:bg-blue-50 rounded-full p-1' : ''}`}
                            title={device.socMonitoring.openvas ? "View device in OpenVAS" : "Not scanned by OpenVAS"}
                            onClick={() => device.socMonitoring.openvas && window.open(`/soc/openvas?device=${device.id}`, '_blank')}
                          >
                            {device.socMonitoring.openvas ? 
                              <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
                              <AlertCircle className="h-4 w-4 text-gray-300" />
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <div 
                            className={`flex items-center justify-center cursor-pointer ${device.socMonitoring.jira ? 'hover:bg-blue-50 rounded-full p-1' : ''}`}
                            title={device.socMonitoring.jira ? "View device tickets in Jira" : "No Jira tickets"}
                            onClick={() => device.socMonitoring.jira && window.open(`/soc/jira?device=${device.id}`, '_blank')}
                          >
                            {device.socMonitoring.jira ? 
                              <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
                              <AlertCircle className="h-4 w-4 text-gray-300" />
                            }
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>6-Month Assessment Timeline</CardTitle>
              <CardDescription>
                Track security improvements over the comprehensive assessment period
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-700">Comprehensive Assessment Timeline</h3>
                    <p className="text-sm text-gray-700 mt-1">
                      The comprehensive assessment requires evidence collection over a 6-month period. This timeline tracks your progress in implementing security improvements and documenting compliance.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative mb-8">
                <div className="absolute left-0 top-4 h-0.5 w-full bg-gray-200"></div>
                
                <div className="relative z-10 flex justify-between">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center mb-2">1</div>
                    <div className="text-sm font-medium">Initial</div>
                    <div className="text-xs text-gray-500">Month 1</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mb-2">2</div>
                    <div className="text-sm font-medium">Baseline</div>
                    <div className="text-xs text-gray-500">Month 2</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center mb-2">3</div>
                    <div className="text-sm font-medium">Implement</div>
                    <div className="text-xs text-gray-500">Month 3</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center mb-2">4</div>
                    <div className="text-sm font-medium">Verify</div>
                    <div className="text-xs text-gray-500">Month 4</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center mb-2">5</div>
                    <div className="text-sm font-medium">Refine</div>
                    <div className="text-xs text-gray-500">Month 5</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center mb-2">6</div>
                    <div className="text-sm font-medium">Finalize</div>
                    <div className="text-xs text-gray-500">Month 6</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-green-50 border-b border-green-100 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center mr-3 text-xs">1</div>
                        <h3 className="font-medium">Initial Assessment (Month 1) - Completed</h3>
                      </div>
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">Complete</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Key Milestones:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                        <li>Inventory all devices and document their baseline security state</li>
                        <li>Identify critical systems requiring SOC monitoring</li>
                        <li>Document gaps in security monitoring coverage</li>
                        <li>Create remediation plan for unmonitored critical devices</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Assessment Results:</h4>
                      <div className="text-sm text-gray-700">
                        <p className="mb-2">Initial SOC monitoring coverage: 45% of devices</p>
                        <p>Initial patch compliance rate: 62% of devices up-to-date</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-blue-50 border-b border-blue-100 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 text-xs">2</div>
                        <h3 className="font-medium">Baseline Establishment (Month 2) - In Progress</h3>
                      </div>
                      <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">In Progress</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Key Milestones:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                        <li className="text-green-700"><span className="text-gray-700">Deploy Wazuh agents to all critical workstations</span> ✓</li>
                        <li className="text-green-700"><span className="text-gray-700">Configure Splunk forwarders for all servers</span> ✓</li>
                        <li>Implement Suricata monitoring for all network segments</li>
                        <li>Complete vulnerability scanning baseline for all assets</li>
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Current Progress:</h4>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Started May 1, 2025</span>
                        <span>Target: May 31, 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center mr-3 text-xs">3</div>
                        <h3 className="font-medium">Security Implementation (Month 3)</h3>
                      </div>
                      <Badge variant="outline" className="border-gray-300 text-gray-500 bg-gray-50">Upcoming</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Planned Activities:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                        <li>Apply security patches to all critical systems</li>
                        <li>Implement enhanced security controls based on baseline findings</li>
                        <li>Configure alerts for all monitoring tools</li>
                        <li>Document security baseline for all devices</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Device History Dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Device History</DialogTitle>
            <DialogDescription>
              {selectedDevice && (
                <span>Tracking security changes for {selectedDevice.makeModel} ({selectedDevice.serialNumber})</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDevice && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{selectedDevice.makeModel}</div>
                  <div className="text-sm text-gray-500">
                    {selectedDevice.deviceType} • {selectedDevice.operatingSystem} {selectedDevice.osVersion}
                  </div>
                </div>
                
                <Badge 
                  variant="outline" 
                  className={
                    selectedDevice.sensitivityLevel === "Critical" 
                      ? "border-red-500 text-red-700 bg-red-50" 
                      : selectedDevice.sensitivityLevel === "High"
                        ? "border-orange-500 text-orange-700 bg-orange-50"
                        : "border-blue-500 text-blue-700 bg-blue-50"
                  }
                >
                  {selectedDevice.sensitivityLevel} Risk
                </Badge>
              </div>
              
              <div className="space-y-1 py-2">
                <h4 className="text-sm font-medium mb-2">Device History Timeline</h4>
                
                <div className="border-l-2 border-gray-200 pl-4 space-y-6 ml-3">
                  {selectedDevice.historyEntries.map((entry, i) => {
                    const date = new Date(entry.date);
                    return (
                      <div key={i} className="relative">
                        <div className="absolute -left-[22px] top-0 w-4 h-4 rounded-full bg-blue-600"></div>
                        <div className="text-xs text-gray-500 mb-1">
                          {date.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })} at {date.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="text-sm font-medium">{entry.action}</div>
                        <div className="text-sm text-gray-700 mt-1">{entry.description}</div>
                        <div className="text-xs text-gray-500 mt-1">By: {entry.user}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    All device history is documented as part of the 6-month comprehensive assessment evidence collection.
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}