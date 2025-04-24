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
  Users
} from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About CyberLockX</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Securing the digital future for small and medium-sized businesses with innovative, 
            accessible cybersecurity solutions.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="border-primary/10 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center mb-2">
                <Target className="h-6 w-6 text-primary mr-2" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </div>
              <CardDescription>Driving our daily actions</CardDescription>
            </CardHeader>
            <CardContent className="pt-3">
              <p className="text-gray-700">
                Our mission at CyberLockX is to democratize enterprise-grade cybersecurity for small 
                and medium-sized businesses by providing accessible, affordable, and comprehensive 
                security solutions that protect digital assets, ensure compliance, and promote 
                business continuity in an increasingly complex threat landscape.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center mb-2">
                <Shield className="h-6 w-6 text-primary mr-2" />
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </div>
              <CardDescription>Where we're headed</CardDescription>
            </CardHeader>
            <CardContent className="pt-3">
              <p className="text-gray-700">
                We envision a future where every organization, regardless of size, has access to the 
                security tools they need to thrive in the digital economy. CyberLockX aims to be the 
                trusted security partner that empowers businesses through our innovative triple-patented 
                technology, ensuring cyber resilience and digital trust across all business operations.
              </p>
            </CardContent>
          </Card>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Josiah Umezurike */}
            <Card className="border-primary/10 shadow-md overflow-hidden">
              <div className="aspect-[4/3] bg-gray-100 relative">
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl font-semibold text-primary/20">Photo</span>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Josiah Umezurike</CardTitle>
                <CardDescription className="text-secondary font-medium">
                  Founder / CTO
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  With a deep expertise in cybersecurity and network architecture, Josiah leads CyberLockX's
                  technical vision and innovation. His pioneering work resulted in three U.S. patents that form 
                  the foundation of our security platform.
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
              <div className="aspect-[4/3] bg-gray-100 relative">
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl font-semibold text-primary/20">Photo</span>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Mike Ikonomou</CardTitle>
                <CardDescription className="text-secondary font-medium">
                  Founder / CEO
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  As CEO, Mike brings extensive business leadership experience to CyberLockX. 
                  His strategic vision focuses on making enterprise-grade cybersecurity accessible 
                  to SMBs while growing CyberLockX into the leading security platform for 
                  businesses of all sizes.
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;