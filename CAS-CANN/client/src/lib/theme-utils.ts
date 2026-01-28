/**
 * Theme utility functions for Canadian Amyloidosis Society
 * Provides consistent theme-aware styling across components
 */

export const themeClasses = {
  // Section backgrounds
  sectionBg: {
    light: "bg-gradient-to-br from-[#00AFE6]/5 via-white to-[#00DD89]/5",
    dark: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
  },
  
  // Card backgrounds
  cardBg: {
    light: "bg-white/95 backdrop-blur-xl",
    dark: "bg-white/5 backdrop-blur-xl"
  },
  
  // Card borders
  cardBorder: {
    light: "border-[#00AFE6]/20",
    dark: "border-white/10"
  },
  
  // Card hover states
  cardHover: {
    light: "hover:border-[#00AFE6]/40 hover:bg-white/98",
    dark: "hover:border-white/30 hover:bg-white/10"
  },
  
  // Text colors
  text: {
    primary: {
      light: "text-gray-900",
      dark: "text-white"
    },
    secondary: {
      light: "text-gray-700",
      dark: "text-white/80"
    },
    muted: {
      light: "text-gray-600",
      dark: "text-white/70"
    }
  },
  
  // Brand gradients
  gradients: {
    primary: "bg-gradient-to-r from-[#00AFE6] to-[#00DD89]",
    subtle: {
      light: "bg-gradient-to-br from-[#00AFE6]/8 via-white to-[#00DD89]/8",
      dark: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    }
  },
  
  // Decorative elements
  decorative: {
    light: "bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15",
    dark: "bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10"
  }
};

/**
 * Combines theme-aware classes
 */
export function getThemeClasses(
  lightClasses: string,
  darkClasses: string
): string {
  return `${lightClasses} dark:${darkClasses}`;
}

/**
 * Gets section background classes
 */
export function getSectionBg(variant: 'primary' | 'secondary' | 'tertiary' = 'primary'): string {
  const variants = {
    primary: getThemeClasses(
      "bg-gradient-to-br from-[#00AFE6]/5 via-white to-[#00DD89]/5",
      "bg-gray-900"
    ),
    secondary: getThemeClasses(
      "bg-gradient-to-br from-[#00DD89]/8 via-gray-50 to-[#00AFE6]/8",
      "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    ),
    tertiary: getThemeClasses(
      "bg-gradient-to-br from-[#00AFE6]/6 via-gray-50 to-[#00DD89]/6",
      "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    )
  };
  
  return variants[variant];
}

/**
 * Gets card styling classes
 */
export function getCardClasses(variant: 'default' | 'elevated' | 'subtle' = 'default'): string {
  const base = getThemeClasses(
    "bg-white/95 backdrop-blur-xl border-[#00AFE6]/20",
    "bg-white/5 backdrop-blur-xl border-white/10"
  );
  
  const hover = getThemeClasses(
    "hover:border-[#00AFE6]/40 hover:bg-white/98",
    "hover:border-white/30 hover:bg-white/10"
  );
  
  const variants = {
    default: `${base} ${hover}`,
    elevated: `${base} ${hover} hover:shadow-2xl hover:shadow-[#00AFE6]/20`,
    subtle: getThemeClasses(
      "bg-white/90 backdrop-blur-sm border-[#00AFE6]/15",
      "bg-white/3 backdrop-blur-sm border-white/5"
    )
  };
  
  return variants[variant];
}

/**
 * Gets text color classes
 */
export function getTextClasses(variant: 'primary' | 'secondary' | 'muted' = 'primary'): string {
  const variants = {
    primary: getThemeClasses("text-gray-900", "text-white"),
    secondary: getThemeClasses("text-gray-700", "text-white/80"),
    muted: getThemeClasses("text-gray-600", "text-white/70")
  };
  
  return variants[variant];
}