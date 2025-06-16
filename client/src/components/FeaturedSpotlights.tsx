import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const spotlights = [
  {
    id: 1,
    title: 'WHAT IS ATTR?',
    description: 'Transthyretin amyloidosis (ATTR) is one of the most common forms of amyloidosis, affecting the heart and nervous system. Understanding this condition is crucial for early diagnosis and treatment.',
    category: 'EDUCATION'
  },
  {
    id: 2,
    title: 'BC CARDIAC PATHWAY UPLOAD',
    description: 'British Columbia has developed a comprehensive cardiac pathway for ATTR diagnosis and treatment. Access the latest protocols and guidelines developed by Canadian specialists.',
    category: 'CLINICAL RESOURCE'
  },
  {
    id: 3,
    title: 'JOIN THE MOVEMENT',
    description: 'Become part of our growing community working to improve amyloidosis awareness, research, and patient outcomes across Canada. Together, we can make a difference.',
    category: 'COMMUNITY'
  }
];

export default function FeaturedSpotlights() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spotlights.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="crawford-section crawford-mesh">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
          viewport={{ once: true, margin: "-200px" }}
        >
          <h2 className="crawford-title mb-8">
            FEATURED
            <br />
            <span className="crawford-gradient bg-clip-text text-transparent">
              SPOTLIGHTS
            </span>
          </h2>
          <p className="crawford-subtitle max-w-4xl mx-auto">
            Discover the latest resources, research updates, and community initiatives that are making an impact.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <div className="crawford-card overflow-hidden relative" style={{ minHeight: '500px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="p-16 text-center relative"
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] }}
              >
                <div className="absolute top-0 right-0 w-40 h-40 crawford-gradient opacity-5 rounded-bl-full"></div>
                
                <motion.div
                  className="w-24 h-24 crawford-gradient rounded-full mx-auto mb-10 flex items-center justify-center"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                >
                  <svg className="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </motion.div>

                <motion.div
                  className="mb-8"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-sm font-bold text-[#00AFE6] bg-[#00AFE6] bg-opacity-10 px-6 py-2 uppercase tracking-wider border border-[#00AFE6] border-opacity-20">
                    {spotlights[currentIndex].category}
                  </span>
                </motion.div>

                <motion.h3
                  className="text-4xl lg:text-5xl font-bold mb-10"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {spotlights[currentIndex].title}
                </motion.h3>

                <motion.p
                  className="crawford-subtitle mb-12 max-w-3xl mx-auto"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {spotlights[currentIndex].description}
                </motion.p>

                <motion.button
                  className="crawford-btn-outline"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  LEARN MORE
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center mt-12 space-x-6">
            {spotlights.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative overflow-hidden ${
                  index === currentIndex 
                    ? 'w-16 h-4 bg-[#00AFE6]' 
                    : 'w-4 h-4 bg-zinc-700 hover:bg-zinc-600'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index === currentIndex && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#00AFE6] to-[#00DD89]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}