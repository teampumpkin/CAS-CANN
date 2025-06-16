import { motion } from 'framer-motion';
import medicalProfessionalImg from '@assets/DSC02826_1750092328495.jpg';

export default function WelcomeSection() {
  return (
    <section className="relative py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Content Column - Left Side */}
          <motion.div
            className="lg:pr-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Small tag */}
            <motion.div
              className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Who we are</span>
            </motion.div>

            {/* Main heading */}
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Welcome to the Canadian Amyloidosis Society (CAS)
            </motion.h2>

            {/* Description paragraphs */}
            <motion.div 
              className="space-y-6 text-gray-600 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p>
                We are dedicated to transforming amyloidosis care in Canada through patient-centered innovation, collaboration, and advocacy. Our mission is to enhance the quality and timeliness of care for individuals affected by this rare and complex disease.
              </p>
              
              <p>
                By accelerating access to diagnosis, treatment, and support, we are working to ensure that every person living with amyloidosis receives the care they need—when they need it, wherever they are in Canada.
              </p>
            </motion.div>

            {/* Social/Contact buttons - Crawford style */}
            <motion.div 
              className="flex gap-4 mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button className="w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </button>
              <button className="w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
              <button className="w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.160 1.219-5.160s-.219-.438-.219-1.085c0-1.016.593-1.775 1.332-1.775.628 0 .93.47.93 1.033 0 .629-.4 1.570-.606 2.442-.172.729.365 1.322 1.083 1.322 1.301 0 2.301-1.370 2.301-3.353 0-1.752-1.259-2.977-3.059-2.977-2.084 0-3.308 1.563-3.308 3.176 0 .629.242 1.303.544 1.67.059.072.068.135.05.209-.055.23-.177.719-.2.82-.031.129-.101.157-.233.094-1.186-.551-1.929-2.280-1.929-3.675 0-2.99 2.172-5.735 6.257-5.735 3.284 0 5.834 2.341 5.834 5.472 0 3.265-2.057 5.886-4.918 5.886-.96 0-1.864-.499-2.174-1.097 0 0-.475 1.807-.59 2.251-.213.814-.791 1.834-1.175 2.458 1.323.408 2.726.628 4.187.628 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </button>
              <button className="w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect width="24" height="24" fill="none"/>
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </button>
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
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/5]">
                <img 
                  src={medicalProfessionalImg} 
                  alt="Medical professional working with healthcare technology"
                  className="w-full h-full object-cover"
                />
                
                {/* Stats Overlay - Exact Crawford Style */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm text-white"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <div className="px-8 py-6">
                    <div className="grid grid-cols-3 gap-8 text-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        <div className="text-4xl font-bold text-white mb-2">15+</div>
                        <div className="text-sm text-white/80">Years Supporting</div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                      >
                        <div className="text-4xl font-bold text-white mb-2">1K+</div>
                        <div className="text-sm text-white/80">Patients Helped</div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                      >
                        <div className="text-4xl font-bold text-white mb-2">100%</div>
                        <div className="text-sm text-white/80">Patient Focused</div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}