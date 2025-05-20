import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Define the UWA record component types
interface UwaComponentRecord {
  componentType: string;
  identityType: string;
  verificationType: string;
  required: boolean;
}

// Initial UWA component data
const initialUwaComponents: UwaComponentRecord[] = [
  {
    componentType: "Device Authentication",
    identityType: "Machine",
    verificationType: "IMEI/Serial",
    required: true
  },
  {
    componentType: "Device Authentication",
    identityType: "Machine",
    verificationType: "MAC Address",
    required: true
  },
  {
    componentType: "Digital Certificate",
    identityType: "Machine",
    verificationType: "X.509 Certificate",
    required: true
  },
  {
    componentType: "Device Identity",
    identityType: "Machine",
    verificationType: "Device ID",
    required: true
  },
  {
    componentType: "Universal Wallet Address",
    identityType: "Machine",
    verificationType: "Device-UWA",
    required: true
  }
];

export default function UwaRecordsTable() {
  const [uwaComponents, setUwaComponents] = useState<UwaComponentRecord[]>(initialUwaComponents);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  
  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = uwaComponents.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(uwaComponents.length / recordsPerPage);
  
  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
            {currentRecords.map((record, index) => (
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
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, uwaComponents.length)} of {uwaComponents.length} components
        </div>
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={handlePreviousPage} 
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-2">Page {currentPage} of {totalPages}</span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext 
                onClick={handleNextPage} 
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}