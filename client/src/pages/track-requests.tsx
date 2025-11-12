import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Search, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ArrowLeft,
  Shield,
  KeyRound
} from "lucide-react";
import { Link } from "wouter";

interface ServiceRequest {
  id: number;
  status: string;
  urgencyLevel: string;
  createdAt: string;
  calculatedTotal: number;
  companyName: string;
  contactPersonName: string;
  contactPersonTitle?: string;
  primaryEmail: string;
  officePhone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  serviceCategory: string;
  selectedServices?: Array<{
    serviceName: string;
    basePrice: number;
    priceType: string;
  }>;
  projectDescription?: string;
  desiredStartDate?: string;
  desiredEndDate?: string;
}

export default function TrackRequests() {
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<'email' | 'otp' | 'verified'>('email');
  const { toast } = useToast();

  const requestOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      return await apiRequest('/api/customer/request-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
    onSuccess: () => {
      setStep('otp');
      toast({
        title: "Verification Code Sent",
        description: "Please check your email for the 6-digit verification code.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Code",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ email, otpCode }: { email: string; otpCode: string }) => {
      return await apiRequest('/api/customer/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otpCode }),
      });
    },
    onSuccess: () => {
      setStep('verified');
      queryClient.invalidateQueries({ queryKey: ['/api/customer/service-requests'] });
      toast({
        title: "Email Verified",
        description: "You can now view your service requests.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { data: requests, isLoading, error } = useQuery<ServiceRequest[]>({
    queryKey: ['/api/customer/service-requests'],
    enabled: step === 'verified',
  });

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      requestOtpMutation.mutate(email.trim());
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim()) {
      verifyOtpMutation.mutate({ email: email.trim(), otpCode: otpCode.trim() });
    }
  };

  const handleStartOver = () => {
    setEmail("");
    setOtpCode("");
    setStep('email');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
      pending: { variant: "secondary", icon: Clock },
      quoted: { variant: "outline", icon: DollarSign },
      approved: { variant: "default", icon: CheckCircle },
      in_progress: { variant: "default", icon: Package },
      dispatched: { variant: "default", icon: Package },
      completed: { variant: "default", icon: CheckCircle },
      cancelled: { variant: "destructive", icon: XCircle },
    };

    const config = statusConfig[status] || { variant: "outline" as const, icon: AlertCircle };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {status.replace(/_/g, " ").toUpperCase()}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyColors: Record<string, string> = {
      Critical: "bg-red-100 text-red-800 border-red-300",
      High: "bg-orange-100 text-orange-800 border-orange-300",
      Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Low: "bg-green-100 text-green-800 border-green-300",
    };

    return (
      <Badge variant="outline" className={urgencyColors[urgency] || ""}>
        {urgency}
      </Badge>
    );
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Link href="/services">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4" data-testid="button-back-to-services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Track Your Service Requests</h1>
          </div>
          <p className="text-blue-100">Secure access to your submitted service requests</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Step 1: Enter Email */}
        {step === 'email' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Enter Your Email
              </CardTitle>
              <CardDescription>
                Enter the email address you used when submitting your service request.
                We'll send you a verification code to confirm your identity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="your.email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="input-email"
                    className="text-lg"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!email.trim() || requestOtpMutation.isPending}
                  data-testid="button-request-code"
                >
                  {requestOtpMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Code...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Secure Verification</p>
                    <p className="text-blue-800">
                      For your security, we'll send a one-time verification code to your email.
                      This ensures only you can access your service request information.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Enter OTP */}
        {step === 'otp' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Enter Verification Code
              </CardTitle>
              <CardDescription>
                We've sent a 6-digit verification code to <strong>{email}</strong>.
                Please enter it below to access your service requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    data-testid="input-otp-code"
                    className="text-2xl text-center tracking-widest font-mono"
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={otpCode.length !== 6 || verifyOtpMutation.isPending}
                    data-testid="button-verify-code"
                  >
                    {verifyOtpMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify Code
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleStartOver}
                    data-testid="button-start-over"
                  >
                    Start Over
                  </Button>
                </div>
              </form>

              <div className="mt-6 space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-900">
                      <p className="font-semibold mb-1">Code expires in 10 minutes</p>
                      <p className="text-yellow-800">
                        Didn't receive the code? Check your spam folder or request a new one.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => requestOtpMutation.mutate(email)}
                  disabled={requestOtpMutation.isPending}
                  className="w-full"
                  data-testid="button-resend-code"
                >
                  {requestOtpMutation.isPending ? "Sending..." : "Resend Verification Code"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: View Requests */}
        {step === 'verified' && (
          <>
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-muted-foreground">Loading your requests...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card className="border-red-200 bg-red-50 max-w-2xl mx-auto">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    <p>Unable to fetch your requests. Please try again.</p>
                  </div>
                  <Button onClick={handleStartOver} className="mt-4">
                    Start Over
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* No Results */}
            {!isLoading && requests && requests.length === 0 && (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Requests Found</h3>
                    <p className="text-muted-foreground">
                      No service requests found for <strong>{email}</strong>
                    </p>
                    <Button onClick={handleStartOver} className="mt-4">
                      Search Different Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {requests && requests.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    Your Service Requests ({requests.length})
                  </h2>
                  <Button variant="outline" onClick={handleStartOver} data-testid="button-search-again">
                    Search Different Email
                  </Button>
                </div>

                {requests.map((request) => (
                  <Card key={request.id} className="overflow-hidden" data-testid={`card-request-${request.id}`}>
                    <CardHeader className="bg-slate-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">Request #{request.id}</CardTitle>
                            {getStatusBadge(request.status)}
                            {getUrgencyBadge(request.urgencyLevel)}
                          </div>
                          <CardDescription className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Submitted on {formatDate(request.createdAt)}
                          </CardDescription>
                        </div>
                        {request.calculatedTotal > 0 && (
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Estimated Cost</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {formatPrice(request.calculatedTotal)}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-6 space-y-6">
                      {/* Company & Contact Info */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Organization Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Company:</strong> {request.companyName}
                            </p>
                            <p>
                              <strong>Contact:</strong> {request.contactPersonName}
                            </p>
                            {request.contactPersonTitle && (
                              <p>
                                <strong>Title:</strong> {request.contactPersonTitle}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Contact Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {request.primaryEmail}
                            </p>
                            {request.officePhone && (
                              <p className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                {request.officePhone}
                              </p>
                            )}
                            {request.address && (
                              <p className="flex items-center gap-2">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                {request.address.city}, {request.address.state}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Service Details */}
                      <div>
                        <h4 className="font-semibold mb-3">Service Category</h4>
                        <Badge variant="outline" className="text-sm">
                          {request.serviceCategory}
                        </Badge>
                      </div>

                      {/* Selected Services */}
                      {request.selectedServices && request.selectedServices.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Selected Services</h4>
                          <ul className="space-y-2">
                            {request.selectedServices.map((service, index) => (
                              <li key={index} className="flex items-center justify-between text-sm bg-slate-50 p-3 rounded-lg">
                                <span>{service.serviceName}</span>
                                <span className="font-semibold text-blue-600">
                                  {formatPrice(service.basePrice)}
                                  {service.priceType === "hourly" && " /hr"}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Project Description */}
                      {request.projectDescription && (
                        <div>
                          <h4 className="font-semibold mb-3">Project Description</h4>
                          <p className="text-sm text-muted-foreground bg-slate-50 p-4 rounded-lg">
                            {request.projectDescription}
                          </p>
                        </div>
                      )}

                      {/* Timeline */}
                      {(request.desiredStartDate || request.desiredEndDate) && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Desired Timeline
                          </h4>
                          <div className="flex gap-6 text-sm">
                            {request.desiredStartDate && (
                              <div>
                                <p className="text-muted-foreground">Start Date</p>
                                <p className="font-semibold">{formatDate(request.desiredStartDate)}</p>
                              </div>
                            )}
                            {request.desiredEndDate && (
                              <div>
                                <p className="text-muted-foreground">End Date</p>
                                <p className="font-semibold">{formatDate(request.desiredEndDate)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Status Message */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-semibold text-blue-900 mb-1">Status Update</p>
                            <p className="text-sm text-blue-800">
                              {request.status === "pending" && "Your request has been received and is pending review by our team."}
                              {request.status === "quoted" && "We've prepared a quote for your request. You should receive it via email shortly."}
                              {request.status === "approved" && "Your request has been approved and will be scheduled soon."}
                              {request.status === "in_progress" && "Our team is actively working on your request."}
                              {request.status === "dispatched" && "A technician has been assigned and dispatched to your location."}
                              {request.status === "completed" && "Your service request has been completed successfully!"}
                              {request.status === "cancelled" && "This service request has been cancelled."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Help Section */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you have questions about your service request or need assistance, please contact us.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="mailto:info@cyberlockx.xyz" className="text-blue-600 hover:underline flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  info@cyberlockx.xyz
                </a>
                <span className="text-muted-foreground">|</span>
                <a href="tel:+18038087877" className="text-blue-600 hover:underline flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  (803) 808-7877
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
