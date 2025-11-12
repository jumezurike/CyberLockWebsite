import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  ArrowLeft
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
  const [searchEmail, setSearchEmail] = useState("");

  const { data: requests, isLoading, error } = useQuery<ServiceRequest[]>({
    queryKey: ["/api/customer/service-requests", searchEmail],
    enabled: !!searchEmail,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSearchEmail(email.trim());
    }
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
          <h1 className="text-4xl font-bold mb-2">Track Your Service Requests</h1>
          <p className="text-blue-100">Enter your email to view the status of your submitted service requests</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Your Requests
            </CardTitle>
            <CardDescription>
              Enter the email address you used when submitting your service request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-search-email"
                />
              </div>
              <Button type="submit" disabled={!email.trim()} data-testid="button-search-requests">
                <Search className="h-4 w-4 mr-2" />
                Search Requests
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-muted-foreground">Searching for your requests...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <p>Unable to fetch your requests. Please try again.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {searchEmail && !isLoading && requests && requests.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Requests Found</h3>
                <p className="text-muted-foreground">
                  No service requests found for <strong>{searchEmail}</strong>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please check your email address or submit a new service request.
                </p>
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
              <p className="text-sm text-muted-foreground">
                Showing results for: <strong>{searchEmail}</strong>
              </p>
            </div>

            {requests.map((request: any) => (
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
                        {request.selectedServices.map((service: any, index: number) => (
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
