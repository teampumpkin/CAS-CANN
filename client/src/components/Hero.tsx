import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Upload, BookOpen, Users } from 'lucide-react';
import { useRef } from 'react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  const quickTiles = [
    { icon: MapPin, label: 'Directory', href: '#directory' },
    { icon: Upload, label: 'Upload', href: '#upload' },
    { icon: BookOpen, label: 'Learn', href: '#learn' },
    { icon: Users, label: 'Join', href: '#join' }
  ];

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden gradient-bg-light"
    >
      {/* Floating background elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/8 to-purple-500/8 rounded-full blur-3xl animate-float"
          style={{ y: y1 }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-gradient-to-br from-green-500/6 to-blue-500/6 rounded-full blur-3xl animate-float"
          style={{ y: y2 }}
        />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-500/4 to-pink-500/4 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Hero Title */}
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight crawford-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Canadian Amyloidosis Society
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00AFE6] to-[#00DD89] mt-2">
              (CAS)
            </span>
          </motion.h1>

          {/* Hero Subheading */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto crawford-body-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Accelerating awareness, improving diagnosis, and advancing care for amyloidosis patients across Canada
          </motion.p>

          {/* Quick Action Tiles */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {quickTiles.map((tile, index) => (
              <motion.a
                key={tile.label}
                href={tile.href}
                className="glass-card rounded-2xl p-6 hover-lift group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <tile.icon className="w-8 h-8 text-[#00AFE6] mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {tile.label}
                </p>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}