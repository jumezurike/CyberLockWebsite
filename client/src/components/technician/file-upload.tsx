import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileImage, FileText, X, Camera } from 'lucide-react';

interface FileUploadProps {
  workOrderId: number;
  uploadType: 'before' | 'after' | 'documents' | 'report';
  title: string;
  description: string;
  onUpload: (files: string[]) => void;
  existingFiles?: string[];
}

export default function FileUpload({ 
  workOrderId, 
  uploadType, 
  title, 
  description, 
  onUpload, 
  existingFiles = [] 
}: FileUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(existingFiles);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });
      formData.append('workOrderId', workOrderId.toString());
      formData.append('uploadType', uploadType);

      const response = await fetch('/api/technician/upload-files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload files');
      }

      const result = await response.json();
      const newFiles = [...uploadedFiles, ...result.filePaths];
      setUploadedFiles(newFiles);
      onUpload(newFiles);

      toast({
        title: "Success",
        description: `${files.length} file(s) uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (fileToRemove: string) => {
    const updatedFiles = uploadedFiles.filter(file => file !== fileToRemove);
    setUploadedFiles(updatedFiles);
    onUpload(updatedFiles);
    
    toast({
      title: "File Removed",
      description: "File removed from upload list",
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <FileImage className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const getAcceptTypes = () => {
    switch (uploadType) {
      case 'before':
      case 'after':
        return 'image/*';
      case 'documents':
      case 'report':
        return 'image/*,.pdf,.doc,.docx,.txt';
      default:
        return '*/*';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {uploadType === 'before' || uploadType === 'after' ? (
            <Camera className="h-5 w-5" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Button */}
        <div className="flex items-center justify-center w-full">
          <Button
            type="button"
            variant="outline"
            onClick={handleFileSelect}
            disabled={uploading}
            className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-gray-400"
          >
            <div className="text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                {uploading ? 'Uploading...' : 'Click to upload files'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {uploadType === 'before' || uploadType === 'after' 
                  ? 'Images only (JPG, PNG, etc.)'
                  : 'Images, PDFs, Documents'
                }
              </p>
            </div>
          </Button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={getAcceptTypes()}
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Uploaded Files:</Label>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {getFileIcon(file)}
                    <span className="text-sm truncate max-w-64">{file.split('/').pop()}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Guidelines */}
        {uploadType === 'before' || uploadType === 'after' ? (
          <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p className="font-medium mb-1">Photo Guidelines:</p>
            <ul className="space-y-1">
              <li>• Take clear, well-lit photos</li>
              <li>• Include multiple angles if relevant</li>
              <li>• Ensure important details are visible</li>
              <li>• Photos will be used for documentation and potential legal evidence</li>
            </ul>
          </div>
        ) : (
          <div className="text-xs text-gray-600 bg-green-50 p-3 rounded-lg">
            <p className="font-medium mb-1">Document Guidelines:</p>
            <ul className="space-y-1">
              <li>• Upload signed service reports</li>
              <li>• Include client authorization documents</li>
              <li>• Ensure all signatures are clearly visible</li>
              <li>• Documents may be used in legal proceedings</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}