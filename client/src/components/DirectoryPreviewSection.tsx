import { motion } from 'framer-motion';
import { MapPin, Hospital, Upload, BookOpen, Users } from 'lucide-react';

const features = [
  {
    icon: Hospital,
    title: 'Directory of Clinics',
    description: 'Find specialized amyloidosis clinics and healthcare providers across Canada'
  },
  {
    icon: Upload,
    title: 'Uploadable Resources',
    description: 'Share and access clinical guidelines, research papers, and educational materials'
  },
  {
    icon: BookOpen,
    title: 'Amyloidosis Types',
    description: 'Comprehensive information about AL, ATTR, and other amyloidosis types'
  },
  {
    icon: Users,
    title: 'Join Our Mission',
    description: 'Connect with our community and participate in advocacy efforts'
  }
];

export default function DirectoryPreviewSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="headline-lg mb-6">
            What You'll Find Here
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Explore our comprehensive directory and resources designed to support your amyloidosis journey.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Map Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="module-card p-0 overflow-hidden relative">
              {/* Simplified Map Background */}
              <div className="h-80 bg-gradient-to-br from-[#F8FCFF] to-[#F8FFFB] relative">
                <svg className="w-full h-full" viewBox="0 0 400 300" fill="none">
                  {/* Canada outline simplified */}
                  <path d="M50 150 Q 100 100, 150 120 L 200 110 Q 250 100, 300 130 L 350 140 Q 380 160, 350 200 L 320 220 Q 280 240, 240 230 L 180 235 Q 120 240, 80 220 Q 40 200, 50 150 Z" 
                        fill="#E5F3FF" stroke="#00AFE6" strokeWidth="2" opacity="0.3"/>
                </svg>
                
                {/* Animated Pins */}
                {[
                  { x: '25%', y: '40%', delay: 0.2 },
                  { x: '35%', y: '55%', delay: 0.4 },
                  { x: '60%', y: '45%', delay: 0.6 },
                  { x: '75%', y: '50%', delay: 0.8 },
                  { x: '80%', y: '35%', delay: 1.0 }
                ].map((pin, index) => (
                  <motion.div
                    key={index}
                    className="absolute w-6 h-6 bg-[#00AFE6] rounded-full flex items-center justify-center shadow-lg"
                    style={{ left: pin.x, top: pin.y }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: pin.delay }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <MapPin className="w-3 h-3 text-white" />
                  </motion.div>
                ))}
              </div>
              
              <div className="p-6">
                <h3 className="headline-md mb-2">Interactive Clinic Directory</h3>
                <p className="body-md text-[#6B7280]">
                  Locate specialized amyloidosis clinics and healthcare providers near you
                </p>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    className="module-card text-center cursor-pointer group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    whileHover={{ scale: 1.03, y: -4 }}
                  >
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center mx-auto mb-4"
                      whileHover={{ rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </motion.div>
                    <h4 className="text-lg font-medium text-[#1F2937] mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}