import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { Sos2aFormData } from "@/lib/sos2a-types";

// Define the props for the component
interface IsmsProcessesSectionProps {
  form: UseFormReturn<Sos2aFormData>;
  processOptions: Array<{ id: string; label: string }>;
}

const IsmsProcessesSection: React.FC<IsmsProcessesSectionProps> = ({ form, processOptions }) => {
  // Get the current values from the form
  const processValues = form.watch("ismsProcesses") || [];
  
  // Function to handle checkbox changes
  const handleProcessChange = (processId: string, checked: boolean) => {
    if (checked) {
      form.setValue("ismsProcesses", [...processValues, processId], { 
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
    } else {
      form.setValue("ismsProcesses", 
        processValues.filter((id: string) => id !== processId),
        { 
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        }
      );
    }
  };
  
  return (
    <div className="mt-8 mb-8 p-6 border-4 border-red-500 rounded-md bg-red-50 shadow-lg">
      <h3 className="text-xl font-bold text-red-900 mb-4">ISMS Processes</h3>
      <p className="mb-4 text-red-900">Please select all the ISMS processes that are implemented in your organization:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {processOptions.map((option) => (
          <div
            key={`process-${option.id}`}
            className="flex flex-row items-start space-x-3 space-y-0 p-4 border-2 border-red-300 bg-white rounded-md"
          >
            <Checkbox
              id={`ismsProcess-${option.id}`}
              className="h-5 w-5 border-2 border-red-500"
              checked={processValues.includes(option.id)}
              onCheckedChange={(checked: boolean) => handleProcessChange(option.id, checked)}
            />
            <Label
              htmlFor={`ismsProcess-${option.id}`}
              className="font-medium text-lg cursor-pointer text-red-900"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IsmsProcessesSection;