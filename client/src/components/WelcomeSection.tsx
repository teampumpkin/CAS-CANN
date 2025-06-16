import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function WelcomeSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Mission Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-8">
              Our Mission
            </h2>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                The Canadian Amyloidosis Society is dedicated to improving the lives of those 
                affected by amyloidosis through education, advocacy, and community support.
              </p>
              
              <p>
                We work tirelessly to accelerate awareness among healthcare professionals, 
                support patients and families throughout their journey, and advance research 
                initiatives that lead to better outcomes.
              </p>
              
              <p>
                Together, we're building a comprehensive network of resources, expertise, 
                and hope for the amyloidosis community across Canada.
              </p>
            </div>

            <motion.div 
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="#about"
                className="inline-flex items-center space-x-3 bg-[#00AFE6] text-white px-8 py-4 rounded-full font-medium hover:bg-[#0099CC] transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Learn More About CAS</span>
                <ArrowRight className="w-5 h-5" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-2xl mx-auto mb-8 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>

                <h3 className="text-2xl font-medium text-gray-900 mb-6">
                  Making a Difference
                </h3>

                <div className="space-y-6 text-gray-600">
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <span>Patients Supported</span>
                    <span className="font-medium text-[#00AFE6]">1,200+</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <span>Healthcare Providers</span>
                    <span className="font-medium text-[#00AFE6]">350+</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <span>Resources Shared</span>
                    <span className="font-medium text-[#00AFE6]">500+</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-4">
                    <span>Research Studies</span>
                    <span className="font-medium text-[#00AFE6]">25+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#00DD89] rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-[#00AFE6] rounded-full opacity-15"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}