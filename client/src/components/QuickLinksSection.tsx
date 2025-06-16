import { motion } from 'framer-motion';
import { Search, Upload, Users, BookOpen } from 'lucide-react';

const quickLinks = [
  {
    title: 'Find Support',
    description: 'Connect with support groups and patient resources',
    icon: Search,
    color: '#00AFE6'
  },
  {
    title: 'Upload Resource',
    description: 'Share clinical guidelines and research materials',
    icon: Upload,
    color: '#00DD89'
  },
  {
    title: 'Join CAS',
    description: 'Become part of our advocacy community',
    icon: Users,
    color: '#8B5CF6'
  },
  {
    title: 'Browse Resources',
    description: 'Explore our comprehensive resource library',
    icon: BookOpen,
    color: '#6B7280'
  }
];

export default function QuickLinksSection() {
  return (
    <section className="py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
            Quick Actions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get started with the most common tasks and resources for patients, caregivers, and healthcare professionals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <motion.div
                key={link.title}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="bg-white rounded-2xl p-8 text-center transition-all duration-300 border border-gray-100/50"
                  style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 12px 40px ${link.color}20`;
                    e.currentTarget.style.borderColor = `${link.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(229, 231, 235, 0.5)';
                  }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 mx-auto"
                    style={{ backgroundColor: link.color }}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 3,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-medium text-gray-900 mb-3">
                    {link.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {link.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}