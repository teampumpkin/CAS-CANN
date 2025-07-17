import { motion } from 'framer-motion';
import { MapPin, Users, Hospital, Search, Navigation, Phone, Mail, ExternalLink, Stethoscope, GraduationCap, Network, ArrowRight } from 'lucide-react';
import ParallaxBackground from '../components/ParallaxBackground';
import canadaMapPath from '@assets/Canada Map_1750069387234.png';
import healthcareProfessionalImg from '@assets/DSC02826_1750068895453.jpg';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Directory() {
  const { t } = useLanguage();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const provinces = [
    { name: 'British Columbia', code: 'BC', centers: 5, color: 'from-blue-500 to-cyan-500' },
    { name: 'Alberta', code: 'AB', centers: 3, color: 'from-green-500 to-emerald-500' },
    { name: 'Saskatchewan', code: 'SK', centers: 1, color: 'from-yellow-500 to-orange-500' },
    { name: 'Manitoba', code: 'MB', centers: 2, color: 'from-purple-500 to-violet-500' },
    { name: 'Ontario', code: 'ON', centers: 8, color: 'from-red-500 to-pink-500' },
    { name: 'Quebec', code: 'QC', centers: 4, color: 'from-indigo-500 to-blue-500' },
    { name: 'New Brunswick', code: 'NB', centers: 1, color: 'from-teal-500 to-cyan-500' },
    { name: 'Nova Scotia', code: 'NS', centers: 2, color: 'from-orange-500 to-red-500' },
    { name: 'Prince Edward Island', code: 'PE', centers: 1, color: 'from-pink-500 to-rose-500' },
    { name: 'Newfoundland and Labrador', code: 'NL', centers: 1, color: 'from-emerald-500 to-green-500' }
  ];

  const treatmentCenters = [
    {
      name: 'Toronto General Hospital',
      city: 'Toronto',
      province: 'ON',
      specialties: ['AL Amyloidosis', 'ATTR Amyloidosis', 'Cardiac Care'],
      contact: { phone: '(416) 340-4800', email: 'info@uhn.ca' },
      services: ['Diagnosis', 'Treatment', 'Follow-up Care']
    },
    {
      name: 'Vancouver General Hospital',
      city: 'Vancouver',
      province: 'BC',
      specialties: ['ATTR Amyloidosis', 'Neurological Care'],
      contact: { phone: '(604) 875-4111', email: 'info@vch.ca' },
      services: ['Diagnosis', 'Treatment', 'Research']
    },
    {
      name: 'Montreal Heart Institute',
      city: 'Montreal',
      province: 'QC',
      specialties: ['Cardiac Amyloidosis', 'AL Amyloidosis'],
      contact: { phone: '(514) 376-3330', email: 'info@icm-mhi.org' },
      services: ['Cardiac Specialty', 'Treatment', 'Monitoring']
    },
    {
      name: 'Foothills Medical Centre',
      city: 'Calgary',
      province: 'AB',
      specialties: ['AL Amyloidosis', 'Multi-organ Care'],
      contact: { phone: '(403) 944-1110', email: 'info@ahs.ca' },
      services: ['Diagnosis', 'Treatment', 'Support Services']
    }
  ];

  const registries = [
    {
      name: 'Canadian Registry for Amyloidosis Research (CRAP)',
      description: 'National registry collecting comprehensive data on amyloidosis patients for research advancement.',
      participants: '500+',
      established: '2018'
    },
    {
      name: 'Canadian Amyloidosis Patient Experience Registry (CAPER)',
      description: 'Patient-reported outcome registry focusing on quality of life and treatment experiences.',
      participants: '300+',
      established: '2020'
    }
  ];

  const filteredCenters = treatmentCenters.filter(center =>
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <ParallaxBackground className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00AFE6]/20 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00DD89]/20 rounded-full blur-3xl translate-x-48 translate-y-48" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <motion.div
                className="inline-block mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
                  <MapPin className="w-4 h-4 text-[#00AFE6]" />
                  <span className="text-sm font-medium text-white/90">{t('directory.hero.badge')}</span>
                </div>
              </motion.div>
              
              <motion.h1
                className="text-5xl lg:text-7xl font-bold font-rosarivo mb-8 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                  {t('directory.hero.title.find')}
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  {t('directory.hero.title.support')}
                </span>
                <br />
                <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                  {t('directory.hero.title.nearYou')}
                </span>
              </motion.h1>
              
              <motion.p
                className="text-xl text-white/70 leading-relaxed mb-10 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {t('directory.hero.description')}
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <button className="group bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-full font-medium hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 flex items-center gap-2">
                  Explore Map
                  <Navigation className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-full font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
                  Browse Centers
                </button>
              </motion.div>
            </motion.div>
            
            {/* Hero Visual - Interactive Map Preview */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#00AFE6]" />
                    Treatment Centers Across Canada
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white">28+</div>
                      <div className="text-sm text-white/70">Treatment Centers</div>
                    </div>
                    <div className="bg-gradient-to-r from-[#00DD89]/20 to-[#00AFE6]/20 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white">10</div>
                      <div className="text-sm text-white/70">Provinces</div>
                    </div>
                  </div>
                </div>
                
                {/* Simplified Map Visualization */}
                <div className="bg-white/5 rounded-2xl p-6 relative overflow-hidden">
                  <div className="grid grid-cols-3 gap-2">
                    {provinces.slice(0, 9).map((province, index) => (
                      <motion.div
                        key={province.code}
                        className={`bg-gradient-to-r ${province.color} rounded-lg p-3 text-center cursor-pointer hover:scale-105 transition-transform`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-xs font-semibold text-white">{province.code}</div>
                        <div className="text-xs text-white/80">{province.centers}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Hospital className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </ParallaxBackground>

      {/* Interactive Map Section */}
      <section className="py-24 bg-gray-900 relative">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
              <Navigation className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-white/90">Geo-spatial Map</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Treatment Centers &
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Research Programs
              </span>
            </h2>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Map Area */}
            <div className="lg:col-span-2">
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 rounded-3xl" />
                
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-[#00AFE6]/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4 border border-[#00AFE6]/30">
                      <div className="w-2 h-2 bg-[#00AFE6] rounded-full animate-pulse" />
                      <span>National Network</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 font-rosarivo">
                      Treatment Centers & Research Programs
                    </h3>
                    <p className="text-white/70">Geographic visualization across Canada</p>
                  </div>
                  
                  <div className="relative w-full max-w-2xl mx-auto">
                    <img 
                      src={canadaMapPath}
                      alt="Canada Map showing healthcare network coverage"
                      className="w-full h-auto rounded-xl shadow-xl border border-white/10"
                    />
                    
                    {/* Network points with subtle animation */}
                    <motion.div
                      className="absolute top-[25%] left-[15%] w-3 h-3 bg-[#00AFE6] rounded-full shadow-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="absolute top-[35%] left-[25%] w-3 h-3 bg-[#00DD89] rounded-full shadow-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                    <motion.div
                      className="absolute top-[45%] left-[40%] w-3 h-3 bg-[#00AFE6] rounded-full shadow-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                    <motion.div
                      className="absolute top-[40%] left-[55%] w-4 h-4 bg-[#00DD89] rounded-full shadow-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                    />
                    <motion.div
                      className="absolute top-[30%] left-[70%] w-3 h-3 bg-[#00AFE6] rounded-full shadow-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    />
                    <motion.div
                      className="absolute top-[25%] left-[80%] w-3 h-3 bg-[#00DD89] rounded-full shadow-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
                    />
                    
                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-xl rounded-lg p-3 border border-white/20">
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#00AFE6] rounded-full" />
                          <span className="text-white/80">Treatment Centers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#00DD89] rounded-full" />
                          <span className="text-white/80">Research Programs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Province List */}
            <div className="space-y-4">
              <motion.div
                className="bg-gradient-to-br from-blue-900/25 to-indigo-900/25 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#00AFE6]" />
                  Provinces & Territories
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {provinces.map((province, index) => (
                    <motion.div
                      key={province.code}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      onClick={() => setSelectedProvince(province.code)}
                    >
                      <div>
                        <div className="font-medium text-white">{province.code}</div>
                        <div className="text-xs text-white/70">{province.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-[#00AFE6]">{province.centers}</div>
                        <div className="text-xs text-white/70">centers</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CANN Section */}
      <section className="py-24 bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Content Column - Left Side */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
                  <Network className="w-5 h-5 text-[#00AFE6]" />
                  <span className="text-sm font-medium text-white/90">Professional Network</span>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold font-rosarivo mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Canadian Amyloidosis
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                    Nursing Network
                  </span>
                </h2>
                
                <p className="text-lg text-white/70 leading-relaxed mb-8">
                  The field of amyloidosis has experienced tremendous growth in recent years. Within this multidisciplinary community, nurses play a vital role in enhancing the quality, accessibility, and coordination of healthcare services for amyloidosis patients.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                    <p className="text-white/70">Unite amyloidosis nurses across the country through professional development</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                    <p className="text-white/70">Knowledge translation and best practice sharing</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full mt-3 flex-shrink-0" />
                    <p className="text-white/70">Facilitate collaboration while supporting patients with amyloidosis</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-[#00AFE6]/10 to-[#00DD89]/10 border border-[#00AFE6]/20 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Join the Movement</h3>
                  <p className="text-white/80 mb-6">We invite you to join this exciting movement!</p>
                  <button className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-8 py-4 rounded-full font-medium hover:shadow-2xl hover:shadow-[#00AFE6]/25 transition-all duration-300 flex items-center gap-2">
                    Learn About CANN
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
              
              {/* Image Column - Right Side */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
                  <div className="aspect-[4/5] relative">
                    <img 
                      src={healthcareProfessionalImg} 
                      alt="Healthcare professional working in amyloidosis care"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Stats Overlay */}
                    <motion.div
                      className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl shadow-2xl"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      <div className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                          >
                            <div className="text-2xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                              50+
                            </div>
                            <div className="text-xs text-white/80">Nursing Professionals</div>
                          </motion.div>
                          
                          <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                          >
                            <div className="text-2xl font-bold bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent">
                              10
                            </div>
                            <div className="text-xs text-white/80">Provinces Connected</div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Floating accent elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-2xl flex items-center justify-center"
                    animate={{ 
                      y: [0, -8, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Stethoscope className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Treatment Centers Directory */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-rosarivo mb-8">Treatment Centers Directory</h2>
            
            {/* Search */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search centers, cities, or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#00AFE6] transition-colors"
                />
              </div>
            </div>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {filteredCenters.map((center, index) => (
              <motion.div
                key={center.name}
                className={`backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:shadow-2xl ${
                  index % 4 === 0 
                    ? 'bg-gradient-to-br from-blue-900/25 to-indigo-900/25 border-blue-400/30 hover:from-blue-800/35 hover:to-indigo-800/35 hover:border-blue-300/40 hover:shadow-blue-500/25'
                    : index % 4 === 1
                    ? 'bg-gradient-to-br from-emerald-900/25 to-green-900/25 border-emerald-400/30 hover:from-emerald-800/35 hover:to-green-800/35 hover:border-emerald-300/40 hover:shadow-emerald-500/25'
                    : index % 4 === 2
                    ? 'bg-gradient-to-br from-purple-900/25 to-violet-900/25 border-purple-400/30 hover:from-purple-800/35 hover:to-violet-800/35 hover:border-purple-300/40 hover:shadow-purple-500/25'
                    : 'bg-gradient-to-br from-pink-900/25 to-rose-900/25 border-pink-400/30 hover:from-pink-800/35 hover:to-rose-800/35 hover:border-pink-300/40 hover:shadow-pink-500/25'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Hospital className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{center.name}</h3>
                    <p className="text-white/70 text-sm">{center.city}, {center.province}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white/90 mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {center.specialties.map((specialty, idx) => (
                      <span key={idx} className="px-3 py-1 bg-[#00AFE6]/20 text-[#00AFE6] rounded-full text-xs">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white/90 mb-2">Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {center.services.map((service, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-xs">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-4 text-sm">
                  <a href={`tel:${center.contact.phone}`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <Phone className="w-4 h-4" />
                    {center.contact.phone}
                  </a>
                  <a href={`mailto:${center.contact.email}`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                    Contact
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Registries */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 mb-6">
              <Stethoscope className="w-5 h-5 text-[#00AFE6]" />
              <span className="text-sm font-medium text-white/90">Research Programs</span>
            </div>
            
            <h2 className="text-4xl font-bold font-rosarivo mb-6">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Canadian
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                Research Registries
              </span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {registries.map((registry, index) => (
              <motion.div
                key={registry.name}
                className={`backdrop-blur-xl rounded-3xl p-8 border transition-all duration-300 hover:shadow-2xl ${
                  index === 0 
                    ? 'bg-gradient-to-br from-green-900/25 to-emerald-900/25 border-green-400/30 hover:from-green-800/35 hover:to-emerald-800/35 hover:border-green-300/40 hover:shadow-green-500/25'
                    : 'bg-gradient-to-br from-purple-900/25 to-violet-900/25 border-purple-400/30 hover:from-purple-800/35 hover:to-violet-800/35 hover:border-purple-300/40 hover:shadow-purple-500/25'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-rosarivo">{registry.name}</h3>
                    <p className="text-white/70 text-sm">Est. {registry.established}</p>
                  </div>
                </div>
                
                <p className="text-white/80 leading-relaxed mb-6">{registry.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">{registry.participants}</div>
                    <div className="text-sm text-white/70">Participants</div>
                  </div>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                    Learn More
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}