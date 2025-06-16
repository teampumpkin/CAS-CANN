import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function WelcomeSection() {
  return (
    <section className="crawford-light-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            📚 CAS Latest Work
          </motion.div>

          <motion.h2
            className="crawford-section-title text-gray-900 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Building Healthcare Programs That
            Drive Results
          </motion.h2>

          <motion.p
            className="crawford-subtitle max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Want amyloidosis support that converts challenges into success stories? Explore our 
            portfolio to see how we've turned patient needs into vibrant realities. From comprehensive 
            education programs to engaging support networks, our programs are crafted to meet your 
            thriving healthcare needs and stand out in the medical landscape.
          </motion.p>

          <motion.button
            className="crawford-btn-primary inline-flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View all work
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 - Education */}
          <motion.div
            className="crawford-card group cursor-pointer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <ArrowRight className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Education</span>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Patient Education Hub
            </h3>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 aspect-video flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="text-sm text-gray-600">Comprehensive Learning</div>
              </div>
            </div>
          </motion.div>

          {/* Card 2 - Support */}
          <motion.div
            className="crawford-card group cursor-pointer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <ArrowRight className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Support</span>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Community Network
            </h3>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 aspect-video flex items-center justify-center mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="w-8 h-8 bg-[#00AFE6] rounded-lg"></div>
                  <div className="w-8 h-8 bg-[#00DD89] rounded-lg"></div>
                  <div className="w-8 h-8 bg-blue-400 rounded-lg"></div>
                  <div className="w-8 h-8 bg-purple-400 rounded-lg"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3 - Research */}
          <motion.div
            className="crawford-card group cursor-pointer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <ArrowRight className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">Medical</span>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Research & Clinical Trials
            </h3>

            <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 aspect-video flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
                  </svg>
                </div>
                <div className="text-sm text-gray-600">Advanced Research</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}