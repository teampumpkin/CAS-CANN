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
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="headline-lg mb-6">
            Frequently Asked Questions
          </h2>
          <p className="body-lg">
            Find answers to common questions about amyloidosis and our services.
          </p>
        </motion.div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              className="module-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <motion.button
                className="w-full p-8 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:ring-inset"
                onClick={() => toggleAccordion(faq.id)}
                whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
              >
                <span className="headline-md text-left pr-8">
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
