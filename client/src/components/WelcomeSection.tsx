import { motion } from 'framer-motion';

export default function WelcomeSection() {
  return (
    <section className="relative py-32 lg:py-40 bg-gradient-to-br from-white via-blue-50/30 to-gray-50 overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 20, 0],
            y: [0, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-[#00DD89]/8 to-[#00AFE6]/8 rounded-full blur-3xl"
          animate={{ 
            x: [0, -15, 0],
            y: [0, 15, 0],
            scale: [1.1, 1, 1.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-[#0088CC] px-4 py-2 rounded-full text-sm font-medium border border-blue-100 shadow-sm mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            <span>Our Mission</span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Welcome to the{" "}
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#0088CC] bg-clip-text text-transparent">
              Canadian Amyloidosis Society
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Accelerating awareness, diagnosis, and care for patients facing amyloidosis across Canada.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Content Column */}
          <motion.div
            className="lg:col-span-8 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                The <strong>Canadian Amyloidosis Society (CAS)</strong> is dedicated to transforming the landscape of amyloidosis care in Canada. 
                We serve as a vital bridge connecting patients, families, healthcare professionals, and researchers in the fight against this rare disease.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
                  <p className="text-gray-600">
                    A world where amyloidosis is diagnosed early, treated effectively, and every patient receives comprehensive support.
                  </p>
                </motion.div>

                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                  <p className="text-gray-600">
                    To accelerate awareness, improve diagnosis, and enhance care through education, research, and community building.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Image and Stats Column */}
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-8">
              {/* Medical Image */}
              <motion.div
                className="relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/50"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <div className="text-center text-gray-500 p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6] to-[#0088CC] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">Medical Research Image</p>
                    <p className="text-xs opacity-70">Healthcare professionals collaboration</p>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Our Impact Stats Card */}
              <motion.div
                className="relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/60"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                {/* Enhanced Header with gradient */}
                <div className="bg-gradient-to-r from-[#00AFE6] via-[#00DD89] to-[#00AFE6] p-6 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <h4 className="relative text-white font-bold text-xl text-center">Our Impact</h4>
                </div>
                
                {/* Enhanced Statistics with modern design */}
                <div className="p-8">
                  <div className="grid grid-cols-3 gap-6">
                    <motion.div 
                      className="text-center group"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="text-3xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#0088CC] bg-clip-text text-transparent mb-2"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.5, type: "spring", bounce: 0.4 }}
                      >
                        15+
                      </motion.div>
                      <div className="text-sm text-gray-700 font-semibold mb-2">Years Supporting</div>
                      <motion.div 
                        className="w-full h-2 bg-[#00AFE6]/20 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.7 }}
                      >
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#00AFE6] to-[#0088CC] rounded-full"
                          initial={{ width: "0%" }}
                          whileInView={{ width: "80%" }}
                          transition={{ duration: 1.5, delay: 0.8 }}
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div 
                      className="text-center group"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="text-3xl font-bold bg-gradient-to-r from-[#00DD89] to-[#00BB77] bg-clip-text text-transparent mb-2"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.6, type: "spring", bounce: 0.4 }}
                      >
                        1K+
                      </motion.div>
                      <div className="text-sm text-gray-700 font-semibold mb-2">Patients Helped</div>
                      <motion.div 
                        className="w-full h-2 bg-[#00DD89]/20 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.8 }}
                      >
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#00DD89] to-[#00BB77] rounded-full"
                          initial={{ width: "0%" }}
                          whileInView={{ width: "100%" }}
                          transition={{ duration: 1.5, delay: 0.9 }}
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div 
                      className="text-center group"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent mb-2"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.7, type: "spring", bounce: 0.4 }}
                      >
                        100%
                      </motion.div>
                      <div className="text-sm text-gray-700 font-semibold mb-2">Patient Focused</div>
                      <motion.div 
                        className="w-full h-2 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.9 }}
                      >
                        <motion.div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"
                          initial={{ width: "0%" }}
                          whileInView={{ width: "100%" }}
                          transition={{ duration: 1.5, delay: 1 }}
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>

                {/* Subtle hover effects */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)"
                  }}
                />
              </motion.div>

              {/* Enhanced Decorative floating elements */}
              <motion.div 
                className="absolute -top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-lg"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              <motion.div 
                className="absolute top-1/3 -left-6 w-8 h-8 bg-gradient-to-br from-[#00AFE6]/30 to-[#00DD89]/30 rounded-full shadow-lg"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}