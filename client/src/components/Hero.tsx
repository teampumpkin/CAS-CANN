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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {/* Abstract Medical Background - Protein Structure Morphing to Heart */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-red-500">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, -30, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-red-400 to-pink-600 rounded-full blur-3xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                x: [0, -40, 0],
                y: [0, 40, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full blur-2xl"
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Protein Structure Elements */}
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-white rounded-full"
                style={{
                  top: `${20 + Math.sin(i * 0.5) * 30}%`,
                  left: `${15 + Math.cos(i * 0.7) * 60}%`,
                }}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.3, 0.8, 0.3],
                  y: [0, -20, 0]
                }}
                transition={{
                  duration: 3 + i * 0.2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </div>
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-lg md:text-xl font-light tracking-wide">
            Amyloidosis Care in Canada
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Canadian Amyloidosis Society (CAS)
        </motion.h1>

        <motion.p
          className="text-2xl md:text-3xl lg:text-4xl font-light italic mb-16 text-white/90"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Accelerating awareness, diagnosis, and care
        </motion.p>

        <motion.div
          className="text-lg md:text-xl font-light tracking-wide mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Canadian Amyloidosis Society | Building a National Healthcare Hub
        </motion.div>

        {/* Contact Button */}
        <motion.button
          className="bg-gray-900/80 hover:bg-gray-900 text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 backdrop-blur-sm border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Contact Us
        </motion.button>
      </div>

      {/* Quick Action Tiles - Positioned at Bottom */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickTiles.map((tile, index) => (
            <motion.a
              key={tile.label}
              href={tile.href}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center group cursor-pointer border border-white/20 hover:bg-white/20 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <tile.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-white font-medium text-sm">{tile.label}</div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}