import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Sos2aTool from "@/pages/sos2a-tool";
import ColorDemo from "@/pages/color-demo";
import EarlyAccess from "@/pages/early-access";
import Dashboard from "@/pages/dashboard";
import AboutUs from "@/pages/about-us";
import RasbitaReport from "@/pages/rasbita-report";
import RasbitaGovernance from "@/pages/rasbita-governance";
import ThreatModelingPage from "@/pages/threat-modeling";
import ThreatModelingSimple from "@/pages/threat-modeling-simple";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import DataUsePolicy from "@/pages/data-use-policy";
import KnowledgeBasePage from "@/pages/knowledge-base";
import LightbulbMomentsPage from "@/pages/lightbulb-moments";
import ParameterMappingPage from "@/pages/parameter-mapping";
import BrowserBaselinePage from "@/pages/browser-baseline";
import LightbulbCapture from "@/components/knowledge-share/lightbulb-capture";
import Checkout from "@/pages/checkout";
import IdentityManagement from "@/pages/identity-management";
import DashboardOverview from "@/pages/dashboard-overview";
import DNASearch from "@/pages/dna-search";
import SecurityEvents from "@/pages/security-events";
import PaymentSuccess from "@/pages/payment-success";
import PaymentError from "@/pages/payment-error";
import DirectNavigation from "@/components/direct-navigation";
import DeviceInventoryPage from "@/pages/device-inventory";
import AccessibilityDemo from "@/pages/accessibility-demo";
import AssessmentWorkflowPage from "@/pages/assessment-workflow";
import EarlyAccessDashboard from "@/pages/admin/early-access-dashboard";

function Router() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Debug current location
    console.log("Current route:", location);
  }, [location]);
  
  // Check if current page should hide footer and header
  const hideFooterPages = ['/sos2a-tool'];
  const hideHeaderPages = ['/sos2a-tool'];
  const shouldHideFooter = hideFooterPages.includes(location);
  const shouldHideHeader = hideHeaderPages.includes(location);

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideHeader && <Header />}
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/sos2a-tool" component={Sos2aTool} />
          <Route path="/assessment-workflow" component={AssessmentWorkflowPage} />
          <Route path="/color-demo" component={ColorDemo} />
          <Route path="/early-access" component={EarlyAccess} />
          <Route path="/admin/early-access" component={EarlyAccessDashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/about-us" component={AboutUs} />
          <Route path="/rasbita" component={RasbitaReport} />
          <Route path="/rasbita-governance" component={RasbitaGovernance} />
          <Route path="/threat-modeling" component={ThreatModelingSimple} />
          <Route path="/threat-modeling-full" component={ThreatModelingPage} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/data-use-policy" component={DataUsePolicy} />
          <Route path="/knowledge-base" component={KnowledgeBasePage} />
          <Route path="/lightbulb-moments" component={LightbulbMomentsPage} />
          <Route path="/parameter-mapping" component={ParameterMappingPage} />
          <Route path="/browser-baseline" component={BrowserBaselinePage} />
          <Route path="/device-inventory" component={DeviceInventoryPage} />
          <Route path="/identity-management" component={IdentityManagement} />
          <Route path="/dashboard-overview" component={DashboardOverview} />
          <Route path="/dna-search" component={DNASearch} />
          <Route path="/security-events" component={SecurityEvents} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/payment-success" component={PaymentSuccess} />
          <Route path="/payment-error" component={PaymentError} />
          <Route path="/accessibility-demo" component={AccessibilityDemo} />
          <Route component={NotFound} />
        </Switch>
        {/* Add direct navigation for testing */}
        <DirectNavigation />
        {/* Add lightbulb capture interface */}
        <LightbulbCapture />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
