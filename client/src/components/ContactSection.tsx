import { motion } from 'framer-motion';
import { ArrowRight, Settings, Search } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="relative py-32 lg:py-40 bg-gradient-to-br from-white via-gray-50/50 to-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-[#00AFE6]/5 to-[#00DD89]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-[#00DD89]/5 to-[#00AFE6]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Contact Info */}
            <motion.div
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-12 lg:p-16"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
                <span className="text-white/90 font-medium tracking-wide">Get Support</span>
              </motion.div>

              <h2 className="crawford-section-title text-white mb-8 text-left">
                Connect With Our Team
              </h2>

              <p className="text-xl text-white/80 mb-12 leading-relaxed">
                Whether you're a patient, caregiver, or healthcare professional, our dedicated team is here to provide the support and resources you need.
              </p>

              {/* Service Options */}
              <div className="space-y-6 mb-12">
                <motion.div 
                  className="group flex items-center gap-6 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6] to-[#0088CC] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg mb-1">Patient Support</div>
                    <div className="text-white/70">Comprehensive care coordination and resources</div>
                  </div>
                </motion.div>

                <motion.div 
                  className="group flex items-center gap-6 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00DD89] to-[#00BB77] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg mb-1">Clinical Resources</div>
                    <div className="text-white/70">Access to research and treatment information</div>
                  </div>
                </motion.div>
              </div>

              <motion.button
                className="group relative bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-10 py-4 rounded-2xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative flex items-center gap-2">
                  Schedule a call
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              className="p-12 lg:p-16"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Send us a message</h3>
                <p className="text-gray-600">We'll get back to you within 24 hours.</p>
              </div>

              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-3">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]/20 focus:border-[#00AFE6] transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]/20 focus:border-[#00AFE6] transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-3">
                    How can we help?
                  </label>
                  <div className="relative">
                    <select className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]/20 focus:border-[#00AFE6] transition-all duration-300 appearance-none">
                      <option value="">Select a topic</option>
                      <option value="patient-support">Patient Support</option>
                      <option value="caregiver-resources">Caregiver Resources</option>
                      <option value="clinical-trials">Clinical Trials Information</option>
                      <option value="education">Education & Research</option>
                      <option value="healthcare-provider">Healthcare Provider Resources</option>
                      <option value="general">General Inquiry</option>
                    </select>
                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-3">
                    Your Message
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Please describe how we can help you..."
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]/20 focus:border-[#00AFE6] transition-all duration-300 resize-none"
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] hover:from-[#0088CC] hover:to-[#00BB77] text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}