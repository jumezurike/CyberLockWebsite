import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
  amount: string;
  planName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CheckoutForm({ amount, planName, onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(undefined);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message);
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast({
          title: "Payment Successful!",
          description: `Thank you for your purchase of ${planName}`,
        });
        
        // Notify the server about successful payment
        try {
          await fetch("/api/payment-success", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
          });
          
          if (onSuccess) {
            onSuccess();
          }
        } catch (serverError) {
          console.error("Error notifying server about successful payment:", serverError);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "System Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Secure Checkout</h2>
        <p className="text-neutral-500 mb-1">
          Secured by ECSMID Encryption Technology
        </p>
        <p className="text-lg font-semibold text-neutral-700 mb-2">
          {planName} Plan
        </p>
        <div className="bg-neutral-50 p-3 rounded-md">
          <p className="text-xl font-bold text-primary">
            Total: ${amount}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement />

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {errorMessage}
          </div>
        )}

        <div className="flex gap-3">
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1" 
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-primary hover:bg-primary/90" 
            disabled={isProcessing || !stripe || !elements}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Pay Securely</>
            )}
          </Button>
        </div>
        
        <div className="text-center text-sm text-neutral-500 mt-4">
          <p>Your payment information is encrypted with ECSMID technology.</p>
          <p>We never store your full card details on our servers.</p>
        </div>
      </form>
    </Card>
  );
}