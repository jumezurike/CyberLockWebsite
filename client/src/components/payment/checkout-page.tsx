import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkout-form";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

// Load Stripe outside of component render to avoid recreating instance on each render
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

interface CheckoutPageProps {
  planId: string;
  planName: string;
  amount: string;
  addons?: Array<{id: string; label: string; price: string}>;
  basePlanPrice?: string;
  monthlyInfraCost?: string;
  monthlyAddonsTotal?: string;
  oneTimeAddonsTotal?: string;
  annualAdminFee?: string;
  billingPeriod?: string;
  serverCount?: string;
  endpointCount?: string;
  appCount?: string;
  customerInfo?: {
    email: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
  };
}

export default function CheckoutPage({ 
  planId, 
  planName, 
  amount, 
  addons = [],
  basePlanPrice = "0",
  monthlyInfraCost = "0", 
  monthlyAddonsTotal = "0",
  oneTimeAddonsTotal = "0",
  annualAdminFee = "0",
  billingPeriod = "monthly",
  serverCount = "0",
  endpointCount = "0",
  appCount = "0",
  customerInfo
}: CheckoutPageProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBillingPeriod, setCurrentBillingPeriod] = useState(billingPeriod);
  const [currentAmount, setCurrentAmount] = useState(amount);
  const [, setLocation] = useLocation();

  // Recalculate total when billing period changes
  const recalculateTotal = (newBillingPeriod: string) => {
    const basePlan = parseFloat(basePlanPrice);
    const monthlyInfra = parseFloat(monthlyInfraCost);
    const monthlyAddons = parseFloat(monthlyAddonsTotal);
    const oneTimeAddons = parseFloat(oneTimeAddonsTotal);
    const adminFee = parseFloat(annualAdminFee);
    
    let newTotal;
    if (newBillingPeriod === "yearly") {
      const yearlyDiscount = 0.9;
      const discountedYearlyPlan = basePlan * yearlyDiscount * 12;
      const discountedYearlyInfra = monthlyInfra * yearlyDiscount * 12;
      const discountedYearlyAddons = monthlyAddons * yearlyDiscount * 12;
      newTotal = (discountedYearlyPlan + discountedYearlyInfra + discountedYearlyAddons + oneTimeAddons + adminFee).toFixed(2);
    } else {
      // Monthly billing: Initial payment includes annual admin fee upfront, then monthly recurring without admin fee
      // This calculation is for the initial payment only (includes AMF)
      newTotal = (basePlan + monthlyInfra + monthlyAddons + oneTimeAddons + adminFee).toFixed(2);
    }
    
    return newTotal;
  };

  // Calculate monthly recurring amount (without admin fee for subsequent payments)
  const getMonthlyRecurringAmount = () => {
    const basePlan = parseFloat(basePlanPrice);
    const monthlyInfra = parseFloat(monthlyInfraCost);
    const monthlyAddons = parseFloat(monthlyAddonsTotal);
    return (basePlan + monthlyInfra + monthlyAddons).toFixed(2);
  };

  const handleBillingPeriodChange = async (newPeriod: "monthly" | "yearly") => {
    setCurrentBillingPeriod(newPeriod);
    const newAmount = recalculateTotal(newPeriod);
    setCurrentAmount(newAmount);
    
    // Create new subscription with updated billing period
    try {
      setIsLoading(true);
      if (!customerInfo) {
        throw new Error("Customer information is required");
      }
      
      const response = await apiRequest("POST", "/api/create-subscription", {
        planId,
        planName,
        email: customerInfo.email,
        firstName: customerInfo.firstName || '',
        lastName: customerInfo.lastName || '',
        companyName: customerInfo.companyName || '',
        amount: newAmount,
        billingPeriod: newPeriod,
        basePlanPrice,
        monthlyInfraCost,
        monthlyAddonsTotal,
        oneTimeAddonsTotal,
        annualAdminFee,
        serverCount,
        endpointCount,
        appCount,
        oneTimeFees: [{
          type: 'admin',
          amount: parseFloat(annualAdminFee || "0"),
          description: 'Annual Management Fee'
        }],
        monthlyAddons: [{
          name: 'Infrastructure Monitoring',
          amount: parseFloat(monthlyInfraCost || "0"),
          quantity: 1
        }]
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error updating subscription:", error);
      setError(error instanceof Error ? error.message : "Failed to update subscription");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if Stripe is available before creating payment intent
    if (!stripePromise) {
      setError("Payment processing is not available. Please contact support.");
      setIsLoading(false);
      return;
    }

    // Create subscription as soon as the page loads
    const createSubscription = async () => {
      try {
        setIsLoading(true);
        if (!customerInfo) {
          throw new Error("Customer information is required");
        }
        
        const response = await apiRequest("POST", "/api/create-subscription", {
          planId,
          planName,
          email: customerInfo.email,
          firstName: customerInfo.firstName || '',
          lastName: customerInfo.lastName || '',
          companyName: customerInfo.companyName || '',
          amount,
          billingPeriod: currentBillingPeriod,
          basePlanPrice,
          monthlyInfraCost,
          monthlyAddonsTotal,
          oneTimeAddonsTotal,
          annualAdminFee,
          serverCount,
          endpointCount,
          appCount,
          oneTimeFees: [{
            type: 'admin',
            amount: parseFloat(annualAdminFee || "0"),
            description: 'Annual Management Fee'
          }],
          monthlyAddons: [{
            name: 'Infrastructure Monitoring',
            amount: parseFloat(monthlyInfraCost || "0"),
            quantity: 1
          }]
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        setError(error instanceof Error ? error.message : "Failed to initialize payment");
      } finally {
        setIsLoading(false);
      }
    };

    createSubscription();
  }, [planId, amount, addons, customerInfo]);

  const handleCancel = () => {
    setLocation("/");
  };

  const handleSuccess = () => {
    setLocation("/payment-success");
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-neutral-600">Preparing secure checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 mb-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-2">Payment Setup Failed</h2>
          <p className="text-neutral-700 mb-4">{error}</p>
          <Button onClick={handleCancel}>Return to Homepage</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {clientSecret && stripePromise && (
        <Elements 
          stripe={stripePromise} 
          options={{ 
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#692abb',
                colorBackground: '#ffffff',
                colorText: '#30313d',
              }
            }
          }}
        >
          <CheckoutForm 
            amount={currentAmount} 
            planName={planName} 
            planId={planId}
            addons={addons}
            billingPeriod={currentBillingPeriod}
            basePlanPrice={basePlanPrice}
            monthlyInfraCost={monthlyInfraCost}
            monthlyAddonsTotal={monthlyAddonsTotal}
            oneTimeAddonsTotal={oneTimeAddonsTotal}
            annualAdminFee={annualAdminFee}
            oneTimeFees={[
              {
                type: 'admin',
                amount: parseFloat(annualAdminFee || "0"),
                description: 'Annual Management Fee'
              }
            ]}
            monthlyAddons={[
              {
                name: 'Infrastructure Monitoring',
                amount: parseFloat(monthlyInfraCost || "0"),
                quantity: 1
              }
            ]}
            customerInfo={customerInfo}
            onBillingPeriodChange={handleBillingPeriodChange}
            onCancel={handleCancel}
            onSuccess={handleSuccess}
          />
        </Elements>
      )}
    </div>
  );
}