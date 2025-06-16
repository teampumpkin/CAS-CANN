import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="crawford-section bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="crawford-asymmetric">
          <motion.div
            className="crawford-content-7"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                ⚡ Who am I?
              </span>
            </div>

            <motion.h1
              className="crawford-hero-title mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Meet Canadian Amyloidosis Society - Your
              Dedicated Healthcare Support Organization
            </motion.h1>
            
            <motion.p
              className="crawford-subtitle mb-12 max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Looking to create comprehensive amyloidosis care without the hassle of navigating 
              alone? Collaborate with us, your go-to healthcare support organization. 
              With deep understanding of patient needs and medical expertise—from intuitive 
              support services to advanced care coordination—we deliver top-tier assistance 
              tailored to your journey.
            </motion.p>

            <motion.p
              className="text-gray-700 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              As a recognized healthcare advocate and community leader, we bring 
              unparalleled skill and experience to every case. With over 1,200 patients 
              supported successfully, we don't just provide care—we create comprehensive 
              support experiences that resonate and empower.
            </motion.p>

            <motion.p
              className="text-gray-700 mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Ready to unlock the full potential of your healthcare journey? Let's work 
              together to craft modern, impactful support for your needs.{' '}
              <a href="#contact" className="text-blue-600 underline hover:text-blue-700">
                Contact us today!
              </a>
            </motion.p>

            {/* Social Links */}
            <motion.div
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              {[
                { name: 'Be', href: '#', bg: 'bg-black' },
                { name: 'Dr', href: '#', bg: 'bg-pink-500' },
                { name: 'Li', href: '#', bg: 'bg-blue-600' },
                { name: 'Yt', href: '#', bg: 'bg-red-500' },
                { name: '@', href: '#', bg: 'bg-gray-600' }
              ].map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className={`w-12 h-12 ${social.bg} text-white rounded-full flex items-center justify-center font-medium hover:scale-110 transition-transform duration-200`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.name}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="crawford-content-5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Main Image Container */}
              <div className="bg-gradient-to-br from-blue-100 via-purple-50 to-green-100 rounded-3xl p-8 relative overflow-hidden">
                <div className="bg-white rounded-2xl p-8 relative z-10">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-2xl mx-auto mb-8 flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-8 text-center">
                      <div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">450+</div>
                        <div className="text-sm text-gray-600">Successful Cases</div>
                      </div>
                      
                      <div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">05</div>
                        <div className="text-sm text-gray-600">Awards Won</div>
                      </div>
                      
                      <div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
                        <div className="text-sm text-gray-600">Client Satisfaction</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Pattern */}
                <div className="absolute top-4 right-4 w-24 h-24 opacity-20">
                  <div className="grid grid-cols-4 gap-1 h-full">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="bg-gray-400 rounded-sm"></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating CTA */}
              <motion.div
                className="absolute -bottom-6 right-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <button className="bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200 shadow-lg">
                  📞 Book a free call
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}