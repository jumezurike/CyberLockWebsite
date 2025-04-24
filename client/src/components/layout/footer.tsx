import { Link } from "wouter";
import logoImage from "@/assets/cyberlockx-logo-new.png";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img 
                src={logoImage} 
                alt="CyberLockX Logo" 
                className="h-24 w-auto mb-3"
              />
            </div>
            <p className="text-neutral-300 mb-4">The Ultimate SMB Application Security Hub for small and medium-sized businesses.</p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent">
                <i className="fab fa-facebook"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              <li><Link href="/#sos2a" className="text-neutral-300 hover:text-white">SOS²A</Link></li>
              <li><Link href="/#features" className="text-neutral-300 hover:text-white">Secure Cloud (Google Docs/Sheets)</Link></li>
              <li><Link href="/#features" className="text-neutral-300 hover:text-white">Secure Meet</Link></li>
              <li><Link href="/#features" className="text-neutral-300 hover:text-white">Secure Payment</Link></li>
              <li><Link href="/#features" className="text-neutral-300 hover:text-white">Secure Business Cloud</Link></li>
              <li><Link href="/#features" className="text-neutral-300 hover:text-white">Secure True Digital ID</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/#" className="text-neutral-300 hover:text-white">Blog</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-white">Knowledge Base</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-white">Case Studies</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-white">Security Reports</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-white">Compliance Guides</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/#" className="text-neutral-300 hover:text-white">About Us</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-white">Careers</Link></li>
              <li><Link href="/#contact" className="text-neutral-300 hover:text-white">Contact</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-white">Partners</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-white">Legal</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-300 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} CyberLockX. All rights reserved. Protected by U.S. Patents 10,911,217, 10,999,276, 11,367,065.</p>
          <div className="flex space-x-6">
            <Link href="/#" className="text-neutral-300 hover:text-white text-sm">Privacy Policy</Link>
            <Link href="/#" className="text-neutral-300 hover:text-white text-sm">Terms of Service</Link>
            <Link href="/#" className="text-neutral-300 hover:text-white text-sm">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
