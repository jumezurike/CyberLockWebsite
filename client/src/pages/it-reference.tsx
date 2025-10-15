import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Shield, Users, Wrench, Globe, CreditCard, FileText, Lock } from "lucide-react";

export default function ITReference() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 print:mb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 print:text-3xl">
                CyberLockX System Portals
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 print:text-sm">
                IT Reference Guide - All Access Links & Portals
              </p>
            </div>
            <Button 
              onClick={handlePrint} 
              className="print:hidden"
              data-testid="button-print-reference"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Reference
            </Button>
          </div>
          <div className="border-b-2 border-blue-600 w-24 print:w-16"></div>
        </div>

        {/* Admin Portals */}
        <Card className="mb-6 print:mb-4 print:break-inside-avoid">
          <CardHeader className="bg-red-50 dark:bg-red-950/20">
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <Shield className="h-5 w-5" />
              Admin Portals (Requires Admin Login)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="border-l-4 border-red-500 pl-4">
                <p className="font-semibold text-slate-900 dark:text-white">Login Credentials:</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Username: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">admin</code></p>
              </div>
              <div className="grid gap-3 mt-4">
                <PortalLink
                  name="Admin Dashboard"
                  url="https://cyberlockx.xyz/admin/early-access"
                  description="Main admin panel - Partnership applications, ticket management"
                />
                <PortalLink
                  name="Work Orders Management"
                  url="https://cyberlockx.xyz/admin/work-orders"
                  description="View, manage, and print work orders"
                />
                <PortalLink
                  name="Analytics Dashboard"
                  url="https://cyberlockx.xyz/admin/analytics"
                  description="Visitor analytics and site metrics"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Portals */}
        <Card className="mb-6 print:mb-4 print:break-inside-avoid">
          <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Users className="h-5 w-5" />
              Customer/Client Portals
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-3">
              <PortalLink
                name="Client Login"
                url="https://cyberlockx.xyz/client-login"
                description="Customer login portal"
              />
              <PortalLink
                name="Client Dashboard"
                url="https://cyberlockx.xyz/client-dashboard"
                description="Customer dashboard (after login)"
              />
              <PortalLink
                name="Service Request Portal"
                url="https://cyberlockx.xyz/services"
                description="6-step service request form"
              />
            </div>
          </CardContent>
        </Card>

        {/* Technician Portals */}
        <Card className="mb-6 print:mb-4 print:break-inside-avoid">
          <CardHeader className="bg-orange-50 dark:bg-orange-950/20">
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <Wrench className="h-5 w-5" />
              Technician Portals
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-semibold text-slate-900 dark:text-white">Login Credentials:</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Admin-issued credentials</p>
              </div>
              <div className="grid gap-3 mt-4">
                <PortalLink
                  name="Technician Login"
                  url="https://cyberlockx.xyz/technician-login"
                  description="Technician authentication"
                />
                <PortalLink
                  name="CYST Reports"
                  url="https://cyberlockx.xyz/technician/cyst-reports"
                  description="E1T1 CYST field service reports"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Public Pages */}
        <Card className="mb-6 print:mb-4 print:break-inside-avoid">
          <CardHeader className="bg-green-50 dark:bg-green-950/20">
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Globe className="h-5 w-5" />
              Public Pages
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-3">
              <PortalLink
                name="Homepage"
                url="https://cyberlockx.xyz/"
                description="Main landing page"
              />
              <PortalLink
                name="About Us"
                url="https://cyberlockx.xyz/about-us"
                description="Company information & leadership"
              />
              <PortalLink
                name="Early Access Signup"
                url="https://cyberlockx.xyz/early-access"
                description="Partnership application form"
              />
              <PortalLink
                name="SOS²A Tool"
                url="https://cyberlockx.xyz/sos2a-tool"
                description="Security assessment tool"
              />
              <PortalLink
                name="Assessment Workflow"
                url="https://cyberlockx.xyz/assessment-workflow"
                description="Assessment process overview"
              />
              <PortalLink
                name="RASBITA Report"
                url="https://cyberlockx.xyz/rasbita"
                description="RASBITA framework information"
              />
              <PortalLink
                name="RASBITA Governance"
                url="https://cyberlockx.xyz/rasbita-governance"
                description="Governance framework"
              />
              <PortalLink
                name="Threat Modeling"
                url="https://cyberlockx.xyz/threat-modeling"
                description="Simplified threat modeling tool"
              />
              <PortalLink
                name="Identity Management"
                url="https://cyberlockx.xyz/identity-management"
                description="UIVS identity management"
              />
              <PortalLink
                name="DNA Search"
                url="https://cyberlockx.xyz/dna-search"
                description="DDNA security search"
              />
              <PortalLink
                name="Security Events"
                url="https://cyberlockx.xyz/security-events"
                description="Security monitoring"
              />
              <PortalLink
                name="Device Inventory"
                url="https://cyberlockx.xyz/device-inventory"
                description="Device management"
              />
              <PortalLink
                name="Knowledge Base"
                url="https://cyberlockx.xyz/knowledge-base"
                description="Documentation & guides"
              />
              <PortalLink
                name="Lightbulb Moments"
                url="https://cyberlockx.xyz/lightbulb-moments"
                description="Knowledge sharing"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment & Checkout */}
        <Card className="mb-6 print:mb-4 print:break-inside-avoid">
          <CardHeader className="bg-purple-50 dark:bg-purple-950/20">
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
              <CreditCard className="h-5 w-5" />
              Payment & Checkout
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-3">
              <PortalLink
                name="Checkout"
                url="https://cyberlockx.xyz/checkout"
                description="Subscription checkout"
              />
              <PortalLink
                name="Payment Success"
                url="https://cyberlockx.xyz/payment-success"
                description="Confirmation page"
              />
              <PortalLink
                name="Payment Error"
                url="https://cyberlockx.xyz/payment-error"
                description="Error handling"
              />
            </div>
          </CardContent>
        </Card>

        {/* Legal & Policy */}
        <Card className="mb-6 print:mb-4 print:break-inside-avoid">
          <CardHeader className="bg-slate-50 dark:bg-slate-950/20">
            <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-400">
              <FileText className="h-5 w-5" />
              Legal & Policy Pages
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-3">
              <PortalLink
                name="Privacy Policy"
                url="https://cyberlockx.xyz/privacy-policy"
                description="Privacy information"
              />
              <PortalLink
                name="Terms of Service"
                url="https://cyberlockx.xyz/terms-of-service"
                description="Terms & conditions"
              />
              <PortalLink
                name="Data Use Policy"
                url="https://cyberlockx.xyz/data-use-policy"
                description="Data usage policy"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Summary */}
        <Card className="mb-6 print:mb-4 print:break-inside-avoid">
          <CardHeader className="bg-indigo-50 dark:bg-indigo-950/20">
            <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
              <Lock className="h-5 w-5" />
              Quick Access Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Admin Access:</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Main Dashboard: <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded">/admin/early-access</code></li>
                  <li>• Work Orders: <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded">/admin/work-orders</code></li>
                  <li>• Analytics: <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded">/admin/analytics</code></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Customer Flow:</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>1. Service Request → <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded">/services</code></li>
                  <li>2. Client Login → <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded">/client-login</code></li>
                  <li>3. Client Dashboard → <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded">/client-dashboard</code></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Technician Flow:</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>1. Login → <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded">/technician-login</code></li>
                  <li>2. Reports → <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded">/technician/cyst-reports</code></li>
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Email Notifications:</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Admin notifications: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">info@cyberlockx.xyz</code></li>
                <li>• Service confirmations: Automated to customer email</li>
                <li>• Partnership approvals: Automated to applicant email</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 print:mt-4 print:pt-3">
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            <p className="font-semibold mb-1">CyberLockX - Universal Identification Verification System</p>
            <p>711 Saluda Ave, Columbia, SC 29201 | info@cyberlockx.xyz</p>
            <p className="mt-2 text-xs">Document Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .container {
            max-width: 100% !important;
          }
          @page {
            margin: 0.5in;
          }
        }
      `}</style>
    </div>
  );
}

interface PortalLinkProps {
  name: string;
  url: string;
  description: string;
}

function PortalLink({ name, url, description }: PortalLinkProps) {
  return (
    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{name}</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{description}</p>
          <a 
            href={url} 
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all print:text-black"
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`link-${name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {url}
          </a>
        </div>
      </div>
    </div>
  );
}
