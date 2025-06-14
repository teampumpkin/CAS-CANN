import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#FAFBFC] flex items-center overflow-hidden">
      {/* Abstract Background - Protein morphing into heart */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Protein structure morphing into heart shape */}
          <path d="M200 200 Q 300 150, 400 200 T 600 220 Q 700 240, 800 200" stroke="#00AFE6" strokeWidth="2" fill="none"/>
          <path d="M180 250 Q 280 200, 380 250 T 580 270 Q 680 290, 780 250" stroke="#00DD89" strokeWidth="1.5" fill="none"/>
          <circle cx="300" cy="180" r="8" fill="#00AFE6" opacity="0.3"/>
          <circle cx="500" cy="200" r="6" fill="#00DD89" opacity="0.3"/>
          <circle cx="700" cy="220" r="7" fill="#00AFE6" opacity="0.3"/>
          
          {/* Heart shape formation */}
          <path d="M600 400 C 580 360, 520 360, 520 400 C 520 360, 460 360, 440 400 C 460 440, 520 480, 600 520 C 680 480, 740 440, 760 400 C 740 360, 680 360, 680 400 C 680 360, 620 360, 600 400 Z" 
                stroke="#00AFE6" strokeWidth="1" fill="none" opacity="0.2"/>
          
          {/* Connecting elements */}
          <path d="M400 250 Q 500 300, 600 350" stroke="#00DD89" strokeWidth="1" fill="none" opacity="0.3"/>
          <path d="M800 250 Q 750 300, 700 350" stroke="#00AFE6" strokeWidth="1" fill="none" opacity="0.3"/>
        </svg>
      </div>

      <div className="w-full max-w-7xl mx-auto px-8 py-24">
        <div className="text-center">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-light text-[#1a1a1a] mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Canadian Amyloidosis Society
              <span className="block text-[#00AFE6] mt-4 font-normal">(CAS)</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-[#6a6a6a] font-light mb-20 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Accelerating awareness, diagnosis, and care
            </motion.p>
          </motion.div>

          {/* Action Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { title: 'Directory', description: 'Find specialists and clinics' },
              { title: 'Upload', description: 'Share resources and research' },
              { title: 'Learn', description: 'About amyloidosis types' },
              { title: 'Join', description: 'Connect with our community' }
            ].map((tile, index) => (
              <motion.div
                key={tile.title}
                className="group cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.8 + index * 0.1, 
                  ease: [0.25, 0.1, 0.25, 1] 
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="bg-white rounded-3xl p-8 text-center transition-all duration-300 group-hover:shadow-2xl"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = index % 2 === 0 
                      ? '0 16px 64px rgba(0, 175, 230, 0.15)' 
                      : '0 16px 64px rgba(0, 221, 137, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <h3 className="text-2xl font-medium text-[#1a1a1a] mb-4">
                    {tile.title}
                  </h3>
                  <p className="text-lg text-[#6a6a6a] leading-relaxed">
                    {tile.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
