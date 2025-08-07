import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Wrench, Brain, Shield, Users, Plus, Minus } from "lucide-react";

const SERVICE_CATALOG = {
  "Help Desk & Support": [
    { name: "Password Resets & Account Unlocks", basePrice: 2500, priceType: "per_incident", description: "Quick password and account recovery services ($25-50 per incident)" },
    { name: "Email Troubleshooting", basePrice: 3500, priceType: "per_incident", description: "Outlook/Google Workspace configuration and sync fixes" },
    { name: "Printer/Scanner Support", basePrice: 4000, priceType: "per_incident", description: "Driver installs, network printing, queue management" },
    { name: "Wi-Fi/Network Connectivity", basePrice: 4500, priceType: "per_incident", description: "Dead zones, DHCP errors, VPN setup" },
    { name: "Software Installation & Updates", basePrice: 5000, priceType: "per_incident", description: "Licensed apps, updates, compatibility fixes" },
    { name: "Monthly Help Desk Package", basePrice: 5000, priceType: "per_user_monthly", description: "Unlimited Tier 1-2 support per user" },
    { name: "Remote Monitoring & Management", basePrice: 20000, priceType: "monthly", description: "Proactive patching and system monitoring" },
  ],
  "IT Services": [
    { name: "Workstation Deployment", basePrice: 20000, priceType: "per_device", description: "Imaging, data migration, peripheral setup per device ($150-300)" },
    { name: "VoIP Phone System Setup", basePrice: 10000, priceType: "hourly", description: "Physical phones, softphones, call routing ($85-120/hr + $75 non-refundable site visit fee)" },
    { name: "Basic Network Maintenance", basePrice: 12000, priceType: "hourly", description: "Switch/router updates, cable runs, Wi-Fi optimization ($90-150/hr + $75 non-refundable site visit fee)" },
    { name: "Cloud Migration (Microsoft 365/Google)", basePrice: 150000, priceType: "fixed", description: "Complete cloud migration project ($1,500+)" },
    { name: "Hardware Sales & Setup", basePrice: 2000, priceType: "markup", description: "PCs, monitors, docks with 15-30% markup + setup fee" },
    { name: "Security Audit & Report", basePrice: 75000, priceType: "fixed", description: "Vulnerability scans with comprehensive report ($500-2,000)" },
  ],
  "Industry-Specific Services": [
    { name: "Healthcare EHR/EMR Support", basePrice: 12500, priceType: "hourly", description: "Epic, Cerner support - HIPAA compliant ($100-150/hr + $75 non-refundable site visit fee)" },
    { name: "HIPAA Security Training", basePrice: 50000, priceType: "per_session", description: "Healthcare compliance training session" },
    { name: "Medical Device Networking", basePrice: 15000, priceType: "hourly", description: "IoT setup for imaging machines and medical devices + $75 non-refundable site visit fee" },
    { name: "Legal Document Management", basePrice: 12000, priceType: "hourly", description: "iManage, NetDocuments setup and support ($120+/hr + $75 non-refundable site visit fee)" },
    { name: "eDiscovery Support", basePrice: 15000, priceType: "hourly", description: "Data retrieval and archiving for legal firms" },
    { name: "Education Chromebook Management", basePrice: 7500, priceType: "per_device", description: "Google Admin Console setup per device" },
    { name: "Learning Management System", basePrice: 9000, priceType: "hourly", description: "Canvas, Blackboard troubleshooting and support + $75 non-refundable site visit fee" },
  ],
  "Emergency Services": [
    { name: "After-Hours Support", basePrice: 18000, priceType: "hourly", description: "Emergency support at 2x normal rate ($180/hr + $75 non-refundable emergency site visit fee)" },
    { name: "Data Recovery Services", basePrice: 50000, priceType: "fixed", description: "Professional data recovery ($300-1,000+ depending on severity)" },
    { name: "Ransomware Response", basePrice: 500000, priceType: "fixed", description: "Critical incident response engagement ($5,000+ emergency response)" },
  ],
  "Managed Services": [
    { name: "Automated Backup Solutions", basePrice: 7500, priceType: "monthly_per_server", description: "Automated backups per server ($50-100/month)" },
    { name: "Phishing Simulation Testing", basePrice: 20000, priceType: "monthly", description: "Automated phishing campaigns ($200/month)" },
    { name: "VoIP System Monitoring", basePrice: 3000, priceType: "monthly_per_phone", description: "Phone system monitoring per phone ($30/month)" },
    { name: "Basic Managed Services", basePrice: 50000, priceType: "monthly", description: "5 hours remote support + monitoring ($500/month)" },
    { name: "Professional Managed Services", basePrice: 200000, priceType: "monthly", description: "Unlimited Tier 1-2, 10 on-site hours, patches ($2,000/month)" },
    { name: "Enterprise IT Outsourcing", basePrice: 600000, priceType: "monthly", description: "Full IT department replacement ($6,000+/month)" },
  ],
};

interface ServiceSelectionStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ServiceSelectionStep({ data, onUpdate, onNext, onPrev }: ServiceSelectionStepProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>(data.serviceCategory || "");
  const [selectedServices, setSelectedServices] = React.useState<Array<{
    serviceName: string;
    quantity: number;
    basePrice: number;
    priceType: "fixed" | "hourly" | "per_unit" | "per_incident" | "per_device" | "per_user_monthly" | "monthly" | "monthly_per_server" | "monthly_per_phone" | "per_session" | "markup" | "fixed_range";
    unit?: string;
  }>>(data.selectedServices || []);
  const [forceUpdate, setForceUpdate] = React.useState(0);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedServices([]); // Clear selected services when category changes
  };

  const handleServiceToggle = (service: any, checked: boolean) => {
    console.log(`Toggle service: ${service.name}, checked: ${checked}`);
    if (checked) {
      const newService = { 
        serviceName: service.name,
        quantity: 1,
        basePrice: service.basePrice,
        priceType: service.priceType,
        unit: (service as any).unit
      };
      console.log('Adding service:', newService);
      setSelectedServices(prev => {
        const updated = [...prev, newService];
        console.log('Updated selected services:', updated);
        setForceUpdate(f => f + 1); // Force re-render
        return updated;
      });
    } else {
      console.log(`Removing service: ${service.name}`);
      setSelectedServices(prev => {
        const updated = prev.filter(s => s.serviceName !== service.name);
        console.log('Updated selected services after removal:', updated);
        setForceUpdate(f => f + 1); // Force re-render
        return updated;
      });
    }
  };

  const updateQuantity = (serviceName: string, delta: number) => {
    setSelectedServices(prev =>
      prev.map(s =>
        s.serviceName === serviceName
          ? { ...s, quantity: Math.max(1, s.quantity + delta) }
          : s
      )
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  const getPriceTypeLabel = (priceType: string, unit?: string) => {
    switch (priceType) {
      case "fixed": return "Fixed Price";
      case "hourly": return "Per Hour + $75 Non-Refundable Site Visit";
      case "per_unit": return unit ? `Per ${unit}` : "Per Unit";
      case "per_incident": return "Per Incident";
      case "per_device": return "Per Device";
      case "per_user_monthly": return "Per User/Month";
      case "monthly": return "Monthly";
      case "monthly_per_server": return "Monthly Per Server";
      case "monthly_per_phone": return "Monthly Per Phone";
      case "per_session": return "Per Session";
      case "markup": return "Markup + Setup";
      case "fixed_range": return "Range Pricing";
      default: return "";
    }
  };

  const handleContinue = () => {
    onUpdate({
      serviceCategory: selectedCategory,
      selectedServices: selectedServices,
    });
    onNext();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Help Desk & Support": return Users;
      case "IT Services": return Wrench;
      case "Industry-Specific Services": return Brain;
      case "Emergency Services": return Shield;
      case "Managed Services": return Users;
      default: return Wrench;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Help Desk & Support": return "green";
      case "IT Services": return "blue";
      case "Industry-Specific Services": return "purple";
      case "Emergency Services": return "red";
      case "Managed Services": return "orange";
      default: return "blue";
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose Service Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.keys(SERVICE_CATALOG).map((category) => {
            const Icon = getCategoryIcon(category);
            const color = getCategoryColor(category);
            const isSelected = selectedCategory === category;

            return (
              <Card
                key={category}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected ? `ring-2 ring-${color}-500 shadow-lg` : ""
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`mx-auto mb-3 p-2 bg-${color}-100 rounded-full w-fit`}>
                    <Icon className={`h-6 w-6 text-${color}-600`} />
                  </div>
                  <h4 className="font-semibold text-sm">{category}</h4>
                  <Badge
                    variant={isSelected ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {SERVICE_CATALOG[category as keyof typeof SERVICE_CATALOG].length} services
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Service Selection */}
      {selectedCategory && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Services from {selectedCategory}</h3>
          <div className="grid gap-4">
            {SERVICE_CATALOG[selectedCategory as keyof typeof SERVICE_CATALOG].map((service) => {
              const isSelected = selectedServices.some(s => s.serviceName === service.name);
              const selectedService = selectedServices.find(s => s.serviceName === service.name);
              
              // Debug: Log the checkbox state
              console.log(`Service: ${service.name}, isSelected: ${isSelected}, selectedServices count: ${selectedServices.length}`);

              return (
                <Card key={service.name} className={isSelected ? "ring-2 ring-blue-500" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            console.log(`Checkbox changed for ${service.name}:`, checked, 'Current isSelected:', isSelected);
                            handleServiceToggle(service, !!checked);
                          }}
                          className="mt-1"
                          id={`service-${service.name.replace(/\s+/g, '-').toLowerCase()}`}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{service.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {formatPrice(service.basePrice)} {getPriceTypeLabel(service.priceType, (service as any).unit)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(service.name, -1)}
                            disabled={selectedService?.quantity === 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-semibold min-w-[2rem] text-center">
                            {selectedService?.quantity || 1}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(service.name, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Services Summary */}
      {selectedServices.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">Selected Services Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedServices.map((service) => (
                <div key={service.serviceName} className="flex justify-between items-center">
                  <span className="font-medium">{service.serviceName}</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">
                      {service.quantity} × {formatPrice(service.basePrice)}
                    </span>
                    <div className="font-semibold">
                      {formatPrice(service.basePrice * service.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Organization Info
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedCategory || selectedServices.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Continue to Project Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}