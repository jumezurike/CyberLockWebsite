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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🚨 New Partnership Application</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0;">CyberLockX Early Access Request</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            <strong>Action Required:</strong> A new partnership application has been submitted and requires your review.
          </p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #495057; margin-top: 0; font-size: 18px;">📋 Contact Information</h2>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 5px 0;"><strong>Name:</strong> ${submission.fullName}</li>
              <li style="padding: 5px 0;"><strong>Email:</strong> <a href="mailto:${submission.email}" style="color: #667eea;">${submission.email}</a></li>
              <li style="padding: 5px 0;"><strong>Company:</strong> ${submission.company}</li>
              <li style="padding: 5px 0;"><strong>Phone:</strong> ${submission.phone ? `<a href="tel:${submission.phone}" style="color: #667eea;">${submission.phone}</a>` : 'Not provided'}</li>
            </ul>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #495057; margin-top: 0; font-size: 18px;">🏢 Company Details</h2>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 5px 0;"><strong>Company Size:</strong> ${submission.companySize || 'Not specified'}</li>
              <li style="padding: 5px 0;"><strong>Industry:</strong> ${submission.industry || 'Not specified'}</li>
            </ul>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #495057; margin-top: 0; font-size: 18px;">🎯 Partnership Interest</h2>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 5px 0;"><strong>Products of Interest:</strong> ${submission.interestedIn.join(', ')}</li>
              <li style="padding: 5px 0;"><strong>Investment Level:</strong> 
                <span style="background: #667eea; color: white; padding: 2px 8px; border-radius: 3px; font-size: 12px;">
                  ${submission.investmentLevel || 'Not specified'}
                </span>
              </li>
              ${submission.additionalInfo ? `<li style="padding: 5px 0;"><strong>Additional Info:</strong> ${submission.additionalInfo}</li>` : ''}
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://cyberlockx.xyz/admin/early-access" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              📊 View Full Dashboard
            </a>
          </div>
          
          <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
            <p style="margin: 0; color: #495057; font-size: 14px;">
              <strong>💡 Quick Actions:</strong> Visit the dashboard to update application status, contact the applicant, or schedule a demo call.
            </p>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0; color: #6c757d; font-size: 12px;">
            CyberLockX Partnership System | Automatically generated notification
          </p>
        </div>
      </div>
    `;

    const data = {
      from: `CyberLockX Notifications <notifications@${process.env.MAILGUN_DOMAIN}>`,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New CyberLockX Early Access Request from ${submission.company}`,
      html: emailContent
    };

    console.log('Sending email with the following data:');
    console.log('From:', `CyberLockX Notifications <notifications@${process.env.MAILGUN_DOMAIN}>`);
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