import { motion } from 'framer-motion';

const directoryFeatures = [
  { id: 'clinics', title: 'DIRECTORY OF CLINICS', count: '75+ CENTERS' },
  { id: 'resources', title: 'UPLOADABLE RESOURCES', count: '500+ RESOURCES' },
  { id: 'types', title: 'AMYLOIDOSIS TYPES', count: '12 TYPES' },
  { id: 'mission', title: 'JOIN MISSION', count: '2,500+ MEMBERS' }
];

export default function DirectoryPreviewSection() {
  return (
    <section className="crawford-section crawford-mesh">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
          viewport={{ once: true, margin: "-200px" }}
        >
          <h2 className="crawford-title mb-8">
            WHAT YOU'LL
            <br />
            <span className="crawford-gradient bg-clip-text text-transparent">
              FIND HERE
            </span>
          </h2>
          <p className="crawford-subtitle max-w-4xl mx-auto">
            Discover comprehensive resources and connect with specialists across Canada.
          </p>
        </motion.div>

        <div className="crawford-asymmetric">
          <motion.div
            className="crawford-content-left"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-200px" }}
          >
            <div className="crawford-card crawford-card-hover p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-8 text-center">
                  TREATMENT CENTERS
                  <br />
                  <span className="crawford-gradient bg-clip-text text-transparent">
                    ACROSS CANADA
                  </span>
                </h3>

                <div className="relative w-full h-80 bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden mb-6">
                  <svg className="w-full h-full" viewBox="0 0 100 60" fill="none">
                    <path
                      d="M10 25 Q20 20 35 27 L50 30 Q65 27 80 32 L90 35 L90 45 Q80 47 65 44 L50 42 Q35 45 20 42 L10 40 Z"
                      fill="rgba(39, 39, 42, 0.5)"
                      stroke="rgba(113, 113, 122, 0.3)"
                      strokeWidth="1"
                    />
                  </svg>

                  {[
                    { id: 1, name: 'Vancouver', x: '15%', y: '35%' },
                    { id: 2, name: 'Calgary', x: '25%', y: '40%' },
                    { id: 3, name: 'Toronto', x: '55%', y: '65%' },
                    { id: 4, name: 'Montreal', x: '65%', y: '58%' },
                    { id: 5, name: 'Halifax', x: '75%', y: '70%' }
                  ].map((location, index) => (
                    <motion.div
                      key={location.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: location.x, top: location.y }}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.5 + (index * 0.1),
                        type: "spring",
                        stiffness: 300
                      }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.5 }}
                    >
                      <div className="relative group cursor-pointer">
                        <div className="w-4 h-4 crawford-gradient rounded-full shadow-lg"></div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-zinc-700">
                          {location.name}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center text-gray-400 uppercase tracking-wider text-sm">
                  INTERACTIVE MAP SHOWING TREATMENT CENTERS
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="crawford-content-right"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }}
            viewport={{ once: true, margin: "-200px" }}
          >
            <div className="space-y-6">
              {directoryFeatures.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  className="crawford-card crawford-card-hover p-8 border-l-4 border-[#00AFE6]"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.2 + (index * 0.1),
                    ease: [0.6, -0.05, 0.01, 0.99]
                  }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        {feature.title}
                      </h3>
                      <div className="text-gray-400 uppercase tracking-wider text-sm">
                        FIND SPECIALIZED CARE
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-3xl font-black crawford-gradient bg-clip-text text-transparent">
                        {feature.count.split(' ')[0]}
                      </div>
                      <div className="text-gray-400 uppercase tracking-wider text-xs">
                        {feature.count.split(' ')[1]}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="crawford-btn w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                EXPLORE FULL DIRECTORY
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}