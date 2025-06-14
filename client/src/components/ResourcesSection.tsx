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
    iconBg: 'bg-purple-500',
    link: 'Access Guidelines'
  }
];

export default function ResourcesSection() {
  return (
    <section id="resources" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Essential Resources
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access comprehensive resources designed to support your journey with amyloidosis.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <motion.div
                key={resource.id}
                className="card-hover bg-white border border-gray-200 p-6 rounded-2xl shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:ring-offset-2"
                tabIndex={0}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className={`w-12 h-12 ${resource.iconBg} rounded-lg flex items-center justify-center mb-4`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {resource.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {resource.description}
                </p>
                
                <motion.div 
                  className="accessible-link font-medium inline-flex items-center"
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>{resource.link}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
