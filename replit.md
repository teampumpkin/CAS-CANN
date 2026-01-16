# Canadian Amyloidosis Society (CAS) Website

## Overview
This project is a modern, patient-focused website for the Canadian Amyloidosis Society (CAS). Its primary purpose is to serve as a comprehensive platform for education, resource sharing, and community building, connecting patients, caregivers, and healthcare professionals with vital resources and support for amyloidosis care across Canada. The vision is to enhance amyloidosis awareness and treatment, offering a centralized hub for critical information and fostering a supportive community.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The project features a minimalist + Flat 2.0 hybrid design with soft shadows and rounded corners, utilizing Rosarivo (serif) and Mulish (sans-serif) fonts. It prioritizes clear visual hierarchy, a professional medical aesthetic, interactive elements, and smooth animations. Key enhancements include redesigned statistics cards, a two-level healthcare center popup system, an interactive map with advanced clustering, and enhanced navigation. Brand colors (#00AFE6 and #00DD89) are consistently applied. Accessibility (WCAG 2.1 Level AA) is a core focus, including an accessibility tools widget, keyboard navigation, screen reader support, high contrast modes, font size adjustment, dyslexia-friendly fonts, and custom cursor sizes. A unified light/dark theme system with `localStorage` persistence and system preference detection is implemented.

### Technical Implementations
The frontend is built with React 18 and TypeScript, using Vite for building, Tailwind CSS with shadcn/ui for styling, Radix UI for primitives, Framer Motion for animations, and Wouter for routing. TanStack Query manages server state. Comprehensive French language support is integrated through a dynamic translation system.

The backend uses Node.js with Express.js, PostgreSQL (Neon serverless), and Drizzle ORM for type-safe database operations. It features a RESTful API with structured error handling and `connect-pg-simple` for session management.

Key features include:
- **Content Management**: Documentation for bilingual support and brand consistency.
- **Interactive Healthcare Directory Map**: Displays 25+ Canadian facilities with clickable markers and detailed modals.
- **CANN Integration**: A dedicated page for the Canadian Amyloidosis Network.
- **Dynamic Multi-Form Lead Capture System**: Integrates with Zoho CRM v8 API for CAS Registration and CANN Membership forms, featuring automatic OAuth token refresh, intelligent field mapping, and distinct `Lead_Source` attribution.
- **Bulk Import System**: Excel-based historical data import with configurable column mapping for Zoho CRM, including automatic field sync and type-safe transformations.
- **Zoho CRM Data Integration Service**: A standalone service for processing CSV/Excel files into Zoho (Accounts, Contacts, Resources) with an admin UI for file upload, preview, and import execution.
- **Bulletproof Form Submission System**: Local-first architecture ensuring form submissions are saved to PostgreSQL immediately and then asynchronously synced to Zoho CRM with exponential backoff and retry logic, including automatic token refresh.
- **Unified CAS & CANN Registration Form**: A single comprehensive form (`/join-cas`) with conditional logic, replacing all other registration forms. It includes automated email notifications (pending SMTP credentials) and extensive UI/UX enhancements.
- **CANN Townhall Event Registration System**: Event-specific registration for the CANN Townhall - Ideation Workshop with:
  - **Registration Form** (`/events/cann-townhall/register`): Captures First Name, Last Name, Email, Institution, and CANN membership status with form validation and success confirmation popup.
  - **Admin Dashboard** (`/eventsdownload`): Password-protected admin portal for viewing and managing event registrations. Supports CSV export with RFC 4180 compliant escaping.
  - **Admin Credentials**: Username: `cannAdmin`, Password: `Townhall2025!` (configurable via environment variables `EVENT_ADMIN_USERNAME` and `EVENT_ADMIN_PASSWORD`).
- **Resource Management System**: A comprehensive system for clinicians to upload and share diagnostic tools, protocols, and educational materials. Features include:
  - **Upload Portal** (`/upload-resource`): Multi-step form for submitting resources with file attachments, metadata, and consent agreements.
  - **Moderation Dashboard** (`/admin/resources/moderation`): Administrative interface for reviewing, approving, or rejecting resource submissions with file preview capabilities.
  - **File Preview System**: Smart file type detection supporting images and PDFs.
  - **Placeholder URL Handling**: Graceful UX for simulated file uploads.

### Feature Specifications
- Homepage: Reordered sections with interactive map prominence.
- Amyloidosis Detail Pages: Simplified design, consistent branding, professional medical aesthetic.
- Events Page Structure: Hero → Featured Event → Canadian Amyloidosis Summit → CAS Journal Club → CANN Events → News (with newsletter modal).
- Events Integration: CAS Journal Club and CANN Educational Series with member notifications.
- Clinician-First Focus: Enhanced hero sections, restructured navigation (Clinical Tools, Research Hub, Professional Network), governance documents, and contributor portal.
- Contact & Footer: Professional contact system, comprehensive FAQ, and bilingual UX.
- About Pages: Redesigned for medical professionals ("About Amyloidosis") and clinical practice ("About CAS").
- Performance Optimization: `OptimizedImage` component with lazy loading, bundle optimization, and query optimization.
- Navigation: Enhanced design with prominent CAS logo as home link, mobile optimization, and fixed scroll behavior.
- Zoho CRM OAuth Setup: Detailed guide for setting up and troubleshooting Zoho CRM integration, including automatic token refresh and debug endpoints.
- **Zoho CRM Field Mapping (Jan 2026)**: Custom "CAS and CANN" layout (ID: 6999043000000091055) with correct field mappings: `discipline→Professional_Designation`, `subspecialty→subspecialty`, `institution→Institution_Name`, `province→province`, `amyloidosisType→Amyloidosis_Type`, `wantsServicesMapInclusion→Services_Map_Inclusion`. The `Company` field is also populated (required by Zoho Leads) using the institution value. All sync code paths (worker, retry service, routes) use consistent explicit CAS/CANN field mapping.
- **Bulk Resync Endpoint** (`/api/admin/bulk-resync-leads`): Admin endpoint (requires automation API key) to update existing Zoho leads with correct field mappings from local submission data.

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Framer Motion**: Animation library for React.
- **Lucide React**: Icon library.

### Data Management
- **TanStack Query**: Server state management and caching.
- **React Hook Form**: Form state management with validation.
- **Zod**: Schema validation for forms and API.

### Database and Backend
- **Neon Database**: Serverless PostgreSQL hosting.
- **Drizzle ORM**: Type-safe database operations.
- **Express.js**: Web application framework for Node.js.
- **Connect-pg-simple**: PostgreSQL session store for session management.

### Integrations
- **Zoho CRM**: For lead capture, data management, and bulk imports.