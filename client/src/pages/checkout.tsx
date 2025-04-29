import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import CheckoutPage from "@/components/payment/checkout-page";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutRoute() {
  const [location] = useLocation();
  const [planInfo, setPlanInfo] = useState<{
    planId: string;
    planName: string;
    amount: string;
    addons: Array<{id: string; label: string; price: string}>;
  } | null>(null);

  useEffect(() => {
    // Parse query params from URL
    const params = new URLSearchParams(window.location.search);
    const planId = params.get("planId");
    const planName = params.get("planName");
    const amount = params.get("amount");
    const addonsParam = params.get("addons");
    
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
        addons
      });
    }
  }, [location]);

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
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <CheckoutPage
          planId={planInfo.planId}
          planName={planInfo.planName}
          amount={planInfo.amount}
          addons={planInfo.addons}
        />
      </div>
    </div>
  );
}