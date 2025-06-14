import { motion } from 'framer-motion';
import { BookOpen, Users, FileText, ArrowRight } from 'lucide-react';

const resources = [
  {
    id: 'guide',
    title: 'Patient Guide',
    description: 'Comprehensive guide covering diagnosis, treatment options, and living with amyloidosis.',
    icon: BookOpen,
    iconBg: 'bg-[#00AFE6]',
    link: 'Download PDF'
  },
  {
    id: 'groups',
    title: 'Support Groups',
    description: 'Find local and virtual support groups to connect with others on similar journeys.',
    icon: Users,
    iconBg: 'bg-[#00DD89]',
    link: 'Find Groups'
  },
  {
    id: 'guidelines',
    title: 'Clinical Guidelines',
    description: 'Evidence-based guidelines and protocols for healthcare professionals.',
    icon: FileText,
    iconBg: 'bg-gray-500',
    link: 'Access Guidelines'
  }
];

export default function ResourcesSection() {
  return (
    <section id="resources" className="py-24 bg-[#F8FAFB]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="headline-lg mb-6">
            Essential Resources
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Access comprehensive resources designed to support your journey with amyloidosis.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {resources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <motion.div
                key={resource.id}
                className="module-card cursor-pointer group"
                tabIndex={0}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className={`w-14 h-14 ${resource.iconBg} rounded-3xl flex items-center justify-center mb-6 shadow-sm`}
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconComponent className="w-7 h-7 text-white" />
                </motion.div>
                
                <h3 className="headline-md mb-4">
                  {resource.title}
                </h3>
                
                <p className="body-md mb-8">
                  {resource.description}
                </p>
                
                <motion.div 
                  className="accessible-link font-medium inline-flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>{resource.link}</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
