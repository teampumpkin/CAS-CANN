import { motion } from 'framer-motion';
import { MapPin, Upload, BookOpen, Users } from 'lucide-react';
import heroBackgroundImage from '@assets/shutterstock_2447944539_1753253167377.jpg';
import { useLanguage } from '@/contexts/LanguageContext';
import OptimizedImage from '@/components/OptimizedImage';

export default function Hero() {
  const { t } = useLanguage();
  
  const quickTiles = [
    { icon: Users, label: 'Join', href: '/get-involved' },
    { icon: MapPin, label: t('nav.directory'), href: '/directory' },
    { icon: Upload, label: 'Upload', href: '/upload-resource' },
    { icon: BookOpen, label: 'Learn', href: '/about-amyloidosis' }
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Sophisticated background with neural network visualization */}
      <div className="absolute inset-0">
        {/* Neural network background image */}
        <div className="absolute inset-0">
          <OptimizedImage
            src={heroBackgroundImage}
            alt="Neural network and synapses visualization representing amyloidosis research and neurological connections" 
            className="w-full h-full object-cover"
            loading="eager"
            priority={true}
            quality={70}
            sizes="100vw"
          />
          {/* Very light overlay for text readability while keeping image visible */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-gray-50/35 to-white/40 dark:from-gray-900/70 dark:via-gray-900/65 dark:to-gray-900/70"></div>
          {/* Brand color accent overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/8 via-[#00DD89]/6 to-[#00AFE6]/8 dark:from-[#00AFE6]/10 dark:via-[#00DD89]/8 dark:to-[#00AFE6]/12"></div>
        </div>
        
        {/* Animated brand accent elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-[#00AFE6]/25 to-[#00DD89]/25 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-[#00DD89]/20 to-[#00AFE6]/20 rounded-full blur-3xl"
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
        <div className="flex-1 flex items-center justify-center pt-12 pb-12">
          <div className="max-w-7xl mx-auto text-center">
            {/* Decorative badge */}
            <motion.div
              className="inline-flex items-center gap-3 bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-200/50 dark:border-white/20 rounded-full px-6 py-3 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-3 h-3 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full animate-pulse"></div>
              <span className="text-gray-800 dark:text-white/90 font-medium tracking-wide">{t('hero.badge')}</span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 dark:text-white mb-4 relative leading-none tracking-tight font-rosarivo"
              style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <span className="block">{t('hero.title.canadian')}</span>
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
                  {t('hero.title.amyloidosis')}
                </motion.span>
              </span>
              <span className="block">{t('hero.title.society')}</span>
            </motion.h1>

            {/* Clinician-focused subtitle */}
            <motion.p
              className="text-xl md:text-2xl lg:text-3xl font-light text-gray-800 dark:text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed"
              style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* Clinical Impact Metrics */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <div className="text-center bg-white/90 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/60 dark:border-white/20">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00AFE6] to-[#00DD89]">
                  6 weeks
                </div>
                <div className="text-sm text-gray-600 dark:text-white/80 mt-1">Average diagnostic time reduction</div>
              </div>
              <div className="text-center bg-white/90 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/60 dark:border-white/20">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00AFE6] to-[#00DD89]">
                  350+
                </div>
                <div className="text-sm text-gray-600 dark:text-white/80 mt-1">Healthcare professionals</div>
              </div>
              <div className="text-center bg-white/90 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/60 dark:border-white/20">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00AFE6] to-[#00DD89]">
                  1,400+
                </div>
                <div className="text-sm text-gray-600 dark:text-white/80 mt-1">Patients reached</div>
              </div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 xl:gap-10 justify-items-center max-w-5xl mx-auto">
              {quickTiles.map((tile, index) => (
                <motion.a
                  key={tile.label}
                  href={tile.href}
                  className="group relative overflow-hidden w-full max-w-[200px] cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.4 + index * 0.2 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Enhanced Button-style card */}
                  <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-white/75 dark:from-white/15 dark:via-white/8 dark:to-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-gray-200/50 dark:border-white/30 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#00AFE6]/20 group-hover:via-[#00DD89]/15 group-hover:to-[#00AFE6]/10 group-hover:border-[#00AFE6]/50 group-hover:shadow-xl group-hover:shadow-[#00AFE6]/30 overflow-hidden w-full h-full min-h-[160px] group-active:transform group-active:scale-95">
                    
                    {/* Dynamic Mesh Background */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#00AFE6]/20 to-transparent rounded-full blur-xl" />
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-[#00DD89]/20 to-transparent rounded-full blur-lg" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 rounded-full blur-md" />
                    </div>
                    
                    {/* Animated border gradient */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00AFE6]/0 via-[#00DD89]/0 to-[#00AFE6]/0 group-hover:from-[#00AFE6]/80 group-hover:via-[#00DD89]/80 group-hover:to-[#00AFE6]/80 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm" />
                    
                    {/* Enhanced shimmer effect */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out opacity-0 group-hover:opacity-100" />
                    </div>
                    
                    {/* Floating particles effect */}
                    <div className="absolute inset-0">
                      <div className="absolute top-4 right-4 w-1 h-1 bg-[#00AFE6] rounded-full opacity-0 group-hover:opacity-60 transition-all duration-500 group-hover:animate-pulse" />
                      <div className="absolute top-8 right-8 w-0.5 h-0.5 bg-[#00DD89] rounded-full opacity-0 group-hover:opacity-40 transition-all duration-700 group-hover:animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="absolute bottom-6 left-4 w-1 h-1 bg-white/60 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-600 group-hover:animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 text-center">
                      {/* Enhanced icon container */}
                      <div className="relative mx-auto mb-4 w-16 h-16 group-hover:scale-110 transition-all duration-300">
                        {/* Main icon background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-xl shadow-lg group-hover:shadow-2xl group-hover:shadow-[#00AFE6]/50 transition-all duration-300" />
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-xl blur-md opacity-50 group-hover:opacity-90 transition-opacity duration-300" />
                        {/* Pulse rings */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-2xl opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-2xl opacity-0 group-hover:opacity-10 group-hover:scale-200 transition-all duration-1000" />
                        {/* Icon */}
                        <div className="relative flex items-center justify-center w-full h-full">
                          <tile.icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                      
                      {/* Enhanced title */}
                      <h3 className="text-gray-900 dark:text-white font-bold text-base mb-2 group-hover:text-gray-800 dark:group-hover:text-white transition-all duration-300 font-rosarivo">
                        {tile.label}
                      </h3>
                      
                      {/* Enhanced subtitle */}
                      <p className="text-gray-600 dark:text-white/60 text-xs font-light leading-relaxed group-hover:text-gray-700 dark:group-hover:text-white/80 transition-all duration-300 transform group-hover:translate-y-0.5">
                        {index === 0 && "Connect with our community"}
                        {index === 1 && "Find healthcare providers and support"}
                        {index === 2 && "Share your experience and stories"}
                        {index === 3 && "Access educational resources"}
                      </p>
                      
                      {/* Button indicator */}
                      <div className="mt-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-1 text-[#00AFE6] font-medium text-xs">
                          <span>Click to explore</span>
                          <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced corner accents */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-1 h-1 bg-[#00AFE6] rounded-full animate-pulse" />
                      <div className="w-0.5 h-0.5 bg-[#00DD89] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </div>
                    <div className="absolute bottom-3 left-3 w-2 h-2 border border-white/30 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                    
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/0 via-transparent to-[#00DD89]/0 group-hover:from-[#00AFE6]/5 group-hover:to-[#00DD89]/5 transition-all duration-700 rounded-3xl" />
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
              className="w-6 h-10 border-2 border-gray-400 dark:border-white/50 rounded-full flex justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1 h-3 bg-gray-600 dark:bg-white rounded-full mt-2"
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