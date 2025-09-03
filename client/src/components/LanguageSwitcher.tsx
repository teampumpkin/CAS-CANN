import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-gray-100 backdrop-blur-sm border border-gray-300 rounded-full px-3 py-1.5 cursor-pointer hover:bg-gray-200 transition-all duration-300 shadow-sm h-8 min-w-[80px] justify-center text-gray-700 text-xs font-medium"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{language.toUpperCase()}</span>
        <ChevronDown className="w-3 h-3" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <button
            onClick={() => {
              setLanguage('en');
              setIsOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-100 first:rounded-t-lg"
          >
            EN
          </button>
          <button
            onClick={() => {
              setLanguage('fr');
              setIsOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-100 last:rounded-b-lg"
          >
            FR
          </button>
        </div>
      )}
    </div>
  );
};