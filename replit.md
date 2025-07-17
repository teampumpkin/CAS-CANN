# Canadian Amyloidosis Society (CAS) Website

## Overview

This is a modern, patient-focused website for the Canadian Amyloidosis Society, designed to connect patients, caregivers, and healthcare professionals with vital resources and support for amyloidosis care across Canada. The application serves as a comprehensive platform for education, resource sharing, and community building around amyloidosis awareness and treatment.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

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