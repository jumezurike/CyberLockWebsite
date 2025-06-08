import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Users, Shield, AlertTriangle, Activity, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'wouter';

export default function DashboardOverview() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="p-6">
        <div className="mb-6">
          <Link href="/identity-management" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Identity Management
          </Link>
          
          <h1 className="text-3xl font-bold mt-2">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Total Identities - All managed identities
          </p>
        </div>

        {/* Main Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Identities</p>
                  <p className="text-3xl font-bold text-gray-900">5</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">High Risk Identities</p>
                  <p className="text-3xl font-bold text-red-600">2</p>
                  <p className="text-xs text-gray-500 mt-1">Require attention</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Sessions</p>
                  <p className="text-3xl font-bold text-green-600">12</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Security Score</p>
                  <p className="text-3xl font-bold text-blue-600">87%</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Identity Types Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle>Identity Types Distribution</CardTitle>
              <p className="text-sm text-gray-600">Distribution by category</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">2 Human</Badge>
                  <span className="text-2xl font-bold">40%</span>
                </div>
                <div className="flex justify-between items-center">
                  <Badge className="bg-green-100 text-green-800 border-green-200">1 Machine</Badge>
                  <span className="text-2xl font-bold">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">1 API</Badge>
                  <span className="text-2xl font-bold">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">1 Third-Party</Badge>
                  <span className="text-2xl font-bold">20%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle>Recent Activity Trends</CardTitle>
              <p className="text-sm text-gray-600">Last 7 days</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-50 p-2 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Login Success Rate</p>
                      <p className="text-sm text-gray-600">Identity authentications</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600">98.5%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Average Session Duration</p>
                      <p className="text-sm text-gray-600">Active user sessions</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-600">4.2h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/identity-management">
                <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Users className="h-6 w-6 text-blue-600 mb-2" />
                  <h3 className="font-semibold">Manage Identities</h3>
                  <p className="text-sm text-gray-600">View and manage all identity records</p>
                </div>
              </Link>
              
              <Link href="/dna-search">
                <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Shield className="h-6 w-6 text-purple-600 mb-2" />
                  <h3 className="font-semibold">DNA Search</h3>
                  <p className="text-sm text-gray-600">Search Universal Wallet Addresses</p>
                </div>
              </Link>
              
              <Link href="/security-events">
                <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Activity className="h-6 w-6 text-green-600 mb-2" />
                  <h3 className="font-semibold">Security Events</h3>
                  <p className="text-sm text-gray-600">Monitor identity security activities</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}