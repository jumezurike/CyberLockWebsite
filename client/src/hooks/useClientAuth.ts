import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { User, UserRegistration, EmailVerification, MfaVerification } from "@shared/schema";

export function useClientAuth() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current client user
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/client/auth/user"],
    retry: false,
  });

  // Register new client account
  const registerMutation = useMutation({
    mutationFn: async (userData: UserRegistration) => {
      return apiRequest("POST", "/api/client/auth/register", userData);
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Please check your email for verification instructions.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Verify email
  const verifyEmailMutation = useMutation({
    mutationFn: async (verificationData: EmailVerification) => {
      return apiRequest("POST", "/api/client/auth/verify-email", verificationData);
    },
    onSuccess: () => {
      toast({
        title: "Email Verified",
        description: "Please complete MFA verification.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Verify MFA
  const verifyMfaMutation = useMutation({
    mutationFn: async (mfaData: MfaVerification) => {
      return apiRequest("POST", "/api/client/auth/verify-mfa", mfaData);
    },
    onSuccess: () => {
      toast({
        title: "Account Activated",
        description: "Welcome to CyberLockX! You can now access your service dashboard.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/client/auth/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "MFA Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Login
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return apiRequest("POST", "/api/client/auth/login", credentials);
    },
    onSuccess: () => {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/client/auth/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/client/auth/logout");
    },
    onSuccess: () => {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      queryClient.clear();
    },
    onError: (error: Error) => {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    verifyEmail: verifyEmailMutation.mutate,
    isVerifyingEmail: verifyEmailMutation.isPending,
    verifyMfa: verifyMfaMutation.mutate,
    isVerifyingMfa: verifyMfaMutation.isPending,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}