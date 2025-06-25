# CyberLockX Application Architecture Documentation
**Date:** June 25, 2025  
**Version:** 3.0 (Post PRP Implementation)  
**System:** Universal Identification Verification System (UIVS)

## System Overview
CyberLockX is an advanced cybersecurity platform featuring the HOS²A (Healthcare Organizational and System Security Analysis) assessment tool with comprehensive digital identity management and security risk assessment capabilities.

## Core Architecture Components

### 1. Frontend Layer (React.js + TypeScript)
```
client/
├── src/
│   ├── components/
│   │   ├── sos2a/
│   │   │   ├── questionnaire-form.tsx     [MAIN ASSESSMENT INTERFACE]
│   │   │   ├── gap-analysis.tsx           [ANALYSIS ENGINE UI]
│   │   │   ├── regulatory-content.tsx     [COMPLIANCE CONTENT]
│   │   │   ├── standards-content.tsx      [STANDARDS LIBRARY]
│   │   │   └── eula-agreement.tsx         [LEGAL AGREEMENTS]
│   │   ├── device-inventory/              [DEVICE TRACKING]
│   │   ├── identity-behavior/             [UWA MANAGEMENT]
│   │   └── ui/                           [SHADCN COMPONENTS]
│   ├── pages/
│   │   └── sos2a-tool.tsx                [MAIN APPLICATION PAGE]
│   ├── lib/
│   │   ├── gap-analysis.ts               [ANALYSIS ENGINE]
│   │   ├── gap-analysis-types.ts         [TYPE DEFINITIONS]
│   │   ├── sos2a-types.ts               [FORM SCHEMAS]
│   │   └── matrix-mappings.ts           [UWA MAPPINGS]
│   └── hooks/
│       └── use-toast.ts                 [NOTIFICATION SYSTEM]
```

### 2. Backend Layer (Express.js + TypeScript)
```
server/
├── routes.ts                            [API ENDPOINTS]
├── storage.ts                           [DATA PERSISTENCE]
├── db.ts                               [DATABASE CONNECTION]
└── index.ts                            [SERVER ENTRY POINT]
```

### 3. Data Layer (Drizzle ORM + PostgreSQL)
```
shared/
└── schema.ts                           [DATABASE SCHEMA]
```

## Key System Components

### A. Assessment Engine (HOS²A Framework)
**Primary File:** `client/src/components/sos2a/questionnaire-form.tsx`
- **Function:** Multi-section security assessment questionnaire
- **Sections:** 13 comprehensive assessment areas
- **Key Features:**
  - Business profile collection
  - Regulatory compliance tracking
  - Device inventory management
  - Identity behavior analysis
  - Risk assessment scoring

### B. Gap Analysis System
**Primary Files:** 
- `client/src/lib/gap-analysis.ts` (Engine)
- `client/src/lib/gap-analysis-types.ts` (Types)

**Parameters (11 Total):**
1. AccessControl
2. DataProtection
3. SecurityAwareness
4. IncidentResponse
5. NetworkSecurity
6. ApplicationSecurity
7. ThirdPartyManagement
8. AssetManagement
9. SecurityGovernance
10. ComplianceManagement
11. IAM (Identity & Access Management) ⭐ [Added June 25, 2025]

**Key Functions:**
- `performGapAnalysisWithParameterizedScoring()` - Main analysis engine
- `generatePrioritizedRecommendations()` - Strategic guidance
- `convertPercentageToGrade()` - Scoring system

### C. Universal Wallet Address (UWA) System
**Primary File:** `client/src/lib/matrix-mappings.ts`
- **Function:** Generate unique digital identity addresses
- **Components:** Identity + Identification + Technical components
- **Algorithm:** Quantum-ready address generation
- **Integration:** Section 13 - Identity Behavior Hygiene

### D. Digital Data Nucleic Authority (DDNA) Framework
**Primary Integration:** Risk scoring and identity verification
- **Function:** Security risk mapping and assessment
- **Implementation:** Embedded within gap analysis system
- **Purpose:** Comprehensive digital identity verification

## Data Flow Architecture

```
User Input → Questionnaire Form → Validation → Storage
     ↓
Assessment Data → Gap Analysis Engine → Risk Scoring
     ↓
Results → Report Generation → UWA Creation → Display
```

## Identity Management System

### Supported Identity Types
1. **Human** - Personal user identities
2. **Machine Physical** - Hardware-based systems
3. **Machine Virtual** - Virtualized systems
4. **Avatar** - Digital avatar identities [Added June 13, 2025]
5. **API** - Application programming interfaces
6. **Third-Party** - External service identities

### Component Categories
- **Identity Components** - Core identity attributes
- **Authentication Components** - Verification mechanisms  
- **Identification Components** - Recognition methods
- **Intermediate Components** - Avatar-specific components
- **Authorization Components** - Permission systems
- **Technical Components** - System-level identifiers

## Security & Risk Assessment Framework

### RASBITA Framework Integration
- **Risk Assessment Score by Impact and Threat Analysis**
- **Preventive Risk Mapping**
- **Device-specific risk evaluation**
- **Organizational security posture analysis**

### Assessment Lifecycle
1. **Initialization** - Business profile setup
2. **Data Collection** - Multi-section questionnaire
3. **Analysis** - Gap analysis with 11 parameters
4. **Scoring** - Percentage-based evaluation
5. **Reporting** - Comprehensive results with recommendations
6. **UWA Generation** - Unique identity address creation

## Database Schema

### Core Tables
- **assessments** - Main assessment records
- **businesses** - Organization profiles  
- **users** - User identity management
- **sessions** - Authentication sessions

### Key Relationships
- One-to-Many: Business → Assessments
- One-to-Many: User → Assessments
- Many-to-Many: Assessments → Compliance Standards

## API Architecture

### Core Endpoints
- `GET /api/assessments` - Retrieve assessment history
- `POST /api/assessments` - Create new assessment
- `PUT /api/assessments/:id` - Update existing assessment
- `GET /api/auth/user` - User authentication status

## State Management
- **React Hook Form** - Form state management
- **TanStack Query** - Server state management
- **Local State** - Component-specific state
- **Session Storage** - Authentication persistence

## Backup & Recovery Architecture (PRP 3.0)

### Backup Strategy
1. **Pre-Work Backups** - Before any changes
2. **Milestone Backups** - At development checkpoints
3. **End-of-Day Backups** - Complete session preservation

### File Naming Convention
```
PRE_WORK_BACKUP_YYYY-MM-DD_HH-MM.tsx
MILESTONE_BACKUP_YYYY-MM-DD_DESCRIPTION.tsx
END_OF_DAY_BACKUP_YYYY-MM-DD.tsx
RESTORATION_GUIDE_YYYY-MM-DD.md
```

### Recovery Protocols
- Git history verification before work
- Deployment-based backup validation
- Systematic file deduplication
- Comprehensive work documentation

## Technical Specifications

### Frontend Technologies
- React.js 18+ with TypeScript
- Tailwind CSS for styling
- Shadcn/ui component library
- Wouter for routing
- React Hook Form for form management

### Backend Technologies  
- Express.js with TypeScript
- Drizzle ORM for database operations
- PostgreSQL database
- Session-based authentication

### Development Workflow
- Vite for development server
- Hot module replacement (HMR)
- TypeScript compilation
- ESLint for code quality

## Performance Considerations
- Form validation optimization
- Lazy loading for large components
- Database query optimization
- Caching for frequent operations

## Security Measures
- Input validation and sanitization
- SQL injection prevention via ORM
- XSS protection through proper escaping
- CSRF protection via session management
- Secure session handling

## Deployment Architecture
- Single-port deployment (Express + Vite)
- Environment-based configuration
- Database connection pooling
- Error handling and logging

---
**Last Updated:** June 25, 2025  
**Next Review:** Next development session  
**Maintainer:** Development Team via PRP 3.0 protocols