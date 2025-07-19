import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Clock, 
  Target,
  RefreshCw,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Link } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface AnalyticsMetrics {
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsers30Days: number;
  paidUsers: number;
  totalRevenue: number;
  assessmentsCompleted: number;
  earlyAccessSubmissions: number;
  monthOverMonthGrowth: number;
  completedAssessmentsThisMonth: number;
  earlyAccessSubmissionsThisMonth: number;
}

interface MonthlyGrowthData {
  month: string;
  users: number;
  revenue: number;
  assessments: number;
}

export default function AnalyticsDashboard() {
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Fetch analytics metrics
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useQuery<AnalyticsMetrics>({
    queryKey: ["/api/analytics/metrics"],
    refetchInterval: autoRefresh ? 30000 : false, // Auto-refresh every 30 seconds if enabled
  });

  // Fetch growth data
  const { data: growthData, isLoading: growthLoading, error: growthError, refetch: refetchGrowth } = useQuery<MonthlyGrowthData[]>({
    queryKey: ["/api/analytics/growth"],
    refetchInterval: autoRefresh ? 60000 : false, // Auto-refresh every minute if enabled
  });

  const handleRefresh = () => {
    refetchMetrics();
    refetchGrowth();
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value}%`;
  };

  const getGrowthColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />;
  };

  if (metricsError || growthError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
            <p className="text-red-600 mb-4">Failed to load analytics data. Please try again.</p>
            <Button onClick={handleRefresh}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time insights and metrics for CyberLockX platform</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>{autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}</span>
            </Button>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Link href="/admin/early-access">
              <Button variant="outline">Back to Admin</Button>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {(metricsLoading || growthLoading) && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading analytics data...</span>
          </div>
        )}

        {/* Key Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  <span>+{metrics.newUsersThisMonth} this month</span>
                </div>
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">30-Day Active</CardTitle>
                <Clock className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeUsers30Days.toLocaleString()}</div>
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  <span>{Math.round((metrics.activeUsers30Days / Math.max(metrics.totalUsers, 1)) * 100)}% of total</span>
                </div>
              </CardContent>
            </Card>

            {/* Revenue */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  <span>{metrics.paidUsers} paid users</span>
                </div>
              </CardContent>
            </Card>

            {/* Growth Rate */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Month-over-Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold flex items-center ${getGrowthColor(metrics.monthOverMonthGrowth)}`}>
                  {getGrowthIcon(metrics.monthOverMonthGrowth)}
                  <span className="ml-1">{formatPercentage(metrics.monthOverMonthGrowth)}</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">User growth</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Activity Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assessment Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Assessment Activity
                </CardTitle>
                <CardDescription>Security assessments completed on the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Completed:</span>
                  <Badge variant="secondary">{metrics.assessmentsCompleted}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Month:</span>
                  <Badge variant="default">{metrics.completedAssessmentsThisMonth}</Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Progress</span>
                    <span>{Math.round((metrics.completedAssessmentsThisMonth / Math.max(metrics.assessmentsCompleted, 1)) * 100)}%</span>
                  </div>
                  <Progress value={Math.round((metrics.completedAssessmentsThisMonth / Math.max(metrics.assessmentsCompleted, 1)) * 100)} />
                </div>
              </CardContent>
            </Card>

            {/* Early Access Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-600" />
                  Early Access Program
                </CardTitle>
                <CardDescription>Partnership applications and submissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Submissions:</span>
                  <Badge variant="secondary">{metrics.earlyAccessSubmissions}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Month:</span>
                  <Badge variant="default">{metrics.earlyAccessSubmissionsThisMonth}</Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Progress</span>
                    <span>{Math.round((metrics.earlyAccessSubmissionsThisMonth / Math.max(metrics.earlyAccessSubmissions, 1)) * 100)}%</span>
                  </div>
                  <Progress value={Math.round((metrics.earlyAccessSubmissionsThisMonth / Math.max(metrics.earlyAccessSubmissions, 1)) * 100)} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Growth Charts */}
        {growthData && growthData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  User Growth Trend
                </CardTitle>
                <CardDescription>Monthly user registration over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Assessment Completion Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                  Assessment Completions
                </CardTitle>
                <CardDescription>Monthly assessment completions over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="assessments" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">
            Last updated: {new Date().toLocaleString()} | 
            {autoRefresh ? " Auto-refreshing every 30 seconds" : " Manual refresh mode"}
          </p>
        </div>
      </div>
    </div>
  );
}