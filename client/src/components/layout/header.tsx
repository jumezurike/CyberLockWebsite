import { useState } from "react";
import { Link, useLocation } from "wouter";
import logoImage from "@/assets/cyberlockx-logo-resized.png";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isHomePage = location === "/";
  const isSos2aToolPage = location === "/sos2a-tool";
  
  // Helper function to navigate to a section
  const navigateToSection = (sectionId: string) => (e: React.MouseEvent) => {
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
    <nav className="bg-primary shadow-md sticky top-0 z-50 relative overflow-hidden">
      {/* Cyber grid overlay - similar to footer but subtle */}
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
      
      {/* Circuit connections - subtle for header */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" className="opacity-20">
          <line x1="10%" y1="50%" x2="30%" y2="50%" stroke="rgba(142, 255, 150, 0.5)" strokeWidth="0.5" />
          <circle cx="30%" cy="50%" r="2" fill="rgba(255, 255, 255, 0.5)" />
          
          <line x1="70%" y1="50%" x2="90%" y2="50%" stroke="rgba(142, 255, 150, 0.5)" strokeWidth="0.5" />
          <circle cx="70%" cy="50%" r="2" fill="rgba(255, 255, 255, 0.5)" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between h-28">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <img 
                  src={logoImage} 
                  alt="CyberLockX Logo" 
                  className="h-24 w-auto"
                />
              </Link>
            </div>
            {!isSos2aToolPage && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href={getHashLink("features")} onClick={navigateToSection("features")} className="text-white hover:text-secondary border-transparent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Features
                </a>
                <a href={getHashLink("solution")} onClick={navigateToSection("solution")} className="text-neutral-100 hover:text-secondary border-transparent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Solution
                </a>
                <a href={getHashLink("sos2a")} onClick={navigateToSection("sos2a")} className="text-neutral-100 hover:text-secondary border-transparent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  SOS²A
                </a>
                <a href={getHashLink("afaai")} onClick={navigateToSection("afaai")} className="text-neutral-100 hover:text-secondary border-transparent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  AFAAI
                </a>
                <a href={getHashLink("roadmap")} onClick={navigateToSection("roadmap")} className="text-neutral-100 hover:text-secondary border-transparent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Roadmap
                </a>
              </div>
            )}
            {!isSos2aToolPage && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href={getHashLink("pricing")} onClick={navigateToSection("pricing")} className="text-neutral-100 hover:text-secondary border-transparent inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Pricing
                </a>
              </div>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-neutral-100 hover:text-secondary border-transparent flex items-center px-1 pt-1 text-sm font-medium">
                About Us <ChevronDown className="h-4 w-4 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-primary border border-neutral-700">
                <DropdownMenuItem asChild>
                  <Link href="/about-us" className="text-neutral-100 hover:text-secondary cursor-pointer">
                    Company Info
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={getHashLink("patents")} onClick={navigateToSection("patents")} className="text-neutral-100 hover:text-secondary cursor-pointer">
                    Patents
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={getHashLink("video-demo")} onClick={navigateToSection("video-demo")} className="text-neutral-100 hover:text-secondary cursor-pointer">
                    Video Demo
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="text-neutral-100 hover:text-secondary cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/lightbulb-moments" className="text-neutral-100 hover:text-secondary cursor-pointer">
                    Lightbulb Moments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/accessibility-demo" className="text-neutral-100 hover:text-secondary cursor-pointer">
                    Accessibility Demo
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/rasbita" className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 mr-2 rounded-md shadow-sm transition duration-150 ease-in-out flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              RASBITA
            </Link>
            <Link href="/sos2a-tool" className="bg-secondary hover:bg-green-600 text-white py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out">
              Get Started
            </Link>
          </div>
          <div className="flex items-center sm:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-white hover:text-secondary"
              aria-label="Toggle mobile menu"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {!isSos2aToolPage && (
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href={getHashLink("features")} onClick={(e) => { navigateToSection("features")(e); closeMobileMenu(); }} className="text-white hover:text-secondary block px-3 py-2 rounded-md text-base font-medium">
              Features
            </a>
            <a href={getHashLink("solution")} onClick={(e) => { navigateToSection("solution")(e); closeMobileMenu(); }} className="text-neutral-100 hover:text-secondary block px-3 py-2 rounded-md text-base font-medium">
              Solution
            </a>
            <a href={getHashLink("sos2a")} onClick={(e) => { navigateToSection("sos2a")(e); closeMobileMenu(); }} className="text-neutral-100 hover:text-secondary block px-3 py-2 rounded-md text-base font-medium">
              SOS²A
            </a>
            <a href={getHashLink("afaai")} onClick={(e) => { navigateToSection("afaai")(e); closeMobileMenu(); }} className="text-neutral-100 hover:text-secondary block px-3 py-2 rounded-md text-base font-medium">
              AFAAI
            </a>
            <a href={getHashLink("roadmap")} onClick={(e) => { navigateToSection("roadmap")(e); closeMobileMenu(); }} className="text-neutral-100 hover:text-secondary block px-3 py-2 rounded-md text-base font-medium">
              Roadmap
            </a>
            <a href={getHashLink("pricing")} onClick={(e) => { navigateToSection("pricing")(e); closeMobileMenu(); }} className="text-neutral-100 hover:text-secondary block px-3 py-2 rounded-md text-base font-medium">
              Pricing
            </a>
          
          <div className="mt-3 mb-1 px-3 text-xs uppercase text-neutral-400 font-semibold">
            About Us
          </div>
          <Link href="/about-us" onClick={closeMobileMenu} className="text-neutral-100 hover:text-secondary block px-3 py-2 rounded-md text-base font-medium pl-6">
            Company Info
          </Link>
          <a href={getHashLink("patents")} onClick={(e) => { navigateToSection("patents")(e); closeMobileMenu(); }} className="text-neutral-100 hover:text-secondary block px-3 py-2 rounded-md text-base font-medium pl-6">
            Patents
          </a>
          <a href={getHashLink("video-demo")} onClick={(e) => { navigateToSection("video-demo")(e); closeMobileMenu(); }} className="text-neutral-100 hover:text-secondary block px-3 py-2 rounded-md text-base font-medium pl-6">
            Video Demo
          </a>
          <Link href="/dashboard" onClick={closeMobileMenu} className="text-neutral-100 hover:text-secondary block px-3 py-2 rounded-md text-base font-medium pl-6">
            Dashboard
          </Link>
          <Link href="/lightbulb-moments" onClick={closeMobileMenu} className="text-neutral-100 hover:text-secondary block px-3 py-2 rounded-md text-base font-medium pl-6">
            Lightbulb Moments
          </Link>
          <Link href="/rasbita" onClick={closeMobileMenu} className="bg-red-600 hover:bg-red-700 text-white block text-center mt-3 px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            RASBITA Crisis Tool
          </Link>
            <Link href="/sos2a-tool" onClick={closeMobileMenu} className="bg-secondary hover:bg-green-600 text-white block text-center mt-3 px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
