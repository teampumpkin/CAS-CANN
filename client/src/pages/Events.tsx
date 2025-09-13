import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import ParallaxBackground from '../components/ParallaxBackground';
import healthcareProfessionalImg from '@assets/DSC02826_1750068895453.jpg';

export default function Events() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <ParallaxBackground className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
            style={{ backgroundImage: `url(${healthcareProfessionalImg})` }}
          />
        </ParallaxBackground>
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/20 via-white/50 to-[#00DD89]/15 dark:from-[#00AFE6]/30 dark:via-gray-900/50 dark:to-[#00DD89]/25" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 backdrop-blur-sm border border-[#00AFE6]/30 rounded-full px-6 py-2 mb-6"
          >
            <Calendar className="w-4 h-4 text-[#00AFE6]" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Educational Events</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 font-rosarivo"
          >
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
              Events &
            </span>
            <br />
            <span className="text-gray-800 dark:text-white">
              Education
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Join our community for educational conferences, expert webinars, support groups, 
            and professional development opportunities across Canada.
          </motion.p>
        </div>
      </section>
    </div>
  );
}