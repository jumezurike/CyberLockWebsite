import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ArrowLeft, DollarSign, Calculator, TrendingUp, AlertCircle } from "lucide-react";

interface PricingStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function PricingStep({ data, onUpdate, onNext, onPrev }: PricingStepProps) {
  // Calculate pricing based on selected services
  const calculatePricing = React.useMemo(() => {
    let subtotal = 0;
    let hourlyEstimate = 0;
    let siteVisitFee = 0;
    const breakdown: Record<string, number> = {};

    data.selectedServices?.forEach((service: any) => {
      let serviceTotal = service.basePrice * service.quantity;
      
      // Add one-time $75 non-refundable site visit fee for any on-site services
      if (service.priceType === "hourly") {
        hourlyEstimate += service.quantity;
      }
      
      subtotal += serviceTotal;
      breakdown[service.serviceName] = serviceTotal;
    });

    // Add one-time site visit fee if any hourly services are selected
    const hasOnSiteServices = data.selectedServices?.some((service: any) => service.priceType === "hourly");
    if (hasOnSiteServices) {
      siteVisitFee = 7500; // One-time $75 non-refundable fee
    }

    // Apply urgency multiplier
    let urgencyMultiplier = 1;
    let urgencyFee = 0;
    
    switch (data.urgencyLevel) {
      case "Critical":
        urgencyMultiplier = 1.5;
        urgencyFee = subtotal * 0.5;
        break;
      case "High":
        urgencyMultiplier = 1.25;
        urgencyFee = subtotal * 0.25;
        break;
      case "Medium":
        urgencyMultiplier = 1;
        urgencyFee = 0;
        break;
      case "Low":
        urgencyMultiplier = 0.9;
        urgencyFee = -subtotal * 0.1; // Discount for low priority
        break;
    }

    // Apply complexity factors based on project description length and services count
    let complexityMultiplier = 1;
    if (data.selectedServices?.length > 5) {
      complexityMultiplier = 1.15;
    }
    if (data.projectDescription?.length > 1000) {
      complexityMultiplier *= 1.1;
    }

    const baseTotal = subtotal + siteVisitFee;
    const total = Math.round(baseTotal * urgencyMultiplier * complexityMultiplier);

    return {
      subtotal,
      siteVisitFee,
      urgencyFee,
      complexityFee: Math.round(baseTotal * (complexityMultiplier - 1)),
      total,
      breakdown,
      hourlyEstimate,
      urgencyMultiplier,
      complexityMultiplier,
    };
  }, [data.selectedServices, data.urgencyLevel, data.projectDescription]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  const handleContinue = () => {
    onUpdate({
      calculatedTotal: calculatePricing.total,
      pricingBreakdown: calculatePricing.breakdown,
      hourlyRateEstimate: calculatePricing.hourlyEstimate,
    });
    onNext();
  };

  const getUrgencyBadgeColor = (level: string) => {
    switch (level) {
      case "Critical": return "destructive";
      case "High": return "secondary";
      case "Medium": return "outline";
      case "Low": return "default";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Cost Breakdown
          </CardTitle>
          <CardDescription>
            Detailed pricing estimate for your selected services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Service Items */}
          <div className="space-y-3">
            {data.selectedServices?.map((service: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{service.serviceName}</div>
                  <div className="text-sm text-gray-600">
                    {service.quantity} × {formatPrice(service.basePrice)}
                    {service.priceType === "hourly" && " per hour"}
                    {service.priceType === "per_unit" && service.unit && ` per ${service.unit}`}
                  </div>
                </div>
                <div className="font-semibold">
                  {formatPrice(service.basePrice * service.quantity)}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="font-medium">Services Subtotal</span>
            <span className="font-semibold">{formatPrice(calculatePricing.subtotal)}</span>
          </div>

          {/* Site Visit Fee */}
          {calculatePricing.siteVisitFee > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-medium">Site Visit Fee</span>
                <Badge variant="outline" className="text-xs">
                  $75 Non-Refundable per site visit
                </Badge>
              </div>
              <span className="font-semibold text-blue-600">
                +{formatPrice(calculatePricing.siteVisitFee)}
              </span>
            </div>
          )}

          {/* Urgency Adjustment */}
          {calculatePricing.urgencyFee !== 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-medium">Urgency Adjustment</span>
                <Badge variant={getUrgencyBadgeColor(data.urgencyLevel)}>
                  {data.urgencyLevel}
                </Badge>
              </div>
              <span className={`font-semibold ${calculatePricing.urgencyFee > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {calculatePricing.urgencyFee > 0 ? '+' : ''}{formatPrice(calculatePricing.urgencyFee)}
              </span>
            </div>
          )}

          {/* Complexity Adjustment */}
          {calculatePricing.complexityFee > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-medium">Complexity Adjustment</span>
                <Badge variant="outline">Multi-service</Badge>
              </div>
              <span className="font-semibold text-blue-600">
                +{formatPrice(calculatePricing.complexityFee)}
              </span>
            </div>
          )}

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center text-lg">
            <span className="font-bold">Estimated Total</span>
            <span className="font-bold text-blue-600">{formatPrice(calculatePricing.total)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Project Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Project Summary
          </CardTitle>
          <CardDescription>Overview of your service request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Organization</Label>
              <div className="font-semibold">{data.companyName}</div>
              <div className="text-sm text-gray-600">{data.contactPersonName}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Service Category</Label>
              <div className="font-semibold">{data.serviceCategory}</div>
              <Badge variant="outline" className="mt-1">
                {data.selectedServices?.length} service(s)
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Timeline</Label>
              <div className="font-semibold">
                {data.desiredStartDate ? 
                  `${new Date(data.desiredStartDate).toLocaleDateString()} - ${new Date(data.desiredEndDate).toLocaleDateString()}` :
                  "Not specified"
                }
              </div>
              {data.flexibleDates && (
                <Badge variant="secondary" className="text-xs mt-1">Flexible</Badge>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Priority Level</Label>
              <div className="flex items-center gap-2">
                <Badge variant={getUrgencyBadgeColor(data.urgencyLevel)}>
                  {data.urgencyLevel}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">Important Pricing Information</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• This is an initial estimate based on your requirements</li>
                <li>• Final pricing will be confirmed after detailed project analysis</li>
                <li>• Hourly services may vary based on actual time requirements</li>
                <li>• Complex integrations may require additional consultation</li>
                <li>• All prices include initial consultation and project planning</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Terms Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <div className="font-semibold text-lg">30%</div>
              <div className="text-sm text-gray-600">Project Initiation</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatPrice(calculatePricing.total * 0.3)}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-semibold text-lg">40%</div>
              <div className="text-sm text-gray-600">Milestone Achievement</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatPrice(calculatePricing.total * 0.4)}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-semibold text-lg">30%</div>
              <div className="text-sm text-gray-600">Project Completion</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatPrice(calculatePricing.total * 0.3)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Scheduling
        </Button>
        <Button onClick={handleContinue} className="bg-blue-600 hover:bg-blue-700 text-white">
          Continue to Approval
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}