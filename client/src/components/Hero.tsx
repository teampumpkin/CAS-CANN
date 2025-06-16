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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {/* Medical Professional Background */}
        <div className="absolute inset-0">
          {/* Create a sophisticated medical background using CSS */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"),
                        linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
            }}
          />
          
          {/* Subtle animated elements */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
                x: [0, 20, 0],
                y: [0, -10, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full blur-3xl"
              animate={{ 
                scale: [1.1, 1, 1.1],
                x: [0, -20, 0],
                y: [0, 20, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Professional overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-gray-900/70"></div>
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
        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-6"
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
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
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