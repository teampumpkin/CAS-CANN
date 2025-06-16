import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function AmyloidosisSection() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* What is Amyloidosis */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl lg:text-5xl font-light text-gray-900 mb-12 leading-tight">
              What is Amyloidosis?
            </h2>
            
            <div className="space-y-8 text-lg text-gray-600 leading-relaxed mb-12">
              <p>
                Amyloidosis is a rare but serious condition where abnormal proteins, called amyloid, 
                build up in organs and tissues throughout the body.
              </p>
              
              <p>
                Early diagnosis is crucial for effective treatment. Our organization works to 
                increase awareness among healthcare providers and provide comprehensive resources 
                for patients and families.
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
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm"
              whileHover={{ 
                y: -8,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                transition: { duration: 0.3 }
              }}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="bg-[#00DD89] text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              </div>

              <h3 className="text-2xl font-medium text-gray-900 mb-6">
                Latest Research Breakthrough
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-8">
                New findings in ATTR amyloidosis treatment show promising results in clinical trials. 
                Canadian researchers contribute to groundbreaking therapy development.
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
                <span>Published: March 2024</span>
                <span>Journal of Cardiology</span>
              </div>

              <motion.button
                className="w-full bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Read Full Study
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}