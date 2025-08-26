import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
      <div className="container mx-auto px-6 py-16">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header Badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 backdrop-blur-xl rounded-full px-6 py-3 border border-[#00AFE6]/20 dark:border-[#00AFE6]/30 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Mail className="w-5 h-5 text-[#00AFE6]" />
            <span className="text-sm font-medium text-gray-800 dark:text-white/90">Contact Us</span>
          </motion.div>

          {/* Welcome Title */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-gray-900 dark:text-white">Welcome to </span>
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">CAS</span>
          </motion.h1>

          {/* Purpose Statement */}
          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-white/70 mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We welcome all questions and feedback. Whether you're a patient, caregiver, healthcare professional, or researcher, we're here to connect and support the amyloidosis community.
          </motion.p>

          {/* Email Section */}
          <motion.div
            className="bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-400/30 shadow-2xl mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-3xl flex items-center justify-center shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Get in Touch
                </h2>
                <p className="text-gray-600 dark:text-white/70 mb-6">
                  Send us your questions, feedback, or collaboration ideas
                </p>
              </div>

              <motion.a
                href="mailto:cas@amyloid.ca"
                className="group inline-flex items-center gap-4 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xl">cas@amyloid.ca</span>
              </motion.a>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            className="bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-400/30 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  How do I submit a new resource to the directory?
                </h4>
                <p className="text-gray-600 dark:text-white/70">
                  You can submit resources by contacting us at cas@amyloid.ca with details about the resource you'd like to add. All submissions undergo review by our editorial team.
                </p>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Can I update information in the healthcare directory/map?
                </h4>
                <p className="text-gray-600 dark:text-white/70">
                  Yes! Healthcare professionals can update their directory information by contacting cas@amyloid.ca with their current details and credentials.
                </p>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  How do I join CAS as a healthcare professional? Is there a fee to join?
                </h4>
                <p className="text-gray-600 dark:text-white/70">
                  Contact us at cas@amyloid.ca to submit a membership application and learn about membership fees.
                </p>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Do you provide direct patient care?
                </h4>
                <p className="text-gray-600 dark:text-white/70">
                  No, CAS does not provide direct patient care. We are a professional organization that supports healthcare providers and connects patients with appropriate care resources.
                </p>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  What information do you collect and how is it used?
                </h4>
                <p className="text-gray-600 dark:text-white/70">
                  We collect only necessary information to provide our services. All data is handled according to our Privacy Policy and Canadian privacy laws. We never share personal information with third parties without consent.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Can patients or family members/supports join the CAS?
                </h4>
                <p className="text-gray-600 dark:text-white/70">
                  Yes, we welcome patients, family members, and support persons as part of the CAS community. Contact us at cas@amyloid.ca for information about involvement opportunities.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}