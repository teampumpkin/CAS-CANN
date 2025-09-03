import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-1.5 bg-gray-100 backdrop-blur-sm border border-gray-300 rounded-full px-2.5 py-1 cursor-pointer hover:bg-gray-200 transition-all duration-300 shadow-sm h-6 min-w-[70px] justify-center text-gray-700 text-xs font-medium"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <>
          <Moon className="h-3.5 w-3.5" />
          <span>Dark</span>
        </>
      ) : (
        <>
          <Sun className="h-3.5 w-3.5" />
          <span>Light</span>
        </>
      )}
    </button>
  );
}