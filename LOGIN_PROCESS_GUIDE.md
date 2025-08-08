# CyberLockX Login Process Guide

## 🔐 Authentication System Overview

CyberLockX has **THREE DISTINCT LOGIN SYSTEMS** for different user types. Each has its own process, credentials, and access levels.

---

## 1. 👥 CLIENT LOGIN PROCESS

**Who:** Customers who have purchased services
**URL:** `/client-login`
**Process:** Payment → Registration → Email Verification → MFA → Dashboard Access

### Step-by-Step Client Login:

1. **Service Purchase Required First**
   - Client must complete payment for services through `/services` portal
   - Payment triggers automatic account creation eligibility

2. **Account Registration**
   - Visit `/client-login`
   - Fill out registration form with:
     - Full Name
     - Email Address
     - Phone Number
     - Password
     - Company Name (optional)
   - Click "Create Account"

3. **Email Verification**
   - Check email for verification link
   - Enter verification token from email
   - System automatically proceeds to MFA

4. **MFA Authentication**
   - Enter 6-digit code sent to email
   - Account becomes fully activated
   - Redirected to `/client-dashboard`

### What Clients Can Access:
- ✅ Real-time service tracking
- ✅ Assigned technician details
- ✅ Work progress updates
- ✅ Service reports and documentation
- ✅ Invoice and payment history
- ✅ Direct technician communication

---

## 2. 🔧 TECHNICIAN LOGIN PROCESS

**Who:** Certified CyberLockX field technicians
**URL:** `/technician-login`
**Process:** Admin-Issued Credentials → Direct Portal Access

### Step-by-Step Technician Login:

1. **Credential Assignment**
   - Credentials issued by CyberLockX administration
   - Username format: `tech_[lastname]_[id]`
   - Secure password provided during onboarding

2. **Portal Access**
   - Visit `/technician-login`
   - Enter assigned username and password
   - Direct access to `/technician` portal

3. **Work Order Management**
   - View assigned work orders
   - Update service progress
   - Submit completion reports

### What Technicians Can Access:
- ✅ Assigned work orders
- ✅ Time tracking and reporting
- ✅ Client communication tools
- ✅ Digital service report creation
- ✅ Secure file upload system
- ✅ Electronic signature capture

---

## 3. 👨‍💼 ADMIN/EARLY ACCESS LOGIN

**Who:** CyberLockX administrators and early access users
**URL:** `/admin/early-access`
**Process:** Direct Administrative Access

### Step-by-Step Admin Login:

1. **Administrative Credentials**
   - Username: `admin`
   - Password: `admin123`
   - **For demonstration/testing only**

2. **Full System Access**
   - Complete administrative control
   - 6-tab control center:
     - Early Access Management
     - Technician Operations
     - Service Requests
     - Analytics Dashboard
     - Partnership Applications
     - System Monitoring

### What Admins Can Access:
- ✅ All user management
- ✅ Service request oversight
- ✅ Technician assignment and tracking
- ✅ Analytics and reporting
- ✅ Partnership application review
- ✅ System configuration and monitoring

---

## 🚀 Quick Access Links

| User Type | Login URL | Description |
|-----------|-----------|-------------|
| **Client** | `/client-login` | Service customers - requires payment first |
| **Technician** | `/technician-login` | Field service technicians |
| **Admin** | `/admin/early-access` | System administrators |

---

## 🔄 Login Flow Summary

```
CLIENT FLOW:
Services Portal → Payment → Registration → Email Verify → MFA → Dashboard

TECHNICIAN FLOW:
Credential Assignment → Direct Login → Work Order Portal

ADMIN FLOW:
Direct Login → Administrative Control Center
```

---

## 🛡️ Security Features

### Client Security:
- Email verification required
- Multi-factor authentication (MFA)
- Session-based authentication
- Secure password requirements

### Technician Security:
- Admin-issued credentials only
- Activity logging and monitoring
- Restricted access to assigned work orders
- Secure file handling

### Admin Security:
- Role-based access control (RBAC)
- Super Admin / Admin / Viewer levels
- Comprehensive audit logging
- Session management

---

## 📧 Support and Help

If you need assistance with any login process:

1. **Client Support:** Contact via client login page support buttons
2. **Technician Support:** Contact CyberLockX administration
3. **Admin Issues:** System administrators have direct support access

---

## 🔍 Troubleshooting

### Common Client Issues:
- **No verification email:** Check spam folder, request new email
- **Expired verification:** Request new verification token
- **MFA code expired:** Request new MFA code

### Common Technician Issues:
- **Invalid credentials:** Contact administration for credential reset
- **No work orders:** Check with dispatch for assignment status

### Common Admin Issues:
- **Session timeout:** Re-login required after extended inactivity
- **Access denied:** Verify role permissions with super admin

---

*This guide follows PRP 3.0 standards for documentation and user assistance.*