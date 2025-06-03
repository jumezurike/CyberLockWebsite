import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const LocationInputGuide = () => {
  return (
    <Alert className="mb-4">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Location Input Options:</strong>
        <br />
        <strong>For Authentication/Authorization Security:</strong> Get authentic Plus Codes from{" "}
        <a 
          href="https://plus.codes/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 underline"
        >
          plus.codes
        </a>{" "}
        for precise location-based identity verification
        <br />
        <strong>Alternative:</strong> Enter regular addresses - system will auto-convert for UWA generation
        <br />
        <em className="text-sm text-gray-600">
          Note: UWA strings are ultimately encrypted for secure authentication/authorization 
          of communication and resource access
        </em>
      </AlertDescription>
    </Alert>
  );
};