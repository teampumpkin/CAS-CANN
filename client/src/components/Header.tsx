import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-sm' : 'bg-white/70 backdrop-blur-sm'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center text-white font-medium text-sm">
              CAS
            </div>
            <span className="text-lg font-medium text-gray-900 hidden sm:block">
              Canadian Amyloidosis Society
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
              About
            </a>
            <a href="#patients" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
              For Patients
            </a>
            <a href="#clinicians" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
              For Clinicians
            </a>
            <a href="#resources" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
              Resources
            </a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
              Contact
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900 p-2"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-100"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 space-y-2">
              {['About', 'For Patients', 'For Clinicians', 'Resources', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="block py-3 text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
