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
    <footer className="relative bg-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-3 gap-16 mb-16">
          
          {/* Brand & Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-cardo">Canadian</h3>
                <p className="text-white/80">Amyloidosis Society</p>
              </div>
            </div>
            
            <p className="text-white/70 leading-relaxed mb-8">
              Dedicated to advancing awareness, research, and support for those affected by amyloidosis across Canada.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/70">
                <Mail className="w-4 h-4 text-[#00AFE6]" />
                <span>info@amyloidosis.ca</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Phone className="w-4 h-4 text-[#00AFE6]" />
                <span>1-800-AMYLOID</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="w-4 h-4 text-[#00AFE6]" />
                <span>Toronto, Ontario</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links & Secondary Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <h4 className="text-xl font-bold text-white mb-6 font-cardo">Quick Links</h4>
            <div className="space-y-4 mb-8">
              {quickLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="group flex items-center gap-3 text-white/70 hover:text-white transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  <link.icon className="w-4 h-4 text-[#00AFE6] group-hover:scale-110 transition-transform duration-300" />
                  <span>{link.name}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.a>
              ))}
            </div>

            <h5 className="text-lg font-semibold text-white mb-4 font-rosarivo">More</h5>
            <div className="space-y-3">
              {secondaryLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-white/60 hover:text-white transition-colors duration-300 text-sm"
                >
                  {link.name}
                </a>
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