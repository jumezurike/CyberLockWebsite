import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClientAuth } from '@/hooks/useClientAuth';
import { Loader2, Mail, Shield, CheckCircle } from 'lucide-react';

interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  companyName?: string;
  serviceRequestId?: number;
}

interface ClientRegistrationFormProps {
  serviceRequestId?: number;
  onSuccess?: () => void;
}

export default function ClientRegistrationForm({ serviceRequestId, onSuccess }: ClientRegistrationFormProps) {
  const [activeTab, setActiveTab] = useState('register');
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    companyName: '',
    serviceRequestId
  });
  
  const [emailVerification, setEmailVerification] = useState({
    token: '',
    email: ''
  });
  
  const [mfaVerification, setMfaVerification] = useState({
    code: '',
    email: ''
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const {
    register,
    isRegistering,
    verifyEmail,
    isVerifyingEmail,
    verifyMfa,
    isVerifyingMfa,
    login,
    isLoggingIn,
    isAuthenticated
  } = useClientAuth();

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    register(registrationData);
    setActiveTab('verify-email');
    setEmailVerification({ ...emailVerification, email: registrationData.email });
    setMfaVerification({ ...mfaVerification, email: registrationData.email });
  };

  const handleEmailVerification = (e: React.FormEvent) => {
    e.preventDefault();
    verifyEmail(emailVerification);
    setActiveTab('verify-mfa');
  };

  const handleMfaVerification = (e: React.FormEvent) => {
    e.preventDefault();
    verifyMfa(mfaVerification);
    if (onSuccess) onSuccess();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginData);
    if (onSuccess) onSuccess();
  };

  if (isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to CyberLockX!</h3>
          <p className="text-gray-600">Your account is active and ready to use.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        {/* Registration Tab */}
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Create Your Account</CardTitle>
              <CardDescription>
                Create a secure account to track your service request and access all documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegistration} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={registrationData.fullName}
                    onChange={(e) => setRegistrationData({
                      ...registrationData,
                      fullName: e.target.value
                    })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData({
                      ...registrationData,
                      email: e.target.value
                    })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={registrationData.phone}
                    onChange={(e) => setRegistrationData({
                      ...registrationData,
                      phone: e.target.value
                    })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={registrationData.password}
                    onChange={(e) => setRegistrationData({
                      ...registrationData,
                      password: e.target.value
                    })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={registrationData.companyName}
                    onChange={(e) => setRegistrationData({
                      ...registrationData,
                      companyName: e.target.value
                    })}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isRegistering}>
                  {isRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Login Tab */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Access your existing CyberLockX account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="loginEmail">Email Address</Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({
                      ...loginData,
                      email: e.target.value
                    })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="loginPassword">Password</Label>
                  <Input
                    id="loginPassword"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({
                      ...loginData,
                      password: e.target.value
                    })}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Verification Tab */}
        <TabsContent value="verify-email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Verify Your Email
              </CardTitle>
              <CardDescription>
                We've sent a verification link to {emailVerification.email}. 
                Please check your email and enter the verification token below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailVerification} className="space-y-4">
                <div>
                  <Label htmlFor="token">Verification Token</Label>
                  <Input
                    id="token"
                    type="text"
                    value={emailVerification.token}
                    onChange={(e) => setEmailVerification({
                      ...emailVerification,
                      token: e.target.value
                    })}
                    placeholder="Enter the token from your email"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isVerifyingEmail}>
                  {isVerifyingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify Email
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MFA Verification Tab */}
        <TabsContent value="verify-mfa">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Complete Security Verification
              </CardTitle>
              <CardDescription>
                Enter the 6-digit verification code we sent to {mfaVerification.email}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMfaVerification} className="space-y-4">
                <div>
                  <Label htmlFor="mfaCode">Verification Code</Label>
                  <Input
                    id="mfaCode"
                    type="text"
                    value={mfaVerification.code}
                    onChange={(e) => setMfaVerification({
                      ...mfaVerification,
                      code: e.target.value.replace(/\D/g, '').slice(0, 6)
                    })}
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-lg tracking-wider"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isVerifyingMfa}>
                  {isVerifyingMfa && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Activate Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}