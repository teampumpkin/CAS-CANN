import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Eye, 
  EyeOff, 
  Type, 
  Contrast, 
  MousePointer, 
  Keyboard, 
  Volume2, 
  Minus, 
  Plus, 
  RotateCcw, 
  X,
  Accessibility,
  Monitor,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AccessibilityState {
  fontSize: number;
  contrast: 'normal' | 'high' | 'inverted';
  reducedMotion: boolean;
  focusVisible: boolean;
  screenReader: boolean;
  dyslexiaFont: boolean;
  cursorSize: 'normal' | 'large' | 'extra-large';
}

const defaultState: AccessibilityState = {
  fontSize: 16,
  contrast: 'normal',
  reducedMotion: false,
  focusVisible: false,
  screenReader: false,
  dyslexiaFont: false,
  cursorSize: 'normal'
};

export default function AccessibilityTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<AccessibilityState>(defaultState);

  // Load saved preferences
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-preferences');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        setState(parsedState);
        applyAccessibilitySettings(parsedState);
      } catch (error) {
        console.error('Error loading accessibility preferences:', error);
      }
    }
  }, []);

  // Save preferences when state changes
  useEffect(() => {
    localStorage.setItem('accessibility-preferences', JSON.stringify(state));
    applyAccessibilitySettings(state);
  }, [state]);

  const applyAccessibilitySettings = (settings: AccessibilityState) => {
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--accessibility-font-size', `${settings.fontSize}px`);
    
    // Contrast modes
    root.classList.remove('accessibility-high-contrast', 'accessibility-inverted');
    if (settings.contrast === 'high') {
      root.classList.add('accessibility-high-contrast');
    } else if (settings.contrast === 'inverted') {
      root.classList.add('accessibility-inverted');
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('accessibility-reduced-motion');
    } else {
      root.classList.remove('accessibility-reduced-motion');
    }
    
    // Focus visible
    if (settings.focusVisible) {
      root.classList.add('accessibility-focus-visible');
    } else {
      root.classList.remove('accessibility-focus-visible');
    }
    
    // Dyslexia font
    if (settings.dyslexiaFont) {
      root.classList.add('accessibility-dyslexia-font');
    } else {
      root.classList.remove('accessibility-dyslexia-font');
    }
    
    // Cursor size
    root.classList.remove('accessibility-cursor-large', 'accessibility-cursor-extra-large');
    if (settings.cursorSize === 'large') {
      root.classList.add('accessibility-cursor-large');
    } else if (settings.cursorSize === 'extra-large') {
      root.classList.add('accessibility-cursor-extra-large');
    }
    
    // Screen reader announcements
    if (settings.screenReader) {
      announceToScreenReader('Accessibility settings updated');
    }
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const updateSetting = <K extends keyof AccessibilityState>(
    key: K, 
    value: AccessibilityState[K]
  ) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setState(defaultState);
    announceToScreenReader('Accessibility settings reset to default');
  };

  const increaseFontSize = () => {
    if (state.fontSize < 24) {
      updateSetting('fontSize', state.fontSize + 2);
    }
  };

  const decreaseFontSize = () => {
    if (state.fontSize > 12) {
      updateSetting('fontSize', state.fontSize - 2);
    }
  };

  return (
    <>
      {/* Accessibility Button */}
      <motion.div
        className="fixed right-6 top-1/2 -translate-y-1/2 z-50"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#00AFE6] hover:bg-[#00DD89] text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Open accessibility tools"
          aria-expanded={isOpen}
        >
          <Accessibility className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-0 shadow-none">
                <CardHeader className="border-b dark:border-gray-800 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#00AFE6] rounded-full flex items-center justify-center">
                        <Accessibility className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                          Accessibility Tools
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Customize your browsing experience
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      aria-label="Close accessibility tools"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Font Size */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Type className="w-5 h-5 text-[#00AFE6]" />
                        <span className="font-medium text-gray-900 dark:text-white">Text Size</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {state.fontSize}px
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={decreaseFontSize}
                        disabled={state.fontSize <= 12}
                        aria-label="Decrease font size"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg h-2 relative">
                        <div 
                          className="bg-[#00AFE6] h-2 rounded-lg transition-all duration-300"
                          style={{ width: `${((state.fontSize - 12) / 12) * 100}%` }}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={increaseFontSize}
                        disabled={state.fontSize >= 24}
                        aria-label="Increase font size"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Contrast */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Contrast className="w-5 h-5 text-[#00AFE6]" />
                      <span className="font-medium text-gray-900 dark:text-white">Contrast</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['normal', 'high', 'inverted'] as const).map((contrast) => (
                        <Button
                          key={contrast}
                          variant={state.contrast === contrast ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSetting('contrast', contrast)}
                          className={state.contrast === contrast ? "bg-[#00AFE6] hover:bg-[#00DD89]" : ""}
                        >
                          {contrast === 'normal' && <Monitor className="w-4 h-4 mr-2" />}
                          {contrast === 'high' && <Sun className="w-4 h-4 mr-2" />}
                          {contrast === 'inverted' && <Moon className="w-4 h-4 mr-2" />}
                          {contrast.charAt(0).toUpperCase() + contrast.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Cursor Size */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-5 h-5 text-[#00AFE6]" />
                      <span className="font-medium text-gray-900 dark:text-white">Cursor Size</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['normal', 'large', 'extra-large'] as const).map((size) => (
                        <Button
                          key={size}
                          variant={state.cursorSize === size ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSetting('cursorSize', size)}
                          className={state.cursorSize === size ? "bg-[#00AFE6] hover:bg-[#00DD89]" : ""}
                        >
                          {size === 'normal' && 'Normal'}
                          {size === 'large' && 'Large'}
                          {size === 'extra-large' && 'Extra Large'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-[#00AFE6]" />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Reduce Motion</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Minimize animations and transitions
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={state.reducedMotion ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSetting('reducedMotion', !state.reducedMotion)}
                        className={state.reducedMotion ? "bg-[#00AFE6] hover:bg-[#00DD89]" : ""}
                      >
                        {state.reducedMotion ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Keyboard className="w-5 h-5 text-[#00AFE6]" />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Enhanced Focus</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Highlight keyboard focus indicators
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={state.focusVisible ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSetting('focusVisible', !state.focusVisible)}
                        className={state.focusVisible ? "bg-[#00AFE6] hover:bg-[#00DD89]" : ""}
                      >
                        {state.focusVisible ? 'ON' : 'OFF'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Type className="w-5 h-5 text-[#00AFE6]" />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Dyslexia Font</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Use dyslexia-friendly font family
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={state.dyslexiaFont ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSetting('dyslexiaFont', !state.dyslexiaFont)}
                        className={state.dyslexiaFont ? "bg-[#00AFE6] hover:bg-[#00DD89]" : ""}
                      >
                        {state.dyslexiaFont ? 'ON' : 'OFF'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-5 h-5 text-[#00AFE6]" />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Screen Reader</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Enhanced screen reader support
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={state.screenReader ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSetting('screenReader', !state.screenReader)}
                        className={state.screenReader ? "bg-[#00AFE6] hover:bg-[#00DD89]" : ""}
                      >
                        {state.screenReader ? 'ON' : 'OFF'}
                      </Button>
                    </div>
                  </div>

                  {/* Reset Button */}
                  <div className="pt-4 border-t dark:border-gray-800">
                    <Button
                      variant="outline"
                      onClick={resetSettings}
                      className="w-full"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset to Default
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}