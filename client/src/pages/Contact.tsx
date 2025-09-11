import { motion } from 'framer-motion';
import { Mail, ChevronDown, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I submit a new resource to the directory?",
      answer: "You can submit resources by contacting us at cas@amyloid.ca with details about the resource you'd like to add. All submissions undergo review by our editorial team."
    },
    {
      question: "Can I update information in the healthcare directory/map?",
      answer: "Yes! Healthcare professionals can update their directory information by contacting cas@amyloid.ca with their current details and credentials."
    },
    {
      question: "How do I join CAS as a healthcare professional? Is there a fee to join?",
      answer: "Simply visit our Join CAS page and complete the registration form. Membership is completely free for all healthcare professionals."
    },
    {
      question: "Do you provide direct patient care?",
      answer: "No, CAS does not provide direct patient care. We are a professional organization that supports healthcare providers and connects patients with appropriate care resources."
    },
    {
      question: "What information do you collect and how is it used?",
      answer: "We collect only necessary information to provide our services. All data is handled according to our Privacy Policy and Canadian privacy laws. We never share personal information with third parties without consent."
    },
    {
      question: "Can patients or family members/supports join the CAS?",
      answer: "Yes, we welcome patients, family members, and support persons as part of the CAS community. Contact us at cas@amyloid.ca for information about involvement opportunities."
    }
  ];

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
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 leading-tight font-rosarivo"
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
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 font-rosarivo">
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
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 font-rosarivo">
                <span className="text-gray-900 dark:text-white">Frequently Asked </span>
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">Questions</span>
              </h3>
              <p className="text-gray-600 dark:text-white/70">
                Quick answers to common questions about CAS, resources, and membership.
              </p>
            </div>
            
            <div className="space-y-4 max-w-4xl mx-auto">
              {faqData.slice(2).map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-600/30 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-6 text-left flex items-start justify-between hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200 group"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                        {index + 1}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#00AFE6] transition-colors duration-200 leading-relaxed">
                        {faq.question}
                      </h4>
                    </div>
                    <motion.div
                      animate={{ rotate: openFAQ === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0 ml-4 mt-1"
                    >
                      <ChevronDown className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-[#00AFE6] transition-colors duration-200" />
                    </motion.div>
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFAQ === index ? "auto" : 0,
                      opacity: openFAQ === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 border-t border-gray-200/50 dark:border-gray-600/30">
                      <div className="pt-6">
                        <div className="flex gap-4">
                          <div className="w-8 flex-shrink-0"></div>
                          <p className="text-gray-600 dark:text-white/70 leading-relaxed text-base text-left">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}