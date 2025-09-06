import { motion } from 'framer-motion';
import { Heart, Instagram, Linkedin, Twitter, Facebook, MapPin, Phone, Mail, FileText, Users, Calendar, Search, Globe, Shield, BookOpen, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import casLogo from '@assets/l_cas_vert_ko_1753253840024.png';

export default function Footer() {
  const { language, setLanguage } = useLanguage();

  const sitemapLinks = [
    { name: "About CAS", href: "/about", icon: Users, status: "available" },
    { name: "About Amyloidosis", href: "/about-amyloidosis", icon: FileText, status: "available" },
    { name: "Resources", href: "/resources", icon: BookOpen, status: "available" },
    { name: "Get Involved", href: "/get-involved", icon: Heart, status: "available" },
    { name: "Events", href: "/events", icon: Calendar, status: "available" },
    { name: "CANN", href: "/nursing-network", icon: Users, status: "available" },
    { name: "Contact Us", href: "/contact", icon: Mail, status: "available" }
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Use", href: "/terms-of-use" }
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
        <div className="py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="mb-6">
                  <img 
                    src={casLogo} 
                    alt="Canadian Amyloidosis Society"
                    className="h-24 w-auto hover:scale-105 transition-all duration-300"
                  />
                </div>
                
                <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-md">
                  Advancing awareness, enhancing patient care, and improving outcomes for all Canadians affected by amyloidosis.
                </p>

                {/* Contact Information */}
                <div>
                  <h4 className="text-white font-semibold mb-3 text-sm">Contact Us</h4>
                  <div className="space-y-2">
                    {contactInfo.map((contact, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <contact.icon className="w-4 h-4 text-[#00AFE6]" />
                        <a
                          href={`mailto:${contact.value}`}
                          className="text-white/70 hover:text-white transition-colors duration-300 text-sm"
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
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-white font-semibold mb-4 text-sm">Quick Links</h3>
                <ul className="space-y-2">
                  {sitemapLinks.slice(0, 6).map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-white/70 hover:text-white transition-colors duration-300 text-sm block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Legal & Language */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {/* Legal Links */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-4 text-sm">Legal</h4>
                  <ul className="space-y-2">
                    {legalLinks.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-white/70 hover:text-white transition-colors duration-300 text-sm block"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Language Toggle */}
                <div>
                  <h4 className="text-white font-semibold mb-3 text-sm">Language</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        language === 'en' 
                          ? 'bg-[#00AFE6] text-white' 
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLanguage('fr')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        language === 'fr' 
                          ? 'bg-[#00AFE6] text-white' 
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      Français
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-white/10 py-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-white/50 text-sm">
              © 2025 Canadian Amyloidosis Society. All rights reserved.
            </div>
            <div>
              <a href="/accessibility" className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Accessibility Statement
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}