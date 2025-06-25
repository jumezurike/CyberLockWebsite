# CyberLockX Application Directory Structure
**Date:** June 25, 2025 | **Purpose:** Enhanced Development Agility

## Core Application Files (Production Ready)

### Primary Interface Components
```
client/src/components/sos2a/
├── questionnaire-form.tsx          [MAIN ASSESSMENT INTERFACE]
├── gap-analysis.tsx                [ANALYSIS RESULTS DISPLAY]
├── regulatory-content.tsx          [COMPLIANCE STANDARDS]
├── standards-content.tsx           [SECURITY FRAMEWORKS]
└── eula-agreement.tsx              [LEGAL AGREEMENTS]
```

### Analysis & Logic Layer
```
client/src/lib/
├── gap-analysis.ts                 [11-PARAMETER ANALYSIS ENGINE]
├── gap-analysis-types.ts           [TYPE DEFINITIONS]
├── sos2a-types.ts                  [FORM SCHEMAS]
└── matrix-mappings.ts              [UWA GENERATION]
```

### Main Application Entry
```
client/src/pages/
└── sos2a-tool.tsx                  [PRIMARY APPLICATION PAGE]
```

### Backend Services
```
server/
├── routes.ts                       [API ENDPOINTS]
├── storage.ts                      [DATA PERSISTENCE]
├── db.ts                          [DATABASE CONNECTION]
└── index.ts                       [SERVER ENTRY]
```

### Database Schema
```
shared/
└── schema.ts                       [DRIZZLE DATABASE SCHEMA]
```

## Critical System Files

### Configuration & Build
```
Root Directory:
├── package.json                    [DEPENDENCIES]
├── vite.config.ts                  [BUILD CONFIGURATION]
├── tailwind.config.ts              [STYLING CONFIGURATION]
├── tsconfig.json                   [TYPESCRIPT CONFIGURATION]
└── drizzle.config.ts              [DATABASE CONFIGURATION]
```

### Documentation & Protocols
```
Root Directory:
├── replit.md                       [PROJECT DOCUMENTATION]
├── CYBERLOCKX_APPLICATION_ARCHITECTURE_2025-06-25.md
└── APPLICATION_DIRECTORY_STRUCTURE.md [THIS FILE]
```

## Development & Backup Files

### Strategic Backups (Essential)
```
Root Directory:
├── STRATEGIC_BACKUP_2025-06-25.tsx        [COMPLETE WORKING VERSION]
├── END_OF_DAY_BACKUP_2025-06-25.tsx       [SESSION END BACKUP]
├── GAP_ANALYSIS_WITH_IAM_BACKUP_2025-06-25.ts
└── GAP_ANALYSIS_TYPES_WITH_IAM_BACKUP_2025-06-25.ts
```

### Work Documentation
```
Root Directory:
└── JUDEV20250625204500PR.txt              [SESSION WORK REPORT]
```

### Historical Reference (Keep for Context)
```
Root Directory:
├── JUNE_13_VERSION.tsx                     [LAST KNOWN GOOD INTERFACE]
├── JUNE_13_GAP_ANALYSIS.ts                [HISTORICAL ANALYSIS ENGINE]
├── temp_june8_production.tsx              [PRODUCTION REFERENCE]
└── AUTHENTIC_DEPLOYED_VERSION_17_DAYS_AGO.tsx
```

## Quick Access Map for Development Agility

### For Interface Changes:
**Primary:** `client/src/components/sos2a/questionnaire-form.tsx`
**Backup:** `STRATEGIC_BACKUP_2025-06-25.tsx`

### For Analysis Logic:
**Primary:** `client/src/lib/gap-analysis.ts`
**Types:** `client/src/lib/gap-analysis-types.ts`
**Backup:** `GAP_ANALYSIS_WITH_IAM_BACKUP_2025-06-25.ts`

### For Database Changes:
**Schema:** `shared/schema.ts`
**Connection:** `server/db.ts`
**Storage:** `server/storage.ts`

### For API Modifications:
**Routes:** `server/routes.ts`
**Main App:** `client/src/pages/sos2a-tool.tsx`

### For Emergency Recovery:
1. **Interface Issues:** Use `STRATEGIC_BACKUP_2025-06-25.tsx`
2. **Analysis Issues:** Use `GAP_ANALYSIS_WITH_IAM_BACKUP_2025-06-25.ts`
3. **Complete System:** Use `END_OF_DAY_BACKUP_2025-06-25.tsx`

## Cleanup Status
- ✅ Duplicate files removed (7 obsolete backups)
- ✅ Working directory verified
- ✅ Essential files organized and documented
- ✅ Quick access paths established

## Development Workflow
1. **Pre-work:** Check this directory structure
2. **During work:** Update relevant primary files
3. **Milestone:** Create incremental backups
4. **End-of-day:** Update this structure if changed

**Last Updated:** June 25, 2025