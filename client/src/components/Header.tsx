import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <nav className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <a href="#" className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:ring-offset-2 focus:rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                CAS
              </div>
              <span className="ml-4 text-xl font-light text-[#1F2937] hidden sm:block tracking-tight">
                Canadian Amyloidosis Society
              </span>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              <div className="relative group">
                <button className="nav-link">
                  About
                </button>
                <motion.div 
                  className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  initial={{ opacity: 0, y: -10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  <div className="py-3">
                    <a href="#" className="accessible-link block px-5 py-3 text-sm hover:bg-gray-50 transition-colors duration-150">Our Mission</a>
                    <a href="#" className="accessible-link block px-5 py-3 text-sm hover:bg-gray-50 transition-colors duration-150">Leadership</a>
                    <a href="#" className="accessible-link block px-5 py-3 text-sm hover:bg-gray-50 transition-colors duration-150">Annual Reports</a>
                  </div>
                </motion.div>
              </div>
              
              <div className="relative group">
                <button className="nav-link">
                  For Patients
                </button>
                <motion.div 
                  className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  initial={{ opacity: 0, y: -10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  <div className="py-3">
                    <a href="#" className="accessible-link block px-5 py-3 text-sm hover:bg-gray-50 transition-colors duration-150">Understanding Amyloidosis</a>
                    <a href="#" className="accessible-link block px-5 py-3 text-sm hover:bg-gray-50 transition-colors duration-150">Treatment Options</a>
                    <a href="#" className="accessible-link block px-5 py-3 text-sm hover:bg-gray-50 transition-colors duration-150">Support Groups</a>
                  </div>
                </motion.div>
              </div>
              
              <div className="relative group">
                <button className="nav-link">
                  For Clinicians
                </button>
                <motion.div 
                  className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  initial={{ opacity: 0, y: -10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  <div className="py-3">
                    <a href="#" className="accessible-link block px-5 py-3 text-sm hover:bg-gray-50 transition-colors duration-150">Clinical Guidelines</a>
                    <a href="#" className="accessible-link block px-5 py-3 text-sm hover:bg-gray-50 transition-colors duration-150">Research Updates</a>
                    <a href="#" className="accessible-link block px-5 py-3 text-sm hover:bg-gray-50 transition-colors duration-150">CME Resources</a>
                  </div>
                </motion.div>
              </div>
              
              <a href="#resources" className="nav-link">Resources</a>
              <a href="#contact" className="nav-link">Contact</a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={toggleMobileMenu}
              className="text-[#6B7280] hover:text-[#00AFE6] focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:ring-offset-2 focus:rounded-xl p-2"
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <div className="px-6 py-4 space-y-2">
              <a 
                href="#about" 
                className="btn-ghost block text-left w-full"
                onClick={closeMobileMenu}
              >
                About
              </a>
              <a 
                href="#patients" 
                className="btn-ghost block text-left w-full"
                onClick={closeMobileMenu}
              >
                For Patients
              </a>
              <a 
                href="#clinicians" 
                className="btn-ghost block text-left w-full"
                onClick={closeMobileMenu}
              >
                For Clinicians
              </a>
              <a 
                href="#resources" 
                className="btn-ghost block text-left w-full"
                onClick={closeMobileMenu}
              >
                Resources
              </a>
              <a 
                href="#contact" 
                className="btn-ghost block text-left w-full"
                onClick={closeMobileMenu}
              >
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
