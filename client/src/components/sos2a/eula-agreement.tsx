import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FormDescription } from "@/components/ui/form";

interface EulaAgreementProps {
  isChecked: boolean;
  onCheckChange: (checked: boolean) => void;
}

export function EulaAgreement({ isChecked, onCheckChange }: EulaAgreementProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  return (
    <div className="flex flex-col space-y-4 mt-4">
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="eula-checkbox" 
          checked={isChecked} 
          onCheckedChange={(checked) => onCheckChange(!!checked)} 
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="eula-checkbox"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <span 
              onClick={() => setDialogOpen(true)} 
              className="text-[#7936b0] underline cursor-pointer"
            >
              End User License Agreement (EULA)
            </span>
          </Label>
          <FormDescription className="text-xs">
            Please read and accept our terms and conditions before proceeding
          </FormDescription>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>CyberLockX End User License Agreement</DialogTitle>
            <DialogDescription>
              Please read this agreement carefully before using the CyberLockX services
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 text-sm">
            <h3 className="font-semibold">1. ACCEPTANCE OF TERMS</h3>
            <p>
              By accessing or using the CyberLockX cybersecurity assessment tool, platform, or any related services (collectively, the "Services"), you agree to be bound by this End User License Agreement ("EULA"). If you do not agree to the terms of this EULA, you may not access or use the Services.
            </p>

            <h3 className="font-semibold">2. LICENSE GRANT</h3>
            <p>
              Subject to your compliance with this EULA, CyberLockX grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for your internal business purposes. This license does not grant you any right to use CyberLockX's trade names, trademarks, service marks, logos, domain names, or other distinctive brand features.
            </p>

            <h3 className="font-semibold">3. RESTRICTIONS</h3>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Copy, modify, or create derivative works based on the Services</li>
              <li>Reverse engineer, decompile, or attempt to extract the source code of the Services</li>
              <li>Attempt to bypass or break any security mechanism of the Services</li>
              <li>Use the Services in any manner that could damage, disable, overburden, or impair CyberLockX systems</li>
              <li>Use automated means or scripts to access the Services</li>
              <li>Sell, resell, license, sublicense, distribute, rent, or lease the Services</li>
            </ul>

            <h3 className="font-semibold">4. PROPRIETARY RIGHTS</h3>
            <p>
              All rights, title, and interest in and to the Services, including all intellectual property rights, remain with CyberLockX and its licensors. Nothing in this EULA transfers any such rights to you.
            </p>

            <h3 className="font-semibold">5. DATA PRIVACY AND SECURITY</h3>
            <p>
              You acknowledge that by using the Services, you may provide CyberLockX with information about your business and IT infrastructure. CyberLockX will handle such data in accordance with its Privacy Policy, which is incorporated by reference into this EULA.
            </p>

            <h3 className="font-semibold">6. CONFIDENTIALITY</h3>
            <p>
              Any non-public information that you provide to CyberLockX through the Services, including business information, infrastructure details, and assessment results, will be treated as confidential. CyberLockX will not disclose such information to third parties without your consent, except as required by law.
            </p>

            <h3 className="font-semibold">7. DISCLAIMER OF WARRANTIES</h3>
            <p>
              THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. CYBERLOCKX DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h3 className="font-semibold">8. LIMITATION OF LIABILITY</h3>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CYBERLOCKX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>

            <h3 className="font-semibold">9. TERM AND TERMINATION</h3>
            <p>
              This EULA remains in effect until terminated. CyberLockX may terminate this EULA at any time if you fail to comply with any term hereof. Upon termination, you must cease all use of the Services.
            </p>

            <h3 className="font-semibold">10. GOVERNING LAW</h3>
            <p>
              This EULA is governed by the laws of the state of Delaware, without regard to its conflict of law principles. Any dispute arising from this EULA shall be resolved exclusively in the state or federal courts located in Delaware.
            </p>

            <h3 className="font-semibold">11. CHANGES TO EULA</h3>
            <p>
              CyberLockX reserves the right to modify this EULA at any time. We will notify you of any material changes by posting the new EULA on our website. Your continued use of the Services after such changes constitutes your acceptance of the new EULA.
            </p>

            <h3 className="font-semibold">12. CONTACT INFORMATION</h3>
            <p>
              If you have any questions about this EULA, please contact us at legal@cyberlockx.xyz.
            </p>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button 
              onClick={() => {
                onCheckChange(true);
                setDialogOpen(false);
              }}
            >
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}