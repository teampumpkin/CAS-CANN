import { motion } from 'framer-motion';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import casLogo from '@assets/image 1_1750236540297.png';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { t } = useLanguage();

  const navItems = [
    {
      name: 'Clinical Tools',
      href: '#clinical-tools',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Diagnostic Pathways', href: '/diagnostic-pathways' },
        { name: 'Treatment Protocols', href: '/treatment-protocols' },
        { name: 'Clinical Guidelines', href: '/clinical-guidelines' },
        { name: 'Assessment Tools', href: '/assessment-tools' },
      ]
    },
    {
      name: t('nav.resources'),
      href: '#resources',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Resource Library', href: '/resources' },
        { name: 'Healthcare Directory', href: '/directory' },
        { name: 'Contribute Resource', href: '/upload-resource' },
        { name: 'Evidence Base', href: '/evidence-base' },
      ]
    },
    {
      name: 'Professional Network',
      href: '#professional',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Join Professional Network', href: '/join-cas' },
        { name: 'CANN Nursing Network', href: '/join-cann' },
        { name: 'Contributor Portal', href: '/contributor-portal' },
        { name: 'Peer Consultation', href: '/peer-consultation' },
      ]
    },
    {
      name: t('nav.about'),
      href: '#about',
      hasDropdown: true,
      dropdownItems: [
        { name: 'About CAS', href: '/about' },
        { name: 'Clinical Amyloidosis', href: '/about-amyloidosis' },
        { name: 'Governance Documents', href: '/governance' },
        { name: 'Research & Publications', href: '/research' },
      ]
    },
    {
      name: t('nav.contact'),
      href: '/contact',
      hasDropdown: false,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-xl border-b border-white/10' 
          : 'bg-gray-900/80 backdrop-blur-xl'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-28">
          
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center group cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img 
              src={casLogo} 
              alt="Canadian Amyloidosis Society"
              className="h-20 w-auto group-hover:scale-105 transition-all duration-300 drop-shadow-lg rounded-xl"
            />
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            <div className="flex items-center gap-2 bg-gray-900/95 backdrop-blur-xl rounded-full px-6 py-2 border border-gray-700/50 shadow-lg">
              {navItems.map((item, index) => (
                <div
                  key={item.name}
                  className="relative group"
                >
                  {item.hasDropdown ? (
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-[#00AFE6]/20 hover:to-[#00DD89]/20 rounded-full transition-all duration-300 text-sm font-semibold border border-transparent hover:border-[#00AFE6]/40 hover:shadow-md hover:shadow-[#00AFE6]/20"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.name}
                      <ChevronDown className={`w-3 h-3 transition-all duration-300 ${activeDropdown === item.name ? 'rotate-180 text-[#00AFE6]' : ''}`} />
                    </motion.button>
                  ) : (
                    <motion.a
                      href={item.href}
                      className="flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-[#00AFE6]/20 hover:to-[#00DD89]/20 rounded-full transition-all duration-300 text-sm font-semibold border border-transparent hover:border-[#00AFE6]/40 hover:shadow-md hover:shadow-[#00AFE6]/20"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.name}
                    </motion.a>
                  )}

                  {/* Dropdown Menu */}
                  {item.hasDropdown && (
                    <div
                      className="dropdown-menu absolute top-full left-0 pt-2 w-72 z-[9999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      style={{ zIndex: 9999 }}
                    >
                      <motion.div
                        className="bg-gray-900/98 backdrop-blur-xl rounded-2xl border border-[#00AFE6]/30 shadow-2xl shadow-[#00AFE6]/10 py-3 overflow-hidden relative"
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ 
                          opacity: activeDropdown === item.name ? 1 : 0, 
                          y: activeDropdown === item.name ? 0 : -20,
                          scale: activeDropdown === item.name ? 1 : 0.9
                        }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                        style={{ zIndex: 9999 }}
                      >
                        {/* Gradient glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00AFE6]/5 to-[#00DD89]/5 rounded-2xl"></div>
                        
                        {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                          <motion.a
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="relative block px-6 py-4 text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-[#00AFE6]/15 hover:to-[#00DD89]/15 transition-all duration-300 text-base font-semibold border-l-2 border-transparent hover:border-[#00AFE6] hover:shadow-lg hover:shadow-[#00AFE6]/10 group/item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ 
                              opacity: activeDropdown === item.name ? 1 : 0,
                              x: activeDropdown === item.name ? 0 : -20
                            }}
                            transition={{ duration: 0.3, delay: dropdownIndex * 0.1 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full opacity-50 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                              <span className="group-hover/item:translate-x-1 transition-transform duration-300">
                                {dropdownItem.name}
                              </span>
                            </div>
                          </motion.a>
                        ))}
                      </motion.div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Theme Toggle & CTA Section */}
          <motion.div
            className="hidden md:flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            
            <button className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border border-transparent hover:border-white/20">
              {t('nav.getHelp')}
            </button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-3 rounded-xl bg-white/20 backdrop-blur-xl border border-white/20 hover:bg-white/30 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white/90" />
            ) : (
              <Menu className="w-6 h-6 text-white/90" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="lg:hidden overflow-hidden"
          initial={false}
          animate={{ 
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="py-6 bg-gray-800/90 backdrop-blur-xl rounded-2xl mt-4 border border-white/20">
            <div className="space-y-2 px-4">
              {navItems.map((item) => (
                <div key={item.name} className="space-y-1">
                  {item.hasDropdown ? (
                    <>
                      <div className="px-4 py-3 font-semibold text-base border-b border-white/20 text-white/90">
                        {item.name}
                      </div>
                      {item.dropdownItems?.map((dropdownItem) => (
                        <a
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-6 py-3 rounded-lg transition-all duration-300 text-base text-white/80 hover:text-white hover:bg-white/10"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {dropdownItem.name}
                        </a>
                      ))}
                    </>
                  ) : (
                    <a
                      href={item.href}
                      className="block px-4 py-3 font-semibold text-base rounded-lg transition-all duration-300 text-white/90 hover:bg-white/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  )}
                </div>
              ))}
            </div>
            <div className="px-4 pt-4 border-t border-white/20 mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Phone className="w-4 h-4" />
                  <span>1-800-AMYLOID</span>
                </div>
                <ThemeToggle />
              </div>
              <button 
                className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-xl font-bold text-base hover:shadow-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Support
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}