import { motion } from 'framer-motion';

export default function WelcomeSection() {
  return (
    <section className="relative py-32 lg:py-40 bg-gradient-to-br from-white via-gray-50/30 to-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-[#00AFE6]/5 to-[#00DD89]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-[#00DD89]/5 to-[#00AFE6]/5 rounded-full blur-3xl"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <motion.div
            className="col-span-1 lg:col-span-6 relative z-10"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Decorative badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 border border-[#00AFE6]/20 rounded-full px-4 py-2 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Transforming Healthcare in Canada</span>
            </motion.div>

            <motion.h2
              className="crawford-section-title text-gray-900 mb-8 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Welcome to the Canadian Amyloidosis Society (CAS)
              {/* Subtle underline decoration */}
              <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            </motion.h2>

            <motion.div
              className="space-y-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-xl text-gray-700 leading-relaxed">
                We are dedicated to transforming amyloidosis care in Canada through patient-centered 
                innovation, collaboration, and advocacy.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our mission is to enhance the quality and timeliness of care for individuals affected by this rare and complex disease. By accelerating access to diagnosis, treatment, and support, we are working to ensure that every person living with amyloidosis receives the care they need—when they need it, wherever they are in Canada.
              </p>
            </motion.div>

            {/* Enhanced action buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button className="group relative bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2">
                  Contact Us Today
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              
              <button className="group bg-white/80 backdrop-blur-sm text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <span className="flex items-center gap-2">
                  Learn More
                  <svg className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            className="col-span-1 lg:col-span-6 relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="relative">
              {/* Healthcare professional image */}
              <div className="relative aspect-[5/4] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/attached_assets/DSC02826_1750068895453.jpg" 
                  alt="Healthcare professional working at computer workstation" 
                  className="w-full h-full object-cover"
                />
                {/* Subtle overlay to maintain text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>

              {/* Enhanced statistics card */}
              <motion.div
                className="absolute -bottom-8 -right-8 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* Card header */}
                <div className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] p-4">
                  <h4 className="text-white font-bold text-lg">Our Impact</h4>
                </div>
                
                {/* Statistics */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">15+</div>
                      <div className="text-sm text-gray-600 font-medium">Years Supporting</div>
                      <div className="w-full h-1 bg-[#00AFE6]/20 rounded-full mt-2">
                        <div className="w-4/5 h-full bg-[#00AFE6] rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">1K+</div>
                      <div className="text-sm text-gray-600 font-medium">Patients Helped</div>
                      <div className="w-full h-1 bg-[#00DD89]/20 rounded-full mt-2">
                        <div className="w-full h-full bg-[#00DD89] rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
                      <div className="text-sm text-gray-600 font-medium">Patient Focused</div>
                      <div className="w-full h-1 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-2"></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative floating elements */}
              <div className="absolute -top-4 left-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 animate-bounce" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute top-1/3 -left-6 w-8 h-8 bg-[#00AFE6]/20 rounded-full animate-pulse"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}