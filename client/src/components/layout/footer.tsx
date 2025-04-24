import { Link } from "wouter";
import logoImage from "@/assets/cyberlockx-logo-resized.png";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12 cyber-bg cyber-bg-enhanced">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img 
                src={logoImage} 
                alt="CyberLockX Logo" 
                className="h-36 w-auto mb-3"
              />
            </div>
            <p className="text-secondary mb-1 font-bold text-xl">Securing every CLICK!!!</p>
            <p className="text-neutral-300 mb-4">The Ultimate SMB Application Security Hub</p>
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
              <li><Link href="/#sos2a" className="text-neutral-300 hover:text-secondary">SOS²A</Link></li>
              <li><Link href="/#features" className="text-neutral-300 hover:text-secondary">Secure Cloud (Google Docs/Sheets)</Link></li>
              <li><Link href="/#features" className="text-neutral-300 hover:text-secondary">Secure Meet</Link></li>
              <li><Link href="/#features" className="text-neutral-300 hover:text-secondary">Secure Payment</Link></li>
              <li><Link href="/#features" className="text-neutral-300 hover:text-secondary">Secure Business Cloud</Link></li>
              <li><Link href="/#features" className="text-neutral-300 hover:text-secondary">Secure True Digital ID</Link></li>
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
              <li><Link href="/#" className="text-neutral-300 hover:text-secondary">About Us</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-secondary">Careers</Link></li>
              <li><Link href="/#contact" className="text-neutral-300 hover:text-secondary">Contact</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-secondary">Partners</Link></li>
              <li><Link href="/#" className="text-neutral-300 hover:text-secondary">Legal</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-300 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} CyberLockX. All rights reserved. Protected by U.S. Patents 10,911,217, 10,999,276, 11,367,065.</p>
          <div className="flex space-x-6">
            <Link href="/#" className="text-neutral-300 hover:text-secondary text-sm">Privacy Policy</Link>
            <Link href="/#" className="text-neutral-300 hover:text-secondary text-sm">Terms of Service</Link>
            <Link href="/#" className="text-neutral-300 hover:text-secondary text-sm">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
