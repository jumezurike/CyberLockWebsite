import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'wouter';
import { 
  Wrench, 
  Shield, 
  User, 
  ArrowRight, 
  CheckCircle, 
  Mail, 
  Phone,
  FileText,
  Clock,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function TechnicianLogin() {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/admin/login', loginData);
      toast({
        title: "Login Successful",
        description: "Welcome to the Technician Portal!",
      });
      setIsAuthenticated(true);
      window.location.href = '/technician';
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Technician Portal</h1>
            <p className="text-gray-600">You're successfully logged into the field technician system.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  Work Orders
                </CardTitle>
                <CardDescription>
                  View assigned work orders, update progress, and manage field activities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/technician">
                  <Button className="w-full">
                    Access Portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Service Reports
                </CardTitle>
                <CardDescription>
                  Complete service reports, upload documentation, and submit client signatures.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Reports
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Technician Portal Access</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Secure access for certified CyberLockX field technicians to manage work orders, 
            track service progress, and maintain client communications.
          </p>
        </div>

        {/* Process Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl text-center">Technician Access Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Credential Verification</h3>
                    <p className="text-gray-600 text-sm">Use your assigned technician credentials provided by CyberLockX administration.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Work Order Assignment</h3>
                    <p className="text-gray-600 text-sm">Access assigned work orders based on location and specialization.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Field Service Tracking</h3>
                    <p className="text-gray-600 text-sm">Real-time tracking of arrival, departure, and work progress.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Report Submission</h3>
                    <p className="text-gray-600 text-sm">Complete service reports with client signatures and documentation.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl text-center">Portal Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Wrench className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-900">Work order management</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-900">Time tracking and reporting</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-900">Client communication tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-900">Digital service report creation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-900">Secure file upload system</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-900">Electronic signature capture</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Login Form */}
        <div className="max-w-md mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Technician Login</CardTitle>
              <CardDescription className="text-center">
                Enter your assigned technician credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({
                      ...loginData,
                      username: e.target.value
                    })}
                    placeholder="Enter your technician username"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({
                      ...loginData,
                      password: e.target.value
                    })}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Access Technician Portal
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className="max-w-2xl mx-auto border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Important Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-700">
              Technician access is restricted to authorized CyberLockX field personnel only. 
              All activities are logged and monitored for security and quality assurance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Contact Admin
              </Button>
              <Button variant="outline">
                <Phone className="mr-2 h-4 w-4" />
                Support Line
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}