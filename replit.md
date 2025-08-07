# CyberLockX (HASH) - Universal Identification Verification System

## Overview
CyberLockX is an advanced cybersecurity platform providing comprehensive digital identity management and security risk assessment. It features the HOS²A (Healthcare Organizational and System Security Analysis) assessment tool, powered by the RASBITA framework, to offer flexible, user-centric identification processes. The project aims to deliver a robust system for securing assets through proof-based analysis, real-time threat neutralization, and automated compliance, particularly for healthcare applications and devices.

## User Preferences
- Historical data integrity is paramount - never modify authentic data
- Follow Problem Resolution Protocol (PRP) 3.0 for all changes (MANDATORY BACKUP STRATEGY)
- CRITICAL: Do not implement anything without explicit user approval - dialogue-first approach mandatory
- Require explicit user approval before implementing updates
- Maintain exact interface preservation for production system
- Admin dashboard monitoring required for partnership applications
- Professional email notifications to info@cyberlockx.xyz mandatory
- Real-time application management through web interface preferred

## System Architecture

### Core Technologies
- React.js with TypeScript for the frontend
- Tailwind CSS for responsive design
- Drizzle ORM for database interactions

### Services Portal (Updated: August 7, 2025)
- **Complete 6-Step Workflow**: Organization Info → Service Selection → Project Details → Scheduling → Pricing → Approval
- **Professional Title Dropdown**: 100+ categorized professional titles with search functionality
- **Form Validation**: Comprehensive Zod schemas with proper controlled components
- **Integration**: Leverages existing admin infrastructure (PostgreSQL, Mailgun, RBAC)
- **Business Features**: $75 site visit fee integration, comprehensive pricing structure, nationwide service coverage

### Identity Management System
- **Universal Identity Verification System (UIVS)**: Supports various identity types including Human, Machine Physical, Machine Virtual, Avatar, API, and Third-Party.
- **Digital Data Nucleic Authority (DDNA) framework**: Used for security risk mapping.
- **Universal Wallet Address (UWA) generation system**: Creates UWAs from identity and identification components.
- **Component Categories**: Identities are categorized into Identity, Authentication, Identification, Intermediate (for Avatar), Authorization, and Technical components.

### Assessment Framework (HOS²A & RASBITA)
- **9-Phase Assessment Methodology**: Inquiry, Interview, Matrix Population, RASBITA Governance, Cost-Benefit, Gap Analysis, Threat Modeling, Preliminary Report, Comprehensive Report.
- **5-Pillar Framework**:
    1.  **Qualitative Assessment**: Expert analysis of 12 default parameters.
    2.  **Quantitative Analysis**: 18 deep scan parameters using industry tools, requiring authentic, measured data points.
    3.  **RASBITA Cost-Benefit Analysis**: Financial modeling with NRRB calculations, contingent on recent incidents.
    4.  **RASBITA Governance & Management**: GPA-style scoring, NIST CSF 2.0 alignment (108 controls with 0-4 scoring).
    5.  **Architecture Threat Modeling & App Sec**: STRIDE modeling, SAST/DAST, conditional on system diagrams.
- **Gap Analysis Expert System**: Maps 12 SOS²A parameters to 11 cybersecurity core domains, providing implementation level scoring and industry-specific guidance.
- **Report System**: Merges original and enhanced report features into a unified comprehensive report with Executive Summary, Visual Scorecard, Compliance, and Recommendations sections. Reports are conditional (Minimal, Enhanced, Complete) based on data availability.

### System Management & UI/UX
- **Admin Dashboard**: Comprehensive dashboard for monitoring and managing various system aspects like partnership applications and visitor analytics. Features real-time monitoring, RBAC (Super Admin, Admin, Viewer), and secure authentication.
- **File Protection System**: Implements comprehensive backup with SHA256 verification, real-time integrity monitoring, and emergency restoration capabilities for critical system files.
- **Navigation & Interface**: Streamlined user interface by removing clutter and conditionally hiding navigation elements on specific tool pages. Professional logo repositioning and consistent branding.
- **Color Scheme**: Uses a professional color palette (e.g., indigo, emerald, orange, purple for metrics).

### Problem Resolution Protocol (PRP) 3.0
- **Mandatory Pre-Work Enforcement**: Requires mandatory backup creation, Git verification, and file integrity baseline checks before any work commences. No work proceeds without backup confirmation.
- **Strategic Problem Analysis**: Structured approach for problem-solving: Problem Genesis, Root Cause Analysis, and Solution Initialization. Requires user evaluation and approval before implementation.
- **Disaster Recovery & Business Continuity (DR/BC)**: Includes daily milestone backups, a strict deduplication policy, detailed work documentation, Git backup verification, and a deployment-based backup policy (only using backups created after or concurrent with deployed version).
- **Application Organization**: Strict adherence to defined application structure for `client/src/components/sos2a/`, `client/src/lib/`, `client/src/pages/`, `server/`, and `shared/` directories for quick access and agility.

## External Dependencies
- **Mailgun**: For sending professional HTML email notifications and status updates (e.g., partnership application approvals).
- **PostgreSQL**: Used as the database for storing system data, including visitor sessions, page views, and partnership applications.
- **Cloudflare**: Utilized for geographic tracking in visitor analytics.
- **Stripe.js**: Integrated for checkout components, with graceful fallback for missing environment variables.