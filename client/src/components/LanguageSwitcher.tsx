import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative">
      <motion.div
        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-2 cursor-pointer hover:bg-white/20 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className="w-4 h-4 text-white" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
          className="bg-transparent text-white text-sm font-medium cursor-pointer outline-none"
        >
          <option value="en" className="bg-gray-800 text-white">EN</option>
          <option value="es" className="bg-gray-800 text-white">ES</option>
        </select>
      </motion.div>
    </div>
  );
};