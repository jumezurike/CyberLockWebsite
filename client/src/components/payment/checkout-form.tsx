import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
  amount: string;
  planName: string;
  addons?: Array<{id: string; label: string; price: string}>;
  billingPeriod?: string;
  basePlanPrice?: string;
  monthlyInfraCost?: string;
  monthlyAddonsTotal?: string;
  oneTimeAddonsTotal?: string;
  annualAdminFee?: string;
  onBillingPeriodChange?: (period: "monthly" | "yearly") => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CheckoutForm({ 
  amount, 
  planName, 
  addons = [], 
  billingPeriod = "monthly",
  basePlanPrice = "0",
  monthlyInfraCost = "0",
  monthlyAddonsTotal = "0",
  oneTimeAddonsTotal = "0",
  annualAdminFee = "0",
  onBillingPeriodChange,
  onSuccess, 
  onCancel 
}: CheckoutFormProps) {
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
        
        {/* Billing Period Toggle */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
            <button
              type="button"
              onClick={() => onBillingPeriodChange?.("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => onBillingPeriodChange?.("yearly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all relative ${
                billingPeriod === "yearly"
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                10% OFF
              </span>
            </button>
          </div>
        </div>
        {/* Payment Structure Notice */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Payment Structure:</strong> This initial payment includes your annual administrative fee. 
            Future monthly payments will only include recurring services (no additional admin fees).
          </p>
        </div>
        
        <div className="bg-neutral-50 p-4 rounded-md text-left">
          {/* Base plan cost - shown for clarity */}
          <div className="flex justify-between mb-2">
            <span className="font-medium">CyberLockX Connect{billingPeriod === 'yearly' ? ' (Annual)' : ''}:</span>
            <span>${billingPeriod === 'yearly' ? 
              (parseFloat(basePlanPrice) * 0.9 * 12).toFixed(2) : 
              parseFloat(basePlanPrice).toFixed(2)
            }</span>
          </div>
          <div className="text-xs text-neutral-500 mb-2 ml-2">
            Includes: Secure Cloud, Meet, Payment App, Digital ID, AI Language Support
          </div>
          
          {/* Monthly add-ons - shown separately for clarity */}
          <div className="flex justify-between mb-2 text-sm text-neutral-600">
            <span>Monthly Services{billingPeriod === 'yearly' ? ' (Annual)' : ''}:</span>
            <span>${billingPeriod === 'yearly' ? 
              (parseFloat(monthlyAddonsTotal) * 0.9 * 12).toFixed(2) : 
              parseFloat(monthlyAddonsTotal).toFixed(2)
            }</span>
          </div>
          {parseFloat(monthlyAddonsTotal) > 0 && (
            <div className="text-xs text-neutral-500 mb-2 ml-2">
              Additional cybersecurity services: Policy development, compliance reports, assessments
            </div>
          )}
          
          {/* Infrastructure cost - always show */}
          <div className="flex justify-between mb-2 text-sm text-neutral-600">
            <span>Infrastructure Monitoring{billingPeriod === 'yearly' ? ' (Annual)' : ''}:</span>
            <span>${billingPeriod === 'yearly' ? 
              (parseFloat(monthlyInfraCost) * 0.9 * 12).toFixed(2) : 
              parseFloat(monthlyInfraCost).toFixed(2)
            }</span>
          </div>
          {parseFloat(monthlyInfraCost) > 0 && (
            <div className="text-xs text-neutral-500 mb-2 ml-2">
              24/7 monitoring of servers, endpoints, and applications with automated threat response
            </div>
          )}
          
          {/* One-time add-ons - always show */}
          <div className="flex justify-between mb-2 text-sm text-neutral-600">
            <span>Optional Add-ons:</span>
            <span>${parseFloat(oneTimeAddonsTotal).toFixed(2)}</span>
          </div>
          {parseFloat(oneTimeAddonsTotal) > 0 && (
            <div className="text-xs text-neutral-500 mb-2 ml-2">
              One-time professional services and assessments
            </div>
          )}
          
          {/* Administrative fees */}
          <div className="flex justify-between mb-2 text-sm text-neutral-600 border-t pt-2 mt-2">
            <span><strong>Administrative & Maintenance Fee (Annual - One-Time Upfront)</strong>:</span>
            <span><strong>${parseFloat(annualAdminFee).toFixed(2)} (Annual)</strong></span>
          </div>
          <div className="text-xs text-neutral-500 mb-2 ml-2">
            One-time annual fee: Account setup, system maintenance, customer support, and regulatory compliance
          </div>
          
          {/* Show discount if yearly */}
          {billingPeriod === 'yearly' && (
            <div className="flex justify-between mb-2 text-sm text-green-600">
              <span>Annual Discount (10%):</span>
              <span>-${((
                parseFloat(basePlanPrice) * 12 + 
                parseFloat(monthlyInfraCost) * 12 + 
                parseFloat(monthlyAddonsTotal) * 12
              ) * 0.1).toFixed(2)}</span>
            </div>
          )}
          
          <div className="border-t border-neutral-200 my-2 pt-2"></div>
          
          {/* Total */}
          <div className="flex justify-between font-bold text-primary">
            <span>Total:</span>
            <span>${amount}</span>
          </div>
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