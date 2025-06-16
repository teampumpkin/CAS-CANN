import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';

export default function AmyloidosisSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* What is Amyloidosis */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-8">
              What is Amyloidosis?
            </h2>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed mb-10">
              <p>
                Amyloidosis is a rare but serious condition where abnormal proteins, called amyloid, 
                build up in organs and tissues throughout the body. This buildup can affect the 
                function of vital organs including the heart, kidneys, liver, and nervous system.
              </p>
              
              <p>
                Early diagnosis is crucial for effective treatment. Our organization works to 
                increase awareness among healthcare providers and provide comprehensive resources 
                for patients and families navigating this complex condition.
              </p>
            </div>

            <motion.a
              href="#about-amyloidosis"
              className="inline-flex items-center space-x-3 text-[#00AFE6] font-medium hover:text-[#0099CC] transition-colors duration-200"
              whileHover={{ x: 5 }}
            >
              <span>Learn More About Amyloidosis</span>
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>

          {/* Featured Research Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="bg-white rounded-3xl p-10 border border-gray-100 relative overflow-hidden"
              style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}
              whileHover={{ 
                y: -8,
                boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08)',
                transition: { duration: 0.3 }
              }}
            >
              {/* Featured Badge */}
              <div className="absolute top-6 right-6">
                <div className="bg-[#00DD89] text-white px-4 py-2 rounded-full text-sm font-medium">
                  Featured
                </div>
              </div>

              <div className="mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <h3 className="text-2xl font-medium text-gray-900 mb-4">
                  Latest Research Breakthrough
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  New findings in ATTR amyloidosis treatment show promising results in clinical trials. 
                  Canadian researchers contribute to groundbreaking therapy development that could 
                  change patient outcomes significantly.
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <span>Published: March 2024</span>
                  <span>Journal of Cardiology</span>
                </div>
              </div>

              <motion.a
                href="#research"
                className="inline-flex items-center space-x-3 bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Read Full Study</span>
                <ExternalLink className="w-4 h-4" />
              </motion.a>

              {/* Decorative gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00AFE6] to-[#00DD89]"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}