import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Users, BookOpen, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FeaturedSpotlights() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const spotlights = [
    {
      category: 'Patient Story',
      icon: Heart,
      title: 'Sarah\'s Journey with AL Amyloidosis',
      description: 'From diagnosis to treatment, Sarah shares her experience navigating amyloidosis care in Canada and finding hope through our community.',
      image: '/images/patient-story-1.jpg',
      readTime: '5 min read',
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-50 to-rose-50'
    },
    {
      category: 'Research Update',
      icon: Lightbulb,
      title: 'Breakthrough in Early Detection Methods',
      description: 'Canadian researchers develop new biomarker testing that could revolutionize early amyloidosis diagnosis and improve patient outcomes.',
      image: '/images/research-update-1.jpg',
      readTime: '7 min read',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
    {
      category: 'Community',
      icon: Users,
      title: 'National Support Network Expansion',
      description: 'Our support group network now spans all provinces, connecting over 500 patients and families across Canada.',
      image: '/images/community-1.jpg',
      readTime: '4 min read',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      category: 'Education',
      icon: BookOpen,
      title: 'New Healthcare Provider Resources',
      description: 'Comprehensive diagnostic guidelines and treatment protocols now available to support healthcare professionals across Canada.',
      image: '/images/education-1.jpg',
      readTime: '6 min read',
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-50'
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % spotlights.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + spotlights.length) % spotlights.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

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
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
            <span className="text-white/90 font-medium tracking-wide">Featured Stories</span>
          </motion.div>

          <h2 className="crawford-section-title text-white mb-8">
            Community Spotlights
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Inspiring stories, breakthrough research, and community updates from across our amyloidosis network.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <div className="grid lg:grid-cols-12 gap-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                  {/* Content Side */}
                  <div className="lg:col-span-7 p-12 lg:p-16 flex items-center">
                    <div className="w-full">
                      <motion.div
                        className="flex items-center gap-3 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br ${spotlights[currentIndex].gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                          {(() => {
                            const Icon = spotlights[currentIndex].icon;
                            return <Icon className="w-6 h-6 text-white" />;
                          })()}
                        </div>
                        <div>
                          <span className="text-white/70 text-sm font-medium uppercase tracking-wide">
                            {spotlights[currentIndex].category}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                            <span className="text-white/60 text-sm">{spotlights[currentIndex].readTime}</span>
                          </div>
                        </div>
                      </motion.div>

                      <motion.h3
                        className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight font-cardo"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        {spotlights[currentIndex].title}
                      </motion.h3>

                      <motion.p
                        className="text-xl text-white/80 leading-relaxed mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        {spotlights[currentIndex].description}
                      </motion.p>

                      <motion.button
                        className="group inline-flex items-center gap-3 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold border border-white/20 hover:bg-white/30 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Read Full Story</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>

                  {/* Visual Side */}
                  <div className="lg:col-span-5 relative">
                    <div className={`h-full min-h-[400px] lg:min-h-[500px] bg-gradient-to-br ${spotlights[currentIndex].bgGradient} flex items-center justify-center`}>
                      <motion.div
                        className="text-center text-gray-500"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        <div className={`w-24 h-24 bg-gradient-to-br ${spotlights[currentIndex].gradient} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl`}>
                          {(() => {
                            const Icon = spotlights[currentIndex].icon;
                            return <Icon className="w-12 h-12 text-white" />;
                          })()}
                        </div>
                        <p className="text-sm font-medium">Image placeholder</p>
                        <p className="text-xs opacity-70">{spotlights[currentIndex].category}</p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-4">
              <button
                onClick={prevSlide}
                className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex items-center gap-2">
              {spotlights.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Counter */}
            <div className="text-white/60 text-sm font-medium">
              {String(currentIndex + 1).padStart(2, '0')} / {String(spotlights.length).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}