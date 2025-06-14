import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Upload, Users } from 'lucide-react';

const spotlights = [
  {
    id: 1,
    title: 'What is ATTR',
    description: 'Transthyretin amyloidosis (ATTR) is a progressive disease affecting the heart and nervous system. Learn about symptoms, diagnosis, and treatment options.',
    icon: Heart,
    color: 'from-[#00AFE6] to-[#0099CC]',
    action: 'Learn More',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250'
  },
  {
    id: 2,
    title: 'BC Cardiac Pathway Upload',
    description: 'Access and contribute to the British Columbia cardiac amyloidosis clinical pathway. Share resources with healthcare professionals.',
    icon: Upload,
    color: 'from-[#00DD89] to-[#00BB77]',
    action: 'Upload Now',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250'
  },
  {
    id: 3,
    title: 'Join the Movement',
    description: 'Become part of our advocacy efforts to improve amyloidosis awareness, research funding, and patient care across Canada.',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    action: 'Get Involved',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250'
  }
];

export default function FeaturedSpotlights() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % spotlights.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % spotlights.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + spotlights.length) % spotlights.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="headline-lg mb-6">
            Featured Spotlights
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Discover key resources and opportunities to engage with the amyloidosis community.
          </p>
        </motion.div>

        <div className="relative">
          {/* Main Spotlight Card */}
          <div className="relative h-96 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <div className="module-card h-full p-0 overflow-hidden">
                  <div className="grid md:grid-cols-2 h-full">
                    {/* Image */}
                    <div className="relative">
                      <img 
                        src={spotlights[currentSlide].image}
                        alt={spotlights[currentSlide].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-12 flex flex-col justify-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <div className="flex items-center mb-6">
                          <div className={`w-12 h-12 bg-gradient-to-br ${spotlights[currentSlide].color} rounded-2xl flex items-center justify-center mr-4`}>
                            {(() => {
                              const IconComponent = spotlights[currentSlide].icon;
                              return <IconComponent className="w-6 h-6 text-white" />;
                            })()}
                          </div>
                          <span className="text-sm text-[#00AFE6] font-medium uppercase tracking-wide">
                            Featured
                          </span>
                        </div>
                        
                        <h3 className="headline-lg mb-6">
                          {spotlights[currentSlide].title}
                        </h3>
                        
                        <p className="body-lg mb-8">
                          {spotlights[currentSlide].description}
                        </p>
                        
                        <motion.button
                          className="btn-primary"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {spotlights[currentSlide].action}
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Previous/Next Buttons */}
            <div className="flex space-x-4">
              <motion.button
                onClick={prevSlide}
                className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-5 h-5 text-[#6B7280]" />
              </motion.button>
              
              <motion.button
                onClick={nextSlide}
                className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-5 h-5 text-[#6B7280]" />
              </motion.button>
            </div>

            {/* Dot Indicators */}
            <div className="flex space-x-3">
              {spotlights.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00AFE6] focus:ring-offset-2 ${
                    index === currentSlide 
                      ? 'bg-[#00AFE6] w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}