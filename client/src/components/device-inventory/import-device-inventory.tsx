import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDownToLine, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ImportDeviceInventory() {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleImportCSV = () => {
    setIsImporting(true);
    
    // File input for CSV upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // File handling would go here
        toast({
          title: "CSV Import",
          description: `${file.name} selected for import. Processing...`,
        });
      }
      setIsImporting(false);
    };
    input.click();
  };

  const handleDownloadTemplate = () => {
    // Download the CSV template
    const link = document.createElement('a');
    link.href = '/templates/device-inventory-template.csv';
    link.setAttribute('download', 'device-inventory-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Template Downloaded",
      description: "Fill this template with your device information and import it back.",
    });
  };

  return (
    <div className="mb-8 border border-gray-200 rounded-lg">
      <div className="p-4">
        <h3 className="text-base font-semibold mb-1">Import Device Inventory</h3>
        <p className="text-gray-600 text-sm mb-4">
          Use these options to import existing device inventory data.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={handleImportCSV}
            variant="default"
            className="justify-center py-2 h-auto text-sm bg-purple-600 hover:bg-purple-700"
            disabled={isImporting}
          >
            Import CSV
          </Button>
          
          <Button 
            onClick={handleDownloadTemplate}
            variant="outline"
            className="justify-center py-2 h-auto text-sm flex items-center bg-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
        </div>
      </div>
    </div>
  );
}