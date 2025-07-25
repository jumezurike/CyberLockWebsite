import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Shield, 
  Target, 
  Users,
  AlertTriangle,
  Info,
  Lightbulb
} from 'lucide-react';
import mikePhoto from '@/assets/team/mike-ikonomou-final.png';
import josiahPhoto from '@/assets/team/josiah-umezurike.png';
import solomonPhoto from '@/assets/team/solomon-sogunro.jpg';
import christopherPhoto from '@/assets/team/christopher-amato.jpg';
import georgeOseiPhoto from '@assets/GeorgeOsei_1751650545585.png';
import marcoBenjaminPhoto from '@assets/Remove-BGR-photoaidcom-cropped_1752784297774.png';

const AboutUs = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Securing Healthcare's Digital Frontline</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Founded in 2022, CyberLockX was born from a stark realization: healthcare organizations of all sizes face unique cybersecurity challenges, 
            yet small and mid-sized healthcare providers receive disproportionately fewer tailored security solutions despite being targeted in 45% of all healthcare breaches 
            <a href="https://www.hipaajournal.com/healthcare-data-breach-statistics/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 ml-1">(HIPAA Journal 2023)</a>. 
            With patient data breaches costing an average of $10.93 million per incident—the highest of any industry 
            <a href="https://www.ibm.com/reports/data-breach" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 ml-1">(IBM Cost of a Data Breach Report 2023)</a>—CyberLockX 
            is democratizing enterprise-grade cybersecurity specifically for healthcare organizations, bringing automated HIPAA compliance and specialized protection for clinical applications and patient data systems.
          </p>
        </div>

        {/* The Problem */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-3">
              <AlertTriangle className="h-7 w-7 text-red-500 mr-2" />
              <h2 className="text-3xl font-bold text-gray-900">The Problem</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-red-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Patient Data at Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Healthcare providers face 821 attacks per week, with sensitive patient data the primary target 
                  <a href="https://www.checkpoint.com/cyber-hub/threat-prevention/ransomware/healthcare-ransomware/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 ml-1">(Check Point)</a>.
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Enterprise Security Gap</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Small and mid-sized healthcare providers lack the resources for comprehensive HIPAA protection despite facing the same compliance requirements as large hospitals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">$10.93M Per Breach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Healthcare breaches cost more than any other industry
                  <a href="https://www.ibm.com/reports/data-breach" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 ml-1">(IBM Security)</a>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Mission */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-3">
              <Target className="h-7 w-7 text-primary mr-2" />
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              We're building accessible, all-in-one cybersecurity for healthcare organizations through six pillars:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-primary/10 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">AFAAI Safe Browser</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Real-time threat blocking with AI-driven encryption.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">SOS²A AI Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Instant breach detection and response.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Integrated Apps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Secure business applications with zero-trust sharing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Secure Cloud</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Protected versions of Google Docs/Sheets for business collaboration.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Hybrid SOC</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Affordable 24/7 monitoring without enterprise pricing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">ECSMID + DatashieldAI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Patented quantum resistance encryption for unbreakable data security.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Now? */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-3">
              <Lightbulb className="h-7 w-7 text-yellow-500 mr-2" />
              <h2 className="text-3xl font-bold text-gray-900">Why Now?</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The healthcare cybersecurity market is ripe for disruption. Healthcare organizations need protection that's:
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-white font-bold mr-3">✅</div>
              <p className="text-gray-700 text-lg">
                <span className="font-medium">Proactive</span> (stopping attacks before they happen)
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-white font-bold mr-3">✅</div>
              <p className="text-gray-700 text-lg">
                <span className="font-medium">Simple</span> (no degree needed to operate)
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-white font-bold mr-3">✅</div>
              <p className="text-gray-700 text-lg">
                <span className="font-medium">Cost-effective</span> (priced for healthcare organization budgets, not just major hospital systems)
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-xl text-gray-800 font-medium">
              Join us in rewriting the rules of healthcare cybersecurity.
            </p>
          </div>
        </div>

        {/* Leadership Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-3">
              <Users className="h-7 w-7 text-primary mr-2" />
              <h2 className="text-3xl font-bold text-gray-900">Our Leadership</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the founders driving innovation in cybersecurity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Josiah Umezurike */}
            <Card className="border-primary/10 shadow-md overflow-hidden">
              <div className="h-56 bg-white relative flex items-center justify-center">
                <div className="w-40 h-40 relative mx-auto">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <img 
                      src={josiahPhoto} 
                      alt="Josiah Umezurike" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Josiah Umezurike</CardTitle>
                <CardDescription className="text-secondary font-medium">
                  Founder / CEO / CTO
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  With a deep expertise in cybersecurity, AI, and network architecture, Josiah leads CyberLockX's
                  technical vision and innovation. His pioneering work resulted in six patents granted with three U.S. patents
                  forming the foundation of our security platform.
                </p>
                <a 
                  href="https://www.linkedin.com/in/josiah-umezurike/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary/80"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn Profile
                </a>
              </CardContent>
            </Card>

            {/* Mike Ikonomou */}
            <Card className="border-primary/10 shadow-md overflow-hidden">
              <div className="h-56 bg-white relative flex items-center justify-center">
                <div className="w-40 h-40 relative mx-auto">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <img 
                      src={mikePhoto} 
                      alt="Mike Ikonomou" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Mike Ikonomou</CardTitle>
                <CardDescription className="text-secondary font-medium">
                  Founder / Co-CEO
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  As Co-CEO, Mike brings extensive software development, business leadership experience at an enterprise level to CyberLockX. 
                  His strategic vision focuses on making enterprise-grade cybersecurity accessible 
                  to healthcare organizations while growing CyberLockX into the leading security platform for 
                  protecting patient data and clinical systems.
                </p>
                <a 
                  href="https://www.linkedin.com/in/mikeikonomou/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary/80"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn Profile
                </a>
              </CardContent>
            </Card>
            
            {/* Christopher Amato */}
            <Card className="border-primary/10 shadow-md overflow-hidden">
              <div className="h-56 bg-white relative flex items-center justify-center">
                <div className="w-40 h-40 relative mx-auto">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <img 
                      src={christopherPhoto} 
                      alt="Christopher Amato" 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Christopher Amato</CardTitle>
                <CardDescription className="text-secondary font-medium">
                  CFO
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Christopher brings his extensive financial expertise and leadership experience to CyberLockX as CFO. 
                  With an MBA and MSE background, he oversees strategic financial planning and business development, 
                  ensuring sustainable growth while helping healthcare organizations protect their critical infrastructure and patient data.
                </p>
                <a 
                  href="https://www.linkedin.com/in/cmamato/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary/80"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn Profile
                </a>
              </CardContent>
            </Card>
            
            {/* Solomon Sogunro */}
            <Card className="border-primary/10 shadow-md overflow-hidden">
              <div className="h-56 bg-white relative flex items-center justify-center">
                <div className="w-40 h-40 relative mx-auto">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <img 
                      src={solomonPhoto} 
                      alt="Solomon Sogunro" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Solomon Sogunro</CardTitle>
                <CardDescription className="text-secondary font-medium">
                  Lead Product Manager
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Solomon is a visionary lead product manager with extensive experience in AI and cybersecurity. 
                  At General Motors, he increased product adoption by 15%, generating $10M in revenue. 
                  His leadership has driven successful initiatives at Nissan and Verizon. 
                  Solomon holds advanced degrees in public administration and history from Brigham Young University.
                </p>
                <a 
                  href="https://www.linkedin.com/in/sol-sogunro/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary/80"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn Profile
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Clinical Advisors Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-3">
              <Shield className="h-7 w-7 text-primary mr-2" />
              <h2 className="text-3xl font-bold text-gray-900">Clinical Advisors</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Healthcare professionals guiding our security solutions for real-world clinical environments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Dr. George E. Osei */}
            <Card className="border-primary/10 shadow-md overflow-hidden">
              <div className="h-56 bg-white relative flex items-center justify-center">
                <div className="w-40 h-40 relative mx-auto">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <img 
                      src={georgeOseiPhoto} 
                      alt="Dr. George E. Osei" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Dr. George E. Osei, MD</CardTitle>
                <CardDescription className="text-secondary font-medium">
                  Clinical Advisor, Healthcare Security & Compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Dr. George E. Osei is a board-certified family medicine physician based in Sumter, South Carolina, with affiliations at Prisma Health Tuomey Hospital and MUSC Health Kershaw Medical Center. He earned his medical degree from West Virginia University School of Medicine and brings over five years of frontline clinical experience treating chronic conditions such as coronary artery disease, hypertension, and diabetes.
                </p>
                <p className="text-gray-700">
                  As a trusted provider in community-based health systems, Dr. Osei understands firsthand the operational, technological, and compliance challenges faced by small and mid-sized medical practices. His insights into clinical workflows, patient data handling, and EHR use make him an invaluable advisor as CyberLockX builds solutions tailored to real-world clinical environments.
                </p>
                <p className="text-gray-700">
                  With a commitment to improving both patient care and provider protection, Dr. Osei helps guide CyberLockX in aligning its security and compliance technologies with the realities of everyday practice in the U.S. healthcare system.
                </p>
              </CardContent>
            </Card>

            {/* Marco Benjamin */}
            <Card className="border-primary/10 shadow-md overflow-hidden">
              <div className="h-56 bg-white relative flex items-center justify-center">
                <div className="w-40 h-40 relative mx-auto">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <img 
                      src={marcoBenjaminPhoto} 
                      alt="Marco Benjamin" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Marco Benjamin</CardTitle>
                <CardDescription className="text-secondary font-medium">
                  Clinical Advisor, JHN Health Collaborative Director of Social Determination of Health
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Marco, a proud New York City native, became a passionate activist and consumer advocate for HIV/AIDS in 2007 following his own diagnosis. He began his journey in grassroots advocacy, focusing on critical issues such as pharmaceutical drug pricing, HIV stigma, and condom access—particularly within the adult film industry.
                </p>
                <p className="text-gray-700">
                  In 2013, Marco served as Program Manager for a nationwide Condom Tour, traveling to 214 cities across 38 states. His efforts raised awareness around sexual health and helped distribute nearly 15 million condoms to communities in need. The following year, Marco transitioned into a role as a Pharmacy Resource Sales Representative, where he supported patients in navigating the complex barriers to care and treatment for Hepatitis C and antiretroviral medications across the Northeast U.S.
                </p>
                <p className="text-gray-700">
                  Marco's unwavering commitment to patient advocacy earned him recognition from POZ Magazine in 2013, naming him a "Top 100 Unsung Hero" for his dedication to ending the HIV epidemic. Today, Marco continues to lead with purpose with a focus on education, awareness, testing, improving access to care, and optimizing treatment—always bringing heart and humanity to the forefront of his work.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our work
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We continuously push the boundaries of cybersecurity technology to develop 
                  solutions that address emerging threats and challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We believe that robust cybersecurity should be available to organizations 
                  of all sizes, not just large enterprises with extensive resources.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We maintain the highest standards of honesty, transparency, and ethical 
                  conduct in all our business practices and customer relationships.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Simplicity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We design our solutions to be user-friendly and straightforward, focusing on 
                  practical security without unnecessary complexity.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Proactivity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We believe in anticipating and preventing security threats before they occur,
                  rather than just responding to breaches after the damage is done.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Security-First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We prioritize robust security as the foundation of everything we build, 
                  ensuring our solutions provide protection against both current and future threats.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;