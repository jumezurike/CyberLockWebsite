import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import CheckoutPage from "@/components/payment/checkout-page";
import { ArrowLeft, User, Mail, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutRoute() {
  const [location] = useLocation();
  const [planInfo, setPlanInfo] = useState<{
    planId: string;
    planName: string;
    amount: string;
    addons: Array<{id: string; label: string; price: string}>;
    basePlanPrice: string;
    monthlyInfraCost: string;
    monthlyAddonsTotal: string;
    oneTimeAddonsTotal: string;
    annualAdminFee: string;
    billingPeriod: string;
    serverCount: string;
    endpointCount: string;
    appCount: string;
  } | null>(null);

  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    companyName: ''
  });
  
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Parse query params from URL
    const params = new URLSearchParams(window.location.search);
    const planId = params.get("planId");
    const planName = params.get("planName");
    const amount = params.get("amount");
    const addonsParam = params.get("addons");
    const basePlanPrice = params.get("basePlanPrice") || "0";
    const monthlyInfraCost = params.get("monthlyInfraCost") || "0";
    const monthlyAddonsTotal = params.get("monthlyAddonsTotal") || "0";
    const oneTimeAddonsTotal = params.get("oneTimeAddonsTotal") || "0";
    const annualAdminFee = params.get("annualAdminFee") || "0";
    const billingPeriod = params.get("billingPeriod") || "monthly";
    const serverCount = params.get("serverCount") || "0";
    const endpointCount = params.get("endpointCount") || "0";
    const appCount = params.get("appCount") || "0";
    
    // If we have the required params, set them in state
    if (planId && planName && amount) {
      let addons: Array<{id: string; label: string; price: string}> = [];
      
      if (addonsParam) {
        try {
          addons = JSON.parse(decodeURIComponent(addonsParam));
        } catch (e) {
          console.error("Error parsing addons", e);
        }
      }
      
      setPlanInfo({
        planId,
        planName,
        amount,
        addons,
        basePlanPrice,
        monthlyInfraCost,
        monthlyAddonsTotal,
        oneTimeAddonsTotal,
        annualAdminFee,
        billingPeriod,
        serverCount,
        endpointCount,
        appCount
      });
    }
  }, [location]);

  const validateCustomerInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!customerInfo.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!customerInfo.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!customerInfo.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomerInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCustomerInfo()) {
      setStep('payment');
    }
  };

  const handleInputChange = (field: keyof typeof customerInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!planInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-neutral-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Checkout Information Missing</h1>
          <p className="text-neutral-600 mb-6">
            The checkout information is incomplete. Please select a plan from our pricing page.
          </p>
          <Button asChild className="w-full">
            <a href="/#pricing">View Pricing Plans</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-neutral-600 hover:text-primary" 
            onClick={() => step === 'payment' ? setStep('info') : window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {step === 'payment' ? 'Back to Customer Info' : 'Back'}
          </Button>
        </div>

        {step === 'info' ? (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary mb-2">Customer Information</h1>
                <p className="text-neutral-600">
                  Please provide your information to complete your subscription to {planInfo.planName}.
                </p>
              </div>

              <form onSubmit={handleCustomerInfoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={handleInputChange('firstName')}
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={handleInputChange('lastName')}
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={handleInputChange('email')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="companyName" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Company Name (Optional)
                  </Label>
                  <Input
                    id="companyName"
                    value={customerInfo.companyName}
                    onChange={handleInputChange('companyName')}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Continue to Payment
                </Button>
              </form>
            </Card>
          </div>
        ) : (
          <CheckoutPage
            planId={planInfo.planId}
            planName={planInfo.planName}
            amount={planInfo.amount}
            addons={planInfo.addons}
            basePlanPrice={planInfo.basePlanPrice}
            monthlyInfraCost={planInfo.monthlyInfraCost}
            monthlyAddonsTotal={planInfo.monthlyAddonsTotal}
            oneTimeAddonsTotal={planInfo.oneTimeAddonsTotal}
            annualAdminFee={planInfo.annualAdminFee}
            billingPeriod={planInfo.billingPeriod}
            serverCount={planInfo.serverCount}
            endpointCount={planInfo.endpointCount}
            appCount={planInfo.appCount}
            customerInfo={customerInfo}
          />
        )}
      </div>
    </div>
  );
}