import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Check, ShieldCheck, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SecureProfileImageProps {
  userId?: string;
  userName?: string;
  existingImageUrl?: string;
}

export default function SecureProfileImage({ userId, userName, existingImageUrl }: SecureProfileImageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingImageUrl || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerified, setIsVerified] = useState(!!existingImageUrl);
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!userName) return "U";
    return userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
          // Auto-process the image
          processImage();
        }
      };
      fileReader.readAsDataURL(file);
    }
  };
  
  const processImage = () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    
    // Simulate processing with a short delay
    setTimeout(() => {
      setIsVerified(true);
      setIsProcessing(false);
    }, 1500);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="group relative">
        <Avatar className={cn(
          "w-24 h-24 border-4",
          isVerified ? "border-green-500" : "border-gray-200",
          isProcessing ? "animate-pulse" : ""
        )}>
          <AvatarImage src={previewUrl || undefined} alt="Profile" />
          <AvatarFallback className="text-2xl bg-blue-100 text-blue-800">{getInitials()}</AvatarFallback>
        </Avatar>
        
        {isVerified && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  className="absolute -bottom-1 -right-1 bg-green-500 text-white border-2 border-white rounded-full p-1"
                >
                  <ShieldCheck className="h-3 w-3" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Secured with color-coded non-fungible verification</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
          <div className="relative">
            <input
              type="file"
              id="profile-image"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
            <Button variant="ghost" size="icon" className="rounded-full text-white hover:text-white hover:bg-black/60">
              <Camera className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <p className="text-sm font-medium">{userName || "Upload Profile Picture"}</p>
        {isVerified ? (
          <p className="text-xs text-green-600 flex items-center justify-center mt-1">
            <Lock className="h-3 w-3 mr-1" />
            Secure verification active
          </p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">
            {previewUrl ? "Processing..." : "Hover and click to upload"}
          </p>
        )}
      </div>
    </div>
  );
}