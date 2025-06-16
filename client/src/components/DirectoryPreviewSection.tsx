import { motion } from 'framer-motion';
import { MapPin, Upload, FileText, Users } from 'lucide-react';

export default function DirectoryPreviewSection() {
  const features = [
    {
      icon: MapPin,
      title: 'Searchable clinic directory',
      description: 'Find specialized amyloidosis care centers across Canada'
    },
    {
      icon: Upload,
      title: 'Uploadable clinical resources',
      description: 'Share and access treatment protocols and guidelines'
    },
    {
      icon: FileText,
      title: 'Clear, accessible medical info',
      description: 'Comprehensive patient education and resources'
    },
    {
      icon: Users,
      title: 'Ways to get involved and support',
      description: 'Join our community and advocacy efforts'
    }
  ];

  return (
    <section className="crawford-section bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="crawford-asymmetric">
          <motion.div
            className="crawford-content-5"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Authentic Canada Map */}
            <div className="crawford-card h-full flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  className="relative w-64 h-64 mx-auto mb-6"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  {/* Canada Map Image */}
                  <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 p-4">
                    <img 
                      src="/images/canada-map.png" 
                      alt="Map of Canada showing healthcare network coverage" 
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Interactive Location Pins */}
                    <motion.div
                      className="absolute top-[30%] left-[20%] w-4 h-4 bg-[#00AFE6] rounded-full shadow-lg"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0 }}
                    >
                      <div className="absolute inset-0 bg-[#00AFE6] rounded-full animate-ping opacity-50"></div>
                    </motion.div>
                    <motion.div
                      className="absolute top-[25%] right-[25%] w-4 h-4 bg-[#00DD89] rounded-full shadow-lg"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
                    >
                      <div className="absolute inset-0 bg-[#00DD89] rounded-full animate-ping opacity-50"></div>
                    </motion.div>
                    <motion.div
                      className="absolute bottom-[35%] left-[30%] w-4 h-4 bg-[#00AFE6] rounded-full shadow-lg"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 1.6 }}
                    >
                      <div className="absolute inset-0 bg-[#00AFE6] rounded-full animate-ping opacity-50"></div>
                    </motion.div>
                    <motion.div
                      className="absolute bottom-[25%] right-[20%] w-4 h-4 bg-[#00DD89] rounded-full shadow-lg"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 2.4 }}
                    >
                      <div className="absolute inset-0 bg-[#00DD89] rounded-full animate-ping opacity-50"></div>
                    </motion.div>
                    
                    {/* Central Healthcare Hub Icon */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                        <MapPin className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Canada-Wide Network
                </h3>
                <p className="text-gray-600">
                  Interactive clinic locations and resources
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="crawford-content-7"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h2
              className="crawford-section-title text-gray-900 mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              What You'll Find Here
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-4 p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}