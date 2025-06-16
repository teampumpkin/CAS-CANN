import { motion } from 'framer-motion';

export default function WelcomeSection() {
  return (
    <section className="crawford-section bg-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="crawford-asymmetric">
          <motion.div
            className="crawford-content-left"
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
              OUR
              <br />
              <span className="crawford-gradient bg-clip-text text-transparent">
                MISSION
              </span>
            </motion.h2>
            
            <div className="space-y-8 crawford-subtitle">
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                The Canadian Amyloidosis Society is dedicated to improving the lives of those 
                affected by amyloidosis through education, advocacy, and community support.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                We work tirelessly to accelerate awareness among healthcare professionals, 
                support patients and families throughout their journey, and advance research 
                initiatives that lead to better outcomes.
              </motion.p>
            </div>

            <motion.button
              className="crawford-btn-outline mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              LEARN MORE
            </motion.button>
          </motion.div>

          <motion.div
            className="crawford-content-right"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-200px" }}
          >
            <div className="space-y-8">
              {[
                { number: "1,200+", label: "PATIENTS SUPPORTED", delay: 0.2 },
                { number: "350+", label: "HEALTHCARE PROVIDERS", delay: 0.4 },
                { number: "25+", label: "RESEARCH STUDIES", delay: 0.6 }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="crawford-card crawford-card-hover p-8 border-l-4 border-[#00AFE6]"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: stat.delay }}
                  viewport={{ once: true }}
                >
                  <div className="text-5xl font-black mb-2 crawford-gradient bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}