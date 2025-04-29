import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const [, setLocation] = useLocation();

  // This effect should run if the user navigates directly to this page without completing a payment
  useEffect(() => {
    // Get URL search params - this would contain the payment_intent and payment_intent_client_secret
    // If stripe redirected here
    const searchParams = new URLSearchParams(window.location.search);
    const paymentIntent = searchParams.get("payment_intent");
    const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret");

    // If we have a payment intent, we should call the server to verify it
    if (paymentIntent && paymentIntentClientSecret) {
      fetch("/api/payment-success", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentIntentId: paymentIntent }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Payment verification failed");
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Error verifying payment:", error);
          // If verification fails, redirect to an error page
          setLocation("/payment-error");
        });
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-primary mb-4">Payment Successful!</h1>
        
        <p className="text-lg text-neutral-700 mb-6">
          Thank you for your purchase. Your transaction has been completed securely with ECSMID encryption technology.
        </p>
        
        <div className="border-t border-neutral-200 pt-6 mt-6">
          <p className="font-semibold text-neutral-700 mb-4">What happens next?</p>
          <ul className="text-left text-neutral-600 space-y-2 mb-6">
            <li>• You'll receive a confirmation email with your purchase details</li>
            <li>• Your account will be upgraded immediately</li>
            <li>• Our team will reach out within 24 hours to assist with onboarding</li>
          </ul>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}