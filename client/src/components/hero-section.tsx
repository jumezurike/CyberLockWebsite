import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-chart-4 to-blue-600 text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight mb-2">
              CyberLockX
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-secondary font-bold">
              Securing every CLICK!!!
            </p>
            <h2 className="text-2xl md:text-3xl font-bold font-heading leading-tight mb-4">
              The Ultimate SMB Application Security Hub
            </h2>
            <p className="mb-8 text-neutral-200">
              The only SMB platform that eliminates threats, automates compliance, and unifies business apps—with patented quantum-safe encryption and cell-level data protection at its core.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#demo" className="bg-secondary hover:bg-green-600 text-white py-3 px-6 rounded-md shadow-md transition duration-150 ease-in-out text-center font-medium">
                Watch Demo
              </a>
              <a href="#pricing" className="bg-transparent hover:bg-white/10 text-white border border-white py-3 px-6 rounded-md transition duration-150 ease-in-out text-center font-medium">
                View Pricing
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative bg-white/10 rounded-lg p-6 backdrop-blur-sm shadow-xl">
              <div className="absolute -top-3 -right-3 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-md">
                PATENTED SECURITY
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-chart-4/30 rounded-full flex items-center justify-center">
                    <i className="fas fa-shield-alt text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold">Triple-Patented Protection</h3>
                    <p className="text-sm text-neutral-200">Quantum-resistant encryption at its core</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-chart-4/30 rounded-full flex items-center justify-center">
                    <i className="fas fa-file-alt text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold">Automated Compliance</h3>
                    <p className="text-sm text-neutral-200">ISO, SOC, and GDPR reporting</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-chart-4/30 rounded-full flex items-center justify-center">
                    <i className="fas fa-layer-group text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold">Unified Business Apps</h3>
                    <p className="text-sm text-neutral-200">Everything in one secure hub</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link href="/sos2a-tool" className="inline-block bg-white text-chart-4 hover:bg-neutral-100 py-2 px-4 rounded-md transition duration-150 ease-in-out font-medium">
                  Start Free Assessment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
