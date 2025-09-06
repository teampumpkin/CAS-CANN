import { motion } from 'framer-motion';
import { Heart, Instagram, Linkedin, Twitter, Facebook, MapPin, Phone, Mail, FileText, Users, Calendar, Search, Globe, Shield, BookOpen, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import casLogo from '@assets/l_cas_vert_ko_1753253840024.png';

export default function Footer() {
  const { language, setLanguage } = useLanguage();

  const informationLinks = [
    { name: "About CAS", href: "/about", status: "available" },
    { name: "About Amyloidosis", href: "/about-amyloidosis", status: "available" },
    { name: "Resources", href: "/resources", status: "available" },
    { name: "Contact Us", href: "/contact", status: "available" },
    { name: "Get Involved", href: "/get-involved", status: "available" }
  ];

  const sitemapLinks = [
    { name: "About CAS", href: "/about", icon: Users, status: "available" },
    { name: "About Amyloidosis", href: "/about-amyloidosis", icon: FileText, status: "available" },
    { name: "Resources", href: "/resources", icon: BookOpen, status: "available" },
    { name: "Get Involved", href: "/get-involved", icon: Heart, status: "available" },
    { name: "Events", href: "/events", icon: Calendar, status: "available" },
    { name: "CANN", href: "/nursing-network", icon: Users, status: "available" },
    { name: "Join CAS", href: "/join-cas", icon: Users, status: "available" },
    { name: "Contact Us", href: "/contact", icon: Mail, status: "available" }
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy", icon: Shield },
    { name: "Terms of Use", href: "/terms-of-use", icon: FileText },
    { name: "Accessibility", href: "/accessibility", icon: Globe }
  ];

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/canadianamyloidosis', color: 'hover:text-pink-400' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/canadian-amyloidosis-society', color: 'hover:text-blue-400' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/amyloidosis_ca', color: 'hover:text-blue-400' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/canadianamyloidosis', color: 'hover:text-blue-500' }
  ];

  const contactInfo = [
    { type: 'email', value: 'CAS@amyloid.ca', icon: Mail },
    { type: 'email', value: 'CANN@amyloid.ca', icon: Mail }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden border-t border-white/10">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#00AFE6]/15 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00DD89]/15 rounded-full blur-3xl translate-x-48 translate-y-48" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Main Content */}
        <div className="py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Brand Section */}
            <div className="md:col-span-1 lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">
                  <img 
                    src={casLogo} 
                    alt="Canadian Amyloidosis Society"
                    className="h-20 w-auto hover:scale-105 transition-all duration-300"
                  />
                </div>
                
                <p className="text-white/80 text-sm leading-relaxed mb-4">
                  Advancing awareness, enhancing patient care, and improving outcomes for all Canadians affected by amyloidosis.
                </p>

                {/* Contact Information */}
                <div>
                  <h4 className="text-white font-semibold mb-2 text-sm">Contact</h4>
                  <div className="space-y-1">
                    {contactInfo.map((contact, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <contact.icon className="w-3 h-3 text-[#00AFE6]" />
                        <a
                          href={`mailto:${contact.value}`}
                          className="text-white/70 hover:text-white transition-colors duration-300 text-xs"
                        >
                          {contact.value}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-base font-semibold text-white mb-3">Quick Links</h3>
                <ul className="space-y-1">
                  {sitemapLinks.slice(0, 6).map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-white/70 hover:text-white transition-colors duration-300 text-xs flex items-center gap-2 group hover:translate-x-1"
                      >
                        <link.icon className="w-3 h-3 text-[#00AFE6] group-hover:text-[#00DD89] transition-colors duration-300" />
                        <span className="flex-1">{link.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Language Toggle */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/5 backdrop-blur-xl rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-3 h-3 text-[#00AFE6]" />
                    <span className="text-white font-medium text-xs">Language</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 flex-1 ${
                        language === 'en' 
                          ? 'bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg' 
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLanguage('fr')}
                      className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 flex-1 ${
                        language === 'fr' 
                          ? 'bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg' 
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      FR
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Legal Links */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h4 className="text-white font-semibold mb-2 text-sm">Legal</h4>
                <ul className="space-y-1">
                  {legalLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-white/70 hover:text-white transition-colors duration-300 text-xs flex items-center gap-2 group"
                      >
                        <link.icon className="w-3 h-3 text-[#00AFE6] group-hover:text-[#00DD89] transition-colors duration-300" />
                        <span>{link.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>


          </div>
        </div>

        {/* Bottom Section - Enhanced */}
        <motion.div 
          className="border-t border-white/10 py-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="text-white/50 text-xs">
              © 2025 Canadian Amyloidosis Society. All rights reserved.
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <a href="/accessibility" className="text-white/70 hover:text-white transition-colors flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Accessibility Statement
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}