import React from 'react';
import { deviceIdentitySynergies, synergisticSecurityBenefits } from '@/lib/device-identity-synergy';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function DeviceIdentitySynergyTable() {
  return (
    <Card className="mb-8">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-xl font-bold flex items-center">
          <span className="bg-primary text-primary-foreground p-1 rounded-full mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </span>
          Device Inventory Tracking & Identity Behavior & Hygiene Synergy
        </CardTitle>
        <CardDescription>
          Together, these two parameters create a powerful synergistic effect that enhances overall security posture.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-1/3">Device Inventory Tracking</TableHead>
              <TableHead className="w-1/3">Identity Behavior & Hygiene</TableHead>
              <TableHead className="w-1/3">Synergistic Outcome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deviceIdentitySynergies.map((synergy, index) => (
              <TableRow key={index} className={index % 2 === 0 ? 'bg-muted/10' : ''}>
                <TableCell className="font-medium border-r border-muted">
                  {synergy.deviceInventoryFunction}
                </TableCell>
                <TableCell className="font-medium border-r border-muted">
                  {synergy.identityBehaviorFunction}
                </TableCell>
                <TableCell className="font-medium">
                  {synergy.synergisticOutcome}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t border-muted">
          <h3 className="text-lg font-semibold mb-3">Security Benefits</h3>
          <div className="flex flex-wrap gap-2">
            {synergisticSecurityBenefits.map((benefit, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1 text-sm bg-muted/20">
                {benefit}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}