import { motion } from 'framer-motion';
import { MapPin, Phone, Globe, Users, Star } from 'lucide-react';
import canadaMapPath from '@assets/Canada Map_1750069387234.png';

export default function DirectoryPreviewSection() {
  const healthcareFacilities = [
    {
      id: 1,
      name: 'Toronto General Hospital',
      location: 'Toronto, ON',
      type: 'Specialized Clinic',
      rating: 4.8,
      services: ['AL Amyloidosis', 'Cardiac Care', 'Clinical Trials'],
      phone: '(416) 340-4800',
      href: '#facility-1'
    },
    {
      id: 2,
      name: 'Vancouver General Hospital',
      location: 'Vancouver, BC', 
      type: 'Research Center',
      rating: 4.7,
      services: ['TTR Amyloidosis', 'Genetic Testing', 'Family Counseling'],
      phone: '(604) 875-4111',
      href: '#facility-2'
    },
    {
      id: 3,
      name: 'Montreal Heart Institute',
      location: 'Montreal, QC',
      type: 'Cardiac Center',
      rating: 4.9,
      services: ['Cardiac Amyloidosis', 'Advanced Imaging', 'Treatment'],
      phone: '(514) 376-3330',
      href: '#facility-3'
    }
  ];

  return (
    <section className="relative py-32 lg:py-40 gradient-bg-light overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-80 h-80 bg-gradient-to-br from-blue-500/4 to-purple-500/4 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-green-500/4 to-cyan-500/4 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
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
            <MapPin className="w-4 h-4 text-[#00AFE6]" />
            <span className="text-gray-700 font-medium tracking-wide">Healthcare Directory</span>
          </motion.div>

          <motion.h2 
            className="crawford-section-title text-gray-900 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Find Specialized Care Across Canada
          </motion.h2>

          <motion.p 
            className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto crawford-body-text"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Connect with healthcare professionals and facilities across Canada that specialize in amyloidosis diagnosis, 
            treatment, and ongoing care management.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Canada Map */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="glass-card-strong rounded-3xl p-8">
              <img 
                src={canadaMapPath} 
                alt="Canada Healthcare Map" 
                className="w-full h-auto rounded-2xl"
              />
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2 crawford-heading">
                  Nationwide Coverage
                </h3>
                <p className="text-gray-700 text-sm crawford-body-text">
                  Specialized amyloidosis care available from coast to coast
                </p>
              </div>
            </div>
          </motion.div>

          {/* Healthcare Facilities List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 crawford-heading">Featured Healthcare Facilities</h3>
            
            {healthcareFacilities.map((facility, index) => (
              <motion.div
                key={facility.id}
                className="glass-card rounded-2xl p-6 hover-lift group"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {facility.name}
                    </h4>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-gray-600 text-sm">
                        <MapPin className="w-3 h-3" />
                        {facility.location}
                      </span>
                      <span className="bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                        {facility.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{facility.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {facility.services.map((service, serviceIndex) => (
                    <span 
                      key={serviceIndex}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <Phone className="w-3 h-3" />
                    {facility.phone}
                  </div>
                  <motion.a
                    href={facility.href}
                    className="inline-flex items-center gap-2 text-[#00AFE6] hover:text-[#0088CC] font-semibold text-sm transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.a>
                </div>
              </motion.div>
            ))}

            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="#full-directory"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Users className="w-5 h-5" />
                View Complete Directory
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}