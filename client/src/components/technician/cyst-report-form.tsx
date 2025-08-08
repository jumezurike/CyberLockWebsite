import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FileText, Clock, MapPin, User, Building, Wrench, CheckCircle } from 'lucide-react';

interface CystReportFormProps {
  workOrderId: number;
  onSave: (reportData: any) => void;
}

const BUSINESS_TYPES = [
  "SMB Gen-Contracting",
  "SMB (IT)",
  "SMB (Social Impact)",
  "Health",
  "SMB (Accounting/Tax)",
  "Education",
  "Non-profit (Church)",
  "SMB (Food)"
];

const SERVICE_TYPES = [
  "Diagnosis",
  "Cabling",
  "Software Installation",
  "Network Installation",
  "Virus Removal",
  "Computer Optimization",
  "SOS2A",
  "Website Encryption",
  "Threat Modeling",
  "Wi-Fi Setup",
  "Computer Maintenance"
];

export default function CystReportForm({ workOrderId, onSave }: CystReportFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Business Information
    businessName: '',
    businessDescription: '',
    businessType: '',
    
    // Technician Information
    technicianName: '',
    technicianContact: '',
    serviceDate: new Date().toISOString().split('T')[0],
    checkinTime: '',
    checkoutTime: '',
    
    // Provider Information
    providerName: 'CyberLockX Professional Services',
    providerAddress: '',
    providerContact: '',
    providerContactPerson: '',
    providerPhone: '',
    
    // Receiver Information
    receiverName: '',
    receiverAddress: '',
    receiverContact: '',
    receiverContactPerson: '',
    receiverPhone: '',
    
    // Service Types (boolean fields for each service)
    serviceDiagnosis: false,
    serviceCabling: false,
    serviceSoftwareInstallation: false,
    serviceNetworkInstallation: false,
    serviceVirusRemoval: false,
    serviceComputerOptimization: false,
    serviceSos2a: false,
    serviceWebsiteEncryption: false,
    serviceThreatModeling: false,
    serviceWifiSetup: false,
    serviceComputerMaintenance: false,
    
    // Work Details
    workDescription: '',
    devices: '',
    completionStatus: 'completed',
    followupRequired: false,
    
    // Manager Approval
    managerOnDuty: '',
    managerSignature: '',
    managerName: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceTypeChange = (serviceType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [serviceType]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare service types array for submission
      const selectedServices = SERVICE_TYPES.filter(service => {
        const fieldName = `service${service.replace(/[^a-zA-Z0-9]/g, '')}`;
        return formData[fieldName as keyof typeof formData];
      });

      const reportData = {
        ...formData,
        workOrderId,
        serviceTypes: selectedServices
      };

      const response = await fetch('/api/technician/cyst-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error('Failed to create CYST service report');
      }

      const savedReport = await response.json();
      
      toast({
        title: "Success",
        description: "CYST service report created successfully",
      });

      onSave(savedReport);
    } catch (error) {
      console.error('Error creating CYST report:', error);
      toast({
        title: "Error",
        description: "Failed to create CYST service report",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Business Information
          </CardTitle>
          <CardDescription>Client business details and description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="businessType">Business Type *</Label>
              <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="businessDescription">Business Description</Label>
            <Textarea
              id="businessDescription"
              value={formData.businessDescription}
              onChange={(e) => handleInputChange('businessDescription', e.target.value)}
              placeholder="Brief description of the client's business..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Technician Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Technician Information
          </CardTitle>
          <CardDescription>Service technician details and timing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="technicianName">Technician Name *</Label>
              <Input
                id="technicianName"
                value={formData.technicianName}
                onChange={(e) => handleInputChange('technicianName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="technicianContact">Technician Contact</Label>
              <Input
                id="technicianContact"
                value={formData.technicianContact}
                onChange={(e) => handleInputChange('technicianContact', e.target.value)}
                placeholder="Phone or email"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="serviceDate">Service Date *</Label>
              <Input
                id="serviceDate"
                type="date"
                value={formData.serviceDate}
                onChange={(e) => handleInputChange('serviceDate', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="checkinTime">Check-in Time</Label>
              <Input
                id="checkinTime"
                type="time"
                value={formData.checkinTime}
                onChange={(e) => handleInputChange('checkinTime', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="checkoutTime">Check-out Time</Label>
              <Input
                id="checkoutTime"
                type="time"
                value={formData.checkoutTime}
                onChange={(e) => handleInputChange('checkoutTime', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Provider Information
          </CardTitle>
          <CardDescription>Service provider company details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="providerName">Provider Name</Label>
              <Input
                id="providerName"
                value={formData.providerName}
                onChange={(e) => handleInputChange('providerName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="providerContactPerson">Contact Person</Label>
              <Input
                id="providerContactPerson"
                value={formData.providerContactPerson}
                onChange={(e) => handleInputChange('providerContactPerson', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="providerAddress">Provider Address</Label>
            <Textarea
              id="providerAddress"
              value={formData.providerAddress}
              onChange={(e) => handleInputChange('providerAddress', e.target.value)}
              placeholder="Complete business address..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="providerContact">Provider Contact</Label>
              <Input
                id="providerContact"
                value={formData.providerContact}
                onChange={(e) => handleInputChange('providerContact', e.target.value)}
                placeholder="Email address"
              />
            </div>
            <div>
              <Label htmlFor="providerPhone">Provider Phone</Label>
              <Input
                id="providerPhone"
                value={formData.providerPhone}
                onChange={(e) => handleInputChange('providerPhone', e.target.value)}
                placeholder="Business phone number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receiver Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Receiver Information
          </CardTitle>
          <CardDescription>Client contact and location details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="receiverName">Receiver Name</Label>
              <Input
                id="receiverName"
                value={formData.receiverName}
                onChange={(e) => handleInputChange('receiverName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="receiverContactPerson">Contact Person</Label>
              <Input
                id="receiverContactPerson"
                value={formData.receiverContactPerson}
                onChange={(e) => handleInputChange('receiverContactPerson', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="receiverAddress">Receiver Address</Label>
            <Textarea
              id="receiverAddress"
              value={formData.receiverAddress}
              onChange={(e) => handleInputChange('receiverAddress', e.target.value)}
              placeholder="Service location address..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="receiverContact">Receiver Contact</Label>
              <Input
                id="receiverContact"
                value={formData.receiverContact}
                onChange={(e) => handleInputChange('receiverContact', e.target.value)}
                placeholder="Email address"
              />
            </div>
            <div>
              <Label htmlFor="receiverPhone">Receiver Phone</Label>
              <Input
                id="receiverPhone"
                value={formData.receiverPhone}
                onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                placeholder="Contact phone number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Services Performed
          </CardTitle>
          <CardDescription>Select all services that were performed during this visit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SERVICE_TYPES.map((service) => {
              const fieldName = `service${service.replace(/[^a-zA-Z0-9]/g, '')}`;
              return (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={fieldName}
                    checked={formData[fieldName as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) => handleServiceTypeChange(fieldName, checked as boolean)}
                  />
                  <Label htmlFor={fieldName} className="text-sm">{service}</Label>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Work Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Work Details
          </CardTitle>
          <CardDescription>Detailed description of work performed and equipment involved</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="workDescription">Work Description *</Label>
            <Textarea
              id="workDescription"
              value={formData.workDescription}
              onChange={(e) => handleInputChange('workDescription', e.target.value)}
              placeholder="Detailed description of all work performed..."
              rows={4}
              required
            />
          </div>
          <div>
            <Label htmlFor="devices">Devices/Equipment Involved</Label>
            <Textarea
              id="devices"
              value={formData.devices}
              onChange={(e) => handleInputChange('devices', e.target.value)}
              placeholder="List all devices, equipment, and systems worked on..."
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="followupRequired"
              checked={formData.followupRequired}
              onCheckedChange={(checked) => handleInputChange('followupRequired', checked)}
            />
            <Label htmlFor="followupRequired">Follow-up required</Label>
          </div>
        </CardContent>
      </Card>

      {/* Manager Approval */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Manager Approval
          </CardTitle>
          <CardDescription>Manager signature and approval for court admissibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="managerOnDuty">Manager on Duty</Label>
              <Input
                id="managerOnDuty"
                value={formData.managerOnDuty}
                onChange={(e) => handleInputChange('managerOnDuty', e.target.value)}
                placeholder="Manager who approved this report"
              />
            </div>
            <div>
              <Label htmlFor="managerName">Manager Name</Label>
              <Input
                id="managerName"
                value={formData.managerName}
                onChange={(e) => handleInputChange('managerName', e.target.value)}
                placeholder="Full name for signature verification"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="managerSignature">Digital Signature</Label>
            <Input
              id="managerSignature"
              value={formData.managerSignature}
              onChange={(e) => handleInputChange('managerSignature', e.target.value)}
              placeholder="Manager's digital signature or authorization code"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating Report...' : 'Create CYST Service Report'}
        </Button>
      </div>
    </form>
  );
}