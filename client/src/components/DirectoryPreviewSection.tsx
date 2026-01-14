import { motion } from 'framer-motion';
import { Search, FileText, Heart, Users, MapPin, Building2, Phone, Mail, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';
import InteractiveCanadaMap from './InteractiveCanadaMap';
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
      titleKey: "directory.features.treatmentCenters",
      descriptionKey: "directory.features.treatmentCentersDesc",
      gradient: "from-[#00AFE6] to-[#00DD89]"
    },
    {
      icon: Heart,
      titleKey: "directory.features.clinicalExperts",
      descriptionKey: "directory.features.clinicalExpertsDesc",
      gradient: "from-[#00DD89] to-[#00AFE6]"
    },
    {
      icon: Users,
      titleKey: "directory.features.supportNetworks",
      descriptionKey: "directory.features.supportNetworksDesc",
      gradient: "from-[#00AFE6] to-[#00DD89]"
    },
    {
      icon: FileText,
      titleKey: "directory.features.resourcesLibrary",
      descriptionKey: "directory.features.resourcesLibraryDesc",
      gradient: "from-[#00DD89] to-[#00AFE6]"
    }
  ];

  const quickStats = [
    { number: "1.2K+", labelKey: "directory.stats.activePatients", gradient: "from-[#00AFE6] to-[#00DD89]" },
    { number: "45+", labelKey: "directory.stats.researchStudies", gradient: "from-[#00DD89] to-[#00AFE6]" },
    { number: "8", labelKey: "directory.stats.clinicalTrials", gradient: "from-[#00AFE6] to-[#00DD89]" }
  ];

  return (
    <section className="py-6 bg-gradient-to-br from-[#00DD89]/4 via-gray-50 to-[#00AFE6]/4 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00DD89]/6 via-gray-50 to-[#00AFE6]/6 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#00AFE6]/15 rounded-full blur-3xl -translate-x-48 -translate-y-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00DD89]/15 rounded-full blur-3xl translate-x-48 translate-y-48" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#00AFE6]/20 text-gray-800 dark:text-white px-3 py-1 rounded-full text-xs font-medium mb-3 border border-[#00AFE6]/30">
            <MapPin className="w-3 h-3" />
            <span>{t('directory.badge')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 font-rosarivo">
            <span className="text-gray-900 dark:text-white">{t('directory.title.find')} </span>
            <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">{t('directory.title.specialized')}</span>
            <span className="text-gray-900 dark:text-white"> {t('directory.title.acrossCanada')}</span>
          </h2>
          <p className="text-sm text-gray-700 dark:text-white/70 max-w-xl mx-auto leading-relaxed">
            {t('directory.subtitle')}
          </p>
        </motion.div>

        

        {/* Canada Network Stats - Ultra Compact Layout */}
        <motion.div
          className="bg-gradient-to-br from-[#00AFE6]/5 to-[#00DD89]/5 dark:from-[#00AFE6]/10 dark:to-[#00DD89]/10 backdrop-blur-xl rounded-2xl p-4 border border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 mb-4 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center justify-items-center">
            {/* Interactive Map Visualization */}
            <div className="lg:col-span-3 relative w-full order-2 lg:order-1">
              <InteractiveCanadaMap 
                healthcareCenters={healthcareCenters}
                onCenterClick={handleCenterClick}
              />
            </div>

            {/* Enhanced Statistics Display */}
            <div className="lg:col-span-2 space-y-4 lg:space-y-6 w-full order-1 lg:order-2">
              <div>
                <motion.div
                  className="flex items-center gap-3 mb-4 lg:mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white font-rosarivo">{t('directory.networkReach')}</h3>
                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">{t('directory.networkReachDesc')}</p>
                  </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-2 lg:gap-4">
                  <motion.div
                    className="group relative overflow-hidden text-center p-3 lg:p-6 bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 dark:from-[#00AFE6]/15 dark:to-[#00DD89]/15 backdrop-blur-xl rounded-2xl lg:rounded-3xl border-2 border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:from-[#00AFE6]/15 hover:to-[#00DD89]/15 dark:hover:from-[#00AFE6]/20 dark:hover:to-[#00DD89]/20 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#00AFE6]/20 dark:hover:shadow-[#00AFE6]/15"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/5 to-[#00DD89]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="text-2xl lg:text-4xl font-black bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent mb-1 lg:mb-3 group-hover:scale-110 transition-transform duration-300">
                        150+
                      </div>
                      <div className="text-[#00AFE6] dark:text-[#00AFE6] text-xs lg:text-sm font-semibold tracking-wide">{t('directory.healthcareProviders')}</div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="group relative overflow-hidden text-center p-3 lg:p-6 bg-gradient-to-br from-[#00DD89]/10 to-[#00AFE6]/10 dark:from-[#00DD89]/15 dark:to-[#00AFE6]/15 backdrop-blur-xl rounded-2xl lg:rounded-3xl border-2 border-[#00DD89]/20 dark:border-[#00DD89]/30 hover:from-[#00DD89]/15 hover:to-[#00AFE6]/15 dark:hover:from-[#00DD89]/20 dark:hover:to-[#00AFE6]/20 hover:border-[#00DD89]/40 dark:hover:border-[#00DD89]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#00DD89]/20 dark:hover:shadow-[#00DD89]/15"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00DD89]/5 to-[#00AFE6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="text-2xl lg:text-4xl font-black bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent mb-1 lg:mb-3 group-hover:scale-110 transition-transform duration-300">
                        13
                      </div>
                      <div className="text-[#00DD89] dark:text-[#00DD89] text-xs lg:text-sm font-semibold tracking-wide">{t('directory.provincesAndTerritories')}</div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="group relative overflow-hidden text-center p-3 lg:p-6 bg-gradient-to-br from-[#00AFE6]/10 to-[#00DD89]/10 dark:from-[#00AFE6]/15 dark:to-[#00DD89]/15 backdrop-blur-xl rounded-2xl lg:rounded-3xl border-2 border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:from-[#00AFE6]/15 hover:to-[#00DD89]/15 dark:hover:from-[#00AFE6]/20 dark:hover:to-[#00DD89]/20 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#00AFE6]/20 dark:hover:shadow-[#00AFE6]/15"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00AFE6]/5 to-[#00DD89]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="text-2xl lg:text-4xl font-black bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent mb-1 lg:mb-3 group-hover:scale-110 transition-transform duration-300">
                        25+
                      </div>
                      <div className="text-[#00AFE6] dark:text-[#00AFE6] text-xs lg:text-sm font-semibold tracking-wide">{t('directory.majorCities')}</div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="group relative overflow-hidden text-center p-3 lg:p-6 bg-gradient-to-br from-[#00DD89]/10 to-[#00AFE6]/10 dark:from-[#00DD89]/15 dark:to-[#00AFE6]/15 backdrop-blur-xl rounded-2xl lg:rounded-3xl border-2 border-[#00DD89]/20 dark:border-[#00DD89]/30 hover:from-[#00DD89]/15 hover:to-[#00AFE6]/15 dark:hover:from-[#00DD89]/20 dark:hover:to-[#00AFE6]/20 hover:border-[#00DD89]/40 dark:hover:border-[#00DD89]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#00DD89]/20 dark:hover:shadow-[#00DD89]/15"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00DD89]/5 to-[#00AFE6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="text-2xl lg:text-4xl font-black bg-gradient-to-r from-[#00DD89] to-[#00AFE6] bg-clip-text text-transparent mb-1 lg:mb-3 group-hover:scale-110 transition-transform duration-300">
                        500+
                      </div>
                      <div className="text-[#00DD89] dark:text-[#00DD89] text-xs lg:text-sm font-semibold tracking-wide">{t('directory.resourcesAvailable')}</div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Enhanced Call to Action */}
              <motion.div
                className="pt-2 lg:pt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Link href="/directory">
                  <motion.button 
                    className="relative overflow-hidden w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl lg:rounded-3xl font-bold text-base lg:text-lg shadow-2xl hover:shadow-[#00AFE6]/30 transition-all duration-500 group"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00DD89] to-[#00AFE6] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex items-center justify-center gap-2 lg:gap-3">
                      <Search className="w-4 h-4 lg:w-5 lg:h-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="tracking-wide">{t('directory.browseDirectory')}</span>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Directory Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Main Directory Content */}
          <motion.div
            className="lg:col-span-2 bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-10 border border-[#00AFE6]/20 dark:border-[#00AFE6]/30 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 hover:shadow-lg hover:shadow-[#00AFE6]/20"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 mb-6 lg:mb-8">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-[#00AFE6] to-[#00DD89] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                <Search className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 font-rosarivo">
                  {t('directory.searchableDirectory')}
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-white/80 leading-relaxed">
                  {t('directory.searchableDescription')}
                </p>
              </div>
            </div>

            {/* Directory Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
              {directoryFeatures.map((feature, index) => (
                <motion.div
                  key={feature.titleKey}
                  className="group backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-[#00AFE6]/20 dark:border-[#00AFE6]/30 bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 hover:from-[#00AFE6]/20 hover:to-[#00DD89]/20 dark:hover:from-[#00AFE6]/25 dark:hover:to-[#00DD89]/25 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#00AFE6]/25 dark:hover:shadow-[#00AFE6]/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-3 lg:gap-4">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${feature.gradient} rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0`}>
                      <feature.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1 lg:mb-2 text-base lg:text-lg text-gray-900 dark:text-white">{t(feature.titleKey)}</h4>
                      <p className="text-xs lg:text-sm text-gray-700 dark:text-gray-300">{t(feature.descriptionKey)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/directory">
              <motion.button
                className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl lg:rounded-2xl font-semibold text-sm sm:text-base hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('directory.exploreDirectory')}
              </motion.button>
            </Link>
          </motion.div>

          {/* Quick Stats Sidebar */}
          <motion.div
            className="bg-gradient-to-br from-white/90 to-white/80 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-white/20"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center mb-4 lg:mb-8">
              <div className="inline-flex items-center gap-2 bg-[#00AFE6]/20 text-gray-800 dark:text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-2 lg:mb-4">
                <div className="w-2 h-2 bg-[#00AFE6] rounded-full animate-pulse" />
                <span>{t('directory.liveStats')}</span>
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white font-rosarivo">{t('directory.directoryInsights')}</h3>
            </div>

            <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-6">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.labelKey}
                  className="group text-center p-3 lg:p-6 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-[#00AFE6]/20 dark:border-[#00AFE6]/30 bg-gradient-to-br from-[#00AFE6]/15 to-[#00DD89]/15 dark:from-[#00AFE6]/20 dark:to-[#00DD89]/20 hover:from-[#00AFE6]/20 hover:to-[#00DD89]/20 dark:hover:from-[#00AFE6]/25 dark:hover:to-[#00DD89]/25 hover:border-[#00AFE6]/40 dark:hover:border-[#00AFE6]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#00AFE6]/25 dark:hover:shadow-[#00AFE6]/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`text-xl lg:text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1 lg:mb-2 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.number}
                  </div>
                  <div className="text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300">{t(stat.labelKey)}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {isModalOpen && selectedCenter && (
          <HealthcareCenterModal
            center={selectedCenter}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        )}
      </div>
    </section>
  );
}