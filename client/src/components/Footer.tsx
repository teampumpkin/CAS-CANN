import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight, Heart, Globe, Users, Stethoscope } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About CAS', href: '/about-cas', icon: Heart },
    { name: 'About Amyloidosis', href: '/about-amyloidosis', icon: Stethoscope },
    { name: 'Directory - Find Support', href: '/directory', icon: Globe },
    { name: 'Resources', href: '/resources', icon: Users }
  ];

  const secondaryLinks = [
    { name: 'Governance & Strategy', href: '/governance' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Get Involved', href: '/get-involved' },
    { name: 'Upload Resource', href: '/upload-resource' },
    { name: 'Join CAS', href: '/join-cas' }
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', initial: 'f' },
    { name: 'Twitter', href: '#', initial: 'x' },
    { name: 'LinkedIn', href: '#', initial: 'in' },
    { name: 'YouTube', href: '#', initial: 'yt' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#00AFE6]/5 via-transparent to-[#00DD89]/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-[#00AFE6]/15 to-[#00DD89]/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#00DD89]/8 to-[#00AFE6]/8 rounded-full blur-3xl" />
      </div>

      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00AFE6] via-[#00DD89] to-[#00AFE6]" />

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* Newsletter CTA Section */}
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-12 border border-white/10 max-w-4xl mx-auto">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-rosarivo">
              Stay Connected with CAS
            </h3>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Get the latest updates on amyloidosis research, treatment advances, and community events directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-[#00AFE6] transition-colors"
              />
              <motion.button
                className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center shadow-xl">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-rosarivo">CAS</h3>
                <p className="text-white/70 text-sm font-medium">Canadian Amyloidosis Society</p>
              </div>
            </div>
            
            <p className="text-white/70 leading-relaxed mb-8 text-sm">
              Transforming amyloidosis care in Canada through patient-centered innovation, collaboration, and advocacy. Building bridges between patients, families, and healthcare providers.
            </p>
            
            {/* Enhanced Contact Information */}
            <div className="space-y-4">
              <motion.div 
                className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white/90 font-medium text-sm">Email Us</p>
                  <p className="text-white/60 text-xs">info@canadianamyloidosis.ca</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-[#00DD89] to-[#00BB77] rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white/90 font-medium text-sm">Call Us</p>
                  <p className="text-white/60 text-xs">1-800-AMYLOID</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Links & Secondary Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <h4 className="text-xl font-bold text-white mb-8 font-rosarivo">Quick Navigation</h4>
            <div className="grid gap-3 mb-8">
              {quickLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="group flex items-center gap-4 p-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                  whileHover={{ x: 8 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${index % 2 === 0 ? 'from-[#00AFE6] to-[#0088CC]' : 'from-[#00DD89] to-[#00BB77]'} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <link.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-white/90 font-medium text-sm block">{link.name}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            <h5 className="text-xl font-bold text-white mb-6 font-rosarivo">Resources</h5>
            <div className="space-y-3">
              {secondaryLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="block p-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 text-sm font-medium"
                  whileHover={{ x: 4 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.05 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Newsletter & Social */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <h4 className="text-xl font-bold text-white mb-6 font-cardo">Stay Connected</h4>
            
            {/* Newsletter */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6">
              <p className="text-white/80 mb-4">Get updates on research, resources, and community events.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#00AFE6] transition-colors"
                />
                <button className="px-4 py-3 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-white/70 mb-4">Follow us</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 border border-white/20 hover:border-[#00AFE6]/50 transition-all duration-300"
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-xs font-bold">{social.initial}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-white/10 pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © {currentYear} Canadian Amyloidosis Society. All rights reserved.
            </p>
            <div className="flex gap-6">
              {[
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Accessibility', href: '/accessibility' },
                { name: 'Disclaimers', href: '/disclaimers' }
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}