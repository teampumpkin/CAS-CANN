import { motion } from 'framer-motion';
import { Heart, Users, Search, FileText, Monitor, Smartphone } from 'lucide-react';

export default function ServicesSection() {
  return (
    <section className="crawford-dark-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-white/10 text-white/80 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🛠️ Our services
          </motion.div>

          <motion.h2
            className="crawford-section-title text-white mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Want To Save Time And Money By
            Working With A Healthcare Expert?
          </motion.h2>

          <motion.p
            className="crawford-subtitle text-white/80 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Our services can be purchased individually or bundled together for a comprehensive 
            solution. This flexibility allows you to get exactly what you need, without paying 
            for features you don't.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Service 1 */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 group hover:bg-white/10 transition-all duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-colors">
              <Heart className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">
              Comprehensive
              Patient Care
            </h3>

            <p className="text-white/80 mb-8 leading-relaxed">
              Catering to all patient needs, from initial diagnosis through ongoing treatment, 
              ensuring your healthcare journey reflects your unique requirements and circumstances.
            </p>

            <button className="text-white/80 hover:text-white text-sm font-medium underline">
              Learn more
            </button>
          </motion.div>

          {/* Service 2 */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 group hover:bg-white/10 transition-all duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-colors">
              <Users className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">
              No-Code,
              Hassle-Free Support
            </h3>

            <p className="text-white/80 mb-8 leading-relaxed">
              Enjoy exceptional support without the need for complex medical navigation, 
              saving you time and money on care coordination.
            </p>

            <button className="text-white/80 hover:text-white text-sm font-medium underline">
              Learn more
            </button>
          </motion.div>

          {/* Service 3 */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 group hover:bg-white/10 transition-all duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-colors">
              <Search className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">
              Research &
              Clinical Trials
            </h3>

            <p className="text-white/80 mb-8 leading-relaxed">
              Make sure your treatment options are accessible to everyone. We conduct accessibility 
              assessments to ensure compliance with healthcare standards.
            </p>

            <button className="text-white/80 hover:text-white text-sm font-medium underline">
              Learn more
            </button>
          </motion.div>

          {/* Service 4 */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 group hover:bg-white/10 transition-all duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-colors">
              <FileText className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">
              Educational
              Resources
            </h3>

            <p className="text-white/80 mb-8 leading-relaxed">
              Switching treatment approaches? We'll ensure a smooth transition process for 
              seamless care continuity and optimal patient outcomes.
            </p>

            <button className="text-white/80 hover:text-white text-sm font-medium underline">
              Learn more
            </button>
          </motion.div>

          {/* Service 5 */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 group hover:bg-white/10 transition-all duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-colors">
              <Monitor className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">
              Digital Health
              Platforms
            </h3>

            <p className="text-white/80 mb-8 leading-relaxed">
              Even though healthcare technology advances rapidly, ongoing support and 
              management ensure your digital health tools remain effective and up-to-date.
            </p>

            <button className="text-white/80 hover:text-white text-sm font-medium underline">
              Learn more
            </button>
          </motion.div>

          {/* Service 6 */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 group hover:bg-white/10 transition-all duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-colors">
              <Smartphone className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-semibold text-white mb-6">
              Mobile Health
              Applications
            </h3>

            <p className="text-white/80 mb-8 leading-relaxed">
              Need something unique? We offer custom healthcare solutions to push the boundaries of 
              what's possible in patient care and medical innovation.
            </p>

            <button className="text-white/80 hover:text-white text-sm font-medium underline">
              Learn more
            </button>
          </motion.div>
        </div>

        {/* Service Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl p-8 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                  <div className="text-white/80 text-sm">Interactive Tools</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl p-8 aspect-video flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-[#00AFE6] rounded"></div>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-[#00DD89] rounded"></div>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}