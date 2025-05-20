import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Trash2, RefreshCw } from "lucide-react";

// Define UWA Record interface
interface UwaRecord {
  id: number;
  uwaValue: string;
  identityType: string | null;
  identificationMethod: string | null;
  serverId: string | null;
  instanceUUID: string | null;
  serialNumber: string | null;
  makeModel: string | null;
  osName: string | null;
  companyName: string | null;
  macAddress: string | null;
  uwaShadow: string | null;
  environment: string | null;
  ipAddress: string | null;
  einBusinessNumber: string | null;
  address: string | null;
  usedComponents: string[];
}

// Sample UWA records with highlighting
const initialUwaRecords: UwaRecord[] = [
  {
    id: 1,
    uwaValue: "CLX-7b9d-4f3a-8c2e-5a1b0cd83e42",
    identityType: "Server",
    identificationMethod: "Hardware + Network",
    serverId: "SRV-DC1-2025-001",
    instanceUUID: "a8f5-4c21-9b3e-7d98a2b1c3f4",
    serialNumber: "SN72934856",
    makeModel: "Dell PowerEdge R740",
    osName: "Windows Server 2022",
    companyName: "HealthTech Solutions",
    macAddress: "00:1A:2B:3C:4D:5E",
    uwaShadow: null,
    environment: "Production",
    ipAddress: "10.0.0.15",
    einBusinessNumber: "82-1234567",
    address: "123 Healthcare Ave, Medical City, CA",
    usedComponents: ["identityType", "serverId", "instanceUUID", "osName", "environment", "address"]
  },
  {
    id: 2,
    uwaValue: "CLX-5e3c-2d7a-9f1b-6e4d8c7a2b5e",
    identityType: "Medical Device",
    identificationMethod: "Device + Network",
    serverId: null,
    instanceUUID: "b7e9-3a5c-8d4f-2e1b7a9c8d6f",
    serialNumber: "MD45678123",
    makeModel: "GE Healthcare Vivid E95",
    osName: "Proprietary OS",
    companyName: "City General Hospital",
    macAddress: "01:2C:3D:4E:5F:6A",
    uwaShadow: null,
    environment: "Clinical",
    ipAddress: "10.2.3.45",
    einBusinessNumber: "82-7654321",
    address: "456 Hospital Road, Medical City, CA",
    usedComponents: ["identityType", "instanceUUID", "osName", "environment"]
  }
];

export default function UwaRecordsTable() {
  const [uwaRecords, setUwaRecords] = useState<UwaRecord[]>(initialUwaRecords);
  const [editingRecord, setEditingRecord] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const { toast } = useToast();
  
  // Check if a field was used to create the UWA
  const isUsedInUwa = (record: UwaRecord, fieldName: string): boolean => {
    return record.usedComponents.includes(fieldName);
  };
  
  // Handle edit field start
  const handleEditStart = (recordId: number, fieldName: string, currentValue: string) => {
    setEditingRecord(recordId);
    setEditingField(fieldName);
    setEditValue(currentValue);
  };
  
  // Handle edit field change
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };
  
  // Handle edit field blur (save edit)
  const handleEditBlur = () => {
    if (editingRecord !== null && editingField !== null) {
      // Update the record in state
      setUwaRecords(prevRecords => {
        return prevRecords.map(record => {
          if (record.id === editingRecord) {
            return {
              ...record,
              [editingField]: editValue
            };
          }
          return record;
        });
      });
      
      // Reset editing state
      setEditingRecord(null);
      setEditingField(null);
      setEditValue("");
      
      // Show success toast
      toast({
        title: "Field updated",
        description: "The UWA record has been updated successfully.",
      });
    }
  };
  
  // Export UWA records to CSV
  const exportUwaRecordsToCsv = useCallback(() => {
    // Create CSV header
    const headers = [
      "UWA",
      "Identity Type",
      "Identification Method",
      "Server ID",
      "UUID",
      "Serial Number",
      "Make/Model",
      "OS",
      "Company",
      "MAC Address",
      "UWA Shadow",
      "Environment",
      "IP Address",
      "EIN/Business Number",
      "Address"
    ].join(",");
    
    // Create CSV rows
    const rows = uwaRecords.map(record => {
      return [
        record.uwaValue,
        record.identityType || "",
        record.identificationMethod || "",
        record.serverId || "",
        record.instanceUUID || "",
        record.serialNumber || "",
        record.makeModel || "",
        record.osName || "",
        record.companyName || "",
        record.macAddress || "",
        record.uwaShadow || "",
        record.environment || "",
        record.ipAddress || "",
        record.einBusinessNumber || "",
        record.address || ""
      ].map(value => `"${value.replace(/"/g, '""')}"`).join(",");
    });
    
    // Combine header and rows
    const csvContent = [headers, ...rows].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "uwa_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success toast
    toast({
      title: "Export successful",
      description: "UWA records have been exported to CSV.",
    });
  }, [uwaRecords, toast]);

  return (
    <div className="mt-4 border rounded-md p-3">
      <h6 className="text-xs font-medium mb-2">UWA Records</h6>
      <p className="text-xs text-muted-foreground mb-2">
        This table shows all UWA records and the components used to create each UWA. 
        Highlighted fields with values were used to derive the UWA.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-xs">
          <thead className="bg-muted/30">
            <tr>
              <th className="py-1 px-2 text-left font-medium border">UWA</th>
              <th className="py-1 px-2 text-left font-medium border">Identity type</th>
              <th className="py-1 px-2 text-left font-medium border">Identification method</th>
              <th className="py-1 px-2 text-left font-medium border">ServerID</th>
              <th className="py-1 px-2 text-left font-medium border">UUID</th>
              <th className="py-1 px-2 text-left font-medium border">SN</th>
              <th className="py-1 px-2 text-left font-medium border">MAKE/MODEL</th>
              <th className="py-1 px-2 text-left font-medium border">OS</th>
              <th className="py-1 px-2 text-left font-medium border">Server/OWNER/COMPANY</th>
              <th className="py-1 px-2 text-left font-medium border">MAC</th>
              <th className="py-1 px-2 text-left font-medium border">UWA/N SHADOW</th>
              <th className="py-1 px-2 text-left font-medium border">ENVIRONMENT</th>
              <th className="py-1 px-2 text-left font-medium border">IP address</th>
              <th className="py-1 px-2 text-left font-medium border">EIN/BIZ #</th>
              <th className="py-1 px-2 text-left font-medium border">ADDRESS</th>
              <th className="py-1 px-2 text-left font-medium border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {uwaRecords.length > 0 ? (
              uwaRecords.map((record, index) => (
                <tr key={index} className={index === uwaRecords.length - 1 ? "bg-green-50" : ""}>
                  {/* UWA Value - Read-only */}
                  <td className="py-1 px-2 border bg-amber-50 font-medium">
                    {record.uwaValue}
                  </td>
                  
                  {/* Identity Type */}
                  <td className={`py-1 px-2 border ${isUsedInUwa(record, 'identityType') ? 'bg-green-50 font-medium' : ''}`}>
                    {editingRecord === record.id && editingField === 'identityType' ? (
                      <input 
                        type="text" 
                        className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={handleEditBlur}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="cursor-text"
                        onClick={() => handleEditStart(record.id, 'identityType', record.identityType || '')}
                      >
                        {isUsedInUwa(record, 'identityType') ? record.identityType : '-'}
                      </div>
                    )}
                  </td>
                  
                  {/* Identification Method */}
                  <td className={`py-1 px-2 border ${isUsedInUwa(record, 'identificationMethod') ? 'bg-green-50 font-medium' : ''}`}>
                    {editingRecord === record.id && editingField === 'identificationMethod' ? (
                      <input 
                        type="text" 
                        className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={handleEditBlur}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="cursor-text"
                        onClick={() => handleEditStart(record.id, 'identificationMethod', record.identificationMethod || '')}
                      >
                        {isUsedInUwa(record, 'identificationMethod') ? record.identificationMethod : '-'}
                      </div>
                    )}
                  </td>
                  
                  {/* Server ID */}
                  <td className={`py-1 px-2 border ${isUsedInUwa(record, 'serverId') ? 'bg-green-50 font-medium' : ''}`}>
                    {editingRecord === record.id && editingField === 'serverId' ? (
                      <input 
                        type="text" 
                        className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={handleEditBlur}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="cursor-text"
                        onClick={() => handleEditStart(record.id, 'serverId', record.serverId || '')}
                      >
                        {isUsedInUwa(record, 'serverId') ? record.serverId : '-'}
                      </div>
                    )}
                  </td>
                  
                  {/* UUID */}
                  <td className={`py-1 px-2 border ${isUsedInUwa(record, 'instanceUUID') ? 'bg-green-50 font-medium' : ''}`}>
                    {editingRecord === record.id && editingField === 'instanceUUID' ? (
                      <input 
                        type="text" 
                        className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={handleEditBlur}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="cursor-text"
                        onClick={() => handleEditStart(record.id, 'instanceUUID', record.instanceUUID || '')}
                      >
                        {isUsedInUwa(record, 'instanceUUID') ? record.instanceUUID : '-'}
                      </div>
                    )}
                  </td>
                  
                  {/* Serial Number */}
                  <td className="py-1 px-2 border">
                    {editingRecord === record.id && editingField === 'serialNumber' ? (
                      <input 
                        type="text" 
                        className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={handleEditBlur}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="cursor-text"
                        onClick={() => handleEditStart(record.id, 'serialNumber', record.serialNumber || '')}
                      >
                        {record.serialNumber || '-'}
                      </div>
                    )}
                  </td>
                  
                  {/* Make/Model */}
                  <td className="py-1 px-2 border">
                    {editingRecord === record.id && editingField === 'makeModel' ? (
                      <input 
                        type="text" 
                        className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={handleEditBlur}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="cursor-text"
                        onClick={() => handleEditStart(record.id, 'makeModel', record.makeModel || '')}
                      >
                        {record.makeModel || '-'}
                      </div>
                    )}
                  </td>
                  
                  {/* OS */}
                  <td className={`py-1 px-2 border ${isUsedInUwa(record, 'osName') ? 'bg-green-50 font-medium' : ''}`}>
                    {editingRecord === record.id && editingField === 'osName' ? (
                      <input 
                        type="text" 
                        className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={handleEditBlur}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="cursor-text"
                        onClick={() => handleEditStart(record.id, 'osName', record.osName || '')}
                      >
                        {isUsedInUwa(record, 'osName') ? record.osName : '-'}
                      </div>
                    )}
                  </td>
                  
                  {/* Company Name */}
                  <td className="py-1 px-2 border">
                    {editingRecord === record.id && editingField === 'companyName' ? (
                      <input 
                        type="text" 
                        className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={handleEditBlur}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="cursor-text"
                        onClick={() => handleEditStart(record.id, 'companyName', record.companyName || '')}
                      >
                        {record.companyName || '-'}
                      </div>
                    )}
                  </td>
                  
                  {/* MAC Address */}
                  <td className="py-1 px-2 border">
                    {editingRecord === record.id && editingField === 'macAddress' ? (
                      <input 
                        type="text" 
                        className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={handleEditBlur}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="cursor-text"
                        onClick={() => handleEditStart(record.id, 'macAddress', record.macAddress || '')}
                      >
                        {record.macAddress || '-'}
                      </div>
                    )}
                  </td>
                  
                  {/* UWA Shadow */}
                  <td className="py-1 px-2 border">
                    {editingRecord === record.id && editingField === 'uwaShadow' ? (
                      <input 
                        type="text" 
                        className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={handleEditBlur}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="cursor-text"
                        onClick={() => handleEditStart(record.id, 'uwaShadow', record.uwaShadow || '')}
                      >
                        {record.uwaShadow || '-'}
                      </div>
                    )}
                  </td>
                  
                  {/* Environment */}
                  <td className={`py-1 px-2 border ${isUsedInUwa(record, 'environment') ? 'bg-green-50 font-medium' : ''}`}>
                    {editingRecord === record.id && editingField === 'environment' ? (
                      <input 
                        type="text" 
                        className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={handleEditBlur}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="cursor-text"
                        onClick={() => handleEditStart(record.id, 'environment', record.environment || '')}
                      >
                        {isUsedInUwa(record, 'environment') ? record.environment : '-'}
                      </div>
                    )}
                  </td>
                  
                  {/* IP Address */}
                  <td className="py-1 px-2 border">
                    {editingRecord === record.id && editingField === 'ipAddress' ? (
                      <input 
                        type="text" 
                        className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={handleEditBlur}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="cursor-text"
                        onClick={() => handleEditStart(record.id, 'ipAddress', record.ipAddress || '')}
                      >
                        {record.ipAddress || '-'}
                      </div>
                    )}
                  </td>
                  
                  {/* EIN/Business Number */}
                  <td className="py-1 px-2 border">
                    {editingRecord === record.id && editingField === 'einBusinessNumber' ? (
                      <input 
                        type="text" 
                        className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={handleEditBlur}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="cursor-text"
                        onClick={() => handleEditStart(record.id, 'einBusinessNumber', record.einBusinessNumber || '')}
                      >
                        {record.einBusinessNumber || '-'}
                      </div>
                    )}
                  </td>
                  
                  {/* Address */}
                  <td className={`py-1 px-2 border ${isUsedInUwa(record, 'address') ? 'bg-green-50 font-medium' : ''}`}>
                    {editingRecord === record.id && editingField === 'address' ? (
                      <input 
                        type="text" 
                        className="w-full p-0.5 text-xs border border-green-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={handleEditBlur}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="cursor-text"
                        onClick={() => handleEditStart(record.id, 'address', record.address || '')}
                      >
                        {isUsedInUwa(record, 'address') ? record.address : '-'}
                      </div>
                    )}
                  </td>
                  
                  {/* Actions */}
                  <td className="py-1 px-2 border">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this UWA record?')) {
                            // Filter out the record
                            setUwaRecords(prevRecords => 
                              prevRecords.filter(r => r.id !== record.id)
                            );
                            
                            toast({
                              title: "UWA Record Deleted",
                              description: "The UWA record has been removed.",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={16} className="py-3 px-2 text-center text-muted-foreground">
                  No UWA records found. Generate a UWA to create a record.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-2 flex justify-end">
        <Button 
          size="sm" 
          variant="outline"
          onClick={exportUwaRecordsToCsv}
        >
          <Download className="h-3 w-3 mr-1" /> Export Records
        </Button>
      </div>
    </div>
  );
}