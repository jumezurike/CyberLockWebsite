# Architecture Documentation

## 1. Overview

CyberLockX is a web application focused on cybersecurity assessment and protection for healthcare organizations. It provides tools like the SOS²A assessment tool, RASBITA risk analysis, and threat modeling solutions. The application follows a client-server architecture with a React frontend and a Node.js Express backend. Data is stored in a PostgreSQL database using Drizzle ORM.

The system leverages modern web technologies to deliver a responsive and secure user experience, with special focus on healthcare industry compliance requirements including HIPAA, GDPR, and other regulatory frameworks.

## 2. System Architecture

CyberLockX follows a full-stack JavaScript architecture with clear separation between frontend and backend:

```
┌─────────────────┐       ┌─────────────────┐        ┌─────────────────┐
│                 │       │                 │        │                 │
│  React Frontend │◄─────►│ Express Backend │◄─────► │  PostgreSQL DB  │
│                 │       │                 │        │                 │
└─────────────────┘       └─────────────────┘        └─────────────────┘
```

### Frontend (Client)
- Built with React and TypeScript
- Uses Tailwind CSS for styling with the shadcn/ui component library
- State management via React Query (@tanstack/react-query)
- Client-side routing with wouter

### Backend (Server)
- Node.js Express server
- TypeScript for type safety
- RESTful API endpoints
- Database interactions via Drizzle ORM

### Database
- PostgreSQL via Neon serverless (@neondatabase/serverless)
- Schema management with Drizzle ORM
- Migrations handled by drizzle-kit

## 3. Key Components

### Frontend Components

1. **Pages**
   - Home, Dashboard, Assessment Tools, Reports
   - Authentication pages (implicit from the structure)
   - Informational pages (About, Privacy Policy, etc.)

2. **UI Components**
   - Leverages shadcn/ui component library (built on Radix UI primitives)
   - Custom components for domain-specific functionality:
     - SOS²A assessment tools
     - RASBITA risk analysis tools
     - Threat modeling components
     - Reports and visualizations

3. **State Management**
   - React Query for server state management
   - Local state with React hooks
   - Form state managed with React Hook Form

### Backend Components

1. **API Routes**
   - RESTful API endpoints for assessments, reports, and user management
   - Authentication endpoints (implicit from the structure)
   - Webhook handlers for payment processing (Stripe)

2. **Data Access Layer**
   - Drizzle ORM for database interactions
   - Abstract storage interface for data operations

3. **Services**
   - Assessment processing
   - Report generation
   - Email notifications via SendGrid
   - Payment processing via Stripe

### Database Schemas

The database structure includes the following main entities:

1. **Users** - User account information
   - Authentication credentials
   - Profile information
   - Role-based permissions

2. **Assessments** - Security assessment data
   - Business information
   - Security measures
   - Compliance requirements
   - Security scores and findings

3. **RASBITA Reports** - Risk analysis reports
   - Risk assessments
   - Governance scores
   - Security findings
   - Recommendations

4. **Early Access Submissions** - Marketing lead information
   - Contact details
   - Company information
   - Service interests
   - Status tracking

## 4. Data Flow

### Assessment Process Flow

1. User initiates assessment through the SOS²A tool
2. User completes the assessment questionnaire
3. Frontend sends assessment data to backend API
4. Backend processes the assessment data:
   - Calculates security scores
   - Performs gap analysis
   - Generates recommendations
5. Results are stored in the database
6. Results are returned to the frontend for display
7. User can view detailed reports, export as PDF, or take remediation actions

### User Authentication Flow

1. User registers or logs in
2. Credentials are validated by the backend
3. Backend issues authentication token/session
4. Frontend stores authentication state
5. Protected routes and API endpoints check authentication status

### Payment Processing Flow

1. User selects a pricing plan
2. Frontend redirects to checkout page
3. Stripe Elements collect payment information
4. Stripe processes payment securely
5. Backend receives webhook notification of successful payment
6. User account is updated with subscription information

## 5. External Dependencies

### Frontend Dependencies
- React for UI rendering
- Tailwind CSS for styling
- Radix UI for accessible UI components
- React Hook Form for form handling
- React Query for data fetching and caching
- wouter for client-side routing

### Backend Dependencies
- Express.js for API server
- Drizzle ORM for database interactions
- Neon Serverless PostgreSQL for database
- SendGrid for email communications
- Stripe for payment processing
- Anthropic AI SDK for AI-enhanced features

### Development Dependencies
- TypeScript for static type checking
- Vite for frontend build and development
- ESBuild for backend bundling
- Various linting and formatting tools

## 6. Deployment Strategy

The application is deployed as a modern web application with the following strategy:

### Build Process
1. Frontend is built with Vite, producing static assets
2. Backend is bundled with ESBuild
3. Combined artifacts are packaged for deployment

### Deployment Environments
- Development: Local development environment
- Production: Live environment for end users

### Hosting
- Configured for deployment to Replit, as seen in the .replit configuration
- Setup for auto-scaling in production

### Database
- Uses Neon serverless PostgreSQL, which provides scalable and managed database services

### CI/CD
- Build scripts defined in package.json
- Deployment configurations in .replit file

### Scaling Strategy
- Frontend scales through static asset serving
- Backend can auto-scale based on demand
- Database is managed by Neon with serverless scaling

## 7. Security Considerations

- HTTPS for all communications
- Authentication and authorization mechanisms
- HIPAA and healthcare regulation compliance
- Secure payment processing via Stripe
- Data encryption for sensitive information
- Regular security assessment tools for self-monitoring

## 8. Future Architectural Considerations

- Enhanced AI integration for security recommendations
- Real-time updates and notifications
- Expanded API for third-party integrations
- Mobile application support
- Advanced analytics and reporting capabilities