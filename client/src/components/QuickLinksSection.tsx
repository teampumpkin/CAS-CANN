import { motion } from 'framer-motion';
import { MapPin, Upload, Users, FileText } from 'lucide-react';

export default function QuickLinksSection() {
  const quickLinks = [
    {
      icon: MapPin,
      title: 'Find Support in Your Region',
      description: 'Locate specialized amyloidosis clinics and healthcare providers near you',
      href: '#support',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Upload,
      title: 'Upload a Clinical Resource',
      description: 'Share treatment protocols, guidelines, and clinical insights with the community',
      href: '#upload',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Users,
      title: 'Join CAS',
      description: 'Become part of our mission to transform amyloidosis care in Canada',
      href: '#join',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: FileText,
      title: 'Browse the Resources',
      description: 'Access comprehensive educational materials and research findings',
      href: '#resources',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <section className="crawford-light-section">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="crawford-section-title text-gray-900 text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Quick Actions
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {quickLinks.map((link, index) => (
            <motion.a
              key={link.title}
              href={link.href}
              className="crawford-card group cursor-pointer text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${link.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                <link.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                {link.title}
              </h3>

              <p className="text-gray-600 leading-relaxed text-sm">
                {link.description}
              </p>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}