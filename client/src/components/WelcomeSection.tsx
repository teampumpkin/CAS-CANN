import { motion } from 'framer-motion';

export default function WelcomeSection() {
  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Mission Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl lg:text-5xl font-light text-gray-900 mb-12 leading-tight">
              Our Mission
            </h2>
            
            <div className="space-y-8 text-lg text-gray-600 leading-relaxed">
              <p>
                The Canadian Amyloidosis Society is dedicated to improving the lives of those 
                affected by amyloidosis through education, advocacy, and community support.
              </p>
              
              <p>
                We work tirelessly to accelerate awareness among healthcare professionals, 
                support patients and families throughout their journey, and advance research 
                initiatives that lead to better outcomes.
              </p>
            </div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="bg-white rounded-3xl p-12 shadow-sm">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-2xl mx-auto mb-8 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>

                <h3 className="text-2xl font-medium text-gray-900 mb-8">
                  Making a Difference
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <span className="text-gray-600">Patients Supported</span>
                    <span className="font-medium text-[#00AFE6] text-lg">1,200+</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <span className="text-gray-600">Healthcare Providers</span>
                    <span className="font-medium text-[#00AFE6] text-lg">350+</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-4">
                    <span className="text-gray-600">Research Studies</span>
                    <span className="font-medium text-[#00AFE6] text-lg">25+</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}