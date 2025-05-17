import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowDownToLine, FileSpreadsheet, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DeviceInventoryTemplate() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownloadCSV = useCallback(() => {
    setIsDownloading(true);
    
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
    
    setIsDownloading(false);
  }, [toast]);

  const handleImportCSV = useCallback(() => {
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
    };
    input.click();
  }, [toast]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Device Inventory Templates</CardTitle>
        <CardDescription>
          Download these templates to easily prepare your device inventory data for upload to our system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col gap-4">
            {/* Download Template Button - Styled in blue */}
            <Button 
              onClick={handleDownloadCSV} 
              disabled={isDownloading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-6 px-8 rounded-md flex items-center gap-3 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <FileSpreadsheet size={24} />
              <div className="flex flex-col items-start">
                <span className="text-lg">DOWNLOAD TEMPLATE</span>
                <span className="text-xs text-blue-100">Get CSV format for your data</span>
              </div>
              <ArrowDownToLine size={20} className="ml-2" />
            </Button>
            
            {/* Import CSV Button - Styled in green */}
            <Button 
              onClick={handleImportCSV}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-6 px-8 rounded-md flex items-center gap-3 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Upload size={24} />
              <div className="flex flex-col items-start">
                <span className="text-lg">IMPORT CSV</span>
                <span className="text-xs text-green-100">Upload your device data</span>
              </div>
            </Button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-medium mb-2 text-gray-800">Instructions</h3>
            <div className="text-sm text-gray-600">
              <p>This template includes all required fields for importing device inventory data.</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Fill in the template with your device information</li>
                <li>Don't change the column headers</li>
                <li>Save the file as CSV format when complete</li>
                <li>Use the green button to upload your completed file</li>
                <li>The system will validate your data during import</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}