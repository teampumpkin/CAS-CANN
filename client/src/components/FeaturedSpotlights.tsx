import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Upload, Users, ArrowRight } from 'lucide-react';

export default function FeaturedSpotlights() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const spotlights = [
    {
      id: 1,
      icon: Heart,
      category: "Medical Education",
      title: "What is ATTR? Learn the signs...",
      description: "Understand the symptoms, diagnosis, and treatment options for ATTR amyloidosis. Early recognition can dramatically improve patient outcomes.",
      imageUrl: "/images/medical-research.jpg",
      href: "#attr-guide",
      gradient: "from-[#00AFE6] to-[#0088CC]"
    },
    {
      id: 2,
      icon: Upload,
      category: "New Resource",
      title: "New Upload: B.C. Cardiac Amyloidosis Pathway",
      description: "Access the latest clinical pathway developed by British Columbia's cardiac amyloidosis experts to standardize care across the province.",
      imageUrl: "/images/medical-pathway.jpg",
      href: "#bc-pathway",
      gradient: "from-[#00DD89] to-[#00BB77]"
    },
    {
      id: 3,
      icon: Users,
      category: "Community",
      title: "Join the Movement: Why clinicians, researchers, and families are uniting",
      description: "Discover how our collaborative approach is transforming amyloidosis care across Canada through shared knowledge and resources.",
      imageUrl: "/images/community-collaboration.jpg",
      href: "#join-movement",
      gradient: "from-purple-500 to-purple-700"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % spotlights.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + spotlights.length) % spotlights.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="relative py-32 lg:py-40 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-[#00DD89]/10 to-[#00AFE6]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            <span className="text-white/90 font-medium tracking-wide">Featured Content</span>
          </motion.div>

          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Spotlight Stories
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Discover the latest resources, research insights, and community stories that are shaping amyloidosis care in Canada.
          </p>
        </motion.div>

        {/* Main Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              {/* Content Side */}
              <div className="order-2 lg:order-1">
                <motion.div
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {React.createElement(spotlights[currentIndex].icon, { 
                    className: `w-4 h-4 text-white` 
                  })}
                  <span className="text-white/90 text-sm font-medium">
                    {spotlights[currentIndex].category}
                  </span>
                </motion.div>

                <motion.h3
                  className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {spotlights[currentIndex].title}
                </motion.h3>

                <motion.p
                  className="text-xl text-white/80 mb-10 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {spotlights[currentIndex].description}
                </motion.p>

                <motion.a
                  href={spotlights[currentIndex].href}
                  className={`group inline-flex items-center gap-3 bg-gradient-to-r ${spotlights[currentIndex].gradient} text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.a>
              </div>

              {/* Image Side */}
              <motion.div
                className="order-1 lg:order-2 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={spotlights[currentIndex].imageUrl}
                    alt={spotlights[currentIndex].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
                
                {/* Floating gradient accent */}
                <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${spotlights[currentIndex].gradient} rounded-full blur-2xl opacity-60`}></div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-16">
            {/* Previous/Next Buttons */}
            <div className="flex gap-4">
              <motion.button
                onClick={prevSlide}
                className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                onClick={nextSlide}
                className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Slide Indicators */}
            <div className="flex gap-3">
              {spotlights.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white' 
                      : 'bg-white/30 hover:bg-white/50'
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