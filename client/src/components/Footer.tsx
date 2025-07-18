import { motion } from 'framer-motion';
import { Heart, Instagram, Linkedin, Twitter, Facebook, MapPin, Phone, Mail, FileText, Users, Calendar, Search, Globe, Shield, BookOpen, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import casLogo from '@assets/image 1_1750236540297.png';

export default function Footer() {
  const { language, setLanguage } = useLanguage();

  const informationLinks = [
    { name: "About CAS", href: "/about", status: "available" },
    { name: "About Amyloidosis", href: "/about-amyloidosis", status: "available" },
    { name: "Resources", href: "/resources", status: "available" },
    { name: "Directory", href: "/directory", status: "available" },
    { name: "Contact Us", href: "/contact", status: "available" },
    { name: "Get Involved", href: "/get-involved", status: "available" }
  ];

  const sitemapLinks = [
    { name: "Homepage", href: "/", icon: Heart, status: "available" },
    { name: "Patient Resources", href: "/resources", icon: FileText, status: "available" },
    { name: "Healthcare Directory", href: "/directory", icon: MapPin, status: "available" },
    { name: "Join CAS", href: "/join-cas", icon: Users, status: "available" },
    { name: "Upload Resource", href: "/upload-resource", icon: BookOpen, status: "available" },
    { name: "Support Groups", href: "/get-involved", icon: Users, status: "available" }
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
    { type: 'email', value: 'info@canadianamyloidosis.ca', icon: Mail },
    { type: 'phone', value: '1-800-CAS-INFO', icon: Phone },
    { type: 'address', value: 'Toronto, Ontario, Canada', icon: MapPin }
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
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Brand Section - Enhanced */}
            <div className="lg:col-span-1">
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
                    className="h-14 w-14 rounded-2xl shadow-lg"
                  />
                </div>
                
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  Advancing awareness, accelerating research, and improving outcomes for all Canadians affected by amyloidosis.
                </p>

                {/* Language Toggle */}
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-[#00AFE6]" />
                    <span className="text-white font-medium text-sm">Language</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                        language === 'en' 
                          ? 'bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg' 
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLanguage('fr')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                        language === 'fr' 
                          ? 'bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white shadow-lg' 
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      Français
                    </button>
                  </div>
                  <p className="text-white/50 text-xs mt-2">
                    {language === 'en' ? 'Content available in both languages' : 'Contenu disponible dans les deux langues'}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
                <ul className="space-y-2">
                  {sitemapLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-white/70 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                      >
                        <link.icon className="w-4 h-4 text-[#00AFE6] group-hover:text-[#00DD89] transition-colors duration-300" />
                        <span className="flex-1">{link.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          link.status === 'available' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {link.status === 'available' ? 'Available' : 'Coming Soon'}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold text-white mb-6">Contact Info</h3>
                <div className="space-y-3">
                  {contactInfo.map((contact, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <contact.icon className="w-4 h-4 text-[#00AFE6]" />
                      {contact.type === 'email' ? (
                        <a
                          href={`mailto:${contact.value}`}
                          className="text-white/70 hover:text-white transition-colors duration-300 text-sm"
                        >
                          {contact.value}
                        </a>
                      ) : contact.type === 'phone' ? (
                        <a
                          href={`tel:${contact.value}`}
                          className="text-white/70 hover:text-white transition-colors duration-300 text-sm"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <span className="text-white/70 text-sm">{contact.value}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-6">
                  <h4 className="text-white font-medium mb-3 text-sm">Follow Us</h4>
                  <div className="flex gap-2">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white/20 ${social.color} hover:scale-105`}
                      >
                        <social.icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Legal & Privacy */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold text-white mb-6">Legal & Privacy</h3>
                <ul className="space-y-2">
                  {legalLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-white/70 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                      >
                        <link.icon className="w-4 h-4 text-[#00AFE6] group-hover:text-[#00DD89] transition-colors duration-300" />
                        <span className="flex-1">{link.name}</span>
                        <ExternalLink className="w-3 h-3 text-white/50 group-hover:text-white/70 transition-colors duration-300" />
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
          className="border-t border-white/10 py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="text-white/50 text-sm">
              © 2025 Canadian Amyloidosis Society. All rights reserved.
            </div>
            
            <div className="flex flex-wrap items-center gap-8 text-sm">
              <a href="/privacy" className="text-white/70 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/cookies" className="text-white/70 hover:text-white transition-colors">
                Cookie Policy
              </a>
              <a href="/terms" className="text-white/70 hover:text-white transition-colors">
                Terms of Service
              </a>
              <div className="text-white/50">
                Website by <span className="text-[#00AFE6] font-medium">Astient Labrador</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}