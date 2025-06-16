import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="min-h-screen bg-[#f8fafc] flex items-center relative overflow-hidden">
      {/* Abstract background - protein morphing to heart */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" viewBox="0 0 1000 600" fill="none">
          <path d="M100 200 Q 200 150, 300 200 T 500 220 Q 600 240, 700 200" stroke="#00AFE6" strokeWidth="1"/>
          <path d="M150 350 C 130 310, 70 310, 70 350 C 70 310, 10 310, -10 350 C 10 390, 70 430, 150 470 C 230 430, 290 390, 310 350 C 290 310, 230 310, 230 350 C 230 310, 170 310, 150 350 Z" stroke="#00AFE6" strokeWidth="0.5"/>
          <circle cx="200" cy="180" r="3" fill="#00AFE6" opacity="0.2"/>
          <circle cx="400" cy="200" r="2" fill="#00DD89" opacity="0.2"/>
        </svg>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-12">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight tracking-tight">
              Canadian Amyloidosis Society
            </h1>
            <div className="text-2xl md:text-3xl lg:text-4xl font-light text-[#00AFE6]">
              (CAS)
            </div>
          </motion.div>

          {/* Subheading */}
          <motion.p 
            className="text-lg md:text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Accelerating awareness, diagnosis, and care
          </motion.p>

          {/* Action Tiles */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto pt-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
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
                  duration: 0.6, 
                  delay: 0.9 + index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                whileHover={{ 
                  y: -6,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="bg-white rounded-3xl p-8 text-center transition-all duration-300 border border-gray-100/50"
                  style={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                  }}
                  onMouseEnter={(e) => {
                    const color = index % 2 === 0 ? '#00AFE6' : '#00DD89';
                    e.currentTarget.style.boxShadow = `0 12px 40px ${color}20`;
                    e.currentTarget.style.borderColor = `${color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(229, 231, 235, 0.5)';
                  }}
                >
                  <h3 className="text-xl font-medium text-gray-900 mb-3 tracking-tight">
                    {tile.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tile.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
