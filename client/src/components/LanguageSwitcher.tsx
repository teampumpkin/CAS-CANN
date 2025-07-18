import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative">
      <motion.div
        className="flex items-center gap-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-2 py-1.5 cursor-pointer hover:bg-white/20 transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-3 h-3 text-white" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'fr')}
          className="bg-transparent text-white text-xs font-medium cursor-pointer outline-none"
        >
          <option value="en" className="bg-gray-800 text-white">EN</option>
          <option value="fr" className="bg-gray-800 text-white">FR</option>
        </select>
      </motion.div>
    </div>
  );
};