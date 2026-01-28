# CAS Website - Comprehensive Design Guidelines

*Last Updated: December 2024*

This document consolidates all design guidelines for the Canadian Amyloidosis Society (CAS) website, including brand colors, typography, component patterns, theme system, and visual standards.

---

## Table of Contents

1. [Brand Identity](#brand-identity)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Theme System](#theme-system)
5. [Component Patterns](#component-patterns)
6. [Spacing & Layout](#spacing--layout)
7. [Animation & Motion](#animation--motion)
8. [Accessibility](#accessibility)
9. [Page-Specific Guidelines](#page-specific-guidelines)

---

## Brand Identity

### Design Philosophy
- **Style**: Minimalist + Flat 2.0 hybrid design
- **Aesthetic**: Professional medical with soft shadows and rounded corners
- **Focus**: Clear visual hierarchy, high contrast ratios, accessibility-first

### Logo Usage
- CAS logo with maple leaf design
- Primary placement: Navigation header (links to homepage)
- Always use on transparent or brand-colored backgrounds

---

## Color System

### CAS Brand Colors (Primary)

| Color | Hex Code | Tailwind Class | CSS Variable | Usage |
|-------|----------|----------------|--------------|-------|
| **CAS Teal** | `#00AFE6` | `[#00AFE6]` | `--cas-blue` | Primary brand, buttons, links, badges, icons |
| **CAS Green** | `#00DD89` | `[#00DD89]` | `--cas-green` | Secondary brand, success states, accents |

**CAS Gradient:**
```css
background: linear-gradient(135deg, #00AFE6 0%, #00DD89 100%);
/* Tailwind: from-[#00AFE6] to-[#00DD89] */
```

**Usage:**
- Hero sections, call-to-action buttons
- Feature highlights, interactive elements
- Card backgrounds (15% opacity for light, 20-25% for dark)
- Border accents (20-30% opacity)

---

### CANN Brand Colors (Sub-brand)

| Color | Hex Code | Tailwind Class | Usage |
|-------|----------|----------------|-------|
| **CANN Pink** | `#ec4899` | `pink-500` | CANN titles, icons, primary links |
| **CANN Purple** | `#9333ea` | `purple-600` | CANN gradients, secondary elements |

**CANN Gradient:**
```css
/* Tailwind: from-pink-500 to-purple-600 */
```

**Usage:**
- CANN page titles and headings
- CANN event cards and buttons
- "Join CANN" links and CTAs
- CANN Townhall registration forms

---

### Functional Colors

| Purpose | Light Mode | Dark Mode | Usage |
|---------|------------|-----------|-------|
| **Error/Destructive** | `red-500`, `red-600` | `red-400`, `red-500` | Error messages, logout buttons, destructive actions |
| **Warning** | `amber-500`, `yellow-500` | `amber-400`, `yellow-400` | Warnings, caution notices, important alerts |
| **Success** | `green-500`, `[#00DD89]` | `green-400`, `[#00DD89]` | Success messages, confirmations, completed states |
| **Info** | `blue-500`, `[#00AFE6]` | `blue-400`, `[#00AFE6]` | Informational notices, tips, help text |

---

### Neutral Colors

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| **Page Background** | `white`, `gray-50` | `gray-900`, `gray-800` |
| **Card Background** | `white`, `gray-50` | `gray-800/50`, `gray-900` |
| **Text Primary** | `gray-900` | `white` |
| **Text Secondary** | `gray-600`, `gray-700` | `gray-300`, `gray-400` |
| **Text Muted** | `gray-500` | `gray-400`, `gray-500` |
| **Border** | `gray-200`, `gray-300` | `gray-700`, `gray-800` |
| **Divider** | `gray-100`, `gray-200` | `gray-800` |

---

### Color Usage by Context

#### CAS Pages (Main Site)
```jsx
// Primary buttons and CTAs
className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white"

// Links and interactive text
className="text-[#00AFE6] hover:text-[#00AFE6]/80"

// Badges
className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white"

// Card highlights
className="border-[#00AFE6]/30 hover:border-[#00AFE6]/50"
```

#### CANN Pages (Events, Townhall, Resources)
```jsx
// CANN titles
className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"

// CANN buttons
className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"

// CANN event cards
className="border-pink-500/30 hover:border-pink-500/50"

// Notice boxes on CANN pages (use CAS colors)
className="bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 border-[#00AFE6]/30"
```

#### Admin Dashboards
```jsx
// Table headers
className="bg-gray-50 dark:bg-gray-800/50"

// Table rows
className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"

// Table text (ensure readability)
className="text-gray-900 dark:text-gray-300"
```

---

## Typography

### Font Families

| Font | Type | Usage |
|------|------|-------|
| **Rosarivo** | Serif | Headings, titles, hero text, display text |
| **Mulish** | Sans-serif | Body text, UI elements, buttons, labels |

### Font Sizes

| Class | Size | Usage |
|-------|------|-------|
| `text-6xl` | 60px | Hero titles |
| `text-5xl` | 48px | Section titles |
| `text-4xl` | 36px | Page titles |
| `text-3xl` | 30px | Large headings |
| `text-2xl` | 24px | Card titles |
| `text-xl` | 20px | Subtitles, emphasized body |
| `text-lg` | 18px | Large body text |
| `text-base` | 16px | Default body text |
| `text-sm` | 14px | Secondary text, metadata |
| `text-xs` | 12px | Labels, captions |

### Typography Patterns

```jsx
// Hero title
className="text-5xl lg:text-6xl font-bold font-rosarivo"

// Section title
className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"

// Card title
className="text-xl font-bold text-gray-900 dark:text-white"

// Body text
className="text-gray-600 dark:text-gray-300"

// Gradient text
className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent"
```

---

## Theme System

### Implementation

The website uses a unified theme system with CSS variables and Tailwind's `dark:` prefix.

#### CSS Variables (index.css)
```css
:root {
  --background: hsl(197, 30%, 98%);
  --foreground: hsl(0, 0%, 9%);
  --cas-blue: #00AFE6;
  --cas-green: #00DD89;
  /* ... other variables */
}

.dark {
  --background: hsl(224, 71%, 4%);
  --foreground: hsl(213, 31%, 91%);
  --cas-blue: #00AFE6;
  --cas-green: #00DD89;
  /* Brand colors remain consistent */
}
```

### Theme-Aware Classes

**Always use both light and dark variants:**

```jsx
// ✅ Correct - Works in both themes
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

// ❌ Wrong - Only works in light theme
<div className="bg-white text-gray-900">
```

### Common Patterns

```jsx
// Page background
className="min-h-screen bg-gray-50 dark:bg-gray-900"

// Card
className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"

// Text
className="text-gray-900 dark:text-white"        // Primary
className="text-gray-600 dark:text-gray-300"     // Secondary
className="text-gray-500 dark:text-gray-400"     // Muted

// Interactive elements
className="hover:bg-gray-100 dark:hover:bg-gray-700"
```

---

## Component Patterns

### Buttons

**Primary (CAS):**
```jsx
className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#00AFE6]/90 hover:to-[#00DD89]/90 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
```

**Primary (CANN):**
```jsx
className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
```

**Secondary/Outline:**
```jsx
className="border-2 border-[#00AFE6] text-[#00AFE6] hover:bg-[#00AFE6] hover:text-white px-6 py-3 rounded-xl transition-all duration-300"
```

**Destructive:**
```jsx
className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
```

### Cards

**Standard Card:**
```jsx
className="bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
```

**Feature Card:**
```jsx
className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-white/20 rounded-3xl p-6 hover:border-[#00AFE6]/50 hover:shadow-2xl hover:shadow-[#00AFE6]/15 transition-all duration-500"
```

### Badges

**CAS Badge:**
```jsx
className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 border border-[#00AFE6]/30 px-4 py-2 rounded-full text-[#00AFE6] text-sm font-medium"
```

**CANN Badge:**
```jsx
className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/10 to-purple-600/10 border border-pink-500/30 px-4 py-2 rounded-full text-pink-500 text-sm font-medium"
```

### Form Inputs

```jsx
className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
```

### Tables (Admin Dashboards)

```jsx
// Table container
<div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">

// Table header
<thead className="bg-gray-50 dark:bg-gray-800/50">
  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">

// Table body
<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
```

---

## Spacing & Layout

### Section Spacing
- **Vertical padding**: `py-24` (96px) for main sections
- **Container max-width**: `max-w-7xl` with `mx-auto px-4 sm:px-6 lg:px-8`

### Grid Systems
```jsx
// Two columns
className="grid md:grid-cols-2 gap-8"

// Three columns
className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"

// Four columns
className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
```

### Component Spacing
- **Card padding**: `p-6` (24px)
- **Grid gaps**: `gap-6` (24px) or `gap-8` (32px)
- **Button padding**: `px-6 py-3`
- **Badge padding**: `px-4 py-2`

### Border Radius
- **Cards**: `rounded-3xl` (24px)
- **Buttons**: `rounded-xl` (12px)
- **Badges**: `rounded-full`
- **Inputs**: `rounded-xl` (12px)
- **Small elements**: `rounded-lg` (8px)

---

## Animation & Motion

### Framer Motion Standards

**Fade In Up:**
```jsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

**Stagger Children:**
```jsx
// Parent
variants={{
  visible: { transition: { staggerChildren: 0.1 } }
}}

// Child
variants={{
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}}
```

**Viewport Trigger:**
```jsx
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-100px" }}
```

### CSS Transitions
```jsx
// Standard transition
className="transition-all duration-300"

// Hover scale
className="hover:scale-105 transition-transform duration-300"

// Shadow transition
className="hover:shadow-xl transition-shadow duration-300"
```

---

## Accessibility

### WCAG 2.1 Level AA Compliance

#### Color Contrast
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text (18px+)
- Always test both light and dark modes

#### Interactive Elements
```jsx
// Focus states
className="focus:ring-2 focus:ring-[#00AFE6] focus:ring-offset-2 focus:outline-none"

// Skip links
className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-[#00AFE6] focus:text-white focus:px-4 focus:py-2 focus:z-50"
```

#### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Include alt text for all images
- Use ARIA labels for icon-only buttons
- Ensure keyboard navigation works

#### Accessibility Widget Features
- Font size adjustment (12px-24px)
- High contrast modes
- Cursor size options
- Reduced motion support
- Dyslexia-friendly fonts
- Screen reader optimization

---

## Page-Specific Guidelines

### Homepage
- Full-screen hero with neural network background
- Four action tiles in 2x2 grid
- Brand gradient overlay for text readability
- Statistics cards with large numbers

### CANN Pages
- Use CANN gradient (pink-purple) for titles
- CANN Pink for primary buttons and links
- CAS Teal for secondary elements and notices
- Maintain CAS brand in footer and navigation

### Admin Dashboards
- Clean table layouts with proper dark mode support
- Export buttons with CAS gradient
- Password protection indicators
- Clear status badges for data states

### Event Pages
- Event type badges with appropriate colors
- Date/time prominence
- Clear registration CTAs
- Countdown or status indicators

---

## Quick Reference

### Most Used Classes

| Element | Classes |
|---------|---------|
| **CAS Button** | `bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white rounded-xl px-6 py-3` |
| **CANN Button** | `bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl px-6 py-3` |
| **Card** | `bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700` |
| **Badge** | `bg-[#00AFE6]/10 text-[#00AFE6] rounded-full px-4 py-2` |
| **Section** | `py-24 bg-gray-50 dark:bg-gray-900` |
| **Container** | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| **Title** | `text-4xl font-bold text-gray-900 dark:text-white` |
| **Body Text** | `text-gray-600 dark:text-gray-300` |

### Color Hex Codes

| Color | Hex |
|-------|-----|
| CAS Teal | `#00AFE6` |
| CAS Green | `#00DD89` |
| CANN Pink | `#ec4899` |
| CANN Purple | `#9333ea` |

---

*This document serves as the single source of truth for all design decisions on the CAS website. Update this document when making design system changes.*
