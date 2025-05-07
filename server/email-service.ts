import sgMail from '@sendgrid/mail';

// Initialize SendGrid
export function initSendgrid() {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY is not set. Email functionality will not work.');
    return false;
  }
  
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SENDGRID_API_KEY is not set. Email functionality will not work.');
      return false;
    }

    if (!process.env.NOTIFICATION_EMAIL) {
      console.warn('NOTIFICATION_EMAIL is not set. Email functionality will not work.');
      return false;
    }

    const msg = {
      to: process.env.NOTIFICATION_EMAIL,
      from: 'noreply@cyberlockx.xyz', // Use your verified sender
      subject: `New CyberLockX Early Access Request from ${submission.company}`,
      html: `
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
      `,
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}