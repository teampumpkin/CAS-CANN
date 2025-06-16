import { motion } from 'framer-motion';
import medicalProfessionalImg from '@assets/DSC02826_1750092328495.jpg';

export default function WelcomeSection() {
  return (
    <section className="relative py-32 lg:py-40 bg-gradient-to-br from-white via-blue-50/30 to-gray-50 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-[#00DD89]/8 to-[#00AFE6]/8 rounded-full blur-3xl"></div>
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
            className="inline-flex items-center gap-2 bg-blue-50 text-[#0088CC] px-4 py-2 rounded-full text-sm font-medium border border-blue-100 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            <span>Our Mission</span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            Welcome to the{" "}
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#0088CC] bg-clip-text text-transparent">
              Canadian Amyloidosis Society (CAS)
            </span>
          </h2>
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
              <p className="text-xl text-gray-600 leading-relaxed">
                We are dedicated to transforming amyloidosis care in Canada through patient-centered innovation, collaboration, and advocacy. Our mission is to enhance the quality and timeliness of care for individuals affected by this rare and complex disease. By accelerating access to diagnosis, treatment, and support, we are working to ensure that every person living with amyloidosis receives the care they need—when they need it, wherever they are in Canada.
              </p>
            </div>
          </motion.div>

          {/* Image and Stats Column - Following Crawford design pattern */}
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              {/* Medical Image with Professional Styling */}
              <motion.div
                className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="aspect-[4/5] relative">
                  <img 
                    src={medicalProfessionalImg} 
                    alt="Medical professional working with healthcare technology"
                    className="w-full h-full object-cover"
                  />

                  {/* Stats Overlay - Crawford Style */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-white p-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <div className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] p-4 mb-4 rounded-lg">
                      <h4 className="text-white font-bold text-lg text-center">Our Impact</h4>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        <div className="text-2xl font-bold text-white mb-1">15+</div>
                        <div className="text-xs text-white/80 font-medium">Years Supporting</div>
                        <div className="w-full h-1 bg-white/20 rounded-full mt-2">
                          <motion.div 
                            className="w-4/5 h-full bg-[#00AFE6] rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "80%" }}
                            transition={{ duration: 1, delay: 0.8 }}
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                      >
                        <div className="text-2xl font-bold text-white mb-1">1K+</div>
                        <div className="text-xs text-white/80 font-medium">Patients Helped</div>
                        <div className="w-full h-1 bg-white/20 rounded-full mt-2">
                          <motion.div 
                            className="w-full h-full bg-[#00DD89] rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            transition={{ duration: 1, delay: 0.9 }}
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                      >
                        <div className="text-2xl font-bold text-white mb-1">100%</div>
                        <div className="text-xs text-white/80 font-medium">Patient Focused</div>
                        <div className="w-full h-1 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-2">
                          <motion.div 
                            className="w-full h-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            transition={{ duration: 1, delay: 1 }}
                          />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
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