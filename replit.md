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
- **Zoho CRM Data Integration Service**: Standalone service (`/services/zoho-data-sync/`) for processing CSV/Excel files and importing data into three Zoho modules (Accounts for Institutions, Contacts for Members, Resources for Documents). Features tag-based safety ("DataSyncService" tags) to avoid interfering with live web form submissions, dry-run mode for safe testing, bilingual (EN/FR) field support, data cleaning/deduplication, field validation, and batch processing (100 records/batch). Includes admin UI at `/admin/data-sync` for file upload, module selection, preview, and import execution. Tested end-to-end with 2 successful Zoho record creations (IDs: 6999043000000820001, 6999043000000821001). All 7 implementation phases complete and architect-reviewed.
- **Unified CAS & CANN Registration Form** (`/join-cas`): Single comprehensive registration form combining CAS membership and CANN membership applications with sophisticated conditional logic. Features intelligent form sections that display/hide based on membership selections, proper Zoho CRM Lead_Source attribution, enhanced UI/UX with professional medical aesthetic, and automatic email notifications to CAS and CANN teams. All "Center" terminology uses Canadian spelling "Centre". Form structure includes Q1 (CAS membership), Q2 (CANN membership - auto-includes CAS), Q3-Q9 (member fields shown when either Q1=Yes or Q2=Yes, including Services Map), CANN Questions section (Q10-Q13 shown only when Q2=Yes), and Non-member Contact (when both Q1=No and Q2=No). Section title updated to "Registrant Information and CAS Questions". Dynamic confirmation messages based on submission type (CANN membership, CAS membership, or contact form). Automatic email notifications are sent via Zoho CRM Send Mail API to CAS@amyloid.ca (all submissions) and CANN@amyloid.ca (CANN memberships), including registrant details, membership type, and direct CRM link. Comprehensive UI/UX enhancements include:
  - **Hero Section**: Gradient backgrounds from brand colors (#00AFE6/#00DD89), animated badges with icons (UserPlus), improved typography with gradient text, and feature highlights (Patient-Focused, Collaborative Network, Evidence-Based). Badges use flex-wrap for proper mobile wrapping with responsive gaps (gap-4 sm:gap-6).
  - **Form Card**: Shadow-2xl elevation, gradient header (from-[#00AFE6] to-[#00DD89]), professional white text on gradient, mobile-responsive spacing (p-4 sm:p-8 md:p-12).
  - **Conditional Sections**: Smooth AnimatePresence transitions optimized for mobile (opacity-only, no height animations to prevent jank), gradient backgrounds unique to each section:
    * Registrant Information and CAS Questions (Q3-Q9): Blue gradient (#E6F8FF to #F0FBFF), Users icon, rounded-2xl with border and shadow, responsive padding (p-4 sm:p-6 md:p-8) and spacing (space-y-4 sm:space-y-6)
    * CANN Questions (Q10-Q13): Green gradient (#E8FFF5 to #F0FFF9), Stethoscope icon, matching responsive styling
    * Non-member Contact: Amber gradient (amber-50 to orange-50/50), Mail icon, consistent design language and responsive padding
  - **Submit Button**: Pill shape (rounded-full), gradient background matching brand, large padding (px-12 py-6), hover effects (scale-105, shadow-2xl), animated loading state with spinner and disabled state
  - **Confirmation Modal**: Dynamic messages based on submission type, mobile-responsive sizing (w-[90vw] sm:max-w-md), max-height with scrolling (max-h-[85vh] overflow-y-auto), responsive typography (text-xl sm:text-2xl for title, text-sm sm:text-base for description)
  - **Visual Separators**: Separator components between major sections for improved visual flow
  - **Mobile Optimization**: Comprehensive mobile responsiveness with reduced scrolling, touch-friendly targets, responsive spacing throughout (space-y-6 sm:space-y-8 md:space-y-10), and performance-optimized animations
  - **Accessibility**: All animations respect prefers-reduced-motion preferences using useReducedMotion hook, ensuring WCAG 2.1 Level AA compliance
  - **Icon System**: Strategic use of Lucide React icons (Users, Stethoscope, Mail, UserPlus, Send, Heart, Sparkles) to provide visual cues and enhance section identification

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