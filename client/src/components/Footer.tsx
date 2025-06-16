import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Organization',
      links: [
        { name: 'About CAS', href: '#about' },
        { name: 'Our Mission', href: '#mission' },
        { name: 'Leadership', href: '#leadership' },
        { name: 'Annual Reports', href: '#reports' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Patient Support', href: '#support' },
        { name: 'Clinical Guidelines', href: '#guidelines' },
        { name: 'Research', href: '#research' },
        { name: 'Support Groups', href: '#groups' }
      ]
    },
    {
      title: 'Get Involved',
      links: [
        { name: 'Volunteer', href: '#volunteer' },
        { name: 'Donate', href: '#donate' },
        { name: 'Events', href: '#events' },
        { name: 'Newsletter', href: '#newsletter' }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-16">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CAS</span>
              </div>
              <span className="font-medium text-white">Canadian Amyloidosis Society</span>
            </div>
            
            <p className="text-gray-400 mb-8 leading-relaxed">
              Dedicated to supporting patients, families, and healthcare professionals affected by amyloidosis.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4 text-[#00AFE6]" />
                <span className="text-sm">info@amyloidosis.ca</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4 text-[#00AFE6]" />
                <span className="text-sm">1-800-AMYLOID</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4 text-[#00AFE6]" />
                <span className="text-sm">Toronto, Ontario</span>
              </div>
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h3 className="text-lg font-medium text-white mb-6">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter & Social */}
        <motion.div
          className="border-t border-gray-800 pt-12 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-8 lg:space-y-0">
            {/* Newsletter */}
            <div className="flex-1 max-w-md">
              <h4 className="text-lg font-medium text-white mb-4">Stay Updated</h4>
              <p className="text-gray-400 mb-6">
                Get the latest news and resources from CAS.
              </p>
              <div className="flex space-x-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:border-transparent transition-all"
                />
                <motion.button
                  className="px-6 py-3 bg-[#00AFE6] text-white rounded-xl font-medium hover:bg-[#0099CC] transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-400">Follow us:</span>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                  { icon: Youtube, href: '#', label: 'YouTube' }
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          className="border-t border-gray-800 pt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
            <div className="text-gray-400">
              <p>&copy; {currentYear} Canadian Amyloidosis Society. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#accessibility" className="text-gray-400 hover:text-white transition-colors duration-200">
                Accessibility
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}