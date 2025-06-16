import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const spotlights = [
  {
    id: 1,
    title: 'What is ATTR?',
    description: 'Transthyretin amyloidosis (ATTR) is one of the most common forms of amyloidosis, affecting the heart and nervous system. Understanding this condition is crucial for early diagnosis and treatment.',
    category: 'Education',
    readTime: '5 min read',
    image: 'linear-gradient(135deg, #00AFE6 0%, #0099CC 100%)',
    href: '#attr-education'
  },
  {
    id: 2,
    title: 'BC Cardiac Pathway Upload',
    description: 'British Columbia has developed a comprehensive cardiac pathway for ATTR diagnosis and treatment. Access the latest protocols and guidelines developed by Canadian specialists.',
    category: 'Clinical Resource',
    readTime: '8 min read',
    image: 'linear-gradient(135deg, #00DD89 0%, #00BB77 100%)',
    href: '#bc-pathway'
  },
  {
    id: 3,
    title: 'Join the Movement',
    description: 'Become part of our growing community working to improve amyloidosis awareness, research, and patient outcomes across Canada. Together, we can make a difference.',
    category: 'Community',
    readTime: '3 min read',
    image: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    href: '#join-movement'
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

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + spotlights.length) % spotlights.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % spotlights.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-8">
            Featured Spotlights
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the latest resources, research updates, and community initiatives that are making an impact in the amyloidosis field.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Content Area */}
          <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="grid lg:grid-cols-2 min-h-[400px]"
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }}
              >
                {/* Visual Side */}
                <div 
                  className="relative flex items-center justify-center p-12 text-white"
                  style={{ background: spotlights[currentIndex].image }}
                >
                  <div className="text-center">
                    <motion.div
                      className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl mx-auto mb-6 flex items-center justify-center backdrop-blur-sm"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    >
                      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </motion.div>
                    
                    <motion.div
                      className="text-sm font-medium bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {spotlights[currentIndex].category}
                    </motion.div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-6 right-6 w-6 h-6 bg-white bg-opacity-20 rounded-full"></div>
                  <div className="absolute bottom-8 left-8 w-4 h-4 bg-white bg-opacity-20 rounded-full"></div>
                </div>

                {/* Content Side */}
                <div className="p-12 flex flex-col justify-center">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-sm text-gray-500">{spotlights[currentIndex].readTime}</span>
                      <span className="text-sm font-medium text-[#00AFE6] bg-[#00AFE6] bg-opacity-10 px-3 py-1 rounded-full">
                        Featured
                      </span>
                    </div>

                    <h3 className="text-2xl lg:text-3xl font-medium text-gray-900 mb-6">
                      {spotlights[currentIndex].title}
                    </h3>

                    <p className="text-lg text-gray-600 leading-relaxed mb-8">
                      {spotlights[currentIndex].description}
                    </p>

                    <motion.a
                      href={spotlights[currentIndex].href}
                      className="inline-flex items-center space-x-3 text-[#00AFE6] font-medium hover:text-[#0099CC] transition-colors duration-200"
                      whileHover={{ x: 5 }}
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.a>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Navigation Dots */}
            <div className="flex space-x-3">
              {spotlights.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex 
                      ? 'bg-[#00AFE6] scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Arrow Controls */}
            <div className="flex space-x-2">
              <motion.button
                onClick={goToPrevious}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous spotlight"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <motion.button
                onClick={goToNext}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next spotlight"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Auto-play indicator */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}