import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Terms of Service</h1>
          <p className="text-neutral-600">Last Updated: April 29, 2025</p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            Welcome to CyberLockX. By accessing or using our website, software, or services (collectively, the "Services"), 
            you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Services.
          </p>
          
          <h2>2. Services Description</h2>
          <p>
            CyberLockX provides cybersecurity assessment, monitoring, and protection services for healthcare organizations. 
            Our Services include the SOS²A assessment tool, RASBITA risk analysis, threat modeling, and other cybersecurity solutions.
          </p>
          
          <h2>3. Account Registration</h2>
          <p>
            To access certain features of our Services, you may be required to register for an account. You agree to provide 
            accurate, current, and complete information during the registration process and to update such information to keep 
            it accurate, current, and complete.
          </p>
          
          <h2>4. Intellectual Property Rights</h2>
          <p>
            All content, features, and functionality of our Services, including but not limited to all information, software, 
            text, displays, images, video, and audio, and the design, selection, and arrangement thereof, are owned by CyberLockX, 
            its licensors, or other providers of such material and are protected by United States and international copyright, 
            trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
          <p>
            CyberLockX's cybersecurity technologies are protected by U.S. Patents 10,911,217, 10,999,276, 11,367,065 and other 
            pending patent applications.
          </p>
          
          <h2>5. Permitted Use</h2>
          <p>
            We grant you a limited, non-exclusive, non-transferable, revocable license to access and use our Services for your 
            internal business purposes, subject to these Terms of Service.
          </p>
          
          <h2>6. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use our Services for any illegal purpose or in violation of any local, state, national, or international law</li>
            <li>Violate or infringe upon the rights of others, including their intellectual property rights</li>
            <li>Attempt to circumvent any security features of our Services</li>
            <li>Interfere with or disrupt the integrity or performance of our Services</li>
            <li>Engage in unauthorized framing or linking to our Services</li>
            <li>Attempt to reverse engineer, decompile, or disassemble any portion of our Services</li>
          </ul>
          
          <h2>7. User Content</h2>
          <p>
            When you submit information, data, or other content to our Services, you grant us a worldwide, non-exclusive, 
            royalty-free license to use, reproduce, modify, and distribute such content for the purpose of providing our Services.
          </p>
          
          <h2>8. Payment Terms</h2>
          <p>
            Certain Services may require payment. By selecting a paid Service, you agree to pay the fees indicated. All payments 
            are non-refundable unless otherwise specified. We may change our fees at any time upon notice.
          </p>
          
          <h2>9. Disclaimer of Warranties</h2>
          <p>
            OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. 
            WE DO NOT WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT 
            OUR SERVICES ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
          </p>
          
          <h2>10. Limitation of Liability</h2>
          <p>
            IN NO EVENT WILL CYBERLOCKX OR ITS AFFILIATES BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR 
            PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO THESE TERMS OR YOUR USE OF THE SERVICES.
          </p>
          
          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless CyberLockX and its officers, directors, employees, and agents from any claims, 
            liabilities, damages, losses, and expenses arising from your use of the Services or your violation of these Terms.
          </p>
          
          <h2>12. Termination</h2>
          <p>
            We may terminate or suspend your access to our Services immediately, without prior notice or liability, for any reason.
          </p>
          
          <h2>13. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of Texas, without regard to 
            its conflict of law provisions.
          </p>
          
          <h2>14. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice of any material changes by updating 
            the "Last Updated" date at the top of these Terms.
          </p>
          
          <h2>15. Contact Information</h2>
          <p>
            For questions about these Terms, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> legal@cyberlockx.xyz<br />
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