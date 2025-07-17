# Theme System Guide - Canadian Amyloidosis Society

## Overview

The Canadian Amyloidosis Society website uses a unified theme system that provides seamless light/dark mode switching without code duplication. This approach is industry-standard and offers superior maintainability.

## Why Single Environment is Better

### ✅ Current Approach Benefits
- **Single Codebase**: One set of components that work in both themes
- **Automatic Switching**: Respects user system preferences
- **Consistent Behavior**: Same functionality across both themes
- **Easy Maintenance**: Updates apply to both themes simultaneously
- **Better Performance**: No duplicate assets or code
- **Industry Standard**: Used by major websites and applications

### ❌ Separate Environments Would Create Problems
- **Code Duplication**: Every component would need two versions
- **Maintenance Nightmare**: Updates would need to be applied twice
- **Inconsistent Features**: Easy to forget updating one theme
- **Testing Complexity**: Need to test both environments separately
- **Deployment Issues**: More complex build and deployment process
- **User Experience**: Potential inconsistencies between themes

## How the Current System Works

### 1. CSS Variables
```css
:root {
  /* Light theme variables */
  --background: hsl(197, 30%, 98%);
  --foreground: hsl(0, 0%, 9%);
  --cas-blue: #00AFE6;
  --cas-green: #00DD89;
}

.dark {
  /* Dark theme variables */
  --background: hsl(224, 71%, 4%);
  --foreground: hsl(213, 31%, 91%);
  --cas-blue: #00AFE6;
  --cas-green: #00DD89;
}
```

### 2. Tailwind Dark Mode
```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    Title works in both themes
  </h1>
</div>
```

### 3. Theme Provider
```jsx
function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

## Best Practices

### 1. Always Use Theme-Aware Classes
```jsx
// ✅ Good - Works in both themes
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

// ❌ Bad - Only works in light theme
<div className="bg-white text-gray-900">
```

### 2. Use Theme Utility Functions
```jsx
import { getSectionBg, getCardClasses } from '@/lib/theme-utils';

// ✅ Good - Consistent theme-aware styling
<section className={getSectionBg('primary')}>
  <div className={getCardClasses('elevated')}>
    Content
  </div>
</section>
```

### 3. Test Both Themes
- Always test components in both light and dark modes
- Use the theme toggle button to switch between themes
- Verify readability and contrast in both themes

## Brand Consistency

### Light Theme
- Professional medical aesthetic
- Subtle brand gradients with #00AFE6 and #00DD89
- Clean, trustworthy appearance
- High contrast for accessibility

### Dark Theme
- Sophisticated dark interface
- Same brand colors maintained
- Comfortable for low-light viewing
- Professional medical feel preserved

## Making Changes

### To Modify Theme Colors
1. Update CSS variables in `src/index.css`
2. Changes automatically apply to both themes
3. Test in both light and dark modes

### To Add New Components
1. Use theme-aware Tailwind classes
2. Apply `dark:` prefixes for dark mode styles
3. Use theme utility functions for consistency
4. Test in both themes

### To Update Existing Components
1. Check for hardcoded colors
2. Replace with theme-aware classes
3. Ensure both themes look professional
4. Test accessibility in both modes

## Conclusion

The current unified theme system provides the best balance of:
- Developer experience
- User experience
- Maintainability
- Performance
- Brand consistency

This approach is used by major applications like GitHub, Discord, and Slack because it's proven to be the most effective solution for theme management.