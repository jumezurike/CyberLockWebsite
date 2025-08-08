import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  email: string;
  fullName?: string;
  role: string;
  companyName?: string;
  phone?: string;
}

interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  companyName?: string;
  serviceRequestId?: number;
}

interface EmailVerificationData {
  token: string;
  email: string;
}

interface MfaVerificationData {
  code: string;
  email: string;
}

interface LoginData {
  email: string;
  password: string;
}

export function useClientAuth() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/client/auth/user'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationData) => {
      return apiRequest('POST', '/api/client/auth/register', data);
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Please check your email for verification instructions.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Email verification mutation
  const verifyEmailMutation = useMutation({
    mutationFn: async (data: EmailVerificationData) => {
      return apiRequest('POST', '/api/client/auth/verify-email', data);
    },
    onSuccess: () => {
      toast({
        title: "Email Verified",
        description: "Please enter the MFA code sent to your email.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Email Verification Failed",
        description: error.message || "Invalid or expired verification token.",
        variant: "destructive",
      });
    },
  });

  // MFA verification mutation
  const verifyMfaMutation = useMutation({
    mutationFn: async (data: MfaVerificationData) => {
      return apiRequest('POST', '/api/client/auth/verify-mfa', data);
    },
    onSuccess: () => {
      toast({
        title: "Account Activated",
        description: "Welcome to CyberLockX! Your account is now active.",
      });
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['/api/client/auth/user'] });
    },
    onError: (error: any) => {
      toast({
        title: "MFA Verification Failed",
        description: error.message || "Invalid or expired verification code.",
        variant: "destructive",
      });
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      return apiRequest('POST', '/api/client/auth/login', data);
    },
    onSuccess: () => {
      toast({
        title: "Login Successful",
        description: "Welcome back to CyberLockX!",
      });
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['/api/client/auth/user'] });
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/client/auth/logout', {});
    },
    onSuccess: () => {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      // Clear user data from cache
      queryClient.setQueryData(['/api/client/auth/user'], null);
      queryClient.invalidateQueries({ queryKey: ['/api/client/auth/user'] });
    },
    onError: (error: any) => {
      toast({
        title: "Logout Failed",
        description: error.message || "Failed to logout. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    // User state
    user,
    isLoading,
    isAuthenticated: !!user,

    // Registration
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registrationError: registerMutation.error,

    // Email verification
    verifyEmail: verifyEmailMutation.mutate,
    isVerifyingEmail: verifyEmailMutation.isPending,
    emailVerificationError: verifyEmailMutation.error,

    // MFA verification
    verifyMfa: verifyMfaMutation.mutate,
    isVerifyingMfa: verifyMfaMutation.isPending,
    mfaVerificationError: verifyMfaMutation.error,

    // Login
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    // Logout
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    logoutError: logoutMutation.error,
  };
}