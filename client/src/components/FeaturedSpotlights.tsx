import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function FeaturedSpotlights() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const spotlights = [
    {
      title: "What is ATTR? Learn the signs...",
      description: "Transthyretin amyloidosis (ATTR) is one of the most common forms of amyloidosis. Early recognition of symptoms can lead to timely diagnosis and improved patient outcomes.",
      image: "🫀",
      category: "Education"
    },
    {
      title: "New Upload: B.C. Cardiac Amyloidosis Pathway",
      description: "The British Columbia Cardiac Amyloidosis Pathway provides a comprehensive approach to diagnosis and treatment, now available for healthcare providers across Canada.",
      image: "📋",
      category: "Resource"
    },
    {
      title: "Join the Movement: Why clinicians, researchers, and families are uniting",
      description: "Discover how our collaborative approach is transforming amyloidosis care by bringing together diverse perspectives and expertise from across the healthcare spectrum.",
      image: "🤝",
      category: "Community"
    }
  ];

  // Auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % spotlights.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [spotlights.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % spotlights.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + spotlights.length) % spotlights.length);
  };

  return (
    <section className="crawford-dark-section">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="crawford-section-title text-white text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Featured Spotlights
        </motion.h2>

        <div className="relative">
          {/* Main Carousel */}
          <div className="overflow-hidden rounded-3xl">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {spotlights.map((spotlight, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 lg:p-16 border border-white/10">
                    <div className="crawford-asymmetric items-center">
                      <motion.div
                        className="crawford-content-7"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: currentSlide === index ? 1 : 0, x: currentSlide === index ? 0 : -50 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        <div className="mb-4">
                          <span className="inline-flex items-center px-4 py-2 bg-white/10 text-white/80 rounded-full text-sm font-medium">
                            {spotlight.category}
                          </span>
                        </div>

                        <h3 className="text-3xl lg:text-4xl font-normal text-white mb-6 leading-tight">
                          {spotlight.title}
                        </h3>

                        <p className="text-lg text-white/80 leading-relaxed mb-8">
                          {spotlight.description}
                        </p>

                        <motion.button
                          className="crawford-btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Learn More
                        </motion.button>
                      </motion.div>

                      <motion.div
                        className="crawford-content-5"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: currentSlide === index ? 1 : 0, x: currentSlide === index ? 0 : 50 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      >
                        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10 aspect-square flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-8xl mb-6">{spotlight.image}</div>
                            <div className="w-16 h-1 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mx-auto"></div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {spotlights.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}