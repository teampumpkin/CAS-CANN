import { motion } from 'framer-motion';
import { MapPin, Search, Upload, BookOpen, Users } from 'lucide-react';

const directoryFeatures = [
  {
    id: 'clinics',
    title: 'Directory of Clinics',
    description: 'Find specialized amyloidosis treatment centers across Canada',
    icon: Search,
    count: '75+ Centers',
    color: '#00AFE6'
  },
  {
    id: 'resources',
    title: 'Uploadable Resources',
    description: 'Share and access clinical materials and patient resources',
    icon: Upload,
    count: '500+ Resources',
    color: '#00DD89'
  },
  {
    id: 'types',
    title: 'Amyloidosis Types',
    description: 'Comprehensive information on all amyloidosis subtypes',
    icon: BookOpen,
    count: '12 Types',
    color: '#8B5CF6'
  },
  {
    id: 'community',
    title: 'Join Mission',
    description: 'Connect with our community and support our mission',
    icon: Users,
    count: '2,500+ Members',
    color: '#F59E0B'
  }
];

const mapLocations = [
  { id: 1, name: 'Vancouver', x: '15%', y: '25%' },
  { id: 2, name: 'Calgary', x: '25%', y: '30%' },
  { id: 3, name: 'Edmonton', x: '25%', y: '20%' },
  { id: 4, name: 'Winnipeg', x: '35%', y: '40%' },
  { id: 5, name: 'Toronto', x: '60%', y: '55%' },
  { id: 6, name: 'Ottawa', x: '65%', y: '50%' },
  { id: 7, name: 'Montreal', x: '70%', y: '48%' },
  { id: 8, name: 'Halifax', x: '80%', y: '60%' }
];

export default function DirectoryPreviewSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-8">
            What You'll Find Here
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover comprehensive resources, connect with specialists, and access the support you need on your amyloidosis journey.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Mini Map Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="bg-gray-50 rounded-3xl p-12 relative overflow-hidden">
              <h3 className="text-2xl font-medium text-gray-900 mb-8 text-center">
                Treatment Centers Across Canada
              </h3>

              {/* Simplified Canada Map */}
              <div className="relative w-full h-80 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
                  {/* Canada outline - simplified */}
                  <path
                    d="M50 80 Q80 70 120 85 L160 90 Q200 85 250 95 L300 100 Q330 95 350 105 L370 110 L370 140 Q350 145 320 140 L280 135 Q240 140 200 135 L160 130 Q120 135 80 130 L50 125 Z"
                    fill="#f8fafc"
                    stroke="#e2e8f0"
                    strokeWidth="2"
                  />
                  
                  {/* Provincial boundaries */}
                  <path d="M120 85 L120 125" stroke="#e2e8f0" strokeWidth="1" opacity="0.5" />
                  <path d="M160 90 L160 130" stroke="#e2e8f0" strokeWidth="1" opacity="0.5" />
                  <path d="M200 85 L200 135" stroke="#e2e8f0" strokeWidth="1" opacity="0.5" />
                  <path d="M250 95 L250 135" stroke="#e2e8f0" strokeWidth="1" opacity="0.5" />
                  <path d="M300 100 L300 135" stroke="#e2e8f0" strokeWidth="1" opacity="0.5" />
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
                      <div className="w-3 h-3 bg-[#00AFE6] rounded-full shadow-sm group-hover:bg-[#0099CC] transition-colors duration-200"></div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {location.name}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Interactive map showing {mapLocations.length} treatment centers
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
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
                    className="bg-white rounded-2xl p-6 border border-gray-100 text-center"
                    style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.2 + (index * 0.1),
                      ease: [0.6, -0.05, 0.01, 0.99]
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                    whileHover={{ 
                      y: -4,
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: feature.color }}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {feature.description}
                    </p>

                    <div 
                      className="text-sm font-medium px-3 py-1 rounded-full inline-block"
                      style={{ 
                        backgroundColor: `${feature.color}15`,
                        color: feature.color
                      }}
                    >
                      {feature.count}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="#directory"
                className="inline-flex items-center space-x-3 bg-[#00AFE6] text-white px-8 py-4 rounded-full font-medium hover:bg-[#0099CC] transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MapPin className="w-5 h-5" />
                <span>Explore Full Directory</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}