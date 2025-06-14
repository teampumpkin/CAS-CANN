import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-white flex items-center overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-transparent"></div>
        {/* Very subtle protein to heart morphing abstract */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" viewBox="0 0 1000 600" fill="none">
          <path d="M100 200 Q 200 150, 300 200 T 500 220 Q 600 240, 700 200" stroke="#00AFE6" strokeWidth="1"/>
          <path d="M150 350 C 130 310, 70 310, 70 350 C 70 310, 10 310, -10 350 C 10 390, 70 430, 150 470 C 230 430, 290 390, 310 350 C 290 310, 230 310, 230 350 C 230 310, 170 310, 150 350 Z" stroke="#00AFE6" strokeWidth="0.5"/>
          <circle cx="200" cy="180" r="3" fill="#00AFE6" opacity="0.1"/>
          <circle cx="400" cy="200" r="2" fill="#00DD89" opacity="0.1"/>
        </svg>
      </div>

      <div className="w-full">
        <div className="max-w-6xl mx-auto px-6 py-32">
          <div className="text-center">
            {/* Main heading */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 tracking-tight leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Canadian Amyloidosis Society
            </motion.h1>
            
            <motion.div 
              className="text-3xl md:text-4xl lg:text-5xl font-light text-[#00AFE6] mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              (CAS)
            </motion.div>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-16 max-w-2xl mx-auto font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Accelerating awareness, diagnosis, and care
            </motion.p>

            {/* Action tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                { title: 'Directory', description: 'Find specialists and clinics' },
                { title: 'Upload', description: 'Share resources and research' },
                { title: 'Learn', description: 'About amyloidosis types' },
                { title: 'Join', description: 'Connect with our community' }
              ].map((tile, index) => (
                <motion.div
                  key={tile.title}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.8 + index * 0.1,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  whileHover={{ 
                    y: -4,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="bg-white border border-gray-100 rounded-2xl p-6 text-center transition-all duration-300 hover:border-gray-200"
                    style={{
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    }}
                    onMouseEnter={(e) => {
                      const color = index % 2 === 0 ? '#00AFE6' : '#00DD89';
                      e.currentTarget.style.boxShadow = `0 8px 25px ${color}15`;
                      e.currentTarget.style.borderColor = `${color}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                      e.currentTarget.style.borderColor = '#f3f4f6';
                    }}
                  >
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {tile.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {tile.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
