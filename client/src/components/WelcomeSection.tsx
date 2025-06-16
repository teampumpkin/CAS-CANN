import { motion } from 'framer-motion';

export default function WelcomeSection() {
  return (
    <section className="crawford-light-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="crawford-asymmetric">
          <motion.div
            className="crawford-content-7"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="crawford-section-title text-gray-900 mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Welcome to the Canadian Amyloidosis Society (CAS)
            </motion.h2>

            <motion.p
              className="text-lg text-gray-700 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              We are dedicated to transforming amyloidosis care in Canada through patient-centered 
              innovation, collaboration, and advocacy. Our mission is to enhance the quality and 
              timeliness of care for individuals affected by this rare and complex disease. By 
              accelerating access to diagnosis, treatment, and support, we are working to ensure 
              that every person living with amyloidosis receives the care they need—when they need 
              it, wherever they are in Canada.
            </motion.p>
          </motion.div>

          <motion.div
            className="crawford-content-5"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="crawford-card h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <div className="text-gray-600 font-medium">Dedicated to Care</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}