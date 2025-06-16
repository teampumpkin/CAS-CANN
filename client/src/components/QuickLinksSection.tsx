import { motion } from 'framer-motion';
import { Heart, Upload, Users, BookOpen } from 'lucide-react';

const quickLinks = [
  {
    id: 'support',
    title: 'Find Support',
    description: 'Connect with patient support groups',
    icon: Heart,
    href: '#support'
  },
  {
    id: 'upload',
    title: 'Upload Resource',
    description: 'Share clinical materials',
    icon: Upload,
    href: '#upload'
  },
  {
    id: 'join',
    title: 'Join CAS',
    description: 'Become part of our community',
    icon: Users,
    href: '#join'
  },
  {
    id: 'browse',
    title: 'Browse Resources',
    description: 'Explore our resource library',
    icon: BookOpen,
    href: '#resources'
  }
];

export default function QuickLinksSection() {
  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl lg:text-5xl font-light text-gray-900 mb-8 leading-tight">
            Quick Actions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Take action today to support the amyloidosis community and access the resources you need.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {quickLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <motion.a
                key={link.id}
                href={link.href}
                className="group bg-white rounded-2xl p-10 border border-gray-100 text-center block shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  ease: [0.6, -0.05, 0.01, 0.99]
                }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl mx-auto mb-8 bg-gray-50 flex items-center justify-center group-hover:bg-[#00AFE6] transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <IconComponent 
                    className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors duration-300"
                  />
                </motion.div>

                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  {link.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {link.description}
                </p>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}