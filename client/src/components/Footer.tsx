import { motion } from 'framer-motion';
import { Heart, Mail, Phone, ArrowRight, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'About CAS', href: '/about-cas', icon: Heart },
    { name: 'About Amyloidosis', href: '/about-amyloidosis', icon: Heart },
    { name: 'Directory - Find Support', href: '/directory', icon: Heart },
    { name: 'Resource Library', href: '/resources', icon: Heart },
    { name: 'Join CAS', href: '/join-cas', icon: Heart },
  ];

  const secondaryLinks = [
    { name: 'Governance & Strategy', href: '/governance' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Get Involved', href: '/get-involved' },
    { name: 'Upload Resource', href: '/upload-resource' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' }
  ];

  return (
    <footer className="bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#00AFE6]/5 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00DD89]/5 rounded-full blur-3xl translate-x-48 translate-y-48" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Newsletter Section */}
        <div className="py-10">
          <motion.div 
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-bold text-white mb-2 font-rosarivo">
              Stay Connected
            </h3>
            <p className="text-white/70 mb-4 text-sm">
              Get updates on research, resources, and community events.
            </p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#00AFE6] transition-colors text-sm"
              />
              <motion.button
                className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Main Footer Content */}
        <div className="py-8 border-b border-white/10">
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Brand & Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white font-rosarivo">CAS</h4>
                  <p className="text-white/70 text-xs">Canadian Amyloidosis Society</p>
                </div>
              </div>
              
              <p className="text-white/70 leading-relaxed mb-4 text-sm">
                Transforming amyloidosis care in Canada through patient-centered innovation, collaboration, and advocacy.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Mail className="w-4 h-4 text-[#00AFE6]" />
                  <span>info@canadianamyloidosis.ca</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Phone className="w-4 h-4 text-[#00DD89]" />
                  <span>1-800-AMYLOID</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-lg font-bold text-white mb-4 font-rosarivo">Quick Links</h4>
              <div className="space-y-1">
                {quickLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className="group flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg p-2 transition-all duration-300 text-sm"
                    whileHover={{ x: 2 }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                  >
                    <ArrowRight className="w-3 h-3 text-[#00AFE6]" />
                    <span>{link.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Resources & Social */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-bold text-white mb-4 font-rosarivo">Resources</h4>
              <div className="space-y-1 mb-6">
                {secondaryLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className="block p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 text-sm"
                    whileHover={{ x: 2 }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              {/* Social Media */}
              <div>
                <h5 className="text-sm font-semibold text-white mb-3">Follow Us</h5>
                <div className="flex gap-2">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      className="w-8 h-8 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="py-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div>
            © 2024 Canadian Amyloidosis Society. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/accessibility" className="hover:text-white transition-colors">Accessibility</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}