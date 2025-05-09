import formData from 'form-data';
import Mailgun from 'mailgun.js';

// Initialize Mailgun
const mailgun = new Mailgun(formData);
let mg: any = null;

export function initMailgun() {
  if (!process.env.MAILGUN_API_KEY) {
    console.warn('MAILGUN_API_KEY is not set. Email functionality will not work.');
    return false;
  }
  
  if (!process.env.MAILGUN_DOMAIN) {
    console.warn('MAILGUN_DOMAIN is not set. Email functionality will not work.');
    return false;
  }
  
  mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
  });
  
  return true;
}

interface SubmissionEmailData {
  fullName: string;
  email: string;
  company: string;
  phone?: string;
  companySize?: string;
  industry?: string;
  interestedIn: string[];
  investmentLevel?: string;
  additionalInfo?: string;
}

export async function sendEarlyAccessNotification(submission: SubmissionEmailData): Promise<boolean> {
  try {
    if (!process.env.MAILGUN_API_KEY) {
      console.warn('MAILGUN_API_KEY is not set. Email functionality will not work.');
      return false;
    }
    
    if (!process.env.MAILGUN_DOMAIN) {
      console.warn('MAILGUN_DOMAIN is not set. Email functionality will not work.');
      return false;
    }

    if (!process.env.NOTIFICATION_EMAIL) {
      console.warn('NOTIFICATION_EMAIL is not set. Email functionality will not work.');
      return false;
    }
    
    // Make sure Mailgun client is initialized
    if (!mg) {
      const initialized = initMailgun();
      if (!initialized) {
        return false;
      }
    }

    const emailContent = `
      <h1>New Early Access Request</h1>
      <p>A new early access request has been submitted with the following details:</p>
      
      <h2>Contact Information</h2>
      <ul>
        <li><strong>Name:</strong> ${submission.fullName}</li>
        <li><strong>Email:</strong> ${submission.email}</li>
        <li><strong>Company:</strong> ${submission.company}</li>
        <li><strong>Phone:</strong> ${submission.phone || 'Not provided'}</li>
      </ul>
      
      <h2>Company Details</h2>
      <ul>
        <li><strong>Company Size:</strong> ${submission.companySize || 'Not specified'}</li>
        <li><strong>Industry:</strong> ${submission.industry || 'Not specified'}</li>
      </ul>
      
      <h2>Interest Information</h2>
      <ul>
        <li><strong>Interested In:</strong> ${submission.interestedIn.join(', ')}</li>
        <li><strong>Investment Level:</strong> ${submission.investmentLevel || 'Not specified'}</li>
        <li><strong>Additional Information:</strong> ${submission.additionalInfo || 'None provided'}</li>
      </ul>
      
      <p>To manage this submission, please visit the <a href="https://app.cyberlockx.xyz/admin/early-access">Early Access Dashboard</a>.</p>
    `;

    const data = {
      from: `CyberLockX <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New CyberLockX Early Access Request from ${submission.company}`,
      html: emailContent
    };

    console.log('Sending email with the following data:');
    console.log('From:', `CyberLockX <noreply@${process.env.MAILGUN_DOMAIN}>`);
    console.log('To:', process.env.NOTIFICATION_EMAIL);
    console.log('Subject:', `New CyberLockX Early Access Request from ${submission.company}`);
    
    try {
      const result = await mg.messages.create(process.env.MAILGUN_DOMAIN, data);
      console.log('Mailgun response:', result);
      return true;
    } catch (error) {
      console.error('Detailed Mailgun error:', JSON.stringify(error, null, 2));
      throw error;
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}