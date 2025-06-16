import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    id: 'what-is',
    question: 'What is amyloidosis?',
    answer: 'Amyloidosis is a rare disease that occurs when abnormal proteins called amyloids build up in your organs and tissues. These protein deposits can affect the function of your heart, kidneys, liver, nervous system, and other organs.'
  },
  {
    id: 'get-involved',
    question: 'How can I get involved with CAS?',
    answer: 'There are many ways to get involved with CAS, including joining support groups, volunteering, participating in awareness campaigns, or making a donation. Contact us to learn more about volunteer opportunities in your area.'
  },
  {
    id: 'financial-assistance',
    question: 'Do you provide financial assistance?',
    answer: 'While CAS doesn\'t provide direct financial assistance, we can help connect you with resources, programs, and organizations that may offer financial support for treatment, travel, or other needs related to amyloidosis care.'
  }
];

export default function FAQSection() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <section className="relative py-32 lg:py-40 bg-gradient-to-br from-white via-gray-50/50 to-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-[#00AFE6]/5 to-[#00DD89]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-[#00DD89]/5 to-[#00AFE6]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 border border-[#00AFE6]/20 rounded-full px-6 py-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            <span className="text-gray-700 font-medium tracking-wide">Questions & Answers</span>
          </motion.div>

          <h2 className="crawford-section-title text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Find answers to common questions about amyloidosis and our services.
          </p>
        </motion.div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              className="group bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100/50 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <motion.button
                className="w-full p-8 lg:p-10 text-left flex justify-between items-center hover:bg-gray-50/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]/20 focus:ring-inset group-hover:bg-gradient-to-r group-hover:from-[#00AFE6]/5 group-hover:to-[#00DD89]/5"
                onClick={() => toggleAccordion(faq.id)}
              >
                <span className="text-xl font-bold text-gray-900 text-left pr-8 group-hover:text-gray-800 transition-colors">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openAccordion === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  {openAccordion === faq.id ? (
                    <Minus className="w-6 h-6 text-[#00AFE6]" />
                  ) : (
                    <Plus className="w-6 h-6 text-[#6B7280]" />
                  )}
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {openAccordion === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8">
                      <p className="body-md">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
