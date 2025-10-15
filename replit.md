# Canadian Amyloidosis Society (CAS) Website

## Overview
This project is a modern, patient-focused website for the Canadian Amyloidosis Society (CAS). Its primary purpose is to serve as a comprehensive platform for education, resource sharing, and community building, connecting patients, caregivers, and healthcare professionals with vital resources and support for amyloidosis care across Canada. The vision is to enhance amyloidosis awareness and treatment, offering a centralized hub for critical information and fostering a supportive community.

## User Preferences
Preferred communication style: Simple, everyday language.

## Content References

### About CAS Page Hero Description
"Founded by healthcare professionals for healthcare professionals. We unite clinicians, researchers, and institutions to advance amyloidosis care through evidence-based collaboration."

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript.
- **Build Tool**: Vite.
- **Styling**: Tailwind CSS with a custom design system incorporating shadcn/ui.
- **UI Components**: Radix UI primitives.
- **Animations**: Framer Motion for sophisticated page transitions and micro-interactions.
- **Routing**: Wouter for lightweight client-side routing.
- **State Management**: TanStack Query for server state management.
- **Accessibility**: Comprehensive WCAG 2.1 Level AA compliance, including accessibility tools widget, keyboard navigation, screen reader support, high contrast modes, font size adjustment, dyslexia-friendly fonts, and custom cursor sizes.
- **Theme Architecture**: Unified light/dark theme system with `localStorage` persistence and system preference detection, using CSS variables and Tailwind's `dark:` prefixes for consistent styling. Brand colors (#00AFE6 and #00DD89) are consistently applied across both themes with optimized opacity for visibility.
- **Internationalization**: Comprehensive French language support with a dynamic translation system covering over 200 text elements and consistent bilingual UX across the site.
- **Design System**: Features a minimalist + Flat 2.0 hybrid style with soft shadows, rounded corners, and a typography stack using Rosarivo (serif) and Mulish (sans-serif). All components, including cards, buttons, and forms, adhere to this aesthetic with consistent brand color application.
- **UI/UX Decisions**: Prioritizes clear visual hierarchy, professional medical aesthetic, interactive elements (e.g., map, statistics cards), and smooth animations. Specific enhancements include redesigned statistics cards, a two-level healthcare center popup system, compact interactive map with advanced clustering and zoom, enhanced navigation with official CAS logo, and comprehensive brand color enforcement across all pages. Hero sections are designed with thematic animations (e.g., heart, neural network, molecular structures) relevant to amyloidosis.

### Backend Architecture
- **Runtime**: Node.js with Express.js server.
- **Database**: PostgreSQL with Neon serverless database.
- **ORM**: Drizzle ORM for type-safe database operations.
- **API Design**: RESTful API with structured error handling.
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions.

### Key Features and Implementations
- **Content Management**: Comprehensive content documentation for bilingual support and consistent brand guidelines.
- **Homepage Structure**: Reordered sections for improved user experience, featuring interactive map prominently.
- **Amyloidosis Detail Pages**: Simplified visual design, consistent brand color implementation, and professional medical aesthetic.
- **Events Integration**: CAS Journal Club and CANN Educational Series integration with member access notifications.
- **Clinician-First Focus**: Enhanced hero sections, restructured navigation (Clinical Tools, Research Hub, Professional Network), comprehensive Governance Documents page, and a Structured Contributor Portal.
- **Contact & Footer Enhancement**: Professional contact system with dedicated email addresses, comprehensive FAQ, and bilingual UX.
- **About Pages Redesign**: Medical professional focus for "About Amyloidosis" (clinical red flags, comparison tables, diagnostic pathways) and clinical practice focus for "About CAS" (tool curation, diagnostic support, peer learning, clinical impact metrics).
- **Performance Optimization**: Comprehensive image compression using an `OptimizedImage` component with lazy loading, bundle optimization, and query optimization.
- **Navigation**: Enhanced design with prominent CAS logo serving as home link (removed separate Home navigation item), mobile optimization, and fixed scroll behavior.
- **Interactive Healthcare Directory Map**: Features 25+ real facilities across Canada with clickable markers, detailed modals, and color-coded center types.
- **CANN (Canadian Amyloidosis Network) Integration**: Dedicated page with network information, statistics, and professional objectives.
- **Dynamic Multi-Form Lead Capture System**: Production-ready Zoho CRM v8 API integration with automatic OAuth token refresh, intelligent field mapping, and 24/7 operation. Both CAS Registration and CANN Membership forms sync to Zoho Leads module with distinct Lead_Source attribution for reporting. Features include case-insensitive field lookup, standard Zoho field prioritization (fullName → Last_Name), automatic custom field creation, proper handling of multiselectpicklist truncation (210-char limit), and automatic phone/email field type conversion to ensure data compatibility.
- **Bulk Import System**: Excel-based historical data import system with configurable column mapping for both CANN Contacts and CAS Registration data sources. Includes automatic field sync, type-safe data transformation, and proper Lead_Source attribution with "(Historical)" tag to distinguish legacy data from live website submissions. Successfully imported 10 historical records (1 CANN, 9 CAS) with 100% sync success rate to Zoho CRM.

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives (e.g., `@radix-ui/react-dialog`, `@radix-ui/react-tabs`).
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