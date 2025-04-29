import { Link } from "wouter";

export default function DataUsePolicy() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Data Use Policy</h1>
          <p className="text-neutral-600">Last Updated: April 29, 2025</p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <h2>1. Introduction</h2>
          <p>
            This Data Use Policy describes how CyberLockX ("we", "our", or "us") collects, processes, stores, and 
            uses data in providing our cybersecurity services. We understand the sensitivity of healthcare data and are 
            committed to maintaining the highest standards of data protection and compliance with relevant regulations.
          </p>
          
          <h2>2. Types of Data We Collect</h2>
          
          <h3>2.1 Assessment Data</h3>
          <p>
            When you use our SOS²A and RASBITA assessment tools, we collect data related to your organization's security posture, 
            including but not limited to:
          </p>
          <ul>
            <li>Infrastructure information and operational modes</li>
            <li>Cybersecurity control implementations</li>
            <li>Risk governance maturity levels</li>
            <li>Security incidents and their impacts</li>
            <li>System architecture and threat modeling information</li>
          </ul>
          
          <h3>2.2 Technical Data</h3>
          <p>
            We may collect technical data about your systems to provide accurate security assessments, including:
          </p>
          <ul>
            <li>Network configurations (without sensitive credentials)</li>
            <li>Software versions and update statuses</li>
            <li>Security control implementations</li>
            <li>System architecture diagrams uploaded for threat modeling</li>
          </ul>
          
          <h3>2.3 Healthcare-Specific Data</h3>
          <p>
            As a service focusing on healthcare organizations, we understand the sensitivity of healthcare data. We:
          </p>
          <ul>
            <li>Do NOT collect actual patient health information (PHI)</li>
            <li>Do NOT require access to clinical systems containing PHI</li>
            <li>Only collect metadata about systems that may contain PHI (e.g., number of records, types of systems)</li>
            <li>Use this metadata solely for calculating potential security impact scores</li>
          </ul>
          
          <h2>3. How We Use Your Data</h2>
          <p>We use your data to:</p>
          <ul>
            <li>Generate comprehensive security assessment reports</li>
            <li>Calculate security risk scores and maturity levels</li>
            <li>Provide tailored security recommendations</li>
            <li>Develop financial impact analyses of security incidents</li>
            <li>Track security improvements over time</li>
            <li>Enhance our services through aggregated analysis</li>
          </ul>
          
          <h2>4. Data Storage and Retention</h2>
          <p>
            We store your data securely using industry-standard encryption and access controls. Data retention periods are as follows:
          </p>
          <ul>
            <li>Assessment data: Retained for the duration of your service agreement plus 2 years</li>
            <li>Account information: Retained until account deletion plus 90 days</li>
            <li>Technical data: Retained only for the duration necessary to complete assessments</li>
          </ul>
          
          <h2>5. Data Security Measures</h2>
          <p>
            We implement comprehensive security measures to protect your data, including:
          </p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Strict access controls and authorization protocols</li>
            <li>Regular security assessments of our own systems</li>
            <li>Employee training on data security and privacy</li>
            <li>Secure data backup and recovery procedures</li>
          </ul>
          
          <h2>6. Regulatory Compliance</h2>
          <p>
            Our data handling practices are designed to comply with relevant regulations, including:
          </p>
          <ul>
            <li>Health Insurance Portability and Accountability Act (HIPAA)</li>
            <li>General Data Protection Regulation (GDPR)</li>
            <li>State-specific privacy laws (e.g., CCPA, CPRA)</li>
            <li>Industry-specific requirements and standards</li>
          </ul>
          
          <h2>7. Data Aggregation and Analysis</h2>
          <p>
            We may use aggregated, anonymized data for:
          </p>
          <ul>
            <li>Industry benchmarking and trend analysis</li>
            <li>Research on emerging security threats</li>
            <li>Improvement of our security assessment methodologies</li>
            <li>Development of enhanced security recommendations</li>
          </ul>
          <p>
            All data used for these purposes is thoroughly anonymized and cannot be traced back to specific organizations.
          </p>
          
          <h2>8. Third-Party Data Sharing</h2>
          <p>
            We limit sharing of your data with third parties:
          </p>
          <ul>
            <li>Service providers: We may share data with trusted service providers who help us deliver our services</li>
            <li>Legal compliance: We may share data when required by law or to protect our rights</li>
            <li>Business transfers: In the event of a merger, acquisition, or asset sale, your data may be transferred</li>
          </ul>
          <p>
            We do NOT sell your data to third parties for marketing or other commercial purposes.
          </p>
          
          <h2>9. User Rights Regarding Data</h2>
          <p>
            You have the following rights regarding your data:
          </p>
          <ul>
            <li>Access: Request copies of your data</li>
            <li>Correction: Request correction of inaccurate data</li>
            <li>Deletion: Request deletion of your data (subject to retention requirements)</li>
            <li>Restriction: Limit how we use your data</li>
            <li>Data portability: Receive your data in a structured, machine-readable format</li>
          </ul>
          
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update our Data Use Policy from time to time. We will notify you of any significant changes by posting 
            the new policy on this page and updating the "Last Updated" date.
          </p>
          
          <h2>11. Contact Information</h2>
          <p>
            If you have questions about our data practices or wish to exercise your data rights, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> data@cyberlockx.xyz<br />
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