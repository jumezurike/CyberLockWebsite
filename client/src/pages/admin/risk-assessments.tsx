import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLogin from "./login";
import { Trash2, LogOut, Eye, FileDown, Building, Mail, Phone, Calendar, Shield, AlertTriangle, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface RiskAssessment {
  id: number;
  fullName: string;
  email: string;
  company: string;
  phone: string;
  companySize: string;
  industry: string;
  governScore: number;
  identifyScore: number;
  protectScore: number;
  detectScore: number;
  respondScore: number;
  recoverScore: number;
  totalScore: number;
  createdAt: string;
}

const getRiskLevel = (score: number): { label: string; color: string; variant: "default" | "destructive" | "secondary" | "outline" } => {
  if (score >= 75) return { label: "Low Risk", color: "text-green-600", variant: "outline" };
  if (score >= 50) return { label: "Moderate Risk", color: "text-yellow-600", variant: "secondary" };
  if (score >= 25) return { label: "High Risk", color: "text-orange-600", variant: "default" };
  return { label: "Critical Risk", color: "text-red-600", variant: "destructive" };
};

const getScoreColor = (score: number): string => {
  if (score >= 3) return "text-green-600";
  if (score >= 2) return "text-yellow-600";
  return "text-red-600";
};

export default function RiskAssessmentsDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAssessment, setSelectedAssessment] = useState<RiskAssessment | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { adminUser, isLoading: authLoading, isAuthenticated, logout } = useAdminAuth();

  const { data: assessments = [], isLoading } = useQuery<RiskAssessment[]>({
    queryKey: ["/api/risk-assessments"],
    refetchInterval: 30000,
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/risk-assessments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/risk-assessments"] });
      toast({
        title: "Assessment Deleted",
        description: "Risk assessment has been permanently removed.",
      });
      setDeleteConfirmId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete assessment",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm" data-testid="button-back-dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Risk Assessment Reports</h1>
              <p className="text-gray-600">View and manage S/HOS²A Cyber Risk Health Checkup submissions</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {adminUser?.fullName || adminUser?.username}
            </span>
            <Button variant="outline" size="sm" onClick={logout} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card data-testid="card-total-assessments">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-count">{assessments.length}</p>
                  <p className="text-sm text-gray-600">Total Assessments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="card-critical-risk">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <XCircle className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-critical-count">
                    {assessments.filter((a: RiskAssessment) => a.totalScore < 25).length}
                  </p>
                  <p className="text-sm text-gray-600">Critical Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="card-high-risk">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-high-count">
                    {assessments.filter((a: RiskAssessment) => a.totalScore >= 25 && a.totalScore < 50).length}
                  </p>
                  <p className="text-sm text-gray-600">High Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="card-low-risk">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-low-count">
                    {assessments.filter((a: RiskAssessment) => a.totalScore >= 75).length}
                  </p>
                  <p className="text-sm text-gray-600">Low Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Risk Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : assessments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No risk assessments have been submitted yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Company</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Contact</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Industry</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Score</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Risk Level</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map((assessment: RiskAssessment) => {
                      const riskLevel = getRiskLevel(assessment.totalScore);
                      return (
                        <tr key={assessment.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{assessment.company}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <p className="font-medium">{assessment.fullName}</p>
                              <p className="text-gray-500">{assessment.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{assessment.industry}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-bold text-lg ${riskLevel.color}`}>
                              {assessment.totalScore}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge variant={riskLevel.variant}>{riskLevel.label}</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {formatDate(assessment.createdAt)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedAssessment(assessment)}
                                data-testid={`button-view-assessment-${assessment.id}`}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setDeleteConfirmId(assessment.id)}
                                data-testid={`button-delete-assessment-${assessment.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Risk Assessment Details</DialogTitle>
            <DialogDescription>
              Full details for {selectedAssessment?.company}
            </DialogDescription>
          </DialogHeader>
          {selectedAssessment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-500 text-sm mb-1">Company</h4>
                  <p className="font-medium">{selectedAssessment.company}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500 text-sm mb-1">Industry</h4>
                  <p>{selectedAssessment.industry}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500 text-sm mb-1">Contact Name</h4>
                  <p>{selectedAssessment.fullName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500 text-sm mb-1">Company Size</h4>
                  <p>{selectedAssessment.companySize} employees</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500 text-sm mb-1">Email</h4>
                  <p>{selectedAssessment.email}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500 text-sm mb-1">Phone</h4>
                  <p>{selectedAssessment.phone}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">NIST CSF 2.0 Scores (0-4 scale)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">GOVERN</p>
                    <p className={`text-2xl font-bold ${getScoreColor(selectedAssessment.governScore)}`}>
                      {selectedAssessment.governScore}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">IDENTIFY</p>
                    <p className={`text-2xl font-bold ${getScoreColor(selectedAssessment.identifyScore)}`}>
                      {selectedAssessment.identifyScore}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">PROTECT</p>
                    <p className={`text-2xl font-bold ${getScoreColor(selectedAssessment.protectScore)}`}>
                      {selectedAssessment.protectScore}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">DETECT</p>
                    <p className={`text-2xl font-bold ${getScoreColor(selectedAssessment.detectScore)}`}>
                      {selectedAssessment.detectScore}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">RESPOND</p>
                    <p className={`text-2xl font-bold ${getScoreColor(selectedAssessment.respondScore)}`}>
                      {selectedAssessment.respondScore}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">RECOVER</p>
                    <p className={`text-2xl font-bold ${getScoreColor(selectedAssessment.recoverScore)}`}>
                      {selectedAssessment.recoverScore}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Overall Score</p>
                  <p className={`text-3xl font-bold ${getRiskLevel(selectedAssessment.totalScore).color}`} data-testid="text-detail-score">
                    {selectedAssessment.totalScore}%
                  </p>
                  <Badge variant={getRiskLevel(selectedAssessment.totalScore).variant} data-testid="badge-detail-risk-level">
                    {getRiskLevel(selectedAssessment.totalScore).label}
                  </Badge>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Submitted on</p>
                  <p data-testid="text-detail-date">{formatDate(selectedAssessment.createdAt)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this risk assessment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
