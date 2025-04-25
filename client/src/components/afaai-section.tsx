import { Link } from "wouter";
import AfaaiBrowser from "./afaai-browser";

export default function AfaaiSection() {
  return (
    <section id="afaai" className="py-16 bg-gradient-to-b from-primary/5 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Triple-Patented Core Technology
          </div>
          <h2 className="text-3xl font-bold font-heading text-primary mb-4">
            AFAAI Browser: The Heart of Our Security Revolution
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Our revolutionary AFAAI (Adaptive Functional Artificial Augmented Intelligence) Browser technology forms the 
            central nervous system of the entire CyberLockX security ecosystem, fundamentally transforming how healthcare applications 
            are protected in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">How AFAAI Strengthens Your Security</h3>
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-primary">Unified Security Framework</h4>
                  <p className="text-neutral-600">
                    AFAAI provides a cohesive security architecture that spans all our applications, ensuring consistent
                    protection regardless of which apps you use.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-primary">Real-time Threat Detection</h4>
                  <p className="text-neutral-600">
                    Our AFAAI engine constantly monitors for security threats in real-time, analyzing patterns
                    and behaviors across applications to proactively identify risks.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-primary">AI-Powered Adaptability</h4>
                  <p className="text-neutral-600">
                    Leveraging its unique approach to language processing, AFAAI learns from every interaction,
                    continuously strengthening your security posture against evolving threats.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-xl shadow-xl p-8 border border-primary/20">
              <h3 className="text-xl font-bold text-primary mb-6">The AFAAI Cyberdefense Innovation</h3>
              <div className="space-y-4">
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">Unified Alphabet System (Σ<sub>U</sub>)</h4>
                  <p className="text-sm text-neutral-600">
                    Our proprietary Σ<sub>U</sub> system enables AFAAI to process information across languages with unprecedented accuracy,
                    creating a more secure environment for global businesses.
                  </p>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">Low-Resource Language Model Integration</h4>
                  <p className="text-sm text-neutral-600">
                    AFAAI elevates ethnic languages from translation-only status to core AI components,
                    enabling more comprehensive security monitoring across global communications.
                  </p>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">Defense Through Cultural Context</h4>
                  <p className="text-sm text-neutral-600">
                    By understanding the cultural nuances of communication, AFAAI can detect social engineering
                    and phishing attempts that traditional security solutions might miss.
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/early-access" className="inline-block w-full text-center bg-secondary hover:bg-secondary/90 text-white py-3 px-6 rounded-lg font-medium">
                  Learn More About AFAAI Access
                </Link>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-accent text-white text-xs px-4 py-2 rounded-full font-bold transform rotate-12">
              Patent-Pending
            </div>
          </div>
        </div>
        
        <div className="mt-16 relative">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
            <div className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-full text-sm font-bold shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              THE CORE TECHNOLOGY
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-3xl pt-16 pb-12 px-6 sm:px-12 border-2 border-primary/30 shadow-2xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
              <div className="absolute w-96 h-96 bg-secondary rounded-full -top-20 -left-20 mix-blend-overlay"></div>
              <div className="absolute w-96 h-96 bg-primary rounded-full -bottom-20 -right-20 mix-blend-overlay"></div>
            </div>
            
            {/* Content container with higher z-index */}
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-primary text-center mb-6">The AFAAI Browser: Healthcare Security Revolution</h3>
              <p className="text-lg text-neutral-700 text-center max-w-3xl mx-auto mb-8">
                <span className="font-semibold text-primary">The AFAAI Browser is the beating heart of the Healthcare Application Security Hub</span> — 
                a groundbreaking command center that transcends conventional security approaches by fusing 
                triple-patented language technology with real-time threat intelligence across all secure applications.
              </p>
              
              <AfaaiBrowser />
              
              <div className="mt-8 text-center">
                <Link href="/early-access" className="inline-flex items-center px-6 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-lg font-medium shadow-md transition-all hover:shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  Get Early Access to AFAAI Browser Technology
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}