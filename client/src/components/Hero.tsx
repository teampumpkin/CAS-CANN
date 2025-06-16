import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Upload, BookOpen, Users } from 'lucide-react';
import { useRef } from 'react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  const quickTiles = [
    { icon: MapPin, label: 'Directory', href: '#directory' },
    { icon: Upload, label: 'Upload', href: '#upload' },
    { icon: BookOpen, label: 'Learn', href: '#learn' },
    { icon: Users, label: 'Join', href: '#join' }
  ];

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden parallax-container"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #f8fafc 75%, #ffffff 100%)'
      }}
    >
      {/* Parallax Background Elements */}
      <motion.div 
        className="absolute inset-0 parallax-bg"
        style={{ y: y1 }}
      >
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-gradient-to-br from-green-500/8 to-blue-500/8 rounded-full blur-3xl"></div>
      </motion.div>
      
      <motion.div 
        className="absolute inset-0 parallax-bg"
        style={{ y: y2 }}
      >
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-6 text-center flex items-center justify-center min-h-screen"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Hero Title */}
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ 
              fontFamily: 'Cardo, serif'
            }}
          >
            Canadian Amyloidosis Society
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00AFE6] to-[#00DD89] mt-2">
              (CAS)
            </span>
          </motion.h1>

          {/* Hero Subheading */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ 
              fontFamily: 'Cardo, serif'
            }}
          >
            Accelerating awareness, improving diagnosis, and advancing care for amyloidosis patients across Canada
          </motion.p>

          {/* Quick Access Tiles */}
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
                className="group relative glass-morphism-dark rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 glow-effect-blue"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <tile.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white/90 font-medium text-sm">{tile.label}</span>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}