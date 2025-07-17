# Canadian Amyloidosis Society (CAS) Website

## Overview

This is a modern, patient-focused website for the Canadian Amyloidosis Society, designed to connect patients, caregivers, and healthcare professionals with vital resources and support for amyloidosis care across Canada. The application serves as a comprehensive platform for education, resource sharing, and community building around amyloidosis awareness and treatment.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### Complete Card Background Enhancement (July 17, 2025)
- ✅ Enhanced all card backgrounds across the entire website to be properly visible in both light and dark themes
- ✅ Applied colorful glassmorphism with theme-aware backgrounds:
  - Blue gradient: `bg-gradient-to-br from-blue-50/95 to-cyan-50/95 dark:from-blue-900/25 dark:to-cyan-900/25`
  - Green gradient: `bg-gradient-to-br from-emerald-50/95 to-green-50/95 dark:from-emerald-900/25 dark:to-green-900/25`
  - Purple gradient: `bg-gradient-to-br from-purple-50/95 to-violet-50/95 dark:from-purple-900/25 dark:to-violet-900/25`
  - Pink gradient: `bg-gradient-to-br from-pink-50/95 to-rose-50/95 dark:from-pink-900/25 dark:to-rose-900/25`
  - Orange gradient: `bg-gradient-to-br from-orange-50/95 to-amber-50/95 dark:from-orange-900/25 dark:to-amber-900/25`
- ✅ Updated text colors to match themed backgrounds for better readability
- ✅ Enhanced all 12 different card types across components:
  - EventsNewsletterSection: Statistics and event cards
  - AboutAmyloidosisSection: Medical type cards
  - QuickLinksSection: Quick action cards
  - FeaturedSpotlights: News and story cards
  - About page: Values cards
  - DirectoryPreviewSection: Feature and statistics cards (previously completed)
- ✅ Fixed the "all white" appearance problem in light theme
- ✅ Maintained consistent hover effects and shadows with theme-aware colors
- ✅ Applied color-coded theming system for better visual hierarchy

### Spanish Language Support Implementation (July 17, 2025)
- ✅ Created comprehensive LanguageContext with English and Spanish translations
- ✅ Added language switcher in navbar with globe icon and EN/ES dropdown
- ✅ Implemented localStorage persistence for language preference
- ✅ Integrated translation system across Hero, WelcomeSection, and other components
- ✅ Applied useLanguage hook to all major sections for i18n support
- ✅ Added professional language switcher with hover effects and consistent styling
- ✅ Prepared translation keys for all sections (Hero, About, Events, Directory, Quick Links)
- ✅ Ensured proper theme integration with language switcher (light/dark mode compatible)
- ✅ **MAJOR EXPANSION**: Extended Spanish translation to ALL website pages:
  - Homepage: Complete Spanish translation for all sections
  - About.tsx: Hero section, values, services, and partnership content
  - Contact.tsx: Contact forms, hero section, and all user interface elements
  - Directory.tsx: Healthcare directory with provincial listings and search functionality
  - Resources.tsx: Resource library with filtering, search, and type classifications
  - AboutAmyloidosis.tsx: Medical information, symptom descriptions, and educational content
- ✅ Comprehensive translation keys covering 200+ text elements across entire site
- ✅ Professional medical terminology accurately translated for Spanish-speaking users
- ✅ Dynamic translation system supporting complex UI elements and forms
- ✅ Bilingual support for all interactive components and navigation elements

### Interactive Healthcare Directory Map (July 17, 2025)
- ✅ Created comprehensive healthcare centers database with 25+ real facilities across Canada
- ✅ Implemented interactive Canada map with clickable healthcare center markers
- ✅ Added healthcare center modal with detailed information (contact, services, specialties)
- ✅ Color-coded center types: Hospitals (blue), Specialty Centers (green), Research (purple), Clinics (orange)
- ✅ Interactive features: hover tooltips, animated markers, clickable functionality
- ✅ Integrated with translation system for bilingual healthcare directory
- ✅ Added comprehensive center data including coordinates, contact info, services, and specialties
- ✅ Responsive modal design with call-to-action buttons (call, email, website)
- ✅ Province-wide coverage from BC to Newfoundland including territories
- ✅ Professional healthcare center categorization and detailed service listings

### Light/Dark Theme System Implementation (July 17, 2025)
- ✅ Created comprehensive ThemeProvider component with localStorage persistence
- ✅ Added theme toggle button with sun/moon icons in header navigation
- ✅ Implemented system preference detection for automatic theme selection
- ✅ Fixed App.tsx to use proper Tailwind classes instead of CSS variables
- ✅ Updated all major sections with complete light/dark mode support:
  - Hero section with proper background overlays
  - WelcomeSection with theme-aware styling
  - AboutAmyloidosisSection with adaptive text colors and card backgrounds
  - EventsNewsletterSection with light/dark backgrounds and form elements
  - DirectoryPreviewSection with proper gradient handling and stats cards
  - QuickLinksSection with theme-aware cards
  - Footer with comprehensive light mode styling
- ✅ Fixed hardcoded dark styling issues throughout the application
- ✅ Applied theme-aware Tailwind classes (dark: prefixes) consistently
- ✅ Updated all UI components (cards, buttons, text elements) for proper light theme support
- ✅ Enhanced theme application with explicit document class management
- ✅ Ensured proper contrast ratios and accessibility in both themes
- ✅ Enhanced light theme with professional medical branding and brand colors
- ✅ Created theme utility functions for consistent styling across components
- ✅ Implemented brand-consistent gradients and medical aesthetic
- ✅ Added subtle background patterns and professional color scheme

### Navigation Bar Optimization (July 17, 2025)
- ✅ Implemented consistent dark navbar across entire website
- ✅ Removed theme-adaptive behavior for better visibility and consistency
- ✅ Fixed language switcher and theme toggle visibility in all themes
- ✅ Updated mobile menu styling to match dark theme
- ✅ Removed phone number display from desktop navbar as requested
- ✅ All navigation elements now use white text on dark background

### Text Overlapping Fix (July 17, 2025)
- ✅ Fixed h1 text overlapping issues across all pages
- ✅ Updated CSS with proper line height rules for all heading elements
- ✅ Changed leading-tight to leading-none for large text sizes
- ✅ Applied fixes to Hero.tsx, About.tsx, Contact.tsx, UploadResource.tsx
- ✅ Added global CSS rules to prevent text overlapping for text-4xl, text-5xl, text-6xl

### Custom Cursor Removal (July 17, 2025)
- ✅ Removed AdvancedMouseFollower component from App.tsx
- ✅ Deleted AdvancedMouseFollower.tsx component file
- ✅ Application now uses default browser cursor instead of custom cursor

### Spacing Optimization (July 17, 2025)
- ✅ Reduced excessive whitespace throughout the application
- ✅ Optimized section padding from py-32/py-40 to py-16/py-24
- ✅ Reduced margins between elements for better visual density
- ✅ Improved grid gaps and content spacing across all sections
- ✅ Maintained readability while creating more efficient screen space usage

### Footer Dark Theme Consistency (July 17, 2025)
- ✅ Updated footer to always use dark theme styling for consistency
- ✅ Removed light theme variants from footer background and text colors
- ✅ Maintained consistent dark appearance across all theme states
- ✅ Ensured footer complements the dark navbar design

### Footer Enhancement with Sitemap and Social Links (July 17, 2025)
- ✅ Added comprehensive sitemap section with icons for all major pages
- ✅ Implemented proper social media links with correct platform icons
- ✅ Enhanced contact section with phone number and visual icons
- ✅ Updated grid layout to 4 columns to accommodate new sitemap section
- ✅ Added hover effects and animations for better user interaction
- ✅ Included proper external link attributes (target="_blank", rel="noopener noreferrer")

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Animations**: Framer Motion for sophisticated page transitions and micro-interactions
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with structured error handling
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions

### Design System
- **Typography**: Custom font stack with Rosarivo (serif) and Mulish (sans-serif)
- **Color Scheme**: Brand colors #00AFE6 (blue) and #00DD89 (green) with neutral base
- **Component Style**: Minimalist + Flat 2.0 hybrid with soft shadows and rounded corners
- **Accessibility**: High contrast ratios, keyboard navigation, and semantic HTML

## Key Components

### Core Pages
1. **Homepage**: Hero section with quick action tiles, welcome section, amyloidosis overview, events/newsletter, directory preview, and featured spotlights
2. **About Pages**: Information about CAS, amyloidosis types, and governance
3. **Resources**: Searchable library with filtering and upload capabilities
4. **Directory**: Geographic listing of specialists and treatment centers
5. **Community**: Support groups, events, and involvement opportunities

### UI Components
- **Header**: Sticky navigation with dropdown menus and mobile hamburger menu
- **Hero**: Full-screen section with medical imagery and call-to-action tiles
- **Interactive Elements**: Animated counters, parallax backgrounds, and smooth scrolling
- **Cards**: Elevated surfaces with hover effects and gradient accents
- **Forms**: Accessible form controls with validation and error handling

### Animation System
- **Scroll Animations**: Fade-in, slide-up, and zoom effects triggered by viewport intersection
- **Hover Effects**: Scale, lift, and glow transitions on interactive elements
- **Page Transitions**: Smooth navigation between routes with motion variants
- **Micro-interactions**: Button states, form focus, and loading indicators

## Data Flow

### Resource Management
1. **Upload Flow**: Users submit resources through form → validation → database storage → moderation queue
2. **Search/Filter**: Client-side query parameters → API filtering → database query → paginated results
3. **Download Tracking**: User downloads → increment counter → analytics tracking

### User Interactions
1. **Navigation**: Client-side routing with smooth transitions
2. **Form Submissions**: Client validation → API request → server processing → response handling
3. **Content Loading**: Lazy loading with intersection observer → API calls → progressive enhancement

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **Lucide React**: Icon library with consistent design

### Data Management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation for forms and API

### Database and Backend
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **Express.js**: Web application framework
- **Connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon serverless PostgreSQL with connection pooling
- **Asset Management**: Vite asset optimization and bundling

### Production Build
- **Frontend**: Vite build with optimized assets and code splitting
- **Backend**: ESBuild compilation for Node.js deployment
- **Database Migrations**: Drizzle Kit for schema management
- **Static Assets**: Optimized images and fonts with proper caching headers

### Infrastructure Considerations
- **Database Connection**: Environment variable-based configuration
- **Session Management**: PostgreSQL-backed sessions for scalability
- **Asset Serving**: Static file serving with appropriate cache headers
- **Error Handling**: Comprehensive error boundaries and API error responses

The application is designed to be responsive, accessible, and performant while maintaining a professional, trustworthy appearance appropriate for a healthcare organization. The architecture supports both current needs and future expansion of features and content.

## Theme Architecture

### Single Environment Approach
The application uses a unified theme system rather than separate environments for light and dark modes. This approach provides:

**Benefits:**
- Single codebase with consistent component structure
- Automatic theme switching based on user preference
- CSS variables for dynamic theme values
- Tailwind's built-in dark mode support with `dark:` prefixes
- Better maintainability and performance

**Implementation:**
- CSS variables defined in `:root` (light) and `.dark` (dark) classes
- ThemeProvider component for state management and persistence
- Theme utility functions for consistent styling patterns
- Brand-consistent colors and gradients across both themes

**Why Not Separate Environments:**
- Would require code duplication and maintenance overhead
- Could lead to inconsistent behavior between themes
- More complex testing and deployment processes
- Harder to ensure feature parity across themes

The current approach follows industry best practices and provides a robust, scalable theming solution.