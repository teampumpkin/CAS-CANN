import { motion } from 'framer-motion';
import { Search, FileText, Heart, Users, MapPin, Building2, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import canadaMapPath from '@assets/Canada Map_1750069387234.png';
import { useLanguage } from '@/contexts/LanguageContext';
import { healthcareCenters, HealthcareCenter } from '@/data/healthcareCenters';
import HealthcareCenterModal from './HealthcareCenterModal';


export default function DirectoryPreviewSection() {
  const { t } = useLanguage();
  const [selectedCenter, setSelectedCenter] = useState<HealthcareCenter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCenterClick = (center: HealthcareCenter) => {
    setSelectedCenter(center);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCenter(null);
  };
  const directoryFeatures = [
    {
      icon: Building2,
      title: "Treatment Centers",
      description: "Specialized amyloidosis treatment facilities across Canada",
      gradient: "from-[#00AFE6] to-[#0088CC]"
    },
    {
      icon: Heart,
      title: "Clinical Experts",
      description: "Leading physicians and healthcare professionals",
      gradient: "from-[#00DD89] to-[#00BB77]"
    },
    {
      icon: Users,
      title: "Support Networks",
      description: "Patient advocacy groups and community resources",
      gradient: "from-purple-500 to-purple-700"
    },
    {
      icon: FileText,
      title: "Resources Library",
      description: "Medical protocols and educational materials",
      gradient: "from-orange-500 to-orange-700"
    }
  ];

  const quickStats = [
    { number: "1.2K+", label: "Active Patients", gradient: "from-[#00AFE6] to-[#0088CC]" },
    { number: "45+", label: "Research Studies", gradient: "from-[#00DD89] to-[#00BB77]" },
    { number: "8", label: "Clinical Trials", gradient: "from-purple-500 to-purple-700" }
  ];

  return (
    <section className="py-8 bg-gradient-to-br from-[#00DD89]/4 via-gray-50 to-[#00AFE6]/4 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00DD89]/6 via-gray-50 to-[#00AFE6]/6 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#00AFE6]/15 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00DD89]/15 rounded-full blur-3xl translate-x-48 translate-y-48" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#00AFE6]/20 text-gray-800 dark:text-white px-3 py-1 rounded-full text-xs font-medium mb-3 border border-[#00AFE6]/30">
            <MapPin className="w-3 h-3" />
            <span>{t('directory.badge')}</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-3 font-rosarivo">
            <span className="text-gray-900 dark:text-white">{t('directory.title.find')} </span>
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">{t('directory.title.specialized')}</span>
            <span className="text-gray-900 dark:text-white"> Across Canada</span>
          </h2>
          <p className="text-sm text-gray-700 dark:text-white/70 max-w-xl mx-auto leading-relaxed">
            {t('directory.subtitle')}
          </p>
        </motion.div>

        {/* Canada Network Stats - Ultra Compact Layout */}
        <motion.div
          className="bg-gradient-to-br from-white/95 to-white/90 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-2xl p-4 border border-[#00AFE6]/20 dark:border-white/20 mb-4 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid lg:grid-cols-5 gap-4 items-center justify-items-center">
            {/* Map Visualization - Compact */}
            <div className="lg:col-span-3 relative w-full">
              <div className="text-center mb-3">
                <div className="inline-flex items-center gap-1 bg-[#00AFE6]/20 text-gray-800 dark:text-white px-2 py-1 rounded-full text-xs font-medium mb-2 border border-[#00AFE6]/30">
                  <div className="w-1 h-1 bg-[#00AFE6] rounded-full animate-pulse" />
                  <span>{t('directory.nationalNetwork')}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 font-rosarivo">
                  {t('directory.canadaWide')}
                </h3>
                <p className="text-gray-700 dark:text-white/70 text-xs">{t('directory.connectingHealthcare')}</p>
              </div>
              
              <div className="relative w-full max-w-2xl mx-auto">
                <img 
                  src={canadaMapPath}
                  alt="Canada Map showing healthcare network coverage"
                  className="w-full h-auto rounded-xl"
                />
                
                {/* Interactive Healthcare Centers */}
                {healthcareCenters.map((center, index) => (
                  <motion.button
                    key={center.id}
                    className="absolute cursor-pointer transition-all duration-300 z-10 group flex items-center justify-center"
                    style={{
                      left: `${center.coordinates.x}%`,
                      top: `${center.coordinates.y}%`,
                      width: '20px',
                      height: '20px',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: center.type === 'hospital' ? '#00AFE6' : 
                                     center.type === 'specialty' ? '#00DD89' :
                                     center.type === 'research' ? '#8B5CF6' : '#F59E0B',
                      borderRadius: '50%',
                      border: '3px solid white',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      boxShadow: [
                        '0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(0, 175, 230, 0.7)',
                        '0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 15px rgba(0, 175, 230, 0)',
                        '0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(0, 175, 230, 0)'
                      ]
                    }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      boxShadow: {
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.5
                      }
                    }}
                    onClick={() => handleCenterClick(center)}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 1.1 }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
                        <div className="font-semibold">{center.name}</div>
                        <div className="text-xs text-gray-300">{center.city}, {center.province}</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </motion.button>
                ))}
                
              </div>
              
              {/* Legend - Ultra Compact design */}
              <div className="mt-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 text-xs max-w-md mx-auto">
                <div className="font-semibold text-gray-900 dark:text-white mb-1 text-center text-xs">{t('map.legend.title')}</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[#00AFE6] rounded-full border border-white shadow-sm flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-xs">{t('map.legend.hospitals')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[#00DD89] rounded-full border border-white shadow-sm flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-xs">{t('map.legend.specialty')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full border border-white shadow-sm flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-xs">{t('map.legend.research')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full border border-white shadow-sm flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-xs">{t('map.legend.clinics')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Display - Ultra Compact Layout */}
            <div className="lg:col-span-2 space-y-4 w-full">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 font-rosarivo">{t('directory.networkReach')}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <motion.div
                    className="text-center p-3 bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-lg border border-gray-200 dark:border-white/10 hover:bg-white/95 dark:hover:bg-white/10 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#0088CC] bg-clip-text text-transparent mb-1">
                      150+
                    </div>
                    <div className="text-gray-700 dark:text-white/70 text-xs font-medium">{t('directory.healthcareProviders')}</div>
                  </motion.div>
                  
                  <motion.div
                    className="text-center p-3 bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-lg border border-gray-200 dark:border-white/10 hover:bg-white/95 dark:hover:bg-white/10 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-xl font-bold bg-gradient-to-r from-[#00DD89] to-[#00BB77] bg-clip-text text-transparent mb-1">
                      13
                    </div>
                    <div className="text-gray-700 dark:text-white/70 text-xs font-medium">{t('directory.provincesAndTerritories')}</div>
                  </motion.div>
                  
                  <motion.div
                    className="text-center p-3 bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-lg border border-gray-200 dark:border-white/10 hover:bg-white/95 dark:hover:bg-white/10 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent mb-1">
                      25+
                    </div>
                    <div className="text-gray-700 dark:text-white/70 text-xs font-medium">{t('directory.majorCities')}</div>
                  </motion.div>
                  
                  <motion.div
                    className="text-center p-3 bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-lg border border-gray-200 dark:border-white/10 hover:bg-white/95 dark:hover:bg-white/10 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent mb-1">
                      500+
                    </div>
                    <div className="text-gray-700 dark:text-white/70 text-xs font-medium">{t('directory.resourcesAvailable')}</div>
                  </motion.div>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="pt-2">
                <motion.button 
                  className="w-full bg-gradient-to-r from-[#00AFE6] to-[#0088CC] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Browse Directory</span>
                    <Search className="w-3 h-3" />
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Directory Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Directory Content */}
          <motion.div
            className="lg:col-span-2 bg-gradient-to-br from-white/90 to-white/80 dark:from-white/15 dark:to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-gray-200 dark:border-white/20"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-start gap-8 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00AFE6] to-[#0088CC] rounded-2xl flex items-center justify-center shadow-xl">
                <Search className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-rosarivo">
                  Searchable Healthcare Directory
                </h3>
                <p className="text-gray-700 dark:text-white/80 text-lg leading-relaxed mb-6">
                  Find specialized amyloidosis treatment centers, experienced physicians, and clinical experts across all Canadian provinces and territories.
                </p>
              </div>
            </div>

            {/* Directory Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {directoryFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="group bg-white/90 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30 transition-all duration-300 hover:bg-white/95 dark:hover:bg-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">{feature.title}</h4>
                      <p className="text-gray-700 dark:text-white/70 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Full Directory
            </motion.button>
          </motion.div>

          {/* Quick Stats Sidebar */}
          <motion.div
            className="bg-gradient-to-br from-white/90 to-white/80 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-white/20"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-[#00AFE6]/20 text-gray-800 dark:text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                <div className="w-2 h-2 bg-[#00AFE6] rounded-full animate-pulse" />
                <span>Live Stats</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-rosarivo">Directory Insights</h3>
            </div>

            <div className="space-y-6">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-4 bg-white/90 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 hover:bg-white/95 dark:hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-700 dark:text-white/70 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
              <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Need Help Finding Care?</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 dark:text-white/70 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>1-800-AMYLOID</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-white/70 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>directory@cas.ca</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Healthcare Center Modal */}
      <HealthcareCenterModal
        center={selectedCenter}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
}