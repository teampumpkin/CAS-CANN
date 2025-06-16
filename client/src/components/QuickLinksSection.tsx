import { motion } from 'framer-motion';
import { Heart, Upload, Users, BookOpen } from 'lucide-react';

const quickLinks = [
  {
    id: 'support',
    title: 'Find Support',
    description: 'Connect with patient support groups and resources',
    icon: Heart,
    color: '#00AFE6',
    href: '#support'
  },
  {
    id: 'upload',
    title: 'Upload Resource',
    description: 'Share clinical materials and educational content',
    icon: Upload,
    color: '#00DD89',
    href: '#upload'
  },
  {
    id: 'join',
    title: 'Join CAS',
    description: 'Become part of our community and mission',
    icon: Users,
    color: '#8B5CF6',
    href: '#join'
  },
  {
    id: 'browse',
    title: 'Browse Resources',
    description: 'Explore our comprehensive resource library',
    icon: BookOpen,
    color: '#F59E0B',
    href: '#resources'
  }
];

export default function QuickLinksSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-8">
            Quick Actions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Take action today to support the amyloidosis community and access the resources you need.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <motion.a
                key={link.id}
                href={link.href}
                className="group bg-white rounded-2xl p-8 border border-gray-100 text-center block transition-all duration-300"
                style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: [0.6, -0.05, 0.01, 0.99]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  y: -8,
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-gray-50 group-hover:shadow-lg transition-all duration-300"
                  style={{ backgroundColor: `${link.color}15` }}
                  whileHover={{ 
                    backgroundColor: link.color,
                    transition: { duration: 0.3 }
                  }}
                >
                  <IconComponent 
                    className="w-8 h-8 transition-colors duration-300 group-hover:text-white"
                    style={{ color: link.color }}
                  />
                </motion.div>

                <h3 className="text-xl font-medium text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                  {link.title}
                </h3>

                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {link.description}
                </p>

                {/* Subtle glow effect */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                  style={{ 
                    background: `radial-gradient(circle at center, ${link.color}, transparent 70%)`
                  }}
                />
              </motion.a>
            );
          })}
        </div>

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="bg-white rounded-2xl p-10 border border-gray-100 max-w-2xl mx-auto" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}>
            <h3 className="text-2xl font-medium text-gray-900 mb-4">
              Need Something Else?
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Can't find what you're looking for? Our team is here to help connect you with the right resources and support.
            </p>
            <motion.a
              href="#contact"
              className="inline-flex items-center space-x-3 bg-[#00AFE6] text-white px-8 py-4 rounded-full font-medium hover:bg-[#0099CC] transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Contact Our Team</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}