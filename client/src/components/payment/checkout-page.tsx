import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkout-form";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

// Load Stripe outside of component render to avoid recreating instance on each render
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error("Missing VITE_STRIPE_PUBLIC_KEY in environment variables");
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutPageProps {
  planId: string;
  planName: string;
  amount: string;
  addons?: Array<{id: string; price: string}>;
}

export default function CheckoutPage({ planId, planName, amount, addons = [] }: CheckoutPageProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest("POST", "/api/create-payment-intent", {
          planId,
          amount,
          addons
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

    createPaymentIntent();
  }, [planId, amount, addons]);

  const handleCancel = () => {
    navigate("/");
  };

  const handleSuccess = () => {
    navigate("/payment-success");
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
      {clientSecret && (
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
            amount={amount} 
            planName={planName} 
            onCancel={handleCancel}
            onSuccess={handleSuccess}
          />
        </Elements>
      )}
    </div>
  );
}