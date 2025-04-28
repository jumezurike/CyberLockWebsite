import { useState } from "react";

export default function AfaaiBrowser() {
  const [activeTab, setActiveTab] = useState("secure-docs");
  
  // Define our SMB applications
  const applications = [
    { id: "secure-docs", name: "Secure Docs" },
    { id: "secure-meet", name: "Secure Meet" },
    { id: "secure-payment", name: "Secure Payment" },
    { id: "secure-id", name: "True Digital ID" }
  ];
  
  // Define the security features for each application
  const securityFeatures = {
    "secure-docs": [
      "Real-time document encryption",
      "Ethnic language input protection",
      "Zero-knowledge sharing",
      "Invisible watermarking"
    ],
    "secure-meet": [
      "End-to-end video encryption",
      "Voice pattern authentication",
      "Multi-language transcription security",
      "Context-aware access control"
    ],
    "secure-payment": [
      "Quantum-resistant transactions",
      "Multi-factor biometric verification",
      "Cross-cultural fraud detection",
      "Zero-knowledge proof validation"
    ],
    "secure-id": [
      "Immutable identity verification",
      "Language-resistant phishing protection",
      "Cultural context authentication",
      "Decentralized credential storage"
    ]
  };

  return (
    <div className="relative">
      {/* Central "heart" badge */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-secondary text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg border-2 border-white animate-pulse">
          REVOLUTIONARY SECURITY CORE ENGINE
        </div>
      </div>
    
      <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-2xl border-2 border-primary/30">
        {/* Browser chrome */}
        <div className="bg-neutral-900 px-4 py-3 flex items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="ml-4 flex-1">
            <div className="bg-neutral-700 rounded-md h-7 flex items-center px-3 text-neutral-400 text-xs">
              <span className="hidden sm:inline">https://</span>secure.cyberlockx.xyz
              <div className="ml-auto flex items-center">
                <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded">
                  PROTECTED BY AFAAI
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-neutral-800 px-4 pt-3 flex border-b border-neutral-700">
          {applications.map((app) => (
            <button
              key={app.id}
              onClick={() => setActiveTab(app.id)}
              className={`px-4 py-2 text-sm rounded-t-md transition ${
                activeTab === app.id
                  ? "bg-neutral-700 text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {app.name}
            </button>
          ))}
        </div>
        
        {/* Content area */}
        <div className="p-6 min-h-[320px]">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2">
              <div className="relative h-64 bg-neutral-700 rounded-lg flex items-center justify-center overflow-hidden">
                {activeTab === "secure-docs" && (
                  <div className="w-full h-full p-4">
                    <div className="bg-white bg-opacity-10 p-3 rounded mb-2">
                      <div className="w-3/4 h-3 bg-white bg-opacity-20 rounded"></div>
                      <div className="mt-2 w-full h-2 bg-white bg-opacity-20 rounded"></div>
                      <div className="mt-1 w-full h-2 bg-white bg-opacity-20 rounded"></div>
                      <div className="mt-1 w-5/6 h-2 bg-white bg-opacity-20 rounded"></div>
                    </div>
                    <div className="bg-white bg-opacity-10 p-3 rounded">
                      <div className="w-2/3 h-3 bg-white bg-opacity-20 rounded"></div>
                      <div className="mt-2 w-full h-2 bg-white bg-opacity-20 rounded"></div>
                      <div className="mt-1 w-full h-2 bg-white bg-opacity-20 rounded"></div>
                    </div>
                  </div>
                )}
                {activeTab === "secure-meet" && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-2 w-full p-3">
                      <div className="bg-primary bg-opacity-20 rounded-lg h-28 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary bg-opacity-30"></div>
                      </div>
                      <div className="bg-primary bg-opacity-20 rounded-lg h-28 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary bg-opacity-30"></div>
                      </div>
                      <div className="bg-primary bg-opacity-20 rounded-lg h-28 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary bg-opacity-30"></div>
                      </div>
                      <div className="bg-primary bg-opacity-20 rounded-lg h-28 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary bg-opacity-30"></div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "secure-payment" && (
                  <div className="w-full h-full p-6">
                    <div className="bg-white bg-opacity-10 p-4 rounded mb-4">
                      <div className="w-full h-6 bg-white bg-opacity-20 rounded mb-3"></div>
                      <div className="flex gap-2">
                        <div className="w-1/2 h-10 bg-white bg-opacity-20 rounded"></div>
                        <div className="w-1/2 h-10 bg-white bg-opacity-20 rounded"></div>
                      </div>
                      <div className="mt-3 w-full h-10 bg-white bg-opacity-20 rounded"></div>
                      <div className="mt-3 w-1/2 h-10 bg-accent rounded mx-auto"></div>
                    </div>
                  </div>
                )}
                {activeTab === "secure-id" && (
                  <div className="w-full h-full p-5">
                    <div className="bg-white bg-opacity-10 p-4 rounded-lg flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 mb-3"></div>
                      <div className="w-3/4 h-3 bg-white bg-opacity-20 rounded mb-2"></div>
                      <div className="w-1/2 h-3 bg-white bg-opacity-20 rounded mb-4"></div>
                      <div className="w-full grid grid-cols-2 gap-2">
                        <div className="h-8 bg-white bg-opacity-20 rounded"></div>
                        <div className="h-8 bg-white bg-opacity-20 rounded"></div>
                        <div className="h-8 bg-white bg-opacity-20 rounded"></div>
                        <div className="h-8 bg-white bg-opacity-20 rounded"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* AFAAI security shield overlay */}
                <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  AFAAI Protected
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-bold text-white mb-4">AFAAI Security Features</h3>
              <ul className="space-y-3">
                {securityFeatures[activeTab as keyof typeof securityFeatures].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-accent/20 text-accent flex items-center justify-center mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-3 bg-neutral-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white font-medium">AFAAI Security Insights</span>
                </div>
                <p className="text-neutral-300 text-sm">
                  Our AFAAI language engine is actively monitoring and protecting this application, ensuring security 
                  across all communications including low-resource languages through our unified alphabet system (ΣU).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}