import { motion } from 'framer-motion';
import { MapPin, Search, Upload, BookOpen, Users } from 'lucide-react';

const directoryFeatures = [
  {
    id: 'clinics',
    title: 'Directory of Clinics',
    description: 'Find specialized treatment centers',
    icon: Search,
    count: '75+ Centers'
  },
  {
    id: 'resources',
    title: 'Uploadable Resources',
    description: 'Share clinical materials',
    icon: Upload,
    count: '500+ Resources'
  },
  {
    id: 'types',
    title: 'Amyloidosis Types',
    description: 'Information on all subtypes',
    icon: BookOpen,
    count: '12 Types'
  },
  {
    id: 'mission',
    title: 'Join Mission',
    description: 'Connect with community',
    icon: Users,
    count: '2,500+ Members'
  }
];

const mapLocations = [
  { id: 1, name: 'Vancouver', x: '15%', y: '35%' },
  { id: 2, name: 'Calgary', x: '25%', y: '40%' },
  { id: 3, name: 'Toronto', x: '55%', y: '65%' },
  { id: 4, name: 'Montreal', x: '65%', y: '58%' },
  { id: 5, name: 'Halifax', x: '75%', y: '70%' }
];

export default function DirectoryPreviewSection() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl lg:text-5xl font-light text-gray-900 mb-8 leading-tight">
            What You'll Find Here
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover comprehensive resources and connect with specialists across Canada.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Mini Map Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="bg-gray-50 rounded-3xl p-12">
              <h3 className="text-2xl font-medium text-gray-900 mb-8 text-center">
                Treatment Centers Across Canada
              </h3>

              <div className="relative w-full h-80 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Simplified Canada outline */}
                <svg className="w-full h-full" viewBox="0 0 100 60" fill="none">
                  <path
                    d="M10 25 Q20 20 35 27 L50 30 Q65 27 80 32 L90 35 L90 45 Q80 47 65 44 L50 42 Q35 45 20 42 L10 40 Z"
                    fill="#f8fafc"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                </svg>

                {/* Location pins */}
                {mapLocations.map((location, index) => (
                  <motion.div
                    key={location.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: location.x, top: location.y }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.5 + (index * 0.1),
                      type: "spring",
                      stiffness: 300
                    }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <div className="relative group cursor-pointer">
                      <div className="w-3 h-3 bg-[#00AFE6] rounded-full shadow-sm"></div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {location.name}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Interactive map showing treatment centers
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="grid grid-cols-2 gap-6">
              {directoryFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.id}
                    className="bg-white rounded-2xl p-6 border border-gray-100 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.2 + (index * 0.1),
                      ease: [0.6, -0.05, 0.01, 0.99]
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <div className="w-12 h-12 bg-[#00AFE6] rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="text-sm font-medium text-[#00AFE6] bg-[#00AFE6] bg-opacity-10 px-3 py-1 rounded-full inline-block">
                      {feature.count}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div 
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="bg-[#00AFE6] text-white px-8 py-4 rounded-full font-medium hover:bg-[#0099CC] transition-colors duration-200 inline-flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MapPin className="w-5 h-5" />
                <span>Explore Full Directory</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}