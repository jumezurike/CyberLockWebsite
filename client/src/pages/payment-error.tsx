import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-primary mb-4">Payment Failed</h1>
        
        <p className="text-lg text-neutral-700 mb-6">
          We encountered an issue processing your payment. No charges have been made to your account.
        </p>
        
        <div className="border-t border-neutral-200 pt-6 mt-6">
          <p className="font-semibold text-neutral-700 mb-4">Common reasons for payment failure:</p>
          <ul className="text-left text-neutral-600 space-y-2 mb-6">
            <li>• Insufficient funds in your account</li>
            <li>• Incorrect card information</li>
            <li>• Transaction declined by your bank</li>
            <li>• Temporary technical issues</li>
          </ul>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/checkout">Try Again</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Return to Home</Link>
          </Button>
          <p className="text-sm text-neutral-500 mt-4">
            If you continue experiencing issues, please contact our support team at support@cyberlockx.xyz
          </p>
        </div>
      </div>
    </div>
  );
}