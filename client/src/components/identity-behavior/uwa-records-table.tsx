import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, Trash } from "lucide-react";

const UwaRecordsTable = () => {
  // Sample data matching the screenshot
  const uwaRecords = [
    {
      uwa: "CLX-PR8c4-47ae-bebe-4087c52abdf4",
      identityType: "Machine",
      idMethod: "Serial Number",
      serverId: "srv-34522",
      uuid: "1c-49ca-47ae-bebe-4087c52abdf4",
      sn: "HX653-9871",
      makeModel: "Dell PowerEdge R740",
      entityType: "virtual machine"
    },
    {
      uwa: "CLX-PD-31a8ji-ebhs-39j5-acdoi4",
      identityType: "Machine",
      idMethod: "Serial Number",
      serverId: "srv-67891",
      uuid: "a8d45c3f...",
      sn: "JK129-556P",
      makeModel: "HPE ProLiant DL380",
      entityType: "Virtual machine"
    }
  ];

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-4 bg-muted/20">
        <h3 className="font-medium">UWA+Components</h3>
      </div>
      
      <Table>
        <TableHeader className="bg-muted/10">
          <TableRow>
            <TableHead>UWA</TableHead>
            <TableHead>Identity type</TableHead>
            <TableHead>ID method</TableHead>
            <TableHead>ServerID</TableHead>
            <TableHead>UUID</TableHead>
            <TableHead>SN</TableHead>
            <TableHead>MAKE/MODEL</TableHead>
            <TableHead>Entity type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {uwaRecords.map((record, index) => (
            <TableRow key={index}>
              <TableCell className="font-mono text-xs">{record.uwa}</TableCell>
              <TableCell>{record.identityType}</TableCell>
              <TableCell>{record.idMethod}</TableCell>
              <TableCell>{record.serverId}</TableCell>
              <TableCell className="font-mono text-xs">{record.uuid}</TableCell>
              <TableCell>{record.sn}</TableCell>
              <TableCell>{record.makeModel}</TableCell>
              <TableCell>
                <Badge variant="outline" className="lowercase">
                  {record.entityType}
                </Badge>
                {index === 1 && (
                  <div className="mt-1">
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-xs">
                      Yes
                    </Badge>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UwaRecordsTable;