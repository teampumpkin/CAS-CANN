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
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-12 lg:gap-20">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold font-rosarivo">CAS</span>
            </motion.div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-lg font-medium mb-2">Stay informed</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Get research updates, treatment advances, and community news — no spam.
              </p>
              
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter e-mail address"
                  className="flex-1 bg-transparent border border-gray-700 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00AFE6] transition-colors"
                />
                <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                  Ok
                </button>
              </div>
            </motion.div>
          </div>

          {/* Information Links */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-medium mb-6">Information</h4>
              <div className="space-y-3">
                {informationLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className="block text-gray-400 hover:text-white transition-colors text-sm"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              <div className="mt-8">
                <h5 className="text-sm font-medium mb-3">Contact</h5>
                <a 
                  href="mailto:info@canadianamyloidosis.ca" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  info@canadianamyloidosis.ca
                </a>
              </div>
            </motion.div>
          </div>

          {/* Social Media */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-lg font-medium mb-6">Social Media</h4>
              <div className="space-y-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="block text-gray-400 hover:text-white transition-colors text-sm"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                  >
                    {social.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-gray-800 mt-16 pt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="text-gray-500 text-sm">
            © 2025, Canadian Amyloidosis Society. All Rights Reserved.
          </div>
          
          <div className="flex gap-8 text-sm">
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/cookies" className="text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </a>
            <div className="text-gray-500">
              Website by <span className="text-white">Astient Labrador</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}