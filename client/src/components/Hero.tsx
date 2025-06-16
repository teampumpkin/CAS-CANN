import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="crawford-section crawford-mesh">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="crawford-asymmetric">
          <motion.div
            className="crawford-content-left"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <motion.h1
              className="crawford-hero mb-8"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              CANADIAN
              <br />
              <span className="crawford-gradient bg-clip-text text-transparent">
                AMYLOIDOSIS
              </span>
              <br />
              SOCIETY
            </motion.h1>
            
            <motion.p
              className="crawford-subtitle mb-12 max-w-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Accelerating awareness, diagnosis, and care through innovation and community
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.button
                className="crawford-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                EXPLORE DIRECTORY
              </motion.button>
              
              <motion.button
                className="crawford-btn-outline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                LEARN MORE
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            className="crawford-content-right"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <div className="relative">
              <motion.div
                className="crawford-card crawford-card-hover p-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 crawford-gradient rounded-full mx-auto mb-8 flex items-center justify-center">
                    <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                      <path d="M2 17L12 22L22 17" />
                      <path d="M2 12L12 17L22 12" />
                    </svg>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-6">Impact by Numbers</h3>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-4 border-b border-zinc-700">
                      <span className="text-gray-400">Patients Supported</span>
                      <span className="text-2xl font-bold text-[#00AFE6]">1,200+</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-4 border-b border-zinc-700">
                      <span className="text-gray-400">Healthcare Providers</span>
                      <span className="text-2xl font-bold text-[#00AFE6]">350+</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-4">
                      <span className="text-gray-400">Research Studies</span>
                      <span className="text-2xl font-bold text-[#00AFE6]">25+</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00AFE6] rounded-full opacity-5 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#00DD89] rounded-full opacity-5 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </section>
  );
}