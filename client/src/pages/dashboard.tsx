import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  FileBarChart, 
  PieChart, 
  Server, 
  Database, 
  Globe, 
  RefreshCw,
  Download 
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Define types for the monitoring data structure
interface SecurityIssue {
  id: number;
  title: string;
  description: string;
  severity: string;
  affectedSystems: string;
  discovered: string;
  status: 'open' | 'remediated';
}

interface ComplianceItem {
  standard: string;
  status: string;
  score: number;
}

interface SystemHealthItem {
  status: string;
  uptime: string;
}

interface SecurityEvents {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

interface MonitoringData {
  securityScore: number;
  lastUpdated: string;
  issues: SecurityIssue[];
  complianceStatus: ComplianceItem[];
  systemHealth: {
    servers: SystemHealthItem;
    databases: SystemHealthItem;
    applications: SystemHealthItem;
  };
  securityEvents: SecurityEvents;
}

// Security issue card component
const SecurityIssueCard = ({ issue }: { issue: SecurityIssue }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <Card className="mb-4 border-l-4 border-l-red-500 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{issue.title}</CardTitle>
            <CardDescription>{issue.description}</CardDescription>
          </div>
          <Badge className={getSeverityColor(issue.severity)}>
            {issue.severity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-sm">
          <div>
            <span className="text-muted-foreground">Affected Systems:</span> {issue.affectedSystems}
          </div>
          <div>
            <span className="text-muted-foreground">Discovered:</span> {issue.discovered}
          </div>
          <Button variant="outline" size="sm">Remediate</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Security score calculation
const calculateSecurityScore = (data: MonitoringData) => {
  if (!data || !data.issues) return 0;
  
  // Count remediated issues
  const remediatedIssues = data.issues.filter((issue) => issue.status === 'remediated').length;
  
  // Basic score calculation (could be more complex in a real app)
  const totalIssues = data.issues.length || 1; // Avoid division by zero
  return Math.round((remediatedIssues / totalIssues) * 100);
};

export default function Dashboard() {
  const { toast } = useToast();
  const [reportType, setReportType] = useState<'executive' | 'technical' | 'compliance'>('executive');

  // Fetch security monitoring data
  const { data, isLoading, error, refetch } = useQuery<MonitoringData>({
    queryKey: ['/api/monitoring-data'],
    queryFn: async () => {
      try {
        // Fetch data from the API
        const response = await apiRequest("GET", "/api/monitoring-data");
        return await response.json();
      } catch (err) {
        console.error("Failed to fetch monitoring data:", err);
        toast({
          title: "Error fetching monitoring data",
          description: "Failed to load the latest security information.",
          variant: "destructive",
        });
        throw err;
      }
    }
  });

  const handleRefresh = () => {
    toast({
      title: "Refreshing data",
      description: "Fetching the latest security information...",
    });
    refetch();
  };

  const generateReport = async () => {
    try {
      toast({
        title: "Generating report",
        description: `Preparing ${reportType} report for download...`,
      });
      
      // Make API call to generate a report
      await apiRequest("POST", "/api/generate-report", { type: reportType });
      
      toast({
        title: "Report ready",
        description: "Your report has been generated successfully.",
      });
    } catch (err) {
      toast({
        title: "Error generating report",
        description: "Failed to generate the requested report.",
        variant: "destructive",
      });
    }
  };

  // Calculate security score
  const securityScore = data ? calculateSecurityScore(data) : 0;

  return (
    <div className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Security Monitoring Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh Data
            </Button>
          </div>
        </div>
          
        {isLoading ? (
          <div className="w-full py-20 flex justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800">Failed to load monitoring data</h3>
            <p className="text-red-600 mt-2">Please try refreshing the page</p>
            <Button variant="destructive" className="mt-4" onClick={() => refetch()}>Try Again</Button>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Security Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Security Score
                  </CardTitle>
                  <CardDescription>Overall security performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold">{securityScore}</span>
                      </div>
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          className="text-gray-200"
                          cx="50"
                          cy="50"
                          r="40"
                          strokeWidth="10"
                          fill="transparent"
                          stroke="currentColor"
                        />
                        <circle
                          className={`${
                            securityScore >= 80 ? 'text-green-500' : 
                            securityScore >= 60 ? 'text-yellow-500' : 
                            'text-red-500'
                          }`}
                          cx="50"
                          cy="50"
                          r="40"
                          strokeWidth="10"
                          fill="transparent"
                          stroke="currentColor"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - securityScore / 100)}`}
                        />
                      </svg>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      Last updated: {new Date(data.lastUpdated).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    System Health
                  </CardTitle>
                  <CardDescription>Current status of your systems</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-gray-500" />
                        <span>Servers</span>
                      </div>
                      <Badge className={data.systemHealth.servers.status === 'Healthy' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {data.systemHealth.servers.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-gray-500" />
                        <span>Databases</span>
                      </div>
                      <Badge className={data.systemHealth.databases.status === 'Healthy' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {data.systemHealth.databases.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span>Applications</span>
                      </div>
                      <Badge className={data.systemHealth.applications.status === 'Healthy' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {data.systemHealth.applications.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileBarChart className="h-5 w-5 text-primary" />
                    Security Events
                  </CardTitle>
                  <CardDescription>Recent security incidents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Today</span>
                        <span className="text-sm font-medium">{data.securityEvents.today}</span>
                      </div>
                      <Progress value={(data.securityEvents.today / 50) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">This Week</span>
                        <span className="text-sm font-medium">{data.securityEvents.thisWeek}</span>
                      </div>
                      <Progress value={(data.securityEvents.thisWeek / 200) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">This Month</span>
                        <span className="text-sm font-medium">{data.securityEvents.thisMonth}</span>
                      </div>
                      <Progress value={(data.securityEvents.thisMonth / 800) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Security Issues & Reports */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                      Security Issues
                    </CardTitle>
                    <CardDescription>Active issues requiring attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.issues
                        .filter(issue => issue.status !== 'remediated')
                        .map(issue => (
                          <SecurityIssueCard key={issue.id} issue={issue} />
                        ))}
                        
                      {data.issues.filter(issue => issue.status !== 'remediated').length === 0 && (
                        <div className="text-center py-10">
                          <ShieldCheck className="h-10 w-10 text-green-500 mx-auto mb-2" />
                          <h3 className="text-lg font-medium text-gray-900">All Clear!</h3>
                          <p className="text-gray-500">No active security issues found.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-primary" />
                      Compliance Status
                    </CardTitle>
                    <CardDescription>Regulatory compliance overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.complianceStatus.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{item.standard}</span>
                            <Badge className={
                              item.status === 'Compliant' ? 'bg-green-500' : 
                              item.status === 'Partially Compliant' ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }>
                              {item.status}
                            </Badge>
                          </div>
                          <Progress value={item.score} className="h-2" />
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-4">Generate Compliance Report</h4>
                      <Tabs defaultValue="executive" onValueChange={(value) => setReportType(value as any)}>
                        <TabsList className="w-full">
                          <TabsTrigger value="executive" className="flex-1">Executive</TabsTrigger>
                          <TabsTrigger value="technical" className="flex-1">Technical</TabsTrigger>
                          <TabsTrigger value="compliance" className="flex-1">Compliance</TabsTrigger>
                        </TabsList>
                        <div className="mt-4">
                          <Button 
                            onClick={generateReport} 
                            className="w-full flex items-center justify-center gap-2"
                          >
                            <Download size={16} />
                            Generate Report
                          </Button>
                        </div>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}