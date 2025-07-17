import { motion } from 'framer-motion';
import medicalProfessionalImg from '@assets/DSC02826_1750092328495.jpg';

export default function WelcomeSection() {
  return (
    <section className="relative py-12 lg:py-20 bg-gradient-to-br from-[#00AFE6]/5 via-white to-[#00DD89]/5 dark:bg-gray-900 overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-[#00DD89]/12 to-[#00AFE6]/12 rounded-full blur-3xl"
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Column - Left Side */}
          <motion.div
            className="lg:pr-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Premium tag */}
            <motion.div
              className="inline-flex items-center gap-2 bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm text-gray-900 dark:text-white px-4 py-2 rounded-full text-sm font-semibold border border-gray-900/20 dark:border-white/20 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
              <span>Who we are</span>
            </motion.div>

            {/* Premium heading with gradient accent */}
            <motion.h2 
              className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight font-rosarivo"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Welcome to the{" "}
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#0088CC] bg-clip-text text-transparent">
                Canadian Amyloidosis Society
              </span>
              {" "}(CAS)
            </motion.h2>

            {/* Premium description with enhanced styling */}
            <motion.div 
              className="space-y-6 text-gray-700 dark:text-white/80 text-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-gray-600 dark:text-white/70 font-light">
                We are dedicated to transforming amyloidosis care in Canada through patient-centered innovation, collaboration, and advocacy. Our mission is to enhance the quality and timeliness of care for individuals affected by this rare and complex disease.
              </p>
              
              <p className="text-gray-600 dark:text-white/70 font-light">
                By accelerating access to diagnosis, treatment, and support, we are working to ensure that every person living with amyloidosis receives the care they need—when they need it, wherever they are in Canada.
              </p>
            </motion.div>

            {/* Premium call-to-action */}
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6] to-[#0088CC] text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 font-mulish"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Learn More About Our Work</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Image Column - Right Side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
              <div className="aspect-[4/5] relative">
                <img 
                  src={medicalProfessionalImg} 
                  alt="Medical professional working with healthcare technology"
                  className="w-full h-full object-cover"
                />
                
                {/* Stats Overlay ON the image - Crawford Style */}
                <motion.div
                  className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl shadow-2xl"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <div className="px-8 py-6">
                    <div className="flex">
                      {/* First Stat */}
                      <motion.div
                        className="flex-1 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        <div className="text-3xl lg:text-4xl font-bold text-white mb-1">15+</div>
                        <div className="text-xs text-white/90 font-medium">Years Supporting</div>
                      </motion.div>
                      
                      {/* Vertical Divider */}
                      <div className="w-px bg-white/30 mx-6"></div>
                      
                      {/* Second Stat */}
                      <motion.div
                        className="flex-1 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                      >
                        <div className="text-3xl lg:text-4xl font-bold text-white mb-1">1K+</div>
                        <div className="text-xs text-white/90 font-medium">Patients Helped</div>
                      </motion.div>
                      
                      {/* Vertical Divider */}
                      <div className="w-px bg-white/30 mx-6"></div>
                      
                      {/* Third Stat */}
                      <motion.div
                        className="flex-1 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                      >
                        <div className="text-3xl lg:text-4xl font-bold text-white mb-1">100%</div>
                        <div className="text-xs text-white/90 font-medium">Patient Focused</div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Premium floating accent elements */}
              <motion.div
                className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-full blur-xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-lg"
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  opacity: [0.6, 0.9, 0.6]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}