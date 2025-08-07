import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Wrench, Brain, Shield, Users, Plus, Minus } from "lucide-react";

const SERVICE_CATALOG = {
  "IT Services": [
    { name: "Network Setup & Configuration", basePrice: 150000, priceType: "fixed", description: "Complete network infrastructure setup" },
    { name: "Server Installation & Maintenance", basePrice: 12500, priceType: "hourly", description: "Professional server deployment and ongoing maintenance" },
    { name: "Desktop/Laptop Support", basePrice: 8500, priceType: "hourly", description: "End-user device support and troubleshooting" },
    { name: "Cloud Migration Services", basePrice: 200000, priceType: "fixed", description: "Migrate your infrastructure to cloud platforms" },
    { name: "Data Backup Solutions", basePrice: 10000, priceType: "hourly", description: "Implement comprehensive backup strategies" },
    { name: "Cable Drop Installation", basePrice: 15000, priceType: "per_unit", unit: "drop", description: "Professional cable drop installation" },
  ],
  "AI Solutions": [
    { name: "AI Strategy Consulting", basePrice: 15000, priceType: "hourly", description: "Strategic AI implementation planning" },
    { name: "Machine Learning Model Development", basePrice: 250000, priceType: "fixed", description: "Custom ML model development and training" },
    { name: "Process Automation", basePrice: 175000, priceType: "fixed", description: "Automate repetitive business processes" },
    { name: "Chatbot Development", basePrice: 125000, priceType: "fixed", description: "Custom conversational AI solutions" },
    { name: "Data Analytics Solutions", basePrice: 18000, priceType: "hourly", description: "Advanced data analysis and visualization" },
    { name: "AI Integration Services", basePrice: 13500, priceType: "hourly", description: "Integrate AI capabilities into existing systems" },
  ],
  "Cybersecurity": [
    { name: "Security Assessment (HOS²A)", basePrice: 75000, priceType: "fixed", description: "Comprehensive security posture analysis" },
    { name: "Penetration Testing", basePrice: 125000, priceType: "fixed", description: "Ethical hacking and vulnerability assessment" },
    { name: "Security Training", basePrice: 12000, priceType: "hourly", description: "Employee cybersecurity awareness training" },
    { name: "Incident Response", basePrice: 20000, priceType: "hourly", description: "24/7 security incident response services" },
    { name: "Compliance Consulting", basePrice: 16500, priceType: "hourly", description: "GDPR, HIPAA, SOX compliance guidance" },
    { name: "Security Monitoring", basePrice: 85000, priceType: "fixed", description: "Continuous security monitoring and alerting" },
  ],
  "Combined Services": [
    { name: "Digital Transformation Package", basePrice: 500000, priceType: "fixed", description: "Complete digital transformation initiative" },
    { name: "Smart Office Setup", basePrice: 350000, priceType: "fixed", description: "AI-powered smart office infrastructure" },
    { name: "Secure Cloud Migration", basePrice: 300000, priceType: "fixed", description: "Security-focused cloud migration with AI optimization" },
    { name: "Enterprise Security Suite", basePrice: 400000, priceType: "fixed", description: "Complete security solution with AI threat detection" },
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
    priceType: "fixed" | "hourly" | "per_unit";
    unit?: string;
  }>>(data.selectedServices || []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedServices([]); // Clear selected services when category changes
  };

  const handleServiceToggle = (service: any, checked: boolean) => {
    if (checked) {
      setSelectedServices(prev => [...prev, { ...service, quantity: 1 }]);
    } else {
      setSelectedServices(prev => prev.filter(s => s.serviceName !== service.name));
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
      case "hourly": return "Per Hour";
      case "per_unit": return unit ? `Per ${unit}` : "Per Unit";
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
      case "IT Services": return Wrench;
      case "AI Solutions": return Brain;
      case "Cybersecurity": return Shield;
      case "Combined Services": return Users;
      default: return Wrench;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "IT Services": return "blue";
      case "AI Solutions": return "purple";
      case "Cybersecurity": return "red";
      case "Combined Services": return "green";
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

              return (
                <Card key={service.name} className={isSelected ? "ring-2 ring-blue-500" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleServiceToggle(service, !!checked)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{service.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {formatPrice(service.basePrice)} {getPriceTypeLabel(service.priceType, service.unit)}
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