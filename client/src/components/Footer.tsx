import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'ORGANIZATION',
      links: [
        { name: 'ABOUT CAS', href: '#about' },
        { name: 'OUR MISSION', href: '#mission' },
        { name: 'LEADERSHIP', href: '#leadership' },
        { name: 'ANNUAL REPORTS', href: '#reports' }
      ]
    },
    {
      title: 'RESOURCES',
      links: [
        { name: 'PATIENT SUPPORT', href: '#support' },
        { name: 'CLINICAL GUIDELINES', href: '#guidelines' },
        { name: 'RESEARCH', href: '#research' },
        { name: 'SUPPORT GROUPS', href: '#groups' }
      ]
    },
    {
      title: 'GET INVOLVED',
      links: [
        { name: 'VOLUNTEER', href: '#volunteer' },
        { name: 'DONATE', href: '#donate' },
        { name: 'EVENTS', href: '#events' },
        { name: 'NEWSLETTER', href: '#newsletter' }
      ]
    }
  ];

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-16 mb-20">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 crawford-gradient rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-xl">CAS</span>
              </div>
              <div>
                <div className="font-bold text-xl">CANADIAN</div>
                <div className="font-bold text-xl">AMYLOIDOSIS</div>
                <div className="font-bold text-xl">SOCIETY</div>
              </div>
            </div>
            
            <p className="text-gray-400 mb-10 leading-relaxed uppercase tracking-wider text-sm">
              Dedicated to supporting patients, families, and healthcare professionals affected by amyloidosis.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-400">
                <svg className="w-4 h-4 text-[#00AFE6]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm uppercase tracking-wider">INFO@AMYLOIDOSIS.CA</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <svg className="w-4 h-4 text-[#00AFE6]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm uppercase tracking-wider">1-800-AMYLOID</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <svg className="w-4 h-4 text-[#00AFE6]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm uppercase tracking-wider">TORONTO, ONTARIO</span>
              </div>
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      className="text-gray-400 hover:text-[#00AFE6] transition-colors duration-200 uppercase tracking-wider text-sm font-medium"
                      whileHover={{ x: 5 }}
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter & Social */}
        <motion.div
          className="border-t border-zinc-800 pt-16 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Newsletter */}
            <div>
              <h4 className="text-3xl font-bold text-white mb-6 uppercase tracking-wider">
                STAY <span className="crawford-gradient bg-clip-text text-transparent">UPDATED</span>
              </h4>
              <p className="text-gray-400 mb-8 uppercase tracking-wider text-sm">
                Get the latest news and resources from CAS.
              </p>
              <div className="flex space-x-4">
                <input
                  type="email"
                  placeholder="ENTER YOUR EMAIL"
                  className="flex-1 px-6 py-4 bg-zinc-900 border border-zinc-700 text-white placeholder-gray-500 uppercase tracking-wider text-sm focus:outline-none focus:border-[#00AFE6] transition-colors"
                />
                <motion.button
                  className="crawford-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  SUBSCRIBE
                </motion.button>
              </div>
            </div>

            {/* Social Media */}
            <div className="text-center lg:text-right">
              <div className="text-gray-400 uppercase tracking-wider text-sm mb-6">FOLLOW US:</div>
              <div className="flex justify-center lg:justify-end space-x-4">
                {[
                  { name: 'FACEBOOK', href: '#' },
                  { name: 'TWITTER', href: '#' },
                  { name: 'LINKEDIN', href: '#' },
                  { name: 'YOUTUBE', href: '#' }
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-[#00AFE6] flex items-center justify-center text-gray-400 hover:text-[#00AFE6] transition-all duration-200 uppercase tracking-wider text-xs font-bold"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.name}
                  >
                    <span>{social.name[0]}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          className="border-t border-zinc-800 pt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-gray-500 uppercase tracking-wider text-sm">
              © {currentYear} CANADIAN AMYLOIDOSIS SOCIETY. ALL RIGHTS RESERVED.
            </div>
            <div className="flex space-x-8">
              {['PRIVACY POLICY', 'TERMS OF SERVICE', 'ACCESSIBILITY'].map((link) => (
                <motion.a
                  key={link}
                  href="#"
                  className="text-gray-500 hover:text-[#00AFE6] transition-colors duration-200 uppercase tracking-wider text-sm"
                  whileHover={{ y: -2 }}
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}