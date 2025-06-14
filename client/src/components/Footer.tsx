import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

const quickLinks = [
  { name: 'About Us', href: '#about' },
  { name: 'Patient Resources', href: '#resources' },
  { name: 'Support Groups', href: '#' },
  { name: 'Events', href: '#' },
  { name: 'Donate', href: '#' }
];

const professionalLinks = [
  { name: 'Clinical Guidelines', href: '#' },
  { name: 'Research', href: '#' },
  { name: 'CME Resources', href: '#' },
  { name: 'Professional Network', href: '#' },
  { name: 'Partnership', href: '#' }
];

const legalLinks = [
  { name: 'Privacy Policy', href: '#' },
  { name: 'Terms of Service', href: '#' },
  { name: 'Accessibility', href: '#' }
];

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' }
];

export default function Footer() {
  return (
    <footer className="bg-[#1F2937] text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <motion.div 
              className="flex items-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                CAS
              </div>
              <span className="ml-4 text-xl font-light tracking-tight">Canadian Amyloidosis Society</span>
            </motion.div>
            
            <motion.p 
              className="text-gray-300 mb-8 leading-relaxed max-w-md font-light text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Supporting patients, families, and healthcare professionals affected by amyloidosis across Canada since 2010.
            </motion.p>
            
            <motion.div 
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="w-12 h-12 bg-gray-700 rounded-2xl flex items-center justify-center hover:bg-[#00AFE6] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:ring-offset-2 focus:ring-offset-gray-900"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="sr-only">{social.name}</span>
                    <IconComponent className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </motion.div>
          </div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-medium mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-[#00AFE6] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:ring-offset-2 focus:ring-offset-gray-900 focus:rounded-md font-light"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Professional Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-medium mb-6 text-white">For Professionals</h3>
            <ul className="space-y-4">
              {professionalLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-[#00AFE6] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:ring-offset-2 focus:ring-offset-gray-900 focus:rounded-md font-light"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        {/* Bottom Section */}
        <motion.div 
          className="border-t border-gray-600 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 text-sm font-light">
            © 2024 Canadian Amyloidosis Society. All rights reserved.
          </p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            {legalLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-[#00AFE6] text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:ring-offset-2 focus:ring-offset-gray-900 focus:rounded-md font-light"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
