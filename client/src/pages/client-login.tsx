import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  Shield, 
  User, 
  ArrowRight, 
  CheckCircle, 
  Mail, 
  Phone,
  CreditCard 
} from 'lucide-react';
import ClientRegistrationForm from '@/components/auth/ClientRegistrationForm';
import { useClientAuth } from '@/hooks/useClientAuth';

export default function ClientLogin() {
  const { isAuthenticated, user } = useClientAuth();

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back, {user?.fullName}!</h1>
            <p className="text-gray-600">You're successfully logged into your CyberLockX client account.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Service Dashboard
                </CardTitle>
                <CardDescription>
                  Track your service requests, technician progress, and access all documentation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/client-dashboard">
                  <Button className="w-full">
                    Access Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your profile, security settings, and notification preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Manage Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Client Portal Access</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Secure access to your CyberLockX service tracking, technician communications, and security documentation.
          </p>
        </div>

        {/* Process Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl text-center">How Client Access Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Service Payment</h3>
                    <p className="text-gray-600 text-sm">Complete payment for your cybersecurity service through our portal.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Account Registration</h3>
                    <p className="text-gray-600 text-sm">Create your secure account using the form below.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Email Verification</h3>
                    <p className="text-gray-600 text-sm">Verify your email address for account security.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">MFA Authentication</h3>
                    <p className="text-gray-600 text-sm">Complete multi-factor authentication for enhanced security.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Dashboard Access</h3>
                    <p className="text-gray-600 text-sm">Access your service dashboard and track technician progress.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl text-center">What You Can Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-900">Real-time service tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-900">Assigned technician details</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-900">Direct technician communication</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-900">Work progress updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-900">Service reports and documentation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-900">Invoice and payment history</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Registration/Login Form */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Access Your Account</h2>
          <ClientRegistrationForm 
            onSuccess={() => window.location.href = '/client-dashboard'} 
          />
        </div>

        {/* Help Section */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              If you haven't received your verification email or need assistance with account setup, 
              please contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
              <Button variant="outline">
                <Phone className="mr-2 h-4 w-4" />
                Call Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}