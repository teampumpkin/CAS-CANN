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
    <section className="relative min-h-screen overflow-hidden">
      {/* Sophisticated background with real hospital image */}
      <div className="absolute inset-0">
        {/* Hospital exterior background image */}
        <div className="absolute inset-0">
          <img 
            src="/images/hospital-exterior.jpg" 
            alt="Modern healthcare facility exterior" 
            className="w-full h-full object-cover"
          />
          {/* Sophisticated overlay for text readability and brand enhancement */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-blue-900/70 to-gray-900/80"></div>
        </div>
        
        {/* Animated brand accent elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-[#00DD89]/15 to-[#00AFE6]/15 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Subtle pattern overlay for texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='1'%3E%3Cpath d='M50 15v70M15 50h70' stroke='white' stroke-width='1' fill='none'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col px-6">
        {/* Top spacer */}
        <div className="flex-1 flex items-center justify-center pt-20 pb-32">
          <div className="max-w-7xl mx-auto text-center">
            {/* Decorative badge */}
            <motion.div
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-3 h-3 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full animate-pulse"></div>
              <span className="text-white/90 font-medium tracking-wide">Transforming Amyloidosis Care in Canada</span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 relative leading-tight tracking-tight font-cardo"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <span className="block">Canadian</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00AFE6] via-[#00DD89] to-[#00AFE6] relative">
                <motion.span
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{
                    background: "linear-gradient(90deg, #00AFE6, #00DD89, #00AFE6)",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  Amyloidosis
                </motion.span>
              </span>
              <span className="block">Society</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl lg:text-3xl font-light text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Accelerating awareness, diagnosis, and care
            </motion.p>

            {/* Enhanced action buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <button className="group relative bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2 group-hover:text-white">
                  Get Started
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              
              <button className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg border border-white/30 hover:border-white/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <span className="flex items-center gap-2">
                  Learn More
                  <svg className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Bottom section with tiles and scroll indicator */}
        <div className="pb-8">
          {/* Quick Action Tiles - Premium Style */}
          <motion.div
            className="w-full max-w-6xl mx-auto px-6 mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {quickTiles.map((tile, index) => (
                <motion.a
                  key={tile.label}
                  href={tile.href}
                  className="group relative overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.4 + index * 0.2 }}
                  whileHover={{ y: -8 }}
                >
                  {/* Glass morphism card */}
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transition-all duration-500 group-hover:bg-white/8 group-hover:border-white/30 overflow-hidden">
                    {/* Animated gradient border on hover */}
                    <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-[#00AFE6]/0 via-[#00DD89]/0 to-[#00AFE6]/0 group-hover:from-[#00AFE6]/50 group-hover:via-[#00DD89]/50 group-hover:to-[#00AFE6]/50 transition-all duration-500">
                      <div className="w-full h-full bg-white/5 rounded-2xl" />
                    </div>
                    
                    {/* Subtle shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                    
                    {/* Content */}
                    <div className="relative z-10 text-center">
                      {/* Icon container with pulse effect */}
                      <div className="relative mx-auto mb-4 w-12 h-12 group-hover:scale-110 transition-transform duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
                        {/* Pulse ring effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-xl opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-500" />
                        <div className="relative flex items-center justify-center w-full h-full">
                          <tile.icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                      
                      {/* Title with enhanced hover effect */}
                      <h3 className="text-white font-semibold text-base mb-2 group-hover:text-white transition-colors duration-300 group-hover:scale-105 transform">
                        {tile.label}
                      </h3>
                      
                      {/* Subtitle with fade-in effect */}
                      <p className="text-white/70 text-xs font-light leading-relaxed group-hover:text-white/90 transition-all duration-300">
                        {index === 0 && "Find healthcare providers and support"}
                        {index === 1 && "Share your experience and stories"}
                        {index === 2 && "Access educational resources"}
                        {index === 3 && "Connect with our community"}
                      </p>
                    </div>

                    {/* Corner accent dots */}
                    <div className="absolute top-2 right-2 w-1 h-1 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                    <div className="absolute bottom-2 left-2 w-1 h-1 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="flex justify-center"
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
        </div>
      </div>
    </section>
  );
}