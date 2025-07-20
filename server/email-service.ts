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

export async function sendInvitationEmail(email: string, role: string, token: string, inviterName: string = "CyberLockX Team"): Promise<boolean> {
  try {
    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
      console.error('Mailgun not configured. API Key or Domain missing.');
      return false;
    }
    
    // Make sure Mailgun client is initialized
    if (!mg) {
      const initialized = initMailgun();
      if (!initialized) {
        console.error('Failed to initialize Mailgun client');
        return false;
      }
    }

    // Get current domain from environment or construct it
    const domain = process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
    const protocol = domain.includes('localhost') ? 'http' : 'https';
    const invitationUrl = `${protocol}://${domain}/accept-invitation?token=${token}`;

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔐 You're Invited to CyberLockX</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Healthcare Apps & Devices Security Hub</p>
        </div>
        
        <div style="background: white; padding: 40px; border: 1px solid #e0e0e0;">
          <p style="font-size: 18px; color: #333; margin-bottom: 25px;">
            <strong>Welcome to CyberLockX!</strong>
          </p>
          
          <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
            You've been invited by ${inviterName} to join the CyberLockX admin dashboard with <strong>${role}</strong> access.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #667eea; margin: 0 0 15px 0; font-size: 18px;">Your Role: ${role.charAt(0).toUpperCase() + role.slice(1)}</h3>
            <ul style="color: #555; line-height: 1.8; margin: 0; padding-left: 20px;">
              ${role === 'admin' ? `
                <li>Full admin dashboard access</li>
                <li>Partnership application management</li>
                <li>User invitation capabilities</li>
                <li>System analytics and reporting</li>
              ` : `
                <li>View partnership applications</li>
                <li>Access to analytics dashboard</li>
                <li>Real-time system monitoring</li>
                <li>Read-only administrative interface</li>
              `}
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
              Accept Invitation & Create Account
            </a>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffeaa7;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>⏰ This invitation expires in 7 days.</strong> Please accept it soon to maintain access.
            </p>
          </div>
          
          <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            Questions? Reply to this email or contact us at <a href="mailto:info@cyberlockx.xyz">info@cyberlockx.xyz</a><br>
            If you didn't expect this invitation, please ignore this email.
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            <strong>CyberLockX</strong> - Healthcare Apps & Devices Security Hub<br>
            Securing every CLICK!!!
          </p>
        </div>
      </div>
    `;

    const messageData = {
      from: `CyberLockX Admin Team <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: email,
      subject: `🔐 You're invited to join CyberLockX Admin Dashboard`,
      html: emailContent,
    };

    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, messageData);
    console.log(`Invitation email sent successfully to ${email} with ${role} role`);
    return true;
  } catch (error) {
    console.error('Error sending invitation email:', error);
    return false;
  }
}

export async function sendApprovalNotification(submission: SubmissionEmailData): Promise<boolean> {
  try {
    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
      console.error('Mailgun not configured. API Key or Domain missing.');
      return false;
    }
    
    // Make sure Mailgun client is initialized
    if (!mg) {
      const initialized = initMailgun();
      if (!initialized) {
        console.error('Failed to initialize Mailgun client');
        return false;
      }
    }

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Partnership Approved!</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Welcome to CyberLockX Early Access</p>
        </div>
        
        <div style="background: white; padding: 40px; border: 1px solid #e0e0e0;">
          <p style="font-size: 18px; color: #333; margin-bottom: 25px;">
            <strong>Congratulations ${submission.fullName}!</strong>
          </p>
          
          <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
            We're excited to inform you that your partnership application for <strong>${submission.company}</strong> has been approved for CyberLockX Early Access.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #10b981; margin: 0 0 15px 0; font-size: 18px;">Next Steps:</h3>
            <ul style="color: #555; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>Our team will contact you within 24-48 hours to discuss your specific needs</li>
              <li>We'll schedule a personalized demo of our healthcare security platform</li>
              <li>You'll receive exclusive access to our RASBITA assessment tools</li>
              <li>Investment and partnership opportunities will be discussed during our call</li>
            </ul>
          </div>
          
          <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #0066cc; margin: 0 0 15px 0; font-size: 18px;">Your Application Details:</h3>
            <p style="margin: 5px 0; color: #555;"><strong>Company:</strong> ${submission.company}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Industry:</strong> ${submission.industry || 'Not specified'}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Company Size:</strong> ${submission.companySize || 'Not specified'}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Investment Level:</strong> ${submission.investmentLevel || 'Not specified'}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Interested In:</strong> ${submission.interestedIn.join(', ')}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://cyberlockx.xyz" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
              Visit CyberLockX Platform
            </a>
          </div>
          
          <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            Questions? Reply to this email or contact us at <a href="mailto:info@cyberlockx.xyz">info@cyberlockx.xyz</a><br>
            Phone: ${submission.phone || 'Available upon request'}
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            <strong>CyberLockX</strong> - Healthcare Apps & Devices Security Hub<br>
            Securing every CLICK!!!
          </p>
        </div>
      </div>
    `;

    const messageData = {
      from: `CyberLockX Partnership Team <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: submission.email,
      subject: `🎉 Partnership Approved - Welcome to CyberLockX Early Access!`,
      html: emailContent,
    };

    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, messageData);
    console.log(`Approval email sent successfully to ${submission.email} for ${submission.company}`);
    return true;
  } catch (error) {
    console.error('Error sending approval email:', error);
    return false;
  }
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