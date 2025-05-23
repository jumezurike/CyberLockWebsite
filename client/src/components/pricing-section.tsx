import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Shield } from "lucide-react";

interface PricingFeature {
  included: boolean;
  text: string;
}

interface AddonOption {
  id: string;
  label: string;
  price: string;
}

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  isPopular?: boolean;
  features: PricingFeature[];
  addons: AddonOption[];
}

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<string>("clinics");
  const [selectedAddons, setSelectedAddons] = useState<Record<string, Record<string, boolean>>>({
    "small medical/health practices": {},
    clinics: {},
    "hospitals/healthtechs": {}
  });
  const [serverCount, setServerCount] = useState<Record<string, string>>({
    "small medical/health practices": "0",
    clinics: "0",
    "hospitals/healthtechs": "0"
  });
  const [endpointCount, setEndpointCount] = useState<Record<string, string>>({
    "small medical/health practices": "0",
    clinics: "0",
    "hospitals/healthtechs": "0"
  });
  const [appCount, setAppCount] = useState<Record<string, string>>({
    "small medical/health practices": "0",
    clinics: "0",
    "hospitals/healthtechs": "0"
  });
  const [, setLocation] = useLocation();

  const handleAddonChange = (planId: string, addonId: string, checked: boolean) => {
    setSelectedAddons(prev => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [addonId]: checked
      }
    }));
  };
  
  // State for auto-select notification
  const [showAutoSelectNotification, setShowAutoSelectNotification] = useState<Record<string, boolean>>({
    "small medical/health practices": false,
    clinics: false,
    "hospitals/healthtechs": false
  });
  
  // Helper function to auto-select relevant add-ons based on infrastructure inputs
  const autoSelectRelevantAddons = (planId: string) => {
    const serverValue = parseInt(serverCount[planId] || "0");
    const endpointValue = parseInt(endpointCount[planId] || "0");
    const appValue = parseInt(appCount[planId] || "0");
    
    // Only auto-select if they have at least one infrastructure component
    if (serverValue > 0 || endpointValue > 0 || appValue > 0) {
      // Auto-select monitoring add-on if any infrastructure components are selected
      setSelectedAddons(prev => ({
        ...prev,
        [planId]: {
          ...prev[planId],
          "monitoring": true,         // "Continuous Monitoring & Incident Response"
          "policy": true,             // "Policies, Processes, Procedures, and Plans continuous development"
          "annual": true              // "Annual Security Posture Update & Assessment"
        }
      }));
      
      // Show notification
      setShowAutoSelectNotification(prev => ({
        ...prev,
        [planId]: true
      }));
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowAutoSelectNotification(prev => ({
          ...prev,
          [planId]: false
        }));
      }, 5000);
    }
  };

  const handleServerCountChange = (planId: string, count: string) => {
    // Only allow numeric input
    if (/^\d*$/.test(count)) {
      setServerCount(prev => ({
        ...prev,
        [planId]: count
      }));
      
      // Auto-select relevant add-ons if count is greater than 0
      if (parseInt(count) > 0) {
        autoSelectRelevantAddons(planId);
      }
    }
  };
  
  const handleEndpointCountChange = (planId: string, count: string) => {
    // Only allow numeric input
    if (/^\d*$/.test(count)) {
      setEndpointCount(prev => ({
        ...prev,
        [planId]: count
      }));
      
      // Auto-select relevant add-ons if count is greater than 0
      if (parseInt(count) > 0) {
        autoSelectRelevantAddons(planId);
      }
    }
  };
  
  const handleAppCountChange = (planId: string, count: string) => {
    // Only allow numeric input
    if (/^\d*$/.test(count)) {
      setAppCount(prev => ({
        ...prev,
        [planId]: count
      }));
      
      // Auto-select relevant add-ons if count is greater than 0
      if (parseInt(count) > 0) {
        autoSelectRelevantAddons(planId);
      }
    }
  };
  
  const proceedToCheckout = () => {
    // Find the selected plan
    const plan = plans.find(p => p.name.toLowerCase() === selectedPlan);
    
    if (!plan) return;
    
    // Get selected addons for this plan
    const selectedAddonsList = Object.entries(selectedAddons[selectedPlan] || {})
      .filter(([, isSelected]) => isSelected)
      .map(([addonId]) => {
        const addonDetails = plan.addons.find(a => a.id === addonId);
        if (!addonDetails) return null;
        
        // Extract just the numeric part from the price string (e.g. "$25/month" -> "25")
        const priceMatch = addonDetails.price.match(/\$(\d+)/);
        const price = priceMatch ? priceMatch[1] : "0";
        
        return {
          id: addonId,
          label: addonDetails.label,
          price
        };
      })
      .filter((addon): addon is { id: string, label: string, price: string } => addon !== null);
    
    // Calculate infrastructure costs
    const serverTotal = parseInt(serverCount[selectedPlan] || "0") * 65; // $65/server/month
    const endpointTotal = parseInt(endpointCount[selectedPlan] || "0") * 45; // $45/endpoint/month
    const appTotal = parseInt(appCount[selectedPlan] || "0") * 55; // $55/application/month
    const infraCost = serverTotal + endpointTotal + appTotal;
    
    // Calculate total amount (plan price + addons + infrastructure costs)
    const basePlanPrice = parseFloat(plan.price);
    const addonsTotal = selectedAddonsList.reduce(
      (sum, addon) => sum + (addon ? parseFloat(addon.price) : 0), 
      0
    );
    const totalAmount = (basePlanPrice + addonsTotal + infraCost).toFixed(2);
    
    // Create URL query params for checkout
    const params = new URLSearchParams();
    params.set('planId', selectedPlan);
    params.set('planName', plan.name);
    params.set('amount', totalAmount);
    
    // Add the infrastructure counts to the checkout parameters
    params.set('serverCount', serverCount[selectedPlan]);
    params.set('endpointCount', endpointCount[selectedPlan]);
    params.set('appCount', appCount[selectedPlan]);
    
    // Add the infrastructure cost to checkout parameters
    params.set('infraCost', infraCost.toString());
    
    if (selectedAddonsList.length > 0) {
      params.set('addons', encodeURIComponent(JSON.stringify(selectedAddonsList)));
    }
    
    // Navigate to checkout page
    setLocation(`/checkout?${params.toString()}`);
  };

  const plans: PricingPlan[] = [
    {
      name: "Small Medical/Health Practices",
      price: "29.99",
      description: "Best for small medical practices up to 5 users",
      features: [
        { included: true, text: "Addition of up to 5 users" },
        { included: true, text: "Secure Cloud (Google docs and sheets)" },
        { included: true, text: "Secure Meet (Audio/Video conference)" },
        { included: true, text: "Secure Payment application" },
        { included: true, text: "Secure True Digital ID" },
        { included: true, text: "Secure AI Language Augmentation (Low Resource)" },
        { included: true, text: "SMB Preliminary cybersecurity analysis reports (Free)" }
      ],
      addons: [
        { id: "comp-report", label: "Comprehensive cybersecurity analysis reports", price: "$250 one time" },
        { id: "monitoring", label: "Continuous Monitoring & Incident Response", price: "$65/device/month" },
        { id: "policy", label: "Policies, Processes, Procedures, and Plans continuous development", price: "$25/month" },
        { id: "annual", label: "Annual Security Posture Update & Assessment", price: "$300" }
      ]
    },
    {
      name: "Clinics",
      price: "49.99",
      description: "Ideal for growing clinics up to 15 users",
      isPopular: true,
      features: [
        { included: true, text: "Addition of up to 15 users" },
        { included: true, text: "Secure Cloud (Google docs and sheets)" },
        { included: true, text: "Secure Business Cloud (Azure, AWS)" },
        { included: true, text: "Secure Meet (Audio/Video conference)" },
        { included: true, text: "Secure Payment application" },
        { included: true, text: "Secure True Digital ID" },
        { included: true, text: "Secure AI Language Augmentation (High Resource)" },
        { included: true, text: "SMB Preliminary cybersecurity analysis reports (Free)" }
      ],
      addons: [
        { id: "comp-report", label: "Comprehensive cybersecurity analysis reports", price: "$750 one time" },
        { id: "monitoring", label: "Continuous Monitoring & Incident Response", price: "$65/device/month" },
        { id: "policy", label: "Policies, Processes, Procedures, and Plans continuous development", price: "$50/month" },
        { id: "annual", label: "Annual Security Posture Update & Assessment", price: "$600" },
        { id: "admin", label: "Annual Administrative and maintenance fees", price: "$250" }
      ]
    },
    {
      name: "Hospitals/HealthTechs",
      price: "99.99",
      description: "Perfect for hospitals and health technology companies up to 50 users",
      features: [
        { included: true, text: "Addition of up to 50 users" },
        { included: true, text: "Secure Cloud (Google docs and sheets)" },
        { included: true, text: "Secure Business Cloud (Azure, AWS, GCP, Digital Ocean)" },
        { included: true, text: "Secure Meet (Audio/Video conference)" },
        { included: true, text: "Secure Payment application" },
        { included: true, text: "Secure True Digital ID" },
        { included: true, text: "Secure AI Language Augmentation (High Resource)" },
        { included: true, text: "Customized solutions for businesses" },
        { included: true, text: "Dedicated customer support" },
        { included: true, text: "SMB Preliminary cybersecurity analysis reports (Free)" }
      ],
      addons: [
        { id: "comp-report", label: "Comprehensive cybersecurity analysis reports", price: "$2250 one time" },
        { id: "monitoring", label: "Continuous Monitoring & Incident Response", price: "$65/device/month" },
        { id: "policy", label: "Policies, Processes, Procedures, and Plans continuous development", price: "$100/month" },
        { id: "annual", label: "Annual Security Posture Update & Assessment", price: "$1000" },
        { id: "admin", label: "Annual Administrative and maintenance fees", price: "$350" }
      ]
    }
  ];

  return (
    <section id="pricing" className="py-16 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-primary mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">Choose the plan that's right for your business with no hidden fees.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const planId = plan.name.toLowerCase();
            const isSelected = selectedPlan === planId;
            
            return (
              <div 
                key={planId}
                className={`
                  bg-white rounded-xl shadow-lg overflow-hidden 
                  ${plan.isPopular ? 'border-2 border-primary transform md:scale-105 z-10' : 'border-2 border-transparent hover:border-primary'} 
                  transition-all duration-300
                `}
              >
                <div className={`${plan.isPopular ? 'bg-primary' : 'bg-blue-500'} p-6 text-white text-center relative`}>
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      POPULAR
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <div className="text-3xl font-bold">${plan.price}<span className="text-sm font-normal">/month</span></div>
                  <p className="text-neutral-100 mt-2">{plan.description}</p>
                </div>
                
                <div className="p-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="text-green-600 h-5 w-5 mr-2 flex-shrink-0" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 pt-6 border-t border-neutral-200">
                    <h4 className="font-semibold mb-3">Infrastructure Information:</h4>
                    <div className="space-y-3 mb-5">
                      <div className="flex justify-between items-center">
                        <div>
                          <label htmlFor={`${planId}-server-count`} className="text-sm font-medium">Server (Physical or Virtual)</label>
                          <p className="text-xs text-gray-500">$65/server/month</p>
                        </div>
                        <input 
                          type="text" 
                          id={`${planId}-server-count`} 
                          className="w-20 px-2 py-1 border rounded text-right"
                          value={serverCount[planId]}
                          onChange={(e) => handleServerCountChange(planId, e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <label htmlFor={`${planId}-endpoint-count`} className="text-sm font-medium">End-point (Subject accessing server)</label>
                          <p className="text-xs text-gray-500">$45/endpoint/month</p>
                        </div>
                        <input 
                          type="text" 
                          id={`${planId}-endpoint-count`} 
                          className="w-20 px-2 py-1 border rounded text-right"
                          value={endpointCount[planId]}
                          onChange={(e) => handleEndpointCountChange(planId, e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <label htmlFor={`${planId}-app-count`} className="text-sm font-medium">Application (Business Functionality)</label>
                          <p className="text-xs text-gray-500">$55/application/month</p>
                        </div>
                        <input 
                          type="text" 
                          id={`${planId}-app-count`} 
                          className="w-20 px-2 py-1 border rounded text-right"
                          value={appCount[planId]}
                          onChange={(e) => handleAppCountChange(planId, e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    {/* Auto-select notification */}
                    {showAutoSelectNotification[planId] && (
                      <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                        <Check className="inline-block h-4 w-4 mr-1" />
                        Recommended services have been auto-selected for your infrastructure.
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Optional Add-ons:</h4>
                      <div className="flex gap-3">
                        <button 
                          type="button"
                          onClick={() => {
                            // Create a new object with all addons checked
                            const allAddons: Record<string, boolean> = {};
                            plan.addons.forEach(addon => {
                              allAddons[addon.id] = true;
                            });
                            
                            // Update selected addons for this plan
                            setSelectedAddons(prev => ({
                              ...prev,
                              [planId]: allAddons
                            }));
                            
                            // Show notification
                            setShowAutoSelectNotification(prev => ({
                              ...prev,
                              [planId]: true
                            }));
                            
                            // Hide notification after 5 seconds
                            setTimeout(() => {
                              setShowAutoSelectNotification(prev => ({
                                ...prev,
                                [planId]: false
                              }));
                            }, 5000);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          Check All
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            // Update selected addons for this plan to empty object
                            setSelectedAddons(prev => ({
                              ...prev,
                              [planId]: {}
                            }));
                          }}
                          className="text-xs text-red-600 hover:text-red-800 underline"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                    
                    {showAutoSelectNotification[planId] && (
                      <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                        <p><Check className="inline-block h-4 w-4 mr-1" />Recommended services selected based on your infrastructure.</p>
                        <p className="text-xs mt-1">You can customize your selections below as needed.</p>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      {plan.addons.map((addon) => (
                        <div key={addon.id} className="flex justify-between items-center">
                          <div className="flex items-start">
                            <input 
                              type="checkbox" 
                              id={`${planId}-${addon.id}`} 
                              className="mt-1 mr-2"
                              checked={!!selectedAddons[planId][addon.id]}
                              onChange={(e) => handleAddonChange(planId, addon.id, e.target.checked)}
                            />
                            <label htmlFor={`${planId}-${addon.id}`} className="text-sm">{addon.label}</label>
                          </div>
                          <span className="text-sm font-medium">{addon.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-6">
                    <button 
                      onClick={() => setSelectedPlan(planId)}
                      className={`w-full ${isSelected ? 'bg-secondary' : 'bg-primary'} hover:bg-primary/90 text-white py-3 rounded-md transition duration-150 ease-in-out font-medium`}
                    >
                      {isSelected ? 'Selected' : 'Select Plan'}
                    </button>
                    
                    {isSelected && (
                      <Button 
                        onClick={proceedToCheckout}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium flex items-center justify-center"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Proceed to Secure Checkout
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 text-center">
          <Badge className="mb-2 bg-secondary text-white">SECURE PAYMENT</Badge>
          <p className="text-neutral-600 text-sm">All payments are secured with ECSMID encryption technology.</p>
        </div>
      </div>
    </section>
  );
}
