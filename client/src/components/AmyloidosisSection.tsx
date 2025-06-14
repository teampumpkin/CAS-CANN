import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

export default function AmyloidosisSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="headline-lg mb-8">
              What is Amyloidosis?
            </h2>
            <p className="body-lg mb-6">
              Amyloidosis is a group of rare diseases caused by abnormal protein deposits called amyloids that build up in organs and tissues throughout the body. These deposits can affect the function of vital organs including the heart, kidneys, liver, and nervous system.
            </p>
            <p className="body-lg mb-8">
              There are several types of amyloidosis, with the most common being AL (light chain) and ATTR (transthyretin) amyloidosis. Early diagnosis and appropriate treatment are crucial for managing the condition effectively.
            </p>
            <motion.a
              href="#"
              className="accessible-link font-medium inline-flex items-center text-lg"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <span>Learn More About Amyloidosis</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.a>
          </motion.div>

          {/* Special Feature Card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="module-card cursor-pointer group"
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-[#00AFE6] font-medium">FEATURED RESEARCH</span>
                  <h3 className="headline-md mt-2 mb-3">
                    New ATTR Treatment Guidelines Released
                  </h3>
                </div>
              </div>
              <p className="body-md mb-6">
                The latest evidence-based guidelines for ATTR amyloidosis treatment have been published, offering new hope for patients and updated protocols for clinicians.
              </p>
              <motion.div 
                className="flex items-center text-[#00AFE6] font-medium"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <span>Read the Guidelines</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}