import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLogin from "./login";
import { Mail, Building, Calendar, MessageSquare, User, ExternalLink, ArrowLeft, Trash2, LogOut, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface ContactSubmission {
  id: number;
  fullName: string;
  email: string;
  company: string | null;
  message: string;
  source: string | null;
  status: string | null;
  notes: string | null;
  respondedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export default function ContactSubmissionsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [notes, setNotes] = useState("");
  const { adminUser, isLoading: authLoading, isAuthenticated, logout } = useAdminAuth();

  const { data: submissions = [], isLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/contact-submissions"],
    refetchInterval: 30000,
    enabled: isAuthenticated,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status?: string; notes?: string }) => {
      await apiRequest("PATCH", `/api/contact-submissions/${id}`, { status, notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-submissions"] });
      toast({
        title: "Updated",
        description: "Submission has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update submission",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contact-submissions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact-submissions"] });
      setSelectedSubmission(null);
      toast({
        title: "Deleted",
        description: "Submission has been permanently removed.",
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => window.location.reload()} />;
  }

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getSourceLabel = (source: string | null) => {
    switch (source) {
      case 'demo_request': return 'Live Demo Request';
      case 'contact_form': return 'Contact Form';
      default: return source || 'Unknown';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const newCount = submissions.filter(s => s.status === 'new').length;
  const contactedCount = submissions.filter(s => s.status === 'contacted').length;
  const convertedCount = submissions.filter(s => s.status === 'converted').length;
  const totalCount = submissions.length;

  const openSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setNotes(submission.notes || "");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/early-access">
                <Button variant="ghost" size="sm" data-testid="button-back-admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Contact Submissions</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {adminUser?.fullName || adminUser?.username}
              </span>
              <Button variant="outline" size="sm" onClick={() => logout()} data-testid="button-logout">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card data-testid="card-stats-total">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Inquiries</p>
                  <p className="text-3xl font-bold">{totalCount}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stats-new">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">New</p>
                  <p className="text-3xl font-bold text-blue-600">{newCount}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stats-contacted">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Contacted</p>
                  <p className="text-3xl font-bold text-green-600">{contactedCount}</p>
                </div>
                <Mail className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stats-converted">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Converted</p>
                  <p className="text-3xl font-bold text-purple-600">{convertedCount}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              All Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No contact submissions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => openSubmission(submission)}
                    data-testid={`row-submission-${submission.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{submission.fullName}</h3>
                          <Badge className={getStatusColor(submission.status)}>
                            {submission.status || 'new'}
                          </Badge>
                          <Badge variant="outline">
                            {getSourceLabel(submission.source)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {submission.email}
                          </span>
                          {submission.company && (
                            <span className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {submission.company}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(submission.createdAt)}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-600 line-clamp-2">{submission.message}</p>
                      </div>
                      <Button variant="ghost" size="sm" data-testid={`button-view-${submission.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Submission Details
              </DialogTitle>
            </DialogHeader>
            
            {selectedSubmission && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{selectedSubmission.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">
                      <a href={`mailto:${selectedSubmission.email}`} className="text-blue-600 hover:underline">
                        {selectedSubmission.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <p className="text-gray-900">{selectedSubmission.company || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Source</label>
                    <p className="text-gray-900">{getSourceLabel(selectedSubmission.source)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Received</label>
                    <p className="text-gray-900">{formatDate(selectedSubmission.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Responded</label>
                    <p className="text-gray-900">{formatDate(selectedSubmission.respondedAt)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Message</label>
                  <div className="mt-1 p-4 bg-gray-50 rounded-lg border">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Status</label>
                  <Select
                    value={selectedSubmission.status || 'new'}
                    onValueChange={(value) => {
                      updateMutation.mutate({ id: selectedSubmission.id, status: value });
                      setSelectedSubmission({ ...selectedSubmission, status: value });
                    }}
                  >
                    <SelectTrigger className="w-full" data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Internal Notes</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this inquiry..."
                    rows={3}
                    data-testid="textarea-notes"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      updateMutation.mutate({ id: selectedSubmission.id, notes });
                    }}
                    disabled={updateMutation.isPending}
                    data-testid="button-save-notes"
                  >
                    Save Notes
                  </Button>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => window.open(`mailto:${selectedSubmission.email}`, '_blank')}
                    data-testid="button-reply-email"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Reply via Email
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this submission?')) {
                        deleteMutation.mutate(selectedSubmission.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    data-testid="button-delete"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
