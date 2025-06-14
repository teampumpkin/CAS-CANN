import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm'
      }`}
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        boxShadow: isScrolled ? '0 4px 24px rgba(0, 0, 0, 0.04)' : 'none'
      }}
    >
      <div className="crawford-section py-0">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <a href="#" className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:ring-offset-2 focus:rounded-2xl">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center text-white font-medium text-sm shadow-sm">
                CAS
              </div>
              <span className="ml-4 text-lg font-light text-[#1a1a1a] hidden sm:block tracking-tight">
                Canadian Amyloidosis Society
              </span>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              <div className="relative group">
                <button className="nav-crawford">
                  About
                </button>
                <motion.div 
                  className="absolute left-0 mt-2 w-56 bg-white rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  style={{ boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08)' }}
                  initial={{ opacity: 0, y: -10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  <div className="py-3">
                    <a href="#" className="link-crawford block px-5 py-3 text-lg hover:bg-[#FAFBFC] transition-colors duration-150">Our Mission</a>
                    <a href="#" className="link-crawford block px-5 py-3 text-lg hover:bg-[#FAFBFC] transition-colors duration-150">Leadership</a>
                    <a href="#" className="link-crawford block px-5 py-3 text-lg hover:bg-[#FAFBFC] transition-colors duration-150">Annual Reports</a>
                  </div>
                </motion.div>
              </div>
              
              <div className="relative group">
                <button className="nav-crawford">
                  For Patients
                </button>
                <motion.div 
                  className="absolute left-0 mt-2 w-56 bg-white rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  style={{ boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08)' }}
                  initial={{ opacity: 0, y: -10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  <div className="py-3">
                    <a href="#" className="link-crawford block px-5 py-3 text-lg hover:bg-[#FAFBFC] transition-colors duration-150">Understanding Amyloidosis</a>
                    <a href="#" className="link-crawford block px-5 py-3 text-lg hover:bg-[#FAFBFC] transition-colors duration-150">Treatment Options</a>
                    <a href="#" className="link-crawford block px-5 py-3 text-lg hover:bg-[#FAFBFC] transition-colors duration-150">Support Groups</a>
                  </div>
                </motion.div>
              </div>
              
              <div className="relative group">
                <button className="nav-crawford">
                  For Clinicians
                </button>
                <motion.div 
                  className="absolute left-0 mt-2 w-56 bg-white rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  style={{ boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08)' }}
                  initial={{ opacity: 0, y: -10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  <div className="py-3">
                    <a href="#" className="link-crawford block px-5 py-3 text-lg hover:bg-[#FAFBFC] transition-colors duration-150">Clinical Guidelines</a>
                    <a href="#" className="link-crawford block px-5 py-3 text-lg hover:bg-[#FAFBFC] transition-colors duration-150">Research Updates</a>
                    <a href="#" className="link-crawford block px-5 py-3 text-lg hover:bg-[#FAFBFC] transition-colors duration-150">CME Resources</a>
                  </div>
                </motion.div>
              </div>
              
              <a href="#resources" className="nav-crawford">Resources</a>
              <a href="#contact" className="nav-crawford">Contact</a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={toggleMobileMenu}
              className="text-[#4a4a4a] hover:text-[#00AFE6] focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:ring-offset-2 focus:rounded-2xl p-2"
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100"
            style={{ boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)' }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="px-8 py-6 space-y-1">
              {['About', 'For Patients', 'For Clinicians', 'Resources', 'Contact'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="block py-3 text-lg text-[#4a4a4a] hover:text-[#00AFE6] transition-colors duration-200"
                  onClick={closeMobileMenu}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
