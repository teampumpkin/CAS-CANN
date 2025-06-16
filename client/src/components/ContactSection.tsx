import { motion } from 'framer-motion';
import { ArrowRight, Settings, Search } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="crawford-dark-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gray-800 rounded-3xl p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Side - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-8">
                <span className="inline-flex items-center px-4 py-2 bg-white/10 text-white/80 rounded-full text-sm font-medium mb-6">
                  🎯 Your healthcare journey
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-normal text-white mb-8 leading-tight">
                Start Your Project
              </h2>

              <p className="text-white/80 text-lg mb-12 leading-relaxed">
                Join the ranks of patients and families that trust our expertise. Start 
                your project with a free discovery call and see how we can 
                bring your healthcare vision to life.
              </p>

              {/* Service Options */}
              <div className="space-y-4 mb-12">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Comprehensive Care & Support</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Research & Clinical Resources</div>
                  </div>
                </div>
              </div>

              <motion.button
                className="crawford-btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20 inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule a call
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Subject
                  </label>
                  <div className="relative">
                    <select className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-white/40 transition-colors appearance-none">
                      <option value="">Select one</option>
                      <option value="patient-support">Patient Support</option>
                      <option value="caregiver-resources">Caregiver Resources</option>
                      <option value="clinical-trials">Clinical Trials</option>
                      <option value="education">Education & Research</option>
                      <option value="general">General Inquiry</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors resize-none"
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-medium transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Submit
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}