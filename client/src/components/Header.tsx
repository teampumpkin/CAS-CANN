import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
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
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <a href="#" className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:ring-offset-2 focus:rounded-md">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                CAS
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900 hidden sm:block">
                Canadian Amyloidosis Society
              </span>
              <span className="ml-3 text-lg font-semibold text-gray-900 sm:hidden">
                CAS
              </span>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <div className="relative group">
                <button className="nav-link">
                  About
                </button>
                <motion.div 
                  className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100"
                  initial={{ opacity: 0, y: -10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  <div className="py-2">
                    <a href="#" className="accessible-link block px-4 py-2 text-sm hover:bg-[#E6F7FF] transition-colors duration-200">Our Mission</a>
                    <a href="#" className="accessible-link block px-4 py-2 text-sm hover:bg-[#E6F7FF] transition-colors duration-200">Leadership</a>
                    <a href="#" className="accessible-link block px-4 py-2 text-sm hover:bg-[#E6F7FF] transition-colors duration-200">Annual Reports</a>
                  </div>
                </motion.div>
              </div>
              
              <div className="relative group">
                <button className="nav-link">
                  For Patients
                </button>
                <motion.div 
                  className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100"
                  initial={{ opacity: 0, y: -10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  <div className="py-2">
                    <a href="#" className="accessible-link block px-4 py-2 text-sm hover:bg-[#E6F7FF] transition-colors duration-200">Understanding Amyloidosis</a>
                    <a href="#" className="accessible-link block px-4 py-2 text-sm hover:bg-[#E6F7FF] transition-colors duration-200">Treatment Options</a>
                    <a href="#" className="accessible-link block px-4 py-2 text-sm hover:bg-[#E6F7FF] transition-colors duration-200">Support Groups</a>
                  </div>
                </motion.div>
              </div>
              
              <div className="relative group">
                <button className="nav-link">
                  For Clinicians
                </button>
                <motion.div 
                  className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100"
                  initial={{ opacity: 0, y: -10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  <div className="py-2">
                    <a href="#" className="accessible-link block px-4 py-2 text-sm hover:bg-[#E6F7FF] transition-colors duration-200">Clinical Guidelines</a>
                    <a href="#" className="accessible-link block px-4 py-2 text-sm hover:bg-[#E6F7FF] transition-colors duration-200">Research Updates</a>
                    <a href="#" className="accessible-link block px-4 py-2 text-sm hover:bg-[#E6F7FF] transition-colors duration-200">CME Resources</a>
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
              className="text-gray-700 hover:text-[#00AFE6] focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:ring-offset-2 focus:rounded-md p-2"
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
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a 
                href="#about" 
                className="accessible-link block px-3 py-2 text-base font-medium"
                onClick={closeMobileMenu}
              >
                About
              </a>
              <a 
                href="#patients" 
                className="accessible-link block px-3 py-2 text-base font-medium"
                onClick={closeMobileMenu}
              >
                For Patients
              </a>
              <a 
                href="#clinicians" 
                className="accessible-link block px-3 py-2 text-base font-medium"
                onClick={closeMobileMenu}
              >
                For Clinicians
              </a>
              <a 
                href="#resources" 
                className="accessible-link block px-3 py-2 text-base font-medium"
                onClick={closeMobileMenu}
              >
                Resources
              </a>
              <a 
                href="#contact" 
                className="accessible-link block px-3 py-2 text-base font-medium"
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
