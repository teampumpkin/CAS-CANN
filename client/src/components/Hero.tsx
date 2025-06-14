import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#F8FAFB] to-white flex items-center overflow-hidden">
      {/* Background Abstract Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M200 150 Q 250 100, 300 150 T 400 150" stroke="#00AFE6" strokeWidth="2" fill="none" opacity="0.3"/>
          <path d="M150 200 Q 200 150, 250 200 T 350 200" stroke="#00DD89" strokeWidth="2" fill="none" opacity="0.3"/>
          <circle cx="300" cy="200" r="80" fill="none" stroke="#00AFE6" strokeWidth="1" opacity="0.2"/>
          <circle cx="350" cy="250" r="60" fill="none" stroke="#00DD89" strokeWidth="1" opacity="0.2"/>
          <path d="M100 300 C 150 250, 200 350, 250 300 S 350 250, 400 300" stroke="#00AFE6" strokeWidth="1.5" fill="none" opacity="0.2"/>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center">
          {/* Title and Subheading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="headline-xl mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Canadian Amyloidosis Society
              <span className="block text-[#00AFE6] mt-2">CAS</span>
            </motion.h1>
            
            <motion.p 
              className="text-2xl md:text-3xl text-[#6B7280] font-light mb-16 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Accelerating awareness, diagnosis, and care
            </motion.p>
          </motion.div>

          {/* Action Tiles */}
          <motion.div 
            className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { title: 'Directory', description: 'Find specialists and clinics', icon: '🗂️' },
              { title: 'Upload', description: 'Share resources and research', icon: '📤' },
              { title: 'Learn', description: 'About amyloidosis types', icon: '📚' },
              { title: 'Join', description: 'Connect with our community', icon: '🤝' }
            ].map((tile, index) => (
              <motion.div
                key={tile.title}
                className="module-card text-center cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="text-3xl mb-4">{tile.icon}</div>
                <h3 className="headline-md mb-3">{tile.title}</h3>
                <p className="body-md text-[#9CA3AF]">{tile.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
