import { motion } from 'framer-motion';
import { Calendar, Users } from 'lucide-react';
import heroBackgroundImage from '@assets/shutterstock_2447944539_1753254859154.jpg';
import { useLanguage } from '@/contexts/LanguageContext';
import OptimizedImage from '@/components/OptimizedImage';

export default function Hero() {
  const { t } = useLanguage();
  
  const quickTiles = [
    { icon: Users, label: 'Join', href: '/join-cas' },
    { icon: Calendar, label: 'Events', href: '/events' }
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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
          {/* Consistent overlay for both themes to show background image */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-900/65 to-gray-900/70"></div>
          {/* Brand color accent overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/10 via-[#00DD89]/8 to-[#00AFE6]/12"></div>
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


            {/* Main headline */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 relative leading-none tracking-tight font-rosarivo"
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
              className="text-xl md:text-2xl lg:text-3xl font-light text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {t('hero.subtitle')}
            </motion.p>



            
          </div>
        </div>

        {/* Bottom section with tiles and scroll indicator */}
        <div className="py-8">
          {/* Quick Action Tiles - Premium Style */}
          <motion.div
            className="w-full max-w-6xl mx-auto px-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center max-w-lg mx-auto">
              {quickTiles.map((tile, index) => (
                <motion.a
                  key={tile.label}
                  href={tile.href}
                  className="group w-full max-w-[200px] cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.4 + index * 0.2 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-[#00AFE6]/50 hover:bg-gradient-to-br hover:from-[#00AFE6]/20 hover:to-[#00DD89]/20 transition-all duration-300 hover:shadow-xl text-center min-h-[160px] flex flex-col justify-center">
                    
                    {/* Icon */}
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <tile.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-white font-bold text-lg mb-2 font-rosarivo">
                      {tile.label}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-white/80 text-xs mb-3 group-hover:text-white transition-colors duration-300 leading-relaxed">
                      {index === 0 && "Become a CAS member"}
                      {index === 1 && "Upcoming events and educational sessions"}
                    </p>
                    
                    {/* Call to action */}
                    <div className="text-white/90 text-xs font-semibold group-hover:text-[#00DD89] transition-colors duration-300 flex items-center justify-center gap-1">
                      <span>Click to explore</span>
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>


        </div>
      </div>
    </section>
  );
}