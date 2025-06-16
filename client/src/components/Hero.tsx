import { motion } from 'framer-motion';
import { MapPin, Upload, BookOpen, Users } from 'lucide-react';

export default function Hero() {
  const quickTiles = [
    { icon: MapPin, label: 'Directory', href: '#directory' },
    { icon: Upload, label: 'Upload', href: '#upload' },
    { icon: BookOpen, label: 'Learn', href: '#learn' },
    { icon: Users, label: 'Join', href: '#join' }
  ];

  return (
    <section className="crawford-section bg-white relative overflow-hidden">
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#00AFE6] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#00DD89] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="crawford-asymmetric">
          <motion.div
            className="crawford-content-7"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <motion.h1
              className="crawford-hero-title mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Canadian Amyloidosis Society (CAS)
            </motion.h1>
            
            <motion.p
              className="crawford-subtitle mb-16 max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Accelerating awareness, diagnosis, and care
            </motion.p>

            {/* Quick Action Tiles */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {quickTiles.map((tile, index) => (
                <motion.a
                  key={tile.label}
                  href={tile.href}
                  className="crawford-card p-6 text-center group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <tile.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-gray-900 font-semibold">{tile.label}</div>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="crawford-content-5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Abstract Protein Structure Visual */}
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 rounded-3xl p-8 relative overflow-hidden aspect-square">
                {/* Protein Structure Animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="relative w-64 h-64"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  >
                    {/* Central Heart Shape */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="absolute top-0 left-4 w-6 h-6 bg-gradient-to-br from-red-400 to-pink-500 rounded-full transform -translate-y-2"></div>
                      <div className="absolute top-0 right-4 w-6 h-6 bg-gradient-to-br from-red-400 to-pink-500 rounded-full transform -translate-y-2"></div>
                    </motion.div>

                    {/* Protein Structure Nodes */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-4 h-4 bg-[#00AFE6] rounded-full"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-80px)`
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      >
                        {/* Connection Lines */}
                        <div className="absolute top-1/2 left-1/2 w-20 h-0.5 bg-gradient-to-r from-[#00AFE6] to-transparent transform -translate-y-1/2 origin-left"></div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-6 right-6 w-8 h-8 bg-[#00DD89] rounded-full opacity-60"></div>
                <div className="absolute bottom-6 left-6 w-6 h-6 bg-[#00AFE6] rounded-full opacity-40"></div>
                <div className="absolute top-1/3 left-8 w-4 h-4 bg-purple-400 rounded-full opacity-50"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}