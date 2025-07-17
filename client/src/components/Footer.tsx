import { motion } from 'framer-motion';
import { Heart, Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  const informationLinks = [
    { name: "About CAS", href: "/about-cas" },
    { name: "About Amyloidosis", href: "/about-amyloidosis" },
    { name: "For Patients", href: "/for-patients" },
    { name: "For Healthcare Providers", href: "/for-professionals" },
    { name: "Resources", href: "/resources" },
    { name: "FAQ", href: "/faq" }
  ];

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Facebook', icon: Facebook, href: '#' }
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
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Brand Section - Enhanced */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center shadow-lg">
                    <Heart className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold font-rosarivo text-white">CAS</span>
                    <p className="text-white/70 text-sm">Canadian Amyloidosis Society</p>
                  </div>
                </div>
                
                <p className="text-white/70 text-base leading-relaxed mb-6">
                  Advancing awareness, accelerating research, and improving outcomes for all Canadians affected by amyloidosis.
                </p>

                {/* Newsletter Signup */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">Stay Informed</h3>
                  <p className="text-white/60 text-sm mb-4">
                    Get research updates and community news — no spam.
                  </p>
                  
                  <div className="flex gap-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#00AFE6] focus:ring-1 focus:ring-[#00AFE6]/20 transition-all duration-300"
                    />
                    <button className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                      Subscribe
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-8">
              <div className="grid md:grid-cols-3 gap-12">
                
                {/* Quick Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
                  <div className="space-y-4">
                    {informationLinks.map((link, index) => (
                      <motion.a
                        key={link.name}
                        href={link.href}
                        className="block text-white/70 hover:text-[#00AFE6] transition-colors text-sm font-medium hover:translate-x-1 transition-transform duration-300"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                        viewport={{ once: true }}
                      >
                        {link.name}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h4 className="text-lg font-semibold text-white mb-6">Contact</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wide mb-2">Email</p>
                      <a 
                        href="mailto:info@canadianamyloidosis.ca" 
                        className="text-white/70 hover:text-[#00AFE6] transition-colors text-sm font-medium"
                      >
                        info@canadianamyloidosis.ca
                      </a>
                    </div>
                    
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wide mb-2">Location</p>
                      <p className="text-white/70 text-sm">
                        Nationwide<br />
                        Canada
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Social Media */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <h4 className="text-lg font-semibold text-white mb-6">Connect</h4>
                  <div className="space-y-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        className="block text-white/70 hover:text-[#00AFE6] transition-colors text-sm font-medium hover:translate-x-1 transition-transform duration-300"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                        viewport={{ once: true }}
                      >
                        {social.name}
                      </motion.a>
                    ))}
                  </div>
                  
                  <div className="mt-8">
                    <p className="text-white/50 text-xs uppercase tracking-wide mb-3">Follow us for updates</p>
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                        <div className="w-5 h-5 bg-[#00AFE6] rounded-sm"></div>
                      </div>
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                        <div className="w-5 h-5 bg-[#00DD89] rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
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