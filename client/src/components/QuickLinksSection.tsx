import { motion } from 'framer-motion';
import { Search, Upload, Users, BookOpen, ArrowRight } from 'lucide-react';

const quickLinks = [
  {
    title: 'Find Support',
    description: 'Connect with support groups and patient resources',
    icon: Search,
    color: 'from-[#00AFE6] to-[#0099CC]',
    hoverColor: 'group-hover:shadow-[#00AFE6]/20'
  },
  {
    title: 'Upload Resource',
    description: 'Share clinical guidelines and research materials',
    icon: Upload,
    color: 'from-[#00DD89] to-[#00BB77]',
    hoverColor: 'group-hover:shadow-[#00DD89]/20'
  },
  {
    title: 'Join CAS',
    description: 'Become part of our advocacy community',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    hoverColor: 'group-hover:shadow-purple-500/20'
  },
  {
    title: 'Browse Resources',
    description: 'Explore our comprehensive resource library',
    icon: BookOpen,
    color: 'from-gray-600 to-gray-700',
    hoverColor: 'group-hover:shadow-gray-600/20'
  }
];

export default function QuickLinksSection() {
  return (
    <section className="py-24 bg-[#F8FAFB]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="headline-lg mb-6">
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
                className={`module-card cursor-pointer group transition-all duration-300 hover:shadow-xl ${link.hoverColor}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.03, 
                  y: -8,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div 
                  className={`w-16 h-16 bg-gradient-to-br ${link.color} rounded-3xl flex items-center justify-center mb-6 shadow-sm`}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="headline-md mb-4">
                  {link.title}
                </h3>
                
                <p className="body-md mb-6 text-[#6B7280]">
                  {link.description}
                </p>
                
                <motion.div 
                  className="flex items-center text-[#00AFE6] font-medium"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}