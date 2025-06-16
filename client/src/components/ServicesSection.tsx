import { motion } from 'framer-motion';
import { Heart, Users, Search, FileText, Monitor, Smartphone } from 'lucide-react';

export default function ServicesSection() {
  return (
    <section className="relative py-32 lg:py-40 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-[#00DD89]/10 to-[#00AFE6]/10 rounded-full blur-3xl"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            <span className="text-white/90 font-medium tracking-wide">Our Services</span>
          </motion.div>

          <motion.h2
            className="crawford-section-title text-white mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Comprehensive Amyloidosis Care Solutions
          </motion.h2>

          <motion.p
            className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From diagnosis to treatment and ongoing support, we provide specialized resources 
            and expert guidance for patients, families, and healthcare professionals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-20">
          {/* Service 1 */}
          <motion.div
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10 hover:-translate-y-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#00AFE6] to-[#0088CC] rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-300">
              <Heart className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-white/90 transition-colors">
              Patient Care Support
            </h3>

            <p className="text-white/80 mb-8 leading-relaxed text-lg group-hover:text-white/90 transition-colors">
              Comprehensive support from initial diagnosis through ongoing treatment, ensuring personalized care that meets your unique needs and circumstances.
            </p>

            <motion.button 
              className="flex items-center gap-2 text-[#00AFE6] hover:text-[#0088CC] font-semibold transition-colors"
              whileHover={{ x: 5 }}
            >
              Learn more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </motion.div>

          {/* Service 2 */}
          <motion.div
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10 hover:-translate-y-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#00DD89] to-[#00BB77] rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-300">
              <Users className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-white/90 transition-colors">
              Support Networks
            </h3>

            <p className="text-white/80 mb-8 leading-relaxed text-lg group-hover:text-white/90 transition-colors">
              Connect with patient communities, support groups, and resources designed to help you navigate your healthcare journey with confidence.
            </p>

            <motion.button 
              className="flex items-center gap-2 text-[#00DD89] hover:text-[#00BB77] font-semibold transition-colors"
              whileHover={{ x: 5 }}
            >
              Learn more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </motion.div>

          {/* Service 3 */}
          <motion.div
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10 hover:-translate-y-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-300">
              <Search className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-white/90 transition-colors">
              Research & Clinical Trials
            </h3>

            <p className="text-white/80 mb-8 leading-relaxed text-lg group-hover:text-white/90 transition-colors">
              Access information about cutting-edge research and clinical trials that may offer new treatment options and hope for better outcomes.
            </p>

            <motion.button 
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              whileHover={{ x: 5 }}
            >
              Learn more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </motion.div>

          {/* Service 4 */}
          <motion.div
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10 hover:-translate-y-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl flex items-center justify-center mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-300">
              <FileText className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-white/90 transition-colors">
              Educational Resources
            </h3>

            <p className="text-white/80 mb-8 leading-relaxed text-lg group-hover:text-white/90 transition-colors">
              Comprehensive educational materials, guides, and resources to help you understand amyloidosis and make informed healthcare decisions.
            </p>

            <motion.button 
              className="flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold transition-colors"
              whileHover={{ x: 5 }}
            >
              Learn more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
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