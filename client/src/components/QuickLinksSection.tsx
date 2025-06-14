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
    <section className="section-spacer bg-[#FAFBFC]">
      <div className="crawford-section">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="heading-xl mb-8">
            Quick Actions
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Get started with the most common tasks and resources for patients, caregivers, and healthcare professionals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <motion.div
                key={link.title}
                className="crawford-card tile-crawford group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="tile-content text-center">
                  <motion.div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 mx-auto"
                    style={{ backgroundColor: link.color }}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 3,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <IconComponent className="w-7 h-7 text-white" />
                  </motion.div>
                  
                  <h3 className="heading-lg mb-4">
                    {link.title}
                  </h3>
                  
                  <p className="body-md text-[#6a6a6a]">
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