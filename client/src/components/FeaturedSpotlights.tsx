import { motion } from 'framer-motion';
import { ArrowRight, Star, Award, Heart } from 'lucide-react';
import facilityImage1 from '@assets/DSC02826_1750068895453.jpg';
import facilityImage2 from '@assets/DSC02841_1750068895454.jpg';
import facilityImage3 from '@assets/DSC_0022_1750068812552.jpg';

export default function FeaturedSpotlights() {
  const spotlights = [
    {
      id: 1,
      title: 'Leading Research Excellence',
      description: 'Discover groundbreaking research initiatives that are advancing amyloidosis treatment and improving patient outcomes across Canada.',
      image: facilityImage1,
      category: 'Research',
      readTime: '5 min read',
      href: '#research-spotlight'
    },
    {
      id: 2,
      title: 'Patient Success Stories',
      description: 'Read inspiring stories from patients and families who have navigated their amyloidosis journey with strength and hope.',
      image: facilityImage2,
      category: 'Patient Stories',
      readTime: '4 min read',
      href: '#patient-stories'
    },
    {
      id: 3,
      title: 'Innovation in Treatment',
      description: 'Explore the latest treatment innovations and clinical breakthroughs that are transforming amyloidosis care.',
      image: facilityImage3,
      category: 'Innovation',
      readTime: '6 min read',
      href: '#innovation-spotlight'
    }
  ];

  return (
    <section className="relative py-32 lg:py-40 gradient-bg-light overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-80 h-80 bg-gradient-to-br from-blue-500/4 to-purple-500/4 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-green-500/4 to-cyan-500/4 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-r from-purple-500/3 to-pink-500/3 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Star className="w-4 h-4 text-[#00AFE6]" />
            <span className="text-gray-700 font-medium tracking-wide">Featured Stories</span>
          </motion.div>

          <motion.h2 
            className="crawford-section-title text-gray-900 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Featured Spotlights
          </motion.h2>

          <motion.p 
            className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto crawford-body-text"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Highlighting the latest research, inspiring patient journeys, and innovative treatments 
            that are making a difference in the amyloidosis community.
          </motion.p>
        </motion.div>

        {/* Spotlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {spotlights.map((spotlight, index) => (
            <motion.article
              key={spotlight.id}
              className="glass-card rounded-3xl overflow-hidden hover-lift group"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={spotlight.image} 
                  alt={spotlight.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-3 py-1 rounded-full text-xs font-medium">
                    {spotlight.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-colors duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Heart className="w-4 h-4" />
                  <span>{spotlight.readTime}</span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors crawford-heading">
                  {spotlight.title}
                </h3>
                
                <p className="text-gray-700 leading-relaxed mb-8 crawford-body-text">
                  {spotlight.description}
                </p>
                
                <motion.a
                  href={spotlight.href}
                  className="inline-flex items-center gap-2 text-[#00AFE6] hover:text-[#0088CC] font-semibold text-sm transition-colors group-hover:gap-3"
                  whileHover={{ x: 4 }}
                >
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="glass-card-strong rounded-3xl p-12 max-w-4xl mx-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-3xl flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-4 crawford-heading">
              Join Our Community
            </h3>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8 crawford-body-text">
              Connect with patients, families, and healthcare providers across Canada. 
              Together, we're building a stronger amyloidosis community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#join-community"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white font-semibold py-4 px-8 rounded-xl hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-5 h-5" />
                Join Community
              </motion.a>
              
              <motion.a
                href="#learn-more"
                className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold py-4 px-8 rounded-xl border-2 border-gray-200 hover:border-[#00AFE6] hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
                <ArrowRight className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}