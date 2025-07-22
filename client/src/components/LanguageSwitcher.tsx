import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative">
      <motion.div
        className="flex items-center gap-1 bg-gray-100 backdrop-blur-sm border border-gray-300 rounded-full px-2 py-1.5 cursor-pointer hover:bg-gray-200 transition-all duration-300 shadow-sm"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-3 h-3 text-gray-700" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'fr')}
          className="bg-transparent text-gray-700 text-xs font-medium cursor-pointer outline-none"
        >
          <option value="en" className="bg-white text-gray-700">EN</option>
          <option value="fr" className="bg-white text-gray-700">FR</option>
        </select>
      </motion.div>
    </div>
  );
};