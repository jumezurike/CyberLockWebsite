import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, Eye, Trash2 } from "lucide-react";

// Sample UWA records data
const uwaRecords = [
  {
    uwaValue: "CLX-PR9ca-4-7ae-bebe-4087c-52abb-f4-X57+XH+-centosl",
    identityType: "Machine",
    identificationMethod: "Serial Number",
    serverId: "srv-34522",
    uuid: "1c-49ca-47ae-bebe-4087c52abbf4",
    sn: "HG653-887L",
    makeModel: "Dell PowerEdge R740",
    os: "centosl",
    owner: "Healthcare Analytics",
    mac: "80:18:44:e0:af:c6",
    uwaShadow: "...fc52abbf4X57",
    environment: "PR",
    ipAddress: "10.45.67.89",
    ein: "94-3751004",
    address: "2X57+XH+"
  },
  {
    uwaValue: "CLX-PD-31a3b-45c2-d8f0-7g41-89h2-1j-2k-linuxsvr",
    identityType: "Machine",
    identificationMethod: "Serial Number",
    serverId: "srv-67891",
    uuid: "a3b45c2d-8f07-g418-9h21-j2k3l4m5n6o7",
    sn: "JK129-556P",
    makeModel: "HPE ProLiant DL380",
    os: "linuxsvr",
    owner: "Medical Records",
    mac: "a4:6e:2b:91:d5:37",
    uwaShadow: "...4m5n6o7TX8+Y",
    environment: "PD",
    ipAddress: "10.22.33.44",
    ein: "94-3751004",
    address: "TX8+YJ+"
  }
];

export default function UwaRecordsTable() {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border-collapse text-xs">
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="py-1 px-2 text-left font-medium border">UWA</TableHead>
            <TableHead className="py-1 px-2 text-left font-medium border">Identity type</TableHead>
            <TableHead className="py-1 px-2 text-left font-medium border">ID method</TableHead>
            <TableHead className="py-1 px-2 text-left font-medium border">ServerID</TableHead>
            <TableHead className="py-1 px-2 text-left font-medium border">UUID</TableHead>
            <TableHead className="py-1 px-2 text-left font-medium border">SN</TableHead>
            <TableHead className="py-1 px-2 text-left font-medium border">MAKE/MODEL</TableHead>
            <TableHead className="py-1 px-2 text-left font-medium border">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {uwaRecords.map((record, index) => (
            <TableRow key={index} className={index === uwaRecords.length - 1 ? "bg-green-50" : ""}>
              <TableCell className="py-1 px-2 border bg-amber-50 font-medium text-xs">
                {record.uwaValue.substring(0, 12)}...
              </TableCell>
              <TableCell className="py-1 px-2 border">{record.identityType}</TableCell>
              <TableCell className="py-1 px-2 border">{record.identificationMethod}</TableCell>
              <TableCell className="py-1 px-2 border">{record.serverId}</TableCell>
              <TableCell className="py-1 px-2 border bg-green-100">{`${record.uuid.substring(0, 8)}...`}</TableCell>
              <TableCell className="py-1 px-2 border">{record.sn}</TableCell>
              <TableCell className="py-1 px-2 border">{record.makeModel}</TableCell>
              <TableCell className="py-1 px-2 border">
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" title="View Details">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" title="Copy UWA">
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" title="Delete">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}