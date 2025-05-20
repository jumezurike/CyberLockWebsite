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
    <div className="space-y-4">
      <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
        <h4 className="text-sm font-medium text-blue-800 mb-1">Universal Wallet Address (UWA) Records</h4>
        <p className="text-xs text-blue-700">
          This table shows the components used to derive Universal Wallet Addresses (UWA) for machines and devices. 
          These records are permanent and enable cryptographic authentication and verification.
        </p>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Component Type</TableHead>
              <TableHead className="font-medium">Identity Type</TableHead>
              <TableHead className="font-medium">Verification Type</TableHead>
              <TableHead className="font-medium">Required</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialUwaComponents.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.componentType}</TableCell>
                <TableCell>{record.identityType}</TableCell>
                <TableCell>{record.verificationType}</TableCell>
                <TableCell>{record.required ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}