import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowDownToLine, FileSpreadsheet } from 'lucide-react';

export default function UserIdentityTemplate() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadCSV = useCallback(() => {
    setIsDownloading(true);
    
    // Download the CSV template
    const link = document.createElement('a');
    link.href = '/templates/user-identity-template.csv';
    link.setAttribute('download', 'user-identity-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsDownloading(false);
  }, []);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>User Identity Templates</CardTitle>
        <CardDescription>
          Download these templates to easily prepare your organization's user identity data for upload to our system.
          This data will be used with our Universal Identity Verification System (UIVS) to create secure user profiles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleDownloadCSV} 
            disabled={isDownloading}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet size={18} />
            <span>Download CSV Template</span>
            <ArrowDownToLine size={18} />
          </Button>
          <div className="text-sm text-muted-foreground mt-4 sm:mt-2">
            <p>This template includes all required fields for importing user identity data.</p>
            <ul className="list-disc ml-5 mt-2">
              <li>Fill in the template with your organization's user information</li>
              <li>Don't change the column headers</li>
              <li>Save the file as CSV format when complete</li>
              <li>Upload the completed file in the identity management section</li>
              <li>Our system will securely process this data through the Universal Identity Verification System (UIVS)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}