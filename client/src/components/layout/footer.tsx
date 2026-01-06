import { Link, useLocation } from "wouter";
import type { MouseEvent } from "react";
import logoImage from "@/assets/cyberlockx-logo-resized.png";

export default function Footer() {
  const [location] = useLocation();
  const isHomePage = location === "/";
  
  // Helper function to navigate to a section
  const navigateToSection = (sectionId: string) => (e: MouseEvent) => {
    e.preventDefault();
    
    // If not on home page, go to home page first
    if (!isHomePage) {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    // If on home page, scroll to the section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const getHashLink = (hash: string) => isHomePage ? `#${hash}` : `/#${hash}`;
  
  return (
    <footer className="bg-primary text-white py-12 relative overflow-hidden">
      {/* Cyber grid overlay - more subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(142, 255, 150, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(142, 255, 150, 0.15) 1px, transparent 1px),
              radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px, 30px 30px, 60px 60px',
            backgroundPosition: '0 0, 0 0, 0 0',
            opacity: 0.5
          }}
        ></div>
      </div>
      
      {/* Circuit connections - more subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" className="opacity-20">
          <line x1="5%" y1="20%" x2="20%" y2="20%" stroke="rgba(142, 255, 150, 0.5)" strokeWidth="0.5" />
          <line x1="20%" y1="20%" x2="20%" y2="80%" stroke="rgba(142, 255, 150, 0.5)" strokeWidth="0.5" />
          <circle cx="20%" cy="20%" r="2" fill="rgba(255, 255, 255, 0.5)" />
          
          <line x1="80%" y1="15%" x2="95%" y2="15%" stroke="rgba(142, 255, 150, 0.5)" strokeWidth="0.5" />
          <line x1="80%" y1="15%" x2="80%" y2="85%" stroke="rgba(142, 255, 150, 0.5)" strokeWidth="0.5" />
          <circle cx="80%" cy="15%" r="2" fill="rgba(255, 255, 255, 0.5)" />
          
          <line x1="40%" y1="5%" x2="40%" y2="95%" stroke="rgba(142, 255, 150, 0.5)" strokeWidth="0.5" />
          <line x1="40%" y1="50%" x2="60%" y2="50%" stroke="rgba(142, 255, 150, 0.5)" strokeWidth="0.5" />
          <circle cx="40%" cy="50%" r="2" fill="rgba(255, 255, 255, 0.5)" />
          <circle cx="60%" cy="50%" r="2" fill="rgba(255, 255, 255, 0.5)" />
          
          <line x1="25%" y1="85%" x2="75%" y2="85%" stroke="rgba(142, 255, 150, 0.5)" strokeWidth="0.5" />
        </svg>
      </div>
      
      {/* Binary code - more subtle */}
      <div className="absolute inset-0 pointer-events-none opacity-15">
        <div className="absolute top-1/4 left-1/5 text-secondary text-opacity-40 font-mono text-xs">
          10110101
        </div>
        <div className="absolute top-2/3 left-3/4 text-secondary text-opacity-40 font-mono text-xs">
          01101001
        </div>
        <div className="absolute top-3/4 left-1/4 text-secondary text-opacity-40 font-mono text-xs">
          11001010
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div>
            <div className="mb-4">
              <img 
                src={logoImage} 
                alt="CyberLockX Logo" 
                className="h-36 w-auto mb-3"
              />
            </div>
            <p className="text-secondary mb-1 font-bold text-xl">Securing every CLICK!!!</p>
            <p className="text-neutral-300 mb-4">Healthcare Apps & Devices Security Hub (HASH)</p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-secondary">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-secondary">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-secondary">
                <i className="fab fa-facebook"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              <li><a href={getHashLink("sos2a")} onClick={navigateToSection("sos2a")} className="text-neutral-300 hover:text-secondary cursor-pointer">SOS²A</a></li>
              <li><a href={getHashLink("features")} onClick={navigateToSection("features")} className="text-neutral-300 hover:text-secondary cursor-pointer">Secure Cloud (Google Docs/Sheets)</a></li>
              <li><a href={getHashLink("features")} onClick={navigateToSection("features")} className="text-neutral-300 hover:text-secondary cursor-pointer">Secure Meet</a></li>
              <li><a href={getHashLink("features")} onClick={navigateToSection("features")} className="text-neutral-300 hover:text-secondary cursor-pointer">Secure Payment</a></li>
              <li><a href={getHashLink("features")} onClick={navigateToSection("features")} className="text-neutral-300 hover:text-secondary cursor-pointer">Secure Business Cloud</a></li>
              <li><a href={getHashLink("features")} onClick={navigateToSection("features")} className="text-neutral-300 hover:text-secondary cursor-pointer">Secure True Digital ID</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/#" className="text-neutral-300 hover:text-secondary">Blog</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-secondary">Knowledge Base</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-secondary">Case Studies</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-secondary">Security Reports</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-secondary">Compliance Guides</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about-us" className="text-neutral-300 hover:text-secondary">About Us</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-secondary">Careers</Link></li>
              <li><a href={getHashLink("contact")} onClick={navigateToSection("contact")} className="text-neutral-300 hover:text-secondary cursor-pointer">Contact</a></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-secondary">Partners</Link></li>
              <li><Link href="/privacy-policy" className="text-neutral-300 hover:text-secondary">Legal Documents</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Developers</h4>
            <ul className="space-y-2">
              <li><Link href="/accessibility-demo" className="text-neutral-300 hover:text-secondary">Accessibility Demo</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-secondary">API Documentation</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-secondary">Technical Guides</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-secondary">Integration Resources</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-300 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} CyberLockX. All rights reserved. Protected by U.S. Patents 10,911,217, 10,999,276, 11,367,065.</p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-neutral-300 hover:text-secondary text-sm">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-neutral-300 hover:text-secondary text-sm">Terms of Service</Link>
            <Link href="/data-use-policy" className="text-neutral-300 hover:text-secondary text-sm">Data Use Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
