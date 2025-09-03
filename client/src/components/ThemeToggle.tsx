import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-full text-xs font-medium bg-gray-100 border border-gray-300 shadow-sm h-8 min-w-[80px] justify-center"
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
    </Button>
  );
}