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
      name: t('nav.about'),
      href: '#about',
      hasDropdown: true,
      dropdownItems: [
        { name: 'About CAS', href: '/about' },
        { name: 'About Amyloidosis', href: '/about-amyloidosis' },
        { name: 'Governance & Strategy', href: '/governance' },
      ]
    },
    {
      name: t('nav.resources'),
      href: '#resources',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Resource Library', href: '/resources' },
        { name: 'Directory - Find Support', href: '/directory' },
        { name: 'Upload Resource', href: '/upload-resource' },
      ]
    },
    {
      name: t('nav.community'),
      href: '#get-involved',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Join CAS', href: '/join' },
        { name: 'Join CANN', href: '/cann' },
        { name: 'Events', href: '/get-involved' },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
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
            <div className="flex items-center gap-1 bg-gray-900/90 backdrop-blur-xl rounded-full px-3 py-2 border border-gray-700/50 shadow-lg">
              {navItems.map((item, index) => (
                <div
                  key={item.name}
                  className="relative group"
                >
                  {item.hasDropdown ? (
                    <motion.button
                      className="flex items-center gap-2 px-5 py-2.5 text-white hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 text-base font-semibold border border-transparent hover:border-white/20"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      onMouseEnter={() => setActiveDropdown(item.name)}
                    >
                      {item.name}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    </motion.button>
                  ) : (
                    <motion.a
                      href={item.href}
                      className="flex items-center gap-2 px-5 py-2.5 text-white hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 text-base font-semibold border border-transparent hover:border-white/20"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    >
                      {item.name}
                    </motion.a>
                  )}

                  {/* Dropdown Menu */}
                  {item.hasDropdown && (
                    <div
                      className="absolute top-full left-0 pt-1 w-64 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <motion.div
                        className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl py-2"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ 
                          opacity: activeDropdown === item.name ? 1 : 0, 
                          y: activeDropdown === item.name ? 0 : -10,
                          scale: activeDropdown === item.name ? 1 : 0.95
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                          <motion.a
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block px-5 py-3 text-gray-200 hover:text-white hover:bg-gray-700/50 transition-all duration-200 text-base font-medium"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ 
                              opacity: activeDropdown === item.name ? 1 : 0,
                              x: activeDropdown === item.name ? 0 : -10
                            }}
                            transition={{ duration: 0.2, delay: dropdownIndex * 0.05 }}
                          >
                            {dropdownItem.name}
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
            className="hidden md:flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <LanguageSwitcher />
            <ThemeToggle />
            
            <button className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-3 rounded-full font-bold text-base hover:shadow-lg hover:scale-105 transition-all duration-300">
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