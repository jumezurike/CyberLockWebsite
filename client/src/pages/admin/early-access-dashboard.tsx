import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Users, Mail, Building, Phone, Calendar, Target, AlertCircle, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface EarlyAccessSubmission {
  id: number;
  fullName: string;
  email: string;
  company: string;
  phone?: string;
  companySize?: string;
  industry?: string;
  interestedIn: string[];
  investmentLevel?: string;
  additionalInfo?: string;
  status: string;
  createdAt: string;
}

export default function EarlyAccessDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState<EarlyAccessSubmission | null>(null);
  const [emailAlertSent, setEmailAlertSent] = useState(false);

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["/api/early-access/submissions"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/early-access/submissions/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/early-access/submissions"] });
      toast({
        title: "Status Updated",
        description: "Submission status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const deleteSubmissionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/early-access/submissions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/early-access/submissions"] });
      toast({
        title: "Submission Deleted",
        description: "Rejected application has been permanently removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete submission",
        variant: "destructive",
      });
    },
  });

  // Check for new submissions and show alert
  useEffect(() => {
    if (submissions.length > 0 && !emailAlertSent) {
      const recentSubmissions = submissions.filter((sub: EarlyAccessSubmission) => {
        const submissionTime = new Date(sub.createdAt).getTime();
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        return submissionTime > oneHourAgo && sub.status === 'pending';
      });

      if (recentSubmissions.length > 0) {
        toast({
          title: "🚨 New Partnership Applications!",
          description: `${recentSubmissions.length} new applications received. Email notifications sent to info@cyberlockx.xyz`,
          duration: 10000,
        });
        setEmailAlertSent(true);
      }
    }
  }, [submissions, emailAlertSent, toast]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInvestmentLevelColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'strategic': return 'bg-purple-100 text-purple-800';
      case 'innovator': return 'bg-blue-100 text-blue-800';
      case 'explorer': return 'bg-green-100 text-green-800';
      case 'undecided': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pendingSubmissions = submissions.filter((sub: EarlyAccessSubmission) => sub.status === 'pending');
  const totalSubmissions = submissions.length;
  const recentSubmissions = submissions.filter((sub: EarlyAccessSubmission) => {
    const submissionTime = new Date(sub.createdAt).getTime();
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    return submissionTime > oneWeekAgo;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Early Access Dashboard</h1>
          <p className="text-gray-600">Manage partnership applications and early access requests</p>
          
          {/* Email Alert Notice */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-900">Email Notifications Active</p>
                <p className="text-sm text-blue-700">All new applications automatically send alerts to <strong>info@cyberlockx.xyz</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">All time submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingSubmissions.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentSubmissions.length}</div>
              <p className="text-xs text-muted-foreground">New submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email Status</CardTitle>
              <Mail className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground">Notifications working</p>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Partnership Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.map((submission: EarlyAccessSubmission) => (
                <div key={submission.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{submission.fullName}</h3>
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                        {submission.investmentLevel && (
                          <Badge variant="outline" className={getInvestmentLevelColor(submission.investmentLevel)}>
                            {submission.investmentLevel}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {submission.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {submission.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(submission.createdAt)}
                        </div>
                      </div>

                      {submission.interestedIn && submission.interestedIn.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">Interested in: </span>
                          <span className="text-sm">{submission.interestedIn.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Application Details - {selectedSubmission?.fullName}</DialogTitle>
                          </DialogHeader>
                          {selectedSubmission && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Full Name</label>
                                  <p className="text-sm text-gray-600">{selectedSubmission.fullName}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Email</label>
                                  <p className="text-sm text-gray-600">{selectedSubmission.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Company</label>
                                  <p className="text-sm text-gray-600">{selectedSubmission.company}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Phone</label>
                                  <p className="text-sm text-gray-600">{selectedSubmission.phone || 'Not provided'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Company Size</label>
                                  <p className="text-sm text-gray-600">{selectedSubmission.companySize || 'Not specified'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Industry</label>
                                  <p className="text-sm text-gray-600">{selectedSubmission.industry || 'Not specified'}</p>
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Products of Interest</label>
                                <p className="text-sm text-gray-600">{selectedSubmission.interestedIn.join(', ')}</p>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Investment Level</label>
                                <p className="text-sm text-gray-600">{selectedSubmission.investmentLevel || 'Not specified'}</p>
                              </div>
                              
                              {selectedSubmission.additionalInfo && (
                                <div>
                                  <label className="text-sm font-medium">Additional Information</label>
                                  <p className="text-sm text-gray-600">{selectedSubmission.additionalInfo}</p>
                                </div>
                              )}
                              
                              <div>
                                <label className="text-sm font-medium">Submitted</label>
                                <p className="text-sm text-gray-600">{formatDate(selectedSubmission.createdAt)}</p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <div className="flex items-center gap-2">
                        <Select
                          value={submission.status}
                          onValueChange={(status) => updateStatusMutation.mutate({ id: submission.id, status })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="reviewed">Reviewed</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>

                        {submission.status === 'rejected' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Are you sure you want to permanently delete the rejected application from ${submission.fullName} (${submission.company})?`)) {
                                deleteSubmissionMutation.mutate(submission.id);
                              }
                            }}
                            disabled={deleteSubmissionMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {submissions.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600">Partnership applications will appear here when submitted.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}