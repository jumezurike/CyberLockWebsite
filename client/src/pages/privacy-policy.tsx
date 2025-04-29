import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Privacy Policy</h1>
          <p className="text-neutral-600">Last Updated: April 29, 2025</p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <h2>1. Introduction</h2>
          <p>
            At CyberLockX ("we", "our", or "us"), we respect your privacy and are committed to protecting your personal data. 
            This privacy policy explains how we collect, use, and safeguard your information when you use our website and security assessment services.
          </p>
          
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Personal Information</h3>
          <p>We may collect the following types of personal information:</p>
          <ul>
            <li>Contact information (name, email address, phone number, business name)</li>
            <li>Account information when you register</li>
            <li>Information provided when completing security assessments</li>
            <li>Technical data about your devices and systems for security analysis</li>
            <li>Business information necessary for providing our cybersecurity services</li>
          </ul>
          
          <h3>2.2 Technical Information</h3>
          <p>
            When you visit our website, we automatically collect certain information about your device and browsing actions. 
            This may include your IP address, browser type, operating system, and other technical information.
          </p>
          
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our security assessment services</li>
            <li>Generate security reports and recommendations</li>
            <li>Process payments and manage your account</li>
            <li>Send you service updates and promotional communications</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Conduct research and analysis to improve our services</li>
            <li>Comply with legal obligations</li>
          </ul>
          
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information from unauthorized access, 
            disclosure, alteration, or destruction. These measures include encryption, secure server infrastructure, 
            and strict access controls.
          </p>
          
          <h2>5. Data Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Service providers who perform services on our behalf</li>
            <li>Professional advisors (lawyers, accountants, etc.)</li>
            <li>Regulatory authorities when required by law</li>
          </ul>
          <p>
            We do not sell your personal information to third parties.
          </p>
          
          <h2>6. Your Rights</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li>Access to the personal information we hold about you</li>
            <li>Correction of inaccurate information</li>
            <li>Deletion of your personal information</li>
            <li>Restriction of processing of your personal information</li>
            <li>Data portability</li>
            <li>Objection to processing of your personal information</li>
          </ul>
          
          <h2>7. Cookie Policy</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and store certain information. 
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
          
          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
            and updating the "Last Updated" date at the top of this page.
          </p>
          
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> privacy@cyberlockx.xyz<br />
            <strong>Address:</strong> CyberLockX Headquarters, 123 Security Drive, Cyber City, TX 12345
          </p>
          
          <div className="mt-12 text-center">
            <Link href="/" className="text-primary hover:text-primary/80">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}