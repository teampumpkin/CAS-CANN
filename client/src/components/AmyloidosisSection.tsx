import { motion } from 'framer-motion';

export default function AmyloidosisSection() {
  return (
    <section className="crawford-section crawford-mesh">
      <div className="max-w-7xl mx-auto px-6">
        <div className="crawford-asymmetric">
          <motion.div
            className="crawford-content-right order-2 lg:order-1"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-200px" }}
          >
            <motion.div
              className="crawford-card crawford-card-hover p-12 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 crawford-gradient opacity-10 rounded-bl-full"></div>
              
              <div className="relative z-10">
                <div className="text-sm uppercase tracking-wider text-[#00AFE6] font-bold mb-4">
                  FEATURED RESEARCH
                </div>
                
                <h3 className="text-3xl font-bold mb-6">
                  Latest ATTR Breakthrough
                </h3>
                
                <p className="text-gray-400 leading-relaxed mb-8">
                  New findings in ATTR amyloidosis treatment show promising results in clinical trials. 
                  Canadian researchers contribute to groundbreaking therapy development that could 
                  transform patient outcomes.
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-8 pb-6 border-b border-zinc-700">
                  <span>Published: March 2024</span>
                  <span>Journal of Cardiology</span>
                </div>

                <motion.button
                  className="crawford-btn-outline w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  READ FULL STUDY
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="crawford-content-left order-1 lg:order-2"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-200px" }}
          >
            <motion.h2
              className="crawford-title mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              WHAT IS
              <br />
              <span className="crawford-gradient bg-clip-text text-transparent">
                AMYLOIDOSIS?
              </span>
            </motion.h2>
            
            <div className="space-y-8 crawford-subtitle">
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Amyloidosis is a rare but serious condition where abnormal proteins, called amyloid, 
                build up in organs and tissues throughout the body.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                Early diagnosis is crucial for effective treatment. Our organization works to 
                increase awareness among healthcare providers and provide comprehensive resources 
                for patients and families.
              </motion.p>
            </div>

            <motion.div
              className="flex items-center space-x-4 mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="crawford-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                LEARN MORE
              </motion.button>
              
              <motion.div
                className="w-px h-12 bg-zinc-700"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                viewport={{ once: true }}
              />
              
              <motion.span
                className="text-gray-400 font-medium uppercase tracking-wider text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                viewport={{ once: true }}
              >
                ABOUT AMYLOIDOSIS
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}