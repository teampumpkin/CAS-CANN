import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#F8F9FA] flex items-center overflow-hidden parallax-subtle">
      {/* Minimal Abstract Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="150" r="120" fill="none" stroke="#00AFE6" strokeWidth="1"/>
          <circle cx="600" cy="400" r="80" fill="none" stroke="#00DD89" strokeWidth="1"/>
          <path d="M100 300 Q 400 200, 700 350" stroke="#00AFE6" strokeWidth="1" fill="none"/>
        </svg>
      </div>

      <div className="crawford-section min-h-screen flex items-center">
        <div className="w-full text-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.h1 
              className="heading-hero mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Canadian Amyloidosis Society
              <span className="block text-[#00AFE6] mt-4 font-normal">CAS</span>
            </motion.h1>
            
            <motion.p 
              className="body-xl mb-16 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Accelerating awareness, diagnosis, and care
            </motion.p>
          </motion.div>

          {/* Action Tiles - Crawford Style */}
          <motion.div 
            className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-20"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {[
              { title: 'Directory', description: 'Find specialists and clinics' },
              { title: 'Upload', description: 'Share resources and research' },
              { title: 'Learn', description: 'About amyloidosis types' },
              { title: 'Join', description: 'Connect with our community' }
            ].map((tile, index) => (
              <motion.div
                key={tile.title}
                className="crawford-card text-center tile-crawford"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="tile-content">
                  <h3 className="heading-md mb-4">{tile.title}</h3>
                  <p className="body-md text-[#6a6a6a]">{tile.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
